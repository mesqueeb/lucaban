/*!
 * Vue.js v1.0.26
 * (c) 2016 Evan You
 * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Vue = factory());
}(this, function () { 'use strict';

  function set(obj, key, val) {
    if (hasOwn(obj, key)) {
      obj[key] = val;
      return;
    }
    if (obj._isVue) {
      set(obj._data, key, val);
      return;
    }
    var ob = obj.__ob__;
    if (!ob) {
      obj[key] = val;
      return;
    }
    ob.convert(key, val);
    ob.dep.notify();
    if (ob.vms) {
      var i = ob.vms.length;
      while (i--) {
        var vm = ob.vms[i];
        vm._proxy(key);
        vm._digest();
      }
    }
    return val;
  }

  /**
   * Delete a property and trigger change if necessary.
   *
   * @param {Object} obj
   * @param {String} key
   */

  function del(obj, key) {
    if (!hasOwn(obj, key)) {
      return;
    }
    delete obj[key];
    var ob = obj.__ob__;
    if (!ob) {
      if (obj._isVue) {
        delete obj._data[key];
        obj._digest();
      }
      return;
    }
    ob.dep.notify();
    if (ob.vms) {
      var i = ob.vms.length;
      while (i--) {
        var vm = ob.vms[i];
        vm._unproxy(key);
        vm._digest();
      }
    }
  }

  var hasOwnProperty = Object.prototype.hasOwnProperty;
  /**
   * Check whether the object has the property.
   *
   * @param {Object} obj
   * @param {String} key
   * @return {Boolean}
   */

  function hasOwn(obj, key) {
    return hasOwnProperty.call(obj, key);
  }

  /**
   * Check if an expression is a literal value.
   *
   * @param {String} exp
   * @return {Boolean}
   */

  var literalValueRE = /^\s?(true|false|-?[\d\.]+|'[^']*'|"[^"]*")\s?$/;

  function isLiteral(exp) {
    return literalValueRE.test(exp);
  }

  /**
   * Check if a string starts with $ or _
   *
   * @param {String} str
   * @return {Boolean}
   */

  function isReserved(str) {
    var c = (str + '').charCodeAt(0);
    return c === 0x24 || c === 0x5F;
  }

  /**
   * Guard text output, make sure undefined outputs
   * empty string
   *
   * @param {*} value
   * @return {String}
   */

  function _toString(value) {
    return value == null ? '' : value.toString();
  }

  /**
   * Check and convert possible numeric strings to numbers
   * before setting back to data
   *
   * @param {*} value
   * @return {*|Number}
   */

  function toNumber(value) {
    if (typeof value !== 'string') {
      return value;
    } else {
      var parsed = Number(value);
      return isNaN(parsed) ? value : parsed;
    }
  }

  /**
   * Convert string boolean literals into real booleans.
   *
   * @param {*} value
   * @return {*|Boolean}
   */

  function toBoolean(value) {
    return value === 'true' ? true : value === 'false' ? false : value;
  }

  /**
   * Strip quotes from a string
   *
   * @param {String} str
   * @return {String | false}
   */

  function stripQuotes(str) {
    var a = str.charCodeAt(0);
    var b = str.charCodeAt(str.length - 1);
    return a === b && (a === 0x22 || a === 0x27) ? str.slice(1, -1) : str;
  }

  /**
   * Camelize a hyphen-delmited string.
   *
   * @param {String} str
   * @return {String}
   */

  var camelizeRE = /-(\w)/g;

  function camelize(str) {
    return str.replace(camelizeRE, toUpper);
  }

  function toUpper(_, c) {
    return c ? c.toUpperCase() : '';
  }

  /**
   * Hyphenate a camelCase string.
   *
   * @param {String} str
   * @return {String}
   */

  var hyphenateRE = /([a-z\d])([A-Z])/g;

  function hyphenate(str) {
    return str.replace(hyphenateRE, '$1-$2').toLowerCase();
  }

  /**
   * Converts hyphen/underscore/slash delimitered names into
   * camelized classNames.
   *
   * e.g. my-component => MyComponent
   *      some_else    => SomeElse
   *      some/comp    => SomeComp
   *
   * @param {String} str
   * @return {String}
   */

  var classifyRE = /(?:^|[-_\/])(\w)/g;

  function classify(str) {
    return str.replace(classifyRE, toUpper);
  }

  /**
   * Simple bind, faster than native
   *
   * @param {Function} fn
   * @param {Object} ctx
   * @return {Function}
   */

  function bind(fn, ctx) {
    return function (a) {
      var l = arguments.length;
      return l ? l > 1 ? fn.apply(ctx, arguments) : fn.call(ctx, a) : fn.call(ctx);
    };
  }

  /**
   * Convert an Array-like object to a real Array.
   *
   * @param {Array-like} list
   * @param {Number} [start] - start index
   * @return {Array}
   */

  function toArray(list, start) {
    start = start || 0;
    var i = list.length - start;
    var ret = new Array(i);
    while (i--) {
      ret[i] = list[i + start];
    }
    return ret;
  }

  /**
   * Mix properties into target object.
   *
   * @param {Object} to
   * @param {Object} from
   */

  function extend(to, from) {
    var keys = Object.keys(from);
    var i = keys.length;
    while (i--) {
      to[keys[i]] = from[keys[i]];
    }
    return to;
  }

  /**
   * Quick object check - this is primarily used to tell
   * Objects from primitive values when we know the value
   * is a JSON-compliant type.
   *
   * @param {*} obj
   * @return {Boolean}
   */

  function isObject(obj) {
    return obj !== null && typeof obj === 'object';
  }

  /**
   * Strict object type check. Only returns true
   * for plain JavaScript objects.
   *
   * @param {*} obj
   * @return {Boolean}
   */

  var toString = Object.prototype.toString;
  var OBJECT_STRING = '[object Object]';

  function isPlainObject(obj) {
    return toString.call(obj) === OBJECT_STRING;
  }

  /**
   * Array type check.
   *
   * @param {*} obj
   * @return {Boolean}
   */

  var isArray = Array.isArray;

  /**
   * Define a property.
   *
   * @param {Object} obj
   * @param {String} key
   * @param {*} val
   * @param {Boolean} [enumerable]
   */

  function def(obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
      value: val,
      enumerable: !!enumerable,
      writable: true,
      configurable: true
    });
  }

  /**
   * Debounce a function so it only gets called after the
   * input stops arriving after the given wait period.
   *
   * @param {Function} func
   * @param {Number} wait
   * @return {Function} - the debounced function
   */

  function _debounce(func, wait) {
    var timeout, args, context, timestamp, result;
    var later = function later() {
      var last = Date.now() - timestamp;
      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    };
    return function () {
      context = this;
      args = arguments;
      timestamp = Date.now();
      if (!timeout) {
        timeout = setTimeout(later, wait);
      }
      return result;
    };
  }

  /**
   * Manual indexOf because it's slightly faster than
   * native.
   *
   * @param {Array} arr
   * @param {*} obj
   */

  function indexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * Make a cancellable version of an async callback.
   *
   * @param {Function} fn
   * @return {Function}
   */

  function cancellable(fn) {
    var cb = function cb() {
      if (!cb.cancelled) {
        return fn.apply(this, arguments);
      }
    };
    cb.cancel = function () {
      cb.cancelled = true;
    };
    return cb;
  }

  /**
   * Check if two values are loosely equal - that is,
   * if they are plain objects, do they have the same shape?
   *
   * @param {*} a
   * @param {*} b
   * @return {Boolean}
   */

  function looseEqual(a, b) {
    /* eslint-disable eqeqeq */
    return a == b || (isObject(a) && isObject(b) ? JSON.stringify(a) === JSON.stringify(b) : false);
    /* eslint-enable eqeqeq */
  }

  var hasProto = ('__proto__' in {});

  // Browser environment sniffing
  var inBrowser = typeof window !== 'undefined' && Object.prototype.toString.call(window) !== '[object Object]';

  // detect devtools
  var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

  // UA sniffing for working around browser-specific quirks
  var UA = inBrowser && window.navigator.userAgent.toLowerCase();
  var isIE = UA && UA.indexOf('trident') > 0;
  var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
  var isAndroid = UA && UA.indexOf('android') > 0;
  var isIos = UA && /(iphone|ipad|ipod|ios)/i.test(UA);
  var iosVersionMatch = isIos && UA.match(/os ([\d_]+)/);
  var iosVersion = iosVersionMatch && iosVersionMatch[1].split('_');

  // detecting iOS UIWebView by indexedDB
  var hasMutationObserverBug = iosVersion && Number(iosVersion[0]) >= 9 && Number(iosVersion[1]) >= 3 && !window.indexedDB;

  var transitionProp = undefined;
  var transitionEndEvent = undefined;
  var animationProp = undefined;
  var animationEndEvent = undefined;

  // Transition property/event sniffing
  if (inBrowser && !isIE9) {
    var isWebkitTrans = window.ontransitionend === undefined && window.onwebkittransitionend !== undefined;
    var isWebkitAnim = window.onanimationend === undefined && window.onwebkitanimationend !== undefined;
    transitionProp = isWebkitTrans ? 'WebkitTransition' : 'transition';
    transitionEndEvent = isWebkitTrans ? 'webkitTransitionEnd' : 'transitionend';
    animationProp = isWebkitAnim ? 'WebkitAnimation' : 'animation';
    animationEndEvent = isWebkitAnim ? 'webkitAnimationEnd' : 'animationend';
  }

  /**
   * Defer a task to execute it asynchronously. Ideally this
   * should be executed as a microtask, so we leverage
   * MutationObserver if it's available, and fallback to
   * setTimeout(0).
   *
   * @param {Function} cb
   * @param {Object} ctx
   */

  var nextTick = (function () {
    var callbacks = [];
    var pending = false;
    var timerFunc;
    function nextTickHandler() {
      pending = false;
      var copies = callbacks.slice(0);
      callbacks = [];
      for (var i = 0; i < copies.length; i++) {
        copies[i]();
      }
    }

    /* istanbul ignore if */
    if (typeof MutationObserver !== 'undefined' && !hasMutationObserverBug) {
      var counter = 1;
      var observer = new MutationObserver(nextTickHandler);
      var textNode = document.createTextNode(counter);
      observer.observe(textNode, {
        characterData: true
      });
      timerFunc = function () {
        counter = (counter + 1) % 2;
        textNode.data = counter;
      };
    } else {
      // webpack attempts to inject a shim for setImmediate
      // if it is used as a global, so we have to work around that to
      // avoid bundling unnecessary code.
      var context = inBrowser ? window : typeof global !== 'undefined' ? global : {};
      timerFunc = context.setImmediate || setTimeout;
    }
    return function (cb, ctx) {
      var func = ctx ? function () {
        cb.call(ctx);
      } : cb;
      callbacks.push(func);
      if (pending) return;
      pending = true;
      timerFunc(nextTickHandler, 0);
    };
  })();

  var _Set = undefined;
  /* istanbul ignore if */
  if (typeof Set !== 'undefined' && Set.toString().match(/native code/)) {
    // use native Set when available.
    _Set = Set;
  } else {
    // a non-standard Set polyfill that only works with primitive keys.
    _Set = function () {
      this.set = Object.create(null);
    };
    _Set.prototype.has = function (key) {
      return this.set[key] !== undefined;
    };
    _Set.prototype.add = function (key) {
      this.set[key] = 1;
    };
    _Set.prototype.clear = function () {
      this.set = Object.create(null);
    };
  }

  function Cache(limit) {
    this.size = 0;
    this.limit = limit;
    this.head = this.tail = undefined;
    this._keymap = Object.create(null);
  }

  var p = Cache.prototype;

  /**
   * Put <value> into the cache associated with <key>.
   * Returns the entry which was removed to make room for
   * the new entry. Otherwise undefined is returned.
   * (i.e. if there was enough room already).
   *
   * @param {String} key
   * @param {*} value
   * @return {Entry|undefined}
   */

  p.put = function (key, value) {
    var removed;

    var entry = this.get(key, true);
    if (!entry) {
      if (this.size === this.limit) {
        removed = this.shift();
      }
      entry = {
        key: key
      };
      this._keymap[key] = entry;
      if (this.tail) {
        this.tail.newer = entry;
        entry.older = this.tail;
      } else {
        this.head = entry;
      }
      this.tail = entry;
      this.size++;
    }
    entry.value = value;

    return removed;
  };

  /**
   * Purge the least recently used (oldest) entry from the
   * cache. Returns the removed entry or undefined if the
   * cache was empty.
   */

  p.shift = function () {
    var entry = this.head;
    if (entry) {
      this.head = this.head.newer;
      this.head.older = undefined;
      entry.newer = entry.older = undefined;
      this._keymap[entry.key] = undefined;
      this.size--;
    }
    return entry;
  };

  /**
   * Get and register recent use of <key>. Returns the value
   * associated with <key> or undefined if not in cache.
   *
   * @param {String} key
   * @param {Boolean} returnEntry
   * @return {Entry|*}
   */

  p.get = function (key, returnEntry) {
    var entry = this._keymap[key];
    if (entry === undefined) return;
    if (entry === this.tail) {
      return returnEntry ? entry : entry.value;
    }
    // HEAD--------------TAIL
    //   <.older   .newer>
    //  <--- add direction --
    //   A  B  C  <D>  E
    if (entry.newer) {
      if (entry === this.head) {
        this.head = entry.newer;
      }
      entry.newer.older = entry.older; // C <-- E.
    }
    if (entry.older) {
      entry.older.newer = entry.newer; // C. --> E
    }
    entry.newer = undefined; // D --x
    entry.older = this.tail; // D. --> E
    if (this.tail) {
      this.tail.newer = entry; // E. <-- D
    }
    this.tail = entry;
    return returnEntry ? entry : entry.value;
  };

  var cache$1 = new Cache(1000);
  var filterTokenRE = /[^\s'"]+|'[^']*'|"[^"]*"/g;
  var reservedArgRE = /^in$|^-?\d+/;

  /**
   * Parser state
   */

  var str;
  var dir;
  var c;
  var prev;
  var i;
  var l;
  var lastFilterIndex;
  var inSingle;
  var inDouble;
  var curly;
  var square;
  var paren;
  /**
   * Push a filter to the current directive object
   */

  function pushFilter() {
    var exp = str.slice(lastFilterIndex, i).trim();
    var filter;
    if (exp) {
      filter = {};
      var tokens = exp.match(filterTokenRE);
      filter.name = tokens[0];
      if (tokens.length > 1) {
        filter.args = tokens.slice(1).map(processFilterArg);
      }
    }
    if (filter) {
      (dir.filters = dir.filters || []).push(filter);
    }
    lastFilterIndex = i + 1;
  }

  /**
   * Check if an argument is dynamic and strip quotes.
   *
   * @param {String} arg
   * @return {Object}
   */

  function processFilterArg(arg) {
    if (reservedArgRE.test(arg)) {
      return {
        value: toNumber(arg),
        dynamic: false
      };
    } else {
      var stripped = stripQuotes(arg);
      var dynamic = stripped === arg;
      return {
        value: dynamic ? arg : stripped,
        dynamic: dynamic
      };
    }
  }

  /**
   * Parse a directive value and extract the expression
   * and its filters into a descriptor.
   *
   * Example:
   *
   * "a + 1 | uppercase" will yield:
   * {
   *   expression: 'a + 1',
   *   filters: [
   *     { name: 'uppercase', args: null }
   *   ]
   * }
   *
   * @param {String} s
   * @return {Object}
   */

  function parseDirective(s) {
    var hit = cache$1.get(s);
    if (hit) {
      return hit;
    }

    // reset parser state
    str = s;
    inSingle = inDouble = false;
    curly = square = paren = 0;
    lastFilterIndex = 0;
    dir = {};

    for (i = 0, l = str.length; i < l; i++) {
      prev = c;
      c = str.charCodeAt(i);
      if (inSingle) {
        // check single quote
        if (c === 0x27 && prev !== 0x5C) inSingle = !inSingle;
      } else if (inDouble) {
        // check double quote
        if (c === 0x22 && prev !== 0x5C) inDouble = !inDouble;
      } else if (c === 0x7C && // pipe
      str.charCodeAt(i + 1) !== 0x7C && str.charCodeAt(i - 1) !== 0x7C) {
        if (dir.expression == null) {
          // first filter, end of expression
          lastFilterIndex = i + 1;
          dir.expression = str.slice(0, i).trim();
        } else {
          // already has filter
          pushFilter();
        }
      } else {
        switch (c) {
          case 0x22:
            inDouble = true;break; // "
          case 0x27:
            inSingle = true;break; // '
          case 0x28:
            paren++;break; // (
          case 0x29:
            paren--;break; // )
          case 0x5B:
            square++;break; // [
          case 0x5D:
            square--;break; // ]
          case 0x7B:
            curly++;break; // {
          case 0x7D:
            curly--;break; // }
        }
      }
    }

    if (dir.expression == null) {
      dir.expression = str.slice(0, i).trim();
    } else if (lastFilterIndex !== 0) {
      pushFilter();
    }

    cache$1.put(s, dir);
    return dir;
  }

var directive = Object.freeze({
    parseDirective: parseDirective
  });

  var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;
  var cache = undefined;
  var tagRE = undefined;
  var htmlRE = undefined;
  /**
   * Escape a string so it can be used in a RegExp
   * constructor.
   *
   * @param {String} str
   */

  function escapeRegex(str) {
    return str.replace(regexEscapeRE, '\\$&');
  }

  function compileRegex() {
    var open = escapeRegex(config.delimiters[0]);
    var close = escapeRegex(config.delimiters[1]);
    var unsafeOpen = escapeRegex(config.unsafeDelimiters[0]);
    var unsafeClose = escapeRegex(config.unsafeDelimiters[1]);
    tagRE = new RegExp(unsafeOpen + '((?:.|\\n)+?)' + unsafeClose + '|' + open + '((?:.|\\n)+?)' + close, 'g');
    htmlRE = new RegExp('^' + unsafeOpen + '((?:.|\\n)+?)' + unsafeClose + '$');
    // reset cache
    cache = new Cache(1000);
  }

  /**
   * Parse a template text string into an array of tokens.
   *
   * @param {String} text
   * @return {Array<Object> | null}
   *               - {String} type
   *               - {String} value
   *               - {Boolean} [html]
   *               - {Boolean} [oneTime]
   */

  function parseText(text) {
    if (!cache) {
      compileRegex();
    }
    var hit = cache.get(text);
    if (hit) {
      return hit;
    }
    if (!tagRE.test(text)) {
      return null;
    }
    var tokens = [];
    var lastIndex = tagRE.lastIndex = 0;
    var match, index, html, value, first, oneTime;
    /* eslint-disable no-cond-assign */
    while (match = tagRE.exec(text)) {
      /* eslint-enable no-cond-assign */
      index = match.index;
      // push text token
      if (index > lastIndex) {
        tokens.push({
          value: text.slice(lastIndex, index)
        });
      }
      // tag token
      html = htmlRE.test(match[0]);
      value = html ? match[1] : match[2];
      first = value.charCodeAt(0);
      oneTime = first === 42; // *
      value = oneTime ? value.slice(1) : value;
      tokens.push({
        tag: true,
        value: value.trim(),
        html: html,
        oneTime: oneTime
      });
      lastIndex = index + match[0].length;
    }
    if (lastIndex < text.length) {
      tokens.push({
        value: text.slice(lastIndex)
      });
    }
    cache.put(text, tokens);
    return tokens;
  }

  /**
   * Format a list of tokens into an expression.
   * e.g. tokens parsed from 'a {{b}} c' can be serialized
   * into one single expression as '"a " + b + " c"'.
   *
   * @param {Array} tokens
   * @param {Vue} [vm]
   * @return {String}
   */

  function tokensToExp(tokens, vm) {
    if (tokens.length > 1) {
      return tokens.map(function (token) {
        return formatToken(token, vm);
      }).join('+');
    } else {
      return formatToken(tokens[0], vm, true);
    }
  }

  /**
   * Format a single token.
   *
   * @param {Object} token
   * @param {Vue} [vm]
   * @param {Boolean} [single]
   * @return {String}
   */

  function formatToken(token, vm, single) {
    return token.tag ? token.oneTime && vm ? '"' + vm.$eval(token.value) + '"' : inlineFilters(token.value, single) : '"' + token.value + '"';
  }

  /**
   * For an attribute with multiple interpolation tags,
   * e.g. attr="some-{{thing | filter}}", in order to combine
   * the whole thing into a single watchable expression, we
   * have to inline those filters. This function does exactly
   * that. This is a bit hacky but it avoids heavy changes
   * to directive parser and watcher mechanism.
   *
   * @param {String} exp
   * @param {Boolean} single
   * @return {String}
   */

  var filterRE = /[^|]\|[^|]/;
  function inlineFilters(exp, single) {
    if (!filterRE.test(exp)) {
      return single ? exp : '(' + exp + ')';
    } else {
      var dir = parseDirective(exp);
      if (!dir.filters) {
        return '(' + exp + ')';
      } else {
        return 'this._applyFilters(' + dir.expression + // value
        ',null,' + // oldValue (null for read)
        JSON.stringify(dir.filters) + // filter descriptors
        ',false)'; // write?
      }
    }
  }

var text = Object.freeze({
    compileRegex: compileRegex,
    parseText: parseText,
    tokensToExp: tokensToExp
  });

  var delimiters = ['{{', '}}'];
  var unsafeDelimiters = ['{{{', '}}}'];

  var config = Object.defineProperties({

    /**
     * Whether to print debug messages.
     * Also enables stack trace for warnings.
     *
     * @type {Boolean}
     */

    debug: false,

    /**
     * Whether to suppress warnings.
     *
     * @type {Boolean}
     */

    silent: false,

    /**
     * Whether to use async rendering.
     */

    async: true,

    /**
     * Whether to warn against errors caught when evaluating
     * expressions.
     */

    warnExpressionErrors: true,

    /**
     * Whether to allow devtools inspection.
     * Disabled by default in production builds.
     */

    devtools: 'development' !== 'production',

    /**
     * Internal flag to indicate the delimiters have been
     * changed.
     *
     * @type {Boolean}
     */

    _delimitersChanged: true,

    /**
     * List of asset types that a component can own.
     *
     * @type {Array}
     */

    _assetTypes: ['component', 'directive', 'elementDirective', 'filter', 'transition', 'partial'],

    /**
     * prop binding modes
     */

    _propBindingModes: {
      ONE_WAY: 0,
      TWO_WAY: 1,
      ONE_TIME: 2
    },

    /**
     * Max circular updates allowed in a batcher flush cycle.
     */

    _maxUpdateCount: 100

  }, {
    delimiters: { /**
                   * Interpolation delimiters. Changing these would trigger
                   * the text parser to re-compile the regular expressions.
                   *
                   * @type {Array<String>}
                   */

      get: function get() {
        return delimiters;
      },
      set: function set(val) {
        delimiters = val;
        compileRegex();
      },
      configurable: true,
      enumerable: true
    },
    unsafeDelimiters: {
      get: function get() {
        return unsafeDelimiters;
      },
      set: function set(val) {
        unsafeDelimiters = val;
        compileRegex();
      },
      configurable: true,
      enumerable: true
    }
  });

  var warn = undefined;
  var formatComponentName = undefined;

  if ('development' !== 'production') {
    (function () {
      var hasConsole = typeof console !== 'undefined';

      warn = function (msg, vm) {
        if (hasConsole && !config.silent) {
          console.error('[Vue warn]: ' + msg + (vm ? formatComponentName(vm) : ''));
        }
      };

      formatComponentName = function (vm) {
        var name = vm._isVue ? vm.$options.name : vm.name;
        return name ? ' (found in component: <' + hyphenate(name) + '>)' : '';
      };
    })();
  }

  /**
   * Append with transition.
   *
   * @param {Element} el
   * @param {Element} target
   * @param {Vue} vm
   * @param {Function} [cb]
   */

  function appendWithTransition(el, target, vm, cb) {
    applyTransition(el, 1, function () {
      target.appendChild(el);
    }, vm, cb);
  }

  /**
   * InsertBefore with transition.
   *
   * @param {Element} el
   * @param {Element} target
   * @param {Vue} vm
   * @param {Function} [cb]
   */

  function beforeWithTransition(el, target, vm, cb) {
    applyTransition(el, 1, function () {
      before(el, target);
    }, vm, cb);
  }

  /**
   * Remove with transition.
   *
   * @param {Element} el
   * @param {Vue} vm
   * @param {Function} [cb]
   */

  function removeWithTransition(el, vm, cb) {
    applyTransition(el, -1, function () {
      remove(el);
    }, vm, cb);
  }

  /**
   * Apply transitions with an operation callback.
   *
   * @param {Element} el
   * @param {Number} direction
   *                  1: enter
   *                 -1: leave
   * @param {Function} op - the actual DOM operation
   * @param {Vue} vm
   * @param {Function} [cb]
   */

  function applyTransition(el, direction, op, vm, cb) {
    var transition = el.__v_trans;
    if (!transition ||
    // skip if there are no js hooks and CSS transition is
    // not supported
    !transition.hooks && !transitionEndEvent ||
    // skip transitions for initial compile
    !vm._isCompiled ||
    // if the vm is being manipulated by a parent directive
    // during the parent's compilation phase, skip the
    // animation.
    vm.$parent && !vm.$parent._isCompiled) {
      op();
      if (cb) cb();
      return;
    }
    var action = direction > 0 ? 'enter' : 'leave';
    transition[action](op, cb);
  }

var transition = Object.freeze({
    appendWithTransition: appendWithTransition,
    beforeWithTransition: beforeWithTransition,
    removeWithTransition: removeWithTransition,
    applyTransition: applyTransition
  });

  /**
   * Query an element selector if it's not an element already.
   *
   * @param {String|Element} el
   * @return {Element}
   */

  function query(el) {
    if (typeof el === 'string') {
      var selector = el;
      el = document.querySelector(el);
      if (!el) {
        'development' !== 'production' && warn('Cannot find element: ' + selector);
      }
    }
    return el;
  }

  /**
   * Check if a node is in the document.
   * Note: document.documentElement.contains should work here
   * but always returns false for comment nodes in phantomjs,
   * making unit tests difficult. This is fixed by doing the
   * contains() check on the node's parentNode instead of
   * the node itself.
   *
   * @param {Node} node
   * @return {Boolean}
   */

  function inDoc(node) {
    if (!node) return false;
    var doc = node.ownerDocument.documentElement;
    var parent = node.parentNode;
    return doc === node || doc === parent || !!(parent && parent.nodeType === 1 && doc.contains(parent));
  }

  /**
   * Get and remove an attribute from a node.
   *
   * @param {Node} node
   * @param {String} _attr
   */

  function getAttr(node, _attr) {
    var val = node.getAttribute(_attr);
    if (val !== null) {
      node.removeAttribute(_attr);
    }
    return val;
  }

  /**
   * Get an attribute with colon or v-bind: prefix.
   *
   * @param {Node} node
   * @param {String} name
   * @return {String|null}
   */

  function getBindAttr(node, name) {
    var val = getAttr(node, ':' + name);
    if (val === null) {
      val = getAttr(node, 'v-bind:' + name);
    }
    return val;
  }

  /**
   * Check the presence of a bind attribute.
   *
   * @param {Node} node
   * @param {String} name
   * @return {Boolean}
   */

  function hasBindAttr(node, name) {
    return node.hasAttribute(name) || node.hasAttribute(':' + name) || node.hasAttribute('v-bind:' + name);
  }

  /**
   * Insert el before target
   *
   * @param {Element} el
   * @param {Element} target
   */

  function before(el, target) {
    target.parentNode.insertBefore(el, target);
  }

  /**
   * Insert el after target
   *
   * @param {Element} el
   * @param {Element} target
   */

  function after(el, target) {
    if (target.nextSibling) {
      before(el, target.nextSibling);
    } else {
      target.parentNode.appendChild(el);
    }
  }

  /**
   * Remove el from DOM
   *
   * @param {Element} el
   */

  function remove(el) {
    el.parentNode.removeChild(el);
  }

  /**
   * Prepend el to target
   *
   * @param {Element} el
   * @param {Element} target
   */

  function prepend(el, target) {
    if (target.firstChild) {
      before(el, target.firstChild);
    } else {
      target.appendChild(el);
    }
  }

  /**
   * Replace target with el
   *
   * @param {Element} target
   * @param {Element} el
   */

  function replace(target, el) {
    var parent = target.parentNode;
    if (parent) {
      parent.replaceChild(el, target);
    }
  }

  /**
   * Add event listener shorthand.
   *
   * @param {Element} el
   * @param {String} event
   * @param {Function} cb
   * @param {Boolean} [useCapture]
   */

  function on(el, event, cb, useCapture) {
    el.addEventListener(event, cb, useCapture);
  }

  /**
   * Remove event listener shorthand.
   *
   * @param {Element} el
   * @param {String} event
   * @param {Function} cb
   */

  function off(el, event, cb) {
    el.removeEventListener(event, cb);
  }

  /**
   * For IE9 compat: when both class and :class are present
   * getAttribute('class') returns wrong value...
   *
   * @param {Element} el
   * @return {String}
   */

  function getClass(el) {
    var classname = el.className;
    if (typeof classname === 'object') {
      classname = classname.baseVal || '';
    }
    return classname;
  }

  /**
   * In IE9, setAttribute('class') will result in empty class
   * if the element also has the :class attribute; However in
   * PhantomJS, setting `className` does not work on SVG elements...
   * So we have to do a conditional check here.
   *
   * @param {Element} el
   * @param {String} cls
   */

  function setClass(el, cls) {
    /* istanbul ignore if */
    if (isIE9 && !/svg$/.test(el.namespaceURI)) {
      el.className = cls;
    } else {
      el.setAttribute('class', cls);
    }
  }

  /**
   * Add class with compatibility for IE & SVG
   *
   * @param {Element} el
   * @param {String} cls
   */

  function addClass(el, cls) {
    if (el.classList) {
      el.classList.add(cls);
    } else {
      var cur = ' ' + getClass(el) + ' ';
      if (cur.indexOf(' ' + cls + ' ') < 0) {
        setClass(el, (cur + cls).trim());
      }
    }
  }

  /**
   * Remove class with compatibility for IE & SVG
   *
   * @param {Element} el
   * @param {String} cls
   */

  function removeClass(el, cls) {
    if (el.classList) {
      el.classList.remove(cls);
    } else {
      var cur = ' ' + getClass(el) + ' ';
      var tar = ' ' + cls + ' ';
      while (cur.indexOf(tar) >= 0) {
        cur = cur.replace(tar, ' ');
      }
      setClass(el, cur.trim());
    }
    if (!el.className) {
      el.removeAttribute('class');
    }
  }

  /**
   * Extract raw content inside an element into a temporary
   * container div
   *
   * @param {Element} el
   * @param {Boolean} asFragment
   * @return {Element|DocumentFragment}
   */

  function extractContent(el, asFragment) {
    var child;
    var rawContent;
    /* istanbul ignore if */
    if (isTemplate(el) && isFragment(el.content)) {
      el = el.content;
    }
    if (el.hasChildNodes()) {
      trimNode(el);
      rawContent = asFragment ? document.createDocumentFragment() : document.createElement('div');
      /* eslint-disable no-cond-assign */
      while (child = el.firstChild) {
        /* eslint-enable no-cond-assign */
        rawContent.appendChild(child);
      }
    }
    return rawContent;
  }

  /**
   * Trim possible empty head/tail text and comment
   * nodes inside a parent.
   *
   * @param {Node} node
   */

  function trimNode(node) {
    var child;
    /* eslint-disable no-sequences */
    while ((child = node.firstChild, isTrimmable(child))) {
      node.removeChild(child);
    }
    while ((child = node.lastChild, isTrimmable(child))) {
      node.removeChild(child);
    }
    /* eslint-enable no-sequences */
  }

  function isTrimmable(node) {
    return node && (node.nodeType === 3 && !node.data.trim() || node.nodeType === 8);
  }

  /**
   * Check if an element is a template tag.
   * Note if the template appears inside an SVG its tagName
   * will be in lowercase.
   *
   * @param {Element} el
   */

  function isTemplate(el) {
    return el.tagName && el.tagName.toLowerCase() === 'template';
  }

  /**
   * Create an "anchor" for performing dom insertion/removals.
   * This is used in a number of scenarios:
   * - fragment instance
   * - v-html
   * - v-if
   * - v-for
   * - component
   *
   * @param {String} content
   * @param {Boolean} persist - IE trashes empty textNodes on
   *                            cloneNode(true), so in certain
   *                            cases the anchor needs to be
   *                            non-empty to be persisted in
   *                            templates.
   * @return {Comment|Text}
   */

  function createAnchor(content, persist) {
    var anchor = config.debug ? document.createComment(content) : document.createTextNode(persist ? ' ' : '');
    anchor.__v_anchor = true;
    return anchor;
  }

  /**
   * Find a component ref attribute that starts with $.
   *
   * @param {Element} node
   * @return {String|undefined}
   */

  var refRE = /^v-ref:/;

  function findRef(node) {
    if (node.hasAttributes()) {
      var attrs = node.attributes;
      for (var i = 0, l = attrs.length; i < l; i++) {
        var name = attrs[i].name;
        if (refRE.test(name)) {
          return camelize(name.replace(refRE, ''));
        }
      }
    }
  }

  /**
   * Map a function to a range of nodes .
   *
   * @param {Node} node
   * @param {Node} end
   * @param {Function} op
   */

  function mapNodeRange(node, end, op) {
    var next;
    while (node !== end) {
      next = node.nextSibling;
      op(node);
      node = next;
    }
    op(end);
  }

  /**
   * Remove a range of nodes with transition, store
   * the nodes in a fragment with correct ordering,
   * and call callback when done.
   *
   * @param {Node} start
   * @param {Node} end
   * @param {Vue} vm
   * @param {DocumentFragment} frag
   * @param {Function} cb
   */

  function removeNodeRange(start, end, vm, frag, cb) {
    var done = false;
    var removed = 0;
    var nodes = [];
    mapNodeRange(start, end, function (node) {
      if (node === end) done = true;
      nodes.push(node);
      removeWithTransition(node, vm, onRemoved);
    });
    function onRemoved() {
      removed++;
      if (done && removed >= nodes.length) {
        for (var i = 0; i < nodes.length; i++) {
          frag.appendChild(nodes[i]);
        }
        cb && cb();
      }
    }
  }

  /**
   * Check if a node is a DocumentFragment.
   *
   * @param {Node} node
   * @return {Boolean}
   */

  function isFragment(node) {
    return node && node.nodeType === 11;
  }

  /**
   * Get outerHTML of elements, taking care
   * of SVG elements in IE as well.
   *
   * @param {Element} el
   * @return {String}
   */

  function getOuterHTML(el) {
    if (el.outerHTML) {
      return el.outerHTML;
    } else {
      var container = document.createElement('div');
      container.appendChild(el.cloneNode(true));
      return container.innerHTML;
    }
  }

  var commonTagRE = /^(div|p|span|img|a|b|i|br|ul|ol|li|h1|h2|h3|h4|h5|h6|code|pre|table|th|td|tr|form|label|input|select|option|nav|article|section|header|footer)$/i;
  var reservedTagRE = /^(slot|partial|component)$/i;

  var isUnknownElement = undefined;
  if ('development' !== 'production') {
    isUnknownElement = function (el, tag) {
      if (tag.indexOf('-') > -1) {
        // http://stackoverflow.com/a/28210364/1070244
        return el.constructor === window.HTMLUnknownElement || el.constructor === window.HTMLElement;
      } else {
        return (/HTMLUnknownElement/.test(el.toString()) &&
          // Chrome returns unknown for several HTML5 elements.
          // https://code.google.com/p/chromium/issues/detail?id=540526
          // Firefox returns unknown for some "Interactive elements."
          !/^(data|time|rtc|rb|details|dialog|summary)$/.test(tag)
        );
      }
    };
  }

  /**
   * Check if an element is a component, if yes return its
   * component id.
   *
   * @param {Element} el
   * @param {Object} options
   * @return {Object|undefined}
   */

  function checkComponentAttr(el, options) {
    var tag = el.tagName.toLowerCase();
    var hasAttrs = el.hasAttributes();
    if (!commonTagRE.test(tag) && !reservedTagRE.test(tag)) {
      if (resolveAsset(options, 'components', tag)) {
        return { id: tag };
      } else {
        var is = hasAttrs && getIsBinding(el, options);
        if (is) {
          return is;
        } else if ('development' !== 'production') {
          var expectedTag = options._componentNameMap && options._componentNameMap[tag];
          if (expectedTag) {
            warn('Unknown custom element: <' + tag + '> - ' + 'did you mean <' + expectedTag + '>? ' + 'HTML is case-insensitive, remember to use kebab-case in templates.');
          } else if (isUnknownElement(el, tag)) {
            warn('Unknown custom element: <' + tag + '> - did you ' + 'register the component correctly? For recursive components, ' + 'make sure to provide the "name" option.');
          }
        }
      }
    } else if (hasAttrs) {
      return getIsBinding(el, options);
    }
  }

  /**
   * Get "is" binding from an element.
   *
   * @param {Element} el
   * @param {Object} options
   * @return {Object|undefined}
   */

  function getIsBinding(el, options) {
    // dynamic syntax
    var exp = el.getAttribute('is');
    if (exp != null) {
      if (resolveAsset(options, 'components', exp)) {
        el.removeAttribute('is');
        return { id: exp };
      }
    } else {
      exp = getBindAttr(el, 'is');
      if (exp != null) {
        return { id: exp, dynamic: true };
      }
    }
  }

  /**
   * Option overwriting strategies are functions that handle
   * how to merge a parent option value and a child option
   * value into the final value.
   *
   * All strategy functions follow the same signature:
   *
   * @param {*} parentVal
   * @param {*} childVal
   * @param {Vue} [vm]
   */

  var strats = config.optionMergeStrategies = Object.create(null);

  /**
   * Helper that recursively merges two data objects together.
   */

  function mergeData(to, from) {
    var key, toVal, fromVal;
    for (key in from) {
      toVal = to[key];
      fromVal = from[key];
      if (!hasOwn(to, key)) {
        set(to, key, fromVal);
      } else if (isObject(toVal) && isObject(fromVal)) {
        mergeData(toVal, fromVal);
      }
    }
    return to;
  }

  /**
   * Data
   */

  strats.data = function (parentVal, childVal, vm) {
    if (!vm) {
      // in a Vue.extend merge, both should be functions
      if (!childVal) {
        return parentVal;
      }
      if (typeof childVal !== 'function') {
        'development' !== 'production' && warn('The "data" option should be a function ' + 'that returns a per-instance value in component ' + 'definitions.', vm);
        return parentVal;
      }
      if (!parentVal) {
        return childVal;
      }
      // when parentVal & childVal are both present,
      // we need to return a function that returns the
      // merged result of both functions... no need to
      // check if parentVal is a function here because
      // it has to be a function to pass previous merges.
      return function mergedDataFn() {
        return mergeData(childVal.call(this), parentVal.call(this));
      };
    } else if (parentVal || childVal) {
      return function mergedInstanceDataFn() {
        // instance merge
        var instanceData = typeof childVal === 'function' ? childVal.call(vm) : childVal;
        var defaultData = typeof parentVal === 'function' ? parentVal.call(vm) : undefined;
        if (instanceData) {
          return mergeData(instanceData, defaultData);
        } else {
          return defaultData;
        }
      };
    }
  };

  /**
   * El
   */

  strats.el = function (parentVal, childVal, vm) {
    if (!vm && childVal && typeof childVal !== 'function') {
      'development' !== 'production' && warn('The "el" option should be a function ' + 'that returns a per-instance value in component ' + 'definitions.', vm);
      return;
    }
    var ret = childVal || parentVal;
    // invoke the element factory if this is instance merge
    return vm && typeof ret === 'function' ? ret.call(vm) : ret;
  };

  /**
   * Hooks and param attributes are merged as arrays.
   */

  strats.init = strats.created = strats.ready = strats.attached = strats.detached = strats.beforeCompile = strats.compiled = strats.beforeDestroy = strats.destroyed = strats.activate = function (parentVal, childVal) {
    return childVal ? parentVal ? parentVal.concat(childVal) : isArray(childVal) ? childVal : [childVal] : parentVal;
  };

  /**
   * Assets
   *
   * When a vm is present (instance creation), we need to do
   * a three-way merge between constructor options, instance
   * options and parent options.
   */

  function mergeAssets(parentVal, childVal) {
    var res = Object.create(parentVal || null);
    return childVal ? extend(res, guardArrayAssets(childVal)) : res;
  }

  config._assetTypes.forEach(function (type) {
    strats[type + 's'] = mergeAssets;
  });

  /**
   * Events & Watchers.
   *
   * Events & watchers hashes should not overwrite one
   * another, so we merge them as arrays.
   */

  strats.watch = strats.events = function (parentVal, childVal) {
    if (!childVal) return parentVal;
    if (!parentVal) return childVal;
    var ret = {};
    extend(ret, parentVal);
    for (var key in childVal) {
      var parent = ret[key];
      var child = childVal[key];
      if (parent && !isArray(parent)) {
        parent = [parent];
      }
      ret[key] = parent ? parent.concat(child) : [child];
    }
    return ret;
  };

  /**
   * Other object hashes.
   */

  strats.props = strats.methods = strats.computed = function (parentVal, childVal) {
    if (!childVal) return parentVal;
    if (!parentVal) return childVal;
    var ret = Object.create(null);
    extend(ret, parentVal);
    extend(ret, childVal);
    return ret;
  };

  /**
   * Default strategy.
   */

  var defaultStrat = function defaultStrat(parentVal, childVal) {
    return childVal === undefined ? parentVal : childVal;
  };

  /**
   * Make sure component options get converted to actual
   * constructors.
   *
   * @param {Object} options
   */

  function guardComponents(options) {
    if (options.components) {
      var components = options.components = guardArrayAssets(options.components);
      var ids = Object.keys(components);
      var def;
      if ('development' !== 'production') {
        var map = options._componentNameMap = {};
      }
      for (var i = 0, l = ids.length; i < l; i++) {
        var key = ids[i];
        if (commonTagRE.test(key) || reservedTagRE.test(key)) {
          'development' !== 'production' && warn('Do not use built-in or reserved HTML elements as component ' + 'id: ' + key);
          continue;
        }
        // record a all lowercase <-> kebab-case mapping for
        // possible custom element case error warning
        if ('development' !== 'production') {
          map[key.replace(/-/g, '').toLowerCase()] = hyphenate(key);
        }
        def = components[key];
        if (isPlainObject(def)) {
          components[key] = Vue.extend(def);
        }
      }
    }
  }

  /**
   * Ensure all props option syntax are normalized into the
   * Object-based format.
   *
   * @param {Object} options
   */

  function guardProps(options) {
    var props = options.props;
    var i, val;
    if (isArray(props)) {
      options.props = {};
      i = props.length;
      while (i--) {
        val = props[i];
        if (typeof val === 'string') {
          options.props[val] = null;
        } else if (val.name) {
          options.props[val.name] = val;
        }
      }
    } else if (isPlainObject(props)) {
      var keys = Object.keys(props);
      i = keys.length;
      while (i--) {
        val = props[keys[i]];
        if (typeof val === 'function') {
          props[keys[i]] = { type: val };
        }
      }
    }
  }

  /**
   * Guard an Array-format assets option and converted it
   * into the key-value Object format.
   *
   * @param {Object|Array} assets
   * @return {Object}
   */

  function guardArrayAssets(assets) {
    if (isArray(assets)) {
      var res = {};
      var i = assets.length;
      var asset;
      while (i--) {
        asset = assets[i];
        var id = typeof asset === 'function' ? asset.options && asset.options.name || asset.id : asset.name || asset.id;
        if (!id) {
          'development' !== 'production' && warn('Array-syntax assets must provide a "name" or "id" field.');
        } else {
          res[id] = asset;
        }
      }
      return res;
    }
    return assets;
  }

  /**
   * Merge two option objects into a new one.
   * Core utility used in both instantiation and inheritance.
   *
   * @param {Object} parent
   * @param {Object} child
   * @param {Vue} [vm] - if vm is present, indicates this is
   *                     an instantiation merge.
   */

  function mergeOptions(parent, child, vm) {
    guardComponents(child);
    guardProps(child);
    if ('development' !== 'production') {
      if (child.propsData && !vm) {
        warn('propsData can only be used as an instantiation option.');
      }
    }
    var options = {};
    var key;
    if (child['extends']) {
      parent = typeof child['extends'] === 'function' ? mergeOptions(parent, child['extends'].options, vm) : mergeOptions(parent, child['extends'], vm);
    }
    if (child.mixins) {
      for (var i = 0, l = child.mixins.length; i < l; i++) {
        var mixin = child.mixins[i];
        var mixinOptions = mixin.prototype instanceof Vue ? mixin.options : mixin;
        parent = mergeOptions(parent, mixinOptions, vm);
      }
    }
    for (key in parent) {
      mergeField(key);
    }
    for (key in child) {
      if (!hasOwn(parent, key)) {
        mergeField(key);
      }
    }
    function mergeField(key) {
      var strat = strats[key] || defaultStrat;
      options[key] = strat(parent[key], child[key], vm, key);
    }
    return options;
  }

  /**
   * Resolve an asset.
   * This function is used because child instances need access
   * to assets defined in its ancestor chain.
   *
   * @param {Object} options
   * @param {String} type
   * @param {String} id
   * @param {Boolean} warnMissing
   * @return {Object|Function}
   */

  function resolveAsset(options, type, id, warnMissing) {
    /* istanbul ignore if */
    if (typeof id !== 'string') {
      return;
    }
    var assets = options[type];
    var camelizedId;
    var res = assets[id] ||
    // camelCase ID
    assets[camelizedId = camelize(id)] ||
    // Pascal Case ID
    assets[camelizedId.charAt(0).toUpperCase() + camelizedId.slice(1)];
    if ('development' !== 'production' && warnMissing && !res) {
      warn('Failed to resolve ' + type.slice(0, -1) + ': ' + id, options);
    }
    return res;
  }

  var uid$1 = 0;

  /**
   * A dep is an observable that can have multiple
   * directives subscribing to it.
   *
   * @constructor
   */
  function Dep() {
    this.id = uid$1++;
    this.subs = [];
  }

  // the current target watcher being evaluated.
  // this is globally unique because there could be only one
  // watcher being evaluated at any time.
  Dep.target = null;

  /**
   * Add a directive subscriber.
   *
   * @param {Directive} sub
   */

  Dep.prototype.addSub = function (sub) {
    this.subs.push(sub);
  };

  /**
   * Remove a directive subscriber.
   *
   * @param {Directive} sub
   */

  Dep.prototype.removeSub = function (sub) {
    this.subs.$remove(sub);
  };

  /**
   * Add self as a dependency to the target watcher.
   */

  Dep.prototype.depend = function () {
    Dep.target.addDep(this);
  };

  /**
   * Notify all subscribers of a new value.
   */

  Dep.prototype.notify = function () {
    // stablize the subscriber list first
    var subs = toArray(this.subs);
    for (var i = 0, l = subs.length; i < l; i++) {
      subs[i].update();
    }
  };

  var arrayProto = Array.prototype;
  var arrayMethods = Object.create(arrayProto)

  /**
   * Intercept mutating methods and emit events
   */

  ;['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(function (method) {
    // cache original method
    var original = arrayProto[method];
    def(arrayMethods, method, function mutator() {
      // avoid leaking arguments:
      // http://jsperf.com/closure-with-arguments
      var i = arguments.length;
      var args = new Array(i);
      while (i--) {
        args[i] = arguments[i];
      }
      var result = original.apply(this, args);
      var ob = this.__ob__;
      var inserted;
      switch (method) {
        case 'push':
          inserted = args;
          break;
        case 'unshift':
          inserted = args;
          break;
        case 'splice':
          inserted = args.slice(2);
          break;
      }
      if (inserted) ob.observeArray(inserted);
      // notify change
      ob.dep.notify();
      return result;
    });
  });

  /**
   * Swap the element at the given index with a new value
   * and emits corresponding event.
   *
   * @param {Number} index
   * @param {*} val
   * @return {*} - replaced element
   */

  def(arrayProto, '$set', function $set(index, val) {
    if (index >= this.length) {
      this.length = Number(index) + 1;
    }
    return this.splice(index, 1, val)[0];
  });

  /**
   * Convenience method to remove the element at given index or target element reference.
   *
   * @param {*} item
   */

  def(arrayProto, '$remove', function $remove(item) {
    /* istanbul ignore if */
    if (!this.length) return;
    var index = indexOf(this, item);
    if (index > -1) {
      return this.splice(index, 1);
    }
  });

  var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

  /**
   * By default, when a reactive property is set, the new value is
   * also converted to become reactive. However in certain cases, e.g.
   * v-for scope alias and props, we don't want to force conversion
   * because the value may be a nested value under a frozen data structure.
   *
   * So whenever we want to set a reactive property without forcing
   * conversion on the new value, we wrap that call inside this function.
   */

  var shouldConvert = true;

  function withoutConversion(fn) {
    shouldConvert = false;
    fn();
    shouldConvert = true;
  }

  /**
   * Observer class that are attached to each observed
   * object. Once attached, the observer converts target
   * object's property keys into getter/setters that
   * collect dependencies and dispatches updates.
   *
   * @param {Array|Object} value
   * @constructor
   */

  function Observer(value) {
    this.value = value;
    this.dep = new Dep();
    def(value, '__ob__', this);
    if (isArray(value)) {
      var augment = hasProto ? protoAugment : copyAugment;
      augment(value, arrayMethods, arrayKeys);
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  }

  // Instance methods

  /**
   * Walk through each property and convert them into
   * getter/setters. This method should only be called when
   * value type is Object.
   *
   * @param {Object} obj
   */

  Observer.prototype.walk = function (obj) {
    var keys = Object.keys(obj);
    for (var i = 0, l = keys.length; i < l; i++) {
      this.convert(keys[i], obj[keys[i]]);
    }
  };

  /**
   * Observe a list of Array items.
   *
   * @param {Array} items
   */

  Observer.prototype.observeArray = function (items) {
    for (var i = 0, l = items.length; i < l; i++) {
      observe(items[i]);
    }
  };

  /**
   * Convert a property into getter/setter so we can emit
   * the events when the property is accessed/changed.
   *
   * @param {String} key
   * @param {*} val
   */

  Observer.prototype.convert = function (key, val) {
    defineReactive(this.value, key, val);
  };

  /**
   * Add an owner vm, so that when $set/$delete mutations
   * happen we can notify owner vms to proxy the keys and
   * digest the watchers. This is only called when the object
   * is observed as an instance's root $data.
   *
   * @param {Vue} vm
   */

  Observer.prototype.addVm = function (vm) {
    (this.vms || (this.vms = [])).push(vm);
  };

  /**
   * Remove an owner vm. This is called when the object is
   * swapped out as an instance's $data object.
   *
   * @param {Vue} vm
   */

  Observer.prototype.removeVm = function (vm) {
    this.vms.$remove(vm);
  };

  // helpers

  /**
   * Augment an target Object or Array by intercepting
   * the prototype chain using __proto__
   *
   * @param {Object|Array} target
   * @param {Object} src
   */

  function protoAugment(target, src) {
    /* eslint-disable no-proto */
    target.__proto__ = src;
    /* eslint-enable no-proto */
  }

  /**
   * Augment an target Object or Array by defining
   * hidden properties.
   *
   * @param {Object|Array} target
   * @param {Object} proto
   */

  function copyAugment(target, src, keys) {
    for (var i = 0, l = keys.length; i < l; i++) {
      var key = keys[i];
      def(target, key, src[key]);
    }
  }

  /**
   * Attempt to create an observer instance for a value,
   * returns the new observer if successfully observed,
   * or the existing observer if the value already has one.
   *
   * @param {*} value
   * @param {Vue} [vm]
   * @return {Observer|undefined}
   * @static
   */

  function observe(value, vm) {
    if (!value || typeof value !== 'object') {
      return;
    }
    var ob;
    if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
      ob = value.__ob__;
    } else if (shouldConvert && (isArray(value) || isPlainObject(value)) && Object.isExtensible(value) && !value._isVue) {
      ob = new Observer(value);
    }
    if (ob && vm) {
      ob.addVm(vm);
    }
    return ob;
  }

  /**
   * Define a reactive property on an Object.
   *
   * @param {Object} obj
   * @param {String} key
   * @param {*} val
   */

  function defineReactive(obj, key, val) {
    var dep = new Dep();

    var property = Object.getOwnPropertyDescriptor(obj, key);
    if (property && property.configurable === false) {
      return;
    }

    // cater for pre-defined getter/setters
    var getter = property && property.get;
    var setter = property && property.set;

    var childOb = observe(val);
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get: function reactiveGetter() {
        var value = getter ? getter.call(obj) : val;
        if (Dep.target) {
          dep.depend();
          if (childOb) {
            childOb.dep.depend();
          }
          if (isArray(value)) {
            for (var e, i = 0, l = value.length; i < l; i++) {
              e = value[i];
              e && e.__ob__ && e.__ob__.dep.depend();
            }
          }
        }
        return value;
      },
      set: function reactiveSetter(newVal) {
        var value = getter ? getter.call(obj) : val;
        if (newVal === value) {
          return;
        }
        if (setter) {
          setter.call(obj, newVal);
        } else {
          val = newVal;
        }
        childOb = observe(newVal);
        dep.notify();
      }
    });
  }



  var util = Object.freeze({
  	defineReactive: defineReactive,
  	set: set,
  	del: del,
  	hasOwn: hasOwn,
  	isLiteral: isLiteral,
  	isReserved: isReserved,
  	_toString: _toString,
  	toNumber: toNumber,
  	toBoolean: toBoolean,
  	stripQuotes: stripQuotes,
  	camelize: camelize,
  	hyphenate: hyphenate,
  	classify: classify,
  	bind: bind,
  	toArray: toArray,
  	extend: extend,
  	isObject: isObject,
  	isPlainObject: isPlainObject,
  	def: def,
  	debounce: _debounce,
  	indexOf: indexOf,
  	cancellable: cancellable,
  	looseEqual: looseEqual,
  	isArray: isArray,
  	hasProto: hasProto,
  	inBrowser: inBrowser,
  	devtools: devtools,
  	isIE: isIE,
  	isIE9: isIE9,
  	isAndroid: isAndroid,
  	isIos: isIos,
  	iosVersionMatch: iosVersionMatch,
  	iosVersion: iosVersion,
  	hasMutationObserverBug: hasMutationObserverBug,
  	get transitionProp () { return transitionProp; },
  	get transitionEndEvent () { return transitionEndEvent; },
  	get animationProp () { return animationProp; },
  	get animationEndEvent () { return animationEndEvent; },
  	nextTick: nextTick,
  	get _Set () { return _Set; },
  	query: query,
  	inDoc: inDoc,
  	getAttr: getAttr,
  	getBindAttr: getBindAttr,
  	hasBindAttr: hasBindAttr,
  	before: before,
  	after: after,
  	remove: remove,
  	prepend: prepend,
  	replace: replace,
  	on: on,
  	off: off,
  	setClass: setClass,
  	addClass: addClass,
  	removeClass: removeClass,
  	extractContent: extractContent,
  	trimNode: trimNode,
  	isTemplate: isTemplate,
  	createAnchor: createAnchor,
  	findRef: findRef,
  	mapNodeRange: mapNodeRange,
  	removeNodeRange: removeNodeRange,
  	isFragment: isFragment,
  	getOuterHTML: getOuterHTML,
  	mergeOptions: mergeOptions,
  	resolveAsset: resolveAsset,
  	checkComponentAttr: checkComponentAttr,
  	commonTagRE: commonTagRE,
  	reservedTagRE: reservedTagRE,
  	get warn () { return warn; }
  });

  var uid = 0;

  function initMixin (Vue) {
    /**
     * The main init sequence. This is called for every
     * instance, including ones that are created from extended
     * constructors.
     *
     * @param {Object} options - this options object should be
     *                           the result of merging class
     *                           options and the options passed
     *                           in to the constructor.
     */

    Vue.prototype._init = function (options) {
      options = options || {};

      this.$el = null;
      this.$parent = options.parent;
      this.$root = this.$parent ? this.$parent.$root : this;
      this.$children = [];
      this.$refs = {}; // child vm references
      this.$els = {}; // element references
      this._watchers = []; // all watchers as an array
      this._directives = []; // all directives

      // a uid
      this._uid = uid++;

      // a flag to avoid this being observed
      this._isVue = true;

      // events bookkeeping
      this._events = {}; // registered callbacks
      this._eventsCount = {}; // for $broadcast optimization

      // fragment instance properties
      this._isFragment = false;
      this._fragment = // @type {DocumentFragment}
      this._fragmentStart = // @type {Text|Comment}
      this._fragmentEnd = null; // @type {Text|Comment}

      // lifecycle state
      this._isCompiled = this._isDestroyed = this._isReady = this._isAttached = this._isBeingDestroyed = this._vForRemoving = false;
      this._unlinkFn = null;

      // context:
      // if this is a transcluded component, context
      // will be the common parent vm of this instance
      // and its host.
      this._context = options._context || this.$parent;

      // scope:
      // if this is inside an inline v-for, the scope
      // will be the intermediate scope created for this
      // repeat fragment. this is used for linking props
      // and container directives.
      this._scope = options._scope;

      // fragment:
      // if this instance is compiled inside a Fragment, it
      // needs to reigster itself as a child of that fragment
      // for attach/detach to work properly.
      this._frag = options._frag;
      if (this._frag) {
        this._frag.children.push(this);
      }

      // push self into parent / transclusion host
      if (this.$parent) {
        this.$parent.$children.push(this);
      }

      // merge options.
      options = this.$options = mergeOptions(this.constructor.options, options, this);

      // set ref
      this._updateRef();

      // initialize data as empty object.
      // it will be filled up in _initData().
      this._data = {};

      // call init hook
      this._callHook('init');

      // initialize data observation and scope inheritance.
      this._initState();

      // setup event system and option events.
      this._initEvents();

      // call created hook
      this._callHook('created');

      // if `el` option is passed, start compilation.
      if (options.el) {
        this.$mount(options.el);
      }
    };
  }

  var pathCache = new Cache(1000);

  // actions
  var APPEND = 0;
  var PUSH = 1;
  var INC_SUB_PATH_DEPTH = 2;
  var PUSH_SUB_PATH = 3;

  // states
  var BEFORE_PATH = 0;
  var IN_PATH = 1;
  var BEFORE_IDENT = 2;
  var IN_IDENT = 3;
  var IN_SUB_PATH = 4;
  var IN_SINGLE_QUOTE = 5;
  var IN_DOUBLE_QUOTE = 6;
  var AFTER_PATH = 7;
  var ERROR = 8;

  var pathStateMachine = [];

  pathStateMachine[BEFORE_PATH] = {
    'ws': [BEFORE_PATH],
    'ident': [IN_IDENT, APPEND],
    '[': [IN_SUB_PATH],
    'eof': [AFTER_PATH]
  };

  pathStateMachine[IN_PATH] = {
    'ws': [IN_PATH],
    '.': [BEFORE_IDENT],
    '[': [IN_SUB_PATH],
    'eof': [AFTER_PATH]
  };

  pathStateMachine[BEFORE_IDENT] = {
    'ws': [BEFORE_IDENT],
    'ident': [IN_IDENT, APPEND]
  };

  pathStateMachine[IN_IDENT] = {
    'ident': [IN_IDENT, APPEND],
    '0': [IN_IDENT, APPEND],
    'number': [IN_IDENT, APPEND],
    'ws': [IN_PATH, PUSH],
    '.': [BEFORE_IDENT, PUSH],
    '[': [IN_SUB_PATH, PUSH],
    'eof': [AFTER_PATH, PUSH]
  };

  pathStateMachine[IN_SUB_PATH] = {
    "'": [IN_SINGLE_QUOTE, APPEND],
    '"': [IN_DOUBLE_QUOTE, APPEND],
    '[': [IN_SUB_PATH, INC_SUB_PATH_DEPTH],
    ']': [IN_PATH, PUSH_SUB_PATH],
    'eof': ERROR,
    'else': [IN_SUB_PATH, APPEND]
  };

  pathStateMachine[IN_SINGLE_QUOTE] = {
    "'": [IN_SUB_PATH, APPEND],
    'eof': ERROR,
    'else': [IN_SINGLE_QUOTE, APPEND]
  };

  pathStateMachine[IN_DOUBLE_QUOTE] = {
    '"': [IN_SUB_PATH, APPEND],
    'eof': ERROR,
    'else': [IN_DOUBLE_QUOTE, APPEND]
  };

  /**
   * Determine the type of a character in a keypath.
   *
   * @param {Char} ch
   * @return {String} type
   */

  function getPathCharType(ch) {
    if (ch === undefined) {
      return 'eof';
    }

    var code = ch.charCodeAt(0);

    switch (code) {
      case 0x5B: // [
      case 0x5D: // ]
      case 0x2E: // .
      case 0x22: // "
      case 0x27: // '
      case 0x30:
        // 0
        return ch;

      case 0x5F: // _
      case 0x24:
        // $
        return 'ident';

      case 0x20: // Space
      case 0x09: // Tab
      case 0x0A: // Newline
      case 0x0D: // Return
      case 0xA0: // No-break space
      case 0xFEFF: // Byte Order Mark
      case 0x2028: // Line Separator
      case 0x2029:
        // Paragraph Separator
        return 'ws';
    }

    // a-z, A-Z
    if (code >= 0x61 && code <= 0x7A || code >= 0x41 && code <= 0x5A) {
      return 'ident';
    }

    // 1-9
    if (code >= 0x31 && code <= 0x39) {
      return 'number';
    }

    return 'else';
  }

  /**
   * Format a subPath, return its plain form if it is
   * a literal string or number. Otherwise prepend the
   * dynamic indicator (*).
   *
   * @param {String} path
   * @return {String}
   */

  function formatSubPath(path) {
    var trimmed = path.trim();
    // invalid leading 0
    if (path.charAt(0) === '0' && isNaN(path)) {
      return false;
    }
    return isLiteral(trimmed) ? stripQuotes(trimmed) : '*' + trimmed;
  }

  /**
   * Parse a string path into an array of segments
   *
   * @param {String} path
   * @return {Array|undefined}
   */

  function parse(path) {
    var keys = [];
    var index = -1;
    var mode = BEFORE_PATH;
    var subPathDepth = 0;
    var c, newChar, key, type, transition, action, typeMap;

    var actions = [];

    actions[PUSH] = function () {
      if (key !== undefined) {
        keys.push(key);
        key = undefined;
      }
    };

    actions[APPEND] = function () {
      if (key === undefined) {
        key = newChar;
      } else {
        key += newChar;
      }
    };

    actions[INC_SUB_PATH_DEPTH] = function () {
      actions[APPEND]();
      subPathDepth++;
    };

    actions[PUSH_SUB_PATH] = function () {
      if (subPathDepth > 0) {
        subPathDepth--;
        mode = IN_SUB_PATH;
        actions[APPEND]();
      } else {
        subPathDepth = 0;
        key = formatSubPath(key);
        if (key === false) {
          return false;
        } else {
          actions[PUSH]();
        }
      }
    };

    function maybeUnescapeQuote() {
      var nextChar = path[index + 1];
      if (mode === IN_SINGLE_QUOTE && nextChar === "'" || mode === IN_DOUBLE_QUOTE && nextChar === '"') {
        index++;
        newChar = '\\' + nextChar;
        actions[APPEND]();
        return true;
      }
    }

    while (mode != null) {
      index++;
      c = path[index];

      if (c === '\\' && maybeUnescapeQuote()) {
        continue;
      }

      type = getPathCharType(c);
      typeMap = pathStateMachine[mode];
      transition = typeMap[type] || typeMap['else'] || ERROR;

      if (transition === ERROR) {
        return; // parse error
      }

      mode = transition[0];
      action = actions[transition[1]];
      if (action) {
        newChar = transition[2];
        newChar = newChar === undefined ? c : newChar;
        if (action() === false) {
          return;
        }
      }

      if (mode === AFTER_PATH) {
        keys.raw = path;
        return keys;
      }
    }
  }

  /**
   * External parse that check for a cache hit first
   *
   * @param {String} path
   * @return {Array|undefined}
   */

  function parsePath(path) {
    var hit = pathCache.get(path);
    if (!hit) {
      hit = parse(path);
      if (hit) {
        pathCache.put(path, hit);
      }
    }
    return hit;
  }

  /**
   * Get from an object from a path string
   *
   * @param {Object} obj
   * @param {String} path
   */

  function getPath(obj, path) {
    return parseExpression(path).get(obj);
  }

  /**
   * Warn against setting non-existent root path on a vm.
   */

  var warnNonExistent;
  if ('development' !== 'production') {
    warnNonExistent = function (path, vm) {
      warn('You are setting a non-existent path "' + path.raw + '" ' + 'on a vm instance. Consider pre-initializing the property ' + 'with the "data" option for more reliable reactivity ' + 'and better performance.', vm);
    };
  }

  /**
   * Set on an object from a path
   *
   * @param {Object} obj
   * @param {String | Array} path
   * @param {*} val
   */

  function setPath(obj, path, val) {
    var original = obj;
    if (typeof path === 'string') {
      path = parse(path);
    }
    if (!path || !isObject(obj)) {
      return false;
    }
    var last, key;
    for (var i = 0, l = path.length; i < l; i++) {
      last = obj;
      key = path[i];
      if (key.charAt(0) === '*') {
        key = parseExpression(key.slice(1)).get.call(original, original);
      }
      if (i < l - 1) {
        obj = obj[key];
        if (!isObject(obj)) {
          obj = {};
          if ('development' !== 'production' && last._isVue) {
            warnNonExistent(path, last);
          }
          set(last, key, obj);
        }
      } else {
        if (isArray(obj)) {
          obj.$set(key, val);
        } else if (key in obj) {
          obj[key] = val;
        } else {
          if ('development' !== 'production' && obj._isVue) {
            warnNonExistent(path, obj);
          }
          set(obj, key, val);
        }
      }
    }
    return true;
  }

var path = Object.freeze({
    parsePath: parsePath,
    getPath: getPath,
    setPath: setPath
  });

  var expressionCache = new Cache(1000);

  var allowedKeywords = 'Math,Date,this,true,false,null,undefined,Infinity,NaN,' + 'isNaN,isFinite,decodeURI,decodeURIComponent,encodeURI,' + 'encodeURIComponent,parseInt,parseFloat';
  var allowedKeywordsRE = new RegExp('^(' + allowedKeywords.replace(/,/g, '\\b|') + '\\b)');

  // keywords that don't make sense inside expressions
  var improperKeywords = 'break,case,class,catch,const,continue,debugger,default,' + 'delete,do,else,export,extends,finally,for,function,if,' + 'import,in,instanceof,let,return,super,switch,throw,try,' + 'var,while,with,yield,enum,await,implements,package,' + 'protected,static,interface,private,public';
  var improperKeywordsRE = new RegExp('^(' + improperKeywords.replace(/,/g, '\\b|') + '\\b)');

  var wsRE = /\s/g;
  var newlineRE = /\n/g;
  var saveRE = /[\{,]\s*[\w\$_]+\s*:|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`)|new |typeof |void /g;
  var restoreRE = /"(\d+)"/g;
  var pathTestRE = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\]|\[[A-Za-z_$][\w$]*\])*$/;
  var identRE = /[^\w$\.](?:[A-Za-z_$][\w$]*)/g;
  var literalValueRE$1 = /^(?:true|false|null|undefined|Infinity|NaN)$/;

  function noop() {}

  /**
   * Save / Rewrite / Restore
   *
   * When rewriting paths found in an expression, it is
   * possible for the same letter sequences to be found in
   * strings and Object literal property keys. Therefore we
   * remove and store these parts in a temporary array, and
   * restore them after the path rewrite.
   */

  var saved = [];

  /**
   * Save replacer
   *
   * The save regex can match two possible cases:
   * 1. An opening object literal
   * 2. A string
   * If matched as a plain string, we need to escape its
   * newlines, since the string needs to be preserved when
   * generating the function body.
   *
   * @param {String} str
   * @param {String} isString - str if matched as a string
   * @return {String} - placeholder with index
   */

  function save(str, isString) {
    var i = saved.length;
    saved[i] = isString ? str.replace(newlineRE, '\\n') : str;
    return '"' + i + '"';
  }

  /**
   * Path rewrite replacer
   *
   * @param {String} raw
   * @return {String}
   */

  function rewrite(raw) {
    var c = raw.charAt(0);
    var path = raw.slice(1);
    if (allowedKeywordsRE.test(path)) {
      return raw;
    } else {
      path = path.indexOf('"') > -1 ? path.replace(restoreRE, restore) : path;
      return c + 'scope.' + path;
    }
  }

  /**
   * Restore replacer
   *
   * @param {String} str
   * @param {String} i - matched save index
   * @return {String}
   */

  function restore(str, i) {
    return saved[i];
  }

  /**
   * Rewrite an expression, prefixing all path accessors with
   * `scope.` and generate getter/setter functions.
   *
   * @param {String} exp
   * @return {Function}
   */

  function compileGetter(exp) {
    if (improperKeywordsRE.test(exp)) {
      'development' !== 'production' && warn('Avoid using reserved keywords in expression: ' + exp);
    }
    // reset state
    saved.length = 0;
    // save strings and object literal keys
    var body = exp.replace(saveRE, save).replace(wsRE, '');
    // rewrite all paths
    // pad 1 space here because the regex matches 1 extra char
    body = (' ' + body).replace(identRE, rewrite).replace(restoreRE, restore);
    return makeGetterFn(body);
  }

  /**
   * Build a getter function. Requires eval.
   *
   * We isolate the try/catch so it doesn't affect the
   * optimization of the parse function when it is not called.
   *
   * @param {String} body
   * @return {Function|undefined}
   */

  function makeGetterFn(body) {
    try {
      /* eslint-disable no-new-func */
      return new Function('scope', 'return ' + body + ';');
      /* eslint-enable no-new-func */
    } catch (e) {
      if ('development' !== 'production') {
        /* istanbul ignore if */
        if (e.toString().match(/unsafe-eval|CSP/)) {
          warn('It seems you are using the default build of Vue.js in an environment ' + 'with Content Security Policy that prohibits unsafe-eval. ' + 'Use the CSP-compliant build instead: ' + 'http://vuejs.org/guide/installation.html#CSP-compliant-build');
        } else {
          warn('Invalid expression. ' + 'Generated function body: ' + body);
        }
      }
      return noop;
    }
  }

  /**
   * Compile a setter function for the expression.
   *
   * @param {String} exp
   * @return {Function|undefined}
   */

  function compileSetter(exp) {
    var path = parsePath(exp);
    if (path) {
      return function (scope, val) {
        setPath(scope, path, val);
      };
    } else {
      'development' !== 'production' && warn('Invalid setter expression: ' + exp);
    }
  }

  /**
   * Parse an expression into re-written getter/setters.
   *
   * @param {String} exp
   * @param {Boolean} needSet
   * @return {Function}
   */

  function parseExpression(exp, needSet) {
    exp = exp.trim();
    // try cache
    var hit = expressionCache.get(exp);
    if (hit) {
      if (needSet && !hit.set) {
        hit.set = compileSetter(hit.exp);
      }
      return hit;
    }
    var res = { exp: exp };
    res.get = isSimplePath(exp) && exp.indexOf('[') < 0
    // optimized super simple getter
    ? makeGetterFn('scope.' + exp)
    // dynamic getter
    : compileGetter(exp);
    if (needSet) {
      res.set = compileSetter(exp);
    }
    expressionCache.put(exp, res);
    return res;
  }

  /**
   * Check if an expression is a simple path.
   *
   * @param {String} exp
   * @return {Boolean}
   */

  function isSimplePath(exp) {
    return pathTestRE.test(exp) &&
    // don't treat literal values as paths
    !literalValueRE$1.test(exp) &&
    // Math constants e.g. Math.PI, Math.E etc.
    exp.slice(0, 5) !== 'Math.';
  }

var expression = Object.freeze({
    parseExpression: parseExpression,
    isSimplePath: isSimplePath
  });

  // we have two separate queues: one for directive updates
  // and one for user watcher registered via $watch().
  // we want to guarantee directive updates to be called
  // before user watchers so that when user watchers are
  // triggered, the DOM would have already been in updated
  // state.

  var queue = [];
  var userQueue = [];
  var has = {};
  var circular = {};
  var waiting = false;

  /**
   * Reset the batcher's state.
   */

  function resetBatcherState() {
    queue.length = 0;
    userQueue.length = 0;
    has = {};
    circular = {};
    waiting = false;
  }

  /**
   * Flush both queues and run the watchers.
   */

  function flushBatcherQueue() {
    var _again = true;

    _function: while (_again) {
      _again = false;

      runBatcherQueue(queue);
      runBatcherQueue(userQueue);
      // user watchers triggered more watchers,
      // keep flushing until it depletes
      if (queue.length) {
        _again = true;
        continue _function;
      }
      // dev tool hook
      /* istanbul ignore if */
      if (devtools && config.devtools) {
        devtools.emit('flush');
      }
      resetBatcherState();
    }
  }

  /**
   * Run the watchers in a single queue.
   *
   * @param {Array} queue
   */

  function runBatcherQueue(queue) {
    // do not cache length because more watchers might be pushed
    // as we run existing watchers
    for (var i = 0; i < queue.length; i++) {
      var watcher = queue[i];
      var id = watcher.id;
      has[id] = null;
      watcher.run();
      // in dev build, check and stop circular updates.
      if ('development' !== 'production' && has[id] != null) {
        circular[id] = (circular[id] || 0) + 1;
        if (circular[id] > config._maxUpdateCount) {
          warn('You may have an infinite update loop for watcher ' + 'with expression "' + watcher.expression + '"', watcher.vm);
          break;
        }
      }
    }
    queue.length = 0;
  }

  /**
   * Push a watcher into the watcher queue.
   * Jobs with duplicate IDs will be skipped unless it's
   * pushed when the queue is being flushed.
   *
   * @param {Watcher} watcher
   *   properties:
   *   - {Number} id
   *   - {Function} run
   */

  function pushWatcher(watcher) {
    var id = watcher.id;
    if (has[id] == null) {
      // push watcher into appropriate queue
      var q = watcher.user ? userQueue : queue;
      has[id] = q.length;
      q.push(watcher);
      // queue the flush
      if (!waiting) {
        waiting = true;
        nextTick(flushBatcherQueue);
      }
    }
  }

  var uid$2 = 0;

  /**
   * A watcher parses an expression, collects dependencies,
   * and fires callback when the expression value changes.
   * This is used for both the $watch() api and directives.
   *
   * @param {Vue} vm
   * @param {String|Function} expOrFn
   * @param {Function} cb
   * @param {Object} options
   *                 - {Array} filters
   *                 - {Boolean} twoWay
   *                 - {Boolean} deep
   *                 - {Boolean} user
   *                 - {Boolean} sync
   *                 - {Boolean} lazy
   *                 - {Function} [preProcess]
   *                 - {Function} [postProcess]
   * @constructor
   */
  function Watcher(vm, expOrFn, cb, options) {
    // mix in options
    if (options) {
      extend(this, options);
    }
    var isFn = typeof expOrFn === 'function';
    this.vm = vm;
    vm._watchers.push(this);
    this.expression = expOrFn;
    this.cb = cb;
    this.id = ++uid$2; // uid for batching
    this.active = true;
    this.dirty = this.lazy; // for lazy watchers
    this.deps = [];
    this.newDeps = [];
    this.depIds = new _Set();
    this.newDepIds = new _Set();
    this.prevError = null; // for async error stacks
    // parse expression for getter/setter
    if (isFn) {
      this.getter = expOrFn;
      this.setter = undefined;
    } else {
      var res = parseExpression(expOrFn, this.twoWay);
      this.getter = res.get;
      this.setter = res.set;
    }
    this.value = this.lazy ? undefined : this.get();
    // state for avoiding false triggers for deep and Array
    // watchers during vm._digest()
    this.queued = this.shallow = false;
  }

  /**
   * Evaluate the getter, and re-collect dependencies.
   */

  Watcher.prototype.get = function () {
    this.beforeGet();
    var scope = this.scope || this.vm;
    var value;
    try {
      value = this.getter.call(scope, scope);
    } catch (e) {
      if ('development' !== 'production' && config.warnExpressionErrors) {
        warn('Error when evaluating expression ' + '"' + this.expression + '": ' + e.toString(), this.vm);
      }
    }
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    if (this.preProcess) {
      value = this.preProcess(value);
    }
    if (this.filters) {
      value = scope._applyFilters(value, null, this.filters, false);
    }
    if (this.postProcess) {
      value = this.postProcess(value);
    }
    this.afterGet();
    return value;
  };

  /**
   * Set the corresponding value with the setter.
   *
   * @param {*} value
   */

  Watcher.prototype.set = function (value) {
    var scope = this.scope || this.vm;
    if (this.filters) {
      value = scope._applyFilters(value, this.value, this.filters, true);
    }
    try {
      this.setter.call(scope, scope, value);
    } catch (e) {
      if ('development' !== 'production' && config.warnExpressionErrors) {
        warn('Error when evaluating setter ' + '"' + this.expression + '": ' + e.toString(), this.vm);
      }
    }
    // two-way sync for v-for alias
    var forContext = scope.$forContext;
    if (forContext && forContext.alias === this.expression) {
      if (forContext.filters) {
        'development' !== 'production' && warn('It seems you are using two-way binding on ' + 'a v-for alias (' + this.expression + '), and the ' + 'v-for has filters. This will not work properly. ' + 'Either remove the filters or use an array of ' + 'objects and bind to object properties instead.', this.vm);
        return;
      }
      forContext._withLock(function () {
        if (scope.$key) {
          // original is an object
          forContext.rawValue[scope.$key] = value;
        } else {
          forContext.rawValue.$set(scope.$index, value);
        }
      });
    }
  };

  /**
   * Prepare for dependency collection.
   */

  Watcher.prototype.beforeGet = function () {
    Dep.target = this;
  };

  /**
   * Add a dependency to this directive.
   *
   * @param {Dep} dep
   */

  Watcher.prototype.addDep = function (dep) {
    var id = dep.id;
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id);
      this.newDeps.push(dep);
      if (!this.depIds.has(id)) {
        dep.addSub(this);
      }
    }
  };

  /**
   * Clean up for dependency collection.
   */

  Watcher.prototype.afterGet = function () {
    Dep.target = null;
    var i = this.deps.length;
    while (i--) {
      var dep = this.deps[i];
      if (!this.newDepIds.has(dep.id)) {
        dep.removeSub(this);
      }
    }
    var tmp = this.depIds;
    this.depIds = this.newDepIds;
    this.newDepIds = tmp;
    this.newDepIds.clear();
    tmp = this.deps;
    this.deps = this.newDeps;
    this.newDeps = tmp;
    this.newDeps.length = 0;
  };

  /**
   * Subscriber interface.
   * Will be called when a dependency changes.
   *
   * @param {Boolean} shallow
   */

  Watcher.prototype.update = function (shallow) {
    if (this.lazy) {
      this.dirty = true;
    } else if (this.sync || !config.async) {
      this.run();
    } else {
      // if queued, only overwrite shallow with non-shallow,
      // but not the other way around.
      this.shallow = this.queued ? shallow ? this.shallow : false : !!shallow;
      this.queued = true;
      // record before-push error stack in debug mode
      /* istanbul ignore if */
      if ('development' !== 'production' && config.debug) {
        this.prevError = new Error('[vue] async stack trace');
      }
      pushWatcher(this);
    }
  };

  /**
   * Batcher job interface.
   * Will be called by the batcher.
   */

  Watcher.prototype.run = function () {
    if (this.active) {
      var value = this.get();
      if (value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated; but only do so if this is a
      // non-shallow update (caused by a vm digest).
      (isObject(value) || this.deep) && !this.shallow) {
        // set new value
        var oldValue = this.value;
        this.value = value;
        // in debug + async mode, when a watcher callbacks
        // throws, we also throw the saved before-push error
        // so the full cross-tick stack trace is available.
        var prevError = this.prevError;
        /* istanbul ignore if */
        if ('development' !== 'production' && config.debug && prevError) {
          this.prevError = null;
          try {
            this.cb.call(this.vm, value, oldValue);
          } catch (e) {
            nextTick(function () {
              throw prevError;
            }, 0);
            throw e;
          }
        } else {
          this.cb.call(this.vm, value, oldValue);
        }
      }
      this.queued = this.shallow = false;
    }
  };

  /**
   * Evaluate the value of the watcher.
   * This only gets called for lazy watchers.
   */

  Watcher.prototype.evaluate = function () {
    // avoid overwriting another watcher that is being
    // collected.
    var current = Dep.target;
    this.value = this.get();
    this.dirty = false;
    Dep.target = current;
  };

  /**
   * Depend on all deps collected by this watcher.
   */

  Watcher.prototype.depend = function () {
    var i = this.deps.length;
    while (i--) {
      this.deps[i].depend();
    }
  };

  /**
   * Remove self from all dependencies' subcriber list.
   */

  Watcher.prototype.teardown = function () {
    if (this.active) {
      // remove self from vm's watcher list
      // this is a somewhat expensive operation so we skip it
      // if the vm is being destroyed or is performing a v-for
      // re-render (the watcher list is then filtered by v-for).
      if (!this.vm._isBeingDestroyed && !this.vm._vForRemoving) {
        this.vm._watchers.$remove(this);
      }
      var i = this.deps.length;
      while (i--) {
        this.deps[i].removeSub(this);
      }
      this.active = false;
      this.vm = this.cb = this.value = null;
    }
  };

  /**
   * Recrusively traverse an object to evoke all converted
   * getters, so that every nested property inside the object
   * is collected as a "deep" dependency.
   *
   * @param {*} val
   */

  var seenObjects = new _Set();
  function traverse(val, seen) {
    var i = undefined,
        keys = undefined;
    if (!seen) {
      seen = seenObjects;
      seen.clear();
    }
    var isA = isArray(val);
    var isO = isObject(val);
    if ((isA || isO) && Object.isExtensible(val)) {
      if (val.__ob__) {
        var depId = val.__ob__.dep.id;
        if (seen.has(depId)) {
          return;
        } else {
          seen.add(depId);
        }
      }
      if (isA) {
        i = val.length;
        while (i--) traverse(val[i], seen);
      } else if (isO) {
        keys = Object.keys(val);
        i = keys.length;
        while (i--) traverse(val[keys[i]], seen);
      }
    }
  }

  var text$1 = {

    bind: function bind() {
      this.attr = this.el.nodeType === 3 ? 'data' : 'textContent';
    },

    update: function update(value) {
      this.el[this.attr] = _toString(value);
    }
  };

  var templateCache = new Cache(1000);
  var idSelectorCache = new Cache(1000);

  var map = {
    efault: [0, '', ''],
    legend: [1, '<fieldset>', '</fieldset>'],
    tr: [2, '<table><tbody>', '</tbody></table>'],
    col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>']
  };

  map.td = map.th = [3, '<table><tbody><tr>', '</tr></tbody></table>'];

  map.option = map.optgroup = [1, '<select multiple="multiple">', '</select>'];

  map.thead = map.tbody = map.colgroup = map.caption = map.tfoot = [1, '<table>', '</table>'];

  map.g = map.defs = map.symbol = map.use = map.image = map.text = map.circle = map.ellipse = map.line = map.path = map.polygon = map.polyline = map.rect = [1, '<svg ' + 'xmlns="http://www.w3.org/2000/svg" ' + 'xmlns:xlink="http://www.w3.org/1999/xlink" ' + 'xmlns:ev="http://www.w3.org/2001/xml-events"' + 'version="1.1">', '</svg>'];

  /**
   * Check if a node is a supported template node with a
   * DocumentFragment content.
   *
   * @param {Node} node
   * @return {Boolean}
   */

  function isRealTemplate(node) {
    return isTemplate(node) && isFragment(node.content);
  }

  var tagRE$1 = /<([\w:-]+)/;
  var entityRE = /&#?\w+?;/;
  var commentRE = /<!--/;

  /**
   * Convert a string template to a DocumentFragment.
   * Determines correct wrapping by tag types. Wrapping
   * strategy found in jQuery & component/domify.
   *
   * @param {String} templateString
   * @param {Boolean} raw
   * @return {DocumentFragment}
   */

  function stringToFragment(templateString, raw) {
    // try a cache hit first
    var cacheKey = raw ? templateString : templateString.trim();
    var hit = templateCache.get(cacheKey);
    if (hit) {
      return hit;
    }

    var frag = document.createDocumentFragment();
    var tagMatch = templateString.match(tagRE$1);
    var entityMatch = entityRE.test(templateString);
    var commentMatch = commentRE.test(templateString);

    if (!tagMatch && !entityMatch && !commentMatch) {
      // text only, return a single text node.
      frag.appendChild(document.createTextNode(templateString));
    } else {
      var tag = tagMatch && tagMatch[1];
      var wrap = map[tag] || map.efault;
      var depth = wrap[0];
      var prefix = wrap[1];
      var suffix = wrap[2];
      var node = document.createElement('div');

      node.innerHTML = prefix + templateString + suffix;
      while (depth--) {
        node = node.lastChild;
      }

      var child;
      /* eslint-disable no-cond-assign */
      while (child = node.firstChild) {
        /* eslint-enable no-cond-assign */
        frag.appendChild(child);
      }
    }
    if (!raw) {
      trimNode(frag);
    }
    templateCache.put(cacheKey, frag);
    return frag;
  }

  /**
   * Convert a template node to a DocumentFragment.
   *
   * @param {Node} node
   * @return {DocumentFragment}
   */

  function nodeToFragment(node) {
    // if its a template tag and the browser supports it,
    // its content is already a document fragment. However, iOS Safari has
    // bug when using directly cloned template content with touch
    // events and can cause crashes when the nodes are removed from DOM, so we
    // have to treat template elements as string templates. (#2805)
    /* istanbul ignore if */
    if (isRealTemplate(node)) {
      return stringToFragment(node.innerHTML);
    }
    // script template
    if (node.tagName === 'SCRIPT') {
      return stringToFragment(node.textContent);
    }
    // normal node, clone it to avoid mutating the original
    var clonedNode = cloneNode(node);
    var frag = document.createDocumentFragment();
    var child;
    /* eslint-disable no-cond-assign */
    while (child = clonedNode.firstChild) {
      /* eslint-enable no-cond-assign */
      frag.appendChild(child);
    }
    trimNode(frag);
    return frag;
  }

  // Test for the presence of the Safari template cloning bug
  // https://bugs.webkit.org/showug.cgi?id=137755
  var hasBrokenTemplate = (function () {
    /* istanbul ignore else */
    if (inBrowser) {
      var a = document.createElement('div');
      a.innerHTML = '<template>1</template>';
      return !a.cloneNode(true).firstChild.innerHTML;
    } else {
      return false;
    }
  })();

  // Test for IE10/11 textarea placeholder clone bug
  var hasTextareaCloneBug = (function () {
    /* istanbul ignore else */
    if (inBrowser) {
      var t = document.createElement('textarea');
      t.placeholder = 't';
      return t.cloneNode(true).value === 't';
    } else {
      return false;
    }
  })();

  /**
   * 1. Deal with Safari cloning nested <template> bug by
   *    manually cloning all template instances.
   * 2. Deal with IE10/11 textarea placeholder bug by setting
   *    the correct value after cloning.
   *
   * @param {Element|DocumentFragment} node
   * @return {Element|DocumentFragment}
   */

  function cloneNode(node) {
    /* istanbul ignore if */
    if (!node.querySelectorAll) {
      return node.cloneNode();
    }
    var res = node.cloneNode(true);
    var i, original, cloned;
    /* istanbul ignore if */
    if (hasBrokenTemplate) {
      var tempClone = res;
      if (isRealTemplate(node)) {
        node = node.content;
        tempClone = res.content;
      }
      original = node.querySelectorAll('template');
      if (original.length) {
        cloned = tempClone.querySelectorAll('template');
        i = cloned.length;
        while (i--) {
          cloned[i].parentNode.replaceChild(cloneNode(original[i]), cloned[i]);
        }
      }
    }
    /* istanbul ignore if */
    if (hasTextareaCloneBug) {
      if (node.tagName === 'TEXTAREA') {
        res.value = node.value;
      } else {
        original = node.querySelectorAll('textarea');
        if (original.length) {
          cloned = res.querySelectorAll('textarea');
          i = cloned.length;
          while (i--) {
            cloned[i].value = original[i].value;
          }
        }
      }
    }
    return res;
  }

  /**
   * Process the template option and normalizes it into a
   * a DocumentFragment that can be used as a partial or a
   * instance template.
   *
   * @param {*} template
   *        Possible values include:
   *        - DocumentFragment object
   *        - Node object of type Template
   *        - id selector: '#some-template-id'
   *        - template string: '<div><span>{{msg}}</span></div>'
   * @param {Boolean} shouldClone
   * @param {Boolean} raw
   *        inline HTML interpolation. Do not check for id
   *        selector and keep whitespace in the string.
   * @return {DocumentFragment|undefined}
   */

  function parseTemplate(template, shouldClone, raw) {
    var node, frag;

    // if the template is already a document fragment,
    // do nothing
    if (isFragment(template)) {
      trimNode(template);
      return shouldClone ? cloneNode(template) : template;
    }

    if (typeof template === 'string') {
      // id selector
      if (!raw && template.charAt(0) === '#') {
        // id selector can be cached too
        frag = idSelectorCache.get(template);
        if (!frag) {
          node = document.getElementById(template.slice(1));
          if (node) {
            frag = nodeToFragment(node);
            // save selector to cache
            idSelectorCache.put(template, frag);
          }
        }
      } else {
        // normal string template
        frag = stringToFragment(template, raw);
      }
    } else if (template.nodeType) {
      // a direct node
      frag = nodeToFragment(template);
    }

    return frag && shouldClone ? cloneNode(frag) : frag;
  }

var template = Object.freeze({
    cloneNode: cloneNode,
    parseTemplate: parseTemplate
  });

  var html = {

    bind: function bind() {
      // a comment node means this is a binding for
      // {{{ inline unescaped html }}}
      if (this.el.nodeType === 8) {
        // hold nodes
        this.nodes = [];
        // replace the placeholder with proper anchor
        this.anchor = createAnchor('v-html');
        replace(this.el, this.anchor);
      }
    },

    update: function update(value) {
      value = _toString(value);
      if (this.nodes) {
        this.swap(value);
      } else {
        this.el.innerHTML = value;
      }
    },

    swap: function swap(value) {
      // remove old nodes
      var i = this.nodes.length;
      while (i--) {
        remove(this.nodes[i]);
      }
      // convert new value to a fragment
      // do not attempt to retrieve from id selector
      var frag = parseTemplate(value, true, true);
      // save a reference to these nodes so we can remove later
      this.nodes = toArray(frag.childNodes);
      before(frag, this.anchor);
    }
  };

  /**
   * Abstraction for a partially-compiled fragment.
   * Can optionally compile content with a child scope.
   *
   * @param {Function} linker
   * @param {Vue} vm
   * @param {DocumentFragment} frag
   * @param {Vue} [host]
   * @param {Object} [scope]
   * @param {Fragment} [parentFrag]
   */
  function Fragment(linker, vm, frag, host, scope, parentFrag) {
    this.children = [];
    this.childFrags = [];
    this.vm = vm;
    this.scope = scope;
    this.inserted = false;
    this.parentFrag = parentFrag;
    if (parentFrag) {
      parentFrag.childFrags.push(this);
    }
    this.unlink = linker(vm, frag, host, scope, this);
    var single = this.single = frag.childNodes.length === 1 &&
    // do not go single mode if the only node is an anchor
    !frag.childNodes[0].__v_anchor;
    if (single) {
      this.node = frag.childNodes[0];
      this.before = singleBefore;
      this.remove = singleRemove;
    } else {
      this.node = createAnchor('fragment-start');
      this.end = createAnchor('fragment-end');
      this.frag = frag;
      prepend(this.node, frag);
      frag.appendChild(this.end);
      this.before = multiBefore;
      this.remove = multiRemove;
    }
    this.node.__v_frag = this;
  }

  /**
   * Call attach/detach for all components contained within
   * this fragment. Also do so recursively for all child
   * fragments.
   *
   * @param {Function} hook
   */

  Fragment.prototype.callHook = function (hook) {
    var i, l;
    for (i = 0, l = this.childFrags.length; i < l; i++) {
      this.childFrags[i].callHook(hook);
    }
    for (i = 0, l = this.children.length; i < l; i++) {
      hook(this.children[i]);
    }
  };

  /**
   * Insert fragment before target, single node version
   *
   * @param {Node} target
   * @param {Boolean} withTransition
   */

  function singleBefore(target, withTransition) {
    this.inserted = true;
    var method = withTransition !== false ? beforeWithTransition : before;
    method(this.node, target, this.vm);
    if (inDoc(this.node)) {
      this.callHook(attach);
    }
  }

  /**
   * Remove fragment, single node version
   */

  function singleRemove() {
    this.inserted = false;
    var shouldCallRemove = inDoc(this.node);
    var self = this;
    this.beforeRemove();
    removeWithTransition(this.node, this.vm, function () {
      if (shouldCallRemove) {
        self.callHook(detach);
      }
      self.destroy();
    });
  }

  /**
   * Insert fragment before target, multi-nodes version
   *
   * @param {Node} target
   * @param {Boolean} withTransition
   */

  function multiBefore(target, withTransition) {
    this.inserted = true;
    var vm = this.vm;
    var method = withTransition !== false ? beforeWithTransition : before;
    mapNodeRange(this.node, this.end, function (node) {
      method(node, target, vm);
    });
    if (inDoc(this.node)) {
      this.callHook(attach);
    }
  }

  /**
   * Remove fragment, multi-nodes version
   */

  function multiRemove() {
    this.inserted = false;
    var self = this;
    var shouldCallRemove = inDoc(this.node);
    this.beforeRemove();
    removeNodeRange(this.node, this.end, this.vm, this.frag, function () {
      if (shouldCallRemove) {
        self.callHook(detach);
      }
      self.destroy();
    });
  }

  /**
   * Prepare the fragment for removal.
   */

  Fragment.prototype.beforeRemove = function () {
    var i, l;
    for (i = 0, l = this.childFrags.length; i < l; i++) {
      // call the same method recursively on child
      // fragments, depth-first
      this.childFrags[i].beforeRemove(false);
    }
    for (i = 0, l = this.children.length; i < l; i++) {
      // Call destroy for all contained instances,
      // with remove:false and defer:true.
      // Defer is necessary because we need to
      // keep the children to call detach hooks
      // on them.
      this.children[i].$destroy(false, true);
    }
    var dirs = this.unlink.dirs;
    for (i = 0, l = dirs.length; i < l; i++) {
      // disable the watchers on all the directives
      // so that the rendered content stays the same
      // during removal.
      dirs[i]._watcher && dirs[i]._watcher.teardown();
    }
  };

  /**
   * Destroy the fragment.
   */

  Fragment.prototype.destroy = function () {
    if (this.parentFrag) {
      this.parentFrag.childFrags.$remove(this);
    }
    this.node.__v_frag = null;
    this.unlink();
  };

  /**
   * Call attach hook for a Vue instance.
   *
   * @param {Vue} child
   */

  function attach(child) {
    if (!child._isAttached && inDoc(child.$el)) {
      child._callHook('attached');
    }
  }

  /**
   * Call detach hook for a Vue instance.
   *
   * @param {Vue} child
   */

  function detach(child) {
    if (child._isAttached && !inDoc(child.$el)) {
      child._callHook('detached');
    }
  }

  var linkerCache = new Cache(5000);

  /**
   * A factory that can be used to create instances of a
   * fragment. Caches the compiled linker if possible.
   *
   * @param {Vue} vm
   * @param {Element|String} el
   */
  function FragmentFactory(vm, el) {
    this.vm = vm;
    var template;
    var isString = typeof el === 'string';
    if (isString || isTemplate(el) && !el.hasAttribute('v-if')) {
      template = parseTemplate(el, true);
    } else {
      template = document.createDocumentFragment();
      template.appendChild(el);
    }
    this.template = template;
    // linker can be cached, but only for components
    var linker;
    var cid = vm.constructor.cid;
    if (cid > 0) {
      var cacheId = cid + (isString ? el : getOuterHTML(el));
      linker = linkerCache.get(cacheId);
      if (!linker) {
        linker = compile(template, vm.$options, true);
        linkerCache.put(cacheId, linker);
      }
    } else {
      linker = compile(template, vm.$options, true);
    }
    this.linker = linker;
  }

  /**
   * Create a fragment instance with given host and scope.
   *
   * @param {Vue} host
   * @param {Object} scope
   * @param {Fragment} parentFrag
   */

  FragmentFactory.prototype.create = function (host, scope, parentFrag) {
    var frag = cloneNode(this.template);
    return new Fragment(this.linker, this.vm, frag, host, scope, parentFrag);
  };

  var ON = 700;
  var MODEL = 800;
  var BIND = 850;
  var TRANSITION = 1100;
  var EL = 1500;
  var COMPONENT = 1500;
  var PARTIAL = 1750;
  var IF = 2100;
  var FOR = 2200;
  var SLOT = 2300;

  var uid$3 = 0;

  var vFor = {

    priority: FOR,
    terminal: true,

    params: ['track-by', 'stagger', 'enter-stagger', 'leave-stagger'],

    bind: function bind() {
      // support "item in/of items" syntax
      var inMatch = this.expression.match(/(.*) (?:in|of) (.*)/);
      if (inMatch) {
        var itMatch = inMatch[1].match(/\((.*),(.*)\)/);
        if (itMatch) {
          this.iterator = itMatch[1].trim();
          this.alias = itMatch[2].trim();
        } else {
          this.alias = inMatch[1].trim();
        }
        this.expression = inMatch[2];
      }

      if (!this.alias) {
        'development' !== 'production' && warn('Invalid v-for expression "' + this.descriptor.raw + '": ' + 'alias is required.', this.vm);
        return;
      }

      // uid as a cache identifier
      this.id = '__v-for__' + ++uid$3;

      // check if this is an option list,
      // so that we know if we need to update the <select>'s
      // v-model when the option list has changed.
      // because v-model has a lower priority than v-for,
      // the v-model is not bound here yet, so we have to
      // retrive it in the actual updateModel() function.
      var tag = this.el.tagName;
      this.isOption = (tag === 'OPTION' || tag === 'OPTGROUP') && this.el.parentNode.tagName === 'SELECT';

      // setup anchor nodes
      this.start = createAnchor('v-for-start');
      this.end = createAnchor('v-for-end');
      replace(this.el, this.end);
      before(this.start, this.end);

      // cache
      this.cache = Object.create(null);

      // fragment factory
      this.factory = new FragmentFactory(this.vm, this.el);
    },

    update: function update(data) {
      this.diff(data);
      this.updateRef();
      this.updateModel();
    },

    /**
     * Diff, based on new data and old data, determine the
     * minimum amount of DOM manipulations needed to make the
     * DOM reflect the new data Array.
     *
     * The algorithm diffs the new data Array by storing a
     * hidden reference to an owner vm instance on previously
     * seen data. This allows us to achieve O(n) which is
     * better than a levenshtein distance based algorithm,
     * which is O(m * n).
     *
     * @param {Array} data
     */

    diff: function diff(data) {
      // check if the Array was converted from an Object
      var item = data[0];
      var convertedFromObject = this.fromObject = isObject(item) && hasOwn(item, '$key') && hasOwn(item, '$value');

      var trackByKey = this.params.trackBy;
      var oldFrags = this.frags;
      var frags = this.frags = new Array(data.length);
      var alias = this.alias;
      var iterator = this.iterator;
      var start = this.start;
      var end = this.end;
      var inDocument = inDoc(start);
      var init = !oldFrags;
      var i, l, frag, key, value, primitive;

      // First pass, go through the new Array and fill up
      // the new frags array. If a piece of data has a cached
      // instance for it, we reuse it. Otherwise build a new
      // instance.
      for (i = 0, l = data.length; i < l; i++) {
        item = data[i];
        key = convertedFromObject ? item.$key : null;
        value = convertedFromObject ? item.$value : item;
        primitive = !isObject(value);
        frag = !init && this.getCachedFrag(value, i, key);
        if (frag) {
          // reusable fragment
          frag.reused = true;
          // update $index
          frag.scope.$index = i;
          // update $key
          if (key) {
            frag.scope.$key = key;
          }
          // update iterator
          if (iterator) {
            frag.scope[iterator] = key !== null ? key : i;
          }
          // update data for track-by, object repeat &
          // primitive values.
          if (trackByKey || convertedFromObject || primitive) {
            withoutConversion(function () {
              frag.scope[alias] = value;
            });
          }
        } else {
          // new isntance
          frag = this.create(value, alias, i, key);
          frag.fresh = !init;
        }
        frags[i] = frag;
        if (init) {
          frag.before(end);
        }
      }

      // we're done for the initial render.
      if (init) {
        return;
      }

      // Second pass, go through the old fragments and
      // destroy those who are not reused (and remove them
      // from cache)
      var removalIndex = 0;
      var totalRemoved = oldFrags.length - frags.length;
      // when removing a large number of fragments, watcher removal
      // turns out to be a perf bottleneck, so we batch the watcher
      // removals into a single filter call!
      this.vm._vForRemoving = true;
      for (i = 0, l = oldFrags.length; i < l; i++) {
        frag = oldFrags[i];
        if (!frag.reused) {
          this.deleteCachedFrag(frag);
          this.remove(frag, removalIndex++, totalRemoved, inDocument);
        }
      }
      this.vm._vForRemoving = false;
      if (removalIndex) {
        this.vm._watchers = this.vm._watchers.filter(function (w) {
          return w.active;
        });
      }

      // Final pass, move/insert new fragments into the
      // right place.
      var targetPrev, prevEl, currentPrev;
      var insertionIndex = 0;
      for (i = 0, l = frags.length; i < l; i++) {
        frag = frags[i];
        // this is the frag that we should be after
        targetPrev = frags[i - 1];
        prevEl = targetPrev ? targetPrev.staggerCb ? targetPrev.staggerAnchor : targetPrev.end || targetPrev.node : start;
        if (frag.reused && !frag.staggerCb) {
          currentPrev = findPrevFrag(frag, start, this.id);
          if (currentPrev !== targetPrev && (!currentPrev ||
          // optimization for moving a single item.
          // thanks to suggestions by @livoras in #1807
          findPrevFrag(currentPrev, start, this.id) !== targetPrev)) {
            this.move(frag, prevEl);
          }
        } else {
          // new instance, or still in stagger.
          // insert with updated stagger index.
          this.insert(frag, insertionIndex++, prevEl, inDocument);
        }
        frag.reused = frag.fresh = false;
      }
    },

    /**
     * Create a new fragment instance.
     *
     * @param {*} value
     * @param {String} alias
     * @param {Number} index
     * @param {String} [key]
     * @return {Fragment}
     */

    create: function create(value, alias, index, key) {
      var host = this._host;
      // create iteration scope
      var parentScope = this._scope || this.vm;
      var scope = Object.create(parentScope);
      // ref holder for the scope
      scope.$refs = Object.create(parentScope.$refs);
      scope.$els = Object.create(parentScope.$els);
      // make sure point $parent to parent scope
      scope.$parent = parentScope;
      // for two-way binding on alias
      scope.$forContext = this;
      // define scope properties
      // important: define the scope alias without forced conversion
      // so that frozen data structures remain non-reactive.
      withoutConversion(function () {
        defineReactive(scope, alias, value);
      });
      defineReactive(scope, '$index', index);
      if (key) {
        defineReactive(scope, '$key', key);
      } else if (scope.$key) {
        // avoid accidental fallback
        def(scope, '$key', null);
      }
      if (this.iterator) {
        defineReactive(scope, this.iterator, key !== null ? key : index);
      }
      var frag = this.factory.create(host, scope, this._frag);
      frag.forId = this.id;
      this.cacheFrag(value, frag, index, key);
      return frag;
    },

    /**
     * Update the v-ref on owner vm.
     */

    updateRef: function updateRef() {
      var ref = this.descriptor.ref;
      if (!ref) return;
      var hash = (this._scope || this.vm).$refs;
      var refs;
      if (!this.fromObject) {
        refs = this.frags.map(findVmFromFrag);
      } else {
        refs = {};
        this.frags.forEach(function (frag) {
          refs[frag.scope.$key] = findVmFromFrag(frag);
        });
      }
      hash[ref] = refs;
    },

    /**
     * For option lists, update the containing v-model on
     * parent <select>.
     */

    updateModel: function updateModel() {
      if (this.isOption) {
        var parent = this.start.parentNode;
        var model = parent && parent.__v_model;
        if (model) {
          model.forceUpdate();
        }
      }
    },

    /**
     * Insert a fragment. Handles staggering.
     *
     * @param {Fragment} frag
     * @param {Number} index
     * @param {Node} prevEl
     * @param {Boolean} inDocument
     */

    insert: function insert(frag, index, prevEl, inDocument) {
      if (frag.staggerCb) {
        frag.staggerCb.cancel();
        frag.staggerCb = null;
      }
      var staggerAmount = this.getStagger(frag, index, null, 'enter');
      if (inDocument && staggerAmount) {
        // create an anchor and insert it synchronously,
        // so that we can resolve the correct order without
        // worrying about some elements not inserted yet
        var anchor = frag.staggerAnchor;
        if (!anchor) {
          anchor = frag.staggerAnchor = createAnchor('stagger-anchor');
          anchor.__v_frag = frag;
        }
        after(anchor, prevEl);
        var op = frag.staggerCb = cancellable(function () {
          frag.staggerCb = null;
          frag.before(anchor);
          remove(anchor);
        });
        setTimeout(op, staggerAmount);
      } else {
        var target = prevEl.nextSibling;
        /* istanbul ignore if */
        if (!target) {
          // reset end anchor position in case the position was messed up
          // by an external drag-n-drop library.
          after(this.end, prevEl);
          target = this.end;
        }
        frag.before(target);
      }
    },

    /**
     * Remove a fragment. Handles staggering.
     *
     * @param {Fragment} frag
     * @param {Number} index
     * @param {Number} total
     * @param {Boolean} inDocument
     */

    remove: function remove(frag, index, total, inDocument) {
      if (frag.staggerCb) {
        frag.staggerCb.cancel();
        frag.staggerCb = null;
        // it's not possible for the same frag to be removed
        // twice, so if we have a pending stagger callback,
        // it means this frag is queued for enter but removed
        // before its transition started. Since it is already
        // destroyed, we can just leave it in detached state.
        return;
      }
      var staggerAmount = this.getStagger(frag, index, total, 'leave');
      if (inDocument && staggerAmount) {
        var op = frag.staggerCb = cancellable(function () {
          frag.staggerCb = null;
          frag.remove();
        });
        setTimeout(op, staggerAmount);
      } else {
        frag.remove();
      }
    },

    /**
     * Move a fragment to a new position.
     * Force no transition.
     *
     * @param {Fragment} frag
     * @param {Node} prevEl
     */

    move: function move(frag, prevEl) {
      // fix a common issue with Sortable:
      // if prevEl doesn't have nextSibling, this means it's
      // been dragged after the end anchor. Just re-position
      // the end anchor to the end of the container.
      /* istanbul ignore if */
      if (!prevEl.nextSibling) {
        this.end.parentNode.appendChild(this.end);
      }
      frag.before(prevEl.nextSibling, false);
    },

    /**
     * Cache a fragment using track-by or the object key.
     *
     * @param {*} value
     * @param {Fragment} frag
     * @param {Number} index
     * @param {String} [key]
     */

    cacheFrag: function cacheFrag(value, frag, index, key) {
      var trackByKey = this.params.trackBy;
      var cache = this.cache;
      var primitive = !isObject(value);
      var id;
      if (key || trackByKey || primitive) {
        id = getTrackByKey(index, key, value, trackByKey);
        if (!cache[id]) {
          cache[id] = frag;
        } else if (trackByKey !== '$index') {
          'development' !== 'production' && this.warnDuplicate(value);
        }
      } else {
        id = this.id;
        if (hasOwn(value, id)) {
          if (value[id] === null) {
            value[id] = frag;
          } else {
            'development' !== 'production' && this.warnDuplicate(value);
          }
        } else if (Object.isExtensible(value)) {
          def(value, id, frag);
        } else if ('development' !== 'production') {
          warn('Frozen v-for objects cannot be automatically tracked, make sure to ' + 'provide a track-by key.');
        }
      }
      frag.raw = value;
    },

    /**
     * Get a cached fragment from the value/index/key
     *
     * @param {*} value
     * @param {Number} index
     * @param {String} key
     * @return {Fragment}
     */

    getCachedFrag: function getCachedFrag(value, index, key) {
      var trackByKey = this.params.trackBy;
      var primitive = !isObject(value);
      var frag;
      if (key || trackByKey || primitive) {
        var id = getTrackByKey(index, key, value, trackByKey);
        frag = this.cache[id];
      } else {
        frag = value[this.id];
      }
      if (frag && (frag.reused || frag.fresh)) {
        'development' !== 'production' && this.warnDuplicate(value);
      }
      return frag;
    },

    /**
     * Delete a fragment from cache.
     *
     * @param {Fragment} frag
     */

    deleteCachedFrag: function deleteCachedFrag(frag) {
      var value = frag.raw;
      var trackByKey = this.params.trackBy;
      var scope = frag.scope;
      var index = scope.$index;
      // fix #948: avoid accidentally fall through to
      // a parent repeater which happens to have $key.
      var key = hasOwn(scope, '$key') && scope.$key;
      var primitive = !isObject(value);
      if (trackByKey || key || primitive) {
        var id = getTrackByKey(index, key, value, trackByKey);
        this.cache[id] = null;
      } else {
        value[this.id] = null;
        frag.raw = null;
      }
    },

    /**
     * Get the stagger amount for an insertion/removal.
     *
     * @param {Fragment} frag
     * @param {Number} index
     * @param {Number} total
     * @param {String} type
     */

    getStagger: function getStagger(frag, index, total, type) {
      type = type + 'Stagger';
      var trans = frag.node.__v_trans;
      var hooks = trans && trans.hooks;
      var hook = hooks && (hooks[type] || hooks.stagger);
      return hook ? hook.call(frag, index, total) : index * parseInt(this.params[type] || this.params.stagger, 10);
    },

    /**
     * Pre-process the value before piping it through the
     * filters. This is passed to and called by the watcher.
     */

    _preProcess: function _preProcess(value) {
      // regardless of type, store the un-filtered raw value.
      this.rawValue = value;
      return value;
    },

    /**
     * Post-process the value after it has been piped through
     * the filters. This is passed to and called by the watcher.
     *
     * It is necessary for this to be called during the
     * watcher's dependency collection phase because we want
     * the v-for to update when the source Object is mutated.
     */

    _postProcess: function _postProcess(value) {
      if (isArray(value)) {
        return value;
      } else if (isPlainObject(value)) {
        // convert plain object to array.
        var keys = Object.keys(value);
        var i = keys.length;
        var res = new Array(i);
        var key;
        while (i--) {
          key = keys[i];
          res[i] = {
            $key: key,
            $value: value[key]
          };
        }
        return res;
      } else {
        if (typeof value === 'number' && !isNaN(value)) {
          value = range(value);
        }
        return value || [];
      }
    },

    unbind: function unbind() {
      if (this.descriptor.ref) {
        (this._scope || this.vm).$refs[this.descriptor.ref] = null;
      }
      if (this.frags) {
        var i = this.frags.length;
        var frag;
        while (i--) {
          frag = this.frags[i];
          this.deleteCachedFrag(frag);
          frag.destroy();
        }
      }
    }
  };

  /**
   * Helper to find the previous element that is a fragment
   * anchor. This is necessary because a destroyed frag's
   * element could still be lingering in the DOM before its
   * leaving transition finishes, but its inserted flag
   * should have been set to false so we can skip them.
   *
   * If this is a block repeat, we want to make sure we only
   * return frag that is bound to this v-for. (see #929)
   *
   * @param {Fragment} frag
   * @param {Comment|Text} anchor
   * @param {String} id
   * @return {Fragment}
   */

  function findPrevFrag(frag, anchor, id) {
    var el = frag.node.previousSibling;
    /* istanbul ignore if */
    if (!el) return;
    frag = el.__v_frag;
    while ((!frag || frag.forId !== id || !frag.inserted) && el !== anchor) {
      el = el.previousSibling;
      /* istanbul ignore if */
      if (!el) return;
      frag = el.__v_frag;
    }
    return frag;
  }

  /**
   * Find a vm from a fragment.
   *
   * @param {Fragment} frag
   * @return {Vue|undefined}
   */

  function findVmFromFrag(frag) {
    var node = frag.node;
    // handle multi-node frag
    if (frag.end) {
      while (!node.__vue__ && node !== frag.end && node.nextSibling) {
        node = node.nextSibling;
      }
    }
    return node.__vue__;
  }

  /**
   * Create a range array from given number.
   *
   * @param {Number} n
   * @return {Array}
   */

  function range(n) {
    var i = -1;
    var ret = new Array(Math.floor(n));
    while (++i < n) {
      ret[i] = i;
    }
    return ret;
  }

  /**
   * Get the track by key for an item.
   *
   * @param {Number} index
   * @param {String} key
   * @param {*} value
   * @param {String} [trackByKey]
   */

  function getTrackByKey(index, key, value, trackByKey) {
    return trackByKey ? trackByKey === '$index' ? index : trackByKey.charAt(0).match(/\w/) ? getPath(value, trackByKey) : value[trackByKey] : key || value;
  }

  if ('development' !== 'production') {
    vFor.warnDuplicate = function (value) {
      warn('Duplicate value found in v-for="' + this.descriptor.raw + '": ' + JSON.stringify(value) + '. Use track-by="$index" if ' + 'you are expecting duplicate values.', this.vm);
    };
  }

  var vIf = {

    priority: IF,
    terminal: true,

    bind: function bind() {
      var el = this.el;
      if (!el.__vue__) {
        // check else block
        var next = el.nextElementSibling;
        if (next && getAttr(next, 'v-else') !== null) {
          remove(next);
          this.elseEl = next;
        }
        // check main block
        this.anchor = createAnchor('v-if');
        replace(el, this.anchor);
      } else {
        'development' !== 'production' && warn('v-if="' + this.expression + '" cannot be ' + 'used on an instance root element.', this.vm);
        this.invalid = true;
      }
    },

    update: function update(value) {
      if (this.invalid) return;
      if (value) {
        if (!this.frag) {
          this.insert();
        }
      } else {
        this.remove();
      }
    },

    insert: function insert() {
      if (this.elseFrag) {
        this.elseFrag.remove();
        this.elseFrag = null;
      }
      // lazy init factory
      if (!this.factory) {
        this.factory = new FragmentFactory(this.vm, this.el);
      }
      this.frag = this.factory.create(this._host, this._scope, this._frag);
      this.frag.before(this.anchor);
    },

    remove: function remove() {
      if (this.frag) {
        this.frag.remove();
        this.frag = null;
      }
      if (this.elseEl && !this.elseFrag) {
        if (!this.elseFactory) {
          this.elseFactory = new FragmentFactory(this.elseEl._context || this.vm, this.elseEl);
        }
        this.elseFrag = this.elseFactory.create(this._host, this._scope, this._frag);
        this.elseFrag.before(this.anchor);
      }
    },

    unbind: function unbind() {
      if (this.frag) {
        this.frag.destroy();
      }
      if (this.elseFrag) {
        this.elseFrag.destroy();
      }
    }
  };

  var show = {

    bind: function bind() {
      // check else block
      var next = this.el.nextElementSibling;
      if (next && getAttr(next, 'v-else') !== null) {
        this.elseEl = next;
      }
    },

    update: function update(value) {
      this.apply(this.el, value);
      if (this.elseEl) {
        this.apply(this.elseEl, !value);
      }
    },

    apply: function apply(el, value) {
      if (inDoc(el)) {
        applyTransition(el, value ? 1 : -1, toggle, this.vm);
      } else {
        toggle();
      }
      function toggle() {
        el.style.display = value ? '' : 'none';
      }
    }
  };

  var text$2 = {

    bind: function bind() {
      var self = this;
      var el = this.el;
      var isRange = el.type === 'range';
      var lazy = this.params.lazy;
      var number = this.params.number;
      var debounce = this.params.debounce;

      // handle composition events.
      //   http://blog.evanyou.me/2014/01/03/composition-event/
      // skip this for Android because it handles composition
      // events quite differently. Android doesn't trigger
      // composition events for language input methods e.g.
      // Chinese, but instead triggers them for spelling
      // suggestions... (see Discussion/#162)
      var composing = false;
      if (!isAndroid && !isRange) {
        this.on('compositionstart', function () {
          composing = true;
        });
        this.on('compositionend', function () {
          composing = false;
          // in IE11 the "compositionend" event fires AFTER
          // the "input" event, so the input handler is blocked
          // at the end... have to call it here.
          //
          // #1327: in lazy mode this is unecessary.
          if (!lazy) {
            self.listener();
          }
        });
      }

      // prevent messing with the input when user is typing,
      // and force update on blur.
      this.focused = false;
      if (!isRange && !lazy) {
        this.on('focus', function () {
          self.focused = true;
        });
        this.on('blur', function () {
          self.focused = false;
          // do not sync value after fragment removal (#2017)
          if (!self._frag || self._frag.inserted) {
            self.rawListener();
          }
        });
      }

      // Now attach the main listener
      this.listener = this.rawListener = function () {
        if (composing || !self._bound) {
          return;
        }
        var val = number || isRange ? toNumber(el.value) : el.value;
        self.set(val);
        // force update on next tick to avoid lock & same value
        // also only update when user is not typing
        nextTick(function () {
          if (self._bound && !self.focused) {
            self.update(self._watcher.value);
          }
        });
      };

      // apply debounce
      if (debounce) {
        this.listener = _debounce(this.listener, debounce);
      }

      // Support jQuery events, since jQuery.trigger() doesn't
      // trigger native events in some cases and some plugins
      // rely on $.trigger()
      //
      // We want to make sure if a listener is attached using
      // jQuery, it is also removed with jQuery, that's why
      // we do the check for each directive instance and
      // store that check result on itself. This also allows
      // easier test coverage control by unsetting the global
      // jQuery variable in tests.
      this.hasjQuery = typeof jQuery === 'function';
      if (this.hasjQuery) {
        var method = jQuery.fn.on ? 'on' : 'bind';
        jQuery(el)[method]('change', this.rawListener);
        if (!lazy) {
          jQuery(el)[method]('input', this.listener);
        }
      } else {
        this.on('change', this.rawListener);
        if (!lazy) {
          this.on('input', this.listener);
        }
      }

      // IE9 doesn't fire input event on backspace/del/cut
      if (!lazy && isIE9) {
        this.on('cut', function () {
          nextTick(self.listener);
        });
        this.on('keyup', function (e) {
          if (e.keyCode === 46 || e.keyCode === 8) {
            self.listener();
          }
        });
      }

      // set initial value if present
      if (el.hasAttribute('value') || el.tagName === 'TEXTAREA' && el.value.trim()) {
        this.afterBind = this.listener;
      }
    },

    update: function update(value) {
      // #3029 only update when the value changes. This prevent
      // browsers from overwriting values like selectionStart
      value = _toString(value);
      if (value !== this.el.value) this.el.value = value;
    },

    unbind: function unbind() {
      var el = this.el;
      if (this.hasjQuery) {
        var method = jQuery.fn.off ? 'off' : 'unbind';
        jQuery(el)[method]('change', this.listener);
        jQuery(el)[method]('input', this.listener);
      }
    }
  };

  var radio = {

    bind: function bind() {
      var self = this;
      var el = this.el;

      this.getValue = function () {
        // value overwrite via v-bind:value
        if (el.hasOwnProperty('_value')) {
          return el._value;
        }
        var val = el.value;
        if (self.params.number) {
          val = toNumber(val);
        }
        return val;
      };

      this.listener = function () {
        self.set(self.getValue());
      };
      this.on('change', this.listener);

      if (el.hasAttribute('checked')) {
        this.afterBind = this.listener;
      }
    },

    update: function update(value) {
      this.el.checked = looseEqual(value, this.getValue());
    }
  };

  var select = {

    bind: function bind() {
      var _this = this;

      var self = this;
      var el = this.el;

      // method to force update DOM using latest value.
      this.forceUpdate = function () {
        if (self._watcher) {
          self.update(self._watcher.get());
        }
      };

      // check if this is a multiple select
      var multiple = this.multiple = el.hasAttribute('multiple');

      // attach listener
      this.listener = function () {
        var value = getValue(el, multiple);
        value = self.params.number ? isArray(value) ? value.map(toNumber) : toNumber(value) : value;
        self.set(value);
      };
      this.on('change', this.listener);

      // if has initial value, set afterBind
      var initValue = getValue(el, multiple, true);
      if (multiple && initValue.length || !multiple && initValue !== null) {
        this.afterBind = this.listener;
      }

      // All major browsers except Firefox resets
      // selectedIndex with value -1 to 0 when the element
      // is appended to a new parent, therefore we have to
      // force a DOM update whenever that happens...
      this.vm.$on('hook:attached', function () {
        nextTick(_this.forceUpdate);
      });
      if (!inDoc(el)) {
        nextTick(this.forceUpdate);
      }
    },

    update: function update(value) {
      var el = this.el;
      el.selectedIndex = -1;
      var multi = this.multiple && isArray(value);
      var options = el.options;
      var i = options.length;
      var op, val;
      while (i--) {
        op = options[i];
        val = op.hasOwnProperty('_value') ? op._value : op.value;
        /* eslint-disable eqeqeq */
        op.selected = multi ? indexOf$1(value, val) > -1 : looseEqual(value, val);
        /* eslint-enable eqeqeq */
      }
    },

    unbind: function unbind() {
      /* istanbul ignore next */
      this.vm.$off('hook:attached', this.forceUpdate);
    }
  };

  /**
   * Get select value
   *
   * @param {SelectElement} el
   * @param {Boolean} multi
   * @param {Boolean} init
   * @return {Array|*}
   */

  function getValue(el, multi, init) {
    var res = multi ? [] : null;
    var op, val, selected;
    for (var i = 0, l = el.options.length; i < l; i++) {
      op = el.options[i];
      selected = init ? op.hasAttribute('selected') : op.selected;
      if (selected) {
        val = op.hasOwnProperty('_value') ? op._value : op.value;
        if (multi) {
          res.push(val);
        } else {
          return val;
        }
      }
    }
    return res;
  }

  /**
   * Native Array.indexOf uses strict equal, but in this
   * case we need to match string/numbers with custom equal.
   *
   * @param {Array} arr
   * @param {*} val
   */

  function indexOf$1(arr, val) {
    var i = arr.length;
    while (i--) {
      if (looseEqual(arr[i], val)) {
        return i;
      }
    }
    return -1;
  }

  var checkbox = {

    bind: function bind() {
      var self = this;
      var el = this.el;

      this.getValue = function () {
        return el.hasOwnProperty('_value') ? el._value : self.params.number ? toNumber(el.value) : el.value;
      };

      function getBooleanValue() {
        var val = el.checked;
        if (val && el.hasOwnProperty('_trueValue')) {
          return el._trueValue;
        }
        if (!val && el.hasOwnProperty('_falseValue')) {
          return el._falseValue;
        }
        return val;
      }

      this.listener = function () {
        var model = self._watcher.value;
        if (isArray(model)) {
          var val = self.getValue();
          if (el.checked) {
            if (indexOf(model, val) < 0) {
              model.push(val);
            }
          } else {
            model.$remove(val);
          }
        } else {
          self.set(getBooleanValue());
        }
      };

      this.on('change', this.listener);
      if (el.hasAttribute('checked')) {
        this.afterBind = this.listener;
      }
    },

    update: function update(value) {
      var el = this.el;
      if (isArray(value)) {
        el.checked = indexOf(value, this.getValue()) > -1;
      } else {
        if (el.hasOwnProperty('_trueValue')) {
          el.checked = looseEqual(value, el._trueValue);
        } else {
          el.checked = !!value;
        }
      }
    }
  };

  var handlers = {
    text: text$2,
    radio: radio,
    select: select,
    checkbox: checkbox
  };

  var model = {

    priority: MODEL,
    twoWay: true,
    handlers: handlers,
    params: ['lazy', 'number', 'debounce'],

    /**
     * Possible elements:
     *   <select>
     *   <textarea>
     *   <input type="*">
     *     - text
     *     - checkbox
     *     - radio
     *     - number
     */

    bind: function bind() {
      // friendly warning...
      this.checkFilters();
      if (this.hasRead && !this.hasWrite) {
        'development' !== 'production' && warn('It seems you are using a read-only filter with ' + 'v-model="' + this.descriptor.raw + '". ' + 'You might want to use a two-way filter to ensure correct behavior.', this.vm);
      }
      var el = this.el;
      var tag = el.tagName;
      var handler;
      if (tag === 'INPUT') {
        handler = handlers[el.type] || handlers.text;
      } else if (tag === 'SELECT') {
        handler = handlers.select;
      } else if (tag === 'TEXTAREA') {
        handler = handlers.text;
      } else {
        'development' !== 'production' && warn('v-model does not support element type: ' + tag, this.vm);
        return;
      }
      el.__v_model = this;
      handler.bind.call(this);
      this.update = handler.update;
      this._unbind = handler.unbind;
    },

    /**
     * Check read/write filter stats.
     */

    checkFilters: function checkFilters() {
      var filters = this.filters;
      if (!filters) return;
      var i = filters.length;
      while (i--) {
        var filter = resolveAsset(this.vm.$options, 'filters', filters[i].name);
        if (typeof filter === 'function' || filter.read) {
          this.hasRead = true;
        }
        if (filter.write) {
          this.hasWrite = true;
        }
      }
    },

    unbind: function unbind() {
      this.el.__v_model = null;
      this._unbind && this._unbind();
    }
  };

  // keyCode aliases
  var keyCodes = {
    esc: 27,
    tab: 9,
    enter: 13,
    space: 32,
    'delete': [8, 46],
    up: 38,
    left: 37,
    right: 39,
    down: 40
  };

  function keyFilter(handler, keys) {
    var codes = keys.map(function (key) {
      var charCode = key.charCodeAt(0);
      if (charCode > 47 && charCode < 58) {
        return parseInt(key, 10);
      }
      if (key.length === 1) {
        charCode = key.toUpperCase().charCodeAt(0);
        if (charCode > 64 && charCode < 91) {
          return charCode;
        }
      }
      return keyCodes[key];
    });
    codes = [].concat.apply([], codes);
    return function keyHandler(e) {
      if (codes.indexOf(e.keyCode) > -1) {
        return handler.call(this, e);
      }
    };
  }

  function stopFilter(handler) {
    return function stopHandler(e) {
      e.stopPropagation();
      return handler.call(this, e);
    };
  }

  function preventFilter(handler) {
    return function preventHandler(e) {
      e.preventDefault();
      return handler.call(this, e);
    };
  }

  function selfFilter(handler) {
    return function selfHandler(e) {
      if (e.target === e.currentTarget) {
        return handler.call(this, e);
      }
    };
  }

  var on$1 = {

    priority: ON,
    acceptStatement: true,
    keyCodes: keyCodes,

    bind: function bind() {
      // deal with iframes
      if (this.el.tagName === 'IFRAME' && this.arg !== 'load') {
        var self = this;
        this.iframeBind = function () {
          on(self.el.contentWindow, self.arg, self.handler, self.modifiers.capture);
        };
        this.on('load', this.iframeBind);
      }
    },

    update: function update(handler) {
      // stub a noop for v-on with no value,
      // e.g. @mousedown.prevent
      if (!this.descriptor.raw) {
        handler = function () {};
      }

      if (typeof handler !== 'function') {
        'development' !== 'production' && warn('v-on:' + this.arg + '="' + this.expression + '" expects a function value, ' + 'got ' + handler, this.vm);
        return;
      }

      // apply modifiers
      if (this.modifiers.stop) {
        handler = stopFilter(handler);
      }
      if (this.modifiers.prevent) {
        handler = preventFilter(handler);
      }
      if (this.modifiers.self) {
        handler = selfFilter(handler);
      }
      // key filter
      var keys = Object.keys(this.modifiers).filter(function (key) {
        return key !== 'stop' && key !== 'prevent' && key !== 'self' && key !== 'capture';
      });
      if (keys.length) {
        handler = keyFilter(handler, keys);
      }

      this.reset();
      this.handler = handler;

      if (this.iframeBind) {
        this.iframeBind();
      } else {
        on(this.el, this.arg, this.handler, this.modifiers.capture);
      }
    },

    reset: function reset() {
      var el = this.iframeBind ? this.el.contentWindow : this.el;
      if (this.handler) {
        off(el, this.arg, this.handler);
      }
    },

    unbind: function unbind() {
      this.reset();
    }
  };

  var prefixes = ['-webkit-', '-moz-', '-ms-'];
  var camelPrefixes = ['Webkit', 'Moz', 'ms'];
  var importantRE = /!important;?$/;
  var propCache = Object.create(null);

  var testEl = null;

  var style = {

    deep: true,

    update: function update(value) {
      if (typeof value === 'string') {
        this.el.style.cssText = value;
      } else if (isArray(value)) {
        this.handleObject(value.reduce(extend, {}));
      } else {
        this.handleObject(value || {});
      }
    },

    handleObject: function handleObject(value) {
      // cache object styles so that only changed props
      // are actually updated.
      var cache = this.cache || (this.cache = {});
      var name, val;
      for (name in cache) {
        if (!(name in value)) {
          this.handleSingle(name, null);
          delete cache[name];
        }
      }
      for (name in value) {
        val = value[name];
        if (val !== cache[name]) {
          cache[name] = val;
          this.handleSingle(name, val);
        }
      }
    },

    handleSingle: function handleSingle(prop, value) {
      prop = normalize(prop);
      if (!prop) return; // unsupported prop
      // cast possible numbers/booleans into strings
      if (value != null) value += '';
      if (value) {
        var isImportant = importantRE.test(value) ? 'important' : '';
        if (isImportant) {
          /* istanbul ignore if */
          if ('development' !== 'production') {
            warn('It\'s probably a bad idea to use !important with inline rules. ' + 'This feature will be deprecated in a future version of Vue.');
          }
          value = value.replace(importantRE, '').trim();
          this.el.style.setProperty(prop.kebab, value, isImportant);
        } else {
          this.el.style[prop.camel] = value;
        }
      } else {
        this.el.style[prop.camel] = '';
      }
    }

  };

  /**
   * Normalize a CSS property name.
   * - cache result
   * - auto prefix
   * - camelCase -> dash-case
   *
   * @param {String} prop
   * @return {String}
   */

  function normalize(prop) {
    if (propCache[prop]) {
      return propCache[prop];
    }
    var res = prefix(prop);
    propCache[prop] = propCache[res] = res;
    return res;
  }

  /**
   * Auto detect the appropriate prefix for a CSS property.
   * https://gist.github.com/paulirish/523692
   *
   * @param {String} prop
   * @return {String}
   */

  function prefix(prop) {
    prop = hyphenate(prop);
    var camel = camelize(prop);
    var upper = camel.charAt(0).toUpperCase() + camel.slice(1);
    if (!testEl) {
      testEl = document.createElement('div');
    }
    var i = prefixes.length;
    var prefixed;
    if (camel !== 'filter' && camel in testEl.style) {
      return {
        kebab: prop,
        camel: camel
      };
    }
    while (i--) {
      prefixed = camelPrefixes[i] + upper;
      if (prefixed in testEl.style) {
        return {
          kebab: prefixes[i] + prop,
          camel: prefixed
        };
      }
    }
  }

  // xlink
  var xlinkNS = 'http://www.w3.org/1999/xlink';
  var xlinkRE = /^xlink:/;

  // check for attributes that prohibit interpolations
  var disallowedInterpAttrRE = /^v-|^:|^@|^(?:is|transition|transition-mode|debounce|track-by|stagger|enter-stagger|leave-stagger)$/;
  // these attributes should also set their corresponding properties
  // because they only affect the initial state of the element
  var attrWithPropsRE = /^(?:value|checked|selected|muted)$/;
  // these attributes expect enumrated values of "true" or "false"
  // but are not boolean attributes
  var enumeratedAttrRE = /^(?:draggable|contenteditable|spellcheck)$/;

  // these attributes should set a hidden property for
  // binding v-model to object values
  var modelProps = {
    value: '_value',
    'true-value': '_trueValue',
    'false-value': '_falseValue'
  };

  var bind$1 = {

    priority: BIND,

    bind: function bind() {
      var attr = this.arg;
      var tag = this.el.tagName;
      // should be deep watch on object mode
      if (!attr) {
        this.deep = true;
      }
      // handle interpolation bindings
      var descriptor = this.descriptor;
      var tokens = descriptor.interp;
      if (tokens) {
        // handle interpolations with one-time tokens
        if (descriptor.hasOneTime) {
          this.expression = tokensToExp(tokens, this._scope || this.vm);
        }

        // only allow binding on native attributes
        if (disallowedInterpAttrRE.test(attr) || attr === 'name' && (tag === 'PARTIAL' || tag === 'SLOT')) {
          'development' !== 'production' && warn(attr + '="' + descriptor.raw + '": ' + 'attribute interpolation is not allowed in Vue.js ' + 'directives and special attributes.', this.vm);
          this.el.removeAttribute(attr);
          this.invalid = true;
        }

        /* istanbul ignore if */
        if ('development' !== 'production') {
          var raw = attr + '="' + descriptor.raw + '": ';
          // warn src
          if (attr === 'src') {
            warn(raw + 'interpolation in "src" attribute will cause ' + 'a 404 request. Use v-bind:src instead.', this.vm);
          }

          // warn style
          if (attr === 'style') {
            warn(raw + 'interpolation in "style" attribute will cause ' + 'the attribute to be discarded in Internet Explorer. ' + 'Use v-bind:style instead.', this.vm);
          }
        }
      }
    },

    update: function update(value) {
      if (this.invalid) {
        return;
      }
      var attr = this.arg;
      if (this.arg) {
        this.handleSingle(attr, value);
      } else {
        this.handleObject(value || {});
      }
    },

    // share object handler with v-bind:class
    handleObject: style.handleObject,

    handleSingle: function handleSingle(attr, value) {
      var el = this.el;
      var interp = this.descriptor.interp;
      if (this.modifiers.camel) {
        attr = camelize(attr);
      }
      if (!interp && attrWithPropsRE.test(attr) && attr in el) {
        var attrValue = attr === 'value' ? value == null // IE9 will set input.value to "null" for null...
        ? '' : value : value;

        if (el[attr] !== attrValue) {
          el[attr] = attrValue;
        }
      }
      // set model props
      var modelProp = modelProps[attr];
      if (!interp && modelProp) {
        el[modelProp] = value;
        // update v-model if present
        var model = el.__v_model;
        if (model) {
          model.listener();
        }
      }
      // do not set value attribute for textarea
      if (attr === 'value' && el.tagName === 'TEXTAREA') {
        el.removeAttribute(attr);
        return;
      }
      // update attribute
      if (enumeratedAttrRE.test(attr)) {
        el.setAttribute(attr, value ? 'true' : 'false');
      } else if (value != null && value !== false) {
        if (attr === 'class') {
          // handle edge case #1960:
          // class interpolation should not overwrite Vue transition class
          if (el.__v_trans) {
            value += ' ' + el.__v_trans.id + '-transition';
          }
          setClass(el, value);
        } else if (xlinkRE.test(attr)) {
          el.setAttributeNS(xlinkNS, attr, value === true ? '' : value);
        } else {
          el.setAttribute(attr, value === true ? '' : value);
        }
      } else {
        el.removeAttribute(attr);
      }
    }
  };

  var el = {

    priority: EL,

    bind: function bind() {
      /* istanbul ignore if */
      if (!this.arg) {
        return;
      }
      var id = this.id = camelize(this.arg);
      var refs = (this._scope || this.vm).$els;
      if (hasOwn(refs, id)) {
        refs[id] = this.el;
      } else {
        defineReactive(refs, id, this.el);
      }
    },

    unbind: function unbind() {
      var refs = (this._scope || this.vm).$els;
      if (refs[this.id] === this.el) {
        refs[this.id] = null;
      }
    }
  };

  var ref = {
    bind: function bind() {
      'development' !== 'production' && warn('v-ref:' + this.arg + ' must be used on a child ' + 'component. Found on <' + this.el.tagName.toLowerCase() + '>.', this.vm);
    }
  };

  var cloak = {
    bind: function bind() {
      var el = this.el;
      this.vm.$once('pre-hook:compiled', function () {
        el.removeAttribute('v-cloak');
      });
    }
  };

  // must export plain object
  var directives = {
    text: text$1,
    html: html,
    'for': vFor,
    'if': vIf,
    show: show,
    model: model,
    on: on$1,
    bind: bind$1,
    el: el,
    ref: ref,
    cloak: cloak
  };

  var vClass = {

    deep: true,

    update: function update(value) {
      if (!value) {
        this.cleanup();
      } else if (typeof value === 'string') {
        this.setClass(value.trim().split(/\s+/));
      } else {
        this.setClass(normalize$1(value));
      }
    },

    setClass: function setClass(value) {
      this.cleanup(value);
      for (var i = 0, l = value.length; i < l; i++) {
        var val = value[i];
        if (val) {
          apply(this.el, val, addClass);
        }
      }
      this.prevKeys = value;
    },

    cleanup: function cleanup(value) {
      var prevKeys = this.prevKeys;
      if (!prevKeys) return;
      var i = prevKeys.length;
      while (i--) {
        var key = prevKeys[i];
        if (!value || value.indexOf(key) < 0) {
          apply(this.el, key, removeClass);
        }
      }
    }
  };

  /**
   * Normalize objects and arrays (potentially containing objects)
   * into array of strings.
   *
   * @param {Object|Array<String|Object>} value
   * @return {Array<String>}
   */

  function normalize$1(value) {
    var res = [];
    if (isArray(value)) {
      for (var i = 0, l = value.length; i < l; i++) {
        var _key = value[i];
        if (_key) {
          if (typeof _key === 'string') {
            res.push(_key);
          } else {
            for (var k in _key) {
              if (_key[k]) res.push(k);
            }
          }
        }
      }
    } else if (isObject(value)) {
      for (var key in value) {
        if (value[key]) res.push(key);
      }
    }
    return res;
  }

  /**
   * Add or remove a class/classes on an element
   *
   * @param {Element} el
   * @param {String} key The class name. This may or may not
   *                     contain a space character, in such a
   *                     case we'll deal with multiple class
   *                     names at once.
   * @param {Function} fn
   */

  function apply(el, key, fn) {
    key = key.trim();
    if (key.indexOf(' ') === -1) {
      fn(el, key);
      return;
    }
    // The key contains one or more space characters.
    // Since a class name doesn't accept such characters, we
    // treat it as multiple classes.
    var keys = key.split(/\s+/);
    for (var i = 0, l = keys.length; i < l; i++) {
      fn(el, keys[i]);
    }
  }

  var component = {

    priority: COMPONENT,

    params: ['keep-alive', 'transition-mode', 'inline-template'],

    /**
     * Setup. Two possible usages:
     *
     * - static:
     *   <comp> or <div v-component="comp">
     *
     * - dynamic:
     *   <component :is="view">
     */

    bind: function bind() {
      if (!this.el.__vue__) {
        // keep-alive cache
        this.keepAlive = this.params.keepAlive;
        if (this.keepAlive) {
          this.cache = {};
        }
        // check inline-template
        if (this.params.inlineTemplate) {
          // extract inline template as a DocumentFragment
          this.inlineTemplate = extractContent(this.el, true);
        }
        // component resolution related state
        this.pendingComponentCb = this.Component = null;
        // transition related state
        this.pendingRemovals = 0;
        this.pendingRemovalCb = null;
        // create a ref anchor
        this.anchor = createAnchor('v-component');
        replace(this.el, this.anchor);
        // remove is attribute.
        // this is removed during compilation, but because compilation is
        // cached, when the component is used elsewhere this attribute
        // will remain at link time.
        this.el.removeAttribute('is');
        this.el.removeAttribute(':is');
        // remove ref, same as above
        if (this.descriptor.ref) {
          this.el.removeAttribute('v-ref:' + hyphenate(this.descriptor.ref));
        }
        // if static, build right now.
        if (this.literal) {
          this.setComponent(this.expression);
        }
      } else {
        'development' !== 'production' && warn('cannot mount component "' + this.expression + '" ' + 'on already mounted element: ' + this.el);
      }
    },

    /**
     * Public update, called by the watcher in the dynamic
     * literal scenario, e.g. <component :is="view">
     */

    update: function update(value) {
      if (!this.literal) {
        this.setComponent(value);
      }
    },

    /**
     * Switch dynamic components. May resolve the component
     * asynchronously, and perform transition based on
     * specified transition mode. Accepts a few additional
     * arguments specifically for vue-router.
     *
     * The callback is called when the full transition is
     * finished.
     *
     * @param {String} value
     * @param {Function} [cb]
     */

    setComponent: function setComponent(value, cb) {
      this.invalidatePending();
      if (!value) {
        // just remove current
        this.unbuild(true);
        this.remove(this.childVM, cb);
        this.childVM = null;
      } else {
        var self = this;
        this.resolveComponent(value, function () {
          self.mountComponent(cb);
        });
      }
    },

    /**
     * Resolve the component constructor to use when creating
     * the child vm.
     *
     * @param {String|Function} value
     * @param {Function} cb
     */

    resolveComponent: function resolveComponent(value, cb) {
      var self = this;
      this.pendingComponentCb = cancellable(function (Component) {
        self.ComponentName = Component.options.name || (typeof value === 'string' ? value : null);
        self.Component = Component;
        cb();
      });
      this.vm._resolveComponent(value, this.pendingComponentCb);
    },

    /**
     * Create a new instance using the current constructor and
     * replace the existing instance. This method doesn't care
     * whether the new component and the old one are actually
     * the same.
     *
     * @param {Function} [cb]
     */

    mountComponent: function mountComponent(cb) {
      // actual mount
      this.unbuild(true);
      var self = this;
      var activateHooks = this.Component.options.activate;
      var cached = this.getCached();
      var newComponent = this.build();
      if (activateHooks && !cached) {
        this.waitingFor = newComponent;
        callActivateHooks(activateHooks, newComponent, function () {
          if (self.waitingFor !== newComponent) {
            return;
          }
          self.waitingFor = null;
          self.transition(newComponent, cb);
        });
      } else {
        // update ref for kept-alive component
        if (cached) {
          newComponent._updateRef();
        }
        this.transition(newComponent, cb);
      }
    },

    /**
     * When the component changes or unbinds before an async
     * constructor is resolved, we need to invalidate its
     * pending callback.
     */

    invalidatePending: function invalidatePending() {
      if (this.pendingComponentCb) {
        this.pendingComponentCb.cancel();
        this.pendingComponentCb = null;
      }
    },

    /**
     * Instantiate/insert a new child vm.
     * If keep alive and has cached instance, insert that
     * instance; otherwise build a new one and cache it.
     *
     * @param {Object} [extraOptions]
     * @return {Vue} - the created instance
     */

    build: function build(extraOptions) {
      var cached = this.getCached();
      if (cached) {
        return cached;
      }
      if (this.Component) {
        // default options
        var options = {
          name: this.ComponentName,
          el: cloneNode(this.el),
          template: this.inlineTemplate,
          // make sure to add the child with correct parent
          // if this is a transcluded component, its parent
          // should be the transclusion host.
          parent: this._host || this.vm,
          // if no inline-template, then the compiled
          // linker can be cached for better performance.
          _linkerCachable: !this.inlineTemplate,
          _ref: this.descriptor.ref,
          _asComponent: true,
          _isRouterView: this._isRouterView,
          // if this is a transcluded component, context
          // will be the common parent vm of this instance
          // and its host.
          _context: this.vm,
          // if this is inside an inline v-for, the scope
          // will be the intermediate scope created for this
          // repeat fragment. this is used for linking props
          // and container directives.
          _scope: this._scope,
          // pass in the owner fragment of this component.
          // this is necessary so that the fragment can keep
          // track of its contained components in order to
          // call attach/detach hooks for them.
          _frag: this._frag
        };
        // extra options
        // in 1.0.0 this is used by vue-router only
        /* istanbul ignore if */
        if (extraOptions) {
          extend(options, extraOptions);
        }
        var child = new this.Component(options);
        if (this.keepAlive) {
          this.cache[this.Component.cid] = child;
        }
        /* istanbul ignore if */
        if ('development' !== 'production' && this.el.hasAttribute('transition') && child._isFragment) {
          warn('Transitions will not work on a fragment instance. ' + 'Template: ' + child.$options.template, child);
        }
        return child;
      }
    },

    /**
     * Try to get a cached instance of the current component.
     *
     * @return {Vue|undefined}
     */

    getCached: function getCached() {
      return this.keepAlive && this.cache[this.Component.cid];
    },

    /**
     * Teardown the current child, but defers cleanup so
     * that we can separate the destroy and removal steps.
     *
     * @param {Boolean} defer
     */

    unbuild: function unbuild(defer) {
      if (this.waitingFor) {
        if (!this.keepAlive) {
          this.waitingFor.$destroy();
        }
        this.waitingFor = null;
      }
      var child = this.childVM;
      if (!child || this.keepAlive) {
        if (child) {
          // remove ref
          child._inactive = true;
          child._updateRef(true);
        }
        return;
      }
      // the sole purpose of `deferCleanup` is so that we can
      // "deactivate" the vm right now and perform DOM removal
      // later.
      child.$destroy(false, defer);
    },

    /**
     * Remove current destroyed child and manually do
     * the cleanup after removal.
     *
     * @param {Function} cb
     */

    remove: function remove(child, cb) {
      var keepAlive = this.keepAlive;
      if (child) {
        // we may have a component switch when a previous
        // component is still being transitioned out.
        // we want to trigger only one lastest insertion cb
        // when the existing transition finishes. (#1119)
        this.pendingRemovals++;
        this.pendingRemovalCb = cb;
        var self = this;
        child.$remove(function () {
          self.pendingRemovals--;
          if (!keepAlive) child._cleanup();
          if (!self.pendingRemovals && self.pendingRemovalCb) {
            self.pendingRemovalCb();
            self.pendingRemovalCb = null;
          }
        });
      } else if (cb) {
        cb();
      }
    },

    /**
     * Actually swap the components, depending on the
     * transition mode. Defaults to simultaneous.
     *
     * @param {Vue} target
     * @param {Function} [cb]
     */

    transition: function transition(target, cb) {
      var self = this;
      var current = this.childVM;
      // for devtool inspection
      if (current) current._inactive = true;
      target._inactive = false;
      this.childVM = target;
      switch (self.params.transitionMode) {
        case 'in-out':
          target.$before(self.anchor, function () {
            self.remove(current, cb);
          });
          break;
        case 'out-in':
          self.remove(current, function () {
            target.$before(self.anchor, cb);
          });
          break;
        default:
          self.remove(current);
          target.$before(self.anchor, cb);
      }
    },

    /**
     * Unbind.
     */

    unbind: function unbind() {
      this.invalidatePending();
      // Do not defer cleanup when unbinding
      this.unbuild();
      // destroy all keep-alive cached instances
      if (this.cache) {
        for (var key in this.cache) {
          this.cache[key].$destroy();
        }
        this.cache = null;
      }
    }
  };

  /**
   * Call activate hooks in order (asynchronous)
   *
   * @param {Array} hooks
   * @param {Vue} vm
   * @param {Function} cb
   */

  function callActivateHooks(hooks, vm, cb) {
    var total = hooks.length;
    var called = 0;
    hooks[0].call(vm, next);
    function next() {
      if (++called >= total) {
        cb();
      } else {
        hooks[called].call(vm, next);
      }
    }
  }

  var propBindingModes = config._propBindingModes;
  var empty = {};

  // regexes
  var identRE$1 = /^[$_a-zA-Z]+[\w$]*$/;
  var settablePathRE = /^[A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*|\[[^\[\]]+\])*$/;

  /**
   * Compile props on a root element and return
   * a props link function.
   *
   * @param {Element|DocumentFragment} el
   * @param {Array} propOptions
   * @param {Vue} vm
   * @return {Function} propsLinkFn
   */

  function compileProps(el, propOptions, vm) {
    var props = [];
    var names = Object.keys(propOptions);
    var i = names.length;
    var options, name, attr, value, path, parsed, prop;
    while (i--) {
      name = names[i];
      options = propOptions[name] || empty;

      if ('development' !== 'production' && name === '$data') {
        warn('Do not use $data as prop.', vm);
        continue;
      }

      // props could contain dashes, which will be
      // interpreted as minus calculations by the parser
      // so we need to camelize the path here
      path = camelize(name);
      if (!identRE$1.test(path)) {
        'development' !== 'production' && warn('Invalid prop key: "' + name + '". Prop keys ' + 'must be valid identifiers.', vm);
        continue;
      }

      prop = {
        name: name,
        path: path,
        options: options,
        mode: propBindingModes.ONE_WAY,
        raw: null
      };

      attr = hyphenate(name);
      // first check dynamic version
      if ((value = getBindAttr(el, attr)) === null) {
        if ((value = getBindAttr(el, attr + '.sync')) !== null) {
          prop.mode = propBindingModes.TWO_WAY;
        } else if ((value = getBindAttr(el, attr + '.once')) !== null) {
          prop.mode = propBindingModes.ONE_TIME;
        }
      }
      if (value !== null) {
        // has dynamic binding!
        prop.raw = value;
        parsed = parseDirective(value);
        value = parsed.expression;
        prop.filters = parsed.filters;
        // check binding type
        if (isLiteral(value) && !parsed.filters) {
          // for expressions containing literal numbers and
          // booleans, there's no need to setup a prop binding,
          // so we can optimize them as a one-time set.
          prop.optimizedLiteral = true;
        } else {
          prop.dynamic = true;
          // check non-settable path for two-way bindings
          if ('development' !== 'production' && prop.mode === propBindingModes.TWO_WAY && !settablePathRE.test(value)) {
            prop.mode = propBindingModes.ONE_WAY;
            warn('Cannot bind two-way prop with non-settable ' + 'parent path: ' + value, vm);
          }
        }
        prop.parentPath = value;

        // warn required two-way
        if ('development' !== 'production' && options.twoWay && prop.mode !== propBindingModes.TWO_WAY) {
          warn('Prop "' + name + '" expects a two-way binding type.', vm);
        }
      } else if ((value = getAttr(el, attr)) !== null) {
        // has literal binding!
        prop.raw = value;
      } else if ('development' !== 'production') {
        // check possible camelCase prop usage
        var lowerCaseName = path.toLowerCase();
        value = /[A-Z\-]/.test(name) && (el.getAttribute(lowerCaseName) || el.getAttribute(':' + lowerCaseName) || el.getAttribute('v-bind:' + lowerCaseName) || el.getAttribute(':' + lowerCaseName + '.once') || el.getAttribute('v-bind:' + lowerCaseName + '.once') || el.getAttribute(':' + lowerCaseName + '.sync') || el.getAttribute('v-bind:' + lowerCaseName + '.sync'));
        if (value) {
          warn('Possible usage error for prop `' + lowerCaseName + '` - ' + 'did you mean `' + attr + '`? HTML is case-insensitive, remember to use ' + 'kebab-case for props in templates.', vm);
        } else if (options.required) {
          // warn missing required
          warn('Missing required prop: ' + name, vm);
        }
      }
      // push prop
      props.push(prop);
    }
    return makePropsLinkFn(props);
  }

  /**
   * Build a function that applies props to a vm.
   *
   * @param {Array} props
   * @return {Function} propsLinkFn
   */

  function makePropsLinkFn(props) {
    return function propsLinkFn(vm, scope) {
      // store resolved props info
      vm._props = {};
      var inlineProps = vm.$options.propsData;
      var i = props.length;
      var prop, path, options, value, raw;
      while (i--) {
        prop = props[i];
        raw = prop.raw;
        path = prop.path;
        options = prop.options;
        vm._props[path] = prop;
        if (inlineProps && hasOwn(inlineProps, path)) {
          initProp(vm, prop, inlineProps[path]);
        }if (raw === null) {
          // initialize absent prop
          initProp(vm, prop, undefined);
        } else if (prop.dynamic) {
          // dynamic prop
          if (prop.mode === propBindingModes.ONE_TIME) {
            // one time binding
            value = (scope || vm._context || vm).$get(prop.parentPath);
            initProp(vm, prop, value);
          } else {
            if (vm._context) {
              // dynamic binding
              vm._bindDir({
                name: 'prop',
                def: propDef,
                prop: prop
              }, null, null, scope); // el, host, scope
            } else {
                // root instance
                initProp(vm, prop, vm.$get(prop.parentPath));
              }
          }
        } else if (prop.optimizedLiteral) {
          // optimized literal, cast it and just set once
          var stripped = stripQuotes(raw);
          value = stripped === raw ? toBoolean(toNumber(raw)) : stripped;
          initProp(vm, prop, value);
        } else {
          // string literal, but we need to cater for
          // Boolean props with no value, or with same
          // literal value (e.g. disabled="disabled")
          // see https://github.com/vuejs/vue-loader/issues/182
          value = options.type === Boolean && (raw === '' || raw === hyphenate(prop.name)) ? true : raw;
          initProp(vm, prop, value);
        }
      }
    };
  }

  /**
   * Process a prop with a rawValue, applying necessary coersions,
   * default values & assertions and call the given callback with
   * processed value.
   *
   * @param {Vue} vm
   * @param {Object} prop
   * @param {*} rawValue
   * @param {Function} fn
   */

  function processPropValue(vm, prop, rawValue, fn) {
    var isSimple = prop.dynamic && isSimplePath(prop.parentPath);
    var value = rawValue;
    if (value === undefined) {
      value = getPropDefaultValue(vm, prop);
    }
    value = coerceProp(prop, value, vm);
    var coerced = value !== rawValue;
    if (!assertProp(prop, value, vm)) {
      value = undefined;
    }
    if (isSimple && !coerced) {
      withoutConversion(function () {
        fn(value);
      });
    } else {
      fn(value);
    }
  }

  /**
   * Set a prop's initial value on a vm and its data object.
   *
   * @param {Vue} vm
   * @param {Object} prop
   * @param {*} value
   */

  function initProp(vm, prop, value) {
    processPropValue(vm, prop, value, function (value) {
      defineReactive(vm, prop.path, value);
    });
  }

  /**
   * Update a prop's value on a vm.
   *
   * @param {Vue} vm
   * @param {Object} prop
   * @param {*} value
   */

  function updateProp(vm, prop, value) {
    processPropValue(vm, prop, value, function (value) {
      vm[prop.path] = value;
    });
  }

  /**
   * Get the default value of a prop.
   *
   * @param {Vue} vm
   * @param {Object} prop
   * @return {*}
   */

  function getPropDefaultValue(vm, prop) {
    // no default, return undefined
    var options = prop.options;
    if (!hasOwn(options, 'default')) {
      // absent boolean value defaults to false
      return options.type === Boolean ? false : undefined;
    }
    var def = options['default'];
    // warn against non-factory defaults for Object & Array
    if (isObject(def)) {
      'development' !== 'production' && warn('Invalid default value for prop "' + prop.name + '": ' + 'Props with type Object/Array must use a factory function ' + 'to return the default value.', vm);
    }
    // call factory function for non-Function types
    return typeof def === 'function' && options.type !== Function ? def.call(vm) : def;
  }

  /**
   * Assert whether a prop is valid.
   *
   * @param {Object} prop
   * @param {*} value
   * @param {Vue} vm
   */

  function assertProp(prop, value, vm) {
    if (!prop.options.required && ( // non-required
    prop.raw === null || // abscent
    value == null) // null or undefined
    ) {
        return true;
      }
    var options = prop.options;
    var type = options.type;
    var valid = !type;
    var expectedTypes = [];
    if (type) {
      if (!isArray(type)) {
        type = [type];
      }
      for (var i = 0; i < type.length && !valid; i++) {
        var assertedType = assertType(value, type[i]);
        expectedTypes.push(assertedType.expectedType);
        valid = assertedType.valid;
      }
    }
    if (!valid) {
      if ('development' !== 'production') {
        warn('Invalid prop: type check failed for prop "' + prop.name + '".' + ' Expected ' + expectedTypes.map(formatType).join(', ') + ', got ' + formatValue(value) + '.', vm);
      }
      return false;
    }
    var validator = options.validator;
    if (validator) {
      if (!validator(value)) {
        'development' !== 'production' && warn('Invalid prop: custom validator check failed for prop "' + prop.name + '".', vm);
        return false;
      }
    }
    return true;
  }

  /**
   * Force parsing value with coerce option.
   *
   * @param {*} value
   * @param {Object} options
   * @return {*}
   */

  function coerceProp(prop, value, vm) {
    var coerce = prop.options.coerce;
    if (!coerce) {
      return value;
    }
    if (typeof coerce === 'function') {
      return coerce(value);
    } else {
      'development' !== 'production' && warn('Invalid coerce for prop "' + prop.name + '": expected function, got ' + typeof coerce + '.', vm);
      return value;
    }
  }

  /**
   * Assert the type of a value
   *
   * @param {*} value
   * @param {Function} type
   * @return {Object}
   */

  function assertType(value, type) {
    var valid;
    var expectedType;
    if (type === String) {
      expectedType = 'string';
      valid = typeof value === expectedType;
    } else if (type === Number) {
      expectedType = 'number';
      valid = typeof value === expectedType;
    } else if (type === Boolean) {
      expectedType = 'boolean';
      valid = typeof value === expectedType;
    } else if (type === Function) {
      expectedType = 'function';
      valid = typeof value === expectedType;
    } else if (type === Object) {
      expectedType = 'object';
      valid = isPlainObject(value);
    } else if (type === Array) {
      expectedType = 'array';
      valid = isArray(value);
    } else {
      valid = value instanceof type;
    }
    return {
      valid: valid,
      expectedType: expectedType
    };
  }

  /**
   * Format type for output
   *
   * @param {String} type
   * @return {String}
   */

  function formatType(type) {
    return type ? type.charAt(0).toUpperCase() + type.slice(1) : 'custom type';
  }

  /**
   * Format value
   *
   * @param {*} value
   * @return {String}
   */

  function formatValue(val) {
    return Object.prototype.toString.call(val).slice(8, -1);
  }

  var bindingModes = config._propBindingModes;

  var propDef = {

    bind: function bind() {
      var child = this.vm;
      var parent = child._context;
      // passed in from compiler directly
      var prop = this.descriptor.prop;
      var childKey = prop.path;
      var parentKey = prop.parentPath;
      var twoWay = prop.mode === bindingModes.TWO_WAY;

      var parentWatcher = this.parentWatcher = new Watcher(parent, parentKey, function (val) {
        updateProp(child, prop, val);
      }, {
        twoWay: twoWay,
        filters: prop.filters,
        // important: props need to be observed on the
        // v-for scope if present
        scope: this._scope
      });

      // set the child initial value.
      initProp(child, prop, parentWatcher.value);

      // setup two-way binding
      if (twoWay) {
        // important: defer the child watcher creation until
        // the created hook (after data observation)
        var self = this;
        child.$once('pre-hook:created', function () {
          self.childWatcher = new Watcher(child, childKey, function (val) {
            parentWatcher.set(val);
          }, {
            // ensure sync upward before parent sync down.
            // this is necessary in cases e.g. the child
            // mutates a prop array, then replaces it. (#1683)
            sync: true
          });
        });
      }
    },

    unbind: function unbind() {
      this.parentWatcher.teardown();
      if (this.childWatcher) {
        this.childWatcher.teardown();
      }
    }
  };

  var queue$1 = [];
  var queued = false;

  /**
   * Push a job into the queue.
   *
   * @param {Function} job
   */

  function pushJob(job) {
    queue$1.push(job);
    if (!queued) {
      queued = true;
      nextTick(flush);
    }
  }

  /**
   * Flush the queue, and do one forced reflow before
   * triggering transitions.
   */

  function flush() {
    // Force layout
    var f = document.documentElement.offsetHeight;
    for (var i = 0; i < queue$1.length; i++) {
      queue$1[i]();
    }
    queue$1 = [];
    queued = false;
    // dummy return, so js linters don't complain about
    // unused variable f
    return f;
  }

  var TYPE_TRANSITION = 'transition';
  var TYPE_ANIMATION = 'animation';
  var transDurationProp = transitionProp + 'Duration';
  var animDurationProp = animationProp + 'Duration';

  /**
   * If a just-entered element is applied the
   * leave class while its enter transition hasn't started yet,
   * and the transitioned property has the same value for both
   * enter/leave, then the leave transition will be skipped and
   * the transitionend event never fires. This function ensures
   * its callback to be called after a transition has started
   * by waiting for double raf.
   *
   * It falls back to setTimeout on devices that support CSS
   * transitions but not raf (e.g. Android 4.2 browser) - since
   * these environments are usually slow, we are giving it a
   * relatively large timeout.
   */

  var raf = inBrowser && window.requestAnimationFrame;
  var waitForTransitionStart = raf
  /* istanbul ignore next */
  ? function (fn) {
    raf(function () {
      raf(fn);
    });
  } : function (fn) {
    setTimeout(fn, 50);
  };

  /**
   * A Transition object that encapsulates the state and logic
   * of the transition.
   *
   * @param {Element} el
   * @param {String} id
   * @param {Object} hooks
   * @param {Vue} vm
   */
  function Transition(el, id, hooks, vm) {
    this.id = id;
    this.el = el;
    this.enterClass = hooks && hooks.enterClass || id + '-enter';
    this.leaveClass = hooks && hooks.leaveClass || id + '-leave';
    this.hooks = hooks;
    this.vm = vm;
    // async state
    this.pendingCssEvent = this.pendingCssCb = this.cancel = this.pendingJsCb = this.op = this.cb = null;
    this.justEntered = false;
    this.entered = this.left = false;
    this.typeCache = {};
    // check css transition type
    this.type = hooks && hooks.type;
    /* istanbul ignore if */
    if ('development' !== 'production') {
      if (this.type && this.type !== TYPE_TRANSITION && this.type !== TYPE_ANIMATION) {
        warn('invalid CSS transition type for transition="' + this.id + '": ' + this.type, vm);
      }
    }
    // bind
    var self = this;['enterNextTick', 'enterDone', 'leaveNextTick', 'leaveDone'].forEach(function (m) {
      self[m] = bind(self[m], self);
    });
  }

  var p$1 = Transition.prototype;

  /**
   * Start an entering transition.
   *
   * 1. enter transition triggered
   * 2. call beforeEnter hook
   * 3. add enter class
   * 4. insert/show element
   * 5. call enter hook (with possible explicit js callback)
   * 6. reflow
   * 7. based on transition type:
   *    - transition:
   *        remove class now, wait for transitionend,
   *        then done if there's no explicit js callback.
   *    - animation:
   *        wait for animationend, remove class,
   *        then done if there's no explicit js callback.
   *    - no css transition:
   *        done now if there's no explicit js callback.
   * 8. wait for either done or js callback, then call
   *    afterEnter hook.
   *
   * @param {Function} op - insert/show the element
   * @param {Function} [cb]
   */

  p$1.enter = function (op, cb) {
    this.cancelPending();
    this.callHook('beforeEnter');
    this.cb = cb;
    addClass(this.el, this.enterClass);
    op();
    this.entered = false;
    this.callHookWithCb('enter');
    if (this.entered) {
      return; // user called done synchronously.
    }
    this.cancel = this.hooks && this.hooks.enterCancelled;
    pushJob(this.enterNextTick);
  };

  /**
   * The "nextTick" phase of an entering transition, which is
   * to be pushed into a queue and executed after a reflow so
   * that removing the class can trigger a CSS transition.
   */

  p$1.enterNextTick = function () {
    var _this = this;

    // prevent transition skipping
    this.justEntered = true;
    waitForTransitionStart(function () {
      _this.justEntered = false;
    });
    var enterDone = this.enterDone;
    var type = this.getCssTransitionType(this.enterClass);
    if (!this.pendingJsCb) {
      if (type === TYPE_TRANSITION) {
        // trigger transition by removing enter class now
        removeClass(this.el, this.enterClass);
        this.setupCssCb(transitionEndEvent, enterDone);
      } else if (type === TYPE_ANIMATION) {
        this.setupCssCb(animationEndEvent, enterDone);
      } else {
        enterDone();
      }
    } else if (type === TYPE_TRANSITION) {
      removeClass(this.el, this.enterClass);
    }
  };

  /**
   * The "cleanup" phase of an entering transition.
   */

  p$1.enterDone = function () {
    this.entered = true;
    this.cancel = this.pendingJsCb = null;
    removeClass(this.el, this.enterClass);
    this.callHook('afterEnter');
    if (this.cb) this.cb();
  };

  /**
   * Start a leaving transition.
   *
   * 1. leave transition triggered.
   * 2. call beforeLeave hook
   * 3. add leave class (trigger css transition)
   * 4. call leave hook (with possible explicit js callback)
   * 5. reflow if no explicit js callback is provided
   * 6. based on transition type:
   *    - transition or animation:
   *        wait for end event, remove class, then done if
   *        there's no explicit js callback.
   *    - no css transition:
   *        done if there's no explicit js callback.
   * 7. wait for either done or js callback, then call
   *    afterLeave hook.
   *
   * @param {Function} op - remove/hide the element
   * @param {Function} [cb]
   */

  p$1.leave = function (op, cb) {
    this.cancelPending();
    this.callHook('beforeLeave');
    this.op = op;
    this.cb = cb;
    addClass(this.el, this.leaveClass);
    this.left = false;
    this.callHookWithCb('leave');
    if (this.left) {
      return; // user called done synchronously.
    }
    this.cancel = this.hooks && this.hooks.leaveCancelled;
    // only need to handle leaveDone if
    // 1. the transition is already done (synchronously called
    //    by the user, which causes this.op set to null)
    // 2. there's no explicit js callback
    if (this.op && !this.pendingJsCb) {
      // if a CSS transition leaves immediately after enter,
      // the transitionend event never fires. therefore we
      // detect such cases and end the leave immediately.
      if (this.justEntered) {
        this.leaveDone();
      } else {
        pushJob(this.leaveNextTick);
      }
    }
  };

  /**
   * The "nextTick" phase of a leaving transition.
   */

  p$1.leaveNextTick = function () {
    var type = this.getCssTransitionType(this.leaveClass);
    if (type) {
      var event = type === TYPE_TRANSITION ? transitionEndEvent : animationEndEvent;
      this.setupCssCb(event, this.leaveDone);
    } else {
      this.leaveDone();
    }
  };

  /**
   * The "cleanup" phase of a leaving transition.
   */

  p$1.leaveDone = function () {
    this.left = true;
    this.cancel = this.pendingJsCb = null;
    this.op();
    removeClass(this.el, this.leaveClass);
    this.callHook('afterLeave');
    if (this.cb) this.cb();
    this.op = null;
  };

  /**
   * Cancel any pending callbacks from a previously running
   * but not finished transition.
   */

  p$1.cancelPending = function () {
    this.op = this.cb = null;
    var hasPending = false;
    if (this.pendingCssCb) {
      hasPending = true;
      off(this.el, this.pendingCssEvent, this.pendingCssCb);
      this.pendingCssEvent = this.pendingCssCb = null;
    }
    if (this.pendingJsCb) {
      hasPending = true;
      this.pendingJsCb.cancel();
      this.pendingJsCb = null;
    }
    if (hasPending) {
      removeClass(this.el, this.enterClass);
      removeClass(this.el, this.leaveClass);
    }
    if (this.cancel) {
      this.cancel.call(this.vm, this.el);
      this.cancel = null;
    }
  };

  /**
   * Call a user-provided synchronous hook function.
   *
   * @param {String} type
   */

  p$1.callHook = function (type) {
    if (this.hooks && this.hooks[type]) {
      this.hooks[type].call(this.vm, this.el);
    }
  };

  /**
   * Call a user-provided, potentially-async hook function.
   * We check for the length of arguments to see if the hook
   * expects a `done` callback. If true, the transition's end
   * will be determined by when the user calls that callback;
   * otherwise, the end is determined by the CSS transition or
   * animation.
   *
   * @param {String} type
   */

  p$1.callHookWithCb = function (type) {
    var hook = this.hooks && this.hooks[type];
    if (hook) {
      if (hook.length > 1) {
        this.pendingJsCb = cancellable(this[type + 'Done']);
      }
      hook.call(this.vm, this.el, this.pendingJsCb);
    }
  };

  /**
   * Get an element's transition type based on the
   * calculated styles.
   *
   * @param {String} className
   * @return {Number}
   */

  p$1.getCssTransitionType = function (className) {
    /* istanbul ignore if */
    if (!transitionEndEvent ||
    // skip CSS transitions if page is not visible -
    // this solves the issue of transitionend events not
    // firing until the page is visible again.
    // pageVisibility API is supported in IE10+, same as
    // CSS transitions.
    document.hidden ||
    // explicit js-only transition
    this.hooks && this.hooks.css === false ||
    // element is hidden
    isHidden(this.el)) {
      return;
    }
    var type = this.type || this.typeCache[className];
    if (type) return type;
    var inlineStyles = this.el.style;
    var computedStyles = window.getComputedStyle(this.el);
    var transDuration = inlineStyles[transDurationProp] || computedStyles[transDurationProp];
    if (transDuration && transDuration !== '0s') {
      type = TYPE_TRANSITION;
    } else {
      var animDuration = inlineStyles[animDurationProp] || computedStyles[animDurationProp];
      if (animDuration && animDuration !== '0s') {
        type = TYPE_ANIMATION;
      }
    }
    if (type) {
      this.typeCache[className] = type;
    }
    return type;
  };

  /**
   * Setup a CSS transitionend/animationend callback.
   *
   * @param {String} event
   * @param {Function} cb
   */

  p$1.setupCssCb = function (event, cb) {
    this.pendingCssEvent = event;
    var self = this;
    var el = this.el;
    var onEnd = this.pendingCssCb = function (e) {
      if (e.target === el) {
        off(el, event, onEnd);
        self.pendingCssEvent = self.pendingCssCb = null;
        if (!self.pendingJsCb && cb) {
          cb();
        }
      }
    };
    on(el, event, onEnd);
  };

  /**
   * Check if an element is hidden - in that case we can just
   * skip the transition alltogether.
   *
   * @param {Element} el
   * @return {Boolean}
   */

  function isHidden(el) {
    if (/svg$/.test(el.namespaceURI)) {
      // SVG elements do not have offset(Width|Height)
      // so we need to check the client rect
      var rect = el.getBoundingClientRect();
      return !(rect.width || rect.height);
    } else {
      return !(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
    }
  }

  var transition$1 = {

    priority: TRANSITION,

    update: function update(id, oldId) {
      var el = this.el;
      // resolve on owner vm
      var hooks = resolveAsset(this.vm.$options, 'transitions', id);
      id = id || 'v';
      oldId = oldId || 'v';
      el.__v_trans = new Transition(el, id, hooks, this.vm);
      removeClass(el, oldId + '-transition');
      addClass(el, id + '-transition');
    }
  };

  var internalDirectives = {
    style: style,
    'class': vClass,
    component: component,
    prop: propDef,
    transition: transition$1
  };

  // special binding prefixes
  var bindRE = /^v-bind:|^:/;
  var onRE = /^v-on:|^@/;
  var dirAttrRE = /^v-([^:]+)(?:$|:(.*)$)/;
  var modifierRE = /\.[^\.]+/g;
  var transitionRE = /^(v-bind:|:)?transition$/;

  // default directive priority
  var DEFAULT_PRIORITY = 1000;
  var DEFAULT_TERMINAL_PRIORITY = 2000;

  /**
   * Compile a template and return a reusable composite link
   * function, which recursively contains more link functions
   * inside. This top level compile function would normally
   * be called on instance root nodes, but can also be used
   * for partial compilation if the partial argument is true.
   *
   * The returned composite link function, when called, will
   * return an unlink function that tearsdown all directives
   * created during the linking phase.
   *
   * @param {Element|DocumentFragment} el
   * @param {Object} options
   * @param {Boolean} partial
   * @return {Function}
   */

  function compile(el, options, partial) {
    // link function for the node itself.
    var nodeLinkFn = partial || !options._asComponent ? compileNode(el, options) : null;
    // link function for the childNodes
    var childLinkFn = !(nodeLinkFn && nodeLinkFn.terminal) && !isScript(el) && el.hasChildNodes() ? compileNodeList(el.childNodes, options) : null;

    /**
     * A composite linker function to be called on a already
     * compiled piece of DOM, which instantiates all directive
     * instances.
     *
     * @param {Vue} vm
     * @param {Element|DocumentFragment} el
     * @param {Vue} [host] - host vm of transcluded content
     * @param {Object} [scope] - v-for scope
     * @param {Fragment} [frag] - link context fragment
     * @return {Function|undefined}
     */

    return function compositeLinkFn(vm, el, host, scope, frag) {
      // cache childNodes before linking parent, fix #657
      var childNodes = toArray(el.childNodes);
      // link
      var dirs = linkAndCapture(function compositeLinkCapturer() {
        if (nodeLinkFn) nodeLinkFn(vm, el, host, scope, frag);
        if (childLinkFn) childLinkFn(vm, childNodes, host, scope, frag);
      }, vm);
      return makeUnlinkFn(vm, dirs);
    };
  }

  /**
   * Apply a linker to a vm/element pair and capture the
   * directives created during the process.
   *
   * @param {Function} linker
   * @param {Vue} vm
   */

  function linkAndCapture(linker, vm) {
    /* istanbul ignore if */
    if ('development' === 'production') {}
    var originalDirCount = vm._directives.length;
    linker();
    var dirs = vm._directives.slice(originalDirCount);
    dirs.sort(directiveComparator);
    for (var i = 0, l = dirs.length; i < l; i++) {
      dirs[i]._bind();
    }
    return dirs;
  }

  /**
   * Directive priority sort comparator
   *
   * @param {Object} a
   * @param {Object} b
   */

  function directiveComparator(a, b) {
    a = a.descriptor.def.priority || DEFAULT_PRIORITY;
    b = b.descriptor.def.priority || DEFAULT_PRIORITY;
    return a > b ? -1 : a === b ? 0 : 1;
  }

  /**
   * Linker functions return an unlink function that
   * tearsdown all directives instances generated during
   * the process.
   *
   * We create unlink functions with only the necessary
   * information to avoid retaining additional closures.
   *
   * @param {Vue} vm
   * @param {Array} dirs
   * @param {Vue} [context]
   * @param {Array} [contextDirs]
   * @return {Function}
   */

  function makeUnlinkFn(vm, dirs, context, contextDirs) {
    function unlink(destroying) {
      teardownDirs(vm, dirs, destroying);
      if (context && contextDirs) {
        teardownDirs(context, contextDirs);
      }
    }
    // expose linked directives
    unlink.dirs = dirs;
    return unlink;
  }

  /**
   * Teardown partial linked directives.
   *
   * @param {Vue} vm
   * @param {Array} dirs
   * @param {Boolean} destroying
   */

  function teardownDirs(vm, dirs, destroying) {
    var i = dirs.length;
    while (i--) {
      dirs[i]._teardown();
      if ('development' !== 'production' && !destroying) {
        vm._directives.$remove(dirs[i]);
      }
    }
  }

  /**
   * Compile link props on an instance.
   *
   * @param {Vue} vm
   * @param {Element} el
   * @param {Object} props
   * @param {Object} [scope]
   * @return {Function}
   */

  function compileAndLinkProps(vm, el, props, scope) {
    var propsLinkFn = compileProps(el, props, vm);
    var propDirs = linkAndCapture(function () {
      propsLinkFn(vm, scope);
    }, vm);
    return makeUnlinkFn(vm, propDirs);
  }

  /**
   * Compile the root element of an instance.
   *
   * 1. attrs on context container (context scope)
   * 2. attrs on the component template root node, if
   *    replace:true (child scope)
   *
   * If this is a fragment instance, we only need to compile 1.
   *
   * @param {Element} el
   * @param {Object} options
   * @param {Object} contextOptions
   * @return {Function}
   */

  function compileRoot(el, options, contextOptions) {
    var containerAttrs = options._containerAttrs;
    var replacerAttrs = options._replacerAttrs;
    var contextLinkFn, replacerLinkFn;

    // only need to compile other attributes for
    // non-fragment instances
    if (el.nodeType !== 11) {
      // for components, container and replacer need to be
      // compiled separately and linked in different scopes.
      if (options._asComponent) {
        // 2. container attributes
        if (containerAttrs && contextOptions) {
          contextLinkFn = compileDirectives(containerAttrs, contextOptions);
        }
        if (replacerAttrs) {
          // 3. replacer attributes
          replacerLinkFn = compileDirectives(replacerAttrs, options);
        }
      } else {
        // non-component, just compile as a normal element.
        replacerLinkFn = compileDirectives(el.attributes, options);
      }
    } else if ('development' !== 'production' && containerAttrs) {
      // warn container directives for fragment instances
      var names = containerAttrs.filter(function (attr) {
        // allow vue-loader/vueify scoped css attributes
        return attr.name.indexOf('_v-') < 0 &&
        // allow event listeners
        !onRE.test(attr.name) &&
        // allow slots
        attr.name !== 'slot';
      }).map(function (attr) {
        return '"' + attr.name + '"';
      });
      if (names.length) {
        var plural = names.length > 1;
        warn('Attribute' + (plural ? 's ' : ' ') + names.join(', ') + (plural ? ' are' : ' is') + ' ignored on component ' + '<' + options.el.tagName.toLowerCase() + '> because ' + 'the component is a fragment instance: ' + 'http://vuejs.org/guide/components.html#Fragment-Instance');
      }
    }

    options._containerAttrs = options._replacerAttrs = null;
    return function rootLinkFn(vm, el, scope) {
      // link context scope dirs
      var context = vm._context;
      var contextDirs;
      if (context && contextLinkFn) {
        contextDirs = linkAndCapture(function () {
          contextLinkFn(context, el, null, scope);
        }, context);
      }

      // link self
      var selfDirs = linkAndCapture(function () {
        if (replacerLinkFn) replacerLinkFn(vm, el);
      }, vm);

      // return the unlink function that tearsdown context
      // container directives.
      return makeUnlinkFn(vm, selfDirs, context, contextDirs);
    };
  }

  /**
   * Compile a node and return a nodeLinkFn based on the
   * node type.
   *
   * @param {Node} node
   * @param {Object} options
   * @return {Function|null}
   */

  function compileNode(node, options) {
    var type = node.nodeType;
    if (type === 1 && !isScript(node)) {
      return compileElement(node, options);
    } else if (type === 3 && node.data.trim()) {
      return compileTextNode(node, options);
    } else {
      return null;
    }
  }

  /**
   * Compile an element and return a nodeLinkFn.
   *
   * @param {Element} el
   * @param {Object} options
   * @return {Function|null}
   */

  function compileElement(el, options) {
    // preprocess textareas.
    // textarea treats its text content as the initial value.
    // just bind it as an attr directive for value.
    if (el.tagName === 'TEXTAREA') {
      var tokens = parseText(el.value);
      if (tokens) {
        el.setAttribute(':value', tokensToExp(tokens));
        el.value = '';
      }
    }
    var linkFn;
    var hasAttrs = el.hasAttributes();
    var attrs = hasAttrs && toArray(el.attributes);
    // check terminal directives (for & if)
    if (hasAttrs) {
      linkFn = checkTerminalDirectives(el, attrs, options);
    }
    // check element directives
    if (!linkFn) {
      linkFn = checkElementDirectives(el, options);
    }
    // check component
    if (!linkFn) {
      linkFn = checkComponent(el, options);
    }
    // normal directives
    if (!linkFn && hasAttrs) {
      linkFn = compileDirectives(attrs, options);
    }
    return linkFn;
  }

  /**
   * Compile a textNode and return a nodeLinkFn.
   *
   * @param {TextNode} node
   * @param {Object} options
   * @return {Function|null} textNodeLinkFn
   */

  function compileTextNode(node, options) {
    // skip marked text nodes
    if (node._skip) {
      return removeText;
    }

    var tokens = parseText(node.wholeText);
    if (!tokens) {
      return null;
    }

    // mark adjacent text nodes as skipped,
    // because we are using node.wholeText to compile
    // all adjacent text nodes together. This fixes
    // issues in IE where sometimes it splits up a single
    // text node into multiple ones.
    var next = node.nextSibling;
    while (next && next.nodeType === 3) {
      next._skip = true;
      next = next.nextSibling;
    }

    var frag = document.createDocumentFragment();
    var el, token;
    for (var i = 0, l = tokens.length; i < l; i++) {
      token = tokens[i];
      el = token.tag ? processTextToken(token, options) : document.createTextNode(token.value);
      frag.appendChild(el);
    }
    return makeTextNodeLinkFn(tokens, frag, options);
  }

  /**
   * Linker for an skipped text node.
   *
   * @param {Vue} vm
   * @param {Text} node
   */

  function removeText(vm, node) {
    remove(node);
  }

  /**
   * Process a single text token.
   *
   * @param {Object} token
   * @param {Object} options
   * @return {Node}
   */

  function processTextToken(token, options) {
    var el;
    if (token.oneTime) {
      el = document.createTextNode(token.value);
    } else {
      if (token.html) {
        el = document.createComment('v-html');
        setTokenType('html');
      } else {
        // IE will clean up empty textNodes during
        // frag.cloneNode(true), so we have to give it
        // something here...
        el = document.createTextNode(' ');
        setTokenType('text');
      }
    }
    function setTokenType(type) {
      if (token.descriptor) return;
      var parsed = parseDirective(token.value);
      token.descriptor = {
        name: type,
        def: directives[type],
        expression: parsed.expression,
        filters: parsed.filters
      };
    }
    return el;
  }

  /**
   * Build a function that processes a textNode.
   *
   * @param {Array<Object>} tokens
   * @param {DocumentFragment} frag
   */

  function makeTextNodeLinkFn(tokens, frag) {
    return function textNodeLinkFn(vm, el, host, scope) {
      var fragClone = frag.cloneNode(true);
      var childNodes = toArray(fragClone.childNodes);
      var token, value, node;
      for (var i = 0, l = tokens.length; i < l; i++) {
        token = tokens[i];
        value = token.value;
        if (token.tag) {
          node = childNodes[i];
          if (token.oneTime) {
            value = (scope || vm).$eval(value);
            if (token.html) {
              replace(node, parseTemplate(value, true));
            } else {
              node.data = _toString(value);
            }
          } else {
            vm._bindDir(token.descriptor, node, host, scope);
          }
        }
      }
      replace(el, fragClone);
    };
  }

  /**
   * Compile a node list and return a childLinkFn.
   *
   * @param {NodeList} nodeList
   * @param {Object} options
   * @return {Function|undefined}
   */

  function compileNodeList(nodeList, options) {
    var linkFns = [];
    var nodeLinkFn, childLinkFn, node;
    for (var i = 0, l = nodeList.length; i < l; i++) {
      node = nodeList[i];
      nodeLinkFn = compileNode(node, options);
      childLinkFn = !(nodeLinkFn && nodeLinkFn.terminal) && node.tagName !== 'SCRIPT' && node.hasChildNodes() ? compileNodeList(node.childNodes, options) : null;
      linkFns.push(nodeLinkFn, childLinkFn);
    }
    return linkFns.length ? makeChildLinkFn(linkFns) : null;
  }

  /**
   * Make a child link function for a node's childNodes.
   *
   * @param {Array<Function>} linkFns
   * @return {Function} childLinkFn
   */

  function makeChildLinkFn(linkFns) {
    return function childLinkFn(vm, nodes, host, scope, frag) {
      var node, nodeLinkFn, childrenLinkFn;
      for (var i = 0, n = 0, l = linkFns.length; i < l; n++) {
        node = nodes[n];
        nodeLinkFn = linkFns[i++];
        childrenLinkFn = linkFns[i++];
        // cache childNodes before linking parent, fix #657
        var childNodes = toArray(node.childNodes);
        if (nodeLinkFn) {
          nodeLinkFn(vm, node, host, scope, frag);
        }
        if (childrenLinkFn) {
          childrenLinkFn(vm, childNodes, host, scope, frag);
        }
      }
    };
  }

  /**
   * Check for element directives (custom elements that should
   * be resovled as terminal directives).
   *
   * @param {Element} el
   * @param {Object} options
   */

  function checkElementDirectives(el, options) {
    var tag = el.tagName.toLowerCase();
    if (commonTagRE.test(tag)) {
      return;
    }
    var def = resolveAsset(options, 'elementDirectives', tag);
    if (def) {
      return makeTerminalNodeLinkFn(el, tag, '', options, def);
    }
  }

  /**
   * Check if an element is a component. If yes, return
   * a component link function.
   *
   * @param {Element} el
   * @param {Object} options
   * @return {Function|undefined}
   */

  function checkComponent(el, options) {
    var component = checkComponentAttr(el, options);
    if (component) {
      var ref = findRef(el);
      var descriptor = {
        name: 'component',
        ref: ref,
        expression: component.id,
        def: internalDirectives.component,
        modifiers: {
          literal: !component.dynamic
        }
      };
      var componentLinkFn = function componentLinkFn(vm, el, host, scope, frag) {
        if (ref) {
          defineReactive((scope || vm).$refs, ref, null);
        }
        vm._bindDir(descriptor, el, host, scope, frag);
      };
      componentLinkFn.terminal = true;
      return componentLinkFn;
    }
  }

  /**
   * Check an element for terminal directives in fixed order.
   * If it finds one, return a terminal link function.
   *
   * @param {Element} el
   * @param {Array} attrs
   * @param {Object} options
   * @return {Function} terminalLinkFn
   */

  function checkTerminalDirectives(el, attrs, options) {
    // skip v-pre
    if (getAttr(el, 'v-pre') !== null) {
      return skip;
    }
    // skip v-else block, but only if following v-if
    if (el.hasAttribute('v-else')) {
      var prev = el.previousElementSibling;
      if (prev && prev.hasAttribute('v-if')) {
        return skip;
      }
    }

    var attr, name, value, modifiers, matched, dirName, rawName, arg, def, termDef;
    for (var i = 0, j = attrs.length; i < j; i++) {
      attr = attrs[i];
      name = attr.name.replace(modifierRE, '');
      if (matched = name.match(dirAttrRE)) {
        def = resolveAsset(options, 'directives', matched[1]);
        if (def && def.terminal) {
          if (!termDef || (def.priority || DEFAULT_TERMINAL_PRIORITY) > termDef.priority) {
            termDef = def;
            rawName = attr.name;
            modifiers = parseModifiers(attr.name);
            value = attr.value;
            dirName = matched[1];
            arg = matched[2];
          }
        }
      }
    }

    if (termDef) {
      return makeTerminalNodeLinkFn(el, dirName, value, options, termDef, rawName, arg, modifiers);
    }
  }

  function skip() {}
  skip.terminal = true;

  /**
   * Build a node link function for a terminal directive.
   * A terminal link function terminates the current
   * compilation recursion and handles compilation of the
   * subtree in the directive.
   *
   * @param {Element} el
   * @param {String} dirName
   * @param {String} value
   * @param {Object} options
   * @param {Object} def
   * @param {String} [rawName]
   * @param {String} [arg]
   * @param {Object} [modifiers]
   * @return {Function} terminalLinkFn
   */

  function makeTerminalNodeLinkFn(el, dirName, value, options, def, rawName, arg, modifiers) {
    var parsed = parseDirective(value);
    var descriptor = {
      name: dirName,
      arg: arg,
      expression: parsed.expression,
      filters: parsed.filters,
      raw: value,
      attr: rawName,
      modifiers: modifiers,
      def: def
    };
    // check ref for v-for and router-view
    if (dirName === 'for' || dirName === 'router-view') {
      descriptor.ref = findRef(el);
    }
    var fn = function terminalNodeLinkFn(vm, el, host, scope, frag) {
      if (descriptor.ref) {
        defineReactive((scope || vm).$refs, descriptor.ref, null);
      }
      vm._bindDir(descriptor, el, host, scope, frag);
    };
    fn.terminal = true;
    return fn;
  }

  /**
   * Compile the directives on an element and return a linker.
   *
   * @param {Array|NamedNodeMap} attrs
   * @param {Object} options
   * @return {Function}
   */

  function compileDirectives(attrs, options) {
    var i = attrs.length;
    var dirs = [];
    var attr, name, value, rawName, rawValue, dirName, arg, modifiers, dirDef, tokens, matched;
    while (i--) {
      attr = attrs[i];
      name = rawName = attr.name;
      value = rawValue = attr.value;
      tokens = parseText(value);
      // reset arg
      arg = null;
      // check modifiers
      modifiers = parseModifiers(name);
      name = name.replace(modifierRE, '');

      // attribute interpolations
      if (tokens) {
        value = tokensToExp(tokens);
        arg = name;
        pushDir('bind', directives.bind, tokens);
        // warn against mixing mustaches with v-bind
        if ('development' !== 'production') {
          if (name === 'class' && Array.prototype.some.call(attrs, function (attr) {
            return attr.name === ':class' || attr.name === 'v-bind:class';
          })) {
            warn('class="' + rawValue + '": Do not mix mustache interpolation ' + 'and v-bind for "class" on the same element. Use one or the other.', options);
          }
        }
      } else

        // special attribute: transition
        if (transitionRE.test(name)) {
          modifiers.literal = !bindRE.test(name);
          pushDir('transition', internalDirectives.transition);
        } else

          // event handlers
          if (onRE.test(name)) {
            arg = name.replace(onRE, '');
            pushDir('on', directives.on);
          } else

            // attribute bindings
            if (bindRE.test(name)) {
              dirName = name.replace(bindRE, '');
              if (dirName === 'style' || dirName === 'class') {
                pushDir(dirName, internalDirectives[dirName]);
              } else {
                arg = dirName;
                pushDir('bind', directives.bind);
              }
            } else

              // normal directives
              if (matched = name.match(dirAttrRE)) {
                dirName = matched[1];
                arg = matched[2];

                // skip v-else (when used with v-show)
                if (dirName === 'else') {
                  continue;
                }

                dirDef = resolveAsset(options, 'directives', dirName, true);
                if (dirDef) {
                  pushDir(dirName, dirDef);
                }
              }
    }

    /**
     * Push a directive.
     *
     * @param {String} dirName
     * @param {Object|Function} def
     * @param {Array} [interpTokens]
     */

    function pushDir(dirName, def, interpTokens) {
      var hasOneTimeToken = interpTokens && hasOneTime(interpTokens);
      var parsed = !hasOneTimeToken && parseDirective(value);
      dirs.push({
        name: dirName,
        attr: rawName,
        raw: rawValue,
        def: def,
        arg: arg,
        modifiers: modifiers,
        // conversion from interpolation strings with one-time token
        // to expression is differed until directive bind time so that we
        // have access to the actual vm context for one-time bindings.
        expression: parsed && parsed.expression,
        filters: parsed && parsed.filters,
        interp: interpTokens,
        hasOneTime: hasOneTimeToken
      });
    }

    if (dirs.length) {
      return makeNodeLinkFn(dirs);
    }
  }

  /**
   * Parse modifiers from directive attribute name.
   *
   * @param {String} name
   * @return {Object}
   */

  function parseModifiers(name) {
    var res = Object.create(null);
    var match = name.match(modifierRE);
    if (match) {
      var i = match.length;
      while (i--) {
        res[match[i].slice(1)] = true;
      }
    }
    return res;
  }

  /**
   * Build a link function for all directives on a single node.
   *
   * @param {Array} directives
   * @return {Function} directivesLinkFn
   */

  function makeNodeLinkFn(directives) {
    return function nodeLinkFn(vm, el, host, scope, frag) {
      // reverse apply because it's sorted low to high
      var i = directives.length;
      while (i--) {
        vm._bindDir(directives[i], el, host, scope, frag);
      }
    };
  }

  /**
   * Check if an interpolation string contains one-time tokens.
   *
   * @param {Array} tokens
   * @return {Boolean}
   */

  function hasOneTime(tokens) {
    var i = tokens.length;
    while (i--) {
      if (tokens[i].oneTime) return true;
    }
  }

  function isScript(el) {
    return el.tagName === 'SCRIPT' && (!el.hasAttribute('type') || el.getAttribute('type') === 'text/javascript');
  }

  var specialCharRE = /[^\w\-:\.]/;

  /**
   * Process an element or a DocumentFragment based on a
   * instance option object. This allows us to transclude
   * a template node/fragment before the instance is created,
   * so the processed fragment can then be cloned and reused
   * in v-for.
   *
   * @param {Element} el
   * @param {Object} options
   * @return {Element|DocumentFragment}
   */

  function transclude(el, options) {
    // extract container attributes to pass them down
    // to compiler, because they need to be compiled in
    // parent scope. we are mutating the options object here
    // assuming the same object will be used for compile
    // right after this.
    if (options) {
      options._containerAttrs = extractAttrs(el);
    }
    // for template tags, what we want is its content as
    // a documentFragment (for fragment instances)
    if (isTemplate(el)) {
      el = parseTemplate(el);
    }
    if (options) {
      if (options._asComponent && !options.template) {
        options.template = '<slot></slot>';
      }
      if (options.template) {
        options._content = extractContent(el);
        el = transcludeTemplate(el, options);
      }
    }
    if (isFragment(el)) {
      // anchors for fragment instance
      // passing in `persist: true` to avoid them being
      // discarded by IE during template cloning
      prepend(createAnchor('v-start', true), el);
      el.appendChild(createAnchor('v-end', true));
    }
    return el;
  }

  /**
   * Process the template option.
   * If the replace option is true this will swap the $el.
   *
   * @param {Element} el
   * @param {Object} options
   * @return {Element|DocumentFragment}
   */

  function transcludeTemplate(el, options) {
    var template = options.template;
    var frag = parseTemplate(template, true);
    if (frag) {
      var replacer = frag.firstChild;
      var tag = replacer.tagName && replacer.tagName.toLowerCase();
      if (options.replace) {
        /* istanbul ignore if */
        if (el === document.body) {
          'development' !== 'production' && warn('You are mounting an instance with a template to ' + '<body>. This will replace <body> entirely. You ' + 'should probably use `replace: false` here.');
        }
        // there are many cases where the instance must
        // become a fragment instance: basically anything that
        // can create more than 1 root nodes.
        if (
        // multi-children template
        frag.childNodes.length > 1 ||
        // non-element template
        replacer.nodeType !== 1 ||
        // single nested component
        tag === 'component' || resolveAsset(options, 'components', tag) || hasBindAttr(replacer, 'is') ||
        // element directive
        resolveAsset(options, 'elementDirectives', tag) ||
        // for block
        replacer.hasAttribute('v-for') ||
        // if block
        replacer.hasAttribute('v-if')) {
          return frag;
        } else {
          options._replacerAttrs = extractAttrs(replacer);
          mergeAttrs(el, replacer);
          return replacer;
        }
      } else {
        el.appendChild(frag);
        return el;
      }
    } else {
      'development' !== 'production' && warn('Invalid template option: ' + template);
    }
  }

  /**
   * Helper to extract a component container's attributes
   * into a plain object array.
   *
   * @param {Element} el
   * @return {Array}
   */

  function extractAttrs(el) {
    if (el.nodeType === 1 && el.hasAttributes()) {
      return toArray(el.attributes);
    }
  }

  /**
   * Merge the attributes of two elements, and make sure
   * the class names are merged properly.
   *
   * @param {Element} from
   * @param {Element} to
   */

  function mergeAttrs(from, to) {
    var attrs = from.attributes;
    var i = attrs.length;
    var name, value;
    while (i--) {
      name = attrs[i].name;
      value = attrs[i].value;
      if (!to.hasAttribute(name) && !specialCharRE.test(name)) {
        to.setAttribute(name, value);
      } else if (name === 'class' && !parseText(value) && (value = value.trim())) {
        value.split(/\s+/).forEach(function (cls) {
          addClass(to, cls);
        });
      }
    }
  }

  /**
   * Scan and determine slot content distribution.
   * We do this during transclusion instead at compile time so that
   * the distribution is decoupled from the compilation order of
   * the slots.
   *
   * @param {Element|DocumentFragment} template
   * @param {Element} content
   * @param {Vue} vm
   */

  function resolveSlots(vm, content) {
    if (!content) {
      return;
    }
    var contents = vm._slotContents = Object.create(null);
    var el, name;
    for (var i = 0, l = content.children.length; i < l; i++) {
      el = content.children[i];
      /* eslint-disable no-cond-assign */
      if (name = el.getAttribute('slot')) {
        (contents[name] || (contents[name] = [])).push(el);
      }
      /* eslint-enable no-cond-assign */
      if ('development' !== 'production' && getBindAttr(el, 'slot')) {
        warn('The "slot" attribute must be static.', vm.$parent);
      }
    }
    for (name in contents) {
      contents[name] = extractFragment(contents[name], content);
    }
    if (content.hasChildNodes()) {
      var nodes = content.childNodes;
      if (nodes.length === 1 && nodes[0].nodeType === 3 && !nodes[0].data.trim()) {
        return;
      }
      contents['default'] = extractFragment(content.childNodes, content);
    }
  }

  /**
   * Extract qualified content nodes from a node list.
   *
   * @param {NodeList} nodes
   * @return {DocumentFragment}
   */

  function extractFragment(nodes, parent) {
    var frag = document.createDocumentFragment();
    nodes = toArray(nodes);
    for (var i = 0, l = nodes.length; i < l; i++) {
      var node = nodes[i];
      if (isTemplate(node) && !node.hasAttribute('v-if') && !node.hasAttribute('v-for')) {
        parent.removeChild(node);
        node = parseTemplate(node, true);
      }
      frag.appendChild(node);
    }
    return frag;
  }



  var compiler = Object.freeze({
  	compile: compile,
  	compileAndLinkProps: compileAndLinkProps,
  	compileRoot: compileRoot,
  	transclude: transclude,
  	resolveSlots: resolveSlots
  });

  function stateMixin (Vue) {
    /**
     * Accessor for `$data` property, since setting $data
     * requires observing the new object and updating
     * proxied properties.
     */

    Object.defineProperty(Vue.prototype, '$data', {
      get: function get() {
        return this._data;
      },
      set: function set(newData) {
        if (newData !== this._data) {
          this._setData(newData);
        }
      }
    });

    /**
     * Setup the scope of an instance, which contains:
     * - observed data
     * - computed properties
     * - user methods
     * - meta properties
     */

    Vue.prototype._initState = function () {
      this._initProps();
      this._initMeta();
      this._initMethods();
      this._initData();
      this._initComputed();
    };

    /**
     * Initialize props.
     */

    Vue.prototype._initProps = function () {
      var options = this.$options;
      var el = options.el;
      var props = options.props;
      if (props && !el) {
        'development' !== 'production' && warn('Props will not be compiled if no `el` option is ' + 'provided at instantiation.', this);
      }
      // make sure to convert string selectors into element now
      el = options.el = query(el);
      this._propsUnlinkFn = el && el.nodeType === 1 && props
      // props must be linked in proper scope if inside v-for
      ? compileAndLinkProps(this, el, props, this._scope) : null;
    };

    /**
     * Initialize the data.
     */

    Vue.prototype._initData = function () {
      var dataFn = this.$options.data;
      var data = this._data = dataFn ? dataFn() : {};
      if (!isPlainObject(data)) {
        data = {};
        'development' !== 'production' && warn('data functions should return an object.', this);
      }
      var props = this._props;
      // proxy data on instance
      var keys = Object.keys(data);
      var i, key;
      i = keys.length;
      while (i--) {
        key = keys[i];
        // there are two scenarios where we can proxy a data key:
        // 1. it's not already defined as a prop
        // 2. it's provided via a instantiation option AND there are no
        //    template prop present
        if (!props || !hasOwn(props, key)) {
          this._proxy(key);
        } else if ('development' !== 'production') {
          warn('Data field "' + key + '" is already defined ' + 'as a prop. To provide default value for a prop, use the "default" ' + 'prop option; if you want to pass prop values to an instantiation ' + 'call, use the "propsData" option.', this);
        }
      }
      // observe data
      observe(data, this);
    };

    /**
     * Swap the instance's $data. Called in $data's setter.
     *
     * @param {Object} newData
     */

    Vue.prototype._setData = function (newData) {
      newData = newData || {};
      var oldData = this._data;
      this._data = newData;
      var keys, key, i;
      // unproxy keys not present in new data
      keys = Object.keys(oldData);
      i = keys.length;
      while (i--) {
        key = keys[i];
        if (!(key in newData)) {
          this._unproxy(key);
        }
      }
      // proxy keys not already proxied,
      // and trigger change for changed values
      keys = Object.keys(newData);
      i = keys.length;
      while (i--) {
        key = keys[i];
        if (!hasOwn(this, key)) {
          // new property
          this._proxy(key);
        }
      }
      oldData.__ob__.removeVm(this);
      observe(newData, this);
      this._digest();
    };

    /**
     * Proxy a property, so that
     * vm.prop === vm._data.prop
     *
     * @param {String} key
     */

    Vue.prototype._proxy = function (key) {
      if (!isReserved(key)) {
        // need to store ref to self here
        // because these getter/setters might
        // be called by child scopes via
        // prototype inheritance.
        var self = this;
        Object.defineProperty(self, key, {
          configurable: true,
          enumerable: true,
          get: function proxyGetter() {
            return self._data[key];
          },
          set: function proxySetter(val) {
            self._data[key] = val;
          }
        });
      }
    };

    /**
     * Unproxy a property.
     *
     * @param {String} key
     */

    Vue.prototype._unproxy = function (key) {
      if (!isReserved(key)) {
        delete this[key];
      }
    };

    /**
     * Force update on every watcher in scope.
     */

    Vue.prototype._digest = function () {
      for (var i = 0, l = this._watchers.length; i < l; i++) {
        this._watchers[i].update(true); // shallow updates
      }
    };

    /**
     * Setup computed properties. They are essentially
     * special getter/setters
     */

    function noop() {}
    Vue.prototype._initComputed = function () {
      var computed = this.$options.computed;
      if (computed) {
        for (var key in computed) {
          var userDef = computed[key];
          var def = {
            enumerable: true,
            configurable: true
          };
          if (typeof userDef === 'function') {
            def.get = makeComputedGetter(userDef, this);
            def.set = noop;
          } else {
            def.get = userDef.get ? userDef.cache !== false ? makeComputedGetter(userDef.get, this) : bind(userDef.get, this) : noop;
            def.set = userDef.set ? bind(userDef.set, this) : noop;
          }
          Object.defineProperty(this, key, def);
        }
      }
    };

    function makeComputedGetter(getter, owner) {
      var watcher = new Watcher(owner, getter, null, {
        lazy: true
      });
      return function computedGetter() {
        if (watcher.dirty) {
          watcher.evaluate();
        }
        if (Dep.target) {
          watcher.depend();
        }
        return watcher.value;
      };
    }

    /**
     * Setup instance methods. Methods must be bound to the
     * instance since they might be passed down as a prop to
     * child components.
     */

    Vue.prototype._initMethods = function () {
      var methods = this.$options.methods;
      if (methods) {
        for (var key in methods) {
          this[key] = bind(methods[key], this);
        }
      }
    };

    /**
     * Initialize meta information like $index, $key & $value.
     */

    Vue.prototype._initMeta = function () {
      var metas = this.$options._meta;
      if (metas) {
        for (var key in metas) {
          defineReactive(this, key, metas[key]);
        }
      }
    };
  }

  var eventRE = /^v-on:|^@/;

  function eventsMixin (Vue) {
    /**
     * Setup the instance's option events & watchers.
     * If the value is a string, we pull it from the
     * instance's methods by name.
     */

    Vue.prototype._initEvents = function () {
      var options = this.$options;
      if (options._asComponent) {
        registerComponentEvents(this, options.el);
      }
      registerCallbacks(this, '$on', options.events);
      registerCallbacks(this, '$watch', options.watch);
    };

    /**
     * Register v-on events on a child component
     *
     * @param {Vue} vm
     * @param {Element} el
     */

    function registerComponentEvents(vm, el) {
      var attrs = el.attributes;
      var name, value, handler;
      for (var i = 0, l = attrs.length; i < l; i++) {
        name = attrs[i].name;
        if (eventRE.test(name)) {
          name = name.replace(eventRE, '');
          // force the expression into a statement so that
          // it always dynamically resolves the method to call (#2670)
          // kinda ugly hack, but does the job.
          value = attrs[i].value;
          if (isSimplePath(value)) {
            value += '.apply(this, $arguments)';
          }
          handler = (vm._scope || vm._context).$eval(value, true);
          handler._fromParent = true;
          vm.$on(name.replace(eventRE), handler);
        }
      }
    }

    /**
     * Register callbacks for option events and watchers.
     *
     * @param {Vue} vm
     * @param {String} action
     * @param {Object} hash
     */

    function registerCallbacks(vm, action, hash) {
      if (!hash) return;
      var handlers, key, i, j;
      for (key in hash) {
        handlers = hash[key];
        if (isArray(handlers)) {
          for (i = 0, j = handlers.length; i < j; i++) {
            register(vm, action, key, handlers[i]);
          }
        } else {
          register(vm, action, key, handlers);
        }
      }
    }

    /**
     * Helper to register an event/watch callback.
     *
     * @param {Vue} vm
     * @param {String} action
     * @param {String} key
     * @param {Function|String|Object} handler
     * @param {Object} [options]
     */

    function register(vm, action, key, handler, options) {
      var type = typeof handler;
      if (type === 'function') {
        vm[action](key, handler, options);
      } else if (type === 'string') {
        var methods = vm.$options.methods;
        var method = methods && methods[handler];
        if (method) {
          vm[action](key, method, options);
        } else {
          'development' !== 'production' && warn('Unknown method: "' + handler + '" when ' + 'registering callback for ' + action + ': "' + key + '".', vm);
        }
      } else if (handler && type === 'object') {
        register(vm, action, key, handler.handler, handler);
      }
    }

    /**
     * Setup recursive attached/detached calls
     */

    Vue.prototype._initDOMHooks = function () {
      this.$on('hook:attached', onAttached);
      this.$on('hook:detached', onDetached);
    };

    /**
     * Callback to recursively call attached hook on children
     */

    function onAttached() {
      if (!this._isAttached) {
        this._isAttached = true;
        this.$children.forEach(callAttach);
      }
    }

    /**
     * Iterator to call attached hook
     *
     * @param {Vue} child
     */

    function callAttach(child) {
      if (!child._isAttached && inDoc(child.$el)) {
        child._callHook('attached');
      }
    }

    /**
     * Callback to recursively call detached hook on children
     */

    function onDetached() {
      if (this._isAttached) {
        this._isAttached = false;
        this.$children.forEach(callDetach);
      }
    }

    /**
     * Iterator to call detached hook
     *
     * @param {Vue} child
     */

    function callDetach(child) {
      if (child._isAttached && !inDoc(child.$el)) {
        child._callHook('detached');
      }
    }

    /**
     * Trigger all handlers for a hook
     *
     * @param {String} hook
     */

    Vue.prototype._callHook = function (hook) {
      this.$emit('pre-hook:' + hook);
      var handlers = this.$options[hook];
      if (handlers) {
        for (var i = 0, j = handlers.length; i < j; i++) {
          handlers[i].call(this);
        }
      }
      this.$emit('hook:' + hook);
    };
  }

  function noop$1() {}

  /**
   * A directive links a DOM element with a piece of data,
   * which is the result of evaluating an expression.
   * It registers a watcher with the expression and calls
   * the DOM update function when a change is triggered.
   *
   * @param {Object} descriptor
   *                 - {String} name
   *                 - {Object} def
   *                 - {String} expression
   *                 - {Array<Object>} [filters]
   *                 - {Object} [modifiers]
   *                 - {Boolean} literal
   *                 - {String} attr
   *                 - {String} arg
   *                 - {String} raw
   *                 - {String} [ref]
   *                 - {Array<Object>} [interp]
   *                 - {Boolean} [hasOneTime]
   * @param {Vue} vm
   * @param {Node} el
   * @param {Vue} [host] - transclusion host component
   * @param {Object} [scope] - v-for scope
   * @param {Fragment} [frag] - owner fragment
   * @constructor
   */
  function Directive(descriptor, vm, el, host, scope, frag) {
    this.vm = vm;
    this.el = el;
    // copy descriptor properties
    this.descriptor = descriptor;
    this.name = descriptor.name;
    this.expression = descriptor.expression;
    this.arg = descriptor.arg;
    this.modifiers = descriptor.modifiers;
    this.filters = descriptor.filters;
    this.literal = this.modifiers && this.modifiers.literal;
    // private
    this._locked = false;
    this._bound = false;
    this._listeners = null;
    // link context
    this._host = host;
    this._scope = scope;
    this._frag = frag;
    // store directives on node in dev mode
    if ('development' !== 'production' && this.el) {
      this.el._vue_directives = this.el._vue_directives || [];
      this.el._vue_directives.push(this);
    }
  }

  /**
   * Initialize the directive, mixin definition properties,
   * setup the watcher, call definition bind() and update()
   * if present.
   */

  Directive.prototype._bind = function () {
    var name = this.name;
    var descriptor = this.descriptor;

    // remove attribute
    if ((name !== 'cloak' || this.vm._isCompiled) && this.el && this.el.removeAttribute) {
      var attr = descriptor.attr || 'v-' + name;
      this.el.removeAttribute(attr);
    }

    // copy def properties
    var def = descriptor.def;
    if (typeof def === 'function') {
      this.update = def;
    } else {
      extend(this, def);
    }

    // setup directive params
    this._setupParams();

    // initial bind
    if (this.bind) {
      this.bind();
    }
    this._bound = true;

    if (this.literal) {
      this.update && this.update(descriptor.raw);
    } else if ((this.expression || this.modifiers) && (this.update || this.twoWay) && !this._checkStatement()) {
      // wrapped updater for context
      var dir = this;
      if (this.update) {
        this._update = function (val, oldVal) {
          if (!dir._locked) {
            dir.update(val, oldVal);
          }
        };
      } else {
        this._update = noop$1;
      }
      var preProcess = this._preProcess ? bind(this._preProcess, this) : null;
      var postProcess = this._postProcess ? bind(this._postProcess, this) : null;
      var watcher = this._watcher = new Watcher(this.vm, this.expression, this._update, // callback
      {
        filters: this.filters,
        twoWay: this.twoWay,
        deep: this.deep,
        preProcess: preProcess,
        postProcess: postProcess,
        scope: this._scope
      });
      // v-model with inital inline value need to sync back to
      // model instead of update to DOM on init. They would
      // set the afterBind hook to indicate that.
      if (this.afterBind) {
        this.afterBind();
      } else if (this.update) {
        this.update(watcher.value);
      }
    }
  };

  /**
   * Setup all param attributes, e.g. track-by,
   * transition-mode, etc...
   */

  Directive.prototype._setupParams = function () {
    if (!this.params) {
      return;
    }
    var params = this.params;
    // swap the params array with a fresh object.
    this.params = Object.create(null);
    var i = params.length;
    var key, val, mappedKey;
    while (i--) {
      key = hyphenate(params[i]);
      mappedKey = camelize(key);
      val = getBindAttr(this.el, key);
      if (val != null) {
        // dynamic
        this._setupParamWatcher(mappedKey, val);
      } else {
        // static
        val = getAttr(this.el, key);
        if (val != null) {
          this.params[mappedKey] = val === '' ? true : val;
        }
      }
    }
  };

  /**
   * Setup a watcher for a dynamic param.
   *
   * @param {String} key
   * @param {String} expression
   */

  Directive.prototype._setupParamWatcher = function (key, expression) {
    var self = this;
    var called = false;
    var unwatch = (this._scope || this.vm).$watch(expression, function (val, oldVal) {
      self.params[key] = val;
      // since we are in immediate mode,
      // only call the param change callbacks if this is not the first update.
      if (called) {
        var cb = self.paramWatchers && self.paramWatchers[key];
        if (cb) {
          cb.call(self, val, oldVal);
        }
      } else {
        called = true;
      }
    }, {
      immediate: true,
      user: false
    });(this._paramUnwatchFns || (this._paramUnwatchFns = [])).push(unwatch);
  };

  /**
   * Check if the directive is a function caller
   * and if the expression is a callable one. If both true,
   * we wrap up the expression and use it as the event
   * handler.
   *
   * e.g. on-click="a++"
   *
   * @return {Boolean}
   */

  Directive.prototype._checkStatement = function () {
    var expression = this.expression;
    if (expression && this.acceptStatement && !isSimplePath(expression)) {
      var fn = parseExpression(expression).get;
      var scope = this._scope || this.vm;
      var handler = function handler(e) {
        scope.$event = e;
        fn.call(scope, scope);
        scope.$event = null;
      };
      if (this.filters) {
        handler = scope._applyFilters(handler, null, this.filters);
      }
      this.update(handler);
      return true;
    }
  };

  /**
   * Set the corresponding value with the setter.
   * This should only be used in two-way directives
   * e.g. v-model.
   *
   * @param {*} value
   * @public
   */

  Directive.prototype.set = function (value) {
    /* istanbul ignore else */
    if (this.twoWay) {
      this._withLock(function () {
        this._watcher.set(value);
      });
    } else if ('development' !== 'production') {
      warn('Directive.set() can only be used inside twoWay' + 'directives.');
    }
  };

  /**
   * Execute a function while preventing that function from
   * triggering updates on this directive instance.
   *
   * @param {Function} fn
   */

  Directive.prototype._withLock = function (fn) {
    var self = this;
    self._locked = true;
    fn.call(self);
    nextTick(function () {
      self._locked = false;
    });
  };

  /**
   * Convenience method that attaches a DOM event listener
   * to the directive element and autometically tears it down
   * during unbind.
   *
   * @param {String} event
   * @param {Function} handler
   * @param {Boolean} [useCapture]
   */

  Directive.prototype.on = function (event, handler, useCapture) {
    on(this.el, event, handler, useCapture);(this._listeners || (this._listeners = [])).push([event, handler]);
  };

  /**
   * Teardown the watcher and call unbind.
   */

  Directive.prototype._teardown = function () {
    if (this._bound) {
      this._bound = false;
      if (this.unbind) {
        this.unbind();
      }
      if (this._watcher) {
        this._watcher.teardown();
      }
      var listeners = this._listeners;
      var i;
      if (listeners) {
        i = listeners.length;
        while (i--) {
          off(this.el, listeners[i][0], listeners[i][1]);
        }
      }
      var unwatchFns = this._paramUnwatchFns;
      if (unwatchFns) {
        i = unwatchFns.length;
        while (i--) {
          unwatchFns[i]();
        }
      }
      if ('development' !== 'production' && this.el) {
        this.el._vue_directives.$remove(this);
      }
      this.vm = this.el = this._watcher = this._listeners = null;
    }
  };

  function lifecycleMixin (Vue) {
    /**
     * Update v-ref for component.
     *
     * @param {Boolean} remove
     */

    Vue.prototype._updateRef = function (remove) {
      var ref = this.$options._ref;
      if (ref) {
        var refs = (this._scope || this._context).$refs;
        if (remove) {
          if (refs[ref] === this) {
            refs[ref] = null;
          }
        } else {
          refs[ref] = this;
        }
      }
    };

    /**
     * Transclude, compile and link element.
     *
     * If a pre-compiled linker is available, that means the
     * passed in element will be pre-transcluded and compiled
     * as well - all we need to do is to call the linker.
     *
     * Otherwise we need to call transclude/compile/link here.
     *
     * @param {Element} el
     */

    Vue.prototype._compile = function (el) {
      var options = this.$options;

      // transclude and init element
      // transclude can potentially replace original
      // so we need to keep reference; this step also injects
      // the template and caches the original attributes
      // on the container node and replacer node.
      var original = el;
      el = transclude(el, options);
      this._initElement(el);

      // handle v-pre on root node (#2026)
      if (el.nodeType === 1 && getAttr(el, 'v-pre') !== null) {
        return;
      }

      // root is always compiled per-instance, because
      // container attrs and props can be different every time.
      var contextOptions = this._context && this._context.$options;
      var rootLinker = compileRoot(el, options, contextOptions);

      // resolve slot distribution
      resolveSlots(this, options._content);

      // compile and link the rest
      var contentLinkFn;
      var ctor = this.constructor;
      // component compilation can be cached
      // as long as it's not using inline-template
      if (options._linkerCachable) {
        contentLinkFn = ctor.linker;
        if (!contentLinkFn) {
          contentLinkFn = ctor.linker = compile(el, options);
        }
      }

      // link phase
      // make sure to link root with prop scope!
      var rootUnlinkFn = rootLinker(this, el, this._scope);
      var contentUnlinkFn = contentLinkFn ? contentLinkFn(this, el) : compile(el, options)(this, el);

      // register composite unlink function
      // to be called during instance destruction
      this._unlinkFn = function () {
        rootUnlinkFn();
        // passing destroying: true to avoid searching and
        // splicing the directives
        contentUnlinkFn(true);
      };

      // finally replace original
      if (options.replace) {
        replace(original, el);
      }

      this._isCompiled = true;
      this._callHook('compiled');
    };

    /**
     * Initialize instance element. Called in the public
     * $mount() method.
     *
     * @param {Element} el
     */

    Vue.prototype._initElement = function (el) {
      if (isFragment(el)) {
        this._isFragment = true;
        this.$el = this._fragmentStart = el.firstChild;
        this._fragmentEnd = el.lastChild;
        // set persisted text anchors to empty
        if (this._fragmentStart.nodeType === 3) {
          this._fragmentStart.data = this._fragmentEnd.data = '';
        }
        this._fragment = el;
      } else {
        this.$el = el;
      }
      this.$el.__vue__ = this;
      this._callHook('beforeCompile');
    };

    /**
     * Create and bind a directive to an element.
     *
     * @param {Object} descriptor - parsed directive descriptor
     * @param {Node} node   - target node
     * @param {Vue} [host] - transclusion host component
     * @param {Object} [scope] - v-for scope
     * @param {Fragment} [frag] - owner fragment
     */

    Vue.prototype._bindDir = function (descriptor, node, host, scope, frag) {
      this._directives.push(new Directive(descriptor, this, node, host, scope, frag));
    };

    /**
     * Teardown an instance, unobserves the data, unbind all the
     * directives, turn off all the event listeners, etc.
     *
     * @param {Boolean} remove - whether to remove the DOM node.
     * @param {Boolean} deferCleanup - if true, defer cleanup to
     *                                 be called later
     */

    Vue.prototype._destroy = function (remove, deferCleanup) {
      if (this._isBeingDestroyed) {
        if (!deferCleanup) {
          this._cleanup();
        }
        return;
      }

      var destroyReady;
      var pendingRemoval;

      var self = this;
      // Cleanup should be called either synchronously or asynchronoysly as
      // callback of this.$remove(), or if remove and deferCleanup are false.
      // In any case it should be called after all other removing, unbinding and
      // turning of is done
      var cleanupIfPossible = function cleanupIfPossible() {
        if (destroyReady && !pendingRemoval && !deferCleanup) {
          self._cleanup();
        }
      };

      // remove DOM element
      if (remove && this.$el) {
        pendingRemoval = true;
        this.$remove(function () {
          pendingRemoval = false;
          cleanupIfPossible();
        });
      }

      this._callHook('beforeDestroy');
      this._isBeingDestroyed = true;
      var i;
      // remove self from parent. only necessary
      // if parent is not being destroyed as well.
      var parent = this.$parent;
      if (parent && !parent._isBeingDestroyed) {
        parent.$children.$remove(this);
        // unregister ref (remove: true)
        this._updateRef(true);
      }
      // destroy all children.
      i = this.$children.length;
      while (i--) {
        this.$children[i].$destroy();
      }
      // teardown props
      if (this._propsUnlinkFn) {
        this._propsUnlinkFn();
      }
      // teardown all directives. this also tearsdown all
      // directive-owned watchers.
      if (this._unlinkFn) {
        this._unlinkFn();
      }
      i = this._watchers.length;
      while (i--) {
        this._watchers[i].teardown();
      }
      // remove reference to self on $el
      if (this.$el) {
        this.$el.__vue__ = null;
      }

      destroyReady = true;
      cleanupIfPossible();
    };

    /**
     * Clean up to ensure garbage collection.
     * This is called after the leave transition if there
     * is any.
     */

    Vue.prototype._cleanup = function () {
      if (this._isDestroyed) {
        return;
      }
      // remove self from owner fragment
      // do it in cleanup so that we can call $destroy with
      // defer right when a fragment is about to be removed.
      if (this._frag) {
        this._frag.children.$remove(this);
      }
      // remove reference from data ob
      // frozen object may not have observer.
      if (this._data && this._data.__ob__) {
        this._data.__ob__.removeVm(this);
      }
      // Clean up references to private properties and other
      // instances. preserve reference to _data so that proxy
      // accessors still work. The only potential side effect
      // here is that mutating the instance after it's destroyed
      // may affect the state of other components that are still
      // observing the same object, but that seems to be a
      // reasonable responsibility for the user rather than
      // always throwing an error on them.
      this.$el = this.$parent = this.$root = this.$children = this._watchers = this._context = this._scope = this._directives = null;
      // call the last hook...
      this._isDestroyed = true;
      this._callHook('destroyed');
      // turn off all instance listeners.
      this.$off();
    };
  }

  function miscMixin (Vue) {
    /**
     * Apply a list of filter (descriptors) to a value.
     * Using plain for loops here because this will be called in
     * the getter of any watcher with filters so it is very
     * performance sensitive.
     *
     * @param {*} value
     * @param {*} [oldValue]
     * @param {Array} filters
     * @param {Boolean} write
     * @return {*}
     */

    Vue.prototype._applyFilters = function (value, oldValue, filters, write) {
      var filter, fn, args, arg, offset, i, l, j, k;
      for (i = 0, l = filters.length; i < l; i++) {
        filter = filters[write ? l - i - 1 : i];
        fn = resolveAsset(this.$options, 'filters', filter.name, true);
        if (!fn) continue;
        fn = write ? fn.write : fn.read || fn;
        if (typeof fn !== 'function') continue;
        args = write ? [value, oldValue] : [value];
        offset = write ? 2 : 1;
        if (filter.args) {
          for (j = 0, k = filter.args.length; j < k; j++) {
            arg = filter.args[j];
            args[j + offset] = arg.dynamic ? this.$get(arg.value) : arg.value;
          }
        }
        value = fn.apply(this, args);
      }
      return value;
    };

    /**
     * Resolve a component, depending on whether the component
     * is defined normally or using an async factory function.
     * Resolves synchronously if already resolved, otherwise
     * resolves asynchronously and caches the resolved
     * constructor on the factory.
     *
     * @param {String|Function} value
     * @param {Function} cb
     */

    Vue.prototype._resolveComponent = function (value, cb) {
      var factory;
      if (typeof value === 'function') {
        factory = value;
      } else {
        factory = resolveAsset(this.$options, 'components', value, true);
      }
      /* istanbul ignore if */
      if (!factory) {
        return;
      }
      // async component factory
      if (!factory.options) {
        if (factory.resolved) {
          // cached
          cb(factory.resolved);
        } else if (factory.requested) {
          // pool callbacks
          factory.pendingCallbacks.push(cb);
        } else {
          factory.requested = true;
          var cbs = factory.pendingCallbacks = [cb];
          factory.call(this, function resolve(res) {
            if (isPlainObject(res)) {
              res = Vue.extend(res);
            }
            // cache resolved
            factory.resolved = res;
            // invoke callbacks
            for (var i = 0, l = cbs.length; i < l; i++) {
              cbs[i](res);
            }
          }, function reject(reason) {
            'development' !== 'production' && warn('Failed to resolve async component' + (typeof value === 'string' ? ': ' + value : '') + '. ' + (reason ? '\nReason: ' + reason : ''));
          });
        }
      } else {
        // normal component
        cb(factory);
      }
    };
  }

  var filterRE$1 = /[^|]\|[^|]/;

  function dataAPI (Vue) {
    /**
     * Get the value from an expression on this vm.
     *
     * @param {String} exp
     * @param {Boolean} [asStatement]
     * @return {*}
     */

    Vue.prototype.$get = function (exp, asStatement) {
      var res = parseExpression(exp);
      if (res) {
        if (asStatement) {
          var self = this;
          return function statementHandler() {
            self.$arguments = toArray(arguments);
            var result = res.get.call(self, self);
            self.$arguments = null;
            return result;
          };
        } else {
          try {
            return res.get.call(this, this);
          } catch (e) {}
        }
      }
    };

    /**
     * Set the value from an expression on this vm.
     * The expression must be a valid left-hand
     * expression in an assignment.
     *
     * @param {String} exp
     * @param {*} val
     */

    Vue.prototype.$set = function (exp, val) {
      var res = parseExpression(exp, true);
      if (res && res.set) {
        res.set.call(this, this, val);
      }
    };

    /**
     * Delete a property on the VM
     *
     * @param {String} key
     */

    Vue.prototype.$delete = function (key) {
      del(this._data, key);
    };

    /**
     * Watch an expression, trigger callback when its
     * value changes.
     *
     * @param {String|Function} expOrFn
     * @param {Function} cb
     * @param {Object} [options]
     *                 - {Boolean} deep
     *                 - {Boolean} immediate
     * @return {Function} - unwatchFn
     */

    Vue.prototype.$watch = function (expOrFn, cb, options) {
      var vm = this;
      var parsed;
      if (typeof expOrFn === 'string') {
        parsed = parseDirective(expOrFn);
        expOrFn = parsed.expression;
      }
      var watcher = new Watcher(vm, expOrFn, cb, {
        deep: options && options.deep,
        sync: options && options.sync,
        filters: parsed && parsed.filters,
        user: !options || options.user !== false
      });
      if (options && options.immediate) {
        cb.call(vm, watcher.value);
      }
      return function unwatchFn() {
        watcher.teardown();
      };
    };

    /**
     * Evaluate a text directive, including filters.
     *
     * @param {String} text
     * @param {Boolean} [asStatement]
     * @return {String}
     */

    Vue.prototype.$eval = function (text, asStatement) {
      // check for filters.
      if (filterRE$1.test(text)) {
        var dir = parseDirective(text);
        // the filter regex check might give false positive
        // for pipes inside strings, so it's possible that
        // we don't get any filters here
        var val = this.$get(dir.expression, asStatement);
        return dir.filters ? this._applyFilters(val, null, dir.filters) : val;
      } else {
        // no filter
        return this.$get(text, asStatement);
      }
    };

    /**
     * Interpolate a piece of template text.
     *
     * @param {String} text
     * @return {String}
     */

    Vue.prototype.$interpolate = function (text) {
      var tokens = parseText(text);
      var vm = this;
      if (tokens) {
        if (tokens.length === 1) {
          return vm.$eval(tokens[0].value) + '';
        } else {
          return tokens.map(function (token) {
            return token.tag ? vm.$eval(token.value) : token.value;
          }).join('');
        }
      } else {
        return text;
      }
    };

    /**
     * Log instance data as a plain JS object
     * so that it is easier to inspect in console.
     * This method assumes console is available.
     *
     * @param {String} [path]
     */

    Vue.prototype.$log = function (path) {
      var data = path ? getPath(this._data, path) : this._data;
      if (data) {
        data = clean(data);
      }
      // include computed fields
      if (!path) {
        var key;
        for (key in this.$options.computed) {
          data[key] = clean(this[key]);
        }
        if (this._props) {
          for (key in this._props) {
            data[key] = clean(this[key]);
          }
        }
      }
      console.log(data);
    };

    /**
     * "clean" a getter/setter converted object into a plain
     * object copy.
     *
     * @param {Object} - obj
     * @return {Object}
     */

    function clean(obj) {
      return JSON.parse(JSON.stringify(obj));
    }
  }

  function domAPI (Vue) {
    /**
     * Convenience on-instance nextTick. The callback is
     * auto-bound to the instance, and this avoids component
     * modules having to rely on the global Vue.
     *
     * @param {Function} fn
     */

    Vue.prototype.$nextTick = function (fn) {
      nextTick(fn, this);
    };

    /**
     * Append instance to target
     *
     * @param {Node} target
     * @param {Function} [cb]
     * @param {Boolean} [withTransition] - defaults to true
     */

    Vue.prototype.$appendTo = function (target, cb, withTransition) {
      return insert(this, target, cb, withTransition, append, appendWithTransition);
    };

    /**
     * Prepend instance to target
     *
     * @param {Node} target
     * @param {Function} [cb]
     * @param {Boolean} [withTransition] - defaults to true
     */

    Vue.prototype.$prependTo = function (target, cb, withTransition) {
      target = query(target);
      if (target.hasChildNodes()) {
        this.$before(target.firstChild, cb, withTransition);
      } else {
        this.$appendTo(target, cb, withTransition);
      }
      return this;
    };

    /**
     * Insert instance before target
     *
     * @param {Node} target
     * @param {Function} [cb]
     * @param {Boolean} [withTransition] - defaults to true
     */

    Vue.prototype.$before = function (target, cb, withTransition) {
      return insert(this, target, cb, withTransition, beforeWithCb, beforeWithTransition);
    };

    /**
     * Insert instance after target
     *
     * @param {Node} target
     * @param {Function} [cb]
     * @param {Boolean} [withTransition] - defaults to true
     */

    Vue.prototype.$after = function (target, cb, withTransition) {
      target = query(target);
      if (target.nextSibling) {
        this.$before(target.nextSibling, cb, withTransition);
      } else {
        this.$appendTo(target.parentNode, cb, withTransition);
      }
      return this;
    };

    /**
     * Remove instance from DOM
     *
     * @param {Function} [cb]
     * @param {Boolean} [withTransition] - defaults to true
     */

    Vue.prototype.$remove = function (cb, withTransition) {
      if (!this.$el.parentNode) {
        return cb && cb();
      }
      var inDocument = this._isAttached && inDoc(this.$el);
      // if we are not in document, no need to check
      // for transitions
      if (!inDocument) withTransition = false;
      var self = this;
      var realCb = function realCb() {
        if (inDocument) self._callHook('detached');
        if (cb) cb();
      };
      if (this._isFragment) {
        removeNodeRange(this._fragmentStart, this._fragmentEnd, this, this._fragment, realCb);
      } else {
        var op = withTransition === false ? removeWithCb : removeWithTransition;
        op(this.$el, this, realCb);
      }
      return this;
    };

    /**
     * Shared DOM insertion function.
     *
     * @param {Vue} vm
     * @param {Element} target
     * @param {Function} [cb]
     * @param {Boolean} [withTransition]
     * @param {Function} op1 - op for non-transition insert
     * @param {Function} op2 - op for transition insert
     * @return vm
     */

    function insert(vm, target, cb, withTransition, op1, op2) {
      target = query(target);
      var targetIsDetached = !inDoc(target);
      var op = withTransition === false || targetIsDetached ? op1 : op2;
      var shouldCallHook = !targetIsDetached && !vm._isAttached && !inDoc(vm.$el);
      if (vm._isFragment) {
        mapNodeRange(vm._fragmentStart, vm._fragmentEnd, function (node) {
          op(node, target, vm);
        });
        cb && cb();
      } else {
        op(vm.$el, target, vm, cb);
      }
      if (shouldCallHook) {
        vm._callHook('attached');
      }
      return vm;
    }

    /**
     * Check for selectors
     *
     * @param {String|Element} el
     */

    function query(el) {
      return typeof el === 'string' ? document.querySelector(el) : el;
    }

    /**
     * Append operation that takes a callback.
     *
     * @param {Node} el
     * @param {Node} target
     * @param {Vue} vm - unused
     * @param {Function} [cb]
     */

    function append(el, target, vm, cb) {
      target.appendChild(el);
      if (cb) cb();
    }

    /**
     * InsertBefore operation that takes a callback.
     *
     * @param {Node} el
     * @param {Node} target
     * @param {Vue} vm - unused
     * @param {Function} [cb]
     */

    function beforeWithCb(el, target, vm, cb) {
      before(el, target);
      if (cb) cb();
    }

    /**
     * Remove operation that takes a callback.
     *
     * @param {Node} el
     * @param {Vue} vm - unused
     * @param {Function} [cb]
     */

    function removeWithCb(el, vm, cb) {
      remove(el);
      if (cb) cb();
    }
  }

  function eventsAPI (Vue) {
    /**
     * Listen on the given `event` with `fn`.
     *
     * @param {String} event
     * @param {Function} fn
     */

    Vue.prototype.$on = function (event, fn) {
      (this._events[event] || (this._events[event] = [])).push(fn);
      modifyListenerCount(this, event, 1);
      return this;
    };

    /**
     * Adds an `event` listener that will be invoked a single
     * time then automatically removed.
     *
     * @param {String} event
     * @param {Function} fn
     */

    Vue.prototype.$once = function (event, fn) {
      var self = this;
      function on() {
        self.$off(event, on);
        fn.apply(this, arguments);
      }
      on.fn = fn;
      this.$on(event, on);
      return this;
    };

    /**
     * Remove the given callback for `event` or all
     * registered callbacks.
     *
     * @param {String} event
     * @param {Function} fn
     */

    Vue.prototype.$off = function (event, fn) {
      var cbs;
      // all
      if (!arguments.length) {
        if (this.$parent) {
          for (event in this._events) {
            cbs = this._events[event];
            if (cbs) {
              modifyListenerCount(this, event, -cbs.length);
            }
          }
        }
        this._events = {};
        return this;
      }
      // specific event
      cbs = this._events[event];
      if (!cbs) {
        return this;
      }
      if (arguments.length === 1) {
        modifyListenerCount(this, event, -cbs.length);
        this._events[event] = null;
        return this;
      }
      // specific handler
      var cb;
      var i = cbs.length;
      while (i--) {
        cb = cbs[i];
        if (cb === fn || cb.fn === fn) {
          modifyListenerCount(this, event, -1);
          cbs.splice(i, 1);
          break;
        }
      }
      return this;
    };

    /**
     * Trigger an event on self.
     *
     * @param {String|Object} event
     * @return {Boolean} shouldPropagate
     */

    Vue.prototype.$emit = function (event) {
      var isSource = typeof event === 'string';
      event = isSource ? event : event.name;
      var cbs = this._events[event];
      var shouldPropagate = isSource || !cbs;
      if (cbs) {
        cbs = cbs.length > 1 ? toArray(cbs) : cbs;
        // this is a somewhat hacky solution to the question raised
        // in #2102: for an inline component listener like <comp @test="doThis">,
        // the propagation handling is somewhat broken. Therefore we
        // need to treat these inline callbacks differently.
        var hasParentCbs = isSource && cbs.some(function (cb) {
          return cb._fromParent;
        });
        if (hasParentCbs) {
          shouldPropagate = false;
        }
        var args = toArray(arguments, 1);
        for (var i = 0, l = cbs.length; i < l; i++) {
          var cb = cbs[i];
          var res = cb.apply(this, args);
          if (res === true && (!hasParentCbs || cb._fromParent)) {
            shouldPropagate = true;
          }
        }
      }
      return shouldPropagate;
    };

    /**
     * Recursively broadcast an event to all children instances.
     *
     * @param {String|Object} event
     * @param {...*} additional arguments
     */

    Vue.prototype.$broadcast = function (event) {
      var isSource = typeof event === 'string';
      event = isSource ? event : event.name;
      // if no child has registered for this event,
      // then there's no need to broadcast.
      if (!this._eventsCount[event]) return;
      var children = this.$children;
      var args = toArray(arguments);
      if (isSource) {
        // use object event to indicate non-source emit
        // on children
        args[0] = { name: event, source: this };
      }
      for (var i = 0, l = children.length; i < l; i++) {
        var child = children[i];
        var shouldPropagate = child.$emit.apply(child, args);
        if (shouldPropagate) {
          child.$broadcast.apply(child, args);
        }
      }
      return this;
    };

    /**
     * Recursively propagate an event up the parent chain.
     *
     * @param {String} event
     * @param {...*} additional arguments
     */

    Vue.prototype.$dispatch = function (event) {
      var shouldPropagate = this.$emit.apply(this, arguments);
      if (!shouldPropagate) return;
      var parent = this.$parent;
      var args = toArray(arguments);
      // use object event to indicate non-source emit
      // on parents
      args[0] = { name: event, source: this };
      while (parent) {
        shouldPropagate = parent.$emit.apply(parent, args);
        parent = shouldPropagate ? parent.$parent : null;
      }
      return this;
    };

    /**
     * Modify the listener counts on all parents.
     * This bookkeeping allows $broadcast to return early when
     * no child has listened to a certain event.
     *
     * @param {Vue} vm
     * @param {String} event
     * @param {Number} count
     */

    var hookRE = /^hook:/;
    function modifyListenerCount(vm, event, count) {
      var parent = vm.$parent;
      // hooks do not get broadcasted so no need
      // to do bookkeeping for them
      if (!parent || !count || hookRE.test(event)) return;
      while (parent) {
        parent._eventsCount[event] = (parent._eventsCount[event] || 0) + count;
        parent = parent.$parent;
      }
    }
  }

  function lifecycleAPI (Vue) {
    /**
     * Set instance target element and kick off the compilation
     * process. The passed in `el` can be a selector string, an
     * existing Element, or a DocumentFragment (for block
     * instances).
     *
     * @param {Element|DocumentFragment|string} el
     * @public
     */

    Vue.prototype.$mount = function (el) {
      if (this._isCompiled) {
        'development' !== 'production' && warn('$mount() should be called only once.', this);
        return;
      }
      el = query(el);
      if (!el) {
        el = document.createElement('div');
      }
      this._compile(el);
      this._initDOMHooks();
      if (inDoc(this.$el)) {
        this._callHook('attached');
        ready.call(this);
      } else {
        this.$once('hook:attached', ready);
      }
      return this;
    };

    /**
     * Mark an instance as ready.
     */

    function ready() {
      this._isAttached = true;
      this._isReady = true;
      this._callHook('ready');
    }

    /**
     * Teardown the instance, simply delegate to the internal
     * _destroy.
     *
     * @param {Boolean} remove
     * @param {Boolean} deferCleanup
     */

    Vue.prototype.$destroy = function (remove, deferCleanup) {
      this._destroy(remove, deferCleanup);
    };

    /**
     * Partially compile a piece of DOM and return a
     * decompile function.
     *
     * @param {Element|DocumentFragment} el
     * @param {Vue} [host]
     * @param {Object} [scope]
     * @param {Fragment} [frag]
     * @return {Function}
     */

    Vue.prototype.$compile = function (el, host, scope, frag) {
      return compile(el, this.$options, true)(this, el, host, scope, frag);
    };
  }

  /**
   * The exposed Vue constructor.
   *
   * API conventions:
   * - public API methods/properties are prefixed with `$`
   * - internal methods/properties are prefixed with `_`
   * - non-prefixed properties are assumed to be proxied user
   *   data.
   *
   * @constructor
   * @param {Object} [options]
   * @public
   */

  function Vue(options) {
    this._init(options);
  }

  // install internals
  initMixin(Vue);
  stateMixin(Vue);
  eventsMixin(Vue);
  lifecycleMixin(Vue);
  miscMixin(Vue);

  // install instance APIs
  dataAPI(Vue);
  domAPI(Vue);
  eventsAPI(Vue);
  lifecycleAPI(Vue);

  var slot = {

    priority: SLOT,
    params: ['name'],

    bind: function bind() {
      // this was resolved during component transclusion
      var name = this.params.name || 'default';
      var content = this.vm._slotContents && this.vm._slotContents[name];
      if (!content || !content.hasChildNodes()) {
        this.fallback();
      } else {
        this.compile(content.cloneNode(true), this.vm._context, this.vm);
      }
    },

    compile: function compile(content, context, host) {
      if (content && context) {
        if (this.el.hasChildNodes() && content.childNodes.length === 1 && content.childNodes[0].nodeType === 1 && content.childNodes[0].hasAttribute('v-if')) {
          // if the inserted slot has v-if
          // inject fallback content as the v-else
          var elseBlock = document.createElement('template');
          elseBlock.setAttribute('v-else', '');
          elseBlock.innerHTML = this.el.innerHTML;
          // the else block should be compiled in child scope
          elseBlock._context = this.vm;
          content.appendChild(elseBlock);
        }
        var scope = host ? host._scope : this._scope;
        this.unlink = context.$compile(content, host, scope, this._frag);
      }
      if (content) {
        replace(this.el, content);
      } else {
        remove(this.el);
      }
    },

    fallback: function fallback() {
      this.compile(extractContent(this.el, true), this.vm);
    },

    unbind: function unbind() {
      if (this.unlink) {
        this.unlink();
      }
    }
  };

  var partial = {

    priority: PARTIAL,

    params: ['name'],

    // watch changes to name for dynamic partials
    paramWatchers: {
      name: function name(value) {
        vIf.remove.call(this);
        if (value) {
          this.insert(value);
        }
      }
    },

    bind: function bind() {
      this.anchor = createAnchor('v-partial');
      replace(this.el, this.anchor);
      this.insert(this.params.name);
    },

    insert: function insert(id) {
      var partial = resolveAsset(this.vm.$options, 'partials', id, true);
      if (partial) {
        this.factory = new FragmentFactory(this.vm, partial);
        vIf.insert.call(this);
      }
    },

    unbind: function unbind() {
      if (this.frag) {
        this.frag.destroy();
      }
    }
  };

  var elementDirectives = {
    slot: slot,
    partial: partial
  };

  var convertArray = vFor._postProcess;

  /**
   * Limit filter for arrays
   *
   * @param {Number} n
   * @param {Number} offset (Decimal expected)
   */

  function limitBy(arr, n, offset) {
    offset = offset ? parseInt(offset, 10) : 0;
    n = toNumber(n);
    return typeof n === 'number' ? arr.slice(offset, offset + n) : arr;
  }

  /**
   * Filter filter for arrays
   *
   * @param {String} search
   * @param {String} [delimiter]
   * @param {String} ...dataKeys
   */

  function filterBy(arr, search, delimiter) {
    arr = convertArray(arr);
    if (search == null) {
      return arr;
    }
    if (typeof search === 'function') {
      return arr.filter(search);
    }
    // cast to lowercase string
    search = ('' + search).toLowerCase();
    // allow optional `in` delimiter
    // because why not
    var n = delimiter === 'in' ? 3 : 2;
    // extract and flatten keys
    var keys = Array.prototype.concat.apply([], toArray(arguments, n));
    var res = [];
    var item, key, val, j;
    for (var i = 0, l = arr.length; i < l; i++) {
      item = arr[i];
      val = item && item.$value || item;
      j = keys.length;
      if (j) {
        while (j--) {
          key = keys[j];
          if (key === '$key' && contains(item.$key, search) || contains(getPath(val, key), search)) {
            res.push(item);
            break;
          }
        }
      } else if (contains(item, search)) {
        res.push(item);
      }
    }
    return res;
  }

  /**
   * Filter filter for arrays
   *
   * @param {String|Array<String>|Function} ...sortKeys
   * @param {Number} [order]
   */

  function orderBy(arr) {
    var comparator = null;
    var sortKeys = undefined;
    arr = convertArray(arr);

    // determine order (last argument)
    var args = toArray(arguments, 1);
    var order = args[args.length - 1];
    if (typeof order === 'number') {
      order = order < 0 ? -1 : 1;
      args = args.length > 1 ? args.slice(0, -1) : args;
    } else {
      order = 1;
    }

    // determine sortKeys & comparator
    var firstArg = args[0];
    if (!firstArg) {
      return arr;
    } else if (typeof firstArg === 'function') {
      // custom comparator
      comparator = function (a, b) {
        return firstArg(a, b) * order;
      };
    } else {
      // string keys. flatten first
      sortKeys = Array.prototype.concat.apply([], args);
      comparator = function (a, b, i) {
        i = i || 0;
        return i >= sortKeys.length - 1 ? baseCompare(a, b, i) : baseCompare(a, b, i) || comparator(a, b, i + 1);
      };
    }

    function baseCompare(a, b, sortKeyIndex) {
      var sortKey = sortKeys[sortKeyIndex];
      if (sortKey) {
        if (sortKey !== '$key') {
          if (isObject(a) && '$value' in a) a = a.$value;
          if (isObject(b) && '$value' in b) b = b.$value;
        }
        a = isObject(a) ? getPath(a, sortKey) : a;
        b = isObject(b) ? getPath(b, sortKey) : b;
      }
      return a === b ? 0 : a > b ? order : -order;
    }

    // sort on a copy to avoid mutating original array
    return arr.slice().sort(comparator);
  }

  /**
   * String contain helper
   *
   * @param {*} val
   * @param {String} search
   */

  function contains(val, search) {
    var i;
    if (isPlainObject(val)) {
      var keys = Object.keys(val);
      i = keys.length;
      while (i--) {
        if (contains(val[keys[i]], search)) {
          return true;
        }
      }
    } else if (isArray(val)) {
      i = val.length;
      while (i--) {
        if (contains(val[i], search)) {
          return true;
        }
      }
    } else if (val != null) {
      return val.toString().toLowerCase().indexOf(search) > -1;
    }
  }

  var digitsRE = /(\d{3})(?=\d)/g;

  // asset collections must be a plain object.
  var filters = {

    orderBy: orderBy,
    filterBy: filterBy,
    limitBy: limitBy,

    /**
     * Stringify value.
     *
     * @param {Number} indent
     */

    json: {
      read: function read(value, indent) {
        return typeof value === 'string' ? value : JSON.stringify(value, null, arguments.length > 1 ? indent : 2);
      },
      write: function write(value) {
        try {
          return JSON.parse(value);
        } catch (e) {
          return value;
        }
      }
    },

    /**
     * 'abc' => 'Abc'
     */

    capitalize: function capitalize(value) {
      if (!value && value !== 0) return '';
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    },

    /**
     * 'abc' => 'ABC'
     */

    uppercase: function uppercase(value) {
      return value || value === 0 ? value.toString().toUpperCase() : '';
    },

    /**
     * 'AbC' => 'abc'
     */

    lowercase: function lowercase(value) {
      return value || value === 0 ? value.toString().toLowerCase() : '';
    },

    /**
     * 12345 => $12,345.00
     *
     * @param {String} sign
     * @param {Number} decimals Decimal places
     */

    currency: function currency(value, _currency, decimals) {
      value = parseFloat(value);
      if (!isFinite(value) || !value && value !== 0) return '';
      _currency = _currency != null ? _currency : '$';
      decimals = decimals != null ? decimals : 2;
      var stringified = Math.abs(value).toFixed(decimals);
      var _int = decimals ? stringified.slice(0, -1 - decimals) : stringified;
      var i = _int.length % 3;
      var head = i > 0 ? _int.slice(0, i) + (_int.length > 3 ? ',' : '') : '';
      var _float = decimals ? stringified.slice(-1 - decimals) : '';
      var sign = value < 0 ? '-' : '';
      return sign + _currency + head + _int.slice(i).replace(digitsRE, '$1,') + _float;
    },

    /**
     * 'item' => 'items'
     *
     * @params
     *  an array of strings corresponding to
     *  the single, double, triple ... forms of the word to
     *  be pluralized. When the number to be pluralized
     *  exceeds the length of the args, it will use the last
     *  entry in the array.
     *
     *  e.g. ['single', 'double', 'triple', 'multiple']
     */

    pluralize: function pluralize(value) {
      var args = toArray(arguments, 1);
      var length = args.length;
      if (length > 1) {
        var index = value % 10 - 1;
        return index in args ? args[index] : args[length - 1];
      } else {
        return args[0] + (value === 1 ? '' : 's');
      }
    },

    /**
     * Debounce a handler function.
     *
     * @param {Function} handler
     * @param {Number} delay = 300
     * @return {Function}
     */

    debounce: function debounce(handler, delay) {
      if (!handler) return;
      if (!delay) {
        delay = 300;
      }
      return _debounce(handler, delay);
    }
  };

  function installGlobalAPI (Vue) {
    /**
     * Vue and every constructor that extends Vue has an
     * associated options object, which can be accessed during
     * compilation steps as `this.constructor.options`.
     *
     * These can be seen as the default options of every
     * Vue instance.
     */

    Vue.options = {
      directives: directives,
      elementDirectives: elementDirectives,
      filters: filters,
      transitions: {},
      components: {},
      partials: {},
      replace: true
    };

    /**
     * Expose useful internals
     */

    Vue.util = util;
    Vue.config = config;
    Vue.set = set;
    Vue['delete'] = del;
    Vue.nextTick = nextTick;

    /**
     * The following are exposed for advanced usage / plugins
     */

    Vue.compiler = compiler;
    Vue.FragmentFactory = FragmentFactory;
    Vue.internalDirectives = internalDirectives;
    Vue.parsers = {
      path: path,
      text: text,
      template: template,
      directive: directive,
      expression: expression
    };

    /**
     * Each instance constructor, including Vue, has a unique
     * cid. This enables us to create wrapped "child
     * constructors" for prototypal inheritance and cache them.
     */

    Vue.cid = 0;
    var cid = 1;

    /**
     * Class inheritance
     *
     * @param {Object} extendOptions
     */

    Vue.extend = function (extendOptions) {
      extendOptions = extendOptions || {};
      var Super = this;
      var isFirstExtend = Super.cid === 0;
      if (isFirstExtend && extendOptions._Ctor) {
        return extendOptions._Ctor;
      }
      var name = extendOptions.name || Super.options.name;
      if ('development' !== 'production') {
        if (!/^[a-zA-Z][\w-]*$/.test(name)) {
          warn('Invalid component name: "' + name + '". Component names ' + 'can only contain alphanumeric characaters and the hyphen.');
          name = null;
        }
      }
      var Sub = createClass(name || 'VueComponent');
      Sub.prototype = Object.create(Super.prototype);
      Sub.prototype.constructor = Sub;
      Sub.cid = cid++;
      Sub.options = mergeOptions(Super.options, extendOptions);
      Sub['super'] = Super;
      // allow further extension
      Sub.extend = Super.extend;
      // create asset registers, so extended classes
      // can have their private assets too.
      config._assetTypes.forEach(function (type) {
        Sub[type] = Super[type];
      });
      // enable recursive self-lookup
      if (name) {
        Sub.options.components[name] = Sub;
      }
      // cache constructor
      if (isFirstExtend) {
        extendOptions._Ctor = Sub;
      }
      return Sub;
    };

    /**
     * A function that returns a sub-class constructor with the
     * given name. This gives us much nicer output when
     * logging instances in the console.
     *
     * @param {String} name
     * @return {Function}
     */

    function createClass(name) {
      /* eslint-disable no-new-func */
      return new Function('return function ' + classify(name) + ' (options) { this._init(options) }')();
      /* eslint-enable no-new-func */
    }

    /**
     * Plugin system
     *
     * @param {Object} plugin
     */

    Vue.use = function (plugin) {
      /* istanbul ignore if */
      if (plugin.installed) {
        return;
      }
      // additional parameters
      var args = toArray(arguments, 1);
      args.unshift(this);
      if (typeof plugin.install === 'function') {
        plugin.install.apply(plugin, args);
      } else {
        plugin.apply(null, args);
      }
      plugin.installed = true;
      return this;
    };

    /**
     * Apply a global mixin by merging it into the default
     * options.
     */

    Vue.mixin = function (mixin) {
      Vue.options = mergeOptions(Vue.options, mixin);
    };

    /**
     * Create asset registration methods with the following
     * signature:
     *
     * @param {String} id
     * @param {*} definition
     */

    config._assetTypes.forEach(function (type) {
      Vue[type] = function (id, definition) {
        if (!definition) {
          return this.options[type + 's'][id];
        } else {
          /* istanbul ignore if */
          if ('development' !== 'production') {
            if (type === 'component' && (commonTagRE.test(id) || reservedTagRE.test(id))) {
              warn('Do not use built-in or reserved HTML elements as component ' + 'id: ' + id);
            }
          }
          if (type === 'component' && isPlainObject(definition)) {
            if (!definition.name) {
              definition.name = id;
            }
            definition = Vue.extend(definition);
          }
          this.options[type + 's'][id] = definition;
          return definition;
        }
      };
    });

    // expose internal transition API
    extend(Vue.transition, transition);
  }

  installGlobalAPI(Vue);

  Vue.version = '1.0.26';

  // devtools global hook
  /* istanbul ignore next */
  setTimeout(function () {
    if (config.devtools) {
      if (devtools) {
        devtools.emit('init', Vue);
      } else if ('development' !== 'production' && inBrowser && /Chrome\/\d+/.test(window.navigator.userAgent)) {
        console.log('Download the Vue Devtools for a better development experience:\n' + 'https://github.com/vuejs/vue-devtools');
      }
    }
  }, 0);

  return Vue;

}));
/*!
 * vue-resource v0.9.3
 * https://github.com/vuejs/vue-resource
 * Released under the MIT License.
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.VueResource = factory());
}(this, function () { 'use strict';

  /**
   * Promises/A+ polyfill v1.1.4 (https://github.com/bramstein/promis)
   */

  var RESOLVED = 0;
  var REJECTED = 1;
  var PENDING = 2;

  function Promise$2(executor) {

      this.state = PENDING;
      this.value = undefined;
      this.deferred = [];

      var promise = this;

      try {
          executor(function (x) {
              promise.resolve(x);
          }, function (r) {
              promise.reject(r);
          });
      } catch (e) {
          promise.reject(e);
      }
  }

  Promise$2.reject = function (r) {
      return new Promise$2(function (resolve, reject) {
          reject(r);
      });
  };

  Promise$2.resolve = function (x) {
      return new Promise$2(function (resolve, reject) {
          resolve(x);
      });
  };

  Promise$2.all = function all(iterable) {
      return new Promise$2(function (resolve, reject) {
          var count = 0,
              result = [];

          if (iterable.length === 0) {
              resolve(result);
          }

          function resolver(i) {
              return function (x) {
                  result[i] = x;
                  count += 1;

                  if (count === iterable.length) {
                      resolve(result);
                  }
              };
          }

          for (var i = 0; i < iterable.length; i += 1) {
              Promise$2.resolve(iterable[i]).then(resolver(i), reject);
          }
      });
  };

  Promise$2.race = function race(iterable) {
      return new Promise$2(function (resolve, reject) {
          for (var i = 0; i < iterable.length; i += 1) {
              Promise$2.resolve(iterable[i]).then(resolve, reject);
          }
      });
  };

  var p$1 = Promise$2.prototype;

  p$1.resolve = function resolve(x) {
      var promise = this;

      if (promise.state === PENDING) {
          if (x === promise) {
              throw new TypeError('Promise settled with itself.');
          }

          var called = false;

          try {
              var then = x && x['then'];

              if (x !== null && typeof x === 'object' && typeof then === 'function') {
                  then.call(x, function (x) {
                      if (!called) {
                          promise.resolve(x);
                      }
                      called = true;
                  }, function (r) {
                      if (!called) {
                          promise.reject(r);
                      }
                      called = true;
                  });
                  return;
              }
          } catch (e) {
              if (!called) {
                  promise.reject(e);
              }
              return;
          }

          promise.state = RESOLVED;
          promise.value = x;
          promise.notify();
      }
  };

  p$1.reject = function reject(reason) {
      var promise = this;

      if (promise.state === PENDING) {
          if (reason === promise) {
              throw new TypeError('Promise settled with itself.');
          }

          promise.state = REJECTED;
          promise.value = reason;
          promise.notify();
      }
  };

  p$1.notify = function notify() {
      var promise = this;

      nextTick(function () {
          if (promise.state !== PENDING) {
              while (promise.deferred.length) {
                  var deferred = promise.deferred.shift(),
                      onResolved = deferred[0],
                      onRejected = deferred[1],
                      resolve = deferred[2],
                      reject = deferred[3];

                  try {
                      if (promise.state === RESOLVED) {
                          if (typeof onResolved === 'function') {
                              resolve(onResolved.call(undefined, promise.value));
                          } else {
                              resolve(promise.value);
                          }
                      } else if (promise.state === REJECTED) {
                          if (typeof onRejected === 'function') {
                              resolve(onRejected.call(undefined, promise.value));
                          } else {
                              reject(promise.value);
                          }
                      }
                  } catch (e) {
                      reject(e);
                  }
              }
          }
      });
  };

  p$1.then = function then(onResolved, onRejected) {
      var promise = this;

      return new Promise$2(function (resolve, reject) {
          promise.deferred.push([onResolved, onRejected, resolve, reject]);
          promise.notify();
      });
  };

  p$1.catch = function (onRejected) {
      return this.then(undefined, onRejected);
  };

  var PromiseObj = window.Promise || Promise$2;

  function Promise$1(executor, context) {

      if (executor instanceof PromiseObj) {
          this.promise = executor;
      } else {
          this.promise = new PromiseObj(executor.bind(context));
      }

      this.context = context;
  }

  Promise$1.all = function (iterable, context) {
      return new Promise$1(PromiseObj.all(iterable), context);
  };

  Promise$1.resolve = function (value, context) {
      return new Promise$1(PromiseObj.resolve(value), context);
  };

  Promise$1.reject = function (reason, context) {
      return new Promise$1(PromiseObj.reject(reason), context);
  };

  Promise$1.race = function (iterable, context) {
      return new Promise$1(PromiseObj.race(iterable), context);
  };

  var p = Promise$1.prototype;

  p.bind = function (context) {
      this.context = context;
      return this;
  };

  p.then = function (fulfilled, rejected) {

      if (fulfilled && fulfilled.bind && this.context) {
          fulfilled = fulfilled.bind(this.context);
      }

      if (rejected && rejected.bind && this.context) {
          rejected = rejected.bind(this.context);
      }

      return new Promise$1(this.promise.then(fulfilled, rejected), this.context);
  };

  p.catch = function (rejected) {

      if (rejected && rejected.bind && this.context) {
          rejected = rejected.bind(this.context);
      }

      return new Promise$1(this.promise.catch(rejected), this.context);
  };

  p.finally = function (callback) {

      return this.then(function (value) {
          callback.call(this);
          return value;
      }, function (reason) {
          callback.call(this);
          return PromiseObj.reject(reason);
      });
  };

  var debug = false;
  var util = {};
  var array = [];
  function Util (Vue) {
      util = Vue.util;
      debug = Vue.config.debug || !Vue.config.silent;
  }

  function warn(msg) {
      if (typeof console !== 'undefined' && debug) {
          console.warn('[VueResource warn]: ' + msg);
      }
  }

  function error(msg) {
      if (typeof console !== 'undefined') {
          console.error(msg);
      }
  }

  function nextTick(cb, ctx) {
      return util.nextTick(cb, ctx);
  }

  function trim(str) {
      return str.replace(/^\s*|\s*$/g, '');
  }

  var isArray = Array.isArray;

  function isString(val) {
      return typeof val === 'string';
  }

  function isBoolean(val) {
      return val === true || val === false;
  }

  function isFunction(val) {
      return typeof val === 'function';
  }

  function isObject(obj) {
      return obj !== null && typeof obj === 'object';
  }

  function isPlainObject(obj) {
      return isObject(obj) && Object.getPrototypeOf(obj) == Object.prototype;
  }

  function isFormData(obj) {
      return typeof FormData !== 'undefined' && obj instanceof FormData;
  }

  function when(value, fulfilled, rejected) {

      var promise = Promise$1.resolve(value);

      if (arguments.length < 2) {
          return promise;
      }

      return promise.then(fulfilled, rejected);
  }

  function options(fn, obj, opts) {

      opts = opts || {};

      if (isFunction(opts)) {
          opts = opts.call(obj);
      }

      return merge(fn.bind({ $vm: obj, $options: opts }), fn, { $options: opts });
  }

  function each(obj, iterator) {

      var i, key;

      if (typeof obj.length == 'number') {
          for (i = 0; i < obj.length; i++) {
              iterator.call(obj[i], obj[i], i);
          }
      } else if (isObject(obj)) {
          for (key in obj) {
              if (obj.hasOwnProperty(key)) {
                  iterator.call(obj[key], obj[key], key);
              }
          }
      }

      return obj;
  }

  var assign = Object.assign || _assign;

  function merge(target) {

      var args = array.slice.call(arguments, 1);

      args.forEach(function (source) {
          _merge(target, source, true);
      });

      return target;
  }

  function defaults(target) {

      var args = array.slice.call(arguments, 1);

      args.forEach(function (source) {

          for (var key in source) {
              if (target[key] === undefined) {
                  target[key] = source[key];
              }
          }
      });

      return target;
  }

  function _assign(target) {

      var args = array.slice.call(arguments, 1);

      args.forEach(function (source) {
          _merge(target, source);
      });

      return target;
  }

  function _merge(target, source, deep) {
      for (var key in source) {
          if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
              if (isPlainObject(source[key]) && !isPlainObject(target[key])) {
                  target[key] = {};
              }
              if (isArray(source[key]) && !isArray(target[key])) {
                  target[key] = [];
              }
              _merge(target[key], source[key], deep);
          } else if (source[key] !== undefined) {
              target[key] = source[key];
          }
      }
  }

  function root (options, next) {

      var url = next(options);

      if (isString(options.root) && !url.match(/^(https?:)?\//)) {
          url = options.root + '/' + url;
      }

      return url;
  }

  function query (options, next) {

      var urlParams = Object.keys(Url.options.params),
          query = {},
          url = next(options);

      each(options.params, function (value, key) {
          if (urlParams.indexOf(key) === -1) {
              query[key] = value;
          }
      });

      query = Url.params(query);

      if (query) {
          url += (url.indexOf('?') == -1 ? '?' : '&') + query;
      }

      return url;
  }

  /**
   * URL Template v2.0.6 (https://github.com/bramstein/url-template)
   */

  function expand(url, params, variables) {

      var tmpl = parse(url),
          expanded = tmpl.expand(params);

      if (variables) {
          variables.push.apply(variables, tmpl.vars);
      }

      return expanded;
  }

  function parse(template) {

      var operators = ['+', '#', '.', '/', ';', '?', '&'],
          variables = [];

      return {
          vars: variables,
          expand: function (context) {
              return template.replace(/\{([^\{\}]+)\}|([^\{\}]+)/g, function (_, expression, literal) {
                  if (expression) {

                      var operator = null,
                          values = [];

                      if (operators.indexOf(expression.charAt(0)) !== -1) {
                          operator = expression.charAt(0);
                          expression = expression.substr(1);
                      }

                      expression.split(/,/g).forEach(function (variable) {
                          var tmp = /([^:\*]*)(?::(\d+)|(\*))?/.exec(variable);
                          values.push.apply(values, getValues(context, operator, tmp[1], tmp[2] || tmp[3]));
                          variables.push(tmp[1]);
                      });

                      if (operator && operator !== '+') {

                          var separator = ',';

                          if (operator === '?') {
                              separator = '&';
                          } else if (operator !== '#') {
                              separator = operator;
                          }

                          return (values.length !== 0 ? operator : '') + values.join(separator);
                      } else {
                          return values.join(',');
                      }
                  } else {
                      return encodeReserved(literal);
                  }
              });
          }
      };
  }

  function getValues(context, operator, key, modifier) {

      var value = context[key],
          result = [];

      if (isDefined(value) && value !== '') {
          if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
              value = value.toString();

              if (modifier && modifier !== '*') {
                  value = value.substring(0, parseInt(modifier, 10));
              }

              result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : null));
          } else {
              if (modifier === '*') {
                  if (Array.isArray(value)) {
                      value.filter(isDefined).forEach(function (value) {
                          result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : null));
                      });
                  } else {
                      Object.keys(value).forEach(function (k) {
                          if (isDefined(value[k])) {
                              result.push(encodeValue(operator, value[k], k));
                          }
                      });
                  }
              } else {
                  var tmp = [];

                  if (Array.isArray(value)) {
                      value.filter(isDefined).forEach(function (value) {
                          tmp.push(encodeValue(operator, value));
                      });
                  } else {
                      Object.keys(value).forEach(function (k) {
                          if (isDefined(value[k])) {
                              tmp.push(encodeURIComponent(k));
                              tmp.push(encodeValue(operator, value[k].toString()));
                          }
                      });
                  }

                  if (isKeyOperator(operator)) {
                      result.push(encodeURIComponent(key) + '=' + tmp.join(','));
                  } else if (tmp.length !== 0) {
                      result.push(tmp.join(','));
                  }
              }
          }
      } else {
          if (operator === ';') {
              result.push(encodeURIComponent(key));
          } else if (value === '' && (operator === '&' || operator === '?')) {
              result.push(encodeURIComponent(key) + '=');
          } else if (value === '') {
              result.push('');
          }
      }

      return result;
  }

  function isDefined(value) {
      return value !== undefined && value !== null;
  }

  function isKeyOperator(operator) {
      return operator === ';' || operator === '&' || operator === '?';
  }

  function encodeValue(operator, value, key) {

      value = operator === '+' || operator === '#' ? encodeReserved(value) : encodeURIComponent(value);

      if (key) {
          return encodeURIComponent(key) + '=' + value;
      } else {
          return value;
      }
  }

  function encodeReserved(str) {
      return str.split(/(%[0-9A-Fa-f]{2})/g).map(function (part) {
          if (!/%[0-9A-Fa-f]/.test(part)) {
              part = encodeURI(part);
          }
          return part;
      }).join('');
  }

  function template (options) {

      var variables = [],
          url = expand(options.url, options.params, variables);

      variables.forEach(function (key) {
          delete options.params[key];
      });

      return url;
  }

  /**
   * Service for URL templating.
   */

  var ie = document.documentMode;
  var el = document.createElement('a');

  function Url(url, params) {

      var self = this || {},
          options = url,
          transform;

      if (isString(url)) {
          options = { url: url, params: params };
      }

      options = merge({}, Url.options, self.$options, options);

      Url.transforms.forEach(function (handler) {
          transform = factory(handler, transform, self.$vm);
      });

      return transform(options);
  }

  /**
   * Url options.
   */

  Url.options = {
      url: '',
      root: null,
      params: {}
  };

  /**
   * Url transforms.
   */

  Url.transforms = [template, query, root];

  /**
   * Encodes a Url parameter string.
   *
   * @param {Object} obj
   */

  Url.params = function (obj) {

      var params = [],
          escape = encodeURIComponent;

      params.add = function (key, value) {

          if (isFunction(value)) {
              value = value();
          }

          if (value === null) {
              value = '';
          }

          this.push(escape(key) + '=' + escape(value));
      };

      serialize(params, obj);

      return params.join('&').replace(/%20/g, '+');
  };

  /**
   * Parse a URL and return its components.
   *
   * @param {String} url
   */

  Url.parse = function (url) {

      if (ie) {
          el.href = url;
          url = el.href;
      }

      el.href = url;

      return {
          href: el.href,
          protocol: el.protocol ? el.protocol.replace(/:$/, '') : '',
          port: el.port,
          host: el.host,
          hostname: el.hostname,
          pathname: el.pathname.charAt(0) === '/' ? el.pathname : '/' + el.pathname,
          search: el.search ? el.search.replace(/^\?/, '') : '',
          hash: el.hash ? el.hash.replace(/^#/, '') : ''
      };
  };

  function factory(handler, next, vm) {
      return function (options) {
          return handler.call(vm, options, next);
      };
  }

  function serialize(params, obj, scope) {

      var array = isArray(obj),
          plain = isPlainObject(obj),
          hash;

      each(obj, function (value, key) {

          hash = isObject(value) || isArray(value);

          if (scope) {
              key = scope + '[' + (plain || hash ? key : '') + ']';
          }

          if (!scope && array) {
              params.add(value.name, value.value);
          } else if (hash) {
              serialize(params, value, key);
          } else {
              params.add(key, value);
          }
      });
  }

  function xdrClient (request) {
      return new Promise$1(function (resolve) {

          var xdr = new XDomainRequest(),
              handler = function (event) {

              var response = request.respondWith(xdr.responseText, {
                  status: xdr.status,
                  statusText: xdr.statusText
              });

              resolve(response);
          };

          request.abort = function () {
              return xdr.abort();
          };

          xdr.open(request.method, request.getUrl(), true);
          xdr.timeout = 0;
          xdr.onload = handler;
          xdr.onerror = handler;
          xdr.ontimeout = function () {};
          xdr.onprogress = function () {};
          xdr.send(request.getBody());
      });
  }

  var ORIGIN_URL = Url.parse(location.href);
  var SUPPORTS_CORS = 'withCredentials' in new XMLHttpRequest();

  function cors (request, next) {

      if (!isBoolean(request.crossOrigin) && crossOrigin(request)) {
          request.crossOrigin = true;
      }

      if (request.crossOrigin) {

          if (!SUPPORTS_CORS) {
              request.client = xdrClient;
          }

          delete request.emulateHTTP;
      }

      next();
  }

  function crossOrigin(request) {

      var requestUrl = Url.parse(Url(request));

      return requestUrl.protocol !== ORIGIN_URL.protocol || requestUrl.host !== ORIGIN_URL.host;
  }

  function body (request, next) {

      if (request.emulateJSON && isPlainObject(request.body)) {
          request.body = Url.params(request.body);
          request.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      }

      if (isFormData(request.body)) {
          delete request.headers['Content-Type'];
      }

      if (isPlainObject(request.body)) {
          request.body = JSON.stringify(request.body);
      }

      next(function (response) {

          var contentType = response.headers['Content-Type'];

          if (isString(contentType) && contentType.indexOf('application/json') === 0) {

              try {
                  response.data = response.json();
              } catch (e) {
                  response.data = null;
              }
          } else {
              response.data = response.text();
          }
      });
  }

  function jsonpClient (request) {
      return new Promise$1(function (resolve) {

          var name = request.jsonp || 'callback',
              callback = '_jsonp' + Math.random().toString(36).substr(2),
              body = null,
              handler,
              script;

          handler = function (event) {

              var status = 0;

              if (event.type === 'load' && body !== null) {
                  status = 200;
              } else if (event.type === 'error') {
                  status = 404;
              }

              resolve(request.respondWith(body, { status: status }));

              delete window[callback];
              document.body.removeChild(script);
          };

          request.params[name] = callback;

          window[callback] = function (result) {
              body = JSON.stringify(result);
          };

          script = document.createElement('script');
          script.src = request.getUrl();
          script.type = 'text/javascript';
          script.async = true;
          script.onload = handler;
          script.onerror = handler;

          document.body.appendChild(script);
      });
  }

  function jsonp (request, next) {

      if (request.method == 'JSONP') {
          request.client = jsonpClient;
      }

      next(function (response) {

          if (request.method == 'JSONP') {
              response.data = response.json();
          }
      });
  }

  function before (request, next) {

      if (isFunction(request.before)) {
          request.before.call(this, request);
      }

      next();
  }

  /**
   * HTTP method override Interceptor.
   */

  function method (request, next) {

      if (request.emulateHTTP && /^(PUT|PATCH|DELETE)$/i.test(request.method)) {
          request.headers['X-HTTP-Method-Override'] = request.method;
          request.method = 'POST';
      }

      next();
  }

  function header (request, next) {

      request.method = request.method.toUpperCase();
      request.headers = assign({}, Http.headers.common, !request.crossOrigin ? Http.headers.custom : {}, Http.headers[request.method.toLowerCase()], request.headers);

      next();
  }

  /**
   * Timeout Interceptor.
   */

  function timeout (request, next) {

      var timeout;

      if (request.timeout) {
          timeout = setTimeout(function () {
              request.abort();
          }, request.timeout);
      }

      next(function (response) {

          clearTimeout(timeout);
      });
  }

  function xhrClient (request) {
      return new Promise$1(function (resolve) {

          var xhr = new XMLHttpRequest(),
              handler = function (event) {

              var response = request.respondWith('response' in xhr ? xhr.response : xhr.responseText, {
                  status: xhr.status === 1223 ? 204 : xhr.status, // IE9 status bug
                  statusText: xhr.status === 1223 ? 'No Content' : trim(xhr.statusText),
                  headers: parseHeaders(xhr.getAllResponseHeaders())
              });

              resolve(response);
          };

          request.abort = function () {
              return xhr.abort();
          };

          xhr.open(request.method, request.getUrl(), true);
          xhr.timeout = 0;
          xhr.onload = handler;
          xhr.onerror = handler;

          if (request.progress) {
              if (request.method === 'GET') {
                  xhr.addEventListener('progress', request.progress);
              } else if (/^(POST|PUT)$/i.test(request.method)) {
                  xhr.upload.addEventListener('progress', request.progress);
              }
          }

          if (request.credentials === true) {
              xhr.withCredentials = true;
          }

          each(request.headers || {}, function (value, header) {
              xhr.setRequestHeader(header, value);
          });

          xhr.send(request.getBody());
      });
  }

  function parseHeaders(str) {

      var headers = {},
          value,
          name,
          i;

      each(trim(str).split('\n'), function (row) {

          i = row.indexOf(':');
          name = trim(row.slice(0, i));
          value = trim(row.slice(i + 1));

          if (headers[name]) {

              if (isArray(headers[name])) {
                  headers[name].push(value);
              } else {
                  headers[name] = [headers[name], value];
              }
          } else {

              headers[name] = value;
          }
      });

      return headers;
  }

  function Client (context) {

      var reqHandlers = [sendRequest],
          resHandlers = [],
          handler;

      if (!isObject(context)) {
          context = null;
      }

      function Client(request) {
          return new Promise$1(function (resolve) {

              function exec() {

                  handler = reqHandlers.pop();

                  if (isFunction(handler)) {
                      handler.call(context, request, next);
                  } else {
                      warn('Invalid interceptor of type ' + typeof handler + ', must be a function');
                      next();
                  }
              }

              function next(response) {

                  if (isFunction(response)) {

                      resHandlers.unshift(response);
                  } else if (isObject(response)) {

                      resHandlers.forEach(function (handler) {
                          response = when(response, function (response) {
                              return handler.call(context, response) || response;
                          });
                      });

                      when(response, resolve);

                      return;
                  }

                  exec();
              }

              exec();
          }, context);
      }

      Client.use = function (handler) {
          reqHandlers.push(handler);
      };

      return Client;
  }

  function sendRequest(request, resolve) {

      var client = request.client || xhrClient;

      resolve(client(request));
  }

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  /**
   * HTTP Response.
   */

  var Response = function () {
      function Response(body, _ref) {
          var url = _ref.url;
          var headers = _ref.headers;
          var status = _ref.status;
          var statusText = _ref.statusText;
          classCallCheck(this, Response);


          this.url = url;
          this.body = body;
          this.headers = headers || {};
          this.status = status || 0;
          this.statusText = statusText || '';
          this.ok = status >= 200 && status < 300;
      }

      Response.prototype.text = function text() {
          return this.body;
      };

      Response.prototype.blob = function blob() {
          return new Blob([this.body]);
      };

      Response.prototype.json = function json() {
          return JSON.parse(this.body);
      };

      return Response;
  }();

  var Request = function () {
      function Request(options) {
          classCallCheck(this, Request);


          this.method = 'GET';
          this.body = null;
          this.params = {};
          this.headers = {};

          assign(this, options);
      }

      Request.prototype.getUrl = function getUrl() {
          return Url(this);
      };

      Request.prototype.getBody = function getBody() {
          return this.body;
      };

      Request.prototype.respondWith = function respondWith(body, options) {
          return new Response(body, assign(options || {}, { url: this.getUrl() }));
      };

      return Request;
  }();

  /**
   * Service for sending network requests.
   */

  var CUSTOM_HEADERS = { 'X-Requested-With': 'XMLHttpRequest' };
  var COMMON_HEADERS = { 'Accept': 'application/json, text/plain, */*' };
  var JSON_CONTENT_TYPE = { 'Content-Type': 'application/json;charset=utf-8' };

  function Http(options) {

      var self = this || {},
          client = Client(self.$vm);

      defaults(options || {}, self.$options, Http.options);

      Http.interceptors.forEach(function (handler) {
          client.use(handler);
      });

      return client(new Request(options)).then(function (response) {

          return response.ok ? response : Promise$1.reject(response);
      }, function (response) {

          if (response instanceof Error) {
              error(response);
          }

          return Promise$1.reject(response);
      });
  }

  Http.options = {};

  Http.headers = {
      put: JSON_CONTENT_TYPE,
      post: JSON_CONTENT_TYPE,
      patch: JSON_CONTENT_TYPE,
      delete: JSON_CONTENT_TYPE,
      custom: CUSTOM_HEADERS,
      common: COMMON_HEADERS
  };

  Http.interceptors = [before, timeout, method, body, jsonp, header, cors];

  ['get', 'delete', 'head', 'jsonp'].forEach(function (method) {

      Http[method] = function (url, options) {
          return this(assign(options || {}, { url: url, method: method }));
      };
  });

  ['post', 'put', 'patch'].forEach(function (method) {

      Http[method] = function (url, body, options) {
          return this(assign(options || {}, { url: url, method: method, body: body }));
      };
  });

  function Resource(url, params, actions, options) {

      var self = this || {},
          resource = {};

      actions = assign({}, Resource.actions, actions);

      each(actions, function (action, name) {

          action = merge({ url: url, params: params || {} }, options, action);

          resource[name] = function () {
              return (self.$http || Http)(opts(action, arguments));
          };
      });

      return resource;
  }

  function opts(action, args) {

      var options = assign({}, action),
          params = {},
          body;

      switch (args.length) {

          case 2:

              params = args[0];
              body = args[1];

              break;

          case 1:

              if (/^(POST|PUT|PATCH)$/i.test(options.method)) {
                  body = args[0];
              } else {
                  params = args[0];
              }

              break;

          case 0:

              break;

          default:

              throw 'Expected up to 4 arguments [params, body], got ' + args.length + ' arguments';
      }

      options.body = body;
      options.params = assign({}, options.params, params);

      return options;
  }

  Resource.actions = {

      get: { method: 'GET' },
      save: { method: 'POST' },
      query: { method: 'GET' },
      update: { method: 'PUT' },
      remove: { method: 'DELETE' },
      delete: { method: 'DELETE' }

  };

  function plugin(Vue) {

      if (plugin.installed) {
          return;
      }

      Util(Vue);

      Vue.url = Url;
      Vue.http = Http;
      Vue.resource = Resource;
      Vue.Promise = Promise$1;

      Object.defineProperties(Vue.prototype, {

          $url: {
              get: function () {
                  return options(Vue.url, this, this.$options.url);
              }
          },

          $http: {
              get: function () {
                  return options(Vue.http, this, this.$options.http);
              }
          },

          $resource: {
              get: function () {
                  return Vue.resource.bind(this);
              }
          },

          $promise: {
              get: function () {
                  var _this = this;

                  return function (executor) {
                      return new Vue.Promise(executor, _this);
                  };
              }
          }

      });
  }

  if (typeof window !== 'undefined' && window.Vue) {
      window.Vue.use(plugin);
  }

  return plugin;

}));
/*! jQuery v3.1.0 | (c) jQuery Foundation | jquery.org/license */
!function(a,b){"use strict";"object"==typeof module&&"object"==typeof module.exports?module.exports=a.document?b(a,!0):function(a){if(!a.document)throw new Error("jQuery requires a window with a document");return b(a)}:b(a)}("undefined"!=typeof window?window:this,function(a,b){"use strict";var c=[],d=a.document,e=Object.getPrototypeOf,f=c.slice,g=c.concat,h=c.push,i=c.indexOf,j={},k=j.toString,l=j.hasOwnProperty,m=l.toString,n=m.call(Object),o={};function p(a,b){b=b||d;var c=b.createElement("script");c.text=a,b.head.appendChild(c).parentNode.removeChild(c)}var q="3.1.0",r=function(a,b){return new r.fn.init(a,b)},s=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,t=/^-ms-/,u=/-([a-z])/g,v=function(a,b){return b.toUpperCase()};r.fn=r.prototype={jquery:q,constructor:r,length:0,toArray:function(){return f.call(this)},get:function(a){return null!=a?a<0?this[a+this.length]:this[a]:f.call(this)},pushStack:function(a){var b=r.merge(this.constructor(),a);return b.prevObject=this,b},each:function(a){return r.each(this,a)},map:function(a){return this.pushStack(r.map(this,function(b,c){return a.call(b,c,b)}))},slice:function(){return this.pushStack(f.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(a){var b=this.length,c=+a+(a<0?b:0);return this.pushStack(c>=0&&c<b?[this[c]]:[])},end:function(){return this.prevObject||this.constructor()},push:h,sort:c.sort,splice:c.splice},r.extend=r.fn.extend=function(){var a,b,c,d,e,f,g=arguments[0]||{},h=1,i=arguments.length,j=!1;for("boolean"==typeof g&&(j=g,g=arguments[h]||{},h++),"object"==typeof g||r.isFunction(g)||(g={}),h===i&&(g=this,h--);h<i;h++)if(null!=(a=arguments[h]))for(b in a)c=g[b],d=a[b],g!==d&&(j&&d&&(r.isPlainObject(d)||(e=r.isArray(d)))?(e?(e=!1,f=c&&r.isArray(c)?c:[]):f=c&&r.isPlainObject(c)?c:{},g[b]=r.extend(j,f,d)):void 0!==d&&(g[b]=d));return g},r.extend({expando:"jQuery"+(q+Math.random()).replace(/\D/g,""),isReady:!0,error:function(a){throw new Error(a)},noop:function(){},isFunction:function(a){return"function"===r.type(a)},isArray:Array.isArray,isWindow:function(a){return null!=a&&a===a.window},isNumeric:function(a){var b=r.type(a);return("number"===b||"string"===b)&&!isNaN(a-parseFloat(a))},isPlainObject:function(a){var b,c;return!(!a||"[object Object]"!==k.call(a))&&(!(b=e(a))||(c=l.call(b,"constructor")&&b.constructor,"function"==typeof c&&m.call(c)===n))},isEmptyObject:function(a){var b;for(b in a)return!1;return!0},type:function(a){return null==a?a+"":"object"==typeof a||"function"==typeof a?j[k.call(a)]||"object":typeof a},globalEval:function(a){p(a)},camelCase:function(a){return a.replace(t,"ms-").replace(u,v)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toLowerCase()===b.toLowerCase()},each:function(a,b){var c,d=0;if(w(a)){for(c=a.length;d<c;d++)if(b.call(a[d],d,a[d])===!1)break}else for(d in a)if(b.call(a[d],d,a[d])===!1)break;return a},trim:function(a){return null==a?"":(a+"").replace(s,"")},makeArray:function(a,b){var c=b||[];return null!=a&&(w(Object(a))?r.merge(c,"string"==typeof a?[a]:a):h.call(c,a)),c},inArray:function(a,b,c){return null==b?-1:i.call(b,a,c)},merge:function(a,b){for(var c=+b.length,d=0,e=a.length;d<c;d++)a[e++]=b[d];return a.length=e,a},grep:function(a,b,c){for(var d,e=[],f=0,g=a.length,h=!c;f<g;f++)d=!b(a[f],f),d!==h&&e.push(a[f]);return e},map:function(a,b,c){var d,e,f=0,h=[];if(w(a))for(d=a.length;f<d;f++)e=b(a[f],f,c),null!=e&&h.push(e);else for(f in a)e=b(a[f],f,c),null!=e&&h.push(e);return g.apply([],h)},guid:1,proxy:function(a,b){var c,d,e;if("string"==typeof b&&(c=a[b],b=a,a=c),r.isFunction(a))return d=f.call(arguments,2),e=function(){return a.apply(b||this,d.concat(f.call(arguments)))},e.guid=a.guid=a.guid||r.guid++,e},now:Date.now,support:o}),"function"==typeof Symbol&&(r.fn[Symbol.iterator]=c[Symbol.iterator]),r.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),function(a,b){j["[object "+b+"]"]=b.toLowerCase()});function w(a){var b=!!a&&"length"in a&&a.length,c=r.type(a);return"function"!==c&&!r.isWindow(a)&&("array"===c||0===b||"number"==typeof b&&b>0&&b-1 in a)}var x=function(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u="sizzle"+1*new Date,v=a.document,w=0,x=0,y=ha(),z=ha(),A=ha(),B=function(a,b){return a===b&&(l=!0),0},C={}.hasOwnProperty,D=[],E=D.pop,F=D.push,G=D.push,H=D.slice,I=function(a,b){for(var c=0,d=a.length;c<d;c++)if(a[c]===b)return c;return-1},J="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",K="[\\x20\\t\\r\\n\\f]",L="(?:\\\\.|[\\w-]|[^\0-\\xa0])+",M="\\["+K+"*("+L+")(?:"+K+"*([*^$|!~]?=)"+K+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+L+"))|)"+K+"*\\]",N=":("+L+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+M+")*)|.*)\\)|)",O=new RegExp(K+"+","g"),P=new RegExp("^"+K+"+|((?:^|[^\\\\])(?:\\\\.)*)"+K+"+$","g"),Q=new RegExp("^"+K+"*,"+K+"*"),R=new RegExp("^"+K+"*([>+~]|"+K+")"+K+"*"),S=new RegExp("="+K+"*([^\\]'\"]*?)"+K+"*\\]","g"),T=new RegExp(N),U=new RegExp("^"+L+"$"),V={ID:new RegExp("^#("+L+")"),CLASS:new RegExp("^\\.("+L+")"),TAG:new RegExp("^("+L+"|[*])"),ATTR:new RegExp("^"+M),PSEUDO:new RegExp("^"+N),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+K+"*(even|odd|(([+-]|)(\\d*)n|)"+K+"*(?:([+-]|)"+K+"*(\\d+)|))"+K+"*\\)|)","i"),bool:new RegExp("^(?:"+J+")$","i"),needsContext:new RegExp("^"+K+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+K+"*((?:-\\d)?\\d*)"+K+"*\\)|)(?=[^-]|$)","i")},W=/^(?:input|select|textarea|button)$/i,X=/^h\d$/i,Y=/^[^{]+\{\s*\[native \w/,Z=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,$=/[+~]/,_=new RegExp("\\\\([\\da-f]{1,6}"+K+"?|("+K+")|.)","ig"),aa=function(a,b,c){var d="0x"+b-65536;return d!==d||c?b:d<0?String.fromCharCode(d+65536):String.fromCharCode(d>>10|55296,1023&d|56320)},ba=/([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g,ca=function(a,b){return b?"\0"===a?"\ufffd":a.slice(0,-1)+"\\"+a.charCodeAt(a.length-1).toString(16)+" ":"\\"+a},da=function(){m()},ea=ta(function(a){return a.disabled===!0},{dir:"parentNode",next:"legend"});try{G.apply(D=H.call(v.childNodes),v.childNodes),D[v.childNodes.length].nodeType}catch(fa){G={apply:D.length?function(a,b){F.apply(a,H.call(b))}:function(a,b){var c=a.length,d=0;while(a[c++]=b[d++]);a.length=c-1}}}function ga(a,b,d,e){var f,h,j,k,l,o,r,s=b&&b.ownerDocument,w=b?b.nodeType:9;if(d=d||[],"string"!=typeof a||!a||1!==w&&9!==w&&11!==w)return d;if(!e&&((b?b.ownerDocument||b:v)!==n&&m(b),b=b||n,p)){if(11!==w&&(l=Z.exec(a)))if(f=l[1]){if(9===w){if(!(j=b.getElementById(f)))return d;if(j.id===f)return d.push(j),d}else if(s&&(j=s.getElementById(f))&&t(b,j)&&j.id===f)return d.push(j),d}else{if(l[2])return G.apply(d,b.getElementsByTagName(a)),d;if((f=l[3])&&c.getElementsByClassName&&b.getElementsByClassName)return G.apply(d,b.getElementsByClassName(f)),d}if(c.qsa&&!A[a+" "]&&(!q||!q.test(a))){if(1!==w)s=b,r=a;else if("object"!==b.nodeName.toLowerCase()){(k=b.getAttribute("id"))?k=k.replace(ba,ca):b.setAttribute("id",k=u),o=g(a),h=o.length;while(h--)o[h]="#"+k+" "+sa(o[h]);r=o.join(","),s=$.test(a)&&qa(b.parentNode)||b}if(r)try{return G.apply(d,s.querySelectorAll(r)),d}catch(x){}finally{k===u&&b.removeAttribute("id")}}}return i(a.replace(P,"$1"),b,d,e)}function ha(){var a=[];function b(c,e){return a.push(c+" ")>d.cacheLength&&delete b[a.shift()],b[c+" "]=e}return b}function ia(a){return a[u]=!0,a}function ja(a){var b=n.createElement("fieldset");try{return!!a(b)}catch(c){return!1}finally{b.parentNode&&b.parentNode.removeChild(b),b=null}}function ka(a,b){var c=a.split("|"),e=c.length;while(e--)d.attrHandle[c[e]]=b}function la(a,b){var c=b&&a,d=c&&1===a.nodeType&&1===b.nodeType&&a.sourceIndex-b.sourceIndex;if(d)return d;if(c)while(c=c.nextSibling)if(c===b)return-1;return a?1:-1}function ma(a){return function(b){var c=b.nodeName.toLowerCase();return"input"===c&&b.type===a}}function na(a){return function(b){var c=b.nodeName.toLowerCase();return("input"===c||"button"===c)&&b.type===a}}function oa(a){return function(b){return"label"in b&&b.disabled===a||"form"in b&&b.disabled===a||"form"in b&&b.disabled===!1&&(b.isDisabled===a||b.isDisabled!==!a&&("label"in b||!ea(b))!==a)}}function pa(a){return ia(function(b){return b=+b,ia(function(c,d){var e,f=a([],c.length,b),g=f.length;while(g--)c[e=f[g]]&&(c[e]=!(d[e]=c[e]))})})}function qa(a){return a&&"undefined"!=typeof a.getElementsByTagName&&a}c=ga.support={},f=ga.isXML=function(a){var b=a&&(a.ownerDocument||a).documentElement;return!!b&&"HTML"!==b.nodeName},m=ga.setDocument=function(a){var b,e,g=a?a.ownerDocument||a:v;return g!==n&&9===g.nodeType&&g.documentElement?(n=g,o=n.documentElement,p=!f(n),v!==n&&(e=n.defaultView)&&e.top!==e&&(e.addEventListener?e.addEventListener("unload",da,!1):e.attachEvent&&e.attachEvent("onunload",da)),c.attributes=ja(function(a){return a.className="i",!a.getAttribute("className")}),c.getElementsByTagName=ja(function(a){return a.appendChild(n.createComment("")),!a.getElementsByTagName("*").length}),c.getElementsByClassName=Y.test(n.getElementsByClassName),c.getById=ja(function(a){return o.appendChild(a).id=u,!n.getElementsByName||!n.getElementsByName(u).length}),c.getById?(d.find.ID=function(a,b){if("undefined"!=typeof b.getElementById&&p){var c=b.getElementById(a);return c?[c]:[]}},d.filter.ID=function(a){var b=a.replace(_,aa);return function(a){return a.getAttribute("id")===b}}):(delete d.find.ID,d.filter.ID=function(a){var b=a.replace(_,aa);return function(a){var c="undefined"!=typeof a.getAttributeNode&&a.getAttributeNode("id");return c&&c.value===b}}),d.find.TAG=c.getElementsByTagName?function(a,b){return"undefined"!=typeof b.getElementsByTagName?b.getElementsByTagName(a):c.qsa?b.querySelectorAll(a):void 0}:function(a,b){var c,d=[],e=0,f=b.getElementsByTagName(a);if("*"===a){while(c=f[e++])1===c.nodeType&&d.push(c);return d}return f},d.find.CLASS=c.getElementsByClassName&&function(a,b){if("undefined"!=typeof b.getElementsByClassName&&p)return b.getElementsByClassName(a)},r=[],q=[],(c.qsa=Y.test(n.querySelectorAll))&&(ja(function(a){o.appendChild(a).innerHTML="<a id='"+u+"'></a><select id='"+u+"-\r\\' msallowcapture=''><option selected=''></option></select>",a.querySelectorAll("[msallowcapture^='']").length&&q.push("[*^$]="+K+"*(?:''|\"\")"),a.querySelectorAll("[selected]").length||q.push("\\["+K+"*(?:value|"+J+")"),a.querySelectorAll("[id~="+u+"-]").length||q.push("~="),a.querySelectorAll(":checked").length||q.push(":checked"),a.querySelectorAll("a#"+u+"+*").length||q.push(".#.+[+~]")}),ja(function(a){a.innerHTML="<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";var b=n.createElement("input");b.setAttribute("type","hidden"),a.appendChild(b).setAttribute("name","D"),a.querySelectorAll("[name=d]").length&&q.push("name"+K+"*[*^$|!~]?="),2!==a.querySelectorAll(":enabled").length&&q.push(":enabled",":disabled"),o.appendChild(a).disabled=!0,2!==a.querySelectorAll(":disabled").length&&q.push(":enabled",":disabled"),a.querySelectorAll("*,:x"),q.push(",.*:")})),(c.matchesSelector=Y.test(s=o.matches||o.webkitMatchesSelector||o.mozMatchesSelector||o.oMatchesSelector||o.msMatchesSelector))&&ja(function(a){c.disconnectedMatch=s.call(a,"*"),s.call(a,"[s!='']:x"),r.push("!=",N)}),q=q.length&&new RegExp(q.join("|")),r=r.length&&new RegExp(r.join("|")),b=Y.test(o.compareDocumentPosition),t=b||Y.test(o.contains)?function(a,b){var c=9===a.nodeType?a.documentElement:a,d=b&&b.parentNode;return a===d||!(!d||1!==d.nodeType||!(c.contains?c.contains(d):a.compareDocumentPosition&&16&a.compareDocumentPosition(d)))}:function(a,b){if(b)while(b=b.parentNode)if(b===a)return!0;return!1},B=b?function(a,b){if(a===b)return l=!0,0;var d=!a.compareDocumentPosition-!b.compareDocumentPosition;return d?d:(d=(a.ownerDocument||a)===(b.ownerDocument||b)?a.compareDocumentPosition(b):1,1&d||!c.sortDetached&&b.compareDocumentPosition(a)===d?a===n||a.ownerDocument===v&&t(v,a)?-1:b===n||b.ownerDocument===v&&t(v,b)?1:k?I(k,a)-I(k,b):0:4&d?-1:1)}:function(a,b){if(a===b)return l=!0,0;var c,d=0,e=a.parentNode,f=b.parentNode,g=[a],h=[b];if(!e||!f)return a===n?-1:b===n?1:e?-1:f?1:k?I(k,a)-I(k,b):0;if(e===f)return la(a,b);c=a;while(c=c.parentNode)g.unshift(c);c=b;while(c=c.parentNode)h.unshift(c);while(g[d]===h[d])d++;return d?la(g[d],h[d]):g[d]===v?-1:h[d]===v?1:0},n):n},ga.matches=function(a,b){return ga(a,null,null,b)},ga.matchesSelector=function(a,b){if((a.ownerDocument||a)!==n&&m(a),b=b.replace(S,"='$1']"),c.matchesSelector&&p&&!A[b+" "]&&(!r||!r.test(b))&&(!q||!q.test(b)))try{var d=s.call(a,b);if(d||c.disconnectedMatch||a.document&&11!==a.document.nodeType)return d}catch(e){}return ga(b,n,null,[a]).length>0},ga.contains=function(a,b){return(a.ownerDocument||a)!==n&&m(a),t(a,b)},ga.attr=function(a,b){(a.ownerDocument||a)!==n&&m(a);var e=d.attrHandle[b.toLowerCase()],f=e&&C.call(d.attrHandle,b.toLowerCase())?e(a,b,!p):void 0;return void 0!==f?f:c.attributes||!p?a.getAttribute(b):(f=a.getAttributeNode(b))&&f.specified?f.value:null},ga.escape=function(a){return(a+"").replace(ba,ca)},ga.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)},ga.uniqueSort=function(a){var b,d=[],e=0,f=0;if(l=!c.detectDuplicates,k=!c.sortStable&&a.slice(0),a.sort(B),l){while(b=a[f++])b===a[f]&&(e=d.push(f));while(e--)a.splice(d[e],1)}return k=null,a},e=ga.getText=function(a){var b,c="",d=0,f=a.nodeType;if(f){if(1===f||9===f||11===f){if("string"==typeof a.textContent)return a.textContent;for(a=a.firstChild;a;a=a.nextSibling)c+=e(a)}else if(3===f||4===f)return a.nodeValue}else while(b=a[d++])c+=e(b);return c},d=ga.selectors={cacheLength:50,createPseudo:ia,match:V,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(a){return a[1]=a[1].replace(_,aa),a[3]=(a[3]||a[4]||a[5]||"").replace(_,aa),"~="===a[2]&&(a[3]=" "+a[3]+" "),a.slice(0,4)},CHILD:function(a){return a[1]=a[1].toLowerCase(),"nth"===a[1].slice(0,3)?(a[3]||ga.error(a[0]),a[4]=+(a[4]?a[5]+(a[6]||1):2*("even"===a[3]||"odd"===a[3])),a[5]=+(a[7]+a[8]||"odd"===a[3])):a[3]&&ga.error(a[0]),a},PSEUDO:function(a){var b,c=!a[6]&&a[2];return V.CHILD.test(a[0])?null:(a[3]?a[2]=a[4]||a[5]||"":c&&T.test(c)&&(b=g(c,!0))&&(b=c.indexOf(")",c.length-b)-c.length)&&(a[0]=a[0].slice(0,b),a[2]=c.slice(0,b)),a.slice(0,3))}},filter:{TAG:function(a){var b=a.replace(_,aa).toLowerCase();return"*"===a?function(){return!0}:function(a){return a.nodeName&&a.nodeName.toLowerCase()===b}},CLASS:function(a){var b=y[a+" "];return b||(b=new RegExp("(^|"+K+")"+a+"("+K+"|$)"))&&y(a,function(a){return b.test("string"==typeof a.className&&a.className||"undefined"!=typeof a.getAttribute&&a.getAttribute("class")||"")})},ATTR:function(a,b,c){return function(d){var e=ga.attr(d,a);return null==e?"!="===b:!b||(e+="","="===b?e===c:"!="===b?e!==c:"^="===b?c&&0===e.indexOf(c):"*="===b?c&&e.indexOf(c)>-1:"$="===b?c&&e.slice(-c.length)===c:"~="===b?(" "+e.replace(O," ")+" ").indexOf(c)>-1:"|="===b&&(e===c||e.slice(0,c.length+1)===c+"-"))}},CHILD:function(a,b,c,d,e){var f="nth"!==a.slice(0,3),g="last"!==a.slice(-4),h="of-type"===b;return 1===d&&0===e?function(a){return!!a.parentNode}:function(b,c,i){var j,k,l,m,n,o,p=f!==g?"nextSibling":"previousSibling",q=b.parentNode,r=h&&b.nodeName.toLowerCase(),s=!i&&!h,t=!1;if(q){if(f){while(p){m=b;while(m=m[p])if(h?m.nodeName.toLowerCase()===r:1===m.nodeType)return!1;o=p="only"===a&&!o&&"nextSibling"}return!0}if(o=[g?q.firstChild:q.lastChild],g&&s){m=q,l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),j=k[a]||[],n=j[0]===w&&j[1],t=n&&j[2],m=n&&q.childNodes[n];while(m=++n&&m&&m[p]||(t=n=0)||o.pop())if(1===m.nodeType&&++t&&m===b){k[a]=[w,n,t];break}}else if(s&&(m=b,l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),j=k[a]||[],n=j[0]===w&&j[1],t=n),t===!1)while(m=++n&&m&&m[p]||(t=n=0)||o.pop())if((h?m.nodeName.toLowerCase()===r:1===m.nodeType)&&++t&&(s&&(l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),k[a]=[w,t]),m===b))break;return t-=e,t===d||t%d===0&&t/d>=0}}},PSEUDO:function(a,b){var c,e=d.pseudos[a]||d.setFilters[a.toLowerCase()]||ga.error("unsupported pseudo: "+a);return e[u]?e(b):e.length>1?(c=[a,a,"",b],d.setFilters.hasOwnProperty(a.toLowerCase())?ia(function(a,c){var d,f=e(a,b),g=f.length;while(g--)d=I(a,f[g]),a[d]=!(c[d]=f[g])}):function(a){return e(a,0,c)}):e}},pseudos:{not:ia(function(a){var b=[],c=[],d=h(a.replace(P,"$1"));return d[u]?ia(function(a,b,c,e){var f,g=d(a,null,e,[]),h=a.length;while(h--)(f=g[h])&&(a[h]=!(b[h]=f))}):function(a,e,f){return b[0]=a,d(b,null,f,c),b[0]=null,!c.pop()}}),has:ia(function(a){return function(b){return ga(a,b).length>0}}),contains:ia(function(a){return a=a.replace(_,aa),function(b){return(b.textContent||b.innerText||e(b)).indexOf(a)>-1}}),lang:ia(function(a){return U.test(a||"")||ga.error("unsupported lang: "+a),a=a.replace(_,aa).toLowerCase(),function(b){var c;do if(c=p?b.lang:b.getAttribute("xml:lang")||b.getAttribute("lang"))return c=c.toLowerCase(),c===a||0===c.indexOf(a+"-");while((b=b.parentNode)&&1===b.nodeType);return!1}}),target:function(b){var c=a.location&&a.location.hash;return c&&c.slice(1)===b.id},root:function(a){return a===o},focus:function(a){return a===n.activeElement&&(!n.hasFocus||n.hasFocus())&&!!(a.type||a.href||~a.tabIndex)},enabled:oa(!1),disabled:oa(!0),checked:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&!!a.checked||"option"===b&&!!a.selected},selected:function(a){return a.parentNode&&a.parentNode.selectedIndex,a.selected===!0},empty:function(a){for(a=a.firstChild;a;a=a.nextSibling)if(a.nodeType<6)return!1;return!0},parent:function(a){return!d.pseudos.empty(a)},header:function(a){return X.test(a.nodeName)},input:function(a){return W.test(a.nodeName)},button:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&"button"===a.type||"button"===b},text:function(a){var b;return"input"===a.nodeName.toLowerCase()&&"text"===a.type&&(null==(b=a.getAttribute("type"))||"text"===b.toLowerCase())},first:pa(function(){return[0]}),last:pa(function(a,b){return[b-1]}),eq:pa(function(a,b,c){return[c<0?c+b:c]}),even:pa(function(a,b){for(var c=0;c<b;c+=2)a.push(c);return a}),odd:pa(function(a,b){for(var c=1;c<b;c+=2)a.push(c);return a}),lt:pa(function(a,b,c){for(var d=c<0?c+b:c;--d>=0;)a.push(d);return a}),gt:pa(function(a,b,c){for(var d=c<0?c+b:c;++d<b;)a.push(d);return a})}},d.pseudos.nth=d.pseudos.eq;for(b in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})d.pseudos[b]=ma(b);for(b in{submit:!0,reset:!0})d.pseudos[b]=na(b);function ra(){}ra.prototype=d.filters=d.pseudos,d.setFilters=new ra,g=ga.tokenize=function(a,b){var c,e,f,g,h,i,j,k=z[a+" "];if(k)return b?0:k.slice(0);h=a,i=[],j=d.preFilter;while(h){c&&!(e=Q.exec(h))||(e&&(h=h.slice(e[0].length)||h),i.push(f=[])),c=!1,(e=R.exec(h))&&(c=e.shift(),f.push({value:c,type:e[0].replace(P," ")}),h=h.slice(c.length));for(g in d.filter)!(e=V[g].exec(h))||j[g]&&!(e=j[g](e))||(c=e.shift(),f.push({value:c,type:g,matches:e}),h=h.slice(c.length));if(!c)break}return b?h.length:h?ga.error(a):z(a,i).slice(0)};function sa(a){for(var b=0,c=a.length,d="";b<c;b++)d+=a[b].value;return d}function ta(a,b,c){var d=b.dir,e=b.next,f=e||d,g=c&&"parentNode"===f,h=x++;return b.first?function(b,c,e){while(b=b[d])if(1===b.nodeType||g)return a(b,c,e)}:function(b,c,i){var j,k,l,m=[w,h];if(i){while(b=b[d])if((1===b.nodeType||g)&&a(b,c,i))return!0}else while(b=b[d])if(1===b.nodeType||g)if(l=b[u]||(b[u]={}),k=l[b.uniqueID]||(l[b.uniqueID]={}),e&&e===b.nodeName.toLowerCase())b=b[d]||b;else{if((j=k[f])&&j[0]===w&&j[1]===h)return m[2]=j[2];if(k[f]=m,m[2]=a(b,c,i))return!0}}}function ua(a){return a.length>1?function(b,c,d){var e=a.length;while(e--)if(!a[e](b,c,d))return!1;return!0}:a[0]}function va(a,b,c){for(var d=0,e=b.length;d<e;d++)ga(a,b[d],c);return c}function wa(a,b,c,d,e){for(var f,g=[],h=0,i=a.length,j=null!=b;h<i;h++)(f=a[h])&&(c&&!c(f,d,e)||(g.push(f),j&&b.push(h)));return g}function xa(a,b,c,d,e,f){return d&&!d[u]&&(d=xa(d)),e&&!e[u]&&(e=xa(e,f)),ia(function(f,g,h,i){var j,k,l,m=[],n=[],o=g.length,p=f||va(b||"*",h.nodeType?[h]:h,[]),q=!a||!f&&b?p:wa(p,m,a,h,i),r=c?e||(f?a:o||d)?[]:g:q;if(c&&c(q,r,h,i),d){j=wa(r,n),d(j,[],h,i),k=j.length;while(k--)(l=j[k])&&(r[n[k]]=!(q[n[k]]=l))}if(f){if(e||a){if(e){j=[],k=r.length;while(k--)(l=r[k])&&j.push(q[k]=l);e(null,r=[],j,i)}k=r.length;while(k--)(l=r[k])&&(j=e?I(f,l):m[k])>-1&&(f[j]=!(g[j]=l))}}else r=wa(r===g?r.splice(o,r.length):r),e?e(null,g,r,i):G.apply(g,r)})}function ya(a){for(var b,c,e,f=a.length,g=d.relative[a[0].type],h=g||d.relative[" "],i=g?1:0,k=ta(function(a){return a===b},h,!0),l=ta(function(a){return I(b,a)>-1},h,!0),m=[function(a,c,d){var e=!g&&(d||c!==j)||((b=c).nodeType?k(a,c,d):l(a,c,d));return b=null,e}];i<f;i++)if(c=d.relative[a[i].type])m=[ta(ua(m),c)];else{if(c=d.filter[a[i].type].apply(null,a[i].matches),c[u]){for(e=++i;e<f;e++)if(d.relative[a[e].type])break;return xa(i>1&&ua(m),i>1&&sa(a.slice(0,i-1).concat({value:" "===a[i-2].type?"*":""})).replace(P,"$1"),c,i<e&&ya(a.slice(i,e)),e<f&&ya(a=a.slice(e)),e<f&&sa(a))}m.push(c)}return ua(m)}function za(a,b){var c=b.length>0,e=a.length>0,f=function(f,g,h,i,k){var l,o,q,r=0,s="0",t=f&&[],u=[],v=j,x=f||e&&d.find.TAG("*",k),y=w+=null==v?1:Math.random()||.1,z=x.length;for(k&&(j=g===n||g||k);s!==z&&null!=(l=x[s]);s++){if(e&&l){o=0,g||l.ownerDocument===n||(m(l),h=!p);while(q=a[o++])if(q(l,g||n,h)){i.push(l);break}k&&(w=y)}c&&((l=!q&&l)&&r--,f&&t.push(l))}if(r+=s,c&&s!==r){o=0;while(q=b[o++])q(t,u,g,h);if(f){if(r>0)while(s--)t[s]||u[s]||(u[s]=E.call(i));u=wa(u)}G.apply(i,u),k&&!f&&u.length>0&&r+b.length>1&&ga.uniqueSort(i)}return k&&(w=y,j=v),t};return c?ia(f):f}return h=ga.compile=function(a,b){var c,d=[],e=[],f=A[a+" "];if(!f){b||(b=g(a)),c=b.length;while(c--)f=ya(b[c]),f[u]?d.push(f):e.push(f);f=A(a,za(e,d)),f.selector=a}return f},i=ga.select=function(a,b,e,f){var i,j,k,l,m,n="function"==typeof a&&a,o=!f&&g(a=n.selector||a);if(e=e||[],1===o.length){if(j=o[0]=o[0].slice(0),j.length>2&&"ID"===(k=j[0]).type&&c.getById&&9===b.nodeType&&p&&d.relative[j[1].type]){if(b=(d.find.ID(k.matches[0].replace(_,aa),b)||[])[0],!b)return e;n&&(b=b.parentNode),a=a.slice(j.shift().value.length)}i=V.needsContext.test(a)?0:j.length;while(i--){if(k=j[i],d.relative[l=k.type])break;if((m=d.find[l])&&(f=m(k.matches[0].replace(_,aa),$.test(j[0].type)&&qa(b.parentNode)||b))){if(j.splice(i,1),a=f.length&&sa(j),!a)return G.apply(e,f),e;break}}}return(n||h(a,o))(f,b,!p,e,!b||$.test(a)&&qa(b.parentNode)||b),e},c.sortStable=u.split("").sort(B).join("")===u,c.detectDuplicates=!!l,m(),c.sortDetached=ja(function(a){return 1&a.compareDocumentPosition(n.createElement("fieldset"))}),ja(function(a){return a.innerHTML="<a href='#'></a>","#"===a.firstChild.getAttribute("href")})||ka("type|href|height|width",function(a,b,c){if(!c)return a.getAttribute(b,"type"===b.toLowerCase()?1:2)}),c.attributes&&ja(function(a){return a.innerHTML="<input/>",a.firstChild.setAttribute("value",""),""===a.firstChild.getAttribute("value")})||ka("value",function(a,b,c){if(!c&&"input"===a.nodeName.toLowerCase())return a.defaultValue}),ja(function(a){return null==a.getAttribute("disabled")})||ka(J,function(a,b,c){var d;if(!c)return a[b]===!0?b.toLowerCase():(d=a.getAttributeNode(b))&&d.specified?d.value:null}),ga}(a);r.find=x,r.expr=x.selectors,r.expr[":"]=r.expr.pseudos,r.uniqueSort=r.unique=x.uniqueSort,r.text=x.getText,r.isXMLDoc=x.isXML,r.contains=x.contains,r.escapeSelector=x.escape;var y=function(a,b,c){var d=[],e=void 0!==c;while((a=a[b])&&9!==a.nodeType)if(1===a.nodeType){if(e&&r(a).is(c))break;d.push(a)}return d},z=function(a,b){for(var c=[];a;a=a.nextSibling)1===a.nodeType&&a!==b&&c.push(a);return c},A=r.expr.match.needsContext,B=/^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i,C=/^.[^:#\[\.,]*$/;function D(a,b,c){if(r.isFunction(b))return r.grep(a,function(a,d){return!!b.call(a,d,a)!==c});if(b.nodeType)return r.grep(a,function(a){return a===b!==c});if("string"==typeof b){if(C.test(b))return r.filter(b,a,c);b=r.filter(b,a)}return r.grep(a,function(a){return i.call(b,a)>-1!==c&&1===a.nodeType})}r.filter=function(a,b,c){var d=b[0];return c&&(a=":not("+a+")"),1===b.length&&1===d.nodeType?r.find.matchesSelector(d,a)?[d]:[]:r.find.matches(a,r.grep(b,function(a){return 1===a.nodeType}))},r.fn.extend({find:function(a){var b,c,d=this.length,e=this;if("string"!=typeof a)return this.pushStack(r(a).filter(function(){for(b=0;b<d;b++)if(r.contains(e[b],this))return!0}));for(c=this.pushStack([]),b=0;b<d;b++)r.find(a,e[b],c);return d>1?r.uniqueSort(c):c},filter:function(a){return this.pushStack(D(this,a||[],!1))},not:function(a){return this.pushStack(D(this,a||[],!0))},is:function(a){return!!D(this,"string"==typeof a&&A.test(a)?r(a):a||[],!1).length}});var E,F=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,G=r.fn.init=function(a,b,c){var e,f;if(!a)return this;if(c=c||E,"string"==typeof a){if(e="<"===a[0]&&">"===a[a.length-1]&&a.length>=3?[null,a,null]:F.exec(a),!e||!e[1]&&b)return!b||b.jquery?(b||c).find(a):this.constructor(b).find(a);if(e[1]){if(b=b instanceof r?b[0]:b,r.merge(this,r.parseHTML(e[1],b&&b.nodeType?b.ownerDocument||b:d,!0)),B.test(e[1])&&r.isPlainObject(b))for(e in b)r.isFunction(this[e])?this[e](b[e]):this.attr(e,b[e]);return this}return f=d.getElementById(e[2]),f&&(this[0]=f,this.length=1),this}return a.nodeType?(this[0]=a,this.length=1,this):r.isFunction(a)?void 0!==c.ready?c.ready(a):a(r):r.makeArray(a,this)};G.prototype=r.fn,E=r(d);var H=/^(?:parents|prev(?:Until|All))/,I={children:!0,contents:!0,next:!0,prev:!0};r.fn.extend({has:function(a){var b=r(a,this),c=b.length;return this.filter(function(){for(var a=0;a<c;a++)if(r.contains(this,b[a]))return!0})},closest:function(a,b){var c,d=0,e=this.length,f=[],g="string"!=typeof a&&r(a);if(!A.test(a))for(;d<e;d++)for(c=this[d];c&&c!==b;c=c.parentNode)if(c.nodeType<11&&(g?g.index(c)>-1:1===c.nodeType&&r.find.matchesSelector(c,a))){f.push(c);break}return this.pushStack(f.length>1?r.uniqueSort(f):f)},index:function(a){return a?"string"==typeof a?i.call(r(a),this[0]):i.call(this,a.jquery?a[0]:a):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(a,b){return this.pushStack(r.uniqueSort(r.merge(this.get(),r(a,b))))},addBack:function(a){return this.add(null==a?this.prevObject:this.prevObject.filter(a))}});function J(a,b){while((a=a[b])&&1!==a.nodeType);return a}r.each({parent:function(a){var b=a.parentNode;return b&&11!==b.nodeType?b:null},parents:function(a){return y(a,"parentNode")},parentsUntil:function(a,b,c){return y(a,"parentNode",c)},next:function(a){return J(a,"nextSibling")},prev:function(a){return J(a,"previousSibling")},nextAll:function(a){return y(a,"nextSibling")},prevAll:function(a){return y(a,"previousSibling")},nextUntil:function(a,b,c){return y(a,"nextSibling",c)},prevUntil:function(a,b,c){return y(a,"previousSibling",c)},siblings:function(a){return z((a.parentNode||{}).firstChild,a)},children:function(a){return z(a.firstChild)},contents:function(a){return a.contentDocument||r.merge([],a.childNodes)}},function(a,b){r.fn[a]=function(c,d){var e=r.map(this,b,c);return"Until"!==a.slice(-5)&&(d=c),d&&"string"==typeof d&&(e=r.filter(d,e)),this.length>1&&(I[a]||r.uniqueSort(e),H.test(a)&&e.reverse()),this.pushStack(e)}});var K=/\S+/g;function L(a){var b={};return r.each(a.match(K)||[],function(a,c){b[c]=!0}),b}r.Callbacks=function(a){a="string"==typeof a?L(a):r.extend({},a);var b,c,d,e,f=[],g=[],h=-1,i=function(){for(e=a.once,d=b=!0;g.length;h=-1){c=g.shift();while(++h<f.length)f[h].apply(c[0],c[1])===!1&&a.stopOnFalse&&(h=f.length,c=!1)}a.memory||(c=!1),b=!1,e&&(f=c?[]:"")},j={add:function(){return f&&(c&&!b&&(h=f.length-1,g.push(c)),function d(b){r.each(b,function(b,c){r.isFunction(c)?a.unique&&j.has(c)||f.push(c):c&&c.length&&"string"!==r.type(c)&&d(c)})}(arguments),c&&!b&&i()),this},remove:function(){return r.each(arguments,function(a,b){var c;while((c=r.inArray(b,f,c))>-1)f.splice(c,1),c<=h&&h--}),this},has:function(a){return a?r.inArray(a,f)>-1:f.length>0},empty:function(){return f&&(f=[]),this},disable:function(){return e=g=[],f=c="",this},disabled:function(){return!f},lock:function(){return e=g=[],c||b||(f=c=""),this},locked:function(){return!!e},fireWith:function(a,c){return e||(c=c||[],c=[a,c.slice?c.slice():c],g.push(c),b||i()),this},fire:function(){return j.fireWith(this,arguments),this},fired:function(){return!!d}};return j};function M(a){return a}function N(a){throw a}function O(a,b,c){var d;try{a&&r.isFunction(d=a.promise)?d.call(a).done(b).fail(c):a&&r.isFunction(d=a.then)?d.call(a,b,c):b.call(void 0,a)}catch(a){c.call(void 0,a)}}r.extend({Deferred:function(b){var c=[["notify","progress",r.Callbacks("memory"),r.Callbacks("memory"),2],["resolve","done",r.Callbacks("once memory"),r.Callbacks("once memory"),0,"resolved"],["reject","fail",r.Callbacks("once memory"),r.Callbacks("once memory"),1,"rejected"]],d="pending",e={state:function(){return d},always:function(){return f.done(arguments).fail(arguments),this},"catch":function(a){return e.then(null,a)},pipe:function(){var a=arguments;return r.Deferred(function(b){r.each(c,function(c,d){var e=r.isFunction(a[d[4]])&&a[d[4]];f[d[1]](function(){var a=e&&e.apply(this,arguments);a&&r.isFunction(a.promise)?a.promise().progress(b.notify).done(b.resolve).fail(b.reject):b[d[0]+"With"](this,e?[a]:arguments)})}),a=null}).promise()},then:function(b,d,e){var f=0;function g(b,c,d,e){return function(){var h=this,i=arguments,j=function(){var a,j;if(!(b<f)){if(a=d.apply(h,i),a===c.promise())throw new TypeError("Thenable self-resolution");j=a&&("object"==typeof a||"function"==typeof a)&&a.then,r.isFunction(j)?e?j.call(a,g(f,c,M,e),g(f,c,N,e)):(f++,j.call(a,g(f,c,M,e),g(f,c,N,e),g(f,c,M,c.notifyWith))):(d!==M&&(h=void 0,i=[a]),(e||c.resolveWith)(h,i))}},k=e?j:function(){try{j()}catch(a){r.Deferred.exceptionHook&&r.Deferred.exceptionHook(a,k.stackTrace),b+1>=f&&(d!==N&&(h=void 0,i=[a]),c.rejectWith(h,i))}};b?k():(r.Deferred.getStackHook&&(k.stackTrace=r.Deferred.getStackHook()),a.setTimeout(k))}}return r.Deferred(function(a){c[0][3].add(g(0,a,r.isFunction(e)?e:M,a.notifyWith)),c[1][3].add(g(0,a,r.isFunction(b)?b:M)),c[2][3].add(g(0,a,r.isFunction(d)?d:N))}).promise()},promise:function(a){return null!=a?r.extend(a,e):e}},f={};return r.each(c,function(a,b){var g=b[2],h=b[5];e[b[1]]=g.add,h&&g.add(function(){d=h},c[3-a][2].disable,c[0][2].lock),g.add(b[3].fire),f[b[0]]=function(){return f[b[0]+"With"](this===f?void 0:this,arguments),this},f[b[0]+"With"]=g.fireWith}),e.promise(f),b&&b.call(f,f),f},when:function(a){var b=arguments.length,c=b,d=Array(c),e=f.call(arguments),g=r.Deferred(),h=function(a){return function(c){d[a]=this,e[a]=arguments.length>1?f.call(arguments):c,--b||g.resolveWith(d,e)}};if(b<=1&&(O(a,g.done(h(c)).resolve,g.reject),"pending"===g.state()||r.isFunction(e[c]&&e[c].then)))return g.then();while(c--)O(e[c],h(c),g.reject);return g.promise()}});var P=/^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;r.Deferred.exceptionHook=function(b,c){a.console&&a.console.warn&&b&&P.test(b.name)&&a.console.warn("jQuery.Deferred exception: "+b.message,b.stack,c)},r.readyException=function(b){a.setTimeout(function(){throw b})};var Q=r.Deferred();r.fn.ready=function(a){return Q.then(a)["catch"](function(a){r.readyException(a)}),this},r.extend({isReady:!1,readyWait:1,holdReady:function(a){a?r.readyWait++:r.ready(!0)},ready:function(a){(a===!0?--r.readyWait:r.isReady)||(r.isReady=!0,a!==!0&&--r.readyWait>0||Q.resolveWith(d,[r]))}}),r.ready.then=Q.then;function R(){d.removeEventListener("DOMContentLoaded",R),a.removeEventListener("load",R),r.ready()}"complete"===d.readyState||"loading"!==d.readyState&&!d.documentElement.doScroll?a.setTimeout(r.ready):(d.addEventListener("DOMContentLoaded",R),a.addEventListener("load",R));var S=function(a,b,c,d,e,f,g){var h=0,i=a.length,j=null==c;if("object"===r.type(c)){e=!0;for(h in c)S(a,b,h,c[h],!0,f,g)}else if(void 0!==d&&(e=!0,
r.isFunction(d)||(g=!0),j&&(g?(b.call(a,d),b=null):(j=b,b=function(a,b,c){return j.call(r(a),c)})),b))for(;h<i;h++)b(a[h],c,g?d:d.call(a[h],h,b(a[h],c)));return e?a:j?b.call(a):i?b(a[0],c):f},T=function(a){return 1===a.nodeType||9===a.nodeType||!+a.nodeType};function U(){this.expando=r.expando+U.uid++}U.uid=1,U.prototype={cache:function(a){var b=a[this.expando];return b||(b={},T(a)&&(a.nodeType?a[this.expando]=b:Object.defineProperty(a,this.expando,{value:b,configurable:!0}))),b},set:function(a,b,c){var d,e=this.cache(a);if("string"==typeof b)e[r.camelCase(b)]=c;else for(d in b)e[r.camelCase(d)]=b[d];return e},get:function(a,b){return void 0===b?this.cache(a):a[this.expando]&&a[this.expando][r.camelCase(b)]},access:function(a,b,c){return void 0===b||b&&"string"==typeof b&&void 0===c?this.get(a,b):(this.set(a,b,c),void 0!==c?c:b)},remove:function(a,b){var c,d=a[this.expando];if(void 0!==d){if(void 0!==b){r.isArray(b)?b=b.map(r.camelCase):(b=r.camelCase(b),b=b in d?[b]:b.match(K)||[]),c=b.length;while(c--)delete d[b[c]]}(void 0===b||r.isEmptyObject(d))&&(a.nodeType?a[this.expando]=void 0:delete a[this.expando])}},hasData:function(a){var b=a[this.expando];return void 0!==b&&!r.isEmptyObject(b)}};var V=new U,W=new U,X=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,Y=/[A-Z]/g;function Z(a,b,c){var d;if(void 0===c&&1===a.nodeType)if(d="data-"+b.replace(Y,"-$&").toLowerCase(),c=a.getAttribute(d),"string"==typeof c){try{c="true"===c||"false"!==c&&("null"===c?null:+c+""===c?+c:X.test(c)?JSON.parse(c):c)}catch(e){}W.set(a,b,c)}else c=void 0;return c}r.extend({hasData:function(a){return W.hasData(a)||V.hasData(a)},data:function(a,b,c){return W.access(a,b,c)},removeData:function(a,b){W.remove(a,b)},_data:function(a,b,c){return V.access(a,b,c)},_removeData:function(a,b){V.remove(a,b)}}),r.fn.extend({data:function(a,b){var c,d,e,f=this[0],g=f&&f.attributes;if(void 0===a){if(this.length&&(e=W.get(f),1===f.nodeType&&!V.get(f,"hasDataAttrs"))){c=g.length;while(c--)g[c]&&(d=g[c].name,0===d.indexOf("data-")&&(d=r.camelCase(d.slice(5)),Z(f,d,e[d])));V.set(f,"hasDataAttrs",!0)}return e}return"object"==typeof a?this.each(function(){W.set(this,a)}):S(this,function(b){var c;if(f&&void 0===b){if(c=W.get(f,a),void 0!==c)return c;if(c=Z(f,a),void 0!==c)return c}else this.each(function(){W.set(this,a,b)})},null,b,arguments.length>1,null,!0)},removeData:function(a){return this.each(function(){W.remove(this,a)})}}),r.extend({queue:function(a,b,c){var d;if(a)return b=(b||"fx")+"queue",d=V.get(a,b),c&&(!d||r.isArray(c)?d=V.access(a,b,r.makeArray(c)):d.push(c)),d||[]},dequeue:function(a,b){b=b||"fx";var c=r.queue(a,b),d=c.length,e=c.shift(),f=r._queueHooks(a,b),g=function(){r.dequeue(a,b)};"inprogress"===e&&(e=c.shift(),d--),e&&("fx"===b&&c.unshift("inprogress"),delete f.stop,e.call(a,g,f)),!d&&f&&f.empty.fire()},_queueHooks:function(a,b){var c=b+"queueHooks";return V.get(a,c)||V.access(a,c,{empty:r.Callbacks("once memory").add(function(){V.remove(a,[b+"queue",c])})})}}),r.fn.extend({queue:function(a,b){var c=2;return"string"!=typeof a&&(b=a,a="fx",c--),arguments.length<c?r.queue(this[0],a):void 0===b?this:this.each(function(){var c=r.queue(this,a,b);r._queueHooks(this,a),"fx"===a&&"inprogress"!==c[0]&&r.dequeue(this,a)})},dequeue:function(a){return this.each(function(){r.dequeue(this,a)})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,b){var c,d=1,e=r.Deferred(),f=this,g=this.length,h=function(){--d||e.resolveWith(f,[f])};"string"!=typeof a&&(b=a,a=void 0),a=a||"fx";while(g--)c=V.get(f[g],a+"queueHooks"),c&&c.empty&&(d++,c.empty.add(h));return h(),e.promise(b)}});var $=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,_=new RegExp("^(?:([+-])=|)("+$+")([a-z%]*)$","i"),aa=["Top","Right","Bottom","Left"],ba=function(a,b){return a=b||a,"none"===a.style.display||""===a.style.display&&r.contains(a.ownerDocument,a)&&"none"===r.css(a,"display")},ca=function(a,b,c,d){var e,f,g={};for(f in b)g[f]=a.style[f],a.style[f]=b[f];e=c.apply(a,d||[]);for(f in b)a.style[f]=g[f];return e};function da(a,b,c,d){var e,f=1,g=20,h=d?function(){return d.cur()}:function(){return r.css(a,b,"")},i=h(),j=c&&c[3]||(r.cssNumber[b]?"":"px"),k=(r.cssNumber[b]||"px"!==j&&+i)&&_.exec(r.css(a,b));if(k&&k[3]!==j){j=j||k[3],c=c||[],k=+i||1;do f=f||".5",k/=f,r.style(a,b,k+j);while(f!==(f=h()/i)&&1!==f&&--g)}return c&&(k=+k||+i||0,e=c[1]?k+(c[1]+1)*c[2]:+c[2],d&&(d.unit=j,d.start=k,d.end=e)),e}var ea={};function fa(a){var b,c=a.ownerDocument,d=a.nodeName,e=ea[d];return e?e:(b=c.body.appendChild(c.createElement(d)),e=r.css(b,"display"),b.parentNode.removeChild(b),"none"===e&&(e="block"),ea[d]=e,e)}function ga(a,b){for(var c,d,e=[],f=0,g=a.length;f<g;f++)d=a[f],d.style&&(c=d.style.display,b?("none"===c&&(e[f]=V.get(d,"display")||null,e[f]||(d.style.display="")),""===d.style.display&&ba(d)&&(e[f]=fa(d))):"none"!==c&&(e[f]="none",V.set(d,"display",c)));for(f=0;f<g;f++)null!=e[f]&&(a[f].style.display=e[f]);return a}r.fn.extend({show:function(){return ga(this,!0)},hide:function(){return ga(this)},toggle:function(a){return"boolean"==typeof a?a?this.show():this.hide():this.each(function(){ba(this)?r(this).show():r(this).hide()})}});var ha=/^(?:checkbox|radio)$/i,ia=/<([a-z][^\/\0>\x20\t\r\n\f]+)/i,ja=/^$|\/(?:java|ecma)script/i,ka={option:[1,"<select multiple='multiple'>","</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};ka.optgroup=ka.option,ka.tbody=ka.tfoot=ka.colgroup=ka.caption=ka.thead,ka.th=ka.td;function la(a,b){var c="undefined"!=typeof a.getElementsByTagName?a.getElementsByTagName(b||"*"):"undefined"!=typeof a.querySelectorAll?a.querySelectorAll(b||"*"):[];return void 0===b||b&&r.nodeName(a,b)?r.merge([a],c):c}function ma(a,b){for(var c=0,d=a.length;c<d;c++)V.set(a[c],"globalEval",!b||V.get(b[c],"globalEval"))}var na=/<|&#?\w+;/;function oa(a,b,c,d,e){for(var f,g,h,i,j,k,l=b.createDocumentFragment(),m=[],n=0,o=a.length;n<o;n++)if(f=a[n],f||0===f)if("object"===r.type(f))r.merge(m,f.nodeType?[f]:f);else if(na.test(f)){g=g||l.appendChild(b.createElement("div")),h=(ia.exec(f)||["",""])[1].toLowerCase(),i=ka[h]||ka._default,g.innerHTML=i[1]+r.htmlPrefilter(f)+i[2],k=i[0];while(k--)g=g.lastChild;r.merge(m,g.childNodes),g=l.firstChild,g.textContent=""}else m.push(b.createTextNode(f));l.textContent="",n=0;while(f=m[n++])if(d&&r.inArray(f,d)>-1)e&&e.push(f);else if(j=r.contains(f.ownerDocument,f),g=la(l.appendChild(f),"script"),j&&ma(g),c){k=0;while(f=g[k++])ja.test(f.type||"")&&c.push(f)}return l}!function(){var a=d.createDocumentFragment(),b=a.appendChild(d.createElement("div")),c=d.createElement("input");c.setAttribute("type","radio"),c.setAttribute("checked","checked"),c.setAttribute("name","t"),b.appendChild(c),o.checkClone=b.cloneNode(!0).cloneNode(!0).lastChild.checked,b.innerHTML="<textarea>x</textarea>",o.noCloneChecked=!!b.cloneNode(!0).lastChild.defaultValue}();var pa=d.documentElement,qa=/^key/,ra=/^(?:mouse|pointer|contextmenu|drag|drop)|click/,sa=/^([^.]*)(?:\.(.+)|)/;function ta(){return!0}function ua(){return!1}function va(){try{return d.activeElement}catch(a){}}function wa(a,b,c,d,e,f){var g,h;if("object"==typeof b){"string"!=typeof c&&(d=d||c,c=void 0);for(h in b)wa(a,h,c,d,b[h],f);return a}if(null==d&&null==e?(e=c,d=c=void 0):null==e&&("string"==typeof c?(e=d,d=void 0):(e=d,d=c,c=void 0)),e===!1)e=ua;else if(!e)return a;return 1===f&&(g=e,e=function(a){return r().off(a),g.apply(this,arguments)},e.guid=g.guid||(g.guid=r.guid++)),a.each(function(){r.event.add(this,b,e,d,c)})}r.event={global:{},add:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,n,o,p,q=V.get(a);if(q){c.handler&&(f=c,c=f.handler,e=f.selector),e&&r.find.matchesSelector(pa,e),c.guid||(c.guid=r.guid++),(i=q.events)||(i=q.events={}),(g=q.handle)||(g=q.handle=function(b){return"undefined"!=typeof r&&r.event.triggered!==b.type?r.event.dispatch.apply(a,arguments):void 0}),b=(b||"").match(K)||[""],j=b.length;while(j--)h=sa.exec(b[j])||[],n=p=h[1],o=(h[2]||"").split(".").sort(),n&&(l=r.event.special[n]||{},n=(e?l.delegateType:l.bindType)||n,l=r.event.special[n]||{},k=r.extend({type:n,origType:p,data:d,handler:c,guid:c.guid,selector:e,needsContext:e&&r.expr.match.needsContext.test(e),namespace:o.join(".")},f),(m=i[n])||(m=i[n]=[],m.delegateCount=0,l.setup&&l.setup.call(a,d,o,g)!==!1||a.addEventListener&&a.addEventListener(n,g)),l.add&&(l.add.call(a,k),k.handler.guid||(k.handler.guid=c.guid)),e?m.splice(m.delegateCount++,0,k):m.push(k),r.event.global[n]=!0)}},remove:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,n,o,p,q=V.hasData(a)&&V.get(a);if(q&&(i=q.events)){b=(b||"").match(K)||[""],j=b.length;while(j--)if(h=sa.exec(b[j])||[],n=p=h[1],o=(h[2]||"").split(".").sort(),n){l=r.event.special[n]||{},n=(d?l.delegateType:l.bindType)||n,m=i[n]||[],h=h[2]&&new RegExp("(^|\\.)"+o.join("\\.(?:.*\\.|)")+"(\\.|$)"),g=f=m.length;while(f--)k=m[f],!e&&p!==k.origType||c&&c.guid!==k.guid||h&&!h.test(k.namespace)||d&&d!==k.selector&&("**"!==d||!k.selector)||(m.splice(f,1),k.selector&&m.delegateCount--,l.remove&&l.remove.call(a,k));g&&!m.length&&(l.teardown&&l.teardown.call(a,o,q.handle)!==!1||r.removeEvent(a,n,q.handle),delete i[n])}else for(n in i)r.event.remove(a,n+b[j],c,d,!0);r.isEmptyObject(i)&&V.remove(a,"handle events")}},dispatch:function(a){var b=r.event.fix(a),c,d,e,f,g,h,i=new Array(arguments.length),j=(V.get(this,"events")||{})[b.type]||[],k=r.event.special[b.type]||{};for(i[0]=b,c=1;c<arguments.length;c++)i[c]=arguments[c];if(b.delegateTarget=this,!k.preDispatch||k.preDispatch.call(this,b)!==!1){h=r.event.handlers.call(this,b,j),c=0;while((f=h[c++])&&!b.isPropagationStopped()){b.currentTarget=f.elem,d=0;while((g=f.handlers[d++])&&!b.isImmediatePropagationStopped())b.rnamespace&&!b.rnamespace.test(g.namespace)||(b.handleObj=g,b.data=g.data,e=((r.event.special[g.origType]||{}).handle||g.handler).apply(f.elem,i),void 0!==e&&(b.result=e)===!1&&(b.preventDefault(),b.stopPropagation()))}return k.postDispatch&&k.postDispatch.call(this,b),b.result}},handlers:function(a,b){var c,d,e,f,g=[],h=b.delegateCount,i=a.target;if(h&&i.nodeType&&("click"!==a.type||isNaN(a.button)||a.button<1))for(;i!==this;i=i.parentNode||this)if(1===i.nodeType&&(i.disabled!==!0||"click"!==a.type)){for(d=[],c=0;c<h;c++)f=b[c],e=f.selector+" ",void 0===d[e]&&(d[e]=f.needsContext?r(e,this).index(i)>-1:r.find(e,this,null,[i]).length),d[e]&&d.push(f);d.length&&g.push({elem:i,handlers:d})}return h<b.length&&g.push({elem:this,handlers:b.slice(h)}),g},addProp:function(a,b){Object.defineProperty(r.Event.prototype,a,{enumerable:!0,configurable:!0,get:r.isFunction(b)?function(){if(this.originalEvent)return b(this.originalEvent)}:function(){if(this.originalEvent)return this.originalEvent[a]},set:function(b){Object.defineProperty(this,a,{enumerable:!0,configurable:!0,writable:!0,value:b})}})},fix:function(a){return a[r.expando]?a:new r.Event(a)},special:{load:{noBubble:!0},focus:{trigger:function(){if(this!==va()&&this.focus)return this.focus(),!1},delegateType:"focusin"},blur:{trigger:function(){if(this===va()&&this.blur)return this.blur(),!1},delegateType:"focusout"},click:{trigger:function(){if("checkbox"===this.type&&this.click&&r.nodeName(this,"input"))return this.click(),!1},_default:function(a){return r.nodeName(a.target,"a")}},beforeunload:{postDispatch:function(a){void 0!==a.result&&a.originalEvent&&(a.originalEvent.returnValue=a.result)}}}},r.removeEvent=function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c)},r.Event=function(a,b){return this instanceof r.Event?(a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||void 0===a.defaultPrevented&&a.returnValue===!1?ta:ua,this.target=a.target&&3===a.target.nodeType?a.target.parentNode:a.target,this.currentTarget=a.currentTarget,this.relatedTarget=a.relatedTarget):this.type=a,b&&r.extend(this,b),this.timeStamp=a&&a.timeStamp||r.now(),void(this[r.expando]=!0)):new r.Event(a,b)},r.Event.prototype={constructor:r.Event,isDefaultPrevented:ua,isPropagationStopped:ua,isImmediatePropagationStopped:ua,isSimulated:!1,preventDefault:function(){var a=this.originalEvent;this.isDefaultPrevented=ta,a&&!this.isSimulated&&a.preventDefault()},stopPropagation:function(){var a=this.originalEvent;this.isPropagationStopped=ta,a&&!this.isSimulated&&a.stopPropagation()},stopImmediatePropagation:function(){var a=this.originalEvent;this.isImmediatePropagationStopped=ta,a&&!this.isSimulated&&a.stopImmediatePropagation(),this.stopPropagation()}},r.each({altKey:!0,bubbles:!0,cancelable:!0,changedTouches:!0,ctrlKey:!0,detail:!0,eventPhase:!0,metaKey:!0,pageX:!0,pageY:!0,shiftKey:!0,view:!0,"char":!0,charCode:!0,key:!0,keyCode:!0,button:!0,buttons:!0,clientX:!0,clientY:!0,offsetX:!0,offsetY:!0,pointerId:!0,pointerType:!0,screenX:!0,screenY:!0,targetTouches:!0,toElement:!0,touches:!0,which:function(a){var b=a.button;return null==a.which&&qa.test(a.type)?null!=a.charCode?a.charCode:a.keyCode:!a.which&&void 0!==b&&ra.test(a.type)?1&b?1:2&b?3:4&b?2:0:a.which}},r.event.addProp),r.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(a,b){r.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c,d=this,e=a.relatedTarget,f=a.handleObj;return e&&(e===d||r.contains(d,e))||(a.type=f.origType,c=f.handler.apply(this,arguments),a.type=b),c}}}),r.fn.extend({on:function(a,b,c,d){return wa(this,a,b,c,d)},one:function(a,b,c,d){return wa(this,a,b,c,d,1)},off:function(a,b,c){var d,e;if(a&&a.preventDefault&&a.handleObj)return d=a.handleObj,r(a.delegateTarget).off(d.namespace?d.origType+"."+d.namespace:d.origType,d.selector,d.handler),this;if("object"==typeof a){for(e in a)this.off(e,b,a[e]);return this}return b!==!1&&"function"!=typeof b||(c=b,b=void 0),c===!1&&(c=ua),this.each(function(){r.event.remove(this,a,c,b)})}});var xa=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,ya=/<script|<style|<link/i,za=/checked\s*(?:[^=]|=\s*.checked.)/i,Aa=/^true\/(.*)/,Ba=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;function Ca(a,b){return r.nodeName(a,"table")&&r.nodeName(11!==b.nodeType?b:b.firstChild,"tr")?a.getElementsByTagName("tbody")[0]||a:a}function Da(a){return a.type=(null!==a.getAttribute("type"))+"/"+a.type,a}function Ea(a){var b=Aa.exec(a.type);return b?a.type=b[1]:a.removeAttribute("type"),a}function Fa(a,b){var c,d,e,f,g,h,i,j;if(1===b.nodeType){if(V.hasData(a)&&(f=V.access(a),g=V.set(b,f),j=f.events)){delete g.handle,g.events={};for(e in j)for(c=0,d=j[e].length;c<d;c++)r.event.add(b,e,j[e][c])}W.hasData(a)&&(h=W.access(a),i=r.extend({},h),W.set(b,i))}}function Ga(a,b){var c=b.nodeName.toLowerCase();"input"===c&&ha.test(a.type)?b.checked=a.checked:"input"!==c&&"textarea"!==c||(b.defaultValue=a.defaultValue)}function Ha(a,b,c,d){b=g.apply([],b);var e,f,h,i,j,k,l=0,m=a.length,n=m-1,q=b[0],s=r.isFunction(q);if(s||m>1&&"string"==typeof q&&!o.checkClone&&za.test(q))return a.each(function(e){var f=a.eq(e);s&&(b[0]=q.call(this,e,f.html())),Ha(f,b,c,d)});if(m&&(e=oa(b,a[0].ownerDocument,!1,a,d),f=e.firstChild,1===e.childNodes.length&&(e=f),f||d)){for(h=r.map(la(e,"script"),Da),i=h.length;l<m;l++)j=e,l!==n&&(j=r.clone(j,!0,!0),i&&r.merge(h,la(j,"script"))),c.call(a[l],j,l);if(i)for(k=h[h.length-1].ownerDocument,r.map(h,Ea),l=0;l<i;l++)j=h[l],ja.test(j.type||"")&&!V.access(j,"globalEval")&&r.contains(k,j)&&(j.src?r._evalUrl&&r._evalUrl(j.src):p(j.textContent.replace(Ba,""),k))}return a}function Ia(a,b,c){for(var d,e=b?r.filter(b,a):a,f=0;null!=(d=e[f]);f++)c||1!==d.nodeType||r.cleanData(la(d)),d.parentNode&&(c&&r.contains(d.ownerDocument,d)&&ma(la(d,"script")),d.parentNode.removeChild(d));return a}r.extend({htmlPrefilter:function(a){return a.replace(xa,"<$1></$2>")},clone:function(a,b,c){var d,e,f,g,h=a.cloneNode(!0),i=r.contains(a.ownerDocument,a);if(!(o.noCloneChecked||1!==a.nodeType&&11!==a.nodeType||r.isXMLDoc(a)))for(g=la(h),f=la(a),d=0,e=f.length;d<e;d++)Ga(f[d],g[d]);if(b)if(c)for(f=f||la(a),g=g||la(h),d=0,e=f.length;d<e;d++)Fa(f[d],g[d]);else Fa(a,h);return g=la(h,"script"),g.length>0&&ma(g,!i&&la(a,"script")),h},cleanData:function(a){for(var b,c,d,e=r.event.special,f=0;void 0!==(c=a[f]);f++)if(T(c)){if(b=c[V.expando]){if(b.events)for(d in b.events)e[d]?r.event.remove(c,d):r.removeEvent(c,d,b.handle);c[V.expando]=void 0}c[W.expando]&&(c[W.expando]=void 0)}}}),r.fn.extend({detach:function(a){return Ia(this,a,!0)},remove:function(a){return Ia(this,a)},text:function(a){return S(this,function(a){return void 0===a?r.text(this):this.empty().each(function(){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||(this.textContent=a)})},null,a,arguments.length)},append:function(){return Ha(this,arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=Ca(this,a);b.appendChild(a)}})},prepend:function(){return Ha(this,arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=Ca(this,a);b.insertBefore(a,b.firstChild)}})},before:function(){return Ha(this,arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this)})},after:function(){return Ha(this,arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this.nextSibling)})},empty:function(){for(var a,b=0;null!=(a=this[b]);b++)1===a.nodeType&&(r.cleanData(la(a,!1)),a.textContent="");return this},clone:function(a,b){return a=null!=a&&a,b=null==b?a:b,this.map(function(){return r.clone(this,a,b)})},html:function(a){return S(this,function(a){var b=this[0]||{},c=0,d=this.length;if(void 0===a&&1===b.nodeType)return b.innerHTML;if("string"==typeof a&&!ya.test(a)&&!ka[(ia.exec(a)||["",""])[1].toLowerCase()]){a=r.htmlPrefilter(a);try{for(;c<d;c++)b=this[c]||{},1===b.nodeType&&(r.cleanData(la(b,!1)),b.innerHTML=a);b=0}catch(e){}}b&&this.empty().append(a)},null,a,arguments.length)},replaceWith:function(){var a=[];return Ha(this,arguments,function(b){var c=this.parentNode;r.inArray(this,a)<0&&(r.cleanData(la(this)),c&&c.replaceChild(b,this))},a)}}),r.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){r.fn[a]=function(a){for(var c,d=[],e=r(a),f=e.length-1,g=0;g<=f;g++)c=g===f?this:this.clone(!0),r(e[g])[b](c),h.apply(d,c.get());return this.pushStack(d)}});var Ja=/^margin/,Ka=new RegExp("^("+$+")(?!px)[a-z%]+$","i"),La=function(b){var c=b.ownerDocument.defaultView;return c&&c.opener||(c=a),c.getComputedStyle(b)};!function(){function b(){if(i){i.style.cssText="box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%",i.innerHTML="",pa.appendChild(h);var b=a.getComputedStyle(i);c="1%"!==b.top,g="2px"===b.marginLeft,e="4px"===b.width,i.style.marginRight="50%",f="4px"===b.marginRight,pa.removeChild(h),i=null}}var c,e,f,g,h=d.createElement("div"),i=d.createElement("div");i.style&&(i.style.backgroundClip="content-box",i.cloneNode(!0).style.backgroundClip="",o.clearCloneStyle="content-box"===i.style.backgroundClip,h.style.cssText="border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute",h.appendChild(i),r.extend(o,{pixelPosition:function(){return b(),c},boxSizingReliable:function(){return b(),e},pixelMarginRight:function(){return b(),f},reliableMarginLeft:function(){return b(),g}}))}();function Ma(a,b,c){var d,e,f,g,h=a.style;return c=c||La(a),c&&(g=c.getPropertyValue(b)||c[b],""!==g||r.contains(a.ownerDocument,a)||(g=r.style(a,b)),!o.pixelMarginRight()&&Ka.test(g)&&Ja.test(b)&&(d=h.width,e=h.minWidth,f=h.maxWidth,h.minWidth=h.maxWidth=h.width=g,g=c.width,h.width=d,h.minWidth=e,h.maxWidth=f)),void 0!==g?g+"":g}function Na(a,b){return{get:function(){return a()?void delete this.get:(this.get=b).apply(this,arguments)}}}var Oa=/^(none|table(?!-c[ea]).+)/,Pa={position:"absolute",visibility:"hidden",display:"block"},Qa={letterSpacing:"0",fontWeight:"400"},Ra=["Webkit","Moz","ms"],Sa=d.createElement("div").style;function Ta(a){if(a in Sa)return a;var b=a[0].toUpperCase()+a.slice(1),c=Ra.length;while(c--)if(a=Ra[c]+b,a in Sa)return a}function Ua(a,b,c){var d=_.exec(b);return d?Math.max(0,d[2]-(c||0))+(d[3]||"px"):b}function Va(a,b,c,d,e){for(var f=c===(d?"border":"content")?4:"width"===b?1:0,g=0;f<4;f+=2)"margin"===c&&(g+=r.css(a,c+aa[f],!0,e)),d?("content"===c&&(g-=r.css(a,"padding"+aa[f],!0,e)),"margin"!==c&&(g-=r.css(a,"border"+aa[f]+"Width",!0,e))):(g+=r.css(a,"padding"+aa[f],!0,e),"padding"!==c&&(g+=r.css(a,"border"+aa[f]+"Width",!0,e)));return g}function Wa(a,b,c){var d,e=!0,f=La(a),g="border-box"===r.css(a,"boxSizing",!1,f);if(a.getClientRects().length&&(d=a.getBoundingClientRect()[b]),d<=0||null==d){if(d=Ma(a,b,f),(d<0||null==d)&&(d=a.style[b]),Ka.test(d))return d;e=g&&(o.boxSizingReliable()||d===a.style[b]),d=parseFloat(d)||0}return d+Va(a,b,c||(g?"border":"content"),e,f)+"px"}r.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=Ma(a,"opacity");return""===c?"1":c}}}},cssNumber:{animationIterationCount:!0,columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":"cssFloat"},style:function(a,b,c,d){if(a&&3!==a.nodeType&&8!==a.nodeType&&a.style){var e,f,g,h=r.camelCase(b),i=a.style;return b=r.cssProps[h]||(r.cssProps[h]=Ta(h)||h),g=r.cssHooks[b]||r.cssHooks[h],void 0===c?g&&"get"in g&&void 0!==(e=g.get(a,!1,d))?e:i[b]:(f=typeof c,"string"===f&&(e=_.exec(c))&&e[1]&&(c=da(a,b,e),f="number"),null!=c&&c===c&&("number"===f&&(c+=e&&e[3]||(r.cssNumber[h]?"":"px")),o.clearCloneStyle||""!==c||0!==b.indexOf("background")||(i[b]="inherit"),g&&"set"in g&&void 0===(c=g.set(a,c,d))||(i[b]=c)),void 0)}},css:function(a,b,c,d){var e,f,g,h=r.camelCase(b);return b=r.cssProps[h]||(r.cssProps[h]=Ta(h)||h),g=r.cssHooks[b]||r.cssHooks[h],g&&"get"in g&&(e=g.get(a,!0,c)),void 0===e&&(e=Ma(a,b,d)),"normal"===e&&b in Qa&&(e=Qa[b]),""===c||c?(f=parseFloat(e),c===!0||isFinite(f)?f||0:e):e}}),r.each(["height","width"],function(a,b){r.cssHooks[b]={get:function(a,c,d){if(c)return!Oa.test(r.css(a,"display"))||a.getClientRects().length&&a.getBoundingClientRect().width?Wa(a,b,d):ca(a,Pa,function(){return Wa(a,b,d)})},set:function(a,c,d){var e,f=d&&La(a),g=d&&Va(a,b,d,"border-box"===r.css(a,"boxSizing",!1,f),f);return g&&(e=_.exec(c))&&"px"!==(e[3]||"px")&&(a.style[b]=c,c=r.css(a,b)),Ua(a,c,g)}}}),r.cssHooks.marginLeft=Na(o.reliableMarginLeft,function(a,b){if(b)return(parseFloat(Ma(a,"marginLeft"))||a.getBoundingClientRect().left-ca(a,{marginLeft:0},function(){return a.getBoundingClientRect().left}))+"px"}),r.each({margin:"",padding:"",border:"Width"},function(a,b){r.cssHooks[a+b]={expand:function(c){for(var d=0,e={},f="string"==typeof c?c.split(" "):[c];d<4;d++)e[a+aa[d]+b]=f[d]||f[d-2]||f[0];return e}},Ja.test(a)||(r.cssHooks[a+b].set=Ua)}),r.fn.extend({css:function(a,b){return S(this,function(a,b,c){var d,e,f={},g=0;if(r.isArray(b)){for(d=La(a),e=b.length;g<e;g++)f[b[g]]=r.css(a,b[g],!1,d);return f}return void 0!==c?r.style(a,b,c):r.css(a,b)},a,b,arguments.length>1)}});function Xa(a,b,c,d,e){return new Xa.prototype.init(a,b,c,d,e)}r.Tween=Xa,Xa.prototype={constructor:Xa,init:function(a,b,c,d,e,f){this.elem=a,this.prop=c,this.easing=e||r.easing._default,this.options=b,this.start=this.now=this.cur(),this.end=d,this.unit=f||(r.cssNumber[c]?"":"px")},cur:function(){var a=Xa.propHooks[this.prop];return a&&a.get?a.get(this):Xa.propHooks._default.get(this)},run:function(a){var b,c=Xa.propHooks[this.prop];return this.options.duration?this.pos=b=r.easing[this.easing](a,this.options.duration*a,0,1,this.options.duration):this.pos=b=a,this.now=(this.end-this.start)*b+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),c&&c.set?c.set(this):Xa.propHooks._default.set(this),this}},Xa.prototype.init.prototype=Xa.prototype,Xa.propHooks={_default:{get:function(a){var b;return 1!==a.elem.nodeType||null!=a.elem[a.prop]&&null==a.elem.style[a.prop]?a.elem[a.prop]:(b=r.css(a.elem,a.prop,""),b&&"auto"!==b?b:0)},set:function(a){r.fx.step[a.prop]?r.fx.step[a.prop](a):1!==a.elem.nodeType||null==a.elem.style[r.cssProps[a.prop]]&&!r.cssHooks[a.prop]?a.elem[a.prop]=a.now:r.style(a.elem,a.prop,a.now+a.unit)}}},Xa.propHooks.scrollTop=Xa.propHooks.scrollLeft={set:function(a){a.elem.nodeType&&a.elem.parentNode&&(a.elem[a.prop]=a.now)}},r.easing={linear:function(a){return a},swing:function(a){return.5-Math.cos(a*Math.PI)/2},_default:"swing"},r.fx=Xa.prototype.init,r.fx.step={};var Ya,Za,$a=/^(?:toggle|show|hide)$/,_a=/queueHooks$/;function ab(){Za&&(a.requestAnimationFrame(ab),r.fx.tick())}function bb(){return a.setTimeout(function(){Ya=void 0}),Ya=r.now()}function cb(a,b){var c,d=0,e={height:a};for(b=b?1:0;d<4;d+=2-b)c=aa[d],e["margin"+c]=e["padding"+c]=a;return b&&(e.opacity=e.width=a),e}function db(a,b,c){for(var d,e=(gb.tweeners[b]||[]).concat(gb.tweeners["*"]),f=0,g=e.length;f<g;f++)if(d=e[f].call(c,b,a))return d}function eb(a,b,c){var d,e,f,g,h,i,j,k,l="width"in b||"height"in b,m=this,n={},o=a.style,p=a.nodeType&&ba(a),q=V.get(a,"fxshow");c.queue||(g=r._queueHooks(a,"fx"),null==g.unqueued&&(g.unqueued=0,h=g.empty.fire,g.empty.fire=function(){g.unqueued||h()}),g.unqueued++,m.always(function(){m.always(function(){g.unqueued--,r.queue(a,"fx").length||g.empty.fire()})}));for(d in b)if(e=b[d],$a.test(e)){if(delete b[d],f=f||"toggle"===e,e===(p?"hide":"show")){if("show"!==e||!q||void 0===q[d])continue;p=!0}n[d]=q&&q[d]||r.style(a,d)}if(i=!r.isEmptyObject(b),i||!r.isEmptyObject(n)){l&&1===a.nodeType&&(c.overflow=[o.overflow,o.overflowX,o.overflowY],j=q&&q.display,null==j&&(j=V.get(a,"display")),k=r.css(a,"display"),"none"===k&&(j?k=j:(ga([a],!0),j=a.style.display||j,k=r.css(a,"display"),ga([a]))),("inline"===k||"inline-block"===k&&null!=j)&&"none"===r.css(a,"float")&&(i||(m.done(function(){o.display=j}),null==j&&(k=o.display,j="none"===k?"":k)),o.display="inline-block")),c.overflow&&(o.overflow="hidden",m.always(function(){o.overflow=c.overflow[0],o.overflowX=c.overflow[1],o.overflowY=c.overflow[2]})),i=!1;for(d in n)i||(q?"hidden"in q&&(p=q.hidden):q=V.access(a,"fxshow",{display:j}),f&&(q.hidden=!p),p&&ga([a],!0),m.done(function(){p||ga([a]),V.remove(a,"fxshow");for(d in n)r.style(a,d,n[d])})),i=db(p?q[d]:0,d,m),d in q||(q[d]=i.start,p&&(i.end=i.start,i.start=0))}}function fb(a,b){var c,d,e,f,g;for(c in a)if(d=r.camelCase(c),e=b[d],f=a[c],r.isArray(f)&&(e=f[1],f=a[c]=f[0]),c!==d&&(a[d]=f,delete a[c]),g=r.cssHooks[d],g&&"expand"in g){f=g.expand(f),delete a[d];for(c in f)c in a||(a[c]=f[c],b[c]=e)}else b[d]=e}function gb(a,b,c){var d,e,f=0,g=gb.prefilters.length,h=r.Deferred().always(function(){delete i.elem}),i=function(){if(e)return!1;for(var b=Ya||bb(),c=Math.max(0,j.startTime+j.duration-b),d=c/j.duration||0,f=1-d,g=0,i=j.tweens.length;g<i;g++)j.tweens[g].run(f);return h.notifyWith(a,[j,f,c]),f<1&&i?c:(h.resolveWith(a,[j]),!1)},j=h.promise({elem:a,props:r.extend({},b),opts:r.extend(!0,{specialEasing:{},easing:r.easing._default},c),originalProperties:b,originalOptions:c,startTime:Ya||bb(),duration:c.duration,tweens:[],createTween:function(b,c){var d=r.Tween(a,j.opts,b,c,j.opts.specialEasing[b]||j.opts.easing);return j.tweens.push(d),d},stop:function(b){var c=0,d=b?j.tweens.length:0;if(e)return this;for(e=!0;c<d;c++)j.tweens[c].run(1);return b?(h.notifyWith(a,[j,1,0]),h.resolveWith(a,[j,b])):h.rejectWith(a,[j,b]),this}}),k=j.props;for(fb(k,j.opts.specialEasing);f<g;f++)if(d=gb.prefilters[f].call(j,a,k,j.opts))return r.isFunction(d.stop)&&(r._queueHooks(j.elem,j.opts.queue).stop=r.proxy(d.stop,d)),d;return r.map(k,db,j),r.isFunction(j.opts.start)&&j.opts.start.call(a,j),r.fx.timer(r.extend(i,{elem:a,anim:j,queue:j.opts.queue})),j.progress(j.opts.progress).done(j.opts.done,j.opts.complete).fail(j.opts.fail).always(j.opts.always)}r.Animation=r.extend(gb,{tweeners:{"*":[function(a,b){var c=this.createTween(a,b);return da(c.elem,a,_.exec(b),c),c}]},tweener:function(a,b){r.isFunction(a)?(b=a,a=["*"]):a=a.match(K);for(var c,d=0,e=a.length;d<e;d++)c=a[d],gb.tweeners[c]=gb.tweeners[c]||[],gb.tweeners[c].unshift(b)},prefilters:[eb],prefilter:function(a,b){b?gb.prefilters.unshift(a):gb.prefilters.push(a)}}),r.speed=function(a,b,c){var e=a&&"object"==typeof a?r.extend({},a):{complete:c||!c&&b||r.isFunction(a)&&a,duration:a,easing:c&&b||b&&!r.isFunction(b)&&b};return r.fx.off||d.hidden?e.duration=0:e.duration="number"==typeof e.duration?e.duration:e.duration in r.fx.speeds?r.fx.speeds[e.duration]:r.fx.speeds._default,null!=e.queue&&e.queue!==!0||(e.queue="fx"),e.old=e.complete,e.complete=function(){r.isFunction(e.old)&&e.old.call(this),e.queue&&r.dequeue(this,e.queue)},e},r.fn.extend({fadeTo:function(a,b,c,d){return this.filter(ba).css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){var e=r.isEmptyObject(a),f=r.speed(b,c,d),g=function(){var b=gb(this,r.extend({},a),f);(e||V.get(this,"finish"))&&b.stop(!0)};return g.finish=g,e||f.queue===!1?this.each(g):this.queue(f.queue,g)},stop:function(a,b,c){var d=function(a){var b=a.stop;delete a.stop,b(c)};return"string"!=typeof a&&(c=b,b=a,a=void 0),b&&a!==!1&&this.queue(a||"fx",[]),this.each(function(){var b=!0,e=null!=a&&a+"queueHooks",f=r.timers,g=V.get(this);if(e)g[e]&&g[e].stop&&d(g[e]);else for(e in g)g[e]&&g[e].stop&&_a.test(e)&&d(g[e]);for(e=f.length;e--;)f[e].elem!==this||null!=a&&f[e].queue!==a||(f[e].anim.stop(c),b=!1,f.splice(e,1));!b&&c||r.dequeue(this,a)})},finish:function(a){return a!==!1&&(a=a||"fx"),this.each(function(){var b,c=V.get(this),d=c[a+"queue"],e=c[a+"queueHooks"],f=r.timers,g=d?d.length:0;for(c.finish=!0,r.queue(this,a,[]),e&&e.stop&&e.stop.call(this,!0),b=f.length;b--;)f[b].elem===this&&f[b].queue===a&&(f[b].anim.stop(!0),f.splice(b,1));for(b=0;b<g;b++)d[b]&&d[b].finish&&d[b].finish.call(this);delete c.finish})}}),r.each(["toggle","show","hide"],function(a,b){var c=r.fn[b];r.fn[b]=function(a,d,e){return null==a||"boolean"==typeof a?c.apply(this,arguments):this.animate(cb(b,!0),a,d,e)}}),r.each({slideDown:cb("show"),slideUp:cb("hide"),slideToggle:cb("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){r.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),r.timers=[],r.fx.tick=function(){var a,b=0,c=r.timers;for(Ya=r.now();b<c.length;b++)a=c[b],a()||c[b]!==a||c.splice(b--,1);c.length||r.fx.stop(),Ya=void 0},r.fx.timer=function(a){r.timers.push(a),a()?r.fx.start():r.timers.pop()},r.fx.interval=13,r.fx.start=function(){Za||(Za=a.requestAnimationFrame?a.requestAnimationFrame(ab):a.setInterval(r.fx.tick,r.fx.interval))},r.fx.stop=function(){a.cancelAnimationFrame?a.cancelAnimationFrame(Za):a.clearInterval(Za),Za=null},r.fx.speeds={slow:600,fast:200,_default:400},r.fn.delay=function(b,c){return b=r.fx?r.fx.speeds[b]||b:b,c=c||"fx",this.queue(c,function(c,d){var e=a.setTimeout(c,b);d.stop=function(){a.clearTimeout(e)}})},function(){var a=d.createElement("input"),b=d.createElement("select"),c=b.appendChild(d.createElement("option"));a.type="checkbox",o.checkOn=""!==a.value,o.optSelected=c.selected,a=d.createElement("input"),a.value="t",a.type="radio",o.radioValue="t"===a.value}();var hb,ib=r.expr.attrHandle;r.fn.extend({attr:function(a,b){return S(this,r.attr,a,b,arguments.length>1)},removeAttr:function(a){return this.each(function(){r.removeAttr(this,a)})}}),r.extend({attr:function(a,b,c){var d,e,f=a.nodeType;if(3!==f&&8!==f&&2!==f)return"undefined"==typeof a.getAttribute?r.prop(a,b,c):(1===f&&r.isXMLDoc(a)||(e=r.attrHooks[b.toLowerCase()]||(r.expr.match.bool.test(b)?hb:void 0)),void 0!==c?null===c?void r.removeAttr(a,b):e&&"set"in e&&void 0!==(d=e.set(a,c,b))?d:(a.setAttribute(b,c+""),c):e&&"get"in e&&null!==(d=e.get(a,b))?d:(d=r.find.attr(a,b),null==d?void 0:d))},attrHooks:{type:{set:function(a,b){if(!o.radioValue&&"radio"===b&&r.nodeName(a,"input")){var c=a.value;return a.setAttribute("type",b),c&&(a.value=c),b}}}},removeAttr:function(a,b){var c,d=0,e=b&&b.match(K);
if(e&&1===a.nodeType)while(c=e[d++])a.removeAttribute(c)}}),hb={set:function(a,b,c){return b===!1?r.removeAttr(a,c):a.setAttribute(c,c),c}},r.each(r.expr.match.bool.source.match(/\w+/g),function(a,b){var c=ib[b]||r.find.attr;ib[b]=function(a,b,d){var e,f,g=b.toLowerCase();return d||(f=ib[g],ib[g]=e,e=null!=c(a,b,d)?g:null,ib[g]=f),e}});var jb=/^(?:input|select|textarea|button)$/i,kb=/^(?:a|area)$/i;r.fn.extend({prop:function(a,b){return S(this,r.prop,a,b,arguments.length>1)},removeProp:function(a){return this.each(function(){delete this[r.propFix[a]||a]})}}),r.extend({prop:function(a,b,c){var d,e,f=a.nodeType;if(3!==f&&8!==f&&2!==f)return 1===f&&r.isXMLDoc(a)||(b=r.propFix[b]||b,e=r.propHooks[b]),void 0!==c?e&&"set"in e&&void 0!==(d=e.set(a,c,b))?d:a[b]=c:e&&"get"in e&&null!==(d=e.get(a,b))?d:a[b]},propHooks:{tabIndex:{get:function(a){var b=r.find.attr(a,"tabindex");return b?parseInt(b,10):jb.test(a.nodeName)||kb.test(a.nodeName)&&a.href?0:-1}}},propFix:{"for":"htmlFor","class":"className"}}),o.optSelected||(r.propHooks.selected={get:function(a){var b=a.parentNode;return b&&b.parentNode&&b.parentNode.selectedIndex,null},set:function(a){var b=a.parentNode;b&&(b.selectedIndex,b.parentNode&&b.parentNode.selectedIndex)}}),r.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){r.propFix[this.toLowerCase()]=this});var lb=/[\t\r\n\f]/g;function mb(a){return a.getAttribute&&a.getAttribute("class")||""}r.fn.extend({addClass:function(a){var b,c,d,e,f,g,h,i=0;if(r.isFunction(a))return this.each(function(b){r(this).addClass(a.call(this,b,mb(this)))});if("string"==typeof a&&a){b=a.match(K)||[];while(c=this[i++])if(e=mb(c),d=1===c.nodeType&&(" "+e+" ").replace(lb," ")){g=0;while(f=b[g++])d.indexOf(" "+f+" ")<0&&(d+=f+" ");h=r.trim(d),e!==h&&c.setAttribute("class",h)}}return this},removeClass:function(a){var b,c,d,e,f,g,h,i=0;if(r.isFunction(a))return this.each(function(b){r(this).removeClass(a.call(this,b,mb(this)))});if(!arguments.length)return this.attr("class","");if("string"==typeof a&&a){b=a.match(K)||[];while(c=this[i++])if(e=mb(c),d=1===c.nodeType&&(" "+e+" ").replace(lb," ")){g=0;while(f=b[g++])while(d.indexOf(" "+f+" ")>-1)d=d.replace(" "+f+" "," ");h=r.trim(d),e!==h&&c.setAttribute("class",h)}}return this},toggleClass:function(a,b){var c=typeof a;return"boolean"==typeof b&&"string"===c?b?this.addClass(a):this.removeClass(a):r.isFunction(a)?this.each(function(c){r(this).toggleClass(a.call(this,c,mb(this),b),b)}):this.each(function(){var b,d,e,f;if("string"===c){d=0,e=r(this),f=a.match(K)||[];while(b=f[d++])e.hasClass(b)?e.removeClass(b):e.addClass(b)}else void 0!==a&&"boolean"!==c||(b=mb(this),b&&V.set(this,"__className__",b),this.setAttribute&&this.setAttribute("class",b||a===!1?"":V.get(this,"__className__")||""))})},hasClass:function(a){var b,c,d=0;b=" "+a+" ";while(c=this[d++])if(1===c.nodeType&&(" "+mb(c)+" ").replace(lb," ").indexOf(b)>-1)return!0;return!1}});var nb=/\r/g,ob=/[\x20\t\r\n\f]+/g;r.fn.extend({val:function(a){var b,c,d,e=this[0];{if(arguments.length)return d=r.isFunction(a),this.each(function(c){var e;1===this.nodeType&&(e=d?a.call(this,c,r(this).val()):a,null==e?e="":"number"==typeof e?e+="":r.isArray(e)&&(e=r.map(e,function(a){return null==a?"":a+""})),b=r.valHooks[this.type]||r.valHooks[this.nodeName.toLowerCase()],b&&"set"in b&&void 0!==b.set(this,e,"value")||(this.value=e))});if(e)return b=r.valHooks[e.type]||r.valHooks[e.nodeName.toLowerCase()],b&&"get"in b&&void 0!==(c=b.get(e,"value"))?c:(c=e.value,"string"==typeof c?c.replace(nb,""):null==c?"":c)}}}),r.extend({valHooks:{option:{get:function(a){var b=r.find.attr(a,"value");return null!=b?b:r.trim(r.text(a)).replace(ob," ")}},select:{get:function(a){for(var b,c,d=a.options,e=a.selectedIndex,f="select-one"===a.type,g=f?null:[],h=f?e+1:d.length,i=e<0?h:f?e:0;i<h;i++)if(c=d[i],(c.selected||i===e)&&!c.disabled&&(!c.parentNode.disabled||!r.nodeName(c.parentNode,"optgroup"))){if(b=r(c).val(),f)return b;g.push(b)}return g},set:function(a,b){var c,d,e=a.options,f=r.makeArray(b),g=e.length;while(g--)d=e[g],(d.selected=r.inArray(r.valHooks.option.get(d),f)>-1)&&(c=!0);return c||(a.selectedIndex=-1),f}}}}),r.each(["radio","checkbox"],function(){r.valHooks[this]={set:function(a,b){if(r.isArray(b))return a.checked=r.inArray(r(a).val(),b)>-1}},o.checkOn||(r.valHooks[this].get=function(a){return null===a.getAttribute("value")?"on":a.value})});var pb=/^(?:focusinfocus|focusoutblur)$/;r.extend(r.event,{trigger:function(b,c,e,f){var g,h,i,j,k,m,n,o=[e||d],p=l.call(b,"type")?b.type:b,q=l.call(b,"namespace")?b.namespace.split("."):[];if(h=i=e=e||d,3!==e.nodeType&&8!==e.nodeType&&!pb.test(p+r.event.triggered)&&(p.indexOf(".")>-1&&(q=p.split("."),p=q.shift(),q.sort()),k=p.indexOf(":")<0&&"on"+p,b=b[r.expando]?b:new r.Event(p,"object"==typeof b&&b),b.isTrigger=f?2:3,b.namespace=q.join("."),b.rnamespace=b.namespace?new RegExp("(^|\\.)"+q.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,b.result=void 0,b.target||(b.target=e),c=null==c?[b]:r.makeArray(c,[b]),n=r.event.special[p]||{},f||!n.trigger||n.trigger.apply(e,c)!==!1)){if(!f&&!n.noBubble&&!r.isWindow(e)){for(j=n.delegateType||p,pb.test(j+p)||(h=h.parentNode);h;h=h.parentNode)o.push(h),i=h;i===(e.ownerDocument||d)&&o.push(i.defaultView||i.parentWindow||a)}g=0;while((h=o[g++])&&!b.isPropagationStopped())b.type=g>1?j:n.bindType||p,m=(V.get(h,"events")||{})[b.type]&&V.get(h,"handle"),m&&m.apply(h,c),m=k&&h[k],m&&m.apply&&T(h)&&(b.result=m.apply(h,c),b.result===!1&&b.preventDefault());return b.type=p,f||b.isDefaultPrevented()||n._default&&n._default.apply(o.pop(),c)!==!1||!T(e)||k&&r.isFunction(e[p])&&!r.isWindow(e)&&(i=e[k],i&&(e[k]=null),r.event.triggered=p,e[p](),r.event.triggered=void 0,i&&(e[k]=i)),b.result}},simulate:function(a,b,c){var d=r.extend(new r.Event,c,{type:a,isSimulated:!0});r.event.trigger(d,null,b)}}),r.fn.extend({trigger:function(a,b){return this.each(function(){r.event.trigger(a,b,this)})},triggerHandler:function(a,b){var c=this[0];if(c)return r.event.trigger(a,b,c,!0)}}),r.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "),function(a,b){r.fn[b]=function(a,c){return arguments.length>0?this.on(b,null,a,c):this.trigger(b)}}),r.fn.extend({hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)}}),o.focusin="onfocusin"in a,o.focusin||r.each({focus:"focusin",blur:"focusout"},function(a,b){var c=function(a){r.event.simulate(b,a.target,r.event.fix(a))};r.event.special[b]={setup:function(){var d=this.ownerDocument||this,e=V.access(d,b);e||d.addEventListener(a,c,!0),V.access(d,b,(e||0)+1)},teardown:function(){var d=this.ownerDocument||this,e=V.access(d,b)-1;e?V.access(d,b,e):(d.removeEventListener(a,c,!0),V.remove(d,b))}}});var qb=a.location,rb=r.now(),sb=/\?/;r.parseXML=function(b){var c;if(!b||"string"!=typeof b)return null;try{c=(new a.DOMParser).parseFromString(b,"text/xml")}catch(d){c=void 0}return c&&!c.getElementsByTagName("parsererror").length||r.error("Invalid XML: "+b),c};var tb=/\[\]$/,ub=/\r?\n/g,vb=/^(?:submit|button|image|reset|file)$/i,wb=/^(?:input|select|textarea|keygen)/i;function xb(a,b,c,d){var e;if(r.isArray(b))r.each(b,function(b,e){c||tb.test(a)?d(a,e):xb(a+"["+("object"==typeof e&&null!=e?b:"")+"]",e,c,d)});else if(c||"object"!==r.type(b))d(a,b);else for(e in b)xb(a+"["+e+"]",b[e],c,d)}r.param=function(a,b){var c,d=[],e=function(a,b){var c=r.isFunction(b)?b():b;d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(null==c?"":c)};if(r.isArray(a)||a.jquery&&!r.isPlainObject(a))r.each(a,function(){e(this.name,this.value)});else for(c in a)xb(c,a[c],b,e);return d.join("&")},r.fn.extend({serialize:function(){return r.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var a=r.prop(this,"elements");return a?r.makeArray(a):this}).filter(function(){var a=this.type;return this.name&&!r(this).is(":disabled")&&wb.test(this.nodeName)&&!vb.test(a)&&(this.checked||!ha.test(a))}).map(function(a,b){var c=r(this).val();return null==c?null:r.isArray(c)?r.map(c,function(a){return{name:b.name,value:a.replace(ub,"\r\n")}}):{name:b.name,value:c.replace(ub,"\r\n")}}).get()}});var yb=/%20/g,zb=/#.*$/,Ab=/([?&])_=[^&]*/,Bb=/^(.*?):[ \t]*([^\r\n]*)$/gm,Cb=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,Db=/^(?:GET|HEAD)$/,Eb=/^\/\//,Fb={},Gb={},Hb="*/".concat("*"),Ib=d.createElement("a");Ib.href=qb.href;function Jb(a){return function(b,c){"string"!=typeof b&&(c=b,b="*");var d,e=0,f=b.toLowerCase().match(K)||[];if(r.isFunction(c))while(d=f[e++])"+"===d[0]?(d=d.slice(1)||"*",(a[d]=a[d]||[]).unshift(c)):(a[d]=a[d]||[]).push(c)}}function Kb(a,b,c,d){var e={},f=a===Gb;function g(h){var i;return e[h]=!0,r.each(a[h]||[],function(a,h){var j=h(b,c,d);return"string"!=typeof j||f||e[j]?f?!(i=j):void 0:(b.dataTypes.unshift(j),g(j),!1)}),i}return g(b.dataTypes[0])||!e["*"]&&g("*")}function Lb(a,b){var c,d,e=r.ajaxSettings.flatOptions||{};for(c in b)void 0!==b[c]&&((e[c]?a:d||(d={}))[c]=b[c]);return d&&r.extend(!0,a,d),a}function Mb(a,b,c){var d,e,f,g,h=a.contents,i=a.dataTypes;while("*"===i[0])i.shift(),void 0===d&&(d=a.mimeType||b.getResponseHeader("Content-Type"));if(d)for(e in h)if(h[e]&&h[e].test(d)){i.unshift(e);break}if(i[0]in c)f=i[0];else{for(e in c){if(!i[0]||a.converters[e+" "+i[0]]){f=e;break}g||(g=e)}f=f||g}if(f)return f!==i[0]&&i.unshift(f),c[f]}function Nb(a,b,c,d){var e,f,g,h,i,j={},k=a.dataTypes.slice();if(k[1])for(g in a.converters)j[g.toLowerCase()]=a.converters[g];f=k.shift();while(f)if(a.responseFields[f]&&(c[a.responseFields[f]]=b),!i&&d&&a.dataFilter&&(b=a.dataFilter(b,a.dataType)),i=f,f=k.shift())if("*"===f)f=i;else if("*"!==i&&i!==f){if(g=j[i+" "+f]||j["* "+f],!g)for(e in j)if(h=e.split(" "),h[1]===f&&(g=j[i+" "+h[0]]||j["* "+h[0]])){g===!0?g=j[e]:j[e]!==!0&&(f=h[0],k.unshift(h[1]));break}if(g!==!0)if(g&&a["throws"])b=g(b);else try{b=g(b)}catch(l){return{state:"parsererror",error:g?l:"No conversion from "+i+" to "+f}}}return{state:"success",data:b}}r.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:qb.href,type:"GET",isLocal:Cb.test(qb.protocol),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":Hb,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/\bxml\b/,html:/\bhtml/,json:/\bjson\b/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":JSON.parse,"text xml":r.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(a,b){return b?Lb(Lb(a,r.ajaxSettings),b):Lb(r.ajaxSettings,a)},ajaxPrefilter:Jb(Fb),ajaxTransport:Jb(Gb),ajax:function(b,c){"object"==typeof b&&(c=b,b=void 0),c=c||{};var e,f,g,h,i,j,k,l,m,n,o=r.ajaxSetup({},c),p=o.context||o,q=o.context&&(p.nodeType||p.jquery)?r(p):r.event,s=r.Deferred(),t=r.Callbacks("once memory"),u=o.statusCode||{},v={},w={},x="canceled",y={readyState:0,getResponseHeader:function(a){var b;if(k){if(!h){h={};while(b=Bb.exec(g))h[b[1].toLowerCase()]=b[2]}b=h[a.toLowerCase()]}return null==b?null:b},getAllResponseHeaders:function(){return k?g:null},setRequestHeader:function(a,b){return null==k&&(a=w[a.toLowerCase()]=w[a.toLowerCase()]||a,v[a]=b),this},overrideMimeType:function(a){return null==k&&(o.mimeType=a),this},statusCode:function(a){var b;if(a)if(k)y.always(a[y.status]);else for(b in a)u[b]=[u[b],a[b]];return this},abort:function(a){var b=a||x;return e&&e.abort(b),A(0,b),this}};if(s.promise(y),o.url=((b||o.url||qb.href)+"").replace(Eb,qb.protocol+"//"),o.type=c.method||c.type||o.method||o.type,o.dataTypes=(o.dataType||"*").toLowerCase().match(K)||[""],null==o.crossDomain){j=d.createElement("a");try{j.href=o.url,j.href=j.href,o.crossDomain=Ib.protocol+"//"+Ib.host!=j.protocol+"//"+j.host}catch(z){o.crossDomain=!0}}if(o.data&&o.processData&&"string"!=typeof o.data&&(o.data=r.param(o.data,o.traditional)),Kb(Fb,o,c,y),k)return y;l=r.event&&o.global,l&&0===r.active++&&r.event.trigger("ajaxStart"),o.type=o.type.toUpperCase(),o.hasContent=!Db.test(o.type),f=o.url.replace(zb,""),o.hasContent?o.data&&o.processData&&0===(o.contentType||"").indexOf("application/x-www-form-urlencoded")&&(o.data=o.data.replace(yb,"+")):(n=o.url.slice(f.length),o.data&&(f+=(sb.test(f)?"&":"?")+o.data,delete o.data),o.cache===!1&&(f=f.replace(Ab,""),n=(sb.test(f)?"&":"?")+"_="+rb++ +n),o.url=f+n),o.ifModified&&(r.lastModified[f]&&y.setRequestHeader("If-Modified-Since",r.lastModified[f]),r.etag[f]&&y.setRequestHeader("If-None-Match",r.etag[f])),(o.data&&o.hasContent&&o.contentType!==!1||c.contentType)&&y.setRequestHeader("Content-Type",o.contentType),y.setRequestHeader("Accept",o.dataTypes[0]&&o.accepts[o.dataTypes[0]]?o.accepts[o.dataTypes[0]]+("*"!==o.dataTypes[0]?", "+Hb+"; q=0.01":""):o.accepts["*"]);for(m in o.headers)y.setRequestHeader(m,o.headers[m]);if(o.beforeSend&&(o.beforeSend.call(p,y,o)===!1||k))return y.abort();if(x="abort",t.add(o.complete),y.done(o.success),y.fail(o.error),e=Kb(Gb,o,c,y)){if(y.readyState=1,l&&q.trigger("ajaxSend",[y,o]),k)return y;o.async&&o.timeout>0&&(i=a.setTimeout(function(){y.abort("timeout")},o.timeout));try{k=!1,e.send(v,A)}catch(z){if(k)throw z;A(-1,z)}}else A(-1,"No Transport");function A(b,c,d,h){var j,m,n,v,w,x=c;k||(k=!0,i&&a.clearTimeout(i),e=void 0,g=h||"",y.readyState=b>0?4:0,j=b>=200&&b<300||304===b,d&&(v=Mb(o,y,d)),v=Nb(o,v,y,j),j?(o.ifModified&&(w=y.getResponseHeader("Last-Modified"),w&&(r.lastModified[f]=w),w=y.getResponseHeader("etag"),w&&(r.etag[f]=w)),204===b||"HEAD"===o.type?x="nocontent":304===b?x="notmodified":(x=v.state,m=v.data,n=v.error,j=!n)):(n=x,!b&&x||(x="error",b<0&&(b=0))),y.status=b,y.statusText=(c||x)+"",j?s.resolveWith(p,[m,x,y]):s.rejectWith(p,[y,x,n]),y.statusCode(u),u=void 0,l&&q.trigger(j?"ajaxSuccess":"ajaxError",[y,o,j?m:n]),t.fireWith(p,[y,x]),l&&(q.trigger("ajaxComplete",[y,o]),--r.active||r.event.trigger("ajaxStop")))}return y},getJSON:function(a,b,c){return r.get(a,b,c,"json")},getScript:function(a,b){return r.get(a,void 0,b,"script")}}),r.each(["get","post"],function(a,b){r[b]=function(a,c,d,e){return r.isFunction(c)&&(e=e||d,d=c,c=void 0),r.ajax(r.extend({url:a,type:b,dataType:e,data:c,success:d},r.isPlainObject(a)&&a))}}),r._evalUrl=function(a){return r.ajax({url:a,type:"GET",dataType:"script",cache:!0,async:!1,global:!1,"throws":!0})},r.fn.extend({wrapAll:function(a){var b;return this[0]&&(r.isFunction(a)&&(a=a.call(this[0])),b=r(a,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstElementChild)a=a.firstElementChild;return a}).append(this)),this},wrapInner:function(a){return r.isFunction(a)?this.each(function(b){r(this).wrapInner(a.call(this,b))}):this.each(function(){var b=r(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=r.isFunction(a);return this.each(function(c){r(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(a){return this.parent(a).not("body").each(function(){r(this).replaceWith(this.childNodes)}),this}}),r.expr.pseudos.hidden=function(a){return!r.expr.pseudos.visible(a)},r.expr.pseudos.visible=function(a){return!!(a.offsetWidth||a.offsetHeight||a.getClientRects().length)},r.ajaxSettings.xhr=function(){try{return new a.XMLHttpRequest}catch(b){}};var Ob={0:200,1223:204},Pb=r.ajaxSettings.xhr();o.cors=!!Pb&&"withCredentials"in Pb,o.ajax=Pb=!!Pb,r.ajaxTransport(function(b){var c,d;if(o.cors||Pb&&!b.crossDomain)return{send:function(e,f){var g,h=b.xhr();if(h.open(b.type,b.url,b.async,b.username,b.password),b.xhrFields)for(g in b.xhrFields)h[g]=b.xhrFields[g];b.mimeType&&h.overrideMimeType&&h.overrideMimeType(b.mimeType),b.crossDomain||e["X-Requested-With"]||(e["X-Requested-With"]="XMLHttpRequest");for(g in e)h.setRequestHeader(g,e[g]);c=function(a){return function(){c&&(c=d=h.onload=h.onerror=h.onabort=h.onreadystatechange=null,"abort"===a?h.abort():"error"===a?"number"!=typeof h.status?f(0,"error"):f(h.status,h.statusText):f(Ob[h.status]||h.status,h.statusText,"text"!==(h.responseType||"text")||"string"!=typeof h.responseText?{binary:h.response}:{text:h.responseText},h.getAllResponseHeaders()))}},h.onload=c(),d=h.onerror=c("error"),void 0!==h.onabort?h.onabort=d:h.onreadystatechange=function(){4===h.readyState&&a.setTimeout(function(){c&&d()})},c=c("abort");try{h.send(b.hasContent&&b.data||null)}catch(i){if(c)throw i}},abort:function(){c&&c()}}}),r.ajaxPrefilter(function(a){a.crossDomain&&(a.contents.script=!1)}),r.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/\b(?:java|ecma)script\b/},converters:{"text script":function(a){return r.globalEval(a),a}}}),r.ajaxPrefilter("script",function(a){void 0===a.cache&&(a.cache=!1),a.crossDomain&&(a.type="GET")}),r.ajaxTransport("script",function(a){if(a.crossDomain){var b,c;return{send:function(e,f){b=r("<script>").prop({charset:a.scriptCharset,src:a.url}).on("load error",c=function(a){b.remove(),c=null,a&&f("error"===a.type?404:200,a.type)}),d.head.appendChild(b[0])},abort:function(){c&&c()}}}});var Qb=[],Rb=/(=)\?(?=&|$)|\?\?/;r.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var a=Qb.pop()||r.expando+"_"+rb++;return this[a]=!0,a}}),r.ajaxPrefilter("json jsonp",function(b,c,d){var e,f,g,h=b.jsonp!==!1&&(Rb.test(b.url)?"url":"string"==typeof b.data&&0===(b.contentType||"").indexOf("application/x-www-form-urlencoded")&&Rb.test(b.data)&&"data");if(h||"jsonp"===b.dataTypes[0])return e=b.jsonpCallback=r.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,h?b[h]=b[h].replace(Rb,"$1"+e):b.jsonp!==!1&&(b.url+=(sb.test(b.url)?"&":"?")+b.jsonp+"="+e),b.converters["script json"]=function(){return g||r.error(e+" was not called"),g[0]},b.dataTypes[0]="json",f=a[e],a[e]=function(){g=arguments},d.always(function(){void 0===f?r(a).removeProp(e):a[e]=f,b[e]&&(b.jsonpCallback=c.jsonpCallback,Qb.push(e)),g&&r.isFunction(f)&&f(g[0]),g=f=void 0}),"script"}),o.createHTMLDocument=function(){var a=d.implementation.createHTMLDocument("").body;return a.innerHTML="<form></form><form></form>",2===a.childNodes.length}(),r.parseHTML=function(a,b,c){if("string"!=typeof a)return[];"boolean"==typeof b&&(c=b,b=!1);var e,f,g;return b||(o.createHTMLDocument?(b=d.implementation.createHTMLDocument(""),e=b.createElement("base"),e.href=d.location.href,b.head.appendChild(e)):b=d),f=B.exec(a),g=!c&&[],f?[b.createElement(f[1])]:(f=oa([a],b,g),g&&g.length&&r(g).remove(),r.merge([],f.childNodes))},r.fn.load=function(a,b,c){var d,e,f,g=this,h=a.indexOf(" ");return h>-1&&(d=r.trim(a.slice(h)),a=a.slice(0,h)),r.isFunction(b)?(c=b,b=void 0):b&&"object"==typeof b&&(e="POST"),g.length>0&&r.ajax({url:a,type:e||"GET",dataType:"html",data:b}).done(function(a){f=arguments,g.html(d?r("<div>").append(r.parseHTML(a)).find(d):a)}).always(c&&function(a,b){g.each(function(){c.apply(this,f||[a.responseText,b,a])})}),this},r.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(a,b){r.fn[b]=function(a){return this.on(b,a)}}),r.expr.pseudos.animated=function(a){return r.grep(r.timers,function(b){return a===b.elem}).length};function Sb(a){return r.isWindow(a)?a:9===a.nodeType&&a.defaultView}r.offset={setOffset:function(a,b,c){var d,e,f,g,h,i,j,k=r.css(a,"position"),l=r(a),m={};"static"===k&&(a.style.position="relative"),h=l.offset(),f=r.css(a,"top"),i=r.css(a,"left"),j=("absolute"===k||"fixed"===k)&&(f+i).indexOf("auto")>-1,j?(d=l.position(),g=d.top,e=d.left):(g=parseFloat(f)||0,e=parseFloat(i)||0),r.isFunction(b)&&(b=b.call(a,c,r.extend({},h))),null!=b.top&&(m.top=b.top-h.top+g),null!=b.left&&(m.left=b.left-h.left+e),"using"in b?b.using.call(a,m):l.css(m)}},r.fn.extend({offset:function(a){if(arguments.length)return void 0===a?this:this.each(function(b){r.offset.setOffset(this,a,b)});var b,c,d,e,f=this[0];if(f)return f.getClientRects().length?(d=f.getBoundingClientRect(),d.width||d.height?(e=f.ownerDocument,c=Sb(e),b=e.documentElement,{top:d.top+c.pageYOffset-b.clientTop,left:d.left+c.pageXOffset-b.clientLeft}):d):{top:0,left:0}},position:function(){if(this[0]){var a,b,c=this[0],d={top:0,left:0};return"fixed"===r.css(c,"position")?b=c.getBoundingClientRect():(a=this.offsetParent(),b=this.offset(),r.nodeName(a[0],"html")||(d=a.offset()),d={top:d.top+r.css(a[0],"borderTopWidth",!0),left:d.left+r.css(a[0],"borderLeftWidth",!0)}),{top:b.top-d.top-r.css(c,"marginTop",!0),left:b.left-d.left-r.css(c,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var a=this.offsetParent;while(a&&"static"===r.css(a,"position"))a=a.offsetParent;return a||pa})}}),r.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(a,b){var c="pageYOffset"===b;r.fn[a]=function(d){return S(this,function(a,d,e){var f=Sb(a);return void 0===e?f?f[b]:a[d]:void(f?f.scrollTo(c?f.pageXOffset:e,c?e:f.pageYOffset):a[d]=e)},a,d,arguments.length)}}),r.each(["top","left"],function(a,b){r.cssHooks[b]=Na(o.pixelPosition,function(a,c){if(c)return c=Ma(a,b),Ka.test(c)?r(a).position()[b]+"px":c})}),r.each({Height:"height",Width:"width"},function(a,b){r.each({padding:"inner"+a,content:b,"":"outer"+a},function(c,d){r.fn[d]=function(e,f){var g=arguments.length&&(c||"boolean"!=typeof e),h=c||(e===!0||f===!0?"margin":"border");return S(this,function(b,c,e){var f;return r.isWindow(b)?0===d.indexOf("outer")?b["inner"+a]:b.document.documentElement["client"+a]:9===b.nodeType?(f=b.documentElement,Math.max(b.body["scroll"+a],f["scroll"+a],b.body["offset"+a],f["offset"+a],f["client"+a])):void 0===e?r.css(b,c,h):r.style(b,c,e,h)},b,g?e:void 0,g)}})}),r.fn.extend({bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return 1===arguments.length?this.off(a,"**"):this.off(b,a||"**",c)}}),r.parseJSON=JSON.parse,"function"==typeof define&&define.amd&&define("jquery",[],function(){return r});var Tb=a.jQuery,Ub=a.$;return r.noConflict=function(b){return a.$===r&&(a.$=Ub),b&&a.jQuery===r&&(a.jQuery=Tb),r},b||(a.jQuery=a.$=r),r});

/*global window */
/**
 * @license countdown.js v2.6.0 http://countdownjs.org
 * Copyright (c)2006-2014 Stephen M. McKamey.
 * Licensed under The MIT License.
 */
/*jshint bitwise:false */

/**
 * @public
 * @type {Object|null}
 */
var module;

/**
 * API entry
 * @public
 * @param {function(Object)|Date|number} start the starting date
 * @param {function(Object)|Date|number} end the ending date
 * @param {number} units the units to populate
 * @return {Object|number}
 */
var countdown = (

/**
 * @param {Object} module CommonJS Module
 */
function(module) {
	/*jshint smarttabs:true */

	'use strict';

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var MILLISECONDS	= 0x001;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var SECONDS			= 0x002;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var MINUTES			= 0x004;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var HOURS			= 0x008;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var DAYS			= 0x010;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var WEEKS			= 0x020;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var MONTHS			= 0x040;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var YEARS			= 0x080;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var DECADES			= 0x100;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var CENTURIES		= 0x200;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var MILLENNIA		= 0x400;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var DEFAULTS		= YEARS|MONTHS|DAYS|HOURS|MINUTES|SECONDS;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var MILLISECONDS_PER_SECOND = 1000;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var SECONDS_PER_MINUTE = 60;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var MINUTES_PER_HOUR = 60;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var HOURS_PER_DAY = 24;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var MILLISECONDS_PER_DAY = HOURS_PER_DAY * MINUTES_PER_HOUR * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var DAYS_PER_WEEK = 7;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var MONTHS_PER_YEAR = 12;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var YEARS_PER_DECADE = 10;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var DECADES_PER_CENTURY = 10;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var CENTURIES_PER_MILLENNIUM = 10;

	/**
	 * @private
	 * @param {number} x number
	 * @return {number}
	 */
	var ceil = Math.ceil;

	/**
	 * @private
	 * @param {number} x number
	 * @return {number}
	 */
	var floor = Math.floor;

	/**
	 * @private
	 * @param {Date} ref reference date
	 * @param {number} shift number of months to shift
	 * @return {number} number of days shifted
	 */
	function borrowMonths(ref, shift) {
		var prevTime = ref.getTime();

		// increment month by shift
		ref.setMonth( ref.getMonth() + shift );

		// this is the trickiest since months vary in length
		return Math.round( (ref.getTime() - prevTime) / MILLISECONDS_PER_DAY );
	}

	/**
	 * @private
	 * @param {Date} ref reference date
	 * @return {number} number of days
	 */
	function daysPerMonth(ref) {
		var a = ref.getTime();

		// increment month by 1
		var b = new Date(a);
		b.setMonth( ref.getMonth() + 1 );

		// this is the trickiest since months vary in length
		return Math.round( (b.getTime() - a) / MILLISECONDS_PER_DAY );
	}

	/**
	 * @private
	 * @param {Date} ref reference date
	 * @return {number} number of days
	 */
	function daysPerYear(ref) {
		var a = ref.getTime();

		// increment year by 1
		var b = new Date(a);
		b.setFullYear( ref.getFullYear() + 1 );

		// this is the trickiest since years (periodically) vary in length
		return Math.round( (b.getTime() - a) / MILLISECONDS_PER_DAY );
	}

	/**
	 * Applies the Timespan to the given date.
	 * 
	 * @private
	 * @param {Timespan} ts
	 * @param {Date=} date
	 * @return {Date}
	 */
	function addToDate(ts, date) {
		date = (date instanceof Date) || ((date !== null) && isFinite(date)) ? new Date(+date) : new Date();
		if (!ts) {
			return date;
		}

		// if there is a value field, use it directly
		var value = +ts.value || 0;
		if (value) {
			date.setTime(date.getTime() + value);
			return date;
		}

		value = +ts.milliseconds || 0;
		if (value) {
			date.setMilliseconds(date.getMilliseconds() + value);
		}

		value = +ts.seconds || 0;
		if (value) {
			date.setSeconds(date.getSeconds() + value);
		}

		value = +ts.minutes || 0;
		if (value) {
			date.setMinutes(date.getMinutes() + value);
		}

		value = +ts.hours || 0;
		if (value) {
			date.setHours(date.getHours() + value);
		}

		value = +ts.weeks || 0;
		if (value) {
			value *= DAYS_PER_WEEK;
		}

		value += +ts.days || 0;
		if (value) {
			date.setDate(date.getDate() + value);
		}

		value = +ts.months || 0;
		if (value) {
			date.setMonth(date.getMonth() + value);
		}

		value = +ts.millennia || 0;
		if (value) {
			value *= CENTURIES_PER_MILLENNIUM;
		}

		value += +ts.centuries || 0;
		if (value) {
			value *= DECADES_PER_CENTURY;
		}

		value += +ts.decades || 0;
		if (value) {
			value *= YEARS_PER_DECADE;
		}

		value += +ts.years || 0;
		if (value) {
			date.setFullYear(date.getFullYear() + value);
		}

		return date;
	}

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var LABEL_MILLISECONDS	= 0;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var LABEL_SECONDS		= 1;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var LABEL_MINUTES		= 2;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var LABEL_HOURS			= 3;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var LABEL_DAYS			= 4;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var LABEL_WEEKS			= 5;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var LABEL_MONTHS		= 6;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var LABEL_YEARS			= 7;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var LABEL_DECADES		= 8;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var LABEL_CENTURIES		= 9;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var LABEL_MILLENNIA		= 10;

	/**
	 * @private
	 * @type {Array}
	 */
	var LABELS_SINGLUAR;

	/**
	 * @private
	 * @type {Array}
	 */
	var LABELS_PLURAL;

	/**
	 * @private
	 * @type {string}
	 */
	var LABEL_LAST;

	/**
	 * @private
	 * @type {string}
	 */
	var LABEL_DELIM;

	/**
	 * @private
	 * @type {string}
	 */
	var LABEL_NOW;

	/**
	 * Formats a number & unit as a string
	 * 
	 * @param {number} value
	 * @param {number} unit
	 * @return {string}
	 */
	var formatter;

	/**
	 * Formats a number as a string
	 * 
	 * @private
	 * @param {number} value
	 * @return {string}
	 */
	var formatNumber;

	/**
	 * @private
	 * @param {number} value
	 * @param {number} unit unit index into label list
	 * @return {string}
	 */
	function plurality(value, unit) {
		return formatNumber(value)+((value === 1) ? LABELS_SINGLUAR[unit] : LABELS_PLURAL[unit]);
	}

	/**
	 * Formats the entries with singular or plural labels
	 * 
	 * @private
	 * @param {Timespan} ts
	 * @return {Array}
	 */
	var formatList;

	/**
	 * Timespan representation of a duration of time
	 * 
	 * @private
	 * @this {Timespan}
	 * @constructor
	 */
	function Timespan() {}

	/**
	 * Formats the Timespan as a sentence
	 * 
	 * @param {string=} emptyLabel the string to use when no values returned
	 * @return {string}
	 */
	Timespan.prototype.toString = function(emptyLabel) {
		var label = formatList(this);

		var count = label.length;
		if (!count) {
			return emptyLabel ? ''+emptyLabel : LABEL_NOW;
		}
		if (count === 1) {
			return label[0];
		}

		var last = LABEL_LAST+label.pop();
		return label.join(LABEL_DELIM)+last;
	};

	/**
	 * Formats the Timespan as a sentence in HTML
	 * 
	 * @param {string=} tag HTML tag name to wrap each value
	 * @param {string=} emptyLabel the string to use when no values returned
	 * @return {string}
	 */
	Timespan.prototype.toHTML = function(tag, emptyLabel) {
		tag = tag || 'span';
		var label = formatList(this);

		var count = label.length;
		if (!count) {
			emptyLabel = emptyLabel || LABEL_NOW;
			return emptyLabel ? '<'+tag+'>'+emptyLabel+'</'+tag+'>' : emptyLabel;
		}
		for (var i=0; i<count; i++) {
			// wrap each unit in tag
			label[i] = '<'+tag+'>'+label[i]+'</'+tag+'>';
		}
		if (count === 1) {
			return label[0];
		}

		var last = LABEL_LAST+label.pop();
		return label.join(LABEL_DELIM)+last;
	};

	/**
	 * Applies the Timespan to the given date
	 * 
	 * @param {Date=} date the date to which the timespan is added.
	 * @return {Date}
	 */
	Timespan.prototype.addTo = function(date) {
		return addToDate(this, date);
	};

	/**
	 * Formats the entries as English labels
	 * 
	 * @private
	 * @param {Timespan} ts
	 * @return {Array}
	 */
	formatList = function(ts) {
		var list = [];

		var value = ts.millennia;
		if (value) {
			list.push(formatter(value, LABEL_MILLENNIA));
		}

		value = ts.centuries;
		if (value) {
			list.push(formatter(value, LABEL_CENTURIES));
		}

		value = ts.decades;
		if (value) {
			list.push(formatter(value, LABEL_DECADES));
		}

		value = ts.years;
		if (value) {
			list.push(formatter(value, LABEL_YEARS));
		}

		value = ts.months;
		if (value) {
			list.push(formatter(value, LABEL_MONTHS));
		}

		value = ts.weeks;
		if (value) {
			list.push(formatter(value, LABEL_WEEKS));
		}

		value = ts.days;
		if (value) {
			list.push(formatter(value, LABEL_DAYS));
		}

		value = ts.hours;
		if (value) {
			list.push(formatter(value, LABEL_HOURS));
		}

		value = ts.minutes;
		if (value) {
			list.push(formatter(value, LABEL_MINUTES));
		}

		value = ts.seconds;
		if (value) {
			list.push(formatter(value, LABEL_SECONDS));
		}

		value = ts.milliseconds;
		if (value) {
			list.push(formatter(value, LABEL_MILLISECONDS));
		}

		return list;
	};

	/**
	 * Borrow any underflow units, carry any overflow units
	 * 
	 * @private
	 * @param {Timespan} ts
	 * @param {string} toUnit
	 */
	function rippleRounded(ts, toUnit) {
		switch (toUnit) {
			case 'seconds':
				if (ts.seconds !== SECONDS_PER_MINUTE || isNaN(ts.minutes)) {
					return;
				}
				// ripple seconds up to minutes
				ts.minutes++;
				ts.seconds = 0;

				/* falls through */
			case 'minutes':
				if (ts.minutes !== MINUTES_PER_HOUR || isNaN(ts.hours)) {
					return;
				}
				// ripple minutes up to hours
				ts.hours++;
				ts.minutes = 0;

				/* falls through */
			case 'hours':
				if (ts.hours !== HOURS_PER_DAY || isNaN(ts.days)) {
					return;
				}
				// ripple hours up to days
				ts.days++;
				ts.hours = 0;

				/* falls through */
			case 'days':
				if (ts.days !== DAYS_PER_WEEK || isNaN(ts.weeks)) {
					return;
				}
				// ripple days up to weeks
				ts.weeks++;
				ts.days = 0;

				/* falls through */
			case 'weeks':
				if (ts.weeks !== daysPerMonth(ts.refMonth)/DAYS_PER_WEEK || isNaN(ts.months)) {
					return;
				}
				// ripple weeks up to months
				ts.months++;
				ts.weeks = 0;

				/* falls through */
			case 'months':
				if (ts.months !== MONTHS_PER_YEAR || isNaN(ts.years)) {
					return;
				}
				// ripple months up to years
				ts.years++;
				ts.months = 0;

				/* falls through */
			case 'years':
				if (ts.years !== YEARS_PER_DECADE || isNaN(ts.decades)) {
					return;
				}
				// ripple years up to decades
				ts.decades++;
				ts.years = 0;

				/* falls through */
			case 'decades':
				if (ts.decades !== DECADES_PER_CENTURY || isNaN(ts.centuries)) {
					return;
				}
				// ripple decades up to centuries
				ts.centuries++;
				ts.decades = 0;

				/* falls through */
			case 'centuries':
				if (ts.centuries !== CENTURIES_PER_MILLENNIUM || isNaN(ts.millennia)) {
					return;
				}
				// ripple centuries up to millennia
				ts.millennia++;
				ts.centuries = 0;
				/* falls through */
			}
	}

	/**
	 * Ripple up partial units one place
	 * 
	 * @private
	 * @param {Timespan} ts timespan
	 * @param {number} frac accumulated fractional value
	 * @param {string} fromUnit source unit name
	 * @param {string} toUnit target unit name
	 * @param {number} conversion multiplier between units
	 * @param {number} digits max number of decimal digits to output
	 * @return {number} new fractional value
	 */
	function fraction(ts, frac, fromUnit, toUnit, conversion, digits) {
		if (ts[fromUnit] >= 0) {
			frac += ts[fromUnit];
			delete ts[fromUnit];
		}

		frac /= conversion;
		if (frac + 1 <= 1) {
			// drop if below machine epsilon
			return 0;
		}

		if (ts[toUnit] >= 0) {
			// ensure does not have more than specified number of digits
			ts[toUnit] = +(ts[toUnit] + frac).toFixed(digits);
			rippleRounded(ts, toUnit);
			return 0;
		}

		return frac;
	}

	/**
	 * Ripple up partial units to next existing
	 * 
	 * @private
	 * @param {Timespan} ts
	 * @param {number} digits max number of decimal digits to output
	 */
	function fractional(ts, digits) {
		var frac = fraction(ts, 0, 'milliseconds', 'seconds', MILLISECONDS_PER_SECOND, digits);
		if (!frac) { return; }

		frac = fraction(ts, frac, 'seconds', 'minutes', SECONDS_PER_MINUTE, digits);
		if (!frac) { return; }

		frac = fraction(ts, frac, 'minutes', 'hours', MINUTES_PER_HOUR, digits);
		if (!frac) { return; }

		frac = fraction(ts, frac, 'hours', 'days', HOURS_PER_DAY, digits);
		if (!frac) { return; }

		frac = fraction(ts, frac, 'days', 'weeks', DAYS_PER_WEEK, digits);
		if (!frac) { return; }

		frac = fraction(ts, frac, 'weeks', 'months', daysPerMonth(ts.refMonth)/DAYS_PER_WEEK, digits);
		if (!frac) { return; }

		frac = fraction(ts, frac, 'months', 'years', daysPerYear(ts.refMonth)/daysPerMonth(ts.refMonth), digits);
		if (!frac) { return; }

		frac = fraction(ts, frac, 'years', 'decades', YEARS_PER_DECADE, digits);
		if (!frac) { return; }

		frac = fraction(ts, frac, 'decades', 'centuries', DECADES_PER_CENTURY, digits);
		if (!frac) { return; }

		frac = fraction(ts, frac, 'centuries', 'millennia', CENTURIES_PER_MILLENNIUM, digits);

		// should never reach this with remaining fractional value
		if (frac) { throw new Error('Fractional unit overflow'); }
	}

	/**
	 * Borrow any underflow units, carry any overflow units
	 * 
	 * @private
	 * @param {Timespan} ts
	 */
	function ripple(ts) {
		var x;

		if (ts.milliseconds < 0) {
			// ripple seconds down to milliseconds
			x = ceil(-ts.milliseconds / MILLISECONDS_PER_SECOND);
			ts.seconds -= x;
			ts.milliseconds += x * MILLISECONDS_PER_SECOND;

		} else if (ts.milliseconds >= MILLISECONDS_PER_SECOND) {
			// ripple milliseconds up to seconds
			ts.seconds += floor(ts.milliseconds / MILLISECONDS_PER_SECOND);
			ts.milliseconds %= MILLISECONDS_PER_SECOND;
		}

		if (ts.seconds < 0) {
			// ripple minutes down to seconds
			x = ceil(-ts.seconds / SECONDS_PER_MINUTE);
			ts.minutes -= x;
			ts.seconds += x * SECONDS_PER_MINUTE;

		} else if (ts.seconds >= SECONDS_PER_MINUTE) {
			// ripple seconds up to minutes
			ts.minutes += floor(ts.seconds / SECONDS_PER_MINUTE);
			ts.seconds %= SECONDS_PER_MINUTE;
		}

		if (ts.minutes < 0) {
			// ripple hours down to minutes
			x = ceil(-ts.minutes / MINUTES_PER_HOUR);
			ts.hours -= x;
			ts.minutes += x * MINUTES_PER_HOUR;

		} else if (ts.minutes >= MINUTES_PER_HOUR) {
			// ripple minutes up to hours
			ts.hours += floor(ts.minutes / MINUTES_PER_HOUR);
			ts.minutes %= MINUTES_PER_HOUR;
		}

		if (ts.hours < 0) {
			// ripple days down to hours
			x = ceil(-ts.hours / HOURS_PER_DAY);
			ts.days -= x;
			ts.hours += x * HOURS_PER_DAY;

		} else if (ts.hours >= HOURS_PER_DAY) {
			// ripple hours up to days
			ts.days += floor(ts.hours / HOURS_PER_DAY);
			ts.hours %= HOURS_PER_DAY;
		}

		while (ts.days < 0) {
			// NOTE: never actually seen this loop more than once

			// ripple months down to days
			ts.months--;
			ts.days += borrowMonths(ts.refMonth, 1);
		}

		// weeks is always zero here

		if (ts.days >= DAYS_PER_WEEK) {
			// ripple days up to weeks
			ts.weeks += floor(ts.days / DAYS_PER_WEEK);
			ts.days %= DAYS_PER_WEEK;
		}

		if (ts.months < 0) {
			// ripple years down to months
			x = ceil(-ts.months / MONTHS_PER_YEAR);
			ts.years -= x;
			ts.months += x * MONTHS_PER_YEAR;

		} else if (ts.months >= MONTHS_PER_YEAR) {
			// ripple months up to years
			ts.years += floor(ts.months / MONTHS_PER_YEAR);
			ts.months %= MONTHS_PER_YEAR;
		}

		// years is always non-negative here
		// decades, centuries and millennia are always zero here

		if (ts.years >= YEARS_PER_DECADE) {
			// ripple years up to decades
			ts.decades += floor(ts.years / YEARS_PER_DECADE);
			ts.years %= YEARS_PER_DECADE;

			if (ts.decades >= DECADES_PER_CENTURY) {
				// ripple decades up to centuries
				ts.centuries += floor(ts.decades / DECADES_PER_CENTURY);
				ts.decades %= DECADES_PER_CENTURY;

				if (ts.centuries >= CENTURIES_PER_MILLENNIUM) {
					// ripple centuries up to millennia
					ts.millennia += floor(ts.centuries / CENTURIES_PER_MILLENNIUM);
					ts.centuries %= CENTURIES_PER_MILLENNIUM;
				}
			}
		}
	}

	/**
	 * Remove any units not requested
	 * 
	 * @private
	 * @param {Timespan} ts
	 * @param {number} units the units to populate
	 * @param {number} max number of labels to output
	 * @param {number} digits max number of decimal digits to output
	 */
	function pruneUnits(ts, units, max, digits) {
		var count = 0;

		// Calc from largest unit to smallest to prevent underflow
		if (!(units & MILLENNIA) || (count >= max)) {
			// ripple millennia down to centuries
			ts.centuries += ts.millennia * CENTURIES_PER_MILLENNIUM;
			delete ts.millennia;

		} else if (ts.millennia) {
			count++;
		}

		if (!(units & CENTURIES) || (count >= max)) {
			// ripple centuries down to decades
			ts.decades += ts.centuries * DECADES_PER_CENTURY;
			delete ts.centuries;

		} else if (ts.centuries) {
			count++;
		}

		if (!(units & DECADES) || (count >= max)) {
			// ripple decades down to years
			ts.years += ts.decades * YEARS_PER_DECADE;
			delete ts.decades;

		} else if (ts.decades) {
			count++;
		}

		if (!(units & YEARS) || (count >= max)) {
			// ripple years down to months
			ts.months += ts.years * MONTHS_PER_YEAR;
			delete ts.years;

		} else if (ts.years) {
			count++;
		}

		if (!(units & MONTHS) || (count >= max)) {
			// ripple months down to days
			if (ts.months) {
				ts.days += borrowMonths(ts.refMonth, ts.months);
			}
			delete ts.months;

			if (ts.days >= DAYS_PER_WEEK) {
				// ripple day overflow back up to weeks
				ts.weeks += floor(ts.days / DAYS_PER_WEEK);
				ts.days %= DAYS_PER_WEEK;
			}

		} else if (ts.months) {
			count++;
		}

		if (!(units & WEEKS) || (count >= max)) {
			// ripple weeks down to days
			ts.days += ts.weeks * DAYS_PER_WEEK;
			delete ts.weeks;

		} else if (ts.weeks) {
			count++;
		}

		if (!(units & DAYS) || (count >= max)) {
			//ripple days down to hours
			ts.hours += ts.days * HOURS_PER_DAY;
			delete ts.days;

		} else if (ts.days) {
			count++;
		}

		if (!(units & HOURS) || (count >= max)) {
			// ripple hours down to minutes
			ts.minutes += ts.hours * MINUTES_PER_HOUR;
			delete ts.hours;

		} else if (ts.hours) {
			count++;
		}

		if (!(units & MINUTES) || (count >= max)) {
			// ripple minutes down to seconds
			ts.seconds += ts.minutes * SECONDS_PER_MINUTE;
			delete ts.minutes;

		} else if (ts.minutes) {
			count++;
		}

		if (!(units & SECONDS) || (count >= max)) {
			// ripple seconds down to milliseconds
			ts.milliseconds += ts.seconds * MILLISECONDS_PER_SECOND;
			delete ts.seconds;

		} else if (ts.seconds) {
			count++;
		}

		// nothing to ripple milliseconds down to
		// so ripple back up to smallest existing unit as a fractional value
		if (!(units & MILLISECONDS) || (count >= max)) {
			fractional(ts, digits);
		}
	}

	/**
	 * Populates the Timespan object
	 * 
	 * @private
	 * @param {Timespan} ts
	 * @param {?Date} start the starting date
	 * @param {?Date} end the ending date
	 * @param {number} units the units to populate
	 * @param {number} max number of labels to output
	 * @param {number} digits max number of decimal digits to output
	 */
	function populate(ts, start, end, units, max, digits) {
		var now = new Date();

		ts.start = start = start || now;
		ts.end = end = end || now;
		ts.units = units;

		ts.value = end.getTime() - start.getTime();
		if (ts.value < 0) {
			// swap if reversed
			var tmp = end;
			end = start;
			start = tmp;
		}

		// reference month for determining days in month
		ts.refMonth = new Date(start.getFullYear(), start.getMonth(), 15, 12, 0, 0);
		try {
			// reset to initial deltas
			ts.millennia = 0;
			ts.centuries = 0;
			ts.decades = 0;
			ts.years = end.getFullYear() - start.getFullYear();
			ts.months = end.getMonth() - start.getMonth();
			ts.weeks = 0;
			ts.days = end.getDate() - start.getDate();
			ts.hours = end.getHours() - start.getHours();
			ts.minutes = end.getMinutes() - start.getMinutes();
			ts.seconds = end.getSeconds() - start.getSeconds();
			ts.milliseconds = end.getMilliseconds() - start.getMilliseconds();

			ripple(ts);
			pruneUnits(ts, units, max, digits);

		} finally {
			delete ts.refMonth;
		}

		return ts;
	}

	/**
	 * Determine an appropriate refresh rate based upon units
	 * 
	 * @private
	 * @param {number} units the units to populate
	 * @return {number} milliseconds to delay
	 */
	function getDelay(units) {
		if (units & MILLISECONDS) {
			// refresh very quickly
			return MILLISECONDS_PER_SECOND / 30; //30Hz
		}

		if (units & SECONDS) {
			// refresh every second
			return MILLISECONDS_PER_SECOND; //1Hz
		}

		if (units & MINUTES) {
			// refresh every minute
			return MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE;
		}

		if (units & HOURS) {
			// refresh hourly
			return MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR;
		}
		
		if (units & DAYS) {
			// refresh daily
			return MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY;
		}

		// refresh the rest weekly
		return MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY * DAYS_PER_WEEK;
	}

	/**
	 * API entry point
	 * 
	 * @public
	 * @param {Date|number|Timespan|null|function(Timespan,number)} start the starting date
	 * @param {Date|number|Timespan|null|function(Timespan,number)} end the ending date
	 * @param {number=} units the units to populate
	 * @param {number=} max number of labels to output
	 * @param {number=} digits max number of decimal digits to output
	 * @return {Timespan|number}
	 */
	function countdown(start, end, units, max, digits) {
		var callback;

		// ensure some units or use defaults
		units = +units || DEFAULTS;
		// max must be positive
		max = (max > 0) ? max : NaN;
		// clamp digits to an integer between [0, 20]
		digits = (digits > 0) ? (digits < 20) ? Math.round(digits) : 20 : 0;

		// ensure start date
		var startTS = null;
		if ('function' === typeof start) {
			callback = start;
			start = null;

		} else if (!(start instanceof Date)) {
			if ((start !== null) && isFinite(start)) {
				start = new Date(+start);
			} else {
				if ('object' === typeof startTS) {
					startTS = /** @type{Timespan} */(start);
				}
				start = null;
			}
		}

		// ensure end date
		var endTS = null;
		if ('function' === typeof end) {
			callback = end;
			end = null;

		} else if (!(end instanceof Date)) {
			if ((end !== null) && isFinite(end)) {
				end = new Date(+end);
			} else {
				if ('object' === typeof end) {
					endTS = /** @type{Timespan} */(end);
				}
				end = null;
			}
		}

		// must wait to interpret timespans until after resolving dates
		if (startTS) {
			start = addToDate(startTS, end);
		}
		if (endTS) {
			end = addToDate(endTS, start);
		}

		if (!start && !end) {
			// used for unit testing
			return new Timespan();
		}

		if (!callback) {
			return populate(new Timespan(), /** @type{Date} */(start), /** @type{Date} */(end), /** @type{number} */(units), /** @type{number} */(max), /** @type{number} */(digits));
		}

		// base delay off units
		var delay = getDelay(units),
			timerId,
			fn = function() {
				callback(
					populate(new Timespan(), /** @type{Date} */(start), /** @type{Date} */(end), /** @type{number} */(units), /** @type{number} */(max), /** @type{number} */(digits)),
					timerId
				);
			};

		fn();
		return (timerId = setInterval(fn, delay));
	}

	/**
	 * @public
	 * @const
	 * @type {number}
	 */
	countdown.MILLISECONDS = MILLISECONDS;

	/**
	 * @public
	 * @const
	 * @type {number}
	 */
	countdown.SECONDS = SECONDS;

	/**
	 * @public
	 * @const
	 * @type {number}
	 */
	countdown.MINUTES = MINUTES;

	/**
	 * @public
	 * @const
	 * @type {number}
	 */
	countdown.HOURS = HOURS;

	/**
	 * @public
	 * @const
	 * @type {number}
	 */
	countdown.DAYS = DAYS;

	/**
	 * @public
	 * @const
	 * @type {number}
	 */
	countdown.WEEKS = WEEKS;

	/**
	 * @public
	 * @const
	 * @type {number}
	 */
	countdown.MONTHS = MONTHS;

	/**
	 * @public
	 * @const
	 * @type {number}
	 */
	countdown.YEARS = YEARS;

	/**
	 * @public
	 * @const
	 * @type {number}
	 */
	countdown.DECADES = DECADES;

	/**
	 * @public
	 * @const
	 * @type {number}
	 */
	countdown.CENTURIES = CENTURIES;

	/**
	 * @public
	 * @const
	 * @type {number}
	 */
	countdown.MILLENNIA = MILLENNIA;

	/**
	 * @public
	 * @const
	 * @type {number}
	 */
	countdown.DEFAULTS = DEFAULTS;

	/**
	 * @public
	 * @const
	 * @type {number}
	 */
	countdown.ALL = MILLENNIA|CENTURIES|DECADES|YEARS|MONTHS|WEEKS|DAYS|HOURS|MINUTES|SECONDS|MILLISECONDS;

	/**
	 * Customize the format settings.
	 * @public
	 * @param {Object} format settings object
	 */
	var setFormat = countdown.setFormat = function(format) {
		if (!format) { return; }

		if ('singular' in format || 'plural' in format) {
			var singular = format.singular || [];
			if (singular.split) {
				singular = singular.split('|');
			}
			var plural = format.plural || [];
			if (plural.split) {
				plural = plural.split('|');
			}

			for (var i=LABEL_MILLISECONDS; i<=LABEL_MILLENNIA; i++) {
				// override any specified units
				LABELS_SINGLUAR[i] = singular[i] || LABELS_SINGLUAR[i];
				LABELS_PLURAL[i] = plural[i] || LABELS_PLURAL[i];
			}
		}

		if ('string' === typeof format.last) {
			LABEL_LAST = format.last;
		}
		if ('string' === typeof format.delim) {
			LABEL_DELIM = format.delim;
		}
		if ('string' === typeof format.empty) {
			LABEL_NOW = format.empty;
		}
		if ('function' === typeof format.formatNumber) {
			formatNumber = format.formatNumber;
		}
		if ('function' === typeof format.formatter) {
			formatter = format.formatter;
		}
	};

	/**
	 * Revert to the default formatting.
	 * @public
	 */
	var resetFormat = countdown.resetFormat = function() {
		LABELS_SINGLUAR = ' millisecond| second| minute| hour| day| week| month| year| decade| century| millennium'.split('|');
		LABELS_PLURAL = ' milliseconds| seconds| minutes| hours| days| weeks| months| years| decades| centuries| millennia'.split('|');
		LABEL_LAST = ' and ';
		LABEL_DELIM = ', ';
		LABEL_NOW = '';
		formatNumber = function(value) { return value; };
		formatter = plurality;
	};

	/**
	 * Override the unit labels.
	 * @public
	 * @param {string|Array=} singular a pipe ('|') delimited list of singular unit name overrides
	 * @param {string|Array=} plural a pipe ('|') delimited list of plural unit name overrides
	 * @param {string=} last a delimiter before the last unit (default: ' and ')
	 * @param {string=} delim a delimiter to use between all other units (default: ', ')
	 * @param {string=} empty a label to use when all units are zero (default: '')
	 * @param {function(number):string=} formatNumber a function which formats numbers as a string
	 * @param {function(number,number):string=} formatter a function which formats a number/unit pair as a string
	 * @deprecated since version 2.6.0
	 */
	countdown.setLabels = function(singular, plural, last, delim, empty, formatNumber, formatter) {
		setFormat({
			singular: singular,
			plural: plural,
			last: last,
			delim: delim,
			empty: empty,
			formatNumber: formatNumber,
			formatter: formatter
		});
	};

	/**
	 * Revert to the default unit labels.
	 * @public
	 * @deprecated since version 2.6.0
	 */
	countdown.resetLabels = resetFormat;

	resetFormat();

	if (module && module.exports) {
		module.exports = countdown;

	} else if (typeof window.define === 'function' && typeof window.define.amd !== 'undefined') {
		window.define('countdown', [], function() {
			return countdown;
		});
	}

	return countdown;

})(module);

//! moment.js
//! version : 2.14.1
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com
!function(a,b){"object"==typeof exports&&"undefined"!=typeof module?module.exports=b():"function"==typeof define&&define.amd?define(b):a.moment=b()}(this,function(){"use strict";function a(){return je.apply(null,arguments)}
// This is done to register the method called with moment()
// without creating circular dependencies.
function b(a){je=a}function c(a){return a instanceof Array||"[object Array]"===Object.prototype.toString.call(a)}function d(a){return"[object Object]"===Object.prototype.toString.call(a)}function e(a){var b;for(b in a)
// even if its not own property I'd still call it non-empty
return!1;return!0}function f(a){return a instanceof Date||"[object Date]"===Object.prototype.toString.call(a)}function g(a,b){var c,d=[];for(c=0;c<a.length;++c)d.push(b(a[c],c));return d}function h(a,b){return Object.prototype.hasOwnProperty.call(a,b)}function i(a,b){for(var c in b)h(b,c)&&(a[c]=b[c]);return h(b,"toString")&&(a.toString=b.toString),h(b,"valueOf")&&(a.valueOf=b.valueOf),a}function j(a,b,c,d){return qb(a,b,c,d,!0).utc()}function k(){
// We need to deep clone this object.
return{empty:!1,unusedTokens:[],unusedInput:[],overflow:-2,charsLeftOver:0,nullInput:!1,invalidMonth:null,invalidFormat:!1,userInvalidated:!1,iso:!1,parsedDateParts:[],meridiem:null}}function l(a){return null==a._pf&&(a._pf=k()),a._pf}function m(a){if(null==a._isValid){var b=l(a),c=ke.call(b.parsedDateParts,function(a){return null!=a});a._isValid=!isNaN(a._d.getTime())&&b.overflow<0&&!b.empty&&!b.invalidMonth&&!b.invalidWeekday&&!b.nullInput&&!b.invalidFormat&&!b.userInvalidated&&(!b.meridiem||b.meridiem&&c),a._strict&&(a._isValid=a._isValid&&0===b.charsLeftOver&&0===b.unusedTokens.length&&void 0===b.bigHour)}return a._isValid}function n(a){var b=j(NaN);return null!=a?i(l(b),a):l(b).userInvalidated=!0,b}function o(a){return void 0===a}function p(a,b){var c,d,e;if(o(b._isAMomentObject)||(a._isAMomentObject=b._isAMomentObject),o(b._i)||(a._i=b._i),o(b._f)||(a._f=b._f),o(b._l)||(a._l=b._l),o(b._strict)||(a._strict=b._strict),o(b._tzm)||(a._tzm=b._tzm),o(b._isUTC)||(a._isUTC=b._isUTC),o(b._offset)||(a._offset=b._offset),o(b._pf)||(a._pf=l(b)),o(b._locale)||(a._locale=b._locale),le.length>0)for(c in le)d=le[c],e=b[d],o(e)||(a[d]=e);return a}
// Moment prototype object
function q(b){p(this,b),this._d=new Date(null!=b._d?b._d.getTime():NaN),me===!1&&(me=!0,a.updateOffset(this),me=!1)}function r(a){return a instanceof q||null!=a&&null!=a._isAMomentObject}function s(a){return 0>a?Math.ceil(a)||0:Math.floor(a)}function t(a){var b=+a,c=0;return 0!==b&&isFinite(b)&&(c=s(b)),c}
// compare two arrays, return the number of differences
function u(a,b,c){var d,e=Math.min(a.length,b.length),f=Math.abs(a.length-b.length),g=0;for(d=0;e>d;d++)(c&&a[d]!==b[d]||!c&&t(a[d])!==t(b[d]))&&g++;return g+f}function v(b){a.suppressDeprecationWarnings===!1&&"undefined"!=typeof console&&console.warn&&console.warn("Deprecation warning: "+b)}function w(b,c){var d=!0;return i(function(){return null!=a.deprecationHandler&&a.deprecationHandler(null,b),d&&(v(b+"\nArguments: "+Array.prototype.slice.call(arguments).join(", ")+"\n"+(new Error).stack),d=!1),c.apply(this,arguments)},c)}function x(b,c){null!=a.deprecationHandler&&a.deprecationHandler(b,c),ne[b]||(v(c),ne[b]=!0)}function y(a){return a instanceof Function||"[object Function]"===Object.prototype.toString.call(a)}function z(a){var b,c;for(c in a)b=a[c],y(b)?this[c]=b:this["_"+c]=b;this._config=a,
// Lenient ordinal parsing accepts just a number in addition to
// number + (possibly) stuff coming from _ordinalParseLenient.
this._ordinalParseLenient=new RegExp(this._ordinalParse.source+"|"+/\d{1,2}/.source)}function A(a,b){var c,e=i({},a);for(c in b)h(b,c)&&(d(a[c])&&d(b[c])?(e[c]={},i(e[c],a[c]),i(e[c],b[c])):null!=b[c]?e[c]=b[c]:delete e[c]);for(c in a)h(a,c)&&!h(b,c)&&d(a[c])&&(
// make sure changes to properties don't modify parent config
e[c]=i({},e[c]));return e}function B(a){null!=a&&this.set(a)}function C(a,b,c){var d=this._calendar[a]||this._calendar.sameElse;return y(d)?d.call(b,c):d}function D(a){var b=this._longDateFormat[a],c=this._longDateFormat[a.toUpperCase()];return b||!c?b:(this._longDateFormat[a]=c.replace(/MMMM|MM|DD|dddd/g,function(a){return a.slice(1)}),this._longDateFormat[a])}function E(){return this._invalidDate}function F(a){return this._ordinal.replace("%d",a)}function G(a,b,c,d){var e=this._relativeTime[c];return y(e)?e(a,b,c,d):e.replace(/%d/i,a)}function H(a,b){var c=this._relativeTime[a>0?"future":"past"];return y(c)?c(b):c.replace(/%s/i,b)}function I(a,b){var c=a.toLowerCase();we[c]=we[c+"s"]=we[b]=a}function J(a){return"string"==typeof a?we[a]||we[a.toLowerCase()]:void 0}function K(a){var b,c,d={};for(c in a)h(a,c)&&(b=J(c),b&&(d[b]=a[c]));return d}function L(a,b){xe[a]=b}function M(a){var b=[];for(var c in a)b.push({unit:c,priority:xe[c]});return b.sort(function(a,b){return a.priority-b.priority}),b}function N(b,c){return function(d){return null!=d?(P(this,b,d),a.updateOffset(this,c),this):O(this,b)}}function O(a,b){return a.isValid()?a._d["get"+(a._isUTC?"UTC":"")+b]():NaN}function P(a,b,c){a.isValid()&&a._d["set"+(a._isUTC?"UTC":"")+b](c)}
// MOMENTS
function Q(a){return a=J(a),y(this[a])?this[a]():this}function R(a,b){if("object"==typeof a){a=K(a);for(var c=M(a),d=0;d<c.length;d++)this[c[d].unit](a[c[d].unit])}else if(a=J(a),y(this[a]))return this[a](b);return this}function S(a,b,c){var d=""+Math.abs(a),e=b-d.length,f=a>=0;return(f?c?"+":"":"-")+Math.pow(10,Math.max(0,e)).toString().substr(1)+d}
// token:    'M'
// padded:   ['MM', 2]
// ordinal:  'Mo'
// callback: function () { this.month() + 1 }
function T(a,b,c,d){var e=d;"string"==typeof d&&(e=function(){return this[d]()}),a&&(Be[a]=e),b&&(Be[b[0]]=function(){return S(e.apply(this,arguments),b[1],b[2])}),c&&(Be[c]=function(){return this.localeData().ordinal(e.apply(this,arguments),a)})}function U(a){return a.match(/\[[\s\S]/)?a.replace(/^\[|\]$/g,""):a.replace(/\\/g,"")}function V(a){var b,c,d=a.match(ye);for(b=0,c=d.length;c>b;b++)Be[d[b]]?d[b]=Be[d[b]]:d[b]=U(d[b]);return function(b){var e,f="";for(e=0;c>e;e++)f+=d[e]instanceof Function?d[e].call(b,a):d[e];return f}}
// format date using native date object
function W(a,b){return a.isValid()?(b=X(b,a.localeData()),Ae[b]=Ae[b]||V(b),Ae[b](a)):a.localeData().invalidDate()}function X(a,b){function c(a){return b.longDateFormat(a)||a}var d=5;for(ze.lastIndex=0;d>=0&&ze.test(a);)a=a.replace(ze,c),ze.lastIndex=0,d-=1;return a}function Y(a,b,c){Te[a]=y(b)?b:function(a,d){return a&&c?c:b}}function Z(a,b){return h(Te,a)?Te[a](b._strict,b._locale):new RegExp($(a))}
// Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
function $(a){return _(a.replace("\\","").replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g,function(a,b,c,d,e){return b||c||d||e}))}function _(a){return a.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&")}function aa(a,b){var c,d=b;for("string"==typeof a&&(a=[a]),"number"==typeof b&&(d=function(a,c){c[b]=t(a)}),c=0;c<a.length;c++)Ue[a[c]]=d}function ba(a,b){aa(a,function(a,c,d,e){d._w=d._w||{},b(a,d._w,d,e)})}function ca(a,b,c){null!=b&&h(Ue,a)&&Ue[a](b,c._a,c,a)}function da(a,b){return new Date(Date.UTC(a,b+1,0)).getUTCDate()}function ea(a,b){return c(this._months)?this._months[a.month()]:this._months[(this._months.isFormat||cf).test(b)?"format":"standalone"][a.month()]}function fa(a,b){return c(this._monthsShort)?this._monthsShort[a.month()]:this._monthsShort[cf.test(b)?"format":"standalone"][a.month()]}function ga(a,b,c){var d,e,f,g=a.toLocaleLowerCase();if(!this._monthsParse)for(
// this is not used
this._monthsParse=[],this._longMonthsParse=[],this._shortMonthsParse=[],d=0;12>d;++d)f=j([2e3,d]),this._shortMonthsParse[d]=this.monthsShort(f,"").toLocaleLowerCase(),this._longMonthsParse[d]=this.months(f,"").toLocaleLowerCase();return c?"MMM"===b?(e=pe.call(this._shortMonthsParse,g),-1!==e?e:null):(e=pe.call(this._longMonthsParse,g),-1!==e?e:null):"MMM"===b?(e=pe.call(this._shortMonthsParse,g),-1!==e?e:(e=pe.call(this._longMonthsParse,g),-1!==e?e:null)):(e=pe.call(this._longMonthsParse,g),-1!==e?e:(e=pe.call(this._shortMonthsParse,g),-1!==e?e:null))}function ha(a,b,c){var d,e,f;if(this._monthsParseExact)return ga.call(this,a,b,c);
// TODO: add sorting
// Sorting makes sure if one month (or abbr) is a prefix of another
// see sorting in computeMonthsParse
for(this._monthsParse||(this._monthsParse=[],this._longMonthsParse=[],this._shortMonthsParse=[]),d=0;12>d;d++){
// test the regex
if(e=j([2e3,d]),c&&!this._longMonthsParse[d]&&(this._longMonthsParse[d]=new RegExp("^"+this.months(e,"").replace(".","")+"$","i"),this._shortMonthsParse[d]=new RegExp("^"+this.monthsShort(e,"").replace(".","")+"$","i")),c||this._monthsParse[d]||(f="^"+this.months(e,"")+"|^"+this.monthsShort(e,""),this._monthsParse[d]=new RegExp(f.replace(".",""),"i")),c&&"MMMM"===b&&this._longMonthsParse[d].test(a))return d;if(c&&"MMM"===b&&this._shortMonthsParse[d].test(a))return d;if(!c&&this._monthsParse[d].test(a))return d}}
// MOMENTS
function ia(a,b){var c;if(!a.isValid())
// No op
return a;if("string"==typeof b)if(/^\d+$/.test(b))b=t(b);else
// TODO: Another silent failure?
if(b=a.localeData().monthsParse(b),"number"!=typeof b)return a;return c=Math.min(a.date(),da(a.year(),b)),a._d["set"+(a._isUTC?"UTC":"")+"Month"](b,c),a}function ja(b){return null!=b?(ia(this,b),a.updateOffset(this,!0),this):O(this,"Month")}function ka(){return da(this.year(),this.month())}function la(a){return this._monthsParseExact?(h(this,"_monthsRegex")||na.call(this),a?this._monthsShortStrictRegex:this._monthsShortRegex):(h(this,"_monthsShortRegex")||(this._monthsShortRegex=ff),this._monthsShortStrictRegex&&a?this._monthsShortStrictRegex:this._monthsShortRegex)}function ma(a){return this._monthsParseExact?(h(this,"_monthsRegex")||na.call(this),a?this._monthsStrictRegex:this._monthsRegex):(h(this,"_monthsRegex")||(this._monthsRegex=gf),this._monthsStrictRegex&&a?this._monthsStrictRegex:this._monthsRegex)}function na(){function a(a,b){return b.length-a.length}var b,c,d=[],e=[],f=[];for(b=0;12>b;b++)c=j([2e3,b]),d.push(this.monthsShort(c,"")),e.push(this.months(c,"")),f.push(this.months(c,"")),f.push(this.monthsShort(c,""));for(
// Sorting makes sure if one month (or abbr) is a prefix of another it
// will match the longer piece.
d.sort(a),e.sort(a),f.sort(a),b=0;12>b;b++)d[b]=_(d[b]),e[b]=_(e[b]);for(b=0;24>b;b++)f[b]=_(f[b]);this._monthsRegex=new RegExp("^("+f.join("|")+")","i"),this._monthsShortRegex=this._monthsRegex,this._monthsStrictRegex=new RegExp("^("+e.join("|")+")","i"),this._monthsShortStrictRegex=new RegExp("^("+d.join("|")+")","i")}
// HELPERS
function oa(a){return pa(a)?366:365}function pa(a){return a%4===0&&a%100!==0||a%400===0}function qa(){return pa(this.year())}function ra(a,b,c,d,e,f,g){
//can't just apply() to create a date:
//http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
var h=new Date(a,b,c,d,e,f,g);
//the date constructor remaps years 0-99 to 1900-1999
return 100>a&&a>=0&&isFinite(h.getFullYear())&&h.setFullYear(a),h}function sa(a){var b=new Date(Date.UTC.apply(null,arguments));
//the Date.UTC function remaps years 0-99 to 1900-1999
return 100>a&&a>=0&&isFinite(b.getUTCFullYear())&&b.setUTCFullYear(a),b}
// start-of-first-week - start-of-year
function ta(a,b,c){var// first-week day -- which january is always in the first week (4 for iso, 1 for other)
d=7+b-c,
// first-week day local weekday -- which local weekday is fwd
e=(7+sa(a,0,d).getUTCDay()-b)%7;return-e+d-1}
//http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
function ua(a,b,c,d,e){var f,g,h=(7+c-d)%7,i=ta(a,d,e),j=1+7*(b-1)+h+i;return 0>=j?(f=a-1,g=oa(f)+j):j>oa(a)?(f=a+1,g=j-oa(a)):(f=a,g=j),{year:f,dayOfYear:g}}function va(a,b,c){var d,e,f=ta(a.year(),b,c),g=Math.floor((a.dayOfYear()-f-1)/7)+1;return 1>g?(e=a.year()-1,d=g+wa(e,b,c)):g>wa(a.year(),b,c)?(d=g-wa(a.year(),b,c),e=a.year()+1):(e=a.year(),d=g),{week:d,year:e}}function wa(a,b,c){var d=ta(a,b,c),e=ta(a+1,b,c);return(oa(a)-d+e)/7}
// HELPERS
// LOCALES
function xa(a){return va(a,this._week.dow,this._week.doy).week}function ya(){return this._week.dow}function za(){return this._week.doy}
// MOMENTS
function Aa(a){var b=this.localeData().week(this);return null==a?b:this.add(7*(a-b),"d")}function Ba(a){var b=va(this,1,4).week;return null==a?b:this.add(7*(a-b),"d")}
// HELPERS
function Ca(a,b){return"string"!=typeof a?a:isNaN(a)?(a=b.weekdaysParse(a),"number"==typeof a?a:null):parseInt(a,10)}function Da(a,b){return"string"==typeof a?b.weekdaysParse(a)%7||7:isNaN(a)?null:a}function Ea(a,b){return c(this._weekdays)?this._weekdays[a.day()]:this._weekdays[this._weekdays.isFormat.test(b)?"format":"standalone"][a.day()]}function Fa(a){return this._weekdaysShort[a.day()]}function Ga(a){return this._weekdaysMin[a.day()]}function Ha(a,b,c){var d,e,f,g=a.toLocaleLowerCase();if(!this._weekdaysParse)for(this._weekdaysParse=[],this._shortWeekdaysParse=[],this._minWeekdaysParse=[],d=0;7>d;++d)f=j([2e3,1]).day(d),this._minWeekdaysParse[d]=this.weekdaysMin(f,"").toLocaleLowerCase(),this._shortWeekdaysParse[d]=this.weekdaysShort(f,"").toLocaleLowerCase(),this._weekdaysParse[d]=this.weekdays(f,"").toLocaleLowerCase();return c?"dddd"===b?(e=pe.call(this._weekdaysParse,g),-1!==e?e:null):"ddd"===b?(e=pe.call(this._shortWeekdaysParse,g),-1!==e?e:null):(e=pe.call(this._minWeekdaysParse,g),-1!==e?e:null):"dddd"===b?(e=pe.call(this._weekdaysParse,g),-1!==e?e:(e=pe.call(this._shortWeekdaysParse,g),-1!==e?e:(e=pe.call(this._minWeekdaysParse,g),-1!==e?e:null))):"ddd"===b?(e=pe.call(this._shortWeekdaysParse,g),-1!==e?e:(e=pe.call(this._weekdaysParse,g),-1!==e?e:(e=pe.call(this._minWeekdaysParse,g),-1!==e?e:null))):(e=pe.call(this._minWeekdaysParse,g),-1!==e?e:(e=pe.call(this._weekdaysParse,g),-1!==e?e:(e=pe.call(this._shortWeekdaysParse,g),-1!==e?e:null)))}function Ia(a,b,c){var d,e,f;if(this._weekdaysParseExact)return Ha.call(this,a,b,c);for(this._weekdaysParse||(this._weekdaysParse=[],this._minWeekdaysParse=[],this._shortWeekdaysParse=[],this._fullWeekdaysParse=[]),d=0;7>d;d++){
// test the regex
if(e=j([2e3,1]).day(d),c&&!this._fullWeekdaysParse[d]&&(this._fullWeekdaysParse[d]=new RegExp("^"+this.weekdays(e,"").replace(".",".?")+"$","i"),this._shortWeekdaysParse[d]=new RegExp("^"+this.weekdaysShort(e,"").replace(".",".?")+"$","i"),this._minWeekdaysParse[d]=new RegExp("^"+this.weekdaysMin(e,"").replace(".",".?")+"$","i")),this._weekdaysParse[d]||(f="^"+this.weekdays(e,"")+"|^"+this.weekdaysShort(e,"")+"|^"+this.weekdaysMin(e,""),this._weekdaysParse[d]=new RegExp(f.replace(".",""),"i")),c&&"dddd"===b&&this._fullWeekdaysParse[d].test(a))return d;if(c&&"ddd"===b&&this._shortWeekdaysParse[d].test(a))return d;if(c&&"dd"===b&&this._minWeekdaysParse[d].test(a))return d;if(!c&&this._weekdaysParse[d].test(a))return d}}
// MOMENTS
function Ja(a){if(!this.isValid())return null!=a?this:NaN;var b=this._isUTC?this._d.getUTCDay():this._d.getDay();return null!=a?(a=Ca(a,this.localeData()),this.add(a-b,"d")):b}function Ka(a){if(!this.isValid())return null!=a?this:NaN;var b=(this.day()+7-this.localeData()._week.dow)%7;return null==a?b:this.add(a-b,"d")}function La(a){if(!this.isValid())return null!=a?this:NaN;
// behaves the same as moment#day except
// as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
// as a setter, sunday should belong to the previous week.
if(null!=a){var b=Da(a,this.localeData());return this.day(this.day()%7?b:b-7)}return this.day()||7}function Ma(a){return this._weekdaysParseExact?(h(this,"_weekdaysRegex")||Pa.call(this),a?this._weekdaysStrictRegex:this._weekdaysRegex):(h(this,"_weekdaysRegex")||(this._weekdaysRegex=nf),this._weekdaysStrictRegex&&a?this._weekdaysStrictRegex:this._weekdaysRegex)}function Na(a){return this._weekdaysParseExact?(h(this,"_weekdaysRegex")||Pa.call(this),a?this._weekdaysShortStrictRegex:this._weekdaysShortRegex):(h(this,"_weekdaysShortRegex")||(this._weekdaysShortRegex=of),this._weekdaysShortStrictRegex&&a?this._weekdaysShortStrictRegex:this._weekdaysShortRegex)}function Oa(a){return this._weekdaysParseExact?(h(this,"_weekdaysRegex")||Pa.call(this),a?this._weekdaysMinStrictRegex:this._weekdaysMinRegex):(h(this,"_weekdaysMinRegex")||(this._weekdaysMinRegex=pf),this._weekdaysMinStrictRegex&&a?this._weekdaysMinStrictRegex:this._weekdaysMinRegex)}function Pa(){function a(a,b){return b.length-a.length}var b,c,d,e,f,g=[],h=[],i=[],k=[];for(b=0;7>b;b++)c=j([2e3,1]).day(b),d=this.weekdaysMin(c,""),e=this.weekdaysShort(c,""),f=this.weekdays(c,""),g.push(d),h.push(e),i.push(f),k.push(d),k.push(e),k.push(f);for(
// Sorting makes sure if one weekday (or abbr) is a prefix of another it
// will match the longer piece.
g.sort(a),h.sort(a),i.sort(a),k.sort(a),b=0;7>b;b++)h[b]=_(h[b]),i[b]=_(i[b]),k[b]=_(k[b]);this._weekdaysRegex=new RegExp("^("+k.join("|")+")","i"),this._weekdaysShortRegex=this._weekdaysRegex,this._weekdaysMinRegex=this._weekdaysRegex,this._weekdaysStrictRegex=new RegExp("^("+i.join("|")+")","i"),this._weekdaysShortStrictRegex=new RegExp("^("+h.join("|")+")","i"),this._weekdaysMinStrictRegex=new RegExp("^("+g.join("|")+")","i")}
// FORMATTING
function Qa(){return this.hours()%12||12}function Ra(){return this.hours()||24}function Sa(a,b){T(a,0,0,function(){return this.localeData().meridiem(this.hours(),this.minutes(),b)})}
// PARSING
function Ta(a,b){return b._meridiemParse}
// LOCALES
function Ua(a){
// IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
// Using charAt should be more compatible.
return"p"===(a+"").toLowerCase().charAt(0)}function Va(a,b,c){return a>11?c?"pm":"PM":c?"am":"AM"}function Wa(a){return a?a.toLowerCase().replace("_","-"):a}
// pick the locale from the array
// try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
// substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
function Xa(a){for(var b,c,d,e,f=0;f<a.length;){for(e=Wa(a[f]).split("-"),b=e.length,c=Wa(a[f+1]),c=c?c.split("-"):null;b>0;){if(d=Ya(e.slice(0,b).join("-")))return d;if(c&&c.length>=b&&u(e,c,!0)>=b-1)
//the next array item is better than a shallower substring of this one
break;b--}f++}return null}function Ya(a){var b=null;
// TODO: Find a better way to register and load all the locales in Node
if(!uf[a]&&"undefined"!=typeof module&&module&&module.exports)try{b=qf._abbr,require("./locale/"+a),
// because defineLocale currently also sets the global locale, we
// want to undo that for lazy loaded locales
Za(b)}catch(c){}return uf[a]}
// This function will load locale and then set the global locale.  If
// no arguments are passed in, it will simply return the current global
// locale key.
function Za(a,b){var c;
// moment.duration._locale = moment._locale = data;
return a&&(c=o(b)?ab(a):$a(a,b),c&&(qf=c)),qf._abbr}function $a(a,b){if(null!==b){var c=tf;
// treat as if there is no base config
// backwards compat for now: also set the locale
return b.abbr=a,null!=uf[a]?(x("defineLocaleOverride","use moment.updateLocale(localeName, config) to change an existing locale. moment.defineLocale(localeName, config) should only be used for creating a new locale See http://momentjs.com/guides/#/warnings/define-locale/ for more info."),c=uf[a]._config):null!=b.parentLocale&&(null!=uf[b.parentLocale]?c=uf[b.parentLocale]._config:x("parentLocaleUndefined","specified parentLocale is not defined yet. See http://momentjs.com/guides/#/warnings/parent-locale/")),uf[a]=new B(A(c,b)),Za(a),uf[a]}
// useful for testing
return delete uf[a],null}function _a(a,b){if(null!=b){var c,d=tf;
// MERGE
null!=uf[a]&&(d=uf[a]._config),b=A(d,b),c=new B(b),c.parentLocale=uf[a],uf[a]=c,
// backwards compat for now: also set the locale
Za(a)}else
// pass null for config to unupdate, useful for tests
null!=uf[a]&&(null!=uf[a].parentLocale?uf[a]=uf[a].parentLocale:null!=uf[a]&&delete uf[a]);return uf[a]}
// returns locale data
function ab(a){var b;if(a&&a._locale&&a._locale._abbr&&(a=a._locale._abbr),!a)return qf;if(!c(a)){if(b=Ya(a))return b;a=[a]}return Xa(a)}function bb(){return oe(uf)}function cb(a){var b,c=a._a;return c&&-2===l(a).overflow&&(b=c[We]<0||c[We]>11?We:c[Xe]<1||c[Xe]>da(c[Ve],c[We])?Xe:c[Ye]<0||c[Ye]>24||24===c[Ye]&&(0!==c[Ze]||0!==c[$e]||0!==c[_e])?Ye:c[Ze]<0||c[Ze]>59?Ze:c[$e]<0||c[$e]>59?$e:c[_e]<0||c[_e]>999?_e:-1,l(a)._overflowDayOfYear&&(Ve>b||b>Xe)&&(b=Xe),l(a)._overflowWeeks&&-1===b&&(b=af),l(a)._overflowWeekday&&-1===b&&(b=bf),l(a).overflow=b),a}
// date from iso format
function db(a){var b,c,d,e,f,g,h=a._i,i=vf.exec(h)||wf.exec(h);if(i){for(l(a).iso=!0,b=0,c=yf.length;c>b;b++)if(yf[b][1].exec(i[1])){e=yf[b][0],d=yf[b][2]!==!1;break}if(null==e)return void(a._isValid=!1);if(i[3]){for(b=0,c=zf.length;c>b;b++)if(zf[b][1].exec(i[3])){
// match[2] should be 'T' or space
f=(i[2]||" ")+zf[b][0];break}if(null==f)return void(a._isValid=!1)}if(!d&&null!=f)return void(a._isValid=!1);if(i[4]){if(!xf.exec(i[4]))return void(a._isValid=!1);g="Z"}a._f=e+(f||"")+(g||""),jb(a)}else a._isValid=!1}
// date from iso format or fallback
function eb(b){var c=Af.exec(b._i);return null!==c?void(b._d=new Date(+c[1])):(db(b),void(b._isValid===!1&&(delete b._isValid,a.createFromInputFallback(b))))}
// Pick the first defined of two or three arguments.
function fb(a,b,c){return null!=a?a:null!=b?b:c}function gb(b){
// hooks is actually the exported moment object
var c=new Date(a.now());return b._useUTC?[c.getUTCFullYear(),c.getUTCMonth(),c.getUTCDate()]:[c.getFullYear(),c.getMonth(),c.getDate()]}
// convert an array to a date.
// the array should mirror the parameters below
// note: all values past the year are optional and will default to the lowest possible value.
// [year, month, day , hour, minute, second, millisecond]
function hb(a){var b,c,d,e,f=[];if(!a._d){
// Default to current date.
// * if no year, month, day of month are given, default to today
// * if day of month is given, default month and year
// * if month is given, default only year
// * if year is given, don't default anything
for(d=gb(a),a._w&&null==a._a[Xe]&&null==a._a[We]&&ib(a),a._dayOfYear&&(e=fb(a._a[Ve],d[Ve]),a._dayOfYear>oa(e)&&(l(a)._overflowDayOfYear=!0),c=sa(e,0,a._dayOfYear),a._a[We]=c.getUTCMonth(),a._a[Xe]=c.getUTCDate()),b=0;3>b&&null==a._a[b];++b)a._a[b]=f[b]=d[b];
// Zero out whatever was not defaulted, including time
for(;7>b;b++)a._a[b]=f[b]=null==a._a[b]?2===b?1:0:a._a[b];
// Check for 24:00:00.000
24===a._a[Ye]&&0===a._a[Ze]&&0===a._a[$e]&&0===a._a[_e]&&(a._nextDay=!0,a._a[Ye]=0),a._d=(a._useUTC?sa:ra).apply(null,f),
// Apply timezone offset from input. The actual utcOffset can be changed
// with parseZone.
null!=a._tzm&&a._d.setUTCMinutes(a._d.getUTCMinutes()-a._tzm),a._nextDay&&(a._a[Ye]=24)}}function ib(a){var b,c,d,e,f,g,h,i;b=a._w,null!=b.GG||null!=b.W||null!=b.E?(f=1,g=4,c=fb(b.GG,a._a[Ve],va(rb(),1,4).year),d=fb(b.W,1),e=fb(b.E,1),(1>e||e>7)&&(i=!0)):(f=a._locale._week.dow,g=a._locale._week.doy,c=fb(b.gg,a._a[Ve],va(rb(),f,g).year),d=fb(b.w,1),null!=b.d?(e=b.d,(0>e||e>6)&&(i=!0)):null!=b.e?(e=b.e+f,(b.e<0||b.e>6)&&(i=!0)):e=f),1>d||d>wa(c,f,g)?l(a)._overflowWeeks=!0:null!=i?l(a)._overflowWeekday=!0:(h=ua(c,d,e,f,g),a._a[Ve]=h.year,a._dayOfYear=h.dayOfYear)}
// date from string and format string
function jb(b){
// TODO: Move this to another part of the creation flow to prevent circular deps
if(b._f===a.ISO_8601)return void db(b);b._a=[],l(b).empty=!0;
// This array is used to make a Date, either with `new Date` or `Date.UTC`
var c,d,e,f,g,h=""+b._i,i=h.length,j=0;for(e=X(b._f,b._locale).match(ye)||[],c=0;c<e.length;c++)f=e[c],d=(h.match(Z(f,b))||[])[0],d&&(g=h.substr(0,h.indexOf(d)),g.length>0&&l(b).unusedInput.push(g),h=h.slice(h.indexOf(d)+d.length),j+=d.length),Be[f]?(d?l(b).empty=!1:l(b).unusedTokens.push(f),ca(f,d,b)):b._strict&&!d&&l(b).unusedTokens.push(f);
// add remaining unparsed input length to the string
l(b).charsLeftOver=i-j,h.length>0&&l(b).unusedInput.push(h),
// clear _12h flag if hour is <= 12
b._a[Ye]<=12&&l(b).bigHour===!0&&b._a[Ye]>0&&(l(b).bigHour=void 0),l(b).parsedDateParts=b._a.slice(0),l(b).meridiem=b._meridiem,
// handle meridiem
b._a[Ye]=kb(b._locale,b._a[Ye],b._meridiem),hb(b),cb(b)}function kb(a,b,c){var d;
// Fallback
return null==c?b:null!=a.meridiemHour?a.meridiemHour(b,c):null!=a.isPM?(d=a.isPM(c),d&&12>b&&(b+=12),d||12!==b||(b=0),b):b}
// date from string and array of format strings
function lb(a){var b,c,d,e,f;if(0===a._f.length)return l(a).invalidFormat=!0,void(a._d=new Date(NaN));for(e=0;e<a._f.length;e++)f=0,b=p({},a),null!=a._useUTC&&(b._useUTC=a._useUTC),b._f=a._f[e],jb(b),m(b)&&(f+=l(b).charsLeftOver,f+=10*l(b).unusedTokens.length,l(b).score=f,(null==d||d>f)&&(d=f,c=b));i(a,c||b)}function mb(a){if(!a._d){var b=K(a._i);a._a=g([b.year,b.month,b.day||b.date,b.hour,b.minute,b.second,b.millisecond],function(a){return a&&parseInt(a,10)}),hb(a)}}function nb(a){var b=new q(cb(ob(a)));
// Adding is smart enough around DST
return b._nextDay&&(b.add(1,"d"),b._nextDay=void 0),b}function ob(a){var b=a._i,d=a._f;return a._locale=a._locale||ab(a._l),null===b||void 0===d&&""===b?n({nullInput:!0}):("string"==typeof b&&(a._i=b=a._locale.preparse(b)),r(b)?new q(cb(b)):(c(d)?lb(a):f(b)?a._d=b:d?jb(a):pb(a),m(a)||(a._d=null),a))}function pb(b){var d=b._i;void 0===d?b._d=new Date(a.now()):f(d)?b._d=new Date(d.valueOf()):"string"==typeof d?eb(b):c(d)?(b._a=g(d.slice(0),function(a){return parseInt(a,10)}),hb(b)):"object"==typeof d?mb(b):"number"==typeof d?
// from milliseconds
b._d=new Date(d):a.createFromInputFallback(b)}function qb(a,b,f,g,h){var i={};
// object construction must be done this way.
// https://github.com/moment/moment/issues/1423
return"boolean"==typeof f&&(g=f,f=void 0),(d(a)&&e(a)||c(a)&&0===a.length)&&(a=void 0),i._isAMomentObject=!0,i._useUTC=i._isUTC=h,i._l=f,i._i=a,i._f=b,i._strict=g,nb(i)}function rb(a,b,c,d){return qb(a,b,c,d,!1)}
// Pick a moment m from moments so that m[fn](other) is true for all
// other. This relies on the function fn to be transitive.
//
// moments should either be an array of moment objects or an array, whose
// first element is an array of moment objects.
function sb(a,b){var d,e;if(1===b.length&&c(b[0])&&(b=b[0]),!b.length)return rb();for(d=b[0],e=1;e<b.length;++e)b[e].isValid()&&!b[e][a](d)||(d=b[e]);return d}
// TODO: Use [].sort instead?
function tb(){var a=[].slice.call(arguments,0);return sb("isBefore",a)}function ub(){var a=[].slice.call(arguments,0);return sb("isAfter",a)}function vb(a){var b=K(a),c=b.year||0,d=b.quarter||0,e=b.month||0,f=b.week||0,g=b.day||0,h=b.hour||0,i=b.minute||0,j=b.second||0,k=b.millisecond||0;
// representation for dateAddRemove
this._milliseconds=+k+1e3*j+// 1000
6e4*i+// 1000 * 60
1e3*h*60*60,//using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
// Because of dateAddRemove treats 24 hours as different from a
// day when working around DST, we need to store them separately
this._days=+g+7*f,
// It is impossible translate months into days without knowing
// which months you are are talking about, so we have to store
// it separately.
this._months=+e+3*d+12*c,this._data={},this._locale=ab(),this._bubble()}function wb(a){return a instanceof vb}
// FORMATTING
function xb(a,b){T(a,0,0,function(){var a=this.utcOffset(),c="+";return 0>a&&(a=-a,c="-"),c+S(~~(a/60),2)+b+S(~~a%60,2)})}function yb(a,b){var c=(b||"").match(a)||[],d=c[c.length-1]||[],e=(d+"").match(Ef)||["-",0,0],f=+(60*e[1])+t(e[2]);return"+"===e[0]?f:-f}
// Return a moment from input, that is local/utc/zone equivalent to model.
function zb(b,c){var d,e;
// Use low-level api, because this fn is low-level api.
return c._isUTC?(d=c.clone(),e=(r(b)||f(b)?b.valueOf():rb(b).valueOf())-d.valueOf(),d._d.setTime(d._d.valueOf()+e),a.updateOffset(d,!1),d):rb(b).local()}function Ab(a){
// On Firefox.24 Date#getTimezoneOffset returns a floating point.
// https://github.com/moment/moment/pull/1871
return 15*-Math.round(a._d.getTimezoneOffset()/15)}
// MOMENTS
// keepLocalTime = true means only change the timezone, without
// affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
// 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
// +0200, so we adjust the time as needed, to be valid.
//
// Keeping the time actually adds/subtracts (one hour)
// from the actual represented time. That is why we call updateOffset
// a second time. In case it wants us to change the offset again
// _changeInProgress == true case, then we have to adjust, because
// there is no such time in the given timezone.
function Bb(b,c){var d,e=this._offset||0;return this.isValid()?null!=b?("string"==typeof b?b=yb(Qe,b):Math.abs(b)<16&&(b=60*b),!this._isUTC&&c&&(d=Ab(this)),this._offset=b,this._isUTC=!0,null!=d&&this.add(d,"m"),e!==b&&(!c||this._changeInProgress?Sb(this,Mb(b-e,"m"),1,!1):this._changeInProgress||(this._changeInProgress=!0,a.updateOffset(this,!0),this._changeInProgress=null)),this):this._isUTC?e:Ab(this):null!=b?this:NaN}function Cb(a,b){return null!=a?("string"!=typeof a&&(a=-a),this.utcOffset(a,b),this):-this.utcOffset()}function Db(a){return this.utcOffset(0,a)}function Eb(a){return this._isUTC&&(this.utcOffset(0,a),this._isUTC=!1,a&&this.subtract(Ab(this),"m")),this}function Fb(){return this._tzm?this.utcOffset(this._tzm):"string"==typeof this._i&&this.utcOffset(yb(Pe,this._i)),this}function Gb(a){return this.isValid()?(a=a?rb(a).utcOffset():0,(this.utcOffset()-a)%60===0):!1}function Hb(){return this.utcOffset()>this.clone().month(0).utcOffset()||this.utcOffset()>this.clone().month(5).utcOffset()}function Ib(){if(!o(this._isDSTShifted))return this._isDSTShifted;var a={};if(p(a,this),a=ob(a),a._a){var b=a._isUTC?j(a._a):rb(a._a);this._isDSTShifted=this.isValid()&&u(a._a,b.toArray())>0}else this._isDSTShifted=!1;return this._isDSTShifted}function Jb(){return this.isValid()?!this._isUTC:!1}function Kb(){return this.isValid()?this._isUTC:!1}function Lb(){return this.isValid()?this._isUTC&&0===this._offset:!1}function Mb(a,b){var c,d,e,f=a,
// matching against regexp is expensive, do it on demand
g=null;// checks for null or undefined
return wb(a)?f={ms:a._milliseconds,d:a._days,M:a._months}:"number"==typeof a?(f={},b?f[b]=a:f.milliseconds=a):(g=Ff.exec(a))?(c="-"===g[1]?-1:1,f={y:0,d:t(g[Xe])*c,h:t(g[Ye])*c,m:t(g[Ze])*c,s:t(g[$e])*c,ms:t(g[_e])*c}):(g=Gf.exec(a))?(c="-"===g[1]?-1:1,f={y:Nb(g[2],c),M:Nb(g[3],c),w:Nb(g[4],c),d:Nb(g[5],c),h:Nb(g[6],c),m:Nb(g[7],c),s:Nb(g[8],c)}):null==f?f={}:"object"==typeof f&&("from"in f||"to"in f)&&(e=Pb(rb(f.from),rb(f.to)),f={},f.ms=e.milliseconds,f.M=e.months),d=new vb(f),wb(a)&&h(a,"_locale")&&(d._locale=a._locale),d}function Nb(a,b){
// We'd normally use ~~inp for this, but unfortunately it also
// converts floats to ints.
// inp may be undefined, so careful calling replace on it.
var c=a&&parseFloat(a.replace(",","."));
// apply sign while we're at it
return(isNaN(c)?0:c)*b}function Ob(a,b){var c={milliseconds:0,months:0};return c.months=b.month()-a.month()+12*(b.year()-a.year()),a.clone().add(c.months,"M").isAfter(b)&&--c.months,c.milliseconds=+b-+a.clone().add(c.months,"M"),c}function Pb(a,b){var c;return a.isValid()&&b.isValid()?(b=zb(b,a),a.isBefore(b)?c=Ob(a,b):(c=Ob(b,a),c.milliseconds=-c.milliseconds,c.months=-c.months),c):{milliseconds:0,months:0}}function Qb(a){return 0>a?-1*Math.round(-1*a):Math.round(a)}
// TODO: remove 'name' arg after deprecation is removed
function Rb(a,b){return function(c,d){var e,f;
//invert the arguments, but complain about it
return null===d||isNaN(+d)||(x(b,"moment()."+b+"(period, number) is deprecated. Please use moment()."+b+"(number, period). See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info."),f=c,c=d,d=f),c="string"==typeof c?+c:c,e=Mb(c,d),Sb(this,e,a),this}}function Sb(b,c,d,e){var f=c._milliseconds,g=Qb(c._days),h=Qb(c._months);b.isValid()&&(e=null==e?!0:e,f&&b._d.setTime(b._d.valueOf()+f*d),g&&P(b,"Date",O(b,"Date")+g*d),h&&ia(b,O(b,"Month")+h*d),e&&a.updateOffset(b,g||h))}function Tb(a,b){var c=a.diff(b,"days",!0);return-6>c?"sameElse":-1>c?"lastWeek":0>c?"lastDay":1>c?"sameDay":2>c?"nextDay":7>c?"nextWeek":"sameElse"}function Ub(b,c){
// We want to compare the start of today, vs this.
// Getting start-of-today depends on whether we're local/utc/offset or not.
var d=b||rb(),e=zb(d,this).startOf("day"),f=a.calendarFormat(this,e)||"sameElse",g=c&&(y(c[f])?c[f].call(this,d):c[f]);return this.format(g||this.localeData().calendar(f,this,rb(d)))}function Vb(){return new q(this)}function Wb(a,b){var c=r(a)?a:rb(a);return this.isValid()&&c.isValid()?(b=J(o(b)?"millisecond":b),"millisecond"===b?this.valueOf()>c.valueOf():c.valueOf()<this.clone().startOf(b).valueOf()):!1}function Xb(a,b){var c=r(a)?a:rb(a);return this.isValid()&&c.isValid()?(b=J(o(b)?"millisecond":b),"millisecond"===b?this.valueOf()<c.valueOf():this.clone().endOf(b).valueOf()<c.valueOf()):!1}function Yb(a,b,c,d){return d=d||"()",("("===d[0]?this.isAfter(a,c):!this.isBefore(a,c))&&(")"===d[1]?this.isBefore(b,c):!this.isAfter(b,c))}function Zb(a,b){var c,d=r(a)?a:rb(a);return this.isValid()&&d.isValid()?(b=J(b||"millisecond"),"millisecond"===b?this.valueOf()===d.valueOf():(c=d.valueOf(),this.clone().startOf(b).valueOf()<=c&&c<=this.clone().endOf(b).valueOf())):!1}function $b(a,b){return this.isSame(a,b)||this.isAfter(a,b)}function _b(a,b){return this.isSame(a,b)||this.isBefore(a,b)}function ac(a,b,c){var d,e,f,g;// 1000
// 1000 * 60
// 1000 * 60 * 60
// 1000 * 60 * 60 * 24, negate dst
// 1000 * 60 * 60 * 24 * 7, negate dst
return this.isValid()?(d=zb(a,this),d.isValid()?(e=6e4*(d.utcOffset()-this.utcOffset()),b=J(b),"year"===b||"month"===b||"quarter"===b?(g=bc(this,d),"quarter"===b?g/=3:"year"===b&&(g/=12)):(f=this-d,g="second"===b?f/1e3:"minute"===b?f/6e4:"hour"===b?f/36e5:"day"===b?(f-e)/864e5:"week"===b?(f-e)/6048e5:f),c?g:s(g)):NaN):NaN}function bc(a,b){
// difference in months
var c,d,e=12*(b.year()-a.year())+(b.month()-a.month()),
// b is in (anchor - 1 month, anchor + 1 month)
f=a.clone().add(e,"months");
//check for negative zero, return zero if negative zero
// linear across the month
// linear across the month
return 0>b-f?(c=a.clone().add(e-1,"months"),d=(b-f)/(f-c)):(c=a.clone().add(e+1,"months"),d=(b-f)/(c-f)),-(e+d)||0}function cc(){return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")}function dc(){var a=this.clone().utc();return 0<a.year()&&a.year()<=9999?y(Date.prototype.toISOString)?this.toDate().toISOString():W(a,"YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"):W(a,"YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]")}function ec(b){b||(b=this.isUtc()?a.defaultFormatUtc:a.defaultFormat);var c=W(this,b);return this.localeData().postformat(c)}function fc(a,b){return this.isValid()&&(r(a)&&a.isValid()||rb(a).isValid())?Mb({to:this,from:a}).locale(this.locale()).humanize(!b):this.localeData().invalidDate()}function gc(a){return this.from(rb(),a)}function hc(a,b){return this.isValid()&&(r(a)&&a.isValid()||rb(a).isValid())?Mb({from:this,to:a}).locale(this.locale()).humanize(!b):this.localeData().invalidDate()}function ic(a){return this.to(rb(),a)}
// If passed a locale key, it will set the locale for this
// instance.  Otherwise, it will return the locale configuration
// variables for this instance.
function jc(a){var b;return void 0===a?this._locale._abbr:(b=ab(a),null!=b&&(this._locale=b),this)}function kc(){return this._locale}function lc(a){
// the following switch intentionally omits break keywords
// to utilize falling through the cases.
switch(a=J(a)){case"year":this.month(0);/* falls through */
case"quarter":case"month":this.date(1);/* falls through */
case"week":case"isoWeek":case"day":case"date":this.hours(0);/* falls through */
case"hour":this.minutes(0);/* falls through */
case"minute":this.seconds(0);/* falls through */
case"second":this.milliseconds(0)}
// weeks are a special case
// quarters are also special
return"week"===a&&this.weekday(0),"isoWeek"===a&&this.isoWeekday(1),"quarter"===a&&this.month(3*Math.floor(this.month()/3)),this}function mc(a){
// 'date' is an alias for 'day', so it should be considered as such.
return a=J(a),void 0===a||"millisecond"===a?this:("date"===a&&(a="day"),this.startOf(a).add(1,"isoWeek"===a?"week":a).subtract(1,"ms"))}function nc(){return this._d.valueOf()-6e4*(this._offset||0)}function oc(){return Math.floor(this.valueOf()/1e3)}function pc(){return new Date(this.valueOf())}function qc(){var a=this;return[a.year(),a.month(),a.date(),a.hour(),a.minute(),a.second(),a.millisecond()]}function rc(){var a=this;return{years:a.year(),months:a.month(),date:a.date(),hours:a.hours(),minutes:a.minutes(),seconds:a.seconds(),milliseconds:a.milliseconds()}}function sc(){
// new Date(NaN).toJSON() === null
return this.isValid()?this.toISOString():null}function tc(){return m(this)}function uc(){return i({},l(this))}function vc(){return l(this).overflow}function wc(){return{input:this._i,format:this._f,locale:this._locale,isUTC:this._isUTC,strict:this._strict}}function xc(a,b){T(0,[a,a.length],0,b)}
// MOMENTS
function yc(a){return Cc.call(this,a,this.week(),this.weekday(),this.localeData()._week.dow,this.localeData()._week.doy)}function zc(a){return Cc.call(this,a,this.isoWeek(),this.isoWeekday(),1,4)}function Ac(){return wa(this.year(),1,4)}function Bc(){var a=this.localeData()._week;return wa(this.year(),a.dow,a.doy)}function Cc(a,b,c,d,e){var f;return null==a?va(this,d,e).year:(f=wa(a,d,e),b>f&&(b=f),Dc.call(this,a,b,c,d,e))}function Dc(a,b,c,d,e){var f=ua(a,b,c,d,e),g=sa(f.year,0,f.dayOfYear);return this.year(g.getUTCFullYear()),this.month(g.getUTCMonth()),this.date(g.getUTCDate()),this}
// MOMENTS
function Ec(a){return null==a?Math.ceil((this.month()+1)/3):this.month(3*(a-1)+this.month()%3)}
// HELPERS
// MOMENTS
function Fc(a){var b=Math.round((this.clone().startOf("day")-this.clone().startOf("year"))/864e5)+1;return null==a?b:this.add(a-b,"d")}function Gc(a,b){b[_e]=t(1e3*("0."+a))}
// MOMENTS
function Hc(){return this._isUTC?"UTC":""}function Ic(){return this._isUTC?"Coordinated Universal Time":""}function Jc(a){return rb(1e3*a)}function Kc(){return rb.apply(null,arguments).parseZone()}function Lc(a){return a}function Mc(a,b,c,d){var e=ab(),f=j().set(d,b);return e[c](f,a)}function Nc(a,b,c){if("number"==typeof a&&(b=a,a=void 0),a=a||"",null!=b)return Mc(a,b,c,"month");var d,e=[];for(d=0;12>d;d++)e[d]=Mc(a,d,c,"month");return e}
// ()
// (5)
// (fmt, 5)
// (fmt)
// (true)
// (true, 5)
// (true, fmt, 5)
// (true, fmt)
function Oc(a,b,c,d){"boolean"==typeof a?("number"==typeof b&&(c=b,b=void 0),b=b||""):(b=a,c=b,a=!1,"number"==typeof b&&(c=b,b=void 0),b=b||"");var e=ab(),f=a?e._week.dow:0;if(null!=c)return Mc(b,(c+f)%7,d,"day");var g,h=[];for(g=0;7>g;g++)h[g]=Mc(b,(g+f)%7,d,"day");return h}function Pc(a,b){return Nc(a,b,"months")}function Qc(a,b){return Nc(a,b,"monthsShort")}function Rc(a,b,c){return Oc(a,b,c,"weekdays")}function Sc(a,b,c){return Oc(a,b,c,"weekdaysShort")}function Tc(a,b,c){return Oc(a,b,c,"weekdaysMin")}function Uc(){var a=this._data;return this._milliseconds=Sf(this._milliseconds),this._days=Sf(this._days),this._months=Sf(this._months),a.milliseconds=Sf(a.milliseconds),a.seconds=Sf(a.seconds),a.minutes=Sf(a.minutes),a.hours=Sf(a.hours),a.months=Sf(a.months),a.years=Sf(a.years),this}function Vc(a,b,c,d){var e=Mb(b,c);return a._milliseconds+=d*e._milliseconds,a._days+=d*e._days,a._months+=d*e._months,a._bubble()}
// supports only 2.0-style add(1, 's') or add(duration)
function Wc(a,b){return Vc(this,a,b,1)}
// supports only 2.0-style subtract(1, 's') or subtract(duration)
function Xc(a,b){return Vc(this,a,b,-1)}function Yc(a){return 0>a?Math.floor(a):Math.ceil(a)}function Zc(){var a,b,c,d,e,f=this._milliseconds,g=this._days,h=this._months,i=this._data;
// if we have a mix of positive and negative values, bubble down first
// check: https://github.com/moment/moment/issues/2166
// The following code bubbles up values, see the tests for
// examples of what that means.
// convert days to months
// 12 months -> 1 year
return f>=0&&g>=0&&h>=0||0>=f&&0>=g&&0>=h||(f+=864e5*Yc(_c(h)+g),g=0,h=0),i.milliseconds=f%1e3,a=s(f/1e3),i.seconds=a%60,b=s(a/60),i.minutes=b%60,c=s(b/60),i.hours=c%24,g+=s(c/24),e=s($c(g)),h+=e,g-=Yc(_c(e)),d=s(h/12),h%=12,i.days=g,i.months=h,i.years=d,this}function $c(a){
// 400 years have 146097 days (taking into account leap year rules)
// 400 years have 12 months === 4800
return 4800*a/146097}function _c(a){
// the reverse of daysToMonths
return 146097*a/4800}function ad(a){var b,c,d=this._milliseconds;if(a=J(a),"month"===a||"year"===a)return b=this._days+d/864e5,c=this._months+$c(b),"month"===a?c:c/12;switch(b=this._days+Math.round(_c(this._months)),a){case"week":return b/7+d/6048e5;case"day":return b+d/864e5;case"hour":return 24*b+d/36e5;case"minute":return 1440*b+d/6e4;case"second":return 86400*b+d/1e3;
// Math.floor prevents floating point math errors here
case"millisecond":return Math.floor(864e5*b)+d;default:throw new Error("Unknown unit "+a)}}
// TODO: Use this.as('ms')?
function bd(){return this._milliseconds+864e5*this._days+this._months%12*2592e6+31536e6*t(this._months/12)}function cd(a){return function(){return this.as(a)}}function dd(a){return a=J(a),this[a+"s"]()}function ed(a){return function(){return this._data[a]}}function fd(){return s(this.days()/7)}
// helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
function gd(a,b,c,d,e){return e.relativeTime(b||1,!!c,a,d)}function hd(a,b,c){var d=Mb(a).abs(),e=gg(d.as("s")),f=gg(d.as("m")),g=gg(d.as("h")),h=gg(d.as("d")),i=gg(d.as("M")),j=gg(d.as("y")),k=e<hg.s&&["s",e]||1>=f&&["m"]||f<hg.m&&["mm",f]||1>=g&&["h"]||g<hg.h&&["hh",g]||1>=h&&["d"]||h<hg.d&&["dd",h]||1>=i&&["M"]||i<hg.M&&["MM",i]||1>=j&&["y"]||["yy",j];return k[2]=b,k[3]=+a>0,k[4]=c,gd.apply(null,k)}
// This function allows you to set the rounding function for relative time strings
function id(a){return void 0===a?gg:"function"==typeof a?(gg=a,!0):!1}
// This function allows you to set a threshold for relative time strings
function jd(a,b){return void 0===hg[a]?!1:void 0===b?hg[a]:(hg[a]=b,!0)}function kd(a){var b=this.localeData(),c=hd(this,!a,b);return a&&(c=b.pastFuture(+this,c)),b.postformat(c)}function ld(){
// for ISO strings we do not use the normal bubbling rules:
//  * milliseconds bubble up until they become hours
//  * days do not bubble at all
//  * months bubble up until they become years
// This is because there is no context-free conversion between hours and days
// (think of clock changes)
// and also not between days and months (28-31 days per month)
var a,b,c,d=ig(this._milliseconds)/1e3,e=ig(this._days),f=ig(this._months);a=s(d/60),b=s(a/60),d%=60,a%=60,c=s(f/12),f%=12;
// inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
var g=c,h=f,i=e,j=b,k=a,l=d,m=this.asSeconds();return m?(0>m?"-":"")+"P"+(g?g+"Y":"")+(h?h+"M":"")+(i?i+"D":"")+(j||k||l?"T":"")+(j?j+"H":"")+(k?k+"M":"")+(l?l+"S":""):"P0D"}function md(a,b){var c=a.split("_");return b%10===1&&b%100!==11?c[0]:b%10>=2&&4>=b%10&&(10>b%100||b%100>=20)?c[1]:c[2]}function nd(a,b,c){var d={mm:b?"хвіліна_хвіліны_хвілін":"хвіліну_хвіліны_хвілін",hh:b?"гадзіна_гадзіны_гадзін":"гадзіну_гадзіны_гадзін",dd:"дзень_дні_дзён",MM:"месяц_месяцы_месяцаў",yy:"год_гады_гадоў"};return"m"===c?b?"хвіліна":"хвіліну":"h"===c?b?"гадзіна":"гадзіну":a+" "+md(d[c],+a)}function od(a,b,c){var d={mm:"munutenn",MM:"miz",dd:"devezh"};return a+" "+rd(d[c],a)}function pd(a){switch(qd(a)){case 1:case 3:case 4:case 5:case 9:return a+" bloaz";default:return a+" vloaz"}}function qd(a){return a>9?qd(a%10):a}function rd(a,b){return 2===b?sd(a):a}function sd(a){var b={m:"v",b:"v",d:"z"};return void 0===b[a.charAt(0)]?a:b[a.charAt(0)]+a.substring(1)}function td(a,b,c){var d=a+" ";switch(c){case"m":return b?"jedna minuta":"jedne minute";case"mm":return d+=1===a?"minuta":2===a||3===a||4===a?"minute":"minuta";case"h":return b?"jedan sat":"jednog sata";case"hh":return d+=1===a?"sat":2===a||3===a||4===a?"sata":"sati";case"dd":return d+=1===a?"dan":"dana";case"MM":return d+=1===a?"mjesec":2===a||3===a||4===a?"mjeseca":"mjeseci";case"yy":return d+=1===a?"godina":2===a||3===a||4===a?"godine":"godina"}}function ud(a){return a>1&&5>a&&1!==~~(a/10)}function vd(a,b,c,d){var e=a+" ";switch(c){case"s":// a few seconds / in a few seconds / a few seconds ago
return b||d?"pár sekund":"pár sekundami";case"m":// a minute / in a minute / a minute ago
return b?"minuta":d?"minutu":"minutou";case"mm":// 9 minutes / in 9 minutes / 9 minutes ago
// 9 minutes / in 9 minutes / 9 minutes ago
return b||d?e+(ud(a)?"minuty":"minut"):e+"minutami";break;case"h":// an hour / in an hour / an hour ago
return b?"hodina":d?"hodinu":"hodinou";case"hh":// 9 hours / in 9 hours / 9 hours ago
// 9 hours / in 9 hours / 9 hours ago
return b||d?e+(ud(a)?"hodiny":"hodin"):e+"hodinami";break;case"d":// a day / in a day / a day ago
return b||d?"den":"dnem";case"dd":// 9 days / in 9 days / 9 days ago
// 9 days / in 9 days / 9 days ago
return b||d?e+(ud(a)?"dny":"dní"):e+"dny";break;case"M":// a month / in a month / a month ago
return b||d?"měsíc":"měsícem";case"MM":// 9 months / in 9 months / 9 months ago
// 9 months / in 9 months / 9 months ago
return b||d?e+(ud(a)?"měsíce":"měsíců"):e+"měsíci";break;case"y":// a year / in a year / a year ago
return b||d?"rok":"rokem";case"yy":// 9 years / in 9 years / 9 years ago
// 9 years / in 9 years / 9 years ago
return b||d?e+(ud(a)?"roky":"let"):e+"lety"}}function wd(a,b,c,d){var e={m:["eine Minute","einer Minute"],h:["eine Stunde","einer Stunde"],d:["ein Tag","einem Tag"],dd:[a+" Tage",a+" Tagen"],M:["ein Monat","einem Monat"],MM:[a+" Monate",a+" Monaten"],y:["ein Jahr","einem Jahr"],yy:[a+" Jahre",a+" Jahren"]};return b?e[c][0]:e[c][1]}function xd(a,b,c,d){var e={m:["eine Minute","einer Minute"],h:["eine Stunde","einer Stunde"],d:["ein Tag","einem Tag"],dd:[a+" Tage",a+" Tagen"],M:["ein Monat","einem Monat"],MM:[a+" Monate",a+" Monaten"],y:["ein Jahr","einem Jahr"],yy:[a+" Jahre",a+" Jahren"]};return b?e[c][0]:e[c][1]}function yd(a,b,c,d){var e={s:["mõne sekundi","mõni sekund","paar sekundit"],m:["ühe minuti","üks minut"],mm:[a+" minuti",a+" minutit"],h:["ühe tunni","tund aega","üks tund"],hh:[a+" tunni",a+" tundi"],d:["ühe päeva","üks päev"],M:["kuu aja","kuu aega","üks kuu"],MM:[a+" kuu",a+" kuud"],y:["ühe aasta","aasta","üks aasta"],yy:[a+" aasta",a+" aastat"]};return b?e[c][2]?e[c][2]:e[c][1]:d?e[c][0]:e[c][1]}function zd(a,b,c,d){var e="";switch(c){case"s":return d?"muutaman sekunnin":"muutama sekunti";case"m":return d?"minuutin":"minuutti";case"mm":e=d?"minuutin":"minuuttia";break;case"h":return d?"tunnin":"tunti";case"hh":e=d?"tunnin":"tuntia";break;case"d":return d?"päivän":"päivä";case"dd":e=d?"päivän":"päivää";break;case"M":return d?"kuukauden":"kuukausi";case"MM":e=d?"kuukauden":"kuukautta";break;case"y":return d?"vuoden":"vuosi";case"yy":e=d?"vuoden":"vuotta"}return e=Ad(a,d)+" "+e}function Ad(a,b){return 10>a?b?Jg[a]:Ig[a]:a}function Bd(a,b,c){var d=a+" ";switch(c){case"m":return b?"jedna minuta":"jedne minute";case"mm":return d+=1===a?"minuta":2===a||3===a||4===a?"minute":"minuta";case"h":return b?"jedan sat":"jednog sata";case"hh":return d+=1===a?"sat":2===a||3===a||4===a?"sata":"sati";case"dd":return d+=1===a?"dan":"dana";case"MM":return d+=1===a?"mjesec":2===a||3===a||4===a?"mjeseca":"mjeseci";case"yy":return d+=1===a?"godina":2===a||3===a||4===a?"godine":"godina"}}function Cd(a,b,c,d){var e=a;switch(c){case"s":return d||b?"néhány másodperc":"néhány másodperce";case"m":return"egy"+(d||b?" perc":" perce");case"mm":return e+(d||b?" perc":" perce");case"h":return"egy"+(d||b?" óra":" órája");case"hh":return e+(d||b?" óra":" órája");case"d":return"egy"+(d||b?" nap":" napja");case"dd":return e+(d||b?" nap":" napja");case"M":return"egy"+(d||b?" hónap":" hónapja");case"MM":return e+(d||b?" hónap":" hónapja");case"y":return"egy"+(d||b?" év":" éve");case"yy":return e+(d||b?" év":" éve")}return""}function Dd(a){return(a?"":"[múlt] ")+"["+Tg[this.day()]+"] LT[-kor]"}function Ed(a){return a%100===11?!0:a%10!==1}function Fd(a,b,c,d){var e=a+" ";switch(c){case"s":return b||d?"nokkrar sekúndur":"nokkrum sekúndum";case"m":return b?"mínúta":"mínútu";case"mm":return Ed(a)?e+(b||d?"mínútur":"mínútum"):b?e+"mínúta":e+"mínútu";case"hh":return Ed(a)?e+(b||d?"klukkustundir":"klukkustundum"):e+"klukkustund";case"d":return b?"dagur":d?"dag":"degi";case"dd":return Ed(a)?b?e+"dagar":e+(d?"daga":"dögum"):b?e+"dagur":e+(d?"dag":"degi");case"M":return b?"mánuður":d?"mánuð":"mánuði";case"MM":return Ed(a)?b?e+"mánuðir":e+(d?"mánuði":"mánuðum"):b?e+"mánuður":e+(d?"mánuð":"mánuði");case"y":return b||d?"ár":"ári";case"yy":return Ed(a)?e+(b||d?"ár":"árum"):e+(b||d?"ár":"ári")}}function Gd(a,b,c,d){var e={m:["eng Minutt","enger Minutt"],h:["eng Stonn","enger Stonn"],d:["een Dag","engem Dag"],M:["ee Mount","engem Mount"],y:["ee Joer","engem Joer"]};return b?e[c][0]:e[c][1]}function Hd(a){var b=a.substr(0,a.indexOf(" "));return Jd(b)?"a "+a:"an "+a}function Id(a){var b=a.substr(0,a.indexOf(" "));return Jd(b)?"viru "+a:"virun "+a}/**
     * Returns true if the word before the given number loses the '-n' ending.
     * e.g. 'an 10 Deeg' but 'a 5 Deeg'
     *
     * @param number {integer}
     * @returns {boolean}
     */
function Jd(a){if(a=parseInt(a,10),isNaN(a))return!1;if(0>a)
// Negative Number --> always true
return!0;if(10>a)
// Only 1 digit
return a>=4&&7>=a;if(100>a){
// 2 digits
var b=a%10,c=a/10;return Jd(0===b?c:b)}if(1e4>a){
// 3 or 4 digits --> recursively check first digit
for(;a>=10;)a/=10;return Jd(a)}
// Anything larger than 4 digits: recursively check first n-3 digits
return a/=1e3,Jd(a)}function Kd(a,b,c,d){return b?"kelios sekundės":d?"kelių sekundžių":"kelias sekundes"}function Ld(a,b,c,d){return b?Nd(c)[0]:d?Nd(c)[1]:Nd(c)[2]}function Md(a){return a%10===0||a>10&&20>a}function Nd(a){return Wg[a].split("_")}function Od(a,b,c,d){var e=a+" ";return 1===a?e+Ld(a,b,c[0],d):b?e+(Md(a)?Nd(c)[1]:Nd(c)[0]):d?e+Nd(c)[1]:e+(Md(a)?Nd(c)[1]:Nd(c)[2])}/**
     * @param withoutSuffix boolean true = a length of time; false = before/after a period of time.
     */
function Pd(a,b,c){return c?b%10===1&&b%100!==11?a[2]:a[3]:b%10===1&&b%100!==11?a[0]:a[1]}function Qd(a,b,c){return a+" "+Pd(Xg[c],a,b)}function Rd(a,b,c){return Pd(Xg[c],a,b)}function Sd(a,b){return b?"dažas sekundes":"dažām sekundēm"}function Td(a,b,c,d){var e="";if(b)switch(c){case"s":e="काही सेकंद";break;case"m":e="एक मिनिट";break;case"mm":e="%d मिनिटे";break;case"h":e="एक तास";break;case"hh":e="%d तास";break;case"d":e="एक दिवस";break;case"dd":e="%d दिवस";break;case"M":e="एक महिना";break;case"MM":e="%d महिने";break;case"y":e="एक वर्ष";break;case"yy":e="%d वर्षे"}else switch(c){case"s":e="काही सेकंदां";break;case"m":e="एका मिनिटा";break;case"mm":e="%d मिनिटां";break;case"h":e="एका तासा";break;case"hh":e="%d तासां";break;case"d":e="एका दिवसा";break;case"dd":e="%d दिवसां";break;case"M":e="एका महिन्या";break;case"MM":e="%d महिन्यां";break;case"y":e="एका वर्षा";break;case"yy":e="%d वर्षां"}return e.replace(/%d/i,a)}function Ud(a){return 5>a%10&&a%10>1&&~~(a/10)%10!==1}function Vd(a,b,c){var d=a+" ";switch(c){case"m":return b?"minuta":"minutę";case"mm":return d+(Ud(a)?"minuty":"minut");case"h":return b?"godzina":"godzinę";case"hh":return d+(Ud(a)?"godziny":"godzin");case"MM":return d+(Ud(a)?"miesiące":"miesięcy");case"yy":return d+(Ud(a)?"lata":"lat")}}function Wd(a,b,c){var d={mm:"minute",hh:"ore",dd:"zile",MM:"luni",yy:"ani"},e=" ";return(a%100>=20||a>=100&&a%100===0)&&(e=" de "),a+e+d[c]}function Xd(a,b){var c=a.split("_");return b%10===1&&b%100!==11?c[0]:b%10>=2&&4>=b%10&&(10>b%100||b%100>=20)?c[1]:c[2]}function Yd(a,b,c){var d={mm:b?"минута_минуты_минут":"минуту_минуты_минут",hh:"час_часа_часов",dd:"день_дня_дней",MM:"месяц_месяца_месяцев",yy:"год_года_лет"};return"m"===c?b?"минута":"минуту":a+" "+Xd(d[c],+a)}function Zd(a){return a>1&&5>a}function $d(a,b,c,d){var e=a+" ";switch(c){case"s":// a few seconds / in a few seconds / a few seconds ago
return b||d?"pár sekúnd":"pár sekundami";case"m":// a minute / in a minute / a minute ago
return b?"minúta":d?"minútu":"minútou";case"mm":// 9 minutes / in 9 minutes / 9 minutes ago
// 9 minutes / in 9 minutes / 9 minutes ago
return b||d?e+(Zd(a)?"minúty":"minút"):e+"minútami";break;case"h":// an hour / in an hour / an hour ago
return b?"hodina":d?"hodinu":"hodinou";case"hh":// 9 hours / in 9 hours / 9 hours ago
// 9 hours / in 9 hours / 9 hours ago
return b||d?e+(Zd(a)?"hodiny":"hodín"):e+"hodinami";break;case"d":// a day / in a day / a day ago
return b||d?"deň":"dňom";case"dd":// 9 days / in 9 days / 9 days ago
// 9 days / in 9 days / 9 days ago
return b||d?e+(Zd(a)?"dni":"dní"):e+"dňami";break;case"M":// a month / in a month / a month ago
return b||d?"mesiac":"mesiacom";case"MM":// 9 months / in 9 months / 9 months ago
// 9 months / in 9 months / 9 months ago
return b||d?e+(Zd(a)?"mesiace":"mesiacov"):e+"mesiacmi";break;case"y":// a year / in a year / a year ago
return b||d?"rok":"rokom";case"yy":// 9 years / in 9 years / 9 years ago
// 9 years / in 9 years / 9 years ago
return b||d?e+(Zd(a)?"roky":"rokov"):e+"rokmi"}}function _d(a,b,c,d){var e=a+" ";switch(c){case"s":return b||d?"nekaj sekund":"nekaj sekundami";case"m":return b?"ena minuta":"eno minuto";case"mm":return e+=1===a?b?"minuta":"minuto":2===a?b||d?"minuti":"minutama":5>a?b||d?"minute":"minutami":b||d?"minut":"minutami";case"h":return b?"ena ura":"eno uro";case"hh":return e+=1===a?b?"ura":"uro":2===a?b||d?"uri":"urama":5>a?b||d?"ure":"urami":b||d?"ur":"urami";case"d":return b||d?"en dan":"enim dnem";case"dd":return e+=1===a?b||d?"dan":"dnem":2===a?b||d?"dni":"dnevoma":b||d?"dni":"dnevi";case"M":return b||d?"en mesec":"enim mesecem";case"MM":return e+=1===a?b||d?"mesec":"mesecem":2===a?b||d?"meseca":"mesecema":5>a?b||d?"mesece":"meseci":b||d?"mesecev":"meseci";case"y":return b||d?"eno leto":"enim letom";case"yy":return e+=1===a?b||d?"leto":"letom":2===a?b||d?"leti":"letoma":5>a?b||d?"leta":"leti":b||d?"let":"leti"}}function ae(a){var b=a;return b=-1!==a.indexOf("jaj")?b.slice(0,-3)+"leS":-1!==a.indexOf("jar")?b.slice(0,-3)+"waQ":-1!==a.indexOf("DIS")?b.slice(0,-3)+"nem":b+" pIq"}function be(a){var b=a;return b=-1!==a.indexOf("jaj")?b.slice(0,-3)+"Hu’":-1!==a.indexOf("jar")?b.slice(0,-3)+"wen":-1!==a.indexOf("DIS")?b.slice(0,-3)+"ben":b+" ret"}function ce(a,b,c,d){var e=de(a);switch(c){case"mm":return e+" tup";case"hh":return e+" rep";case"dd":return e+" jaj";case"MM":return e+" jar";case"yy":return e+" DIS"}}function de(a){var b=Math.floor(a%1e3/100),c=Math.floor(a%100/10),d=a%10,e="";return b>0&&(e+=qh[b]+"vatlh"),c>0&&(e+=(""!==e?" ":"")+qh[c]+"maH"),d>0&&(e+=(""!==e?" ":"")+qh[d]),""===e?"pagh":e}function ee(a,b,c,d){var e={s:["viensas secunds","'iensas secunds"],m:["'n míut","'iens míut"],mm:[a+" míuts",""+a+" míuts"],h:["'n þora","'iensa þora"],hh:[a+" þoras",""+a+" þoras"],d:["'n ziua","'iensa ziua"],dd:[a+" ziuas",""+a+" ziuas"],M:["'n mes","'iens mes"],MM:[a+" mesen",""+a+" mesen"],y:["'n ar","'iens ar"],yy:[a+" ars",""+a+" ars"]};return d?e[c][0]:b?e[c][0]:e[c][1]}function fe(a,b){var c=a.split("_");return b%10===1&&b%100!==11?c[0]:b%10>=2&&4>=b%10&&(10>b%100||b%100>=20)?c[1]:c[2]}function ge(a,b,c){var d={mm:b?"хвилина_хвилини_хвилин":"хвилину_хвилини_хвилин",hh:b?"година_години_годин":"годину_години_годин",dd:"день_дні_днів",MM:"місяць_місяці_місяців",yy:"рік_роки_років"};return"m"===c?b?"хвилина":"хвилину":"h"===c?b?"година":"годину":a+" "+fe(d[c],+a)}function he(a,b){var c={nominative:"неділя_понеділок_вівторок_середа_четвер_п’ятниця_субота".split("_"),accusative:"неділю_понеділок_вівторок_середу_четвер_п’ятницю_суботу".split("_"),genitive:"неділі_понеділка_вівторка_середи_четверга_п’ятниці_суботи".split("_")},d=/(\[[ВвУу]\]) ?dddd/.test(b)?"accusative":/\[?(?:минулої|наступної)? ?\] ?dddd/.test(b)?"genitive":"nominative";return c[d][a.day()]}function ie(a){return function(){return a+"о"+(11===this.hours()?"б":"")+"] LT"}}var je,ke;ke=Array.prototype.some?Array.prototype.some:function(a){for(var b=Object(this),c=b.length>>>0,d=0;c>d;d++)if(d in b&&a.call(this,b[d],d,b))return!0;return!1};
// Plugins that add properties should also add the key here (null value),
// so we can properly clone ourselves.
var le=a.momentProperties=[],me=!1,ne={};a.suppressDeprecationWarnings=!1,a.deprecationHandler=null;var oe;oe=Object.keys?Object.keys:function(a){var b,c=[];for(b in a)h(a,b)&&c.push(b);return c};var pe,qe={sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},re={LTS:"h:mm:ss A",LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY h:mm A",LLLL:"dddd, MMMM D, YYYY h:mm A"},se="Invalid date",te="%d",ue=/\d{1,2}/,ve={future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},we={},xe={},ye=/(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g,ze=/(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,Ae={},Be={},Ce=/\d/,De=/\d\d/,Ee=/\d{3}/,Fe=/\d{4}/,Ge=/[+-]?\d{6}/,He=/\d\d?/,Ie=/\d\d\d\d?/,Je=/\d\d\d\d\d\d?/,Ke=/\d{1,3}/,Le=/\d{1,4}/,Me=/[+-]?\d{1,6}/,Ne=/\d+/,Oe=/[+-]?\d+/,Pe=/Z|[+-]\d\d:?\d\d/gi,Qe=/Z|[+-]\d\d(?::?\d\d)?/gi,Re=/[+-]?\d+(\.\d{1,3})?/,Se=/[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i,Te={},Ue={},Ve=0,We=1,Xe=2,Ye=3,Ze=4,$e=5,_e=6,af=7,bf=8;pe=Array.prototype.indexOf?Array.prototype.indexOf:function(a){
// I know
var b;for(b=0;b<this.length;++b)if(this[b]===a)return b;return-1},T("M",["MM",2],"Mo",function(){return this.month()+1}),T("MMM",0,0,function(a){return this.localeData().monthsShort(this,a)}),T("MMMM",0,0,function(a){return this.localeData().months(this,a)}),I("month","M"),L("month",8),Y("M",He),Y("MM",He,De),Y("MMM",function(a,b){return b.monthsShortRegex(a)}),Y("MMMM",function(a,b){return b.monthsRegex(a)}),aa(["M","MM"],function(a,b){b[We]=t(a)-1}),aa(["MMM","MMMM"],function(a,b,c,d){var e=c._locale.monthsParse(a,d,c._strict);null!=e?b[We]=e:l(c).invalidMonth=a});
// LOCALES
var cf=/D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/,df="January_February_March_April_May_June_July_August_September_October_November_December".split("_"),ef="Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),ff=Se,gf=Se;
// FORMATTING
T("Y",0,0,function(){var a=this.year();return 9999>=a?""+a:"+"+a}),T(0,["YY",2],0,function(){return this.year()%100}),T(0,["YYYY",4],0,"year"),T(0,["YYYYY",5],0,"year"),T(0,["YYYYYY",6,!0],0,"year"),
// ALIASES
I("year","y"),
// PRIORITIES
L("year",1),
// PARSING
Y("Y",Oe),Y("YY",He,De),Y("YYYY",Le,Fe),Y("YYYYY",Me,Ge),Y("YYYYYY",Me,Ge),aa(["YYYYY","YYYYYY"],Ve),aa("YYYY",function(b,c){c[Ve]=2===b.length?a.parseTwoDigitYear(b):t(b)}),aa("YY",function(b,c){c[Ve]=a.parseTwoDigitYear(b)}),aa("Y",function(a,b){b[Ve]=parseInt(a,10)}),
// HOOKS
a.parseTwoDigitYear=function(a){return t(a)+(t(a)>68?1900:2e3)};
// MOMENTS
var hf=N("FullYear",!0);
// FORMATTING
T("w",["ww",2],"wo","week"),T("W",["WW",2],"Wo","isoWeek"),
// ALIASES
I("week","w"),I("isoWeek","W"),
// PRIORITIES
L("week",5),L("isoWeek",5),
// PARSING
Y("w",He),Y("ww",He,De),Y("W",He),Y("WW",He,De),ba(["w","ww","W","WW"],function(a,b,c,d){b[d.substr(0,1)]=t(a)});var jf={dow:0,// Sunday is the first day of the week.
doy:6};
// FORMATTING
T("d",0,"do","day"),T("dd",0,0,function(a){return this.localeData().weekdaysMin(this,a)}),T("ddd",0,0,function(a){return this.localeData().weekdaysShort(this,a)}),T("dddd",0,0,function(a){return this.localeData().weekdays(this,a)}),T("e",0,0,"weekday"),T("E",0,0,"isoWeekday"),
// ALIASES
I("day","d"),I("weekday","e"),I("isoWeekday","E"),
// PRIORITY
L("day",11),L("weekday",11),L("isoWeekday",11),
// PARSING
Y("d",He),Y("e",He),Y("E",He),Y("dd",function(a,b){return b.weekdaysMinRegex(a)}),Y("ddd",function(a,b){return b.weekdaysShortRegex(a)}),Y("dddd",function(a,b){return b.weekdaysRegex(a)}),ba(["dd","ddd","dddd"],function(a,b,c,d){var e=c._locale.weekdaysParse(a,d,c._strict);
// if we didn't get a weekday name, mark the date as invalid
null!=e?b.d=e:l(c).invalidWeekday=a}),ba(["d","e","E"],function(a,b,c,d){b[d]=t(a)});
// LOCALES
var kf="Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),lf="Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),mf="Su_Mo_Tu_We_Th_Fr_Sa".split("_"),nf=Se,of=Se,pf=Se;T("H",["HH",2],0,"hour"),T("h",["hh",2],0,Qa),T("k",["kk",2],0,Ra),T("hmm",0,0,function(){return""+Qa.apply(this)+S(this.minutes(),2)}),T("hmmss",0,0,function(){return""+Qa.apply(this)+S(this.minutes(),2)+S(this.seconds(),2)}),T("Hmm",0,0,function(){return""+this.hours()+S(this.minutes(),2)}),T("Hmmss",0,0,function(){return""+this.hours()+S(this.minutes(),2)+S(this.seconds(),2)}),Sa("a",!0),Sa("A",!1),
// ALIASES
I("hour","h"),
// PRIORITY
L("hour",13),Y("a",Ta),Y("A",Ta),Y("H",He),Y("h",He),Y("HH",He,De),Y("hh",He,De),Y("hmm",Ie),Y("hmmss",Je),Y("Hmm",Ie),Y("Hmmss",Je),aa(["H","HH"],Ye),aa(["a","A"],function(a,b,c){c._isPm=c._locale.isPM(a),c._meridiem=a}),aa(["h","hh"],function(a,b,c){b[Ye]=t(a),l(c).bigHour=!0}),aa("hmm",function(a,b,c){var d=a.length-2;b[Ye]=t(a.substr(0,d)),b[Ze]=t(a.substr(d)),l(c).bigHour=!0}),aa("hmmss",function(a,b,c){var d=a.length-4,e=a.length-2;b[Ye]=t(a.substr(0,d)),b[Ze]=t(a.substr(d,2)),b[$e]=t(a.substr(e)),l(c).bigHour=!0}),aa("Hmm",function(a,b,c){var d=a.length-2;b[Ye]=t(a.substr(0,d)),b[Ze]=t(a.substr(d))}),aa("Hmmss",function(a,b,c){var d=a.length-4,e=a.length-2;b[Ye]=t(a.substr(0,d)),b[Ze]=t(a.substr(d,2)),b[$e]=t(a.substr(e))});var qf,rf=/[ap]\.?m?\.?/i,sf=N("Hours",!0),tf={calendar:qe,longDateFormat:re,invalidDate:se,ordinal:te,ordinalParse:ue,relativeTime:ve,months:df,monthsShort:ef,week:jf,weekdays:kf,weekdaysMin:mf,weekdaysShort:lf,meridiemParse:rf},uf={},vf=/^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?/,wf=/^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?/,xf=/Z|[+-]\d\d(?::?\d\d)?/,yf=[["YYYYYY-MM-DD",/[+-]\d{6}-\d\d-\d\d/],["YYYY-MM-DD",/\d{4}-\d\d-\d\d/],["GGGG-[W]WW-E",/\d{4}-W\d\d-\d/],["GGGG-[W]WW",/\d{4}-W\d\d/,!1],["YYYY-DDD",/\d{4}-\d{3}/],["YYYY-MM",/\d{4}-\d\d/,!1],["YYYYYYMMDD",/[+-]\d{10}/],["YYYYMMDD",/\d{8}/],
// YYYYMM is NOT allowed by the standard
["GGGG[W]WWE",/\d{4}W\d{3}/],["GGGG[W]WW",/\d{4}W\d{2}/,!1],["YYYYDDD",/\d{7}/]],zf=[["HH:mm:ss.SSSS",/\d\d:\d\d:\d\d\.\d+/],["HH:mm:ss,SSSS",/\d\d:\d\d:\d\d,\d+/],["HH:mm:ss",/\d\d:\d\d:\d\d/],["HH:mm",/\d\d:\d\d/],["HHmmss.SSSS",/\d\d\d\d\d\d\.\d+/],["HHmmss,SSSS",/\d\d\d\d\d\d,\d+/],["HHmmss",/\d\d\d\d\d\d/],["HHmm",/\d\d\d\d/],["HH",/\d\d/]],Af=/^\/?Date\((\-?\d+)/i;a.createFromInputFallback=w("moment construction falls back to js Date. This is discouraged and will be removed in upcoming major release. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.",function(a){a._d=new Date(a._i+(a._useUTC?" UTC":""))}),
// constant that refers to the ISO standard
a.ISO_8601=function(){};var Bf=w("moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/",function(){var a=rb.apply(null,arguments);return this.isValid()&&a.isValid()?this>a?this:a:n()}),Cf=w("moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/",function(){var a=rb.apply(null,arguments);return this.isValid()&&a.isValid()?a>this?this:a:n()}),Df=function(){return Date.now?Date.now():+new Date};xb("Z",":"),xb("ZZ",""),
// PARSING
Y("Z",Qe),Y("ZZ",Qe),aa(["Z","ZZ"],function(a,b,c){c._useUTC=!0,c._tzm=yb(Qe,a)});
// HELPERS
// timezone chunker
// '+10:00' > ['10',  '00']
// '-1530'  > ['-15', '30']
var Ef=/([\+\-]|\d\d)/gi;
// HOOKS
// This function will be called whenever a moment is mutated.
// It is intended to keep the offset in sync with the timezone.
a.updateOffset=function(){};
// ASP.NET json date format regex
var Ff=/^(\-)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?\d*)?$/,Gf=/^(-)?P(?:(-?[0-9,.]*)Y)?(?:(-?[0-9,.]*)M)?(?:(-?[0-9,.]*)W)?(?:(-?[0-9,.]*)D)?(?:T(?:(-?[0-9,.]*)H)?(?:(-?[0-9,.]*)M)?(?:(-?[0-9,.]*)S)?)?$/;Mb.fn=vb.prototype;var Hf=Rb(1,"add"),If=Rb(-1,"subtract");a.defaultFormat="YYYY-MM-DDTHH:mm:ssZ",a.defaultFormatUtc="YYYY-MM-DDTHH:mm:ss[Z]";var Jf=w("moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.",function(a){return void 0===a?this.localeData():this.locale(a)});
// FORMATTING
T(0,["gg",2],0,function(){return this.weekYear()%100}),T(0,["GG",2],0,function(){return this.isoWeekYear()%100}),xc("gggg","weekYear"),xc("ggggg","weekYear"),xc("GGGG","isoWeekYear"),xc("GGGGG","isoWeekYear"),
// ALIASES
I("weekYear","gg"),I("isoWeekYear","GG"),
// PRIORITY
L("weekYear",1),L("isoWeekYear",1),
// PARSING
Y("G",Oe),Y("g",Oe),Y("GG",He,De),Y("gg",He,De),Y("GGGG",Le,Fe),Y("gggg",Le,Fe),Y("GGGGG",Me,Ge),Y("ggggg",Me,Ge),ba(["gggg","ggggg","GGGG","GGGGG"],function(a,b,c,d){b[d.substr(0,2)]=t(a)}),ba(["gg","GG"],function(b,c,d,e){c[e]=a.parseTwoDigitYear(b)}),
// FORMATTING
T("Q",0,"Qo","quarter"),
// ALIASES
I("quarter","Q"),
// PRIORITY
L("quarter",7),
// PARSING
Y("Q",Ce),aa("Q",function(a,b){b[We]=3*(t(a)-1)}),
// FORMATTING
T("D",["DD",2],"Do","date"),
// ALIASES
I("date","D"),
// PRIOROITY
L("date",9),
// PARSING
Y("D",He),Y("DD",He,De),Y("Do",function(a,b){return a?b._ordinalParse:b._ordinalParseLenient}),aa(["D","DD"],Xe),aa("Do",function(a,b){b[Xe]=t(a.match(He)[0],10)});
// MOMENTS
var Kf=N("Date",!0);
// FORMATTING
T("DDD",["DDDD",3],"DDDo","dayOfYear"),
// ALIASES
I("dayOfYear","DDD"),
// PRIORITY
L("dayOfYear",4),
// PARSING
Y("DDD",Ke),Y("DDDD",Ee),aa(["DDD","DDDD"],function(a,b,c){c._dayOfYear=t(a)}),
// FORMATTING
T("m",["mm",2],0,"minute"),
// ALIASES
I("minute","m"),
// PRIORITY
L("minute",14),
// PARSING
Y("m",He),Y("mm",He,De),aa(["m","mm"],Ze);
// MOMENTS
var Lf=N("Minutes",!1);
// FORMATTING
T("s",["ss",2],0,"second"),
// ALIASES
I("second","s"),
// PRIORITY
L("second",15),
// PARSING
Y("s",He),Y("ss",He,De),aa(["s","ss"],$e);
// MOMENTS
var Mf=N("Seconds",!1);
// FORMATTING
T("S",0,0,function(){return~~(this.millisecond()/100)}),T(0,["SS",2],0,function(){return~~(this.millisecond()/10)}),T(0,["SSS",3],0,"millisecond"),T(0,["SSSS",4],0,function(){return 10*this.millisecond()}),T(0,["SSSSS",5],0,function(){return 100*this.millisecond()}),T(0,["SSSSSS",6],0,function(){return 1e3*this.millisecond()}),T(0,["SSSSSSS",7],0,function(){return 1e4*this.millisecond()}),T(0,["SSSSSSSS",8],0,function(){return 1e5*this.millisecond()}),T(0,["SSSSSSSSS",9],0,function(){return 1e6*this.millisecond()}),
// ALIASES
I("millisecond","ms"),
// PRIORITY
L("millisecond",16),
// PARSING
Y("S",Ke,Ce),Y("SS",Ke,De),Y("SSS",Ke,Ee);var Nf;for(Nf="SSSS";Nf.length<=9;Nf+="S")Y(Nf,Ne);for(Nf="S";Nf.length<=9;Nf+="S")aa(Nf,Gc);
// MOMENTS
var Of=N("Milliseconds",!1);
// FORMATTING
T("z",0,0,"zoneAbbr"),T("zz",0,0,"zoneName");var Pf=q.prototype;Pf.add=Hf,Pf.calendar=Ub,Pf.clone=Vb,Pf.diff=ac,Pf.endOf=mc,Pf.format=ec,Pf.from=fc,Pf.fromNow=gc,Pf.to=hc,Pf.toNow=ic,Pf.get=Q,Pf.invalidAt=vc,Pf.isAfter=Wb,Pf.isBefore=Xb,Pf.isBetween=Yb,Pf.isSame=Zb,Pf.isSameOrAfter=$b,Pf.isSameOrBefore=_b,Pf.isValid=tc,Pf.lang=Jf,Pf.locale=jc,Pf.localeData=kc,Pf.max=Cf,Pf.min=Bf,Pf.parsingFlags=uc,Pf.set=R,Pf.startOf=lc,Pf.subtract=If,Pf.toArray=qc,Pf.toObject=rc,Pf.toDate=pc,Pf.toISOString=dc,Pf.toJSON=sc,Pf.toString=cc,Pf.unix=oc,Pf.valueOf=nc,Pf.creationData=wc,
// Year
Pf.year=hf,Pf.isLeapYear=qa,
// Week Year
Pf.weekYear=yc,Pf.isoWeekYear=zc,
// Quarter
Pf.quarter=Pf.quarters=Ec,
// Month
Pf.month=ja,Pf.daysInMonth=ka,
// Week
Pf.week=Pf.weeks=Aa,Pf.isoWeek=Pf.isoWeeks=Ba,Pf.weeksInYear=Bc,Pf.isoWeeksInYear=Ac,
// Day
Pf.date=Kf,Pf.day=Pf.days=Ja,Pf.weekday=Ka,Pf.isoWeekday=La,Pf.dayOfYear=Fc,
// Hour
Pf.hour=Pf.hours=sf,
// Minute
Pf.minute=Pf.minutes=Lf,
// Second
Pf.second=Pf.seconds=Mf,
// Millisecond
Pf.millisecond=Pf.milliseconds=Of,
// Offset
Pf.utcOffset=Bb,Pf.utc=Db,Pf.local=Eb,Pf.parseZone=Fb,Pf.hasAlignedHourOffset=Gb,Pf.isDST=Hb,Pf.isLocal=Jb,Pf.isUtcOffset=Kb,Pf.isUtc=Lb,Pf.isUTC=Lb,
// Timezone
Pf.zoneAbbr=Hc,Pf.zoneName=Ic,
// Deprecations
Pf.dates=w("dates accessor is deprecated. Use date instead.",Kf),Pf.months=w("months accessor is deprecated. Use month instead",ja),Pf.years=w("years accessor is deprecated. Use year instead",hf),Pf.zone=w("moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/",Cb),Pf.isDSTShifted=w("isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information",Ib);var Qf=Pf,Rf=B.prototype;Rf.calendar=C,Rf.longDateFormat=D,Rf.invalidDate=E,Rf.ordinal=F,Rf.preparse=Lc,Rf.postformat=Lc,Rf.relativeTime=G,Rf.pastFuture=H,Rf.set=z,
// Month
Rf.months=ea,Rf.monthsShort=fa,Rf.monthsParse=ha,Rf.monthsRegex=ma,Rf.monthsShortRegex=la,
// Week
Rf.week=xa,Rf.firstDayOfYear=za,Rf.firstDayOfWeek=ya,
// Day of Week
Rf.weekdays=Ea,Rf.weekdaysMin=Ga,Rf.weekdaysShort=Fa,Rf.weekdaysParse=Ia,Rf.weekdaysRegex=Ma,Rf.weekdaysShortRegex=Na,Rf.weekdaysMinRegex=Oa,
// Hours
Rf.isPM=Ua,Rf.meridiem=Va,Za("en",{ordinalParse:/\d{1,2}(th|st|nd|rd)/,ordinal:function(a){var b=a%10,c=1===t(a%100/10)?"th":1===b?"st":2===b?"nd":3===b?"rd":"th";return a+c}}),
// Side effect imports
a.lang=w("moment.lang is deprecated. Use moment.locale instead.",Za),a.langData=w("moment.langData is deprecated. Use moment.localeData instead.",ab);var Sf=Math.abs,Tf=cd("ms"),Uf=cd("s"),Vf=cd("m"),Wf=cd("h"),Xf=cd("d"),Yf=cd("w"),Zf=cd("M"),$f=cd("y"),_f=ed("milliseconds"),ag=ed("seconds"),bg=ed("minutes"),cg=ed("hours"),dg=ed("days"),eg=ed("months"),fg=ed("years"),gg=Math.round,hg={s:45,// seconds to minute
m:45,// minutes to hour
h:22,// hours to day
d:26,// days to month
M:11},ig=Math.abs,jg=vb.prototype;jg.abs=Uc,jg.add=Wc,jg.subtract=Xc,jg.as=ad,jg.asMilliseconds=Tf,jg.asSeconds=Uf,jg.asMinutes=Vf,jg.asHours=Wf,jg.asDays=Xf,jg.asWeeks=Yf,jg.asMonths=Zf,jg.asYears=$f,jg.valueOf=bd,jg._bubble=Zc,jg.get=dd,jg.milliseconds=_f,jg.seconds=ag,jg.minutes=bg,jg.hours=cg,jg.days=dg,jg.weeks=fd,jg.months=eg,jg.years=fg,jg.humanize=kd,jg.toISOString=ld,jg.toString=ld,jg.toJSON=ld,jg.locale=jc,jg.localeData=kc,
// Deprecations
jg.toIsoString=w("toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)",ld),jg.lang=Jf,
// Side effect imports
// FORMATTING
T("X",0,0,"unix"),T("x",0,0,"valueOf"),
// PARSING
Y("x",Oe),Y("X",Re),aa("X",function(a,b,c){c._d=new Date(1e3*parseFloat(a,10))}),aa("x",function(a,b,c){c._d=new Date(t(a))}),a.version="2.14.1",b(rb),a.fn=Qf,a.min=tb,a.max=ub,a.now=Df,a.utc=j,a.unix=Jc,a.months=Pc,a.isDate=f,a.locale=Za,a.invalid=n,a.duration=Mb,a.isMoment=r,a.weekdays=Rc,a.parseZone=Kc,a.localeData=ab,a.isDuration=wb,a.monthsShort=Qc,a.weekdaysMin=Tc,a.defineLocale=$a,a.updateLocale=_a,a.locales=bb,a.weekdaysShort=Sc,a.normalizeUnits=J,a.relativeTimeRounding=id,a.relativeTimeThreshold=jd,a.calendarFormat=Tb,a.prototype=Qf;var kg=a,lg=(kg.defineLocale("af",{months:"Januarie_Februarie_Maart_April_Mei_Junie_Julie_Augustus_September_Oktober_November_Desember".split("_"),monthsShort:"Jan_Feb_Mrt_Apr_Mei_Jun_Jul_Aug_Sep_Okt_Nov_Des".split("_"),weekdays:"Sondag_Maandag_Dinsdag_Woensdag_Donderdag_Vrydag_Saterdag".split("_"),weekdaysShort:"Son_Maa_Din_Woe_Don_Vry_Sat".split("_"),weekdaysMin:"So_Ma_Di_Wo_Do_Vr_Sa".split("_"),meridiemParse:/vm|nm/i,isPM:function(a){return/^nm$/i.test(a)},meridiem:function(a,b,c){return 12>a?c?"vm":"VM":c?"nm":"NM"},longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[Vandag om] LT",nextDay:"[Môre om] LT",nextWeek:"dddd [om] LT",lastDay:"[Gister om] LT",lastWeek:"[Laas] dddd [om] LT",sameElse:"L"},relativeTime:{future:"oor %s",past:"%s gelede",s:"'n paar sekondes",m:"'n minuut",mm:"%d minute",h:"'n uur",hh:"%d ure",d:"'n dag",dd:"%d dae",M:"'n maand",MM:"%d maande",y:"'n jaar",yy:"%d jaar"},ordinalParse:/\d{1,2}(ste|de)/,ordinal:function(a){return a+(1===a||8===a||a>=20?"ste":"de")},week:{dow:1,// Maandag is die eerste dag van die week.
doy:4}}),kg.defineLocale("ar-ma",{months:"يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر".split("_"),monthsShort:"يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر".split("_"),weekdays:"الأحد_الإتنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),weekdaysShort:"احد_اتنين_ثلاثاء_اربعاء_خميس_جمعة_سبت".split("_"),weekdaysMin:"ح_ن_ث_ر_خ_ج_س".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[اليوم على الساعة] LT",nextDay:"[غدا على الساعة] LT",nextWeek:"dddd [على الساعة] LT",lastDay:"[أمس على الساعة] LT",lastWeek:"dddd [على الساعة] LT",sameElse:"L"},relativeTime:{future:"في %s",past:"منذ %s",s:"ثوان",m:"دقيقة",mm:"%d دقائق",h:"ساعة",hh:"%d ساعات",d:"يوم",dd:"%d أيام",M:"شهر",MM:"%d أشهر",y:"سنة",yy:"%d سنوات"},week:{dow:6,// Saturday is the first day of the week.
doy:12}}),{1:"١",2:"٢",3:"٣",4:"٤",5:"٥",6:"٦",7:"٧",8:"٨",9:"٩",0:"٠"}),mg={"١":"1","٢":"2","٣":"3","٤":"4","٥":"5","٦":"6","٧":"7","٨":"8","٩":"9","٠":"0"},ng=(kg.defineLocale("ar-sa",{months:"يناير_فبراير_مارس_أبريل_مايو_يونيو_يوليو_أغسطس_سبتمبر_أكتوبر_نوفمبر_ديسمبر".split("_"),monthsShort:"يناير_فبراير_مارس_أبريل_مايو_يونيو_يوليو_أغسطس_سبتمبر_أكتوبر_نوفمبر_ديسمبر".split("_"),weekdays:"الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),weekdaysShort:"أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت".split("_"),weekdaysMin:"ح_ن_ث_ر_خ_ج_س".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},meridiemParse:/ص|م/,isPM:function(a){return"م"===a},meridiem:function(a,b,c){return 12>a?"ص":"م"},calendar:{sameDay:"[اليوم على الساعة] LT",nextDay:"[غدا على الساعة] LT",nextWeek:"dddd [على الساعة] LT",lastDay:"[أمس على الساعة] LT",lastWeek:"dddd [على الساعة] LT",sameElse:"L"},relativeTime:{future:"في %s",past:"منذ %s",s:"ثوان",m:"دقيقة",mm:"%d دقائق",h:"ساعة",hh:"%d ساعات",d:"يوم",dd:"%d أيام",M:"شهر",MM:"%d أشهر",y:"سنة",yy:"%d سنوات"},preparse:function(a){return a.replace(/[١٢٣٤٥٦٧٨٩٠]/g,function(a){return mg[a]}).replace(/،/g,",")},postformat:function(a){return a.replace(/\d/g,function(a){return lg[a]}).replace(/,/g,"،")},week:{dow:6,// Saturday is the first day of the week.
doy:12}}),kg.defineLocale("ar-tn",{months:"جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر".split("_"),monthsShort:"جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر".split("_"),weekdays:"الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),weekdaysShort:"أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت".split("_"),weekdaysMin:"ح_ن_ث_ر_خ_ج_س".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[اليوم على الساعة] LT",nextDay:"[غدا على الساعة] LT",nextWeek:"dddd [على الساعة] LT",lastDay:"[أمس على الساعة] LT",lastWeek:"dddd [على الساعة] LT",sameElse:"L"},relativeTime:{future:"في %s",past:"منذ %s",s:"ثوان",m:"دقيقة",mm:"%d دقائق",h:"ساعة",hh:"%d ساعات",d:"يوم",dd:"%d أيام",M:"شهر",MM:"%d أشهر",y:"سنة",yy:"%d سنوات"},week:{dow:1,// Monday is the first day of the week.
doy:4}}),{1:"١",2:"٢",3:"٣",4:"٤",5:"٥",6:"٦",7:"٧",8:"٨",9:"٩",0:"٠"}),og={"١":"1","٢":"2","٣":"3","٤":"4","٥":"5","٦":"6","٧":"7","٨":"8","٩":"9","٠":"0"},pg=function(a){return 0===a?0:1===a?1:2===a?2:a%100>=3&&10>=a%100?3:a%100>=11?4:5},qg={s:["أقل من ثانية","ثانية واحدة",["ثانيتان","ثانيتين"],"%d ثوان","%d ثانية","%d ثانية"],m:["أقل من دقيقة","دقيقة واحدة",["دقيقتان","دقيقتين"],"%d دقائق","%d دقيقة","%d دقيقة"],h:["أقل من ساعة","ساعة واحدة",["ساعتان","ساعتين"],"%d ساعات","%d ساعة","%d ساعة"],d:["أقل من يوم","يوم واحد",["يومان","يومين"],"%d أيام","%d يومًا","%d يوم"],M:["أقل من شهر","شهر واحد",["شهران","شهرين"],"%d أشهر","%d شهرا","%d شهر"],y:["أقل من عام","عام واحد",["عامان","عامين"],"%d أعوام","%d عامًا","%d عام"]},rg=function(a){return function(b,c,d,e){var f=pg(b),g=qg[a][pg(b)];return 2===f&&(g=g[c?0:1]),g.replace(/%d/i,b)}},sg=["كانون الثاني يناير","شباط فبراير","آذار مارس","نيسان أبريل","أيار مايو","حزيران يونيو","تموز يوليو","آب أغسطس","أيلول سبتمبر","تشرين الأول أكتوبر","تشرين الثاني نوفمبر","كانون الأول ديسمبر"],tg=(kg.defineLocale("ar",{months:sg,monthsShort:sg,weekdays:"الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),weekdaysShort:"أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت".split("_"),weekdaysMin:"ح_ن_ث_ر_خ_ج_س".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"D/‏M/‏YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},meridiemParse:/ص|م/,isPM:function(a){return"م"===a},meridiem:function(a,b,c){return 12>a?"ص":"م"},calendar:{sameDay:"[اليوم عند الساعة] LT",nextDay:"[غدًا عند الساعة] LT",nextWeek:"dddd [عند الساعة] LT",lastDay:"[أمس عند الساعة] LT",lastWeek:"dddd [عند الساعة] LT",sameElse:"L"},relativeTime:{future:"بعد %s",past:"منذ %s",s:rg("s"),m:rg("m"),mm:rg("m"),h:rg("h"),hh:rg("h"),d:rg("d"),dd:rg("d"),M:rg("M"),MM:rg("M"),y:rg("y"),yy:rg("y")},preparse:function(a){return a.replace(/\u200f/g,"").replace(/[١٢٣٤٥٦٧٨٩٠]/g,function(a){return og[a]}).replace(/،/g,",")},postformat:function(a){return a.replace(/\d/g,function(a){return ng[a]}).replace(/,/g,"،")},week:{dow:6,// Saturday is the first day of the week.
doy:12}}),{1:"-inci",5:"-inci",8:"-inci",70:"-inci",80:"-inci",2:"-nci",7:"-nci",20:"-nci",50:"-nci",3:"-üncü",4:"-üncü",100:"-üncü",6:"-ncı",9:"-uncu",10:"-uncu",30:"-uncu",60:"-ıncı",90:"-ıncı"}),ug=(kg.defineLocale("az",{months:"yanvar_fevral_mart_aprel_may_iyun_iyul_avqust_sentyabr_oktyabr_noyabr_dekabr".split("_"),monthsShort:"yan_fev_mar_apr_may_iyn_iyl_avq_sen_okt_noy_dek".split("_"),weekdays:"Bazar_Bazar ertəsi_Çərşənbə axşamı_Çərşənbə_Cümə axşamı_Cümə_Şənbə".split("_"),weekdaysShort:"Baz_BzE_ÇAx_Çər_CAx_Cüm_Şən".split("_"),weekdaysMin:"Bz_BE_ÇA_Çə_CA_Cü_Şə".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[bugün saat] LT",nextDay:"[sabah saat] LT",nextWeek:"[gələn həftə] dddd [saat] LT",lastDay:"[dünən] LT",lastWeek:"[keçən həftə] dddd [saat] LT",sameElse:"L"},relativeTime:{future:"%s sonra",past:"%s əvvəl",s:"birneçə saniyyə",m:"bir dəqiqə",mm:"%d dəqiqə",h:"bir saat",hh:"%d saat",d:"bir gün",dd:"%d gün",M:"bir ay",MM:"%d ay",y:"bir il",yy:"%d il"},meridiemParse:/gecə|səhər|gündüz|axşam/,isPM:function(a){return/^(gündüz|axşam)$/.test(a)},meridiem:function(a,b,c){return 4>a?"gecə":12>a?"səhər":17>a?"gündüz":"axşam"},ordinalParse:/\d{1,2}-(ıncı|inci|nci|üncü|ncı|uncu)/,ordinal:function(a){if(0===a)// special case for zero
return a+"-ıncı";var b=a%10,c=a%100-b,d=a>=100?100:null;return a+(tg[b]||tg[c]||tg[d])},week:{dow:1,// Monday is the first day of the week.
doy:7}}),kg.defineLocale("be",{months:{format:"студзеня_лютага_сакавіка_красавіка_траўня_чэрвеня_ліпеня_жніўня_верасня_кастрычніка_лістапада_снежня".split("_"),standalone:"студзень_люты_сакавік_красавік_травень_чэрвень_ліпень_жнівень_верасень_кастрычнік_лістапад_снежань".split("_")},monthsShort:"студ_лют_сак_крас_трав_чэрв_ліп_жнів_вер_каст_ліст_снеж".split("_"),weekdays:{format:"нядзелю_панядзелак_аўторак_сераду_чацвер_пятніцу_суботу".split("_"),standalone:"нядзеля_панядзелак_аўторак_серада_чацвер_пятніца_субота".split("_"),isFormat:/\[ ?[Вв] ?(?:мінулую|наступную)? ?\] ?dddd/},weekdaysShort:"нд_пн_ат_ср_чц_пт_сб".split("_"),weekdaysMin:"нд_пн_ат_ср_чц_пт_сб".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY г.",LLL:"D MMMM YYYY г., HH:mm",LLLL:"dddd, D MMMM YYYY г., HH:mm"},calendar:{sameDay:"[Сёння ў] LT",nextDay:"[Заўтра ў] LT",lastDay:"[Учора ў] LT",nextWeek:function(){return"[У] dddd [ў] LT"},lastWeek:function(){switch(this.day()){case 0:case 3:case 5:case 6:return"[У мінулую] dddd [ў] LT";case 1:case 2:case 4:return"[У мінулы] dddd [ў] LT"}},sameElse:"L"},relativeTime:{future:"праз %s",past:"%s таму",s:"некалькі секунд",m:nd,mm:nd,h:nd,hh:nd,d:"дзень",dd:nd,M:"месяц",MM:nd,y:"год",yy:nd},meridiemParse:/ночы|раніцы|дня|вечара/,isPM:function(a){return/^(дня|вечара)$/.test(a)},meridiem:function(a,b,c){return 4>a?"ночы":12>a?"раніцы":17>a?"дня":"вечара"},ordinalParse:/\d{1,2}-(і|ы|га)/,ordinal:function(a,b){switch(b){case"M":case"d":case"DDD":case"w":case"W":return a%10!==2&&a%10!==3||a%100===12||a%100===13?a+"-ы":a+"-і";case"D":return a+"-га";default:return a}},week:{dow:1,// Monday is the first day of the week.
doy:7}}),kg.defineLocale("bg",{months:"януари_февруари_март_април_май_юни_юли_август_септември_октомври_ноември_декември".split("_"),monthsShort:"янр_фев_мар_апр_май_юни_юли_авг_сеп_окт_ное_дек".split("_"),weekdays:"неделя_понеделник_вторник_сряда_четвъртък_петък_събота".split("_"),weekdaysShort:"нед_пон_вто_сря_чет_пет_съб".split("_"),weekdaysMin:"нд_пн_вт_ср_чт_пт_сб".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"D.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY H:mm",LLLL:"dddd, D MMMM YYYY H:mm"},calendar:{sameDay:"[Днес в] LT",nextDay:"[Утре в] LT",nextWeek:"dddd [в] LT",lastDay:"[Вчера в] LT",lastWeek:function(){switch(this.day()){case 0:case 3:case 6:return"[В изминалата] dddd [в] LT";case 1:case 2:case 4:case 5:return"[В изминалия] dddd [в] LT"}},sameElse:"L"},relativeTime:{future:"след %s",past:"преди %s",s:"няколко секунди",m:"минута",mm:"%d минути",h:"час",hh:"%d часа",d:"ден",dd:"%d дни",M:"месец",MM:"%d месеца",y:"година",yy:"%d години"},ordinalParse:/\d{1,2}-(ев|ен|ти|ви|ри|ми)/,ordinal:function(a){var b=a%10,c=a%100;return 0===a?a+"-ев":0===c?a+"-ен":c>10&&20>c?a+"-ти":1===b?a+"-ви":2===b?a+"-ри":7===b||8===b?a+"-ми":a+"-ти"},week:{dow:1,// Monday is the first day of the week.
doy:7}}),{1:"১",2:"২",3:"৩",4:"৪",5:"৫",6:"৬",7:"৭",8:"৮",9:"৯",0:"০"}),vg={"১":"1","২":"2","৩":"3","৪":"4","৫":"5","৬":"6","৭":"7","৮":"8","৯":"9","০":"0"},wg=(kg.defineLocale("bn",{months:"জানুয়ারী_ফেবুয়ারী_মার্চ_এপ্রিল_মে_জুন_জুলাই_অগাস্ট_সেপ্টেম্বর_অক্টোবর_নভেম্বর_ডিসেম্বর".split("_"),monthsShort:"জানু_ফেব_মার্চ_এপর_মে_জুন_জুল_অগ_সেপ্ট_অক্টো_নভ_ডিসেম্".split("_"),weekdays:"রবিবার_সোমবার_মঙ্গলবার_বুধবার_বৃহস্পত্তিবার_শুক্রবার_শনিবার".split("_"),weekdaysShort:"রবি_সোম_মঙ্গল_বুধ_বৃহস্পত্তি_শুক্র_শনি".split("_"),weekdaysMin:"রব_সম_মঙ্গ_বু_ব্রিহ_শু_শনি".split("_"),longDateFormat:{LT:"A h:mm সময়",LTS:"A h:mm:ss সময়",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, A h:mm সময়",LLLL:"dddd, D MMMM YYYY, A h:mm সময়"},calendar:{sameDay:"[আজ] LT",nextDay:"[আগামীকাল] LT",nextWeek:"dddd, LT",lastDay:"[গতকাল] LT",lastWeek:"[গত] dddd, LT",sameElse:"L"},relativeTime:{future:"%s পরে",past:"%s আগে",s:"কয়েক সেকেন্ড",m:"এক মিনিট",mm:"%d মিনিট",h:"এক ঘন্টা",hh:"%d ঘন্টা",d:"এক দিন",dd:"%d দিন",M:"এক মাস",MM:"%d মাস",y:"এক বছর",yy:"%d বছর"},preparse:function(a){return a.replace(/[১২৩৪৫৬৭৮৯০]/g,function(a){return vg[a]})},postformat:function(a){return a.replace(/\d/g,function(a){return ug[a]})},meridiemParse:/রাত|সকাল|দুপুর|বিকাল|রাত/,meridiemHour:function(a,b){return 12===a&&(a=0),"রাত"===b&&a>=4||"দুপুর"===b&&5>a||"বিকাল"===b?a+12:a},meridiem:function(a,b,c){return 4>a?"রাত":10>a?"সকাল":17>a?"দুপুর":20>a?"বিকাল":"রাত"},week:{dow:0,// Sunday is the first day of the week.
doy:6}}),{1:"༡",2:"༢",3:"༣",4:"༤",5:"༥",6:"༦",7:"༧",8:"༨",9:"༩",0:"༠"}),xg={"༡":"1","༢":"2","༣":"3","༤":"4","༥":"5","༦":"6","༧":"7","༨":"8","༩":"9","༠":"0"},yg=(kg.defineLocale("bo",{months:"ཟླ་བ་དང་པོ_ཟླ་བ་གཉིས་པ_ཟླ་བ་གསུམ་པ_ཟླ་བ་བཞི་པ_ཟླ་བ་ལྔ་པ_ཟླ་བ་དྲུག་པ_ཟླ་བ་བདུན་པ_ཟླ་བ་བརྒྱད་པ_ཟླ་བ་དགུ་པ_ཟླ་བ་བཅུ་པ_ཟླ་བ་བཅུ་གཅིག་པ_ཟླ་བ་བཅུ་གཉིས་པ".split("_"),monthsShort:"ཟླ་བ་དང་པོ_ཟླ་བ་གཉིས་པ_ཟླ་བ་གསུམ་པ_ཟླ་བ་བཞི་པ_ཟླ་བ་ལྔ་པ_ཟླ་བ་དྲུག་པ_ཟླ་བ་བདུན་པ_ཟླ་བ་བརྒྱད་པ_ཟླ་བ་དགུ་པ_ཟླ་བ་བཅུ་པ_ཟླ་བ་བཅུ་གཅིག་པ_ཟླ་བ་བཅུ་གཉིས་པ".split("_"),weekdays:"གཟའ་ཉི་མ་_གཟའ་ཟླ་བ་_གཟའ་མིག་དམར་_གཟའ་ལྷག་པ་_གཟའ་ཕུར་བུ_གཟའ་པ་སངས་_གཟའ་སྤེན་པ་".split("_"),weekdaysShort:"ཉི་མ་_ཟླ་བ་_མིག་དམར་_ལྷག་པ་_ཕུར་བུ_པ་སངས་_སྤེན་པ་".split("_"),weekdaysMin:"ཉི་མ་_ཟླ་བ་_མིག་དམར་_ལྷག་པ་_ཕུར་བུ_པ་སངས་_སྤེན་པ་".split("_"),longDateFormat:{LT:"A h:mm",LTS:"A h:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, A h:mm",LLLL:"dddd, D MMMM YYYY, A h:mm"},calendar:{sameDay:"[དི་རིང] LT",nextDay:"[སང་ཉིན] LT",nextWeek:"[བདུན་ཕྲག་རྗེས་མ], LT",lastDay:"[ཁ་སང] LT",lastWeek:"[བདུན་ཕྲག་མཐའ་མ] dddd, LT",sameElse:"L"},relativeTime:{future:"%s ལ་",past:"%s སྔན་ལ",s:"ལམ་སང",m:"སྐར་མ་གཅིག",mm:"%d སྐར་མ",h:"ཆུ་ཚོད་གཅིག",hh:"%d ཆུ་ཚོད",d:"ཉིན་གཅིག",dd:"%d ཉིན་",M:"ཟླ་བ་གཅིག",MM:"%d ཟླ་བ",y:"ལོ་གཅིག",yy:"%d ལོ"},preparse:function(a){return a.replace(/[༡༢༣༤༥༦༧༨༩༠]/g,function(a){return xg[a]})},postformat:function(a){return a.replace(/\d/g,function(a){return wg[a]})},meridiemParse:/མཚན་མོ|ཞོགས་ཀས|ཉིན་གུང|དགོང་དག|མཚན་མོ/,meridiemHour:function(a,b){return 12===a&&(a=0),"མཚན་མོ"===b&&a>=4||"ཉིན་གུང"===b&&5>a||"དགོང་དག"===b?a+12:a},meridiem:function(a,b,c){return 4>a?"མཚན་མོ":10>a?"ཞོགས་ཀས":17>a?"ཉིན་གུང":20>a?"དགོང་དག":"མཚན་མོ"},week:{dow:0,// Sunday is the first day of the week.
doy:6}}),kg.defineLocale("br",{months:"Genver_C'hwevrer_Meurzh_Ebrel_Mae_Mezheven_Gouere_Eost_Gwengolo_Here_Du_Kerzu".split("_"),monthsShort:"Gen_C'hwe_Meu_Ebr_Mae_Eve_Gou_Eos_Gwe_Her_Du_Ker".split("_"),weekdays:"Sul_Lun_Meurzh_Merc'her_Yaou_Gwener_Sadorn".split("_"),weekdaysShort:"Sul_Lun_Meu_Mer_Yao_Gwe_Sad".split("_"),weekdaysMin:"Su_Lu_Me_Mer_Ya_Gw_Sa".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"h[e]mm A",LTS:"h[e]mm:ss A",L:"DD/MM/YYYY",LL:"D [a viz] MMMM YYYY",LLL:"D [a viz] MMMM YYYY h[e]mm A",LLLL:"dddd, D [a viz] MMMM YYYY h[e]mm A"},calendar:{sameDay:"[Hiziv da] LT",nextDay:"[Warc'hoazh da] LT",nextWeek:"dddd [da] LT",lastDay:"[Dec'h da] LT",lastWeek:"dddd [paset da] LT",sameElse:"L"},relativeTime:{future:"a-benn %s",past:"%s 'zo",s:"un nebeud segondennoù",m:"ur vunutenn",mm:od,h:"un eur",hh:"%d eur",d:"un devezh",dd:od,M:"ur miz",MM:od,y:"ur bloaz",yy:pd},ordinalParse:/\d{1,2}(añ|vet)/,ordinal:function(a){var b=1===a?"añ":"vet";return a+b},week:{dow:1,// Monday is the first day of the week.
doy:4}}),kg.defineLocale("bs",{months:"januar_februar_mart_april_maj_juni_juli_august_septembar_oktobar_novembar_decembar".split("_"),monthsShort:"jan._feb._mar._apr._maj._jun._jul._aug._sep._okt._nov._dec.".split("_"),monthsParseExact:!0,weekdays:"nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota".split("_"),weekdaysShort:"ned._pon._uto._sri._čet._pet._sub.".split("_"),weekdaysMin:"ne_po_ut_sr_če_pe_su".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD. MM. YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm",LLLL:"dddd, D. MMMM YYYY H:mm"},calendar:{sameDay:"[danas u] LT",nextDay:"[sutra u] LT",nextWeek:function(){switch(this.day()){case 0:return"[u] [nedjelju] [u] LT";case 3:return"[u] [srijedu] [u] LT";case 6:return"[u] [subotu] [u] LT";case 1:case 2:case 4:case 5:return"[u] dddd [u] LT"}},lastDay:"[jučer u] LT",lastWeek:function(){switch(this.day()){case 0:case 3:return"[prošlu] dddd [u] LT";case 6:return"[prošle] [subote] [u] LT";case 1:case 2:case 4:case 5:return"[prošli] dddd [u] LT"}},sameElse:"L"},relativeTime:{future:"za %s",past:"prije %s",s:"par sekundi",m:td,mm:td,h:td,hh:td,d:"dan",dd:td,M:"mjesec",MM:td,y:"godinu",yy:td},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,// Monday is the first day of the week.
doy:7}}),kg.defineLocale("ca",{months:"gener_febrer_març_abril_maig_juny_juliol_agost_setembre_octubre_novembre_desembre".split("_"),monthsShort:"gen._febr._mar._abr._mai._jun._jul._ag._set._oct._nov._des.".split("_"),monthsParseExact:!0,weekdays:"diumenge_dilluns_dimarts_dimecres_dijous_divendres_dissabte".split("_"),weekdaysShort:"dg._dl._dt._dc._dj._dv._ds.".split("_"),weekdaysMin:"Dg_Dl_Dt_Dc_Dj_Dv_Ds".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY H:mm",LLLL:"dddd D MMMM YYYY H:mm"},calendar:{sameDay:function(){return"[avui a "+(1!==this.hours()?"les":"la")+"] LT"},nextDay:function(){return"[demà a "+(1!==this.hours()?"les":"la")+"] LT"},nextWeek:function(){return"dddd [a "+(1!==this.hours()?"les":"la")+"] LT"},lastDay:function(){return"[ahir a "+(1!==this.hours()?"les":"la")+"] LT"},lastWeek:function(){return"[el] dddd [passat a "+(1!==this.hours()?"les":"la")+"] LT"},sameElse:"L"},relativeTime:{future:"en %s",past:"fa %s",s:"uns segons",m:"un minut",mm:"%d minuts",h:"una hora",hh:"%d hores",d:"un dia",dd:"%d dies",M:"un mes",MM:"%d mesos",y:"un any",yy:"%d anys"},ordinalParse:/\d{1,2}(r|n|t|è|a)/,ordinal:function(a,b){var c=1===a?"r":2===a?"n":3===a?"r":4===a?"t":"è";return"w"!==b&&"W"!==b||(c="a"),a+c},week:{dow:1,// Monday is the first day of the week.
doy:4}}),"leden_únor_březen_duben_květen_červen_červenec_srpen_září_říjen_listopad_prosinec".split("_")),zg="led_úno_bře_dub_kvě_čvn_čvc_srp_zář_říj_lis_pro".split("_"),Ag=(kg.defineLocale("cs",{months:yg,monthsShort:zg,monthsParse:function(a,b){var c,d=[];for(c=0;12>c;c++)
// use custom parser to solve problem with July (červenec)
d[c]=new RegExp("^"+a[c]+"$|^"+b[c]+"$","i");return d}(yg,zg),shortMonthsParse:function(a){var b,c=[];for(b=0;12>b;b++)c[b]=new RegExp("^"+a[b]+"$","i");return c}(zg),longMonthsParse:function(a){var b,c=[];for(b=0;12>b;b++)c[b]=new RegExp("^"+a[b]+"$","i");return c}(yg),weekdays:"neděle_pondělí_úterý_středa_čtvrtek_pátek_sobota".split("_"),weekdaysShort:"ne_po_út_st_čt_pá_so".split("_"),weekdaysMin:"ne_po_út_st_čt_pá_so".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm",LLLL:"dddd D. MMMM YYYY H:mm",l:"D. M. YYYY"},calendar:{sameDay:"[dnes v] LT",nextDay:"[zítra v] LT",nextWeek:function(){switch(this.day()){case 0:return"[v neděli v] LT";case 1:case 2:return"[v] dddd [v] LT";case 3:return"[ve středu v] LT";case 4:return"[ve čtvrtek v] LT";case 5:return"[v pátek v] LT";case 6:return"[v sobotu v] LT"}},lastDay:"[včera v] LT",lastWeek:function(){switch(this.day()){case 0:return"[minulou neděli v] LT";case 1:case 2:return"[minulé] dddd [v] LT";case 3:return"[minulou středu v] LT";case 4:case 5:return"[minulý] dddd [v] LT";case 6:return"[minulou sobotu v] LT"}},sameElse:"L"},relativeTime:{future:"za %s",past:"před %s",s:vd,m:vd,mm:vd,h:vd,hh:vd,d:vd,dd:vd,M:vd,MM:vd,y:vd,yy:vd},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,// Monday is the first day of the week.
doy:4}}),kg.defineLocale("cv",{months:"кӑрлач_нарӑс_пуш_ака_май_ҫӗртме_утӑ_ҫурла_авӑн_юпа_чӳк_раштав".split("_"),monthsShort:"кӑр_нар_пуш_ака_май_ҫӗр_утӑ_ҫур_авн_юпа_чӳк_раш".split("_"),weekdays:"вырсарникун_тунтикун_ытларикун_юнкун_кӗҫнерникун_эрнекун_шӑматкун".split("_"),weekdaysShort:"выр_тун_ытл_юн_кӗҫ_эрн_шӑм".split("_"),weekdaysMin:"вр_тн_ыт_юн_кҫ_эр_шм".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD-MM-YYYY",LL:"YYYY [ҫулхи] MMMM [уйӑхӗн] D[-мӗшӗ]",LLL:"YYYY [ҫулхи] MMMM [уйӑхӗн] D[-мӗшӗ], HH:mm",LLLL:"dddd, YYYY [ҫулхи] MMMM [уйӑхӗн] D[-мӗшӗ], HH:mm"},calendar:{sameDay:"[Паян] LT [сехетре]",nextDay:"[Ыран] LT [сехетре]",lastDay:"[Ӗнер] LT [сехетре]",nextWeek:"[Ҫитес] dddd LT [сехетре]",lastWeek:"[Иртнӗ] dddd LT [сехетре]",sameElse:"L"},relativeTime:{future:function(a){var b=/сехет$/i.exec(a)?"рен":/ҫул$/i.exec(a)?"тан":"ран";return a+b},past:"%s каялла",s:"пӗр-ик ҫеккунт",m:"пӗр минут",mm:"%d минут",h:"пӗр сехет",hh:"%d сехет",d:"пӗр кун",dd:"%d кун",M:"пӗр уйӑх",MM:"%d уйӑх",y:"пӗр ҫул",yy:"%d ҫул"},ordinalParse:/\d{1,2}-мӗш/,ordinal:"%d-мӗш",week:{dow:1,// Monday is the first day of the week.
doy:7}}),kg.defineLocale("cy",{months:"Ionawr_Chwefror_Mawrth_Ebrill_Mai_Mehefin_Gorffennaf_Awst_Medi_Hydref_Tachwedd_Rhagfyr".split("_"),monthsShort:"Ion_Chwe_Maw_Ebr_Mai_Meh_Gor_Aws_Med_Hyd_Tach_Rhag".split("_"),weekdays:"Dydd Sul_Dydd Llun_Dydd Mawrth_Dydd Mercher_Dydd Iau_Dydd Gwener_Dydd Sadwrn".split("_"),weekdaysShort:"Sul_Llun_Maw_Mer_Iau_Gwe_Sad".split("_"),weekdaysMin:"Su_Ll_Ma_Me_Ia_Gw_Sa".split("_"),weekdaysParseExact:!0,
// time formats are the same as en-gb
longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[Heddiw am] LT",nextDay:"[Yfory am] LT",nextWeek:"dddd [am] LT",lastDay:"[Ddoe am] LT",lastWeek:"dddd [diwethaf am] LT",sameElse:"L"},relativeTime:{future:"mewn %s",past:"%s yn ôl",s:"ychydig eiliadau",m:"munud",mm:"%d munud",h:"awr",hh:"%d awr",d:"diwrnod",dd:"%d diwrnod",M:"mis",MM:"%d mis",y:"blwyddyn",yy:"%d flynedd"},ordinalParse:/\d{1,2}(fed|ain|af|il|ydd|ed|eg)/,
// traditional ordinal numbers above 31 are not commonly used in colloquial Welsh
ordinal:function(a){var b=a,c="",d=["","af","il","ydd","ydd","ed","ed","ed","fed","fed","fed",// 1af to 10fed
"eg","fed","eg","eg","fed","eg","eg","fed","eg","fed"];return b>20?c=40===b||50===b||60===b||80===b||100===b?"fed":"ain":b>0&&(c=d[b]),a+c},week:{dow:1,// Monday is the first day of the week.
doy:4}}),kg.defineLocale("da",{months:"januar_februar_marts_april_maj_juni_juli_august_september_oktober_november_december".split("_"),monthsShort:"jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec".split("_"),weekdays:"søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag".split("_"),weekdaysShort:"søn_man_tir_ons_tor_fre_lør".split("_"),weekdaysMin:"sø_ma_ti_on_to_fr_lø".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY HH:mm",LLLL:"dddd [d.] D. MMMM YYYY HH:mm"},calendar:{sameDay:"[I dag kl.] LT",nextDay:"[I morgen kl.] LT",nextWeek:"dddd [kl.] LT",lastDay:"[I går kl.] LT",lastWeek:"[sidste] dddd [kl] LT",sameElse:"L"},relativeTime:{future:"om %s",past:"%s siden",s:"få sekunder",m:"et minut",mm:"%d minutter",h:"en time",hh:"%d timer",d:"en dag",dd:"%d dage",M:"en måned",MM:"%d måneder",y:"et år",yy:"%d år"},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,// Monday is the first day of the week.
doy:4}}),kg.defineLocale("de-at",{months:"Jänner_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember".split("_"),monthsShort:"Jän._Febr._Mrz._Apr._Mai_Jun._Jul._Aug._Sept._Okt._Nov._Dez.".split("_"),monthsParseExact:!0,weekdays:"Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag".split("_"),weekdaysShort:"So._Mo._Di._Mi._Do._Fr._Sa.".split("_"),weekdaysMin:"So_Mo_Di_Mi_Do_Fr_Sa".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY HH:mm",LLLL:"dddd, D. MMMM YYYY HH:mm"},calendar:{sameDay:"[heute um] LT [Uhr]",sameElse:"L",nextDay:"[morgen um] LT [Uhr]",nextWeek:"dddd [um] LT [Uhr]",lastDay:"[gestern um] LT [Uhr]",lastWeek:"[letzten] dddd [um] LT [Uhr]"},relativeTime:{future:"in %s",past:"vor %s",s:"ein paar Sekunden",m:wd,mm:"%d Minuten",h:wd,hh:"%d Stunden",d:wd,dd:wd,M:wd,MM:wd,y:wd,yy:wd},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,// Monday is the first day of the week.
doy:4}}),kg.defineLocale("de",{months:"Januar_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember".split("_"),monthsShort:"Jan._Febr._Mrz._Apr._Mai_Jun._Jul._Aug._Sept._Okt._Nov._Dez.".split("_"),monthsParseExact:!0,weekdays:"Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag".split("_"),weekdaysShort:"So._Mo._Di._Mi._Do._Fr._Sa.".split("_"),weekdaysMin:"So_Mo_Di_Mi_Do_Fr_Sa".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY HH:mm",LLLL:"dddd, D. MMMM YYYY HH:mm"},calendar:{sameDay:"[heute um] LT [Uhr]",sameElse:"L",nextDay:"[morgen um] LT [Uhr]",nextWeek:"dddd [um] LT [Uhr]",lastDay:"[gestern um] LT [Uhr]",lastWeek:"[letzten] dddd [um] LT [Uhr]"},relativeTime:{future:"in %s",past:"vor %s",s:"ein paar Sekunden",m:xd,mm:"%d Minuten",h:xd,hh:"%d Stunden",d:xd,dd:xd,M:xd,MM:xd,y:xd,yy:xd},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,// Monday is the first day of the week.
doy:4}}),["ޖެނުއަރީ","ފެބްރުއަރީ","މާރިޗު","އޭޕްރީލު","މޭ","ޖޫން","ޖުލައި","އޯގަސްޓު","ސެޕްޓެމްބަރު","އޮކްޓޯބަރު","ނޮވެމްބަރު","ޑިސެމްބަރު"]),Bg=["އާދިއްތަ","ހޯމަ","އަންގާރަ","ބުދަ","ބުރާސްފަތި","ހުކުރު","ހޮނިހިރު"],Cg=(kg.defineLocale("dv",{months:Ag,monthsShort:Ag,weekdays:Bg,weekdaysShort:Bg,weekdaysMin:"އާދި_ހޯމަ_އަން_ބުދަ_ބުރާ_ހުކު_ހޮނި".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"D/M/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},meridiemParse:/މކ|މފ/,isPM:function(a){return"މފ"===a},meridiem:function(a,b,c){return 12>a?"މކ":"މފ"},calendar:{sameDay:"[މިއަދު] LT",nextDay:"[މާދަމާ] LT",nextWeek:"dddd LT",lastDay:"[އިއްޔެ] LT",lastWeek:"[ފާއިތުވި] dddd LT",sameElse:"L"},relativeTime:{future:"ތެރޭގައި %s",past:"ކުރިން %s",s:"ސިކުންތުކޮޅެއް",m:"މިނިޓެއް",mm:"މިނިޓު %d",h:"ގަޑިއިރެއް",hh:"ގަޑިއިރު %d",d:"ދުވަހެއް",dd:"ދުވަސް %d",M:"މަހެއް",MM:"މަސް %d",y:"އަހަރެއް",yy:"އަހަރު %d"},preparse:function(a){return a.replace(/،/g,",")},postformat:function(a){return a.replace(/,/g,"،")},week:{dow:7,// Sunday is the first day of the week.
doy:12}}),kg.defineLocale("el",{monthsNominativeEl:"Ιανουάριος_Φεβρουάριος_Μάρτιος_Απρίλιος_Μάιος_Ιούνιος_Ιούλιος_Αύγουστος_Σεπτέμβριος_Οκτώβριος_Νοέμβριος_Δεκέμβριος".split("_"),monthsGenitiveEl:"Ιανουαρίου_Φεβρουαρίου_Μαρτίου_Απριλίου_Μαΐου_Ιουνίου_Ιουλίου_Αυγούστου_Σεπτεμβρίου_Οκτωβρίου_Νοεμβρίου_Δεκεμβρίου".split("_"),months:function(a,b){return/D/.test(b.substring(0,b.indexOf("MMMM")))?this._monthsGenitiveEl[a.month()]:this._monthsNominativeEl[a.month()]},monthsShort:"Ιαν_Φεβ_Μαρ_Απρ_Μαϊ_Ιουν_Ιουλ_Αυγ_Σεπ_Οκτ_Νοε_Δεκ".split("_"),weekdays:"Κυριακή_Δευτέρα_Τρίτη_Τετάρτη_Πέμπτη_Παρασκευή_Σάββατο".split("_"),weekdaysShort:"Κυρ_Δευ_Τρι_Τετ_Πεμ_Παρ_Σαβ".split("_"),weekdaysMin:"Κυ_Δε_Τρ_Τε_Πε_Πα_Σα".split("_"),meridiem:function(a,b,c){return a>11?c?"μμ":"ΜΜ":c?"πμ":"ΠΜ"},isPM:function(a){return"μ"===(a+"").toLowerCase()[0]},meridiemParse:/[ΠΜ]\.?Μ?\.?/i,longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY h:mm A",LLLL:"dddd, D MMMM YYYY h:mm A"},calendarEl:{sameDay:"[Σήμερα {}] LT",nextDay:"[Αύριο {}] LT",nextWeek:"dddd [{}] LT",lastDay:"[Χθες {}] LT",lastWeek:function(){switch(this.day()){case 6:return"[το προηγούμενο] dddd [{}] LT";default:return"[την προηγούμενη] dddd [{}] LT"}},sameElse:"L"},calendar:function(a,b){var c=this._calendarEl[a],d=b&&b.hours();return y(c)&&(c=c.apply(b)),c.replace("{}",d%12===1?"στη":"στις")},relativeTime:{future:"σε %s",past:"%s πριν",s:"λίγα δευτερόλεπτα",m:"ένα λεπτό",mm:"%d λεπτά",h:"μία ώρα",hh:"%d ώρες",d:"μία μέρα",dd:"%d μέρες",M:"ένας μήνας",MM:"%d μήνες",y:"ένας χρόνος",yy:"%d χρόνια"},ordinalParse:/\d{1,2}η/,ordinal:"%dη",week:{dow:1,// Monday is the first day of the week.
doy:4}}),kg.defineLocale("en-au",{months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY h:mm A",LLLL:"dddd, D MMMM YYYY h:mm A"},calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},ordinalParse:/\d{1,2}(st|nd|rd|th)/,ordinal:function(a){var b=a%10,c=1===~~(a%100/10)?"th":1===b?"st":2===b?"nd":3===b?"rd":"th";return a+c},week:{dow:1,// Monday is the first day of the week.
doy:4}}),kg.defineLocale("en-ca",{months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"YYYY-MM-DD",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY h:mm A",LLLL:"dddd, MMMM D, YYYY h:mm A"},calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},ordinalParse:/\d{1,2}(st|nd|rd|th)/,ordinal:function(a){var b=a%10,c=1===~~(a%100/10)?"th":1===b?"st":2===b?"nd":3===b?"rd":"th";return a+c}}),kg.defineLocale("en-gb",{months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},ordinalParse:/\d{1,2}(st|nd|rd|th)/,ordinal:function(a){var b=a%10,c=1===~~(a%100/10)?"th":1===b?"st":2===b?"nd":3===b?"rd":"th";return a+c},week:{dow:1,// Monday is the first day of the week.
doy:4}}),kg.defineLocale("en-ie",{months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD-MM-YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},ordinalParse:/\d{1,2}(st|nd|rd|th)/,ordinal:function(a){var b=a%10,c=1===~~(a%100/10)?"th":1===b?"st":2===b?"nd":3===b?"rd":"th";return a+c},week:{dow:1,// Monday is the first day of the week.
doy:4}}),kg.defineLocale("en-nz",{months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY h:mm A",LLLL:"dddd, D MMMM YYYY h:mm A"},calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},ordinalParse:/\d{1,2}(st|nd|rd|th)/,ordinal:function(a){var b=a%10,c=1===~~(a%100/10)?"th":1===b?"st":2===b?"nd":3===b?"rd":"th";return a+c},week:{dow:1,// Monday is the first day of the week.
doy:4}}),kg.defineLocale("eo",{months:"januaro_februaro_marto_aprilo_majo_junio_julio_aŭgusto_septembro_oktobro_novembro_decembro".split("_"),monthsShort:"jan_feb_mar_apr_maj_jun_jul_aŭg_sep_okt_nov_dec".split("_"),weekdays:"Dimanĉo_Lundo_Mardo_Merkredo_Ĵaŭdo_Vendredo_Sabato".split("_"),weekdaysShort:"Dim_Lun_Mard_Merk_Ĵaŭ_Ven_Sab".split("_"),weekdaysMin:"Di_Lu_Ma_Me_Ĵa_Ve_Sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"YYYY-MM-DD",LL:"D[-an de] MMMM, YYYY",LLL:"D[-an de] MMMM, YYYY HH:mm",LLLL:"dddd, [la] D[-an de] MMMM, YYYY HH:mm"},meridiemParse:/[ap]\.t\.m/i,isPM:function(a){return"p"===a.charAt(0).toLowerCase()},meridiem:function(a,b,c){return a>11?c?"p.t.m.":"P.T.M.":c?"a.t.m.":"A.T.M."},calendar:{sameDay:"[Hodiaŭ je] LT",nextDay:"[Morgaŭ je] LT",nextWeek:"dddd [je] LT",lastDay:"[Hieraŭ je] LT",lastWeek:"[pasinta] dddd [je] LT",sameElse:"L"},relativeTime:{future:"je %s",past:"antaŭ %s",s:"sekundoj",m:"minuto",mm:"%d minutoj",h:"horo",hh:"%d horoj",d:"tago",//ne 'diurno', ĉar estas uzita por proksimumo
dd:"%d tagoj",M:"monato",MM:"%d monatoj",y:"jaro",yy:"%d jaroj"},ordinalParse:/\d{1,2}a/,ordinal:"%da",week:{dow:1,// Monday is the first day of the week.
doy:7}}),"ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.".split("_")),Dg="ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic".split("_"),Eg=(kg.defineLocale("es-do",{months:"enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre".split("_"),monthsShort:function(a,b){return/-MMM-/.test(b)?Dg[a.month()]:Cg[a.month()]},monthsParseExact:!0,weekdays:"domingo_lunes_martes_miércoles_jueves_viernes_sábado".split("_"),weekdaysShort:"dom._lun._mar._mié._jue._vie._sáb.".split("_"),weekdaysMin:"do_lu_ma_mi_ju_vi_sá".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"DD/MM/YYYY",LL:"D [de] MMMM [de] YYYY",LLL:"D [de] MMMM [de] YYYY h:mm A",LLLL:"dddd, D [de] MMMM [de] YYYY h:mm A"},calendar:{sameDay:function(){return"[hoy a la"+(1!==this.hours()?"s":"")+"] LT"},nextDay:function(){return"[mañana a la"+(1!==this.hours()?"s":"")+"] LT"},nextWeek:function(){return"dddd [a la"+(1!==this.hours()?"s":"")+"] LT"},lastDay:function(){return"[ayer a la"+(1!==this.hours()?"s":"")+"] LT"},lastWeek:function(){return"[el] dddd [pasado a la"+(1!==this.hours()?"s":"")+"] LT"},sameElse:"L"},relativeTime:{future:"en %s",past:"hace %s",s:"unos segundos",m:"un minuto",mm:"%d minutos",h:"una hora",hh:"%d horas",d:"un día",dd:"%d días",M:"un mes",MM:"%d meses",y:"un año",yy:"%d años"},ordinalParse:/\d{1,2}º/,ordinal:"%dº",week:{dow:1,// Monday is the first day of the week.
doy:4}}),"ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.".split("_")),Fg="ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic".split("_"),Gg=(kg.defineLocale("es",{months:"enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre".split("_"),monthsShort:function(a,b){return/-MMM-/.test(b)?Fg[a.month()]:Eg[a.month()]},monthsParseExact:!0,weekdays:"domingo_lunes_martes_miércoles_jueves_viernes_sábado".split("_"),weekdaysShort:"dom._lun._mar._mié._jue._vie._sáb.".split("_"),weekdaysMin:"do_lu_ma_mi_ju_vi_sá".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD/MM/YYYY",LL:"D [de] MMMM [de] YYYY",LLL:"D [de] MMMM [de] YYYY H:mm",LLLL:"dddd, D [de] MMMM [de] YYYY H:mm"},calendar:{sameDay:function(){return"[hoy a la"+(1!==this.hours()?"s":"")+"] LT"},nextDay:function(){return"[mañana a la"+(1!==this.hours()?"s":"")+"] LT"},nextWeek:function(){return"dddd [a la"+(1!==this.hours()?"s":"")+"] LT"},lastDay:function(){return"[ayer a la"+(1!==this.hours()?"s":"")+"] LT"},lastWeek:function(){return"[el] dddd [pasado a la"+(1!==this.hours()?"s":"")+"] LT"},sameElse:"L"},relativeTime:{future:"en %s",past:"hace %s",s:"unos segundos",m:"un minuto",mm:"%d minutos",h:"una hora",hh:"%d horas",d:"un día",dd:"%d días",M:"un mes",MM:"%d meses",y:"un año",yy:"%d años"},ordinalParse:/\d{1,2}º/,ordinal:"%dº",week:{dow:1,// Monday is the first day of the week.
doy:4}}),kg.defineLocale("et",{months:"jaanuar_veebruar_märts_aprill_mai_juuni_juuli_august_september_oktoober_november_detsember".split("_"),monthsShort:"jaan_veebr_märts_apr_mai_juuni_juuli_aug_sept_okt_nov_dets".split("_"),weekdays:"pühapäev_esmaspäev_teisipäev_kolmapäev_neljapäev_reede_laupäev".split("_"),weekdaysShort:"P_E_T_K_N_R_L".split("_"),weekdaysMin:"P_E_T_K_N_R_L".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm",LLLL:"dddd, D. MMMM YYYY H:mm"},calendar:{sameDay:"[Täna,] LT",nextDay:"[Homme,] LT",nextWeek:"[Järgmine] dddd LT",lastDay:"[Eile,] LT",lastWeek:"[Eelmine] dddd LT",sameElse:"L"},relativeTime:{future:"%s pärast",past:"%s tagasi",s:yd,m:yd,mm:yd,h:yd,hh:yd,d:yd,dd:"%d päeva",M:yd,MM:yd,y:yd,yy:yd},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,// Monday is the first day of the week.
doy:4}}),kg.defineLocale("eu",{months:"urtarrila_otsaila_martxoa_apirila_maiatza_ekaina_uztaila_abuztua_iraila_urria_azaroa_abendua".split("_"),monthsShort:"urt._ots._mar._api._mai._eka._uzt._abu._ira._urr._aza._abe.".split("_"),monthsParseExact:!0,weekdays:"igandea_astelehena_asteartea_asteazkena_osteguna_ostirala_larunbata".split("_"),weekdaysShort:"ig._al._ar._az._og._ol._lr.".split("_"),weekdaysMin:"ig_al_ar_az_og_ol_lr".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"YYYY-MM-DD",LL:"YYYY[ko] MMMM[ren] D[a]",LLL:"YYYY[ko] MMMM[ren] D[a] HH:mm",LLLL:"dddd, YYYY[ko] MMMM[ren] D[a] HH:mm",l:"YYYY-M-D",ll:"YYYY[ko] MMM D[a]",lll:"YYYY[ko] MMM D[a] HH:mm",llll:"ddd, YYYY[ko] MMM D[a] HH:mm"},calendar:{sameDay:"[gaur] LT[etan]",nextDay:"[bihar] LT[etan]",nextWeek:"dddd LT[etan]",lastDay:"[atzo] LT[etan]",lastWeek:"[aurreko] dddd LT[etan]",sameElse:"L"},relativeTime:{future:"%s barru",past:"duela %s",s:"segundo batzuk",m:"minutu bat",mm:"%d minutu",h:"ordu bat",hh:"%d ordu",d:"egun bat",dd:"%d egun",M:"hilabete bat",MM:"%d hilabete",y:"urte bat",yy:"%d urte"},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,// Monday is the first day of the week.
doy:7}}),{1:"۱",2:"۲",3:"۳",4:"۴",5:"۵",6:"۶",7:"۷",8:"۸",9:"۹",0:"۰"}),Hg={"۱":"1","۲":"2","۳":"3","۴":"4","۵":"5","۶":"6","۷":"7","۸":"8","۹":"9","۰":"0"},Ig=(kg.defineLocale("fa",{months:"ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر".split("_"),monthsShort:"ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر".split("_"),weekdays:"یک‌شنبه_دوشنبه_سه‌شنبه_چهارشنبه_پنج‌شنبه_جمعه_شنبه".split("_"),weekdaysShort:"یک‌شنبه_دوشنبه_سه‌شنبه_چهارشنبه_پنج‌شنبه_جمعه_شنبه".split("_"),weekdaysMin:"ی_د_س_چ_پ_ج_ش".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},meridiemParse:/قبل از ظهر|بعد از ظهر/,isPM:function(a){return/بعد از ظهر/.test(a)},meridiem:function(a,b,c){return 12>a?"قبل از ظهر":"بعد از ظهر"},calendar:{sameDay:"[امروز ساعت] LT",nextDay:"[فردا ساعت] LT",nextWeek:"dddd [ساعت] LT",lastDay:"[دیروز ساعت] LT",lastWeek:"dddd [پیش] [ساعت] LT",sameElse:"L"},relativeTime:{future:"در %s",past:"%s پیش",s:"چندین ثانیه",m:"یک دقیقه",mm:"%d دقیقه",h:"یک ساعت",hh:"%d ساعت",d:"یک روز",dd:"%d روز",M:"یک ماه",MM:"%d ماه",y:"یک سال",yy:"%d سال"},preparse:function(a){return a.replace(/[۰-۹]/g,function(a){return Hg[a]}).replace(/،/g,",")},postformat:function(a){return a.replace(/\d/g,function(a){return Gg[a]}).replace(/,/g,"،")},ordinalParse:/\d{1,2}م/,ordinal:"%dم",week:{dow:6,// Saturday is the first day of the week.
doy:12}}),"nolla yksi kaksi kolme neljä viisi kuusi seitsemän kahdeksan yhdeksän".split(" ")),Jg=["nolla","yhden","kahden","kolmen","neljän","viiden","kuuden",Ig[7],Ig[8],Ig[9]],Kg=(kg.defineLocale("fi",{months:"tammikuu_helmikuu_maaliskuu_huhtikuu_toukokuu_kesäkuu_heinäkuu_elokuu_syyskuu_lokakuu_marraskuu_joulukuu".split("_"),monthsShort:"tammi_helmi_maalis_huhti_touko_kesä_heinä_elo_syys_loka_marras_joulu".split("_"),weekdays:"sunnuntai_maanantai_tiistai_keskiviikko_torstai_perjantai_lauantai".split("_"),weekdaysShort:"su_ma_ti_ke_to_pe_la".split("_"),weekdaysMin:"su_ma_ti_ke_to_pe_la".split("_"),longDateFormat:{LT:"HH.mm",LTS:"HH.mm.ss",L:"DD.MM.YYYY",LL:"Do MMMM[ta] YYYY",LLL:"Do MMMM[ta] YYYY, [klo] HH.mm",LLLL:"dddd, Do MMMM[ta] YYYY, [klo] HH.mm",l:"D.M.YYYY",ll:"Do MMM YYYY",lll:"Do MMM YYYY, [klo] HH.mm",llll:"ddd, Do MMM YYYY, [klo] HH.mm"},calendar:{sameDay:"[tänään] [klo] LT",nextDay:"[huomenna] [klo] LT",nextWeek:"dddd [klo] LT",lastDay:"[eilen] [klo] LT",lastWeek:"[viime] dddd[na] [klo] LT",sameElse:"L"},relativeTime:{future:"%s päästä",past:"%s sitten",s:zd,m:zd,mm:zd,h:zd,hh:zd,d:zd,dd:zd,M:zd,MM:zd,y:zd,yy:zd},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,// Monday is the first day of the week.
doy:4}}),kg.defineLocale("fo",{months:"januar_februar_mars_apríl_mai_juni_juli_august_september_oktober_november_desember".split("_"),monthsShort:"jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des".split("_"),weekdays:"sunnudagur_mánadagur_týsdagur_mikudagur_hósdagur_fríggjadagur_leygardagur".split("_"),weekdaysShort:"sun_mán_týs_mik_hós_frí_ley".split("_"),weekdaysMin:"su_má_tý_mi_hó_fr_le".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D. MMMM, YYYY HH:mm"},calendar:{sameDay:"[Í dag kl.] LT",nextDay:"[Í morgin kl.] LT",nextWeek:"dddd [kl.] LT",lastDay:"[Í gjár kl.] LT",lastWeek:"[síðstu] dddd [kl] LT",sameElse:"L"},relativeTime:{future:"um %s",past:"%s síðani",s:"fá sekund",m:"ein minutt",mm:"%d minuttir",h:"ein tími",hh:"%d tímar",d:"ein dagur",dd:"%d dagar",M:"ein mánaði",MM:"%d mánaðir",y:"eitt ár",yy:"%d ár"},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,// Monday is the first day of the week.
doy:4}}),kg.defineLocale("fr-ca",{months:"janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split("_"),monthsShort:"janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),monthsParseExact:!0,weekdays:"dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),weekdaysShort:"dim._lun._mar._mer._jeu._ven._sam.".split("_"),weekdaysMin:"Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"YYYY-MM-DD",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[Aujourd'hui à] LT",nextDay:"[Demain à] LT",nextWeek:"dddd [à] LT",lastDay:"[Hier à] LT",lastWeek:"dddd [dernier à] LT",sameElse:"L"},relativeTime:{future:"dans %s",past:"il y a %s",s:"quelques secondes",m:"une minute",mm:"%d minutes",h:"une heure",hh:"%d heures",d:"un jour",dd:"%d jours",M:"un mois",MM:"%d mois",y:"un an",yy:"%d ans"},ordinalParse:/\d{1,2}(er|e)/,ordinal:function(a){return a+(1===a?"er":"e")}}),kg.defineLocale("fr-ch",{months:"janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split("_"),monthsShort:"janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),monthsParseExact:!0,weekdays:"dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),weekdaysShort:"dim._lun._mar._mer._jeu._ven._sam.".split("_"),weekdaysMin:"Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[Aujourd'hui à] LT",nextDay:"[Demain à] LT",nextWeek:"dddd [à] LT",lastDay:"[Hier à] LT",lastWeek:"dddd [dernier à] LT",sameElse:"L"},relativeTime:{future:"dans %s",past:"il y a %s",s:"quelques secondes",m:"une minute",mm:"%d minutes",h:"une heure",hh:"%d heures",d:"un jour",dd:"%d jours",M:"un mois",MM:"%d mois",y:"un an",yy:"%d ans"},ordinalParse:/\d{1,2}(er|e)/,ordinal:function(a){return a+(1===a?"er":"e")},week:{dow:1,// Monday is the first day of the week.
doy:4}}),kg.defineLocale("fr",{months:"janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split("_"),monthsShort:"janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),monthsParseExact:!0,weekdays:"dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),weekdaysShort:"dim._lun._mar._mer._jeu._ven._sam.".split("_"),weekdaysMin:"Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[Aujourd'hui à] LT",nextDay:"[Demain à] LT",nextWeek:"dddd [à] LT",lastDay:"[Hier à] LT",lastWeek:"dddd [dernier à] LT",sameElse:"L"},relativeTime:{future:"dans %s",past:"il y a %s",s:"quelques secondes",m:"une minute",mm:"%d minutes",h:"une heure",hh:"%d heures",d:"un jour",dd:"%d jours",M:"un mois",MM:"%d mois",y:"un an",yy:"%d ans"},ordinalParse:/\d{1,2}(er|)/,ordinal:function(a){return a+(1===a?"er":"")},week:{dow:1,// Monday is the first day of the week.
doy:4}}),"jan._feb._mrt._apr._mai_jun._jul._aug._sep._okt._nov._des.".split("_")),Lg="jan_feb_mrt_apr_mai_jun_jul_aug_sep_okt_nov_des".split("_"),Mg=(kg.defineLocale("fy",{months:"jannewaris_febrewaris_maart_april_maaie_juny_july_augustus_septimber_oktober_novimber_desimber".split("_"),monthsShort:function(a,b){return/-MMM-/.test(b)?Lg[a.month()]:Kg[a.month()]},monthsParseExact:!0,weekdays:"snein_moandei_tiisdei_woansdei_tongersdei_freed_sneon".split("_"),weekdaysShort:"si._mo._ti._wo._to._fr._so.".split("_"),weekdaysMin:"Si_Mo_Ti_Wo_To_Fr_So".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD-MM-YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[hjoed om] LT",nextDay:"[moarn om] LT",nextWeek:"dddd [om] LT",lastDay:"[juster om] LT",lastWeek:"[ôfrûne] dddd [om] LT",sameElse:"L"},relativeTime:{future:"oer %s",past:"%s lyn",s:"in pear sekonden",m:"ien minút",mm:"%d minuten",h:"ien oere",hh:"%d oeren",d:"ien dei",dd:"%d dagen",M:"ien moanne",MM:"%d moannen",y:"ien jier",yy:"%d jierren"},ordinalParse:/\d{1,2}(ste|de)/,ordinal:function(a){return a+(1===a||8===a||a>=20?"ste":"de")},week:{dow:1,// Monday is the first day of the week.
doy:4}}),["Am Faoilleach","An Gearran","Am Màrt","An Giblean","An Cèitean","An t-Ògmhios","An t-Iuchar","An Lùnastal","An t-Sultain","An Dàmhair","An t-Samhain","An Dùbhlachd"]),Ng=["Faoi","Gear","Màrt","Gibl","Cèit","Ògmh","Iuch","Lùn","Sult","Dàmh","Samh","Dùbh"],Og=["Didòmhnaich","Diluain","Dimàirt","Diciadain","Diardaoin","Dihaoine","Disathairne"],Pg=["Did","Dil","Dim","Dic","Dia","Dih","Dis"],Qg=["Dò","Lu","Mà","Ci","Ar","Ha","Sa"],Rg=(kg.defineLocale("gd",{months:Mg,monthsShort:Ng,monthsParseExact:!0,weekdays:Og,weekdaysShort:Pg,weekdaysMin:Qg,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[An-diugh aig] LT",nextDay:"[A-màireach aig] LT",nextWeek:"dddd [aig] LT",lastDay:"[An-dè aig] LT",lastWeek:"dddd [seo chaidh] [aig] LT",sameElse:"L"},relativeTime:{future:"ann an %s",past:"bho chionn %s",s:"beagan diogan",m:"mionaid",mm:"%d mionaidean",h:"uair",hh:"%d uairean",d:"latha",dd:"%d latha",M:"mìos",MM:"%d mìosan",y:"bliadhna",yy:"%d bliadhna"},ordinalParse:/\d{1,2}(d|na|mh)/,ordinal:function(a){var b=1===a?"d":a%10===2?"na":"mh";return a+b},week:{dow:1,// Monday is the first day of the week.
doy:4}}),kg.defineLocale("gl",{months:"Xaneiro_Febreiro_Marzo_Abril_Maio_Xuño_Xullo_Agosto_Setembro_Outubro_Novembro_Decembro".split("_"),monthsShort:"Xan._Feb._Mar._Abr._Mai._Xuñ._Xul._Ago._Set._Out._Nov._Dec.".split("_"),monthsParseExact:!0,weekdays:"Domingo_Luns_Martes_Mércores_Xoves_Venres_Sábado".split("_"),weekdaysShort:"Dom._Lun._Mar._Mér._Xov._Ven._Sáb.".split("_"),weekdaysMin:"Do_Lu_Ma_Mé_Xo_Ve_Sá".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY H:mm",LLLL:"dddd D MMMM YYYY H:mm"},calendar:{sameDay:function(){return"[hoxe "+(1!==this.hours()?"ás":"á")+"] LT"},nextDay:function(){return"[mañá "+(1!==this.hours()?"ás":"á")+"] LT"},nextWeek:function(){return"dddd ["+(1!==this.hours()?"ás":"a")+"] LT"},lastDay:function(){return"[onte "+(1!==this.hours()?"á":"a")+"] LT"},lastWeek:function(){return"[o] dddd [pasado "+(1!==this.hours()?"ás":"a")+"] LT"},sameElse:"L"},relativeTime:{future:function(a){return"uns segundos"===a?"nuns segundos":"en "+a},past:"hai %s",s:"uns segundos",m:"un minuto",mm:"%d minutos",h:"unha hora",hh:"%d horas",d:"un día",dd:"%d días",M:"un mes",MM:"%d meses",y:"un ano",yy:"%d anos"},ordinalParse:/\d{1,2}º/,ordinal:"%dº",week:{dow:1,// Monday is the first day of the week.
doy:7}}),kg.defineLocale("he",{months:"ינואר_פברואר_מרץ_אפריל_מאי_יוני_יולי_אוגוסט_ספטמבר_אוקטובר_נובמבר_דצמבר".split("_"),monthsShort:"ינו׳_פבר׳_מרץ_אפר׳_מאי_יוני_יולי_אוג׳_ספט׳_אוק׳_נוב׳_דצמ׳".split("_"),weekdays:"ראשון_שני_שלישי_רביעי_חמישי_שישי_שבת".split("_"),weekdaysShort:"א׳_ב׳_ג׳_ד׳_ה׳_ו׳_ש׳".split("_"),weekdaysMin:"א_ב_ג_ד_ה_ו_ש".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D [ב]MMMM YYYY",LLL:"D [ב]MMMM YYYY HH:mm",LLLL:"dddd, D [ב]MMMM YYYY HH:mm",l:"D/M/YYYY",ll:"D MMM YYYY",lll:"D MMM YYYY HH:mm",llll:"ddd, D MMM YYYY HH:mm"},calendar:{sameDay:"[היום ב־]LT",nextDay:"[מחר ב־]LT",nextWeek:"dddd [בשעה] LT",lastDay:"[אתמול ב־]LT",lastWeek:"[ביום] dddd [האחרון בשעה] LT",sameElse:"L"},relativeTime:{future:"בעוד %s",past:"לפני %s",s:"מספר שניות",m:"דקה",mm:"%d דקות",h:"שעה",hh:function(a){return 2===a?"שעתיים":a+" שעות"},d:"יום",dd:function(a){return 2===a?"יומיים":a+" ימים"},M:"חודש",MM:function(a){return 2===a?"חודשיים":a+" חודשים"},y:"שנה",yy:function(a){return 2===a?"שנתיים":a%10===0&&10!==a?a+" שנה":a+" שנים"}},meridiemParse:/אחה"צ|לפנה"צ|אחרי הצהריים|לפני הצהריים|לפנות בוקר|בבוקר|בערב/i,isPM:function(a){return/^(אחה"צ|אחרי הצהריים|בערב)$/.test(a)},meridiem:function(a,b,c){return 5>a?"לפנות בוקר":10>a?"בבוקר":12>a?c?'לפנה"צ':"לפני הצהריים":18>a?c?'אחה"צ':"אחרי הצהריים":"בערב"}}),{1:"१",2:"२",3:"३",4:"४",5:"५",6:"६",7:"७",8:"८",9:"९",0:"०"}),Sg={"१":"1","२":"2","३":"3","४":"4","५":"5","६":"6","७":"7","८":"8","९":"9","०":"0"},Tg=(kg.defineLocale("hi",{months:"जनवरी_फ़रवरी_मार्च_अप्रैल_मई_जून_जुलाई_अगस्त_सितम्बर_अक्टूबर_नवम्बर_दिसम्बर".split("_"),monthsShort:"जन._फ़र._मार्च_अप्रै._मई_जून_जुल._अग._सित._अक्टू._नव._दिस.".split("_"),monthsParseExact:!0,weekdays:"रविवार_सोमवार_मंगलवार_बुधवार_गुरूवार_शुक्रवार_शनिवार".split("_"),weekdaysShort:"रवि_सोम_मंगल_बुध_गुरू_शुक्र_शनि".split("_"),weekdaysMin:"र_सो_मं_बु_गु_शु_श".split("_"),longDateFormat:{LT:"A h:mm बजे",LTS:"A h:mm:ss बजे",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, A h:mm बजे",LLLL:"dddd, D MMMM YYYY, A h:mm बजे"},calendar:{sameDay:"[आज] LT",nextDay:"[कल] LT",nextWeek:"dddd, LT",lastDay:"[कल] LT",lastWeek:"[पिछले] dddd, LT",sameElse:"L"},relativeTime:{future:"%s में",past:"%s पहले",s:"कुछ ही क्षण",m:"एक मिनट",mm:"%d मिनट",h:"एक घंटा",hh:"%d घंटे",d:"एक दिन",dd:"%d दिन",M:"एक महीने",MM:"%d महीने",y:"एक वर्ष",yy:"%d वर्ष"},preparse:function(a){return a.replace(/[१२३४५६७८९०]/g,function(a){return Sg[a]})},postformat:function(a){return a.replace(/\d/g,function(a){return Rg[a]})},
// Hindi notation for meridiems are quite fuzzy in practice. While there exists
// a rigid notion of a 'Pahar' it is not used as rigidly in modern Hindi.
meridiemParse:/रात|सुबह|दोपहर|शाम/,meridiemHour:function(a,b){return 12===a&&(a=0),"रात"===b?4>a?a:a+12:"सुबह"===b?a:"दोपहर"===b?a>=10?a:a+12:"शाम"===b?a+12:void 0},meridiem:function(a,b,c){return 4>a?"रात":10>a?"सुबह":17>a?"दोपहर":20>a?"शाम":"रात"},week:{dow:0,// Sunday is the first day of the week.
doy:6}}),kg.defineLocale("hr",{months:{format:"siječnja_veljače_ožujka_travnja_svibnja_lipnja_srpnja_kolovoza_rujna_listopada_studenoga_prosinca".split("_"),standalone:"siječanj_veljača_ožujak_travanj_svibanj_lipanj_srpanj_kolovoz_rujan_listopad_studeni_prosinac".split("_")},monthsShort:"sij._velj._ožu._tra._svi._lip._srp._kol._ruj._lis._stu._pro.".split("_"),monthsParseExact:!0,weekdays:"nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota".split("_"),weekdaysShort:"ned._pon._uto._sri._čet._pet._sub.".split("_"),weekdaysMin:"ne_po_ut_sr_če_pe_su".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD. MM. YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm",LLLL:"dddd, D. MMMM YYYY H:mm"},calendar:{sameDay:"[danas u] LT",nextDay:"[sutra u] LT",nextWeek:function(){switch(this.day()){case 0:return"[u] [nedjelju] [u] LT";case 3:return"[u] [srijedu] [u] LT";case 6:return"[u] [subotu] [u] LT";case 1:case 2:case 4:case 5:return"[u] dddd [u] LT"}},lastDay:"[jučer u] LT",lastWeek:function(){switch(this.day()){case 0:case 3:return"[prošlu] dddd [u] LT";case 6:return"[prošle] [subote] [u] LT";case 1:case 2:case 4:case 5:return"[prošli] dddd [u] LT"}},sameElse:"L"},relativeTime:{future:"za %s",past:"prije %s",s:"par sekundi",m:Bd,mm:Bd,h:Bd,hh:Bd,d:"dan",dd:Bd,M:"mjesec",MM:Bd,y:"godinu",yy:Bd},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,// Monday is the first day of the week.
doy:7}}),"vasárnap hétfőn kedden szerdán csütörtökön pénteken szombaton".split(" ")),Ug=(kg.defineLocale("hu",{months:"január_február_március_április_május_június_július_augusztus_szeptember_október_november_december".split("_"),monthsShort:"jan_feb_márc_ápr_máj_jún_júl_aug_szept_okt_nov_dec".split("_"),weekdays:"vasárnap_hétfő_kedd_szerda_csütörtök_péntek_szombat".split("_"),weekdaysShort:"vas_hét_kedd_sze_csüt_pén_szo".split("_"),weekdaysMin:"v_h_k_sze_cs_p_szo".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"YYYY.MM.DD.",LL:"YYYY. MMMM D.",LLL:"YYYY. MMMM D. H:mm",LLLL:"YYYY. MMMM D., dddd H:mm"},meridiemParse:/de|du/i,isPM:function(a){return"u"===a.charAt(1).toLowerCase()},meridiem:function(a,b,c){return 12>a?c===!0?"de":"DE":c===!0?"du":"DU"},calendar:{sameDay:"[ma] LT[-kor]",nextDay:"[holnap] LT[-kor]",nextWeek:function(){return Dd.call(this,!0)},lastDay:"[tegnap] LT[-kor]",lastWeek:function(){return Dd.call(this,!1)},sameElse:"L"},relativeTime:{future:"%s múlva",past:"%s",s:Cd,m:Cd,mm:Cd,h:Cd,hh:Cd,d:Cd,dd:Cd,M:Cd,MM:Cd,y:Cd,yy:Cd},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,// Monday is the first day of the week.
doy:7}}),kg.defineLocale("hy-am",{months:{format:"հունվարի_փետրվարի_մարտի_ապրիլի_մայիսի_հունիսի_հուլիսի_օգոստոսի_սեպտեմբերի_հոկտեմբերի_նոյեմբերի_դեկտեմբերի".split("_"),standalone:"հունվար_փետրվար_մարտ_ապրիլ_մայիս_հունիս_հուլիս_օգոստոս_սեպտեմբեր_հոկտեմբեր_նոյեմբեր_դեկտեմբեր".split("_")},monthsShort:"հնվ_փտր_մրտ_ապր_մյս_հնս_հլս_օգս_սպտ_հկտ_նմբ_դկտ".split("_"),weekdays:"կիրակի_երկուշաբթի_երեքշաբթի_չորեքշաբթի_հինգշաբթի_ուրբաթ_շաբաթ".split("_"),weekdaysShort:"կրկ_երկ_երք_չրք_հնգ_ուրբ_շբթ".split("_"),weekdaysMin:"կրկ_երկ_երք_չրք_հնգ_ուրբ_շբթ".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY թ.",LLL:"D MMMM YYYY թ., HH:mm",LLLL:"dddd, D MMMM YYYY թ., HH:mm"},calendar:{sameDay:"[այսօր] LT",nextDay:"[վաղը] LT",lastDay:"[երեկ] LT",nextWeek:function(){return"dddd [օրը ժամը] LT"},lastWeek:function(){return"[անցած] dddd [օրը ժամը] LT"},sameElse:"L"},relativeTime:{future:"%s հետո",past:"%s առաջ",s:"մի քանի վայրկյան",m:"րոպե",mm:"%d րոպե",h:"ժամ",hh:"%d ժամ",d:"օր",dd:"%d օր",M:"ամիս",MM:"%d ամիս",y:"տարի",yy:"%d տարի"},meridiemParse:/գիշերվա|առավոտվա|ցերեկվա|երեկոյան/,isPM:function(a){return/^(ցերեկվա|երեկոյան)$/.test(a)},meridiem:function(a){return 4>a?"գիշերվա":12>a?"առավոտվա":17>a?"ցերեկվա":"երեկոյան"},ordinalParse:/\d{1,2}|\d{1,2}-(ին|րդ)/,ordinal:function(a,b){switch(b){case"DDD":case"w":case"W":case"DDDo":return 1===a?a+"-ին":a+"-րդ";default:return a}},week:{dow:1,// Monday is the first day of the week.
doy:7}}),kg.defineLocale("id",{months:"Januari_Februari_Maret_April_Mei_Juni_Juli_Agustus_September_Oktober_November_Desember".split("_"),monthsShort:"Jan_Feb_Mar_Apr_Mei_Jun_Jul_Ags_Sep_Okt_Nov_Des".split("_"),weekdays:"Minggu_Senin_Selasa_Rabu_Kamis_Jumat_Sabtu".split("_"),weekdaysShort:"Min_Sen_Sel_Rab_Kam_Jum_Sab".split("_"),weekdaysMin:"Mg_Sn_Sl_Rb_Km_Jm_Sb".split("_"),longDateFormat:{LT:"HH.mm",LTS:"HH.mm.ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY [pukul] HH.mm",LLLL:"dddd, D MMMM YYYY [pukul] HH.mm"},meridiemParse:/pagi|siang|sore|malam/,meridiemHour:function(a,b){return 12===a&&(a=0),"pagi"===b?a:"siang"===b?a>=11?a:a+12:"sore"===b||"malam"===b?a+12:void 0},meridiem:function(a,b,c){return 11>a?"pagi":15>a?"siang":19>a?"sore":"malam"},calendar:{sameDay:"[Hari ini pukul] LT",nextDay:"[Besok pukul] LT",nextWeek:"dddd [pukul] LT",lastDay:"[Kemarin pukul] LT",lastWeek:"dddd [lalu pukul] LT",sameElse:"L"},relativeTime:{future:"dalam %s",past:"%s yang lalu",s:"beberapa detik",m:"semenit",mm:"%d menit",h:"sejam",hh:"%d jam",d:"sehari",dd:"%d hari",M:"sebulan",MM:"%d bulan",y:"setahun",yy:"%d tahun"},week:{dow:1,// Monday is the first day of the week.
doy:7}}),kg.defineLocale("is",{months:"janúar_febrúar_mars_apríl_maí_júní_júlí_ágúst_september_október_nóvember_desember".split("_"),monthsShort:"jan_feb_mar_apr_maí_jún_júl_ágú_sep_okt_nóv_des".split("_"),weekdays:"sunnudagur_mánudagur_þriðjudagur_miðvikudagur_fimmtudagur_föstudagur_laugardagur".split("_"),weekdaysShort:"sun_mán_þri_mið_fim_fös_lau".split("_"),weekdaysMin:"Su_Má_Þr_Mi_Fi_Fö_La".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY [kl.] H:mm",LLLL:"dddd, D. MMMM YYYY [kl.] H:mm"},calendar:{sameDay:"[í dag kl.] LT",nextDay:"[á morgun kl.] LT",nextWeek:"dddd [kl.] LT",lastDay:"[í gær kl.] LT",lastWeek:"[síðasta] dddd [kl.] LT",sameElse:"L"},relativeTime:{future:"eftir %s",past:"fyrir %s síðan",s:Fd,m:Fd,mm:Fd,h:"klukkustund",hh:Fd,d:Fd,dd:Fd,M:Fd,MM:Fd,y:Fd,yy:Fd},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,// Monday is the first day of the week.
doy:4}}),kg.defineLocale("it",{months:"gennaio_febbraio_marzo_aprile_maggio_giugno_luglio_agosto_settembre_ottobre_novembre_dicembre".split("_"),monthsShort:"gen_feb_mar_apr_mag_giu_lug_ago_set_ott_nov_dic".split("_"),weekdays:"Domenica_Lunedì_Martedì_Mercoledì_Giovedì_Venerdì_Sabato".split("_"),weekdaysShort:"Dom_Lun_Mar_Mer_Gio_Ven_Sab".split("_"),weekdaysMin:"Do_Lu_Ma_Me_Gi_Ve_Sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[Oggi alle] LT",nextDay:"[Domani alle] LT",nextWeek:"dddd [alle] LT",lastDay:"[Ieri alle] LT",lastWeek:function(){switch(this.day()){case 0:return"[la scorsa] dddd [alle] LT";default:return"[lo scorso] dddd [alle] LT"}},sameElse:"L"},relativeTime:{future:function(a){return(/^[0-9].+$/.test(a)?"tra":"in")+" "+a},past:"%s fa",s:"alcuni secondi",m:"un minuto",mm:"%d minuti",h:"un'ora",hh:"%d ore",d:"un giorno",dd:"%d giorni",M:"un mese",MM:"%d mesi",y:"un anno",yy:"%d anni"},ordinalParse:/\d{1,2}º/,ordinal:"%dº",week:{dow:1,// Monday is the first day of the week.
doy:4}}),kg.defineLocale("ja",{months:"1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),monthsShort:"1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),weekdays:"日曜日_月曜日_火曜日_水曜日_木曜日_金曜日_土曜日".split("_"),weekdaysShort:"日_月_火_水_木_金_土".split("_"),weekdaysMin:"日_月_火_水_木_金_土".split("_"),longDateFormat:{LT:"Ah時m分",LTS:"Ah時m分s秒",L:"YYYY/MM/DD",LL:"YYYY年M月D日",LLL:"YYYY年M月D日Ah時m分",LLLL:"YYYY年M月D日Ah時m分 dddd"},meridiemParse:/午前|午後/i,isPM:function(a){return"午後"===a},meridiem:function(a,b,c){return 12>a?"午前":"午後"},calendar:{sameDay:"[今日] LT",nextDay:"[明日] LT",nextWeek:"[来週]dddd LT",lastDay:"[昨日] LT",lastWeek:"[前週]dddd LT",sameElse:"L"},ordinalParse:/\d{1,2}日/,ordinal:function(a,b){switch(b){case"d":case"D":case"DDD":return a+"日";default:return a}},relativeTime:{future:"%s後",past:"%s前",s:"数秒",m:"1分",mm:"%d分",h:"1時間",hh:"%d時間",d:"1日",dd:"%d日",M:"1ヶ月",MM:"%dヶ月",y:"1年",yy:"%d年"}}),kg.defineLocale("jv",{months:"Januari_Februari_Maret_April_Mei_Juni_Juli_Agustus_September_Oktober_Nopember_Desember".split("_"),monthsShort:"Jan_Feb_Mar_Apr_Mei_Jun_Jul_Ags_Sep_Okt_Nop_Des".split("_"),weekdays:"Minggu_Senen_Seloso_Rebu_Kemis_Jemuwah_Septu".split("_"),weekdaysShort:"Min_Sen_Sel_Reb_Kem_Jem_Sep".split("_"),weekdaysMin:"Mg_Sn_Sl_Rb_Km_Jm_Sp".split("_"),longDateFormat:{LT:"HH.mm",LTS:"HH.mm.ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY [pukul] HH.mm",LLLL:"dddd, D MMMM YYYY [pukul] HH.mm"},meridiemParse:/enjing|siyang|sonten|ndalu/,meridiemHour:function(a,b){return 12===a&&(a=0),"enjing"===b?a:"siyang"===b?a>=11?a:a+12:"sonten"===b||"ndalu"===b?a+12:void 0},meridiem:function(a,b,c){return 11>a?"enjing":15>a?"siyang":19>a?"sonten":"ndalu"},calendar:{sameDay:"[Dinten puniko pukul] LT",nextDay:"[Mbenjang pukul] LT",nextWeek:"dddd [pukul] LT",lastDay:"[Kala wingi pukul] LT",lastWeek:"dddd [kepengker pukul] LT",sameElse:"L"},relativeTime:{future:"wonten ing %s",past:"%s ingkang kepengker",s:"sawetawis detik",m:"setunggal menit",mm:"%d menit",h:"setunggal jam",hh:"%d jam",d:"sedinten",dd:"%d dinten",M:"sewulan",MM:"%d wulan",y:"setaun",yy:"%d taun"},week:{dow:1,// Monday is the first day of the week.
doy:7}}),kg.defineLocale("ka",{months:{standalone:"იანვარი_თებერვალი_მარტი_აპრილი_მაისი_ივნისი_ივლისი_აგვისტო_სექტემბერი_ოქტომბერი_ნოემბერი_დეკემბერი".split("_"),format:"იანვარს_თებერვალს_მარტს_აპრილის_მაისს_ივნისს_ივლისს_აგვისტს_სექტემბერს_ოქტომბერს_ნოემბერს_დეკემბერს".split("_")},monthsShort:"იან_თებ_მარ_აპრ_მაი_ივნ_ივლ_აგვ_სექ_ოქტ_ნოე_დეკ".split("_"),weekdays:{standalone:"კვირა_ორშაბათი_სამშაბათი_ოთხშაბათი_ხუთშაბათი_პარასკევი_შაბათი".split("_"),format:"კვირას_ორშაბათს_სამშაბათს_ოთხშაბათს_ხუთშაბათს_პარასკევს_შაბათს".split("_"),isFormat:/(წინა|შემდეგ)/},weekdaysShort:"კვი_ორშ_სამ_ოთხ_ხუთ_პარ_შაბ".split("_"),weekdaysMin:"კვ_ორ_სა_ოთ_ხუ_პა_შა".split("_"),longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY h:mm A",LLLL:"dddd, D MMMM YYYY h:mm A"},calendar:{sameDay:"[დღეს] LT[-ზე]",nextDay:"[ხვალ] LT[-ზე]",lastDay:"[გუშინ] LT[-ზე]",nextWeek:"[შემდეგ] dddd LT[-ზე]",lastWeek:"[წინა] dddd LT-ზე",sameElse:"L"},relativeTime:{future:function(a){return/(წამი|წუთი|საათი|წელი)/.test(a)?a.replace(/ი$/,"ში"):a+"ში"},past:function(a){return/(წამი|წუთი|საათი|დღე|თვე)/.test(a)?a.replace(/(ი|ე)$/,"ის წინ"):/წელი/.test(a)?a.replace(/წელი$/,"წლის წინ"):void 0},s:"რამდენიმე წამი",m:"წუთი",mm:"%d წუთი",h:"საათი",hh:"%d საათი",d:"დღე",dd:"%d დღე",M:"თვე",MM:"%d თვე",y:"წელი",yy:"%d წელი"},ordinalParse:/0|1-ლი|მე-\d{1,2}|\d{1,2}-ე/,ordinal:function(a){return 0===a?a:1===a?a+"-ლი":20>a||100>=a&&a%20===0||a%100===0?"მე-"+a:a+"-ე"},week:{dow:1,doy:7}}),{0:"-ші",1:"-ші",2:"-ші",3:"-ші",4:"-ші",5:"-ші",6:"-шы",7:"-ші",8:"-ші",9:"-шы",10:"-шы",20:"-шы",30:"-шы",40:"-шы",50:"-ші",60:"-шы",70:"-ші",80:"-ші",90:"-шы",100:"-ші"}),Vg=(kg.defineLocale("kk",{months:"қаңтар_ақпан_наурыз_сәуір_мамыр_маусым_шілде_тамыз_қыркүйек_қазан_қараша_желтоқсан".split("_"),monthsShort:"қаң_ақп_нау_сәу_мам_мау_шіл_там_қыр_қаз_қар_жел".split("_"),weekdays:"жексенбі_дүйсенбі_сейсенбі_сәрсенбі_бейсенбі_жұма_сенбі".split("_"),weekdaysShort:"жек_дүй_сей_сәр_бей_жұм_сен".split("_"),weekdaysMin:"жк_дй_сй_ср_бй_жм_сн".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[Бүгін сағат] LT",nextDay:"[Ертең сағат] LT",nextWeek:"dddd [сағат] LT",lastDay:"[Кеше сағат] LT",lastWeek:"[Өткен аптаның] dddd [сағат] LT",sameElse:"L"},relativeTime:{future:"%s ішінде",past:"%s бұрын",s:"бірнеше секунд",m:"бір минут",mm:"%d минут",h:"бір сағат",hh:"%d сағат",d:"бір күн",dd:"%d күн",M:"бір ай",MM:"%d ай",y:"бір жыл",yy:"%d жыл"},ordinalParse:/\d{1,2}-(ші|шы)/,ordinal:function(a){var b=a%10,c=a>=100?100:null;return a+(Ug[a]||Ug[b]||Ug[c])},week:{dow:1,// Monday is the first day of the week.
doy:7}}),kg.defineLocale("km",{months:"មករា_កុម្ភៈ_មីនា_មេសា_ឧសភា_មិថុនា_កក្កដា_សីហា_កញ្ញា_តុលា_វិច្ឆិកា_ធ្នូ".split("_"),monthsShort:"មករា_កុម្ភៈ_មីនា_មេសា_ឧសភា_មិថុនា_កក្កដា_សីហា_កញ្ញា_តុលា_វិច្ឆិកា_ធ្នូ".split("_"),weekdays:"អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍".split("_"),weekdaysShort:"អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍".split("_"),weekdaysMin:"អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[ថ្ងៃនេះ ម៉ោង] LT",nextDay:"[ស្អែក ម៉ោង] LT",nextWeek:"dddd [ម៉ោង] LT",lastDay:"[ម្សិលមិញ ម៉ោង] LT",lastWeek:"dddd [សប្តាហ៍មុន] [ម៉ោង] LT",sameElse:"L"},relativeTime:{future:"%sទៀត",past:"%sមុន",s:"ប៉ុន្មានវិនាទី",m:"មួយនាទី",mm:"%d នាទី",h:"មួយម៉ោង",hh:"%d ម៉ោង",d:"មួយថ្ងៃ",dd:"%d ថ្ងៃ",M:"មួយខែ",MM:"%d ខែ",y:"មួយឆ្នាំ",yy:"%d ឆ្នាំ"},week:{dow:1,// Monday is the first day of the week.
doy:4}}),kg.defineLocale("ko",{months:"1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월".split("_"),monthsShort:"1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월".split("_"),weekdays:"일요일_월요일_화요일_수요일_목요일_금요일_토요일".split("_"),weekdaysShort:"일_월_화_수_목_금_토".split("_"),weekdaysMin:"일_월_화_수_목_금_토".split("_"),longDateFormat:{LT:"A h시 m분",LTS:"A h시 m분 s초",L:"YYYY.MM.DD",LL:"YYYY년 MMMM D일",LLL:"YYYY년 MMMM D일 A h시 m분",LLLL:"YYYY년 MMMM D일 dddd A h시 m분"},calendar:{sameDay:"오늘 LT",nextDay:"내일 LT",nextWeek:"dddd LT",lastDay:"어제 LT",lastWeek:"지난주 dddd LT",sameElse:"L"},relativeTime:{future:"%s 후",past:"%s 전",s:"몇 초",ss:"%d초",m:"일분",mm:"%d분",h:"한 시간",hh:"%d시간",d:"하루",dd:"%d일",M:"한 달",MM:"%d달",y:"일 년",yy:"%d년"},ordinalParse:/\d{1,2}일/,ordinal:"%d일",meridiemParse:/오전|오후/,isPM:function(a){return"오후"===a},meridiem:function(a,b,c){return 12>a?"오전":"오후"}}),{0:"-чү",1:"-чи",2:"-чи",3:"-чү",4:"-чү",5:"-чи",6:"-чы",7:"-чи",8:"-чи",9:"-чу",10:"-чу",20:"-чы",30:"-чу",40:"-чы",50:"-чү",60:"-чы",70:"-чи",80:"-чи",90:"-чу",100:"-чү"}),Wg=(kg.defineLocale("ky",{months:"январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь".split("_"),monthsShort:"янв_фев_март_апр_май_июнь_июль_авг_сен_окт_ноя_дек".split("_"),weekdays:"Жекшемби_Дүйшөмбү_Шейшемби_Шаршемби_Бейшемби_Жума_Ишемби".split("_"),weekdaysShort:"Жек_Дүй_Шей_Шар_Бей_Жум_Ише".split("_"),weekdaysMin:"Жк_Дй_Шй_Шр_Бй_Жм_Иш".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[Бүгүн саат] LT",nextDay:"[Эртең саат] LT",nextWeek:"dddd [саат] LT",lastDay:"[Кече саат] LT",lastWeek:"[Өткен аптанын] dddd [күнү] [саат] LT",sameElse:"L"},relativeTime:{future:"%s ичинде",past:"%s мурун",s:"бирнече секунд",m:"бир мүнөт",mm:"%d мүнөт",h:"бир саат",hh:"%d саат",d:"бир күн",dd:"%d күн",M:"бир ай",MM:"%d ай",y:"бир жыл",yy:"%d жыл"},ordinalParse:/\d{1,2}-(чи|чы|чү|чу)/,ordinal:function(a){var b=a%10,c=a>=100?100:null;return a+(Vg[a]||Vg[b]||Vg[c])},week:{dow:1,// Monday is the first day of the week.
doy:7}}),kg.defineLocale("lb",{months:"Januar_Februar_Mäerz_Abrëll_Mee_Juni_Juli_August_September_Oktober_November_Dezember".split("_"),monthsShort:"Jan._Febr._Mrz._Abr._Mee_Jun._Jul._Aug._Sept._Okt._Nov._Dez.".split("_"),monthsParseExact:!0,weekdays:"Sonndeg_Méindeg_Dënschdeg_Mëttwoch_Donneschdeg_Freideg_Samschdeg".split("_"),weekdaysShort:"So._Mé._Dë._Më._Do._Fr._Sa.".split("_"),weekdaysMin:"So_Mé_Dë_Më_Do_Fr_Sa".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"H:mm [Auer]",LTS:"H:mm:ss [Auer]",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm [Auer]",LLLL:"dddd, D. MMMM YYYY H:mm [Auer]"},calendar:{sameDay:"[Haut um] LT",sameElse:"L",nextDay:"[Muer um] LT",nextWeek:"dddd [um] LT",lastDay:"[Gëschter um] LT",lastWeek:function(){
// Different date string for 'Dënschdeg' (Tuesday) and 'Donneschdeg' (Thursday) due to phonological rule
switch(this.day()){case 2:case 4:return"[Leschten] dddd [um] LT";default:return"[Leschte] dddd [um] LT"}}},relativeTime:{future:Hd,past:Id,s:"e puer Sekonnen",m:Gd,mm:"%d Minutten",h:Gd,hh:"%d Stonnen",d:Gd,dd:"%d Deeg",M:Gd,MM:"%d Méint",y:Gd,yy:"%d Joer"},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,// Monday is the first day of the week.
doy:4}}),kg.defineLocale("lo",{months:"ມັງກອນ_ກຸມພາ_ມີນາ_ເມສາ_ພຶດສະພາ_ມິຖຸນາ_ກໍລະກົດ_ສິງຫາ_ກັນຍາ_ຕຸລາ_ພະຈິກ_ທັນວາ".split("_"),monthsShort:"ມັງກອນ_ກຸມພາ_ມີນາ_ເມສາ_ພຶດສະພາ_ມິຖຸນາ_ກໍລະກົດ_ສິງຫາ_ກັນຍາ_ຕຸລາ_ພະຈິກ_ທັນວາ".split("_"),weekdays:"ອາທິດ_ຈັນ_ອັງຄານ_ພຸດ_ພະຫັດ_ສຸກ_ເສົາ".split("_"),weekdaysShort:"ທິດ_ຈັນ_ອັງຄານ_ພຸດ_ພະຫັດ_ສຸກ_ເສົາ".split("_"),weekdaysMin:"ທ_ຈ_ອຄ_ພ_ພຫ_ສກ_ສ".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"ວັນdddd D MMMM YYYY HH:mm"},meridiemParse:/ຕອນເຊົ້າ|ຕອນແລງ/,isPM:function(a){return"ຕອນແລງ"===a},meridiem:function(a,b,c){return 12>a?"ຕອນເຊົ້າ":"ຕອນແລງ"},calendar:{sameDay:"[ມື້ນີ້ເວລາ] LT",nextDay:"[ມື້ອື່ນເວລາ] LT",nextWeek:"[ວັນ]dddd[ໜ້າເວລາ] LT",lastDay:"[ມື້ວານນີ້ເວລາ] LT",lastWeek:"[ວັນ]dddd[ແລ້ວນີ້ເວລາ] LT",sameElse:"L"},relativeTime:{future:"ອີກ %s",past:"%sຜ່ານມາ",s:"ບໍ່ເທົ່າໃດວິນາທີ",m:"1 ນາທີ",mm:"%d ນາທີ",h:"1 ຊົ່ວໂມງ",hh:"%d ຊົ່ວໂມງ",d:"1 ມື້",dd:"%d ມື້",M:"1 ເດືອນ",MM:"%d ເດືອນ",y:"1 ປີ",yy:"%d ປີ"},ordinalParse:/(ທີ່)\d{1,2}/,ordinal:function(a){return"ທີ່"+a}}),{m:"minutė_minutės_minutę",mm:"minutės_minučių_minutes",h:"valanda_valandos_valandą",hh:"valandos_valandų_valandas",d:"diena_dienos_dieną",dd:"dienos_dienų_dienas",M:"mėnuo_mėnesio_mėnesį",MM:"mėnesiai_mėnesių_mėnesius",y:"metai_metų_metus",yy:"metai_metų_metus"}),Xg=(kg.defineLocale("lt",{months:{format:"sausio_vasario_kovo_balandžio_gegužės_birželio_liepos_rugpjūčio_rugsėjo_spalio_lapkričio_gruodžio".split("_"),standalone:"sausis_vasaris_kovas_balandis_gegužė_birželis_liepa_rugpjūtis_rugsėjis_spalis_lapkritis_gruodis".split("_"),isFormat:/D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?|MMMM?(\[[^\[\]]*\]|\s+)+D[oD]?/},monthsShort:"sau_vas_kov_bal_geg_bir_lie_rgp_rgs_spa_lap_grd".split("_"),weekdays:{format:"sekmadienį_pirmadienį_antradienį_trečiadienį_ketvirtadienį_penktadienį_šeštadienį".split("_"),standalone:"sekmadienis_pirmadienis_antradienis_trečiadienis_ketvirtadienis_penktadienis_šeštadienis".split("_"),isFormat:/dddd HH:mm/},weekdaysShort:"Sek_Pir_Ant_Tre_Ket_Pen_Šeš".split("_"),weekdaysMin:"S_P_A_T_K_Pn_Š".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"YYYY-MM-DD",LL:"YYYY [m.] MMMM D [d.]",LLL:"YYYY [m.] MMMM D [d.], HH:mm [val.]",LLLL:"YYYY [m.] MMMM D [d.], dddd, HH:mm [val.]",l:"YYYY-MM-DD",ll:"YYYY [m.] MMMM D [d.]",lll:"YYYY [m.] MMMM D [d.], HH:mm [val.]",llll:"YYYY [m.] MMMM D [d.], ddd, HH:mm [val.]"},calendar:{sameDay:"[Šiandien] LT",nextDay:"[Rytoj] LT",nextWeek:"dddd LT",lastDay:"[Vakar] LT",lastWeek:"[Praėjusį] dddd LT",sameElse:"L"},relativeTime:{future:"po %s",past:"prieš %s",s:Kd,m:Ld,mm:Od,h:Ld,hh:Od,d:Ld,dd:Od,M:Ld,MM:Od,y:Ld,yy:Od},ordinalParse:/\d{1,2}-oji/,ordinal:function(a){return a+"-oji"},week:{dow:1,// Monday is the first day of the week.
doy:4}}),{m:"minūtes_minūtēm_minūte_minūtes".split("_"),mm:"minūtes_minūtēm_minūte_minūtes".split("_"),h:"stundas_stundām_stunda_stundas".split("_"),hh:"stundas_stundām_stunda_stundas".split("_"),d:"dienas_dienām_diena_dienas".split("_"),dd:"dienas_dienām_diena_dienas".split("_"),M:"mēneša_mēnešiem_mēnesis_mēneši".split("_"),MM:"mēneša_mēnešiem_mēnesis_mēneši".split("_"),y:"gada_gadiem_gads_gadi".split("_"),yy:"gada_gadiem_gads_gadi".split("_")}),Yg=(kg.defineLocale("lv",{months:"janvāris_februāris_marts_aprīlis_maijs_jūnijs_jūlijs_augusts_septembris_oktobris_novembris_decembris".split("_"),monthsShort:"jan_feb_mar_apr_mai_jūn_jūl_aug_sep_okt_nov_dec".split("_"),weekdays:"svētdiena_pirmdiena_otrdiena_trešdiena_ceturtdiena_piektdiena_sestdiena".split("_"),weekdaysShort:"Sv_P_O_T_C_Pk_S".split("_"),weekdaysMin:"Sv_P_O_T_C_Pk_S".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY.",LL:"YYYY. [gada] D. MMMM",LLL:"YYYY. [gada] D. MMMM, HH:mm",LLLL:"YYYY. [gada] D. MMMM, dddd, HH:mm"},calendar:{sameDay:"[Šodien pulksten] LT",nextDay:"[Rīt pulksten] LT",nextWeek:"dddd [pulksten] LT",lastDay:"[Vakar pulksten] LT",lastWeek:"[Pagājušā] dddd [pulksten] LT",sameElse:"L"},relativeTime:{future:"pēc %s",past:"pirms %s",s:Sd,m:Rd,mm:Qd,h:Rd,hh:Qd,d:Rd,dd:Qd,M:Rd,MM:Qd,y:Rd,yy:Qd},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,// Monday is the first day of the week.
doy:4}}),{words:{//Different grammatical cases
m:["jedan minut","jednog minuta"],mm:["minut","minuta","minuta"],h:["jedan sat","jednog sata"],hh:["sat","sata","sati"],dd:["dan","dana","dana"],MM:["mjesec","mjeseca","mjeseci"],yy:["godina","godine","godina"]},correctGrammaticalCase:function(a,b){return 1===a?b[0]:a>=2&&4>=a?b[1]:b[2]},translate:function(a,b,c){var d=Yg.words[c];return 1===c.length?b?d[0]:d[1]:a+" "+Yg.correctGrammaticalCase(a,d)}}),Zg=(kg.defineLocale("me",{months:"januar_februar_mart_april_maj_jun_jul_avgust_septembar_oktobar_novembar_decembar".split("_"),monthsShort:"jan._feb._mar._apr._maj_jun_jul_avg._sep._okt._nov._dec.".split("_"),monthsParseExact:!0,weekdays:"nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota".split("_"),weekdaysShort:"ned._pon._uto._sri._čet._pet._sub.".split("_"),weekdaysMin:"ne_po_ut_sr_če_pe_su".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD. MM. YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm",LLLL:"dddd, D. MMMM YYYY H:mm"},calendar:{sameDay:"[danas u] LT",nextDay:"[sjutra u] LT",nextWeek:function(){switch(this.day()){case 0:return"[u] [nedjelju] [u] LT";case 3:return"[u] [srijedu] [u] LT";case 6:return"[u] [subotu] [u] LT";case 1:case 2:case 4:case 5:return"[u] dddd [u] LT"}},lastDay:"[juče u] LT",lastWeek:function(){var a=["[prošle] [nedjelje] [u] LT","[prošlog] [ponedjeljka] [u] LT","[prošlog] [utorka] [u] LT","[prošle] [srijede] [u] LT","[prošlog] [četvrtka] [u] LT","[prošlog] [petka] [u] LT","[prošle] [subote] [u] LT"];return a[this.day()]},sameElse:"L"},relativeTime:{future:"za %s",past:"prije %s",s:"nekoliko sekundi",m:Yg.translate,mm:Yg.translate,h:Yg.translate,hh:Yg.translate,d:"dan",dd:Yg.translate,M:"mjesec",MM:Yg.translate,y:"godinu",yy:Yg.translate},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,// Monday is the first day of the week.
doy:7}}),kg.defineLocale("mk",{months:"јануари_февруари_март_април_мај_јуни_јули_август_септември_октомври_ноември_декември".split("_"),monthsShort:"јан_фев_мар_апр_мај_јун_јул_авг_сеп_окт_ное_дек".split("_"),weekdays:"недела_понеделник_вторник_среда_четврток_петок_сабота".split("_"),weekdaysShort:"нед_пон_вто_сре_чет_пет_саб".split("_"),weekdaysMin:"нe_пo_вт_ср_че_пе_сa".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"D.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY H:mm",LLLL:"dddd, D MMMM YYYY H:mm"},calendar:{sameDay:"[Денес во] LT",nextDay:"[Утре во] LT",nextWeek:"[Во] dddd [во] LT",lastDay:"[Вчера во] LT",lastWeek:function(){switch(this.day()){case 0:case 3:case 6:return"[Изминатата] dddd [во] LT";case 1:case 2:case 4:case 5:return"[Изминатиот] dddd [во] LT"}},sameElse:"L"},relativeTime:{future:"после %s",past:"пред %s",s:"неколку секунди",m:"минута",mm:"%d минути",h:"час",hh:"%d часа",d:"ден",dd:"%d дена",M:"месец",MM:"%d месеци",y:"година",yy:"%d години"},ordinalParse:/\d{1,2}-(ев|ен|ти|ви|ри|ми)/,ordinal:function(a){var b=a%10,c=a%100;return 0===a?a+"-ев":0===c?a+"-ен":c>10&&20>c?a+"-ти":1===b?a+"-ви":2===b?a+"-ри":7===b||8===b?a+"-ми":a+"-ти"},week:{dow:1,// Monday is the first day of the week.
doy:7}}),kg.defineLocale("ml",{months:"ജനുവരി_ഫെബ്രുവരി_മാർച്ച്_ഏപ്രിൽ_മേയ്_ജൂൺ_ജൂലൈ_ഓഗസ്റ്റ്_സെപ്റ്റംബർ_ഒക്ടോബർ_നവംബർ_ഡിസംബർ".split("_"),monthsShort:"ജനു._ഫെബ്രു._മാർ._ഏപ്രി._മേയ്_ജൂൺ_ജൂലൈ._ഓഗ._സെപ്റ്റ._ഒക്ടോ._നവം._ഡിസം.".split("_"),monthsParseExact:!0,weekdays:"ഞായറാഴ്ച_തിങ്കളാഴ്ച_ചൊവ്വാഴ്ച_ബുധനാഴ്ച_വ്യാഴാഴ്ച_വെള്ളിയാഴ്ച_ശനിയാഴ്ച".split("_"),weekdaysShort:"ഞായർ_തിങ്കൾ_ചൊവ്വ_ബുധൻ_വ്യാഴം_വെള്ളി_ശനി".split("_"),weekdaysMin:"ഞാ_തി_ചൊ_ബു_വ്യാ_വെ_ശ".split("_"),longDateFormat:{LT:"A h:mm -നു",LTS:"A h:mm:ss -നു",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, A h:mm -നു",LLLL:"dddd, D MMMM YYYY, A h:mm -നു"},calendar:{sameDay:"[ഇന്ന്] LT",nextDay:"[നാളെ] LT",nextWeek:"dddd, LT",lastDay:"[ഇന്നലെ] LT",lastWeek:"[കഴിഞ്ഞ] dddd, LT",sameElse:"L"},relativeTime:{future:"%s കഴിഞ്ഞ്",past:"%s മുൻപ്",s:"അൽപ നിമിഷങ്ങൾ",m:"ഒരു മിനിറ്റ്",mm:"%d മിനിറ്റ്",h:"ഒരു മണിക്കൂർ",hh:"%d മണിക്കൂർ",d:"ഒരു ദിവസം",dd:"%d ദിവസം",M:"ഒരു മാസം",MM:"%d മാസം",y:"ഒരു വർഷം",yy:"%d വർഷം"},meridiemParse:/രാത്രി|രാവിലെ|ഉച്ച കഴിഞ്ഞ്|വൈകുന്നേരം|രാത്രി/i,meridiemHour:function(a,b){return 12===a&&(a=0),"രാത്രി"===b&&a>=4||"ഉച്ച കഴിഞ്ഞ്"===b||"വൈകുന്നേരം"===b?a+12:a},meridiem:function(a,b,c){return 4>a?"രാത്രി":12>a?"രാവിലെ":17>a?"ഉച്ച കഴിഞ്ഞ്":20>a?"വൈകുന്നേരം":"രാത്രി"}}),{1:"१",2:"२",3:"३",4:"४",5:"५",6:"६",7:"७",8:"८",9:"९",0:"०"}),$g={"१":"1","२":"2","३":"3","४":"4","५":"5","६":"6","७":"7","८":"8","९":"9","०":"0"},_g=(kg.defineLocale("mr",{months:"जानेवारी_फेब्रुवारी_मार्च_एप्रिल_मे_जून_जुलै_ऑगस्ट_सप्टेंबर_ऑक्टोबर_नोव्हेंबर_डिसेंबर".split("_"),monthsShort:"जाने._फेब्रु._मार्च._एप्रि._मे._जून._जुलै._ऑग._सप्टें._ऑक्टो._नोव्हें._डिसें.".split("_"),monthsParseExact:!0,weekdays:"रविवार_सोमवार_मंगळवार_बुधवार_गुरूवार_शुक्रवार_शनिवार".split("_"),weekdaysShort:"रवि_सोम_मंगळ_बुध_गुरू_शुक्र_शनि".split("_"),weekdaysMin:"र_सो_मं_बु_गु_शु_श".split("_"),longDateFormat:{LT:"A h:mm वाजता",LTS:"A h:mm:ss वाजता",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, A h:mm वाजता",LLLL:"dddd, D MMMM YYYY, A h:mm वाजता"},calendar:{sameDay:"[आज] LT",nextDay:"[उद्या] LT",nextWeek:"dddd, LT",lastDay:"[काल] LT",lastWeek:"[मागील] dddd, LT",sameElse:"L"},relativeTime:{future:"%sमध्ये",past:"%sपूर्वी",s:Td,m:Td,mm:Td,h:Td,hh:Td,d:Td,dd:Td,M:Td,MM:Td,y:Td,yy:Td},preparse:function(a){return a.replace(/[१२३४५६७८९०]/g,function(a){return $g[a]})},postformat:function(a){return a.replace(/\d/g,function(a){return Zg[a]})},meridiemParse:/रात्री|सकाळी|दुपारी|सायंकाळी/,meridiemHour:function(a,b){return 12===a&&(a=0),"रात्री"===b?4>a?a:a+12:"सकाळी"===b?a:"दुपारी"===b?a>=10?a:a+12:"सायंकाळी"===b?a+12:void 0},meridiem:function(a,b,c){return 4>a?"रात्री":10>a?"सकाळी":17>a?"दुपारी":20>a?"सायंकाळी":"रात्री"},week:{dow:0,// Sunday is the first day of the week.
doy:6}}),kg.defineLocale("ms-my",{months:"Januari_Februari_Mac_April_Mei_Jun_Julai_Ogos_September_Oktober_November_Disember".split("_"),monthsShort:"Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ogs_Sep_Okt_Nov_Dis".split("_"),weekdays:"Ahad_Isnin_Selasa_Rabu_Khamis_Jumaat_Sabtu".split("_"),weekdaysShort:"Ahd_Isn_Sel_Rab_Kha_Jum_Sab".split("_"),weekdaysMin:"Ah_Is_Sl_Rb_Km_Jm_Sb".split("_"),longDateFormat:{LT:"HH.mm",LTS:"HH.mm.ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY [pukul] HH.mm",LLLL:"dddd, D MMMM YYYY [pukul] HH.mm"},meridiemParse:/pagi|tengahari|petang|malam/,meridiemHour:function(a,b){return 12===a&&(a=0),"pagi"===b?a:"tengahari"===b?a>=11?a:a+12:"petang"===b||"malam"===b?a+12:void 0},meridiem:function(a,b,c){return 11>a?"pagi":15>a?"tengahari":19>a?"petang":"malam"},calendar:{sameDay:"[Hari ini pukul] LT",nextDay:"[Esok pukul] LT",nextWeek:"dddd [pukul] LT",lastDay:"[Kelmarin pukul] LT",lastWeek:"dddd [lepas pukul] LT",sameElse:"L"},relativeTime:{future:"dalam %s",past:"%s yang lepas",s:"beberapa saat",m:"seminit",mm:"%d minit",h:"sejam",hh:"%d jam",d:"sehari",dd:"%d hari",M:"sebulan",MM:"%d bulan",y:"setahun",yy:"%d tahun"},week:{dow:1,// Monday is the first day of the week.
doy:7}}),kg.defineLocale("ms",{months:"Januari_Februari_Mac_April_Mei_Jun_Julai_Ogos_September_Oktober_November_Disember".split("_"),monthsShort:"Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ogs_Sep_Okt_Nov_Dis".split("_"),weekdays:"Ahad_Isnin_Selasa_Rabu_Khamis_Jumaat_Sabtu".split("_"),weekdaysShort:"Ahd_Isn_Sel_Rab_Kha_Jum_Sab".split("_"),weekdaysMin:"Ah_Is_Sl_Rb_Km_Jm_Sb".split("_"),longDateFormat:{LT:"HH.mm",LTS:"HH.mm.ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY [pukul] HH.mm",LLLL:"dddd, D MMMM YYYY [pukul] HH.mm"},meridiemParse:/pagi|tengahari|petang|malam/,meridiemHour:function(a,b){return 12===a&&(a=0),"pagi"===b?a:"tengahari"===b?a>=11?a:a+12:"petang"===b||"malam"===b?a+12:void 0},meridiem:function(a,b,c){return 11>a?"pagi":15>a?"tengahari":19>a?"petang":"malam"},calendar:{sameDay:"[Hari ini pukul] LT",nextDay:"[Esok pukul] LT",nextWeek:"dddd [pukul] LT",lastDay:"[Kelmarin pukul] LT",lastWeek:"dddd [lepas pukul] LT",sameElse:"L"},relativeTime:{future:"dalam %s",past:"%s yang lepas",s:"beberapa saat",m:"seminit",mm:"%d minit",h:"sejam",hh:"%d jam",d:"sehari",dd:"%d hari",M:"sebulan",MM:"%d bulan",y:"setahun",yy:"%d tahun"},week:{dow:1,// Monday is the first day of the week.
doy:7}}),{1:"၁",2:"၂",3:"၃",4:"၄",5:"၅",6:"၆",7:"၇",8:"၈",9:"၉",0:"၀"}),ah={"၁":"1","၂":"2","၃":"3","၄":"4","၅":"5","၆":"6","၇":"7","၈":"8","၉":"9","၀":"0"},bh=(kg.defineLocale("my",{months:"ဇန်နဝါရီ_ဖေဖော်ဝါရီ_မတ်_ဧပြီ_မေ_ဇွန်_ဇူလိုင်_သြဂုတ်_စက်တင်ဘာ_အောက်တိုဘာ_နိုဝင်ဘာ_ဒီဇင်ဘာ".split("_"),monthsShort:"ဇန်_ဖေ_မတ်_ပြီ_မေ_ဇွန်_လိုင်_သြ_စက်_အောက်_နို_ဒီ".split("_"),weekdays:"တနင်္ဂနွေ_တနင်္လာ_အင်္ဂါ_ဗုဒ္ဓဟူး_ကြာသပတေး_သောကြာ_စနေ".split("_"),weekdaysShort:"နွေ_လာ_ဂါ_ဟူး_ကြာ_သော_နေ".split("_"),weekdaysMin:"နွေ_လာ_ဂါ_ဟူး_ကြာ_သော_နေ".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[ယနေ.] LT [မှာ]",nextDay:"[မနက်ဖြန်] LT [မှာ]",nextWeek:"dddd LT [မှာ]",lastDay:"[မနေ.က] LT [မှာ]",lastWeek:"[ပြီးခဲ့သော] dddd LT [မှာ]",sameElse:"L"},relativeTime:{future:"လာမည့် %s မှာ",past:"လွန်ခဲ့သော %s က",s:"စက္ကန်.အနည်းငယ်",m:"တစ်မိနစ်",mm:"%d မိနစ်",h:"တစ်နာရီ",hh:"%d နာရီ",d:"တစ်ရက်",dd:"%d ရက်",M:"တစ်လ",MM:"%d လ",y:"တစ်နှစ်",yy:"%d နှစ်"},preparse:function(a){return a.replace(/[၁၂၃၄၅၆၇၈၉၀]/g,function(a){return ah[a]})},postformat:function(a){return a.replace(/\d/g,function(a){return _g[a]})},week:{dow:1,// Monday is the first day of the week.
doy:4}}),kg.defineLocale("nb",{months:"januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember".split("_"),monthsShort:"jan._feb._mars_april_mai_juni_juli_aug._sep._okt._nov._des.".split("_"),monthsParseExact:!0,weekdays:"søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag".split("_"),weekdaysShort:"sø._ma._ti._on._to._fr._lø.".split("_"),weekdaysMin:"sø_ma_ti_on_to_fr_lø".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY [kl.] HH:mm",LLLL:"dddd D. MMMM YYYY [kl.] HH:mm"},calendar:{sameDay:"[i dag kl.] LT",nextDay:"[i morgen kl.] LT",nextWeek:"dddd [kl.] LT",lastDay:"[i går kl.] LT",lastWeek:"[forrige] dddd [kl.] LT",sameElse:"L"},relativeTime:{future:"om %s",past:"%s siden",s:"noen sekunder",m:"ett minutt",mm:"%d minutter",h:"en time",hh:"%d timer",d:"en dag",dd:"%d dager",M:"en måned",MM:"%d måneder",y:"ett år",yy:"%d år"},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,// Monday is the first day of the week.
doy:4}}),{1:"१",2:"२",3:"३",4:"४",5:"५",6:"६",7:"७",8:"८",9:"९",0:"०"}),ch={"१":"1","२":"2","३":"3","४":"4","५":"5","६":"6","७":"7","८":"8","९":"9","०":"0"},dh=(kg.defineLocale("ne",{months:"जनवरी_फेब्रुवरी_मार्च_अप्रिल_मई_जुन_जुलाई_अगष्ट_सेप्टेम्बर_अक्टोबर_नोभेम्बर_डिसेम्बर".split("_"),monthsShort:"जन._फेब्रु._मार्च_अप्रि._मई_जुन_जुलाई._अग._सेप्ट._अक्टो._नोभे._डिसे.".split("_"),monthsParseExact:!0,weekdays:"आइतबार_सोमबार_मङ्गलबार_बुधबार_बिहिबार_शुक्रबार_शनिबार".split("_"),weekdaysShort:"आइत._सोम._मङ्गल._बुध._बिहि._शुक्र._शनि.".split("_"),weekdaysMin:"आ._सो._मं._बु._बि._शु._श.".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"Aको h:mm बजे",LTS:"Aको h:mm:ss बजे",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, Aको h:mm बजे",LLLL:"dddd, D MMMM YYYY, Aको h:mm बजे"},preparse:function(a){return a.replace(/[१२३४५६७८९०]/g,function(a){return ch[a]})},postformat:function(a){return a.replace(/\d/g,function(a){return bh[a]})},meridiemParse:/राति|बिहान|दिउँसो|साँझ/,meridiemHour:function(a,b){return 12===a&&(a=0),"राति"===b?4>a?a:a+12:"बिहान"===b?a:"दिउँसो"===b?a>=10?a:a+12:"साँझ"===b?a+12:void 0},meridiem:function(a,b,c){return 3>a?"राति":12>a?"बिहान":16>a?"दिउँसो":20>a?"साँझ":"राति"},calendar:{sameDay:"[आज] LT",nextDay:"[भोलि] LT",nextWeek:"[आउँदो] dddd[,] LT",lastDay:"[हिजो] LT",lastWeek:"[गएको] dddd[,] LT",sameElse:"L"},relativeTime:{future:"%sमा",past:"%s अगाडि",s:"केही क्षण",m:"एक मिनेट",mm:"%d मिनेट",h:"एक घण्टा",hh:"%d घण्टा",d:"एक दिन",dd:"%d दिन",M:"एक महिना",MM:"%d महिना",y:"एक बर्ष",yy:"%d बर्ष"},week:{dow:0,// Sunday is the first day of the week.
doy:6}}),"jan._feb._mrt._apr._mei_jun._jul._aug._sep._okt._nov._dec.".split("_")),eh="jan_feb_mrt_apr_mei_jun_jul_aug_sep_okt_nov_dec".split("_"),fh=(kg.defineLocale("nl",{months:"januari_februari_maart_april_mei_juni_juli_augustus_september_oktober_november_december".split("_"),monthsShort:function(a,b){return/-MMM-/.test(b)?eh[a.month()]:dh[a.month()]},monthsParseExact:!0,weekdays:"zondag_maandag_dinsdag_woensdag_donderdag_vrijdag_zaterdag".split("_"),weekdaysShort:"zo._ma._di._wo._do._vr._za.".split("_"),weekdaysMin:"Zo_Ma_Di_Wo_Do_Vr_Za".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD-MM-YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[vandaag om] LT",nextDay:"[morgen om] LT",nextWeek:"dddd [om] LT",lastDay:"[gisteren om] LT",lastWeek:"[afgelopen] dddd [om] LT",sameElse:"L"},relativeTime:{future:"over %s",past:"%s geleden",s:"een paar seconden",m:"één minuut",mm:"%d minuten",h:"één uur",hh:"%d uur",d:"één dag",dd:"%d dagen",M:"één maand",MM:"%d maanden",y:"één jaar",yy:"%d jaar"},ordinalParse:/\d{1,2}(ste|de)/,ordinal:function(a){return a+(1===a||8===a||a>=20?"ste":"de")},week:{dow:1,// Monday is the first day of the week.
doy:4}}),kg.defineLocale("nn",{months:"januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember".split("_"),monthsShort:"jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des".split("_"),weekdays:"sundag_måndag_tysdag_onsdag_torsdag_fredag_laurdag".split("_"),weekdaysShort:"sun_mån_tys_ons_tor_fre_lau".split("_"),weekdaysMin:"su_må_ty_on_to_fr_lø".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY [kl.] H:mm",LLLL:"dddd D. MMMM YYYY [kl.] HH:mm"},calendar:{sameDay:"[I dag klokka] LT",nextDay:"[I morgon klokka] LT",nextWeek:"dddd [klokka] LT",lastDay:"[I går klokka] LT",lastWeek:"[Føregåande] dddd [klokka] LT",sameElse:"L"},relativeTime:{future:"om %s",past:"%s sidan",s:"nokre sekund",m:"eit minutt",mm:"%d minutt",h:"ein time",hh:"%d timar",d:"ein dag",dd:"%d dagar",M:"ein månad",MM:"%d månader",y:"eit år",yy:"%d år"},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,// Monday is the first day of the week.
doy:4}}),{1:"੧",2:"੨",3:"੩",4:"੪",5:"੫",6:"੬",7:"੭",8:"੮",9:"੯",0:"੦"}),gh={"੧":"1","੨":"2","੩":"3","੪":"4","੫":"5","੬":"6","੭":"7","੮":"8","੯":"9","੦":"0"},hh=(kg.defineLocale("pa-in",{
// There are months name as per Nanakshahi Calender but they are not used as rigidly in modern Punjabi.
months:"ਜਨਵਰੀ_ਫ਼ਰਵਰੀ_ਮਾਰਚ_ਅਪ੍ਰੈਲ_ਮਈ_ਜੂਨ_ਜੁਲਾਈ_ਅਗਸਤ_ਸਤੰਬਰ_ਅਕਤੂਬਰ_ਨਵੰਬਰ_ਦਸੰਬਰ".split("_"),monthsShort:"ਜਨਵਰੀ_ਫ਼ਰਵਰੀ_ਮਾਰਚ_ਅਪ੍ਰੈਲ_ਮਈ_ਜੂਨ_ਜੁਲਾਈ_ਅਗਸਤ_ਸਤੰਬਰ_ਅਕਤੂਬਰ_ਨਵੰਬਰ_ਦਸੰਬਰ".split("_"),weekdays:"ਐਤਵਾਰ_ਸੋਮਵਾਰ_ਮੰਗਲਵਾਰ_ਬੁਧਵਾਰ_ਵੀਰਵਾਰ_ਸ਼ੁੱਕਰਵਾਰ_ਸ਼ਨੀਚਰਵਾਰ".split("_"),weekdaysShort:"ਐਤ_ਸੋਮ_ਮੰਗਲ_ਬੁਧ_ਵੀਰ_ਸ਼ੁਕਰ_ਸ਼ਨੀ".split("_"),weekdaysMin:"ਐਤ_ਸੋਮ_ਮੰਗਲ_ਬੁਧ_ਵੀਰ_ਸ਼ੁਕਰ_ਸ਼ਨੀ".split("_"),longDateFormat:{LT:"A h:mm ਵਜੇ",LTS:"A h:mm:ss ਵਜੇ",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, A h:mm ਵਜੇ",LLLL:"dddd, D MMMM YYYY, A h:mm ਵਜੇ"},calendar:{sameDay:"[ਅਜ] LT",nextDay:"[ਕਲ] LT",nextWeek:"dddd, LT",lastDay:"[ਕਲ] LT",lastWeek:"[ਪਿਛਲੇ] dddd, LT",sameElse:"L"},relativeTime:{future:"%s ਵਿੱਚ",past:"%s ਪਿਛਲੇ",s:"ਕੁਝ ਸਕਿੰਟ",m:"ਇਕ ਮਿੰਟ",mm:"%d ਮਿੰਟ",h:"ਇੱਕ ਘੰਟਾ",hh:"%d ਘੰਟੇ",d:"ਇੱਕ ਦਿਨ",dd:"%d ਦਿਨ",M:"ਇੱਕ ਮਹੀਨਾ",MM:"%d ਮਹੀਨੇ",y:"ਇੱਕ ਸਾਲ",yy:"%d ਸਾਲ"},preparse:function(a){return a.replace(/[੧੨੩੪੫੬੭੮੯੦]/g,function(a){return gh[a]})},postformat:function(a){return a.replace(/\d/g,function(a){return fh[a]})},
// Punjabi notation for meridiems are quite fuzzy in practice. While there exists
// a rigid notion of a 'Pahar' it is not used as rigidly in modern Punjabi.
meridiemParse:/ਰਾਤ|ਸਵੇਰ|ਦੁਪਹਿਰ|ਸ਼ਾਮ/,meridiemHour:function(a,b){return 12===a&&(a=0),"ਰਾਤ"===b?4>a?a:a+12:"ਸਵੇਰ"===b?a:"ਦੁਪਹਿਰ"===b?a>=10?a:a+12:"ਸ਼ਾਮ"===b?a+12:void 0},meridiem:function(a,b,c){return 4>a?"ਰਾਤ":10>a?"ਸਵੇਰ":17>a?"ਦੁਪਹਿਰ":20>a?"ਸ਼ਾਮ":"ਰਾਤ"},week:{dow:0,// Sunday is the first day of the week.
doy:6}}),"styczeń_luty_marzec_kwiecień_maj_czerwiec_lipiec_sierpień_wrzesień_październik_listopad_grudzień".split("_")),ih="stycznia_lutego_marca_kwietnia_maja_czerwca_lipca_sierpnia_września_października_listopada_grudnia".split("_"),jh=(kg.defineLocale("pl",{months:function(a,b){return""===b?"("+ih[a.month()]+"|"+hh[a.month()]+")":/D MMMM/.test(b)?ih[a.month()]:hh[a.month()]},monthsShort:"sty_lut_mar_kwi_maj_cze_lip_sie_wrz_paź_lis_gru".split("_"),weekdays:"niedziela_poniedziałek_wtorek_środa_czwartek_piątek_sobota".split("_"),weekdaysShort:"nie_pon_wt_śr_czw_pt_sb".split("_"),weekdaysMin:"Nd_Pn_Wt_Śr_Cz_Pt_So".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[Dziś o] LT",nextDay:"[Jutro o] LT",nextWeek:"[W] dddd [o] LT",lastDay:"[Wczoraj o] LT",lastWeek:function(){switch(this.day()){case 0:return"[W zeszłą niedzielę o] LT";case 3:return"[W zeszłą środę o] LT";case 6:return"[W zeszłą sobotę o] LT";default:return"[W zeszły] dddd [o] LT"}},sameElse:"L"},relativeTime:{future:"za %s",past:"%s temu",s:"kilka sekund",m:Vd,mm:Vd,h:Vd,hh:Vd,d:"1 dzień",dd:"%d dni",M:"miesiąc",MM:Vd,y:"rok",yy:Vd},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,// Monday is the first day of the week.
doy:4}}),kg.defineLocale("pt-br",{months:"Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro".split("_"),monthsShort:"Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez".split("_"),weekdays:"Domingo_Segunda-feira_Terça-feira_Quarta-feira_Quinta-feira_Sexta-feira_Sábado".split("_"),weekdaysShort:"Dom_Seg_Ter_Qua_Qui_Sex_Sáb".split("_"),weekdaysMin:"Dom_2ª_3ª_4ª_5ª_6ª_Sáb".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D [de] MMMM [de] YYYY",LLL:"D [de] MMMM [de] YYYY [às] HH:mm",LLLL:"dddd, D [de] MMMM [de] YYYY [às] HH:mm"},calendar:{sameDay:"[Hoje às] LT",nextDay:"[Amanhã às] LT",nextWeek:"dddd [às] LT",lastDay:"[Ontem às] LT",lastWeek:function(){// Saturday + Sunday
return 0===this.day()||6===this.day()?"[Último] dddd [às] LT":"[Última] dddd [às] LT"},sameElse:"L"},relativeTime:{future:"em %s",past:"%s atrás",s:"poucos segundos",m:"um minuto",mm:"%d minutos",h:"uma hora",hh:"%d horas",d:"um dia",dd:"%d dias",M:"um mês",MM:"%d meses",y:"um ano",yy:"%d anos"},ordinalParse:/\d{1,2}º/,ordinal:"%dº"}),kg.defineLocale("pt",{months:"Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro".split("_"),monthsShort:"Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez".split("_"),weekdays:"Domingo_Segunda-Feira_Terça-Feira_Quarta-Feira_Quinta-Feira_Sexta-Feira_Sábado".split("_"),weekdaysShort:"Dom_Seg_Ter_Qua_Qui_Sex_Sáb".split("_"),weekdaysMin:"Dom_2ª_3ª_4ª_5ª_6ª_Sáb".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D [de] MMMM [de] YYYY",LLL:"D [de] MMMM [de] YYYY HH:mm",LLLL:"dddd, D [de] MMMM [de] YYYY HH:mm"},calendar:{sameDay:"[Hoje às] LT",nextDay:"[Amanhã às] LT",nextWeek:"dddd [às] LT",lastDay:"[Ontem às] LT",lastWeek:function(){// Saturday + Sunday
return 0===this.day()||6===this.day()?"[Último] dddd [às] LT":"[Última] dddd [às] LT"},sameElse:"L"},relativeTime:{future:"em %s",past:"há %s",s:"segundos",m:"um minuto",mm:"%d minutos",h:"uma hora",hh:"%d horas",d:"um dia",dd:"%d dias",M:"um mês",MM:"%d meses",y:"um ano",yy:"%d anos"},ordinalParse:/\d{1,2}º/,ordinal:"%dº",week:{dow:1,// Monday is the first day of the week.
doy:4}}),kg.defineLocale("ro",{months:"ianuarie_februarie_martie_aprilie_mai_iunie_iulie_august_septembrie_octombrie_noiembrie_decembrie".split("_"),monthsShort:"ian._febr._mart._apr._mai_iun._iul._aug._sept._oct._nov._dec.".split("_"),monthsParseExact:!0,weekdays:"duminică_luni_marți_miercuri_joi_vineri_sâmbătă".split("_"),weekdaysShort:"Dum_Lun_Mar_Mie_Joi_Vin_Sâm".split("_"),weekdaysMin:"Du_Lu_Ma_Mi_Jo_Vi_Sâ".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY H:mm",LLLL:"dddd, D MMMM YYYY H:mm"},calendar:{sameDay:"[azi la] LT",nextDay:"[mâine la] LT",nextWeek:"dddd [la] LT",lastDay:"[ieri la] LT",lastWeek:"[fosta] dddd [la] LT",sameElse:"L"},relativeTime:{future:"peste %s",past:"%s în urmă",s:"câteva secunde",m:"un minut",mm:Wd,h:"o oră",hh:Wd,d:"o zi",dd:Wd,M:"o lună",MM:Wd,y:"un an",yy:Wd},week:{dow:1,// Monday is the first day of the week.
doy:7}}),[/^янв/i,/^фев/i,/^мар/i,/^апр/i,/^ма[йя]/i,/^июн/i,/^июл/i,/^авг/i,/^сен/i,/^окт/i,/^ноя/i,/^дек/i]),kh=(kg.defineLocale("ru",{months:{format:"января_февраля_марта_апреля_мая_июня_июля_августа_сентября_октября_ноября_декабря".split("_"),standalone:"январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь".split("_")},monthsShort:{
// по CLDR именно "июл." и "июн.", но какой смысл менять букву на точку ?
format:"янв._февр._мар._апр._мая_июня_июля_авг._сент._окт._нояб._дек.".split("_"),standalone:"янв._февр._март_апр._май_июнь_июль_авг._сент._окт._нояб._дек.".split("_")},weekdays:{standalone:"воскресенье_понедельник_вторник_среда_четверг_пятница_суббота".split("_"),format:"воскресенье_понедельник_вторник_среду_четверг_пятницу_субботу".split("_"),isFormat:/\[ ?[Вв] ?(?:прошлую|следующую|эту)? ?\] ?dddd/},weekdaysShort:"вс_пн_вт_ср_чт_пт_сб".split("_"),weekdaysMin:"вс_пн_вт_ср_чт_пт_сб".split("_"),monthsParse:jh,longMonthsParse:jh,shortMonthsParse:jh,
// полные названия с падежами, по три буквы, для некоторых, по 4 буквы, сокращения с точкой и без точки
monthsRegex:/^(январ[ья]|янв\.?|феврал[ья]|февр?\.?|марта?|мар\.?|апрел[ья]|апр\.?|ма[йя]|июн[ья]|июн\.?|июл[ья]|июл\.?|августа?|авг\.?|сентябр[ья]|сент?\.?|октябр[ья]|окт\.?|ноябр[ья]|нояб?\.?|декабр[ья]|дек\.?)/i,
// копия предыдущего
monthsShortRegex:/^(январ[ья]|янв\.?|феврал[ья]|февр?\.?|марта?|мар\.?|апрел[ья]|апр\.?|ма[йя]|июн[ья]|июн\.?|июл[ья]|июл\.?|августа?|авг\.?|сентябр[ья]|сент?\.?|октябр[ья]|окт\.?|ноябр[ья]|нояб?\.?|декабр[ья]|дек\.?)/i,
// полные названия с падежами
monthsStrictRegex:/^(январ[яь]|феврал[яь]|марта?|апрел[яь]|ма[яй]|июн[яь]|июл[яь]|августа?|сентябр[яь]|октябр[яь]|ноябр[яь]|декабр[яь])/i,
// Выражение, которое соотвествует только сокращённым формам
monthsShortStrictRegex:/^(янв\.|февр?\.|мар[т.]|апр\.|ма[яй]|июн[ья.]|июл[ья.]|авг\.|сент?\.|окт\.|нояб?\.|дек\.)/i,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY г.",LLL:"D MMMM YYYY г., HH:mm",LLLL:"dddd, D MMMM YYYY г., HH:mm"},calendar:{sameDay:"[Сегодня в] LT",nextDay:"[Завтра в] LT",lastDay:"[Вчера в] LT",nextWeek:function(a){if(a.week()===this.week())return 2===this.day()?"[Во] dddd [в] LT":"[В] dddd [в] LT";switch(this.day()){case 0:return"[В следующее] dddd [в] LT";case 1:case 2:case 4:return"[В следующий] dddd [в] LT";case 3:case 5:case 6:return"[В следующую] dddd [в] LT"}},lastWeek:function(a){if(a.week()===this.week())return 2===this.day()?"[Во] dddd [в] LT":"[В] dddd [в] LT";switch(this.day()){case 0:return"[В прошлое] dddd [в] LT";case 1:case 2:case 4:return"[В прошлый] dddd [в] LT";case 3:case 5:case 6:return"[В прошлую] dddd [в] LT"}},sameElse:"L"},relativeTime:{future:"через %s",past:"%s назад",s:"несколько секунд",m:Yd,mm:Yd,h:"час",hh:Yd,d:"день",dd:Yd,M:"месяц",MM:Yd,y:"год",yy:Yd},meridiemParse:/ночи|утра|дня|вечера/i,isPM:function(a){return/^(дня|вечера)$/.test(a)},meridiem:function(a,b,c){return 4>a?"ночи":12>a?"утра":17>a?"дня":"вечера"},ordinalParse:/\d{1,2}-(й|го|я)/,ordinal:function(a,b){switch(b){case"M":case"d":case"DDD":return a+"-й";case"D":return a+"-го";case"w":case"W":return a+"-я";default:return a}},week:{dow:1,// Monday is the first day of the week.
doy:7}}),kg.defineLocale("se",{months:"ođđajagemánnu_guovvamánnu_njukčamánnu_cuoŋománnu_miessemánnu_geassemánnu_suoidnemánnu_borgemánnu_čakčamánnu_golggotmánnu_skábmamánnu_juovlamánnu".split("_"),monthsShort:"ođđj_guov_njuk_cuo_mies_geas_suoi_borg_čakč_golg_skáb_juov".split("_"),weekdays:"sotnabeaivi_vuossárga_maŋŋebárga_gaskavahkku_duorastat_bearjadat_lávvardat".split("_"),weekdaysShort:"sotn_vuos_maŋ_gask_duor_bear_láv".split("_"),weekdaysMin:"s_v_m_g_d_b_L".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"MMMM D. [b.] YYYY",LLL:"MMMM D. [b.] YYYY [ti.] HH:mm",LLLL:"dddd, MMMM D. [b.] YYYY [ti.] HH:mm"},calendar:{sameDay:"[otne ti] LT",nextDay:"[ihttin ti] LT",nextWeek:"dddd [ti] LT",lastDay:"[ikte ti] LT",lastWeek:"[ovddit] dddd [ti] LT",sameElse:"L"},relativeTime:{future:"%s geažes",past:"maŋit %s",s:"moadde sekunddat",m:"okta minuhta",mm:"%d minuhtat",h:"okta diimmu",hh:"%d diimmut",d:"okta beaivi",dd:"%d beaivvit",M:"okta mánnu",MM:"%d mánut",y:"okta jahki",yy:"%d jagit"},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,// Monday is the first day of the week.
doy:4}}),kg.defineLocale("si",{months:"ජනවාරි_පෙබරවාරි_මාර්තු_අප්‍රේල්_මැයි_ජූනි_ජූලි_අගෝස්තු_සැප්තැම්බර්_ඔක්තෝබර්_නොවැම්බර්_දෙසැම්බර්".split("_"),monthsShort:"ජන_පෙබ_මාර්_අප්_මැයි_ජූනි_ජූලි_අගෝ_සැප්_ඔක්_නොවැ_දෙසැ".split("_"),weekdays:"ඉරිදා_සඳුදා_අඟහරුවාදා_බදාදා_බ්‍රහස්පතින්දා_සිකුරාදා_සෙනසුරාදා".split("_"),weekdaysShort:"ඉරි_සඳු_අඟ_බදා_බ්‍රහ_සිකු_සෙන".split("_"),weekdaysMin:"ඉ_ස_අ_බ_බ්‍ර_සි_සෙ".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"a h:mm",LTS:"a h:mm:ss",L:"YYYY/MM/DD",LL:"YYYY MMMM D",LLL:"YYYY MMMM D, a h:mm",LLLL:"YYYY MMMM D [වැනි] dddd, a h:mm:ss"},calendar:{sameDay:"[අද] LT[ට]",nextDay:"[හෙට] LT[ට]",nextWeek:"dddd LT[ට]",lastDay:"[ඊයේ] LT[ට]",lastWeek:"[පසුගිය] dddd LT[ට]",sameElse:"L"},relativeTime:{future:"%sකින්",past:"%sකට පෙර",s:"තත්පර කිහිපය",m:"මිනිත්තුව",mm:"මිනිත්තු %d",h:"පැය",hh:"පැය %d",d:"දිනය",dd:"දින %d",M:"මාසය",MM:"මාස %d",y:"වසර",yy:"වසර %d"},ordinalParse:/\d{1,2} වැනි/,ordinal:function(a){return a+" වැනි"},meridiemParse:/පෙර වරු|පස් වරු|පෙ.ව|ප.ව./,isPM:function(a){return"ප.ව."===a||"පස් වරු"===a},meridiem:function(a,b,c){return a>11?c?"ප.ව.":"පස් වරු":c?"පෙ.ව.":"පෙර වරු"}}),"január_február_marec_apríl_máj_jún_júl_august_september_október_november_december".split("_")),lh="jan_feb_mar_apr_máj_jún_júl_aug_sep_okt_nov_dec".split("_"),mh=(kg.defineLocale("sk",{months:kh,monthsShort:lh,weekdays:"nedeľa_pondelok_utorok_streda_štvrtok_piatok_sobota".split("_"),weekdaysShort:"ne_po_ut_st_št_pi_so".split("_"),weekdaysMin:"ne_po_ut_st_št_pi_so".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm",LLLL:"dddd D. MMMM YYYY H:mm"},calendar:{sameDay:"[dnes o] LT",nextDay:"[zajtra o] LT",nextWeek:function(){switch(this.day()){case 0:return"[v nedeľu o] LT";case 1:case 2:return"[v] dddd [o] LT";case 3:return"[v stredu o] LT";case 4:return"[vo štvrtok o] LT";case 5:return"[v piatok o] LT";case 6:return"[v sobotu o] LT"}},lastDay:"[včera o] LT",lastWeek:function(){switch(this.day()){case 0:return"[minulú nedeľu o] LT";case 1:case 2:return"[minulý] dddd [o] LT";case 3:return"[minulú stredu o] LT";case 4:case 5:return"[minulý] dddd [o] LT";case 6:return"[minulú sobotu o] LT"}},sameElse:"L"},relativeTime:{future:"za %s",past:"pred %s",s:$d,m:$d,mm:$d,h:$d,hh:$d,d:$d,dd:$d,M:$d,MM:$d,y:$d,yy:$d},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,// Monday is the first day of the week.
doy:4}}),kg.defineLocale("sl",{months:"januar_februar_marec_april_maj_junij_julij_avgust_september_oktober_november_december".split("_"),monthsShort:"jan._feb._mar._apr._maj._jun._jul._avg._sep._okt._nov._dec.".split("_"),monthsParseExact:!0,weekdays:"nedelja_ponedeljek_torek_sreda_četrtek_petek_sobota".split("_"),weekdaysShort:"ned._pon._tor._sre._čet._pet._sob.".split("_"),weekdaysMin:"ne_po_to_sr_če_pe_so".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD. MM. YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm",LLLL:"dddd, D. MMMM YYYY H:mm"},calendar:{sameDay:"[danes ob] LT",nextDay:"[jutri ob] LT",nextWeek:function(){switch(this.day()){case 0:return"[v] [nedeljo] [ob] LT";case 3:return"[v] [sredo] [ob] LT";case 6:return"[v] [soboto] [ob] LT";case 1:case 2:case 4:case 5:return"[v] dddd [ob] LT"}},lastDay:"[včeraj ob] LT",lastWeek:function(){switch(this.day()){case 0:return"[prejšnjo] [nedeljo] [ob] LT";case 3:return"[prejšnjo] [sredo] [ob] LT";case 6:return"[prejšnjo] [soboto] [ob] LT";case 1:case 2:case 4:case 5:return"[prejšnji] dddd [ob] LT"}},sameElse:"L"},relativeTime:{future:"čez %s",past:"pred %s",s:_d,m:_d,mm:_d,h:_d,hh:_d,d:_d,dd:_d,M:_d,MM:_d,y:_d,yy:_d},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,// Monday is the first day of the week.
doy:7}}),kg.defineLocale("sq",{months:"Janar_Shkurt_Mars_Prill_Maj_Qershor_Korrik_Gusht_Shtator_Tetor_Nëntor_Dhjetor".split("_"),monthsShort:"Jan_Shk_Mar_Pri_Maj_Qer_Kor_Gus_Sht_Tet_Nën_Dhj".split("_"),weekdays:"E Diel_E Hënë_E Martë_E Mërkurë_E Enjte_E Premte_E Shtunë".split("_"),weekdaysShort:"Die_Hën_Mar_Mër_Enj_Pre_Sht".split("_"),weekdaysMin:"D_H_Ma_Më_E_P_Sh".split("_"),weekdaysParseExact:!0,meridiemParse:/PD|MD/,isPM:function(a){return"M"===a.charAt(0)},meridiem:function(a,b,c){return 12>a?"PD":"MD"},longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[Sot në] LT",nextDay:"[Nesër në] LT",nextWeek:"dddd [në] LT",lastDay:"[Dje në] LT",lastWeek:"dddd [e kaluar në] LT",sameElse:"L"},relativeTime:{future:"në %s",past:"%s më parë",s:"disa sekonda",m:"një minutë",mm:"%d minuta",h:"një orë",hh:"%d orë",d:"një ditë",dd:"%d ditë",M:"një muaj",MM:"%d muaj",y:"një vit",yy:"%d vite"},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,// Monday is the first day of the week.
doy:4}}),{words:{//Different grammatical cases
m:["један минут","једне минуте"],mm:["минут","минуте","минута"],h:["један сат","једног сата"],hh:["сат","сата","сати"],dd:["дан","дана","дана"],MM:["месец","месеца","месеци"],yy:["година","године","година"]},correctGrammaticalCase:function(a,b){return 1===a?b[0]:a>=2&&4>=a?b[1]:b[2]},translate:function(a,b,c){var d=mh.words[c];return 1===c.length?b?d[0]:d[1]:a+" "+mh.correctGrammaticalCase(a,d)}}),nh=(kg.defineLocale("sr-cyrl",{months:"јануар_фебруар_март_април_мај_јун_јул_август_септембар_октобар_новембар_децембар".split("_"),monthsShort:"јан._феб._мар._апр._мај_јун_јул_авг._сеп._окт._нов._дец.".split("_"),monthsParseExact:!0,weekdays:"недеља_понедељак_уторак_среда_четвртак_петак_субота".split("_"),weekdaysShort:"нед._пон._уто._сре._чет._пет._суб.".split("_"),weekdaysMin:"не_по_ут_ср_че_пе_су".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD. MM. YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm",LLLL:"dddd, D. MMMM YYYY H:mm"},calendar:{sameDay:"[данас у] LT",nextDay:"[сутра у] LT",nextWeek:function(){switch(this.day()){case 0:return"[у] [недељу] [у] LT";case 3:return"[у] [среду] [у] LT";case 6:return"[у] [суботу] [у] LT";case 1:case 2:case 4:case 5:return"[у] dddd [у] LT"}},lastDay:"[јуче у] LT",lastWeek:function(){var a=["[прошле] [недеље] [у] LT","[прошлог] [понедељка] [у] LT","[прошлог] [уторка] [у] LT","[прошле] [среде] [у] LT","[прошлог] [четвртка] [у] LT","[прошлог] [петка] [у] LT","[прошле] [суботе] [у] LT"];return a[this.day()]},sameElse:"L"},relativeTime:{future:"за %s",past:"пре %s",s:"неколико секунди",m:mh.translate,mm:mh.translate,h:mh.translate,hh:mh.translate,d:"дан",dd:mh.translate,M:"месец",MM:mh.translate,y:"годину",yy:mh.translate},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,// Monday is the first day of the week.
doy:7}}),{words:{//Different grammatical cases
m:["jedan minut","jedne minute"],mm:["minut","minute","minuta"],h:["jedan sat","jednog sata"],hh:["sat","sata","sati"],dd:["dan","dana","dana"],MM:["mesec","meseca","meseci"],yy:["godina","godine","godina"]},correctGrammaticalCase:function(a,b){return 1===a?b[0]:a>=2&&4>=a?b[1]:b[2]},translate:function(a,b,c){var d=nh.words[c];return 1===c.length?b?d[0]:d[1]:a+" "+nh.correctGrammaticalCase(a,d)}}),oh=(kg.defineLocale("sr",{months:"januar_februar_mart_april_maj_jun_jul_avgust_septembar_oktobar_novembar_decembar".split("_"),monthsShort:"jan._feb._mar._apr._maj_jun_jul_avg._sep._okt._nov._dec.".split("_"),monthsParseExact:!0,weekdays:"nedelja_ponedeljak_utorak_sreda_četvrtak_petak_subota".split("_"),weekdaysShort:"ned._pon._uto._sre._čet._pet._sub.".split("_"),weekdaysMin:"ne_po_ut_sr_če_pe_su".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD. MM. YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm",LLLL:"dddd, D. MMMM YYYY H:mm"},calendar:{sameDay:"[danas u] LT",nextDay:"[sutra u] LT",nextWeek:function(){switch(this.day()){case 0:return"[u] [nedelju] [u] LT";case 3:return"[u] [sredu] [u] LT";case 6:return"[u] [subotu] [u] LT";case 1:case 2:case 4:case 5:return"[u] dddd [u] LT"}},lastDay:"[juče u] LT",lastWeek:function(){var a=["[prošle] [nedelje] [u] LT","[prošlog] [ponedeljka] [u] LT","[prošlog] [utorka] [u] LT","[prošle] [srede] [u] LT","[prošlog] [četvrtka] [u] LT","[prošlog] [petka] [u] LT","[prošle] [subote] [u] LT"];return a[this.day()]},sameElse:"L"},relativeTime:{future:"za %s",past:"pre %s",s:"nekoliko sekundi",m:nh.translate,mm:nh.translate,h:nh.translate,hh:nh.translate,d:"dan",dd:nh.translate,M:"mesec",MM:nh.translate,y:"godinu",yy:nh.translate},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,// Monday is the first day of the week.
doy:7}}),kg.defineLocale("ss",{months:"Bhimbidvwane_Indlovana_Indlov'lenkhulu_Mabasa_Inkhwekhweti_Inhlaba_Kholwane_Ingci_Inyoni_Imphala_Lweti_Ingongoni".split("_"),monthsShort:"Bhi_Ina_Inu_Mab_Ink_Inh_Kho_Igc_Iny_Imp_Lwe_Igo".split("_"),weekdays:"Lisontfo_Umsombuluko_Lesibili_Lesitsatfu_Lesine_Lesihlanu_Umgcibelo".split("_"),weekdaysShort:"Lis_Umb_Lsb_Les_Lsi_Lsh_Umg".split("_"),weekdaysMin:"Li_Us_Lb_Lt_Ls_Lh_Ug".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY h:mm A",LLLL:"dddd, D MMMM YYYY h:mm A"},calendar:{sameDay:"[Namuhla nga] LT",nextDay:"[Kusasa nga] LT",nextWeek:"dddd [nga] LT",lastDay:"[Itolo nga] LT",lastWeek:"dddd [leliphelile] [nga] LT",sameElse:"L"},relativeTime:{future:"nga %s",past:"wenteka nga %s",s:"emizuzwana lomcane",m:"umzuzu",mm:"%d emizuzu",h:"lihora",hh:"%d emahora",d:"lilanga",dd:"%d emalanga",M:"inyanga",MM:"%d tinyanga",y:"umnyaka",yy:"%d iminyaka"},meridiemParse:/ekuseni|emini|entsambama|ebusuku/,meridiem:function(a,b,c){return 11>a?"ekuseni":15>a?"emini":19>a?"entsambama":"ebusuku"},meridiemHour:function(a,b){return 12===a&&(a=0),"ekuseni"===b?a:"emini"===b?a>=11?a:a+12:"entsambama"===b||"ebusuku"===b?0===a?0:a+12:void 0},ordinalParse:/\d{1,2}/,ordinal:"%d",week:{dow:1,// Monday is the first day of the week.
doy:4}}),kg.defineLocale("sv",{months:"januari_februari_mars_april_maj_juni_juli_augusti_september_oktober_november_december".split("_"),monthsShort:"jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec".split("_"),weekdays:"söndag_måndag_tisdag_onsdag_torsdag_fredag_lördag".split("_"),weekdaysShort:"sön_mån_tis_ons_tor_fre_lör".split("_"),weekdaysMin:"sö_må_ti_on_to_fr_lö".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"YYYY-MM-DD",LL:"D MMMM YYYY",LLL:"D MMMM YYYY [kl.] HH:mm",LLLL:"dddd D MMMM YYYY [kl.] HH:mm",lll:"D MMM YYYY HH:mm",llll:"ddd D MMM YYYY HH:mm"},calendar:{sameDay:"[Idag] LT",nextDay:"[Imorgon] LT",lastDay:"[Igår] LT",nextWeek:"[På] dddd LT",lastWeek:"[I] dddd[s] LT",sameElse:"L"},relativeTime:{future:"om %s",past:"för %s sedan",s:"några sekunder",m:"en minut",mm:"%d minuter",h:"en timme",hh:"%d timmar",d:"en dag",dd:"%d dagar",M:"en månad",MM:"%d månader",y:"ett år",yy:"%d år"},ordinalParse:/\d{1,2}(e|a)/,ordinal:function(a){var b=a%10,c=1===~~(a%100/10)?"e":1===b?"a":2===b?"a":"e";return a+c},week:{dow:1,// Monday is the first day of the week.
doy:4}}),kg.defineLocale("sw",{months:"Januari_Februari_Machi_Aprili_Mei_Juni_Julai_Agosti_Septemba_Oktoba_Novemba_Desemba".split("_"),monthsShort:"Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ago_Sep_Okt_Nov_Des".split("_"),weekdays:"Jumapili_Jumatatu_Jumanne_Jumatano_Alhamisi_Ijumaa_Jumamosi".split("_"),weekdaysShort:"Jpl_Jtat_Jnne_Jtan_Alh_Ijm_Jmos".split("_"),weekdaysMin:"J2_J3_J4_J5_Al_Ij_J1".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[leo saa] LT",nextDay:"[kesho saa] LT",nextWeek:"[wiki ijayo] dddd [saat] LT",lastDay:"[jana] LT",lastWeek:"[wiki iliyopita] dddd [saat] LT",sameElse:"L"},relativeTime:{future:"%s baadaye",past:"tokea %s",s:"hivi punde",m:"dakika moja",mm:"dakika %d",h:"saa limoja",hh:"masaa %d",d:"siku moja",dd:"masiku %d",M:"mwezi mmoja",MM:"miezi %d",y:"mwaka mmoja",yy:"miaka %d"},week:{dow:1,// Monday is the first day of the week.
doy:7}}),{1:"௧",2:"௨",3:"௩",4:"௪",5:"௫",6:"௬",7:"௭",8:"௮",9:"௯",0:"௦"}),ph={"௧":"1","௨":"2","௩":"3","௪":"4","௫":"5","௬":"6","௭":"7","௮":"8","௯":"9","௦":"0"},qh=(kg.defineLocale("ta",{months:"ஜனவரி_பிப்ரவரி_மார்ச்_ஏப்ரல்_மே_ஜூன்_ஜூலை_ஆகஸ்ட்_செப்டெம்பர்_அக்டோபர்_நவம்பர்_டிசம்பர்".split("_"),monthsShort:"ஜனவரி_பிப்ரவரி_மார்ச்_ஏப்ரல்_மே_ஜூன்_ஜூலை_ஆகஸ்ட்_செப்டெம்பர்_அக்டோபர்_நவம்பர்_டிசம்பர்".split("_"),weekdays:"ஞாயிற்றுக்கிழமை_திங்கட்கிழமை_செவ்வாய்கிழமை_புதன்கிழமை_வியாழக்கிழமை_வெள்ளிக்கிழமை_சனிக்கிழமை".split("_"),weekdaysShort:"ஞாயிறு_திங்கள்_செவ்வாய்_புதன்_வியாழன்_வெள்ளி_சனி".split("_"),weekdaysMin:"ஞா_தி_செ_பு_வி_வெ_ச".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, HH:mm",LLLL:"dddd, D MMMM YYYY, HH:mm"},calendar:{sameDay:"[இன்று] LT",nextDay:"[நாளை] LT",nextWeek:"dddd, LT",lastDay:"[நேற்று] LT",lastWeek:"[கடந்த வாரம்] dddd, LT",sameElse:"L"},relativeTime:{future:"%s இல்",past:"%s முன்",s:"ஒரு சில விநாடிகள்",m:"ஒரு நிமிடம்",mm:"%d நிமிடங்கள்",h:"ஒரு மணி நேரம்",hh:"%d மணி நேரம்",d:"ஒரு நாள்",dd:"%d நாட்கள்",M:"ஒரு மாதம்",MM:"%d மாதங்கள்",y:"ஒரு வருடம்",yy:"%d ஆண்டுகள்"},ordinalParse:/\d{1,2}வது/,ordinal:function(a){return a+"வது"},preparse:function(a){return a.replace(/[௧௨௩௪௫௬௭௮௯௦]/g,function(a){return ph[a]})},postformat:function(a){return a.replace(/\d/g,function(a){return oh[a]})},
// refer http://ta.wikipedia.org/s/1er1
meridiemParse:/யாமம்|வைகறை|காலை|நண்பகல்|எற்பாடு|மாலை/,meridiem:function(a,b,c){return 2>a?" யாமம்":6>a?" வைகறை":10>a?" காலை":14>a?" நண்பகல்":18>a?" எற்பாடு":22>a?" மாலை":" யாமம்"},meridiemHour:function(a,b){return 12===a&&(a=0),"யாமம்"===b?2>a?a:a+12:"வைகறை"===b||"காலை"===b?a:"நண்பகல்"===b&&a>=10?a:a+12},week:{dow:0,// Sunday is the first day of the week.
doy:6}}),kg.defineLocale("te",{months:"జనవరి_ఫిబ్రవరి_మార్చి_ఏప్రిల్_మే_జూన్_జూలై_ఆగస్టు_సెప్టెంబర్_అక్టోబర్_నవంబర్_డిసెంబర్".split("_"),monthsShort:"జన._ఫిబ్ర._మార్చి_ఏప్రి._మే_జూన్_జూలై_ఆగ._సెప్._అక్టో._నవ._డిసె.".split("_"),monthsParseExact:!0,weekdays:"ఆదివారం_సోమవారం_మంగళవారం_బుధవారం_గురువారం_శుక్రవారం_శనివారం".split("_"),weekdaysShort:"ఆది_సోమ_మంగళ_బుధ_గురు_శుక్ర_శని".split("_"),weekdaysMin:"ఆ_సో_మం_బు_గు_శు_శ".split("_"),longDateFormat:{LT:"A h:mm",LTS:"A h:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, A h:mm",LLLL:"dddd, D MMMM YYYY, A h:mm"},calendar:{sameDay:"[నేడు] LT",nextDay:"[రేపు] LT",nextWeek:"dddd, LT",lastDay:"[నిన్న] LT",lastWeek:"[గత] dddd, LT",sameElse:"L"},relativeTime:{future:"%s లో",past:"%s క్రితం",s:"కొన్ని క్షణాలు",m:"ఒక నిమిషం",mm:"%d నిమిషాలు",h:"ఒక గంట",hh:"%d గంటలు",d:"ఒక రోజు",dd:"%d రోజులు",M:"ఒక నెల",MM:"%d నెలలు",y:"ఒక సంవత్సరం",yy:"%d సంవత్సరాలు"},ordinalParse:/\d{1,2}వ/,ordinal:"%dవ",meridiemParse:/రాత్రి|ఉదయం|మధ్యాహ్నం|సాయంత్రం/,meridiemHour:function(a,b){return 12===a&&(a=0),"రాత్రి"===b?4>a?a:a+12:"ఉదయం"===b?a:"మధ్యాహ్నం"===b?a>=10?a:a+12:"సాయంత్రం"===b?a+12:void 0},meridiem:function(a,b,c){return 4>a?"రాత్రి":10>a?"ఉదయం":17>a?"మధ్యాహ్నం":20>a?"సాయంత్రం":"రాత్రి"},week:{dow:0,// Sunday is the first day of the week.
doy:6}}),kg.defineLocale("th",{months:"มกราคม_กุมภาพันธ์_มีนาคม_เมษายน_พฤษภาคม_มิถุนายน_กรกฎาคม_สิงหาคม_กันยายน_ตุลาคม_พฤศจิกายน_ธันวาคม".split("_"),monthsShort:"ม.ค._ก.พ._มี.ค._เม.ย._พ.ค._มิ.ย._ก.ค._ส.ค._ก.ย._ต.ค._พ.ย._ธ.ค.".split("_"),monthsParseExact:!0,weekdays:"อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัสบดี_ศุกร์_เสาร์".split("_"),weekdaysShort:"อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัส_ศุกร์_เสาร์".split("_"),// yes, three characters difference
weekdaysMin:"อา._จ._อ._พ._พฤ._ศ._ส.".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"H นาฬิกา m นาที",LTS:"H นาฬิกา m นาที s วินาที",L:"YYYY/MM/DD",LL:"D MMMM YYYY",LLL:"D MMMM YYYY เวลา H นาฬิกา m นาที",LLLL:"วันddddที่ D MMMM YYYY เวลา H นาฬิกา m นาที"},meridiemParse:/ก่อนเที่ยง|หลังเที่ยง/,isPM:function(a){return"หลังเที่ยง"===a},meridiem:function(a,b,c){return 12>a?"ก่อนเที่ยง":"หลังเที่ยง"},calendar:{sameDay:"[วันนี้ เวลา] LT",nextDay:"[พรุ่งนี้ เวลา] LT",nextWeek:"dddd[หน้า เวลา] LT",lastDay:"[เมื่อวานนี้ เวลา] LT",lastWeek:"[วัน]dddd[ที่แล้ว เวลา] LT",sameElse:"L"},relativeTime:{future:"อีก %s",past:"%sที่แล้ว",s:"ไม่กี่วินาที",m:"1 นาที",mm:"%d นาที",h:"1 ชั่วโมง",hh:"%d ชั่วโมง",d:"1 วัน",dd:"%d วัน",M:"1 เดือน",MM:"%d เดือน",y:"1 ปี",yy:"%d ปี"}}),kg.defineLocale("tl-ph",{months:"Enero_Pebrero_Marso_Abril_Mayo_Hunyo_Hulyo_Agosto_Setyembre_Oktubre_Nobyembre_Disyembre".split("_"),monthsShort:"Ene_Peb_Mar_Abr_May_Hun_Hul_Ago_Set_Okt_Nob_Dis".split("_"),weekdays:"Linggo_Lunes_Martes_Miyerkules_Huwebes_Biyernes_Sabado".split("_"),weekdaysShort:"Lin_Lun_Mar_Miy_Huw_Biy_Sab".split("_"),weekdaysMin:"Li_Lu_Ma_Mi_Hu_Bi_Sab".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"MM/D/YYYY",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY HH:mm",LLLL:"dddd, MMMM DD, YYYY HH:mm"},calendar:{sameDay:"[Ngayon sa] LT",nextDay:"[Bukas sa] LT",nextWeek:"dddd [sa] LT",lastDay:"[Kahapon sa] LT",lastWeek:"dddd [huling linggo] LT",sameElse:"L"},relativeTime:{future:"sa loob ng %s",past:"%s ang nakalipas",s:"ilang segundo",m:"isang minuto",mm:"%d minuto",h:"isang oras",hh:"%d oras",d:"isang araw",dd:"%d araw",M:"isang buwan",MM:"%d buwan",y:"isang taon",yy:"%d taon"},ordinalParse:/\d{1,2}/,ordinal:function(a){return a},week:{dow:1,// Monday is the first day of the week.
doy:4}}),"pagh_wa’_cha’_wej_loS_vagh_jav_Soch_chorgh_Hut".split("_")),rh=(kg.defineLocale("tlh",{months:"tera’ jar wa’_tera’ jar cha’_tera’ jar wej_tera’ jar loS_tera’ jar vagh_tera’ jar jav_tera’ jar Soch_tera’ jar chorgh_tera’ jar Hut_tera’ jar wa’maH_tera’ jar wa’maH wa’_tera’ jar wa’maH cha’".split("_"),monthsShort:"jar wa’_jar cha’_jar wej_jar loS_jar vagh_jar jav_jar Soch_jar chorgh_jar Hut_jar wa’maH_jar wa’maH wa’_jar wa’maH cha’".split("_"),monthsParseExact:!0,weekdays:"lojmItjaj_DaSjaj_povjaj_ghItlhjaj_loghjaj_buqjaj_ghInjaj".split("_"),weekdaysShort:"lojmItjaj_DaSjaj_povjaj_ghItlhjaj_loghjaj_buqjaj_ghInjaj".split("_"),weekdaysMin:"lojmItjaj_DaSjaj_povjaj_ghItlhjaj_loghjaj_buqjaj_ghInjaj".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[DaHjaj] LT",nextDay:"[wa’leS] LT",nextWeek:"LLL",lastDay:"[wa’Hu’] LT",lastWeek:"LLL",sameElse:"L"},relativeTime:{future:ae,past:be,s:"puS lup",m:"wa’ tup",mm:ce,h:"wa’ rep",hh:ce,d:"wa’ jaj",dd:ce,M:"wa’ jar",MM:ce,y:"wa’ DIS",yy:ce},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,// Monday is the first day of the week.
doy:4}}),{1:"'inci",5:"'inci",8:"'inci",70:"'inci",80:"'inci",2:"'nci",7:"'nci",20:"'nci",50:"'nci",3:"'üncü",4:"'üncü",100:"'üncü",6:"'ncı",9:"'uncu",10:"'uncu",30:"'uncu",60:"'ıncı",90:"'ıncı"}),sh=(kg.defineLocale("tr",{months:"Ocak_Şubat_Mart_Nisan_Mayıs_Haziran_Temmuz_Ağustos_Eylül_Ekim_Kasım_Aralık".split("_"),monthsShort:"Oca_Şub_Mar_Nis_May_Haz_Tem_Ağu_Eyl_Eki_Kas_Ara".split("_"),weekdays:"Pazar_Pazartesi_Salı_Çarşamba_Perşembe_Cuma_Cumartesi".split("_"),weekdaysShort:"Paz_Pts_Sal_Çar_Per_Cum_Cts".split("_"),weekdaysMin:"Pz_Pt_Sa_Ça_Pe_Cu_Ct".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[bugün saat] LT",nextDay:"[yarın saat] LT",nextWeek:"[haftaya] dddd [saat] LT",lastDay:"[dün] LT",lastWeek:"[geçen hafta] dddd [saat] LT",sameElse:"L"},relativeTime:{future:"%s sonra",past:"%s önce",s:"birkaç saniye",m:"bir dakika",mm:"%d dakika",h:"bir saat",hh:"%d saat",d:"bir gün",dd:"%d gün",M:"bir ay",MM:"%d ay",y:"bir yıl",yy:"%d yıl"},ordinalParse:/\d{1,2}'(inci|nci|üncü|ncı|uncu|ıncı)/,ordinal:function(a){if(0===a)// special case for zero
return a+"'ıncı";var b=a%10,c=a%100-b,d=a>=100?100:null;return a+(rh[b]||rh[c]||rh[d])},week:{dow:1,// Monday is the first day of the week.
doy:7}}),kg.defineLocale("tzl",{months:"Januar_Fevraglh_Març_Avrïu_Mai_Gün_Julia_Guscht_Setemvar_Listopäts_Noemvar_Zecemvar".split("_"),monthsShort:"Jan_Fev_Mar_Avr_Mai_Gün_Jul_Gus_Set_Lis_Noe_Zec".split("_"),weekdays:"Súladi_Lúneçi_Maitzi_Márcuri_Xhúadi_Viénerçi_Sáturi".split("_"),weekdaysShort:"Súl_Lún_Mai_Már_Xhú_Vié_Sát".split("_"),weekdaysMin:"Sú_Lú_Ma_Má_Xh_Vi_Sá".split("_"),longDateFormat:{LT:"HH.mm",LTS:"HH.mm.ss",L:"DD.MM.YYYY",LL:"D. MMMM [dallas] YYYY",LLL:"D. MMMM [dallas] YYYY HH.mm",LLLL:"dddd, [li] D. MMMM [dallas] YYYY HH.mm"},meridiemParse:/d\'o|d\'a/i,isPM:function(a){return"d'o"===a.toLowerCase()},meridiem:function(a,b,c){return a>11?c?"d'o":"D'O":c?"d'a":"D'A"},calendar:{sameDay:"[oxhi à] LT",nextDay:"[demà à] LT",nextWeek:"dddd [à] LT",lastDay:"[ieiri à] LT",lastWeek:"[sür el] dddd [lasteu à] LT",sameElse:"L"},relativeTime:{future:"osprei %s",past:"ja%s",s:ee,m:ee,mm:ee,h:ee,hh:ee,d:ee,dd:ee,M:ee,MM:ee,y:ee,yy:ee},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,// Monday is the first day of the week.
doy:4}}),kg.defineLocale("tzm-latn",{months:"innayr_brˤayrˤ_marˤsˤ_ibrir_mayyw_ywnyw_ywlywz_ɣwšt_šwtanbir_ktˤwbrˤ_nwwanbir_dwjnbir".split("_"),monthsShort:"innayr_brˤayrˤ_marˤsˤ_ibrir_mayyw_ywnyw_ywlywz_ɣwšt_šwtanbir_ktˤwbrˤ_nwwanbir_dwjnbir".split("_"),weekdays:"asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas".split("_"),weekdaysShort:"asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas".split("_"),weekdaysMin:"asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[asdkh g] LT",nextDay:"[aska g] LT",nextWeek:"dddd [g] LT",lastDay:"[assant g] LT",lastWeek:"dddd [g] LT",sameElse:"L"},relativeTime:{future:"dadkh s yan %s",past:"yan %s",s:"imik",m:"minuḍ",mm:"%d minuḍ",h:"saɛa",hh:"%d tassaɛin",d:"ass",dd:"%d ossan",M:"ayowr",MM:"%d iyyirn",y:"asgas",yy:"%d isgasn"},week:{dow:6,// Saturday is the first day of the week.
doy:12}}),kg.defineLocale("tzm",{months:"ⵉⵏⵏⴰⵢⵔ_ⴱⵕⴰⵢⵕ_ⵎⴰⵕⵚ_ⵉⴱⵔⵉⵔ_ⵎⴰⵢⵢⵓ_ⵢⵓⵏⵢⵓ_ⵢⵓⵍⵢⵓⵣ_ⵖⵓⵛⵜ_ⵛⵓⵜⴰⵏⴱⵉⵔ_ⴽⵟⵓⴱⵕ_ⵏⵓⵡⴰⵏⴱⵉⵔ_ⴷⵓⵊⵏⴱⵉⵔ".split("_"),monthsShort:"ⵉⵏⵏⴰⵢⵔ_ⴱⵕⴰⵢⵕ_ⵎⴰⵕⵚ_ⵉⴱⵔⵉⵔ_ⵎⴰⵢⵢⵓ_ⵢⵓⵏⵢⵓ_ⵢⵓⵍⵢⵓⵣ_ⵖⵓⵛⵜ_ⵛⵓⵜⴰⵏⴱⵉⵔ_ⴽⵟⵓⴱⵕ_ⵏⵓⵡⴰⵏⴱⵉⵔ_ⴷⵓⵊⵏⴱⵉⵔ".split("_"),weekdays:"ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ".split("_"),weekdaysShort:"ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ".split("_"),weekdaysMin:"ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[ⴰⵙⴷⵅ ⴴ] LT",nextDay:"[ⴰⵙⴽⴰ ⴴ] LT",nextWeek:"dddd [ⴴ] LT",lastDay:"[ⴰⵚⴰⵏⵜ ⴴ] LT",lastWeek:"dddd [ⴴ] LT",sameElse:"L"},relativeTime:{future:"ⴷⴰⴷⵅ ⵙ ⵢⴰⵏ %s",past:"ⵢⴰⵏ %s",s:"ⵉⵎⵉⴽ",m:"ⵎⵉⵏⵓⴺ",mm:"%d ⵎⵉⵏⵓⴺ",h:"ⵙⴰⵄⴰ",hh:"%d ⵜⴰⵙⵙⴰⵄⵉⵏ",d:"ⴰⵙⵙ",dd:"%d oⵙⵙⴰⵏ",M:"ⴰⵢoⵓⵔ",MM:"%d ⵉⵢⵢⵉⵔⵏ",y:"ⴰⵙⴳⴰⵙ",yy:"%d ⵉⵙⴳⴰⵙⵏ"},week:{dow:6,// Saturday is the first day of the week.
doy:12}}),kg.defineLocale("uk",{months:{format:"січня_лютого_березня_квітня_травня_червня_липня_серпня_вересня_жовтня_листопада_грудня".split("_"),standalone:"січень_лютий_березень_квітень_травень_червень_липень_серпень_вересень_жовтень_листопад_грудень".split("_")},monthsShort:"січ_лют_бер_квіт_трав_черв_лип_серп_вер_жовт_лист_груд".split("_"),weekdays:he,weekdaysShort:"нд_пн_вт_ср_чт_пт_сб".split("_"),weekdaysMin:"нд_пн_вт_ср_чт_пт_сб".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY р.",LLL:"D MMMM YYYY р., HH:mm",LLLL:"dddd, D MMMM YYYY р., HH:mm"},calendar:{sameDay:ie("[Сьогодні "),nextDay:ie("[Завтра "),lastDay:ie("[Вчора "),nextWeek:ie("[У] dddd ["),lastWeek:function(){switch(this.day()){case 0:case 3:case 5:case 6:return ie("[Минулої] dddd [").call(this);case 1:case 2:case 4:return ie("[Минулого] dddd [").call(this)}},sameElse:"L"},relativeTime:{future:"за %s",past:"%s тому",s:"декілька секунд",m:ge,mm:ge,h:"годину",hh:ge,d:"день",dd:ge,M:"місяць",MM:ge,y:"рік",yy:ge},
// M. E.: those two are virtually unused but a user might want to implement them for his/her website for some reason
meridiemParse:/ночі|ранку|дня|вечора/,isPM:function(a){return/^(дня|вечора)$/.test(a)},meridiem:function(a,b,c){return 4>a?"ночі":12>a?"ранку":17>a?"дня":"вечора"},ordinalParse:/\d{1,2}-(й|го)/,ordinal:function(a,b){switch(b){case"M":case"d":case"DDD":case"w":case"W":return a+"-й";case"D":return a+"-го";default:return a}},week:{dow:1,// Monday is the first day of the week.
doy:7}}),kg.defineLocale("uz",{months:"январ_феврал_март_апрел_май_июн_июл_август_сентябр_октябр_ноябр_декабр".split("_"),monthsShort:"янв_фев_мар_апр_май_июн_июл_авг_сен_окт_ноя_дек".split("_"),weekdays:"Якшанба_Душанба_Сешанба_Чоршанба_Пайшанба_Жума_Шанба".split("_"),weekdaysShort:"Якш_Душ_Сеш_Чор_Пай_Жум_Шан".split("_"),weekdaysMin:"Як_Ду_Се_Чо_Па_Жу_Ша".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"D MMMM YYYY, dddd HH:mm"},calendar:{sameDay:"[Бугун соат] LT [да]",nextDay:"[Эртага] LT [да]",nextWeek:"dddd [куни соат] LT [да]",lastDay:"[Кеча соат] LT [да]",lastWeek:"[Утган] dddd [куни соат] LT [да]",sameElse:"L"},relativeTime:{future:"Якин %s ичида",past:"Бир неча %s олдин",s:"фурсат",m:"бир дакика",mm:"%d дакика",h:"бир соат",hh:"%d соат",d:"бир кун",dd:"%d кун",M:"бир ой",MM:"%d ой",y:"бир йил",yy:"%d йил"},week:{dow:1,// Monday is the first day of the week.
doy:7}}),kg.defineLocale("vi",{months:"tháng 1_tháng 2_tháng 3_tháng 4_tháng 5_tháng 6_tháng 7_tháng 8_tháng 9_tháng 10_tháng 11_tháng 12".split("_"),monthsShort:"Th01_Th02_Th03_Th04_Th05_Th06_Th07_Th08_Th09_Th10_Th11_Th12".split("_"),monthsParseExact:!0,weekdays:"chủ nhật_thứ hai_thứ ba_thứ tư_thứ năm_thứ sáu_thứ bảy".split("_"),weekdaysShort:"CN_T2_T3_T4_T5_T6_T7".split("_"),weekdaysMin:"CN_T2_T3_T4_T5_T6_T7".split("_"),weekdaysParseExact:!0,meridiemParse:/sa|ch/i,isPM:function(a){return/^ch$/i.test(a)},meridiem:function(a,b,c){return 12>a?c?"sa":"SA":c?"ch":"CH"},longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM [năm] YYYY",LLL:"D MMMM [năm] YYYY HH:mm",LLLL:"dddd, D MMMM [năm] YYYY HH:mm",l:"DD/M/YYYY",ll:"D MMM YYYY",lll:"D MMM YYYY HH:mm",llll:"ddd, D MMM YYYY HH:mm"},calendar:{sameDay:"[Hôm nay lúc] LT",nextDay:"[Ngày mai lúc] LT",nextWeek:"dddd [tuần tới lúc] LT",lastDay:"[Hôm qua lúc] LT",lastWeek:"dddd [tuần rồi lúc] LT",sameElse:"L"},relativeTime:{future:"%s tới",past:"%s trước",s:"vài giây",m:"một phút",mm:"%d phút",h:"một giờ",hh:"%d giờ",d:"một ngày",dd:"%d ngày",M:"một tháng",MM:"%d tháng",y:"một năm",yy:"%d năm"},ordinalParse:/\d{1,2}/,ordinal:function(a){return a},week:{dow:1,// Monday is the first day of the week.
doy:4}}),kg.defineLocale("x-pseudo",{months:"J~áñúá~rý_F~ébrú~árý_~Márc~h_Áp~ríl_~Máý_~Júñé~_Júl~ý_Áú~gúst~_Sép~témb~ér_Ó~ctób~ér_Ñ~óvém~bér_~Décé~mbér".split("_"),monthsShort:"J~áñ_~Féb_~Már_~Ápr_~Máý_~Júñ_~Júl_~Áúg_~Sép_~Óct_~Ñóv_~Déc".split("_"),monthsParseExact:!0,weekdays:"S~úñdá~ý_Mó~ñdáý~_Túé~sdáý~_Wéd~ñésd~áý_T~húrs~dáý_~Fríd~áý_S~átúr~dáý".split("_"),weekdaysShort:"S~úñ_~Móñ_~Túé_~Wéd_~Thú_~Frí_~Sát".split("_"),weekdaysMin:"S~ú_Mó~_Tú_~Wé_T~h_Fr~_Sá".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[T~ódá~ý át] LT",nextDay:"[T~ómó~rró~w át] LT",nextWeek:"dddd [át] LT",lastDay:"[Ý~ést~érdá~ý át] LT",lastWeek:"[L~ást] dddd [át] LT",sameElse:"L"},relativeTime:{future:"í~ñ %s",past:"%s á~gó",s:"á ~féw ~sécó~ñds",m:"á ~míñ~úté",mm:"%d m~íñú~tés",h:"á~ñ hó~úr",hh:"%d h~óúrs",d:"á ~dáý",dd:"%d d~áýs",M:"á ~móñ~th",MM:"%d m~óñt~hs",y:"á ~ýéár",yy:"%d ý~éárs"},ordinalParse:/\d{1,2}(th|st|nd|rd)/,ordinal:function(a){var b=a%10,c=1===~~(a%100/10)?"th":1===b?"st":2===b?"nd":3===b?"rd":"th";return a+c},week:{dow:1,// Monday is the first day of the week.
doy:4}}),kg.defineLocale("zh-cn",{months:"一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),monthsShort:"1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),weekdays:"星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),weekdaysShort:"周日_周一_周二_周三_周四_周五_周六".split("_"),weekdaysMin:"日_一_二_三_四_五_六".split("_"),longDateFormat:{LT:"Ah点mm分",LTS:"Ah点m分s秒",L:"YYYY-MM-DD",LL:"YYYY年MMMD日",LLL:"YYYY年MMMD日Ah点mm分",LLLL:"YYYY年MMMD日ddddAh点mm分",l:"YYYY-MM-DD",ll:"YYYY年MMMD日",lll:"YYYY年MMMD日Ah点mm分",llll:"YYYY年MMMD日ddddAh点mm分"},meridiemParse:/凌晨|早上|上午|中午|下午|晚上/,meridiemHour:function(a,b){return 12===a&&(a=0),"凌晨"===b||"早上"===b||"上午"===b?a:"下午"===b||"晚上"===b?a+12:a>=11?a:a+12},meridiem:function(a,b,c){var d=100*a+b;return 600>d?"凌晨":900>d?"早上":1130>d?"上午":1230>d?"中午":1800>d?"下午":"晚上"},calendar:{sameDay:function(){return 0===this.minutes()?"[今天]Ah[点整]":"[今天]LT"},nextDay:function(){return 0===this.minutes()?"[明天]Ah[点整]":"[明天]LT"},lastDay:function(){return 0===this.minutes()?"[昨天]Ah[点整]":"[昨天]LT"},nextWeek:function(){var a,b;return a=kg().startOf("week"),b=this.diff(a,"days")>=7?"[下]":"[本]",0===this.minutes()?b+"dddAh点整":b+"dddAh点mm"},lastWeek:function(){var a,b;return a=kg().startOf("week"),b=this.unix()<a.unix()?"[上]":"[本]",0===this.minutes()?b+"dddAh点整":b+"dddAh点mm"},sameElse:"LL"},ordinalParse:/\d{1,2}(日|月|周)/,ordinal:function(a,b){switch(b){case"d":case"D":case"DDD":return a+"日";case"M":return a+"月";case"w":case"W":return a+"周";default:return a}},relativeTime:{future:"%s内",past:"%s前",s:"几秒",m:"1 分钟",mm:"%d 分钟",h:"1 小时",hh:"%d 小时",d:"1 天",dd:"%d 天",M:"1 个月",MM:"%d 个月",y:"1 年",yy:"%d 年"},week:{
// GB/T 7408-1994《数据元和交换格式·信息交换·日期和时间表示法》与ISO 8601:1988等效
dow:1,// Monday is the first day of the week.
doy:4}}),kg.defineLocale("zh-tw",{months:"一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),monthsShort:"1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),weekdays:"星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),weekdaysShort:"週日_週一_週二_週三_週四_週五_週六".split("_"),weekdaysMin:"日_一_二_三_四_五_六".split("_"),longDateFormat:{LT:"Ah點mm分",LTS:"Ah點m分s秒",L:"YYYY年MMMD日",LL:"YYYY年MMMD日",LLL:"YYYY年MMMD日Ah點mm分",LLLL:"YYYY年MMMD日ddddAh點mm分",l:"YYYY年MMMD日",ll:"YYYY年MMMD日",lll:"YYYY年MMMD日Ah點mm分",llll:"YYYY年MMMD日ddddAh點mm分"},meridiemParse:/凌晨|早上|上午|中午|下午|晚上/,meridiemHour:function(a,b){return 12===a&&(a=0),"凌晨"===b||"早上"===b||"上午"===b?a:"中午"===b?a>=11?a:a+12:"下午"===b||"晚上"===b?a+12:void 0},meridiem:function(a,b,c){var d=100*a+b;return 600>d?"凌晨":900>d?"早上":1130>d?"上午":1230>d?"中午":1800>d?"下午":"晚上"},calendar:{sameDay:"[今天]LT",nextDay:"[明天]LT",nextWeek:"[下]ddddLT",lastDay:"[昨天]LT",lastWeek:"[上]ddddLT",sameElse:"L"},ordinalParse:/\d{1,2}(日|月|週)/,ordinal:function(a,b){switch(b){case"d":case"D":case"DDD":return a+"日";case"M":return a+"月";case"w":case"W":return a+"週";default:return a}},relativeTime:{future:"%s內",past:"%s前",s:"幾秒",m:"1 分鐘",mm:"%d 分鐘",h:"1 小時",hh:"%d 小時",d:"1 天",dd:"%d 天",M:"1 個月",MM:"%d 個月",y:"1 年",yy:"%d 年"}}),kg);return sh.locale("en"),sh});
(function(){var countdown,moment,ref,ref1,slice=[].slice;countdown=(ref=typeof require==="function"?require("countdown"):void 0)!=null?ref:this.countdown;moment=(ref1=typeof require==="function"?require("moment"):void 0)!=null?ref1:this.moment;moment.fn.countdown=function(){var args,other;other=arguments[0],args=2<=arguments.length?slice.call(arguments,1):[];return countdown.apply(null,[this.toDate(),moment(other).toDate()].concat(slice.call(args)))}}).call(this);
//# sourceMappingURL=vendor.js.map
