var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/openapi-fetch/dist/cjs/index.cjs
var require_cjs = __commonJS({
  "node_modules/openapi-fetch/dist/cjs/index.cjs"(exports, module2) {
    "use strict";
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps2 = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
    var src_exports = {};
    __export(src_exports, {
      createFinalURL: () => createFinalURL,
      default: () => createClient,
      defaultBodySerializer: () => defaultBodySerializer,
      defaultQuerySerializer: () => defaultQuerySerializer,
      mergeHeaders: () => mergeHeaders
    });
    module2.exports = __toCommonJS(src_exports);
    var DEFAULT_HEADERS = {
      "Content-Type": "application/json"
    };
    function createClient(clientOptions = {}) {
      const {
        fetch: baseFetch = globalThis.fetch,
        querySerializer: globalQuerySerializer,
        bodySerializer: globalBodySerializer,
        ...options
      } = clientOptions;
      let baseUrl = options.baseUrl ?? "";
      if (baseUrl.endsWith("/")) {
        baseUrl = baseUrl.slice(0, -1);
      }
      async function coreFetch(url, fetchOptions) {
        const {
          fetch: fetch2 = baseFetch,
          headers,
          body: requestBody,
          params = {},
          parseAs = "json",
          querySerializer = globalQuerySerializer ?? defaultQuerySerializer,
          bodySerializer = globalBodySerializer ?? defaultBodySerializer,
          ...init
        } = fetchOptions || {};
        const finalURL = createFinalURL(url, {
          baseUrl,
          params,
          querySerializer
        });
        const finalHeaders = mergeHeaders(
          DEFAULT_HEADERS,
          clientOptions?.headers,
          headers,
          params.header
        );
        const requestInit = {
          redirect: "follow",
          ...options,
          ...init,
          headers: finalHeaders
        };
        if (requestBody) {
          requestInit.body = bodySerializer(requestBody);
        }
        if (requestInit.body instanceof FormData) {
          finalHeaders.delete("Content-Type");
        }
        const response = await fetch2(finalURL, requestInit);
        if (response.status === 204 || response.headers.get("Content-Length") === "0") {
          return response.ok ? { data: {}, response } : { error: {}, response };
        }
        if (response.ok) {
          let data;
          if (parseAs !== "stream") {
            const cloned = response.clone();
            data = typeof cloned[parseAs] === "function" ? await cloned[parseAs]() : await cloned.text();
          } else {
            data = response.clone().body;
          }
          return { data, response };
        }
        let error = {};
        try {
          error = await response.clone().json();
        } catch {
          error = await response.clone().text();
        }
        return { error, response };
      }
      return {
        /** Call a GET endpoint */
        async GET(url, ...init) {
          return coreFetch(url, { ...init[0], method: "GET" });
        },
        /** Call a PUT endpoint */
        async PUT(url, ...init) {
          return coreFetch(url, { ...init[0], method: "PUT" });
        },
        /** Call a POST endpoint */
        async POST(url, ...init) {
          return coreFetch(url, { ...init[0], method: "POST" });
        },
        /** Call a DELETE endpoint */
        async DELETE(url, ...init) {
          return coreFetch(url, {
            ...init[0],
            method: "DELETE"
          });
        },
        /** Call a OPTIONS endpoint */
        async OPTIONS(url, ...init) {
          return coreFetch(url, {
            ...init[0],
            method: "OPTIONS"
          });
        },
        /** Call a HEAD endpoint */
        async HEAD(url, ...init) {
          return coreFetch(url, { ...init[0], method: "HEAD" });
        },
        /** Call a PATCH endpoint */
        async PATCH(url, ...init) {
          return coreFetch(url, { ...init[0], method: "PATCH" });
        },
        /** Call a TRACE endpoint */
        async TRACE(url, ...init) {
          return coreFetch(url, { ...init[0], method: "TRACE" });
        }
      };
    }
    function defaultQuerySerializer(q) {
      const search = new URLSearchParams();
      if (q && typeof q === "object") {
        for (const [k, v] of Object.entries(q)) {
          if (v === void 0 || v === null) {
            continue;
          }
          search.set(k, v);
        }
      }
      return search.toString();
    }
    function defaultBodySerializer(body) {
      return JSON.stringify(body);
    }
    function createFinalURL(pathname, options) {
      let finalURL = `${options.baseUrl}${pathname}`;
      if (options.params.path) {
        for (const [k, v] of Object.entries(options.params.path)) {
          finalURL = finalURL.replace(`{${k}}`, encodeURIComponent(String(v)));
        }
      }
      const search = options.querySerializer(options.params.query ?? {});
      if (search) {
        finalURL += `?${search}`;
      }
      return finalURL;
    }
    function mergeHeaders(...allHeaders) {
      const headers = new Headers();
      for (const headerSet of allHeaders) {
        if (!headerSet || typeof headerSet !== "object") {
          continue;
        }
        const iterator = headerSet instanceof Headers ? (
          // @ts-expect-error Headers definitely have entries()
          headerSet.entries()
        ) : Object.entries(headerSet);
        for (const [k, v] of iterator) {
          if (v === null) {
            headers.delete(k);
          } else if (v !== void 0) {
            headers.set(k, v);
          }
        }
      }
      return headers;
    }
  }
});

// node_modules/@deroll/app/dist/index.js
var require_dist = __commonJS({
  "node_modules/@deroll/app/dist/index.js"(exports, module2) {
    "use strict";
    var __create2 = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __getProtoOf2 = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps2 = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toESM2 = (mod, isNodeMode, target) => (target = mod != null ? __create2(__getProtoOf2(mod)) : {}, __copyProps2(
      // If the importer is in node compatibility mode or this is not an ESM
      // file that has been converted to a CommonJS file using a Babel-
      // compatible transform (i.e. "__esModule" has not been set), then set
      // "default" to the CommonJS "module.exports" for node compatibility.
      isNodeMode || !mod || !mod.__esModule ? __defProp2(target, "default", { value: mod, enumerable: true }) : target,
      mod
    ));
    var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
    var src_exports = {};
    __export(src_exports, {
      createApp: () => createApp2
    });
    module2.exports = __toCommonJS(src_exports);
    var import_openapi_fetch = __toESM2(require_cjs());
    var AppImpl = class {
      options;
      advanceHandlers;
      inspectHandlers;
      POST;
      constructor(options) {
        this.options = options;
        this.advanceHandlers = [];
        this.inspectHandlers = [];
        const { POST } = (0, import_openapi_fetch.default)({ baseUrl: options.url });
        this.POST = POST;
      }
      async createNotice(notice) {
        const { data, response } = await this.POST("/notice", {
          body: notice
        });
        if (data) {
          return data.index;
        } else {
          throw new Error(response.statusText);
        }
      }
      async createReport(report) {
        const { response } = await this.POST("/report", {
          body: report
        });
        if (!response.ok) {
          throw new Error(response.statusText);
        }
      }
      async createVoucher(voucher) {
        const { data, response } = await this.POST("/voucher", {
          body: voucher
        });
        if (data) {
          return data.index;
        } else {
          throw new Error(response.statusText);
        }
      }
      handleAdvance = async (data) => {
        let finalResult = "reject";
        for (const handler of this.advanceHandlers) {
          try {
            const result = await handler(data);
            if (result == "accept") {
              if (!this.options.broadcastAdvanceRequests) {
                return result;
              }
              finalResult = result;
            }
          } catch (e) {
            console.error(e);
          }
        }
        return finalResult;
      };
      handleInspect = async (data) => {
        for (const handler of this.inspectHandlers) {
          try {
            await handler(data);
          } catch (e) {
            console.error(e);
          }
        }
      };
      addAdvanceHandler(handler) {
        this.advanceHandlers.push(handler);
      }
      addInspectHandler(handler) {
        this.inspectHandlers.push(handler);
      }
      async start() {
        let status = "accept";
        while (true) {
          const { response } = await this.POST("/finish", {
            body: { status },
            parseAs: "text"
          });
          if (response.status == 200) {
            const data = await response.json();
            switch (data.request_type) {
              case "advance_state":
                status = await this.handleAdvance(
                  data.data
                );
                break;
              case "inspect_state":
                await this.handleInspect(
                  data.data
                );
                break;
            }
          } else if (response.status == 202) {
          }
        }
      }
    };
    var createApp2 = (options) => {
      return new AppImpl(options);
    };
  }
});

// node_modules/path-to-regexp/dist/index.js
var require_dist2 = __commonJS({
  "node_modules/path-to-regexp/dist/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.pathToRegexp = exports.tokensToRegexp = exports.regexpToFunction = exports.match = exports.tokensToFunction = exports.compile = exports.parse = void 0;
    function lexer(str) {
      var tokens = [];
      var i = 0;
      while (i < str.length) {
        var char = str[i];
        if (char === "*" || char === "+" || char === "?") {
          tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
          continue;
        }
        if (char === "\\") {
          tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
          continue;
        }
        if (char === "{") {
          tokens.push({ type: "OPEN", index: i, value: str[i++] });
          continue;
        }
        if (char === "}") {
          tokens.push({ type: "CLOSE", index: i, value: str[i++] });
          continue;
        }
        if (char === ":") {
          var name = "";
          var j = i + 1;
          while (j < str.length) {
            var code = str.charCodeAt(j);
            if (
              // `0-9`
              code >= 48 && code <= 57 || // `A-Z`
              code >= 65 && code <= 90 || // `a-z`
              code >= 97 && code <= 122 || // `_`
              code === 95
            ) {
              name += str[j++];
              continue;
            }
            break;
          }
          if (!name)
            throw new TypeError("Missing parameter name at ".concat(i));
          tokens.push({ type: "NAME", index: i, value: name });
          i = j;
          continue;
        }
        if (char === "(") {
          var count = 1;
          var pattern = "";
          var j = i + 1;
          if (str[j] === "?") {
            throw new TypeError('Pattern cannot start with "?" at '.concat(j));
          }
          while (j < str.length) {
            if (str[j] === "\\") {
              pattern += str[j++] + str[j++];
              continue;
            }
            if (str[j] === ")") {
              count--;
              if (count === 0) {
                j++;
                break;
              }
            } else if (str[j] === "(") {
              count++;
              if (str[j + 1] !== "?") {
                throw new TypeError("Capturing groups are not allowed at ".concat(j));
              }
            }
            pattern += str[j++];
          }
          if (count)
            throw new TypeError("Unbalanced pattern at ".concat(i));
          if (!pattern)
            throw new TypeError("Missing pattern at ".concat(i));
          tokens.push({ type: "PATTERN", index: i, value: pattern });
          i = j;
          continue;
        }
        tokens.push({ type: "CHAR", index: i, value: str[i++] });
      }
      tokens.push({ type: "END", index: i, value: "" });
      return tokens;
    }
    function parse(str, options) {
      if (options === void 0) {
        options = {};
      }
      var tokens = lexer(str);
      var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a;
      var defaultPattern = "[^".concat(escapeString(options.delimiter || "/#?"), "]+?");
      var result = [];
      var key = 0;
      var i = 0;
      var path = "";
      var tryConsume = function(type) {
        if (i < tokens.length && tokens[i].type === type)
          return tokens[i++].value;
      };
      var mustConsume = function(type) {
        var value2 = tryConsume(type);
        if (value2 !== void 0)
          return value2;
        var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
        throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
      };
      var consumeText = function() {
        var result2 = "";
        var value2;
        while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
          result2 += value2;
        }
        return result2;
      };
      while (i < tokens.length) {
        var char = tryConsume("CHAR");
        var name = tryConsume("NAME");
        var pattern = tryConsume("PATTERN");
        if (name || pattern) {
          var prefix = char || "";
          if (prefixes.indexOf(prefix) === -1) {
            path += prefix;
            prefix = "";
          }
          if (path) {
            result.push(path);
            path = "";
          }
          result.push({
            name: name || key++,
            prefix,
            suffix: "",
            pattern: pattern || defaultPattern,
            modifier: tryConsume("MODIFIER") || ""
          });
          continue;
        }
        var value = char || tryConsume("ESCAPED_CHAR");
        if (value) {
          path += value;
          continue;
        }
        if (path) {
          result.push(path);
          path = "";
        }
        var open = tryConsume("OPEN");
        if (open) {
          var prefix = consumeText();
          var name_1 = tryConsume("NAME") || "";
          var pattern_1 = tryConsume("PATTERN") || "";
          var suffix = consumeText();
          mustConsume("CLOSE");
          result.push({
            name: name_1 || (pattern_1 ? key++ : ""),
            pattern: name_1 && !pattern_1 ? defaultPattern : pattern_1,
            prefix,
            suffix,
            modifier: tryConsume("MODIFIER") || ""
          });
          continue;
        }
        mustConsume("END");
      }
      return result;
    }
    exports.parse = parse;
    function compile(str, options) {
      return tokensToFunction(parse(str, options), options);
    }
    exports.compile = compile;
    function tokensToFunction(tokens, options) {
      if (options === void 0) {
        options = {};
      }
      var reFlags = flags(options);
      var _a = options.encode, encode = _a === void 0 ? function(x) {
        return x;
      } : _a, _b = options.validate, validate = _b === void 0 ? true : _b;
      var matches = tokens.map(function(token) {
        if (typeof token === "object") {
          return new RegExp("^(?:".concat(token.pattern, ")$"), reFlags);
        }
      });
      return function(data) {
        var path = "";
        for (var i = 0; i < tokens.length; i++) {
          var token = tokens[i];
          if (typeof token === "string") {
            path += token;
            continue;
          }
          var value = data ? data[token.name] : void 0;
          var optional = token.modifier === "?" || token.modifier === "*";
          var repeat = token.modifier === "*" || token.modifier === "+";
          if (Array.isArray(value)) {
            if (!repeat) {
              throw new TypeError('Expected "'.concat(token.name, '" to not repeat, but got an array'));
            }
            if (value.length === 0) {
              if (optional)
                continue;
              throw new TypeError('Expected "'.concat(token.name, '" to not be empty'));
            }
            for (var j = 0; j < value.length; j++) {
              var segment = encode(value[j], token);
              if (validate && !matches[i].test(segment)) {
                throw new TypeError('Expected all "'.concat(token.name, '" to match "').concat(token.pattern, '", but got "').concat(segment, '"'));
              }
              path += token.prefix + segment + token.suffix;
            }
            continue;
          }
          if (typeof value === "string" || typeof value === "number") {
            var segment = encode(String(value), token);
            if (validate && !matches[i].test(segment)) {
              throw new TypeError('Expected "'.concat(token.name, '" to match "').concat(token.pattern, '", but got "').concat(segment, '"'));
            }
            path += token.prefix + segment + token.suffix;
            continue;
          }
          if (optional)
            continue;
          var typeOfMessage = repeat ? "an array" : "a string";
          throw new TypeError('Expected "'.concat(token.name, '" to be ').concat(typeOfMessage));
        }
        return path;
      };
    }
    exports.tokensToFunction = tokensToFunction;
    function match(str, options) {
      var keys = [];
      var re = pathToRegexp(str, keys, options);
      return regexpToFunction(re, keys, options);
    }
    exports.match = match;
    function regexpToFunction(re, keys, options) {
      if (options === void 0) {
        options = {};
      }
      var _a = options.decode, decode = _a === void 0 ? function(x) {
        return x;
      } : _a;
      return function(pathname) {
        var m = re.exec(pathname);
        if (!m)
          return false;
        var path = m[0], index = m.index;
        var params = /* @__PURE__ */ Object.create(null);
        var _loop_1 = function(i2) {
          if (m[i2] === void 0)
            return "continue";
          var key = keys[i2 - 1];
          if (key.modifier === "*" || key.modifier === "+") {
            params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
              return decode(value, key);
            });
          } else {
            params[key.name] = decode(m[i2], key);
          }
        };
        for (var i = 1; i < m.length; i++) {
          _loop_1(i);
        }
        return { path, index, params };
      };
    }
    exports.regexpToFunction = regexpToFunction;
    function escapeString(str) {
      return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
    }
    function flags(options) {
      return options && options.sensitive ? "" : "i";
    }
    function regexpToRegexp(path, keys) {
      if (!keys)
        return path;
      var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
      var index = 0;
      var execResult = groupsRegex.exec(path.source);
      while (execResult) {
        keys.push({
          // Use parenthesized substring match if available, index otherwise
          name: execResult[1] || index++,
          prefix: "",
          suffix: "",
          modifier: "",
          pattern: ""
        });
        execResult = groupsRegex.exec(path.source);
      }
      return path;
    }
    function arrayToRegexp(paths, keys, options) {
      var parts = paths.map(function(path) {
        return pathToRegexp(path, keys, options).source;
      });
      return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
    }
    function stringToRegexp(path, keys, options) {
      return tokensToRegexp(parse(path, options), keys, options);
    }
    function tokensToRegexp(tokens, keys, options) {
      if (options === void 0) {
        options = {};
      }
      var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
        return x;
      } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
      var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
      var delimiterRe = "[".concat(escapeString(delimiter), "]");
      var route = start ? "^" : "";
      for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
        var token = tokens_1[_i];
        if (typeof token === "string") {
          route += escapeString(encode(token));
        } else {
          var prefix = escapeString(encode(token.prefix));
          var suffix = escapeString(encode(token.suffix));
          if (token.pattern) {
            if (keys)
              keys.push(token);
            if (prefix || suffix) {
              if (token.modifier === "+" || token.modifier === "*") {
                var mod = token.modifier === "*" ? "?" : "";
                route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
              } else {
                route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
              }
            } else {
              if (token.modifier === "+" || token.modifier === "*") {
                route += "((?:".concat(token.pattern, ")").concat(token.modifier, ")");
              } else {
                route += "(".concat(token.pattern, ")").concat(token.modifier);
              }
            }
          } else {
            route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
          }
        }
      }
      if (end) {
        if (!strict)
          route += "".concat(delimiterRe, "?");
        route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
      } else {
        var endToken = tokens[tokens.length - 1];
        var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
        if (!strict) {
          route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
        }
        if (!isEndDelimited) {
          route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
        }
      }
      return new RegExp(route, flags(options));
    }
    exports.tokensToRegexp = tokensToRegexp;
    function pathToRegexp(path, keys, options) {
      if (path instanceof RegExp)
        return regexpToRegexp(path, keys);
      if (Array.isArray(path))
        return arrayToRegexp(path, keys, options);
      return stringToRegexp(path, keys, options);
    }
    exports.pathToRegexp = pathToRegexp;
  }
});

// node_modules/abitype/dist/cjs/version.js
var require_version = __commonJS({
  "node_modules/abitype/dist/cjs/version.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.version = void 0;
    exports.version = "0.9.8";
  }
});

// node_modules/abitype/dist/cjs/errors.js
var require_errors = __commonJS({
  "node_modules/abitype/dist/cjs/errors.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BaseError = void 0;
    var version_js_1 = require_version();
    var BaseError3 = class _BaseError extends Error {
      constructor(shortMessage, args = {}) {
        const details = args.cause instanceof _BaseError ? args.cause.details : args.cause?.message ? args.cause.message : args.details;
        const docsPath = args.cause instanceof _BaseError ? args.cause.docsPath || args.docsPath : args.docsPath;
        const message = [
          shortMessage || "An error occurred.",
          "",
          ...args.metaMessages ? [...args.metaMessages, ""] : [],
          ...docsPath ? [`Docs: https://abitype.dev${docsPath}`] : [],
          ...details ? [`Details: ${details}`] : [],
          `Version: abitype@${version_js_1.version}`
        ].join("\n");
        super(message);
        Object.defineProperty(this, "details", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "docsPath", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "metaMessages", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "shortMessage", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "AbiTypeError"
        });
        if (args.cause)
          this.cause = args.cause;
        this.details = details;
        this.docsPath = docsPath;
        this.metaMessages = args.metaMessages;
        this.shortMessage = shortMessage;
      }
    };
    exports.BaseError = BaseError3;
  }
});

// node_modules/abitype/dist/cjs/narrow.js
var require_narrow = __commonJS({
  "node_modules/abitype/dist/cjs/narrow.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.narrow = void 0;
    function narrow(value) {
      return value;
    }
    exports.narrow = narrow;
  }
});

// node_modules/abitype/dist/cjs/regex.js
var require_regex = __commonJS({
  "node_modules/abitype/dist/cjs/regex.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isTupleRegex = exports.integerRegex = exports.bytesRegex = exports.execTyped = void 0;
    function execTyped2(regex, string) {
      const match = regex.exec(string);
      return match?.groups;
    }
    exports.execTyped = execTyped2;
    exports.bytesRegex = /^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/;
    exports.integerRegex = /^u?int(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/;
    exports.isTupleRegex = /^\(.+?\).*?$/;
  }
});

// node_modules/abitype/dist/cjs/human-readable/formatAbiParameter.js
var require_formatAbiParameter = __commonJS({
  "node_modules/abitype/dist/cjs/human-readable/formatAbiParameter.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.formatAbiParameter = void 0;
    var regex_js_1 = require_regex();
    var tupleRegex = /^tuple(?<array>(\[(\d*)\])*)$/;
    function formatAbiParameter(abiParameter) {
      let type = abiParameter.type;
      if (tupleRegex.test(abiParameter.type) && "components" in abiParameter) {
        type = "(";
        const length = abiParameter.components.length;
        for (let i = 0; i < length; i++) {
          const component = abiParameter.components[i];
          type += formatAbiParameter(component);
          if (i < length - 1)
            type += ", ";
        }
        const result = (0, regex_js_1.execTyped)(tupleRegex, abiParameter.type);
        type += `)${result?.array ?? ""}`;
        return formatAbiParameter({
          ...abiParameter,
          type
        });
      }
      if ("indexed" in abiParameter && abiParameter.indexed)
        type = `${type} indexed`;
      if (abiParameter.name)
        return `${type} ${abiParameter.name}`;
      return type;
    }
    exports.formatAbiParameter = formatAbiParameter;
  }
});

// node_modules/abitype/dist/cjs/human-readable/formatAbiParameters.js
var require_formatAbiParameters = __commonJS({
  "node_modules/abitype/dist/cjs/human-readable/formatAbiParameters.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.formatAbiParameters = void 0;
    var formatAbiParameter_js_1 = require_formatAbiParameter();
    function formatAbiParameters(abiParameters) {
      let params = "";
      const length = abiParameters.length;
      for (let i = 0; i < length; i++) {
        const abiParameter = abiParameters[i];
        params += (0, formatAbiParameter_js_1.formatAbiParameter)(abiParameter);
        if (i !== length - 1)
          params += ", ";
      }
      return params;
    }
    exports.formatAbiParameters = formatAbiParameters;
  }
});

// node_modules/abitype/dist/cjs/human-readable/formatAbiItem.js
var require_formatAbiItem = __commonJS({
  "node_modules/abitype/dist/cjs/human-readable/formatAbiItem.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.formatAbiItem = void 0;
    var formatAbiParameters_js_1 = require_formatAbiParameters();
    function formatAbiItem2(abiItem) {
      if (abiItem.type === "function")
        return `function ${abiItem.name}(${(0, formatAbiParameters_js_1.formatAbiParameters)(abiItem.inputs)})${abiItem.stateMutability && abiItem.stateMutability !== "nonpayable" ? ` ${abiItem.stateMutability}` : ""}${abiItem.outputs.length ? ` returns (${(0, formatAbiParameters_js_1.formatAbiParameters)(abiItem.outputs)})` : ""}`;
      else if (abiItem.type === "event")
        return `event ${abiItem.name}(${(0, formatAbiParameters_js_1.formatAbiParameters)(abiItem.inputs)})`;
      else if (abiItem.type === "error")
        return `error ${abiItem.name}(${(0, formatAbiParameters_js_1.formatAbiParameters)(abiItem.inputs)})`;
      else if (abiItem.type === "constructor")
        return `constructor(${(0, formatAbiParameters_js_1.formatAbiParameters)(abiItem.inputs)})${abiItem.stateMutability === "payable" ? " payable" : ""}`;
      else if (abiItem.type === "fallback")
        return "fallback()";
      return "receive() external payable";
    }
    exports.formatAbiItem = formatAbiItem2;
  }
});

// node_modules/abitype/dist/cjs/human-readable/formatAbi.js
var require_formatAbi = __commonJS({
  "node_modules/abitype/dist/cjs/human-readable/formatAbi.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.formatAbi = void 0;
    var formatAbiItem_js_1 = require_formatAbiItem();
    function formatAbi(abi2) {
      const signatures = [];
      const length = abi2.length;
      for (let i = 0; i < length; i++) {
        const abiItem = abi2[i];
        const signature = (0, formatAbiItem_js_1.formatAbiItem)(abiItem);
        signatures.push(signature);
      }
      return signatures;
    }
    exports.formatAbi = formatAbi;
  }
});

// node_modules/abitype/dist/cjs/human-readable/runtime/signatures.js
var require_signatures = __commonJS({
  "node_modules/abitype/dist/cjs/human-readable/runtime/signatures.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.functionModifiers = exports.eventModifiers = exports.modifiers = exports.isReceiveSignature = exports.isFallbackSignature = exports.execConstructorSignature = exports.isConstructorSignature = exports.execStructSignature = exports.isStructSignature = exports.execFunctionSignature = exports.isFunctionSignature = exports.execEventSignature = exports.isEventSignature = exports.execErrorSignature = exports.isErrorSignature = void 0;
    var regex_js_1 = require_regex();
    var errorSignatureRegex2 = /^error (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*)\((?<parameters>.*?)\)$/;
    function isErrorSignature2(signature) {
      return errorSignatureRegex2.test(signature);
    }
    exports.isErrorSignature = isErrorSignature2;
    function execErrorSignature2(signature) {
      return (0, regex_js_1.execTyped)(errorSignatureRegex2, signature);
    }
    exports.execErrorSignature = execErrorSignature2;
    var eventSignatureRegex2 = /^event (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*)\((?<parameters>.*?)\)$/;
    function isEventSignature2(signature) {
      return eventSignatureRegex2.test(signature);
    }
    exports.isEventSignature = isEventSignature2;
    function execEventSignature2(signature) {
      return (0, regex_js_1.execTyped)(eventSignatureRegex2, signature);
    }
    exports.execEventSignature = execEventSignature2;
    var functionSignatureRegex2 = /^function (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*)\((?<parameters>.*?)\)(?: (?<scope>external|public{1}))?(?: (?<stateMutability>pure|view|nonpayable|payable{1}))?(?: returns\s?\((?<returns>.*?)\))?$/;
    function isFunctionSignature2(signature) {
      return functionSignatureRegex2.test(signature);
    }
    exports.isFunctionSignature = isFunctionSignature2;
    function execFunctionSignature2(signature) {
      return (0, regex_js_1.execTyped)(functionSignatureRegex2, signature);
    }
    exports.execFunctionSignature = execFunctionSignature2;
    var structSignatureRegex2 = /^struct (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*) \{(?<properties>.*?)\}$/;
    function isStructSignature2(signature) {
      return structSignatureRegex2.test(signature);
    }
    exports.isStructSignature = isStructSignature2;
    function execStructSignature2(signature) {
      return (0, regex_js_1.execTyped)(structSignatureRegex2, signature);
    }
    exports.execStructSignature = execStructSignature2;
    var constructorSignatureRegex2 = /^constructor\((?<parameters>.*?)\)(?:\s(?<stateMutability>payable{1}))?$/;
    function isConstructorSignature2(signature) {
      return constructorSignatureRegex2.test(signature);
    }
    exports.isConstructorSignature = isConstructorSignature2;
    function execConstructorSignature2(signature) {
      return (0, regex_js_1.execTyped)(constructorSignatureRegex2, signature);
    }
    exports.execConstructorSignature = execConstructorSignature2;
    var fallbackSignatureRegex2 = /^fallback\(\)$/;
    function isFallbackSignature2(signature) {
      return fallbackSignatureRegex2.test(signature);
    }
    exports.isFallbackSignature = isFallbackSignature2;
    var receiveSignatureRegex2 = /^receive\(\) external payable$/;
    function isReceiveSignature2(signature) {
      return receiveSignatureRegex2.test(signature);
    }
    exports.isReceiveSignature = isReceiveSignature2;
    exports.modifiers = /* @__PURE__ */ new Set([
      "memory",
      "indexed",
      "storage",
      "calldata"
    ]);
    exports.eventModifiers = /* @__PURE__ */ new Set(["indexed"]);
    exports.functionModifiers = /* @__PURE__ */ new Set([
      "calldata",
      "memory",
      "storage"
    ]);
  }
});

// node_modules/abitype/dist/cjs/human-readable/errors/abiItem.js
var require_abiItem = __commonJS({
  "node_modules/abitype/dist/cjs/human-readable/errors/abiItem.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UnknownSolidityTypeError = exports.UnknownTypeError = exports.InvalidAbiItemError = void 0;
    var errors_js_1 = require_errors();
    var InvalidAbiItemError2 = class extends errors_js_1.BaseError {
      constructor({ signature }) {
        super("Failed to parse ABI item.", {
          details: `parseAbiItem(${JSON.stringify(signature, null, 2)})`,
          docsPath: "/api/human.html#parseabiitem-1"
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidAbiItemError"
        });
      }
    };
    exports.InvalidAbiItemError = InvalidAbiItemError2;
    var UnknownTypeError2 = class extends errors_js_1.BaseError {
      constructor({ type }) {
        super("Unknown type.", {
          metaMessages: [
            `Type "${type}" is not a valid ABI type. Perhaps you forgot to include a struct signature?`
          ]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "UnknownTypeError"
        });
      }
    };
    exports.UnknownTypeError = UnknownTypeError2;
    var UnknownSolidityTypeError2 = class extends errors_js_1.BaseError {
      constructor({ type }) {
        super("Unknown type.", {
          metaMessages: [`Type "${type}" is not a valid ABI type.`]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "UnknownSolidityTypeError"
        });
      }
    };
    exports.UnknownSolidityTypeError = UnknownSolidityTypeError2;
  }
});

// node_modules/abitype/dist/cjs/human-readable/errors/abiParameter.js
var require_abiParameter = __commonJS({
  "node_modules/abitype/dist/cjs/human-readable/errors/abiParameter.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InvalidAbiTypeParameterError = exports.InvalidFunctionModifierError = exports.InvalidModifierError = exports.SolidityProtectedKeywordError = exports.InvalidParameterError = exports.InvalidAbiParametersError = exports.InvalidAbiParameterError = void 0;
    var errors_js_1 = require_errors();
    var InvalidAbiParameterError2 = class extends errors_js_1.BaseError {
      constructor({ param }) {
        super("Failed to parse ABI parameter.", {
          details: `parseAbiParameter(${JSON.stringify(param, null, 2)})`,
          docsPath: "/api/human.html#parseabiparameter-1"
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidAbiParameterError"
        });
      }
    };
    exports.InvalidAbiParameterError = InvalidAbiParameterError2;
    var InvalidAbiParametersError2 = class extends errors_js_1.BaseError {
      constructor({ params }) {
        super("Failed to parse ABI parameters.", {
          details: `parseAbiParameters(${JSON.stringify(params, null, 2)})`,
          docsPath: "/api/human.html#parseabiparameters-1"
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidAbiParametersError"
        });
      }
    };
    exports.InvalidAbiParametersError = InvalidAbiParametersError2;
    var InvalidParameterError2 = class extends errors_js_1.BaseError {
      constructor({ param }) {
        super("Invalid ABI parameter.", {
          details: param
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidParameterError"
        });
      }
    };
    exports.InvalidParameterError = InvalidParameterError2;
    var SolidityProtectedKeywordError2 = class extends errors_js_1.BaseError {
      constructor({ param, name }) {
        super("Invalid ABI parameter.", {
          details: param,
          metaMessages: [
            `"${name}" is a protected Solidity keyword. More info: https://docs.soliditylang.org/en/latest/cheatsheet.html`
          ]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "SolidityProtectedKeywordError"
        });
      }
    };
    exports.SolidityProtectedKeywordError = SolidityProtectedKeywordError2;
    var InvalidModifierError2 = class extends errors_js_1.BaseError {
      constructor({ param, type, modifier }) {
        super("Invalid ABI parameter.", {
          details: param,
          metaMessages: [
            `Modifier "${modifier}" not allowed${type ? ` in "${type}" type` : ""}.`
          ]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidModifierError"
        });
      }
    };
    exports.InvalidModifierError = InvalidModifierError2;
    var InvalidFunctionModifierError2 = class extends errors_js_1.BaseError {
      constructor({ param, type, modifier }) {
        super("Invalid ABI parameter.", {
          details: param,
          metaMessages: [
            `Modifier "${modifier}" not allowed${type ? ` in "${type}" type` : ""}.`,
            `Data location can only be specified for array, struct, or mapping types, but "${modifier}" was given.`
          ]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidFunctionModifierError"
        });
      }
    };
    exports.InvalidFunctionModifierError = InvalidFunctionModifierError2;
    var InvalidAbiTypeParameterError2 = class extends errors_js_1.BaseError {
      constructor({ abiParameter }) {
        super("Invalid ABI parameter.", {
          details: JSON.stringify(abiParameter, null, 2),
          metaMessages: ["ABI parameter type is invalid."]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidAbiTypeParameterError"
        });
      }
    };
    exports.InvalidAbiTypeParameterError = InvalidAbiTypeParameterError2;
  }
});

// node_modules/abitype/dist/cjs/human-readable/errors/signature.js
var require_signature = __commonJS({
  "node_modules/abitype/dist/cjs/human-readable/errors/signature.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InvalidStructSignatureError = exports.UnknownSignatureError = exports.InvalidSignatureError = void 0;
    var errors_js_1 = require_errors();
    var InvalidSignatureError2 = class extends errors_js_1.BaseError {
      constructor({ signature, type }) {
        super(`Invalid ${type} signature.`, {
          details: signature
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidSignatureError"
        });
      }
    };
    exports.InvalidSignatureError = InvalidSignatureError2;
    var UnknownSignatureError2 = class extends errors_js_1.BaseError {
      constructor({ signature }) {
        super("Unknown signature.", {
          details: signature
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "UnknownSignatureError"
        });
      }
    };
    exports.UnknownSignatureError = UnknownSignatureError2;
    var InvalidStructSignatureError2 = class extends errors_js_1.BaseError {
      constructor({ signature }) {
        super("Invalid struct signature.", {
          details: signature,
          metaMessages: ["No properties exist."]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidStructSignatureError"
        });
      }
    };
    exports.InvalidStructSignatureError = InvalidStructSignatureError2;
  }
});

// node_modules/abitype/dist/cjs/human-readable/errors/struct.js
var require_struct = __commonJS({
  "node_modules/abitype/dist/cjs/human-readable/errors/struct.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CircularReferenceError = void 0;
    var errors_js_1 = require_errors();
    var CircularReferenceError2 = class extends errors_js_1.BaseError {
      constructor({ type }) {
        super("Circular reference detected.", {
          metaMessages: [`Struct "${type}" is a circular reference.`]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "CircularReferenceError"
        });
      }
    };
    exports.CircularReferenceError = CircularReferenceError2;
  }
});

// node_modules/abitype/dist/cjs/human-readable/errors/splitParameters.js
var require_splitParameters = __commonJS({
  "node_modules/abitype/dist/cjs/human-readable/errors/splitParameters.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InvalidParenthesisError = void 0;
    var errors_js_1 = require_errors();
    var InvalidParenthesisError2 = class extends errors_js_1.BaseError {
      constructor({ current, depth }) {
        super("Unbalanced parentheses.", {
          metaMessages: [
            `"${current.trim()}" has too many ${depth > 0 ? "opening" : "closing"} parentheses.`
          ],
          details: `Depth "${depth}"`
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidParenthesisError"
        });
      }
    };
    exports.InvalidParenthesisError = InvalidParenthesisError2;
  }
});

// node_modules/abitype/dist/cjs/human-readable/runtime/cache.js
var require_cache = __commonJS({
  "node_modules/abitype/dist/cjs/human-readable/runtime/cache.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parameterCache = exports.getParameterCacheKey = void 0;
    function getParameterCacheKey2(param, type) {
      if (type)
        return `${type}:${param}`;
      return param;
    }
    exports.getParameterCacheKey = getParameterCacheKey2;
    exports.parameterCache = /* @__PURE__ */ new Map([
      ["address", { type: "address" }],
      ["bool", { type: "bool" }],
      ["bytes", { type: "bytes" }],
      ["bytes32", { type: "bytes32" }],
      ["int", { type: "int256" }],
      ["int256", { type: "int256" }],
      ["string", { type: "string" }],
      ["uint", { type: "uint256" }],
      ["uint8", { type: "uint8" }],
      ["uint16", { type: "uint16" }],
      ["uint24", { type: "uint24" }],
      ["uint32", { type: "uint32" }],
      ["uint64", { type: "uint64" }],
      ["uint96", { type: "uint96" }],
      ["uint112", { type: "uint112" }],
      ["uint160", { type: "uint160" }],
      ["uint192", { type: "uint192" }],
      ["uint256", { type: "uint256" }],
      ["address owner", { type: "address", name: "owner" }],
      ["address to", { type: "address", name: "to" }],
      ["bool approved", { type: "bool", name: "approved" }],
      ["bytes _data", { type: "bytes", name: "_data" }],
      ["bytes data", { type: "bytes", name: "data" }],
      ["bytes signature", { type: "bytes", name: "signature" }],
      ["bytes32 hash", { type: "bytes32", name: "hash" }],
      ["bytes32 r", { type: "bytes32", name: "r" }],
      ["bytes32 root", { type: "bytes32", name: "root" }],
      ["bytes32 s", { type: "bytes32", name: "s" }],
      ["string name", { type: "string", name: "name" }],
      ["string symbol", { type: "string", name: "symbol" }],
      ["string tokenURI", { type: "string", name: "tokenURI" }],
      ["uint tokenId", { type: "uint256", name: "tokenId" }],
      ["uint8 v", { type: "uint8", name: "v" }],
      ["uint256 balance", { type: "uint256", name: "balance" }],
      ["uint256 tokenId", { type: "uint256", name: "tokenId" }],
      ["uint256 value", { type: "uint256", name: "value" }],
      [
        "event:address indexed from",
        { type: "address", name: "from", indexed: true }
      ],
      ["event:address indexed to", { type: "address", name: "to", indexed: true }],
      [
        "event:uint indexed tokenId",
        { type: "uint256", name: "tokenId", indexed: true }
      ],
      [
        "event:uint256 indexed tokenId",
        { type: "uint256", name: "tokenId", indexed: true }
      ]
    ]);
  }
});

// node_modules/abitype/dist/cjs/human-readable/runtime/utils.js
var require_utils = __commonJS({
  "node_modules/abitype/dist/cjs/human-readable/runtime/utils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isValidDataLocation = exports.isSolidityKeyword = exports.isSolidityType = exports.splitParameters = exports.parseAbiParameter = exports.parseSignature = void 0;
    var regex_js_1 = require_regex();
    var abiItem_js_1 = require_abiItem();
    var abiParameter_js_1 = require_abiParameter();
    var signature_js_1 = require_signature();
    var splitParameters_js_1 = require_splitParameters();
    var cache_js_1 = require_cache();
    var signatures_js_1 = require_signatures();
    function parseSignature2(signature, structs = {}) {
      if ((0, signatures_js_1.isFunctionSignature)(signature)) {
        const match = (0, signatures_js_1.execFunctionSignature)(signature);
        if (!match)
          throw new signature_js_1.InvalidSignatureError({ signature, type: "function" });
        const inputParams = splitParameters2(match.parameters);
        const inputs = [];
        const inputLength = inputParams.length;
        for (let i = 0; i < inputLength; i++) {
          inputs.push(parseAbiParameter3(inputParams[i], {
            modifiers: signatures_js_1.functionModifiers,
            structs,
            type: "function"
          }));
        }
        const outputs = [];
        if (match.returns) {
          const outputParams = splitParameters2(match.returns);
          const outputLength = outputParams.length;
          for (let i = 0; i < outputLength; i++) {
            outputs.push(parseAbiParameter3(outputParams[i], {
              modifiers: signatures_js_1.functionModifiers,
              structs,
              type: "function"
            }));
          }
        }
        return {
          name: match.name,
          type: "function",
          stateMutability: match.stateMutability ?? "nonpayable",
          inputs,
          outputs
        };
      }
      if ((0, signatures_js_1.isEventSignature)(signature)) {
        const match = (0, signatures_js_1.execEventSignature)(signature);
        if (!match)
          throw new signature_js_1.InvalidSignatureError({ signature, type: "event" });
        const params = splitParameters2(match.parameters);
        const abiParameters = [];
        const length = params.length;
        for (let i = 0; i < length; i++) {
          abiParameters.push(parseAbiParameter3(params[i], {
            modifiers: signatures_js_1.eventModifiers,
            structs,
            type: "event"
          }));
        }
        return { name: match.name, type: "event", inputs: abiParameters };
      }
      if ((0, signatures_js_1.isErrorSignature)(signature)) {
        const match = (0, signatures_js_1.execErrorSignature)(signature);
        if (!match)
          throw new signature_js_1.InvalidSignatureError({ signature, type: "error" });
        const params = splitParameters2(match.parameters);
        const abiParameters = [];
        const length = params.length;
        for (let i = 0; i < length; i++) {
          abiParameters.push(parseAbiParameter3(params[i], { structs, type: "error" }));
        }
        return { name: match.name, type: "error", inputs: abiParameters };
      }
      if ((0, signatures_js_1.isConstructorSignature)(signature)) {
        const match = (0, signatures_js_1.execConstructorSignature)(signature);
        if (!match)
          throw new signature_js_1.InvalidSignatureError({ signature, type: "constructor" });
        const params = splitParameters2(match.parameters);
        const abiParameters = [];
        const length = params.length;
        for (let i = 0; i < length; i++) {
          abiParameters.push(parseAbiParameter3(params[i], { structs, type: "constructor" }));
        }
        return {
          type: "constructor",
          stateMutability: match.stateMutability ?? "nonpayable",
          inputs: abiParameters
        };
      }
      if ((0, signatures_js_1.isFallbackSignature)(signature))
        return { type: "fallback" };
      if ((0, signatures_js_1.isReceiveSignature)(signature))
        return {
          type: "receive",
          stateMutability: "payable"
        };
      throw new signature_js_1.UnknownSignatureError({ signature });
    }
    exports.parseSignature = parseSignature2;
    var abiParameterWithoutTupleRegex2 = /^(?<type>[a-zA-Z$_][a-zA-Z0-9$_]*)(?<array>(?:\[\d*?\])+?)?(?:\s(?<modifier>calldata|indexed|memory|storage{1}))?(?:\s(?<name>[a-zA-Z$_][a-zA-Z0-9$_]*))?$/;
    var abiParameterWithTupleRegex2 = /^\((?<type>.+?)\)(?<array>(?:\[\d*?\])+?)?(?:\s(?<modifier>calldata|indexed|memory|storage{1}))?(?:\s(?<name>[a-zA-Z$_][a-zA-Z0-9$_]*))?$/;
    var dynamicIntegerRegex2 = /^u?int$/;
    function parseAbiParameter3(param, options) {
      const parameterCacheKey = (0, cache_js_1.getParameterCacheKey)(param, options?.type);
      if (cache_js_1.parameterCache.has(parameterCacheKey))
        return cache_js_1.parameterCache.get(parameterCacheKey);
      const isTuple = regex_js_1.isTupleRegex.test(param);
      const match = (0, regex_js_1.execTyped)(isTuple ? abiParameterWithTupleRegex2 : abiParameterWithoutTupleRegex2, param);
      if (!match)
        throw new abiParameter_js_1.InvalidParameterError({ param });
      if (match.name && isSolidityKeyword2(match.name))
        throw new abiParameter_js_1.SolidityProtectedKeywordError({ param, name: match.name });
      const name = match.name ? { name: match.name } : {};
      const indexed = match.modifier === "indexed" ? { indexed: true } : {};
      const structs = options?.structs ?? {};
      let type;
      let components = {};
      if (isTuple) {
        type = "tuple";
        const params = splitParameters2(match.type);
        const components_ = [];
        const length = params.length;
        for (let i = 0; i < length; i++) {
          components_.push(parseAbiParameter3(params[i], { structs }));
        }
        components = { components: components_ };
      } else if (match.type in structs) {
        type = "tuple";
        components = { components: structs[match.type] };
      } else if (dynamicIntegerRegex2.test(match.type)) {
        type = `${match.type}256`;
      } else {
        type = match.type;
        if (!(options?.type === "struct") && !isSolidityType2(type))
          throw new abiItem_js_1.UnknownSolidityTypeError({ type });
      }
      if (match.modifier) {
        if (!options?.modifiers?.has?.(match.modifier))
          throw new abiParameter_js_1.InvalidModifierError({
            param,
            type: options?.type,
            modifier: match.modifier
          });
        if (signatures_js_1.functionModifiers.has(match.modifier) && !isValidDataLocation2(type, !!match.array))
          throw new abiParameter_js_1.InvalidFunctionModifierError({
            param,
            type: options?.type,
            modifier: match.modifier
          });
      }
      const abiParameter = {
        type: `${type}${match.array ?? ""}`,
        ...name,
        ...indexed,
        ...components
      };
      cache_js_1.parameterCache.set(parameterCacheKey, abiParameter);
      return abiParameter;
    }
    exports.parseAbiParameter = parseAbiParameter3;
    function splitParameters2(params, result = [], current = "", depth = 0) {
      if (params === "") {
        if (current === "")
          return result;
        if (depth !== 0)
          throw new splitParameters_js_1.InvalidParenthesisError({ current, depth });
        result.push(current.trim());
        return result;
      }
      const length = params.length;
      for (let i = 0; i < length; i++) {
        const char = params[i];
        const tail = params.slice(i + 1);
        switch (char) {
          case ",":
            return depth === 0 ? splitParameters2(tail, [...result, current.trim()]) : splitParameters2(tail, result, `${current}${char}`, depth);
          case "(":
            return splitParameters2(tail, result, `${current}${char}`, depth + 1);
          case ")":
            return splitParameters2(tail, result, `${current}${char}`, depth - 1);
          default:
            return splitParameters2(tail, result, `${current}${char}`, depth);
        }
      }
      return [];
    }
    exports.splitParameters = splitParameters2;
    function isSolidityType2(type) {
      return type === "address" || type === "bool" || type === "function" || type === "string" || regex_js_1.bytesRegex.test(type) || regex_js_1.integerRegex.test(type);
    }
    exports.isSolidityType = isSolidityType2;
    var protectedKeywordsRegex2 = /^(?:after|alias|anonymous|apply|auto|byte|calldata|case|catch|constant|copyof|default|defined|error|event|external|false|final|function|immutable|implements|in|indexed|inline|internal|let|mapping|match|memory|mutable|null|of|override|partial|private|promise|public|pure|reference|relocatable|return|returns|sizeof|static|storage|struct|super|supports|switch|this|true|try|typedef|typeof|var|view|virtual)$/;
    function isSolidityKeyword2(name) {
      return name === "address" || name === "bool" || name === "function" || name === "string" || name === "tuple" || regex_js_1.bytesRegex.test(name) || regex_js_1.integerRegex.test(name) || protectedKeywordsRegex2.test(name);
    }
    exports.isSolidityKeyword = isSolidityKeyword2;
    function isValidDataLocation2(type, isArray) {
      return isArray || type === "bytes" || type === "string" || type === "tuple";
    }
    exports.isValidDataLocation = isValidDataLocation2;
  }
});

// node_modules/abitype/dist/cjs/human-readable/runtime/structs.js
var require_structs = __commonJS({
  "node_modules/abitype/dist/cjs/human-readable/runtime/structs.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseStructs = void 0;
    var regex_js_1 = require_regex();
    var abiItem_js_1 = require_abiItem();
    var abiParameter_js_1 = require_abiParameter();
    var signature_js_1 = require_signature();
    var struct_js_1 = require_struct();
    var signatures_js_1 = require_signatures();
    var utils_js_1 = require_utils();
    function parseStructs2(signatures) {
      const shallowStructs = {};
      const signaturesLength = signatures.length;
      for (let i = 0; i < signaturesLength; i++) {
        const signature = signatures[i];
        if (!(0, signatures_js_1.isStructSignature)(signature))
          continue;
        const match = (0, signatures_js_1.execStructSignature)(signature);
        if (!match)
          throw new signature_js_1.InvalidSignatureError({ signature, type: "struct" });
        const properties = match.properties.split(";");
        const components = [];
        const propertiesLength = properties.length;
        for (let k = 0; k < propertiesLength; k++) {
          const property = properties[k];
          const trimmed = property.trim();
          if (!trimmed)
            continue;
          const abiParameter = (0, utils_js_1.parseAbiParameter)(trimmed, {
            type: "struct"
          });
          components.push(abiParameter);
        }
        if (!components.length)
          throw new signature_js_1.InvalidStructSignatureError({ signature });
        shallowStructs[match.name] = components;
      }
      const resolvedStructs = {};
      const entries = Object.entries(shallowStructs);
      const entriesLength = entries.length;
      for (let i = 0; i < entriesLength; i++) {
        const [name, parameters] = entries[i];
        resolvedStructs[name] = resolveStructs2(parameters, shallowStructs);
      }
      return resolvedStructs;
    }
    exports.parseStructs = parseStructs2;
    var typeWithoutTupleRegex2 = /^(?<type>[a-zA-Z$_][a-zA-Z0-9$_]*)(?<array>(?:\[\d*?\])+?)?$/;
    function resolveStructs2(abiParameters, structs, ancestors = /* @__PURE__ */ new Set()) {
      const components = [];
      const length = abiParameters.length;
      for (let i = 0; i < length; i++) {
        const abiParameter = abiParameters[i];
        const isTuple = regex_js_1.isTupleRegex.test(abiParameter.type);
        if (isTuple)
          components.push(abiParameter);
        else {
          const match = (0, regex_js_1.execTyped)(typeWithoutTupleRegex2, abiParameter.type);
          if (!match?.type)
            throw new abiParameter_js_1.InvalidAbiTypeParameterError({ abiParameter });
          const { array, type } = match;
          if (type in structs) {
            if (ancestors.has(type))
              throw new struct_js_1.CircularReferenceError({ type });
            components.push({
              ...abiParameter,
              type: `tuple${array ?? ""}`,
              components: resolveStructs2(structs[type] ?? [], structs, /* @__PURE__ */ new Set([...ancestors, type]))
            });
          } else {
            if ((0, utils_js_1.isSolidityType)(type))
              components.push(abiParameter);
            else
              throw new abiItem_js_1.UnknownTypeError({ type });
          }
        }
      }
      return components;
    }
  }
});

// node_modules/abitype/dist/cjs/human-readable/parseAbi.js
var require_parseAbi = __commonJS({
  "node_modules/abitype/dist/cjs/human-readable/parseAbi.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseAbi = void 0;
    var signatures_js_1 = require_signatures();
    var structs_js_1 = require_structs();
    var utils_js_1 = require_utils();
    function parseAbi2(signatures) {
      const structs = (0, structs_js_1.parseStructs)(signatures);
      const abi2 = [];
      const length = signatures.length;
      for (let i = 0; i < length; i++) {
        const signature = signatures[i];
        if ((0, signatures_js_1.isStructSignature)(signature))
          continue;
        abi2.push((0, utils_js_1.parseSignature)(signature, structs));
      }
      return abi2;
    }
    exports.parseAbi = parseAbi2;
  }
});

// node_modules/abitype/dist/cjs/human-readable/parseAbiItem.js
var require_parseAbiItem = __commonJS({
  "node_modules/abitype/dist/cjs/human-readable/parseAbiItem.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseAbiItem = void 0;
    var index_js_1 = require_cjs2();
    var signatures_js_1 = require_signatures();
    var structs_js_1 = require_structs();
    var utils_js_1 = require_utils();
    function parseAbiItem2(signature) {
      let abiItem;
      if (typeof signature === "string")
        abiItem = (0, utils_js_1.parseSignature)(signature);
      else {
        const structs = (0, structs_js_1.parseStructs)(signature);
        const length = signature.length;
        for (let i = 0; i < length; i++) {
          const signature_ = signature[i];
          if ((0, signatures_js_1.isStructSignature)(signature_))
            continue;
          abiItem = (0, utils_js_1.parseSignature)(signature_, structs);
          break;
        }
      }
      if (!abiItem)
        throw new index_js_1.InvalidAbiItemError({ signature });
      return abiItem;
    }
    exports.parseAbiItem = parseAbiItem2;
  }
});

// node_modules/abitype/dist/cjs/human-readable/parseAbiParameter.js
var require_parseAbiParameter = __commonJS({
  "node_modules/abitype/dist/cjs/human-readable/parseAbiParameter.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseAbiParameter = void 0;
    var index_js_1 = require_cjs2();
    var signatures_js_1 = require_signatures();
    var structs_js_1 = require_structs();
    var utils_js_1 = require_utils();
    function parseAbiParameter3(param) {
      let abiParameter;
      if (typeof param === "string")
        abiParameter = (0, utils_js_1.parseAbiParameter)(param, {
          modifiers: signatures_js_1.modifiers
        });
      else {
        const structs = (0, structs_js_1.parseStructs)(param);
        const length = param.length;
        for (let i = 0; i < length; i++) {
          const signature = param[i];
          if ((0, signatures_js_1.isStructSignature)(signature))
            continue;
          abiParameter = (0, utils_js_1.parseAbiParameter)(signature, { modifiers: signatures_js_1.modifiers, structs });
          break;
        }
      }
      if (!abiParameter)
        throw new index_js_1.InvalidAbiParameterError({ param });
      return abiParameter;
    }
    exports.parseAbiParameter = parseAbiParameter3;
  }
});

// node_modules/abitype/dist/cjs/human-readable/parseAbiParameters.js
var require_parseAbiParameters = __commonJS({
  "node_modules/abitype/dist/cjs/human-readable/parseAbiParameters.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseAbiParameters = void 0;
    var index_js_1 = require_cjs2();
    var signatures_js_1 = require_signatures();
    var structs_js_1 = require_structs();
    var utils_js_1 = require_utils();
    var utils_js_2 = require_utils();
    function parseAbiParameters2(params) {
      const abiParameters = [];
      if (typeof params === "string") {
        const parameters = (0, utils_js_1.splitParameters)(params);
        const length = parameters.length;
        for (let i = 0; i < length; i++) {
          abiParameters.push((0, utils_js_2.parseAbiParameter)(parameters[i], { modifiers: signatures_js_1.modifiers }));
        }
      } else {
        const structs = (0, structs_js_1.parseStructs)(params);
        const length = params.length;
        for (let i = 0; i < length; i++) {
          const signature = params[i];
          if ((0, signatures_js_1.isStructSignature)(signature))
            continue;
          const parameters = (0, utils_js_1.splitParameters)(signature);
          const length2 = parameters.length;
          for (let k = 0; k < length2; k++) {
            abiParameters.push((0, utils_js_2.parseAbiParameter)(parameters[k], { modifiers: signatures_js_1.modifiers, structs }));
          }
        }
      }
      if (abiParameters.length === 0)
        throw new index_js_1.InvalidAbiParametersError({ params });
      return abiParameters;
    }
    exports.parseAbiParameters = parseAbiParameters2;
  }
});

// node_modules/abitype/dist/cjs/index.js
var require_cjs2 = __commonJS({
  "node_modules/abitype/dist/cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CircularReferenceError = exports.InvalidParenthesisError = exports.UnknownSignatureError = exports.InvalidSignatureError = exports.InvalidStructSignatureError = exports.InvalidAbiParameterError = exports.InvalidAbiParametersError = exports.InvalidParameterError = exports.SolidityProtectedKeywordError = exports.InvalidModifierError = exports.InvalidFunctionModifierError = exports.InvalidAbiTypeParameterError = exports.UnknownSolidityTypeError = exports.InvalidAbiItemError = exports.UnknownTypeError = exports.parseAbiParameters = exports.parseAbiParameter = exports.parseAbiItem = exports.parseAbi = exports.formatAbiParameters = exports.formatAbiParameter = exports.formatAbiItem = exports.formatAbi = exports.narrow = exports.BaseError = void 0;
    var errors_js_1 = require_errors();
    Object.defineProperty(exports, "BaseError", { enumerable: true, get: function() {
      return errors_js_1.BaseError;
    } });
    var narrow_js_1 = require_narrow();
    Object.defineProperty(exports, "narrow", { enumerable: true, get: function() {
      return narrow_js_1.narrow;
    } });
    var formatAbi_js_1 = require_formatAbi();
    Object.defineProperty(exports, "formatAbi", { enumerable: true, get: function() {
      return formatAbi_js_1.formatAbi;
    } });
    var formatAbiItem_js_1 = require_formatAbiItem();
    Object.defineProperty(exports, "formatAbiItem", { enumerable: true, get: function() {
      return formatAbiItem_js_1.formatAbiItem;
    } });
    var formatAbiParameter_js_1 = require_formatAbiParameter();
    Object.defineProperty(exports, "formatAbiParameter", { enumerable: true, get: function() {
      return formatAbiParameter_js_1.formatAbiParameter;
    } });
    var formatAbiParameters_js_1 = require_formatAbiParameters();
    Object.defineProperty(exports, "formatAbiParameters", { enumerable: true, get: function() {
      return formatAbiParameters_js_1.formatAbiParameters;
    } });
    var parseAbi_js_1 = require_parseAbi();
    Object.defineProperty(exports, "parseAbi", { enumerable: true, get: function() {
      return parseAbi_js_1.parseAbi;
    } });
    var parseAbiItem_js_1 = require_parseAbiItem();
    Object.defineProperty(exports, "parseAbiItem", { enumerable: true, get: function() {
      return parseAbiItem_js_1.parseAbiItem;
    } });
    var parseAbiParameter_js_1 = require_parseAbiParameter();
    Object.defineProperty(exports, "parseAbiParameter", { enumerable: true, get: function() {
      return parseAbiParameter_js_1.parseAbiParameter;
    } });
    var parseAbiParameters_js_1 = require_parseAbiParameters();
    Object.defineProperty(exports, "parseAbiParameters", { enumerable: true, get: function() {
      return parseAbiParameters_js_1.parseAbiParameters;
    } });
    var abiItem_js_1 = require_abiItem();
    Object.defineProperty(exports, "UnknownTypeError", { enumerable: true, get: function() {
      return abiItem_js_1.UnknownTypeError;
    } });
    Object.defineProperty(exports, "InvalidAbiItemError", { enumerable: true, get: function() {
      return abiItem_js_1.InvalidAbiItemError;
    } });
    Object.defineProperty(exports, "UnknownSolidityTypeError", { enumerable: true, get: function() {
      return abiItem_js_1.UnknownSolidityTypeError;
    } });
    var abiParameter_js_1 = require_abiParameter();
    Object.defineProperty(exports, "InvalidAbiTypeParameterError", { enumerable: true, get: function() {
      return abiParameter_js_1.InvalidAbiTypeParameterError;
    } });
    Object.defineProperty(exports, "InvalidFunctionModifierError", { enumerable: true, get: function() {
      return abiParameter_js_1.InvalidFunctionModifierError;
    } });
    Object.defineProperty(exports, "InvalidModifierError", { enumerable: true, get: function() {
      return abiParameter_js_1.InvalidModifierError;
    } });
    Object.defineProperty(exports, "SolidityProtectedKeywordError", { enumerable: true, get: function() {
      return abiParameter_js_1.SolidityProtectedKeywordError;
    } });
    Object.defineProperty(exports, "InvalidParameterError", { enumerable: true, get: function() {
      return abiParameter_js_1.InvalidParameterError;
    } });
    Object.defineProperty(exports, "InvalidAbiParametersError", { enumerable: true, get: function() {
      return abiParameter_js_1.InvalidAbiParametersError;
    } });
    Object.defineProperty(exports, "InvalidAbiParameterError", { enumerable: true, get: function() {
      return abiParameter_js_1.InvalidAbiParameterError;
    } });
    var signature_js_1 = require_signature();
    Object.defineProperty(exports, "InvalidStructSignatureError", { enumerable: true, get: function() {
      return signature_js_1.InvalidStructSignatureError;
    } });
    Object.defineProperty(exports, "InvalidSignatureError", { enumerable: true, get: function() {
      return signature_js_1.InvalidSignatureError;
    } });
    Object.defineProperty(exports, "UnknownSignatureError", { enumerable: true, get: function() {
      return signature_js_1.UnknownSignatureError;
    } });
    var splitParameters_js_1 = require_splitParameters();
    Object.defineProperty(exports, "InvalidParenthesisError", { enumerable: true, get: function() {
      return splitParameters_js_1.InvalidParenthesisError;
    } });
    var struct_js_1 = require_struct();
    Object.defineProperty(exports, "CircularReferenceError", { enumerable: true, get: function() {
      return struct_js_1.CircularReferenceError;
    } });
  }
});

// node_modules/viem/_cjs/utils/abi/formatAbiItem.js
var require_formatAbiItem2 = __commonJS({
  "node_modules/viem/_cjs/utils/abi/formatAbiItem.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.formatAbiParams = exports.formatAbiItem = void 0;
    var abi_js_1 = require_abi();
    function formatAbiItem2(abiItem, { includeName = false } = {}) {
      if (abiItem.type !== "function" && abiItem.type !== "event" && abiItem.type !== "error")
        throw new abi_js_1.InvalidDefinitionTypeError(abiItem.type);
      return `${abiItem.name}(${formatAbiParams2(abiItem.inputs, { includeName })})`;
    }
    exports.formatAbiItem = formatAbiItem2;
    function formatAbiParams2(params, { includeName = false } = {}) {
      if (!params)
        return "";
      return params.map((param) => formatAbiParam2(param, { includeName })).join(includeName ? ", " : ",");
    }
    exports.formatAbiParams = formatAbiParams2;
    function formatAbiParam2(param, { includeName }) {
      if (param.type.startsWith("tuple")) {
        return `(${formatAbiParams2(param.components, { includeName })})${param.type.slice("tuple".length)}`;
      }
      return param.type + (includeName && param.name ? ` ${param.name}` : "");
    }
  }
});

// node_modules/viem/_cjs/utils/data/isHex.js
var require_isHex = __commonJS({
  "node_modules/viem/_cjs/utils/data/isHex.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isHex = void 0;
    function isHex2(value, { strict = true } = {}) {
      if (!value)
        return false;
      if (typeof value !== "string")
        return false;
      return strict ? /^0x[0-9a-fA-F]*$/.test(value) : value.startsWith("0x");
    }
    exports.isHex = isHex2;
  }
});

// node_modules/viem/_cjs/utils/data/size.js
var require_size = __commonJS({
  "node_modules/viem/_cjs/utils/data/size.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.size = void 0;
    var isHex_js_1 = require_isHex();
    function size2(value) {
      if ((0, isHex_js_1.isHex)(value, { strict: false }))
        return Math.ceil((value.length - 2) / 2);
      return value.length;
    }
    exports.size = size2;
  }
});

// node_modules/viem/_cjs/errors/version.js
var require_version2 = __commonJS({
  "node_modules/viem/_cjs/errors/version.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.version = void 0;
    exports.version = "1.16.5";
  }
});

// node_modules/viem/_cjs/errors/utils.js
var require_utils2 = __commonJS({
  "node_modules/viem/_cjs/errors/utils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getVersion = exports.getUrl = exports.getContractAddress = void 0;
    var version_js_1 = require_version2();
    var getContractAddress = (address) => address;
    exports.getContractAddress = getContractAddress;
    var getUrl = (url) => url;
    exports.getUrl = getUrl;
    var getVersion2 = () => `viem@${version_js_1.version}`;
    exports.getVersion = getVersion2;
  }
});

// node_modules/viem/_cjs/errors/base.js
var require_base = __commonJS({
  "node_modules/viem/_cjs/errors/base.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BaseError = void 0;
    var utils_js_1 = require_utils2();
    var BaseError3 = class _BaseError extends Error {
      constructor(shortMessage, args = {}) {
        super();
        Object.defineProperty(this, "details", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "docsPath", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "metaMessages", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "shortMessage", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "ViemError"
        });
        Object.defineProperty(this, "version", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: (0, utils_js_1.getVersion)()
        });
        const details = args.cause instanceof _BaseError ? args.cause.details : args.cause?.message ? args.cause.message : args.details;
        const docsPath = args.cause instanceof _BaseError ? args.cause.docsPath || args.docsPath : args.docsPath;
        this.message = [
          shortMessage || "An error occurred.",
          "",
          ...args.metaMessages ? [...args.metaMessages, ""] : [],
          ...docsPath ? [
            `Docs: https://viem.sh${docsPath}.html${args.docsSlug ? `#${args.docsSlug}` : ""}`
          ] : [],
          ...details ? [`Details: ${details}`] : [],
          `Version: ${this.version}`
        ].join("\n");
        if (args.cause)
          this.cause = args.cause;
        this.details = details;
        this.docsPath = docsPath;
        this.metaMessages = args.metaMessages;
        this.shortMessage = shortMessage;
      }
      walk(fn) {
        return walk2(this, fn);
      }
    };
    exports.BaseError = BaseError3;
    function walk2(err, fn) {
      if (fn?.(err))
        return err;
      if (err && typeof err === "object" && "cause" in err)
        return walk2(err.cause, fn);
      return fn ? null : err;
    }
  }
});

// node_modules/viem/_cjs/errors/abi.js
var require_abi = __commonJS({
  "node_modules/viem/_cjs/errors/abi.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UnsupportedPackedAbiType = exports.InvalidDefinitionTypeError = exports.InvalidArrayError = exports.InvalidAbiDecodingTypeError = exports.InvalidAbiEncodingTypeError = exports.DecodeLogTopicsMismatch = exports.DecodeLogDataMismatch = exports.BytesSizeMismatchError = exports.AbiFunctionSignatureNotFoundError = exports.AbiFunctionOutputsNotFoundError = exports.AbiFunctionNotFoundError = exports.AbiEventNotFoundError = exports.AbiEventSignatureNotFoundError = exports.AbiEventSignatureEmptyTopicsError = exports.AbiErrorSignatureNotFoundError = exports.AbiErrorNotFoundError = exports.AbiErrorInputsNotFoundError = exports.AbiEncodingLengthMismatchError = exports.AbiEncodingBytesSizeMismatchError = exports.AbiEncodingArrayLengthMismatchError = exports.AbiDecodingZeroDataError = exports.AbiDecodingDataSizeTooSmallError = exports.AbiDecodingDataSizeInvalidError = exports.AbiConstructorParamsNotFoundError = exports.AbiConstructorNotFoundError = void 0;
    var formatAbiItem_js_1 = require_formatAbiItem2();
    var size_js_1 = require_size();
    var base_js_1 = require_base();
    var AbiConstructorNotFoundError = class extends base_js_1.BaseError {
      constructor({ docsPath }) {
        super([
          "A constructor was not found on the ABI.",
          "Make sure you are using the correct ABI and that the constructor exists on it."
        ].join("\n"), {
          docsPath
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "AbiConstructorNotFoundError"
        });
      }
    };
    exports.AbiConstructorNotFoundError = AbiConstructorNotFoundError;
    var AbiConstructorParamsNotFoundError = class extends base_js_1.BaseError {
      constructor({ docsPath }) {
        super([
          "Constructor arguments were provided (`args`), but a constructor parameters (`inputs`) were not found on the ABI.",
          "Make sure you are using the correct ABI, and that the `inputs` attribute on the constructor exists."
        ].join("\n"), {
          docsPath
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "AbiConstructorParamsNotFoundError"
        });
      }
    };
    exports.AbiConstructorParamsNotFoundError = AbiConstructorParamsNotFoundError;
    var AbiDecodingDataSizeInvalidError = class extends base_js_1.BaseError {
      constructor({ data, size: size2 }) {
        super([
          `Data size of ${size2} bytes is invalid.`,
          "Size must be in increments of 32 bytes (size % 32 === 0)."
        ].join("\n"), { metaMessages: [`Data: ${data} (${size2} bytes)`] });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "AbiDecodingDataSizeInvalidError"
        });
      }
    };
    exports.AbiDecodingDataSizeInvalidError = AbiDecodingDataSizeInvalidError;
    var AbiDecodingDataSizeTooSmallError2 = class extends base_js_1.BaseError {
      constructor({ data, params, size: size2 }) {
        super([`Data size of ${size2} bytes is too small for given parameters.`].join("\n"), {
          metaMessages: [
            `Params: (${(0, formatAbiItem_js_1.formatAbiParams)(params, { includeName: true })})`,
            `Data:   ${data} (${size2} bytes)`
          ]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "AbiDecodingDataSizeTooSmallError"
        });
        Object.defineProperty(this, "data", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "params", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "size", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.data = data;
        this.params = params;
        this.size = size2;
      }
    };
    exports.AbiDecodingDataSizeTooSmallError = AbiDecodingDataSizeTooSmallError2;
    var AbiDecodingZeroDataError2 = class extends base_js_1.BaseError {
      constructor() {
        super('Cannot decode zero data ("0x") with ABI parameters.');
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "AbiDecodingZeroDataError"
        });
      }
    };
    exports.AbiDecodingZeroDataError = AbiDecodingZeroDataError2;
    var AbiEncodingArrayLengthMismatchError = class extends base_js_1.BaseError {
      constructor({ expectedLength, givenLength, type }) {
        super([
          `ABI encoding array length mismatch for type ${type}.`,
          `Expected length: ${expectedLength}`,
          `Given length: ${givenLength}`
        ].join("\n"));
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "AbiEncodingArrayLengthMismatchError"
        });
      }
    };
    exports.AbiEncodingArrayLengthMismatchError = AbiEncodingArrayLengthMismatchError;
    var AbiEncodingBytesSizeMismatchError = class extends base_js_1.BaseError {
      constructor({ expectedSize, value }) {
        super(`Size of bytes "${value}" (bytes${(0, size_js_1.size)(value)}) does not match expected size (bytes${expectedSize}).`);
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "AbiEncodingBytesSizeMismatchError"
        });
      }
    };
    exports.AbiEncodingBytesSizeMismatchError = AbiEncodingBytesSizeMismatchError;
    var AbiEncodingLengthMismatchError = class extends base_js_1.BaseError {
      constructor({ expectedLength, givenLength }) {
        super([
          "ABI encoding params/values length mismatch.",
          `Expected length (params): ${expectedLength}`,
          `Given length (values): ${givenLength}`
        ].join("\n"));
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "AbiEncodingLengthMismatchError"
        });
      }
    };
    exports.AbiEncodingLengthMismatchError = AbiEncodingLengthMismatchError;
    var AbiErrorInputsNotFoundError = class extends base_js_1.BaseError {
      constructor(errorName, { docsPath }) {
        super([
          `Arguments (\`args\`) were provided to "${errorName}", but "${errorName}" on the ABI does not contain any parameters (\`inputs\`).`,
          "Cannot encode error result without knowing what the parameter types are.",
          "Make sure you are using the correct ABI and that the inputs exist on it."
        ].join("\n"), {
          docsPath
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "AbiErrorInputsNotFoundError"
        });
      }
    };
    exports.AbiErrorInputsNotFoundError = AbiErrorInputsNotFoundError;
    var AbiErrorNotFoundError = class extends base_js_1.BaseError {
      constructor(errorName, { docsPath } = {}) {
        super([
          `Error ${errorName ? `"${errorName}" ` : ""}not found on ABI.`,
          "Make sure you are using the correct ABI and that the error exists on it."
        ].join("\n"), {
          docsPath
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "AbiErrorNotFoundError"
        });
      }
    };
    exports.AbiErrorNotFoundError = AbiErrorNotFoundError;
    var AbiErrorSignatureNotFoundError = class extends base_js_1.BaseError {
      constructor(signature, { docsPath }) {
        super([
          `Encoded error signature "${signature}" not found on ABI.`,
          "Make sure you are using the correct ABI and that the error exists on it.",
          `You can look up the decoded signature here: https://openchain.xyz/signatures?query=${signature}.`
        ].join("\n"), {
          docsPath
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "AbiErrorSignatureNotFoundError"
        });
        Object.defineProperty(this, "signature", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.signature = signature;
      }
    };
    exports.AbiErrorSignatureNotFoundError = AbiErrorSignatureNotFoundError;
    var AbiEventSignatureEmptyTopicsError = class extends base_js_1.BaseError {
      constructor({ docsPath }) {
        super("Cannot extract event signature from empty topics.", {
          docsPath
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "AbiEventSignatureEmptyTopicsError"
        });
      }
    };
    exports.AbiEventSignatureEmptyTopicsError = AbiEventSignatureEmptyTopicsError;
    var AbiEventSignatureNotFoundError = class extends base_js_1.BaseError {
      constructor(signature, { docsPath }) {
        super([
          `Encoded event signature "${signature}" not found on ABI.`,
          "Make sure you are using the correct ABI and that the event exists on it.",
          `You can look up the signature here: https://openchain.xyz/signatures?query=${signature}.`
        ].join("\n"), {
          docsPath
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "AbiEventSignatureNotFoundError"
        });
      }
    };
    exports.AbiEventSignatureNotFoundError = AbiEventSignatureNotFoundError;
    var AbiEventNotFoundError = class extends base_js_1.BaseError {
      constructor(eventName, { docsPath } = {}) {
        super([
          `Event ${eventName ? `"${eventName}" ` : ""}not found on ABI.`,
          "Make sure you are using the correct ABI and that the event exists on it."
        ].join("\n"), {
          docsPath
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "AbiEventNotFoundError"
        });
      }
    };
    exports.AbiEventNotFoundError = AbiEventNotFoundError;
    var AbiFunctionNotFoundError = class extends base_js_1.BaseError {
      constructor(functionName, { docsPath } = {}) {
        super([
          `Function ${functionName ? `"${functionName}" ` : ""}not found on ABI.`,
          "Make sure you are using the correct ABI and that the function exists on it."
        ].join("\n"), {
          docsPath
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "AbiFunctionNotFoundError"
        });
      }
    };
    exports.AbiFunctionNotFoundError = AbiFunctionNotFoundError;
    var AbiFunctionOutputsNotFoundError = class extends base_js_1.BaseError {
      constructor(functionName, { docsPath }) {
        super([
          `Function "${functionName}" does not contain any \`outputs\` on ABI.`,
          "Cannot decode function result without knowing what the parameter types are.",
          "Make sure you are using the correct ABI and that the function exists on it."
        ].join("\n"), {
          docsPath
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "AbiFunctionOutputsNotFoundError"
        });
      }
    };
    exports.AbiFunctionOutputsNotFoundError = AbiFunctionOutputsNotFoundError;
    var AbiFunctionSignatureNotFoundError2 = class extends base_js_1.BaseError {
      constructor(signature, { docsPath }) {
        super([
          `Encoded function signature "${signature}" not found on ABI.`,
          "Make sure you are using the correct ABI and that the function exists on it.",
          `You can look up the signature here: https://openchain.xyz/signatures?query=${signature}.`
        ].join("\n"), {
          docsPath
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "AbiFunctionSignatureNotFoundError"
        });
      }
    };
    exports.AbiFunctionSignatureNotFoundError = AbiFunctionSignatureNotFoundError2;
    var BytesSizeMismatchError = class extends base_js_1.BaseError {
      constructor({ expectedSize, givenSize }) {
        super(`Expected bytes${expectedSize}, got bytes${givenSize}.`);
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "BytesSizeMismatchError"
        });
      }
    };
    exports.BytesSizeMismatchError = BytesSizeMismatchError;
    var DecodeLogDataMismatch = class extends base_js_1.BaseError {
      constructor({ abiItem, data, params, size: size2 }) {
        super([
          `Data size of ${size2} bytes is too small for non-indexed event parameters.`
        ].join("\n"), {
          metaMessages: [
            `Params: (${(0, formatAbiItem_js_1.formatAbiParams)(params, { includeName: true })})`,
            `Data:   ${data} (${size2} bytes)`
          ]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "DecodeLogDataMismatch"
        });
        Object.defineProperty(this, "abiItem", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "data", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "params", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "size", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.abiItem = abiItem;
        this.data = data;
        this.params = params;
        this.size = size2;
      }
    };
    exports.DecodeLogDataMismatch = DecodeLogDataMismatch;
    var DecodeLogTopicsMismatch = class extends base_js_1.BaseError {
      constructor({ abiItem, param }) {
        super([
          `Expected a topic for indexed event parameter${param.name ? ` "${param.name}"` : ""} on event "${(0, formatAbiItem_js_1.formatAbiItem)(abiItem, { includeName: true })}".`
        ].join("\n"));
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "DecodeLogTopicsMismatch"
        });
        Object.defineProperty(this, "abiItem", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.abiItem = abiItem;
      }
    };
    exports.DecodeLogTopicsMismatch = DecodeLogTopicsMismatch;
    var InvalidAbiEncodingTypeError = class extends base_js_1.BaseError {
      constructor(type, { docsPath }) {
        super([
          `Type "${type}" is not a valid encoding type.`,
          "Please provide a valid ABI type."
        ].join("\n"), { docsPath });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidAbiEncodingType"
        });
      }
    };
    exports.InvalidAbiEncodingTypeError = InvalidAbiEncodingTypeError;
    var InvalidAbiDecodingTypeError2 = class extends base_js_1.BaseError {
      constructor(type, { docsPath }) {
        super([
          `Type "${type}" is not a valid decoding type.`,
          "Please provide a valid ABI type."
        ].join("\n"), { docsPath });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidAbiDecodingType"
        });
      }
    };
    exports.InvalidAbiDecodingTypeError = InvalidAbiDecodingTypeError2;
    var InvalidArrayError = class extends base_js_1.BaseError {
      constructor(value) {
        super([`Value "${value}" is not a valid array.`].join("\n"));
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidArrayError"
        });
      }
    };
    exports.InvalidArrayError = InvalidArrayError;
    var InvalidDefinitionTypeError2 = class extends base_js_1.BaseError {
      constructor(type) {
        super([
          `"${type}" is not a valid definition type.`,
          'Valid types: "function", "event", "error"'
        ].join("\n"));
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidDefinitionTypeError"
        });
      }
    };
    exports.InvalidDefinitionTypeError = InvalidDefinitionTypeError2;
    var UnsupportedPackedAbiType = class extends base_js_1.BaseError {
      constructor(type) {
        super(`Type "${type}" is not supported for packed encoding.`);
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "UnsupportedPackedAbiType"
        });
      }
    };
    exports.UnsupportedPackedAbiType = UnsupportedPackedAbiType;
  }
});

// node_modules/viem/_cjs/errors/log.js
var require_log = __commonJS({
  "node_modules/viem/_cjs/errors/log.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FilterTypeNotSupportedError = void 0;
    var base_js_1 = require_base();
    var FilterTypeNotSupportedError = class extends base_js_1.BaseError {
      constructor(type) {
        super(`Filter type "${type}" is not supported.`);
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "FilterTypeNotSupportedError"
        });
      }
    };
    exports.FilterTypeNotSupportedError = FilterTypeNotSupportedError;
  }
});

// node_modules/viem/_cjs/errors/data.js
var require_data = __commonJS({
  "node_modules/viem/_cjs/errors/data.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SizeExceedsPaddingSizeError = exports.SliceOffsetOutOfBoundsError = void 0;
    var base_js_1 = require_base();
    var SliceOffsetOutOfBoundsError2 = class extends base_js_1.BaseError {
      constructor({ offset, position, size: size2 }) {
        super(`Slice ${position === "start" ? "starting" : "ending"} at offset "${offset}" is out-of-bounds (size: ${size2}).`);
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "SliceOffsetOutOfBoundsError"
        });
      }
    };
    exports.SliceOffsetOutOfBoundsError = SliceOffsetOutOfBoundsError2;
    var SizeExceedsPaddingSizeError2 = class extends base_js_1.BaseError {
      constructor({ size: size2, targetSize, type }) {
        super(`${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()} size (${size2}) exceeds padding size (${targetSize}).`);
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "SizeExceedsPaddingSizeError"
        });
      }
    };
    exports.SizeExceedsPaddingSizeError = SizeExceedsPaddingSizeError2;
  }
});

// node_modules/viem/_cjs/utils/data/pad.js
var require_pad = __commonJS({
  "node_modules/viem/_cjs/utils/data/pad.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.padBytes = exports.padHex = exports.pad = void 0;
    var data_js_1 = require_data();
    function pad2(hexOrBytes, { dir, size: size2 = 32 } = {}) {
      if (typeof hexOrBytes === "string")
        return padHex2(hexOrBytes, { dir, size: size2 });
      return padBytes2(hexOrBytes, { dir, size: size2 });
    }
    exports.pad = pad2;
    function padHex2(hex_, { dir, size: size2 = 32 } = {}) {
      if (size2 === null)
        return hex_;
      const hex = hex_.replace("0x", "");
      if (hex.length > size2 * 2)
        throw new data_js_1.SizeExceedsPaddingSizeError({
          size: Math.ceil(hex.length / 2),
          targetSize: size2,
          type: "hex"
        });
      return `0x${hex[dir === "right" ? "padEnd" : "padStart"](size2 * 2, "0")}`;
    }
    exports.padHex = padHex2;
    function padBytes2(bytes2, { dir, size: size2 = 32 } = {}) {
      if (size2 === null)
        return bytes2;
      if (bytes2.length > size2)
        throw new data_js_1.SizeExceedsPaddingSizeError({
          size: bytes2.length,
          targetSize: size2,
          type: "bytes"
        });
      const paddedBytes = new Uint8Array(size2);
      for (let i = 0; i < size2; i++) {
        const padEnd = dir === "right";
        paddedBytes[padEnd ? i : size2 - i - 1] = bytes2[padEnd ? i : bytes2.length - i - 1];
      }
      return paddedBytes;
    }
    exports.padBytes = padBytes2;
  }
});

// node_modules/viem/_cjs/errors/encoding.js
var require_encoding = __commonJS({
  "node_modules/viem/_cjs/errors/encoding.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SizeOverflowError = exports.OffsetOutOfBoundsError = exports.InvalidHexValueError = exports.InvalidHexBooleanError = exports.InvalidBytesBooleanError = exports.IntegerOutOfRangeError = exports.DataLengthTooShortError = exports.DataLengthTooLongError = void 0;
    var base_js_1 = require_base();
    var DataLengthTooLongError = class extends base_js_1.BaseError {
      constructor({ consumed, length }) {
        super(`Consumed bytes (${consumed}) is shorter than data length (${length - 1}).`);
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "DataLengthTooLongError"
        });
      }
    };
    exports.DataLengthTooLongError = DataLengthTooLongError;
    var DataLengthTooShortError = class extends base_js_1.BaseError {
      constructor({ length, dataLength }) {
        super(`Data length (${dataLength - 1}) is shorter than consumed bytes length (${length - 1}).`);
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "DataLengthTooShortError"
        });
      }
    };
    exports.DataLengthTooShortError = DataLengthTooShortError;
    var IntegerOutOfRangeError2 = class extends base_js_1.BaseError {
      constructor({ max, min, signed, size: size2, value }) {
        super(`Number "${value}" is not in safe ${size2 ? `${size2 * 8}-bit ${signed ? "signed" : "unsigned"} ` : ""}integer range ${max ? `(${min} to ${max})` : `(above ${min})`}`);
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "IntegerOutOfRangeError"
        });
      }
    };
    exports.IntegerOutOfRangeError = IntegerOutOfRangeError2;
    var InvalidBytesBooleanError = class extends base_js_1.BaseError {
      constructor(bytes2) {
        super(`Bytes value "${bytes2}" is not a valid boolean. The bytes array must contain a single byte of either a 0 or 1 value.`);
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidBytesBooleanError"
        });
      }
    };
    exports.InvalidBytesBooleanError = InvalidBytesBooleanError;
    var InvalidHexBooleanError2 = class extends base_js_1.BaseError {
      constructor(hex) {
        super(`Hex value "${hex}" is not a valid boolean. The hex value must be "0x0" (false) or "0x1" (true).`);
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidHexBooleanError"
        });
      }
    };
    exports.InvalidHexBooleanError = InvalidHexBooleanError2;
    var InvalidHexValueError = class extends base_js_1.BaseError {
      constructor(value) {
        super(`Hex value "${value}" is an odd length (${value.length}). It must be an even length.`);
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidHexValueError"
        });
      }
    };
    exports.InvalidHexValueError = InvalidHexValueError;
    var OffsetOutOfBoundsError = class extends base_js_1.BaseError {
      constructor({ nextOffset, offset }) {
        super(`Next offset (${nextOffset}) is greater than previous offset + consumed bytes (${offset})`);
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "OffsetOutOfBoundsError"
        });
      }
    };
    exports.OffsetOutOfBoundsError = OffsetOutOfBoundsError;
    var SizeOverflowError2 = class extends base_js_1.BaseError {
      constructor({ givenSize, maxSize }) {
        super(`Size cannot exceed ${maxSize} bytes. Given size: ${givenSize} bytes.`);
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "SizeOverflowError"
        });
      }
    };
    exports.SizeOverflowError = SizeOverflowError2;
  }
});

// node_modules/viem/_cjs/utils/data/trim.js
var require_trim = __commonJS({
  "node_modules/viem/_cjs/utils/data/trim.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.trim = void 0;
    function trim2(hexOrBytes, { dir = "left" } = {}) {
      let data = typeof hexOrBytes === "string" ? hexOrBytes.replace("0x", "") : hexOrBytes;
      let sliceLength = 0;
      for (let i = 0; i < data.length - 1; i++) {
        if (data[dir === "left" ? i : data.length - i - 1].toString() === "0")
          sliceLength++;
        else
          break;
      }
      data = dir === "left" ? data.slice(sliceLength) : data.slice(0, data.length - sliceLength);
      if (typeof hexOrBytes === "string") {
        if (data.length === 1 && dir === "right")
          data = `${data}0`;
        return `0x${data.length % 2 === 1 ? `0${data}` : data}`;
      }
      return data;
    }
    exports.trim = trim2;
  }
});

// node_modules/viem/_cjs/utils/encoding/fromHex.js
var require_fromHex = __commonJS({
  "node_modules/viem/_cjs/utils/encoding/fromHex.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.hexToString = exports.hexToNumber = exports.hexToBool = exports.hexToBigInt = exports.fromHex = exports.assertSize = void 0;
    var encoding_js_1 = require_encoding();
    var size_js_1 = require_size();
    var trim_js_1 = require_trim();
    var toBytes_js_1 = require_toBytes();
    function assertSize2(hexOrBytes, { size: size2 }) {
      if ((0, size_js_1.size)(hexOrBytes) > size2)
        throw new encoding_js_1.SizeOverflowError({
          givenSize: (0, size_js_1.size)(hexOrBytes),
          maxSize: size2
        });
    }
    exports.assertSize = assertSize2;
    function fromHex(hex, toOrOpts) {
      const opts = typeof toOrOpts === "string" ? { to: toOrOpts } : toOrOpts;
      const to = opts.to;
      if (to === "number")
        return hexToNumber2(hex, opts);
      if (to === "bigint")
        return hexToBigInt2(hex, opts);
      if (to === "string")
        return hexToString2(hex, opts);
      if (to === "boolean")
        return hexToBool2(hex, opts);
      return (0, toBytes_js_1.hexToBytes)(hex, opts);
    }
    exports.fromHex = fromHex;
    function hexToBigInt2(hex, opts = {}) {
      const { signed } = opts;
      if (opts.size)
        assertSize2(hex, { size: opts.size });
      const value = BigInt(hex);
      if (!signed)
        return value;
      const size2 = (hex.length - 2) / 2;
      const max = (1n << BigInt(size2) * 8n - 1n) - 1n;
      if (value <= max)
        return value;
      return value - BigInt(`0x${"f".padStart(size2 * 2, "f")}`) - 1n;
    }
    exports.hexToBigInt = hexToBigInt2;
    function hexToBool2(hex_, opts = {}) {
      let hex = hex_;
      if (opts.size) {
        assertSize2(hex, { size: opts.size });
        hex = (0, trim_js_1.trim)(hex);
      }
      if ((0, trim_js_1.trim)(hex) === "0x00")
        return false;
      if ((0, trim_js_1.trim)(hex) === "0x01")
        return true;
      throw new encoding_js_1.InvalidHexBooleanError(hex);
    }
    exports.hexToBool = hexToBool2;
    function hexToNumber2(hex, opts = {}) {
      return Number(hexToBigInt2(hex, opts));
    }
    exports.hexToNumber = hexToNumber2;
    function hexToString2(hex, opts = {}) {
      let bytes2 = (0, toBytes_js_1.hexToBytes)(hex);
      if (opts.size) {
        assertSize2(bytes2, { size: opts.size });
        bytes2 = (0, trim_js_1.trim)(bytes2, { dir: "right" });
      }
      return new TextDecoder().decode(bytes2);
    }
    exports.hexToString = hexToString2;
  }
});

// node_modules/viem/_cjs/utils/encoding/toHex.js
var require_toHex = __commonJS({
  "node_modules/viem/_cjs/utils/encoding/toHex.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.stringToHex = exports.numberToHex = exports.bytesToHex = exports.boolToHex = exports.toHex = void 0;
    var encoding_js_1 = require_encoding();
    var pad_js_1 = require_pad();
    var fromHex_js_1 = require_fromHex();
    var hexes2 = Array.from({ length: 256 }, (_v, i) => i.toString(16).padStart(2, "0"));
    function toHex2(value, opts = {}) {
      if (typeof value === "number" || typeof value === "bigint")
        return numberToHex2(value, opts);
      if (typeof value === "string") {
        return stringToHex2(value, opts);
      }
      if (typeof value === "boolean")
        return boolToHex2(value, opts);
      return bytesToHex2(value, opts);
    }
    exports.toHex = toHex2;
    function boolToHex2(value, opts = {}) {
      const hex = `0x${Number(value)}`;
      if (typeof opts.size === "number") {
        (0, fromHex_js_1.assertSize)(hex, { size: opts.size });
        return (0, pad_js_1.pad)(hex, { size: opts.size });
      }
      return hex;
    }
    exports.boolToHex = boolToHex2;
    function bytesToHex2(value, opts = {}) {
      let string = "";
      for (let i = 0; i < value.length; i++) {
        string += hexes2[value[i]];
      }
      const hex = `0x${string}`;
      if (typeof opts.size === "number") {
        (0, fromHex_js_1.assertSize)(hex, { size: opts.size });
        return (0, pad_js_1.pad)(hex, { dir: "right", size: opts.size });
      }
      return hex;
    }
    exports.bytesToHex = bytesToHex2;
    function numberToHex2(value_, opts = {}) {
      const { signed, size: size2 } = opts;
      const value = BigInt(value_);
      let maxValue;
      if (size2) {
        if (signed)
          maxValue = (1n << BigInt(size2) * 8n - 1n) - 1n;
        else
          maxValue = 2n ** (BigInt(size2) * 8n) - 1n;
      } else if (typeof value_ === "number") {
        maxValue = BigInt(Number.MAX_SAFE_INTEGER);
      }
      const minValue = typeof maxValue === "bigint" && signed ? -maxValue - 1n : 0;
      if (maxValue && value > maxValue || value < minValue) {
        const suffix = typeof value_ === "bigint" ? "n" : "";
        throw new encoding_js_1.IntegerOutOfRangeError({
          max: maxValue ? `${maxValue}${suffix}` : void 0,
          min: `${minValue}${suffix}`,
          signed,
          size: size2,
          value: `${value_}${suffix}`
        });
      }
      const hex = `0x${(signed && value < 0 ? (1n << BigInt(size2 * 8)) + BigInt(value) : value).toString(16)}`;
      if (size2)
        return (0, pad_js_1.pad)(hex, { size: size2 });
      return hex;
    }
    exports.numberToHex = numberToHex2;
    var encoder3 = new TextEncoder();
    function stringToHex2(value_, opts = {}) {
      const value = encoder3.encode(value_);
      return bytesToHex2(value, opts);
    }
    exports.stringToHex = stringToHex2;
  }
});

// node_modules/viem/_cjs/utils/encoding/toBytes.js
var require_toBytes = __commonJS({
  "node_modules/viem/_cjs/utils/encoding/toBytes.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.stringToBytes = exports.numberToBytes = exports.hexToBytes = exports.boolToBytes = exports.toBytes = void 0;
    var base_js_1 = require_base();
    var isHex_js_1 = require_isHex();
    var pad_js_1 = require_pad();
    var fromHex_js_1 = require_fromHex();
    var toHex_js_1 = require_toHex();
    var encoder3 = new TextEncoder();
    function toBytes3(value, opts = {}) {
      if (typeof value === "number" || typeof value === "bigint")
        return numberToBytes2(value, opts);
      if (typeof value === "boolean")
        return boolToBytes2(value, opts);
      if ((0, isHex_js_1.isHex)(value))
        return hexToBytes2(value, opts);
      return stringToBytes2(value, opts);
    }
    exports.toBytes = toBytes3;
    function boolToBytes2(value, opts = {}) {
      const bytes2 = new Uint8Array(1);
      bytes2[0] = Number(value);
      if (typeof opts.size === "number") {
        (0, fromHex_js_1.assertSize)(bytes2, { size: opts.size });
        return (0, pad_js_1.pad)(bytes2, { size: opts.size });
      }
      return bytes2;
    }
    exports.boolToBytes = boolToBytes2;
    var charCodeMap2 = {
      zero: 48,
      nine: 57,
      A: 65,
      F: 70,
      a: 97,
      f: 102
    };
    function charCodeToBase162(char) {
      if (char >= charCodeMap2.zero && char <= charCodeMap2.nine)
        return char - charCodeMap2.zero;
      else if (char >= charCodeMap2.A && char <= charCodeMap2.F)
        return char - (charCodeMap2.A - 10);
      else if (char >= charCodeMap2.a && char <= charCodeMap2.f)
        return char - (charCodeMap2.a - 10);
      return void 0;
    }
    function hexToBytes2(hex_, opts = {}) {
      let hex = hex_;
      if (opts.size) {
        (0, fromHex_js_1.assertSize)(hex, { size: opts.size });
        hex = (0, pad_js_1.pad)(hex, { dir: "right", size: opts.size });
      }
      let hexString = hex.slice(2);
      if (hexString.length % 2)
        hexString = `0${hexString}`;
      const length = hexString.length / 2;
      const bytes2 = new Uint8Array(length);
      for (let index = 0, j = 0; index < length; index++) {
        const nibbleLeft = charCodeToBase162(hexString.charCodeAt(j++));
        const nibbleRight = charCodeToBase162(hexString.charCodeAt(j++));
        if (nibbleLeft === void 0 || nibbleRight === void 0) {
          throw new base_js_1.BaseError(`Invalid byte sequence ("${hexString[j - 2]}${hexString[j - 1]}" in "${hexString}").`);
        }
        bytes2[index] = nibbleLeft * 16 + nibbleRight;
      }
      return bytes2;
    }
    exports.hexToBytes = hexToBytes2;
    function numberToBytes2(value, opts) {
      const hex = (0, toHex_js_1.numberToHex)(value, opts);
      return hexToBytes2(hex);
    }
    exports.numberToBytes = numberToBytes2;
    function stringToBytes2(value, opts = {}) {
      const bytes2 = encoder3.encode(value);
      if (typeof opts.size === "number") {
        (0, fromHex_js_1.assertSize)(bytes2, { size: opts.size });
        return (0, pad_js_1.pad)(bytes2, { dir: "right", size: opts.size });
      }
      return bytes2;
    }
    exports.stringToBytes = stringToBytes2;
  }
});

// node_modules/viem/_cjs/utils/contract/extractFunctionParts.js
var require_extractFunctionParts = __commonJS({
  "node_modules/viem/_cjs/utils/contract/extractFunctionParts.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.extractFunctionType = exports.extractFunctionParams = exports.extractFunctionName = exports.extractFunctionParts = void 0;
    var paramsRegex2 = /((function|event)\s)?(.*)(\((.*)\))/;
    function extractFunctionParts2(def) {
      const parts = def.match(paramsRegex2);
      const type = parts?.[2] || void 0;
      const name = parts?.[3];
      const params = parts?.[5] || void 0;
      return { type, name, params };
    }
    exports.extractFunctionParts = extractFunctionParts2;
    function extractFunctionName2(def) {
      return extractFunctionParts2(def).name;
    }
    exports.extractFunctionName = extractFunctionName2;
    function extractFunctionParams2(def) {
      const params = extractFunctionParts2(def).params;
      const splitParams = params?.split(",").map((x) => x.trim().split(" "));
      return splitParams?.map((param) => ({
        type: param[0],
        name: param[1] === "indexed" ? param[2] : param[1],
        ...param[1] === "indexed" ? { indexed: true } : {}
      }));
    }
    exports.extractFunctionParams = extractFunctionParams2;
    function extractFunctionType(def) {
      return extractFunctionParts2(def).type;
    }
    exports.extractFunctionType = extractFunctionType;
  }
});

// node_modules/viem/_cjs/utils/hash/getFunctionSignature.js
var require_getFunctionSignature = __commonJS({
  "node_modules/viem/_cjs/utils/hash/getFunctionSignature.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getFunctionSignature = void 0;
    var formatAbiItem_js_1 = require_formatAbiItem2();
    var extractFunctionParts_js_1 = require_extractFunctionParts();
    var getFunctionSignature2 = (fn) => {
      if (typeof fn === "string") {
        const name = (0, extractFunctionParts_js_1.extractFunctionName)(fn);
        const params = (0, extractFunctionParts_js_1.extractFunctionParams)(fn) || [];
        return `${name}(${params.map(({ type }) => type).join(",")})`;
      }
      return (0, formatAbiItem_js_1.formatAbiItem)(fn);
    };
    exports.getFunctionSignature = getFunctionSignature2;
  }
});

// node_modules/viem/_cjs/utils/hash/getEventSignature.js
var require_getEventSignature = __commonJS({
  "node_modules/viem/_cjs/utils/hash/getEventSignature.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getEventSignature = void 0;
    var getFunctionSignature_js_1 = require_getFunctionSignature();
    var getEventSignature = (fn) => {
      return (0, getFunctionSignature_js_1.getFunctionSignature)(fn);
    };
    exports.getEventSignature = getEventSignature;
  }
});

// node_modules/@noble/hashes/_assert.js
var require_assert = __commonJS({
  "node_modules/@noble/hashes/_assert.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.output = exports.exists = exports.hash = exports.bytes = exports.bool = exports.number = void 0;
    function number2(n) {
      if (!Number.isSafeInteger(n) || n < 0)
        throw new Error(`Wrong positive integer: ${n}`);
    }
    exports.number = number2;
    function bool(b) {
      if (typeof b !== "boolean")
        throw new Error(`Expected boolean, not ${b}`);
    }
    exports.bool = bool;
    function bytes2(b, ...lengths) {
      if (!(b instanceof Uint8Array))
        throw new Error("Expected Uint8Array");
      if (lengths.length > 0 && !lengths.includes(b.length))
        throw new Error(`Expected Uint8Array of length ${lengths}, not of length=${b.length}`);
    }
    exports.bytes = bytes2;
    function hash2(hash3) {
      if (typeof hash3 !== "function" || typeof hash3.create !== "function")
        throw new Error("Hash should be wrapped by utils.wrapConstructor");
      number2(hash3.outputLen);
      number2(hash3.blockLen);
    }
    exports.hash = hash2;
    function exists2(instance, checkFinished = true) {
      if (instance.destroyed)
        throw new Error("Hash instance has been destroyed");
      if (checkFinished && instance.finished)
        throw new Error("Hash#digest() has already been called");
    }
    exports.exists = exists2;
    function output2(out, instance) {
      bytes2(out);
      const min = instance.outputLen;
      if (out.length < min) {
        throw new Error(`digestInto() expects output buffer of length at least ${min}`);
      }
    }
    exports.output = output2;
    var assert = { number: number2, bool, bytes: bytes2, hash: hash2, exists: exists2, output: output2 };
    exports.default = assert;
  }
});

// node_modules/@noble/hashes/_u64.js
var require_u64 = __commonJS({
  "node_modules/@noble/hashes/_u64.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.add5L = exports.add5H = exports.add4H = exports.add4L = exports.add3H = exports.add3L = exports.add = exports.rotlBL = exports.rotlBH = exports.rotlSL = exports.rotlSH = exports.rotr32L = exports.rotr32H = exports.rotrBL = exports.rotrBH = exports.rotrSL = exports.rotrSH = exports.shrSL = exports.shrSH = exports.toBig = exports.split = exports.fromBig = void 0;
    var U32_MASK642 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
    var _32n2 = /* @__PURE__ */ BigInt(32);
    function fromBig2(n, le = false) {
      if (le)
        return { h: Number(n & U32_MASK642), l: Number(n >> _32n2 & U32_MASK642) };
      return { h: Number(n >> _32n2 & U32_MASK642) | 0, l: Number(n & U32_MASK642) | 0 };
    }
    exports.fromBig = fromBig2;
    function split2(lst, le = false) {
      let Ah = new Uint32Array(lst.length);
      let Al = new Uint32Array(lst.length);
      for (let i = 0; i < lst.length; i++) {
        const { h, l } = fromBig2(lst[i], le);
        [Ah[i], Al[i]] = [h, l];
      }
      return [Ah, Al];
    }
    exports.split = split2;
    var toBig = (h, l) => BigInt(h >>> 0) << _32n2 | BigInt(l >>> 0);
    exports.toBig = toBig;
    var shrSH = (h, _l, s) => h >>> s;
    exports.shrSH = shrSH;
    var shrSL = (h, l, s) => h << 32 - s | l >>> s;
    exports.shrSL = shrSL;
    var rotrSH = (h, l, s) => h >>> s | l << 32 - s;
    exports.rotrSH = rotrSH;
    var rotrSL = (h, l, s) => h << 32 - s | l >>> s;
    exports.rotrSL = rotrSL;
    var rotrBH = (h, l, s) => h << 64 - s | l >>> s - 32;
    exports.rotrBH = rotrBH;
    var rotrBL = (h, l, s) => h >>> s - 32 | l << 64 - s;
    exports.rotrBL = rotrBL;
    var rotr32H = (_h, l) => l;
    exports.rotr32H = rotr32H;
    var rotr32L = (h, _l) => h;
    exports.rotr32L = rotr32L;
    var rotlSH2 = (h, l, s) => h << s | l >>> 32 - s;
    exports.rotlSH = rotlSH2;
    var rotlSL2 = (h, l, s) => l << s | h >>> 32 - s;
    exports.rotlSL = rotlSL2;
    var rotlBH2 = (h, l, s) => l << s - 32 | h >>> 64 - s;
    exports.rotlBH = rotlBH2;
    var rotlBL2 = (h, l, s) => h << s - 32 | l >>> 64 - s;
    exports.rotlBL = rotlBL2;
    function add(Ah, Al, Bh, Bl) {
      const l = (Al >>> 0) + (Bl >>> 0);
      return { h: Ah + Bh + (l / 2 ** 32 | 0) | 0, l: l | 0 };
    }
    exports.add = add;
    var add3L = (Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0);
    exports.add3L = add3L;
    var add3H = (low, Ah, Bh, Ch) => Ah + Bh + Ch + (low / 2 ** 32 | 0) | 0;
    exports.add3H = add3H;
    var add4L = (Al, Bl, Cl, Dl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0);
    exports.add4L = add4L;
    var add4H = (low, Ah, Bh, Ch, Dh) => Ah + Bh + Ch + Dh + (low / 2 ** 32 | 0) | 0;
    exports.add4H = add4H;
    var add5L = (Al, Bl, Cl, Dl, El) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0) + (El >>> 0);
    exports.add5L = add5L;
    var add5H = (low, Ah, Bh, Ch, Dh, Eh) => Ah + Bh + Ch + Dh + Eh + (low / 2 ** 32 | 0) | 0;
    exports.add5H = add5H;
    var u64 = {
      fromBig: fromBig2,
      split: split2,
      toBig,
      shrSH,
      shrSL,
      rotrSH,
      rotrSL,
      rotrBH,
      rotrBL,
      rotr32H,
      rotr32L,
      rotlSH: rotlSH2,
      rotlSL: rotlSL2,
      rotlBH: rotlBH2,
      rotlBL: rotlBL2,
      add,
      add3L,
      add3H,
      add4L,
      add4H,
      add5H,
      add5L
    };
    exports.default = u64;
  }
});

// node_modules/@noble/hashes/cryptoNode.js
var require_cryptoNode = __commonJS({
  "node_modules/@noble/hashes/cryptoNode.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.crypto = void 0;
    var nc = require("node:crypto");
    exports.crypto = nc && typeof nc === "object" && "webcrypto" in nc ? nc.webcrypto : void 0;
  }
});

// node_modules/@noble/hashes/utils.js
var require_utils3 = __commonJS({
  "node_modules/@noble/hashes/utils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.randomBytes = exports.wrapXOFConstructorWithOpts = exports.wrapConstructorWithOpts = exports.wrapConstructor = exports.checkOpts = exports.Hash = exports.concatBytes = exports.toBytes = exports.utf8ToBytes = exports.asyncLoop = exports.nextTick = exports.hexToBytes = exports.bytesToHex = exports.isLE = exports.rotr = exports.createView = exports.u32 = exports.u8 = void 0;
    var crypto_1 = require_cryptoNode();
    var u8a2 = (a) => a instanceof Uint8Array;
    var u8 = (arr) => new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength);
    exports.u8 = u8;
    var u322 = (arr) => new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
    exports.u32 = u322;
    var createView = (arr) => new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
    exports.createView = createView;
    var rotr = (word, shift) => word << 32 - shift | word >>> shift;
    exports.rotr = rotr;
    exports.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
    if (!exports.isLE)
      throw new Error("Non little-endian hardware is not supported");
    var hexes2 = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
    function bytesToHex2(bytes2) {
      if (!u8a2(bytes2))
        throw new Error("Uint8Array expected");
      let hex = "";
      for (let i = 0; i < bytes2.length; i++) {
        hex += hexes2[bytes2[i]];
      }
      return hex;
    }
    exports.bytesToHex = bytesToHex2;
    function hexToBytes2(hex) {
      if (typeof hex !== "string")
        throw new Error("hex string expected, got " + typeof hex);
      const len = hex.length;
      if (len % 2)
        throw new Error("padded hex string expected, got unpadded hex of length " + len);
      const array = new Uint8Array(len / 2);
      for (let i = 0; i < array.length; i++) {
        const j = i * 2;
        const hexByte = hex.slice(j, j + 2);
        const byte = Number.parseInt(hexByte, 16);
        if (Number.isNaN(byte) || byte < 0)
          throw new Error("Invalid byte sequence");
        array[i] = byte;
      }
      return array;
    }
    exports.hexToBytes = hexToBytes2;
    var nextTick = async () => {
    };
    exports.nextTick = nextTick;
    async function asyncLoop(iters, tick, cb) {
      let ts = Date.now();
      for (let i = 0; i < iters; i++) {
        cb(i);
        const diff = Date.now() - ts;
        if (diff >= 0 && diff < tick)
          continue;
        await (0, exports.nextTick)();
        ts += diff;
      }
    }
    exports.asyncLoop = asyncLoop;
    function utf8ToBytes2(str) {
      if (typeof str !== "string")
        throw new Error(`utf8ToBytes expected string, got ${typeof str}`);
      return new Uint8Array(new TextEncoder().encode(str));
    }
    exports.utf8ToBytes = utf8ToBytes2;
    function toBytes3(data) {
      if (typeof data === "string")
        data = utf8ToBytes2(data);
      if (!u8a2(data))
        throw new Error(`expected Uint8Array, got ${typeof data}`);
      return data;
    }
    exports.toBytes = toBytes3;
    function concatBytes(...arrays) {
      const r = new Uint8Array(arrays.reduce((sum, a) => sum + a.length, 0));
      let pad2 = 0;
      arrays.forEach((a) => {
        if (!u8a2(a))
          throw new Error("Uint8Array expected");
        r.set(a, pad2);
        pad2 += a.length;
      });
      return r;
    }
    exports.concatBytes = concatBytes;
    var Hash2 = class {
      // Safe version that clones internal state
      clone() {
        return this._cloneInto();
      }
    };
    exports.Hash = Hash2;
    var toStr2 = {}.toString;
    function checkOpts(defaults, opts) {
      if (opts !== void 0 && toStr2.call(opts) !== "[object Object]")
        throw new Error("Options should be object or undefined");
      const merged = Object.assign(defaults, opts);
      return merged;
    }
    exports.checkOpts = checkOpts;
    function wrapConstructor2(hashCons) {
      const hashC = (msg) => hashCons().update(toBytes3(msg)).digest();
      const tmp = hashCons();
      hashC.outputLen = tmp.outputLen;
      hashC.blockLen = tmp.blockLen;
      hashC.create = () => hashCons();
      return hashC;
    }
    exports.wrapConstructor = wrapConstructor2;
    function wrapConstructorWithOpts(hashCons) {
      const hashC = (msg, opts) => hashCons(opts).update(toBytes3(msg)).digest();
      const tmp = hashCons({});
      hashC.outputLen = tmp.outputLen;
      hashC.blockLen = tmp.blockLen;
      hashC.create = (opts) => hashCons(opts);
      return hashC;
    }
    exports.wrapConstructorWithOpts = wrapConstructorWithOpts;
    function wrapXOFConstructorWithOpts2(hashCons) {
      const hashC = (msg, opts) => hashCons(opts).update(toBytes3(msg)).digest();
      const tmp = hashCons({});
      hashC.outputLen = tmp.outputLen;
      hashC.blockLen = tmp.blockLen;
      hashC.create = (opts) => hashCons(opts);
      return hashC;
    }
    exports.wrapXOFConstructorWithOpts = wrapXOFConstructorWithOpts2;
    function randomBytes(bytesLength = 32) {
      if (crypto_1.crypto && typeof crypto_1.crypto.getRandomValues === "function") {
        return crypto_1.crypto.getRandomValues(new Uint8Array(bytesLength));
      }
      throw new Error("crypto.getRandomValues must be defined");
    }
    exports.randomBytes = randomBytes;
  }
});

// node_modules/@noble/hashes/sha3.js
var require_sha3 = __commonJS({
  "node_modules/@noble/hashes/sha3.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.shake256 = exports.shake128 = exports.keccak_512 = exports.keccak_384 = exports.keccak_256 = exports.keccak_224 = exports.sha3_512 = exports.sha3_384 = exports.sha3_256 = exports.sha3_224 = exports.Keccak = exports.keccakP = void 0;
    var _assert_js_1 = require_assert();
    var _u64_js_1 = require_u64();
    var utils_js_1 = require_utils3();
    var [SHA3_PI2, SHA3_ROTL2, _SHA3_IOTA2] = [[], [], []];
    var _0n2 = /* @__PURE__ */ BigInt(0);
    var _1n2 = /* @__PURE__ */ BigInt(1);
    var _2n2 = /* @__PURE__ */ BigInt(2);
    var _7n2 = /* @__PURE__ */ BigInt(7);
    var _256n2 = /* @__PURE__ */ BigInt(256);
    var _0x71n2 = /* @__PURE__ */ BigInt(113);
    for (let round = 0, R = _1n2, x = 1, y = 0; round < 24; round++) {
      [x, y] = [y, (2 * x + 3 * y) % 5];
      SHA3_PI2.push(2 * (5 * y + x));
      SHA3_ROTL2.push((round + 1) * (round + 2) / 2 % 64);
      let t = _0n2;
      for (let j = 0; j < 7; j++) {
        R = (R << _1n2 ^ (R >> _7n2) * _0x71n2) % _256n2;
        if (R & _2n2)
          t ^= _1n2 << (_1n2 << /* @__PURE__ */ BigInt(j)) - _1n2;
      }
      _SHA3_IOTA2.push(t);
    }
    var [SHA3_IOTA_H2, SHA3_IOTA_L2] = /* @__PURE__ */ (0, _u64_js_1.split)(_SHA3_IOTA2, true);
    var rotlH2 = (h, l, s) => s > 32 ? (0, _u64_js_1.rotlBH)(h, l, s) : (0, _u64_js_1.rotlSH)(h, l, s);
    var rotlL2 = (h, l, s) => s > 32 ? (0, _u64_js_1.rotlBL)(h, l, s) : (0, _u64_js_1.rotlSL)(h, l, s);
    function keccakP2(s, rounds = 24) {
      const B = new Uint32Array(5 * 2);
      for (let round = 24 - rounds; round < 24; round++) {
        for (let x = 0; x < 10; x++)
          B[x] = s[x] ^ s[x + 10] ^ s[x + 20] ^ s[x + 30] ^ s[x + 40];
        for (let x = 0; x < 10; x += 2) {
          const idx1 = (x + 8) % 10;
          const idx0 = (x + 2) % 10;
          const B0 = B[idx0];
          const B1 = B[idx0 + 1];
          const Th = rotlH2(B0, B1, 1) ^ B[idx1];
          const Tl = rotlL2(B0, B1, 1) ^ B[idx1 + 1];
          for (let y = 0; y < 50; y += 10) {
            s[x + y] ^= Th;
            s[x + y + 1] ^= Tl;
          }
        }
        let curH = s[2];
        let curL = s[3];
        for (let t = 0; t < 24; t++) {
          const shift = SHA3_ROTL2[t];
          const Th = rotlH2(curH, curL, shift);
          const Tl = rotlL2(curH, curL, shift);
          const PI = SHA3_PI2[t];
          curH = s[PI];
          curL = s[PI + 1];
          s[PI] = Th;
          s[PI + 1] = Tl;
        }
        for (let y = 0; y < 50; y += 10) {
          for (let x = 0; x < 10; x++)
            B[x] = s[y + x];
          for (let x = 0; x < 10; x++)
            s[y + x] ^= ~B[(x + 2) % 10] & B[(x + 4) % 10];
        }
        s[0] ^= SHA3_IOTA_H2[round];
        s[1] ^= SHA3_IOTA_L2[round];
      }
      B.fill(0);
    }
    exports.keccakP = keccakP2;
    var Keccak2 = class _Keccak extends utils_js_1.Hash {
      // NOTE: we accept arguments in bytes instead of bits here.
      constructor(blockLen, suffix, outputLen, enableXOF = false, rounds = 24) {
        super();
        this.blockLen = blockLen;
        this.suffix = suffix;
        this.outputLen = outputLen;
        this.enableXOF = enableXOF;
        this.rounds = rounds;
        this.pos = 0;
        this.posOut = 0;
        this.finished = false;
        this.destroyed = false;
        (0, _assert_js_1.number)(outputLen);
        if (0 >= this.blockLen || this.blockLen >= 200)
          throw new Error("Sha3 supports only keccak-f1600 function");
        this.state = new Uint8Array(200);
        this.state32 = (0, utils_js_1.u32)(this.state);
      }
      keccak() {
        keccakP2(this.state32, this.rounds);
        this.posOut = 0;
        this.pos = 0;
      }
      update(data) {
        (0, _assert_js_1.exists)(this);
        const { blockLen, state } = this;
        data = (0, utils_js_1.toBytes)(data);
        const len = data.length;
        for (let pos = 0; pos < len; ) {
          const take = Math.min(blockLen - this.pos, len - pos);
          for (let i = 0; i < take; i++)
            state[this.pos++] ^= data[pos++];
          if (this.pos === blockLen)
            this.keccak();
        }
        return this;
      }
      finish() {
        if (this.finished)
          return;
        this.finished = true;
        const { state, suffix, pos, blockLen } = this;
        state[pos] ^= suffix;
        if ((suffix & 128) !== 0 && pos === blockLen - 1)
          this.keccak();
        state[blockLen - 1] ^= 128;
        this.keccak();
      }
      writeInto(out) {
        (0, _assert_js_1.exists)(this, false);
        (0, _assert_js_1.bytes)(out);
        this.finish();
        const bufferOut = this.state;
        const { blockLen } = this;
        for (let pos = 0, len = out.length; pos < len; ) {
          if (this.posOut >= blockLen)
            this.keccak();
          const take = Math.min(blockLen - this.posOut, len - pos);
          out.set(bufferOut.subarray(this.posOut, this.posOut + take), pos);
          this.posOut += take;
          pos += take;
        }
        return out;
      }
      xofInto(out) {
        if (!this.enableXOF)
          throw new Error("XOF is not possible for this instance");
        return this.writeInto(out);
      }
      xof(bytes2) {
        (0, _assert_js_1.number)(bytes2);
        return this.xofInto(new Uint8Array(bytes2));
      }
      digestInto(out) {
        (0, _assert_js_1.output)(out, this);
        if (this.finished)
          throw new Error("digest() was already called");
        this.writeInto(out);
        this.destroy();
        return out;
      }
      digest() {
        return this.digestInto(new Uint8Array(this.outputLen));
      }
      destroy() {
        this.destroyed = true;
        this.state.fill(0);
      }
      _cloneInto(to) {
        const { blockLen, suffix, outputLen, rounds, enableXOF } = this;
        to || (to = new _Keccak(blockLen, suffix, outputLen, enableXOF, rounds));
        to.state32.set(this.state32);
        to.pos = this.pos;
        to.posOut = this.posOut;
        to.finished = this.finished;
        to.rounds = rounds;
        to.suffix = suffix;
        to.outputLen = outputLen;
        to.enableXOF = enableXOF;
        to.destroyed = this.destroyed;
        return to;
      }
    };
    exports.Keccak = Keccak2;
    var gen2 = (suffix, blockLen, outputLen) => (0, utils_js_1.wrapConstructor)(() => new Keccak2(blockLen, suffix, outputLen));
    exports.sha3_224 = gen2(6, 144, 224 / 8);
    exports.sha3_256 = gen2(6, 136, 256 / 8);
    exports.sha3_384 = gen2(6, 104, 384 / 8);
    exports.sha3_512 = gen2(6, 72, 512 / 8);
    exports.keccak_224 = gen2(1, 144, 224 / 8);
    exports.keccak_256 = gen2(1, 136, 256 / 8);
    exports.keccak_384 = gen2(1, 104, 384 / 8);
    exports.keccak_512 = gen2(1, 72, 512 / 8);
    var genShake2 = (suffix, blockLen, outputLen) => (0, utils_js_1.wrapXOFConstructorWithOpts)((opts = {}) => new Keccak2(blockLen, suffix, opts.dkLen === void 0 ? outputLen : opts.dkLen, true));
    exports.shake128 = genShake2(31, 168, 128 / 8);
    exports.shake256 = genShake2(31, 136, 256 / 8);
  }
});

// node_modules/viem/_cjs/utils/hash/keccak256.js
var require_keccak256 = __commonJS({
  "node_modules/viem/_cjs/utils/hash/keccak256.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.keccak256 = void 0;
    var sha3_1 = require_sha3();
    var isHex_js_1 = require_isHex();
    var toBytes_js_1 = require_toBytes();
    var toHex_js_1 = require_toHex();
    function keccak2562(value, to_) {
      const to = to_ || "hex";
      const bytes2 = (0, sha3_1.keccak_256)((0, isHex_js_1.isHex)(value, { strict: false }) ? (0, toBytes_js_1.toBytes)(value) : value);
      if (to === "bytes")
        return bytes2;
      return (0, toHex_js_1.toHex)(bytes2);
    }
    exports.keccak256 = keccak2562;
  }
});

// node_modules/viem/_cjs/utils/hash/getEventSelector.js
var require_getEventSelector = __commonJS({
  "node_modules/viem/_cjs/utils/hash/getEventSelector.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getEventSelector = void 0;
    var toBytes_js_1 = require_toBytes();
    var getEventSignature_js_1 = require_getEventSignature();
    var keccak256_js_1 = require_keccak256();
    var hash2 = (value) => (0, keccak256_js_1.keccak256)((0, toBytes_js_1.toBytes)(value));
    var getEventSelector = (fn) => hash2((0, getEventSignature_js_1.getEventSignature)(fn));
    exports.getEventSelector = getEventSelector;
  }
});

// node_modules/viem/_cjs/errors/address.js
var require_address = __commonJS({
  "node_modules/viem/_cjs/errors/address.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InvalidAddressError = void 0;
    var base_js_1 = require_base();
    var InvalidAddressError = class extends base_js_1.BaseError {
      constructor({ address }) {
        super(`Address "${address}" is invalid.`);
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidAddressError"
        });
      }
    };
    exports.InvalidAddressError = InvalidAddressError;
  }
});

// node_modules/viem/_cjs/utils/address/isAddress.js
var require_isAddress = __commonJS({
  "node_modules/viem/_cjs/utils/address/isAddress.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isAddress = void 0;
    var addressRegex = /^0x[a-fA-F0-9]{40}$/;
    function isAddress(address) {
      return addressRegex.test(address);
    }
    exports.isAddress = isAddress;
  }
});

// node_modules/viem/_cjs/utils/data/concat.js
var require_concat = __commonJS({
  "node_modules/viem/_cjs/utils/data/concat.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.concatHex = exports.concatBytes = exports.concat = void 0;
    function concat(values) {
      if (typeof values[0] === "string")
        return concatHex(values);
      return concatBytes(values);
    }
    exports.concat = concat;
    function concatBytes(values) {
      let length = 0;
      for (const arr of values) {
        length += arr.length;
      }
      const result = new Uint8Array(length);
      let offset = 0;
      for (const arr of values) {
        result.set(arr, offset);
        offset += arr.length;
      }
      return result;
    }
    exports.concatBytes = concatBytes;
    function concatHex(values) {
      return `0x${values.reduce((acc, x) => acc + x.replace("0x", ""), "")}`;
    }
    exports.concatHex = concatHex;
  }
});

// node_modules/viem/_cjs/utils/data/slice.js
var require_slice = __commonJS({
  "node_modules/viem/_cjs/utils/data/slice.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.sliceHex = exports.sliceBytes = exports.slice = void 0;
    var data_js_1 = require_data();
    var isHex_js_1 = require_isHex();
    var size_js_1 = require_size();
    function slice2(value, start, end, { strict } = {}) {
      if ((0, isHex_js_1.isHex)(value, { strict: false }))
        return sliceHex2(value, start, end, {
          strict
        });
      return sliceBytes2(value, start, end, {
        strict
      });
    }
    exports.slice = slice2;
    function assertStartOffset2(value, start) {
      if (typeof start === "number" && start > 0 && start > (0, size_js_1.size)(value) - 1)
        throw new data_js_1.SliceOffsetOutOfBoundsError({
          offset: start,
          position: "start",
          size: (0, size_js_1.size)(value)
        });
    }
    function assertEndOffset2(value, start, end) {
      if (typeof start === "number" && typeof end === "number" && (0, size_js_1.size)(value) !== end - start) {
        throw new data_js_1.SliceOffsetOutOfBoundsError({
          offset: end,
          position: "end",
          size: (0, size_js_1.size)(value)
        });
      }
    }
    function sliceBytes2(value_, start, end, { strict } = {}) {
      assertStartOffset2(value_, start);
      const value = value_.slice(start, end);
      if (strict)
        assertEndOffset2(value, start, end);
      return value;
    }
    exports.sliceBytes = sliceBytes2;
    function sliceHex2(value_, start, end, { strict } = {}) {
      assertStartOffset2(value_, start);
      const value = `0x${value_.replace("0x", "").slice((start ?? 0) * 2, (end ?? value_.length) * 2)}`;
      if (strict)
        assertEndOffset2(value, start, end);
      return value;
    }
    exports.sliceHex = sliceHex2;
  }
});

// node_modules/viem/_cjs/utils/abi/encodeAbiParameters.js
var require_encodeAbiParameters = __commonJS({
  "node_modules/viem/_cjs/utils/abi/encodeAbiParameters.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getArrayComponents = exports.encodeAbiParameters = void 0;
    var abi_js_1 = require_abi();
    var address_js_1 = require_address();
    var isAddress_js_1 = require_isAddress();
    var concat_js_1 = require_concat();
    var pad_js_1 = require_pad();
    var size_js_1 = require_size();
    var slice_js_1 = require_slice();
    var toHex_js_1 = require_toHex();
    function encodeAbiParameters(params, values) {
      if (params.length !== values.length)
        throw new abi_js_1.AbiEncodingLengthMismatchError({
          expectedLength: params.length,
          givenLength: values.length
        });
      const preparedParams = prepareParams({
        params,
        values
      });
      const data = encodeParams(preparedParams);
      if (data.length === 0)
        return "0x";
      return data;
    }
    exports.encodeAbiParameters = encodeAbiParameters;
    function prepareParams({ params, values }) {
      const preparedParams = [];
      for (let i = 0; i < params.length; i++) {
        preparedParams.push(prepareParam({ param: params[i], value: values[i] }));
      }
      return preparedParams;
    }
    function prepareParam({ param, value }) {
      const arrayComponents = getArrayComponents2(param.type);
      if (arrayComponents) {
        const [length, type] = arrayComponents;
        return encodeArray(value, { length, param: { ...param, type } });
      }
      if (param.type === "tuple") {
        return encodeTuple(value, {
          param
        });
      }
      if (param.type === "address") {
        return encodeAddress(value);
      }
      if (param.type === "bool") {
        return encodeBool(value);
      }
      if (param.type.startsWith("uint") || param.type.startsWith("int")) {
        const signed = param.type.startsWith("int");
        return encodeNumber(value, { signed });
      }
      if (param.type.startsWith("bytes")) {
        return encodeBytes(value, { param });
      }
      if (param.type === "string") {
        return encodeString(value);
      }
      throw new abi_js_1.InvalidAbiEncodingTypeError(param.type, {
        docsPath: "/docs/contract/encodeAbiParameters"
      });
    }
    function encodeParams(preparedParams) {
      let staticSize = 0;
      for (let i = 0; i < preparedParams.length; i++) {
        const { dynamic, encoded } = preparedParams[i];
        if (dynamic)
          staticSize += 32;
        else
          staticSize += (0, size_js_1.size)(encoded);
      }
      const staticParams = [];
      const dynamicParams = [];
      let dynamicSize = 0;
      for (let i = 0; i < preparedParams.length; i++) {
        const { dynamic, encoded } = preparedParams[i];
        if (dynamic) {
          staticParams.push((0, toHex_js_1.numberToHex)(staticSize + dynamicSize, { size: 32 }));
          dynamicParams.push(encoded);
          dynamicSize += (0, size_js_1.size)(encoded);
        } else {
          staticParams.push(encoded);
        }
      }
      return (0, concat_js_1.concat)([...staticParams, ...dynamicParams]);
    }
    function encodeAddress(value) {
      if (!(0, isAddress_js_1.isAddress)(value))
        throw new address_js_1.InvalidAddressError({ address: value });
      return { dynamic: false, encoded: (0, pad_js_1.padHex)(value.toLowerCase()) };
    }
    function encodeArray(value, { length, param }) {
      const dynamic = length === null;
      if (!Array.isArray(value))
        throw new abi_js_1.InvalidArrayError(value);
      if (!dynamic && value.length !== length)
        throw new abi_js_1.AbiEncodingArrayLengthMismatchError({
          expectedLength: length,
          givenLength: value.length,
          type: `${param.type}[${length}]`
        });
      let dynamicChild = false;
      const preparedParams = [];
      for (let i = 0; i < value.length; i++) {
        const preparedParam = prepareParam({ param, value: value[i] });
        if (preparedParam.dynamic)
          dynamicChild = true;
        preparedParams.push(preparedParam);
      }
      if (dynamic || dynamicChild) {
        const data = encodeParams(preparedParams);
        if (dynamic) {
          const length2 = (0, toHex_js_1.numberToHex)(preparedParams.length, { size: 32 });
          return {
            dynamic: true,
            encoded: preparedParams.length > 0 ? (0, concat_js_1.concat)([length2, data]) : length2
          };
        }
        if (dynamicChild)
          return { dynamic: true, encoded: data };
      }
      return {
        dynamic: false,
        encoded: (0, concat_js_1.concat)(preparedParams.map(({ encoded }) => encoded))
      };
    }
    function encodeBytes(value, { param }) {
      const [, paramSize] = param.type.split("bytes");
      const bytesSize = (0, size_js_1.size)(value);
      if (!paramSize) {
        let value_ = value;
        if (bytesSize % 32 !== 0)
          value_ = (0, pad_js_1.padHex)(value_, {
            dir: "right",
            size: Math.ceil((value.length - 2) / 2 / 32) * 32
          });
        return {
          dynamic: true,
          encoded: (0, concat_js_1.concat)([(0, pad_js_1.padHex)((0, toHex_js_1.numberToHex)(bytesSize, { size: 32 })), value_])
        };
      }
      if (bytesSize !== parseInt(paramSize))
        throw new abi_js_1.AbiEncodingBytesSizeMismatchError({
          expectedSize: parseInt(paramSize),
          value
        });
      return { dynamic: false, encoded: (0, pad_js_1.padHex)(value, { dir: "right" }) };
    }
    function encodeBool(value) {
      return { dynamic: false, encoded: (0, pad_js_1.padHex)((0, toHex_js_1.boolToHex)(value)) };
    }
    function encodeNumber(value, { signed }) {
      return {
        dynamic: false,
        encoded: (0, toHex_js_1.numberToHex)(value, {
          size: 32,
          signed
        })
      };
    }
    function encodeString(value) {
      const hexValue = (0, toHex_js_1.stringToHex)(value);
      const partsLength = Math.ceil((0, size_js_1.size)(hexValue) / 32);
      const parts = [];
      for (let i = 0; i < partsLength; i++) {
        parts.push((0, pad_js_1.padHex)((0, slice_js_1.slice)(hexValue, i * 32, (i + 1) * 32), {
          dir: "right"
        }));
      }
      return {
        dynamic: true,
        encoded: (0, concat_js_1.concat)([
          (0, pad_js_1.padHex)((0, toHex_js_1.numberToHex)((0, size_js_1.size)(hexValue), { size: 32 })),
          ...parts
        ])
      };
    }
    function encodeTuple(value, { param }) {
      let dynamic = false;
      const preparedParams = [];
      for (let i = 0; i < param.components.length; i++) {
        const param_ = param.components[i];
        const index = Array.isArray(value) ? i : param_.name;
        const preparedParam = prepareParam({
          param: param_,
          value: value[index]
        });
        preparedParams.push(preparedParam);
        if (preparedParam.dynamic)
          dynamic = true;
      }
      return {
        dynamic,
        encoded: dynamic ? encodeParams(preparedParams) : (0, concat_js_1.concat)(preparedParams.map(({ encoded }) => encoded))
      };
    }
    function getArrayComponents2(type) {
      const matches = type.match(/^(.*)\[(\d+)?\]$/);
      return matches ? [matches[2] ? Number(matches[2]) : null, matches[1]] : void 0;
    }
    exports.getArrayComponents = getArrayComponents2;
  }
});

// node_modules/viem/_cjs/utils/hash/getFunctionSelector.js
var require_getFunctionSelector = __commonJS({
  "node_modules/viem/_cjs/utils/hash/getFunctionSelector.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getFunctionSelector = void 0;
    var slice_js_1 = require_slice();
    var toBytes_js_1 = require_toBytes();
    var getFunctionSignature_js_1 = require_getFunctionSignature();
    var keccak256_js_1 = require_keccak256();
    var hash2 = (value) => (0, keccak256_js_1.keccak256)((0, toBytes_js_1.toBytes)(value));
    var getFunctionSelector2 = (fn) => (0, slice_js_1.slice)(hash2((0, getFunctionSignature_js_1.getFunctionSignature)(fn)), 0, 4);
    exports.getFunctionSelector = getFunctionSelector2;
  }
});

// node_modules/viem/_cjs/utils/abi/getAbiItem.js
var require_getAbiItem = __commonJS({
  "node_modules/viem/_cjs/utils/abi/getAbiItem.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isArgOfType = exports.getAbiItem = void 0;
    var isHex_js_1 = require_isHex();
    var getEventSelector_js_1 = require_getEventSelector();
    var getFunctionSelector_js_1 = require_getFunctionSelector();
    var isAddress_js_1 = require_isAddress();
    function getAbiItem({ abi: abi2, args = [], name }) {
      const isSelector = (0, isHex_js_1.isHex)(name, { strict: false });
      const abiItems = abi2.filter((abiItem) => {
        if (isSelector) {
          if (abiItem.type === "function")
            return (0, getFunctionSelector_js_1.getFunctionSelector)(abiItem) === name;
          if (abiItem.type === "event")
            return (0, getEventSelector_js_1.getEventSelector)(abiItem) === name;
          return false;
        }
        return "name" in abiItem && abiItem.name === name;
      });
      if (abiItems.length === 0)
        return void 0;
      if (abiItems.length === 1)
        return abiItems[0];
      for (const abiItem of abiItems) {
        if (!("inputs" in abiItem))
          continue;
        if (!args || args.length === 0) {
          if (!abiItem.inputs || abiItem.inputs.length === 0)
            return abiItem;
          continue;
        }
        if (!abiItem.inputs)
          continue;
        if (abiItem.inputs.length === 0)
          continue;
        if (abiItem.inputs.length !== args.length)
          continue;
        const matched = args.every((arg, index) => {
          const abiParameter = "inputs" in abiItem && abiItem.inputs[index];
          if (!abiParameter)
            return false;
          return isArgOfType(arg, abiParameter);
        });
        if (matched)
          return abiItem;
      }
      return abiItems[0];
    }
    exports.getAbiItem = getAbiItem;
    function isArgOfType(arg, abiParameter) {
      const argType = typeof arg;
      const abiParameterType = abiParameter.type;
      switch (abiParameterType) {
        case "address":
          return (0, isAddress_js_1.isAddress)(arg);
        case "bool":
          return argType === "boolean";
        case "function":
          return argType === "string";
        case "string":
          return argType === "string";
        default: {
          if (abiParameterType === "tuple" && "components" in abiParameter)
            return Object.values(abiParameter.components).every((component, index) => {
              return isArgOfType(Object.values(arg)[index], component);
            });
          if (/^u?int(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/.test(abiParameterType))
            return argType === "number" || argType === "bigint";
          if (/^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/.test(abiParameterType))
            return argType === "string" || arg instanceof Uint8Array;
          if (/[a-z]+[1-9]{0,3}(\[[0-9]{0,}\])+$/.test(abiParameterType)) {
            return Array.isArray(arg) && arg.every((x) => isArgOfType(x, {
              ...abiParameter,
              type: abiParameterType.replace(/(\[[0-9]{0,}\])$/, "")
            }));
          }
          return false;
        }
      }
    }
    exports.isArgOfType = isArgOfType;
  }
});

// node_modules/viem/_cjs/utils/abi/encodeEventTopics.js
var require_encodeEventTopics = __commonJS({
  "node_modules/viem/_cjs/utils/abi/encodeEventTopics.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.encodeEventTopics = void 0;
    var abi_js_1 = require_abi();
    var log_js_1 = require_log();
    var toBytes_js_1 = require_toBytes();
    var getEventSelector_js_1 = require_getEventSelector();
    var keccak256_js_1 = require_keccak256();
    var encodeAbiParameters_js_1 = require_encodeAbiParameters();
    var formatAbiItem_js_1 = require_formatAbiItem2();
    var getAbiItem_js_1 = require_getAbiItem();
    function encodeEventTopics({ abi: abi2, eventName, args }) {
      let abiItem = abi2[0];
      if (eventName) {
        abiItem = (0, getAbiItem_js_1.getAbiItem)({
          abi: abi2,
          args,
          name: eventName
        });
        if (!abiItem)
          throw new abi_js_1.AbiEventNotFoundError(eventName, {
            docsPath: "/docs/contract/encodeEventTopics"
          });
      }
      if (abiItem.type !== "event")
        throw new abi_js_1.AbiEventNotFoundError(void 0, {
          docsPath: "/docs/contract/encodeEventTopics"
        });
      const definition = (0, formatAbiItem_js_1.formatAbiItem)(abiItem);
      const signature = (0, getEventSelector_js_1.getEventSelector)(definition);
      let topics = [];
      if (args && "inputs" in abiItem) {
        const indexedInputs = abiItem.inputs?.filter((param) => "indexed" in param && param.indexed);
        const args_ = Array.isArray(args) ? args : Object.values(args).length > 0 ? indexedInputs?.map((x) => args[x.name]) ?? [] : [];
        if (args_.length > 0) {
          topics = indexedInputs?.map((param, i) => Array.isArray(args_[i]) ? args_[i].map((_, j) => encodeArg({ param, value: args_[i][j] })) : args_[i] ? encodeArg({ param, value: args_[i] }) : null) ?? [];
        }
      }
      return [signature, ...topics];
    }
    exports.encodeEventTopics = encodeEventTopics;
    function encodeArg({ param, value }) {
      if (param.type === "string" || param.type === "bytes")
        return (0, keccak256_js_1.keccak256)((0, toBytes_js_1.toBytes)(value));
      if (param.type === "tuple" || param.type.match(/^(.*)\[(\d+)?\]$/))
        throw new log_js_1.FilterTypeNotSupportedError(param.type);
      return (0, encodeAbiParameters_js_1.encodeAbiParameters)([param], [value]);
    }
  }
});

// node_modules/viem/_cjs/utils/filters/createFilterRequestScope.js
var require_createFilterRequestScope = __commonJS({
  "node_modules/viem/_cjs/utils/filters/createFilterRequestScope.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createFilterRequestScope = void 0;
    function createFilterRequestScope(client, { method }) {
      const requestMap = {};
      if (client.transport.type === "fallback")
        client.transport.onResponse?.(({ method: method_, response: id, status, transport }) => {
          if (status === "success" && method === method_)
            requestMap[id] = transport.request;
        });
      return (id) => requestMap[id] || client.request;
    }
    exports.createFilterRequestScope = createFilterRequestScope;
  }
});

// node_modules/viem/_cjs/actions/public/createContractEventFilter.js
var require_createContractEventFilter = __commonJS({
  "node_modules/viem/_cjs/actions/public/createContractEventFilter.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createContractEventFilter = void 0;
    var encodeEventTopics_js_1 = require_encodeEventTopics();
    var toHex_js_1 = require_toHex();
    var createFilterRequestScope_js_1 = require_createFilterRequestScope();
    async function createContractEventFilter(client, { address, abi: abi2, args, eventName, fromBlock, strict, toBlock }) {
      const getRequest = (0, createFilterRequestScope_js_1.createFilterRequestScope)(client, {
        method: "eth_newFilter"
      });
      const topics = eventName ? (0, encodeEventTopics_js_1.encodeEventTopics)({
        abi: abi2,
        args,
        eventName
      }) : void 0;
      const id = await client.request({
        method: "eth_newFilter",
        params: [
          {
            address,
            fromBlock: typeof fromBlock === "bigint" ? (0, toHex_js_1.numberToHex)(fromBlock) : fromBlock,
            toBlock: typeof toBlock === "bigint" ? (0, toHex_js_1.numberToHex)(toBlock) : toBlock,
            topics
          }
        ]
      });
      return {
        abi: abi2,
        args,
        eventName,
        id,
        request: getRequest(id),
        strict,
        type: "event"
      };
    }
    exports.createContractEventFilter = createContractEventFilter;
  }
});

// node_modules/viem/_cjs/accounts/utils/parseAccount.js
var require_parseAccount = __commonJS({
  "node_modules/viem/_cjs/accounts/utils/parseAccount.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseAccount = void 0;
    function parseAccount(account) {
      if (typeof account === "string")
        return { address: account, type: "json-rpc" };
      return account;
    }
    exports.parseAccount = parseAccount;
  }
});

// node_modules/viem/_cjs/utils/abi/encodeFunctionData.js
var require_encodeFunctionData = __commonJS({
  "node_modules/viem/_cjs/utils/abi/encodeFunctionData.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.encodeFunctionData = void 0;
    var abi_js_1 = require_abi();
    var concat_js_1 = require_concat();
    var getFunctionSelector_js_1 = require_getFunctionSelector();
    var encodeAbiParameters_js_1 = require_encodeAbiParameters();
    var formatAbiItem_js_1 = require_formatAbiItem2();
    var getAbiItem_js_1 = require_getAbiItem();
    function encodeFunctionData({ abi: abi2, args, functionName }) {
      let abiItem = abi2[0];
      if (functionName) {
        abiItem = (0, getAbiItem_js_1.getAbiItem)({
          abi: abi2,
          args,
          name: functionName
        });
        if (!abiItem)
          throw new abi_js_1.AbiFunctionNotFoundError(functionName, {
            docsPath: "/docs/contract/encodeFunctionData"
          });
      }
      if (abiItem.type !== "function")
        throw new abi_js_1.AbiFunctionNotFoundError(void 0, {
          docsPath: "/docs/contract/encodeFunctionData"
        });
      const definition = (0, formatAbiItem_js_1.formatAbiItem)(abiItem);
      const signature = (0, getFunctionSelector_js_1.getFunctionSelector)(definition);
      const data = "inputs" in abiItem && abiItem.inputs ? (0, encodeAbiParameters_js_1.encodeAbiParameters)(abiItem.inputs, args ?? []) : void 0;
      return (0, concat_js_1.concatHex)([signature, data ?? "0x"]);
    }
    exports.encodeFunctionData = encodeFunctionData;
  }
});

// node_modules/viem/_cjs/constants/solidity.js
var require_solidity = __commonJS({
  "node_modules/viem/_cjs/constants/solidity.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.solidityPanic = exports.solidityError = exports.panicReasons = void 0;
    exports.panicReasons = {
      1: "An `assert` condition failed.",
      17: "Arithmic operation resulted in underflow or overflow.",
      18: "Division or modulo by zero (e.g. `5 / 0` or `23 % 0`).",
      33: "Attempted to convert to an invalid type.",
      34: "Attempted to access a storage byte array that is incorrectly encoded.",
      49: "Performed `.pop()` on an empty array",
      50: "Array index is out of bounds.",
      65: "Allocated too much memory or created an array which is too large.",
      81: "Attempted to call a zero-initialized variable of internal function type."
    };
    exports.solidityError = {
      inputs: [
        {
          name: "message",
          type: "string"
        }
      ],
      name: "Error",
      type: "error"
    };
    exports.solidityPanic = {
      inputs: [
        {
          name: "reason",
          type: "uint256"
        }
      ],
      name: "Panic",
      type: "error"
    };
  }
});

// node_modules/viem/_cjs/utils/address/getAddress.js
var require_getAddress = __commonJS({
  "node_modules/viem/_cjs/utils/address/getAddress.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getAddress = exports.checksumAddress = void 0;
    var address_js_1 = require_address();
    var toBytes_js_1 = require_toBytes();
    var keccak256_js_1 = require_keccak256();
    var isAddress_js_1 = require_isAddress();
    function checksumAddress2(address_, chainId) {
      const hexAddress = chainId ? `${chainId}${address_.toLowerCase()}` : address_.substring(2).toLowerCase();
      const hash2 = (0, keccak256_js_1.keccak256)((0, toBytes_js_1.stringToBytes)(hexAddress), "bytes");
      const address = (chainId ? hexAddress.substring(`${chainId}0x`.length) : hexAddress).split("");
      for (let i = 0; i < 40; i += 2) {
        if (hash2[i >> 1] >> 4 >= 8 && address[i]) {
          address[i] = address[i].toUpperCase();
        }
        if ((hash2[i >> 1] & 15) >= 8 && address[i + 1]) {
          address[i + 1] = address[i + 1].toUpperCase();
        }
      }
      return `0x${address.join("")}`;
    }
    exports.checksumAddress = checksumAddress2;
    function getAddress(address, chainId) {
      if (!(0, isAddress_js_1.isAddress)(address))
        throw new address_js_1.InvalidAddressError({ address });
      return checksumAddress2(address, chainId);
    }
    exports.getAddress = getAddress;
  }
});

// node_modules/viem/_cjs/utils/abi/decodeAbiParameters.js
var require_decodeAbiParameters = __commonJS({
  "node_modules/viem/_cjs/utils/abi/decodeAbiParameters.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.decodeAbiParameters = void 0;
    var abi_js_1 = require_abi();
    var getAddress_js_1 = require_getAddress();
    var size_js_1 = require_size();
    var slice_js_1 = require_slice();
    var trim_js_1 = require_trim();
    var fromHex_js_1 = require_fromHex();
    var encodeAbiParameters_js_1 = require_encodeAbiParameters();
    function decodeAbiParameters2(params, data) {
      if (data === "0x" && params.length > 0)
        throw new abi_js_1.AbiDecodingZeroDataError();
      if ((0, size_js_1.size)(data) && (0, size_js_1.size)(data) < 32)
        throw new abi_js_1.AbiDecodingDataSizeTooSmallError({
          data,
          params,
          size: (0, size_js_1.size)(data)
        });
      return decodeParams2({
        data,
        params
      });
    }
    exports.decodeAbiParameters = decodeAbiParameters2;
    function decodeParams2({ data, params }) {
      const decodedValues = [];
      let position = 0;
      for (let i = 0; i < params.length; i++) {
        if (position >= (0, size_js_1.size)(data))
          throw new abi_js_1.AbiDecodingDataSizeTooSmallError({
            data,
            params,
            size: (0, size_js_1.size)(data)
          });
        const param = params[i];
        const { consumed, value } = decodeParam2({ data, param, position });
        decodedValues.push(value);
        position += consumed;
      }
      return decodedValues;
    }
    function decodeParam2({ data, param, position }) {
      const arrayComponents = (0, encodeAbiParameters_js_1.getArrayComponents)(param.type);
      if (arrayComponents) {
        const [length, type] = arrayComponents;
        return decodeArray2(data, {
          length,
          param: { ...param, type },
          position
        });
      }
      if (param.type === "tuple") {
        return decodeTuple2(data, { param, position });
      }
      if (param.type === "string") {
        return decodeString2(data, { position });
      }
      if (param.type.startsWith("bytes")) {
        return decodeBytes2(data, { param, position });
      }
      const value = (0, slice_js_1.slice)(data, position, position + 32, { strict: true });
      if (param.type.startsWith("uint") || param.type.startsWith("int")) {
        return decodeNumber2(value, { param });
      }
      if (param.type === "address") {
        return decodeAddress2(value);
      }
      if (param.type === "bool") {
        return decodeBool2(value);
      }
      throw new abi_js_1.InvalidAbiDecodingTypeError(param.type, {
        docsPath: "/docs/contract/decodeAbiParameters"
      });
    }
    function decodeAddress2(value) {
      return { consumed: 32, value: (0, getAddress_js_1.checksumAddress)((0, slice_js_1.slice)(value, -20)) };
    }
    function decodeArray2(data, { param, length, position }) {
      if (!length) {
        const offset = (0, fromHex_js_1.hexToNumber)((0, slice_js_1.slice)(data, position, position + 32, { strict: true }));
        const length2 = (0, fromHex_js_1.hexToNumber)((0, slice_js_1.slice)(data, offset, offset + 32, { strict: true }));
        let consumed2 = 0;
        const value2 = [];
        for (let i = 0; i < length2; ++i) {
          const decodedChild = decodeParam2({
            data: (0, slice_js_1.slice)(data, offset + 32),
            param,
            position: consumed2
          });
          consumed2 += decodedChild.consumed;
          value2.push(decodedChild.value);
        }
        return { value: value2, consumed: 32 };
      }
      if (hasDynamicChild2(param)) {
        const arrayComponents = (0, encodeAbiParameters_js_1.getArrayComponents)(param.type);
        const dynamicChild = !arrayComponents?.[0];
        let consumed2 = 0;
        const value2 = [];
        for (let i = 0; i < length; ++i) {
          const offset = (0, fromHex_js_1.hexToNumber)((0, slice_js_1.slice)(data, position, position + 32, { strict: true }));
          const decodedChild = decodeParam2({
            data: (0, slice_js_1.slice)(data, offset),
            param,
            position: dynamicChild ? consumed2 : i * 32
          });
          consumed2 += decodedChild.consumed;
          value2.push(decodedChild.value);
        }
        return { value: value2, consumed: 32 };
      }
      let consumed = 0;
      const value = [];
      for (let i = 0; i < length; ++i) {
        const decodedChild = decodeParam2({
          data,
          param,
          position: position + consumed
        });
        consumed += decodedChild.consumed;
        value.push(decodedChild.value);
      }
      return { value, consumed };
    }
    function decodeBool2(value) {
      return { consumed: 32, value: (0, fromHex_js_1.hexToBool)(value) };
    }
    function decodeBytes2(data, { param, position }) {
      const [_, size2] = param.type.split("bytes");
      if (!size2) {
        const offset = (0, fromHex_js_1.hexToNumber)((0, slice_js_1.slice)(data, position, position + 32, { strict: true }));
        const length = (0, fromHex_js_1.hexToNumber)((0, slice_js_1.slice)(data, offset, offset + 32, { strict: true }));
        if (length === 0)
          return { consumed: 32, value: "0x" };
        const value2 = (0, slice_js_1.slice)(data, offset + 32, offset + 32 + length, {
          strict: true
        });
        return { consumed: 32, value: value2 };
      }
      const value = (0, slice_js_1.slice)(data, position, position + parseInt(size2), {
        strict: true
      });
      return { consumed: 32, value };
    }
    function decodeNumber2(value, { param }) {
      const signed = param.type.startsWith("int");
      const size2 = parseInt(param.type.split("int")[1] || "256");
      return {
        consumed: 32,
        value: size2 > 48 ? (0, fromHex_js_1.hexToBigInt)(value, { signed }) : (0, fromHex_js_1.hexToNumber)(value, { signed })
      };
    }
    function decodeString2(data, { position }) {
      const offset = (0, fromHex_js_1.hexToNumber)((0, slice_js_1.slice)(data, position, position + 32, { strict: true }));
      const length = (0, fromHex_js_1.hexToNumber)((0, slice_js_1.slice)(data, offset, offset + 32, { strict: true }));
      if (length === 0)
        return { consumed: 32, value: "" };
      const value = (0, fromHex_js_1.hexToString)((0, trim_js_1.trim)((0, slice_js_1.slice)(data, offset + 32, offset + 32 + length, { strict: true })));
      return { consumed: 32, value };
    }
    function decodeTuple2(data, { param, position }) {
      const hasUnnamedChild = param.components.length === 0 || param.components.some(({ name }) => !name);
      const value = hasUnnamedChild ? [] : {};
      let consumed = 0;
      if (hasDynamicChild2(param)) {
        const offset = (0, fromHex_js_1.hexToNumber)((0, slice_js_1.slice)(data, position, position + 32, { strict: true }));
        for (let i = 0; i < param.components.length; ++i) {
          const component = param.components[i];
          const decodedChild = decodeParam2({
            data: (0, slice_js_1.slice)(data, offset),
            param: component,
            position: consumed
          });
          consumed += decodedChild.consumed;
          value[hasUnnamedChild ? i : component?.name] = decodedChild.value;
        }
        return { consumed: 32, value };
      }
      for (let i = 0; i < param.components.length; ++i) {
        const component = param.components[i];
        const decodedChild = decodeParam2({
          data,
          param: component,
          position: position + consumed
        });
        consumed += decodedChild.consumed;
        value[hasUnnamedChild ? i : component?.name] = decodedChild.value;
      }
      return { consumed, value };
    }
    function hasDynamicChild2(param) {
      const { type } = param;
      if (type === "string")
        return true;
      if (type === "bytes")
        return true;
      if (type.endsWith("[]"))
        return true;
      if (type === "tuple")
        return param.components?.some(hasDynamicChild2);
      const arrayComponents = (0, encodeAbiParameters_js_1.getArrayComponents)(param.type);
      if (arrayComponents && hasDynamicChild2({ ...param, type: arrayComponents[1] }))
        return true;
      return false;
    }
  }
});

// node_modules/viem/_cjs/utils/abi/decodeErrorResult.js
var require_decodeErrorResult = __commonJS({
  "node_modules/viem/_cjs/utils/abi/decodeErrorResult.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.decodeErrorResult = void 0;
    var solidity_js_1 = require_solidity();
    var abi_js_1 = require_abi();
    var slice_js_1 = require_slice();
    var getFunctionSelector_js_1 = require_getFunctionSelector();
    var decodeAbiParameters_js_1 = require_decodeAbiParameters();
    var formatAbiItem_js_1 = require_formatAbiItem2();
    function decodeErrorResult({ abi: abi2, data }) {
      const signature = (0, slice_js_1.slice)(data, 0, 4);
      if (signature === "0x")
        throw new abi_js_1.AbiDecodingZeroDataError();
      const abi_ = [...abi2 || [], solidity_js_1.solidityError, solidity_js_1.solidityPanic];
      const abiItem = abi_.find((x) => x.type === "error" && signature === (0, getFunctionSelector_js_1.getFunctionSelector)((0, formatAbiItem_js_1.formatAbiItem)(x)));
      if (!abiItem)
        throw new abi_js_1.AbiErrorSignatureNotFoundError(signature, {
          docsPath: "/docs/contract/decodeErrorResult"
        });
      return {
        abiItem,
        args: "inputs" in abiItem && abiItem.inputs && abiItem.inputs.length > 0 ? (0, decodeAbiParameters_js_1.decodeAbiParameters)(abiItem.inputs, (0, slice_js_1.slice)(data, 4)) : void 0,
        errorName: abiItem.name
      };
    }
    exports.decodeErrorResult = decodeErrorResult;
  }
});

// node_modules/viem/_cjs/utils/stringify.js
var require_stringify = __commonJS({
  "node_modules/viem/_cjs/utils/stringify.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.stringify = void 0;
    var stringify = (value, replacer, space) => JSON.stringify(value, (key, value_) => {
      const value2 = typeof value_ === "bigint" ? value_.toString() : value_;
      return typeof replacer === "function" ? replacer(key, value2) : value2;
    }, space);
    exports.stringify = stringify;
  }
});

// node_modules/viem/_cjs/utils/abi/formatAbiItemWithArgs.js
var require_formatAbiItemWithArgs = __commonJS({
  "node_modules/viem/_cjs/utils/abi/formatAbiItemWithArgs.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.formatAbiItemWithArgs = void 0;
    var stringify_js_1 = require_stringify();
    function formatAbiItemWithArgs({ abiItem, args, includeFunctionName = true, includeName = false }) {
      if (!("name" in abiItem))
        return;
      if (!("inputs" in abiItem))
        return;
      if (!abiItem.inputs)
        return;
      return `${includeFunctionName ? abiItem.name : ""}(${abiItem.inputs.map((input, i) => `${includeName && input.name ? `${input.name}: ` : ""}${typeof args[i] === "object" ? (0, stringify_js_1.stringify)(args[i]) : args[i]}`).join(", ")})`;
    }
    exports.formatAbiItemWithArgs = formatAbiItemWithArgs;
  }
});

// node_modules/viem/_cjs/constants/unit.js
var require_unit = __commonJS({
  "node_modules/viem/_cjs/constants/unit.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.weiUnits = exports.gweiUnits = exports.etherUnits = void 0;
    exports.etherUnits = {
      gwei: 9,
      wei: 18
    };
    exports.gweiUnits = {
      ether: -9,
      wei: 9
    };
    exports.weiUnits = {
      ether: -18,
      gwei: -9
    };
  }
});

// node_modules/viem/_cjs/utils/unit/formatUnits.js
var require_formatUnits = __commonJS({
  "node_modules/viem/_cjs/utils/unit/formatUnits.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.formatUnits = void 0;
    function formatUnits(value, decimals) {
      let display = value.toString();
      const negative = display.startsWith("-");
      if (negative)
        display = display.slice(1);
      display = display.padStart(decimals, "0");
      let [integer, fraction] = [
        display.slice(0, display.length - decimals),
        display.slice(display.length - decimals)
      ];
      fraction = fraction.replace(/(0+)$/, "");
      return `${negative ? "-" : ""}${integer || "0"}${fraction ? `.${fraction}` : ""}`;
    }
    exports.formatUnits = formatUnits;
  }
});

// node_modules/viem/_cjs/utils/unit/formatEther.js
var require_formatEther = __commonJS({
  "node_modules/viem/_cjs/utils/unit/formatEther.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.formatEther = void 0;
    var unit_js_1 = require_unit();
    var formatUnits_js_1 = require_formatUnits();
    function formatEther(wei, unit = "wei") {
      return (0, formatUnits_js_1.formatUnits)(wei, unit_js_1.etherUnits[unit]);
    }
    exports.formatEther = formatEther;
  }
});

// node_modules/viem/_cjs/utils/unit/formatGwei.js
var require_formatGwei = __commonJS({
  "node_modules/viem/_cjs/utils/unit/formatGwei.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.formatGwei = void 0;
    var unit_js_1 = require_unit();
    var formatUnits_js_1 = require_formatUnits();
    function formatGwei(wei, unit = "wei") {
      return (0, formatUnits_js_1.formatUnits)(wei, unit_js_1.gweiUnits[unit]);
    }
    exports.formatGwei = formatGwei;
  }
});

// node_modules/viem/_cjs/errors/transaction.js
var require_transaction = __commonJS({
  "node_modules/viem/_cjs/errors/transaction.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WaitForTransactionReceiptTimeoutError = exports.TransactionReceiptNotFoundError = exports.TransactionNotFoundError = exports.TransactionExecutionError = exports.InvalidStorageKeySizeError = exports.InvalidSerializedTransactionError = exports.InvalidSerializedTransactionTypeError = exports.InvalidSerializableTransactionError = exports.InvalidLegacyVError = exports.FeeConflictError = exports.prettyPrint = void 0;
    var formatEther_js_1 = require_formatEther();
    var formatGwei_js_1 = require_formatGwei();
    var base_js_1 = require_base();
    function prettyPrint(args) {
      const entries = Object.entries(args).map(([key, value]) => {
        if (value === void 0 || value === false)
          return null;
        return [key, value];
      }).filter(Boolean);
      const maxLength = entries.reduce((acc, [key]) => Math.max(acc, key.length), 0);
      return entries.map(([key, value]) => `  ${`${key}:`.padEnd(maxLength + 1)}  ${value}`).join("\n");
    }
    exports.prettyPrint = prettyPrint;
    var FeeConflictError = class extends base_js_1.BaseError {
      constructor() {
        super([
          "Cannot specify both a `gasPrice` and a `maxFeePerGas`/`maxPriorityFeePerGas`.",
          "Use `maxFeePerGas`/`maxPriorityFeePerGas` for EIP-1559 compatible networks, and `gasPrice` for others."
        ].join("\n"));
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "FeeConflictError"
        });
      }
    };
    exports.FeeConflictError = FeeConflictError;
    var InvalidLegacyVError = class extends base_js_1.BaseError {
      constructor({ v }) {
        super(`Invalid \`v\` value "${v}". Expected 27 or 28.`);
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidLegacyVError"
        });
      }
    };
    exports.InvalidLegacyVError = InvalidLegacyVError;
    var InvalidSerializableTransactionError = class extends base_js_1.BaseError {
      constructor({ transaction }) {
        super("Cannot infer a transaction type from provided transaction.", {
          metaMessages: [
            "Provided Transaction:",
            "{",
            prettyPrint(transaction),
            "}",
            "",
            "To infer the type, either provide:",
            "- a `type` to the Transaction, or",
            "- an EIP-1559 Transaction with `maxFeePerGas`, or",
            "- an EIP-2930 Transaction with `gasPrice` & `accessList`, or",
            "- a Legacy Transaction with `gasPrice`"
          ]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidSerializableTransactionError"
        });
      }
    };
    exports.InvalidSerializableTransactionError = InvalidSerializableTransactionError;
    var InvalidSerializedTransactionTypeError = class extends base_js_1.BaseError {
      constructor({ serializedType }) {
        super(`Serialized transaction type "${serializedType}" is invalid.`);
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidSerializedTransactionType"
        });
        Object.defineProperty(this, "serializedType", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.serializedType = serializedType;
      }
    };
    exports.InvalidSerializedTransactionTypeError = InvalidSerializedTransactionTypeError;
    var InvalidSerializedTransactionError = class extends base_js_1.BaseError {
      constructor({ attributes, serializedTransaction, type }) {
        const missing = Object.entries(attributes).map(([key, value]) => typeof value === "undefined" ? key : void 0).filter(Boolean);
        super(`Invalid serialized transaction of type "${type}" was provided.`, {
          metaMessages: [
            `Serialized Transaction: "${serializedTransaction}"`,
            missing.length > 0 ? `Missing Attributes: ${missing.join(", ")}` : ""
          ].filter(Boolean)
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidSerializedTransactionError"
        });
        Object.defineProperty(this, "serializedTransaction", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "type", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.serializedTransaction = serializedTransaction;
        this.type = type;
      }
    };
    exports.InvalidSerializedTransactionError = InvalidSerializedTransactionError;
    var InvalidStorageKeySizeError = class extends base_js_1.BaseError {
      constructor({ storageKey }) {
        super(`Size for storage key "${storageKey}" is invalid. Expected 32 bytes. Got ${Math.floor((storageKey.length - 2) / 2)} bytes.`);
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidStorageKeySizeError"
        });
      }
    };
    exports.InvalidStorageKeySizeError = InvalidStorageKeySizeError;
    var TransactionExecutionError = class extends base_js_1.BaseError {
      constructor(cause, { account, docsPath, chain, data, gas, gasPrice, maxFeePerGas, maxPriorityFeePerGas, nonce, to, value }) {
        const prettyArgs = prettyPrint({
          chain: chain && `${chain?.name} (id: ${chain?.id})`,
          from: account?.address,
          to,
          value: typeof value !== "undefined" && `${(0, formatEther_js_1.formatEther)(value)} ${chain?.nativeCurrency.symbol || "ETH"}`,
          data,
          gas,
          gasPrice: typeof gasPrice !== "undefined" && `${(0, formatGwei_js_1.formatGwei)(gasPrice)} gwei`,
          maxFeePerGas: typeof maxFeePerGas !== "undefined" && `${(0, formatGwei_js_1.formatGwei)(maxFeePerGas)} gwei`,
          maxPriorityFeePerGas: typeof maxPriorityFeePerGas !== "undefined" && `${(0, formatGwei_js_1.formatGwei)(maxPriorityFeePerGas)} gwei`,
          nonce
        });
        super(cause.shortMessage, {
          cause,
          docsPath,
          metaMessages: [
            ...cause.metaMessages ? [...cause.metaMessages, " "] : [],
            "Request Arguments:",
            prettyArgs
          ].filter(Boolean)
        });
        Object.defineProperty(this, "cause", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "TransactionExecutionError"
        });
        this.cause = cause;
      }
    };
    exports.TransactionExecutionError = TransactionExecutionError;
    var TransactionNotFoundError = class extends base_js_1.BaseError {
      constructor({ blockHash, blockNumber, blockTag, hash: hash2, index }) {
        let identifier = "Transaction";
        if (blockTag && index !== void 0)
          identifier = `Transaction at block time "${blockTag}" at index "${index}"`;
        if (blockHash && index !== void 0)
          identifier = `Transaction at block hash "${blockHash}" at index "${index}"`;
        if (blockNumber && index !== void 0)
          identifier = `Transaction at block number "${blockNumber}" at index "${index}"`;
        if (hash2)
          identifier = `Transaction with hash "${hash2}"`;
        super(`${identifier} could not be found.`);
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "TransactionNotFoundError"
        });
      }
    };
    exports.TransactionNotFoundError = TransactionNotFoundError;
    var TransactionReceiptNotFoundError = class extends base_js_1.BaseError {
      constructor({ hash: hash2 }) {
        super(`Transaction receipt with hash "${hash2}" could not be found. The Transaction may not be processed on a block yet.`);
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "TransactionReceiptNotFoundError"
        });
      }
    };
    exports.TransactionReceiptNotFoundError = TransactionReceiptNotFoundError;
    var WaitForTransactionReceiptTimeoutError = class extends base_js_1.BaseError {
      constructor({ hash: hash2 }) {
        super(`Timed out while waiting for transaction with hash "${hash2}" to be confirmed.`);
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "WaitForTransactionReceiptTimeoutError"
        });
      }
    };
    exports.WaitForTransactionReceiptTimeoutError = WaitForTransactionReceiptTimeoutError;
  }
});

// node_modules/viem/_cjs/errors/contract.js
var require_contract = __commonJS({
  "node_modules/viem/_cjs/errors/contract.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RawContractError = exports.ContractFunctionZeroDataError = exports.ContractFunctionRevertedError = exports.ContractFunctionExecutionError = exports.CallExecutionError = void 0;
    var parseAccount_js_1 = require_parseAccount();
    var solidity_js_1 = require_solidity();
    var decodeErrorResult_js_1 = require_decodeErrorResult();
    var formatAbiItem_js_1 = require_formatAbiItem2();
    var formatAbiItemWithArgs_js_1 = require_formatAbiItemWithArgs();
    var getAbiItem_js_1 = require_getAbiItem();
    var formatEther_js_1 = require_formatEther();
    var formatGwei_js_1 = require_formatGwei();
    var abi_js_1 = require_abi();
    var base_js_1 = require_base();
    var transaction_js_1 = require_transaction();
    var utils_js_1 = require_utils2();
    var CallExecutionError = class extends base_js_1.BaseError {
      constructor(cause, { account: account_, docsPath, chain, data, gas, gasPrice, maxFeePerGas, maxPriorityFeePerGas, nonce, to, value }) {
        const account = account_ ? (0, parseAccount_js_1.parseAccount)(account_) : void 0;
        const prettyArgs = (0, transaction_js_1.prettyPrint)({
          from: account?.address,
          to,
          value: typeof value !== "undefined" && `${(0, formatEther_js_1.formatEther)(value)} ${chain?.nativeCurrency.symbol || "ETH"}`,
          data,
          gas,
          gasPrice: typeof gasPrice !== "undefined" && `${(0, formatGwei_js_1.formatGwei)(gasPrice)} gwei`,
          maxFeePerGas: typeof maxFeePerGas !== "undefined" && `${(0, formatGwei_js_1.formatGwei)(maxFeePerGas)} gwei`,
          maxPriorityFeePerGas: typeof maxPriorityFeePerGas !== "undefined" && `${(0, formatGwei_js_1.formatGwei)(maxPriorityFeePerGas)} gwei`,
          nonce
        });
        super(cause.shortMessage, {
          cause,
          docsPath,
          metaMessages: [
            ...cause.metaMessages ? [...cause.metaMessages, " "] : [],
            "Raw Call Arguments:",
            prettyArgs
          ].filter(Boolean)
        });
        Object.defineProperty(this, "cause", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "CallExecutionError"
        });
        this.cause = cause;
      }
    };
    exports.CallExecutionError = CallExecutionError;
    var ContractFunctionExecutionError = class extends base_js_1.BaseError {
      constructor(cause, { abi: abi2, args, contractAddress, docsPath, functionName, sender }) {
        const abiItem = (0, getAbiItem_js_1.getAbiItem)({ abi: abi2, args, name: functionName });
        const formattedArgs = abiItem ? (0, formatAbiItemWithArgs_js_1.formatAbiItemWithArgs)({
          abiItem,
          args,
          includeFunctionName: false,
          includeName: false
        }) : void 0;
        const functionWithParams = abiItem ? (0, formatAbiItem_js_1.formatAbiItem)(abiItem, { includeName: true }) : void 0;
        const prettyArgs = (0, transaction_js_1.prettyPrint)({
          address: contractAddress && (0, utils_js_1.getContractAddress)(contractAddress),
          function: functionWithParams,
          args: formattedArgs && formattedArgs !== "()" && `${[...Array(functionName?.length ?? 0).keys()].map(() => " ").join("")}${formattedArgs}`,
          sender
        });
        super(cause.shortMessage || `An unknown error occurred while executing the contract function "${functionName}".`, {
          cause,
          docsPath,
          metaMessages: [
            ...cause.metaMessages ? [...cause.metaMessages, " "] : [],
            "Contract Call:",
            prettyArgs
          ].filter(Boolean)
        });
        Object.defineProperty(this, "abi", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "args", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "cause", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "contractAddress", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "formattedArgs", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "functionName", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "sender", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "ContractFunctionExecutionError"
        });
        this.abi = abi2;
        this.args = args;
        this.cause = cause;
        this.contractAddress = contractAddress;
        this.functionName = functionName;
        this.sender = sender;
      }
    };
    exports.ContractFunctionExecutionError = ContractFunctionExecutionError;
    var ContractFunctionRevertedError = class extends base_js_1.BaseError {
      constructor({ abi: abi2, data, functionName, message }) {
        let cause;
        let decodedData = void 0;
        let metaMessages;
        let reason;
        if (data && data !== "0x") {
          try {
            decodedData = (0, decodeErrorResult_js_1.decodeErrorResult)({ abi: abi2, data });
            const { abiItem, errorName, args: errorArgs } = decodedData;
            if (errorName === "Error") {
              reason = errorArgs[0];
            } else if (errorName === "Panic") {
              const [firstArg] = errorArgs;
              reason = solidity_js_1.panicReasons[firstArg];
            } else {
              const errorWithParams = abiItem ? (0, formatAbiItem_js_1.formatAbiItem)(abiItem, { includeName: true }) : void 0;
              const formattedArgs = abiItem && errorArgs ? (0, formatAbiItemWithArgs_js_1.formatAbiItemWithArgs)({
                abiItem,
                args: errorArgs,
                includeFunctionName: false,
                includeName: false
              }) : void 0;
              metaMessages = [
                errorWithParams ? `Error: ${errorWithParams}` : "",
                formattedArgs && formattedArgs !== "()" ? `       ${[...Array(errorName?.length ?? 0).keys()].map(() => " ").join("")}${formattedArgs}` : ""
              ];
            }
          } catch (err) {
            cause = err;
          }
        } else if (message)
          reason = message;
        let signature;
        if (cause instanceof abi_js_1.AbiErrorSignatureNotFoundError) {
          signature = cause.signature;
          metaMessages = [
            `Unable to decode signature "${signature}" as it was not found on the provided ABI.`,
            "Make sure you are using the correct ABI and that the error exists on it.",
            `You can look up the decoded signature here: https://openchain.xyz/signatures?query=${signature}.`
          ];
        }
        super(reason && reason !== "execution reverted" || signature ? [
          `The contract function "${functionName}" reverted with the following ${signature ? "signature" : "reason"}:`,
          reason || signature
        ].join("\n") : `The contract function "${functionName}" reverted.`, {
          cause,
          metaMessages
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "ContractFunctionRevertedError"
        });
        Object.defineProperty(this, "data", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "reason", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "signature", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.data = decodedData;
        this.reason = reason;
        this.signature = signature;
      }
    };
    exports.ContractFunctionRevertedError = ContractFunctionRevertedError;
    var ContractFunctionZeroDataError = class extends base_js_1.BaseError {
      constructor({ functionName }) {
        super(`The contract function "${functionName}" returned no data ("0x").`, {
          metaMessages: [
            "This could be due to any of the following:",
            `  - The contract does not have the function "${functionName}",`,
            "  - The parameters passed to the contract function may be invalid, or",
            "  - The address is not a contract."
          ]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "ContractFunctionZeroDataError"
        });
      }
    };
    exports.ContractFunctionZeroDataError = ContractFunctionZeroDataError;
    var RawContractError = class extends base_js_1.BaseError {
      constructor({ data, message }) {
        super(message || "");
        Object.defineProperty(this, "code", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: 3
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "RawContractError"
        });
        Object.defineProperty(this, "data", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.data = data;
      }
    };
    exports.RawContractError = RawContractError;
  }
});

// node_modules/viem/_cjs/errors/request.js
var require_request = __commonJS({
  "node_modules/viem/_cjs/errors/request.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TimeoutError = exports.RpcRequestError = exports.WebSocketRequestError = exports.HttpRequestError = void 0;
    var stringify_js_1 = require_stringify();
    var base_js_1 = require_base();
    var utils_js_1 = require_utils2();
    var HttpRequestError = class extends base_js_1.BaseError {
      constructor({ body, details, headers, status, url }) {
        super("HTTP request failed.", {
          details,
          metaMessages: [
            status && `Status: ${status}`,
            `URL: ${(0, utils_js_1.getUrl)(url)}`,
            body && `Request body: ${(0, stringify_js_1.stringify)(body)}`
          ].filter(Boolean)
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "HttpRequestError"
        });
        Object.defineProperty(this, "body", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "headers", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "status", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "url", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.body = body;
        this.headers = headers;
        this.status = status;
        this.url = url;
      }
    };
    exports.HttpRequestError = HttpRequestError;
    var WebSocketRequestError = class extends base_js_1.BaseError {
      constructor({ body, details, url }) {
        super("WebSocket request failed.", {
          details,
          metaMessages: [`URL: ${(0, utils_js_1.getUrl)(url)}`, `Request body: ${(0, stringify_js_1.stringify)(body)}`]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "WebSocketRequestError"
        });
      }
    };
    exports.WebSocketRequestError = WebSocketRequestError;
    var RpcRequestError = class extends base_js_1.BaseError {
      constructor({ body, error, url }) {
        super("RPC Request failed.", {
          cause: error,
          details: error.message,
          metaMessages: [`URL: ${(0, utils_js_1.getUrl)(url)}`, `Request body: ${(0, stringify_js_1.stringify)(body)}`]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "RpcRequestError"
        });
        Object.defineProperty(this, "code", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.code = error.code;
      }
    };
    exports.RpcRequestError = RpcRequestError;
    var TimeoutError = class extends base_js_1.BaseError {
      constructor({ body, url }) {
        super("The request took too long to respond.", {
          details: "The request timed out.",
          metaMessages: [`URL: ${(0, utils_js_1.getUrl)(url)}`, `Request body: ${(0, stringify_js_1.stringify)(body)}`]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "TimeoutError"
        });
      }
    };
    exports.TimeoutError = TimeoutError;
  }
});

// node_modules/viem/_cjs/errors/rpc.js
var require_rpc = __commonJS({
  "node_modules/viem/_cjs/errors/rpc.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UnknownRpcError = exports.SwitchChainError = exports.ChainDisconnectedError = exports.ProviderDisconnectedError = exports.UnsupportedProviderMethodError = exports.UnauthorizedProviderError = exports.UserRejectedRequestError = exports.JsonRpcVersionUnsupportedError = exports.LimitExceededRpcError = exports.MethodNotSupportedRpcError = exports.TransactionRejectedRpcError = exports.ResourceUnavailableRpcError = exports.ResourceNotFoundRpcError = exports.InvalidInputRpcError = exports.InternalRpcError = exports.InvalidParamsRpcError = exports.MethodNotFoundRpcError = exports.InvalidRequestRpcError = exports.ParseRpcError = exports.ProviderRpcError = exports.RpcError = void 0;
    var base_js_1 = require_base();
    var request_js_1 = require_request();
    var unknownErrorCode = -1;
    var RpcError = class extends base_js_1.BaseError {
      constructor(cause, { code, docsPath, metaMessages, shortMessage }) {
        super(shortMessage, {
          cause,
          docsPath,
          metaMessages: metaMessages || cause?.metaMessages
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "RpcError"
        });
        Object.defineProperty(this, "code", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.name = cause.name;
        this.code = cause instanceof request_js_1.RpcRequestError ? cause.code : code ?? unknownErrorCode;
      }
    };
    exports.RpcError = RpcError;
    var ProviderRpcError = class extends RpcError {
      constructor(cause, options) {
        super(cause, options);
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "ProviderRpcError"
        });
        Object.defineProperty(this, "data", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.data = options.data;
      }
    };
    exports.ProviderRpcError = ProviderRpcError;
    var ParseRpcError = class _ParseRpcError extends RpcError {
      constructor(cause) {
        super(cause, {
          code: _ParseRpcError.code,
          shortMessage: "Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text."
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "ParseRpcError"
        });
      }
    };
    Object.defineProperty(ParseRpcError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32700
    });
    exports.ParseRpcError = ParseRpcError;
    var InvalidRequestRpcError = class _InvalidRequestRpcError extends RpcError {
      constructor(cause) {
        super(cause, {
          code: _InvalidRequestRpcError.code,
          shortMessage: "JSON is not a valid request object."
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidRequestRpcError"
        });
      }
    };
    Object.defineProperty(InvalidRequestRpcError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32600
    });
    exports.InvalidRequestRpcError = InvalidRequestRpcError;
    var MethodNotFoundRpcError = class _MethodNotFoundRpcError extends RpcError {
      constructor(cause) {
        super(cause, {
          code: _MethodNotFoundRpcError.code,
          shortMessage: "The method does not exist / is not available."
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "MethodNotFoundRpcError"
        });
      }
    };
    Object.defineProperty(MethodNotFoundRpcError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32601
    });
    exports.MethodNotFoundRpcError = MethodNotFoundRpcError;
    var InvalidParamsRpcError = class _InvalidParamsRpcError extends RpcError {
      constructor(cause) {
        super(cause, {
          code: _InvalidParamsRpcError.code,
          shortMessage: [
            "Invalid parameters were provided to the RPC method.",
            "Double check you have provided the correct parameters."
          ].join("\n")
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidParamsRpcError"
        });
      }
    };
    Object.defineProperty(InvalidParamsRpcError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32602
    });
    exports.InvalidParamsRpcError = InvalidParamsRpcError;
    var InternalRpcError = class _InternalRpcError extends RpcError {
      constructor(cause) {
        super(cause, {
          code: _InternalRpcError.code,
          shortMessage: "An internal error was received."
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InternalRpcError"
        });
      }
    };
    Object.defineProperty(InternalRpcError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32603
    });
    exports.InternalRpcError = InternalRpcError;
    var InvalidInputRpcError = class _InvalidInputRpcError extends RpcError {
      constructor(cause) {
        super(cause, {
          code: _InvalidInputRpcError.code,
          shortMessage: [
            "Missing or invalid parameters.",
            "Double check you have provided the correct parameters."
          ].join("\n")
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidInputRpcError"
        });
      }
    };
    Object.defineProperty(InvalidInputRpcError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32e3
    });
    exports.InvalidInputRpcError = InvalidInputRpcError;
    var ResourceNotFoundRpcError = class _ResourceNotFoundRpcError extends RpcError {
      constructor(cause) {
        super(cause, {
          code: _ResourceNotFoundRpcError.code,
          shortMessage: "Requested resource not found."
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "ResourceNotFoundRpcError"
        });
      }
    };
    Object.defineProperty(ResourceNotFoundRpcError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32001
    });
    exports.ResourceNotFoundRpcError = ResourceNotFoundRpcError;
    var ResourceUnavailableRpcError = class _ResourceUnavailableRpcError extends RpcError {
      constructor(cause) {
        super(cause, {
          code: _ResourceUnavailableRpcError.code,
          shortMessage: "Requested resource not available."
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "ResourceUnavailableRpcError"
        });
      }
    };
    Object.defineProperty(ResourceUnavailableRpcError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32002
    });
    exports.ResourceUnavailableRpcError = ResourceUnavailableRpcError;
    var TransactionRejectedRpcError = class _TransactionRejectedRpcError extends RpcError {
      constructor(cause) {
        super(cause, {
          code: _TransactionRejectedRpcError.code,
          shortMessage: "Transaction creation failed."
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "TransactionRejectedRpcError"
        });
      }
    };
    Object.defineProperty(TransactionRejectedRpcError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32003
    });
    exports.TransactionRejectedRpcError = TransactionRejectedRpcError;
    var MethodNotSupportedRpcError = class _MethodNotSupportedRpcError extends RpcError {
      constructor(cause) {
        super(cause, {
          code: _MethodNotSupportedRpcError.code,
          shortMessage: "Method is not implemented."
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "MethodNotSupportedRpcError"
        });
      }
    };
    Object.defineProperty(MethodNotSupportedRpcError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32004
    });
    exports.MethodNotSupportedRpcError = MethodNotSupportedRpcError;
    var LimitExceededRpcError = class _LimitExceededRpcError extends RpcError {
      constructor(cause) {
        super(cause, {
          code: _LimitExceededRpcError.code,
          shortMessage: "Request exceeds defined limit."
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "LimitExceededRpcError"
        });
      }
    };
    Object.defineProperty(LimitExceededRpcError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32005
    });
    exports.LimitExceededRpcError = LimitExceededRpcError;
    var JsonRpcVersionUnsupportedError = class _JsonRpcVersionUnsupportedError extends RpcError {
      constructor(cause) {
        super(cause, {
          code: _JsonRpcVersionUnsupportedError.code,
          shortMessage: "Version of JSON-RPC protocol is not supported."
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "JsonRpcVersionUnsupportedError"
        });
      }
    };
    Object.defineProperty(JsonRpcVersionUnsupportedError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32006
    });
    exports.JsonRpcVersionUnsupportedError = JsonRpcVersionUnsupportedError;
    var UserRejectedRequestError = class _UserRejectedRequestError extends ProviderRpcError {
      constructor(cause) {
        super(cause, {
          code: _UserRejectedRequestError.code,
          shortMessage: "User rejected the request."
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "UserRejectedRequestError"
        });
      }
    };
    Object.defineProperty(UserRejectedRequestError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 4001
    });
    exports.UserRejectedRequestError = UserRejectedRequestError;
    var UnauthorizedProviderError = class _UnauthorizedProviderError extends ProviderRpcError {
      constructor(cause) {
        super(cause, {
          code: _UnauthorizedProviderError.code,
          shortMessage: "The requested method and/or account has not been authorized by the user."
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "UnauthorizedProviderError"
        });
      }
    };
    Object.defineProperty(UnauthorizedProviderError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 4100
    });
    exports.UnauthorizedProviderError = UnauthorizedProviderError;
    var UnsupportedProviderMethodError = class _UnsupportedProviderMethodError extends ProviderRpcError {
      constructor(cause) {
        super(cause, {
          code: _UnsupportedProviderMethodError.code,
          shortMessage: "The Provider does not support the requested method."
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "UnsupportedProviderMethodError"
        });
      }
    };
    Object.defineProperty(UnsupportedProviderMethodError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 4200
    });
    exports.UnsupportedProviderMethodError = UnsupportedProviderMethodError;
    var ProviderDisconnectedError = class _ProviderDisconnectedError extends ProviderRpcError {
      constructor(cause) {
        super(cause, {
          code: _ProviderDisconnectedError.code,
          shortMessage: "The Provider is disconnected from all chains."
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "ProviderDisconnectedError"
        });
      }
    };
    Object.defineProperty(ProviderDisconnectedError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 4900
    });
    exports.ProviderDisconnectedError = ProviderDisconnectedError;
    var ChainDisconnectedError = class _ChainDisconnectedError extends ProviderRpcError {
      constructor(cause) {
        super(cause, {
          code: _ChainDisconnectedError.code,
          shortMessage: "The Provider is not connected to the requested chain."
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "ChainDisconnectedError"
        });
      }
    };
    Object.defineProperty(ChainDisconnectedError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 4901
    });
    exports.ChainDisconnectedError = ChainDisconnectedError;
    var SwitchChainError = class _SwitchChainError extends ProviderRpcError {
      constructor(cause) {
        super(cause, {
          code: _SwitchChainError.code,
          shortMessage: "An error occurred when attempting to switch chain."
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "SwitchChainError"
        });
      }
    };
    Object.defineProperty(SwitchChainError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 4902
    });
    exports.SwitchChainError = SwitchChainError;
    var UnknownRpcError = class extends RpcError {
      constructor(cause) {
        super(cause, {
          shortMessage: "An unknown RPC error occurred."
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "UnknownRpcError"
        });
      }
    };
    exports.UnknownRpcError = UnknownRpcError;
  }
});

// node_modules/viem/_cjs/utils/errors/getContractError.js
var require_getContractError = __commonJS({
  "node_modules/viem/_cjs/utils/errors/getContractError.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getContractError = void 0;
    var abi_js_1 = require_abi();
    var base_js_1 = require_base();
    var contract_js_1 = require_contract();
    var rpc_js_1 = require_rpc();
    var EXECUTION_REVERTED_ERROR_CODE = 3;
    function getContractError(err, { abi: abi2, address, args, docsPath, functionName, sender }) {
      const { code, data, message, shortMessage } = err instanceof contract_js_1.RawContractError ? err : err instanceof base_js_1.BaseError ? err.walk((err2) => "data" in err2) || err.walk() : {};
      const cause = (() => {
        if (err instanceof abi_js_1.AbiDecodingZeroDataError)
          return new contract_js_1.ContractFunctionZeroDataError({ functionName });
        if ([EXECUTION_REVERTED_ERROR_CODE, rpc_js_1.InternalRpcError.code].includes(code) && (data || message || shortMessage)) {
          return new contract_js_1.ContractFunctionRevertedError({
            abi: abi2,
            data: typeof data === "object" ? data.data : data,
            functionName,
            message: shortMessage ?? message
          });
        }
        return err;
      })();
      return new contract_js_1.ContractFunctionExecutionError(cause, {
        abi: abi2,
        args,
        contractAddress: address,
        docsPath,
        functionName,
        sender
      });
    }
    exports.getContractError = getContractError;
  }
});

// node_modules/viem/_cjs/errors/account.js
var require_account = __commonJS({
  "node_modules/viem/_cjs/errors/account.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AccountNotFoundError = void 0;
    var base_js_1 = require_base();
    var AccountNotFoundError = class extends base_js_1.BaseError {
      constructor({ docsPath } = {}) {
        super([
          "Could not find an Account to execute with this Action.",
          "Please provide an Account with the `account` argument on the Action, or by supplying an `account` to the WalletClient."
        ].join("\n"), {
          docsPath,
          docsSlug: "account"
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "AccountNotFoundError"
        });
      }
    };
    exports.AccountNotFoundError = AccountNotFoundError;
  }
});

// node_modules/viem/_cjs/errors/estimateGas.js
var require_estimateGas = __commonJS({
  "node_modules/viem/_cjs/errors/estimateGas.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EstimateGasExecutionError = void 0;
    var formatEther_js_1 = require_formatEther();
    var formatGwei_js_1 = require_formatGwei();
    var base_js_1 = require_base();
    var transaction_js_1 = require_transaction();
    var EstimateGasExecutionError = class extends base_js_1.BaseError {
      constructor(cause, { account, docsPath, chain, data, gas, gasPrice, maxFeePerGas, maxPriorityFeePerGas, nonce, to, value }) {
        const prettyArgs = (0, transaction_js_1.prettyPrint)({
          from: account?.address,
          to,
          value: typeof value !== "undefined" && `${(0, formatEther_js_1.formatEther)(value)} ${chain?.nativeCurrency.symbol || "ETH"}`,
          data,
          gas,
          gasPrice: typeof gasPrice !== "undefined" && `${(0, formatGwei_js_1.formatGwei)(gasPrice)} gwei`,
          maxFeePerGas: typeof maxFeePerGas !== "undefined" && `${(0, formatGwei_js_1.formatGwei)(maxFeePerGas)} gwei`,
          maxPriorityFeePerGas: typeof maxPriorityFeePerGas !== "undefined" && `${(0, formatGwei_js_1.formatGwei)(maxPriorityFeePerGas)} gwei`,
          nonce
        });
        super(cause.shortMessage, {
          cause,
          docsPath,
          metaMessages: [
            ...cause.metaMessages ? [...cause.metaMessages, " "] : [],
            "Estimate Gas Arguments:",
            prettyArgs
          ].filter(Boolean)
        });
        Object.defineProperty(this, "cause", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "EstimateGasExecutionError"
        });
        this.cause = cause;
      }
    };
    exports.EstimateGasExecutionError = EstimateGasExecutionError;
  }
});

// node_modules/viem/_cjs/errors/node.js
var require_node = __commonJS({
  "node_modules/viem/_cjs/errors/node.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UnknownNodeError = exports.TipAboveFeeCapError = exports.TransactionTypeNotSupportedError = exports.IntrinsicGasTooLowError = exports.IntrinsicGasTooHighError = exports.InsufficientFundsError = exports.NonceMaxValueError = exports.NonceTooLowError = exports.NonceTooHighError = exports.FeeCapTooLowError = exports.FeeCapTooHighError = exports.ExecutionRevertedError = void 0;
    var formatGwei_js_1 = require_formatGwei();
    var base_js_1 = require_base();
    var ExecutionRevertedError = class extends base_js_1.BaseError {
      constructor({ cause, message } = {}) {
        const reason = message?.replace("execution reverted: ", "")?.replace("execution reverted", "");
        super(`Execution reverted ${reason ? `with reason: ${reason}` : "for an unknown reason"}.`, {
          cause
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "ExecutionRevertedError"
        });
      }
    };
    Object.defineProperty(ExecutionRevertedError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 3
    });
    Object.defineProperty(ExecutionRevertedError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /execution reverted/
    });
    exports.ExecutionRevertedError = ExecutionRevertedError;
    var FeeCapTooHighError = class extends base_js_1.BaseError {
      constructor({ cause, maxFeePerGas } = {}) {
        super(`The fee cap (\`maxFeePerGas\`${maxFeePerGas ? ` = ${(0, formatGwei_js_1.formatGwei)(maxFeePerGas)} gwei` : ""}) cannot be higher than the maximum allowed value (2^256-1).`, {
          cause
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "FeeCapTooHigh"
        });
      }
    };
    Object.defineProperty(FeeCapTooHighError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /max fee per gas higher than 2\^256-1|fee cap higher than 2\^256-1/
    });
    exports.FeeCapTooHighError = FeeCapTooHighError;
    var FeeCapTooLowError = class extends base_js_1.BaseError {
      constructor({ cause, maxFeePerGas } = {}) {
        super(`The fee cap (\`maxFeePerGas\`${maxFeePerGas ? ` = ${(0, formatGwei_js_1.formatGwei)(maxFeePerGas)}` : ""} gwei) cannot be lower than the block base fee.`, {
          cause
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "FeeCapTooLow"
        });
      }
    };
    Object.defineProperty(FeeCapTooLowError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /max fee per gas less than block base fee|fee cap less than block base fee|transaction is outdated/
    });
    exports.FeeCapTooLowError = FeeCapTooLowError;
    var NonceTooHighError = class extends base_js_1.BaseError {
      constructor({ cause, nonce } = {}) {
        super(`Nonce provided for the transaction ${nonce ? `(${nonce}) ` : ""}is higher than the next one expected.`, { cause });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "NonceTooHighError"
        });
      }
    };
    Object.defineProperty(NonceTooHighError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /nonce too high/
    });
    exports.NonceTooHighError = NonceTooHighError;
    var NonceTooLowError = class extends base_js_1.BaseError {
      constructor({ cause, nonce } = {}) {
        super([
          `Nonce provided for the transaction ${nonce ? `(${nonce}) ` : ""}is lower than the current nonce of the account.`,
          "Try increasing the nonce or find the latest nonce with `getTransactionCount`."
        ].join("\n"), { cause });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "NonceTooLowError"
        });
      }
    };
    Object.defineProperty(NonceTooLowError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /nonce too low|transaction already imported|already known/
    });
    exports.NonceTooLowError = NonceTooLowError;
    var NonceMaxValueError = class extends base_js_1.BaseError {
      constructor({ cause, nonce } = {}) {
        super(`Nonce provided for the transaction ${nonce ? `(${nonce}) ` : ""}exceeds the maximum allowed nonce.`, { cause });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "NonceMaxValueError"
        });
      }
    };
    Object.defineProperty(NonceMaxValueError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /nonce has max value/
    });
    exports.NonceMaxValueError = NonceMaxValueError;
    var InsufficientFundsError = class extends base_js_1.BaseError {
      constructor({ cause } = {}) {
        super([
          "The total cost (gas * gas fee + value) of executing this transaction exceeds the balance of the account."
        ].join("\n"), {
          cause,
          metaMessages: [
            "This error could arise when the account does not have enough funds to:",
            " - pay for the total gas fee,",
            " - pay for the value to send.",
            " ",
            "The cost of the transaction is calculated as `gas * gas fee + value`, where:",
            " - `gas` is the amount of gas needed for transaction to execute,",
            " - `gas fee` is the gas fee,",
            " - `value` is the amount of ether to send to the recipient."
          ]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InsufficientFundsError"
        });
      }
    };
    Object.defineProperty(InsufficientFundsError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /insufficient funds/
    });
    exports.InsufficientFundsError = InsufficientFundsError;
    var IntrinsicGasTooHighError = class extends base_js_1.BaseError {
      constructor({ cause, gas } = {}) {
        super(`The amount of gas ${gas ? `(${gas}) ` : ""}provided for the transaction exceeds the limit allowed for the block.`, {
          cause
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "IntrinsicGasTooHighError"
        });
      }
    };
    Object.defineProperty(IntrinsicGasTooHighError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /intrinsic gas too high|gas limit reached/
    });
    exports.IntrinsicGasTooHighError = IntrinsicGasTooHighError;
    var IntrinsicGasTooLowError = class extends base_js_1.BaseError {
      constructor({ cause, gas } = {}) {
        super(`The amount of gas ${gas ? `(${gas}) ` : ""}provided for the transaction is too low.`, {
          cause
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "IntrinsicGasTooLowError"
        });
      }
    };
    Object.defineProperty(IntrinsicGasTooLowError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /intrinsic gas too low/
    });
    exports.IntrinsicGasTooLowError = IntrinsicGasTooLowError;
    var TransactionTypeNotSupportedError = class extends base_js_1.BaseError {
      constructor({ cause }) {
        super("The transaction type is not supported for this chain.", {
          cause
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "TransactionTypeNotSupportedError"
        });
      }
    };
    Object.defineProperty(TransactionTypeNotSupportedError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /transaction type not valid/
    });
    exports.TransactionTypeNotSupportedError = TransactionTypeNotSupportedError;
    var TipAboveFeeCapError = class extends base_js_1.BaseError {
      constructor({ cause, maxPriorityFeePerGas, maxFeePerGas } = {}) {
        super([
          `The provided tip (\`maxPriorityFeePerGas\`${maxPriorityFeePerGas ? ` = ${(0, formatGwei_js_1.formatGwei)(maxPriorityFeePerGas)} gwei` : ""}) cannot be higher than the fee cap (\`maxFeePerGas\`${maxFeePerGas ? ` = ${(0, formatGwei_js_1.formatGwei)(maxFeePerGas)} gwei` : ""}).`
        ].join("\n"), {
          cause
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "TipAboveFeeCapError"
        });
      }
    };
    Object.defineProperty(TipAboveFeeCapError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /max priority fee per gas higher than max fee per gas|tip higher than fee cap/
    });
    exports.TipAboveFeeCapError = TipAboveFeeCapError;
    var UnknownNodeError = class extends base_js_1.BaseError {
      constructor({ cause }) {
        super(`An error occurred while executing: ${cause?.shortMessage}`, {
          cause
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "UnknownNodeError"
        });
      }
    };
    exports.UnknownNodeError = UnknownNodeError;
  }
});

// node_modules/viem/_cjs/utils/errors/getNodeError.js
var require_getNodeError = __commonJS({
  "node_modules/viem/_cjs/utils/errors/getNodeError.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getNodeError = exports.containsNodeError = void 0;
    var base_js_1 = require_base();
    var node_js_1 = require_node();
    var request_js_1 = require_request();
    var rpc_js_1 = require_rpc();
    function containsNodeError(err) {
      return err instanceof rpc_js_1.TransactionRejectedRpcError || err instanceof rpc_js_1.InvalidInputRpcError || err instanceof request_js_1.RpcRequestError && err.code === node_js_1.ExecutionRevertedError.code;
    }
    exports.containsNodeError = containsNodeError;
    function getNodeError(err, args) {
      const message = (err.details || "").toLowerCase();
      const executionRevertedError = err.walk((e) => e.code === node_js_1.ExecutionRevertedError.code);
      if (executionRevertedError instanceof base_js_1.BaseError) {
        return new node_js_1.ExecutionRevertedError({
          cause: err,
          message: executionRevertedError.details
        });
      } else if (node_js_1.ExecutionRevertedError.nodeMessage.test(message))
        return new node_js_1.ExecutionRevertedError({
          cause: err,
          message: err.details
        });
      else if (node_js_1.FeeCapTooHighError.nodeMessage.test(message))
        return new node_js_1.FeeCapTooHighError({
          cause: err,
          maxFeePerGas: args?.maxFeePerGas
        });
      else if (node_js_1.FeeCapTooLowError.nodeMessage.test(message))
        return new node_js_1.FeeCapTooLowError({
          cause: err,
          maxFeePerGas: args?.maxFeePerGas
        });
      else if (node_js_1.NonceTooHighError.nodeMessage.test(message))
        return new node_js_1.NonceTooHighError({ cause: err, nonce: args?.nonce });
      else if (node_js_1.NonceTooLowError.nodeMessage.test(message))
        return new node_js_1.NonceTooLowError({ cause: err, nonce: args?.nonce });
      else if (node_js_1.NonceMaxValueError.nodeMessage.test(message))
        return new node_js_1.NonceMaxValueError({ cause: err, nonce: args?.nonce });
      else if (node_js_1.InsufficientFundsError.nodeMessage.test(message))
        return new node_js_1.InsufficientFundsError({ cause: err });
      else if (node_js_1.IntrinsicGasTooHighError.nodeMessage.test(message))
        return new node_js_1.IntrinsicGasTooHighError({ cause: err, gas: args?.gas });
      else if (node_js_1.IntrinsicGasTooLowError.nodeMessage.test(message))
        return new node_js_1.IntrinsicGasTooLowError({ cause: err, gas: args?.gas });
      else if (node_js_1.TransactionTypeNotSupportedError.nodeMessage.test(message))
        return new node_js_1.TransactionTypeNotSupportedError({ cause: err });
      else if (node_js_1.TipAboveFeeCapError.nodeMessage.test(message))
        return new node_js_1.TipAboveFeeCapError({
          cause: err,
          maxFeePerGas: args?.maxFeePerGas,
          maxPriorityFeePerGas: args?.maxPriorityFeePerGas
        });
      return new node_js_1.UnknownNodeError({
        cause: err
      });
    }
    exports.getNodeError = getNodeError;
  }
});

// node_modules/viem/_cjs/utils/errors/getEstimateGasError.js
var require_getEstimateGasError = __commonJS({
  "node_modules/viem/_cjs/utils/errors/getEstimateGasError.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getEstimateGasError = void 0;
    var estimateGas_js_1 = require_estimateGas();
    var node_js_1 = require_node();
    var getNodeError_js_1 = require_getNodeError();
    function getEstimateGasError(err, { docsPath, ...args }) {
      const cause = (() => {
        const cause2 = (0, getNodeError_js_1.getNodeError)(err, args);
        if (cause2 instanceof node_js_1.UnknownNodeError)
          return err;
        return cause2;
      })();
      return new estimateGas_js_1.EstimateGasExecutionError(cause, {
        docsPath,
        ...args
      });
    }
    exports.getEstimateGasError = getEstimateGasError;
  }
});

// node_modules/viem/_cjs/utils/formatters/extract.js
var require_extract = __commonJS({
  "node_modules/viem/_cjs/utils/formatters/extract.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.extract = void 0;
    function extract(value, { format }) {
      if (!format)
        return {};
      const keys = Object.keys(format({}));
      return keys.reduce((data, key) => {
        if (value?.hasOwnProperty(key)) {
          data[key] = value[key];
        }
        return data;
      }, {});
    }
    exports.extract = extract;
  }
});

// node_modules/viem/_cjs/utils/formatters/formatter.js
var require_formatter = __commonJS({
  "node_modules/viem/_cjs/utils/formatters/formatter.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.defineFormatter = void 0;
    function defineFormatter(type, format) {
      return ({ exclude, format: overrides }) => {
        return {
          exclude,
          format: (args) => {
            const formatted = format(args);
            if (exclude) {
              for (const key of exclude) {
                delete formatted[key];
              }
            }
            return {
              ...formatted,
              ...overrides(args)
            };
          },
          type
        };
      };
    }
    exports.defineFormatter = defineFormatter;
  }
});

// node_modules/viem/_cjs/utils/formatters/transactionRequest.js
var require_transactionRequest = __commonJS({
  "node_modules/viem/_cjs/utils/formatters/transactionRequest.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.defineTransactionRequest = exports.formatTransactionRequest = exports.rpcTransactionType = void 0;
    var toHex_js_1 = require_toHex();
    var formatter_js_1 = require_formatter();
    exports.rpcTransactionType = {
      legacy: "0x0",
      eip2930: "0x1",
      eip1559: "0x2"
    };
    function formatTransactionRequest(transactionRequest) {
      return {
        ...transactionRequest,
        gas: typeof transactionRequest.gas !== "undefined" ? (0, toHex_js_1.numberToHex)(transactionRequest.gas) : void 0,
        gasPrice: typeof transactionRequest.gasPrice !== "undefined" ? (0, toHex_js_1.numberToHex)(transactionRequest.gasPrice) : void 0,
        maxFeePerGas: typeof transactionRequest.maxFeePerGas !== "undefined" ? (0, toHex_js_1.numberToHex)(transactionRequest.maxFeePerGas) : void 0,
        maxPriorityFeePerGas: typeof transactionRequest.maxPriorityFeePerGas !== "undefined" ? (0, toHex_js_1.numberToHex)(transactionRequest.maxPriorityFeePerGas) : void 0,
        nonce: typeof transactionRequest.nonce !== "undefined" ? (0, toHex_js_1.numberToHex)(transactionRequest.nonce) : void 0,
        type: typeof transactionRequest.type !== "undefined" ? exports.rpcTransactionType[transactionRequest.type] : void 0,
        value: typeof transactionRequest.value !== "undefined" ? (0, toHex_js_1.numberToHex)(transactionRequest.value) : void 0
      };
    }
    exports.formatTransactionRequest = formatTransactionRequest;
    exports.defineTransactionRequest = (0, formatter_js_1.defineFormatter)("transactionRequest", formatTransactionRequest);
  }
});

// node_modules/viem/_cjs/utils/transaction/assertRequest.js
var require_assertRequest = __commonJS({
  "node_modules/viem/_cjs/utils/transaction/assertRequest.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.assertRequest = void 0;
    var parseAccount_js_1 = require_parseAccount();
    var address_js_1 = require_address();
    var node_js_1 = require_node();
    var transaction_js_1 = require_transaction();
    var isAddress_js_1 = require_isAddress();
    function assertRequest(args) {
      const { account: account_, gasPrice, maxFeePerGas, maxPriorityFeePerGas, to } = args;
      const account = account_ ? (0, parseAccount_js_1.parseAccount)(account_) : void 0;
      if (account && !(0, isAddress_js_1.isAddress)(account.address))
        throw new address_js_1.InvalidAddressError({ address: account.address });
      if (to && !(0, isAddress_js_1.isAddress)(to))
        throw new address_js_1.InvalidAddressError({ address: to });
      if (typeof gasPrice !== "undefined" && (typeof maxFeePerGas !== "undefined" || typeof maxPriorityFeePerGas !== "undefined"))
        throw new transaction_js_1.FeeConflictError();
      if (maxFeePerGas && maxFeePerGas > 2n ** 256n - 1n)
        throw new node_js_1.FeeCapTooHighError({ maxFeePerGas });
      if (maxPriorityFeePerGas && maxFeePerGas && maxPriorityFeePerGas > maxFeePerGas)
        throw new node_js_1.TipAboveFeeCapError({ maxFeePerGas, maxPriorityFeePerGas });
    }
    exports.assertRequest = assertRequest;
  }
});

// node_modules/viem/_cjs/errors/fee.js
var require_fee = __commonJS({
  "node_modules/viem/_cjs/errors/fee.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MaxFeePerGasTooLowError = exports.Eip1559FeesNotSupportedError = exports.BaseFeeScalarError = void 0;
    var formatGwei_js_1 = require_formatGwei();
    var base_js_1 = require_base();
    var BaseFeeScalarError = class extends base_js_1.BaseError {
      constructor() {
        super("`baseFeeMultiplier` must be greater than 1.");
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "BaseFeeScalarError"
        });
      }
    };
    exports.BaseFeeScalarError = BaseFeeScalarError;
    var Eip1559FeesNotSupportedError = class extends base_js_1.BaseError {
      constructor() {
        super("Chain does not support EIP-1559 fees.");
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "Eip1559FeesNotSupportedError"
        });
      }
    };
    exports.Eip1559FeesNotSupportedError = Eip1559FeesNotSupportedError;
    var MaxFeePerGasTooLowError = class extends base_js_1.BaseError {
      constructor({ maxPriorityFeePerGas }) {
        super(`\`maxFeePerGas\` cannot be less than the \`maxPriorityFeePerGas\` (${(0, formatGwei_js_1.formatGwei)(maxPriorityFeePerGas)} gwei).`);
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "MaxFeePerGasTooLowError"
        });
      }
    };
    exports.MaxFeePerGasTooLowError = MaxFeePerGasTooLowError;
  }
});

// node_modules/viem/_cjs/errors/block.js
var require_block = __commonJS({
  "node_modules/viem/_cjs/errors/block.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BlockNotFoundError = void 0;
    var base_js_1 = require_base();
    var BlockNotFoundError = class extends base_js_1.BaseError {
      constructor({ blockHash, blockNumber }) {
        let identifier = "Block";
        if (blockHash)
          identifier = `Block at hash "${blockHash}"`;
        if (blockNumber)
          identifier = `Block at number "${blockNumber}"`;
        super(`${identifier} could not be found.`);
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "BlockNotFoundError"
        });
      }
    };
    exports.BlockNotFoundError = BlockNotFoundError;
  }
});

// node_modules/viem/_cjs/utils/formatters/transaction.js
var require_transaction2 = __commonJS({
  "node_modules/viem/_cjs/utils/formatters/transaction.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.defineTransaction = exports.formatTransaction = exports.transactionType = void 0;
    var fromHex_js_1 = require_fromHex();
    var formatter_js_1 = require_formatter();
    exports.transactionType = {
      "0x0": "legacy",
      "0x1": "eip2930",
      "0x2": "eip1559"
    };
    function formatTransaction(transaction) {
      const transaction_ = {
        ...transaction,
        blockHash: transaction.blockHash ? transaction.blockHash : null,
        blockNumber: transaction.blockNumber ? BigInt(transaction.blockNumber) : null,
        chainId: transaction.chainId ? (0, fromHex_js_1.hexToNumber)(transaction.chainId) : void 0,
        gas: transaction.gas ? BigInt(transaction.gas) : void 0,
        gasPrice: transaction.gasPrice ? BigInt(transaction.gasPrice) : void 0,
        maxFeePerGas: transaction.maxFeePerGas ? BigInt(transaction.maxFeePerGas) : void 0,
        maxPriorityFeePerGas: transaction.maxPriorityFeePerGas ? BigInt(transaction.maxPriorityFeePerGas) : void 0,
        nonce: transaction.nonce ? (0, fromHex_js_1.hexToNumber)(transaction.nonce) : void 0,
        to: transaction.to ? transaction.to : null,
        transactionIndex: transaction.transactionIndex ? Number(transaction.transactionIndex) : null,
        type: transaction.type ? exports.transactionType[transaction.type] : void 0,
        typeHex: transaction.type ? transaction.type : void 0,
        value: transaction.value ? BigInt(transaction.value) : void 0,
        v: transaction.v ? BigInt(transaction.v) : void 0
      };
      if (transaction_.type === "legacy") {
        delete transaction_.accessList;
        delete transaction_.maxFeePerGas;
        delete transaction_.maxPriorityFeePerGas;
      }
      if (transaction_.type === "eip2930") {
        delete transaction_.maxFeePerGas;
        delete transaction_.maxPriorityFeePerGas;
      }
      return transaction_;
    }
    exports.formatTransaction = formatTransaction;
    exports.defineTransaction = (0, formatter_js_1.defineFormatter)("transaction", formatTransaction);
  }
});

// node_modules/viem/_cjs/utils/formatters/block.js
var require_block2 = __commonJS({
  "node_modules/viem/_cjs/utils/formatters/block.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.defineBlock = exports.formatBlock = void 0;
    var formatter_js_1 = require_formatter();
    var transaction_js_1 = require_transaction2();
    function formatBlock(block) {
      const transactions = block.transactions?.map((transaction) => {
        if (typeof transaction === "string")
          return transaction;
        return (0, transaction_js_1.formatTransaction)(transaction);
      });
      return {
        ...block,
        baseFeePerGas: block.baseFeePerGas ? BigInt(block.baseFeePerGas) : null,
        difficulty: block.difficulty ? BigInt(block.difficulty) : void 0,
        gasLimit: block.gasLimit ? BigInt(block.gasLimit) : void 0,
        gasUsed: block.gasUsed ? BigInt(block.gasUsed) : void 0,
        hash: block.hash ? block.hash : null,
        logsBloom: block.logsBloom ? block.logsBloom : null,
        nonce: block.nonce ? block.nonce : null,
        number: block.number ? BigInt(block.number) : null,
        size: block.size ? BigInt(block.size) : void 0,
        timestamp: block.timestamp ? BigInt(block.timestamp) : void 0,
        transactions,
        totalDifficulty: block.totalDifficulty ? BigInt(block.totalDifficulty) : null
      };
    }
    exports.formatBlock = formatBlock;
    exports.defineBlock = (0, formatter_js_1.defineFormatter)("block", formatBlock);
  }
});

// node_modules/viem/_cjs/actions/public/getBlock.js
var require_getBlock = __commonJS({
  "node_modules/viem/_cjs/actions/public/getBlock.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getBlock = void 0;
    var block_js_1 = require_block();
    var toHex_js_1 = require_toHex();
    var block_js_2 = require_block2();
    async function getBlock(client, { blockHash, blockNumber, blockTag: blockTag_, includeTransactions: includeTransactions_ } = {}) {
      const blockTag = blockTag_ ?? "latest";
      const includeTransactions = includeTransactions_ ?? false;
      const blockNumberHex = blockNumber !== void 0 ? (0, toHex_js_1.numberToHex)(blockNumber) : void 0;
      let block = null;
      if (blockHash) {
        block = await client.request({
          method: "eth_getBlockByHash",
          params: [blockHash, includeTransactions]
        });
      } else {
        block = await client.request({
          method: "eth_getBlockByNumber",
          params: [blockNumberHex || blockTag, includeTransactions]
        });
      }
      if (!block)
        throw new block_js_1.BlockNotFoundError({ blockHash, blockNumber });
      const format = client.chain?.formatters?.block?.format || block_js_2.formatBlock;
      return format(block);
    }
    exports.getBlock = getBlock;
  }
});

// node_modules/viem/_cjs/actions/public/getGasPrice.js
var require_getGasPrice = __commonJS({
  "node_modules/viem/_cjs/actions/public/getGasPrice.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getGasPrice = void 0;
    async function getGasPrice(client) {
      const gasPrice = await client.request({
        method: "eth_gasPrice"
      });
      return BigInt(gasPrice);
    }
    exports.getGasPrice = getGasPrice;
  }
});

// node_modules/viem/_cjs/actions/public/estimateMaxPriorityFeePerGas.js
var require_estimateMaxPriorityFeePerGas = __commonJS({
  "node_modules/viem/_cjs/actions/public/estimateMaxPriorityFeePerGas.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.internal_estimateMaxPriorityFeePerGas = exports.estimateMaxPriorityFeePerGas = void 0;
    var fee_js_1 = require_fee();
    var fromHex_js_1 = require_fromHex();
    var getBlock_js_1 = require_getBlock();
    var getGasPrice_js_1 = require_getGasPrice();
    async function estimateMaxPriorityFeePerGas(client, args) {
      return internal_estimateMaxPriorityFeePerGas(client, args);
    }
    exports.estimateMaxPriorityFeePerGas = estimateMaxPriorityFeePerGas;
    async function internal_estimateMaxPriorityFeePerGas(client, args) {
      const { block: block_, chain = client.chain, request } = args || {};
      if (typeof chain?.fees?.defaultPriorityFee === "function") {
        const block = block_ || await (0, getBlock_js_1.getBlock)(client);
        return chain.fees.defaultPriorityFee({
          block,
          client,
          request
        });
      } else if (typeof chain?.fees?.defaultPriorityFee !== "undefined")
        return chain?.fees?.defaultPriorityFee;
      try {
        const maxPriorityFeePerGasHex = await client.request({
          method: "eth_maxPriorityFeePerGas"
        });
        return (0, fromHex_js_1.hexToBigInt)(maxPriorityFeePerGasHex);
      } catch {
        const [block, gasPrice] = await Promise.all([
          block_ ? Promise.resolve(block_) : (0, getBlock_js_1.getBlock)(client),
          (0, getGasPrice_js_1.getGasPrice)(client)
        ]);
        if (typeof block.baseFeePerGas !== "bigint")
          throw new fee_js_1.Eip1559FeesNotSupportedError();
        const maxPriorityFeePerGas = gasPrice - block.baseFeePerGas;
        if (maxPriorityFeePerGas < 0n)
          return 0n;
        return maxPriorityFeePerGas;
      }
    }
    exports.internal_estimateMaxPriorityFeePerGas = internal_estimateMaxPriorityFeePerGas;
  }
});

// node_modules/viem/_cjs/actions/public/estimateFeesPerGas.js
var require_estimateFeesPerGas = __commonJS({
  "node_modules/viem/_cjs/actions/public/estimateFeesPerGas.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.internal_estimateFeesPerGas = exports.estimateFeesPerGas = void 0;
    var fee_js_1 = require_fee();
    var estimateMaxPriorityFeePerGas_js_1 = require_estimateMaxPriorityFeePerGas();
    var getBlock_js_1 = require_getBlock();
    var getGasPrice_js_1 = require_getGasPrice();
    async function estimateFeesPerGas(client, args) {
      return internal_estimateFeesPerGas(client, args);
    }
    exports.estimateFeesPerGas = estimateFeesPerGas;
    async function internal_estimateFeesPerGas(client, args) {
      const { block: block_, chain = client.chain, request, type = "eip1559" } = args || {};
      const baseFeeMultiplier = await (async () => {
        if (typeof chain?.fees?.baseFeeMultiplier === "function")
          return chain.fees.baseFeeMultiplier({
            block: block_,
            client,
            request
          });
        return chain?.fees?.baseFeeMultiplier ?? 1.2;
      })();
      if (baseFeeMultiplier < 1)
        throw new fee_js_1.BaseFeeScalarError();
      const decimals = baseFeeMultiplier.toString().split(".")[1]?.length ?? 0;
      const denominator = 10 ** decimals;
      const multiply = (base) => base * BigInt(Math.ceil(baseFeeMultiplier * denominator)) / BigInt(denominator);
      const block = block_ ? block_ : await (0, getBlock_js_1.getBlock)(client);
      if (typeof chain?.fees?.estimateFeesPerGas === "function")
        return chain.fees.estimateFeesPerGas({
          block: block_,
          client,
          multiply,
          request,
          type
        });
      if (type === "eip1559") {
        if (typeof block.baseFeePerGas !== "bigint")
          throw new fee_js_1.Eip1559FeesNotSupportedError();
        const maxPriorityFeePerGas = request?.maxPriorityFeePerGas ? request.maxPriorityFeePerGas : await (0, estimateMaxPriorityFeePerGas_js_1.internal_estimateMaxPriorityFeePerGas)(client, {
          block,
          chain,
          request
        });
        const baseFeePerGas = multiply(block.baseFeePerGas);
        const maxFeePerGas = request?.maxFeePerGas ?? baseFeePerGas + maxPriorityFeePerGas;
        return {
          maxFeePerGas,
          maxPriorityFeePerGas
        };
      }
      const gasPrice = request?.gasPrice ?? multiply(await (0, getGasPrice_js_1.getGasPrice)(client));
      return {
        gasPrice
      };
    }
    exports.internal_estimateFeesPerGas = internal_estimateFeesPerGas;
  }
});

// node_modules/viem/_cjs/actions/public/getTransactionCount.js
var require_getTransactionCount = __commonJS({
  "node_modules/viem/_cjs/actions/public/getTransactionCount.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getTransactionCount = void 0;
    var fromHex_js_1 = require_fromHex();
    var toHex_js_1 = require_toHex();
    async function getTransactionCount(client, { address, blockTag = "latest", blockNumber }) {
      const count = await client.request({
        method: "eth_getTransactionCount",
        params: [address, blockNumber ? (0, toHex_js_1.numberToHex)(blockNumber) : blockTag]
      });
      return (0, fromHex_js_1.hexToNumber)(count);
    }
    exports.getTransactionCount = getTransactionCount;
  }
});

// node_modules/viem/_cjs/utils/transaction/getTransactionType.js
var require_getTransactionType = __commonJS({
  "node_modules/viem/_cjs/utils/transaction/getTransactionType.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getTransactionType = void 0;
    var transaction_js_1 = require_transaction();
    function getTransactionType(transaction) {
      if (transaction.type)
        return transaction.type;
      if (typeof transaction.maxFeePerGas !== "undefined" || typeof transaction.maxPriorityFeePerGas !== "undefined")
        return "eip1559";
      if (typeof transaction.gasPrice !== "undefined") {
        if (typeof transaction.accessList !== "undefined")
          return "eip2930";
        return "legacy";
      }
      throw new transaction_js_1.InvalidSerializableTransactionError({ transaction });
    }
    exports.getTransactionType = getTransactionType;
  }
});

// node_modules/viem/_cjs/actions/wallet/prepareTransactionRequest.js
var require_prepareTransactionRequest = __commonJS({
  "node_modules/viem/_cjs/actions/wallet/prepareTransactionRequest.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.prepareTransactionRequest = void 0;
    var parseAccount_js_1 = require_parseAccount();
    var estimateFeesPerGas_js_1 = require_estimateFeesPerGas();
    var estimateGas_js_1 = require_estimateGas2();
    var getBlock_js_1 = require_getBlock();
    var getTransactionCount_js_1 = require_getTransactionCount();
    var account_js_1 = require_account();
    var fee_js_1 = require_fee();
    var assertRequest_js_1 = require_assertRequest();
    var getTransactionType_js_1 = require_getTransactionType();
    async function prepareTransactionRequest(client, args) {
      const { account: account_ = client.account, chain, gas, nonce, type } = args;
      if (!account_)
        throw new account_js_1.AccountNotFoundError();
      const account = (0, parseAccount_js_1.parseAccount)(account_);
      const block = await (0, getBlock_js_1.getBlock)(client, { blockTag: "latest" });
      const request = { ...args, from: account.address };
      if (typeof nonce === "undefined")
        request.nonce = await (0, getTransactionCount_js_1.getTransactionCount)(client, {
          address: account.address,
          blockTag: "pending"
        });
      if (typeof type === "undefined") {
        try {
          request.type = (0, getTransactionType_js_1.getTransactionType)(request);
        } catch {
          request.type = typeof block.baseFeePerGas === "bigint" ? "eip1559" : "legacy";
        }
      }
      if (request.type === "eip1559") {
        const { maxFeePerGas, maxPriorityFeePerGas } = await (0, estimateFeesPerGas_js_1.internal_estimateFeesPerGas)(client, {
          block,
          chain,
          request
        });
        if (typeof args.maxPriorityFeePerGas === "undefined" && args.maxFeePerGas && args.maxFeePerGas < maxPriorityFeePerGas)
          throw new fee_js_1.MaxFeePerGasTooLowError({
            maxPriorityFeePerGas
          });
        request.maxPriorityFeePerGas = maxPriorityFeePerGas;
        request.maxFeePerGas = maxFeePerGas;
      } else {
        if (typeof args.maxFeePerGas !== "undefined" || typeof args.maxPriorityFeePerGas !== "undefined")
          throw new fee_js_1.Eip1559FeesNotSupportedError();
        const { gasPrice: gasPrice_ } = await (0, estimateFeesPerGas_js_1.internal_estimateFeesPerGas)(client, {
          block,
          chain,
          request,
          type: "legacy"
        });
        request.gasPrice = gasPrice_;
      }
      if (typeof gas === "undefined")
        request.gas = await (0, estimateGas_js_1.estimateGas)(client, {
          ...request,
          account: { address: account.address, type: "json-rpc" }
        });
      (0, assertRequest_js_1.assertRequest)(request);
      return request;
    }
    exports.prepareTransactionRequest = prepareTransactionRequest;
  }
});

// node_modules/viem/_cjs/actions/public/estimateGas.js
var require_estimateGas2 = __commonJS({
  "node_modules/viem/_cjs/actions/public/estimateGas.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.estimateGas = void 0;
    var parseAccount_js_1 = require_parseAccount();
    var account_js_1 = require_account();
    var toHex_js_1 = require_toHex();
    var getEstimateGasError_js_1 = require_getEstimateGasError();
    var extract_js_1 = require_extract();
    var transactionRequest_js_1 = require_transactionRequest();
    var assertRequest_js_1 = require_assertRequest();
    var prepareTransactionRequest_js_1 = require_prepareTransactionRequest();
    async function estimateGas(client, args) {
      const account_ = args.account ?? client.account;
      if (!account_)
        throw new account_js_1.AccountNotFoundError({
          docsPath: "/docs/actions/public/estimateGas"
        });
      const account = (0, parseAccount_js_1.parseAccount)(account_);
      try {
        const { accessList, blockNumber, blockTag, data, gas, gasPrice, maxFeePerGas, maxPriorityFeePerGas, nonce, to, value, ...rest } = account.type === "local" ? await (0, prepareTransactionRequest_js_1.prepareTransactionRequest)(client, args) : args;
        const blockNumberHex = blockNumber ? (0, toHex_js_1.numberToHex)(blockNumber) : void 0;
        const block = blockNumberHex || blockTag;
        (0, assertRequest_js_1.assertRequest)(args);
        const format = client.chain?.formatters?.transactionRequest?.format || transactionRequest_js_1.formatTransactionRequest;
        const request = format({
          ...(0, extract_js_1.extract)(rest, { format }),
          from: account.address,
          accessList,
          data,
          gas,
          gasPrice,
          maxFeePerGas,
          maxPriorityFeePerGas,
          nonce,
          to,
          value
        });
        const balance = await client.request({
          method: "eth_estimateGas",
          params: block ? [request, block] : [request]
        });
        return BigInt(balance);
      } catch (err) {
        throw (0, getEstimateGasError_js_1.getEstimateGasError)(err, {
          ...args,
          account,
          chain: client.chain
        });
      }
    }
    exports.estimateGas = estimateGas;
  }
});

// node_modules/viem/_cjs/actions/public/estimateContractGas.js
var require_estimateContractGas = __commonJS({
  "node_modules/viem/_cjs/actions/public/estimateContractGas.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.estimateContractGas = void 0;
    var parseAccount_js_1 = require_parseAccount();
    var encodeFunctionData_js_1 = require_encodeFunctionData();
    var getContractError_js_1 = require_getContractError();
    var estimateGas_js_1 = require_estimateGas2();
    async function estimateContractGas(client, { abi: abi2, address, args, functionName, ...request }) {
      const data = (0, encodeFunctionData_js_1.encodeFunctionData)({
        abi: abi2,
        args,
        functionName
      });
      try {
        const gas = await (0, estimateGas_js_1.estimateGas)(client, {
          data,
          to: address,
          ...request
        });
        return gas;
      } catch (err) {
        const account = request.account ? (0, parseAccount_js_1.parseAccount)(request.account) : void 0;
        throw (0, getContractError_js_1.getContractError)(err, {
          abi: abi2,
          address,
          args,
          docsPath: "/docs/contract/estimateContractGas",
          functionName,
          sender: account?.address
        });
      }
    }
    exports.estimateContractGas = estimateContractGas;
  }
});

// node_modules/viem/_cjs/utils/abi/decodeEventLog.js
var require_decodeEventLog = __commonJS({
  "node_modules/viem/_cjs/utils/abi/decodeEventLog.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.decodeEventLog = void 0;
    var abi_js_1 = require_abi();
    var getEventSelector_js_1 = require_getEventSelector();
    var decodeAbiParameters_js_1 = require_decodeAbiParameters();
    var formatAbiItem_js_1 = require_formatAbiItem2();
    var docsPath = "/docs/contract/decodeEventLog";
    function decodeEventLog({ abi: abi2, data, strict: strict_, topics }) {
      const strict = strict_ ?? true;
      const [signature, ...argTopics] = topics;
      if (!signature)
        throw new abi_js_1.AbiEventSignatureEmptyTopicsError({
          docsPath
        });
      const abiItem = abi2.find((x) => x.type === "event" && signature === (0, getEventSelector_js_1.getEventSelector)((0, formatAbiItem_js_1.formatAbiItem)(x)));
      if (!(abiItem && "name" in abiItem) || abiItem.type !== "event")
        throw new abi_js_1.AbiEventSignatureNotFoundError(signature, {
          docsPath
        });
      const { name, inputs } = abiItem;
      const isUnnamed = inputs?.some((x) => !("name" in x && x.name));
      let args = isUnnamed ? [] : {};
      const indexedInputs = inputs.filter((x) => "indexed" in x && x.indexed);
      for (let i = 0; i < indexedInputs.length; i++) {
        const param = indexedInputs[i];
        const topic = argTopics[i];
        if (!topic)
          throw new abi_js_1.DecodeLogTopicsMismatch({
            abiItem,
            param
          });
        args[param.name || i] = decodeTopic({ param, value: topic });
      }
      const nonIndexedInputs = inputs.filter((x) => !("indexed" in x && x.indexed));
      if (nonIndexedInputs.length > 0) {
        if (data && data !== "0x") {
          try {
            const decodedData = (0, decodeAbiParameters_js_1.decodeAbiParameters)(nonIndexedInputs, data);
            if (decodedData) {
              if (isUnnamed)
                args = [...args, ...decodedData];
              else {
                for (let i = 0; i < nonIndexedInputs.length; i++) {
                  args[nonIndexedInputs[i].name] = decodedData[i];
                }
              }
            }
          } catch (err) {
            if (strict) {
              if (err instanceof abi_js_1.AbiDecodingDataSizeTooSmallError)
                throw new abi_js_1.DecodeLogDataMismatch({
                  abiItem,
                  data: err.data,
                  params: err.params,
                  size: err.size
                });
              throw err;
            }
          }
        } else if (strict) {
          throw new abi_js_1.DecodeLogDataMismatch({
            abiItem,
            data: "0x",
            params: nonIndexedInputs,
            size: 0
          });
        }
      }
      return {
        eventName: name,
        args: Object.values(args).length > 0 ? args : void 0
      };
    }
    exports.decodeEventLog = decodeEventLog;
    function decodeTopic({ param, value }) {
      if (param.type === "string" || param.type === "bytes" || param.type === "tuple" || param.type.match(/^(.*)\[(\d+)?\]$/))
        return value;
      const decodedArg = (0, decodeAbiParameters_js_1.decodeAbiParameters)([param], value) || [];
      return decodedArg[0];
    }
  }
});

// node_modules/viem/_cjs/utils/formatters/log.js
var require_log2 = __commonJS({
  "node_modules/viem/_cjs/utils/formatters/log.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.formatLog = void 0;
    function formatLog(log, { args, eventName } = {}) {
      return {
        ...log,
        blockHash: log.blockHash ? log.blockHash : null,
        blockNumber: log.blockNumber ? BigInt(log.blockNumber) : null,
        logIndex: log.logIndex ? Number(log.logIndex) : null,
        transactionHash: log.transactionHash ? log.transactionHash : null,
        transactionIndex: log.transactionIndex ? Number(log.transactionIndex) : null,
        ...eventName ? { args, eventName } : {}
      };
    }
    exports.formatLog = formatLog;
  }
});

// node_modules/viem/_cjs/actions/public/getLogs.js
var require_getLogs = __commonJS({
  "node_modules/viem/_cjs/actions/public/getLogs.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getLogs = void 0;
    var abi_js_1 = require_abi();
    var decodeEventLog_js_1 = require_decodeEventLog();
    var encodeEventTopics_js_1 = require_encodeEventTopics();
    var toHex_js_1 = require_toHex();
    var log_js_1 = require_log2();
    async function getLogs(client, { address, blockHash, fromBlock, toBlock, event, events: events_, args, strict: strict_ } = {}) {
      const strict = strict_ ?? false;
      const events = events_ ?? (event ? [event] : void 0);
      let topics = [];
      if (events) {
        topics = [
          events.flatMap((event2) => (0, encodeEventTopics_js_1.encodeEventTopics)({
            abi: [event2],
            eventName: event2.name,
            args
          }))
        ];
        if (event)
          topics = topics[0];
      }
      let logs;
      if (blockHash) {
        logs = await client.request({
          method: "eth_getLogs",
          params: [{ address, topics, blockHash }]
        });
      } else {
        logs = await client.request({
          method: "eth_getLogs",
          params: [
            {
              address,
              topics,
              fromBlock: typeof fromBlock === "bigint" ? (0, toHex_js_1.numberToHex)(fromBlock) : fromBlock,
              toBlock: typeof toBlock === "bigint" ? (0, toHex_js_1.numberToHex)(toBlock) : toBlock
            }
          ]
        });
      }
      return logs.map((log) => {
        try {
          const { eventName, args: args2 } = events ? (0, decodeEventLog_js_1.decodeEventLog)({
            abi: events,
            data: log.data,
            topics: log.topics,
            strict
          }) : { eventName: void 0, args: void 0 };
          return (0, log_js_1.formatLog)(log, { args: args2, eventName });
        } catch (err) {
          let eventName;
          let isUnnamed;
          if (err instanceof abi_js_1.DecodeLogDataMismatch || err instanceof abi_js_1.DecodeLogTopicsMismatch) {
            if (strict)
              return;
            eventName = err.abiItem.name;
            isUnnamed = err.abiItem.inputs?.some((x) => !("name" in x && x.name));
          }
          return (0, log_js_1.formatLog)(log, { args: isUnnamed ? [] : {}, eventName });
        }
      }).filter(Boolean);
    }
    exports.getLogs = getLogs;
  }
});

// node_modules/viem/_cjs/actions/public/getContractEvents.js
var require_getContractEvents = __commonJS({
  "node_modules/viem/_cjs/actions/public/getContractEvents.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getContractEvents = void 0;
    var getAbiItem_js_1 = require_getAbiItem();
    var getLogs_js_1 = require_getLogs();
    async function getContractEvents(client, { abi: abi2, address, args, blockHash, eventName, fromBlock, toBlock, strict }) {
      const event = eventName ? (0, getAbiItem_js_1.getAbiItem)({ abi: abi2, name: eventName }) : void 0;
      const events = !event ? abi2.filter((x) => x.type === "event") : void 0;
      return (0, getLogs_js_1.getLogs)(client, {
        address,
        args,
        blockHash,
        event,
        events,
        fromBlock,
        toBlock,
        strict
      });
    }
    exports.getContractEvents = getContractEvents;
  }
});

// node_modules/viem/_cjs/utils/abi/decodeFunctionResult.js
var require_decodeFunctionResult = __commonJS({
  "node_modules/viem/_cjs/utils/abi/decodeFunctionResult.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.decodeFunctionResult = void 0;
    var abi_js_1 = require_abi();
    var decodeAbiParameters_js_1 = require_decodeAbiParameters();
    var getAbiItem_js_1 = require_getAbiItem();
    var docsPath = "/docs/contract/decodeFunctionResult";
    function decodeFunctionResult({ abi: abi2, args, functionName, data }) {
      let abiItem = abi2[0];
      if (functionName) {
        abiItem = (0, getAbiItem_js_1.getAbiItem)({
          abi: abi2,
          args,
          name: functionName
        });
        if (!abiItem)
          throw new abi_js_1.AbiFunctionNotFoundError(functionName, { docsPath });
      }
      if (abiItem.type !== "function")
        throw new abi_js_1.AbiFunctionNotFoundError(void 0, { docsPath });
      if (!abiItem.outputs)
        throw new abi_js_1.AbiFunctionOutputsNotFoundError(abiItem.name, { docsPath });
      const values = (0, decodeAbiParameters_js_1.decodeAbiParameters)(abiItem.outputs, data);
      if (values && values.length > 1)
        return values;
      if (values && values.length === 1)
        return values[0];
      return void 0;
    }
    exports.decodeFunctionResult = decodeFunctionResult;
  }
});

// node_modules/viem/_cjs/constants/abis.js
var require_abis = __commonJS({
  "node_modules/viem/_cjs/constants/abis.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.universalSignatureValidatorAbi = exports.smartAccountAbi = exports.addressResolverAbi = exports.textResolverAbi = exports.universalResolverReverseAbi = exports.universalResolverResolveAbi = exports.multicall3Abi = void 0;
    exports.multicall3Abi = [
      {
        inputs: [
          {
            components: [
              {
                name: "target",
                type: "address"
              },
              {
                name: "allowFailure",
                type: "bool"
              },
              {
                name: "callData",
                type: "bytes"
              }
            ],
            name: "calls",
            type: "tuple[]"
          }
        ],
        name: "aggregate3",
        outputs: [
          {
            components: [
              {
                name: "success",
                type: "bool"
              },
              {
                name: "returnData",
                type: "bytes"
              }
            ],
            name: "returnData",
            type: "tuple[]"
          }
        ],
        stateMutability: "view",
        type: "function"
      }
    ];
    var universalResolverErrors = [
      {
        inputs: [],
        name: "ResolverNotFound",
        type: "error"
      },
      {
        inputs: [],
        name: "ResolverWildcardNotSupported",
        type: "error"
      }
    ];
    exports.universalResolverResolveAbi = [
      ...universalResolverErrors,
      {
        name: "resolve",
        type: "function",
        stateMutability: "view",
        inputs: [
          { name: "name", type: "bytes" },
          { name: "data", type: "bytes" }
        ],
        outputs: [
          { name: "", type: "bytes" },
          { name: "address", type: "address" }
        ]
      }
    ];
    exports.universalResolverReverseAbi = [
      ...universalResolverErrors,
      {
        name: "reverse",
        type: "function",
        stateMutability: "view",
        inputs: [{ type: "bytes", name: "reverseName" }],
        outputs: [
          { type: "string", name: "resolvedName" },
          { type: "address", name: "resolvedAddress" },
          { type: "address", name: "reverseResolver" },
          { type: "address", name: "resolver" }
        ]
      }
    ];
    exports.textResolverAbi = [
      {
        name: "text",
        type: "function",
        stateMutability: "view",
        inputs: [
          { name: "name", type: "bytes32" },
          { name: "key", type: "string" }
        ],
        outputs: [{ name: "", type: "string" }]
      }
    ];
    exports.addressResolverAbi = [
      {
        name: "addr",
        type: "function",
        stateMutability: "view",
        inputs: [{ name: "name", type: "bytes32" }],
        outputs: [{ name: "", type: "address" }]
      },
      {
        name: "addr",
        type: "function",
        stateMutability: "view",
        inputs: [
          { name: "name", type: "bytes32" },
          { name: "coinType", type: "uint256" }
        ],
        outputs: [{ name: "", type: "bytes" }]
      }
    ];
    exports.smartAccountAbi = [
      {
        name: "isValidSignature",
        type: "function",
        stateMutability: "view",
        inputs: [
          { name: "hash", type: "bytes32" },
          { name: "signature", type: "bytes" }
        ],
        outputs: [{ name: "", type: "bytes4" }]
      }
    ];
    exports.universalSignatureValidatorAbi = [
      {
        inputs: [
          {
            internalType: "address",
            name: "_signer",
            type: "address"
          },
          {
            internalType: "bytes32",
            name: "_hash",
            type: "bytes32"
          },
          {
            internalType: "bytes",
            name: "_signature",
            type: "bytes"
          }
        ],
        stateMutability: "nonpayable",
        type: "constructor"
      }
    ];
  }
});

// node_modules/viem/_cjs/constants/contract.js
var require_contract2 = __commonJS({
  "node_modules/viem/_cjs/constants/contract.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.aggregate3Signature = void 0;
    exports.aggregate3Signature = "0x82ad56cb";
  }
});

// node_modules/viem/_cjs/errors/chain.js
var require_chain = __commonJS({
  "node_modules/viem/_cjs/errors/chain.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InvalidChainIdError = exports.ClientChainNotConfiguredError = exports.ChainNotFoundError = exports.ChainMismatchError = exports.ChainDoesNotSupportContract = void 0;
    var base_js_1 = require_base();
    var ChainDoesNotSupportContract = class extends base_js_1.BaseError {
      constructor({ blockNumber, chain, contract }) {
        super(`Chain "${chain.name}" does not support contract "${contract.name}".`, {
          metaMessages: [
            "This could be due to any of the following:",
            ...blockNumber && contract.blockCreated && contract.blockCreated > blockNumber ? [
              `- The contract "${contract.name}" was not deployed until block ${contract.blockCreated} (current block ${blockNumber}).`
            ] : [
              `- The chain does not have the contract "${contract.name}" configured.`
            ]
          ]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "ChainDoesNotSupportContract"
        });
      }
    };
    exports.ChainDoesNotSupportContract = ChainDoesNotSupportContract;
    var ChainMismatchError = class extends base_js_1.BaseError {
      constructor({ chain, currentChainId }) {
        super(`The current chain of the wallet (id: ${currentChainId}) does not match the target chain for the transaction (id: ${chain.id} \u2013 ${chain.name}).`, {
          metaMessages: [
            `Current Chain ID:  ${currentChainId}`,
            `Expected Chain ID: ${chain.id} \u2013 ${chain.name}`
          ]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "ChainMismatchError"
        });
      }
    };
    exports.ChainMismatchError = ChainMismatchError;
    var ChainNotFoundError = class extends base_js_1.BaseError {
      constructor() {
        super([
          "No chain was provided to the request.",
          "Please provide a chain with the `chain` argument on the Action, or by supplying a `chain` to WalletClient."
        ].join("\n"));
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "ChainNotFoundError"
        });
      }
    };
    exports.ChainNotFoundError = ChainNotFoundError;
    var ClientChainNotConfiguredError = class extends base_js_1.BaseError {
      constructor() {
        super("No chain was provided to the Client.");
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "ClientChainNotConfiguredError"
        });
      }
    };
    exports.ClientChainNotConfiguredError = ClientChainNotConfiguredError;
    var InvalidChainIdError = class extends base_js_1.BaseError {
      constructor({ chainId }) {
        super(`Chain ID "${chainId}" is invalid.`);
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidChainIdError"
        });
      }
    };
    exports.InvalidChainIdError = InvalidChainIdError;
  }
});

// node_modules/viem/_cjs/utils/chain.js
var require_chain2 = __commonJS({
  "node_modules/viem/_cjs/utils/chain.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getChainContractAddress = exports.defineChain = exports.assertCurrentChain = void 0;
    var chain_js_1 = require_chain();
    function assertCurrentChain({ chain, currentChainId }) {
      if (!chain)
        throw new chain_js_1.ChainNotFoundError();
      if (currentChainId !== chain.id)
        throw new chain_js_1.ChainMismatchError({ chain, currentChainId });
    }
    exports.assertCurrentChain = assertCurrentChain;
    function defineChain(chain, config = {}) {
      const { fees = chain.fees, formatters = chain.formatters, serializers = chain.serializers } = config;
      return {
        ...chain,
        fees,
        formatters,
        serializers
      };
    }
    exports.defineChain = defineChain;
    function getChainContractAddress({ blockNumber, chain, contract: name }) {
      const contract = chain?.contracts?.[name];
      if (!contract)
        throw new chain_js_1.ChainDoesNotSupportContract({
          chain,
          contract: { name }
        });
      if (blockNumber && contract.blockCreated && contract.blockCreated > blockNumber)
        throw new chain_js_1.ChainDoesNotSupportContract({
          blockNumber,
          chain,
          contract: {
            name,
            blockCreated: contract.blockCreated
          }
        });
      return contract.address;
    }
    exports.getChainContractAddress = getChainContractAddress;
  }
});

// node_modules/viem/_cjs/utils/errors/getCallError.js
var require_getCallError = __commonJS({
  "node_modules/viem/_cjs/utils/errors/getCallError.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getCallError = void 0;
    var contract_js_1 = require_contract();
    var node_js_1 = require_node();
    var getNodeError_js_1 = require_getNodeError();
    function getCallError(err, { docsPath, ...args }) {
      const cause = (() => {
        const cause2 = (0, getNodeError_js_1.getNodeError)(err, args);
        if (cause2 instanceof node_js_1.UnknownNodeError)
          return err;
        return cause2;
      })();
      return new contract_js_1.CallExecutionError(cause, {
        docsPath,
        ...args
      });
    }
    exports.getCallError = getCallError;
  }
});

// node_modules/viem/_cjs/utils/promise/createBatchScheduler.js
var require_createBatchScheduler = __commonJS({
  "node_modules/viem/_cjs/utils/promise/createBatchScheduler.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createBatchScheduler = void 0;
    var schedulerCache = /* @__PURE__ */ new Map();
    function createBatchScheduler({ fn, id, shouldSplitBatch, wait = 0 }) {
      const exec = async () => {
        const scheduler = getScheduler();
        flush();
        const args = scheduler.map(({ args: args2 }) => args2);
        if (args.length === 0)
          return;
        fn(args).then((data) => {
          scheduler.forEach(({ pendingPromise }, i) => pendingPromise.resolve?.([data[i], data]));
        }).catch((err) => {
          scheduler.forEach(({ pendingPromise }) => pendingPromise.reject?.(err));
        });
      };
      const flush = () => schedulerCache.delete(id);
      const getBatchedArgs = () => getScheduler().map(({ args }) => args);
      const getScheduler = () => schedulerCache.get(id) || [];
      const setScheduler = (item) => schedulerCache.set(id, [...getScheduler(), item]);
      return {
        flush,
        async schedule(args) {
          const pendingPromise = {};
          const promise = new Promise((resolve, reject) => {
            pendingPromise.resolve = resolve;
            pendingPromise.reject = reject;
          });
          const split2 = shouldSplitBatch?.([...getBatchedArgs(), args]);
          if (split2)
            exec();
          const hasActiveScheduler = getScheduler().length > 0;
          if (hasActiveScheduler) {
            setScheduler({ args, pendingPromise });
            return promise;
          }
          setScheduler({ args, pendingPromise });
          setTimeout(exec, wait);
          return promise;
        }
      };
    }
    exports.createBatchScheduler = createBatchScheduler;
  }
});

// node_modules/viem/_cjs/errors/ccip.js
var require_ccip = __commonJS({
  "node_modules/viem/_cjs/errors/ccip.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.OffchainLookupSenderMismatchError = exports.OffchainLookupResponseMalformedError = exports.OffchainLookupError = void 0;
    var stringify_js_1 = require_stringify();
    var base_js_1 = require_base();
    var utils_js_1 = require_utils2();
    var OffchainLookupError = class extends base_js_1.BaseError {
      constructor({ callbackSelector, cause, data, extraData, sender, urls }) {
        super(cause.shortMessage || "An error occurred while fetching for an offchain result.", {
          cause,
          metaMessages: [
            ...cause.metaMessages || [],
            cause.metaMessages?.length ? "" : [],
            "Offchain Gateway Call:",
            urls && [
              "  Gateway URL(s):",
              ...urls.map((url) => `    ${(0, utils_js_1.getUrl)(url)}`)
            ],
            `  Sender: ${sender}`,
            `  Data: ${data}`,
            `  Callback selector: ${callbackSelector}`,
            `  Extra data: ${extraData}`
          ].flat()
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "OffchainLookupError"
        });
      }
    };
    exports.OffchainLookupError = OffchainLookupError;
    var OffchainLookupResponseMalformedError = class extends base_js_1.BaseError {
      constructor({ result, url }) {
        super("Offchain gateway response is malformed. Response data must be a hex value.", {
          metaMessages: [
            `Gateway URL: ${(0, utils_js_1.getUrl)(url)}`,
            `Response: ${(0, stringify_js_1.stringify)(result)}`
          ]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "OffchainLookupResponseMalformedError"
        });
      }
    };
    exports.OffchainLookupResponseMalformedError = OffchainLookupResponseMalformedError;
    var OffchainLookupSenderMismatchError = class extends base_js_1.BaseError {
      constructor({ sender, to }) {
        super("Reverted sender address does not match target contract address (`to`).", {
          metaMessages: [
            `Contract address: ${to}`,
            `OffchainLookup sender address: ${sender}`
          ]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "OffchainLookupSenderMismatchError"
        });
      }
    };
    exports.OffchainLookupSenderMismatchError = OffchainLookupSenderMismatchError;
  }
});

// node_modules/viem/_cjs/utils/address/isAddressEqual.js
var require_isAddressEqual = __commonJS({
  "node_modules/viem/_cjs/utils/address/isAddressEqual.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isAddressEqual = void 0;
    var address_js_1 = require_address();
    var isAddress_js_1 = require_isAddress();
    function isAddressEqual(a, b) {
      if (!(0, isAddress_js_1.isAddress)(a))
        throw new address_js_1.InvalidAddressError({ address: a });
      if (!(0, isAddress_js_1.isAddress)(b))
        throw new address_js_1.InvalidAddressError({ address: b });
      return a.toLowerCase() === b.toLowerCase();
    }
    exports.isAddressEqual = isAddressEqual;
  }
});

// node_modules/viem/_cjs/utils/ccip.js
var require_ccip2 = __commonJS({
  "node_modules/viem/_cjs/utils/ccip.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ccipFetch = exports.offchainLookup = exports.offchainLookupAbiItem = exports.offchainLookupSignature = void 0;
    var call_js_1 = require_call();
    var ccip_js_1 = require_ccip();
    var request_js_1 = require_request();
    var decodeErrorResult_js_1 = require_decodeErrorResult();
    var encodeAbiParameters_js_1 = require_encodeAbiParameters();
    var isAddressEqual_js_1 = require_isAddressEqual();
    var concat_js_1 = require_concat();
    var isHex_js_1 = require_isHex();
    var stringify_js_1 = require_stringify();
    exports.offchainLookupSignature = "0x556f1830";
    exports.offchainLookupAbiItem = {
      name: "OffchainLookup",
      type: "error",
      inputs: [
        {
          name: "sender",
          type: "address"
        },
        {
          name: "urls",
          type: "string[]"
        },
        {
          name: "callData",
          type: "bytes"
        },
        {
          name: "callbackFunction",
          type: "bytes4"
        },
        {
          name: "extraData",
          type: "bytes"
        }
      ]
    };
    async function offchainLookup(client, { blockNumber, blockTag, data, to }) {
      const { args } = (0, decodeErrorResult_js_1.decodeErrorResult)({
        data,
        abi: [exports.offchainLookupAbiItem]
      });
      const [sender, urls, callData, callbackSelector, extraData] = args;
      try {
        if (!(0, isAddressEqual_js_1.isAddressEqual)(to, sender))
          throw new ccip_js_1.OffchainLookupSenderMismatchError({ sender, to });
        const result = await ccipFetch({ data: callData, sender, urls });
        const { data: data_ } = await (0, call_js_1.call)(client, {
          blockNumber,
          blockTag,
          data: (0, concat_js_1.concat)([
            callbackSelector,
            (0, encodeAbiParameters_js_1.encodeAbiParameters)([{ type: "bytes" }, { type: "bytes" }], [result, extraData])
          ]),
          to
        });
        return data_;
      } catch (err) {
        throw new ccip_js_1.OffchainLookupError({
          callbackSelector,
          cause: err,
          data,
          extraData,
          sender,
          urls
        });
      }
    }
    exports.offchainLookup = offchainLookup;
    async function ccipFetch({ data, sender, urls }) {
      let error = new Error("An unknown error occurred.");
      for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        const method = url.includes("{sender}") || url.includes("{data}") ? "GET" : "POST";
        const body = method === "POST" ? { data, sender } : void 0;
        try {
          const response = await fetch(url.replace("{sender}", sender).replace("{data}", data), {
            body: JSON.stringify(body),
            method
          });
          let result;
          if (response.headers.get("Content-Type")?.startsWith("application/json")) {
            result = (await response.json()).data;
          } else {
            result = await response.text();
          }
          if (!response.ok) {
            error = new request_js_1.HttpRequestError({
              body,
              details: (0, stringify_js_1.stringify)(result.error) || response.statusText,
              headers: response.headers,
              status: response.status,
              url
            });
            continue;
          }
          if (!(0, isHex_js_1.isHex)(result)) {
            error = new ccip_js_1.OffchainLookupResponseMalformedError({
              result,
              url
            });
            continue;
          }
          return result;
        } catch (err) {
          error = new request_js_1.HttpRequestError({
            body,
            details: err.message,
            url
          });
        }
      }
      throw error;
    }
    exports.ccipFetch = ccipFetch;
  }
});

// node_modules/viem/_cjs/actions/public/call.js
var require_call = __commonJS({
  "node_modules/viem/_cjs/actions/public/call.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getRevertErrorData = exports.call = void 0;
    var parseAccount_js_1 = require_parseAccount();
    var abis_js_1 = require_abis();
    var contract_js_1 = require_contract2();
    var base_js_1 = require_base();
    var chain_js_1 = require_chain();
    var contract_js_2 = require_contract();
    var decodeFunctionResult_js_1 = require_decodeFunctionResult();
    var encodeFunctionData_js_1 = require_encodeFunctionData();
    var chain_js_2 = require_chain2();
    var toHex_js_1 = require_toHex();
    var getCallError_js_1 = require_getCallError();
    var extract_js_1 = require_extract();
    var transactionRequest_js_1 = require_transactionRequest();
    var createBatchScheduler_js_1 = require_createBatchScheduler();
    var assertRequest_js_1 = require_assertRequest();
    async function call(client, args) {
      const { account: account_ = client.account, batch = Boolean(client.batch?.multicall), blockNumber, blockTag = "latest", accessList, data, gas, gasPrice, maxFeePerGas, maxPriorityFeePerGas, nonce, to, value, ...rest } = args;
      const account = account_ ? (0, parseAccount_js_1.parseAccount)(account_) : void 0;
      try {
        (0, assertRequest_js_1.assertRequest)(args);
        const blockNumberHex = blockNumber ? (0, toHex_js_1.numberToHex)(blockNumber) : void 0;
        const block = blockNumberHex || blockTag;
        const format = client.chain?.formatters?.transactionRequest?.format || transactionRequest_js_1.formatTransactionRequest;
        const request = format({
          ...(0, extract_js_1.extract)(rest, { format }),
          from: account?.address,
          accessList,
          data,
          gas,
          gasPrice,
          maxFeePerGas,
          maxPriorityFeePerGas,
          nonce,
          to,
          value
        });
        if (batch && shouldPerformMulticall({ request })) {
          try {
            return await scheduleMulticall(client, {
              ...request,
              blockNumber,
              blockTag
            });
          } catch (err) {
            if (!(err instanceof chain_js_1.ClientChainNotConfiguredError) && !(err instanceof chain_js_1.ChainDoesNotSupportContract))
              throw err;
          }
        }
        const response = await client.request({
          method: "eth_call",
          params: block ? [request, block] : [request]
        });
        if (response === "0x")
          return { data: void 0 };
        return { data: response };
      } catch (err) {
        const data2 = getRevertErrorData(err);
        const { offchainLookup, offchainLookupSignature } = await Promise.resolve().then(() => require_ccip2());
        if (data2?.slice(0, 10) === offchainLookupSignature && to) {
          return { data: await offchainLookup(client, { data: data2, to }) };
        }
        throw (0, getCallError_js_1.getCallError)(err, {
          ...args,
          account,
          chain: client.chain
        });
      }
    }
    exports.call = call;
    function shouldPerformMulticall({ request }) {
      const { data, to, ...request_ } = request;
      if (!data)
        return false;
      if (data.startsWith(contract_js_1.aggregate3Signature))
        return false;
      if (!to)
        return false;
      if (Object.values(request_).filter((x) => typeof x !== "undefined").length > 0)
        return false;
      return true;
    }
    async function scheduleMulticall(client, args) {
      const { batchSize = 1024, wait = 0 } = typeof client.batch?.multicall === "object" ? client.batch.multicall : {};
      const { blockNumber, blockTag = "latest", data, multicallAddress: multicallAddress_, to } = args;
      let multicallAddress = multicallAddress_;
      if (!multicallAddress) {
        if (!client.chain)
          throw new chain_js_1.ClientChainNotConfiguredError();
        multicallAddress = (0, chain_js_2.getChainContractAddress)({
          blockNumber,
          chain: client.chain,
          contract: "multicall3"
        });
      }
      const blockNumberHex = blockNumber ? (0, toHex_js_1.numberToHex)(blockNumber) : void 0;
      const block = blockNumberHex || blockTag;
      const { schedule } = (0, createBatchScheduler_js_1.createBatchScheduler)({
        id: `${client.uid}.${block}`,
        wait,
        shouldSplitBatch(args2) {
          const size2 = args2.reduce((size3, { data: data2 }) => size3 + (data2.length - 2), 0);
          return size2 > batchSize * 2;
        },
        fn: async (requests) => {
          const calls = requests.map((request) => ({
            allowFailure: true,
            callData: request.data,
            target: request.to
          }));
          const calldata = (0, encodeFunctionData_js_1.encodeFunctionData)({
            abi: abis_js_1.multicall3Abi,
            args: [calls],
            functionName: "aggregate3"
          });
          const data2 = await client.request({
            method: "eth_call",
            params: [
              {
                data: calldata,
                to: multicallAddress
              },
              block
            ]
          });
          return (0, decodeFunctionResult_js_1.decodeFunctionResult)({
            abi: abis_js_1.multicall3Abi,
            args: [calls],
            functionName: "aggregate3",
            data: data2 || "0x"
          });
        }
      });
      const [{ returnData, success }] = await schedule({ data, to });
      if (!success)
        throw new contract_js_2.RawContractError({ data: returnData });
      if (returnData === "0x")
        return { data: void 0 };
      return { data: returnData };
    }
    function getRevertErrorData(err) {
      if (!(err instanceof base_js_1.BaseError))
        return void 0;
      const error = err.walk();
      return typeof error.data === "object" ? error.data.data : error.data;
    }
    exports.getRevertErrorData = getRevertErrorData;
  }
});

// node_modules/viem/_cjs/actions/public/readContract.js
var require_readContract = __commonJS({
  "node_modules/viem/_cjs/actions/public/readContract.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.readContract = void 0;
    var decodeFunctionResult_js_1 = require_decodeFunctionResult();
    var encodeFunctionData_js_1 = require_encodeFunctionData();
    var getContractError_js_1 = require_getContractError();
    var call_js_1 = require_call();
    async function readContract(client, { abi: abi2, address, args, functionName, ...callRequest }) {
      const calldata = (0, encodeFunctionData_js_1.encodeFunctionData)({
        abi: abi2,
        args,
        functionName
      });
      try {
        const { data } = await (0, call_js_1.call)(client, {
          data: calldata,
          to: address,
          ...callRequest
        });
        return (0, decodeFunctionResult_js_1.decodeFunctionResult)({
          abi: abi2,
          args,
          functionName,
          data: data || "0x"
        });
      } catch (err) {
        throw (0, getContractError_js_1.getContractError)(err, {
          abi: abi2,
          address,
          args,
          docsPath: "/docs/contract/readContract",
          functionName
        });
      }
    }
    exports.readContract = readContract;
  }
});

// node_modules/viem/_cjs/actions/public/simulateContract.js
var require_simulateContract = __commonJS({
  "node_modules/viem/_cjs/actions/public/simulateContract.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.simulateContract = void 0;
    var parseAccount_js_1 = require_parseAccount();
    var decodeFunctionResult_js_1 = require_decodeFunctionResult();
    var encodeFunctionData_js_1 = require_encodeFunctionData();
    var getContractError_js_1 = require_getContractError();
    var call_js_1 = require_call();
    async function simulateContract(client, { abi: abi2, address, args, dataSuffix, functionName, ...callRequest }) {
      const account = callRequest.account ? (0, parseAccount_js_1.parseAccount)(callRequest.account) : void 0;
      const calldata = (0, encodeFunctionData_js_1.encodeFunctionData)({
        abi: abi2,
        args,
        functionName
      });
      try {
        const { data } = await (0, call_js_1.call)(client, {
          batch: false,
          data: `${calldata}${dataSuffix ? dataSuffix.replace("0x", "") : ""}`,
          to: address,
          ...callRequest
        });
        const result = (0, decodeFunctionResult_js_1.decodeFunctionResult)({
          abi: abi2,
          args,
          functionName,
          data: data || "0x"
        });
        return {
          result,
          request: {
            abi: abi2,
            address,
            args,
            dataSuffix,
            functionName,
            ...callRequest
          }
        };
      } catch (err) {
        throw (0, getContractError_js_1.getContractError)(err, {
          abi: abi2,
          address,
          args,
          docsPath: "/docs/contract/simulateContract",
          functionName,
          sender: account?.address
        });
      }
    }
    exports.simulateContract = simulateContract;
  }
});

// node_modules/viem/_cjs/utils/observe.js
var require_observe = __commonJS({
  "node_modules/viem/_cjs/utils/observe.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.observe = exports.cleanupCache = exports.listenersCache = void 0;
    exports.listenersCache = /* @__PURE__ */ new Map();
    exports.cleanupCache = /* @__PURE__ */ new Map();
    var callbackCount = 0;
    function observe(observerId, callbacks, fn) {
      const callbackId = ++callbackCount;
      const getListeners = () => exports.listenersCache.get(observerId) || [];
      const unsubscribe = () => {
        const listeners2 = getListeners();
        exports.listenersCache.set(observerId, listeners2.filter((cb) => cb.id !== callbackId));
      };
      const unwatch = () => {
        const cleanup2 = exports.cleanupCache.get(observerId);
        if (getListeners().length === 1 && cleanup2)
          cleanup2();
        unsubscribe();
      };
      const listeners = getListeners();
      exports.listenersCache.set(observerId, [
        ...listeners,
        { id: callbackId, fns: callbacks }
      ]);
      if (listeners && listeners.length > 0)
        return unwatch;
      const emit = {};
      for (const key in callbacks) {
        emit[key] = (...args) => {
          const listeners2 = getListeners();
          if (listeners2.length === 0)
            return;
          listeners2.forEach((listener) => listener.fns[key]?.(...args));
        };
      }
      const cleanup = fn(emit);
      if (typeof cleanup === "function")
        exports.cleanupCache.set(observerId, cleanup);
      return unwatch;
    }
    exports.observe = observe;
  }
});

// node_modules/viem/_cjs/utils/wait.js
var require_wait = __commonJS({
  "node_modules/viem/_cjs/utils/wait.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.wait = void 0;
    async function wait(time) {
      return new Promise((res) => setTimeout(res, time));
    }
    exports.wait = wait;
  }
});

// node_modules/viem/_cjs/utils/poll.js
var require_poll = __commonJS({
  "node_modules/viem/_cjs/utils/poll.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.poll = void 0;
    var wait_js_1 = require_wait();
    function poll(fn, { emitOnBegin, initialWaitTime, interval }) {
      let active = true;
      const unwatch = () => active = false;
      const watch = async () => {
        let data = void 0;
        if (emitOnBegin)
          data = await fn({ unpoll: unwatch });
        const initialWait = await initialWaitTime?.(data) ?? interval;
        await (0, wait_js_1.wait)(initialWait);
        const poll2 = async () => {
          if (!active)
            return;
          await fn({ unpoll: unwatch });
          await (0, wait_js_1.wait)(interval);
          poll2();
        };
        poll2();
      };
      watch();
      return unwatch;
    }
    exports.poll = poll;
  }
});

// node_modules/viem/_cjs/utils/promise/withCache.js
var require_withCache = __commonJS({
  "node_modules/viem/_cjs/utils/promise/withCache.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.withCache = exports.getCache = exports.responseCache = exports.promiseCache = void 0;
    exports.promiseCache = /* @__PURE__ */ new Map();
    exports.responseCache = /* @__PURE__ */ new Map();
    function getCache(cacheKey) {
      const buildCache = (cacheKey2, cache) => ({
        clear: () => cache.delete(cacheKey2),
        get: () => cache.get(cacheKey2),
        set: (data) => cache.set(cacheKey2, data)
      });
      const promise = buildCache(cacheKey, exports.promiseCache);
      const response = buildCache(cacheKey, exports.responseCache);
      return {
        clear: () => {
          promise.clear();
          response.clear();
        },
        promise,
        response
      };
    }
    exports.getCache = getCache;
    async function withCache(fn, { cacheKey, cacheTime = Infinity }) {
      const cache = getCache(cacheKey);
      const response = cache.response.get();
      if (response && cacheTime > 0) {
        const age = (/* @__PURE__ */ new Date()).getTime() - response.created.getTime();
        if (age < cacheTime)
          return response.data;
      }
      let promise = cache.promise.get();
      if (!promise) {
        promise = fn();
        cache.promise.set(promise);
      }
      try {
        const data = await promise;
        cache.response.set({ created: /* @__PURE__ */ new Date(), data });
        return data;
      } finally {
        cache.promise.clear();
      }
    }
    exports.withCache = withCache;
  }
});

// node_modules/viem/_cjs/actions/public/getBlockNumber.js
var require_getBlockNumber = __commonJS({
  "node_modules/viem/_cjs/actions/public/getBlockNumber.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getBlockNumber = exports.getBlockNumberCache = void 0;
    var withCache_js_1 = require_withCache();
    var cacheKey = (id) => `blockNumber.${id}`;
    function getBlockNumberCache(id) {
      return (0, withCache_js_1.getCache)(cacheKey(id));
    }
    exports.getBlockNumberCache = getBlockNumberCache;
    async function getBlockNumber(client, { cacheTime = client.cacheTime, maxAge } = {}) {
      const blockNumberHex = await (0, withCache_js_1.withCache)(() => client.request({
        method: "eth_blockNumber"
      }), { cacheKey: cacheKey(client.uid), cacheTime: maxAge ?? cacheTime });
      return BigInt(blockNumberHex);
    }
    exports.getBlockNumber = getBlockNumber;
  }
});

// node_modules/viem/_cjs/actions/public/getFilterChanges.js
var require_getFilterChanges = __commonJS({
  "node_modules/viem/_cjs/actions/public/getFilterChanges.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getFilterChanges = void 0;
    var abi_js_1 = require_abi();
    var decodeEventLog_js_1 = require_decodeEventLog();
    var log_js_1 = require_log2();
    async function getFilterChanges(_client, { filter }) {
      const strict = "strict" in filter && filter.strict;
      const logs = await filter.request({
        method: "eth_getFilterChanges",
        params: [filter.id]
      });
      return logs.map((log) => {
        if (typeof log === "string")
          return log;
        try {
          const { eventName, args } = "abi" in filter && filter.abi ? (0, decodeEventLog_js_1.decodeEventLog)({
            abi: filter.abi,
            data: log.data,
            topics: log.topics,
            strict
          }) : { eventName: void 0, args: void 0 };
          return (0, log_js_1.formatLog)(log, { args, eventName });
        } catch (err) {
          let eventName;
          let isUnnamed;
          if (err instanceof abi_js_1.DecodeLogDataMismatch || err instanceof abi_js_1.DecodeLogTopicsMismatch) {
            if ("strict" in filter && filter.strict)
              return;
            eventName = err.abiItem.name;
            isUnnamed = err.abiItem.inputs?.some((x) => !("name" in x && x.name));
          }
          return (0, log_js_1.formatLog)(log, { args: isUnnamed ? [] : {}, eventName });
        }
      }).filter(Boolean);
    }
    exports.getFilterChanges = getFilterChanges;
  }
});

// node_modules/viem/_cjs/actions/public/uninstallFilter.js
var require_uninstallFilter = __commonJS({
  "node_modules/viem/_cjs/actions/public/uninstallFilter.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.uninstallFilter = void 0;
    async function uninstallFilter(_client, { filter }) {
      return filter.request({
        method: "eth_uninstallFilter",
        params: [filter.id]
      });
    }
    exports.uninstallFilter = uninstallFilter;
  }
});

// node_modules/viem/_cjs/actions/public/watchContractEvent.js
var require_watchContractEvent = __commonJS({
  "node_modules/viem/_cjs/actions/public/watchContractEvent.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.watchContractEvent = void 0;
    var observe_js_1 = require_observe();
    var poll_js_1 = require_poll();
    var stringify_js_1 = require_stringify();
    var abi_js_1 = require_abi();
    var rpc_js_1 = require_rpc();
    var decodeEventLog_js_1 = require_decodeEventLog();
    var encodeEventTopics_js_1 = require_encodeEventTopics();
    var log_js_1 = require_log2();
    var createContractEventFilter_js_1 = require_createContractEventFilter();
    var getBlockNumber_js_1 = require_getBlockNumber();
    var getContractEvents_js_1 = require_getContractEvents();
    var getFilterChanges_js_1 = require_getFilterChanges();
    var uninstallFilter_js_1 = require_uninstallFilter();
    function watchContractEvent(client, { abi: abi2, address, args, batch = true, eventName, onError, onLogs, poll: poll_, pollingInterval = client.pollingInterval, strict: strict_ }) {
      const enablePolling = typeof poll_ !== "undefined" ? poll_ : client.transport.type !== "webSocket";
      const pollContractEvent = () => {
        const observerId = (0, stringify_js_1.stringify)([
          "watchContractEvent",
          address,
          args,
          batch,
          client.uid,
          eventName,
          pollingInterval
        ]);
        const strict = strict_ ?? false;
        return (0, observe_js_1.observe)(observerId, { onLogs, onError }, (emit) => {
          let previousBlockNumber;
          let filter;
          let initialized = false;
          const unwatch = (0, poll_js_1.poll)(async () => {
            if (!initialized) {
              try {
                filter = await (0, createContractEventFilter_js_1.createContractEventFilter)(client, {
                  abi: abi2,
                  address,
                  args,
                  eventName,
                  strict
                });
              } catch {
              }
              initialized = true;
              return;
            }
            try {
              let logs;
              if (filter) {
                logs = await (0, getFilterChanges_js_1.getFilterChanges)(client, { filter });
              } else {
                const blockNumber = await (0, getBlockNumber_js_1.getBlockNumber)(client);
                if (previousBlockNumber && previousBlockNumber !== blockNumber) {
                  logs = await (0, getContractEvents_js_1.getContractEvents)(client, {
                    abi: abi2,
                    address,
                    args,
                    fromBlock: previousBlockNumber + 1n,
                    toBlock: blockNumber,
                    strict
                  });
                } else {
                  logs = [];
                }
                previousBlockNumber = blockNumber;
              }
              if (logs.length === 0)
                return;
              if (batch)
                emit.onLogs(logs);
              else
                logs.forEach((log) => emit.onLogs([log]));
            } catch (err) {
              if (filter && err instanceof rpc_js_1.InvalidInputRpcError)
                initialized = false;
              emit.onError?.(err);
            }
          }, {
            emitOnBegin: true,
            interval: pollingInterval
          });
          return async () => {
            if (filter)
              await (0, uninstallFilter_js_1.uninstallFilter)(client, { filter });
            unwatch();
          };
        });
      };
      const subscribeContractEvent = () => {
        let active = true;
        let unsubscribe = () => active = false;
        (async () => {
          try {
            const topics = eventName ? (0, encodeEventTopics_js_1.encodeEventTopics)({
              abi: abi2,
              eventName,
              args
            }) : [];
            const { unsubscribe: unsubscribe_ } = await client.transport.subscribe({
              params: ["logs", { address, topics }],
              onData(data) {
                if (!active)
                  return;
                const log = data.result;
                try {
                  const { eventName: eventName2, args: args2 } = (0, decodeEventLog_js_1.decodeEventLog)({
                    abi: abi2,
                    data: log.data,
                    topics: log.topics,
                    strict: strict_
                  });
                  const formatted = (0, log_js_1.formatLog)(log, {
                    args: args2,
                    eventName: eventName2
                  });
                  onLogs([formatted]);
                } catch (err) {
                  let eventName2;
                  let isUnnamed;
                  if (err instanceof abi_js_1.DecodeLogDataMismatch || err instanceof abi_js_1.DecodeLogTopicsMismatch) {
                    if (strict_)
                      return;
                    eventName2 = err.abiItem.name;
                    isUnnamed = err.abiItem.inputs?.some((x) => !("name" in x && x.name));
                  }
                  const formatted = (0, log_js_1.formatLog)(log, {
                    args: isUnnamed ? [] : {},
                    eventName: eventName2
                  });
                  onLogs([formatted]);
                }
              },
              onError(error) {
                onError?.(error);
              }
            });
            unsubscribe = unsubscribe_;
            if (!active)
              unsubscribe();
          } catch (err) {
            onError?.(err);
          }
        })();
        return unsubscribe;
      };
      return enablePolling ? pollContractEvent() : subscribeContractEvent();
    }
    exports.watchContractEvent = watchContractEvent;
  }
});

// node_modules/viem/_cjs/utils/errors/getTransactionError.js
var require_getTransactionError = __commonJS({
  "node_modules/viem/_cjs/utils/errors/getTransactionError.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getTransactionError = void 0;
    var node_js_1 = require_node();
    var transaction_js_1 = require_transaction();
    var getNodeError_js_1 = require_getNodeError();
    function getTransactionError(err, { docsPath, ...args }) {
      const cause = (() => {
        const cause2 = (0, getNodeError_js_1.getNodeError)(err, args);
        if (cause2 instanceof node_js_1.UnknownNodeError)
          return err;
        return cause2;
      })();
      return new transaction_js_1.TransactionExecutionError(cause, {
        docsPath,
        ...args
      });
    }
    exports.getTransactionError = getTransactionError;
  }
});

// node_modules/viem/_cjs/actions/public/getChainId.js
var require_getChainId = __commonJS({
  "node_modules/viem/_cjs/actions/public/getChainId.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getChainId = void 0;
    var fromHex_js_1 = require_fromHex();
    async function getChainId(client) {
      const chainIdHex = await client.request({
        method: "eth_chainId"
      });
      return (0, fromHex_js_1.hexToNumber)(chainIdHex);
    }
    exports.getChainId = getChainId;
  }
});

// node_modules/viem/_cjs/actions/wallet/sendRawTransaction.js
var require_sendRawTransaction = __commonJS({
  "node_modules/viem/_cjs/actions/wallet/sendRawTransaction.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.sendRawTransaction = void 0;
    async function sendRawTransaction(client, { serializedTransaction }) {
      return client.request({
        method: "eth_sendRawTransaction",
        params: [serializedTransaction]
      });
    }
    exports.sendRawTransaction = sendRawTransaction;
  }
});

// node_modules/viem/_cjs/actions/wallet/sendTransaction.js
var require_sendTransaction = __commonJS({
  "node_modules/viem/_cjs/actions/wallet/sendTransaction.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.sendTransaction = void 0;
    var parseAccount_js_1 = require_parseAccount();
    var account_js_1 = require_account();
    var chain_js_1 = require_chain2();
    var getTransactionError_js_1 = require_getTransactionError();
    var extract_js_1 = require_extract();
    var transactionRequest_js_1 = require_transactionRequest();
    var assertRequest_js_1 = require_assertRequest();
    var getChainId_js_1 = require_getChainId();
    var prepareTransactionRequest_js_1 = require_prepareTransactionRequest();
    var sendRawTransaction_js_1 = require_sendRawTransaction();
    async function sendTransaction(client, args) {
      const { account: account_ = client.account, chain = client.chain, accessList, data, gas, gasPrice, maxFeePerGas, maxPriorityFeePerGas, nonce, to, value, ...rest } = args;
      if (!account_)
        throw new account_js_1.AccountNotFoundError({
          docsPath: "/docs/actions/wallet/sendTransaction"
        });
      const account = (0, parseAccount_js_1.parseAccount)(account_);
      try {
        (0, assertRequest_js_1.assertRequest)(args);
        let chainId;
        if (chain !== null) {
          chainId = await (0, getChainId_js_1.getChainId)(client);
          (0, chain_js_1.assertCurrentChain)({
            currentChainId: chainId,
            chain
          });
        }
        if (account.type === "local") {
          const request2 = await (0, prepareTransactionRequest_js_1.prepareTransactionRequest)(client, {
            account,
            accessList,
            chain,
            data,
            gas,
            gasPrice,
            maxFeePerGas,
            maxPriorityFeePerGas,
            nonce,
            to,
            value,
            ...rest
          });
          if (!chainId)
            chainId = await (0, getChainId_js_1.getChainId)(client);
          const serializer = chain?.serializers?.transaction;
          const serializedTransaction = await account.signTransaction({
            ...request2,
            chainId
          }, { serializer });
          return await (0, sendRawTransaction_js_1.sendRawTransaction)(client, {
            serializedTransaction
          });
        }
        const format = chain?.formatters?.transactionRequest?.format || transactionRequest_js_1.formatTransactionRequest;
        const request = format({
          ...(0, extract_js_1.extract)(rest, { format }),
          accessList,
          data,
          from: account.address,
          gas,
          gasPrice,
          maxFeePerGas,
          maxPriorityFeePerGas,
          nonce,
          to,
          value
        });
        return await client.request({
          method: "eth_sendTransaction",
          params: [request]
        });
      } catch (err) {
        throw (0, getTransactionError_js_1.getTransactionError)(err, {
          ...args,
          account,
          chain: args.chain || void 0
        });
      }
    }
    exports.sendTransaction = sendTransaction;
  }
});

// node_modules/viem/_cjs/actions/wallet/writeContract.js
var require_writeContract = __commonJS({
  "node_modules/viem/_cjs/actions/wallet/writeContract.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.writeContract = void 0;
    var encodeFunctionData_js_1 = require_encodeFunctionData();
    var sendTransaction_js_1 = require_sendTransaction();
    async function writeContract(client, { abi: abi2, address, args, dataSuffix, functionName, ...request }) {
      const data = (0, encodeFunctionData_js_1.encodeFunctionData)({
        abi: abi2,
        args,
        functionName
      });
      const hash2 = await (0, sendTransaction_js_1.sendTransaction)(client, {
        data: `${data}${dataSuffix ? dataSuffix.replace("0x", "") : ""}`,
        to: address,
        ...request
      });
      return hash2;
    }
    exports.writeContract = writeContract;
  }
});

// node_modules/viem/_cjs/actions/getContract.js
var require_getContract = __commonJS({
  "node_modules/viem/_cjs/actions/getContract.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getEventParameters = exports.getFunctionParameters = exports.getContract = void 0;
    var createContractEventFilter_js_1 = require_createContractEventFilter();
    var estimateContractGas_js_1 = require_estimateContractGas();
    var getContractEvents_js_1 = require_getContractEvents();
    var readContract_js_1 = require_readContract();
    var simulateContract_js_1 = require_simulateContract();
    var watchContractEvent_js_1 = require_watchContractEvent();
    var writeContract_js_1 = require_writeContract();
    function getContract({ abi: abi2, address, publicClient, walletClient }) {
      const hasPublicClient = publicClient !== void 0 && publicClient !== null;
      const hasWalletClient = walletClient !== void 0 && walletClient !== null;
      const contract = {};
      let hasReadFunction = false;
      let hasWriteFunction = false;
      let hasEvent = false;
      for (const item of abi2) {
        if (item.type === "function")
          if (item.stateMutability === "view" || item.stateMutability === "pure")
            hasReadFunction = true;
          else
            hasWriteFunction = true;
        else if (item.type === "event")
          hasEvent = true;
        if (hasReadFunction && hasWriteFunction && hasEvent)
          break;
      }
      if (hasPublicClient) {
        if (hasReadFunction)
          contract.read = new Proxy({}, {
            get(_, functionName) {
              return (...parameters) => {
                const { args, options } = getFunctionParameters(parameters);
                return (0, readContract_js_1.readContract)(publicClient, {
                  abi: abi2,
                  address,
                  functionName,
                  args,
                  ...options
                });
              };
            }
          });
        if (hasWriteFunction)
          contract.simulate = new Proxy({}, {
            get(_, functionName) {
              return (...parameters) => {
                const { args, options } = getFunctionParameters(parameters);
                return (0, simulateContract_js_1.simulateContract)(publicClient, {
                  abi: abi2,
                  address,
                  functionName,
                  args,
                  ...options
                });
              };
            }
          });
        if (hasEvent) {
          contract.createEventFilter = new Proxy({}, {
            get(_, eventName) {
              return (...parameters) => {
                const abiEvent = abi2.find((x) => x.type === "event" && x.name === eventName);
                const { args, options } = getEventParameters(parameters, abiEvent);
                return (0, createContractEventFilter_js_1.createContractEventFilter)(publicClient, {
                  abi: abi2,
                  address,
                  eventName,
                  args,
                  ...options
                });
              };
            }
          });
          contract.getEvents = new Proxy({}, {
            get(_, eventName) {
              return (...parameters) => {
                const abiEvent = abi2.find((x) => x.type === "event" && x.name === eventName);
                const { args, options } = getEventParameters(parameters, abiEvent);
                return (0, getContractEvents_js_1.getContractEvents)(publicClient, {
                  abi: abi2,
                  address,
                  eventName,
                  args,
                  ...options
                });
              };
            }
          });
          contract.watchEvent = new Proxy({}, {
            get(_, eventName) {
              return (...parameters) => {
                const abiEvent = abi2.find((x) => x.type === "event" && x.name === eventName);
                const { args, options } = getEventParameters(parameters, abiEvent);
                return (0, watchContractEvent_js_1.watchContractEvent)(publicClient, {
                  abi: abi2,
                  address,
                  eventName,
                  args,
                  ...options
                });
              };
            }
          });
        }
      }
      if (hasWalletClient) {
        if (hasWriteFunction)
          contract.write = new Proxy({}, {
            get(_, functionName) {
              return (...parameters) => {
                const { args, options } = getFunctionParameters(parameters);
                return (0, writeContract_js_1.writeContract)(walletClient, {
                  abi: abi2,
                  address,
                  functionName,
                  args,
                  ...options
                });
              };
            }
          });
      }
      if (hasPublicClient || hasWalletClient) {
        if (hasWriteFunction)
          contract.estimateGas = new Proxy({}, {
            get(_, functionName) {
              return (...parameters) => {
                const { args, options } = getFunctionParameters(parameters);
                const client = publicClient ?? walletClient;
                return (0, estimateContractGas_js_1.estimateContractGas)(client, {
                  abi: abi2,
                  address,
                  functionName,
                  args,
                  ...options,
                  account: options.account ?? walletClient.account
                });
              };
            }
          });
      }
      contract.address = address;
      contract.abi = abi2;
      return contract;
    }
    exports.getContract = getContract;
    function getFunctionParameters(values) {
      const hasArgs = values.length && Array.isArray(values[0]);
      const args = hasArgs ? values[0] : [];
      const options = (hasArgs ? values[1] : values[0]) ?? {};
      return { args, options };
    }
    exports.getFunctionParameters = getFunctionParameters;
    function getEventParameters(values, abiEvent) {
      let hasArgs = false;
      if (Array.isArray(values[0]))
        hasArgs = true;
      else if (values.length === 1) {
        hasArgs = abiEvent.inputs.some((x) => x.indexed);
      } else if (values.length === 2) {
        hasArgs = true;
      }
      const args = hasArgs ? values[0] : void 0;
      const options = (hasArgs ? values[1] : values[0]) ?? {};
      return { args, options };
    }
    exports.getEventParameters = getEventParameters;
  }
});

// node_modules/viem/_cjs/accounts/utils/publicKeyToAddress.js
var require_publicKeyToAddress = __commonJS({
  "node_modules/viem/_cjs/accounts/utils/publicKeyToAddress.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.publicKeyToAddress = void 0;
    var getAddress_js_1 = require_getAddress();
    var keccak256_js_1 = require_keccak256();
    function publicKeyToAddress(publicKey) {
      const address = (0, keccak256_js_1.keccak256)(`0x${publicKey.substring(4)}`).substring(26);
      return (0, getAddress_js_1.checksumAddress)(`0x${address}`);
    }
    exports.publicKeyToAddress = publicKeyToAddress;
  }
});

// node_modules/viem/_cjs/utils/accounts.js
var require_accounts = __commonJS({
  "node_modules/viem/_cjs/utils/accounts.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.publicKeyToAddress = exports.parseAccount = void 0;
    var parseAccount_js_1 = require_parseAccount();
    Object.defineProperty(exports, "parseAccount", { enumerable: true, get: function() {
      return parseAccount_js_1.parseAccount;
    } });
    var publicKeyToAddress_js_1 = require_publicKeyToAddress();
    Object.defineProperty(exports, "publicKeyToAddress", { enumerable: true, get: function() {
      return publicKeyToAddress_js_1.publicKeyToAddress;
    } });
  }
});

// node_modules/viem/_cjs/utils/uid.js
var require_uid = __commonJS({
  "node_modules/viem/_cjs/utils/uid.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.uid = void 0;
    var size2 = 256;
    var index = size2;
    var buffer;
    function uid(length = 11) {
      if (!buffer || index + length > size2 * 2) {
        buffer = "";
        index = 0;
        for (let i = 0; i < size2; i++) {
          buffer += (256 + Math.random() * 256 | 0).toString(16).substring(1);
        }
      }
      return buffer.substring(index, index++ + length);
    }
    exports.uid = uid;
  }
});

// node_modules/viem/_cjs/clients/createClient.js
var require_createClient = __commonJS({
  "node_modules/viem/_cjs/clients/createClient.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createClient = void 0;
    var accounts_js_1 = require_accounts();
    var uid_js_1 = require_uid();
    function createClient(parameters) {
      const { batch, cacheTime = parameters.pollingInterval ?? 4e3, key = "base", name = "Base Client", pollingInterval = 4e3, type = "base" } = parameters;
      const chain = parameters.chain;
      const account = parameters.account ? (0, accounts_js_1.parseAccount)(parameters.account) : void 0;
      const { config, request, value } = parameters.transport({
        chain,
        pollingInterval
      });
      const transport = { ...config, ...value };
      const client = {
        account,
        batch,
        cacheTime,
        chain,
        key,
        name,
        pollingInterval,
        request,
        transport,
        type,
        uid: (0, uid_js_1.uid)()
      };
      function extend(base) {
        return (extendFn) => {
          const extended = extendFn(base);
          for (const key2 in client)
            delete extended[key2];
          const combined = { ...base, ...extended };
          return Object.assign(combined, { extend: extend(combined) });
        };
      }
      return Object.assign(client, { extend: extend(client) });
    }
    exports.createClient = createClient;
  }
});

// node_modules/viem/_cjs/utils/promise/withRetry.js
var require_withRetry = __commonJS({
  "node_modules/viem/_cjs/utils/promise/withRetry.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.withRetry = void 0;
    var wait_js_1 = require_wait();
    function withRetry(fn, { delay: delay_ = 100, retryCount = 2, shouldRetry = () => true } = {}) {
      return new Promise((resolve, reject) => {
        const attemptRetry = async ({ count = 0 } = {}) => {
          const retry = async ({ error }) => {
            const delay = typeof delay_ === "function" ? delay_({ count, error }) : delay_;
            if (delay)
              await (0, wait_js_1.wait)(delay);
            attemptRetry({ count: count + 1 });
          };
          try {
            const data = await fn();
            resolve(data);
          } catch (err) {
            if (count < retryCount && await shouldRetry({ count, error: err }))
              return retry({ error: err });
            reject(err);
          }
        };
        attemptRetry();
      });
    }
    exports.withRetry = withRetry;
  }
});

// node_modules/viem/_cjs/utils/buildRequest.js
var require_buildRequest = __commonJS({
  "node_modules/viem/_cjs/utils/buildRequest.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.buildRequest = exports.isDeterministicError = void 0;
    var base_js_1 = require_base();
    var request_js_1 = require_request();
    var rpc_js_1 = require_rpc();
    var withRetry_js_1 = require_withRetry();
    var isDeterministicError = (error) => {
      if ("code" in error)
        return error.code !== -1 && error.code !== -32004 && error.code !== -32005 && error.code !== -32042 && error.code !== -32603;
      if (error instanceof request_js_1.HttpRequestError && error.status)
        return error.status !== 403 && error.status !== 408 && error.status !== 413 && error.status !== 429 && error.status !== 500 && error.status !== 502 && error.status !== 503 && error.status !== 504;
      return false;
    };
    exports.isDeterministicError = isDeterministicError;
    function buildRequest(request, { retryDelay = 150, retryCount = 3 } = {}) {
      return async (args) => (0, withRetry_js_1.withRetry)(async () => {
        try {
          return await request(args);
        } catch (err_) {
          const err = err_;
          switch (err.code) {
            case rpc_js_1.ParseRpcError.code:
              throw new rpc_js_1.ParseRpcError(err);
            case rpc_js_1.InvalidRequestRpcError.code:
              throw new rpc_js_1.InvalidRequestRpcError(err);
            case rpc_js_1.MethodNotFoundRpcError.code:
              throw new rpc_js_1.MethodNotFoundRpcError(err);
            case rpc_js_1.InvalidParamsRpcError.code:
              throw new rpc_js_1.InvalidParamsRpcError(err);
            case rpc_js_1.InternalRpcError.code:
              throw new rpc_js_1.InternalRpcError(err);
            case rpc_js_1.InvalidInputRpcError.code:
              throw new rpc_js_1.InvalidInputRpcError(err);
            case rpc_js_1.ResourceNotFoundRpcError.code:
              throw new rpc_js_1.ResourceNotFoundRpcError(err);
            case rpc_js_1.ResourceUnavailableRpcError.code:
              throw new rpc_js_1.ResourceUnavailableRpcError(err);
            case rpc_js_1.TransactionRejectedRpcError.code:
              throw new rpc_js_1.TransactionRejectedRpcError(err);
            case rpc_js_1.MethodNotSupportedRpcError.code:
              throw new rpc_js_1.MethodNotSupportedRpcError(err);
            case rpc_js_1.LimitExceededRpcError.code:
              throw new rpc_js_1.LimitExceededRpcError(err);
            case rpc_js_1.JsonRpcVersionUnsupportedError.code:
              throw new rpc_js_1.JsonRpcVersionUnsupportedError(err);
            case rpc_js_1.UserRejectedRequestError.code:
              throw new rpc_js_1.UserRejectedRequestError(err);
            case rpc_js_1.UnauthorizedProviderError.code:
              throw new rpc_js_1.UnauthorizedProviderError(err);
            case rpc_js_1.UnsupportedProviderMethodError.code:
              throw new rpc_js_1.UnsupportedProviderMethodError(err);
            case rpc_js_1.ProviderDisconnectedError.code:
              throw new rpc_js_1.ProviderDisconnectedError(err);
            case rpc_js_1.ChainDisconnectedError.code:
              throw new rpc_js_1.ChainDisconnectedError(err);
            case rpc_js_1.SwitchChainError.code:
              throw new rpc_js_1.SwitchChainError(err);
            case 5e3:
              throw new rpc_js_1.UserRejectedRequestError(err);
            default:
              if (err_ instanceof base_js_1.BaseError)
                throw err_;
              throw new rpc_js_1.UnknownRpcError(err);
          }
        }
      }, {
        delay: ({ count, error }) => {
          if (error && error instanceof request_js_1.HttpRequestError) {
            const retryAfter = error?.headers?.get("Retry-After");
            if (retryAfter?.match(/\d/))
              return parseInt(retryAfter) * 1e3;
          }
          return ~~(1 << count) * retryDelay;
        },
        retryCount,
        shouldRetry: ({ error }) => !(0, exports.isDeterministicError)(error)
      });
    }
    exports.buildRequest = buildRequest;
  }
});

// node_modules/viem/_cjs/clients/transports/createTransport.js
var require_createTransport = __commonJS({
  "node_modules/viem/_cjs/clients/transports/createTransport.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createTransport = void 0;
    var buildRequest_js_1 = require_buildRequest();
    function createTransport({ key, name, request, retryCount = 3, retryDelay = 150, timeout, type }, value) {
      return {
        config: { key, name, request, retryCount, retryDelay, timeout, type },
        request: (0, buildRequest_js_1.buildRequest)(request, { retryCount, retryDelay }),
        value
      };
    }
    exports.createTransport = createTransport;
  }
});

// node_modules/viem/_cjs/clients/transports/custom.js
var require_custom = __commonJS({
  "node_modules/viem/_cjs/clients/transports/custom.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.custom = void 0;
    var createTransport_js_1 = require_createTransport();
    function custom(provider, config = {}) {
      const { key = "custom", name = "Custom Provider", retryDelay } = config;
      return ({ retryCount: defaultRetryCount }) => (0, createTransport_js_1.createTransport)({
        key,
        name,
        request: provider.request.bind(provider),
        retryCount: config.retryCount ?? defaultRetryCount,
        retryDelay,
        type: "custom"
      });
    }
    exports.custom = custom;
  }
});

// node_modules/viem/_cjs/clients/transports/fallback.js
var require_fallback = __commonJS({
  "node_modules/viem/_cjs/clients/transports/fallback.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.rankTransports = exports.fallback = void 0;
    var buildRequest_js_1 = require_buildRequest();
    var wait_js_1 = require_wait();
    var createTransport_js_1 = require_createTransport();
    function fallback(transports_, config = {}) {
      const { key = "fallback", name = "Fallback", rank = false, retryCount, retryDelay } = config;
      return ({ chain, pollingInterval = 4e3, timeout }) => {
        let transports = transports_;
        let onResponse = () => {
        };
        const transport = (0, createTransport_js_1.createTransport)({
          key,
          name,
          async request({ method, params }) {
            const fetch2 = async (i = 0) => {
              const transport2 = transports[i]({ chain, retryCount: 0, timeout });
              try {
                const response = await transport2.request({
                  method,
                  params
                });
                onResponse({
                  method,
                  params,
                  response,
                  transport: transport2,
                  status: "success"
                });
                return response;
              } catch (err) {
                onResponse({
                  error: err,
                  method,
                  params,
                  transport: transport2,
                  status: "error"
                });
                if ((0, buildRequest_js_1.isDeterministicError)(err))
                  throw err;
                if (i === transports.length - 1)
                  throw err;
                return fetch2(i + 1);
              }
            };
            return fetch2();
          },
          retryCount,
          retryDelay,
          type: "fallback"
        }, {
          onResponse: (fn) => onResponse = fn,
          transports: transports.map((fn) => fn({ chain, retryCount: 0 }))
        });
        if (rank) {
          const rankOptions = typeof rank === "object" ? rank : {};
          rankTransports({
            chain,
            interval: rankOptions.interval ?? pollingInterval,
            onTransports: (transports_2) => transports = transports_2,
            sampleCount: rankOptions.sampleCount,
            timeout: rankOptions.timeout,
            transports,
            weights: rankOptions.weights
          });
        }
        return transport;
      };
    }
    exports.fallback = fallback;
    function rankTransports({ chain, interval = 4e3, onTransports, sampleCount = 10, timeout = 1e3, transports, weights = {} }) {
      const { stability: stabilityWeight = 0.7, latency: latencyWeight = 0.3 } = weights;
      const samples = [];
      const rankTransports_ = async () => {
        const sample = await Promise.all(transports.map(async (transport) => {
          const transport_ = transport({ chain, retryCount: 0, timeout });
          const start = Date.now();
          let end;
          let success;
          try {
            await transport_.request({ method: "net_listening" });
            success = 1;
          } catch {
            success = 0;
          } finally {
            end = Date.now();
          }
          const latency = end - start;
          return { latency, success };
        }));
        samples.push(sample);
        if (samples.length > sampleCount)
          samples.shift();
        const maxLatency = Math.max(...samples.map((sample2) => Math.max(...sample2.map(({ latency }) => latency))));
        const scores = transports.map((_, i) => {
          const latencies = samples.map((sample2) => sample2[i].latency);
          const meanLatency = latencies.reduce((acc, latency) => acc + latency, 0) / latencies.length;
          const latencyScore = 1 - meanLatency / maxLatency;
          const successes = samples.map((sample2) => sample2[i].success);
          const stabilityScore = successes.reduce((acc, success) => acc + success, 0) / successes.length;
          if (stabilityScore === 0)
            return [0, i];
          return [
            latencyWeight * latencyScore + stabilityWeight * stabilityScore,
            i
          ];
        }).sort((a, b) => b[0] - a[0]);
        onTransports(scores.map(([, i]) => transports[i]));
        await (0, wait_js_1.wait)(interval);
        rankTransports_();
      };
      rankTransports_();
    }
    exports.rankTransports = rankTransports;
  }
});

// node_modules/viem/_cjs/errors/transport.js
var require_transport = __commonJS({
  "node_modules/viem/_cjs/errors/transport.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UrlRequiredError = void 0;
    var base_js_1 = require_base();
    var UrlRequiredError = class extends base_js_1.BaseError {
      constructor() {
        super("No URL was provided to the Transport. Please provide a valid RPC URL to the Transport.", {
          docsPath: "/docs/clients/intro"
        });
      }
    };
    exports.UrlRequiredError = UrlRequiredError;
  }
});

// node_modules/ws/lib/constants.js
var require_constants = __commonJS({
  "node_modules/ws/lib/constants.js"(exports, module2) {
    "use strict";
    module2.exports = {
      BINARY_TYPES: ["nodebuffer", "arraybuffer", "fragments"],
      EMPTY_BUFFER: Buffer.alloc(0),
      GUID: "258EAFA5-E914-47DA-95CA-C5AB0DC85B11",
      kForOnEventAttribute: Symbol("kIsForOnEventAttribute"),
      kListener: Symbol("kListener"),
      kStatusCode: Symbol("status-code"),
      kWebSocket: Symbol("websocket"),
      NOOP: () => {
      }
    };
  }
});

// node_modules/ws/lib/buffer-util.js
var require_buffer_util = __commonJS({
  "node_modules/ws/lib/buffer-util.js"(exports, module2) {
    "use strict";
    var { EMPTY_BUFFER } = require_constants();
    var FastBuffer = Buffer[Symbol.species];
    function concat(list, totalLength) {
      if (list.length === 0)
        return EMPTY_BUFFER;
      if (list.length === 1)
        return list[0];
      const target = Buffer.allocUnsafe(totalLength);
      let offset = 0;
      for (let i = 0; i < list.length; i++) {
        const buf = list[i];
        target.set(buf, offset);
        offset += buf.length;
      }
      if (offset < totalLength) {
        return new FastBuffer(target.buffer, target.byteOffset, offset);
      }
      return target;
    }
    function _mask(source, mask, output2, offset, length) {
      for (let i = 0; i < length; i++) {
        output2[offset + i] = source[i] ^ mask[i & 3];
      }
    }
    function _unmask(buffer, mask) {
      for (let i = 0; i < buffer.length; i++) {
        buffer[i] ^= mask[i & 3];
      }
    }
    function toArrayBuffer(buf) {
      if (buf.length === buf.buffer.byteLength) {
        return buf.buffer;
      }
      return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length);
    }
    function toBuffer(data) {
      toBuffer.readOnly = true;
      if (Buffer.isBuffer(data))
        return data;
      let buf;
      if (data instanceof ArrayBuffer) {
        buf = new FastBuffer(data);
      } else if (ArrayBuffer.isView(data)) {
        buf = new FastBuffer(data.buffer, data.byteOffset, data.byteLength);
      } else {
        buf = Buffer.from(data);
        toBuffer.readOnly = false;
      }
      return buf;
    }
    module2.exports = {
      concat,
      mask: _mask,
      toArrayBuffer,
      toBuffer,
      unmask: _unmask
    };
    if (!process.env.WS_NO_BUFFER_UTIL) {
      try {
        const bufferUtil = require("bufferutil");
        module2.exports.mask = function(source, mask, output2, offset, length) {
          if (length < 48)
            _mask(source, mask, output2, offset, length);
          else
            bufferUtil.mask(source, mask, output2, offset, length);
        };
        module2.exports.unmask = function(buffer, mask) {
          if (buffer.length < 32)
            _unmask(buffer, mask);
          else
            bufferUtil.unmask(buffer, mask);
        };
      } catch (e) {
      }
    }
  }
});

// node_modules/ws/lib/limiter.js
var require_limiter = __commonJS({
  "node_modules/ws/lib/limiter.js"(exports, module2) {
    "use strict";
    var kDone = Symbol("kDone");
    var kRun = Symbol("kRun");
    var Limiter = class {
      /**
       * Creates a new `Limiter`.
       *
       * @param {Number} [concurrency=Infinity] The maximum number of jobs allowed
       *     to run concurrently
       */
      constructor(concurrency) {
        this[kDone] = () => {
          this.pending--;
          this[kRun]();
        };
        this.concurrency = concurrency || Infinity;
        this.jobs = [];
        this.pending = 0;
      }
      /**
       * Adds a job to the queue.
       *
       * @param {Function} job The job to run
       * @public
       */
      add(job) {
        this.jobs.push(job);
        this[kRun]();
      }
      /**
       * Removes a job from the queue and runs it if possible.
       *
       * @private
       */
      [kRun]() {
        if (this.pending === this.concurrency)
          return;
        if (this.jobs.length) {
          const job = this.jobs.shift();
          this.pending++;
          job(this[kDone]);
        }
      }
    };
    module2.exports = Limiter;
  }
});

// node_modules/ws/lib/permessage-deflate.js
var require_permessage_deflate = __commonJS({
  "node_modules/ws/lib/permessage-deflate.js"(exports, module2) {
    "use strict";
    var zlib = require("zlib");
    var bufferUtil = require_buffer_util();
    var Limiter = require_limiter();
    var { kStatusCode } = require_constants();
    var FastBuffer = Buffer[Symbol.species];
    var TRAILER = Buffer.from([0, 0, 255, 255]);
    var kPerMessageDeflate = Symbol("permessage-deflate");
    var kTotalLength = Symbol("total-length");
    var kCallback = Symbol("callback");
    var kBuffers = Symbol("buffers");
    var kError = Symbol("error");
    var zlibLimiter;
    var PerMessageDeflate = class {
      /**
       * Creates a PerMessageDeflate instance.
       *
       * @param {Object} [options] Configuration options
       * @param {(Boolean|Number)} [options.clientMaxWindowBits] Advertise support
       *     for, or request, a custom client window size
       * @param {Boolean} [options.clientNoContextTakeover=false] Advertise/
       *     acknowledge disabling of client context takeover
       * @param {Number} [options.concurrencyLimit=10] The number of concurrent
       *     calls to zlib
       * @param {(Boolean|Number)} [options.serverMaxWindowBits] Request/confirm the
       *     use of a custom server window size
       * @param {Boolean} [options.serverNoContextTakeover=false] Request/accept
       *     disabling of server context takeover
       * @param {Number} [options.threshold=1024] Size (in bytes) below which
       *     messages should not be compressed if context takeover is disabled
       * @param {Object} [options.zlibDeflateOptions] Options to pass to zlib on
       *     deflate
       * @param {Object} [options.zlibInflateOptions] Options to pass to zlib on
       *     inflate
       * @param {Boolean} [isServer=false] Create the instance in either server or
       *     client mode
       * @param {Number} [maxPayload=0] The maximum allowed message length
       */
      constructor(options, isServer, maxPayload) {
        this._maxPayload = maxPayload | 0;
        this._options = options || {};
        this._threshold = this._options.threshold !== void 0 ? this._options.threshold : 1024;
        this._isServer = !!isServer;
        this._deflate = null;
        this._inflate = null;
        this.params = null;
        if (!zlibLimiter) {
          const concurrency = this._options.concurrencyLimit !== void 0 ? this._options.concurrencyLimit : 10;
          zlibLimiter = new Limiter(concurrency);
        }
      }
      /**
       * @type {String}
       */
      static get extensionName() {
        return "permessage-deflate";
      }
      /**
       * Create an extension negotiation offer.
       *
       * @return {Object} Extension parameters
       * @public
       */
      offer() {
        const params = {};
        if (this._options.serverNoContextTakeover) {
          params.server_no_context_takeover = true;
        }
        if (this._options.clientNoContextTakeover) {
          params.client_no_context_takeover = true;
        }
        if (this._options.serverMaxWindowBits) {
          params.server_max_window_bits = this._options.serverMaxWindowBits;
        }
        if (this._options.clientMaxWindowBits) {
          params.client_max_window_bits = this._options.clientMaxWindowBits;
        } else if (this._options.clientMaxWindowBits == null) {
          params.client_max_window_bits = true;
        }
        return params;
      }
      /**
       * Accept an extension negotiation offer/response.
       *
       * @param {Array} configurations The extension negotiation offers/reponse
       * @return {Object} Accepted configuration
       * @public
       */
      accept(configurations) {
        configurations = this.normalizeParams(configurations);
        this.params = this._isServer ? this.acceptAsServer(configurations) : this.acceptAsClient(configurations);
        return this.params;
      }
      /**
       * Releases all resources used by the extension.
       *
       * @public
       */
      cleanup() {
        if (this._inflate) {
          this._inflate.close();
          this._inflate = null;
        }
        if (this._deflate) {
          const callback = this._deflate[kCallback];
          this._deflate.close();
          this._deflate = null;
          if (callback) {
            callback(
              new Error(
                "The deflate stream was closed while data was being processed"
              )
            );
          }
        }
      }
      /**
       *  Accept an extension negotiation offer.
       *
       * @param {Array} offers The extension negotiation offers
       * @return {Object} Accepted configuration
       * @private
       */
      acceptAsServer(offers) {
        const opts = this._options;
        const accepted = offers.find((params) => {
          if (opts.serverNoContextTakeover === false && params.server_no_context_takeover || params.server_max_window_bits && (opts.serverMaxWindowBits === false || typeof opts.serverMaxWindowBits === "number" && opts.serverMaxWindowBits > params.server_max_window_bits) || typeof opts.clientMaxWindowBits === "number" && !params.client_max_window_bits) {
            return false;
          }
          return true;
        });
        if (!accepted) {
          throw new Error("None of the extension offers can be accepted");
        }
        if (opts.serverNoContextTakeover) {
          accepted.server_no_context_takeover = true;
        }
        if (opts.clientNoContextTakeover) {
          accepted.client_no_context_takeover = true;
        }
        if (typeof opts.serverMaxWindowBits === "number") {
          accepted.server_max_window_bits = opts.serverMaxWindowBits;
        }
        if (typeof opts.clientMaxWindowBits === "number") {
          accepted.client_max_window_bits = opts.clientMaxWindowBits;
        } else if (accepted.client_max_window_bits === true || opts.clientMaxWindowBits === false) {
          delete accepted.client_max_window_bits;
        }
        return accepted;
      }
      /**
       * Accept the extension negotiation response.
       *
       * @param {Array} response The extension negotiation response
       * @return {Object} Accepted configuration
       * @private
       */
      acceptAsClient(response) {
        const params = response[0];
        if (this._options.clientNoContextTakeover === false && params.client_no_context_takeover) {
          throw new Error('Unexpected parameter "client_no_context_takeover"');
        }
        if (!params.client_max_window_bits) {
          if (typeof this._options.clientMaxWindowBits === "number") {
            params.client_max_window_bits = this._options.clientMaxWindowBits;
          }
        } else if (this._options.clientMaxWindowBits === false || typeof this._options.clientMaxWindowBits === "number" && params.client_max_window_bits > this._options.clientMaxWindowBits) {
          throw new Error(
            'Unexpected or invalid parameter "client_max_window_bits"'
          );
        }
        return params;
      }
      /**
       * Normalize parameters.
       *
       * @param {Array} configurations The extension negotiation offers/reponse
       * @return {Array} The offers/response with normalized parameters
       * @private
       */
      normalizeParams(configurations) {
        configurations.forEach((params) => {
          Object.keys(params).forEach((key) => {
            let value = params[key];
            if (value.length > 1) {
              throw new Error(`Parameter "${key}" must have only a single value`);
            }
            value = value[0];
            if (key === "client_max_window_bits") {
              if (value !== true) {
                const num = +value;
                if (!Number.isInteger(num) || num < 8 || num > 15) {
                  throw new TypeError(
                    `Invalid value for parameter "${key}": ${value}`
                  );
                }
                value = num;
              } else if (!this._isServer) {
                throw new TypeError(
                  `Invalid value for parameter "${key}": ${value}`
                );
              }
            } else if (key === "server_max_window_bits") {
              const num = +value;
              if (!Number.isInteger(num) || num < 8 || num > 15) {
                throw new TypeError(
                  `Invalid value for parameter "${key}": ${value}`
                );
              }
              value = num;
            } else if (key === "client_no_context_takeover" || key === "server_no_context_takeover") {
              if (value !== true) {
                throw new TypeError(
                  `Invalid value for parameter "${key}": ${value}`
                );
              }
            } else {
              throw new Error(`Unknown parameter "${key}"`);
            }
            params[key] = value;
          });
        });
        return configurations;
      }
      /**
       * Decompress data. Concurrency limited.
       *
       * @param {Buffer} data Compressed data
       * @param {Boolean} fin Specifies whether or not this is the last fragment
       * @param {Function} callback Callback
       * @public
       */
      decompress(data, fin, callback) {
        zlibLimiter.add((done) => {
          this._decompress(data, fin, (err, result) => {
            done();
            callback(err, result);
          });
        });
      }
      /**
       * Compress data. Concurrency limited.
       *
       * @param {(Buffer|String)} data Data to compress
       * @param {Boolean} fin Specifies whether or not this is the last fragment
       * @param {Function} callback Callback
       * @public
       */
      compress(data, fin, callback) {
        zlibLimiter.add((done) => {
          this._compress(data, fin, (err, result) => {
            done();
            callback(err, result);
          });
        });
      }
      /**
       * Decompress data.
       *
       * @param {Buffer} data Compressed data
       * @param {Boolean} fin Specifies whether or not this is the last fragment
       * @param {Function} callback Callback
       * @private
       */
      _decompress(data, fin, callback) {
        const endpoint = this._isServer ? "client" : "server";
        if (!this._inflate) {
          const key = `${endpoint}_max_window_bits`;
          const windowBits = typeof this.params[key] !== "number" ? zlib.Z_DEFAULT_WINDOWBITS : this.params[key];
          this._inflate = zlib.createInflateRaw({
            ...this._options.zlibInflateOptions,
            windowBits
          });
          this._inflate[kPerMessageDeflate] = this;
          this._inflate[kTotalLength] = 0;
          this._inflate[kBuffers] = [];
          this._inflate.on("error", inflateOnError);
          this._inflate.on("data", inflateOnData);
        }
        this._inflate[kCallback] = callback;
        this._inflate.write(data);
        if (fin)
          this._inflate.write(TRAILER);
        this._inflate.flush(() => {
          const err = this._inflate[kError];
          if (err) {
            this._inflate.close();
            this._inflate = null;
            callback(err);
            return;
          }
          const data2 = bufferUtil.concat(
            this._inflate[kBuffers],
            this._inflate[kTotalLength]
          );
          if (this._inflate._readableState.endEmitted) {
            this._inflate.close();
            this._inflate = null;
          } else {
            this._inflate[kTotalLength] = 0;
            this._inflate[kBuffers] = [];
            if (fin && this.params[`${endpoint}_no_context_takeover`]) {
              this._inflate.reset();
            }
          }
          callback(null, data2);
        });
      }
      /**
       * Compress data.
       *
       * @param {(Buffer|String)} data Data to compress
       * @param {Boolean} fin Specifies whether or not this is the last fragment
       * @param {Function} callback Callback
       * @private
       */
      _compress(data, fin, callback) {
        const endpoint = this._isServer ? "server" : "client";
        if (!this._deflate) {
          const key = `${endpoint}_max_window_bits`;
          const windowBits = typeof this.params[key] !== "number" ? zlib.Z_DEFAULT_WINDOWBITS : this.params[key];
          this._deflate = zlib.createDeflateRaw({
            ...this._options.zlibDeflateOptions,
            windowBits
          });
          this._deflate[kTotalLength] = 0;
          this._deflate[kBuffers] = [];
          this._deflate.on("data", deflateOnData);
        }
        this._deflate[kCallback] = callback;
        this._deflate.write(data);
        this._deflate.flush(zlib.Z_SYNC_FLUSH, () => {
          if (!this._deflate) {
            return;
          }
          let data2 = bufferUtil.concat(
            this._deflate[kBuffers],
            this._deflate[kTotalLength]
          );
          if (fin) {
            data2 = new FastBuffer(data2.buffer, data2.byteOffset, data2.length - 4);
          }
          this._deflate[kCallback] = null;
          this._deflate[kTotalLength] = 0;
          this._deflate[kBuffers] = [];
          if (fin && this.params[`${endpoint}_no_context_takeover`]) {
            this._deflate.reset();
          }
          callback(null, data2);
        });
      }
    };
    module2.exports = PerMessageDeflate;
    function deflateOnData(chunk) {
      this[kBuffers].push(chunk);
      this[kTotalLength] += chunk.length;
    }
    function inflateOnData(chunk) {
      this[kTotalLength] += chunk.length;
      if (this[kPerMessageDeflate]._maxPayload < 1 || this[kTotalLength] <= this[kPerMessageDeflate]._maxPayload) {
        this[kBuffers].push(chunk);
        return;
      }
      this[kError] = new RangeError("Max payload size exceeded");
      this[kError].code = "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH";
      this[kError][kStatusCode] = 1009;
      this.removeListener("data", inflateOnData);
      this.reset();
    }
    function inflateOnError(err) {
      this[kPerMessageDeflate]._inflate = null;
      err[kStatusCode] = 1007;
      this[kCallback](err);
    }
  }
});

// node_modules/ws/lib/validation.js
var require_validation = __commonJS({
  "node_modules/ws/lib/validation.js"(exports, module2) {
    "use strict";
    var { isUtf8 } = require("buffer");
    var tokenChars = [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      // 0 - 15
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      // 16 - 31
      0,
      1,
      0,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      1,
      1,
      0,
      1,
      1,
      0,
      // 32 - 47
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      // 48 - 63
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      // 64 - 79
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      1,
      1,
      // 80 - 95
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      // 96 - 111
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      1,
      0,
      1,
      0
      // 112 - 127
    ];
    function isValidStatusCode(code) {
      return code >= 1e3 && code <= 1014 && code !== 1004 && code !== 1005 && code !== 1006 || code >= 3e3 && code <= 4999;
    }
    function _isValidUTF8(buf) {
      const len = buf.length;
      let i = 0;
      while (i < len) {
        if ((buf[i] & 128) === 0) {
          i++;
        } else if ((buf[i] & 224) === 192) {
          if (i + 1 === len || (buf[i + 1] & 192) !== 128 || (buf[i] & 254) === 192) {
            return false;
          }
          i += 2;
        } else if ((buf[i] & 240) === 224) {
          if (i + 2 >= len || (buf[i + 1] & 192) !== 128 || (buf[i + 2] & 192) !== 128 || buf[i] === 224 && (buf[i + 1] & 224) === 128 || // Overlong
          buf[i] === 237 && (buf[i + 1] & 224) === 160) {
            return false;
          }
          i += 3;
        } else if ((buf[i] & 248) === 240) {
          if (i + 3 >= len || (buf[i + 1] & 192) !== 128 || (buf[i + 2] & 192) !== 128 || (buf[i + 3] & 192) !== 128 || buf[i] === 240 && (buf[i + 1] & 240) === 128 || // Overlong
          buf[i] === 244 && buf[i + 1] > 143 || buf[i] > 244) {
            return false;
          }
          i += 4;
        } else {
          return false;
        }
      }
      return true;
    }
    module2.exports = {
      isValidStatusCode,
      isValidUTF8: _isValidUTF8,
      tokenChars
    };
    if (isUtf8) {
      module2.exports.isValidUTF8 = function(buf) {
        return buf.length < 24 ? _isValidUTF8(buf) : isUtf8(buf);
      };
    } else if (!process.env.WS_NO_UTF_8_VALIDATE) {
      try {
        const isValidUTF8 = require("utf-8-validate");
        module2.exports.isValidUTF8 = function(buf) {
          return buf.length < 32 ? _isValidUTF8(buf) : isValidUTF8(buf);
        };
      } catch (e) {
      }
    }
  }
});

// node_modules/ws/lib/receiver.js
var require_receiver = __commonJS({
  "node_modules/ws/lib/receiver.js"(exports, module2) {
    "use strict";
    var { Writable } = require("stream");
    var PerMessageDeflate = require_permessage_deflate();
    var {
      BINARY_TYPES,
      EMPTY_BUFFER,
      kStatusCode,
      kWebSocket
    } = require_constants();
    var { concat, toArrayBuffer, unmask } = require_buffer_util();
    var { isValidStatusCode, isValidUTF8 } = require_validation();
    var FastBuffer = Buffer[Symbol.species];
    var GET_INFO = 0;
    var GET_PAYLOAD_LENGTH_16 = 1;
    var GET_PAYLOAD_LENGTH_64 = 2;
    var GET_MASK = 3;
    var GET_DATA = 4;
    var INFLATING = 5;
    var Receiver = class extends Writable {
      /**
       * Creates a Receiver instance.
       *
       * @param {Object} [options] Options object
       * @param {String} [options.binaryType=nodebuffer] The type for binary data
       * @param {Object} [options.extensions] An object containing the negotiated
       *     extensions
       * @param {Boolean} [options.isServer=false] Specifies whether to operate in
       *     client or server mode
       * @param {Number} [options.maxPayload=0] The maximum allowed message length
       * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
       *     not to skip UTF-8 validation for text and close messages
       */
      constructor(options = {}) {
        super();
        this._binaryType = options.binaryType || BINARY_TYPES[0];
        this._extensions = options.extensions || {};
        this._isServer = !!options.isServer;
        this._maxPayload = options.maxPayload | 0;
        this._skipUTF8Validation = !!options.skipUTF8Validation;
        this[kWebSocket] = void 0;
        this._bufferedBytes = 0;
        this._buffers = [];
        this._compressed = false;
        this._payloadLength = 0;
        this._mask = void 0;
        this._fragmented = 0;
        this._masked = false;
        this._fin = false;
        this._opcode = 0;
        this._totalPayloadLength = 0;
        this._messageLength = 0;
        this._fragments = [];
        this._state = GET_INFO;
        this._loop = false;
      }
      /**
       * Implements `Writable.prototype._write()`.
       *
       * @param {Buffer} chunk The chunk of data to write
       * @param {String} encoding The character encoding of `chunk`
       * @param {Function} cb Callback
       * @private
       */
      _write(chunk, encoding, cb) {
        if (this._opcode === 8 && this._state == GET_INFO)
          return cb();
        this._bufferedBytes += chunk.length;
        this._buffers.push(chunk);
        this.startLoop(cb);
      }
      /**
       * Consumes `n` bytes from the buffered data.
       *
       * @param {Number} n The number of bytes to consume
       * @return {Buffer} The consumed bytes
       * @private
       */
      consume(n) {
        this._bufferedBytes -= n;
        if (n === this._buffers[0].length)
          return this._buffers.shift();
        if (n < this._buffers[0].length) {
          const buf = this._buffers[0];
          this._buffers[0] = new FastBuffer(
            buf.buffer,
            buf.byteOffset + n,
            buf.length - n
          );
          return new FastBuffer(buf.buffer, buf.byteOffset, n);
        }
        const dst = Buffer.allocUnsafe(n);
        do {
          const buf = this._buffers[0];
          const offset = dst.length - n;
          if (n >= buf.length) {
            dst.set(this._buffers.shift(), offset);
          } else {
            dst.set(new Uint8Array(buf.buffer, buf.byteOffset, n), offset);
            this._buffers[0] = new FastBuffer(
              buf.buffer,
              buf.byteOffset + n,
              buf.length - n
            );
          }
          n -= buf.length;
        } while (n > 0);
        return dst;
      }
      /**
       * Starts the parsing loop.
       *
       * @param {Function} cb Callback
       * @private
       */
      startLoop(cb) {
        let err;
        this._loop = true;
        do {
          switch (this._state) {
            case GET_INFO:
              err = this.getInfo();
              break;
            case GET_PAYLOAD_LENGTH_16:
              err = this.getPayloadLength16();
              break;
            case GET_PAYLOAD_LENGTH_64:
              err = this.getPayloadLength64();
              break;
            case GET_MASK:
              this.getMask();
              break;
            case GET_DATA:
              err = this.getData(cb);
              break;
            default:
              this._loop = false;
              return;
          }
        } while (this._loop);
        cb(err);
      }
      /**
       * Reads the first two bytes of a frame.
       *
       * @return {(RangeError|undefined)} A possible error
       * @private
       */
      getInfo() {
        if (this._bufferedBytes < 2) {
          this._loop = false;
          return;
        }
        const buf = this.consume(2);
        if ((buf[0] & 48) !== 0) {
          this._loop = false;
          return error(
            RangeError,
            "RSV2 and RSV3 must be clear",
            true,
            1002,
            "WS_ERR_UNEXPECTED_RSV_2_3"
          );
        }
        const compressed = (buf[0] & 64) === 64;
        if (compressed && !this._extensions[PerMessageDeflate.extensionName]) {
          this._loop = false;
          return error(
            RangeError,
            "RSV1 must be clear",
            true,
            1002,
            "WS_ERR_UNEXPECTED_RSV_1"
          );
        }
        this._fin = (buf[0] & 128) === 128;
        this._opcode = buf[0] & 15;
        this._payloadLength = buf[1] & 127;
        if (this._opcode === 0) {
          if (compressed) {
            this._loop = false;
            return error(
              RangeError,
              "RSV1 must be clear",
              true,
              1002,
              "WS_ERR_UNEXPECTED_RSV_1"
            );
          }
          if (!this._fragmented) {
            this._loop = false;
            return error(
              RangeError,
              "invalid opcode 0",
              true,
              1002,
              "WS_ERR_INVALID_OPCODE"
            );
          }
          this._opcode = this._fragmented;
        } else if (this._opcode === 1 || this._opcode === 2) {
          if (this._fragmented) {
            this._loop = false;
            return error(
              RangeError,
              `invalid opcode ${this._opcode}`,
              true,
              1002,
              "WS_ERR_INVALID_OPCODE"
            );
          }
          this._compressed = compressed;
        } else if (this._opcode > 7 && this._opcode < 11) {
          if (!this._fin) {
            this._loop = false;
            return error(
              RangeError,
              "FIN must be set",
              true,
              1002,
              "WS_ERR_EXPECTED_FIN"
            );
          }
          if (compressed) {
            this._loop = false;
            return error(
              RangeError,
              "RSV1 must be clear",
              true,
              1002,
              "WS_ERR_UNEXPECTED_RSV_1"
            );
          }
          if (this._payloadLength > 125 || this._opcode === 8 && this._payloadLength === 1) {
            this._loop = false;
            return error(
              RangeError,
              `invalid payload length ${this._payloadLength}`,
              true,
              1002,
              "WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH"
            );
          }
        } else {
          this._loop = false;
          return error(
            RangeError,
            `invalid opcode ${this._opcode}`,
            true,
            1002,
            "WS_ERR_INVALID_OPCODE"
          );
        }
        if (!this._fin && !this._fragmented)
          this._fragmented = this._opcode;
        this._masked = (buf[1] & 128) === 128;
        if (this._isServer) {
          if (!this._masked) {
            this._loop = false;
            return error(
              RangeError,
              "MASK must be set",
              true,
              1002,
              "WS_ERR_EXPECTED_MASK"
            );
          }
        } else if (this._masked) {
          this._loop = false;
          return error(
            RangeError,
            "MASK must be clear",
            true,
            1002,
            "WS_ERR_UNEXPECTED_MASK"
          );
        }
        if (this._payloadLength === 126)
          this._state = GET_PAYLOAD_LENGTH_16;
        else if (this._payloadLength === 127)
          this._state = GET_PAYLOAD_LENGTH_64;
        else
          return this.haveLength();
      }
      /**
       * Gets extended payload length (7+16).
       *
       * @return {(RangeError|undefined)} A possible error
       * @private
       */
      getPayloadLength16() {
        if (this._bufferedBytes < 2) {
          this._loop = false;
          return;
        }
        this._payloadLength = this.consume(2).readUInt16BE(0);
        return this.haveLength();
      }
      /**
       * Gets extended payload length (7+64).
       *
       * @return {(RangeError|undefined)} A possible error
       * @private
       */
      getPayloadLength64() {
        if (this._bufferedBytes < 8) {
          this._loop = false;
          return;
        }
        const buf = this.consume(8);
        const num = buf.readUInt32BE(0);
        if (num > Math.pow(2, 53 - 32) - 1) {
          this._loop = false;
          return error(
            RangeError,
            "Unsupported WebSocket frame: payload length > 2^53 - 1",
            false,
            1009,
            "WS_ERR_UNSUPPORTED_DATA_PAYLOAD_LENGTH"
          );
        }
        this._payloadLength = num * Math.pow(2, 32) + buf.readUInt32BE(4);
        return this.haveLength();
      }
      /**
       * Payload length has been read.
       *
       * @return {(RangeError|undefined)} A possible error
       * @private
       */
      haveLength() {
        if (this._payloadLength && this._opcode < 8) {
          this._totalPayloadLength += this._payloadLength;
          if (this._totalPayloadLength > this._maxPayload && this._maxPayload > 0) {
            this._loop = false;
            return error(
              RangeError,
              "Max payload size exceeded",
              false,
              1009,
              "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH"
            );
          }
        }
        if (this._masked)
          this._state = GET_MASK;
        else
          this._state = GET_DATA;
      }
      /**
       * Reads mask bytes.
       *
       * @private
       */
      getMask() {
        if (this._bufferedBytes < 4) {
          this._loop = false;
          return;
        }
        this._mask = this.consume(4);
        this._state = GET_DATA;
      }
      /**
       * Reads data bytes.
       *
       * @param {Function} cb Callback
       * @return {(Error|RangeError|undefined)} A possible error
       * @private
       */
      getData(cb) {
        let data = EMPTY_BUFFER;
        if (this._payloadLength) {
          if (this._bufferedBytes < this._payloadLength) {
            this._loop = false;
            return;
          }
          data = this.consume(this._payloadLength);
          if (this._masked && (this._mask[0] | this._mask[1] | this._mask[2] | this._mask[3]) !== 0) {
            unmask(data, this._mask);
          }
        }
        if (this._opcode > 7)
          return this.controlMessage(data);
        if (this._compressed) {
          this._state = INFLATING;
          this.decompress(data, cb);
          return;
        }
        if (data.length) {
          this._messageLength = this._totalPayloadLength;
          this._fragments.push(data);
        }
        return this.dataMessage();
      }
      /**
       * Decompresses data.
       *
       * @param {Buffer} data Compressed data
       * @param {Function} cb Callback
       * @private
       */
      decompress(data, cb) {
        const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];
        perMessageDeflate.decompress(data, this._fin, (err, buf) => {
          if (err)
            return cb(err);
          if (buf.length) {
            this._messageLength += buf.length;
            if (this._messageLength > this._maxPayload && this._maxPayload > 0) {
              return cb(
                error(
                  RangeError,
                  "Max payload size exceeded",
                  false,
                  1009,
                  "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH"
                )
              );
            }
            this._fragments.push(buf);
          }
          const er = this.dataMessage();
          if (er)
            return cb(er);
          this.startLoop(cb);
        });
      }
      /**
       * Handles a data message.
       *
       * @return {(Error|undefined)} A possible error
       * @private
       */
      dataMessage() {
        if (this._fin) {
          const messageLength = this._messageLength;
          const fragments = this._fragments;
          this._totalPayloadLength = 0;
          this._messageLength = 0;
          this._fragmented = 0;
          this._fragments = [];
          if (this._opcode === 2) {
            let data;
            if (this._binaryType === "nodebuffer") {
              data = concat(fragments, messageLength);
            } else if (this._binaryType === "arraybuffer") {
              data = toArrayBuffer(concat(fragments, messageLength));
            } else {
              data = fragments;
            }
            this.emit("message", data, true);
          } else {
            const buf = concat(fragments, messageLength);
            if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
              this._loop = false;
              return error(
                Error,
                "invalid UTF-8 sequence",
                true,
                1007,
                "WS_ERR_INVALID_UTF8"
              );
            }
            this.emit("message", buf, false);
          }
        }
        this._state = GET_INFO;
      }
      /**
       * Handles a control message.
       *
       * @param {Buffer} data Data to handle
       * @return {(Error|RangeError|undefined)} A possible error
       * @private
       */
      controlMessage(data) {
        if (this._opcode === 8) {
          this._loop = false;
          if (data.length === 0) {
            this.emit("conclude", 1005, EMPTY_BUFFER);
            this.end();
          } else {
            const code = data.readUInt16BE(0);
            if (!isValidStatusCode(code)) {
              return error(
                RangeError,
                `invalid status code ${code}`,
                true,
                1002,
                "WS_ERR_INVALID_CLOSE_CODE"
              );
            }
            const buf = new FastBuffer(
              data.buffer,
              data.byteOffset + 2,
              data.length - 2
            );
            if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
              return error(
                Error,
                "invalid UTF-8 sequence",
                true,
                1007,
                "WS_ERR_INVALID_UTF8"
              );
            }
            this.emit("conclude", code, buf);
            this.end();
          }
        } else if (this._opcode === 9) {
          this.emit("ping", data);
        } else {
          this.emit("pong", data);
        }
        this._state = GET_INFO;
      }
    };
    module2.exports = Receiver;
    function error(ErrorCtor, message, prefix, statusCode, errorCode) {
      const err = new ErrorCtor(
        prefix ? `Invalid WebSocket frame: ${message}` : message
      );
      Error.captureStackTrace(err, error);
      err.code = errorCode;
      err[kStatusCode] = statusCode;
      return err;
    }
  }
});

// node_modules/ws/lib/sender.js
var require_sender = __commonJS({
  "node_modules/ws/lib/sender.js"(exports, module2) {
    "use strict";
    var net = require("net");
    var tls = require("tls");
    var { randomFillSync } = require("crypto");
    var PerMessageDeflate = require_permessage_deflate();
    var { EMPTY_BUFFER } = require_constants();
    var { isValidStatusCode } = require_validation();
    var { mask: applyMask, toBuffer } = require_buffer_util();
    var kByteLength = Symbol("kByteLength");
    var maskBuffer = Buffer.alloc(4);
    var Sender = class _Sender {
      /**
       * Creates a Sender instance.
       *
       * @param {(net.Socket|tls.Socket)} socket The connection socket
       * @param {Object} [extensions] An object containing the negotiated extensions
       * @param {Function} [generateMask] The function used to generate the masking
       *     key
       */
      constructor(socket, extensions, generateMask) {
        this._extensions = extensions || {};
        if (generateMask) {
          this._generateMask = generateMask;
          this._maskBuffer = Buffer.alloc(4);
        }
        this._socket = socket;
        this._firstFragment = true;
        this._compress = false;
        this._bufferedBytes = 0;
        this._deflating = false;
        this._queue = [];
      }
      /**
       * Frames a piece of data according to the HyBi WebSocket protocol.
       *
       * @param {(Buffer|String)} data The data to frame
       * @param {Object} options Options object
       * @param {Boolean} [options.fin=false] Specifies whether or not to set the
       *     FIN bit
       * @param {Function} [options.generateMask] The function used to generate the
       *     masking key
       * @param {Boolean} [options.mask=false] Specifies whether or not to mask
       *     `data`
       * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
       *     key
       * @param {Number} options.opcode The opcode
       * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
       *     modified
       * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
       *     RSV1 bit
       * @return {(Buffer|String)[]} The framed data
       * @public
       */
      static frame(data, options) {
        let mask;
        let merge = false;
        let offset = 2;
        let skipMasking = false;
        if (options.mask) {
          mask = options.maskBuffer || maskBuffer;
          if (options.generateMask) {
            options.generateMask(mask);
          } else {
            randomFillSync(mask, 0, 4);
          }
          skipMasking = (mask[0] | mask[1] | mask[2] | mask[3]) === 0;
          offset = 6;
        }
        let dataLength;
        if (typeof data === "string") {
          if ((!options.mask || skipMasking) && options[kByteLength] !== void 0) {
            dataLength = options[kByteLength];
          } else {
            data = Buffer.from(data);
            dataLength = data.length;
          }
        } else {
          dataLength = data.length;
          merge = options.mask && options.readOnly && !skipMasking;
        }
        let payloadLength = dataLength;
        if (dataLength >= 65536) {
          offset += 8;
          payloadLength = 127;
        } else if (dataLength > 125) {
          offset += 2;
          payloadLength = 126;
        }
        const target = Buffer.allocUnsafe(merge ? dataLength + offset : offset);
        target[0] = options.fin ? options.opcode | 128 : options.opcode;
        if (options.rsv1)
          target[0] |= 64;
        target[1] = payloadLength;
        if (payloadLength === 126) {
          target.writeUInt16BE(dataLength, 2);
        } else if (payloadLength === 127) {
          target[2] = target[3] = 0;
          target.writeUIntBE(dataLength, 4, 6);
        }
        if (!options.mask)
          return [target, data];
        target[1] |= 128;
        target[offset - 4] = mask[0];
        target[offset - 3] = mask[1];
        target[offset - 2] = mask[2];
        target[offset - 1] = mask[3];
        if (skipMasking)
          return [target, data];
        if (merge) {
          applyMask(data, mask, target, offset, dataLength);
          return [target];
        }
        applyMask(data, mask, data, 0, dataLength);
        return [target, data];
      }
      /**
       * Sends a close message to the other peer.
       *
       * @param {Number} [code] The status code component of the body
       * @param {(String|Buffer)} [data] The message component of the body
       * @param {Boolean} [mask=false] Specifies whether or not to mask the message
       * @param {Function} [cb] Callback
       * @public
       */
      close(code, data, mask, cb) {
        let buf;
        if (code === void 0) {
          buf = EMPTY_BUFFER;
        } else if (typeof code !== "number" || !isValidStatusCode(code)) {
          throw new TypeError("First argument must be a valid error code number");
        } else if (data === void 0 || !data.length) {
          buf = Buffer.allocUnsafe(2);
          buf.writeUInt16BE(code, 0);
        } else {
          const length = Buffer.byteLength(data);
          if (length > 123) {
            throw new RangeError("The message must not be greater than 123 bytes");
          }
          buf = Buffer.allocUnsafe(2 + length);
          buf.writeUInt16BE(code, 0);
          if (typeof data === "string") {
            buf.write(data, 2);
          } else {
            buf.set(data, 2);
          }
        }
        const options = {
          [kByteLength]: buf.length,
          fin: true,
          generateMask: this._generateMask,
          mask,
          maskBuffer: this._maskBuffer,
          opcode: 8,
          readOnly: false,
          rsv1: false
        };
        if (this._deflating) {
          this.enqueue([this.dispatch, buf, false, options, cb]);
        } else {
          this.sendFrame(_Sender.frame(buf, options), cb);
        }
      }
      /**
       * Sends a ping message to the other peer.
       *
       * @param {*} data The message to send
       * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
       * @param {Function} [cb] Callback
       * @public
       */
      ping(data, mask, cb) {
        let byteLength;
        let readOnly;
        if (typeof data === "string") {
          byteLength = Buffer.byteLength(data);
          readOnly = false;
        } else {
          data = toBuffer(data);
          byteLength = data.length;
          readOnly = toBuffer.readOnly;
        }
        if (byteLength > 125) {
          throw new RangeError("The data size must not be greater than 125 bytes");
        }
        const options = {
          [kByteLength]: byteLength,
          fin: true,
          generateMask: this._generateMask,
          mask,
          maskBuffer: this._maskBuffer,
          opcode: 9,
          readOnly,
          rsv1: false
        };
        if (this._deflating) {
          this.enqueue([this.dispatch, data, false, options, cb]);
        } else {
          this.sendFrame(_Sender.frame(data, options), cb);
        }
      }
      /**
       * Sends a pong message to the other peer.
       *
       * @param {*} data The message to send
       * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
       * @param {Function} [cb] Callback
       * @public
       */
      pong(data, mask, cb) {
        let byteLength;
        let readOnly;
        if (typeof data === "string") {
          byteLength = Buffer.byteLength(data);
          readOnly = false;
        } else {
          data = toBuffer(data);
          byteLength = data.length;
          readOnly = toBuffer.readOnly;
        }
        if (byteLength > 125) {
          throw new RangeError("The data size must not be greater than 125 bytes");
        }
        const options = {
          [kByteLength]: byteLength,
          fin: true,
          generateMask: this._generateMask,
          mask,
          maskBuffer: this._maskBuffer,
          opcode: 10,
          readOnly,
          rsv1: false
        };
        if (this._deflating) {
          this.enqueue([this.dispatch, data, false, options, cb]);
        } else {
          this.sendFrame(_Sender.frame(data, options), cb);
        }
      }
      /**
       * Sends a data message to the other peer.
       *
       * @param {*} data The message to send
       * @param {Object} options Options object
       * @param {Boolean} [options.binary=false] Specifies whether `data` is binary
       *     or text
       * @param {Boolean} [options.compress=false] Specifies whether or not to
       *     compress `data`
       * @param {Boolean} [options.fin=false] Specifies whether the fragment is the
       *     last one
       * @param {Boolean} [options.mask=false] Specifies whether or not to mask
       *     `data`
       * @param {Function} [cb] Callback
       * @public
       */
      send(data, options, cb) {
        const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];
        let opcode = options.binary ? 2 : 1;
        let rsv1 = options.compress;
        let byteLength;
        let readOnly;
        if (typeof data === "string") {
          byteLength = Buffer.byteLength(data);
          readOnly = false;
        } else {
          data = toBuffer(data);
          byteLength = data.length;
          readOnly = toBuffer.readOnly;
        }
        if (this._firstFragment) {
          this._firstFragment = false;
          if (rsv1 && perMessageDeflate && perMessageDeflate.params[perMessageDeflate._isServer ? "server_no_context_takeover" : "client_no_context_takeover"]) {
            rsv1 = byteLength >= perMessageDeflate._threshold;
          }
          this._compress = rsv1;
        } else {
          rsv1 = false;
          opcode = 0;
        }
        if (options.fin)
          this._firstFragment = true;
        if (perMessageDeflate) {
          const opts = {
            [kByteLength]: byteLength,
            fin: options.fin,
            generateMask: this._generateMask,
            mask: options.mask,
            maskBuffer: this._maskBuffer,
            opcode,
            readOnly,
            rsv1
          };
          if (this._deflating) {
            this.enqueue([this.dispatch, data, this._compress, opts, cb]);
          } else {
            this.dispatch(data, this._compress, opts, cb);
          }
        } else {
          this.sendFrame(
            _Sender.frame(data, {
              [kByteLength]: byteLength,
              fin: options.fin,
              generateMask: this._generateMask,
              mask: options.mask,
              maskBuffer: this._maskBuffer,
              opcode,
              readOnly,
              rsv1: false
            }),
            cb
          );
        }
      }
      /**
       * Dispatches a message.
       *
       * @param {(Buffer|String)} data The message to send
       * @param {Boolean} [compress=false] Specifies whether or not to compress
       *     `data`
       * @param {Object} options Options object
       * @param {Boolean} [options.fin=false] Specifies whether or not to set the
       *     FIN bit
       * @param {Function} [options.generateMask] The function used to generate the
       *     masking key
       * @param {Boolean} [options.mask=false] Specifies whether or not to mask
       *     `data`
       * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
       *     key
       * @param {Number} options.opcode The opcode
       * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
       *     modified
       * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
       *     RSV1 bit
       * @param {Function} [cb] Callback
       * @private
       */
      dispatch(data, compress, options, cb) {
        if (!compress) {
          this.sendFrame(_Sender.frame(data, options), cb);
          return;
        }
        const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];
        this._bufferedBytes += options[kByteLength];
        this._deflating = true;
        perMessageDeflate.compress(data, options.fin, (_, buf) => {
          if (this._socket.destroyed) {
            const err = new Error(
              "The socket was closed while data was being compressed"
            );
            if (typeof cb === "function")
              cb(err);
            for (let i = 0; i < this._queue.length; i++) {
              const params = this._queue[i];
              const callback = params[params.length - 1];
              if (typeof callback === "function")
                callback(err);
            }
            return;
          }
          this._bufferedBytes -= options[kByteLength];
          this._deflating = false;
          options.readOnly = false;
          this.sendFrame(_Sender.frame(buf, options), cb);
          this.dequeue();
        });
      }
      /**
       * Executes queued send operations.
       *
       * @private
       */
      dequeue() {
        while (!this._deflating && this._queue.length) {
          const params = this._queue.shift();
          this._bufferedBytes -= params[3][kByteLength];
          Reflect.apply(params[0], this, params.slice(1));
        }
      }
      /**
       * Enqueues a send operation.
       *
       * @param {Array} params Send operation parameters.
       * @private
       */
      enqueue(params) {
        this._bufferedBytes += params[3][kByteLength];
        this._queue.push(params);
      }
      /**
       * Sends a frame.
       *
       * @param {Buffer[]} list The frame to send
       * @param {Function} [cb] Callback
       * @private
       */
      sendFrame(list, cb) {
        if (list.length === 2) {
          this._socket.cork();
          this._socket.write(list[0]);
          this._socket.write(list[1], cb);
          this._socket.uncork();
        } else {
          this._socket.write(list[0], cb);
        }
      }
    };
    module2.exports = Sender;
  }
});

// node_modules/ws/lib/event-target.js
var require_event_target = __commonJS({
  "node_modules/ws/lib/event-target.js"(exports, module2) {
    "use strict";
    var { kForOnEventAttribute, kListener } = require_constants();
    var kCode = Symbol("kCode");
    var kData = Symbol("kData");
    var kError = Symbol("kError");
    var kMessage = Symbol("kMessage");
    var kReason = Symbol("kReason");
    var kTarget = Symbol("kTarget");
    var kType = Symbol("kType");
    var kWasClean = Symbol("kWasClean");
    var Event = class {
      /**
       * Create a new `Event`.
       *
       * @param {String} type The name of the event
       * @throws {TypeError} If the `type` argument is not specified
       */
      constructor(type) {
        this[kTarget] = null;
        this[kType] = type;
      }
      /**
       * @type {*}
       */
      get target() {
        return this[kTarget];
      }
      /**
       * @type {String}
       */
      get type() {
        return this[kType];
      }
    };
    Object.defineProperty(Event.prototype, "target", { enumerable: true });
    Object.defineProperty(Event.prototype, "type", { enumerable: true });
    var CloseEvent = class extends Event {
      /**
       * Create a new `CloseEvent`.
       *
       * @param {String} type The name of the event
       * @param {Object} [options] A dictionary object that allows for setting
       *     attributes via object members of the same name
       * @param {Number} [options.code=0] The status code explaining why the
       *     connection was closed
       * @param {String} [options.reason=''] A human-readable string explaining why
       *     the connection was closed
       * @param {Boolean} [options.wasClean=false] Indicates whether or not the
       *     connection was cleanly closed
       */
      constructor(type, options = {}) {
        super(type);
        this[kCode] = options.code === void 0 ? 0 : options.code;
        this[kReason] = options.reason === void 0 ? "" : options.reason;
        this[kWasClean] = options.wasClean === void 0 ? false : options.wasClean;
      }
      /**
       * @type {Number}
       */
      get code() {
        return this[kCode];
      }
      /**
       * @type {String}
       */
      get reason() {
        return this[kReason];
      }
      /**
       * @type {Boolean}
       */
      get wasClean() {
        return this[kWasClean];
      }
    };
    Object.defineProperty(CloseEvent.prototype, "code", { enumerable: true });
    Object.defineProperty(CloseEvent.prototype, "reason", { enumerable: true });
    Object.defineProperty(CloseEvent.prototype, "wasClean", { enumerable: true });
    var ErrorEvent = class extends Event {
      /**
       * Create a new `ErrorEvent`.
       *
       * @param {String} type The name of the event
       * @param {Object} [options] A dictionary object that allows for setting
       *     attributes via object members of the same name
       * @param {*} [options.error=null] The error that generated this event
       * @param {String} [options.message=''] The error message
       */
      constructor(type, options = {}) {
        super(type);
        this[kError] = options.error === void 0 ? null : options.error;
        this[kMessage] = options.message === void 0 ? "" : options.message;
      }
      /**
       * @type {*}
       */
      get error() {
        return this[kError];
      }
      /**
       * @type {String}
       */
      get message() {
        return this[kMessage];
      }
    };
    Object.defineProperty(ErrorEvent.prototype, "error", { enumerable: true });
    Object.defineProperty(ErrorEvent.prototype, "message", { enumerable: true });
    var MessageEvent = class extends Event {
      /**
       * Create a new `MessageEvent`.
       *
       * @param {String} type The name of the event
       * @param {Object} [options] A dictionary object that allows for setting
       *     attributes via object members of the same name
       * @param {*} [options.data=null] The message content
       */
      constructor(type, options = {}) {
        super(type);
        this[kData] = options.data === void 0 ? null : options.data;
      }
      /**
       * @type {*}
       */
      get data() {
        return this[kData];
      }
    };
    Object.defineProperty(MessageEvent.prototype, "data", { enumerable: true });
    var EventTarget = {
      /**
       * Register an event listener.
       *
       * @param {String} type A string representing the event type to listen for
       * @param {(Function|Object)} handler The listener to add
       * @param {Object} [options] An options object specifies characteristics about
       *     the event listener
       * @param {Boolean} [options.once=false] A `Boolean` indicating that the
       *     listener should be invoked at most once after being added. If `true`,
       *     the listener would be automatically removed when invoked.
       * @public
       */
      addEventListener(type, handler, options = {}) {
        for (const listener of this.listeners(type)) {
          if (!options[kForOnEventAttribute] && listener[kListener] === handler && !listener[kForOnEventAttribute]) {
            return;
          }
        }
        let wrapper;
        if (type === "message") {
          wrapper = function onMessage(data, isBinary) {
            const event = new MessageEvent("message", {
              data: isBinary ? data : data.toString()
            });
            event[kTarget] = this;
            callListener(handler, this, event);
          };
        } else if (type === "close") {
          wrapper = function onClose(code, message) {
            const event = new CloseEvent("close", {
              code,
              reason: message.toString(),
              wasClean: this._closeFrameReceived && this._closeFrameSent
            });
            event[kTarget] = this;
            callListener(handler, this, event);
          };
        } else if (type === "error") {
          wrapper = function onError(error) {
            const event = new ErrorEvent("error", {
              error,
              message: error.message
            });
            event[kTarget] = this;
            callListener(handler, this, event);
          };
        } else if (type === "open") {
          wrapper = function onOpen() {
            const event = new Event("open");
            event[kTarget] = this;
            callListener(handler, this, event);
          };
        } else {
          return;
        }
        wrapper[kForOnEventAttribute] = !!options[kForOnEventAttribute];
        wrapper[kListener] = handler;
        if (options.once) {
          this.once(type, wrapper);
        } else {
          this.on(type, wrapper);
        }
      },
      /**
       * Remove an event listener.
       *
       * @param {String} type A string representing the event type to remove
       * @param {(Function|Object)} handler The listener to remove
       * @public
       */
      removeEventListener(type, handler) {
        for (const listener of this.listeners(type)) {
          if (listener[kListener] === handler && !listener[kForOnEventAttribute]) {
            this.removeListener(type, listener);
            break;
          }
        }
      }
    };
    module2.exports = {
      CloseEvent,
      ErrorEvent,
      Event,
      EventTarget,
      MessageEvent
    };
    function callListener(listener, thisArg, event) {
      if (typeof listener === "object" && listener.handleEvent) {
        listener.handleEvent.call(listener, event);
      } else {
        listener.call(thisArg, event);
      }
    }
  }
});

// node_modules/ws/lib/extension.js
var require_extension = __commonJS({
  "node_modules/ws/lib/extension.js"(exports, module2) {
    "use strict";
    var { tokenChars } = require_validation();
    function push(dest, name, elem) {
      if (dest[name] === void 0)
        dest[name] = [elem];
      else
        dest[name].push(elem);
    }
    function parse(header) {
      const offers = /* @__PURE__ */ Object.create(null);
      let params = /* @__PURE__ */ Object.create(null);
      let mustUnescape = false;
      let isEscaping = false;
      let inQuotes = false;
      let extensionName;
      let paramName;
      let start = -1;
      let code = -1;
      let end = -1;
      let i = 0;
      for (; i < header.length; i++) {
        code = header.charCodeAt(i);
        if (extensionName === void 0) {
          if (end === -1 && tokenChars[code] === 1) {
            if (start === -1)
              start = i;
          } else if (i !== 0 && (code === 32 || code === 9)) {
            if (end === -1 && start !== -1)
              end = i;
          } else if (code === 59 || code === 44) {
            if (start === -1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (end === -1)
              end = i;
            const name = header.slice(start, end);
            if (code === 44) {
              push(offers, name, params);
              params = /* @__PURE__ */ Object.create(null);
            } else {
              extensionName = name;
            }
            start = end = -1;
          } else {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
        } else if (paramName === void 0) {
          if (end === -1 && tokenChars[code] === 1) {
            if (start === -1)
              start = i;
          } else if (code === 32 || code === 9) {
            if (end === -1 && start !== -1)
              end = i;
          } else if (code === 59 || code === 44) {
            if (start === -1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (end === -1)
              end = i;
            push(params, header.slice(start, end), true);
            if (code === 44) {
              push(offers, extensionName, params);
              params = /* @__PURE__ */ Object.create(null);
              extensionName = void 0;
            }
            start = end = -1;
          } else if (code === 61 && start !== -1 && end === -1) {
            paramName = header.slice(start, i);
            start = end = -1;
          } else {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
        } else {
          if (isEscaping) {
            if (tokenChars[code] !== 1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (start === -1)
              start = i;
            else if (!mustUnescape)
              mustUnescape = true;
            isEscaping = false;
          } else if (inQuotes) {
            if (tokenChars[code] === 1) {
              if (start === -1)
                start = i;
            } else if (code === 34 && start !== -1) {
              inQuotes = false;
              end = i;
            } else if (code === 92) {
              isEscaping = true;
            } else {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
          } else if (code === 34 && header.charCodeAt(i - 1) === 61) {
            inQuotes = true;
          } else if (end === -1 && tokenChars[code] === 1) {
            if (start === -1)
              start = i;
          } else if (start !== -1 && (code === 32 || code === 9)) {
            if (end === -1)
              end = i;
          } else if (code === 59 || code === 44) {
            if (start === -1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (end === -1)
              end = i;
            let value = header.slice(start, end);
            if (mustUnescape) {
              value = value.replace(/\\/g, "");
              mustUnescape = false;
            }
            push(params, paramName, value);
            if (code === 44) {
              push(offers, extensionName, params);
              params = /* @__PURE__ */ Object.create(null);
              extensionName = void 0;
            }
            paramName = void 0;
            start = end = -1;
          } else {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
        }
      }
      if (start === -1 || inQuotes || code === 32 || code === 9) {
        throw new SyntaxError("Unexpected end of input");
      }
      if (end === -1)
        end = i;
      const token = header.slice(start, end);
      if (extensionName === void 0) {
        push(offers, token, params);
      } else {
        if (paramName === void 0) {
          push(params, token, true);
        } else if (mustUnescape) {
          push(params, paramName, token.replace(/\\/g, ""));
        } else {
          push(params, paramName, token);
        }
        push(offers, extensionName, params);
      }
      return offers;
    }
    function format(extensions) {
      return Object.keys(extensions).map((extension) => {
        let configurations = extensions[extension];
        if (!Array.isArray(configurations))
          configurations = [configurations];
        return configurations.map((params) => {
          return [extension].concat(
            Object.keys(params).map((k) => {
              let values = params[k];
              if (!Array.isArray(values))
                values = [values];
              return values.map((v) => v === true ? k : `${k}=${v}`).join("; ");
            })
          ).join("; ");
        }).join(", ");
      }).join(", ");
    }
    module2.exports = { format, parse };
  }
});

// node_modules/ws/lib/websocket.js
var require_websocket = __commonJS({
  "node_modules/ws/lib/websocket.js"(exports, module2) {
    "use strict";
    var EventEmitter = require("events");
    var https = require("https");
    var http = require("http");
    var net = require("net");
    var tls = require("tls");
    var { randomBytes, createHash } = require("crypto");
    var { Readable } = require("stream");
    var { URL } = require("url");
    var PerMessageDeflate = require_permessage_deflate();
    var Receiver = require_receiver();
    var Sender = require_sender();
    var {
      BINARY_TYPES,
      EMPTY_BUFFER,
      GUID,
      kForOnEventAttribute,
      kListener,
      kStatusCode,
      kWebSocket,
      NOOP
    } = require_constants();
    var {
      EventTarget: { addEventListener, removeEventListener }
    } = require_event_target();
    var { format, parse } = require_extension();
    var { toBuffer } = require_buffer_util();
    var closeTimeout = 30 * 1e3;
    var kAborted = Symbol("kAborted");
    var protocolVersions = [8, 13];
    var readyStates = ["CONNECTING", "OPEN", "CLOSING", "CLOSED"];
    var subprotocolRegex = /^[!#$%&'*+\-.0-9A-Z^_`|a-z~]+$/;
    var WebSocket2 = class _WebSocket extends EventEmitter {
      /**
       * Create a new `WebSocket`.
       *
       * @param {(String|URL)} address The URL to which to connect
       * @param {(String|String[])} [protocols] The subprotocols
       * @param {Object} [options] Connection options
       */
      constructor(address, protocols, options) {
        super();
        this._binaryType = BINARY_TYPES[0];
        this._closeCode = 1006;
        this._closeFrameReceived = false;
        this._closeFrameSent = false;
        this._closeMessage = EMPTY_BUFFER;
        this._closeTimer = null;
        this._extensions = {};
        this._paused = false;
        this._protocol = "";
        this._readyState = _WebSocket.CONNECTING;
        this._receiver = null;
        this._sender = null;
        this._socket = null;
        if (address !== null) {
          this._bufferedAmount = 0;
          this._isServer = false;
          this._redirects = 0;
          if (protocols === void 0) {
            protocols = [];
          } else if (!Array.isArray(protocols)) {
            if (typeof protocols === "object" && protocols !== null) {
              options = protocols;
              protocols = [];
            } else {
              protocols = [protocols];
            }
          }
          initAsClient(this, address, protocols, options);
        } else {
          this._isServer = true;
        }
      }
      /**
       * This deviates from the WHATWG interface since ws doesn't support the
       * required default "blob" type (instead we define a custom "nodebuffer"
       * type).
       *
       * @type {String}
       */
      get binaryType() {
        return this._binaryType;
      }
      set binaryType(type) {
        if (!BINARY_TYPES.includes(type))
          return;
        this._binaryType = type;
        if (this._receiver)
          this._receiver._binaryType = type;
      }
      /**
       * @type {Number}
       */
      get bufferedAmount() {
        if (!this._socket)
          return this._bufferedAmount;
        return this._socket._writableState.length + this._sender._bufferedBytes;
      }
      /**
       * @type {String}
       */
      get extensions() {
        return Object.keys(this._extensions).join();
      }
      /**
       * @type {Boolean}
       */
      get isPaused() {
        return this._paused;
      }
      /**
       * @type {Function}
       */
      /* istanbul ignore next */
      get onclose() {
        return null;
      }
      /**
       * @type {Function}
       */
      /* istanbul ignore next */
      get onerror() {
        return null;
      }
      /**
       * @type {Function}
       */
      /* istanbul ignore next */
      get onopen() {
        return null;
      }
      /**
       * @type {Function}
       */
      /* istanbul ignore next */
      get onmessage() {
        return null;
      }
      /**
       * @type {String}
       */
      get protocol() {
        return this._protocol;
      }
      /**
       * @type {Number}
       */
      get readyState() {
        return this._readyState;
      }
      /**
       * @type {String}
       */
      get url() {
        return this._url;
      }
      /**
       * Set up the socket and the internal resources.
       *
       * @param {(net.Socket|tls.Socket)} socket The network socket between the
       *     server and client
       * @param {Buffer} head The first packet of the upgraded stream
       * @param {Object} options Options object
       * @param {Function} [options.generateMask] The function used to generate the
       *     masking key
       * @param {Number} [options.maxPayload=0] The maximum allowed message size
       * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
       *     not to skip UTF-8 validation for text and close messages
       * @private
       */
      setSocket(socket, head, options) {
        const receiver = new Receiver({
          binaryType: this.binaryType,
          extensions: this._extensions,
          isServer: this._isServer,
          maxPayload: options.maxPayload,
          skipUTF8Validation: options.skipUTF8Validation
        });
        this._sender = new Sender(socket, this._extensions, options.generateMask);
        this._receiver = receiver;
        this._socket = socket;
        receiver[kWebSocket] = this;
        socket[kWebSocket] = this;
        receiver.on("conclude", receiverOnConclude);
        receiver.on("drain", receiverOnDrain);
        receiver.on("error", receiverOnError);
        receiver.on("message", receiverOnMessage);
        receiver.on("ping", receiverOnPing);
        receiver.on("pong", receiverOnPong);
        socket.setTimeout(0);
        socket.setNoDelay();
        if (head.length > 0)
          socket.unshift(head);
        socket.on("close", socketOnClose);
        socket.on("data", socketOnData);
        socket.on("end", socketOnEnd);
        socket.on("error", socketOnError);
        this._readyState = _WebSocket.OPEN;
        this.emit("open");
      }
      /**
       * Emit the `'close'` event.
       *
       * @private
       */
      emitClose() {
        if (!this._socket) {
          this._readyState = _WebSocket.CLOSED;
          this.emit("close", this._closeCode, this._closeMessage);
          return;
        }
        if (this._extensions[PerMessageDeflate.extensionName]) {
          this._extensions[PerMessageDeflate.extensionName].cleanup();
        }
        this._receiver.removeAllListeners();
        this._readyState = _WebSocket.CLOSED;
        this.emit("close", this._closeCode, this._closeMessage);
      }
      /**
       * Start a closing handshake.
       *
       *          +----------+   +-----------+   +----------+
       *     - - -|ws.close()|-->|close frame|-->|ws.close()|- - -
       *    |     +----------+   +-----------+   +----------+     |
       *          +----------+   +-----------+         |
       * CLOSING  |ws.close()|<--|close frame|<--+-----+       CLOSING
       *          +----------+   +-----------+   |
       *    |           |                        |   +---+        |
       *                +------------------------+-->|fin| - - - -
       *    |         +---+                      |   +---+
       *     - - - - -|fin|<---------------------+
       *              +---+
       *
       * @param {Number} [code] Status code explaining why the connection is closing
       * @param {(String|Buffer)} [data] The reason why the connection is
       *     closing
       * @public
       */
      close(code, data) {
        if (this.readyState === _WebSocket.CLOSED)
          return;
        if (this.readyState === _WebSocket.CONNECTING) {
          const msg = "WebSocket was closed before the connection was established";
          abortHandshake(this, this._req, msg);
          return;
        }
        if (this.readyState === _WebSocket.CLOSING) {
          if (this._closeFrameSent && (this._closeFrameReceived || this._receiver._writableState.errorEmitted)) {
            this._socket.end();
          }
          return;
        }
        this._readyState = _WebSocket.CLOSING;
        this._sender.close(code, data, !this._isServer, (err) => {
          if (err)
            return;
          this._closeFrameSent = true;
          if (this._closeFrameReceived || this._receiver._writableState.errorEmitted) {
            this._socket.end();
          }
        });
        this._closeTimer = setTimeout(
          this._socket.destroy.bind(this._socket),
          closeTimeout
        );
      }
      /**
       * Pause the socket.
       *
       * @public
       */
      pause() {
        if (this.readyState === _WebSocket.CONNECTING || this.readyState === _WebSocket.CLOSED) {
          return;
        }
        this._paused = true;
        this._socket.pause();
      }
      /**
       * Send a ping.
       *
       * @param {*} [data] The data to send
       * @param {Boolean} [mask] Indicates whether or not to mask `data`
       * @param {Function} [cb] Callback which is executed when the ping is sent
       * @public
       */
      ping(data, mask, cb) {
        if (this.readyState === _WebSocket.CONNECTING) {
          throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
        }
        if (typeof data === "function") {
          cb = data;
          data = mask = void 0;
        } else if (typeof mask === "function") {
          cb = mask;
          mask = void 0;
        }
        if (typeof data === "number")
          data = data.toString();
        if (this.readyState !== _WebSocket.OPEN) {
          sendAfterClose(this, data, cb);
          return;
        }
        if (mask === void 0)
          mask = !this._isServer;
        this._sender.ping(data || EMPTY_BUFFER, mask, cb);
      }
      /**
       * Send a pong.
       *
       * @param {*} [data] The data to send
       * @param {Boolean} [mask] Indicates whether or not to mask `data`
       * @param {Function} [cb] Callback which is executed when the pong is sent
       * @public
       */
      pong(data, mask, cb) {
        if (this.readyState === _WebSocket.CONNECTING) {
          throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
        }
        if (typeof data === "function") {
          cb = data;
          data = mask = void 0;
        } else if (typeof mask === "function") {
          cb = mask;
          mask = void 0;
        }
        if (typeof data === "number")
          data = data.toString();
        if (this.readyState !== _WebSocket.OPEN) {
          sendAfterClose(this, data, cb);
          return;
        }
        if (mask === void 0)
          mask = !this._isServer;
        this._sender.pong(data || EMPTY_BUFFER, mask, cb);
      }
      /**
       * Resume the socket.
       *
       * @public
       */
      resume() {
        if (this.readyState === _WebSocket.CONNECTING || this.readyState === _WebSocket.CLOSED) {
          return;
        }
        this._paused = false;
        if (!this._receiver._writableState.needDrain)
          this._socket.resume();
      }
      /**
       * Send a data message.
       *
       * @param {*} data The message to send
       * @param {Object} [options] Options object
       * @param {Boolean} [options.binary] Specifies whether `data` is binary or
       *     text
       * @param {Boolean} [options.compress] Specifies whether or not to compress
       *     `data`
       * @param {Boolean} [options.fin=true] Specifies whether the fragment is the
       *     last one
       * @param {Boolean} [options.mask] Specifies whether or not to mask `data`
       * @param {Function} [cb] Callback which is executed when data is written out
       * @public
       */
      send(data, options, cb) {
        if (this.readyState === _WebSocket.CONNECTING) {
          throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
        }
        if (typeof options === "function") {
          cb = options;
          options = {};
        }
        if (typeof data === "number")
          data = data.toString();
        if (this.readyState !== _WebSocket.OPEN) {
          sendAfterClose(this, data, cb);
          return;
        }
        const opts = {
          binary: typeof data !== "string",
          mask: !this._isServer,
          compress: true,
          fin: true,
          ...options
        };
        if (!this._extensions[PerMessageDeflate.extensionName]) {
          opts.compress = false;
        }
        this._sender.send(data || EMPTY_BUFFER, opts, cb);
      }
      /**
       * Forcibly close the connection.
       *
       * @public
       */
      terminate() {
        if (this.readyState === _WebSocket.CLOSED)
          return;
        if (this.readyState === _WebSocket.CONNECTING) {
          const msg = "WebSocket was closed before the connection was established";
          abortHandshake(this, this._req, msg);
          return;
        }
        if (this._socket) {
          this._readyState = _WebSocket.CLOSING;
          this._socket.destroy();
        }
      }
    };
    Object.defineProperty(WebSocket2, "CONNECTING", {
      enumerable: true,
      value: readyStates.indexOf("CONNECTING")
    });
    Object.defineProperty(WebSocket2.prototype, "CONNECTING", {
      enumerable: true,
      value: readyStates.indexOf("CONNECTING")
    });
    Object.defineProperty(WebSocket2, "OPEN", {
      enumerable: true,
      value: readyStates.indexOf("OPEN")
    });
    Object.defineProperty(WebSocket2.prototype, "OPEN", {
      enumerable: true,
      value: readyStates.indexOf("OPEN")
    });
    Object.defineProperty(WebSocket2, "CLOSING", {
      enumerable: true,
      value: readyStates.indexOf("CLOSING")
    });
    Object.defineProperty(WebSocket2.prototype, "CLOSING", {
      enumerable: true,
      value: readyStates.indexOf("CLOSING")
    });
    Object.defineProperty(WebSocket2, "CLOSED", {
      enumerable: true,
      value: readyStates.indexOf("CLOSED")
    });
    Object.defineProperty(WebSocket2.prototype, "CLOSED", {
      enumerable: true,
      value: readyStates.indexOf("CLOSED")
    });
    [
      "binaryType",
      "bufferedAmount",
      "extensions",
      "isPaused",
      "protocol",
      "readyState",
      "url"
    ].forEach((property) => {
      Object.defineProperty(WebSocket2.prototype, property, { enumerable: true });
    });
    ["open", "error", "close", "message"].forEach((method) => {
      Object.defineProperty(WebSocket2.prototype, `on${method}`, {
        enumerable: true,
        get() {
          for (const listener of this.listeners(method)) {
            if (listener[kForOnEventAttribute])
              return listener[kListener];
          }
          return null;
        },
        set(handler) {
          for (const listener of this.listeners(method)) {
            if (listener[kForOnEventAttribute]) {
              this.removeListener(method, listener);
              break;
            }
          }
          if (typeof handler !== "function")
            return;
          this.addEventListener(method, handler, {
            [kForOnEventAttribute]: true
          });
        }
      });
    });
    WebSocket2.prototype.addEventListener = addEventListener;
    WebSocket2.prototype.removeEventListener = removeEventListener;
    module2.exports = WebSocket2;
    function initAsClient(websocket, address, protocols, options) {
      const opts = {
        protocolVersion: protocolVersions[1],
        maxPayload: 100 * 1024 * 1024,
        skipUTF8Validation: false,
        perMessageDeflate: true,
        followRedirects: false,
        maxRedirects: 10,
        ...options,
        createConnection: void 0,
        socketPath: void 0,
        hostname: void 0,
        protocol: void 0,
        timeout: void 0,
        method: "GET",
        host: void 0,
        path: void 0,
        port: void 0
      };
      if (!protocolVersions.includes(opts.protocolVersion)) {
        throw new RangeError(
          `Unsupported protocol version: ${opts.protocolVersion} (supported versions: ${protocolVersions.join(", ")})`
        );
      }
      let parsedUrl;
      if (address instanceof URL) {
        parsedUrl = address;
        websocket._url = address.href;
      } else {
        try {
          parsedUrl = new URL(address);
        } catch (e) {
          throw new SyntaxError(`Invalid URL: ${address}`);
        }
        websocket._url = address;
      }
      const isSecure = parsedUrl.protocol === "wss:";
      const isIpcUrl = parsedUrl.protocol === "ws+unix:";
      let invalidUrlMessage;
      if (parsedUrl.protocol !== "ws:" && !isSecure && !isIpcUrl) {
        invalidUrlMessage = `The URL's protocol must be one of "ws:", "wss:", or "ws+unix:"`;
      } else if (isIpcUrl && !parsedUrl.pathname) {
        invalidUrlMessage = "The URL's pathname is empty";
      } else if (parsedUrl.hash) {
        invalidUrlMessage = "The URL contains a fragment identifier";
      }
      if (invalidUrlMessage) {
        const err = new SyntaxError(invalidUrlMessage);
        if (websocket._redirects === 0) {
          throw err;
        } else {
          emitErrorAndClose(websocket, err);
          return;
        }
      }
      const defaultPort = isSecure ? 443 : 80;
      const key = randomBytes(16).toString("base64");
      const request = isSecure ? https.request : http.request;
      const protocolSet = /* @__PURE__ */ new Set();
      let perMessageDeflate;
      opts.createConnection = isSecure ? tlsConnect : netConnect;
      opts.defaultPort = opts.defaultPort || defaultPort;
      opts.port = parsedUrl.port || defaultPort;
      opts.host = parsedUrl.hostname.startsWith("[") ? parsedUrl.hostname.slice(1, -1) : parsedUrl.hostname;
      opts.headers = {
        ...opts.headers,
        "Sec-WebSocket-Version": opts.protocolVersion,
        "Sec-WebSocket-Key": key,
        Connection: "Upgrade",
        Upgrade: "websocket"
      };
      opts.path = parsedUrl.pathname + parsedUrl.search;
      opts.timeout = opts.handshakeTimeout;
      if (opts.perMessageDeflate) {
        perMessageDeflate = new PerMessageDeflate(
          opts.perMessageDeflate !== true ? opts.perMessageDeflate : {},
          false,
          opts.maxPayload
        );
        opts.headers["Sec-WebSocket-Extensions"] = format({
          [PerMessageDeflate.extensionName]: perMessageDeflate.offer()
        });
      }
      if (protocols.length) {
        for (const protocol of protocols) {
          if (typeof protocol !== "string" || !subprotocolRegex.test(protocol) || protocolSet.has(protocol)) {
            throw new SyntaxError(
              "An invalid or duplicated subprotocol was specified"
            );
          }
          protocolSet.add(protocol);
        }
        opts.headers["Sec-WebSocket-Protocol"] = protocols.join(",");
      }
      if (opts.origin) {
        if (opts.protocolVersion < 13) {
          opts.headers["Sec-WebSocket-Origin"] = opts.origin;
        } else {
          opts.headers.Origin = opts.origin;
        }
      }
      if (parsedUrl.username || parsedUrl.password) {
        opts.auth = `${parsedUrl.username}:${parsedUrl.password}`;
      }
      if (isIpcUrl) {
        const parts = opts.path.split(":");
        opts.socketPath = parts[0];
        opts.path = parts[1];
      }
      let req;
      if (opts.followRedirects) {
        if (websocket._redirects === 0) {
          websocket._originalIpc = isIpcUrl;
          websocket._originalSecure = isSecure;
          websocket._originalHostOrSocketPath = isIpcUrl ? opts.socketPath : parsedUrl.host;
          const headers = options && options.headers;
          options = { ...options, headers: {} };
          if (headers) {
            for (const [key2, value] of Object.entries(headers)) {
              options.headers[key2.toLowerCase()] = value;
            }
          }
        } else if (websocket.listenerCount("redirect") === 0) {
          const isSameHost = isIpcUrl ? websocket._originalIpc ? opts.socketPath === websocket._originalHostOrSocketPath : false : websocket._originalIpc ? false : parsedUrl.host === websocket._originalHostOrSocketPath;
          if (!isSameHost || websocket._originalSecure && !isSecure) {
            delete opts.headers.authorization;
            delete opts.headers.cookie;
            if (!isSameHost)
              delete opts.headers.host;
            opts.auth = void 0;
          }
        }
        if (opts.auth && !options.headers.authorization) {
          options.headers.authorization = "Basic " + Buffer.from(opts.auth).toString("base64");
        }
        req = websocket._req = request(opts);
        if (websocket._redirects) {
          websocket.emit("redirect", websocket.url, req);
        }
      } else {
        req = websocket._req = request(opts);
      }
      if (opts.timeout) {
        req.on("timeout", () => {
          abortHandshake(websocket, req, "Opening handshake has timed out");
        });
      }
      req.on("error", (err) => {
        if (req === null || req[kAborted])
          return;
        req = websocket._req = null;
        emitErrorAndClose(websocket, err);
      });
      req.on("response", (res) => {
        const location = res.headers.location;
        const statusCode = res.statusCode;
        if (location && opts.followRedirects && statusCode >= 300 && statusCode < 400) {
          if (++websocket._redirects > opts.maxRedirects) {
            abortHandshake(websocket, req, "Maximum redirects exceeded");
            return;
          }
          req.abort();
          let addr;
          try {
            addr = new URL(location, address);
          } catch (e) {
            const err = new SyntaxError(`Invalid URL: ${location}`);
            emitErrorAndClose(websocket, err);
            return;
          }
          initAsClient(websocket, addr, protocols, options);
        } else if (!websocket.emit("unexpected-response", req, res)) {
          abortHandshake(
            websocket,
            req,
            `Unexpected server response: ${res.statusCode}`
          );
        }
      });
      req.on("upgrade", (res, socket, head) => {
        websocket.emit("upgrade", res);
        if (websocket.readyState !== WebSocket2.CONNECTING)
          return;
        req = websocket._req = null;
        if (res.headers.upgrade.toLowerCase() !== "websocket") {
          abortHandshake(websocket, socket, "Invalid Upgrade header");
          return;
        }
        const digest = createHash("sha1").update(key + GUID).digest("base64");
        if (res.headers["sec-websocket-accept"] !== digest) {
          abortHandshake(websocket, socket, "Invalid Sec-WebSocket-Accept header");
          return;
        }
        const serverProt = res.headers["sec-websocket-protocol"];
        let protError;
        if (serverProt !== void 0) {
          if (!protocolSet.size) {
            protError = "Server sent a subprotocol but none was requested";
          } else if (!protocolSet.has(serverProt)) {
            protError = "Server sent an invalid subprotocol";
          }
        } else if (protocolSet.size) {
          protError = "Server sent no subprotocol";
        }
        if (protError) {
          abortHandshake(websocket, socket, protError);
          return;
        }
        if (serverProt)
          websocket._protocol = serverProt;
        const secWebSocketExtensions = res.headers["sec-websocket-extensions"];
        if (secWebSocketExtensions !== void 0) {
          if (!perMessageDeflate) {
            const message = "Server sent a Sec-WebSocket-Extensions header but no extension was requested";
            abortHandshake(websocket, socket, message);
            return;
          }
          let extensions;
          try {
            extensions = parse(secWebSocketExtensions);
          } catch (err) {
            const message = "Invalid Sec-WebSocket-Extensions header";
            abortHandshake(websocket, socket, message);
            return;
          }
          const extensionNames = Object.keys(extensions);
          if (extensionNames.length !== 1 || extensionNames[0] !== PerMessageDeflate.extensionName) {
            const message = "Server indicated an extension that was not requested";
            abortHandshake(websocket, socket, message);
            return;
          }
          try {
            perMessageDeflate.accept(extensions[PerMessageDeflate.extensionName]);
          } catch (err) {
            const message = "Invalid Sec-WebSocket-Extensions header";
            abortHandshake(websocket, socket, message);
            return;
          }
          websocket._extensions[PerMessageDeflate.extensionName] = perMessageDeflate;
        }
        websocket.setSocket(socket, head, {
          generateMask: opts.generateMask,
          maxPayload: opts.maxPayload,
          skipUTF8Validation: opts.skipUTF8Validation
        });
      });
      if (opts.finishRequest) {
        opts.finishRequest(req, websocket);
      } else {
        req.end();
      }
    }
    function emitErrorAndClose(websocket, err) {
      websocket._readyState = WebSocket2.CLOSING;
      websocket.emit("error", err);
      websocket.emitClose();
    }
    function netConnect(options) {
      options.path = options.socketPath;
      return net.connect(options);
    }
    function tlsConnect(options) {
      options.path = void 0;
      if (!options.servername && options.servername !== "") {
        options.servername = net.isIP(options.host) ? "" : options.host;
      }
      return tls.connect(options);
    }
    function abortHandshake(websocket, stream, message) {
      websocket._readyState = WebSocket2.CLOSING;
      const err = new Error(message);
      Error.captureStackTrace(err, abortHandshake);
      if (stream.setHeader) {
        stream[kAborted] = true;
        stream.abort();
        if (stream.socket && !stream.socket.destroyed) {
          stream.socket.destroy();
        }
        process.nextTick(emitErrorAndClose, websocket, err);
      } else {
        stream.destroy(err);
        stream.once("error", websocket.emit.bind(websocket, "error"));
        stream.once("close", websocket.emitClose.bind(websocket));
      }
    }
    function sendAfterClose(websocket, data, cb) {
      if (data) {
        const length = toBuffer(data).length;
        if (websocket._socket)
          websocket._sender._bufferedBytes += length;
        else
          websocket._bufferedAmount += length;
      }
      if (cb) {
        const err = new Error(
          `WebSocket is not open: readyState ${websocket.readyState} (${readyStates[websocket.readyState]})`
        );
        process.nextTick(cb, err);
      }
    }
    function receiverOnConclude(code, reason) {
      const websocket = this[kWebSocket];
      websocket._closeFrameReceived = true;
      websocket._closeMessage = reason;
      websocket._closeCode = code;
      if (websocket._socket[kWebSocket] === void 0)
        return;
      websocket._socket.removeListener("data", socketOnData);
      process.nextTick(resume, websocket._socket);
      if (code === 1005)
        websocket.close();
      else
        websocket.close(code, reason);
    }
    function receiverOnDrain() {
      const websocket = this[kWebSocket];
      if (!websocket.isPaused)
        websocket._socket.resume();
    }
    function receiverOnError(err) {
      const websocket = this[kWebSocket];
      if (websocket._socket[kWebSocket] !== void 0) {
        websocket._socket.removeListener("data", socketOnData);
        process.nextTick(resume, websocket._socket);
        websocket.close(err[kStatusCode]);
      }
      websocket.emit("error", err);
    }
    function receiverOnFinish() {
      this[kWebSocket].emitClose();
    }
    function receiverOnMessage(data, isBinary) {
      this[kWebSocket].emit("message", data, isBinary);
    }
    function receiverOnPing(data) {
      const websocket = this[kWebSocket];
      websocket.pong(data, !websocket._isServer, NOOP);
      websocket.emit("ping", data);
    }
    function receiverOnPong(data) {
      this[kWebSocket].emit("pong", data);
    }
    function resume(stream) {
      stream.resume();
    }
    function socketOnClose() {
      const websocket = this[kWebSocket];
      this.removeListener("close", socketOnClose);
      this.removeListener("data", socketOnData);
      this.removeListener("end", socketOnEnd);
      websocket._readyState = WebSocket2.CLOSING;
      let chunk;
      if (!this._readableState.endEmitted && !websocket._closeFrameReceived && !websocket._receiver._writableState.errorEmitted && (chunk = websocket._socket.read()) !== null) {
        websocket._receiver.write(chunk);
      }
      websocket._receiver.end();
      this[kWebSocket] = void 0;
      clearTimeout(websocket._closeTimer);
      if (websocket._receiver._writableState.finished || websocket._receiver._writableState.errorEmitted) {
        websocket.emitClose();
      } else {
        websocket._receiver.on("error", receiverOnFinish);
        websocket._receiver.on("finish", receiverOnFinish);
      }
    }
    function socketOnData(chunk) {
      if (!this[kWebSocket]._receiver.write(chunk)) {
        this.pause();
      }
    }
    function socketOnEnd() {
      const websocket = this[kWebSocket];
      websocket._readyState = WebSocket2.CLOSING;
      websocket._receiver.end();
      this.end();
    }
    function socketOnError() {
      const websocket = this[kWebSocket];
      this.removeListener("error", socketOnError);
      this.on("error", NOOP);
      if (websocket) {
        websocket._readyState = WebSocket2.CLOSING;
        this.destroy();
      }
    }
  }
});

// node_modules/ws/lib/stream.js
var require_stream = __commonJS({
  "node_modules/ws/lib/stream.js"(exports, module2) {
    "use strict";
    var { Duplex } = require("stream");
    function emitClose(stream) {
      stream.emit("close");
    }
    function duplexOnEnd() {
      if (!this.destroyed && this._writableState.finished) {
        this.destroy();
      }
    }
    function duplexOnError(err) {
      this.removeListener("error", duplexOnError);
      this.destroy();
      if (this.listenerCount("error") === 0) {
        this.emit("error", err);
      }
    }
    function createWebSocketStream(ws, options) {
      let terminateOnDestroy = true;
      const duplex = new Duplex({
        ...options,
        autoDestroy: false,
        emitClose: false,
        objectMode: false,
        writableObjectMode: false
      });
      ws.on("message", function message(msg, isBinary) {
        const data = !isBinary && duplex._readableState.objectMode ? msg.toString() : msg;
        if (!duplex.push(data))
          ws.pause();
      });
      ws.once("error", function error(err) {
        if (duplex.destroyed)
          return;
        terminateOnDestroy = false;
        duplex.destroy(err);
      });
      ws.once("close", function close() {
        if (duplex.destroyed)
          return;
        duplex.push(null);
      });
      duplex._destroy = function(err, callback) {
        if (ws.readyState === ws.CLOSED) {
          callback(err);
          process.nextTick(emitClose, duplex);
          return;
        }
        let called = false;
        ws.once("error", function error(err2) {
          called = true;
          callback(err2);
        });
        ws.once("close", function close() {
          if (!called)
            callback(err);
          process.nextTick(emitClose, duplex);
        });
        if (terminateOnDestroy)
          ws.terminate();
      };
      duplex._final = function(callback) {
        if (ws.readyState === ws.CONNECTING) {
          ws.once("open", function open() {
            duplex._final(callback);
          });
          return;
        }
        if (ws._socket === null)
          return;
        if (ws._socket._writableState.finished) {
          callback();
          if (duplex._readableState.endEmitted)
            duplex.destroy();
        } else {
          ws._socket.once("finish", function finish() {
            callback();
          });
          ws.close();
        }
      };
      duplex._read = function() {
        if (ws.isPaused)
          ws.resume();
      };
      duplex._write = function(chunk, encoding, callback) {
        if (ws.readyState === ws.CONNECTING) {
          ws.once("open", function open() {
            duplex._write(chunk, encoding, callback);
          });
          return;
        }
        ws.send(chunk, callback);
      };
      duplex.on("end", duplexOnEnd);
      duplex.on("error", duplexOnError);
      return duplex;
    }
    module2.exports = createWebSocketStream;
  }
});

// node_modules/ws/lib/subprotocol.js
var require_subprotocol = __commonJS({
  "node_modules/ws/lib/subprotocol.js"(exports, module2) {
    "use strict";
    var { tokenChars } = require_validation();
    function parse(header) {
      const protocols = /* @__PURE__ */ new Set();
      let start = -1;
      let end = -1;
      let i = 0;
      for (i; i < header.length; i++) {
        const code = header.charCodeAt(i);
        if (end === -1 && tokenChars[code] === 1) {
          if (start === -1)
            start = i;
        } else if (i !== 0 && (code === 32 || code === 9)) {
          if (end === -1 && start !== -1)
            end = i;
        } else if (code === 44) {
          if (start === -1) {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
          if (end === -1)
            end = i;
          const protocol2 = header.slice(start, end);
          if (protocols.has(protocol2)) {
            throw new SyntaxError(`The "${protocol2}" subprotocol is duplicated`);
          }
          protocols.add(protocol2);
          start = end = -1;
        } else {
          throw new SyntaxError(`Unexpected character at index ${i}`);
        }
      }
      if (start === -1 || end !== -1) {
        throw new SyntaxError("Unexpected end of input");
      }
      const protocol = header.slice(start, i);
      if (protocols.has(protocol)) {
        throw new SyntaxError(`The "${protocol}" subprotocol is duplicated`);
      }
      protocols.add(protocol);
      return protocols;
    }
    module2.exports = { parse };
  }
});

// node_modules/ws/lib/websocket-server.js
var require_websocket_server = __commonJS({
  "node_modules/ws/lib/websocket-server.js"(exports, module2) {
    "use strict";
    var EventEmitter = require("events");
    var http = require("http");
    var https = require("https");
    var net = require("net");
    var tls = require("tls");
    var { createHash } = require("crypto");
    var extension = require_extension();
    var PerMessageDeflate = require_permessage_deflate();
    var subprotocol = require_subprotocol();
    var WebSocket2 = require_websocket();
    var { GUID, kWebSocket } = require_constants();
    var keyRegex = /^[+/0-9A-Za-z]{22}==$/;
    var RUNNING = 0;
    var CLOSING = 1;
    var CLOSED = 2;
    var WebSocketServer = class extends EventEmitter {
      /**
       * Create a `WebSocketServer` instance.
       *
       * @param {Object} options Configuration options
       * @param {Number} [options.backlog=511] The maximum length of the queue of
       *     pending connections
       * @param {Boolean} [options.clientTracking=true] Specifies whether or not to
       *     track clients
       * @param {Function} [options.handleProtocols] A hook to handle protocols
       * @param {String} [options.host] The hostname where to bind the server
       * @param {Number} [options.maxPayload=104857600] The maximum allowed message
       *     size
       * @param {Boolean} [options.noServer=false] Enable no server mode
       * @param {String} [options.path] Accept only connections matching this path
       * @param {(Boolean|Object)} [options.perMessageDeflate=false] Enable/disable
       *     permessage-deflate
       * @param {Number} [options.port] The port where to bind the server
       * @param {(http.Server|https.Server)} [options.server] A pre-created HTTP/S
       *     server to use
       * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
       *     not to skip UTF-8 validation for text and close messages
       * @param {Function} [options.verifyClient] A hook to reject connections
       * @param {Function} [options.WebSocket=WebSocket] Specifies the `WebSocket`
       *     class to use. It must be the `WebSocket` class or class that extends it
       * @param {Function} [callback] A listener for the `listening` event
       */
      constructor(options, callback) {
        super();
        options = {
          maxPayload: 100 * 1024 * 1024,
          skipUTF8Validation: false,
          perMessageDeflate: false,
          handleProtocols: null,
          clientTracking: true,
          verifyClient: null,
          noServer: false,
          backlog: null,
          // use default (511 as implemented in net.js)
          server: null,
          host: null,
          path: null,
          port: null,
          WebSocket: WebSocket2,
          ...options
        };
        if (options.port == null && !options.server && !options.noServer || options.port != null && (options.server || options.noServer) || options.server && options.noServer) {
          throw new TypeError(
            'One and only one of the "port", "server", or "noServer" options must be specified'
          );
        }
        if (options.port != null) {
          this._server = http.createServer((req, res) => {
            const body = http.STATUS_CODES[426];
            res.writeHead(426, {
              "Content-Length": body.length,
              "Content-Type": "text/plain"
            });
            res.end(body);
          });
          this._server.listen(
            options.port,
            options.host,
            options.backlog,
            callback
          );
        } else if (options.server) {
          this._server = options.server;
        }
        if (this._server) {
          const emitConnection = this.emit.bind(this, "connection");
          this._removeListeners = addListeners(this._server, {
            listening: this.emit.bind(this, "listening"),
            error: this.emit.bind(this, "error"),
            upgrade: (req, socket, head) => {
              this.handleUpgrade(req, socket, head, emitConnection);
            }
          });
        }
        if (options.perMessageDeflate === true)
          options.perMessageDeflate = {};
        if (options.clientTracking) {
          this.clients = /* @__PURE__ */ new Set();
          this._shouldEmitClose = false;
        }
        this.options = options;
        this._state = RUNNING;
      }
      /**
       * Returns the bound address, the address family name, and port of the server
       * as reported by the operating system if listening on an IP socket.
       * If the server is listening on a pipe or UNIX domain socket, the name is
       * returned as a string.
       *
       * @return {(Object|String|null)} The address of the server
       * @public
       */
      address() {
        if (this.options.noServer) {
          throw new Error('The server is operating in "noServer" mode');
        }
        if (!this._server)
          return null;
        return this._server.address();
      }
      /**
       * Stop the server from accepting new connections and emit the `'close'` event
       * when all existing connections are closed.
       *
       * @param {Function} [cb] A one-time listener for the `'close'` event
       * @public
       */
      close(cb) {
        if (this._state === CLOSED) {
          if (cb) {
            this.once("close", () => {
              cb(new Error("The server is not running"));
            });
          }
          process.nextTick(emitClose, this);
          return;
        }
        if (cb)
          this.once("close", cb);
        if (this._state === CLOSING)
          return;
        this._state = CLOSING;
        if (this.options.noServer || this.options.server) {
          if (this._server) {
            this._removeListeners();
            this._removeListeners = this._server = null;
          }
          if (this.clients) {
            if (!this.clients.size) {
              process.nextTick(emitClose, this);
            } else {
              this._shouldEmitClose = true;
            }
          } else {
            process.nextTick(emitClose, this);
          }
        } else {
          const server = this._server;
          this._removeListeners();
          this._removeListeners = this._server = null;
          server.close(() => {
            emitClose(this);
          });
        }
      }
      /**
       * See if a given request should be handled by this server instance.
       *
       * @param {http.IncomingMessage} req Request object to inspect
       * @return {Boolean} `true` if the request is valid, else `false`
       * @public
       */
      shouldHandle(req) {
        if (this.options.path) {
          const index = req.url.indexOf("?");
          const pathname = index !== -1 ? req.url.slice(0, index) : req.url;
          if (pathname !== this.options.path)
            return false;
        }
        return true;
      }
      /**
       * Handle a HTTP Upgrade request.
       *
       * @param {http.IncomingMessage} req The request object
       * @param {(net.Socket|tls.Socket)} socket The network socket between the
       *     server and client
       * @param {Buffer} head The first packet of the upgraded stream
       * @param {Function} cb Callback
       * @public
       */
      handleUpgrade(req, socket, head, cb) {
        socket.on("error", socketOnError);
        const key = req.headers["sec-websocket-key"];
        const version3 = +req.headers["sec-websocket-version"];
        if (req.method !== "GET") {
          const message = "Invalid HTTP method";
          abortHandshakeOrEmitwsClientError(this, req, socket, 405, message);
          return;
        }
        if (req.headers.upgrade.toLowerCase() !== "websocket") {
          const message = "Invalid Upgrade header";
          abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
          return;
        }
        if (!key || !keyRegex.test(key)) {
          const message = "Missing or invalid Sec-WebSocket-Key header";
          abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
          return;
        }
        if (version3 !== 8 && version3 !== 13) {
          const message = "Missing or invalid Sec-WebSocket-Version header";
          abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
          return;
        }
        if (!this.shouldHandle(req)) {
          abortHandshake(socket, 400);
          return;
        }
        const secWebSocketProtocol = req.headers["sec-websocket-protocol"];
        let protocols = /* @__PURE__ */ new Set();
        if (secWebSocketProtocol !== void 0) {
          try {
            protocols = subprotocol.parse(secWebSocketProtocol);
          } catch (err) {
            const message = "Invalid Sec-WebSocket-Protocol header";
            abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
            return;
          }
        }
        const secWebSocketExtensions = req.headers["sec-websocket-extensions"];
        const extensions = {};
        if (this.options.perMessageDeflate && secWebSocketExtensions !== void 0) {
          const perMessageDeflate = new PerMessageDeflate(
            this.options.perMessageDeflate,
            true,
            this.options.maxPayload
          );
          try {
            const offers = extension.parse(secWebSocketExtensions);
            if (offers[PerMessageDeflate.extensionName]) {
              perMessageDeflate.accept(offers[PerMessageDeflate.extensionName]);
              extensions[PerMessageDeflate.extensionName] = perMessageDeflate;
            }
          } catch (err) {
            const message = "Invalid or unacceptable Sec-WebSocket-Extensions header";
            abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
            return;
          }
        }
        if (this.options.verifyClient) {
          const info = {
            origin: req.headers[`${version3 === 8 ? "sec-websocket-origin" : "origin"}`],
            secure: !!(req.socket.authorized || req.socket.encrypted),
            req
          };
          if (this.options.verifyClient.length === 2) {
            this.options.verifyClient(info, (verified, code, message, headers) => {
              if (!verified) {
                return abortHandshake(socket, code || 401, message, headers);
              }
              this.completeUpgrade(
                extensions,
                key,
                protocols,
                req,
                socket,
                head,
                cb
              );
            });
            return;
          }
          if (!this.options.verifyClient(info))
            return abortHandshake(socket, 401);
        }
        this.completeUpgrade(extensions, key, protocols, req, socket, head, cb);
      }
      /**
       * Upgrade the connection to WebSocket.
       *
       * @param {Object} extensions The accepted extensions
       * @param {String} key The value of the `Sec-WebSocket-Key` header
       * @param {Set} protocols The subprotocols
       * @param {http.IncomingMessage} req The request object
       * @param {(net.Socket|tls.Socket)} socket The network socket between the
       *     server and client
       * @param {Buffer} head The first packet of the upgraded stream
       * @param {Function} cb Callback
       * @throws {Error} If called more than once with the same socket
       * @private
       */
      completeUpgrade(extensions, key, protocols, req, socket, head, cb) {
        if (!socket.readable || !socket.writable)
          return socket.destroy();
        if (socket[kWebSocket]) {
          throw new Error(
            "server.handleUpgrade() was called more than once with the same socket, possibly due to a misconfiguration"
          );
        }
        if (this._state > RUNNING)
          return abortHandshake(socket, 503);
        const digest = createHash("sha1").update(key + GUID).digest("base64");
        const headers = [
          "HTTP/1.1 101 Switching Protocols",
          "Upgrade: websocket",
          "Connection: Upgrade",
          `Sec-WebSocket-Accept: ${digest}`
        ];
        const ws = new this.options.WebSocket(null);
        if (protocols.size) {
          const protocol = this.options.handleProtocols ? this.options.handleProtocols(protocols, req) : protocols.values().next().value;
          if (protocol) {
            headers.push(`Sec-WebSocket-Protocol: ${protocol}`);
            ws._protocol = protocol;
          }
        }
        if (extensions[PerMessageDeflate.extensionName]) {
          const params = extensions[PerMessageDeflate.extensionName].params;
          const value = extension.format({
            [PerMessageDeflate.extensionName]: [params]
          });
          headers.push(`Sec-WebSocket-Extensions: ${value}`);
          ws._extensions = extensions;
        }
        this.emit("headers", headers, req);
        socket.write(headers.concat("\r\n").join("\r\n"));
        socket.removeListener("error", socketOnError);
        ws.setSocket(socket, head, {
          maxPayload: this.options.maxPayload,
          skipUTF8Validation: this.options.skipUTF8Validation
        });
        if (this.clients) {
          this.clients.add(ws);
          ws.on("close", () => {
            this.clients.delete(ws);
            if (this._shouldEmitClose && !this.clients.size) {
              process.nextTick(emitClose, this);
            }
          });
        }
        cb(ws, req);
      }
    };
    module2.exports = WebSocketServer;
    function addListeners(server, map) {
      for (const event of Object.keys(map))
        server.on(event, map[event]);
      return function removeListeners() {
        for (const event of Object.keys(map)) {
          server.removeListener(event, map[event]);
        }
      };
    }
    function emitClose(server) {
      server._state = CLOSED;
      server.emit("close");
    }
    function socketOnError() {
      this.destroy();
    }
    function abortHandshake(socket, code, message, headers) {
      message = message || http.STATUS_CODES[code];
      headers = {
        Connection: "close",
        "Content-Type": "text/html",
        "Content-Length": Buffer.byteLength(message),
        ...headers
      };
      socket.once("finish", socket.destroy);
      socket.end(
        `HTTP/1.1 ${code} ${http.STATUS_CODES[code]}\r
` + Object.keys(headers).map((h) => `${h}: ${headers[h]}`).join("\r\n") + "\r\n\r\n" + message
      );
    }
    function abortHandshakeOrEmitwsClientError(server, req, socket, code, message) {
      if (server.listenerCount("wsClientError")) {
        const err = new Error(message);
        Error.captureStackTrace(err, abortHandshakeOrEmitwsClientError);
        server.emit("wsClientError", err, socket, req);
      } else {
        abortHandshake(socket, code, message);
      }
    }
  }
});

// node_modules/ws/index.js
var require_ws = __commonJS({
  "node_modules/ws/index.js"(exports, module2) {
    "use strict";
    var WebSocket2 = require_websocket();
    WebSocket2.createWebSocketStream = require_stream();
    WebSocket2.Server = require_websocket_server();
    WebSocket2.Receiver = require_receiver();
    WebSocket2.Sender = require_sender();
    WebSocket2.WebSocket = WebSocket2;
    WebSocket2.WebSocketServer = WebSocket2.Server;
    module2.exports = WebSocket2;
  }
});

// node_modules/isows/_cjs/utils.js
var require_utils4 = __commonJS({
  "node_modules/isows/_cjs/utils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getNativeWebSocket = void 0;
    function getNativeWebSocket() {
      if (typeof WebSocket !== "undefined")
        return WebSocket;
      if (typeof global.WebSocket !== "undefined")
        return global.WebSocket;
      if (typeof window.WebSocket !== "undefined")
        return window.WebSocket;
      if (typeof self.WebSocket !== "undefined")
        return self.WebSocket;
      throw new Error("`WebSocket` is not supported in this environment");
    }
    exports.getNativeWebSocket = getNativeWebSocket;
  }
});

// node_modules/isows/_cjs/index.js
var require_cjs3 = __commonJS({
  "node_modules/isows/_cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WebSocket = void 0;
    var WebSocket_ = require_ws();
    var utils_js_1 = require_utils4();
    exports.WebSocket = (() => {
      try {
        return (0, utils_js_1.getNativeWebSocket)();
      } catch {
        if (WebSocket_.WebSocket)
          return WebSocket_.WebSocket;
        return WebSocket_;
      }
    })();
  }
});

// node_modules/viem/_cjs/utils/promise/withTimeout.js
var require_withTimeout = __commonJS({
  "node_modules/viem/_cjs/utils/promise/withTimeout.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.withTimeout = void 0;
    function withTimeout(fn, { errorInstance = new Error("timed out"), timeout, signal }) {
      return new Promise((resolve, reject) => {
        ;
        (async () => {
          let timeoutId;
          try {
            const controller = new AbortController();
            if (timeout > 0) {
              timeoutId = setTimeout(() => {
                if (signal) {
                  controller.abort();
                } else {
                  reject(errorInstance);
                }
              }, timeout);
            }
            resolve(await fn({ signal: controller?.signal }));
          } catch (err) {
            if (err.name === "AbortError")
              reject(errorInstance);
            reject(err);
          } finally {
            clearTimeout(timeoutId);
          }
        })();
      });
    }
    exports.withTimeout = withTimeout;
  }
});

// node_modules/viem/_cjs/utils/rpc.js
var require_rpc2 = __commonJS({
  "node_modules/viem/_cjs/utils/rpc.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.rpc = exports.getSocket = exports.socketsCache = void 0;
    var isows_1 = require_cjs3();
    var request_js_1 = require_request();
    var createBatchScheduler_js_1 = require_createBatchScheduler();
    var withTimeout_js_1 = require_withTimeout();
    var stringify_js_1 = require_stringify();
    var id = 0;
    async function http(url, { body, fetchOptions = {}, timeout = 1e4 }) {
      const { headers, method, signal: signal_ } = fetchOptions;
      try {
        const response = await (0, withTimeout_js_1.withTimeout)(async ({ signal }) => {
          const response2 = await fetch(url, {
            ...fetchOptions,
            body: Array.isArray(body) ? (0, stringify_js_1.stringify)(body.map((body2) => ({
              jsonrpc: "2.0",
              id: body2.id ?? id++,
              ...body2
            }))) : (0, stringify_js_1.stringify)({ jsonrpc: "2.0", id: body.id ?? id++, ...body }),
            headers: {
              ...headers,
              "Content-Type": "application/json"
            },
            method: method || "POST",
            signal: signal_ || (timeout > 0 ? signal : void 0)
          });
          return response2;
        }, {
          errorInstance: new request_js_1.TimeoutError({ body, url }),
          timeout,
          signal: true
        });
        let data;
        if (response.headers.get("Content-Type")?.startsWith("application/json")) {
          data = await response.json();
        } else {
          data = await response.text();
        }
        if (!response.ok) {
          throw new request_js_1.HttpRequestError({
            body,
            details: (0, stringify_js_1.stringify)(data.error) || response.statusText,
            headers: response.headers,
            status: response.status,
            url
          });
        }
        return data;
      } catch (err) {
        if (err instanceof request_js_1.HttpRequestError)
          throw err;
        if (err instanceof request_js_1.TimeoutError)
          throw err;
        throw new request_js_1.HttpRequestError({
          body,
          details: err.message,
          url
        });
      }
    }
    exports.socketsCache = /* @__PURE__ */ new Map();
    async function getSocket(url) {
      let socket = exports.socketsCache.get(url);
      if (socket)
        return socket;
      const { schedule } = (0, createBatchScheduler_js_1.createBatchScheduler)({
        id: url,
        fn: async () => {
          const webSocket2 = new isows_1.WebSocket(url);
          const requests = /* @__PURE__ */ new Map();
          const subscriptions = /* @__PURE__ */ new Map();
          const onMessage = ({ data }) => {
            const message = JSON.parse(data);
            const isSubscription = message.method === "eth_subscription";
            const id2 = isSubscription ? message.params.subscription : message.id;
            const cache = isSubscription ? subscriptions : requests;
            const callback = cache.get(id2);
            if (callback)
              callback({ data });
            if (!isSubscription)
              cache.delete(id2);
          };
          const onClose = () => {
            exports.socketsCache.delete(url);
            webSocket2.removeEventListener("close", onClose);
            webSocket2.removeEventListener("message", onMessage);
          };
          webSocket2.addEventListener("close", onClose);
          webSocket2.addEventListener("message", onMessage);
          if (webSocket2.readyState === isows_1.WebSocket.CONNECTING) {
            await new Promise((resolve, reject) => {
              if (!webSocket2)
                return;
              webSocket2.onopen = resolve;
              webSocket2.onerror = reject;
            });
          }
          socket = Object.assign(webSocket2, {
            requests,
            subscriptions
          });
          exports.socketsCache.set(url, socket);
          return [socket];
        }
      });
      const [_, [socket_]] = await schedule();
      return socket_;
    }
    exports.getSocket = getSocket;
    function webSocket(socket, { body, onResponse }) {
      if (socket.readyState === socket.CLOSED || socket.readyState === socket.CLOSING)
        throw new request_js_1.WebSocketRequestError({
          body,
          url: socket.url,
          details: "Socket is closed."
        });
      const id_ = id++;
      const callback = ({ data }) => {
        const message = JSON.parse(data);
        if (typeof message.id === "number" && id_ !== message.id)
          return;
        onResponse?.(message);
        if (body.method === "eth_subscribe" && typeof message.result === "string") {
          socket.subscriptions.set(message.result, callback);
        }
        if (body.method === "eth_unsubscribe") {
          socket.subscriptions.delete(body.params?.[0]);
        }
      };
      socket.requests.set(id_, callback);
      socket.send(JSON.stringify({ jsonrpc: "2.0", ...body, id: id_ }));
      return socket;
    }
    async function webSocketAsync(socket, { body, timeout = 1e4 }) {
      return (0, withTimeout_js_1.withTimeout)(() => new Promise((onResponse) => exports.rpc.webSocket(socket, {
        body,
        onResponse
      })), {
        errorInstance: new request_js_1.TimeoutError({ body, url: socket.url }),
        timeout
      });
    }
    exports.rpc = {
      http,
      webSocket,
      webSocketAsync
    };
  }
});

// node_modules/viem/_cjs/clients/transports/http.js
var require_http = __commonJS({
  "node_modules/viem/_cjs/clients/transports/http.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.http = void 0;
    var request_js_1 = require_request();
    var transport_js_1 = require_transport();
    var createBatchScheduler_js_1 = require_createBatchScheduler();
    var rpc_js_1 = require_rpc2();
    var createTransport_js_1 = require_createTransport();
    function http(url, config = {}) {
      const { batch, fetchOptions, key = "http", name = "HTTP JSON-RPC", retryDelay } = config;
      return ({ chain, retryCount: retryCount_, timeout: timeout_ }) => {
        const { batchSize = 1e3, wait = 0 } = typeof batch === "object" ? batch : {};
        const retryCount = config.retryCount ?? retryCount_;
        const timeout = timeout_ ?? config.timeout ?? 1e4;
        const url_ = url || chain?.rpcUrls.default.http[0];
        if (!url_)
          throw new transport_js_1.UrlRequiredError();
        return (0, createTransport_js_1.createTransport)({
          key,
          name,
          async request({ method, params }) {
            const body = { method, params };
            const { schedule } = (0, createBatchScheduler_js_1.createBatchScheduler)({
              id: `${url}`,
              wait,
              shouldSplitBatch(requests) {
                return requests.length > batchSize;
              },
              fn: (body2) => rpc_js_1.rpc.http(url_, {
                body: body2,
                fetchOptions,
                timeout
              })
            });
            const fn = async (body2) => batch ? schedule(body2) : [await rpc_js_1.rpc.http(url_, { body: body2, fetchOptions, timeout })];
            const [{ error, result }] = await fn(body);
            if (error)
              throw new request_js_1.RpcRequestError({
                body,
                error,
                url: url_
              });
            return result;
          },
          retryCount,
          retryDelay,
          timeout,
          type: "http"
        }, {
          fetchOptions,
          url
        });
      };
    }
    exports.http = http;
  }
});

// node_modules/viem/_cjs/utils/ens/errors.js
var require_errors2 = __commonJS({
  "node_modules/viem/_cjs/utils/ens/errors.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isNullUniversalResolverError = void 0;
    var solidity_js_1 = require_solidity();
    var base_js_1 = require_base();
    var contract_js_1 = require_contract();
    function isNullUniversalResolverError(err, callType) {
      if (!(err instanceof base_js_1.BaseError))
        return false;
      const cause = err.walk((e) => e instanceof contract_js_1.ContractFunctionRevertedError);
      if (!(cause instanceof contract_js_1.ContractFunctionRevertedError))
        return false;
      if (cause.data?.errorName === "ResolverNotFound")
        return true;
      if (cause.data?.errorName === "ResolverWildcardNotSupported")
        return true;
      if (cause.reason?.includes("Wildcard on non-extended resolvers is not supported"))
        return true;
      if (callType === "reverse" && cause.reason === solidity_js_1.panicReasons[50])
        return true;
      return false;
    }
    exports.isNullUniversalResolverError = isNullUniversalResolverError;
  }
});

// node_modules/viem/_cjs/utils/ens/encodedLabelToLabelhash.js
var require_encodedLabelToLabelhash = __commonJS({
  "node_modules/viem/_cjs/utils/ens/encodedLabelToLabelhash.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.encodedLabelToLabelhash = void 0;
    var isHex_js_1 = require_isHex();
    function encodedLabelToLabelhash(label) {
      if (label.length !== 66)
        return null;
      if (label.indexOf("[") !== 0)
        return null;
      if (label.indexOf("]") !== 65)
        return null;
      const hash2 = `0x${label.slice(1, 65)}`;
      if (!(0, isHex_js_1.isHex)(hash2))
        return null;
      return hash2;
    }
    exports.encodedLabelToLabelhash = encodedLabelToLabelhash;
  }
});

// node_modules/viem/_cjs/utils/ens/namehash.js
var require_namehash = __commonJS({
  "node_modules/viem/_cjs/utils/ens/namehash.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.namehash = void 0;
    var concat_js_1 = require_concat();
    var toBytes_js_1 = require_toBytes();
    var toHex_js_1 = require_toHex();
    var keccak256_js_1 = require_keccak256();
    var encodedLabelToLabelhash_js_1 = require_encodedLabelToLabelhash();
    function namehash(name) {
      let result = new Uint8Array(32).fill(0);
      if (!name)
        return (0, toHex_js_1.bytesToHex)(result);
      const labels = name.split(".");
      for (let i = labels.length - 1; i >= 0; i -= 1) {
        const hashFromEncodedLabel = (0, encodedLabelToLabelhash_js_1.encodedLabelToLabelhash)(labels[i]);
        const hashed = hashFromEncodedLabel ? (0, toBytes_js_1.toBytes)(hashFromEncodedLabel) : (0, keccak256_js_1.keccak256)((0, toBytes_js_1.stringToBytes)(labels[i]), "bytes");
        result = (0, keccak256_js_1.keccak256)((0, concat_js_1.concat)([result, hashed]), "bytes");
      }
      return (0, toHex_js_1.bytesToHex)(result);
    }
    exports.namehash = namehash;
  }
});

// node_modules/viem/_cjs/utils/ens/encodeLabelhash.js
var require_encodeLabelhash = __commonJS({
  "node_modules/viem/_cjs/utils/ens/encodeLabelhash.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.encodeLabelhash = void 0;
    function encodeLabelhash(hash2) {
      return `[${hash2.slice(2)}]`;
    }
    exports.encodeLabelhash = encodeLabelhash;
  }
});

// node_modules/viem/_cjs/utils/ens/labelhash.js
var require_labelhash = __commonJS({
  "node_modules/viem/_cjs/utils/ens/labelhash.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.labelhash = void 0;
    var toBytes_js_1 = require_toBytes();
    var toHex_js_1 = require_toHex();
    var keccak256_js_1 = require_keccak256();
    var encodedLabelToLabelhash_js_1 = require_encodedLabelToLabelhash();
    function labelhash(label) {
      const result = new Uint8Array(32).fill(0);
      if (!label)
        return (0, toHex_js_1.bytesToHex)(result);
      return (0, encodedLabelToLabelhash_js_1.encodedLabelToLabelhash)(label) || (0, keccak256_js_1.keccak256)((0, toBytes_js_1.stringToBytes)(label));
    }
    exports.labelhash = labelhash;
  }
});

// node_modules/viem/_cjs/utils/ens/packetToBytes.js
var require_packetToBytes = __commonJS({
  "node_modules/viem/_cjs/utils/ens/packetToBytes.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.packetToBytes = void 0;
    var toBytes_js_1 = require_toBytes();
    var encodeLabelhash_js_1 = require_encodeLabelhash();
    var labelhash_js_1 = require_labelhash();
    function packetToBytes(packet) {
      const value = packet.replace(/^\.|\.$/gm, "");
      if (value.length === 0)
        return new Uint8Array(1);
      const bytes2 = new Uint8Array((0, toBytes_js_1.stringToBytes)(value).byteLength + 2);
      let offset = 0;
      const list = value.split(".");
      for (let i = 0; i < list.length; i++) {
        let encoded = (0, toBytes_js_1.stringToBytes)(list[i]);
        if (encoded.byteLength > 255)
          encoded = (0, toBytes_js_1.stringToBytes)((0, encodeLabelhash_js_1.encodeLabelhash)((0, labelhash_js_1.labelhash)(list[i])));
        bytes2[offset] = encoded.length;
        bytes2.set(encoded, offset + 1);
        offset += encoded.length + 1;
      }
      if (bytes2.byteLength !== offset + 1)
        return bytes2.slice(0, offset + 1);
      return bytes2;
    }
    exports.packetToBytes = packetToBytes;
  }
});

// node_modules/viem/_cjs/actions/ens/getEnsAddress.js
var require_getEnsAddress = __commonJS({
  "node_modules/viem/_cjs/actions/ens/getEnsAddress.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getEnsAddress = void 0;
    var abis_js_1 = require_abis();
    var decodeFunctionResult_js_1 = require_decodeFunctionResult();
    var encodeFunctionData_js_1 = require_encodeFunctionData();
    var chain_js_1 = require_chain2();
    var trim_js_1 = require_trim();
    var toHex_js_1 = require_toHex();
    var errors_js_1 = require_errors2();
    var namehash_js_1 = require_namehash();
    var packetToBytes_js_1 = require_packetToBytes();
    var readContract_js_1 = require_readContract();
    async function getEnsAddress(client, { blockNumber, blockTag, coinType, name, universalResolverAddress: universalResolverAddress_ }) {
      let universalResolverAddress = universalResolverAddress_;
      if (!universalResolverAddress) {
        if (!client.chain)
          throw new Error("client chain not configured. universalResolverAddress is required.");
        universalResolverAddress = (0, chain_js_1.getChainContractAddress)({
          blockNumber,
          chain: client.chain,
          contract: "ensUniversalResolver"
        });
      }
      try {
        const functionData = (0, encodeFunctionData_js_1.encodeFunctionData)({
          abi: abis_js_1.addressResolverAbi,
          functionName: "addr",
          ...coinType != null ? { args: [(0, namehash_js_1.namehash)(name), BigInt(coinType)] } : { args: [(0, namehash_js_1.namehash)(name)] }
        });
        const res = await (0, readContract_js_1.readContract)(client, {
          address: universalResolverAddress,
          abi: abis_js_1.universalResolverResolveAbi,
          functionName: "resolve",
          args: [(0, toHex_js_1.toHex)((0, packetToBytes_js_1.packetToBytes)(name)), functionData],
          blockNumber,
          blockTag
        });
        if (res[0] === "0x")
          return null;
        const address = (0, decodeFunctionResult_js_1.decodeFunctionResult)({
          abi: abis_js_1.addressResolverAbi,
          args: coinType != null ? [(0, namehash_js_1.namehash)(name), BigInt(coinType)] : void 0,
          functionName: "addr",
          data: res[0]
        });
        if (address === "0x")
          return null;
        if ((0, trim_js_1.trim)(address) === "0x00")
          return null;
        return address;
      } catch (err) {
        if ((0, errors_js_1.isNullUniversalResolverError)(err, "resolve"))
          return null;
        throw err;
      }
    }
    exports.getEnsAddress = getEnsAddress;
  }
});

// node_modules/viem/_cjs/errors/ens.js
var require_ens = __commonJS({
  "node_modules/viem/_cjs/errors/ens.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EnsAvatarUnsupportedNamespaceError = exports.EnsAvatarUriResolutionError = exports.EnsAvatarInvalidNftUriError = exports.EnsAvatarInvalidMetadataError = void 0;
    var base_js_1 = require_base();
    var EnsAvatarInvalidMetadataError = class extends base_js_1.BaseError {
      constructor({ data }) {
        super("Unable to extract image from metadata. The metadata may be malformed or invalid.", {
          metaMessages: [
            "- Metadata must be a JSON object with at least an `image`, `image_url` or `image_data` property.",
            "",
            `Provided data: ${JSON.stringify(data)}`
          ]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "EnsAvatarInvalidMetadataError"
        });
      }
    };
    exports.EnsAvatarInvalidMetadataError = EnsAvatarInvalidMetadataError;
    var EnsAvatarInvalidNftUriError = class extends base_js_1.BaseError {
      constructor({ reason }) {
        super(`ENS NFT avatar URI is invalid. ${reason}`);
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "EnsAvatarInvalidNftUriError"
        });
      }
    };
    exports.EnsAvatarInvalidNftUriError = EnsAvatarInvalidNftUriError;
    var EnsAvatarUriResolutionError = class extends base_js_1.BaseError {
      constructor({ uri }) {
        super(`Unable to resolve ENS avatar URI "${uri}". The URI may be malformed, invalid, or does not respond with a valid image.`);
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "EnsAvatarUriResolutionError"
        });
      }
    };
    exports.EnsAvatarUriResolutionError = EnsAvatarUriResolutionError;
    var EnsAvatarUnsupportedNamespaceError = class extends base_js_1.BaseError {
      constructor({ namespace }) {
        super(`ENS NFT avatar namespace "${namespace}" is not supported. Must be "erc721" or "erc1155".`);
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "EnsAvatarUnsupportedNamespaceError"
        });
      }
    };
    exports.EnsAvatarUnsupportedNamespaceError = EnsAvatarUnsupportedNamespaceError;
  }
});

// node_modules/viem/_cjs/utils/ens/avatar/utils.js
var require_utils5 = __commonJS({
  "node_modules/viem/_cjs/utils/ens/avatar/utils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getNftTokenUri = exports.parseNftUri = exports.parseAvatarUri = exports.getMetadataAvatarUri = exports.getJsonImage = exports.resolveAvatarUri = exports.getGateway = exports.isImageUri = void 0;
    var readContract_js_1 = require_readContract();
    var ens_js_1 = require_ens();
    var networkRegex = /(?<protocol>https?:\/\/[^\/]*|ipfs:\/|ipns:\/|ar:\/)?(?<root>\/)?(?<subpath>ipfs\/|ipns\/)?(?<target>[\w\-.]+)(?<subtarget>\/.*)?/;
    var ipfsHashRegex = /^(Qm[1-9A-HJ-NP-Za-km-z]{44,}|b[A-Za-z2-7]{58,}|B[A-Z2-7]{58,}|z[1-9A-HJ-NP-Za-km-z]{48,}|F[0-9A-F]{50,})(\/(?<target>[\w\-.]+))?(?<subtarget>\/.*)?$/;
    var base64Regex = /^data:([a-zA-Z\-/+]*);base64,([^"].*)/;
    var dataURIRegex = /^data:([a-zA-Z\-/+]*)?(;[a-zA-Z0-9].*?)?(,)/;
    async function isImageUri(uri) {
      try {
        const res = await fetch(uri, { method: "HEAD" });
        if (res.status === 200) {
          const contentType = res.headers.get("content-type");
          return contentType?.startsWith("image/");
        }
        return false;
      } catch (error) {
        if (typeof error === "object" && typeof error.response !== "undefined") {
          return false;
        }
        if (!globalThis.hasOwnProperty("Image"))
          return false;
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            resolve(true);
          };
          img.onerror = () => {
            resolve(false);
          };
          img.src = uri;
        });
      }
    }
    exports.isImageUri = isImageUri;
    function getGateway(custom, defaultGateway) {
      if (!custom)
        return defaultGateway;
      if (custom.endsWith("/"))
        return custom.slice(0, -1);
      return custom;
    }
    exports.getGateway = getGateway;
    function resolveAvatarUri({ uri, gatewayUrls }) {
      const isEncoded = base64Regex.test(uri);
      if (isEncoded)
        return { uri, isOnChain: true, isEncoded };
      const ipfsGateway = getGateway(gatewayUrls?.ipfs, "https://ipfs.io");
      const arweaveGateway = getGateway(gatewayUrls?.arweave, "https://arweave.net");
      const networkRegexMatch = uri.match(networkRegex);
      const { protocol, subpath, target, subtarget = "" } = networkRegexMatch?.groups || {};
      const isIPNS = protocol === "ipns:/" || subpath === "ipns/";
      const isIPFS = protocol === "ipfs:/" || subpath === "ipfs/" || ipfsHashRegex.test(uri);
      if (uri.startsWith("http") && !isIPNS && !isIPFS) {
        let replacedUri = uri;
        if (gatewayUrls?.arweave)
          replacedUri = uri.replace(/https:\/\/arweave.net/g, gatewayUrls?.arweave);
        return { uri: replacedUri, isOnChain: false, isEncoded: false };
      }
      if ((isIPNS || isIPFS) && target) {
        return {
          uri: `${ipfsGateway}/${isIPNS ? "ipns" : "ipfs"}/${target}${subtarget}`,
          isOnChain: false,
          isEncoded: false
        };
      } else if (protocol === "ar:/" && target) {
        return {
          uri: `${arweaveGateway}/${target}${subtarget || ""}`,
          isOnChain: false,
          isEncoded: false
        };
      }
      let parsedUri = uri.replace(dataURIRegex, "");
      if (parsedUri.startsWith("<svg")) {
        parsedUri = `data:image/svg+xml;base64,${btoa(parsedUri)}`;
      }
      if (parsedUri.startsWith("data:") || parsedUri.startsWith("{")) {
        return {
          uri: parsedUri,
          isOnChain: true,
          isEncoded: false
        };
      }
      throw new ens_js_1.EnsAvatarUriResolutionError({ uri });
    }
    exports.resolveAvatarUri = resolveAvatarUri;
    function getJsonImage(data) {
      if (typeof data !== "object" || !("image" in data) && !("image_url" in data) && !("image_data" in data)) {
        throw new ens_js_1.EnsAvatarInvalidMetadataError({ data });
      }
      return data.image || data.image_url || data.image_data;
    }
    exports.getJsonImage = getJsonImage;
    async function getMetadataAvatarUri({ gatewayUrls, uri }) {
      try {
        const res = await fetch(uri).then((res2) => res2.json());
        const image = await parseAvatarUri({
          gatewayUrls,
          uri: getJsonImage(res)
        });
        return image;
      } catch {
        throw new ens_js_1.EnsAvatarUriResolutionError({ uri });
      }
    }
    exports.getMetadataAvatarUri = getMetadataAvatarUri;
    async function parseAvatarUri({ gatewayUrls, uri }) {
      const { uri: resolvedURI, isOnChain } = resolveAvatarUri({ uri, gatewayUrls });
      if (isOnChain)
        return resolvedURI;
      const isImage = await isImageUri(resolvedURI);
      if (isImage)
        return resolvedURI;
      throw new ens_js_1.EnsAvatarUriResolutionError({ uri });
    }
    exports.parseAvatarUri = parseAvatarUri;
    function parseNftUri(uri_) {
      let uri = uri_;
      if (uri.startsWith("did:nft:")) {
        uri = uri.replace("did:nft:", "").replace(/_/g, "/");
      }
      const [reference, asset_namespace, tokenID] = uri.split("/");
      const [eip_namespace, chainID] = reference.split(":");
      const [erc_namespace, contractAddress] = asset_namespace.split(":");
      if (!eip_namespace || eip_namespace.toLowerCase() !== "eip155")
        throw new ens_js_1.EnsAvatarInvalidNftUriError({ reason: "Only EIP-155 supported" });
      if (!chainID)
        throw new ens_js_1.EnsAvatarInvalidNftUriError({ reason: "Chain ID not found" });
      if (!contractAddress)
        throw new ens_js_1.EnsAvatarInvalidNftUriError({
          reason: "Contract address not found"
        });
      if (!tokenID)
        throw new ens_js_1.EnsAvatarInvalidNftUriError({ reason: "Token ID not found" });
      if (!erc_namespace)
        throw new ens_js_1.EnsAvatarInvalidNftUriError({ reason: "ERC namespace not found" });
      return {
        chainID: parseInt(chainID),
        namespace: erc_namespace.toLowerCase(),
        contractAddress,
        tokenID
      };
    }
    exports.parseNftUri = parseNftUri;
    async function getNftTokenUri(client, { nft }) {
      if (nft.namespace === "erc721") {
        return (0, readContract_js_1.readContract)(client, {
          address: nft.contractAddress,
          abi: [
            {
              name: "tokenURI",
              type: "function",
              stateMutability: "view",
              inputs: [{ name: "tokenId", type: "uint256" }],
              outputs: [{ name: "", type: "string" }]
            }
          ],
          functionName: "tokenURI",
          args: [BigInt(nft.tokenID)]
        });
      }
      if (nft.namespace === "erc1155") {
        return (0, readContract_js_1.readContract)(client, {
          address: nft.contractAddress,
          abi: [
            {
              name: "uri",
              type: "function",
              stateMutability: "view",
              inputs: [{ name: "_id", type: "uint256" }],
              outputs: [{ name: "", type: "string" }]
            }
          ],
          functionName: "uri",
          args: [BigInt(nft.tokenID)]
        });
      }
      throw new ens_js_1.EnsAvatarUnsupportedNamespaceError({ namespace: nft.namespace });
    }
    exports.getNftTokenUri = getNftTokenUri;
  }
});

// node_modules/viem/_cjs/utils/ens/avatar/parseAvatarRecord.js
var require_parseAvatarRecord = __commonJS({
  "node_modules/viem/_cjs/utils/ens/avatar/parseAvatarRecord.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseAvatarRecord = void 0;
    var utils_js_1 = require_utils5();
    async function parseAvatarRecord(client, { gatewayUrls, record }) {
      if (/eip155:/i.test(record))
        return parseNftAvatarUri(client, { gatewayUrls, record });
      return (0, utils_js_1.parseAvatarUri)({ uri: record, gatewayUrls });
    }
    exports.parseAvatarRecord = parseAvatarRecord;
    async function parseNftAvatarUri(client, { gatewayUrls, record }) {
      const nft = (0, utils_js_1.parseNftUri)(record);
      const nftUri = await (0, utils_js_1.getNftTokenUri)(client, { nft });
      const { uri: resolvedNftUri, isOnChain, isEncoded } = (0, utils_js_1.resolveAvatarUri)({ uri: nftUri, gatewayUrls });
      if (isOnChain && (resolvedNftUri.includes("data:application/json;base64,") || resolvedNftUri.startsWith("{"))) {
        const encodedJson = isEncoded ? atob(resolvedNftUri.replace("data:application/json;base64,", "")) : resolvedNftUri;
        const decoded = JSON.parse(encodedJson);
        return (0, utils_js_1.parseAvatarUri)({ uri: (0, utils_js_1.getJsonImage)(decoded), gatewayUrls });
      }
      let uriTokenId = nft.tokenID;
      if (nft.namespace === "erc1155")
        uriTokenId = uriTokenId.replace("0x", "").padStart(64, "0");
      return (0, utils_js_1.getMetadataAvatarUri)({
        gatewayUrls,
        uri: resolvedNftUri.replace(/(?:0x)?{id}/, uriTokenId)
      });
    }
  }
});

// node_modules/viem/_cjs/actions/ens/getEnsText.js
var require_getEnsText = __commonJS({
  "node_modules/viem/_cjs/actions/ens/getEnsText.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getEnsText = void 0;
    var abis_js_1 = require_abis();
    var decodeFunctionResult_js_1 = require_decodeFunctionResult();
    var encodeFunctionData_js_1 = require_encodeFunctionData();
    var chain_js_1 = require_chain2();
    var toHex_js_1 = require_toHex();
    var errors_js_1 = require_errors2();
    var namehash_js_1 = require_namehash();
    var packetToBytes_js_1 = require_packetToBytes();
    var readContract_js_1 = require_readContract();
    async function getEnsText(client, { blockNumber, blockTag, name, key, universalResolverAddress: universalResolverAddress_ }) {
      let universalResolverAddress = universalResolverAddress_;
      if (!universalResolverAddress) {
        if (!client.chain)
          throw new Error("client chain not configured. universalResolverAddress is required.");
        universalResolverAddress = (0, chain_js_1.getChainContractAddress)({
          blockNumber,
          chain: client.chain,
          contract: "ensUniversalResolver"
        });
      }
      try {
        const res = await (0, readContract_js_1.readContract)(client, {
          address: universalResolverAddress,
          abi: abis_js_1.universalResolverResolveAbi,
          functionName: "resolve",
          args: [
            (0, toHex_js_1.toHex)((0, packetToBytes_js_1.packetToBytes)(name)),
            (0, encodeFunctionData_js_1.encodeFunctionData)({
              abi: abis_js_1.textResolverAbi,
              functionName: "text",
              args: [(0, namehash_js_1.namehash)(name), key]
            })
          ],
          blockNumber,
          blockTag
        });
        if (res[0] === "0x")
          return null;
        const record = (0, decodeFunctionResult_js_1.decodeFunctionResult)({
          abi: abis_js_1.textResolverAbi,
          functionName: "text",
          data: res[0]
        });
        return record === "" ? null : record;
      } catch (err) {
        if ((0, errors_js_1.isNullUniversalResolverError)(err, "resolve"))
          return null;
        throw err;
      }
    }
    exports.getEnsText = getEnsText;
  }
});

// node_modules/viem/_cjs/actions/ens/getEnsAvatar.js
var require_getEnsAvatar = __commonJS({
  "node_modules/viem/_cjs/actions/ens/getEnsAvatar.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getEnsAvatar = void 0;
    var parseAvatarRecord_js_1 = require_parseAvatarRecord();
    var getEnsText_js_1 = require_getEnsText();
    async function getEnsAvatar(client, { blockNumber, blockTag, gatewayUrls, name, universalResolverAddress }) {
      const record = await (0, getEnsText_js_1.getEnsText)(client, {
        blockNumber,
        blockTag,
        key: "avatar",
        name,
        universalResolverAddress
      });
      if (!record)
        return null;
      try {
        return await (0, parseAvatarRecord_js_1.parseAvatarRecord)(client, { record, gatewayUrls });
      } catch {
        return null;
      }
    }
    exports.getEnsAvatar = getEnsAvatar;
  }
});

// node_modules/viem/_cjs/actions/ens/getEnsName.js
var require_getEnsName = __commonJS({
  "node_modules/viem/_cjs/actions/ens/getEnsName.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getEnsName = void 0;
    var abis_js_1 = require_abis();
    var chain_js_1 = require_chain2();
    var toHex_js_1 = require_toHex();
    var errors_js_1 = require_errors2();
    var packetToBytes_js_1 = require_packetToBytes();
    var readContract_js_1 = require_readContract();
    async function getEnsName(client, { address, blockNumber, blockTag, universalResolverAddress: universalResolverAddress_ }) {
      let universalResolverAddress = universalResolverAddress_;
      if (!universalResolverAddress) {
        if (!client.chain)
          throw new Error("client chain not configured. universalResolverAddress is required.");
        universalResolverAddress = (0, chain_js_1.getChainContractAddress)({
          blockNumber,
          chain: client.chain,
          contract: "ensUniversalResolver"
        });
      }
      const reverseNode = `${address.toLowerCase().substring(2)}.addr.reverse`;
      try {
        const res = await (0, readContract_js_1.readContract)(client, {
          address: universalResolverAddress,
          abi: abis_js_1.universalResolverReverseAbi,
          functionName: "reverse",
          args: [(0, toHex_js_1.toHex)((0, packetToBytes_js_1.packetToBytes)(reverseNode))],
          blockNumber,
          blockTag
        });
        return res[0];
      } catch (err) {
        if ((0, errors_js_1.isNullUniversalResolverError)(err, "reverse"))
          return null;
        throw err;
      }
    }
    exports.getEnsName = getEnsName;
  }
});

// node_modules/viem/_cjs/actions/ens/getEnsResolver.js
var require_getEnsResolver = __commonJS({
  "node_modules/viem/_cjs/actions/ens/getEnsResolver.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getEnsResolver = void 0;
    var chain_js_1 = require_chain2();
    var toHex_js_1 = require_toHex();
    var packetToBytes_js_1 = require_packetToBytes();
    var readContract_js_1 = require_readContract();
    async function getEnsResolver(client, { blockNumber, blockTag, name, universalResolverAddress: universalResolverAddress_ }) {
      let universalResolverAddress = universalResolverAddress_;
      if (!universalResolverAddress) {
        if (!client.chain)
          throw new Error("client chain not configured. universalResolverAddress is required.");
        universalResolverAddress = (0, chain_js_1.getChainContractAddress)({
          blockNumber,
          chain: client.chain,
          contract: "ensUniversalResolver"
        });
      }
      const [resolverAddress] = await (0, readContract_js_1.readContract)(client, {
        address: universalResolverAddress,
        abi: [
          {
            inputs: [{ type: "bytes" }],
            name: "findResolver",
            outputs: [{ type: "address" }, { type: "bytes32" }],
            stateMutability: "view",
            type: "function"
          }
        ],
        functionName: "findResolver",
        args: [(0, toHex_js_1.toHex)((0, packetToBytes_js_1.packetToBytes)(name))],
        blockNumber,
        blockTag
      });
      return resolverAddress;
    }
    exports.getEnsResolver = getEnsResolver;
  }
});

// node_modules/viem/_cjs/actions/public/createBlockFilter.js
var require_createBlockFilter = __commonJS({
  "node_modules/viem/_cjs/actions/public/createBlockFilter.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createBlockFilter = void 0;
    var createFilterRequestScope_js_1 = require_createFilterRequestScope();
    async function createBlockFilter(client) {
      const getRequest = (0, createFilterRequestScope_js_1.createFilterRequestScope)(client, {
        method: "eth_newBlockFilter"
      });
      const id = await client.request({
        method: "eth_newBlockFilter"
      });
      return { id, request: getRequest(id), type: "block" };
    }
    exports.createBlockFilter = createBlockFilter;
  }
});

// node_modules/viem/_cjs/actions/public/createEventFilter.js
var require_createEventFilter = __commonJS({
  "node_modules/viem/_cjs/actions/public/createEventFilter.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createEventFilter = void 0;
    var encodeEventTopics_js_1 = require_encodeEventTopics();
    var toHex_js_1 = require_toHex();
    var createFilterRequestScope_js_1 = require_createFilterRequestScope();
    async function createEventFilter(client, { address, args, event, events: events_, fromBlock, strict, toBlock } = {}) {
      const events = events_ ?? (event ? [event] : void 0);
      const getRequest = (0, createFilterRequestScope_js_1.createFilterRequestScope)(client, {
        method: "eth_newFilter"
      });
      let topics = [];
      if (events) {
        topics = [
          events.flatMap((event2) => (0, encodeEventTopics_js_1.encodeEventTopics)({
            abi: [event2],
            eventName: event2.name,
            args
          }))
        ];
        if (event)
          topics = topics[0];
      }
      const id = await client.request({
        method: "eth_newFilter",
        params: [
          {
            address,
            fromBlock: typeof fromBlock === "bigint" ? (0, toHex_js_1.numberToHex)(fromBlock) : fromBlock,
            toBlock: typeof toBlock === "bigint" ? (0, toHex_js_1.numberToHex)(toBlock) : toBlock,
            ...topics.length ? { topics } : {}
          }
        ]
      });
      return {
        abi: events,
        args,
        eventName: event ? event.name : void 0,
        fromBlock,
        id,
        request: getRequest(id),
        strict,
        toBlock,
        type: "event"
      };
    }
    exports.createEventFilter = createEventFilter;
  }
});

// node_modules/viem/_cjs/actions/public/createPendingTransactionFilter.js
var require_createPendingTransactionFilter = __commonJS({
  "node_modules/viem/_cjs/actions/public/createPendingTransactionFilter.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createPendingTransactionFilter = void 0;
    var createFilterRequestScope_js_1 = require_createFilterRequestScope();
    async function createPendingTransactionFilter(client) {
      const getRequest = (0, createFilterRequestScope_js_1.createFilterRequestScope)(client, {
        method: "eth_newPendingTransactionFilter"
      });
      const id = await client.request({
        method: "eth_newPendingTransactionFilter"
      });
      return { id, request: getRequest(id), type: "transaction" };
    }
    exports.createPendingTransactionFilter = createPendingTransactionFilter;
  }
});

// node_modules/viem/_cjs/actions/public/getBalance.js
var require_getBalance = __commonJS({
  "node_modules/viem/_cjs/actions/public/getBalance.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getBalance = void 0;
    var toHex_js_1 = require_toHex();
    async function getBalance(client, { address, blockNumber, blockTag = "latest" }) {
      const blockNumberHex = blockNumber ? (0, toHex_js_1.numberToHex)(blockNumber) : void 0;
      const balance = await client.request({
        method: "eth_getBalance",
        params: [address, blockNumberHex || blockTag]
      });
      return BigInt(balance);
    }
    exports.getBalance = getBalance;
  }
});

// node_modules/viem/_cjs/actions/public/getBlockTransactionCount.js
var require_getBlockTransactionCount = __commonJS({
  "node_modules/viem/_cjs/actions/public/getBlockTransactionCount.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getBlockTransactionCount = void 0;
    var fromHex_js_1 = require_fromHex();
    var toHex_js_1 = require_toHex();
    async function getBlockTransactionCount(client, { blockHash, blockNumber, blockTag = "latest" } = {}) {
      const blockNumberHex = blockNumber !== void 0 ? (0, toHex_js_1.numberToHex)(blockNumber) : void 0;
      let count;
      if (blockHash) {
        count = await client.request({
          method: "eth_getBlockTransactionCountByHash",
          params: [blockHash]
        });
      } else {
        count = await client.request({
          method: "eth_getBlockTransactionCountByNumber",
          params: [blockNumberHex || blockTag]
        });
      }
      return (0, fromHex_js_1.hexToNumber)(count);
    }
    exports.getBlockTransactionCount = getBlockTransactionCount;
  }
});

// node_modules/viem/_cjs/actions/public/getBytecode.js
var require_getBytecode = __commonJS({
  "node_modules/viem/_cjs/actions/public/getBytecode.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getBytecode = void 0;
    var toHex_js_1 = require_toHex();
    async function getBytecode(client, { address, blockNumber, blockTag = "latest" }) {
      const blockNumberHex = blockNumber !== void 0 ? (0, toHex_js_1.numberToHex)(blockNumber) : void 0;
      const hex = await client.request({
        method: "eth_getCode",
        params: [address, blockNumberHex || blockTag]
      });
      if (hex === "0x")
        return void 0;
      return hex;
    }
    exports.getBytecode = getBytecode;
  }
});

// node_modules/viem/_cjs/utils/formatters/feeHistory.js
var require_feeHistory = __commonJS({
  "node_modules/viem/_cjs/utils/formatters/feeHistory.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.formatFeeHistory = void 0;
    function formatFeeHistory(feeHistory) {
      return {
        baseFeePerGas: feeHistory.baseFeePerGas.map((value) => BigInt(value)),
        gasUsedRatio: feeHistory.gasUsedRatio,
        oldestBlock: BigInt(feeHistory.oldestBlock),
        reward: feeHistory.reward?.map((reward) => reward.map((value) => BigInt(value)))
      };
    }
    exports.formatFeeHistory = formatFeeHistory;
  }
});

// node_modules/viem/_cjs/actions/public/getFeeHistory.js
var require_getFeeHistory = __commonJS({
  "node_modules/viem/_cjs/actions/public/getFeeHistory.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getFeeHistory = void 0;
    var toHex_js_1 = require_toHex();
    var feeHistory_js_1 = require_feeHistory();
    async function getFeeHistory(client, { blockCount, blockNumber, blockTag = "latest", rewardPercentiles }) {
      const blockNumberHex = blockNumber ? (0, toHex_js_1.numberToHex)(blockNumber) : void 0;
      const feeHistory = await client.request({
        method: "eth_feeHistory",
        params: [
          (0, toHex_js_1.numberToHex)(blockCount),
          blockNumberHex || blockTag,
          rewardPercentiles
        ]
      });
      return (0, feeHistory_js_1.formatFeeHistory)(feeHistory);
    }
    exports.getFeeHistory = getFeeHistory;
  }
});

// node_modules/viem/_cjs/actions/public/getFilterLogs.js
var require_getFilterLogs = __commonJS({
  "node_modules/viem/_cjs/actions/public/getFilterLogs.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getFilterLogs = void 0;
    var abi_js_1 = require_abi();
    var decodeEventLog_js_1 = require_decodeEventLog();
    var log_js_1 = require_log2();
    async function getFilterLogs(_client, { filter }) {
      const strict = filter.strict ?? false;
      const logs = await filter.request({
        method: "eth_getFilterLogs",
        params: [filter.id]
      });
      return logs.map((log) => {
        try {
          const { eventName, args } = "abi" in filter && filter.abi ? (0, decodeEventLog_js_1.decodeEventLog)({
            abi: filter.abi,
            data: log.data,
            topics: log.topics,
            strict
          }) : { eventName: void 0, args: void 0 };
          return (0, log_js_1.formatLog)(log, { args, eventName });
        } catch (err) {
          let eventName;
          let isUnnamed;
          if (err instanceof abi_js_1.DecodeLogDataMismatch || err instanceof abi_js_1.DecodeLogTopicsMismatch) {
            if ("strict" in filter && filter.strict)
              return;
            eventName = err.abiItem.name;
            isUnnamed = err.abiItem.inputs?.some((x) => !("name" in x && x.name));
          }
          return (0, log_js_1.formatLog)(log, { args: isUnnamed ? [] : {}, eventName });
        }
      }).filter(Boolean);
    }
    exports.getFilterLogs = getFilterLogs;
  }
});

// node_modules/viem/_cjs/utils/regex.js
var require_regex2 = __commonJS({
  "node_modules/viem/_cjs/utils/regex.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.integerRegex = exports.bytesRegex = exports.arrayRegex = void 0;
    exports.arrayRegex = /^(.*)\[([0-9]*)\]$/;
    exports.bytesRegex = /^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/;
    exports.integerRegex = /^(u?int)(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/;
  }
});

// node_modules/viem/_cjs/utils/signature/hashTypedData.js
var require_hashTypedData = __commonJS({
  "node_modules/viem/_cjs/utils/signature/hashTypedData.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.hashDomain = exports.hashTypedData = void 0;
    var encodeAbiParameters_js_1 = require_encodeAbiParameters();
    var concat_js_1 = require_concat();
    var toHex_js_1 = require_toHex();
    var keccak256_js_1 = require_keccak256();
    var typedData_js_1 = require_typedData();
    function hashTypedData({ domain: domain_, message, primaryType, types: types_ }) {
      const domain = typeof domain_ === "undefined" ? {} : domain_;
      const types = {
        EIP712Domain: (0, typedData_js_1.getTypesForEIP712Domain)({ domain }),
        ...types_
      };
      (0, typedData_js_1.validateTypedData)({
        domain,
        message,
        primaryType,
        types
      });
      const parts = ["0x1901"];
      if (domain)
        parts.push(hashDomain({
          domain,
          types
        }));
      if (primaryType !== "EIP712Domain") {
        parts.push(hashStruct({
          data: message,
          primaryType,
          types
        }));
      }
      return (0, keccak256_js_1.keccak256)((0, concat_js_1.concat)(parts));
    }
    exports.hashTypedData = hashTypedData;
    function hashDomain({ domain, types }) {
      return hashStruct({
        data: domain,
        primaryType: "EIP712Domain",
        types
      });
    }
    exports.hashDomain = hashDomain;
    function hashStruct({ data, primaryType, types }) {
      const encoded = encodeData({
        data,
        primaryType,
        types
      });
      return (0, keccak256_js_1.keccak256)(encoded);
    }
    function encodeData({ data, primaryType, types }) {
      const encodedTypes = [{ type: "bytes32" }];
      const encodedValues = [hashType({ primaryType, types })];
      for (const field of types[primaryType]) {
        const [type, value] = encodeField({
          types,
          name: field.name,
          type: field.type,
          value: data[field.name]
        });
        encodedTypes.push(type);
        encodedValues.push(value);
      }
      return (0, encodeAbiParameters_js_1.encodeAbiParameters)(encodedTypes, encodedValues);
    }
    function hashType({ primaryType, types }) {
      const encodedHashType = (0, toHex_js_1.toHex)(encodeType({ primaryType, types }));
      return (0, keccak256_js_1.keccak256)(encodedHashType);
    }
    function encodeType({ primaryType, types }) {
      let result = "";
      const unsortedDeps = findTypeDependencies({ primaryType, types });
      unsortedDeps.delete(primaryType);
      const deps = [primaryType, ...Array.from(unsortedDeps).sort()];
      for (const type of deps) {
        result += `${type}(${types[type].map(({ name, type: t }) => `${t} ${name}`).join(",")})`;
      }
      return result;
    }
    function findTypeDependencies({ primaryType: primaryType_, types }, results = /* @__PURE__ */ new Set()) {
      const match = primaryType_.match(/^\w*/u);
      const primaryType = match?.[0];
      if (results.has(primaryType) || types[primaryType] === void 0) {
        return results;
      }
      results.add(primaryType);
      for (const field of types[primaryType]) {
        findTypeDependencies({ primaryType: field.type, types }, results);
      }
      return results;
    }
    function encodeField({ types, name, type, value }) {
      if (types[type] !== void 0) {
        return [
          { type: "bytes32" },
          (0, keccak256_js_1.keccak256)(encodeData({ data: value, primaryType: type, types }))
        ];
      }
      if (type === "bytes") {
        const prepend = value.length % 2 ? "0" : "";
        value = `0x${prepend + value.slice(2)}`;
        return [{ type: "bytes32" }, (0, keccak256_js_1.keccak256)(value)];
      }
      if (type === "string")
        return [{ type: "bytes32" }, (0, keccak256_js_1.keccak256)((0, toHex_js_1.toHex)(value))];
      if (type.lastIndexOf("]") === type.length - 1) {
        const parsedType = type.slice(0, type.lastIndexOf("["));
        const typeValuePairs = value.map((item) => encodeField({
          name,
          type: parsedType,
          types,
          value: item
        }));
        return [
          { type: "bytes32" },
          (0, keccak256_js_1.keccak256)((0, encodeAbiParameters_js_1.encodeAbiParameters)(typeValuePairs.map(([t]) => t), typeValuePairs.map(([, v]) => v)))
        ];
      }
      return [{ type }, value];
    }
  }
});

// node_modules/viem/_cjs/utils/typedData.js
var require_typedData = __commonJS({
  "node_modules/viem/_cjs/utils/typedData.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.domainSeparator = exports.getTypesForEIP712Domain = exports.validateTypedData = void 0;
    var abi_js_1 = require_abi();
    var address_js_1 = require_address();
    var isAddress_js_1 = require_isAddress();
    var size_js_1 = require_size();
    var toHex_js_1 = require_toHex();
    var regex_js_1 = require_regex2();
    var hashTypedData_js_1 = require_hashTypedData();
    function validateTypedData({ domain, message, primaryType, types: types_ }) {
      const types = types_;
      const validateData = (struct, value_) => {
        for (const param of struct) {
          const { name, type: type_ } = param;
          const type = type_;
          const value = value_[name];
          const integerMatch = type.match(regex_js_1.integerRegex);
          if (integerMatch && (typeof value === "number" || typeof value === "bigint")) {
            const [_type, base, size_] = integerMatch;
            (0, toHex_js_1.numberToHex)(value, {
              signed: base === "int",
              size: parseInt(size_) / 8
            });
          }
          if (type === "address" && typeof value === "string" && !(0, isAddress_js_1.isAddress)(value))
            throw new address_js_1.InvalidAddressError({ address: value });
          const bytesMatch = type.match(regex_js_1.bytesRegex);
          if (bytesMatch) {
            const [_type, size_] = bytesMatch;
            if (size_ && (0, size_js_1.size)(value) !== parseInt(size_))
              throw new abi_js_1.BytesSizeMismatchError({
                expectedSize: parseInt(size_),
                givenSize: (0, size_js_1.size)(value)
              });
          }
          const struct2 = types[type];
          if (struct2)
            validateData(struct2, value);
        }
      };
      if (types.EIP712Domain && domain)
        validateData(types.EIP712Domain, domain);
      if (primaryType !== "EIP712Domain") {
        const type = types[primaryType];
        validateData(type, message);
      }
    }
    exports.validateTypedData = validateTypedData;
    function getTypesForEIP712Domain({ domain }) {
      return [
        typeof domain?.name === "string" && { name: "name", type: "string" },
        domain?.version && { name: "version", type: "string" },
        typeof domain?.chainId === "number" && {
          name: "chainId",
          type: "uint256"
        },
        domain?.verifyingContract && {
          name: "verifyingContract",
          type: "address"
        },
        domain?.salt && { name: "salt", type: "bytes32" }
      ].filter(Boolean);
    }
    exports.getTypesForEIP712Domain = getTypesForEIP712Domain;
    function domainSeparator({ domain }) {
      return (0, hashTypedData_js_1.hashDomain)({
        domain,
        types: {
          EIP712Domain: getTypesForEIP712Domain({ domain })
        }
      });
    }
    exports.domainSeparator = domainSeparator;
  }
});

// node_modules/viem/_cjs/utils/abi/decodeFunctionData.js
var require_decodeFunctionData = __commonJS({
  "node_modules/viem/_cjs/utils/abi/decodeFunctionData.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.decodeFunctionData = void 0;
    var abi_js_1 = require_abi();
    var slice_js_1 = require_slice();
    var getFunctionSelector_js_1 = require_getFunctionSelector();
    var decodeAbiParameters_js_1 = require_decodeAbiParameters();
    var formatAbiItem_js_1 = require_formatAbiItem2();
    function decodeFunctionData2({ abi: abi2, data }) {
      const signature = (0, slice_js_1.slice)(data, 0, 4);
      const description = abi2.find((x) => x.type === "function" && signature === (0, getFunctionSelector_js_1.getFunctionSelector)((0, formatAbiItem_js_1.formatAbiItem)(x)));
      if (!description)
        throw new abi_js_1.AbiFunctionSignatureNotFoundError(signature, {
          docsPath: "/docs/contract/decodeFunctionData"
        });
      return {
        functionName: description.name,
        args: "inputs" in description && description.inputs && description.inputs.length > 0 ? (0, decodeAbiParameters_js_1.decodeAbiParameters)(description.inputs, (0, slice_js_1.slice)(data, 4)) : void 0
      };
    }
    exports.decodeFunctionData = decodeFunctionData2;
  }
});

// node_modules/viem/_cjs/utils/abi/encodeDeployData.js
var require_encodeDeployData = __commonJS({
  "node_modules/viem/_cjs/utils/abi/encodeDeployData.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.encodeDeployData = void 0;
    var abi_js_1 = require_abi();
    var concat_js_1 = require_concat();
    var encodeAbiParameters_js_1 = require_encodeAbiParameters();
    var docsPath = "/docs/contract/encodeDeployData";
    function encodeDeployData({ abi: abi2, args, bytecode }) {
      if (!args || args.length === 0)
        return bytecode;
      const description = abi2.find((x) => "type" in x && x.type === "constructor");
      if (!description)
        throw new abi_js_1.AbiConstructorNotFoundError({ docsPath });
      if (!("inputs" in description))
        throw new abi_js_1.AbiConstructorParamsNotFoundError({ docsPath });
      if (!description.inputs || description.inputs.length === 0)
        throw new abi_js_1.AbiConstructorParamsNotFoundError({ docsPath });
      const data = (0, encodeAbiParameters_js_1.encodeAbiParameters)(description.inputs, args);
      return (0, concat_js_1.concatHex)([bytecode, data]);
    }
    exports.encodeDeployData = encodeDeployData;
  }
});

// node_modules/viem/_cjs/utils/abi/encodeErrorResult.js
var require_encodeErrorResult = __commonJS({
  "node_modules/viem/_cjs/utils/abi/encodeErrorResult.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.encodeErrorResult = void 0;
    var abi_js_1 = require_abi();
    var concat_js_1 = require_concat();
    var getFunctionSelector_js_1 = require_getFunctionSelector();
    var encodeAbiParameters_js_1 = require_encodeAbiParameters();
    var formatAbiItem_js_1 = require_formatAbiItem2();
    var getAbiItem_js_1 = require_getAbiItem();
    var docsPath = "/docs/contract/encodeErrorResult";
    function encodeErrorResult({ abi: abi2, errorName, args }) {
      let abiItem = abi2[0];
      if (errorName) {
        abiItem = (0, getAbiItem_js_1.getAbiItem)({
          abi: abi2,
          args,
          name: errorName
        });
        if (!abiItem)
          throw new abi_js_1.AbiErrorNotFoundError(errorName, { docsPath });
      }
      if (abiItem.type !== "error")
        throw new abi_js_1.AbiErrorNotFoundError(void 0, { docsPath });
      const definition = (0, formatAbiItem_js_1.formatAbiItem)(abiItem);
      const signature = (0, getFunctionSelector_js_1.getFunctionSelector)(definition);
      let data = "0x";
      if (args && args.length > 0) {
        if (!abiItem.inputs)
          throw new abi_js_1.AbiErrorInputsNotFoundError(abiItem.name, { docsPath });
        data = (0, encodeAbiParameters_js_1.encodeAbiParameters)(abiItem.inputs, args);
      }
      return (0, concat_js_1.concatHex)([signature, data]);
    }
    exports.encodeErrorResult = encodeErrorResult;
  }
});

// node_modules/viem/_cjs/utils/abi/encodeFunctionResult.js
var require_encodeFunctionResult = __commonJS({
  "node_modules/viem/_cjs/utils/abi/encodeFunctionResult.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.encodeFunctionResult = void 0;
    var abi_js_1 = require_abi();
    var encodeAbiParameters_js_1 = require_encodeAbiParameters();
    var getAbiItem_js_1 = require_getAbiItem();
    var docsPath = "/docs/contract/encodeFunctionResult";
    function encodeFunctionResult({ abi: abi2, functionName, result }) {
      let abiItem = abi2[0];
      if (functionName) {
        abiItem = (0, getAbiItem_js_1.getAbiItem)({
          abi: abi2,
          name: functionName
        });
        if (!abiItem)
          throw new abi_js_1.AbiFunctionNotFoundError(functionName, {
            docsPath: "/docs/contract/encodeFunctionResult"
          });
      }
      if (abiItem.type !== "function")
        throw new abi_js_1.AbiFunctionNotFoundError(void 0, {
          docsPath: "/docs/contract/encodeFunctionResult"
        });
      if (!abiItem.outputs)
        throw new abi_js_1.AbiFunctionOutputsNotFoundError(abiItem.name, { docsPath });
      let values = Array.isArray(result) ? result : [result];
      if (abiItem.outputs.length === 0 && !values[0])
        values = [];
      return (0, encodeAbiParameters_js_1.encodeAbiParameters)(abiItem.outputs, values);
    }
    exports.encodeFunctionResult = encodeFunctionResult;
  }
});

// node_modules/viem/_cjs/utils/abi/encodePacked.js
var require_encodePacked = __commonJS({
  "node_modules/viem/_cjs/utils/abi/encodePacked.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.encodePacked = void 0;
    var abi_js_1 = require_abi();
    var address_js_1 = require_address();
    var isAddress_js_1 = require_isAddress();
    var concat_js_1 = require_concat();
    var pad_js_1 = require_pad();
    var toHex_js_1 = require_toHex();
    var regex_js_1 = require_regex2();
    function encodePacked(types, values) {
      if (types.length !== values.length)
        throw new abi_js_1.AbiEncodingLengthMismatchError({
          expectedLength: types.length,
          givenLength: values.length
        });
      const data = [];
      for (let i = 0; i < types.length; i++) {
        const type = types[i];
        const value = values[i];
        data.push(encode(type, value));
      }
      return (0, concat_js_1.concatHex)(data);
    }
    exports.encodePacked = encodePacked;
    function encode(type, value, isArray = false) {
      if (type === "address") {
        const address = value;
        if (!(0, isAddress_js_1.isAddress)(address))
          throw new address_js_1.InvalidAddressError({ address });
        return (0, pad_js_1.pad)(address.toLowerCase(), {
          size: isArray ? 32 : null
        });
      }
      if (type === "string")
        return (0, toHex_js_1.stringToHex)(value);
      if (type === "bytes")
        return value;
      if (type === "bool")
        return (0, pad_js_1.pad)((0, toHex_js_1.boolToHex)(value), { size: isArray ? 32 : 1 });
      const intMatch = type.match(regex_js_1.integerRegex);
      if (intMatch) {
        const [_type, baseType, bits = "256"] = intMatch;
        const size2 = parseInt(bits) / 8;
        return (0, toHex_js_1.numberToHex)(value, {
          size: isArray ? 32 : size2,
          signed: baseType === "int"
        });
      }
      const bytesMatch = type.match(regex_js_1.bytesRegex);
      if (bytesMatch) {
        const [_type, size2] = bytesMatch;
        if (parseInt(size2) !== (value.length - 2) / 2)
          throw new abi_js_1.BytesSizeMismatchError({
            expectedSize: parseInt(size2),
            givenSize: (value.length - 2) / 2
          });
        return (0, pad_js_1.pad)(value, { dir: "right", size: isArray ? 32 : null });
      }
      const arrayMatch = type.match(regex_js_1.arrayRegex);
      if (arrayMatch && Array.isArray(value)) {
        const [_type, childType] = arrayMatch;
        const data = [];
        for (let i = 0; i < value.length; i++) {
          data.push(encode(childType, value[i], true));
        }
        if (data.length === 0)
          return "0x";
        return (0, concat_js_1.concatHex)(data);
      }
      throw new abi_js_1.UnsupportedPackedAbiType(type);
    }
  }
});

// node_modules/viem/_cjs/utils/data/isBytes.js
var require_isBytes = __commonJS({
  "node_modules/viem/_cjs/utils/data/isBytes.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isBytes = void 0;
    function isBytes(value) {
      if (!value)
        return false;
      if (typeof value !== "object")
        return false;
      if (!("BYTES_PER_ELEMENT" in value))
        return false;
      return value.BYTES_PER_ELEMENT === 1 && value.constructor.name === "Uint8Array";
    }
    exports.isBytes = isBytes;
  }
});

// node_modules/viem/_cjs/errors/cursor.js
var require_cursor = __commonJS({
  "node_modules/viem/_cjs/errors/cursor.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PositionOutOfBoundsError = exports.NegativeOffsetError = void 0;
    var base_js_1 = require_base();
    var NegativeOffsetError = class extends base_js_1.BaseError {
      constructor({ offset }) {
        super(`Offset \`${offset}\` cannot be negative.`);
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "NegativeOffsetError"
        });
      }
    };
    exports.NegativeOffsetError = NegativeOffsetError;
    var PositionOutOfBoundsError = class extends base_js_1.BaseError {
      constructor({ length, position }) {
        super(`Position \`${position}\` is out of bounds (\`0 < position < ${length}\`).`);
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "PositionOutOfBoundsError"
        });
      }
    };
    exports.PositionOutOfBoundsError = PositionOutOfBoundsError;
  }
});

// node_modules/viem/_cjs/utils/cursor.js
var require_cursor2 = __commonJS({
  "node_modules/viem/_cjs/utils/cursor.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createCursor = void 0;
    var cursor_js_1 = require_cursor();
    var staticCursor = {
      bytes: new Uint8Array(),
      dataView: new DataView(new ArrayBuffer(0)),
      position: 0,
      assertPosition(position) {
        if (position < 0 || position > this.bytes.length - 1)
          throw new cursor_js_1.PositionOutOfBoundsError({
            length: this.bytes.length,
            position
          });
      },
      decrementPosition(offset) {
        if (offset < 0)
          throw new cursor_js_1.NegativeOffsetError({ offset });
        const position = this.position - offset;
        this.assertPosition(position);
        this.position = position;
      },
      incrementPosition(offset) {
        if (offset < 0)
          throw new cursor_js_1.NegativeOffsetError({ offset });
        const position = this.position + offset;
        this.assertPosition(position);
        this.position = position;
      },
      inspectByte(position_) {
        const position = position_ ?? this.position;
        this.assertPosition(position);
        return this.bytes[position];
      },
      inspectBytes(length, position_) {
        const position = position_ ?? this.position;
        this.assertPosition(position + length - 1);
        return this.bytes.subarray(position, position + length);
      },
      inspectUint8(position_) {
        const position = position_ ?? this.position;
        this.assertPosition(position);
        return this.bytes[position];
      },
      inspectUint16(position_) {
        const position = position_ ?? this.position;
        this.assertPosition(position + 1);
        return this.dataView.getUint16(position);
      },
      inspectUint24(position_) {
        const position = position_ ?? this.position;
        this.assertPosition(position + 2);
        return (this.dataView.getUint16(position) << 8) + this.dataView.getUint8(position + 2);
      },
      inspectUint32(position_) {
        const position = position_ ?? this.position;
        this.assertPosition(position + 3);
        return this.dataView.getUint32(position);
      },
      pushByte(byte) {
        this.assertPosition(this.position);
        this.bytes[this.position] = byte;
        this.position++;
      },
      pushBytes(bytes2) {
        this.assertPosition(this.position + bytes2.length - 1);
        this.bytes.set(bytes2, this.position);
        this.position += bytes2.length;
      },
      pushUint8(value) {
        this.assertPosition(this.position);
        this.bytes[this.position] = value;
        this.position++;
      },
      pushUint16(value) {
        this.assertPosition(this.position + 1);
        this.dataView.setUint16(this.position, value);
        this.position += 2;
      },
      pushUint24(value) {
        this.assertPosition(this.position + 2);
        this.dataView.setUint16(this.position, value >> 8);
        this.dataView.setUint8(this.position + 2, value & ~4294967040);
        this.position += 3;
      },
      pushUint32(value) {
        this.assertPosition(this.position + 3);
        this.dataView.setUint32(this.position, value);
        this.position += 4;
      },
      readByte() {
        const value = this.inspectByte();
        this.position++;
        return value;
      },
      readBytes(length) {
        const value = this.inspectBytes(length);
        this.position += length;
        return value;
      },
      readUint8() {
        const value = this.inspectUint8();
        this.position += 1;
        return value;
      },
      readUint16() {
        const value = this.inspectUint16();
        this.position += 2;
        return value;
      },
      readUint24() {
        const value = this.inspectUint24();
        this.position += 3;
        return value;
      },
      readUint32() {
        const value = this.inspectUint32();
        this.position += 4;
        return value;
      },
      setPosition(position) {
        this.assertPosition(position);
        this.position = position;
      }
    };
    function createCursor(bytes2) {
      const cursor = Object.create(staticCursor);
      cursor.bytes = bytes2;
      cursor.dataView = new DataView(bytes2.buffer, bytes2.byteOffset, bytes2.byteLength);
      return cursor;
    }
    exports.createCursor = createCursor;
  }
});

// node_modules/viem/_cjs/utils/encoding/toRlp.js
var require_toRlp = __commonJS({
  "node_modules/viem/_cjs/utils/encoding/toRlp.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.hexToRlp = exports.bytesToRlp = exports.toRlp = void 0;
    var index_js_1 = require_cjs4();
    var cursor_js_1 = require_cursor2();
    var toBytes_js_1 = require_toBytes();
    var toHex_js_1 = require_toHex();
    function toRlp(bytes2, to = "hex") {
      const encodable = getEncodable(bytes2);
      const cursor = (0, cursor_js_1.createCursor)(new Uint8Array(encodable.length));
      encodable.encode(cursor);
      if (to === "hex")
        return (0, toHex_js_1.bytesToHex)(cursor.bytes);
      return cursor.bytes;
    }
    exports.toRlp = toRlp;
    function bytesToRlp(bytes2, to = "bytes") {
      return toRlp(bytes2, to);
    }
    exports.bytesToRlp = bytesToRlp;
    function hexToRlp(hex, to = "hex") {
      return toRlp(hex, to);
    }
    exports.hexToRlp = hexToRlp;
    function getEncodable(bytes2) {
      if (Array.isArray(bytes2))
        return getEncodableList(bytes2.map((x) => getEncodable(x)));
      return getEncodableBytes(bytes2);
    }
    function getEncodableList(list) {
      const bodyLength = list.reduce((acc, x) => acc + x.length, 0);
      const sizeOfBodyLength = getSizeOfLength(bodyLength);
      const length = (() => {
        if (bodyLength <= 55)
          return 1 + bodyLength;
        return 1 + sizeOfBodyLength + bodyLength;
      })();
      return {
        length,
        encode(cursor) {
          if (bodyLength <= 55) {
            cursor.pushByte(192 + bodyLength);
          } else {
            cursor.pushByte(192 + 55 + sizeOfBodyLength);
            if (sizeOfBodyLength === 1)
              cursor.pushUint8(bodyLength);
            else if (sizeOfBodyLength === 2)
              cursor.pushUint16(bodyLength);
            else if (sizeOfBodyLength === 3)
              cursor.pushUint24(bodyLength);
            else
              cursor.pushUint32(bodyLength);
          }
          list.forEach((x) => x.encode(cursor));
        }
      };
    }
    function getEncodableBytes(bytesOrHex) {
      const bytes2 = typeof bytesOrHex === "string" ? (0, toBytes_js_1.hexToBytes)(bytesOrHex) : bytesOrHex;
      const sizeOfBytesLength = getSizeOfLength(bytes2.length);
      const length = (() => {
        if (bytes2.length === 1 && bytes2[0] < 128)
          return 1;
        if (bytes2.length <= 55)
          return 1 + bytes2.length;
        return 1 + sizeOfBytesLength + bytes2.length;
      })();
      return {
        length,
        encode(cursor) {
          if (bytes2.length === 1 && bytes2[0] < 128) {
            cursor.pushBytes(bytes2);
          } else if (bytes2.length <= 55) {
            cursor.pushByte(128 + bytes2.length);
            cursor.pushBytes(bytes2);
          } else {
            cursor.pushByte(128 + 55 + sizeOfBytesLength);
            if (sizeOfBytesLength === 1)
              cursor.pushUint8(bytes2.length);
            else if (sizeOfBytesLength === 2)
              cursor.pushUint16(bytes2.length);
            else if (sizeOfBytesLength === 3)
              cursor.pushUint24(bytes2.length);
            else
              cursor.pushUint32(bytes2.length);
            cursor.pushBytes(bytes2);
          }
        }
      };
    }
    function getSizeOfLength(length) {
      if (length < 2 ** 8)
        return 1;
      if (length < 2 ** 16)
        return 2;
      if (length < 2 ** 24)
        return 3;
      if (length < 2 ** 32)
        return 4;
      throw new index_js_1.BaseError("Length is too large.");
    }
  }
});

// node_modules/viem/_cjs/utils/address/getContractAddress.js
var require_getContractAddress = __commonJS({
  "node_modules/viem/_cjs/utils/address/getContractAddress.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getCreate2Address = exports.getCreateAddress = exports.getContractAddress = void 0;
    var concat_js_1 = require_concat();
    var isBytes_js_1 = require_isBytes();
    var pad_js_1 = require_pad();
    var slice_js_1 = require_slice();
    var toBytes_js_1 = require_toBytes();
    var toRlp_js_1 = require_toRlp();
    var keccak256_js_1 = require_keccak256();
    var getAddress_js_1 = require_getAddress();
    function getContractAddress(opts) {
      if (opts.opcode === "CREATE2")
        return getCreate2Address(opts);
      return getCreateAddress(opts);
    }
    exports.getContractAddress = getContractAddress;
    function getCreateAddress(opts) {
      const from = (0, toBytes_js_1.toBytes)((0, getAddress_js_1.getAddress)(opts.from));
      let nonce = (0, toBytes_js_1.toBytes)(opts.nonce);
      if (nonce[0] === 0)
        nonce = new Uint8Array([]);
      return (0, getAddress_js_1.getAddress)(`0x${(0, keccak256_js_1.keccak256)((0, toRlp_js_1.toRlp)([from, nonce], "bytes")).slice(26)}`);
    }
    exports.getCreateAddress = getCreateAddress;
    function getCreate2Address(opts) {
      const from = (0, toBytes_js_1.toBytes)((0, getAddress_js_1.getAddress)(opts.from));
      const salt = (0, pad_js_1.pad)((0, isBytes_js_1.isBytes)(opts.salt) ? opts.salt : (0, toBytes_js_1.toBytes)(opts.salt), {
        size: 32
      });
      const bytecodeHash = (() => {
        if ("bytecodeHash" in opts) {
          if ((0, isBytes_js_1.isBytes)(opts.bytecodeHash))
            return opts.bytecodeHash;
          return (0, toBytes_js_1.toBytes)(opts.bytecodeHash);
        }
        return (0, keccak256_js_1.keccak256)(opts.bytecode, "bytes");
      })();
      return (0, getAddress_js_1.getAddress)((0, slice_js_1.slice)((0, keccak256_js_1.keccak256)((0, concat_js_1.concat)([(0, toBytes_js_1.toBytes)("0xff"), from, salt, bytecodeHash])), 12));
    }
    exports.getCreate2Address = getCreate2Address;
  }
});

// node_modules/viem/_cjs/utils/formatters/transactionReceipt.js
var require_transactionReceipt = __commonJS({
  "node_modules/viem/_cjs/utils/formatters/transactionReceipt.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.defineTransactionReceipt = exports.formatTransactionReceipt = void 0;
    var fromHex_js_1 = require_fromHex();
    var formatter_js_1 = require_formatter();
    var log_js_1 = require_log2();
    var transaction_js_1 = require_transaction2();
    var statuses = {
      "0x0": "reverted",
      "0x1": "success"
    };
    function formatTransactionReceipt(transactionReceipt) {
      return {
        ...transactionReceipt,
        blockNumber: transactionReceipt.blockNumber ? BigInt(transactionReceipt.blockNumber) : null,
        contractAddress: transactionReceipt.contractAddress ? transactionReceipt.contractAddress : null,
        cumulativeGasUsed: transactionReceipt.cumulativeGasUsed ? BigInt(transactionReceipt.cumulativeGasUsed) : null,
        effectiveGasPrice: transactionReceipt.effectiveGasPrice ? BigInt(transactionReceipt.effectiveGasPrice) : null,
        gasUsed: transactionReceipt.gasUsed ? BigInt(transactionReceipt.gasUsed) : null,
        logs: transactionReceipt.logs ? transactionReceipt.logs.map((log) => (0, log_js_1.formatLog)(log)) : null,
        to: transactionReceipt.to ? transactionReceipt.to : null,
        transactionIndex: transactionReceipt.transactionIndex ? (0, fromHex_js_1.hexToNumber)(transactionReceipt.transactionIndex) : null,
        status: transactionReceipt.status ? statuses[transactionReceipt.status] : null,
        type: transactionReceipt.type ? transaction_js_1.transactionType[transactionReceipt.type] || transactionReceipt.type : null
      };
    }
    exports.formatTransactionReceipt = formatTransactionReceipt;
    exports.defineTransactionReceipt = (0, formatter_js_1.defineFormatter)("transactionReceipt", formatTransactionReceipt);
  }
});

// node_modules/viem/_cjs/utils/encoding/fromBytes.js
var require_fromBytes = __commonJS({
  "node_modules/viem/_cjs/utils/encoding/fromBytes.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.bytesToString = exports.bytesToNumber = exports.bytesToBool = exports.bytesToBigInt = exports.fromBytes = void 0;
    var encoding_js_1 = require_encoding();
    var trim_js_1 = require_trim();
    var fromHex_js_1 = require_fromHex();
    var toHex_js_1 = require_toHex();
    function fromBytes(bytes2, toOrOpts) {
      const opts = typeof toOrOpts === "string" ? { to: toOrOpts } : toOrOpts;
      const to = opts.to;
      if (to === "number")
        return bytesToNumber(bytes2, opts);
      if (to === "bigint")
        return bytesToBigInt(bytes2, opts);
      if (to === "boolean")
        return bytesToBool(bytes2, opts);
      if (to === "string")
        return bytesToString(bytes2, opts);
      return (0, toHex_js_1.bytesToHex)(bytes2, opts);
    }
    exports.fromBytes = fromBytes;
    function bytesToBigInt(bytes2, opts = {}) {
      if (typeof opts.size !== "undefined")
        (0, fromHex_js_1.assertSize)(bytes2, { size: opts.size });
      const hex = (0, toHex_js_1.bytesToHex)(bytes2, opts);
      return (0, fromHex_js_1.hexToBigInt)(hex);
    }
    exports.bytesToBigInt = bytesToBigInt;
    function bytesToBool(bytes_, opts = {}) {
      let bytes2 = bytes_;
      if (typeof opts.size !== "undefined") {
        (0, fromHex_js_1.assertSize)(bytes2, { size: opts.size });
        bytes2 = (0, trim_js_1.trim)(bytes2);
      }
      if (bytes2.length > 1 || bytes2[0] > 1)
        throw new encoding_js_1.InvalidBytesBooleanError(bytes2);
      return Boolean(bytes2[0]);
    }
    exports.bytesToBool = bytesToBool;
    function bytesToNumber(bytes2, opts = {}) {
      if (typeof opts.size !== "undefined")
        (0, fromHex_js_1.assertSize)(bytes2, { size: opts.size });
      const hex = (0, toHex_js_1.bytesToHex)(bytes2, opts);
      return (0, fromHex_js_1.hexToNumber)(hex);
    }
    exports.bytesToNumber = bytesToNumber;
    function bytesToString(bytes_, opts = {}) {
      let bytes2 = bytes_;
      if (typeof opts.size !== "undefined") {
        (0, fromHex_js_1.assertSize)(bytes2, { size: opts.size });
        bytes2 = (0, trim_js_1.trim)(bytes2, { dir: "right" });
      }
      return new TextDecoder().decode(bytes2);
    }
    exports.bytesToString = bytesToString;
  }
});

// node_modules/viem/_cjs/utils/encoding/fromRlp.js
var require_fromRlp = __commonJS({
  "node_modules/viem/_cjs/utils/encoding/fromRlp.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.rlpToHex = exports.rlpToBytes = exports.fromRlp = void 0;
    var base_js_1 = require_base();
    var encoding_js_1 = require_encoding();
    var cursor_js_1 = require_cursor2();
    var toBytes_js_1 = require_toBytes();
    var toHex_js_1 = require_toHex();
    function fromRlp(value, to = "hex") {
      const bytes2 = (() => {
        if (typeof value === "string") {
          if (value.length > 3 && value.length % 2 !== 0)
            throw new encoding_js_1.InvalidHexValueError(value);
          return (0, toBytes_js_1.hexToBytes)(value);
        }
        return value;
      })();
      const cursor = (0, cursor_js_1.createCursor)(bytes2);
      const result = fromRlpCursor(cursor, to);
      return result;
    }
    exports.fromRlp = fromRlp;
    function rlpToBytes(bytes2, to = "bytes") {
      return fromRlp(bytes2, to);
    }
    exports.rlpToBytes = rlpToBytes;
    function rlpToHex(hex, to = "hex") {
      return fromRlp(hex, to);
    }
    exports.rlpToHex = rlpToHex;
    function fromRlpCursor(cursor, to = "hex") {
      if (cursor.bytes.length === 0)
        return to === "hex" ? (0, toHex_js_1.bytesToHex)(cursor.bytes) : cursor.bytes;
      const prefix = cursor.readByte();
      if (prefix < 128)
        cursor.decrementPosition(1);
      if (prefix < 192) {
        const length2 = readLength(cursor, prefix, 128);
        const bytes2 = cursor.readBytes(length2);
        return to === "hex" ? (0, toHex_js_1.bytesToHex)(bytes2) : bytes2;
      }
      const length = readLength(cursor, prefix, 192);
      return readList(cursor, length, to);
    }
    function readLength(cursor, prefix, offset) {
      if (offset === 128 && prefix < 128)
        return 1;
      if (prefix <= offset + 55)
        return prefix - offset;
      if (prefix === offset + 55 + 1)
        return cursor.readUint8();
      if (prefix === offset + 55 + 2)
        return cursor.readUint16();
      if (prefix === offset + 55 + 3)
        return cursor.readUint24();
      if (prefix === offset + 55 + 4)
        return cursor.readUint32();
      throw new base_js_1.BaseError("Invalid RLP prefix");
    }
    function readList(cursor, length, to) {
      const position = cursor.position;
      const value = [];
      while (cursor.position - position < length)
        value.push(fromRlpCursor(cursor, to));
      return value;
    }
  }
});

// node_modules/viem/_cjs/utils/hash/isHash.js
var require_isHash = __commonJS({
  "node_modules/viem/_cjs/utils/hash/isHash.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isHash = void 0;
    var isHex_js_1 = require_isHex();
    var size_js_1 = require_size();
    function isHash(hash2) {
      return (0, isHex_js_1.isHex)(hash2) && (0, size_js_1.size)(hash2) === 32;
    }
    exports.isHash = isHash;
  }
});

// node_modules/@noble/hashes/_sha2.js
var require_sha2 = __commonJS({
  "node_modules/@noble/hashes/_sha2.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SHA2 = void 0;
    var _assert_js_1 = require_assert();
    var utils_js_1 = require_utils3();
    function setBigUint64(view, byteOffset, value, isLE2) {
      if (typeof view.setBigUint64 === "function")
        return view.setBigUint64(byteOffset, value, isLE2);
      const _32n2 = BigInt(32);
      const _u32_max = BigInt(4294967295);
      const wh = Number(value >> _32n2 & _u32_max);
      const wl = Number(value & _u32_max);
      const h = isLE2 ? 4 : 0;
      const l = isLE2 ? 0 : 4;
      view.setUint32(byteOffset + h, wh, isLE2);
      view.setUint32(byteOffset + l, wl, isLE2);
    }
    var SHA2 = class extends utils_js_1.Hash {
      constructor(blockLen, outputLen, padOffset, isLE2) {
        super();
        this.blockLen = blockLen;
        this.outputLen = outputLen;
        this.padOffset = padOffset;
        this.isLE = isLE2;
        this.finished = false;
        this.length = 0;
        this.pos = 0;
        this.destroyed = false;
        this.buffer = new Uint8Array(blockLen);
        this.view = (0, utils_js_1.createView)(this.buffer);
      }
      update(data) {
        (0, _assert_js_1.exists)(this);
        const { view, buffer, blockLen } = this;
        data = (0, utils_js_1.toBytes)(data);
        const len = data.length;
        for (let pos = 0; pos < len; ) {
          const take = Math.min(blockLen - this.pos, len - pos);
          if (take === blockLen) {
            const dataView = (0, utils_js_1.createView)(data);
            for (; blockLen <= len - pos; pos += blockLen)
              this.process(dataView, pos);
            continue;
          }
          buffer.set(data.subarray(pos, pos + take), this.pos);
          this.pos += take;
          pos += take;
          if (this.pos === blockLen) {
            this.process(view, 0);
            this.pos = 0;
          }
        }
        this.length += data.length;
        this.roundClean();
        return this;
      }
      digestInto(out) {
        (0, _assert_js_1.exists)(this);
        (0, _assert_js_1.output)(out, this);
        this.finished = true;
        const { buffer, view, blockLen, isLE: isLE2 } = this;
        let { pos } = this;
        buffer[pos++] = 128;
        this.buffer.subarray(pos).fill(0);
        if (this.padOffset > blockLen - pos) {
          this.process(view, 0);
          pos = 0;
        }
        for (let i = pos; i < blockLen; i++)
          buffer[i] = 0;
        setBigUint64(view, blockLen - 8, BigInt(this.length * 8), isLE2);
        this.process(view, 0);
        const oview = (0, utils_js_1.createView)(out);
        const len = this.outputLen;
        if (len % 4)
          throw new Error("_sha2: outputLen should be aligned to 32bit");
        const outLen = len / 4;
        const state = this.get();
        if (outLen > state.length)
          throw new Error("_sha2: outputLen bigger than state");
        for (let i = 0; i < outLen; i++)
          oview.setUint32(4 * i, state[i], isLE2);
      }
      digest() {
        const { buffer, outputLen } = this;
        this.digestInto(buffer);
        const res = buffer.slice(0, outputLen);
        this.destroy();
        return res;
      }
      _cloneInto(to) {
        to || (to = new this.constructor());
        to.set(...this.get());
        const { blockLen, buffer, length, finished, destroyed, pos } = this;
        to.length = length;
        to.pos = pos;
        to.finished = finished;
        to.destroyed = destroyed;
        if (length % blockLen)
          to.buffer.set(buffer);
        return to;
      }
    };
    exports.SHA2 = SHA2;
  }
});

// node_modules/@noble/hashes/sha256.js
var require_sha256 = __commonJS({
  "node_modules/@noble/hashes/sha256.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.sha224 = exports.sha256 = void 0;
    var _sha2_js_1 = require_sha2();
    var utils_js_1 = require_utils3();
    var Chi = (a, b, c) => a & b ^ ~a & c;
    var Maj = (a, b, c) => a & b ^ a & c ^ b & c;
    var SHA256_K = /* @__PURE__ */ new Uint32Array([
      1116352408,
      1899447441,
      3049323471,
      3921009573,
      961987163,
      1508970993,
      2453635748,
      2870763221,
      3624381080,
      310598401,
      607225278,
      1426881987,
      1925078388,
      2162078206,
      2614888103,
      3248222580,
      3835390401,
      4022224774,
      264347078,
      604807628,
      770255983,
      1249150122,
      1555081692,
      1996064986,
      2554220882,
      2821834349,
      2952996808,
      3210313671,
      3336571891,
      3584528711,
      113926993,
      338241895,
      666307205,
      773529912,
      1294757372,
      1396182291,
      1695183700,
      1986661051,
      2177026350,
      2456956037,
      2730485921,
      2820302411,
      3259730800,
      3345764771,
      3516065817,
      3600352804,
      4094571909,
      275423344,
      430227734,
      506948616,
      659060556,
      883997877,
      958139571,
      1322822218,
      1537002063,
      1747873779,
      1955562222,
      2024104815,
      2227730452,
      2361852424,
      2428436474,
      2756734187,
      3204031479,
      3329325298
    ]);
    var IV = /* @__PURE__ */ new Uint32Array([
      1779033703,
      3144134277,
      1013904242,
      2773480762,
      1359893119,
      2600822924,
      528734635,
      1541459225
    ]);
    var SHA256_W = /* @__PURE__ */ new Uint32Array(64);
    var SHA256 = class extends _sha2_js_1.SHA2 {
      constructor() {
        super(64, 32, 8, false);
        this.A = IV[0] | 0;
        this.B = IV[1] | 0;
        this.C = IV[2] | 0;
        this.D = IV[3] | 0;
        this.E = IV[4] | 0;
        this.F = IV[5] | 0;
        this.G = IV[6] | 0;
        this.H = IV[7] | 0;
      }
      get() {
        const { A, B, C, D, E, F, G, H } = this;
        return [A, B, C, D, E, F, G, H];
      }
      // prettier-ignore
      set(A, B, C, D, E, F, G, H) {
        this.A = A | 0;
        this.B = B | 0;
        this.C = C | 0;
        this.D = D | 0;
        this.E = E | 0;
        this.F = F | 0;
        this.G = G | 0;
        this.H = H | 0;
      }
      process(view, offset) {
        for (let i = 0; i < 16; i++, offset += 4)
          SHA256_W[i] = view.getUint32(offset, false);
        for (let i = 16; i < 64; i++) {
          const W15 = SHA256_W[i - 15];
          const W2 = SHA256_W[i - 2];
          const s0 = (0, utils_js_1.rotr)(W15, 7) ^ (0, utils_js_1.rotr)(W15, 18) ^ W15 >>> 3;
          const s1 = (0, utils_js_1.rotr)(W2, 17) ^ (0, utils_js_1.rotr)(W2, 19) ^ W2 >>> 10;
          SHA256_W[i] = s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16] | 0;
        }
        let { A, B, C, D, E, F, G, H } = this;
        for (let i = 0; i < 64; i++) {
          const sigma1 = (0, utils_js_1.rotr)(E, 6) ^ (0, utils_js_1.rotr)(E, 11) ^ (0, utils_js_1.rotr)(E, 25);
          const T1 = H + sigma1 + Chi(E, F, G) + SHA256_K[i] + SHA256_W[i] | 0;
          const sigma0 = (0, utils_js_1.rotr)(A, 2) ^ (0, utils_js_1.rotr)(A, 13) ^ (0, utils_js_1.rotr)(A, 22);
          const T2 = sigma0 + Maj(A, B, C) | 0;
          H = G;
          G = F;
          F = E;
          E = D + T1 | 0;
          D = C;
          C = B;
          B = A;
          A = T1 + T2 | 0;
        }
        A = A + this.A | 0;
        B = B + this.B | 0;
        C = C + this.C | 0;
        D = D + this.D | 0;
        E = E + this.E | 0;
        F = F + this.F | 0;
        G = G + this.G | 0;
        H = H + this.H | 0;
        this.set(A, B, C, D, E, F, G, H);
      }
      roundClean() {
        SHA256_W.fill(0);
      }
      destroy() {
        this.set(0, 0, 0, 0, 0, 0, 0, 0);
        this.buffer.fill(0);
      }
    };
    var SHA224 = class extends SHA256 {
      constructor() {
        super();
        this.A = 3238371032 | 0;
        this.B = 914150663 | 0;
        this.C = 812702999 | 0;
        this.D = 4144912697 | 0;
        this.E = 4290775857 | 0;
        this.F = 1750603025 | 0;
        this.G = 1694076839 | 0;
        this.H = 3204075428 | 0;
        this.outputLen = 28;
      }
    };
    exports.sha256 = (0, utils_js_1.wrapConstructor)(() => new SHA256());
    exports.sha224 = (0, utils_js_1.wrapConstructor)(() => new SHA224());
  }
});

// node_modules/@noble/curves/abstract/utils.js
var require_utils6 = __commonJS({
  "node_modules/@noble/curves/abstract/utils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateObject = exports.createHmacDrbg = exports.bitMask = exports.bitSet = exports.bitGet = exports.bitLen = exports.utf8ToBytes = exports.equalBytes = exports.concatBytes = exports.ensureBytes = exports.numberToVarBytesBE = exports.numberToBytesLE = exports.numberToBytesBE = exports.bytesToNumberLE = exports.bytesToNumberBE = exports.hexToBytes = exports.hexToNumber = exports.numberToHexUnpadded = exports.bytesToHex = void 0;
    var _0n2 = BigInt(0);
    var _1n2 = BigInt(1);
    var _2n2 = BigInt(2);
    var u8a2 = (a) => a instanceof Uint8Array;
    var hexes2 = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
    function bytesToHex2(bytes2) {
      if (!u8a2(bytes2))
        throw new Error("Uint8Array expected");
      let hex = "";
      for (let i = 0; i < bytes2.length; i++) {
        hex += hexes2[bytes2[i]];
      }
      return hex;
    }
    exports.bytesToHex = bytesToHex2;
    function numberToHexUnpadded(num) {
      const hex = num.toString(16);
      return hex.length & 1 ? `0${hex}` : hex;
    }
    exports.numberToHexUnpadded = numberToHexUnpadded;
    function hexToNumber2(hex) {
      if (typeof hex !== "string")
        throw new Error("hex string expected, got " + typeof hex);
      return BigInt(hex === "" ? "0" : `0x${hex}`);
    }
    exports.hexToNumber = hexToNumber2;
    function hexToBytes2(hex) {
      if (typeof hex !== "string")
        throw new Error("hex string expected, got " + typeof hex);
      const len = hex.length;
      if (len % 2)
        throw new Error("padded hex string expected, got unpadded hex of length " + len);
      const array = new Uint8Array(len / 2);
      for (let i = 0; i < array.length; i++) {
        const j = i * 2;
        const hexByte = hex.slice(j, j + 2);
        const byte = Number.parseInt(hexByte, 16);
        if (Number.isNaN(byte) || byte < 0)
          throw new Error("Invalid byte sequence");
        array[i] = byte;
      }
      return array;
    }
    exports.hexToBytes = hexToBytes2;
    function bytesToNumberBE(bytes2) {
      return hexToNumber2(bytesToHex2(bytes2));
    }
    exports.bytesToNumberBE = bytesToNumberBE;
    function bytesToNumberLE(bytes2) {
      if (!u8a2(bytes2))
        throw new Error("Uint8Array expected");
      return hexToNumber2(bytesToHex2(Uint8Array.from(bytes2).reverse()));
    }
    exports.bytesToNumberLE = bytesToNumberLE;
    function numberToBytesBE(n, len) {
      return hexToBytes2(n.toString(16).padStart(len * 2, "0"));
    }
    exports.numberToBytesBE = numberToBytesBE;
    function numberToBytesLE(n, len) {
      return numberToBytesBE(n, len).reverse();
    }
    exports.numberToBytesLE = numberToBytesLE;
    function numberToVarBytesBE(n) {
      return hexToBytes2(numberToHexUnpadded(n));
    }
    exports.numberToVarBytesBE = numberToVarBytesBE;
    function ensureBytes(title, hex, expectedLength) {
      let res;
      if (typeof hex === "string") {
        try {
          res = hexToBytes2(hex);
        } catch (e) {
          throw new Error(`${title} must be valid hex string, got "${hex}". Cause: ${e}`);
        }
      } else if (u8a2(hex)) {
        res = Uint8Array.from(hex);
      } else {
        throw new Error(`${title} must be hex string or Uint8Array`);
      }
      const len = res.length;
      if (typeof expectedLength === "number" && len !== expectedLength)
        throw new Error(`${title} expected ${expectedLength} bytes, got ${len}`);
      return res;
    }
    exports.ensureBytes = ensureBytes;
    function concatBytes(...arrays) {
      const r = new Uint8Array(arrays.reduce((sum, a) => sum + a.length, 0));
      let pad2 = 0;
      arrays.forEach((a) => {
        if (!u8a2(a))
          throw new Error("Uint8Array expected");
        r.set(a, pad2);
        pad2 += a.length;
      });
      return r;
    }
    exports.concatBytes = concatBytes;
    function equalBytes(b1, b2) {
      if (b1.length !== b2.length)
        return false;
      for (let i = 0; i < b1.length; i++)
        if (b1[i] !== b2[i])
          return false;
      return true;
    }
    exports.equalBytes = equalBytes;
    function utf8ToBytes2(str) {
      if (typeof str !== "string")
        throw new Error(`utf8ToBytes expected string, got ${typeof str}`);
      return new Uint8Array(new TextEncoder().encode(str));
    }
    exports.utf8ToBytes = utf8ToBytes2;
    function bitLen(n) {
      let len;
      for (len = 0; n > _0n2; n >>= _1n2, len += 1)
        ;
      return len;
    }
    exports.bitLen = bitLen;
    function bitGet(n, pos) {
      return n >> BigInt(pos) & _1n2;
    }
    exports.bitGet = bitGet;
    var bitSet = (n, pos, value) => {
      return n | (value ? _1n2 : _0n2) << BigInt(pos);
    };
    exports.bitSet = bitSet;
    var bitMask = (n) => (_2n2 << BigInt(n - 1)) - _1n2;
    exports.bitMask = bitMask;
    var u8n = (data) => new Uint8Array(data);
    var u8fr = (arr) => Uint8Array.from(arr);
    function createHmacDrbg(hashLen, qByteLen, hmacFn) {
      if (typeof hashLen !== "number" || hashLen < 2)
        throw new Error("hashLen must be a number");
      if (typeof qByteLen !== "number" || qByteLen < 2)
        throw new Error("qByteLen must be a number");
      if (typeof hmacFn !== "function")
        throw new Error("hmacFn must be a function");
      let v = u8n(hashLen);
      let k = u8n(hashLen);
      let i = 0;
      const reset = () => {
        v.fill(1);
        k.fill(0);
        i = 0;
      };
      const h = (...b) => hmacFn(k, v, ...b);
      const reseed = (seed = u8n()) => {
        k = h(u8fr([0]), seed);
        v = h();
        if (seed.length === 0)
          return;
        k = h(u8fr([1]), seed);
        v = h();
      };
      const gen2 = () => {
        if (i++ >= 1e3)
          throw new Error("drbg: tried 1000 values");
        let len = 0;
        const out = [];
        while (len < qByteLen) {
          v = h();
          const sl = v.slice();
          out.push(sl);
          len += v.length;
        }
        return concatBytes(...out);
      };
      const genUntil = (seed, pred) => {
        reset();
        reseed(seed);
        let res = void 0;
        while (!(res = pred(gen2())))
          reseed();
        reset();
        return res;
      };
      return genUntil;
    }
    exports.createHmacDrbg = createHmacDrbg;
    var validatorFns = {
      bigint: (val) => typeof val === "bigint",
      function: (val) => typeof val === "function",
      boolean: (val) => typeof val === "boolean",
      string: (val) => typeof val === "string",
      stringOrUint8Array: (val) => typeof val === "string" || val instanceof Uint8Array,
      isSafeInteger: (val) => Number.isSafeInteger(val),
      array: (val) => Array.isArray(val),
      field: (val, object) => object.Fp.isValid(val),
      hash: (val) => typeof val === "function" && Number.isSafeInteger(val.outputLen)
    };
    function validateObject(object, validators, optValidators = {}) {
      const checkField = (fieldName, type, isOptional) => {
        const checkVal = validatorFns[type];
        if (typeof checkVal !== "function")
          throw new Error(`Invalid validator "${type}", expected function`);
        const val = object[fieldName];
        if (isOptional && val === void 0)
          return;
        if (!checkVal(val, object)) {
          throw new Error(`Invalid param ${String(fieldName)}=${val} (${typeof val}), expected ${type}`);
        }
      };
      for (const [fieldName, type] of Object.entries(validators))
        checkField(fieldName, type, false);
      for (const [fieldName, type] of Object.entries(optValidators))
        checkField(fieldName, type, true);
      return object;
    }
    exports.validateObject = validateObject;
  }
});

// node_modules/@noble/curves/abstract/modular.js
var require_modular = __commonJS({
  "node_modules/@noble/curves/abstract/modular.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.mapHashToField = exports.getMinHashLength = exports.getFieldBytesLength = exports.hashToPrivateScalar = exports.FpSqrtEven = exports.FpSqrtOdd = exports.Field = exports.nLength = exports.FpIsSquare = exports.FpDiv = exports.FpInvertBatch = exports.FpPow = exports.validateField = exports.isNegativeLE = exports.FpSqrt = exports.tonelliShanks = exports.invert = exports.pow2 = exports.pow = exports.mod = void 0;
    var utils_js_1 = require_utils6();
    var _0n2 = BigInt(0);
    var _1n2 = BigInt(1);
    var _2n2 = BigInt(2);
    var _3n = BigInt(3);
    var _4n = BigInt(4);
    var _5n = BigInt(5);
    var _8n = BigInt(8);
    var _9n = BigInt(9);
    var _16n = BigInt(16);
    function mod(a, b) {
      const result = a % b;
      return result >= _0n2 ? result : b + result;
    }
    exports.mod = mod;
    function pow(num, power, modulo) {
      if (modulo <= _0n2 || power < _0n2)
        throw new Error("Expected power/modulo > 0");
      if (modulo === _1n2)
        return _0n2;
      let res = _1n2;
      while (power > _0n2) {
        if (power & _1n2)
          res = res * num % modulo;
        num = num * num % modulo;
        power >>= _1n2;
      }
      return res;
    }
    exports.pow = pow;
    function pow2(x, power, modulo) {
      let res = x;
      while (power-- > _0n2) {
        res *= res;
        res %= modulo;
      }
      return res;
    }
    exports.pow2 = pow2;
    function invert(number2, modulo) {
      if (number2 === _0n2 || modulo <= _0n2) {
        throw new Error(`invert: expected positive integers, got n=${number2} mod=${modulo}`);
      }
      let a = mod(number2, modulo);
      let b = modulo;
      let x = _0n2, y = _1n2, u = _1n2, v = _0n2;
      while (a !== _0n2) {
        const q = b / a;
        const r = b % a;
        const m = x - u * q;
        const n = y - v * q;
        b = a, a = r, x = u, y = v, u = m, v = n;
      }
      const gcd = b;
      if (gcd !== _1n2)
        throw new Error("invert: does not exist");
      return mod(x, modulo);
    }
    exports.invert = invert;
    function tonelliShanks(P) {
      const legendreC = (P - _1n2) / _2n2;
      let Q, S, Z;
      for (Q = P - _1n2, S = 0; Q % _2n2 === _0n2; Q /= _2n2, S++)
        ;
      for (Z = _2n2; Z < P && pow(Z, legendreC, P) !== P - _1n2; Z++)
        ;
      if (S === 1) {
        const p1div4 = (P + _1n2) / _4n;
        return function tonelliFast(Fp, n) {
          const root = Fp.pow(n, p1div4);
          if (!Fp.eql(Fp.sqr(root), n))
            throw new Error("Cannot find square root");
          return root;
        };
      }
      const Q1div2 = (Q + _1n2) / _2n2;
      return function tonelliSlow(Fp, n) {
        if (Fp.pow(n, legendreC) === Fp.neg(Fp.ONE))
          throw new Error("Cannot find square root");
        let r = S;
        let g = Fp.pow(Fp.mul(Fp.ONE, Z), Q);
        let x = Fp.pow(n, Q1div2);
        let b = Fp.pow(n, Q);
        while (!Fp.eql(b, Fp.ONE)) {
          if (Fp.eql(b, Fp.ZERO))
            return Fp.ZERO;
          let m = 1;
          for (let t2 = Fp.sqr(b); m < r; m++) {
            if (Fp.eql(t2, Fp.ONE))
              break;
            t2 = Fp.sqr(t2);
          }
          const ge = Fp.pow(g, _1n2 << BigInt(r - m - 1));
          g = Fp.sqr(ge);
          x = Fp.mul(x, ge);
          b = Fp.mul(b, g);
          r = m;
        }
        return x;
      };
    }
    exports.tonelliShanks = tonelliShanks;
    function FpSqrt(P) {
      if (P % _4n === _3n) {
        const p1div4 = (P + _1n2) / _4n;
        return function sqrt3mod4(Fp, n) {
          const root = Fp.pow(n, p1div4);
          if (!Fp.eql(Fp.sqr(root), n))
            throw new Error("Cannot find square root");
          return root;
        };
      }
      if (P % _8n === _5n) {
        const c1 = (P - _5n) / _8n;
        return function sqrt5mod8(Fp, n) {
          const n2 = Fp.mul(n, _2n2);
          const v = Fp.pow(n2, c1);
          const nv = Fp.mul(n, v);
          const i = Fp.mul(Fp.mul(nv, _2n2), v);
          const root = Fp.mul(nv, Fp.sub(i, Fp.ONE));
          if (!Fp.eql(Fp.sqr(root), n))
            throw new Error("Cannot find square root");
          return root;
        };
      }
      if (P % _16n === _9n) {
      }
      return tonelliShanks(P);
    }
    exports.FpSqrt = FpSqrt;
    var isNegativeLE = (num, modulo) => (mod(num, modulo) & _1n2) === _1n2;
    exports.isNegativeLE = isNegativeLE;
    var FIELD_FIELDS = [
      "create",
      "isValid",
      "is0",
      "neg",
      "inv",
      "sqrt",
      "sqr",
      "eql",
      "add",
      "sub",
      "mul",
      "pow",
      "div",
      "addN",
      "subN",
      "mulN",
      "sqrN"
    ];
    function validateField(field) {
      const initial = {
        ORDER: "bigint",
        MASK: "bigint",
        BYTES: "isSafeInteger",
        BITS: "isSafeInteger"
      };
      const opts = FIELD_FIELDS.reduce((map, val) => {
        map[val] = "function";
        return map;
      }, initial);
      return (0, utils_js_1.validateObject)(field, opts);
    }
    exports.validateField = validateField;
    function FpPow(f, num, power) {
      if (power < _0n2)
        throw new Error("Expected power > 0");
      if (power === _0n2)
        return f.ONE;
      if (power === _1n2)
        return num;
      let p = f.ONE;
      let d = num;
      while (power > _0n2) {
        if (power & _1n2)
          p = f.mul(p, d);
        d = f.sqr(d);
        power >>= _1n2;
      }
      return p;
    }
    exports.FpPow = FpPow;
    function FpInvertBatch(f, nums) {
      const tmp = new Array(nums.length);
      const lastMultiplied = nums.reduce((acc, num, i) => {
        if (f.is0(num))
          return acc;
        tmp[i] = acc;
        return f.mul(acc, num);
      }, f.ONE);
      const inverted = f.inv(lastMultiplied);
      nums.reduceRight((acc, num, i) => {
        if (f.is0(num))
          return acc;
        tmp[i] = f.mul(acc, tmp[i]);
        return f.mul(acc, num);
      }, inverted);
      return tmp;
    }
    exports.FpInvertBatch = FpInvertBatch;
    function FpDiv(f, lhs, rhs) {
      return f.mul(lhs, typeof rhs === "bigint" ? invert(rhs, f.ORDER) : f.inv(rhs));
    }
    exports.FpDiv = FpDiv;
    function FpIsSquare(f) {
      const legendreConst = (f.ORDER - _1n2) / _2n2;
      return (x) => {
        const p = f.pow(x, legendreConst);
        return f.eql(p, f.ZERO) || f.eql(p, f.ONE);
      };
    }
    exports.FpIsSquare = FpIsSquare;
    function nLength(n, nBitLength) {
      const _nBitLength = nBitLength !== void 0 ? nBitLength : n.toString(2).length;
      const nByteLength = Math.ceil(_nBitLength / 8);
      return { nBitLength: _nBitLength, nByteLength };
    }
    exports.nLength = nLength;
    function Field(ORDER, bitLen, isLE2 = false, redef = {}) {
      if (ORDER <= _0n2)
        throw new Error(`Expected Field ORDER > 0, got ${ORDER}`);
      const { nBitLength: BITS, nByteLength: BYTES } = nLength(ORDER, bitLen);
      if (BYTES > 2048)
        throw new Error("Field lengths over 2048 bytes are not supported");
      const sqrtP = FpSqrt(ORDER);
      const f = Object.freeze({
        ORDER,
        BITS,
        BYTES,
        MASK: (0, utils_js_1.bitMask)(BITS),
        ZERO: _0n2,
        ONE: _1n2,
        create: (num) => mod(num, ORDER),
        isValid: (num) => {
          if (typeof num !== "bigint")
            throw new Error(`Invalid field element: expected bigint, got ${typeof num}`);
          return _0n2 <= num && num < ORDER;
        },
        is0: (num) => num === _0n2,
        isOdd: (num) => (num & _1n2) === _1n2,
        neg: (num) => mod(-num, ORDER),
        eql: (lhs, rhs) => lhs === rhs,
        sqr: (num) => mod(num * num, ORDER),
        add: (lhs, rhs) => mod(lhs + rhs, ORDER),
        sub: (lhs, rhs) => mod(lhs - rhs, ORDER),
        mul: (lhs, rhs) => mod(lhs * rhs, ORDER),
        pow: (num, power) => FpPow(f, num, power),
        div: (lhs, rhs) => mod(lhs * invert(rhs, ORDER), ORDER),
        // Same as above, but doesn't normalize
        sqrN: (num) => num * num,
        addN: (lhs, rhs) => lhs + rhs,
        subN: (lhs, rhs) => lhs - rhs,
        mulN: (lhs, rhs) => lhs * rhs,
        inv: (num) => invert(num, ORDER),
        sqrt: redef.sqrt || ((n) => sqrtP(f, n)),
        invertBatch: (lst) => FpInvertBatch(f, lst),
        // TODO: do we really need constant cmov?
        // We don't have const-time bigints anyway, so probably will be not very useful
        cmov: (a, b, c) => c ? b : a,
        toBytes: (num) => isLE2 ? (0, utils_js_1.numberToBytesLE)(num, BYTES) : (0, utils_js_1.numberToBytesBE)(num, BYTES),
        fromBytes: (bytes2) => {
          if (bytes2.length !== BYTES)
            throw new Error(`Fp.fromBytes: expected ${BYTES}, got ${bytes2.length}`);
          return isLE2 ? (0, utils_js_1.bytesToNumberLE)(bytes2) : (0, utils_js_1.bytesToNumberBE)(bytes2);
        }
      });
      return Object.freeze(f);
    }
    exports.Field = Field;
    function FpSqrtOdd(Fp, elm) {
      if (!Fp.isOdd)
        throw new Error(`Field doesn't have isOdd`);
      const root = Fp.sqrt(elm);
      return Fp.isOdd(root) ? root : Fp.neg(root);
    }
    exports.FpSqrtOdd = FpSqrtOdd;
    function FpSqrtEven(Fp, elm) {
      if (!Fp.isOdd)
        throw new Error(`Field doesn't have isOdd`);
      const root = Fp.sqrt(elm);
      return Fp.isOdd(root) ? Fp.neg(root) : root;
    }
    exports.FpSqrtEven = FpSqrtEven;
    function hashToPrivateScalar(hash2, groupOrder, isLE2 = false) {
      hash2 = (0, utils_js_1.ensureBytes)("privateHash", hash2);
      const hashLen = hash2.length;
      const minLen = nLength(groupOrder).nByteLength + 8;
      if (minLen < 24 || hashLen < minLen || hashLen > 1024)
        throw new Error(`hashToPrivateScalar: expected ${minLen}-1024 bytes of input, got ${hashLen}`);
      const num = isLE2 ? (0, utils_js_1.bytesToNumberLE)(hash2) : (0, utils_js_1.bytesToNumberBE)(hash2);
      return mod(num, groupOrder - _1n2) + _1n2;
    }
    exports.hashToPrivateScalar = hashToPrivateScalar;
    function getFieldBytesLength(fieldOrder) {
      if (typeof fieldOrder !== "bigint")
        throw new Error("field order must be bigint");
      const bitLength = fieldOrder.toString(2).length;
      return Math.ceil(bitLength / 8);
    }
    exports.getFieldBytesLength = getFieldBytesLength;
    function getMinHashLength(fieldOrder) {
      const length = getFieldBytesLength(fieldOrder);
      return length + Math.ceil(length / 2);
    }
    exports.getMinHashLength = getMinHashLength;
    function mapHashToField(key, fieldOrder, isLE2 = false) {
      const len = key.length;
      const fieldLen = getFieldBytesLength(fieldOrder);
      const minLen = getMinHashLength(fieldOrder);
      if (len < 16 || len < minLen || len > 1024)
        throw new Error(`expected ${minLen}-1024 bytes of input, got ${len}`);
      const num = isLE2 ? (0, utils_js_1.bytesToNumberBE)(key) : (0, utils_js_1.bytesToNumberLE)(key);
      const reduced = mod(num, fieldOrder - _1n2) + _1n2;
      return isLE2 ? (0, utils_js_1.numberToBytesLE)(reduced, fieldLen) : (0, utils_js_1.numberToBytesBE)(reduced, fieldLen);
    }
    exports.mapHashToField = mapHashToField;
  }
});

// node_modules/@noble/curves/abstract/curve.js
var require_curve = __commonJS({
  "node_modules/@noble/curves/abstract/curve.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateBasic = exports.wNAF = void 0;
    var modular_js_1 = require_modular();
    var utils_js_1 = require_utils6();
    var _0n2 = BigInt(0);
    var _1n2 = BigInt(1);
    function wNAF(c, bits) {
      const constTimeNegate = (condition, item) => {
        const neg = item.negate();
        return condition ? neg : item;
      };
      const opts = (W) => {
        const windows = Math.ceil(bits / W) + 1;
        const windowSize = 2 ** (W - 1);
        return { windows, windowSize };
      };
      return {
        constTimeNegate,
        // non-const time multiplication ladder
        unsafeLadder(elm, n) {
          let p = c.ZERO;
          let d = elm;
          while (n > _0n2) {
            if (n & _1n2)
              p = p.add(d);
            d = d.double();
            n >>= _1n2;
          }
          return p;
        },
        /**
         * Creates a wNAF precomputation window. Used for caching.
         * Default window size is set by `utils.precompute()` and is equal to 8.
         * Number of precomputed points depends on the curve size:
         * 2^(𝑊−1) * (Math.ceil(𝑛 / 𝑊) + 1), where:
         * - 𝑊 is the window size
         * - 𝑛 is the bitlength of the curve order.
         * For a 256-bit curve and window size 8, the number of precomputed points is 128 * 33 = 4224.
         * @returns precomputed point tables flattened to a single array
         */
        precomputeWindow(elm, W) {
          const { windows, windowSize } = opts(W);
          const points = [];
          let p = elm;
          let base = p;
          for (let window2 = 0; window2 < windows; window2++) {
            base = p;
            points.push(base);
            for (let i = 1; i < windowSize; i++) {
              base = base.add(p);
              points.push(base);
            }
            p = base.double();
          }
          return points;
        },
        /**
         * Implements ec multiplication using precomputed tables and w-ary non-adjacent form.
         * @param W window size
         * @param precomputes precomputed tables
         * @param n scalar (we don't check here, but should be less than curve order)
         * @returns real and fake (for const-time) points
         */
        wNAF(W, precomputes, n) {
          const { windows, windowSize } = opts(W);
          let p = c.ZERO;
          let f = c.BASE;
          const mask = BigInt(2 ** W - 1);
          const maxNumber = 2 ** W;
          const shiftBy = BigInt(W);
          for (let window2 = 0; window2 < windows; window2++) {
            const offset = window2 * windowSize;
            let wbits = Number(n & mask);
            n >>= shiftBy;
            if (wbits > windowSize) {
              wbits -= maxNumber;
              n += _1n2;
            }
            const offset1 = offset;
            const offset2 = offset + Math.abs(wbits) - 1;
            const cond1 = window2 % 2 !== 0;
            const cond2 = wbits < 0;
            if (wbits === 0) {
              f = f.add(constTimeNegate(cond1, precomputes[offset1]));
            } else {
              p = p.add(constTimeNegate(cond2, precomputes[offset2]));
            }
          }
          return { p, f };
        },
        wNAFCached(P, precomputesMap, n, transform) {
          const W = P._WINDOW_SIZE || 1;
          let comp = precomputesMap.get(P);
          if (!comp) {
            comp = this.precomputeWindow(P, W);
            if (W !== 1) {
              precomputesMap.set(P, transform(comp));
            }
          }
          return this.wNAF(W, comp, n);
        }
      };
    }
    exports.wNAF = wNAF;
    function validateBasic(curve) {
      (0, modular_js_1.validateField)(curve.Fp);
      (0, utils_js_1.validateObject)(curve, {
        n: "bigint",
        h: "bigint",
        Gx: "field",
        Gy: "field"
      }, {
        nBitLength: "isSafeInteger",
        nByteLength: "isSafeInteger"
      });
      return Object.freeze({
        ...(0, modular_js_1.nLength)(curve.n, curve.nBitLength),
        ...curve,
        ...{ p: curve.Fp.ORDER }
      });
    }
    exports.validateBasic = validateBasic;
  }
});

// node_modules/@noble/curves/abstract/weierstrass.js
var require_weierstrass = __commonJS({
  "node_modules/@noble/curves/abstract/weierstrass.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.mapToCurveSimpleSWU = exports.SWUFpSqrtRatio = exports.weierstrass = exports.weierstrassPoints = exports.DER = void 0;
    var mod = require_modular();
    var ut = require_utils6();
    var utils_js_1 = require_utils6();
    var curve_js_1 = require_curve();
    function validatePointOpts(curve) {
      const opts = (0, curve_js_1.validateBasic)(curve);
      ut.validateObject(opts, {
        a: "field",
        b: "field"
      }, {
        allowedPrivateKeyLengths: "array",
        wrapPrivateKey: "boolean",
        isTorsionFree: "function",
        clearCofactor: "function",
        allowInfinityPoint: "boolean",
        fromBytes: "function",
        toBytes: "function"
      });
      const { endo, Fp, a } = opts;
      if (endo) {
        if (!Fp.eql(a, Fp.ZERO)) {
          throw new Error("Endomorphism can only be defined for Koblitz curves that have a=0");
        }
        if (typeof endo !== "object" || typeof endo.beta !== "bigint" || typeof endo.splitScalar !== "function") {
          throw new Error("Expected endomorphism with beta: bigint and splitScalar: function");
        }
      }
      return Object.freeze({ ...opts });
    }
    var { bytesToNumberBE: b2n, hexToBytes: h2b } = ut;
    exports.DER = {
      // asn.1 DER encoding utils
      Err: class DERErr extends Error {
        constructor(m = "") {
          super(m);
        }
      },
      _parseInt(data) {
        const { Err: E } = exports.DER;
        if (data.length < 2 || data[0] !== 2)
          throw new E("Invalid signature integer tag");
        const len = data[1];
        const res = data.subarray(2, len + 2);
        if (!len || res.length !== len)
          throw new E("Invalid signature integer: wrong length");
        if (res[0] & 128)
          throw new E("Invalid signature integer: negative");
        if (res[0] === 0 && !(res[1] & 128))
          throw new E("Invalid signature integer: unnecessary leading zero");
        return { d: b2n(res), l: data.subarray(len + 2) };
      },
      toSig(hex) {
        const { Err: E } = exports.DER;
        const data = typeof hex === "string" ? h2b(hex) : hex;
        if (!(data instanceof Uint8Array))
          throw new Error("ui8a expected");
        let l = data.length;
        if (l < 2 || data[0] != 48)
          throw new E("Invalid signature tag");
        if (data[1] !== l - 2)
          throw new E("Invalid signature: incorrect length");
        const { d: r, l: sBytes } = exports.DER._parseInt(data.subarray(2));
        const { d: s, l: rBytesLeft } = exports.DER._parseInt(sBytes);
        if (rBytesLeft.length)
          throw new E("Invalid signature: left bytes after parsing");
        return { r, s };
      },
      hexFromSig(sig) {
        const slice2 = (s2) => Number.parseInt(s2[0], 16) & 8 ? "00" + s2 : s2;
        const h = (num) => {
          const hex = num.toString(16);
          return hex.length & 1 ? `0${hex}` : hex;
        };
        const s = slice2(h(sig.s));
        const r = slice2(h(sig.r));
        const shl = s.length / 2;
        const rhl = r.length / 2;
        const sl = h(shl);
        const rl = h(rhl);
        return `30${h(rhl + shl + 4)}02${rl}${r}02${sl}${s}`;
      }
    };
    var _0n2 = BigInt(0);
    var _1n2 = BigInt(1);
    var _2n2 = BigInt(2);
    var _3n = BigInt(3);
    var _4n = BigInt(4);
    function weierstrassPoints(opts) {
      const CURVE = validatePointOpts(opts);
      const { Fp } = CURVE;
      const toBytes3 = CURVE.toBytes || ((_c, point, _isCompressed) => {
        const a = point.toAffine();
        return ut.concatBytes(Uint8Array.from([4]), Fp.toBytes(a.x), Fp.toBytes(a.y));
      });
      const fromBytes = CURVE.fromBytes || ((bytes2) => {
        const tail = bytes2.subarray(1);
        const x = Fp.fromBytes(tail.subarray(0, Fp.BYTES));
        const y = Fp.fromBytes(tail.subarray(Fp.BYTES, 2 * Fp.BYTES));
        return { x, y };
      });
      function weierstrassEquation(x) {
        const { a, b } = CURVE;
        const x2 = Fp.sqr(x);
        const x3 = Fp.mul(x2, x);
        return Fp.add(Fp.add(x3, Fp.mul(x, a)), b);
      }
      if (!Fp.eql(Fp.sqr(CURVE.Gy), weierstrassEquation(CURVE.Gx)))
        throw new Error("bad generator point: equation left != right");
      function isWithinCurveOrder(num) {
        return typeof num === "bigint" && _0n2 < num && num < CURVE.n;
      }
      function assertGE(num) {
        if (!isWithinCurveOrder(num))
          throw new Error("Expected valid bigint: 0 < bigint < curve.n");
      }
      function normPrivateKeyToScalar(key) {
        const { allowedPrivateKeyLengths: lengths, nByteLength, wrapPrivateKey, n } = CURVE;
        if (lengths && typeof key !== "bigint") {
          if (key instanceof Uint8Array)
            key = ut.bytesToHex(key);
          if (typeof key !== "string" || !lengths.includes(key.length))
            throw new Error("Invalid key");
          key = key.padStart(nByteLength * 2, "0");
        }
        let num;
        try {
          num = typeof key === "bigint" ? key : ut.bytesToNumberBE((0, utils_js_1.ensureBytes)("private key", key, nByteLength));
        } catch (error) {
          throw new Error(`private key must be ${nByteLength} bytes, hex or bigint, not ${typeof key}`);
        }
        if (wrapPrivateKey)
          num = mod.mod(num, n);
        assertGE(num);
        return num;
      }
      const pointPrecomputes = /* @__PURE__ */ new Map();
      function assertPrjPoint(other) {
        if (!(other instanceof Point))
          throw new Error("ProjectivePoint expected");
      }
      class Point {
        constructor(px, py, pz) {
          this.px = px;
          this.py = py;
          this.pz = pz;
          if (px == null || !Fp.isValid(px))
            throw new Error("x required");
          if (py == null || !Fp.isValid(py))
            throw new Error("y required");
          if (pz == null || !Fp.isValid(pz))
            throw new Error("z required");
        }
        // Does not validate if the point is on-curve.
        // Use fromHex instead, or call assertValidity() later.
        static fromAffine(p) {
          const { x, y } = p || {};
          if (!p || !Fp.isValid(x) || !Fp.isValid(y))
            throw new Error("invalid affine point");
          if (p instanceof Point)
            throw new Error("projective point not allowed");
          const is0 = (i) => Fp.eql(i, Fp.ZERO);
          if (is0(x) && is0(y))
            return Point.ZERO;
          return new Point(x, y, Fp.ONE);
        }
        get x() {
          return this.toAffine().x;
        }
        get y() {
          return this.toAffine().y;
        }
        /**
         * Takes a bunch of Projective Points but executes only one
         * inversion on all of them. Inversion is very slow operation,
         * so this improves performance massively.
         * Optimization: converts a list of projective points to a list of identical points with Z=1.
         */
        static normalizeZ(points) {
          const toInv = Fp.invertBatch(points.map((p) => p.pz));
          return points.map((p, i) => p.toAffine(toInv[i])).map(Point.fromAffine);
        }
        /**
         * Converts hash string or Uint8Array to Point.
         * @param hex short/long ECDSA hex
         */
        static fromHex(hex) {
          const P = Point.fromAffine(fromBytes((0, utils_js_1.ensureBytes)("pointHex", hex)));
          P.assertValidity();
          return P;
        }
        // Multiplies generator point by privateKey.
        static fromPrivateKey(privateKey) {
          return Point.BASE.multiply(normPrivateKeyToScalar(privateKey));
        }
        // "Private method", don't use it directly
        _setWindowSize(windowSize) {
          this._WINDOW_SIZE = windowSize;
          pointPrecomputes.delete(this);
        }
        // A point on curve is valid if it conforms to equation.
        assertValidity() {
          if (this.is0()) {
            if (CURVE.allowInfinityPoint && !Fp.is0(this.py))
              return;
            throw new Error("bad point: ZERO");
          }
          const { x, y } = this.toAffine();
          if (!Fp.isValid(x) || !Fp.isValid(y))
            throw new Error("bad point: x or y not FE");
          const left = Fp.sqr(y);
          const right = weierstrassEquation(x);
          if (!Fp.eql(left, right))
            throw new Error("bad point: equation left != right");
          if (!this.isTorsionFree())
            throw new Error("bad point: not in prime-order subgroup");
        }
        hasEvenY() {
          const { y } = this.toAffine();
          if (Fp.isOdd)
            return !Fp.isOdd(y);
          throw new Error("Field doesn't support isOdd");
        }
        /**
         * Compare one point to another.
         */
        equals(other) {
          assertPrjPoint(other);
          const { px: X1, py: Y1, pz: Z1 } = this;
          const { px: X2, py: Y2, pz: Z2 } = other;
          const U1 = Fp.eql(Fp.mul(X1, Z2), Fp.mul(X2, Z1));
          const U2 = Fp.eql(Fp.mul(Y1, Z2), Fp.mul(Y2, Z1));
          return U1 && U2;
        }
        /**
         * Flips point to one corresponding to (x, -y) in Affine coordinates.
         */
        negate() {
          return new Point(this.px, Fp.neg(this.py), this.pz);
        }
        // Renes-Costello-Batina exception-free doubling formula.
        // There is 30% faster Jacobian formula, but it is not complete.
        // https://eprint.iacr.org/2015/1060, algorithm 3
        // Cost: 8M + 3S + 3*a + 2*b3 + 15add.
        double() {
          const { a, b } = CURVE;
          const b3 = Fp.mul(b, _3n);
          const { px: X1, py: Y1, pz: Z1 } = this;
          let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO;
          let t0 = Fp.mul(X1, X1);
          let t1 = Fp.mul(Y1, Y1);
          let t2 = Fp.mul(Z1, Z1);
          let t3 = Fp.mul(X1, Y1);
          t3 = Fp.add(t3, t3);
          Z3 = Fp.mul(X1, Z1);
          Z3 = Fp.add(Z3, Z3);
          X3 = Fp.mul(a, Z3);
          Y3 = Fp.mul(b3, t2);
          Y3 = Fp.add(X3, Y3);
          X3 = Fp.sub(t1, Y3);
          Y3 = Fp.add(t1, Y3);
          Y3 = Fp.mul(X3, Y3);
          X3 = Fp.mul(t3, X3);
          Z3 = Fp.mul(b3, Z3);
          t2 = Fp.mul(a, t2);
          t3 = Fp.sub(t0, t2);
          t3 = Fp.mul(a, t3);
          t3 = Fp.add(t3, Z3);
          Z3 = Fp.add(t0, t0);
          t0 = Fp.add(Z3, t0);
          t0 = Fp.add(t0, t2);
          t0 = Fp.mul(t0, t3);
          Y3 = Fp.add(Y3, t0);
          t2 = Fp.mul(Y1, Z1);
          t2 = Fp.add(t2, t2);
          t0 = Fp.mul(t2, t3);
          X3 = Fp.sub(X3, t0);
          Z3 = Fp.mul(t2, t1);
          Z3 = Fp.add(Z3, Z3);
          Z3 = Fp.add(Z3, Z3);
          return new Point(X3, Y3, Z3);
        }
        // Renes-Costello-Batina exception-free addition formula.
        // There is 30% faster Jacobian formula, but it is not complete.
        // https://eprint.iacr.org/2015/1060, algorithm 1
        // Cost: 12M + 0S + 3*a + 3*b3 + 23add.
        add(other) {
          assertPrjPoint(other);
          const { px: X1, py: Y1, pz: Z1 } = this;
          const { px: X2, py: Y2, pz: Z2 } = other;
          let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO;
          const a = CURVE.a;
          const b3 = Fp.mul(CURVE.b, _3n);
          let t0 = Fp.mul(X1, X2);
          let t1 = Fp.mul(Y1, Y2);
          let t2 = Fp.mul(Z1, Z2);
          let t3 = Fp.add(X1, Y1);
          let t4 = Fp.add(X2, Y2);
          t3 = Fp.mul(t3, t4);
          t4 = Fp.add(t0, t1);
          t3 = Fp.sub(t3, t4);
          t4 = Fp.add(X1, Z1);
          let t5 = Fp.add(X2, Z2);
          t4 = Fp.mul(t4, t5);
          t5 = Fp.add(t0, t2);
          t4 = Fp.sub(t4, t5);
          t5 = Fp.add(Y1, Z1);
          X3 = Fp.add(Y2, Z2);
          t5 = Fp.mul(t5, X3);
          X3 = Fp.add(t1, t2);
          t5 = Fp.sub(t5, X3);
          Z3 = Fp.mul(a, t4);
          X3 = Fp.mul(b3, t2);
          Z3 = Fp.add(X3, Z3);
          X3 = Fp.sub(t1, Z3);
          Z3 = Fp.add(t1, Z3);
          Y3 = Fp.mul(X3, Z3);
          t1 = Fp.add(t0, t0);
          t1 = Fp.add(t1, t0);
          t2 = Fp.mul(a, t2);
          t4 = Fp.mul(b3, t4);
          t1 = Fp.add(t1, t2);
          t2 = Fp.sub(t0, t2);
          t2 = Fp.mul(a, t2);
          t4 = Fp.add(t4, t2);
          t0 = Fp.mul(t1, t4);
          Y3 = Fp.add(Y3, t0);
          t0 = Fp.mul(t5, t4);
          X3 = Fp.mul(t3, X3);
          X3 = Fp.sub(X3, t0);
          t0 = Fp.mul(t3, t1);
          Z3 = Fp.mul(t5, Z3);
          Z3 = Fp.add(Z3, t0);
          return new Point(X3, Y3, Z3);
        }
        subtract(other) {
          return this.add(other.negate());
        }
        is0() {
          return this.equals(Point.ZERO);
        }
        wNAF(n) {
          return wnaf.wNAFCached(this, pointPrecomputes, n, (comp) => {
            const toInv = Fp.invertBatch(comp.map((p) => p.pz));
            return comp.map((p, i) => p.toAffine(toInv[i])).map(Point.fromAffine);
          });
        }
        /**
         * Non-constant-time multiplication. Uses double-and-add algorithm.
         * It's faster, but should only be used when you don't care about
         * an exposed private key e.g. sig verification, which works over *public* keys.
         */
        multiplyUnsafe(n) {
          const I = Point.ZERO;
          if (n === _0n2)
            return I;
          assertGE(n);
          if (n === _1n2)
            return this;
          const { endo } = CURVE;
          if (!endo)
            return wnaf.unsafeLadder(this, n);
          let { k1neg, k1, k2neg, k2 } = endo.splitScalar(n);
          let k1p = I;
          let k2p = I;
          let d = this;
          while (k1 > _0n2 || k2 > _0n2) {
            if (k1 & _1n2)
              k1p = k1p.add(d);
            if (k2 & _1n2)
              k2p = k2p.add(d);
            d = d.double();
            k1 >>= _1n2;
            k2 >>= _1n2;
          }
          if (k1neg)
            k1p = k1p.negate();
          if (k2neg)
            k2p = k2p.negate();
          k2p = new Point(Fp.mul(k2p.px, endo.beta), k2p.py, k2p.pz);
          return k1p.add(k2p);
        }
        /**
         * Constant time multiplication.
         * Uses wNAF method. Windowed method may be 10% faster,
         * but takes 2x longer to generate and consumes 2x memory.
         * Uses precomputes when available.
         * Uses endomorphism for Koblitz curves.
         * @param scalar by which the point would be multiplied
         * @returns New point
         */
        multiply(scalar) {
          assertGE(scalar);
          let n = scalar;
          let point, fake;
          const { endo } = CURVE;
          if (endo) {
            const { k1neg, k1, k2neg, k2 } = endo.splitScalar(n);
            let { p: k1p, f: f1p } = this.wNAF(k1);
            let { p: k2p, f: f2p } = this.wNAF(k2);
            k1p = wnaf.constTimeNegate(k1neg, k1p);
            k2p = wnaf.constTimeNegate(k2neg, k2p);
            k2p = new Point(Fp.mul(k2p.px, endo.beta), k2p.py, k2p.pz);
            point = k1p.add(k2p);
            fake = f1p.add(f2p);
          } else {
            const { p, f } = this.wNAF(n);
            point = p;
            fake = f;
          }
          return Point.normalizeZ([point, fake])[0];
        }
        /**
         * Efficiently calculate `aP + bQ`. Unsafe, can expose private key, if used incorrectly.
         * Not using Strauss-Shamir trick: precomputation tables are faster.
         * The trick could be useful if both P and Q are not G (not in our case).
         * @returns non-zero affine point
         */
        multiplyAndAddUnsafe(Q, a, b) {
          const G = Point.BASE;
          const mul = (P, a2) => a2 === _0n2 || a2 === _1n2 || !P.equals(G) ? P.multiplyUnsafe(a2) : P.multiply(a2);
          const sum = mul(this, a).add(mul(Q, b));
          return sum.is0() ? void 0 : sum;
        }
        // Converts Projective point to affine (x, y) coordinates.
        // Can accept precomputed Z^-1 - for example, from invertBatch.
        // (x, y, z) ∋ (x=x/z, y=y/z)
        toAffine(iz) {
          const { px: x, py: y, pz: z } = this;
          const is0 = this.is0();
          if (iz == null)
            iz = is0 ? Fp.ONE : Fp.inv(z);
          const ax = Fp.mul(x, iz);
          const ay = Fp.mul(y, iz);
          const zz = Fp.mul(z, iz);
          if (is0)
            return { x: Fp.ZERO, y: Fp.ZERO };
          if (!Fp.eql(zz, Fp.ONE))
            throw new Error("invZ was invalid");
          return { x: ax, y: ay };
        }
        isTorsionFree() {
          const { h: cofactor, isTorsionFree } = CURVE;
          if (cofactor === _1n2)
            return true;
          if (isTorsionFree)
            return isTorsionFree(Point, this);
          throw new Error("isTorsionFree() has not been declared for the elliptic curve");
        }
        clearCofactor() {
          const { h: cofactor, clearCofactor } = CURVE;
          if (cofactor === _1n2)
            return this;
          if (clearCofactor)
            return clearCofactor(Point, this);
          return this.multiplyUnsafe(CURVE.h);
        }
        toRawBytes(isCompressed = true) {
          this.assertValidity();
          return toBytes3(Point, this, isCompressed);
        }
        toHex(isCompressed = true) {
          return ut.bytesToHex(this.toRawBytes(isCompressed));
        }
      }
      Point.BASE = new Point(CURVE.Gx, CURVE.Gy, Fp.ONE);
      Point.ZERO = new Point(Fp.ZERO, Fp.ONE, Fp.ZERO);
      const _bits = CURVE.nBitLength;
      const wnaf = (0, curve_js_1.wNAF)(Point, CURVE.endo ? Math.ceil(_bits / 2) : _bits);
      return {
        CURVE,
        ProjectivePoint: Point,
        normPrivateKeyToScalar,
        weierstrassEquation,
        isWithinCurveOrder
      };
    }
    exports.weierstrassPoints = weierstrassPoints;
    function validateOpts(curve) {
      const opts = (0, curve_js_1.validateBasic)(curve);
      ut.validateObject(opts, {
        hash: "hash",
        hmac: "function",
        randomBytes: "function"
      }, {
        bits2int: "function",
        bits2int_modN: "function",
        lowS: "boolean"
      });
      return Object.freeze({ lowS: true, ...opts });
    }
    function weierstrass(curveDef) {
      const CURVE = validateOpts(curveDef);
      const { Fp, n: CURVE_ORDER } = CURVE;
      const compressedLen = Fp.BYTES + 1;
      const uncompressedLen = 2 * Fp.BYTES + 1;
      function isValidFieldElement(num) {
        return _0n2 < num && num < Fp.ORDER;
      }
      function modN(a) {
        return mod.mod(a, CURVE_ORDER);
      }
      function invN(a) {
        return mod.invert(a, CURVE_ORDER);
      }
      const { ProjectivePoint: Point, normPrivateKeyToScalar, weierstrassEquation, isWithinCurveOrder } = weierstrassPoints({
        ...CURVE,
        toBytes(_c, point, isCompressed) {
          const a = point.toAffine();
          const x = Fp.toBytes(a.x);
          const cat = ut.concatBytes;
          if (isCompressed) {
            return cat(Uint8Array.from([point.hasEvenY() ? 2 : 3]), x);
          } else {
            return cat(Uint8Array.from([4]), x, Fp.toBytes(a.y));
          }
        },
        fromBytes(bytes2) {
          const len = bytes2.length;
          const head = bytes2[0];
          const tail = bytes2.subarray(1);
          if (len === compressedLen && (head === 2 || head === 3)) {
            const x = ut.bytesToNumberBE(tail);
            if (!isValidFieldElement(x))
              throw new Error("Point is not on curve");
            const y2 = weierstrassEquation(x);
            let y = Fp.sqrt(y2);
            const isYOdd = (y & _1n2) === _1n2;
            const isHeadOdd = (head & 1) === 1;
            if (isHeadOdd !== isYOdd)
              y = Fp.neg(y);
            return { x, y };
          } else if (len === uncompressedLen && head === 4) {
            const x = Fp.fromBytes(tail.subarray(0, Fp.BYTES));
            const y = Fp.fromBytes(tail.subarray(Fp.BYTES, 2 * Fp.BYTES));
            return { x, y };
          } else {
            throw new Error(`Point of length ${len} was invalid. Expected ${compressedLen} compressed bytes or ${uncompressedLen} uncompressed bytes`);
          }
        }
      });
      const numToNByteStr = (num) => ut.bytesToHex(ut.numberToBytesBE(num, CURVE.nByteLength));
      function isBiggerThanHalfOrder(number2) {
        const HALF = CURVE_ORDER >> _1n2;
        return number2 > HALF;
      }
      function normalizeS(s) {
        return isBiggerThanHalfOrder(s) ? modN(-s) : s;
      }
      const slcNum = (b, from, to) => ut.bytesToNumberBE(b.slice(from, to));
      class Signature {
        constructor(r, s, recovery) {
          this.r = r;
          this.s = s;
          this.recovery = recovery;
          this.assertValidity();
        }
        // pair (bytes of r, bytes of s)
        static fromCompact(hex) {
          const l = CURVE.nByteLength;
          hex = (0, utils_js_1.ensureBytes)("compactSignature", hex, l * 2);
          return new Signature(slcNum(hex, 0, l), slcNum(hex, l, 2 * l));
        }
        // DER encoded ECDSA signature
        // https://bitcoin.stackexchange.com/questions/57644/what-are-the-parts-of-a-bitcoin-transaction-input-script
        static fromDER(hex) {
          const { r, s } = exports.DER.toSig((0, utils_js_1.ensureBytes)("DER", hex));
          return new Signature(r, s);
        }
        assertValidity() {
          if (!isWithinCurveOrder(this.r))
            throw new Error("r must be 0 < r < CURVE.n");
          if (!isWithinCurveOrder(this.s))
            throw new Error("s must be 0 < s < CURVE.n");
        }
        addRecoveryBit(recovery) {
          return new Signature(this.r, this.s, recovery);
        }
        recoverPublicKey(msgHash) {
          const { r, s, recovery: rec } = this;
          const h = bits2int_modN((0, utils_js_1.ensureBytes)("msgHash", msgHash));
          if (rec == null || ![0, 1, 2, 3].includes(rec))
            throw new Error("recovery id invalid");
          const radj = rec === 2 || rec === 3 ? r + CURVE.n : r;
          if (radj >= Fp.ORDER)
            throw new Error("recovery id 2 or 3 invalid");
          const prefix = (rec & 1) === 0 ? "02" : "03";
          const R = Point.fromHex(prefix + numToNByteStr(radj));
          const ir = invN(radj);
          const u1 = modN(-h * ir);
          const u2 = modN(s * ir);
          const Q = Point.BASE.multiplyAndAddUnsafe(R, u1, u2);
          if (!Q)
            throw new Error("point at infinify");
          Q.assertValidity();
          return Q;
        }
        // Signatures should be low-s, to prevent malleability.
        hasHighS() {
          return isBiggerThanHalfOrder(this.s);
        }
        normalizeS() {
          return this.hasHighS() ? new Signature(this.r, modN(-this.s), this.recovery) : this;
        }
        // DER-encoded
        toDERRawBytes() {
          return ut.hexToBytes(this.toDERHex());
        }
        toDERHex() {
          return exports.DER.hexFromSig({ r: this.r, s: this.s });
        }
        // padded bytes of r, then padded bytes of s
        toCompactRawBytes() {
          return ut.hexToBytes(this.toCompactHex());
        }
        toCompactHex() {
          return numToNByteStr(this.r) + numToNByteStr(this.s);
        }
      }
      const utils = {
        isValidPrivateKey(privateKey) {
          try {
            normPrivateKeyToScalar(privateKey);
            return true;
          } catch (error) {
            return false;
          }
        },
        normPrivateKeyToScalar,
        /**
         * Produces cryptographically secure private key from random of size
         * (groupLen + ceil(groupLen / 2)) with modulo bias being negligible.
         */
        randomPrivateKey: () => {
          const length = mod.getMinHashLength(CURVE.n);
          return mod.mapHashToField(CURVE.randomBytes(length), CURVE.n);
        },
        /**
         * Creates precompute table for an arbitrary EC point. Makes point "cached".
         * Allows to massively speed-up `point.multiply(scalar)`.
         * @returns cached point
         * @example
         * const fast = utils.precompute(8, ProjectivePoint.fromHex(someonesPubKey));
         * fast.multiply(privKey); // much faster ECDH now
         */
        precompute(windowSize = 8, point = Point.BASE) {
          point._setWindowSize(windowSize);
          point.multiply(BigInt(3));
          return point;
        }
      };
      function getPublicKey(privateKey, isCompressed = true) {
        return Point.fromPrivateKey(privateKey).toRawBytes(isCompressed);
      }
      function isProbPub(item) {
        const arr = item instanceof Uint8Array;
        const str = typeof item === "string";
        const len = (arr || str) && item.length;
        if (arr)
          return len === compressedLen || len === uncompressedLen;
        if (str)
          return len === 2 * compressedLen || len === 2 * uncompressedLen;
        if (item instanceof Point)
          return true;
        return false;
      }
      function getSharedSecret(privateA, publicB, isCompressed = true) {
        if (isProbPub(privateA))
          throw new Error("first arg must be private key");
        if (!isProbPub(publicB))
          throw new Error("second arg must be public key");
        const b = Point.fromHex(publicB);
        return b.multiply(normPrivateKeyToScalar(privateA)).toRawBytes(isCompressed);
      }
      const bits2int = CURVE.bits2int || function(bytes2) {
        const num = ut.bytesToNumberBE(bytes2);
        const delta = bytes2.length * 8 - CURVE.nBitLength;
        return delta > 0 ? num >> BigInt(delta) : num;
      };
      const bits2int_modN = CURVE.bits2int_modN || function(bytes2) {
        return modN(bits2int(bytes2));
      };
      const ORDER_MASK = ut.bitMask(CURVE.nBitLength);
      function int2octets(num) {
        if (typeof num !== "bigint")
          throw new Error("bigint expected");
        if (!(_0n2 <= num && num < ORDER_MASK))
          throw new Error(`bigint expected < 2^${CURVE.nBitLength}`);
        return ut.numberToBytesBE(num, CURVE.nByteLength);
      }
      function prepSig(msgHash, privateKey, opts = defaultSigOpts) {
        if (["recovered", "canonical"].some((k) => k in opts))
          throw new Error("sign() legacy options not supported");
        const { hash: hash2, randomBytes } = CURVE;
        let { lowS, prehash, extraEntropy: ent } = opts;
        if (lowS == null)
          lowS = true;
        msgHash = (0, utils_js_1.ensureBytes)("msgHash", msgHash);
        if (prehash)
          msgHash = (0, utils_js_1.ensureBytes)("prehashed msgHash", hash2(msgHash));
        const h1int = bits2int_modN(msgHash);
        const d = normPrivateKeyToScalar(privateKey);
        const seedArgs = [int2octets(d), int2octets(h1int)];
        if (ent != null) {
          const e = ent === true ? randomBytes(Fp.BYTES) : ent;
          seedArgs.push((0, utils_js_1.ensureBytes)("extraEntropy", e));
        }
        const seed = ut.concatBytes(...seedArgs);
        const m = h1int;
        function k2sig(kBytes) {
          const k = bits2int(kBytes);
          if (!isWithinCurveOrder(k))
            return;
          const ik = invN(k);
          const q = Point.BASE.multiply(k).toAffine();
          const r = modN(q.x);
          if (r === _0n2)
            return;
          const s = modN(ik * modN(m + r * d));
          if (s === _0n2)
            return;
          let recovery = (q.x === r ? 0 : 2) | Number(q.y & _1n2);
          let normS = s;
          if (lowS && isBiggerThanHalfOrder(s)) {
            normS = normalizeS(s);
            recovery ^= 1;
          }
          return new Signature(r, normS, recovery);
        }
        return { seed, k2sig };
      }
      const defaultSigOpts = { lowS: CURVE.lowS, prehash: false };
      const defaultVerOpts = { lowS: CURVE.lowS, prehash: false };
      function sign(msgHash, privKey, opts = defaultSigOpts) {
        const { seed, k2sig } = prepSig(msgHash, privKey, opts);
        const C = CURVE;
        const drbg = ut.createHmacDrbg(C.hash.outputLen, C.nByteLength, C.hmac);
        return drbg(seed, k2sig);
      }
      Point.BASE._setWindowSize(8);
      function verify(signature, msgHash, publicKey, opts = defaultVerOpts) {
        const sg = signature;
        msgHash = (0, utils_js_1.ensureBytes)("msgHash", msgHash);
        publicKey = (0, utils_js_1.ensureBytes)("publicKey", publicKey);
        if ("strict" in opts)
          throw new Error("options.strict was renamed to lowS");
        const { lowS, prehash } = opts;
        let _sig = void 0;
        let P;
        try {
          if (typeof sg === "string" || sg instanceof Uint8Array) {
            try {
              _sig = Signature.fromDER(sg);
            } catch (derError) {
              if (!(derError instanceof exports.DER.Err))
                throw derError;
              _sig = Signature.fromCompact(sg);
            }
          } else if (typeof sg === "object" && typeof sg.r === "bigint" && typeof sg.s === "bigint") {
            const { r: r2, s: s2 } = sg;
            _sig = new Signature(r2, s2);
          } else {
            throw new Error("PARSE");
          }
          P = Point.fromHex(publicKey);
        } catch (error) {
          if (error.message === "PARSE")
            throw new Error(`signature must be Signature instance, Uint8Array or hex string`);
          return false;
        }
        if (lowS && _sig.hasHighS())
          return false;
        if (prehash)
          msgHash = CURVE.hash(msgHash);
        const { r, s } = _sig;
        const h = bits2int_modN(msgHash);
        const is = invN(s);
        const u1 = modN(h * is);
        const u2 = modN(r * is);
        const R = Point.BASE.multiplyAndAddUnsafe(P, u1, u2)?.toAffine();
        if (!R)
          return false;
        const v = modN(R.x);
        return v === r;
      }
      return {
        CURVE,
        getPublicKey,
        getSharedSecret,
        sign,
        verify,
        ProjectivePoint: Point,
        Signature,
        utils
      };
    }
    exports.weierstrass = weierstrass;
    function SWUFpSqrtRatio(Fp, Z) {
      const q = Fp.ORDER;
      let l = _0n2;
      for (let o = q - _1n2; o % _2n2 === _0n2; o /= _2n2)
        l += _1n2;
      const c1 = l;
      const _2n_pow_c1_1 = _2n2 << c1 - _1n2 - _1n2;
      const _2n_pow_c1 = _2n_pow_c1_1 * _2n2;
      const c2 = (q - _1n2) / _2n_pow_c1;
      const c3 = (c2 - _1n2) / _2n2;
      const c4 = _2n_pow_c1 - _1n2;
      const c5 = _2n_pow_c1_1;
      const c6 = Fp.pow(Z, c2);
      const c7 = Fp.pow(Z, (c2 + _1n2) / _2n2);
      let sqrtRatio = (u, v) => {
        let tv1 = c6;
        let tv2 = Fp.pow(v, c4);
        let tv3 = Fp.sqr(tv2);
        tv3 = Fp.mul(tv3, v);
        let tv5 = Fp.mul(u, tv3);
        tv5 = Fp.pow(tv5, c3);
        tv5 = Fp.mul(tv5, tv2);
        tv2 = Fp.mul(tv5, v);
        tv3 = Fp.mul(tv5, u);
        let tv4 = Fp.mul(tv3, tv2);
        tv5 = Fp.pow(tv4, c5);
        let isQR = Fp.eql(tv5, Fp.ONE);
        tv2 = Fp.mul(tv3, c7);
        tv5 = Fp.mul(tv4, tv1);
        tv3 = Fp.cmov(tv2, tv3, isQR);
        tv4 = Fp.cmov(tv5, tv4, isQR);
        for (let i = c1; i > _1n2; i--) {
          let tv52 = i - _2n2;
          tv52 = _2n2 << tv52 - _1n2;
          let tvv5 = Fp.pow(tv4, tv52);
          const e1 = Fp.eql(tvv5, Fp.ONE);
          tv2 = Fp.mul(tv3, tv1);
          tv1 = Fp.mul(tv1, tv1);
          tvv5 = Fp.mul(tv4, tv1);
          tv3 = Fp.cmov(tv2, tv3, e1);
          tv4 = Fp.cmov(tvv5, tv4, e1);
        }
        return { isValid: isQR, value: tv3 };
      };
      if (Fp.ORDER % _4n === _3n) {
        const c12 = (Fp.ORDER - _3n) / _4n;
        const c22 = Fp.sqrt(Fp.neg(Z));
        sqrtRatio = (u, v) => {
          let tv1 = Fp.sqr(v);
          const tv2 = Fp.mul(u, v);
          tv1 = Fp.mul(tv1, tv2);
          let y1 = Fp.pow(tv1, c12);
          y1 = Fp.mul(y1, tv2);
          const y2 = Fp.mul(y1, c22);
          const tv3 = Fp.mul(Fp.sqr(y1), v);
          const isQR = Fp.eql(tv3, u);
          let y = Fp.cmov(y2, y1, isQR);
          return { isValid: isQR, value: y };
        };
      }
      return sqrtRatio;
    }
    exports.SWUFpSqrtRatio = SWUFpSqrtRatio;
    function mapToCurveSimpleSWU(Fp, opts) {
      mod.validateField(Fp);
      if (!Fp.isValid(opts.A) || !Fp.isValid(opts.B) || !Fp.isValid(opts.Z))
        throw new Error("mapToCurveSimpleSWU: invalid opts");
      const sqrtRatio = SWUFpSqrtRatio(Fp, opts.Z);
      if (!Fp.isOdd)
        throw new Error("Fp.isOdd is not implemented!");
      return (u) => {
        let tv1, tv2, tv3, tv4, tv5, tv6, x, y;
        tv1 = Fp.sqr(u);
        tv1 = Fp.mul(tv1, opts.Z);
        tv2 = Fp.sqr(tv1);
        tv2 = Fp.add(tv2, tv1);
        tv3 = Fp.add(tv2, Fp.ONE);
        tv3 = Fp.mul(tv3, opts.B);
        tv4 = Fp.cmov(opts.Z, Fp.neg(tv2), !Fp.eql(tv2, Fp.ZERO));
        tv4 = Fp.mul(tv4, opts.A);
        tv2 = Fp.sqr(tv3);
        tv6 = Fp.sqr(tv4);
        tv5 = Fp.mul(tv6, opts.A);
        tv2 = Fp.add(tv2, tv5);
        tv2 = Fp.mul(tv2, tv3);
        tv6 = Fp.mul(tv6, tv4);
        tv5 = Fp.mul(tv6, opts.B);
        tv2 = Fp.add(tv2, tv5);
        x = Fp.mul(tv1, tv3);
        const { isValid, value } = sqrtRatio(tv2, tv6);
        y = Fp.mul(tv1, u);
        y = Fp.mul(y, value);
        x = Fp.cmov(x, tv3, isValid);
        y = Fp.cmov(y, value, isValid);
        const e1 = Fp.isOdd(u) === Fp.isOdd(y);
        y = Fp.cmov(Fp.neg(y), y, e1);
        x = Fp.div(x, tv4);
        return { x, y };
      };
    }
    exports.mapToCurveSimpleSWU = mapToCurveSimpleSWU;
  }
});

// node_modules/@noble/curves/abstract/hash-to-curve.js
var require_hash_to_curve = __commonJS({
  "node_modules/@noble/curves/abstract/hash-to-curve.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createHasher = exports.isogenyMap = exports.hash_to_field = exports.expand_message_xof = exports.expand_message_xmd = void 0;
    var modular_js_1 = require_modular();
    var utils_js_1 = require_utils6();
    function validateDST(dst) {
      if (dst instanceof Uint8Array)
        return dst;
      if (typeof dst === "string")
        return (0, utils_js_1.utf8ToBytes)(dst);
      throw new Error("DST must be Uint8Array or string");
    }
    var os2ip = utils_js_1.bytesToNumberBE;
    function i2osp(value, length) {
      if (value < 0 || value >= 1 << 8 * length) {
        throw new Error(`bad I2OSP call: value=${value} length=${length}`);
      }
      const res = Array.from({ length }).fill(0);
      for (let i = length - 1; i >= 0; i--) {
        res[i] = value & 255;
        value >>>= 8;
      }
      return new Uint8Array(res);
    }
    function strxor(a, b) {
      const arr = new Uint8Array(a.length);
      for (let i = 0; i < a.length; i++) {
        arr[i] = a[i] ^ b[i];
      }
      return arr;
    }
    function isBytes(item) {
      if (!(item instanceof Uint8Array))
        throw new Error("Uint8Array expected");
    }
    function isNum(item) {
      if (!Number.isSafeInteger(item))
        throw new Error("number expected");
    }
    function expand_message_xmd(msg, DST, lenInBytes, H) {
      isBytes(msg);
      isBytes(DST);
      isNum(lenInBytes);
      if (DST.length > 255)
        DST = H((0, utils_js_1.concatBytes)((0, utils_js_1.utf8ToBytes)("H2C-OVERSIZE-DST-"), DST));
      const { outputLen: b_in_bytes, blockLen: r_in_bytes } = H;
      const ell = Math.ceil(lenInBytes / b_in_bytes);
      if (ell > 255)
        throw new Error("Invalid xmd length");
      const DST_prime = (0, utils_js_1.concatBytes)(DST, i2osp(DST.length, 1));
      const Z_pad = i2osp(0, r_in_bytes);
      const l_i_b_str = i2osp(lenInBytes, 2);
      const b = new Array(ell);
      const b_0 = H((0, utils_js_1.concatBytes)(Z_pad, msg, l_i_b_str, i2osp(0, 1), DST_prime));
      b[0] = H((0, utils_js_1.concatBytes)(b_0, i2osp(1, 1), DST_prime));
      for (let i = 1; i <= ell; i++) {
        const args = [strxor(b_0, b[i - 1]), i2osp(i + 1, 1), DST_prime];
        b[i] = H((0, utils_js_1.concatBytes)(...args));
      }
      const pseudo_random_bytes = (0, utils_js_1.concatBytes)(...b);
      return pseudo_random_bytes.slice(0, lenInBytes);
    }
    exports.expand_message_xmd = expand_message_xmd;
    function expand_message_xof(msg, DST, lenInBytes, k, H) {
      isBytes(msg);
      isBytes(DST);
      isNum(lenInBytes);
      if (DST.length > 255) {
        const dkLen = Math.ceil(2 * k / 8);
        DST = H.create({ dkLen }).update((0, utils_js_1.utf8ToBytes)("H2C-OVERSIZE-DST-")).update(DST).digest();
      }
      if (lenInBytes > 65535 || DST.length > 255)
        throw new Error("expand_message_xof: invalid lenInBytes");
      return H.create({ dkLen: lenInBytes }).update(msg).update(i2osp(lenInBytes, 2)).update(DST).update(i2osp(DST.length, 1)).digest();
    }
    exports.expand_message_xof = expand_message_xof;
    function hash_to_field(msg, count, options) {
      (0, utils_js_1.validateObject)(options, {
        DST: "stringOrUint8Array",
        p: "bigint",
        m: "isSafeInteger",
        k: "isSafeInteger",
        hash: "hash"
      });
      const { p, k, m, hash: hash2, expand, DST: _DST } = options;
      isBytes(msg);
      isNum(count);
      const DST = validateDST(_DST);
      const log2p = p.toString(2).length;
      const L = Math.ceil((log2p + k) / 8);
      const len_in_bytes = count * m * L;
      let prb;
      if (expand === "xmd") {
        prb = expand_message_xmd(msg, DST, len_in_bytes, hash2);
      } else if (expand === "xof") {
        prb = expand_message_xof(msg, DST, len_in_bytes, k, hash2);
      } else if (expand === "_internal_pass") {
        prb = msg;
      } else {
        throw new Error('expand must be "xmd" or "xof"');
      }
      const u = new Array(count);
      for (let i = 0; i < count; i++) {
        const e = new Array(m);
        for (let j = 0; j < m; j++) {
          const elm_offset = L * (j + i * m);
          const tv = prb.subarray(elm_offset, elm_offset + L);
          e[j] = (0, modular_js_1.mod)(os2ip(tv), p);
        }
        u[i] = e;
      }
      return u;
    }
    exports.hash_to_field = hash_to_field;
    function isogenyMap(field, map) {
      const COEFF = map.map((i) => Array.from(i).reverse());
      return (x, y) => {
        const [xNum, xDen, yNum, yDen] = COEFF.map((val) => val.reduce((acc, i) => field.add(field.mul(acc, x), i)));
        x = field.div(xNum, xDen);
        y = field.mul(y, field.div(yNum, yDen));
        return { x, y };
      };
    }
    exports.isogenyMap = isogenyMap;
    function createHasher(Point, mapToCurve, def) {
      if (typeof mapToCurve !== "function")
        throw new Error("mapToCurve() must be defined");
      return {
        // Encodes byte string to elliptic curve.
        // hash_to_curve from https://www.rfc-editor.org/rfc/rfc9380#section-3
        hashToCurve(msg, options) {
          const u = hash_to_field(msg, 2, { ...def, DST: def.DST, ...options });
          const u0 = Point.fromAffine(mapToCurve(u[0]));
          const u1 = Point.fromAffine(mapToCurve(u[1]));
          const P = u0.add(u1).clearCofactor();
          P.assertValidity();
          return P;
        },
        // Encodes byte string to elliptic curve.
        // encode_to_curve from https://www.rfc-editor.org/rfc/rfc9380#section-3
        encodeToCurve(msg, options) {
          const u = hash_to_field(msg, 1, { ...def, DST: def.encodeDST, ...options });
          const P = Point.fromAffine(mapToCurve(u[0])).clearCofactor();
          P.assertValidity();
          return P;
        }
      };
    }
    exports.createHasher = createHasher;
  }
});

// node_modules/@noble/hashes/hmac.js
var require_hmac = __commonJS({
  "node_modules/@noble/hashes/hmac.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.hmac = exports.HMAC = void 0;
    var _assert_js_1 = require_assert();
    var utils_js_1 = require_utils3();
    var HMAC = class extends utils_js_1.Hash {
      constructor(hash2, _key) {
        super();
        this.finished = false;
        this.destroyed = false;
        (0, _assert_js_1.hash)(hash2);
        const key = (0, utils_js_1.toBytes)(_key);
        this.iHash = hash2.create();
        if (typeof this.iHash.update !== "function")
          throw new Error("Expected instance of class which extends utils.Hash");
        this.blockLen = this.iHash.blockLen;
        this.outputLen = this.iHash.outputLen;
        const blockLen = this.blockLen;
        const pad2 = new Uint8Array(blockLen);
        pad2.set(key.length > blockLen ? hash2.create().update(key).digest() : key);
        for (let i = 0; i < pad2.length; i++)
          pad2[i] ^= 54;
        this.iHash.update(pad2);
        this.oHash = hash2.create();
        for (let i = 0; i < pad2.length; i++)
          pad2[i] ^= 54 ^ 92;
        this.oHash.update(pad2);
        pad2.fill(0);
      }
      update(buf) {
        (0, _assert_js_1.exists)(this);
        this.iHash.update(buf);
        return this;
      }
      digestInto(out) {
        (0, _assert_js_1.exists)(this);
        (0, _assert_js_1.bytes)(out, this.outputLen);
        this.finished = true;
        this.iHash.digestInto(out);
        this.oHash.update(out);
        this.oHash.digestInto(out);
        this.destroy();
      }
      digest() {
        const out = new Uint8Array(this.oHash.outputLen);
        this.digestInto(out);
        return out;
      }
      _cloneInto(to) {
        to || (to = Object.create(Object.getPrototypeOf(this), {}));
        const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
        to = to;
        to.finished = finished;
        to.destroyed = destroyed;
        to.blockLen = blockLen;
        to.outputLen = outputLen;
        to.oHash = oHash._cloneInto(to.oHash);
        to.iHash = iHash._cloneInto(to.iHash);
        return to;
      }
      destroy() {
        this.destroyed = true;
        this.oHash.destroy();
        this.iHash.destroy();
      }
    };
    exports.HMAC = HMAC;
    var hmac = (hash2, key, message) => new HMAC(hash2, key).update(message).digest();
    exports.hmac = hmac;
    exports.hmac.create = (hash2, key) => new HMAC(hash2, key);
  }
});

// node_modules/@noble/curves/_shortw_utils.js
var require_shortw_utils = __commonJS({
  "node_modules/@noble/curves/_shortw_utils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createCurve = exports.getHash = void 0;
    var hmac_1 = require_hmac();
    var utils_1 = require_utils3();
    var weierstrass_js_1 = require_weierstrass();
    function getHash(hash2) {
      return {
        hash: hash2,
        hmac: (key, ...msgs) => (0, hmac_1.hmac)(hash2, key, (0, utils_1.concatBytes)(...msgs)),
        randomBytes: utils_1.randomBytes
      };
    }
    exports.getHash = getHash;
    function createCurve(curveDef, defHash) {
      const create = (hash2) => (0, weierstrass_js_1.weierstrass)({ ...curveDef, ...getHash(hash2) });
      return Object.freeze({ ...create(defHash), create });
    }
    exports.createCurve = createCurve;
  }
});

// node_modules/@noble/curves/secp256k1.js
var require_secp256k1 = __commonJS({
  "node_modules/@noble/curves/secp256k1.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.encodeToCurve = exports.hashToCurve = exports.schnorr = exports.secp256k1 = void 0;
    var sha256_1 = require_sha256();
    var utils_1 = require_utils3();
    var modular_js_1 = require_modular();
    var weierstrass_js_1 = require_weierstrass();
    var utils_js_1 = require_utils6();
    var hash_to_curve_js_1 = require_hash_to_curve();
    var _shortw_utils_js_1 = require_shortw_utils();
    var secp256k1P = BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f");
    var secp256k1N = BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141");
    var _1n2 = BigInt(1);
    var _2n2 = BigInt(2);
    var divNearest = (a, b) => (a + b / _2n2) / b;
    function sqrtMod(y) {
      const P = secp256k1P;
      const _3n = BigInt(3), _6n = BigInt(6), _11n = BigInt(11), _22n = BigInt(22);
      const _23n = BigInt(23), _44n = BigInt(44), _88n = BigInt(88);
      const b2 = y * y * y % P;
      const b3 = b2 * b2 * y % P;
      const b6 = (0, modular_js_1.pow2)(b3, _3n, P) * b3 % P;
      const b9 = (0, modular_js_1.pow2)(b6, _3n, P) * b3 % P;
      const b11 = (0, modular_js_1.pow2)(b9, _2n2, P) * b2 % P;
      const b22 = (0, modular_js_1.pow2)(b11, _11n, P) * b11 % P;
      const b44 = (0, modular_js_1.pow2)(b22, _22n, P) * b22 % P;
      const b88 = (0, modular_js_1.pow2)(b44, _44n, P) * b44 % P;
      const b176 = (0, modular_js_1.pow2)(b88, _88n, P) * b88 % P;
      const b220 = (0, modular_js_1.pow2)(b176, _44n, P) * b44 % P;
      const b223 = (0, modular_js_1.pow2)(b220, _3n, P) * b3 % P;
      const t1 = (0, modular_js_1.pow2)(b223, _23n, P) * b22 % P;
      const t2 = (0, modular_js_1.pow2)(t1, _6n, P) * b2 % P;
      const root = (0, modular_js_1.pow2)(t2, _2n2, P);
      if (!Fp.eql(Fp.sqr(root), y))
        throw new Error("Cannot find square root");
      return root;
    }
    var Fp = (0, modular_js_1.Field)(secp256k1P, void 0, void 0, { sqrt: sqrtMod });
    exports.secp256k1 = (0, _shortw_utils_js_1.createCurve)({
      a: BigInt(0),
      b: BigInt(7),
      Fp,
      n: secp256k1N,
      // Base point (x, y) aka generator point
      Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
      Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
      h: BigInt(1),
      lowS: true,
      /**
       * secp256k1 belongs to Koblitz curves: it has efficiently computable endomorphism.
       * Endomorphism uses 2x less RAM, speeds up precomputation by 2x and ECDH / key recovery by 20%.
       * For precomputed wNAF it trades off 1/2 init time & 1/3 ram for 20% perf hit.
       * Explanation: https://gist.github.com/paulmillr/eb670806793e84df628a7c434a873066
       */
      endo: {
        beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
        splitScalar: (k) => {
          const n = secp256k1N;
          const a1 = BigInt("0x3086d221a7d46bcde86c90e49284eb15");
          const b1 = -_1n2 * BigInt("0xe4437ed6010e88286f547fa90abfe4c3");
          const a2 = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8");
          const b2 = a1;
          const POW_2_128 = BigInt("0x100000000000000000000000000000000");
          const c1 = divNearest(b2 * k, n);
          const c2 = divNearest(-b1 * k, n);
          let k1 = (0, modular_js_1.mod)(k - c1 * a1 - c2 * a2, n);
          let k2 = (0, modular_js_1.mod)(-c1 * b1 - c2 * b2, n);
          const k1neg = k1 > POW_2_128;
          const k2neg = k2 > POW_2_128;
          if (k1neg)
            k1 = n - k1;
          if (k2neg)
            k2 = n - k2;
          if (k1 > POW_2_128 || k2 > POW_2_128) {
            throw new Error("splitScalar: Endomorphism failed, k=" + k);
          }
          return { k1neg, k1, k2neg, k2 };
        }
      }
    }, sha256_1.sha256);
    var _0n2 = BigInt(0);
    var fe = (x) => typeof x === "bigint" && _0n2 < x && x < secp256k1P;
    var ge = (x) => typeof x === "bigint" && _0n2 < x && x < secp256k1N;
    var TAGGED_HASH_PREFIXES = {};
    function taggedHash(tag, ...messages) {
      let tagP = TAGGED_HASH_PREFIXES[tag];
      if (tagP === void 0) {
        const tagH = (0, sha256_1.sha256)(Uint8Array.from(tag, (c) => c.charCodeAt(0)));
        tagP = (0, utils_js_1.concatBytes)(tagH, tagH);
        TAGGED_HASH_PREFIXES[tag] = tagP;
      }
      return (0, sha256_1.sha256)((0, utils_js_1.concatBytes)(tagP, ...messages));
    }
    var pointToBytes = (point) => point.toRawBytes(true).slice(1);
    var numTo32b = (n) => (0, utils_js_1.numberToBytesBE)(n, 32);
    var modP = (x) => (0, modular_js_1.mod)(x, secp256k1P);
    var modN = (x) => (0, modular_js_1.mod)(x, secp256k1N);
    var Point = exports.secp256k1.ProjectivePoint;
    var GmulAdd = (Q, a, b) => Point.BASE.multiplyAndAddUnsafe(Q, a, b);
    function schnorrGetExtPubKey(priv) {
      let d_ = exports.secp256k1.utils.normPrivateKeyToScalar(priv);
      let p = Point.fromPrivateKey(d_);
      const scalar = p.hasEvenY() ? d_ : modN(-d_);
      return { scalar, bytes: pointToBytes(p) };
    }
    function lift_x(x) {
      if (!fe(x))
        throw new Error("bad x: need 0 < x < p");
      const xx = modP(x * x);
      const c = modP(xx * x + BigInt(7));
      let y = sqrtMod(c);
      if (y % _2n2 !== _0n2)
        y = modP(-y);
      const p = new Point(x, y, _1n2);
      p.assertValidity();
      return p;
    }
    function challenge(...args) {
      return modN((0, utils_js_1.bytesToNumberBE)(taggedHash("BIP0340/challenge", ...args)));
    }
    function schnorrGetPublicKey(privateKey) {
      return schnorrGetExtPubKey(privateKey).bytes;
    }
    function schnorrSign(message, privateKey, auxRand = (0, utils_1.randomBytes)(32)) {
      const m = (0, utils_js_1.ensureBytes)("message", message);
      const { bytes: px, scalar: d } = schnorrGetExtPubKey(privateKey);
      const a = (0, utils_js_1.ensureBytes)("auxRand", auxRand, 32);
      const t = numTo32b(d ^ (0, utils_js_1.bytesToNumberBE)(taggedHash("BIP0340/aux", a)));
      const rand = taggedHash("BIP0340/nonce", t, px, m);
      const k_ = modN((0, utils_js_1.bytesToNumberBE)(rand));
      if (k_ === _0n2)
        throw new Error("sign failed: k is zero");
      const { bytes: rx, scalar: k } = schnorrGetExtPubKey(k_);
      const e = challenge(rx, px, m);
      const sig = new Uint8Array(64);
      sig.set(rx, 0);
      sig.set(numTo32b(modN(k + e * d)), 32);
      if (!schnorrVerify(sig, m, px))
        throw new Error("sign: Invalid signature produced");
      return sig;
    }
    function schnorrVerify(signature, message, publicKey) {
      const sig = (0, utils_js_1.ensureBytes)("signature", signature, 64);
      const m = (0, utils_js_1.ensureBytes)("message", message);
      const pub = (0, utils_js_1.ensureBytes)("publicKey", publicKey, 32);
      try {
        const P = lift_x((0, utils_js_1.bytesToNumberBE)(pub));
        const r = (0, utils_js_1.bytesToNumberBE)(sig.subarray(0, 32));
        if (!fe(r))
          return false;
        const s = (0, utils_js_1.bytesToNumberBE)(sig.subarray(32, 64));
        if (!ge(s))
          return false;
        const e = challenge(numTo32b(r), pointToBytes(P), m);
        const R = GmulAdd(P, s, modN(-e));
        if (!R || !R.hasEvenY() || R.toAffine().x !== r)
          return false;
        return true;
      } catch (error) {
        return false;
      }
    }
    exports.schnorr = (() => ({
      getPublicKey: schnorrGetPublicKey,
      sign: schnorrSign,
      verify: schnorrVerify,
      utils: {
        randomPrivateKey: exports.secp256k1.utils.randomPrivateKey,
        lift_x,
        pointToBytes,
        numberToBytesBE: utils_js_1.numberToBytesBE,
        bytesToNumberBE: utils_js_1.bytesToNumberBE,
        taggedHash,
        mod: modular_js_1.mod
      }
    }))();
    var isoMap = /* @__PURE__ */ (() => (0, hash_to_curve_js_1.isogenyMap)(Fp, [
      // xNum
      [
        "0x8e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38daaaaa8c7",
        "0x7d3d4c80bc321d5b9f315cea7fd44c5d595d2fc0bf63b92dfff1044f17c6581",
        "0x534c328d23f234e6e2a413deca25caece4506144037c40314ecbd0b53d9dd262",
        "0x8e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38daaaaa88c"
      ],
      // xDen
      [
        "0xd35771193d94918a9ca34ccbb7b640dd86cd409542f8487d9fe6b745781eb49b",
        "0xedadc6f64383dc1df7c4b2d51b54225406d36b641f5e41bbc52a56612a8c6d14",
        "0x0000000000000000000000000000000000000000000000000000000000000001"
        // LAST 1
      ],
      // yNum
      [
        "0x4bda12f684bda12f684bda12f684bda12f684bda12f684bda12f684b8e38e23c",
        "0xc75e0c32d5cb7c0fa9d0a54b12a0a6d5647ab046d686da6fdffc90fc201d71a3",
        "0x29a6194691f91a73715209ef6512e576722830a201be2018a765e85a9ecee931",
        "0x2f684bda12f684bda12f684bda12f684bda12f684bda12f684bda12f38e38d84"
      ],
      // yDen
      [
        "0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffff93b",
        "0x7a06534bb8bdb49fd5e9e6632722c2989467c1bfc8e8d978dfb425d2685c2573",
        "0x6484aa716545ca2cf3a70c3fa8fe337e0a3d21162f0d6299a7bf8192bfd2a76f",
        "0x0000000000000000000000000000000000000000000000000000000000000001"
        // LAST 1
      ]
    ].map((i) => i.map((j) => BigInt(j)))))();
    var mapSWU = /* @__PURE__ */ (() => (0, weierstrass_js_1.mapToCurveSimpleSWU)(Fp, {
      A: BigInt("0x3f8731abdd661adca08a5558f0f5d272e953d363cb6f0e5d405447c01a444533"),
      B: BigInt("1771"),
      Z: Fp.create(BigInt("-11"))
    }))();
    var htf = /* @__PURE__ */ (() => (0, hash_to_curve_js_1.createHasher)(exports.secp256k1.ProjectivePoint, (scalars) => {
      const { x, y } = mapSWU(Fp.create(scalars[0]));
      return isoMap(x, y);
    }, {
      DST: "secp256k1_XMD:SHA-256_SSWU_RO_",
      encodeDST: "secp256k1_XMD:SHA-256_SSWU_NU_",
      p: Fp.ORDER,
      m: 1,
      k: 128,
      expand: "xmd",
      hash: sha256_1.sha256
    }))();
    exports.hashToCurve = (() => htf.hashToCurve)();
    exports.encodeToCurve = (() => htf.encodeToCurve)();
  }
});

// node_modules/viem/_cjs/utils/signature/recoverPublicKey.js
var require_recoverPublicKey = __commonJS({
  "node_modules/viem/_cjs/utils/signature/recoverPublicKey.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.recoverPublicKey = void 0;
    var isHex_js_1 = require_isHex();
    var fromHex_js_1 = require_fromHex();
    var toHex_js_1 = require_toHex();
    async function recoverPublicKey({ hash: hash2, signature }) {
      const signatureHex = (0, isHex_js_1.isHex)(signature) ? signature : (0, toHex_js_1.toHex)(signature);
      const hashHex = (0, isHex_js_1.isHex)(hash2) ? hash2 : (0, toHex_js_1.toHex)(hash2);
      let v = (0, fromHex_js_1.hexToNumber)(`0x${signatureHex.slice(130)}`);
      if (v === 0 || v === 1)
        v += 27;
      const { secp256k1 } = await Promise.resolve().then(() => require_secp256k1());
      const publicKey = secp256k1.Signature.fromCompact(signatureHex.substring(2, 130)).addRecoveryBit(v - 27).recoverPublicKey(hashHex.substring(2)).toHex(false);
      return `0x${publicKey}`;
    }
    exports.recoverPublicKey = recoverPublicKey;
  }
});

// node_modules/viem/_cjs/utils/signature/recoverAddress.js
var require_recoverAddress = __commonJS({
  "node_modules/viem/_cjs/utils/signature/recoverAddress.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.recoverAddress = void 0;
    var publicKeyToAddress_js_1 = require_publicKeyToAddress();
    var recoverPublicKey_js_1 = require_recoverPublicKey();
    async function recoverAddress({ hash: hash2, signature }) {
      return (0, publicKeyToAddress_js_1.publicKeyToAddress)(await (0, recoverPublicKey_js_1.recoverPublicKey)({ hash: hash2, signature }));
    }
    exports.recoverAddress = recoverAddress;
  }
});

// node_modules/viem/_cjs/utils/signature/hashMessage.js
var require_hashMessage = __commonJS({
  "node_modules/viem/_cjs/utils/signature/hashMessage.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.hashMessage = void 0;
    var concat_js_1 = require_concat();
    var toBytes_js_1 = require_toBytes();
    var keccak256_js_1 = require_keccak256();
    function hashMessage(message, to_) {
      const messageBytes = (() => {
        if (typeof message === "string")
          return (0, toBytes_js_1.stringToBytes)(message);
        if (message.raw instanceof Uint8Array)
          return message.raw;
        return (0, toBytes_js_1.toBytes)(message.raw);
      })();
      const prefixBytes = (0, toBytes_js_1.stringToBytes)(`Ethereum Signed Message:
${messageBytes.length}`);
      return (0, keccak256_js_1.keccak256)((0, concat_js_1.concat)([prefixBytes, messageBytes]), to_);
    }
    exports.hashMessage = hashMessage;
  }
});

// node_modules/viem/_cjs/utils/signature/recoverMessageAddress.js
var require_recoverMessageAddress = __commonJS({
  "node_modules/viem/_cjs/utils/signature/recoverMessageAddress.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.recoverMessageAddress = void 0;
    var hashMessage_js_1 = require_hashMessage();
    var recoverAddress_js_1 = require_recoverAddress();
    async function recoverMessageAddress({ message, signature }) {
      return (0, recoverAddress_js_1.recoverAddress)({ hash: (0, hashMessage_js_1.hashMessage)(message), signature });
    }
    exports.recoverMessageAddress = recoverMessageAddress;
  }
});

// node_modules/viem/_cjs/utils/signature/recoverTypedDataAddress.js
var require_recoverTypedDataAddress = __commonJS({
  "node_modules/viem/_cjs/utils/signature/recoverTypedDataAddress.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.recoverTypedDataAddress = void 0;
    var hashTypedData_js_1 = require_hashTypedData();
    var recoverAddress_js_1 = require_recoverAddress();
    async function recoverTypedDataAddress({ domain, message, primaryType, signature, types }) {
      return (0, recoverAddress_js_1.recoverAddress)({
        hash: (0, hashTypedData_js_1.hashTypedData)({
          domain,
          message,
          primaryType,
          types
        }),
        signature
      });
    }
    exports.recoverTypedDataAddress = recoverTypedDataAddress;
  }
});

// node_modules/viem/_cjs/utils/signature/verifyMessage.js
var require_verifyMessage = __commonJS({
  "node_modules/viem/_cjs/utils/signature/verifyMessage.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.verifyMessage = void 0;
    var getAddress_js_1 = require_getAddress();
    var isAddressEqual_js_1 = require_isAddressEqual();
    var recoverMessageAddress_js_1 = require_recoverMessageAddress();
    async function verifyMessage({ address, message, signature }) {
      return (0, isAddressEqual_js_1.isAddressEqual)((0, getAddress_js_1.getAddress)(address), await (0, recoverMessageAddress_js_1.recoverMessageAddress)({ message, signature }));
    }
    exports.verifyMessage = verifyMessage;
  }
});

// node_modules/viem/_cjs/utils/signature/verifyTypedData.js
var require_verifyTypedData = __commonJS({
  "node_modules/viem/_cjs/utils/signature/verifyTypedData.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.verifyTypedData = void 0;
    var getAddress_js_1 = require_getAddress();
    var isAddressEqual_js_1 = require_isAddressEqual();
    var recoverTypedDataAddress_js_1 = require_recoverTypedDataAddress();
    async function verifyTypedData({ address, domain, message, primaryType, signature, types }) {
      return (0, isAddressEqual_js_1.isAddressEqual)((0, getAddress_js_1.getAddress)(address), await (0, recoverTypedDataAddress_js_1.recoverTypedDataAddress)({
        domain,
        message,
        primaryType,
        signature,
        types
      }));
    }
    exports.verifyTypedData = verifyTypedData;
  }
});

// node_modules/viem/_cjs/utils/transaction/getSerializedTransactionType.js
var require_getSerializedTransactionType = __commonJS({
  "node_modules/viem/_cjs/utils/transaction/getSerializedTransactionType.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getSerializedTransactionType = void 0;
    var transaction_js_1 = require_transaction();
    var slice_js_1 = require_slice();
    var fromHex_js_1 = require_fromHex();
    function getSerializedTransactionType(serializedTransaction) {
      const serializedType = (0, slice_js_1.sliceHex)(serializedTransaction, 0, 1);
      if (serializedType === "0x02")
        return "eip1559";
      if (serializedType === "0x01")
        return "eip2930";
      if (serializedType !== "0x" && (0, fromHex_js_1.hexToNumber)(serializedType) >= 192)
        return "legacy";
      throw new transaction_js_1.InvalidSerializedTransactionTypeError({ serializedType });
    }
    exports.getSerializedTransactionType = getSerializedTransactionType;
  }
});

// node_modules/viem/_cjs/utils/transaction/assertTransaction.js
var require_assertTransaction = __commonJS({
  "node_modules/viem/_cjs/utils/transaction/assertTransaction.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.assertTransactionLegacy = exports.assertTransactionEIP2930 = exports.assertTransactionEIP1559 = void 0;
    var address_js_1 = require_address();
    var base_js_1 = require_base();
    var chain_js_1 = require_chain();
    var node_js_1 = require_node();
    var isAddress_js_1 = require_isAddress();
    function assertTransactionEIP1559(transaction) {
      const { chainId, maxPriorityFeePerGas, gasPrice, maxFeePerGas, to } = transaction;
      if (chainId <= 0)
        throw new chain_js_1.InvalidChainIdError({ chainId });
      if (to && !(0, isAddress_js_1.isAddress)(to))
        throw new address_js_1.InvalidAddressError({ address: to });
      if (gasPrice)
        throw new base_js_1.BaseError("`gasPrice` is not a valid EIP-1559 Transaction attribute.");
      if (maxFeePerGas && maxFeePerGas > 2n ** 256n - 1n)
        throw new node_js_1.FeeCapTooHighError({ maxFeePerGas });
      if (maxPriorityFeePerGas && maxFeePerGas && maxPriorityFeePerGas > maxFeePerGas)
        throw new node_js_1.TipAboveFeeCapError({ maxFeePerGas, maxPriorityFeePerGas });
    }
    exports.assertTransactionEIP1559 = assertTransactionEIP1559;
    function assertTransactionEIP2930(transaction) {
      const { chainId, maxPriorityFeePerGas, gasPrice, maxFeePerGas, to } = transaction;
      if (chainId <= 0)
        throw new chain_js_1.InvalidChainIdError({ chainId });
      if (to && !(0, isAddress_js_1.isAddress)(to))
        throw new address_js_1.InvalidAddressError({ address: to });
      if (maxPriorityFeePerGas || maxFeePerGas)
        throw new base_js_1.BaseError("`maxFeePerGas`/`maxPriorityFeePerGas` is not a valid EIP-2930 Transaction attribute.");
      if (gasPrice && gasPrice > 2n ** 256n - 1n)
        throw new node_js_1.FeeCapTooHighError({ maxFeePerGas: gasPrice });
    }
    exports.assertTransactionEIP2930 = assertTransactionEIP2930;
    function assertTransactionLegacy(transaction) {
      const { chainId, maxPriorityFeePerGas, gasPrice, maxFeePerGas, to, accessList } = transaction;
      if (to && !(0, isAddress_js_1.isAddress)(to))
        throw new address_js_1.InvalidAddressError({ address: to });
      if (typeof chainId !== "undefined" && chainId <= 0)
        throw new chain_js_1.InvalidChainIdError({ chainId });
      if (maxPriorityFeePerGas || maxFeePerGas)
        throw new base_js_1.BaseError("`maxFeePerGas`/`maxPriorityFeePerGas` is not a valid Legacy Transaction attribute.");
      if (gasPrice && gasPrice > 2n ** 256n - 1n)
        throw new node_js_1.FeeCapTooHighError({ maxFeePerGas: gasPrice });
      if (accessList)
        throw new base_js_1.BaseError("`accessList` is not a valid Legacy Transaction attribute.");
    }
    exports.assertTransactionLegacy = assertTransactionLegacy;
  }
});

// node_modules/viem/_cjs/utils/transaction/parseTransaction.js
var require_parseTransaction = __commonJS({
  "node_modules/viem/_cjs/utils/transaction/parseTransaction.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseAccessList = exports.toTransactionArray = exports.parseTransaction = void 0;
    var address_js_1 = require_address();
    var transaction_js_1 = require_transaction();
    var isAddress_js_1 = require_isAddress();
    var isHex_js_1 = require_isHex();
    var pad_js_1 = require_pad();
    var trim_js_1 = require_trim();
    var fromHex_js_1 = require_fromHex();
    var fromRlp_js_1 = require_fromRlp();
    var isHash_js_1 = require_isHash();
    var assertTransaction_js_1 = require_assertTransaction();
    var getSerializedTransactionType_js_1 = require_getSerializedTransactionType();
    function parseTransaction(serializedTransaction) {
      const type = (0, getSerializedTransactionType_js_1.getSerializedTransactionType)(serializedTransaction);
      if (type === "eip1559")
        return parseTransactionEIP1559(serializedTransaction);
      if (type === "eip2930")
        return parseTransactionEIP2930(serializedTransaction);
      return parseTransactionLegacy(serializedTransaction);
    }
    exports.parseTransaction = parseTransaction;
    function parseTransactionEIP1559(serializedTransaction) {
      const transactionArray = toTransactionArray(serializedTransaction);
      const [chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gas, to, value, data, accessList, v, r, s] = transactionArray;
      if (!(transactionArray.length === 9 || transactionArray.length === 12))
        throw new transaction_js_1.InvalidSerializedTransactionError({
          attributes: {
            chainId,
            nonce,
            maxPriorityFeePerGas,
            maxFeePerGas,
            gas,
            to,
            value,
            data,
            accessList,
            ...transactionArray.length > 9 ? {
              v,
              r,
              s
            } : {}
          },
          serializedTransaction,
          type: "eip1559"
        });
      const transaction = {
        chainId: (0, fromHex_js_1.hexToNumber)(chainId),
        type: "eip1559"
      };
      if ((0, isHex_js_1.isHex)(to) && to !== "0x")
        transaction.to = to;
      if ((0, isHex_js_1.isHex)(gas) && gas !== "0x")
        transaction.gas = (0, fromHex_js_1.hexToBigInt)(gas);
      if ((0, isHex_js_1.isHex)(data) && data !== "0x")
        transaction.data = data;
      if ((0, isHex_js_1.isHex)(nonce) && nonce !== "0x")
        transaction.nonce = (0, fromHex_js_1.hexToNumber)(nonce);
      if ((0, isHex_js_1.isHex)(value) && value !== "0x")
        transaction.value = (0, fromHex_js_1.hexToBigInt)(value);
      if ((0, isHex_js_1.isHex)(maxFeePerGas) && maxFeePerGas !== "0x")
        transaction.maxFeePerGas = (0, fromHex_js_1.hexToBigInt)(maxFeePerGas);
      if ((0, isHex_js_1.isHex)(maxPriorityFeePerGas) && maxPriorityFeePerGas !== "0x")
        transaction.maxPriorityFeePerGas = (0, fromHex_js_1.hexToBigInt)(maxPriorityFeePerGas);
      if (accessList.length !== 0 && accessList !== "0x")
        transaction.accessList = parseAccessList(accessList);
      (0, assertTransaction_js_1.assertTransactionEIP1559)(transaction);
      const signature = transactionArray.length === 12 ? parseEIP155Signature(transactionArray) : void 0;
      return { ...signature, ...transaction };
    }
    function parseTransactionEIP2930(serializedTransaction) {
      const transactionArray = toTransactionArray(serializedTransaction);
      const [chainId, nonce, gasPrice, gas, to, value, data, accessList, v, r, s] = transactionArray;
      if (!(transactionArray.length === 8 || transactionArray.length === 11))
        throw new transaction_js_1.InvalidSerializedTransactionError({
          attributes: {
            chainId,
            nonce,
            gasPrice,
            gas,
            to,
            value,
            data,
            accessList,
            ...transactionArray.length > 8 ? {
              v,
              r,
              s
            } : {}
          },
          serializedTransaction,
          type: "eip2930"
        });
      const transaction = {
        chainId: (0, fromHex_js_1.hexToNumber)(chainId),
        type: "eip2930"
      };
      if ((0, isHex_js_1.isHex)(to) && to !== "0x")
        transaction.to = to;
      if ((0, isHex_js_1.isHex)(gas) && gas !== "0x")
        transaction.gas = (0, fromHex_js_1.hexToBigInt)(gas);
      if ((0, isHex_js_1.isHex)(data) && data !== "0x")
        transaction.data = data;
      if ((0, isHex_js_1.isHex)(nonce) && nonce !== "0x")
        transaction.nonce = (0, fromHex_js_1.hexToNumber)(nonce);
      if ((0, isHex_js_1.isHex)(value) && value !== "0x")
        transaction.value = (0, fromHex_js_1.hexToBigInt)(value);
      if ((0, isHex_js_1.isHex)(gasPrice) && gasPrice !== "0x")
        transaction.gasPrice = (0, fromHex_js_1.hexToBigInt)(gasPrice);
      if (accessList.length !== 0 && accessList !== "0x")
        transaction.accessList = parseAccessList(accessList);
      (0, assertTransaction_js_1.assertTransactionEIP2930)(transaction);
      const signature = transactionArray.length === 11 ? parseEIP155Signature(transactionArray) : void 0;
      return { ...signature, ...transaction };
    }
    function parseTransactionLegacy(serializedTransaction) {
      const transactionArray = (0, fromRlp_js_1.fromRlp)(serializedTransaction, "hex");
      const [nonce, gasPrice, gas, to, value, data, chainIdOrV_, r, s] = transactionArray;
      if (!(transactionArray.length === 6 || transactionArray.length === 9))
        throw new transaction_js_1.InvalidSerializedTransactionError({
          attributes: {
            nonce,
            gasPrice,
            gas,
            to,
            value,
            data,
            ...transactionArray.length > 6 ? {
              v: chainIdOrV_,
              r,
              s
            } : {}
          },
          serializedTransaction,
          type: "legacy"
        });
      const transaction = {
        type: "legacy"
      };
      if ((0, isHex_js_1.isHex)(to) && to !== "0x")
        transaction.to = to;
      if ((0, isHex_js_1.isHex)(gas) && gas !== "0x")
        transaction.gas = (0, fromHex_js_1.hexToBigInt)(gas);
      if ((0, isHex_js_1.isHex)(data) && data !== "0x")
        transaction.data = data;
      if ((0, isHex_js_1.isHex)(nonce) && nonce !== "0x")
        transaction.nonce = (0, fromHex_js_1.hexToNumber)(nonce);
      if ((0, isHex_js_1.isHex)(value) && value !== "0x")
        transaction.value = (0, fromHex_js_1.hexToBigInt)(value);
      if ((0, isHex_js_1.isHex)(gasPrice) && gasPrice !== "0x")
        transaction.gasPrice = (0, fromHex_js_1.hexToBigInt)(gasPrice);
      (0, assertTransaction_js_1.assertTransactionLegacy)(transaction);
      if (transactionArray.length === 6)
        return transaction;
      const chainIdOrV = (0, isHex_js_1.isHex)(chainIdOrV_) && chainIdOrV_ !== "0x" ? (0, fromHex_js_1.hexToBigInt)(chainIdOrV_) : 0n;
      if (s === "0x" && r === "0x") {
        if (chainIdOrV > 0)
          transaction.chainId = Number(chainIdOrV);
        return transaction;
      }
      const v = chainIdOrV;
      const chainId = Number((v - 35n) / 2n);
      if (chainId > 0)
        transaction.chainId = chainId;
      else if (v !== 27n && v !== 28n)
        throw new transaction_js_1.InvalidLegacyVError({ v });
      transaction.v = v;
      transaction.s = s;
      transaction.r = r;
      return transaction;
    }
    function toTransactionArray(serializedTransaction) {
      return (0, fromRlp_js_1.fromRlp)(`0x${serializedTransaction.slice(4)}`, "hex");
    }
    exports.toTransactionArray = toTransactionArray;
    function parseAccessList(accessList_) {
      const accessList = [];
      for (let i = 0; i < accessList_.length; i++) {
        const [address, storageKeys] = accessList_[i];
        if (!(0, isAddress_js_1.isAddress)(address))
          throw new address_js_1.InvalidAddressError({ address });
        accessList.push({
          address,
          storageKeys: storageKeys.map((key) => (0, isHash_js_1.isHash)(key) ? key : (0, trim_js_1.trim)(key))
        });
      }
      return accessList;
    }
    exports.parseAccessList = parseAccessList;
    function parseEIP155Signature(transactionArray) {
      const signature = transactionArray.slice(-3);
      const v = signature[0] === "0x" || (0, fromHex_js_1.hexToBigInt)(signature[0]) === 0n ? 27n : 28n;
      return {
        r: (0, pad_js_1.padHex)(signature[1], { size: 32 }),
        s: (0, pad_js_1.padHex)(signature[2], { size: 32 }),
        v,
        yParity: v === 27n ? 0 : 1
      };
    }
  }
});

// node_modules/viem/_cjs/utils/transaction/serializeAccessList.js
var require_serializeAccessList = __commonJS({
  "node_modules/viem/_cjs/utils/transaction/serializeAccessList.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.serializeAccessList = void 0;
    var address_js_1 = require_address();
    var transaction_js_1 = require_transaction();
    var isAddress_js_1 = require_isAddress();
    function serializeAccessList(accessList) {
      if (!accessList || accessList.length === 0)
        return [];
      const serializedAccessList = [];
      for (let i = 0; i < accessList.length; i++) {
        const { address, storageKeys } = accessList[i];
        for (let j = 0; j < storageKeys.length; j++) {
          if (storageKeys[j].length - 2 !== 64) {
            throw new transaction_js_1.InvalidStorageKeySizeError({ storageKey: storageKeys[j] });
          }
        }
        if (!(0, isAddress_js_1.isAddress)(address)) {
          throw new address_js_1.InvalidAddressError({ address });
        }
        serializedAccessList.push([address, storageKeys]);
      }
      return serializedAccessList;
    }
    exports.serializeAccessList = serializeAccessList;
  }
});

// node_modules/viem/_cjs/utils/transaction/serializeTransaction.js
var require_serializeTransaction = __commonJS({
  "node_modules/viem/_cjs/utils/transaction/serializeTransaction.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.serializeTransaction = void 0;
    var transaction_js_1 = require_transaction();
    var concat_js_1 = require_concat();
    var trim_js_1 = require_trim();
    var toHex_js_1 = require_toHex();
    var toRlp_js_1 = require_toRlp();
    var assertTransaction_js_1 = require_assertTransaction();
    var getTransactionType_js_1 = require_getTransactionType();
    var serializeAccessList_js_1 = require_serializeAccessList();
    function serializeTransaction(transaction, signature) {
      const type = (0, getTransactionType_js_1.getTransactionType)(transaction);
      if (type === "eip1559")
        return serializeTransactionEIP1559(transaction, signature);
      if (type === "eip2930")
        return serializeTransactionEIP2930(transaction, signature);
      return serializeTransactionLegacy(transaction, signature);
    }
    exports.serializeTransaction = serializeTransaction;
    function serializeTransactionEIP1559(transaction, signature) {
      const { chainId, gas, nonce, to, value, maxFeePerGas, maxPriorityFeePerGas, accessList, data } = transaction;
      (0, assertTransaction_js_1.assertTransactionEIP1559)(transaction);
      const serializedAccessList = (0, serializeAccessList_js_1.serializeAccessList)(accessList);
      const serializedTransaction = [
        (0, toHex_js_1.toHex)(chainId),
        nonce ? (0, toHex_js_1.toHex)(nonce) : "0x",
        maxPriorityFeePerGas ? (0, toHex_js_1.toHex)(maxPriorityFeePerGas) : "0x",
        maxFeePerGas ? (0, toHex_js_1.toHex)(maxFeePerGas) : "0x",
        gas ? (0, toHex_js_1.toHex)(gas) : "0x",
        to ?? "0x",
        value ? (0, toHex_js_1.toHex)(value) : "0x",
        data ?? "0x",
        serializedAccessList
      ];
      if (signature)
        serializedTransaction.push(signature.v === 27n ? "0x" : (0, toHex_js_1.toHex)(1), (0, trim_js_1.trim)(signature.r), (0, trim_js_1.trim)(signature.s));
      return (0, concat_js_1.concatHex)([
        "0x02",
        (0, toRlp_js_1.toRlp)(serializedTransaction)
      ]);
    }
    function serializeTransactionEIP2930(transaction, signature) {
      const { chainId, gas, data, nonce, to, value, accessList, gasPrice } = transaction;
      (0, assertTransaction_js_1.assertTransactionEIP2930)(transaction);
      const serializedAccessList = (0, serializeAccessList_js_1.serializeAccessList)(accessList);
      const serializedTransaction = [
        (0, toHex_js_1.toHex)(chainId),
        nonce ? (0, toHex_js_1.toHex)(nonce) : "0x",
        gasPrice ? (0, toHex_js_1.toHex)(gasPrice) : "0x",
        gas ? (0, toHex_js_1.toHex)(gas) : "0x",
        to ?? "0x",
        value ? (0, toHex_js_1.toHex)(value) : "0x",
        data ?? "0x",
        serializedAccessList
      ];
      if (signature)
        serializedTransaction.push(signature.v === 27n ? "0x" : (0, toHex_js_1.toHex)(1), signature.r, signature.s);
      return (0, concat_js_1.concatHex)([
        "0x01",
        (0, toRlp_js_1.toRlp)(serializedTransaction)
      ]);
    }
    function serializeTransactionLegacy(transaction, signature) {
      const { chainId = 0, gas, data, nonce, to, value, gasPrice } = transaction;
      (0, assertTransaction_js_1.assertTransactionLegacy)(transaction);
      let serializedTransaction = [
        nonce ? (0, toHex_js_1.toHex)(nonce) : "0x",
        gasPrice ? (0, toHex_js_1.toHex)(gasPrice) : "0x",
        gas ? (0, toHex_js_1.toHex)(gas) : "0x",
        to ?? "0x",
        value ? (0, toHex_js_1.toHex)(value) : "0x",
        data ?? "0x"
      ];
      if (signature) {
        let v = 27n + (signature.v === 27n ? 0n : 1n);
        if (chainId > 0)
          v = BigInt(chainId * 2) + BigInt(35n + signature.v - 27n);
        else if (signature.v !== v)
          throw new transaction_js_1.InvalidLegacyVError({ v: signature.v });
        serializedTransaction = [
          ...serializedTransaction,
          (0, toHex_js_1.toHex)(v),
          signature.r,
          signature.s
        ];
      } else if (chainId > 0) {
        serializedTransaction = [
          ...serializedTransaction,
          (0, toHex_js_1.toHex)(chainId),
          "0x",
          "0x"
        ];
      }
      return (0, toRlp_js_1.toRlp)(serializedTransaction);
    }
  }
});

// node_modules/viem/_cjs/utils/unit/parseUnits.js
var require_parseUnits = __commonJS({
  "node_modules/viem/_cjs/utils/unit/parseUnits.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseUnits = void 0;
    function parseUnits(value, decimals) {
      let [integer, fraction = "0"] = value.split(".");
      const negative = integer.startsWith("-");
      if (negative)
        integer = integer.slice(1);
      fraction = fraction.replace(/(0+)$/, "");
      if (decimals === 0) {
        if (Math.round(Number(`.${fraction}`)) === 1)
          integer = `${BigInt(integer) + 1n}`;
        fraction = "";
      } else if (fraction.length > decimals) {
        const [left, unit, right] = [
          fraction.slice(0, decimals - 1),
          fraction.slice(decimals - 1, decimals),
          fraction.slice(decimals)
        ];
        const rounded = Math.round(Number(`${unit}.${right}`));
        if (rounded > 9)
          fraction = `${BigInt(left) + BigInt(1)}0`.padStart(left.length + 1, "0");
        else
          fraction = `${left}${rounded}`;
        if (fraction.length > decimals) {
          fraction = fraction.slice(1);
          integer = `${BigInt(integer) + 1n}`;
        }
        fraction = fraction.slice(0, decimals);
      } else {
        fraction = fraction.padEnd(decimals, "0");
      }
      return BigInt(`${negative ? "-" : ""}${integer}${fraction}`);
    }
    exports.parseUnits = parseUnits;
  }
});

// node_modules/viem/_cjs/utils/unit/parseEther.js
var require_parseEther = __commonJS({
  "node_modules/viem/_cjs/utils/unit/parseEther.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseEther = void 0;
    var unit_js_1 = require_unit();
    var parseUnits_js_1 = require_parseUnits();
    function parseEther(ether, unit = "wei") {
      return (0, parseUnits_js_1.parseUnits)(ether, unit_js_1.etherUnits[unit]);
    }
    exports.parseEther = parseEther;
  }
});

// node_modules/viem/_cjs/utils/unit/parseGwei.js
var require_parseGwei = __commonJS({
  "node_modules/viem/_cjs/utils/unit/parseGwei.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseGwei = void 0;
    var unit_js_1 = require_unit();
    var parseUnits_js_1 = require_parseUnits();
    function parseGwei(ether, unit = "wei") {
      return (0, parseUnits_js_1.parseUnits)(ether, unit_js_1.gweiUnits[unit]);
    }
    exports.parseGwei = parseGwei;
  }
});

// node_modules/viem/_cjs/utils/index.js
var require_utils7 = __commonJS({
  "node_modules/viem/_cjs/utils/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.concatBytes = exports.concat = exports.extractFunctionParts = exports.extractFunctionType = exports.extractFunctionParams = exports.extractFunctionName = exports.isAddressEqual = exports.isAddress = exports.getAddress = exports.getCreate2Address = exports.getCreateAddress = exports.getContractAddress = exports.publicKeyToAddress = exports.parseAccount = exports.formatAbiParams = exports.formatAbiItem = exports.formatAbiItemWithArgs = exports.encodePacked = exports.parseAbiParameters = exports.parseAbiParameter = exports.parseAbiItem = exports.parseAbi = exports.getAbiItem = exports.encodeFunctionResult = exports.encodeFunctionData = exports.encodeEventTopics = exports.encodeErrorResult = exports.encodeDeployData = exports.encodeAbiParameters = exports.decodeFunctionResult = exports.decodeFunctionData = exports.decodeEventLog = exports.decodeErrorResult = exports.decodeAbiParameters = exports.validateTypedData = exports.stringify = exports.rpc = exports.getSocket = exports.integerRegex = exports.bytesRegex = exports.arrayRegex = exports.getChainContractAddress = exports.defineChain = exports.assertCurrentChain = exports.offchainLookupSignature = exports.offchainLookupAbiItem = exports.offchainLookup = exports.ccipFetch = exports.buildRequest = exports.isDeterministicError = void 0;
    exports.getTransactionError = exports.getEstimateGasError = exports.getContractError = exports.getCallError = exports.getNodeError = exports.containsNodeError = exports.fromRlp = exports.hexToString = exports.hexToNumber = exports.hexToBigInt = exports.hexToBool = exports.fromHex = exports.fromBytes = exports.bytesToString = exports.bytesToNumber = exports.bytesToBool = exports.bytesToBigint = exports.bytesToBigInt = exports.stringToHex = exports.numberToHex = exports.toHex = exports.bytesToHex = exports.boolToHex = exports.stringToBytes = exports.numberToBytes = exports.hexToBytes = exports.toBytes = exports.boolToBytes = exports.toRlp = exports.extract = exports.formatTransactionRequest = exports.defineTransactionRequest = exports.defineTransactionReceipt = exports.formatLog = exports.transactionType = exports.formatTransaction = exports.defineTransaction = exports.formatBlock = exports.defineBlock = exports.trim = exports.sliceHex = exports.sliceBytes = exports.slice = exports.size = exports.padHex = exports.padBytes = exports.pad = exports.isHex = exports.isBytes = exports.concatHex = void 0;
    exports.parseGwei = exports.parseEther = exports.parseUnits = exports.formatUnits = exports.formatGwei = exports.formatEther = exports.serializeAccessList = exports.serializeTransaction = exports.prepareTransactionRequest = exports.parseTransaction = exports.assertTransactionLegacy = exports.assertTransactionEIP2930 = exports.assertTransactionEIP1559 = exports.assertRequest = exports.getTransactionType = exports.getSerializedTransactionType = exports.hashMessage = exports.verifyTypedData = exports.verifyMessage = exports.recoverTypedDataAddress = exports.recoverPublicKey = exports.recoverMessageAddress = exports.recoverAddress = exports.hashTypedData = exports.keccak256 = exports.isHash = exports.getFunctionSelector = exports.getEventSelector = exports.defineFormatter = void 0;
    var buildRequest_js_1 = require_buildRequest();
    Object.defineProperty(exports, "isDeterministicError", { enumerable: true, get: function() {
      return buildRequest_js_1.isDeterministicError;
    } });
    Object.defineProperty(exports, "buildRequest", { enumerable: true, get: function() {
      return buildRequest_js_1.buildRequest;
    } });
    var ccip_js_1 = require_ccip2();
    Object.defineProperty(exports, "ccipFetch", { enumerable: true, get: function() {
      return ccip_js_1.ccipFetch;
    } });
    Object.defineProperty(exports, "offchainLookup", { enumerable: true, get: function() {
      return ccip_js_1.offchainLookup;
    } });
    Object.defineProperty(exports, "offchainLookupAbiItem", { enumerable: true, get: function() {
      return ccip_js_1.offchainLookupAbiItem;
    } });
    Object.defineProperty(exports, "offchainLookupSignature", { enumerable: true, get: function() {
      return ccip_js_1.offchainLookupSignature;
    } });
    var chain_js_1 = require_chain2();
    Object.defineProperty(exports, "assertCurrentChain", { enumerable: true, get: function() {
      return chain_js_1.assertCurrentChain;
    } });
    Object.defineProperty(exports, "defineChain", { enumerable: true, get: function() {
      return chain_js_1.defineChain;
    } });
    Object.defineProperty(exports, "getChainContractAddress", { enumerable: true, get: function() {
      return chain_js_1.getChainContractAddress;
    } });
    var regex_js_1 = require_regex2();
    Object.defineProperty(exports, "arrayRegex", { enumerable: true, get: function() {
      return regex_js_1.arrayRegex;
    } });
    Object.defineProperty(exports, "bytesRegex", { enumerable: true, get: function() {
      return regex_js_1.bytesRegex;
    } });
    Object.defineProperty(exports, "integerRegex", { enumerable: true, get: function() {
      return regex_js_1.integerRegex;
    } });
    var rpc_js_1 = require_rpc2();
    Object.defineProperty(exports, "getSocket", { enumerable: true, get: function() {
      return rpc_js_1.getSocket;
    } });
    Object.defineProperty(exports, "rpc", { enumerable: true, get: function() {
      return rpc_js_1.rpc;
    } });
    var stringify_js_1 = require_stringify();
    Object.defineProperty(exports, "stringify", { enumerable: true, get: function() {
      return stringify_js_1.stringify;
    } });
    var typedData_js_1 = require_typedData();
    Object.defineProperty(exports, "validateTypedData", { enumerable: true, get: function() {
      return typedData_js_1.validateTypedData;
    } });
    var decodeAbiParameters_js_1 = require_decodeAbiParameters();
    Object.defineProperty(exports, "decodeAbiParameters", { enumerable: true, get: function() {
      return decodeAbiParameters_js_1.decodeAbiParameters;
    } });
    var decodeErrorResult_js_1 = require_decodeErrorResult();
    Object.defineProperty(exports, "decodeErrorResult", { enumerable: true, get: function() {
      return decodeErrorResult_js_1.decodeErrorResult;
    } });
    var decodeEventLog_js_1 = require_decodeEventLog();
    Object.defineProperty(exports, "decodeEventLog", { enumerable: true, get: function() {
      return decodeEventLog_js_1.decodeEventLog;
    } });
    var decodeFunctionData_js_1 = require_decodeFunctionData();
    Object.defineProperty(exports, "decodeFunctionData", { enumerable: true, get: function() {
      return decodeFunctionData_js_1.decodeFunctionData;
    } });
    var decodeFunctionResult_js_1 = require_decodeFunctionResult();
    Object.defineProperty(exports, "decodeFunctionResult", { enumerable: true, get: function() {
      return decodeFunctionResult_js_1.decodeFunctionResult;
    } });
    var encodeAbiParameters_js_1 = require_encodeAbiParameters();
    Object.defineProperty(exports, "encodeAbiParameters", { enumerable: true, get: function() {
      return encodeAbiParameters_js_1.encodeAbiParameters;
    } });
    var encodeDeployData_js_1 = require_encodeDeployData();
    Object.defineProperty(exports, "encodeDeployData", { enumerable: true, get: function() {
      return encodeDeployData_js_1.encodeDeployData;
    } });
    var encodeErrorResult_js_1 = require_encodeErrorResult();
    Object.defineProperty(exports, "encodeErrorResult", { enumerable: true, get: function() {
      return encodeErrorResult_js_1.encodeErrorResult;
    } });
    var encodeEventTopics_js_1 = require_encodeEventTopics();
    Object.defineProperty(exports, "encodeEventTopics", { enumerable: true, get: function() {
      return encodeEventTopics_js_1.encodeEventTopics;
    } });
    var encodeFunctionData_js_1 = require_encodeFunctionData();
    Object.defineProperty(exports, "encodeFunctionData", { enumerable: true, get: function() {
      return encodeFunctionData_js_1.encodeFunctionData;
    } });
    var encodeFunctionResult_js_1 = require_encodeFunctionResult();
    Object.defineProperty(exports, "encodeFunctionResult", { enumerable: true, get: function() {
      return encodeFunctionResult_js_1.encodeFunctionResult;
    } });
    var getAbiItem_js_1 = require_getAbiItem();
    Object.defineProperty(exports, "getAbiItem", { enumerable: true, get: function() {
      return getAbiItem_js_1.getAbiItem;
    } });
    var abitype_1 = require_cjs2();
    Object.defineProperty(exports, "parseAbi", { enumerable: true, get: function() {
      return abitype_1.parseAbi;
    } });
    Object.defineProperty(exports, "parseAbiItem", { enumerable: true, get: function() {
      return abitype_1.parseAbiItem;
    } });
    Object.defineProperty(exports, "parseAbiParameter", { enumerable: true, get: function() {
      return abitype_1.parseAbiParameter;
    } });
    Object.defineProperty(exports, "parseAbiParameters", { enumerable: true, get: function() {
      return abitype_1.parseAbiParameters;
    } });
    var encodePacked_js_1 = require_encodePacked();
    Object.defineProperty(exports, "encodePacked", { enumerable: true, get: function() {
      return encodePacked_js_1.encodePacked;
    } });
    var formatAbiItemWithArgs_js_1 = require_formatAbiItemWithArgs();
    Object.defineProperty(exports, "formatAbiItemWithArgs", { enumerable: true, get: function() {
      return formatAbiItemWithArgs_js_1.formatAbiItemWithArgs;
    } });
    var formatAbiItem_js_1 = require_formatAbiItem2();
    Object.defineProperty(exports, "formatAbiItem", { enumerable: true, get: function() {
      return formatAbiItem_js_1.formatAbiItem;
    } });
    Object.defineProperty(exports, "formatAbiParams", { enumerable: true, get: function() {
      return formatAbiItem_js_1.formatAbiParams;
    } });
    var parseAccount_js_1 = require_parseAccount();
    Object.defineProperty(exports, "parseAccount", { enumerable: true, get: function() {
      return parseAccount_js_1.parseAccount;
    } });
    var publicKeyToAddress_js_1 = require_publicKeyToAddress();
    Object.defineProperty(exports, "publicKeyToAddress", { enumerable: true, get: function() {
      return publicKeyToAddress_js_1.publicKeyToAddress;
    } });
    var getContractAddress_js_1 = require_getContractAddress();
    Object.defineProperty(exports, "getContractAddress", { enumerable: true, get: function() {
      return getContractAddress_js_1.getContractAddress;
    } });
    Object.defineProperty(exports, "getCreateAddress", { enumerable: true, get: function() {
      return getContractAddress_js_1.getCreateAddress;
    } });
    Object.defineProperty(exports, "getCreate2Address", { enumerable: true, get: function() {
      return getContractAddress_js_1.getCreate2Address;
    } });
    var getAddress_js_1 = require_getAddress();
    Object.defineProperty(exports, "getAddress", { enumerable: true, get: function() {
      return getAddress_js_1.getAddress;
    } });
    var isAddress_js_1 = require_isAddress();
    Object.defineProperty(exports, "isAddress", { enumerable: true, get: function() {
      return isAddress_js_1.isAddress;
    } });
    var isAddressEqual_js_1 = require_isAddressEqual();
    Object.defineProperty(exports, "isAddressEqual", { enumerable: true, get: function() {
      return isAddressEqual_js_1.isAddressEqual;
    } });
    var extractFunctionParts_js_1 = require_extractFunctionParts();
    Object.defineProperty(exports, "extractFunctionName", { enumerable: true, get: function() {
      return extractFunctionParts_js_1.extractFunctionName;
    } });
    Object.defineProperty(exports, "extractFunctionParams", { enumerable: true, get: function() {
      return extractFunctionParts_js_1.extractFunctionParams;
    } });
    Object.defineProperty(exports, "extractFunctionType", { enumerable: true, get: function() {
      return extractFunctionParts_js_1.extractFunctionType;
    } });
    Object.defineProperty(exports, "extractFunctionParts", { enumerable: true, get: function() {
      return extractFunctionParts_js_1.extractFunctionParts;
    } });
    var concat_js_1 = require_concat();
    Object.defineProperty(exports, "concat", { enumerable: true, get: function() {
      return concat_js_1.concat;
    } });
    Object.defineProperty(exports, "concatBytes", { enumerable: true, get: function() {
      return concat_js_1.concatBytes;
    } });
    Object.defineProperty(exports, "concatHex", { enumerable: true, get: function() {
      return concat_js_1.concatHex;
    } });
    var isBytes_js_1 = require_isBytes();
    Object.defineProperty(exports, "isBytes", { enumerable: true, get: function() {
      return isBytes_js_1.isBytes;
    } });
    var isHex_js_1 = require_isHex();
    Object.defineProperty(exports, "isHex", { enumerable: true, get: function() {
      return isHex_js_1.isHex;
    } });
    var pad_js_1 = require_pad();
    Object.defineProperty(exports, "pad", { enumerable: true, get: function() {
      return pad_js_1.pad;
    } });
    Object.defineProperty(exports, "padBytes", { enumerable: true, get: function() {
      return pad_js_1.padBytes;
    } });
    Object.defineProperty(exports, "padHex", { enumerable: true, get: function() {
      return pad_js_1.padHex;
    } });
    var size_js_1 = require_size();
    Object.defineProperty(exports, "size", { enumerable: true, get: function() {
      return size_js_1.size;
    } });
    var slice_js_1 = require_slice();
    Object.defineProperty(exports, "slice", { enumerable: true, get: function() {
      return slice_js_1.slice;
    } });
    Object.defineProperty(exports, "sliceBytes", { enumerable: true, get: function() {
      return slice_js_1.sliceBytes;
    } });
    Object.defineProperty(exports, "sliceHex", { enumerable: true, get: function() {
      return slice_js_1.sliceHex;
    } });
    var trim_js_1 = require_trim();
    Object.defineProperty(exports, "trim", { enumerable: true, get: function() {
      return trim_js_1.trim;
    } });
    var block_js_1 = require_block2();
    Object.defineProperty(exports, "defineBlock", { enumerable: true, get: function() {
      return block_js_1.defineBlock;
    } });
    Object.defineProperty(exports, "formatBlock", { enumerable: true, get: function() {
      return block_js_1.formatBlock;
    } });
    var transaction_js_1 = require_transaction2();
    Object.defineProperty(exports, "defineTransaction", { enumerable: true, get: function() {
      return transaction_js_1.defineTransaction;
    } });
    Object.defineProperty(exports, "formatTransaction", { enumerable: true, get: function() {
      return transaction_js_1.formatTransaction;
    } });
    Object.defineProperty(exports, "transactionType", { enumerable: true, get: function() {
      return transaction_js_1.transactionType;
    } });
    var log_js_1 = require_log2();
    Object.defineProperty(exports, "formatLog", { enumerable: true, get: function() {
      return log_js_1.formatLog;
    } });
    var transactionReceipt_js_1 = require_transactionReceipt();
    Object.defineProperty(exports, "defineTransactionReceipt", { enumerable: true, get: function() {
      return transactionReceipt_js_1.defineTransactionReceipt;
    } });
    var transactionRequest_js_1 = require_transactionRequest();
    Object.defineProperty(exports, "defineTransactionRequest", { enumerable: true, get: function() {
      return transactionRequest_js_1.defineTransactionRequest;
    } });
    Object.defineProperty(exports, "formatTransactionRequest", { enumerable: true, get: function() {
      return transactionRequest_js_1.formatTransactionRequest;
    } });
    var extract_js_1 = require_extract();
    Object.defineProperty(exports, "extract", { enumerable: true, get: function() {
      return extract_js_1.extract;
    } });
    var toRlp_js_1 = require_toRlp();
    Object.defineProperty(exports, "toRlp", { enumerable: true, get: function() {
      return toRlp_js_1.toRlp;
    } });
    var toBytes_js_1 = require_toBytes();
    Object.defineProperty(exports, "boolToBytes", { enumerable: true, get: function() {
      return toBytes_js_1.boolToBytes;
    } });
    Object.defineProperty(exports, "toBytes", { enumerable: true, get: function() {
      return toBytes_js_1.toBytes;
    } });
    Object.defineProperty(exports, "hexToBytes", { enumerable: true, get: function() {
      return toBytes_js_1.hexToBytes;
    } });
    Object.defineProperty(exports, "numberToBytes", { enumerable: true, get: function() {
      return toBytes_js_1.numberToBytes;
    } });
    Object.defineProperty(exports, "stringToBytes", { enumerable: true, get: function() {
      return toBytes_js_1.stringToBytes;
    } });
    var toHex_js_1 = require_toHex();
    Object.defineProperty(exports, "boolToHex", { enumerable: true, get: function() {
      return toHex_js_1.boolToHex;
    } });
    Object.defineProperty(exports, "bytesToHex", { enumerable: true, get: function() {
      return toHex_js_1.bytesToHex;
    } });
    Object.defineProperty(exports, "toHex", { enumerable: true, get: function() {
      return toHex_js_1.toHex;
    } });
    Object.defineProperty(exports, "numberToHex", { enumerable: true, get: function() {
      return toHex_js_1.numberToHex;
    } });
    Object.defineProperty(exports, "stringToHex", { enumerable: true, get: function() {
      return toHex_js_1.stringToHex;
    } });
    var fromBytes_js_1 = require_fromBytes();
    Object.defineProperty(exports, "bytesToBigInt", { enumerable: true, get: function() {
      return fromBytes_js_1.bytesToBigInt;
    } });
    Object.defineProperty(exports, "bytesToBigint", { enumerable: true, get: function() {
      return fromBytes_js_1.bytesToBigInt;
    } });
    Object.defineProperty(exports, "bytesToBool", { enumerable: true, get: function() {
      return fromBytes_js_1.bytesToBool;
    } });
    Object.defineProperty(exports, "bytesToNumber", { enumerable: true, get: function() {
      return fromBytes_js_1.bytesToNumber;
    } });
    Object.defineProperty(exports, "bytesToString", { enumerable: true, get: function() {
      return fromBytes_js_1.bytesToString;
    } });
    Object.defineProperty(exports, "fromBytes", { enumerable: true, get: function() {
      return fromBytes_js_1.fromBytes;
    } });
    var fromHex_js_1 = require_fromHex();
    Object.defineProperty(exports, "fromHex", { enumerable: true, get: function() {
      return fromHex_js_1.fromHex;
    } });
    Object.defineProperty(exports, "hexToBool", { enumerable: true, get: function() {
      return fromHex_js_1.hexToBool;
    } });
    Object.defineProperty(exports, "hexToBigInt", { enumerable: true, get: function() {
      return fromHex_js_1.hexToBigInt;
    } });
    Object.defineProperty(exports, "hexToNumber", { enumerable: true, get: function() {
      return fromHex_js_1.hexToNumber;
    } });
    Object.defineProperty(exports, "hexToString", { enumerable: true, get: function() {
      return fromHex_js_1.hexToString;
    } });
    var fromRlp_js_1 = require_fromRlp();
    Object.defineProperty(exports, "fromRlp", { enumerable: true, get: function() {
      return fromRlp_js_1.fromRlp;
    } });
    var getNodeError_js_1 = require_getNodeError();
    Object.defineProperty(exports, "containsNodeError", { enumerable: true, get: function() {
      return getNodeError_js_1.containsNodeError;
    } });
    Object.defineProperty(exports, "getNodeError", { enumerable: true, get: function() {
      return getNodeError_js_1.getNodeError;
    } });
    var getCallError_js_1 = require_getCallError();
    Object.defineProperty(exports, "getCallError", { enumerable: true, get: function() {
      return getCallError_js_1.getCallError;
    } });
    var getContractError_js_1 = require_getContractError();
    Object.defineProperty(exports, "getContractError", { enumerable: true, get: function() {
      return getContractError_js_1.getContractError;
    } });
    var getEstimateGasError_js_1 = require_getEstimateGasError();
    Object.defineProperty(exports, "getEstimateGasError", { enumerable: true, get: function() {
      return getEstimateGasError_js_1.getEstimateGasError;
    } });
    var getTransactionError_js_1 = require_getTransactionError();
    Object.defineProperty(exports, "getTransactionError", { enumerable: true, get: function() {
      return getTransactionError_js_1.getTransactionError;
    } });
    var formatter_js_1 = require_formatter();
    Object.defineProperty(exports, "defineFormatter", { enumerable: true, get: function() {
      return formatter_js_1.defineFormatter;
    } });
    var getEventSelector_js_1 = require_getEventSelector();
    Object.defineProperty(exports, "getEventSelector", { enumerable: true, get: function() {
      return getEventSelector_js_1.getEventSelector;
    } });
    var getFunctionSelector_js_1 = require_getFunctionSelector();
    Object.defineProperty(exports, "getFunctionSelector", { enumerable: true, get: function() {
      return getFunctionSelector_js_1.getFunctionSelector;
    } });
    var isHash_js_1 = require_isHash();
    Object.defineProperty(exports, "isHash", { enumerable: true, get: function() {
      return isHash_js_1.isHash;
    } });
    var keccak256_js_1 = require_keccak256();
    Object.defineProperty(exports, "keccak256", { enumerable: true, get: function() {
      return keccak256_js_1.keccak256;
    } });
    var hashTypedData_js_1 = require_hashTypedData();
    Object.defineProperty(exports, "hashTypedData", { enumerable: true, get: function() {
      return hashTypedData_js_1.hashTypedData;
    } });
    var recoverAddress_js_1 = require_recoverAddress();
    Object.defineProperty(exports, "recoverAddress", { enumerable: true, get: function() {
      return recoverAddress_js_1.recoverAddress;
    } });
    var recoverMessageAddress_js_1 = require_recoverMessageAddress();
    Object.defineProperty(exports, "recoverMessageAddress", { enumerable: true, get: function() {
      return recoverMessageAddress_js_1.recoverMessageAddress;
    } });
    var recoverPublicKey_js_1 = require_recoverPublicKey();
    Object.defineProperty(exports, "recoverPublicKey", { enumerable: true, get: function() {
      return recoverPublicKey_js_1.recoverPublicKey;
    } });
    var recoverTypedDataAddress_js_1 = require_recoverTypedDataAddress();
    Object.defineProperty(exports, "recoverTypedDataAddress", { enumerable: true, get: function() {
      return recoverTypedDataAddress_js_1.recoverTypedDataAddress;
    } });
    var verifyMessage_js_1 = require_verifyMessage();
    Object.defineProperty(exports, "verifyMessage", { enumerable: true, get: function() {
      return verifyMessage_js_1.verifyMessage;
    } });
    var verifyTypedData_js_1 = require_verifyTypedData();
    Object.defineProperty(exports, "verifyTypedData", { enumerable: true, get: function() {
      return verifyTypedData_js_1.verifyTypedData;
    } });
    var hashMessage_js_1 = require_hashMessage();
    Object.defineProperty(exports, "hashMessage", { enumerable: true, get: function() {
      return hashMessage_js_1.hashMessage;
    } });
    var getSerializedTransactionType_js_1 = require_getSerializedTransactionType();
    Object.defineProperty(exports, "getSerializedTransactionType", { enumerable: true, get: function() {
      return getSerializedTransactionType_js_1.getSerializedTransactionType;
    } });
    var getTransactionType_js_1 = require_getTransactionType();
    Object.defineProperty(exports, "getTransactionType", { enumerable: true, get: function() {
      return getTransactionType_js_1.getTransactionType;
    } });
    var assertRequest_js_1 = require_assertRequest();
    Object.defineProperty(exports, "assertRequest", { enumerable: true, get: function() {
      return assertRequest_js_1.assertRequest;
    } });
    var assertTransaction_js_1 = require_assertTransaction();
    Object.defineProperty(exports, "assertTransactionEIP1559", { enumerable: true, get: function() {
      return assertTransaction_js_1.assertTransactionEIP1559;
    } });
    Object.defineProperty(exports, "assertTransactionEIP2930", { enumerable: true, get: function() {
      return assertTransaction_js_1.assertTransactionEIP2930;
    } });
    Object.defineProperty(exports, "assertTransactionLegacy", { enumerable: true, get: function() {
      return assertTransaction_js_1.assertTransactionLegacy;
    } });
    var parseTransaction_js_1 = require_parseTransaction();
    Object.defineProperty(exports, "parseTransaction", { enumerable: true, get: function() {
      return parseTransaction_js_1.parseTransaction;
    } });
    var prepareTransactionRequest_js_1 = require_prepareTransactionRequest();
    Object.defineProperty(exports, "prepareTransactionRequest", { enumerable: true, get: function() {
      return prepareTransactionRequest_js_1.prepareTransactionRequest;
    } });
    var serializeTransaction_js_1 = require_serializeTransaction();
    Object.defineProperty(exports, "serializeTransaction", { enumerable: true, get: function() {
      return serializeTransaction_js_1.serializeTransaction;
    } });
    var serializeAccessList_js_1 = require_serializeAccessList();
    Object.defineProperty(exports, "serializeAccessList", { enumerable: true, get: function() {
      return serializeAccessList_js_1.serializeAccessList;
    } });
    var formatEther_js_1 = require_formatEther();
    Object.defineProperty(exports, "formatEther", { enumerable: true, get: function() {
      return formatEther_js_1.formatEther;
    } });
    var formatGwei_js_1 = require_formatGwei();
    Object.defineProperty(exports, "formatGwei", { enumerable: true, get: function() {
      return formatGwei_js_1.formatGwei;
    } });
    var formatUnits_js_1 = require_formatUnits();
    Object.defineProperty(exports, "formatUnits", { enumerable: true, get: function() {
      return formatUnits_js_1.formatUnits;
    } });
    var parseUnits_js_1 = require_parseUnits();
    Object.defineProperty(exports, "parseUnits", { enumerable: true, get: function() {
      return parseUnits_js_1.parseUnits;
    } });
    var parseEther_js_1 = require_parseEther();
    Object.defineProperty(exports, "parseEther", { enumerable: true, get: function() {
      return parseEther_js_1.parseEther;
    } });
    var parseGwei_js_1 = require_parseGwei();
    Object.defineProperty(exports, "parseGwei", { enumerable: true, get: function() {
      return parseGwei_js_1.parseGwei;
    } });
  }
});

// node_modules/viem/_cjs/utils/formatters/proof.js
var require_proof = __commonJS({
  "node_modules/viem/_cjs/utils/formatters/proof.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.formatProof = void 0;
    var index_js_1 = require_utils7();
    function formatStorageProof(storageProof) {
      return storageProof.map((proof) => ({
        ...proof,
        value: BigInt(proof.value)
      }));
    }
    function formatProof(proof) {
      return {
        ...proof,
        balance: proof.balance ? BigInt(proof.balance) : void 0,
        nonce: proof.nonce ? (0, index_js_1.hexToNumber)(proof.nonce) : void 0,
        storageProof: proof.storageProof ? formatStorageProof(proof.storageProof) : void 0
      };
    }
    exports.formatProof = formatProof;
  }
});

// node_modules/viem/_cjs/actions/public/getProof.js
var require_getProof = __commonJS({
  "node_modules/viem/_cjs/actions/public/getProof.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getProof = void 0;
    var toHex_js_1 = require_toHex();
    var proof_js_1 = require_proof();
    async function getProof(client, { address, blockNumber, blockTag: blockTag_, storageKeys }) {
      const blockTag = blockTag_ ?? "latest";
      const blockNumberHex = blockNumber !== void 0 ? (0, toHex_js_1.numberToHex)(blockNumber) : void 0;
      const proof = await client.request({
        method: "eth_getProof",
        params: [address, storageKeys, blockNumberHex || blockTag]
      });
      return (0, proof_js_1.formatProof)(proof);
    }
    exports.getProof = getProof;
  }
});

// node_modules/viem/_cjs/actions/public/getStorageAt.js
var require_getStorageAt = __commonJS({
  "node_modules/viem/_cjs/actions/public/getStorageAt.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getStorageAt = void 0;
    var toHex_js_1 = require_toHex();
    async function getStorageAt(client, { address, blockNumber, blockTag = "latest", slot }) {
      const blockNumberHex = blockNumber !== void 0 ? (0, toHex_js_1.numberToHex)(blockNumber) : void 0;
      const data = await client.request({
        method: "eth_getStorageAt",
        params: [address, slot, blockNumberHex || blockTag]
      });
      return data;
    }
    exports.getStorageAt = getStorageAt;
  }
});

// node_modules/viem/_cjs/actions/public/getTransaction.js
var require_getTransaction = __commonJS({
  "node_modules/viem/_cjs/actions/public/getTransaction.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getTransaction = void 0;
    var transaction_js_1 = require_transaction();
    var toHex_js_1 = require_toHex();
    var transaction_js_2 = require_transaction2();
    async function getTransaction(client, { blockHash, blockNumber, blockTag: blockTag_, hash: hash2, index }) {
      const blockTag = blockTag_ || "latest";
      const blockNumberHex = blockNumber !== void 0 ? (0, toHex_js_1.numberToHex)(blockNumber) : void 0;
      let transaction = null;
      if (hash2) {
        transaction = await client.request({
          method: "eth_getTransactionByHash",
          params: [hash2]
        });
      } else if (blockHash) {
        transaction = await client.request({
          method: "eth_getTransactionByBlockHashAndIndex",
          params: [blockHash, (0, toHex_js_1.numberToHex)(index)]
        });
      } else if (blockNumberHex || blockTag) {
        transaction = await client.request({
          method: "eth_getTransactionByBlockNumberAndIndex",
          params: [blockNumberHex || blockTag, (0, toHex_js_1.numberToHex)(index)]
        });
      }
      if (!transaction)
        throw new transaction_js_1.TransactionNotFoundError({
          blockHash,
          blockNumber,
          blockTag,
          hash: hash2,
          index
        });
      const format = client.chain?.formatters?.transaction?.format || transaction_js_2.formatTransaction;
      return format(transaction);
    }
    exports.getTransaction = getTransaction;
  }
});

// node_modules/viem/_cjs/actions/public/getTransactionConfirmations.js
var require_getTransactionConfirmations = __commonJS({
  "node_modules/viem/_cjs/actions/public/getTransactionConfirmations.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getTransactionConfirmations = void 0;
    var getBlockNumber_js_1 = require_getBlockNumber();
    var getTransaction_js_1 = require_getTransaction();
    async function getTransactionConfirmations(client, { hash: hash2, transactionReceipt }) {
      const [blockNumber, transaction] = await Promise.all([
        (0, getBlockNumber_js_1.getBlockNumber)(client),
        hash2 ? (0, getTransaction_js_1.getTransaction)(client, { hash: hash2 }) : void 0
      ]);
      const transactionBlockNumber = transactionReceipt?.blockNumber || transaction?.blockNumber;
      if (!transactionBlockNumber)
        return 0n;
      return blockNumber - transactionBlockNumber + 1n;
    }
    exports.getTransactionConfirmations = getTransactionConfirmations;
  }
});

// node_modules/viem/_cjs/actions/public/getTransactionReceipt.js
var require_getTransactionReceipt = __commonJS({
  "node_modules/viem/_cjs/actions/public/getTransactionReceipt.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getTransactionReceipt = void 0;
    var transaction_js_1 = require_transaction();
    var transactionReceipt_js_1 = require_transactionReceipt();
    async function getTransactionReceipt(client, { hash: hash2 }) {
      const receipt = await client.request({
        method: "eth_getTransactionReceipt",
        params: [hash2]
      });
      if (!receipt)
        throw new transaction_js_1.TransactionReceiptNotFoundError({ hash: hash2 });
      const format = client.chain?.formatters?.transactionReceipt?.format || transactionReceipt_js_1.formatTransactionReceipt;
      return format(receipt);
    }
    exports.getTransactionReceipt = getTransactionReceipt;
  }
});

// node_modules/viem/_cjs/actions/public/multicall.js
var require_multicall = __commonJS({
  "node_modules/viem/_cjs/actions/public/multicall.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.multicall = void 0;
    var abis_js_1 = require_abis();
    var abi_js_1 = require_abi();
    var base_js_1 = require_base();
    var contract_js_1 = require_contract();
    var decodeFunctionResult_js_1 = require_decodeFunctionResult();
    var encodeFunctionData_js_1 = require_encodeFunctionData();
    var chain_js_1 = require_chain2();
    var getContractError_js_1 = require_getContractError();
    var readContract_js_1 = require_readContract();
    async function multicall(client, args) {
      const { allowFailure = true, batchSize: batchSize_, blockNumber, blockTag, contracts, multicallAddress: multicallAddress_ } = args;
      const batchSize = batchSize_ ?? (typeof client.batch?.multicall === "object" && client.batch.multicall.batchSize || 1024);
      let multicallAddress = multicallAddress_;
      if (!multicallAddress) {
        if (!client.chain)
          throw new Error("client chain not configured. multicallAddress is required.");
        multicallAddress = (0, chain_js_1.getChainContractAddress)({
          blockNumber,
          chain: client.chain,
          contract: "multicall3"
        });
      }
      const chunkedCalls = [[]];
      let currentChunk = 0;
      let currentChunkSize = 0;
      for (let i = 0; i < contracts.length; i++) {
        const { abi: abi2, address, args: args2, functionName } = contracts[i];
        try {
          const callData = (0, encodeFunctionData_js_1.encodeFunctionData)({
            abi: abi2,
            args: args2,
            functionName
          });
          currentChunkSize += (callData.length - 2) / 2;
          if (batchSize > 0 && currentChunkSize > batchSize && chunkedCalls[currentChunk].length > 0) {
            currentChunk++;
            currentChunkSize = (callData.length - 2) / 2;
            chunkedCalls[currentChunk] = [];
          }
          chunkedCalls[currentChunk] = [
            ...chunkedCalls[currentChunk],
            {
              allowFailure: true,
              callData,
              target: address
            }
          ];
        } catch (err) {
          const error = (0, getContractError_js_1.getContractError)(err, {
            abi: abi2,
            address,
            args: args2,
            docsPath: "/docs/contract/multicall",
            functionName
          });
          if (!allowFailure)
            throw error;
          chunkedCalls[currentChunk] = [
            ...chunkedCalls[currentChunk],
            {
              allowFailure: true,
              callData: "0x",
              target: address
            }
          ];
        }
      }
      const aggregate3Results = await Promise.allSettled(chunkedCalls.map((calls) => (0, readContract_js_1.readContract)(client, {
        abi: abis_js_1.multicall3Abi,
        address: multicallAddress,
        args: [calls],
        blockNumber,
        blockTag,
        functionName: "aggregate3"
      })));
      const results = [];
      for (let i = 0; i < aggregate3Results.length; i++) {
        const result = aggregate3Results[i];
        if (result.status === "rejected") {
          if (!allowFailure)
            throw result.reason;
          for (let j = 0; j < chunkedCalls[i].length; j++) {
            results.push({
              status: "failure",
              error: result.reason,
              result: void 0
            });
          }
          continue;
        }
        const aggregate3Result = result.value;
        for (let j = 0; j < aggregate3Result.length; j++) {
          const { returnData, success } = aggregate3Result[j];
          const { callData } = chunkedCalls[i][j];
          const { abi: abi2, address, functionName, args: args2 } = contracts[results.length];
          try {
            if (callData === "0x")
              throw new abi_js_1.AbiDecodingZeroDataError();
            if (!success)
              throw new contract_js_1.RawContractError({ data: returnData });
            const result2 = (0, decodeFunctionResult_js_1.decodeFunctionResult)({
              abi: abi2,
              args: args2,
              data: returnData,
              functionName
            });
            results.push(allowFailure ? { result: result2, status: "success" } : result2);
          } catch (err) {
            const error = (0, getContractError_js_1.getContractError)(err, {
              abi: abi2,
              address,
              args: args2,
              docsPath: "/docs/contract/multicall",
              functionName
            });
            if (!allowFailure)
              throw error;
            results.push({ error, result: void 0, status: "failure" });
          }
        }
      }
      if (results.length !== contracts.length)
        throw new base_js_1.BaseError("multicall results mismatch");
      return results;
    }
    exports.multicall = multicall;
  }
});

// node_modules/viem/_cjs/constants/contracts.js
var require_contracts = __commonJS({
  "node_modules/viem/_cjs/constants/contracts.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.universalSignatureValidatorByteCode = void 0;
    exports.universalSignatureValidatorByteCode = "0x60806040523480156200001157600080fd5b50604051620007003803806200070083398101604081905262000034916200056f565b6000620000438484846200004f565b9050806000526001601ff35b600080846001600160a01b0316803b806020016040519081016040528181526000908060200190933c90507f6492649264926492649264926492649264926492649264926492649264926492620000a68462000451565b036200021f57600060608085806020019051810190620000c79190620005ce565b8651929550909350915060000362000192576000836001600160a01b031683604051620000f5919062000643565b6000604051808303816000865af19150503d806000811462000134576040519150601f19603f3d011682016040523d82523d6000602084013e62000139565b606091505b5050905080620001905760405162461bcd60e51b815260206004820152601e60248201527f5369676e617475726556616c696461746f723a206465706c6f796d656e74000060448201526064015b60405180910390fd5b505b604051630b135d3f60e11b808252906001600160a01b038a1690631626ba7e90620001c4908b90869060040162000661565b602060405180830381865afa158015620001e2573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906200020891906200069d565b6001600160e01b031916149450505050506200044a565b805115620002b157604051630b135d3f60e11b808252906001600160a01b03871690631626ba7e9062000259908890889060040162000661565b602060405180830381865afa15801562000277573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906200029d91906200069d565b6001600160e01b031916149150506200044a565b8251604114620003195760405162461bcd60e51b815260206004820152603a6024820152600080516020620006e083398151915260448201527f3a20696e76616c6964207369676e6174757265206c656e677468000000000000606482015260840162000187565b620003236200046b565b506020830151604080850151855186939260009185919081106200034b576200034b620006c9565b016020015160f81c9050601b81148015906200036b57508060ff16601c14155b15620003cf5760405162461bcd60e51b815260206004820152603b6024820152600080516020620006e083398151915260448201527f3a20696e76616c6964207369676e617475726520762076616c75650000000000606482015260840162000187565b6040805160008152602081018083528a905260ff83169181019190915260608101849052608081018390526001600160a01b038a169060019060a0016020604051602081039080840390855afa1580156200042e573d6000803e3d6000fd5b505050602060405103516001600160a01b031614955050505050505b9392505050565b60006020825110156200046357600080fd5b508051015190565b60405180606001604052806003906020820280368337509192915050565b6001600160a01b03811681146200049f57600080fd5b50565b634e487b7160e01b600052604160045260246000fd5b60005b83811015620004d5578181015183820152602001620004bb565b50506000910152565b600082601f830112620004f057600080fd5b81516001600160401b03808211156200050d576200050d620004a2565b604051601f8301601f19908116603f01168101908282118183101715620005385762000538620004a2565b816040528381528660208588010111156200055257600080fd5b62000565846020830160208901620004b8565b9695505050505050565b6000806000606084860312156200058557600080fd5b8351620005928162000489565b6020850151604086015191945092506001600160401b03811115620005b657600080fd5b620005c486828701620004de565b9150509250925092565b600080600060608486031215620005e457600080fd5b8351620005f18162000489565b60208501519093506001600160401b03808211156200060f57600080fd5b6200061d87838801620004de565b935060408601519150808211156200063457600080fd5b50620005c486828701620004de565b6000825162000657818460208701620004b8565b9190910192915050565b828152604060208201526000825180604084015262000688816060850160208701620004b8565b601f01601f1916919091016060019392505050565b600060208284031215620006b057600080fd5b81516001600160e01b0319811681146200044a57600080fd5b634e487b7160e01b600052603260045260246000fdfe5369676e617475726556616c696461746f72237265636f7665725369676e6572";
  }
});

// node_modules/viem/_cjs/utils/data/isBytesEqual.js
var require_isBytesEqual = __commonJS({
  "node_modules/viem/_cjs/utils/data/isBytesEqual.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isBytesEqual = void 0;
    var utils_1 = require_utils6();
    var toBytes_js_1 = require_toBytes();
    var isHex_js_1 = require_isHex();
    function isBytesEqual(a_, b_) {
      const a = (0, isHex_js_1.isHex)(a_) ? (0, toBytes_js_1.toBytes)(a_) : a_;
      const b = (0, isHex_js_1.isHex)(b_) ? (0, toBytes_js_1.toBytes)(b_) : b_;
      return (0, utils_1.equalBytes)(a, b);
    }
    exports.isBytesEqual = isBytesEqual;
  }
});

// node_modules/viem/_cjs/actions/public/verifyHash.js
var require_verifyHash = __commonJS({
  "node_modules/viem/_cjs/actions/public/verifyHash.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.verifyHash = void 0;
    var abis_js_1 = require_abis();
    var contracts_js_1 = require_contracts();
    var contract_js_1 = require_contract();
    var isBytesEqual_js_1 = require_isBytesEqual();
    var index_js_1 = require_utils7();
    var call_js_1 = require_call();
    async function verifyHash(client, { address, hash: hash2, signature, ...callRequest }) {
      const signatureHex = (0, index_js_1.isHex)(signature) ? signature : (0, index_js_1.toHex)(signature);
      try {
        const { data } = await (0, call_js_1.call)(client, {
          data: (0, index_js_1.encodeDeployData)({
            abi: abis_js_1.universalSignatureValidatorAbi,
            args: [address, hash2, signatureHex],
            bytecode: contracts_js_1.universalSignatureValidatorByteCode
          }),
          ...callRequest
        });
        return (0, isBytesEqual_js_1.isBytesEqual)(data ?? "0x0", "0x1");
      } catch (error) {
        if (error instanceof contract_js_1.CallExecutionError) {
          return false;
        }
        throw error;
      }
    }
    exports.verifyHash = verifyHash;
  }
});

// node_modules/viem/_cjs/actions/public/verifyMessage.js
var require_verifyMessage2 = __commonJS({
  "node_modules/viem/_cjs/actions/public/verifyMessage.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.verifyMessage = void 0;
    var index_js_1 = require_utils7();
    var verifyHash_js_1 = require_verifyHash();
    async function verifyMessage(client, { address, message, signature, ...callRequest }) {
      const hash2 = (0, index_js_1.hashMessage)(message);
      return (0, verifyHash_js_1.verifyHash)(client, {
        address,
        hash: hash2,
        signature,
        ...callRequest
      });
    }
    exports.verifyMessage = verifyMessage;
  }
});

// node_modules/viem/_cjs/actions/public/verifyTypedData.js
var require_verifyTypedData2 = __commonJS({
  "node_modules/viem/_cjs/actions/public/verifyTypedData.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.verifyTypedData = void 0;
    var hashTypedData_js_1 = require_hashTypedData();
    var verifyHash_js_1 = require_verifyHash();
    async function verifyTypedData(client, { address, signature, message, primaryType, types, domain, ...callRequest }) {
      const hash2 = (0, hashTypedData_js_1.hashTypedData)({ message, primaryType, types, domain });
      return (0, verifyHash_js_1.verifyHash)(client, {
        address,
        hash: hash2,
        signature,
        ...callRequest
      });
    }
    exports.verifyTypedData = verifyTypedData;
  }
});

// node_modules/viem/_cjs/actions/public/watchBlockNumber.js
var require_watchBlockNumber = __commonJS({
  "node_modules/viem/_cjs/actions/public/watchBlockNumber.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.watchBlockNumber = void 0;
    var fromHex_js_1 = require_fromHex();
    var observe_js_1 = require_observe();
    var poll_js_1 = require_poll();
    var stringify_js_1 = require_stringify();
    var getBlockNumber_js_1 = require_getBlockNumber();
    function watchBlockNumber(client, { emitOnBegin = false, emitMissed = false, onBlockNumber, onError, poll: poll_, pollingInterval = client.pollingInterval }) {
      const enablePolling = typeof poll_ !== "undefined" ? poll_ : client.transport.type !== "webSocket";
      let prevBlockNumber;
      const pollBlockNumber = () => {
        const observerId = (0, stringify_js_1.stringify)([
          "watchBlockNumber",
          client.uid,
          emitOnBegin,
          emitMissed,
          pollingInterval
        ]);
        return (0, observe_js_1.observe)(observerId, { onBlockNumber, onError }, (emit) => (0, poll_js_1.poll)(async () => {
          try {
            const blockNumber = await (0, getBlockNumber_js_1.getBlockNumber)(client, { cacheTime: 0 });
            if (prevBlockNumber) {
              if (blockNumber === prevBlockNumber)
                return;
              if (blockNumber - prevBlockNumber > 1 && emitMissed) {
                for (let i = prevBlockNumber + 1n; i < blockNumber; i++) {
                  emit.onBlockNumber(i, prevBlockNumber);
                  prevBlockNumber = i;
                }
              }
            }
            if (!prevBlockNumber || blockNumber > prevBlockNumber) {
              emit.onBlockNumber(blockNumber, prevBlockNumber);
              prevBlockNumber = blockNumber;
            }
          } catch (err) {
            emit.onError?.(err);
          }
        }, {
          emitOnBegin,
          interval: pollingInterval
        }));
      };
      const subscribeBlockNumber = () => {
        let active = true;
        let unsubscribe = () => active = false;
        (async () => {
          try {
            const { unsubscribe: unsubscribe_ } = await client.transport.subscribe({
              params: ["newHeads"],
              onData(data) {
                if (!active)
                  return;
                const blockNumber = (0, fromHex_js_1.hexToBigInt)(data.result?.number);
                onBlockNumber(blockNumber, prevBlockNumber);
                prevBlockNumber = blockNumber;
              },
              onError(error) {
                onError?.(error);
              }
            });
            unsubscribe = unsubscribe_;
            if (!active)
              unsubscribe();
          } catch (err) {
            onError?.(err);
          }
        })();
        return unsubscribe;
      };
      return enablePolling ? pollBlockNumber() : subscribeBlockNumber();
    }
    exports.watchBlockNumber = watchBlockNumber;
  }
});

// node_modules/viem/_cjs/actions/public/waitForTransactionReceipt.js
var require_waitForTransactionReceipt = __commonJS({
  "node_modules/viem/_cjs/actions/public/waitForTransactionReceipt.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.waitForTransactionReceipt = void 0;
    var transaction_js_1 = require_transaction();
    var observe_js_1 = require_observe();
    var withRetry_js_1 = require_withRetry();
    var stringify_js_1 = require_stringify();
    var getBlock_js_1 = require_getBlock();
    var getTransaction_js_1 = require_getTransaction();
    var getTransactionReceipt_js_1 = require_getTransactionReceipt();
    var watchBlockNumber_js_1 = require_watchBlockNumber();
    async function waitForTransactionReceipt(client, { confirmations = 1, hash: hash2, onReplaced, pollingInterval = client.pollingInterval, timeout }) {
      const observerId = (0, stringify_js_1.stringify)(["waitForTransactionReceipt", client.uid, hash2]);
      let transaction;
      let replacedTransaction;
      let receipt;
      let retrying = false;
      return new Promise((resolve, reject) => {
        if (timeout)
          setTimeout(() => reject(new transaction_js_1.WaitForTransactionReceiptTimeoutError({ hash: hash2 })), timeout);
        const _unobserve = (0, observe_js_1.observe)(observerId, { onReplaced, resolve, reject }, (emit) => {
          const _unwatch = (0, watchBlockNumber_js_1.watchBlockNumber)(client, {
            emitMissed: true,
            emitOnBegin: true,
            poll: true,
            pollingInterval,
            async onBlockNumber(blockNumber_) {
              if (retrying)
                return;
              let blockNumber = blockNumber_;
              const done = (fn) => {
                _unwatch();
                fn();
                _unobserve();
              };
              try {
                if (receipt) {
                  if (confirmations > 1 && (!receipt.blockNumber || blockNumber - receipt.blockNumber + 1n < confirmations))
                    return;
                  done(() => emit.resolve(receipt));
                  return;
                }
                if (!transaction) {
                  retrying = true;
                  await (0, withRetry_js_1.withRetry)(async () => {
                    transaction = await (0, getTransaction_js_1.getTransaction)(client, { hash: hash2 });
                    if (transaction.blockNumber)
                      blockNumber = transaction.blockNumber;
                  }, {
                    delay: ({ count }) => ~~(1 << count) * 200,
                    retryCount: 6
                  });
                  retrying = false;
                }
                receipt = await (0, getTransactionReceipt_js_1.getTransactionReceipt)(client, { hash: hash2 });
                if (confirmations > 1 && (!receipt.blockNumber || blockNumber - receipt.blockNumber + 1n < confirmations))
                  return;
                done(() => emit.resolve(receipt));
              } catch (err) {
                if (transaction && (err instanceof transaction_js_1.TransactionNotFoundError || err instanceof transaction_js_1.TransactionReceiptNotFoundError)) {
                  try {
                    replacedTransaction = transaction;
                    const block = await (0, getBlock_js_1.getBlock)(client, {
                      blockNumber,
                      includeTransactions: true
                    });
                    const replacementTransaction = block.transactions.find(({ from, nonce }) => from === replacedTransaction.from && nonce === replacedTransaction.nonce);
                    if (!replacementTransaction)
                      return;
                    receipt = await (0, getTransactionReceipt_js_1.getTransactionReceipt)(client, {
                      hash: replacementTransaction.hash
                    });
                    if (confirmations > 1 && (!receipt.blockNumber || blockNumber - receipt.blockNumber + 1n < confirmations))
                      return;
                    let reason = "replaced";
                    if (replacementTransaction.to === replacedTransaction.to && replacementTransaction.value === replacedTransaction.value) {
                      reason = "repriced";
                    } else if (replacementTransaction.from === replacementTransaction.to && replacementTransaction.value === 0n) {
                      reason = "cancelled";
                    }
                    done(() => {
                      emit.onReplaced?.({
                        reason,
                        replacedTransaction,
                        transaction: replacementTransaction,
                        transactionReceipt: receipt
                      });
                      emit.resolve(receipt);
                    });
                  } catch (err_) {
                    done(() => emit.reject(err_));
                  }
                } else {
                  done(() => emit.reject(err));
                }
              }
            }
          });
        });
      });
    }
    exports.waitForTransactionReceipt = waitForTransactionReceipt;
  }
});

// node_modules/viem/_cjs/actions/public/watchBlocks.js
var require_watchBlocks = __commonJS({
  "node_modules/viem/_cjs/actions/public/watchBlocks.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.watchBlocks = void 0;
    var block_js_1 = require_block2();
    var observe_js_1 = require_observe();
    var poll_js_1 = require_poll();
    var stringify_js_1 = require_stringify();
    var getBlock_js_1 = require_getBlock();
    function watchBlocks(client, { blockTag = "latest", emitMissed = false, emitOnBegin = false, onBlock, onError, includeTransactions: includeTransactions_, poll: poll_, pollingInterval = client.pollingInterval }) {
      const enablePolling = typeof poll_ !== "undefined" ? poll_ : client.transport.type !== "webSocket";
      const includeTransactions = includeTransactions_ ?? false;
      let prevBlock;
      const pollBlocks = () => {
        const observerId = (0, stringify_js_1.stringify)([
          "watchBlocks",
          client.uid,
          emitMissed,
          emitOnBegin,
          includeTransactions,
          pollingInterval
        ]);
        return (0, observe_js_1.observe)(observerId, { onBlock, onError }, (emit) => (0, poll_js_1.poll)(async () => {
          try {
            const block = await (0, getBlock_js_1.getBlock)(client, {
              blockTag,
              includeTransactions
            });
            if (block.number && prevBlock?.number) {
              if (block.number === prevBlock.number)
                return;
              if (block.number - prevBlock.number > 1 && emitMissed) {
                for (let i = prevBlock?.number + 1n; i < block.number; i++) {
                  const block2 = await (0, getBlock_js_1.getBlock)(client, {
                    blockNumber: i,
                    includeTransactions
                  });
                  emit.onBlock(block2, prevBlock);
                  prevBlock = block2;
                }
              }
            }
            if (!prevBlock?.number || blockTag === "pending" && !block?.number || block.number && block.number > prevBlock.number) {
              emit.onBlock(block, prevBlock);
              prevBlock = block;
            }
          } catch (err) {
            emit.onError?.(err);
          }
        }, {
          emitOnBegin,
          interval: pollingInterval
        }));
      };
      const subscribeBlocks = () => {
        let active = true;
        let unsubscribe = () => active = false;
        (async () => {
          try {
            const { unsubscribe: unsubscribe_ } = await client.transport.subscribe({
              params: ["newHeads"],
              onData(data) {
                if (!active)
                  return;
                const format = client.chain?.formatters?.block?.format || block_js_1.formatBlock;
                const block = format(data.result);
                onBlock(block, prevBlock);
                prevBlock = block;
              },
              onError(error) {
                onError?.(error);
              }
            });
            unsubscribe = unsubscribe_;
            if (!active)
              unsubscribe();
          } catch (err) {
            onError?.(err);
          }
        })();
        return unsubscribe;
      };
      return enablePolling ? pollBlocks() : subscribeBlocks();
    }
    exports.watchBlocks = watchBlocks;
  }
});

// node_modules/viem/_cjs/actions/public/watchEvent.js
var require_watchEvent = __commonJS({
  "node_modules/viem/_cjs/actions/public/watchEvent.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.watchEvent = void 0;
    var observe_js_1 = require_observe();
    var poll_js_1 = require_poll();
    var stringify_js_1 = require_stringify();
    var abi_js_1 = require_abi();
    var rpc_js_1 = require_rpc();
    var index_js_1 = require_utils7();
    var createEventFilter_js_1 = require_createEventFilter();
    var getBlockNumber_js_1 = require_getBlockNumber();
    var getFilterChanges_js_1 = require_getFilterChanges();
    var getLogs_js_1 = require_getLogs();
    var uninstallFilter_js_1 = require_uninstallFilter();
    function watchEvent(client, { address, args, batch = true, event, events, onError, onLogs, poll: poll_, pollingInterval = client.pollingInterval, strict: strict_ }) {
      const enablePolling = typeof poll_ !== "undefined" ? poll_ : client.transport.type !== "webSocket";
      const strict = strict_ ?? false;
      const pollEvent = () => {
        const observerId = (0, stringify_js_1.stringify)([
          "watchEvent",
          address,
          args,
          batch,
          client.uid,
          event,
          pollingInterval
        ]);
        return (0, observe_js_1.observe)(observerId, { onLogs, onError }, (emit) => {
          let previousBlockNumber;
          let filter;
          let initialized = false;
          const unwatch = (0, poll_js_1.poll)(async () => {
            if (!initialized) {
              try {
                filter = await (0, createEventFilter_js_1.createEventFilter)(client, {
                  address,
                  args,
                  event,
                  events,
                  strict
                });
              } catch {
              }
              initialized = true;
              return;
            }
            try {
              let logs;
              if (filter) {
                logs = await (0, getFilterChanges_js_1.getFilterChanges)(client, { filter });
              } else {
                const blockNumber = await (0, getBlockNumber_js_1.getBlockNumber)(client);
                if (previousBlockNumber && previousBlockNumber !== blockNumber) {
                  logs = await (0, getLogs_js_1.getLogs)(client, {
                    address,
                    args,
                    event,
                    events,
                    fromBlock: previousBlockNumber + 1n,
                    toBlock: blockNumber
                  });
                } else {
                  logs = [];
                }
                previousBlockNumber = blockNumber;
              }
              if (logs.length === 0)
                return;
              if (batch)
                emit.onLogs(logs);
              else
                logs.forEach((log) => emit.onLogs([log]));
            } catch (err) {
              if (filter && err instanceof rpc_js_1.InvalidInputRpcError)
                initialized = false;
              emit.onError?.(err);
            }
          }, {
            emitOnBegin: true,
            interval: pollingInterval
          });
          return async () => {
            if (filter)
              await (0, uninstallFilter_js_1.uninstallFilter)(client, { filter });
            unwatch();
          };
        });
      };
      const subscribeEvent = () => {
        let active = true;
        let unsubscribe = () => active = false;
        (async () => {
          try {
            const events_ = events ?? (event ? [event] : void 0);
            let topics = [];
            if (events_) {
              topics = [
                events_.flatMap((event2) => (0, index_js_1.encodeEventTopics)({
                  abi: [event2],
                  eventName: event2.name,
                  args
                }))
              ];
              if (event)
                topics = topics[0];
            }
            const { unsubscribe: unsubscribe_ } = await client.transport.subscribe({
              params: ["logs", { address, topics }],
              onData(data) {
                if (!active)
                  return;
                const log = data.result;
                try {
                  const { eventName, args: args2 } = (0, index_js_1.decodeEventLog)({
                    abi: events_,
                    data: log.data,
                    topics: log.topics,
                    strict
                  });
                  const formatted = (0, index_js_1.formatLog)(log, {
                    args: args2,
                    eventName
                  });
                  onLogs([formatted]);
                } catch (err) {
                  let eventName;
                  let isUnnamed;
                  if (err instanceof abi_js_1.DecodeLogDataMismatch || err instanceof abi_js_1.DecodeLogTopicsMismatch) {
                    if (strict_)
                      return;
                    eventName = err.abiItem.name;
                    isUnnamed = err.abiItem.inputs?.some((x) => !("name" in x && x.name));
                  }
                  const formatted = (0, index_js_1.formatLog)(log, {
                    args: isUnnamed ? [] : {},
                    eventName
                  });
                  onLogs([formatted]);
                }
              },
              onError(error) {
                onError?.(error);
              }
            });
            unsubscribe = unsubscribe_;
            if (!active)
              unsubscribe();
          } catch (err) {
            onError?.(err);
          }
        })();
        return unsubscribe;
      };
      return enablePolling ? pollEvent() : subscribeEvent();
    }
    exports.watchEvent = watchEvent;
  }
});

// node_modules/viem/_cjs/actions/public/watchPendingTransactions.js
var require_watchPendingTransactions = __commonJS({
  "node_modules/viem/_cjs/actions/public/watchPendingTransactions.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.watchPendingTransactions = void 0;
    var observe_js_1 = require_observe();
    var poll_js_1 = require_poll();
    var stringify_js_1 = require_stringify();
    var createPendingTransactionFilter_js_1 = require_createPendingTransactionFilter();
    var getFilterChanges_js_1 = require_getFilterChanges();
    var uninstallFilter_js_1 = require_uninstallFilter();
    function watchPendingTransactions(client, { batch = true, onError, onTransactions, poll: poll_, pollingInterval = client.pollingInterval }) {
      const enablePolling = typeof poll_ !== "undefined" ? poll_ : client.transport.type !== "webSocket";
      const pollPendingTransactions = () => {
        const observerId = (0, stringify_js_1.stringify)([
          "watchPendingTransactions",
          client.uid,
          batch,
          pollingInterval
        ]);
        return (0, observe_js_1.observe)(observerId, { onTransactions, onError }, (emit) => {
          let filter;
          const unwatch = (0, poll_js_1.poll)(async () => {
            try {
              if (!filter) {
                try {
                  filter = await (0, createPendingTransactionFilter_js_1.createPendingTransactionFilter)(client);
                  return;
                } catch (err) {
                  unwatch();
                  throw err;
                }
              }
              const hashes = await (0, getFilterChanges_js_1.getFilterChanges)(client, { filter });
              if (hashes.length === 0)
                return;
              if (batch)
                emit.onTransactions(hashes);
              else
                hashes.forEach((hash2) => emit.onTransactions([hash2]));
            } catch (err) {
              emit.onError?.(err);
            }
          }, {
            emitOnBegin: true,
            interval: pollingInterval
          });
          return async () => {
            if (filter)
              await (0, uninstallFilter_js_1.uninstallFilter)(client, { filter });
            unwatch();
          };
        });
      };
      const subscribePendingTransactions = () => {
        let active = true;
        let unsubscribe = () => active = false;
        (async () => {
          try {
            const { unsubscribe: unsubscribe_ } = await client.transport.subscribe({
              params: ["newPendingTransactions"],
              onData(data) {
                if (!active)
                  return;
                const transaction = data.result;
                onTransactions([transaction]);
              },
              onError(error) {
                onError?.(error);
              }
            });
            unsubscribe = unsubscribe_;
            if (!active)
              unsubscribe();
          } catch (err) {
            onError?.(err);
          }
        })();
        return unsubscribe;
      };
      return enablePolling ? pollPendingTransactions() : subscribePendingTransactions();
    }
    exports.watchPendingTransactions = watchPendingTransactions;
  }
});

// node_modules/viem/_cjs/clients/decorators/public.js
var require_public = __commonJS({
  "node_modules/viem/_cjs/clients/decorators/public.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.publicActions = void 0;
    var getEnsAddress_js_1 = require_getEnsAddress();
    var getEnsAvatar_js_1 = require_getEnsAvatar();
    var getEnsName_js_1 = require_getEnsName();
    var getEnsResolver_js_1 = require_getEnsResolver();
    var getEnsText_js_1 = require_getEnsText();
    var call_js_1 = require_call();
    var createBlockFilter_js_1 = require_createBlockFilter();
    var createContractEventFilter_js_1 = require_createContractEventFilter();
    var createEventFilter_js_1 = require_createEventFilter();
    var createPendingTransactionFilter_js_1 = require_createPendingTransactionFilter();
    var estimateContractGas_js_1 = require_estimateContractGas();
    var estimateFeesPerGas_js_1 = require_estimateFeesPerGas();
    var estimateGas_js_1 = require_estimateGas2();
    var estimateMaxPriorityFeePerGas_js_1 = require_estimateMaxPriorityFeePerGas();
    var getBalance_js_1 = require_getBalance();
    var getBlock_js_1 = require_getBlock();
    var getBlockNumber_js_1 = require_getBlockNumber();
    var getBlockTransactionCount_js_1 = require_getBlockTransactionCount();
    var getBytecode_js_1 = require_getBytecode();
    var getChainId_js_1 = require_getChainId();
    var getContractEvents_js_1 = require_getContractEvents();
    var getFeeHistory_js_1 = require_getFeeHistory();
    var getFilterChanges_js_1 = require_getFilterChanges();
    var getFilterLogs_js_1 = require_getFilterLogs();
    var getGasPrice_js_1 = require_getGasPrice();
    var getLogs_js_1 = require_getLogs();
    var getProof_js_1 = require_getProof();
    var getStorageAt_js_1 = require_getStorageAt();
    var getTransaction_js_1 = require_getTransaction();
    var getTransactionConfirmations_js_1 = require_getTransactionConfirmations();
    var getTransactionCount_js_1 = require_getTransactionCount();
    var getTransactionReceipt_js_1 = require_getTransactionReceipt();
    var multicall_js_1 = require_multicall();
    var readContract_js_1 = require_readContract();
    var simulateContract_js_1 = require_simulateContract();
    var uninstallFilter_js_1 = require_uninstallFilter();
    var verifyMessage_js_1 = require_verifyMessage2();
    var verifyTypedData_js_1 = require_verifyTypedData2();
    var waitForTransactionReceipt_js_1 = require_waitForTransactionReceipt();
    var watchBlockNumber_js_1 = require_watchBlockNumber();
    var watchBlocks_js_1 = require_watchBlocks();
    var watchContractEvent_js_1 = require_watchContractEvent();
    var watchEvent_js_1 = require_watchEvent();
    var watchPendingTransactions_js_1 = require_watchPendingTransactions();
    var prepareTransactionRequest_js_1 = require_prepareTransactionRequest();
    var sendRawTransaction_js_1 = require_sendRawTransaction();
    function publicActions(client) {
      return {
        call: (args) => (0, call_js_1.call)(client, args),
        createBlockFilter: () => (0, createBlockFilter_js_1.createBlockFilter)(client),
        createContractEventFilter: (args) => (0, createContractEventFilter_js_1.createContractEventFilter)(client, args),
        createEventFilter: (args) => (0, createEventFilter_js_1.createEventFilter)(client, args),
        createPendingTransactionFilter: () => (0, createPendingTransactionFilter_js_1.createPendingTransactionFilter)(client),
        estimateContractGas: (args) => (0, estimateContractGas_js_1.estimateContractGas)(client, args),
        estimateGas: (args) => (0, estimateGas_js_1.estimateGas)(client, args),
        getBalance: (args) => (0, getBalance_js_1.getBalance)(client, args),
        getBlock: (args) => (0, getBlock_js_1.getBlock)(client, args),
        getBlockNumber: (args) => (0, getBlockNumber_js_1.getBlockNumber)(client, args),
        getBlockTransactionCount: (args) => (0, getBlockTransactionCount_js_1.getBlockTransactionCount)(client, args),
        getBytecode: (args) => (0, getBytecode_js_1.getBytecode)(client, args),
        getChainId: () => (0, getChainId_js_1.getChainId)(client),
        getContractEvents: (args) => (0, getContractEvents_js_1.getContractEvents)(client, args),
        getEnsAddress: (args) => (0, getEnsAddress_js_1.getEnsAddress)(client, args),
        getEnsAvatar: (args) => (0, getEnsAvatar_js_1.getEnsAvatar)(client, args),
        getEnsName: (args) => (0, getEnsName_js_1.getEnsName)(client, args),
        getEnsResolver: (args) => (0, getEnsResolver_js_1.getEnsResolver)(client, args),
        getEnsText: (args) => (0, getEnsText_js_1.getEnsText)(client, args),
        getFeeHistory: (args) => (0, getFeeHistory_js_1.getFeeHistory)(client, args),
        estimateFeesPerGas: (args) => (0, estimateFeesPerGas_js_1.estimateFeesPerGas)(client, args),
        getFilterChanges: (args) => (0, getFilterChanges_js_1.getFilterChanges)(client, args),
        getFilterLogs: (args) => (0, getFilterLogs_js_1.getFilterLogs)(client, args),
        getGasPrice: () => (0, getGasPrice_js_1.getGasPrice)(client),
        getLogs: (args) => (0, getLogs_js_1.getLogs)(client, args),
        getProof: (args) => (0, getProof_js_1.getProof)(client, args),
        estimateMaxPriorityFeePerGas: (args) => (0, estimateMaxPriorityFeePerGas_js_1.estimateMaxPriorityFeePerGas)(client, args),
        getStorageAt: (args) => (0, getStorageAt_js_1.getStorageAt)(client, args),
        getTransaction: (args) => (0, getTransaction_js_1.getTransaction)(client, args),
        getTransactionConfirmations: (args) => (0, getTransactionConfirmations_js_1.getTransactionConfirmations)(client, args),
        getTransactionCount: (args) => (0, getTransactionCount_js_1.getTransactionCount)(client, args),
        getTransactionReceipt: (args) => (0, getTransactionReceipt_js_1.getTransactionReceipt)(client, args),
        multicall: (args) => (0, multicall_js_1.multicall)(client, args),
        prepareTransactionRequest: (args) => (0, prepareTransactionRequest_js_1.prepareTransactionRequest)(client, args),
        readContract: (args) => (0, readContract_js_1.readContract)(client, args),
        sendRawTransaction: (args) => (0, sendRawTransaction_js_1.sendRawTransaction)(client, args),
        simulateContract: (args) => (0, simulateContract_js_1.simulateContract)(client, args),
        verifyMessage: (args) => (0, verifyMessage_js_1.verifyMessage)(client, args),
        verifyTypedData: (args) => (0, verifyTypedData_js_1.verifyTypedData)(client, args),
        uninstallFilter: (args) => (0, uninstallFilter_js_1.uninstallFilter)(client, args),
        waitForTransactionReceipt: (args) => (0, waitForTransactionReceipt_js_1.waitForTransactionReceipt)(client, args),
        watchBlocks: (args) => (0, watchBlocks_js_1.watchBlocks)(client, args),
        watchBlockNumber: (args) => (0, watchBlockNumber_js_1.watchBlockNumber)(client, args),
        watchContractEvent: (args) => (0, watchContractEvent_js_1.watchContractEvent)(client, args),
        watchEvent: (args) => (0, watchEvent_js_1.watchEvent)(client, args),
        watchPendingTransactions: (args) => (0, watchPendingTransactions_js_1.watchPendingTransactions)(client, args)
      };
    }
    exports.publicActions = publicActions;
  }
});

// node_modules/viem/_cjs/clients/createPublicClient.js
var require_createPublicClient = __commonJS({
  "node_modules/viem/_cjs/clients/createPublicClient.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createPublicClient = void 0;
    var createClient_js_1 = require_createClient();
    var public_js_1 = require_public();
    function createPublicClient(parameters) {
      const { key = "public", name = "Public Client" } = parameters;
      const client = (0, createClient_js_1.createClient)({
        ...parameters,
        key,
        name,
        type: "publicClient"
      });
      return client.extend(public_js_1.publicActions);
    }
    exports.createPublicClient = createPublicClient;
  }
});

// node_modules/viem/_cjs/actions/test/dropTransaction.js
var require_dropTransaction = __commonJS({
  "node_modules/viem/_cjs/actions/test/dropTransaction.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dropTransaction = void 0;
    async function dropTransaction(client, { hash: hash2 }) {
      await client.request({
        method: `${client.mode}_dropTransaction`,
        params: [hash2]
      });
    }
    exports.dropTransaction = dropTransaction;
  }
});

// node_modules/viem/_cjs/actions/test/getAutomine.js
var require_getAutomine = __commonJS({
  "node_modules/viem/_cjs/actions/test/getAutomine.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getAutomine = void 0;
    async function getAutomine(client) {
      if (client.mode === "ganache")
        return await client.request({
          method: "eth_mining"
        });
      return await client.request({
        method: `${client.mode}_getAutomine`
      });
    }
    exports.getAutomine = getAutomine;
  }
});

// node_modules/viem/_cjs/actions/test/getTxpoolContent.js
var require_getTxpoolContent = __commonJS({
  "node_modules/viem/_cjs/actions/test/getTxpoolContent.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getTxpoolContent = void 0;
    async function getTxpoolContent(client) {
      return await client.request({
        method: "txpool_content"
      });
    }
    exports.getTxpoolContent = getTxpoolContent;
  }
});

// node_modules/viem/_cjs/actions/test/getTxpoolStatus.js
var require_getTxpoolStatus = __commonJS({
  "node_modules/viem/_cjs/actions/test/getTxpoolStatus.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getTxpoolStatus = void 0;
    var fromHex_js_1 = require_fromHex();
    async function getTxpoolStatus(client) {
      const { pending, queued } = await client.request({
        method: "txpool_status"
      });
      return {
        pending: (0, fromHex_js_1.hexToNumber)(pending),
        queued: (0, fromHex_js_1.hexToNumber)(queued)
      };
    }
    exports.getTxpoolStatus = getTxpoolStatus;
  }
});

// node_modules/viem/_cjs/actions/test/impersonateAccount.js
var require_impersonateAccount = __commonJS({
  "node_modules/viem/_cjs/actions/test/impersonateAccount.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.impersonateAccount = void 0;
    async function impersonateAccount(client, { address }) {
      await client.request({
        method: `${client.mode}_impersonateAccount`,
        params: [address]
      });
    }
    exports.impersonateAccount = impersonateAccount;
  }
});

// node_modules/viem/_cjs/actions/test/increaseTime.js
var require_increaseTime = __commonJS({
  "node_modules/viem/_cjs/actions/test/increaseTime.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.increaseTime = void 0;
    var toHex_js_1 = require_toHex();
    async function increaseTime(client, { seconds }) {
      return await client.request({
        method: "evm_increaseTime",
        params: [(0, toHex_js_1.numberToHex)(seconds)]
      });
    }
    exports.increaseTime = increaseTime;
  }
});

// node_modules/viem/_cjs/actions/test/inspectTxpool.js
var require_inspectTxpool = __commonJS({
  "node_modules/viem/_cjs/actions/test/inspectTxpool.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.inspectTxpool = void 0;
    async function inspectTxpool(client) {
      return await client.request({
        method: "txpool_inspect"
      });
    }
    exports.inspectTxpool = inspectTxpool;
  }
});

// node_modules/viem/_cjs/actions/test/mine.js
var require_mine = __commonJS({
  "node_modules/viem/_cjs/actions/test/mine.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.mine = void 0;
    var toHex_js_1 = require_toHex();
    async function mine(client, { blocks, interval }) {
      if (client.mode === "ganache")
        await client.request({
          method: "evm_mine",
          params: [{ blocks: (0, toHex_js_1.numberToHex)(blocks) }]
        });
      else
        await client.request({
          method: `${client.mode}_mine`,
          params: [(0, toHex_js_1.numberToHex)(blocks), (0, toHex_js_1.numberToHex)(interval || 0)]
        });
    }
    exports.mine = mine;
  }
});

// node_modules/viem/_cjs/actions/test/removeBlockTimestampInterval.js
var require_removeBlockTimestampInterval = __commonJS({
  "node_modules/viem/_cjs/actions/test/removeBlockTimestampInterval.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.removeBlockTimestampInterval = void 0;
    async function removeBlockTimestampInterval(client) {
      await client.request({
        method: `${client.mode}_removeBlockTimestampInterval`
      });
    }
    exports.removeBlockTimestampInterval = removeBlockTimestampInterval;
  }
});

// node_modules/viem/_cjs/actions/test/reset.js
var require_reset = __commonJS({
  "node_modules/viem/_cjs/actions/test/reset.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.reset = void 0;
    async function reset(client, { blockNumber, jsonRpcUrl } = {}) {
      await client.request({
        method: `${client.mode}_reset`,
        params: [{ forking: { blockNumber: Number(blockNumber), jsonRpcUrl } }]
      });
    }
    exports.reset = reset;
  }
});

// node_modules/viem/_cjs/actions/test/revert.js
var require_revert = __commonJS({
  "node_modules/viem/_cjs/actions/test/revert.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.revert = void 0;
    async function revert(client, { id }) {
      await client.request({
        method: "evm_revert",
        params: [id]
      });
    }
    exports.revert = revert;
  }
});

// node_modules/viem/_cjs/actions/test/sendUnsignedTransaction.js
var require_sendUnsignedTransaction = __commonJS({
  "node_modules/viem/_cjs/actions/test/sendUnsignedTransaction.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.sendUnsignedTransaction = void 0;
    var extract_js_1 = require_extract();
    var transactionRequest_js_1 = require_transactionRequest();
    async function sendUnsignedTransaction(client, args) {
      const { accessList, data, from, gas, gasPrice, maxFeePerGas, maxPriorityFeePerGas, nonce, to, value, ...rest } = args;
      const format = client.chain?.formatters?.transactionRequest?.format || transactionRequest_js_1.formatTransactionRequest;
      const request = format({
        ...(0, extract_js_1.extract)(rest, { format }),
        accessList,
        data,
        from,
        gas,
        gasPrice,
        maxFeePerGas,
        maxPriorityFeePerGas,
        nonce,
        to,
        value
      });
      const hash2 = await client.request({
        method: "eth_sendUnsignedTransaction",
        params: [request]
      });
      return hash2;
    }
    exports.sendUnsignedTransaction = sendUnsignedTransaction;
  }
});

// node_modules/viem/_cjs/actions/test/setAutomine.js
var require_setAutomine = __commonJS({
  "node_modules/viem/_cjs/actions/test/setAutomine.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setAutomine = void 0;
    async function setAutomine(client, enabled) {
      if (client.mode === "ganache") {
        if (enabled)
          await client.request({ method: "miner_start" });
        else
          await client.request({ method: "miner_stop" });
      } else
        await client.request({
          method: "evm_setAutomine",
          params: [enabled]
        });
    }
    exports.setAutomine = setAutomine;
  }
});

// node_modules/viem/_cjs/actions/test/setBalance.js
var require_setBalance = __commonJS({
  "node_modules/viem/_cjs/actions/test/setBalance.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setBalance = void 0;
    var toHex_js_1 = require_toHex();
    async function setBalance(client, { address, value }) {
      if (client.mode === "ganache")
        await client.request({
          method: "evm_setAccountBalance",
          params: [address, (0, toHex_js_1.numberToHex)(value)]
        });
      else
        await client.request({
          method: `${client.mode}_setBalance`,
          params: [address, (0, toHex_js_1.numberToHex)(value)]
        });
    }
    exports.setBalance = setBalance;
  }
});

// node_modules/viem/_cjs/actions/test/setBlockGasLimit.js
var require_setBlockGasLimit = __commonJS({
  "node_modules/viem/_cjs/actions/test/setBlockGasLimit.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setBlockGasLimit = void 0;
    var toHex_js_1 = require_toHex();
    async function setBlockGasLimit(client, { gasLimit }) {
      await client.request({
        method: "evm_setBlockGasLimit",
        params: [(0, toHex_js_1.numberToHex)(gasLimit)]
      });
    }
    exports.setBlockGasLimit = setBlockGasLimit;
  }
});

// node_modules/viem/_cjs/actions/test/setBlockTimestampInterval.js
var require_setBlockTimestampInterval = __commonJS({
  "node_modules/viem/_cjs/actions/test/setBlockTimestampInterval.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setBlockTimestampInterval = void 0;
    async function setBlockTimestampInterval(client, { interval }) {
      const interval_ = (() => {
        if (client.mode === "hardhat")
          return interval * 1e3;
        return interval;
      })();
      await client.request({
        method: `${client.mode}_setBlockTimestampInterval`,
        params: [interval_]
      });
    }
    exports.setBlockTimestampInterval = setBlockTimestampInterval;
  }
});

// node_modules/viem/_cjs/actions/test/setCode.js
var require_setCode = __commonJS({
  "node_modules/viem/_cjs/actions/test/setCode.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setCode = void 0;
    async function setCode(client, { address, bytecode }) {
      await client.request({
        method: `${client.mode}_setCode`,
        params: [address, bytecode]
      });
    }
    exports.setCode = setCode;
  }
});

// node_modules/viem/_cjs/actions/test/setCoinbase.js
var require_setCoinbase = __commonJS({
  "node_modules/viem/_cjs/actions/test/setCoinbase.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setCoinbase = void 0;
    async function setCoinbase(client, { address }) {
      await client.request({
        method: `${client.mode}_setCoinbase`,
        params: [address]
      });
    }
    exports.setCoinbase = setCoinbase;
  }
});

// node_modules/viem/_cjs/actions/test/setIntervalMining.js
var require_setIntervalMining = __commonJS({
  "node_modules/viem/_cjs/actions/test/setIntervalMining.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setIntervalMining = void 0;
    async function setIntervalMining(client, { interval }) {
      const interval_ = (() => {
        if (client.mode === "hardhat")
          return interval * 1e3;
        return interval;
      })();
      await client.request({
        method: "evm_setIntervalMining",
        params: [interval_]
      });
    }
    exports.setIntervalMining = setIntervalMining;
  }
});

// node_modules/viem/_cjs/actions/test/setLoggingEnabled.js
var require_setLoggingEnabled = __commonJS({
  "node_modules/viem/_cjs/actions/test/setLoggingEnabled.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setLoggingEnabled = void 0;
    async function setLoggingEnabled(client, enabled) {
      await client.request({
        method: `${client.mode}_setLoggingEnabled`,
        params: [enabled]
      });
    }
    exports.setLoggingEnabled = setLoggingEnabled;
  }
});

// node_modules/viem/_cjs/actions/test/setMinGasPrice.js
var require_setMinGasPrice = __commonJS({
  "node_modules/viem/_cjs/actions/test/setMinGasPrice.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setMinGasPrice = void 0;
    var toHex_js_1 = require_toHex();
    async function setMinGasPrice(client, { gasPrice }) {
      await client.request({
        method: `${client.mode}_setMinGasPrice`,
        params: [(0, toHex_js_1.numberToHex)(gasPrice)]
      });
    }
    exports.setMinGasPrice = setMinGasPrice;
  }
});

// node_modules/viem/_cjs/actions/test/setNextBlockBaseFeePerGas.js
var require_setNextBlockBaseFeePerGas = __commonJS({
  "node_modules/viem/_cjs/actions/test/setNextBlockBaseFeePerGas.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setNextBlockBaseFeePerGas = void 0;
    var toHex_js_1 = require_toHex();
    async function setNextBlockBaseFeePerGas(client, { baseFeePerGas }) {
      await client.request({
        method: `${client.mode}_setNextBlockBaseFeePerGas`,
        params: [(0, toHex_js_1.numberToHex)(baseFeePerGas)]
      });
    }
    exports.setNextBlockBaseFeePerGas = setNextBlockBaseFeePerGas;
  }
});

// node_modules/viem/_cjs/actions/test/setNextBlockTimestamp.js
var require_setNextBlockTimestamp = __commonJS({
  "node_modules/viem/_cjs/actions/test/setNextBlockTimestamp.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setNextBlockTimestamp = void 0;
    var toHex_js_1 = require_toHex();
    async function setNextBlockTimestamp(client, { timestamp }) {
      await client.request({
        method: "evm_setNextBlockTimestamp",
        params: [(0, toHex_js_1.numberToHex)(timestamp)]
      });
    }
    exports.setNextBlockTimestamp = setNextBlockTimestamp;
  }
});

// node_modules/viem/_cjs/actions/test/setNonce.js
var require_setNonce = __commonJS({
  "node_modules/viem/_cjs/actions/test/setNonce.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setNonce = void 0;
    var toHex_js_1 = require_toHex();
    async function setNonce(client, { address, nonce }) {
      await client.request({
        method: `${client.mode}_setNonce`,
        params: [address, (0, toHex_js_1.numberToHex)(nonce)]
      });
    }
    exports.setNonce = setNonce;
  }
});

// node_modules/viem/_cjs/actions/test/setRpcUrl.js
var require_setRpcUrl = __commonJS({
  "node_modules/viem/_cjs/actions/test/setRpcUrl.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setRpcUrl = void 0;
    async function setRpcUrl(client, jsonRpcUrl) {
      await client.request({
        method: `${client.mode}_setRpcUrl`,
        params: [jsonRpcUrl]
      });
    }
    exports.setRpcUrl = setRpcUrl;
  }
});

// node_modules/viem/_cjs/actions/test/setStorageAt.js
var require_setStorageAt = __commonJS({
  "node_modules/viem/_cjs/actions/test/setStorageAt.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setStorageAt = void 0;
    var toHex_js_1 = require_toHex();
    async function setStorageAt(client, { address, index, value }) {
      await client.request({
        method: `${client.mode}_setStorageAt`,
        params: [
          address,
          typeof index === "number" ? (0, toHex_js_1.numberToHex)(index) : index,
          value
        ]
      });
    }
    exports.setStorageAt = setStorageAt;
  }
});

// node_modules/viem/_cjs/actions/test/snapshot.js
var require_snapshot = __commonJS({
  "node_modules/viem/_cjs/actions/test/snapshot.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.snapshot = void 0;
    async function snapshot(client) {
      return await client.request({
        method: "evm_snapshot"
      });
    }
    exports.snapshot = snapshot;
  }
});

// node_modules/viem/_cjs/actions/test/stopImpersonatingAccount.js
var require_stopImpersonatingAccount = __commonJS({
  "node_modules/viem/_cjs/actions/test/stopImpersonatingAccount.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.stopImpersonatingAccount = void 0;
    async function stopImpersonatingAccount(client, { address }) {
      await client.request({
        method: `${client.mode}_stopImpersonatingAccount`,
        params: [address]
      });
    }
    exports.stopImpersonatingAccount = stopImpersonatingAccount;
  }
});

// node_modules/viem/_cjs/clients/decorators/test.js
var require_test = __commonJS({
  "node_modules/viem/_cjs/clients/decorators/test.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.testActions = void 0;
    var dropTransaction_js_1 = require_dropTransaction();
    var getAutomine_js_1 = require_getAutomine();
    var getTxpoolContent_js_1 = require_getTxpoolContent();
    var getTxpoolStatus_js_1 = require_getTxpoolStatus();
    var impersonateAccount_js_1 = require_impersonateAccount();
    var increaseTime_js_1 = require_increaseTime();
    var inspectTxpool_js_1 = require_inspectTxpool();
    var mine_js_1 = require_mine();
    var removeBlockTimestampInterval_js_1 = require_removeBlockTimestampInterval();
    var reset_js_1 = require_reset();
    var revert_js_1 = require_revert();
    var sendUnsignedTransaction_js_1 = require_sendUnsignedTransaction();
    var setAutomine_js_1 = require_setAutomine();
    var setBalance_js_1 = require_setBalance();
    var setBlockGasLimit_js_1 = require_setBlockGasLimit();
    var setBlockTimestampInterval_js_1 = require_setBlockTimestampInterval();
    var setCode_js_1 = require_setCode();
    var setCoinbase_js_1 = require_setCoinbase();
    var setIntervalMining_js_1 = require_setIntervalMining();
    var setLoggingEnabled_js_1 = require_setLoggingEnabled();
    var setMinGasPrice_js_1 = require_setMinGasPrice();
    var setNextBlockBaseFeePerGas_js_1 = require_setNextBlockBaseFeePerGas();
    var setNextBlockTimestamp_js_1 = require_setNextBlockTimestamp();
    var setNonce_js_1 = require_setNonce();
    var setRpcUrl_js_1 = require_setRpcUrl();
    var setStorageAt_js_1 = require_setStorageAt();
    var snapshot_js_1 = require_snapshot();
    var stopImpersonatingAccount_js_1 = require_stopImpersonatingAccount();
    function testActions({ mode }) {
      return (client_) => {
        const client = client_.extend(() => ({
          mode
        }));
        return {
          dropTransaction: (args) => (0, dropTransaction_js_1.dropTransaction)(client, args),
          getAutomine: () => (0, getAutomine_js_1.getAutomine)(client),
          getTxpoolContent: () => (0, getTxpoolContent_js_1.getTxpoolContent)(client),
          getTxpoolStatus: () => (0, getTxpoolStatus_js_1.getTxpoolStatus)(client),
          impersonateAccount: (args) => (0, impersonateAccount_js_1.impersonateAccount)(client, args),
          increaseTime: (args) => (0, increaseTime_js_1.increaseTime)(client, args),
          inspectTxpool: () => (0, inspectTxpool_js_1.inspectTxpool)(client),
          mine: (args) => (0, mine_js_1.mine)(client, args),
          removeBlockTimestampInterval: () => (0, removeBlockTimestampInterval_js_1.removeBlockTimestampInterval)(client),
          reset: (args) => (0, reset_js_1.reset)(client, args),
          revert: (args) => (0, revert_js_1.revert)(client, args),
          sendUnsignedTransaction: (args) => (0, sendUnsignedTransaction_js_1.sendUnsignedTransaction)(client, args),
          setAutomine: (args) => (0, setAutomine_js_1.setAutomine)(client, args),
          setBalance: (args) => (0, setBalance_js_1.setBalance)(client, args),
          setBlockGasLimit: (args) => (0, setBlockGasLimit_js_1.setBlockGasLimit)(client, args),
          setBlockTimestampInterval: (args) => (0, setBlockTimestampInterval_js_1.setBlockTimestampInterval)(client, args),
          setCode: (args) => (0, setCode_js_1.setCode)(client, args),
          setCoinbase: (args) => (0, setCoinbase_js_1.setCoinbase)(client, args),
          setIntervalMining: (args) => (0, setIntervalMining_js_1.setIntervalMining)(client, args),
          setLoggingEnabled: (args) => (0, setLoggingEnabled_js_1.setLoggingEnabled)(client, args),
          setMinGasPrice: (args) => (0, setMinGasPrice_js_1.setMinGasPrice)(client, args),
          setNextBlockBaseFeePerGas: (args) => (0, setNextBlockBaseFeePerGas_js_1.setNextBlockBaseFeePerGas)(client, args),
          setNextBlockTimestamp: (args) => (0, setNextBlockTimestamp_js_1.setNextBlockTimestamp)(client, args),
          setNonce: (args) => (0, setNonce_js_1.setNonce)(client, args),
          setRpcUrl: (args) => (0, setRpcUrl_js_1.setRpcUrl)(client, args),
          setStorageAt: (args) => (0, setStorageAt_js_1.setStorageAt)(client, args),
          snapshot: () => (0, snapshot_js_1.snapshot)(client),
          stopImpersonatingAccount: (args) => (0, stopImpersonatingAccount_js_1.stopImpersonatingAccount)(client, args)
        };
      };
    }
    exports.testActions = testActions;
  }
});

// node_modules/viem/_cjs/clients/createTestClient.js
var require_createTestClient = __commonJS({
  "node_modules/viem/_cjs/clients/createTestClient.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createTestClient = void 0;
    var createClient_js_1 = require_createClient();
    var test_js_1 = require_test();
    function createTestClient(parameters) {
      const { key = "test", name = "Test Client", mode } = parameters;
      const client = (0, createClient_js_1.createClient)({
        ...parameters,
        key,
        name,
        type: "testClient"
      });
      return client.extend((config) => ({
        mode,
        ...(0, test_js_1.testActions)({ mode })(config)
      }));
    }
    exports.createTestClient = createTestClient;
  }
});

// node_modules/viem/_cjs/actions/wallet/addChain.js
var require_addChain = __commonJS({
  "node_modules/viem/_cjs/actions/wallet/addChain.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.addChain = void 0;
    var toHex_js_1 = require_toHex();
    async function addChain(client, { chain }) {
      const { id, name, nativeCurrency, rpcUrls, blockExplorers } = chain;
      await client.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: (0, toHex_js_1.numberToHex)(id),
            chainName: name,
            nativeCurrency,
            rpcUrls: rpcUrls.default.http,
            blockExplorerUrls: blockExplorers ? Object.values(blockExplorers).map(({ url }) => url) : void 0
          }
        ]
      });
    }
    exports.addChain = addChain;
  }
});

// node_modules/viem/_cjs/actions/wallet/deployContract.js
var require_deployContract = __commonJS({
  "node_modules/viem/_cjs/actions/wallet/deployContract.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.deployContract = void 0;
    var encodeDeployData_js_1 = require_encodeDeployData();
    var sendTransaction_js_1 = require_sendTransaction();
    function deployContract(walletClient, { abi: abi2, args, bytecode, ...request }) {
      const calldata = (0, encodeDeployData_js_1.encodeDeployData)({
        abi: abi2,
        args,
        bytecode
      });
      return (0, sendTransaction_js_1.sendTransaction)(walletClient, {
        ...request,
        data: calldata
      });
    }
    exports.deployContract = deployContract;
  }
});

// node_modules/viem/_cjs/actions/wallet/getAddresses.js
var require_getAddresses = __commonJS({
  "node_modules/viem/_cjs/actions/wallet/getAddresses.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getAddresses = void 0;
    var getAddress_js_1 = require_getAddress();
    async function getAddresses(client) {
      if (client.account?.type === "local")
        return [client.account.address];
      const addresses = await client.request({ method: "eth_accounts" });
      return addresses.map((address) => (0, getAddress_js_1.checksumAddress)(address));
    }
    exports.getAddresses = getAddresses;
  }
});

// node_modules/viem/_cjs/actions/wallet/getPermissions.js
var require_getPermissions = __commonJS({
  "node_modules/viem/_cjs/actions/wallet/getPermissions.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getPermissions = void 0;
    async function getPermissions(client) {
      const permissions = await client.request({ method: "wallet_getPermissions" });
      return permissions;
    }
    exports.getPermissions = getPermissions;
  }
});

// node_modules/viem/_cjs/actions/wallet/requestAddresses.js
var require_requestAddresses = __commonJS({
  "node_modules/viem/_cjs/actions/wallet/requestAddresses.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.requestAddresses = void 0;
    var getAddress_js_1 = require_getAddress();
    async function requestAddresses(client) {
      const addresses = await client.request({ method: "eth_requestAccounts" });
      return addresses.map((address) => (0, getAddress_js_1.getAddress)(address));
    }
    exports.requestAddresses = requestAddresses;
  }
});

// node_modules/viem/_cjs/actions/wallet/requestPermissions.js
var require_requestPermissions = __commonJS({
  "node_modules/viem/_cjs/actions/wallet/requestPermissions.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.requestPermissions = void 0;
    async function requestPermissions(client, permissions) {
      return client.request({
        method: "wallet_requestPermissions",
        params: [permissions]
      });
    }
    exports.requestPermissions = requestPermissions;
  }
});

// node_modules/viem/_cjs/actions/wallet/signMessage.js
var require_signMessage = __commonJS({
  "node_modules/viem/_cjs/actions/wallet/signMessage.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.signMessage = void 0;
    var parseAccount_js_1 = require_parseAccount();
    var account_js_1 = require_account();
    var toHex_js_1 = require_toHex();
    async function signMessage(client, { account: account_ = client.account, message }) {
      if (!account_)
        throw new account_js_1.AccountNotFoundError({
          docsPath: "/docs/actions/wallet/signMessage"
        });
      const account = (0, parseAccount_js_1.parseAccount)(account_);
      if (account.type === "local")
        return account.signMessage({ message });
      const message_ = (() => {
        if (typeof message === "string")
          return (0, toHex_js_1.stringToHex)(message);
        if (message.raw instanceof Uint8Array)
          return (0, toHex_js_1.toHex)(message.raw);
        return message.raw;
      })();
      return client.request({
        method: "personal_sign",
        params: [message_, account.address]
      });
    }
    exports.signMessage = signMessage;
  }
});

// node_modules/viem/_cjs/actions/wallet/signTransaction.js
var require_signTransaction = __commonJS({
  "node_modules/viem/_cjs/actions/wallet/signTransaction.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.signTransaction = void 0;
    var parseAccount_js_1 = require_parseAccount();
    var account_js_1 = require_account();
    var chain_js_1 = require_chain2();
    var transactionRequest_js_1 = require_transactionRequest();
    var index_js_1 = require_utils7();
    var assertRequest_js_1 = require_assertRequest();
    var getChainId_js_1 = require_getChainId();
    async function signTransaction(client, args) {
      const { account: account_ = client.account, chain = client.chain, ...transaction } = args;
      if (!account_)
        throw new account_js_1.AccountNotFoundError({
          docsPath: "/docs/actions/wallet/signTransaction"
        });
      const account = (0, parseAccount_js_1.parseAccount)(account_);
      (0, assertRequest_js_1.assertRequest)({
        account,
        ...args
      });
      const chainId = await (0, getChainId_js_1.getChainId)(client);
      if (chain !== null)
        (0, chain_js_1.assertCurrentChain)({
          currentChainId: chainId,
          chain
        });
      const formatters = chain?.formatters || client.chain?.formatters;
      const format = formatters?.transactionRequest?.format || transactionRequest_js_1.formatTransactionRequest;
      if (account.type === "local")
        return account.signTransaction({
          ...transaction,
          chainId
        }, { serializer: client.chain?.serializers?.transaction });
      return await client.request({
        method: "eth_signTransaction",
        params: [
          {
            ...format(transaction),
            chainId: (0, index_js_1.numberToHex)(chainId),
            from: account.address
          }
        ]
      });
    }
    exports.signTransaction = signTransaction;
  }
});

// node_modules/viem/_cjs/actions/wallet/signTypedData.js
var require_signTypedData = __commonJS({
  "node_modules/viem/_cjs/actions/wallet/signTypedData.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.signTypedData = void 0;
    var parseAccount_js_1 = require_parseAccount();
    var account_js_1 = require_account();
    var isHex_js_1 = require_isHex();
    var stringify_js_1 = require_stringify();
    var typedData_js_1 = require_typedData();
    async function signTypedData(client, { account: account_ = client.account, domain, message, primaryType, types: types_ }) {
      if (!account_)
        throw new account_js_1.AccountNotFoundError({
          docsPath: "/docs/actions/wallet/signTypedData"
        });
      const account = (0, parseAccount_js_1.parseAccount)(account_);
      const types = {
        EIP712Domain: (0, typedData_js_1.getTypesForEIP712Domain)({ domain }),
        ...types_
      };
      (0, typedData_js_1.validateTypedData)({
        domain,
        message,
        primaryType,
        types
      });
      if (account.type === "local")
        return account.signTypedData({
          domain,
          primaryType,
          types,
          message
        });
      const typedData = (0, stringify_js_1.stringify)({ domain: domain ?? {}, primaryType, types, message }, (_, value) => (0, isHex_js_1.isHex)(value) ? value.toLowerCase() : value);
      return client.request({
        method: "eth_signTypedData_v4",
        params: [account.address, typedData]
      });
    }
    exports.signTypedData = signTypedData;
  }
});

// node_modules/viem/_cjs/actions/wallet/switchChain.js
var require_switchChain = __commonJS({
  "node_modules/viem/_cjs/actions/wallet/switchChain.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.switchChain = void 0;
    var toHex_js_1 = require_toHex();
    async function switchChain(client, { id }) {
      await client.request({
        method: "wallet_switchEthereumChain",
        params: [
          {
            chainId: (0, toHex_js_1.numberToHex)(id)
          }
        ]
      });
    }
    exports.switchChain = switchChain;
  }
});

// node_modules/viem/_cjs/actions/wallet/watchAsset.js
var require_watchAsset = __commonJS({
  "node_modules/viem/_cjs/actions/wallet/watchAsset.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.watchAsset = void 0;
    async function watchAsset(client, params) {
      const added = await client.request({
        method: "wallet_watchAsset",
        params
      });
      return added;
    }
    exports.watchAsset = watchAsset;
  }
});

// node_modules/viem/_cjs/clients/decorators/wallet.js
var require_wallet = __commonJS({
  "node_modules/viem/_cjs/clients/decorators/wallet.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.walletActions = void 0;
    var getChainId_js_1 = require_getChainId();
    var addChain_js_1 = require_addChain();
    var deployContract_js_1 = require_deployContract();
    var getAddresses_js_1 = require_getAddresses();
    var getPermissions_js_1 = require_getPermissions();
    var prepareTransactionRequest_js_1 = require_prepareTransactionRequest();
    var requestAddresses_js_1 = require_requestAddresses();
    var requestPermissions_js_1 = require_requestPermissions();
    var sendRawTransaction_js_1 = require_sendRawTransaction();
    var sendTransaction_js_1 = require_sendTransaction();
    var signMessage_js_1 = require_signMessage();
    var signTransaction_js_1 = require_signTransaction();
    var signTypedData_js_1 = require_signTypedData();
    var switchChain_js_1 = require_switchChain();
    var watchAsset_js_1 = require_watchAsset();
    var writeContract_js_1 = require_writeContract();
    function walletActions(client) {
      return {
        addChain: (args) => (0, addChain_js_1.addChain)(client, args),
        deployContract: (args) => (0, deployContract_js_1.deployContract)(client, args),
        getAddresses: () => (0, getAddresses_js_1.getAddresses)(client),
        getChainId: () => (0, getChainId_js_1.getChainId)(client),
        getPermissions: () => (0, getPermissions_js_1.getPermissions)(client),
        prepareTransactionRequest: (args) => (0, prepareTransactionRequest_js_1.prepareTransactionRequest)(client, args),
        requestAddresses: () => (0, requestAddresses_js_1.requestAddresses)(client),
        requestPermissions: (args) => (0, requestPermissions_js_1.requestPermissions)(client, args),
        sendRawTransaction: (args) => (0, sendRawTransaction_js_1.sendRawTransaction)(client, args),
        sendTransaction: (args) => (0, sendTransaction_js_1.sendTransaction)(client, args),
        signMessage: (args) => (0, signMessage_js_1.signMessage)(client, args),
        signTransaction: (args) => (0, signTransaction_js_1.signTransaction)(client, args),
        signTypedData: (args) => (0, signTypedData_js_1.signTypedData)(client, args),
        switchChain: (args) => (0, switchChain_js_1.switchChain)(client, args),
        watchAsset: (args) => (0, watchAsset_js_1.watchAsset)(client, args),
        writeContract: (args) => (0, writeContract_js_1.writeContract)(client, args)
      };
    }
    exports.walletActions = walletActions;
  }
});

// node_modules/viem/_cjs/clients/createWalletClient.js
var require_createWalletClient = __commonJS({
  "node_modules/viem/_cjs/clients/createWalletClient.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createWalletClient = void 0;
    var createClient_js_1 = require_createClient();
    var wallet_js_1 = require_wallet();
    function createWalletClient(parameters) {
      const { key = "wallet", name = "Wallet Client", transport } = parameters;
      const client = (0, createClient_js_1.createClient)({
        ...parameters,
        key,
        name,
        transport: (opts) => transport({ ...opts, retryCount: 0 }),
        type: "walletClient"
      });
      return client.extend(wallet_js_1.walletActions);
    }
    exports.createWalletClient = createWalletClient;
  }
});

// node_modules/viem/_cjs/clients/transports/webSocket.js
var require_webSocket = __commonJS({
  "node_modules/viem/_cjs/clients/transports/webSocket.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.webSocket = void 0;
    var request_js_1 = require_request();
    var transport_js_1 = require_transport();
    var rpc_js_1 = require_rpc2();
    var createTransport_js_1 = require_createTransport();
    function webSocket(url, config = {}) {
      const { key = "webSocket", name = "WebSocket JSON-RPC", retryDelay } = config;
      return ({ chain, retryCount: retryCount_, timeout: timeout_ }) => {
        const retryCount = config.retryCount ?? retryCount_;
        const timeout = timeout_ ?? config.timeout ?? 1e4;
        const url_ = url || chain?.rpcUrls.default.webSocket?.[0];
        if (!url_)
          throw new transport_js_1.UrlRequiredError();
        return (0, createTransport_js_1.createTransport)({
          key,
          name,
          async request({ method, params }) {
            const body = { method, params };
            const socket = await (0, rpc_js_1.getSocket)(url_);
            const { error, result } = await rpc_js_1.rpc.webSocketAsync(socket, {
              body,
              timeout
            });
            if (error)
              throw new request_js_1.RpcRequestError({
                body,
                error,
                url: url_
              });
            return result;
          },
          retryCount,
          retryDelay,
          timeout,
          type: "webSocket"
        }, {
          getSocket() {
            return (0, rpc_js_1.getSocket)(url_);
          },
          async subscribe({ params, onData, onError }) {
            const socket = await (0, rpc_js_1.getSocket)(url_);
            const { result: subscriptionId } = await new Promise((resolve, reject) => rpc_js_1.rpc.webSocket(socket, {
              body: {
                method: "eth_subscribe",
                params
              },
              onResponse(response) {
                if (response.error) {
                  reject(response.error);
                  onError?.(response.error);
                  return;
                }
                if (typeof response.id === "number") {
                  resolve(response);
                  return;
                }
                if (response.method !== "eth_subscription")
                  return;
                onData(response.params);
              }
            }));
            return {
              subscriptionId,
              async unsubscribe() {
                return new Promise((resolve) => rpc_js_1.rpc.webSocket(socket, {
                  body: {
                    method: "eth_unsubscribe",
                    params: [subscriptionId]
                  },
                  onResponse: resolve
                }));
              }
            };
          }
        });
      };
    }
    exports.webSocket = webSocket;
  }
});

// node_modules/viem/_cjs/constants/address.js
var require_address2 = __commonJS({
  "node_modules/viem/_cjs/constants/address.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.zeroAddress = void 0;
    exports.zeroAddress = "0x0000000000000000000000000000000000000000";
  }
});

// node_modules/viem/_cjs/constants/number.js
var require_number = __commonJS({
  "node_modules/viem/_cjs/constants/number.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.minInt144 = exports.minInt136 = exports.minInt128 = exports.minInt120 = exports.minInt112 = exports.minInt104 = exports.minInt96 = exports.minInt88 = exports.minInt80 = exports.minInt72 = exports.minInt64 = exports.minInt56 = exports.minInt48 = exports.minInt40 = exports.minInt32 = exports.minInt24 = exports.minInt16 = exports.minInt8 = exports.maxInt256 = exports.maxInt248 = exports.maxInt240 = exports.maxInt232 = exports.maxInt224 = exports.maxInt216 = exports.maxInt208 = exports.maxInt200 = exports.maxInt192 = exports.maxInt184 = exports.maxInt176 = exports.maxInt168 = exports.maxInt160 = exports.maxInt152 = exports.maxInt144 = exports.maxInt136 = exports.maxInt128 = exports.maxInt120 = exports.maxInt112 = exports.maxInt104 = exports.maxInt96 = exports.maxInt88 = exports.maxInt80 = exports.maxInt72 = exports.maxInt64 = exports.maxInt56 = exports.maxInt48 = exports.maxInt40 = exports.maxInt32 = exports.maxInt24 = exports.maxInt16 = exports.maxInt8 = void 0;
    exports.maxUint256 = exports.maxUint248 = exports.maxUint240 = exports.maxUint232 = exports.maxUint224 = exports.maxUint216 = exports.maxUint208 = exports.maxUint200 = exports.maxUint192 = exports.maxUint184 = exports.maxUint176 = exports.maxUint168 = exports.maxUint160 = exports.maxUint152 = exports.maxUint144 = exports.maxUint136 = exports.maxUint128 = exports.maxUint120 = exports.maxUint112 = exports.maxUint104 = exports.maxUint96 = exports.maxUint88 = exports.maxUint80 = exports.maxUint72 = exports.maxUint64 = exports.maxUint56 = exports.maxUint48 = exports.maxUint40 = exports.maxUint32 = exports.maxUint24 = exports.maxUint16 = exports.maxUint8 = exports.minInt256 = exports.minInt248 = exports.minInt240 = exports.minInt232 = exports.minInt224 = exports.minInt216 = exports.minInt208 = exports.minInt200 = exports.minInt192 = exports.minInt184 = exports.minInt176 = exports.minInt168 = exports.minInt160 = exports.minInt152 = void 0;
    exports.maxInt8 = 2n ** (8n - 1n) - 1n;
    exports.maxInt16 = 2n ** (16n - 1n) - 1n;
    exports.maxInt24 = 2n ** (24n - 1n) - 1n;
    exports.maxInt32 = 2n ** (32n - 1n) - 1n;
    exports.maxInt40 = 2n ** (40n - 1n) - 1n;
    exports.maxInt48 = 2n ** (48n - 1n) - 1n;
    exports.maxInt56 = 2n ** (56n - 1n) - 1n;
    exports.maxInt64 = 2n ** (64n - 1n) - 1n;
    exports.maxInt72 = 2n ** (72n - 1n) - 1n;
    exports.maxInt80 = 2n ** (80n - 1n) - 1n;
    exports.maxInt88 = 2n ** (88n - 1n) - 1n;
    exports.maxInt96 = 2n ** (96n - 1n) - 1n;
    exports.maxInt104 = 2n ** (104n - 1n) - 1n;
    exports.maxInt112 = 2n ** (112n - 1n) - 1n;
    exports.maxInt120 = 2n ** (120n - 1n) - 1n;
    exports.maxInt128 = 2n ** (128n - 1n) - 1n;
    exports.maxInt136 = 2n ** (136n - 1n) - 1n;
    exports.maxInt144 = 2n ** (144n - 1n) - 1n;
    exports.maxInt152 = 2n ** (152n - 1n) - 1n;
    exports.maxInt160 = 2n ** (160n - 1n) - 1n;
    exports.maxInt168 = 2n ** (168n - 1n) - 1n;
    exports.maxInt176 = 2n ** (176n - 1n) - 1n;
    exports.maxInt184 = 2n ** (184n - 1n) - 1n;
    exports.maxInt192 = 2n ** (192n - 1n) - 1n;
    exports.maxInt200 = 2n ** (200n - 1n) - 1n;
    exports.maxInt208 = 2n ** (208n - 1n) - 1n;
    exports.maxInt216 = 2n ** (216n - 1n) - 1n;
    exports.maxInt224 = 2n ** (224n - 1n) - 1n;
    exports.maxInt232 = 2n ** (232n - 1n) - 1n;
    exports.maxInt240 = 2n ** (240n - 1n) - 1n;
    exports.maxInt248 = 2n ** (248n - 1n) - 1n;
    exports.maxInt256 = 2n ** (256n - 1n) - 1n;
    exports.minInt8 = -(2n ** (8n - 1n));
    exports.minInt16 = -(2n ** (16n - 1n));
    exports.minInt24 = -(2n ** (24n - 1n));
    exports.minInt32 = -(2n ** (32n - 1n));
    exports.minInt40 = -(2n ** (40n - 1n));
    exports.minInt48 = -(2n ** (48n - 1n));
    exports.minInt56 = -(2n ** (56n - 1n));
    exports.minInt64 = -(2n ** (64n - 1n));
    exports.minInt72 = -(2n ** (72n - 1n));
    exports.minInt80 = -(2n ** (80n - 1n));
    exports.minInt88 = -(2n ** (88n - 1n));
    exports.minInt96 = -(2n ** (96n - 1n));
    exports.minInt104 = -(2n ** (104n - 1n));
    exports.minInt112 = -(2n ** (112n - 1n));
    exports.minInt120 = -(2n ** (120n - 1n));
    exports.minInt128 = -(2n ** (128n - 1n));
    exports.minInt136 = -(2n ** (136n - 1n));
    exports.minInt144 = -(2n ** (144n - 1n));
    exports.minInt152 = -(2n ** (152n - 1n));
    exports.minInt160 = -(2n ** (160n - 1n));
    exports.minInt168 = -(2n ** (168n - 1n));
    exports.minInt176 = -(2n ** (176n - 1n));
    exports.minInt184 = -(2n ** (184n - 1n));
    exports.minInt192 = -(2n ** (192n - 1n));
    exports.minInt200 = -(2n ** (200n - 1n));
    exports.minInt208 = -(2n ** (208n - 1n));
    exports.minInt216 = -(2n ** (216n - 1n));
    exports.minInt224 = -(2n ** (224n - 1n));
    exports.minInt232 = -(2n ** (232n - 1n));
    exports.minInt240 = -(2n ** (240n - 1n));
    exports.minInt248 = -(2n ** (248n - 1n));
    exports.minInt256 = -(2n ** (256n - 1n));
    exports.maxUint8 = 2n ** 8n - 1n;
    exports.maxUint16 = 2n ** 16n - 1n;
    exports.maxUint24 = 2n ** 24n - 1n;
    exports.maxUint32 = 2n ** 32n - 1n;
    exports.maxUint40 = 2n ** 40n - 1n;
    exports.maxUint48 = 2n ** 48n - 1n;
    exports.maxUint56 = 2n ** 56n - 1n;
    exports.maxUint64 = 2n ** 64n - 1n;
    exports.maxUint72 = 2n ** 72n - 1n;
    exports.maxUint80 = 2n ** 80n - 1n;
    exports.maxUint88 = 2n ** 88n - 1n;
    exports.maxUint96 = 2n ** 96n - 1n;
    exports.maxUint104 = 2n ** 104n - 1n;
    exports.maxUint112 = 2n ** 112n - 1n;
    exports.maxUint120 = 2n ** 120n - 1n;
    exports.maxUint128 = 2n ** 128n - 1n;
    exports.maxUint136 = 2n ** 136n - 1n;
    exports.maxUint144 = 2n ** 144n - 1n;
    exports.maxUint152 = 2n ** 152n - 1n;
    exports.maxUint160 = 2n ** 160n - 1n;
    exports.maxUint168 = 2n ** 168n - 1n;
    exports.maxUint176 = 2n ** 176n - 1n;
    exports.maxUint184 = 2n ** 184n - 1n;
    exports.maxUint192 = 2n ** 192n - 1n;
    exports.maxUint200 = 2n ** 200n - 1n;
    exports.maxUint208 = 2n ** 208n - 1n;
    exports.maxUint216 = 2n ** 216n - 1n;
    exports.maxUint224 = 2n ** 224n - 1n;
    exports.maxUint232 = 2n ** 232n - 1n;
    exports.maxUint240 = 2n ** 240n - 1n;
    exports.maxUint248 = 2n ** 248n - 1n;
    exports.maxUint256 = 2n ** 256n - 1n;
  }
});

// node_modules/viem/_cjs/utils/abi/decodeDeployData.js
var require_decodeDeployData = __commonJS({
  "node_modules/viem/_cjs/utils/abi/decodeDeployData.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.decodeDeployData = void 0;
    var abi_js_1 = require_abi();
    var decodeAbiParameters_js_1 = require_decodeAbiParameters();
    var docsPath = "/docs/contract/decodeDeployData";
    function decodeDeployData({ abi: abi2, bytecode, data }) {
      if (data === bytecode)
        return { bytecode };
      const description = abi2.find((x) => "type" in x && x.type === "constructor");
      if (!description)
        throw new abi_js_1.AbiConstructorNotFoundError({ docsPath });
      if (!("inputs" in description))
        throw new abi_js_1.AbiConstructorParamsNotFoundError({ docsPath });
      if (!description.inputs || description.inputs.length === 0)
        throw new abi_js_1.AbiConstructorParamsNotFoundError({ docsPath });
      const args = (0, decodeAbiParameters_js_1.decodeAbiParameters)(description.inputs, `0x${data.replace(bytecode, "")}`);
      return { args, bytecode };
    }
    exports.decodeDeployData = decodeDeployData;
  }
});

// node_modules/viem/_cjs/utils/signature/compactSignatureToSignature.js
var require_compactSignatureToSignature = __commonJS({
  "node_modules/viem/_cjs/utils/signature/compactSignatureToSignature.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.compactSignatureToSignature = void 0;
    var toBytes_js_1 = require_toBytes();
    var toHex_js_1 = require_toHex();
    function compactSignatureToSignature({ r, yParityAndS }) {
      const yParityAndS_bytes = (0, toBytes_js_1.hexToBytes)(yParityAndS);
      const v = yParityAndS_bytes[0] & 128 ? 28n : 27n;
      const s = yParityAndS_bytes;
      if (v === 28n)
        s[0] &= 127;
      return { r, s: (0, toHex_js_1.bytesToHex)(s), v };
    }
    exports.compactSignatureToSignature = compactSignatureToSignature;
  }
});

// node_modules/viem/_cjs/utils/signature/hexToCompactSignature.js
var require_hexToCompactSignature = __commonJS({
  "node_modules/viem/_cjs/utils/signature/hexToCompactSignature.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.hexToCompactSignature = void 0;
    var secp256k1_1 = require_secp256k1();
    var toHex_js_1 = require_toHex();
    function hexToCompactSignature(signatureHex) {
      const { r, s } = secp256k1_1.secp256k1.Signature.fromCompact(signatureHex.slice(2, 130));
      return {
        r: (0, toHex_js_1.numberToHex)(r, { size: 32 }),
        yParityAndS: (0, toHex_js_1.numberToHex)(s, { size: 32 })
      };
    }
    exports.hexToCompactSignature = hexToCompactSignature;
  }
});

// node_modules/viem/_cjs/utils/signature/hexToSignature.js
var require_hexToSignature = __commonJS({
  "node_modules/viem/_cjs/utils/signature/hexToSignature.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.hexToSignature = void 0;
    var secp256k1_1 = require_secp256k1();
    var toHex_js_1 = require_toHex();
    function hexToSignature(signatureHex) {
      const { r, s } = secp256k1_1.secp256k1.Signature.fromCompact(signatureHex.slice(2, 130));
      const v = BigInt(`0x${signatureHex.slice(130)}`);
      return { r: (0, toHex_js_1.numberToHex)(r, { size: 32 }), s: (0, toHex_js_1.numberToHex)(s, { size: 32 }), v };
    }
    exports.hexToSignature = hexToSignature;
  }
});

// node_modules/viem/_cjs/utils/signature/signatureToCompactSignature.js
var require_signatureToCompactSignature = __commonJS({
  "node_modules/viem/_cjs/utils/signature/signatureToCompactSignature.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.signatureToCompactSignature = void 0;
    var index_js_1 = require_utils7();
    function signatureToCompactSignature(signature) {
      const { r, s, v } = signature;
      const yParity = v - 27n;
      let yParityAndS = s;
      if (yParity === 1n) {
        const bytes2 = (0, index_js_1.hexToBytes)(s);
        bytes2[0] |= 128;
        yParityAndS = (0, index_js_1.bytesToHex)(bytes2);
      }
      return { r, yParityAndS };
    }
    exports.signatureToCompactSignature = signatureToCompactSignature;
  }
});

// node_modules/viem/_cjs/utils/signature/compactSignatureToHex.js
var require_compactSignatureToHex = __commonJS({
  "node_modules/viem/_cjs/utils/signature/compactSignatureToHex.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.compactSignatureToHex = void 0;
    var secp256k1_1 = require_secp256k1();
    var fromHex_js_1 = require_fromHex();
    function compactSignatureToHex({ r, yParityAndS }) {
      return `0x${new secp256k1_1.secp256k1.Signature((0, fromHex_js_1.hexToBigInt)(r), (0, fromHex_js_1.hexToBigInt)(yParityAndS)).toCompactHex()}`;
    }
    exports.compactSignatureToHex = compactSignatureToHex;
  }
});

// node_modules/viem/_cjs/utils/signature/signatureToHex.js
var require_signatureToHex = __commonJS({
  "node_modules/viem/_cjs/utils/signature/signatureToHex.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.signatureToHex = void 0;
    var secp256k1_1 = require_secp256k1();
    var fromHex_js_1 = require_fromHex();
    var toHex_js_1 = require_toHex();
    function signatureToHex({ r, s, v }) {
      return `0x${new secp256k1_1.secp256k1.Signature((0, fromHex_js_1.hexToBigInt)(r), (0, fromHex_js_1.hexToBigInt)(s)).toCompactHex()}${(0, toHex_js_1.toHex)(v).slice(2)}`;
    }
    exports.signatureToHex = signatureToHex;
  }
});

// node_modules/viem/_cjs/index.js
var require_cjs4 = __commonJS({
  "node_modules/viem/_cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.maxInt112 = exports.maxInt104 = exports.maxInt96 = exports.maxInt88 = exports.maxInt80 = exports.maxInt72 = exports.maxInt64 = exports.maxInt56 = exports.maxInt48 = exports.maxInt40 = exports.maxInt32 = exports.maxInt24 = exports.maxInt16 = exports.maxInt8 = exports.weiUnits = exports.gweiUnits = exports.etherUnits = exports.zeroAddress = exports.multicall3Abi = exports.webSocket = exports.createWalletClient = exports.createTransport = exports.walletActions = exports.testActions = exports.publicActions = exports.createTestClient = exports.createPublicClient = exports.http = exports.fallback = exports.custom = exports.createClient = exports.getContract = exports.parseAbiParameters = exports.parseAbiParameter = exports.parseAbiItem = exports.parseAbi = exports.UnknownSignatureError = exports.UnknownTypeError = exports.SolidityProtectedKeywordError = exports.InvalidStructSignatureError = exports.InvalidSignatureError = exports.InvalidParenthesisError = exports.InvalidParameterError = exports.InvalidModifierError = exports.InvalidFunctionModifierError = exports.InvalidAbiTypeParameterError = exports.InvalidAbiItemError = exports.InvalidAbiParametersError = exports.InvalidAbiParameterError = exports.CircularReferenceError = void 0;
    exports.maxUint256 = exports.maxUint248 = exports.maxUint240 = exports.maxUint232 = exports.maxUint224 = exports.maxUint216 = exports.maxUint208 = exports.maxUint200 = exports.maxUint192 = exports.maxUint184 = exports.maxUint176 = exports.maxUint168 = exports.maxUint160 = exports.maxUint152 = exports.maxUint144 = exports.maxUint136 = exports.maxUint128 = exports.maxUint120 = exports.maxUint112 = exports.maxUint104 = exports.maxUint96 = exports.maxUint88 = exports.maxUint80 = exports.maxUint72 = exports.maxUint64 = exports.maxUint56 = exports.maxUint48 = exports.maxUint40 = exports.maxUint32 = exports.maxUint24 = exports.maxUint16 = exports.maxUint8 = exports.maxInt256 = exports.maxInt248 = exports.maxInt240 = exports.maxInt232 = exports.maxInt224 = exports.maxInt216 = exports.maxInt208 = exports.maxInt200 = exports.maxInt192 = exports.maxInt184 = exports.maxInt176 = exports.maxInt168 = exports.maxInt160 = exports.maxInt152 = exports.maxInt144 = exports.maxInt136 = exports.maxInt128 = exports.maxInt120 = void 0;
    exports.BytesSizeMismatchError = exports.AbiFunctionSignatureNotFoundError = exports.AbiFunctionOutputsNotFoundError = exports.AbiFunctionNotFoundError = exports.AbiEventSignatureNotFoundError = exports.AbiEventSignatureEmptyTopicsError = exports.AbiEventNotFoundError = exports.AbiErrorSignatureNotFoundError = exports.AbiErrorNotFoundError = exports.AbiErrorInputsNotFoundError = exports.AbiEncodingBytesSizeMismatchError = exports.AbiEncodingLengthMismatchError = exports.AbiEncodingArrayLengthMismatchError = exports.AbiDecodingZeroDataError = exports.AbiDecodingDataSizeTooSmallError = exports.AbiDecodingDataSizeInvalidError = exports.AbiConstructorParamsNotFoundError = exports.AbiConstructorNotFoundError = exports.minInt256 = exports.minInt248 = exports.minInt240 = exports.minInt232 = exports.minInt224 = exports.minInt216 = exports.minInt208 = exports.minInt200 = exports.minInt192 = exports.minInt184 = exports.minInt176 = exports.minInt168 = exports.minInt160 = exports.minInt152 = exports.minInt144 = exports.minInt136 = exports.minInt128 = exports.minInt120 = exports.minInt112 = exports.minInt104 = exports.minInt96 = exports.minInt88 = exports.minInt80 = exports.minInt72 = exports.minInt64 = exports.minInt56 = exports.minInt48 = exports.minInt40 = exports.minInt32 = exports.minInt24 = exports.minInt16 = exports.minInt8 = void 0;
    exports.OffsetOutOfBoundsError = exports.InvalidHexValueError = exports.InvalidHexBooleanError = exports.IntegerOutOfRangeError = exports.InvalidBytesBooleanError = exports.DataLengthTooShortError = exports.DataLengthTooLongError = exports.InvalidChainIdError = exports.ClientChainNotConfiguredError = exports.ChainNotFoundError = exports.ChainMismatchError = exports.ChainDoesNotSupportContract = exports.UserRejectedRequestError = exports.UnsupportedProviderMethodError = exports.UnknownRpcError = exports.UnauthorizedProviderError = exports.TransactionRejectedRpcError = exports.SwitchChainError = exports.RpcError = exports.ResourceUnavailableRpcError = exports.ResourceNotFoundRpcError = exports.ProviderRpcError = exports.ProviderDisconnectedError = exports.ParseRpcError = exports.MethodNotSupportedRpcError = exports.MethodNotFoundRpcError = exports.LimitExceededRpcError = exports.JsonRpcVersionUnsupportedError = exports.InvalidRequestRpcError = exports.InvalidParamsRpcError = exports.InvalidInputRpcError = exports.InternalRpcError = exports.ChainDisconnectedError = exports.MaxFeePerGasTooLowError = exports.Eip1559FeesNotSupportedError = exports.BaseFeeScalarError = exports.RawContractError = exports.ContractFunctionZeroDataError = exports.ContractFunctionRevertedError = exports.ContractFunctionExecutionError = exports.CallExecutionError = exports.BlockNotFoundError = exports.BaseError = exports.UnsupportedPackedAbiType = exports.InvalidDefinitionTypeError = exports.InvalidArrayError = exports.InvalidAbiEncodingTypeError = exports.InvalidAbiDecodingTypeError = exports.DecodeLogTopicsMismatch = exports.DecodeLogDataMismatch = void 0;
    exports.encodeErrorResult = exports.encodeDeployData = exports.encodeAbiParameters = exports.decodeFunctionResult = exports.decodeFunctionData = exports.decodeEventLog = exports.decodeErrorResult = exports.decodeDeployData = exports.decodeAbiParameters = exports.formatLog = exports.formatBlock = exports.defineBlock = exports.namehash = exports.labelhash = exports.UrlRequiredError = exports.SliceOffsetOutOfBoundsError = exports.SizeExceedsPaddingSizeError = exports.WaitForTransactionReceiptTimeoutError = exports.TransactionReceiptNotFoundError = exports.TransactionNotFoundError = exports.TransactionExecutionError = exports.InvalidStorageKeySizeError = exports.InvalidSerializedTransactionTypeError = exports.InvalidSerializedTransactionError = exports.InvalidSerializableTransactionError = exports.InvalidLegacyVError = exports.FeeConflictError = exports.InvalidAddressError = exports.WebSocketRequestError = exports.TimeoutError = exports.RpcRequestError = exports.HttpRequestError = exports.FilterTypeNotSupportedError = exports.UnknownNodeError = exports.TransactionTypeNotSupportedError = exports.TipAboveFeeCapError = exports.NonceTooLowError = exports.NonceTooHighError = exports.NonceMaxValueError = exports.IntrinsicGasTooLowError = exports.IntrinsicGasTooHighError = exports.InsufficientFundsError = exports.FeeCapTooLowError = exports.FeeCapTooHighError = exports.ExecutionRevertedError = exports.EstimateGasExecutionError = exports.EnsAvatarUnsupportedNamespaceError = exports.EnsAvatarInvalidNftUriError = exports.EnsAvatarUriResolutionError = exports.SizeOverflowError = void 0;
    exports.bytesToBigint = exports.bytesToBigInt = exports.toHex = exports.stringToHex = exports.numberToHex = exports.bytesToHex = exports.boolToHex = exports.toBytes = exports.stringToBytes = exports.numberToBytes = exports.hexToBytes = exports.boolToBytes = exports.assertTransactionLegacy = exports.assertTransactionEIP2930 = exports.assertTransactionEIP1559 = exports.assertRequest = exports.verifyTypedData = exports.verifyMessage = exports.toRlp = exports.hexToRlp = exports.bytesToRlp = exports.signatureToHex = exports.compactSignatureToHex = exports.signatureToCompactSignature = exports.recoverTypedDataAddress = exports.recoverPublicKey = exports.recoverMessageAddress = exports.recoverAddress = exports.hexToSignature = exports.hexToCompactSignature = exports.compactSignatureToSignature = exports.hashTypedData = exports.hashDomain = exports.getTransactionType = exports.getSerializedTransactionType = exports.getCreateAddress = exports.getCreate2Address = exports.getContractAddress = exports.getAbiItem = exports.rpcTransactionType = exports.formatTransactionRequest = exports.defineTransactionRequest = exports.formatTransactionReceipt = exports.defineTransactionReceipt = exports.transactionType = exports.formatTransaction = exports.defineTransaction = exports.encodeFunctionResult = exports.encodeFunctionData = exports.encodeEventTopics = void 0;
    exports.sliceBytes = exports.slice = exports.size = exports.serializeTransaction = exports.serializeAccessList = exports.parseUnits = exports.parseTransaction = exports.parseGwei = exports.parseEther = exports.padHex = exports.padBytes = exports.pad = exports.keccak256 = exports.isHex = exports.isHash = exports.isBytes = exports.isAddressEqual = exports.isAddress = exports.hashMessage = exports.getFunctionSignature = exports.getFunctionSelector = exports.getEventSignature = exports.getEventSelector = exports.getContractError = exports.getAddress = exports.checksumAddress = exports.fromRlp = exports.hexToString = exports.hexToNumber = exports.hexToBool = exports.hexToBigInt = exports.fromHex = exports.formatUnits = exports.formatGwei = exports.formatEther = exports.encodePacked = exports.getChainContractAddress = exports.defineChain = exports.assertCurrentChain = exports.concatHex = exports.concatBytes = exports.concat = exports.offchainLookupSignature = exports.offchainLookupAbiItem = exports.offchainLookup = exports.ccipFetch = exports.fromBytes = exports.bytesToString = exports.bytesToNumber = exports.bytesToBool = void 0;
    exports.getTypesForEIP712Domain = exports.domainSeparator = exports.validateTypedData = exports.trim = exports.stringify = exports.sliceHex = void 0;
    var abitype_1 = require_cjs2();
    Object.defineProperty(exports, "CircularReferenceError", { enumerable: true, get: function() {
      return abitype_1.CircularReferenceError;
    } });
    Object.defineProperty(exports, "InvalidAbiParameterError", { enumerable: true, get: function() {
      return abitype_1.InvalidAbiParameterError;
    } });
    Object.defineProperty(exports, "InvalidAbiParametersError", { enumerable: true, get: function() {
      return abitype_1.InvalidAbiParametersError;
    } });
    Object.defineProperty(exports, "InvalidAbiItemError", { enumerable: true, get: function() {
      return abitype_1.InvalidAbiItemError;
    } });
    Object.defineProperty(exports, "InvalidAbiTypeParameterError", { enumerable: true, get: function() {
      return abitype_1.InvalidAbiTypeParameterError;
    } });
    Object.defineProperty(exports, "InvalidFunctionModifierError", { enumerable: true, get: function() {
      return abitype_1.InvalidFunctionModifierError;
    } });
    Object.defineProperty(exports, "InvalidModifierError", { enumerable: true, get: function() {
      return abitype_1.InvalidModifierError;
    } });
    Object.defineProperty(exports, "InvalidParameterError", { enumerable: true, get: function() {
      return abitype_1.InvalidParameterError;
    } });
    Object.defineProperty(exports, "InvalidParenthesisError", { enumerable: true, get: function() {
      return abitype_1.InvalidParenthesisError;
    } });
    Object.defineProperty(exports, "InvalidSignatureError", { enumerable: true, get: function() {
      return abitype_1.InvalidSignatureError;
    } });
    Object.defineProperty(exports, "InvalidStructSignatureError", { enumerable: true, get: function() {
      return abitype_1.InvalidStructSignatureError;
    } });
    Object.defineProperty(exports, "SolidityProtectedKeywordError", { enumerable: true, get: function() {
      return abitype_1.SolidityProtectedKeywordError;
    } });
    Object.defineProperty(exports, "UnknownTypeError", { enumerable: true, get: function() {
      return abitype_1.UnknownTypeError;
    } });
    Object.defineProperty(exports, "UnknownSignatureError", { enumerable: true, get: function() {
      return abitype_1.UnknownSignatureError;
    } });
    Object.defineProperty(exports, "parseAbi", { enumerable: true, get: function() {
      return abitype_1.parseAbi;
    } });
    Object.defineProperty(exports, "parseAbiItem", { enumerable: true, get: function() {
      return abitype_1.parseAbiItem;
    } });
    Object.defineProperty(exports, "parseAbiParameter", { enumerable: true, get: function() {
      return abitype_1.parseAbiParameter;
    } });
    Object.defineProperty(exports, "parseAbiParameters", { enumerable: true, get: function() {
      return abitype_1.parseAbiParameters;
    } });
    var getContract_js_1 = require_getContract();
    Object.defineProperty(exports, "getContract", { enumerable: true, get: function() {
      return getContract_js_1.getContract;
    } });
    var createClient_js_1 = require_createClient();
    Object.defineProperty(exports, "createClient", { enumerable: true, get: function() {
      return createClient_js_1.createClient;
    } });
    var custom_js_1 = require_custom();
    Object.defineProperty(exports, "custom", { enumerable: true, get: function() {
      return custom_js_1.custom;
    } });
    var fallback_js_1 = require_fallback();
    Object.defineProperty(exports, "fallback", { enumerable: true, get: function() {
      return fallback_js_1.fallback;
    } });
    var http_js_1 = require_http();
    Object.defineProperty(exports, "http", { enumerable: true, get: function() {
      return http_js_1.http;
    } });
    var createPublicClient_js_1 = require_createPublicClient();
    Object.defineProperty(exports, "createPublicClient", { enumerable: true, get: function() {
      return createPublicClient_js_1.createPublicClient;
    } });
    var createTestClient_js_1 = require_createTestClient();
    Object.defineProperty(exports, "createTestClient", { enumerable: true, get: function() {
      return createTestClient_js_1.createTestClient;
    } });
    var public_js_1 = require_public();
    Object.defineProperty(exports, "publicActions", { enumerable: true, get: function() {
      return public_js_1.publicActions;
    } });
    var test_js_1 = require_test();
    Object.defineProperty(exports, "testActions", { enumerable: true, get: function() {
      return test_js_1.testActions;
    } });
    var wallet_js_1 = require_wallet();
    Object.defineProperty(exports, "walletActions", { enumerable: true, get: function() {
      return wallet_js_1.walletActions;
    } });
    var createTransport_js_1 = require_createTransport();
    Object.defineProperty(exports, "createTransport", { enumerable: true, get: function() {
      return createTransport_js_1.createTransport;
    } });
    var createWalletClient_js_1 = require_createWalletClient();
    Object.defineProperty(exports, "createWalletClient", { enumerable: true, get: function() {
      return createWalletClient_js_1.createWalletClient;
    } });
    var webSocket_js_1 = require_webSocket();
    Object.defineProperty(exports, "webSocket", { enumerable: true, get: function() {
      return webSocket_js_1.webSocket;
    } });
    var abis_js_1 = require_abis();
    Object.defineProperty(exports, "multicall3Abi", { enumerable: true, get: function() {
      return abis_js_1.multicall3Abi;
    } });
    var address_js_1 = require_address2();
    Object.defineProperty(exports, "zeroAddress", { enumerable: true, get: function() {
      return address_js_1.zeroAddress;
    } });
    var unit_js_1 = require_unit();
    Object.defineProperty(exports, "etherUnits", { enumerable: true, get: function() {
      return unit_js_1.etherUnits;
    } });
    Object.defineProperty(exports, "gweiUnits", { enumerable: true, get: function() {
      return unit_js_1.gweiUnits;
    } });
    Object.defineProperty(exports, "weiUnits", { enumerable: true, get: function() {
      return unit_js_1.weiUnits;
    } });
    var number_js_1 = require_number();
    Object.defineProperty(exports, "maxInt8", { enumerable: true, get: function() {
      return number_js_1.maxInt8;
    } });
    Object.defineProperty(exports, "maxInt16", { enumerable: true, get: function() {
      return number_js_1.maxInt16;
    } });
    Object.defineProperty(exports, "maxInt24", { enumerable: true, get: function() {
      return number_js_1.maxInt24;
    } });
    Object.defineProperty(exports, "maxInt32", { enumerable: true, get: function() {
      return number_js_1.maxInt32;
    } });
    Object.defineProperty(exports, "maxInt40", { enumerable: true, get: function() {
      return number_js_1.maxInt40;
    } });
    Object.defineProperty(exports, "maxInt48", { enumerable: true, get: function() {
      return number_js_1.maxInt48;
    } });
    Object.defineProperty(exports, "maxInt56", { enumerable: true, get: function() {
      return number_js_1.maxInt56;
    } });
    Object.defineProperty(exports, "maxInt64", { enumerable: true, get: function() {
      return number_js_1.maxInt64;
    } });
    Object.defineProperty(exports, "maxInt72", { enumerable: true, get: function() {
      return number_js_1.maxInt72;
    } });
    Object.defineProperty(exports, "maxInt80", { enumerable: true, get: function() {
      return number_js_1.maxInt80;
    } });
    Object.defineProperty(exports, "maxInt88", { enumerable: true, get: function() {
      return number_js_1.maxInt88;
    } });
    Object.defineProperty(exports, "maxInt96", { enumerable: true, get: function() {
      return number_js_1.maxInt96;
    } });
    Object.defineProperty(exports, "maxInt104", { enumerable: true, get: function() {
      return number_js_1.maxInt104;
    } });
    Object.defineProperty(exports, "maxInt112", { enumerable: true, get: function() {
      return number_js_1.maxInt112;
    } });
    Object.defineProperty(exports, "maxInt120", { enumerable: true, get: function() {
      return number_js_1.maxInt120;
    } });
    Object.defineProperty(exports, "maxInt128", { enumerable: true, get: function() {
      return number_js_1.maxInt128;
    } });
    Object.defineProperty(exports, "maxInt136", { enumerable: true, get: function() {
      return number_js_1.maxInt136;
    } });
    Object.defineProperty(exports, "maxInt144", { enumerable: true, get: function() {
      return number_js_1.maxInt144;
    } });
    Object.defineProperty(exports, "maxInt152", { enumerable: true, get: function() {
      return number_js_1.maxInt152;
    } });
    Object.defineProperty(exports, "maxInt160", { enumerable: true, get: function() {
      return number_js_1.maxInt160;
    } });
    Object.defineProperty(exports, "maxInt168", { enumerable: true, get: function() {
      return number_js_1.maxInt168;
    } });
    Object.defineProperty(exports, "maxInt176", { enumerable: true, get: function() {
      return number_js_1.maxInt176;
    } });
    Object.defineProperty(exports, "maxInt184", { enumerable: true, get: function() {
      return number_js_1.maxInt184;
    } });
    Object.defineProperty(exports, "maxInt192", { enumerable: true, get: function() {
      return number_js_1.maxInt192;
    } });
    Object.defineProperty(exports, "maxInt200", { enumerable: true, get: function() {
      return number_js_1.maxInt200;
    } });
    Object.defineProperty(exports, "maxInt208", { enumerable: true, get: function() {
      return number_js_1.maxInt208;
    } });
    Object.defineProperty(exports, "maxInt216", { enumerable: true, get: function() {
      return number_js_1.maxInt216;
    } });
    Object.defineProperty(exports, "maxInt224", { enumerable: true, get: function() {
      return number_js_1.maxInt224;
    } });
    Object.defineProperty(exports, "maxInt232", { enumerable: true, get: function() {
      return number_js_1.maxInt232;
    } });
    Object.defineProperty(exports, "maxInt240", { enumerable: true, get: function() {
      return number_js_1.maxInt240;
    } });
    Object.defineProperty(exports, "maxInt248", { enumerable: true, get: function() {
      return number_js_1.maxInt248;
    } });
    Object.defineProperty(exports, "maxInt256", { enumerable: true, get: function() {
      return number_js_1.maxInt256;
    } });
    Object.defineProperty(exports, "maxUint8", { enumerable: true, get: function() {
      return number_js_1.maxUint8;
    } });
    Object.defineProperty(exports, "maxUint16", { enumerable: true, get: function() {
      return number_js_1.maxUint16;
    } });
    Object.defineProperty(exports, "maxUint24", { enumerable: true, get: function() {
      return number_js_1.maxUint24;
    } });
    Object.defineProperty(exports, "maxUint32", { enumerable: true, get: function() {
      return number_js_1.maxUint32;
    } });
    Object.defineProperty(exports, "maxUint40", { enumerable: true, get: function() {
      return number_js_1.maxUint40;
    } });
    Object.defineProperty(exports, "maxUint48", { enumerable: true, get: function() {
      return number_js_1.maxUint48;
    } });
    Object.defineProperty(exports, "maxUint56", { enumerable: true, get: function() {
      return number_js_1.maxUint56;
    } });
    Object.defineProperty(exports, "maxUint64", { enumerable: true, get: function() {
      return number_js_1.maxUint64;
    } });
    Object.defineProperty(exports, "maxUint72", { enumerable: true, get: function() {
      return number_js_1.maxUint72;
    } });
    Object.defineProperty(exports, "maxUint80", { enumerable: true, get: function() {
      return number_js_1.maxUint80;
    } });
    Object.defineProperty(exports, "maxUint88", { enumerable: true, get: function() {
      return number_js_1.maxUint88;
    } });
    Object.defineProperty(exports, "maxUint96", { enumerable: true, get: function() {
      return number_js_1.maxUint96;
    } });
    Object.defineProperty(exports, "maxUint104", { enumerable: true, get: function() {
      return number_js_1.maxUint104;
    } });
    Object.defineProperty(exports, "maxUint112", { enumerable: true, get: function() {
      return number_js_1.maxUint112;
    } });
    Object.defineProperty(exports, "maxUint120", { enumerable: true, get: function() {
      return number_js_1.maxUint120;
    } });
    Object.defineProperty(exports, "maxUint128", { enumerable: true, get: function() {
      return number_js_1.maxUint128;
    } });
    Object.defineProperty(exports, "maxUint136", { enumerable: true, get: function() {
      return number_js_1.maxUint136;
    } });
    Object.defineProperty(exports, "maxUint144", { enumerable: true, get: function() {
      return number_js_1.maxUint144;
    } });
    Object.defineProperty(exports, "maxUint152", { enumerable: true, get: function() {
      return number_js_1.maxUint152;
    } });
    Object.defineProperty(exports, "maxUint160", { enumerable: true, get: function() {
      return number_js_1.maxUint160;
    } });
    Object.defineProperty(exports, "maxUint168", { enumerable: true, get: function() {
      return number_js_1.maxUint168;
    } });
    Object.defineProperty(exports, "maxUint176", { enumerable: true, get: function() {
      return number_js_1.maxUint176;
    } });
    Object.defineProperty(exports, "maxUint184", { enumerable: true, get: function() {
      return number_js_1.maxUint184;
    } });
    Object.defineProperty(exports, "maxUint192", { enumerable: true, get: function() {
      return number_js_1.maxUint192;
    } });
    Object.defineProperty(exports, "maxUint200", { enumerable: true, get: function() {
      return number_js_1.maxUint200;
    } });
    Object.defineProperty(exports, "maxUint208", { enumerable: true, get: function() {
      return number_js_1.maxUint208;
    } });
    Object.defineProperty(exports, "maxUint216", { enumerable: true, get: function() {
      return number_js_1.maxUint216;
    } });
    Object.defineProperty(exports, "maxUint224", { enumerable: true, get: function() {
      return number_js_1.maxUint224;
    } });
    Object.defineProperty(exports, "maxUint232", { enumerable: true, get: function() {
      return number_js_1.maxUint232;
    } });
    Object.defineProperty(exports, "maxUint240", { enumerable: true, get: function() {
      return number_js_1.maxUint240;
    } });
    Object.defineProperty(exports, "maxUint248", { enumerable: true, get: function() {
      return number_js_1.maxUint248;
    } });
    Object.defineProperty(exports, "maxUint256", { enumerable: true, get: function() {
      return number_js_1.maxUint256;
    } });
    Object.defineProperty(exports, "minInt8", { enumerable: true, get: function() {
      return number_js_1.minInt8;
    } });
    Object.defineProperty(exports, "minInt16", { enumerable: true, get: function() {
      return number_js_1.minInt16;
    } });
    Object.defineProperty(exports, "minInt24", { enumerable: true, get: function() {
      return number_js_1.minInt24;
    } });
    Object.defineProperty(exports, "minInt32", { enumerable: true, get: function() {
      return number_js_1.minInt32;
    } });
    Object.defineProperty(exports, "minInt40", { enumerable: true, get: function() {
      return number_js_1.minInt40;
    } });
    Object.defineProperty(exports, "minInt48", { enumerable: true, get: function() {
      return number_js_1.minInt48;
    } });
    Object.defineProperty(exports, "minInt56", { enumerable: true, get: function() {
      return number_js_1.minInt56;
    } });
    Object.defineProperty(exports, "minInt64", { enumerable: true, get: function() {
      return number_js_1.minInt64;
    } });
    Object.defineProperty(exports, "minInt72", { enumerable: true, get: function() {
      return number_js_1.minInt72;
    } });
    Object.defineProperty(exports, "minInt80", { enumerable: true, get: function() {
      return number_js_1.minInt80;
    } });
    Object.defineProperty(exports, "minInt88", { enumerable: true, get: function() {
      return number_js_1.minInt88;
    } });
    Object.defineProperty(exports, "minInt96", { enumerable: true, get: function() {
      return number_js_1.minInt96;
    } });
    Object.defineProperty(exports, "minInt104", { enumerable: true, get: function() {
      return number_js_1.minInt104;
    } });
    Object.defineProperty(exports, "minInt112", { enumerable: true, get: function() {
      return number_js_1.minInt112;
    } });
    Object.defineProperty(exports, "minInt120", { enumerable: true, get: function() {
      return number_js_1.minInt120;
    } });
    Object.defineProperty(exports, "minInt128", { enumerable: true, get: function() {
      return number_js_1.minInt128;
    } });
    Object.defineProperty(exports, "minInt136", { enumerable: true, get: function() {
      return number_js_1.minInt136;
    } });
    Object.defineProperty(exports, "minInt144", { enumerable: true, get: function() {
      return number_js_1.minInt144;
    } });
    Object.defineProperty(exports, "minInt152", { enumerable: true, get: function() {
      return number_js_1.minInt152;
    } });
    Object.defineProperty(exports, "minInt160", { enumerable: true, get: function() {
      return number_js_1.minInt160;
    } });
    Object.defineProperty(exports, "minInt168", { enumerable: true, get: function() {
      return number_js_1.minInt168;
    } });
    Object.defineProperty(exports, "minInt176", { enumerable: true, get: function() {
      return number_js_1.minInt176;
    } });
    Object.defineProperty(exports, "minInt184", { enumerable: true, get: function() {
      return number_js_1.minInt184;
    } });
    Object.defineProperty(exports, "minInt192", { enumerable: true, get: function() {
      return number_js_1.minInt192;
    } });
    Object.defineProperty(exports, "minInt200", { enumerable: true, get: function() {
      return number_js_1.minInt200;
    } });
    Object.defineProperty(exports, "minInt208", { enumerable: true, get: function() {
      return number_js_1.minInt208;
    } });
    Object.defineProperty(exports, "minInt216", { enumerable: true, get: function() {
      return number_js_1.minInt216;
    } });
    Object.defineProperty(exports, "minInt224", { enumerable: true, get: function() {
      return number_js_1.minInt224;
    } });
    Object.defineProperty(exports, "minInt232", { enumerable: true, get: function() {
      return number_js_1.minInt232;
    } });
    Object.defineProperty(exports, "minInt240", { enumerable: true, get: function() {
      return number_js_1.minInt240;
    } });
    Object.defineProperty(exports, "minInt248", { enumerable: true, get: function() {
      return number_js_1.minInt248;
    } });
    Object.defineProperty(exports, "minInt256", { enumerable: true, get: function() {
      return number_js_1.minInt256;
    } });
    var abi_js_1 = require_abi();
    Object.defineProperty(exports, "AbiConstructorNotFoundError", { enumerable: true, get: function() {
      return abi_js_1.AbiConstructorNotFoundError;
    } });
    Object.defineProperty(exports, "AbiConstructorParamsNotFoundError", { enumerable: true, get: function() {
      return abi_js_1.AbiConstructorParamsNotFoundError;
    } });
    Object.defineProperty(exports, "AbiDecodingDataSizeInvalidError", { enumerable: true, get: function() {
      return abi_js_1.AbiDecodingDataSizeInvalidError;
    } });
    Object.defineProperty(exports, "AbiDecodingDataSizeTooSmallError", { enumerable: true, get: function() {
      return abi_js_1.AbiDecodingDataSizeTooSmallError;
    } });
    Object.defineProperty(exports, "AbiDecodingZeroDataError", { enumerable: true, get: function() {
      return abi_js_1.AbiDecodingZeroDataError;
    } });
    Object.defineProperty(exports, "AbiEncodingArrayLengthMismatchError", { enumerable: true, get: function() {
      return abi_js_1.AbiEncodingArrayLengthMismatchError;
    } });
    Object.defineProperty(exports, "AbiEncodingLengthMismatchError", { enumerable: true, get: function() {
      return abi_js_1.AbiEncodingLengthMismatchError;
    } });
    Object.defineProperty(exports, "AbiEncodingBytesSizeMismatchError", { enumerable: true, get: function() {
      return abi_js_1.AbiEncodingBytesSizeMismatchError;
    } });
    Object.defineProperty(exports, "AbiErrorInputsNotFoundError", { enumerable: true, get: function() {
      return abi_js_1.AbiErrorInputsNotFoundError;
    } });
    Object.defineProperty(exports, "AbiErrorNotFoundError", { enumerable: true, get: function() {
      return abi_js_1.AbiErrorNotFoundError;
    } });
    Object.defineProperty(exports, "AbiErrorSignatureNotFoundError", { enumerable: true, get: function() {
      return abi_js_1.AbiErrorSignatureNotFoundError;
    } });
    Object.defineProperty(exports, "AbiEventNotFoundError", { enumerable: true, get: function() {
      return abi_js_1.AbiEventNotFoundError;
    } });
    Object.defineProperty(exports, "AbiEventSignatureEmptyTopicsError", { enumerable: true, get: function() {
      return abi_js_1.AbiEventSignatureEmptyTopicsError;
    } });
    Object.defineProperty(exports, "AbiEventSignatureNotFoundError", { enumerable: true, get: function() {
      return abi_js_1.AbiEventSignatureNotFoundError;
    } });
    Object.defineProperty(exports, "AbiFunctionNotFoundError", { enumerable: true, get: function() {
      return abi_js_1.AbiFunctionNotFoundError;
    } });
    Object.defineProperty(exports, "AbiFunctionOutputsNotFoundError", { enumerable: true, get: function() {
      return abi_js_1.AbiFunctionOutputsNotFoundError;
    } });
    Object.defineProperty(exports, "AbiFunctionSignatureNotFoundError", { enumerable: true, get: function() {
      return abi_js_1.AbiFunctionSignatureNotFoundError;
    } });
    Object.defineProperty(exports, "BytesSizeMismatchError", { enumerable: true, get: function() {
      return abi_js_1.BytesSizeMismatchError;
    } });
    Object.defineProperty(exports, "DecodeLogDataMismatch", { enumerable: true, get: function() {
      return abi_js_1.DecodeLogDataMismatch;
    } });
    Object.defineProperty(exports, "DecodeLogTopicsMismatch", { enumerable: true, get: function() {
      return abi_js_1.DecodeLogTopicsMismatch;
    } });
    Object.defineProperty(exports, "InvalidAbiDecodingTypeError", { enumerable: true, get: function() {
      return abi_js_1.InvalidAbiDecodingTypeError;
    } });
    Object.defineProperty(exports, "InvalidAbiEncodingTypeError", { enumerable: true, get: function() {
      return abi_js_1.InvalidAbiEncodingTypeError;
    } });
    Object.defineProperty(exports, "InvalidArrayError", { enumerable: true, get: function() {
      return abi_js_1.InvalidArrayError;
    } });
    Object.defineProperty(exports, "InvalidDefinitionTypeError", { enumerable: true, get: function() {
      return abi_js_1.InvalidDefinitionTypeError;
    } });
    Object.defineProperty(exports, "UnsupportedPackedAbiType", { enumerable: true, get: function() {
      return abi_js_1.UnsupportedPackedAbiType;
    } });
    var base_js_1 = require_base();
    Object.defineProperty(exports, "BaseError", { enumerable: true, get: function() {
      return base_js_1.BaseError;
    } });
    var block_js_1 = require_block();
    Object.defineProperty(exports, "BlockNotFoundError", { enumerable: true, get: function() {
      return block_js_1.BlockNotFoundError;
    } });
    var contract_js_1 = require_contract();
    Object.defineProperty(exports, "CallExecutionError", { enumerable: true, get: function() {
      return contract_js_1.CallExecutionError;
    } });
    Object.defineProperty(exports, "ContractFunctionExecutionError", { enumerable: true, get: function() {
      return contract_js_1.ContractFunctionExecutionError;
    } });
    Object.defineProperty(exports, "ContractFunctionRevertedError", { enumerable: true, get: function() {
      return contract_js_1.ContractFunctionRevertedError;
    } });
    Object.defineProperty(exports, "ContractFunctionZeroDataError", { enumerable: true, get: function() {
      return contract_js_1.ContractFunctionZeroDataError;
    } });
    Object.defineProperty(exports, "RawContractError", { enumerable: true, get: function() {
      return contract_js_1.RawContractError;
    } });
    var fee_js_1 = require_fee();
    Object.defineProperty(exports, "BaseFeeScalarError", { enumerable: true, get: function() {
      return fee_js_1.BaseFeeScalarError;
    } });
    Object.defineProperty(exports, "Eip1559FeesNotSupportedError", { enumerable: true, get: function() {
      return fee_js_1.Eip1559FeesNotSupportedError;
    } });
    Object.defineProperty(exports, "MaxFeePerGasTooLowError", { enumerable: true, get: function() {
      return fee_js_1.MaxFeePerGasTooLowError;
    } });
    var rpc_js_1 = require_rpc();
    Object.defineProperty(exports, "ChainDisconnectedError", { enumerable: true, get: function() {
      return rpc_js_1.ChainDisconnectedError;
    } });
    Object.defineProperty(exports, "InternalRpcError", { enumerable: true, get: function() {
      return rpc_js_1.InternalRpcError;
    } });
    Object.defineProperty(exports, "InvalidInputRpcError", { enumerable: true, get: function() {
      return rpc_js_1.InvalidInputRpcError;
    } });
    Object.defineProperty(exports, "InvalidParamsRpcError", { enumerable: true, get: function() {
      return rpc_js_1.InvalidParamsRpcError;
    } });
    Object.defineProperty(exports, "InvalidRequestRpcError", { enumerable: true, get: function() {
      return rpc_js_1.InvalidRequestRpcError;
    } });
    Object.defineProperty(exports, "JsonRpcVersionUnsupportedError", { enumerable: true, get: function() {
      return rpc_js_1.JsonRpcVersionUnsupportedError;
    } });
    Object.defineProperty(exports, "LimitExceededRpcError", { enumerable: true, get: function() {
      return rpc_js_1.LimitExceededRpcError;
    } });
    Object.defineProperty(exports, "MethodNotFoundRpcError", { enumerable: true, get: function() {
      return rpc_js_1.MethodNotFoundRpcError;
    } });
    Object.defineProperty(exports, "MethodNotSupportedRpcError", { enumerable: true, get: function() {
      return rpc_js_1.MethodNotSupportedRpcError;
    } });
    Object.defineProperty(exports, "ParseRpcError", { enumerable: true, get: function() {
      return rpc_js_1.ParseRpcError;
    } });
    Object.defineProperty(exports, "ProviderDisconnectedError", { enumerable: true, get: function() {
      return rpc_js_1.ProviderDisconnectedError;
    } });
    Object.defineProperty(exports, "ProviderRpcError", { enumerable: true, get: function() {
      return rpc_js_1.ProviderRpcError;
    } });
    Object.defineProperty(exports, "ResourceNotFoundRpcError", { enumerable: true, get: function() {
      return rpc_js_1.ResourceNotFoundRpcError;
    } });
    Object.defineProperty(exports, "ResourceUnavailableRpcError", { enumerable: true, get: function() {
      return rpc_js_1.ResourceUnavailableRpcError;
    } });
    Object.defineProperty(exports, "RpcError", { enumerable: true, get: function() {
      return rpc_js_1.RpcError;
    } });
    Object.defineProperty(exports, "SwitchChainError", { enumerable: true, get: function() {
      return rpc_js_1.SwitchChainError;
    } });
    Object.defineProperty(exports, "TransactionRejectedRpcError", { enumerable: true, get: function() {
      return rpc_js_1.TransactionRejectedRpcError;
    } });
    Object.defineProperty(exports, "UnauthorizedProviderError", { enumerable: true, get: function() {
      return rpc_js_1.UnauthorizedProviderError;
    } });
    Object.defineProperty(exports, "UnknownRpcError", { enumerable: true, get: function() {
      return rpc_js_1.UnknownRpcError;
    } });
    Object.defineProperty(exports, "UnsupportedProviderMethodError", { enumerable: true, get: function() {
      return rpc_js_1.UnsupportedProviderMethodError;
    } });
    Object.defineProperty(exports, "UserRejectedRequestError", { enumerable: true, get: function() {
      return rpc_js_1.UserRejectedRequestError;
    } });
    var chain_js_1 = require_chain();
    Object.defineProperty(exports, "ChainDoesNotSupportContract", { enumerable: true, get: function() {
      return chain_js_1.ChainDoesNotSupportContract;
    } });
    Object.defineProperty(exports, "ChainMismatchError", { enumerable: true, get: function() {
      return chain_js_1.ChainMismatchError;
    } });
    Object.defineProperty(exports, "ChainNotFoundError", { enumerable: true, get: function() {
      return chain_js_1.ChainNotFoundError;
    } });
    Object.defineProperty(exports, "ClientChainNotConfiguredError", { enumerable: true, get: function() {
      return chain_js_1.ClientChainNotConfiguredError;
    } });
    Object.defineProperty(exports, "InvalidChainIdError", { enumerable: true, get: function() {
      return chain_js_1.InvalidChainIdError;
    } });
    var encoding_js_1 = require_encoding();
    Object.defineProperty(exports, "DataLengthTooLongError", { enumerable: true, get: function() {
      return encoding_js_1.DataLengthTooLongError;
    } });
    Object.defineProperty(exports, "DataLengthTooShortError", { enumerable: true, get: function() {
      return encoding_js_1.DataLengthTooShortError;
    } });
    Object.defineProperty(exports, "InvalidBytesBooleanError", { enumerable: true, get: function() {
      return encoding_js_1.InvalidBytesBooleanError;
    } });
    Object.defineProperty(exports, "IntegerOutOfRangeError", { enumerable: true, get: function() {
      return encoding_js_1.IntegerOutOfRangeError;
    } });
    Object.defineProperty(exports, "InvalidHexBooleanError", { enumerable: true, get: function() {
      return encoding_js_1.InvalidHexBooleanError;
    } });
    Object.defineProperty(exports, "InvalidHexValueError", { enumerable: true, get: function() {
      return encoding_js_1.InvalidHexValueError;
    } });
    Object.defineProperty(exports, "OffsetOutOfBoundsError", { enumerable: true, get: function() {
      return encoding_js_1.OffsetOutOfBoundsError;
    } });
    Object.defineProperty(exports, "SizeOverflowError", { enumerable: true, get: function() {
      return encoding_js_1.SizeOverflowError;
    } });
    var ens_js_1 = require_ens();
    Object.defineProperty(exports, "EnsAvatarUriResolutionError", { enumerable: true, get: function() {
      return ens_js_1.EnsAvatarUriResolutionError;
    } });
    Object.defineProperty(exports, "EnsAvatarInvalidNftUriError", { enumerable: true, get: function() {
      return ens_js_1.EnsAvatarInvalidNftUriError;
    } });
    Object.defineProperty(exports, "EnsAvatarUnsupportedNamespaceError", { enumerable: true, get: function() {
      return ens_js_1.EnsAvatarUnsupportedNamespaceError;
    } });
    var estimateGas_js_1 = require_estimateGas();
    Object.defineProperty(exports, "EstimateGasExecutionError", { enumerable: true, get: function() {
      return estimateGas_js_1.EstimateGasExecutionError;
    } });
    var node_js_1 = require_node();
    Object.defineProperty(exports, "ExecutionRevertedError", { enumerable: true, get: function() {
      return node_js_1.ExecutionRevertedError;
    } });
    Object.defineProperty(exports, "FeeCapTooHighError", { enumerable: true, get: function() {
      return node_js_1.FeeCapTooHighError;
    } });
    Object.defineProperty(exports, "FeeCapTooLowError", { enumerable: true, get: function() {
      return node_js_1.FeeCapTooLowError;
    } });
    Object.defineProperty(exports, "InsufficientFundsError", { enumerable: true, get: function() {
      return node_js_1.InsufficientFundsError;
    } });
    Object.defineProperty(exports, "IntrinsicGasTooHighError", { enumerable: true, get: function() {
      return node_js_1.IntrinsicGasTooHighError;
    } });
    Object.defineProperty(exports, "IntrinsicGasTooLowError", { enumerable: true, get: function() {
      return node_js_1.IntrinsicGasTooLowError;
    } });
    Object.defineProperty(exports, "NonceMaxValueError", { enumerable: true, get: function() {
      return node_js_1.NonceMaxValueError;
    } });
    Object.defineProperty(exports, "NonceTooHighError", { enumerable: true, get: function() {
      return node_js_1.NonceTooHighError;
    } });
    Object.defineProperty(exports, "NonceTooLowError", { enumerable: true, get: function() {
      return node_js_1.NonceTooLowError;
    } });
    Object.defineProperty(exports, "TipAboveFeeCapError", { enumerable: true, get: function() {
      return node_js_1.TipAboveFeeCapError;
    } });
    Object.defineProperty(exports, "TransactionTypeNotSupportedError", { enumerable: true, get: function() {
      return node_js_1.TransactionTypeNotSupportedError;
    } });
    Object.defineProperty(exports, "UnknownNodeError", { enumerable: true, get: function() {
      return node_js_1.UnknownNodeError;
    } });
    var log_js_1 = require_log();
    Object.defineProperty(exports, "FilterTypeNotSupportedError", { enumerable: true, get: function() {
      return log_js_1.FilterTypeNotSupportedError;
    } });
    var request_js_1 = require_request();
    Object.defineProperty(exports, "HttpRequestError", { enumerable: true, get: function() {
      return request_js_1.HttpRequestError;
    } });
    Object.defineProperty(exports, "RpcRequestError", { enumerable: true, get: function() {
      return request_js_1.RpcRequestError;
    } });
    Object.defineProperty(exports, "TimeoutError", { enumerable: true, get: function() {
      return request_js_1.TimeoutError;
    } });
    Object.defineProperty(exports, "WebSocketRequestError", { enumerable: true, get: function() {
      return request_js_1.WebSocketRequestError;
    } });
    var address_js_2 = require_address();
    Object.defineProperty(exports, "InvalidAddressError", { enumerable: true, get: function() {
      return address_js_2.InvalidAddressError;
    } });
    var transaction_js_1 = require_transaction();
    Object.defineProperty(exports, "FeeConflictError", { enumerable: true, get: function() {
      return transaction_js_1.FeeConflictError;
    } });
    Object.defineProperty(exports, "InvalidLegacyVError", { enumerable: true, get: function() {
      return transaction_js_1.InvalidLegacyVError;
    } });
    Object.defineProperty(exports, "InvalidSerializableTransactionError", { enumerable: true, get: function() {
      return transaction_js_1.InvalidSerializableTransactionError;
    } });
    Object.defineProperty(exports, "InvalidSerializedTransactionError", { enumerable: true, get: function() {
      return transaction_js_1.InvalidSerializedTransactionError;
    } });
    Object.defineProperty(exports, "InvalidSerializedTransactionTypeError", { enumerable: true, get: function() {
      return transaction_js_1.InvalidSerializedTransactionTypeError;
    } });
    Object.defineProperty(exports, "InvalidStorageKeySizeError", { enumerable: true, get: function() {
      return transaction_js_1.InvalidStorageKeySizeError;
    } });
    Object.defineProperty(exports, "TransactionExecutionError", { enumerable: true, get: function() {
      return transaction_js_1.TransactionExecutionError;
    } });
    Object.defineProperty(exports, "TransactionNotFoundError", { enumerable: true, get: function() {
      return transaction_js_1.TransactionNotFoundError;
    } });
    Object.defineProperty(exports, "TransactionReceiptNotFoundError", { enumerable: true, get: function() {
      return transaction_js_1.TransactionReceiptNotFoundError;
    } });
    Object.defineProperty(exports, "WaitForTransactionReceiptTimeoutError", { enumerable: true, get: function() {
      return transaction_js_1.WaitForTransactionReceiptTimeoutError;
    } });
    var data_js_1 = require_data();
    Object.defineProperty(exports, "SizeExceedsPaddingSizeError", { enumerable: true, get: function() {
      return data_js_1.SizeExceedsPaddingSizeError;
    } });
    Object.defineProperty(exports, "SliceOffsetOutOfBoundsError", { enumerable: true, get: function() {
      return data_js_1.SliceOffsetOutOfBoundsError;
    } });
    var transport_js_1 = require_transport();
    Object.defineProperty(exports, "UrlRequiredError", { enumerable: true, get: function() {
      return transport_js_1.UrlRequiredError;
    } });
    var labelhash_js_1 = require_labelhash();
    Object.defineProperty(exports, "labelhash", { enumerable: true, get: function() {
      return labelhash_js_1.labelhash;
    } });
    var namehash_js_1 = require_namehash();
    Object.defineProperty(exports, "namehash", { enumerable: true, get: function() {
      return namehash_js_1.namehash;
    } });
    var block_js_2 = require_block2();
    Object.defineProperty(exports, "defineBlock", { enumerable: true, get: function() {
      return block_js_2.defineBlock;
    } });
    Object.defineProperty(exports, "formatBlock", { enumerable: true, get: function() {
      return block_js_2.formatBlock;
    } });
    var log_js_2 = require_log2();
    Object.defineProperty(exports, "formatLog", { enumerable: true, get: function() {
      return log_js_2.formatLog;
    } });
    var decodeAbiParameters_js_1 = require_decodeAbiParameters();
    Object.defineProperty(exports, "decodeAbiParameters", { enumerable: true, get: function() {
      return decodeAbiParameters_js_1.decodeAbiParameters;
    } });
    var decodeDeployData_js_1 = require_decodeDeployData();
    Object.defineProperty(exports, "decodeDeployData", { enumerable: true, get: function() {
      return decodeDeployData_js_1.decodeDeployData;
    } });
    var decodeErrorResult_js_1 = require_decodeErrorResult();
    Object.defineProperty(exports, "decodeErrorResult", { enumerable: true, get: function() {
      return decodeErrorResult_js_1.decodeErrorResult;
    } });
    var decodeEventLog_js_1 = require_decodeEventLog();
    Object.defineProperty(exports, "decodeEventLog", { enumerable: true, get: function() {
      return decodeEventLog_js_1.decodeEventLog;
    } });
    var decodeFunctionData_js_1 = require_decodeFunctionData();
    Object.defineProperty(exports, "decodeFunctionData", { enumerable: true, get: function() {
      return decodeFunctionData_js_1.decodeFunctionData;
    } });
    var decodeFunctionResult_js_1 = require_decodeFunctionResult();
    Object.defineProperty(exports, "decodeFunctionResult", { enumerable: true, get: function() {
      return decodeFunctionResult_js_1.decodeFunctionResult;
    } });
    var encodeAbiParameters_js_1 = require_encodeAbiParameters();
    Object.defineProperty(exports, "encodeAbiParameters", { enumerable: true, get: function() {
      return encodeAbiParameters_js_1.encodeAbiParameters;
    } });
    var encodeDeployData_js_1 = require_encodeDeployData();
    Object.defineProperty(exports, "encodeDeployData", { enumerable: true, get: function() {
      return encodeDeployData_js_1.encodeDeployData;
    } });
    var encodeErrorResult_js_1 = require_encodeErrorResult();
    Object.defineProperty(exports, "encodeErrorResult", { enumerable: true, get: function() {
      return encodeErrorResult_js_1.encodeErrorResult;
    } });
    var encodeEventTopics_js_1 = require_encodeEventTopics();
    Object.defineProperty(exports, "encodeEventTopics", { enumerable: true, get: function() {
      return encodeEventTopics_js_1.encodeEventTopics;
    } });
    var encodeFunctionData_js_1 = require_encodeFunctionData();
    Object.defineProperty(exports, "encodeFunctionData", { enumerable: true, get: function() {
      return encodeFunctionData_js_1.encodeFunctionData;
    } });
    var encodeFunctionResult_js_1 = require_encodeFunctionResult();
    Object.defineProperty(exports, "encodeFunctionResult", { enumerable: true, get: function() {
      return encodeFunctionResult_js_1.encodeFunctionResult;
    } });
    var transaction_js_2 = require_transaction2();
    Object.defineProperty(exports, "defineTransaction", { enumerable: true, get: function() {
      return transaction_js_2.defineTransaction;
    } });
    Object.defineProperty(exports, "formatTransaction", { enumerable: true, get: function() {
      return transaction_js_2.formatTransaction;
    } });
    Object.defineProperty(exports, "transactionType", { enumerable: true, get: function() {
      return transaction_js_2.transactionType;
    } });
    var transactionReceipt_js_1 = require_transactionReceipt();
    Object.defineProperty(exports, "defineTransactionReceipt", { enumerable: true, get: function() {
      return transactionReceipt_js_1.defineTransactionReceipt;
    } });
    Object.defineProperty(exports, "formatTransactionReceipt", { enumerable: true, get: function() {
      return transactionReceipt_js_1.formatTransactionReceipt;
    } });
    var transactionRequest_js_1 = require_transactionRequest();
    Object.defineProperty(exports, "defineTransactionRequest", { enumerable: true, get: function() {
      return transactionRequest_js_1.defineTransactionRequest;
    } });
    Object.defineProperty(exports, "formatTransactionRequest", { enumerable: true, get: function() {
      return transactionRequest_js_1.formatTransactionRequest;
    } });
    Object.defineProperty(exports, "rpcTransactionType", { enumerable: true, get: function() {
      return transactionRequest_js_1.rpcTransactionType;
    } });
    var getAbiItem_js_1 = require_getAbiItem();
    Object.defineProperty(exports, "getAbiItem", { enumerable: true, get: function() {
      return getAbiItem_js_1.getAbiItem;
    } });
    var getContractAddress_js_1 = require_getContractAddress();
    Object.defineProperty(exports, "getContractAddress", { enumerable: true, get: function() {
      return getContractAddress_js_1.getContractAddress;
    } });
    Object.defineProperty(exports, "getCreate2Address", { enumerable: true, get: function() {
      return getContractAddress_js_1.getCreate2Address;
    } });
    Object.defineProperty(exports, "getCreateAddress", { enumerable: true, get: function() {
      return getContractAddress_js_1.getCreateAddress;
    } });
    var getSerializedTransactionType_js_1 = require_getSerializedTransactionType();
    Object.defineProperty(exports, "getSerializedTransactionType", { enumerable: true, get: function() {
      return getSerializedTransactionType_js_1.getSerializedTransactionType;
    } });
    var getTransactionType_js_1 = require_getTransactionType();
    Object.defineProperty(exports, "getTransactionType", { enumerable: true, get: function() {
      return getTransactionType_js_1.getTransactionType;
    } });
    var hashTypedData_js_1 = require_hashTypedData();
    Object.defineProperty(exports, "hashDomain", { enumerable: true, get: function() {
      return hashTypedData_js_1.hashDomain;
    } });
    Object.defineProperty(exports, "hashTypedData", { enumerable: true, get: function() {
      return hashTypedData_js_1.hashTypedData;
    } });
    var compactSignatureToSignature_js_1 = require_compactSignatureToSignature();
    Object.defineProperty(exports, "compactSignatureToSignature", { enumerable: true, get: function() {
      return compactSignatureToSignature_js_1.compactSignatureToSignature;
    } });
    var hexToCompactSignature_js_1 = require_hexToCompactSignature();
    Object.defineProperty(exports, "hexToCompactSignature", { enumerable: true, get: function() {
      return hexToCompactSignature_js_1.hexToCompactSignature;
    } });
    var hexToSignature_js_1 = require_hexToSignature();
    Object.defineProperty(exports, "hexToSignature", { enumerable: true, get: function() {
      return hexToSignature_js_1.hexToSignature;
    } });
    var recoverAddress_js_1 = require_recoverAddress();
    Object.defineProperty(exports, "recoverAddress", { enumerable: true, get: function() {
      return recoverAddress_js_1.recoverAddress;
    } });
    var recoverMessageAddress_js_1 = require_recoverMessageAddress();
    Object.defineProperty(exports, "recoverMessageAddress", { enumerable: true, get: function() {
      return recoverMessageAddress_js_1.recoverMessageAddress;
    } });
    var recoverPublicKey_js_1 = require_recoverPublicKey();
    Object.defineProperty(exports, "recoverPublicKey", { enumerable: true, get: function() {
      return recoverPublicKey_js_1.recoverPublicKey;
    } });
    var recoverTypedDataAddress_js_1 = require_recoverTypedDataAddress();
    Object.defineProperty(exports, "recoverTypedDataAddress", { enumerable: true, get: function() {
      return recoverTypedDataAddress_js_1.recoverTypedDataAddress;
    } });
    var signatureToCompactSignature_js_1 = require_signatureToCompactSignature();
    Object.defineProperty(exports, "signatureToCompactSignature", { enumerable: true, get: function() {
      return signatureToCompactSignature_js_1.signatureToCompactSignature;
    } });
    var compactSignatureToHex_js_1 = require_compactSignatureToHex();
    Object.defineProperty(exports, "compactSignatureToHex", { enumerable: true, get: function() {
      return compactSignatureToHex_js_1.compactSignatureToHex;
    } });
    var signatureToHex_js_1 = require_signatureToHex();
    Object.defineProperty(exports, "signatureToHex", { enumerable: true, get: function() {
      return signatureToHex_js_1.signatureToHex;
    } });
    var toRlp_js_1 = require_toRlp();
    Object.defineProperty(exports, "bytesToRlp", { enumerable: true, get: function() {
      return toRlp_js_1.bytesToRlp;
    } });
    Object.defineProperty(exports, "hexToRlp", { enumerable: true, get: function() {
      return toRlp_js_1.hexToRlp;
    } });
    Object.defineProperty(exports, "toRlp", { enumerable: true, get: function() {
      return toRlp_js_1.toRlp;
    } });
    var verifyMessage_js_1 = require_verifyMessage();
    Object.defineProperty(exports, "verifyMessage", { enumerable: true, get: function() {
      return verifyMessage_js_1.verifyMessage;
    } });
    var verifyTypedData_js_1 = require_verifyTypedData();
    Object.defineProperty(exports, "verifyTypedData", { enumerable: true, get: function() {
      return verifyTypedData_js_1.verifyTypedData;
    } });
    var assertRequest_js_1 = require_assertRequest();
    Object.defineProperty(exports, "assertRequest", { enumerable: true, get: function() {
      return assertRequest_js_1.assertRequest;
    } });
    var assertTransaction_js_1 = require_assertTransaction();
    Object.defineProperty(exports, "assertTransactionEIP1559", { enumerable: true, get: function() {
      return assertTransaction_js_1.assertTransactionEIP1559;
    } });
    Object.defineProperty(exports, "assertTransactionEIP2930", { enumerable: true, get: function() {
      return assertTransaction_js_1.assertTransactionEIP2930;
    } });
    Object.defineProperty(exports, "assertTransactionLegacy", { enumerable: true, get: function() {
      return assertTransaction_js_1.assertTransactionLegacy;
    } });
    var toBytes_js_1 = require_toBytes();
    Object.defineProperty(exports, "boolToBytes", { enumerable: true, get: function() {
      return toBytes_js_1.boolToBytes;
    } });
    Object.defineProperty(exports, "hexToBytes", { enumerable: true, get: function() {
      return toBytes_js_1.hexToBytes;
    } });
    Object.defineProperty(exports, "numberToBytes", { enumerable: true, get: function() {
      return toBytes_js_1.numberToBytes;
    } });
    Object.defineProperty(exports, "stringToBytes", { enumerable: true, get: function() {
      return toBytes_js_1.stringToBytes;
    } });
    Object.defineProperty(exports, "toBytes", { enumerable: true, get: function() {
      return toBytes_js_1.toBytes;
    } });
    var toHex_js_1 = require_toHex();
    Object.defineProperty(exports, "boolToHex", { enumerable: true, get: function() {
      return toHex_js_1.boolToHex;
    } });
    Object.defineProperty(exports, "bytesToHex", { enumerable: true, get: function() {
      return toHex_js_1.bytesToHex;
    } });
    Object.defineProperty(exports, "numberToHex", { enumerable: true, get: function() {
      return toHex_js_1.numberToHex;
    } });
    Object.defineProperty(exports, "stringToHex", { enumerable: true, get: function() {
      return toHex_js_1.stringToHex;
    } });
    Object.defineProperty(exports, "toHex", { enumerable: true, get: function() {
      return toHex_js_1.toHex;
    } });
    var fromBytes_js_1 = require_fromBytes();
    Object.defineProperty(exports, "bytesToBigInt", { enumerable: true, get: function() {
      return fromBytes_js_1.bytesToBigInt;
    } });
    Object.defineProperty(exports, "bytesToBigint", { enumerable: true, get: function() {
      return fromBytes_js_1.bytesToBigInt;
    } });
    Object.defineProperty(exports, "bytesToBool", { enumerable: true, get: function() {
      return fromBytes_js_1.bytesToBool;
    } });
    Object.defineProperty(exports, "bytesToNumber", { enumerable: true, get: function() {
      return fromBytes_js_1.bytesToNumber;
    } });
    Object.defineProperty(exports, "bytesToString", { enumerable: true, get: function() {
      return fromBytes_js_1.bytesToString;
    } });
    Object.defineProperty(exports, "fromBytes", { enumerable: true, get: function() {
      return fromBytes_js_1.fromBytes;
    } });
    var ccip_js_1 = require_ccip2();
    Object.defineProperty(exports, "ccipFetch", { enumerable: true, get: function() {
      return ccip_js_1.ccipFetch;
    } });
    Object.defineProperty(exports, "offchainLookup", { enumerable: true, get: function() {
      return ccip_js_1.offchainLookup;
    } });
    Object.defineProperty(exports, "offchainLookupAbiItem", { enumerable: true, get: function() {
      return ccip_js_1.offchainLookupAbiItem;
    } });
    Object.defineProperty(exports, "offchainLookupSignature", { enumerable: true, get: function() {
      return ccip_js_1.offchainLookupSignature;
    } });
    var concat_js_1 = require_concat();
    Object.defineProperty(exports, "concat", { enumerable: true, get: function() {
      return concat_js_1.concat;
    } });
    Object.defineProperty(exports, "concatBytes", { enumerable: true, get: function() {
      return concat_js_1.concatBytes;
    } });
    Object.defineProperty(exports, "concatHex", { enumerable: true, get: function() {
      return concat_js_1.concatHex;
    } });
    var chain_js_2 = require_chain2();
    Object.defineProperty(exports, "assertCurrentChain", { enumerable: true, get: function() {
      return chain_js_2.assertCurrentChain;
    } });
    Object.defineProperty(exports, "defineChain", { enumerable: true, get: function() {
      return chain_js_2.defineChain;
    } });
    Object.defineProperty(exports, "getChainContractAddress", { enumerable: true, get: function() {
      return chain_js_2.getChainContractAddress;
    } });
    var encodePacked_js_1 = require_encodePacked();
    Object.defineProperty(exports, "encodePacked", { enumerable: true, get: function() {
      return encodePacked_js_1.encodePacked;
    } });
    var formatEther_js_1 = require_formatEther();
    Object.defineProperty(exports, "formatEther", { enumerable: true, get: function() {
      return formatEther_js_1.formatEther;
    } });
    var formatGwei_js_1 = require_formatGwei();
    Object.defineProperty(exports, "formatGwei", { enumerable: true, get: function() {
      return formatGwei_js_1.formatGwei;
    } });
    var formatUnits_js_1 = require_formatUnits();
    Object.defineProperty(exports, "formatUnits", { enumerable: true, get: function() {
      return formatUnits_js_1.formatUnits;
    } });
    var fromHex_js_1 = require_fromHex();
    Object.defineProperty(exports, "fromHex", { enumerable: true, get: function() {
      return fromHex_js_1.fromHex;
    } });
    Object.defineProperty(exports, "hexToBigInt", { enumerable: true, get: function() {
      return fromHex_js_1.hexToBigInt;
    } });
    Object.defineProperty(exports, "hexToBool", { enumerable: true, get: function() {
      return fromHex_js_1.hexToBool;
    } });
    Object.defineProperty(exports, "hexToNumber", { enumerable: true, get: function() {
      return fromHex_js_1.hexToNumber;
    } });
    Object.defineProperty(exports, "hexToString", { enumerable: true, get: function() {
      return fromHex_js_1.hexToString;
    } });
    var fromRlp_js_1 = require_fromRlp();
    Object.defineProperty(exports, "fromRlp", { enumerable: true, get: function() {
      return fromRlp_js_1.fromRlp;
    } });
    var getAddress_js_1 = require_getAddress();
    Object.defineProperty(exports, "checksumAddress", { enumerable: true, get: function() {
      return getAddress_js_1.checksumAddress;
    } });
    Object.defineProperty(exports, "getAddress", { enumerable: true, get: function() {
      return getAddress_js_1.getAddress;
    } });
    var getContractError_js_1 = require_getContractError();
    Object.defineProperty(exports, "getContractError", { enumerable: true, get: function() {
      return getContractError_js_1.getContractError;
    } });
    var getEventSelector_js_1 = require_getEventSelector();
    Object.defineProperty(exports, "getEventSelector", { enumerable: true, get: function() {
      return getEventSelector_js_1.getEventSelector;
    } });
    var getEventSignature_js_1 = require_getEventSignature();
    Object.defineProperty(exports, "getEventSignature", { enumerable: true, get: function() {
      return getEventSignature_js_1.getEventSignature;
    } });
    var getFunctionSelector_js_1 = require_getFunctionSelector();
    Object.defineProperty(exports, "getFunctionSelector", { enumerable: true, get: function() {
      return getFunctionSelector_js_1.getFunctionSelector;
    } });
    var getFunctionSignature_js_1 = require_getFunctionSignature();
    Object.defineProperty(exports, "getFunctionSignature", { enumerable: true, get: function() {
      return getFunctionSignature_js_1.getFunctionSignature;
    } });
    var hashMessage_js_1 = require_hashMessage();
    Object.defineProperty(exports, "hashMessage", { enumerable: true, get: function() {
      return hashMessage_js_1.hashMessage;
    } });
    var isAddress_js_1 = require_isAddress();
    Object.defineProperty(exports, "isAddress", { enumerable: true, get: function() {
      return isAddress_js_1.isAddress;
    } });
    var isAddressEqual_js_1 = require_isAddressEqual();
    Object.defineProperty(exports, "isAddressEqual", { enumerable: true, get: function() {
      return isAddressEqual_js_1.isAddressEqual;
    } });
    var isBytes_js_1 = require_isBytes();
    Object.defineProperty(exports, "isBytes", { enumerable: true, get: function() {
      return isBytes_js_1.isBytes;
    } });
    var isHash_js_1 = require_isHash();
    Object.defineProperty(exports, "isHash", { enumerable: true, get: function() {
      return isHash_js_1.isHash;
    } });
    var isHex_js_1 = require_isHex();
    Object.defineProperty(exports, "isHex", { enumerable: true, get: function() {
      return isHex_js_1.isHex;
    } });
    var keccak256_js_1 = require_keccak256();
    Object.defineProperty(exports, "keccak256", { enumerable: true, get: function() {
      return keccak256_js_1.keccak256;
    } });
    var pad_js_1 = require_pad();
    Object.defineProperty(exports, "pad", { enumerable: true, get: function() {
      return pad_js_1.pad;
    } });
    Object.defineProperty(exports, "padBytes", { enumerable: true, get: function() {
      return pad_js_1.padBytes;
    } });
    Object.defineProperty(exports, "padHex", { enumerable: true, get: function() {
      return pad_js_1.padHex;
    } });
    var parseEther_js_1 = require_parseEther();
    Object.defineProperty(exports, "parseEther", { enumerable: true, get: function() {
      return parseEther_js_1.parseEther;
    } });
    var parseGwei_js_1 = require_parseGwei();
    Object.defineProperty(exports, "parseGwei", { enumerable: true, get: function() {
      return parseGwei_js_1.parseGwei;
    } });
    var parseTransaction_js_1 = require_parseTransaction();
    Object.defineProperty(exports, "parseTransaction", { enumerable: true, get: function() {
      return parseTransaction_js_1.parseTransaction;
    } });
    var parseUnits_js_1 = require_parseUnits();
    Object.defineProperty(exports, "parseUnits", { enumerable: true, get: function() {
      return parseUnits_js_1.parseUnits;
    } });
    var serializeAccessList_js_1 = require_serializeAccessList();
    Object.defineProperty(exports, "serializeAccessList", { enumerable: true, get: function() {
      return serializeAccessList_js_1.serializeAccessList;
    } });
    var serializeTransaction_js_1 = require_serializeTransaction();
    Object.defineProperty(exports, "serializeTransaction", { enumerable: true, get: function() {
      return serializeTransaction_js_1.serializeTransaction;
    } });
    var size_js_1 = require_size();
    Object.defineProperty(exports, "size", { enumerable: true, get: function() {
      return size_js_1.size;
    } });
    var slice_js_1 = require_slice();
    Object.defineProperty(exports, "slice", { enumerable: true, get: function() {
      return slice_js_1.slice;
    } });
    Object.defineProperty(exports, "sliceBytes", { enumerable: true, get: function() {
      return slice_js_1.sliceBytes;
    } });
    Object.defineProperty(exports, "sliceHex", { enumerable: true, get: function() {
      return slice_js_1.sliceHex;
    } });
    var stringify_js_1 = require_stringify();
    Object.defineProperty(exports, "stringify", { enumerable: true, get: function() {
      return stringify_js_1.stringify;
    } });
    var trim_js_1 = require_trim();
    Object.defineProperty(exports, "trim", { enumerable: true, get: function() {
      return trim_js_1.trim;
    } });
    var typedData_js_1 = require_typedData();
    Object.defineProperty(exports, "validateTypedData", { enumerable: true, get: function() {
      return typedData_js_1.validateTypedData;
    } });
    Object.defineProperty(exports, "domainSeparator", { enumerable: true, get: function() {
      return typedData_js_1.domainSeparator;
    } });
    Object.defineProperty(exports, "getTypesForEIP712Domain", { enumerable: true, get: function() {
      return typedData_js_1.getTypesForEIP712Domain;
    } });
  }
});

// node_modules/@deroll/router/dist/index.js
var require_dist3 = __commonJS({
  "node_modules/@deroll/router/dist/index.js"(exports, module2) {
    "use strict";
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps2 = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
    var src_exports = {};
    __export(src_exports, {
      Router: () => Router,
      createRouter: () => createRouter2
    });
    module2.exports = __toCommonJS(src_exports);
    var import_path_to_regexp = require_dist2();
    var import_viem2 = require_cjs4();
    var Router = class {
      options;
      routes;
      constructor(options) {
        this.options = options;
        this.routes = [];
        this.handler = this.handler.bind(this);
      }
      add(path, handler) {
        const keys = [];
        const matcher = (0, import_path_to_regexp.match)(path, { decode: decodeURIComponent });
        const route = { matcher, handler };
        this.routes.push(route);
        return route;
      }
      handle(url) {
        for (const route of this.routes) {
          const match2 = route.matcher(url);
          if (match2) {
            try {
              return route.handler(match2, route);
            } catch (e) {
              throw new Error(`Error handling route ${url}`, {
                cause: e
              });
            }
          }
        }
        return void 0;
      }
      async handler(data) {
        const url = (0, import_viem2.bytesToString)((0, import_viem2.toBytes)(data.payload));
        const result = this.handle(url);
        if (result) {
          await this.options.app.createReport({
            payload: (0, import_viem2.toHex)((0, import_viem2.stringToBytes)(result))
          });
        }
      }
    };
    var createRouter2 = (options) => {
      return new Router(options);
    };
  }
});

// node_modules/@deroll/wallet/dist/index.js
var require_dist4 = __commonJS({
  "node_modules/@deroll/wallet/dist/index.js"(exports, module2) {
    "use strict";
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps2 = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
    var src_exports = {};
    __export(src_exports, {
      WalletABI: () => WalletABI,
      createWallet: () => createWallet2,
      isERC20Deposit: () => isERC20Deposit,
      isEtherDeposit: () => isEtherDeposit,
      parseERC20Deposit: () => parseERC20Deposit,
      parseEtherDeposit: () => parseEtherDeposit
    });
    module2.exports = __toCommonJS(src_exports);
    var import_viem2 = require_cjs4();
    var import_viem3 = require_cjs4();
    var cartesiDAppABI = [
      {
        stateMutability: "nonpayable",
        type: "constructor",
        inputs: [
          {
            name: "_consensus",
            internalType: "contract IConsensus",
            type: "address"
          },
          { name: "_owner", internalType: "address", type: "address" },
          { name: "_templateHash", internalType: "bytes32", type: "bytes32" }
        ]
      },
      { type: "error", inputs: [], name: "EtherTransferFailed" },
      { type: "error", inputs: [], name: "IncorrectEpochHash" },
      { type: "error", inputs: [], name: "IncorrectOutputHashesRootHash" },
      { type: "error", inputs: [], name: "IncorrectOutputsEpochRootHash" },
      { type: "error", inputs: [], name: "InputIndexOutOfClaimBounds" },
      { type: "error", inputs: [], name: "OnlyDApp" },
      { type: "error", inputs: [], name: "VoucherReexecutionNotAllowed" },
      {
        type: "event",
        anonymous: false,
        inputs: [
          {
            name: "newConsensus",
            internalType: "contract IConsensus",
            type: "address",
            indexed: false
          }
        ],
        name: "NewConsensus"
      },
      {
        type: "event",
        anonymous: false,
        inputs: [
          {
            name: "previousOwner",
            internalType: "address",
            type: "address",
            indexed: true
          },
          {
            name: "newOwner",
            internalType: "address",
            type: "address",
            indexed: true
          }
        ],
        name: "OwnershipTransferred"
      },
      {
        type: "event",
        anonymous: false,
        inputs: [
          {
            name: "voucherId",
            internalType: "uint256",
            type: "uint256",
            indexed: false
          }
        ],
        name: "VoucherExecuted"
      },
      {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [
          { name: "_destination", internalType: "address", type: "address" },
          { name: "_payload", internalType: "bytes", type: "bytes" },
          {
            name: "_proof",
            internalType: "struct Proof",
            type: "tuple",
            components: [
              {
                name: "validity",
                internalType: "struct OutputValidityProof",
                type: "tuple",
                components: [
                  {
                    name: "inputIndexWithinEpoch",
                    internalType: "uint64",
                    type: "uint64"
                  },
                  {
                    name: "outputIndexWithinInput",
                    internalType: "uint64",
                    type: "uint64"
                  },
                  {
                    name: "outputHashesRootHash",
                    internalType: "bytes32",
                    type: "bytes32"
                  },
                  {
                    name: "vouchersEpochRootHash",
                    internalType: "bytes32",
                    type: "bytes32"
                  },
                  {
                    name: "noticesEpochRootHash",
                    internalType: "bytes32",
                    type: "bytes32"
                  },
                  {
                    name: "machineStateHash",
                    internalType: "bytes32",
                    type: "bytes32"
                  },
                  {
                    name: "outputHashInOutputHashesSiblings",
                    internalType: "bytes32[]",
                    type: "bytes32[]"
                  },
                  {
                    name: "outputHashesInEpochSiblings",
                    internalType: "bytes32[]",
                    type: "bytes32[]"
                  }
                ]
              },
              { name: "context", internalType: "bytes", type: "bytes" }
            ]
          }
        ],
        name: "executeVoucher",
        outputs: [{ name: "", internalType: "bool", type: "bool" }]
      },
      {
        stateMutability: "view",
        type: "function",
        inputs: [],
        name: "getConsensus",
        outputs: [
          { name: "", internalType: "contract IConsensus", type: "address" }
        ]
      },
      {
        stateMutability: "view",
        type: "function",
        inputs: [],
        name: "getTemplateHash",
        outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }]
      },
      {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [
          {
            name: "_newConsensus",
            internalType: "contract IConsensus",
            type: "address"
          }
        ],
        name: "migrateToConsensus",
        outputs: []
      },
      {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [
          { name: "", internalType: "address", type: "address" },
          { name: "", internalType: "address", type: "address" },
          { name: "", internalType: "uint256[]", type: "uint256[]" },
          { name: "", internalType: "uint256[]", type: "uint256[]" },
          { name: "", internalType: "bytes", type: "bytes" }
        ],
        name: "onERC1155BatchReceived",
        outputs: [{ name: "", internalType: "bytes4", type: "bytes4" }]
      },
      {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [
          { name: "", internalType: "address", type: "address" },
          { name: "", internalType: "address", type: "address" },
          { name: "", internalType: "uint256", type: "uint256" },
          { name: "", internalType: "uint256", type: "uint256" },
          { name: "", internalType: "bytes", type: "bytes" }
        ],
        name: "onERC1155Received",
        outputs: [{ name: "", internalType: "bytes4", type: "bytes4" }]
      },
      {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [
          { name: "", internalType: "address", type: "address" },
          { name: "", internalType: "address", type: "address" },
          { name: "", internalType: "uint256", type: "uint256" },
          { name: "", internalType: "bytes", type: "bytes" }
        ],
        name: "onERC721Received",
        outputs: [{ name: "", internalType: "bytes4", type: "bytes4" }]
      },
      {
        stateMutability: "view",
        type: "function",
        inputs: [],
        name: "owner",
        outputs: [{ name: "", internalType: "address", type: "address" }]
      },
      {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [],
        name: "renounceOwnership",
        outputs: []
      },
      {
        stateMutability: "view",
        type: "function",
        inputs: [
          { name: "interfaceId", internalType: "bytes4", type: "bytes4" }
        ],
        name: "supportsInterface",
        outputs: [{ name: "", internalType: "bool", type: "bool" }]
      },
      {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [
          { name: "newOwner", internalType: "address", type: "address" }
        ],
        name: "transferOwnership",
        outputs: []
      },
      {
        stateMutability: "view",
        type: "function",
        inputs: [
          { name: "_notice", internalType: "bytes", type: "bytes" },
          {
            name: "_proof",
            internalType: "struct Proof",
            type: "tuple",
            components: [
              {
                name: "validity",
                internalType: "struct OutputValidityProof",
                type: "tuple",
                components: [
                  {
                    name: "inputIndexWithinEpoch",
                    internalType: "uint64",
                    type: "uint64"
                  },
                  {
                    name: "outputIndexWithinInput",
                    internalType: "uint64",
                    type: "uint64"
                  },
                  {
                    name: "outputHashesRootHash",
                    internalType: "bytes32",
                    type: "bytes32"
                  },
                  {
                    name: "vouchersEpochRootHash",
                    internalType: "bytes32",
                    type: "bytes32"
                  },
                  {
                    name: "noticesEpochRootHash",
                    internalType: "bytes32",
                    type: "bytes32"
                  },
                  {
                    name: "machineStateHash",
                    internalType: "bytes32",
                    type: "bytes32"
                  },
                  {
                    name: "outputHashInOutputHashesSiblings",
                    internalType: "bytes32[]",
                    type: "bytes32[]"
                  },
                  {
                    name: "outputHashesInEpochSiblings",
                    internalType: "bytes32[]",
                    type: "bytes32[]"
                  }
                ]
              },
              { name: "context", internalType: "bytes", type: "bytes" }
            ]
          }
        ],
        name: "validateNotice",
        outputs: [{ name: "", internalType: "bool", type: "bool" }]
      },
      {
        stateMutability: "view",
        type: "function",
        inputs: [
          { name: "_inputIndex", internalType: "uint256", type: "uint256" },
          {
            name: "_outputIndexWithinInput",
            internalType: "uint256",
            type: "uint256"
          }
        ],
        name: "wasVoucherExecuted",
        outputs: [{ name: "", internalType: "bool", type: "bool" }]
      },
      {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [
          { name: "_receiver", internalType: "address", type: "address" },
          { name: "_value", internalType: "uint256", type: "uint256" }
        ],
        name: "withdrawEther",
        outputs: []
      },
      { stateMutability: "payable", type: "receive" }
    ];
    var dAppAddressRelayAddress = "0xF5DE34d6BbC0446E2a45719E718efEbaaE179daE";
    var erc20ABI = [
      {
        type: "event",
        inputs: [
          { name: "owner", type: "address", indexed: true },
          { name: "spender", type: "address", indexed: true },
          { name: "value", type: "uint256", indexed: false }
        ],
        name: "Approval"
      },
      {
        type: "event",
        inputs: [
          { name: "from", type: "address", indexed: true },
          { name: "to", type: "address", indexed: true },
          { name: "value", type: "uint256", indexed: false }
        ],
        name: "Transfer"
      },
      {
        stateMutability: "view",
        type: "function",
        inputs: [
          { name: "owner", type: "address" },
          { name: "spender", type: "address" }
        ],
        name: "allowance",
        outputs: [{ type: "uint256" }]
      },
      {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [
          { name: "spender", type: "address" },
          { name: "amount", type: "uint256" }
        ],
        name: "approve",
        outputs: [{ type: "bool" }]
      },
      {
        stateMutability: "view",
        type: "function",
        inputs: [{ name: "account", type: "address" }],
        name: "balanceOf",
        outputs: [{ type: "uint256" }]
      },
      {
        stateMutability: "view",
        type: "function",
        inputs: [],
        name: "decimals",
        outputs: [{ type: "uint8" }]
      },
      {
        stateMutability: "view",
        type: "function",
        inputs: [],
        name: "name",
        outputs: [{ type: "string" }]
      },
      {
        stateMutability: "view",
        type: "function",
        inputs: [],
        name: "symbol",
        outputs: [{ type: "string" }]
      },
      {
        stateMutability: "view",
        type: "function",
        inputs: [],
        name: "totalSupply",
        outputs: [{ type: "uint256" }]
      },
      {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [
          { name: "recipient", type: "address" },
          { name: "amount", type: "uint256" }
        ],
        name: "transfer",
        outputs: [{ type: "bool" }]
      },
      {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [
          { name: "sender", type: "address" },
          { name: "recipient", type: "address" },
          { name: "amount", type: "uint256" }
        ],
        name: "transferFrom",
        outputs: [{ type: "bool" }]
      },
      {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [
          { name: "spender", type: "address" },
          { name: "addedValue", type: "uint256" }
        ],
        name: "increaseAllowance",
        outputs: [{ type: "bool" }]
      },
      {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [
          { name: "spender", type: "address" },
          { name: "subtractedValue", type: "uint256" }
        ],
        name: "decreaseAllowance",
        outputs: [{ type: "bool" }]
      }
    ];
    var erc20PortalAddress = "0x9C21AEb2093C32DDbC53eEF24B873BDCd1aDa1DB";
    var etherPortalAddress = "0xFfdbe43d4c855BF7e0f105c400A50857f53AB044";
    var WalletAppImpl = class {
      dapp;
      wallets = {};
      constructor() {
        this.handler = this.handler.bind(this);
      }
      balanceOf(tokenOrAddress, address) {
        if (address) {
          if ((0, import_viem3.isAddress)(address)) {
            address = (0, import_viem3.getAddress)(address);
          }
          const erc20 = this.wallets[address] ?? {};
          return erc20[tokenOrAddress] ?? 0n;
        } else {
          if ((0, import_viem3.isAddress)(tokenOrAddress)) {
            tokenOrAddress = (0, import_viem3.getAddress)(tokenOrAddress);
          }
          return this.wallets[tokenOrAddress]?.ether ?? 0n;
        }
      }
      handler = async (data) => {
        if (isEtherDeposit(data)) {
          let { sender, value } = parseEtherDeposit(data.payload);
          const wallet2 = this.wallets[sender] ?? { ether: 0n, erc20: {} };
          wallet2.ether += value;
          this.wallets[sender] = wallet2;
          return "accept";
        } else if (isERC20Deposit(data)) {
          let { success, token, sender, amount } = parseERC20Deposit(
            data.payload
          );
          if (success) {
            const wallet2 = this.wallets[sender] ?? { ether: 0n, erc20: {} };
            wallet2.erc20[token] = wallet2.erc20[token] ? wallet2.erc20[token] + amount : amount;
            this.wallets[sender] = wallet2;
          }
          return "accept";
        } else if ((0, import_viem3.getAddress)(data.metadata.msg_sender) === dAppAddressRelayAddress) {
          this.dapp = (0, import_viem3.getAddress)(data.payload);
          return "accept";
        }
        return "reject";
      };
      transferEther(from, to, amount) {
        if ((0, import_viem3.isAddress)(from)) {
          from = (0, import_viem3.getAddress)(from);
        }
        if ((0, import_viem3.isAddress)(to)) {
          to = (0, import_viem3.getAddress)(to);
        }
        const walletFrom = this.wallets[from] ?? { ether: 0n, erc20: {} };
        const walletTo = this.wallets[to] ?? { ether: 0n, erc20: {} };
        if (walletFrom.ether < amount) {
          throw new Error(`insufficient balance of user ${from}`);
        }
        walletFrom.ether = walletFrom.ether - amount;
        walletTo.ether = walletTo.ether + amount;
      }
      transferERC20(token, from, to, amount) {
        if ((0, import_viem3.isAddress)(from)) {
          from = (0, import_viem3.getAddress)(from);
        }
        if ((0, import_viem3.isAddress)(to)) {
          to = (0, import_viem3.getAddress)(to);
        }
        const walletFrom = this.wallets[from] ?? { ether: 0n, erc20: {} };
        const walletTo = this.wallets[to] ?? { ether: 0n, erc20: {} };
        if (!walletFrom.erc20[token] || walletFrom.erc20[token] < amount) {
          throw new Error(
            `insufficient balance of user ${from} of token ${token}`
          );
        }
        walletFrom.erc20[token] = walletFrom.erc20[token] - amount;
        walletTo.erc20[token] = walletTo.erc20[token] ? walletTo.erc20[token] + amount : amount;
      }
      withdrawEther(address, amount) {
        address = (0, import_viem3.getAddress)(address);
        const wallet2 = this.wallets[address];
        if (!this.dapp) {
          throw new Error(`undefined application address`);
        }
        if (wallet2.ether < amount) {
          throw new Error(
            `insufficient balance of user ${address}: ${amount.toString()} > ${wallet2.ether.toString()}`
          );
        }
        wallet2.ether = wallet2.ether - amount;
        const call = (0, import_viem3.encodeFunctionData)({
          abi: cartesiDAppABI,
          functionName: "withdrawEther",
          args: [address, amount]
        });
        return {
          destination: this.dapp,
          // dapp Address
          payload: call
        };
      }
      withdrawERC20(token, address, amount) {
        token = (0, import_viem3.getAddress)(token);
        address = (0, import_viem3.getAddress)(address);
        const wallet2 = this.wallets[address];
        if (!wallet2.erc20[token] || wallet2.erc20[token] < amount) {
          throw new Error(
            `insufficient balance of user ${address} of token ${token}: ${amount.toString()} > ${wallet2.erc20[token]?.toString() ?? "0"}`
          );
        }
        wallet2.erc20[token] -= amount;
        const call = (0, import_viem3.encodeFunctionData)({
          abi: erc20ABI,
          functionName: "transfer",
          args: [address, amount]
        });
        return {
          destination: token,
          payload: call
        };
      }
    };
    var WalletABI = (0, import_viem2.parseAbi)([
      "function withdrawEther(uint256 amount)",
      "function withdrawERC20(address token, uint256 amount)"
    ]);
    var createWallet2 = () => {
      return new WalletAppImpl();
    };
    var parseEtherDeposit = (payload) => {
      const sender = (0, import_viem2.getAddress)((0, import_viem2.slice)(payload, 0, 20));
      const value = (0, import_viem2.hexToBigInt)((0, import_viem2.slice)(payload, 20, 52), { size: 32 });
      return { sender, value };
    };
    var parseERC20Deposit = (payload) => {
      const success = (0, import_viem2.hexToBool)((0, import_viem2.slice)(payload, 0, 1));
      const token = (0, import_viem2.getAddress)((0, import_viem2.slice)(payload, 1, 21));
      const sender = (0, import_viem2.getAddress)((0, import_viem2.slice)(payload, 21, 41));
      const amount = (0, import_viem2.hexToBigInt)((0, import_viem2.slice)(payload, 41, 73), { size: 32 });
      return { success, token, sender, amount };
    };
    var isEtherDeposit = (data) => (0, import_viem2.getAddress)(data.metadata.msg_sender) === etherPortalAddress;
    var isERC20Deposit = (data) => (0, import_viem2.getAddress)(data.metadata.msg_sender) === erc20PortalAddress;
  }
});

// node_modules/viem/_esm/utils/abi/formatAbiItem.js
function formatAbiItem(abiItem, { includeName = false } = {}) {
  if (abiItem.type !== "function" && abiItem.type !== "event" && abiItem.type !== "error")
    throw new InvalidDefinitionTypeError(abiItem.type);
  return `${abiItem.name}(${formatAbiParams(abiItem.inputs, { includeName })})`;
}
function formatAbiParams(params, { includeName = false } = {}) {
  if (!params)
    return "";
  return params.map((param) => formatAbiParam(param, { includeName })).join(includeName ? ", " : ",");
}
function formatAbiParam(param, { includeName }) {
  if (param.type.startsWith("tuple")) {
    return `(${formatAbiParams(param.components, { includeName })})${param.type.slice("tuple".length)}`;
  }
  return param.type + (includeName && param.name ? ` ${param.name}` : "");
}
var init_formatAbiItem = __esm({
  "node_modules/viem/_esm/utils/abi/formatAbiItem.js"() {
    init_abi();
  }
});

// node_modules/viem/_esm/utils/data/isHex.js
function isHex(value, { strict = true } = {}) {
  if (!value)
    return false;
  if (typeof value !== "string")
    return false;
  return strict ? /^0x[0-9a-fA-F]*$/.test(value) : value.startsWith("0x");
}
var init_isHex = __esm({
  "node_modules/viem/_esm/utils/data/isHex.js"() {
  }
});

// node_modules/viem/_esm/utils/data/size.js
function size(value) {
  if (isHex(value, { strict: false }))
    return Math.ceil((value.length - 2) / 2);
  return value.length;
}
var init_size = __esm({
  "node_modules/viem/_esm/utils/data/size.js"() {
    init_isHex();
  }
});

// node_modules/viem/_esm/errors/version.js
var version2;
var init_version = __esm({
  "node_modules/viem/_esm/errors/version.js"() {
    version2 = "1.16.5";
  }
});

// node_modules/viem/_esm/errors/utils.js
var getVersion;
var init_utils = __esm({
  "node_modules/viem/_esm/errors/utils.js"() {
    init_version();
    getVersion = () => `viem@${version2}`;
  }
});

// node_modules/viem/_esm/errors/base.js
function walk(err, fn) {
  if (fn?.(err))
    return err;
  if (err && typeof err === "object" && "cause" in err)
    return walk(err.cause, fn);
  return fn ? null : err;
}
var BaseError2;
var init_base = __esm({
  "node_modules/viem/_esm/errors/base.js"() {
    init_utils();
    BaseError2 = class _BaseError extends Error {
      constructor(shortMessage, args = {}) {
        super();
        Object.defineProperty(this, "details", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "docsPath", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "metaMessages", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "shortMessage", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "ViemError"
        });
        Object.defineProperty(this, "version", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: getVersion()
        });
        const details = args.cause instanceof _BaseError ? args.cause.details : args.cause?.message ? args.cause.message : args.details;
        const docsPath = args.cause instanceof _BaseError ? args.cause.docsPath || args.docsPath : args.docsPath;
        this.message = [
          shortMessage || "An error occurred.",
          "",
          ...args.metaMessages ? [...args.metaMessages, ""] : [],
          ...docsPath ? [
            `Docs: https://viem.sh${docsPath}.html${args.docsSlug ? `#${args.docsSlug}` : ""}`
          ] : [],
          ...details ? [`Details: ${details}`] : [],
          `Version: ${this.version}`
        ].join("\n");
        if (args.cause)
          this.cause = args.cause;
        this.details = details;
        this.docsPath = docsPath;
        this.metaMessages = args.metaMessages;
        this.shortMessage = shortMessage;
      }
      walk(fn) {
        return walk(this, fn);
      }
    };
  }
});

// node_modules/viem/_esm/errors/abi.js
var AbiDecodingDataSizeTooSmallError, AbiDecodingZeroDataError, AbiFunctionSignatureNotFoundError, InvalidAbiDecodingTypeError, InvalidDefinitionTypeError;
var init_abi = __esm({
  "node_modules/viem/_esm/errors/abi.js"() {
    init_formatAbiItem();
    init_base();
    AbiDecodingDataSizeTooSmallError = class extends BaseError2 {
      constructor({ data, params, size: size2 }) {
        super([`Data size of ${size2} bytes is too small for given parameters.`].join("\n"), {
          metaMessages: [
            `Params: (${formatAbiParams(params, { includeName: true })})`,
            `Data:   ${data} (${size2} bytes)`
          ]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "AbiDecodingDataSizeTooSmallError"
        });
        Object.defineProperty(this, "data", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "params", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "size", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.data = data;
        this.params = params;
        this.size = size2;
      }
    };
    AbiDecodingZeroDataError = class extends BaseError2 {
      constructor() {
        super('Cannot decode zero data ("0x") with ABI parameters.');
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "AbiDecodingZeroDataError"
        });
      }
    };
    AbiFunctionSignatureNotFoundError = class extends BaseError2 {
      constructor(signature, { docsPath }) {
        super([
          `Encoded function signature "${signature}" not found on ABI.`,
          "Make sure you are using the correct ABI and that the function exists on it.",
          `You can look up the signature here: https://openchain.xyz/signatures?query=${signature}.`
        ].join("\n"), {
          docsPath
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "AbiFunctionSignatureNotFoundError"
        });
      }
    };
    InvalidAbiDecodingTypeError = class extends BaseError2 {
      constructor(type, { docsPath }) {
        super([
          `Type "${type}" is not a valid decoding type.`,
          "Please provide a valid ABI type."
        ].join("\n"), { docsPath });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidAbiDecodingType"
        });
      }
    };
    InvalidDefinitionTypeError = class extends BaseError2 {
      constructor(type) {
        super([
          `"${type}" is not a valid definition type.`,
          'Valid types: "function", "event", "error"'
        ].join("\n"));
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidDefinitionTypeError"
        });
      }
    };
  }
});

// node_modules/viem/_esm/errors/data.js
var SliceOffsetOutOfBoundsError, SizeExceedsPaddingSizeError;
var init_data = __esm({
  "node_modules/viem/_esm/errors/data.js"() {
    init_base();
    SliceOffsetOutOfBoundsError = class extends BaseError2 {
      constructor({ offset, position, size: size2 }) {
        super(`Slice ${position === "start" ? "starting" : "ending"} at offset "${offset}" is out-of-bounds (size: ${size2}).`);
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "SliceOffsetOutOfBoundsError"
        });
      }
    };
    SizeExceedsPaddingSizeError = class extends BaseError2 {
      constructor({ size: size2, targetSize, type }) {
        super(`${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()} size (${size2}) exceeds padding size (${targetSize}).`);
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "SizeExceedsPaddingSizeError"
        });
      }
    };
  }
});

// node_modules/viem/_esm/utils/data/pad.js
function pad(hexOrBytes, { dir, size: size2 = 32 } = {}) {
  if (typeof hexOrBytes === "string")
    return padHex(hexOrBytes, { dir, size: size2 });
  return padBytes(hexOrBytes, { dir, size: size2 });
}
function padHex(hex_, { dir, size: size2 = 32 } = {}) {
  if (size2 === null)
    return hex_;
  const hex = hex_.replace("0x", "");
  if (hex.length > size2 * 2)
    throw new SizeExceedsPaddingSizeError({
      size: Math.ceil(hex.length / 2),
      targetSize: size2,
      type: "hex"
    });
  return `0x${hex[dir === "right" ? "padEnd" : "padStart"](size2 * 2, "0")}`;
}
function padBytes(bytes2, { dir, size: size2 = 32 } = {}) {
  if (size2 === null)
    return bytes2;
  if (bytes2.length > size2)
    throw new SizeExceedsPaddingSizeError({
      size: bytes2.length,
      targetSize: size2,
      type: "bytes"
    });
  const paddedBytes = new Uint8Array(size2);
  for (let i = 0; i < size2; i++) {
    const padEnd = dir === "right";
    paddedBytes[padEnd ? i : size2 - i - 1] = bytes2[padEnd ? i : bytes2.length - i - 1];
  }
  return paddedBytes;
}
var init_pad = __esm({
  "node_modules/viem/_esm/utils/data/pad.js"() {
    init_data();
  }
});

// node_modules/viem/_esm/errors/encoding.js
var IntegerOutOfRangeError, InvalidHexBooleanError, SizeOverflowError;
var init_encoding = __esm({
  "node_modules/viem/_esm/errors/encoding.js"() {
    init_base();
    IntegerOutOfRangeError = class extends BaseError2 {
      constructor({ max, min, signed, size: size2, value }) {
        super(`Number "${value}" is not in safe ${size2 ? `${size2 * 8}-bit ${signed ? "signed" : "unsigned"} ` : ""}integer range ${max ? `(${min} to ${max})` : `(above ${min})`}`);
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "IntegerOutOfRangeError"
        });
      }
    };
    InvalidHexBooleanError = class extends BaseError2 {
      constructor(hex) {
        super(`Hex value "${hex}" is not a valid boolean. The hex value must be "0x0" (false) or "0x1" (true).`);
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidHexBooleanError"
        });
      }
    };
    SizeOverflowError = class extends BaseError2 {
      constructor({ givenSize, maxSize }) {
        super(`Size cannot exceed ${maxSize} bytes. Given size: ${givenSize} bytes.`);
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "SizeOverflowError"
        });
      }
    };
  }
});

// node_modules/viem/_esm/utils/data/trim.js
function trim(hexOrBytes, { dir = "left" } = {}) {
  let data = typeof hexOrBytes === "string" ? hexOrBytes.replace("0x", "") : hexOrBytes;
  let sliceLength = 0;
  for (let i = 0; i < data.length - 1; i++) {
    if (data[dir === "left" ? i : data.length - i - 1].toString() === "0")
      sliceLength++;
    else
      break;
  }
  data = dir === "left" ? data.slice(sliceLength) : data.slice(0, data.length - sliceLength);
  if (typeof hexOrBytes === "string") {
    if (data.length === 1 && dir === "right")
      data = `${data}0`;
    return `0x${data.length % 2 === 1 ? `0${data}` : data}`;
  }
  return data;
}
var init_trim = __esm({
  "node_modules/viem/_esm/utils/data/trim.js"() {
  }
});

// node_modules/viem/_esm/utils/encoding/fromHex.js
function assertSize(hexOrBytes, { size: size2 }) {
  if (size(hexOrBytes) > size2)
    throw new SizeOverflowError({
      givenSize: size(hexOrBytes),
      maxSize: size2
    });
}
function hexToBigInt(hex, opts = {}) {
  const { signed } = opts;
  if (opts.size)
    assertSize(hex, { size: opts.size });
  const value = BigInt(hex);
  if (!signed)
    return value;
  const size2 = (hex.length - 2) / 2;
  const max = (1n << BigInt(size2) * 8n - 1n) - 1n;
  if (value <= max)
    return value;
  return value - BigInt(`0x${"f".padStart(size2 * 2, "f")}`) - 1n;
}
function hexToBool(hex_, opts = {}) {
  let hex = hex_;
  if (opts.size) {
    assertSize(hex, { size: opts.size });
    hex = trim(hex);
  }
  if (trim(hex) === "0x00")
    return false;
  if (trim(hex) === "0x01")
    return true;
  throw new InvalidHexBooleanError(hex);
}
function hexToNumber(hex, opts = {}) {
  return Number(hexToBigInt(hex, opts));
}
function hexToString(hex, opts = {}) {
  let bytes2 = hexToBytes(hex);
  if (opts.size) {
    assertSize(bytes2, { size: opts.size });
    bytes2 = trim(bytes2, { dir: "right" });
  }
  return new TextDecoder().decode(bytes2);
}
var init_fromHex = __esm({
  "node_modules/viem/_esm/utils/encoding/fromHex.js"() {
    init_encoding();
    init_size();
    init_trim();
    init_toBytes();
  }
});

// node_modules/viem/_esm/utils/encoding/toHex.js
function toHex(value, opts = {}) {
  if (typeof value === "number" || typeof value === "bigint")
    return numberToHex(value, opts);
  if (typeof value === "string") {
    return stringToHex(value, opts);
  }
  if (typeof value === "boolean")
    return boolToHex(value, opts);
  return bytesToHex(value, opts);
}
function boolToHex(value, opts = {}) {
  const hex = `0x${Number(value)}`;
  if (typeof opts.size === "number") {
    assertSize(hex, { size: opts.size });
    return pad(hex, { size: opts.size });
  }
  return hex;
}
function bytesToHex(value, opts = {}) {
  let string = "";
  for (let i = 0; i < value.length; i++) {
    string += hexes[value[i]];
  }
  const hex = `0x${string}`;
  if (typeof opts.size === "number") {
    assertSize(hex, { size: opts.size });
    return pad(hex, { dir: "right", size: opts.size });
  }
  return hex;
}
function numberToHex(value_, opts = {}) {
  const { signed, size: size2 } = opts;
  const value = BigInt(value_);
  let maxValue;
  if (size2) {
    if (signed)
      maxValue = (1n << BigInt(size2) * 8n - 1n) - 1n;
    else
      maxValue = 2n ** (BigInt(size2) * 8n) - 1n;
  } else if (typeof value_ === "number") {
    maxValue = BigInt(Number.MAX_SAFE_INTEGER);
  }
  const minValue = typeof maxValue === "bigint" && signed ? -maxValue - 1n : 0;
  if (maxValue && value > maxValue || value < minValue) {
    const suffix = typeof value_ === "bigint" ? "n" : "";
    throw new IntegerOutOfRangeError({
      max: maxValue ? `${maxValue}${suffix}` : void 0,
      min: `${minValue}${suffix}`,
      signed,
      size: size2,
      value: `${value_}${suffix}`
    });
  }
  const hex = `0x${(signed && value < 0 ? (1n << BigInt(size2 * 8)) + BigInt(value) : value).toString(16)}`;
  if (size2)
    return pad(hex, { size: size2 });
  return hex;
}
function stringToHex(value_, opts = {}) {
  const value = encoder.encode(value_);
  return bytesToHex(value, opts);
}
var hexes, encoder;
var init_toHex = __esm({
  "node_modules/viem/_esm/utils/encoding/toHex.js"() {
    init_encoding();
    init_pad();
    init_fromHex();
    hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_v, i) => i.toString(16).padStart(2, "0"));
    encoder = /* @__PURE__ */ new TextEncoder();
  }
});

// node_modules/viem/_esm/utils/encoding/toBytes.js
function toBytes(value, opts = {}) {
  if (typeof value === "number" || typeof value === "bigint")
    return numberToBytes(value, opts);
  if (typeof value === "boolean")
    return boolToBytes(value, opts);
  if (isHex(value))
    return hexToBytes(value, opts);
  return stringToBytes(value, opts);
}
function boolToBytes(value, opts = {}) {
  const bytes2 = new Uint8Array(1);
  bytes2[0] = Number(value);
  if (typeof opts.size === "number") {
    assertSize(bytes2, { size: opts.size });
    return pad(bytes2, { size: opts.size });
  }
  return bytes2;
}
function charCodeToBase16(char) {
  if (char >= charCodeMap.zero && char <= charCodeMap.nine)
    return char - charCodeMap.zero;
  else if (char >= charCodeMap.A && char <= charCodeMap.F)
    return char - (charCodeMap.A - 10);
  else if (char >= charCodeMap.a && char <= charCodeMap.f)
    return char - (charCodeMap.a - 10);
  return void 0;
}
function hexToBytes(hex_, opts = {}) {
  let hex = hex_;
  if (opts.size) {
    assertSize(hex, { size: opts.size });
    hex = pad(hex, { dir: "right", size: opts.size });
  }
  let hexString = hex.slice(2);
  if (hexString.length % 2)
    hexString = `0${hexString}`;
  const length = hexString.length / 2;
  const bytes2 = new Uint8Array(length);
  for (let index = 0, j = 0; index < length; index++) {
    const nibbleLeft = charCodeToBase16(hexString.charCodeAt(j++));
    const nibbleRight = charCodeToBase16(hexString.charCodeAt(j++));
    if (nibbleLeft === void 0 || nibbleRight === void 0) {
      throw new BaseError2(`Invalid byte sequence ("${hexString[j - 2]}${hexString[j - 1]}" in "${hexString}").`);
    }
    bytes2[index] = nibbleLeft * 16 + nibbleRight;
  }
  return bytes2;
}
function numberToBytes(value, opts) {
  const hex = numberToHex(value, opts);
  return hexToBytes(hex);
}
function stringToBytes(value, opts = {}) {
  const bytes2 = encoder2.encode(value);
  if (typeof opts.size === "number") {
    assertSize(bytes2, { size: opts.size });
    return pad(bytes2, { dir: "right", size: opts.size });
  }
  return bytes2;
}
var encoder2, charCodeMap;
var init_toBytes = __esm({
  "node_modules/viem/_esm/utils/encoding/toBytes.js"() {
    init_base();
    init_isHex();
    init_pad();
    init_fromHex();
    init_toHex();
    encoder2 = /* @__PURE__ */ new TextEncoder();
    charCodeMap = {
      zero: 48,
      nine: 57,
      A: 65,
      F: 70,
      a: 97,
      f: 102
    };
  }
});

// node_modules/viem/_esm/utils/contract/extractFunctionParts.js
function extractFunctionParts(def) {
  const parts = def.match(paramsRegex);
  const type = parts?.[2] || void 0;
  const name = parts?.[3];
  const params = parts?.[5] || void 0;
  return { type, name, params };
}
function extractFunctionName(def) {
  return extractFunctionParts(def).name;
}
function extractFunctionParams(def) {
  const params = extractFunctionParts(def).params;
  const splitParams = params?.split(",").map((x) => x.trim().split(" "));
  return splitParams?.map((param) => ({
    type: param[0],
    name: param[1] === "indexed" ? param[2] : param[1],
    ...param[1] === "indexed" ? { indexed: true } : {}
  }));
}
var paramsRegex;
var init_extractFunctionParts = __esm({
  "node_modules/viem/_esm/utils/contract/extractFunctionParts.js"() {
    paramsRegex = /((function|event)\s)?(.*)(\((.*)\))/;
  }
});

// node_modules/viem/_esm/utils/hash/getFunctionSignature.js
var getFunctionSignature;
var init_getFunctionSignature = __esm({
  "node_modules/viem/_esm/utils/hash/getFunctionSignature.js"() {
    init_formatAbiItem();
    init_extractFunctionParts();
    getFunctionSignature = (fn) => {
      if (typeof fn === "string") {
        const name = extractFunctionName(fn);
        const params = extractFunctionParams(fn) || [];
        return `${name}(${params.map(({ type }) => type).join(",")})`;
      }
      return formatAbiItem(fn);
    };
  }
});

// node_modules/@noble/hashes/esm/_assert.js
function number(n) {
  if (!Number.isSafeInteger(n) || n < 0)
    throw new Error(`Wrong positive integer: ${n}`);
}
function bytes(b, ...lengths) {
  if (!(b instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  if (lengths.length > 0 && !lengths.includes(b.length))
    throw new Error(`Expected Uint8Array of length ${lengths}, not of length=${b.length}`);
}
function exists(instance, checkFinished = true) {
  if (instance.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (checkFinished && instance.finished)
    throw new Error("Hash#digest() has already been called");
}
function output(out, instance) {
  bytes(out);
  const min = instance.outputLen;
  if (out.length < min) {
    throw new Error(`digestInto() expects output buffer of length at least ${min}`);
  }
}
var init_assert = __esm({
  "node_modules/@noble/hashes/esm/_assert.js"() {
  }
});

// node_modules/@noble/hashes/esm/_u64.js
function fromBig(n, le = false) {
  if (le)
    return { h: Number(n & U32_MASK64), l: Number(n >> _32n & U32_MASK64) };
  return { h: Number(n >> _32n & U32_MASK64) | 0, l: Number(n & U32_MASK64) | 0 };
}
function split(lst, le = false) {
  let Ah = new Uint32Array(lst.length);
  let Al = new Uint32Array(lst.length);
  for (let i = 0; i < lst.length; i++) {
    const { h, l } = fromBig(lst[i], le);
    [Ah[i], Al[i]] = [h, l];
  }
  return [Ah, Al];
}
var U32_MASK64, _32n, rotlSH, rotlSL, rotlBH, rotlBL;
var init_u64 = __esm({
  "node_modules/@noble/hashes/esm/_u64.js"() {
    U32_MASK64 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
    _32n = /* @__PURE__ */ BigInt(32);
    rotlSH = (h, l, s) => h << s | l >>> 32 - s;
    rotlSL = (h, l, s) => l << s | h >>> 32 - s;
    rotlBH = (h, l, s) => l << s - 32 | h >>> 64 - s;
    rotlBL = (h, l, s) => h << s - 32 | l >>> 64 - s;
  }
});

// node_modules/@noble/hashes/esm/utils.js
function utf8ToBytes(str) {
  if (typeof str !== "string")
    throw new Error(`utf8ToBytes expected string, got ${typeof str}`);
  return new Uint8Array(new TextEncoder().encode(str));
}
function toBytes2(data) {
  if (typeof data === "string")
    data = utf8ToBytes(data);
  if (!u8a(data))
    throw new Error(`expected Uint8Array, got ${typeof data}`);
  return data;
}
function wrapConstructor(hashCons) {
  const hashC = (msg) => hashCons().update(toBytes2(msg)).digest();
  const tmp = hashCons();
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.create = () => hashCons();
  return hashC;
}
function wrapXOFConstructorWithOpts(hashCons) {
  const hashC = (msg, opts) => hashCons(opts).update(toBytes2(msg)).digest();
  const tmp = hashCons({});
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.create = (opts) => hashCons(opts);
  return hashC;
}
var u8a, u32, isLE, Hash, toStr;
var init_utils2 = __esm({
  "node_modules/@noble/hashes/esm/utils.js"() {
    u8a = (a) => a instanceof Uint8Array;
    u32 = (arr) => new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
    isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
    if (!isLE)
      throw new Error("Non little-endian hardware is not supported");
    Hash = class {
      // Safe version that clones internal state
      clone() {
        return this._cloneInto();
      }
    };
    toStr = {}.toString;
  }
});

// node_modules/@noble/hashes/esm/sha3.js
function keccakP(s, rounds = 24) {
  const B = new Uint32Array(5 * 2);
  for (let round = 24 - rounds; round < 24; round++) {
    for (let x = 0; x < 10; x++)
      B[x] = s[x] ^ s[x + 10] ^ s[x + 20] ^ s[x + 30] ^ s[x + 40];
    for (let x = 0; x < 10; x += 2) {
      const idx1 = (x + 8) % 10;
      const idx0 = (x + 2) % 10;
      const B0 = B[idx0];
      const B1 = B[idx0 + 1];
      const Th = rotlH(B0, B1, 1) ^ B[idx1];
      const Tl = rotlL(B0, B1, 1) ^ B[idx1 + 1];
      for (let y = 0; y < 50; y += 10) {
        s[x + y] ^= Th;
        s[x + y + 1] ^= Tl;
      }
    }
    let curH = s[2];
    let curL = s[3];
    for (let t = 0; t < 24; t++) {
      const shift = SHA3_ROTL[t];
      const Th = rotlH(curH, curL, shift);
      const Tl = rotlL(curH, curL, shift);
      const PI = SHA3_PI[t];
      curH = s[PI];
      curL = s[PI + 1];
      s[PI] = Th;
      s[PI + 1] = Tl;
    }
    for (let y = 0; y < 50; y += 10) {
      for (let x = 0; x < 10; x++)
        B[x] = s[y + x];
      for (let x = 0; x < 10; x++)
        s[y + x] ^= ~B[(x + 2) % 10] & B[(x + 4) % 10];
    }
    s[0] ^= SHA3_IOTA_H[round];
    s[1] ^= SHA3_IOTA_L[round];
  }
  B.fill(0);
}
var SHA3_PI, SHA3_ROTL, _SHA3_IOTA, _0n, _1n, _2n, _7n, _256n, _0x71n, SHA3_IOTA_H, SHA3_IOTA_L, rotlH, rotlL, Keccak, gen, sha3_224, sha3_256, sha3_384, sha3_512, keccak_224, keccak_256, keccak_384, keccak_512, genShake, shake128, shake256;
var init_sha3 = __esm({
  "node_modules/@noble/hashes/esm/sha3.js"() {
    init_assert();
    init_u64();
    init_utils2();
    [SHA3_PI, SHA3_ROTL, _SHA3_IOTA] = [[], [], []];
    _0n = /* @__PURE__ */ BigInt(0);
    _1n = /* @__PURE__ */ BigInt(1);
    _2n = /* @__PURE__ */ BigInt(2);
    _7n = /* @__PURE__ */ BigInt(7);
    _256n = /* @__PURE__ */ BigInt(256);
    _0x71n = /* @__PURE__ */ BigInt(113);
    for (let round = 0, R = _1n, x = 1, y = 0; round < 24; round++) {
      [x, y] = [y, (2 * x + 3 * y) % 5];
      SHA3_PI.push(2 * (5 * y + x));
      SHA3_ROTL.push((round + 1) * (round + 2) / 2 % 64);
      let t = _0n;
      for (let j = 0; j < 7; j++) {
        R = (R << _1n ^ (R >> _7n) * _0x71n) % _256n;
        if (R & _2n)
          t ^= _1n << (_1n << /* @__PURE__ */ BigInt(j)) - _1n;
      }
      _SHA3_IOTA.push(t);
    }
    [SHA3_IOTA_H, SHA3_IOTA_L] = /* @__PURE__ */ split(_SHA3_IOTA, true);
    rotlH = (h, l, s) => s > 32 ? rotlBH(h, l, s) : rotlSH(h, l, s);
    rotlL = (h, l, s) => s > 32 ? rotlBL(h, l, s) : rotlSL(h, l, s);
    Keccak = class _Keccak extends Hash {
      // NOTE: we accept arguments in bytes instead of bits here.
      constructor(blockLen, suffix, outputLen, enableXOF = false, rounds = 24) {
        super();
        this.blockLen = blockLen;
        this.suffix = suffix;
        this.outputLen = outputLen;
        this.enableXOF = enableXOF;
        this.rounds = rounds;
        this.pos = 0;
        this.posOut = 0;
        this.finished = false;
        this.destroyed = false;
        number(outputLen);
        if (0 >= this.blockLen || this.blockLen >= 200)
          throw new Error("Sha3 supports only keccak-f1600 function");
        this.state = new Uint8Array(200);
        this.state32 = u32(this.state);
      }
      keccak() {
        keccakP(this.state32, this.rounds);
        this.posOut = 0;
        this.pos = 0;
      }
      update(data) {
        exists(this);
        const { blockLen, state } = this;
        data = toBytes2(data);
        const len = data.length;
        for (let pos = 0; pos < len; ) {
          const take = Math.min(blockLen - this.pos, len - pos);
          for (let i = 0; i < take; i++)
            state[this.pos++] ^= data[pos++];
          if (this.pos === blockLen)
            this.keccak();
        }
        return this;
      }
      finish() {
        if (this.finished)
          return;
        this.finished = true;
        const { state, suffix, pos, blockLen } = this;
        state[pos] ^= suffix;
        if ((suffix & 128) !== 0 && pos === blockLen - 1)
          this.keccak();
        state[blockLen - 1] ^= 128;
        this.keccak();
      }
      writeInto(out) {
        exists(this, false);
        bytes(out);
        this.finish();
        const bufferOut = this.state;
        const { blockLen } = this;
        for (let pos = 0, len = out.length; pos < len; ) {
          if (this.posOut >= blockLen)
            this.keccak();
          const take = Math.min(blockLen - this.posOut, len - pos);
          out.set(bufferOut.subarray(this.posOut, this.posOut + take), pos);
          this.posOut += take;
          pos += take;
        }
        return out;
      }
      xofInto(out) {
        if (!this.enableXOF)
          throw new Error("XOF is not possible for this instance");
        return this.writeInto(out);
      }
      xof(bytes2) {
        number(bytes2);
        return this.xofInto(new Uint8Array(bytes2));
      }
      digestInto(out) {
        output(out, this);
        if (this.finished)
          throw new Error("digest() was already called");
        this.writeInto(out);
        this.destroy();
        return out;
      }
      digest() {
        return this.digestInto(new Uint8Array(this.outputLen));
      }
      destroy() {
        this.destroyed = true;
        this.state.fill(0);
      }
      _cloneInto(to) {
        const { blockLen, suffix, outputLen, rounds, enableXOF } = this;
        to || (to = new _Keccak(blockLen, suffix, outputLen, enableXOF, rounds));
        to.state32.set(this.state32);
        to.pos = this.pos;
        to.posOut = this.posOut;
        to.finished = this.finished;
        to.rounds = rounds;
        to.suffix = suffix;
        to.outputLen = outputLen;
        to.enableXOF = enableXOF;
        to.destroyed = this.destroyed;
        return to;
      }
    };
    gen = (suffix, blockLen, outputLen) => wrapConstructor(() => new Keccak(blockLen, suffix, outputLen));
    sha3_224 = /* @__PURE__ */ gen(6, 144, 224 / 8);
    sha3_256 = /* @__PURE__ */ gen(6, 136, 256 / 8);
    sha3_384 = /* @__PURE__ */ gen(6, 104, 384 / 8);
    sha3_512 = /* @__PURE__ */ gen(6, 72, 512 / 8);
    keccak_224 = /* @__PURE__ */ gen(1, 144, 224 / 8);
    keccak_256 = /* @__PURE__ */ gen(1, 136, 256 / 8);
    keccak_384 = /* @__PURE__ */ gen(1, 104, 384 / 8);
    keccak_512 = /* @__PURE__ */ gen(1, 72, 512 / 8);
    genShake = (suffix, blockLen, outputLen) => wrapXOFConstructorWithOpts((opts = {}) => new Keccak(blockLen, suffix, opts.dkLen === void 0 ? outputLen : opts.dkLen, true));
    shake128 = /* @__PURE__ */ genShake(31, 168, 128 / 8);
    shake256 = /* @__PURE__ */ genShake(31, 136, 256 / 8);
  }
});

// node_modules/viem/_esm/utils/hash/keccak256.js
function keccak256(value, to_) {
  const to = to_ || "hex";
  const bytes2 = keccak_256(isHex(value, { strict: false }) ? toBytes(value) : value);
  if (to === "bytes")
    return bytes2;
  return toHex(bytes2);
}
var init_keccak256 = __esm({
  "node_modules/viem/_esm/utils/hash/keccak256.js"() {
    init_sha3();
    init_isHex();
    init_toBytes();
    init_toHex();
  }
});

// node_modules/viem/_esm/utils/data/slice.js
function slice(value, start, end, { strict } = {}) {
  if (isHex(value, { strict: false }))
    return sliceHex(value, start, end, {
      strict
    });
  return sliceBytes(value, start, end, {
    strict
  });
}
function assertStartOffset(value, start) {
  if (typeof start === "number" && start > 0 && start > size(value) - 1)
    throw new SliceOffsetOutOfBoundsError({
      offset: start,
      position: "start",
      size: size(value)
    });
}
function assertEndOffset(value, start, end) {
  if (typeof start === "number" && typeof end === "number" && size(value) !== end - start) {
    throw new SliceOffsetOutOfBoundsError({
      offset: end,
      position: "end",
      size: size(value)
    });
  }
}
function sliceBytes(value_, start, end, { strict } = {}) {
  assertStartOffset(value_, start);
  const value = value_.slice(start, end);
  if (strict)
    assertEndOffset(value, start, end);
  return value;
}
function sliceHex(value_, start, end, { strict } = {}) {
  assertStartOffset(value_, start);
  const value = `0x${value_.replace("0x", "").slice((start ?? 0) * 2, (end ?? value_.length) * 2)}`;
  if (strict)
    assertEndOffset(value, start, end);
  return value;
}
var init_slice = __esm({
  "node_modules/viem/_esm/utils/data/slice.js"() {
    init_data();
    init_isHex();
    init_size();
  }
});

// node_modules/viem/_esm/utils/abi/encodeAbiParameters.js
function getArrayComponents(type) {
  const matches = type.match(/^(.*)\[(\d+)?\]$/);
  return matches ? (
    // Return `null` if the array is dynamic.
    [matches[2] ? Number(matches[2]) : null, matches[1]]
  ) : void 0;
}
var init_encodeAbiParameters = __esm({
  "node_modules/viem/_esm/utils/abi/encodeAbiParameters.js"() {
  }
});

// node_modules/viem/_esm/utils/hash/getFunctionSelector.js
var hash, getFunctionSelector;
var init_getFunctionSelector = __esm({
  "node_modules/viem/_esm/utils/hash/getFunctionSelector.js"() {
    init_slice();
    init_toBytes();
    init_getFunctionSignature();
    init_keccak256();
    hash = (value) => keccak256(toBytes(value));
    getFunctionSelector = (fn) => slice(hash(getFunctionSignature(fn)), 0, 4);
  }
});

// node_modules/viem/_esm/utils/address/getAddress.js
function checksumAddress(address_, chainId) {
  const hexAddress = chainId ? `${chainId}${address_.toLowerCase()}` : address_.substring(2).toLowerCase();
  const hash2 = keccak256(stringToBytes(hexAddress), "bytes");
  const address = (chainId ? hexAddress.substring(`${chainId}0x`.length) : hexAddress).split("");
  for (let i = 0; i < 40; i += 2) {
    if (hash2[i >> 1] >> 4 >= 8 && address[i]) {
      address[i] = address[i].toUpperCase();
    }
    if ((hash2[i >> 1] & 15) >= 8 && address[i + 1]) {
      address[i + 1] = address[i + 1].toUpperCase();
    }
  }
  return `0x${address.join("")}`;
}
var init_getAddress = __esm({
  "node_modules/viem/_esm/utils/address/getAddress.js"() {
    init_toBytes();
    init_keccak256();
  }
});

// node_modules/viem/_esm/utils/abi/decodeAbiParameters.js
function decodeAbiParameters(params, data) {
  if (data === "0x" && params.length > 0)
    throw new AbiDecodingZeroDataError();
  if (size(data) && size(data) < 32)
    throw new AbiDecodingDataSizeTooSmallError({
      data,
      params,
      size: size(data)
    });
  return decodeParams({
    data,
    params
  });
}
function decodeParams({ data, params }) {
  const decodedValues = [];
  let position = 0;
  for (let i = 0; i < params.length; i++) {
    if (position >= size(data))
      throw new AbiDecodingDataSizeTooSmallError({
        data,
        params,
        size: size(data)
      });
    const param = params[i];
    const { consumed, value } = decodeParam({ data, param, position });
    decodedValues.push(value);
    position += consumed;
  }
  return decodedValues;
}
function decodeParam({ data, param, position }) {
  const arrayComponents = getArrayComponents(param.type);
  if (arrayComponents) {
    const [length, type] = arrayComponents;
    return decodeArray(data, {
      length,
      param: { ...param, type },
      position
    });
  }
  if (param.type === "tuple") {
    return decodeTuple(data, { param, position });
  }
  if (param.type === "string") {
    return decodeString(data, { position });
  }
  if (param.type.startsWith("bytes")) {
    return decodeBytes(data, { param, position });
  }
  const value = slice(data, position, position + 32, { strict: true });
  if (param.type.startsWith("uint") || param.type.startsWith("int")) {
    return decodeNumber(value, { param });
  }
  if (param.type === "address") {
    return decodeAddress(value);
  }
  if (param.type === "bool") {
    return decodeBool(value);
  }
  throw new InvalidAbiDecodingTypeError(param.type, {
    docsPath: "/docs/contract/decodeAbiParameters"
  });
}
function decodeAddress(value) {
  return { consumed: 32, value: checksumAddress(slice(value, -20)) };
}
function decodeArray(data, { param, length, position }) {
  if (!length) {
    const offset = hexToNumber(slice(data, position, position + 32, { strict: true }));
    const length2 = hexToNumber(slice(data, offset, offset + 32, { strict: true }));
    let consumed2 = 0;
    const value2 = [];
    for (let i = 0; i < length2; ++i) {
      const decodedChild = decodeParam({
        data: slice(data, offset + 32),
        param,
        position: consumed2
      });
      consumed2 += decodedChild.consumed;
      value2.push(decodedChild.value);
    }
    return { value: value2, consumed: 32 };
  }
  if (hasDynamicChild(param)) {
    const arrayComponents = getArrayComponents(param.type);
    const dynamicChild = !arrayComponents?.[0];
    let consumed2 = 0;
    const value2 = [];
    for (let i = 0; i < length; ++i) {
      const offset = hexToNumber(slice(data, position, position + 32, { strict: true }));
      const decodedChild = decodeParam({
        data: slice(data, offset),
        param,
        position: dynamicChild ? consumed2 : i * 32
      });
      consumed2 += decodedChild.consumed;
      value2.push(decodedChild.value);
    }
    return { value: value2, consumed: 32 };
  }
  let consumed = 0;
  const value = [];
  for (let i = 0; i < length; ++i) {
    const decodedChild = decodeParam({
      data,
      param,
      position: position + consumed
    });
    consumed += decodedChild.consumed;
    value.push(decodedChild.value);
  }
  return { value, consumed };
}
function decodeBool(value) {
  return { consumed: 32, value: hexToBool(value) };
}
function decodeBytes(data, { param, position }) {
  const [_, size2] = param.type.split("bytes");
  if (!size2) {
    const offset = hexToNumber(slice(data, position, position + 32, { strict: true }));
    const length = hexToNumber(slice(data, offset, offset + 32, { strict: true }));
    if (length === 0)
      return { consumed: 32, value: "0x" };
    const value2 = slice(data, offset + 32, offset + 32 + length, {
      strict: true
    });
    return { consumed: 32, value: value2 };
  }
  const value = slice(data, position, position + parseInt(size2), {
    strict: true
  });
  return { consumed: 32, value };
}
function decodeNumber(value, { param }) {
  const signed = param.type.startsWith("int");
  const size2 = parseInt(param.type.split("int")[1] || "256");
  return {
    consumed: 32,
    value: size2 > 48 ? hexToBigInt(value, { signed }) : hexToNumber(value, { signed })
  };
}
function decodeString(data, { position }) {
  const offset = hexToNumber(slice(data, position, position + 32, { strict: true }));
  const length = hexToNumber(slice(data, offset, offset + 32, { strict: true }));
  if (length === 0)
    return { consumed: 32, value: "" };
  const value = hexToString(trim(slice(data, offset + 32, offset + 32 + length, { strict: true })));
  return { consumed: 32, value };
}
function decodeTuple(data, { param, position }) {
  const hasUnnamedChild = param.components.length === 0 || param.components.some(({ name }) => !name);
  const value = hasUnnamedChild ? [] : {};
  let consumed = 0;
  if (hasDynamicChild(param)) {
    const offset = hexToNumber(slice(data, position, position + 32, { strict: true }));
    for (let i = 0; i < param.components.length; ++i) {
      const component = param.components[i];
      const decodedChild = decodeParam({
        data: slice(data, offset),
        param: component,
        position: consumed
      });
      consumed += decodedChild.consumed;
      value[hasUnnamedChild ? i : component?.name] = decodedChild.value;
    }
    return { consumed: 32, value };
  }
  for (let i = 0; i < param.components.length; ++i) {
    const component = param.components[i];
    const decodedChild = decodeParam({
      data,
      param: component,
      position: position + consumed
    });
    consumed += decodedChild.consumed;
    value[hasUnnamedChild ? i : component?.name] = decodedChild.value;
  }
  return { consumed, value };
}
function hasDynamicChild(param) {
  const { type } = param;
  if (type === "string")
    return true;
  if (type === "bytes")
    return true;
  if (type.endsWith("[]"))
    return true;
  if (type === "tuple")
    return param.components?.some(hasDynamicChild);
  const arrayComponents = getArrayComponents(param.type);
  if (arrayComponents && hasDynamicChild({ ...param, type: arrayComponents[1] }))
    return true;
  return false;
}
var init_decodeAbiParameters = __esm({
  "node_modules/viem/_esm/utils/abi/decodeAbiParameters.js"() {
    init_abi();
    init_getAddress();
    init_size();
    init_slice();
    init_trim();
    init_fromHex();
    init_encodeAbiParameters();
  }
});

// src/dapp.ts
var import_app = __toESM(require_dist());
var import_router = __toESM(require_dist3());
var import_wallet = __toESM(require_dist4());

// node_modules/abitype/dist/esm/version.js
var version = "0.9.8";

// node_modules/abitype/dist/esm/errors.js
var BaseError = class _BaseError extends Error {
  constructor(shortMessage, args = {}) {
    const details = args.cause instanceof _BaseError ? args.cause.details : args.cause?.message ? args.cause.message : args.details;
    const docsPath = args.cause instanceof _BaseError ? args.cause.docsPath || args.docsPath : args.docsPath;
    const message = [
      shortMessage || "An error occurred.",
      "",
      ...args.metaMessages ? [...args.metaMessages, ""] : [],
      ...docsPath ? [`Docs: https://abitype.dev${docsPath}`] : [],
      ...details ? [`Details: ${details}`] : [],
      `Version: abitype@${version}`
    ].join("\n");
    super(message);
    Object.defineProperty(this, "details", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "docsPath", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "metaMessages", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "shortMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "AbiTypeError"
    });
    if (args.cause)
      this.cause = args.cause;
    this.details = details;
    this.docsPath = docsPath;
    this.metaMessages = args.metaMessages;
    this.shortMessage = shortMessage;
  }
};

// node_modules/abitype/dist/esm/regex.js
function execTyped(regex, string) {
  const match = regex.exec(string);
  return match?.groups;
}
var bytesRegex = /^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/;
var integerRegex = /^u?int(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/;
var isTupleRegex = /^\(.+?\).*?$/;

// node_modules/abitype/dist/esm/human-readable/runtime/signatures.js
var errorSignatureRegex = /^error (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*)\((?<parameters>.*?)\)$/;
function isErrorSignature(signature) {
  return errorSignatureRegex.test(signature);
}
function execErrorSignature(signature) {
  return execTyped(errorSignatureRegex, signature);
}
var eventSignatureRegex = /^event (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*)\((?<parameters>.*?)\)$/;
function isEventSignature(signature) {
  return eventSignatureRegex.test(signature);
}
function execEventSignature(signature) {
  return execTyped(eventSignatureRegex, signature);
}
var functionSignatureRegex = /^function (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*)\((?<parameters>.*?)\)(?: (?<scope>external|public{1}))?(?: (?<stateMutability>pure|view|nonpayable|payable{1}))?(?: returns\s?\((?<returns>.*?)\))?$/;
function isFunctionSignature(signature) {
  return functionSignatureRegex.test(signature);
}
function execFunctionSignature(signature) {
  return execTyped(functionSignatureRegex, signature);
}
var structSignatureRegex = /^struct (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*) \{(?<properties>.*?)\}$/;
function isStructSignature(signature) {
  return structSignatureRegex.test(signature);
}
function execStructSignature(signature) {
  return execTyped(structSignatureRegex, signature);
}
var constructorSignatureRegex = /^constructor\((?<parameters>.*?)\)(?:\s(?<stateMutability>payable{1}))?$/;
function isConstructorSignature(signature) {
  return constructorSignatureRegex.test(signature);
}
function execConstructorSignature(signature) {
  return execTyped(constructorSignatureRegex, signature);
}
var fallbackSignatureRegex = /^fallback\(\)$/;
function isFallbackSignature(signature) {
  return fallbackSignatureRegex.test(signature);
}
var receiveSignatureRegex = /^receive\(\) external payable$/;
function isReceiveSignature(signature) {
  return receiveSignatureRegex.test(signature);
}
var eventModifiers = /* @__PURE__ */ new Set(["indexed"]);
var functionModifiers = /* @__PURE__ */ new Set([
  "calldata",
  "memory",
  "storage"
]);

// node_modules/abitype/dist/esm/human-readable/errors/abiItem.js
var UnknownTypeError = class extends BaseError {
  constructor({ type }) {
    super("Unknown type.", {
      metaMessages: [
        `Type "${type}" is not a valid ABI type. Perhaps you forgot to include a struct signature?`
      ]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "UnknownTypeError"
    });
  }
};
var UnknownSolidityTypeError = class extends BaseError {
  constructor({ type }) {
    super("Unknown type.", {
      metaMessages: [`Type "${type}" is not a valid ABI type.`]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "UnknownSolidityTypeError"
    });
  }
};

// node_modules/abitype/dist/esm/human-readable/errors/abiParameter.js
var InvalidParameterError = class extends BaseError {
  constructor({ param }) {
    super("Invalid ABI parameter.", {
      details: param
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "InvalidParameterError"
    });
  }
};
var SolidityProtectedKeywordError = class extends BaseError {
  constructor({ param, name }) {
    super("Invalid ABI parameter.", {
      details: param,
      metaMessages: [
        `"${name}" is a protected Solidity keyword. More info: https://docs.soliditylang.org/en/latest/cheatsheet.html`
      ]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "SolidityProtectedKeywordError"
    });
  }
};
var InvalidModifierError = class extends BaseError {
  constructor({ param, type, modifier }) {
    super("Invalid ABI parameter.", {
      details: param,
      metaMessages: [
        `Modifier "${modifier}" not allowed${type ? ` in "${type}" type` : ""}.`
      ]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "InvalidModifierError"
    });
  }
};
var InvalidFunctionModifierError = class extends BaseError {
  constructor({ param, type, modifier }) {
    super("Invalid ABI parameter.", {
      details: param,
      metaMessages: [
        `Modifier "${modifier}" not allowed${type ? ` in "${type}" type` : ""}.`,
        `Data location can only be specified for array, struct, or mapping types, but "${modifier}" was given.`
      ]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "InvalidFunctionModifierError"
    });
  }
};
var InvalidAbiTypeParameterError = class extends BaseError {
  constructor({ abiParameter }) {
    super("Invalid ABI parameter.", {
      details: JSON.stringify(abiParameter, null, 2),
      metaMessages: ["ABI parameter type is invalid."]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "InvalidAbiTypeParameterError"
    });
  }
};

// node_modules/abitype/dist/esm/human-readable/errors/signature.js
var InvalidSignatureError = class extends BaseError {
  constructor({ signature, type }) {
    super(`Invalid ${type} signature.`, {
      details: signature
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "InvalidSignatureError"
    });
  }
};
var UnknownSignatureError = class extends BaseError {
  constructor({ signature }) {
    super("Unknown signature.", {
      details: signature
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "UnknownSignatureError"
    });
  }
};
var InvalidStructSignatureError = class extends BaseError {
  constructor({ signature }) {
    super("Invalid struct signature.", {
      details: signature,
      metaMessages: ["No properties exist."]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "InvalidStructSignatureError"
    });
  }
};

// node_modules/abitype/dist/esm/human-readable/errors/struct.js
var CircularReferenceError = class extends BaseError {
  constructor({ type }) {
    super("Circular reference detected.", {
      metaMessages: [`Struct "${type}" is a circular reference.`]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "CircularReferenceError"
    });
  }
};

// node_modules/abitype/dist/esm/human-readable/errors/splitParameters.js
var InvalidParenthesisError = class extends BaseError {
  constructor({ current, depth }) {
    super("Unbalanced parentheses.", {
      metaMessages: [
        `"${current.trim()}" has too many ${depth > 0 ? "opening" : "closing"} parentheses.`
      ],
      details: `Depth "${depth}"`
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "InvalidParenthesisError"
    });
  }
};

// node_modules/abitype/dist/esm/human-readable/runtime/cache.js
function getParameterCacheKey(param, type) {
  if (type)
    return `${type}:${param}`;
  return param;
}
var parameterCache = /* @__PURE__ */ new Map([
  ["address", { type: "address" }],
  ["bool", { type: "bool" }],
  ["bytes", { type: "bytes" }],
  ["bytes32", { type: "bytes32" }],
  ["int", { type: "int256" }],
  ["int256", { type: "int256" }],
  ["string", { type: "string" }],
  ["uint", { type: "uint256" }],
  ["uint8", { type: "uint8" }],
  ["uint16", { type: "uint16" }],
  ["uint24", { type: "uint24" }],
  ["uint32", { type: "uint32" }],
  ["uint64", { type: "uint64" }],
  ["uint96", { type: "uint96" }],
  ["uint112", { type: "uint112" }],
  ["uint160", { type: "uint160" }],
  ["uint192", { type: "uint192" }],
  ["uint256", { type: "uint256" }],
  ["address owner", { type: "address", name: "owner" }],
  ["address to", { type: "address", name: "to" }],
  ["bool approved", { type: "bool", name: "approved" }],
  ["bytes _data", { type: "bytes", name: "_data" }],
  ["bytes data", { type: "bytes", name: "data" }],
  ["bytes signature", { type: "bytes", name: "signature" }],
  ["bytes32 hash", { type: "bytes32", name: "hash" }],
  ["bytes32 r", { type: "bytes32", name: "r" }],
  ["bytes32 root", { type: "bytes32", name: "root" }],
  ["bytes32 s", { type: "bytes32", name: "s" }],
  ["string name", { type: "string", name: "name" }],
  ["string symbol", { type: "string", name: "symbol" }],
  ["string tokenURI", { type: "string", name: "tokenURI" }],
  ["uint tokenId", { type: "uint256", name: "tokenId" }],
  ["uint8 v", { type: "uint8", name: "v" }],
  ["uint256 balance", { type: "uint256", name: "balance" }],
  ["uint256 tokenId", { type: "uint256", name: "tokenId" }],
  ["uint256 value", { type: "uint256", name: "value" }],
  [
    "event:address indexed from",
    { type: "address", name: "from", indexed: true }
  ],
  ["event:address indexed to", { type: "address", name: "to", indexed: true }],
  [
    "event:uint indexed tokenId",
    { type: "uint256", name: "tokenId", indexed: true }
  ],
  [
    "event:uint256 indexed tokenId",
    { type: "uint256", name: "tokenId", indexed: true }
  ]
]);

// node_modules/abitype/dist/esm/human-readable/runtime/utils.js
function parseSignature(signature, structs = {}) {
  if (isFunctionSignature(signature)) {
    const match = execFunctionSignature(signature);
    if (!match)
      throw new InvalidSignatureError({ signature, type: "function" });
    const inputParams = splitParameters(match.parameters);
    const inputs = [];
    const inputLength = inputParams.length;
    for (let i = 0; i < inputLength; i++) {
      inputs.push(parseAbiParameter(inputParams[i], {
        modifiers: functionModifiers,
        structs,
        type: "function"
      }));
    }
    const outputs = [];
    if (match.returns) {
      const outputParams = splitParameters(match.returns);
      const outputLength = outputParams.length;
      for (let i = 0; i < outputLength; i++) {
        outputs.push(parseAbiParameter(outputParams[i], {
          modifiers: functionModifiers,
          structs,
          type: "function"
        }));
      }
    }
    return {
      name: match.name,
      type: "function",
      stateMutability: match.stateMutability ?? "nonpayable",
      inputs,
      outputs
    };
  }
  if (isEventSignature(signature)) {
    const match = execEventSignature(signature);
    if (!match)
      throw new InvalidSignatureError({ signature, type: "event" });
    const params = splitParameters(match.parameters);
    const abiParameters = [];
    const length = params.length;
    for (let i = 0; i < length; i++) {
      abiParameters.push(parseAbiParameter(params[i], {
        modifiers: eventModifiers,
        structs,
        type: "event"
      }));
    }
    return { name: match.name, type: "event", inputs: abiParameters };
  }
  if (isErrorSignature(signature)) {
    const match = execErrorSignature(signature);
    if (!match)
      throw new InvalidSignatureError({ signature, type: "error" });
    const params = splitParameters(match.parameters);
    const abiParameters = [];
    const length = params.length;
    for (let i = 0; i < length; i++) {
      abiParameters.push(parseAbiParameter(params[i], { structs, type: "error" }));
    }
    return { name: match.name, type: "error", inputs: abiParameters };
  }
  if (isConstructorSignature(signature)) {
    const match = execConstructorSignature(signature);
    if (!match)
      throw new InvalidSignatureError({ signature, type: "constructor" });
    const params = splitParameters(match.parameters);
    const abiParameters = [];
    const length = params.length;
    for (let i = 0; i < length; i++) {
      abiParameters.push(parseAbiParameter(params[i], { structs, type: "constructor" }));
    }
    return {
      type: "constructor",
      stateMutability: match.stateMutability ?? "nonpayable",
      inputs: abiParameters
    };
  }
  if (isFallbackSignature(signature))
    return { type: "fallback" };
  if (isReceiveSignature(signature))
    return {
      type: "receive",
      stateMutability: "payable"
    };
  throw new UnknownSignatureError({ signature });
}
var abiParameterWithoutTupleRegex = /^(?<type>[a-zA-Z$_][a-zA-Z0-9$_]*)(?<array>(?:\[\d*?\])+?)?(?:\s(?<modifier>calldata|indexed|memory|storage{1}))?(?:\s(?<name>[a-zA-Z$_][a-zA-Z0-9$_]*))?$/;
var abiParameterWithTupleRegex = /^\((?<type>.+?)\)(?<array>(?:\[\d*?\])+?)?(?:\s(?<modifier>calldata|indexed|memory|storage{1}))?(?:\s(?<name>[a-zA-Z$_][a-zA-Z0-9$_]*))?$/;
var dynamicIntegerRegex = /^u?int$/;
function parseAbiParameter(param, options) {
  const parameterCacheKey = getParameterCacheKey(param, options?.type);
  if (parameterCache.has(parameterCacheKey))
    return parameterCache.get(parameterCacheKey);
  const isTuple = isTupleRegex.test(param);
  const match = execTyped(isTuple ? abiParameterWithTupleRegex : abiParameterWithoutTupleRegex, param);
  if (!match)
    throw new InvalidParameterError({ param });
  if (match.name && isSolidityKeyword(match.name))
    throw new SolidityProtectedKeywordError({ param, name: match.name });
  const name = match.name ? { name: match.name } : {};
  const indexed = match.modifier === "indexed" ? { indexed: true } : {};
  const structs = options?.structs ?? {};
  let type;
  let components = {};
  if (isTuple) {
    type = "tuple";
    const params = splitParameters(match.type);
    const components_ = [];
    const length = params.length;
    for (let i = 0; i < length; i++) {
      components_.push(parseAbiParameter(params[i], { structs }));
    }
    components = { components: components_ };
  } else if (match.type in structs) {
    type = "tuple";
    components = { components: structs[match.type] };
  } else if (dynamicIntegerRegex.test(match.type)) {
    type = `${match.type}256`;
  } else {
    type = match.type;
    if (!(options?.type === "struct") && !isSolidityType(type))
      throw new UnknownSolidityTypeError({ type });
  }
  if (match.modifier) {
    if (!options?.modifiers?.has?.(match.modifier))
      throw new InvalidModifierError({
        param,
        type: options?.type,
        modifier: match.modifier
      });
    if (functionModifiers.has(match.modifier) && !isValidDataLocation(type, !!match.array))
      throw new InvalidFunctionModifierError({
        param,
        type: options?.type,
        modifier: match.modifier
      });
  }
  const abiParameter = {
    type: `${type}${match.array ?? ""}`,
    ...name,
    ...indexed,
    ...components
  };
  parameterCache.set(parameterCacheKey, abiParameter);
  return abiParameter;
}
function splitParameters(params, result = [], current = "", depth = 0) {
  if (params === "") {
    if (current === "")
      return result;
    if (depth !== 0)
      throw new InvalidParenthesisError({ current, depth });
    result.push(current.trim());
    return result;
  }
  const length = params.length;
  for (let i = 0; i < length; i++) {
    const char = params[i];
    const tail = params.slice(i + 1);
    switch (char) {
      case ",":
        return depth === 0 ? splitParameters(tail, [...result, current.trim()]) : splitParameters(tail, result, `${current}${char}`, depth);
      case "(":
        return splitParameters(tail, result, `${current}${char}`, depth + 1);
      case ")":
        return splitParameters(tail, result, `${current}${char}`, depth - 1);
      default:
        return splitParameters(tail, result, `${current}${char}`, depth);
    }
  }
  return [];
}
function isSolidityType(type) {
  return type === "address" || type === "bool" || type === "function" || type === "string" || bytesRegex.test(type) || integerRegex.test(type);
}
var protectedKeywordsRegex = /^(?:after|alias|anonymous|apply|auto|byte|calldata|case|catch|constant|copyof|default|defined|error|event|external|false|final|function|immutable|implements|in|indexed|inline|internal|let|mapping|match|memory|mutable|null|of|override|partial|private|promise|public|pure|reference|relocatable|return|returns|sizeof|static|storage|struct|super|supports|switch|this|true|try|typedef|typeof|var|view|virtual)$/;
function isSolidityKeyword(name) {
  return name === "address" || name === "bool" || name === "function" || name === "string" || name === "tuple" || bytesRegex.test(name) || integerRegex.test(name) || protectedKeywordsRegex.test(name);
}
function isValidDataLocation(type, isArray) {
  return isArray || type === "bytes" || type === "string" || type === "tuple";
}

// node_modules/abitype/dist/esm/human-readable/runtime/structs.js
function parseStructs(signatures) {
  const shallowStructs = {};
  const signaturesLength = signatures.length;
  for (let i = 0; i < signaturesLength; i++) {
    const signature = signatures[i];
    if (!isStructSignature(signature))
      continue;
    const match = execStructSignature(signature);
    if (!match)
      throw new InvalidSignatureError({ signature, type: "struct" });
    const properties = match.properties.split(";");
    const components = [];
    const propertiesLength = properties.length;
    for (let k = 0; k < propertiesLength; k++) {
      const property = properties[k];
      const trimmed = property.trim();
      if (!trimmed)
        continue;
      const abiParameter = parseAbiParameter(trimmed, {
        type: "struct"
      });
      components.push(abiParameter);
    }
    if (!components.length)
      throw new InvalidStructSignatureError({ signature });
    shallowStructs[match.name] = components;
  }
  const resolvedStructs = {};
  const entries = Object.entries(shallowStructs);
  const entriesLength = entries.length;
  for (let i = 0; i < entriesLength; i++) {
    const [name, parameters] = entries[i];
    resolvedStructs[name] = resolveStructs(parameters, shallowStructs);
  }
  return resolvedStructs;
}
var typeWithoutTupleRegex = /^(?<type>[a-zA-Z$_][a-zA-Z0-9$_]*)(?<array>(?:\[\d*?\])+?)?$/;
function resolveStructs(abiParameters, structs, ancestors = /* @__PURE__ */ new Set()) {
  const components = [];
  const length = abiParameters.length;
  for (let i = 0; i < length; i++) {
    const abiParameter = abiParameters[i];
    const isTuple = isTupleRegex.test(abiParameter.type);
    if (isTuple)
      components.push(abiParameter);
    else {
      const match = execTyped(typeWithoutTupleRegex, abiParameter.type);
      if (!match?.type)
        throw new InvalidAbiTypeParameterError({ abiParameter });
      const { array, type } = match;
      if (type in structs) {
        if (ancestors.has(type))
          throw new CircularReferenceError({ type });
        components.push({
          ...abiParameter,
          type: `tuple${array ?? ""}`,
          components: resolveStructs(structs[type] ?? [], structs, /* @__PURE__ */ new Set([...ancestors, type]))
        });
      } else {
        if (isSolidityType(type))
          components.push(abiParameter);
        else
          throw new UnknownTypeError({ type });
      }
    }
  }
  return components;
}

// node_modules/abitype/dist/esm/human-readable/parseAbi.js
function parseAbi(signatures) {
  const structs = parseStructs(signatures);
  const abi2 = [];
  const length = signatures.length;
  for (let i = 0; i < length; i++) {
    const signature = signatures[i];
    if (isStructSignature(signature))
      continue;
    abi2.push(parseSignature(signature, structs));
  }
  return abi2;
}

// node_modules/viem/_esm/utils/abi/decodeFunctionData.js
init_abi();
init_slice();
init_getFunctionSelector();
init_decodeAbiParameters();
init_formatAbiItem();
function decodeFunctionData({ abi: abi2, data }) {
  const signature = slice(data, 0, 4);
  const description = abi2.find((x) => x.type === "function" && signature === getFunctionSelector(formatAbiItem(x)));
  if (!description)
    throw new AbiFunctionSignatureNotFoundError(signature, {
      docsPath: "/docs/contract/decodeFunctionData"
    });
  return {
    functionName: description.name,
    args: "inputs" in description && description.inputs && description.inputs.length > 0 ? decodeAbiParameters(description.inputs, slice(data, 4)) : void 0
  };
}

// src/dapp.ts
var app = (0, import_app.createApp)({ url: "http://localhost:5004" });
var abi = parseAbi([
  "function attackDragon(uint256 dragonId, string weapon)",
  "function drinkPotion()"
]);
app.addAdvanceHandler(async ({ data }) => {
  console.log("Received advance request data " + data);
  const payload = data["payload"];
  const { functionName, args } = decodeFunctionData({ abi, data: payload });
  switch (functionName) {
    case "attackDragon":
      const [dragonId, weapon] = args;
      console.log(`attacking dragon ${dragonId} with ${weapon}...`);
      return "accept";
    case "drinkPotion":
      console.log(`drinking potion...`);
      return "accept";
  }
});
var wallet = (0, import_wallet.createWallet)();
var router = (0, import_router.createRouter)({ app });
router.add(
  "wallet/:address",
  ({ params: { address } }) => {
    return JSON.stringify({
      balance: wallet.balanceOf(address).toString()
    });
  }
);
app.addAdvanceHandler(wallet.handler);
app.addInspectHandler(router.handler);
app.start().catch((e) => process.exit(1));
/*! Bundled license information:

@noble/hashes/utils.js:
  (*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/abstract/utils.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/abstract/modular.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/abstract/curve.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/abstract/weierstrass.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/_shortw_utils.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/secp256k1.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/hashes/esm/utils.js:
  (*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) *)
*/
