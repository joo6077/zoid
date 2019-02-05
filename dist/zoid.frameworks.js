!function(root, factory) {
    "object" == typeof exports && "object" == typeof module ? module.exports = factory() : "function" == typeof define && define.amd ? define("zoid", [], factory) : "object" == typeof exports ? exports.zoid = factory() : root.zoid = factory();
}("undefined" != typeof self ? self : this, function() {
    return function(modules) {
        var installedModules = {};
        function __webpack_require__(moduleId) {
            if (installedModules[moduleId]) return installedModules[moduleId].exports;
            var module = installedModules[moduleId] = {
                i: moduleId,
                l: !1,
                exports: {}
            };
            modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
            module.l = !0;
            return module.exports;
        }
        __webpack_require__.m = modules;
        __webpack_require__.c = installedModules;
        __webpack_require__.d = function(exports, name, getter) {
            __webpack_require__.o(exports, name) || Object.defineProperty(exports, name, {
                enumerable: !0,
                get: getter
            });
        };
        __webpack_require__.r = function(exports) {
            "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(exports, Symbol.toStringTag, {
                value: "Module"
            });
            Object.defineProperty(exports, "__esModule", {
                value: !0
            });
        };
        __webpack_require__.t = function(value, mode) {
            1 & mode && (value = __webpack_require__(value));
            if (8 & mode) return value;
            if (4 & mode && "object" == typeof value && value && value.__esModule) return value;
            var ns = Object.create(null);
            __webpack_require__.r(ns);
            Object.defineProperty(ns, "default", {
                enumerable: !0,
                value: value
            });
            if (2 & mode && "string" != typeof value) for (var key in value) __webpack_require__.d(ns, key, function(key) {
                return value[key];
            }.bind(null, key));
            return ns;
        };
        __webpack_require__.n = function(module) {
            var getter = module && module.__esModule ? function() {
                return module.default;
            } : function() {
                return module;
            };
            __webpack_require__.d(getter, "a", getter);
            return getter;
        };
        __webpack_require__.o = function(object, property) {
            return Object.prototype.hasOwnProperty.call(object, property);
        };
        __webpack_require__.p = "";
        return __webpack_require__(__webpack_require__.s = 0);
    }([ function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        var interface_namespaceObject = {};
        __webpack_require__.r(interface_namespaceObject);
        __webpack_require__.d(interface_namespaceObject, "WeakMap", function() {
            return weakmap_CrossDomainSafeWeakMap;
        });
        function _extends() {
            return (_extends = Object.assign || function(target) {
                for (var i = 1; i < arguments.length; i++) {
                    var source = arguments[i];
                    for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
                }
                return target;
            }).apply(this, arguments);
        }
        function utils_isPromise(item) {
            try {
                if (!item) return !1;
                if ("undefined" != typeof Promise && item instanceof Promise) return !0;
                if ("undefined" != typeof window && window.Window && item instanceof window.Window) return !1;
                if ("undefined" != typeof window && window.constructor && item instanceof window.constructor) return !1;
                var _toString = {}.toString;
                if (_toString) {
                    var name = _toString.call(item);
                    if ("[object Window]" === name || "[object global]" === name || "[object DOMWindow]" === name) return !1;
                }
                if ("function" == typeof item.then) return !0;
            } catch (err) {
                return !1;
            }
            return !1;
        }
        var flushPromise, dispatchedErrors = [], possiblyUnhandledPromiseHandlers = [], activeCount = 0;
        function flushActive() {
            if (!activeCount && flushPromise) {
                var promise = flushPromise;
                flushPromise = null;
                promise.resolve();
            }
        }
        function startActive() {
            activeCount += 1;
        }
        function endActive() {
            activeCount -= 1;
            flushActive();
        }
        var promise_ZalgoPromise = function() {
            function ZalgoPromise(handler) {
                var _this = this;
                this.resolved = void 0;
                this.rejected = void 0;
                this.errorHandled = void 0;
                this.value = void 0;
                this.error = void 0;
                this.handlers = void 0;
                this.dispatching = void 0;
                this.stack = void 0;
                this.resolved = !1;
                this.rejected = !1;
                this.errorHandled = !1;
                this.handlers = [];
                if (handler) {
                    var _result, _error, resolved = !1, rejected = !1, isAsync = !1;
                    startActive();
                    try {
                        handler(function(res) {
                            if (isAsync) _this.resolve(res); else {
                                resolved = !0;
                                _result = res;
                            }
                        }, function(err) {
                            if (isAsync) _this.reject(err); else {
                                rejected = !0;
                                _error = err;
                            }
                        });
                    } catch (err) {
                        endActive();
                        this.reject(err);
                        return;
                    }
                    endActive();
                    isAsync = !0;
                    resolved ? this.resolve(_result) : rejected && this.reject(_error);
                }
            }
            var _proto = ZalgoPromise.prototype;
            _proto.resolve = function(result) {
                if (this.resolved || this.rejected) return this;
                if (utils_isPromise(result)) throw new Error("Can not resolve promise with another promise");
                this.resolved = !0;
                this.value = result;
                this.dispatch();
                return this;
            };
            _proto.reject = function(error) {
                var _this2 = this;
                if (this.resolved || this.rejected) return this;
                if (utils_isPromise(error)) throw new Error("Can not reject promise with another promise");
                if (!error) {
                    var _err = error && "function" == typeof error.toString ? error.toString() : Object.prototype.toString.call(error);
                    error = new Error("Expected reject to be called with Error, got " + _err);
                }
                this.rejected = !0;
                this.error = error;
                this.errorHandled || setTimeout(function() {
                    _this2.errorHandled || function(err, promise) {
                        if (-1 === dispatchedErrors.indexOf(err)) {
                            dispatchedErrors.push(err);
                            setTimeout(function() {
                                throw err;
                            }, 1);
                            for (var j = 0; j < possiblyUnhandledPromiseHandlers.length; j++) possiblyUnhandledPromiseHandlers[j](err, promise);
                        }
                    }(error, _this2);
                }, 1);
                this.dispatch();
                return this;
            };
            _proto.asyncReject = function(error) {
                this.errorHandled = !0;
                this.reject(error);
                return this;
            };
            _proto.dispatch = function() {
                var _this3 = this, dispatching = this.dispatching, resolved = this.resolved, rejected = this.rejected, handlers = this.handlers;
                if (!dispatching && (resolved || rejected)) {
                    this.dispatching = !0;
                    startActive();
                    for (var _loop = function(i) {
                        var _handlers$i = handlers[i], onSuccess = _handlers$i.onSuccess, onError = _handlers$i.onError, promise = _handlers$i.promise, result = void 0;
                        if (resolved) try {
                            result = onSuccess ? onSuccess(_this3.value) : _this3.value;
                        } catch (err) {
                            promise.reject(err);
                            return "continue";
                        } else if (rejected) {
                            if (!onError) {
                                promise.reject(_this3.error);
                                return "continue";
                            }
                            try {
                                result = onError(_this3.error);
                            } catch (err) {
                                promise.reject(err);
                                return "continue";
                            }
                        }
                        if (result instanceof ZalgoPromise && (result.resolved || result.rejected)) {
                            result.resolved ? promise.resolve(result.value) : promise.reject(result.error);
                            result.errorHandled = !0;
                        } else utils_isPromise(result) ? result instanceof ZalgoPromise && (result.resolved || result.rejected) ? result.resolved ? promise.resolve(result.value) : promise.reject(result.error) : result.then(function(res) {
                            promise.resolve(res);
                        }, function(err) {
                            promise.reject(err);
                        }) : promise.resolve(result);
                    }, i = 0; i < handlers.length; i++) _loop(i);
                    handlers.length = 0;
                    this.dispatching = !1;
                    endActive();
                }
            };
            _proto.then = function(onSuccess, onError) {
                if (onSuccess && "function" != typeof onSuccess && !onSuccess.call) throw new Error("Promise.then expected a function for success handler");
                if (onError && "function" != typeof onError && !onError.call) throw new Error("Promise.then expected a function for error handler");
                var promise = new ZalgoPromise();
                this.handlers.push({
                    promise: promise,
                    onSuccess: onSuccess,
                    onError: onError
                });
                this.errorHandled = !0;
                this.dispatch();
                return promise;
            };
            _proto.catch = function(onError) {
                return this.then(void 0, onError);
            };
            _proto.finally = function(onFinally) {
                if (onFinally && "function" != typeof onFinally && !onFinally.call) throw new Error("Promise.finally expected a function");
                return this.then(function(result) {
                    return ZalgoPromise.try(onFinally).then(function() {
                        return result;
                    });
                }, function(err) {
                    return ZalgoPromise.try(onFinally).then(function() {
                        throw err;
                    });
                });
            };
            _proto.timeout = function(time, err) {
                var _this4 = this;
                if (this.resolved || this.rejected) return this;
                var timeout = setTimeout(function() {
                    _this4.resolved || _this4.rejected || _this4.reject(err || new Error("Promise timed out after " + time + "ms"));
                }, time);
                return this.then(function(result) {
                    clearTimeout(timeout);
                    return result;
                });
            };
            _proto.toPromise = function() {
                if ("undefined" == typeof Promise) throw new TypeError("Could not find Promise");
                return Promise.resolve(this);
            };
            ZalgoPromise.resolve = function(value) {
                return value instanceof ZalgoPromise ? value : utils_isPromise(value) ? new ZalgoPromise(function(resolve, reject) {
                    return value.then(resolve, reject);
                }) : new ZalgoPromise().resolve(value);
            };
            ZalgoPromise.reject = function(error) {
                return new ZalgoPromise().reject(error);
            };
            ZalgoPromise.asyncReject = function(error) {
                return new ZalgoPromise().asyncReject(error);
            };
            ZalgoPromise.all = function(promises) {
                var promise = new ZalgoPromise(), count = promises.length, results = [];
                if (!count) {
                    promise.resolve(results);
                    return promise;
                }
                for (var _loop2 = function(i) {
                    var prom = promises[i];
                    if (prom instanceof ZalgoPromise) {
                        if (prom.resolved) {
                            results[i] = prom.value;
                            count -= 1;
                            return "continue";
                        }
                    } else if (!utils_isPromise(prom)) {
                        results[i] = prom;
                        count -= 1;
                        return "continue";
                    }
                    ZalgoPromise.resolve(prom).then(function(result) {
                        results[i] = result;
                        0 == (count -= 1) && promise.resolve(results);
                    }, function(err) {
                        promise.reject(err);
                    });
                }, i = 0; i < promises.length; i++) _loop2(i);
                0 === count && promise.resolve(results);
                return promise;
            };
            ZalgoPromise.hash = function(promises) {
                var result = {};
                return ZalgoPromise.all(Object.keys(promises).map(function(key) {
                    return ZalgoPromise.resolve(promises[key]).then(function(value) {
                        result[key] = value;
                    });
                })).then(function() {
                    return result;
                });
            };
            ZalgoPromise.map = function(items, method) {
                return ZalgoPromise.all(items.map(method));
            };
            ZalgoPromise.onPossiblyUnhandledException = function(handler) {
                return function(handler) {
                    possiblyUnhandledPromiseHandlers.push(handler);
                    return {
                        cancel: function() {
                            possiblyUnhandledPromiseHandlers.splice(possiblyUnhandledPromiseHandlers.indexOf(handler), 1);
                        }
                    };
                }(handler);
            };
            ZalgoPromise.try = function(method, context, args) {
                if (method && "function" != typeof method && !method.call) throw new Error("Promise.try expected a function");
                var result;
                startActive();
                try {
                    result = method.apply(context, args || []);
                } catch (err) {
                    endActive();
                    return ZalgoPromise.reject(err);
                }
                endActive();
                return ZalgoPromise.resolve(result);
            };
            ZalgoPromise.delay = function(_delay) {
                return new ZalgoPromise(function(resolve) {
                    setTimeout(resolve, _delay);
                });
            };
            ZalgoPromise.isPromise = function(value) {
                return !!(value && value instanceof ZalgoPromise) || utils_isPromise(value);
            };
            ZalgoPromise.flush = function() {
                return function(Zalgo) {
                    var promise = flushPromise = flushPromise || new ZalgoPromise();
                    flushActive();
                    return promise;
                }();
            };
            return ZalgoPromise;
        }();
        function isRegex(item) {
            return "[object RegExp]" === Object.prototype.toString.call(item);
        }
        var PROTOCOL = {
            MOCK: "mock:",
            FILE: "file:",
            ABOUT: "about:"
        }, WILDCARD = "*", WINDOW_TYPE = {
            IFRAME: "iframe",
            POPUP: "popup"
        }, IE_WIN_ACCESS_ERROR = "Call was rejected by callee.\r\n";
        function isAboutProtocol(win) {
            void 0 === win && (win = window);
            return win.location.protocol === PROTOCOL.ABOUT;
        }
        function getParent(win) {
            if (win) try {
                if (win.parent && win.parent !== win) return win.parent;
            } catch (err) {}
        }
        function getOpener(win) {
            if (win && !getParent(win)) try {
                return win.opener;
            } catch (err) {}
        }
        function canReadFromWindow(win) {
            try {
                win && win.location && win.location.href;
                return !0;
            } catch (err) {}
            return !1;
        }
        function getActualDomain(win) {
            var location = (win = win || window).location;
            if (!location) throw new Error("Can not read window location");
            var protocol = location.protocol;
            if (!protocol) throw new Error("Can not read window protocol");
            if (protocol === PROTOCOL.FILE) return PROTOCOL.FILE + "//";
            if (protocol === PROTOCOL.ABOUT) {
                var parent = getParent(win);
                return parent && canReadFromWindow(parent) ? getActualDomain(parent) : PROTOCOL.ABOUT + "//";
            }
            var host = location.host;
            if (!host) throw new Error("Can not read window host");
            return protocol + "//" + host;
        }
        function utils_getDomain(win) {
            var domain = getActualDomain(win = win || window);
            return domain && win.mockDomain && 0 === win.mockDomain.indexOf(PROTOCOL.MOCK) ? win.mockDomain : domain;
        }
        function isActuallySameDomain(win) {
            try {
                if (win === window) return !0;
            } catch (err) {}
            try {
                var desc = Object.getOwnPropertyDescriptor(win, "location");
                if (desc && !1 === desc.enumerable) return !1;
            } catch (err) {}
            try {
                if (isAboutProtocol(win) && canReadFromWindow(win)) return !0;
            } catch (err) {}
            try {
                if (getActualDomain(win) === getActualDomain(window)) return !0;
            } catch (err) {}
            return !1;
        }
        function isSameDomain(win) {
            if (!isActuallySameDomain(win)) return !1;
            try {
                if (win === window) return !0;
                if (isAboutProtocol(win) && canReadFromWindow(win)) return !0;
                if (utils_getDomain(window) === utils_getDomain(win)) return !0;
            } catch (err) {}
            return !1;
        }
        function assertSameDomain(win) {
            if (!isSameDomain(win)) throw new Error("Expected window to be same domain");
            return win;
        }
        function isAncestorParent(parent, child) {
            if (!parent || !child) return !1;
            var childParent = getParent(child);
            return childParent ? childParent === parent : -1 !== function(win) {
                var result = [];
                try {
                    for (;win.parent !== win; ) {
                        result.push(win.parent);
                        win = win.parent;
                    }
                } catch (err) {}
                return result;
            }(child).indexOf(parent);
        }
        function getFrames(win) {
            var frames, len, result = [];
            try {
                frames = win.frames;
            } catch (err) {
                frames = win;
            }
            try {
                len = frames.length;
            } catch (err) {}
            if (0 === len) return result;
            if (len) {
                for (var i = 0; i < len; i++) {
                    var frame = void 0;
                    try {
                        frame = frames[i];
                    } catch (err) {
                        continue;
                    }
                    result.push(frame);
                }
                return result;
            }
            for (var _i = 0; _i < 100; _i++) {
                var _frame = void 0;
                try {
                    _frame = frames[_i];
                } catch (err) {
                    return result;
                }
                if (!_frame) return result;
                result.push(_frame);
            }
            return result;
        }
        function getAllChildFrames(win) {
            for (var result = [], _i3 = 0, _getFrames2 = getFrames(win); _i3 < _getFrames2.length; _i3++) {
                var frame = _getFrames2[_i3];
                result.push(frame);
                for (var _i5 = 0, _getAllChildFrames2 = getAllChildFrames(frame); _i5 < _getAllChildFrames2.length; _i5++) {
                    var childFrame = _getAllChildFrames2[_i5];
                    result.push(childFrame);
                }
            }
            return result;
        }
        function getTop(win) {
            if (win) {
                try {
                    if (win.top) return win.top;
                } catch (err) {}
                if (getParent(win) === win) return win;
                try {
                    if (isAncestorParent(window, win) && window.top) return window.top;
                } catch (err) {}
                try {
                    if (isAncestorParent(win, window) && window.top) return window.top;
                } catch (err) {}
                for (var _i7 = 0, _getAllChildFrames4 = getAllChildFrames(win); _i7 < _getAllChildFrames4.length; _i7++) {
                    var frame = _getAllChildFrames4[_i7];
                    try {
                        if (frame.top) return frame.top;
                    } catch (err) {}
                    if (getParent(frame) === frame) return frame;
                }
            }
        }
        function getAllFramesInWindow(win) {
            var top = getTop(win);
            if (!top) throw new Error("Can not determine top window");
            return [].concat(getAllChildFrames(top), [ top ]);
        }
        var iframeWindows = [], iframeFrames = [];
        function isWindowClosed(win, allowMock) {
            void 0 === allowMock && (allowMock = !0);
            try {
                if (win === window) return !1;
            } catch (err) {
                return !0;
            }
            try {
                if (!win) return !0;
            } catch (err) {
                return !0;
            }
            try {
                if (win.closed) return !0;
            } catch (err) {
                return !err || err.message !== IE_WIN_ACCESS_ERROR;
            }
            if (allowMock && isSameDomain(win)) try {
                if (win.mockclosed) return !0;
            } catch (err) {}
            try {
                if (!win.parent || !win.top) return !0;
            } catch (err) {}
            var iframeIndex = function(collection, item) {
                for (var i = 0; i < collection.length; i++) try {
                    if (collection[i] === item) return i;
                } catch (err) {}
                return -1;
            }(iframeWindows, win);
            if (-1 !== iframeIndex) {
                var frame = iframeFrames[iframeIndex];
                if (frame && function(frame) {
                    if (!frame.contentWindow) return !0;
                    if (!frame.parentNode) return !0;
                    var doc = frame.ownerDocument;
                    return !(!doc || !doc.documentElement || doc.documentElement.contains(frame));
                }(frame)) return !0;
            }
            return !1;
        }
        function getAncestor(win) {
            return getOpener(win = win || window) || getParent(win) || void 0;
        }
        function anyMatch(collection1, collection2) {
            for (var _i17 = 0; _i17 < collection1.length; _i17++) for (var item1 = collection1[_i17], _i19 = 0; _i19 < collection2.length; _i19++) if (item1 === collection2[_i19]) return !0;
            return !1;
        }
        function getDistanceFromTop(win) {
            void 0 === win && (win = window);
            for (var distance = 0, parent = win; parent; ) (parent = getParent(parent)) && (distance += 1);
            return distance;
        }
        function isSameTopWindow(win1, win2) {
            var top1 = getTop(win1) || win1, top2 = getTop(win2) || win2;
            try {
                if (top1 && top2) return top1 === top2;
            } catch (err) {}
            var allFrames1 = getAllFramesInWindow(win1), allFrames2 = getAllFramesInWindow(win2);
            if (anyMatch(allFrames1, allFrames2)) return !0;
            var opener1 = getOpener(top1), opener2 = getOpener(top2);
            return !(opener1 && anyMatch(getAllFramesInWindow(opener1), allFrames2) || (opener2 && anyMatch(getAllFramesInWindow(opener2), allFrames1), 
            1));
        }
        function matchDomain(pattern, origin) {
            if ("string" == typeof pattern) {
                if ("string" == typeof origin) return pattern === WILDCARD || origin === pattern;
                if (isRegex(origin)) return !1;
                if (Array.isArray(origin)) return !1;
            }
            return isRegex(pattern) ? isRegex(origin) ? pattern.toString() === origin.toString() : !Array.isArray(origin) && Boolean(origin.match(pattern)) : !!Array.isArray(pattern) && (Array.isArray(origin) ? JSON.stringify(pattern) === JSON.stringify(origin) : !isRegex(origin) && pattern.some(function(subpattern) {
                return matchDomain(subpattern, origin);
            }));
        }
        function getDomainFromUrl(url) {
            return url.match(/^(https?|mock|file):\/\//) ? url.split("/").slice(0, 3).join("/") : utils_getDomain();
        }
        function onCloseWindow(win, callback, delay, maxtime) {
            void 0 === delay && (delay = 1e3);
            void 0 === maxtime && (maxtime = 1 / 0);
            var timeout;
            !function check() {
                if (isWindowClosed(win)) {
                    timeout && clearTimeout(timeout);
                    return callback();
                }
                if (maxtime <= 0) clearTimeout(timeout); else {
                    maxtime -= delay;
                    timeout = setTimeout(check, delay);
                }
            }();
            return {
                cancel: function() {
                    timeout && clearTimeout(timeout);
                }
            };
        }
        function isWindow(obj) {
            try {
                if (obj === window) return !0;
            } catch (err) {
                if (err && err.message === IE_WIN_ACCESS_ERROR) return !0;
            }
            try {
                if ("[object Window]" === Object.prototype.toString.call(obj)) return !0;
            } catch (err) {
                if (err && err.message === IE_WIN_ACCESS_ERROR) return !0;
            }
            try {
                if (window.Window && obj instanceof window.Window) return !0;
            } catch (err) {
                if (err && err.message === IE_WIN_ACCESS_ERROR) return !0;
            }
            try {
                if (obj && obj.self === obj) return !0;
            } catch (err) {
                if (err && err.message === IE_WIN_ACCESS_ERROR) return !0;
            }
            try {
                if (obj && obj.parent === obj) return !0;
            } catch (err) {
                if (err && err.message === IE_WIN_ACCESS_ERROR) return !0;
            }
            try {
                if (obj && obj.top === obj) return !0;
            } catch (err) {
                if (err && err.message === IE_WIN_ACCESS_ERROR) return !0;
            }
            try {
                obj && obj.__cross_domain_utils_window_check__;
            } catch (err) {
                return !0;
            }
            return !1;
        }
        function util_safeIndexOf(collection, item) {
            for (var i = 0; i < collection.length; i++) try {
                if (collection[i] === item) return i;
            } catch (err) {}
            return -1;
        }
        var objectIDs, awaitFrameLoadPromises, defineProperty = Object.defineProperty, counter = Date.now() % 1e9, weakmap_CrossDomainSafeWeakMap = function() {
            function CrossDomainSafeWeakMap() {
                this.name = void 0;
                this.weakmap = void 0;
                this.keys = void 0;
                this.values = void 0;
                counter += 1;
                this.name = "__weakmap_" + (1e9 * Math.random() >>> 0) + "__" + counter;
                if (function() {
                    if ("undefined" == typeof WeakMap) return !1;
                    if (void 0 === Object.freeze) return !1;
                    try {
                        var testWeakMap = new WeakMap(), testKey = {};
                        Object.freeze(testKey);
                        testWeakMap.set(testKey, "__testvalue__");
                        return "__testvalue__" === testWeakMap.get(testKey);
                    } catch (err) {
                        return !1;
                    }
                }()) try {
                    this.weakmap = new WeakMap();
                } catch (err) {}
                this.keys = [];
                this.values = [];
            }
            var _proto = CrossDomainSafeWeakMap.prototype;
            _proto._cleanupClosedWindows = function() {
                for (var weakmap = this.weakmap, keys = this.keys, i = 0; i < keys.length; i++) {
                    var value = keys[i];
                    if (isWindow(value) && isWindowClosed(value)) {
                        if (weakmap) try {
                            weakmap.delete(value);
                        } catch (err) {}
                        keys.splice(i, 1);
                        this.values.splice(i, 1);
                        i -= 1;
                    }
                }
            };
            _proto.isSafeToReadWrite = function(key) {
                if (isWindow(key)) return !1;
                try {
                    key && key.self;
                    key && key[this.name];
                } catch (err) {
                    return !1;
                }
                return !0;
            };
            _proto.set = function(key, value) {
                if (!key) throw new Error("WeakMap expected key");
                var weakmap = this.weakmap;
                if (weakmap) try {
                    weakmap.set(key, value);
                } catch (err) {
                    delete this.weakmap;
                }
                if (this.isSafeToReadWrite(key)) {
                    var name = this.name, entry = key[name];
                    entry && entry[0] === key ? entry[1] = value : defineProperty(key, name, {
                        value: [ key, value ],
                        writable: !0
                    });
                } else {
                    this._cleanupClosedWindows();
                    var keys = this.keys, values = this.values, index = util_safeIndexOf(keys, key);
                    if (-1 === index) {
                        keys.push(key);
                        values.push(value);
                    } else values[index] = value;
                }
            };
            _proto.get = function(key) {
                if (!key) throw new Error("WeakMap expected key");
                var weakmap = this.weakmap;
                if (weakmap) try {
                    if (weakmap.has(key)) return weakmap.get(key);
                } catch (err) {
                    delete this.weakmap;
                }
                if (!this.isSafeToReadWrite(key)) {
                    this._cleanupClosedWindows();
                    var index = util_safeIndexOf(this.keys, key);
                    if (-1 === index) return;
                    return this.values[index];
                }
                var entry = key[this.name];
                if (entry && entry[0] === key) return entry[1];
            };
            _proto.delete = function(key) {
                if (!key) throw new Error("WeakMap expected key");
                var weakmap = this.weakmap;
                if (weakmap) try {
                    weakmap.delete(key);
                } catch (err) {
                    delete this.weakmap;
                }
                if (this.isSafeToReadWrite(key)) {
                    var entry = key[this.name];
                    entry && entry[0] === key && (entry[0] = entry[1] = void 0);
                } else {
                    this._cleanupClosedWindows();
                    var keys = this.keys, index = util_safeIndexOf(keys, key);
                    if (-1 !== index) {
                        keys.splice(index, 1);
                        this.values.splice(index, 1);
                    }
                }
            };
            _proto.has = function(key) {
                if (!key) throw new Error("WeakMap expected key");
                var weakmap = this.weakmap;
                if (weakmap) try {
                    if (weakmap.has(key)) return !0;
                } catch (err) {
                    delete this.weakmap;
                }
                if (this.isSafeToReadWrite(key)) {
                    var entry = key[this.name];
                    return !(!entry || entry[0] !== key);
                }
                this._cleanupClosedWindows();
                return -1 !== util_safeIndexOf(this.keys, key);
            };
            _proto.getOrSet = function(key, getter) {
                if (this.has(key)) return this.get(key);
                var value = getter();
                this.set(key, value);
                return value;
            };
            return CrossDomainSafeWeakMap;
        }();
        function base64encode(str) {
            if ("function" == typeof btoa) return btoa(str);
            if ("undefined" != typeof Buffer) return Buffer.from(str, "utf8").toString("base64");
            throw new Error("Can not find window.btoa or Buffer");
        }
        function uniqueID() {
            var chars = "0123456789abcdef";
            return "xxxxxxxxxx".replace(/./g, function() {
                return chars.charAt(Math.floor(Math.random() * chars.length));
            }) + "_" + base64encode(new Date().toISOString().slice(11, 19).replace("T", ".")).replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
        }
        function serializeArgs(args) {
            try {
                return JSON.stringify(Array.prototype.slice.call(args), function(subkey, val) {
                    return "function" == typeof val ? "memoize[" + function(obj) {
                        objectIDs = objectIDs || new weakmap_CrossDomainSafeWeakMap();
                        if (null == obj || "object" != typeof obj && "function" != typeof obj) throw new Error("Invalid object");
                        var uid = objectIDs.get(obj);
                        if (!uid) {
                            uid = typeof obj + ":" + uniqueID();
                            objectIDs.set(obj, uid);
                        }
                        return uid;
                    }(val) + "]" : val;
                });
            } catch (err) {
                throw new Error("Arguments not serializable -- can not be used to memoize");
            }
        }
        function inlineMemoize(method, logic, args) {
            void 0 === args && (args = []);
            var cache = method.__inline_memoize_cache__ = method.__inline_memoize_cache__ || {}, key = serializeArgs(args);
            return cache.hasOwnProperty(key) ? cache[key] : cache[key] = logic.apply(void 0, args);
        }
        function src_util_noop() {}
        function once(method) {
            var called = !1;
            return function() {
                if (!called) {
                    called = !0;
                    return method.apply(this, arguments);
                }
            };
        }
        function stringifyError(err, level) {
            void 0 === level && (level = 1);
            if (level >= 3) return "stringifyError stack overflow";
            try {
                if (!err) return "<unknown error: " + Object.prototype.toString.call(err) + ">";
                if ("string" == typeof err) return err;
                if (err instanceof Error) {
                    var stack = err && err.stack, message = err && err.message;
                    if (stack && message) return -1 !== stack.indexOf(message) ? stack : message + "\n" + stack;
                    if (stack) return stack;
                    if (message) return message;
                }
                return "function" == typeof err.toString ? err.toString() : Object.prototype.toString.call(err);
            } catch (newErr) {
                return "Error while stringifying error: " + stringifyError(newErr, level + 1);
            }
        }
        function stringify(item) {
            return "string" == typeof item ? item : item && "function" == typeof item.toString ? item.toString() : Object.prototype.toString.call(item);
        }
        function extend(obj, source) {
            if (!source) return obj;
            if (Object.assign) return Object.assign(obj, source);
            for (var key in source) source.hasOwnProperty(key) && (obj[key] = source[key]);
            return obj;
        }
        function defineLazyProp(obj, key, getter) {
            if (Array.isArray(obj)) {
                if ("number" != typeof key) throw new TypeError("Array key must be number");
            } else if ("object" == typeof obj && null !== obj && "string" != typeof key) throw new TypeError("Object key must be string");
            Object.defineProperty(obj, key, {
                configurable: !0,
                enumerable: !0,
                get: function() {
                    delete obj[key];
                    var value = getter();
                    obj[key] = value;
                    return value;
                },
                set: function(value) {
                    delete obj[key];
                    obj[key] = value;
                }
            });
        }
        function isObjectObject(obj) {
            return "object" == typeof (item = obj) && null !== item && "[object Object]" === Object.prototype.toString.call(obj);
            var item;
        }
        function isPlainObject(obj) {
            if (!isObjectObject(obj)) return !1;
            var constructor = obj.constructor;
            if ("function" != typeof constructor) return !1;
            var prototype = constructor.prototype;
            return !!isObjectObject(prototype) && !!prototype.hasOwnProperty("isPrototypeOf");
        }
        function replaceObject(item, replacer, fullKey) {
            void 0 === fullKey && (fullKey = "");
            if (Array.isArray(item)) {
                for (var length = item.length, result = [], _loop2 = function(i) {
                    defineLazyProp(result, i, function() {
                        var itemKey = fullKey ? fullKey + "." + i : "" + i, el = item[i], child = replacer(el, i, itemKey);
                        (isPlainObject(child) || Array.isArray(child)) && (child = replaceObject(child, replacer, itemKey));
                        return child;
                    });
                }, i = 0; i < length; i++) _loop2(i);
                return result;
            }
            if (isPlainObject(item)) {
                var _result = {}, _loop3 = function(key) {
                    if (!item.hasOwnProperty(key)) return "continue";
                    defineLazyProp(_result, key, function() {
                        var itemKey = fullKey ? fullKey + "." + key : "" + key, el = item[key], child = replacer(el, key, itemKey);
                        (isPlainObject(child) || Array.isArray(child)) && (child = replaceObject(child, replacer, itemKey));
                        return child;
                    });
                };
                for (var key in item) _loop3(key);
                return _result;
            }
            throw new Error("Pass an object or array");
        }
        function isDefined(value) {
            return null != value;
        }
        function util_isRegex(item) {
            return "[object RegExp]" === Object.prototype.toString.call(item);
        }
        function util_getOrSet(obj, key, getter) {
            if (obj.hasOwnProperty(key)) return obj[key];
            var val = getter();
            obj[key] = val;
            return val;
        }
        function cleanup(obj) {
            var tasks = [], cleaned = !1;
            return {
                set: function(name, item) {
                    if (!cleaned) {
                        obj[name] = item;
                        this.register(function() {
                            delete obj[name];
                        });
                    }
                    return item;
                },
                register: function(method) {
                    cleaned ? method() : tasks.push(once(method));
                },
                all: function() {
                    var results = [];
                    cleaned = !0;
                    for (;tasks.length; ) {
                        var task = tasks.pop();
                        results.push(task());
                    }
                    return promise_ZalgoPromise.all(results).then(src_util_noop);
                }
            };
        }
        function assertExists(name, thing) {
            if (null == thing) throw new Error("Expected " + name + " to be present");
            return thing;
        }
        function isDocumentReady() {
            return Boolean(document.body) && "complete" === document.readyState;
        }
        function urlEncode(str) {
            return str.replace(/\?/g, "%3F").replace(/&/g, "%26").replace(/#/g, "%23").replace(/\+/g, "%2B");
        }
        function waitForDocumentReady() {
            return inlineMemoize(waitForDocumentReady, function() {
                return new promise_ZalgoPromise(function(resolve) {
                    if (isDocumentReady()) return resolve();
                    var interval = setInterval(function() {
                        if (isDocumentReady()) {
                            clearInterval(interval);
                            return resolve();
                        }
                    }, 10);
                });
            });
        }
        function parseQuery(queryString) {
            return inlineMemoize(parseQuery, function() {
                var params = {};
                if (!queryString) return params;
                if (-1 === queryString.indexOf("=")) return params;
                for (var _i2 = 0, _queryString$split2 = queryString.split("&"); _i2 < _queryString$split2.length; _i2++) {
                    var pair = _queryString$split2[_i2];
                    (pair = pair.split("="))[0] && pair[1] && (params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]));
                }
                return params;
            }, [ queryString ]);
        }
        function extendQuery(originalQuery, props) {
            void 0 === props && (props = {});
            return props && Object.keys(props).length ? function(obj) {
                void 0 === obj && (obj = {});
                return Object.keys(obj).filter(function(key) {
                    return "string" == typeof obj[key];
                }).map(function(key) {
                    return urlEncode(key) + "=" + urlEncode(obj[key]);
                }).join("&");
            }(_extends({}, parseQuery(originalQuery), props)) : originalQuery;
        }
        function appendChild(container, child) {
            container.appendChild(child);
        }
        function isElement(element) {
            return element instanceof window.Element || null !== element && "object" == typeof element && 1 === element.nodeType && "object" == typeof element.style && "object" == typeof element.ownerDocument;
        }
        function getElementSafe(id, doc) {
            void 0 === doc && (doc = document);
            return isElement(id) ? id : "string" == typeof id ? doc.querySelector(id) : void 0;
        }
        function elementReady(id) {
            return new promise_ZalgoPromise(function(resolve, reject) {
                var name = stringify(id), el = getElementSafe(id);
                if (el) return resolve(el);
                if (isDocumentReady()) return reject(new Error("Document is ready and element " + name + " does not exist"));
                var interval = setInterval(function() {
                    if (el = getElementSafe(id)) {
                        clearInterval(interval);
                        return resolve(el);
                    }
                    if (isDocumentReady()) {
                        clearInterval(interval);
                        return reject(new Error("Document is ready and element " + name + " does not exist"));
                    }
                }, 10);
            });
        }
        function PopupOpenError(message) {
            this.message = message;
        }
        PopupOpenError.prototype = Object.create(Error.prototype);
        function awaitFrameLoad(frame) {
            if ((awaitFrameLoadPromises = awaitFrameLoadPromises || new weakmap_CrossDomainSafeWeakMap()).has(frame)) {
                var _promise = awaitFrameLoadPromises.get(frame);
                if (_promise) return _promise;
            }
            var promise = new promise_ZalgoPromise(function(resolve, reject) {
                frame.addEventListener("load", function() {
                    !function(frame) {
                        !function() {
                            for (var i = 0; i < iframeWindows.length; i++) {
                                var closed = !1;
                                try {
                                    closed = iframeWindows[i].closed;
                                } catch (err) {}
                                if (closed) {
                                    iframeFrames.splice(i, 1);
                                    iframeWindows.splice(i, 1);
                                }
                            }
                        }();
                        if (frame && frame.contentWindow) try {
                            iframeWindows.push(frame.contentWindow);
                            iframeFrames.push(frame);
                        } catch (err) {}
                    }(frame);
                    resolve(frame);
                });
                frame.addEventListener("error", function(err) {
                    frame.contentWindow ? resolve(frame) : reject(err);
                });
            });
            awaitFrameLoadPromises.set(frame, promise);
            return promise;
        }
        function awaitFrameWindow(frame) {
            return frame.contentWindow ? promise_ZalgoPromise.resolve(frame.contentWindow) : awaitFrameLoad(frame).then(function(loadedFrame) {
                if (!loadedFrame.contentWindow) throw new Error("Could not find window in iframe");
                return loadedFrame.contentWindow;
            });
        }
        function dom_iframe(options, container, attempts) {
            void 0 === options && (options = {});
            void 0 === attempts && (attempts = 3);
            var attributes = options.attributes || {}, style = options.style || {}, frame = function(tag, options, container) {
                void 0 === tag && (tag = "div");
                void 0 === options && (options = {});
                tag = tag.toLowerCase();
                var element = document.createElement(tag);
                options.style && extend(element.style, options.style);
                options.class && (element.className = options.class.join(" "));
                options.id && element.setAttribute("id", options.id);
                if (options.attributes) for (var _i6 = 0, _Object$keys2 = Object.keys(options.attributes); _i6 < _Object$keys2.length; _i6++) {
                    var key = _Object$keys2[_i6];
                    element.setAttribute(key, options.attributes[key]);
                }
                options.styleSheet && function(el, styleText, doc) {
                    void 0 === doc && (doc = window.document);
                    el.styleSheet ? el.styleSheet.cssText = styleText : el.appendChild(doc.createTextNode(styleText));
                }(element, options.styleSheet);
                if (options.html) {
                    if ("iframe" === tag) throw new Error("Iframe html can not be written unless container provided and iframe in DOM");
                    element.innerHTML = options.html;
                }
                return element;
            }("iframe", {
                attributes: _extends({
                    frameBorder: "0",
                    allowTransparency: "true"
                }, attributes),
                style: _extends({
                    backgroundColor: "transparent"
                }, style),
                html: options.html,
                class: options.class
            });
            awaitFrameLoad(frame);
            if (container) {
                var el = function(id, doc) {
                    void 0 === doc && (doc = document);
                    var element = getElementSafe(id, doc);
                    if (element) return element;
                    throw new Error("Can not find element: " + stringify(id));
                }(container);
                el.appendChild(frame);
                var win = frame.contentWindow;
                if (win) try {
                    win.name;
                } catch (err) {
                    el.removeChild(frame);
                    if (!attempts) throw new Error("Frame is cross-domain: " + err.stack);
                    return dom_iframe(options, container, attempts - 1);
                }
            }
            (options.url || window.navigator.userAgent.match(/MSIE|Edge/i)) && frame.setAttribute("src", options.url || "about:blank");
            return frame;
        }
        function addEventListener(obj, event, handler) {
            obj.addEventListener(event, handler);
            return {
                cancel: function() {
                    obj.removeEventListener(event, handler);
                }
            };
        }
        function destroyElement(element) {
            element && element.parentNode && element.parentNode.removeChild(element);
        }
        function isElementClosed(el) {
            return !el || !el.parentNode;
        }
        function onResize(el, handler, _temp) {
            var _ref2 = void 0 === _temp ? {} : _temp, _ref2$width = _ref2.width, width = void 0 === _ref2$width || _ref2$width, _ref2$height = _ref2.height, height = void 0 === _ref2$height || _ref2$height, _ref2$interval = _ref2.interval, interval = void 0 === _ref2$interval ? 100 : _ref2$interval, _ref2$win = _ref2.win, win = void 0 === _ref2$win ? window : _ref2$win, currentWidth = el.offsetWidth, currentHeight = el.offsetHeight;
            handler({
                width: currentWidth,
                height: currentHeight
            });
            var observer, timeout, check = function() {
                var newWidth = el.offsetWidth, newHeight = el.offsetHeight;
                (width && newWidth !== currentWidth || height && newHeight !== currentHeight) && handler({
                    width: newWidth,
                    height: newHeight
                });
                currentWidth = newWidth;
                currentHeight = newHeight;
            };
            if (void 0 !== win.ResizeObserver) (observer = new win.ResizeObserver(check)).observe(el); else if (void 0 !== win.MutationObserver) {
                (observer = new win.MutationObserver(check)).observe(el, {
                    attributes: !0,
                    childList: !0,
                    subtree: !0,
                    characterData: !1
                });
                win.addEventListener("resize", check);
            } else !function loop() {
                check();
                timeout = setTimeout(loop, interval);
            }();
            return {
                cancel: function() {
                    observer.disconnect();
                    window.removeEventListener("resize", check);
                    clearTimeout(timeout);
                }
            };
        }
        function isPerc(str) {
            return "string" == typeof str && /^[0-9]+%$/.test(str);
        }
        function isPx(str) {
            return "string" == typeof str && /^[0-9]+px$/.test(str);
        }
        function toPx(val) {
            return function(val) {
                if ("number" == typeof val) return val;
                var match = val.match(/^([0-9]+)(px|%)$/);
                if (!match) throw new Error("Could not match css value from " + val);
                return parseInt(match[1], 10);
            }(val) + "px";
        }
        function toCSS(val) {
            return "number" == typeof val ? toPx(val) : isPerc(val) ? val : toPx(val);
        }
        var CHILD_WINDOW_TIMEOUT = 5e3, ACK_TIMEOUT = 2e3, ACK_TIMEOUT_KNOWN = 1e4, RES_TIMEOUT = -1, MESSAGE_TYPE = {
            REQUEST: "postrobot_message_request",
            RESPONSE: "postrobot_message_response",
            ACK: "postrobot_message_ack"
        }, MESSAGE_NAME = {
            METHOD: "postrobot_method",
            HELLO: "postrobot_hello",
            OPEN_TUNNEL: "postrobot_open_tunnel"
        }, constants_WILDCARD = "*", SERIALIZATION_TYPE = {
            CROSS_DOMAIN_ZALGO_PROMISE: "cross_domain_zalgo_promise",
            CROSS_DOMAIN_FUNCTION: "cross_domain_function",
            CROSS_DOMAIN_WINDOW: "cross_domain_window"
        };
        function global_getGlobal(win) {
            void 0 === win && (win = window);
            return win !== window ? win.__post_robot_10_0_0__ : win.__post_robot_10_0_0__ = win.__post_robot_10_0_0__ || {};
        }
        var getObj = function() {
            return {};
        };
        function globalStore(key, defStore) {
            void 0 === key && (key = "store");
            void 0 === defStore && (defStore = getObj);
            return util_getOrSet(global_getGlobal(), key, function() {
                var store = defStore();
                return {
                    has: function(storeKey) {
                        return store.hasOwnProperty(storeKey);
                    },
                    get: function(storeKey, defVal) {
                        return store.hasOwnProperty(storeKey) ? store[storeKey] : defVal;
                    },
                    set: function(storeKey, val) {
                        store[storeKey] = val;
                        return val;
                    },
                    del: function(storeKey) {
                        delete store[storeKey];
                    },
                    getOrSet: function(storeKey, getter) {
                        return util_getOrSet(store, storeKey, getter);
                    },
                    reset: function() {
                        store = defStore();
                    },
                    keys: function() {
                        return Object.keys(store);
                    }
                };
            });
        }
        var WildCard = function() {};
        function getWildcard() {
            var global = global_getGlobal();
            global.WINDOW_WILDCARD = global.WINDOW_WILDCARD || new WildCard();
            return global.WINDOW_WILDCARD;
        }
        function windowStore(key, defStore) {
            void 0 === key && (key = "store");
            void 0 === defStore && (defStore = getObj);
            return globalStore("windowStore").getOrSet(key, function() {
                var winStore = new weakmap_CrossDomainSafeWeakMap(), getStore = function(win) {
                    return winStore.getOrSet(win, defStore);
                };
                return {
                    has: function(win) {
                        return getStore(win).hasOwnProperty(key);
                    },
                    get: function(win, defVal) {
                        var store = getStore(win);
                        return store.hasOwnProperty(key) ? store[key] : defVal;
                    },
                    set: function(win, val) {
                        getStore(win)[key] = val;
                        return val;
                    },
                    del: function(win) {
                        delete getStore(win)[key];
                    },
                    getOrSet: function(win, getter) {
                        return util_getOrSet(getStore(win), key, getter);
                    }
                };
            });
        }
        function hello_getInstanceID() {
            return globalStore("instance").getOrSet("instanceID", uniqueID);
        }
        function getHelloPromise(win) {
            return windowStore("helloPromises").getOrSet(win, function() {
                return new promise_ZalgoPromise();
            });
        }
        function sayHello(win, _ref3) {
            return (0, _ref3.send)(win, MESSAGE_NAME.HELLO, {
                instanceID: hello_getInstanceID()
            }, {
                domain: constants_WILDCARD,
                timeout: -1
            }).then(function(_ref4) {
                var origin = _ref4.origin, instanceID = _ref4.data.instanceID;
                getHelloPromise(win).resolve({
                    win: win,
                    domain: origin
                });
                return {
                    win: win,
                    domain: origin,
                    instanceID: instanceID
                };
            });
        }
        function getWindowInstanceID(win, _ref5) {
            var send = _ref5.send;
            return windowStore("windowInstanceIDPromises").getOrSet(win, function() {
                return sayHello(win, {
                    send: send
                }).then(function(_ref6) {
                    return _ref6.instanceID;
                });
            });
        }
        function markWindowKnown(win) {
            windowStore("knownWindows").set(win, !0);
        }
        var _SERIALIZER, TYPE = {
            FUNCTION: "function",
            ERROR: "error",
            PROMISE: "promise",
            REGEX: "regex",
            DATE: "date",
            ARRAY: "array",
            OBJECT: "object",
            STRING: "string",
            NUMBER: "number",
            BOOLEAN: "boolean",
            NULL: "null",
            UNDEFINED: "undefined"
        };
        function isSerializedType(item) {
            return "object" == typeof item && null !== item && "string" == typeof item.__type__;
        }
        function determineType(val) {
            return void 0 === val ? TYPE.UNDEFINED : null === val ? TYPE.NULL : Array.isArray(val) ? TYPE.ARRAY : "function" == typeof val ? TYPE.FUNCTION : "object" == typeof val ? val instanceof Error ? TYPE.ERROR : "function" == typeof val.then ? TYPE.PROMISE : "[object RegExp]" === Object.prototype.toString.call(val) ? TYPE.REGEX : "[object Date]" === Object.prototype.toString.call(val) ? TYPE.DATE : TYPE.OBJECT : "string" == typeof val ? TYPE.STRING : "number" == typeof val ? TYPE.NUMBER : "boolean" == typeof val ? TYPE.BOOLEAN : void 0;
        }
        function serializeType(type, val) {
            return {
                __type__: type,
                __val__: val
            };
        }
        var _DESERIALIZER, SERIALIZER = ((_SERIALIZER = {})[TYPE.FUNCTION] = function() {}, 
        _SERIALIZER[TYPE.ERROR] = function(_ref) {
            var message = _ref.message, stack = _ref.stack, code = _ref.code;
            return serializeType(TYPE.ERROR, {
                message: message,
                stack: stack,
                code: code
            });
        }, _SERIALIZER[TYPE.PROMISE] = function() {}, _SERIALIZER[TYPE.REGEX] = function(val) {
            return serializeType(TYPE.REGEX, val.source);
        }, _SERIALIZER[TYPE.DATE] = function(val) {
            return serializeType(TYPE.DATE, val.toJSON());
        }, _SERIALIZER[TYPE.ARRAY] = function(val) {
            return val;
        }, _SERIALIZER[TYPE.OBJECT] = function(val) {
            return val;
        }, _SERIALIZER[TYPE.STRING] = function(val) {
            return val;
        }, _SERIALIZER[TYPE.NUMBER] = function(val) {
            return val;
        }, _SERIALIZER[TYPE.BOOLEAN] = function(val) {
            return val;
        }, _SERIALIZER[TYPE.NULL] = function(val) {
            return val;
        }, _SERIALIZER), defaultSerializers = {}, DESERIALIZER = ((_DESERIALIZER = {})[TYPE.FUNCTION] = function() {
            throw new Error("Function serialization is not implemented; nothing to deserialize");
        }, _DESERIALIZER[TYPE.ERROR] = function(_ref2) {
            var message = _ref2.message, stack = _ref2.stack, code = _ref2.code, error = new Error(message);
            error.code = code;
            error.stack = stack + "\n\n" + error.stack;
            return error;
        }, _DESERIALIZER[TYPE.PROMISE] = function() {
            throw new Error("Promise serialization is not implemented; nothing to deserialize");
        }, _DESERIALIZER[TYPE.REGEX] = function(val) {
            return new RegExp(val);
        }, _DESERIALIZER[TYPE.DATE] = function(val) {
            return new Date(val);
        }, _DESERIALIZER[TYPE.ARRAY] = function(val) {
            return val;
        }, _DESERIALIZER[TYPE.OBJECT] = function(val) {
            return val;
        }, _DESERIALIZER[TYPE.STRING] = function(val) {
            return val;
        }, _DESERIALIZER[TYPE.NUMBER] = function(val) {
            return val;
        }, _DESERIALIZER[TYPE.BOOLEAN] = function(val) {
            return val;
        }, _DESERIALIZER[TYPE.NULL] = function(val) {
            return val;
        }, _DESERIALIZER), defaultDeserializers = {};
        new promise_ZalgoPromise(function(resolve) {
            if (window.document && window.document.body) return resolve(window.document.body);
            var interval = setInterval(function() {
                if (window.document && window.document.body) {
                    clearInterval(interval);
                    return resolve(window.document.body);
                }
            }, 10);
        });
        function cleanupProxyWindows() {
            for (var idToProxyWindow = globalStore("idToProxyWindow"), _i2 = 0, _idToProxyWindow$keys2 = idToProxyWindow.keys(); _i2 < _idToProxyWindow$keys2.length; _i2++) {
                var id = _idToProxyWindow$keys2[_i2];
                idToProxyWindow.get(id).shouldClean() && idToProxyWindow.del(id);
            }
        }
        var window_ProxyWindow = function() {
            function ProxyWindow(serializedWindow, actualWindow, _ref) {
                var send = _ref.send;
                this.isProxyWindow = !0;
                this.serializedWindow = void 0;
                this.actualWindow = void 0;
                this.actualWindowPromise = void 0;
                this.send = void 0;
                this.serializedWindow = serializedWindow;
                this.actualWindowPromise = new promise_ZalgoPromise();
                actualWindow && this.setWindow(actualWindow);
                this.serializedWindow.getInstanceID = function(method) {
                    var cache = {};
                    function memoizedPromiseFunction() {
                        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) args[_key2] = arguments[_key2];
                        var key = serializeArgs(args);
                        if (cache.hasOwnProperty(key)) return cache[key];
                        cache[key] = method.apply(this, arguments).finally(function() {
                            delete cache[key];
                        });
                        return cache[key];
                    }
                    memoizedPromiseFunction.reset = function() {
                        cache = {};
                    };
                    return memoizedPromiseFunction;
                }(this.serializedWindow.getInstanceID);
                this.send = send;
            }
            var _proto = ProxyWindow.prototype;
            _proto.getType = function() {
                return this.serializedWindow.type;
            };
            _proto.isPopup = function() {
                return this.getType() === WINDOW_TYPE.POPUP;
            };
            _proto.isIframe = function() {
                return this.getType() === WINDOW_TYPE.IFRAME;
            };
            _proto.setLocation = function(href) {
                var _this = this;
                return promise_ZalgoPromise.try(function() {
                    if (!_this.actualWindow) return _this.serializedWindow.setLocation(href);
                    _this.actualWindow.location = href;
                }).then(function() {
                    return _this;
                });
            };
            _proto.setName = function(name) {
                var _this2 = this;
                return promise_ZalgoPromise.try(function() {
                    if (!_this2.actualWindow) return _this2.serializedWindow.setName(name);
                    if (!isSameDomain(_this2.actualWindow)) throw new Error("Can not set name for window on different domain");
                    _this2.actualWindow.name = name;
                    _this2.actualWindow.frameElement && _this2.actualWindow.frameElement.setAttribute("name", name);
                }).then(function() {
                    return _this2;
                });
            };
            _proto.close = function() {
                var _this3 = this;
                return promise_ZalgoPromise.try(function() {
                    if (!_this3.actualWindow) return _this3.serializedWindow.close();
                    _this3.actualWindow.close();
                }).then(function() {
                    return _this3;
                });
            };
            _proto.focus = function() {
                var _this4 = this;
                return promise_ZalgoPromise.try(function() {
                    _this4.actualWindow && _this4.actualWindow.focus();
                    return _this4.serializedWindow.focus();
                }).then(function() {
                    return _this4;
                });
            };
            _proto.isClosed = function() {
                var _this5 = this;
                return promise_ZalgoPromise.try(function() {
                    return _this5.actualWindow ? isWindowClosed(_this5.actualWindow) : _this5.serializedWindow.isClosed();
                });
            };
            _proto.getWindow = function() {
                return this.actualWindow;
            };
            _proto.setWindow = function(win) {
                this.actualWindow = win;
                this.actualWindowPromise.resolve(win);
            };
            _proto.awaitWindow = function() {
                return this.actualWindowPromise;
            };
            _proto.matchWindow = function(win) {
                var _this6 = this;
                return promise_ZalgoPromise.try(function() {
                    return _this6.actualWindow ? win === _this6.actualWindow : promise_ZalgoPromise.all([ _this6.getInstanceID(), getWindowInstanceID(win, {
                        send: _this6.send
                    }) ]).then(function(_ref2) {
                        var match = _ref2[0] === _ref2[1];
                        match && _this6.setWindow(win);
                        return match;
                    });
                });
            };
            _proto.unwrap = function() {
                return this.actualWindow || this;
            };
            _proto.getInstanceID = function() {
                return this.actualWindow ? getWindowInstanceID(this.actualWindow, {
                    send: this.send
                }) : this.serializedWindow.getInstanceID();
            };
            _proto.serialize = function() {
                return this.serializedWindow;
            };
            _proto.shouldClean = function() {
                return this.actualWindow && isWindowClosed(this.actualWindow);
            };
            ProxyWindow.unwrap = function(win) {
                return ProxyWindow.isProxyWindow(win) ? win.unwrap() : win;
            };
            ProxyWindow.serialize = function(win, _ref3) {
                var send = _ref3.send;
                cleanupProxyWindows();
                return ProxyWindow.toProxyWindow(win, {
                    send: send
                }).serialize();
            };
            ProxyWindow.deserialize = function(serializedWindow, _ref4) {
                var on = _ref4.on, send = _ref4.send;
                cleanupProxyWindows();
                return globalStore("idToProxyWindow").getOrSet(serializedWindow.id, function() {
                    return new ProxyWindow(serializedWindow, null, {
                        on: on,
                        send: send
                    });
                });
            };
            ProxyWindow.isProxyWindow = function(obj) {
                return Boolean(obj && !isWindow(obj) && obj.isProxyWindow);
            };
            ProxyWindow.toProxyWindow = function(win, _ref5) {
                var send = _ref5.send;
                cleanupProxyWindows();
                return ProxyWindow.isProxyWindow(win) ? win : windowStore("winToProxyWindow").getOrSet(win, function() {
                    var id = uniqueID();
                    return globalStore("idToProxyWindow").set(id, new ProxyWindow({
                        id: id,
                        type: getOpener(win) ? WINDOW_TYPE.POPUP : WINDOW_TYPE.IFRAME,
                        getInstanceID: function() {
                            return getWindowInstanceID(win, {
                                send: send
                            });
                        },
                        close: function() {
                            return promise_ZalgoPromise.try(function() {
                                win.close();
                            });
                        },
                        focus: function() {
                            return promise_ZalgoPromise.try(function() {
                                win.focus();
                            });
                        },
                        isClosed: function() {
                            return promise_ZalgoPromise.try(function() {
                                return isWindowClosed(win);
                            });
                        },
                        setLocation: function(href) {
                            return promise_ZalgoPromise.try(function() {
                                if (isSameDomain(win)) try {
                                    if (win.location && "function" == typeof win.location.replace) {
                                        win.location.replace(href);
                                        return;
                                    }
                                } catch (err) {}
                                win.location = href;
                            });
                        },
                        setName: function(name) {
                            return promise_ZalgoPromise.try(function() {
                                win.name = name;
                            });
                        }
                    }, win, {
                        send: send
                    }));
                });
            };
            return ProxyWindow;
        }();
        function addMethod(id, val, name, source, domain) {
            var methodStore = windowStore("methodStore"), proxyWindowMethods = globalStore("proxyWindowMethods");
            if (window_ProxyWindow.isProxyWindow(source)) proxyWindowMethods.set(id, {
                val: val,
                name: name,
                domain: domain,
                source: source
            }); else {
                proxyWindowMethods.del(id);
                methodStore.getOrSet(source, function() {
                    return {};
                })[id] = {
                    domain: domain,
                    name: name,
                    val: val,
                    source: source
                };
            }
        }
        function lookupMethod(source, id) {
            var methodStore = windowStore("methodStore"), proxyWindowMethods = globalStore("proxyWindowMethods");
            return methodStore.getOrSet(source, function() {
                return {};
            })[id] || proxyWindowMethods.get(id);
        }
        function function_serializeFunction(destination, domain, val, key, _ref3) {
            !function(_ref) {
                var on = _ref3.on;
                globalStore("builtinListeners").getOrSet("functionCalls", function() {
                    return on(MESSAGE_NAME.METHOD, {
                        domain: constants_WILDCARD
                    }, function(_ref2) {
                        var source = _ref2.source, origin = _ref2.origin, data = _ref2.data, id = data.id, name = data.name, meth = lookupMethod(source, id);
                        if (!meth) throw new Error("Could not find method '" + data.name + "' with id: " + data.id + " in " + utils_getDomain(window));
                        var methodSource = meth.source, domain = meth.domain, val = meth.val;
                        return promise_ZalgoPromise.try(function() {
                            if (!matchDomain(domain, origin)) throw new Error("Method '" + data.name + "' domain " + JSON.stringify(util_isRegex(meth.domain) ? meth.domain.source : meth.domain) + " does not match origin " + origin + " in " + utils_getDomain(window));
                            if (window_ProxyWindow.isProxyWindow(methodSource)) return methodSource.matchWindow(source).then(function(match) {
                                if (!match) throw new Error("Method call '" + data.name + "' failed - proxy window does not match source in " + utils_getDomain(window));
                            });
                        }).then(function() {
                            return val.apply({
                                source: source,
                                origin: origin
                            }, data.args);
                        }, function(err) {
                            return promise_ZalgoPromise.try(function() {
                                if (val.onError) return val.onError(err);
                            }).then(function() {
                                throw err;
                            });
                        }).then(function(result) {
                            return {
                                result: result,
                                id: id,
                                name: name
                            };
                        });
                    });
                });
            }();
            var id = val.__id__ || uniqueID();
            destination = window_ProxyWindow.unwrap(destination);
            var name = val.__name__ || val.name || key;
            if (window_ProxyWindow.isProxyWindow(destination)) {
                addMethod(id, val, name, destination, domain);
                destination.awaitWindow().then(function(win) {
                    addMethod(id, val, name, win, domain);
                });
            } else addMethod(id, val, name, destination, domain);
            return serializeType(SERIALIZATION_TYPE.CROSS_DOMAIN_FUNCTION, {
                id: id,
                name: name
            });
        }
        function serializeMessage(destination, domain, obj, _ref) {
            var _serialize, on = _ref.on, send = _ref.send;
            return function(obj, serializers) {
                void 0 === serializers && (serializers = defaultSerializers);
                var result = JSON.stringify(obj, function(key) {
                    var val = this[key];
                    if (isSerializedType(this)) return val;
                    var type = determineType(val);
                    if (!type) return val;
                    var serializer = serializers[type] || SERIALIZER[type];
                    return serializer ? serializer(val, key) : val;
                });
                return void 0 === result ? TYPE.UNDEFINED : result;
            }(obj, ((_serialize = {})[TYPE.PROMISE] = function(val, key) {
                return function(destination, domain, val, key, _ref) {
                    var on = _ref.on, send = _ref.send;
                    return serializeType(SERIALIZATION_TYPE.CROSS_DOMAIN_ZALGO_PROMISE, {
                        then: function_serializeFunction(destination, domain, function(resolve, reject) {
                            return val.then(resolve, reject);
                        }, key, {
                            on: on,
                            send: send
                        })
                    });
                }(destination, domain, val, key, {
                    on: on,
                    send: send
                });
            }, _serialize[TYPE.FUNCTION] = function(val, key) {
                return function_serializeFunction(destination, domain, val, key, {
                    on: on,
                    send: send
                });
            }, _serialize[TYPE.OBJECT] = function(val) {
                return isWindow(val) || window_ProxyWindow.isProxyWindow(val) ? function(destination, domain, win, _ref6) {
                    var send = _ref6.send;
                    return serializeType(SERIALIZATION_TYPE.CROSS_DOMAIN_WINDOW, window_ProxyWindow.serialize(win, {
                        send: send
                    }));
                }(0, 0, val, {
                    on: on,
                    send: send
                }) : val;
            }, _serialize));
        }
        function deserializeMessage(source, origin, message, _ref2) {
            var _deserialize, on = _ref2.on, send = _ref2.send;
            return function(str, deserializers) {
                void 0 === deserializers && (deserializers = defaultDeserializers);
                if (str !== TYPE.UNDEFINED) return JSON.parse(str, function(key, val) {
                    if (isSerializedType(this)) return val;
                    var type, value;
                    if (isSerializedType(val)) {
                        type = val.__type__;
                        value = val.__val__;
                    } else {
                        type = determineType(val);
                        value = val;
                    }
                    if (!type) return value;
                    var deserializer = deserializers[type] || DESERIALIZER[type];
                    return deserializer ? deserializer(value, key) : value;
                });
            }(message, ((_deserialize = {})[SERIALIZATION_TYPE.CROSS_DOMAIN_ZALGO_PROMISE] = function(serializedPromise) {
                return then = serializedPromise.then, new promise_ZalgoPromise(then);
                var then;
            }, _deserialize[SERIALIZATION_TYPE.CROSS_DOMAIN_FUNCTION] = function(serializedFunction) {
                return function(source, origin, _ref4, _ref5) {
                    var id = _ref4.id, name = _ref4.name, send = _ref5.send, getDeserializedFunction = function(opts) {
                        void 0 === opts && (opts = {});
                        function crossDomainFunctionWrapper() {
                            var _arguments = arguments;
                            return window_ProxyWindow.toProxyWindow(source, {
                                send: send
                            }).awaitWindow().then(function(win) {
                                var meth = lookupMethod(win, id);
                                return meth && meth.val !== crossDomainFunctionWrapper ? meth.val.apply({
                                    source: window,
                                    origin: utils_getDomain()
                                }, _arguments) : send(win, MESSAGE_NAME.METHOD, {
                                    id: id,
                                    name: name,
                                    args: Array.prototype.slice.call(_arguments)
                                }, {
                                    domain: origin,
                                    fireAndForget: opts.fireAndForget
                                }).then(function(res) {
                                    if (!opts.fireAndForget) return res.data.result;
                                });
                            }).catch(function(err) {
                                throw err;
                            });
                        }
                        crossDomainFunctionWrapper.__name__ = name;
                        crossDomainFunctionWrapper.__origin__ = origin;
                        crossDomainFunctionWrapper.__source__ = source;
                        crossDomainFunctionWrapper.__id__ = id;
                        crossDomainFunctionWrapper.origin = origin;
                        return crossDomainFunctionWrapper;
                    }, crossDomainFunctionWrapper = getDeserializedFunction();
                    crossDomainFunctionWrapper.fireAndForget = getDeserializedFunction({
                        fireAndForget: !0
                    });
                    return crossDomainFunctionWrapper;
                }(source, origin, serializedFunction, {
                    on: on,
                    send: send
                });
            }, _deserialize[SERIALIZATION_TYPE.CROSS_DOMAIN_WINDOW] = function(serializedWindow) {
                return function(source, origin, win, _ref7) {
                    var on = _ref7.on, send = _ref7.send;
                    return window_ProxyWindow.deserialize(win, {
                        on: on,
                        send: send
                    });
                }(0, 0, serializedWindow, {
                    on: on,
                    send: send
                });
            }, _deserialize));
        }
        var SEND_MESSAGE_STRATEGIES = {
            postrobot_post_message: function(win, serializedMessage, domain) {
                (Array.isArray(domain) ? domain : "string" == typeof domain ? [ domain ] : [ constants_WILDCARD ]).map(function(dom) {
                    if (0 === dom.indexOf(PROTOCOL.MOCK)) {
                        if (window.location.protocol === PROTOCOL.FILE) return constants_WILDCARD;
                        if (!isActuallySameDomain(win)) throw new Error("Attempting to send messsage to mock domain " + dom + ", but window is actually cross-domain");
                        return getActualDomain(win);
                    }
                    return 0 === dom.indexOf(PROTOCOL.FILE) ? constants_WILDCARD : dom;
                }).forEach(function(dom) {
                    win.postMessage(serializedMessage, dom);
                });
            },
            postrobot_global: function(win, serializedMessage) {
                if (function(win) {
                    return (win = win || window).navigator.mockUserAgent || win.navigator.userAgent;
                }(window).match(/MSIE|rv:11|trident|edge\/12|edge\/13/i)) {
                    if (!isSameDomain(win)) throw new Error("Post message through global disabled between different domain windows");
                    if (!1 !== isSameTopWindow(window, win)) throw new Error("Can only use global to communicate between two different windows, not between frames");
                    var foreignGlobal = global_getGlobal(win);
                    if (!foreignGlobal) throw new Error("Can not find postRobot global on foreign window");
                    foreignGlobal.receiveMessage({
                        source: window,
                        origin: utils_getDomain(),
                        data: serializedMessage
                    });
                }
            }
        };
        function send_sendMessage(win, domain, message, _ref) {
            var _serializeMessage, on = _ref.on, send = _ref.send;
            if (isWindowClosed(win)) throw new Error("Window is closed");
            for (var error, serializedMessage = serializeMessage(win, domain, ((_serializeMessage = {}).__post_robot_10_0_0__ = _extends({
                id: uniqueID()
            }, message), _serializeMessage), {
                on: on,
                send: send
            }), success = !1, _i2 = 0, _Object$keys2 = Object.keys(SEND_MESSAGE_STRATEGIES); _i2 < _Object$keys2.length; _i2++) {
                var strategyName = _Object$keys2[_i2];
                try {
                    SEND_MESSAGE_STRATEGIES[strategyName](win, serializedMessage, domain);
                    success = !0;
                } catch (err) {
                    error = error || err;
                }
            }
            if (!success) throw error;
        }
        var _RECEIVE_MESSAGE_TYPE, __DOMAIN_REGEX__ = "__domain_regex__";
        function getResponseListener(hash) {
            return globalStore("responseListeners").get(hash);
        }
        function deleteResponseListener(hash) {
            globalStore("responseListeners").del(hash);
        }
        function isResponseListenerErrored(hash) {
            return globalStore("erroredResponseListeners").has(hash);
        }
        function getRequestListener(_ref) {
            var name = _ref.name, win = _ref.win, domain = _ref.domain, requestListeners = windowStore("requestListeners");
            win === constants_WILDCARD && (win = null);
            domain === constants_WILDCARD && (domain = null);
            if (!name) throw new Error("Name required to get request listener");
            for (var _i2 = 0, _ref3 = [ win, getWildcard() ]; _i2 < _ref3.length; _i2++) {
                var winQualifier = _ref3[_i2];
                if (winQualifier) {
                    var nameListeners = requestListeners.get(winQualifier);
                    if (nameListeners) {
                        var domainListeners = nameListeners[name];
                        if (domainListeners) {
                            if (domain && "string" == typeof domain) {
                                if (domainListeners[domain]) return domainListeners[domain];
                                if (domainListeners[__DOMAIN_REGEX__]) for (var _i4 = 0, _domainListeners$__DO2 = domainListeners[__DOMAIN_REGEX__]; _i4 < _domainListeners$__DO2.length; _i4++) {
                                    var _domainListeners$__DO3 = _domainListeners$__DO2[_i4], regex = _domainListeners$__DO3.regex, listener = _domainListeners$__DO3.listener;
                                    if (matchDomain(regex, domain)) return listener;
                                }
                            }
                            if (domainListeners[constants_WILDCARD]) return domainListeners[constants_WILDCARD];
                        }
                    }
                }
            }
        }
        var RECEIVE_MESSAGE_TYPES = ((_RECEIVE_MESSAGE_TYPE = {})[MESSAGE_TYPE.REQUEST] = function(source, origin, message, _ref) {
            var on = _ref.on, send = _ref.send, options = getRequestListener({
                name: message.name,
                win: source,
                domain: origin
            });
            message.name === MESSAGE_NAME.METHOD && message.data && "string" == typeof message.data.name ? message.data.name : message.name;
            function sendResponse(type, ack, response) {
                void 0 === response && (response = {});
                message.fireAndForget || isWindowClosed(source) || send_sendMessage(source, origin, _extends({
                    type: type,
                    ack: ack,
                    hash: message.hash,
                    name: message.name
                }, response), {
                    on: on,
                    send: send
                });
            }
            return promise_ZalgoPromise.all([ sendResponse(MESSAGE_TYPE.ACK), promise_ZalgoPromise.try(function() {
                if (!options) throw new Error("No handler found for post message: " + message.name + " from " + origin + " in " + window.location.protocol + "//" + window.location.host + window.location.pathname);
                if (!matchDomain(options.domain, origin)) throw new Error("Request origin " + origin + " does not match domain " + options.domain.toString());
                var data = message.data;
                return options.handler({
                    source: source,
                    origin: origin,
                    data: data
                });
            }).then(function(data) {
                return sendResponse(MESSAGE_TYPE.RESPONSE, "success", {
                    data: data
                });
            }, function(error) {
                return sendResponse(MESSAGE_TYPE.RESPONSE, "error", {
                    error: error
                });
            }) ]).then(src_util_noop).catch(function(err) {
                if (options && options.handleError) return options.handleError(err);
                throw err;
            });
        }, _RECEIVE_MESSAGE_TYPE[MESSAGE_TYPE.ACK] = function(source, origin, message) {
            if (!isResponseListenerErrored(message.hash)) {
                var options = getResponseListener(message.hash);
                if (!options) throw new Error("No handler found for post message ack for message: " + message.name + " from " + origin + " in " + window.location.protocol + "//" + window.location.host + window.location.pathname);
                if (!matchDomain(options.domain, origin)) throw new Error("Ack origin " + origin + " does not match domain " + options.domain.toString());
                if (source !== options.win) throw new Error("Ack source does not match registered window");
                options.ack = !0;
            }
        }, _RECEIVE_MESSAGE_TYPE[MESSAGE_TYPE.RESPONSE] = function(source, origin, message) {
            if (!isResponseListenerErrored(message.hash)) {
                var pattern, options = getResponseListener(message.hash);
                if (!options) throw new Error("No handler found for post message response for message: " + message.name + " from " + origin + " in " + window.location.protocol + "//" + window.location.host + window.location.pathname);
                if (!matchDomain(options.domain, origin)) throw new Error("Response origin " + origin + " does not match domain " + (pattern = options.domain, 
                Array.isArray(pattern) ? "(" + pattern.join(" | ") + ")" : isRegex(pattern) ? "RegExp(" + pattern.toString() : pattern.toString()));
                if (source !== options.win) throw new Error("Response source does not match registered window");
                deleteResponseListener(message.hash);
                message.name === MESSAGE_NAME.METHOD && message.data && "string" == typeof message.data.name ? message.data.name : message.name;
                "error" === message.ack ? options.promise.reject(message.error) : "success" === message.ack && options.promise.resolve({
                    source: source,
                    origin: origin,
                    data: message.data
                });
            }
        }, _RECEIVE_MESSAGE_TYPE);
        function receive_receiveMessage(event, _ref2) {
            var on = _ref2.on, send = _ref2.send, receivedMessages = globalStore("receivedMessages");
            if (!window || window.closed) throw new Error("Message recieved in closed window");
            try {
                if (!event.source) return;
            } catch (err) {
                return;
            }
            var source = event.source, origin = event.origin, message = function(message, source, origin, _ref) {
                var parsedMessage, on = _ref.on, send = _ref.send;
                try {
                    parsedMessage = deserializeMessage(source, origin, message, {
                        on: on,
                        send: send
                    });
                } catch (err) {
                    return;
                }
                if (parsedMessage && "object" == typeof parsedMessage && null !== parsedMessage && (parsedMessage = parsedMessage.__post_robot_10_0_0__) && "object" == typeof parsedMessage && null !== parsedMessage && parsedMessage.type && "string" == typeof parsedMessage.type && RECEIVE_MESSAGE_TYPES[parsedMessage.type]) return parsedMessage;
            }(event.data, source, origin, {
                on: on,
                send: send
            });
            if (message) {
                markWindowKnown(source);
                if (!receivedMessages.has(message.id)) {
                    receivedMessages.set(message.id, !0);
                    isWindowClosed(source) && !message.fireAndForget || RECEIVE_MESSAGE_TYPES[message.type](source, origin, message, {
                        on: on,
                        send: send
                    });
                }
            }
        }
        function on_on(name, options, handler) {
            if (!name) throw new Error("Expected name");
            if ("function" == typeof options) {
                handler = options;
                options = {};
            }
            if (!handler) throw new Error("Expected handler");
            (options = options || {}).name = name;
            options.handler = handler || options.handler;
            var win = options.window, domain = options.domain, requestListener = function addRequestListener(_ref4, listener) {
                var name = _ref4.name, win = _ref4.win, domain = _ref4.domain, requestListeners = windowStore("requestListeners");
                if (!name || "string" != typeof name) throw new Error("Name required to add request listener");
                if (Array.isArray(win)) {
                    for (var listenersCollection = [], _i6 = 0, _win2 = win; _i6 < _win2.length; _i6++) {
                        var item = _win2[_i6];
                        listenersCollection.push(addRequestListener({
                            name: name,
                            domain: domain,
                            win: item
                        }, listener));
                    }
                    return {
                        cancel: function() {
                            for (var _i8 = 0; _i8 < listenersCollection.length; _i8++) listenersCollection[_i8].cancel();
                        }
                    };
                }
                if (Array.isArray(domain)) {
                    for (var _listenersCollection = [], _i10 = 0, _domain2 = domain; _i10 < _domain2.length; _i10++) {
                        var _item = _domain2[_i10];
                        _listenersCollection.push(addRequestListener({
                            name: name,
                            win: win,
                            domain: _item
                        }, listener));
                    }
                    return {
                        cancel: function() {
                            for (var _i12 = 0; _i12 < _listenersCollection.length; _i12++) _listenersCollection[_i12].cancel();
                        }
                    };
                }
                var existingListener = getRequestListener({
                    name: name,
                    win: win,
                    domain: domain
                });
                win && win !== constants_WILDCARD || (win = getWildcard());
                domain = domain || constants_WILDCARD;
                if (existingListener) throw win && domain ? new Error("Request listener already exists for " + name + " on domain " + domain.toString() + " for " + (win === getWildcard() ? "wildcard" : "specified") + " window") : win ? new Error("Request listener already exists for " + name + " for " + (win === getWildcard() ? "wildcard" : "specified") + " window") : domain ? new Error("Request listener already exists for " + name + " on domain " + domain.toString()) : new Error("Request listener already exists for " + name);
                var regexListeners, regexListener, nameListeners = requestListeners.getOrSet(win, function() {
                    return {};
                }), domainListeners = util_getOrSet(nameListeners, name, function() {
                    return {};
                }), strDomain = domain.toString();
                if (util_isRegex(domain)) {
                    regexListeners = util_getOrSet(domainListeners, __DOMAIN_REGEX__, function() {
                        return [];
                    });
                    regexListener = {
                        regex: domain,
                        listener: listener
                    };
                    regexListeners.push(regexListener);
                } else domainListeners[strDomain] = listener;
                return {
                    cancel: function() {
                        delete domainListeners[strDomain];
                        if (regexListener) {
                            regexListeners.splice(regexListeners.indexOf(regexListener, 1));
                            regexListeners.length || delete domainListeners[__DOMAIN_REGEX__];
                        }
                        Object.keys(domainListeners).length || delete nameListeners[name];
                        win && !Object.keys(nameListeners).length && requestListeners.del(win);
                    }
                };
            }({
                name: name,
                win: win,
                domain: domain
            }, {
                handler: options.handler,
                handleError: options.errorHandler || function(err) {
                    throw err;
                },
                window: win,
                domain: domain || constants_WILDCARD,
                name: name
            });
            return {
                cancel: function() {
                    requestListener.cancel();
                }
            };
        }
        function send_send(win, name, data, options) {
            var domain = (options = options || {}).domain || constants_WILDCARD, responseTimeout = options.timeout || RES_TIMEOUT, childTimeout = options.timeout || CHILD_WINDOW_TIMEOUT, fireAndForget = options.fireAndForget || !1;
            return promise_ZalgoPromise.try(function() {
                if (!name) throw new Error("Expected name");
                if (domain && "string" != typeof domain && !Array.isArray(domain) && !util_isRegex(domain)) throw new TypeError("Expected domain to be a string, array, or regex");
                if (isWindowClosed(win)) throw new Error("Target window is closed");
                var reqPromises = windowStore("requestPromises").getOrSet(win, function() {
                    return [];
                }), requestPromise = promise_ZalgoPromise.try(function() {
                    return function(parent, child) {
                        var actualParent = getAncestor(child);
                        if (actualParent) return actualParent === parent;
                        if (child === parent) return !1;
                        if (getTop(child) === child) return !1;
                        for (var _i15 = 0, _getFrames8 = getFrames(parent); _i15 < _getFrames8.length; _i15++) if (_getFrames8[_i15] === child) return !0;
                        return !1;
                    }(window, win) ? function(win, timeout, name) {
                        void 0 === timeout && (timeout = 5e3);
                        void 0 === name && (name = "Window");
                        var promise = getHelloPromise(win);
                        -1 !== timeout && (promise = promise.timeout(timeout, new Error(name + " did not load after " + timeout + "ms")));
                        return promise;
                    }(win, childTimeout) : util_isRegex(domain) ? sayHello(win, {
                        send: send_send
                    }) : void 0;
                }).then(function(_temp) {
                    var origin = (void 0 === _temp ? {} : _temp).domain;
                    if (util_isRegex(domain)) {
                        if (!matchDomain(domain, origin)) throw new Error("Remote window domain " + origin + " does not match regex: " + domain.source);
                        domain = origin;
                    }
                    name === MESSAGE_NAME.METHOD && data && "string" == typeof data.name && data.name;
                    var hasResult = !1, promise = new promise_ZalgoPromise();
                    promise.finally(function() {
                        hasResult = !0;
                        reqPromises.splice(reqPromises.indexOf(requestPromise, 1));
                    }).catch(src_util_noop);
                    var hash = name + "_" + uniqueID();
                    send_sendMessage(win, domain, {
                        type: MESSAGE_TYPE.REQUEST,
                        hash: hash,
                        name: name,
                        data: data,
                        fireAndForget: fireAndForget
                    }, {
                        on: on_on,
                        send: send_send
                    });
                    if (fireAndForget) return promise.resolve();
                    promise.catch(function() {
                        !function(hash) {
                            globalStore("erroredResponseListeners").set(hash, !0);
                        }(hash);
                        deleteResponseListener(hash);
                    });
                    var responseListener = {
                        name: name,
                        win: win,
                        domain: domain,
                        promise: promise
                    };
                    !function(hash, listener) {
                        globalStore("responseListeners").set(hash, listener);
                    }(hash, responseListener);
                    var totalAckTimeout = function(win) {
                        return windowStore("knownWindows").get(win, !1);
                    }(win) ? ACK_TIMEOUT_KNOWN : ACK_TIMEOUT, totalResTimeout = responseTimeout, ackTimeout = totalAckTimeout, resTimeout = totalResTimeout, cycleTime = 100;
                    setTimeout(function cycle() {
                        if (!hasResult) {
                            if (isWindowClosed(win)) return responseListener.ack ? promise.reject(new Error("Window closed for " + name + " before response")) : promise.reject(new Error("Window closed for " + name + " before ack"));
                            ackTimeout = Math.max(ackTimeout - cycleTime, 0);
                            -1 !== resTimeout && (resTimeout = Math.max(resTimeout - cycleTime, 0));
                            if (responseListener.ack) {
                                if (-1 === resTimeout) return;
                                cycleTime = Math.min(resTimeout, 2e3);
                            } else {
                                if (0 === ackTimeout) return promise.reject(new Error("No ack for postMessage " + name + " in " + utils_getDomain() + " in " + totalAckTimeout + "ms"));
                                if (0 === resTimeout) return promise.reject(new Error("No response for postMessage " + name + " in " + utils_getDomain() + " in " + totalResTimeout + "ms"));
                            }
                            setTimeout(cycle, cycleTime);
                        }
                    }, cycleTime);
                    return promise;
                });
                reqPromises.push(requestPromise);
                return requestPromise;
            });
        }
        function setup_serializeMessage(destination, domain, obj) {
            return serializeMessage(destination, domain, obj, {
                on: on_on,
                send: send_send
            });
        }
        function setup_deserializeMessage(source, origin, message) {
            return deserializeMessage(source, origin, message, {
                on: on_on,
                send: send_send
            });
        }
        function setup_toProxyWindow(win) {
            return window_ProxyWindow.toProxyWindow(win, {
                send: send_send
            });
        }
        !function() {
            if (!global_getGlobal().initialized) {
                global_getGlobal().initialized = !0;
                !function(_ref5) {
                    var on = _ref5.on, send = _ref5.send;
                    globalStore().getOrSet("postMessageListeners", function() {
                        return addEventListener(window, "message", function(event) {
                            !function(event, _ref4) {
                                var on = _ref4.on, send = _ref4.send;
                                try {
                                    event.source;
                                } catch (err) {
                                    return;
                                }
                                var messageEvent = {
                                    source: event.source || event.sourceElement,
                                    origin: event.origin || event.originalEvent && event.originalEvent.origin,
                                    data: event.data
                                };
                                if (messageEvent.source) {
                                    if (!messageEvent.origin) throw new Error("Post message did not have origin domain");
                                    receive_receiveMessage(messageEvent, {
                                        on: on,
                                        send: send
                                    });
                                }
                            }(event, {
                                on: on,
                                send: send
                            });
                        });
                    });
                }({
                    on: on_on,
                    send: send_send
                });
                !function(_ref7) {
                    var on = _ref7.on, send = _ref7.send;
                    globalStore("builtinListeners").getOrSet("helloListener", function() {
                        var listener = on(MESSAGE_NAME.HELLO, {
                            domain: constants_WILDCARD
                        }, function(_ref2) {
                            var source = _ref2.source, origin = _ref2.origin;
                            getHelloPromise(source).resolve({
                                win: source,
                                domain: origin
                            });
                            return {
                                instanceID: hello_getInstanceID()
                            };
                        }), parent = getAncestor();
                        parent && sayHello(parent, {
                            send: send
                        }).catch(src_util_noop);
                        return listener;
                    });
                }({
                    on: on_on,
                    send: send_send
                });
                on = (_ref3 = {
                    on: on_on,
                    send: send_send
                }).on, send = _ref3.send, (global = global_getGlobal()).receiveMessage = global.receiveMessage || function(message) {
                    return receive_receiveMessage(message, {
                        on: on,
                        send: send
                    });
                };
            }
            var _ref3, on, send, global;
        }();
        function globalFor(win) {
            if (!isSameDomain(win)) throw new Error("Can not get global for window on different domain");
            win.__zoid_9_0_1__ || (win.__zoid_9_0_1__ = {});
            return win.__zoid_9_0_1__;
        }
        function getProxyElement(element) {
            return {
                resize: function(_ref) {
                    var width = _ref.width, height = _ref.height;
                    "number" == typeof width && (element.style.width = toCSS(width));
                    "number" == typeof height && (element.style.height = toCSS(height));
                },
                getElement: function() {
                    var _this = this;
                    return promise_ZalgoPromise.try(function() {
                        if (_this.source && _this.source !== window) throw new Error("Can not call getElement from a remote window");
                        return element;
                    });
                }
            };
        }
        var ZOID = "zoid", POST_MESSAGE_DELEGATE = ZOID + "_delegate", POST_MESSAGE_ALLOW_DELEGATE = ZOID + "_allow_delegate", PROP_TYPE = {
            STRING: "string",
            OBJECT: "object",
            FUNCTION: "function",
            BOOLEAN: "boolean",
            NUMBER: "number",
            ARRAY: "array"
        }, PROP_SERIALIZATION = {
            JSON: "json",
            DOTIFY: "dotify",
            BASE64: "base64"
        }, CONTEXT = WINDOW_TYPE, src_constants_WILDCARD = "*", DEFAULT_DIMENSIONS = {
            WIDTH: "300px",
            HEIGHT: "150px"
        }, EVENT = {
            RENDER: "zoid-render",
            RENDERED: "zoid-rendered",
            DISPLAY: "zoid-display",
            ERROR: "zoid-error",
            CLOSE: "zoid-close",
            PROPS: "zoid-props"
        };
        function normalizeChildProp(component, props, key, value, helpers) {
            var prop = component.getPropDefinition(key);
            return prop && "function" == typeof prop.childDecorate ? prop.childDecorate(_extends({
                value: value
            }, helpers)) : value;
        }
        function parseChildWindowName(windowName) {
            return inlineMemoize(parseChildWindowName, function() {
                if (!windowName) throw new Error("No window name");
                var _windowName$split = windowName.split("__"), zoidcomp = _windowName$split[1], name = _windowName$split[2], encodedPayload = _windowName$split[3];
                if (zoidcomp !== ZOID) throw new Error("Window not rendered by zoid - got " + zoidcomp);
                if (!name) throw new Error("Expected component name");
                if (!encodedPayload) throw new Error("Expected encoded payload");
                try {
                    return JSON.parse(function(str) {
                        if ("undefined" != typeof window && "function" == typeof window.atob) return window.atob(str);
                        if ("undefined" != typeof Buffer) return Buffer.from(str, "base64").toString("utf8");
                        throw new Error("Can not find window.atob or Buffer");
                    }(encodedPayload));
                } catch (err) {
                    throw new Error("Can not decode window name payload: " + encodedPayload + ": " + stringifyError(err));
                }
            }, [ windowName ]);
        }
        function getChildPayload() {
            try {
                return parseChildWindowName(window.name);
            } catch (err) {}
        }
        var child_ChildComponent = function() {
            function ChildComponent(component) {
                var _this = this;
                this.component = void 0;
                this.props = void 0;
                this.context = void 0;
                this.parent = void 0;
                this.parentComponentWindow = void 0;
                this.onPropHandlers = void 0;
                this.autoResize = void 0;
                promise_ZalgoPromise.try(function() {
                    _this.component = component;
                    _this.onPropHandlers = [];
                    var childPayload = getChildPayload();
                    if (!childPayload) throw new Error("No child payload found");
                    var parent = childPayload.parent, domain = childPayload.domain, exports = childPayload.exports, context = childPayload.context, props = childPayload.props;
                    _this.context = context;
                    _this.parentComponentWindow = _this.getParentComponentWindow(parent);
                    _this.parent = setup_deserializeMessage(_this.parentComponentWindow, domain, exports);
                    _this.checkParentDomain(domain);
                    var initialProps = _this.getPropsByRef(_this.parentComponentWindow, domain, props);
                    _this.setProps(initialProps, domain);
                    markWindowKnown(_this.parentComponentWindow);
                    _this.watchForClose();
                    return _this.parent.init(_this.buildExports());
                }).then(function() {
                    return _this.watchForResize();
                }).catch(function(err) {
                    _this.onError(err);
                });
            }
            var _proto = ChildComponent.prototype;
            _proto.getHelpers = function() {
                var _this2 = this;
                return {
                    focus: function() {
                        return _this2.focus();
                    },
                    close: function() {
                        return _this2.close();
                    },
                    resize: function(_ref) {
                        var width = _ref.width, height = _ref.height;
                        return _this2.resize({
                            width: width,
                            height: height
                        });
                    },
                    onError: function(err) {
                        return _this2.onError(err);
                    },
                    onProps: function(handler) {
                        return _this2.onProps(handler);
                    }
                };
            };
            _proto.checkParentDomain = function(domain) {
                if (!matchDomain(this.component.allowedParentDomains, domain)) throw new Error("Can not be rendered by domain: " + domain);
            };
            _proto.onProps = function(handler) {
                this.onPropHandlers.push(handler);
            };
            _proto.getPropsByRef = function(parentComponentWindow, domain, _ref2) {
                var props, type = _ref2.type, value = _ref2.value, uid = _ref2.uid;
                if ("raw" === type) props = value; else if ("uid" === type) {
                    if (!isSameDomain(parentComponentWindow)) throw new Error("Parent component window is on a different domain - expected " + utils_getDomain() + " - can not retrieve props");
                    var global = globalFor(parentComponentWindow);
                    props = assertExists("props", global && global.props[uid]);
                }
                if (!props) throw new Error("Could not find props");
                return setup_deserializeMessage(parentComponentWindow, domain, props);
            };
            _proto.getParentComponentWindow = function(ref) {
                var type = ref.type;
                if ("opener" === type) return assertExists("opener", getOpener(window));
                if ("parent" === type) {
                    var distance = ref.distance;
                    return assertExists("parent", function(win, n) {
                        void 0 === n && (n = 1);
                        return function(win, n) {
                            void 0 === n && (n = 1);
                            for (var parent = win, i = 0; i < n; i++) {
                                if (!parent) return;
                                parent = getParent(parent);
                            }
                            return parent;
                        }(win, getDistanceFromTop(win) - n);
                    }(window, distance));
                }
                if ("global" === type) {
                    var uid = ref.uid, ancestor = getAncestor(window);
                    if (!ancestor) throw new Error("Can not find ancestor window");
                    for (var _i2 = 0, _getAllFramesInWindow2 = getAllFramesInWindow(ancestor); _i2 < _getAllFramesInWindow2.length; _i2++) {
                        var frame = _getAllFramesInWindow2[_i2];
                        if (isSameDomain(frame)) {
                            var global = globalFor(frame);
                            if (global && global.windows && global.windows[uid]) return global.windows[uid];
                        }
                    }
                }
                throw new Error("Unable to find " + type + " parent component window");
            };
            _proto.getProps = function() {
                this.props = this.props || {};
                return this.props;
            };
            _proto.setProps = function(props, origin, isUpdate) {
                void 0 === isUpdate && (isUpdate = !1);
                var helpers = this.getHelpers(), existingProps = this.getProps();
                extend(existingProps, function(parentComponentWindow, component, props, origin, helpers, isUpdate) {
                    void 0 === isUpdate && (isUpdate = !1);
                    for (var result = {}, _i2 = 0, _Object$keys2 = Object.keys(props); _i2 < _Object$keys2.length; _i2++) {
                        var key = _Object$keys2[_i2], prop = component.getPropDefinition(key);
                        if (!prop || !prop.sameDomain || origin === utils_getDomain(window) && isSameDomain(parentComponentWindow)) {
                            var value = normalizeChildProp(component, 0, key, props[key], helpers);
                            result[key] = value;
                            prop && prop.alias && !result[prop.alias] && (result[prop.alias] = value);
                        }
                    }
                    if (!isUpdate) for (var _i4 = 0, _component$getPropNam2 = component.getPropNames(); _i4 < _component$getPropNam2.length; _i4++) {
                        var _key = _component$getPropNam2[_i4];
                        props.hasOwnProperty(_key) || (result[_key] = normalizeChildProp(component, 0, _key, props[_key], helpers));
                    }
                    return result;
                }(this.parentComponentWindow, this.component, props, origin, helpers, isUpdate));
                for (var _i4 = 0, _this$onPropHandlers2 = this.onPropHandlers; _i4 < _this$onPropHandlers2.length; _i4++) _this$onPropHandlers2[_i4].call(this, existingProps);
            };
            _proto.watchForClose = function() {
                var _this3 = this;
                window.addEventListener("beforeunload", function() {
                    _this3.parent.checkClose.fireAndForget();
                });
                window.addEventListener("unload", function() {
                    _this3.parent.checkClose.fireAndForget();
                });
                onCloseWindow(this.parentComponentWindow, function() {
                    _this3.destroy();
                });
            };
            _proto.getAutoResize = function() {
                var _ref3 = this.autoResize || this.component.autoResize || {}, _ref3$width = _ref3.width, width = void 0 !== _ref3$width && _ref3$width, _ref3$height = _ref3.height, height = void 0 !== _ref3$height && _ref3$height, _ref3$element = _ref3.element, element = void 0 === _ref3$element ? "body" : _ref3$element;
                return {
                    width: width,
                    height: height,
                    element: element = getElementSafe(element)
                };
            };
            _proto.watchForResize = function() {
                var _this4 = this;
                return waitForDocumentReady().then(function() {
                    if (document.body) return document.body;
                    throw new Error("Document ready but document.body not present");
                }).then(function() {
                    var _this4$getAutoResize = _this4.getAutoResize(), width = _this4$getAutoResize.width, height = _this4$getAutoResize.height, element = _this4$getAutoResize.element;
                    element && (width || height) && _this4.context !== CONTEXT.POPUP && onResize(element, function(_ref4) {
                        var newWidth = _ref4.width, newHeight = _ref4.height;
                        _this4.resize({
                            width: width ? newWidth : void 0,
                            height: height ? newHeight : void 0
                        });
                    }, {
                        width: width,
                        height: height
                    });
                });
            };
            _proto.buildExports = function() {
                var self = this;
                return {
                    updateProps: function(props) {
                        var _this5 = this;
                        return promise_ZalgoPromise.try(function() {
                            return self.setProps(props, _this5.__origin__, !0);
                        });
                    },
                    close: function() {
                        return promise_ZalgoPromise.try(function() {
                            return self.destroy();
                        });
                    }
                };
            };
            _proto.resize = function(_ref5) {
                var width = _ref5.width, height = _ref5.height;
                return this.parent.resize.fireAndForget({
                    width: width,
                    height: height
                });
            };
            _proto.close = function() {
                return this.parent.close();
            };
            _proto.destroy = function() {
                return promise_ZalgoPromise.try(function() {
                    window.close();
                });
            };
            _proto.focus = function() {
                return promise_ZalgoPromise.try(function() {
                    window.focus();
                });
            };
            _proto.onError = function(err) {
                var _this6 = this;
                return promise_ZalgoPromise.try(function() {
                    if (_this6.parent && _this6.parent.onError) return _this6.parent.onError(err);
                    throw err;
                });
            };
            return ChildComponent;
        }(), RENDER_DRIVERS = {};
        RENDER_DRIVERS[CONTEXT.IFRAME] = {
            openOnClick: !1,
            openFrame: function() {
                return getProxyElement(dom_iframe({
                    attributes: _extends({
                        title: this.component.name
                    }, this.component.attributes.iframe)
                }));
            },
            open: function(proxyFrame) {
                var _this = this;
                if (!proxyFrame) throw new Error("Expected proxy frame to be passed");
                return proxyFrame.getElement().then(function(frame) {
                    return awaitFrameWindow(frame).then(function(win) {
                        var frameWatcher = function(element, handler) {
                            handler = once(handler);
                            var interval;
                            isElementClosed(element) ? handler() : interval = function(method, time) {
                                var timeout;
                                !function loop() {
                                    timeout = setTimeout(function() {
                                        !function() {
                                            if (isElementClosed(element)) {
                                                interval.cancel();
                                                handler();
                                            }
                                        }();
                                        loop();
                                    }, 50);
                                }();
                                return {
                                    cancel: function() {
                                        clearTimeout(timeout);
                                    }
                                };
                            }();
                            return {
                                cancel: function() {
                                    interval && interval.cancel();
                                }
                            };
                        }(frame, function() {
                            return _this.close();
                        });
                        _this.clean.register(function() {
                            return frameWatcher.cancel();
                        });
                        _this.clean.register(function() {
                            return destroyElement(frame);
                        });
                        _this.clean.register(function() {
                            return function(win) {
                                for (var _i2 = 0, _requestPromises$get2 = windowStore("requestPromises").get(win, []); _i2 < _requestPromises$get2.length; _i2++) _requestPromises$get2[_i2].reject(new Error("Window cleaned up before response")).catch(src_util_noop);
                            }(win);
                        });
                        return setup_toProxyWindow(win);
                    });
                });
            },
            openPrerenderFrame: function() {
                return getProxyElement(dom_iframe({
                    attributes: _extends({
                        name: "__zoid_prerender_frame__" + this.component.name + "_" + uniqueID() + "__",
                        title: "prerender__" + this.component.name
                    }, this.component.attributes.iframe)
                }));
            },
            openPrerender: function(proxyWin, proxyPrerenderFrame) {
                var _this2 = this;
                if (!proxyPrerenderFrame) throw new Error("Expected proxy frame to be passed");
                return proxyPrerenderFrame.getElement().then(function(prerenderFrame) {
                    _this2.clean.register(function() {
                        return destroyElement(prerenderFrame);
                    });
                    return awaitFrameWindow(prerenderFrame).then(function(prerenderFrameWindow) {
                        return assertSameDomain(prerenderFrameWindow);
                    }).then(function(win) {
                        return setup_toProxyWindow(win);
                    });
                });
            },
            delegate: [ "getProxyContainer", "renderContainer", "openFrame", "openPrerenderFrame", "prerender", "open", "openPrerender" ],
            resize: function(_ref) {
                var width = _ref.width, height = _ref.height;
                this.proxyContainer && this.proxyContainer.resize({
                    width: width,
                    height: height
                });
            }
        };
        function props_getQueryParam(prop, key, value) {
            return promise_ZalgoPromise.try(function() {
                return "function" == typeof prop.queryParam ? prop.queryParam({
                    value: value
                }) : "string" == typeof prop.queryParam ? prop.queryParam : key;
            });
        }
        function getQueryValue(prop, key, value) {
            return promise_ZalgoPromise.try(function() {
                return "function" == typeof prop.queryValue && isDefined(value) ? prop.queryValue({
                    value: value
                }) : value;
            });
        }
        var parent_ParentComponent = function() {
            function ParentComponent(component, props) {
                var _this = this;
                this.component = void 0;
                this.driver = void 0;
                this.clean = void 0;
                this.event = void 0;
                this.initPromise = void 0;
                this.props = void 0;
                this.state = void 0;
                this.child = void 0;
                this.proxyWin = void 0;
                this.proxyContainer = void 0;
                try {
                    this.initPromise = new promise_ZalgoPromise();
                    this.clean = cleanup(this);
                    this.state = {};
                    this.component = component;
                    this.setupEvents(props.onError);
                    this.setProps(props);
                    this.component.registerActiveComponent(this);
                    this.clean.register(function() {
                        return _this.component.destroyActiveComponent(_this);
                    });
                    this.watchForUnload();
                } catch (err) {
                    this.onError(err).catch(src_util_noop);
                    throw err;
                }
            }
            var _proto = ParentComponent.prototype;
            _proto.setupEvents = function(onError) {
                var triggered, handlers, _this2 = this;
                this.event = (triggered = {}, handlers = {}, {
                    on: function(eventName, handler) {
                        var handlerList = handlers[eventName] = handlers[eventName] || [];
                        handlerList.push(handler);
                        var cancelled = !1;
                        return {
                            cancel: function() {
                                if (!cancelled) {
                                    cancelled = !0;
                                    handlerList.splice(handlerList.indexOf(handler), 1);
                                }
                            }
                        };
                    },
                    once: function(eventName, handler) {
                        var listener = this.on(eventName, function() {
                            listener.cancel();
                            handler();
                        });
                        return listener;
                    },
                    trigger: function(eventName) {
                        for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) args[_key3 - 1] = arguments[_key3];
                        var handlerList = handlers[eventName], promises = [];
                        if (handlerList) for (var _loop = function(_i2) {
                            var handler = handlerList[_i2];
                            promises.push(promise_ZalgoPromise.try(function() {
                                return handler.apply(void 0, args);
                            }));
                        }, _i2 = 0; _i2 < handlerList.length; _i2++) _loop(_i2);
                        return promise_ZalgoPromise.all(promises).then(src_util_noop);
                    },
                    triggerOnce: function(eventName) {
                        if (triggered[eventName]) return promise_ZalgoPromise.resolve();
                        triggered[eventName] = !0;
                        for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) args[_key4 - 1] = arguments[_key4];
                        return this.trigger.apply(this, [ eventName ].concat(args));
                    }
                });
                this.event.on(EVENT.RENDER, function() {
                    return _this2.props.onRender();
                });
                this.event.on(EVENT.DISPLAY, function() {
                    return _this2.props.onDisplay();
                });
                this.event.on(EVENT.RENDERED, function() {
                    return _this2.props.onRendered();
                });
                this.event.on(EVENT.CLOSE, function() {
                    return _this2.props.onClose();
                });
                this.event.on(EVENT.PROPS, function(props) {
                    return _this2.props.onProps(props);
                });
                this.event.on(EVENT.ERROR, function(err) {
                    if (_this2.props && _this2.props.onError) return _this2.props.onError(err);
                    if (onError) return onError(err);
                    throw err;
                });
            };
            _proto.render = function(target, container, context) {
                var _this3 = this;
                return promise_ZalgoPromise.try(function() {
                    _this3.component.log("render");
                    _this3.driver = RENDER_DRIVERS[context];
                    var uid = ZOID + "-" + _this3.component.tag + "-" + uniqueID(), domain = _this3.getDomain(), initialDomain = _this3.getInitialDomain();
                    _this3.component.checkAllowRender(target, domain, container);
                    target !== window && _this3.delegate(context, target);
                    var tasks = {};
                    tasks.init = _this3.initPromise;
                    tasks.buildUrl = _this3.buildUrl();
                    tasks.onRender = _this3.event.trigger(EVENT.RENDER);
                    tasks.getProxyContainer = _this3.getProxyContainer(container);
                    tasks.openFrame = _this3.openFrame();
                    tasks.openPrerenderFrame = _this3.openPrerenderFrame();
                    tasks.renderContainer = promise_ZalgoPromise.all([ tasks.getProxyContainer, tasks.openFrame, tasks.openPrerenderFrame ]).then(function(_ref) {
                        var proxyContainer = _ref[0], proxyFrame = _ref[1], proxyPrerenderFrame = _ref[2];
                        return _this3.renderContainer(proxyContainer, {
                            context: context,
                            uid: uid,
                            proxyFrame: proxyFrame,
                            proxyPrerenderFrame: proxyPrerenderFrame
                        });
                    });
                    tasks.open = _this3.driver.openOnClick ? _this3.open() : tasks.openFrame.then(function(proxyFrame) {
                        return _this3.open(proxyFrame);
                    });
                    tasks.openPrerender = promise_ZalgoPromise.all([ tasks.open, tasks.openPrerenderFrame ]).then(function(_ref2) {
                        var proxyWin = _ref2[0], proxyPrerenderFrame = _ref2[1];
                        return _this3.openPrerender(proxyWin, proxyPrerenderFrame);
                    });
                    tasks.setState = promise_ZalgoPromise.all([ tasks.open.then(function(proxyWin) {
                        _this3.proxyWin = proxyWin;
                        return _this3.setProxyWin(proxyWin);
                    }), tasks.renderContainer.then(function(proxyContainer) {
                        _this3.proxyContainer = proxyContainer;
                    }) ]);
                    tasks.prerender = promise_ZalgoPromise.all([ tasks.openPrerender, tasks.setState ]).then(function(_ref3) {
                        var proxyPrerenderWin = _ref3[0];
                        return _this3.prerender(proxyPrerenderWin, {
                            context: context,
                            uid: uid
                        });
                    });
                    tasks.loadUrl = promise_ZalgoPromise.all([ tasks.open, tasks.buildUrl, tasks.setWindowName, tasks.prerender ]).then(function(_ref4) {
                        var proxyWin = _ref4[0], url = _ref4[1];
                        return proxyWin.setLocation(url);
                    });
                    tasks.buildWindowName = tasks.open.then(function(proxyWin) {
                        return _this3.buildWindowName({
                            proxyWin: proxyWin,
                            initialDomain: initialDomain,
                            domain: domain,
                            target: target,
                            context: context,
                            uid: uid
                        });
                    });
                    tasks.setWindowName = promise_ZalgoPromise.all([ tasks.open, tasks.buildWindowName ]).then(function(_ref5) {
                        var proxyWin = _ref5[0], windowName = _ref5[1];
                        return proxyWin.setName(windowName);
                    });
                    tasks.watchForClose = tasks.open.then(function(proxyWin) {
                        return _this3.watchForClose(proxyWin);
                    });
                    tasks.onDisplay = tasks.prerender.then(function() {
                        return _this3.event.trigger(EVENT.DISPLAY);
                    });
                    tasks.openBridge = tasks.open.then(function(proxyWin) {
                        return _this3.openBridge(proxyWin, initialDomain, context);
                    });
                    tasks.runTimeout = tasks.loadUrl.then(function() {
                        return _this3.runTimeout();
                    });
                    tasks.onRender = tasks.init.then(function() {
                        return _this3.event.trigger(EVENT.RENDERED);
                    });
                    return promise_ZalgoPromise.hash(tasks);
                }).catch(function(err) {
                    return promise_ZalgoPromise.all([ _this3.onError(err), _this3.destroy(err) ]);
                }).then(src_util_noop);
            };
            _proto.getProxyContainer = function(container) {
                return promise_ZalgoPromise.try(function() {
                    return elementReady(container);
                }).then(function(containerElement) {
                    return getProxyElement(containerElement);
                });
            };
            _proto.buildWindowName = function(_ref6) {
                var proxyWin = _ref6.proxyWin, initialDomain = _ref6.initialDomain, domain = _ref6.domain, target = _ref6.target, uid = _ref6.uid, context = _ref6.context, childPayload = this.buildChildPayload({
                    proxyWin: proxyWin,
                    initialDomain: initialDomain,
                    domain: domain,
                    target: target,
                    context: context,
                    uid: uid
                });
                return "__" + ZOID + "__" + this.component.name + "__" + base64encode(JSON.stringify(childPayload)) + "__";
            };
            _proto.getPropsRef = function(proxyWin, target, domain, uid) {
                var value = setup_serializeMessage(proxyWin, domain, this.getPropsForChild(domain)), propRef = isSameDomain(target) ? {
                    type: "raw",
                    value: value
                } : {
                    type: "uid",
                    uid: uid
                };
                if ("uid" === propRef.type) {
                    var global = globalFor(window);
                    global.props = global.props || {};
                    global.props[uid] = value;
                    this.clean.register(function() {
                        delete global.props[uid];
                    });
                }
                return propRef;
            };
            _proto.buildChildPayload = function(_temp) {
                var _ref7 = void 0 === _temp ? {} : _temp, proxyWin = _ref7.proxyWin, initialDomain = _ref7.initialDomain, domain = _ref7.domain, _ref7$target = _ref7.target, target = void 0 === _ref7$target ? window : _ref7$target, context = _ref7.context, uid = _ref7.uid;
                return {
                    uid: uid,
                    context: context,
                    domain: utils_getDomain(window),
                    tag: this.component.tag,
                    parent: this.getWindowRef(target, initialDomain, uid, context),
                    props: this.getPropsRef(proxyWin, target, domain, uid),
                    exports: setup_serializeMessage(proxyWin, domain, this.buildParentExports(proxyWin))
                };
            };
            _proto.setProxyWin = function(proxyWin) {
                var _this4 = this;
                return promise_ZalgoPromise.try(function() {
                    _this4.proxyWin = proxyWin;
                });
            };
            _proto.getHelpers = function() {
                var _this5 = this;
                return {
                    state: this.state,
                    event: this.event,
                    close: function() {
                        return _this5.close();
                    },
                    focus: function() {
                        return _this5.focus();
                    },
                    resize: function(_ref8) {
                        var width = _ref8.width, height = _ref8.height;
                        return _this5.resize({
                            width: width,
                            height: height
                        });
                    },
                    onError: function(err) {
                        return _this5.onError(err);
                    },
                    updateProps: function(props) {
                        return _this5.updateProps(props);
                    }
                };
            };
            _proto.setProps = function(props, isUpdate) {
                void 0 === isUpdate && (isUpdate = !1);
                this.component.validate && this.component.validate({
                    props: props
                });
                var helpers = this.getHelpers();
                this.props = this.props || {};
                extend(this.props, function(component, instance, props, helpers, isUpdate) {
                    void 0 === isUpdate && (isUpdate = !1);
                    for (var result = _extends({}, props = props || {}), propNames = isUpdate ? [] : [].concat(component.getPropNames()), _i2 = 0, _Object$keys2 = Object.keys(props); _i2 < _Object$keys2.length; _i2++) {
                        var key = _Object$keys2[_i2];
                        -1 === propNames.indexOf(key) && propNames.push(key);
                    }
                    for (var aliases = [], state = helpers.state, close = helpers.close, focus = helpers.focus, onError = helpers.onError, _i4 = 0; _i4 < propNames.length; _i4++) {
                        var _key = propNames[_i4], propDef = component.getPropDefinition(_key), value = props[_key];
                        if (propDef) {
                            var alias = propDef.alias;
                            if (alias) {
                                !isDefined(value) && isDefined(props[alias]) && (value = props[alias]);
                                aliases.push(alias);
                            }
                            propDef.value && (value = propDef.value({
                                props: result,
                                state: state,
                                close: close,
                                focus: focus,
                                onError: onError
                            }));
                            !isDefined(value) && propDef.default && (value = propDef.default({
                                props: result,
                                state: state,
                                close: close,
                                focus: focus,
                                onError: onError
                            }));
                            if (isDefined(value) && ("array" === propDef.type ? !Array.isArray(value) : typeof value !== propDef.type)) throw new TypeError("Prop is not of type " + propDef.type + ": " + _key);
                            result[_key] = value;
                        }
                    }
                    for (var _i6 = 0; _i6 < aliases.length; _i6++) delete result[aliases[_i6]];
                    for (var _i8 = 0, _Object$keys4 = Object.keys(result); _i8 < _Object$keys4.length; _i8++) {
                        var _key2 = _Object$keys4[_i8], _propDef = component.getPropDefinition(_key2), _value = result[_key2];
                        if (_propDef) {
                            isDefined(_value) && _propDef.validate && _propDef.validate({
                                value: _value,
                                props: result
                            });
                            isDefined(_value) && _propDef.decorate && (result[_key2] = _propDef.decorate({
                                value: _value,
                                props: result,
                                state: state,
                                close: close,
                                focus: focus,
                                onError: onError
                            }));
                        }
                    }
                    return result;
                }(this.component, 0, props, helpers, isUpdate));
                for (var _i2 = 0, _this$component$getPr2 = this.component.getPropNames(); _i2 < _this$component$getPr2.length; _i2++) {
                    var key = _this$component$getPr2[_i2];
                    if (!1 !== this.component.getPropDefinition(key).required && !isDefined(this.props[key])) throw new Error('Expected prop "' + key + '" to be defined');
                }
            };
            _proto.buildUrl = function() {
                var propsDef, props, params, _this6 = this;
                return (propsDef = _extends({}, this.component.props, this.component.builtinProps), 
                props = this.props, params = {}, promise_ZalgoPromise.all(Object.keys(props).map(function(key) {
                    var prop = propsDef[key];
                    if (prop) return promise_ZalgoPromise.resolve().then(function() {
                        var value = props[key];
                        if (value && prop.queryParam) return value;
                    }).then(function(value) {
                        if (null != value) return promise_ZalgoPromise.all([ props_getQueryParam(prop, key, value), getQueryValue(prop, 0, value) ]).then(function(_ref) {
                            var result, queryParam = _ref[0], queryValue = _ref[1];
                            if ("boolean" == typeof queryValue) result = queryValue.toString(); else if ("string" == typeof queryValue) result = queryValue.toString(); else if ("object" == typeof queryValue && null !== queryValue) {
                                if (prop.serialization === PROP_SERIALIZATION.JSON) result = JSON.stringify(queryValue); else if (prop.serialization === PROP_SERIALIZATION.BASE64) result = btoa(JSON.stringify(queryValue)); else if (prop.serialization === PROP_SERIALIZATION.DOTIFY || !prop.serialization) {
                                    result = function dotify(obj, prefix, newobj) {
                                        void 0 === prefix && (prefix = "");
                                        void 0 === newobj && (newobj = {});
                                        prefix = prefix ? prefix + "." : prefix;
                                        for (var key in obj) obj.hasOwnProperty(key) && void 0 !== obj[key] && null !== obj[key] && "function" != typeof obj[key] && (obj[key] && Array.isArray(obj[key]) && obj[key].length && obj[key].every(function(val) {
                                            return "object" != typeof val;
                                        }) ? newobj["" + prefix + key + "[]"] = obj[key].join(",") : obj[key] && "object" == typeof obj[key] ? newobj = dotify(obj[key], "" + prefix + key, newobj) : newobj["" + prefix + key] = obj[key].toString());
                                        return newobj;
                                    }(queryValue, key);
                                    for (var _i10 = 0, _Object$keys6 = Object.keys(result); _i10 < _Object$keys6.length; _i10++) {
                                        var dotkey = _Object$keys6[_i10];
                                        params[dotkey] = result[dotkey];
                                    }
                                    return;
                                }
                            } else "number" == typeof queryValue && (result = queryValue.toString());
                            params[queryParam] = result;
                        });
                    });
                })).then(function() {
                    return params;
                })).then(function(query) {
                    return function(url, options) {
                        void 0 === options && (options = {});
                        var originalUrl, originalHash, query = options.query || {}, hash = options.hash || {}, _url$split = url.split("#");
                        originalUrl = _url$split[0];
                        originalHash = _url$split[1];
                        var _originalUrl$split = originalUrl.split("?");
                        originalUrl = _originalUrl$split[0];
                        var queryString = extendQuery(_originalUrl$split[1], query), hashString = extendQuery(originalHash, hash);
                        queryString && (originalUrl = originalUrl + "?" + queryString);
                        hashString && (originalUrl = originalUrl + "#" + hashString);
                        return originalUrl;
                    }(function(url) {
                        if (!(domain = getDomainFromUrl(url), 0 === domain.indexOf(PROTOCOL.MOCK))) return url;
                        var domain;
                        throw new Error("Mock urls not supported out of test mode");
                    }(_this6.component.getUrl(_this6.props)), {
                        query: query
                    });
                });
            };
            _proto.getDomain = function() {
                return this.component.getDomain(this.props);
            };
            _proto.getInitialDomain = function() {
                return this.component.getInitialDomain(this.props);
            };
            _proto.getPropsForChild = function(domain) {
                for (var result = {}, _i4 = 0, _Object$keys2 = Object.keys(this.props); _i4 < _Object$keys2.length; _i4++) {
                    var key = _Object$keys2[_i4], prop = this.component.getPropDefinition(key);
                    prop && !1 === prop.sendToChild || prop && prop.sameDomain && !matchDomain(domain, utils_getDomain(window)) || (result[key] = this.props[key]);
                }
                return result;
            };
            _proto.updateProps = function(props) {
                var _this7 = this;
                this.setProps(props, !0);
                return this.initPromise.then(function() {
                    if (_this7.child) return _this7.child.updateProps(_this7.getPropsForChild(_this7.getDomain()));
                });
            };
            _proto.openFrame = function() {
                var _this8 = this;
                return promise_ZalgoPromise.try(function() {
                    if (_this8.driver.openFrame) return _this8.driver.openFrame.call(_this8);
                });
            };
            _proto.openPrerenderFrame = function() {
                var _this9 = this;
                return promise_ZalgoPromise.try(function() {
                    if (_this9.driver.openPrerenderFrame) return _this9.driver.openPrerenderFrame.call(_this9);
                });
            };
            _proto.open = function(proxyFrame) {
                var _this10 = this;
                return promise_ZalgoPromise.try(function() {
                    _this10.component.log("open");
                    var windowProp = _this10.props.window;
                    if (windowProp) {
                        _this10.clean.register(function() {
                            return windowProp.close();
                        });
                        return setup_toProxyWindow(windowProp);
                    }
                    return _this10.driver.open.call(_this10, proxyFrame);
                }).then(function(proxyWin) {
                    _this10.proxyWin = proxyWin;
                    return proxyWin;
                });
            };
            _proto.openPrerender = function(proxyWin, proxyPrerenderFrame) {
                var _this11 = this;
                return promise_ZalgoPromise.try(function() {
                    return _this11.driver.openPrerender.call(_this11, proxyWin, proxyPrerenderFrame);
                });
            };
            _proto.focus = function() {
                var _this12 = this;
                return promise_ZalgoPromise.try(function() {
                    if (_this12.proxyWin) return _this12.proxyWin.focus().then(src_util_noop);
                });
            };
            _proto.delegate = function(context, target) {
                var _this13 = this;
                this.component.log("delegate");
                for (var props = {}, _i6 = 0, _this$component$getPr4 = this.component.getPropNames(); _i6 < _this$component$getPr4.length; _i6++) {
                    var propName = _this$component$getPr4[_i6];
                    this.component.getPropDefinition(propName).allowDelegate && (props[propName] = this.props[propName]);
                }
                for (var overridesPromise = send_send(target, POST_MESSAGE_DELEGATE + "_" + this.component.name, {
                    context: context,
                    props: props,
                    overrides: {
                        event: this.event,
                        close: function() {
                            return _this13.close();
                        },
                        onError: function(err) {
                            return _this13.onError(err);
                        }
                    }
                }).then(function(_ref9) {
                    var data = _ref9.data;
                    _this13.clean.register(data.destroy);
                    return data.overrides;
                }).catch(function(err) {
                    throw new Error("Unable to delegate rendering. Possibly the component is not loaded in the target window.\n\n" + stringifyError(err));
                }), _loop = function(_i8, _this$driver$delegate2) {
                    var key = _this$driver$delegate2[_i8];
                    _this13[key] = function() {
                        var _this14 = this, _arguments = arguments;
                        return overridesPromise.then(function(overrides) {
                            return overrides[key].apply(_this14, _arguments);
                        });
                    };
                }, _i8 = 0, _this$driver$delegate2 = this.driver.delegate; _i8 < _this$driver$delegate2.length; _i8++) _loop(_i8, _this$driver$delegate2);
            };
            _proto.getWindowRef = function(target, domain, uid, context) {
                if (domain === utils_getDomain(window)) {
                    var global = globalFor(window);
                    global.windows = global.windows || {};
                    global.windows[uid] = window;
                    this.clean.register(function() {
                        delete global.windows[uid];
                    });
                    return {
                        type: "global",
                        uid: uid
                    };
                }
                return context === CONTEXT.POPUP ? {
                    type: "opener"
                } : {
                    type: "parent",
                    distance: getDistanceFromTop(window)
                };
            };
            _proto.watchForClose = function(proxyWin) {
                var _this15 = this;
                return proxyWin.awaitWindow().then(function(win) {
                    var closeWindowListener = onCloseWindow(win, function() {
                        _this15.component.log("detect_close_child");
                        return _this15.close();
                    }, 2e3);
                    _this15.clean.register(closeWindowListener.cancel);
                });
            };
            _proto.watchForUnload = function() {
                var _this16 = this, unloadWindowListener = addEventListener(window, "unload", once(function() {
                    _this16.component.log("navigate_away");
                    _this16.destroy(new Error("Window navigated away"));
                }));
                this.clean.register(unloadWindowListener.cancel);
            };
            _proto.runTimeout = function() {
                var _this17 = this;
                return promise_ZalgoPromise.try(function() {
                    var timeout = _this17.props.timeout;
                    if (timeout) return _this17.initPromise.timeout(timeout, new Error("Loading component timed out after " + timeout + " milliseconds"));
                });
            };
            _proto.initChild = function(child) {
                var _this18 = this;
                return promise_ZalgoPromise.try(function() {
                    _this18.clean.set("child", child);
                    _this18.initPromise.resolve();
                });
            };
            _proto.buildParentExports = function(win) {
                var _this19 = this, onError = function(err) {
                    return _this19.onError(err);
                }, init = function(child) {
                    return _this19.initChild(child);
                };
                init.onError = onError;
                return {
                    init: init,
                    close: function() {
                        return _this19.close();
                    },
                    checkClose: function() {
                        return _this19.checkClose(win);
                    },
                    resize: function(_ref10) {
                        var width = _ref10.width, height = _ref10.height;
                        return _this19.resize({
                            width: width,
                            height: height
                        });
                    },
                    onError: onError
                };
            };
            _proto.resize = function(_ref11) {
                var _this20 = this, width = _ref11.width, height = _ref11.height;
                return promise_ZalgoPromise.try(function() {
                    if (_this20.driver.resize) return _this20.driver.resize.call(_this20, {
                        width: width,
                        height: height
                    });
                });
            };
            _proto.checkClose = function(win) {
                var _this21 = this;
                return win.isClosed().then(function(closed) {
                    return closed ? _this21.close() : promise_ZalgoPromise.delay(200).then(function() {
                        return win.isClosed();
                    }).then(function(secondClosed) {
                        if (secondClosed) return _this21.close();
                    });
                });
            };
            _proto.close = function() {
                var _this22 = this;
                return promise_ZalgoPromise.try(function() {
                    _this22.component.log("close");
                    return _this22.event.trigger(EVENT.CLOSE);
                }).then(function() {
                    _this22.child && _this22.child.close.fireAndForget().catch(src_util_noop);
                    return _this22.destroy(new Error("Window closed"));
                });
            };
            _proto.prerender = function(proxyPrerenderWin, _ref12) {
                var _this23 = this, context = _ref12.context, uid = _ref12.uid;
                return promise_ZalgoPromise.try(function() {
                    var prerenderTemplate = _this23.component.prerenderTemplate;
                    if (prerenderTemplate) {
                        var prerenderWindow = proxyPrerenderWin.getWindow();
                        if (prerenderWindow && isSameDomain(prerenderWindow) && function(win) {
                            try {
                                if (!win.location.href) return !0;
                                if ("about:blank" === win.location.href) return !0;
                            } catch (err) {}
                            return !1;
                        }(prerenderWindow)) {
                            var doc = (prerenderWindow = assertSameDomain(prerenderWindow)).document, el = _this23.renderTemplate(prerenderTemplate, {
                                context: context,
                                uid: uid,
                                doc: doc
                            });
                            if (el) {
                                if (el.ownerDocument !== doc) throw new Error("Expected prerender template to have been created with document from child window");
                                !function(win, el) {
                                    var tag = el.tagName.toLowerCase();
                                    if ("html" !== tag) throw new Error("Expected element to be html, got " + tag);
                                    for (var documentElement = win.document.documentElement; documentElement.children && documentElement.children.length; ) documentElement.removeChild(documentElement.children[0]);
                                    for (;el.children.length; ) documentElement.appendChild(el.children[0]);
                                }(prerenderWindow, el);
                                var _ref13 = _this23.component.autoResize || {}, _ref13$width = _ref13.width, width = void 0 !== _ref13$width && _ref13$width, _ref13$height = _ref13.height, height = void 0 !== _ref13$height && _ref13$height, _ref13$element = _ref13.element, element = void 0 === _ref13$element ? "body" : _ref13$element;
                                (element = getElementSafe(element, doc)) && (width || height) && onResize(element, function(_ref14) {
                                    var newWidth = _ref14.width, newHeight = _ref14.height;
                                    _this23.resize({
                                        width: width ? newWidth : void 0,
                                        height: height ? newHeight : void 0
                                    });
                                }, {
                                    width: width,
                                    height: height,
                                    win: prerenderWindow
                                });
                            }
                        }
                    }
                });
            };
            _proto.renderTemplate = function(renderer, _ref15) {
                var _this24 = this, context = _ref15.context, uid = _ref15.uid, container = _ref15.container, doc = _ref15.doc, frame = _ref15.frame, prerenderFrame = _ref15.prerenderFrame;
                return renderer.call(this, {
                    container: container,
                    context: context,
                    uid: uid,
                    doc: doc,
                    frame: frame,
                    prerenderFrame: prerenderFrame,
                    focus: function() {
                        return _this24.focus();
                    },
                    close: function() {
                        return _this24.close();
                    },
                    state: this.state,
                    props: this.props,
                    tag: this.component.tag,
                    dimensions: this.component.dimensions,
                    event: this.event
                });
            };
            _proto.renderContainer = function(proxyContainer, _ref16) {
                var _this25 = this, proxyFrame = _ref16.proxyFrame, proxyPrerenderFrame = _ref16.proxyPrerenderFrame, context = _ref16.context, uid = _ref16.uid;
                return promise_ZalgoPromise.all([ proxyContainer.getElement().then(elementReady), proxyFrame ? proxyFrame.getElement() : null, proxyPrerenderFrame ? proxyPrerenderFrame.getElement() : null ]).then(function(_ref17) {
                    var container = _ref17[0], frame = _ref17[1], prerenderFrame = _ref17[2], innerContainer = _this25.renderTemplate(_this25.component.containerTemplate, {
                        context: context,
                        uid: uid,
                        container: container,
                        frame: frame,
                        prerenderFrame: prerenderFrame,
                        doc: document
                    });
                    if (innerContainer) {
                        appendChild(container, innerContainer);
                        _this25.clean.register(function() {
                            return destroyElement(innerContainer);
                        });
                        _this25.proxyContainer = getProxyElement(innerContainer);
                        return _this25.proxyContainer;
                    }
                });
            };
            _proto.destroy = function(err) {
                var _this26 = this;
                void 0 === err && (err = new Error("Component destroyed before render complete"));
                return promise_ZalgoPromise.try(function() {
                    _this26.component.log("destroy");
                    _this26.initPromise.asyncReject(err);
                    return _this26.clean.all();
                });
            };
            _proto.onError = function(err) {
                var _this27 = this;
                return promise_ZalgoPromise.try(function() {
                    _this27.initPromise.asyncReject(err);
                    return _this27.event.trigger(EVENT.ERROR, err);
                }).then(function() {
                    return _this27.initPromise;
                }).then(function() {
                    throw err;
                });
            };
            _proto.openBridge = function(proxyWin, domain, context) {};
            return ParentComponent;
        }(), delegate_DelegateComponent = function() {
            function DelegateComponent(component, source, options) {
                var _this = this;
                this.component = void 0;
                this.source = void 0;
                this.context = void 0;
                this.driver = void 0;
                this.props = void 0;
                this.clean = void 0;
                this.focus = void 0;
                this.resize = void 0;
                this.renderTemplate = void 0;
                this.close = void 0;
                this.onError = void 0;
                this.event = void 0;
                this.component = component;
                this.context = options.context;
                this.driver = RENDER_DRIVERS[options.context];
                this.clean = cleanup(this);
                this.focus = parent_ParentComponent.prototype.focus;
                this.resize = parent_ParentComponent.prototype.resize;
                this.renderTemplate = parent_ParentComponent.prototype.renderTemplate;
                this.props = {};
                for (var _i2 = 0, _Object$keys2 = Object.keys(options.props); _i2 < _Object$keys2.length; _i2++) {
                    var propName = _Object$keys2[_i2], propDef = this.component.getPropDefinition(propName);
                    propDef && propDef.allowDelegate && options.props[propName] && (this.props[propName] = options.props[propName]);
                }
                this.close = options.overrides.close;
                this.onError = options.overrides.onError;
                this.event = options.overrides.event;
                this.component.registerActiveComponent(this);
                this.clean.register(function() {
                    return _this.component.destroyActiveComponent(_this);
                });
                this.watchForSourceClose(source);
            }
            var _proto = DelegateComponent.prototype;
            _proto.getDelegate = function() {
                var _this2 = this;
                return {
                    overrides: this.getOverrides(),
                    destroy: function() {
                        return _this2.destroy();
                    }
                };
            };
            _proto.watchForSourceClose = function(source) {
                var _this3 = this, closeSourceWindowListener = onCloseWindow(source, function() {
                    return _this3.destroy();
                }, 3e3);
                this.clean.register(closeSourceWindowListener.cancel);
            };
            _proto.getOverrides = function() {
                for (var overrides = {}, self = this, _loop = function(_i4, _this$driver$delegate2) {
                    var key = _this$driver$delegate2[_i4];
                    overrides[key] = function() {
                        return parent_ParentComponent.prototype[key].apply(self, arguments);
                    };
                    overrides[key].__name__ = key;
                }, _i4 = 0, _this$driver$delegate2 = this.driver.delegate; _i4 < _this$driver$delegate2.length; _i4++) _loop(_i4, _this$driver$delegate2);
                return overrides;
            };
            _proto.destroy = function() {
                return this.clean.all();
            };
            return DelegateComponent;
        }();
        function _inheritsLoose(subClass, superClass) {
            subClass.prototype = Object.create(superClass.prototype);
            subClass.prototype.constructor = subClass;
            subClass.__proto__ = superClass;
        }
        var react = {
            register: function(component, _ref) {
                var React = _ref.React, ReactDOM = _ref.ReactDOM;
                return function(_React$Component) {
                    _inheritsLoose(_class, _React$Component);
                    function _class() {
                        return _React$Component.apply(this, arguments) || this;
                    }
                    var _proto = _class.prototype;
                    _proto.render = function() {
                        return React.createElement("div", null);
                    };
                    _proto.componentDidMount = function() {
                        component.log("instantiate_react_component");
                        var el = ReactDOM.findDOMNode(this), parent = component.init(extend({}, this.props));
                        parent.render(el, CONTEXT.IFRAME);
                        this.setState({
                            parent: parent
                        });
                    };
                    _proto.componentDidUpdate = function() {
                        this.state && this.state.parent && this.state.parent.updateProps(extend({}, this.props)).catch(src_util_noop);
                    };
                    return _class;
                }(React.Component);
            }
        }, vue = {
            register: function(component, Vue) {
                return Vue.component(component.tag, {
                    render: function(createElement) {
                        return createElement("div");
                    },
                    inheritAttrs: !1,
                    mounted: function() {
                        var el = this.$el;
                        this.parent = component.init(extend({}, this.$attrs));
                        this.parent.render(el, CONTEXT.IFRAME);
                    },
                    watch: {
                        $attrs: {
                            handler: function() {
                                this.parent && this.$attrs && this.parent.updateProps(extend({}, this.$attrs)).catch(src_util_noop);
                            },
                            deep: !0
                        }
                    }
                });
            }
        }, angular = {
            register: function(component, ng) {
                return ng.module(component.tag, []).directive(component.tag.replace(/-([a-z])/g, function(g) {
                    return g[1].toUpperCase();
                }), function() {
                    for (var scope = {}, _i2 = 0, _component$getPropNam2 = component.getPropNames(); _i2 < _component$getPropNam2.length; _i2++) scope[_component$getPropNam2[_i2]] = "=";
                    scope.props = "=";
                    return {
                        scope: scope,
                        restrict: "E",
                        controller: [ "$scope", "$element", function($scope, $element) {
                            component.log("instantiate_angular_component");
                            var getProps = function() {
                                return replaceObject($scope.props, function(item) {
                                    return "function" == typeof item ? function() {
                                        var result = item.apply(this, arguments);
                                        !function() {
                                            if ("$apply" !== $scope.$root.$$phase && "$digest" !== $scope.$root.$$phase) try {
                                                $scope.$apply();
                                            } catch (err) {}
                                        }();
                                        return result;
                                    } : item;
                                });
                            }, instance = component.init(getProps());
                            instance.render($element[0], CONTEXT.IFRAME);
                            $scope.$watch(function() {
                                instance.updateProps(getProps()).catch(src_util_noop);
                            });
                        } ]
                    };
                });
            }
        }, angular2 = {
            register: function(zoid, _ref) {
                var AngularComponent = _ref.Component, NgModule = _ref.NgModule, ElementRef = _ref.ElementRef, NgZone = _ref.NgZone;
                zoid.log("initializing angular2 component");
                var getProps = function(component) {
                    return replaceObject(_extends({}, component.internalProps, component.props), function(item) {
                        return "function" == typeof item ? function() {
                            var _this = this, _arguments = arguments;
                            return component.zone.run(function() {
                                return item.apply(_this, _arguments);
                            });
                        } : item;
                    });
                }, ComponentInstance = AngularComponent({
                    selector: zoid.tag,
                    template: "<div></div>",
                    inputs: [ "props" ]
                }).Class({
                    constructor: [ ElementRef, NgZone, function(elementRef, zone) {
                        this._props = {};
                        this.elementRef = elementRef;
                        this.zone = zone;
                    } ],
                    ngOnInit: function() {
                        var targetElement = this.elementRef.nativeElement;
                        this.parent = zoid.init(getProps(this));
                        this.parent.render(targetElement, CONTEXT.IFRAME);
                    },
                    ngDoCheck: function() {
                        if (this.parent && !function(obj1, obj2) {
                            var checked = {};
                            for (var key in obj1) if (obj1.hasOwnProperty(key)) {
                                checked[key] = !0;
                                if (obj1[key] !== obj2[key]) return !1;
                            }
                            for (var _key in obj2) if (!checked[_key]) return !1;
                            return !0;
                        }(this._props, this.props)) {
                            this._props = _extends({}, this.props);
                            this.parent.updateProps(getProps(this));
                        }
                    }
                });
                return NgModule({
                    declarations: [ ComponentInstance ],
                    exports: [ ComponentInstance ]
                }).Class({
                    constructor: function() {}
                });
            }
        }, Node = function() {
            function Node() {}
            var _proto = Node.prototype;
            _proto.isElementNode = function() {
                return !1;
            };
            _proto.isTextNode = function() {
                return !1;
            };
            _proto.isFragmentNode = function() {
                return !1;
            };
            return Node;
        }(), node_ElementNode = function(_Node) {
            _inheritsLoose(ElementNode, _Node);
            function ElementNode(name, props, children) {
                var _this;
                (_this = _Node.call(this) || this).name = void 0;
                _this.props = void 0;
                _this.children = void 0;
                _this.onRender = void 0;
                _this.name = name;
                _this.props = props;
                _this.children = children;
                if ("function" == typeof props.onRender) {
                    _this.onRender = props.onRender;
                    delete props.onRender;
                }
                return _this;
            }
            var _proto2 = ElementNode.prototype;
            _proto2.getTag = function() {
                return this.name;
            };
            _proto2.isTag = function(name) {
                return name === this.name;
            };
            _proto2.isElementNode = function() {
                return !0;
            };
            _proto2.render = function(renderer) {
                var element = renderer(this.name, this.props, this.children);
                this.onRender && this.onRender(element);
                return element;
            };
            _proto2.getText = function() {
                throw new Error("Can not get text of an element node");
            };
            return ElementNode;
        }(Node), node_TextNode = function(_Node2) {
            _inheritsLoose(TextNode, _Node2);
            function TextNode(text) {
                var _this2;
                (_this2 = _Node2.call(this) || this).text = void 0;
                _this2.text = text;
                return _this2;
            }
            var _proto3 = TextNode.prototype;
            _proto3.getTag = function() {
                throw new Error("Can not get tag of text node");
            };
            _proto3.isTag = function(name) {
                throw new Error("Can not check tag of text node");
            };
            _proto3.isTextNode = function() {
                return !0;
            };
            _proto3.render = function(renderer) {
                throw new Error("Can not render a text node");
            };
            _proto3.getText = function() {
                return this.text;
            };
            return TextNode;
        }(Node), node_FragmentNode = function(_Node3) {
            _inheritsLoose(FragmentNode, _Node3);
            function FragmentNode(children) {
                var _this3;
                (_this3 = _Node3.call(this) || this).children = void 0;
                _this3.children = children;
                return _this3;
            }
            var _proto4 = FragmentNode.prototype;
            _proto4.getTag = function() {
                throw new Error("Can not get tag of fragment node");
            };
            _proto4.isTag = function(name) {
                throw new Error("Can not check tag of fragment node");
            };
            _proto4.isFragmentNode = function() {
                return !0;
            };
            _proto4.render = function(renderer) {
                throw new Error("Can not render a fragment node");
            };
            _proto4.getText = function() {
                throw new Error("Can not get text of a fragment node");
            };
            return FragmentNode;
        }(Node);
        function normalizeChild(child) {
            if ("string" == typeof child) return new node_TextNode(child);
            if (child instanceof node_ElementNode || child instanceof node_TextNode || child instanceof node_FragmentNode) return child;
            if (Array.isArray(child)) return new node_FragmentNode(normalizeChildren(child));
            if (null != child) throw new Error("Child node must be string or instance of jsx-pragmatic node; got " + typeof child);
        }
        function normalizeChildren(children) {
            for (var result = [], _i2 = 0; _i2 < children.length; _i2++) {
                var normalizedChild = normalizeChild(children[_i2]);
                if (normalizedChild) if (normalizedChild instanceof node_FragmentNode) for (var _i4 = 0, _normalizedChild$chil2 = normalizedChild.children; _i4 < _normalizedChild$chil2.length; _i4++) {
                    var subchild = _normalizedChild$chil2[_i4];
                    result.push(subchild);
                } else result.push(normalizedChild);
            }
            return result;
        }
        var _CREATE_ELEMENT, _ADD_CHILDREN, node = function(element, props) {
            for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) children[_key - 2] = arguments[_key];
            if ("string" == typeof element) return new node_ElementNode(element, props || {}, normalizeChildren(children));
            if ("function" == typeof element) return normalizeChild(element(props || {}, normalizeChildren(children)));
            throw new TypeError("Expected jsx Element to be a string or a function");
        }, ELEMENT_TAG_HTML = "html", ELEMENT_TAG_IFRAME = "iframe", ELEMENT_TAG_SCRIPT = "script", ELEMENT_TAG_NODE = "node", ELEMENT_TAG_DEFAULT = "default", ELEMENT_PROP_INNER_HTML = "innerHTML", ELEMENT_PROP_EL = "el", CREATE_ELEMENT = ((_CREATE_ELEMENT = {})[ELEMENT_TAG_NODE] = function(_ref) {
            var props = _ref.props;
            if (!props[ELEMENT_PROP_EL]) throw new Error("Must pass " + ELEMENT_PROP_EL + " prop to " + ELEMENT_TAG_NODE + " element");
            if (Object.keys(props).length > 1) throw new Error("Must not pass any prop other than " + ELEMENT_PROP_EL + " to " + ELEMENT_TAG_NODE + " element");
            return props[ELEMENT_PROP_EL];
        }, _CREATE_ELEMENT[ELEMENT_TAG_DEFAULT] = function(_ref2) {
            var name = _ref2.name;
            return _ref2.doc.createElement(name);
        }, _CREATE_ELEMENT), ADD_CHILDREN = ((_ADD_CHILDREN = {})[ELEMENT_TAG_IFRAME] = function(_ref5) {
            var el = _ref5.el, children = _ref5.children, firstChild = children[0];
            if (children.length > 1 || !firstChild.isElementNode()) throw new Error("Expected only single element node as child of " + ELEMENT_TAG_IFRAME + " element");
            if (!firstChild.isTag(ELEMENT_TAG_HTML)) throw new Error("Expected element to be inserted into frame to be html, got " + firstChild.getTag());
            el.addEventListener("load", function() {
                var win = el.contentWindow;
                if (!win) throw new Error("Expected frame to have contentWindow");
                for (var doc = win.document, docElement = doc.documentElement; docElement.children && docElement.children.length; ) docElement.removeChild(docElement.children[0]);
                for (var child = firstChild.render(dom_dom({
                    doc: doc
                })); child.children.length; ) docElement.appendChild(child.children[0]);
            });
        }, _ADD_CHILDREN[ELEMENT_TAG_SCRIPT] = function(_ref6) {
            var el = _ref6.el, children = _ref6.children, firstChild = children[0];
            if (1 !== children.length || !firstChild.isTextNode()) throw new Error("Expected only single text node as child of " + ELEMENT_TAG_SCRIPT + " element");
            el.text = firstChild.getText();
        }, _ADD_CHILDREN[ELEMENT_TAG_DEFAULT] = function(_ref7) {
            for (var el = _ref7.el, children = _ref7.children, doc = _ref7.doc, domRenderer = _ref7.domRenderer, _i6 = 0; _i6 < children.length; _i6++) {
                var child = children[_i6];
                child.isTextNode() ? el.appendChild(doc.createTextNode(child.getText())) : el.appendChild(child.render(domRenderer));
            }
        }, _ADD_CHILDREN), dom_dom = function(_temp) {
            var _ref9$doc = (void 0 === _temp ? {} : _temp).doc, doc = void 0 === _ref9$doc ? document : _ref9$doc;
            return function domRenderer(name, props, children) {
                var el = function(_ref3) {
                    var doc = _ref3.doc, name = _ref3.name, props = _ref3.props;
                    return (CREATE_ELEMENT[name] || CREATE_ELEMENT[ELEMENT_TAG_DEFAULT])({
                        name: name,
                        props: props,
                        doc: doc
                    });
                }({
                    name: name,
                    props: props,
                    doc: doc
                });
                !function(_ref4) {
                    for (var el = _ref4.el, props = _ref4.props, _i4 = 0, _Object$keys2 = Object.keys(props); _i4 < _Object$keys2.length; _i4++) {
                        var prop = _Object$keys2[_i4], val = props[prop];
                        if (null != val && prop !== ELEMENT_PROP_EL && prop !== ELEMENT_PROP_INNER_HTML) if (prop.match(/^on[A-Z][a-z]/) && "function" == typeof val) el.addEventListener(prop.slice(2).toLowerCase(), val); else if ("string" == typeof val || "number" == typeof val) el.setAttribute(prop, val.toString()); else {
                            if ("boolean" != typeof val) throw new TypeError("Can not render prop " + prop + " of type " + typeof val);
                            !0 === val && el.setAttribute(prop, "");
                        }
                    }
                }({
                    el: el,
                    props: props
                });
                !function(_ref8) {
                    var el = _ref8.el, name = _ref8.name, props = _ref8.props, children = _ref8.children, doc = _ref8.doc, domRenderer = _ref8.domRenderer;
                    if (props.hasOwnProperty(ELEMENT_PROP_INNER_HTML)) {
                        if (children.length >= 1) throw new Error("Expected no children to be passed when " + ELEMENT_PROP_INNER_HTML + " prop is set");
                        var html = props[ELEMENT_PROP_INNER_HTML];
                        if ("string" != typeof html) throw new TypeError(ELEMENT_PROP_INNER_HTML + " prop must be string");
                        if (name === ELEMENT_TAG_SCRIPT) el.text = html; else {
                            el.innerHTML = html;
                            !function(el, doc) {
                                void 0 === doc && (doc = window.document);
                                for (var _i2 = 0, _el$querySelectorAll2 = el.querySelectorAll("script"); _i2 < _el$querySelectorAll2.length; _i2++) {
                                    var script = _el$querySelectorAll2[_i2], parentNode = script.parentNode;
                                    if (parentNode) {
                                        var newScript = doc.createElement("script");
                                        newScript.text = script.textContent;
                                        parentNode.replaceChild(newScript, script);
                                    }
                                }
                            }(el, doc);
                        }
                    } else (ADD_CHILDREN[name] || ADD_CHILDREN[ELEMENT_TAG_DEFAULT])({
                        el: el,
                        name: name,
                        props: props,
                        children: children,
                        doc: doc,
                        domRenderer: domRenderer
                    });
                }({
                    el: el,
                    name: name,
                    props: props,
                    children: children,
                    doc: doc,
                    domRenderer: domRenderer
                });
                return el;
            };
        }, CLASS = {
            VISIBLE: "visible",
            INVISIBLE: "invisible"
        };
        function defaultContainerTemplate(_ref) {
            var uid = _ref.uid, frame = _ref.frame, prerenderFrame = _ref.prerenderFrame, doc = _ref.doc, event = _ref.event, _ref$dimensions = _ref.dimensions, width = _ref$dimensions.width, height = _ref$dimensions.height;
            if (frame && prerenderFrame) {
                prerenderFrame.classList.add(CLASS.VISIBLE);
                frame.classList.add(CLASS.INVISIBLE);
                event.on(EVENT.RENDERED, function() {
                    prerenderFrame.classList.remove(CLASS.VISIBLE);
                    prerenderFrame.classList.add(CLASS.INVISIBLE);
                    frame.classList.remove(CLASS.INVISIBLE);
                    frame.classList.add(CLASS.VISIBLE);
                    setTimeout(function() {
                        destroyElement(prerenderFrame);
                    }, 1);
                });
                return node("div", {
                    id: uid
                }, node("style", null, "\n                    #" + uid + " {\n                        display: inline-block;\n                        position: relative;\n                        width: " + width + ";\n                        height: " + height + ";\n                    }\n\n                    #" + uid + " > iframe {\n                        display: inline-block;\n                        position: absolute;\n                        width: 100%;\n                        height: 100%;\n                        top: 0;\n                        left: 0;\n                        transition: opacity .2s ease-in-out;\n                    }\n\n                    #" + uid + " > iframe." + CLASS.INVISIBLE + " {\n                        opacity: 0;\n                    }\n\n                    #" + uid + " > iframe." + CLASS.VISIBLE + " {\n                        opacity: 1;\n                    }\n                "), node("node", {
                    el: frame
                }), node("node", {
                    el: prerenderFrame
                })).render(dom_dom({
                    doc: doc
                }));
            }
        }
        function defaultPrerenderTemplate(_ref) {
            var doc = _ref.doc;
            return node("html", null, node("body", null, node("style", null, "\n                        .spinner {\n                            position: fixed;\n                            max-height: 60vmin;\n                            max-width: 60vmin;\n                            height: 40px;\n                            width: 40px;\n                            top: 50%;\n                            left: 50%;\n                            box-sizing: border-box;\n                            border: 3px solid rgba(0, 0, 0, .2);\n                            border-top-color: rgba(33, 128, 192, 0.8);\n                            border-radius: 100%;\n                            animation: rotation .7s infinite linear;\n                        }\n\n                        @keyframes rotation {\n                            from {\n                                transform: translateX(-50%) translateY(-50%) rotate(0deg);\n                            }\n                            to {\n                                transform: translateX(-50%) translateY(-50%) rotate(359deg);\n                            }\n                        }\n                    "), node("div", {
                class: "spinner"
            }))).render(dom_dom({
                doc: doc
            }));
        }
        var props_defaultNoop = function() {
            return src_util_noop;
        }, props_decorateOnce = function(_ref) {
            return once(_ref.value);
        }, component_Component = function() {
            function Component(options) {
                this.tag = void 0;
                this.name = void 0;
                this.url = void 0;
                this.domain = void 0;
                this.bridgeUrl = void 0;
                this.props = void 0;
                this.builtinProps = void 0;
                this.dimensions = void 0;
                this.autoResize = void 0;
                this.allowedParentDomains = void 0;
                this.defaultContext = void 0;
                this.attributes = void 0;
                this.containerTemplate = void 0;
                this.prerenderTemplate = void 0;
                this.validate = void 0;
                this.driverCache = void 0;
                this.xprops = void 0;
                this.logger = void 0;
                this.propNames = void 0;
                !function(options) {
                    if (!options) throw new Error("Expected options to be passed");
                    if (!options.tag || !options.tag.match(/^([a-z0-9]+-)+[a-z0-9]+$/)) throw new Error("Invalid options.tag: " + options.tag);
                    !function(options) {
                        if (options.props && "object" != typeof options.props) throw new Error("Expected options.props to be an object");
                        var PROP_TYPE_LIST = function(obj) {
                            var result = [];
                            for (var key in obj) obj.hasOwnProperty(key) && result.push(obj[key]);
                            return result;
                        }(PROP_TYPE);
                        if (options.props) for (var _i2 = 0, _Object$keys2 = Object.keys(options.props); _i2 < _Object$keys2.length; _i2++) {
                            var key = _Object$keys2[_i2], prop = options.props[key];
                            if (!prop || "object" != typeof prop) throw new Error("Expected options.props." + key + " to be an object");
                            if (!prop.type) throw new Error("Expected prop.type");
                            if (-1 === PROP_TYPE_LIST.indexOf(prop.type)) throw new Error("Expected prop.type to be one of " + PROP_TYPE_LIST.join(", "));
                            if (prop.required && prop.default) throw new Error("Required prop can not have a default value");
                            if (prop.type === PROP_TYPE.FUNCTION && prop.queryParam && !prop.queryValue) throw new Error("Do not pass queryParam for function prop");
                        }
                    }(options);
                    if (options.dimensions) {
                        if (options.dimensions && !isPx(options.dimensions.width) && !isPerc(options.dimensions.width)) throw new Error("Expected options.dimensions.width to be a px or % string value");
                        if (options.dimensions && !isPx(options.dimensions.height) && !isPerc(options.dimensions.height)) throw new Error("Expected options.dimensions.height to be a px or % string value");
                    }
                    if (options.defaultContext && options.defaultContext !== CONTEXT.IFRAME && options.defaultContext !== CONTEXT.POPUP) throw new Error("Unsupported context type: " + (options.defaultContext || "unknown"));
                    if (!options.url) throw new Error("Must pass url");
                    if ("string" != typeof options.url && "function" != typeof options.url) throw new TypeError("Expected url to be string or function");
                    if (options.prerenderTemplate && "function" != typeof options.prerenderTemplate) throw new Error("Expected options.prerenderTemplate to be a function");
                    if (options.containerTemplate && "function" != typeof options.containerTemplate) throw new Error("Expected options.containerTemplate to be a function");
                }(options);
                this.tag = options.tag;
                this.name = this.tag.replace(/-/g, "_");
                this.allowedParentDomains = options.allowedParentDomains || src_constants_WILDCARD;
                if (Component.components[this.tag]) throw new Error("Can not register multiple components with the same tag: " + this.tag);
                this.builtinProps = {
                    window: {
                        type: "object",
                        sendToChild: !1,
                        required: !1,
                        allowDelegate: !0,
                        validate: function(_ref2) {
                            var value = _ref2.value;
                            if (!isWindow(value) && !window_ProxyWindow.isProxyWindow(value)) throw new Error("Expected Window or ProxyWindow");
                        },
                        decorate: function(_ref3) {
                            return setup_toProxyWindow(_ref3.value);
                        }
                    },
                    timeout: {
                        type: "number",
                        required: !1,
                        sendToChild: !1
                    },
                    close: {
                        type: "function",
                        required: !1,
                        sendToChild: !1,
                        childDecorate: function(_ref4) {
                            return _ref4.close;
                        }
                    },
                    focus: {
                        type: "function",
                        required: !1,
                        sendToChild: !1,
                        childDecorate: function(_ref5) {
                            return _ref5.focus;
                        }
                    },
                    resize: {
                        type: "function",
                        required: !1,
                        sendToChild: !1,
                        childDecorate: function(_ref6) {
                            return _ref6.resize;
                        }
                    },
                    onDisplay: {
                        type: "function",
                        required: !1,
                        sendToChild: !1,
                        allowDelegate: !0,
                        default: props_defaultNoop,
                        decorate: props_decorateOnce
                    },
                    onRendered: {
                        type: "function",
                        required: !1,
                        sendToChild: !1,
                        default: props_defaultNoop,
                        decorate: props_decorateOnce
                    },
                    onRender: {
                        type: "function",
                        required: !1,
                        sendToChild: !1,
                        default: props_defaultNoop,
                        decorate: props_decorateOnce
                    },
                    onClose: {
                        type: "function",
                        required: !1,
                        sendToChild: !1,
                        allowDelegate: !0,
                        default: props_defaultNoop,
                        decorate: props_decorateOnce
                    },
                    onError: {
                        type: "function",
                        required: !1,
                        sendToChild: !1,
                        childDecorate: function(_ref7) {
                            return _ref7.onError;
                        }
                    },
                    onProps: {
                        type: "function",
                        required: !1,
                        sendToChild: !1,
                        default: props_defaultNoop,
                        childDecorate: function(_ref8) {
                            return _ref8.onProps;
                        }
                    }
                };
                this.props = options.props || {};
                var _ref = options.dimensions || {}, _ref$width = _ref.width, width = void 0 === _ref$width ? DEFAULT_DIMENSIONS.WIDTH : _ref$width, _ref$height = _ref.height, height = void 0 === _ref$height ? DEFAULT_DIMENSIONS.HEIGHT : _ref$height;
                this.dimensions = {
                    width: width,
                    height: height
                };
                this.url = options.url;
                this.domain = options.domain;
                this.bridgeUrl = options.bridgeUrl;
                this.attributes = options.attributes || {};
                this.attributes.iframe = this.attributes.iframe || {};
                this.attributes.popup = this.attributes.popup || {};
                this.defaultContext = options.defaultContext || CONTEXT.IFRAME;
                this.autoResize = options.autoResize;
                this.containerTemplate = options.containerTemplate || defaultContainerTemplate;
                this.prerenderTemplate = options.prerenderTemplate || defaultPrerenderTemplate;
                this.validate = options.validate;
                this.logger = options.logger || {
                    debug: src_util_noop,
                    info: src_util_noop,
                    warn: src_util_noop,
                    error: src_util_noop
                };
                this.registerChild();
                this.listenDelegate();
                Component.components[this.tag] = this;
            }
            var _proto = Component.prototype;
            _proto.getPropNames = function() {
                if (this.propNames) return this.propNames;
                for (var propNames = Object.keys(this.props), _i2 = 0, _Object$keys2 = Object.keys(this.builtinProps); _i2 < _Object$keys2.length; _i2++) {
                    var key = _Object$keys2[_i2];
                    -1 === propNames.indexOf(key) && propNames.push(key);
                }
                this.propNames = propNames;
                return propNames;
            };
            _proto.getPropDefinition = function(name) {
                return this.props[name] || this.builtinProps[name];
            };
            _proto.driver = function(name, dep) {
                var drivers = {
                    react: react,
                    angular: angular,
                    vue: vue,
                    angular2: angular2
                };
                if (!drivers[name]) throw new Error("Could not find driver for framework: " + name);
                this.driverCache = this.driverCache || {};
                this.driverCache[name] || (this.driverCache[name] = drivers[name].register(this, dep));
                return this.driverCache[name];
            };
            _proto.registerChild = function() {
                if (this.isChild()) {
                    if (window.xprops) throw new Error("Can not register " + this.name + " as child - can not attach multiple components to the same window");
                    var child = new child_ChildComponent(this);
                    window.xprops = this.xprops = child.getProps();
                }
            };
            _proto.listenDelegate = function() {
                var _this = this;
                on_on(POST_MESSAGE_ALLOW_DELEGATE + "_" + this.name, function() {
                    return !0;
                });
                on_on(POST_MESSAGE_DELEGATE + "_" + this.name, function(_ref2) {
                    var source = _ref2.source, _ref2$data = _ref2.data, context = _ref2$data.context, props = _ref2$data.props, overrides = _ref2$data.overrides;
                    return new delegate_DelegateComponent(_this, source, {
                        context: context,
                        props: props,
                        overrides: overrides
                    }).getDelegate();
                });
            };
            _proto.canRenderTo = function(win) {
                return send_send(win, POST_MESSAGE_ALLOW_DELEGATE + "_" + this.name).then(function(_ref3) {
                    return _ref3.data;
                }).catch(function() {
                    return !1;
                });
            };
            _proto.getUrl = function(props) {
                return "function" == typeof this.url ? this.url({
                    props: props
                }) : this.url;
            };
            _proto.getInitialDomain = function(props) {
                return this.domain && "string" == typeof this.domain ? this.domain : getDomainFromUrl(this.getUrl(props));
            };
            _proto.getDomain = function(props) {
                return util_isRegex(this.domain) ? this.domain : this.getInitialDomain(props);
            };
            _proto.getBridgeUrl = function() {
                if (this.bridgeUrl) return this.bridgeUrl;
            };
            _proto.isChild = function() {
                var payload = getChildPayload();
                return Boolean(payload && payload.tag === this.tag);
            };
            _proto.getDefaultContainer = function(context, container) {
                if (container) {
                    if ("string" != typeof container && !isElement(container)) throw new TypeError("Expected string or element selector to be passed");
                    return container;
                }
                if (context === CONTEXT.POPUP) return "body";
                throw new Error("Expected element to be passed to render iframe");
            };
            _proto.getDefaultContext = function(context, props) {
                if (props.window) return setup_toProxyWindow(props.window).getType();
                if (context) {
                    if (context !== CONTEXT.IFRAME && context !== CONTEXT.POPUP) throw new Error("Unrecognized context: " + context);
                    return context;
                }
                return this.defaultContext;
            };
            _proto.init = function(props) {
                var _this2 = this, parent = new parent_ParentComponent(this, props = props || {}), _render = function(target, container, context) {
                    return promise_ZalgoPromise.try(function() {
                        if (!isWindow(target)) throw new Error("Must pass window to renderTo");
                        context = _this2.getDefaultContext(context, props);
                        container = _this2.getDefaultContainer(context, container);
                        return parent.render(target, container, context);
                    });
                };
                return _extends({}, parent.getHelpers(), {
                    render: function(container, context) {
                        return _render(window, container, context);
                    },
                    renderTo: function(target, container, context) {
                        return _render(target, container, context);
                    }
                });
            };
            _proto.checkAllowRender = function(target, domain, container) {
                if (target !== window) {
                    if (!isSameTopWindow(window, target)) throw new Error("Can only renderTo an adjacent frame");
                    var origin = utils_getDomain();
                    if (!matchDomain(domain, origin) && !isSameDomain(target)) throw new Error("Can not render remotely to " + domain.toString() + " - can only render to " + origin);
                    if (container && "string" != typeof container) throw new Error("Container passed to renderTo must be a string selector, got " + typeof container + " }");
                }
            };
            _proto.log = function(event, payload) {
                this.logger.info(this.name + "_" + event, payload);
            };
            _proto.registerActiveComponent = function(instance) {
                Component.activeComponents.push(instance);
            };
            _proto.destroyActiveComponent = function(instance) {
                Component.activeComponents.splice(Component.activeComponents.indexOf(instance), 1);
            };
            Component.destroyAll = function() {
                for (var results = []; Component.activeComponents.length; ) results.push(Component.activeComponents[0].destroy());
                return promise_ZalgoPromise.all(results).then(src_util_noop);
            };
            return Component;
        }();
        component_Component.components = {};
        component_Component.activeComponents = [];
        function create(options) {
            var component = new component_Component(options), init = function(props) {
                return component.init(props);
            };
            init.driver = function(name, dep) {
                return component.driver(name, dep);
            };
            init.isChild = function() {
                return component.isChild();
            };
            init.canRenderTo = function(win) {
                return component.canRenderTo(win);
            };
            init.xprops = component.xprops;
            return init;
        }
        function component_destroyAll() {
            return component_Component.destroyAll();
        }
        __webpack_require__.d(__webpack_exports__, "PopupOpenError", function() {
            return PopupOpenError;
        });
        __webpack_require__.d(__webpack_exports__, "create", function() {
            return create;
        });
        __webpack_require__.d(__webpack_exports__, "destroyAll", function() {
            return component_destroyAll;
        });
        __webpack_require__.d(__webpack_exports__, "Component", function() {
            return component_Component;
        });
        __webpack_require__.d(__webpack_exports__, "PROP_TYPE", function() {
            return PROP_TYPE;
        });
        __webpack_require__.d(__webpack_exports__, "PROP_SERIALIZATION", function() {
            return PROP_SERIALIZATION;
        });
        __webpack_require__.d(__webpack_exports__, "CONTEXT", function() {
            return CONTEXT;
        });
    } ]);
});
//# sourceMappingURL=zoid.frameworks.js.map