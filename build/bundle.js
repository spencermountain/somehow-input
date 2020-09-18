
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function to_number(value) {
        return value === '' ? undefined : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.24.1' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev("SvelteDOMSetProperty", { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/Button.svelte generated by Svelte v3.24.1 */

    const file = "src/Button.svelte";

    function add_css() {
    	var style = element("style");
    	style.id = "svelte-gpjtnz-style";
    	style.textContent = ".button.svelte-gpjtnz{padding:0.5rem;margin-left:0.5rem;user-select:none;background-color:#2d85a8;font-family:'avenir next', avenir, sans-serif;background-color:#fdfffd;color:#69c;min-width:8rem;min-height:1.2rem;font-size:1.4rem;margin:0.5rem;padding:0.2rem;cursor:pointer;border:0;border-radius:3px;box-shadow:1px 1px 2px 0 rgba(0, 0, 0, 0.5);transition:box-shadow 100ms;border-bottom:2px solid #69c}.button.svelte-gpjtnz:hover{box-shadow:2px 2px 8px 0 rgba(0, 0, 0, 0.5);border-bottom:2px solid #69c;color:#cc8a66}.button.svelte-gpjtnz:focus{box-shadow:2px 2px 8px 0 rgba(0, 0, 0, 0.5);border-bottom:2px solid #69c;color:#cc8a66}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQnV0dG9uLnN2ZWx0ZSIsInNvdXJjZXMiOlsiQnV0dG9uLnN2ZWx0ZSJdLCJzb3VyY2VzQ29udGVudCI6WyI8c2NyaXB0PlxuICBleHBvcnQgbGV0IGxhYmVsID0gJydcbiAgZXhwb3J0IGxldCBjb2xvciA9ICcnXG4gIGV4cG9ydCBsZXQgb25DbGljayA9ICgpID0+IHt9XG48L3NjcmlwdD5cblxuPHN0eWxlPlxuICAuYnV0dG9uIHtcbiAgICBwYWRkaW5nOiAwLjVyZW07XG4gICAgbWFyZ2luLWxlZnQ6IDAuNXJlbTtcbiAgICB1c2VyLXNlbGVjdDogbm9uZTtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMmQ4NWE4O1xuICAgIGZvbnQtZmFtaWx5OiAnYXZlbmlyIG5leHQnLCBhdmVuaXIsIHNhbnMtc2VyaWY7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2ZkZmZmZDtcbiAgICBjb2xvcjogIzY5YztcbiAgICBtaW4td2lkdGg6IDhyZW07XG4gICAgbWluLWhlaWdodDogMS4ycmVtO1xuICAgIGZvbnQtc2l6ZTogMS40cmVtO1xuICAgIG1hcmdpbjogMC41cmVtO1xuICAgIHBhZGRpbmc6IDAuMnJlbTtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgYm9yZGVyOiAwO1xuICAgIGJvcmRlci1yYWRpdXM6IDNweDtcbiAgICBib3gtc2hhZG93OiAxcHggMXB4IDJweCAwIHJnYmEoMCwgMCwgMCwgMC41KTtcbiAgICB0cmFuc2l0aW9uOiBib3gtc2hhZG93IDEwMG1zO1xuICAgIGJvcmRlci1ib3R0b206IDJweCBzb2xpZCAjNjljO1xuICB9XG4gIC5idXR0b246aG92ZXIge1xuICAgIGJveC1zaGFkb3c6IDJweCAycHggOHB4IDAgcmdiYSgwLCAwLCAwLCAwLjUpO1xuICAgIGJvcmRlci1ib3R0b206IDJweCBzb2xpZCAjNjljO1xuICAgIGNvbG9yOiAjY2M4YTY2O1xuICB9XG4gIC5idXR0b246Zm9jdXMge1xuICAgIGJveC1zaGFkb3c6IDJweCAycHggOHB4IDAgcmdiYSgwLCAwLCAwLCAwLjUpO1xuICAgIGJvcmRlci1ib3R0b206IDJweCBzb2xpZCAjNjljO1xuICAgIGNvbG9yOiAjY2M4YTY2O1xuICB9XG48L3N0eWxlPlxuXG48ZGl2IGNsYXNzPVwiYnV0dG9uIGdyZXkgcG9pbnRlciB1bGxpZ2h0ZXIgYjMgd2hpdGVcIiBvbjpjbGljaz17b25DbGlja30gc3R5bGU9XCJcIj5cbiAge2xhYmVsfVxuPC9kaXY+XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBT0UsT0FBTyxjQUFDLENBQUMsQUFDUCxPQUFPLENBQUUsTUFBTSxDQUNmLFdBQVcsQ0FBRSxNQUFNLENBQ25CLFdBQVcsQ0FBRSxJQUFJLENBQ2pCLGdCQUFnQixDQUFFLE9BQU8sQ0FDekIsV0FBVyxDQUFFLGFBQWEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFVBQVUsQ0FDOUMsZ0JBQWdCLENBQUUsT0FBTyxDQUN6QixLQUFLLENBQUUsSUFBSSxDQUNYLFNBQVMsQ0FBRSxJQUFJLENBQ2YsVUFBVSxDQUFFLE1BQU0sQ0FDbEIsU0FBUyxDQUFFLE1BQU0sQ0FDakIsTUFBTSxDQUFFLE1BQU0sQ0FDZCxPQUFPLENBQUUsTUFBTSxDQUNmLE1BQU0sQ0FBRSxPQUFPLENBQ2YsTUFBTSxDQUFFLENBQUMsQ0FDVCxhQUFhLENBQUUsR0FBRyxDQUNsQixVQUFVLENBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQzVDLFVBQVUsQ0FBRSxVQUFVLENBQUMsS0FBSyxDQUM1QixhQUFhLENBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEFBQy9CLENBQUMsQUFDRCxxQkFBTyxNQUFNLEFBQUMsQ0FBQyxBQUNiLFVBQVUsQ0FBRSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FDNUMsYUFBYSxDQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUM3QixLQUFLLENBQUUsT0FBTyxBQUNoQixDQUFDLEFBQ0QscUJBQU8sTUFBTSxBQUFDLENBQUMsQUFDYixVQUFVLENBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQzVDLGFBQWEsQ0FBRSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FDN0IsS0FBSyxDQUFFLE9BQU8sQUFDaEIsQ0FBQyJ9 */";
    	append_dev(document.head, style);
    }

    function create_fragment(ctx) {
    	let div;
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*label*/ ctx[0]);
    			attr_dev(div, "class", "button grey pointer ullighter b3 white svelte-gpjtnz");
    			add_location(div, file, 39, 0, 876);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);

    			if (!mounted) {
    				dispose = listen_dev(
    					div,
    					"click",
    					function () {
    						if (is_function(/*onClick*/ ctx[1])) /*onClick*/ ctx[1].apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			if (dirty & /*label*/ 1) set_data_dev(t, /*label*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { label = "" } = $$props;
    	let { color = "" } = $$props;

    	let { onClick = () => {
    		
    	} } = $$props;

    	const writable_props = ["label", "color", "onClick"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Button> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Button", $$slots, []);

    	$$self.$$set = $$props => {
    		if ("label" in $$props) $$invalidate(0, label = $$props.label);
    		if ("color" in $$props) $$invalidate(2, color = $$props.color);
    		if ("onClick" in $$props) $$invalidate(1, onClick = $$props.onClick);
    	};

    	$$self.$capture_state = () => ({ label, color, onClick });

    	$$self.$inject_state = $$props => {
    		if ("label" in $$props) $$invalidate(0, label = $$props.label);
    		if ("color" in $$props) $$invalidate(2, color = $$props.color);
    		if ("onClick" in $$props) $$invalidate(1, onClick = $$props.onClick);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [label, onClick, color];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		if (!document.getElementById("svelte-gpjtnz-style")) add_css();
    		init(this, options, instance, create_fragment, safe_not_equal, { label: 0, color: 2, onClick: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get label() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onClick() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onClick(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Choice.svelte generated by Svelte v3.24.1 */

    const { window: window_1 } = globals;
    const file$1 = "src/Choice.svelte";

    function add_css$1() {
    	var style = element("style");
    	style.id = "svelte-1v58s7d-style";
    	style.textContent = ".container.svelte-1v58s7d.svelte-1v58s7d{display:flex;flex-direction:column;justify-content:space-around;align-items:center;text-align:center;flex-wrap:nowrap}.slider.svelte-1v58s7d.svelte-1v58s7d{width:80%;left:10%}.main-row.svelte-1v58s7d.svelte-1v58s7d{display:flex;justify-content:space-around;align-items:center;text-align:center;flex-wrap:nowrap;align-self:stretch;position:relative;user-select:none;margin:1rem;-moz-user-select:none;color:#50617a}.main-row.svelte-1v58s7d span.svelte-1v58s7d{display:block;font-size:1.3em;width:10rem;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',\n      'Helvetica Neue', sans-serif;font-variant-numeric:tabular-nums;text-shadow:0 0 12px white, 0 0 12px white, 0 0 12px white, 0 0 12px white, 0 0 12px white, 0 0 12px white;cursor:ew-resize}.main-row.svelte-1v58s7d button[disabled].svelte-1v58s7d{opacity:0.2}.main-row.svelte-1v58s7d button.svelte-1v58s7d{background:none;border:none;font-size:1.2em;margin:0;padding:0 0.2em;cursor:pointer;color:#50617a}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2hvaWNlLnN2ZWx0ZSIsInNvdXJjZXMiOlsiQ2hvaWNlLnN2ZWx0ZSJdLCJzb3VyY2VzQ29udGVudCI6WyI8c2NyaXB0PlxuICBleHBvcnQgbGV0IGhhc1NsaWRlciA9IGZhbHNlXG4gIGV4cG9ydCBsZXQgaGFzS2V5Ym9hcmQgPSB0cnVlXG5cbiAgZXhwb3J0IGxldCBjaG9pY2UgPSBudWxsXG4gIGV4cG9ydCBsZXQgY2hvaWNlcyA9IFtdXG4gIGxldCBpbmRleCA9IGNob2ljZXMuZmluZEluZGV4KGEgPT4gYSA9PT0gY2hvaWNlKVxuICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgaW5kZXggPSAwXG4gIH1cbiAgbGV0IG1heCA9IGNob2ljZXMubGVuZ3RoIC0gMVxuICBsZXQgbWluID0gMFxuXG4gIGNvbnN0IGhhbmRsZV9wb2ludGVyZG93biA9IGUgPT4ge1xuICAgIGlmICghZS5pc1ByaW1hcnkpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBjb25zdCBzdGFydF94ID0gZS5jbGllbnRYXG4gICAgY29uc3Qgc3RhcnRfdmFsdWUgPSBpbmRleFxuICAgIGNvbnN0IGhhbmRsZV9wb2ludGVybW92ZSA9IGUyID0+IHtcbiAgICAgIGlmICghZTIuaXNQcmltYXJ5KSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgY29uc3QgZCA9IGUyLmNsaWVudFggLSBzdGFydF94XG4gICAgICBjb25zdCBzdGVwID0gNVxuICAgICAgY29uc3QgbiA9IE1hdGgucm91bmQoZCAvIHN0ZXApXG4gICAgICBpbmRleCA9IE1hdGgubWF4KG1pbiwgTWF0aC5taW4obWF4LCBzdGFydF92YWx1ZSArIE1hdGgucm91bmQobiAqIDAuMSkgKiAxKSlcbiAgICB9XG4gICAgY29uc3QgaGFuZGxlX3BvaW50ZXJ1cCA9IGUzID0+IHtcbiAgICAgIGlmICghZTMuaXNQcmltYXJ5KSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJtb3ZlJywgaGFuZGxlX3BvaW50ZXJtb3ZlKVxuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJ1cCcsIGhhbmRsZV9wb2ludGVydXApXG4gICAgfVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVybW92ZScsIGhhbmRsZV9wb2ludGVybW92ZSlcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcnVwJywgaGFuZGxlX3BvaW50ZXJ1cClcbiAgfVxuXG4gIGZ1bmN0aW9uIG1pbnVzKCkge1xuICAgIGluZGV4IC09IDFcbiAgICBpZiAoaW5kZXggPCAwKSB7XG4gICAgICBpbmRleCA9IDBcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gcGx1cygpIHtcbiAgICBpbmRleCArPSAxXG4gICAgaWYgKGluZGV4ID4gbWF4KSB7XG4gICAgICBpbmRleCA9IG1heFxuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBoYW5kbGVLZXlkb3duKGV2ZW50KSB7XG4gICAgaWYgKGhhc0tleWJvYXJkKSB7XG4gICAgICBpZiAoZXZlbnQua2V5ID09PSAnQXJyb3dMZWZ0Jykge1xuICAgICAgICBtaW51cygpXG4gICAgICB9XG4gICAgICBpZiAoZXZlbnQua2V5ID09PSAnQXJyb3dSaWdodCcpIHtcbiAgICAgICAgcGx1cygpXG4gICAgICB9XG4gICAgfVxuICB9XG48L3NjcmlwdD5cblxuPHN0eWxlPlxuICAuY29udGFpbmVyIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgZmxleC13cmFwOiBub3dyYXA7XG4gICAgLyogbWF4LXdpZHRoOiAyMHJlbTsgKi9cbiAgfVxuICAuc2xpZGVyIHtcbiAgICB3aWR0aDogODAlO1xuICAgIGxlZnQ6IDEwJTtcbiAgfVxuICAubWFpbi1yb3cge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgZmxleC13cmFwOiBub3dyYXA7XG4gICAgYWxpZ24tc2VsZjogc3RyZXRjaDtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgbWFyZ2luOiAxcmVtO1xuICAgIC1tb3otdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgY29sb3I6ICM1MDYxN2E7XG4gIH1cbiAgLm1haW4tcm93IHNwYW4ge1xuICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgIGZvbnQtc2l6ZTogMS4zZW07XG4gICAgd2lkdGg6IDEwcmVtO1xuICAgIGZvbnQtZmFtaWx5OiAtYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsICdTZWdvZSBVSScsIFJvYm90bywgT3h5Z2VuLCBVYnVudHUsIENhbnRhcmVsbCwgJ09wZW4gU2FucycsXG4gICAgICAnSGVsdmV0aWNhIE5ldWUnLCBzYW5zLXNlcmlmO1xuICAgIGZvbnQtdmFyaWFudC1udW1lcmljOiB0YWJ1bGFyLW51bXM7XG4gICAgdGV4dC1zaGFkb3c6IDAgMCAxMnB4IHdoaXRlLCAwIDAgMTJweCB3aGl0ZSwgMCAwIDEycHggd2hpdGUsIDAgMCAxMnB4IHdoaXRlLCAwIDAgMTJweCB3aGl0ZSwgMCAwIDEycHggd2hpdGU7XG4gICAgY3Vyc29yOiBldy1yZXNpemU7XG4gIH1cbiAgLm1haW4tcm93IGJ1dHRvbltkaXNhYmxlZF0ge1xuICAgIG9wYWNpdHk6IDAuMjtcbiAgfVxuICAubWFpbi1yb3cgYnV0dG9uIHtcbiAgICBiYWNrZ3JvdW5kOiBub25lO1xuICAgIGJvcmRlcjogbm9uZTtcbiAgICBmb250LXNpemU6IDEuMmVtO1xuICAgIG1hcmdpbjogMDtcbiAgICBwYWRkaW5nOiAwIDAuMmVtO1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBjb2xvcjogIzUwNjE3YTtcbiAgfVxuPC9zdHlsZT5cblxuPHN2ZWx0ZTp3aW5kb3cgb246a2V5ZG93bj17aGFuZGxlS2V5ZG93bn0gLz5cbjxkaXYgY2xhc3M9XCJjb250YWluZXJcIj5cbiAgPGRpdiBjbGFzcz1cIm1haW4tcm93XCI+XG4gICAgPGJ1dHRvbiBkaXNhYmxlZD17aW5kZXggPT09IDB9IG9uOmNsaWNrPXttaW51c30+JmxhcnI7PC9idXR0b24+XG4gICAgPHNwYW4gb246cG9pbnRlcmRvd249e2hhbmRsZV9wb2ludGVyZG93bn0+e2Nob2ljZXNbaW5kZXhdfTwvc3Bhbj5cbiAgICA8YnV0dG9uIGRpc2FibGVkPXtpbmRleCA9PT0gY2hvaWNlcy5sZW5ndGggLSAxfSBvbjpjbGljaz17cGx1c30+JnJhcnI7PC9idXR0b24+XG4gIDwvZGl2PlxuICB7I2lmIGhhc1NsaWRlcn1cbiAgICA8aW5wdXQgY2xhc3M9XCJzbGlkZXJcIiB0eXBlPVwicmFuZ2VcIiBiaW5kOnZhbHVlPXtpbmRleH0gbWluPXswfSB7bWF4fSAvPlxuICB7L2lmfVxuPC9kaXY+XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBZ0VFLFVBQVUsOEJBQUMsQ0FBQyxBQUNWLE9BQU8sQ0FBRSxJQUFJLENBQ2IsY0FBYyxDQUFFLE1BQU0sQ0FDdEIsZUFBZSxDQUFFLFlBQVksQ0FDN0IsV0FBVyxDQUFFLE1BQU0sQ0FDbkIsVUFBVSxDQUFFLE1BQU0sQ0FDbEIsU0FBUyxDQUFFLE1BQU0sQUFFbkIsQ0FBQyxBQUNELE9BQU8sOEJBQUMsQ0FBQyxBQUNQLEtBQUssQ0FBRSxHQUFHLENBQ1YsSUFBSSxDQUFFLEdBQUcsQUFDWCxDQUFDLEFBQ0QsU0FBUyw4QkFBQyxDQUFDLEFBQ1QsT0FBTyxDQUFFLElBQUksQ0FDYixlQUFlLENBQUUsWUFBWSxDQUM3QixXQUFXLENBQUUsTUFBTSxDQUNuQixVQUFVLENBQUUsTUFBTSxDQUNsQixTQUFTLENBQUUsTUFBTSxDQUNqQixVQUFVLENBQUUsT0FBTyxDQUNuQixRQUFRLENBQUUsUUFBUSxDQUNsQixXQUFXLENBQUUsSUFBSSxDQUNqQixNQUFNLENBQUUsSUFBSSxDQUNaLGdCQUFnQixDQUFFLElBQUksQ0FDdEIsS0FBSyxDQUFFLE9BQU8sQUFDaEIsQ0FBQyxBQUNELHdCQUFTLENBQUMsSUFBSSxlQUFDLENBQUMsQUFDZCxPQUFPLENBQUUsS0FBSyxDQUNkLFNBQVMsQ0FBRSxLQUFLLENBQ2hCLEtBQUssQ0FBRSxLQUFLLENBQ1osV0FBVyxDQUFFLGFBQWEsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsV0FBVyxDQUFDO01BQ3pHLGdCQUFnQixDQUFDLENBQUMsVUFBVSxDQUM5QixvQkFBb0IsQ0FBRSxZQUFZLENBQ2xDLFdBQVcsQ0FBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQzNHLE1BQU0sQ0FBRSxTQUFTLEFBQ25CLENBQUMsQUFDRCx3QkFBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsZUFBQyxDQUFDLEFBQzFCLE9BQU8sQ0FBRSxHQUFHLEFBQ2QsQ0FBQyxBQUNELHdCQUFTLENBQUMsTUFBTSxlQUFDLENBQUMsQUFDaEIsVUFBVSxDQUFFLElBQUksQ0FDaEIsTUFBTSxDQUFFLElBQUksQ0FDWixTQUFTLENBQUUsS0FBSyxDQUNoQixNQUFNLENBQUUsQ0FBQyxDQUNULE9BQU8sQ0FBRSxDQUFDLENBQUMsS0FBSyxDQUNoQixNQUFNLENBQUUsT0FBTyxDQUNmLEtBQUssQ0FBRSxPQUFPLEFBQ2hCLENBQUMifQ== */";
    	append_dev(document.head, style);
    }

    // (122:2) {#if hasSlider}
    function create_if_block(ctx) {
    	let input;
    	let input_min_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "class", "slider svelte-1v58s7d");
    			attr_dev(input, "type", "range");
    			attr_dev(input, "min", input_min_value = 0);
    			attr_dev(input, "max", /*max*/ ctx[3]);
    			add_location(input, file$1, 122, 4, 2919);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*index*/ ctx[2]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "change", /*input_change_input_handler*/ ctx[10]),
    					listen_dev(input, "input", /*input_change_input_handler*/ ctx[10])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*index*/ 4) {
    				set_input_value(input, /*index*/ ctx[2]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(122:2) {#if hasSlider}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div1;
    	let div0;
    	let button0;
    	let t0;
    	let button0_disabled_value;
    	let t1;
    	let span;
    	let t2_value = /*choices*/ ctx[1][/*index*/ ctx[2]] + "";
    	let t2;
    	let t3;
    	let button1;
    	let t4;
    	let button1_disabled_value;
    	let t5;
    	let mounted;
    	let dispose;
    	let if_block = /*hasSlider*/ ctx[0] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			button0 = element("button");
    			t0 = text("←");
    			t1 = space();
    			span = element("span");
    			t2 = text(t2_value);
    			t3 = space();
    			button1 = element("button");
    			t4 = text("→");
    			t5 = space();
    			if (if_block) if_block.c();
    			button0.disabled = button0_disabled_value = /*index*/ ctx[2] === 0;
    			attr_dev(button0, "class", "svelte-1v58s7d");
    			add_location(button0, file$1, 117, 4, 2670);
    			attr_dev(span, "class", "svelte-1v58s7d");
    			add_location(span, file$1, 118, 4, 2738);
    			button1.disabled = button1_disabled_value = /*index*/ ctx[2] === /*choices*/ ctx[1].length - 1;
    			attr_dev(button1, "class", "svelte-1v58s7d");
    			add_location(button1, file$1, 119, 4, 2808);
    			attr_dev(div0, "class", "main-row svelte-1v58s7d");
    			add_location(div0, file$1, 116, 2, 2643);
    			attr_dev(div1, "class", "container svelte-1v58s7d");
    			add_location(div1, file$1, 115, 0, 2617);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, button0);
    			append_dev(button0, t0);
    			append_dev(div0, t1);
    			append_dev(div0, span);
    			append_dev(span, t2);
    			append_dev(div0, t3);
    			append_dev(div0, button1);
    			append_dev(button1, t4);
    			append_dev(div1, t5);
    			if (if_block) if_block.m(div1, null);

    			if (!mounted) {
    				dispose = [
    					listen_dev(window_1, "keydown", /*handleKeydown*/ ctx[7], false, false, false),
    					listen_dev(button0, "click", /*minus*/ ctx[5], false, false, false),
    					listen_dev(span, "pointerdown", /*handle_pointerdown*/ ctx[4], false, false, false),
    					listen_dev(button1, "click", /*plus*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*index*/ 4 && button0_disabled_value !== (button0_disabled_value = /*index*/ ctx[2] === 0)) {
    				prop_dev(button0, "disabled", button0_disabled_value);
    			}

    			if (dirty & /*choices, index*/ 6 && t2_value !== (t2_value = /*choices*/ ctx[1][/*index*/ ctx[2]] + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*index, choices*/ 6 && button1_disabled_value !== (button1_disabled_value = /*index*/ ctx[2] === /*choices*/ ctx[1].length - 1)) {
    				prop_dev(button1, "disabled", button1_disabled_value);
    			}

    			if (/*hasSlider*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(div1, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { hasSlider = false } = $$props;
    	let { hasKeyboard = true } = $$props;
    	let { choice = null } = $$props;
    	let { choices = [] } = $$props;
    	let index = choices.findIndex(a => a === choice);

    	if (index === -1) {
    		index = 0;
    	}

    	let max = choices.length - 1;
    	let min = 0;

    	const handle_pointerdown = e => {
    		if (!e.isPrimary) {
    			return;
    		}

    		const start_x = e.clientX;
    		const start_value = index;

    		const handle_pointermove = e2 => {
    			if (!e2.isPrimary) {
    				return;
    			}

    			const d = e2.clientX - start_x;
    			const step = 5;
    			const n = Math.round(d / step);
    			$$invalidate(2, index = Math.max(min, Math.min(max, start_value + Math.round(n * 0.1) * 1)));
    		};

    		const handle_pointerup = e3 => {
    			if (!e3.isPrimary) {
    				return;
    			}

    			window.removeEventListener("pointermove", handle_pointermove);
    			window.removeEventListener("pointerup", handle_pointerup);
    		};

    		window.addEventListener("pointermove", handle_pointermove);
    		window.addEventListener("pointerup", handle_pointerup);
    	};

    	function minus() {
    		$$invalidate(2, index -= 1);

    		if (index < 0) {
    			$$invalidate(2, index = 0);
    		}
    	}

    	function plus() {
    		$$invalidate(2, index += 1);

    		if (index > max) {
    			$$invalidate(2, index = max);
    		}
    	}

    	function handleKeydown(event) {
    		if (hasKeyboard) {
    			if (event.key === "ArrowLeft") {
    				minus();
    			}

    			if (event.key === "ArrowRight") {
    				plus();
    			}
    		}
    	}

    	const writable_props = ["hasSlider", "hasKeyboard", "choice", "choices"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Choice> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Choice", $$slots, []);

    	function input_change_input_handler() {
    		index = to_number(this.value);
    		$$invalidate(2, index);
    	}

    	$$self.$$set = $$props => {
    		if ("hasSlider" in $$props) $$invalidate(0, hasSlider = $$props.hasSlider);
    		if ("hasKeyboard" in $$props) $$invalidate(8, hasKeyboard = $$props.hasKeyboard);
    		if ("choice" in $$props) $$invalidate(9, choice = $$props.choice);
    		if ("choices" in $$props) $$invalidate(1, choices = $$props.choices);
    	};

    	$$self.$capture_state = () => ({
    		hasSlider,
    		hasKeyboard,
    		choice,
    		choices,
    		index,
    		max,
    		min,
    		handle_pointerdown,
    		minus,
    		plus,
    		handleKeydown
    	});

    	$$self.$inject_state = $$props => {
    		if ("hasSlider" in $$props) $$invalidate(0, hasSlider = $$props.hasSlider);
    		if ("hasKeyboard" in $$props) $$invalidate(8, hasKeyboard = $$props.hasKeyboard);
    		if ("choice" in $$props) $$invalidate(9, choice = $$props.choice);
    		if ("choices" in $$props) $$invalidate(1, choices = $$props.choices);
    		if ("index" in $$props) $$invalidate(2, index = $$props.index);
    		if ("max" in $$props) $$invalidate(3, max = $$props.max);
    		if ("min" in $$props) min = $$props.min;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		hasSlider,
    		choices,
    		index,
    		max,
    		handle_pointerdown,
    		minus,
    		plus,
    		handleKeydown,
    		hasKeyboard,
    		choice,
    		input_change_input_handler
    	];
    }

    class Choice extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		if (!document.getElementById("svelte-1v58s7d-style")) add_css$1();

    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
    			hasSlider: 0,
    			hasKeyboard: 8,
    			choice: 9,
    			choices: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Choice",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get hasSlider() {
    		throw new Error("<Choice>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hasSlider(value) {
    		throw new Error("<Choice>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hasKeyboard() {
    		throw new Error("<Choice>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hasKeyboard(value) {
    		throw new Error("<Choice>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get choice() {
    		throw new Error("<Choice>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set choice(value) {
    		throw new Error("<Choice>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get choices() {
    		throw new Error("<Choice>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set choices(value) {
    		throw new Error("<Choice>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Number.svelte generated by Svelte v3.24.1 */

    const { window: window_1$1 } = globals;
    const file$2 = "src/Number.svelte";

    function add_css$2() {
    	var style = element("style");
    	style.id = "svelte-cjvbnq-style";
    	style.textContent = ".main-row.svelte-cjvbnq.svelte-cjvbnq{display:flex;position:relative;user-select:none;margin:1rem;-moz-user-select:none;color:#50617a}.main-row.svelte-cjvbnq span.svelte-cjvbnq{display:block;font-size:2em;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',\n      'Helvetica Neue', sans-serif;font-variant-numeric:tabular-nums;text-shadow:0 0 12px white, 0 0 12px white, 0 0 12px white, 0 0 12px white, 0 0 12px white, 0 0 12px white;cursor:ew-resize}.main-row.svelte-cjvbnq button[disabled].svelte-cjvbnq{opacity:0.2}.main-row.svelte-cjvbnq button.svelte-cjvbnq{background:none;border:none;font-size:2em;margin:0;padding:0 0.2em;cursor:pointer;color:#50617a}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTnVtYmVyLnN2ZWx0ZSIsInNvdXJjZXMiOlsiTnVtYmVyLnN2ZWx0ZSJdLCJzb3VyY2VzQ29udGVudCI6WyI8c2NyaXB0PlxuICBleHBvcnQgbGV0IGhhc1NsaWRlciA9IHRydWVcbiAgZXhwb3J0IGxldCBoYXNLZXlib2FyZCA9IHRydWVcblxuICBleHBvcnQgbGV0IG51bWJlciA9IDBcbiAgZXhwb3J0IGxldCBtaW4gPSAwXG4gIGV4cG9ydCBsZXQgbWF4ID0gMTAwXG4gIG51bWJlciA9IE51bWJlcihudW1iZXIpXG4gIG1pbiA9IE51bWJlcihtaW4pXG4gIG1heCA9IE51bWJlcihtYXgpXG5cbiAgY29uc3QgaGFuZGxlX3BvaW50ZXJkb3duID0gZSA9PiB7XG4gICAgaWYgKCFlLmlzUHJpbWFyeSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGNvbnN0IHN0YXJ0X3ggPSBlLmNsaWVudFhcbiAgICBjb25zdCBzdGFydF92YWx1ZSA9IE51bWJlcihudW1iZXIpXG4gICAgY29uc3QgaGFuZGxlX3BvaW50ZXJtb3ZlID0gZTIgPT4ge1xuICAgICAgaWYgKCFlMi5pc1ByaW1hcnkpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBjb25zdCBkID0gZTIuY2xpZW50WCAtIHN0YXJ0X3hcbiAgICAgIGNvbnN0IHN0ZXAgPSBNYXRoLm1pbihcbiAgICAgICAgMSxcbiAgICAgICAgZCA+IDAgPyAod2luZG93LmlubmVyV2lkdGggLSBzdGFydF94KSAvIChtYXggLSBzdGFydF92YWx1ZSkgOiBzdGFydF94IC8gKHN0YXJ0X3ZhbHVlIC0gbWluKVxuICAgICAgKVxuICAgICAgY29uc3QgbiA9IE1hdGgucm91bmQoZCAvIHN0ZXApXG4gICAgICBudW1iZXIgPSBNYXRoLm1heChtaW4sIE1hdGgubWluKG1heCwgc3RhcnRfdmFsdWUgKyBNYXRoLnJvdW5kKG4gKiAwLjEpICogMSkpXG4gICAgfVxuICAgIGNvbnN0IGhhbmRsZV9wb2ludGVydXAgPSBlMyA9PiB7XG4gICAgICBpZiAoIWUzLmlzUHJpbWFyeSkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdwb2ludGVybW92ZScsIGhhbmRsZV9wb2ludGVybW92ZSlcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdwb2ludGVydXAnLCBoYW5kbGVfcG9pbnRlcnVwKVxuICAgIH1cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcm1vdmUnLCBoYW5kbGVfcG9pbnRlcm1vdmUpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJ1cCcsIGhhbmRsZV9wb2ludGVydXApXG4gIH1cblxuICBmdW5jdGlvbiBtaW51cygpIHtcbiAgICBudW1iZXIgLT0gMVxuICAgIGlmIChudW1iZXIgPCBtaW4pIHtcbiAgICAgIG51bWJlciA9IG1pblxuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBwbHVzKCkge1xuICAgIG51bWJlciArPSAxXG4gICAgaWYgKG51bWJlciA+IG1heCkge1xuICAgICAgbnVtYmVyID0gbWF4XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIGhhbmRsZUtleWRvd24oZXZlbnQpIHtcbiAgICBpZiAoaGFzS2V5Ym9hcmQpIHtcbiAgICAgIGlmIChldmVudC5rZXkgPT09ICdBcnJvd0xlZnQnKSB7XG4gICAgICAgIG1pbnVzKClcbiAgICAgIH1cbiAgICAgIGlmIChldmVudC5rZXkgPT09ICdBcnJvd1JpZ2h0Jykge1xuICAgICAgICBwbHVzKClcbiAgICAgIH1cbiAgICB9XG4gIH1cbjwvc2NyaXB0PlxuXG48c3R5bGU+XG4gIC5tYWluLXJvdyB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgbWFyZ2luOiAxcmVtO1xuICAgIC1tb3otdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgY29sb3I6ICM1MDYxN2E7XG4gIH1cbiAgLm1haW4tcm93IHNwYW4ge1xuICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgIGZvbnQtc2l6ZTogMmVtO1xuICAgIGZvbnQtZmFtaWx5OiAtYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsICdTZWdvZSBVSScsIFJvYm90bywgT3h5Z2VuLCBVYnVudHUsIENhbnRhcmVsbCwgJ09wZW4gU2FucycsXG4gICAgICAnSGVsdmV0aWNhIE5ldWUnLCBzYW5zLXNlcmlmO1xuICAgIGZvbnQtdmFyaWFudC1udW1lcmljOiB0YWJ1bGFyLW51bXM7XG4gICAgdGV4dC1zaGFkb3c6IDAgMCAxMnB4IHdoaXRlLCAwIDAgMTJweCB3aGl0ZSwgMCAwIDEycHggd2hpdGUsIDAgMCAxMnB4IHdoaXRlLCAwIDAgMTJweCB3aGl0ZSwgMCAwIDEycHggd2hpdGU7XG4gICAgY3Vyc29yOiBldy1yZXNpemU7XG4gIH1cbiAgLm1haW4tcm93IGJ1dHRvbltkaXNhYmxlZF0ge1xuICAgIG9wYWNpdHk6IDAuMjtcbiAgfVxuICAubWFpbi1yb3cgYnV0dG9uIHtcbiAgICBiYWNrZ3JvdW5kOiBub25lO1xuICAgIGJvcmRlcjogbm9uZTtcbiAgICBmb250LXNpemU6IDJlbTtcbiAgICBtYXJnaW46IDA7XG4gICAgcGFkZGluZzogMCAwLjJlbTtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgY29sb3I6ICM1MDYxN2E7XG4gIH1cbjwvc3R5bGU+XG5cbjxzdmVsdGU6d2luZG93IG9uOmtleWRvd249e2hhbmRsZUtleWRvd259IC8+XG48ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+XG4gIDxkaXYgY2xhc3M9XCJtYWluLXJvd1wiPlxuICAgIDxidXR0b24gZGlzYWJsZWQ9e051bWJlcihudW1iZXIpID09PSBOdW1iZXIobWluKX0gb246Y2xpY2s9e21pbnVzfT4mbGFycjs8L2J1dHRvbj5cbiAgICA8c3BhbiBvbjpwb2ludGVyZG93bj17aGFuZGxlX3BvaW50ZXJkb3dufT57bnVtYmVyfTwvc3Bhbj5cbiAgICA8YnV0dG9uIGRpc2FibGVkPXtOdW1iZXIobnVtYmVyKSA9PT0gTnVtYmVyKG1heCl9IG9uOmNsaWNrPXtwbHVzfT4mcmFycjs8L2J1dHRvbj5cbiAgPC9kaXY+XG4gIHsjaWYgaGFzU2xpZGVyfVxuICAgIDxpbnB1dCB0eXBlPVwicmFuZ2VcIiBiaW5kOnZhbHVlPXtudW1iZXJ9IHttaW59IHttYXh9IC8+XG4gIHsvaWZ9XG48L2Rpdj5cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFpRUUsU0FBUyw0QkFBQyxDQUFDLEFBQ1QsT0FBTyxDQUFFLElBQUksQ0FDYixRQUFRLENBQUUsUUFBUSxDQUNsQixXQUFXLENBQUUsSUFBSSxDQUNqQixNQUFNLENBQUUsSUFBSSxDQUNaLGdCQUFnQixDQUFFLElBQUksQ0FDdEIsS0FBSyxDQUFFLE9BQU8sQUFDaEIsQ0FBQyxBQUNELHVCQUFTLENBQUMsSUFBSSxjQUFDLENBQUMsQUFDZCxPQUFPLENBQUUsS0FBSyxDQUNkLFNBQVMsQ0FBRSxHQUFHLENBQ2QsV0FBVyxDQUFFLGFBQWEsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsV0FBVyxDQUFDO01BQ3pHLGdCQUFnQixDQUFDLENBQUMsVUFBVSxDQUM5QixvQkFBb0IsQ0FBRSxZQUFZLENBQ2xDLFdBQVcsQ0FBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQzNHLE1BQU0sQ0FBRSxTQUFTLEFBQ25CLENBQUMsQUFDRCx1QkFBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsY0FBQyxDQUFDLEFBQzFCLE9BQU8sQ0FBRSxHQUFHLEFBQ2QsQ0FBQyxBQUNELHVCQUFTLENBQUMsTUFBTSxjQUFDLENBQUMsQUFDaEIsVUFBVSxDQUFFLElBQUksQ0FDaEIsTUFBTSxDQUFFLElBQUksQ0FDWixTQUFTLENBQUUsR0FBRyxDQUNkLE1BQU0sQ0FBRSxDQUFDLENBQ1QsT0FBTyxDQUFFLENBQUMsQ0FBQyxLQUFLLENBQ2hCLE1BQU0sQ0FBRSxPQUFPLENBQ2YsS0FBSyxDQUFFLE9BQU8sQUFDaEIsQ0FBQyJ9 */";
    	append_dev(document.head, style);
    }

    // (104:2) {#if hasSlider}
    function create_if_block$1(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "range");
    			attr_dev(input, "min", /*min*/ ctx[1]);
    			attr_dev(input, "max", /*max*/ ctx[2]);
    			add_location(input, file$2, 104, 4, 2621);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*number*/ ctx[0]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "change", /*input_change_input_handler*/ ctx[9]),
    					listen_dev(input, "input", /*input_change_input_handler*/ ctx[9])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*min*/ 2) {
    				attr_dev(input, "min", /*min*/ ctx[1]);
    			}

    			if (dirty & /*max*/ 4) {
    				attr_dev(input, "max", /*max*/ ctx[2]);
    			}

    			if (dirty & /*number*/ 1) {
    				set_input_value(input, /*number*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(104:2) {#if hasSlider}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div1;
    	let div0;
    	let button0;
    	let t0;
    	let button0_disabled_value;
    	let t1;
    	let span;
    	let t2;
    	let t3;
    	let button1;
    	let t4;
    	let button1_disabled_value;
    	let t5;
    	let mounted;
    	let dispose;
    	let if_block = /*hasSlider*/ ctx[3] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			button0 = element("button");
    			t0 = text("←");
    			t1 = space();
    			span = element("span");
    			t2 = text(/*number*/ ctx[0]);
    			t3 = space();
    			button1 = element("button");
    			t4 = text("→");
    			t5 = space();
    			if (if_block) if_block.c();
    			button0.disabled = button0_disabled_value = Number(/*number*/ ctx[0]) === Number(/*min*/ ctx[1]);
    			attr_dev(button0, "class", "svelte-cjvbnq");
    			add_location(button0, file$2, 99, 4, 2359);
    			attr_dev(span, "class", "svelte-cjvbnq");
    			add_location(span, file$2, 100, 4, 2446);
    			button1.disabled = button1_disabled_value = Number(/*number*/ ctx[0]) === Number(/*max*/ ctx[2]);
    			attr_dev(button1, "class", "svelte-cjvbnq");
    			add_location(button1, file$2, 101, 4, 2508);
    			attr_dev(div0, "class", "main-row svelte-cjvbnq");
    			add_location(div0, file$2, 98, 2, 2332);
    			attr_dev(div1, "class", "container");
    			add_location(div1, file$2, 97, 0, 2306);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, button0);
    			append_dev(button0, t0);
    			append_dev(div0, t1);
    			append_dev(div0, span);
    			append_dev(span, t2);
    			append_dev(div0, t3);
    			append_dev(div0, button1);
    			append_dev(button1, t4);
    			append_dev(div1, t5);
    			if (if_block) if_block.m(div1, null);

    			if (!mounted) {
    				dispose = [
    					listen_dev(window_1$1, "keydown", /*handleKeydown*/ ctx[7], false, false, false),
    					listen_dev(button0, "click", /*minus*/ ctx[5], false, false, false),
    					listen_dev(span, "pointerdown", /*handle_pointerdown*/ ctx[4], false, false, false),
    					listen_dev(button1, "click", /*plus*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*number, min*/ 3 && button0_disabled_value !== (button0_disabled_value = Number(/*number*/ ctx[0]) === Number(/*min*/ ctx[1]))) {
    				prop_dev(button0, "disabled", button0_disabled_value);
    			}

    			if (dirty & /*number*/ 1) set_data_dev(t2, /*number*/ ctx[0]);

    			if (dirty & /*number, max*/ 5 && button1_disabled_value !== (button1_disabled_value = Number(/*number*/ ctx[0]) === Number(/*max*/ ctx[2]))) {
    				prop_dev(button1, "disabled", button1_disabled_value);
    			}

    			if (/*hasSlider*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(div1, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { hasSlider = true } = $$props;
    	let { hasKeyboard = true } = $$props;
    	let { number = 0 } = $$props;
    	let { min = 0 } = $$props;
    	let { max = 100 } = $$props;
    	number = Number(number);
    	min = Number(min);
    	max = Number(max);

    	const handle_pointerdown = e => {
    		if (!e.isPrimary) {
    			return;
    		}

    		const start_x = e.clientX;
    		const start_value = Number(number);

    		const handle_pointermove = e2 => {
    			if (!e2.isPrimary) {
    				return;
    			}

    			const d = e2.clientX - start_x;

    			const step = Math.min(1, d > 0
    			? (window.innerWidth - start_x) / (max - start_value)
    			: start_x / (start_value - min));

    			const n = Math.round(d / step);
    			$$invalidate(0, number = Math.max(min, Math.min(max, start_value + Math.round(n * 0.1) * 1)));
    		};

    		const handle_pointerup = e3 => {
    			if (!e3.isPrimary) {
    				return;
    			}

    			window.removeEventListener("pointermove", handle_pointermove);
    			window.removeEventListener("pointerup", handle_pointerup);
    		};

    		window.addEventListener("pointermove", handle_pointermove);
    		window.addEventListener("pointerup", handle_pointerup);
    	};

    	function minus() {
    		$$invalidate(0, number -= 1);

    		if (number < min) {
    			$$invalidate(0, number = min);
    		}
    	}

    	function plus() {
    		$$invalidate(0, number += 1);

    		if (number > max) {
    			$$invalidate(0, number = max);
    		}
    	}

    	function handleKeydown(event) {
    		if (hasKeyboard) {
    			if (event.key === "ArrowLeft") {
    				minus();
    			}

    			if (event.key === "ArrowRight") {
    				plus();
    			}
    		}
    	}

    	const writable_props = ["hasSlider", "hasKeyboard", "number", "min", "max"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Number> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Number", $$slots, []);

    	function input_change_input_handler() {
    		number = to_number(this.value);
    		$$invalidate(0, number);
    	}

    	$$self.$$set = $$props => {
    		if ("hasSlider" in $$props) $$invalidate(3, hasSlider = $$props.hasSlider);
    		if ("hasKeyboard" in $$props) $$invalidate(8, hasKeyboard = $$props.hasKeyboard);
    		if ("number" in $$props) $$invalidate(0, number = $$props.number);
    		if ("min" in $$props) $$invalidate(1, min = $$props.min);
    		if ("max" in $$props) $$invalidate(2, max = $$props.max);
    	};

    	$$self.$capture_state = () => ({
    		hasSlider,
    		hasKeyboard,
    		number,
    		min,
    		max,
    		handle_pointerdown,
    		minus,
    		plus,
    		handleKeydown
    	});

    	$$self.$inject_state = $$props => {
    		if ("hasSlider" in $$props) $$invalidate(3, hasSlider = $$props.hasSlider);
    		if ("hasKeyboard" in $$props) $$invalidate(8, hasKeyboard = $$props.hasKeyboard);
    		if ("number" in $$props) $$invalidate(0, number = $$props.number);
    		if ("min" in $$props) $$invalidate(1, min = $$props.min);
    		if ("max" in $$props) $$invalidate(2, max = $$props.max);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		number,
    		min,
    		max,
    		hasSlider,
    		handle_pointerdown,
    		minus,
    		plus,
    		handleKeydown,
    		hasKeyboard,
    		input_change_input_handler
    	];
    }

    class Number_1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		if (!document.getElementById("svelte-cjvbnq-style")) add_css$2();

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			hasSlider: 3,
    			hasKeyboard: 8,
    			number: 0,
    			min: 1,
    			max: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Number_1",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get hasSlider() {
    		throw new Error("<Number>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hasSlider(value) {
    		throw new Error("<Number>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hasKeyboard() {
    		throw new Error("<Number>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hasKeyboard(value) {
    		throw new Error("<Number>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get number() {
    		throw new Error("<Number>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set number(value) {
    		throw new Error("<Number>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get min() {
    		throw new Error("<Number>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set min(value) {
    		throw new Error("<Number>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get max() {
    		throw new Error("<Number>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set max(value) {
    		throw new Error("<Number>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Tabs.svelte generated by Svelte v3.24.1 */

    const file$3 = "src/Tabs.svelte";

    function add_css$3() {
    	var style = element("style");
    	style.id = "svelte-22t9po-style";
    	style.textContent = ".row.svelte-22t9po{display:flex;flex-direction:row;justify-content:space-around;align-items:center;text-align:center;flex-wrap:wrap;align-self:stretch;font-size:1.2rem}.tab.svelte-22t9po{cursor:pointer;flex-grow:100;margin-left:4px;margin-right:4px;padding-left:4px;padding-right:4px;transition:all 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s;border-color:rgba(181, 187, 191, 0.1);border-bottom:3px solid rgba(181, 187, 191, 0.1);color:rgb(181, 187, 191)}.selected.svelte-22t9po{border-bottom:3px solid #2d85a8;color:#2d85a8}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGFicy5zdmVsdGUiLCJzb3VyY2VzIjpbIlRhYnMuc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQ+XG4gIGV4cG9ydCBsZXQgY2hvaWNlcyA9IFtdXG4gIGV4cG9ydCBsZXQgY2hvaWNlID0gbnVsbFxuICBsZXQgaW5kZXggPSBjaG9pY2VzLmZpbmRJbmRleCh0YWIgPT4gdGFiID09PSBjaG9pY2UpXG4gIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICBpbmRleCA9IDBcbiAgfVxuPC9zY3JpcHQ+XG5cbjxzdHlsZT5cbiAgLnJvdyB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgIGZsZXgtd3JhcDogd3JhcDtcbiAgICBhbGlnbi1zZWxmOiBzdHJldGNoO1xuICAgIGZvbnQtc2l6ZTogMS4ycmVtO1xuICB9XG4gIC50YWIge1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBmbGV4LWdyb3c6IDEwMDtcbiAgICBtYXJnaW4tbGVmdDogNHB4O1xuICAgIG1hcmdpbi1yaWdodDogNHB4O1xuICAgIHBhZGRpbmctbGVmdDogNHB4O1xuICAgIHBhZGRpbmctcmlnaHQ6IDRweDtcbiAgICB0cmFuc2l0aW9uOiBhbGwgMC4xcyBjdWJpYy1iZXppZXIoMC4yNSwgMC40NiwgMC40NSwgMC45NCkgMHM7XG4gICAgYm9yZGVyLWNvbG9yOiByZ2JhKDE4MSwgMTg3LCAxOTEsIDAuMSk7XG4gICAgYm9yZGVyLWJvdHRvbTogM3B4IHNvbGlkIHJnYmEoMTgxLCAxODcsIDE5MSwgMC4xKTtcbiAgICBjb2xvcjogcmdiKDE4MSwgMTg3LCAxOTEpO1xuICB9XG5cbiAgLnNlbGVjdGVkIHtcbiAgICBib3JkZXItYm90dG9tOiAzcHggc29saWQgIzJkODVhODtcbiAgICBjb2xvcjogIzJkODVhODtcbiAgfVxuPC9zdHlsZT5cblxuPGRpdiBjbGFzcz1cInJvd1wiPlxuICB7I2VhY2ggY2hvaWNlcyBhcyBjaG9pY2UsIGl9XG4gICAgPGRpdiBjbGFzcz1cInRhYlwiIGNsYXNzOnNlbGVjdGVkPXtpID09PSBpbmRleH0gb246Y2xpY2s9eygpID0+IChpbmRleCA9IGkpfT5cbiAgICAgIHtjaG9pY2V9XG4gICAgPC9kaXY+XG4gIHsvZWFjaH1cblxuPC9kaXY+XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBVUUsSUFBSSxjQUFDLENBQUMsQUFDSixPQUFPLENBQUUsSUFBSSxDQUNiLGNBQWMsQ0FBRSxHQUFHLENBQ25CLGVBQWUsQ0FBRSxZQUFZLENBQzdCLFdBQVcsQ0FBRSxNQUFNLENBQ25CLFVBQVUsQ0FBRSxNQUFNLENBQ2xCLFNBQVMsQ0FBRSxJQUFJLENBQ2YsVUFBVSxDQUFFLE9BQU8sQ0FDbkIsU0FBUyxDQUFFLE1BQU0sQUFDbkIsQ0FBQyxBQUNELElBQUksY0FBQyxDQUFDLEFBQ0osTUFBTSxDQUFFLE9BQU8sQ0FDZixTQUFTLENBQUUsR0FBRyxDQUNkLFdBQVcsQ0FBRSxHQUFHLENBQ2hCLFlBQVksQ0FBRSxHQUFHLENBQ2pCLFlBQVksQ0FBRSxHQUFHLENBQ2pCLGFBQWEsQ0FBRSxHQUFHLENBQ2xCLFVBQVUsQ0FBRSxHQUFHLENBQUMsSUFBSSxDQUFDLGFBQWEsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUM1RCxZQUFZLENBQUUsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FDdEMsYUFBYSxDQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FDakQsS0FBSyxDQUFFLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEFBQzNCLENBQUMsQUFFRCxTQUFTLGNBQUMsQ0FBQyxBQUNULGFBQWEsQ0FBRSxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FDaEMsS0FBSyxDQUFFLE9BQU8sQUFDaEIsQ0FBQyJ9 */";
    	append_dev(document.head, style);
    }

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	child_ctx[5] = i;
    	return child_ctx;
    }

    // (41:2) {#each choices as choice, i}
    function create_each_block(ctx) {
    	let div;
    	let t0_value = /*choice*/ ctx[1] + "";
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[3](/*i*/ ctx[5], ...args);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(div, "class", "tab svelte-22t9po");
    			toggle_class(div, "selected", /*i*/ ctx[5] === /*index*/ ctx[2]);
    			add_location(div, file$3, 41, 4, 868);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*choices*/ 1 && t0_value !== (t0_value = /*choice*/ ctx[1] + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*index*/ 4) {
    				toggle_class(div, "selected", /*i*/ ctx[5] === /*index*/ ctx[2]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(41:2) {#each choices as choice, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div;
    	let each_value = /*choices*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "row svelte-22t9po");
    			add_location(div, file$3, 39, 0, 815);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*index, choices*/ 5) {
    				each_value = /*choices*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { choices = [] } = $$props;
    	let { choice = null } = $$props;
    	let index = choices.findIndex(tab => tab === choice);

    	if (index === -1) {
    		index = 0;
    	}

    	const writable_props = ["choices", "choice"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Tabs> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Tabs", $$slots, []);
    	const click_handler = i => $$invalidate(2, index = i);

    	$$self.$$set = $$props => {
    		if ("choices" in $$props) $$invalidate(0, choices = $$props.choices);
    		if ("choice" in $$props) $$invalidate(1, choice = $$props.choice);
    	};

    	$$self.$capture_state = () => ({ choices, choice, index });

    	$$self.$inject_state = $$props => {
    		if ("choices" in $$props) $$invalidate(0, choices = $$props.choices);
    		if ("choice" in $$props) $$invalidate(1, choice = $$props.choice);
    		if ("index" in $$props) $$invalidate(2, index = $$props.index);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [choices, choice, index, click_handler];
    }

    class Tabs extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		if (!document.getElementById("svelte-22t9po-style")) add_css$3();
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { choices: 0, choice: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tabs",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get choices() {
    		throw new Error("<Tabs>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set choices(value) {
    		throw new Error("<Tabs>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get choice() {
    		throw new Error("<Tabs>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set choice(value) {
    		throw new Error("<Tabs>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Text.svelte generated by Svelte v3.24.1 */
    const file$4 = "src/Text.svelte";

    function add_css$4() {
    	var style = element("style");
    	style.id = "svelte-fx9i9q-style";
    	style.textContent = ".input.svelte-fx9i9q{font-family:'avenir next', avenir, sans-serif;display:block;padding:0.5rem 1rem 0.5rem 1rem;margin:0.3em 0.6em;width:80%;color:#a3a5a5;max-width:50rem;font-size:2rem;line-height:1rem;line-height:1.25;outline:0;border:0;border-radius:0.4rem;font-style:normal;box-shadow:0 0 2px 0 rgba(0, 0, 0, 0.5);transition:box-shadow 100ms}.input.svelte-fx9i9q:hover{box-shadow:1px 1px 4px 0 rgba(0, 0, 0, 0.2);color:#69c}.input.svelte-fx9i9q:focus{font-style:italic;box-shadow:2px 2px 6px 0 rgba(0, 0, 0, 0.5);color:#69c;border-bottom:2px solid steelblue}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGV4dC5zdmVsdGUiLCJzb3VyY2VzIjpbIlRleHQuc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQ+XG4gIGV4cG9ydCBsZXQgdGV4dCA9ICcnXG4gIGltcG9ydCB7IGNyZWF0ZUV2ZW50RGlzcGF0Y2hlciB9IGZyb20gJ3N2ZWx0ZSdcbiAgLy8gYm9pbGVycGxhdGUgcmVxdWlyZWQgdG8gcHJvZHVjZSBldmVudHNcbiAgY29uc3QgZGlzcGF0Y2ggPSBjcmVhdGVFdmVudERpc3BhdGNoZXIoKVxuICAvLyBtYWRlIHVwIGV2ZW50IGhhbmRsZXJcbiAgZnVuY3Rpb24gb25DaGFuZ2UoKSB7XG4gICAgLy8gZmlyZSBldmVudCBuYW1lZCAnbWVzc2FnZSdcbiAgICBkaXNwYXRjaCgnY2hhbmdlJywge30pXG4gIH1cbjwvc2NyaXB0PlxuXG48c3R5bGU+XG4gIC5pbnB1dCB7XG4gICAgZm9udC1mYW1pbHk6ICdhdmVuaXIgbmV4dCcsIGF2ZW5pciwgc2Fucy1zZXJpZjtcbiAgICBkaXNwbGF5OiBibG9jaztcbiAgICBwYWRkaW5nOiAwLjVyZW0gMXJlbSAwLjVyZW0gMXJlbTtcbiAgICBtYXJnaW46IDAuM2VtIDAuNmVtO1xuICAgIHdpZHRoOiA4MCU7XG4gICAgY29sb3I6ICNhM2E1YTU7XG4gICAgbWF4LXdpZHRoOiA1MHJlbTtcbiAgICBmb250LXNpemU6IDJyZW07XG4gICAgbGluZS1oZWlnaHQ6IDFyZW07XG4gICAgbGluZS1oZWlnaHQ6IDEuMjU7XG4gICAgb3V0bGluZTogMDtcbiAgICBib3JkZXI6IDA7XG4gICAgYm9yZGVyLXJhZGl1czogMC40cmVtO1xuICAgIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgICBib3gtc2hhZG93OiAwIDAgMnB4IDAgcmdiYSgwLCAwLCAwLCAwLjUpO1xuICAgIHRyYW5zaXRpb246IGJveC1zaGFkb3cgMTAwbXM7XG4gIH1cbiAgLmlucHV0OmhvdmVyIHtcbiAgICBib3gtc2hhZG93OiAxcHggMXB4IDRweCAwIHJnYmEoMCwgMCwgMCwgMC4yKTtcbiAgICBjb2xvcjogIzY5YztcbiAgfVxuICAuaW5wdXQ6Zm9jdXMge1xuICAgIGZvbnQtc3R5bGU6IGl0YWxpYztcbiAgICBib3gtc2hhZG93OiAycHggMnB4IDZweCAwIHJnYmEoMCwgMCwgMCwgMC41KTtcbiAgICBjb2xvcjogIzY5YztcbiAgICBib3JkZXItYm90dG9tOiAycHggc29saWQgc3RlZWxibHVlO1xuICB9XG48L3N0eWxlPlxuXG48aW5wdXQgY2xhc3M9XCJpbnB1dFwiIHN0eWxlPVwiXCIgdHlwZT1cInRleHRcIiBiaW5kOnZhbHVlPXt0ZXh0fSAvPlxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQWFFLE1BQU0sY0FBQyxDQUFDLEFBQ04sV0FBVyxDQUFFLGFBQWEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFVBQVUsQ0FDOUMsT0FBTyxDQUFFLEtBQUssQ0FDZCxPQUFPLENBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUNoQyxNQUFNLENBQUUsS0FBSyxDQUFDLEtBQUssQ0FDbkIsS0FBSyxDQUFFLEdBQUcsQ0FDVixLQUFLLENBQUUsT0FBTyxDQUNkLFNBQVMsQ0FBRSxLQUFLLENBQ2hCLFNBQVMsQ0FBRSxJQUFJLENBQ2YsV0FBVyxDQUFFLElBQUksQ0FDakIsV0FBVyxDQUFFLElBQUksQ0FDakIsT0FBTyxDQUFFLENBQUMsQ0FDVixNQUFNLENBQUUsQ0FBQyxDQUNULGFBQWEsQ0FBRSxNQUFNLENBQ3JCLFVBQVUsQ0FBRSxNQUFNLENBQ2xCLFVBQVUsQ0FBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FDeEMsVUFBVSxDQUFFLFVBQVUsQ0FBQyxLQUFLLEFBQzlCLENBQUMsQUFDRCxvQkFBTSxNQUFNLEFBQUMsQ0FBQyxBQUNaLFVBQVUsQ0FBRSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FDNUMsS0FBSyxDQUFFLElBQUksQUFDYixDQUFDLEFBQ0Qsb0JBQU0sTUFBTSxBQUFDLENBQUMsQUFDWixVQUFVLENBQUUsTUFBTSxDQUNsQixVQUFVLENBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQzVDLEtBQUssQ0FBRSxJQUFJLENBQ1gsYUFBYSxDQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsU0FBUyxBQUNwQyxDQUFDIn0= */";
    	append_dev(document.head, style);
    }

    function create_fragment$4(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "class", "input svelte-fx9i9q");
    			attr_dev(input, "type", "text");
    			add_location(input, file$4, 43, 0, 990);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*text*/ ctx[0]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[1]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*text*/ 1 && input.value !== /*text*/ ctx[0]) {
    				set_input_value(input, /*text*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { text = "" } = $$props;

    	// boilerplate required to produce events
    	const dispatch = createEventDispatcher();

    	// made up event handler
    	function onChange() {
    		// fire event named 'message'
    		dispatch("change", {});
    	}

    	const writable_props = ["text"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Text> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Text", $$slots, []);

    	function input_input_handler() {
    		text = this.value;
    		$$invalidate(0, text);
    	}

    	$$self.$$set = $$props => {
    		if ("text" in $$props) $$invalidate(0, text = $$props.text);
    	};

    	$$self.$capture_state = () => ({
    		text,
    		createEventDispatcher,
    		dispatch,
    		onChange
    	});

    	$$self.$inject_state = $$props => {
    		if ("text" in $$props) $$invalidate(0, text = $$props.text);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [text, input_input_handler];
    }

    class Text extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		if (!document.getElementById("svelte-fx9i9q-style")) add_css$4();
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { text: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Text",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get text() {
    		throw new Error("<Text>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Text>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Legend.svelte generated by Svelte v3.24.1 */

    const { Object: Object_1 } = globals;
    const file$5 = "src/Legend.svelte";

    function add_css$5() {
    	var style = element("style");
    	style.id = "svelte-fsdmvi-style";
    	style.textContent = ".row.svelte-fsdmvi{display:flex;flex-direction:row;justify-content:space-around;align-items:center;text-align:center;flex-wrap:wrap;align-self:stretch}.color.svelte-fsdmvi{width:25px;height:20px;margin:5px;border-radius:5px}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGVnZW5kLnN2ZWx0ZSIsInNvdXJjZXMiOlsiTGVnZW5kLnN2ZWx0ZSJdLCJzb3VyY2VzQ29udGVudCI6WyI8c2NyaXB0PlxuICBleHBvcnQgbGV0IGNvbG9ycyA9IHt9XG48L3NjcmlwdD5cblxuPHN0eWxlPlxuICAucm93IHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgZmxleC13cmFwOiB3cmFwO1xuICAgIGFsaWduLXNlbGY6IHN0cmV0Y2g7XG4gIH1cbiAgLmNvbG9yIHtcbiAgICB3aWR0aDogMjVweDtcbiAgICBoZWlnaHQ6IDIwcHg7XG4gICAgbWFyZ2luOiA1cHg7XG4gICAgYm9yZGVyLXJhZGl1czogNXB4O1xuICB9XG48L3N0eWxlPlxuXG48ZGl2IGNsYXNzPVwiXCI+XG4gIHsjZWFjaCBPYmplY3Qua2V5cyhjb2xvcnMpIGFzIGt9XG4gICAgPGRpdiBjbGFzcz1cInJvd1wiPlxuICAgICAgPGRpdiBjbGFzcz1cImNvbG9yXCIgc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOntrfTtcIiAvPlxuICAgICAgPGRpdiBjbGFzcz1cImxhYmVsXCI+e2NvbG9yc1trXX08L2Rpdj5cbiAgICA8L2Rpdj5cbiAgey9lYWNofVxuPC9kaXY+XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBS0UsSUFBSSxjQUFDLENBQUMsQUFDSixPQUFPLENBQUUsSUFBSSxDQUNiLGNBQWMsQ0FBRSxHQUFHLENBQ25CLGVBQWUsQ0FBRSxZQUFZLENBQzdCLFdBQVcsQ0FBRSxNQUFNLENBQ25CLFVBQVUsQ0FBRSxNQUFNLENBQ2xCLFNBQVMsQ0FBRSxJQUFJLENBQ2YsVUFBVSxDQUFFLE9BQU8sQUFDckIsQ0FBQyxBQUNELE1BQU0sY0FBQyxDQUFDLEFBQ04sS0FBSyxDQUFFLElBQUksQ0FDWCxNQUFNLENBQUUsSUFBSSxDQUNaLE1BQU0sQ0FBRSxHQUFHLENBQ1gsYUFBYSxDQUFFLEdBQUcsQUFDcEIsQ0FBQyJ9 */";
    	append_dev(document.head, style);
    }

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (24:2) {#each Object.keys(colors) as k}
    function create_each_block$1(ctx) {
    	let div2;
    	let div0;
    	let t0;
    	let div1;
    	let t1_value = /*colors*/ ctx[0][/*k*/ ctx[1]] + "";
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			t1 = text(t1_value);
    			t2 = space();
    			attr_dev(div0, "class", "color svelte-fsdmvi");
    			set_style(div0, "background-color", /*k*/ ctx[1]);
    			add_location(div0, file$5, 25, 6, 419);
    			attr_dev(div1, "class", "label");
    			add_location(div1, file$5, 26, 6, 477);
    			attr_dev(div2, "class", "row svelte-fsdmvi");
    			add_location(div2, file$5, 24, 4, 395);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, t1);
    			append_dev(div2, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*colors*/ 1) {
    				set_style(div0, "background-color", /*k*/ ctx[1]);
    			}

    			if (dirty & /*colors*/ 1 && t1_value !== (t1_value = /*colors*/ ctx[0][/*k*/ ctx[1]] + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(24:2) {#each Object.keys(colors) as k}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div;
    	let each_value = Object.keys(/*colors*/ ctx[0]);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "");
    			add_location(div, file$5, 22, 0, 341);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*colors, Object*/ 1) {
    				each_value = Object.keys(/*colors*/ ctx[0]);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { colors = {} } = $$props;
    	const writable_props = ["colors"];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Legend> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Legend", $$slots, []);

    	$$self.$$set = $$props => {
    		if ("colors" in $$props) $$invalidate(0, colors = $$props.colors);
    	};

    	$$self.$capture_state = () => ({ colors });

    	$$self.$inject_state = $$props => {
    		if ("colors" in $$props) $$invalidate(0, colors = $$props.colors);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [colors];
    }

    class Legend extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		if (!document.getElementById("svelte-fsdmvi-style")) add_css$5();
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { colors: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Legend",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get colors() {
    		throw new Error("<Legend>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set colors(value) {
    		throw new Error("<Legend>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/TextArea.svelte generated by Svelte v3.24.1 */
    const file$6 = "src/TextArea.svelte";

    function add_css$6() {
    	var style = element("style");
    	style.id = "svelte-o2fptp-style";
    	style.textContent = ".container.svelte-o2fptp{position:relative}.input.svelte-o2fptp{font-family:'avenir next', avenir, sans-serif;display:block;padding:1rem 1.5rem 1rem 0.5rem;margin:0.3em 0.6em 0.3rem 5px;width:80%;max-width:50rem;font-size:1.2rem;line-height:1.5;outline:0;border:0;border-radius:0.4rem;font-style:normal;box-shadow:1px 1px 4px 0 rgba(0, 0, 0, 0.2);transition:box-shadow 100ms;color:#c4cad5;resize:none;border-bottom:2px solid transparent;border-left:4px solid lightgrey}.input.svelte-o2fptp:hover{color:#a3a5a5;box-shadow:2px 1px 4px 0 rgba(0, 0, 0, 0.2);border-bottom:2px solid lightsteelblue}.input.svelte-o2fptp:focus{color:#577c97;box-shadow:2px 1px 5px 0 rgba(0, 0, 0, 0.2);border-bottom:2px solid lightsteelblue}.side.svelte-o2fptp{position:absolute;top:1rem;left:5px;width:4px;height:100%}.col.svelte-o2fptp{height:100%}.bar.svelte-o2fptp{height:1.8rem;width:4px;background-color:lightgrey;border-radius:2px}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGV4dEFyZWEuc3ZlbHRlIiwic291cmNlcyI6WyJUZXh0QXJlYS5zdmVsdGUiXSwic291cmNlc0NvbnRlbnQiOlsiPHNjcmlwdD5cbiAgaW1wb3J0IHsgb25Nb3VudCB9IGZyb20gJ3N2ZWx0ZSdcbiAgZXhwb3J0IGxldCB2YWx1ZSA9ICcnXG4gIGxldCBlbFxuXG4gIGV4cG9ydCBmdW5jdGlvbiB0ZXh0X2FyZWFfcmVzaXplKGVsKSB7XG4gICAgZnVuY3Rpb24gcmVzaXplKHsgdGFyZ2V0IH0pIHtcbiAgICAgIHRhcmdldC5zdHlsZS5oZWlnaHQgPSAnMXB4J1xuICAgICAgdGFyZ2V0LnN0eWxlLmhlaWdodCA9ICt0YXJnZXQuc2Nyb2xsSGVpZ2h0ICsgJ3B4J1xuICAgIH1cblxuICAgIHJlc2l6ZSh7IHRhcmdldDogZWwgfSlcbiAgICBlbC5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nXG4gICAgZWwuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCByZXNpemUpXG5cbiAgICByZXR1cm4ge1xuICAgICAgZGVzdHJveTogKCkgPT4gZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignaW5wdXQnLCByZXNpemUpXG4gICAgfVxuICB9XG5cbiAgb25Nb3VudCgoKSA9PiB7XG4gICAgdGV4dF9hcmVhX3Jlc2l6ZShlbClcbiAgfSlcblxuICBsZXQgYmFycyA9IFtcbiAgICAnJyxcbiAgICAnI0FCNTg1MCcsXG4gICAgJyM2YWNjYjInLFxuICAgICcnLFxuICAgICcnLFxuICAgICcjQUI1ODUwJyxcbiAgICAnIzZhY2NiMicsXG4gICAgJycsXG4gICAgJycsXG4gICAgJyNBQjU4NTAnLFxuICAgICcjNmFjY2IyJyxcbiAgICAnJyxcbiAgICAnJyxcbiAgICAnI0FCNTg1MCcsXG4gICAgJyM2YWNjYjInLFxuICAgICcnXG4gIF1cbjwvc2NyaXB0PlxuXG48c3R5bGU+XG4gIC5jb250YWluZXIge1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgfVxuICAuaW5wdXQge1xuICAgIGZvbnQtZmFtaWx5OiAnYXZlbmlyIG5leHQnLCBhdmVuaXIsIHNhbnMtc2VyaWY7XG4gICAgZGlzcGxheTogYmxvY2s7XG4gICAgcGFkZGluZzogMXJlbSAxLjVyZW0gMXJlbSAwLjVyZW07XG4gICAgbWFyZ2luOiAwLjNlbSAwLjZlbSAwLjNyZW0gNXB4O1xuICAgIHdpZHRoOiA4MCU7XG4gICAgbWF4LXdpZHRoOiA1MHJlbTtcbiAgICBmb250LXNpemU6IDEuMnJlbTtcbiAgICBsaW5lLWhlaWdodDogMS41O1xuICAgIG91dGxpbmU6IDA7XG4gICAgYm9yZGVyOiAwO1xuICAgIGJvcmRlci1yYWRpdXM6IDAuNHJlbTtcbiAgICBmb250LXN0eWxlOiBub3JtYWw7XG4gICAgLyogYm94LXNoYWRvdzogMCAwIDJweCAwIHJnYmEoMCwgMCwgMCwgMC41KTsgKi9cbiAgICBib3gtc2hhZG93OiAxcHggMXB4IDRweCAwIHJnYmEoMCwgMCwgMCwgMC4yKTtcbiAgICB0cmFuc2l0aW9uOiBib3gtc2hhZG93IDEwMG1zO1xuICAgIGNvbG9yOiAjYzRjYWQ1O1xuICAgIHJlc2l6ZTogbm9uZTtcbiAgICBib3JkZXItYm90dG9tOiAycHggc29saWQgdHJhbnNwYXJlbnQ7XG4gICAgYm9yZGVyLWxlZnQ6IDRweCBzb2xpZCBsaWdodGdyZXk7XG4gIH1cbiAgLmlucHV0OmhvdmVyIHtcbiAgICBjb2xvcjogI2EzYTVhNTtcbiAgICBib3gtc2hhZG93OiAycHggMXB4IDRweCAwIHJnYmEoMCwgMCwgMCwgMC4yKTtcbiAgICBib3JkZXItYm90dG9tOiAycHggc29saWQgbGlnaHRzdGVlbGJsdWU7XG4gICAgLyogY29sb3I6ICM2OWM7ICovXG4gIH1cbiAgLmlucHV0OmZvY3VzIHtcbiAgICBjb2xvcjogIzU3N2M5NztcbiAgICAvKiBmb250LXN0eWxlOiBpdGFsaWM7ICovXG4gICAgYm94LXNoYWRvdzogMnB4IDFweCA1cHggMCByZ2JhKDAsIDAsIDAsIDAuMik7XG4gICAgYm9yZGVyLWJvdHRvbTogMnB4IHNvbGlkIGxpZ2h0c3RlZWxibHVlO1xuICAgIC8qIGNvbG9yOiAjNjljOyAqL1xuICAgIC8qIGJvcmRlci1ib3R0b206IDJweCBzb2xpZCBzdGVlbGJsdWU7ICovXG4gIH1cbiAgLnNpZGUge1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICB0b3A6IDFyZW07XG4gICAgbGVmdDogNXB4O1xuICAgIHdpZHRoOiA0cHg7XG4gICAgaGVpZ2h0OiAxMDAlO1xuICAgIC8qIGJvcmRlcjogMXB4IHNvbGlkIGdyZXk7ICovXG4gIH1cbiAgLmNvbCB7XG4gICAgaGVpZ2h0OiAxMDAlO1xuICB9XG4gIC5iYXIge1xuICAgIGhlaWdodDogMS44cmVtO1xuICAgIHdpZHRoOiA0cHg7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogbGlnaHRncmV5O1xuICAgIGJvcmRlci1yYWRpdXM6IDJweDtcbiAgfVxuPC9zdHlsZT5cblxuPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPlxuICA8ZGl2IGNsYXNzPVwic2lkZVwiPlxuICAgIDxkaXYgY2xhc3M9XCJjb2xcIj5cbiAgICAgIHsjZWFjaCBiYXJzIGFzIGJhcn1cbiAgICAgICAgPGRpdiBjbGFzcz1cImJhclwiIHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjp7YmFyfTtcIiAvPlxuICAgICAgey9lYWNofVxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbiAgPHRleHRhcmVhXG4gICAgY2xhc3M9XCJpbnB1dFwiXG4gICAgc3BlbGxjaGVjaz1cImZhbHNlXCJcbiAgICB0eXBlPVwidGV4dFwiXG4gICAge3ZhbHVlfVxuICAgIGJpbmQ6dGhpcz17ZWx9IC8+XG48L2Rpdj5cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUE2Q0UsVUFBVSxjQUFDLENBQUMsQUFDVixRQUFRLENBQUUsUUFBUSxBQUNwQixDQUFDLEFBQ0QsTUFBTSxjQUFDLENBQUMsQUFDTixXQUFXLENBQUUsYUFBYSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsVUFBVSxDQUM5QyxPQUFPLENBQUUsS0FBSyxDQUNkLE9BQU8sQ0FBRSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQ2hDLE1BQU0sQ0FBRSxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQzlCLEtBQUssQ0FBRSxHQUFHLENBQ1YsU0FBUyxDQUFFLEtBQUssQ0FDaEIsU0FBUyxDQUFFLE1BQU0sQ0FDakIsV0FBVyxDQUFFLEdBQUcsQ0FDaEIsT0FBTyxDQUFFLENBQUMsQ0FDVixNQUFNLENBQUUsQ0FBQyxDQUNULGFBQWEsQ0FBRSxNQUFNLENBQ3JCLFVBQVUsQ0FBRSxNQUFNLENBRWxCLFVBQVUsQ0FBRSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FDNUMsVUFBVSxDQUFFLFVBQVUsQ0FBQyxLQUFLLENBQzVCLEtBQUssQ0FBRSxPQUFPLENBQ2QsTUFBTSxDQUFFLElBQUksQ0FDWixhQUFhLENBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQ3BDLFdBQVcsQ0FBRSxHQUFHLENBQUMsS0FBSyxDQUFDLFNBQVMsQUFDbEMsQ0FBQyxBQUNELG9CQUFNLE1BQU0sQUFBQyxDQUFDLEFBQ1osS0FBSyxDQUFFLE9BQU8sQ0FDZCxVQUFVLENBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQzVDLGFBQWEsQ0FBRSxHQUFHLENBQUMsS0FBSyxDQUFDLGNBQWMsQUFFekMsQ0FBQyxBQUNELG9CQUFNLE1BQU0sQUFBQyxDQUFDLEFBQ1osS0FBSyxDQUFFLE9BQU8sQ0FFZCxVQUFVLENBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQzVDLGFBQWEsQ0FBRSxHQUFHLENBQUMsS0FBSyxDQUFDLGNBQWMsQUFHekMsQ0FBQyxBQUNELEtBQUssY0FBQyxDQUFDLEFBQ0wsUUFBUSxDQUFFLFFBQVEsQ0FDbEIsR0FBRyxDQUFFLElBQUksQ0FDVCxJQUFJLENBQUUsR0FBRyxDQUNULEtBQUssQ0FBRSxHQUFHLENBQ1YsTUFBTSxDQUFFLElBQUksQUFFZCxDQUFDLEFBQ0QsSUFBSSxjQUFDLENBQUMsQUFDSixNQUFNLENBQUUsSUFBSSxBQUNkLENBQUMsQUFDRCxJQUFJLGNBQUMsQ0FBQyxBQUNKLE1BQU0sQ0FBRSxNQUFNLENBQ2QsS0FBSyxDQUFFLEdBQUcsQ0FDVixnQkFBZ0IsQ0FBRSxTQUFTLENBQzNCLGFBQWEsQ0FBRSxHQUFHLEFBQ3BCLENBQUMifQ== */";
    	append_dev(document.head, style);
    }

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    // (106:6) {#each bars as bar}
    function create_each_block$2(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "bar svelte-o2fptp");
    			set_style(div, "background-color", /*bar*/ ctx[5]);
    			add_location(div, file$6, 106, 8, 2108);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(106:6) {#each bars as bar}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div2;
    	let div1;
    	let div0;
    	let t;
    	let textarea;
    	let each_value = /*bars*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			textarea = element("textarea");
    			attr_dev(div0, "class", "col svelte-o2fptp");
    			add_location(div0, file$6, 104, 4, 2056);
    			attr_dev(div1, "class", "side svelte-o2fptp");
    			add_location(div1, file$6, 103, 2, 2033);
    			attr_dev(textarea, "class", "input svelte-o2fptp");
    			attr_dev(textarea, "spellcheck", "false");
    			attr_dev(textarea, "type", "text");
    			textarea.value = /*value*/ ctx[0];
    			add_location(textarea, file$6, 110, 2, 2196);
    			attr_dev(div2, "class", "container svelte-o2fptp");
    			add_location(div2, file$6, 102, 0, 2007);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			append_dev(div2, t);
    			append_dev(div2, textarea);
    			/*textarea_binding*/ ctx[4](textarea);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*bars*/ 4) {
    				each_value = /*bars*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*value*/ 1) {
    				prop_dev(textarea, "value", /*value*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_each(each_blocks, detaching);
    			/*textarea_binding*/ ctx[4](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function text_area_resize(el) {
    	function resize({ target }) {
    		target.style.height = "1px";
    		target.style.height = +target.scrollHeight + "px";
    	}

    	resize({ target: el });
    	el.style.overflow = "hidden";
    	el.addEventListener("input", resize);

    	return {
    		destroy: () => el.removeEventListener("input", resize)
    	};
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { value = "" } = $$props;
    	let el;

    	onMount(() => {
    		text_area_resize(el);
    	});

    	let bars = [
    		"",
    		"#AB5850",
    		"#6accb2",
    		"",
    		"",
    		"#AB5850",
    		"#6accb2",
    		"",
    		"",
    		"#AB5850",
    		"#6accb2",
    		"",
    		"",
    		"#AB5850",
    		"#6accb2",
    		""
    	];

    	const writable_props = ["value"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<TextArea> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("TextArea", $$slots, []);

    	function textarea_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			el = $$value;
    			$$invalidate(1, el);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		value,
    		el,
    		text_area_resize,
    		bars
    	});

    	$$self.$inject_state = $$props => {
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    		if ("el" in $$props) $$invalidate(1, el = $$props.el);
    		if ("bars" in $$props) $$invalidate(2, bars = $$props.bars);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [value, el, bars, text_area_resize, textarea_binding];
    }

    class TextArea extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		if (!document.getElementById("svelte-o2fptp-style")) add_css$6();
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { value: 0, text_area_resize: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TextArea",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get value() {
    		throw new Error("<TextArea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<TextArea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get text_area_resize() {
    		return text_area_resize;
    	}

    	set text_area_resize(value) {
    		throw new Error("<TextArea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function createCommonjsModule(fn, basedir, module) {
    	return module = {
    	  path: basedir,
    	  exports: {},
    	  require: function (path, base) {
          return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
        }
    	}, fn(module, module.exports), module.exports;
    }

    function commonjsRequire () {
    	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
    }

    var spencerColor = createCommonjsModule(function (module, exports) {
    !function(e){module.exports=e();}(function(){return function u(i,a,c){function f(r,e){if(!a[r]){if(!i[r]){var o="function"==typeof commonjsRequire&&commonjsRequire;if(!e&&o)return o(r,!0);if(d)return d(r,!0);var n=new Error("Cannot find module '"+r+"'");throw n.code="MODULE_NOT_FOUND",n}var t=a[r]={exports:{}};i[r][0].call(t.exports,function(e){return f(i[r][1][e]||e)},t,t.exports,u,i,a,c);}return a[r].exports}for(var d="function"==typeof commonjsRequire&&commonjsRequire,e=0;e<c.length;e++)f(c[e]);return f}({1:[function(e,r,o){r.exports={blue:"#6699cc",green:"#6accb2",yellow:"#e1e6b3",red:"#cc7066",pink:"#F2C0BB",brown:"#705E5C",orange:"#cc8a66",purple:"#d8b3e6",navy:"#335799",olive:"#7f9c6c",fuscia:"#735873",beige:"#e6d7b3",slate:"#8C8C88",suede:"#9c896c",burnt:"#603a39",sea:"#50617A",sky:"#2D85A8",night:"#303b50",rouge:"#914045",grey:"#838B91",mud:"#C4ABAB",royal:"#275291",cherry:"#cc6966",tulip:"#e6b3bc",rose:"#D68881",fire:"#AB5850",greyblue:"#72697D",greygreen:"#8BA3A2",greypurple:"#978BA3",burn:"#6D5685",slategrey:"#bfb0b3",light:"#a3a5a5",lighter:"#d7d5d2",fudge:"#4d4d4d",lightgrey:"#949a9e",white:"#fbfbfb",dimgrey:"#606c74",softblack:"#463D4F",dark:"#443d3d",black:"#333333"};},{}],2:[function(e,r,o){var n=e("./colors"),t={juno:["blue","mud","navy","slate","pink","burn"],barrow:["rouge","red","orange","burnt","brown","greygreen"],roma:["#8a849a","#b5b0bf","rose","lighter","greygreen","mud"],palmer:["red","navy","olive","pink","suede","sky"],mark:["#848f9a","#9aa4ac","slate","#b0b8bf","mud","grey"],salmon:["sky","sea","fuscia","slate","mud","fudge"],dupont:["green","brown","orange","red","olive","blue"],bloor:["night","navy","beige","rouge","mud","grey"],yukon:["mud","slate","brown","sky","beige","red"],david:["blue","green","yellow","red","pink","light"],neste:["mud","cherry","royal","rouge","greygreen","greypurple"],ken:["red","sky","#c67a53","greygreen","#dfb59f","mud"]};Object.keys(t).forEach(function(e){t[e]=t[e].map(function(e){return n[e]||e});}),r.exports=t;},{"./colors":1}],3:[function(e,r,o){var n=e("./colors"),t=e("./combos"),u={colors:n,list:Object.keys(n).map(function(e){return n[e]}),combos:t};r.exports=u;},{"./colors":1,"./combos":2}]},{},[3])(3)});
    });

    var teams = {
      atlantic: [
        { short: 'BOS', place: 'Boston', name: 'Boston Bruins', color: spencerColor.colors.brown },
        { short: 'BUF', place: 'Buffalo', name: 'Buffalo Sabres', color: spencerColor.colors.sea },
        { short: 'DET', place: 'Detroit', name: 'Detroit Red Wings', color: spencerColor.colors.red },
        {
          short: 'FLR',
          place: 'Florida',
          name: 'Florida Panthers',
          color: spencerColor.colors.cherry,
        },
        {
          short: 'MTL',
          place: 'Montreal',
          name: 'Montreal Canadiens',
          color: spencerColor.colors.rouge,
        },
        { short: 'OTT', place: 'Ottawa', name: 'Ottawa Senators', color: spencerColor.colors.cherry },
        {
          short: 'TMP',
          place: 'Tampa',
          name: 'Tampa Bay Lightning',
          color: spencerColor.colors.royal,
        },
        {
          short: 'TOR',
          place: 'Toronto',
          name: 'Toronto Maple Leafs',
          color: spencerColor.colors.blue,
        },
      ],
      metro: [
        {
          short: 'CAR',
          place: 'Carolina',
          name: 'Carolina Hurricanes',
          color: spencerColor.colors.fire,
        },
        {
          short: 'COL',
          place: 'Columbus',
          name: 'Columbus Blue Jackets',
          color: spencerColor.colors.navy,
        },
        {
          short: 'NJ',
          place: 'New Jersey',
          name: 'New Jersey Devils',
          color: spencerColor.colors.burnt,
        },
        {
          short: 'NYI',
          place: 'Long Island',
          name: 'New York Islanders',
          color: spencerColor.colors.orange,
        },
        {
          short: 'NYR',
          place: 'New York',
          name: 'New York Rangers',
          color: spencerColor.colors.rouge,
        },
        {
          short: 'PHL',
          place: 'Philadelphia',
          name: 'Philadelphia Flyers',
          color: spencerColor.colors.orange,
        },
        {
          short: 'PIT',
          place: 'Pittsburgh',
          name: 'Pittsburgh Penguins',
          color: spencerColor.colors.fudge,
        },
        {
          short: 'WSH',
          place: 'Washington',
          name: 'Washington Capitals',
          color: spencerColor.colors.cherry,
        },
      ],
      central: [
        { short: 'ARI', place: 'Arizona', name: 'Arizona Coyotes', color: spencerColor.colors.rouge },
        {
          short: 'CHI',
          place: 'Chicago',
          name: 'Chicago Blackhawks',
          color: spencerColor.colors.fudge,
        },
        {
          short: 'COL',
          place: 'Colorado',
          name: 'Colorado Avalanche',
          color: spencerColor.colors.burnt,
        },
        { short: 'DAL', place: 'Dallas', name: 'Dallas Stars', color: spencerColor.colors.olive },
        {
          short: 'MIN',
          place: 'Minnesota',
          name: 'Minnesota Wild',
          color: spencerColor.colors.green,
        },
        {
          short: 'NSH',
          place: 'Nashville',
          name: 'Nashville Predators',
          color: '#b2b17b',
        },
        { short: 'WIN', place: 'Winnipeg', name: 'Winnipeg Jets', color: spencerColor.colors.sea },
      ],
      pacific: [
        { short: 'ANA', place: 'Anaheim', name: 'Anaheim Ducks', color: spencerColor.colors.dimgrey },
        { short: 'CAL', place: 'Calgary', name: 'Calgary Flames', color: spencerColor.colors.red },
        {
          short: 'EDM',
          place: 'Edmonton',
          name: 'Edmonton Oilers',
          color: spencerColor.colors.orange,
        },
        {
          short: 'LOS',
          place: 'Los Angeles',
          name: 'Los Angeles Kings',
          color: spencerColor.colors.black,
        },
        { short: 'SJ', place: 'San Jose', name: 'San Jose Sharks', color: spencerColor.colors.sky },
        {
          short: 'VAN',
          place: 'Vancouver',
          name: 'Vancouver Canucks',
          color: spencerColor.colors.blue,
        },
        {
          short: 'VGS',
          place: 'Vegas',
          name: 'Vegas Golden Knights',
          color: '#b2b17b',
        },
        {
          short: 'STL',
          place: 'Seattle',
          name: 'Seattle Kraken',
          color: spencerColor.colors.greygreen,
        },
      ],
      //defunct
      // 'California Golden Seals': c.green,
      // 'Kansas City Scouts': c.navy,
      // 'Cleveland Barons': c.red,
      // 'Atlanta Flames': c.orange,
      // 'Colorado Rockies': c.navy,
      // 'Minnesota North Stars': c.olive,
      // 'Quebec Nordiques': c.sky,
      // 'Winnipeg_Jets_(1972–96)': c.rouge,
      // 'Hartford Whalers': c.green,
      // 'Atlanta Thrashers': c.fire,
    };

    /* src/nhl/Index.svelte generated by Svelte v3.24.1 */

    const { console: console_1 } = globals;
    const file$7 = "src/nhl/Index.svelte";

    function add_css$7() {
    	var style = element("style");
    	style.id = "svelte-88prb6-style";
    	style.textContent = ".container.svelte-88prb6{display:flex;flex-direction:column;justify-content:space-around;align-items:center;text-align:center;flex-wrap:wrap;align-self:stretch;border-left:2px solid lightsteelblue;height:300px;width:600px}.row.svelte-88prb6{display:flex;flex-direction:row;justify-content:space-around;align-items:center;text-align:center;flex-wrap:wrap;align-self:stretch}.box.svelte-88prb6{margin-top:10px;width:15px;height:25px;border-radius:3px}.team.svelte-88prb6{padding:5px;flex:1;display:flex;flex-direction:column;align-items:center;opacity:0.3;cursor:pointer;border-radius:5px;box-sizing:border-box}.team.svelte-88prb6:hover{opacity:0.8;border:2px solid #f2f2f2}.name.svelte-88prb6{font-size:12px}.selected.svelte-88prb6{border:2px solid grey !important;opacity:1 !important}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW5kZXguc3ZlbHRlIiwic291cmNlcyI6WyJJbmRleC5zdmVsdGUiXSwic291cmNlc0NvbnRlbnQiOlsiPHNjcmlwdD5cbiAgLy9leHBvcnQgbGV0IG5hbWUgPSAnJ1xuICBpbXBvcnQgdGVhbXMgZnJvbSAnLi90ZWFtcydcbiAgZXhwb3J0IGxldCBzZWxlY3RlZCA9ICdUT1InXG4gIGNvbnN0IGlzU2VsZWN0ZWQgPSBmdW5jdGlvbih0ZWFtKSB7XG4gICAgcmV0dXJuIHNlbGVjdGVkID09PSB0ZWFtLnNob3J0XG4gIH1cbiAgY29uc3Qgc2VsZWN0ID0gZnVuY3Rpb24odGVhbSkge1xuICAgIHNlbGVjdGVkID0gdGVhbS5zaG9ydFxuICAgIGNvbnNvbGUubG9nKHNlbGVjdGVkKVxuICB9XG48L3NjcmlwdD5cblxuPHN0eWxlPlxuICAuY29udGFpbmVyIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgZmxleC13cmFwOiB3cmFwO1xuICAgIGFsaWduLXNlbGY6IHN0cmV0Y2g7XG4gICAgYm9yZGVyLWxlZnQ6IDJweCBzb2xpZCBsaWdodHN0ZWVsYmx1ZTtcbiAgICBoZWlnaHQ6IDMwMHB4O1xuICAgIHdpZHRoOiA2MDBweDtcbiAgfVxuICAucm93IHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgZmxleC13cmFwOiB3cmFwO1xuICAgIGFsaWduLXNlbGY6IHN0cmV0Y2g7XG4gIH1cbiAgLmJveCB7XG4gICAgbWFyZ2luLXRvcDogMTBweDtcbiAgICB3aWR0aDogMTVweDtcbiAgICBoZWlnaHQ6IDI1cHg7XG4gICAgYm9yZGVyLXJhZGl1czogM3B4O1xuICB9XG4gIC50ZWFtIHtcbiAgICBwYWRkaW5nOiA1cHg7XG4gICAgZmxleDogMTtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBvcGFjaXR5OiAwLjM7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIGJvcmRlci1yYWRpdXM6IDVweDtcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICB9XG4gIC50ZWFtOmhvdmVyIHtcbiAgICBvcGFjaXR5OiAwLjg7XG4gICAgYm9yZGVyOiAycHggc29saWQgI2YyZjJmMjtcbiAgfVxuICAubmFtZSB7XG4gICAgZm9udC1zaXplOiAxMnB4O1xuICB9XG4gIC5zZWxlY3RlZCB7XG4gICAgYm9yZGVyOiAycHggc29saWQgZ3JleSAhaW1wb3J0YW50O1xuICAgIG9wYWNpdHk6IDEgIWltcG9ydGFudDtcbiAgfVxuPC9zdHlsZT5cblxuPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPlxuICA8ZGl2IGNsYXNzPVwicm93XCI+XG4gICAgeyNlYWNoIHRlYW1zLmF0bGFudGljIGFzIHRlYW19XG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzPVwidGVhbVwiXG4gICAgICAgIGNsYXNzOnNlbGVjdGVkPXt0ZWFtLnNob3J0ID09PSBzZWxlY3RlZH1cbiAgICAgICAgb246Y2xpY2s9eygpID0+IHNlbGVjdCh0ZWFtKX0+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJib3hcIiBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6e3RlYW0uY29sb3J9O1wiIC8+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJuYW1lXCI+e3RlYW0uc2hvcnR9PC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICB7L2VhY2h9XG4gIDwvZGl2PlxuICA8ZGl2IGNsYXNzPVwicm93XCI+XG4gICAgeyNlYWNoIHRlYW1zLm1ldHJvIGFzIHRlYW19XG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzPVwidGVhbVwiXG4gICAgICAgIGNsYXNzOnNlbGVjdGVkPXt0ZWFtLnNob3J0ID09PSBzZWxlY3RlZH1cbiAgICAgICAgb246Y2xpY2s9eygpID0+IHNlbGVjdCh0ZWFtKX0+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJib3hcIiBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6e3RlYW0uY29sb3J9O1wiIC8+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJuYW1lXCI+e3RlYW0uc2hvcnR9PC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICB7L2VhY2h9XG4gIDwvZGl2PlxuICA8ZGl2IGNsYXNzPVwicm93XCI+XG4gICAgPCEtLSBhZGQgZHVtbXkgdGVhbSAtLT5cbiAgICA8ZGl2IGNsYXNzPVwidGVhbVwiPlxuICAgICAgPGRpdiBjbGFzcz1cImJveFwiIHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjpub25lO1wiIC8+XG4gICAgICA8ZGl2IGNsYXNzPVwibmFtZVwiIC8+XG4gICAgPC9kaXY+XG4gICAgeyNlYWNoIHRlYW1zLmNlbnRyYWwgYXMgdGVhbX1cbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3M9XCJ0ZWFtXCJcbiAgICAgICAgY2xhc3M6c2VsZWN0ZWQ9e3RlYW0uc2hvcnQgPT09IHNlbGVjdGVkfVxuICAgICAgICBvbjpjbGljaz17KCkgPT4gc2VsZWN0KHRlYW0pfT5cbiAgICAgICAgPGRpdiBjbGFzcz1cImJveFwiIHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjp7dGVhbS5jb2xvcn07XCIgLz5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm5hbWVcIj57dGVhbS5zaG9ydH08L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIHsvZWFjaH1cbiAgPC9kaXY+XG4gIDxkaXYgY2xhc3M9XCJyb3dcIj5cbiAgICB7I2VhY2ggdGVhbXMucGFjaWZpYyBhcyB0ZWFtfVxuICAgICAgPGRpdlxuICAgICAgICBjbGFzcz1cInRlYW1cIlxuICAgICAgICBjbGFzczpzZWxlY3RlZD17dGVhbS5zaG9ydCA9PT0gc2VsZWN0ZWR9XG4gICAgICAgIG9uOmNsaWNrPXsoKSA9PiBzZWxlY3QodGVhbSl9PlxuICAgICAgICA8ZGl2IGNsYXNzPVwiYm94XCIgc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOnt0ZWFtLmNvbG9yfTtcIiAvPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibmFtZVwiPnt0ZWFtLnNob3J0fTwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgey9lYWNofVxuICA8L2Rpdj5cbjwvZGl2PlxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQWNFLFVBQVUsY0FBQyxDQUFDLEFBQ1YsT0FBTyxDQUFFLElBQUksQ0FDYixjQUFjLENBQUUsTUFBTSxDQUN0QixlQUFlLENBQUUsWUFBWSxDQUM3QixXQUFXLENBQUUsTUFBTSxDQUNuQixVQUFVLENBQUUsTUFBTSxDQUNsQixTQUFTLENBQUUsSUFBSSxDQUNmLFVBQVUsQ0FBRSxPQUFPLENBQ25CLFdBQVcsQ0FBRSxHQUFHLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FDckMsTUFBTSxDQUFFLEtBQUssQ0FDYixLQUFLLENBQUUsS0FBSyxBQUNkLENBQUMsQUFDRCxJQUFJLGNBQUMsQ0FBQyxBQUNKLE9BQU8sQ0FBRSxJQUFJLENBQ2IsY0FBYyxDQUFFLEdBQUcsQ0FDbkIsZUFBZSxDQUFFLFlBQVksQ0FDN0IsV0FBVyxDQUFFLE1BQU0sQ0FDbkIsVUFBVSxDQUFFLE1BQU0sQ0FDbEIsU0FBUyxDQUFFLElBQUksQ0FDZixVQUFVLENBQUUsT0FBTyxBQUNyQixDQUFDLEFBQ0QsSUFBSSxjQUFDLENBQUMsQUFDSixVQUFVLENBQUUsSUFBSSxDQUNoQixLQUFLLENBQUUsSUFBSSxDQUNYLE1BQU0sQ0FBRSxJQUFJLENBQ1osYUFBYSxDQUFFLEdBQUcsQUFDcEIsQ0FBQyxBQUNELEtBQUssY0FBQyxDQUFDLEFBQ0wsT0FBTyxDQUFFLEdBQUcsQ0FDWixJQUFJLENBQUUsQ0FBQyxDQUNQLE9BQU8sQ0FBRSxJQUFJLENBQ2IsY0FBYyxDQUFFLE1BQU0sQ0FDdEIsV0FBVyxDQUFFLE1BQU0sQ0FDbkIsT0FBTyxDQUFFLEdBQUcsQ0FDWixNQUFNLENBQUUsT0FBTyxDQUNmLGFBQWEsQ0FBRSxHQUFHLENBQ2xCLFVBQVUsQ0FBRSxVQUFVLEFBQ3hCLENBQUMsQUFDRCxtQkFBSyxNQUFNLEFBQUMsQ0FBQyxBQUNYLE9BQU8sQ0FBRSxHQUFHLENBQ1osTUFBTSxDQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxBQUMzQixDQUFDLEFBQ0QsS0FBSyxjQUFDLENBQUMsQUFDTCxTQUFTLENBQUUsSUFBSSxBQUNqQixDQUFDLEFBQ0QsU0FBUyxjQUFDLENBQUMsQUFDVCxNQUFNLENBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUNqQyxPQUFPLENBQUUsQ0FBQyxDQUFDLFVBQVUsQUFDdkIsQ0FBQyJ9 */";
    	append_dev(document.head, style);
    }

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    // (68:4) {#each teams.atlantic as team}
    function create_each_block_3(ctx) {
    	let div2;
    	let div0;
    	let t0;
    	let div1;
    	let t1_value = /*team*/ ctx[7].short + "";
    	let t1;
    	let t2;
    	let mounted;
    	let dispose;

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[2](/*team*/ ctx[7], ...args);
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			t1 = text(t1_value);
    			t2 = space();
    			attr_dev(div0, "class", "box svelte-88prb6");
    			set_style(div0, "background-color", /*team*/ ctx[7].color);
    			add_location(div0, file$7, 72, 8, 1450);
    			attr_dev(div1, "class", "name svelte-88prb6");
    			add_location(div1, file$7, 73, 8, 1517);
    			attr_dev(div2, "class", "team svelte-88prb6");
    			toggle_class(div2, "selected", /*team*/ ctx[7].short === /*selected*/ ctx[0]);
    			add_location(div2, file$7, 68, 6, 1328);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, t1);
    			append_dev(div2, t2);

    			if (!mounted) {
    				dispose = listen_dev(div2, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*teams, selected*/ 1) {
    				toggle_class(div2, "selected", /*team*/ ctx[7].short === /*selected*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(68:4) {#each teams.atlantic as team}",
    		ctx
    	});

    	return block;
    }

    // (79:4) {#each teams.metro as team}
    function create_each_block_2(ctx) {
    	let div2;
    	let div0;
    	let t0;
    	let div1;
    	let t1_value = /*team*/ ctx[7].short + "";
    	let t1;
    	let t2;
    	let mounted;
    	let dispose;

    	function click_handler_1(...args) {
    		return /*click_handler_1*/ ctx[3](/*team*/ ctx[7], ...args);
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			t1 = text(t1_value);
    			t2 = space();
    			attr_dev(div0, "class", "box svelte-88prb6");
    			set_style(div0, "background-color", /*team*/ ctx[7].color);
    			add_location(div0, file$7, 83, 8, 1768);
    			attr_dev(div1, "class", "name svelte-88prb6");
    			add_location(div1, file$7, 84, 8, 1835);
    			attr_dev(div2, "class", "team svelte-88prb6");
    			toggle_class(div2, "selected", /*team*/ ctx[7].short === /*selected*/ ctx[0]);
    			add_location(div2, file$7, 79, 6, 1646);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, t1);
    			append_dev(div2, t2);

    			if (!mounted) {
    				dispose = listen_dev(div2, "click", click_handler_1, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*teams, selected*/ 1) {
    				toggle_class(div2, "selected", /*team*/ ctx[7].short === /*selected*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(79:4) {#each teams.metro as team}",
    		ctx
    	});

    	return block;
    }

    // (95:4) {#each teams.central as team}
    function create_each_block_1(ctx) {
    	let div2;
    	let div0;
    	let t0;
    	let div1;
    	let t1_value = /*team*/ ctx[7].short + "";
    	let t1;
    	let t2;
    	let mounted;
    	let dispose;

    	function click_handler_2(...args) {
    		return /*click_handler_2*/ ctx[4](/*team*/ ctx[7], ...args);
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			t1 = text(t1_value);
    			t2 = space();
    			attr_dev(div0, "class", "box svelte-88prb6");
    			set_style(div0, "background-color", /*team*/ ctx[7].color);
    			add_location(div0, file$7, 99, 8, 2234);
    			attr_dev(div1, "class", "name svelte-88prb6");
    			add_location(div1, file$7, 100, 8, 2301);
    			attr_dev(div2, "class", "team svelte-88prb6");
    			toggle_class(div2, "selected", /*team*/ ctx[7].short === /*selected*/ ctx[0]);
    			add_location(div2, file$7, 95, 6, 2112);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, t1);
    			append_dev(div2, t2);

    			if (!mounted) {
    				dispose = listen_dev(div2, "click", click_handler_2, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*teams, selected*/ 1) {
    				toggle_class(div2, "selected", /*team*/ ctx[7].short === /*selected*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(95:4) {#each teams.central as team}",
    		ctx
    	});

    	return block;
    }

    // (106:4) {#each teams.pacific as team}
    function create_each_block$3(ctx) {
    	let div2;
    	let div0;
    	let t0;
    	let div1;
    	let t1_value = /*team*/ ctx[7].short + "";
    	let t1;
    	let t2;
    	let mounted;
    	let dispose;

    	function click_handler_3(...args) {
    		return /*click_handler_3*/ ctx[5](/*team*/ ctx[7], ...args);
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			t1 = text(t1_value);
    			t2 = space();
    			attr_dev(div0, "class", "box svelte-88prb6");
    			set_style(div0, "background-color", /*team*/ ctx[7].color);
    			add_location(div0, file$7, 110, 8, 2554);
    			attr_dev(div1, "class", "name svelte-88prb6");
    			add_location(div1, file$7, 111, 8, 2621);
    			attr_dev(div2, "class", "team svelte-88prb6");
    			toggle_class(div2, "selected", /*team*/ ctx[7].short === /*selected*/ ctx[0]);
    			add_location(div2, file$7, 106, 6, 2432);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, t1);
    			append_dev(div2, t2);

    			if (!mounted) {
    				dispose = listen_dev(div2, "click", click_handler_3, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*teams, selected*/ 1) {
    				toggle_class(div2, "selected", /*team*/ ctx[7].short === /*selected*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(106:4) {#each teams.pacific as team}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div7;
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let div5;
    	let div4;
    	let div2;
    	let t2;
    	let div3;
    	let t3;
    	let t4;
    	let div6;
    	let each_value_3 = teams.atlantic;
    	validate_each_argument(each_value_3);
    	let each_blocks_3 = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks_3[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
    	}

    	let each_value_2 = teams.metro;
    	validate_each_argument(each_value_2);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_2[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	let each_value_1 = teams.central;
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let each_value = teams.pacific;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div7 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].c();
    			}

    			t0 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t1 = space();
    			div5 = element("div");
    			div4 = element("div");
    			div2 = element("div");
    			t2 = space();
    			div3 = element("div");
    			t3 = space();

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t4 = space();
    			div6 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "row svelte-88prb6");
    			add_location(div0, file$7, 66, 2, 1269);
    			attr_dev(div1, "class", "row svelte-88prb6");
    			add_location(div1, file$7, 77, 2, 1590);
    			attr_dev(div2, "class", "box svelte-88prb6");
    			set_style(div2, "background-color", "none");
    			add_location(div2, file$7, 91, 6, 1983);
    			attr_dev(div3, "class", "name svelte-88prb6");
    			add_location(div3, file$7, 92, 6, 2040);
    			attr_dev(div4, "class", "team svelte-88prb6");
    			add_location(div4, file$7, 90, 4, 1958);
    			attr_dev(div5, "class", "row svelte-88prb6");
    			add_location(div5, file$7, 88, 2, 1908);
    			attr_dev(div6, "class", "row svelte-88prb6");
    			add_location(div6, file$7, 104, 2, 2374);
    			attr_dev(div7, "class", "container svelte-88prb6");
    			add_location(div7, file$7, 65, 0, 1243);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div0);

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].m(div0, null);
    			}

    			append_dev(div7, t0);
    			append_dev(div7, div1);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].m(div1, null);
    			}

    			append_dev(div7, t1);
    			append_dev(div7, div5);
    			append_dev(div5, div4);
    			append_dev(div4, div2);
    			append_dev(div4, t2);
    			append_dev(div4, div3);
    			append_dev(div5, t3);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div5, null);
    			}

    			append_dev(div7, t4);
    			append_dev(div7, div6);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div6, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*teams, selected, select*/ 3) {
    				each_value_3 = teams.atlantic;
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3(ctx, each_value_3, i);

    					if (each_blocks_3[i]) {
    						each_blocks_3[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_3[i] = create_each_block_3(child_ctx);
    						each_blocks_3[i].c();
    						each_blocks_3[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks_3.length; i += 1) {
    					each_blocks_3[i].d(1);
    				}

    				each_blocks_3.length = each_value_3.length;
    			}

    			if (dirty & /*teams, selected, select*/ 3) {
    				each_value_2 = teams.metro;
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_2[i] = create_each_block_2(child_ctx);
    						each_blocks_2[i].c();
    						each_blocks_2[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks_2.length; i += 1) {
    					each_blocks_2[i].d(1);
    				}

    				each_blocks_2.length = each_value_2.length;
    			}

    			if (dirty & /*teams, selected, select*/ 3) {
    				each_value_1 = teams.central;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(div5, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*teams, selected, select*/ 3) {
    				each_value = teams.pacific;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div6, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div7);
    			destroy_each(each_blocks_3, detaching);
    			destroy_each(each_blocks_2, detaching);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { selected = "TOR" } = $$props;

    	const isSelected = function (team) {
    		return selected === team.short;
    	};

    	const select = function (team) {
    		$$invalidate(0, selected = team.short);
    		console.log(selected);
    	};

    	const writable_props = ["selected"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<Index> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Index", $$slots, []);
    	const click_handler = team => select(team);
    	const click_handler_1 = team => select(team);
    	const click_handler_2 = team => select(team);
    	const click_handler_3 = team => select(team);

    	$$self.$$set = $$props => {
    		if ("selected" in $$props) $$invalidate(0, selected = $$props.selected);
    	};

    	$$self.$capture_state = () => ({ teams, selected, isSelected, select });

    	$$self.$inject_state = $$props => {
    		if ("selected" in $$props) $$invalidate(0, selected = $$props.selected);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		selected,
    		select,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3
    	];
    }

    class Index extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		if (!document.getElementById("svelte-88prb6-style")) add_css$7();
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { selected: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Index",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get selected() {
    		throw new Error("<Index>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error("<Index>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* Demo.svelte generated by Svelte v3.24.1 */

    const { console: console_1$1 } = globals;
    const file$8 = "Demo.svelte";

    function add_css$8() {
    	var style = element("style");
    	style.id = "svelte-9my1ev-style";
    	style.textContent = ".col.svelte-9my1ev{display:flex;flex-direction:column;justify-content:flex-start;align-items:flex-start;margin:3rem;text-align:center;flex-wrap:wrap;align-self:stretch}.mt5.svelte-9my1ev{margin-top:14rem;margin-bottom:3rem}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGVtby5zdmVsdGUiLCJzb3VyY2VzIjpbIkRlbW8uc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQ+XG4gIGltcG9ydCB7XG4gICAgQ2hvaWNlLFxuICAgIE51bWJlcixcbiAgICBUYWJzLFxuICAgIEJ1dHRvbixcbiAgICBUZXh0LFxuICAgIExlZ2VuZCxcbiAgICBOSEwsXG4gICAgVGV4dEFyZWFcbiAgfSBmcm9tICcuL3NyYydcblxuICBsZXQgY2hvaWNlcyA9IFsnYScsICdiJywgJ2MnXVxuICBsZXQgY2hvaWNlID0gJ2InXG5cbiAgbGV0IHRleHQgPSAnZm9vYmFyJ1xuICBsZXQgbnVtYmVyID0gMlxuICBsZXQgdmFsdWUgPSAyXG5cbiAgbGV0IGNvbG9ycyA9IHtcbiAgICAnI2RlZGRlZCc6ICdMYWJlbCAxJyxcbiAgICAnIzcyNjk3RCc6ICdMYWJlbCAyJyxcbiAgICAnI0FCNTg1MCc6ICdMYWJlbCAzJ1xuICB9XG4gIGxldCBsb25nVGV4dCA9IGB0aGlzIGlzIGEgdGVzdFxcbi5yZWRcXG4uZ3JlZW5cXG5vaCB5ZWFoLlxcbnRoaXMgaXMgYSB0ZXN0XFxuLnJlZFxcbi5ncmVlblxcbm9oIHllYWguXFxudGhpcyBpcyBhIHRlc3RcXG4ucmVkXFxuLmdyZWVuXFxub2ggeWVhaC5cXG50aGlzIGlzIGEgdGVzdFxcbi5yZWRcXG4uZ3JlZW5cXG5vaCB5ZWFoLmBcbjwvc2NyaXB0PlxuXG48c3R5bGU+XG4gIC5jb2wge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtc3RhcnQ7XG4gICAgYWxpZ24taXRlbXM6IGZsZXgtc3RhcnQ7XG4gICAgbWFyZ2luOiAzcmVtO1xuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICBmbGV4LXdyYXA6IHdyYXA7XG4gICAgYWxpZ24tc2VsZjogc3RyZXRjaDtcbiAgfVxuICAubXQ1IHtcbiAgICBtYXJnaW4tdG9wOiAxNHJlbTtcbiAgICBtYXJnaW4tYm90dG9tOiAzcmVtO1xuICB9XG48L3N0eWxlPlxuXG48ZGl2IGNsYXNzPVwiY29sXCI+XG4gIDxkaXY+XG4gICAgPGFcbiAgICAgIHN0eWxlPVwiZm9udC1zaXplOjJyZW07IGNvbG9yOnN0ZWVsYmx1ZTsgbWFyZ2luLXRvcDoycmVtO1wiXG4gICAgICBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL3NwZW5jZXJtb3VudGFpbi9zb21laG93LWlucHV0XCI+XG4gICAgICBzb21laG93LWlucHV0XG4gICAgPC9hPlxuICA8L2Rpdj5cbiAgPGRpdj5zb21lIGhhbmR5IHN2ZWx0ZSBpbnB1dCBjb21wb25lbnRzPC9kaXY+XG5cbiAgPGg0IGNsYXNzPVwibXQ1XCI+TkhMLXRlYW0gc2VsZWN0b3I8L2g0PlxuICA8ZGl2IHN0eWxlPVwid2lkdGg6ODAlO1wiPlxuICAgIDxOSEwgLz5cbiAgPC9kaXY+XG5cbiAgPGg0IGNsYXNzPVwibXQ1XCI+VGV4dEFyZWE8L2g0PlxuICA8ZGl2IHN0eWxlPVwid2lkdGg6ODAlO1wiPlxuICAgIDxUZXh0QXJlYSBiaW5kOnZhbHVlPXtsb25nVGV4dH0gLz5cbiAgPC9kaXY+XG5cbiAgPGg0IGNsYXNzPVwibXQ1XCI+TnVtYmVyPC9oND5cbiAgPE51bWJlciBiaW5kOm51bWJlciBtaW49ezF9IG1heD17NDB9IGhhc1NsaWRlcj17ZmFsc2V9IGhhc0tleWJvYXJkPXtmYWxzZX0gLz5cblxuICA8aDQgY2xhc3M9XCJtdDVcIj5CdXR0b248L2g0PlxuICA8QnV0dG9uIGxhYmVsPVwiaGlcIiBjb2xvcj1cInJlZFwiIG9uQ2xpY2s9eygpID0+IGNvbnNvbGUubG9nKCdoaScpfSAvPlxuXG4gIDxoNCBjbGFzcz1cIm10NVwiPkNob2ljZTwvaDQ+XG4gIDxDaG9pY2UgYmluZDpjaG9pY2Uge2Nob2ljZXN9IC8+XG5cbiAgPGg0IGNsYXNzPVwibXQ1XCI+VGFiczwvaDQ+XG4gIDxUYWJzIGJpbmQ6Y2hvaWNlIHtjaG9pY2VzfSAvPlxuXG4gIDxoNCBjbGFzcz1cIm10NVwiPlRleHQ8L2g0PlxuICA8VGV4dCBiaW5kOnRleHQgLz5cblxuICA8aDQgY2xhc3M9XCJtdDVcIj5MZWdlbmQ8L2g0PlxuICA8TGVnZW5kIHtjb2xvcnN9IC8+XG5cbiAgPGRpdiBjbGFzcz1cIm10NVwiIC8+XG48L2Rpdj5cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUE0QkUsSUFBSSxjQUFDLENBQUMsQUFDSixPQUFPLENBQUUsSUFBSSxDQUNiLGNBQWMsQ0FBRSxNQUFNLENBQ3RCLGVBQWUsQ0FBRSxVQUFVLENBQzNCLFdBQVcsQ0FBRSxVQUFVLENBQ3ZCLE1BQU0sQ0FBRSxJQUFJLENBQ1osVUFBVSxDQUFFLE1BQU0sQ0FDbEIsU0FBUyxDQUFFLElBQUksQ0FDZixVQUFVLENBQUUsT0FBTyxBQUNyQixDQUFDLEFBQ0QsSUFBSSxjQUFDLENBQUMsQUFDSixVQUFVLENBQUUsS0FBSyxDQUNqQixhQUFhLENBQUUsSUFBSSxBQUNyQixDQUFDIn0= */";
    	append_dev(document.head, style);
    }

    function create_fragment$8(ctx) {
    	let div5;
    	let div0;
    	let a;
    	let t1;
    	let div1;
    	let t3;
    	let h40;
    	let t5;
    	let div2;
    	let nhl;
    	let t6;
    	let h41;
    	let t8;
    	let div3;
    	let textarea;
    	let updating_value;
    	let t9;
    	let h42;
    	let t11;
    	let number_1;
    	let updating_number;
    	let t12;
    	let h43;
    	let t14;
    	let button;
    	let t15;
    	let h44;
    	let t17;
    	let choice_1;
    	let updating_choice;
    	let t18;
    	let h45;
    	let t20;
    	let tabs;
    	let updating_choice_1;
    	let t21;
    	let h46;
    	let t23;
    	let text_1;
    	let updating_text;
    	let t24;
    	let h47;
    	let t26;
    	let legend;
    	let t27;
    	let div4;
    	let current;
    	nhl = new Index({ $$inline: true });

    	function textarea_value_binding(value) {
    		/*textarea_value_binding*/ ctx[6].call(null, value);
    	}

    	let textarea_props = {};

    	if (/*longText*/ ctx[3] !== void 0) {
    		textarea_props.value = /*longText*/ ctx[3];
    	}

    	textarea = new TextArea({ props: textarea_props, $$inline: true });
    	binding_callbacks.push(() => bind(textarea, "value", textarea_value_binding));

    	function number_1_number_binding(value) {
    		/*number_1_number_binding*/ ctx[7].call(null, value);
    	}

    	let number_1_props = {
    		min: 1,
    		max: 40,
    		hasSlider: false,
    		hasKeyboard: false
    	};

    	if (/*number*/ ctx[2] !== void 0) {
    		number_1_props.number = /*number*/ ctx[2];
    	}

    	number_1 = new Number_1({ props: number_1_props, $$inline: true });
    	binding_callbacks.push(() => bind(number_1, "number", number_1_number_binding));

    	button = new Button({
    			props: {
    				label: "hi",
    				color: "red",
    				onClick: /*func*/ ctx[8]
    			},
    			$$inline: true
    		});

    	function choice_1_choice_binding(value) {
    		/*choice_1_choice_binding*/ ctx[9].call(null, value);
    	}

    	let choice_1_props = { choices: /*choices*/ ctx[4] };

    	if (/*choice*/ ctx[0] !== void 0) {
    		choice_1_props.choice = /*choice*/ ctx[0];
    	}

    	choice_1 = new Choice({ props: choice_1_props, $$inline: true });
    	binding_callbacks.push(() => bind(choice_1, "choice", choice_1_choice_binding));

    	function tabs_choice_binding(value) {
    		/*tabs_choice_binding*/ ctx[10].call(null, value);
    	}

    	let tabs_props = { choices: /*choices*/ ctx[4] };

    	if (/*choice*/ ctx[0] !== void 0) {
    		tabs_props.choice = /*choice*/ ctx[0];
    	}

    	tabs = new Tabs({ props: tabs_props, $$inline: true });
    	binding_callbacks.push(() => bind(tabs, "choice", tabs_choice_binding));

    	function text_1_text_binding(value) {
    		/*text_1_text_binding*/ ctx[11].call(null, value);
    	}

    	let text_1_props = {};

    	if (/*text*/ ctx[1] !== void 0) {
    		text_1_props.text = /*text*/ ctx[1];
    	}

    	text_1 = new Text({ props: text_1_props, $$inline: true });
    	binding_callbacks.push(() => bind(text_1, "text", text_1_text_binding));

    	legend = new Legend({
    			props: { colors: /*colors*/ ctx[5] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div0 = element("div");
    			a = element("a");
    			a.textContent = "somehow-input";
    			t1 = space();
    			div1 = element("div");
    			div1.textContent = "some handy svelte input components";
    			t3 = space();
    			h40 = element("h4");
    			h40.textContent = "NHL-team selector";
    			t5 = space();
    			div2 = element("div");
    			create_component(nhl.$$.fragment);
    			t6 = space();
    			h41 = element("h4");
    			h41.textContent = "TextArea";
    			t8 = space();
    			div3 = element("div");
    			create_component(textarea.$$.fragment);
    			t9 = space();
    			h42 = element("h4");
    			h42.textContent = "Number";
    			t11 = space();
    			create_component(number_1.$$.fragment);
    			t12 = space();
    			h43 = element("h4");
    			h43.textContent = "Button";
    			t14 = space();
    			create_component(button.$$.fragment);
    			t15 = space();
    			h44 = element("h4");
    			h44.textContent = "Choice";
    			t17 = space();
    			create_component(choice_1.$$.fragment);
    			t18 = space();
    			h45 = element("h4");
    			h45.textContent = "Tabs";
    			t20 = space();
    			create_component(tabs.$$.fragment);
    			t21 = space();
    			h46 = element("h4");
    			h46.textContent = "Text";
    			t23 = space();
    			create_component(text_1.$$.fragment);
    			t24 = space();
    			h47 = element("h4");
    			h47.textContent = "Legend";
    			t26 = space();
    			create_component(legend.$$.fragment);
    			t27 = space();
    			div4 = element("div");
    			set_style(a, "font-size", "2rem");
    			set_style(a, "color", "steelblue");
    			set_style(a, "margin-top", "2rem");
    			attr_dev(a, "href", "https://github.com/spencermountain/somehow-input");
    			add_location(a, file$8, 46, 4, 842);
    			add_location(div0, file$8, 45, 2, 832);
    			add_location(div1, file$8, 52, 2, 1012);
    			attr_dev(h40, "class", "mt5 svelte-9my1ev");
    			add_location(h40, file$8, 54, 2, 1061);
    			set_style(div2, "width", "80%");
    			add_location(div2, file$8, 55, 2, 1102);
    			attr_dev(h41, "class", "mt5 svelte-9my1ev");
    			add_location(h41, file$8, 59, 2, 1151);
    			set_style(div3, "width", "80%");
    			add_location(div3, file$8, 60, 2, 1183);
    			attr_dev(h42, "class", "mt5 svelte-9my1ev");
    			add_location(h42, file$8, 64, 2, 1259);
    			attr_dev(h43, "class", "mt5 svelte-9my1ev");
    			add_location(h43, file$8, 67, 2, 1370);
    			attr_dev(h44, "class", "mt5 svelte-9my1ev");
    			add_location(h44, file$8, 70, 2, 1471);
    			attr_dev(h45, "class", "mt5 svelte-9my1ev");
    			add_location(h45, file$8, 73, 2, 1537);
    			attr_dev(h46, "class", "mt5 svelte-9my1ev");
    			add_location(h46, file$8, 76, 2, 1599);
    			attr_dev(h47, "class", "mt5 svelte-9my1ev");
    			add_location(h47, file$8, 79, 2, 1649);
    			attr_dev(div4, "class", "mt5 svelte-9my1ev");
    			add_location(div4, file$8, 82, 2, 1702);
    			attr_dev(div5, "class", "col svelte-9my1ev");
    			add_location(div5, file$8, 44, 0, 812);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div0);
    			append_dev(div0, a);
    			append_dev(div5, t1);
    			append_dev(div5, div1);
    			append_dev(div5, t3);
    			append_dev(div5, h40);
    			append_dev(div5, t5);
    			append_dev(div5, div2);
    			mount_component(nhl, div2, null);
    			append_dev(div5, t6);
    			append_dev(div5, h41);
    			append_dev(div5, t8);
    			append_dev(div5, div3);
    			mount_component(textarea, div3, null);
    			append_dev(div5, t9);
    			append_dev(div5, h42);
    			append_dev(div5, t11);
    			mount_component(number_1, div5, null);
    			append_dev(div5, t12);
    			append_dev(div5, h43);
    			append_dev(div5, t14);
    			mount_component(button, div5, null);
    			append_dev(div5, t15);
    			append_dev(div5, h44);
    			append_dev(div5, t17);
    			mount_component(choice_1, div5, null);
    			append_dev(div5, t18);
    			append_dev(div5, h45);
    			append_dev(div5, t20);
    			mount_component(tabs, div5, null);
    			append_dev(div5, t21);
    			append_dev(div5, h46);
    			append_dev(div5, t23);
    			mount_component(text_1, div5, null);
    			append_dev(div5, t24);
    			append_dev(div5, h47);
    			append_dev(div5, t26);
    			mount_component(legend, div5, null);
    			append_dev(div5, t27);
    			append_dev(div5, div4);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const textarea_changes = {};

    			if (!updating_value && dirty & /*longText*/ 8) {
    				updating_value = true;
    				textarea_changes.value = /*longText*/ ctx[3];
    				add_flush_callback(() => updating_value = false);
    			}

    			textarea.$set(textarea_changes);
    			const number_1_changes = {};

    			if (!updating_number && dirty & /*number*/ 4) {
    				updating_number = true;
    				number_1_changes.number = /*number*/ ctx[2];
    				add_flush_callback(() => updating_number = false);
    			}

    			number_1.$set(number_1_changes);
    			const choice_1_changes = {};

    			if (!updating_choice && dirty & /*choice*/ 1) {
    				updating_choice = true;
    				choice_1_changes.choice = /*choice*/ ctx[0];
    				add_flush_callback(() => updating_choice = false);
    			}

    			choice_1.$set(choice_1_changes);
    			const tabs_changes = {};

    			if (!updating_choice_1 && dirty & /*choice*/ 1) {
    				updating_choice_1 = true;
    				tabs_changes.choice = /*choice*/ ctx[0];
    				add_flush_callback(() => updating_choice_1 = false);
    			}

    			tabs.$set(tabs_changes);
    			const text_1_changes = {};

    			if (!updating_text && dirty & /*text*/ 2) {
    				updating_text = true;
    				text_1_changes.text = /*text*/ ctx[1];
    				add_flush_callback(() => updating_text = false);
    			}

    			text_1.$set(text_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(nhl.$$.fragment, local);
    			transition_in(textarea.$$.fragment, local);
    			transition_in(number_1.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			transition_in(choice_1.$$.fragment, local);
    			transition_in(tabs.$$.fragment, local);
    			transition_in(text_1.$$.fragment, local);
    			transition_in(legend.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(nhl.$$.fragment, local);
    			transition_out(textarea.$$.fragment, local);
    			transition_out(number_1.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			transition_out(choice_1.$$.fragment, local);
    			transition_out(tabs.$$.fragment, local);
    			transition_out(text_1.$$.fragment, local);
    			transition_out(legend.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			destroy_component(nhl);
    			destroy_component(textarea);
    			destroy_component(number_1);
    			destroy_component(button);
    			destroy_component(choice_1);
    			destroy_component(tabs);
    			destroy_component(text_1);
    			destroy_component(legend);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let choices = ["a", "b", "c"];
    	let choice = "b";
    	let text = "foobar";
    	let number = 2;
    	let value = 2;

    	let colors = {
    		"#dedded": "Label 1",
    		"#72697D": "Label 2",
    		"#AB5850": "Label 3"
    	};

    	let longText = `this is a test\n.red\n.green\noh yeah.\nthis is a test\n.red\n.green\noh yeah.\nthis is a test\n.red\n.green\noh yeah.\nthis is a test\n.red\n.green\noh yeah.`;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$1.warn(`<Demo> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Demo", $$slots, []);

    	function textarea_value_binding(value) {
    		longText = value;
    		$$invalidate(3, longText);
    	}

    	function number_1_number_binding(value) {
    		number = value;
    		$$invalidate(2, number);
    	}

    	const func = () => console.log("hi");

    	function choice_1_choice_binding(value) {
    		choice = value;
    		$$invalidate(0, choice);
    	}

    	function tabs_choice_binding(value) {
    		choice = value;
    		$$invalidate(0, choice);
    	}

    	function text_1_text_binding(value) {
    		text = value;
    		$$invalidate(1, text);
    	}

    	$$self.$capture_state = () => ({
    		Choice,
    		Number: Number_1,
    		Tabs,
    		Button,
    		Text,
    		Legend,
    		NHL: Index,
    		TextArea,
    		choices,
    		choice,
    		text,
    		number,
    		value,
    		colors,
    		longText
    	});

    	$$self.$inject_state = $$props => {
    		if ("choices" in $$props) $$invalidate(4, choices = $$props.choices);
    		if ("choice" in $$props) $$invalidate(0, choice = $$props.choice);
    		if ("text" in $$props) $$invalidate(1, text = $$props.text);
    		if ("number" in $$props) $$invalidate(2, number = $$props.number);
    		if ("value" in $$props) value = $$props.value;
    		if ("colors" in $$props) $$invalidate(5, colors = $$props.colors);
    		if ("longText" in $$props) $$invalidate(3, longText = $$props.longText);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		choice,
    		text,
    		number,
    		longText,
    		choices,
    		colors,
    		textarea_value_binding,
    		number_1_number_binding,
    		func,
    		choice_1_choice_binding,
    		tabs_choice_binding,
    		text_1_text_binding
    	];
    }

    class Demo extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		if (!document.getElementById("svelte-9my1ev-style")) add_css$8();
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Demo",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    const app = new Demo({
      target: document.body,
    });

    return app;

}());
