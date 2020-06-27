
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
        if (value != null || input.value) {
            input.value = value;
        }
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
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
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
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.22.2' }, detail)));
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
        if (text.data === data)
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

    /* src/Button.svelte generated by Svelte v3.22.2 */

    const file = "src/Button.svelte";

    function create_fragment(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*label*/ ctx[0]);
    			attr_dev(div, "class", "button grey pointer ullighter b3 white svelte-gpjtnz");
    			add_location(div, file, 38, 0, 844);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*label*/ 1) set_data_dev(t, /*label*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
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
    	const writable_props = ["label", "color"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Button> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Button", $$slots, []);

    	$$self.$set = $$props => {
    		if ("label" in $$props) $$invalidate(0, label = $$props.label);
    		if ("color" in $$props) $$invalidate(1, color = $$props.color);
    	};

    	$$self.$capture_state = () => ({ label, color });

    	$$self.$inject_state = $$props => {
    		if ("label" in $$props) $$invalidate(0, label = $$props.label);
    		if ("color" in $$props) $$invalidate(1, color = $$props.color);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [label, color];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { label: 0, color: 1 });

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
    }

    /* src/Choice.svelte generated by Svelte v3.22.2 */

    const { window: window_1 } = globals;
    const file$1 = "src/Choice.svelte";

    // (122:2) {#if hasSlider}
    function create_if_block(ctx) {
    	let input;
    	let input_min_value;
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
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*index*/ ctx[2]);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(input, "change", /*input_change_input_handler*/ ctx[11]),
    				listen_dev(input, "input", /*input_change_input_handler*/ ctx[11])
    			];
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*index*/ 4) {
    				set_input_value(input, /*index*/ ctx[2]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
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
    		m: function mount(target, anchor, remount) {
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
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(window_1, "keydown", /*handleKeydown*/ ctx[7], false, false, false),
    				listen_dev(button0, "click", /*minus*/ ctx[5], false, false, false),
    				listen_dev(span, "pointerdown", /*handle_pointerdown*/ ctx[4], false, false, false),
    				listen_dev(button1, "click", /*plus*/ ctx[6], false, false, false)
    			];
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

    	$$self.$set = $$props => {
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
    		min,
    		input_change_input_handler
    	];
    }

    class Choice extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

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

    /* src/Number.svelte generated by Svelte v3.22.2 */

    const { window: window_1$1 } = globals;
    const file$2 = "src/Number.svelte";

    // (104:2) {#if hasSlider}
    function create_if_block$1(ctx) {
    	let input;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "range");
    			attr_dev(input, "min", /*min*/ ctx[1]);
    			attr_dev(input, "max", /*max*/ ctx[2]);
    			add_location(input, file$2, 104, 4, 2621);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*number*/ ctx[0]);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(input, "change", /*input_change_input_handler*/ ctx[9]),
    				listen_dev(input, "input", /*input_change_input_handler*/ ctx[9])
    			];
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
    		m: function mount(target, anchor, remount) {
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
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(window_1$1, "keydown", /*handleKeydown*/ ctx[7], false, false, false),
    				listen_dev(button0, "click", /*minus*/ ctx[5], false, false, false),
    				listen_dev(span, "pointerdown", /*handle_pointerdown*/ ctx[4], false, false, false),
    				listen_dev(button1, "click", /*plus*/ ctx[6], false, false, false)
    			];
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

    	$$self.$set = $$props => {
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

    /* src/Tabs.svelte generated by Svelte v3.22.2 */

    const file$3 = "src/Tabs.svelte";

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
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    			if (remount) dispose();
    			dispose = listen_dev(div, "click", click_handler, false, false, false);
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

    	$$self.$set = $$props => {
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

    /* src/Text.svelte generated by Svelte v3.22.2 */

    const file$4 = "src/Text.svelte";

    function create_fragment$4(ctx) {
    	let input;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "class", "input svelte-fx9i9q");
    			attr_dev(input, "type", "text");
    			input.value = /*text*/ ctx[0];
    			add_location(input, file$4, 35, 0, 738);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*text*/ 1 && input.value !== /*text*/ ctx[0]) {
    				prop_dev(input, "value", /*text*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
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
    	const writable_props = ["text"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Text> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Text", $$slots, []);

    	$$self.$set = $$props => {
    		if ("text" in $$props) $$invalidate(0, text = $$props.text);
    	};

    	$$self.$capture_state = () => ({ text });

    	$$self.$inject_state = $$props => {
    		if ("text" in $$props) $$invalidate(0, text = $$props.text);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [text];
    }

    class Text extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
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

    /* src/Legend.svelte generated by Svelte v3.22.2 */

    const { Object: Object_1 } = globals;
    const file$5 = "src/Legend.svelte";

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

    	$$self.$set = $$props => {
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

    const scaleLinear = function (obj) {
      let world = obj.world || [];
      let minmax = obj.minmax || [];
      const calc = (num) => {
        let range = minmax[1] - minmax[0];
        let percent = (num - minmax[0]) / range;
        let size = world[1] - world[0];
        let res = size * percent;
        if (res > minmax.max) {
          return minmax.max
        }
        if (res < minmax.min) {
          return minmax.min
        }
        return res
      };
      // invert the calculation. return a %?
      calc.backward = (num) => {
        let size = world[1] - world[0];
        let range = minmax[1] - minmax[0];
        let percent = (num - world[0]) / size;
        return percent * range
      };
      return calc
    };

    /* src/Slider/Slider.svelte generated by Svelte v3.22.2 */
    const file$6 = "src/Slider/Slider.svelte";

    function create_fragment$6(ctx) {
    	let div0;
    	let t0;
    	let t1;
    	let div3;
    	let div1;
    	let t2;
    	let div2;
    	let dispose;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = text(/*value*/ ctx[0]);
    			t1 = space();
    			div3 = element("div");
    			div1 = element("div");
    			t2 = space();
    			div2 = element("div");
    			add_location(div0, file$6, 67, 0, 1514);
    			attr_dev(div1, "class", "background svelte-jprfmr");
    			add_location(div1, file$6, 69, 2, 1559);
    			attr_dev(div2, "class", "handle svelte-jprfmr");
    			set_style(div2, "left", /*percent*/ ctx[1] + "%");
    			add_location(div2, file$6, 70, 2, 1631);
    			attr_dev(div3, "class", "container svelte-jprfmr");
    			add_location(div3, file$6, 68, 0, 1533);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div1);
    			/*div1_binding*/ ctx[12](div1);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(div1, "pointerdown", /*startClick*/ ctx[3], false, false, false),
    				listen_dev(div2, "pointerdown", /*startClick*/ ctx[3], false, false, false)
    			];
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*value*/ 1) set_data_dev(t0, /*value*/ ctx[0]);

    			if (dirty & /*percent*/ 2) {
    				set_style(div2, "left", /*percent*/ ctx[1] + "%");
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div3);
    			/*div1_binding*/ ctx[12](null);
    			run_all(dispose);
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

    function instance$6($$self, $$props, $$invalidate) {
    	let { value = 0 } = $$props;
    	let { max = 100 } = $$props;
    	let { min = 0 } = $$props;
    	let scale = scaleLinear({ world: [0, 100], minmax: [min, max] });
    	let percent = scale(value);
    	let dragStart = 0;
    	let el = null;

    	const moveHandle = function (e) {
    		if (el.isSameNode(e.target) !== true) {
    			return;
    		}

    		let total = e.target.clientWidth;
    		let val = e.layerX || 0;
    		$$invalidate(1, percent = val / total * 100);
    		$$invalidate(0, value = scale.backward(percent));
    	};

    	// end drag event
    	const mouseUp = function (e) {
    		stopDrag();
    	};

    	const didDrag = function (e) {
    		moveHandle(e);
    	};

    	const stopDrag = function (e) {
    		window.removeEventListener("mousemove", didDrag);
    		window.removeEventListener("pointerup", mouseUp);
    	};

    	function startClick(e) {
    		dragStart = e.layerX;
    		window.addEventListener("mousemove", didDrag);
    		window.addEventListener("pointerup", mouseUp);
    		moveHandle(e);
    	}

    	const writable_props = ["value", "max", "min"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Slider> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Slider", $$slots, []);

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			$$invalidate(2, el = $$value);
    		});
    	}

    	$$self.$set = $$props => {
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    		if ("max" in $$props) $$invalidate(4, max = $$props.max);
    		if ("min" in $$props) $$invalidate(5, min = $$props.min);
    	};

    	$$self.$capture_state = () => ({
    		scaleLinear,
    		value,
    		max,
    		min,
    		scale,
    		percent,
    		dragStart,
    		el,
    		moveHandle,
    		mouseUp,
    		didDrag,
    		stopDrag,
    		startClick
    	});

    	$$self.$inject_state = $$props => {
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    		if ("max" in $$props) $$invalidate(4, max = $$props.max);
    		if ("min" in $$props) $$invalidate(5, min = $$props.min);
    		if ("scale" in $$props) scale = $$props.scale;
    		if ("percent" in $$props) $$invalidate(1, percent = $$props.percent);
    		if ("dragStart" in $$props) dragStart = $$props.dragStart;
    		if ("el" in $$props) $$invalidate(2, el = $$props.el);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		value,
    		percent,
    		el,
    		startClick,
    		max,
    		min,
    		dragStart,
    		scale,
    		moveHandle,
    		mouseUp,
    		didDrag,
    		stopDrag,
    		div1_binding
    	];
    }

    class Slider extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { value: 0, max: 4, min: 5 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Slider",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get value() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get max() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set max(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get min() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set min(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* Demo.svelte generated by Svelte v3.22.2 */

    const { console: console_1 } = globals;
    const file$7 = "Demo.svelte";

    function create_fragment$7(ctx) {
    	let div4;
    	let div0;
    	let a;
    	let t1;
    	let div1;
    	let t3;
    	let h20;
    	let t5;
    	let div2;
    	let updating_value;
    	let t6;
    	let h21;
    	let t8;
    	let updating_number;
    	let t9;
    	let h22;
    	let t11;
    	let t12;
    	let h23;
    	let t14;
    	let updating_choice;
    	let t15;
    	let h24;
    	let t17;
    	let updating_choice_1;
    	let t18;
    	let h25;
    	let t20;
    	let updating_text;
    	let t21;
    	let h26;
    	let t23;
    	let t24;
    	let div3;
    	let current;

    	function slider_value_binding(value) {
    		/*slider_value_binding*/ ctx[6].call(null, value);
    	}

    	let slider_props = { min: 0, max: 200 };

    	if (/*value*/ ctx[3] !== void 0) {
    		slider_props.value = /*value*/ ctx[3];
    	}

    	const slider = new Slider({ props: slider_props, $$inline: true });
    	binding_callbacks.push(() => bind(slider, "value", slider_value_binding));

    	function number_1_number_binding(value) {
    		/*number_1_number_binding*/ ctx[7].call(null, value);
    	}

    	let number_1_props = {
    		min: 1,
    		max: 4,
    		hasSlider: false,
    		hasKeyboard: false
    	};

    	if (/*number*/ ctx[2] !== void 0) {
    		number_1_props.number = /*number*/ ctx[2];
    	}

    	const number_1 = new Number_1({ props: number_1_props, $$inline: true });
    	binding_callbacks.push(() => bind(number_1, "number", number_1_number_binding));

    	const button = new Button({
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

    	const choice_1 = new Choice({ props: choice_1_props, $$inline: true });
    	binding_callbacks.push(() => bind(choice_1, "choice", choice_1_choice_binding));

    	function tabs_choice_binding(value) {
    		/*tabs_choice_binding*/ ctx[10].call(null, value);
    	}

    	let tabs_props = {
    		choices: /*choices*/ ctx[4],
    		hasKeyboard: false
    	};

    	if (/*choice*/ ctx[0] !== void 0) {
    		tabs_props.choice = /*choice*/ ctx[0];
    	}

    	const tabs = new Tabs({ props: tabs_props, $$inline: true });
    	binding_callbacks.push(() => bind(tabs, "choice", tabs_choice_binding));

    	function text_1_text_binding(value) {
    		/*text_1_text_binding*/ ctx[11].call(null, value);
    	}

    	let text_1_props = {};

    	if (/*text*/ ctx[1] !== void 0) {
    		text_1_props.text = /*text*/ ctx[1];
    	}

    	const text_1 = new Text({ props: text_1_props, $$inline: true });
    	binding_callbacks.push(() => bind(text_1, "text", text_1_text_binding));

    	const legend = new Legend({
    			props: { colors: /*colors*/ ctx[5] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div0 = element("div");
    			a = element("a");
    			a.textContent = "somehow-input";
    			t1 = space();
    			div1 = element("div");
    			div1.textContent = "some handy svelte input components";
    			t3 = space();
    			h20 = element("h2");
    			h20.textContent = "Slider";
    			t5 = space();
    			div2 = element("div");
    			create_component(slider.$$.fragment);
    			t6 = space();
    			h21 = element("h2");
    			h21.textContent = "Number";
    			t8 = space();
    			create_component(number_1.$$.fragment);
    			t9 = space();
    			h22 = element("h2");
    			h22.textContent = "Button";
    			t11 = space();
    			create_component(button.$$.fragment);
    			t12 = space();
    			h23 = element("h2");
    			h23.textContent = "Choice";
    			t14 = space();
    			create_component(choice_1.$$.fragment);
    			t15 = space();
    			h24 = element("h2");
    			h24.textContent = "Tabs";
    			t17 = space();
    			create_component(tabs.$$.fragment);
    			t18 = space();
    			h25 = element("h2");
    			h25.textContent = "Text";
    			t20 = space();
    			create_component(text_1.$$.fragment);
    			t21 = space();
    			h26 = element("h2");
    			h26.textContent = "Legend";
    			t23 = space();
    			create_component(legend.$$.fragment);
    			t24 = space();
    			div3 = element("div");
    			attr_dev(a, "href", "https://github.com/spencermountain/somehow-input");
    			add_location(a, file$7, 31, 4, 558);
    			add_location(div0, file$7, 30, 2, 548);
    			add_location(div1, file$7, 33, 2, 646);
    			attr_dev(h20, "class", "mt3 svelte-iy82y4");
    			add_location(h20, file$7, 35, 2, 695);
    			set_style(div2, "width", "80%");
    			add_location(div2, file$7, 36, 2, 725);
    			attr_dev(h21, "class", "mt3 svelte-iy82y4");
    			add_location(h21, file$7, 40, 2, 806);
    			attr_dev(h22, "class", "mt3 svelte-iy82y4");
    			add_location(h22, file$7, 43, 2, 916);
    			attr_dev(h23, "class", "mt3 svelte-iy82y4");
    			add_location(h23, file$7, 46, 2, 1017);
    			attr_dev(h24, "class", "mt3 svelte-iy82y4");
    			add_location(h24, file$7, 49, 2, 1083);
    			attr_dev(h25, "class", "mt3 svelte-iy82y4");
    			add_location(h25, file$7, 52, 2, 1165);
    			attr_dev(h26, "class", "mt3 svelte-iy82y4");
    			add_location(h26, file$7, 55, 2, 1215);
    			attr_dev(div3, "class", "mt3 svelte-iy82y4");
    			add_location(div3, file$7, 58, 2, 1268);
    			attr_dev(div4, "class", "col svelte-iy82y4");
    			add_location(div4, file$7, 29, 0, 528);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div0);
    			append_dev(div0, a);
    			append_dev(div4, t1);
    			append_dev(div4, div1);
    			append_dev(div4, t3);
    			append_dev(div4, h20);
    			append_dev(div4, t5);
    			append_dev(div4, div2);
    			mount_component(slider, div2, null);
    			append_dev(div4, t6);
    			append_dev(div4, h21);
    			append_dev(div4, t8);
    			mount_component(number_1, div4, null);
    			append_dev(div4, t9);
    			append_dev(div4, h22);
    			append_dev(div4, t11);
    			mount_component(button, div4, null);
    			append_dev(div4, t12);
    			append_dev(div4, h23);
    			append_dev(div4, t14);
    			mount_component(choice_1, div4, null);
    			append_dev(div4, t15);
    			append_dev(div4, h24);
    			append_dev(div4, t17);
    			mount_component(tabs, div4, null);
    			append_dev(div4, t18);
    			append_dev(div4, h25);
    			append_dev(div4, t20);
    			mount_component(text_1, div4, null);
    			append_dev(div4, t21);
    			append_dev(div4, h26);
    			append_dev(div4, t23);
    			mount_component(legend, div4, null);
    			append_dev(div4, t24);
    			append_dev(div4, div3);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const slider_changes = {};

    			if (!updating_value && dirty & /*value*/ 8) {
    				updating_value = true;
    				slider_changes.value = /*value*/ ctx[3];
    				add_flush_callback(() => updating_value = false);
    			}

    			slider.$set(slider_changes);
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
    			transition_in(slider.$$.fragment, local);
    			transition_in(number_1.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			transition_in(choice_1.$$.fragment, local);
    			transition_in(tabs.$$.fragment, local);
    			transition_in(text_1.$$.fragment, local);
    			transition_in(legend.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(slider.$$.fragment, local);
    			transition_out(number_1.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			transition_out(choice_1.$$.fragment, local);
    			transition_out(tabs.$$.fragment, local);
    			transition_out(text_1.$$.fragment, local);
    			transition_out(legend.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			destroy_component(slider);
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
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let choices = ["a", "b", "c"];
    	let choice = "b";
    	let text = "foobar";
    	let number = 2;
    	let value = 2;
    	let colors = { "#dedded": "LabelA", red: "Label2" };
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<Demo> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Demo", $$slots, []);

    	function slider_value_binding(value$1) {
    		value = value$1;
    		$$invalidate(3, value);
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
    		Slider,
    		choices,
    		choice,
    		text,
    		number,
    		value,
    		colors
    	});

    	$$self.$inject_state = $$props => {
    		if ("choices" in $$props) $$invalidate(4, choices = $$props.choices);
    		if ("choice" in $$props) $$invalidate(0, choice = $$props.choice);
    		if ("text" in $$props) $$invalidate(1, text = $$props.text);
    		if ("number" in $$props) $$invalidate(2, number = $$props.number);
    		if ("value" in $$props) $$invalidate(3, value = $$props.value);
    		if ("colors" in $$props) $$invalidate(5, colors = $$props.colors);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		choice,
    		text,
    		number,
    		value,
    		choices,
    		colors,
    		slider_value_binding,
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
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Demo",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    const app = new Demo({
      target: document.body,
    });

    return app;

}());
