(function () {
    'use strict';

    // 提取字符串中的标签
    const extractTags = (str) => {
        return str.match(/((?<=#?\[\[)(.*?)(?=\]\]))|((?<=#)\w+)/g) || [];
    };
    // 移除字符串中的标签,只移除带#的tag，避免匹配到句子中合理的页面引用以及{{[[TODO]]}}
    const removeTags = (str) => {
        return str.replace(/(#\[\[(.*?)\]\])|(#\w+)/g, "").trim();
    };
    // 递归遍历子block
    const patchBlockChildren = async (uid, fn, options = {}) => {
        let { skipTop = true, depth = Infinity } = options;
        const blocks = await window.roam42.common.getBlockInfoByUID(uid, true);
        let complete = false;
        const loop = (blocks, depth, top = true) => {
            if (complete || !blocks)
                return false;
            blocks.forEach((a) => {
                const block = Array.isArray(a) ? a[0] : a;
                if (block.children && depth > 0) {
                    loop(block.children, depth - 1, false);
                }
                if (skipTop ? !top : true) {
                    if (fn(block) === false) {
                        complete = true;
                    }
                }
            });
        };
        loop(blocks, depth);
    };
    const getValueInOrderIfError = (fns, defaultValue) => {
        while (fns.length > 0) {
            const fn = fns.shift();
            try {
                return typeof fn === "function" ? fn() : fn;
            }
            catch (e) { }
        }
        return defaultValue;
    };
    const getBlockUidFromId = (id) => {
        return getValueInOrderIfError([
            () => id.match(/(?<=-).{9}$(?=[^-]*$)/)[0],
            () => (id.match(/uuid[^uuid]*(?=(uuid[^uuid]*){0}$)/) || id.match(/uuid.*$/))[0],
            () => id.slice(-9)
        ], "");
    };
    const unique = (array) => {
        if (!array || !array.length)
            return [];
        const temp = {};
        array.forEach((k) => (temp[k] = k));
        return Object.keys(temp);
    };
    const getSelectBlockUids = () => {
        const ids = [
            ...document.querySelectorAll(".roam-block-container.block-highlight-blue")
        ].map((a) => getBlockUidFromId(a.querySelector(".rm-block__input").id));
        return [...new Set(ids)];
    };
    function flattenBlocks(block, filter) {
        return block.flatMap((a) => a.children ? flattenBlocks(a.children, filter) : filter && filter(a) === false ? [] : a);
    }

    var utils = /*#__PURE__*/Object.freeze({
        __proto__: null,
        extractTags: extractTags,
        removeTags: removeTags,
        patchBlockChildren: patchBlockChildren,
        getValueInOrderIfError: getValueInOrderIfError,
        getBlockUidFromId: getBlockUidFromId,
        unique: unique,
        getSelectBlockUids: getSelectBlockUids,
        flattenBlocks: flattenBlocks
    });

    function addScript(src, id) {
        const old = document.getElementById(id);
        old && old.remove();
        const s = document.createElement("script");
        s.src = src;
        id && (s.id = id);
        s.async = true;
        s.type = "text/javascript";
        document.getElementsByTagName("head")[0].appendChild(s);
    }
    function retry(fn, name = "") {
        let n = 0;
        function _retry(fn) {
            var _a;
            try {
                fn();
            }
            catch (e) {
                console.log("error", e);
                n < 5 && setTimeout(() => _retry(++n), 3000);
                n > 5 && ((_a = window.roam42) === null || _a === void 0 ? void 0 : _a.help.displayMessage(`${name}加载失败`, 2000));
            }
        }
        setTimeout(() => _retry(fn), 3000);
    }

    /** Detect free variable `global` from Node.js. */
    var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

    /** Detect free variable `self`. */
    var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

    /** Used as a reference to the global object. */
    var root = freeGlobal || freeSelf || Function('return this')();

    /** Built-in value references. */
    var Symbol = root.Symbol;

    /** Used for built-in method references. */
    var objectProto$5 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$4 = objectProto$5.hasOwnProperty;

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var nativeObjectToString$1 = objectProto$5.toString;

    /** Built-in value references. */
    var symToStringTag$1 = Symbol ? Symbol.toStringTag : undefined;

    /**
     * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the raw `toStringTag`.
     */
    function getRawTag(value) {
      var isOwn = hasOwnProperty$4.call(value, symToStringTag$1),
          tag = value[symToStringTag$1];

      try {
        value[symToStringTag$1] = undefined;
        var unmasked = true;
      } catch (e) {}

      var result = nativeObjectToString$1.call(value);
      if (unmasked) {
        if (isOwn) {
          value[symToStringTag$1] = tag;
        } else {
          delete value[symToStringTag$1];
        }
      }
      return result;
    }

    /** Used for built-in method references. */
    var objectProto$4 = Object.prototype;

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var nativeObjectToString = objectProto$4.toString;

    /**
     * Converts `value` to a string using `Object.prototype.toString`.
     *
     * @private
     * @param {*} value The value to convert.
     * @returns {string} Returns the converted string.
     */
    function objectToString(value) {
      return nativeObjectToString.call(value);
    }

    /** `Object#toString` result references. */
    var nullTag = '[object Null]',
        undefinedTag = '[object Undefined]';

    /** Built-in value references. */
    var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

    /**
     * The base implementation of `getTag` without fallbacks for buggy environments.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */
    function baseGetTag(value) {
      if (value == null) {
        return value === undefined ? undefinedTag : nullTag;
      }
      return (symToStringTag && symToStringTag in Object(value))
        ? getRawTag(value)
        : objectToString(value);
    }

    /**
     * Checks if `value` is the
     * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
     * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(_.noop);
     * // => true
     *
     * _.isObject(null);
     * // => false
     */
    function isObject(value) {
      var type = typeof value;
      return value != null && (type == 'object' || type == 'function');
    }

    /** `Object#toString` result references. */
    var asyncTag = '[object AsyncFunction]',
        funcTag = '[object Function]',
        genTag = '[object GeneratorFunction]',
        proxyTag = '[object Proxy]';

    /**
     * Checks if `value` is classified as a `Function` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a function, else `false`.
     * @example
     *
     * _.isFunction(_);
     * // => true
     *
     * _.isFunction(/abc/);
     * // => false
     */
    function isFunction(value) {
      if (!isObject(value)) {
        return false;
      }
      // The use of `Object#toString` avoids issues with the `typeof` operator
      // in Safari 9 which returns 'object' for typed arrays and other constructors.
      var tag = baseGetTag(value);
      return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
    }

    /** Used to detect overreaching core-js shims. */
    var coreJsData = root['__core-js_shared__'];

    /** Used to detect methods masquerading as native. */
    var maskSrcKey = (function() {
      var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
      return uid ? ('Symbol(src)_1.' + uid) : '';
    }());

    /**
     * Checks if `func` has its source masked.
     *
     * @private
     * @param {Function} func The function to check.
     * @returns {boolean} Returns `true` if `func` is masked, else `false`.
     */
    function isMasked(func) {
      return !!maskSrcKey && (maskSrcKey in func);
    }

    /** Used for built-in method references. */
    var funcProto$1 = Function.prototype;

    /** Used to resolve the decompiled source of functions. */
    var funcToString$1 = funcProto$1.toString;

    /**
     * Converts `func` to its source code.
     *
     * @private
     * @param {Function} func The function to convert.
     * @returns {string} Returns the source code.
     */
    function toSource(func) {
      if (func != null) {
        try {
          return funcToString$1.call(func);
        } catch (e) {}
        try {
          return (func + '');
        } catch (e) {}
      }
      return '';
    }

    /**
     * Used to match `RegExp`
     * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
     */
    var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

    /** Used to detect host constructors (Safari). */
    var reIsHostCtor = /^\[object .+?Constructor\]$/;

    /** Used for built-in method references. */
    var funcProto = Function.prototype,
        objectProto$3 = Object.prototype;

    /** Used to resolve the decompiled source of functions. */
    var funcToString = funcProto.toString;

    /** Used to check objects for own properties. */
    var hasOwnProperty$3 = objectProto$3.hasOwnProperty;

    /** Used to detect if a method is native. */
    var reIsNative = RegExp('^' +
      funcToString.call(hasOwnProperty$3).replace(reRegExpChar, '\\$&')
      .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
    );

    /**
     * The base implementation of `_.isNative` without bad shim checks.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a native function,
     *  else `false`.
     */
    function baseIsNative(value) {
      if (!isObject(value) || isMasked(value)) {
        return false;
      }
      var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
      return pattern.test(toSource(value));
    }

    /**
     * Gets the value at `key` of `object`.
     *
     * @private
     * @param {Object} [object] The object to query.
     * @param {string} key The key of the property to get.
     * @returns {*} Returns the property value.
     */
    function getValue(object, key) {
      return object == null ? undefined : object[key];
    }

    /**
     * Gets the native function at `key` of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {string} key The key of the method to get.
     * @returns {*} Returns the function if it's native, else `undefined`.
     */
    function getNative(object, key) {
      var value = getValue(object, key);
      return baseIsNative(value) ? value : undefined;
    }

    /* Built-in method references that are verified to be native. */
    var nativeCreate = getNative(Object, 'create');

    /**
     * Removes all key-value entries from the hash.
     *
     * @private
     * @name clear
     * @memberOf Hash
     */
    function hashClear() {
      this.__data__ = nativeCreate ? nativeCreate(null) : {};
      this.size = 0;
    }

    /**
     * Removes `key` and its value from the hash.
     *
     * @private
     * @name delete
     * @memberOf Hash
     * @param {Object} hash The hash to modify.
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function hashDelete(key) {
      var result = this.has(key) && delete this.__data__[key];
      this.size -= result ? 1 : 0;
      return result;
    }

    /** Used to stand-in for `undefined` hash values. */
    var HASH_UNDEFINED$2 = '__lodash_hash_undefined__';

    /** Used for built-in method references. */
    var objectProto$2 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$2 = objectProto$2.hasOwnProperty;

    /**
     * Gets the hash value for `key`.
     *
     * @private
     * @name get
     * @memberOf Hash
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function hashGet(key) {
      var data = this.__data__;
      if (nativeCreate) {
        var result = data[key];
        return result === HASH_UNDEFINED$2 ? undefined : result;
      }
      return hasOwnProperty$2.call(data, key) ? data[key] : undefined;
    }

    /** Used for built-in method references. */
    var objectProto$1 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$1 = objectProto$1.hasOwnProperty;

    /**
     * Checks if a hash value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf Hash
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function hashHas(key) {
      var data = this.__data__;
      return nativeCreate ? (data[key] !== undefined) : hasOwnProperty$1.call(data, key);
    }

    /** Used to stand-in for `undefined` hash values. */
    var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

    /**
     * Sets the hash `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf Hash
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the hash instance.
     */
    function hashSet(key, value) {
      var data = this.__data__;
      this.size += this.has(key) ? 0 : 1;
      data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED$1 : value;
      return this;
    }

    /**
     * Creates a hash object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function Hash(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    // Add methods to `Hash`.
    Hash.prototype.clear = hashClear;
    Hash.prototype['delete'] = hashDelete;
    Hash.prototype.get = hashGet;
    Hash.prototype.has = hashHas;
    Hash.prototype.set = hashSet;

    /**
     * Removes all key-value entries from the list cache.
     *
     * @private
     * @name clear
     * @memberOf ListCache
     */
    function listCacheClear() {
      this.__data__ = [];
      this.size = 0;
    }

    /**
     * Performs a
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * comparison between two values to determine if they are equivalent.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'a': 1 };
     * var other = { 'a': 1 };
     *
     * _.eq(object, object);
     * // => true
     *
     * _.eq(object, other);
     * // => false
     *
     * _.eq('a', 'a');
     * // => true
     *
     * _.eq('a', Object('a'));
     * // => false
     *
     * _.eq(NaN, NaN);
     * // => true
     */
    function eq(value, other) {
      return value === other || (value !== value && other !== other);
    }

    /**
     * Gets the index at which the `key` is found in `array` of key-value pairs.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {*} key The key to search for.
     * @returns {number} Returns the index of the matched value, else `-1`.
     */
    function assocIndexOf(array, key) {
      var length = array.length;
      while (length--) {
        if (eq(array[length][0], key)) {
          return length;
        }
      }
      return -1;
    }

    /** Used for built-in method references. */
    var arrayProto = Array.prototype;

    /** Built-in value references. */
    var splice = arrayProto.splice;

    /**
     * Removes `key` and its value from the list cache.
     *
     * @private
     * @name delete
     * @memberOf ListCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function listCacheDelete(key) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      if (index < 0) {
        return false;
      }
      var lastIndex = data.length - 1;
      if (index == lastIndex) {
        data.pop();
      } else {
        splice.call(data, index, 1);
      }
      --this.size;
      return true;
    }

    /**
     * Gets the list cache value for `key`.
     *
     * @private
     * @name get
     * @memberOf ListCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function listCacheGet(key) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      return index < 0 ? undefined : data[index][1];
    }

    /**
     * Checks if a list cache value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf ListCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function listCacheHas(key) {
      return assocIndexOf(this.__data__, key) > -1;
    }

    /**
     * Sets the list cache `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf ListCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the list cache instance.
     */
    function listCacheSet(key, value) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      if (index < 0) {
        ++this.size;
        data.push([key, value]);
      } else {
        data[index][1] = value;
      }
      return this;
    }

    /**
     * Creates an list cache object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function ListCache(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    // Add methods to `ListCache`.
    ListCache.prototype.clear = listCacheClear;
    ListCache.prototype['delete'] = listCacheDelete;
    ListCache.prototype.get = listCacheGet;
    ListCache.prototype.has = listCacheHas;
    ListCache.prototype.set = listCacheSet;

    /* Built-in method references that are verified to be native. */
    var Map = getNative(root, 'Map');

    /**
     * Removes all key-value entries from the map.
     *
     * @private
     * @name clear
     * @memberOf MapCache
     */
    function mapCacheClear() {
      this.size = 0;
      this.__data__ = {
        'hash': new Hash,
        'map': new (Map || ListCache),
        'string': new Hash
      };
    }

    /**
     * Checks if `value` is suitable for use as unique object key.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
     */
    function isKeyable(value) {
      var type = typeof value;
      return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
        ? (value !== '__proto__')
        : (value === null);
    }

    /**
     * Gets the data for `map`.
     *
     * @private
     * @param {Object} map The map to query.
     * @param {string} key The reference key.
     * @returns {*} Returns the map data.
     */
    function getMapData(map, key) {
      var data = map.__data__;
      return isKeyable(key)
        ? data[typeof key == 'string' ? 'string' : 'hash']
        : data.map;
    }

    /**
     * Removes `key` and its value from the map.
     *
     * @private
     * @name delete
     * @memberOf MapCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function mapCacheDelete(key) {
      var result = getMapData(this, key)['delete'](key);
      this.size -= result ? 1 : 0;
      return result;
    }

    /**
     * Gets the map value for `key`.
     *
     * @private
     * @name get
     * @memberOf MapCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function mapCacheGet(key) {
      return getMapData(this, key).get(key);
    }

    /**
     * Checks if a map value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf MapCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function mapCacheHas(key) {
      return getMapData(this, key).has(key);
    }

    /**
     * Sets the map `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf MapCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the map cache instance.
     */
    function mapCacheSet(key, value) {
      var data = getMapData(this, key),
          size = data.size;

      data.set(key, value);
      this.size += data.size == size ? 0 : 1;
      return this;
    }

    /**
     * Creates a map cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function MapCache(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    // Add methods to `MapCache`.
    MapCache.prototype.clear = mapCacheClear;
    MapCache.prototype['delete'] = mapCacheDelete;
    MapCache.prototype.get = mapCacheGet;
    MapCache.prototype.has = mapCacheHas;
    MapCache.prototype.set = mapCacheSet;

    /** Used to stand-in for `undefined` hash values. */
    var HASH_UNDEFINED = '__lodash_hash_undefined__';

    /**
     * Adds `value` to the array cache.
     *
     * @private
     * @name add
     * @memberOf SetCache
     * @alias push
     * @param {*} value The value to cache.
     * @returns {Object} Returns the cache instance.
     */
    function setCacheAdd(value) {
      this.__data__.set(value, HASH_UNDEFINED);
      return this;
    }

    /**
     * Checks if `value` is in the array cache.
     *
     * @private
     * @name has
     * @memberOf SetCache
     * @param {*} value The value to search for.
     * @returns {number} Returns `true` if `value` is found, else `false`.
     */
    function setCacheHas(value) {
      return this.__data__.has(value);
    }

    /**
     *
     * Creates an array cache object to store unique values.
     *
     * @private
     * @constructor
     * @param {Array} [values] The values to cache.
     */
    function SetCache(values) {
      var index = -1,
          length = values == null ? 0 : values.length;

      this.__data__ = new MapCache;
      while (++index < length) {
        this.add(values[index]);
      }
    }

    // Add methods to `SetCache`.
    SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
    SetCache.prototype.has = setCacheHas;

    /**
     * The base implementation of `_.findIndex` and `_.findLastIndex` without
     * support for iteratee shorthands.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Function} predicate The function invoked per iteration.
     * @param {number} fromIndex The index to search from.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {number} Returns the index of the matched value, else `-1`.
     */
    function baseFindIndex(array, predicate, fromIndex, fromRight) {
      var length = array.length,
          index = fromIndex + (fromRight ? 1 : -1);

      while ((fromRight ? index-- : ++index < length)) {
        if (predicate(array[index], index, array)) {
          return index;
        }
      }
      return -1;
    }

    /**
     * The base implementation of `_.isNaN` without support for number objects.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
     */
    function baseIsNaN(value) {
      return value !== value;
    }

    /**
     * A specialized version of `_.indexOf` which performs strict equality
     * comparisons of values, i.e. `===`.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {*} value The value to search for.
     * @param {number} fromIndex The index to search from.
     * @returns {number} Returns the index of the matched value, else `-1`.
     */
    function strictIndexOf(array, value, fromIndex) {
      var index = fromIndex - 1,
          length = array.length;

      while (++index < length) {
        if (array[index] === value) {
          return index;
        }
      }
      return -1;
    }

    /**
     * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {*} value The value to search for.
     * @param {number} fromIndex The index to search from.
     * @returns {number} Returns the index of the matched value, else `-1`.
     */
    function baseIndexOf(array, value, fromIndex) {
      return value === value
        ? strictIndexOf(array, value, fromIndex)
        : baseFindIndex(array, baseIsNaN, fromIndex);
    }

    /**
     * A specialized version of `_.includes` for arrays without support for
     * specifying an index to search from.
     *
     * @private
     * @param {Array} [array] The array to inspect.
     * @param {*} target The value to search for.
     * @returns {boolean} Returns `true` if `target` is found, else `false`.
     */
    function arrayIncludes(array, value) {
      var length = array == null ? 0 : array.length;
      return !!length && baseIndexOf(array, value, 0) > -1;
    }

    /**
     * This function is like `arrayIncludes` except that it accepts a comparator.
     *
     * @private
     * @param {Array} [array] The array to inspect.
     * @param {*} target The value to search for.
     * @param {Function} comparator The comparator invoked per element.
     * @returns {boolean} Returns `true` if `target` is found, else `false`.
     */
    function arrayIncludesWith(array, value, comparator) {
      var index = -1,
          length = array == null ? 0 : array.length;

      while (++index < length) {
        if (comparator(value, array[index])) {
          return true;
        }
      }
      return false;
    }

    /**
     * A specialized version of `_.map` for arrays without support for iteratee
     * shorthands.
     *
     * @private
     * @param {Array} [array] The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns the new mapped array.
     */
    function arrayMap(array, iteratee) {
      var index = -1,
          length = array == null ? 0 : array.length,
          result = Array(length);

      while (++index < length) {
        result[index] = iteratee(array[index], index, array);
      }
      return result;
    }

    /**
     * The base implementation of `_.unary` without support for storing metadata.
     *
     * @private
     * @param {Function} func The function to cap arguments for.
     * @returns {Function} Returns the new capped function.
     */
    function baseUnary(func) {
      return function(value) {
        return func(value);
      };
    }

    /**
     * Checks if a `cache` value for `key` exists.
     *
     * @private
     * @param {Object} cache The cache to query.
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function cacheHas(cache, key) {
      return cache.has(key);
    }

    /** Used as the size to enable large array optimizations. */
    var LARGE_ARRAY_SIZE = 200;

    /**
     * The base implementation of methods like `_.difference` without support
     * for excluding multiple arrays or iteratee shorthands.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Array} values The values to exclude.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of filtered values.
     */
    function baseDifference(array, values, iteratee, comparator) {
      var index = -1,
          includes = arrayIncludes,
          isCommon = true,
          length = array.length,
          result = [],
          valuesLength = values.length;

      if (!length) {
        return result;
      }
      if (iteratee) {
        values = arrayMap(values, baseUnary(iteratee));
      }
      if (comparator) {
        includes = arrayIncludesWith;
        isCommon = false;
      }
      else if (values.length >= LARGE_ARRAY_SIZE) {
        includes = cacheHas;
        isCommon = false;
        values = new SetCache(values);
      }
      outer:
      while (++index < length) {
        var value = array[index],
            computed = iteratee == null ? value : iteratee(value);

        value = (comparator || value !== 0) ? value : 0;
        if (isCommon && computed === computed) {
          var valuesIndex = valuesLength;
          while (valuesIndex--) {
            if (values[valuesIndex] === computed) {
              continue outer;
            }
          }
          result.push(value);
        }
        else if (!includes(values, computed, comparator)) {
          result.push(value);
        }
      }
      return result;
    }

    /**
     * Appends the elements of `values` to `array`.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {Array} values The values to append.
     * @returns {Array} Returns `array`.
     */
    function arrayPush(array, values) {
      var index = -1,
          length = values.length,
          offset = array.length;

      while (++index < length) {
        array[offset + index] = values[index];
      }
      return array;
    }

    /**
     * Checks if `value` is object-like. A value is object-like if it's not `null`
     * and has a `typeof` result of "object".
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
     * @example
     *
     * _.isObjectLike({});
     * // => true
     *
     * _.isObjectLike([1, 2, 3]);
     * // => true
     *
     * _.isObjectLike(_.noop);
     * // => false
     *
     * _.isObjectLike(null);
     * // => false
     */
    function isObjectLike(value) {
      return value != null && typeof value == 'object';
    }

    /** `Object#toString` result references. */
    var argsTag = '[object Arguments]';

    /**
     * The base implementation of `_.isArguments`.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an `arguments` object,
     */
    function baseIsArguments(value) {
      return isObjectLike(value) && baseGetTag(value) == argsTag;
    }

    /** Used for built-in method references. */
    var objectProto = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty = objectProto.hasOwnProperty;

    /** Built-in value references. */
    var propertyIsEnumerable = objectProto.propertyIsEnumerable;

    /**
     * Checks if `value` is likely an `arguments` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an `arguments` object,
     *  else `false`.
     * @example
     *
     * _.isArguments(function() { return arguments; }());
     * // => true
     *
     * _.isArguments([1, 2, 3]);
     * // => false
     */
    var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
      return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
        !propertyIsEnumerable.call(value, 'callee');
    };

    /**
     * Checks if `value` is classified as an `Array` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array, else `false`.
     * @example
     *
     * _.isArray([1, 2, 3]);
     * // => true
     *
     * _.isArray(document.body.children);
     * // => false
     *
     * _.isArray('abc');
     * // => false
     *
     * _.isArray(_.noop);
     * // => false
     */
    var isArray = Array.isArray;

    /** Built-in value references. */
    var spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined;

    /**
     * Checks if `value` is a flattenable `arguments` object or array.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
     */
    function isFlattenable(value) {
      return isArray(value) || isArguments(value) ||
        !!(spreadableSymbol && value && value[spreadableSymbol]);
    }

    /**
     * The base implementation of `_.flatten` with support for restricting flattening.
     *
     * @private
     * @param {Array} array The array to flatten.
     * @param {number} depth The maximum recursion depth.
     * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
     * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
     * @param {Array} [result=[]] The initial result value.
     * @returns {Array} Returns the new flattened array.
     */
    function baseFlatten(array, depth, predicate, isStrict, result) {
      var index = -1,
          length = array.length;

      predicate || (predicate = isFlattenable);
      result || (result = []);

      while (++index < length) {
        var value = array[index];
        if (depth > 0 && predicate(value)) {
          if (depth > 1) {
            // Recursively flatten arrays (susceptible to call stack limits).
            baseFlatten(value, depth - 1, predicate, isStrict, result);
          } else {
            arrayPush(result, value);
          }
        } else if (!isStrict) {
          result[result.length] = value;
        }
      }
      return result;
    }

    /**
     * This method returns the first argument it receives.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {*} value Any value.
     * @returns {*} Returns `value`.
     * @example
     *
     * var object = { 'a': 1 };
     *
     * console.log(_.identity(object) === object);
     * // => true
     */
    function identity(value) {
      return value;
    }

    /**
     * A faster alternative to `Function#apply`, this function invokes `func`
     * with the `this` binding of `thisArg` and the arguments of `args`.
     *
     * @private
     * @param {Function} func The function to invoke.
     * @param {*} thisArg The `this` binding of `func`.
     * @param {Array} args The arguments to invoke `func` with.
     * @returns {*} Returns the result of `func`.
     */
    function apply(func, thisArg, args) {
      switch (args.length) {
        case 0: return func.call(thisArg);
        case 1: return func.call(thisArg, args[0]);
        case 2: return func.call(thisArg, args[0], args[1]);
        case 3: return func.call(thisArg, args[0], args[1], args[2]);
      }
      return func.apply(thisArg, args);
    }

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeMax = Math.max;

    /**
     * A specialized version of `baseRest` which transforms the rest array.
     *
     * @private
     * @param {Function} func The function to apply a rest parameter to.
     * @param {number} [start=func.length-1] The start position of the rest parameter.
     * @param {Function} transform The rest array transform.
     * @returns {Function} Returns the new function.
     */
    function overRest(func, start, transform) {
      start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
      return function() {
        var args = arguments,
            index = -1,
            length = nativeMax(args.length - start, 0),
            array = Array(length);

        while (++index < length) {
          array[index] = args[start + index];
        }
        index = -1;
        var otherArgs = Array(start + 1);
        while (++index < start) {
          otherArgs[index] = args[index];
        }
        otherArgs[start] = transform(array);
        return apply(func, this, otherArgs);
      };
    }

    /**
     * Creates a function that returns `value`.
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @category Util
     * @param {*} value The value to return from the new function.
     * @returns {Function} Returns the new constant function.
     * @example
     *
     * var objects = _.times(2, _.constant({ 'a': 1 }));
     *
     * console.log(objects);
     * // => [{ 'a': 1 }, { 'a': 1 }]
     *
     * console.log(objects[0] === objects[1]);
     * // => true
     */
    function constant(value) {
      return function() {
        return value;
      };
    }

    var defineProperty = (function() {
      try {
        var func = getNative(Object, 'defineProperty');
        func({}, '', {});
        return func;
      } catch (e) {}
    }());

    /**
     * The base implementation of `setToString` without support for hot loop shorting.
     *
     * @private
     * @param {Function} func The function to modify.
     * @param {Function} string The `toString` result.
     * @returns {Function} Returns `func`.
     */
    var baseSetToString = !defineProperty ? identity : function(func, string) {
      return defineProperty(func, 'toString', {
        'configurable': true,
        'enumerable': false,
        'value': constant(string),
        'writable': true
      });
    };

    /** Used to detect hot functions by number of calls within a span of milliseconds. */
    var HOT_COUNT = 800,
        HOT_SPAN = 16;

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeNow = Date.now;

    /**
     * Creates a function that'll short out and invoke `identity` instead
     * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
     * milliseconds.
     *
     * @private
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new shortable function.
     */
    function shortOut(func) {
      var count = 0,
          lastCalled = 0;

      return function() {
        var stamp = nativeNow(),
            remaining = HOT_SPAN - (stamp - lastCalled);

        lastCalled = stamp;
        if (remaining > 0) {
          if (++count >= HOT_COUNT) {
            return arguments[0];
          }
        } else {
          count = 0;
        }
        return func.apply(undefined, arguments);
      };
    }

    /**
     * Sets the `toString` method of `func` to return `string`.
     *
     * @private
     * @param {Function} func The function to modify.
     * @param {Function} string The `toString` result.
     * @returns {Function} Returns `func`.
     */
    var setToString = shortOut(baseSetToString);

    /**
     * The base implementation of `_.rest` which doesn't validate or coerce arguments.
     *
     * @private
     * @param {Function} func The function to apply a rest parameter to.
     * @param {number} [start=func.length-1] The start position of the rest parameter.
     * @returns {Function} Returns the new function.
     */
    function baseRest(func, start) {
      return setToString(overRest(func, start, identity), func + '');
    }

    /** Used as references for various `Number` constants. */
    var MAX_SAFE_INTEGER = 9007199254740991;

    /**
     * Checks if `value` is a valid array-like length.
     *
     * **Note:** This method is loosely based on
     * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
     * @example
     *
     * _.isLength(3);
     * // => true
     *
     * _.isLength(Number.MIN_VALUE);
     * // => false
     *
     * _.isLength(Infinity);
     * // => false
     *
     * _.isLength('3');
     * // => false
     */
    function isLength(value) {
      return typeof value == 'number' &&
        value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }

    /**
     * Checks if `value` is array-like. A value is considered array-like if it's
     * not a function and has a `value.length` that's an integer greater than or
     * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
     * @example
     *
     * _.isArrayLike([1, 2, 3]);
     * // => true
     *
     * _.isArrayLike(document.body.children);
     * // => true
     *
     * _.isArrayLike('abc');
     * // => true
     *
     * _.isArrayLike(_.noop);
     * // => false
     */
    function isArrayLike(value) {
      return value != null && isLength(value.length) && !isFunction(value);
    }

    /**
     * This method is like `_.isArrayLike` except that it also checks if `value`
     * is an object.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array-like object,
     *  else `false`.
     * @example
     *
     * _.isArrayLikeObject([1, 2, 3]);
     * // => true
     *
     * _.isArrayLikeObject(document.body.children);
     * // => true
     *
     * _.isArrayLikeObject('abc');
     * // => false
     *
     * _.isArrayLikeObject(_.noop);
     * // => false
     */
    function isArrayLikeObject(value) {
      return isObjectLike(value) && isArrayLike(value);
    }

    /**
     * Creates an array of `array` values not included in the other given arrays
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons. The order and references of result values are
     * determined by the first array.
     *
     * **Note:** Unlike `_.pullAll`, this method returns a new array.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {...Array} [values] The values to exclude.
     * @returns {Array} Returns the new array of filtered values.
     * @see _.without, _.xor
     * @example
     *
     * _.difference([2, 1], [2, 3]);
     * // => [1]
     */
    var difference = baseRest(function(array, values) {
      return isArrayLikeObject(array)
        ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true))
        : [];
    });

    /** Error message constants. */
    var FUNC_ERROR_TEXT = 'Expected a function';

    /**
     * Creates a function that memoizes the result of `func`. If `resolver` is
     * provided, it determines the cache key for storing the result based on the
     * arguments provided to the memoized function. By default, the first argument
     * provided to the memoized function is used as the map cache key. The `func`
     * is invoked with the `this` binding of the memoized function.
     *
     * **Note:** The cache is exposed as the `cache` property on the memoized
     * function. Its creation may be customized by replacing the `_.memoize.Cache`
     * constructor with one whose instances implement the
     * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
     * method interface of `clear`, `delete`, `get`, `has`, and `set`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to have its output memoized.
     * @param {Function} [resolver] The function to resolve the cache key.
     * @returns {Function} Returns the new memoized function.
     * @example
     *
     * var object = { 'a': 1, 'b': 2 };
     * var other = { 'c': 3, 'd': 4 };
     *
     * var values = _.memoize(_.values);
     * values(object);
     * // => [1, 2]
     *
     * values(other);
     * // => [3, 4]
     *
     * object.a = 2;
     * values(object);
     * // => [1, 2]
     *
     * // Modify the result cache.
     * values.cache.set(object, ['a', 'b']);
     * values(object);
     * // => ['a', 'b']
     *
     * // Replace `_.memoize.Cache`.
     * _.memoize.Cache = WeakMap;
     */
    function memoize(func, resolver) {
      if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      var memoized = function() {
        var args = arguments,
            key = resolver ? resolver.apply(this, args) : args[0],
            cache = memoized.cache;

        if (cache.has(key)) {
          return cache.get(key);
        }
        var result = func.apply(this, args);
        memoized.cache = cache.set(key, result) || cache;
        return result;
      };
      memoized.cache = new (memoize.Cache || MapCache);
      return memoized;
    }

    // Expose `MapCache`.
    memoize.Cache = MapCache;

    const testIfRoamDateAndConvert = (dateStr) => {
        try {
            return window.roam42.dateProcessing.testIfRoamDateAndConvert(dateStr);
        }
        catch {
            return false;
        }
    };

    var dateProcessing = /*#__PURE__*/Object.freeze({
        __proto__: null,
        testIfRoamDateAndConvert: testIfRoamDateAndConvert
    });

    // @ts-nocheck
    const batchCreateBlocks = async (parent_uid, starting_block_order = 0, string_array_to_insert, renderItem = (x) => x) => {
        string_array_to_insert.forEach(async (item, counter) => {
            await window.roam42.common.createBlock(parent_uid, counter + starting_block_order, `${renderItem(item)}`);
        });
    };
    const deepCreateBlock = async (parentUid, array, options = {}) => {
        const { textKey = "text", childrenKey = "children", shouldOrder = false, startOrder = 0, afterCreateBlock, renderItem = (x) => x } = options;
        let afterCreateBlock_exit = false;
        async function loop(parentUid, menu, startOrder) {
            // @ts-ignore
            const list = shouldOrder ? menu.sort((a, b) => a.order - b.order) : menu;
            for (let i = 0; i < list.length; i++) {
                if (!parentUid)
                    return;
                const a = list[i];
                const string = renderItem(a[textKey], a);
                // filter
                if (string) {
                    const uid = await window.roam42.common.createBlock(parentUid, startOrder + i, string);
                    if (afterCreateBlock_exit || (afterCreateBlock === null || afterCreateBlock === void 0 ? void 0 : afterCreateBlock(a, uid)) === false)
                        afterCreateBlock_exit = true;
                    if (a[childrenKey]) {
                        loop(uid, a[childrenKey], startOrder); // child sync is not necessary
                    }
                }
            }
        }
        await loop(parentUid, array, startOrder);
    };
    // copy a template block's children to one block's child
    const copyTemplateBlock = async (parentUid, templateUidOrBlocks, options = {}) => {
        const { startOrder = 0, afterCreateBlock, renderItem, childrenKey, textKey } = options;
        if (typeof templateUidOrBlocks === "string") {
            const info = await window.roam42.common.getBlockInfoByUID(templateUidOrBlocks, true);
            if (info) {
                deepCreateBlock(parentUid, info[0][0].children, {
                    shouldOrder: true,
                    startOrder,
                    textKey: textKey || "string",
                    childrenKey: childrenKey || "children",
                    afterCreateBlock,
                    renderItem
                });
            }
        }
        else {
            deepCreateBlock(parentUid, templateUidOrBlocks, {
                textKey: textKey || "text",
                childrenKey: childrenKey || "children",
                shouldOrder: true,
                startOrder,
                afterCreateBlock,
                renderItem
            });
        }
    };
    // 当前页面标题，如果是聚焦模式，取第一个面包屑
    const getCurrentPageTitle = (activeDOM = document.activeElement) => getValueInOrderIfError([
        // 引用区看引用页面的标题
        () => activeDOM.closest(".rm-ref-page-view").querySelector(".rm-ref-page-view-title").innerText,
        // daily note
        () => activeDOM.closest(".roam-log-page").querySelector(".rm-title-display").innerText,
        // 特定页面
        () => activeDOM.closest(".roam-article").querySelector(".rm-title-display").innerText,
        // 聚焦模式看面包屑
        () => activeDOM.closest(".roam-article").querySelector(".rm-zoom-item").innerText,
        // 侧边栏标题
        () => activeDOM.closest(".rm-sidebar-outline").querySelector(".rm-title-display").innerText,
        // 侧边栏面包屑
        () => activeDOM.closest(".rm-sidebar-outline").querySelector(".rm-zoom-item").innerText
    ], "404");
    const getCurrentBlockUid = () => {
        let id = null;
        let res = null;
        try {
            id = document.querySelector("textarea.rm-block-input").id;
        }
        catch (e) {
            id = document.activeElement.id;
        }
        if (!id) {
            console.log("id 都获取不到");
            window.roam42.help.displayMessage("id 都获取不到", 2000);
        }
        res = getBlockUidFromId(id);
        console.log("getCurrentBlockUid", { res, id });
        !res && window.roam42.help.displayMessage("获取不到当前 block uid", 2000);
        return res;
    };
    const deleteCurrentBlock = async (uid = getCurrentBlockUid()) => {
        if (uid) {
            await window.roam42.common.deleteBlock(uid);
        }
    };
    const getParentBlockNode = (dom = document.activeElement) => {
        try {
            return dom.closest(".rm-block-children").closest(".roam-block-container");
        }
        catch (e) {
            console.log("getParentBlockNode error", e);
            return null;
        }
    };
    const getParentBlockUid = async (dom = document.activeElement) => {
        try {
            return (await window.roam42.common.getDirectBlockParentUid(getCurrentBlockUid())).parentUID;
        }
        catch (e) {
            console.log(e);
            window.roam42.help.displayMessage("getParentBlockUid 执行出错", 2000);
            return null;
        }
    };
    // 当前 block 的最后一个子 block 的 uid
    const getLastChildUidByNode = (containerNode) => {
        try {
            return containerNode
                .querySelector(".rm-block-children .roam-block-container:last-child")
                .querySelector(".rm-block-main .rm-block__input")
                .id.slice(-9);
        }
        catch (e) {
            console.log("getLastChildUid error", e);
            return null;
        }
    };
    const getLastChildUidByUid = async (parentBlockUid = getParentBlockUid()) => {
        try {
            const childrenContent = await window.roam42.common.getBlockInfoByUID(parentBlockUid, true);
            return childrenContent[0][0].children.sort((a, b) => a.sort - b.sort).slice(-1)[0].uid;
        }
        catch (e) {
            console.log("getLastChildUid error", e);
            return null;
        }
    };
    // 需要 focus，当前 block 的最后一个相邻兄弟节点的 uid
    const getLastBilingBlockUid = async () => {
        try {
            return getLastChildUidByNode(getParentBlockNode());
        }
        catch (e) {
            console.log("getLastBilingBlockUid error", e);
            return null;
        }
    };
    // 当前 block 信息，主要获取 order 用，为了能在当前位置插入 block
    const getCurrentBlockInfo = async (currentBlockUid = getCurrentBlockUid(), withChild = false) => {
        const currentBlockInfo = await window.roam42.common.getBlockInfoByUID(currentBlockUid, withChild);
        try {
            return currentBlockInfo[0][0];
        }
        catch (e) {
            console.log(currentBlockInfo);
            window.roam42.help.displayMessage("getCurrentBlockInfo 执行出错", 2000);
        }
    };
    // 处理前后的当前 block 状态，包括异步文案的显示与重置
    const outputBlocks = async (fn, options = {}) => {
        const { isAsync = false, deleteCurrentBlock = false } = options;
        const prevValue = document.activeElement.value;
        isAsync && (document.activeElement.value += "fetching...");
        try {
            const currentBlockUid = getCurrentBlockUid();
            const res = await fn({ currentBlockContent: prevValue, currentBlockUid });
            deleteCurrentBlock && window.roam42.common.deleteBlock(currentBlockUid);
            document.activeElement.value = prevValue;
            !deleteCurrentBlock && window.roam42.common.updateBlock(getCurrentBlockUid(), prevValue);
            return res;
        }
        catch (e) {
            console.log("outputBlocks error", e);
            roam42.help.displayMessage("outputBlocks 执行出错", 2000);
        }
    };
    const updateCurrentBlock = async (fn, options = {}) => {
        const { isAsync = false } = options;
        const prevValue = document.activeElement.value;
        isAsync && (document.activeElement.value += "fetching...");
        try {
            const currentBlockUid = getCurrentBlockUid();
            const res = typeof fn === "function" ? await fn({ currentBlockContent: prevValue, currentBlockUid }) : fn;
            document.activeElement.value = res;
            window.roam42.common.updateBlock(currentBlockUid, res);
            return res;
        }
        catch (e) {
            console.log("updateCurrentBlock error", e);
            window.roam42.help.displayMessage("updateCurrentBlock 执行出错", 2000);
        }
    };
    const outputListIntoOne = async ({ title, output, parentBlockUid, order, sleep = 50, renderItem = (x) => x, customOutput }) => {
        if ((output === null || output === void 0 ? void 0 : output.length) > 0) {
            order = order || (await getCurrentBlockInfo()).order || 99999;
            const _parentBlockUid = parentBlockUid || (await getParentBlockUid());
            const uid = await window.roam42.common.createBlock(_parentBlockUid, order, title);
            if (customOutput) {
                customOutput(uid, order);
            }
            else {
                await batchCreateBlocks(uid, order, output, renderItem);
            }
            return uid;
        }
        else {
            console.log("outputListIntoOne", "output 为空");
        }
    };
    // [当前位置/当前位置的子级] 插入 block，传入数组可批量
    const outputBlocksRightHere = async (string0, options = {}) => {
        const { isAsync = false, deleteCurrentBlock = false, renderItem = (x) => x, toChild = false // 是否插入到当前 block 的子级
         } = options;
        await outputBlocks(async ({ currentBlockUid }) => {
            const uid = toChild ? currentBlockUid : await getParentBlockUid();
            const order = toChild ? 99999 : (await getCurrentBlockInfo(currentBlockUid)).order + 1;
            let string = typeof string0 === "function" ? await string0({ currentBlockUid }) : string0;
            if (Array.isArray(string)) {
                await batchCreateBlocks(uid, order, string, renderItem);
            }
            else {
                await window.roam42.common.createBlock(uid, order, renderItem(string));
            }
        }, { isAsync, deleteCurrentBlock: toChild ? false : deleteCurrentBlock });
    };
    // 收集某个 key 相关的标签列表
    const getTags = async (tagName) => {
        try {
            const refers = await window.roam42.common.getBlocksReferringToThisPage(tagName);
            const tags = (refers || [])
                .reduce((memo, r) => {
                // 合并当前行或者直系子层级包含的所有 tag
                return [
                    ...memo,
                    r[0],
                    ...(r[0].children &&
                        new RegExp(String.raw `((^\[\[${tagName}\]\]$|)|(${tagName}\:\:))`).test(r[0].string)
                        ? r[0].children
                        : [])
                ];
            }, [])
                .reduce((memo, a) => {
                return [...memo, ...extractTags(a.string)];
            }, []);
            if (!tags.length) {
                window.roam42.help.displayMessage(`getOptions: ${tagName}获取不到索引`, 2000);
            }
            return unique(tags);
        }
        catch (e) {
            console.log("getTags error", e);
            window.roam42.help.displayMessage("getTags 执行出错", 2000);
        }
    };

    var common = /*#__PURE__*/Object.freeze({
        __proto__: null,
        batchCreateBlocks: batchCreateBlocks,
        deepCreateBlock: deepCreateBlock,
        copyTemplateBlock: copyTemplateBlock,
        getCurrentPageTitle: getCurrentPageTitle,
        getCurrentBlockUid: getCurrentBlockUid,
        deleteCurrentBlock: deleteCurrentBlock,
        getParentBlockNode: getParentBlockNode,
        getParentBlockUid: getParentBlockUid,
        getLastChildUidByNode: getLastChildUidByNode,
        getLastChildUidByUid: getLastChildUidByUid,
        getLastBilingBlockUid: getLastBilingBlockUid,
        getCurrentBlockInfo: getCurrentBlockInfo,
        outputBlocks: outputBlocks,
        updateCurrentBlock: updateCurrentBlock,
        outputListIntoOne: outputListIntoOne,
        outputBlocksRightHere: outputBlocksRightHere,
        getTags: getTags
    });

    function confirm(message, options = {}) {
        return new Promise((resolve) => {
            window.iziToast.question({
                timeout: 10000,
                close: false,
                overlay: true,
                displayMode: 1,
                id: "question",
                zindex: 999,
                title: message,
                position: "topCenter",
                buttons: [
                    [
                        `<button><b>${navigator.language === "zh-CN" ? "是" : "YES"}</b></button>`,
                        function (instance, toast) {
                            instance.hide({ transitionOut: "fadeOut" }, toast, "true");
                        },
                        true
                    ],
                    [
                        `<button>${navigator.language === "zh-CN" ? " 否" : "NO"}</button>`,
                        function (instance, toast) {
                            instance.hide({ transitionOut: "fadeOut" }, toast, "false");
                        },
                        false
                    ]
                ],
                onClosing: function (instance, toast, closedBy) {
                    resolve(closedBy === "timeout" ? false : JSON.parse(closedBy));
                },
                ...options
            });
        });
    }
    function prompt(message, options = {}) {
        return new Promise((resolve) => {
            let res;
            window.iziToast.info({
                timeout: 20000,
                overlay: true,
                displayMode: 1,
                id: "inputs",
                zindex: 999,
                title: message,
                position: "topCenter",
                drag: false,
                inputs: [
                    [
                        '<input type="text">',
                        "keyup",
                        function (instance, toast, input, e) {
                            res = input.value;
                        },
                        true
                    ]
                ],
                buttons: [
                    [
                        "<button><b>YES</b></button>",
                        function (instance, toast) {
                            instance.hide({ transitionOut: "fadeOut" }, toast, res);
                        },
                        false
                    ],
                    [
                        "<button>NO</button>",
                        function (instance, toast) {
                            instance.hide({ transitionOut: "fadeOut" }, toast, "");
                        },
                        false
                    ]
                ],
                onClosing: function (instance, toast, closedBy) {
                    resolve((closedBy !== "timeout" && closedBy) || "");
                },
                ...options
            });
        });
    }

    var help = /*#__PURE__*/Object.freeze({
        __proto__: null,
        confirm: confirm,
        prompt: prompt
    });

    var roamEnhance = { common, utils, dateProcessing, help };

    const processBlock = async (parentUid, block, menuMap, onClickArgs, $ctx) => {
        var _a, _b;
        const { currentUid, selectUids, target, pageTitle } = onClickArgs;
        const js = block.string.match(/^\`\`\`javascript\n([\s\S]*)\`\`\`$/);
        if (js) {
            const code = js[1];
            const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;
            try {
                const result = await new AsyncFunction("$ctx", "$currentUid", "$selectUids", "$target", "$pageTitle", code)($ctx, currentUid, selectUids, target, pageTitle);
                if (((_a = block.children) === null || _a === void 0 ? void 0 : _a.length) || result) {
                    return await window.roam42.common.createBlock(parentUid, block.order, `${result || ""}`);
                }
                return;
            }
            catch (e) {
                console.log(e);
                window.iziToast.info({
                    position: "topCenter",
                    title: navigator.language === "zh-CN" ? "执行错误" : "task error"
                });
                return;
            }
        }
        const internalMenu = block.string.match(/<%\s*menu:\s*(.*)\s*%>/);
        if (internalMenu) {
            const menu = menuMap[internalMenu[1]];
            if (menu) {
                (_b = menu.onClick) === null || _b === void 0 ? void 0 : _b.call(menu, onClickArgs);
            }
            else {
                window.iziToast.error({
                    title: navigator.language === "zh-CN"
                        ? `不存在 menu: ${internalMenu[1]}`
                        : `no menu named${internalMenu[1]} found`,
                    position: "topCenter",
                    timeout: 3000
                });
            }
            return;
        }
        return await window.roam42.common.createBlock(parentUid, block.order, await window.roam42.smartBlocks.proccessBlockWithSmartness(block.string));
    };
    async function runTasksByBlocks(blocks, menuMap, onClickArgs) {
        const { currentUid, pageTitle } = onClickArgs;
        let finalUid;
        if (currentUid) {
            finalUid = currentUid;
        }
        else if (pageTitle) {
            finalUid = await window.roam42.common.getPageUidByTitle(pageTitle);
        }
        const runTasks = async (parentUid, blocks) => {
            for (const block of blocks.sort((a, b) => a.order - b.order)) {
                const uid = await processBlock(parentUid, block, menuMap, onClickArgs, $ctx);
                if (block.children) {
                    runTasks(uid || parentUid, block.children); // child sync is not necessary
                }
            }
        };
        let $ctx = {};
        await runTasks(finalUid, blocks);
        $ctx = {};
    }

    let commonMenu = [
        {
            text: "All children's highlight",
            key: "Extract All children's highlight",
            onClick: async ({ currentUid }) => {
                let highlights = [];
                await roamEnhance.utils.patchBlockChildren(currentUid, (a) => {
                    const m = a.string.match(/\^\^([\s\S]*?)\^\^/g);
                    m && highlights.push(...m);
                });
                await navigator.clipboard.writeText(highlights.join("\n"));
                if (highlights.length > 0) {
                    window.iziToast.success({
                        title: navigator.language === "zh-CN"
                            ? "提取高亮成功，已复制到剪切板"
                            : "Extract successfully, Copied to clipboard!"
                    });
                }
                else {
                    window.iziToast.info({
                        position: "topCenter",
                        title: navigator.language === "zh-CN" ? "提取不到高亮内容" : "Can't extract anything"
                    });
                }
            }
        }
    ];
    let blockMenu = [
        ...commonMenu,
        {
            text: "Delete",
            key: "Delete",
            children: [
                {
                    text: "Delete block and its references",
                    key: "Delete block and its references",
                    onClick: async ({ currentUid, selectUids }) => {
                        if (await confirm(navigator.language === "zh-CN"
                            ? `确定删除当前所选 block 及其所有块引用`
                            : `Sure to delete the current block and its all references??`)) {
                            [currentUid, ...selectUids].forEach(async (uid) => {
                                const refers = await window.roam42.common.getBlocksReferringToThisBlockRef(uid);
                                if (refers.length > 0) {
                                    refers.forEach(async (a) => window.roam42.common.deleteBlock(a[0].uid));
                                }
                                window.roam42.common.deleteBlock(uid);
                            });
                        }
                    }
                },
                {
                    text: "Delete current block and embed block's refers",
                    key: "Delete current block and embed block's refers",
                    onClick: async ({ currentUid }) => {
                        try {
                            const info = await roamEnhance.common.getCurrentBlockInfo(currentUid);
                            const embed = info.string.match(/\{\{\[\[embed\]\]\:\s+\(\(\(\((.*?)\)\)\)\)\}\}/);
                            if (embed) {
                                const originUid = embed[1];
                                const refers = await window.roam42.common.getBlocksReferringToThisBlockRef(originUid);
                                if (refers.length > 0 &&
                                    (await confirm(`该 block 包含有 embed，embed 原 block有${refers.length}个块引用，是否一起删除`))) {
                                    refers.forEach(async (a) => window.roam42.common.deleteBlock(a[0].uid));
                                    window.roam42.common.deleteBlock(originUid);
                                    window.roam42.help.displayMessage(`删除${refers.length}个引用`, 2000);
                                    window.iziToast.info({
                                        position: "topCenter",
                                        title: navigator.language === "zh-CN"
                                            ? `删除${refers.length}个引用`
                                            : `delete${refers.length} references`
                                    });
                                }
                            }
                            window.roam42.common.deleteBlock(currentUid);
                        }
                        catch (e) {
                            console.log(e);
                            window.iziToast.error({
                                title: navigator.language === "zh-CN" ? "删除出错" : "Delete failed"
                            });
                        }
                    }
                }
            ]
        },
        {
            text: "Format",
            key: "Format",
            children: [
                {
                    text: "Remove tags",
                    key: "Remove tags",
                    onClick: async ({ currentUid, selectUids }) => {
                        [currentUid, ...selectUids].forEach(async (uid) => {
                            const a = await roamEnhance.common.getCurrentBlockInfo(uid);
                            await window.roam42.common.updateBlock(uid, roamEnhance.utils.removeTags(a.string));
                        });
                    }
                }
            ]
        },
        {
            text: "Format child blocks",
            key: "Format child blocks",
            children: [
                {
                    text: "Embed to text",
                    key: "Child embed to text",
                    onClick: async ({ currentUid }) => {
                        await roamEnhance.utils.patchBlockChildren(currentUid, async (a) => {
                            const m = a.string.match(/\{\{\[\[embed\]\]\:\s+\(\(\(\((.*?)\)\)\)\)\}\}/);
                            const originUid = m && m[1];
                            if (originUid) {
                                const originInfo = await window.roam42.common.getBlockInfoByUID(originUid);
                                window.roam42.common.updateBlock(a.uid, originInfo[0][0].string);
                            }
                        });
                    }
                },
                {
                    text: "Remove tags",
                    key: "Child blocks remove tags",
                    onClick: async ({ currentUid }) => {
                        roamEnhance.utils.patchBlockChildren(currentUid, (a) => {
                            const newString = roamEnhance.utils.removeTags(a.string);
                            if (newString !== a.string) {
                                window.roam42.common.updateBlock(a.uid, newString);
                            }
                        });
                    }
                },
                {
                    text: "Merge blocks",
                    key: "Merge child blocks",
                    onClick: async ({ currentUid }) => {
                        const count = +window.prompt(navigator.language === "zh-CN" ? "每多少行为一组进行合并？" : "How many lines into one?");
                        if (count) {
                            const prefix = window.prompt(navigator.language === "zh-CN" ? " 前缀？" : "prefix?");
                            const currentBlockInfo = await window.roam42.common.getBlockInfoByUID(currentUid, true);
                            const childBlocks = currentBlockInfo[0][0].children.sort((a, b) => a.order - b.order);
                            let temp = "";
                            let bundleIndex = 0;
                            for (let i = 0; i < childBlocks.length; i++) {
                                const a = childBlocks[i];
                                window.roam42.common.deleteBlock(a.uid);
                                temp += `${!!temp ? "\n" : ""}${a.string}`;
                                if ((i > count - 2 && (i + 1) % count === 0) || i === childBlocks.length - 1) {
                                    window.roam42.common.createBlock(currentUid, bundleIndex++, `${prefix}${temp}`);
                                    temp = "";
                                }
                            }
                        }
                    }
                }
            ]
        },
        {
            text: "Cloze",
            key: "Cloze",
            children: [
                {
                    text: "Expand all",
                    key: "Expand all cloze",
                    onClick: async ({ target }) => {
                        target
                            .closest(".roam-block-container")
                            .querySelectorAll(".rm-block-children .rm-paren > .rm-spacer")
                            .forEach((a) => a.click());
                    }
                },
                {
                    text: "Collapse all",
                    key: "Collapse all cloze",
                    onClick: async ({ target }) => {
                        target
                            .closest(".roam-block-container")
                            .querySelectorAll(".rm-block-children .rm-paren__paren")
                            .forEach((a) => a.click());
                    }
                }
            ]
        }
    ];
    let pageTitleMenu = [
        ...commonMenu,
        {
            text: "Clear current block/page",
            key: "Clear current block/page",
            onClick: async ({ currentUid }) => {
                if (await roamEnhance.help.confirm(navigator.language === "zh-CN"
                    ? "确定清空当前页/Block吗？"
                    : "Are you sure to clear the current block/page?")) {
                    const info = await window.roam42.common.getBlockInfoByUID(currentUid, true);
                    info[0][0].children.forEach((a) => {
                        window.roam42.common.deleteBlock(a.uid);
                    });
                }
            }
        },
        {
            text: "Delete all refering blocks",
            key: "Delete all refering blocks",
            onClick: async ({ pageTitle }) => {
                const refers = await window.roam42.common.getBlocksReferringToThisPage(pageTitle);
                if (refers.length) {
                    if (await confirm(navigator.language === "zh-CN"
                        ? `当前页面有${refers.length}个引用，是否全部删除？`
                        : `Current page has ${refers.length} references, remove all?`)) {
                        refers.forEach(async (a) => window.roam42.common.deleteBlock(a[0].uid));
                    }
                }
                else {
                    window.iziToast.info({
                        title: navigator.language === "zh-CN" ? "该页面没有引用" : "This page has no reference",
                        position: "topCenter",
                        timeout: 2000
                    });
                }
            }
        },
        {
            text: "Extract currentPage's refers",
            key: "Extract currentPage's refers",
            onClick: async ({ pageTitle }) => {
                const refers = await window.roam42.common.getBlocksReferringToThisPage(pageTitle);
                if (!refers.length) {
                    window.iziToast.info({
                        position: "topCenter",
                        title: navigator.language === "zh-CN" ? "提取不到东西" : "Can't extract anything"
                    });
                    return;
                }
                function getContentWithChildren(item, depth = 2) {
                    return `${item.string}
              ${item.children
                    ? item.children
                        .map((a) => "    ".repeat(depth) + getContentWithChildren(a, depth + 1))
                        .join("\n")
                    : ""}`;
                }
                const refersByUid = refers.reduce((memo, a) => {
                    const uid = a[0].uid;
                    memo[uid] = a;
                    return memo;
                }, {});
                const pageNames = await window.roam42.common.getPageNamesFromBlockUidList(refers.map((a) => a[0].uid));
                const groupByPageUid = pageNames
                    .sort((a, b) => !!+new Date(a[1].uid) &&
                    !!+new Date(b[1].uid) &&
                    +new Date(a[1].uid) > +new Date(b[1].uid)
                    ? 1
                    : -1)
                    .reduce((memo, a, i) => {
                    const uid = a[1].uid;
                    memo[uid] = [...(memo[uid] || []), { ...a[0], title: a[1].title }];
                    return memo;
                }, {});
                const res = Object.keys(groupByPageUid)
                    .map((uid) => {
                    return `${groupByPageUid[uid][0].title}
          ${groupByPageUid[uid]
                    .map((a) => {
                    const blockUid = a.uid;
                    return "    " + getContentWithChildren(refersByUid[blockUid][0]);
                })
                    .join("\n")}`;
                })
                    .join("\n");
                await navigator.clipboard.writeText(res);
                window.iziToast.info({
                    position: "topCenter",
                    title: navigator.language === "zh-CN"
                        ? "提取成功，已复制到剪切板"
                        : "Extract successfullly, Copied to clipboard!"
                });
            }
        }
    ];
    let pageTitleMenu_Sidebar = [
        ...commonMenu,
        {
            text: "Focus on page",
            key: "Focus on page",
            onClick: async ({ pageTitle }) => {
                await window.roam42.common.navigateUiTo(pageTitle);
            }
        },
        ...pageTitleMenu
    ];
    const getMenuMap = memoize((menu) => {
        const map = {};
        const loop = (menu) => {
            menu.forEach((a) => {
                if (a.children) {
                    loop(a.children);
                }
                else {
                    map[a.key] = a;
                }
            });
        };
        loop(menu);
        return map;
    });
    async function getMergeMenu(userBlocks, menuMap) {
        if (!userBlocks || !userBlocks.length)
            return [];
        return await Promise.all(userBlocks.map(async (userBlock) => {
            var _a;
            if (!((_a = userBlock.children) === null || _a === void 0 ? void 0 : _a.length)) {
                return {
                    text: userBlock.string,
                    onClick: () => {
                        window.iziToast.info({
                            title: navigator.language === "zh-CN"
                                ? "该菜单没有配置执行任务"
                                : "This menu has no configuration",
                            position: "topCenter",
                            timeout: 2000
                        });
                    }
                };
            }
            const m = userBlock.string.match(/\{\{(.*)\}\}/);
            if (m) {
                return {
                    text: m[1],
                    onClick: async (onClickArgs) => {
                        await runTasksByBlocks(userBlock.children.sort((a, b) => a.order - b.order), menuMap, onClickArgs);
                    }
                };
            }
            return {
                text: userBlock.string,
                children: await getMergeMenu(userBlock.children, menuMap)
            };
        }));
    }
    async function getMergeMenuOfPage(pageBlocks, key, menu) {
        const info = pageBlocks.find((a) => a.string.includes(key));
        if (info) {
            const menuBlocks = (info && info.children.sort((a, b) => a.order - b.order)) || [];
            return await getMergeMenu(menuBlocks, getMenuMap(menu));
        }
        else {
            return menu;
        }
    }
    async function getMenu(path, clickArea, onClickArgs) {
        const pageUid = await window.roam42.common.getPageUidByTitle("roam/enhance/menu");
        let blocks;
        if (pageUid) {
            const info = await window.roam42.common.getBlockInfoByUID(pageUid, true);
            if (info) {
                blocks = info[0][0].children.sort((a, b) => a.order - b.order);
            }
        }
        if (!blocks)
            return;
        if (clickArea === "block") {
            return (await getMergeMenuOfPage(blocks, "BlockMenu", blockMenu));
        }
        let menu;
        if (clickArea === "pageTitle") {
            menu = await getMergeMenuOfPage(blocks, "PageTitleMenu", pageTitleMenu);
        }
        else if (clickArea === "pageTitle_sidebar") {
            menu = await getMergeMenuOfPage(blocks, "PageTitleMenu_Sidebar", pageTitleMenu_Sidebar);
        }
        if (onClickArgs.pageTitle === "roam/enhance/menu") {
            menu.push({
                text: "Pull all build-in menu",
                onClick: async () => {
                    const pageUid = await window.roam42.common.getPageUidByTitle("roam/enhance/menu");
                    const insertTemplateMenu = (menu) => {
                        return menu.map((a) => {
                            if (a.children) {
                                return { ...a, children: insertTemplateMenu(a.children) };
                            }
                            else {
                                return { ...a, text: `{{${a.text}}}`, children: [{ text: `<%menu:${a.key}%>` }] };
                            }
                        });
                    };
                    deepCreateBlock(pageUid, [
                        { text: "**BlockMenu**", children: insertTemplateMenu(blockMenu) },
                        { text: "**PageTitleMenu**", children: insertTemplateMenu(pageTitleMenu) },
                        {
                            text: "**PageTitleMenu_Sidebar**",
                            children: insertTemplateMenu(pageTitleMenu_Sidebar)
                        }
                    ]);
                }
            }, {
                text: "Pull unused build-in menu",
                onClick: async ({ currentUid }) => {
                    const userMenu = [];
                    await roamEnhance.utils.patchBlockChildren(currentUid, (a) => {
                        const m = a.string.match(/<%\s*menu:\s*(.*)\s*%>/);
                        m && userMenu.push(m[1]);
                    });
                    const internalMenu = Object.keys({
                        ...getMenuMap(blockMenu),
                        ...getMenuMap(pageTitleMenu),
                        ...getMenuMap(pageTitleMenu_Sidebar)
                    });
                    const diff = difference(internalMenu, userMenu).map((a) => `<%menu:${a}%>`);
                    if (diff.length) {
                        await roamEnhance.common.batchCreateBlocks(currentUid, 0, diff);
                    }
                    else {
                        window.iziToast.info({
                            position: "topCenter",
                            title: navigator.language === "zh-CN"
                                ? "当前没有未使用的内置菜单"
                                : "No unused build-in menu found"
                        });
                    }
                }
            });
        }
        if (window.roamEnhance._plugins["metadata"].getMetadataMenu) {
            try {
                const metaDataMenu = await window.roamEnhance._plugins["metadata"].getMetadataMenu();
                metaDataMenu && menu.unshift(metaDataMenu);
            }
            catch (e) {
                console.log(`[plugin error:metadata]`, e);
            }
        }
        return menu;
    }

    const onClickMap = {};
    const getMenuHTML = (menu, parentText = "") => {
        return menu
            .map((a) => {
            if (a.children && a.children.length) {
                return `<li class="bp3-submenu">
                        <span class="bp3-popover-wrapper">
                            <span class="bp3-popover-target">
                                <a class="bp3-menu-item" tabindex="0" data-key="${parentText + a.text}">
                                    <div class="bp3-text-overflow-ellipsis bp3-fill">${a.text}</div>
                                    <span icon="caret-right" class="bp3-icon bp3-icon-caret-right">
                                        <svg data-icon="caret-right" width="16" height="16" viewBox="0 0 16 16">
                                            <desc>caret-right</desc><path d="M11 8c0-.15-.07-.28-.17-.37l-4-3.5A.495.495 0 006 4.5v7a.495.495 0 00.83.37l4-3.5c.1-.09.17-.22.17-.37z" fill-rule="evenodd">
                                            </path>
                                        </svg>
                                    </span>
                                </a>
                            </span>
                            <div class="bp3-overlay bp3-overlay-inline">
                                <div class="bp3-transition-container bp3-popover-appear-done bp3-popover-enter-done" style="position: absolute; will-change: transform; top: 0px; left: 100%; /*transform: translate3d(183px, 0px, 0px);*/">
                                    <div class="bp3-popover bp3-minimal bp3-submenu" style="transform-origin: left center;">
                                        <div class="bp3-popover-content">
                                            <ul class="bp3-menu">
                                                ${getMenuHTML(a.children, parentText + (a.key || a.text))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </span>
                    </li>`;
            }
            else {
                onClickMap[parentText + (a.key || a.text)] = a.onClick;
                return `<li>
                        <a class="bp3-menu-item bp3-popover-dismiss" data-key="${parentText + (a.key || a.text)}">
                            <div class="bp3-text-overflow-ellipsis bp3-fill">${a.text}</div>
                        </a>
                    </li>`;
            }
        })
            .join("");
    };
    function mergeMenuToDOM(menuDOM, menu, onClickArgs) {
        const addItem = document.createElement("template");
        addItem.innerHTML = getMenuHTML(menu);
        [...addItem.content.childNodes].forEach((a) => {
            a.addEventListener("click", async (e) => {
                const target = e.target;
                if (target.classList.contains("bp3-menu-item") ||
                    (target.classList.contains("bp3-fill") &&
                        target.classList.contains("bp3-text-overflow-ellipsis"))) {
                    const onClick = onClickMap[target.closest(".bp3-menu-item").dataset.key];
                    if (onClick) {
                        try {
                            await onClick(onClickArgs);
                        }
                        catch (e) {
                            console.log(e);
                            window.iziToast.error({
                                title: "操作失败",
                                position: "topCenter",
                                timeout: 3000
                            });
                        }
                    }
                }
            });
            [...a.querySelectorAll(".bp3-popover-wrapper")].forEach((a) => {
                a.addEventListener("mouseenter", async (e) => {
                    const target = e.target;
                    if (target.parentNode.classList.contains("bp3-submenu")) {
                        target.querySelector(".bp3-popover-target").classList.add("bp3-popover-open");
                        target.querySelector(".bp3-overlay").classList.add("bp3-overlay-open");
                    }
                });
                a.addEventListener("mouseleave", async (e) => {
                    const target = e.target;
                    if (target.parentNode.classList.contains("bp3-submenu")) {
                        target.querySelector(".bp3-popover-target").classList.remove("bp3-popover-open");
                        target.querySelector(".bp3-overlay").classList.remove("bp3-overlay-open");
                    }
                });
            });
        });
        const divider = document.createElement("li");
        divider.className = "bp3-menu-divider";
        addItem.content.childNodes[addItem.content.childNodes.length - 1].after(divider);
        menuDOM.prepend(addItem.content);
    }

    let mouseX;
    let mouseY;
    document.addEventListener("mousedown", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    const observer = new MutationObserver(async (mutationsList, observer) => {
        const isContextMenu = !!mutationsList.find((m) => m.type === "childList" &&
            (m.target.className === "bp3-context-menu" ||
                m.target.className === "bp3-context-menu-popover-target"));
        if (isContextMenu) {
            // close right click menu
            // if (
            //   mutationsList.find(
            //     (m) =>
            //       m.type === "childList" && m.removedNodes.length > 0 && m.target.className === "bp3-portal"
            //   )
            // ) {
            //   console.log("关闭");
            // }
            let portalMutation = mutationsList.find((m) => m.type === "childList" &&
                m.addedNodes.length > 0 &&
                m.target.className === "bp3-portal");
            // open right click menu
            if (portalMutation) {
                const path = document.elementsFromPoint(mouseX, mouseY);
                const onClickArgs = {};
                let clickArea = null;
                onClickArgs.target = path[1]; // the closest element over mouse, path[0] is overlay
                // click on block
                const rmBlockMainDOM = path.find((a) => a.classList.contains("rm-block-main"));
                if (rmBlockMainDOM) {
                    onClickArgs.currentUid = getBlockUidFromId(rmBlockMainDOM.querySelector(".rm-block__input").id);
                    clickArea = "block";
                }
                // click on page title
                const pageTitleDOM = path.find((a) => a.classList.contains("rm-title-display"));
                if (pageTitleDOM) {
                    onClickArgs.pageTitle = pageTitleDOM.innerText;
                    onClickArgs.currentUid = await window.roam42.common.getPageUidByTitle(onClickArgs.pageTitle);
                    if (path.find((a) => a.classList.contains("sidebar-content"))) {
                        clickArea = "pageTitle_sidebar";
                    }
                    else {
                        clickArea = "pageTitle";
                    }
                }
                const menu = await getMenu(path, clickArea, onClickArgs);
                onClickArgs.selectUids = getSelectBlockUids();
                menu &&
                    mergeMenuToDOM(portalMutation.target.querySelector("ul.bp3-menu"), menu, onClickArgs);
            }
        }
    });
    retry(() => {
        observer.observe(document.body, {
            attributes: false,
            childList: true,
            subtree: true
        });
    });

    var e=[],t=[];function n(n,r){if(n&&"undefined"!=typeof document){var a,s=!0===r.prepend?"prepend":"append",d=!0===r.singleTag,i="string"==typeof r.container?document.querySelector(r.container):document.getElementsByTagName("head")[0];if(d){var u=e.indexOf(i);-1===u&&(u=e.push(i)-1,t[u]={}),a=t[u]&&t[u][s]?t[u][s]:t[u][s]=c();}else a=c();65279===n.charCodeAt(0)&&(n=n.substring(1)),a.styleSheet?a.styleSheet.cssText+=n:a.appendChild(document.createTextNode(n));}function c(){var e=document.createElement("style");if(e.setAttribute("type","text/css"),r.attributes)for(var t=Object.keys(r.attributes),n=0;n<t.length;n++)e.setAttribute(t[n],r.attributes[t[n]]);var a="prepend"===s?"afterbegin":"beforeend";return i.insertAdjacentElement(a,e),e}}

    var css = ".bp3-submenu .bp3-overlay:not(.bp3-overlay-open) {\n  display: none;\n}\n.bp3-submenu > .bp3-popover-wrapper {\n  position: relative;\n}\n.iziToast > .iziToast-body .iziToast-buttons {\n  float: none;\n  text-align: center;\n  margin-left: -28px;\n}\n.iziToast > .iziToast-body .iziToast-icon {\n  top: 20px;\n}\n.iziToast-buttons .iziToast-buttons-child {\n  top: 6px;\n}\n";
    n(css,{});

    var _a, _b;
    if (!((_a = window.roamEnhance) === null || _a === void 0 ? void 0 : _a.loaded)) {
        window.roamEnhance = Object.assign(window.roamEnhance, roamEnhance);
        const host = (window.roamEnhance.host = document.currentScript.src.replace("main.js", ""));
        window.roamEnhance._plugins = {};
        if ((_b = window.roamEnhance) === null || _b === void 0 ? void 0 : _b.plugins.length) {
            window.roamEnhance.plugins.forEach((pluginName) => {
                addScript(`${host}plugins/${pluginName}.js`, pluginName);
            });
        }
        window.roamEnhance.loaded = true;
        window.yoyo = window.roamEnhance;
    }

}());
