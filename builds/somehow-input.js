/* somehow v0.0.1
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

var Slider = _dereq_('./inputs/Slider');

var inputs = {
  slider: function slider(obj) {
    return new Slider(obj);
  }
};
module.exports = inputs;

},{"./inputs/Slider":6}],5:[function(_dereq_,module,exports){
"use strict";

function _templateObject() {
  var data = _taggedTemplateLiteral(["<input id=\"", "\" class=\"input\" type=\"text\" value=\"", "\"/>"]);

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

var defaults = {};

var Input =
/*#__PURE__*/
function () {
  function Input() {
    var _this = this;

    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Input);

    if (typeof obj === 'string') {
      this.id = obj;
      obj = {};
    }

    this.attrs = Object.assign({}, defaults, obj);
    this.id = obj.id || 'input';
    this._value = obj.value || '';

    var cb = obj.cb || function () {};

    this.callback = function (val) {
      _this._value = val;
      cb(val);
    };

    this.mounted = false;
    this.el = null;
    this.h = htm.bind(vhtml);
  }

  _createClass(Input, [{
    key: "bind",
    value: function bind(fn) {
      this.h = htm.bind(fn);
    }
  }, {
    key: "default",
    value: function _default(val) {
      this._value = val;
      this.world.state[this.id] = this._value;
      return this;
    }
  }, {
    key: "setCallback",
    value: function setCallback() {
      var _this2 = this;

      setTimeout(function () {
        var el = document.getElementById(_this2.id);

        if (el) {
          el.addEventListener('input', function (e) {
            _this2.callback(e.target.value);
          });
        }
      }, 50);
    }
  }, {
    key: "build",
    value: function build() {
      var h = this.world.html;
      this.setCallback();
      return h(_templateObject(), this._id, this._value);
    }
  }]);

  return Input;
}();

module.exports = Input;

},{"htm":1,"vhtml":3}],6:[function(_dereq_,module,exports){
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _templateObject2() {
  var data = _taggedTemplateLiteral(["<div style=\"", "\">\n        <div style=\"", "\">", "</div>\n        ", "\n        <input type=\"range\" id=\"", "\" style=\"", "\" value=", " ...", "/>\n      </div>"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["<div style=\"", "\"> ", "</div>"]);

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

// const fns = require('../_fns')
var colors = _dereq_('spencer-color').colors;

var Input = _dereq_('./Input');

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
    var world = arguments.length > 1 ? arguments[1] : undefined;

    _classCallCheck(this, Slider);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Slider).call(this, obj, world));
    _this.attrs = Object.assign({}, defaults, _this.attrs);
    _this._title = '';
    _this._labels = [];
    _this._orientation = 'horizontal';

    if (_this._value === '') {
      _this._value = 50;
    }

    _this.id = obj.id || 'slider';
    return _this;
  }

  _createClass(Slider, [{
    key: "orientation",
    value: function orientation(str) {
      this._orientation = str;
      return this;
    }
  }, {
    key: "labels",
    value: function labels(data) {
      this._labels = data.map(function (a) {
        return {
          value: a[1],
          label: a[0]
        };
      });
      return this;
    }
  }, {
    key: "place",
    value: function place() {
      var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var _this$attrs = this.attrs,
          max = _this$attrs.max,
          min = _this$attrs.min,
          size = _this$attrs.size;
      var range = max - min;
      var spot = x - min;
      var percent = spot / range;
      return percent * size;
    }
  }, {
    key: "makeLabels",
    value: function makeLabels() {
      var _this2 = this;

      var h = this.h;
      return this._labels.map(function (o) {
        var y = _this2.place(o.value);

        var style = "position:absolute; top:".concat(y, "px; font-size:10px; color:").concat(colors.lightgrey, "; left:10px;");
        return h(_templateObject(), style, o.label);
      });
    }
  }, {
    key: "title",
    value: function title(str) {
      this._title = str;
    }
  }, {
    key: "makeStyle",
    value: function makeStyle() {
      var size = this.attrs.size;
      var styles = {
        box: "position:relative; width:".concat(size, "px; height:60px;"),
        input: "width:".concat(size, "px;"),
        title: "position:absolute; top:-20px; left:-20px; color:".concat(colors.lightgrey, "; font-size:14px;")
      };

      if (this._orientation === 'vertical') {
        styles.input += "transform: rotate(90deg); transform-origin: 0% 0%;";
        styles.box = "position:relative; height:".concat(size, "px; width:100px;");
      }

      return styles;
    }
  }, {
    key: "build",
    value: function build() {
      var h = this.h;
      this.setCallback();
      var styles = this.makeStyle();
      return h(_templateObject2(), styles.box, styles.title, this._title, this.makeLabels(), this.id, styles.input, this._value, this.attrs);
    }
  }]);

  return Slider;
}(Input);

module.exports = Slider;

},{"./Input":5,"spencer-color":2}]},{},[4])(4)
});
