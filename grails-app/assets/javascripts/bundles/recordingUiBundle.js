/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

(function(f){if(true){module.exports=f()}else { var g; }})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c=undefined;if(!f&&c)return require(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u=undefined,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(_dereq_,module,exports){
(function() {
  var colors = {
    aqua:    '#7fdbff',
    blue:    '#0074d9',
    lime:    '#01ff70',
    navy:    '#001f3f',
    teal:    '#39cccc',
    olive:   '#3d9970',
    green:   '#2ecc40',
    red:     '#ff4136',
    maroon:  '#85144b',
    orange:  '#ff851b',
    purple:  '#b10dc9',
    yellow:  '#ffdc00',
    fuchsia: '#f012be',
    gray:    '#aaaaaa',
    white:   '#ffffff',
    black:   '#111111',
    silver:  '#dddddd'
  };

  if(typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = colors;
  } else {
    window.colors = colors;
  }
})();

},{}],2:[function(_dereq_,module,exports){
'use strict';

var has = Object.prototype.hasOwnProperty
  , prefix = '~';

/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @private
 */
function Events() {}

//
// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
//
if (Object.create) {
  Events.prototype = Object.create(null);

  //
  // This hack is needed because the `__proto__` property is still inherited in
  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
  //
  if (!new Events().__proto__) prefix = false;
}

/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @private
 */
function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

/**
 * Add a listener for a given event.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} once Specify if the listener is a one-time listener.
 * @returns {EventEmitter}
 * @private
 */
function addListener(emitter, event, fn, context, once) {
  if (typeof fn !== 'function') {
    throw new TypeError('The listener must be a function');
  }

  var listener = new EE(fn, context || emitter, once)
    , evt = prefix ? prefix + event : event;

  if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
  else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
  else emitter._events[evt] = [emitter._events[evt], listener];

  return emitter;
}

/**
 * Clear event by name.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} evt The Event name.
 * @private
 */
function clearEvent(emitter, evt) {
  if (--emitter._eventsCount === 0) emitter._events = new Events();
  else delete emitter._events[evt];
}

/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @public
 */
function EventEmitter() {
  this._events = new Events();
  this._eventsCount = 0;
}

/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @public
 */
EventEmitter.prototype.eventNames = function eventNames() {
  var names = []
    , events
    , name;

  if (this._eventsCount === 0) return names;

  for (name in (events = this._events)) {
    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
  }

  if (Object.getOwnPropertySymbols) {
    return names.concat(Object.getOwnPropertySymbols(events));
  }

  return names;
};

/**
 * Return the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Array} The registered listeners.
 * @public
 */
EventEmitter.prototype.listeners = function listeners(event) {
  var evt = prefix ? prefix + event : event
    , handlers = this._events[evt];

  if (!handlers) return [];
  if (handlers.fn) return [handlers.fn];

  for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
    ee[i] = handlers[i].fn;
  }

  return ee;
};

/**
 * Return the number of listeners listening to a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Number} The number of listeners.
 * @public
 */
EventEmitter.prototype.listenerCount = function listenerCount(event) {
  var evt = prefix ? prefix + event : event
    , listeners = this._events[evt];

  if (!listeners) return 0;
  if (listeners.fn) return 1;
  return listeners.length;
};

/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @public
 */
EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return false;

  var listeners = this._events[evt]
    , len = arguments.length
    , args
    , i;

  if (listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

    switch (len) {
      case 1: return listeners.fn.call(listeners.context), true;
      case 2: return listeners.fn.call(listeners.context, a1), true;
      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len -1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length
      , j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

      switch (len) {
        case 1: listeners[i].fn.call(listeners[i].context); break;
        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
        default:
          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
            args[j - 1] = arguments[j];
          }

          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};

/**
 * Add a listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.on = function on(event, fn, context) {
  return addListener(this, event, fn, context, false);
};

/**
 * Add a one-time listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.once = function once(event, fn, context) {
  return addListener(this, event, fn, context, true);
};

/**
 * Remove the listeners of a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {*} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return this;
  if (!fn) {
    clearEvent(this, evt);
    return this;
  }

  var listeners = this._events[evt];

  if (listeners.fn) {
    if (
      listeners.fn === fn &&
      (!once || listeners.once) &&
      (!context || listeners.context === context)
    ) {
      clearEvent(this, evt);
    }
  } else {
    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
      if (
        listeners[i].fn !== fn ||
        (once && !listeners[i].once) ||
        (context && listeners[i].context !== context)
      ) {
        events.push(listeners[i]);
      }
    }

    //
    // Reset the array, or remove it completely if we have no more listeners.
    //
    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
    else clearEvent(this, evt);
  }

  return this;
};

/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {(String|Symbol)} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  var evt;

  if (event) {
    evt = prefix ? prefix + event : event;
    if (this._events[evt]) clearEvent(this, evt);
  } else {
    this._events = new Events();
    this._eventsCount = 0;
  }

  return this;
};

//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

//
// Expose the prefix.
//
EventEmitter.prefixed = prefix;

//
// Allow `EventEmitter` to be imported as module namespace.
//
EventEmitter.EventEmitter = EventEmitter;

//
// Expose the module.
//
if ('undefined' !== typeof module) {
  module.exports = EventEmitter;
}

},{}],3:[function(_dereq_,module,exports){
(function (global){
var WORKER_ENABLED = !!(global === global.window && global.URL && global.Blob && global.Worker);

function InlineWorker(func, self) {
  var _this = this;
  var functionBody;

  self = self || {};

  if (WORKER_ENABLED) {
    functionBody = func.toString().trim().match(
      /^function\s*\w*\s*\([\w\s,]*\)\s*{([\w\W]*?)}$/
    )[1];

    return new global.Worker(global.URL.createObjectURL(
      new global.Blob([ functionBody ], { type: "text/javascript" })
    ));
  }

  function postMessage(data) {
    setTimeout(function() {
      _this.onmessage({ data: data });
    }, 0);
  }

  this.self = self;
  this.self.postMessage = postMessage;

  setTimeout(func.bind(self, self), 0);
}

InlineWorker.prototype.postMessage = function postMessage(data) {
  var _this = this;

  setTimeout(function() {
    _this.self.onmessage({ data: data });
  }, 0);
};

module.exports = InlineWorker;

}).call(this,typeof __webpack_require__.g !== "undefined" ? __webpack_require__.g : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],4:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Global_1 = _dereq_("./Global");
var now = (function () {
    if (Global_1.glob.performance && Global_1.glob.performance.now) {
        return function () {
            return Global_1.glob.performance.now();
        };
    }
    return function () {
        return new Date().getTime();
    };
})();
var Animation = (function () {
    function Animation(func, layers) {
        this.id = Animation.animIdCounter++;
        this.frame = {
            time: 0,
            timeDiff: 0,
            lastTime: now(),
            frameRate: 0
        };
        this.func = func;
        this.setLayers(layers);
    }
    Animation.prototype.setLayers = function (layers) {
        var lays = [];
        if (!layers) {
            lays = [];
        }
        else if (layers.length > 0) {
            lays = layers;
        }
        else {
            lays = [layers];
        }
        this.layers = lays;
        return this;
    };
    Animation.prototype.getLayers = function () {
        return this.layers;
    };
    Animation.prototype.addLayer = function (layer) {
        var layers = this.layers, len = layers.length, n;
        for (n = 0; n < len; n++) {
            if (layers[n]._id === layer._id) {
                return false;
            }
        }
        this.layers.push(layer);
        return true;
    };
    Animation.prototype.isRunning = function () {
        var a = Animation, animations = a.animations, len = animations.length, n;
        for (n = 0; n < len; n++) {
            if (animations[n].id === this.id) {
                return true;
            }
        }
        return false;
    };
    Animation.prototype.start = function () {
        this.stop();
        this.frame.timeDiff = 0;
        this.frame.lastTime = now();
        Animation._addAnimation(this);
        return this;
    };
    Animation.prototype.stop = function () {
        Animation._removeAnimation(this);
        return this;
    };
    Animation.prototype._updateFrameObject = function (time) {
        this.frame.timeDiff = time - this.frame.lastTime;
        this.frame.lastTime = time;
        this.frame.time += this.frame.timeDiff;
        this.frame.frameRate = 1000 / this.frame.timeDiff;
    };
    Animation._addAnimation = function (anim) {
        this.animations.push(anim);
        this._handleAnimation();
    };
    Animation._removeAnimation = function (anim) {
        var id = anim.id, animations = this.animations, len = animations.length, n;
        for (n = 0; n < len; n++) {
            if (animations[n].id === id) {
                this.animations.splice(n, 1);
                break;
            }
        }
    };
    Animation._runFrames = function () {
        var layerHash = {}, animations = this.animations, anim, layers, func, n, i, layersLen, layer, key, needRedraw;
        for (n = 0; n < animations.length; n++) {
            anim = animations[n];
            layers = anim.layers;
            func = anim.func;
            anim._updateFrameObject(now());
            layersLen = layers.length;
            if (func) {
                needRedraw = func.call(anim, anim.frame) !== false;
            }
            else {
                needRedraw = true;
            }
            if (!needRedraw) {
                continue;
            }
            for (i = 0; i < layersLen; i++) {
                layer = layers[i];
                if (layer._id !== undefined) {
                    layerHash[layer._id] = layer;
                }
            }
        }
        for (key in layerHash) {
            if (!layerHash.hasOwnProperty(key)) {
                continue;
            }
            layerHash[key].draw();
        }
    };
    Animation._animationLoop = function () {
        var Anim = Animation;
        if (Anim.animations.length) {
            Anim._runFrames();
            requestAnimationFrame(Anim._animationLoop);
        }
        else {
            Anim.animRunning = false;
        }
    };
    Animation._handleAnimation = function () {
        if (!this.animRunning) {
            this.animRunning = true;
            requestAnimationFrame(this._animationLoop);
        }
    };
    Animation.animations = [];
    Animation.animIdCounter = 0;
    Animation.animRunning = false;
    return Animation;
}());
exports.Animation = Animation;

},{"./Global":11}],5:[function(_dereq_,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = _dereq_("./Util");
var Context_1 = _dereq_("./Context");
var Global_1 = _dereq_("./Global");
var Factory_1 = _dereq_("./Factory");
var Validators_1 = _dereq_("./Validators");
var _pixelRatio;
function getDevicePixelRatio() {
    if (_pixelRatio) {
        return _pixelRatio;
    }
    var canvas = Util_1.Util.createCanvasElement();
    var context = canvas.getContext('2d');
    _pixelRatio = (function () {
        var devicePixelRatio = Global_1.Konva._global.devicePixelRatio || 1, backingStoreRatio = context.webkitBackingStorePixelRatio ||
            context.mozBackingStorePixelRatio ||
            context.msBackingStorePixelRatio ||
            context.oBackingStorePixelRatio ||
            context.backingStorePixelRatio ||
            1;
        return devicePixelRatio / backingStoreRatio;
    })();
    return _pixelRatio;
}
var Canvas = (function () {
    function Canvas(config) {
        this.pixelRatio = 1;
        this.width = 0;
        this.height = 0;
        this.isCache = false;
        var conf = config || {};
        var pixelRatio = conf.pixelRatio || Global_1.Konva.pixelRatio || getDevicePixelRatio();
        this.pixelRatio = pixelRatio;
        this._canvas = Util_1.Util.createCanvasElement();
        this._canvas.style.padding = '0';
        this._canvas.style.margin = '0';
        this._canvas.style.border = '0';
        this._canvas.style.background = 'transparent';
        this._canvas.style.position = 'absolute';
        this._canvas.style.top = '0';
        this._canvas.style.left = '0';
    }
    Canvas.prototype.getContext = function () {
        return this.context;
    };
    Canvas.prototype.getPixelRatio = function () {
        return this.pixelRatio;
    };
    Canvas.prototype.setPixelRatio = function (pixelRatio) {
        var previousRatio = this.pixelRatio;
        this.pixelRatio = pixelRatio;
        this.setSize(this.getWidth() / previousRatio, this.getHeight() / previousRatio);
    };
    Canvas.prototype.setWidth = function (width) {
        this.width = this._canvas.width = width * this.pixelRatio;
        this._canvas.style.width = width + 'px';
        var pixelRatio = this.pixelRatio, _context = this.getContext()._context;
        _context.scale(pixelRatio, pixelRatio);
    };
    Canvas.prototype.setHeight = function (height) {
        this.height = this._canvas.height = height * this.pixelRatio;
        this._canvas.style.height = height + 'px';
        var pixelRatio = this.pixelRatio, _context = this.getContext()._context;
        _context.scale(pixelRatio, pixelRatio);
    };
    Canvas.prototype.getWidth = function () {
        return this.width;
    };
    Canvas.prototype.getHeight = function () {
        return this.height;
    };
    Canvas.prototype.setSize = function (width, height) {
        this.setWidth(width || 0);
        this.setHeight(height || 0);
    };
    Canvas.prototype.toDataURL = function (mimeType, quality) {
        try {
            return this._canvas.toDataURL(mimeType, quality);
        }
        catch (e) {
            try {
                return this._canvas.toDataURL();
            }
            catch (err) {
                Util_1.Util.error('Unable to get data URL. ' +
                    err.message +
                    ' For more info read https://konvajs.org/docs/posts/Tainted_Canvas.html.');
                return '';
            }
        }
    };
    return Canvas;
}());
exports.Canvas = Canvas;
Factory_1.Factory.addGetterSetter(Canvas, 'pixelRatio', undefined, Validators_1.getNumberValidator());
var SceneCanvas = (function (_super) {
    __extends(SceneCanvas, _super);
    function SceneCanvas(config) {
        if (config === void 0) { config = { width: 0, height: 0 }; }
        var _this = _super.call(this, config) || this;
        _this.context = new Context_1.SceneContext(_this);
        _this.setSize(config.width, config.height);
        return _this;
    }
    return SceneCanvas;
}(Canvas));
exports.SceneCanvas = SceneCanvas;
var HitCanvas = (function (_super) {
    __extends(HitCanvas, _super);
    function HitCanvas(config) {
        if (config === void 0) { config = { width: 0, height: 0 }; }
        var _this = _super.call(this, config) || this;
        _this.hitCanvas = true;
        _this.context = new Context_1.HitContext(_this);
        _this.setSize(config.width, config.height);
        return _this;
    }
    return HitCanvas;
}(Canvas));
exports.HitCanvas = HitCanvas;

},{"./Context":7,"./Factory":9,"./Global":11,"./Util":19,"./Validators":20}],6:[function(_dereq_,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = _dereq_("./Util");
var Factory_1 = _dereq_("./Factory");
var Node_1 = _dereq_("./Node");
var Validators_1 = _dereq_("./Validators");
var Container = (function (_super) {
    __extends(Container, _super);
    function Container() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.children = new Util_1.Collection();
        return _this;
    }
    Container.prototype.getChildren = function (filterFunc) {
        if (!filterFunc) {
            return this.children;
        }
        var results = new Util_1.Collection();
        this.children.each(function (child) {
            if (filterFunc(child)) {
                results.push(child);
            }
        });
        return results;
    };
    Container.prototype.hasChildren = function () {
        return this.getChildren().length > 0;
    };
    Container.prototype.removeChildren = function () {
        var child;
        for (var i = 0; i < this.children.length; i++) {
            child = this.children[i];
            child.parent = null;
            child.index = 0;
            child.remove();
        }
        this.children = new Util_1.Collection();
        return this;
    };
    Container.prototype.destroyChildren = function () {
        var child;
        for (var i = 0; i < this.children.length; i++) {
            child = this.children[i];
            child.parent = null;
            child.index = 0;
            child.destroy();
        }
        this.children = new Util_1.Collection();
        return this;
    };
    Container.prototype.add = function () {
        var children = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            children[_i] = arguments[_i];
        }
        if (arguments.length > 1) {
            for (var i = 0; i < arguments.length; i++) {
                this.add(arguments[i]);
            }
            return this;
        }
        var child = children[0];
        if (child.getParent()) {
            child.moveTo(this);
            return this;
        }
        var _children = this.children;
        this._validateAdd(child);
        child._clearCaches();
        child.index = _children.length;
        child.parent = this;
        _children.push(child);
        this._fire('add', {
            child: child,
        });
        return this;
    };
    Container.prototype.destroy = function () {
        if (this.hasChildren()) {
            this.destroyChildren();
        }
        _super.prototype.destroy.call(this);
        return this;
    };
    Container.prototype.find = function (selector) {
        return this._generalFind(selector, false);
    };
    Container.prototype.get = function (selector) {
        Util_1.Util.warn('collection.get() method is deprecated. Please use collection.find() instead.');
        return this.find(selector);
    };
    Container.prototype.findOne = function (selector) {
        var result = this._generalFind(selector, true);
        return result.length > 0 ? result[0] : undefined;
    };
    Container.prototype._generalFind = function (selector, findOne) {
        var retArr = [];
        this._descendants(function (node) {
            var valid = node._isMatch(selector);
            if (valid) {
                retArr.push(node);
            }
            if (valid && findOne) {
                return true;
            }
            return false;
        });
        return Util_1.Collection.toCollection(retArr);
    };
    Container.prototype._descendants = function (fn) {
        var shouldStop = false;
        for (var i = 0; i < this.children.length; i++) {
            var child = this.children[i];
            shouldStop = fn(child);
            if (shouldStop) {
                return true;
            }
            if (!child.hasChildren()) {
                continue;
            }
            shouldStop = child._descendants(fn);
            if (shouldStop) {
                return true;
            }
        }
        return false;
    };
    Container.prototype.toObject = function () {
        var obj = Node_1.Node.prototype.toObject.call(this);
        obj.children = [];
        var children = this.getChildren();
        var len = children.length;
        for (var n = 0; n < len; n++) {
            var child = children[n];
            obj.children.push(child.toObject());
        }
        return obj;
    };
    Container.prototype.isAncestorOf = function (node) {
        var parent = node.getParent();
        while (parent) {
            if (parent._id === this._id) {
                return true;
            }
            parent = parent.getParent();
        }
        return false;
    };
    Container.prototype.clone = function (obj) {
        var node = Node_1.Node.prototype.clone.call(this, obj);
        this.getChildren().each(function (no) {
            node.add(no.clone());
        });
        return node;
    };
    Container.prototype.getAllIntersections = function (pos) {
        var arr = [];
        this.find('Shape').each(function (shape) {
            if (shape.isVisible() && shape.intersects(pos)) {
                arr.push(shape);
            }
        });
        return arr;
    };
    Container.prototype._setChildrenIndices = function () {
        this.children.each(function (child, n) {
            child.index = n;
        });
    };
    Container.prototype.drawScene = function (can, top) {
        var layer = this.getLayer(), canvas = can || (layer && layer.getCanvas()), context = canvas && canvas.getContext(), cachedCanvas = this._getCanvasCache(), cachedSceneCanvas = cachedCanvas && cachedCanvas.scene;
        var caching = canvas && canvas.isCache;
        if (!this.isVisible() && !caching) {
            return this;
        }
        if (cachedSceneCanvas) {
            context.save();
            var m = this.getAbsoluteTransform(top).getMatrix();
            context.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
            this._drawCachedSceneCanvas(context);
            context.restore();
        }
        else {
            this._drawChildren('drawScene', canvas, top);
        }
        return this;
    };
    Container.prototype.drawHit = function (can, top) {
        if (!this.shouldDrawHit(top)) {
            return this;
        }
        var layer = this.getLayer(), canvas = can || (layer && layer.hitCanvas), context = canvas && canvas.getContext(), cachedCanvas = this._getCanvasCache(), cachedHitCanvas = cachedCanvas && cachedCanvas.hit;
        if (cachedHitCanvas) {
            context.save();
            var m = this.getAbsoluteTransform(top).getMatrix();
            context.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
            this._drawCachedHitCanvas(context);
            context.restore();
        }
        else {
            this._drawChildren('drawHit', canvas, top);
        }
        return this;
    };
    Container.prototype._drawChildren = function (drawMethod, canvas, top) {
        var context = canvas && canvas.getContext(), clipWidth = this.clipWidth(), clipHeight = this.clipHeight(), clipFunc = this.clipFunc(), hasClip = (clipWidth && clipHeight) || clipFunc;
        var selfCache = top === this;
        if (hasClip) {
            context.save();
            var transform = this.getAbsoluteTransform(top);
            var m = transform.getMatrix();
            context.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
            context.beginPath();
            if (clipFunc) {
                clipFunc.call(this, context, this);
            }
            else {
                var clipX = this.clipX();
                var clipY = this.clipY();
                context.rect(clipX, clipY, clipWidth, clipHeight);
            }
            context.clip();
            m = transform.copy().invert().getMatrix();
            context.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
        }
        var hasComposition = !selfCache &&
            this.globalCompositeOperation() !== 'source-over' &&
            drawMethod === 'drawScene';
        if (hasComposition) {
            context.save();
            context._applyGlobalCompositeOperation(this);
        }
        this.children.each(function (child) {
            child[drawMethod](canvas, top);
        });
        if (hasComposition) {
            context.restore();
        }
        if (hasClip) {
            context.restore();
        }
    };
    Container.prototype.getClientRect = function (config) {
        config = config || {};
        var skipTransform = config.skipTransform;
        var relativeTo = config.relativeTo;
        var minX, minY, maxX, maxY;
        var selfRect = {
            x: Infinity,
            y: Infinity,
            width: 0,
            height: 0,
        };
        var that = this;
        this.children.each(function (child) {
            if (!child.visible()) {
                return;
            }
            var rect = child.getClientRect({
                relativeTo: that,
                skipShadow: config.skipShadow,
                skipStroke: config.skipStroke,
            });
            if (rect.width === 0 && rect.height === 0) {
                return;
            }
            if (minX === undefined) {
                minX = rect.x;
                minY = rect.y;
                maxX = rect.x + rect.width;
                maxY = rect.y + rect.height;
            }
            else {
                minX = Math.min(minX, rect.x);
                minY = Math.min(minY, rect.y);
                maxX = Math.max(maxX, rect.x + rect.width);
                maxY = Math.max(maxY, rect.y + rect.height);
            }
        });
        var shapes = this.find('Shape');
        var hasVisible = false;
        for (var i = 0; i < shapes.length; i++) {
            var shape = shapes[i];
            if (shape._isVisible(this)) {
                hasVisible = true;
                break;
            }
        }
        if (hasVisible && minX !== undefined) {
            selfRect = {
                x: minX,
                y: minY,
                width: maxX - minX,
                height: maxY - minY,
            };
        }
        else {
            selfRect = {
                x: 0,
                y: 0,
                width: 0,
                height: 0,
            };
        }
        if (!skipTransform) {
            return this._transformedRect(selfRect, relativeTo);
        }
        return selfRect;
    };
    return Container;
}(Node_1.Node));
exports.Container = Container;
Factory_1.Factory.addComponentsGetterSetter(Container, 'clip', [
    'x',
    'y',
    'width',
    'height',
]);
Factory_1.Factory.addGetterSetter(Container, 'clipX', undefined, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Container, 'clipY', undefined, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Container, 'clipWidth', undefined, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Container, 'clipHeight', undefined, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Container, 'clipFunc');
Util_1.Collection.mapMethods(Container);

},{"./Factory":9,"./Node":14,"./Util":19,"./Validators":20}],7:[function(_dereq_,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = _dereq_("./Util");
var Global_1 = _dereq_("./Global");
var COMMA = ',', OPEN_PAREN = '(', CLOSE_PAREN = ')', OPEN_PAREN_BRACKET = '([', CLOSE_BRACKET_PAREN = '])', SEMICOLON = ';', DOUBLE_PAREN = '()', EQUALS = '=', CONTEXT_METHODS = [
    'arc',
    'arcTo',
    'beginPath',
    'bezierCurveTo',
    'clearRect',
    'clip',
    'closePath',
    'createLinearGradient',
    'createPattern',
    'createRadialGradient',
    'drawImage',
    'ellipse',
    'fill',
    'fillText',
    'getImageData',
    'createImageData',
    'lineTo',
    'moveTo',
    'putImageData',
    'quadraticCurveTo',
    'rect',
    'restore',
    'rotate',
    'save',
    'scale',
    'setLineDash',
    'setTransform',
    'stroke',
    'strokeText',
    'transform',
    'translate',
];
var CONTEXT_PROPERTIES = [
    'fillStyle',
    'strokeStyle',
    'shadowColor',
    'shadowBlur',
    'shadowOffsetX',
    'shadowOffsetY',
    'lineCap',
    'lineDashOffset',
    'lineJoin',
    'lineWidth',
    'miterLimit',
    'font',
    'textAlign',
    'textBaseline',
    'globalAlpha',
    'globalCompositeOperation',
    'imageSmoothingEnabled',
];
var traceArrMax = 100;
var Context = (function () {
    function Context(canvas) {
        this.canvas = canvas;
        this._context = canvas._canvas.getContext('2d');
        if (Global_1.Konva.enableTrace) {
            this.traceArr = [];
            this._enableTrace();
        }
    }
    Context.prototype.fillShape = function (shape) {
        if (shape.fillEnabled()) {
            this._fill(shape);
        }
    };
    Context.prototype._fill = function (shape) {
    };
    Context.prototype.strokeShape = function (shape) {
        if (shape.hasStroke()) {
            this._stroke(shape);
        }
    };
    Context.prototype._stroke = function (shape) {
    };
    Context.prototype.fillStrokeShape = function (shape) {
        this.fillShape(shape);
        this.strokeShape(shape);
    };
    Context.prototype.getTrace = function (relaxed) {
        var traceArr = this.traceArr, len = traceArr.length, str = '', n, trace, method, args;
        for (n = 0; n < len; n++) {
            trace = traceArr[n];
            method = trace.method;
            if (method) {
                args = trace.args;
                str += method;
                if (relaxed) {
                    str += DOUBLE_PAREN;
                }
                else {
                    if (Util_1.Util._isArray(args[0])) {
                        str += OPEN_PAREN_BRACKET + args.join(COMMA) + CLOSE_BRACKET_PAREN;
                    }
                    else {
                        str += OPEN_PAREN + args.join(COMMA) + CLOSE_PAREN;
                    }
                }
            }
            else {
                str += trace.property;
                if (!relaxed) {
                    str += EQUALS + trace.val;
                }
            }
            str += SEMICOLON;
        }
        return str;
    };
    Context.prototype.clearTrace = function () {
        this.traceArr = [];
    };
    Context.prototype._trace = function (str) {
        var traceArr = this.traceArr, len;
        traceArr.push(str);
        len = traceArr.length;
        if (len >= traceArrMax) {
            traceArr.shift();
        }
    };
    Context.prototype.reset = function () {
        var pixelRatio = this.getCanvas().getPixelRatio();
        this.setTransform(1 * pixelRatio, 0, 0, 1 * pixelRatio, 0, 0);
    };
    Context.prototype.getCanvas = function () {
        return this.canvas;
    };
    Context.prototype.clear = function (bounds) {
        var canvas = this.getCanvas();
        if (bounds) {
            this.clearRect(bounds.x || 0, bounds.y || 0, bounds.width || 0, bounds.height || 0);
        }
        else {
            this.clearRect(0, 0, canvas.getWidth() / canvas.pixelRatio, canvas.getHeight() / canvas.pixelRatio);
        }
    };
    Context.prototype._applyLineCap = function (shape) {
        var lineCap = shape.getLineCap();
        if (lineCap) {
            this.setAttr('lineCap', lineCap);
        }
    };
    Context.prototype._applyOpacity = function (shape) {
        var absOpacity = shape.getAbsoluteOpacity();
        if (absOpacity !== 1) {
            this.setAttr('globalAlpha', absOpacity);
        }
    };
    Context.prototype._applyLineJoin = function (shape) {
        var lineJoin = shape.attrs.lineJoin;
        if (lineJoin) {
            this.setAttr('lineJoin', lineJoin);
        }
    };
    Context.prototype.setAttr = function (attr, val) {
        this._context[attr] = val;
    };
    Context.prototype.arc = function (a0, a1, a2, a3, a4, a5) {
        this._context.arc(a0, a1, a2, a3, a4, a5);
    };
    Context.prototype.arcTo = function (a0, a1, a2, a3, a4) {
        this._context.arcTo(a0, a1, a2, a3, a4);
    };
    Context.prototype.beginPath = function () {
        this._context.beginPath();
    };
    Context.prototype.bezierCurveTo = function (a0, a1, a2, a3, a4, a5) {
        this._context.bezierCurveTo(a0, a1, a2, a3, a4, a5);
    };
    Context.prototype.clearRect = function (a0, a1, a2, a3) {
        this._context.clearRect(a0, a1, a2, a3);
    };
    Context.prototype.clip = function () {
        this._context.clip();
    };
    Context.prototype.closePath = function () {
        this._context.closePath();
    };
    Context.prototype.createImageData = function (a0, a1) {
        var a = arguments;
        if (a.length === 2) {
            return this._context.createImageData(a0, a1);
        }
        else if (a.length === 1) {
            return this._context.createImageData(a0);
        }
    };
    Context.prototype.createLinearGradient = function (a0, a1, a2, a3) {
        return this._context.createLinearGradient(a0, a1, a2, a3);
    };
    Context.prototype.createPattern = function (a0, a1) {
        return this._context.createPattern(a0, a1);
    };
    Context.prototype.createRadialGradient = function (a0, a1, a2, a3, a4, a5) {
        return this._context.createRadialGradient(a0, a1, a2, a3, a4, a5);
    };
    Context.prototype.drawImage = function (a0, a1, a2, a3, a4, a5, a6, a7, a8) {
        var a = arguments, _context = this._context;
        if (a.length === 3) {
            _context.drawImage(a0, a1, a2);
        }
        else if (a.length === 5) {
            _context.drawImage(a0, a1, a2, a3, a4);
        }
        else if (a.length === 9) {
            _context.drawImage(a0, a1, a2, a3, a4, a5, a6, a7, a8);
        }
    };
    Context.prototype.ellipse = function (a0, a1, a2, a3, a4, a5, a6, a7) {
        this._context.ellipse(a0, a1, a2, a3, a4, a5, a6, a7);
    };
    Context.prototype.isPointInPath = function (x, y) {
        return this._context.isPointInPath(x, y);
    };
    Context.prototype.fill = function () {
        this._context.fill();
    };
    Context.prototype.fillRect = function (x, y, width, height) {
        this._context.fillRect(x, y, width, height);
    };
    Context.prototype.strokeRect = function (x, y, width, height) {
        this._context.strokeRect(x, y, width, height);
    };
    Context.prototype.fillText = function (a0, a1, a2) {
        this._context.fillText(a0, a1, a2);
    };
    Context.prototype.measureText = function (text) {
        return this._context.measureText(text);
    };
    Context.prototype.getImageData = function (a0, a1, a2, a3) {
        return this._context.getImageData(a0, a1, a2, a3);
    };
    Context.prototype.lineTo = function (a0, a1) {
        this._context.lineTo(a0, a1);
    };
    Context.prototype.moveTo = function (a0, a1) {
        this._context.moveTo(a0, a1);
    };
    Context.prototype.rect = function (a0, a1, a2, a3) {
        this._context.rect(a0, a1, a2, a3);
    };
    Context.prototype.putImageData = function (a0, a1, a2) {
        this._context.putImageData(a0, a1, a2);
    };
    Context.prototype.quadraticCurveTo = function (a0, a1, a2, a3) {
        this._context.quadraticCurveTo(a0, a1, a2, a3);
    };
    Context.prototype.restore = function () {
        this._context.restore();
    };
    Context.prototype.rotate = function (a0) {
        this._context.rotate(a0);
    };
    Context.prototype.save = function () {
        this._context.save();
    };
    Context.prototype.scale = function (a0, a1) {
        this._context.scale(a0, a1);
    };
    Context.prototype.setLineDash = function (a0) {
        if (this._context.setLineDash) {
            this._context.setLineDash(a0);
        }
        else if ('mozDash' in this._context) {
            this._context['mozDash'] = a0;
        }
        else if ('webkitLineDash' in this._context) {
            this._context['webkitLineDash'] = a0;
        }
    };
    Context.prototype.getLineDash = function () {
        return this._context.getLineDash();
    };
    Context.prototype.setTransform = function (a0, a1, a2, a3, a4, a5) {
        this._context.setTransform(a0, a1, a2, a3, a4, a5);
    };
    Context.prototype.stroke = function () {
        this._context.stroke();
    };
    Context.prototype.strokeText = function (a0, a1, a2, a3) {
        this._context.strokeText(a0, a1, a2, a3);
    };
    Context.prototype.transform = function (a0, a1, a2, a3, a4, a5) {
        this._context.transform(a0, a1, a2, a3, a4, a5);
    };
    Context.prototype.translate = function (a0, a1) {
        this._context.translate(a0, a1);
    };
    Context.prototype._enableTrace = function () {
        var that = this, len = CONTEXT_METHODS.length, _simplifyArray = Util_1.Util._simplifyArray, origSetter = this.setAttr, n, args;
        var func = function (methodName) {
            var origMethod = that[methodName], ret;
            that[methodName] = function () {
                args = _simplifyArray(Array.prototype.slice.call(arguments, 0));
                ret = origMethod.apply(that, arguments);
                that._trace({
                    method: methodName,
                    args: args,
                });
                return ret;
            };
        };
        for (n = 0; n < len; n++) {
            func(CONTEXT_METHODS[n]);
        }
        that.setAttr = function () {
            origSetter.apply(that, arguments);
            var prop = arguments[0];
            var val = arguments[1];
            if (prop === 'shadowOffsetX' ||
                prop === 'shadowOffsetY' ||
                prop === 'shadowBlur') {
                val = val / this.canvas.getPixelRatio();
            }
            that._trace({
                property: prop,
                val: val,
            });
        };
    };
    Context.prototype._applyGlobalCompositeOperation = function (node) {
        var globalCompositeOperation = node.getGlobalCompositeOperation();
        if (globalCompositeOperation !== 'source-over') {
            this.setAttr('globalCompositeOperation', globalCompositeOperation);
        }
    };
    return Context;
}());
exports.Context = Context;
CONTEXT_PROPERTIES.forEach(function (prop) {
    Object.defineProperty(Context.prototype, prop, {
        get: function () {
            return this._context[prop];
        },
        set: function (val) {
            this._context[prop] = val;
        },
    });
});
var SceneContext = (function (_super) {
    __extends(SceneContext, _super);
    function SceneContext() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SceneContext.prototype._fillColor = function (shape) {
        var fill = shape.fill();
        this.setAttr('fillStyle', fill);
        shape._fillFunc(this);
    };
    SceneContext.prototype._fillPattern = function (shape) {
        var fillPatternX = shape.getFillPatternX(), fillPatternY = shape.getFillPatternY(), fillPatternRotation = Global_1.Konva.getAngle(shape.getFillPatternRotation()), fillPatternOffsetX = shape.getFillPatternOffsetX(), fillPatternOffsetY = shape.getFillPatternOffsetY(), fillPatternScaleX = shape.getFillPatternScaleX(), fillPatternScaleY = shape.getFillPatternScaleY();
        if (fillPatternX || fillPatternY) {
            this.translate(fillPatternX || 0, fillPatternY || 0);
        }
        if (fillPatternRotation) {
            this.rotate(fillPatternRotation);
        }
        if (fillPatternScaleX || fillPatternScaleY) {
        }
        if (fillPatternOffsetX || fillPatternOffsetY) {
            this.translate(-1 * fillPatternOffsetX, -1 * fillPatternOffsetY);
        }
        this.setAttr('fillStyle', shape._getFillPattern());
        shape._fillFunc(this);
    };
    SceneContext.prototype._fillLinearGradient = function (shape) {
        var grd = shape._getLinearGradient();
        if (grd) {
            this.setAttr('fillStyle', grd);
            shape._fillFunc(this);
        }
    };
    SceneContext.prototype._fillRadialGradient = function (shape) {
        var grd = shape._getRadialGradient();
        if (grd) {
            this.setAttr('fillStyle', grd);
            shape._fillFunc(this);
        }
    };
    SceneContext.prototype._fill = function (shape) {
        var hasColor = shape.fill(), fillPriority = shape.getFillPriority();
        if (hasColor && fillPriority === 'color') {
            this._fillColor(shape);
            return;
        }
        var hasPattern = shape.getFillPatternImage();
        if (hasPattern && fillPriority === 'pattern') {
            this._fillPattern(shape);
            return;
        }
        var hasLinearGradient = shape.getFillLinearGradientColorStops();
        if (hasLinearGradient && fillPriority === 'linear-gradient') {
            this._fillLinearGradient(shape);
            return;
        }
        var hasRadialGradient = shape.getFillRadialGradientColorStops();
        if (hasRadialGradient && fillPriority === 'radial-gradient') {
            this._fillRadialGradient(shape);
            return;
        }
        if (hasColor) {
            this._fillColor(shape);
        }
        else if (hasPattern) {
            this._fillPattern(shape);
        }
        else if (hasLinearGradient) {
            this._fillLinearGradient(shape);
        }
        else if (hasRadialGradient) {
            this._fillRadialGradient(shape);
        }
    };
    SceneContext.prototype._strokeLinearGradient = function (shape) {
        var start = shape.getStrokeLinearGradientStartPoint(), end = shape.getStrokeLinearGradientEndPoint(), colorStops = shape.getStrokeLinearGradientColorStops(), grd = this.createLinearGradient(start.x, start.y, end.x, end.y);
        if (colorStops) {
            for (var n = 0; n < colorStops.length; n += 2) {
                grd.addColorStop(colorStops[n], colorStops[n + 1]);
            }
            this.setAttr('strokeStyle', grd);
        }
    };
    SceneContext.prototype._stroke = function (shape) {
        var dash = shape.dash(), strokeScaleEnabled = shape.getStrokeScaleEnabled();
        if (shape.hasStroke()) {
            if (!strokeScaleEnabled) {
                this.save();
                var pixelRatio = this.getCanvas().getPixelRatio();
                this.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
            }
            this._applyLineCap(shape);
            if (dash && shape.dashEnabled()) {
                this.setLineDash(dash);
                this.setAttr('lineDashOffset', shape.dashOffset());
            }
            this.setAttr('lineWidth', shape.strokeWidth());
            if (!shape.getShadowForStrokeEnabled()) {
                this.setAttr('shadowColor', 'rgba(0,0,0,0)');
            }
            var hasLinearGradient = shape.getStrokeLinearGradientColorStops();
            if (hasLinearGradient) {
                this._strokeLinearGradient(shape);
            }
            else {
                this.setAttr('strokeStyle', shape.stroke());
            }
            shape._strokeFunc(this);
            if (!strokeScaleEnabled) {
                this.restore();
            }
        }
    };
    SceneContext.prototype._applyShadow = function (shape) {
        var util = Util_1.Util, color = util.get(shape.getShadowRGBA(), 'black'), blur = util.get(shape.getShadowBlur(), 5), offset = util.get(shape.getShadowOffset(), {
            x: 0,
            y: 0,
        }), scale = shape.getAbsoluteScale(), ratio = this.canvas.getPixelRatio(), scaleX = scale.x * ratio, scaleY = scale.y * ratio;
        this.setAttr('shadowColor', color);
        this.setAttr('shadowBlur', blur * Math.min(Math.abs(scaleX), Math.abs(scaleY)));
        this.setAttr('shadowOffsetX', offset.x * scaleX);
        this.setAttr('shadowOffsetY', offset.y * scaleY);
    };
    return SceneContext;
}(Context));
exports.SceneContext = SceneContext;
var HitContext = (function (_super) {
    __extends(HitContext, _super);
    function HitContext() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HitContext.prototype._fill = function (shape) {
        this.save();
        this.setAttr('fillStyle', shape.colorKey);
        shape._fillFuncHit(this);
        this.restore();
    };
    HitContext.prototype.strokeShape = function (shape) {
        if (shape.hasHitStroke()) {
            this._stroke(shape);
        }
    };
    HitContext.prototype._stroke = function (shape) {
        if (shape.hasHitStroke()) {
            var strokeScaleEnabled = shape.getStrokeScaleEnabled();
            if (!strokeScaleEnabled) {
                this.save();
                var pixelRatio = this.getCanvas().getPixelRatio();
                this.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
            }
            this._applyLineCap(shape);
            var hitStrokeWidth = shape.hitStrokeWidth();
            var strokeWidth = hitStrokeWidth === 'auto' ? shape.strokeWidth() : hitStrokeWidth;
            this.setAttr('lineWidth', strokeWidth);
            this.setAttr('strokeStyle', shape.colorKey);
            shape._strokeFuncHit(this);
            if (!strokeScaleEnabled) {
                this.restore();
            }
        }
    };
    return HitContext;
}(Context));
exports.HitContext = HitContext;

},{"./Global":11,"./Util":19}],8:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Global_1 = _dereq_("./Global");
var Util_1 = _dereq_("./Util");
exports.DD = {
    get isDragging() {
        var flag = false;
        exports.DD._dragElements.forEach(function (elem) {
            if (elem.dragStatus === 'dragging') {
                flag = true;
            }
        });
        return flag;
    },
    justDragged: false,
    get node() {
        var node;
        exports.DD._dragElements.forEach(function (elem) {
            node = elem.node;
        });
        return node;
    },
    _dragElements: new Map(),
    _drag: function (evt) {
        var nodesToFireEvents = [];
        exports.DD._dragElements.forEach(function (elem, key) {
            var node = elem.node;
            var stage = node.getStage();
            stage.setPointersPositions(evt);
            if (elem.pointerId === undefined) {
                elem.pointerId = Util_1.Util._getFirstPointerId(evt);
            }
            var pos = stage._changedPointerPositions.find(function (pos) { return pos.id === elem.pointerId; });
            if (!pos) {
                return;
            }
            if (elem.dragStatus !== 'dragging') {
                var dragDistance = node.dragDistance();
                var distance = Math.max(Math.abs(pos.x - elem.startPointerPos.x), Math.abs(pos.y - elem.startPointerPos.y));
                if (distance < dragDistance) {
                    return;
                }
                node.startDrag({ evt: evt });
                if (!node.isDragging()) {
                    return;
                }
            }
            node._setDragPosition(evt, elem);
            nodesToFireEvents.push(node);
        });
        nodesToFireEvents.forEach(function (node) {
            node.fire('dragmove', {
                type: 'dragmove',
                target: node,
                evt: evt,
            }, true);
        });
    },
    _endDragBefore: function (evt) {
        exports.DD._dragElements.forEach(function (elem, key) {
            var node = elem.node;
            var stage = node.getStage();
            if (evt) {
                stage.setPointersPositions(evt);
            }
            var pos = stage._changedPointerPositions.find(function (pos) { return pos.id === elem.pointerId; });
            if (!pos) {
                return;
            }
            if (elem.dragStatus === 'dragging' || elem.dragStatus === 'stopped') {
                exports.DD.justDragged = true;
                Global_1.Konva.listenClickTap = false;
                elem.dragStatus = 'stopped';
            }
            var drawNode = elem.node.getLayer() ||
                (elem.node instanceof Global_1.Konva['Stage'] && elem.node);
            if (drawNode) {
                drawNode.draw();
            }
        });
    },
    _endDragAfter: function (evt) {
        exports.DD._dragElements.forEach(function (elem, key) {
            if (elem.dragStatus === 'stopped') {
                elem.node.fire('dragend', {
                    type: 'dragend',
                    target: elem.node,
                    evt: evt,
                }, true);
            }
            if (elem.dragStatus !== 'dragging') {
                exports.DD._dragElements.delete(key);
            }
        });
    },
};
if (Global_1.Konva.isBrowser) {
    window.addEventListener('mouseup', exports.DD._endDragBefore, true);
    window.addEventListener('touchend', exports.DD._endDragBefore, true);
    window.addEventListener('mousemove', exports.DD._drag);
    window.addEventListener('touchmove', exports.DD._drag);
    window.addEventListener('mouseup', exports.DD._endDragAfter, false);
    window.addEventListener('touchend', exports.DD._endDragAfter, false);
}

},{"./Global":11,"./Util":19}],9:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = _dereq_("./Util");
var Validators_1 = _dereq_("./Validators");
var GET = 'get', SET = 'set';
exports.Factory = {
    addGetterSetter: function (constructor, attr, def, validator, after) {
        exports.Factory.addGetter(constructor, attr, def);
        exports.Factory.addSetter(constructor, attr, validator, after);
        exports.Factory.addOverloadedGetterSetter(constructor, attr);
    },
    addGetter: function (constructor, attr, def) {
        var method = GET + Util_1.Util._capitalize(attr);
        constructor.prototype[method] =
            constructor.prototype[method] ||
                function () {
                    var val = this.attrs[attr];
                    return val === undefined ? def : val;
                };
    },
    addSetter: function (constructor, attr, validator, after) {
        var method = SET + Util_1.Util._capitalize(attr);
        if (!constructor.prototype[method]) {
            exports.Factory.overWriteSetter(constructor, attr, validator, after);
        }
    },
    overWriteSetter: function (constructor, attr, validator, after) {
        var method = SET + Util_1.Util._capitalize(attr);
        constructor.prototype[method] = function (val) {
            if (validator && val !== undefined && val !== null) {
                val = validator.call(this, val, attr);
            }
            this._setAttr(attr, val);
            if (after) {
                after.call(this);
            }
            return this;
        };
    },
    addComponentsGetterSetter: function (constructor, attr, components, validator, after) {
        var len = components.length, capitalize = Util_1.Util._capitalize, getter = GET + capitalize(attr), setter = SET + capitalize(attr), n, component;
        constructor.prototype[getter] = function () {
            var ret = {};
            for (n = 0; n < len; n++) {
                component = components[n];
                ret[component] = this.getAttr(attr + capitalize(component));
            }
            return ret;
        };
        var basicValidator = Validators_1.getComponentValidator(components);
        constructor.prototype[setter] = function (val) {
            var oldVal = this.attrs[attr], key;
            if (validator) {
                val = validator.call(this, val);
            }
            if (basicValidator) {
                basicValidator.call(this, val, attr);
            }
            for (key in val) {
                if (!val.hasOwnProperty(key)) {
                    continue;
                }
                this._setAttr(attr + capitalize(key), val[key]);
            }
            this._fireChangeEvent(attr, oldVal, val);
            if (after) {
                after.call(this);
            }
            return this;
        };
        exports.Factory.addOverloadedGetterSetter(constructor, attr);
    },
    addOverloadedGetterSetter: function (constructor, attr) {
        var capitalizedAttr = Util_1.Util._capitalize(attr), setter = SET + capitalizedAttr, getter = GET + capitalizedAttr;
        constructor.prototype[attr] = function () {
            if (arguments.length) {
                this[setter](arguments[0]);
                return this;
            }
            return this[getter]();
        };
    },
    addDeprecatedGetterSetter: function (constructor, attr, def, validator) {
        Util_1.Util.error('Adding deprecated ' + attr);
        var method = GET + Util_1.Util._capitalize(attr);
        var message = attr +
            ' property is deprecated and will be removed soon. Look at Konva change log for more information.';
        constructor.prototype[method] = function () {
            Util_1.Util.error(message);
            var val = this.attrs[attr];
            return val === undefined ? def : val;
        };
        exports.Factory.addSetter(constructor, attr, validator, function () {
            Util_1.Util.error(message);
        });
        exports.Factory.addOverloadedGetterSetter(constructor, attr);
    },
    backCompat: function (constructor, methods) {
        Util_1.Util.each(methods, function (oldMethodName, newMethodName) {
            var method = constructor.prototype[newMethodName];
            var oldGetter = GET + Util_1.Util._capitalize(oldMethodName);
            var oldSetter = SET + Util_1.Util._capitalize(oldMethodName);
            function deprecated() {
                method.apply(this, arguments);
                Util_1.Util.error('"' +
                    oldMethodName +
                    '" method is deprecated and will be removed soon. Use ""' +
                    newMethodName +
                    '" instead.');
            }
            constructor.prototype[oldMethodName] = deprecated;
            constructor.prototype[oldGetter] = deprecated;
            constructor.prototype[oldSetter] = deprecated;
        });
    },
    afterSetFilter: function () {
        this._filterUpToDate = false;
    },
};

},{"./Util":19,"./Validators":20}],10:[function(_dereq_,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = _dereq_("./Util");
var Layer_1 = _dereq_("./Layer");
var Global_1 = _dereq_("./Global");
var FastLayer = (function (_super) {
    __extends(FastLayer, _super);
    function FastLayer(attrs) {
        var _this = _super.call(this, attrs) || this;
        _this.listening(false);
        Util_1.Util.warn('Konva.Fast layer is deprecated. Please use "new Konva.Layer({ listening: false })" instead.');
        return _this;
    }
    return FastLayer;
}(Layer_1.Layer));
exports.FastLayer = FastLayer;
FastLayer.prototype.nodeType = 'FastLayer';
Global_1._registerNode(FastLayer);
Util_1.Collection.mapMethods(FastLayer);

},{"./Global":11,"./Layer":13,"./Util":19}],11:[function(_dereq_,module,exports){
(function (global){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PI_OVER_180 = Math.PI / 180;
function detectBrowser() {
    return (typeof window !== 'undefined' &&
        ({}.toString.call(window) === '[object Window]' ||
            {}.toString.call(window) === '[object global]'));
}
var _detectIE = function (ua) {
    var msie = ua.indexOf('msie ');
    if (msie > 0) {
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }
    var trident = ua.indexOf('trident/');
    if (trident > 0) {
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }
    var edge = ua.indexOf('edge/');
    if (edge > 0) {
        return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }
    return false;
};
exports._parseUA = function (userAgent) {
    var ua = userAgent.toLowerCase(), match = /(chrome)[ /]([\w.]+)/.exec(ua) ||
        /(webkit)[ /]([\w.]+)/.exec(ua) ||
        /(opera)(?:.*version|)[ /]([\w.]+)/.exec(ua) ||
        /(msie) ([\w.]+)/.exec(ua) ||
        (ua.indexOf('compatible') < 0 &&
            /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua)) ||
        [], mobile = !!userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i), ieMobile = !!userAgent.match(/IEMobile/i);
    return {
        browser: match[1] || '',
        version: match[2] || '0',
        isIE: _detectIE(ua),
        mobile: mobile,
        ieMobile: ieMobile
    };
};
exports.glob = typeof global !== 'undefined'
    ? global
    : typeof window !== 'undefined'
        ? window
        : typeof WorkerGlobalScope !== 'undefined'
            ? self
            : {};
exports.Konva = {
    _global: exports.glob,
    version: '7.1.2',
    isBrowser: detectBrowser(),
    isUnminified: /param/.test(function (param) { }.toString()),
    dblClickWindow: 400,
    getAngle: function (angle) {
        return exports.Konva.angleDeg ? angle * PI_OVER_180 : angle;
    },
    enableTrace: false,
    _pointerEventsEnabled: false,
    hitOnDragEnabled: false,
    captureTouchEventsEnabled: false,
    listenClickTap: false,
    inDblClickWindow: false,
    pixelRatio: undefined,
    dragDistance: 3,
    angleDeg: true,
    showWarnings: true,
    dragButtons: [0, 1],
    isDragging: function () {
        return exports.Konva['DD'].isDragging;
    },
    isDragReady: function () {
        return !!exports.Konva['DD'].node;
    },
    UA: exports._parseUA((exports.glob.navigator && exports.glob.navigator.userAgent) || ''),
    document: exports.glob.document,
    _injectGlobal: function (Konva) {
        exports.glob.Konva = Konva;
    },
    _parseUA: exports._parseUA
};
exports._NODES_REGISTRY = {};
exports._registerNode = function (NodeClass) {
    exports._NODES_REGISTRY[NodeClass.prototype.getClassName()] = NodeClass;
    exports.Konva[NodeClass.prototype.getClassName()] = NodeClass;
};

}).call(this,typeof __webpack_require__.g !== "undefined" ? __webpack_require__.g : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],12:[function(_dereq_,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = _dereq_("./Util");
var Container_1 = _dereq_("./Container");
var Global_1 = _dereq_("./Global");
var Group = (function (_super) {
    __extends(Group, _super);
    function Group() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Group.prototype._validateAdd = function (child) {
        var type = child.getType();
        if (type !== 'Group' && type !== 'Shape') {
            Util_1.Util.throw('You may only add groups and shapes to groups.');
        }
    };
    return Group;
}(Container_1.Container));
exports.Group = Group;
Group.prototype.nodeType = 'Group';
Global_1._registerNode(Group);
Util_1.Collection.mapMethods(Group);

},{"./Container":6,"./Global":11,"./Util":19}],13:[function(_dereq_,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = _dereq_("./Util");
var Container_1 = _dereq_("./Container");
var Node_1 = _dereq_("./Node");
var Factory_1 = _dereq_("./Factory");
var Canvas_1 = _dereq_("./Canvas");
var Validators_1 = _dereq_("./Validators");
var Shape_1 = _dereq_("./Shape");
var Global_1 = _dereq_("./Global");
var HASH = '#', BEFORE_DRAW = 'beforeDraw', DRAW = 'draw', INTERSECTION_OFFSETS = [
    { x: 0, y: 0 },
    { x: -1, y: -1 },
    { x: 1, y: -1 },
    { x: 1, y: 1 },
    { x: -1, y: 1 },
], INTERSECTION_OFFSETS_LEN = INTERSECTION_OFFSETS.length;
var Layer = (function (_super) {
    __extends(Layer, _super);
    function Layer(config) {
        var _this = _super.call(this, config) || this;
        _this.canvas = new Canvas_1.SceneCanvas();
        _this.hitCanvas = new Canvas_1.HitCanvas({
            pixelRatio: 1,
        });
        _this._waitingForDraw = false;
        _this.on('visibleChange.konva', _this._checkVisibility);
        _this._checkVisibility();
        _this.on('imageSmoothingEnabledChange.konva', _this._setSmoothEnabled);
        _this._setSmoothEnabled();
        return _this;
    }
    Layer.prototype.createPNGStream = function () {
        var c = this.canvas._canvas;
        return c.createPNGStream();
    };
    Layer.prototype.getCanvas = function () {
        return this.canvas;
    };
    Layer.prototype.getHitCanvas = function () {
        return this.hitCanvas;
    };
    Layer.prototype.getContext = function () {
        return this.getCanvas().getContext();
    };
    Layer.prototype.clear = function (bounds) {
        this.getContext().clear(bounds);
        this.getHitCanvas().getContext().clear(bounds);
        return this;
    };
    Layer.prototype.setZIndex = function (index) {
        _super.prototype.setZIndex.call(this, index);
        var stage = this.getStage();
        if (stage) {
            stage.content.removeChild(this.getCanvas()._canvas);
            if (index < stage.children.length - 1) {
                stage.content.insertBefore(this.getCanvas()._canvas, stage.children[index + 1].getCanvas()._canvas);
            }
            else {
                stage.content.appendChild(this.getCanvas()._canvas);
            }
        }
        return this;
    };
    Layer.prototype.moveToTop = function () {
        Node_1.Node.prototype.moveToTop.call(this);
        var stage = this.getStage();
        if (stage) {
            stage.content.removeChild(this.getCanvas()._canvas);
            stage.content.appendChild(this.getCanvas()._canvas);
        }
        return true;
    };
    Layer.prototype.moveUp = function () {
        var moved = Node_1.Node.prototype.moveUp.call(this);
        if (!moved) {
            return false;
        }
        var stage = this.getStage();
        if (!stage) {
            return false;
        }
        stage.content.removeChild(this.getCanvas()._canvas);
        if (this.index < stage.children.length - 1) {
            stage.content.insertBefore(this.getCanvas()._canvas, stage.children[this.index + 1].getCanvas()._canvas);
        }
        else {
            stage.content.appendChild(this.getCanvas()._canvas);
        }
        return true;
    };
    Layer.prototype.moveDown = function () {
        if (Node_1.Node.prototype.moveDown.call(this)) {
            var stage = this.getStage();
            if (stage) {
                var children = stage.children;
                stage.content.removeChild(this.getCanvas()._canvas);
                stage.content.insertBefore(this.getCanvas()._canvas, children[this.index + 1].getCanvas()._canvas);
            }
            return true;
        }
        return false;
    };
    Layer.prototype.moveToBottom = function () {
        if (Node_1.Node.prototype.moveToBottom.call(this)) {
            var stage = this.getStage();
            if (stage) {
                var children = stage.children;
                stage.content.removeChild(this.getCanvas()._canvas);
                stage.content.insertBefore(this.getCanvas()._canvas, children[1].getCanvas()._canvas);
            }
            return true;
        }
        return false;
    };
    Layer.prototype.getLayer = function () {
        return this;
    };
    Layer.prototype.remove = function () {
        var _canvas = this.getCanvas()._canvas;
        Node_1.Node.prototype.remove.call(this);
        if (_canvas && _canvas.parentNode && Util_1.Util._isInDocument(_canvas)) {
            _canvas.parentNode.removeChild(_canvas);
        }
        return this;
    };
    Layer.prototype.getStage = function () {
        return this.parent;
    };
    Layer.prototype.setSize = function (_a) {
        var width = _a.width, height = _a.height;
        this.canvas.setSize(width, height);
        this.hitCanvas.setSize(width, height);
        this._setSmoothEnabled();
        return this;
    };
    Layer.prototype._validateAdd = function (child) {
        var type = child.getType();
        if (type !== 'Group' && type !== 'Shape') {
            Util_1.Util.throw('You may only add groups and shapes to a layer.');
        }
    };
    Layer.prototype._toKonvaCanvas = function (config) {
        config = config || {};
        config.width = config.width || this.getWidth();
        config.height = config.height || this.getHeight();
        config.x = config.x !== undefined ? config.x : this.x();
        config.y = config.y !== undefined ? config.y : this.y();
        return Node_1.Node.prototype._toKonvaCanvas.call(this, config);
    };
    Layer.prototype._checkVisibility = function () {
        var visible = this.visible();
        if (visible) {
            this.canvas._canvas.style.display = 'block';
        }
        else {
            this.canvas._canvas.style.display = 'none';
        }
    };
    Layer.prototype._setSmoothEnabled = function () {
        this.getContext()._context.imageSmoothingEnabled = this.imageSmoothingEnabled();
    };
    Layer.prototype.getWidth = function () {
        if (this.parent) {
            return this.parent.width();
        }
    };
    Layer.prototype.setWidth = function () {
        Util_1.Util.warn('Can not change width of layer. Use "stage.width(value)" function instead.');
    };
    Layer.prototype.getHeight = function () {
        if (this.parent) {
            return this.parent.height();
        }
    };
    Layer.prototype.setHeight = function () {
        Util_1.Util.warn('Can not change height of layer. Use "stage.height(value)" function instead.');
    };
    Layer.prototype.batchDraw = function () {
        var _this = this;
        if (!this._waitingForDraw) {
            this._waitingForDraw = true;
            Util_1.Util.requestAnimFrame(function () {
                _this.draw();
                _this._waitingForDraw = false;
            });
        }
        return this;
    };
    Layer.prototype.getIntersection = function (pos, selector) {
        var obj, i, intersectionOffset, shape;
        if (!this.isListening() || !this.isVisible()) {
            return null;
        }
        var spiralSearchDistance = 1;
        var continueSearch = false;
        while (true) {
            for (i = 0; i < INTERSECTION_OFFSETS_LEN; i++) {
                intersectionOffset = INTERSECTION_OFFSETS[i];
                obj = this._getIntersection({
                    x: pos.x + intersectionOffset.x * spiralSearchDistance,
                    y: pos.y + intersectionOffset.y * spiralSearchDistance,
                });
                shape = obj.shape;
                if (shape && selector) {
                    return shape.findAncestor(selector, true);
                }
                else if (shape) {
                    return shape;
                }
                continueSearch = !!obj.antialiased;
                if (!obj.antialiased) {
                    break;
                }
            }
            if (continueSearch) {
                spiralSearchDistance += 1;
            }
            else {
                return null;
            }
        }
    };
    Layer.prototype._getIntersection = function (pos) {
        var ratio = this.hitCanvas.pixelRatio;
        var p = this.hitCanvas.context.getImageData(Math.round(pos.x * ratio), Math.round(pos.y * ratio), 1, 1).data, p3 = p[3], colorKey, shape;
        if (p3 === 255) {
            colorKey = Util_1.Util._rgbToHex(p[0], p[1], p[2]);
            shape = Shape_1.shapes[HASH + colorKey];
            if (shape) {
                return {
                    shape: shape,
                };
            }
            return {
                antialiased: true,
            };
        }
        else if (p3 > 0) {
            return {
                antialiased: true,
            };
        }
        return {};
    };
    Layer.prototype.drawScene = function (can, top) {
        var layer = this.getLayer(), canvas = can || (layer && layer.getCanvas());
        this._fire(BEFORE_DRAW, {
            node: this,
        });
        if (this.clearBeforeDraw()) {
            canvas.getContext().clear();
        }
        Container_1.Container.prototype.drawScene.call(this, canvas, top);
        this._fire(DRAW, {
            node: this,
        });
        return this;
    };
    Layer.prototype.drawHit = function (can, top) {
        var layer = this.getLayer(), canvas = can || (layer && layer.hitCanvas);
        if (layer && layer.clearBeforeDraw()) {
            layer.getHitCanvas().getContext().clear();
        }
        Container_1.Container.prototype.drawHit.call(this, canvas, top);
        return this;
    };
    Layer.prototype.enableHitGraph = function () {
        this.hitGraphEnabled(true);
        return this;
    };
    Layer.prototype.disableHitGraph = function () {
        this.hitGraphEnabled(false);
        return this;
    };
    Layer.prototype.setHitGraphEnabled = function (val) {
        Util_1.Util.warn('hitGraphEnabled method is deprecated. Please use layer.listening() instead.');
        this.listening(val);
    };
    Layer.prototype.getHitGraphEnabled = function (val) {
        Util_1.Util.warn('hitGraphEnabled method is deprecated. Please use layer.listening() instead.');
        return this.listening();
    };
    Layer.prototype.toggleHitCanvas = function () {
        if (!this.parent) {
            return;
        }
        var parent = this.parent;
        var added = !!this.hitCanvas._canvas.parentNode;
        if (added) {
            parent.content.removeChild(this.hitCanvas._canvas);
        }
        else {
            parent.content.appendChild(this.hitCanvas._canvas);
        }
    };
    return Layer;
}(Container_1.Container));
exports.Layer = Layer;
Layer.prototype.nodeType = 'Layer';
Global_1._registerNode(Layer);
Factory_1.Factory.addGetterSetter(Layer, 'imageSmoothingEnabled', true);
Factory_1.Factory.addGetterSetter(Layer, 'clearBeforeDraw', true);
Factory_1.Factory.addGetterSetter(Layer, 'hitGraphEnabled', true, Validators_1.getBooleanValidator());
Util_1.Collection.mapMethods(Layer);

},{"./Canvas":5,"./Container":6,"./Factory":9,"./Global":11,"./Node":14,"./Shape":16,"./Util":19,"./Validators":20}],14:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = _dereq_("./Util");
var Factory_1 = _dereq_("./Factory");
var Canvas_1 = _dereq_("./Canvas");
var Global_1 = _dereq_("./Global");
var DragAndDrop_1 = _dereq_("./DragAndDrop");
var Validators_1 = _dereq_("./Validators");
exports.ids = {};
exports.names = {};
var _addId = function (node, id) {
    if (!id) {
        return;
    }
    exports.ids[id] = node;
};
exports._removeId = function (id, node) {
    if (!id) {
        return;
    }
    if (exports.ids[id] !== node) {
        return;
    }
    delete exports.ids[id];
};
exports._addName = function (node, name) {
    if (name) {
        if (!exports.names[name]) {
            exports.names[name] = [];
        }
        exports.names[name].push(node);
    }
};
exports._removeName = function (name, _id) {
    if (!name) {
        return;
    }
    var nodes = exports.names[name];
    if (!nodes) {
        return;
    }
    for (var n = 0; n < nodes.length; n++) {
        var no = nodes[n];
        if (no._id === _id) {
            nodes.splice(n, 1);
        }
    }
    if (nodes.length === 0) {
        delete exports.names[name];
    }
};
var ABSOLUTE_OPACITY = 'absoluteOpacity', ALL_LISTENERS = 'allEventListeners', ABSOLUTE_TRANSFORM = 'absoluteTransform', ABSOLUTE_SCALE = 'absoluteScale', CANVAS = 'canvas', CHANGE = 'Change', CHILDREN = 'children', KONVA = 'konva', LISTENING = 'listening', MOUSEENTER = 'mouseenter', MOUSELEAVE = 'mouseleave', NAME = 'name', SET = 'set', SHAPE = 'Shape', SPACE = ' ', STAGE = 'stage', TRANSFORM = 'transform', UPPER_STAGE = 'Stage', VISIBLE = 'visible', TRANSFORM_CHANGE_STR = [
    'xChange.konva',
    'yChange.konva',
    'scaleXChange.konva',
    'scaleYChange.konva',
    'skewXChange.konva',
    'skewYChange.konva',
    'rotationChange.konva',
    'offsetXChange.konva',
    'offsetYChange.konva',
    'transformsEnabledChange.konva',
].join(SPACE), SCALE_CHANGE_STR = ['scaleXChange.konva', 'scaleYChange.konva'].join(SPACE);
var emptyChildren = new Util_1.Collection();
var idCounter = 1;
var Node = (function () {
    function Node(config) {
        this._id = idCounter++;
        this.eventListeners = {};
        this.attrs = {};
        this.index = 0;
        this._allEventListeners = null;
        this.parent = null;
        this._cache = new Map();
        this._attachedDepsListeners = new Map();
        this._lastPos = null;
        this._batchingTransformChange = false;
        this._needClearTransformCache = false;
        this._filterUpToDate = false;
        this._isUnderCache = false;
        this.children = emptyChildren;
        this._dragEventId = null;
        this._shouldFireChangeEvents = false;
        this.setAttrs(config);
        this._shouldFireChangeEvents = true;
    }
    Node.prototype.hasChildren = function () {
        return false;
    };
    Node.prototype.getChildren = function () {
        return emptyChildren;
    };
    Node.prototype._clearCache = function (attr) {
        if ((attr === TRANSFORM || attr === ABSOLUTE_TRANSFORM) &&
            this._cache.get(attr)) {
            this._cache.get(attr).dirty = true;
        }
        else if (attr) {
            this._cache.delete(attr);
        }
        else {
            this._cache.clear();
        }
    };
    Node.prototype._getCache = function (attr, privateGetter) {
        var cache = this._cache.get(attr);
        var isTransform = attr === TRANSFORM || attr === ABSOLUTE_TRANSFORM;
        var invalid = cache === undefined || (isTransform && cache.dirty === true);
        if (invalid) {
            cache = privateGetter.call(this);
            this._cache.set(attr, cache);
        }
        return cache;
    };
    Node.prototype._calculate = function (name, deps, getter) {
        var _this = this;
        if (!this._attachedDepsListeners.get(name)) {
            var depsString = deps.map(function (dep) { return dep + 'Change.konva'; }).join(SPACE);
            this.on(depsString, function () {
                _this._clearCache(name);
            });
            this._attachedDepsListeners.set(name, true);
        }
        return this._getCache(name, getter);
    };
    Node.prototype._getCanvasCache = function () {
        return this._cache.get(CANVAS);
    };
    Node.prototype._clearSelfAndDescendantCache = function (attr, forceEvent) {
        this._clearCache(attr);
        if (forceEvent && attr === ABSOLUTE_TRANSFORM) {
            this.fire('_clearTransformCache');
        }
        if (this.isCached()) {
            return;
        }
        if (this.children) {
            this.children.each(function (node) {
                node._clearSelfAndDescendantCache(attr, true);
            });
        }
    };
    Node.prototype.clearCache = function () {
        this._cache.delete(CANVAS);
        this._clearSelfAndDescendantCache();
        return this;
    };
    Node.prototype.cache = function (config) {
        var conf = config || {};
        var rect = {};
        if (conf.x === undefined ||
            conf.y === undefined ||
            conf.width === undefined ||
            conf.height === undefined) {
            rect = this.getClientRect({
                skipTransform: true,
                relativeTo: this.getParent(),
            });
        }
        var width = Math.ceil(conf.width || rect.width), height = Math.ceil(conf.height || rect.height), pixelRatio = conf.pixelRatio, x = conf.x === undefined ? rect.x : conf.x, y = conf.y === undefined ? rect.y : conf.y, offset = conf.offset || 0, drawBorder = conf.drawBorder || false;
        if (!width || !height) {
            Util_1.Util.error('Can not cache the node. Width or height of the node equals 0. Caching is skipped.');
            return;
        }
        width += offset * 2;
        height += offset * 2;
        x -= offset;
        y -= offset;
        var cachedSceneCanvas = new Canvas_1.SceneCanvas({
            pixelRatio: pixelRatio,
            width: width,
            height: height,
        }), cachedFilterCanvas = new Canvas_1.SceneCanvas({
            pixelRatio: pixelRatio,
            width: 0,
            height: 0,
        }), cachedHitCanvas = new Canvas_1.HitCanvas({
            pixelRatio: 1,
            width: width,
            height: height,
        }), sceneContext = cachedSceneCanvas.getContext(), hitContext = cachedHitCanvas.getContext();
        cachedHitCanvas.isCache = true;
        cachedSceneCanvas.isCache = true;
        this._cache.delete('canvas');
        this._filterUpToDate = false;
        if (conf.imageSmoothingEnabled === false) {
            cachedSceneCanvas.getContext()._context.imageSmoothingEnabled = false;
            cachedFilterCanvas.getContext()._context.imageSmoothingEnabled = false;
        }
        sceneContext.save();
        hitContext.save();
        sceneContext.translate(-x, -y);
        hitContext.translate(-x, -y);
        this._isUnderCache = true;
        this._clearSelfAndDescendantCache(ABSOLUTE_OPACITY);
        this._clearSelfAndDescendantCache(ABSOLUTE_SCALE);
        this.drawScene(cachedSceneCanvas, this);
        this.drawHit(cachedHitCanvas, this);
        this._isUnderCache = false;
        sceneContext.restore();
        hitContext.restore();
        if (drawBorder) {
            sceneContext.save();
            sceneContext.beginPath();
            sceneContext.rect(0, 0, width, height);
            sceneContext.closePath();
            sceneContext.setAttr('strokeStyle', 'red');
            sceneContext.setAttr('lineWidth', 5);
            sceneContext.stroke();
            sceneContext.restore();
        }
        this._cache.set(CANVAS, {
            scene: cachedSceneCanvas,
            filter: cachedFilterCanvas,
            hit: cachedHitCanvas,
            x: x,
            y: y,
        });
        return this;
    };
    Node.prototype.isCached = function () {
        return this._cache.has('canvas');
    };
    Node.prototype.getClientRect = function (config) {
        throw new Error('abstract "getClientRect" method call');
    };
    Node.prototype._transformedRect = function (rect, top) {
        var points = [
            { x: rect.x, y: rect.y },
            { x: rect.x + rect.width, y: rect.y },
            { x: rect.x + rect.width, y: rect.y + rect.height },
            { x: rect.x, y: rect.y + rect.height },
        ];
        var minX, minY, maxX, maxY;
        var trans = this.getAbsoluteTransform(top);
        points.forEach(function (point) {
            var transformed = trans.point(point);
            if (minX === undefined) {
                minX = maxX = transformed.x;
                minY = maxY = transformed.y;
            }
            minX = Math.min(minX, transformed.x);
            minY = Math.min(minY, transformed.y);
            maxX = Math.max(maxX, transformed.x);
            maxY = Math.max(maxY, transformed.y);
        });
        return {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY,
        };
    };
    Node.prototype._drawCachedSceneCanvas = function (context) {
        context.save();
        context._applyOpacity(this);
        context._applyGlobalCompositeOperation(this);
        var canvasCache = this._getCanvasCache();
        context.translate(canvasCache.x, canvasCache.y);
        var cacheCanvas = this._getCachedSceneCanvas();
        var ratio = cacheCanvas.pixelRatio;
        context.drawImage(cacheCanvas._canvas, 0, 0, cacheCanvas.width / ratio, cacheCanvas.height / ratio);
        context.restore();
    };
    Node.prototype._drawCachedHitCanvas = function (context) {
        var canvasCache = this._getCanvasCache(), hitCanvas = canvasCache.hit;
        context.save();
        context.translate(canvasCache.x, canvasCache.y);
        context.drawImage(hitCanvas._canvas, 0, 0);
        context.restore();
    };
    Node.prototype._getCachedSceneCanvas = function () {
        var filters = this.filters(), cachedCanvas = this._getCanvasCache(), sceneCanvas = cachedCanvas.scene, filterCanvas = cachedCanvas.filter, filterContext = filterCanvas.getContext(), len, imageData, n, filter;
        if (filters) {
            if (!this._filterUpToDate) {
                var ratio = sceneCanvas.pixelRatio;
                filterCanvas.setSize(sceneCanvas.width / sceneCanvas.pixelRatio, sceneCanvas.height / sceneCanvas.pixelRatio);
                try {
                    len = filters.length;
                    filterContext.clear();
                    filterContext.drawImage(sceneCanvas._canvas, 0, 0, sceneCanvas.getWidth() / ratio, sceneCanvas.getHeight() / ratio);
                    imageData = filterContext.getImageData(0, 0, filterCanvas.getWidth(), filterCanvas.getHeight());
                    for (n = 0; n < len; n++) {
                        filter = filters[n];
                        if (typeof filter !== 'function') {
                            Util_1.Util.error('Filter should be type of function, but got ' +
                                typeof filter +
                                ' instead. Please check correct filters');
                            continue;
                        }
                        filter.call(this, imageData);
                        filterContext.putImageData(imageData, 0, 0);
                    }
                }
                catch (e) {
                    Util_1.Util.error('Unable to apply filter. ' +
                        e.message +
                        ' This post my help you https://konvajs.org/docs/posts/Tainted_Canvas.html.');
                }
                this._filterUpToDate = true;
            }
            return filterCanvas;
        }
        return sceneCanvas;
    };
    Node.prototype.on = function (evtStr, handler) {
        if (arguments.length === 3) {
            return this._delegate.apply(this, arguments);
        }
        var events = evtStr.split(SPACE), len = events.length, n, event, parts, baseEvent, name;
        for (n = 0; n < len; n++) {
            event = events[n];
            parts = event.split('.');
            baseEvent = parts[0];
            name = parts[1] || '';
            if (!this.eventListeners[baseEvent]) {
                this.eventListeners[baseEvent] = [];
            }
            this.eventListeners[baseEvent].push({
                name: name,
                handler: handler,
            });
        }
        return this;
    };
    Node.prototype.off = function (evtStr, callback) {
        var events = (evtStr || '').split(SPACE), len = events.length, n, t, event, parts, baseEvent, name;
        if (!evtStr) {
            for (t in this.eventListeners) {
                this._off(t);
            }
        }
        for (n = 0; n < len; n++) {
            event = events[n];
            parts = event.split('.');
            baseEvent = parts[0];
            name = parts[1];
            if (baseEvent) {
                if (this.eventListeners[baseEvent]) {
                    this._off(baseEvent, name, callback);
                }
            }
            else {
                for (t in this.eventListeners) {
                    this._off(t, name, callback);
                }
            }
        }
        return this;
    };
    Node.prototype.dispatchEvent = function (evt) {
        var e = {
            target: this,
            type: evt.type,
            evt: evt,
        };
        this.fire(evt.type, e);
        return this;
    };
    Node.prototype.addEventListener = function (type, handler) {
        this.on(type, function (evt) {
            handler.call(this, evt.evt);
        });
        return this;
    };
    Node.prototype.removeEventListener = function (type) {
        this.off(type);
        return this;
    };
    Node.prototype._delegate = function (event, selector, handler) {
        var stopNode = this;
        this.on(event, function (evt) {
            var targets = evt.target.findAncestors(selector, true, stopNode);
            for (var i = 0; i < targets.length; i++) {
                evt = Util_1.Util.cloneObject(evt);
                evt.currentTarget = targets[i];
                handler.call(targets[i], evt);
            }
        });
    };
    Node.prototype.remove = function () {
        if (this.isDragging()) {
            this.stopDrag();
        }
        DragAndDrop_1.DD._dragElements.delete(this._id);
        this._remove();
        return this;
    };
    Node.prototype._clearCaches = function () {
        this._clearSelfAndDescendantCache(ABSOLUTE_TRANSFORM);
        this._clearSelfAndDescendantCache(ABSOLUTE_OPACITY);
        this._clearSelfAndDescendantCache(ABSOLUTE_SCALE);
        this._clearSelfAndDescendantCache(STAGE);
        this._clearSelfAndDescendantCache(VISIBLE);
        this._clearSelfAndDescendantCache(LISTENING);
    };
    Node.prototype._remove = function () {
        this._clearCaches();
        var parent = this.getParent();
        if (parent && parent.children) {
            parent.children.splice(this.index, 1);
            parent._setChildrenIndices();
            this.parent = null;
        }
    };
    Node.prototype.destroy = function () {
        exports._removeId(this.id(), this);
        var names = (this.name() || '').split(/\s/g);
        for (var i = 0; i < names.length; i++) {
            var subname = names[i];
            exports._removeName(subname, this._id);
        }
        this.remove();
        return this;
    };
    Node.prototype.getAttr = function (attr) {
        var method = 'get' + Util_1.Util._capitalize(attr);
        if (Util_1.Util._isFunction(this[method])) {
            return this[method]();
        }
        return this.attrs[attr];
    };
    Node.prototype.getAncestors = function () {
        var parent = this.getParent(), ancestors = new Util_1.Collection();
        while (parent) {
            ancestors.push(parent);
            parent = parent.getParent();
        }
        return ancestors;
    };
    Node.prototype.getAttrs = function () {
        return this.attrs || {};
    };
    Node.prototype.setAttrs = function (config) {
        var _this = this;
        this._batchTransformChanges(function () {
            var key, method;
            if (!config) {
                return _this;
            }
            for (key in config) {
                if (key === CHILDREN) {
                    continue;
                }
                method = SET + Util_1.Util._capitalize(key);
                if (Util_1.Util._isFunction(_this[method])) {
                    _this[method](config[key]);
                }
                else {
                    _this._setAttr(key, config[key]);
                }
            }
        });
        return this;
    };
    Node.prototype.isListening = function () {
        return this._getCache(LISTENING, this._isListening);
    };
    Node.prototype._isListening = function (relativeTo) {
        var listening = this.listening();
        if (!listening) {
            return false;
        }
        var parent = this.getParent();
        if (parent && parent !== relativeTo && this !== relativeTo) {
            return parent._isListening(relativeTo);
        }
        else {
            return true;
        }
    };
    Node.prototype.isVisible = function () {
        return this._getCache(VISIBLE, this._isVisible);
    };
    Node.prototype._isVisible = function (relativeTo) {
        var visible = this.visible();
        if (!visible) {
            return false;
        }
        var parent = this.getParent();
        if (parent && parent !== relativeTo && this !== relativeTo) {
            return parent._isVisible(relativeTo);
        }
        else {
            return true;
        }
    };
    Node.prototype.shouldDrawHit = function (top) {
        if (top) {
            return this._isVisible(top) && this._isListening(top);
        }
        var layer = this.getLayer();
        var layerUnderDrag = false;
        DragAndDrop_1.DD._dragElements.forEach(function (elem) {
            if (elem.dragStatus !== 'dragging') {
                return;
            }
            else if (elem.node.nodeType === 'Stage') {
                layerUnderDrag = true;
            }
            else if (elem.node.getLayer() === layer) {
                layerUnderDrag = true;
            }
        });
        var dragSkip = !Global_1.Konva.hitOnDragEnabled && layerUnderDrag;
        return this.isListening() && this.isVisible() && !dragSkip;
    };
    Node.prototype.show = function () {
        this.visible(true);
        return this;
    };
    Node.prototype.hide = function () {
        this.visible(false);
        return this;
    };
    Node.prototype.getZIndex = function () {
        return this.index || 0;
    };
    Node.prototype.getAbsoluteZIndex = function () {
        var depth = this.getDepth(), that = this, index = 0, nodes, len, n, child;
        function addChildren(children) {
            nodes = [];
            len = children.length;
            for (n = 0; n < len; n++) {
                child = children[n];
                index++;
                if (child.nodeType !== SHAPE) {
                    nodes = nodes.concat(child.getChildren().toArray());
                }
                if (child._id === that._id) {
                    n = len;
                }
            }
            if (nodes.length > 0 && nodes[0].getDepth() <= depth) {
                addChildren(nodes);
            }
        }
        if (that.nodeType !== UPPER_STAGE) {
            addChildren(that.getStage().getChildren());
        }
        return index;
    };
    Node.prototype.getDepth = function () {
        var depth = 0, parent = this.parent;
        while (parent) {
            depth++;
            parent = parent.parent;
        }
        return depth;
    };
    Node.prototype._batchTransformChanges = function (func) {
        this._batchingTransformChange = true;
        func();
        this._batchingTransformChange = false;
        if (this._needClearTransformCache) {
            this._clearCache(TRANSFORM);
            this._clearSelfAndDescendantCache(ABSOLUTE_TRANSFORM, true);
        }
        this._needClearTransformCache = false;
    };
    Node.prototype.setPosition = function (pos) {
        var _this = this;
        this._batchTransformChanges(function () {
            _this.x(pos.x);
            _this.y(pos.y);
        });
        return this;
    };
    Node.prototype.getPosition = function () {
        return {
            x: this.x(),
            y: this.y(),
        };
    };
    Node.prototype.getAbsolutePosition = function (top) {
        var haveCachedParent = false;
        var parent = this.parent;
        while (parent) {
            if (parent.isCached()) {
                haveCachedParent = true;
                break;
            }
            parent = parent.parent;
        }
        if (haveCachedParent && !top) {
            top = true;
        }
        var absoluteMatrix = this.getAbsoluteTransform(top).getMatrix(), absoluteTransform = new Util_1.Transform(), offset = this.offset();
        absoluteTransform.m = absoluteMatrix.slice();
        absoluteTransform.translate(offset.x, offset.y);
        return absoluteTransform.getTranslation();
    };
    Node.prototype.setAbsolutePosition = function (pos) {
        var origTrans = this._clearTransform();
        this.attrs.x = origTrans.x;
        this.attrs.y = origTrans.y;
        delete origTrans.x;
        delete origTrans.y;
        this._clearCache(TRANSFORM);
        var it = this._getAbsoluteTransform().copy();
        it.invert();
        it.translate(pos.x, pos.y);
        pos = {
            x: this.attrs.x + it.getTranslation().x,
            y: this.attrs.y + it.getTranslation().y,
        };
        this._setTransform(origTrans);
        this.setPosition({ x: pos.x, y: pos.y });
        this._clearCache(TRANSFORM);
        this._clearSelfAndDescendantCache(ABSOLUTE_TRANSFORM);
        return this;
    };
    Node.prototype._setTransform = function (trans) {
        var key;
        for (key in trans) {
            this.attrs[key] = trans[key];
        }
    };
    Node.prototype._clearTransform = function () {
        var trans = {
            x: this.x(),
            y: this.y(),
            rotation: this.rotation(),
            scaleX: this.scaleX(),
            scaleY: this.scaleY(),
            offsetX: this.offsetX(),
            offsetY: this.offsetY(),
            skewX: this.skewX(),
            skewY: this.skewY(),
        };
        this.attrs.x = 0;
        this.attrs.y = 0;
        this.attrs.rotation = 0;
        this.attrs.scaleX = 1;
        this.attrs.scaleY = 1;
        this.attrs.offsetX = 0;
        this.attrs.offsetY = 0;
        this.attrs.skewX = 0;
        this.attrs.skewY = 0;
        return trans;
    };
    Node.prototype.move = function (change) {
        var changeX = change.x, changeY = change.y, x = this.x(), y = this.y();
        if (changeX !== undefined) {
            x += changeX;
        }
        if (changeY !== undefined) {
            y += changeY;
        }
        this.setPosition({ x: x, y: y });
        return this;
    };
    Node.prototype._eachAncestorReverse = function (func, top) {
        var family = [], parent = this.getParent(), len, n;
        if (top && top._id === this._id) {
            return;
        }
        family.unshift(this);
        while (parent && (!top || parent._id !== top._id)) {
            family.unshift(parent);
            parent = parent.parent;
        }
        len = family.length;
        for (n = 0; n < len; n++) {
            func(family[n]);
        }
    };
    Node.prototype.rotate = function (theta) {
        this.rotation(this.rotation() + theta);
        return this;
    };
    Node.prototype.moveToTop = function () {
        if (!this.parent) {
            Util_1.Util.warn('Node has no parent. moveToTop function is ignored.');
            return false;
        }
        var index = this.index;
        this.parent.children.splice(index, 1);
        this.parent.children.push(this);
        this.parent._setChildrenIndices();
        return true;
    };
    Node.prototype.moveUp = function () {
        if (!this.parent) {
            Util_1.Util.warn('Node has no parent. moveUp function is ignored.');
            return false;
        }
        var index = this.index, len = this.parent.getChildren().length;
        if (index < len - 1) {
            this.parent.children.splice(index, 1);
            this.parent.children.splice(index + 1, 0, this);
            this.parent._setChildrenIndices();
            return true;
        }
        return false;
    };
    Node.prototype.moveDown = function () {
        if (!this.parent) {
            Util_1.Util.warn('Node has no parent. moveDown function is ignored.');
            return false;
        }
        var index = this.index;
        if (index > 0) {
            this.parent.children.splice(index, 1);
            this.parent.children.splice(index - 1, 0, this);
            this.parent._setChildrenIndices();
            return true;
        }
        return false;
    };
    Node.prototype.moveToBottom = function () {
        if (!this.parent) {
            Util_1.Util.warn('Node has no parent. moveToBottom function is ignored.');
            return false;
        }
        var index = this.index;
        if (index > 0) {
            this.parent.children.splice(index, 1);
            this.parent.children.unshift(this);
            this.parent._setChildrenIndices();
            return true;
        }
        return false;
    };
    Node.prototype.setZIndex = function (zIndex) {
        if (!this.parent) {
            Util_1.Util.warn('Node has no parent. zIndex parameter is ignored.');
            return this;
        }
        if (zIndex < 0 || zIndex >= this.parent.children.length) {
            Util_1.Util.warn('Unexpected value ' +
                zIndex +
                ' for zIndex property. zIndex is just index of a node in children of its parent. Expected value is from 0 to ' +
                (this.parent.children.length - 1) +
                '.');
        }
        var index = this.index;
        this.parent.children.splice(index, 1);
        this.parent.children.splice(zIndex, 0, this);
        this.parent._setChildrenIndices();
        return this;
    };
    Node.prototype.getAbsoluteOpacity = function () {
        return this._getCache(ABSOLUTE_OPACITY, this._getAbsoluteOpacity);
    };
    Node.prototype._getAbsoluteOpacity = function () {
        var absOpacity = this.opacity();
        var parent = this.getParent();
        if (parent && !parent._isUnderCache) {
            absOpacity *= parent.getAbsoluteOpacity();
        }
        return absOpacity;
    };
    Node.prototype.moveTo = function (newContainer) {
        if (this.getParent() !== newContainer) {
            this._remove();
            newContainer.add(this);
        }
        return this;
    };
    Node.prototype.toObject = function () {
        var obj = {}, attrs = this.getAttrs(), key, val, getter, defaultValue, nonPlainObject;
        obj.attrs = {};
        for (key in attrs) {
            val = attrs[key];
            nonPlainObject =
                Util_1.Util.isObject(val) && !Util_1.Util._isPlainObject(val) && !Util_1.Util._isArray(val);
            if (nonPlainObject) {
                continue;
            }
            getter = typeof this[key] === 'function' && this[key];
            delete attrs[key];
            defaultValue = getter ? getter.call(this) : null;
            attrs[key] = val;
            if (defaultValue !== val) {
                obj.attrs[key] = val;
            }
        }
        obj.className = this.getClassName();
        return Util_1.Util._prepareToStringify(obj);
    };
    Node.prototype.toJSON = function () {
        return JSON.stringify(this.toObject());
    };
    Node.prototype.getParent = function () {
        return this.parent;
    };
    Node.prototype.findAncestors = function (selector, includeSelf, stopNode) {
        var res = [];
        if (includeSelf && this._isMatch(selector)) {
            res.push(this);
        }
        var ancestor = this.parent;
        while (ancestor) {
            if (ancestor === stopNode) {
                return res;
            }
            if (ancestor._isMatch(selector)) {
                res.push(ancestor);
            }
            ancestor = ancestor.parent;
        }
        return res;
    };
    Node.prototype.isAncestorOf = function (node) {
        return false;
    };
    Node.prototype.findAncestor = function (selector, includeSelf, stopNode) {
        return this.findAncestors(selector, includeSelf, stopNode)[0];
    };
    Node.prototype._isMatch = function (selector) {
        if (!selector) {
            return false;
        }
        if (typeof selector === 'function') {
            return selector(this);
        }
        var selectorArr = selector.replace(/ /g, '').split(','), len = selectorArr.length, n, sel;
        for (n = 0; n < len; n++) {
            sel = selectorArr[n];
            if (!Util_1.Util.isValidSelector(sel)) {
                Util_1.Util.warn('Selector "' +
                    sel +
                    '" is invalid. Allowed selectors examples are "#foo", ".bar" or "Group".');
                Util_1.Util.warn('If you have a custom shape with such className, please change it to start with upper letter like "Triangle".');
                Util_1.Util.warn('Konva is awesome, right?');
            }
            if (sel.charAt(0) === '#') {
                if (this.id() === sel.slice(1)) {
                    return true;
                }
            }
            else if (sel.charAt(0) === '.') {
                if (this.hasName(sel.slice(1))) {
                    return true;
                }
            }
            else if (this.className === sel || this.nodeType === sel) {
                return true;
            }
        }
        return false;
    };
    Node.prototype.getLayer = function () {
        var parent = this.getParent();
        return parent ? parent.getLayer() : null;
    };
    Node.prototype.getStage = function () {
        return this._getCache(STAGE, this._getStage);
    };
    Node.prototype._getStage = function () {
        var parent = this.getParent();
        if (parent) {
            return parent.getStage();
        }
        else {
            return undefined;
        }
    };
    Node.prototype.fire = function (eventType, evt, bubble) {
        if (evt === void 0) { evt = {}; }
        evt.target = evt.target || this;
        if (bubble) {
            this._fireAndBubble(eventType, evt);
        }
        else {
            this._fire(eventType, evt);
        }
        return this;
    };
    Node.prototype.getAbsoluteTransform = function (top) {
        if (top) {
            return this._getAbsoluteTransform(top);
        }
        else {
            return this._getCache(ABSOLUTE_TRANSFORM, this._getAbsoluteTransform);
        }
    };
    Node.prototype._getAbsoluteTransform = function (top) {
        var at;
        if (top) {
            at = new Util_1.Transform();
            this._eachAncestorReverse(function (node) {
                var transformsEnabled = node.transformsEnabled();
                if (transformsEnabled === 'all') {
                    at.multiply(node.getTransform());
                }
                else if (transformsEnabled === 'position') {
                    at.translate(node.x() - node.offsetX(), node.y() - node.offsetY());
                }
            }, top);
            return at;
        }
        else {
            at = this._cache.get(ABSOLUTE_TRANSFORM) || new Util_1.Transform();
            if (this.parent) {
                this.parent.getAbsoluteTransform().copyInto(at);
            }
            else {
                at.reset();
            }
            var transformsEnabled = this.transformsEnabled();
            if (transformsEnabled === 'all') {
                at.multiply(this.getTransform());
            }
            else if (transformsEnabled === 'position') {
                var x = this.attrs.x || 0;
                var y = this.attrs.y || 0;
                var offsetX = this.attrs.offsetX || 0;
                var offsetY = this.attrs.offsetY || 0;
                at.translate(x - offsetX, y - offsetY);
            }
            at.dirty = false;
            return at;
        }
    };
    Node.prototype.getAbsoluteScale = function (top) {
        var parent = this;
        while (parent) {
            if (parent._isUnderCache) {
                top = parent;
            }
            parent = parent.getParent();
        }
        var transform = this.getAbsoluteTransform(top);
        var attrs = transform.decompose();
        return {
            x: attrs.scaleX,
            y: attrs.scaleY,
        };
    };
    Node.prototype.getAbsoluteRotation = function () {
        return this.getAbsoluteTransform().decompose().rotation;
    };
    Node.prototype.getTransform = function () {
        return this._getCache(TRANSFORM, this._getTransform);
    };
    Node.prototype._getTransform = function () {
        var _a, _b;
        var m = this._cache.get(TRANSFORM) || new Util_1.Transform();
        m.reset();
        var x = this.x(), y = this.y(), rotation = Global_1.Konva.getAngle(this.rotation()), scaleX = (_a = this.attrs.scaleX) !== null && _a !== void 0 ? _a : 1, scaleY = (_b = this.attrs.scaleY) !== null && _b !== void 0 ? _b : 1, skewX = this.attrs.skewX || 0, skewY = this.attrs.skewY || 0, offsetX = this.attrs.offsetX || 0, offsetY = this.attrs.offsetY || 0;
        if (x !== 0 || y !== 0) {
            m.translate(x, y);
        }
        if (rotation !== 0) {
            m.rotate(rotation);
        }
        if (skewX !== 0 || skewY !== 0) {
            m.skew(skewX, skewY);
        }
        if (scaleX !== 1 || scaleY !== 1) {
            m.scale(scaleX, scaleY);
        }
        if (offsetX !== 0 || offsetY !== 0) {
            m.translate(-1 * offsetX, -1 * offsetY);
        }
        m.dirty = false;
        return m;
    };
    Node.prototype.clone = function (obj) {
        var attrs = Util_1.Util.cloneObject(this.attrs), key, allListeners, len, n, listener;
        for (key in obj) {
            attrs[key] = obj[key];
        }
        var node = new this.constructor(attrs);
        for (key in this.eventListeners) {
            allListeners = this.eventListeners[key];
            len = allListeners.length;
            for (n = 0; n < len; n++) {
                listener = allListeners[n];
                if (listener.name.indexOf(KONVA) < 0) {
                    if (!node.eventListeners[key]) {
                        node.eventListeners[key] = [];
                    }
                    node.eventListeners[key].push(listener);
                }
            }
        }
        return node;
    };
    Node.prototype._toKonvaCanvas = function (config) {
        config = config || {};
        var box = this.getClientRect();
        var stage = this.getStage(), x = config.x !== undefined ? config.x : box.x, y = config.y !== undefined ? config.y : box.y, pixelRatio = config.pixelRatio || 1, canvas = new Canvas_1.SceneCanvas({
            width: config.width || box.width || (stage ? stage.width() : 0),
            height: config.height || box.height || (stage ? stage.height() : 0),
            pixelRatio: pixelRatio,
        }), context = canvas.getContext();
        context.save();
        if (x || y) {
            context.translate(-1 * x, -1 * y);
        }
        this.drawScene(canvas);
        context.restore();
        return canvas;
    };
    Node.prototype.toCanvas = function (config) {
        return this._toKonvaCanvas(config)._canvas;
    };
    Node.prototype.toDataURL = function (config) {
        config = config || {};
        var mimeType = config.mimeType || null, quality = config.quality || null;
        var url = this._toKonvaCanvas(config).toDataURL(mimeType, quality);
        if (config.callback) {
            config.callback(url);
        }
        return url;
    };
    Node.prototype.toImage = function (config) {
        if (!config || !config.callback) {
            throw 'callback required for toImage method config argument';
        }
        var callback = config.callback;
        delete config.callback;
        Util_1.Util._urlToImage(this.toDataURL(config), function (img) {
            callback(img);
        });
    };
    Node.prototype.setSize = function (size) {
        this.width(size.width);
        this.height(size.height);
        return this;
    };
    Node.prototype.getSize = function () {
        return {
            width: this.width(),
            height: this.height(),
        };
    };
    Node.prototype.getClassName = function () {
        return this.className || this.nodeType;
    };
    Node.prototype.getType = function () {
        return this.nodeType;
    };
    Node.prototype.getDragDistance = function () {
        if (this.attrs.dragDistance !== undefined) {
            return this.attrs.dragDistance;
        }
        else if (this.parent) {
            return this.parent.getDragDistance();
        }
        else {
            return Global_1.Konva.dragDistance;
        }
    };
    Node.prototype._off = function (type, name, callback) {
        var evtListeners = this.eventListeners[type], i, evtName, handler;
        for (i = 0; i < evtListeners.length; i++) {
            evtName = evtListeners[i].name;
            handler = evtListeners[i].handler;
            if ((evtName !== 'konva' || name === 'konva') &&
                (!name || evtName === name) &&
                (!callback || callback === handler)) {
                evtListeners.splice(i, 1);
                if (evtListeners.length === 0) {
                    delete this.eventListeners[type];
                    break;
                }
                i--;
            }
        }
    };
    Node.prototype._fireChangeEvent = function (attr, oldVal, newVal) {
        this._fire(attr + CHANGE, {
            oldVal: oldVal,
            newVal: newVal,
        });
    };
    Node.prototype.setId = function (id) {
        var oldId = this.id();
        exports._removeId(oldId, this);
        _addId(this, id);
        this._setAttr('id', id);
        return this;
    };
    Node.prototype.setName = function (name) {
        var oldNames = (this.name() || '').split(/\s/g);
        var newNames = (name || '').split(/\s/g);
        var subname, i;
        for (i = 0; i < oldNames.length; i++) {
            subname = oldNames[i];
            if (newNames.indexOf(subname) === -1 && subname) {
                exports._removeName(subname, this._id);
            }
        }
        for (i = 0; i < newNames.length; i++) {
            subname = newNames[i];
            if (oldNames.indexOf(subname) === -1 && subname) {
                exports._addName(this, subname);
            }
        }
        this._setAttr(NAME, name);
        return this;
    };
    Node.prototype.addName = function (name) {
        if (!this.hasName(name)) {
            var oldName = this.name();
            var newName = oldName ? oldName + ' ' + name : name;
            this.setName(newName);
        }
        return this;
    };
    Node.prototype.hasName = function (name) {
        if (!name) {
            return false;
        }
        var fullName = this.name();
        if (!fullName) {
            return false;
        }
        var names = (fullName || '').split(/\s/g);
        return names.indexOf(name) !== -1;
    };
    Node.prototype.removeName = function (name) {
        var names = (this.name() || '').split(/\s/g);
        var index = names.indexOf(name);
        if (index !== -1) {
            names.splice(index, 1);
            this.setName(names.join(' '));
        }
        return this;
    };
    Node.prototype.setAttr = function (attr, val) {
        var func = this[SET + Util_1.Util._capitalize(attr)];
        if (Util_1.Util._isFunction(func)) {
            func.call(this, val);
        }
        else {
            this._setAttr(attr, val);
        }
        return this;
    };
    Node.prototype._setAttr = function (key, val, skipFire) {
        if (skipFire === void 0) { skipFire = false; }
        var oldVal = this.attrs[key];
        if (oldVal === val && !Util_1.Util.isObject(val)) {
            return;
        }
        if (val === undefined || val === null) {
            delete this.attrs[key];
        }
        else {
            this.attrs[key] = val;
        }
        if (this._shouldFireChangeEvents) {
            this._fireChangeEvent(key, oldVal, val);
        }
    };
    Node.prototype._setComponentAttr = function (key, component, val) {
        var oldVal;
        if (val !== undefined) {
            oldVal = this.attrs[key];
            if (!oldVal) {
                this.attrs[key] = this.getAttr(key);
            }
            this.attrs[key][component] = val;
            this._fireChangeEvent(key, oldVal, val);
        }
    };
    Node.prototype._fireAndBubble = function (eventType, evt, compareShape) {
        if (evt && this.nodeType === SHAPE) {
            evt.target = this;
        }
        var shouldStop = (eventType === MOUSEENTER || eventType === MOUSELEAVE) &&
            ((compareShape &&
                (this === compareShape ||
                    (this.isAncestorOf && this.isAncestorOf(compareShape)))) ||
                (this.nodeType === 'Stage' && !compareShape));
        if (!shouldStop) {
            this._fire(eventType, evt);
            var stopBubble = (eventType === MOUSEENTER || eventType === MOUSELEAVE) &&
                compareShape &&
                compareShape.isAncestorOf &&
                compareShape.isAncestorOf(this) &&
                !compareShape.isAncestorOf(this.parent);
            if (((evt && !evt.cancelBubble) || !evt) &&
                this.parent &&
                this.parent.isListening() &&
                !stopBubble) {
                if (compareShape && compareShape.parent) {
                    this._fireAndBubble.call(this.parent, eventType, evt, compareShape);
                }
                else {
                    this._fireAndBubble.call(this.parent, eventType, evt);
                }
            }
        }
    };
    Node.prototype._getListeners = function (eventType) {
        var totalEvents = [];
        var obj;
        while (true) {
            obj = obj ? Object.getPrototypeOf(obj) : this;
            if (!obj) {
                break;
            }
            if (!obj.eventListeners) {
                continue;
            }
            var events = obj.eventListeners[eventType];
            if (!events) {
                continue;
            }
            totalEvents = events.concat(totalEvents);
            obj = Object.getPrototypeOf(obj);
        }
        return totalEvents;
    };
    Node.prototype._fire = function (eventType, evt) {
        var events = this._getListeners(eventType), i;
        if (events.length) {
            evt = evt || {};
            evt.currentTarget = this;
            evt.type = eventType;
            for (i = 0; i < events.length; i++) {
                events[i].handler.call(this, evt);
            }
        }
    };
    Node.prototype.draw = function () {
        this.drawScene();
        this.drawHit();
        return this;
    };
    Node.prototype._createDragElement = function (evt) {
        var pointerId = evt ? evt.pointerId : undefined;
        var stage = this.getStage();
        var ap = this.getAbsolutePosition();
        var pos = stage._getPointerById(pointerId) ||
            stage._changedPointerPositions[0] ||
            ap;
        DragAndDrop_1.DD._dragElements.set(this._id, {
            node: this,
            startPointerPos: pos,
            offset: {
                x: pos.x - ap.x,
                y: pos.y - ap.y,
            },
            dragStatus: 'ready',
            pointerId: pointerId,
        });
    };
    Node.prototype.startDrag = function (evt, bubbleEvent) {
        if (bubbleEvent === void 0) { bubbleEvent = true; }
        if (!DragAndDrop_1.DD._dragElements.has(this._id)) {
            this._createDragElement(evt);
        }
        var elem = DragAndDrop_1.DD._dragElements.get(this._id);
        elem.dragStatus = 'dragging';
        this.fire('dragstart', {
            type: 'dragstart',
            target: this,
            evt: evt && evt.evt,
        }, bubbleEvent);
    };
    Node.prototype._setDragPosition = function (evt, elem) {
        var pos = this.getStage()._getPointerById(elem.pointerId);
        if (!pos) {
            return;
        }
        var newNodePos = {
            x: pos.x - elem.offset.x,
            y: pos.y - elem.offset.y,
        };
        var dbf = this.dragBoundFunc();
        if (dbf !== undefined) {
            var bounded = dbf.call(this, newNodePos, evt);
            if (!bounded) {
                Util_1.Util.warn('dragBoundFunc did not return any value. That is unexpected behavior. You must return new absolute position from dragBoundFunc.');
            }
            else {
                newNodePos = bounded;
            }
        }
        if (!this._lastPos ||
            this._lastPos.x !== newNodePos.x ||
            this._lastPos.y !== newNodePos.y) {
            this.setAbsolutePosition(newNodePos);
            if (this.getLayer()) {
                this.getLayer().batchDraw();
            }
            else if (this.getStage()) {
                this.getStage().batchDraw();
            }
        }
        this._lastPos = newNodePos;
    };
    Node.prototype.stopDrag = function (evt) {
        var elem = DragAndDrop_1.DD._dragElements.get(this._id);
        if (elem) {
            elem.dragStatus = 'stopped';
        }
        DragAndDrop_1.DD._endDragBefore(evt);
        DragAndDrop_1.DD._endDragAfter(evt);
    };
    Node.prototype.setDraggable = function (draggable) {
        this._setAttr('draggable', draggable);
        this._dragChange();
    };
    Node.prototype.isDragging = function () {
        var elem = DragAndDrop_1.DD._dragElements.get(this._id);
        return elem ? elem.dragStatus === 'dragging' : false;
    };
    Node.prototype._listenDrag = function () {
        this._dragCleanup();
        this.on('mousedown.konva touchstart.konva', function (evt) {
            var _this = this;
            var shouldCheckButton = evt.evt['button'] !== undefined;
            var canDrag = !shouldCheckButton || Global_1.Konva.dragButtons.indexOf(evt.evt['button']) >= 0;
            if (!canDrag) {
                return;
            }
            if (this.isDragging()) {
                return;
            }
            var hasDraggingChild = false;
            DragAndDrop_1.DD._dragElements.forEach(function (elem) {
                if (_this.isAncestorOf(elem.node)) {
                    hasDraggingChild = true;
                }
            });
            if (!hasDraggingChild) {
                this._createDragElement(evt);
            }
        });
    };
    Node.prototype._dragChange = function () {
        if (this.attrs.draggable) {
            this._listenDrag();
        }
        else {
            this._dragCleanup();
            var stage = this.getStage();
            if (!stage) {
                return;
            }
            var dragElement = DragAndDrop_1.DD._dragElements.get(this._id);
            var isDragging = dragElement && dragElement.dragStatus === 'dragging';
            var isReady = dragElement && dragElement.dragStatus === 'ready';
            if (isDragging) {
                this.stopDrag();
            }
            else if (isReady) {
                DragAndDrop_1.DD._dragElements.delete(this._id);
            }
        }
    };
    Node.prototype._dragCleanup = function () {
        this.off('mousedown.konva');
        this.off('touchstart.konva');
    };
    Node.create = function (data, container) {
        if (Util_1.Util._isString(data)) {
            data = JSON.parse(data);
        }
        return this._createNode(data, container);
    };
    Node._createNode = function (obj, container) {
        var className = Node.prototype.getClassName.call(obj), children = obj.children, no, len, n;
        if (container) {
            obj.attrs.container = container;
        }
        if (!Global_1._NODES_REGISTRY[className]) {
            Util_1.Util.warn('Can not find a node with class name "' +
                className +
                '". Fallback to "Shape".');
            className = 'Shape';
        }
        var Class = Global_1._NODES_REGISTRY[className];
        no = new Class(obj.attrs);
        if (children) {
            len = children.length;
            for (n = 0; n < len; n++) {
                no.add(Node._createNode(children[n]));
            }
        }
        return no;
    };
    return Node;
}());
exports.Node = Node;
Node.prototype.nodeType = 'Node';
Node.prototype._attrsAffectingSize = [];
Node.prototype.eventListeners = {};
Node.prototype.on.call(Node.prototype, TRANSFORM_CHANGE_STR, function () {
    if (this._batchingTransformChange) {
        this._needClearTransformCache = true;
        return;
    }
    this._clearCache(TRANSFORM);
    this._clearSelfAndDescendantCache(ABSOLUTE_TRANSFORM);
});
Node.prototype.on.call(Node.prototype, 'visibleChange.konva', function () {
    this._clearSelfAndDescendantCache(VISIBLE);
});
Node.prototype.on.call(Node.prototype, 'listeningChange.konva', function () {
    this._clearSelfAndDescendantCache(LISTENING);
});
Node.prototype.on.call(Node.prototype, 'opacityChange.konva', function () {
    this._clearSelfAndDescendantCache(ABSOLUTE_OPACITY);
});
var addGetterSetter = Factory_1.Factory.addGetterSetter;
addGetterSetter(Node, 'zIndex');
addGetterSetter(Node, 'absolutePosition');
addGetterSetter(Node, 'position');
addGetterSetter(Node, 'x', 0, Validators_1.getNumberValidator());
addGetterSetter(Node, 'y', 0, Validators_1.getNumberValidator());
addGetterSetter(Node, 'globalCompositeOperation', 'source-over', Validators_1.getStringValidator());
addGetterSetter(Node, 'opacity', 1, Validators_1.getNumberValidator());
addGetterSetter(Node, 'name', '', Validators_1.getStringValidator());
addGetterSetter(Node, 'id', '', Validators_1.getStringValidator());
addGetterSetter(Node, 'rotation', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addComponentsGetterSetter(Node, 'scale', ['x', 'y']);
addGetterSetter(Node, 'scaleX', 1, Validators_1.getNumberValidator());
addGetterSetter(Node, 'scaleY', 1, Validators_1.getNumberValidator());
Factory_1.Factory.addComponentsGetterSetter(Node, 'skew', ['x', 'y']);
addGetterSetter(Node, 'skewX', 0, Validators_1.getNumberValidator());
addGetterSetter(Node, 'skewY', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addComponentsGetterSetter(Node, 'offset', ['x', 'y']);
addGetterSetter(Node, 'offsetX', 0, Validators_1.getNumberValidator());
addGetterSetter(Node, 'offsetY', 0, Validators_1.getNumberValidator());
addGetterSetter(Node, 'dragDistance', null, Validators_1.getNumberValidator());
addGetterSetter(Node, 'width', 0, Validators_1.getNumberValidator());
addGetterSetter(Node, 'height', 0, Validators_1.getNumberValidator());
addGetterSetter(Node, 'listening', true, Validators_1.getBooleanValidator());
addGetterSetter(Node, 'preventDefault', true, Validators_1.getBooleanValidator());
addGetterSetter(Node, 'filters', null, function (val) {
    this._filterUpToDate = false;
    return val;
});
addGetterSetter(Node, 'visible', true, Validators_1.getBooleanValidator());
addGetterSetter(Node, 'transformsEnabled', 'all', Validators_1.getStringValidator());
addGetterSetter(Node, 'size');
addGetterSetter(Node, 'dragBoundFunc');
addGetterSetter(Node, 'draggable', false, Validators_1.getBooleanValidator());
Factory_1.Factory.backCompat(Node, {
    rotateDeg: 'rotate',
    setRotationDeg: 'setRotation',
    getRotationDeg: 'getRotation',
});
Util_1.Collection.mapMethods(Node);

},{"./Canvas":5,"./DragAndDrop":8,"./Factory":9,"./Global":11,"./Util":19,"./Validators":20}],15:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Global_1 = _dereq_("./Global");
var Captures = new Map();
var SUPPORT_POINTER_EVENTS = Global_1.Konva._global['PointerEvent'] !== undefined;
function getCapturedShape(pointerId) {
    return Captures.get(pointerId);
}
exports.getCapturedShape = getCapturedShape;
function createEvent(evt) {
    return {
        evt: evt,
        pointerId: evt.pointerId
    };
}
exports.createEvent = createEvent;
function hasPointerCapture(pointerId, shape) {
    return Captures.get(pointerId) === shape;
}
exports.hasPointerCapture = hasPointerCapture;
function setPointerCapture(pointerId, shape) {
    releaseCapture(pointerId);
    var stage = shape.getStage();
    if (!stage)
        return;
    Captures.set(pointerId, shape);
    if (SUPPORT_POINTER_EVENTS) {
        shape._fire('gotpointercapture', createEvent(new PointerEvent('gotpointercapture')));
    }
}
exports.setPointerCapture = setPointerCapture;
function releaseCapture(pointerId, target) {
    var shape = Captures.get(pointerId);
    if (!shape)
        return;
    var stage = shape.getStage();
    if (stage && stage.content) {
    }
    Captures.delete(pointerId);
    if (SUPPORT_POINTER_EVENTS) {
        shape._fire('lostpointercapture', createEvent(new PointerEvent('lostpointercapture')));
    }
}
exports.releaseCapture = releaseCapture;

},{"./Global":11}],16:[function(_dereq_,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = _dereq_("./Util");
var Factory_1 = _dereq_("./Factory");
var Node_1 = _dereq_("./Node");
var Validators_1 = _dereq_("./Validators");
var Global_1 = _dereq_("./Global");
var PointerEvents = _dereq_("./PointerEvents");
var HAS_SHADOW = 'hasShadow';
var SHADOW_RGBA = 'shadowRGBA';
var patternImage = 'patternImage';
var linearGradient = 'linearGradient';
var radialGradient = 'radialGradient';
var dummyContext;
function getDummyContext() {
    if (dummyContext) {
        return dummyContext;
    }
    dummyContext = Util_1.Util.createCanvasElement().getContext('2d');
    return dummyContext;
}
exports.shapes = {};
function _fillFunc(context) {
    context.fill();
}
function _strokeFunc(context) {
    context.stroke();
}
function _fillFuncHit(context) {
    context.fill();
}
function _strokeFuncHit(context) {
    context.stroke();
}
function _clearHasShadowCache() {
    this._clearCache(HAS_SHADOW);
}
function _clearGetShadowRGBACache() {
    this._clearCache(SHADOW_RGBA);
}
function _clearFillPatternCache() {
    this._clearCache(patternImage);
}
function _clearLinearGradientCache() {
    this._clearCache(linearGradient);
}
function _clearRadialGradientCache() {
    this._clearCache(radialGradient);
}
var Shape = (function (_super) {
    __extends(Shape, _super);
    function Shape(config) {
        var _this = _super.call(this, config) || this;
        var key;
        while (true) {
            key = Util_1.Util.getRandomColor();
            if (key && !(key in exports.shapes)) {
                break;
            }
        }
        _this.colorKey = key;
        exports.shapes[key] = _this;
        return _this;
    }
    Shape.prototype.getContext = function () {
        return this.getLayer().getContext();
    };
    Shape.prototype.getCanvas = function () {
        return this.getLayer().getCanvas();
    };
    Shape.prototype.getSceneFunc = function () {
        return this.attrs.sceneFunc || this['_sceneFunc'];
    };
    Shape.prototype.getHitFunc = function () {
        return this.attrs.hitFunc || this['_hitFunc'];
    };
    Shape.prototype.hasShadow = function () {
        return this._getCache(HAS_SHADOW, this._hasShadow);
    };
    Shape.prototype._hasShadow = function () {
        return (this.shadowEnabled() &&
            this.shadowOpacity() !== 0 &&
            !!(this.shadowColor() ||
                this.shadowBlur() ||
                this.shadowOffsetX() ||
                this.shadowOffsetY()));
    };
    Shape.prototype._getFillPattern = function () {
        return this._getCache(patternImage, this.__getFillPattern);
    };
    Shape.prototype.__getFillPattern = function () {
        if (this.fillPatternImage()) {
            var ctx = getDummyContext();
            var pattern = ctx.createPattern(this.fillPatternImage(), this.fillPatternRepeat() || 'repeat');
            if (pattern && pattern.setTransform) {
                pattern.setTransform({
                    a: this.fillPatternScaleX(),
                    b: 0,
                    c: 0,
                    d: this.fillPatternScaleY(),
                    e: 0,
                    f: 0,
                });
            }
            return pattern;
        }
    };
    Shape.prototype._getLinearGradient = function () {
        return this._getCache(linearGradient, this.__getLinearGradient);
    };
    Shape.prototype.__getLinearGradient = function () {
        var colorStops = this.fillLinearGradientColorStops();
        if (colorStops) {
            var ctx = getDummyContext();
            var start = this.fillLinearGradientStartPoint();
            var end = this.fillLinearGradientEndPoint();
            var grd = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
            for (var n = 0; n < colorStops.length; n += 2) {
                grd.addColorStop(colorStops[n], colorStops[n + 1]);
            }
            return grd;
        }
    };
    Shape.prototype._getRadialGradient = function () {
        return this._getCache(radialGradient, this.__getRadialGradient);
    };
    Shape.prototype.__getRadialGradient = function () {
        var colorStops = this.fillRadialGradientColorStops();
        if (colorStops) {
            var ctx = getDummyContext();
            var start = this.fillRadialGradientStartPoint();
            var end = this.fillRadialGradientEndPoint();
            var grd = ctx.createRadialGradient(start.x, start.y, this.fillRadialGradientStartRadius(), end.x, end.y, this.fillRadialGradientEndRadius());
            for (var n = 0; n < colorStops.length; n += 2) {
                grd.addColorStop(colorStops[n], colorStops[n + 1]);
            }
            return grd;
        }
    };
    Shape.prototype.getShadowRGBA = function () {
        return this._getCache(SHADOW_RGBA, this._getShadowRGBA);
    };
    Shape.prototype._getShadowRGBA = function () {
        if (this.hasShadow()) {
            var rgba = Util_1.Util.colorToRGBA(this.shadowColor());
            return ('rgba(' +
                rgba.r +
                ',' +
                rgba.g +
                ',' +
                rgba.b +
                ',' +
                rgba.a * (this.shadowOpacity() || 1) +
                ')');
        }
    };
    Shape.prototype.hasFill = function () {
        var _this = this;
        return this._calculate('hasFill', [
            'fillEnabled',
            'fill',
            'fillPatternImage',
            'fillLinearGradientColorStops',
            'fillRadialGradientColorStops',
        ], function () {
            return (_this.fillEnabled() &&
                !!(_this.fill() ||
                    _this.fillPatternImage() ||
                    _this.fillLinearGradientColorStops() ||
                    _this.fillRadialGradientColorStops()));
        });
    };
    Shape.prototype.hasStroke = function () {
        var _this = this;
        return this._calculate('hasStroke', [
            'strokeEnabled',
            'strokeWidth',
            'stroke',
            'strokeLinearGradientColorStops',
        ], function () {
            return (_this.strokeEnabled() &&
                _this.strokeWidth() &&
                !!(_this.stroke() || _this.strokeLinearGradientColorStops()));
        });
    };
    Shape.prototype.hasHitStroke = function () {
        var width = this.hitStrokeWidth();
        if (width === 'auto') {
            return this.hasStroke();
        }
        return this.strokeEnabled() && !!width;
    };
    Shape.prototype.intersects = function (point) {
        var stage = this.getStage(), bufferHitCanvas = stage.bufferHitCanvas, p;
        bufferHitCanvas.getContext().clear();
        this.drawHit(bufferHitCanvas);
        p = bufferHitCanvas.context.getImageData(Math.round(point.x), Math.round(point.y), 1, 1).data;
        return p[3] > 0;
    };
    Shape.prototype.destroy = function () {
        Node_1.Node.prototype.destroy.call(this);
        delete exports.shapes[this.colorKey];
        delete this.colorKey;
        return this;
    };
    Shape.prototype._useBufferCanvas = function (forceFill) {
        var _a;
        if (!this.getStage()) {
            return false;
        }
        var perfectDrawEnabled = (_a = this.attrs.perfectDrawEnabled) !== null && _a !== void 0 ? _a : true;
        if (!perfectDrawEnabled) {
            return false;
        }
        var hasFill = forceFill || this.hasFill();
        var hasStroke = this.hasStroke();
        var isTransparent = this.getAbsoluteOpacity() !== 1;
        if (hasFill && hasStroke && isTransparent) {
            return true;
        }
        var hasShadow = this.hasShadow();
        var strokeForShadow = this.shadowForStrokeEnabled();
        if (hasFill && hasStroke && hasShadow && strokeForShadow) {
            return true;
        }
        return false;
    };
    Shape.prototype.setStrokeHitEnabled = function (val) {
        Util_1.Util.warn('strokeHitEnabled property is deprecated. Please use hitStrokeWidth instead.');
        if (val) {
            this.hitStrokeWidth('auto');
        }
        else {
            this.hitStrokeWidth(0);
        }
    };
    Shape.prototype.getStrokeHitEnabled = function () {
        if (this.hitStrokeWidth() === 0) {
            return false;
        }
        else {
            return true;
        }
    };
    Shape.prototype.getSelfRect = function () {
        var size = this.size();
        return {
            x: this._centroid ? -size.width / 2 : 0,
            y: this._centroid ? -size.height / 2 : 0,
            width: size.width,
            height: size.height,
        };
    };
    Shape.prototype.getClientRect = function (attrs) {
        attrs = attrs || {};
        var skipTransform = attrs.skipTransform;
        var relativeTo = attrs.relativeTo;
        var fillRect = this.getSelfRect();
        var applyStroke = !attrs.skipStroke && this.hasStroke();
        var strokeWidth = (applyStroke && this.strokeWidth()) || 0;
        var fillAndStrokeWidth = fillRect.width + strokeWidth;
        var fillAndStrokeHeight = fillRect.height + strokeWidth;
        var applyShadow = !attrs.skipShadow && this.hasShadow();
        var shadowOffsetX = applyShadow ? this.shadowOffsetX() : 0;
        var shadowOffsetY = applyShadow ? this.shadowOffsetY() : 0;
        var preWidth = fillAndStrokeWidth + Math.abs(shadowOffsetX);
        var preHeight = fillAndStrokeHeight + Math.abs(shadowOffsetY);
        var blurRadius = (applyShadow && this.shadowBlur()) || 0;
        var width = preWidth + blurRadius * 2;
        var height = preHeight + blurRadius * 2;
        var roundingOffset = 0;
        if (Math.round(strokeWidth / 2) !== strokeWidth / 2) {
            roundingOffset = 1;
        }
        var rect = {
            width: width + roundingOffset,
            height: height + roundingOffset,
            x: -Math.round(strokeWidth / 2 + blurRadius) +
                Math.min(shadowOffsetX, 0) +
                fillRect.x,
            y: -Math.round(strokeWidth / 2 + blurRadius) +
                Math.min(shadowOffsetY, 0) +
                fillRect.y,
        };
        if (!skipTransform) {
            return this._transformedRect(rect, relativeTo);
        }
        return rect;
    };
    Shape.prototype.drawScene = function (can, top) {
        var layer = this.getLayer(), canvas = can || layer.getCanvas(), context = canvas.getContext(), cachedCanvas = this._getCanvasCache(), drawFunc = this.getSceneFunc(), hasShadow = this.hasShadow(), stage, bufferCanvas, bufferContext;
        var caching = canvas.isCache;
        var skipBuffer = canvas.isCache;
        var cachingSelf = top === this;
        if (!this.isVisible() && !caching) {
            return this;
        }
        if (cachedCanvas) {
            context.save();
            var m = this.getAbsoluteTransform(top).getMatrix();
            context.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
            this._drawCachedSceneCanvas(context);
            context.restore();
            return this;
        }
        if (!drawFunc) {
            return this;
        }
        context.save();
        if (this._useBufferCanvas() && !skipBuffer) {
            stage = this.getStage();
            bufferCanvas = stage.bufferCanvas;
            bufferContext = bufferCanvas.getContext();
            bufferContext.clear();
            bufferContext.save();
            bufferContext._applyLineJoin(this);
            var o = this.getAbsoluteTransform(top).getMatrix();
            bufferContext.transform(o[0], o[1], o[2], o[3], o[4], o[5]);
            drawFunc.call(this, bufferContext, this);
            bufferContext.restore();
            var ratio = bufferCanvas.pixelRatio;
            if (hasShadow) {
                context._applyShadow(this);
            }
            context._applyOpacity(this);
            context._applyGlobalCompositeOperation(this);
            context.drawImage(bufferCanvas._canvas, 0, 0, bufferCanvas.width / ratio, bufferCanvas.height / ratio);
        }
        else {
            context._applyLineJoin(this);
            if (!cachingSelf) {
                var o = this.getAbsoluteTransform(top).getMatrix();
                context.transform(o[0], o[1], o[2], o[3], o[4], o[5]);
                context._applyOpacity(this);
                context._applyGlobalCompositeOperation(this);
            }
            if (hasShadow) {
                context._applyShadow(this);
            }
            drawFunc.call(this, context, this);
        }
        context.restore();
        return this;
    };
    Shape.prototype.drawHit = function (can, top) {
        if (!this.shouldDrawHit(top)) {
            return this;
        }
        var layer = this.getLayer(), canvas = can || layer.hitCanvas, context = canvas && canvas.getContext(), drawFunc = this.hitFunc() || this.sceneFunc(), cachedCanvas = this._getCanvasCache(), cachedHitCanvas = cachedCanvas && cachedCanvas.hit;
        if (!this.colorKey) {
            console.log(this);
            Util_1.Util.warn('Looks like your canvas has a destroyed shape in it. Do not reuse shape after you destroyed it. See the shape in logs above. If you want to reuse shape you should call remove() instead of destroy()');
        }
        if (cachedHitCanvas) {
            context.save();
            var m = this.getAbsoluteTransform(top).getMatrix();
            context.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
            this._drawCachedHitCanvas(context);
            context.restore();
            return this;
        }
        if (!drawFunc) {
            return this;
        }
        context.save();
        context._applyLineJoin(this);
        var selfCache = this === top;
        if (!selfCache) {
            var o = this.getAbsoluteTransform(top).getMatrix();
            context.transform(o[0], o[1], o[2], o[3], o[4], o[5]);
        }
        drawFunc.call(this, context, this);
        context.restore();
        return this;
    };
    Shape.prototype.drawHitFromCache = function (alphaThreshold) {
        if (alphaThreshold === void 0) { alphaThreshold = 0; }
        var cachedCanvas = this._getCanvasCache(), sceneCanvas = this._getCachedSceneCanvas(), hitCanvas = cachedCanvas.hit, hitContext = hitCanvas.getContext(), hitWidth = hitCanvas.getWidth(), hitHeight = hitCanvas.getHeight(), hitImageData, hitData, len, rgbColorKey, i, alpha;
        hitContext.clear();
        hitContext.drawImage(sceneCanvas._canvas, 0, 0, hitWidth, hitHeight);
        try {
            hitImageData = hitContext.getImageData(0, 0, hitWidth, hitHeight);
            hitData = hitImageData.data;
            len = hitData.length;
            rgbColorKey = Util_1.Util._hexToRgb(this.colorKey);
            for (i = 0; i < len; i += 4) {
                alpha = hitData[i + 3];
                if (alpha > alphaThreshold) {
                    hitData[i] = rgbColorKey.r;
                    hitData[i + 1] = rgbColorKey.g;
                    hitData[i + 2] = rgbColorKey.b;
                    hitData[i + 3] = 255;
                }
                else {
                    hitData[i + 3] = 0;
                }
            }
            hitContext.putImageData(hitImageData, 0, 0);
        }
        catch (e) {
            Util_1.Util.error('Unable to draw hit graph from cached scene canvas. ' + e.message);
        }
        return this;
    };
    Shape.prototype.hasPointerCapture = function (pointerId) {
        return PointerEvents.hasPointerCapture(pointerId, this);
    };
    Shape.prototype.setPointerCapture = function (pointerId) {
        PointerEvents.setPointerCapture(pointerId, this);
    };
    Shape.prototype.releaseCapture = function (pointerId) {
        PointerEvents.releaseCapture(pointerId, this);
    };
    return Shape;
}(Node_1.Node));
exports.Shape = Shape;
Shape.prototype._fillFunc = _fillFunc;
Shape.prototype._strokeFunc = _strokeFunc;
Shape.prototype._fillFuncHit = _fillFuncHit;
Shape.prototype._strokeFuncHit = _strokeFuncHit;
Shape.prototype._centroid = false;
Shape.prototype.nodeType = 'Shape';
Global_1._registerNode(Shape);
Shape.prototype.eventListeners = {};
Shape.prototype.on.call(Shape.prototype, 'shadowColorChange.konva shadowBlurChange.konva shadowOffsetChange.konva shadowOpacityChange.konva shadowEnabledChange.konva', _clearHasShadowCache);
Shape.prototype.on.call(Shape.prototype, 'shadowColorChange.konva shadowOpacityChange.konva shadowEnabledChange.konva', _clearGetShadowRGBACache);
Shape.prototype.on.call(Shape.prototype, 'fillPriorityChange.konva fillPatternImageChange.konva fillPatternRepeatChange.konva fillPatternScaleXChange.konva fillPatternScaleYChange.konva', _clearFillPatternCache);
Shape.prototype.on.call(Shape.prototype, 'fillPriorityChange.konva fillLinearGradientColorStopsChange.konva fillLinearGradientStartPointXChange.konva fillLinearGradientStartPointYChange.konva fillLinearGradientEndPointXChange.konva fillLinearGradientEndPointYChange.konva', _clearLinearGradientCache);
Shape.prototype.on.call(Shape.prototype, 'fillPriorityChange.konva fillRadialGradientColorStopsChange.konva fillRadialGradientStartPointXChange.konva fillRadialGradientStartPointYChange.konva fillRadialGradientEndPointXChange.konva fillRadialGradientEndPointYChange.konva fillRadialGradientStartRadiusChange.konva fillRadialGradientEndRadiusChange.konva', _clearRadialGradientCache);
Factory_1.Factory.addGetterSetter(Shape, 'stroke', undefined, Validators_1.getStringOrGradientValidator());
Factory_1.Factory.addGetterSetter(Shape, 'strokeWidth', 2, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Shape, 'hitStrokeWidth', 'auto', Validators_1.getNumberOrAutoValidator());
Factory_1.Factory.addGetterSetter(Shape, 'strokeHitEnabled', true, Validators_1.getBooleanValidator());
Factory_1.Factory.addGetterSetter(Shape, 'perfectDrawEnabled', true, Validators_1.getBooleanValidator());
Factory_1.Factory.addGetterSetter(Shape, 'shadowForStrokeEnabled', true, Validators_1.getBooleanValidator());
Factory_1.Factory.addGetterSetter(Shape, 'lineJoin');
Factory_1.Factory.addGetterSetter(Shape, 'lineCap');
Factory_1.Factory.addGetterSetter(Shape, 'sceneFunc');
Factory_1.Factory.addGetterSetter(Shape, 'hitFunc');
Factory_1.Factory.addGetterSetter(Shape, 'dash');
Factory_1.Factory.addGetterSetter(Shape, 'dashOffset', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Shape, 'shadowColor', undefined, Validators_1.getStringValidator());
Factory_1.Factory.addGetterSetter(Shape, 'shadowBlur', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Shape, 'shadowOpacity', 1, Validators_1.getNumberValidator());
Factory_1.Factory.addComponentsGetterSetter(Shape, 'shadowOffset', ['x', 'y']);
Factory_1.Factory.addGetterSetter(Shape, 'shadowOffsetX', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Shape, 'shadowOffsetY', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Shape, 'fillPatternImage');
Factory_1.Factory.addGetterSetter(Shape, 'fill', undefined, Validators_1.getStringOrGradientValidator());
Factory_1.Factory.addGetterSetter(Shape, 'fillPatternX', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Shape, 'fillPatternY', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Shape, 'fillLinearGradientColorStops');
Factory_1.Factory.addGetterSetter(Shape, 'strokeLinearGradientColorStops');
Factory_1.Factory.addGetterSetter(Shape, 'fillRadialGradientStartRadius', 0);
Factory_1.Factory.addGetterSetter(Shape, 'fillRadialGradientEndRadius', 0);
Factory_1.Factory.addGetterSetter(Shape, 'fillRadialGradientColorStops');
Factory_1.Factory.addGetterSetter(Shape, 'fillPatternRepeat', 'repeat');
Factory_1.Factory.addGetterSetter(Shape, 'fillEnabled', true);
Factory_1.Factory.addGetterSetter(Shape, 'strokeEnabled', true);
Factory_1.Factory.addGetterSetter(Shape, 'shadowEnabled', true);
Factory_1.Factory.addGetterSetter(Shape, 'dashEnabled', true);
Factory_1.Factory.addGetterSetter(Shape, 'strokeScaleEnabled', true);
Factory_1.Factory.addGetterSetter(Shape, 'fillPriority', 'color');
Factory_1.Factory.addComponentsGetterSetter(Shape, 'fillPatternOffset', ['x', 'y']);
Factory_1.Factory.addGetterSetter(Shape, 'fillPatternOffsetX', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Shape, 'fillPatternOffsetY', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addComponentsGetterSetter(Shape, 'fillPatternScale', ['x', 'y']);
Factory_1.Factory.addGetterSetter(Shape, 'fillPatternScaleX', 1, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Shape, 'fillPatternScaleY', 1, Validators_1.getNumberValidator());
Factory_1.Factory.addComponentsGetterSetter(Shape, 'fillLinearGradientStartPoint', [
    'x',
    'y',
]);
Factory_1.Factory.addComponentsGetterSetter(Shape, 'strokeLinearGradientStartPoint', [
    'x',
    'y',
]);
Factory_1.Factory.addGetterSetter(Shape, 'fillLinearGradientStartPointX', 0);
Factory_1.Factory.addGetterSetter(Shape, 'strokeLinearGradientStartPointX', 0);
Factory_1.Factory.addGetterSetter(Shape, 'fillLinearGradientStartPointY', 0);
Factory_1.Factory.addGetterSetter(Shape, 'strokeLinearGradientStartPointY', 0);
Factory_1.Factory.addComponentsGetterSetter(Shape, 'fillLinearGradientEndPoint', [
    'x',
    'y',
]);
Factory_1.Factory.addComponentsGetterSetter(Shape, 'strokeLinearGradientEndPoint', [
    'x',
    'y',
]);
Factory_1.Factory.addGetterSetter(Shape, 'fillLinearGradientEndPointX', 0);
Factory_1.Factory.addGetterSetter(Shape, 'strokeLinearGradientEndPointX', 0);
Factory_1.Factory.addGetterSetter(Shape, 'fillLinearGradientEndPointY', 0);
Factory_1.Factory.addGetterSetter(Shape, 'strokeLinearGradientEndPointY', 0);
Factory_1.Factory.addComponentsGetterSetter(Shape, 'fillRadialGradientStartPoint', [
    'x',
    'y',
]);
Factory_1.Factory.addGetterSetter(Shape, 'fillRadialGradientStartPointX', 0);
Factory_1.Factory.addGetterSetter(Shape, 'fillRadialGradientStartPointY', 0);
Factory_1.Factory.addComponentsGetterSetter(Shape, 'fillRadialGradientEndPoint', [
    'x',
    'y',
]);
Factory_1.Factory.addGetterSetter(Shape, 'fillRadialGradientEndPointX', 0);
Factory_1.Factory.addGetterSetter(Shape, 'fillRadialGradientEndPointY', 0);
Factory_1.Factory.addGetterSetter(Shape, 'fillPatternRotation', 0);
Factory_1.Factory.backCompat(Shape, {
    dashArray: 'dash',
    getDashArray: 'getDash',
    setDashArray: 'getDash',
    drawFunc: 'sceneFunc',
    getDrawFunc: 'getSceneFunc',
    setDrawFunc: 'setSceneFunc',
    drawHitFunc: 'hitFunc',
    getDrawHitFunc: 'getHitFunc',
    setDrawHitFunc: 'setHitFunc',
});
Util_1.Collection.mapMethods(Shape);

},{"./Factory":9,"./Global":11,"./Node":14,"./PointerEvents":15,"./Util":19,"./Validators":20}],17:[function(_dereq_,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = _dereq_("./Util");
var Factory_1 = _dereq_("./Factory");
var Container_1 = _dereq_("./Container");
var Global_1 = _dereq_("./Global");
var Canvas_1 = _dereq_("./Canvas");
var DragAndDrop_1 = _dereq_("./DragAndDrop");
var Global_2 = _dereq_("./Global");
var PointerEvents = _dereq_("./PointerEvents");
var STAGE = 'Stage', STRING = 'string', PX = 'px', MOUSEOUT = 'mouseout', MOUSELEAVE = 'mouseleave', MOUSEOVER = 'mouseover', MOUSEENTER = 'mouseenter', MOUSEMOVE = 'mousemove', MOUSEDOWN = 'mousedown', MOUSEUP = 'mouseup', POINTERMOVE = 'pointermove', POINTERDOWN = 'pointerdown', POINTERUP = 'pointerup', POINTERCANCEL = 'pointercancel', LOSTPOINTERCAPTURE = 'lostpointercapture', CONTEXTMENU = 'contextmenu', CLICK = 'click', DBL_CLICK = 'dblclick', TOUCHSTART = 'touchstart', TOUCHEND = 'touchend', TAP = 'tap', DBL_TAP = 'dbltap', TOUCHMOVE = 'touchmove', WHEEL = 'wheel', CONTENT_MOUSEOUT = 'contentMouseout', CONTENT_MOUSEOVER = 'contentMouseover', CONTENT_MOUSEMOVE = 'contentMousemove', CONTENT_MOUSEDOWN = 'contentMousedown', CONTENT_MOUSEUP = 'contentMouseup', CONTENT_CONTEXTMENU = 'contentContextmenu', CONTENT_CLICK = 'contentClick', CONTENT_DBL_CLICK = 'contentDblclick', CONTENT_TOUCHSTART = 'contentTouchstart', CONTENT_TOUCHEND = 'contentTouchend', CONTENT_DBL_TAP = 'contentDbltap', CONTENT_TAP = 'contentTap', CONTENT_TOUCHMOVE = 'contentTouchmove', CONTENT_POINTERMOVE = 'contentPointermove', CONTENT_POINTERDOWN = 'contentPointerdown', CONTENT_POINTERUP = 'contentPointerup', CONTENT_WHEEL = 'contentWheel', RELATIVE = 'relative', KONVA_CONTENT = 'konvajs-content', SPACE = ' ', UNDERSCORE = '_', CONTAINER = 'container', MAX_LAYERS_NUMBER = 5, EMPTY_STRING = '', EVENTS = [
    MOUSEENTER,
    MOUSEDOWN,
    MOUSEMOVE,
    MOUSEUP,
    MOUSEOUT,
    TOUCHSTART,
    TOUCHMOVE,
    TOUCHEND,
    MOUSEOVER,
    WHEEL,
    CONTEXTMENU,
    POINTERDOWN,
    POINTERMOVE,
    POINTERUP,
    POINTERCANCEL,
    LOSTPOINTERCAPTURE,
], eventsLength = EVENTS.length;
function addEvent(ctx, eventName) {
    ctx.content.addEventListener(eventName, function (evt) {
        ctx[UNDERSCORE + eventName](evt);
    }, false);
}
var NO_POINTERS_MESSAGE = "Pointer position is missing and not registered by the stage. Looks like it is outside of the stage container. You can set it manually from event: stage.setPointersPositions(event);";
exports.stages = [];
function checkNoClip(attrs) {
    if (attrs === void 0) { attrs = {}; }
    if (attrs.clipFunc || attrs.clipWidth || attrs.clipHeight) {
        Util_1.Util.warn('Stage does not support clipping. Please use clip for Layers or Groups.');
    }
    return attrs;
}
var Stage = (function (_super) {
    __extends(Stage, _super);
    function Stage(config) {
        var _this = _super.call(this, checkNoClip(config)) || this;
        _this._pointerPositions = [];
        _this._changedPointerPositions = [];
        _this._buildDOM();
        _this._bindContentEvents();
        exports.stages.push(_this);
        _this.on('widthChange.konva heightChange.konva', _this._resizeDOM);
        _this.on('visibleChange.konva', _this._checkVisibility);
        _this.on('clipWidthChange.konva clipHeightChange.konva clipFuncChange.konva', function () {
            checkNoClip(_this.attrs);
        });
        _this._checkVisibility();
        return _this;
    }
    Stage.prototype._validateAdd = function (child) {
        var isLayer = child.getType() === 'Layer';
        var isFastLayer = child.getType() === 'FastLayer';
        var valid = isLayer || isFastLayer;
        if (!valid) {
            Util_1.Util.throw('You may only add layers to the stage.');
        }
    };
    Stage.prototype._checkVisibility = function () {
        if (!this.content) {
            return;
        }
        var style = this.visible() ? '' : 'none';
        this.content.style.display = style;
    };
    Stage.prototype.setContainer = function (container) {
        if (typeof container === STRING) {
            if (container.charAt(0) === '.') {
                var className = container.slice(1);
                container = document.getElementsByClassName(className)[0];
            }
            else {
                var id;
                if (container.charAt(0) !== '#') {
                    id = container;
                }
                else {
                    id = container.slice(1);
                }
                container = document.getElementById(id);
            }
            if (!container) {
                throw 'Can not find container in document with id ' + id;
            }
        }
        this._setAttr(CONTAINER, container);
        if (this.content) {
            if (this.content.parentElement) {
                this.content.parentElement.removeChild(this.content);
            }
            container.appendChild(this.content);
        }
        return this;
    };
    Stage.prototype.shouldDrawHit = function () {
        return true;
    };
    Stage.prototype.clear = function () {
        var layers = this.children, len = layers.length, n;
        for (n = 0; n < len; n++) {
            layers[n].clear();
        }
        return this;
    };
    Stage.prototype.clone = function (obj) {
        if (!obj) {
            obj = {};
        }
        obj.container = document.createElement('div');
        return Container_1.Container.prototype.clone.call(this, obj);
    };
    Stage.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        var content = this.content;
        if (content && Util_1.Util._isInDocument(content)) {
            this.container().removeChild(content);
        }
        var index = exports.stages.indexOf(this);
        if (index > -1) {
            exports.stages.splice(index, 1);
        }
        return this;
    };
    Stage.prototype.getPointerPosition = function () {
        var pos = this._pointerPositions[0] || this._changedPointerPositions[0];
        if (!pos) {
            Util_1.Util.warn(NO_POINTERS_MESSAGE);
            return null;
        }
        return {
            x: pos.x,
            y: pos.y,
        };
    };
    Stage.prototype._getPointerById = function (id) {
        return this._pointerPositions.find(function (p) { return p.id === id; });
    };
    Stage.prototype.getPointersPositions = function () {
        return this._pointerPositions;
    };
    Stage.prototype.getStage = function () {
        return this;
    };
    Stage.prototype.getContent = function () {
        return this.content;
    };
    Stage.prototype._toKonvaCanvas = function (config) {
        config = config || {};
        var x = config.x || 0, y = config.y || 0, canvas = new Canvas_1.SceneCanvas({
            width: config.width || this.width(),
            height: config.height || this.height(),
            pixelRatio: config.pixelRatio || 1,
        }), _context = canvas.getContext()._context, layers = this.children;
        if (x || y) {
            _context.translate(-1 * x, -1 * y);
        }
        layers.each(function (layer) {
            if (!layer.isVisible()) {
                return;
            }
            var layerCanvas = layer._toKonvaCanvas(config);
            _context.drawImage(layerCanvas._canvas, x, y, layerCanvas.getWidth() / layerCanvas.getPixelRatio(), layerCanvas.getHeight() / layerCanvas.getPixelRatio());
        });
        return canvas;
    };
    Stage.prototype.getIntersection = function (pos, selector) {
        if (!pos) {
            return null;
        }
        var layers = this.children, len = layers.length, end = len - 1, n, shape;
        for (n = end; n >= 0; n--) {
            shape = layers[n].getIntersection(pos, selector);
            if (shape) {
                return shape;
            }
        }
        return null;
    };
    Stage.prototype._resizeDOM = function () {
        var width = this.width();
        var height = this.height();
        if (this.content) {
            this.content.style.width = width + PX;
            this.content.style.height = height + PX;
        }
        this.bufferCanvas.setSize(width, height);
        this.bufferHitCanvas.setSize(width, height);
        this.children.each(function (layer) {
            layer.setSize({ width: width, height: height });
            layer.draw();
        });
    };
    Stage.prototype.add = function (layer) {
        if (arguments.length > 1) {
            for (var i = 0; i < arguments.length; i++) {
                this.add(arguments[i]);
            }
            return this;
        }
        _super.prototype.add.call(this, layer);
        var length = this.children.length;
        if (length > MAX_LAYERS_NUMBER) {
            Util_1.Util.warn('The stage has ' +
                length +
                ' layers. Recommended maximum number of layers is 3-5. Adding more layers into the stage may drop the performance. Rethink your tree structure, you can use Konva.Group.');
        }
        layer.setSize({ width: this.width(), height: this.height() });
        layer.draw();
        if (Global_1.Konva.isBrowser) {
            this.content.appendChild(layer.canvas._canvas);
        }
        return this;
    };
    Stage.prototype.getParent = function () {
        return null;
    };
    Stage.prototype.getLayer = function () {
        return null;
    };
    Stage.prototype.hasPointerCapture = function (pointerId) {
        return PointerEvents.hasPointerCapture(pointerId, this);
    };
    Stage.prototype.setPointerCapture = function (pointerId) {
        PointerEvents.setPointerCapture(pointerId, this);
    };
    Stage.prototype.releaseCapture = function (pointerId) {
        PointerEvents.releaseCapture(pointerId, this);
    };
    Stage.prototype.getLayers = function () {
        return this.getChildren();
    };
    Stage.prototype._bindContentEvents = function () {
        if (!Global_1.Konva.isBrowser) {
            return;
        }
        for (var n = 0; n < eventsLength; n++) {
            addEvent(this, EVENTS[n]);
        }
    };
    Stage.prototype._mouseenter = function (evt) {
        this.setPointersPositions(evt);
        this._fire(MOUSEENTER, { evt: evt, target: this, currentTarget: this });
    };
    Stage.prototype._mouseover = function (evt) {
        this.setPointersPositions(evt);
        this._fire(CONTENT_MOUSEOVER, { evt: evt });
        this._fire(MOUSEOVER, { evt: evt, target: this, currentTarget: this });
    };
    Stage.prototype._mouseout = function (evt) {
        var _a;
        this.setPointersPositions(evt);
        var targetShape = ((_a = this.targetShape) === null || _a === void 0 ? void 0 : _a.getStage()) ? this.targetShape : null;
        var eventsEnabled = !DragAndDrop_1.DD.isDragging || Global_1.Konva.hitOnDragEnabled;
        if (targetShape && eventsEnabled) {
            targetShape._fireAndBubble(MOUSEOUT, { evt: evt });
            targetShape._fireAndBubble(MOUSELEAVE, { evt: evt });
            this._fire(MOUSELEAVE, { evt: evt, target: this, currentTarget: this });
            this.targetShape = null;
        }
        else if (eventsEnabled) {
            this._fire(MOUSELEAVE, {
                evt: evt,
                target: this,
                currentTarget: this,
            });
            this._fire(MOUSEOUT, {
                evt: evt,
                target: this,
                currentTarget: this,
            });
        }
        this.pointerPos = undefined;
        this._pointerPositions = [];
        this._fire(CONTENT_MOUSEOUT, { evt: evt });
    };
    Stage.prototype._mousemove = function (evt) {
        var _a;
        if (Global_1.Konva.UA.ieMobile) {
            return this._touchmove(evt);
        }
        this.setPointersPositions(evt);
        var pointerId = Util_1.Util._getFirstPointerId(evt);
        var shape;
        var targetShape = ((_a = this.targetShape) === null || _a === void 0 ? void 0 : _a.getStage()) ? this.targetShape : null;
        var eventsEnabled = !DragAndDrop_1.DD.isDragging || Global_1.Konva.hitOnDragEnabled;
        if (eventsEnabled) {
            shape = this.getIntersection(this.getPointerPosition());
            if (shape && shape.isListening()) {
                var differentTarget = targetShape !== shape;
                if (eventsEnabled && differentTarget) {
                    if (targetShape) {
                        targetShape._fireAndBubble(MOUSEOUT, { evt: evt, pointerId: pointerId }, shape);
                        targetShape._fireAndBubble(MOUSELEAVE, { evt: evt, pointerId: pointerId }, shape);
                    }
                    shape._fireAndBubble(MOUSEOVER, { evt: evt, pointerId: pointerId }, targetShape);
                    shape._fireAndBubble(MOUSEENTER, { evt: evt, pointerId: pointerId }, targetShape);
                    shape._fireAndBubble(MOUSEMOVE, { evt: evt, pointerId: pointerId });
                    this.targetShape = shape;
                }
                else {
                    shape._fireAndBubble(MOUSEMOVE, { evt: evt, pointerId: pointerId });
                }
            }
            else {
                if (targetShape && eventsEnabled) {
                    targetShape._fireAndBubble(MOUSEOUT, { evt: evt, pointerId: pointerId });
                    targetShape._fireAndBubble(MOUSELEAVE, { evt: evt, pointerId: pointerId });
                    this._fire(MOUSEOVER, {
                        evt: evt,
                        target: this,
                        currentTarget: this,
                        pointerId: pointerId,
                    });
                    this.targetShape = null;
                }
                this._fire(MOUSEMOVE, {
                    evt: evt,
                    target: this,
                    currentTarget: this,
                    pointerId: pointerId,
                });
            }
            this._fire(CONTENT_MOUSEMOVE, { evt: evt });
        }
        if (evt.cancelable) {
            evt.preventDefault();
        }
    };
    Stage.prototype._mousedown = function (evt) {
        if (Global_1.Konva.UA.ieMobile) {
            return this._touchstart(evt);
        }
        this.setPointersPositions(evt);
        var pointerId = Util_1.Util._getFirstPointerId(evt);
        var shape = this.getIntersection(this.getPointerPosition());
        DragAndDrop_1.DD.justDragged = false;
        Global_1.Konva.listenClickTap = true;
        if (shape && shape.isListening()) {
            this.clickStartShape = shape;
            shape._fireAndBubble(MOUSEDOWN, { evt: evt, pointerId: pointerId });
        }
        else {
            this._fire(MOUSEDOWN, {
                evt: evt,
                target: this,
                currentTarget: this,
                pointerId: pointerId,
            });
        }
        this._fire(CONTENT_MOUSEDOWN, { evt: evt });
    };
    Stage.prototype._mouseup = function (evt) {
        if (Global_1.Konva.UA.ieMobile) {
            return this._touchend(evt);
        }
        this.setPointersPositions(evt);
        var pointerId = Util_1.Util._getFirstPointerId(evt);
        var shape = this.getIntersection(this.getPointerPosition()), clickStartShape = this.clickStartShape, clickEndShape = this.clickEndShape, fireDblClick = false;
        if (Global_1.Konva.inDblClickWindow) {
            fireDblClick = true;
            clearTimeout(this.dblTimeout);
        }
        else if (!DragAndDrop_1.DD.justDragged) {
            Global_1.Konva.inDblClickWindow = true;
            clearTimeout(this.dblTimeout);
        }
        this.dblTimeout = setTimeout(function () {
            Global_1.Konva.inDblClickWindow = false;
        }, Global_1.Konva.dblClickWindow);
        if (shape && shape.isListening()) {
            this.clickEndShape = shape;
            shape._fireAndBubble(MOUSEUP, { evt: evt, pointerId: pointerId });
            if (Global_1.Konva.listenClickTap &&
                clickStartShape &&
                clickStartShape._id === shape._id) {
                shape._fireAndBubble(CLICK, { evt: evt, pointerId: pointerId });
                if (fireDblClick && clickEndShape && clickEndShape === shape) {
                    shape._fireAndBubble(DBL_CLICK, { evt: evt, pointerId: pointerId });
                }
            }
        }
        else {
            this.clickEndShape = null;
            this._fire(MOUSEUP, {
                evt: evt,
                target: this,
                currentTarget: this,
                pointerId: pointerId,
            });
            if (Global_1.Konva.listenClickTap) {
                this._fire(CLICK, {
                    evt: evt,
                    target: this,
                    currentTarget: this,
                    pointerId: pointerId,
                });
            }
            if (fireDblClick) {
                this._fire(DBL_CLICK, {
                    evt: evt,
                    target: this,
                    currentTarget: this,
                    pointerId: pointerId,
                });
            }
        }
        this._fire(CONTENT_MOUSEUP, { evt: evt });
        if (Global_1.Konva.listenClickTap) {
            this._fire(CONTENT_CLICK, { evt: evt });
            if (fireDblClick) {
                this._fire(CONTENT_DBL_CLICK, { evt: evt });
            }
        }
        Global_1.Konva.listenClickTap = false;
        if (evt.cancelable) {
            evt.preventDefault();
        }
    };
    Stage.prototype._contextmenu = function (evt) {
        this.setPointersPositions(evt);
        var shape = this.getIntersection(this.getPointerPosition());
        if (shape && shape.isListening()) {
            shape._fireAndBubble(CONTEXTMENU, { evt: evt });
        }
        else {
            this._fire(CONTEXTMENU, {
                evt: evt,
                target: this,
                currentTarget: this,
            });
        }
        this._fire(CONTENT_CONTEXTMENU, { evt: evt });
    };
    Stage.prototype._touchstart = function (evt) {
        var _this = this;
        this.setPointersPositions(evt);
        var triggeredOnShape = false;
        this._changedPointerPositions.forEach(function (pos) {
            var shape = _this.getIntersection(pos);
            Global_1.Konva.listenClickTap = true;
            DragAndDrop_1.DD.justDragged = false;
            var hasShape = shape && shape.isListening();
            if (!hasShape) {
                return;
            }
            if (Global_1.Konva.captureTouchEventsEnabled) {
                shape.setPointerCapture(pos.id);
            }
            _this.tapStartShape = shape;
            shape._fireAndBubble(TOUCHSTART, { evt: evt, pointerId: pos.id }, _this);
            triggeredOnShape = true;
            if (shape.isListening() && shape.preventDefault() && evt.cancelable) {
                evt.preventDefault();
            }
        });
        if (!triggeredOnShape) {
            this._fire(TOUCHSTART, {
                evt: evt,
                target: this,
                currentTarget: this,
                pointerId: this._changedPointerPositions[0].id,
            });
        }
        this._fire(CONTENT_TOUCHSTART, { evt: evt });
    };
    Stage.prototype._touchmove = function (evt) {
        var _this = this;
        this.setPointersPositions(evt);
        var eventsEnabled = !DragAndDrop_1.DD.isDragging || Global_1.Konva.hitOnDragEnabled;
        if (eventsEnabled) {
            var triggeredOnShape = false;
            var processedShapesIds = {};
            this._changedPointerPositions.forEach(function (pos) {
                var shape = PointerEvents.getCapturedShape(pos.id) || _this.getIntersection(pos);
                var hasShape = shape && shape.isListening();
                if (!hasShape) {
                    return;
                }
                if (processedShapesIds[shape._id]) {
                    return;
                }
                processedShapesIds[shape._id] = true;
                shape._fireAndBubble(TOUCHMOVE, { evt: evt, pointerId: pos.id });
                triggeredOnShape = true;
                if (shape.isListening() && shape.preventDefault() && evt.cancelable) {
                    evt.preventDefault();
                }
            });
            if (!triggeredOnShape) {
                this._fire(TOUCHMOVE, {
                    evt: evt,
                    target: this,
                    currentTarget: this,
                    pointerId: this._changedPointerPositions[0].id,
                });
            }
            this._fire(CONTENT_TOUCHMOVE, { evt: evt });
        }
        if (DragAndDrop_1.DD.isDragging && DragAndDrop_1.DD.node.preventDefault() && evt.cancelable) {
            evt.preventDefault();
        }
    };
    Stage.prototype._touchend = function (evt) {
        var _this = this;
        this.setPointersPositions(evt);
        var tapEndShape = this.tapEndShape, fireDblClick = false;
        if (Global_1.Konva.inDblClickWindow) {
            fireDblClick = true;
            clearTimeout(this.dblTimeout);
        }
        else if (!DragAndDrop_1.DD.justDragged) {
            Global_1.Konva.inDblClickWindow = true;
            clearTimeout(this.dblTimeout);
        }
        this.dblTimeout = setTimeout(function () {
            Global_1.Konva.inDblClickWindow = false;
        }, Global_1.Konva.dblClickWindow);
        var triggeredOnShape = false;
        var processedShapesIds = {};
        var tapTriggered = false;
        var dblTapTriggered = false;
        this._changedPointerPositions.forEach(function (pos) {
            var shape = PointerEvents.getCapturedShape(pos.id) ||
                _this.getIntersection(pos);
            if (shape) {
                shape.releaseCapture(pos.id);
            }
            var hasShape = shape && shape.isListening();
            if (!hasShape) {
                return;
            }
            if (processedShapesIds[shape._id]) {
                return;
            }
            processedShapesIds[shape._id] = true;
            _this.tapEndShape = shape;
            shape._fireAndBubble(TOUCHEND, { evt: evt, pointerId: pos.id });
            triggeredOnShape = true;
            if (Global_1.Konva.listenClickTap && shape === _this.tapStartShape) {
                tapTriggered = true;
                shape._fireAndBubble(TAP, { evt: evt, pointerId: pos.id });
                if (fireDblClick && tapEndShape && tapEndShape === shape) {
                    dblTapTriggered = true;
                    shape._fireAndBubble(DBL_TAP, { evt: evt, pointerId: pos.id });
                }
            }
            if (shape.isListening() && shape.preventDefault() && evt.cancelable) {
                evt.preventDefault();
            }
        });
        if (!triggeredOnShape) {
            this._fire(TOUCHEND, {
                evt: evt,
                target: this,
                currentTarget: this,
                pointerId: this._changedPointerPositions[0].id,
            });
        }
        if (Global_1.Konva.listenClickTap && !tapTriggered) {
            this.tapEndShape = null;
            this._fire(TAP, {
                evt: evt,
                target: this,
                currentTarget: this,
                pointerId: this._changedPointerPositions[0].id,
            });
        }
        if (fireDblClick && !dblTapTriggered) {
            this._fire(DBL_TAP, {
                evt: evt,
                target: this,
                currentTarget: this,
                pointerId: this._changedPointerPositions[0].id,
            });
        }
        this._fire(CONTENT_TOUCHEND, { evt: evt });
        if (Global_1.Konva.listenClickTap) {
            this._fire(CONTENT_TAP, { evt: evt });
            if (fireDblClick) {
                this._fire(CONTENT_DBL_TAP, { evt: evt });
            }
        }
        if (this.preventDefault() && evt.cancelable) {
            evt.preventDefault();
        }
        Global_1.Konva.listenClickTap = false;
    };
    Stage.prototype._wheel = function (evt) {
        this.setPointersPositions(evt);
        var shape = this.getIntersection(this.getPointerPosition());
        if (shape && shape.isListening()) {
            shape._fireAndBubble(WHEEL, { evt: evt });
        }
        else {
            this._fire(WHEEL, {
                evt: evt,
                target: this,
                currentTarget: this,
            });
        }
        this._fire(CONTENT_WHEEL, { evt: evt });
    };
    Stage.prototype._pointerdown = function (evt) {
        if (!Global_1.Konva._pointerEventsEnabled) {
            return;
        }
        this.setPointersPositions(evt);
        var shape = PointerEvents.getCapturedShape(evt.pointerId) ||
            this.getIntersection(this.getPointerPosition());
        if (shape) {
            shape._fireAndBubble(POINTERDOWN, PointerEvents.createEvent(evt));
        }
    };
    Stage.prototype._pointermove = function (evt) {
        if (!Global_1.Konva._pointerEventsEnabled) {
            return;
        }
        this.setPointersPositions(evt);
        var shape = PointerEvents.getCapturedShape(evt.pointerId) ||
            this.getIntersection(this.getPointerPosition());
        if (shape) {
            shape._fireAndBubble(POINTERMOVE, PointerEvents.createEvent(evt));
        }
    };
    Stage.prototype._pointerup = function (evt) {
        if (!Global_1.Konva._pointerEventsEnabled) {
            return;
        }
        this.setPointersPositions(evt);
        var shape = PointerEvents.getCapturedShape(evt.pointerId) ||
            this.getIntersection(this.getPointerPosition());
        if (shape) {
            shape._fireAndBubble(POINTERUP, PointerEvents.createEvent(evt));
        }
        PointerEvents.releaseCapture(evt.pointerId);
    };
    Stage.prototype._pointercancel = function (evt) {
        if (!Global_1.Konva._pointerEventsEnabled) {
            return;
        }
        this.setPointersPositions(evt);
        var shape = PointerEvents.getCapturedShape(evt.pointerId) ||
            this.getIntersection(this.getPointerPosition());
        if (shape) {
            shape._fireAndBubble(POINTERUP, PointerEvents.createEvent(evt));
        }
        PointerEvents.releaseCapture(evt.pointerId);
    };
    Stage.prototype._lostpointercapture = function (evt) {
        PointerEvents.releaseCapture(evt.pointerId);
    };
    Stage.prototype.setPointersPositions = function (evt) {
        var _this = this;
        var contentPosition = this._getContentPosition(), x = null, y = null;
        evt = evt ? evt : window.event;
        if (evt.touches !== undefined) {
            this._pointerPositions = [];
            this._changedPointerPositions = [];
            Util_1.Collection.prototype.each.call(evt.touches, function (touch) {
                _this._pointerPositions.push({
                    id: touch.identifier,
                    x: (touch.clientX - contentPosition.left) / contentPosition.scaleX,
                    y: (touch.clientY - contentPosition.top) / contentPosition.scaleY,
                });
            });
            Util_1.Collection.prototype.each.call(evt.changedTouches || evt.touches, function (touch) {
                _this._changedPointerPositions.push({
                    id: touch.identifier,
                    x: (touch.clientX - contentPosition.left) / contentPosition.scaleX,
                    y: (touch.clientY - contentPosition.top) / contentPosition.scaleY,
                });
            });
        }
        else {
            x = (evt.clientX - contentPosition.left) / contentPosition.scaleX;
            y = (evt.clientY - contentPosition.top) / contentPosition.scaleY;
            this.pointerPos = {
                x: x,
                y: y,
            };
            this._pointerPositions = [{ x: x, y: y, id: Util_1.Util._getFirstPointerId(evt) }];
            this._changedPointerPositions = [
                { x: x, y: y, id: Util_1.Util._getFirstPointerId(evt) },
            ];
        }
    };
    Stage.prototype._setPointerPosition = function (evt) {
        Util_1.Util.warn('Method _setPointerPosition is deprecated. Use "stage.setPointersPositions(event)" instead.');
        this.setPointersPositions(evt);
    };
    Stage.prototype._getContentPosition = function () {
        if (!this.content || !this.content.getBoundingClientRect) {
            return {
                top: 0,
                left: 0,
                scaleX: 1,
                scaleY: 1,
            };
        }
        var rect = this.content.getBoundingClientRect();
        return {
            top: rect.top,
            left: rect.left,
            scaleX: rect.width / this.content.clientWidth || 1,
            scaleY: rect.height / this.content.clientHeight || 1,
        };
    };
    Stage.prototype._buildDOM = function () {
        this.bufferCanvas = new Canvas_1.SceneCanvas({
            width: this.width(),
            height: this.height(),
        });
        this.bufferHitCanvas = new Canvas_1.HitCanvas({
            pixelRatio: 1,
            width: this.width(),
            height: this.height(),
        });
        if (!Global_1.Konva.isBrowser) {
            return;
        }
        var container = this.container();
        if (!container) {
            throw 'Stage has no container. A container is required.';
        }
        container.innerHTML = EMPTY_STRING;
        this.content = document.createElement('div');
        this.content.style.position = RELATIVE;
        this.content.style.userSelect = 'none';
        this.content.className = KONVA_CONTENT;
        this.content.setAttribute('role', 'presentation');
        container.appendChild(this.content);
        this._resizeDOM();
    };
    Stage.prototype.cache = function () {
        Util_1.Util.warn('Cache function is not allowed for stage. You may use cache only for layers, groups and shapes.');
        return this;
    };
    Stage.prototype.clearCache = function () {
        return this;
    };
    Stage.prototype.batchDraw = function () {
        this.children.each(function (layer) {
            layer.batchDraw();
        });
        return this;
    };
    return Stage;
}(Container_1.Container));
exports.Stage = Stage;
Stage.prototype.nodeType = STAGE;
Global_2._registerNode(Stage);
Factory_1.Factory.addGetterSetter(Stage, 'container');

},{"./Canvas":5,"./Container":6,"./DragAndDrop":8,"./Factory":9,"./Global":11,"./PointerEvents":15,"./Util":19}],18:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = _dereq_("./Util");
var Animation_1 = _dereq_("./Animation");
var Node_1 = _dereq_("./Node");
var Global_1 = _dereq_("./Global");
var blacklist = {
    node: 1,
    duration: 1,
    easing: 1,
    onFinish: 1,
    yoyo: 1,
}, PAUSED = 1, PLAYING = 2, REVERSING = 3, idCounter = 0, colorAttrs = ['fill', 'stroke', 'shadowColor'];
var TweenEngine = (function () {
    function TweenEngine(prop, propFunc, func, begin, finish, duration, yoyo) {
        this.prop = prop;
        this.propFunc = propFunc;
        this.begin = begin;
        this._pos = begin;
        this.duration = duration;
        this._change = 0;
        this.prevPos = 0;
        this.yoyo = yoyo;
        this._time = 0;
        this._position = 0;
        this._startTime = 0;
        this._finish = 0;
        this.func = func;
        this._change = finish - this.begin;
        this.pause();
    }
    TweenEngine.prototype.fire = function (str) {
        var handler = this[str];
        if (handler) {
            handler();
        }
    };
    TweenEngine.prototype.setTime = function (t) {
        if (t > this.duration) {
            if (this.yoyo) {
                this._time = this.duration;
                this.reverse();
            }
            else {
                this.finish();
            }
        }
        else if (t < 0) {
            if (this.yoyo) {
                this._time = 0;
                this.play();
            }
            else {
                this.reset();
            }
        }
        else {
            this._time = t;
            this.update();
        }
    };
    TweenEngine.prototype.getTime = function () {
        return this._time;
    };
    TweenEngine.prototype.setPosition = function (p) {
        this.prevPos = this._pos;
        this.propFunc(p);
        this._pos = p;
    };
    TweenEngine.prototype.getPosition = function (t) {
        if (t === undefined) {
            t = this._time;
        }
        return this.func(t, this.begin, this._change, this.duration);
    };
    TweenEngine.prototype.play = function () {
        this.state = PLAYING;
        this._startTime = this.getTimer() - this._time;
        this.onEnterFrame();
        this.fire('onPlay');
    };
    TweenEngine.prototype.reverse = function () {
        this.state = REVERSING;
        this._time = this.duration - this._time;
        this._startTime = this.getTimer() - this._time;
        this.onEnterFrame();
        this.fire('onReverse');
    };
    TweenEngine.prototype.seek = function (t) {
        this.pause();
        this._time = t;
        this.update();
        this.fire('onSeek');
    };
    TweenEngine.prototype.reset = function () {
        this.pause();
        this._time = 0;
        this.update();
        this.fire('onReset');
    };
    TweenEngine.prototype.finish = function () {
        this.pause();
        this._time = this.duration;
        this.update();
        this.fire('onFinish');
    };
    TweenEngine.prototype.update = function () {
        this.setPosition(this.getPosition(this._time));
        this.fire('onUpdate');
    };
    TweenEngine.prototype.onEnterFrame = function () {
        var t = this.getTimer() - this._startTime;
        if (this.state === PLAYING) {
            this.setTime(t);
        }
        else if (this.state === REVERSING) {
            this.setTime(this.duration - t);
        }
    };
    TweenEngine.prototype.pause = function () {
        this.state = PAUSED;
        this.fire('onPause');
    };
    TweenEngine.prototype.getTimer = function () {
        return new Date().getTime();
    };
    return TweenEngine;
}());
var Tween = (function () {
    function Tween(config) {
        var that = this, node = config.node, nodeId = node._id, duration, easing = config.easing || exports.Easings.Linear, yoyo = !!config.yoyo, key;
        if (typeof config.duration === 'undefined') {
            duration = 0.3;
        }
        else if (config.duration === 0) {
            duration = 0.001;
        }
        else {
            duration = config.duration;
        }
        this.node = node;
        this._id = idCounter++;
        var layers = node.getLayer() ||
            (node instanceof Global_1.Konva['Stage'] ? node.getLayers() : null);
        if (!layers) {
            Util_1.Util.error('Tween constructor have `node` that is not in a layer. Please add node into layer first.');
        }
        this.anim = new Animation_1.Animation(function () {
            that.tween.onEnterFrame();
        }, layers);
        this.tween = new TweenEngine(key, function (i) {
            that._tweenFunc(i);
        }, easing, 0, 1, duration * 1000, yoyo);
        this._addListeners();
        if (!Tween.attrs[nodeId]) {
            Tween.attrs[nodeId] = {};
        }
        if (!Tween.attrs[nodeId][this._id]) {
            Tween.attrs[nodeId][this._id] = {};
        }
        if (!Tween.tweens[nodeId]) {
            Tween.tweens[nodeId] = {};
        }
        for (key in config) {
            if (blacklist[key] === undefined) {
                this._addAttr(key, config[key]);
            }
        }
        this.reset();
        this.onFinish = config.onFinish;
        this.onReset = config.onReset;
        this.onUpdate = config.onUpdate;
    }
    Tween.prototype._addAttr = function (key, end) {
        var node = this.node, nodeId = node._id, start, diff, tweenId, n, len, trueEnd, trueStart, endRGBA;
        tweenId = Tween.tweens[nodeId][key];
        if (tweenId) {
            delete Tween.attrs[nodeId][tweenId][key];
        }
        start = node.getAttr(key);
        if (Util_1.Util._isArray(end)) {
            diff = [];
            len = Math.max(end.length, start.length);
            if (key === 'points' && end.length !== start.length) {
                if (end.length > start.length) {
                    trueStart = start;
                    start = Util_1.Util._prepareArrayForTween(start, end, node.closed());
                }
                else {
                    trueEnd = end;
                    end = Util_1.Util._prepareArrayForTween(end, start, node.closed());
                }
            }
            if (key.indexOf('fill') === 0) {
                for (n = 0; n < len; n++) {
                    if (n % 2 === 0) {
                        diff.push(end[n] - start[n]);
                    }
                    else {
                        var startRGBA = Util_1.Util.colorToRGBA(start[n]);
                        endRGBA = Util_1.Util.colorToRGBA(end[n]);
                        start[n] = startRGBA;
                        diff.push({
                            r: endRGBA.r - startRGBA.r,
                            g: endRGBA.g - startRGBA.g,
                            b: endRGBA.b - startRGBA.b,
                            a: endRGBA.a - startRGBA.a,
                        });
                    }
                }
            }
            else {
                for (n = 0; n < len; n++) {
                    diff.push(end[n] - start[n]);
                }
            }
        }
        else if (colorAttrs.indexOf(key) !== -1) {
            start = Util_1.Util.colorToRGBA(start);
            endRGBA = Util_1.Util.colorToRGBA(end);
            diff = {
                r: endRGBA.r - start.r,
                g: endRGBA.g - start.g,
                b: endRGBA.b - start.b,
                a: endRGBA.a - start.a,
            };
        }
        else {
            diff = end - start;
        }
        Tween.attrs[nodeId][this._id][key] = {
            start: start,
            diff: diff,
            end: end,
            trueEnd: trueEnd,
            trueStart: trueStart,
        };
        Tween.tweens[nodeId][key] = this._id;
    };
    Tween.prototype._tweenFunc = function (i) {
        var node = this.node, attrs = Tween.attrs[node._id][this._id], key, attr, start, diff, newVal, n, len, end;
        for (key in attrs) {
            attr = attrs[key];
            start = attr.start;
            diff = attr.diff;
            end = attr.end;
            if (Util_1.Util._isArray(start)) {
                newVal = [];
                len = Math.max(start.length, end.length);
                if (key.indexOf('fill') === 0) {
                    for (n = 0; n < len; n++) {
                        if (n % 2 === 0) {
                            newVal.push((start[n] || 0) + diff[n] * i);
                        }
                        else {
                            newVal.push('rgba(' +
                                Math.round(start[n].r + diff[n].r * i) +
                                ',' +
                                Math.round(start[n].g + diff[n].g * i) +
                                ',' +
                                Math.round(start[n].b + diff[n].b * i) +
                                ',' +
                                (start[n].a + diff[n].a * i) +
                                ')');
                        }
                    }
                }
                else {
                    for (n = 0; n < len; n++) {
                        newVal.push((start[n] || 0) + diff[n] * i);
                    }
                }
            }
            else if (colorAttrs.indexOf(key) !== -1) {
                newVal =
                    'rgba(' +
                        Math.round(start.r + diff.r * i) +
                        ',' +
                        Math.round(start.g + diff.g * i) +
                        ',' +
                        Math.round(start.b + diff.b * i) +
                        ',' +
                        (start.a + diff.a * i) +
                        ')';
            }
            else {
                newVal = start + diff * i;
            }
            node.setAttr(key, newVal);
        }
    };
    Tween.prototype._addListeners = function () {
        var _this = this;
        this.tween.onPlay = function () {
            _this.anim.start();
        };
        this.tween.onReverse = function () {
            _this.anim.start();
        };
        this.tween.onPause = function () {
            _this.anim.stop();
        };
        this.tween.onFinish = function () {
            var node = _this.node;
            var attrs = Tween.attrs[node._id][_this._id];
            if (attrs.points && attrs.points.trueEnd) {
                node.setAttr('points', attrs.points.trueEnd);
            }
            if (_this.onFinish) {
                _this.onFinish.call(_this);
            }
        };
        this.tween.onReset = function () {
            var node = _this.node;
            var attrs = Tween.attrs[node._id][_this._id];
            if (attrs.points && attrs.points.trueStart) {
                node.points(attrs.points.trueStart);
            }
            if (_this.onReset) {
                _this.onReset();
            }
        };
        this.tween.onUpdate = function () {
            if (_this.onUpdate) {
                _this.onUpdate.call(_this);
            }
        };
    };
    Tween.prototype.play = function () {
        this.tween.play();
        return this;
    };
    Tween.prototype.reverse = function () {
        this.tween.reverse();
        return this;
    };
    Tween.prototype.reset = function () {
        this.tween.reset();
        return this;
    };
    Tween.prototype.seek = function (t) {
        this.tween.seek(t * 1000);
        return this;
    };
    Tween.prototype.pause = function () {
        this.tween.pause();
        return this;
    };
    Tween.prototype.finish = function () {
        this.tween.finish();
        return this;
    };
    Tween.prototype.destroy = function () {
        var nodeId = this.node._id, thisId = this._id, attrs = Tween.tweens[nodeId], key;
        this.pause();
        for (key in attrs) {
            delete Tween.tweens[nodeId][key];
        }
        delete Tween.attrs[nodeId][thisId];
    };
    Tween.attrs = {};
    Tween.tweens = {};
    return Tween;
}());
exports.Tween = Tween;
Node_1.Node.prototype.to = function (params) {
    var onFinish = params.onFinish;
    params.node = this;
    params.onFinish = function () {
        this.destroy();
        if (onFinish) {
            onFinish();
        }
    };
    var tween = new Tween(params);
    tween.play();
};
exports.Easings = {
    BackEaseIn: function (t, b, c, d) {
        var s = 1.70158;
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
    },
    BackEaseOut: function (t, b, c, d) {
        var s = 1.70158;
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },
    BackEaseInOut: function (t, b, c, d) {
        var s = 1.70158;
        if ((t /= d / 2) < 1) {
            return (c / 2) * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
        }
        return (c / 2) * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
    },
    ElasticEaseIn: function (t, b, c, d, a, p) {
        var s = 0;
        if (t === 0) {
            return b;
        }
        if ((t /= d) === 1) {
            return b + c;
        }
        if (!p) {
            p = d * 0.3;
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            s = p / 4;
        }
        else {
            s = (p / (2 * Math.PI)) * Math.asin(c / a);
        }
        return (-(a *
            Math.pow(2, 10 * (t -= 1)) *
            Math.sin(((t * d - s) * (2 * Math.PI)) / p)) + b);
    },
    ElasticEaseOut: function (t, b, c, d, a, p) {
        var s = 0;
        if (t === 0) {
            return b;
        }
        if ((t /= d) === 1) {
            return b + c;
        }
        if (!p) {
            p = d * 0.3;
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            s = p / 4;
        }
        else {
            s = (p / (2 * Math.PI)) * Math.asin(c / a);
        }
        return (a * Math.pow(2, -10 * t) * Math.sin(((t * d - s) * (2 * Math.PI)) / p) +
            c +
            b);
    },
    ElasticEaseInOut: function (t, b, c, d, a, p) {
        var s = 0;
        if (t === 0) {
            return b;
        }
        if ((t /= d / 2) === 2) {
            return b + c;
        }
        if (!p) {
            p = d * (0.3 * 1.5);
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            s = p / 4;
        }
        else {
            s = (p / (2 * Math.PI)) * Math.asin(c / a);
        }
        if (t < 1) {
            return (-0.5 *
                (a *
                    Math.pow(2, 10 * (t -= 1)) *
                    Math.sin(((t * d - s) * (2 * Math.PI)) / p)) +
                b);
        }
        return (a *
            Math.pow(2, -10 * (t -= 1)) *
            Math.sin(((t * d - s) * (2 * Math.PI)) / p) *
            0.5 +
            c +
            b);
    },
    BounceEaseOut: function (t, b, c, d) {
        if ((t /= d) < 1 / 2.75) {
            return c * (7.5625 * t * t) + b;
        }
        else if (t < 2 / 2.75) {
            return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b;
        }
        else if (t < 2.5 / 2.75) {
            return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b;
        }
        else {
            return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b;
        }
    },
    BounceEaseIn: function (t, b, c, d) {
        return c - exports.Easings.BounceEaseOut(d - t, 0, c, d) + b;
    },
    BounceEaseInOut: function (t, b, c, d) {
        if (t < d / 2) {
            return exports.Easings.BounceEaseIn(t * 2, 0, c, d) * 0.5 + b;
        }
        else {
            return exports.Easings.BounceEaseOut(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
        }
    },
    EaseIn: function (t, b, c, d) {
        return c * (t /= d) * t + b;
    },
    EaseOut: function (t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b;
    },
    EaseInOut: function (t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return (c / 2) * t * t + b;
        }
        return (-c / 2) * (--t * (t - 2) - 1) + b;
    },
    StrongEaseIn: function (t, b, c, d) {
        return c * (t /= d) * t * t * t * t + b;
    },
    StrongEaseOut: function (t, b, c, d) {
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    },
    StrongEaseInOut: function (t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return (c / 2) * t * t * t * t * t + b;
        }
        return (c / 2) * ((t -= 2) * t * t * t * t + 2) + b;
    },
    Linear: function (t, b, c, d) {
        return (c * t) / d + b;
    },
};

},{"./Animation":4,"./Global":11,"./Node":14,"./Util":19}],19:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Global_1 = _dereq_("./Global");
var Collection = (function () {
    function Collection() {
    }
    Collection.toCollection = function (arr) {
        var collection = new Collection(), len = arr.length, n;
        for (n = 0; n < len; n++) {
            collection.push(arr[n]);
        }
        return collection;
    };
    Collection._mapMethod = function (methodName) {
        Collection.prototype[methodName] = function () {
            var len = this.length, i;
            var args = [].slice.call(arguments);
            for (i = 0; i < len; i++) {
                this[i][methodName].apply(this[i], args);
            }
            return this;
        };
    };
    Collection.mapMethods = function (constructor) {
        var prot = constructor.prototype;
        for (var methodName in prot) {
            Collection._mapMethod(methodName);
        }
    };
    return Collection;
}());
exports.Collection = Collection;
Collection.prototype = [];
Collection.prototype.each = function (func) {
    for (var n = 0; n < this.length; n++) {
        func(this[n], n);
    }
};
Collection.prototype.toArray = function () {
    var arr = [], len = this.length, n;
    for (n = 0; n < len; n++) {
        arr.push(this[n]);
    }
    return arr;
};
var Transform = (function () {
    function Transform(m) {
        if (m === void 0) { m = [1, 0, 0, 1, 0, 0]; }
        this.dirty = false;
        this.m = (m && m.slice()) || [1, 0, 0, 1, 0, 0];
    }
    Transform.prototype.reset = function () {
        this.m[0] = 1;
        this.m[1] = 0;
        this.m[2] = 0;
        this.m[3] = 1;
        this.m[4] = 0;
        this.m[5] = 0;
    };
    Transform.prototype.copy = function () {
        return new Transform(this.m);
    };
    Transform.prototype.copyInto = function (tr) {
        tr.m[0] = this.m[0];
        tr.m[1] = this.m[1];
        tr.m[2] = this.m[2];
        tr.m[3] = this.m[3];
        tr.m[4] = this.m[4];
        tr.m[5] = this.m[5];
    };
    Transform.prototype.point = function (point) {
        var m = this.m;
        return {
            x: m[0] * point.x + m[2] * point.y + m[4],
            y: m[1] * point.x + m[3] * point.y + m[5],
        };
    };
    Transform.prototype.translate = function (x, y) {
        this.m[4] += this.m[0] * x + this.m[2] * y;
        this.m[5] += this.m[1] * x + this.m[3] * y;
        return this;
    };
    Transform.prototype.scale = function (sx, sy) {
        this.m[0] *= sx;
        this.m[1] *= sx;
        this.m[2] *= sy;
        this.m[3] *= sy;
        return this;
    };
    Transform.prototype.rotate = function (rad) {
        var c = Math.cos(rad);
        var s = Math.sin(rad);
        var m11 = this.m[0] * c + this.m[2] * s;
        var m12 = this.m[1] * c + this.m[3] * s;
        var m21 = this.m[0] * -s + this.m[2] * c;
        var m22 = this.m[1] * -s + this.m[3] * c;
        this.m[0] = m11;
        this.m[1] = m12;
        this.m[2] = m21;
        this.m[3] = m22;
        return this;
    };
    Transform.prototype.getTranslation = function () {
        return {
            x: this.m[4],
            y: this.m[5],
        };
    };
    Transform.prototype.skew = function (sx, sy) {
        var m11 = this.m[0] + this.m[2] * sy;
        var m12 = this.m[1] + this.m[3] * sy;
        var m21 = this.m[2] + this.m[0] * sx;
        var m22 = this.m[3] + this.m[1] * sx;
        this.m[0] = m11;
        this.m[1] = m12;
        this.m[2] = m21;
        this.m[3] = m22;
        return this;
    };
    Transform.prototype.multiply = function (matrix) {
        var m11 = this.m[0] * matrix.m[0] + this.m[2] * matrix.m[1];
        var m12 = this.m[1] * matrix.m[0] + this.m[3] * matrix.m[1];
        var m21 = this.m[0] * matrix.m[2] + this.m[2] * matrix.m[3];
        var m22 = this.m[1] * matrix.m[2] + this.m[3] * matrix.m[3];
        var dx = this.m[0] * matrix.m[4] + this.m[2] * matrix.m[5] + this.m[4];
        var dy = this.m[1] * matrix.m[4] + this.m[3] * matrix.m[5] + this.m[5];
        this.m[0] = m11;
        this.m[1] = m12;
        this.m[2] = m21;
        this.m[3] = m22;
        this.m[4] = dx;
        this.m[5] = dy;
        return this;
    };
    Transform.prototype.invert = function () {
        var d = 1 / (this.m[0] * this.m[3] - this.m[1] * this.m[2]);
        var m0 = this.m[3] * d;
        var m1 = -this.m[1] * d;
        var m2 = -this.m[2] * d;
        var m3 = this.m[0] * d;
        var m4 = d * (this.m[2] * this.m[5] - this.m[3] * this.m[4]);
        var m5 = d * (this.m[1] * this.m[4] - this.m[0] * this.m[5]);
        this.m[0] = m0;
        this.m[1] = m1;
        this.m[2] = m2;
        this.m[3] = m3;
        this.m[4] = m4;
        this.m[5] = m5;
        return this;
    };
    Transform.prototype.getMatrix = function () {
        return this.m;
    };
    Transform.prototype.setAbsolutePosition = function (x, y) {
        var m0 = this.m[0], m1 = this.m[1], m2 = this.m[2], m3 = this.m[3], m4 = this.m[4], m5 = this.m[5], yt = (m0 * (y - m5) - m1 * (x - m4)) / (m0 * m3 - m1 * m2), xt = (x - m4 - m2 * yt) / m0;
        return this.translate(xt, yt);
    };
    Transform.prototype.decompose = function () {
        var a = this.m[0];
        var b = this.m[1];
        var c = this.m[2];
        var d = this.m[3];
        var e = this.m[4];
        var f = this.m[5];
        var delta = a * d - b * c;
        var result = {
            x: e,
            y: f,
            rotation: 0,
            scaleX: 0,
            scaleY: 0,
            skewX: 0,
            skewY: 0,
        };
        if (a != 0 || b != 0) {
            var r = Math.sqrt(a * a + b * b);
            result.rotation = b > 0 ? Math.acos(a / r) : -Math.acos(a / r);
            result.scaleX = r;
            result.scaleY = delta / r;
            result.skewX = (a * c + b * d) / delta;
            result.skewY = 0;
        }
        else if (c != 0 || d != 0) {
            var s = Math.sqrt(c * c + d * d);
            result.rotation =
                Math.PI / 2 - (d > 0 ? Math.acos(-c / s) : -Math.acos(c / s));
            result.scaleX = delta / s;
            result.scaleY = s;
            result.skewX = 0;
            result.skewY = (a * c + b * d) / delta;
        }
        else {
        }
        result.rotation = exports.Util._getRotation(result.rotation);
        return result;
    };
    return Transform;
}());
exports.Transform = Transform;
var OBJECT_ARRAY = '[object Array]', OBJECT_NUMBER = '[object Number]', OBJECT_STRING = '[object String]', OBJECT_BOOLEAN = '[object Boolean]', PI_OVER_DEG180 = Math.PI / 180, DEG180_OVER_PI = 180 / Math.PI, HASH = '#', EMPTY_STRING = '', ZERO = '0', KONVA_WARNING = 'Konva warning: ', KONVA_ERROR = 'Konva error: ', RGB_PAREN = 'rgb(', COLORS = {
    aliceblue: [240, 248, 255],
    antiquewhite: [250, 235, 215],
    aqua: [0, 255, 255],
    aquamarine: [127, 255, 212],
    azure: [240, 255, 255],
    beige: [245, 245, 220],
    bisque: [255, 228, 196],
    black: [0, 0, 0],
    blanchedalmond: [255, 235, 205],
    blue: [0, 0, 255],
    blueviolet: [138, 43, 226],
    brown: [165, 42, 42],
    burlywood: [222, 184, 135],
    cadetblue: [95, 158, 160],
    chartreuse: [127, 255, 0],
    chocolate: [210, 105, 30],
    coral: [255, 127, 80],
    cornflowerblue: [100, 149, 237],
    cornsilk: [255, 248, 220],
    crimson: [220, 20, 60],
    cyan: [0, 255, 255],
    darkblue: [0, 0, 139],
    darkcyan: [0, 139, 139],
    darkgoldenrod: [184, 132, 11],
    darkgray: [169, 169, 169],
    darkgreen: [0, 100, 0],
    darkgrey: [169, 169, 169],
    darkkhaki: [189, 183, 107],
    darkmagenta: [139, 0, 139],
    darkolivegreen: [85, 107, 47],
    darkorange: [255, 140, 0],
    darkorchid: [153, 50, 204],
    darkred: [139, 0, 0],
    darksalmon: [233, 150, 122],
    darkseagreen: [143, 188, 143],
    darkslateblue: [72, 61, 139],
    darkslategray: [47, 79, 79],
    darkslategrey: [47, 79, 79],
    darkturquoise: [0, 206, 209],
    darkviolet: [148, 0, 211],
    deeppink: [255, 20, 147],
    deepskyblue: [0, 191, 255],
    dimgray: [105, 105, 105],
    dimgrey: [105, 105, 105],
    dodgerblue: [30, 144, 255],
    firebrick: [178, 34, 34],
    floralwhite: [255, 255, 240],
    forestgreen: [34, 139, 34],
    fuchsia: [255, 0, 255],
    gainsboro: [220, 220, 220],
    ghostwhite: [248, 248, 255],
    gold: [255, 215, 0],
    goldenrod: [218, 165, 32],
    gray: [128, 128, 128],
    green: [0, 128, 0],
    greenyellow: [173, 255, 47],
    grey: [128, 128, 128],
    honeydew: [240, 255, 240],
    hotpink: [255, 105, 180],
    indianred: [205, 92, 92],
    indigo: [75, 0, 130],
    ivory: [255, 255, 240],
    khaki: [240, 230, 140],
    lavender: [230, 230, 250],
    lavenderblush: [255, 240, 245],
    lawngreen: [124, 252, 0],
    lemonchiffon: [255, 250, 205],
    lightblue: [173, 216, 230],
    lightcoral: [240, 128, 128],
    lightcyan: [224, 255, 255],
    lightgoldenrodyellow: [250, 250, 210],
    lightgray: [211, 211, 211],
    lightgreen: [144, 238, 144],
    lightgrey: [211, 211, 211],
    lightpink: [255, 182, 193],
    lightsalmon: [255, 160, 122],
    lightseagreen: [32, 178, 170],
    lightskyblue: [135, 206, 250],
    lightslategray: [119, 136, 153],
    lightslategrey: [119, 136, 153],
    lightsteelblue: [176, 196, 222],
    lightyellow: [255, 255, 224],
    lime: [0, 255, 0],
    limegreen: [50, 205, 50],
    linen: [250, 240, 230],
    magenta: [255, 0, 255],
    maroon: [128, 0, 0],
    mediumaquamarine: [102, 205, 170],
    mediumblue: [0, 0, 205],
    mediumorchid: [186, 85, 211],
    mediumpurple: [147, 112, 219],
    mediumseagreen: [60, 179, 113],
    mediumslateblue: [123, 104, 238],
    mediumspringgreen: [0, 250, 154],
    mediumturquoise: [72, 209, 204],
    mediumvioletred: [199, 21, 133],
    midnightblue: [25, 25, 112],
    mintcream: [245, 255, 250],
    mistyrose: [255, 228, 225],
    moccasin: [255, 228, 181],
    navajowhite: [255, 222, 173],
    navy: [0, 0, 128],
    oldlace: [253, 245, 230],
    olive: [128, 128, 0],
    olivedrab: [107, 142, 35],
    orange: [255, 165, 0],
    orangered: [255, 69, 0],
    orchid: [218, 112, 214],
    palegoldenrod: [238, 232, 170],
    palegreen: [152, 251, 152],
    paleturquoise: [175, 238, 238],
    palevioletred: [219, 112, 147],
    papayawhip: [255, 239, 213],
    peachpuff: [255, 218, 185],
    peru: [205, 133, 63],
    pink: [255, 192, 203],
    plum: [221, 160, 203],
    powderblue: [176, 224, 230],
    purple: [128, 0, 128],
    rebeccapurple: [102, 51, 153],
    red: [255, 0, 0],
    rosybrown: [188, 143, 143],
    royalblue: [65, 105, 225],
    saddlebrown: [139, 69, 19],
    salmon: [250, 128, 114],
    sandybrown: [244, 164, 96],
    seagreen: [46, 139, 87],
    seashell: [255, 245, 238],
    sienna: [160, 82, 45],
    silver: [192, 192, 192],
    skyblue: [135, 206, 235],
    slateblue: [106, 90, 205],
    slategray: [119, 128, 144],
    slategrey: [119, 128, 144],
    snow: [255, 255, 250],
    springgreen: [0, 255, 127],
    steelblue: [70, 130, 180],
    tan: [210, 180, 140],
    teal: [0, 128, 128],
    thistle: [216, 191, 216],
    transparent: [255, 255, 255, 0],
    tomato: [255, 99, 71],
    turquoise: [64, 224, 208],
    violet: [238, 130, 238],
    wheat: [245, 222, 179],
    white: [255, 255, 255],
    whitesmoke: [245, 245, 245],
    yellow: [255, 255, 0],
    yellowgreen: [154, 205, 5],
}, RGB_REGEX = /rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)/, animQueue = [];
exports.Util = {
    _isElement: function (obj) {
        return !!(obj && obj.nodeType == 1);
    },
    _isFunction: function (obj) {
        return !!(obj && obj.constructor && obj.call && obj.apply);
    },
    _isPlainObject: function (obj) {
        return !!obj && obj.constructor === Object;
    },
    _isArray: function (obj) {
        return Object.prototype.toString.call(obj) === OBJECT_ARRAY;
    },
    _isNumber: function (obj) {
        return (Object.prototype.toString.call(obj) === OBJECT_NUMBER &&
            !isNaN(obj) &&
            isFinite(obj));
    },
    _isString: function (obj) {
        return Object.prototype.toString.call(obj) === OBJECT_STRING;
    },
    _isBoolean: function (obj) {
        return Object.prototype.toString.call(obj) === OBJECT_BOOLEAN;
    },
    isObject: function (val) {
        return val instanceof Object;
    },
    isValidSelector: function (selector) {
        if (typeof selector !== 'string') {
            return false;
        }
        var firstChar = selector[0];
        return (firstChar === '#' ||
            firstChar === '.' ||
            firstChar === firstChar.toUpperCase());
    },
    _sign: function (number) {
        if (number === 0) {
            return 0;
        }
        if (number > 0) {
            return 1;
        }
        else {
            return -1;
        }
    },
    requestAnimFrame: function (callback) {
        animQueue.push(callback);
        if (animQueue.length === 1) {
            requestAnimationFrame(function () {
                var queue = animQueue;
                animQueue = [];
                queue.forEach(function (cb) {
                    cb();
                });
            });
        }
    },
    createCanvasElement: function () {
        var canvas = document.createElement('canvas');
        try {
            canvas.style = canvas.style || {};
        }
        catch (e) { }
        return canvas;
    },
    createImageElement: function () {
        return document.createElement('img');
    },
    _isInDocument: function (el) {
        while ((el = el.parentNode)) {
            if (el == document) {
                return true;
            }
        }
        return false;
    },
    _simplifyArray: function (arr) {
        var retArr = [], len = arr.length, util = exports.Util, n, val;
        for (n = 0; n < len; n++) {
            val = arr[n];
            if (util._isNumber(val)) {
                val = Math.round(val * 1000) / 1000;
            }
            else if (!util._isString(val)) {
                val = val.toString();
            }
            retArr.push(val);
        }
        return retArr;
    },
    _urlToImage: function (url, callback) {
        var imageObj = new Global_1.glob.Image();
        imageObj.onload = function () {
            callback(imageObj);
        };
        imageObj.src = url;
    },
    _rgbToHex: function (r, g, b) {
        return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    },
    _hexToRgb: function (hex) {
        hex = hex.replace(HASH, EMPTY_STRING);
        var bigint = parseInt(hex, 16);
        return {
            r: (bigint >> 16) & 255,
            g: (bigint >> 8) & 255,
            b: bigint & 255,
        };
    },
    getRandomColor: function () {
        var randColor = ((Math.random() * 0xffffff) << 0).toString(16);
        while (randColor.length < 6) {
            randColor = ZERO + randColor;
        }
        return HASH + randColor;
    },
    get: function (val, def) {
        if (val === undefined) {
            return def;
        }
        else {
            return val;
        }
    },
    getRGB: function (color) {
        var rgb;
        if (color in COLORS) {
            rgb = COLORS[color];
            return {
                r: rgb[0],
                g: rgb[1],
                b: rgb[2],
            };
        }
        else if (color[0] === HASH) {
            return this._hexToRgb(color.substring(1));
        }
        else if (color.substr(0, 4) === RGB_PAREN) {
            rgb = RGB_REGEX.exec(color.replace(/ /g, ''));
            return {
                r: parseInt(rgb[1], 10),
                g: parseInt(rgb[2], 10),
                b: parseInt(rgb[3], 10),
            };
        }
        else {
            return {
                r: 0,
                g: 0,
                b: 0,
            };
        }
    },
    colorToRGBA: function (str) {
        str = str || 'black';
        return (exports.Util._namedColorToRBA(str) ||
            exports.Util._hex3ColorToRGBA(str) ||
            exports.Util._hex6ColorToRGBA(str) ||
            exports.Util._rgbColorToRGBA(str) ||
            exports.Util._rgbaColorToRGBA(str) ||
            exports.Util._hslColorToRGBA(str));
    },
    _namedColorToRBA: function (str) {
        var c = COLORS[str.toLowerCase()];
        if (!c) {
            return null;
        }
        return {
            r: c[0],
            g: c[1],
            b: c[2],
            a: 1,
        };
    },
    _rgbColorToRGBA: function (str) {
        if (str.indexOf('rgb(') === 0) {
            str = str.match(/rgb\(([^)]+)\)/)[1];
            var parts = str.split(/ *, */).map(Number);
            return {
                r: parts[0],
                g: parts[1],
                b: parts[2],
                a: 1,
            };
        }
    },
    _rgbaColorToRGBA: function (str) {
        if (str.indexOf('rgba(') === 0) {
            str = str.match(/rgba\(([^)]+)\)/)[1];
            var parts = str.split(/ *, */).map(Number);
            return {
                r: parts[0],
                g: parts[1],
                b: parts[2],
                a: parts[3],
            };
        }
    },
    _hex6ColorToRGBA: function (str) {
        if (str[0] === '#' && str.length === 7) {
            return {
                r: parseInt(str.slice(1, 3), 16),
                g: parseInt(str.slice(3, 5), 16),
                b: parseInt(str.slice(5, 7), 16),
                a: 1,
            };
        }
    },
    _hex3ColorToRGBA: function (str) {
        if (str[0] === '#' && str.length === 4) {
            return {
                r: parseInt(str[1] + str[1], 16),
                g: parseInt(str[2] + str[2], 16),
                b: parseInt(str[3] + str[3], 16),
                a: 1,
            };
        }
    },
    _hslColorToRGBA: function (str) {
        if (/hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.test(str)) {
            var _a = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(str), _ = _a[0], hsl = _a.slice(1);
            var h = Number(hsl[0]) / 360;
            var s = Number(hsl[1]) / 100;
            var l = Number(hsl[2]) / 100;
            var t2 = void 0;
            var t3 = void 0;
            var val = void 0;
            if (s === 0) {
                val = l * 255;
                return {
                    r: Math.round(val),
                    g: Math.round(val),
                    b: Math.round(val),
                    a: 1,
                };
            }
            if (l < 0.5) {
                t2 = l * (1 + s);
            }
            else {
                t2 = l + s - l * s;
            }
            var t1 = 2 * l - t2;
            var rgb = [0, 0, 0];
            for (var i = 0; i < 3; i++) {
                t3 = h + (1 / 3) * -(i - 1);
                if (t3 < 0) {
                    t3++;
                }
                if (t3 > 1) {
                    t3--;
                }
                if (6 * t3 < 1) {
                    val = t1 + (t2 - t1) * 6 * t3;
                }
                else if (2 * t3 < 1) {
                    val = t2;
                }
                else if (3 * t3 < 2) {
                    val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
                }
                else {
                    val = t1;
                }
                rgb[i] = val * 255;
            }
            return {
                r: Math.round(rgb[0]),
                g: Math.round(rgb[1]),
                b: Math.round(rgb[2]),
                a: 1,
            };
        }
    },
    haveIntersection: function (r1, r2) {
        return !(r2.x > r1.x + r1.width ||
            r2.x + r2.width < r1.x ||
            r2.y > r1.y + r1.height ||
            r2.y + r2.height < r1.y);
    },
    cloneObject: function (obj) {
        var retObj = {};
        for (var key in obj) {
            if (this._isPlainObject(obj[key])) {
                retObj[key] = this.cloneObject(obj[key]);
            }
            else if (this._isArray(obj[key])) {
                retObj[key] = this.cloneArray(obj[key]);
            }
            else {
                retObj[key] = obj[key];
            }
        }
        return retObj;
    },
    cloneArray: function (arr) {
        return arr.slice(0);
    },
    _degToRad: function (deg) {
        return deg * PI_OVER_DEG180;
    },
    _radToDeg: function (rad) {
        return rad * DEG180_OVER_PI;
    },
    _getRotation: function (radians) {
        return Global_1.Konva.angleDeg ? exports.Util._radToDeg(radians) : radians;
    },
    _capitalize: function (str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },
    throw: function (str) {
        throw new Error(KONVA_ERROR + str);
    },
    error: function (str) {
        console.error(KONVA_ERROR + str);
    },
    warn: function (str) {
        if (!Global_1.Konva.showWarnings) {
            return;
        }
        console.warn(KONVA_WARNING + str);
    },
    extend: function (child, parent) {
        function Ctor() {
            this.constructor = child;
        }
        Ctor.prototype = parent.prototype;
        var oldProto = child.prototype;
        child.prototype = new Ctor();
        for (var key in oldProto) {
            if (oldProto.hasOwnProperty(key)) {
                child.prototype[key] = oldProto[key];
            }
        }
        child.__super__ = parent.prototype;
        child.super = parent;
    },
    _getControlPoints: function (x0, y0, x1, y1, x2, y2, t) {
        var d01 = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2)), d12 = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)), fa = (t * d01) / (d01 + d12), fb = (t * d12) / (d01 + d12), p1x = x1 - fa * (x2 - x0), p1y = y1 - fa * (y2 - y0), p2x = x1 + fb * (x2 - x0), p2y = y1 + fb * (y2 - y0);
        return [p1x, p1y, p2x, p2y];
    },
    _expandPoints: function (p, tension) {
        var len = p.length, allPoints = [], n, cp;
        for (n = 2; n < len - 2; n += 2) {
            cp = exports.Util._getControlPoints(p[n - 2], p[n - 1], p[n], p[n + 1], p[n + 2], p[n + 3], tension);
            allPoints.push(cp[0]);
            allPoints.push(cp[1]);
            allPoints.push(p[n]);
            allPoints.push(p[n + 1]);
            allPoints.push(cp[2]);
            allPoints.push(cp[3]);
        }
        return allPoints;
    },
    each: function (obj, func) {
        for (var key in obj) {
            func(key, obj[key]);
        }
    },
    _inRange: function (val, left, right) {
        return left <= val && val < right;
    },
    _getProjectionToSegment: function (x1, y1, x2, y2, x3, y3) {
        var x, y, dist;
        var pd2 = (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
        if (pd2 == 0) {
            x = x1;
            y = y1;
            dist = (x3 - x2) * (x3 - x2) + (y3 - y2) * (y3 - y2);
        }
        else {
            var u = ((x3 - x1) * (x2 - x1) + (y3 - y1) * (y2 - y1)) / pd2;
            if (u < 0) {
                x = x1;
                y = y1;
                dist = (x1 - x3) * (x1 - x3) + (y1 - y3) * (y1 - y3);
            }
            else if (u > 1.0) {
                x = x2;
                y = y2;
                dist = (x2 - x3) * (x2 - x3) + (y2 - y3) * (y2 - y3);
            }
            else {
                x = x1 + u * (x2 - x1);
                y = y1 + u * (y2 - y1);
                dist = (x - x3) * (x - x3) + (y - y3) * (y - y3);
            }
        }
        return [x, y, dist];
    },
    _getProjectionToLine: function (pt, line, isClosed) {
        var pc = exports.Util.cloneObject(pt);
        var dist = Number.MAX_VALUE;
        line.forEach(function (p1, i) {
            if (!isClosed && i === line.length - 1) {
                return;
            }
            var p2 = line[(i + 1) % line.length];
            var proj = exports.Util._getProjectionToSegment(p1.x, p1.y, p2.x, p2.y, pt.x, pt.y);
            var px = proj[0], py = proj[1], pdist = proj[2];
            if (pdist < dist) {
                pc.x = px;
                pc.y = py;
                dist = pdist;
            }
        });
        return pc;
    },
    _prepareArrayForTween: function (startArray, endArray, isClosed) {
        var n, start = [], end = [];
        if (startArray.length > endArray.length) {
            var temp = endArray;
            endArray = startArray;
            startArray = temp;
        }
        for (n = 0; n < startArray.length; n += 2) {
            start.push({
                x: startArray[n],
                y: startArray[n + 1],
            });
        }
        for (n = 0; n < endArray.length; n += 2) {
            end.push({
                x: endArray[n],
                y: endArray[n + 1],
            });
        }
        var newStart = [];
        end.forEach(function (point) {
            var pr = exports.Util._getProjectionToLine(point, start, isClosed);
            newStart.push(pr.x);
            newStart.push(pr.y);
        });
        return newStart;
    },
    _prepareToStringify: function (obj) {
        var desc;
        obj.visitedByCircularReferenceRemoval = true;
        for (var key in obj) {
            if (!(obj.hasOwnProperty(key) && obj[key] && typeof obj[key] == 'object')) {
                continue;
            }
            desc = Object.getOwnPropertyDescriptor(obj, key);
            if (obj[key].visitedByCircularReferenceRemoval ||
                exports.Util._isElement(obj[key])) {
                if (desc.configurable) {
                    delete obj[key];
                }
                else {
                    return null;
                }
            }
            else if (exports.Util._prepareToStringify(obj[key]) === null) {
                if (desc.configurable) {
                    delete obj[key];
                }
                else {
                    return null;
                }
            }
        }
        delete obj.visitedByCircularReferenceRemoval;
        return obj;
    },
    _assign: function (target, source) {
        for (var key in source) {
            target[key] = source[key];
        }
        return target;
    },
    _getFirstPointerId: function (evt) {
        if (!evt.touches) {
            return 999;
        }
        else {
            return evt.changedTouches[0].identifier;
        }
    },
};

},{"./Global":11}],20:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Global_1 = _dereq_("./Global");
var Util_1 = _dereq_("./Util");
function _formatValue(val) {
    if (Util_1.Util._isString(val)) {
        return '"' + val + '"';
    }
    if (Object.prototype.toString.call(val) === '[object Number]') {
        return val;
    }
    if (Util_1.Util._isBoolean(val)) {
        return val;
    }
    return Object.prototype.toString.call(val);
}
function RGBComponent(val) {
    if (val > 255) {
        return 255;
    }
    else if (val < 0) {
        return 0;
    }
    return Math.round(val);
}
exports.RGBComponent = RGBComponent;
function alphaComponent(val) {
    if (val > 1) {
        return 1;
    }
    else if (val < 0.0001) {
        return 0.0001;
    }
    return val;
}
exports.alphaComponent = alphaComponent;
function getNumberValidator() {
    if (Global_1.Konva.isUnminified) {
        return function (val, attr) {
            if (!Util_1.Util._isNumber(val)) {
                Util_1.Util.warn(_formatValue(val) +
                    ' is a not valid value for "' +
                    attr +
                    '" attribute. The value should be a number.');
            }
            return val;
        };
    }
}
exports.getNumberValidator = getNumberValidator;
function getNumberOrArrayOfNumbersValidator(noOfElements) {
    if (Global_1.Konva.isUnminified) {
        return function (val, attr) {
            var isNumber = Util_1.Util._isNumber(val);
            var isValidArray = Util_1.Util._isArray(val) && val.length == noOfElements;
            if (!isNumber && !isValidArray) {
                Util_1.Util.warn(_formatValue(val) +
                    ' is a not valid value for "' +
                    attr +
                    '" attribute. The value should be a number or Array<number>(' + noOfElements + ')');
            }
            return val;
        };
    }
}
exports.getNumberOrArrayOfNumbersValidator = getNumberOrArrayOfNumbersValidator;
function getNumberOrAutoValidator() {
    if (Global_1.Konva.isUnminified) {
        return function (val, attr) {
            var isNumber = Util_1.Util._isNumber(val);
            var isAuto = val === 'auto';
            if (!(isNumber || isAuto)) {
                Util_1.Util.warn(_formatValue(val) +
                    ' is a not valid value for "' +
                    attr +
                    '" attribute. The value should be a number or "auto".');
            }
            return val;
        };
    }
}
exports.getNumberOrAutoValidator = getNumberOrAutoValidator;
function getStringValidator() {
    if (Global_1.Konva.isUnminified) {
        return function (val, attr) {
            if (!Util_1.Util._isString(val)) {
                Util_1.Util.warn(_formatValue(val) +
                    ' is a not valid value for "' +
                    attr +
                    '" attribute. The value should be a string.');
            }
            return val;
        };
    }
}
exports.getStringValidator = getStringValidator;
function getStringOrGradientValidator() {
    if (Global_1.Konva.isUnminified) {
        return function (val, attr) {
            var isString = Util_1.Util._isString(val);
            var isGradient = Object.prototype.toString.call(val) === '[object CanvasGradient]';
            if (!(isString || isGradient)) {
                Util_1.Util.warn(_formatValue(val) +
                    ' is a not valid value for "' +
                    attr +
                    '" attribute. The value should be a string or a native gradient.');
            }
            return val;
        };
    }
}
exports.getStringOrGradientValidator = getStringOrGradientValidator;
function getFunctionValidator() {
    if (Global_1.Konva.isUnminified) {
        return function (val, attr) {
            if (!Util_1.Util._isFunction(val)) {
                Util_1.Util.warn(_formatValue(val) +
                    ' is a not valid value for "' +
                    attr +
                    '" attribute. The value should be a function.');
            }
            return val;
        };
    }
}
exports.getFunctionValidator = getFunctionValidator;
function getNumberArrayValidator() {
    if (Global_1.Konva.isUnminified) {
        return function (val, attr) {
            if (!Util_1.Util._isArray(val)) {
                Util_1.Util.warn(_formatValue(val) +
                    ' is a not valid value for "' +
                    attr +
                    '" attribute. The value should be a array of numbers.');
            }
            else {
                val.forEach(function (item) {
                    if (!Util_1.Util._isNumber(item)) {
                        Util_1.Util.warn('"' +
                            attr +
                            '" attribute has non numeric element ' +
                            item +
                            '. Make sure that all elements are numbers.');
                    }
                });
            }
            return val;
        };
    }
}
exports.getNumberArrayValidator = getNumberArrayValidator;
function getBooleanValidator() {
    if (Global_1.Konva.isUnminified) {
        return function (val, attr) {
            var isBool = val === true || val === false;
            if (!isBool) {
                Util_1.Util.warn(_formatValue(val) +
                    ' is a not valid value for "' +
                    attr +
                    '" attribute. The value should be a boolean.');
            }
            return val;
        };
    }
}
exports.getBooleanValidator = getBooleanValidator;
function getComponentValidator(components) {
    if (Global_1.Konva.isUnminified) {
        return function (val, attr) {
            if (!Util_1.Util.isObject(val)) {
                Util_1.Util.warn(_formatValue(val) +
                    ' is a not valid value for "' +
                    attr +
                    '" attribute. The value should be an object with properties ' +
                    components);
            }
            return val;
        };
    }
}
exports.getComponentValidator = getComponentValidator;

},{"./Global":11,"./Util":19}],21:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Global_1 = _dereq_("./Global");
var Util_1 = _dereq_("./Util");
var Node_1 = _dereq_("./Node");
var Container_1 = _dereq_("./Container");
var Stage_1 = _dereq_("./Stage");
var Layer_1 = _dereq_("./Layer");
var FastLayer_1 = _dereq_("./FastLayer");
var Group_1 = _dereq_("./Group");
var DragAndDrop_1 = _dereq_("./DragAndDrop");
var Shape_1 = _dereq_("./Shape");
var Animation_1 = _dereq_("./Animation");
var Tween_1 = _dereq_("./Tween");
var Context_1 = _dereq_("./Context");
var Canvas_1 = _dereq_("./Canvas");
exports.Konva = Util_1.Util._assign(Global_1.Konva, {
    Collection: Util_1.Collection,
    Util: Util_1.Util,
    Transform: Util_1.Transform,
    Node: Node_1.Node,
    ids: Node_1.ids,
    names: Node_1.names,
    Container: Container_1.Container,
    Stage: Stage_1.Stage,
    stages: Stage_1.stages,
    Layer: Layer_1.Layer,
    FastLayer: FastLayer_1.FastLayer,
    Group: Group_1.Group,
    DD: DragAndDrop_1.DD,
    Shape: Shape_1.Shape,
    shapes: Shape_1.shapes,
    Animation: Animation_1.Animation,
    Tween: Tween_1.Tween,
    Easings: Tween_1.Easings,
    Context: Context_1.Context,
    Canvas: Canvas_1.Canvas
});

},{"./Animation":4,"./Canvas":5,"./Container":6,"./Context":7,"./DragAndDrop":8,"./FastLayer":10,"./Global":11,"./Group":12,"./Layer":13,"./Node":14,"./Shape":16,"./Stage":17,"./Tween":18,"./Util":19}],22:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _CoreInternals_1 = _dereq_("./_CoreInternals");
var Arc_1 = _dereq_("./shapes/Arc");
var Arrow_1 = _dereq_("./shapes/Arrow");
var Circle_1 = _dereq_("./shapes/Circle");
var Ellipse_1 = _dereq_("./shapes/Ellipse");
var Image_1 = _dereq_("./shapes/Image");
var Label_1 = _dereq_("./shapes/Label");
var Line_1 = _dereq_("./shapes/Line");
var Path_1 = _dereq_("./shapes/Path");
var Rect_1 = _dereq_("./shapes/Rect");
var RegularPolygon_1 = _dereq_("./shapes/RegularPolygon");
var Ring_1 = _dereq_("./shapes/Ring");
var Sprite_1 = _dereq_("./shapes/Sprite");
var Star_1 = _dereq_("./shapes/Star");
var Text_1 = _dereq_("./shapes/Text");
var TextPath_1 = _dereq_("./shapes/TextPath");
var Transformer_1 = _dereq_("./shapes/Transformer");
var Wedge_1 = _dereq_("./shapes/Wedge");
var Blur_1 = _dereq_("./filters/Blur");
var Brighten_1 = _dereq_("./filters/Brighten");
var Contrast_1 = _dereq_("./filters/Contrast");
var Emboss_1 = _dereq_("./filters/Emboss");
var Enhance_1 = _dereq_("./filters/Enhance");
var Grayscale_1 = _dereq_("./filters/Grayscale");
var HSL_1 = _dereq_("./filters/HSL");
var HSV_1 = _dereq_("./filters/HSV");
var Invert_1 = _dereq_("./filters/Invert");
var Kaleidoscope_1 = _dereq_("./filters/Kaleidoscope");
var Mask_1 = _dereq_("./filters/Mask");
var Noise_1 = _dereq_("./filters/Noise");
var Pixelate_1 = _dereq_("./filters/Pixelate");
var Posterize_1 = _dereq_("./filters/Posterize");
var RGB_1 = _dereq_("./filters/RGB");
var RGBA_1 = _dereq_("./filters/RGBA");
var Sepia_1 = _dereq_("./filters/Sepia");
var Solarize_1 = _dereq_("./filters/Solarize");
var Threshold_1 = _dereq_("./filters/Threshold");
exports.Konva = _CoreInternals_1.Konva.Util._assign(_CoreInternals_1.Konva, {
    Arc: Arc_1.Arc,
    Arrow: Arrow_1.Arrow,
    Circle: Circle_1.Circle,
    Ellipse: Ellipse_1.Ellipse,
    Image: Image_1.Image,
    Label: Label_1.Label,
    Tag: Label_1.Tag,
    Line: Line_1.Line,
    Path: Path_1.Path,
    Rect: Rect_1.Rect,
    RegularPolygon: RegularPolygon_1.RegularPolygon,
    Ring: Ring_1.Ring,
    Sprite: Sprite_1.Sprite,
    Star: Star_1.Star,
    Text: Text_1.Text,
    TextPath: TextPath_1.TextPath,
    Transformer: Transformer_1.Transformer,
    Wedge: Wedge_1.Wedge,
    Filters: {
        Blur: Blur_1.Blur,
        Brighten: Brighten_1.Brighten,
        Contrast: Contrast_1.Contrast,
        Emboss: Emboss_1.Emboss,
        Enhance: Enhance_1.Enhance,
        Grayscale: Grayscale_1.Grayscale,
        HSL: HSL_1.HSL,
        HSV: HSV_1.HSV,
        Invert: Invert_1.Invert,
        Kaleidoscope: Kaleidoscope_1.Kaleidoscope,
        Mask: Mask_1.Mask,
        Noise: Noise_1.Noise,
        Pixelate: Pixelate_1.Pixelate,
        Posterize: Posterize_1.Posterize,
        RGB: RGB_1.RGB,
        RGBA: RGBA_1.RGBA,
        Sepia: Sepia_1.Sepia,
        Solarize: Solarize_1.Solarize,
        Threshold: Threshold_1.Threshold,
    },
});

},{"./_CoreInternals":21,"./filters/Blur":23,"./filters/Brighten":24,"./filters/Contrast":25,"./filters/Emboss":26,"./filters/Enhance":27,"./filters/Grayscale":28,"./filters/HSL":29,"./filters/HSV":30,"./filters/Invert":31,"./filters/Kaleidoscope":32,"./filters/Mask":33,"./filters/Noise":34,"./filters/Pixelate":35,"./filters/Posterize":36,"./filters/RGB":37,"./filters/RGBA":38,"./filters/Sepia":39,"./filters/Solarize":40,"./filters/Threshold":41,"./shapes/Arc":43,"./shapes/Arrow":44,"./shapes/Circle":45,"./shapes/Ellipse":46,"./shapes/Image":47,"./shapes/Label":48,"./shapes/Line":49,"./shapes/Path":50,"./shapes/Rect":51,"./shapes/RegularPolygon":52,"./shapes/Ring":53,"./shapes/Sprite":54,"./shapes/Star":55,"./shapes/Text":56,"./shapes/TextPath":57,"./shapes/Transformer":58,"./shapes/Wedge":59}],23:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Factory_1 = _dereq_("../Factory");
var Node_1 = _dereq_("../Node");
var Validators_1 = _dereq_("../Validators");
function BlurStack() {
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.a = 0;
    this.next = null;
}
var mul_table = [
    512,
    512,
    456,
    512,
    328,
    456,
    335,
    512,
    405,
    328,
    271,
    456,
    388,
    335,
    292,
    512,
    454,
    405,
    364,
    328,
    298,
    271,
    496,
    456,
    420,
    388,
    360,
    335,
    312,
    292,
    273,
    512,
    482,
    454,
    428,
    405,
    383,
    364,
    345,
    328,
    312,
    298,
    284,
    271,
    259,
    496,
    475,
    456,
    437,
    420,
    404,
    388,
    374,
    360,
    347,
    335,
    323,
    312,
    302,
    292,
    282,
    273,
    265,
    512,
    497,
    482,
    468,
    454,
    441,
    428,
    417,
    405,
    394,
    383,
    373,
    364,
    354,
    345,
    337,
    328,
    320,
    312,
    305,
    298,
    291,
    284,
    278,
    271,
    265,
    259,
    507,
    496,
    485,
    475,
    465,
    456,
    446,
    437,
    428,
    420,
    412,
    404,
    396,
    388,
    381,
    374,
    367,
    360,
    354,
    347,
    341,
    335,
    329,
    323,
    318,
    312,
    307,
    302,
    297,
    292,
    287,
    282,
    278,
    273,
    269,
    265,
    261,
    512,
    505,
    497,
    489,
    482,
    475,
    468,
    461,
    454,
    447,
    441,
    435,
    428,
    422,
    417,
    411,
    405,
    399,
    394,
    389,
    383,
    378,
    373,
    368,
    364,
    359,
    354,
    350,
    345,
    341,
    337,
    332,
    328,
    324,
    320,
    316,
    312,
    309,
    305,
    301,
    298,
    294,
    291,
    287,
    284,
    281,
    278,
    274,
    271,
    268,
    265,
    262,
    259,
    257,
    507,
    501,
    496,
    491,
    485,
    480,
    475,
    470,
    465,
    460,
    456,
    451,
    446,
    442,
    437,
    433,
    428,
    424,
    420,
    416,
    412,
    408,
    404,
    400,
    396,
    392,
    388,
    385,
    381,
    377,
    374,
    370,
    367,
    363,
    360,
    357,
    354,
    350,
    347,
    344,
    341,
    338,
    335,
    332,
    329,
    326,
    323,
    320,
    318,
    315,
    312,
    310,
    307,
    304,
    302,
    299,
    297,
    294,
    292,
    289,
    287,
    285,
    282,
    280,
    278,
    275,
    273,
    271,
    269,
    267,
    265,
    263,
    261,
    259
];
var shg_table = [
    9,
    11,
    12,
    13,
    13,
    14,
    14,
    15,
    15,
    15,
    15,
    16,
    16,
    16,
    16,
    17,
    17,
    17,
    17,
    17,
    17,
    17,
    18,
    18,
    18,
    18,
    18,
    18,
    18,
    18,
    18,
    19,
    19,
    19,
    19,
    19,
    19,
    19,
    19,
    19,
    19,
    19,
    19,
    19,
    19,
    20,
    20,
    20,
    20,
    20,
    20,
    20,
    20,
    20,
    20,
    20,
    20,
    20,
    20,
    20,
    20,
    20,
    20,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24
];
function filterGaussBlurRGBA(imageData, radius) {
    var pixels = imageData.data, width = imageData.width, height = imageData.height;
    var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum, a_sum, r_out_sum, g_out_sum, b_out_sum, a_out_sum, r_in_sum, g_in_sum, b_in_sum, a_in_sum, pr, pg, pb, pa, rbs;
    var div = radius + radius + 1, widthMinus1 = width - 1, heightMinus1 = height - 1, radiusPlus1 = radius + 1, sumFactor = (radiusPlus1 * (radiusPlus1 + 1)) / 2, stackStart = new BlurStack(), stackEnd = null, stack = stackStart, stackIn = null, stackOut = null, mul_sum = mul_table[radius], shg_sum = shg_table[radius];
    for (i = 1; i < div; i++) {
        stack = stack.next = new BlurStack();
        if (i === radiusPlus1) {
            stackEnd = stack;
        }
    }
    stack.next = stackStart;
    yw = yi = 0;
    for (y = 0; y < height; y++) {
        r_in_sum = g_in_sum = b_in_sum = a_in_sum = r_sum = g_sum = b_sum = a_sum = 0;
        r_out_sum = radiusPlus1 * (pr = pixels[yi]);
        g_out_sum = radiusPlus1 * (pg = pixels[yi + 1]);
        b_out_sum = radiusPlus1 * (pb = pixels[yi + 2]);
        a_out_sum = radiusPlus1 * (pa = pixels[yi + 3]);
        r_sum += sumFactor * pr;
        g_sum += sumFactor * pg;
        b_sum += sumFactor * pb;
        a_sum += sumFactor * pa;
        stack = stackStart;
        for (i = 0; i < radiusPlus1; i++) {
            stack.r = pr;
            stack.g = pg;
            stack.b = pb;
            stack.a = pa;
            stack = stack.next;
        }
        for (i = 1; i < radiusPlus1; i++) {
            p = yi + ((widthMinus1 < i ? widthMinus1 : i) << 2);
            r_sum += (stack.r = pr = pixels[p]) * (rbs = radiusPlus1 - i);
            g_sum += (stack.g = pg = pixels[p + 1]) * rbs;
            b_sum += (stack.b = pb = pixels[p + 2]) * rbs;
            a_sum += (stack.a = pa = pixels[p + 3]) * rbs;
            r_in_sum += pr;
            g_in_sum += pg;
            b_in_sum += pb;
            a_in_sum += pa;
            stack = stack.next;
        }
        stackIn = stackStart;
        stackOut = stackEnd;
        for (x = 0; x < width; x++) {
            pixels[yi + 3] = pa = (a_sum * mul_sum) >> shg_sum;
            if (pa !== 0) {
                pa = 255 / pa;
                pixels[yi] = ((r_sum * mul_sum) >> shg_sum) * pa;
                pixels[yi + 1] = ((g_sum * mul_sum) >> shg_sum) * pa;
                pixels[yi + 2] = ((b_sum * mul_sum) >> shg_sum) * pa;
            }
            else {
                pixels[yi] = pixels[yi + 1] = pixels[yi + 2] = 0;
            }
            r_sum -= r_out_sum;
            g_sum -= g_out_sum;
            b_sum -= b_out_sum;
            a_sum -= a_out_sum;
            r_out_sum -= stackIn.r;
            g_out_sum -= stackIn.g;
            b_out_sum -= stackIn.b;
            a_out_sum -= stackIn.a;
            p = (yw + ((p = x + radius + 1) < widthMinus1 ? p : widthMinus1)) << 2;
            r_in_sum += stackIn.r = pixels[p];
            g_in_sum += stackIn.g = pixels[p + 1];
            b_in_sum += stackIn.b = pixels[p + 2];
            a_in_sum += stackIn.a = pixels[p + 3];
            r_sum += r_in_sum;
            g_sum += g_in_sum;
            b_sum += b_in_sum;
            a_sum += a_in_sum;
            stackIn = stackIn.next;
            r_out_sum += pr = stackOut.r;
            g_out_sum += pg = stackOut.g;
            b_out_sum += pb = stackOut.b;
            a_out_sum += pa = stackOut.a;
            r_in_sum -= pr;
            g_in_sum -= pg;
            b_in_sum -= pb;
            a_in_sum -= pa;
            stackOut = stackOut.next;
            yi += 4;
        }
        yw += width;
    }
    for (x = 0; x < width; x++) {
        g_in_sum = b_in_sum = a_in_sum = r_in_sum = g_sum = b_sum = a_sum = r_sum = 0;
        yi = x << 2;
        r_out_sum = radiusPlus1 * (pr = pixels[yi]);
        g_out_sum = radiusPlus1 * (pg = pixels[yi + 1]);
        b_out_sum = radiusPlus1 * (pb = pixels[yi + 2]);
        a_out_sum = radiusPlus1 * (pa = pixels[yi + 3]);
        r_sum += sumFactor * pr;
        g_sum += sumFactor * pg;
        b_sum += sumFactor * pb;
        a_sum += sumFactor * pa;
        stack = stackStart;
        for (i = 0; i < radiusPlus1; i++) {
            stack.r = pr;
            stack.g = pg;
            stack.b = pb;
            stack.a = pa;
            stack = stack.next;
        }
        yp = width;
        for (i = 1; i <= radius; i++) {
            yi = (yp + x) << 2;
            r_sum += (stack.r = pr = pixels[yi]) * (rbs = radiusPlus1 - i);
            g_sum += (stack.g = pg = pixels[yi + 1]) * rbs;
            b_sum += (stack.b = pb = pixels[yi + 2]) * rbs;
            a_sum += (stack.a = pa = pixels[yi + 3]) * rbs;
            r_in_sum += pr;
            g_in_sum += pg;
            b_in_sum += pb;
            a_in_sum += pa;
            stack = stack.next;
            if (i < heightMinus1) {
                yp += width;
            }
        }
        yi = x;
        stackIn = stackStart;
        stackOut = stackEnd;
        for (y = 0; y < height; y++) {
            p = yi << 2;
            pixels[p + 3] = pa = (a_sum * mul_sum) >> shg_sum;
            if (pa > 0) {
                pa = 255 / pa;
                pixels[p] = ((r_sum * mul_sum) >> shg_sum) * pa;
                pixels[p + 1] = ((g_sum * mul_sum) >> shg_sum) * pa;
                pixels[p + 2] = ((b_sum * mul_sum) >> shg_sum) * pa;
            }
            else {
                pixels[p] = pixels[p + 1] = pixels[p + 2] = 0;
            }
            r_sum -= r_out_sum;
            g_sum -= g_out_sum;
            b_sum -= b_out_sum;
            a_sum -= a_out_sum;
            r_out_sum -= stackIn.r;
            g_out_sum -= stackIn.g;
            b_out_sum -= stackIn.b;
            a_out_sum -= stackIn.a;
            p =
                (x +
                    ((p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1) * width) <<
                    2;
            r_sum += r_in_sum += stackIn.r = pixels[p];
            g_sum += g_in_sum += stackIn.g = pixels[p + 1];
            b_sum += b_in_sum += stackIn.b = pixels[p + 2];
            a_sum += a_in_sum += stackIn.a = pixels[p + 3];
            stackIn = stackIn.next;
            r_out_sum += pr = stackOut.r;
            g_out_sum += pg = stackOut.g;
            b_out_sum += pb = stackOut.b;
            a_out_sum += pa = stackOut.a;
            r_in_sum -= pr;
            g_in_sum -= pg;
            b_in_sum -= pb;
            a_in_sum -= pa;
            stackOut = stackOut.next;
            yi += width;
        }
    }
}
exports.Blur = function Blur(imageData) {
    var radius = Math.round(this.blurRadius());
    if (radius > 0) {
        filterGaussBlurRGBA(imageData, radius);
    }
};
Factory_1.Factory.addGetterSetter(Node_1.Node, 'blurRadius', 0, Validators_1.getNumberValidator(), Factory_1.Factory.afterSetFilter);

},{"../Factory":9,"../Node":14,"../Validators":20}],24:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Factory_1 = _dereq_("../Factory");
var Node_1 = _dereq_("../Node");
var Validators_1 = _dereq_("../Validators");
exports.Brighten = function (imageData) {
    var brightness = this.brightness() * 255, data = imageData.data, len = data.length, i;
    for (i = 0; i < len; i += 4) {
        data[i] += brightness;
        data[i + 1] += brightness;
        data[i + 2] += brightness;
    }
};
Factory_1.Factory.addGetterSetter(Node_1.Node, 'brightness', 0, Validators_1.getNumberValidator(), Factory_1.Factory.afterSetFilter);

},{"../Factory":9,"../Node":14,"../Validators":20}],25:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Factory_1 = _dereq_("../Factory");
var Node_1 = _dereq_("../Node");
var Validators_1 = _dereq_("../Validators");
exports.Contrast = function (imageData) {
    var adjust = Math.pow((this.contrast() + 100) / 100, 2);
    var data = imageData.data, nPixels = data.length, red = 150, green = 150, blue = 150, i;
    for (i = 0; i < nPixels; i += 4) {
        red = data[i];
        green = data[i + 1];
        blue = data[i + 2];
        red /= 255;
        red -= 0.5;
        red *= adjust;
        red += 0.5;
        red *= 255;
        green /= 255;
        green -= 0.5;
        green *= adjust;
        green += 0.5;
        green *= 255;
        blue /= 255;
        blue -= 0.5;
        blue *= adjust;
        blue += 0.5;
        blue *= 255;
        red = red < 0 ? 0 : red > 255 ? 255 : red;
        green = green < 0 ? 0 : green > 255 ? 255 : green;
        blue = blue < 0 ? 0 : blue > 255 ? 255 : blue;
        data[i] = red;
        data[i + 1] = green;
        data[i + 2] = blue;
    }
};
Factory_1.Factory.addGetterSetter(Node_1.Node, 'contrast', 0, Validators_1.getNumberValidator(), Factory_1.Factory.afterSetFilter);

},{"../Factory":9,"../Node":14,"../Validators":20}],26:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Factory_1 = _dereq_("../Factory");
var Node_1 = _dereq_("../Node");
var Util_1 = _dereq_("../Util");
var Validators_1 = _dereq_("../Validators");
exports.Emboss = function (imageData) {
    var strength = this.embossStrength() * 10, greyLevel = this.embossWhiteLevel() * 255, direction = this.embossDirection(), blend = this.embossBlend(), dirY = 0, dirX = 0, data = imageData.data, w = imageData.width, h = imageData.height, w4 = w * 4, y = h;
    switch (direction) {
        case 'top-left':
            dirY = -1;
            dirX = -1;
            break;
        case 'top':
            dirY = -1;
            dirX = 0;
            break;
        case 'top-right':
            dirY = -1;
            dirX = 1;
            break;
        case 'right':
            dirY = 0;
            dirX = 1;
            break;
        case 'bottom-right':
            dirY = 1;
            dirX = 1;
            break;
        case 'bottom':
            dirY = 1;
            dirX = 0;
            break;
        case 'bottom-left':
            dirY = 1;
            dirX = -1;
            break;
        case 'left':
            dirY = 0;
            dirX = -1;
            break;
        default:
            Util_1.Util.error('Unknown emboss direction: ' + direction);
    }
    do {
        var offsetY = (y - 1) * w4;
        var otherY = dirY;
        if (y + otherY < 1) {
            otherY = 0;
        }
        if (y + otherY > h) {
            otherY = 0;
        }
        var offsetYOther = (y - 1 + otherY) * w * 4;
        var x = w;
        do {
            var offset = offsetY + (x - 1) * 4;
            var otherX = dirX;
            if (x + otherX < 1) {
                otherX = 0;
            }
            if (x + otherX > w) {
                otherX = 0;
            }
            var offsetOther = offsetYOther + (x - 1 + otherX) * 4;
            var dR = data[offset] - data[offsetOther];
            var dG = data[offset + 1] - data[offsetOther + 1];
            var dB = data[offset + 2] - data[offsetOther + 2];
            var dif = dR;
            var absDif = dif > 0 ? dif : -dif;
            var absG = dG > 0 ? dG : -dG;
            var absB = dB > 0 ? dB : -dB;
            if (absG > absDif) {
                dif = dG;
            }
            if (absB > absDif) {
                dif = dB;
            }
            dif *= strength;
            if (blend) {
                var r = data[offset] + dif;
                var g = data[offset + 1] + dif;
                var b = data[offset + 2] + dif;
                data[offset] = r > 255 ? 255 : r < 0 ? 0 : r;
                data[offset + 1] = g > 255 ? 255 : g < 0 ? 0 : g;
                data[offset + 2] = b > 255 ? 255 : b < 0 ? 0 : b;
            }
            else {
                var grey = greyLevel - dif;
                if (grey < 0) {
                    grey = 0;
                }
                else if (grey > 255) {
                    grey = 255;
                }
                data[offset] = data[offset + 1] = data[offset + 2] = grey;
            }
        } while (--x);
    } while (--y);
};
Factory_1.Factory.addGetterSetter(Node_1.Node, 'embossStrength', 0.5, Validators_1.getNumberValidator(), Factory_1.Factory.afterSetFilter);
Factory_1.Factory.addGetterSetter(Node_1.Node, 'embossWhiteLevel', 0.5, Validators_1.getNumberValidator(), Factory_1.Factory.afterSetFilter);
Factory_1.Factory.addGetterSetter(Node_1.Node, 'embossDirection', 'top-left', null, Factory_1.Factory.afterSetFilter);
Factory_1.Factory.addGetterSetter(Node_1.Node, 'embossBlend', false, null, Factory_1.Factory.afterSetFilter);

},{"../Factory":9,"../Node":14,"../Util":19,"../Validators":20}],27:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Factory_1 = _dereq_("../Factory");
var Node_1 = _dereq_("../Node");
var Validators_1 = _dereq_("../Validators");
function remap(fromValue, fromMin, fromMax, toMin, toMax) {
    var fromRange = fromMax - fromMin, toRange = toMax - toMin, toValue;
    if (fromRange === 0) {
        return toMin + toRange / 2;
    }
    if (toRange === 0) {
        return toMin;
    }
    toValue = (fromValue - fromMin) / fromRange;
    toValue = toRange * toValue + toMin;
    return toValue;
}
exports.Enhance = function (imageData) {
    var data = imageData.data, nSubPixels = data.length, rMin = data[0], rMax = rMin, r, gMin = data[1], gMax = gMin, g, bMin = data[2], bMax = bMin, b, i;
    var enhanceAmount = this.enhance();
    if (enhanceAmount === 0) {
        return;
    }
    for (i = 0; i < nSubPixels; i += 4) {
        r = data[i + 0];
        if (r < rMin) {
            rMin = r;
        }
        else if (r > rMax) {
            rMax = r;
        }
        g = data[i + 1];
        if (g < gMin) {
            gMin = g;
        }
        else if (g > gMax) {
            gMax = g;
        }
        b = data[i + 2];
        if (b < bMin) {
            bMin = b;
        }
        else if (b > bMax) {
            bMax = b;
        }
    }
    if (rMax === rMin) {
        rMax = 255;
        rMin = 0;
    }
    if (gMax === gMin) {
        gMax = 255;
        gMin = 0;
    }
    if (bMax === bMin) {
        bMax = 255;
        bMin = 0;
    }
    var rMid, rGoalMax, rGoalMin, gMid, gGoalMax, gGoalMin, bMid, bGoalMax, bGoalMin;
    if (enhanceAmount > 0) {
        rGoalMax = rMax + enhanceAmount * (255 - rMax);
        rGoalMin = rMin - enhanceAmount * (rMin - 0);
        gGoalMax = gMax + enhanceAmount * (255 - gMax);
        gGoalMin = gMin - enhanceAmount * (gMin - 0);
        bGoalMax = bMax + enhanceAmount * (255 - bMax);
        bGoalMin = bMin - enhanceAmount * (bMin - 0);
    }
    else {
        rMid = (rMax + rMin) * 0.5;
        rGoalMax = rMax + enhanceAmount * (rMax - rMid);
        rGoalMin = rMin + enhanceAmount * (rMin - rMid);
        gMid = (gMax + gMin) * 0.5;
        gGoalMax = gMax + enhanceAmount * (gMax - gMid);
        gGoalMin = gMin + enhanceAmount * (gMin - gMid);
        bMid = (bMax + bMin) * 0.5;
        bGoalMax = bMax + enhanceAmount * (bMax - bMid);
        bGoalMin = bMin + enhanceAmount * (bMin - bMid);
    }
    for (i = 0; i < nSubPixels; i += 4) {
        data[i + 0] = remap(data[i + 0], rMin, rMax, rGoalMin, rGoalMax);
        data[i + 1] = remap(data[i + 1], gMin, gMax, gGoalMin, gGoalMax);
        data[i + 2] = remap(data[i + 2], bMin, bMax, bGoalMin, bGoalMax);
    }
};
Factory_1.Factory.addGetterSetter(Node_1.Node, 'enhance', 0, Validators_1.getNumberValidator(), Factory_1.Factory.afterSetFilter);

},{"../Factory":9,"../Node":14,"../Validators":20}],28:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grayscale = function (imageData) {
    var data = imageData.data, len = data.length, i, brightness;
    for (i = 0; i < len; i += 4) {
        brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
        data[i] = brightness;
        data[i + 1] = brightness;
        data[i + 2] = brightness;
    }
};

},{}],29:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Factory_1 = _dereq_("../Factory");
var Node_1 = _dereq_("../Node");
var Validators_1 = _dereq_("../Validators");
Factory_1.Factory.addGetterSetter(Node_1.Node, 'hue', 0, Validators_1.getNumberValidator(), Factory_1.Factory.afterSetFilter);
Factory_1.Factory.addGetterSetter(Node_1.Node, 'saturation', 0, Validators_1.getNumberValidator(), Factory_1.Factory.afterSetFilter);
Factory_1.Factory.addGetterSetter(Node_1.Node, 'luminance', 0, Validators_1.getNumberValidator(), Factory_1.Factory.afterSetFilter);
exports.HSL = function (imageData) {
    var data = imageData.data, nPixels = data.length, v = 1, s = Math.pow(2, this.saturation()), h = Math.abs(this.hue() + 360) % 360, l = this.luminance() * 127, i;
    var vsu = v * s * Math.cos((h * Math.PI) / 180), vsw = v * s * Math.sin((h * Math.PI) / 180);
    var rr = 0.299 * v + 0.701 * vsu + 0.167 * vsw, rg = 0.587 * v - 0.587 * vsu + 0.33 * vsw, rb = 0.114 * v - 0.114 * vsu - 0.497 * vsw;
    var gr = 0.299 * v - 0.299 * vsu - 0.328 * vsw, gg = 0.587 * v + 0.413 * vsu + 0.035 * vsw, gb = 0.114 * v - 0.114 * vsu + 0.293 * vsw;
    var br = 0.299 * v - 0.3 * vsu + 1.25 * vsw, bg = 0.587 * v - 0.586 * vsu - 1.05 * vsw, bb = 0.114 * v + 0.886 * vsu - 0.2 * vsw;
    var r, g, b, a;
    for (i = 0; i < nPixels; i += 4) {
        r = data[i + 0];
        g = data[i + 1];
        b = data[i + 2];
        a = data[i + 3];
        data[i + 0] = rr * r + rg * g + rb * b + l;
        data[i + 1] = gr * r + gg * g + gb * b + l;
        data[i + 2] = br * r + bg * g + bb * b + l;
        data[i + 3] = a;
    }
};

},{"../Factory":9,"../Node":14,"../Validators":20}],30:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Factory_1 = _dereq_("../Factory");
var Node_1 = _dereq_("../Node");
var Validators_1 = _dereq_("../Validators");
exports.HSV = function (imageData) {
    var data = imageData.data, nPixels = data.length, v = Math.pow(2, this.value()), s = Math.pow(2, this.saturation()), h = Math.abs(this.hue() + 360) % 360, i;
    var vsu = v * s * Math.cos((h * Math.PI) / 180), vsw = v * s * Math.sin((h * Math.PI) / 180);
    var rr = 0.299 * v + 0.701 * vsu + 0.167 * vsw, rg = 0.587 * v - 0.587 * vsu + 0.33 * vsw, rb = 0.114 * v - 0.114 * vsu - 0.497 * vsw;
    var gr = 0.299 * v - 0.299 * vsu - 0.328 * vsw, gg = 0.587 * v + 0.413 * vsu + 0.035 * vsw, gb = 0.114 * v - 0.114 * vsu + 0.293 * vsw;
    var br = 0.299 * v - 0.3 * vsu + 1.25 * vsw, bg = 0.587 * v - 0.586 * vsu - 1.05 * vsw, bb = 0.114 * v + 0.886 * vsu - 0.2 * vsw;
    var r, g, b, a;
    for (i = 0; i < nPixels; i += 4) {
        r = data[i + 0];
        g = data[i + 1];
        b = data[i + 2];
        a = data[i + 3];
        data[i + 0] = rr * r + rg * g + rb * b;
        data[i + 1] = gr * r + gg * g + gb * b;
        data[i + 2] = br * r + bg * g + bb * b;
        data[i + 3] = a;
    }
};
Factory_1.Factory.addGetterSetter(Node_1.Node, 'hue', 0, Validators_1.getNumberValidator(), Factory_1.Factory.afterSetFilter);
Factory_1.Factory.addGetterSetter(Node_1.Node, 'saturation', 0, Validators_1.getNumberValidator(), Factory_1.Factory.afterSetFilter);
Factory_1.Factory.addGetterSetter(Node_1.Node, 'value', 0, Validators_1.getNumberValidator(), Factory_1.Factory.afterSetFilter);

},{"../Factory":9,"../Node":14,"../Validators":20}],31:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Invert = function (imageData) {
    var data = imageData.data, len = data.length, i;
    for (i = 0; i < len; i += 4) {
        data[i] = 255 - data[i];
        data[i + 1] = 255 - data[i + 1];
        data[i + 2] = 255 - data[i + 2];
    }
};

},{}],32:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Factory_1 = _dereq_("../Factory");
var Node_1 = _dereq_("../Node");
var Util_1 = _dereq_("../Util");
var Validators_1 = _dereq_("../Validators");
var ToPolar = function (src, dst, opt) {
    var srcPixels = src.data, dstPixels = dst.data, xSize = src.width, ySize = src.height, xMid = opt.polarCenterX || xSize / 2, yMid = opt.polarCenterY || ySize / 2, i, x, y, r = 0, g = 0, b = 0, a = 0;
    var rad, rMax = Math.sqrt(xMid * xMid + yMid * yMid);
    x = xSize - xMid;
    y = ySize - yMid;
    rad = Math.sqrt(x * x + y * y);
    rMax = rad > rMax ? rad : rMax;
    var rSize = ySize, tSize = xSize, radius, theta;
    var conversion = ((360 / tSize) * Math.PI) / 180, sin, cos;
    for (theta = 0; theta < tSize; theta += 1) {
        sin = Math.sin(theta * conversion);
        cos = Math.cos(theta * conversion);
        for (radius = 0; radius < rSize; radius += 1) {
            x = Math.floor(xMid + ((rMax * radius) / rSize) * cos);
            y = Math.floor(yMid + ((rMax * radius) / rSize) * sin);
            i = (y * xSize + x) * 4;
            r = srcPixels[i + 0];
            g = srcPixels[i + 1];
            b = srcPixels[i + 2];
            a = srcPixels[i + 3];
            i = (theta + radius * xSize) * 4;
            dstPixels[i + 0] = r;
            dstPixels[i + 1] = g;
            dstPixels[i + 2] = b;
            dstPixels[i + 3] = a;
        }
    }
};
var FromPolar = function (src, dst, opt) {
    var srcPixels = src.data, dstPixels = dst.data, xSize = src.width, ySize = src.height, xMid = opt.polarCenterX || xSize / 2, yMid = opt.polarCenterY || ySize / 2, i, x, y, dx, dy, r = 0, g = 0, b = 0, a = 0;
    var rad, rMax = Math.sqrt(xMid * xMid + yMid * yMid);
    x = xSize - xMid;
    y = ySize - yMid;
    rad = Math.sqrt(x * x + y * y);
    rMax = rad > rMax ? rad : rMax;
    var rSize = ySize, tSize = xSize, radius, theta, phaseShift = opt.polarRotation || 0;
    var x1, y1;
    for (x = 0; x < xSize; x += 1) {
        for (y = 0; y < ySize; y += 1) {
            dx = x - xMid;
            dy = y - yMid;
            radius = (Math.sqrt(dx * dx + dy * dy) * rSize) / rMax;
            theta = ((Math.atan2(dy, dx) * 180) / Math.PI + 360 + phaseShift) % 360;
            theta = (theta * tSize) / 360;
            x1 = Math.floor(theta);
            y1 = Math.floor(radius);
            i = (y1 * xSize + x1) * 4;
            r = srcPixels[i + 0];
            g = srcPixels[i + 1];
            b = srcPixels[i + 2];
            a = srcPixels[i + 3];
            i = (y * xSize + x) * 4;
            dstPixels[i + 0] = r;
            dstPixels[i + 1] = g;
            dstPixels[i + 2] = b;
            dstPixels[i + 3] = a;
        }
    }
};
exports.Kaleidoscope = function (imageData) {
    var xSize = imageData.width, ySize = imageData.height;
    var x, y, xoff, i, r, g, b, a, srcPos, dstPos;
    var power = Math.round(this.kaleidoscopePower());
    var angle = Math.round(this.kaleidoscopeAngle());
    var offset = Math.floor((xSize * (angle % 360)) / 360);
    if (power < 1) {
        return;
    }
    var tempCanvas = Util_1.Util.createCanvasElement();
    tempCanvas.width = xSize;
    tempCanvas.height = ySize;
    var scratchData = tempCanvas
        .getContext('2d')
        .getImageData(0, 0, xSize, ySize);
    ToPolar(imageData, scratchData, {
        polarCenterX: xSize / 2,
        polarCenterY: ySize / 2
    });
    var minSectionSize = xSize / Math.pow(2, power);
    while (minSectionSize <= 8) {
        minSectionSize = minSectionSize * 2;
        power -= 1;
    }
    minSectionSize = Math.ceil(minSectionSize);
    var sectionSize = minSectionSize;
    var xStart = 0, xEnd = sectionSize, xDelta = 1;
    if (offset + minSectionSize > xSize) {
        xStart = sectionSize;
        xEnd = 0;
        xDelta = -1;
    }
    for (y = 0; y < ySize; y += 1) {
        for (x = xStart; x !== xEnd; x += xDelta) {
            xoff = Math.round(x + offset) % xSize;
            srcPos = (xSize * y + xoff) * 4;
            r = scratchData.data[srcPos + 0];
            g = scratchData.data[srcPos + 1];
            b = scratchData.data[srcPos + 2];
            a = scratchData.data[srcPos + 3];
            dstPos = (xSize * y + x) * 4;
            scratchData.data[dstPos + 0] = r;
            scratchData.data[dstPos + 1] = g;
            scratchData.data[dstPos + 2] = b;
            scratchData.data[dstPos + 3] = a;
        }
    }
    for (y = 0; y < ySize; y += 1) {
        sectionSize = Math.floor(minSectionSize);
        for (i = 0; i < power; i += 1) {
            for (x = 0; x < sectionSize + 1; x += 1) {
                srcPos = (xSize * y + x) * 4;
                r = scratchData.data[srcPos + 0];
                g = scratchData.data[srcPos + 1];
                b = scratchData.data[srcPos + 2];
                a = scratchData.data[srcPos + 3];
                dstPos = (xSize * y + sectionSize * 2 - x - 1) * 4;
                scratchData.data[dstPos + 0] = r;
                scratchData.data[dstPos + 1] = g;
                scratchData.data[dstPos + 2] = b;
                scratchData.data[dstPos + 3] = a;
            }
            sectionSize *= 2;
        }
    }
    FromPolar(scratchData, imageData, { polarRotation: 0 });
};
Factory_1.Factory.addGetterSetter(Node_1.Node, 'kaleidoscopePower', 2, Validators_1.getNumberValidator(), Factory_1.Factory.afterSetFilter);
Factory_1.Factory.addGetterSetter(Node_1.Node, 'kaleidoscopeAngle', 0, Validators_1.getNumberValidator(), Factory_1.Factory.afterSetFilter);

},{"../Factory":9,"../Node":14,"../Util":19,"../Validators":20}],33:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Factory_1 = _dereq_("../Factory");
var Node_1 = _dereq_("../Node");
var Validators_1 = _dereq_("../Validators");
function pixelAt(idata, x, y) {
    var idx = (y * idata.width + x) * 4;
    var d = [];
    d.push(idata.data[idx++], idata.data[idx++], idata.data[idx++], idata.data[idx++]);
    return d;
}
function rgbDistance(p1, p2) {
    return Math.sqrt(Math.pow(p1[0] - p2[0], 2) +
        Math.pow(p1[1] - p2[1], 2) +
        Math.pow(p1[2] - p2[2], 2));
}
function rgbMean(pTab) {
    var m = [0, 0, 0];
    for (var i = 0; i < pTab.length; i++) {
        m[0] += pTab[i][0];
        m[1] += pTab[i][1];
        m[2] += pTab[i][2];
    }
    m[0] /= pTab.length;
    m[1] /= pTab.length;
    m[2] /= pTab.length;
    return m;
}
function backgroundMask(idata, threshold) {
    var rgbv_no = pixelAt(idata, 0, 0);
    var rgbv_ne = pixelAt(idata, idata.width - 1, 0);
    var rgbv_so = pixelAt(idata, 0, idata.height - 1);
    var rgbv_se = pixelAt(idata, idata.width - 1, idata.height - 1);
    var thres = threshold || 10;
    if (rgbDistance(rgbv_no, rgbv_ne) < thres &&
        rgbDistance(rgbv_ne, rgbv_se) < thres &&
        rgbDistance(rgbv_se, rgbv_so) < thres &&
        rgbDistance(rgbv_so, rgbv_no) < thres) {
        var mean = rgbMean([rgbv_ne, rgbv_no, rgbv_se, rgbv_so]);
        var mask = [];
        for (var i = 0; i < idata.width * idata.height; i++) {
            var d = rgbDistance(mean, [
                idata.data[i * 4],
                idata.data[i * 4 + 1],
                idata.data[i * 4 + 2]
            ]);
            mask[i] = d < thres ? 0 : 255;
        }
        return mask;
    }
}
function applyMask(idata, mask) {
    for (var i = 0; i < idata.width * idata.height; i++) {
        idata.data[4 * i + 3] = mask[i];
    }
}
function erodeMask(mask, sw, sh) {
    var weights = [1, 1, 1, 1, 0, 1, 1, 1, 1];
    var side = Math.round(Math.sqrt(weights.length));
    var halfSide = Math.floor(side / 2);
    var maskResult = [];
    for (var y = 0; y < sh; y++) {
        for (var x = 0; x < sw; x++) {
            var so = y * sw + x;
            var a = 0;
            for (var cy = 0; cy < side; cy++) {
                for (var cx = 0; cx < side; cx++) {
                    var scy = y + cy - halfSide;
                    var scx = x + cx - halfSide;
                    if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
                        var srcOff = scy * sw + scx;
                        var wt = weights[cy * side + cx];
                        a += mask[srcOff] * wt;
                    }
                }
            }
            maskResult[so] = a === 255 * 8 ? 255 : 0;
        }
    }
    return maskResult;
}
function dilateMask(mask, sw, sh) {
    var weights = [1, 1, 1, 1, 1, 1, 1, 1, 1];
    var side = Math.round(Math.sqrt(weights.length));
    var halfSide = Math.floor(side / 2);
    var maskResult = [];
    for (var y = 0; y < sh; y++) {
        for (var x = 0; x < sw; x++) {
            var so = y * sw + x;
            var a = 0;
            for (var cy = 0; cy < side; cy++) {
                for (var cx = 0; cx < side; cx++) {
                    var scy = y + cy - halfSide;
                    var scx = x + cx - halfSide;
                    if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
                        var srcOff = scy * sw + scx;
                        var wt = weights[cy * side + cx];
                        a += mask[srcOff] * wt;
                    }
                }
            }
            maskResult[so] = a >= 255 * 4 ? 255 : 0;
        }
    }
    return maskResult;
}
function smoothEdgeMask(mask, sw, sh) {
    var weights = [1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9];
    var side = Math.round(Math.sqrt(weights.length));
    var halfSide = Math.floor(side / 2);
    var maskResult = [];
    for (var y = 0; y < sh; y++) {
        for (var x = 0; x < sw; x++) {
            var so = y * sw + x;
            var a = 0;
            for (var cy = 0; cy < side; cy++) {
                for (var cx = 0; cx < side; cx++) {
                    var scy = y + cy - halfSide;
                    var scx = x + cx - halfSide;
                    if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
                        var srcOff = scy * sw + scx;
                        var wt = weights[cy * side + cx];
                        a += mask[srcOff] * wt;
                    }
                }
            }
            maskResult[so] = a;
        }
    }
    return maskResult;
}
exports.Mask = function (imageData) {
    var threshold = this.threshold(), mask = backgroundMask(imageData, threshold);
    if (mask) {
        mask = erodeMask(mask, imageData.width, imageData.height);
        mask = dilateMask(mask, imageData.width, imageData.height);
        mask = smoothEdgeMask(mask, imageData.width, imageData.height);
        applyMask(imageData, mask);
    }
    return imageData;
};
Factory_1.Factory.addGetterSetter(Node_1.Node, 'threshold', 0, Validators_1.getNumberValidator(), Factory_1.Factory.afterSetFilter);

},{"../Factory":9,"../Node":14,"../Validators":20}],34:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Factory_1 = _dereq_("../Factory");
var Node_1 = _dereq_("../Node");
var Validators_1 = _dereq_("../Validators");
exports.Noise = function (imageData) {
    var amount = this.noise() * 255, data = imageData.data, nPixels = data.length, half = amount / 2, i;
    for (i = 0; i < nPixels; i += 4) {
        data[i + 0] += half - 2 * half * Math.random();
        data[i + 1] += half - 2 * half * Math.random();
        data[i + 2] += half - 2 * half * Math.random();
    }
};
Factory_1.Factory.addGetterSetter(Node_1.Node, 'noise', 0.2, Validators_1.getNumberValidator(), Factory_1.Factory.afterSetFilter);

},{"../Factory":9,"../Node":14,"../Validators":20}],35:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Factory_1 = _dereq_("../Factory");
var Util_1 = _dereq_("../Util");
var Node_1 = _dereq_("../Node");
var Validators_1 = _dereq_("../Validators");
exports.Pixelate = function (imageData) {
    var pixelSize = Math.ceil(this.pixelSize()), width = imageData.width, height = imageData.height, x, y, i, red, green, blue, alpha, nBinsX = Math.ceil(width / pixelSize), nBinsY = Math.ceil(height / pixelSize), xBinStart, xBinEnd, yBinStart, yBinEnd, xBin, yBin, pixelsInBin, data = imageData.data;
    if (pixelSize <= 0) {
        Util_1.Util.error('pixelSize value can not be <= 0');
        return;
    }
    for (xBin = 0; xBin < nBinsX; xBin += 1) {
        for (yBin = 0; yBin < nBinsY; yBin += 1) {
            red = 0;
            green = 0;
            blue = 0;
            alpha = 0;
            xBinStart = xBin * pixelSize;
            xBinEnd = xBinStart + pixelSize;
            yBinStart = yBin * pixelSize;
            yBinEnd = yBinStart + pixelSize;
            pixelsInBin = 0;
            for (x = xBinStart; x < xBinEnd; x += 1) {
                if (x >= width) {
                    continue;
                }
                for (y = yBinStart; y < yBinEnd; y += 1) {
                    if (y >= height) {
                        continue;
                    }
                    i = (width * y + x) * 4;
                    red += data[i + 0];
                    green += data[i + 1];
                    blue += data[i + 2];
                    alpha += data[i + 3];
                    pixelsInBin += 1;
                }
            }
            red = red / pixelsInBin;
            green = green / pixelsInBin;
            blue = blue / pixelsInBin;
            alpha = alpha / pixelsInBin;
            for (x = xBinStart; x < xBinEnd; x += 1) {
                if (x >= width) {
                    continue;
                }
                for (y = yBinStart; y < yBinEnd; y += 1) {
                    if (y >= height) {
                        continue;
                    }
                    i = (width * y + x) * 4;
                    data[i + 0] = red;
                    data[i + 1] = green;
                    data[i + 2] = blue;
                    data[i + 3] = alpha;
                }
            }
        }
    }
};
Factory_1.Factory.addGetterSetter(Node_1.Node, 'pixelSize', 8, Validators_1.getNumberValidator(), Factory_1.Factory.afterSetFilter);

},{"../Factory":9,"../Node":14,"../Util":19,"../Validators":20}],36:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Factory_1 = _dereq_("../Factory");
var Node_1 = _dereq_("../Node");
var Validators_1 = _dereq_("../Validators");
exports.Posterize = function (imageData) {
    var levels = Math.round(this.levels() * 254) + 1, data = imageData.data, len = data.length, scale = 255 / levels, i;
    for (i = 0; i < len; i += 1) {
        data[i] = Math.floor(data[i] / scale) * scale;
    }
};
Factory_1.Factory.addGetterSetter(Node_1.Node, 'levels', 0.5, Validators_1.getNumberValidator(), Factory_1.Factory.afterSetFilter);

},{"../Factory":9,"../Node":14,"../Validators":20}],37:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Factory_1 = _dereq_("../Factory");
var Node_1 = _dereq_("../Node");
var Validators_1 = _dereq_("../Validators");
exports.RGB = function (imageData) {
    var data = imageData.data, nPixels = data.length, red = this.red(), green = this.green(), blue = this.blue(), i, brightness;
    for (i = 0; i < nPixels; i += 4) {
        brightness =
            (0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2]) / 255;
        data[i] = brightness * red;
        data[i + 1] = brightness * green;
        data[i + 2] = brightness * blue;
        data[i + 3] = data[i + 3];
    }
};
Factory_1.Factory.addGetterSetter(Node_1.Node, 'red', 0, function (val) {
    this._filterUpToDate = false;
    if (val > 255) {
        return 255;
    }
    else if (val < 0) {
        return 0;
    }
    else {
        return Math.round(val);
    }
});
Factory_1.Factory.addGetterSetter(Node_1.Node, 'green', 0, function (val) {
    this._filterUpToDate = false;
    if (val > 255) {
        return 255;
    }
    else if (val < 0) {
        return 0;
    }
    else {
        return Math.round(val);
    }
});
Factory_1.Factory.addGetterSetter(Node_1.Node, 'blue', 0, Validators_1.RGBComponent, Factory_1.Factory.afterSetFilter);

},{"../Factory":9,"../Node":14,"../Validators":20}],38:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Factory_1 = _dereq_("../Factory");
var Node_1 = _dereq_("../Node");
var Validators_1 = _dereq_("../Validators");
exports.RGBA = function (imageData) {
    var data = imageData.data, nPixels = data.length, red = this.red(), green = this.green(), blue = this.blue(), alpha = this.alpha(), i, ia;
    for (i = 0; i < nPixels; i += 4) {
        ia = 1 - alpha;
        data[i] = red * alpha + data[i] * ia;
        data[i + 1] = green * alpha + data[i + 1] * ia;
        data[i + 2] = blue * alpha + data[i + 2] * ia;
    }
};
Factory_1.Factory.addGetterSetter(Node_1.Node, 'red', 0, function (val) {
    this._filterUpToDate = false;
    if (val > 255) {
        return 255;
    }
    else if (val < 0) {
        return 0;
    }
    else {
        return Math.round(val);
    }
});
Factory_1.Factory.addGetterSetter(Node_1.Node, 'green', 0, function (val) {
    this._filterUpToDate = false;
    if (val > 255) {
        return 255;
    }
    else if (val < 0) {
        return 0;
    }
    else {
        return Math.round(val);
    }
});
Factory_1.Factory.addGetterSetter(Node_1.Node, 'blue', 0, Validators_1.RGBComponent, Factory_1.Factory.afterSetFilter);
Factory_1.Factory.addGetterSetter(Node_1.Node, 'alpha', 1, function (val) {
    this._filterUpToDate = false;
    if (val > 1) {
        return 1;
    }
    else if (val < 0) {
        return 0;
    }
    else {
        return val;
    }
});

},{"../Factory":9,"../Node":14,"../Validators":20}],39:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sepia = function (imageData) {
    var data = imageData.data, nPixels = data.length, i, r, g, b;
    for (i = 0; i < nPixels; i += 4) {
        r = data[i + 0];
        g = data[i + 1];
        b = data[i + 2];
        data[i + 0] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
        data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
        data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
    }
};

},{}],40:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Solarize = function (imageData) {
    var data = imageData.data, w = imageData.width, h = imageData.height, w4 = w * 4, y = h;
    do {
        var offsetY = (y - 1) * w4;
        var x = w;
        do {
            var offset = offsetY + (x - 1) * 4;
            var r = data[offset];
            var g = data[offset + 1];
            var b = data[offset + 2];
            if (r > 127) {
                r = 255 - r;
            }
            if (g > 127) {
                g = 255 - g;
            }
            if (b > 127) {
                b = 255 - b;
            }
            data[offset] = r;
            data[offset + 1] = g;
            data[offset + 2] = b;
        } while (--x);
    } while (--y);
};

},{}],41:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Factory_1 = _dereq_("../Factory");
var Node_1 = _dereq_("../Node");
var Validators_1 = _dereq_("../Validators");
exports.Threshold = function (imageData) {
    var level = this.threshold() * 255, data = imageData.data, len = data.length, i;
    for (i = 0; i < len; i += 1) {
        data[i] = data[i] < level ? 0 : 255;
    }
};
Factory_1.Factory.addGetterSetter(Node_1.Node, 'threshold', 0.5, Validators_1.getNumberValidator(), Factory_1.Factory.afterSetFilter);

},{"../Factory":9,"../Node":14,"../Validators":20}],42:[function(_dereq_,module,exports){
var Konva = _dereq_('./_FullInternals').Konva;
Konva._injectGlobal(Konva);
exports['default'] = Konva;
module.exports = exports['default'];

},{"./_FullInternals":22}],43:[function(_dereq_,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = _dereq_("../Util");
var Factory_1 = _dereq_("../Factory");
var Shape_1 = _dereq_("../Shape");
var Global_1 = _dereq_("../Global");
var Validators_1 = _dereq_("../Validators");
var Global_2 = _dereq_("../Global");
var Arc = (function (_super) {
    __extends(Arc, _super);
    function Arc() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Arc.prototype._sceneFunc = function (context) {
        var angle = Global_1.Konva.getAngle(this.angle()), clockwise = this.clockwise();
        context.beginPath();
        context.arc(0, 0, this.outerRadius(), 0, angle, clockwise);
        context.arc(0, 0, this.innerRadius(), angle, 0, !clockwise);
        context.closePath();
        context.fillStrokeShape(this);
    };
    Arc.prototype.getWidth = function () {
        return this.outerRadius() * 2;
    };
    Arc.prototype.getHeight = function () {
        return this.outerRadius() * 2;
    };
    Arc.prototype.setWidth = function (width) {
        this.outerRadius(width / 2);
    };
    Arc.prototype.setHeight = function (height) {
        this.outerRadius(height / 2);
    };
    return Arc;
}(Shape_1.Shape));
exports.Arc = Arc;
Arc.prototype._centroid = true;
Arc.prototype.className = 'Arc';
Arc.prototype._attrsAffectingSize = ['innerRadius', 'outerRadius'];
Global_2._registerNode(Arc);
Factory_1.Factory.addGetterSetter(Arc, 'innerRadius', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Arc, 'outerRadius', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Arc, 'angle', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Arc, 'clockwise', false, Validators_1.getBooleanValidator());
Util_1.Collection.mapMethods(Arc);

},{"../Factory":9,"../Global":11,"../Shape":16,"../Util":19,"../Validators":20}],44:[function(_dereq_,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = _dereq_("../Util");
var Factory_1 = _dereq_("../Factory");
var Line_1 = _dereq_("./Line");
var Validators_1 = _dereq_("../Validators");
var Global_1 = _dereq_("../Global");
var Arrow = (function (_super) {
    __extends(Arrow, _super);
    function Arrow() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Arrow.prototype._sceneFunc = function (ctx) {
        _super.prototype._sceneFunc.call(this, ctx);
        var PI2 = Math.PI * 2;
        var points = this.points();
        var tp = points;
        var fromTension = this.tension() !== 0 && points.length > 4;
        if (fromTension) {
            tp = this.getTensionPoints();
        }
        var n = points.length;
        var dx, dy;
        if (fromTension) {
            dx = points[n - 2] - (tp[tp.length - 2] + tp[tp.length - 4]) / 2;
            dy = points[n - 1] - (tp[tp.length - 1] + tp[tp.length - 3]) / 2;
        }
        else {
            dx = points[n - 2] - points[n - 4];
            dy = points[n - 1] - points[n - 3];
        }
        var radians = (Math.atan2(dy, dx) + PI2) % PI2;
        var length = this.pointerLength();
        var width = this.pointerWidth();
        ctx.save();
        ctx.beginPath();
        ctx.translate(points[n - 2], points[n - 1]);
        ctx.rotate(radians);
        ctx.moveTo(0, 0);
        ctx.lineTo(-length, width / 2);
        ctx.lineTo(-length, -width / 2);
        ctx.closePath();
        ctx.restore();
        if (this.pointerAtBeginning()) {
            ctx.save();
            ctx.translate(points[0], points[1]);
            if (fromTension) {
                dx = (tp[0] + tp[2]) / 2 - points[0];
                dy = (tp[1] + tp[3]) / 2 - points[1];
            }
            else {
                dx = points[2] - points[0];
                dy = points[3] - points[1];
            }
            ctx.rotate((Math.atan2(-dy, -dx) + PI2) % PI2);
            ctx.moveTo(0, 0);
            ctx.lineTo(-length, width / 2);
            ctx.lineTo(-length, -width / 2);
            ctx.closePath();
            ctx.restore();
        }
        var isDashEnabled = this.dashEnabled();
        if (isDashEnabled) {
            this.attrs.dashEnabled = false;
            ctx.setLineDash([]);
        }
        ctx.fillStrokeShape(this);
        if (isDashEnabled) {
            this.attrs.dashEnabled = true;
        }
    };
    Arrow.prototype.getSelfRect = function () {
        var lineRect = _super.prototype.getSelfRect.call(this);
        var offset = this.pointerWidth() / 2;
        return {
            x: lineRect.x - offset,
            y: lineRect.y - offset,
            width: lineRect.width + offset * 2,
            height: lineRect.height + offset * 2
        };
    };
    return Arrow;
}(Line_1.Line));
exports.Arrow = Arrow;
Arrow.prototype.className = 'Arrow';
Global_1._registerNode(Arrow);
Factory_1.Factory.addGetterSetter(Arrow, 'pointerLength', 10, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Arrow, 'pointerWidth', 10, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Arrow, 'pointerAtBeginning', false);
Util_1.Collection.mapMethods(Arrow);

},{"../Factory":9,"../Global":11,"../Util":19,"../Validators":20,"./Line":49}],45:[function(_dereq_,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = _dereq_("../Util");
var Factory_1 = _dereq_("../Factory");
var Shape_1 = _dereq_("../Shape");
var Validators_1 = _dereq_("../Validators");
var Global_1 = _dereq_("../Global");
var Circle = (function (_super) {
    __extends(Circle, _super);
    function Circle() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Circle.prototype._sceneFunc = function (context) {
        context.beginPath();
        context.arc(0, 0, this.attrs.radius || 0, 0, Math.PI * 2, false);
        context.closePath();
        context.fillStrokeShape(this);
    };
    Circle.prototype.getWidth = function () {
        return this.radius() * 2;
    };
    Circle.prototype.getHeight = function () {
        return this.radius() * 2;
    };
    Circle.prototype.setWidth = function (width) {
        if (this.radius() !== width / 2) {
            this.radius(width / 2);
        }
    };
    Circle.prototype.setHeight = function (height) {
        if (this.radius() !== height / 2) {
            this.radius(height / 2);
        }
    };
    return Circle;
}(Shape_1.Shape));
exports.Circle = Circle;
Circle.prototype._centroid = true;
Circle.prototype.className = 'Circle';
Circle.prototype._attrsAffectingSize = ['radius'];
Global_1._registerNode(Circle);
Factory_1.Factory.addGetterSetter(Circle, 'radius', 0, Validators_1.getNumberValidator());
Util_1.Collection.mapMethods(Circle);

},{"../Factory":9,"../Global":11,"../Shape":16,"../Util":19,"../Validators":20}],46:[function(_dereq_,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = _dereq_("../Util");
var Factory_1 = _dereq_("../Factory");
var Shape_1 = _dereq_("../Shape");
var Validators_1 = _dereq_("../Validators");
var Global_1 = _dereq_("../Global");
var Ellipse = (function (_super) {
    __extends(Ellipse, _super);
    function Ellipse() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Ellipse.prototype._sceneFunc = function (context) {
        var rx = this.radiusX(), ry = this.radiusY();
        context.beginPath();
        context.save();
        if (rx !== ry) {
            context.scale(1, ry / rx);
        }
        context.arc(0, 0, rx, 0, Math.PI * 2, false);
        context.restore();
        context.closePath();
        context.fillStrokeShape(this);
    };
    Ellipse.prototype.getWidth = function () {
        return this.radiusX() * 2;
    };
    Ellipse.prototype.getHeight = function () {
        return this.radiusY() * 2;
    };
    Ellipse.prototype.setWidth = function (width) {
        this.radiusX(width / 2);
    };
    Ellipse.prototype.setHeight = function (height) {
        this.radiusY(height / 2);
    };
    return Ellipse;
}(Shape_1.Shape));
exports.Ellipse = Ellipse;
Ellipse.prototype.className = 'Ellipse';
Ellipse.prototype._centroid = true;
Ellipse.prototype._attrsAffectingSize = ['radiusX', 'radiusY'];
Global_1._registerNode(Ellipse);
Factory_1.Factory.addComponentsGetterSetter(Ellipse, 'radius', ['x', 'y']);
Factory_1.Factory.addGetterSetter(Ellipse, 'radiusX', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Ellipse, 'radiusY', 0, Validators_1.getNumberValidator());
Util_1.Collection.mapMethods(Ellipse);

},{"../Factory":9,"../Global":11,"../Shape":16,"../Util":19,"../Validators":20}],47:[function(_dereq_,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = _dereq_("../Util");
var Factory_1 = _dereq_("../Factory");
var Shape_1 = _dereq_("../Shape");
var Validators_1 = _dereq_("../Validators");
var Global_1 = _dereq_("../Global");
var Image = (function (_super) {
    __extends(Image, _super);
    function Image() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Image.prototype._useBufferCanvas = function () {
        return _super.prototype._useBufferCanvas.call(this, true);
    };
    Image.prototype._sceneFunc = function (context) {
        var width = this.getWidth(), height = this.getHeight(), image = this.attrs.image, cropWidth, cropHeight, params;
        if (image) {
            cropWidth = this.attrs.cropWidth;
            cropHeight = this.attrs.cropHeight;
            if (cropWidth && cropHeight) {
                params = [
                    image,
                    this.cropX(),
                    this.cropY(),
                    cropWidth,
                    cropHeight,
                    0,
                    0,
                    width,
                    height,
                ];
            }
            else {
                params = [image, 0, 0, width, height];
            }
        }
        if (this.hasFill() || this.hasStroke()) {
            context.beginPath();
            context.rect(0, 0, width, height);
            context.closePath();
            context.fillStrokeShape(this);
        }
        if (image) {
            context.drawImage.apply(context, params);
        }
    };
    Image.prototype._hitFunc = function (context) {
        var width = this.width(), height = this.height();
        context.beginPath();
        context.rect(0, 0, width, height);
        context.closePath();
        context.fillStrokeShape(this);
    };
    Image.prototype.getWidth = function () {
        var _a, _b;
        return (_a = this.attrs.width) !== null && _a !== void 0 ? _a : (((_b = this.image()) === null || _b === void 0 ? void 0 : _b.width) || 0);
    };
    Image.prototype.getHeight = function () {
        var _a, _b;
        return (_a = this.attrs.height) !== null && _a !== void 0 ? _a : (((_b = this.image()) === null || _b === void 0 ? void 0 : _b.height) || 0);
    };
    Image.fromURL = function (url, callback) {
        var img = Util_1.Util.createImageElement();
        img.onload = function () {
            var image = new Image({
                image: img,
            });
            callback(image);
        };
        img.crossOrigin = 'Anonymous';
        img.src = url;
    };
    return Image;
}(Shape_1.Shape));
exports.Image = Image;
Image.prototype.className = 'Image';
Global_1._registerNode(Image);
Factory_1.Factory.addGetterSetter(Image, 'image');
Factory_1.Factory.addComponentsGetterSetter(Image, 'crop', ['x', 'y', 'width', 'height']);
Factory_1.Factory.addGetterSetter(Image, 'cropX', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Image, 'cropY', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Image, 'cropWidth', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Image, 'cropHeight', 0, Validators_1.getNumberValidator());
Util_1.Collection.mapMethods(Image);

},{"../Factory":9,"../Global":11,"../Shape":16,"../Util":19,"../Validators":20}],48:[function(_dereq_,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = _dereq_("../Util");
var Factory_1 = _dereq_("../Factory");
var Shape_1 = _dereq_("../Shape");
var Group_1 = _dereq_("../Group");
var Validators_1 = _dereq_("../Validators");
var Global_1 = _dereq_("../Global");
var ATTR_CHANGE_LIST = [
    'fontFamily',
    'fontSize',
    'fontStyle',
    'padding',
    'lineHeight',
    'text',
    'width'
], CHANGE_KONVA = 'Change.konva', NONE = 'none', UP = 'up', RIGHT = 'right', DOWN = 'down', LEFT = 'left', attrChangeListLen = ATTR_CHANGE_LIST.length;
var Label = (function (_super) {
    __extends(Label, _super);
    function Label(config) {
        var _this = _super.call(this, config) || this;
        _this.on('add.konva', function (evt) {
            this._addListeners(evt.child);
            this._sync();
        });
        return _this;
    }
    Label.prototype.getText = function () {
        return this.find('Text')[0];
    };
    Label.prototype.getTag = function () {
        return this.find('Tag')[0];
    };
    Label.prototype._addListeners = function (text) {
        var that = this, n;
        var func = function () {
            that._sync();
        };
        for (n = 0; n < attrChangeListLen; n++) {
            text.on(ATTR_CHANGE_LIST[n] + CHANGE_KONVA, func);
        }
    };
    Label.prototype.getWidth = function () {
        return this.getText().width();
    };
    Label.prototype.getHeight = function () {
        return this.getText().height();
    };
    Label.prototype._sync = function () {
        var text = this.getText(), tag = this.getTag(), width, height, pointerDirection, pointerWidth, x, y, pointerHeight;
        if (text && tag) {
            width = text.width();
            height = text.height();
            pointerDirection = tag.pointerDirection();
            pointerWidth = tag.pointerWidth();
            pointerHeight = tag.pointerHeight();
            x = 0;
            y = 0;
            switch (pointerDirection) {
                case UP:
                    x = width / 2;
                    y = -1 * pointerHeight;
                    break;
                case RIGHT:
                    x = width + pointerWidth;
                    y = height / 2;
                    break;
                case DOWN:
                    x = width / 2;
                    y = height + pointerHeight;
                    break;
                case LEFT:
                    x = -1 * pointerWidth;
                    y = height / 2;
                    break;
            }
            tag.setAttrs({
                x: -1 * x,
                y: -1 * y,
                width: width,
                height: height
            });
            text.setAttrs({
                x: -1 * x,
                y: -1 * y
            });
        }
    };
    return Label;
}(Group_1.Group));
exports.Label = Label;
Label.prototype.className = 'Label';
Global_1._registerNode(Label);
Util_1.Collection.mapMethods(Label);
var Tag = (function (_super) {
    __extends(Tag, _super);
    function Tag() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Tag.prototype._sceneFunc = function (context) {
        var width = this.width(), height = this.height(), pointerDirection = this.pointerDirection(), pointerWidth = this.pointerWidth(), pointerHeight = this.pointerHeight(), cornerRadius = this.cornerRadius();
        var topLeft = 0;
        var topRight = 0;
        var bottomLeft = 0;
        var bottomRight = 0;
        if (typeof cornerRadius === 'number') {
            topLeft = topRight = bottomLeft = bottomRight = Math.min(cornerRadius, width / 2, height / 2);
        }
        else {
            topLeft = Math.min(cornerRadius[0] || 0, width / 2, height / 2);
            topRight = Math.min(cornerRadius[1] || 0, width / 2, height / 2);
            bottomRight = Math.min(cornerRadius[2] || 0, width / 2, height / 2);
            bottomLeft = Math.min(cornerRadius[3] || 0, width / 2, height / 2);
        }
        context.beginPath();
        context.moveTo(topLeft, 0);
        if (pointerDirection === UP) {
            context.lineTo((width - pointerWidth) / 2, 0);
            context.lineTo(width / 2, -1 * pointerHeight);
            context.lineTo((width + pointerWidth) / 2, 0);
        }
        context.lineTo(width - topRight, 0);
        context.arc(width - topRight, topRight, topRight, (Math.PI * 3) / 2, 0, false);
        if (pointerDirection === RIGHT) {
            context.lineTo(width, (height - pointerHeight) / 2);
            context.lineTo(width + pointerWidth, height / 2);
            context.lineTo(width, (height + pointerHeight) / 2);
        }
        context.lineTo(width, height - bottomRight);
        context.arc(width - bottomRight, height - bottomRight, bottomRight, 0, Math.PI / 2, false);
        if (pointerDirection === DOWN) {
            context.lineTo((width + pointerWidth) / 2, height);
            context.lineTo(width / 2, height + pointerHeight);
            context.lineTo((width - pointerWidth) / 2, height);
        }
        context.lineTo(bottomLeft, height);
        context.arc(bottomLeft, height - bottomLeft, bottomLeft, Math.PI / 2, Math.PI, false);
        if (pointerDirection === LEFT) {
            context.lineTo(0, (height + pointerHeight) / 2);
            context.lineTo(-1 * pointerWidth, height / 2);
            context.lineTo(0, (height - pointerHeight) / 2);
        }
        context.lineTo(0, topLeft);
        context.arc(topLeft, topLeft, topLeft, Math.PI, (Math.PI * 3) / 2, false);
        context.closePath();
        context.fillStrokeShape(this);
    };
    Tag.prototype.getSelfRect = function () {
        var x = 0, y = 0, pointerWidth = this.pointerWidth(), pointerHeight = this.pointerHeight(), direction = this.pointerDirection(), width = this.width(), height = this.height();
        if (direction === UP) {
            y -= pointerHeight;
            height += pointerHeight;
        }
        else if (direction === DOWN) {
            height += pointerHeight;
        }
        else if (direction === LEFT) {
            x -= pointerWidth * 1.5;
            width += pointerWidth;
        }
        else if (direction === RIGHT) {
            width += pointerWidth * 1.5;
        }
        return {
            x: x,
            y: y,
            width: width,
            height: height
        };
    };
    return Tag;
}(Shape_1.Shape));
exports.Tag = Tag;
Tag.prototype.className = 'Tag';
Global_1._registerNode(Tag);
Factory_1.Factory.addGetterSetter(Tag, 'pointerDirection', NONE);
Factory_1.Factory.addGetterSetter(Tag, 'pointerWidth', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Tag, 'pointerHeight', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Tag, 'cornerRadius', 0, Validators_1.getNumberOrArrayOfNumbersValidator(4));
Util_1.Collection.mapMethods(Tag);

},{"../Factory":9,"../Global":11,"../Group":12,"../Shape":16,"../Util":19,"../Validators":20}],49:[function(_dereq_,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = _dereq_("../Util");
var Factory_1 = _dereq_("../Factory");
var Shape_1 = _dereq_("../Shape");
var Validators_1 = _dereq_("../Validators");
var Global_1 = _dereq_("../Global");
var Line = (function (_super) {
    __extends(Line, _super);
    function Line(config) {
        var _this = _super.call(this, config) || this;
        _this.on('pointsChange.konva tensionChange.konva closedChange.konva bezierChange.konva', function () {
            this._clearCache('tensionPoints');
        });
        return _this;
    }
    Line.prototype._sceneFunc = function (context) {
        var points = this.points(), length = points.length, tension = this.tension(), closed = this.closed(), bezier = this.bezier(), tp, len, n;
        if (!length) {
            return;
        }
        context.beginPath();
        context.moveTo(points[0], points[1]);
        if (tension !== 0 && length > 4) {
            tp = this.getTensionPoints();
            len = tp.length;
            n = closed ? 0 : 4;
            if (!closed) {
                context.quadraticCurveTo(tp[0], tp[1], tp[2], tp[3]);
            }
            while (n < len - 2) {
                context.bezierCurveTo(tp[n++], tp[n++], tp[n++], tp[n++], tp[n++], tp[n++]);
            }
            if (!closed) {
                context.quadraticCurveTo(tp[len - 2], tp[len - 1], points[length - 2], points[length - 1]);
            }
        }
        else if (bezier) {
            n = 2;
            while (n < length) {
                context.bezierCurveTo(points[n++], points[n++], points[n++], points[n++], points[n++], points[n++]);
            }
        }
        else {
            for (n = 2; n < length; n += 2) {
                context.lineTo(points[n], points[n + 1]);
            }
        }
        if (closed) {
            context.closePath();
            context.fillStrokeShape(this);
        }
        else {
            context.strokeShape(this);
        }
    };
    Line.prototype.getTensionPoints = function () {
        return this._getCache('tensionPoints', this._getTensionPoints);
    };
    Line.prototype._getTensionPoints = function () {
        if (this.closed()) {
            return this._getTensionPointsClosed();
        }
        else {
            return Util_1.Util._expandPoints(this.points(), this.tension());
        }
    };
    Line.prototype._getTensionPointsClosed = function () {
        var p = this.points(), len = p.length, tension = this.tension(), firstControlPoints = Util_1.Util._getControlPoints(p[len - 2], p[len - 1], p[0], p[1], p[2], p[3], tension), lastControlPoints = Util_1.Util._getControlPoints(p[len - 4], p[len - 3], p[len - 2], p[len - 1], p[0], p[1], tension), middle = Util_1.Util._expandPoints(p, tension), tp = [firstControlPoints[2], firstControlPoints[3]]
            .concat(middle)
            .concat([
            lastControlPoints[0],
            lastControlPoints[1],
            p[len - 2],
            p[len - 1],
            lastControlPoints[2],
            lastControlPoints[3],
            firstControlPoints[0],
            firstControlPoints[1],
            p[0],
            p[1]
        ]);
        return tp;
    };
    Line.prototype.getWidth = function () {
        return this.getSelfRect().width;
    };
    Line.prototype.getHeight = function () {
        return this.getSelfRect().height;
    };
    Line.prototype.getSelfRect = function () {
        var points = this.points();
        if (points.length < 4) {
            return {
                x: points[0] || 0,
                y: points[1] || 0,
                width: 0,
                height: 0
            };
        }
        if (this.tension() !== 0) {
            points = __spreadArrays([
                points[0],
                points[1]
            ], this._getTensionPoints(), [
                points[points.length - 2],
                points[points.length - 1]
            ]);
        }
        else {
            points = this.points();
        }
        var minX = points[0];
        var maxX = points[0];
        var minY = points[1];
        var maxY = points[1];
        var x, y;
        for (var i = 0; i < points.length / 2; i++) {
            x = points[i * 2];
            y = points[i * 2 + 1];
            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);
        }
        return {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY
        };
    };
    return Line;
}(Shape_1.Shape));
exports.Line = Line;
Line.prototype.className = 'Line';
Line.prototype._attrsAffectingSize = ['points', 'bezier', 'tension'];
Global_1._registerNode(Line);
Factory_1.Factory.addGetterSetter(Line, 'closed', false);
Factory_1.Factory.addGetterSetter(Line, 'bezier', false);
Factory_1.Factory.addGetterSetter(Line, 'tension', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Line, 'points', [], Validators_1.getNumberArrayValidator());
Util_1.Collection.mapMethods(Line);

},{"../Factory":9,"../Global":11,"../Shape":16,"../Util":19,"../Validators":20}],50:[function(_dereq_,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = _dereq_("../Util");
var Factory_1 = _dereq_("../Factory");
var Shape_1 = _dereq_("../Shape");
var Global_1 = _dereq_("../Global");
var Path = (function (_super) {
    __extends(Path, _super);
    function Path(config) {
        var _this = _super.call(this, config) || this;
        _this.dataArray = [];
        _this.pathLength = 0;
        _this.dataArray = Path.parsePathData(_this.data());
        _this.pathLength = 0;
        for (var i = 0; i < _this.dataArray.length; ++i) {
            _this.pathLength += _this.dataArray[i].pathLength;
        }
        _this.on('dataChange.konva', function () {
            this.dataArray = Path.parsePathData(this.data());
            this.pathLength = 0;
            for (var i = 0; i < this.dataArray.length; ++i) {
                this.pathLength += this.dataArray[i].pathLength;
            }
        });
        return _this;
    }
    Path.prototype._sceneFunc = function (context) {
        var ca = this.dataArray;
        context.beginPath();
        var isClosed = false;
        for (var n = 0; n < ca.length; n++) {
            var c = ca[n].command;
            var p = ca[n].points;
            switch (c) {
                case 'L':
                    context.lineTo(p[0], p[1]);
                    break;
                case 'M':
                    context.moveTo(p[0], p[1]);
                    break;
                case 'C':
                    context.bezierCurveTo(p[0], p[1], p[2], p[3], p[4], p[5]);
                    break;
                case 'Q':
                    context.quadraticCurveTo(p[0], p[1], p[2], p[3]);
                    break;
                case 'A':
                    var cx = p[0], cy = p[1], rx = p[2], ry = p[3], theta = p[4], dTheta = p[5], psi = p[6], fs = p[7];
                    var r = rx > ry ? rx : ry;
                    var scaleX = rx > ry ? 1 : rx / ry;
                    var scaleY = rx > ry ? ry / rx : 1;
                    context.translate(cx, cy);
                    context.rotate(psi);
                    context.scale(scaleX, scaleY);
                    context.arc(0, 0, r, theta, theta + dTheta, 1 - fs);
                    context.scale(1 / scaleX, 1 / scaleY);
                    context.rotate(-psi);
                    context.translate(-cx, -cy);
                    break;
                case 'z':
                    isClosed = true;
                    context.closePath();
                    break;
            }
        }
        if (!isClosed && !this.hasFill()) {
            context.strokeShape(this);
        }
        else {
            context.fillStrokeShape(this);
        }
    };
    Path.prototype.getSelfRect = function () {
        var points = [];
        this.dataArray.forEach(function (data) {
            if (data.command === 'A') {
                var start = data.points[4];
                var dTheta = data.points[5];
                var end = data.points[4] + dTheta;
                var inc = Math.PI / 180.0;
                if (Math.abs(start - end) < inc) {
                    inc = Math.abs(start - end);
                }
                if (dTheta < 0) {
                    for (var t = start - inc; t > end; t -= inc) {
                        var point = Path.getPointOnEllipticalArc(data.points[0], data.points[1], data.points[2], data.points[3], t, 0);
                        points.push(point.x, point.y);
                    }
                }
                else {
                    for (var t = start + inc; t < end; t += inc) {
                        var point = Path.getPointOnEllipticalArc(data.points[0], data.points[1], data.points[2], data.points[3], t, 0);
                        points.push(point.x, point.y);
                    }
                }
            }
            else if (data.command === 'C') {
                for (var t = 0.0; t <= 1; t += 0.01) {
                    var point = Path.getPointOnCubicBezier(t, data.start.x, data.start.y, data.points[0], data.points[1], data.points[2], data.points[3], data.points[4], data.points[5]);
                    points.push(point.x, point.y);
                }
            }
            else {
                points = points.concat(data.points);
            }
        });
        var minX = points[0];
        var maxX = points[0];
        var minY = points[1];
        var maxY = points[1];
        var x, y;
        for (var i = 0; i < points.length / 2; i++) {
            x = points[i * 2];
            y = points[i * 2 + 1];
            if (!isNaN(x)) {
                minX = Math.min(minX, x);
                maxX = Math.max(maxX, x);
            }
            if (!isNaN(y)) {
                minY = Math.min(minY, y);
                maxY = Math.max(maxY, y);
            }
        }
        return {
            x: Math.round(minX),
            y: Math.round(minY),
            width: Math.round(maxX - minX),
            height: Math.round(maxY - minY)
        };
    };
    Path.prototype.getLength = function () {
        return this.pathLength;
    };
    Path.prototype.getPointAtLength = function (length) {
        var point, i = 0, ii = this.dataArray.length;
        if (!ii) {
            return null;
        }
        while (i < ii && length > this.dataArray[i].pathLength) {
            length -= this.dataArray[i].pathLength;
            ++i;
        }
        if (i === ii) {
            point = this.dataArray[i - 1].points.slice(-2);
            return {
                x: point[0],
                y: point[1]
            };
        }
        if (length < 0.01) {
            point = this.dataArray[i].points.slice(0, 2);
            return {
                x: point[0],
                y: point[1]
            };
        }
        var cp = this.dataArray[i];
        var p = cp.points;
        switch (cp.command) {
            case 'L':
                return Path.getPointOnLine(length, cp.start.x, cp.start.y, p[0], p[1]);
            case 'C':
                return Path.getPointOnCubicBezier(length / cp.pathLength, cp.start.x, cp.start.y, p[0], p[1], p[2], p[3], p[4], p[5]);
            case 'Q':
                return Path.getPointOnQuadraticBezier(length / cp.pathLength, cp.start.x, cp.start.y, p[0], p[1], p[2], p[3]);
            case 'A':
                var cx = p[0], cy = p[1], rx = p[2], ry = p[3], theta = p[4], dTheta = p[5], psi = p[6];
                theta += (dTheta * length) / cp.pathLength;
                return Path.getPointOnEllipticalArc(cx, cy, rx, ry, theta, psi);
        }
        return null;
    };
    Path.getLineLength = function (x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    };
    Path.getPointOnLine = function (dist, P1x, P1y, P2x, P2y, fromX, fromY) {
        if (fromX === undefined) {
            fromX = P1x;
        }
        if (fromY === undefined) {
            fromY = P1y;
        }
        var m = (P2y - P1y) / (P2x - P1x + 0.00000001);
        var run = Math.sqrt((dist * dist) / (1 + m * m));
        if (P2x < P1x) {
            run *= -1;
        }
        var rise = m * run;
        var pt;
        if (P2x === P1x) {
            pt = {
                x: fromX,
                y: fromY + rise
            };
        }
        else if ((fromY - P1y) / (fromX - P1x + 0.00000001) === m) {
            pt = {
                x: fromX + run,
                y: fromY + rise
            };
        }
        else {
            var ix, iy;
            var len = this.getLineLength(P1x, P1y, P2x, P2y);
            if (len < 0.00000001) {
                return undefined;
            }
            var u = (fromX - P1x) * (P2x - P1x) + (fromY - P1y) * (P2y - P1y);
            u = u / (len * len);
            ix = P1x + u * (P2x - P1x);
            iy = P1y + u * (P2y - P1y);
            var pRise = this.getLineLength(fromX, fromY, ix, iy);
            var pRun = Math.sqrt(dist * dist - pRise * pRise);
            run = Math.sqrt((pRun * pRun) / (1 + m * m));
            if (P2x < P1x) {
                run *= -1;
            }
            rise = m * run;
            pt = {
                x: ix + run,
                y: iy + rise
            };
        }
        return pt;
    };
    Path.getPointOnCubicBezier = function (pct, P1x, P1y, P2x, P2y, P3x, P3y, P4x, P4y) {
        function CB1(t) {
            return t * t * t;
        }
        function CB2(t) {
            return 3 * t * t * (1 - t);
        }
        function CB3(t) {
            return 3 * t * (1 - t) * (1 - t);
        }
        function CB4(t) {
            return (1 - t) * (1 - t) * (1 - t);
        }
        var x = P4x * CB1(pct) + P3x * CB2(pct) + P2x * CB3(pct) + P1x * CB4(pct);
        var y = P4y * CB1(pct) + P3y * CB2(pct) + P2y * CB3(pct) + P1y * CB4(pct);
        return {
            x: x,
            y: y
        };
    };
    Path.getPointOnQuadraticBezier = function (pct, P1x, P1y, P2x, P2y, P3x, P3y) {
        function QB1(t) {
            return t * t;
        }
        function QB2(t) {
            return 2 * t * (1 - t);
        }
        function QB3(t) {
            return (1 - t) * (1 - t);
        }
        var x = P3x * QB1(pct) + P2x * QB2(pct) + P1x * QB3(pct);
        var y = P3y * QB1(pct) + P2y * QB2(pct) + P1y * QB3(pct);
        return {
            x: x,
            y: y
        };
    };
    Path.getPointOnEllipticalArc = function (cx, cy, rx, ry, theta, psi) {
        var cosPsi = Math.cos(psi), sinPsi = Math.sin(psi);
        var pt = {
            x: rx * Math.cos(theta),
            y: ry * Math.sin(theta)
        };
        return {
            x: cx + (pt.x * cosPsi - pt.y * sinPsi),
            y: cy + (pt.x * sinPsi + pt.y * cosPsi)
        };
    };
    Path.parsePathData = function (data) {
        if (!data) {
            return [];
        }
        var cs = data;
        var cc = [
            'm',
            'M',
            'l',
            'L',
            'v',
            'V',
            'h',
            'H',
            'z',
            'Z',
            'c',
            'C',
            'q',
            'Q',
            't',
            'T',
            's',
            'S',
            'a',
            'A'
        ];
        cs = cs.replace(new RegExp(' ', 'g'), ',');
        for (var n = 0; n < cc.length; n++) {
            cs = cs.replace(new RegExp(cc[n], 'g'), '|' + cc[n]);
        }
        var arr = cs.split('|');
        var ca = [];
        var coords = [];
        var cpx = 0;
        var cpy = 0;
        var re = /([-+]?((\d+\.\d+)|((\d+)|(\.\d+)))(?:e[-+]?\d+)?)/gi;
        var match;
        for (n = 1; n < arr.length; n++) {
            var str = arr[n];
            var c = str.charAt(0);
            str = str.slice(1);
            coords.length = 0;
            while ((match = re.exec(str))) {
                coords.push(match[0]);
            }
            var p = [];
            for (var j = 0, jlen = coords.length; j < jlen; j++) {
                var parsed = parseFloat(coords[j]);
                if (!isNaN(parsed)) {
                    p.push(parsed);
                }
                else {
                    p.push(0);
                }
            }
            while (p.length > 0) {
                if (isNaN(p[0])) {
                    break;
                }
                var cmd = null;
                var points = [];
                var startX = cpx, startY = cpy;
                var prevCmd, ctlPtx, ctlPty;
                var rx, ry, psi, fa, fs, x1, y1;
                switch (c) {
                    case 'l':
                        cpx += p.shift();
                        cpy += p.shift();
                        cmd = 'L';
                        points.push(cpx, cpy);
                        break;
                    case 'L':
                        cpx = p.shift();
                        cpy = p.shift();
                        points.push(cpx, cpy);
                        break;
                    case 'm':
                        var dx = p.shift();
                        var dy = p.shift();
                        cpx += dx;
                        cpy += dy;
                        cmd = 'M';
                        if (ca.length > 2 && ca[ca.length - 1].command === 'z') {
                            for (var idx = ca.length - 2; idx >= 0; idx--) {
                                if (ca[idx].command === 'M') {
                                    cpx = ca[idx].points[0] + dx;
                                    cpy = ca[idx].points[1] + dy;
                                    break;
                                }
                            }
                        }
                        points.push(cpx, cpy);
                        c = 'l';
                        break;
                    case 'M':
                        cpx = p.shift();
                        cpy = p.shift();
                        cmd = 'M';
                        points.push(cpx, cpy);
                        c = 'L';
                        break;
                    case 'h':
                        cpx += p.shift();
                        cmd = 'L';
                        points.push(cpx, cpy);
                        break;
                    case 'H':
                        cpx = p.shift();
                        cmd = 'L';
                        points.push(cpx, cpy);
                        break;
                    case 'v':
                        cpy += p.shift();
                        cmd = 'L';
                        points.push(cpx, cpy);
                        break;
                    case 'V':
                        cpy = p.shift();
                        cmd = 'L';
                        points.push(cpx, cpy);
                        break;
                    case 'C':
                        points.push(p.shift(), p.shift(), p.shift(), p.shift());
                        cpx = p.shift();
                        cpy = p.shift();
                        points.push(cpx, cpy);
                        break;
                    case 'c':
                        points.push(cpx + p.shift(), cpy + p.shift(), cpx + p.shift(), cpy + p.shift());
                        cpx += p.shift();
                        cpy += p.shift();
                        cmd = 'C';
                        points.push(cpx, cpy);
                        break;
                    case 'S':
                        ctlPtx = cpx;
                        ctlPty = cpy;
                        prevCmd = ca[ca.length - 1];
                        if (prevCmd.command === 'C') {
                            ctlPtx = cpx + (cpx - prevCmd.points[2]);
                            ctlPty = cpy + (cpy - prevCmd.points[3]);
                        }
                        points.push(ctlPtx, ctlPty, p.shift(), p.shift());
                        cpx = p.shift();
                        cpy = p.shift();
                        cmd = 'C';
                        points.push(cpx, cpy);
                        break;
                    case 's':
                        ctlPtx = cpx;
                        ctlPty = cpy;
                        prevCmd = ca[ca.length - 1];
                        if (prevCmd.command === 'C') {
                            ctlPtx = cpx + (cpx - prevCmd.points[2]);
                            ctlPty = cpy + (cpy - prevCmd.points[3]);
                        }
                        points.push(ctlPtx, ctlPty, cpx + p.shift(), cpy + p.shift());
                        cpx += p.shift();
                        cpy += p.shift();
                        cmd = 'C';
                        points.push(cpx, cpy);
                        break;
                    case 'Q':
                        points.push(p.shift(), p.shift());
                        cpx = p.shift();
                        cpy = p.shift();
                        points.push(cpx, cpy);
                        break;
                    case 'q':
                        points.push(cpx + p.shift(), cpy + p.shift());
                        cpx += p.shift();
                        cpy += p.shift();
                        cmd = 'Q';
                        points.push(cpx, cpy);
                        break;
                    case 'T':
                        ctlPtx = cpx;
                        ctlPty = cpy;
                        prevCmd = ca[ca.length - 1];
                        if (prevCmd.command === 'Q') {
                            ctlPtx = cpx + (cpx - prevCmd.points[0]);
                            ctlPty = cpy + (cpy - prevCmd.points[1]);
                        }
                        cpx = p.shift();
                        cpy = p.shift();
                        cmd = 'Q';
                        points.push(ctlPtx, ctlPty, cpx, cpy);
                        break;
                    case 't':
                        ctlPtx = cpx;
                        ctlPty = cpy;
                        prevCmd = ca[ca.length - 1];
                        if (prevCmd.command === 'Q') {
                            ctlPtx = cpx + (cpx - prevCmd.points[0]);
                            ctlPty = cpy + (cpy - prevCmd.points[1]);
                        }
                        cpx += p.shift();
                        cpy += p.shift();
                        cmd = 'Q';
                        points.push(ctlPtx, ctlPty, cpx, cpy);
                        break;
                    case 'A':
                        rx = p.shift();
                        ry = p.shift();
                        psi = p.shift();
                        fa = p.shift();
                        fs = p.shift();
                        x1 = cpx;
                        y1 = cpy;
                        cpx = p.shift();
                        cpy = p.shift();
                        cmd = 'A';
                        points = this.convertEndpointToCenterParameterization(x1, y1, cpx, cpy, fa, fs, rx, ry, psi);
                        break;
                    case 'a':
                        rx = p.shift();
                        ry = p.shift();
                        psi = p.shift();
                        fa = p.shift();
                        fs = p.shift();
                        x1 = cpx;
                        y1 = cpy;
                        cpx += p.shift();
                        cpy += p.shift();
                        cmd = 'A';
                        points = this.convertEndpointToCenterParameterization(x1, y1, cpx, cpy, fa, fs, rx, ry, psi);
                        break;
                }
                ca.push({
                    command: cmd || c,
                    points: points,
                    start: {
                        x: startX,
                        y: startY
                    },
                    pathLength: this.calcLength(startX, startY, cmd || c, points)
                });
            }
            if (c === 'z' || c === 'Z') {
                ca.push({
                    command: 'z',
                    points: [],
                    start: undefined,
                    pathLength: 0
                });
            }
        }
        return ca;
    };
    Path.calcLength = function (x, y, cmd, points) {
        var len, p1, p2, t;
        var path = Path;
        switch (cmd) {
            case 'L':
                return path.getLineLength(x, y, points[0], points[1]);
            case 'C':
                len = 0.0;
                p1 = path.getPointOnCubicBezier(0, x, y, points[0], points[1], points[2], points[3], points[4], points[5]);
                for (t = 0.01; t <= 1; t += 0.01) {
                    p2 = path.getPointOnCubicBezier(t, x, y, points[0], points[1], points[2], points[3], points[4], points[5]);
                    len += path.getLineLength(p1.x, p1.y, p2.x, p2.y);
                    p1 = p2;
                }
                return len;
            case 'Q':
                len = 0.0;
                p1 = path.getPointOnQuadraticBezier(0, x, y, points[0], points[1], points[2], points[3]);
                for (t = 0.01; t <= 1; t += 0.01) {
                    p2 = path.getPointOnQuadraticBezier(t, x, y, points[0], points[1], points[2], points[3]);
                    len += path.getLineLength(p1.x, p1.y, p2.x, p2.y);
                    p1 = p2;
                }
                return len;
            case 'A':
                len = 0.0;
                var start = points[4];
                var dTheta = points[5];
                var end = points[4] + dTheta;
                var inc = Math.PI / 180.0;
                if (Math.abs(start - end) < inc) {
                    inc = Math.abs(start - end);
                }
                p1 = path.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], start, 0);
                if (dTheta < 0) {
                    for (t = start - inc; t > end; t -= inc) {
                        p2 = path.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], t, 0);
                        len += path.getLineLength(p1.x, p1.y, p2.x, p2.y);
                        p1 = p2;
                    }
                }
                else {
                    for (t = start + inc; t < end; t += inc) {
                        p2 = path.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], t, 0);
                        len += path.getLineLength(p1.x, p1.y, p2.x, p2.y);
                        p1 = p2;
                    }
                }
                p2 = path.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], end, 0);
                len += path.getLineLength(p1.x, p1.y, p2.x, p2.y);
                return len;
        }
        return 0;
    };
    Path.convertEndpointToCenterParameterization = function (x1, y1, x2, y2, fa, fs, rx, ry, psiDeg) {
        var psi = psiDeg * (Math.PI / 180.0);
        var xp = (Math.cos(psi) * (x1 - x2)) / 2.0 + (Math.sin(psi) * (y1 - y2)) / 2.0;
        var yp = (-1 * Math.sin(psi) * (x1 - x2)) / 2.0 +
            (Math.cos(psi) * (y1 - y2)) / 2.0;
        var lambda = (xp * xp) / (rx * rx) + (yp * yp) / (ry * ry);
        if (lambda > 1) {
            rx *= Math.sqrt(lambda);
            ry *= Math.sqrt(lambda);
        }
        var f = Math.sqrt((rx * rx * (ry * ry) - rx * rx * (yp * yp) - ry * ry * (xp * xp)) /
            (rx * rx * (yp * yp) + ry * ry * (xp * xp)));
        if (fa === fs) {
            f *= -1;
        }
        if (isNaN(f)) {
            f = 0;
        }
        var cxp = (f * rx * yp) / ry;
        var cyp = (f * -ry * xp) / rx;
        var cx = (x1 + x2) / 2.0 + Math.cos(psi) * cxp - Math.sin(psi) * cyp;
        var cy = (y1 + y2) / 2.0 + Math.sin(psi) * cxp + Math.cos(psi) * cyp;
        var vMag = function (v) {
            return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
        };
        var vRatio = function (u, v) {
            return (u[0] * v[0] + u[1] * v[1]) / (vMag(u) * vMag(v));
        };
        var vAngle = function (u, v) {
            return (u[0] * v[1] < u[1] * v[0] ? -1 : 1) * Math.acos(vRatio(u, v));
        };
        var theta = vAngle([1, 0], [(xp - cxp) / rx, (yp - cyp) / ry]);
        var u = [(xp - cxp) / rx, (yp - cyp) / ry];
        var v = [(-1 * xp - cxp) / rx, (-1 * yp - cyp) / ry];
        var dTheta = vAngle(u, v);
        if (vRatio(u, v) <= -1) {
            dTheta = Math.PI;
        }
        if (vRatio(u, v) >= 1) {
            dTheta = 0;
        }
        if (fs === 0 && dTheta > 0) {
            dTheta = dTheta - 2 * Math.PI;
        }
        if (fs === 1 && dTheta < 0) {
            dTheta = dTheta + 2 * Math.PI;
        }
        return [cx, cy, rx, ry, theta, dTheta, psi, fs];
    };
    return Path;
}(Shape_1.Shape));
exports.Path = Path;
Path.prototype.className = 'Path';
Path.prototype._attrsAffectingSize = ['data'];
Global_1._registerNode(Path);
Factory_1.Factory.addGetterSetter(Path, 'data');
Util_1.Collection.mapMethods(Path);

},{"../Factory":9,"../Global":11,"../Shape":16,"../Util":19}],51:[function(_dereq_,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = _dereq_("../Util");
var Factory_1 = _dereq_("../Factory");
var Shape_1 = _dereq_("../Shape");
var Global_1 = _dereq_("../Global");
var Validators_1 = _dereq_("../Validators");
var Rect = (function (_super) {
    __extends(Rect, _super);
    function Rect() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rect.prototype._sceneFunc = function (context) {
        var cornerRadius = this.cornerRadius(), width = this.width(), height = this.height();
        context.beginPath();
        if (!cornerRadius) {
            context.rect(0, 0, width, height);
        }
        else {
            var topLeft = 0;
            var topRight = 0;
            var bottomLeft = 0;
            var bottomRight = 0;
            if (typeof cornerRadius === 'number') {
                topLeft = topRight = bottomLeft = bottomRight = Math.min(cornerRadius, width / 2, height / 2);
            }
            else {
                topLeft = Math.min(cornerRadius[0] || 0, width / 2, height / 2);
                topRight = Math.min(cornerRadius[1] || 0, width / 2, height / 2);
                bottomRight = Math.min(cornerRadius[2] || 0, width / 2, height / 2);
                bottomLeft = Math.min(cornerRadius[3] || 0, width / 2, height / 2);
            }
            context.moveTo(topLeft, 0);
            context.lineTo(width - topRight, 0);
            context.arc(width - topRight, topRight, topRight, (Math.PI * 3) / 2, 0, false);
            context.lineTo(width, height - bottomRight);
            context.arc(width - bottomRight, height - bottomRight, bottomRight, 0, Math.PI / 2, false);
            context.lineTo(bottomLeft, height);
            context.arc(bottomLeft, height - bottomLeft, bottomLeft, Math.PI / 2, Math.PI, false);
            context.lineTo(0, topLeft);
            context.arc(topLeft, topLeft, topLeft, Math.PI, (Math.PI * 3) / 2, false);
        }
        context.closePath();
        context.fillStrokeShape(this);
    };
    return Rect;
}(Shape_1.Shape));
exports.Rect = Rect;
Rect.prototype.className = 'Rect';
Global_1._registerNode(Rect);
Factory_1.Factory.addGetterSetter(Rect, 'cornerRadius', 0, Validators_1.getNumberOrArrayOfNumbersValidator(4));
Util_1.Collection.mapMethods(Rect);

},{"../Factory":9,"../Global":11,"../Shape":16,"../Util":19,"../Validators":20}],52:[function(_dereq_,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = _dereq_("../Util");
var Factory_1 = _dereq_("../Factory");
var Shape_1 = _dereq_("../Shape");
var Validators_1 = _dereq_("../Validators");
var Global_1 = _dereq_("../Global");
var RegularPolygon = (function (_super) {
    __extends(RegularPolygon, _super);
    function RegularPolygon() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RegularPolygon.prototype._sceneFunc = function (context) {
        var sides = this.sides(), radius = this.radius(), n, x, y;
        context.beginPath();
        context.moveTo(0, 0 - radius);
        for (n = 1; n < sides; n++) {
            x = radius * Math.sin((n * 2 * Math.PI) / sides);
            y = -1 * radius * Math.cos((n * 2 * Math.PI) / sides);
            context.lineTo(x, y);
        }
        context.closePath();
        context.fillStrokeShape(this);
    };
    RegularPolygon.prototype.getWidth = function () {
        return this.radius() * 2;
    };
    RegularPolygon.prototype.getHeight = function () {
        return this.radius() * 2;
    };
    RegularPolygon.prototype.setWidth = function (width) {
        this.radius(width / 2);
    };
    RegularPolygon.prototype.setHeight = function (height) {
        this.radius(height / 2);
    };
    return RegularPolygon;
}(Shape_1.Shape));
exports.RegularPolygon = RegularPolygon;
RegularPolygon.prototype.className = 'RegularPolygon';
RegularPolygon.prototype._centroid = true;
RegularPolygon.prototype._attrsAffectingSize = ['radius'];
Global_1._registerNode(RegularPolygon);
Factory_1.Factory.addGetterSetter(RegularPolygon, 'radius', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(RegularPolygon, 'sides', 0, Validators_1.getNumberValidator());
Util_1.Collection.mapMethods(RegularPolygon);

},{"../Factory":9,"../Global":11,"../Shape":16,"../Util":19,"../Validators":20}],53:[function(_dereq_,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = _dereq_("../Util");
var Factory_1 = _dereq_("../Factory");
var Shape_1 = _dereq_("../Shape");
var Validators_1 = _dereq_("../Validators");
var Global_1 = _dereq_("../Global");
var PIx2 = Math.PI * 2;
var Ring = (function (_super) {
    __extends(Ring, _super);
    function Ring() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Ring.prototype._sceneFunc = function (context) {
        context.beginPath();
        context.arc(0, 0, this.innerRadius(), 0, PIx2, false);
        context.moveTo(this.outerRadius(), 0);
        context.arc(0, 0, this.outerRadius(), PIx2, 0, true);
        context.closePath();
        context.fillStrokeShape(this);
    };
    Ring.prototype.getWidth = function () {
        return this.outerRadius() * 2;
    };
    Ring.prototype.getHeight = function () {
        return this.outerRadius() * 2;
    };
    Ring.prototype.setWidth = function (width) {
        this.outerRadius(width / 2);
    };
    Ring.prototype.setHeight = function (height) {
        this.outerRadius(height / 2);
    };
    return Ring;
}(Shape_1.Shape));
exports.Ring = Ring;
Ring.prototype.className = 'Ring';
Ring.prototype._centroid = true;
Ring.prototype._attrsAffectingSize = ['innerRadius', 'outerRadius'];
Global_1._registerNode(Ring);
Factory_1.Factory.addGetterSetter(Ring, 'innerRadius', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Ring, 'outerRadius', 0, Validators_1.getNumberValidator());
Util_1.Collection.mapMethods(Ring);

},{"../Factory":9,"../Global":11,"../Shape":16,"../Util":19,"../Validators":20}],54:[function(_dereq_,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = _dereq_("../Util");
var Factory_1 = _dereq_("../Factory");
var Shape_1 = _dereq_("../Shape");
var Animation_1 = _dereq_("../Animation");
var Validators_1 = _dereq_("../Validators");
var Global_1 = _dereq_("../Global");
var Sprite = (function (_super) {
    __extends(Sprite, _super);
    function Sprite(config) {
        var _this = _super.call(this, config) || this;
        _this._updated = true;
        _this.anim = new Animation_1.Animation(function () {
            var updated = _this._updated;
            _this._updated = false;
            return updated;
        });
        _this.on('animationChange.konva', function () {
            this.frameIndex(0);
        });
        _this.on('frameIndexChange.konva', function () {
            this._updated = true;
        });
        _this.on('frameRateChange.konva', function () {
            if (!this.anim.isRunning()) {
                return;
            }
            clearInterval(this.interval);
            this._setInterval();
        });
        return _this;
    }
    Sprite.prototype._sceneFunc = function (context) {
        var anim = this.animation(), index = this.frameIndex(), ix4 = index * 4, set = this.animations()[anim], offsets = this.frameOffsets(), x = set[ix4 + 0], y = set[ix4 + 1], width = set[ix4 + 2], height = set[ix4 + 3], image = this.image();
        if (this.hasFill() || this.hasStroke()) {
            context.beginPath();
            context.rect(0, 0, width, height);
            context.closePath();
            context.fillStrokeShape(this);
        }
        if (image) {
            if (offsets) {
                var offset = offsets[anim], ix2 = index * 2;
                context.drawImage(image, x, y, width, height, offset[ix2 + 0], offset[ix2 + 1], width, height);
            }
            else {
                context.drawImage(image, x, y, width, height, 0, 0, width, height);
            }
        }
    };
    Sprite.prototype._hitFunc = function (context) {
        var anim = this.animation(), index = this.frameIndex(), ix4 = index * 4, set = this.animations()[anim], offsets = this.frameOffsets(), width = set[ix4 + 2], height = set[ix4 + 3];
        context.beginPath();
        if (offsets) {
            var offset = offsets[anim];
            var ix2 = index * 2;
            context.rect(offset[ix2 + 0], offset[ix2 + 1], width, height);
        }
        else {
            context.rect(0, 0, width, height);
        }
        context.closePath();
        context.fillShape(this);
    };
    Sprite.prototype._useBufferCanvas = function () {
        return _super.prototype._useBufferCanvas.call(this, true);
    };
    Sprite.prototype._setInterval = function () {
        var that = this;
        this.interval = setInterval(function () {
            that._updateIndex();
        }, 1000 / this.frameRate());
    };
    Sprite.prototype.start = function () {
        if (this.isRunning()) {
            return;
        }
        var layer = this.getLayer();
        this.anim.setLayers(layer);
        this._setInterval();
        this.anim.start();
    };
    Sprite.prototype.stop = function () {
        this.anim.stop();
        clearInterval(this.interval);
    };
    Sprite.prototype.isRunning = function () {
        return this.anim.isRunning();
    };
    Sprite.prototype._updateIndex = function () {
        var index = this.frameIndex(), animation = this.animation(), animations = this.animations(), anim = animations[animation], len = anim.length / 4;
        if (index < len - 1) {
            this.frameIndex(index + 1);
        }
        else {
            this.frameIndex(0);
        }
    };
    return Sprite;
}(Shape_1.Shape));
exports.Sprite = Sprite;
Sprite.prototype.className = 'Sprite';
Global_1._registerNode(Sprite);
Factory_1.Factory.addGetterSetter(Sprite, 'animation');
Factory_1.Factory.addGetterSetter(Sprite, 'animations');
Factory_1.Factory.addGetterSetter(Sprite, 'frameOffsets');
Factory_1.Factory.addGetterSetter(Sprite, 'image');
Factory_1.Factory.addGetterSetter(Sprite, 'frameIndex', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Sprite, 'frameRate', 17, Validators_1.getNumberValidator());
Factory_1.Factory.backCompat(Sprite, {
    index: 'frameIndex',
    getIndex: 'getFrameIndex',
    setIndex: 'setFrameIndex',
});
Util_1.Collection.mapMethods(Sprite);

},{"../Animation":4,"../Factory":9,"../Global":11,"../Shape":16,"../Util":19,"../Validators":20}],55:[function(_dereq_,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = _dereq_("../Util");
var Factory_1 = _dereq_("../Factory");
var Shape_1 = _dereq_("../Shape");
var Validators_1 = _dereq_("../Validators");
var Global_1 = _dereq_("../Global");
var Star = (function (_super) {
    __extends(Star, _super);
    function Star() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Star.prototype._sceneFunc = function (context) {
        var innerRadius = this.innerRadius(), outerRadius = this.outerRadius(), numPoints = this.numPoints();
        context.beginPath();
        context.moveTo(0, 0 - outerRadius);
        for (var n = 1; n < numPoints * 2; n++) {
            var radius = n % 2 === 0 ? outerRadius : innerRadius;
            var x = radius * Math.sin((n * Math.PI) / numPoints);
            var y = -1 * radius * Math.cos((n * Math.PI) / numPoints);
            context.lineTo(x, y);
        }
        context.closePath();
        context.fillStrokeShape(this);
    };
    Star.prototype.getWidth = function () {
        return this.outerRadius() * 2;
    };
    Star.prototype.getHeight = function () {
        return this.outerRadius() * 2;
    };
    Star.prototype.setWidth = function (width) {
        this.outerRadius(width / 2);
    };
    Star.prototype.setHeight = function (height) {
        this.outerRadius(height / 2);
    };
    return Star;
}(Shape_1.Shape));
exports.Star = Star;
Star.prototype.className = 'Star';
Star.prototype._centroid = true;
Star.prototype._attrsAffectingSize = ['innerRadius', 'outerRadius'];
Global_1._registerNode(Star);
Factory_1.Factory.addGetterSetter(Star, 'numPoints', 5, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Star, 'innerRadius', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Star, 'outerRadius', 0, Validators_1.getNumberValidator());
Util_1.Collection.mapMethods(Star);

},{"../Factory":9,"../Global":11,"../Shape":16,"../Util":19,"../Validators":20}],56:[function(_dereq_,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = _dereq_("../Util");
var Factory_1 = _dereq_("../Factory");
var Shape_1 = _dereq_("../Shape");
var Global_1 = _dereq_("../Global");
var Validators_1 = _dereq_("../Validators");
var Global_2 = _dereq_("../Global");
function stringToArray(string) {
    return Array.from(string);
}
exports.stringToArray = stringToArray;
var AUTO = 'auto', CENTER = 'center', JUSTIFY = 'justify', CHANGE_KONVA = 'Change.konva', CONTEXT_2D = '2d', DASH = '-', LEFT = 'left', TEXT = 'text', TEXT_UPPER = 'Text', TOP = 'top', BOTTOM = 'bottom', MIDDLE = 'middle', NORMAL = 'normal', PX_SPACE = 'px ', SPACE = ' ', RIGHT = 'right', WORD = 'word', CHAR = 'char', NONE = 'none', ELLIPSIS = '…', ATTR_CHANGE_LIST = [
    'fontFamily',
    'fontSize',
    'fontStyle',
    'fontVariant',
    'padding',
    'align',
    'verticalAlign',
    'lineHeight',
    'text',
    'width',
    'height',
    'wrap',
    'ellipsis',
    'letterSpacing',
], attrChangeListLen = ATTR_CHANGE_LIST.length;
function normalizeFontFamily(fontFamily) {
    return fontFamily
        .split(',')
        .map(function (family) {
        family = family.trim();
        var hasSpace = family.indexOf(' ') >= 0;
        var hasQuotes = family.indexOf('"') >= 0 || family.indexOf("'") >= 0;
        if (hasSpace && !hasQuotes) {
            family = "\"" + family + "\"";
        }
        return family;
    })
        .join(', ');
}
var dummyContext;
function getDummyContext() {
    if (dummyContext) {
        return dummyContext;
    }
    dummyContext = Util_1.Util.createCanvasElement().getContext(CONTEXT_2D);
    return dummyContext;
}
function _fillFunc(context) {
    context.fillText(this._partialText, this._partialTextX, this._partialTextY);
}
function _strokeFunc(context) {
    context.strokeText(this._partialText, this._partialTextX, this._partialTextY);
}
function checkDefaultFill(config) {
    config = config || {};
    if (!config.fillLinearGradientColorStops &&
        !config.fillRadialGradientColorStops &&
        !config.fillPatternImage) {
        config.fill = config.fill || 'black';
    }
    return config;
}
var Text = (function (_super) {
    __extends(Text, _super);
    function Text(config) {
        var _this = _super.call(this, checkDefaultFill(config)) || this;
        _this._partialTextX = 0;
        _this._partialTextY = 0;
        for (var n = 0; n < attrChangeListLen; n++) {
            _this.on(ATTR_CHANGE_LIST[n] + CHANGE_KONVA, _this._setTextData);
        }
        _this._setTextData();
        return _this;
    }
    Text.prototype._sceneFunc = function (context) {
        var padding = this.padding(), fontSize = this.fontSize(), lineHeightPx = this.lineHeight() * fontSize, textArr = this.textArr, textArrLen = textArr.length, verticalAlign = this.verticalAlign(), alignY = 0, align = this.align(), totalWidth = this.getWidth(), letterSpacing = this.letterSpacing(), fill = this.fill(), textDecoration = this.textDecoration(), shouldUnderline = textDecoration.indexOf('underline') !== -1, shouldLineThrough = textDecoration.indexOf('line-through') !== -1, n;
        var translateY = 0;
        var translateY = lineHeightPx / 2;
        var lineTranslateX = 0;
        var lineTranslateY = 0;
        context.setAttr('font', this._getContextFont());
        context.setAttr('textBaseline', MIDDLE);
        context.setAttr('textAlign', LEFT);
        if (verticalAlign === MIDDLE) {
            alignY = (this.getHeight() - textArrLen * lineHeightPx - padding * 2) / 2;
        }
        else if (verticalAlign === BOTTOM) {
            alignY = this.getHeight() - textArrLen * lineHeightPx - padding * 2;
        }
        context.translate(padding, alignY + padding);
        for (n = 0; n < textArrLen; n++) {
            var lineTranslateX = 0;
            var lineTranslateY = 0;
            var obj = textArr[n], text = obj.text, width = obj.width, lastLine = n !== textArrLen - 1, spacesNumber, oneWord, lineWidth;
            context.save();
            if (align === RIGHT) {
                lineTranslateX += totalWidth - width - padding * 2;
            }
            else if (align === CENTER) {
                lineTranslateX += (totalWidth - width - padding * 2) / 2;
            }
            if (shouldUnderline) {
                context.save();
                context.beginPath();
                context.moveTo(lineTranslateX, translateY + lineTranslateY + Math.round(fontSize / 2));
                spacesNumber = text.split(' ').length - 1;
                oneWord = spacesNumber === 0;
                lineWidth =
                    align === JUSTIFY && lastLine && !oneWord
                        ? totalWidth - padding * 2
                        : width;
                context.lineTo(lineTranslateX + Math.round(lineWidth), translateY + lineTranslateY + Math.round(fontSize / 2));
                context.lineWidth = fontSize / 15;
                context.strokeStyle = fill;
                context.stroke();
                context.restore();
            }
            if (shouldLineThrough) {
                context.save();
                context.beginPath();
                context.moveTo(lineTranslateX, translateY + lineTranslateY);
                spacesNumber = text.split(' ').length - 1;
                oneWord = spacesNumber === 0;
                lineWidth =
                    align === JUSTIFY && lastLine && !oneWord
                        ? totalWidth - padding * 2
                        : width;
                context.lineTo(lineTranslateX + Math.round(lineWidth), translateY + lineTranslateY);
                context.lineWidth = fontSize / 15;
                context.strokeStyle = fill;
                context.stroke();
                context.restore();
            }
            if (letterSpacing !== 0 || align === JUSTIFY) {
                spacesNumber = text.split(' ').length - 1;
                var array = stringToArray(text);
                for (var li = 0; li < array.length; li++) {
                    var letter = array[li];
                    if (letter === ' ' && n !== textArrLen - 1 && align === JUSTIFY) {
                        lineTranslateX += (totalWidth - padding * 2 - width) / spacesNumber;
                    }
                    this._partialTextX = lineTranslateX;
                    this._partialTextY = translateY + lineTranslateY;
                    this._partialText = letter;
                    context.fillStrokeShape(this);
                    lineTranslateX += this.measureSize(letter).width + letterSpacing;
                }
            }
            else {
                this._partialTextX = lineTranslateX;
                this._partialTextY = translateY + lineTranslateY;
                this._partialText = text;
                context.fillStrokeShape(this);
            }
            context.restore();
            if (textArrLen > 1) {
                translateY += lineHeightPx;
            }
        }
    };
    Text.prototype._hitFunc = function (context) {
        var width = this.getWidth(), height = this.getHeight();
        context.beginPath();
        context.rect(0, 0, width, height);
        context.closePath();
        context.fillStrokeShape(this);
    };
    Text.prototype.setText = function (text) {
        var str = Util_1.Util._isString(text)
            ? text
            : text === null || text === undefined
                ? ''
                : text + '';
        this._setAttr(TEXT, str);
        return this;
    };
    Text.prototype.getWidth = function () {
        var isAuto = this.attrs.width === AUTO || this.attrs.width === undefined;
        return isAuto ? this.getTextWidth() + this.padding() * 2 : this.attrs.width;
    };
    Text.prototype.getHeight = function () {
        var isAuto = this.attrs.height === AUTO || this.attrs.height === undefined;
        return isAuto
            ? this.fontSize() * this.textArr.length * this.lineHeight() +
                this.padding() * 2
            : this.attrs.height;
    };
    Text.prototype.getTextWidth = function () {
        return this.textWidth;
    };
    Text.prototype.getTextHeight = function () {
        Util_1.Util.warn('text.getTextHeight() method is deprecated. Use text.height() - for full height and text.fontSize() - for one line height.');
        return this.textHeight;
    };
    Text.prototype.measureSize = function (text) {
        var _context = getDummyContext(), fontSize = this.fontSize(), metrics;
        _context.save();
        _context.font = this._getContextFont();
        metrics = _context.measureText(text);
        _context.restore();
        return {
            width: metrics.width,
            height: fontSize,
        };
    };
    Text.prototype._getContextFont = function () {
        if (Global_1.Konva.UA.isIE) {
            return (this.fontStyle() +
                SPACE +
                this.fontSize() +
                PX_SPACE +
                this.fontFamily());
        }
        return (this.fontStyle() +
            SPACE +
            this.fontVariant() +
            SPACE +
            (this.fontSize() + PX_SPACE) +
            normalizeFontFamily(this.fontFamily()));
    };
    Text.prototype._addTextLine = function (line) {
        if (this.align() === JUSTIFY) {
            line = line.trim();
        }
        var width = this._getTextWidth(line);
        return this.textArr.push({ text: line, width: width });
    };
    Text.prototype._getTextWidth = function (text) {
        var letterSpacing = this.letterSpacing();
        var length = text.length;
        return (getDummyContext().measureText(text).width +
            (length ? letterSpacing * (length - 1) : 0));
    };
    Text.prototype._setTextData = function () {
        var lines = this.text().split('\n'), fontSize = +this.fontSize(), textWidth = 0, lineHeightPx = this.lineHeight() * fontSize, width = this.attrs.width, height = this.attrs.height, fixedWidth = width !== AUTO && width !== undefined, fixedHeight = height !== AUTO && height !== undefined, padding = this.padding(), maxWidth = width - padding * 2, maxHeightPx = height - padding * 2, currentHeightPx = 0, wrap = this.wrap(), shouldWrap = wrap !== NONE, wrapAtWord = wrap !== CHAR && shouldWrap, shouldAddEllipsis = this.ellipsis();
        this.textArr = [];
        getDummyContext().font = this._getContextFont();
        var additionalWidth = shouldAddEllipsis ? this._getTextWidth(ELLIPSIS) : 0;
        for (var i = 0, max = lines.length; i < max; ++i) {
            var line = lines[i];
            var lineWidth = this._getTextWidth(line);
            if (fixedWidth && lineWidth > maxWidth) {
                while (line.length > 0) {
                    var low = 0, high = line.length, match = '', matchWidth = 0;
                    while (low < high) {
                        var mid = (low + high) >>> 1, substr = line.slice(0, mid + 1), substrWidth = this._getTextWidth(substr) + additionalWidth;
                        if (substrWidth <= maxWidth) {
                            low = mid + 1;
                            match = substr + (shouldAddEllipsis ? ELLIPSIS : '');
                            matchWidth = substrWidth;
                        }
                        else {
                            high = mid;
                        }
                    }
                    if (match) {
                        if (wrapAtWord) {
                            var wrapIndex;
                            var nextChar = line[match.length];
                            var nextIsSpaceOrDash = nextChar === SPACE || nextChar === DASH;
                            if (nextIsSpaceOrDash && matchWidth <= maxWidth) {
                                wrapIndex = match.length;
                            }
                            else {
                                wrapIndex =
                                    Math.max(match.lastIndexOf(SPACE), match.lastIndexOf(DASH)) +
                                        1;
                            }
                            if (wrapIndex > 0) {
                                low = wrapIndex;
                                match = match.slice(0, low);
                                matchWidth = this._getTextWidth(match);
                            }
                        }
                        match = match.trimRight();
                        this._addTextLine(match);
                        textWidth = Math.max(textWidth, matchWidth);
                        currentHeightPx += lineHeightPx;
                        if (!shouldWrap ||
                            (fixedHeight && currentHeightPx + lineHeightPx > maxHeightPx)) {
                            var lastLine = this.textArr[this.textArr.length - 1];
                            if (lastLine) {
                                var haveSpace = this._getTextWidth(lastLine.text + ELLIPSIS) < maxWidth;
                                if (!haveSpace) {
                                    lastLine.text = lastLine.text.slice(0, lastLine.text.length - 3);
                                }
                                if (shouldAddEllipsis) {
                                    this.textArr.splice(this.textArr.length - 1, 1);
                                    this._addTextLine(lastLine.text + ELLIPSIS);
                                }
                            }
                            break;
                        }
                        line = line.slice(low);
                        line = line.trimLeft();
                        if (line.length > 0) {
                            lineWidth = this._getTextWidth(line);
                            if (lineWidth <= maxWidth) {
                                this._addTextLine(line);
                                currentHeightPx += lineHeightPx;
                                textWidth = Math.max(textWidth, lineWidth);
                                break;
                            }
                        }
                    }
                    else {
                        break;
                    }
                }
            }
            else {
                this._addTextLine(line);
                currentHeightPx += lineHeightPx;
                textWidth = Math.max(textWidth, lineWidth);
            }
            if (fixedHeight && currentHeightPx + lineHeightPx > maxHeightPx) {
                break;
            }
        }
        this.textHeight = fontSize;
        this.textWidth = textWidth;
    };
    Text.prototype.getStrokeScaleEnabled = function () {
        return true;
    };
    return Text;
}(Shape_1.Shape));
exports.Text = Text;
Text.prototype._fillFunc = _fillFunc;
Text.prototype._strokeFunc = _strokeFunc;
Text.prototype.className = TEXT_UPPER;
Text.prototype._attrsAffectingSize = [
    'text',
    'fontSize',
    'padding',
    'wrap',
    'lineHeight',
];
Global_2._registerNode(Text);
Factory_1.Factory.overWriteSetter(Text, 'width', Validators_1.getNumberOrAutoValidator());
Factory_1.Factory.overWriteSetter(Text, 'height', Validators_1.getNumberOrAutoValidator());
Factory_1.Factory.addGetterSetter(Text, 'fontFamily', 'Arial');
Factory_1.Factory.addGetterSetter(Text, 'fontSize', 12, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Text, 'fontStyle', NORMAL);
Factory_1.Factory.addGetterSetter(Text, 'fontVariant', NORMAL);
Factory_1.Factory.addGetterSetter(Text, 'padding', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Text, 'align', LEFT);
Factory_1.Factory.addGetterSetter(Text, 'verticalAlign', TOP);
Factory_1.Factory.addGetterSetter(Text, 'lineHeight', 1, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Text, 'wrap', WORD);
Factory_1.Factory.addGetterSetter(Text, 'ellipsis', false, Validators_1.getBooleanValidator());
Factory_1.Factory.addGetterSetter(Text, 'letterSpacing', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Text, 'text', '', Validators_1.getStringValidator());
Factory_1.Factory.addGetterSetter(Text, 'textDecoration', '');
Util_1.Collection.mapMethods(Text);

},{"../Factory":9,"../Global":11,"../Shape":16,"../Util":19,"../Validators":20}],57:[function(_dereq_,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = _dereq_("../Util");
var Factory_1 = _dereq_("../Factory");
var Shape_1 = _dereq_("../Shape");
var Path_1 = _dereq_("./Path");
var Text_1 = _dereq_("./Text");
var Validators_1 = _dereq_("../Validators");
var Global_1 = _dereq_("../Global");
var EMPTY_STRING = '', NORMAL = 'normal';
function _fillFunc(context) {
    context.fillText(this.partialText, 0, 0);
}
function _strokeFunc(context) {
    context.strokeText(this.partialText, 0, 0);
}
var TextPath = (function (_super) {
    __extends(TextPath, _super);
    function TextPath(config) {
        var _this = _super.call(this, config) || this;
        _this.dummyCanvas = Util_1.Util.createCanvasElement();
        _this.dataArray = [];
        _this.dataArray = Path_1.Path.parsePathData(_this.attrs.data);
        _this.on('dataChange.konva', function () {
            this.dataArray = Path_1.Path.parsePathData(this.attrs.data);
            this._setTextData();
        });
        _this.on('textChange.konva alignChange.konva letterSpacingChange.konva kerningFuncChange.konva', _this._setTextData);
        if (config && config['getKerning']) {
            Util_1.Util.warn('getKerning TextPath API is deprecated. Please use "kerningFunc" instead.');
            _this.kerningFunc(config['getKerning']);
        }
        _this._setTextData();
        return _this;
    }
    TextPath.prototype._sceneFunc = function (context) {
        context.setAttr('font', this._getContextFont());
        context.setAttr('textBaseline', this.textBaseline());
        context.setAttr('textAlign', 'left');
        context.save();
        var textDecoration = this.textDecoration();
        var fill = this.fill();
        var fontSize = this.fontSize();
        var glyphInfo = this.glyphInfo;
        if (textDecoration === 'underline') {
            context.beginPath();
        }
        for (var i = 0; i < glyphInfo.length; i++) {
            context.save();
            var p0 = glyphInfo[i].p0;
            context.translate(p0.x, p0.y);
            context.rotate(glyphInfo[i].rotation);
            this.partialText = glyphInfo[i].text;
            context.fillStrokeShape(this);
            if (textDecoration === 'underline') {
                if (i === 0) {
                    context.moveTo(0, fontSize / 2 + 1);
                }
                context.lineTo(fontSize, fontSize / 2 + 1);
            }
            context.restore();
        }
        if (textDecoration === 'underline') {
            context.strokeStyle = fill;
            context.lineWidth = fontSize / 20;
            context.stroke();
        }
        context.restore();
    };
    TextPath.prototype._hitFunc = function (context) {
        context.beginPath();
        var glyphInfo = this.glyphInfo;
        if (glyphInfo.length >= 1) {
            var p0 = glyphInfo[0].p0;
            context.moveTo(p0.x, p0.y);
        }
        for (var i = 0; i < glyphInfo.length; i++) {
            var p1 = glyphInfo[i].p1;
            context.lineTo(p1.x, p1.y);
        }
        context.setAttr('lineWidth', this.fontSize());
        context.setAttr('strokeStyle', this.colorKey);
        context.stroke();
    };
    TextPath.prototype.getTextWidth = function () {
        return this.textWidth;
    };
    TextPath.prototype.getTextHeight = function () {
        Util_1.Util.warn('text.getTextHeight() method is deprecated. Use text.height() - for full height and text.fontSize() - for one line height.');
        return this.textHeight;
    };
    TextPath.prototype.setText = function (text) {
        return Text_1.Text.prototype.setText.call(this, text);
    };
    TextPath.prototype._getContextFont = function () {
        return Text_1.Text.prototype._getContextFont.call(this);
    };
    TextPath.prototype._getTextSize = function (text) {
        var dummyCanvas = this.dummyCanvas;
        var _context = dummyCanvas.getContext('2d');
        _context.save();
        _context.font = this._getContextFont();
        var metrics = _context.measureText(text);
        _context.restore();
        return {
            width: metrics.width,
            height: parseInt(this.attrs.fontSize, 10),
        };
    };
    TextPath.prototype._setTextData = function () {
        var that = this;
        var size = this._getTextSize(this.attrs.text);
        var letterSpacing = this.letterSpacing();
        var align = this.align();
        var kerningFunc = this.kerningFunc();
        this.textWidth = size.width;
        this.textHeight = size.height;
        var textFullWidth = Math.max(this.textWidth + ((this.attrs.text || '').length - 1) * letterSpacing, 0);
        this.glyphInfo = [];
        var fullPathWidth = 0;
        for (var l = 0; l < that.dataArray.length; l++) {
            if (that.dataArray[l].pathLength > 0) {
                fullPathWidth += that.dataArray[l].pathLength;
            }
        }
        var offset = 0;
        if (align === 'center') {
            offset = Math.max(0, fullPathWidth / 2 - textFullWidth / 2);
        }
        if (align === 'right') {
            offset = Math.max(0, fullPathWidth - textFullWidth);
        }
        var charArr = Text_1.stringToArray(this.text());
        var spacesNumber = this.text().split(' ').length - 1;
        var p0, p1, pathCmd;
        var pIndex = -1;
        var currentT = 0;
        var getNextPathSegment = function () {
            currentT = 0;
            var pathData = that.dataArray;
            for (var j = pIndex + 1; j < pathData.length; j++) {
                if (pathData[j].pathLength > 0) {
                    pIndex = j;
                    return pathData[j];
                }
                else if (pathData[j].command === 'M') {
                    p0 = {
                        x: pathData[j].points[0],
                        y: pathData[j].points[1],
                    };
                }
            }
            return {};
        };
        var findSegmentToFitCharacter = function (c) {
            var glyphWidth = that._getTextSize(c).width + letterSpacing;
            if (c === ' ' && align === 'justify') {
                glyphWidth += (fullPathWidth - textFullWidth) / spacesNumber;
            }
            var currLen = 0;
            var attempts = 0;
            p1 = undefined;
            while (Math.abs(glyphWidth - currLen) / glyphWidth > 0.01 &&
                attempts < 25) {
                attempts++;
                var cumulativePathLength = currLen;
                while (pathCmd === undefined) {
                    pathCmd = getNextPathSegment();
                    if (pathCmd &&
                        cumulativePathLength + pathCmd.pathLength < glyphWidth) {
                        cumulativePathLength += pathCmd.pathLength;
                        pathCmd = undefined;
                    }
                }
                if (pathCmd === {} || p0 === undefined) {
                    return undefined;
                }
                var needNewSegment = false;
                switch (pathCmd.command) {
                    case 'L':
                        if (Path_1.Path.getLineLength(p0.x, p0.y, pathCmd.points[0], pathCmd.points[1]) > glyphWidth) {
                            p1 = Path_1.Path.getPointOnLine(glyphWidth, p0.x, p0.y, pathCmd.points[0], pathCmd.points[1], p0.x, p0.y);
                        }
                        else {
                            pathCmd = undefined;
                        }
                        break;
                    case 'A':
                        var start = pathCmd.points[4];
                        var dTheta = pathCmd.points[5];
                        var end = pathCmd.points[4] + dTheta;
                        if (currentT === 0) {
                            currentT = start + 0.00000001;
                        }
                        else if (glyphWidth > currLen) {
                            currentT += ((Math.PI / 180.0) * dTheta) / Math.abs(dTheta);
                        }
                        else {
                            currentT -= ((Math.PI / 360.0) * dTheta) / Math.abs(dTheta);
                        }
                        if ((dTheta < 0 && currentT < end) ||
                            (dTheta >= 0 && currentT > end)) {
                            currentT = end;
                            needNewSegment = true;
                        }
                        p1 = Path_1.Path.getPointOnEllipticalArc(pathCmd.points[0], pathCmd.points[1], pathCmd.points[2], pathCmd.points[3], currentT, pathCmd.points[6]);
                        break;
                    case 'C':
                        if (currentT === 0) {
                            if (glyphWidth > pathCmd.pathLength) {
                                currentT = 0.00000001;
                            }
                            else {
                                currentT = glyphWidth / pathCmd.pathLength;
                            }
                        }
                        else if (glyphWidth > currLen) {
                            currentT += (glyphWidth - currLen) / pathCmd.pathLength;
                        }
                        else {
                            currentT -= (currLen - glyphWidth) / pathCmd.pathLength;
                        }
                        if (currentT > 1.0) {
                            currentT = 1.0;
                            needNewSegment = true;
                        }
                        p1 = Path_1.Path.getPointOnCubicBezier(currentT, pathCmd.start.x, pathCmd.start.y, pathCmd.points[0], pathCmd.points[1], pathCmd.points[2], pathCmd.points[3], pathCmd.points[4], pathCmd.points[5]);
                        break;
                    case 'Q':
                        if (currentT === 0) {
                            currentT = glyphWidth / pathCmd.pathLength;
                        }
                        else if (glyphWidth > currLen) {
                            currentT += (glyphWidth - currLen) / pathCmd.pathLength;
                        }
                        else {
                            currentT -= (currLen - glyphWidth) / pathCmd.pathLength;
                        }
                        if (currentT > 1.0) {
                            currentT = 1.0;
                            needNewSegment = true;
                        }
                        p1 = Path_1.Path.getPointOnQuadraticBezier(currentT, pathCmd.start.x, pathCmd.start.y, pathCmd.points[0], pathCmd.points[1], pathCmd.points[2], pathCmd.points[3]);
                        break;
                }
                if (p1 !== undefined) {
                    currLen = Path_1.Path.getLineLength(p0.x, p0.y, p1.x, p1.y);
                }
                if (needNewSegment) {
                    needNewSegment = false;
                    pathCmd = undefined;
                }
            }
        };
        var testChar = 'C';
        var glyphWidth = that._getTextSize(testChar).width + letterSpacing;
        var lettersInOffset = offset / glyphWidth - 1;
        for (var k = 0; k < lettersInOffset; k++) {
            findSegmentToFitCharacter(testChar);
            if (p0 === undefined || p1 === undefined) {
                break;
            }
            p0 = p1;
        }
        for (var i = 0; i < charArr.length; i++) {
            findSegmentToFitCharacter(charArr[i]);
            if (p0 === undefined || p1 === undefined) {
                break;
            }
            var width = Path_1.Path.getLineLength(p0.x, p0.y, p1.x, p1.y);
            var kern = 0;
            if (kerningFunc) {
                try {
                    kern = kerningFunc(charArr[i - 1], charArr[i]) * this.fontSize();
                }
                catch (e) {
                    kern = 0;
                }
            }
            p0.x += kern;
            p1.x += kern;
            this.textWidth += kern;
            var midpoint = Path_1.Path.getPointOnLine(kern + width / 2.0, p0.x, p0.y, p1.x, p1.y);
            var rotation = Math.atan2(p1.y - p0.y, p1.x - p0.x);
            this.glyphInfo.push({
                transposeX: midpoint.x,
                transposeY: midpoint.y,
                text: charArr[i],
                rotation: rotation,
                p0: p0,
                p1: p1,
            });
            p0 = p1;
        }
    };
    TextPath.prototype.getSelfRect = function () {
        if (!this.glyphInfo.length) {
            return {
                x: 0,
                y: 0,
                width: 0,
                height: 0,
            };
        }
        var points = [];
        this.glyphInfo.forEach(function (info) {
            points.push(info.p0.x);
            points.push(info.p0.y);
            points.push(info.p1.x);
            points.push(info.p1.y);
        });
        var minX = points[0] || 0;
        var maxX = points[0] || 0;
        var minY = points[1] || 0;
        var maxY = points[1] || 0;
        var x, y;
        for (var i = 0; i < points.length / 2; i++) {
            x = points[i * 2];
            y = points[i * 2 + 1];
            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);
        }
        var fontSize = this.fontSize();
        return {
            x: minX - fontSize / 2,
            y: minY - fontSize / 2,
            width: maxX - minX + fontSize,
            height: maxY - minY + fontSize,
        };
    };
    return TextPath;
}(Shape_1.Shape));
exports.TextPath = TextPath;
TextPath.prototype._fillFunc = _fillFunc;
TextPath.prototype._strokeFunc = _strokeFunc;
TextPath.prototype._fillFuncHit = _fillFunc;
TextPath.prototype._strokeFuncHit = _strokeFunc;
TextPath.prototype.className = 'TextPath';
TextPath.prototype._attrsAffectingSize = ['text', 'fontSize', 'data'];
Global_1._registerNode(TextPath);
Factory_1.Factory.addGetterSetter(TextPath, 'data');
Factory_1.Factory.addGetterSetter(TextPath, 'fontFamily', 'Arial');
Factory_1.Factory.addGetterSetter(TextPath, 'fontSize', 12, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(TextPath, 'fontStyle', NORMAL);
Factory_1.Factory.addGetterSetter(TextPath, 'align', 'left');
Factory_1.Factory.addGetterSetter(TextPath, 'letterSpacing', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(TextPath, 'textBaseline', 'middle');
Factory_1.Factory.addGetterSetter(TextPath, 'fontVariant', NORMAL);
Factory_1.Factory.addGetterSetter(TextPath, 'text', EMPTY_STRING);
Factory_1.Factory.addGetterSetter(TextPath, 'textDecoration', null);
Factory_1.Factory.addGetterSetter(TextPath, 'kerningFunc', null);
Util_1.Collection.mapMethods(TextPath);

},{"../Factory":9,"../Global":11,"../Shape":16,"../Util":19,"../Validators":20,"./Path":50,"./Text":56}],58:[function(_dereq_,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = _dereq_("../Util");
var Factory_1 = _dereq_("../Factory");
var Node_1 = _dereq_("../Node");
var Shape_1 = _dereq_("../Shape");
var Rect_1 = _dereq_("./Rect");
var Group_1 = _dereq_("../Group");
var Global_1 = _dereq_("../Global");
var Validators_1 = _dereq_("../Validators");
var Global_2 = _dereq_("../Global");
var EVENTS_NAME = 'tr-konva';
var ATTR_CHANGE_LIST = [
    'resizeEnabledChange',
    'rotateAnchorOffsetChange',
    'rotateEnabledChange',
    'enabledAnchorsChange',
    'anchorSizeChange',
    'borderEnabledChange',
    'borderStrokeChange',
    'borderStrokeWidthChange',
    'borderDashChange',
    'anchorStrokeChange',
    'anchorStrokeWidthChange',
    'anchorFillChange',
    'anchorCornerRadiusChange',
    'ignoreStrokeChange',
]
    .map(function (e) { return e + ("." + EVENTS_NAME); })
    .join(' ');
var NODES_RECT = 'nodesRect';
var TRANSFORM_CHANGE_STR = [
    'widthChange',
    'heightChange',
    'scaleXChange',
    'scaleYChange',
    'skewXChange',
    'skewYChange',
    'rotationChange',
    'offsetXChange',
    'offsetYChange',
    'transformsEnabledChange',
    'strokeWidthChange',
]
    .map(function (e) { return e + ("." + EVENTS_NAME); })
    .join(' ');
var ANGLES = {
    'top-left': -45,
    'top-center': 0,
    'top-right': 45,
    'middle-right': -90,
    'middle-left': 90,
    'bottom-left': -135,
    'bottom-center': 180,
    'bottom-right': 135,
};
var TOUCH_DEVICE = 'ontouchstart' in Global_1.Konva._global;
function getCursor(anchorName, rad) {
    if (anchorName === 'rotater') {
        return 'crosshair';
    }
    rad += Util_1.Util._degToRad(ANGLES[anchorName] || 0);
    var angle = ((Util_1.Util._radToDeg(rad) % 360) + 360) % 360;
    if (Util_1.Util._inRange(angle, 315 + 22.5, 360) || Util_1.Util._inRange(angle, 0, 22.5)) {
        return 'ns-resize';
    }
    else if (Util_1.Util._inRange(angle, 45 - 22.5, 45 + 22.5)) {
        return 'nesw-resize';
    }
    else if (Util_1.Util._inRange(angle, 90 - 22.5, 90 + 22.5)) {
        return 'ew-resize';
    }
    else if (Util_1.Util._inRange(angle, 135 - 22.5, 135 + 22.5)) {
        return 'nwse-resize';
    }
    else if (Util_1.Util._inRange(angle, 180 - 22.5, 180 + 22.5)) {
        return 'ns-resize';
    }
    else if (Util_1.Util._inRange(angle, 225 - 22.5, 225 + 22.5)) {
        return 'nesw-resize';
    }
    else if (Util_1.Util._inRange(angle, 270 - 22.5, 270 + 22.5)) {
        return 'ew-resize';
    }
    else if (Util_1.Util._inRange(angle, 315 - 22.5, 315 + 22.5)) {
        return 'nwse-resize';
    }
    else {
        Util_1.Util.error('Transformer has unknown angle for cursor detection: ' + angle);
        return 'pointer';
    }
}
var ANCHORS_NAMES = [
    'top-left',
    'top-center',
    'top-right',
    'middle-right',
    'middle-left',
    'bottom-left',
    'bottom-center',
    'bottom-right',
];
var MAX_SAFE_INTEGER = 100000000;
function getCenter(shape) {
    return {
        x: shape.x +
            (shape.width / 2) * Math.cos(shape.rotation) +
            (shape.height / 2) * Math.sin(-shape.rotation),
        y: shape.y +
            (shape.height / 2) * Math.cos(shape.rotation) +
            (shape.width / 2) * Math.sin(shape.rotation),
    };
}
function rotateAroundPoint(shape, angleRad, point) {
    var x = point.x +
        (shape.x - point.x) * Math.cos(angleRad) -
        (shape.y - point.y) * Math.sin(angleRad);
    var y = point.y +
        (shape.x - point.x) * Math.sin(angleRad) +
        (shape.y - point.y) * Math.cos(angleRad);
    return __assign(__assign({}, shape), { rotation: shape.rotation + angleRad, x: x,
        y: y });
}
function rotateAroundCenter(shape, deltaRad) {
    var center = getCenter(shape);
    return rotateAroundPoint(shape, deltaRad, center);
}
function getSnap(snaps, newRotationRad, tol) {
    var snapped = newRotationRad;
    for (var i = 0; i < snaps.length; i++) {
        var angle = Global_1.Konva.getAngle(snaps[i]);
        var absDiff = Math.abs(angle - newRotationRad) % (Math.PI * 2);
        var dif = Math.min(absDiff, Math.PI * 2 - absDiff);
        if (dif < tol) {
            snapped = angle;
        }
    }
    return snapped;
}
var Transformer = (function (_super) {
    __extends(Transformer, _super);
    function Transformer(config) {
        var _this = _super.call(this, config) || this;
        _this._transforming = false;
        _this._createElements();
        _this._handleMouseMove = _this._handleMouseMove.bind(_this);
        _this._handleMouseUp = _this._handleMouseUp.bind(_this);
        _this.update = _this.update.bind(_this);
        _this.on(ATTR_CHANGE_LIST, _this.update);
        if (_this.getNode()) {
            _this.update();
        }
        return _this;
    }
    Transformer.prototype.attachTo = function (node) {
        this.setNode(node);
        return this;
    };
    Transformer.prototype.setNode = function (node) {
        Util_1.Util.warn('tr.setNode(shape), tr.node(shape) and tr.attachTo(shape) methods are deprecated. Please use tr.nodes(nodesArray) instead.');
        return this.setNodes([node]);
    };
    Transformer.prototype.getNode = function () {
        return this._nodes && this._nodes[0];
    };
    Transformer.prototype.setNodes = function (nodes) {
        var _this = this;
        if (nodes === void 0) { nodes = []; }
        if (this._nodes && this._nodes.length) {
            this.detach();
        }
        this._nodes = nodes;
        if (nodes.length === 1) {
            this.rotation(nodes[0].rotation());
        }
        else {
            this.rotation(0);
        }
        this._nodes.forEach(function (node) {
            var additionalEvents = node._attrsAffectingSize
                .map(function (prop) { return prop + 'Change.' + EVENTS_NAME; })
                .join(' ');
            var onChange = function () {
                if (_this.nodes().length === 1) {
                    _this.rotation(_this.nodes()[0].rotation());
                }
                _this._resetTransformCache();
                if (!_this._transforming) {
                    _this.update();
                }
            };
            node.on(additionalEvents, onChange);
            node.on(TRANSFORM_CHANGE_STR, onChange);
            node.on("_clearTransformCache." + EVENTS_NAME, onChange);
            node.on("xChange." + EVENTS_NAME + " yChange." + EVENTS_NAME, onChange);
            _this._proxyDrag(node);
        });
        this._resetTransformCache();
        var elementsCreated = !!this.findOne('.top-left');
        if (elementsCreated) {
            this.update();
        }
        return this;
    };
    Transformer.prototype._proxyDrag = function (node) {
        var _this = this;
        var lastPos;
        node.on("dragstart." + EVENTS_NAME, function (e) {
            lastPos = node.getAbsolutePosition();
            if (!_this.isDragging() && node !== _this.findOne('.back')) {
                _this.startDrag(e, false);
            }
        });
        node.on("dragmove." + EVENTS_NAME, function (e) {
            if (!lastPos) {
                return;
            }
            var abs = node.getAbsolutePosition();
            var dx = abs.x - lastPos.x;
            var dy = abs.y - lastPos.y;
            _this.nodes().forEach(function (otherNode) {
                if (otherNode === node) {
                    return;
                }
                if (otherNode.isDragging()) {
                    return;
                }
                var otherAbs = otherNode.getAbsolutePosition();
                otherNode.setAbsolutePosition({
                    x: otherAbs.x + dx,
                    y: otherAbs.y + dy,
                });
                otherNode.startDrag(e);
            });
            lastPos = null;
        });
    };
    Transformer.prototype.getNodes = function () {
        return this._nodes || [];
    };
    Transformer.prototype.getActiveAnchor = function () {
        return this._movingAnchorName;
    };
    Transformer.prototype.detach = function () {
        if (this._nodes) {
            this._nodes.forEach(function (node) {
                node.off('.' + EVENTS_NAME);
            });
        }
        this._nodes = [];
        this._resetTransformCache();
    };
    Transformer.prototype._resetTransformCache = function () {
        this._clearCache(NODES_RECT);
        this._clearCache('transform');
        this._clearSelfAndDescendantCache('absoluteTransform');
    };
    Transformer.prototype._getNodeRect = function () {
        return this._getCache(NODES_RECT, this.__getNodeRect);
    };
    Transformer.prototype.__getNodeShape = function (node, rot, relative) {
        if (rot === void 0) { rot = this.rotation(); }
        var rect = node.getClientRect({
            skipTransform: true,
            skipShadow: true,
            skipStroke: this.ignoreStroke(),
        });
        var absScale = node.getAbsoluteScale(relative);
        var absPos = node.getAbsolutePosition(relative);
        var dx = rect.x * absScale.x - node.offsetX() * absScale.x;
        var dy = rect.y * absScale.y - node.offsetY() * absScale.y;
        var rotation = (Global_1.Konva.getAngle(node.getAbsoluteRotation()) + Math.PI * 2) %
            (Math.PI * 2);
        var box = {
            x: absPos.x + dx * Math.cos(rotation) + dy * Math.sin(-rotation),
            y: absPos.y + dy * Math.cos(rotation) + dx * Math.sin(rotation),
            width: rect.width * absScale.x,
            height: rect.height * absScale.y,
            rotation: rotation,
        };
        return rotateAroundPoint(box, -Global_1.Konva.getAngle(rot), {
            x: 0,
            y: 0,
        });
    };
    Transformer.prototype.__getNodeRect = function () {
        var _this = this;
        var node = this.getNode();
        if (!node) {
            return {
                x: -MAX_SAFE_INTEGER,
                y: -MAX_SAFE_INTEGER,
                width: 0,
                height: 0,
                rotation: 0,
            };
        }
        var totalPoints = [];
        this.nodes().map(function (node) {
            var box = node.getClientRect({
                skipTransform: true,
                skipShadow: true,
                skipStroke: _this.ignoreStroke(),
            });
            var points = [
                { x: box.x, y: box.y },
                { x: box.x + box.width, y: box.y },
                { x: box.x + box.width, y: box.y + box.height },
                { x: box.x, y: box.y + box.height },
            ];
            var trans = node.getAbsoluteTransform();
            points.forEach(function (point) {
                var transformed = trans.point(point);
                totalPoints.push(transformed);
            });
        });
        var tr = new Util_1.Transform();
        tr.rotate(-Global_1.Konva.getAngle(this.rotation()));
        var minX, minY, maxX, maxY;
        totalPoints.forEach(function (point) {
            var transformed = tr.point(point);
            if (minX === undefined) {
                minX = maxX = transformed.x;
                minY = maxY = transformed.y;
            }
            minX = Math.min(minX, transformed.x);
            minY = Math.min(minY, transformed.y);
            maxX = Math.max(maxX, transformed.x);
            maxY = Math.max(maxY, transformed.y);
        });
        tr.invert();
        var p = tr.point({ x: minX, y: minY });
        return {
            x: p.x,
            y: p.y,
            width: maxX - minX,
            height: maxY - minY,
            rotation: Global_1.Konva.getAngle(this.rotation()),
        };
    };
    Transformer.prototype.getX = function () {
        return this._getNodeRect().x;
    };
    Transformer.prototype.getY = function () {
        return this._getNodeRect().y;
    };
    Transformer.prototype.getWidth = function () {
        return this._getNodeRect().width;
    };
    Transformer.prototype.getHeight = function () {
        return this._getNodeRect().height;
    };
    Transformer.prototype._createElements = function () {
        this._createBack();
        ANCHORS_NAMES.forEach(function (name) {
            this._createAnchor(name);
        }.bind(this));
        this._createAnchor('rotater');
    };
    Transformer.prototype._createAnchor = function (name) {
        var _this = this;
        var anchor = new Rect_1.Rect({
            stroke: 'rgb(0, 161, 255)',
            fill: 'white',
            strokeWidth: 1,
            name: name + ' _anchor',
            dragDistance: 0,
            draggable: true,
            hitStrokeWidth: TOUCH_DEVICE ? 10 : 'auto',
        });
        var self = this;
        anchor.on('mousedown touchstart', function (e) {
            self._handleMouseDown(e);
        });
        anchor.on('dragstart', function (e) {
            anchor.stopDrag();
            e.cancelBubble = true;
        });
        anchor.on('dragend', function (e) {
            e.cancelBubble = true;
        });
        anchor.on('mouseenter', function () {
            var rad = Global_1.Konva.getAngle(_this.rotation());
            var cursor = getCursor(name, rad);
            anchor.getStage().content.style.cursor = cursor;
            _this._cursorChange = true;
        });
        anchor.on('mouseout', function () {
            anchor.getStage().content.style.cursor = '';
            _this._cursorChange = false;
        });
        this.add(anchor);
    };
    Transformer.prototype._createBack = function () {
        var _this = this;
        var back = new Shape_1.Shape({
            name: 'back',
            width: 0,
            height: 0,
            draggable: true,
            sceneFunc: function (ctx) {
                var tr = this.getParent();
                var padding = tr.padding();
                ctx.beginPath();
                ctx.rect(-padding, -padding, this.width() + padding * 2, this.height() + padding * 2);
                ctx.moveTo(this.width() / 2, -padding);
                if (tr.rotateEnabled()) {
                    ctx.lineTo(this.width() / 2, -tr.rotateAnchorOffset() * Util_1.Util._sign(this.height()) - padding);
                }
                ctx.fillStrokeShape(this);
            },
            hitFunc: function (ctx, shape) {
                if (!_this.shouldOverdrawWholeArea()) {
                    return;
                }
                var padding = _this.padding();
                ctx.beginPath();
                ctx.rect(-padding, -padding, shape.width() + padding * 2, shape.height() + padding * 2);
                ctx.fillStrokeShape(shape);
            },
        });
        this.add(back);
        this._proxyDrag(back);
    };
    Transformer.prototype._handleMouseDown = function (e) {
        this._movingAnchorName = e.target.name().split(' ')[0];
        var attrs = this._getNodeRect();
        var width = attrs.width;
        var height = attrs.height;
        var hypotenuse = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
        this.sin = Math.abs(height / hypotenuse);
        this.cos = Math.abs(width / hypotenuse);
        window.addEventListener('mousemove', this._handleMouseMove);
        window.addEventListener('touchmove', this._handleMouseMove);
        window.addEventListener('mouseup', this._handleMouseUp, true);
        window.addEventListener('touchend', this._handleMouseUp, true);
        this._transforming = true;
        var ap = e.target.getAbsolutePosition();
        var pos = e.target.getStage().getPointerPosition();
        this._anchorDragOffset = {
            x: pos.x - ap.x,
            y: pos.y - ap.y,
        };
        this._fire('transformstart', { evt: e, target: this.getNode() });
        this.getNode()._fire('transformstart', { evt: e, target: this.getNode() });
    };
    Transformer.prototype._handleMouseMove = function (e) {
        var x, y, newHypotenuse;
        var anchorNode = this.findOne('.' + this._movingAnchorName);
        var stage = anchorNode.getStage();
        stage.setPointersPositions(e);
        var pp = stage.getPointerPosition();
        var newNodePos = {
            x: pp.x - this._anchorDragOffset.x,
            y: pp.y - this._anchorDragOffset.y,
        };
        var oldAbs = anchorNode.getAbsolutePosition();
        anchorNode.setAbsolutePosition(newNodePos);
        var newAbs = anchorNode.getAbsolutePosition();
        if (oldAbs.x === newAbs.x && oldAbs.y === newAbs.y) {
            return;
        }
        if (this._movingAnchorName === 'rotater') {
            var attrs = this._getNodeRect();
            x = anchorNode.x() - attrs.width / 2;
            y = -anchorNode.y() + attrs.height / 2;
            var delta = Math.atan2(-y, x) + Math.PI / 2;
            if (attrs.height < 0) {
                delta -= Math.PI;
            }
            var oldRotation = Global_1.Konva.getAngle(this.rotation());
            var newRotation = oldRotation + delta;
            var tol = Global_1.Konva.getAngle(this.rotationSnapTolerance());
            var snappedRot = getSnap(this.rotationSnaps(), newRotation, tol);
            var diff = snappedRot - attrs.rotation;
            var shape = rotateAroundCenter(attrs, diff);
            this._fitNodesInto(shape, e);
            return;
        }
        var keepProportion = this.keepRatio() || e.shiftKey;
        var centeredScaling = this.centeredScaling() || e.altKey;
        if (this._movingAnchorName === 'top-left') {
            if (keepProportion) {
                var comparePoint = centeredScaling
                    ? {
                        x: this.width() / 2,
                        y: this.height() / 2,
                    }
                    : {
                        x: this.findOne('.bottom-right').x(),
                        y: this.findOne('.bottom-right').y(),
                    };
                newHypotenuse = Math.sqrt(Math.pow(comparePoint.x - anchorNode.x(), 2) +
                    Math.pow(comparePoint.y - anchorNode.y(), 2));
                var reverseX = this.findOne('.top-left').x() > comparePoint.x ? -1 : 1;
                var reverseY = this.findOne('.top-left').y() > comparePoint.y ? -1 : 1;
                x = newHypotenuse * this.cos * reverseX;
                y = newHypotenuse * this.sin * reverseY;
                this.findOne('.top-left').x(comparePoint.x - x);
                this.findOne('.top-left').y(comparePoint.y - y);
            }
        }
        else if (this._movingAnchorName === 'top-center') {
            this.findOne('.top-left').y(anchorNode.y());
        }
        else if (this._movingAnchorName === 'top-right') {
            if (keepProportion) {
                var comparePoint = centeredScaling
                    ? {
                        x: this.width() / 2,
                        y: this.height() / 2,
                    }
                    : {
                        x: this.findOne('.bottom-left').x(),
                        y: this.findOne('.bottom-left').y(),
                    };
                newHypotenuse = Math.sqrt(Math.pow(anchorNode.x() - comparePoint.x, 2) +
                    Math.pow(comparePoint.y - anchorNode.y(), 2));
                var reverseX = this.findOne('.top-right').x() < comparePoint.x ? -1 : 1;
                var reverseY = this.findOne('.top-right').y() > comparePoint.y ? -1 : 1;
                x = newHypotenuse * this.cos * reverseX;
                y = newHypotenuse * this.sin * reverseY;
                this.findOne('.top-right').x(comparePoint.x + x);
                this.findOne('.top-right').y(comparePoint.y - y);
            }
            var pos = anchorNode.position();
            this.findOne('.top-left').y(pos.y);
            this.findOne('.bottom-right').x(pos.x);
        }
        else if (this._movingAnchorName === 'middle-left') {
            this.findOne('.top-left').x(anchorNode.x());
        }
        else if (this._movingAnchorName === 'middle-right') {
            this.findOne('.bottom-right').x(anchorNode.x());
        }
        else if (this._movingAnchorName === 'bottom-left') {
            if (keepProportion) {
                var comparePoint = centeredScaling
                    ? {
                        x: this.width() / 2,
                        y: this.height() / 2,
                    }
                    : {
                        x: this.findOne('.top-right').x(),
                        y: this.findOne('.top-right').y(),
                    };
                newHypotenuse = Math.sqrt(Math.pow(comparePoint.x - anchorNode.x(), 2) +
                    Math.pow(anchorNode.y() - comparePoint.y, 2));
                var reverseX = comparePoint.x < anchorNode.x() ? -1 : 1;
                var reverseY = anchorNode.y() < comparePoint.y ? -1 : 1;
                x = newHypotenuse * this.cos * reverseX;
                y = newHypotenuse * this.sin * reverseY;
                anchorNode.x(comparePoint.x - x);
                anchorNode.y(comparePoint.y + y);
            }
            pos = anchorNode.position();
            this.findOne('.top-left').x(pos.x);
            this.findOne('.bottom-right').y(pos.y);
        }
        else if (this._movingAnchorName === 'bottom-center') {
            this.findOne('.bottom-right').y(anchorNode.y());
        }
        else if (this._movingAnchorName === 'bottom-right') {
            if (keepProportion) {
                var comparePoint = centeredScaling
                    ? {
                        x: this.width() / 2,
                        y: this.height() / 2,
                    }
                    : {
                        x: this.findOne('.top-left').x(),
                        y: this.findOne('.top-left').y(),
                    };
                newHypotenuse = Math.sqrt(Math.pow(anchorNode.x() - comparePoint.x, 2) +
                    Math.pow(anchorNode.y() - comparePoint.y, 2));
                var reverseX = this.findOne('.bottom-right').x() < comparePoint.x ? -1 : 1;
                var reverseY = this.findOne('.bottom-right').y() < comparePoint.y ? -1 : 1;
                x = newHypotenuse * this.cos * reverseX;
                y = newHypotenuse * this.sin * reverseY;
                this.findOne('.bottom-right').x(comparePoint.x + x);
                this.findOne('.bottom-right').y(comparePoint.y + y);
            }
        }
        else {
            console.error(new Error('Wrong position argument of selection resizer: ' +
                this._movingAnchorName));
        }
        var centeredScaling = this.centeredScaling() || e.altKey;
        if (centeredScaling) {
            var topLeft = this.findOne('.top-left');
            var bottomRight = this.findOne('.bottom-right');
            var topOffsetX = topLeft.x();
            var topOffsetY = topLeft.y();
            var bottomOffsetX = this.getWidth() - bottomRight.x();
            var bottomOffsetY = this.getHeight() - bottomRight.y();
            bottomRight.move({
                x: -topOffsetX,
                y: -topOffsetY,
            });
            topLeft.move({
                x: bottomOffsetX,
                y: bottomOffsetY,
            });
        }
        var absPos = this.findOne('.top-left').getAbsolutePosition();
        x = absPos.x;
        y = absPos.y;
        var width = this.findOne('.bottom-right').x() - this.findOne('.top-left').x();
        var height = this.findOne('.bottom-right').y() - this.findOne('.top-left').y();
        this._fitNodesInto({
            x: x,
            y: y,
            width: width,
            height: height,
            rotation: Global_1.Konva.getAngle(this.rotation()),
        }, e);
    };
    Transformer.prototype._handleMouseUp = function (e) {
        this._removeEvents(e);
    };
    Transformer.prototype.getAbsoluteTransform = function () {
        return this.getTransform();
    };
    Transformer.prototype._removeEvents = function (e) {
        if (this._transforming) {
            this._transforming = false;
            window.removeEventListener('mousemove', this._handleMouseMove);
            window.removeEventListener('touchmove', this._handleMouseMove);
            window.removeEventListener('mouseup', this._handleMouseUp, true);
            window.removeEventListener('touchend', this._handleMouseUp, true);
            var node = this.getNode();
            this._fire('transformend', { evt: e, target: node });
            if (node) {
                node.fire('transformend', { evt: e, target: node });
            }
            this._movingAnchorName = null;
        }
    };
    Transformer.prototype._fitNodesInto = function (newAttrs, evt) {
        var _this = this;
        var oldAttrs = this._getNodeRect();
        var minSize = 1;
        if (Util_1.Util._inRange(newAttrs.width, -this.padding() * 2 - minSize, minSize)) {
            this.update();
            return;
        }
        if (Util_1.Util._inRange(newAttrs.height, -this.padding() * 2 - minSize, minSize)) {
            this.update();
            return;
        }
        var allowNegativeScale = true;
        var t = new Util_1.Transform();
        t.rotate(Global_1.Konva.getAngle(this.rotation()));
        if (this._movingAnchorName &&
            newAttrs.width < 0 &&
            this._movingAnchorName.indexOf('left') >= 0) {
            var offset = t.point({
                x: -this.padding() * 2,
                y: 0,
            });
            newAttrs.x += offset.x;
            newAttrs.y += offset.y;
            newAttrs.width += this.padding() * 2;
            this._movingAnchorName = this._movingAnchorName.replace('left', 'right');
            this._anchorDragOffset.x -= offset.x;
            this._anchorDragOffset.y -= offset.y;
            if (!allowNegativeScale) {
                this.update();
                return;
            }
        }
        else if (this._movingAnchorName &&
            newAttrs.width < 0 &&
            this._movingAnchorName.indexOf('right') >= 0) {
            var offset = t.point({
                x: this.padding() * 2,
                y: 0,
            });
            this._movingAnchorName = this._movingAnchorName.replace('right', 'left');
            this._anchorDragOffset.x -= offset.x;
            this._anchorDragOffset.y -= offset.y;
            newAttrs.width += this.padding() * 2;
            if (!allowNegativeScale) {
                this.update();
                return;
            }
        }
        if (this._movingAnchorName &&
            newAttrs.height < 0 &&
            this._movingAnchorName.indexOf('top') >= 0) {
            var offset = t.point({
                x: 0,
                y: -this.padding() * 2,
            });
            newAttrs.x += offset.x;
            newAttrs.y += offset.y;
            this._movingAnchorName = this._movingAnchorName.replace('top', 'bottom');
            this._anchorDragOffset.x -= offset.x;
            this._anchorDragOffset.y -= offset.y;
            newAttrs.height += this.padding() * 2;
            if (!allowNegativeScale) {
                this.update();
                return;
            }
        }
        else if (this._movingAnchorName &&
            newAttrs.height < 0 &&
            this._movingAnchorName.indexOf('bottom') >= 0) {
            var offset = t.point({
                x: 0,
                y: this.padding() * 2,
            });
            this._movingAnchorName = this._movingAnchorName.replace('bottom', 'top');
            this._anchorDragOffset.x -= offset.x;
            this._anchorDragOffset.y -= offset.y;
            newAttrs.height += this.padding() * 2;
            if (!allowNegativeScale) {
                this.update();
                return;
            }
        }
        if (this.boundBoxFunc()) {
            var bounded = this.boundBoxFunc()(oldAttrs, newAttrs);
            if (bounded) {
                newAttrs = bounded;
            }
            else {
                Util_1.Util.warn('boundBoxFunc returned falsy. You should return new bound rect from it!');
            }
        }
        var baseSize = 10000000;
        var oldTr = new Util_1.Transform();
        oldTr.translate(oldAttrs.x, oldAttrs.y);
        oldTr.rotate(oldAttrs.rotation);
        oldTr.scale(oldAttrs.width / baseSize, oldAttrs.height / baseSize);
        var newTr = new Util_1.Transform();
        newTr.translate(newAttrs.x, newAttrs.y);
        newTr.rotate(newAttrs.rotation);
        newTr.scale(newAttrs.width / baseSize, newAttrs.height / baseSize);
        var delta = newTr.multiply(oldTr.invert());
        this._nodes.forEach(function (node) {
            var parentTransform = node.getParent().getAbsoluteTransform();
            var localTransform = node.getTransform().copy();
            localTransform.translate(node.offsetX(), node.offsetY());
            var newLocalTransform = new Util_1.Transform();
            newLocalTransform
                .multiply(parentTransform.copy().invert())
                .multiply(delta)
                .multiply(parentTransform)
                .multiply(localTransform);
            var attrs = newLocalTransform.decompose();
            node.setAttrs(attrs);
            _this._fire('transform', { evt: evt, target: node });
            node._fire('transform', { evt: evt, target: node });
        });
        this.rotation(Util_1.Util._getRotation(newAttrs.rotation));
        this._resetTransformCache();
        this.update();
        this.getLayer().batchDraw();
    };
    Transformer.prototype.forceUpdate = function () {
        this._resetTransformCache();
        this.update();
    };
    Transformer.prototype._batchChangeChild = function (selector, attrs) {
        var anchor = this.findOne(selector);
        anchor.setAttrs(attrs);
    };
    Transformer.prototype.update = function () {
        var _this = this;
        var attrs = this._getNodeRect();
        this.rotation(Util_1.Util._getRotation(attrs.rotation));
        var width = attrs.width;
        var height = attrs.height;
        var enabledAnchors = this.enabledAnchors();
        var resizeEnabled = this.resizeEnabled();
        var padding = this.padding();
        var anchorSize = this.anchorSize();
        this.find('._anchor').each(function (node) {
            node.setAttrs({
                width: anchorSize,
                height: anchorSize,
                offsetX: anchorSize / 2,
                offsetY: anchorSize / 2,
                stroke: _this.anchorStroke(),
                strokeWidth: _this.anchorStrokeWidth(),
                fill: _this.anchorFill(),
                cornerRadius: _this.anchorCornerRadius(),
            });
        });
        this._batchChangeChild('.top-left', {
            x: 0,
            y: 0,
            offsetX: anchorSize / 2 + padding,
            offsetY: anchorSize / 2 + padding,
            visible: resizeEnabled && enabledAnchors.indexOf('top-left') >= 0,
        });
        this._batchChangeChild('.top-center', {
            x: width / 2,
            y: 0,
            offsetY: anchorSize / 2 + padding,
            visible: resizeEnabled && enabledAnchors.indexOf('top-center') >= 0,
        });
        this._batchChangeChild('.top-right', {
            x: width,
            y: 0,
            offsetX: anchorSize / 2 - padding,
            offsetY: anchorSize / 2 + padding,
            visible: resizeEnabled && enabledAnchors.indexOf('top-right') >= 0,
        });
        this._batchChangeChild('.middle-left', {
            x: 0,
            y: height / 2,
            offsetX: anchorSize / 2 + padding,
            visible: resizeEnabled && enabledAnchors.indexOf('middle-left') >= 0,
        });
        this._batchChangeChild('.middle-right', {
            x: width,
            y: height / 2,
            offsetX: anchorSize / 2 - padding,
            visible: resizeEnabled && enabledAnchors.indexOf('middle-right') >= 0,
        });
        this._batchChangeChild('.bottom-left', {
            x: 0,
            y: height,
            offsetX: anchorSize / 2 + padding,
            offsetY: anchorSize / 2 - padding,
            visible: resizeEnabled && enabledAnchors.indexOf('bottom-left') >= 0,
        });
        this._batchChangeChild('.bottom-center', {
            x: width / 2,
            y: height,
            offsetY: anchorSize / 2 - padding,
            visible: resizeEnabled && enabledAnchors.indexOf('bottom-center') >= 0,
        });
        this._batchChangeChild('.bottom-right', {
            x: width,
            y: height,
            offsetX: anchorSize / 2 - padding,
            offsetY: anchorSize / 2 - padding,
            visible: resizeEnabled && enabledAnchors.indexOf('bottom-right') >= 0,
        });
        this._batchChangeChild('.rotater', {
            x: width / 2,
            y: -this.rotateAnchorOffset() * Util_1.Util._sign(height) - padding,
            visible: this.rotateEnabled(),
        });
        this._batchChangeChild('.back', {
            width: width,
            height: height,
            visible: this.borderEnabled(),
            stroke: this.borderStroke(),
            strokeWidth: this.borderStrokeWidth(),
            dash: this.borderDash(),
            x: 0,
            y: 0,
        });
    };
    Transformer.prototype.isTransforming = function () {
        return this._transforming;
    };
    Transformer.prototype.stopTransform = function () {
        if (this._transforming) {
            this._removeEvents();
            var anchorNode = this.findOne('.' + this._movingAnchorName);
            if (anchorNode) {
                anchorNode.stopDrag();
            }
        }
    };
    Transformer.prototype.destroy = function () {
        if (this.getStage() && this._cursorChange) {
            this.getStage().content.style.cursor = '';
        }
        Group_1.Group.prototype.destroy.call(this);
        this.detach();
        this._removeEvents();
        return this;
    };
    Transformer.prototype.toObject = function () {
        return Node_1.Node.prototype.toObject.call(this);
    };
    return Transformer;
}(Group_1.Group));
exports.Transformer = Transformer;
function validateAnchors(val) {
    if (!(val instanceof Array)) {
        Util_1.Util.warn('enabledAnchors value should be an array');
    }
    if (val instanceof Array) {
        val.forEach(function (name) {
            if (ANCHORS_NAMES.indexOf(name) === -1) {
                Util_1.Util.warn('Unknown anchor name: ' +
                    name +
                    '. Available names are: ' +
                    ANCHORS_NAMES.join(', '));
            }
        });
    }
    return val || [];
}
Transformer.prototype.className = 'Transformer';
Global_2._registerNode(Transformer);
Factory_1.Factory.addGetterSetter(Transformer, 'enabledAnchors', ANCHORS_NAMES, validateAnchors);
Factory_1.Factory.addGetterSetter(Transformer, 'resizeEnabled', true);
Factory_1.Factory.addGetterSetter(Transformer, 'anchorSize', 10, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Transformer, 'rotateEnabled', true);
Factory_1.Factory.addGetterSetter(Transformer, 'rotationSnaps', []);
Factory_1.Factory.addGetterSetter(Transformer, 'rotateAnchorOffset', 50, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Transformer, 'rotationSnapTolerance', 5, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Transformer, 'borderEnabled', true);
Factory_1.Factory.addGetterSetter(Transformer, 'anchorStroke', 'rgb(0, 161, 255)');
Factory_1.Factory.addGetterSetter(Transformer, 'anchorStrokeWidth', 1, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Transformer, 'anchorFill', 'white');
Factory_1.Factory.addGetterSetter(Transformer, 'anchorCornerRadius', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Transformer, 'borderStroke', 'rgb(0, 161, 255)');
Factory_1.Factory.addGetterSetter(Transformer, 'borderStrokeWidth', 1, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Transformer, 'borderDash');
Factory_1.Factory.addGetterSetter(Transformer, 'keepRatio', true);
Factory_1.Factory.addGetterSetter(Transformer, 'centeredScaling', false);
Factory_1.Factory.addGetterSetter(Transformer, 'ignoreStroke', false);
Factory_1.Factory.addGetterSetter(Transformer, 'padding', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Transformer, 'node');
Factory_1.Factory.addGetterSetter(Transformer, 'nodes');
Factory_1.Factory.addGetterSetter(Transformer, 'boundBoxFunc');
Factory_1.Factory.addGetterSetter(Transformer, 'shouldOverdrawWholeArea', false);
Factory_1.Factory.backCompat(Transformer, {
    lineEnabled: 'borderEnabled',
    rotateHandlerOffset: 'rotateAnchorOffset',
    enabledHandlers: 'enabledAnchors',
});
Util_1.Collection.mapMethods(Transformer);

},{"../Factory":9,"../Global":11,"../Group":12,"../Node":14,"../Shape":16,"../Util":19,"../Validators":20,"./Rect":51}],59:[function(_dereq_,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = _dereq_("../Util");
var Factory_1 = _dereq_("../Factory");
var Shape_1 = _dereq_("../Shape");
var Global_1 = _dereq_("../Global");
var Validators_1 = _dereq_("../Validators");
var Global_2 = _dereq_("../Global");
var Wedge = (function (_super) {
    __extends(Wedge, _super);
    function Wedge() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Wedge.prototype._sceneFunc = function (context) {
        context.beginPath();
        context.arc(0, 0, this.radius(), 0, Global_1.Konva.getAngle(this.angle()), this.clockwise());
        context.lineTo(0, 0);
        context.closePath();
        context.fillStrokeShape(this);
    };
    Wedge.prototype.getWidth = function () {
        return this.radius() * 2;
    };
    Wedge.prototype.getHeight = function () {
        return this.radius() * 2;
    };
    Wedge.prototype.setWidth = function (width) {
        this.radius(width / 2);
    };
    Wedge.prototype.setHeight = function (height) {
        this.radius(height / 2);
    };
    return Wedge;
}(Shape_1.Shape));
exports.Wedge = Wedge;
Wedge.prototype.className = 'Wedge';
Wedge.prototype._centroid = true;
Wedge.prototype._attrsAffectingSize = ['radius'];
Global_2._registerNode(Wedge);
Factory_1.Factory.addGetterSetter(Wedge, 'radius', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Wedge, 'angle', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Wedge, 'clockwise', false);
Factory_1.Factory.backCompat(Wedge, {
    angleDeg: 'angle',
    getAngleDeg: 'getAngle',
    setAngleDeg: 'setAngle'
});
Util_1.Collection.mapMethods(Wedge);

},{"../Factory":9,"../Global":11,"../Shape":16,"../Util":19,"../Validators":20}],60:[function(_dereq_,module,exports){
"use strict";

/**
 * ArrayBuffer adapter consumes binary waveform data.
 * It is used as a data abstraction layer by `WaveformData`.
 *
 * This is supposed to be the fastest adapter ever:
 * * **Pros**: working directly in memory, everything is done by reference
 *   (including the offsetting)
 * * **Cons**: binary data are hardly readable without data format knowledge
 *   (and this is why this adapter exists).
 *
 * @param {ArrayBuffer} buffer
 * @constructor
 */

function WaveformDataArrayBufferAdapter(buffer) {
  this._data = new DataView(buffer);
  this._offset = this.version === 2 ? 24 : 20;
}

/**
 * Detects if a set of data is suitable for the ArrayBuffer adapter.
 * It is used internally by `WaveformData.create` so you should not bother using it.
 *
 * @static
 * @param {Mixed} data
 * @returns {boolean}
 */

WaveformDataArrayBufferAdapter.isCompatible = function isCompatible(data) {
  var isCompatible = data && typeof data === "object" && "byteLength" in data;

  if (isCompatible) {
    var view = new DataView(data);
    var version = view.getInt32(0, true);

    if (version !== 1 && version !== 2) {
      throw new TypeError("This waveform data version not supported.");
    }
  }

  return isCompatible;
};

/**
 * @namespace WaveformDataArrayBufferAdapter
 */

 WaveformDataArrayBufferAdapter.prototype = {
  /**
   * Returns the data format version number.
   *
   * @return {Integer} Version number of the consumed data format.
   */

  get version() {
    return this._data.getInt32(0, true);
  },

  /**
   * Returns the number of bits per sample, either 8 or 16.
   */

  get bits() {
    var bits = Boolean(this._data.getUint32(4, true));

    return bits ? 8 : 16;
  },

  /**
   * Returns the number of channels.
   *
   * @return {Integer} Number of channels.
   */

  get channels() {
    if (this.version === 2) {
      return this._data.getInt32(20, true);
    }
    else {
      return 1;
    }
  },

  /**
   * Returns the number of samples per second.
   *
   * @return {Integer} Number of samples per second.
   */

  get sample_rate() {
    return this._data.getInt32(8, true);
  },

  /**
   * Returns the scale (number of samples per pixel).
   *
   * @return {Integer} Number of samples per pixel.
   */

  get scale() {
    return this._data.getInt32(12, true);
  },

  /**
   * Returns the length of the waveform data (number of data points).
   *
   * @return {Integer} Length of the waveform data.
   */

  get length() {
    return this._data.getUint32(16, true);
  },

  /**
   * Returns a value at a specific offset.
   *
   * @param {Integer} index
   * @return {Integer} waveform value
   */

  at: function at_sample(index) {
    return this._data.getInt8(this._offset + index);
  },

  /**
   * Returns a new ArrayBuffer with the concatenated waveform.
   * All waveforms must have identical metadata (version, channels, etc)
   *
   * @param {...WaveformDataArrayBufferAdapter} otherAdapters One or more adapters to concatenate
   * @return {ArrayBuffer} concatenated ArrayBuffer
   */

  concatBuffers: function() {
    var otherAdapters = Array.prototype.slice.call(arguments);
    var headerSize = this._offset;
    var totalSize = headerSize;
    var totalDataLength = 0;
    var bufferCollection = [this].concat(otherAdapters).map(function(w) {
      return w._data.buffer;
    });
    var i, buffer;

    for (i = 0; i < bufferCollection.length; i++) {
      buffer = bufferCollection[i];
      var dataSize = new DataView(buffer).getInt32(16, true);

      totalSize += buffer.byteLength - headerSize;
      totalDataLength += dataSize;
    }

    var totalBuffer = new ArrayBuffer(totalSize);
    var sourceHeader = new DataView(bufferCollection[0]);
    var totalBufferView = new DataView(totalBuffer);

    // Copy the header from the first chunk
    for (i = 0; i < headerSize; i++) {
      totalBufferView.setUint8(i, sourceHeader.getUint8(i));
    }
    // Rewrite the data-length header item to reflect all of the samples concatenated together
    totalBufferView.setInt32(16, totalDataLength, true);

    var offset = 0;
    var dataOfTotalBuffer = new Uint8Array(totalBuffer, headerSize);

    for (i = 0; i < bufferCollection.length; i++) {
      buffer = bufferCollection[i];
      dataOfTotalBuffer.set(new Uint8Array(buffer, headerSize), offset);
      offset += buffer.byteLength - headerSize;
    }

    return totalBuffer;
  }
};

module.exports = WaveformDataArrayBufferAdapter;

},{}],61:[function(_dereq_,module,exports){
"use strict";

/**
 * Object adapter consumes waveform data in JSON format.
 * It is used as a data abstraction layer by `WaveformData`.
 *
 * This is supposed to be a fallback for browsers not supporting ArrayBuffer:
 * * **Pros**: easy to debug and quite self describing.
 * * **Cons**: slower than ArrayBuffer, more memory consumption.
 *
 * @param {Object} data Waveform data object
 * @constructor
 */

function WaveformDataObjectAdapter(data) {
  this._data = data;
}

/**
 * Detects if a set of data is suitable for the Object adapter.
 * It is used internally by `WaveformData.create` so you should not bother using it.
 *
 * @static
 * @param {Mixed} data
 * @returns {boolean}
 */

WaveformDataObjectAdapter.isCompatible = function isCompatible(data) {
  return data &&
    typeof data === "object" &&
    "sample_rate" in data &&
    "samples_per_pixel" in data &&
    "bits" in data &&
    "length" in data &&
    "data" in data;
};

/**
 * @namespace WaveformDataObjectAdapter
 */

WaveformDataObjectAdapter.prototype = {
  /**
   * Returns the data format version number.
   *
   * @return {Integer} Version number of the consumed data format.
   */

  get version() {
    return this._data.version || 1;
  },

  /**
   * Returns the number of bits per sample, either 8 or 16.
   */

  get bits() {
    return this._data.bits;
  },

  /**
   * Returns the number of channels.
   *
   * @return {Integer} Number of channels.
   */

  get channels() {
    return this._data.channels || 1;
  },

  /**
   * Returns the number of samples per second.
   *
   * @return {Integer} Number of samples per second.
   */

  get sample_rate() {
    return this._data.sample_rate;
  },

  /**
   * Returns the scale (number of samples per pixel).
   *
   * @return {Integer} Number of samples per pixel.
   */

  get scale() {
    return this._data.samples_per_pixel;
  },

  /**
   * Returns the length of the waveform data (number of data points).
   *
   * @return {Integer} Length of the waveform data.
   */

  get length() {
    return this._data.length;
  },

  /**
   * Returns a value at a specific offset.
   *
   * @param {Integer} index
   * @return {number} waveform value
   */

  at: function at_sample(index) {
    var data = this._data.data;

    if (index >= 0 && index < data.length) {
      return data[index];
    }
    else {
      throw new RangeError("Invalid index: " + index);
    }
  },

  /**
   * Returns a new data object with the concatenated waveform.
   * Both waveforms must have identical metadata (version, channels, etc)
   *
   * @param {...WaveformDataObjectAdapter} otherAdapters One or more adapters
   * @return {Mixed} combined waveform data
   */

  concatBuffers: function() {
    var otherAdapters = Array.prototype.slice.call(arguments);
    var otherDatas = otherAdapters.map(function(a) {
      return a._data.data;
    });
    var result = Object.assign({}, this._data);

    result.data = result.data.concat.apply(result.data, otherDatas);
    result.length += otherAdapters.reduce(function(sum, adapter) {
      return sum + adapter.length;
    }, 0);
    return result;
  }
};

module.exports = WaveformDataObjectAdapter;

},{}],62:[function(_dereq_,module,exports){
"use strict";

var WaveformData = _dereq_("../core");
var InlineWorker = _dereq_("inline-worker");

function processWorker(workerArgs, callback) {
  var worker = new InlineWorker(function() {
    var INT8_MAX = 127;
    var INT8_MIN = -128;

    function calculateWaveformDataLength(audio_sample_count, scale) {
      var data_length = Math.floor(audio_sample_count / scale);

      var samples_remaining = audio_sample_count - (data_length * scale);

      if (samples_remaining > 0) {
        data_length++;
      }

      return data_length;
    }

    this.addEventListener("message", function listener(evt) {
      var scale = evt.data.scale;
      var amplitude_scale = evt.data.amplitude_scale;
      var split_channels = evt.data.split_channels;
      var audio_buffer = evt.data.audio_buffer;

      var channels = audio_buffer.channels;
      var output_channels = split_channels ? channels.length : 1;
      var version = output_channels === 1 ? 1 : 2;
      var header_size = version === 1 ? 20 : 24;
      var data_length = calculateWaveformDataLength(audio_buffer.length, scale);
      var total_size = header_size + data_length * 2 * output_channels;
      var data_object = new DataView(new ArrayBuffer(total_size));

      var scale_counter = 0;
      var buffer_length = audio_buffer.length;
      var offset = header_size;
      var channel, i;

      var min_value = new Array(output_channels);
      var max_value = new Array(output_channels);

      for (channel = 0; channel < output_channels; channel++) {
        min_value[channel] = Infinity;
        max_value[channel] = -Infinity;
      }

      data_object.setInt32(0, version, true); // Version
      data_object.setUint32(4, 1, true); // Is 8 bit?
      data_object.setInt32(8, audio_buffer.sampleRate, true); // Sample rate
      data_object.setInt32(12, scale, true); // Scale
      data_object.setInt32(16, data_length, true); // Length

      if (version === 2) {
        data_object.setInt32(20, output_channels, true);
      }

      for (i = 0; i < buffer_length; i++) {
        var sample = 0;

        if (output_channels === 1) {
          for (channel = 0; channel < channels.length; ++channel) {
            sample += channels[channel][i];
          }

          sample = Math.floor(INT8_MAX * sample * amplitude_scale / channels.length);

          if (sample < min_value[0]) {
            min_value[0] = sample;

            if (min_value[0] < INT8_MIN) {
              min_value[0] = INT8_MIN;
            }
          }

          if (sample > max_value[0]) {
            max_value[0] = sample;

            if (max_value[0] > INT8_MAX) {
              max_value[0] = INT8_MAX;
            }
          }
        }
        else {
          for (channel = 0; channel < output_channels; ++channel) {
            sample = Math.floor(INT8_MAX * channels[channel][i] * amplitude_scale);

            if (sample < min_value[channel]) {
              min_value[channel] = sample;

              if (min_value[channel] < INT8_MIN) {
                min_value[channel] = INT8_MIN;
              }
            }

            if (sample > max_value[channel]) {
              max_value[channel] = sample;

              if (max_value[channel] > INT8_MAX) {
                max_value[channel] = INT8_MAX;
              }
            }
          }
        }

        if (++scale_counter === scale) {
          for (channel = 0; channel < output_channels; channel++) {
            data_object.setInt8(offset++, min_value[channel]);
            data_object.setInt8(offset++, max_value[channel]);

            min_value[channel] = Infinity;
            max_value[channel] = -Infinity;
          }

          scale_counter = 0;
        }
      }

      if (scale_counter > 0) {
        for (channel = 0; channel < output_channels; channel++) {
          data_object.setInt8(offset++, min_value[channel]);
          data_object.setInt8(offset++, max_value[channel]);
        }
      }

      this.postMessage(data_object);
      this.removeEventListener("message", listener);
      this.close();
    });
  });

  worker.addEventListener("message", function listener(evt) {
    callback(evt.data);
    // We're only sending a single message to each listener, so
    // remove the callback afterwards to avoid leaks.
    worker.removeEventListener("message", listener);
  });

  worker.postMessage(workerArgs);
}

/**
 * This callback is executed once the audio has been decoded by the browser and
 * resampled by waveform-data.
 *
 * @callback onAudioResampled
 * @param {Error?}
 * @param {WaveformData} waveform_data Waveform instance of the browser decoded audio
 * @param {AudioBuffer} audio_buffer Decoded audio buffer
 */

/**
 * AudioBuffer-based WaveformData generator
 *
 * Adapted from BlockFile::CalcSummary in Audacity, with permission.
 * @see https://code.google.com/p/audacity/source/browse/audacity-src/trunk/src/BlockFile.cpp
 *
 * @param {Object.<{scale: Number, amplitude_scale: Number, split_channels: Boolean}>} options
 * @param {onAudioResampled} callback
 * @returns {Function.<AudioBuffer>}
 */

function getAudioDecoder(options, callback) {
  return function onAudioDecoded(audio_buffer) {
    // Construct a simple object with the necessary AudioBuffer data,
    // as we cannot send an AudioBuffer to a Web Worker.
    var audio_buffer_obj = {
      length: audio_buffer.length,
      sampleRate: audio_buffer.sampleRate,
      channels: []
    };

    // Fill in the channels data.
    for (var channel = 0; channel < audio_buffer.numberOfChannels; ++channel) {
      audio_buffer_obj.channels[channel] = audio_buffer.getChannelData(channel);
    }

    var worker_args = {
      scale: options.scale,
      amplitude_scale: options.amplitude_scale,
      split_channels: options.split_channels,
      audio_buffer: audio_buffer_obj
    };

    processWorker(worker_args, function(data_object) {
      callback(null, new WaveformData(data_object.buffer), audio_buffer);
    });
  };
}

module.exports = getAudioDecoder;

},{"../core":66,"inline-worker":3}],63:[function(_dereq_,module,exports){
"use strict";

var defaultOptions = {
  scale: 512,
  amplitude_scale: 1.0,
  split_channels: false
};

function getOptions(options) {
  if (Object.prototype.hasOwnProperty.call(options, "scale_adjuster")) {
    throw new Error("Please rename the 'scale_adjuster' option to 'amplitude_scale'");
  }

  var opts = {
    scale: options.scale || defaultOptions.scale,
    amplitude_scale: options.amplitude_scale || defaultOptions.amplitude_scale,
    split_channels: options.split_channels || defaultOptions.split_channels
  };

  return opts;
}

module.exports = getOptions;

},{}],64:[function(_dereq_,module,exports){
"use strict";

var getAudioDecoder = _dereq_("./audiodecoder");
var getOptions = _dereq_("./options");

function createFromArrayBuffer(audioContext, audioData, options, callback) {
  // The following function is a workaround for a Webkit bug where decodeAudioData
  // invokes the errorCallback with null instead of a DOMException.
  // See https://webaudio.github.io/web-audio-api/#dom-baseaudiocontext-decodeaudiodata
  // and http://stackoverflow.com/q/10365335/103396

  function errorCallback(error) {
    if (!error) {
      error = new DOMException("EncodingError");
    }

    callback(error);
  }

  audioContext.decodeAudioData(
    audioData,
    getAudioDecoder(options, callback),
    errorCallback
  );
}

function createFromAudioBuffer(audioBuffer, options, callback) {
  var audioDecoder = getAudioDecoder(options, callback);

  return audioDecoder(audioBuffer);
}

/**
 * Creates a working WaveformData based on binary audio data.
 *
 * This is still quite experimental and the result will mostly depend on the
 * level of browser support.
 *
 * ```javascript
 * const xhr = new XMLHttpRequest();
 * const audioContext = new AudioContext();
 *
 * // URL of a CORS MP3/Ogg file
 * xhr.open('GET', 'https://example.com/audio/track.ogg');
 * xhr.responseType = 'arraybuffer';
 *
 * xhr.addEventListener('load', function(progressEvent) {
 *   WaveformData.createFromAudio(audioContext, progressEvent.target.response,
 *     function(err, waveform) {
 *     if (err) {
 *       console.error(err);
 *       return;
 *     }
 *
 *     console.log(waveform.duration);
 *   });
 * });
 *
 * xhr.send();
 * ```
 *
 * @todo Use `SourceBuffer.appendBuffer` and `ProgressEvent` to stream the decoding?
 * @param {AudioContext|webkitAudioContext} audio_context
 * @param {ArrayBuffer} audio_data
 * @param {callback} what to do once the decoding is done
 * @constructor
 */

function createFromAudio(options, callback) {
  var opts = getOptions(options);

  if (options.audio_context && options.array_buffer) {
    return createFromArrayBuffer(options.audio_context, options.array_buffer, opts, callback);
  }
  else if (options.audio_buffer) {
    return createFromAudioBuffer(options.audio_buffer, opts, callback);
  }
  else {
    throw new TypeError("Please pass either an AudioContext and ArrayBuffer, or an AudioBuffer object");
  }
}

module.exports = createFromAudio;

},{"./audiodecoder":62,"./options":63}],65:[function(_dereq_,module,exports){
"use strict";

/**
 * Provides access to the waveform data for a single audio channel.
 *
 * @param {WaveformData} waveformData Waveform data.
 * @param {Number} channelIndex Channel number.
 * @constructor
 */

function WaveformDataChannel(waveformData, channelIndex) {
  this._waveformData = waveformData;
  this._channelIndex = channelIndex;
}

/**
 * Returns a min value for a specific offset.
 *
 * ```javascript
 * var waveform = WaveformData.create({ ... });
 * var channel = waveform.channel(0);
 *
 * console.log(channel.min_sample(10)); // -> -12
 * ```
 *
 * @api
 * @param {Integer} offset
 * @return {Number} Offset min value
 */

WaveformDataChannel.prototype.min_sample = function(index) {
  var offset = (index * this._waveformData.channels + this._channelIndex) * 2;

  return this._waveformData._adapter.at(offset);
};

/**
 * Returns a max value for a specific offset.
 *
 * ```javascript
 * var waveform = WaveformData.create({ ... });
 * var channel = waveform.channel(0);
 *
 * console.log(channel.max_sample(10)); // -> 12
 * ```
 *
 * @api
 * @param {Integer} offset
 * @return {Number} Offset max value
 */

WaveformDataChannel.prototype.max_sample = function(index) {
  var offset = (index * this._waveformData.channels + this._channelIndex) * 2 + 1;

  return this._waveformData._adapter.at(offset);
};

/**
 * Returns all the min values within the current offset.
 *
 * ```javascript
 * var waveform = WaveformData.create({ ... });
 * var channel = waveform.channel(0);
 *
 * console.log(channel.min_array()); // -> [-7, -5, -10]
 * ```
 *
 * @return {Array.<Integer>} Min values contained in the offset.
 */

WaveformDataChannel.prototype.min_array = function() {
  return this._waveformData._offsetValues(
    0,
    this._waveformData.length,
    this._channelIndex * 2
  );
};

/**
 * Returns all the max values within the current offset.
 *
 * ```javascript
 * var waveform = WaveformData.create({ ... });
 * var channel = waveform.channel(0);
 *
 * console.log(channel.max_array()); // -> [9, 6, 11]
 * ```
 *
 * @return {Array.<Integer>} Max values contained in the offset.
 */

WaveformDataChannel.prototype.max_array = function() {
  return this._waveformData._offsetValues(
    0,
    this._waveformData.length,
    this._channelIndex * 2 + 1
  );
};

module.exports = WaveformDataChannel;

},{}],66:[function(_dereq_,module,exports){
"use strict";

var WaveformDataChannel = _dereq_("./channel");
var WaveformDataObjectAdapter = _dereq_("./adapters/object");
var WaveformDataArrayBufferAdapter = _dereq_("./adapters/arraybuffer");

var adapters = [
  WaveformDataArrayBufferAdapter,
  WaveformDataObjectAdapter
];

/**
 * Facade to iterate on audio waveform response.
 *
 * ```javascript
 * var waveform = new WaveformData({ ... });
 *
 * var json_waveform = new WaveformData(xhr.responseText);
 *
 * var arraybuff_waveform = new WaveformData(
 *   getArrayBufferData()
 * );
 * ```
 *
 * ## Offsets
 *
 * An **offset** is a non-destructive way to iterate on a subset of data.
 *
 * It is the easiest way to **navigate** through data without having to deal
 * with complex calculations. Simply iterate over the data to display them.
 *
 * *Notice*: the default offset is the entire set of data.
 *
 * @param {String|ArrayBuffer|Object} data Waveform data,
 * to be consumed by the related adapter.
 * @param {WaveformData.adapter|Function} adapter Backend adapter used to manage
 * access to the data.
 * @constructor
 */

function WaveformData(data) {
  var Adapter = this._getAdapter(data);

  this._adapter = new Adapter(data);

  this._channels = [];

  for (var channel = 0; channel < this.channels; channel++) {
    this._channels[channel] = new WaveformDataChannel(this, channel);
  }
}

/**
 * Creates an instance of WaveformData by guessing the adapter from the
 * data type. It can also accept an XMLHttpRequest response.
 *
 * ```javascript
 * var xhr = new XMLHttpRequest();
 * xhr.open("GET", "http://example.com/waveforms/track.dat");
 * xhr.responseType = "arraybuffer";
 *
 * xhr.addEventListener("load", function onResponse(progressEvent) {
 *   var waveform = WaveformData.create(progressEvent.target);
 *
 *   console.log(waveform.duration);
 * });
 *
 * xhr.send();
 * ```
 *
 * @static
 * @throws TypeError
 * @param {Object} data
 * @return {WaveformData}
 */

WaveformData.create = function create(data) {
  return new WaveformData(data);
};

/**
 * Public API for the Waveform Data manager.
 *
 * @namespace WaveformData
 */

WaveformData.prototype = {

  _getAdapter: function(data) {
    var Adapter = null;

    adapters.some(function(AdapterClass) {
      if (AdapterClass.isCompatible(data)) {
        Adapter = AdapterClass;
        return true;
      }
    });

    if (Adapter === null) {
      throw new TypeError("Could not detect a WaveformData adapter from the input.");
    }

    return Adapter;
  },

  /**
   * Creates a new WaveformData object with resampled data.
   * Returns a rescaled waveform, to either fit the waveform to a specific
   * width, or to a specific zoom level.
   *
   * **Note**: You may specify either the *width* or the *scale*, but not both.
   * The `scale` will be deduced from the `width` you want to fit the data into.
   *
   * Adapted from Sequence::GetWaveDisplay in Audacity, with permission.
   *
   * ```javascript
   * var waveform = WaveformData.create({ ... });
   * // ...
   *
   * // fitting the data in a 500px wide canvas
   * var resampled_waveform = waveform.resample({ width: 500 });
   *
   * console.log(resampled_waveform.min.length);   // -> 500
   *
   * // zooming out on a 3 times less precise scale
   * var resampled_waveform = waveform.resample({ scale: waveform.scale * 3 });
   * ```
   *
   * @see https://code.google.com/p/audacity/source/browse/audacity-src/trunk/src/Sequence.cpp
   * @param {{ width: Number } | { scale: Number }} options Either a width (in pixels) or a zoom level (in samples per pixel)
   * @return {WaveformData} New resampled object
   */

  resample: function(options) {
    if (typeof options === "number") {
      options = {
        width: options
      };
    }

    options.input_index = typeof options.input_index === "number" ? options.input_index : null;
    options.output_index = typeof options.output_index === "number" ? options.output_index : null;
    options.scale = typeof options.scale === "number" ? options.scale : null;
    options.width = typeof options.width === "number" ? options.width : null;

    var is_partial_resampling = Boolean(options.input_index) || Boolean(options.output_index);

    if (options.input_index != null && (options.input_index < 0)) {
      throw new RangeError("options.input_index should be a positive integer value. [" + options.input_index + "]");
    }

    if (options.output_index != null && (options.output_index < 0)) {
      throw new RangeError("options.output_index should be a positive integer value. [" + options.output_index + "]");
    }

    if (options.width != null && (options.width <= 0)) {
      throw new RangeError("options.width should be a strictly positive integer value. [" + options.width + "]");
    }

    if (options.scale != null && (options.scale <= 0)) {
      throw new RangeError("options.scale should be a strictly positive integer value. [" + options.scale + "]");
    }

    if (!options.scale && !options.width) {
      throw new RangeError("You should provide either a resampling scale or a width in pixel the data should fit in.");
    }

    var definedPartialOptionsCount = ["width", "scale", "output_index", "input_index"].reduce(function(count, key) {
      return count + (options[key] === null ? 0 : 1);
    }, 0);

    if (is_partial_resampling && definedPartialOptionsCount !== 4) {
      throw new Error("Some partial resampling options are missing. You provided " + definedPartialOptionsCount + " of them over 4.");
    }

    var output_data = [];
    var samples_per_pixel = options.scale || Math.floor(this.duration * this.sample_rate / options.width); // scale we want to reach
    var scale = this.scale; // scale we are coming from
    var channel_count = 2 * this.channels;

    var input_buffer_size = this.length; // the amount of data we want to resample i.e. final zoom want to resample all data but for intermediate zoom we want to resample subset
    var input_index = options.input_index || 0; // is this start point? or is this the index at current scale
    var output_index = options.output_index || 0; // is this end point? or is this the index at scale we want to be?

    var channels = this.channels;

    var min = new Array(channels);
    var max = new Array(channels);

    var channel;

    for (channel = 0; channel < channels; ++channel) {
      if (input_buffer_size > 0) {
        min[channel] = this.channel(channel).min_sample(input_index);
        max[channel] = this.channel(channel).max_sample(input_index);
      }
      else {
        min[channel] = 0;
        max[channel] = 0;
      }
    }

    var min_value = -128;
    var max_value = 127;

    if (samples_per_pixel < scale) {
      throw new Error("Zoom level " + samples_per_pixel + " too low, minimum: " + scale);
    }

    var where, prev_where, stop, value, last_input_index;

    function sample_at_pixel(x) {
      return Math.floor(x * samples_per_pixel);
    }

    function add_sample(min, max) {
      output_data.push(min, max);
    }

    while (input_index < input_buffer_size) {
      while (Math.floor(sample_at_pixel(output_index) / scale) <= input_index) {
        if (output_index > 0) {
          for (channel = 0; channel < channels; ++channel) {
            add_sample(min[channel], max[channel]);
          }
        }

        last_input_index = input_index;

        output_index++;

        where      = sample_at_pixel(output_index);
        prev_where = sample_at_pixel(output_index - 1);

        if (where !== prev_where) {
          for (channel = 0; channel < channels; ++channel) {
            min[channel] = max_value;
            max[channel] = min_value;
          }
        }
      }

      where = sample_at_pixel(output_index);
      stop = Math.floor(where / scale);

      if (stop > input_buffer_size) {
        stop = input_buffer_size;
      }

      while (input_index < stop) {
        for (channel = 0; channel < channels; ++channel) {
          value = this.channel(channel).min_sample(input_index);

          if (value < min[channel]) {
            min[channel] = value;
          }

          value = this.channel(channel).max_sample(input_index);

          if (value > max[channel]) {
            max[channel] = value;
          }
        }

        input_index++;
      }

      if (is_partial_resampling && (output_data.length / channel_count) >= options.width) {
        break;
      }
    }

    if (is_partial_resampling) {
      if ((output_data.length / channel_count) > options.width &&
          input_index !== last_input_index) {
          for (channel = 0; channel < channels; ++channel) {
            add_sample(min[channel], max[channel]);
          }
      }
    }
    else if (input_index !== last_input_index) {
      for (channel = 0; channel < channels; ++channel) {
        add_sample(min[channel], max[channel]);
      }
    }

    return new WaveformData({
      version: this._adapter.version,
      bits: this.bits,
      samples_per_pixel: samples_per_pixel,
      length: output_data.length / channel_count,
      data: output_data,
      sample_rate: this.sample_rate,
      channels: channels
    });
  },

  /**
   * Return a new WaveformData instance with the concatenated result of multiple waveforms.
   *
   * @param {...WaveformData} otherWaveforms One or more waveform instances to concatenate
   * @return {WaveformData} New concatenated object
   */
  concat: function() {
    var self = this;
    var otherWaveforms = Array.prototype.slice.call(arguments);

    // Check that all the supplied waveforms are compatible
    otherWaveforms.forEach(function(otherWaveform) {
      if (self.channels !== otherWaveform.channels ||
        self.sample_rate !== otherWaveform.sample_rate ||
        self.scale !== otherWaveform.scale ||
        Object.getPrototypeOf(self._adapter) !== Object.getPrototypeOf(otherWaveform._adapter) ||
        self._adapter.version !== otherWaveform._adapter.version) {
        throw new Error("Waveforms are incompatible");
      }
    });

    var otherAdapters = otherWaveforms.map(function(w) {
      return w._adapter;
    });

    var combinedBuffer = this._adapter.concatBuffers.apply(this._adapter, otherAdapters);

    return new WaveformData(combinedBuffer);
  },

  /**
   * Return the unpacked values for a particular offset.
   *
   * @param {Integer} start
   * @param {Integer} length
   * @param {Integer} correction The step to skip for each iteration
   * (as the response body is [min, max, min, max...])
   * @return {Array.<Integer>}
   */

  _offsetValues: function getOffsetValues(start, length, correction) {
    var adapter = this._adapter;
    var values = [];
    var channels = this.channels;

    correction += (start * channels * 2); // offset the positioning query

    for (var i = 0; i < length; i++) {
      values.push(adapter.at((i * channels * 2) + correction));
    }

    return values;
  },

  /**
   * Returns the length of the waveform, in pixels.
   *
   * ```javascript
   * var waveform = WaveformData.create({ ... });
   * console.log(waveform.length); // -> 600
   * ```
   *
   * @api
   * @return {Integer} Length of the waveform, in pixels.
   */

  get length() {
    return this._adapter.length;
  },

  /**
   * Returns the number of bits per sample, either 8 or 16.
   */

  get bits() {
    return this._adapter.bits;
  },

  /**
   * Returns the (approximate) duration of the audio file, in seconds.
   *
   * ```javascript
   * var waveform = WaveformData.create({ ... });
   * console.log(waveform.duration); // -> 10.33333333333
   * ```
   *
   * @api
   * @return {number} Duration of the audio waveform, in seconds.
   */

  get duration() {
    return this.length * this.scale / this.sample_rate;
  },

  /**
   * Return the number of pixels per second.
   *
   * ```javascript
   * var waveform = WaveformData.create({ ... });
   *
   * console.log(waveform.pixels_per_second); // -> 93.75
   * ```
   *
   * @api
   * @return {number} Number of pixels per second.
   */

  get pixels_per_second() {
    return this.sample_rate / this.scale;
  },

  /**
   * Return the amount of time represented by a single pixel.
   *
   * ```javascript
   * var waveform = WaveformData.create({ ... });
   *
   * console.log(waveform.seconds_per_pixel);       // -> 0.010666666666666666
   * ```
   *
   * @return {number} Amount of time (in seconds) contained in a pixel.
   */

  get seconds_per_pixel() {
    return this.scale / this.sample_rate;
  },

  /**
   * Returns the number of waveform channels.
   *
   * ```javascript
   * var waveform = WaveformData.create({ ... });
   * console.log(waveform.channels);    // -> 1
   * ```
   *
   * @api
   * @return {number} Number of channels.
   */

  get channels() {
    return this._adapter.channels;
  },

  /**
   * Returns a waveform channel.
   *
   * ```javascript
   * var waveform = WaveformData.create({ ... });
   * var channel = waveform.channel(0);
   * console.log(channel.min_sample(0)); // -> 1
   * ```
   *
   * @api
   * @param {Number} Channel index.
   * @return {WaveformDataChannel} Waveform channel.
   */

  channel: function(index) {
    if (index >= 0 && index < this._channels.length) {
      return this._channels[index];
    }
    else {
      throw new RangeError("Invalid channel: " + index);
    }
  },

  /**
   * Returns the number of samples per second.
   *
   * @return {Integer} Number of samples per second.
   */

  get sample_rate() {
    return this._adapter.sample_rate;
  },

  /**
   * Returns the scale (number of samples per pixel).
   *
   * @return {Integer} Number of samples per pixel.
   */

  get scale() {
    return this._adapter.scale;
  },

  /**
   * Returns the pixel location for a given time.
   *
   * @param {number} time
   * @return {integer} Index location for a specific time.
   */

  at_time: function at_time(time) {
    return Math.floor(time * this.sample_rate / this.scale);
  },

  /**
   * Returns the time in seconds for a given index
   *
   * @param {Integer} index
   * @return {number}
   */

  time: function time(index) {
    return index * this.scale / this.sample_rate;
  }
};

module.exports = WaveformData;

},{"./adapters/arraybuffer":60,"./adapters/object":61,"./channel":65}],67:[function(_dereq_,module,exports){
"use strict";

var WaveformData = _dereq_("./lib/core");

WaveformData.createFromAudio = _dereq_("./lib/builders/webaudio");

module.exports = WaveformData;

},{"./lib/builders/webaudio":64,"./lib/core":66}],68:[function(_dereq_,module,exports){
module.exports = function (Cue, Utils) {
    'use strict';
    var isHeadless = /HeadlessChrome/.test(navigator.userAgent);
    function windowIsVisible() {
        if (isHeadless || navigator.webdriver) {
            return false;
        }
        return typeof document === 'object' && 'visibilityState' in document && document.visibilityState === 'visible';
    }
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame;
    var eventTypes = {
        forward: {},
        reverse: {}
    };
    var EVENT_TYPE_POINT = 0;
    var EVENT_TYPE_SEGMENT_ENTER = 1;
    var EVENT_TYPE_SEGMENT_EXIT = 2;
    eventTypes.forward[Cue.POINT] = EVENT_TYPE_POINT;
    eventTypes.forward[Cue.SEGMENT_START] = EVENT_TYPE_SEGMENT_ENTER;
    eventTypes.forward[Cue.SEGMENT_END] = EVENT_TYPE_SEGMENT_EXIT;
    eventTypes.reverse[Cue.POINT] = EVENT_TYPE_POINT;
    eventTypes.reverse[Cue.SEGMENT_START] = EVENT_TYPE_SEGMENT_EXIT;
    eventTypes.reverse[Cue.SEGMENT_END] = EVENT_TYPE_SEGMENT_ENTER;
    var eventNames = {};
    eventNames[EVENT_TYPE_POINT] = 'points.enter';
    eventNames[EVENT_TYPE_SEGMENT_ENTER] = 'segments.enter';
    eventNames[EVENT_TYPE_SEGMENT_EXIT] = 'segments.exit';
    function getPointOrSegment(peaks, cue) {
        switch (cue.type) {
        case Cue.POINT:
            return peaks.points.getPoint(cue.id);
        case Cue.SEGMENT_START:
        case Cue.SEGMENT_END:
            return peaks.segments.getSegment(cue.id);
        default:
            throw new Error('getPointOrSegment: id not found?');
        }
    }
    function CueEmitter(peaks) {
        this._cues = [];
        this._peaks = peaks;
        this._previousTime = -1;
        this._updateCues = this._updateCues.bind(this);
        this._onPlay = this.onPlay.bind(this);
        this._onSeeked = this.onSeeked.bind(this);
        this._onTimeUpdate = this.onTimeUpdate.bind(this);
        this._onAnimationFrame = this.onAnimationFrame.bind(this);
        this._rAFHandle = null;
        this._activeSegments = {};
        this._attachEventHandlers();
    }
    CueEmitter.prototype._updateCues = function () {
        var self = this;
        var points = self._peaks.points.getPoints();
        var segments = self._peaks.segments.getSegments();
        self._cues.length = 0;
        points.forEach(function (point) {
            self._cues.push(new Cue(point.time, Cue.POINT, point.id));
        });
        segments.forEach(function (segment) {
            self._cues.push(new Cue(segment.startTime, Cue.SEGMENT_START, segment.id));
            self._cues.push(new Cue(segment.endTime, Cue.SEGMENT_END, segment.id));
        });
        self._cues.sort(Cue.sorter);
        var time = self._peaks.player.getCurrentTime();
        self._updateActiveSegments(time);
    };
    CueEmitter.prototype._onUpdate = function (time, previousTime) {
        var isForward = time > previousTime;
        var start;
        var end;
        var step;
        if (isForward) {
            start = 0;
            end = this._cues.length;
            step = 1;
        } else {
            start = this._cues.length - 1;
            end = -1;
            step = -1;
        }
        for (var i = start; isForward ? i < end : i > end; i += step) {
            var cue = this._cues[i];
            if (isForward ? cue.time > previousTime : cue.time < previousTime) {
                if (isForward ? cue.time > time : cue.time < time) {
                    break;
                }
                var marker = getPointOrSegment(this._peaks, cue);
                var eventType = isForward ? eventTypes.forward[cue.type] : eventTypes.reverse[cue.type];
                if (eventType === EVENT_TYPE_SEGMENT_ENTER) {
                    this._activeSegments[marker.id] = marker;
                } else if (eventType === EVENT_TYPE_SEGMENT_EXIT) {
                    delete this._activeSegments[marker.id];
                }
                this._peaks.emit(eventNames[eventType], marker);
            }
        }
    };
    CueEmitter.prototype.onTimeUpdate = function (time) {
        if (windowIsVisible()) {
            return;
        }
        if (this._peaks.player.isPlaying() && !this._peaks.player.isSeeking()) {
            this._onUpdate(time, this._previousTime);
        }
        this._previousTime = time;
    };
    CueEmitter.prototype.onAnimationFrame = function () {
        var time = this._peaks.player.getCurrentTime();
        if (!this._peaks.player.isSeeking()) {
            this._onUpdate(time, this._previousTime);
        }
        this._previousTime = time;
        if (this._peaks.player.isPlaying()) {
            this._rAFHandle = requestAnimationFrame(this._onAnimationFrame);
        }
    };
    CueEmitter.prototype.onPlay = function () {
        this._previousTime = this._peaks.player.getCurrentTime();
        this._rAFHandle = requestAnimationFrame(this._onAnimationFrame);
    };
    CueEmitter.prototype.onSeeked = function (time) {
        this._previousTime = time;
        this._updateActiveSegments(time);
    };
    function getSegmentIdComparator(id) {
        return function compareSegmentIds(segment) {
            return segment.id === id;
        };
    }
    CueEmitter.prototype._updateActiveSegments = function (time) {
        var self = this;
        var activeSegments = self._peaks.segments.getSegmentsAtTime(time);
        for (var id in self._activeSegments) {
            if (Utils.objectHasProperty(self._activeSegments, id)) {
                var segment = activeSegments.find(getSegmentIdComparator(id));
                if (!segment) {
                    self._peaks.emit('segments.exit', self._activeSegments[id]);
                    delete self._activeSegments[id];
                }
            }
        }
        activeSegments.forEach(function (segment) {
            if (!(segment.id in self._activeSegments)) {
                self._activeSegments[segment.id] = segment;
                self._peaks.emit('segments.enter', segment);
            }
        });
    };
    var triggerUpdateOn = Array('points.update', 'points.dragmove', 'points.add', 'points.remove', 'points.remove_all', 'segments.update', 'segments.dragged', 'segments.add', 'segments.remove', 'segments.remove_all');
    CueEmitter.prototype._attachEventHandlers = function () {
        this._peaks.on('player.timeupdate', this._onTimeUpdate);
        this._peaks.on('player.play', this._onPlay);
        this._peaks.on('player.seeked', this._onSeeked);
        for (var i = 0; i < triggerUpdateOn.length; i++) {
            this._peaks.on(triggerUpdateOn[i], this._updateCues);
        }
        this._updateCues();
    };
    CueEmitter.prototype._detachEventHandlers = function () {
        this._peaks.off('player.timeupdate', this._onTimeUpdate);
        this._peaks.off('player.play', this._onPlay);
        this._peaks.off('player.seeked', this._onSeeked);
        for (var i = 0; i < triggerUpdateOn.length; i++) {
            this._peaks.off(triggerUpdateOn[i], this._updateCues);
        }
    };
    CueEmitter.prototype.destroy = function () {
        if (this._rAFHandle) {
            cancelAnimationFrame(this._rAFHandle);
            this._rAFHandle = null;
        }
        this._detachEventHandlers();
        this._previousTime = -1;
    };
    return CueEmitter;
}(_dereq_('./cue'), _dereq_('./utils'));
},{"./cue":69,"./utils":87}],69:[function(_dereq_,module,exports){
module.exports = function () {
    'use strict';
    function Cue(time, type, id) {
        this.time = time;
        this.type = type;
        this.id = id;
    }
    Cue.POINT = 0;
    Cue.SEGMENT_START = 1;
    Cue.SEGMENT_END = 2;
    Cue.sorter = function (a, b) {
        return a.time - b.time;
    };
    return Cue;
}();
},{}],70:[function(_dereq_,module,exports){
module.exports = function (Konva) {
    'use strict';
    function DefaultPointMarker(options) {
        this._options = options;
    }
    DefaultPointMarker.prototype.init = function (group) {
        var handleWidth = 10;
        var handleHeight = 20;
        var handleX = -(handleWidth / 2) + 0.5;
        if (this._options.view === 'zoomview') {
            this._label = new Konva.Text({
                x: 2,
                y: 0,
                text: this._options.point.labelText,
                textAlign: 'left',
                fontSize: 10,
                fontFamily: 'sans-serif',
                fill: '#000'
            });
        }
        if (this._options.draggable) {
            this._handle = new Konva.Rect({
                x: handleX,
                y: 0,
                width: handleWidth,
                height: handleHeight,
                fill: this._options.color
            });
        }
        this._line = new Konva.Line({
            x: 0,
            y: 0,
            stroke: this._options.color,
            strokeWidth: 1
        });
        if (this._handle) {
            this._time = new Konva.Text({
                x: -24,
                y: 0,
                text: this._options.layer.formatTime(this._options.point.time),
                fontSize: 10,
                fontFamily: 'sans-serif',
                fill: '#000',
                textAlign: 'center'
            });
            this._time.hide();
        }
        if (this._handle) {
            group.add(this._handle);
        }
        group.add(this._line);
        if (this._label) {
            group.add(this._label);
        }
        if (this._time) {
            group.add(this._time);
        }
        this.fitToView();
        this.bindEventHandlers(group);
    };
    DefaultPointMarker.prototype.bindEventHandlers = function (group) {
        var self = this;
        if (self._handle) {
            self._handle.on('mouseover touchstart', function () {
                self._time.setX(-24 - self._time.getWidth());
                self._time.show();
                self._options.layer.draw();
            });
            self._handle.on('mouseout touchend', function () {
                self._time.hide();
                self._options.layer.draw();
            });
            group.on('dragstart', function () {
                self._time.setX(-24 - self._time.getWidth());
                self._time.show();
                self._options.layer.draw();
            });
            group.on('dragend', function () {
                self._time.hide();
                self._options.layer.draw();
            });
        }
    };
    DefaultPointMarker.prototype.fitToView = function () {
        var height = this._options.layer.getHeight();
        this._line.points([
            0.5,
            0,
            0.5,
            height
        ]);
        if (this._label) {
            this._label.y(12);
        }
        if (this._handle) {
            this._handle.y(height / 2 - 10.5);
        }
        if (this._time) {
            this._time.y(height / 2 - 5);
        }
    };
    DefaultPointMarker.prototype.timeUpdated = function (time) {
        if (this._time) {
            this._time.setText(this._options.layer.formatTime(time));
        }
    };
    return DefaultPointMarker;
}(_dereq_('konva'));
},{"konva":42}],71:[function(_dereq_,module,exports){
module.exports = function (Konva) {
    'use strict';
    function DefaultSegmentMarker(options) {
        this._options = options;
    }
    DefaultSegmentMarker.prototype.init = function (group) {
        var handleWidth = 10;
        var handleHeight = 20;
        var handleX = -(handleWidth / 2) + 0.5;
        var xPosition = this._options.startMarker ? -24 : 24;
        var time = this._options.startMarker ? this._options.segment.startTime : this._options.segment.endTime;
        this._label = new Konva.Text({
            x: xPosition,
            y: 0,
            text: this._options.layer.formatTime(time),
            fontSize: 10,
            fontFamily: 'sans-serif',
            fill: '#000',
            textAlign: 'center'
        });
        this._label.hide();
        this._handle = new Konva.Rect({
            x: handleX,
            y: 0,
            width: handleWidth,
            height: handleHeight,
            fill: this._options.color,
            stroke: this._options.color,
            strokeWidth: 1
        });
        this._line = new Konva.Line({
            x: 0,
            y: 0,
            stroke: this._options.color,
            strokeWidth: 1
        });
        group.add(this._label);
        group.add(this._line);
        group.add(this._handle);
        this.fitToView();
        this.bindEventHandlers(group);
    };
    DefaultSegmentMarker.prototype.bindEventHandlers = function (group) {
        var self = this;
        var xPosition = self._options.startMarker ? -24 : 24;
        if (self._options.draggable) {
            group.on('dragstart', function () {
                if (self._options.startMarker) {
                    self._label.setX(xPosition - self._label.getWidth());
                }
                self._label.show();
                self._options.layer.draw();
            });
            group.on('dragend', function () {
                self._label.hide();
                self._options.layer.draw();
            });
        }
        self._handle.on('mouseover touchstart', function () {
            if (self._options.startMarker) {
                self._label.setX(xPosition - self._label.getWidth());
            }
            self._label.show();
            self._options.layer.draw();
        });
        self._handle.on('mouseout touchend', function () {
            self._label.hide();
            self._options.layer.draw();
        });
    };
    DefaultSegmentMarker.prototype.fitToView = function () {
        var height = this._options.layer.getHeight();
        this._label.y(height / 2 - 5);
        this._handle.y(height / 2 - 10.5);
        this._line.points([
            0.5,
            0,
            0.5,
            height
        ]);
    };
    DefaultSegmentMarker.prototype.timeUpdated = function (time) {
        this._label.setText(this._options.layer.formatTime(time));
    };
    return DefaultSegmentMarker;
}(_dereq_('konva'));
},{"konva":42}],72:[function(_dereq_,module,exports){
module.exports = function (Utils, Konva) {
    'use strict';
    function HighlightLayer(view, offset, color) {
        this._view = view;
        this._offset = offset;
        this._color = color;
        this._layer = new Konva.FastLayer();
        this._highlightRect = null;
        this._startTime = null;
        this._endTime = null;
    }
    HighlightLayer.prototype.addToStage = function (stage) {
        stage.add(this._layer);
    };
    HighlightLayer.prototype.showHighlight = function (startTime, endTime) {
        if (!this._highlightRect) {
            this._createHighlightRect(startTime, endTime);
        }
        this._update(startTime, endTime);
    };
    HighlightLayer.prototype._update = function (startTime, endTime) {
        this._startTime = startTime;
        this._endTime = endTime;
        var startOffset = this._view.timeToPixels(startTime);
        var endOffset = this._view.timeToPixels(endTime);
        this._highlightRect.setAttrs({
            x: startOffset,
            width: endOffset - startOffset
        });
        this._layer.draw();
    };
    HighlightLayer.prototype._createHighlightRect = function (startTime, endTime) {
        this._startTime = startTime;
        this._endTime = endTime;
        var startOffset = this._view.timeToPixels(startTime);
        var endOffset = this._view.timeToPixels(endTime);
        this._highlightRect = new Konva.Rect({
            startOffset: 0,
            y: 0,
            width: endOffset - startOffset,
            stroke: this._color,
            strokeWidth: 1,
            height: 0,
            fill: this._color,
            opacity: 0.3,
            cornerRadius: 2
        });
        this.fitToView();
        this._layer.add(this._highlightRect);
    };
    HighlightLayer.prototype.removeHighlight = function () {
        if (this._highlightRect) {
            this._highlightRect.destroy();
            this._highlightRect = null;
            this._layer.draw();
        }
    };
    HighlightLayer.prototype.updateHighlight = function () {
        if (this._highlightRect) {
            this._update(this._startTime, this._endTime);
        }
    };
    HighlightLayer.prototype.fitToView = function () {
        if (this._highlightRect) {
            var height = this._view.getHeight();
            var offset = Utils.clamp(this._offset, 0, Math.floor(height / 2));
            this._highlightRect.setAttrs({
                y: offset,
                height: height - offset * 2
            });
        }
    };
    return HighlightLayer;
}(_dereq_('./utils'), _dereq_('konva'));
},{"./utils":87,"konva":42}],73:[function(_dereq_,module,exports){
module.exports = function () {
    'use strict';
    var nodes = [
        'OBJECT',
        'TEXTAREA',
        'INPUT',
        'SELECT',
        'OPTION'
    ];
    var SPACE = 32, TAB = 9, LEFT_ARROW = 37, RIGHT_ARROW = 39;
    var keys = [
        SPACE,
        TAB,
        LEFT_ARROW,
        RIGHT_ARROW
    ];
    function KeyboardHandler(eventEmitter) {
        this.eventEmitter = eventEmitter;
        this._handleKeyEvent = this._handleKeyEvent.bind(this);
        document.addEventListener('keydown', this._handleKeyEvent);
        document.addEventListener('keypress', this._handleKeyEvent);
        document.addEventListener('keyup', this._handleKeyEvent);
    }
    KeyboardHandler.prototype._handleKeyEvent = function handleKeyEvent(event) {
        if (nodes.indexOf(event.target.nodeName) === -1) {
            if (keys.indexOf(event.type) > -1) {
                event.preventDefault();
            }
            if (event.type === 'keydown' || event.type === 'keypress') {
                switch (event.keyCode) {
                case SPACE:
                    this.eventEmitter.emit('keyboard.space');
                    break;
                case TAB:
                    this.eventEmitter.emit('keyboard.tab');
                    break;
                }
            } else if (event.type === 'keyup') {
                switch (event.keyCode) {
                case LEFT_ARROW:
                    if (event.shiftKey) {
                        this.eventEmitter.emit('keyboard.shift_left');
                    } else {
                        this.eventEmitter.emit('keyboard.left');
                    }
                    break;
                case RIGHT_ARROW:
                    if (event.shiftKey) {
                        this.eventEmitter.emit('keyboard.shift_right');
                    } else {
                        this.eventEmitter.emit('keyboard.right');
                    }
                    break;
                }
            }
        }
    };
    KeyboardHandler.prototype.destroy = function () {
        document.removeEventListener('keydown', this._handleKeyEvent);
        document.removeEventListener('keypress', this._handleKeyEvent);
        document.removeEventListener('keyup', this._handleKeyEvent);
    };
    return KeyboardHandler;
}();
},{}],74:[function(_dereq_,module,exports){
module.exports = function (Colors, EventEmitter, CueEmitter, WaveformPoints, WaveformSegments, KeyboardHandler, MediaElementPlayer, Player, MarkerFactories, ViewController, ZoomController, WaveformBuilder, Utils) {
    'use strict';
    function buildUi(container) {
        return {
            player: container.querySelector('.waveform'),
            zoomview: container.querySelector('.zoom-container'),
            overview: container.querySelector('.overview-container')
        };
    }
    function Peaks() {
        EventEmitter.call(this);
        this.options = {
            zoomLevels: [
                512,
                1024,
                2048,
                4096
            ],
            dataUri: null,
            dataUriDefaultFormat: 'json',
            withCredentials: false,
            waveformData: null,
            logger: null,
            deprecationLogger: console.log.bind(console),
            keyboard: false,
            nudgeIncrement: 1,
            segmentStartMarkerColor: Colors.gray,
            segmentEndMarkerColor: Colors.gray,
            zoomWaveformColor: 'rgba(0, 225, 128, 1)',
            overviewWaveformColor: 'rgba(0,0,0,0.2)',
            overviewHighlightColor: 'grey',
            overviewHighlightOffset: 11,
            randomizeSegmentColor: true,
            height: 200,
            segmentColor: Colors.orange,
            playheadColor: Colors.black,
            playheadTextColor: Colors.gray,
            timeLabelPrecision: 2,
            showPlayheadTime: false,
            axisGridlineColor: '#ccc',
            axisLabelColor: Colors.gray,
            template: [
                '<div class="waveform">',
                '<div class="zoom-container"></div>',
                '<div class="overview-container"></div>',
                '</div>'
            ].join(''),
            pointMarkerColor: Colors.teal,
            webAudio: null,
            zoomAdapter: 'static',
            emitCueEvents: false,
            createSegmentMarker: MarkerFactories.createSegmentMarker,
            createSegmentLabel: MarkerFactories.createSegmentLabel,
            createPointMarker: MarkerFactories.createPointMarker
        };
        this.logger = console.error.bind(console);
        return this;
    }
    Peaks.prototype = Object.create(EventEmitter.prototype);
    Peaks.init = function (opts, callback) {
        var instance = new Peaks();
        opts = opts || {};
        var err = instance._setOptions(opts);
        if (err) {
            callback(err);
            return;
        }
        var containers = null;
        if (typeof instance.options.template === 'string') {
            opts.container.innerHTML = instance.options.template;
            containers = buildUi(instance.options.container);
        } else if (Utils.isHTMLElement(instance.options.template)) {
            this.container.appendChild(instance.options.template);
            containers = buildUi(instance.options.container);
        } else if (instance.options.containers) {
            containers = instance.options.containers;
        } else {
            callback(new TypeError('Peaks.init(): The template option must be a valid HTML string or a DOM object'));
            return;
        }
        var zoomviewContainer = containers.zoomview || containers.zoom;
        if (!Utils.isHTMLElement(zoomviewContainer) && !Utils.isHTMLElement(containers.overview)) {
            callback(new TypeError('Peaks.init(): The containers.zoomview and/or containers.overview options must be valid HTML elements'));
            return;
        }
        if (zoomviewContainer && zoomviewContainer.clientWidth <= 0) {
            callback(new TypeError('Peaks.init(): Please ensure that the zoomview container is visible and has non-zero width'));
            return;
        }
        if (containers.overview && containers.overview.clientWidth <= 0) {
            callback(new TypeError('Peaks.init(): Please ensure that the overview container is visible and has non-zero width'));
            return;
        }
        if (instance.options.keyboard) {
            instance._keyboardHandler = new KeyboardHandler(instance);
        }
        var player = instance.options.player ? instance.options.player : new MediaElementPlayer(instance, instance.options.mediaElement);
        instance.player = new Player(instance, player);
        instance.segments = new WaveformSegments(instance);
        instance.points = new WaveformPoints(instance);
        instance.zoom = new ZoomController(instance, instance.options.zoomLevels);
        instance.views = new ViewController(instance);
        var waveformBuilder = new WaveformBuilder(instance);
        waveformBuilder.init(instance.options, function (err, waveformData) {
            if (err) {
                if (callback) {
                    callback(err);
                }
                return;
            }
            instance._waveformData = waveformData;
            if (containers.overview) {
                instance.views.createOverview(containers.overview);
            }
            if (zoomviewContainer) {
                instance.views.createZoomview(zoomviewContainer);
            }
            instance._addWindowResizeHandler();
            if (instance.options.segments) {
                instance.segments.add(instance.options.segments);
            }
            if (instance.options.points) {
                instance.points.add(instance.options.points);
            }
            if (instance.options.emitCueEvents) {
                instance._cueEmitter = new CueEmitter(instance);
            }
            setTimeout(function () {
                instance.emit('peaks.ready');
            }, 0);
            if (callback) {
                callback(null, instance);
            }
        });
        return instance;
    };
    Peaks.prototype._setOptions = function (opts) {
        opts.deprecationLogger = opts.deprecationLogger || console.log.bind(console);
        if (opts.audioElement) {
            opts.mediaElement = opts.audioElement;
            opts.deprecationLogger('Peaks.init(): The audioElement option is deprecated, please use mediaElement instead');
        }
        if (opts.overviewHighlightRectangleColor) {
            opts.overviewHighlightColor = opts.overviewHighlightRectangleColor;
            opts.deprecationLogger('Peaks.init(): The overviewHighlightRectangleColor option is deprecated, please use overviewHighlightColor instead');
        }
        if (opts.inMarkerColor) {
            opts.segmentStartMarkerColor = opts.inMarkerColor;
            opts.deprecationLogger('Peaks.init(): The inMarkerColor option is deprecated, please use segmentStartMarkerColor instead');
        }
        if (opts.outMarkerColor) {
            opts.segmentEndMarkerColor = opts.outMarkerColor;
            opts.deprecationLogger('Peaks.init(): The outMarkerColor option is deprecated, please use segmentEndMarkerColor instead');
        }
        if (!opts.player) {
            if (!opts.mediaElement) {
                return new Error('Peaks.init(): Missing mediaElement option');
            }
            if (!(opts.mediaElement instanceof HTMLMediaElement)) {
                return new TypeError('Peaks.init(): The mediaElement option should be an HTMLMediaElement');
            }
        }
        if (!opts.container && !opts.containers) {
            return new Error('Peaks.init(): Please specify either a container or containers option');
        } else if (Boolean(opts.container) === Boolean(opts.containers)) {
            return new Error('Peaks.init(): Please specify either a container or containers option, but not both');
        }
        if (opts.template && opts.containers) {
            return new Error('Peaks.init(): Please specify either a template or a containers option, but not both');
        }
        if (opts.containers) {
            opts.template = null;
        }
        if (opts.logger && !Utils.isFunction(opts.logger)) {
            return new TypeError('Peaks.init(): The logger option should be a function');
        }
        if (opts.segments && !Array.isArray(opts.segments)) {
            return new TypeError('Peaks.init(): options.segments must be an array of segment objects');
        }
        if (opts.points && !Array.isArray(opts.points)) {
            return new TypeError('Peaks.init(): options.points must be an array of point objects');
        }
        Utils.extend(this.options, opts);
        if (!Array.isArray(this.options.zoomLevels)) {
            return new TypeError('Peaks.init(): The zoomLevels option should be an array');
        } else if (this.options.zoomLevels.length === 0) {
            return new Error('Peaks.init(): The zoomLevels array must not be empty');
        } else {
            if (!Utils.isInAscendingOrder(this.options.zoomLevels)) {
                return new Error('Peaks.init(): The zoomLevels array must be sorted in ascending order');
            }
        }
        if (opts.logger) {
            this.logger = opts.logger;
        }
        return null;
    };
    Peaks.prototype.setSource = function (options, callback) {
        var self = this;
        if (!options.mediaUrl) {
            callback(new Error('peaks.setSource(): options must contain a mediaUrl'));
            return;
        }
        function reset() {
            self.removeAllListeners('player.canplay');
            self.removeAllListeners('player.error');
        }
        function playerErrorHandler(err) {
            reset();
            callback(err);
        }
        function playerCanPlayHandler() {
            reset();
            if (!options.zoomLevels) {
                options.zoomLevels = self.options.zoomLevels;
            }
            var waveformBuilder = new WaveformBuilder(self);
            waveformBuilder.init(options, function (err, waveformData) {
                if (err) {
                    callback(err);
                    return;
                }
                self._waveformData = waveformData;
                [
                    'overview',
                    'zoomview'
                ].forEach(function (viewName) {
                    var view = self.views.getView(viewName);
                    if (view) {
                        view.setWaveformData(waveformData);
                    }
                });
                self.zoom.setZoomLevels(options.zoomLevels);
                callback();
            });
        }
        self.once('player.canplay', playerCanPlayHandler);
        self.once('player.error', playerErrorHandler);
        self.options.mediaElement.setAttribute('src', options.mediaUrl);
    };
    Peaks.prototype.getWaveformData = function () {
        return this._waveformData;
    };
    Peaks.prototype._addWindowResizeHandler = function () {
        this._onResize = this._onResize.bind(this);
        window.addEventListener('resize', this._onResize);
    };
    Peaks.prototype._onResize = function () {
        this.emit('window_resize');
    };
    Peaks.prototype._removeWindowResizeHandler = function () {
        window.removeEventListener('resize', this._onResize);
    };
    Peaks.prototype.destroy = function () {
        this._removeWindowResizeHandler();
        if (this._keyboardHandler) {
            this._keyboardHandler.destroy();
        }
        if (this.views) {
            this.views.destroy();
        }
        if (this.player) {
            this.player.destroy();
        }
        if (this._cueEmitter) {
            this._cueEmitter.destroy();
        }
    };
    return Peaks;
}(_dereq_('colors.css'), _dereq_('eventemitter3'), _dereq_('./cue-emitter'), _dereq_('./waveform-points'), _dereq_('./waveform-segments'), _dereq_('./keyboard-handler'), _dereq_('./mediaelement-player'), _dereq_('./player'), _dereq_('./marker-factories'), _dereq_('./view-controller'), _dereq_('./zoom-controller'), _dereq_('./waveform-builder'), _dereq_('./utils'));
},{"./cue-emitter":68,"./keyboard-handler":73,"./marker-factories":75,"./mediaelement-player":76,"./player":78,"./utils":87,"./view-controller":88,"./waveform-builder":90,"./waveform-points":92,"./waveform-segments":93,"./zoom-controller":96,"colors.css":1,"eventemitter3":2}],75:[function(_dereq_,module,exports){
module.exports = function (DefaultPointMarker, DefaultSegmentMarker, Konva) {
    'use strict';
    function createSegmentMarker(options) {
        if (options.view === 'zoomview') {
            return new DefaultSegmentMarker(options);
        }
        return null;
    }
    function createSegmentLabel(options) {
        return new Konva.Text({
            x: 12,
            y: 12,
            text: options.segment.labelText,
            textAlign: 'center',
            fontSize: 12,
            fontFamily: 'Arial, sans-serif',
            fill: '#000'
        });
    }
    function createPointMarker(options) {
        return new DefaultPointMarker(options);
    }
    return {
        createSegmentMarker: createSegmentMarker,
        createSegmentLabel: createSegmentLabel,
        createPointMarker: createPointMarker
    };
}(_dereq_('./default-point-marker'), _dereq_('./default-segment-marker'), _dereq_('konva'));
},{"./default-point-marker":70,"./default-segment-marker":71,"konva":42}],76:[function(_dereq_,module,exports){
module.exports = function () {
    'use strict';
    function MediaElementPlayer(peaks, mediaElement) {
        var self = this;
        self._peaks = peaks;
        self._listeners = [];
        self._mediaElement = mediaElement;
        MediaElementPlayer.prototype._addMediaListener = function (type, callback) {
            this._listeners.push({
                type: type,
                callback: callback
            });
            this._mediaElement.addEventListener(type, callback);
        };
        MediaElementPlayer.prototype.init = function (player) {
            self._player = player;
            self._listeners = [];
            self._duration = self.getDuration();
            self._isPlaying = false;
            self._addMediaListener('timeupdate', function () {
                self._peaks.emit('player.timeupdate', self.getCurrentTime());
            });
            self._addMediaListener('play', function () {
                self._isPlaying = true;
                self._peaks.emit('player.play', self.getCurrentTime());
            });
            self._addMediaListener('pause', function () {
                self._isPlaying = false;
                self._peaks.emit('player.pause', self.getCurrentTime());
            });
            self._addMediaListener('seeked', function () {
                self._peaks.emit('player.seeked', self.getCurrentTime());
            });
            self._addMediaListener('canplay', function () {
                self._peaks.emit('player.canplay');
            });
            self._addMediaListener('error', function (event) {
                self._peaks.emit('player.error', event.target.error);
            });
            self._interval = null;
        };
        MediaElementPlayer.prototype.destroy = function () {
            for (var i = 0; i < this._listeners.length; i++) {
                var listener = this._listeners[i];
                this._mediaElement.removeEventListener(listener.type, listener.callback);
            }
            this._listeners.length = 0;
            this._mediaElement = null;
        };
        MediaElementPlayer.prototype.play = function () {
            return this._mediaElement.play();
        };
        MediaElementPlayer.prototype.pause = function () {
            this._mediaElement.pause();
        };
        MediaElementPlayer.prototype.isPlaying = function () {
            return this._isPlaying;
        };
        MediaElementPlayer.prototype.isSeeking = function () {
            return this._mediaElement.seeking;
        };
        MediaElementPlayer.prototype.getCurrentTime = function () {
            return this._mediaElement.currentTime;
        };
        MediaElementPlayer.prototype.getDuration = function () {
            return this._mediaElement.duration;
        };
        MediaElementPlayer.prototype.seek = function (time) {
            this._mediaElement.currentTime = time;
        };
    }
    return MediaElementPlayer;
}();
},{}],77:[function(_dereq_,module,exports){
module.exports = function (Konva) {
    'use strict';
    function getMarkerObject(obj) {
        while (obj.parent !== null) {
            if (obj.parent instanceof Konva.Layer) {
                return obj;
            }
            obj = obj.parent;
        }
        return null;
    }
    function MouseDragHandler(stage, handlers) {
        this._stage = stage;
        this._handlers = handlers;
        this._dragging = false;
        this._mouseDown = this._mouseDown.bind(this);
        this._mouseUp = this._mouseUp.bind(this);
        this._mouseMove = this._mouseMove.bind(this);
        this._stage.on('mousedown', this._mouseDown);
        this._stage.on('touchstart', this._mouseDown);
        this._mouseDownClientX = null;
    }
    MouseDragHandler.prototype._mouseDown = function (event) {
        var marker = getMarkerObject(event.target);
        if (marker && marker.attrs.draggable) {
            return;
        }
        if (event.type === 'touchstart') {
            this._mouseDownClientX = Math.floor(event.evt.touches[0].clientX);
        } else {
            this._mouseDownClientX = event.evt.clientX;
        }
        if (this._handlers.onMouseDown) {
            var mouseDownPosX = this._getMousePosX(this._mouseDownClientX);
            this._handlers.onMouseDown(mouseDownPosX);
        }
        window.addEventListener('mousemove', this._mouseMove, false);
        window.addEventListener('touchmove', this._mouseMove, false);
        window.addEventListener('mouseup', this._mouseUp, false);
        window.addEventListener('touchend', this._mouseUp, false);
        window.addEventListener('blur', this._mouseUp, false);
    };
    MouseDragHandler.prototype._mouseMove = function (event) {
        var clientX = null;
        if (event.type === 'touchmove') {
            clientX = Math.floor(event.changedTouches[0].clientX);
        } else {
            clientX = event.clientX;
        }
        if (clientX === this._mouseDownClientX) {
            return;
        }
        this._dragging = true;
        if (this._handlers.onMouseMove) {
            var mousePosX = this._getMousePosX(clientX);
            this._handlers.onMouseMove(mousePosX);
        }
    };
    MouseDragHandler.prototype._mouseUp = function (event) {
        var clientX = null;
        if (event.type === 'touchend') {
            clientX = Math.floor(event.changedTouches[0].clientX);
            if (event.cancelable) {
                event.preventDefault();
            }
        } else {
            clientX = event.clientX;
        }
        if (this._handlers.onMouseUp) {
            var mousePosX = this._getMousePosX(clientX);
            this._handlers.onMouseUp(mousePosX);
        }
        window.removeEventListener('mousemove', this._mouseMove, false);
        window.removeEventListener('touchmove', this._mouseMove, false);
        window.removeEventListener('mouseup', this._mouseUp, false);
        window.removeEventListener('touchend', this._mouseUp, false);
        window.removeEventListener('blur', this._mouseUp, false);
        this._dragging = false;
    };
    MouseDragHandler.prototype._getMousePosX = function (clientX) {
        var containerPos = this._stage.getContainer().getBoundingClientRect();
        return clientX - containerPos.left;
    };
    MouseDragHandler.prototype.isDragging = function () {
        return this._dragging;
    };
    return MouseDragHandler;
}(_dereq_('konva'));
},{"konva":42}],78:[function(_dereq_,module,exports){
module.exports = function (Utils) {
    'use strict';
    function validateAdapter(adapter) {
        var publicAdapterMethods = [
            'init',
            'destroy',
            'play',
            'pause',
            'isPlaying',
            'isSeeking',
            'getCurrentTime',
            'getDuration',
            'seek'
        ];
        function getAllPropertiesFrom(adapter) {
            var allProperties = [];
            var obj = adapter;
            while (obj) {
                Object.getOwnPropertyNames(obj).forEach(function (p) {
                    allProperties.push(p);
                });
                obj = Object.getPrototypeOf(obj);
            }
            return allProperties;
        }
        var allProperties = getAllPropertiesFrom(adapter);
        publicAdapterMethods.forEach(function (method) {
            if (!allProperties.includes(method)) {
                throw new TypeError('Peaks.init(): Player method ' + method + ' is undefined');
            }
            if (typeof adapter[method] !== 'function') {
                throw new TypeError('Peaks.init(): Player method ' + method + ' is not a function');
            }
        });
    }
    function Player(peaks, adapter) {
        var self = this;
        self._peaks = peaks;
        self._interval = null;
        validateAdapter(adapter);
        self._adapter = adapter;
        self._adapter.init(peaks);
        Player.prototype.destroy = function () {
            if (this._interval !== null) {
                clearTimeout(this._interval);
                this._interval = null;
            }
            this._adapter.destroy();
        };
        Player.prototype.play = function () {
            return this._adapter.play();
        };
        Player.prototype.pause = function () {
            this._adapter.pause();
        };
        Player.prototype.isPlaying = function () {
            return this._adapter.isPlaying();
        };
        Player.prototype.isSeeking = function () {
            return this._adapter.isSeeking();
        };
        Player.prototype.getCurrentTime = function () {
            return this._adapter.getCurrentTime();
        };
        Player.prototype.getDuration = function () {
            return this._adapter.getDuration();
        };
        Player.prototype.seek = function (time) {
            if (!Utils.isValidTime(time)) {
                this._peaks.logger('peaks.player.seek(): parameter must be a valid time, in seconds');
                return;
            }
            this._adapter.seek(time);
        };
        Player.prototype.playSegment = function (segment, loop) {
            var self = this;
            if (!segment || !Utils.isValidTime(segment.startTime) || !Utils.isValidTime(segment.endTime)) {
                self._peaks.logger('peaks.player.playSegment(): parameter must be a segment object');
                return;
            }
            clearTimeout(self._interval);
            self._interval = null;
            self.seek(segment.startTime);
            self.play();
            self._interval = setInterval(function () {
                if (!self.isPlaying()) {
                    clearTimeout(self._interval);
                    self._interval = null;
                    self.pause();
                } else if (self.getCurrentTime() >= segment.endTime) {
                    if (loop) {
                        self.seek(segment.startTime);
                    } else {
                        clearTimeout(self._interval);
                        self._interval = null;
                        self.pause();
                    }
                }
            }, 30);
        };
    }
    return Player;
}(_dereq_('./utils'));
},{"./utils":87}],79:[function(_dereq_,module,exports){
module.exports = function (Konva) {
    'use strict';
    function PlayheadLayer(peaks, view, showTime) {
        this._peaks = peaks;
        this._view = view;
        this._playheadPixel = 0;
        this._playheadLineAnimation = null;
        this._playheadVisible = false;
        this._playheadColor = peaks.options.playheadColor;
        this._playheadTextColor = peaks.options.playheadTextColor;
        this._playheadLayer = new Konva.Layer();
        this._createPlayhead(this._playheadColor);
        if (showTime) {
            this._createPlayheadText(this._playheadTextColor);
        }
        this.fitToView();
        this.zoomLevelChanged();
    }
    PlayheadLayer.prototype.addToStage = function (stage) {
        stage.add(this._playheadLayer);
    };
    PlayheadLayer.prototype.zoomLevelChanged = function () {
        var pixelsPerSecond = this._view.timeToPixels(1);
        var time;
        this._useAnimation = pixelsPerSecond >= 5;
        if (this._useAnimation) {
            if (this._peaks.player.isPlaying() && !this._playheadLineAnimation) {
                this._start();
            }
        } else {
            if (this._playheadLineAnimation) {
                time = this._peaks.player.getCurrentTime();
                this.stop(time);
            }
        }
    };
    PlayheadLayer.prototype.fitToView = function () {
        var height = this._view.getHeight();
        this._playheadLine.points([
            0.5,
            0,
            0.5,
            height
        ]);
        if (this._playheadText) {
            this._playheadText.y(12);
        }
    };
    PlayheadLayer.prototype._createPlayhead = function (color) {
        this._playheadLine = new Konva.Line({
            stroke: color,
            strokeWidth: 1
        });
        this._playheadGroup = new Konva.Group({
            x: 0,
            y: 0
        });
        this._playheadGroup.add(this._playheadLine);
        this._playheadLayer.add(this._playheadGroup);
    };
    PlayheadLayer.prototype._createPlayheadText = function (color) {
        var time = this._peaks.player.getCurrentTime();
        var text = this._view.formatTime(time);
        this._playheadText = new Konva.Text({
            x: 2,
            y: 0,
            text: text,
            fontSize: 11,
            fontFamily: 'sans-serif',
            fill: color,
            align: 'right'
        });
        this._playheadGroup.add(this._playheadText);
    };
    PlayheadLayer.prototype.updatePlayheadTime = function (time) {
        this._syncPlayhead(time);
        if (this._peaks.player.isPlaying()) {
            this._start();
        }
    };
    PlayheadLayer.prototype._syncPlayhead = function (time) {
        var pixelIndex = this._view.timeToPixels(time);
        var frameOffset = this._view.getFrameOffset();
        var width = this._view.getWidth();
        var isVisible = pixelIndex >= frameOffset && pixelIndex < frameOffset + width;
        this._playheadPixel = pixelIndex;
        if (isVisible) {
            var playheadX = this._playheadPixel - frameOffset;
            if (!this._playheadVisible) {
                this._playheadVisible = true;
                this._playheadGroup.show();
            }
            this._playheadGroup.setAttr('x', playheadX);
            if (this._playheadText) {
                var text = this._view.formatTime(time);
                var playheadTextWidth = this._playheadText.getTextWidth();
                this._playheadText.setText(text);
                if (playheadTextWidth + playheadX > width - 2) {
                    this._playheadText.setAttr('x', -playheadTextWidth - 2);
                } else if (playheadTextWidth + playheadX < width) {
                    this._playheadText.setAttr('x', 2);
                }
            }
            this._playheadLayer.draw();
        } else {
            if (this._playheadVisible) {
                this._playheadVisible = false;
                this._playheadGroup.hide();
                this._playheadLayer.draw();
            }
        }
    };
    PlayheadLayer.prototype._start = function () {
        var self = this;
        if (self._playheadLineAnimation) {
            self._playheadLineAnimation.stop();
            self._playheadLineAnimation = null;
        }
        if (!self._useAnimation) {
            return;
        }
        var lastPlayheadPosition = null;
        self._playheadLineAnimation = new Konva.Animation(function () {
            var time = self._peaks.player.getCurrentTime();
            var playheadPosition = self._view.timeToPixels(time);
            if (playheadPosition !== lastPlayheadPosition) {
                self._syncPlayhead(time);
                lastPlayheadPosition = playheadPosition;
            }
        }, self._playheadLayer);
        self._playheadLineAnimation.start();
    };
    PlayheadLayer.prototype.stop = function (time) {
        if (this._playheadLineAnimation) {
            this._playheadLineAnimation.stop();
            this._playheadLineAnimation = null;
        }
        this._syncPlayhead(time);
    };
    PlayheadLayer.prototype.getPlayheadOffset = function () {
        return this._playheadPixel - this._view.getFrameOffset();
    };
    PlayheadLayer.prototype.getPlayheadPixel = function () {
        return this._playheadPixel;
    };
    PlayheadLayer.prototype.showPlayheadTime = function (show) {
        var updated = false;
        if (show) {
            if (!this._playheadText) {
                this._createPlayheadText(this._playheadTextColor);
                this.fitToView();
                updated = true;
            }
        } else {
            if (this._playheadText) {
                this._playheadText.remove();
                this._playheadText.destroy();
                this._playheadText = null;
                updated = true;
            }
        }
        if (updated) {
            this._playheadLayer.draw();
        }
    };
    PlayheadLayer.prototype.updatePlayheadText = function () {
        if (this._playheadText) {
            var time = this._peaks.player.getCurrentTime();
            var text = this._view.formatTime(time);
            this._playheadText.setText(text);
        }
        this._playheadLayer.draw();
    };
    PlayheadLayer.prototype.destroy = function () {
        if (this._playheadLineAnimation) {
            this._playheadLineAnimation.stop();
            this._playheadLineAnimation = null;
        }
    };
    return PlayheadLayer;
}(_dereq_('konva'));
},{"konva":42}],80:[function(_dereq_,module,exports){
module.exports = function (Konva) {
    'use strict';
    function PointMarker(options) {
        this._point = options.point;
        this._marker = options.marker;
        this._draggable = options.draggable;
        this._onDblClick = options.onDblClick;
        this._onDragStart = options.onDragStart;
        this._onDragMove = options.onDragMove;
        this._onDragEnd = options.onDragEnd;
        this._onMouseEnter = options.onMouseEnter;
        this._onMouseLeave = options.onMouseLeave;
        this._dragBoundFunc = this._dragBoundFunc.bind(this);
        this._group = new Konva.Group({
            draggable: this._draggable,
            dragBoundFunc: this._dragBoundFunc
        });
        this._bindDefaultEventHandlers();
        this._marker.init(this._group);
    }
    PointMarker.prototype._bindDefaultEventHandlers = function () {
        var self = this;
        self._group.on('dragstart', function () {
            self._onDragStart(self._point);
        });
        self._group.on('dragmove', function () {
            self._onDragMove(self._point);
        });
        self._group.on('dragend', function () {
            self._onDragEnd(self._point);
        });
        self._group.on('dblclick', function () {
            self._onDblClick(self._point);
        });
        self._group.on('mouseenter', function () {
            self._onMouseEnter(self._point);
        });
        self._group.on('mouseleave', function () {
            self._onMouseLeave(self._point);
        });
    };
    PointMarker.prototype._dragBoundFunc = function (pos) {
        return {
            x: pos.x,
            y: this._group.getAbsolutePosition().y
        };
    };
    PointMarker.prototype.addToLayer = function (layer) {
        layer.add(this._group);
    };
    PointMarker.prototype.fitToView = function () {
        this._marker.fitToView();
    };
    PointMarker.prototype.getPoint = function () {
        return this._point;
    };
    PointMarker.prototype.getX = function () {
        return this._group.getX();
    };
    PointMarker.prototype.getWidth = function () {
        return this._group.getWidth();
    };
    PointMarker.prototype.setX = function (x) {
        this._group.setX(x);
    };
    PointMarker.prototype.timeUpdated = function (time) {
        if (this._marker.timeUpdated) {
            this._marker.timeUpdated(time);
        }
    };
    PointMarker.prototype.destroy = function () {
        if (this._marker.destroy) {
            this._marker.destroy();
        }
        this._group.destroyChildren();
        this._group.destroy();
    };
    return PointMarker;
}(_dereq_('konva'));
},{"konva":42}],81:[function(_dereq_,module,exports){
module.exports = function (Utils) {
    'use strict';
    var pointOptions = [
        'peaks',
        'id',
        'time',
        'labelText',
        'color',
        'editable'
    ];
    function validatePoint(options, context) {
        if (!Utils.isValidTime(options.time)) {
            throw new TypeError('peaks.points.' + context + ': time should be a numeric value');
        }
        if (options.time < 0) {
            throw new RangeError('peaks.points.' + context + ': time should not be negative');
        }
        if (Utils.isNullOrUndefined(options.labelText)) {
            options.labelText = '';
        } else if (!Utils.isString(options.labelText)) {
            throw new TypeError('peaks.points.' + context + ': labelText must be a string');
        }
        if (!Utils.isBoolean(options.editable)) {
            throw new TypeError('peaks.points.' + context + ': editable must be true or false');
        }
    }
    function Point(options) {
        validatePoint(options, 'add()');
        this._peaks = options.peaks;
        this._id = options.id;
        this._time = options.time;
        this._labelText = options.labelText;
        this._color = options.color;
        this._editable = options.editable;
        this._setUserData(options);
    }
    Point.prototype._setUserData = function (options) {
        for (var key in options) {
            if (Utils.objectHasProperty(options, key) && pointOptions.indexOf(key) === -1) {
                this[key] = options[key];
            }
        }
    };
    Object.defineProperties(Point.prototype, {
        id: {
            enumerable: true,
            get: function () {
                return this._id;
            }
        },
        time: {
            enumerable: true,
            get: function () {
                return this._time;
            }
        },
        labelText: {
            get: function () {
                return this._labelText;
            }
        },
        color: {
            enumerable: true,
            get: function () {
                return this._color;
            }
        },
        editable: {
            enumerable: true,
            get: function () {
                return this._editable;
            }
        }
    });
    Point.prototype.update = function (options) {
        var opts = {
            time: this.time,
            labelText: this.labelText,
            color: this.color,
            editable: this.editable
        };
        Utils.extend(opts, options);
        validatePoint(opts, 'update()');
        this._time = opts.time;
        this._labelText = opts.labelText;
        this._color = opts.color;
        this._editable = opts.editable;
        this._setUserData(options);
        this._peaks.emit('points.update', this);
    };
    Point.prototype.isVisible = function (startTime, endTime) {
        return this.time >= startTime && this.time < endTime;
    };
    Point.prototype._setTime = function (time) {
        this._time = time;
    };
    return Point;
}(_dereq_('./utils'));
},{"./utils":87}],82:[function(_dereq_,module,exports){
module.exports = function (PointMarker, Utils, Konva) {
    'use strict';
    function PointsLayer(peaks, view, allowEditing) {
        this._peaks = peaks;
        this._view = view;
        this._allowEditing = allowEditing;
        this._pointMarkers = {};
        this._layer = new Konva.Layer();
        this._onPointsDrag = this._onPointsDrag.bind(this);
        this._onPointHandleDblClick = this._onPointHandleDblClick.bind(this);
        this._onPointHandleDragStart = this._onPointHandleDragStart.bind(this);
        this._onPointHandleDragMove = this._onPointHandleDragMove.bind(this);
        this._onPointHandleDragEnd = this._onPointHandleDragEnd.bind(this);
        this._onPointHandleMouseEnter = this._onPointHandleMouseEnter.bind(this);
        this._onPointHandleMouseLeave = this._onPointHandleMouseLeave.bind(this);
        this._onPointsUpdate = this._onPointsUpdate.bind(this);
        this._onPointsAdd = this._onPointsAdd.bind(this);
        this._onPointsRemove = this._onPointsRemove.bind(this);
        this._onPointsRemoveAll = this._onPointsRemoveAll.bind(this);
        this._peaks.on('points.update', this._onPointsUpdate);
        this._peaks.on('points.add', this._onPointsAdd);
        this._peaks.on('points.remove', this._onPointsRemove);
        this._peaks.on('points.remove_all', this._onPointsRemoveAll);
        this._peaks.on('points.dragstart', this._onPointsDrag);
        this._peaks.on('points.dragmove', this._onPointsDrag);
        this._peaks.on('points.dragend', this._onPointsDrag);
    }
    PointsLayer.prototype.addToStage = function (stage) {
        stage.add(this._layer);
    };
    PointsLayer.prototype.enableEditing = function (enable) {
        this._allowEditing = enable;
    };
    PointsLayer.prototype.formatTime = function (time) {
        return this._view.formatTime(time);
    };
    PointsLayer.prototype._onPointsUpdate = function (point) {
        var frameOffset = this._view.getFrameOffset();
        var width = this._view.getWidth();
        var frameStartTime = this._view.pixelsToTime(frameOffset);
        var frameEndTime = this._view.pixelsToTime(frameOffset + width);
        this._removePoint(point);
        if (point.isVisible(frameStartTime, frameEndTime)) {
            this._addPointMarker(point);
        }
        this.updatePoints(frameStartTime, frameEndTime);
    };
    PointsLayer.prototype._onPointsAdd = function (points) {
        var self = this;
        var frameOffset = self._view.getFrameOffset();
        var width = self._view.getWidth();
        var frameStartTime = self._view.pixelsToTime(frameOffset);
        var frameEndTime = self._view.pixelsToTime(frameOffset + width);
        points.forEach(function (point) {
            if (point.isVisible(frameStartTime, frameEndTime)) {
                self._addPointMarker(point);
            }
        });
        self.updatePoints(frameStartTime, frameEndTime);
    };
    PointsLayer.prototype._onPointsRemove = function (points) {
        var self = this;
        points.forEach(function (point) {
            self._removePoint(point);
        });
        self._layer.draw();
    };
    PointsLayer.prototype._onPointsRemoveAll = function () {
        this._layer.removeChildren();
        this._pointMarkers = {};
        this._layer.draw();
    };
    PointsLayer.prototype._onPointsDrag = function (point) {
        this._updatePoint(point);
        this._layer.draw();
    };
    PointsLayer.prototype._createPointMarker = function (point) {
        var editable = this._allowEditing && point.editable;
        var marker = this._peaks.options.createPointMarker({
            point: point,
            draggable: editable,
            color: point.color ? point.color : this._peaks.options.pointMarkerColor,
            layer: this,
            view: this._view.getName()
        });
        return new PointMarker({
            point: point,
            draggable: editable,
            marker: marker,
            onDblClick: this._onPointHandleDblClick,
            onDragStart: this._onPointHandleDragStart,
            onDragMove: this._onPointHandleDragMove,
            onDragEnd: this._onPointHandleDragEnd,
            onMouseEnter: this._onPointHandleMouseEnter,
            onMouseLeave: this._onPointHandleMouseLeave
        });
    };
    PointsLayer.prototype.getHeight = function () {
        return this._view.getHeight();
    };
    PointsLayer.prototype._addPointMarker = function (point) {
        var pointMarker = this._createPointMarker(point);
        this._pointMarkers[point.id] = pointMarker;
        pointMarker.addToLayer(this._layer);
        return pointMarker;
    };
    PointsLayer.prototype._onPointHandleDragMove = function (point) {
        var pointMarker = this._pointMarkers[point.id];
        var markerX = pointMarker.getX();
        if (markerX >= 0 && markerX < this._view.getWidth()) {
            var offset = this._view.getFrameOffset() + markerX + pointMarker.getWidth();
            point._setTime(this._view.pixelsToTime(offset));
            pointMarker.timeUpdated(point.time);
        }
        this._peaks.emit('points.dragmove', point);
    };
    PointsLayer.prototype._onPointHandleMouseEnter = function (point) {
        this._peaks.emit('points.mouseenter', point);
    };
    PointsLayer.prototype._onPointHandleMouseLeave = function (point) {
        this._peaks.emit('points.mouseleave', point);
    };
    PointsLayer.prototype._onPointHandleDblClick = function (point) {
        this._peaks.emit('points.dblclick', point);
    };
    PointsLayer.prototype._onPointHandleDragStart = function (point) {
        this._peaks.emit('points.dragstart', point);
    };
    PointsLayer.prototype._onPointHandleDragEnd = function (point) {
        this._peaks.emit('points.dragend', point);
    };
    PointsLayer.prototype.updatePoints = function (startTime, endTime) {
        var points = this._peaks.points.find(startTime, endTime);
        var count = points.length;
        points.forEach(this._updatePoint.bind(this));
        count += this._removeInvisiblePoints(startTime, endTime);
        if (count > 0) {
            this._layer.draw();
        }
    };
    PointsLayer.prototype._updatePoint = function (point) {
        var pointMarker = this._findOrAddPointMarker(point);
        var pointMarkerOffset = this._view.timeToPixels(point.time);
        var pointMarkerX = pointMarkerOffset - this._view.getFrameOffset();
        pointMarker.setX(pointMarkerX);
    };
    PointsLayer.prototype._findOrAddPointMarker = function (point) {
        var pointMarker = this._pointMarkers[point.id];
        if (!pointMarker) {
            pointMarker = this._addPointMarker(point);
        }
        return pointMarker;
    };
    PointsLayer.prototype._removeInvisiblePoints = function (startTime, endTime) {
        var count = 0;
        for (var pointId in this._pointMarkers) {
            if (Utils.objectHasProperty(this._pointMarkers, pointId)) {
                var point = this._pointMarkers[pointId].getPoint();
                if (!point.isVisible(startTime, endTime)) {
                    this._removePoint(point);
                    count++;
                }
            }
        }
        return count;
    };
    PointsLayer.prototype._removePoint = function (point) {
        var pointMarker = this._pointMarkers[point.id];
        if (pointMarker) {
            pointMarker.destroy();
            delete this._pointMarkers[point.id];
        }
    };
    PointsLayer.prototype.setVisible = function (visible) {
        this._layer.setVisible(visible);
    };
    PointsLayer.prototype.destroy = function () {
        this._peaks.off('points.update', this._onPointsUpdate);
        this._peaks.off('points.add', this._onPointsAdd);
        this._peaks.off('points.remove', this._onPointsRemove);
        this._peaks.off('points.remove_all', this._onPointsRemoveAll);
        this._peaks.off('points.dragstart', this._onPointsDrag);
        this._peaks.off('points.dragmove', this._onPointsDrag);
        this._peaks.off('points.dragend', this._onPointsDrag);
    };
    PointsLayer.prototype.fitToView = function () {
        for (var pointId in this._pointMarkers) {
            if (Utils.objectHasProperty(this._pointMarkers, pointId)) {
                var pointMarker = this._pointMarkers[pointId];
                pointMarker.fitToView();
            }
        }
    };
    PointsLayer.prototype.draw = function () {
        this._layer.draw();
    };
    return PointsLayer;
}(_dereq_('./point-marker'), _dereq_('./utils'), _dereq_('konva'));
},{"./point-marker":80,"./utils":87,"konva":42}],83:[function(_dereq_,module,exports){
module.exports = function (Konva) {
    'use strict';
    function SegmentMarker(options) {
        this._segment = options.segment;
        this._marker = options.marker;
        this._segmentShape = options.segmentShape;
        this._draggable = options.draggable;
        this._layer = options.layer;
        this._startMarker = options.startMarker;
        this._onDrag = options.onDrag;
        this._onDragStart = options.onDragStart;
        this._onDragEnd = options.onDragEnd;
        this._dragBoundFunc = this._dragBoundFunc.bind(this);
        this._group = new Konva.Group({
            draggable: this._draggable,
            dragBoundFunc: this._dragBoundFunc
        });
        this._bindDefaultEventHandlers();
        this._marker.init(this._group);
    }
    SegmentMarker.prototype._bindDefaultEventHandlers = function () {
        var self = this;
        if (self._draggable) {
            self._group.on('dragmove', function () {
                self._onDrag(self);
            });
            self._group.on('dragstart', function () {
                self._onDragStart(self);
            });
            self._group.on('dragend', function () {
                self._onDragEnd(self);
            });
        }
    };
    SegmentMarker.prototype._dragBoundFunc = function (pos) {
        var marker;
        var limit;
        if (this._startMarker) {
            marker = this._segmentShape.getEndMarker();
            limit = marker.getX() - marker.getWidth();
            if (pos.x > limit) {
                pos.x = limit;
            }
        } else {
            marker = this._segmentShape.getStartMarker();
            limit = marker.getX() + marker.getWidth();
            if (pos.x < limit) {
                pos.x = limit;
            }
        }
        return {
            x: pos.x,
            y: this._group.getAbsolutePosition().y
        };
    };
    SegmentMarker.prototype.addToLayer = function (layer) {
        layer.add(this._group);
    };
    SegmentMarker.prototype.fitToView = function () {
        this._marker.fitToView();
    };
    SegmentMarker.prototype.getSegment = function () {
        return this._segment;
    };
    SegmentMarker.prototype.getX = function () {
        return this._group.getX();
    };
    SegmentMarker.prototype.getWidth = function () {
        return this._group.getWidth();
    };
    SegmentMarker.prototype.isStartMarker = function () {
        return this._startMarker;
    };
    SegmentMarker.prototype.setX = function (x) {
        this._group.setX(x);
    };
    SegmentMarker.prototype.timeUpdated = function (time) {
        if (this._marker.timeUpdated) {
            this._marker.timeUpdated(time);
        }
    };
    SegmentMarker.prototype.destroy = function () {
        if (this._marker.destroy) {
            this._marker.destroy();
        }
        this._group.destroyChildren();
        this._group.destroy();
    };
    return SegmentMarker;
}(_dereq_('konva'));
},{"konva":42}],84:[function(_dereq_,module,exports){
module.exports = function (SegmentMarker, WaveformShape) {
    'use strict';
    function SegmentShape(segment, peaks, layer, view) {
        this._segment = segment;
        this._peaks = peaks;
        this._layer = layer;
        this._view = view;
        this._waveformShape = null;
        this._label = null;
        this._startMarker = null;
        this._endMarker = null;
        this._waveformShape = new WaveformShape({
            color: segment.color,
            view: view,
            segment: segment
        });
        this._onMouseEnter = this._onMouseEnter.bind(this);
        this._onMouseLeave = this._onMouseLeave.bind(this);
        this._onClick = this._onClick.bind(this);
        this._waveformShape.on('mouseenter', this._onMouseEnter);
        this._waveformShape.on('mouseleave', this._onMouseLeave);
        this._waveformShape.on('click', this._onClick);
        this._onSegmentHandleDrag = this._onSegmentHandleDrag.bind(this);
        this._onSegmentHandleDragStart = this._onSegmentHandleDragStart.bind(this);
        this._onSegmentHandleDragEnd = this._onSegmentHandleDragEnd.bind(this);
        this._label = this._peaks.options.createSegmentLabel({
            segment: segment,
            view: this._view.getName(),
            layer: this._layer
        });
        if (this._label) {
            this._label.hide();
        }
        this._createMarkers();
    }
    SegmentShape.prototype.getSegment = function () {
        return this._segment;
    };
    SegmentShape.prototype.getStartMarker = function () {
        return this._startMarker;
    };
    SegmentShape.prototype.getEndMarker = function () {
        return this._endMarker;
    };
    SegmentShape.prototype.addToLayer = function (layer) {
        layer.add(this._waveformShape);
        if (this._label) {
            layer.add(this._label);
        }
        if (this._startMarker) {
            this._startMarker.addToLayer(layer);
        }
        if (this._endMarker) {
            this._endMarker.addToLayer(layer);
        }
    };
    SegmentShape.prototype._createMarkers = function () {
        var editable = this._layer.isEditingEnabled() && this._segment.editable;
        if (!editable) {
            return;
        }
        var startMarker = this._peaks.options.createSegmentMarker({
            segment: this._segment,
            draggable: editable,
            startMarker: true,
            color: this._peaks.options.segmentStartMarkerColor,
            layer: this._layer,
            view: this._view.getName()
        });
        if (startMarker) {
            this._startMarker = new SegmentMarker({
                segment: this._segment,
                segmentShape: this,
                draggable: editable,
                startMarker: true,
                marker: startMarker,
                onDrag: this._onSegmentHandleDrag,
                onDragStart: this._onSegmentHandleDragStart,
                onDragEnd: this._onSegmentHandleDragEnd
            });
        }
        var endMarker = this._peaks.options.createSegmentMarker({
            segment: this._segment,
            draggable: editable,
            startMarker: false,
            color: this._peaks.options.segmentEndMarkerColor,
            layer: this._layer,
            view: this._view.getName()
        });
        if (endMarker) {
            this._endMarker = new SegmentMarker({
                segment: this._segment,
                segmentShape: this,
                draggable: editable,
                startMarker: false,
                marker: endMarker,
                onDrag: this._onSegmentHandleDrag,
                onDragStart: this._onSegmentHandleDragStart,
                onDragEnd: this._onSegmentHandleDragEnd
            });
        }
    };
    SegmentShape.prototype._onMouseEnter = function () {
        if (this._label) {
            this._label.show();
            this._layer.draw();
        }
        this._peaks.emit('segments.mouseenter', this._segment);
    };
    SegmentShape.prototype._onMouseLeave = function () {
        if (this._label) {
            this._label.hide();
            this._layer.draw();
        }
        this._peaks.emit('segments.mouseleave', this._segment);
    };
    SegmentShape.prototype._onClick = function () {
        this._peaks.emit('segments.click', this._segment);
    };
    SegmentShape.prototype._onSegmentHandleDrag = function (segmentMarker) {
        var frameOffset = this._view.getFrameOffset();
        var width = this._view.getWidth();
        var startMarker = segmentMarker.isStartMarker();
        var startMarkerX = this._startMarker.getX();
        var endMarkerX = this._endMarker.getX();
        if (startMarker && startMarkerX >= 0) {
            var startMarkerOffset = frameOffset + startMarkerX + this._startMarker.getWidth();
            this._segment._setStartTime(this._view.pixelsToTime(startMarkerOffset));
            segmentMarker.timeUpdated(this._segment.startTime);
        }
        if (!startMarker && endMarkerX < width) {
            var endMarkerOffset = frameOffset + endMarkerX;
            this._segment._setEndTime(this._view.pixelsToTime(endMarkerOffset));
            segmentMarker.timeUpdated(this._segment.endTime);
        }
        this._peaks.emit('segments.dragged', this._segment, startMarker);
    };
    SegmentShape.prototype._onSegmentHandleDragStart = function (segmentMarker) {
        var startMarker = segmentMarker.isStartMarker();
        this._peaks.emit('segments.dragstart', this._segment, startMarker);
    };
    SegmentShape.prototype._onSegmentHandleDragEnd = function (segmentMarker) {
        var startMarker = segmentMarker.isStartMarker();
        this._peaks.emit('segments.dragend', this._segment, startMarker);
    };
    SegmentShape.prototype.fitToView = function () {
        if (this._startMarker) {
            this._startMarker.fitToView();
        }
        if (this._endMarker) {
            this._endMarker.fitToView();
        }
    };
    SegmentShape.prototype.destroy = function () {
        this._waveformShape.destroy();
        if (this._label) {
            this._label.destroy();
        }
        if (this._startMarker) {
            this._startMarker.destroy();
        }
        if (this._endMarker) {
            this._endMarker.destroy();
        }
    };
    return SegmentShape;
}(_dereq_('./segment-marker'), _dereq_('./waveform-shape'));
},{"./segment-marker":83,"./waveform-shape":94}],85:[function(_dereq_,module,exports){
module.exports = function (Utils) {
    'use strict';
    var segmentOptions = [
        'peaks',
        'id',
        'startTime',
        'endTime',
        'labelText',
        'color',
        'editable'
    ];
    function validateSegment(options, context) {
        if (!Utils.isValidTime(options.startTime)) {
            throw new TypeError('peaks.segments.' + context + ': startTime should be a valid number');
        }
        if (!Utils.isValidTime(options.endTime)) {
            throw new TypeError('peaks.segments.' + context + ': endTime should be a valid number');
        }
        if (options.startTime < 0) {
            throw new RangeError('peaks.segments.' + context + ': startTime should not be negative');
        }
        if (options.endTime < 0) {
            throw new RangeError('peaks.segments.' + context + ': endTime should not be negative');
        }
        if (options.endTime < options.startTime) {
            throw new RangeError('peaks.segments.' + context + ': endTime should not be less than startTime');
        }
        if (Utils.isNullOrUndefined(options.labelText)) {
            options.labelText = '';
        } else if (!Utils.isString(options.labelText)) {
            throw new TypeError('peaks.segments.' + context + ': labelText must be a string');
        }
        if (!Utils.isBoolean(options.editable)) {
            throw new TypeError('peaks.segments.' + context + ': editable must be true or false');
        }
    }
    function Segment(options) {
        validateSegment(options, 'add()');
        this._peaks = options.peaks;
        this._id = options.id;
        this._startTime = options.startTime;
        this._endTime = options.endTime;
        this._labelText = options.labelText;
        this._color = options.color;
        this._editable = options.editable;
        this._setUserData(options);
    }
    Segment.prototype._setUserData = function (options) {
        for (var key in options) {
            if (Utils.objectHasProperty(options, key) && segmentOptions.indexOf(key) === -1) {
                this[key] = options[key];
            }
        }
    };
    Object.defineProperties(Segment.prototype, {
        id: {
            enumerable: true,
            get: function () {
                return this._id;
            }
        },
        startTime: {
            enumerable: true,
            get: function () {
                return this._startTime;
            }
        },
        endTime: {
            enumerable: true,
            get: function () {
                return this._endTime;
            }
        },
        labelText: {
            enumerable: true,
            get: function () {
                return this._labelText;
            }
        },
        color: {
            enumerable: true,
            get: function () {
                return this._color;
            }
        },
        editable: {
            enumerable: true,
            get: function () {
                return this._editable;
            }
        }
    });
    Segment.prototype.update = function (options) {
        var opts = {
            startTime: this.startTime,
            endTime: this.endTime,
            labelText: this.labelText,
            color: this.color,
            editable: this.editable
        };
        Utils.extend(opts, options);
        validateSegment(opts, 'update()');
        this._startTime = opts.startTime;
        this._endTime = opts.endTime;
        this._labelText = opts.labelText;
        this._color = opts.color;
        this._editable = opts.editable;
        this._setUserData(options);
        this._peaks.emit('segments.update', this);
    };
    Segment.prototype.isVisible = function (startTime, endTime) {
        return this.startTime < endTime && startTime < this.endTime;
    };
    Segment.prototype._setStartTime = function (time) {
        this._startTime = time;
    };
    Segment.prototype._setEndTime = function (time) {
        this._endTime = time;
    };
    return Segment;
}(_dereq_('./utils'));
},{"./utils":87}],86:[function(_dereq_,module,exports){
module.exports = function (SegmentShape, Utils, Konva) {
    'use strict';
    function SegmentsLayer(peaks, view, allowEditing) {
        this._peaks = peaks;
        this._view = view;
        this._allowEditing = allowEditing;
        this._segmentShapes = {};
        this._layer = new Konva.Layer();
        this._onSegmentsUpdate = this._onSegmentsUpdate.bind(this);
        this._onSegmentsAdd = this._onSegmentsAdd.bind(this);
        this._onSegmentsRemove = this._onSegmentsRemove.bind(this);
        this._onSegmentsRemoveAll = this._onSegmentsRemoveAll.bind(this);
        this._onSegmentsDragged = this._onSegmentsDragged.bind(this);
        this._peaks.on('segments.update', this._onSegmentsUpdate);
        this._peaks.on('segments.add', this._onSegmentsAdd);
        this._peaks.on('segments.remove', this._onSegmentsRemove);
        this._peaks.on('segments.remove_all', this._onSegmentsRemoveAll);
        this._peaks.on('segments.dragged', this._onSegmentsDragged);
    }
    SegmentsLayer.prototype.addToStage = function (stage) {
        stage.add(this._layer);
    };
    SegmentsLayer.prototype.enableEditing = function (enable) {
        this._allowEditing = enable;
    };
    SegmentsLayer.prototype.isEditingEnabled = function () {
        return this._allowEditing;
    };
    SegmentsLayer.prototype.formatTime = function (time) {
        return this._view.formatTime(time);
    };
    SegmentsLayer.prototype._onSegmentsUpdate = function (segment) {
        var redraw = false;
        var segmentShape = this._segmentShapes[segment.id];
        var frameOffset = this._view.getFrameOffset();
        var width = this._view.getWidth();
        var frameStartTime = this._view.pixelsToTime(frameOffset);
        var frameEndTime = this._view.pixelsToTime(frameOffset + width);
        if (segmentShape) {
            this._removeSegment(segment);
            redraw = true;
        }
        if (segment.isVisible(frameStartTime, frameEndTime)) {
            this._addSegmentShape(segment);
            redraw = true;
        }
        if (redraw) {
            this.updateSegments(frameStartTime, frameEndTime);
        }
    };
    SegmentsLayer.prototype._onSegmentsAdd = function (segments) {
        var self = this;
        var frameOffset = self._view.getFrameOffset();
        var width = self._view.getWidth();
        var frameStartTime = self._view.pixelsToTime(frameOffset);
        var frameEndTime = self._view.pixelsToTime(frameOffset + width);
        segments.forEach(function (segment) {
            if (segment.isVisible(frameStartTime, frameEndTime)) {
                self._addSegmentShape(segment);
            }
        });
        self.updateSegments(frameStartTime, frameEndTime);
    };
    SegmentsLayer.prototype._onSegmentsRemove = function (segments) {
        var self = this;
        segments.forEach(function (segment) {
            self._removeSegment(segment);
        });
        self._layer.draw();
    };
    SegmentsLayer.prototype._onSegmentsRemoveAll = function () {
        this._layer.removeChildren();
        this._segmentShapes = {};
        this._layer.draw();
    };
    SegmentsLayer.prototype._onSegmentsDragged = function (segment) {
        this._updateSegment(segment);
        this._layer.draw();
    };
    SegmentsLayer.prototype._createSegmentShape = function (segment) {
        return new SegmentShape(segment, this._peaks, this, this._view);
    };
    SegmentsLayer.prototype._addSegmentShape = function (segment) {
        var segmentShape = this._createSegmentShape(segment);
        segmentShape.addToLayer(this._layer);
        this._segmentShapes[segment.id] = segmentShape;
        return segmentShape;
    };
    SegmentsLayer.prototype.updateSegments = function (startTime, endTime) {
        var segments = this._peaks.segments.find(startTime, endTime);
        var count = segments.length;
        segments.forEach(this._updateSegment.bind(this));
        count += this._removeInvisibleSegments(startTime, endTime);
        if (count > 0) {
            this._layer.draw();
        }
    };
    SegmentsLayer.prototype._updateSegment = function (segment) {
        var segmentShape = this._findOrAddSegmentShape(segment);
        var segmentStartOffset = this._view.timeToPixels(segment.startTime);
        var segmentEndOffset = this._view.timeToPixels(segment.endTime);
        var frameStartOffset = this._view.getFrameOffset();
        var startPixel = segmentStartOffset - frameStartOffset;
        var endPixel = segmentEndOffset - frameStartOffset;
        var marker = segmentShape.getStartMarker();
        if (marker) {
            marker.setX(startPixel - marker.getWidth());
        }
        marker = segmentShape.getEndMarker();
        if (marker) {
            marker.setX(endPixel);
        }
    };
    SegmentsLayer.prototype._findOrAddSegmentShape = function (segment) {
        var segmentShape = this._segmentShapes[segment.id];
        if (!segmentShape) {
            segmentShape = this._addSegmentShape(segment);
        }
        return segmentShape;
    };
    SegmentsLayer.prototype._removeInvisibleSegments = function (startTime, endTime) {
        var count = 0;
        for (var segmentId in this._segmentShapes) {
            if (Utils.objectHasProperty(this._segmentShapes, segmentId)) {
                var segment = this._segmentShapes[segmentId].getSegment();
                if (!segment.isVisible(startTime, endTime)) {
                    this._removeSegment(segment);
                    count++;
                }
            }
        }
        return count;
    };
    SegmentsLayer.prototype._removeSegment = function (segment) {
        var segmentShape = this._segmentShapes[segment.id];
        if (segmentShape) {
            segmentShape.destroy();
            delete this._segmentShapes[segment.id];
        }
    };
    SegmentsLayer.prototype.setVisible = function (visible) {
        this._layer.setVisible(visible);
    };
    SegmentsLayer.prototype.draw = function () {
        this._layer.draw();
    };
    SegmentsLayer.prototype.destroy = function () {
        this._peaks.off('segments.update', this._onSegmentsUpdate);
        this._peaks.off('segments.add', this._onSegmentsAdd);
        this._peaks.off('segments.remove', this._onSegmentsRemove);
        this._peaks.off('segments.remove_all', this._onSegmentsRemoveAll);
        this._peaks.off('segments.dragged', this._onSegmentsDragged);
    };
    SegmentsLayer.prototype.fitToView = function () {
        for (var segmentId in this._segmentShapes) {
            if (Utils.objectHasProperty(this._segmentShapes, segmentId)) {
                var segmentShape = this._segmentShapes[segmentId];
                segmentShape.fitToView();
            }
        }
    };
    SegmentsLayer.prototype.draw = function () {
        this._layer.draw();
    };
    SegmentsLayer.prototype.getHeight = function () {
        return this._layer.getHeight();
    };
    return SegmentsLayer;
}(_dereq_('./segment-shape'), _dereq_('./utils'), _dereq_('konva'));
},{"./segment-shape":84,"./utils":87,"konva":42}],87:[function(_dereq_,module,exports){
module.exports = function () {
    'use strict';
    if (typeof Number.isFinite !== 'function') {
        Number.isFinite = function isFinite(value) {
            if (typeof value !== 'number') {
                return false;
            }
            if (value !== value || value === Infinity || value === -Infinity) {
                return false;
            }
            return true;
        };
    }
    function zeroPad(number, precision) {
        number = number.toString();
        while (number.length < precision) {
            number = '0' + number;
        }
        return number;
    }
    return {
        formatTime: function (time, precision) {
            var result = [];
            var fractionSeconds = Math.floor(time % 1 * Math.pow(10, precision));
            var seconds = Math.floor(time);
            var minutes = Math.floor(seconds / 60);
            var hours = Math.floor(minutes / 60);
            if (hours > 0) {
                result.push(hours);
            }
            result.push(minutes % 60);
            result.push(seconds % 60);
            for (var i = 0; i < result.length; i++) {
                result[i] = zeroPad(result[i], 2);
            }
            result = result.join(':');
            if (precision > 0) {
                result += '.' + zeroPad(fractionSeconds, precision);
            }
            return result;
        },
        roundUpToNearest: function (value, multiple) {
            if (multiple === 0) {
                return 0;
            }
            var multiplier = 1;
            if (value < 0) {
                multiplier = -1;
                value = -value;
            }
            var roundedUp = Math.ceil(value);
            return multiplier * ((roundedUp + multiple - 1) / multiple | 0) * multiple;
        },
        clamp: function (value, min, max) {
            if (value < min) {
                return min;
            } else if (value > max) {
                return max;
            } else {
                return value;
            }
        },
        extend: function (to, from) {
            for (var key in from) {
                if (this.objectHasProperty(from, key)) {
                    to[key] = from[key];
                }
            }
            return to;
        },
        isInAscendingOrder: function (array) {
            if (array.length === 0) {
                return true;
            }
            var value = array[0];
            for (var i = 1; i < array.length; i++) {
                if (value >= array[i]) {
                    return false;
                }
                value = array[i];
            }
            return true;
        },
        isNumber: function (value) {
            return typeof value === 'number';
        },
        isValidTime: function (value) {
            return typeof value === 'number' && Number.isFinite(value);
        },
        isObject: function (value) {
            return value !== null && typeof value === 'object' && !Array.isArray(value);
        },
        isString: function (value) {
            return typeof value === 'string';
        },
        isArrayBuffer: function (value) {
            return Object.prototype.toString.call(value).includes('ArrayBuffer');
        },
        isNullOrUndefined: function (value) {
            return value === undefined || value === null;
        },
        isFunction: function (value) {
            return typeof value === 'function';
        },
        isBoolean: function (value) {
            return value === true || value === false;
        },
        isHTMLElement: function (value) {
            return value instanceof HTMLElement;
        },
        objectHasProperty: function (object, field) {
            return Object.prototype.hasOwnProperty.call(object, field);
        }
    };
}();
},{}],88:[function(_dereq_,module,exports){
module.exports = function (WaveformOverview, WaveformZoomView, Utils) {
    'use strict';
    function ViewController(peaks) {
        this._peaks = peaks;
        this._overview = null;
        this._zoomview = null;
    }
    ViewController.prototype.createOverview = function (container) {
        if (this._overview) {
            return this._overview;
        }
        var waveformData = this._peaks.getWaveformData();
        this._overview = new WaveformOverview(waveformData, container, this._peaks);
        if (this._zoomview) {
            this._overview.showHighlight(this._zoomview.getStartTime(), this._zoomview.getEndTime());
        }
        return this._overview;
    };
    ViewController.prototype.createZoomview = function (container) {
        if (this._zoomview) {
            return this._zoomview;
        }
        var waveformData = this._peaks.getWaveformData();
        this._zoomview = new WaveformZoomView(waveformData, container, this._peaks);
        return this._zoomview;
    };
    ViewController.prototype.destroyOverview = function () {
        if (!this._overview) {
            return;
        }
        if (!this._zoomview) {
            return;
        }
        this._overview.destroy();
        this._overview = null;
    };
    ViewController.prototype.destroyZoomview = function () {
        if (!this._zoomview) {
            return;
        }
        if (!this._overview) {
            return;
        }
        this._zoomview.destroy();
        this._zoomview = null;
        this._overview.removeHighlightRect();
    };
    ViewController.prototype.destroy = function () {
        if (this._overview) {
            this._overview.destroy();
            this._overview = null;
        }
        if (this._zoomview) {
            this._zoomview.destroy();
            this._zoomview = null;
        }
    };
    ViewController.prototype.getView = function (name) {
        if (Utils.isNullOrUndefined(name)) {
            if (this._overview && this._zoomview) {
                return null;
            } else if (this._overview) {
                return this._overview;
            } else if (this._zoomview) {
                return this._zoomview;
            } else {
                return null;
            }
        } else {
            switch (name) {
            case 'overview':
                return this._overview;
            case 'zoomview':
                return this._zoomview;
            default:
                return null;
            }
        }
    };
    return ViewController;
}(_dereq_('./waveform-overview'), _dereq_('./waveform-zoomview'), _dereq_('./utils'));
},{"./utils":87,"./waveform-overview":91,"./waveform-zoomview":95}],89:[function(_dereq_,module,exports){
module.exports = function (Utils, Konva) {
    'use strict';
    function WaveformAxis(view, options) {
        var self = this;
        self._axisGridlineColor = options.axisGridlineColor;
        self._axisLabelColor = options.axisLabelColor;
        self._axisShape = new Konva.Shape({
            sceneFunc: function (context) {
                self.drawAxis(context, view);
            }
        });
    }
    WaveformAxis.prototype.addToLayer = function (layer) {
        layer.add(this._axisShape);
    };
    WaveformAxis.prototype.getAxisLabelScale = function (view) {
        var baseSecs = 1;
        var steps = [
            1,
            2,
            5,
            10,
            20,
            30
        ];
        var minSpacing = 60;
        var index = 0;
        var secs;
        for (;;) {
            secs = baseSecs * steps[index];
            var pixels = view.timeToPixels(secs);
            if (pixels < minSpacing) {
                if (++index === steps.length) {
                    baseSecs *= 60;
                    index = 0;
                }
            } else {
                break;
            }
        }
        return secs;
    };
    WaveformAxis.prototype.drawAxis = function (context, view) {
        var currentFrameStartTime = view.pixelsToTime(view.getFrameOffset());
        var markerHeight = 10;
        var axisLabelIntervalSecs = this.getAxisLabelScale(view);
        var firstAxisLabelSecs = Utils.roundUpToNearest(currentFrameStartTime, axisLabelIntervalSecs);
        var axisLabelOffsetSecs = firstAxisLabelSecs - currentFrameStartTime;
        var axisLabelOffsetPixels = view.timeToPixels(axisLabelOffsetSecs);
        context.setAttr('strokeStyle', this._axisGridlineColor);
        context.setAttr('lineWidth', 1);
        context.setAttr('font', '11px sans-serif');
        context.setAttr('fillStyle', this._axisLabelColor);
        context.setAttr('textAlign', 'left');
        context.setAttr('textBaseline', 'bottom');
        var secs = firstAxisLabelSecs;
        var x;
        var width = view.getWidth();
        var height = view.getHeight();
        for (;;) {
            x = axisLabelOffsetPixels + view.timeToPixels(secs - firstAxisLabelSecs);
            if (x >= width) {
                break;
            }
            context.beginPath();
            context.moveTo(x + 0.5, 0);
            context.lineTo(x + 0.5, 0 + markerHeight);
            context.moveTo(x + 0.5, height);
            context.lineTo(x + 0.5, height - markerHeight);
            context.stroke();
            var label = Utils.formatTime(secs, 0);
            var labelWidth = context.measureText(label).width;
            var labelX = x - labelWidth / 2;
            var labelY = height - 1 - markerHeight;
            if (labelX >= 0) {
                context.fillText(label, labelX, labelY);
            }
            secs += axisLabelIntervalSecs;
        }
    };
    return WaveformAxis;
}(_dereq_('./utils'), _dereq_('konva'));
},{"./utils":87,"konva":42}],90:[function(_dereq_,module,exports){
module.exports = function (WaveformData, Utils) {
    'use strict';
    var isXhr2 = 'withCredentials' in new XMLHttpRequest();
    function WaveformBuilder(peaks) {
        this._peaks = peaks;
    }
    WaveformBuilder.prototype.init = function (options, callback) {
        if (options.dataUri && (options.webAudio || options.audioContext) || options.waveformData && (options.webAudio || options.audioContext) || options.dataUri && options.waveformData) {
            callback(new TypeError('Peaks.init(): You may only pass one source (webAudio, dataUri, or waveformData) to render waveform data.'));
            return;
        }
        if (options.audioContext) {
            this._peaks.options.deprecationLogger('Peaks.init(): The audioContext option is deprecated, please pass a webAudio object instead');
            options.webAudio = { audioContext: options.audioContext };
        }
        if (options.dataUri) {
            return this._getRemoteWaveformData(options, callback);
        } else if (options.waveformData) {
            return this._buildWaveformFromLocalData(options, callback);
        } else if (options.webAudio) {
            if (options.webAudio.audioBuffer) {
                return this._buildWaveformDataFromAudioBuffer(options, callback);
            } else {
                return this._buildWaveformDataUsingWebAudio(options, callback);
            }
        } else {
            callback(new Error('Peaks.init(): You must pass an audioContext, or dataUri, or waveformData to render waveform data'));
        }
    };
    WaveformBuilder.prototype._getRemoteWaveformData = function (options, callback) {
        var self = this;
        var dataUri = null;
        var requestType = null;
        var url;
        if (Utils.isObject(options.dataUri)) {
            dataUri = options.dataUri;
        } else if (Utils.isString(options.dataUri)) {
            dataUri = {};
            dataUri[options.dataUriDefaultFormat || 'json'] = options.dataUri;
        } else {
            callback(new TypeError('Peaks.init(): The dataUri option must be an object'));
            return;
        }
        [
            'ArrayBuffer',
            'JSON'
        ].some(function (connector) {
            if (window[connector]) {
                requestType = connector.toLowerCase();
                url = dataUri[requestType];
                return Boolean(url);
            }
        });
        if (!url) {
            callback(new Error('Peaks.init(): Unable to determine a compatible dataUri format for this browser'));
            return;
        }
        var xhr = self._createXHR(url, requestType, options.withCredentials, function (event) {
            if (this.readyState !== 4) {
                return;
            }
            if (this.status !== 200) {
                callback(new Error('Unable to fetch remote data. HTTP status ' + this.status));
                return;
            }
            var waveformData = WaveformData.create(event.target.response);
            if (waveformData.channels !== 1 && waveformData.channels !== 2) {
                callback(new Error('Peaks.init(): Only mono or stereo waveforms are currently supported'));
                return;
            }
            callback(null, waveformData);
        }, function () {
            callback(new Error('XHR Failed'));
        });
        xhr.send();
    };
    WaveformBuilder.prototype._buildWaveformFromLocalData = function (options, callback) {
        var waveformData = null;
        var data = null;
        if (Utils.isObject(options.waveformData)) {
            waveformData = options.waveformData;
        } else {
            callback(new Error('Peaks.init(): The waveformData option must be an object'));
            return;
        }
        if (Utils.isObject(waveformData.json)) {
            data = waveformData.json;
        } else if (Utils.isArrayBuffer(waveformData.arraybuffer)) {
            data = waveformData.arraybuffer;
        }
        if (!data) {
            callback(new Error('Peaks.init(): Unable to determine a compatible waveformData format'));
            return;
        }
        try {
            var createdWaveformData = WaveformData.create(data);
            if (createdWaveformData.channels !== 1 && createdWaveformData.channels !== 2) {
                callback(new Error('Peaks.init(): Only mono or stereo waveforms are currently supported'));
                return;
            }
            callback(null, createdWaveformData);
        } catch (err) {
            callback(err);
        }
    };
    WaveformBuilder.prototype._buildWaveformDataUsingWebAudio = function (options, callback) {
        var self = this;
        var audioContext = window.AudioContext || window.webkitAudioContext;
        if (!(options.webAudio.audioContext instanceof audioContext)) {
            callback(new TypeError('Peaks.init(): The webAudio.audioContext option must be a valid AudioContext'));
            return;
        }
        var webAudioOptions = options.webAudio;
        if (webAudioOptions.scale !== options.zoomLevels[0]) {
            webAudioOptions.scale = options.zoomLevels[0];
        }
        var mediaSourceUrl = self._peaks.options.mediaElement.currentSrc;
        if (mediaSourceUrl) {
            self._requestAudioAndBuildWaveformData(mediaSourceUrl, webAudioOptions, options.withCredentials, callback);
        } else {
            self._peaks.once('player.canplay', function () {
                self._requestAudioAndBuildWaveformData(self._peaks.options.mediaElement.currentSrc, webAudioOptions, options.withCredentials, callback);
            });
        }
    };
    WaveformBuilder.prototype._buildWaveformDataFromAudioBuffer = function (options, callback) {
        var webAudioOptions = options.webAudio;
        if (webAudioOptions.scale !== options.zoomLevels[0]) {
            webAudioOptions.scale = options.zoomLevels[0];
        }
        var webAudioBuilderOptions = {
            audio_buffer: webAudioOptions.audioBuffer,
            split_channels: webAudioOptions.multiChannel,
            scale: webAudioOptions.scale
        };
        WaveformData.createFromAudio(webAudioBuilderOptions, callback);
    };
    WaveformBuilder.prototype._requestAudioAndBuildWaveformData = function (url, webAudio, withCredentials, callback) {
        var self = this;
        if (!url) {
            self._peaks.logger('Peaks.init(): The mediaElement src is invalid');
            return;
        }
        var xhr = self._createXHR(url, 'arraybuffer', withCredentials, function (event) {
            if (this.readyState !== 4) {
                return;
            }
            if (this.status !== 200) {
                callback(new Error('Unable to fetch remote data. HTTP status ' + this.status));
                return;
            }
            var webAudioBuilderOptions = {
                audio_context: webAudio.audioContext,
                array_buffer: event.target.response,
                split_channels: webAudio.multiChannel,
                scale: webAudio.scale
            };
            WaveformData.createFromAudio(webAudioBuilderOptions, callback);
        }, function () {
            callback(new Error('XHR Failed'));
        });
        xhr.send();
    };
    WaveformBuilder.prototype._createXHR = function (url, requestType, withCredentials, onLoad, onError) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        if (isXhr2) {
            try {
                xhr.responseType = requestType;
            } catch (e) {
            }
        }
        xhr.onload = onLoad;
        xhr.onerror = onError;
        if (isXhr2 && withCredentials) {
            xhr.withCredentials = true;
        }
        return xhr;
    };
    return WaveformBuilder;
}(_dereq_('waveform-data'), _dereq_('./utils'));
},{"./utils":87,"waveform-data":67}],91:[function(_dereq_,module,exports){
module.exports = function (HighlightLayer, MouseDragHandler, PlayheadLayer, PointsLayer, SegmentsLayer, WaveformAxis, WaveformShape, Utils, Konva) {
    'use strict';
    function WaveformOverview(waveformData, container, peaks) {
        var self = this;
        self._originalWaveformData = waveformData;
        self._container = container;
        self._peaks = peaks;
        self._onTimeUpdate = self._onTimeUpdate.bind(this);
        self._onPlay = self._onPlay.bind(this);
        self._onPause = self._onPause.bind(this);
        self._onZoomviewDisplaying = self._onZoomviewDisplaying.bind(this);
        self._onWindowResize = self._onWindowResize.bind(this);
        peaks.on('player.timeupdate', self._onTimeUpdate);
        peaks.on('player.play', self._onPlay);
        peaks.on('player.pause', self._onPause);
        peaks.on('zoomview.displaying', self._onZoomviewDisplaying);
        peaks.on('window_resize', self._onWindowResize);
        self._amplitudeScale = 1;
        self._timeLabelPrecision = peaks.options.timeLabelPrecision;
        self._options = peaks.options;
        self._width = container.clientWidth;
        self._height = container.clientHeight || self._options.height;
        self._data = waveformData;
        if (self._width !== 0) {
            try {
                self._data = waveformData.resample({ width: self._width });
            } catch (error) {
            }
        }
        Konva.showWarnings = false;
        self._resizeTimeoutId = null;
        self._stage = new Konva.Stage({
            container: container,
            width: self._width,
            height: self._height
        });
        self._waveformLayer = new Konva.FastLayer();
        self._createWaveform();
        self._segmentsLayer = new SegmentsLayer(peaks, self, false);
        self._segmentsLayer.addToStage(self._stage);
        self._pointsLayer = new PointsLayer(peaks, self, false);
        self._pointsLayer.addToStage(self._stage);
        self._highlightLayer = new HighlightLayer(self, self._options.overviewHighlightOffset, self._options.overviewHighlightColor);
        self._highlightLayer.addToStage(self._stage);
        self._createAxisLabels();
        self._playheadLayer = new PlayheadLayer(peaks, self, false);
        self._playheadLayer.addToStage(self._stage);
        var time = self._peaks.player.getCurrentTime();
        this._playheadLayer.updatePlayheadTime(time);
        self._mouseDragHandler = new MouseDragHandler(self._stage, {
            onMouseDown: function (mousePosX) {
                mousePosX = Utils.clamp(mousePosX, 0, self._width);
                var time = self.pixelsToTime(mousePosX);
                var duration = self._getDuration();
                if (time > duration) {
                    time = duration;
                }
                self._playheadLayer.updatePlayheadTime(time);
                peaks.player.seek(time);
            },
            onMouseMove: function (mousePosX) {
                mousePosX = Utils.clamp(mousePosX, 0, self._width);
                var time = self.pixelsToTime(mousePosX);
                var duration = self._getDuration();
                if (time > duration) {
                    time = duration;
                }
                self._playheadLayer.updatePlayheadTime(time);
                self._peaks.player.seek(time);
            }
        });
        this._stage.on('dblclick', function (event) {
            var pixelIndex = event.evt.layerX;
            var time = self.pixelsToTime(pixelIndex);
            self._peaks.emit('overview.dblclick', time);
        });
    }
    WaveformOverview.prototype.getName = function () {
        return 'overview';
    };
    WaveformOverview.prototype._onTimeUpdate = function (time) {
        this._playheadLayer.updatePlayheadTime(time);
    };
    WaveformOverview.prototype._onPlay = function (time) {
        this._playheadLayer.updatePlayheadTime(time);
    };
    WaveformOverview.prototype._onPause = function (time) {
        this._playheadLayer.stop(time);
    };
    WaveformOverview.prototype._onZoomviewDisplaying = function (startTime, endTime) {
        this.showHighlight(startTime, endTime);
    };
    WaveformOverview.prototype.showHighlight = function (startTime, endTime) {
        this._highlightLayer.showHighlight(startTime, endTime);
    };
    WaveformOverview.prototype._onWindowResize = function () {
        var self = this;
        if (self._resizeTimeoutId) {
            clearTimeout(self._resizeTimeoutId);
            self._resizeTimeoutId = null;
        }
        if (self._container.clientWidth !== 0) {
            self._width = self._container.clientWidth;
            self._stage.setWidth(self._width);
            self._resizeTimeoutId = setTimeout(function () {
                self._width = self._container.clientWidth;
                self._data = self._originalWaveformData.resample({ width: self._width });
                self._stage.setWidth(self._width);
                self._updateWaveform();
            }, 500);
        }
    };
    WaveformOverview.prototype.setWaveformData = function (waveformData) {
        this._originalWaveformData = waveformData;
        if (this._width !== 0) {
            this._data = waveformData.resample({ width: this._width });
        } else {
            this._data = waveformData;
        }
        this._updateWaveform();
    };
    WaveformOverview.prototype.timeToPixels = function (time) {
        return Math.floor(time * this._data.sample_rate / this._data.scale);
    };
    WaveformOverview.prototype.pixelsToTime = function (pixels) {
        return pixels * this._data.scale / this._data.sample_rate;
    };
    WaveformOverview.prototype.getFrameOffset = function () {
        return 0;
    };
    WaveformOverview.prototype.getWidth = function () {
        return this._width;
    };
    WaveformOverview.prototype.getHeight = function () {
        return this._height;
    };
    WaveformOverview.prototype._getDuration = function () {
        return this._peaks.player.getDuration();
    };
    WaveformOverview.prototype.setAmplitudeScale = function (scale) {
        if (!Utils.isNumber(scale) || !Number.isFinite(scale)) {
            throw new Error('view.setAmplitudeScale(): Scale must be a valid number');
        }
        this._amplitudeScale = scale;
        this._waveformLayer.draw();
        this._segmentsLayer.draw();
    };
    WaveformOverview.prototype.getAmplitudeScale = function () {
        return this._amplitudeScale;
    };
    WaveformOverview.prototype.getWaveformData = function () {
        return this._data;
    };
    WaveformOverview.prototype._createWaveform = function () {
        this._waveformShape = new WaveformShape({
            color: this._options.overviewWaveformColor,
            view: this
        });
        this._waveformLayer.add(this._waveformShape);
        this._stage.add(this._waveformLayer);
    };
    WaveformOverview.prototype._createAxisLabels = function () {
        this._axisLayer = new Konva.FastLayer();
        this._axis = new WaveformAxis(this, {
            axisGridlineColor: this._options.axisGridlineColor,
            axisLabelColor: this._options.axisLabelColor
        });
        this._axis.addToLayer(this._axisLayer);
        this._stage.add(this._axisLayer);
    };
    WaveformOverview.prototype.removeHighlightRect = function () {
        this._highlightLayer.removeHighlight();
    };
    WaveformOverview.prototype._updateWaveform = function () {
        this._waveformLayer.draw();
        this._axisLayer.draw();
        var playheadTime = this._peaks.player.getCurrentTime();
        this._playheadLayer.updatePlayheadTime(playheadTime);
        this._highlightLayer.updateHighlight();
        var frameStartTime = 0;
        var frameEndTime = this.pixelsToTime(this._width);
        this._pointsLayer.updatePoints(frameStartTime, frameEndTime);
        this._segmentsLayer.updateSegments(frameStartTime, frameEndTime);
    };
    WaveformOverview.prototype.setWaveformColor = function (color) {
        this._waveformShape.setWaveformColor(color);
        this._waveformLayer.draw();
    };
    WaveformOverview.prototype.showPlayheadTime = function (show) {
        this._playheadLayer.showPlayheadTime(show);
    };
    WaveformOverview.prototype.setTimeLabelPrecision = function (precision) {
        this._timeLabelPrecision = precision;
        this._playheadLayer.updatePlayheadText();
    };
    WaveformOverview.prototype.formatTime = function (time) {
        return Utils.formatTime(time, this._timeLabelPrecision);
    };
    WaveformOverview.prototype.enableAutoScroll = function () {
    };
    WaveformOverview.prototype.enableMarkerEditing = function (enable) {
        this._segmentsLayer.enableEditing(enable);
        this._pointsLayer.enableEditing(enable);
    };
    WaveformOverview.prototype.fitToContainer = function () {
        if (this._container.clientWidth === 0 && this._container.clientHeight === 0) {
            return;
        }
        var updateWaveform = false;
        if (this._container.clientWidth !== this._width) {
            this._width = this._container.clientWidth;
            this._stage.setWidth(this._width);
            try {
                this._data = this._originalWaveformData.resample({ width: this._width });
                updateWaveform = true;
            } catch (error) {
            }
        }
        this._height = this._container.clientHeight;
        this._stage.setHeight(this._height);
        this._playheadLayer.fitToView();
        this._segmentsLayer.fitToView();
        this._pointsLayer.fitToView();
        this._highlightLayer.fitToView();
        if (updateWaveform) {
            this._updateWaveform();
        }
        this._stage.draw();
    };
    WaveformOverview.prototype.destroy = function () {
        if (this._resizeTimeoutId) {
            clearTimeout(this._resizeTimeoutId);
            this._resizeTimeoutId = null;
        }
        this._peaks.off('player.play', this._onPlay);
        this._peaks.off('player.pause', this._onPause);
        this._peaks.off('player.timeupdate', this._onTimeUpdate);
        this._peaks.off('zoomview.displaying', this._onZoomviewDisplaying);
        this._peaks.off('window_resize', this._onWindowResize);
        this._playheadLayer.destroy();
        this._segmentsLayer.destroy();
        this._pointsLayer.destroy();
        if (this._stage) {
            this._stage.destroy();
            this._stage = null;
        }
    };
    return WaveformOverview;
}(_dereq_('./highlight-layer'), _dereq_('./mouse-drag-handler'), _dereq_('./playhead-layer'), _dereq_('./points-layer'), _dereq_('./segments-layer'), _dereq_('./waveform-axis'), _dereq_('./waveform-shape'), _dereq_('./utils'), _dereq_('konva'));
},{"./highlight-layer":72,"./mouse-drag-handler":77,"./playhead-layer":79,"./points-layer":82,"./segments-layer":86,"./utils":87,"./waveform-axis":89,"./waveform-shape":94,"konva":42}],92:[function(_dereq_,module,exports){
module.exports = function (Point, Utils) {
    'use strict';
    function WaveformPoints(peaks) {
        this._peaks = peaks;
        this._points = [];
        this._pointsById = {};
        this._pointIdCounter = 0;
    }
    WaveformPoints.prototype._getNextPointId = function () {
        return 'peaks.point.' + this._pointIdCounter++;
    };
    WaveformPoints.prototype._addPoint = function (point) {
        this._points.push(point);
        this._pointsById[point.id] = point;
    };
    WaveformPoints.prototype._createPoint = function (options) {
        var pointOptions = { peaks: this._peaks };
        Utils.extend(pointOptions, options);
        if (Utils.isNullOrUndefined(pointOptions.id)) {
            pointOptions.id = this._getNextPointId();
        }
        if (Utils.isNullOrUndefined(pointOptions.labelText)) {
            pointOptions.labelText = '';
        }
        if (Utils.isNullOrUndefined(pointOptions.editable)) {
            pointOptions.editable = false;
        }
        return new Point(pointOptions);
    };
    WaveformPoints.prototype.getPoints = function () {
        return this._points;
    };
    WaveformPoints.prototype.getPoint = function (id) {
        return this._pointsById[id] || null;
    };
    WaveformPoints.prototype.find = function (startTime, endTime) {
        return this._points.filter(function (point) {
            return point.isVisible(startTime, endTime);
        });
    };
    WaveformPoints.prototype.add = function () {
        var self = this;
        var points = Array.isArray(arguments[0]) ? arguments[0] : Array.prototype.slice.call(arguments);
        points = points.map(function (pointOptions) {
            var point = self._createPoint(pointOptions);
            if (Utils.objectHasProperty(self._pointsById, point.id)) {
                throw new Error('peaks.points.add(): duplicate id');
            }
            return point;
        });
        points.forEach(function (point) {
            self._addPoint(point);
        });
        this._peaks.emit('points.add', points);
    };
    WaveformPoints.prototype._findPoint = function (predicate) {
        var indexes = [];
        for (var i = 0, length = this._points.length; i < length; i++) {
            if (predicate(this._points[i])) {
                indexes.push(i);
            }
        }
        return indexes;
    };
    WaveformPoints.prototype._removeIndexes = function (indexes) {
        var removed = [];
        for (var i = 0; i < indexes.length; i++) {
            var index = indexes[i] - removed.length;
            var itemRemoved = this._points.splice(index, 1)[0];
            delete this._pointsById[itemRemoved.id];
            removed.push(itemRemoved);
        }
        return removed;
    };
    WaveformPoints.prototype._removePoints = function (predicate) {
        var indexes = this._findPoint(predicate);
        var removed = this._removeIndexes(indexes);
        this._peaks.emit('points.remove', removed);
        return removed;
    };
    WaveformPoints.prototype.remove = function (point) {
        return this._removePoints(function (p) {
            return p === point;
        });
    };
    WaveformPoints.prototype.removeById = function (pointId) {
        return this._removePoints(function (point) {
            return point.id === pointId;
        });
    };
    WaveformPoints.prototype.removeByTime = function (time) {
        return this._removePoints(function (point) {
            return point.time === time;
        });
    };
    WaveformPoints.prototype.removeAll = function () {
        this._points = [];
        this._pointsById = {};
        this._peaks.emit('points.remove_all');
    };
    return WaveformPoints;
}(_dereq_('./point'), _dereq_('./utils'));
},{"./point":81,"./utils":87}],93:[function(_dereq_,module,exports){
module.exports = function (Colors, Segment, Utils) {
    'use strict';
    function WaveformSegments(peaks) {
        this._peaks = peaks;
        this._segments = [];
        this._segmentsById = {};
        this._segmentIdCounter = 0;
        this._colorIndex = 0;
    }
    WaveformSegments.prototype._getNextSegmentId = function () {
        return 'peaks.segment.' + this._segmentIdCounter++;
    };
    var colors = [
        Colors.navy,
        Colors.blue,
        Colors.aqua,
        Colors.teal,
        Colors.yellow,
        Colors.orange,
        Colors.red,
        Colors.maroon,
        Colors.fuchsia,
        Colors.purple
    ];
    WaveformSegments.prototype._getSegmentColor = function () {
        if (this._peaks.options.randomizeSegmentColor) {
            if (++this._colorIndex === colors.length) {
                this._colorIndex = 0;
            }
            return colors[this._colorIndex];
        } else {
            return this._peaks.options.segmentColor;
        }
    };
    WaveformSegments.prototype._addSegment = function (segment) {
        this._segments.push(segment);
        this._segmentsById[segment.id] = segment;
    };
    WaveformSegments.prototype._createSegment = function (options) {
        if (!Utils.isObject(options)) {
            throw new TypeError('peaks.segments.add(): expected a Segment object parameter');
        }
        var segmentOptions = { peaks: this._peaks };
        Utils.extend(segmentOptions, options);
        if (Utils.isNullOrUndefined(segmentOptions.id)) {
            segmentOptions.id = this._getNextSegmentId();
        }
        if (Utils.isNullOrUndefined(segmentOptions.color)) {
            segmentOptions.color = this._getSegmentColor();
        }
        if (Utils.isNullOrUndefined(segmentOptions.labelText)) {
            segmentOptions.labelText = '';
        }
        if (Utils.isNullOrUndefined(segmentOptions.editable)) {
            segmentOptions.editable = false;
        }
        return new Segment(segmentOptions);
    };
    WaveformSegments.prototype.getSegments = function () {
        return this._segments;
    };
    WaveformSegments.prototype.getSegment = function (id) {
        return this._segmentsById[id] || null;
    };
    WaveformSegments.prototype.getSegmentsAtTime = function (time) {
        return this._segments.filter(function (segment) {
            return time >= segment.startTime && time < segment.endTime;
        });
    };
    WaveformSegments.prototype.find = function (startTime, endTime) {
        return this._segments.filter(function (segment) {
            return segment.isVisible(startTime, endTime);
        });
    };
    WaveformSegments.prototype.add = function () {
        var self = this;
        var segments = Array.isArray(arguments[0]) ? arguments[0] : Array.prototype.slice.call(arguments);
        segments = segments.map(function (segmentOptions) {
            var segment = self._createSegment(segmentOptions);
            if (Utils.objectHasProperty(self._segmentsById, segment.id)) {
                throw new Error('peaks.segments.add(): duplicate id');
            }
            return segment;
        });
        segments.forEach(function (segment) {
            self._addSegment(segment);
        });
        this._peaks.emit('segments.add', segments);
    };
    WaveformSegments.prototype._findSegment = function (predicate) {
        var indexes = [];
        for (var i = 0, length = this._segments.length; i < length; i++) {
            if (predicate(this._segments[i])) {
                indexes.push(i);
            }
        }
        return indexes;
    };
    WaveformSegments.prototype._removeIndexes = function (indexes) {
        var removed = [];
        for (var i = 0; i < indexes.length; i++) {
            var index = indexes[i] - removed.length;
            var itemRemoved = this._segments.splice(index, 1)[0];
            delete this._segmentsById[itemRemoved.id];
            removed.push(itemRemoved);
        }
        return removed;
    };
    WaveformSegments.prototype._removeSegments = function (predicate) {
        var indexes = this._findSegment(predicate);
        var removed = this._removeIndexes(indexes);
        this._peaks.emit('segments.remove', removed);
        return removed;
    };
    WaveformSegments.prototype.remove = function (segment) {
        return this._removeSegments(function (s) {
            return s === segment;
        });
    };
    WaveformSegments.prototype.removeById = function (segmentId) {
        return this._removeSegments(function (segment) {
            return segment.id === segmentId;
        });
    };
    WaveformSegments.prototype.removeByTime = function (startTime, endTime) {
        endTime = typeof endTime === 'number' ? endTime : 0;
        var fnFilter;
        if (endTime > 0) {
            fnFilter = function (segment) {
                return segment.startTime === startTime && segment.endTime === endTime;
            };
        } else {
            fnFilter = function (segment) {
                return segment.startTime === startTime;
            };
        }
        return this._removeSegments(fnFilter);
    };
    WaveformSegments.prototype.removeAll = function () {
        this._segments = [];
        this._segmentsById = {};
        this._peaks.emit('segments.remove_all');
    };
    return WaveformSegments;
}(_dereq_('colors.css'), _dereq_('./segment'), _dereq_('./utils'));
},{"./segment":85,"./utils":87,"colors.css":1}],94:[function(_dereq_,module,exports){
module.exports = function (Utils, Konva) {
    'use strict';
    function scaleY(amplitude, height, scale) {
        var range = 256;
        var offset = 128;
        var scaledAmplitude = (amplitude * scale + offset) * height / range;
        return height - Utils.clamp(height - scaledAmplitude, 0, height);
    }
    function WaveformShape(options) {
        Konva.Shape.call(this, { fill: options.color });
        this._view = options.view;
        this._segment = options.segment;
        this.sceneFunc(this._sceneFunc);
        this.hitFunc(this._waveformShapeHitFunc);
    }
    WaveformShape.prototype = Object.create(Konva.Shape.prototype);
    WaveformShape.prototype.setWaveformColor = function (color) {
        this.fill(color);
    };
    WaveformShape.prototype._sceneFunc = function (context) {
        var frameOffset = this._view.getFrameOffset();
        var width = this._view.getWidth();
        var height = this._view.getHeight();
        this._drawWaveform(context, this._view.getWaveformData(), frameOffset, this._segment ? this._view.timeToPixels(this._segment.startTime) : frameOffset, this._segment ? this._view.timeToPixels(this._segment.endTime) : frameOffset + width, width, height);
    };
    WaveformShape.prototype._drawWaveform = function (context, waveformData, frameOffset, startPixels, endPixels, width, height) {
        if (startPixels < frameOffset) {
            startPixels = frameOffset;
        }
        var limit = frameOffset + width;
        if (endPixels > limit) {
            endPixels = limit;
        }
        if (endPixels > waveformData.length) {
            endPixels = waveformData.length;
        }
        var channels = waveformData.channels;
        var waveformTop = 0;
        var waveformHeight = Math.floor(height / channels);
        for (var i = 0; i < channels; i++) {
            if (i === channels - 1) {
                waveformHeight = height - (channels - 1) * waveformHeight;
            }
            this._drawChannel(context, waveformData.channel(i), frameOffset, startPixels, endPixels, waveformTop, waveformHeight);
            waveformTop += waveformHeight;
        }
    };
    WaveformShape.prototype._drawChannel = function (context, channel, frameOffset, startPixels, endPixels, top, height) {
        var x, val;
        var amplitudeScale = this._view.getAmplitudeScale();
        context.beginPath();
        for (x = startPixels; x < endPixels; x++) {
            val = channel.min_sample(x);
            context.lineTo(x - frameOffset + 0.5, top + scaleY(val, height, amplitudeScale) + 0.5);
        }
        for (x = endPixels - 1; x >= startPixels; x--) {
            val = channel.max_sample(x);
            context.lineTo(x - frameOffset + 0.5, top + scaleY(val, height, amplitudeScale) + 0.5);
        }
        context.closePath();
        context.fillShape(this);
    };
    WaveformShape.prototype._waveformShapeHitFunc = function (context) {
        if (!this._segment) {
            return;
        }
        var frameOffset = this._view.getFrameOffset();
        var viewWidth = this._view.getWidth();
        var viewHeight = this._view.getHeight();
        var startPixels = this._view.timeToPixels(this._segment.startTime);
        var endPixels = this._view.timeToPixels(this._segment.endTime);
        var offsetY = 10;
        var hitRectHeight = viewHeight - 2 * offsetY;
        if (hitRectHeight < 0) {
            hitRectHeight = 0;
        }
        var hitRectLeft = startPixels - frameOffset;
        var hitRectWidth = endPixels - startPixels;
        if (hitRectLeft < 0) {
            hitRectWidth -= -hitRectLeft;
            hitRectLeft = 0;
        }
        if (hitRectLeft + hitRectWidth > viewWidth) {
            hitRectWidth -= hitRectLeft + hitRectWidth - viewWidth;
        }
        context.beginPath();
        context.rect(hitRectLeft, offsetY, hitRectWidth, hitRectHeight);
        context.closePath();
        context.fillStrokeShape(this);
    };
    return WaveformShape;
}(_dereq_('./utils'), _dereq_('konva'));
},{"./utils":87,"konva":42}],95:[function(_dereq_,module,exports){
module.exports = function (MouseDragHandler, PlayheadLayer, PointsLayer, SegmentsLayer, WaveformAxis, WaveformShape, Utils, Konva) {
    'use strict';
    function WaveformZoomView(waveformData, container, peaks) {
        var self = this;
        self._originalWaveformData = waveformData;
        self._container = container;
        self._peaks = peaks;
        self._onTimeUpdate = self._onTimeUpdate.bind(self);
        self._onPlay = self._onPlay.bind(self);
        self._onPause = self._onPause.bind(self);
        self._onWindowResize = self._onWindowResize.bind(self);
        self._onKeyboardLeft = self._onKeyboardLeft.bind(self);
        self._onKeyboardRight = self._onKeyboardRight.bind(self);
        self._onKeyboardShiftLeft = self._onKeyboardShiftLeft.bind(self);
        self._onKeyboardShiftRight = self._onKeyboardShiftRight.bind(self);
        self._peaks.on('player.timeupdate', self._onTimeUpdate);
        self._peaks.on('player.play', self._onPlay);
        self._peaks.on('player.pause', self._onPause);
        self._peaks.on('window_resize', self._onWindowResize);
        self._peaks.on('keyboard.left', self._onKeyboardLeft);
        self._peaks.on('keyboard.right', self._onKeyboardRight);
        self._peaks.on('keyboard.shift_left', self._onKeyboardShiftLeft);
        self._peaks.on('keyboard.shift_right', self._onKeyboardShiftRight);
        self._enableAutoScroll = true;
        self._amplitudeScale = 1;
        self._timeLabelPrecision = peaks.options.timeLabelPrecision;
        self._options = peaks.options;
        self._data = null;
        self._pixelLength = 0;
        var initialZoomLevel = self._options.zoomLevels[peaks.zoom.getZoom()];
        self._zoomLevelAuto = false;
        self._zoomLevelSeconds = null;
        self._resizeTimeoutId = null;
        self._resampleData({ scale: initialZoomLevel });
        self._width = container.clientWidth;
        self._height = container.clientHeight || self._options.height;
        self._frameOffset = 0;
        self._stage = new Konva.Stage({
            container: container,
            width: self._width,
            height: self._height
        });
        self._waveformLayer = new Konva.FastLayer();
        self._createWaveform();
        self._segmentsLayer = new SegmentsLayer(peaks, self, true);
        self._segmentsLayer.addToStage(self._stage);
        self._pointsLayer = new PointsLayer(peaks, self, true);
        self._pointsLayer.addToStage(self._stage);
        self._createAxisLabels();
        self._playheadLayer = new PlayheadLayer(peaks, self, self._options.showPlayheadTime);
        self._playheadLayer.addToStage(self._stage);
        var time = self._peaks.player.getCurrentTime();
        self._syncPlayhead(time);
        self._mouseDragHandler = new MouseDragHandler(self._stage, {
            onMouseDown: function (mousePosX) {
                this.initialFrameOffset = self._frameOffset;
                this.mouseDownX = mousePosX;
            },
            onMouseMove: function (mousePosX) {
                var diff = this.mouseDownX - mousePosX;
                var newFrameOffset = Utils.clamp(this.initialFrameOffset + diff, 0, self._pixelLength - self._width);
                if (newFrameOffset !== this.initialFrameOffset) {
                    self._updateWaveform(newFrameOffset);
                }
            },
            onMouseUp: function () {
                if (!self._mouseDragHandler.isDragging()) {
                    var mouseDownX = Math.floor(this.mouseDownX);
                    var pixelIndex = self._frameOffset + mouseDownX;
                    var time = self.pixelsToTime(pixelIndex);
                    var duration = self._getDuration();
                    if (time > duration) {
                        time = duration;
                    }
                    self._updateWaveform(pixelIndex - mouseDownX);
                    self._playheadLayer.updatePlayheadTime(time);
                    self._peaks.player.seek(time);
                }
            }
        });
        this._stage.on('dblclick', function (event) {
            var mousePosX = event.evt.layerX;
            var pixelIndex = self._frameOffset + mousePosX;
            var time = self.pixelsToTime(pixelIndex);
            self._peaks.emit('zoomview.dblclick', time);
        });
    }
    WaveformZoomView.prototype.getName = function () {
        return 'zoomview';
    };
    WaveformZoomView.prototype._onTimeUpdate = function (time) {
        if (this._mouseDragHandler.isDragging()) {
            return;
        }
        this._syncPlayhead(time);
    };
    WaveformZoomView.prototype._onPlay = function (time) {
        this._playheadLayer.updatePlayheadTime(time);
    };
    WaveformZoomView.prototype._onPause = function (time) {
        this._playheadLayer.stop(time);
    };
    WaveformZoomView.prototype._onWindowResize = function () {
        var self = this;
        var width = self._container.clientWidth;
        if (!self._zoomLevelAuto) {
            self._width = width;
            self._stage.width(width);
            self._updateWaveform(self._frameOffset);
        } else {
            if (self._resizeTimeoutId) {
                clearTimeout(self._resizeTimeoutId);
                self._resizeTimeoutId = null;
            }
            if (width !== 0) {
                self._width = width;
                self._stage.width(width);
                self._resizeTimeoutId = setTimeout(function () {
                    self._width = width;
                    self._data = self._originalWaveformData.resample(width);
                    self._stage.width(width);
                    self._updateWaveform(self._frameOffset);
                }, 500);
            }
        }
    };
    WaveformZoomView.prototype._onKeyboardLeft = function () {
        this._keyboardScroll(-1, false);
    };
    WaveformZoomView.prototype._onKeyboardRight = function () {
        this._keyboardScroll(1, false);
    };
    WaveformZoomView.prototype._onKeyboardShiftLeft = function () {
        this._keyboardScroll(-1, true);
    };
    WaveformZoomView.prototype._onKeyboardShiftRight = function () {
        this._keyboardScroll(1, true);
    };
    WaveformZoomView.prototype._keyboardScroll = function (direction, large) {
        var increment;
        if (large) {
            increment = direction * this._width;
        } else {
            increment = direction * this.timeToPixels(this._options.nudgeIncrement);
        }
        this._updateWaveform(this._frameOffset + increment);
    };
    WaveformZoomView.prototype.setWaveformData = function (waveformData) {
        this._originalWaveformData = waveformData;
    };
    WaveformZoomView.prototype._syncPlayhead = function (time) {
        this._playheadLayer.updatePlayheadTime(time);
        if (this._enableAutoScroll) {
            var pixelIndex = this.timeToPixels(time);
            var endThreshold = this._frameOffset + this._width - 100;
            if (pixelIndex >= endThreshold || pixelIndex < this._frameOffset) {
                this._frameOffset = pixelIndex - 100;
                if (this._frameOffset < 0) {
                    this._frameOffset = 0;
                }
                this._updateWaveform(this._frameOffset);
            }
        }
    };
    WaveformZoomView.prototype._getScale = function (duration) {
        return duration * this._data.sample_rate / this._width;
    };
    function isAutoScale(options) {
        return Utils.objectHasProperty(options, 'scale') && options.scale === 'auto' || Utils.objectHasProperty(options, 'seconds') && options.seconds === 'auto';
    }
    WaveformZoomView.prototype.setZoom = function (options) {
        var scale;
        if (isAutoScale(options)) {
            var seconds = this._peaks.player.getDuration();
            if (!Utils.isValidTime(seconds)) {
                return false;
            }
            this._zoomLevelAuto = true;
            this._zoomLevelSeconds = null;
            scale = this._getScale(seconds);
        } else {
            if (Utils.objectHasProperty(options, 'scale')) {
                this._zoomLevelSeconds = null;
                scale = options.scale;
            } else if (Utils.objectHasProperty(options, 'seconds')) {
                if (!Utils.isValidTime(options.seconds)) {
                    return false;
                }
                this._zoomLevelSeconds = options.seconds;
                scale = this._getScale(options.seconds);
            }
            this._zoomLevelAuto = false;
        }
        if (scale < this._originalWaveformData.scale) {
            this._peaks.logger('peaks.zoomview.setZoom(): zoom level must be at least ' + this._originalWaveformData.scale);
            scale = this._originalWaveformData.scale;
        }
        var currentTime = this._peaks.player.getCurrentTime();
        var apexTime;
        var playheadOffsetPixels = this._playheadLayer.getPlayheadOffset();
        if (playheadOffsetPixels >= 0 && playheadOffsetPixels < this._width) {
            apexTime = currentTime;
        } else {
            playheadOffsetPixels = this._width / 2;
            apexTime = this.pixelsToTime(this._frameOffset + playheadOffsetPixels);
        }
        var prevScale = this._scale;
        this._resampleData({ scale: scale });
        var apexPixel = this.timeToPixels(apexTime);
        this._frameOffset = apexPixel - playheadOffsetPixels;
        this._updateWaveform(this._frameOffset);
        this._playheadLayer.zoomLevelChanged();
        this._playheadLayer.updatePlayheadTime(currentTime);
        this._peaks.emit('zoom.update', scale, prevScale);
        return true;
    };
    WaveformZoomView.prototype._resampleData = function (options) {
        this._data = this._originalWaveformData.resample(options);
        this._scale = this._data.scale;
        this._pixelLength = this._data.length;
    };
    WaveformZoomView.prototype.getStartTime = function () {
        return this.pixelsToTime(this._frameOffset);
    };
    WaveformZoomView.prototype.getEndTime = function () {
        return this.pixelsToTime(this._frameOffset + this._width);
    };
    WaveformZoomView.prototype.setStartTime = function (time) {
        if (time < 0) {
            time = 0;
        }
        if (this._zoomLevelAuto) {
            time = 0;
        }
        this._updateWaveform(this.timeToPixels(time));
    };
    WaveformZoomView.prototype.timeToPixels = function (time) {
        return Math.floor(time * this._data.sample_rate / this._data.scale);
    };
    WaveformZoomView.prototype.pixelsToTime = function (pixels) {
        return pixels * this._data.scale / this._data.sample_rate;
    };
    WaveformZoomView.prototype.getFrameOffset = function () {
        return this._frameOffset;
    };
    WaveformZoomView.prototype.getWidth = function () {
        return this._width;
    };
    WaveformZoomView.prototype.getHeight = function () {
        return this._height;
    };
    WaveformZoomView.prototype._getDuration = function () {
        return this._peaks.player.getDuration();
    };
    WaveformZoomView.prototype.setAmplitudeScale = function (scale) {
        if (!Utils.isNumber(scale) || !Number.isFinite(scale)) {
            throw new Error('view.setAmplitudeScale(): Scale must be a valid number');
        }
        this._amplitudeScale = scale;
        this._waveformLayer.draw();
        this._segmentsLayer.draw();
    };
    WaveformZoomView.prototype.getAmplitudeScale = function () {
        return this._amplitudeScale;
    };
    WaveformZoomView.prototype.getWaveformData = function () {
        return this._data;
    };
    WaveformZoomView.prototype._createWaveform = function () {
        this._waveformShape = new WaveformShape({
            color: this._options.zoomWaveformColor,
            view: this
        });
        this._waveformLayer.add(this._waveformShape);
        this._stage.add(this._waveformLayer);
        this._peaks.emit('zoomview.displaying', 0, this.pixelsToTime(this._width));
    };
    WaveformZoomView.prototype._createAxisLabels = function () {
        this._axisLayer = new Konva.FastLayer();
        this._axis = new WaveformAxis(this, {
            axisGridlineColor: this._options.axisGridlineColor,
            axisLabelColor: this._options.axisLabelColor
        });
        this._axis.addToLayer(this._axisLayer);
        this._stage.add(this._axisLayer);
    };
    WaveformZoomView.prototype._updateWaveform = function (frameOffset) {
        var upperLimit;
        if (this._pixelLength < this._width) {
            frameOffset = 0;
            upperLimit = this._width;
        } else {
            upperLimit = this._pixelLength - this._width;
        }
        frameOffset = Utils.clamp(frameOffset, 0, upperLimit);
        this._frameOffset = frameOffset;
        var playheadPixel = this._playheadLayer.getPlayheadPixel();
        this._playheadLayer.updatePlayheadTime(this.pixelsToTime(playheadPixel));
        this._waveformLayer.draw();
        this._axisLayer.draw();
        var frameStartTime = this.pixelsToTime(this._frameOffset);
        var frameEndTime = this.pixelsToTime(this._frameOffset + this._width);
        this._pointsLayer.updatePoints(frameStartTime, frameEndTime);
        this._segmentsLayer.updateSegments(frameStartTime, frameEndTime);
        this._peaks.emit('zoomview.displaying', frameStartTime, frameEndTime);
    };
    WaveformZoomView.prototype.setWaveformColor = function (color) {
        this._waveformShape.setWaveformColor(color);
        this._waveformLayer.draw();
    };
    WaveformZoomView.prototype.showPlayheadTime = function (show) {
        this._playheadLayer.showPlayheadTime(show);
    };
    WaveformZoomView.prototype.setTimeLabelPrecision = function (precision) {
        this._timeLabelPrecision = precision;
        this._playheadLayer.updatePlayheadText();
    };
    WaveformZoomView.prototype.formatTime = function (time) {
        return Utils.formatTime(time, this._timeLabelPrecision);
    };
    WaveformZoomView.prototype.enableAutoScroll = function (enable) {
        this._enableAutoScroll = enable;
    };
    WaveformZoomView.prototype.enableMarkerEditing = function (enable) {
        this._segmentsLayer.enableEditing(enable);
        this._pointsLayer.enableEditing(enable);
    };
    WaveformZoomView.prototype.fitToContainer = function () {
        if (this._container.clientWidth === 0 && this._container.clientHeight === 0) {
            return;
        }
        var updateWaveform = false;
        if (this._container.clientWidth !== this._width) {
            this._width = this._container.clientWidth;
            this._stage.width(this._width);
            var resample = false;
            var resampleOptions;
            if (this._zoomLevelAuto) {
                resample = true;
                resampleOptions = { width: this._width };
            } else if (this._zoomLevelSeconds !== null) {
                resample = true;
                resampleOptions = { scale: this._getScale(this._zoomLevelSeconds) };
            }
            if (resample) {
                try {
                    this._resampleData(resampleOptions);
                    updateWaveform = true;
                } catch (error) {
                }
            }
        }
        this._height = this._container.clientHeight;
        this._stage.height(this._height);
        this._playheadLayer.fitToView();
        this._segmentsLayer.fitToView();
        this._pointsLayer.fitToView();
        if (updateWaveform) {
            this._updateWaveform(this._frameOffset);
        }
        this._stage.draw();
    };
    WaveformZoomView.prototype.destroy = function () {
        if (this._resizeTimeoutId) {
            clearTimeout(this._resizeTimeoutId);
            this._resizeTimeoutId = null;
        }
        this._peaks.off('player.timeupdate', this._onTimeUpdate);
        this._peaks.off('player.play', this._onPlay);
        this._peaks.off('player.pause', this._onPause);
        this._peaks.off('window_resize', this._onWindowResize);
        this._peaks.off('keyboard.left', this._onKeyboardLeft);
        this._peaks.off('keyboard.right', this._onKeyboardRight);
        this._peaks.off('keyboard.shift_left', this._onKeyboardShiftLeft);
        this._peaks.off('keyboard.shift_right', this._onKeyboardShiftRight);
        this._playheadLayer.destroy();
        this._segmentsLayer.destroy();
        this._pointsLayer.destroy();
        if (this._stage) {
            this._stage.destroy();
            this._stage = null;
        }
    };
    return WaveformZoomView;
}(_dereq_('./mouse-drag-handler'), _dereq_('./playhead-layer'), _dereq_('./points-layer'), _dereq_('./segments-layer'), _dereq_('./waveform-axis'), _dereq_('./waveform-shape'), _dereq_('./utils'), _dereq_('konva'));
},{"./mouse-drag-handler":77,"./playhead-layer":79,"./points-layer":82,"./segments-layer":86,"./utils":87,"./waveform-axis":89,"./waveform-shape":94,"konva":42}],96:[function(_dereq_,module,exports){
module.exports = function () {
    'use strict';
    function ZoomController(peaks, zoomLevels) {
        this._peaks = peaks;
        this._zoomLevels = zoomLevels;
        this._zoomLevelIndex = 0;
    }
    ZoomController.prototype.setZoomLevels = function (zoomLevels) {
        this._zoomLevels = zoomLevels;
        this.setZoom(0, true);
    };
    ZoomController.prototype.zoomIn = function () {
        this.setZoom(this._zoomLevelIndex - 1);
    };
    ZoomController.prototype.zoomOut = function () {
        this.setZoom(this._zoomLevelIndex + 1);
    };
    ZoomController.prototype.setZoom = function (zoomLevelIndex, forceUpdate) {
        if (zoomLevelIndex >= this._zoomLevels.length) {
            zoomLevelIndex = this._zoomLevels.length - 1;
        }
        if (zoomLevelIndex < 0) {
            zoomLevelIndex = 0;
        }
        if (!forceUpdate && zoomLevelIndex === this._zoomLevelIndex) {
            return;
        }
        this._zoomLevelIndex = zoomLevelIndex;
        var zoomview = this._peaks.views.getView('zoomview');
        if (!zoomview) {
            return;
        }
        zoomview.setZoom({ scale: this._zoomLevels[zoomLevelIndex] });
    };
    ZoomController.prototype.getZoom = function () {
        return this._zoomLevelIndex;
    };
    ZoomController.prototype.getZoomLevel = function () {
        return this._zoomLevels[this._zoomLevelIndex];
    };
    return ZoomController;
}();
},{}]},{},[74])(74)
});
//# sourceMappingURL=peaks.js.map


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => module['default'] :
/******/ 				() => module;
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/************************************************************************/
(() => {
"use strict";

;// CONCATENATED MODULE: ./node_modules/svelte/internal/index.mjs
function noop() { }
const identity = x => x;
function internal_assign(tar, src) {
    // @ts-ignore
    for (const k in src)
        tar[k] = src[k];
    return tar;
}
function is_promise(value) {
    return value && typeof value === 'object' && typeof value.then === 'function';
}
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
function not_equal(a, b) {
    return a != a ? b == b : a !== b;
}
function is_empty(obj) {
    return Object.keys(obj).length === 0;
}
function validate_store(store, name) {
    if (store != null && typeof store.subscribe !== 'function') {
        throw new Error(`'${name}' is not a store with a 'subscribe' method`);
    }
}
function subscribe(store, ...callbacks) {
    if (store == null) {
        return noop;
    }
    const unsub = store.subscribe(...callbacks);
    return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function get_store_value(store) {
    let value;
    subscribe(store, _ => value = _)();
    return value;
}
function component_subscribe(component, store, callback) {
    component.$$.on_destroy.push(subscribe(store, callback));
}
function create_slot(definition, ctx, $$scope, fn) {
    if (definition) {
        const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
        return definition[0](slot_ctx);
    }
}
function get_slot_context(definition, ctx, $$scope, fn) {
    return definition[1] && fn
        ? internal_assign($$scope.ctx.slice(), definition[1](fn(ctx)))
        : $$scope.ctx;
}
function get_slot_changes(definition, $$scope, dirty, fn) {
    if (definition[2] && fn) {
        const lets = definition[2](fn(dirty));
        if ($$scope.dirty === undefined) {
            return lets;
        }
        if (typeof lets === 'object') {
            const merged = [];
            const len = Math.max($$scope.dirty.length, lets.length);
            for (let i = 0; i < len; i += 1) {
                merged[i] = $$scope.dirty[i] | lets[i];
            }
            return merged;
        }
        return $$scope.dirty | lets;
    }
    return $$scope.dirty;
}
function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
    const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
    if (slot_changes) {
        const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
        slot.p(slot_context, slot_changes);
    }
}
function exclude_internal_props(props) {
    const result = {};
    for (const k in props)
        if (k[0] !== '$')
            result[k] = props[k];
    return result;
}
function compute_rest_props(props, keys) {
    const rest = {};
    keys = new Set(keys);
    for (const k in props)
        if (!keys.has(k) && k[0] !== '$')
            rest[k] = props[k];
    return rest;
}
function compute_slots(slots) {
    const result = {};
    for (const key in slots) {
        result[key] = true;
    }
    return result;
}
function once(fn) {
    let ran = false;
    return function (...args) {
        if (ran)
            return;
        ran = true;
        fn.call(this, ...args);
    };
}
function null_to_empty(value) {
    return value == null ? '' : value;
}
function set_store_value(store, ret, value = ret) {
    store.set(value);
    return ret;
}
const has_prop = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
function action_destroyer(action_result) {
    return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
}

const is_client = typeof window !== 'undefined';
let now = (/* unused pure expression or super */ null && (is_client
    ? () => window.performance.now()
    : () => Date.now()));
let raf = (/* unused pure expression or super */ null && (is_client ? cb => requestAnimationFrame(cb) : noop));
// used internally for testing
function set_now(fn) {
    now = fn;
}
function set_raf(fn) {
    raf = fn;
}

const tasks = new Set();
function run_tasks(now) {
    tasks.forEach(task => {
        if (!task.c(now)) {
            tasks.delete(task);
            task.f();
        }
    });
    if (tasks.size !== 0)
        raf(run_tasks);
}
/**
 * For testing purposes only!
 */
function clear_loops() {
    tasks.clear();
}
/**
 * Creates a new task that runs on each raf frame
 * until it returns a falsy value or is aborted
 */
function loop(callback) {
    let task;
    if (tasks.size === 0)
        raf(run_tasks);
    return {
        promise: new Promise(fulfill => {
            tasks.add(task = { c: callback, f: fulfill });
        }),
        abort() {
            tasks.delete(task);
        }
    };
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
function internal_element(name) {
    return document.createElement(name);
}
function element_is(name, is) {
    return document.createElement(name, { is });
}
function object_without_properties(obj, exclude) {
    const target = {};
    for (const k in obj) {
        if (has_prop(obj, k)
            // @ts-ignore
            && exclude.indexOf(k) === -1) {
            // @ts-ignore
            target[k] = obj[k];
        }
    }
    return target;
}
function svg_element(name) {
    return document.createElementNS('http://www.w3.org/2000/svg', name);
}
function internal_text(data) {
    return document.createTextNode(data);
}
function space() {
    return internal_text(' ');
}
function empty() {
    return internal_text('');
}
function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
}
function prevent_default(fn) {
    return function (event) {
        event.preventDefault();
        // @ts-ignore
        return fn.call(this, event);
    };
}
function stop_propagation(fn) {
    return function (event) {
        event.stopPropagation();
        // @ts-ignore
        return fn.call(this, event);
    };
}
function internal_self(fn) {
    return function (event) {
        // @ts-ignore
        if (event.target === this)
            fn.call(this, event);
    };
}
function attr(node, attribute, value) {
    if (value == null)
        node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
        node.setAttribute(attribute, value);
}
function set_attributes(node, attributes) {
    // @ts-ignore
    const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
    for (const key in attributes) {
        if (attributes[key] == null) {
            node.removeAttribute(key);
        }
        else if (key === 'style') {
            node.style.cssText = attributes[key];
        }
        else if (key === '__value') {
            node.value = node[key] = attributes[key];
        }
        else if (descriptors[key] && descriptors[key].set) {
            node[key] = attributes[key];
        }
        else {
            attr(node, key, attributes[key]);
        }
    }
}
function set_svg_attributes(node, attributes) {
    for (const key in attributes) {
        attr(node, key, attributes[key]);
    }
}
function set_custom_element_data(node, prop, value) {
    if (prop in node) {
        node[prop] = value;
    }
    else {
        attr(node, prop, value);
    }
}
function xlink_attr(node, attribute, value) {
    node.setAttributeNS('http://www.w3.org/1999/xlink', attribute, value);
}
function get_binding_group_value(group, __value, checked) {
    const value = new Set();
    for (let i = 0; i < group.length; i += 1) {
        if (group[i].checked)
            value.add(group[i].__value);
    }
    if (!checked) {
        value.delete(__value);
    }
    return Array.from(value);
}
function to_number(value) {
    return value === '' ? null : +value;
}
function time_ranges_to_array(ranges) {
    const array = [];
    for (let i = 0; i < ranges.length; i += 1) {
        array.push({ start: ranges.start(i), end: ranges.end(i) });
    }
    return array;
}
function children(element) {
    return Array.from(element.childNodes);
}
function claim_element(nodes, name, attributes, svg) {
    for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        if (node.nodeName === name) {
            let j = 0;
            const remove = [];
            while (j < node.attributes.length) {
                const attribute = node.attributes[j++];
                if (!attributes[attribute.name]) {
                    remove.push(attribute.name);
                }
            }
            for (let k = 0; k < remove.length; k++) {
                node.removeAttribute(remove[k]);
            }
            return nodes.splice(i, 1)[0];
        }
    }
    return svg ? svg_element(name) : internal_element(name);
}
function claim_text(nodes, data) {
    for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        if (node.nodeType === 3) {
            node.data = '' + data;
            return nodes.splice(i, 1)[0];
        }
    }
    return internal_text(data);
}
function claim_space(nodes) {
    return claim_text(nodes, ' ');
}
function set_data(text, data) {
    data = '' + data;
    if (text.wholeText !== data)
        text.data = data;
}
function set_input_value(input, value) {
    input.value = value == null ? '' : value;
}
function set_input_type(input, type) {
    try {
        input.type = type;
    }
    catch (e) {
        // do nothing
    }
}
function set_style(node, key, value, important) {
    node.style.setProperty(key, value, important ? 'important' : '');
}
function select_option(select, value) {
    for (let i = 0; i < select.options.length; i += 1) {
        const option = select.options[i];
        if (option.__value === value) {
            option.selected = true;
            return;
        }
    }
}
function select_options(select, value) {
    for (let i = 0; i < select.options.length; i += 1) {
        const option = select.options[i];
        option.selected = ~value.indexOf(option.__value);
    }
}
function select_value(select) {
    const selected_option = select.querySelector(':checked') || select.options[0];
    return selected_option && selected_option.__value;
}
function select_multiple_value(select) {
    return [].map.call(select.querySelectorAll(':checked'), option => option.__value);
}
// unfortunately this can't be a constant as that wouldn't be tree-shakeable
// so we cache the result instead
let crossorigin;
function is_crossorigin() {
    if (crossorigin === undefined) {
        crossorigin = false;
        try {
            if (typeof window !== 'undefined' && window.parent) {
                void window.parent.document;
            }
        }
        catch (error) {
            crossorigin = true;
        }
    }
    return crossorigin;
}
function add_resize_listener(node, fn) {
    const computed_style = getComputedStyle(node);
    const z_index = (parseInt(computed_style.zIndex) || 0) - 1;
    if (computed_style.position === 'static') {
        node.style.position = 'relative';
    }
    const iframe = internal_element('iframe');
    iframe.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; ' +
        `overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: ${z_index};`);
    iframe.setAttribute('aria-hidden', 'true');
    iframe.tabIndex = -1;
    const crossorigin = is_crossorigin();
    let unsubscribe;
    if (crossorigin) {
        iframe.src = "data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}</script>";
        unsubscribe = listen(window, 'message', (event) => {
            if (event.source === iframe.contentWindow)
                fn();
        });
    }
    else {
        iframe.src = 'about:blank';
        iframe.onload = () => {
            unsubscribe = listen(iframe.contentWindow, 'resize', fn);
        };
    }
    append(node, iframe);
    return () => {
        if (crossorigin) {
            unsubscribe();
        }
        else if (unsubscribe && iframe.contentWindow) {
            unsubscribe();
        }
        detach(iframe);
    };
}
function toggle_class(element, name, toggle) {
    element.classList[toggle ? 'add' : 'remove'](name);
}
function custom_event(type, detail) {
    const e = document.createEvent('CustomEvent');
    e.initCustomEvent(type, false, false, detail);
    return e;
}
function query_selector_all(selector, parent = document.body) {
    return Array.from(parent.querySelectorAll(selector));
}
class HtmlTag {
    constructor(anchor = null) {
        this.a = anchor;
        this.e = this.n = null;
    }
    m(html, target, anchor = null) {
        if (!this.e) {
            this.e = internal_element(target.nodeName);
            this.t = target;
            this.h(html);
        }
        this.i(anchor);
    }
    h(html) {
        this.e.innerHTML = html;
        this.n = Array.from(this.e.childNodes);
    }
    i(anchor) {
        for (let i = 0; i < this.n.length; i += 1) {
            insert(this.t, this.n[i], anchor);
        }
    }
    p(html) {
        this.d();
        this.h(html);
        this.i(this.a);
    }
    d() {
        this.n.forEach(detach);
    }
}
function attribute_to_object(attributes) {
    const result = {};
    for (const attribute of attributes) {
        result[attribute.name] = attribute.value;
    }
    return result;
}
function get_custom_elements_slots(element) {
    const result = {};
    element.childNodes.forEach((node) => {
        result[node.slot || 'default'] = true;
    });
    return result;
}

const active_docs = new Set();
let active = 0;
// https://github.com/darkskyapp/string-hash/blob/master/index.js
function hash(str) {
    let hash = 5381;
    let i = str.length;
    while (i--)
        hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
    return hash >>> 0;
}
function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
    const step = 16.666 / duration;
    let keyframes = '{\n';
    for (let p = 0; p <= 1; p += step) {
        const t = a + (b - a) * ease(p);
        keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
    }
    const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
    const name = `__svelte_${hash(rule)}_${uid}`;
    const doc = node.ownerDocument;
    active_docs.add(doc);
    const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = doc.head.appendChild(internal_element('style')).sheet);
    const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
    if (!current_rules[name]) {
        current_rules[name] = true;
        stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
    }
    const animation = node.style.animation || '';
    node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
    active += 1;
    return name;
}
function delete_rule(node, name) {
    const previous = (node.style.animation || '').split(', ');
    const next = previous.filter(name
        ? anim => anim.indexOf(name) < 0 // remove specific animation
        : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
    );
    const deleted = previous.length - next.length;
    if (deleted) {
        node.style.animation = next.join(', ');
        active -= deleted;
        if (!active)
            clear_rules();
    }
}
function clear_rules() {
    raf(() => {
        if (active)
            return;
        active_docs.forEach(doc => {
            const stylesheet = doc.__svelte_stylesheet;
            let i = stylesheet.cssRules.length;
            while (i--)
                stylesheet.deleteRule(i);
            doc.__svelte_rules = {};
        });
        active_docs.clear();
    });
}

function create_animation(node, from, fn, params) {
    if (!from)
        return noop;
    const to = node.getBoundingClientRect();
    if (from.left === to.left && from.right === to.right && from.top === to.top && from.bottom === to.bottom)
        return noop;
    const { delay = 0, duration = 300, easing = identity, 
    // @ts-ignore todo: should this be separated from destructuring? Or start/end added to public api and documentation?
    start: start_time = now() + delay, 
    // @ts-ignore todo:
    end = start_time + duration, tick = noop, css } = fn(node, { from, to }, params);
    let running = true;
    let started = false;
    let name;
    function start() {
        if (css) {
            name = create_rule(node, 0, 1, duration, delay, easing, css);
        }
        if (!delay) {
            started = true;
        }
    }
    function stop() {
        if (css)
            delete_rule(node, name);
        running = false;
    }
    loop(now => {
        if (!started && now >= start_time) {
            started = true;
        }
        if (started && now >= end) {
            tick(1, 0);
            stop();
        }
        if (!running) {
            return false;
        }
        if (started) {
            const p = now - start_time;
            const t = 0 + 1 * easing(p / duration);
            tick(t, 1 - t);
        }
        return true;
    });
    start();
    tick(0, 1);
    return stop;
}
function fix_position(node) {
    const style = getComputedStyle(node);
    if (style.position !== 'absolute' && style.position !== 'fixed') {
        const { width, height } = style;
        const a = node.getBoundingClientRect();
        node.style.position = 'absolute';
        node.style.width = width;
        node.style.height = height;
        add_transform(node, a);
    }
}
function add_transform(node, a) {
    const b = node.getBoundingClientRect();
    if (a.left !== b.left || a.top !== b.top) {
        const style = getComputedStyle(node);
        const transform = style.transform === 'none' ? '' : style.transform;
        node.style.transform = `${transform} translate(${a.left - b.left}px, ${a.top - b.top}px)`;
    }
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
function get_current_component() {
    if (!current_component)
        throw new Error('Function called outside component initialization');
    return current_component;
}
function beforeUpdate(fn) {
    get_current_component().$$.before_update.push(fn);
}
function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
}
function afterUpdate(fn) {
    get_current_component().$$.after_update.push(fn);
}
function onDestroy(fn) {
    get_current_component().$$.on_destroy.push(fn);
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
function setContext(key, context) {
    get_current_component().$$.context.set(key, context);
}
function getContext(key) {
    return get_current_component().$$.context.get(key);
}
// TODO figure out if we still want to support
// shorthand events, or if we want to implement
// a real bubbling mechanism
function bubble(component, event) {
    const callbacks = component.$$.callbacks[event.type];
    if (callbacks) {
        callbacks.slice().forEach(fn => fn(event));
    }
}

const dirty_components = [];
const intros = { enabled: false };
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
function tick() {
    schedule_update();
    return resolved_promise;
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
        set_current_component(null);
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

let promise;
function wait() {
    if (!promise) {
        promise = Promise.resolve();
        promise.then(() => {
            promise = null;
        });
    }
    return promise;
}
function dispatch(node, direction, kind) {
    node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
}
const outroing = new Set();
let outros;
function group_outros() {
    outros = {
        r: 0,
        c: [],
        p: outros // parent group
    };
}
function check_outros() {
    if (!outros.r) {
        run_all(outros.c);
    }
    outros = outros.p;
}
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
const null_transition = { duration: 0 };
function create_in_transition(node, fn, params) {
    let config = fn(node, params);
    let running = false;
    let animation_name;
    let task;
    let uid = 0;
    function cleanup() {
        if (animation_name)
            delete_rule(node, animation_name);
    }
    function go() {
        const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
        if (css)
            animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
        tick(0, 1);
        const start_time = now() + delay;
        const end_time = start_time + duration;
        if (task)
            task.abort();
        running = true;
        add_render_callback(() => dispatch(node, true, 'start'));
        task = loop(now => {
            if (running) {
                if (now >= end_time) {
                    tick(1, 0);
                    dispatch(node, true, 'end');
                    cleanup();
                    return running = false;
                }
                if (now >= start_time) {
                    const t = easing((now - start_time) / duration);
                    tick(t, 1 - t);
                }
            }
            return running;
        });
    }
    let started = false;
    return {
        start() {
            if (started)
                return;
            delete_rule(node);
            if (is_function(config)) {
                config = config();
                wait().then(go);
            }
            else {
                go();
            }
        },
        invalidate() {
            started = false;
        },
        end() {
            if (running) {
                cleanup();
                running = false;
            }
        }
    };
}
function create_out_transition(node, fn, params) {
    let config = fn(node, params);
    let running = true;
    let animation_name;
    const group = outros;
    group.r += 1;
    function go() {
        const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
        if (css)
            animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
        const start_time = now() + delay;
        const end_time = start_time + duration;
        add_render_callback(() => dispatch(node, false, 'start'));
        loop(now => {
            if (running) {
                if (now >= end_time) {
                    tick(0, 1);
                    dispatch(node, false, 'end');
                    if (!--group.r) {
                        // this will result in `end()` being called,
                        // so we don't need to clean up here
                        run_all(group.c);
                    }
                    return false;
                }
                if (now >= start_time) {
                    const t = easing((now - start_time) / duration);
                    tick(1 - t, t);
                }
            }
            return running;
        });
    }
    if (is_function(config)) {
        wait().then(() => {
            // @ts-ignore
            config = config();
            go();
        });
    }
    else {
        go();
    }
    return {
        end(reset) {
            if (reset && config.tick) {
                config.tick(1, 0);
            }
            if (running) {
                if (animation_name)
                    delete_rule(node, animation_name);
                running = false;
            }
        }
    };
}
function create_bidirectional_transition(node, fn, params, intro) {
    let config = fn(node, params);
    let t = intro ? 0 : 1;
    let running_program = null;
    let pending_program = null;
    let animation_name = null;
    function clear_animation() {
        if (animation_name)
            delete_rule(node, animation_name);
    }
    function init(program, duration) {
        const d = program.b - t;
        duration *= Math.abs(d);
        return {
            a: t,
            b: program.b,
            d,
            duration,
            start: program.start,
            end: program.start + duration,
            group: program.group
        };
    }
    function go(b) {
        const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
        const program = {
            start: now() + delay,
            b
        };
        if (!b) {
            // @ts-ignore todo: improve typings
            program.group = outros;
            outros.r += 1;
        }
        if (running_program || pending_program) {
            pending_program = program;
        }
        else {
            // if this is an intro, and there's a delay, we need to do
            // an initial tick and/or apply CSS animation immediately
            if (css) {
                clear_animation();
                animation_name = create_rule(node, t, b, duration, delay, easing, css);
            }
            if (b)
                tick(0, 1);
            running_program = init(program, duration);
            add_render_callback(() => dispatch(node, b, 'start'));
            loop(now => {
                if (pending_program && now > pending_program.start) {
                    running_program = init(pending_program, duration);
                    pending_program = null;
                    dispatch(node, running_program.b, 'start');
                    if (css) {
                        clear_animation();
                        animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                    }
                }
                if (running_program) {
                    if (now >= running_program.end) {
                        tick(t = running_program.b, 1 - t);
                        dispatch(node, running_program.b, 'end');
                        if (!pending_program) {
                            // we're done
                            if (running_program.b) {
                                // intro — we can tidy up immediately
                                clear_animation();
                            }
                            else {
                                // outro — needs to be coordinated
                                if (!--running_program.group.r)
                                    run_all(running_program.group.c);
                            }
                        }
                        running_program = null;
                    }
                    else if (now >= running_program.start) {
                        const p = now - running_program.start;
                        t = running_program.a + running_program.d * easing(p / running_program.duration);
                        tick(t, 1 - t);
                    }
                }
                return !!(running_program || pending_program);
            });
        }
    }
    return {
        run(b) {
            if (is_function(config)) {
                wait().then(() => {
                    // @ts-ignore
                    config = config();
                    go(b);
                });
            }
            else {
                go(b);
            }
        },
        end() {
            clear_animation();
            running_program = pending_program = null;
        }
    };
}

function handle_promise(promise, info) {
    const token = info.token = {};
    function update(type, index, key, value) {
        if (info.token !== token)
            return;
        info.resolved = value;
        let child_ctx = info.ctx;
        if (key !== undefined) {
            child_ctx = child_ctx.slice();
            child_ctx[key] = value;
        }
        const block = type && (info.current = type)(child_ctx);
        let needs_flush = false;
        if (info.block) {
            if (info.blocks) {
                info.blocks.forEach((block, i) => {
                    if (i !== index && block) {
                        group_outros();
                        transition_out(block, 1, 1, () => {
                            info.blocks[i] = null;
                        });
                        check_outros();
                    }
                });
            }
            else {
                info.block.d(1);
            }
            block.c();
            transition_in(block, 1);
            block.m(info.mount(), info.anchor);
            needs_flush = true;
        }
        info.block = block;
        if (info.blocks)
            info.blocks[index] = block;
        if (needs_flush) {
            flush();
        }
    }
    if (is_promise(promise)) {
        const current_component = get_current_component();
        promise.then(value => {
            set_current_component(current_component);
            update(info.then, 1, info.value, value);
            set_current_component(null);
        }, error => {
            set_current_component(current_component);
            update(info.catch, 2, info.error, error);
            set_current_component(null);
            if (!info.hasCatch) {
                throw error;
            }
        });
        // if we previously had a then/catch block, destroy it
        if (info.current !== info.pending) {
            update(info.pending, 0);
            return true;
        }
    }
    else {
        if (info.current !== info.then) {
            update(info.then, 1, info.value, promise);
            return true;
        }
        info.resolved = promise;
    }
}

const globals = (typeof window !== 'undefined'
    ? window
    : typeof globalThis !== 'undefined'
        ? globalThis
        : global);

function destroy_block(block, lookup) {
    block.d(1);
    lookup.delete(block.key);
}
function outro_and_destroy_block(block, lookup) {
    transition_out(block, 1, 1, () => {
        lookup.delete(block.key);
    });
}
function fix_and_destroy_block(block, lookup) {
    block.f();
    destroy_block(block, lookup);
}
function fix_and_outro_and_destroy_block(block, lookup) {
    block.f();
    outro_and_destroy_block(block, lookup);
}
function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
    let o = old_blocks.length;
    let n = list.length;
    let i = o;
    const old_indexes = {};
    while (i--)
        old_indexes[old_blocks[i].key] = i;
    const new_blocks = [];
    const new_lookup = new Map();
    const deltas = new Map();
    i = n;
    while (i--) {
        const child_ctx = get_context(ctx, list, i);
        const key = get_key(child_ctx);
        let block = lookup.get(key);
        if (!block) {
            block = create_each_block(key, child_ctx);
            block.c();
        }
        else if (dynamic) {
            block.p(child_ctx, dirty);
        }
        new_lookup.set(key, new_blocks[i] = block);
        if (key in old_indexes)
            deltas.set(key, Math.abs(i - old_indexes[key]));
    }
    const will_move = new Set();
    const did_move = new Set();
    function insert(block) {
        transition_in(block, 1);
        block.m(node, next);
        lookup.set(block.key, block);
        next = block.first;
        n--;
    }
    while (o && n) {
        const new_block = new_blocks[n - 1];
        const old_block = old_blocks[o - 1];
        const new_key = new_block.key;
        const old_key = old_block.key;
        if (new_block === old_block) {
            // do nothing
            next = new_block.first;
            o--;
            n--;
        }
        else if (!new_lookup.has(old_key)) {
            // remove old block
            destroy(old_block, lookup);
            o--;
        }
        else if (!lookup.has(new_key) || will_move.has(new_key)) {
            insert(new_block);
        }
        else if (did_move.has(old_key)) {
            o--;
        }
        else if (deltas.get(new_key) > deltas.get(old_key)) {
            did_move.add(new_key);
            insert(new_block);
        }
        else {
            will_move.add(old_key);
            o--;
        }
    }
    while (o--) {
        const old_block = old_blocks[o];
        if (!new_lookup.has(old_block.key))
            destroy(old_block, lookup);
    }
    while (n)
        insert(new_blocks[n - 1]);
    return new_blocks;
}
function validate_each_keys(ctx, list, get_context, get_key) {
    const keys = new Set();
    for (let i = 0; i < list.length; i++) {
        const key = get_key(get_context(ctx, list, i));
        if (keys.has(key)) {
            throw new Error('Cannot have duplicate keys in a keyed each');
        }
        keys.add(key);
    }
}

function get_spread_update(levels, updates) {
    const update = {};
    const to_null_out = {};
    const accounted_for = { $$scope: 1 };
    let i = levels.length;
    while (i--) {
        const o = levels[i];
        const n = updates[i];
        if (n) {
            for (const key in o) {
                if (!(key in n))
                    to_null_out[key] = 1;
            }
            for (const key in n) {
                if (!accounted_for[key]) {
                    update[key] = n[key];
                    accounted_for[key] = 1;
                }
            }
            levels[i] = n;
        }
        else {
            for (const key in o) {
                accounted_for[key] = 1;
            }
        }
    }
    for (const key in to_null_out) {
        if (!(key in update))
            update[key] = undefined;
    }
    return update;
}
function get_spread_object(spread_props) {
    return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
}

// source: https://html.spec.whatwg.org/multipage/indices.html
const boolean_attributes = new Set([
    'allowfullscreen',
    'allowpaymentrequest',
    'async',
    'autofocus',
    'autoplay',
    'checked',
    'controls',
    'default',
    'defer',
    'disabled',
    'formnovalidate',
    'hidden',
    'ismap',
    'loop',
    'multiple',
    'muted',
    'nomodule',
    'novalidate',
    'open',
    'playsinline',
    'readonly',
    'required',
    'reversed',
    'selected'
]);

const invalid_attribute_name_character = /[\s'">/=\u{FDD0}-\u{FDEF}\u{FFFE}\u{FFFF}\u{1FFFE}\u{1FFFF}\u{2FFFE}\u{2FFFF}\u{3FFFE}\u{3FFFF}\u{4FFFE}\u{4FFFF}\u{5FFFE}\u{5FFFF}\u{6FFFE}\u{6FFFF}\u{7FFFE}\u{7FFFF}\u{8FFFE}\u{8FFFF}\u{9FFFE}\u{9FFFF}\u{AFFFE}\u{AFFFF}\u{BFFFE}\u{BFFFF}\u{CFFFE}\u{CFFFF}\u{DFFFE}\u{DFFFF}\u{EFFFE}\u{EFFFF}\u{FFFFE}\u{FFFFF}\u{10FFFE}\u{10FFFF}]/u;
// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
// https://infra.spec.whatwg.org/#noncharacter
function spread(args, classes_to_add) {
    const attributes = Object.assign({}, ...args);
    if (classes_to_add) {
        if (attributes.class == null) {
            attributes.class = classes_to_add;
        }
        else {
            attributes.class += ' ' + classes_to_add;
        }
    }
    let str = '';
    Object.keys(attributes).forEach(name => {
        if (invalid_attribute_name_character.test(name))
            return;
        const value = attributes[name];
        if (value === true)
            str += ' ' + name;
        else if (boolean_attributes.has(name.toLowerCase())) {
            if (value)
                str += ' ' + name;
        }
        else if (value != null) {
            str += ` ${name}="${String(value).replace(/"/g, '&#34;').replace(/'/g, '&#39;')}"`;
        }
    });
    return str;
}
const escaped = {
    '"': '&quot;',
    "'": '&#39;',
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
};
function internal_escape(html) {
    return String(html).replace(/["'&<>]/g, match => escaped[match]);
}
function each(items, fn) {
    let str = '';
    for (let i = 0; i < items.length; i += 1) {
        str += fn(items[i], i);
    }
    return str;
}
const missing_component = {
    $$render: () => ''
};
function validate_component(component, name) {
    if (!component || !component.$$render) {
        if (name === 'svelte:component')
            name += ' this={...}';
        throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
    }
    return component;
}
function debug(file, line, column, values) {
    console.log(`{@debug} ${file ? file + ' ' : ''}(${line}:${column})`); // eslint-disable-line no-console
    console.log(values); // eslint-disable-line no-console
    return '';
}
let on_destroy;
function create_ssr_component(fn) {
    function $$render(result, props, bindings, slots) {
        const parent_component = current_component;
        const $$ = {
            on_destroy,
            context: new Map(parent_component ? parent_component.$$.context : []),
            // these will be immediately discarded
            on_mount: [],
            before_update: [],
            after_update: [],
            callbacks: blank_object()
        };
        set_current_component({ $$ });
        const html = fn(result, props, bindings, slots);
        set_current_component(parent_component);
        return html;
    }
    return {
        render: (props = {}, options = {}) => {
            on_destroy = [];
            const result = { title: '', head: '', css: new Set() };
            const html = $$render(result, props, {}, options);
            run_all(on_destroy);
            return {
                html,
                css: {
                    code: Array.from(result.css).map(css => css.code).join('\n'),
                    map: null // TODO
                },
                head: result.title + result.head
            };
        },
        $$render
    };
}
function add_attribute(name, value, boolean) {
    if (value == null || (boolean && !value))
        return '';
    return ` ${name}${value === true ? '' : `=${typeof value === 'string' ? JSON.stringify(internal_escape(value)) : `"${value}"`}`}`;
}
function add_classes(classes) {
    return classes ? ` class="${classes}"` : '';
}

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
function claim_component(block, parent_nodes) {
    block && block.l(parent_nodes);
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
let SvelteElement;
if (typeof HTMLElement === 'function') {
    SvelteElement = class extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
        }
        connectedCallback() {
            // @ts-ignore todo: improve typings
            for (const key in this.$$.slotted) {
                // @ts-ignore todo: improve typings
                this.appendChild(this.$$.slotted[key]);
            }
        }
        attributeChangedCallback(attr, _oldValue, newValue) {
            this[attr] = newValue;
        }
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            // TODO should this delegate to addEventListener?
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
    };
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
    document.dispatchEvent(custom_event(type, Object.assign({ version: '3.29.7' }, detail)));
}
function append_dev(target, node) {
    dispatch_dev('SvelteDOMInsert', { target, node });
    append(target, node);
}
function insert_dev(target, node, anchor) {
    dispatch_dev('SvelteDOMInsert', { target, node, anchor });
    insert(target, node, anchor);
}
function detach_dev(node) {
    dispatch_dev('SvelteDOMRemove', { node });
    detach(node);
}
function detach_between_dev(before, after) {
    while (before.nextSibling && before.nextSibling !== after) {
        detach_dev(before.nextSibling);
    }
}
function detach_before_dev(after) {
    while (after.previousSibling) {
        detach_dev(after.previousSibling);
    }
}
function detach_after_dev(before) {
    while (before.nextSibling) {
        detach_dev(before.nextSibling);
    }
}
function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
    const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
    if (has_prevent_default)
        modifiers.push('preventDefault');
    if (has_stop_propagation)
        modifiers.push('stopPropagation');
    dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
    const dispose = listen(node, event, handler, options);
    return () => {
        dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
        dispose();
    };
}
function attr_dev(node, attribute, value) {
    attr(node, attribute, value);
    if (value == null)
        dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
    else
        dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
}
function prop_dev(node, property, value) {
    node[property] = value;
    dispatch_dev('SvelteDOMSetProperty', { node, property, value });
}
function dataset_dev(node, property, value) {
    node.dataset[property] = value;
    dispatch_dev('SvelteDOMSetDataset', { node, property, value });
}
function set_data_dev(text, data) {
    data = '' + data;
    if (text.wholeText === data)
        return;
    dispatch_dev('SvelteDOMSetData', { node: text, data });
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
class SvelteComponentDev extends (/* unused pure expression or super */ null && (SvelteComponent)) {
    constructor(options) {
        if (!options || (!options.target && !options.$$inline)) {
            throw new Error("'target' is a required option");
        }
        super();
    }
    $destroy() {
        super.$destroy();
        this.$destroy = () => {
            console.warn('Component was already destroyed'); // eslint-disable-line no-console
        };
    }
    $capture_state() { }
    $inject_state() { }
}
function loop_guard(timeout) {
    const start = Date.now();
    return () => {
        if (Date.now() - start > timeout) {
            throw new Error('Infinite loop detected');
        }
    };
}



;// CONCATENATED MODULE: ./node_modules/svelte/index.mjs


;// CONCATENATED MODULE: ./src/main/js/recording/AudioPlayer.svelte
/* src/main/js/recording/AudioPlayer.svelte generated by Svelte v3.29.7 */




function create_fragment(ctx) {
	let audio;
	let source;
	let source_src_value;
	let track;
	let track_src_value;
	let t;
	let audio_id_value;

	return {
		c() {
			audio = internal_element("audio");
			source = internal_element("source");
			track = internal_element("track");
			t = internal_text("\n        Your browser does not support the audio element.");
			if (source.src !== (source_src_value = "/recording/getAudioFile/" + /*recordingId*/ ctx[0])) attr(source, "src", source_src_value);
			attr(source, "type", "audio/wav");
			if (track.src !== (track_src_value = "")) attr(track, "src", track_src_value);
			attr(track, "kind", "captions");
			attr(audio, "id", audio_id_value = "audio_element_" + /*recordingId*/ ctx[0]);
			audio.controls = true;
			attr(audio, "preload", "auto");
			attr(audio, "controlslist", "nodownload");
		},
		m(target, anchor) {
			insert(target, audio, anchor);
			append(audio, source);
			append(audio, track);
			append(audio, t);
		},
		p(ctx, [dirty]) {
			if (dirty & /*recordingId*/ 1 && source.src !== (source_src_value = "/recording/getAudioFile/" + /*recordingId*/ ctx[0])) {
				attr(source, "src", source_src_value);
			}

			if (dirty & /*recordingId*/ 1 && audio_id_value !== (audio_id_value = "audio_element_" + /*recordingId*/ ctx[0])) {
				attr(audio, "id", audio_id_value);
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(audio);
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let { recordingId } = $$props;
	let audioElement = {};

	/*
    $: if(paused) {
        audioElement.pause();
    }
    $: if(!paused) {
        audioElement.play();
    }
*/
	let paused = true;

	onMount(async () => {
		audioElement = document.getElementById("audio_element_" + recordingId);

		/**
 * attaching a function to window context makes it callable from parent component
 * https://stackoverflow.com/questions/57954008/call-svelte-components-function-from-global-scope#57957607
 */
		window.togglePlayPause = () => {
			if (paused) {
				audioElement.play();
			} else {
				audioElement.pause();
			}

			paused = !paused;
		};
	});

	$$self.$$set = $$props => {
		if ("recordingId" in $$props) $$invalidate(0, recordingId = $$props.recordingId);
	};

	return [recordingId];
}

class AudioPlayer extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance, create_fragment, safe_not_equal, { recordingId: 0 });
	}
}

/* harmony default export */ const AudioPlayer_svelte = (AudioPlayer);
// EXTERNAL MODULE: ./node_modules/peaks.js/peaks.js
var peaks_js_peaks = __webpack_require__(1);
var peaks_default = /*#__PURE__*/__webpack_require__.n(peaks_js_peaks);
;// CONCATENATED MODULE: ./src/main/js/recording/DynamicWaveForm.svelte
/* src/main/js/recording/DynamicWaveForm.svelte generated by Svelte v3.29.7 */


const { document: document_1 } = globals;



function add_css() {
	var style = internal_element("style");
	style.id = "svelte-siboy4-style";
	style.textContent = "#zoomSlider.svelte-siboy4{direction:rtl;width:7em;margin-bottom:10px}.slider.svelte-siboy4{-webkit-appearance:none;width:100%;height:15px;border-radius:5px;background:#d3d3d3;outline:none;opacity:0.7;-webkit-transition:.2s;transition:opacity .2s}.slider.svelte-siboy4::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:20px;height:20px;border-radius:50%;background:#4CAF50;cursor:pointer}.slider.svelte-siboy4::-moz-range-thumb{width:20px;height:20px;border-radius:50%;background:#4CAF50;cursor:pointer}";
	append(document_1.head, style);
}

function DynamicWaveForm_svelte_create_fragment(ctx) {
	let input;
	let t0;
	let div0;
	let t1;
	let div1;
	let mounted;
	let dispose;

	return {
		c() {
			input = internal_element("input");
			t0 = space();
			div0 = internal_element("div");
			t1 = space();
			div1 = internal_element("div");
			attr(input, "id", "zoomSlider");
			attr(input, "class", "slider svelte-siboy4");
			attr(input, "type", "range");
			attr(input, "min", "0");
			attr(input, "max", "7");
			attr(input, "step", "1");
			attr(div0, "id", "zoomview-container");
			attr(div1, "id", "overview-container");
		},
		m(target, anchor) {
			insert(target, input, anchor);
			set_input_value(input, /*zoomLevel*/ ctx[0]);
			insert(target, t0, anchor);
			insert(target, div0, anchor);
			insert(target, t1, anchor);
			insert(target, div1, anchor);

			if (!mounted) {
				dispose = [
					listen(input, "change", /*input_change_input_handler*/ ctx[3]),
					listen(input, "input", /*input_change_input_handler*/ ctx[3]),
					listen(input, "input", /*handleZoomChange*/ ctx[1])
				];

				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*zoomLevel*/ 1) {
				set_input_value(input, /*zoomLevel*/ ctx[0]);
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(input);
			if (detaching) detach(t0);
			if (detaching) detach(div0);
			if (detaching) detach(t1);
			if (detaching) detach(div1);
			mounted = false;
			run_all(dispose);
		}
	};
}

function DynamicWaveForm_svelte_instance($$self, $$props, $$invalidate) {
	let { recordingId } = $$props;
	let peaks = {};
	let zoomLevel = 0;

	onMount(async () => {
		// https://github.com/bbc/peaks.js#configuration
		const options = {
			containers: {
				overview: document.getElementById("overview-container"),
				zoomview: document.getElementById("zoomview-container")
			},
			mediaElement: document.getElementById("audio_element_" + recordingId),
			dataUri: {
				json: "/recording/getPeaksFile/" + recordingId
			},
			height: 200,
			zoomLevels: [32, 64, 128, 256, 512, 1024, 2048, 4096],
			emitCueEvents: true, /* https://github.com/bbc/peaks.js#events */
			// Color for the zoomable waveform
			zoomWaveformColor: "rgba(0, 225, 128, 1)",
			// Color for the overview waveform
			overviewWaveformColor: "rgba(0,150,0,1)",
			// Color for the overview waveform rectangle
			// that shows what the zoomable view shows
			overviewHighlightColor: "rgb(200,42,0)",
			// Color of the play head text
			playheadTextColor: "#666666",
			showPlayheadTime: true,
			axisLabelColor: "#333333",
			// the color of a point marker
			pointMarkerColor: "#CCCCCC",
			keyboard: true,
			// Keyboard nudge increment in seconds (left arrow/right arrow)
			nudgeIncrement: 0.01
		};

		peaks = peaks_default().init(options, function (err, peaks) {
			
		}); // ...

		peaks.zoom.setZoom(4);
		$$invalidate(0, zoomLevel = 4);
	});

	function handleZoomChange(event) {
		$$invalidate(0, zoomLevel = event.target.value);
		peaks.zoom.setZoom(zoomLevel);
	}

	function input_change_input_handler() {
		zoomLevel = to_number(this.value);
		$$invalidate(0, zoomLevel);
	}

	$$self.$$set = $$props => {
		if ("recordingId" in $$props) $$invalidate(2, recordingId = $$props.recordingId);
	};

	return [zoomLevel, handleZoomChange, recordingId, input_change_input_handler];
}

class DynamicWaveForm extends SvelteComponent {
	constructor(options) {
		super();
		if (!document_1.getElementById("svelte-siboy4-style")) add_css();
		init(this, options, DynamicWaveForm_svelte_instance, DynamicWaveForm_svelte_create_fragment, safe_not_equal, { recordingId: 2 });
	}
}

/* harmony default export */ const DynamicWaveForm_svelte = (DynamicWaveForm);
;// CONCATENATED MODULE: ./src/main/js/recording/RecordingUi.svelte
/* src/main/js/recording/RecordingUi.svelte generated by Svelte v3.29.7 */


const { window: window_1 } = globals;





function create_if_block(ctx) {
	let t;

	return {
		c() {
			t = internal_text("Loading... Please wait...");
		},
		m(target, anchor) {
			insert(target, t, anchor);
		},
		d(detaching) {
			if (detaching) detach(t);
		}
	};
}

function RecordingUi_svelte_create_fragment(ctx) {
	let p;
	let t0;
	let audioplayer;
	let t1;
	let dynamicwaveform;
	let current;
	let mounted;
	let dispose;
	let if_block = !/*recording*/ ctx[1].id && create_if_block(ctx);

	audioplayer = new AudioPlayer_svelte({
			props: { recordingId: /*recordingId*/ ctx[0] }
		});

	dynamicwaveform = new DynamicWaveForm_svelte({
			props: { recordingId: /*recordingId*/ ctx[0] }
		});

	return {
		c() {
			p = internal_element("p");
			if (if_block) if_block.c();
			t0 = space();
			create_component(audioplayer.$$.fragment);
			t1 = space();
			create_component(dynamicwaveform.$$.fragment);
		},
		m(target, anchor) {
			insert(target, p, anchor);
			if (if_block) if_block.m(p, null);
			insert(target, t0, anchor);
			mount_component(audioplayer, target, anchor);
			insert(target, t1, anchor);
			mount_component(dynamicwaveform, target, anchor);
			current = true;

			if (!mounted) {
				dispose = listen(window_1, "keydown", handleKeydown);
				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (!/*recording*/ ctx[1].id) {
				if (if_block) {
					
				} else {
					if_block = create_if_block(ctx);
					if_block.c();
					if_block.m(p, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			const audioplayer_changes = {};
			if (dirty & /*recordingId*/ 1) audioplayer_changes.recordingId = /*recordingId*/ ctx[0];
			audioplayer.$set(audioplayer_changes);
			const dynamicwaveform_changes = {};
			if (dirty & /*recordingId*/ 1) dynamicwaveform_changes.recordingId = /*recordingId*/ ctx[0];
			dynamicwaveform.$set(dynamicwaveform_changes);
		},
		i(local) {
			if (current) return;
			transition_in(audioplayer.$$.fragment, local);
			transition_in(dynamicwaveform.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(audioplayer.$$.fragment, local);
			transition_out(dynamicwaveform.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(p);
			if (if_block) if_block.d();
			if (detaching) detach(t0);
			destroy_component(audioplayer, detaching);
			if (detaching) detach(t1);
			destroy_component(dynamicwaveform, detaching);
			mounted = false;
			dispose();
		}
	};
}

function handleKeydown(event) {
	let key = event.key;
	let keyCode = event.keyCode;

	if (keyCode == 32) {
		// Space Bar
		// bound to window in sub-component
		window.togglePlayPause();
	}
}

function RecordingUi_svelte_instance($$self, $$props, $$invalidate) {
	let { recordingId } = $$props;

	// recording data structure loaded onMount
	let recording = {};

	const dispatch = createEventDispatcher();

	function forward(event) {
		dispatch("message", event.detail);
	}

	onMount(async () => {
		const res = await fetch("/recording/ajaxGet/" + recordingId);
		const ajaxData = await res.json();
		$$invalidate(1, recording = ajaxData.recording);
	});

	$$self.$$set = $$props => {
		if ("recordingId" in $$props) $$invalidate(0, recordingId = $$props.recordingId);
	};

	return [recordingId, recording];
}

class RecordingUi extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, RecordingUi_svelte_instance, RecordingUi_svelte_create_fragment, safe_not_equal, { recordingId: 0 });
	}
}

/* harmony default export */ const RecordingUi_svelte = (RecordingUi);
;// CONCATENATED MODULE: ./src/main/js/recordingUi.js


// find app target container
let container = document.getElementById("RecordingUiContainer");

// pass the recording id from gsp view
let recordingId = document.getElementById("recordingId").value;

const recordingUi = new RecordingUi_svelte({
    target: container,
    props: {
        recordingId: recordingId
    }
});
})();

/******/ })()
;