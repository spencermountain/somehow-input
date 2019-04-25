/* somehow v0.0.7
   github.com/spencermountain/somehow-input
   MIT
*/

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.somehowInput = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(_dereq_,module,exports){
!function(){var n={},e=JSON.stringify;function t(e){for(var t=".",c=0;c<e.length;c++)t+=e[c].length+","+e[c];return(n[t]||(n[t]=i(e)))(this,arguments)}var i=function(n){for(var t,i,c,r,s,o=0,u="return ",a="",f="",h=0,l="",g="",d="",v=0,m=function(){c?9===o?(h++&&(u+=","),u+="h("+(f||e(a)),o=0):13===o||0===o&&"..."===a?(0===o?(d||(d=")",l=l?"Object.assign("+l:"Object.assign({}"),l+=g+","+f,g=""):r&&(l+=l?","+(g?"":"{"):"{",g="}",l+=e(r)+":",l+=f||(s||a)&&e(a)||"true",r=""),s=!1):0===o&&(o=13,r=a,a=f="",m(),o=0):(f||(a=a.replace(/^\s*\n\s*|\s*\n\s*$/g,"")))&&(h++&&(u+=","),u+=f||e(a)),a=f=""},p=0;p<n.length;p++){p>0&&(c||m(),f="$["+p+"]",m());for(var O=0;O<n[p].length;O++){if(i=n[p].charCodeAt(O),c){if(39===i||34===i){if(v===i){v=0;continue}if(0===v){v=i;continue}}if(0===v)switch(i){case 62:m(),47!==o&&(u+=l?","+l+g+d:",null"),t&&(u+=")"),c=0,l="",o=1;continue;case 61:o=13,s=!0,r=a,a="";continue;case 47:t||(t=!0,9!==o||a.trim()||(a=f="",o=47));continue;case 9:case 10:case 13:case 32:m(),o=0;continue}}else if(60===i){m(),c=1,d=g=l="",t=s=!1,o=9;continue}a+=n[p].charAt(O)}}return m(),Function("h","$",u)};"undefined"!=typeof module?module.exports=t:self.htm=t}();

},{}],2:[function(_dereq_,module,exports){
(function (global){
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).spencerColor=e()}}(function(){return function u(i,a,c){function f(r,e){if(!a[r]){if(!i[r]){var o="function"==typeof _dereq_&&_dereq_;if(!e&&o)return o(r,!0);if(d)return d(r,!0);var n=new Error("Cannot find module '"+r+"'");throw n.code="MODULE_NOT_FOUND",n}var t=a[r]={exports:{}};i[r][0].call(t.exports,function(e){return f(i[r][1][e]||e)},t,t.exports,u,i,a,c)}return a[r].exports}for(var d="function"==typeof _dereq_&&_dereq_,e=0;e<c.length;e++)f(c[e]);return f}({1:[function(e,r,o){"use strict";r.exports={blue:"#6699cc",green:"#6accb2",yellow:"#e1e6b3",red:"#cc7066",pink:"#F2C0BB",brown:"#705E5C",orange:"#cc8a66",purple:"#d8b3e6",navy:"#335799",olive:"#7f9c6c",fuscia:"#735873",beige:"#e6d7b3",slate:"#8C8C88",suede:"#9c896c",burnt:"#603a39",sea:"#50617A",sky:"#2D85A8",night:"#303b50",rouge:"#914045",grey:"#838B91",mud:"#C4ABAB",royal:"#275291",cherry:"#cc6966",tulip:"#e6b3bc",rose:"#D68881",fire:"#AB5850",greyblue:"#72697D",greygreen:"#8BA3A2",greypurple:"#978BA3",burn:"#6D5685",slategrey:"#bfb0b3",light:"#a3a5a5",lighter:"#d7d5d2",fudge:"#4d4d4d",lightgrey:"#949a9e",white:"#fbfbfb",dimgrey:"#606c74",softblack:"#463D4F",dark:"#443d3d",black:"#333333"}},{}],2:[function(e,r,o){"use strict";var n=e("./colors"),t={juno:["blue","mud","navy","slate","pink","burn"],barrow:["rouge","red","orange","burnt","brown","greygreen"],roma:["#8a849a","#b5b0bf","rose","lighter","greygreen","mud"],palmer:["red","navy","olive","pink","suede","sky"],mark:["#848f9a","#9aa4ac","slate","#b0b8bf","mud","grey"],salmon:["sky","sea","fuscia","slate","mud","fudge"],dupont:["green","brown","orange","red","olive","blue"],bloor:["night","navy","beige","rouge","mud","grey"],yukon:["mud","slate","brown","sky","beige","red"],david:["blue","green","yellow","red","pink","light"],neste:["mud","cherry","royal","rouge","greygreen","greypurple"],ken:["red","sky","#c67a53","greygreen","#dfb59f","mud"]};Object.keys(t).forEach(function(e){t[e]=t[e].map(function(e){return n[e]||e})}),r.exports=t},{"./colors":1}],3:[function(e,r,o){"use strict";var n=e("./colors"),t=e("./combos"),u={colors:n,list:Object.keys(n).map(function(e){return n[e]}),combos:t};r.exports=u},{"./colors":1,"./combos":2}]},{},[3])(3)});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(_dereq_,module,exports){
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


},{}],4:[function(_dereq_,module,exports){
"use strict";

var Input = _dereq_('./inputs/Input');

var Slider = _dereq_('./inputs/Slider');

var Vslider = _dereq_('./inputs/Vslider');

var PlusMinus = _dereq_('./inputs/PlusMinus');

var Textarea = _dereq_('./inputs/Textarea');

var Duration = _dereq_('./inputs/Duration');

var Tabs = _dereq_('./inputs/Tabs');

var Legend = _dereq_('./inputs/Legend');

var Select = _dereq_('./inputs/Select');

var Button = _dereq_('./inputs/Button');

var inputs = {
  input: function input(obj) {
    return new Input(obj);
  },
  slider: function slider(obj) {
    return new Slider(obj);
  },
  vslider: function vslider(obj) {
    return new Vslider(obj);
  },
  plusMinus: function plusMinus(obj) {
    return new PlusMinus(obj);
  },
  textarea: function textarea(obj) {
    return new Textarea(obj);
  },
  duration: function duration(obj) {
    return new Duration(obj);
  },
  legend: function legend(obj) {
    return new Legend(obj);
  },
  tabs: function tabs(obj) {
    return new Tabs(obj);
  },
  select: function select(obj) {
    return new Select(obj);
  },
  button: function button(obj) {
    return new Button(obj);
  }
};
module.exports = inputs;

},{"./inputs/Button":5,"./inputs/Duration":6,"./inputs/Input":7,"./inputs/Legend":8,"./inputs/PlusMinus":9,"./inputs/Select":10,"./inputs/Slider":11,"./inputs/Tabs":12,"./inputs/Textarea":13,"./inputs/Vslider":14}],5:[function(_dereq_,module,exports){
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _templateObject() {
  var data = _taggedTemplateLiteral(["<div class=\"col maxw7\">\n      <div class=\"grey center ulblue\">", "</div>\n      <div class=\"grey pointer ullighter b3 white\" style=", " id=\"", "\">\n    ", "\n    </div>\n      </div>"]);

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

var Input = _dereq_('./Input'); // const colors = require('spencer-color').colors


var uid = _dereq_('../uid');

var defaults = {
  color: '#2D85A8'
};

var Button =
/*#__PURE__*/
function (_Input) {
  _inherits(Button, _Input);

  function Button() {
    var _this;

    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Button);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Button).call(this, obj));
    _this.attrs = Object.assign({}, defaults, _this.attrs);
    _this._id = obj.id || uid('_btn');
    _this.labels = obj.labels || {};
    _this.color = obj.color || defaults.color;
    return _this;
  }

  _createClass(Button, [{
    key: "setCallback",
    value: function setCallback() {
      var _this2 = this;

      setTimeout(function () {
        var el = document.getElementById(_this2._id);
        el.addEventListener('click', function (e) {
          _this2.callback(e.target.value);
        });
      }, 50);
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

      var style = 'padding:0.5rem; margin-left:0.5rem; user-select: none; background-color: ' + this.color;
      return h(_templateObject(), label, style, this._id, this.attrs.value); // <button ...${this.attrs} class="f2">${this.attrs.value}</button>
    }
  }]);

  return Button;
}(Input);

module.exports = Button;

},{"../uid":16,"./Input":7}],6:[function(_dereq_,module,exports){
"use strict";

function _templateObject() {
  var data = _taggedTemplateLiteral(["<div class=\"col w100p\">\n      <div class=\"grey\">", "</div>\n      <input class=\"w100p\" type=\"range\" id=\"", "\" value=", " ...", "/>\n      <div id=\"", "\" class=\"grey\">", "</div>\n    </div>"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

var mil = _dereq_('../milliseconds');

var defaults = {
  min: 0,
  max: mil.year,
  value: mil.month * 6,
  step: mil.day,
  debounce: false
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
    _this._id = obj.id || uid('duration');
    _this.display_id = _this._id + 'display';

    if (obj.show_number === undefined) {
      obj.show_number = true;
    }

    _this.show_number = obj.show_number;

    if (_typeof(obj.max) === 'object') {
      _this.attrs.max = _this.parseObj(obj.max);
    }

    if (_typeof(obj.min) === 'object') {
      _this.attrs.min = _this.parseObj(obj.min);
    }

    _this._value = _this.attrs.value;

    if (_typeof(obj.value) === 'object') {
      _this._value = _this.parseObj(obj.value);
    } else {
      _this._value = obj.value;
    }

    return _this;
  }

  _createClass(Slider, [{
    key: "parseObj",
    value: function parseObj(obj) {
      var val = 0;
      Object.keys(obj).forEach(function (k) {
        val += (mil[k] || 0) * obj[k];
      });
      val *= 1.01;
      return val;
    }
  }, {
    key: "round",
    value: function round(val) {
      if (this.attrs.decimal) {
        return parseInt(val * 10, 10) / 10;
      }

      return parseInt(val, 10);
    }
  }, {
    key: "displayText",
    value: function displayText() {
      var val = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      if (val >= mil.year * 0.99) {
        return this.round(val / mil.year) + ' years';
      }

      if (val >= mil.month * 0.99) {
        return this.round(val / mil.month) + ' months';
      }

      if (val >= mil.week * 0.99) {
        return this.round(val / mil.week) + ' weeks';
      }

      if (val >= mil.day * 0.99) {
        return this.round(val / mil.day) + ' days';
      }

      return this.round(val / mil.hour) + ' hours';
    }
  }, {
    key: "redraw",
    value: function redraw() {
      if (this.show_number) {
        var el = document.getElementById(this.display_id);
        el.innerHTML = this.displayText(this._value);
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

      return h(_templateObject(), label, this._id, this._value, this.attrs, this.display_id, this.displayText(this._value));
    }
  }]);

  return Slider;
}(Input);

module.exports = Slider;

},{"../milliseconds":15,"../uid":16,"./Input":7}],7:[function(_dereq_,module,exports){
"use strict";

function _templateObject() {
  var data = _taggedTemplateLiteral(["<div class=\"col\">\n      <div class=\"grey\">", "</div>\n      <input id=\"", "\" class=\"input\" style=\"max-width:8rem; padding-right:0px;\" type=\"text\" style=", " value=\"", "\"/>\n    </div>"]);

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

    this.timeout = null;
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
    key: "debounce",
    value: function debounce(cb, duration) {
      //support immediate-mode
      if (this.attrs.debounce === false) {
        cb();
        return;
      }

      if (this.timeout) {
        clearTimeout(this.timeout);
      }

      this.timeout = setTimeout(cb, duration);
    }
  }, {
    key: "setCallback",
    value: function setCallback() {
      var _this2 = this;

      setTimeout(function () {
        var el = document.getElementById(_this2._id);
        el.addEventListener('input', function (e) {
          _this2.debounce(function () {
            _this2.callback(e.target.value);
          }, 300);
        });
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
      var style = '';

      if (this.attrs.width) {
        style = "max-width:".concat(this.attrs.width, "px; min-width:10px;");
      }

      return this.h(_templateObject(), label, this._id, style, this._value);
    }
  }]);

  return Input;
}();

module.exports = Input;

},{"../uid":16,"htm":1,"vhtml":3}],8:[function(_dereq_,module,exports){
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _templateObject2() {
  var data = _taggedTemplateLiteral(["<div class=\"col maxw7\" id=\"", "\">\n      <div class=\"grey center ulblue\">", "</div>\n      ", "\n      </div>"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["<div class=\"row-left pointer legend-row\">\n        <div class=\"w2 rounded m1\" style=\"", "\"></div>\n        <div class=\"grey\">", "</div>\n      </div>"]);

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

var colors = _dereq_('spencer-color').colors;

var uid = _dereq_('../uid');

var defaults = {};

var Legend =
/*#__PURE__*/
function (_Input) {
  _inherits(Legend, _Input);

  function Legend() {
    var _this;

    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Legend);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Legend).call(this, obj));
    _this.attrs = Object.assign({}, defaults, _this.attrs);
    _this._id = obj.id || uid('slider');
    _this.labels = obj.labels || {};
    return _this;
  }

  _createClass(Legend, [{
    key: "build",
    value: function build() {
      var _this2 = this;

      var h = this.h;
      this.setCallback();
      var label = '';

      if (this._label) {
        label = this._label + ':';
      }

      var labels = Object.keys(this.labels).map(function (k) {
        var color = colors[_this2.labels[k]] || _this2.labels[k];
        var bar = "height:5px; background-color:".concat(color, ";");
        return h(_templateObject(), bar, k);
      });
      return h(_templateObject2(), this._id, label, labels);
    }
  }]);

  return Legend;
}(Input);

module.exports = Legend;

},{"../uid":16,"./Input":7,"spencer-color":2}],9:[function(_dereq_,module,exports){
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _templateObject() {
  var data = _taggedTemplateLiteral(["<div class=\"col\">\n      <div class=\"grey\">", "</div>\n      <div class=\"row\" style=\"justify-content: center;\">\n        <div class=\"bggreygreen rounded h2 w3 white f1 shadow\" style=", " id=\"", "\">\u2212</div>\n        <input id=\"", "\" class=\"input shadow center f1\" min=", " max=", " style=\"max-width:4rem; margin:0px; font-size:1rem; height:1.2rem;\" type=\"number\" value=\"", "\"/>\n        <div class=\"bggreygreen rounded h2 w3 white f1 shadow\" style=", " id=\"", "\">+</div>\n      </div>\n    </div>"]);

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

},{"../uid":16,"./Input":7}],10:[function(_dereq_,module,exports){
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _templateObject2() {
  var data = _taggedTemplateLiteral(["<div class=\"col maxw7\" >\n        <div class=\"grey\">", "</div>\n        <select id=\"", "\" value=\"", "\" style=", ">\n        ", "\n        </select>\n      </div>"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["<option ...", ">\n        ", "\n      </options>"]);

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

var defaults = {};

var Select =
/*#__PURE__*/
function (_Input) {
  _inherits(Select, _Input);

  function Select() {
    var _this;

    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Select);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Select).call(this, obj));
    _this.attrs = Object.assign({}, defaults, _this.attrs);
    _this._id = obj.id || uid('select');
    _this.options = obj.options || [];
    return _this;
  }

  _createClass(Select, [{
    key: "setCallback",
    value: function setCallback() {
      var _this2 = this;

      setTimeout(function () {
        var el = document.getElementById(_this2._id);
        el.addEventListener('change', function (e) {
          _this2.callback(e.target.value);
        });
      }, 50);
    }
  }, {
    key: "build",
    value: function build() {
      var _this3 = this;

      var h = this.h;
      this.setCallback();
      var label = '';

      if (this._label) {
        label = this._label + ':';
      }

      var options = this.options.map(function (str) {
        var attr = {};

        if (str === _this3.attrs.value) {
          attr.selected = "selected";
        }

        return h(_templateObject(), attr, str);
      });
      var style = '';

      if (this.attrs.width) {
        style = "max-width:".concat(this.attrs.width, "px; min-width:10px;");
      }

      return h(_templateObject2(), label, this._id, this.attrs.value, style, options);
    }
  }]);

  return Select;
}(Input);

module.exports = Select;

},{"../uid":16,"./Input":7}],11:[function(_dereq_,module,exports){
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
  size: 200,
  debounce: false
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

},{"../uid":16,"./Input":7}],12:[function(_dereq_,module,exports){
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _templateObject2() {
  var data = _taggedTemplateLiteral(["<div class=\"col w100p\" style=\"user-select: none; -moz-user-select: none;\">\n      <div class=\"grey ullight b05 mb1\">", "</div>\n      <div class=\"row\" id=", ">", "</div>\n    </div>"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["<div class=\"pointer somehow-tab f1 grow\" style=\"", "\">", "</div>"]);

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
  light: '#b5bbbf',
  lighter: '#b5bbbf',
  selected: '#2D85A8',
  tabs: []
};

var Tabs =
/*#__PURE__*/
function (_Input) {
  _inherits(Tabs, _Input);

  function Tabs() {
    var _this;

    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Tabs);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Tabs).call(this, obj));
    _this.attrs = Object.assign({}, defaults, _this.attrs);
    _this._id = obj.id || uid('slider');
    _this.tabs = obj.tabs || defaults.tabs;
    _this.value = obj.value || _this.tabs[0];
    return _this;
  }

  _createClass(Tabs, [{
    key: "moreCallbacks",
    value: function moreCallbacks() {
      var _this2 = this;

      setTimeout(function () {
        // document.queryString('.somehow-tab')
        var tabs = document.querySelectorAll('.somehow-tab');

        var _loop = function _loop(i) {
          var tab = tabs[i];

          tab.onclick = function (e) {
            for (var j = 0; j < tabs.length; j += 1) {
              tabs[j].style.color = defaults.light;
              tabs[j].style['border-color'] = 'rgba(181, 187, 191, 0.1)';
            }

            e.target.style.color = defaults.selected;
            e.target.style['border-color'] = defaults.selected;

            _this2.callback(_this2.tabs[i]);
          };
        };

        for (var i = 0; i < tabs.length; i += 1) {
          _loop(i);
        }
      }, 60);
    }
  }, {
    key: "makeTabs",
    value: function makeTabs() {
      var _this3 = this;

      var h = this.h;
      var tabs = this.tabs.map(function (str) {
        var style = "margin-left:4px; margin-right:4px; padding-left:4px; padding-right:4px; ";
        style += 'transition: all 0.1s cubic-bezier(0.250, 0.460, 0.450, 0.940);';

        if (_this3.value !== str) {
          style += "border-bottom:3px solid rgba(181, 187, 191, 0.1); color:".concat(defaults.light);
        } else {
          style += "border-bottom:3px solid ".concat(defaults.selected, "; color:").concat(defaults.selected);
        }

        return h(_templateObject(), style, str);
      });
      return tabs;
    }
  }, {
    key: "build",
    value: function build() {
      var h = this.h;
      this.setCallback();
      this.moreCallbacks();
      var label = '';

      if (this._label) {
        label = this._label + ' :';
      }

      var tabs = this.makeTabs();
      return h(_templateObject2(), label, this._id, tabs);
    }
  }]);

  return Tabs;
}(Input);

module.exports = Tabs;

},{"../uid":16,"./Input":7}],13:[function(_dereq_,module,exports){
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _templateObject() {
  var data = _taggedTemplateLiteral(["<div class=\"col w9\">\n      <div class=\"grey pointer ullighter b3 white\" style=", " id=\"", "\">", "<span class=\"white f2\" style=\"margin:0.5rem;\">+</span></div>\n      <textarea class=\"w7\" id=\"", "\" style=", " ...", ">", "</textarea>\n    </div>"]);

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
  size: 200,
  color: '#2D85A8'
};

var Textarea =
/*#__PURE__*/
function (_Input) {
  _inherits(Textarea, _Input);

  function Textarea() {
    var _this;

    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Textarea);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Textarea).call(this, obj));
    _this.attrs = Object.assign({}, defaults, _this.attrs);
    _this._id = obj.id || uid('textarea');
    _this.display_id = _this._id + 'display';
    _this.show = obj.show;
    _this.color = obj.color || defaults.color;
    return _this;
  }

  _createClass(Textarea, [{
    key: "moreCallbacks",
    value: function moreCallbacks() {
      var _this2 = this;

      setTimeout(function () {
        document.getElementById(_this2._id + '_btn').onclick = function () {
          _this2.show = !_this2.show;
          var el = document.getElementById(_this2._id);

          if (_this2.show) {
            el.style.height = '16rem';
            el.style.padding = '1rem';
            el.style.visibility = 'visible';
            el.style.resize = 'both';
            el.scrollTop = el.scrollHeight;
          } else {
            el.style.height = '0rem';
            el.style.padding = '0rem';
            el.style.visibility = 'hidden';
            el.style.resize = 'none';
          }
        };
      }, 60);
    }
  }, {
    key: "makeStyle",
    value: function makeStyle() {
      var style = 'transition: all 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940); font-size:10px; font-family: monospace;';
      style += ' visibility: hidden; height:0px; padding:0px; resize: none;';
      style += " border:6px solid ".concat(this.color, "; color:").concat(this.color, "; border-radius:7px; ");
      style += "border-left:1px solid ".concat(this.color, "; border-right:1px solid ").concat(this.color, ";");
      return style;
    }
  }, {
    key: "build",
    value: function build() {
      var h = this.h;
      this.setCallback();
      this.moreCallbacks();
      var label = '';

      if (this._label) {
        label = this._label + ':';
      }

      var style = 'padding:0.5rem; user-select: none; margin-left:0.5rem; background-color: ' + this.color;
      return h(_templateObject(), style, this._id + '_btn', label, this._id, this.makeStyle(), this.attrs, this._value);
    }
  }]);

  return Textarea;
}(Input);

module.exports = Textarea;

},{"../uid":16,"./Input":7}],14:[function(_dereq_,module,exports){
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _templateObject() {
  var data = _taggedTemplateLiteral(["<div class=\"col w100p\">\n      <div class=\"grey\">", "</div>\n      <input class=\"w100p\" type=\"range\" id=\"", "\" orient=\"vertical\" style=", " value=", " ...", "  />\n      <div id=\"", "\" class=\"grey\">", "</div>\n    </div>"]);

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
  size: 200,
  debounce: false
};

var Vslider =
/*#__PURE__*/
function (_Input) {
  _inherits(Vslider, _Input);

  function Vslider() {
    var _this;

    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Vslider);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Vslider).call(this, obj));
    _this.attrs = Object.assign({}, defaults, _this.attrs);
    _this._id = obj.id || uid('slider');
    _this.display_id = _this._id + 'display';

    if (obj.show_number === undefined) {
      obj.show_number = true;
    }

    _this.show_number = obj.show_number;
    _this.reverse = obj.reverse || false;
    return _this;
  }

  _createClass(Vslider, [{
    key: "redraw",
    value: function redraw() {
      if (this.show_number) {
        var el = document.getElementById(this.display_id);
        el.innerHTML = this._value;
      }
    }
  }, {
    key: "buildStyle",
    value: function buildStyle() {
      var style = 'writing-mode: bt-lr;';
      /* IE */

      style += '-webkit-appearance: slider-vertical;';
      /* WebKit */

      style += 'width: 8px; height: 175px; padding: 0 5px;';

      if (!this.reverse) {
        style += 'transform: rotateZ(180deg);';
      }

      return style;
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

      return h(_templateObject(), label, this._id, this.buildStyle(), this._value, this.attrs, this.display_id, this._value);
    }
  }]);

  return Vslider;
}(Input);

module.exports = Vslider;

},{"../uid":16,"./Input":7}],15:[function(_dereq_,module,exports){
"use strict";

var o = {
  millisecond: 1
};
o.second = 1000;
o.minute = 60000;
o.hour = 3.6e6; // dst is supported post-hoc

o.day = 8.64e7; //

o.date = o.day;
o.month = 8.64e7 * 29.5; //(average)

o.week = 6.048e8;
o.year = 3.154e10; // leap-years are supported post-hoc
//add plurals

Object.keys(o).forEach(function (k) {
  o[k + 's'] = o[k];
});
module.exports = o;

},{}],16:[function(_dereq_,module,exports){
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

},{}]},{},[4])(4)
});
