(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(_dereq_,module,exports){
!function(){var n={},e=JSON.stringify;function t(e){for(var t=".",c=0;c<e.length;c++)t+=e[c].length+","+e[c];return(n[t]||(n[t]=i(e)))(this,arguments)}var i=function(n){for(var t,i,c,r,s,o=0,u="return ",a="",f="",h=0,l="",g="",d="",v=0,m=function(){c?9===o?(h++&&(u+=","),u+="h("+(f||e(a)),o=0):13===o||0===o&&"..."===a?(0===o?(d||(d=")",l=l?"Object.assign("+l:"Object.assign({}"),l+=g+","+f,g=""):r&&(l+=l?","+(g?"":"{"):"{",g="}",l+=e(r)+":",l+=f||(s||a)&&e(a)||"true",r=""),s=!1):0===o&&(o=13,r=a,a=f="",m(),o=0):(f||(a=a.replace(/^\s*\n\s*|\s*\n\s*$/g,"")))&&(h++&&(u+=","),u+=f||e(a)),a=f=""},p=0;p<n.length;p++){p>0&&(c||m(),f="$["+p+"]",m());for(var O=0;O<n[p].length;O++){if(i=n[p].charCodeAt(O),c){if(39===i||34===i){if(v===i){v=0;continue}if(0===v){v=i;continue}}if(0===v)switch(i){case 62:m(),47!==o&&(u+=l?","+l+g+d:",null"),t&&(u+=")"),c=0,l="",o=1;continue;case 61:o=13,s=!0,r=a,a="";continue;case 47:t||(t=!0,9!==o||a.trim()||(a=f="",o=47));continue;case 9:case 10:case 13:case 32:m(),o=0;continue}}else if(60===i){m(),c=1,d=g=l="",t=s=!1,o=9;continue}a+=n[p].charAt(O)}}return m(),Function("h","$",u)};"undefined"!=typeof module?module.exports=t:self.htm=t}();

},{}],2:[function(_dereq_,module,exports){
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.vhtml = factory());
}(this, (function () { 'use strict';

var emptyTags = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

var esc = function esc(str) {
	return String(str).replace(/[&<>"']/g, function (s) {
		return '&' + map[s] + ';';
	});
};
var map = { '&': 'amp', '<': 'lt', '>': 'gt', '"': 'quot', "'": 'apos' };

var sanitized = {};

function h(name, attrs) {
	var stack = [];
	for (var i = arguments.length; i-- > 2;) {
		stack.push(arguments[i]);
	}

	if (typeof name === 'function') {
		(attrs || (attrs = {})).children = stack.reverse();
		return name(attrs);
	}

	var s = '<' + name;
	if (attrs) for (var _i in attrs) {
		if (attrs[_i] !== false && attrs[_i] != null) {
			s += ' ' + esc(_i) + '="' + esc(attrs[_i]) + '"';
		}
	}

	if (emptyTags.indexOf(name) === -1) {
		s += '>';

		while (stack.length) {
			var child = stack.pop();
			if (child) {
				if (child.pop) {
					for (var _i2 = child.length; _i2--;) {
						stack.push(child[_i2]);
					}
				} else {
					s += sanitized[child] === true ? child : esc(child);
				}
			}
		}

		s += '</' + name + '>';
	} else {
		s += '>';
	}

	sanitized[s] = true;
	return s;
}

return h;

})));


},{}],3:[function(_dereq_,module,exports){
"use strict";

var inputs = _dereq_('./src'); // const somehow = require('./builds/somehow')


var input = inputs.input({
  el: '#input',
  width: 600,
  value: 'tofu',
  label: 'input'
});
document.querySelector('#input').innerHTML = input.build();
var slider = inputs.slider({
  el: '#slider',
  width: 600,
  max: 200,
  min: -100,
  value: 50,
  label: 'number'
});
document.querySelector('#slider').innerHTML = slider.build();
var plusMinus = inputs.plusMinus({
  el: '#plusminus',
  width: 600,
  value: 50,
  label: 'input'
});
document.querySelector('#plusminus').innerHTML = plusMinus.build();

},{"./src":4}],4:[function(_dereq_,module,exports){
"use strict";

var Input = _dereq_('./inputs/Input');

var Slider = _dereq_('./inputs/Slider');

var PlusMinus = _dereq_('./inputs/PlusMinus');

var inputs = {
  input: function input(obj) {
    return new Input(obj);
  },
  slider: function slider(obj) {
    return new Slider(obj);
  },
  plusMinus: function plusMinus(obj) {
    return new PlusMinus(obj);
  }
};
module.exports = inputs;

},{"./inputs/Input":5,"./inputs/PlusMinus":6,"./inputs/Slider":7}],5:[function(_dereq_,module,exports){
"use strict";

function _templateObject() {
  var data = _taggedTemplateLiteral(["<div class=\"col\">\n      <div class=\"grey\">", "</div>\n      <input id=\"", "\" class=\"input\" style=\"max-width:8rem;\" type=\"text\" value=\"", "\"/>\n    </div>"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var htm = _dereq_('htm');

var vhtml = _dereq_('vhtml');

var uid = _dereq_('../uid');

var defaults = {};

var Input =
/*#__PURE__*/
function () {
  function Input() {
    var _this = this;

    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Input);

    if (typeof obj === 'string') {
      this._id = obj;
      obj = {};
    }

    this.attrs = Object.assign({}, defaults, obj);
    this._id = obj.id || uid('input');
    this._value = obj.value || '';
    this._label = obj.label || '';

    var cb = obj.cb || function () {};

    this.callback = function (val) {
      _this._value = val;

      _this.redraw();

      cb(val);
    };

    this.el = null;
    this.h = htm.bind(vhtml);
    this.el = obj.el || null;
  }

  _createClass(Input, [{
    key: "bind",
    value: function bind(fn) {
      this.h = htm.bind(fn);
    }
  }, {
    key: "setCallback",
    value: function setCallback() {
      var _this2 = this;

      setTimeout(function () {
        var el = document.getElementById(_this2._id);

        if (el) {
          el.addEventListener('input', function (e) {
            _this2.callback(e.target.value);
          });
        }
      }, 50);
    }
  }, {
    key: "redraw",
    value: function redraw() {}
  }, {
    key: "build",
    value: function build() {
      var label = '';

      if (this._label) {
        label = this._label + ':';
      }

      this.setCallback();
      return this.h(_templateObject(), label, this._id, this._value);
    }
  }]);

  return Input;
}();

module.exports = Input;

},{"../uid":8,"htm":1,"vhtml":2}],6:[function(_dereq_,module,exports){
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _templateObject() {
  var data = _taggedTemplateLiteral(["<div class=\"col\">\n      <div class=\"grey\">", "</div>\n      <div class=\"row\" style=\"justify-content: center;\">\n        <div class=\"bggreygreen rounded h3 w4 white f2 shadow\" style=", " id=\"", "\">\u2212</div>\n        <input id=\"", "\" class=\"input shadow center\" min=", " max=", " style=\"max-width:6rem; margin:0px;\" type=\"number\" value=\"", "\"/>\n        <div class=\"bggreygreen rounded h3 w4 white f2 shadow\" style=", " id=\"", "\">+</div>\n      </div>\n    </div>"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Input = _dereq_('./Input');

var uid = _dereq_('../uid');

var defaults = {
  min: -100,
  max: 100,
  step: 1,
  size: 200
};

var PlusMinus =
/*#__PURE__*/
function (_Input) {
  _inherits(PlusMinus, _Input);

  function PlusMinus() {
    var _this;

    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, PlusMinus);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PlusMinus).call(this, obj));
    _this.attrs = Object.assign({}, defaults, _this.attrs);
    _this._id = obj.id || uid('plusminus');
    return _this;
  }

  _createClass(PlusMinus, [{
    key: "moreCallbacks",
    value: function moreCallbacks() {
      var _this2 = this;

      setTimeout(function () {
        var _this2$attrs = _this2.attrs,
            min = _this2$attrs.min,
            max = _this2$attrs.max;
        var el = document.getElementById(_this2._id);

        document.getElementById(_this2._id + 'plus').onclick = function () {
          var num = Number(el.value) + 1;

          if (num > min && num < max) {
            el.value = num;
          }
        };

        document.getElementById(_this2._id + 'minus').onclick = function () {
          var num = Number(el.value) - 1;

          if (num > min && num < max) {
            el.value = num;
          }
        };

        console.log(el, el.value);
      }, 60);
    }
  }, {
    key: "build",
    value: function build() {
      var label = '';

      if (this._label) {
        label = this._label + ':';
      }

      var buttonStyle = 'cursor:pointer; user-select: none; -moz-user-select: none;';
      this.setCallback();
      this.moreCallbacks();
      var _this$attrs = this.attrs,
          min = _this$attrs.min,
          max = _this$attrs.max;
      return this.h(_templateObject(), label, buttonStyle, this._id + 'minus', this._id, min, max, this._value, buttonStyle, this._id + 'plus');
    }
  }]);

  return PlusMinus;
}(Input);

module.exports = PlusMinus;

},{"../uid":8,"./Input":5}],7:[function(_dereq_,module,exports){
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _templateObject() {
  var data = _taggedTemplateLiteral(["<div class=\"col w100p\">\n      <div class=\"grey\">", "</div>\n      <input class=\"w100p\" type=\"range\" id=\"", "\" value=", " ...", "/>\n      <div id=\"", "\" class=\"grey\">", "</div>\n    </div>"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Input = _dereq_('./Input');

var uid = _dereq_('../uid');

var defaults = {
  min: -100,
  max: 100,
  step: 1,
  size: 200
};

var Slider =
/*#__PURE__*/
function (_Input) {
  _inherits(Slider, _Input);

  function Slider() {
    var _this;

    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Slider);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Slider).call(this, obj));
    _this.attrs = Object.assign({}, defaults, _this.attrs);
    _this._id = obj.id || uid('slider');
    _this.display_id = _this._id + 'display';

    if (obj.show_number === undefined) {
      obj.show_number = true;
    }

    _this.show_number = obj.show_number;
    return _this;
  }

  _createClass(Slider, [{
    key: "redraw",
    value: function redraw() {
      if (this.show_number) {
        var el = document.getElementById(this.display_id);
        el.innerHTML = this._value;
      }
    }
  }, {
    key: "build",
    value: function build() {
      var h = this.h;
      this.setCallback();
      var label = '';

      if (this._label) {
        label = this._label + ':';
      }

      return h(_templateObject(), label, this._id, this._value, this.attrs, this.display_id, this._value);
    }
  }]);

  return Slider;
}(Input);

module.exports = Slider;

},{"../uid":8,"./Input":5}],8:[function(_dereq_,module,exports){
"use strict";

//may need to change when the term really-transforms? not sure.
var uid = function uid(str) {
  var nums = '';

  for (var i = 0; i < 5; i++) {
    nums += parseInt(Math.random() * 9, 10);
  }

  return str + '-' + nums;
};

module.exports = uid;

},{}]},{},[3]);
