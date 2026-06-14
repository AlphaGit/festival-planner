var LogicSolver = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb2, mod) => function __require() {
    return mod || (0, cb2[__getOwnPropNames(cb2)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key2 of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key2) && key2 !== except)
          __defProp(to, key2, { get: () => from[key2], enumerable: !(desc = __getOwnPropDesc(from, key2)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // node_modules/logic-solver/minisat.js
  var require_minisat = __commonJS({
    "node_modules/logic-solver/minisat.js"(exports, module) {
      var C_MINISAT;
      C_MINISAT = function() {
        var module = {};
        var require = function() {
        };
        var process = { argv: ["node", "minisat"], on: function() {
        }, stdout: { write: function(str) {
          console.log("MINISAT-out:", str.replace(/\n$/, ""));
        } }, stderr: { write: function(str) {
          console.log("MINISAT-err:", str.replace(/\n$/, ""));
        } } };
        var window = 0;
        var Module;
        if (!Module)
          Module = (typeof Module !== "undefined" ? Module : null) || {};
        var moduleOverrides = {};
        for (var key in Module) {
          if (Module.hasOwnProperty(key)) {
            moduleOverrides[key] = Module[key];
          }
        }
        var ENVIRONMENT_IS_NODE = typeof process === "object" && typeof require === "function";
        var ENVIRONMENT_IS_WEB = typeof window === "object";
        var ENVIRONMENT_IS_WORKER = typeof importScripts === "function";
        var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
        if (ENVIRONMENT_IS_NODE) {
          if (!Module["print"])
            Module["print"] = function print2(x) {
              process["stdout"].write(x + "\n");
            };
          if (!Module["printErr"])
            Module["printErr"] = function printErr2(x) {
              process["stderr"].write(x + "\n");
            };
          var nodeFS = require("fs");
          var nodePath = require("path");
          Module["read"] = function read2(filename, binary) {
            filename = nodePath["normalize"](filename);
            var ret = nodeFS["readFileSync"](filename);
            if (!ret && filename != nodePath["resolve"](filename)) {
              filename = path.join(__dirname, "..", "src", filename);
              ret = nodeFS["readFileSync"](filename);
            }
            if (ret && !binary)
              ret = ret.toString();
            return ret;
          };
          Module["readBinary"] = function readBinary(filename) {
            return Module["read"](filename, true);
          };
          Module["load"] = function load(f) {
            globalEval(read(f));
          };
          if (process["argv"].length > 1) {
            Module["thisProgram"] = process["argv"][1].replace(/\\/g, "/");
          } else {
            Module["thisProgram"] = "unknown-program";
          }
          Module["arguments"] = process["argv"].slice(2);
          if (typeof module !== "undefined") {
            module["exports"] = Module;
          }
          process["on"]("uncaughtException", function(ex) {
            if (!(ex instanceof ExitStatus)) {
              throw ex;
            }
          });
        } else if (ENVIRONMENT_IS_SHELL) {
          if (!Module["print"])
            Module["print"] = print;
          if (typeof printErr != "undefined")
            Module["printErr"] = printErr;
          if (typeof read != "undefined") {
            Module["read"] = read;
          } else {
            Module["read"] = function read2() {
              throw "no read() available (jsc?)";
            };
          }
          Module["readBinary"] = function readBinary(f) {
            if (typeof readbuffer === "function") {
              return new Uint8Array(readbuffer(f));
            }
            var data2 = read(f, "binary");
            assert(typeof data2 === "object");
            return data2;
          };
          if (typeof scriptArgs != "undefined") {
            Module["arguments"] = scriptArgs;
          } else if (typeof arguments != "undefined") {
            Module["arguments"] = arguments;
          }
          this["Module"] = Module;
        } else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
          Module["read"] = function read2(url) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, false);
            xhr.send(null);
            return xhr.responseText;
          };
          if (typeof arguments != "undefined") {
            Module["arguments"] = arguments;
          }
          if (typeof console !== "undefined") {
            if (!Module["print"])
              Module["print"] = function print2(x) {
                console.log(x);
              };
            if (!Module["printErr"])
              Module["printErr"] = function printErr2(x) {
                console.log(x);
              };
          } else {
            var TRY_USE_DUMP = false;
            if (!Module["print"])
              Module["print"] = TRY_USE_DUMP && typeof dump !== "undefined" ? function(x) {
                dump(x);
              } : function(x) {
              };
          }
          if (ENVIRONMENT_IS_WEB) {
            window["Module"] = Module;
          } else {
            Module["load"] = importScripts;
          }
        } else {
          throw "Unknown runtime environment. Where are we?";
        }
        function globalEval(x) {
          eval.call(null, x);
        }
        if (!Module["load"] && Module["read"]) {
          Module["load"] = function load(f) {
            globalEval(Module["read"](f));
          };
        }
        if (!Module["print"]) {
          Module["print"] = function() {
          };
        }
        if (!Module["printErr"]) {
          Module["printErr"] = Module["print"];
        }
        if (!Module["arguments"]) {
          Module["arguments"] = [];
        }
        if (!Module["thisProgram"]) {
          Module["thisProgram"] = "./this.program";
        }
        Module.print = Module["print"];
        Module.printErr = Module["printErr"];
        Module["preRun"] = [];
        Module["postRun"] = [];
        for (var key in moduleOverrides) {
          if (moduleOverrides.hasOwnProperty(key)) {
            Module[key] = moduleOverrides[key];
          }
        }
        var Runtime = { setTempRet0: function(value) {
          tempRet0 = value;
        }, getTempRet0: function() {
          return tempRet0;
        }, stackSave: function() {
          return STACKTOP;
        }, stackRestore: function(stackTop) {
          STACKTOP = stackTop;
        }, getNativeTypeSize: function(type2) {
          switch (type2) {
            case "i1":
            case "i8":
              return 1;
            case "i16":
              return 2;
            case "i32":
              return 4;
            case "i64":
              return 8;
            case "float":
              return 4;
            case "double":
              return 8;
            default: {
              if (type2[type2.length - 1] === "*") {
                return Runtime.QUANTUM_SIZE;
              } else if (type2[0] === "i") {
                var bits = parseInt(type2.substr(1));
                assert(bits % 8 === 0);
                return bits / 8;
              } else {
                return 0;
              }
            }
          }
        }, getNativeFieldSize: function(type2) {
          return Math.max(Runtime.getNativeTypeSize(type2), Runtime.QUANTUM_SIZE);
        }, STACK_ALIGN: 16, getAlignSize: function(type2, size2, vararg) {
          if (!vararg && (type2 == "i64" || type2 == "double"))
            return 8;
          if (!type2)
            return Math.min(size2, 8);
          return Math.min(size2 || (type2 ? Runtime.getNativeFieldSize(type2) : 0), Runtime.QUANTUM_SIZE);
        }, dynCall: function(sig, ptr, args2) {
          if (args2 && args2.length) {
            if (!args2.splice)
              args2 = Array.prototype.slice.call(args2);
            args2.splice(0, 0, ptr);
            return Module["dynCall_" + sig].apply(null, args2);
          } else {
            return Module["dynCall_" + sig].call(null, ptr);
          }
        }, functionPointers: [], addFunction: function(func2) {
          for (var i2 = 0; i2 < Runtime.functionPointers.length; i2++) {
            if (!Runtime.functionPointers[i2]) {
              Runtime.functionPointers[i2] = func2;
              return 2 * (1 + i2);
            }
          }
          throw "Finished up all reserved function pointers. Use a higher value for RESERVED_FUNCTION_POINTERS.";
        }, removeFunction: function(index) {
          Runtime.functionPointers[(index - 2) / 2] = null;
        }, getAsmConst: function(code, numArgs) {
          if (!Runtime.asmConstCache)
            Runtime.asmConstCache = {};
          var func = Runtime.asmConstCache[code];
          if (func)
            return func;
          var args = [];
          for (var i = 0; i < numArgs; i++) {
            args.push(String.fromCharCode(36) + i);
          }
          var source = Pointer_stringify(code);
          if (source[0] === '"') {
            if (source.indexOf('"', 1) === source.length - 1) {
              source = source.substr(1, source.length - 2);
            } else {
              abort("invalid EM_ASM input |" + source + "|. Please use EM_ASM(..code..) (no quotes) or EM_ASM({ ..code($0).. }, input) (to input values)");
            }
          }
          try {
            var evalled = eval("(function(Module, FS) { return function(" + args.join(",") + "){ " + source + " } })")(Module, typeof FS !== "undefined" ? FS : null);
          } catch (e) {
            Module.printErr("error in executing inline EM_ASM code: " + e + " on: \n\n" + source + "\n\nwith args |" + args + "| (make sure to use the right one out of EM_ASM, EM_ASM_ARGS, etc.)");
            throw e;
          }
          return Runtime.asmConstCache[code] = evalled;
        }, warnOnce: function(text) {
          if (!Runtime.warnOnce.shown)
            Runtime.warnOnce.shown = {};
          if (!Runtime.warnOnce.shown[text]) {
            Runtime.warnOnce.shown[text] = 1;
            Module.printErr(text);
          }
        }, funcWrappers: {}, getFuncWrapper: function(func2, sig) {
          assert(sig);
          if (!Runtime.funcWrappers[sig]) {
            Runtime.funcWrappers[sig] = {};
          }
          var sigCache = Runtime.funcWrappers[sig];
          if (!sigCache[func2]) {
            sigCache[func2] = function dynCall_wrapper() {
              return Runtime.dynCall(sig, func2, arguments);
            };
          }
          return sigCache[func2];
        }, UTF8Processor: function() {
          var buffer2 = [];
          var needed = 0;
          this.processCChar = function(code2) {
            code2 = code2 & 255;
            if (buffer2.length == 0) {
              if ((code2 & 128) == 0) {
                return String.fromCharCode(code2);
              }
              buffer2.push(code2);
              if ((code2 & 224) == 192) {
                needed = 1;
              } else if ((code2 & 240) == 224) {
                needed = 2;
              } else {
                needed = 3;
              }
              return "";
            }
            if (needed) {
              buffer2.push(code2);
              needed--;
              if (needed > 0)
                return "";
            }
            var c1 = buffer2[0];
            var c2 = buffer2[1];
            var c3 = buffer2[2];
            var c4 = buffer2[3];
            var ret;
            if (buffer2.length == 2) {
              ret = String.fromCharCode((c1 & 31) << 6 | c2 & 63);
            } else if (buffer2.length == 3) {
              ret = String.fromCharCode((c1 & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
            } else {
              var codePoint = (c1 & 7) << 18 | (c2 & 63) << 12 | (c3 & 63) << 6 | c4 & 63;
              ret = String.fromCharCode(((codePoint - 65536) / 1024 | 0) + 55296, (codePoint - 65536) % 1024 + 56320);
            }
            buffer2.length = 0;
            return ret;
          };
          this.processJSString = function processJSString(string) {
            string = unescape(encodeURIComponent(string));
            var ret = [];
            for (var i2 = 0; i2 < string.length; i2++) {
              ret.push(string.charCodeAt(i2));
            }
            return ret;
          };
        }, getCompilerSetting: function(name) {
          throw "You must build with -s RETAIN_COMPILER_SETTINGS=1 for Runtime.getCompilerSetting or emscripten_get_compiler_setting to work";
        }, stackAlloc: function(size2) {
          var ret = STACKTOP;
          STACKTOP = STACKTOP + size2 | 0;
          STACKTOP = STACKTOP + 15 & -16;
          return ret;
        }, staticAlloc: function(size2) {
          var ret = STATICTOP;
          STATICTOP = STATICTOP + size2 | 0;
          STATICTOP = STATICTOP + 15 & -16;
          return ret;
        }, dynamicAlloc: function(size2) {
          var ret = DYNAMICTOP;
          DYNAMICTOP = DYNAMICTOP + size2 | 0;
          DYNAMICTOP = DYNAMICTOP + 15 & -16;
          if (DYNAMICTOP >= TOTAL_MEMORY)
            enlargeMemory();
          return ret;
        }, alignMemory: function(size2, quantum) {
          var ret = size2 = Math.ceil(size2 / (quantum ? quantum : 16)) * (quantum ? quantum : 16);
          return ret;
        }, makeBigInt: function(low, high, unsigned) {
          var ret = unsigned ? +(low >>> 0) + +(high >>> 0) * 4294967296 : +(low >>> 0) + +(high | 0) * 4294967296;
          return ret;
        }, GLOBAL_BASE: 8, QUANTUM_SIZE: 4, __dummy__: 0 };
        Module["Runtime"] = Runtime;
        var __THREW__ = 0;
        var ABORT = false;
        var EXITSTATUS = 0;
        var undef = 0;
        var tempValue, tempInt, tempBigInt, tempInt2, tempBigInt2, tempPair, tempBigIntI, tempBigIntR, tempBigIntS, tempBigIntP, tempBigIntD, tempDouble, tempFloat;
        var tempI64, tempI64b;
        var tempRet0, tempRet1, tempRet2, tempRet3, tempRet4, tempRet5, tempRet6, tempRet7, tempRet8, tempRet9;
        function assert(condition, text) {
          if (!condition) {
            abort("Assertion failed: " + text);
          }
        }
        var globalScope = this;
        function getCFunc(ident) {
          var func = Module["_" + ident];
          if (!func) {
            try {
              func = eval("_" + ident);
            } catch (e) {
            }
          }
          assert(func, "Cannot call unknown function " + ident + " (perhaps LLVM optimizations or closure removed it?)");
          return func;
        }
        var cwrap, ccall;
        (function() {
          var JSfuncs = { "stackSave": function() {
            Runtime.stackSave();
          }, "stackRestore": function() {
            Runtime.stackRestore();
          }, "arrayToC": function(arr) {
            var ret = Runtime.stackAlloc(arr.length);
            writeArrayToMemory(arr, ret);
            return ret;
          }, "stringToC": function(str) {
            var ret = 0;
            if (str !== null && str !== void 0 && str !== 0) {
              ret = Runtime.stackAlloc((str.length << 2) + 1);
              writeStringToMemory(str, ret);
            }
            return ret;
          } };
          var toC = { "string": JSfuncs["stringToC"], "array": JSfuncs["arrayToC"] };
          ccall = function ccallFunc(ident2, returnType2, argTypes2, args2) {
            var func2 = getCFunc(ident2);
            var cArgs = [];
            var stack = 0;
            if (args2) {
              for (var i2 = 0; i2 < args2.length; i2++) {
                var converter = toC[argTypes2[i2]];
                if (converter) {
                  if (stack === 0)
                    stack = Runtime.stackSave();
                  cArgs[i2] = converter(args2[i2]);
                } else {
                  cArgs[i2] = args2[i2];
                }
              }
            }
            var ret = func2.apply(null, cArgs);
            if (returnType2 === "string")
              ret = Pointer_stringify(ret);
            if (stack !== 0)
              Runtime.stackRestore(stack);
            return ret;
          };
          var sourceRegex = /^function\s*\(([^)]*)\)\s*{\s*([^*]*?)[\s;]*(?:return\s*(.*?)[;\s]*)?}$/;
          function parseJSFunc(jsfunc) {
            var parsed = jsfunc.toString().match(sourceRegex).slice(1);
            return { arguments: parsed[0], body: parsed[1], returnValue: parsed[2] };
          }
          var JSsource = {};
          for (var fun in JSfuncs) {
            if (JSfuncs.hasOwnProperty(fun)) {
              JSsource[fun] = parseJSFunc(JSfuncs[fun]);
            }
          }
          cwrap = function cwrap(ident, returnType, argTypes) {
            argTypes = argTypes || [];
            var cfunc = getCFunc(ident);
            var numericArgs = argTypes.every(function(type2) {
              return type2 === "number";
            });
            var numericRet = returnType !== "string";
            if (numericRet && numericArgs) {
              return cfunc;
            }
            var argNames = argTypes.map(function(x, i2) {
              return "$" + i2;
            });
            var funcstr = "(function(" + argNames.join(",") + ") {";
            var nargs = argTypes.length;
            if (!numericArgs) {
              funcstr += "var stack = " + JSsource["stackSave"].body + ";";
              for (var i = 0; i < nargs; i++) {
                var arg = argNames[i], type = argTypes[i];
                if (type === "number")
                  continue;
                var convertCode = JSsource[type + "ToC"];
                funcstr += "var " + convertCode.arguments + " = " + arg + ";";
                funcstr += convertCode.body + ";";
                funcstr += arg + "=" + convertCode.returnValue + ";";
              }
            }
            var cfuncname = parseJSFunc(function() {
              return cfunc;
            }).returnValue;
            funcstr += "var ret = " + cfuncname + "(" + argNames.join(",") + ");";
            if (!numericRet) {
              var strgfy = parseJSFunc(function() {
                return Pointer_stringify;
              }).returnValue;
              funcstr += "ret = " + strgfy + "(ret);";
            }
            if (!numericArgs) {
              funcstr += JSsource["stackRestore"].body.replace("()", "(stack)") + ";";
            }
            funcstr += "return ret})";
            return eval(funcstr);
          };
        })();
        Module["cwrap"] = cwrap;
        Module["ccall"] = ccall;
        function setValue(ptr, value, type2, noSafe) {
          type2 = type2 || "i8";
          if (type2.charAt(type2.length - 1) === "*")
            type2 = "i32";
          switch (type2) {
            case "i1":
              HEAP8[ptr >> 0] = value;
              break;
            case "i8":
              HEAP8[ptr >> 0] = value;
              break;
            case "i16":
              HEAP16[ptr >> 1] = value;
              break;
            case "i32":
              HEAP32[ptr >> 2] = value;
              break;
            case "i64":
              tempI64 = [value >>> 0, (tempDouble = value, +Math_abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math_min(+Math_floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math_ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[ptr >> 2] = tempI64[0], HEAP32[ptr + 4 >> 2] = tempI64[1];
              break;
            case "float":
              HEAPF32[ptr >> 2] = value;
              break;
            case "double":
              HEAPF64[ptr >> 3] = value;
              break;
            default:
              abort("invalid type for setValue: " + type2);
          }
        }
        Module["setValue"] = setValue;
        function getValue(ptr, type2, noSafe) {
          type2 = type2 || "i8";
          if (type2.charAt(type2.length - 1) === "*")
            type2 = "i32";
          switch (type2) {
            case "i1":
              return HEAP8[ptr >> 0];
            case "i8":
              return HEAP8[ptr >> 0];
            case "i16":
              return HEAP16[ptr >> 1];
            case "i32":
              return HEAP32[ptr >> 2];
            case "i64":
              return HEAP32[ptr >> 2];
            case "float":
              return HEAPF32[ptr >> 2];
            case "double":
              return HEAPF64[ptr >> 3];
            default:
              abort("invalid type for setValue: " + type2);
          }
          return null;
        }
        Module["getValue"] = getValue;
        var ALLOC_NORMAL = 0;
        var ALLOC_STACK = 1;
        var ALLOC_STATIC = 2;
        var ALLOC_DYNAMIC = 3;
        var ALLOC_NONE = 4;
        Module["ALLOC_NORMAL"] = ALLOC_NORMAL;
        Module["ALLOC_STACK"] = ALLOC_STACK;
        Module["ALLOC_STATIC"] = ALLOC_STATIC;
        Module["ALLOC_DYNAMIC"] = ALLOC_DYNAMIC;
        Module["ALLOC_NONE"] = ALLOC_NONE;
        function allocate(slab, types, allocator, ptr) {
          var zeroinit, size2;
          if (typeof slab === "number") {
            zeroinit = true;
            size2 = slab;
          } else {
            zeroinit = false;
            size2 = slab.length;
          }
          var singleType = typeof types === "string" ? types : null;
          var ret;
          if (allocator == ALLOC_NONE) {
            ret = ptr;
          } else {
            ret = [_malloc, Runtime.stackAlloc, Runtime.staticAlloc, Runtime.dynamicAlloc][allocator === void 0 ? ALLOC_STATIC : allocator](Math.max(size2, singleType ? 1 : types.length));
          }
          if (zeroinit) {
            var ptr = ret, stop;
            assert((ret & 3) == 0);
            stop = ret + (size2 & ~3);
            for (; ptr < stop; ptr += 4) {
              HEAP32[ptr >> 2] = 0;
            }
            stop = ret + size2;
            while (ptr < stop) {
              HEAP8[ptr++ >> 0] = 0;
            }
            return ret;
          }
          if (singleType === "i8") {
            if (slab.subarray || slab.slice) {
              HEAPU8.set(slab, ret);
            } else {
              HEAPU8.set(new Uint8Array(slab), ret);
            }
            return ret;
          }
          var i2 = 0, type2, typeSize, previousType;
          while (i2 < size2) {
            var curr = slab[i2];
            if (typeof curr === "function") {
              curr = Runtime.getFunctionIndex(curr);
            }
            type2 = singleType || types[i2];
            if (type2 === 0) {
              i2++;
              continue;
            }
            if (type2 == "i64")
              type2 = "i32";
            setValue(ret + i2, curr, type2);
            if (previousType !== type2) {
              typeSize = Runtime.getNativeTypeSize(type2);
              previousType = type2;
            }
            i2 += typeSize;
          }
          return ret;
        }
        Module["allocate"] = allocate;
        function Pointer_stringify(ptr, length) {
          if (length === 0 || !ptr)
            return "";
          var hasUtf = false;
          var t;
          var i2 = 0;
          while (1) {
            t = HEAPU8[ptr + i2 >> 0];
            if (t >= 128)
              hasUtf = true;
            else if (t == 0 && !length)
              break;
            i2++;
            if (length && i2 == length)
              break;
          }
          if (!length)
            length = i2;
          var ret = "";
          if (!hasUtf) {
            var MAX_CHUNK = 1024;
            var curr;
            while (length > 0) {
              curr = String.fromCharCode.apply(String, HEAPU8.subarray(ptr, ptr + Math.min(length, MAX_CHUNK)));
              ret = ret ? ret + curr : curr;
              ptr += MAX_CHUNK;
              length -= MAX_CHUNK;
            }
            return ret;
          }
          var utf8 = new Runtime.UTF8Processor();
          for (i2 = 0; i2 < length; i2++) {
            t = HEAPU8[ptr + i2 >> 0];
            ret += utf8.processCChar(t);
          }
          return ret;
        }
        Module["Pointer_stringify"] = Pointer_stringify;
        function UTF16ToString(ptr) {
          var i2 = 0;
          var str = "";
          while (1) {
            var codeUnit = HEAP16[ptr + i2 * 2 >> 1];
            if (codeUnit == 0)
              return str;
            ++i2;
            str += String.fromCharCode(codeUnit);
          }
        }
        Module["UTF16ToString"] = UTF16ToString;
        function stringToUTF16(str, outPtr) {
          for (var i2 = 0; i2 < str.length; ++i2) {
            var codeUnit = str.charCodeAt(i2);
            HEAP16[outPtr + i2 * 2 >> 1] = codeUnit;
          }
          HEAP16[outPtr + str.length * 2 >> 1] = 0;
        }
        Module["stringToUTF16"] = stringToUTF16;
        function UTF32ToString(ptr) {
          var i2 = 0;
          var str = "";
          while (1) {
            var utf32 = HEAP32[ptr + i2 * 4 >> 2];
            if (utf32 == 0)
              return str;
            ++i2;
            if (utf32 >= 65536) {
              var ch = utf32 - 65536;
              str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
            } else {
              str += String.fromCharCode(utf32);
            }
          }
        }
        Module["UTF32ToString"] = UTF32ToString;
        function stringToUTF32(str, outPtr) {
          var iChar = 0;
          for (var iCodeUnit = 0; iCodeUnit < str.length; ++iCodeUnit) {
            var codeUnit = str.charCodeAt(iCodeUnit);
            if (codeUnit >= 55296 && codeUnit <= 57343) {
              var trailSurrogate = str.charCodeAt(++iCodeUnit);
              codeUnit = 65536 + ((codeUnit & 1023) << 10) | trailSurrogate & 1023;
            }
            HEAP32[outPtr + iChar * 4 >> 2] = codeUnit;
            ++iChar;
          }
          HEAP32[outPtr + iChar * 4 >> 2] = 0;
        }
        Module["stringToUTF32"] = stringToUTF32;
        function demangle(func2) {
          var hasLibcxxabi = !!Module["___cxa_demangle"];
          if (hasLibcxxabi) {
            try {
              var buf = _malloc(func2.length);
              writeStringToMemory(func2.substr(1), buf);
              var status = _malloc(4);
              var ret = Module["___cxa_demangle"](buf, 0, 0, status);
              if (getValue(status, "i32") === 0 && ret) {
                return Pointer_stringify(ret);
              }
            } catch (e) {
            } finally {
              if (buf)
                _free(buf);
              if (status)
                _free(status);
              if (ret)
                _free(ret);
            }
          }
          var i2 = 3;
          var basicTypes = { "v": "void", "b": "bool", "c": "char", "s": "short", "i": "int", "l": "long", "f": "float", "d": "double", "w": "wchar_t", "a": "signed char", "h": "unsigned char", "t": "unsigned short", "j": "unsigned int", "m": "unsigned long", "x": "long long", "y": "unsigned long long", "z": "..." };
          var subs = [];
          var first2 = true;
          function dump2(x) {
            if (x)
              Module.print(x);
            Module.print(func2);
            var pre = "";
            for (var a = 0; a < i2; a++)
              pre += " ";
            Module.print(pre + "^");
          }
          function parseNested() {
            i2++;
            if (func2[i2] === "K")
              i2++;
            var parts = [];
            while (func2[i2] !== "E") {
              if (func2[i2] === "S") {
                i2++;
                var next = func2.indexOf("_", i2);
                var num = func2.substring(i2, next) || 0;
                parts.push(subs[num] || "?");
                i2 = next + 1;
                continue;
              }
              if (func2[i2] === "C") {
                parts.push(parts[parts.length - 1]);
                i2 += 2;
                continue;
              }
              var size2 = parseInt(func2.substr(i2));
              var pre = size2.toString().length;
              if (!size2 || !pre) {
                i2--;
                break;
              }
              var curr = func2.substr(i2 + pre, size2);
              parts.push(curr);
              subs.push(curr);
              i2 += pre + size2;
            }
            i2++;
            return parts;
          }
          function parse(rawList, limit, allowVoid) {
            limit = limit || Infinity;
            var ret2 = "", list = [];
            function flushList() {
              return "(" + list.join(", ") + ")";
            }
            var name;
            if (func2[i2] === "N") {
              name = parseNested().join("::");
              limit--;
              if (limit === 0)
                return rawList ? [name] : name;
            } else {
              if (func2[i2] === "K" || first2 && func2[i2] === "L")
                i2++;
              var size2 = parseInt(func2.substr(i2));
              if (size2) {
                var pre = size2.toString().length;
                name = func2.substr(i2 + pre, size2);
                i2 += pre + size2;
              }
            }
            first2 = false;
            if (func2[i2] === "I") {
              i2++;
              var iList = parse(true);
              var iRet = parse(true, 1, true);
              ret2 += iRet[0] + " " + name + "<" + iList.join(", ") + ">";
            } else {
              ret2 = name;
            }
            paramLoop:
              while (i2 < func2.length && limit-- > 0) {
                var c = func2[i2++];
                if (c in basicTypes) {
                  list.push(basicTypes[c]);
                } else {
                  switch (c) {
                    case "P":
                      list.push(parse(true, 1, true)[0] + "*");
                      break;
                    case "R":
                      list.push(parse(true, 1, true)[0] + "&");
                      break;
                    case "L":
                      {
                        i2++;
                        var end = func2.indexOf("E", i2);
                        var size2 = end - i2;
                        list.push(func2.substr(i2, size2));
                        i2 += size2 + 2;
                        break;
                      }
                      ;
                    case "A":
                      {
                        var size2 = parseInt(func2.substr(i2));
                        i2 += size2.toString().length;
                        if (func2[i2] !== "_")
                          throw "?";
                        i2++;
                        list.push(parse(true, 1, true)[0] + " [" + size2 + "]");
                        break;
                      }
                      ;
                    case "E":
                      break paramLoop;
                    default:
                      ret2 += "?" + c;
                      break paramLoop;
                  }
                }
              }
            if (!allowVoid && list.length === 1 && list[0] === "void")
              list = [];
            if (rawList) {
              if (ret2) {
                list.push(ret2 + "?");
              }
              return list;
            } else {
              return ret2 + flushList();
            }
          }
          var parsed = func2;
          try {
            if (func2 == "Object._main" || func2 == "_main") {
              return "main()";
            }
            if (typeof func2 === "number")
              func2 = Pointer_stringify(func2);
            if (func2[0] !== "_")
              return func2;
            if (func2[1] !== "_")
              return func2;
            if (func2[2] !== "Z")
              return func2;
            switch (func2[3]) {
              case "n":
                return "operator new()";
              case "d":
                return "operator delete()";
            }
            parsed = parse();
          } catch (e) {
            parsed += "?";
          }
          if (parsed.indexOf("?") >= 0 && !hasLibcxxabi) {
            Runtime.warnOnce("warning: a problem occurred in builtin C++ name demangling; build with  -s DEMANGLE_SUPPORT=1  to link in libcxxabi demangling");
          }
          return parsed;
        }
        function demangleAll(text) {
          return text.replace(/__Z[\w\d_]+/g, function(x) {
            var y = demangle(x);
            return x === y ? x : x + " [" + y + "]";
          });
        }
        function jsStackTrace() {
          var err = new Error();
          if (!err.stack) {
            try {
              throw new Error(0);
            } catch (e) {
              err = e;
            }
            if (!err.stack) {
              return "(no stack trace available)";
            }
          }
          return err.stack.toString();
        }
        function stackTrace() {
          return demangleAll(jsStackTrace());
        }
        Module["stackTrace"] = stackTrace;
        var PAGE_SIZE = 4096;
        function alignMemoryPage(x) {
          return x + 4095 & -4096;
        }
        var HEAP;
        var HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
        var STATIC_BASE = 0, STATICTOP = 0, staticSealed = false;
        var STACK_BASE = 0, STACKTOP = 0, STACK_MAX = 0;
        var DYNAMIC_BASE = 0, DYNAMICTOP = 0;
        function enlargeMemory() {
          abort("Cannot enlarge memory arrays. Either (1) compile with -s TOTAL_MEMORY=X with X higher than the current value " + TOTAL_MEMORY + ", (2) compile with ALLOW_MEMORY_GROWTH which adjusts the size at runtime but prevents some optimizations, or (3) set Module.TOTAL_MEMORY before the program runs.");
        }
        var TOTAL_STACK = Module["TOTAL_STACK"] || 5242880;
        var TOTAL_MEMORY = Module["TOTAL_MEMORY"] || 67108864;
        var FAST_MEMORY = Module["FAST_MEMORY"] || 2097152;
        var totalMemory = 64 * 1024;
        while (totalMemory < TOTAL_MEMORY || totalMemory < 2 * TOTAL_STACK) {
          if (totalMemory < 16 * 1024 * 1024) {
            totalMemory *= 2;
          } else {
            totalMemory += 16 * 1024 * 1024;
          }
        }
        if (totalMemory !== TOTAL_MEMORY) {
          Module.printErr("increasing TOTAL_MEMORY to " + totalMemory + " to be compliant with the asm.js spec");
          TOTAL_MEMORY = totalMemory;
        }
        assert(typeof Int32Array !== "undefined" && typeof Float64Array !== "undefined" && !!new Int32Array(1)["subarray"] && !!new Int32Array(1)["set"], "JS engine does not provide full typed array support");
        var buffer = new ArrayBuffer(TOTAL_MEMORY);
        HEAP8 = new Int8Array(buffer);
        HEAP16 = new Int16Array(buffer);
        HEAP32 = new Int32Array(buffer);
        HEAPU8 = new Uint8Array(buffer);
        HEAPU16 = new Uint16Array(buffer);
        HEAPU32 = new Uint32Array(buffer);
        HEAPF32 = new Float32Array(buffer);
        HEAPF64 = new Float64Array(buffer);
        HEAP32[0] = 255;
        assert(HEAPU8[0] === 255 && HEAPU8[3] === 0, "Typed arrays 2 must be run on a little-endian system");
        Module["HEAP"] = HEAP;
        Module["buffer"] = buffer;
        Module["HEAP8"] = HEAP8;
        Module["HEAP16"] = HEAP16;
        Module["HEAP32"] = HEAP32;
        Module["HEAPU8"] = HEAPU8;
        Module["HEAPU16"] = HEAPU16;
        Module["HEAPU32"] = HEAPU32;
        Module["HEAPF32"] = HEAPF32;
        Module["HEAPF64"] = HEAPF64;
        function callRuntimeCallbacks(callbacks) {
          while (callbacks.length > 0) {
            var callback = callbacks.shift();
            if (typeof callback == "function") {
              callback();
              continue;
            }
            var func2 = callback.func;
            if (typeof func2 === "number") {
              if (callback.arg === void 0) {
                Runtime.dynCall("v", func2);
              } else {
                Runtime.dynCall("vi", func2, [callback.arg]);
              }
            } else {
              func2(callback.arg === void 0 ? null : callback.arg);
            }
          }
        }
        var __ATPRERUN__ = [];
        var __ATINIT__ = [];
        var __ATMAIN__ = [];
        var __ATEXIT__ = [];
        var __ATPOSTRUN__ = [];
        var runtimeInitialized = false;
        var runtimeExited = false;
        function preRun() {
          if (Module["preRun"]) {
            if (typeof Module["preRun"] == "function")
              Module["preRun"] = [Module["preRun"]];
            while (Module["preRun"].length) {
              addOnPreRun(Module["preRun"].shift());
            }
          }
          callRuntimeCallbacks(__ATPRERUN__);
        }
        function ensureInitRuntime() {
          if (runtimeInitialized)
            return;
          runtimeInitialized = true;
          callRuntimeCallbacks(__ATINIT__);
        }
        function preMain() {
          callRuntimeCallbacks(__ATMAIN__);
        }
        function exitRuntime() {
          callRuntimeCallbacks(__ATEXIT__);
          runtimeExited = true;
        }
        function postRun() {
          if (Module["postRun"]) {
            if (typeof Module["postRun"] == "function")
              Module["postRun"] = [Module["postRun"]];
            while (Module["postRun"].length) {
              addOnPostRun(Module["postRun"].shift());
            }
          }
          callRuntimeCallbacks(__ATPOSTRUN__);
        }
        function addOnPreRun(cb2) {
          __ATPRERUN__.unshift(cb2);
        }
        Module["addOnPreRun"] = Module.addOnPreRun = addOnPreRun;
        function addOnInit(cb2) {
          __ATINIT__.unshift(cb2);
        }
        Module["addOnInit"] = Module.addOnInit = addOnInit;
        function addOnPreMain(cb2) {
          __ATMAIN__.unshift(cb2);
        }
        Module["addOnPreMain"] = Module.addOnPreMain = addOnPreMain;
        function addOnExit(cb2) {
          __ATEXIT__.unshift(cb2);
        }
        Module["addOnExit"] = Module.addOnExit = addOnExit;
        function addOnPostRun(cb2) {
          __ATPOSTRUN__.unshift(cb2);
        }
        Module["addOnPostRun"] = Module.addOnPostRun = addOnPostRun;
        function intArrayFromString(stringy, dontAddNull, length) {
          var ret = new Runtime.UTF8Processor().processJSString(stringy);
          if (length) {
            ret.length = length;
          }
          if (!dontAddNull) {
            ret.push(0);
          }
          return ret;
        }
        Module["intArrayFromString"] = intArrayFromString;
        function intArrayToString(array) {
          var ret = [];
          for (var i2 = 0; i2 < array.length; i2++) {
            var chr = array[i2];
            if (chr > 255) {
              chr &= 255;
            }
            ret.push(String.fromCharCode(chr));
          }
          return ret.join("");
        }
        Module["intArrayToString"] = intArrayToString;
        function writeStringToMemory(string, buffer2, dontAddNull) {
          var array = intArrayFromString(string, dontAddNull);
          var i2 = 0;
          while (i2 < array.length) {
            var chr = array[i2];
            HEAP8[buffer2 + i2 >> 0] = chr;
            i2 = i2 + 1;
          }
        }
        Module["writeStringToMemory"] = writeStringToMemory;
        function writeArrayToMemory(array, buffer2) {
          for (var i2 = 0; i2 < array.length; i2++) {
            HEAP8[buffer2 + i2 >> 0] = array[i2];
          }
        }
        Module["writeArrayToMemory"] = writeArrayToMemory;
        function writeAsciiToMemory(str, buffer2, dontAddNull) {
          for (var i2 = 0; i2 < str.length; i2++) {
            HEAP8[buffer2 + i2 >> 0] = str.charCodeAt(i2);
          }
          if (!dontAddNull)
            HEAP8[buffer2 + str.length >> 0] = 0;
        }
        Module["writeAsciiToMemory"] = writeAsciiToMemory;
        function unSign(value, bits, ignore) {
          if (value >= 0) {
            return value;
          }
          return bits <= 32 ? 2 * Math.abs(1 << bits - 1) + value : Math.pow(2, bits) + value;
        }
        function reSign(value, bits, ignore) {
          if (value <= 0) {
            return value;
          }
          var half = bits <= 32 ? Math.abs(1 << bits - 1) : Math.pow(2, bits - 1);
          if (value >= half && (bits <= 32 || value > half)) {
            value = -2 * half + value;
          }
          return value;
        }
        if (!Math["imul"] || Math["imul"](4294967295, 5) !== -5)
          Math["imul"] = function imul(a, b) {
            var ah = a >>> 16;
            var al = a & 65535;
            var bh = b >>> 16;
            var bl = b & 65535;
            return al * bl + (ah * bl + al * bh << 16) | 0;
          };
        Math.imul = Math["imul"];
        var Math_abs = Math.abs;
        var Math_cos = Math.cos;
        var Math_sin = Math.sin;
        var Math_tan = Math.tan;
        var Math_acos = Math.acos;
        var Math_asin = Math.asin;
        var Math_atan = Math.atan;
        var Math_atan2 = Math.atan2;
        var Math_exp = Math.exp;
        var Math_log = Math.log;
        var Math_sqrt = Math.sqrt;
        var Math_ceil = Math.ceil;
        var Math_floor = Math.floor;
        var Math_pow = Math.pow;
        var Math_imul = Math.imul;
        var Math_fround = Math.fround;
        var Math_min = Math.min;
        var runDependencies = 0;
        var runDependencyWatcher = null;
        var dependenciesFulfilled = null;
        function addRunDependency(id) {
          runDependencies++;
          if (Module["monitorRunDependencies"]) {
            Module["monitorRunDependencies"](runDependencies);
          }
        }
        Module["addRunDependency"] = addRunDependency;
        function removeRunDependency(id) {
          runDependencies--;
          if (Module["monitorRunDependencies"]) {
            Module["monitorRunDependencies"](runDependencies);
          }
          if (runDependencies == 0) {
            if (runDependencyWatcher !== null) {
              clearInterval(runDependencyWatcher);
              runDependencyWatcher = null;
            }
            if (dependenciesFulfilled) {
              var callback = dependenciesFulfilled;
              dependenciesFulfilled = null;
              callback();
            }
          }
        }
        Module["removeRunDependency"] = removeRunDependency;
        Module["preloadedImages"] = {};
        Module["preloadedAudios"] = {};
        var memoryInitializer = null;
        STATIC_BASE = 8;
        STATICTOP = STATIC_BASE + 5664;
        __ATINIT__.push({ func: function() {
          __GLOBAL__I_a();
        } }, { func: function() {
          __GLOBAL__I_a127();
        } });
        allocate([78, 55, 77, 105, 110, 105, 115, 97, 116, 50, 48, 79, 117, 116, 79, 102, 77, 101, 109, 111, 114, 121, 69, 120, 99, 101, 112, 116, 105, 111, 110, 69, 0, 0, 0, 0, 0, 0, 0, 0, 88, 18, 0, 0, 8, 0, 0, 0, 78, 55, 77, 105, 110, 105, 115, 97, 116, 54, 79, 112, 116, 105, 111, 110, 69, 0, 0, 0, 0, 0, 0, 0, 88, 18, 0, 0, 56, 0, 0, 0, 10, 32, 32, 32, 32, 32, 32, 32, 32, 37, 115, 10, 0, 0, 0, 0, 0, 0, 0, 0, 80, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 200, 0, 0, 0, 1, 0, 0, 0, 3, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 78, 55, 77, 105, 110, 105, 115, 97, 116, 49, 48, 66, 111, 111, 108, 79, 112, 116, 105, 111, 110, 69, 0, 0, 128, 18, 0, 0, 176, 0, 0, 0, 80, 0, 0, 0, 0, 0, 0, 0, 32, 32, 45, 37, 115, 44, 32, 45, 110, 111, 45, 37, 115, 0, 0, 0, 40, 100, 101, 102, 97, 117, 108, 116, 58, 32, 37, 115, 41, 10, 0, 0, 111, 110, 0, 0, 0, 0, 0, 0, 111, 102, 102, 0, 0, 0, 0, 0, 110, 111, 45, 0, 0, 0, 0, 0, 0, 0, 0, 0, 64, 1, 0, 0, 1, 0, 0, 0, 4, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 78, 55, 77, 105, 110, 105, 115, 97, 116, 57, 73, 110, 116, 79, 112, 116, 105, 111, 110, 69, 0, 0, 0, 0, 128, 18, 0, 0, 40, 1, 0, 0, 80, 0, 0, 0, 0, 0, 0, 0, 32, 32, 45, 37, 45, 49, 50, 115, 32, 61, 32, 37, 45, 56, 115, 32, 91, 0, 0, 0, 0, 0, 0, 0, 105, 109, 105, 110, 0, 0, 0, 0, 37, 52, 100, 0, 0, 0, 0, 0, 32, 46, 46, 32, 0, 0, 0, 0, 105, 109, 97, 120, 0, 0, 0, 0, 93, 32, 40, 100, 101, 102, 97, 117, 108, 116, 58, 32, 37, 100, 41, 10, 0, 0, 0, 0, 0, 0, 0, 0, 69, 82, 82, 79, 82, 33, 32, 118, 97, 108, 117, 101, 32, 60, 37, 115, 62, 32, 105, 115, 32, 116, 111, 111, 32, 108, 97, 114, 103, 101, 32, 102, 111, 114, 32, 111, 112, 116, 105, 111, 110, 32, 34, 37, 115, 34, 46, 10, 0, 0, 0, 0, 0, 0, 0, 0, 69, 82, 82, 79, 82, 33, 32, 118, 97, 108, 117, 101, 32, 60, 37, 115, 62, 32, 105, 115, 32, 116, 111, 111, 32, 115, 109, 97, 108, 108, 32, 102, 111, 114, 32, 111, 112, 116, 105, 111, 110, 32, 34, 37, 115, 34, 46, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 118, 97, 114, 45, 100, 101, 99, 97, 121, 0, 0, 0, 0, 0, 0, 0, 84, 104, 101, 32, 118, 97, 114, 105, 97, 98, 108, 101, 32, 97, 99, 116, 105, 118, 105, 116, 121, 32, 100, 101, 99, 97, 121, 32, 102, 97, 99, 116, 111, 114, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 99, 108, 97, 45, 100, 101, 99, 97, 121, 0, 0, 0, 0, 0, 0, 0, 84, 104, 101, 32, 99, 108, 97, 117, 115, 101, 32, 97, 99, 116, 105, 118, 105, 116, 121, 32, 100, 101, 99, 97, 121, 32, 102, 97, 99, 116, 111, 114, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 114, 110, 100, 45, 102, 114, 101, 113, 0, 0, 0, 0, 0, 0, 0, 0, 84, 104, 101, 32, 102, 114, 101, 113, 117, 101, 110, 99, 121, 32, 119, 105, 116, 104, 32, 119, 104, 105, 99, 104, 32, 116, 104, 101, 32, 100, 101, 99, 105, 115, 105, 111, 110, 32, 104, 101, 117, 114, 105, 115, 116, 105, 99, 32, 116, 114, 105, 101, 115, 32, 116, 111, 32, 99, 104, 111, 111, 115, 101, 32, 97, 32, 114, 97, 110, 100, 111, 109, 32, 118, 97, 114, 105, 97, 98, 108, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 114, 110, 100, 45, 115, 101, 101, 100, 0, 0, 0, 0, 0, 0, 0, 0, 85, 115, 101, 100, 32, 98, 121, 32, 116, 104, 101, 32, 114, 97, 110, 100, 111, 109, 32, 118, 97, 114, 105, 97, 98, 108, 101, 32, 115, 101, 108, 101, 99, 116, 105, 111, 110, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 99, 99, 109, 105, 110, 45, 109, 111, 100, 101, 0, 0, 0, 0, 0, 0, 67, 111, 110, 116, 114, 111, 108, 115, 32, 99, 111, 110, 102, 108, 105, 99, 116, 32, 99, 108, 97, 117, 115, 101, 32, 109, 105, 110, 105, 109, 105, 122, 97, 116, 105, 111, 110, 32, 40, 48, 61, 110, 111, 110, 101, 44, 32, 49, 61, 98, 97, 115, 105, 99, 44, 32, 50, 61, 100, 101, 101, 112, 41, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 112, 104, 97, 115, 101, 45, 115, 97, 118, 105, 110, 103, 0, 0, 0, 0, 67, 111, 110, 116, 114, 111, 108, 115, 32, 116, 104, 101, 32, 108, 101, 118, 101, 108, 32, 111, 102, 32, 112, 104, 97, 115, 101, 32, 115, 97, 118, 105, 110, 103, 32, 40, 48, 61, 110, 111, 110, 101, 44, 32, 49, 61, 108, 105, 109, 105, 116, 101, 100, 44, 32, 50, 61, 102, 117, 108, 108, 41, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 114, 110, 100, 45, 105, 110, 105, 116, 0, 0, 0, 0, 0, 0, 0, 0, 82, 97, 110, 100, 111, 109, 105, 122, 101, 32, 116, 104, 101, 32, 105, 110, 105, 116, 105, 97, 108, 32, 97, 99, 116, 105, 118, 105, 116, 121, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 108, 117, 98, 121, 0, 0, 0, 0, 85, 115, 101, 32, 116, 104, 101, 32, 76, 117, 98, 121, 32, 114, 101, 115, 116, 97, 114, 116, 32, 115, 101, 113, 117, 101, 110, 99, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 114, 102, 105, 114, 115, 116, 0, 0, 84, 104, 101, 32, 98, 97, 115, 101, 32, 114, 101, 115, 116, 97, 114, 116, 32, 105, 110, 116, 101, 114, 118, 97, 108, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 114, 105, 110, 99, 0, 0, 0, 0, 82, 101, 115, 116, 97, 114, 116, 32, 105, 110, 116, 101, 114, 118, 97, 108, 32, 105, 110, 99, 114, 101, 97, 115, 101, 32, 102, 97, 99, 116, 111, 114, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 103, 99, 45, 102, 114, 97, 99, 0, 84, 104, 101, 32, 102, 114, 97, 99, 116, 105, 111, 110, 32, 111, 102, 32, 119, 97, 115, 116, 101, 100, 32, 109, 101, 109, 111, 114, 121, 32, 97, 108, 108, 111, 119, 101, 100, 32, 98, 101, 102, 111, 114, 101, 32, 97, 32, 103, 97, 114, 98, 97, 103, 101, 32, 99, 111, 108, 108, 101, 99, 116, 105, 111, 110, 32, 105, 115, 32, 116, 114, 105, 103, 103, 101, 114, 101, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 109, 105, 110, 45, 108, 101, 97, 114, 110, 116, 115, 0, 0, 0, 0, 0, 77, 105, 110, 105, 109, 117, 109, 32, 108, 101, 97, 114, 110, 116, 32, 99, 108, 97, 117, 115, 101, 32, 108, 105, 109, 105, 116, 0, 0, 0, 0, 0, 0, 0, 0, 0, 192, 7, 0, 0, 5, 0, 0, 0, 6, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 124, 32, 37, 57, 100, 32, 124, 32, 37, 55, 100, 32, 37, 56, 100, 32, 37, 56, 100, 32, 124, 32, 37, 56, 100, 32, 37, 56, 100, 32, 37, 54, 46, 48, 102, 32, 124, 32, 37, 54, 46, 51, 102, 32, 37, 37, 32, 124, 10, 0, 0, 0, 0, 0, 0, 0, 124, 32, 32, 71, 97, 114, 98, 97, 103, 101, 32, 99, 111, 108, 108, 101, 99, 116, 105, 111, 110, 58, 32, 32, 32, 37, 49, 50, 100, 32, 98, 121, 116, 101, 115, 32, 61, 62, 32, 37, 49, 50, 100, 32, 98, 121, 116, 101, 115, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 124, 10, 0, 0, 0, 0, 0, 0, 0, 0, 78, 55, 77, 105, 110, 105, 115, 97, 116, 54, 83, 111, 108, 118, 101, 114, 69, 0, 0, 0, 0, 0, 0, 0, 88, 18, 0, 0, 168, 7, 0, 0, 60, 98, 111, 111, 108, 62, 0, 0, 10, 32, 32, 32, 32, 32, 32, 32, 32, 37, 115, 10, 0, 0, 0, 0, 60, 105, 110, 116, 51, 50, 62, 0, 69, 82, 82, 79, 82, 33, 32, 118, 97, 108, 117, 101, 32, 60, 37, 115, 62, 32, 105, 115, 32, 116, 111, 111, 32, 108, 97, 114, 103, 101, 32, 102, 111, 114, 32, 111, 112, 116, 105, 111, 110, 32, 34, 37, 115, 34, 46, 10, 0, 0, 0, 0, 0, 0, 0, 0, 69, 82, 82, 79, 82, 33, 32, 118, 97, 108, 117, 101, 32, 60, 37, 115, 62, 32, 105, 115, 32, 116, 111, 111, 32, 115, 109, 97, 108, 108, 32, 102, 111, 114, 32, 111, 112, 116, 105, 111, 110, 32, 34, 37, 115, 34, 46, 10, 0, 0, 0, 0, 0, 0, 0, 0, 67, 79, 82, 69, 0, 0, 0, 0, 60, 100, 111, 117, 98, 108, 101, 62, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 168, 8, 0, 0, 1, 0, 0, 0, 8, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 78, 55, 77, 105, 110, 105, 115, 97, 116, 49, 50, 68, 111, 117, 98, 108, 101, 79, 112, 116, 105, 111, 110, 69, 0, 0, 0, 0, 0, 0, 0, 0, 128, 18, 0, 0, 136, 8, 0, 0, 80, 0, 0, 0, 0, 0, 0, 0, 32, 32, 45, 37, 45, 49, 50, 115, 32, 61, 32, 37, 45, 56, 115, 32, 37, 99, 37, 52, 46, 50, 103, 32, 46, 46, 32, 37, 52, 46, 50, 103, 37, 99, 32, 40, 100, 101, 102, 97, 117, 108, 116, 58, 32, 37, 103, 41, 10, 0, 0, 0, 0, 0, 0, 0, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 91, 32, 83, 101, 97, 114, 99, 104, 32, 83, 116, 97, 116, 105, 115, 116, 105, 99, 115, 32, 93, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 0, 124, 32, 67, 111, 110, 102, 108, 105, 99, 116, 115, 32, 124, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 79, 82, 73, 71, 73, 78, 65, 76, 32, 32, 32, 32, 32, 32, 32, 32, 32, 124, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 76, 69, 65, 82, 78, 84, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 124, 32, 80, 114, 111, 103, 114, 101, 115, 115, 32, 124, 0, 124, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 124, 32, 32, 32, 32, 86, 97, 114, 115, 32, 32, 67, 108, 97, 117, 115, 101, 115, 32, 76, 105, 116, 101, 114, 97, 108, 115, 32, 124, 32, 32, 32, 32, 76, 105, 109, 105, 116, 32, 32, 67, 108, 97, 117, 115, 101, 115, 32, 76, 105, 116, 47, 67, 108, 32, 124, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 124, 0, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 97, 115, 121, 109, 109, 0, 0, 0, 83, 104, 114, 105, 110, 107, 32, 99, 108, 97, 117, 115, 101, 115, 32, 98, 121, 32, 97, 115, 121, 109, 109, 101, 116, 114, 105, 99, 32, 98, 114, 97, 110, 99, 104, 105, 110, 103, 46, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 114, 99, 104, 101, 99, 107, 0, 0, 67, 104, 101, 99, 107, 32, 105, 102, 32, 97, 32, 99, 108, 97, 117, 115, 101, 32, 105, 115, 32, 97, 108, 114, 101, 97, 100, 121, 32, 105, 109, 112, 108, 105, 101, 100, 46, 32, 40, 99, 111, 115, 116, 108, 121, 41, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 101, 108, 105, 109, 0, 0, 0, 0, 80, 101, 114, 102, 111, 114, 109, 32, 118, 97, 114, 105, 97, 98, 108, 101, 32, 101, 108, 105, 109, 105, 110, 97, 116, 105, 111, 110, 46, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 103, 114, 111, 119, 0, 0, 0, 0, 65, 108, 108, 111, 119, 32, 97, 32, 118, 97, 114, 105, 97, 98, 108, 101, 32, 101, 108, 105, 109, 105, 110, 97, 116, 105, 111, 110, 32, 115, 116, 101, 112, 32, 116, 111, 32, 103, 114, 111, 119, 32, 98, 121, 32, 97, 32, 110, 117, 109, 98, 101, 114, 32, 111, 102, 32, 99, 108, 97, 117, 115, 101, 115, 46, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 99, 108, 45, 108, 105, 109, 0, 0, 86, 97, 114, 105, 97, 98, 108, 101, 115, 32, 97, 114, 101, 32, 110, 111, 116, 32, 101, 108, 105, 109, 105, 110, 97, 116, 101, 100, 32, 105, 102, 32, 105, 116, 32, 112, 114, 111, 100, 117, 99, 101, 115, 32, 97, 32, 114, 101, 115, 111, 108, 118, 101, 110, 116, 32, 119, 105, 116, 104, 32, 97, 32, 108, 101, 110, 103, 116, 104, 32, 97, 98, 111, 118, 101, 32, 116, 104, 105, 115, 32, 108, 105, 109, 105, 116, 46, 32, 45, 49, 32, 109, 101, 97, 110, 115, 32, 110, 111, 32, 108, 105, 109, 105, 116, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 115, 117, 98, 45, 108, 105, 109, 0, 68, 111, 32, 110, 111, 116, 32, 99, 104, 101, 99, 107, 32, 105, 102, 32, 115, 117, 98, 115, 117, 109, 112, 116, 105, 111, 110, 32, 97, 103, 97, 105, 110, 115, 116, 32, 97, 32, 99, 108, 97, 117, 115, 101, 32, 108, 97, 114, 103, 101, 114, 32, 116, 104, 97, 110, 32, 116, 104, 105, 115, 46, 32, 45, 49, 32, 109, 101, 97, 110, 115, 32, 110, 111, 32, 108, 105, 109, 105, 116, 46, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 115, 105, 109, 112, 45, 103, 99, 45, 102, 114, 97, 99, 0, 0, 0, 0, 84, 104, 101, 32, 102, 114, 97, 99, 116, 105, 111, 110, 32, 111, 102, 32, 119, 97, 115, 116, 101, 100, 32, 109, 101, 109, 111, 114, 121, 32, 97, 108, 108, 111, 119, 101, 100, 32, 98, 101, 102, 111, 114, 101, 32, 97, 32, 103, 97, 114, 98, 97, 103, 101, 32, 99, 111, 108, 108, 101, 99, 116, 105, 111, 110, 32, 105, 115, 32, 116, 114, 105, 103, 103, 101, 114, 101, 100, 32, 100, 117, 114, 105, 110, 103, 32, 115, 105, 109, 112, 108, 105, 102, 105, 99, 97, 116, 105, 111, 110, 46, 0, 0, 0, 0, 0, 0, 0, 120, 14, 0, 0, 9, 0, 0, 0, 10, 0, 0, 0, 11, 0, 0, 0, 0, 0, 0, 0, 115, 117, 98, 115, 117, 109, 112, 116, 105, 111, 110, 32, 108, 101, 102, 116, 58, 32, 37, 49, 48, 100, 32, 40, 37, 49, 48, 100, 32, 115, 117, 98, 115, 117, 109, 101, 100, 44, 32, 37, 49, 48, 100, 32, 100, 101, 108, 101, 116, 101, 100, 32, 108, 105, 116, 101, 114, 97, 108, 115, 41, 13, 0, 0, 101, 108, 105, 109, 105, 110, 97, 116, 105, 111, 110, 32, 108, 101, 102, 116, 58, 32, 37, 49, 48, 100, 13, 0, 124, 32, 32, 69, 108, 105, 109, 105, 110, 97, 116, 101, 100, 32, 99, 108, 97, 117, 115, 101, 115, 58, 32, 32, 32, 32, 32, 37, 49, 48, 46, 50, 102, 32, 77, 98, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 124, 10, 0, 0, 0, 0, 124, 32, 32, 71, 97, 114, 98, 97, 103, 101, 32, 99, 111, 108, 108, 101, 99, 116, 105, 111, 110, 58, 32, 32, 32, 37, 49, 50, 100, 32, 98, 121, 116, 101, 115, 32, 61, 62, 32, 37, 49, 50, 100, 32, 98, 121, 116, 101, 115, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 124, 10, 0, 0, 0, 0, 0, 0, 0, 0, 78, 55, 77, 105, 110, 105, 115, 97, 116, 49, 48, 83, 105, 109, 112, 83, 111, 108, 118, 101, 114, 69, 0, 0, 128, 18, 0, 0, 96, 14, 0, 0, 192, 7, 0, 0, 0, 0, 0, 0, 60, 100, 111, 117, 98, 108, 101, 62, 0, 0, 0, 0, 0, 0, 0, 0, 60, 105, 110, 116, 51, 50, 62, 0, 83, 73, 77, 80, 0, 0, 0, 0, 60, 98, 111, 111, 108, 62, 0, 0, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 89, 79, 33, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 48, 15, 0, 0, 0, 0, 0, 0, 117, 110, 99, 97, 117, 103, 104, 116, 0, 0, 0, 0, 0, 0, 0, 0, 116, 101, 114, 109, 105, 110, 97, 116, 105, 110, 103, 32, 119, 105, 116, 104, 32, 37, 115, 32, 101, 120, 99, 101, 112, 116, 105, 111, 110, 32, 111, 102, 32, 116, 121, 112, 101, 32, 37, 115, 58, 32, 37, 115, 0, 0, 0, 0, 116, 101, 114, 109, 105, 110, 97, 116, 105, 110, 103, 32, 119, 105, 116, 104, 32, 37, 115, 32, 101, 120, 99, 101, 112, 116, 105, 111, 110, 32, 111, 102, 32, 116, 121, 112, 101, 32, 37, 115, 0, 0, 0, 0, 0, 0, 0, 0, 116, 101, 114, 109, 105, 110, 97, 116, 105, 110, 103, 32, 119, 105, 116, 104, 32, 37, 115, 32, 102, 111, 114, 101, 105, 103, 110, 32, 101, 120, 99, 101, 112, 116, 105, 111, 110, 0, 0, 0, 116, 101, 114, 109, 105, 110, 97, 116, 105, 110, 103, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 112, 116, 104, 114, 101, 97, 100, 95, 111, 110, 99, 101, 32, 102, 97, 105, 108, 117, 114, 101, 32, 105, 110, 32, 95, 95, 99, 120, 97, 95, 103, 101, 116, 95, 103, 108, 111, 98, 97, 108, 115, 95, 102, 97, 115, 116, 40, 41, 0, 0, 0, 0, 0, 0, 0, 0, 99, 97, 110, 110, 111, 116, 32, 99, 114, 101, 97, 116, 101, 32, 112, 116, 104, 114, 101, 97, 100, 32, 107, 101, 121, 32, 102, 111, 114, 32, 95, 95, 99, 120, 97, 95, 103, 101, 116, 95, 103, 108, 111, 98, 97, 108, 115, 40, 41, 0, 0, 0, 0, 0, 0, 0, 99, 97, 110, 110, 111, 116, 32, 122, 101, 114, 111, 32, 111, 117, 116, 32, 116, 104, 114, 101, 97, 100, 32, 118, 97, 108, 117, 101, 32, 102, 111, 114, 32, 95, 95, 99, 120, 97, 95, 103, 101, 116, 95, 103, 108, 111, 98, 97, 108, 115, 40, 41, 0, 0, 0, 0, 0, 0, 0, 0, 200, 16, 0, 0, 12, 0, 0, 0, 13, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 115, 116, 100, 58, 58, 98, 97, 100, 95, 97, 108, 108, 111, 99, 0, 0, 83, 116, 57, 98, 97, 100, 95, 97, 108, 108, 111, 99, 0, 0, 0, 0, 128, 18, 0, 0, 184, 16, 0, 0, 80, 17, 0, 0, 0, 0, 0, 0, 116, 101, 114, 109, 105, 110, 97, 116, 101, 95, 104, 97, 110, 100, 108, 101, 114, 32, 117, 110, 101, 120, 112, 101, 99, 116, 101, 100, 108, 121, 32, 114, 101, 116, 117, 114, 110, 101, 100, 0, 116, 101, 114, 109, 105, 110, 97, 116, 101, 95, 104, 97, 110, 100, 108, 101, 114, 32, 117, 110, 101, 120, 112, 101, 99, 116, 101, 100, 108, 121, 32, 116, 104, 114, 101, 119, 32, 97, 110, 32, 101, 120, 99, 101, 112, 116, 105, 111, 110, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 83, 116, 57, 101, 120, 99, 101, 112, 116, 105, 111, 110, 0, 0, 0, 0, 88, 18, 0, 0, 64, 17, 0, 0, 83, 116, 57, 116, 121, 112, 101, 95, 105, 110, 102, 111, 0, 0, 0, 0, 88, 18, 0, 0, 88, 17, 0, 0, 78, 49, 48, 95, 95, 99, 120, 120, 97, 98, 105, 118, 49, 49, 54, 95, 95, 115, 104, 105, 109, 95, 116, 121, 112, 101, 95, 105, 110, 102, 111, 69, 0, 0, 0, 0, 0, 0, 0, 0, 128, 18, 0, 0, 112, 17, 0, 0, 104, 17, 0, 0, 0, 0, 0, 0, 78, 49, 48, 95, 95, 99, 120, 120, 97, 98, 105, 118, 49, 49, 55, 95, 95, 99, 108, 97, 115, 115, 95, 116, 121, 112, 101, 95, 105, 110, 102, 111, 69, 0, 0, 0, 0, 0, 0, 0, 128, 18, 0, 0, 168, 17, 0, 0, 152, 17, 0, 0, 0, 0, 0, 0, 78, 49, 48, 95, 95, 99, 120, 120, 97, 98, 105, 118, 49, 49, 57, 95, 95, 112, 111, 105, 110, 116, 101, 114, 95, 116, 121, 112, 101, 95, 105, 110, 102, 111, 69, 0, 0, 0, 0, 0, 78, 49, 48, 95, 95, 99, 120, 120, 97, 98, 105, 118, 49, 49, 55, 95, 95, 112, 98, 97, 115, 101, 95, 116, 121, 112, 101, 95, 105, 110, 102, 111, 69, 0, 0, 0, 0, 0, 0, 0, 128, 18, 0, 0, 8, 18, 0, 0, 152, 17, 0, 0, 0, 0, 0, 0, 128, 18, 0, 0, 224, 17, 0, 0, 48, 18, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 208, 17, 0, 0, 14, 0, 0, 0, 15, 0, 0, 0, 16, 0, 0, 0, 17, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 200, 18, 0, 0, 14, 0, 0, 0, 18, 0, 0, 0, 16, 0, 0, 0, 17, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 78, 49, 48, 95, 95, 99, 120, 120, 97, 98, 105, 118, 49, 50, 48, 95, 95, 115, 105, 95, 99, 108, 97, 115, 115, 95, 116, 121, 112, 101, 95, 105, 110, 102, 111, 69, 0, 0, 0, 0, 128, 18, 0, 0, 160, 18, 0, 0, 208, 17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 255, 255, 255, 255, 255, 255, 255, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 255, 255, 255, 255, 255, 255, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 4, 7, 3, 6, 5, 0, 0, 0, 0, 0, 0, 0, 0, 105, 110, 102, 105, 110, 105, 116, 121, 0, 0, 0, 0, 0, 0, 0, 0, 110, 97, 110, 0, 0, 0, 0, 0, 95, 112, 137, 0, 255, 9, 47, 15, 10, 0, 0, 0, 100, 0, 0, 0, 232, 3, 0, 0, 16, 39, 0, 0, 160, 134, 1, 0, 64, 66, 15, 0, 128, 150, 152, 0, 0, 225, 245, 5], "i8", ALLOC_NONE, Runtime.GLOBAL_BASE);
        var tempDoublePtr = Runtime.alignMemory(allocate(12, "i8", ALLOC_STATIC), 8);
        assert(tempDoublePtr % 8 == 0);
        function copyTempFloat(ptr) {
          HEAP8[tempDoublePtr] = HEAP8[ptr];
          HEAP8[tempDoublePtr + 1] = HEAP8[ptr + 1];
          HEAP8[tempDoublePtr + 2] = HEAP8[ptr + 2];
          HEAP8[tempDoublePtr + 3] = HEAP8[ptr + 3];
        }
        function copyTempDouble(ptr) {
          HEAP8[tempDoublePtr] = HEAP8[ptr];
          HEAP8[tempDoublePtr + 1] = HEAP8[ptr + 1];
          HEAP8[tempDoublePtr + 2] = HEAP8[ptr + 2];
          HEAP8[tempDoublePtr + 3] = HEAP8[ptr + 3];
          HEAP8[tempDoublePtr + 4] = HEAP8[ptr + 4];
          HEAP8[tempDoublePtr + 5] = HEAP8[ptr + 5];
          HEAP8[tempDoublePtr + 6] = HEAP8[ptr + 6];
          HEAP8[tempDoublePtr + 7] = HEAP8[ptr + 7];
        }
        function _atexit(func2, arg2) {
          __ATEXIT__.unshift({ func: func2, arg: arg2 });
        }
        function ___cxa_atexit() {
          return _atexit.apply(null, arguments);
        }
        Module["_i64Subtract"] = _i64Subtract;
        var ___errno_state = 0;
        function ___setErrNo(value) {
          HEAP32[___errno_state >> 2] = value;
          return value;
        }
        var ERRNO_CODES = { EPERM: 1, ENOENT: 2, ESRCH: 3, EINTR: 4, EIO: 5, ENXIO: 6, E2BIG: 7, ENOEXEC: 8, EBADF: 9, ECHILD: 10, EAGAIN: 11, EWOULDBLOCK: 11, ENOMEM: 12, EACCES: 13, EFAULT: 14, ENOTBLK: 15, EBUSY: 16, EEXIST: 17, EXDEV: 18, ENODEV: 19, ENOTDIR: 20, EISDIR: 21, EINVAL: 22, ENFILE: 23, EMFILE: 24, ENOTTY: 25, ETXTBSY: 26, EFBIG: 27, ENOSPC: 28, ESPIPE: 29, EROFS: 30, EMLINK: 31, EPIPE: 32, EDOM: 33, ERANGE: 34, ENOMSG: 42, EIDRM: 43, ECHRNG: 44, EL2NSYNC: 45, EL3HLT: 46, EL3RST: 47, ELNRNG: 48, EUNATCH: 49, ENOCSI: 50, EL2HLT: 51, EDEADLK: 35, ENOLCK: 37, EBADE: 52, EBADR: 53, EXFULL: 54, ENOANO: 55, EBADRQC: 56, EBADSLT: 57, EDEADLOCK: 35, EBFONT: 59, ENOSTR: 60, ENODATA: 61, ETIME: 62, ENOSR: 63, ENONET: 64, ENOPKG: 65, EREMOTE: 66, ENOLINK: 67, EADV: 68, ESRMNT: 69, ECOMM: 70, EPROTO: 71, EMULTIHOP: 72, EDOTDOT: 73, EBADMSG: 74, ENOTUNIQ: 76, EBADFD: 77, EREMCHG: 78, ELIBACC: 79, ELIBBAD: 80, ELIBSCN: 81, ELIBMAX: 82, ELIBEXEC: 83, ENOSYS: 38, ENOTEMPTY: 39, ENAMETOOLONG: 36, ELOOP: 40, EOPNOTSUPP: 95, EPFNOSUPPORT: 96, ECONNRESET: 104, ENOBUFS: 105, EAFNOSUPPORT: 97, EPROTOTYPE: 91, ENOTSOCK: 88, ENOPROTOOPT: 92, ESHUTDOWN: 108, ECONNREFUSED: 111, EADDRINUSE: 98, ECONNABORTED: 103, ENETUNREACH: 101, ENETDOWN: 100, ETIMEDOUT: 110, EHOSTDOWN: 112, EHOSTUNREACH: 113, EINPROGRESS: 115, EALREADY: 114, EDESTADDRREQ: 89, EMSGSIZE: 90, EPROTONOSUPPORT: 93, ESOCKTNOSUPPORT: 94, EADDRNOTAVAIL: 99, ENETRESET: 102, EISCONN: 106, ENOTCONN: 107, ETOOMANYREFS: 109, EUSERS: 87, EDQUOT: 122, ESTALE: 116, ENOTSUP: 95, ENOMEDIUM: 123, EILSEQ: 84, EOVERFLOW: 75, ECANCELED: 125, ENOTRECOVERABLE: 131, EOWNERDEAD: 130, ESTRPIPE: 86 };
        function _sysconf(name) {
          switch (name) {
            case 30:
              return PAGE_SIZE;
            case 132:
            case 133:
            case 12:
            case 137:
            case 138:
            case 15:
            case 235:
            case 16:
            case 17:
            case 18:
            case 19:
            case 20:
            case 149:
            case 13:
            case 10:
            case 236:
            case 153:
            case 9:
            case 21:
            case 22:
            case 159:
            case 154:
            case 14:
            case 77:
            case 78:
            case 139:
            case 80:
            case 81:
            case 79:
            case 82:
            case 68:
            case 67:
            case 164:
            case 11:
            case 29:
            case 47:
            case 48:
            case 95:
            case 52:
            case 51:
            case 46:
              return 200809;
            case 27:
            case 246:
            case 127:
            case 128:
            case 23:
            case 24:
            case 160:
            case 161:
            case 181:
            case 182:
            case 242:
            case 183:
            case 184:
            case 243:
            case 244:
            case 245:
            case 165:
            case 178:
            case 179:
            case 49:
            case 50:
            case 168:
            case 169:
            case 175:
            case 170:
            case 171:
            case 172:
            case 97:
            case 76:
            case 32:
            case 173:
            case 35:
              return -1;
            case 176:
            case 177:
            case 7:
            case 155:
            case 8:
            case 157:
            case 125:
            case 126:
            case 92:
            case 93:
            case 129:
            case 130:
            case 131:
            case 94:
            case 91:
              return 1;
            case 74:
            case 60:
            case 69:
            case 70:
            case 4:
              return 1024;
            case 31:
            case 42:
            case 72:
              return 32;
            case 87:
            case 26:
            case 33:
              return 2147483647;
            case 34:
            case 1:
              return 47839;
            case 38:
            case 36:
              return 99;
            case 43:
            case 37:
              return 2048;
            case 0:
              return 2097152;
            case 3:
              return 65536;
            case 28:
              return 32768;
            case 44:
              return 32767;
            case 75:
              return 16384;
            case 39:
              return 1e3;
            case 89:
              return 700;
            case 71:
              return 256;
            case 40:
              return 255;
            case 2:
              return 100;
            case 180:
              return 64;
            case 25:
              return 20;
            case 5:
              return 16;
            case 6:
              return 6;
            case 73:
              return 4;
            case 84: {
              if (typeof navigator === "object")
                return navigator["hardwareConcurrency"] || 1;
              return 1;
            }
          }
          ___setErrNo(ERRNO_CODES.EINVAL);
          return -1;
        }
        function __ZSt18uncaught_exceptionv() {
          return !!__ZSt18uncaught_exceptionv.uncaught_exception;
        }
        var EXCEPTIONS = { last: 0, caught: [], infos: {}, deAdjust: function(adjusted) {
          if (!adjusted || EXCEPTIONS.infos[adjusted])
            return adjusted;
          for (var ptr in EXCEPTIONS.infos) {
            var info = EXCEPTIONS.infos[ptr];
            if (info.adjusted === adjusted) {
              return ptr;
            }
          }
          return adjusted;
        }, addRef: function(ptr) {
          if (!ptr)
            return;
          var info = EXCEPTIONS.infos[ptr];
          info.refcount++;
        }, decRef: function(ptr) {
          if (!ptr)
            return;
          var info = EXCEPTIONS.infos[ptr];
          assert(info.refcount > 0);
          info.refcount--;
          if (info.refcount === 0) {
            if (info.destructor) {
              Runtime.dynCall("vi", info.destructor, [ptr]);
            }
            delete EXCEPTIONS.infos[ptr];
            ___cxa_free_exception(ptr);
          }
        }, clearRef: function(ptr) {
          if (!ptr)
            return;
          var info = EXCEPTIONS.infos[ptr];
          info.refcount = 0;
        } };
        function ___resumeException(ptr) {
          if (!EXCEPTIONS.last) {
            EXCEPTIONS.last = ptr;
          }
          EXCEPTIONS.clearRef(EXCEPTIONS.deAdjust(ptr));
          throw ptr + " - Exception catching is disabled, this exception cannot be caught. Compile with -s DISABLE_EXCEPTION_CATCHING=0 or DISABLE_EXCEPTION_CATCHING=2 to catch.";
        }
        function ___cxa_find_matching_catch() {
          var thrown = EXCEPTIONS.last;
          if (!thrown) {
            return (asm["setTempRet0"](0), 0) | 0;
          }
          var info = EXCEPTIONS.infos[thrown];
          var throwntype = info.type;
          if (!throwntype) {
            return (asm["setTempRet0"](0), thrown) | 0;
          }
          var typeArray = Array.prototype.slice.call(arguments);
          var pointer = Module["___cxa_is_pointer_type"](throwntype);
          if (!___cxa_find_matching_catch.buffer)
            ___cxa_find_matching_catch.buffer = _malloc(4);
          HEAP32[___cxa_find_matching_catch.buffer >> 2] = thrown;
          thrown = ___cxa_find_matching_catch.buffer;
          for (var i2 = 0; i2 < typeArray.length; i2++) {
            if (typeArray[i2] && Module["___cxa_can_catch"](typeArray[i2], throwntype, thrown)) {
              thrown = HEAP32[thrown >> 2];
              info.adjusted = thrown;
              return (asm["setTempRet0"](typeArray[i2]), thrown) | 0;
            }
          }
          thrown = HEAP32[thrown >> 2];
          return (asm["setTempRet0"](throwntype), thrown) | 0;
        }
        function ___cxa_throw(ptr, type2, destructor) {
          EXCEPTIONS.infos[ptr] = { ptr, adjusted: ptr, type: type2, destructor, refcount: 0 };
          EXCEPTIONS.last = ptr;
          if (!("uncaught_exception" in __ZSt18uncaught_exceptionv)) {
            __ZSt18uncaught_exceptionv.uncaught_exception = 1;
          } else {
            __ZSt18uncaught_exceptionv.uncaught_exception++;
          }
          throw ptr + " - Exception catching is disabled, this exception cannot be caught. Compile with -s DISABLE_EXCEPTION_CATCHING=0 or DISABLE_EXCEPTION_CATCHING=2 to catch.";
        }
        Module["_memset"] = _memset;
        Module["_bitshift64Shl"] = _bitshift64Shl;
        function _abort() {
          Module["abort"]();
        }
        var FS = void 0;
        var SOCKFS = void 0;
        function _send(fd, buf, len, flags) {
          var sock = SOCKFS.getSocket(fd);
          if (!sock) {
            ___setErrNo(ERRNO_CODES.EBADF);
            return -1;
          }
          return _write(fd, buf, len);
        }
        function _pwrite(fildes, buf, nbyte, offset) {
          var stream = FS.getStream(fildes);
          if (!stream) {
            ___setErrNo(ERRNO_CODES.EBADF);
            return -1;
          }
          try {
            var slab = HEAP8;
            return FS.write(stream, slab, buf, nbyte, offset);
          } catch (e) {
            FS.handleFSError(e);
            return -1;
          }
        }
        function _write(fildes, buf, nbyte) {
          var stream = FS.getStream(fildes);
          if (!stream) {
            ___setErrNo(ERRNO_CODES.EBADF);
            return -1;
          }
          try {
            var slab = HEAP8;
            return FS.write(stream, slab, buf, nbyte);
          } catch (e) {
            FS.handleFSError(e);
            return -1;
          }
        }
        function _fileno(stream) {
          stream = FS.getStreamFromPtr(stream);
          if (!stream)
            return -1;
          return stream.fd;
        }
        function _fwrite(ptr, size2, nitems, stream) {
          var bytesToWrite = nitems * size2;
          if (bytesToWrite == 0)
            return 0;
          var fd = _fileno(stream);
          var bytesWritten = _write(fd, ptr, bytesToWrite);
          if (bytesWritten == -1) {
            var streamObj = FS.getStreamFromPtr(stream);
            if (streamObj)
              streamObj.error = true;
            return 0;
          } else {
            return bytesWritten / size2 | 0;
          }
        }
        Module["_strlen"] = _strlen;
        function __reallyNegative(x) {
          return x < 0 || x === 0 && 1 / x === -Infinity;
        }
        function __formatString(format, varargs) {
          var textIndex = format;
          var argIndex = 0;
          function getNextArg(type2) {
            var ret2;
            if (type2 === "double") {
              ret2 = (HEAP32[tempDoublePtr >> 2] = HEAP32[varargs + argIndex >> 2], HEAP32[tempDoublePtr + 4 >> 2] = HEAP32[varargs + (argIndex + 4) >> 2], +HEAPF64[tempDoublePtr >> 3]);
            } else if (type2 == "i64") {
              ret2 = [HEAP32[varargs + argIndex >> 2], HEAP32[varargs + (argIndex + 4) >> 2]];
            } else {
              type2 = "i32";
              ret2 = HEAP32[varargs + argIndex >> 2];
            }
            argIndex += Runtime.getNativeFieldSize(type2);
            return ret2;
          }
          var ret = [];
          var curr, next, currArg;
          while (1) {
            var startTextIndex = textIndex;
            curr = HEAP8[textIndex >> 0];
            if (curr === 0)
              break;
            next = HEAP8[textIndex + 1 >> 0];
            if (curr == 37) {
              var flagAlwaysSigned = false;
              var flagLeftAlign = false;
              var flagAlternative = false;
              var flagZeroPad = false;
              var flagPadSign = false;
              flagsLoop:
                while (1) {
                  switch (next) {
                    case 43:
                      flagAlwaysSigned = true;
                      break;
                    case 45:
                      flagLeftAlign = true;
                      break;
                    case 35:
                      flagAlternative = true;
                      break;
                    case 48:
                      if (flagZeroPad) {
                        break flagsLoop;
                      } else {
                        flagZeroPad = true;
                        break;
                      }
                      ;
                    case 32:
                      flagPadSign = true;
                      break;
                    default:
                      break flagsLoop;
                  }
                  textIndex++;
                  next = HEAP8[textIndex + 1 >> 0];
                }
              var width = 0;
              if (next == 42) {
                width = getNextArg("i32");
                textIndex++;
                next = HEAP8[textIndex + 1 >> 0];
              } else {
                while (next >= 48 && next <= 57) {
                  width = width * 10 + (next - 48);
                  textIndex++;
                  next = HEAP8[textIndex + 1 >> 0];
                }
              }
              var precisionSet = false, precision = -1;
              if (next == 46) {
                precision = 0;
                precisionSet = true;
                textIndex++;
                next = HEAP8[textIndex + 1 >> 0];
                if (next == 42) {
                  precision = getNextArg("i32");
                  textIndex++;
                } else {
                  while (1) {
                    var precisionChr = HEAP8[textIndex + 1 >> 0];
                    if (precisionChr < 48 || precisionChr > 57)
                      break;
                    precision = precision * 10 + (precisionChr - 48);
                    textIndex++;
                  }
                }
                next = HEAP8[textIndex + 1 >> 0];
              }
              if (precision < 0) {
                precision = 6;
                precisionSet = false;
              }
              var argSize;
              switch (String.fromCharCode(next)) {
                case "h":
                  var nextNext = HEAP8[textIndex + 2 >> 0];
                  if (nextNext == 104) {
                    textIndex++;
                    argSize = 1;
                  } else {
                    argSize = 2;
                  }
                  break;
                case "l":
                  var nextNext = HEAP8[textIndex + 2 >> 0];
                  if (nextNext == 108) {
                    textIndex++;
                    argSize = 8;
                  } else {
                    argSize = 4;
                  }
                  break;
                case "L":
                case "q":
                case "j":
                  argSize = 8;
                  break;
                case "z":
                case "t":
                case "I":
                  argSize = 4;
                  break;
                default:
                  argSize = null;
              }
              if (argSize)
                textIndex++;
              next = HEAP8[textIndex + 1 >> 0];
              switch (String.fromCharCode(next)) {
                case "d":
                case "i":
                case "u":
                case "o":
                case "x":
                case "X":
                case "p":
                  {
                    var signed = next == 100 || next == 105;
                    argSize = argSize || 4;
                    var currArg = getNextArg("i" + argSize * 8);
                    var origArg = currArg;
                    var argText;
                    if (argSize == 8) {
                      currArg = Runtime.makeBigInt(currArg[0], currArg[1], next == 117);
                    }
                    if (argSize <= 4) {
                      var limit = Math.pow(256, argSize) - 1;
                      currArg = (signed ? reSign : unSign)(currArg & limit, argSize * 8);
                    }
                    var currAbsArg = Math.abs(currArg);
                    var prefix = "";
                    if (next == 100 || next == 105) {
                      if (argSize == 8 && i64Math)
                        argText = i64Math.stringify(origArg[0], origArg[1], null);
                      else
                        argText = reSign(currArg, 8 * argSize, 1).toString(10);
                    } else if (next == 117) {
                      if (argSize == 8 && i64Math)
                        argText = i64Math.stringify(origArg[0], origArg[1], true);
                      else
                        argText = unSign(currArg, 8 * argSize, 1).toString(10);
                      currArg = Math.abs(currArg);
                    } else if (next == 111) {
                      argText = (flagAlternative ? "0" : "") + currAbsArg.toString(8);
                    } else if (next == 120 || next == 88) {
                      prefix = flagAlternative && currArg != 0 ? "0x" : "";
                      if (argSize == 8 && i64Math) {
                        if (origArg[1]) {
                          argText = (origArg[1] >>> 0).toString(16);
                          var lower = (origArg[0] >>> 0).toString(16);
                          while (lower.length < 8)
                            lower = "0" + lower;
                          argText += lower;
                        } else {
                          argText = (origArg[0] >>> 0).toString(16);
                        }
                      } else if (currArg < 0) {
                        currArg = -currArg;
                        argText = (currAbsArg - 1).toString(16);
                        var buffer2 = [];
                        for (var i2 = 0; i2 < argText.length; i2++) {
                          buffer2.push((15 - parseInt(argText[i2], 16)).toString(16));
                        }
                        argText = buffer2.join("");
                        while (argText.length < argSize * 2)
                          argText = "f" + argText;
                      } else {
                        argText = currAbsArg.toString(16);
                      }
                      if (next == 88) {
                        prefix = prefix.toUpperCase();
                        argText = argText.toUpperCase();
                      }
                    } else if (next == 112) {
                      if (currAbsArg === 0) {
                        argText = "(nil)";
                      } else {
                        prefix = "0x";
                        argText = currAbsArg.toString(16);
                      }
                    }
                    if (precisionSet) {
                      while (argText.length < precision) {
                        argText = "0" + argText;
                      }
                    }
                    if (currArg >= 0) {
                      if (flagAlwaysSigned) {
                        prefix = "+" + prefix;
                      } else if (flagPadSign) {
                        prefix = " " + prefix;
                      }
                    }
                    if (argText.charAt(0) == "-") {
                      prefix = "-" + prefix;
                      argText = argText.substr(1);
                    }
                    while (prefix.length + argText.length < width) {
                      if (flagLeftAlign) {
                        argText += " ";
                      } else {
                        if (flagZeroPad) {
                          argText = "0" + argText;
                        } else {
                          prefix = " " + prefix;
                        }
                      }
                    }
                    argText = prefix + argText;
                    argText.split("").forEach(function(chr) {
                      ret.push(chr.charCodeAt(0));
                    });
                    break;
                  }
                  ;
                case "f":
                case "F":
                case "e":
                case "E":
                case "g":
                case "G":
                  {
                    var currArg = getNextArg("double");
                    var argText;
                    if (isNaN(currArg)) {
                      argText = "nan";
                      flagZeroPad = false;
                    } else if (!isFinite(currArg)) {
                      argText = (currArg < 0 ? "-" : "") + "inf";
                      flagZeroPad = false;
                    } else {
                      var isGeneral = false;
                      var effectivePrecision = Math.min(precision, 20);
                      if (next == 103 || next == 71) {
                        isGeneral = true;
                        precision = precision || 1;
                        var exponent = parseInt(currArg.toExponential(effectivePrecision).split("e")[1], 10);
                        if (precision > exponent && exponent >= -4) {
                          next = (next == 103 ? "f" : "F").charCodeAt(0);
                          precision -= exponent + 1;
                        } else {
                          next = (next == 103 ? "e" : "E").charCodeAt(0);
                          precision--;
                        }
                        effectivePrecision = Math.min(precision, 20);
                      }
                      if (next == 101 || next == 69) {
                        argText = currArg.toExponential(effectivePrecision);
                        if (/[eE][-+]\d$/.test(argText)) {
                          argText = argText.slice(0, -1) + "0" + argText.slice(-1);
                        }
                      } else if (next == 102 || next == 70) {
                        argText = currArg.toFixed(effectivePrecision);
                        if (currArg === 0 && __reallyNegative(currArg)) {
                          argText = "-" + argText;
                        }
                      }
                      var parts = argText.split("e");
                      if (isGeneral && !flagAlternative) {
                        while (parts[0].length > 1 && parts[0].indexOf(".") != -1 && (parts[0].slice(-1) == "0" || parts[0].slice(-1) == ".")) {
                          parts[0] = parts[0].slice(0, -1);
                        }
                      } else {
                        if (flagAlternative && argText.indexOf(".") == -1)
                          parts[0] += ".";
                        while (precision > effectivePrecision++)
                          parts[0] += "0";
                      }
                      argText = parts[0] + (parts.length > 1 ? "e" + parts[1] : "");
                      if (next == 69)
                        argText = argText.toUpperCase();
                      if (currArg >= 0) {
                        if (flagAlwaysSigned) {
                          argText = "+" + argText;
                        } else if (flagPadSign) {
                          argText = " " + argText;
                        }
                      }
                    }
                    while (argText.length < width) {
                      if (flagLeftAlign) {
                        argText += " ";
                      } else {
                        if (flagZeroPad && (argText[0] == "-" || argText[0] == "+")) {
                          argText = argText[0] + "0" + argText.slice(1);
                        } else {
                          argText = (flagZeroPad ? "0" : " ") + argText;
                        }
                      }
                    }
                    if (next < 97)
                      argText = argText.toUpperCase();
                    argText.split("").forEach(function(chr) {
                      ret.push(chr.charCodeAt(0));
                    });
                    break;
                  }
                  ;
                case "s":
                  {
                    var arg2 = getNextArg("i8*");
                    var argLength = arg2 ? _strlen(arg2) : "(null)".length;
                    if (precisionSet)
                      argLength = Math.min(argLength, precision);
                    if (!flagLeftAlign) {
                      while (argLength < width--) {
                        ret.push(32);
                      }
                    }
                    if (arg2) {
                      for (var i2 = 0; i2 < argLength; i2++) {
                        ret.push(HEAPU8[arg2++ >> 0]);
                      }
                    } else {
                      ret = ret.concat(intArrayFromString("(null)".substr(0, argLength), true));
                    }
                    if (flagLeftAlign) {
                      while (argLength < width--) {
                        ret.push(32);
                      }
                    }
                    break;
                  }
                  ;
                case "c":
                  {
                    if (flagLeftAlign)
                      ret.push(getNextArg("i8"));
                    while (--width > 0) {
                      ret.push(32);
                    }
                    if (!flagLeftAlign)
                      ret.push(getNextArg("i8"));
                    break;
                  }
                  ;
                case "n":
                  {
                    var ptr = getNextArg("i32*");
                    HEAP32[ptr >> 2] = ret.length;
                    break;
                  }
                  ;
                case "%":
                  {
                    ret.push(curr);
                    break;
                  }
                  ;
                default: {
                  for (var i2 = startTextIndex; i2 < textIndex + 2; i2++) {
                    ret.push(HEAP8[i2 >> 0]);
                  }
                }
              }
              textIndex += 2;
            } else {
              ret.push(curr);
              textIndex += 1;
            }
          }
          return ret;
        }
        function _fprintf(stream, format, varargs) {
          var result2 = __formatString(format, varargs);
          var stack = Runtime.stackSave();
          var ret = _fwrite(allocate(result2, "i8", ALLOC_STACK), 1, result2.length, stream);
          Runtime.stackRestore(stack);
          return ret;
        }
        function _printf(format, varargs) {
          var result2 = __formatString(format, varargs);
          var string = intArrayToString(result2);
          if (string[string.length - 1] === "\n")
            string = string.substr(0, string.length - 1);
          Module.print(string);
          return result2.length;
        }
        function _pthread_once(ptr, func2) {
          if (!_pthread_once.seen)
            _pthread_once.seen = {};
          if (ptr in _pthread_once.seen)
            return;
          Runtime.dynCall("v", func2);
          _pthread_once.seen[ptr] = 1;
        }
        function _fputc(c, stream) {
          var chr = unSign(c & 255);
          HEAP8[_fputc.ret >> 0] = chr;
          var fd = _fileno(stream);
          var ret = _write(fd, _fputc.ret, 1);
          if (ret == -1) {
            var streamObj = FS.getStreamFromPtr(stream);
            if (streamObj)
              streamObj.error = true;
            return -1;
          } else {
            return chr;
          }
        }
        var PTHREAD_SPECIFIC = {};
        function _pthread_getspecific(key2) {
          return PTHREAD_SPECIFIC[key2] || 0;
        }
        Module["_i64Add"] = _i64Add;
        function _fputs(s, stream) {
          var fd = _fileno(stream);
          return _write(fd, s, _strlen(s));
        }
        var _stdout = allocate(1, "i32*", ALLOC_STATIC);
        function _puts(s) {
          var result2 = Pointer_stringify(s);
          var string = result2.substr(0);
          if (string[string.length - 1] === "\n")
            string = string.substr(0, string.length - 1);
          Module.print(string);
          return result2.length;
        }
        function _pthread_setspecific(key2, value) {
          if (!(key2 in PTHREAD_SPECIFIC)) {
            return ERRNO_CODES.EINVAL;
          }
          PTHREAD_SPECIFIC[key2] = value;
          return 0;
        }
        function __exit(status) {
          Module["exit"](status);
        }
        function _exit(status) {
          __exit(status);
        }
        var _UItoD = true;
        function _malloc(bytes) {
          var ptr = Runtime.dynamicAlloc(bytes + 8);
          return ptr + 8 & 4294967288;
        }
        Module["_malloc"] = _malloc;
        function ___cxa_allocate_exception(size2) {
          return _malloc(size2);
        }
        function _fmod(x, y) {
          return x % y;
        }
        function _fmodl() {
          return _fmod.apply(null, arguments);
        }
        Module["_bitshift64Lshr"] = _bitshift64Lshr;
        function ___cxa_pure_virtual() {
          ABORT = true;
          throw "Pure virtual function called!";
        }
        function _time(ptr) {
          var ret = Date.now() / 1e3 | 0;
          if (ptr) {
            HEAP32[ptr >> 2] = ret;
          }
          return ret;
        }
        var PTHREAD_SPECIFIC_NEXT_KEY = 1;
        function _pthread_key_create(key2, destructor) {
          if (key2 == 0) {
            return ERRNO_CODES.EINVAL;
          }
          HEAP32[key2 >> 2] = PTHREAD_SPECIFIC_NEXT_KEY;
          PTHREAD_SPECIFIC[PTHREAD_SPECIFIC_NEXT_KEY] = 0;
          PTHREAD_SPECIFIC_NEXT_KEY++;
          return 0;
        }
        function ___cxa_guard_acquire(variable) {
          if (!HEAP8[variable >> 0]) {
            HEAP8[variable >> 0] = 1;
            return 1;
          }
          return 0;
        }
        function ___cxa_guard_release() {
        }
        function _vfprintf(s, f, va_arg) {
          return _fprintf(s, f, HEAP32[va_arg >> 2]);
        }
        function ___cxa_begin_catch(ptr) {
          __ZSt18uncaught_exceptionv.uncaught_exception--;
          EXCEPTIONS.caught.push(ptr);
          EXCEPTIONS.addRef(EXCEPTIONS.deAdjust(ptr));
          return ptr;
        }
        function _emscripten_memcpy_big(dest, src, num) {
          HEAPU8.set(HEAPU8.subarray(src, src + num), dest);
          return dest;
        }
        Module["_memcpy"] = _memcpy;
        var _llvm_pow_f64 = Math_pow;
        function _sbrk(bytes) {
          var self2 = _sbrk;
          if (!self2.called) {
            DYNAMICTOP = alignMemoryPage(DYNAMICTOP);
            self2.called = true;
            assert(Runtime.dynamicAlloc);
            self2.alloc = Runtime.dynamicAlloc;
            Runtime.dynamicAlloc = function() {
              abort("cannot dynamically allocate, sbrk now has control");
            };
          }
          var ret = DYNAMICTOP;
          if (bytes != 0)
            self2.alloc(bytes);
          return ret;
        }
        var _fabs = Math_abs;
        function ___errno_location() {
          return ___errno_state;
        }
        var _BItoD = true;
        function _copysign(a, b) {
          return __reallyNegative(a) === __reallyNegative(b) ? a : -a;
        }
        function _copysignl() {
          return _copysign.apply(null, arguments);
        }
        var ___dso_handle = allocate(1, "i32*", ALLOC_STATIC);
        var _stderr = allocate(1, "i32*", ALLOC_STATIC);
        ___errno_state = Runtime.staticAlloc(4);
        HEAP32[___errno_state >> 2] = 0;
        _fputc.ret = allocate([0], "i8", ALLOC_STATIC);
        STACK_BASE = STACKTOP = Runtime.alignMemory(STATICTOP);
        staticSealed = true;
        STACK_MAX = STACK_BASE + TOTAL_STACK;
        DYNAMIC_BASE = DYNAMICTOP = Runtime.alignMemory(STACK_MAX);
        assert(DYNAMIC_BASE < TOTAL_MEMORY, "TOTAL_MEMORY not big enough for stack");
        var ctlz_i8 = allocate([8, 7, 6, 6, 5, 5, 5, 5, 4, 4, 4, 4, 4, 4, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "i8", ALLOC_DYNAMIC);
        var cttz_i8 = allocate([8, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 5, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 6, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 5, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 7, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 5, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 6, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 5, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0], "i8", ALLOC_DYNAMIC);
        function invoke_iiii(index, a1, a2, a3) {
          try {
            return Module["dynCall_iiii"](index, a1, a2, a3);
          } catch (e) {
            if (typeof e !== "number" && e !== "longjmp")
              throw e;
            asm["setThrew"](1, 0);
          }
        }
        function invoke_viiiii(index, a1, a2, a3, a4, a5) {
          try {
            Module["dynCall_viiiii"](index, a1, a2, a3, a4, a5);
          } catch (e) {
            if (typeof e !== "number" && e !== "longjmp")
              throw e;
            asm["setThrew"](1, 0);
          }
        }
        function invoke_vi(index, a1) {
          try {
            Module["dynCall_vi"](index, a1);
          } catch (e) {
            if (typeof e !== "number" && e !== "longjmp")
              throw e;
            asm["setThrew"](1, 0);
          }
        }
        function invoke_vii(index, a1, a2) {
          try {
            Module["dynCall_vii"](index, a1, a2);
          } catch (e) {
            if (typeof e !== "number" && e !== "longjmp")
              throw e;
            asm["setThrew"](1, 0);
          }
        }
        function invoke_ii(index, a1) {
          try {
            return Module["dynCall_ii"](index, a1);
          } catch (e) {
            if (typeof e !== "number" && e !== "longjmp")
              throw e;
            asm["setThrew"](1, 0);
          }
        }
        function invoke_v(index) {
          try {
            Module["dynCall_v"](index);
          } catch (e) {
            if (typeof e !== "number" && e !== "longjmp")
              throw e;
            asm["setThrew"](1, 0);
          }
        }
        function invoke_viiiiii(index, a1, a2, a3, a4, a5, a6) {
          try {
            Module["dynCall_viiiiii"](index, a1, a2, a3, a4, a5, a6);
          } catch (e) {
            if (typeof e !== "number" && e !== "longjmp")
              throw e;
            asm["setThrew"](1, 0);
          }
        }
        function invoke_iii(index, a1, a2) {
          try {
            return Module["dynCall_iii"](index, a1, a2);
          } catch (e) {
            if (typeof e !== "number" && e !== "longjmp")
              throw e;
            asm["setThrew"](1, 0);
          }
        }
        function invoke_viiii(index, a1, a2, a3, a4) {
          try {
            Module["dynCall_viiii"](index, a1, a2, a3, a4);
          } catch (e) {
            if (typeof e !== "number" && e !== "longjmp")
              throw e;
            asm["setThrew"](1, 0);
          }
        }
        Module.asmGlobalArg = { "Math": Math, "Int8Array": Int8Array, "Int16Array": Int16Array, "Int32Array": Int32Array, "Uint8Array": Uint8Array, "Uint16Array": Uint16Array, "Uint32Array": Uint32Array, "Float32Array": Float32Array, "Float64Array": Float64Array };
        Module.asmLibraryArg = { "abort": abort, "assert": assert, "min": Math_min, "invoke_iiii": invoke_iiii, "invoke_viiiii": invoke_viiiii, "invoke_vi": invoke_vi, "invoke_vii": invoke_vii, "invoke_ii": invoke_ii, "invoke_v": invoke_v, "invoke_viiiiii": invoke_viiiiii, "invoke_iii": invoke_iii, "invoke_viiii": invoke_viiii, "_fabs": _fabs, "_llvm_pow_f64": _llvm_pow_f64, "_send": _send, "_fmod": _fmod, "___cxa_guard_acquire": ___cxa_guard_acquire, "___setErrNo": ___setErrNo, "_vfprintf": _vfprintf, "___cxa_allocate_exception": ___cxa_allocate_exception, "___cxa_find_matching_catch": ___cxa_find_matching_catch, "___cxa_guard_release": ___cxa_guard_release, "_pwrite": _pwrite, "__reallyNegative": __reallyNegative, "_sbrk": _sbrk, "___cxa_begin_catch": ___cxa_begin_catch, "_emscripten_memcpy_big": _emscripten_memcpy_big, "_fileno": _fileno, "___resumeException": ___resumeException, "__ZSt18uncaught_exceptionv": __ZSt18uncaught_exceptionv, "_sysconf": _sysconf, "_pthread_getspecific": _pthread_getspecific, "_atexit": _atexit, "_pthread_once": _pthread_once, "_puts": _puts, "_printf": _printf, "_pthread_key_create": _pthread_key_create, "_write": _write, "___errno_location": ___errno_location, "_pthread_setspecific": _pthread_setspecific, "___cxa_atexit": ___cxa_atexit, "_copysign": _copysign, "_fputc": _fputc, "___cxa_throw": ___cxa_throw, "__exit": __exit, "_copysignl": _copysignl, "_abort": _abort, "_fwrite": _fwrite, "_time": _time, "_fprintf": _fprintf, "__formatString": __formatString, "_fputs": _fputs, "_exit": _exit, "___cxa_pure_virtual": ___cxa_pure_virtual, "_fmodl": _fmodl, "STACKTOP": STACKTOP, "STACK_MAX": STACK_MAX, "tempDoublePtr": tempDoublePtr, "ABORT": ABORT, "cttz_i8": cttz_i8, "ctlz_i8": ctlz_i8, "NaN": NaN, "Infinity": Infinity, "___dso_handle": ___dso_handle, "_stderr": _stderr };
        var asm = function(global2, env, buffer2) {
          ;
          var a = new global2.Int8Array(buffer2);
          var b = new global2.Int16Array(buffer2);
          var c = new global2.Int32Array(buffer2);
          var d = new global2.Uint8Array(buffer2);
          var e = new global2.Uint16Array(buffer2);
          var f = new global2.Uint32Array(buffer2);
          var g = new global2.Float32Array(buffer2);
          var h = new global2.Float64Array(buffer2);
          var i2 = env.STACKTOP | 0;
          var j = env.STACK_MAX | 0;
          var k = env.tempDoublePtr | 0;
          var l = env.ABORT | 0;
          var m = env.cttz_i8 | 0;
          var n = env.ctlz_i8 | 0;
          var o = env.___dso_handle | 0;
          var p = env._stderr | 0;
          var q = 0;
          var r = 0;
          var s = 0;
          var t = 0;
          var u = +env.NaN, v = +env.Infinity;
          var w = 0, x = 0, y = 0, z = 0, A = 0, B = 0, C = 0, D = 0, E = 0;
          var F = 0;
          var G = 0;
          var H = 0;
          var I = 0;
          var J = 0;
          var K = 0;
          var L = 0;
          var M = 0;
          var N = 0;
          var O = 0;
          var P = global2.Math.floor;
          var Q = global2.Math.abs;
          var R = global2.Math.sqrt;
          var S = global2.Math.pow;
          var T = global2.Math.cos;
          var U = global2.Math.sin;
          var V = global2.Math.tan;
          var W = global2.Math.acos;
          var X = global2.Math.asin;
          var Y = global2.Math.atan;
          var Z = global2.Math.atan2;
          var _3 = global2.Math.exp;
          var $ = global2.Math.log;
          var aa = global2.Math.ceil;
          var ba = global2.Math.imul;
          var ca = env.abort;
          var da = env.assert;
          var ea = env.min;
          var fa = env.invoke_iiii;
          var ga = env.invoke_viiiii;
          var ha = env.invoke_vi;
          var ia = env.invoke_vii;
          var ja = env.invoke_ii;
          var ka = env.invoke_v;
          var la = env.invoke_viiiiii;
          var ma = env.invoke_iii;
          var na = env.invoke_viiii;
          var oa = env._fabs;
          var pa = env._llvm_pow_f64;
          var qa = env._send;
          var ra = env._fmod;
          var sa = env.___cxa_guard_acquire;
          var ta = env.___setErrNo;
          var ua = env._vfprintf;
          var va = env.___cxa_allocate_exception;
          var wa = env.___cxa_find_matching_catch;
          var xa = env.___cxa_guard_release;
          var ya = env._pwrite;
          var za = env.__reallyNegative;
          var Aa = env._sbrk;
          var Ba = env.___cxa_begin_catch;
          var Ca = env._emscripten_memcpy_big;
          var Da = env._fileno;
          var Ea = env.___resumeException;
          var Fa = env.__ZSt18uncaught_exceptionv;
          var Ga = env._sysconf;
          var Ha = env._pthread_getspecific;
          var Ia = env._atexit;
          var Ja = env._pthread_once;
          var Ka = env._puts;
          var La = env._printf;
          var Ma = env._pthread_key_create;
          var Na = env._write;
          var Oa = env.___errno_location;
          var Pa = env._pthread_setspecific;
          var Qa = env.___cxa_atexit;
          var Ra = env._copysign;
          var Sa = env._fputc;
          var Ta = env.___cxa_throw;
          var Ua = env.__exit;
          var Va = env._copysignl;
          var Wa = env._abort;
          var Xa = env._fwrite;
          var Ya = env._time;
          var Za = env._fprintf;
          var _a = env.__formatString;
          var $a = env._fputs;
          var ab = env._exit;
          var bb = env.___cxa_pure_virtual;
          var cb2 = env._fmodl;
          var db = 0;
          function nb(a2) {
            a2 = a2 | 0;
            var b2 = 0;
            b2 = i2;
            i2 = i2 + a2 | 0;
            i2 = i2 + 15 & -16;
            return b2 | 0;
          }
          function ob() {
            return i2 | 0;
          }
          function pb(a2) {
            a2 = a2 | 0;
            i2 = a2;
          }
          function qb(a2, b2) {
            a2 = a2 | 0;
            b2 = b2 | 0;
            if (!q) {
              q = a2;
              r = b2;
            }
          }
          function rb(b2) {
            b2 = b2 | 0;
            a[k >> 0] = a[b2 >> 0];
            a[k + 1 >> 0] = a[b2 + 1 >> 0];
            a[k + 2 >> 0] = a[b2 + 2 >> 0];
            a[k + 3 >> 0] = a[b2 + 3 >> 0];
          }
          function sb(b2) {
            b2 = b2 | 0;
            a[k >> 0] = a[b2 >> 0];
            a[k + 1 >> 0] = a[b2 + 1 >> 0];
            a[k + 2 >> 0] = a[b2 + 2 >> 0];
            a[k + 3 >> 0] = a[b2 + 3 >> 0];
            a[k + 4 >> 0] = a[b2 + 4 >> 0];
            a[k + 5 >> 0] = a[b2 + 5 >> 0];
            a[k + 6 >> 0] = a[b2 + 6 >> 0];
            a[k + 7 >> 0] = a[b2 + 7 >> 0];
          }
          function tb(a2) {
            a2 = a2 | 0;
            F = a2;
          }
          function ub() {
            return F | 0;
          }
          function vb(a2) {
            a2 = a2 | 0;
            Ba(a2 | 0) | 0;
            ud();
          }
          function wb(a2) {
            a2 = a2 | 0;
            return;
          }
          function xb(b2, d2, e2, f2, g2) {
            b2 = b2 | 0;
            d2 = d2 | 0;
            e2 = e2 | 0;
            f2 = f2 | 0;
            g2 = g2 | 0;
            var h2 = 0;
            h2 = i2;
            c[b2 >> 2] = 112;
            c[b2 + 4 >> 2] = d2;
            c[b2 + 8 >> 2] = e2;
            c[b2 + 12 >> 2] = f2;
            c[b2 + 16 >> 2] = g2;
            if ((a[144] | 0) == 0 ? (sa(144) | 0) != 0 : 0) {
              c[32] = 0;
              c[33] = 0;
              c[34] = 0;
              Qa(19, 128, o | 0) | 0;
              xa(144);
            }
            g2 = c[33] | 0;
            if ((g2 | 0) == (c[34] | 0)) {
              f2 = (g2 >> 1) + 2 & -2;
              f2 = (f2 | 0) < 2 ? 2 : f2;
              if ((f2 | 0) > (2147483647 - g2 | 0)) {
                d2 = va(1) | 0;
                Ta(d2 | 0, 48, 0);
              }
              e2 = c[32] | 0;
              d2 = f2 + g2 | 0;
              c[34] = d2;
              d2 = Ud(e2, d2 << 2) | 0;
              c[32] = d2;
              if ((d2 | 0) == 0 ? (c[(Oa() | 0) >> 2] | 0) == 12 : 0) {
                d2 = va(1) | 0;
                Ta(d2 | 0, 48, 0);
              }
              g2 = c[33] | 0;
            }
            c[33] = g2 + 1;
            g2 = (c[32] | 0) + (g2 << 2) | 0;
            if (!g2) {
              i2 = h2;
              return;
            }
            c[g2 >> 2] = b2;
            i2 = h2;
            return;
          }
          function yb(a2) {
            a2 = a2 | 0;
            var b2 = 0;
            b2 = i2;
            pd(a2);
            i2 = b2;
            return;
          }
          function zb(a2) {
            a2 = a2 | 0;
            var b2 = 0, d2 = 0;
            b2 = i2;
            d2 = c[a2 >> 2] | 0;
            if (!d2) {
              i2 = b2;
              return;
            }
            c[a2 + 4 >> 2] = 0;
            Td(d2);
            c[a2 >> 2] = 0;
            c[a2 + 8 >> 2] = 0;
            i2 = b2;
            return;
          }
          function Ab(a2) {
            a2 = a2 | 0;
            var b2 = 0;
            b2 = i2;
            pd(a2);
            i2 = b2;
            return;
          }
          function Bb(b2, d2) {
            b2 = b2 | 0;
            d2 = d2 | 0;
            var e2 = 0, f2 = 0, g2 = 0, h2 = 0, j2 = 0, k2 = 0;
            e2 = i2;
            if ((a[d2 >> 0] | 0) != 45) {
              k2 = 0;
              i2 = e2;
              return k2 | 0;
            }
            f2 = d2 + 1 | 0;
            g2 = 110;
            j2 = f2;
            k2 = 0;
            while (1) {
              h2 = k2 + 1 | 0;
              if ((a[j2 >> 0] | 0) != g2 << 24 >> 24) {
                g2 = 1;
                break;
              }
              j2 = d2 + (k2 + 2) | 0;
              if ((h2 | 0) == 3) {
                g2 = 0;
                f2 = j2;
                break;
              } else {
                g2 = a[264 + h2 >> 0] | 0;
                k2 = h2;
              }
            }
            if (ee(f2, c[b2 + 4 >> 2] | 0) | 0) {
              k2 = 0;
              i2 = e2;
              return k2 | 0;
            }
            a[b2 + 20 >> 0] = g2;
            k2 = 1;
            i2 = e2;
            return k2 | 0;
          }
          function Cb(b2, d2) {
            b2 = b2 | 0;
            d2 = d2 | 0;
            var e2 = 0, f2 = 0, g2 = 0, h2 = 0, j2 = 0, k2 = 0;
            h2 = i2;
            i2 = i2 + 16 | 0;
            e2 = h2;
            f2 = c[p >> 2] | 0;
            g2 = b2 + 4 | 0;
            j2 = c[g2 >> 2] | 0;
            c[e2 >> 2] = j2;
            c[e2 + 4 >> 2] = j2;
            Za(f2 | 0, 216, e2 | 0) | 0;
            j2 = 0;
            while (1) {
              k2 = j2 >>> 0 < (32 - ((me(c[g2 >> 2] | 0) | 0) << 1) | 0) >>> 0;
              Sa(32, f2 | 0) | 0;
              if (k2)
                j2 = j2 + 1 | 0;
              else
                break;
            }
            c[e2 >> 2] = (a[b2 + 20 >> 0] | 0) != 0 ? 248 : 256;
            Za(f2 | 0, 232, e2 | 0) | 0;
            if (!d2) {
              i2 = h2;
              return;
            }
            c[e2 >> 2] = c[b2 + 8 >> 2];
            Za(f2 | 0, 88, e2 | 0) | 0;
            Sa(10, f2 | 0) | 0;
            i2 = h2;
            return;
          }
          function Db(a2) {
            a2 = a2 | 0;
            var b2 = 0;
            b2 = i2;
            pd(a2);
            i2 = b2;
            return;
          }
          function Eb(b2, d2) {
            b2 = b2 | 0;
            d2 = d2 | 0;
            var e2 = 0, f2 = 0, g2 = 0, h2 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, n2 = 0;
            e2 = i2;
            i2 = i2 + 16 | 0;
            h2 = e2;
            g2 = e2 + 8 | 0;
            if ((a[d2 >> 0] | 0) != 45) {
              n2 = 0;
              i2 = e2;
              return n2 | 0;
            }
            l2 = d2 + 1 | 0;
            f2 = b2 + 4 | 0;
            j2 = c[f2 >> 2] | 0;
            k2 = a[j2 >> 0] | 0;
            a:
              do
                if (k2 << 24 >> 24) {
                  m2 = 0;
                  while (1) {
                    n2 = m2;
                    m2 = m2 + 1 | 0;
                    if ((a[l2 >> 0] | 0) != k2 << 24 >> 24) {
                      b2 = 0;
                      break;
                    }
                    k2 = a[j2 + m2 >> 0] | 0;
                    l2 = d2 + (n2 + 2) | 0;
                    if (!(k2 << 24 >> 24))
                      break a;
                  }
                  i2 = e2;
                  return b2 | 0;
                }
              while (0);
            if ((a[l2 >> 0] | 0) != 61) {
              n2 = 0;
              i2 = e2;
              return n2 | 0;
            }
            d2 = l2 + 1 | 0;
            j2 = de(d2, g2, 10) | 0;
            if (!(c[g2 >> 2] | 0)) {
              n2 = 0;
              i2 = e2;
              return n2 | 0;
            }
            if ((j2 | 0) > (c[b2 + 24 >> 2] | 0)) {
              n2 = c[p >> 2] | 0;
              m2 = c[f2 >> 2] | 0;
              c[h2 >> 2] = d2;
              c[h2 + 4 >> 2] = m2;
              Za(n2 | 0, 416, h2 | 0) | 0;
              ab(1);
            }
            if ((j2 | 0) < (c[b2 + 20 >> 2] | 0)) {
              n2 = c[p >> 2] | 0;
              m2 = c[f2 >> 2] | 0;
              c[h2 >> 2] = d2;
              c[h2 + 4 >> 2] = m2;
              Za(n2 | 0, 472, h2 | 0) | 0;
              ab(1);
            }
            c[b2 + 28 >> 2] = j2;
            n2 = 1;
            i2 = e2;
            return n2 | 0;
          }
          function Fb(a2, b2) {
            a2 = a2 | 0;
            b2 = b2 | 0;
            var d2 = 0, e2 = 0, f2 = 0, g2 = 0;
            d2 = i2;
            i2 = i2 + 16 | 0;
            e2 = d2;
            f2 = c[p >> 2] | 0;
            g2 = c[a2 + 16 >> 2] | 0;
            c[e2 >> 2] = c[a2 + 4 >> 2];
            c[e2 + 4 >> 2] = g2;
            Za(f2 | 0, 336, e2 | 0) | 0;
            g2 = c[a2 + 20 >> 2] | 0;
            if ((g2 | 0) == -2147483648)
              Xa(360, 4, 1, f2 | 0) | 0;
            else {
              c[e2 >> 2] = g2;
              Za(f2 | 0, 368, e2 | 0) | 0;
            }
            Xa(376, 4, 1, f2 | 0) | 0;
            g2 = c[a2 + 24 >> 2] | 0;
            if ((g2 | 0) == 2147483647)
              Xa(384, 4, 1, f2 | 0) | 0;
            else {
              c[e2 >> 2] = g2;
              Za(f2 | 0, 368, e2 | 0) | 0;
            }
            c[e2 >> 2] = c[a2 + 28 >> 2];
            Za(f2 | 0, 392, e2 | 0) | 0;
            if (!b2) {
              i2 = d2;
              return;
            }
            c[e2 >> 2] = c[a2 + 8 >> 2];
            Za(f2 | 0, 88, e2 | 0) | 0;
            Sa(10, f2 | 0) | 0;
            i2 = d2;
            return;
          }
          function Gb(b2) {
            b2 = b2 | 0;
            var d2 = 0, e2 = 0, f2 = 0, g2 = 0, j2 = 0;
            g2 = i2;
            c[b2 >> 2] = 1816;
            f2 = b2 + 4 | 0;
            e2 = b2 + 32 | 0;
            j2 = b2 + 48 | 0;
            c[f2 + 0 >> 2] = 0;
            c[f2 + 4 >> 2] = 0;
            c[f2 + 8 >> 2] = 0;
            c[f2 + 12 >> 2] = 0;
            c[f2 + 16 >> 2] = 0;
            c[f2 + 20 >> 2] = 0;
            c[e2 + 0 >> 2] = 0;
            c[e2 + 4 >> 2] = 0;
            c[e2 + 8 >> 2] = 0;
            c[e2 + 12 >> 2] = 0;
            h[j2 >> 3] = +h[75];
            h[b2 + 56 >> 3] = +h[89];
            h[b2 + 64 >> 3] = +h[103];
            h[b2 + 72 >> 3] = +h[123];
            a[b2 + 80 >> 0] = a[1364] | 0;
            c[b2 + 84 >> 2] = c[269];
            c[b2 + 88 >> 2] = c[297];
            a[b2 + 92 >> 0] = 0;
            a[b2 + 93 >> 0] = a[1292] | 0;
            h[b2 + 96 >> 3] = +h[204];
            c[b2 + 104 >> 2] = c[439];
            c[b2 + 108 >> 2] = c[359];
            h[b2 + 112 >> 3] = +h[191];
            h[b2 + 120 >> 3] = 0.3333333333333333;
            h[b2 + 128 >> 3] = 1.1;
            c[b2 + 136 >> 2] = 100;
            h[b2 + 144 >> 3] = 1.5;
            j2 = b2 + 316 | 0;
            c[b2 + 332 >> 2] = 0;
            c[b2 + 336 >> 2] = 0;
            c[b2 + 340 >> 2] = 0;
            c[b2 + 348 >> 2] = 0;
            c[b2 + 352 >> 2] = 0;
            c[b2 + 356 >> 2] = 0;
            c[b2 + 364 >> 2] = 0;
            c[b2 + 368 >> 2] = 0;
            c[b2 + 372 >> 2] = 0;
            c[b2 + 380 >> 2] = 0;
            c[b2 + 384 >> 2] = 0;
            c[b2 + 388 >> 2] = 0;
            c[b2 + 396 >> 2] = 0;
            c[b2 + 400 >> 2] = 0;
            c[b2 + 404 >> 2] = 0;
            e2 = b2 + 544 | 0;
            c[b2 + 412 >> 2] = 0;
            c[b2 + 416 >> 2] = 0;
            c[b2 + 420 >> 2] = 0;
            c[b2 + 428 >> 2] = 0;
            c[b2 + 432 >> 2] = 0;
            c[b2 + 436 >> 2] = 0;
            c[b2 + 444 >> 2] = 0;
            c[b2 + 448 >> 2] = 0;
            c[b2 + 452 >> 2] = 0;
            ke(b2 + 152 | 0, 0, 176) | 0;
            c[b2 + 456 >> 2] = e2;
            f2 = b2 + 460 | 0;
            c[f2 + 0 >> 2] = 0;
            c[f2 + 4 >> 2] = 0;
            c[f2 + 8 >> 2] = 0;
            c[f2 + 12 >> 2] = 0;
            c[f2 + 16 >> 2] = 0;
            c[f2 + 20 >> 2] = 0;
            c[b2 + 488 >> 2] = j2;
            a[b2 + 492 >> 0] = 1;
            h[b2 + 496 >> 3] = 1;
            h[b2 + 504 >> 3] = 1;
            c[b2 + 512 >> 2] = 0;
            c[b2 + 516 >> 2] = -1;
            j2 = b2 + 520 | 0;
            f2 = b2 + 536 | 0;
            c[j2 + 0 >> 2] = 0;
            c[j2 + 4 >> 2] = 0;
            c[j2 + 8 >> 2] = 0;
            c[j2 + 12 >> 2] = 0;
            a[f2 >> 0] = 1;
            f2 = b2 + 540 | 0;
            c[f2 + 0 >> 2] = 0;
            c[f2 + 4 >> 2] = 0;
            c[f2 + 8 >> 2] = 0;
            c[f2 + 12 >> 2] = 0;
            c[f2 + 16 >> 2] = 0;
            gc(e2, 1048576);
            a[b2 + 560 >> 0] = 0;
            e2 = b2 + 604 | 0;
            f2 = b2 + 664 | 0;
            j2 = b2 + 564 | 0;
            d2 = j2 + 36 | 0;
            do {
              c[j2 >> 2] = 0;
              j2 = j2 + 4 | 0;
            } while ((j2 | 0) < (d2 | 0));
            j2 = e2 + 0 | 0;
            d2 = j2 + 36 | 0;
            do {
              c[j2 >> 2] = 0;
              j2 = j2 + 4 | 0;
            } while ((j2 | 0) < (d2 | 0));
            j2 = b2 + 680 | 0;
            c[f2 + 0 >> 2] = -1;
            c[f2 + 4 >> 2] = -1;
            c[f2 + 8 >> 2] = -1;
            c[f2 + 12 >> 2] = -1;
            a[j2 >> 0] = 0;
            i2 = g2;
            return;
          }
          function Hb(a2) {
            a2 = a2 | 0;
            var b2 = 0;
            b2 = i2;
            Ib(a2);
            pd(a2);
            i2 = b2;
            return;
          }
          function Ib(a2) {
            a2 = a2 | 0;
            var b2 = 0, d2 = 0, e2 = 0;
            b2 = i2;
            c[a2 >> 2] = 1816;
            d2 = a2 + 628 | 0;
            e2 = c[d2 >> 2] | 0;
            if (e2) {
              c[a2 + 632 >> 2] = 0;
              Td(e2);
              c[d2 >> 2] = 0;
              c[a2 + 636 >> 2] = 0;
            }
            d2 = a2 + 616 | 0;
            e2 = c[d2 >> 2] | 0;
            if (e2) {
              c[a2 + 620 >> 2] = 0;
              Td(e2);
              c[d2 >> 2] = 0;
              c[a2 + 624 >> 2] = 0;
            }
            d2 = a2 + 604 | 0;
            e2 = c[d2 >> 2] | 0;
            if (e2) {
              c[a2 + 608 >> 2] = 0;
              Td(e2);
              c[d2 >> 2] = 0;
              c[a2 + 612 >> 2] = 0;
            }
            d2 = a2 + 588 | 0;
            e2 = c[d2 >> 2] | 0;
            if (e2) {
              c[a2 + 592 >> 2] = 0;
              Td(e2);
              c[d2 >> 2] = 0;
              c[a2 + 596 >> 2] = 0;
            }
            d2 = a2 + 576 | 0;
            e2 = c[d2 >> 2] | 0;
            if (e2) {
              c[a2 + 580 >> 2] = 0;
              Td(e2);
              c[d2 >> 2] = 0;
              c[a2 + 584 >> 2] = 0;
            }
            d2 = a2 + 564 | 0;
            e2 = c[d2 >> 2] | 0;
            if (e2) {
              c[a2 + 568 >> 2] = 0;
              Td(e2);
              c[d2 >> 2] = 0;
              c[a2 + 572 >> 2] = 0;
            }
            d2 = c[a2 + 544 >> 2] | 0;
            if (d2)
              Td(d2);
            d2 = a2 + 472 | 0;
            e2 = c[d2 >> 2] | 0;
            if (e2) {
              c[a2 + 476 >> 2] = 0;
              Td(e2);
              c[d2 >> 2] = 0;
              c[a2 + 480 >> 2] = 0;
            }
            d2 = a2 + 460 | 0;
            e2 = c[d2 >> 2] | 0;
            if (e2) {
              c[a2 + 464 >> 2] = 0;
              Td(e2);
              c[d2 >> 2] = 0;
              c[a2 + 468 >> 2] = 0;
            }
            hc(a2 + 412 | 0);
            d2 = a2 + 396 | 0;
            e2 = c[d2 >> 2] | 0;
            if (e2) {
              c[a2 + 400 >> 2] = 0;
              Td(e2);
              c[d2 >> 2] = 0;
              c[a2 + 404 >> 2] = 0;
            }
            d2 = a2 + 380 | 0;
            e2 = c[d2 >> 2] | 0;
            if (e2) {
              c[a2 + 384 >> 2] = 0;
              Td(e2);
              c[d2 >> 2] = 0;
              c[a2 + 388 >> 2] = 0;
            }
            e2 = a2 + 364 | 0;
            d2 = c[e2 >> 2] | 0;
            if (d2) {
              c[a2 + 368 >> 2] = 0;
              Td(d2);
              c[e2 >> 2] = 0;
              c[a2 + 372 >> 2] = 0;
            }
            d2 = a2 + 348 | 0;
            e2 = c[d2 >> 2] | 0;
            if (e2) {
              c[a2 + 352 >> 2] = 0;
              Td(e2);
              c[d2 >> 2] = 0;
              c[a2 + 356 >> 2] = 0;
            }
            d2 = a2 + 332 | 0;
            e2 = c[d2 >> 2] | 0;
            if (e2) {
              c[a2 + 336 >> 2] = 0;
              Td(e2);
              c[d2 >> 2] = 0;
              c[a2 + 340 >> 2] = 0;
            }
            d2 = a2 + 316 | 0;
            e2 = c[d2 >> 2] | 0;
            if (e2) {
              c[a2 + 320 >> 2] = 0;
              Td(e2);
              c[d2 >> 2] = 0;
              c[a2 + 324 >> 2] = 0;
            }
            d2 = a2 + 304 | 0;
            e2 = c[d2 >> 2] | 0;
            if (e2) {
              c[a2 + 308 >> 2] = 0;
              Td(e2);
              c[d2 >> 2] = 0;
              c[a2 + 312 >> 2] = 0;
            }
            d2 = a2 + 292 | 0;
            e2 = c[d2 >> 2] | 0;
            if (e2) {
              c[a2 + 296 >> 2] = 0;
              Td(e2);
              c[d2 >> 2] = 0;
              c[a2 + 300 >> 2] = 0;
            }
            d2 = a2 + 280 | 0;
            e2 = c[d2 >> 2] | 0;
            if (e2) {
              c[a2 + 284 >> 2] = 0;
              Td(e2);
              c[d2 >> 2] = 0;
              c[a2 + 288 >> 2] = 0;
            }
            d2 = a2 + 268 | 0;
            e2 = c[d2 >> 2] | 0;
            if (e2) {
              c[a2 + 272 >> 2] = 0;
              Td(e2);
              c[d2 >> 2] = 0;
              c[a2 + 276 >> 2] = 0;
            }
            d2 = a2 + 256 | 0;
            e2 = c[d2 >> 2] | 0;
            if (e2) {
              c[a2 + 260 >> 2] = 0;
              Td(e2);
              c[d2 >> 2] = 0;
              c[a2 + 264 >> 2] = 0;
            }
            d2 = a2 + 32 | 0;
            e2 = c[d2 >> 2] | 0;
            if (e2) {
              c[a2 + 36 >> 2] = 0;
              Td(e2);
              c[d2 >> 2] = 0;
              c[a2 + 40 >> 2] = 0;
            }
            d2 = a2 + 16 | 0;
            e2 = c[d2 >> 2] | 0;
            if (e2) {
              c[a2 + 20 >> 2] = 0;
              Td(e2);
              c[d2 >> 2] = 0;
              c[a2 + 24 >> 2] = 0;
            }
            e2 = a2 + 4 | 0;
            d2 = c[e2 >> 2] | 0;
            if (!d2) {
              i2 = b2;
              return;
            }
            c[a2 + 8 >> 2] = 0;
            Td(d2);
            c[e2 >> 2] = 0;
            c[a2 + 12 >> 2] = 0;
            i2 = b2;
            return;
          }
          function Jb(b2, d2, e2) {
            b2 = b2 | 0;
            d2 = d2 | 0;
            e2 = e2 | 0;
            var f2 = 0, g2 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, n2 = 0, o2 = 0, p2 = 0, q2 = 0, r2 = 0;
            f2 = i2;
            i2 = i2 + 16 | 0;
            k2 = f2 + 4 | 0;
            j2 = f2;
            g2 = b2 + 580 | 0;
            m2 = c[g2 >> 2] | 0;
            if ((m2 | 0) > 0) {
              o2 = m2 + -1 | 0;
              p2 = c[(c[b2 + 576 >> 2] | 0) + (o2 << 2) >> 2] | 0;
              c[g2 >> 2] = o2;
              g2 = p2;
            } else {
              p2 = b2 + 540 | 0;
              g2 = c[p2 >> 2] | 0;
              c[p2 >> 2] = g2 + 1;
            }
            m2 = b2 + 412 | 0;
            p2 = g2 << 1;
            c[k2 >> 2] = p2;
            ic(m2, k2);
            c[j2 >> 2] = p2 | 1;
            ic(m2, j2);
            k2 = b2 + 332 | 0;
            m2 = a[544] | 0;
            j2 = g2 + 1 | 0;
            jc(k2, j2);
            a[(c[k2 >> 2] | 0) + g2 >> 0] = m2;
            k2 = b2 + 396 | 0;
            m2 = b2 + 400 | 0;
            if ((c[m2 >> 2] | 0) < (j2 | 0)) {
              o2 = b2 + 404 | 0;
              p2 = c[o2 >> 2] | 0;
              if ((p2 | 0) < (j2 | 0)) {
                q2 = g2 + 2 - p2 & -2;
                n2 = (p2 >> 1) + 2 & -2;
                n2 = (q2 | 0) > (n2 | 0) ? q2 : n2;
                if ((n2 | 0) > (2147483647 - p2 | 0)) {
                  q2 = va(1) | 0;
                  Ta(q2 | 0, 48, 0);
                }
                r2 = c[k2 >> 2] | 0;
                q2 = n2 + p2 | 0;
                c[o2 >> 2] = q2;
                q2 = Ud(r2, q2 << 3) | 0;
                c[k2 >> 2] = q2;
                if ((q2 | 0) == 0 ? (c[(Oa() | 0) >> 2] | 0) == 12 : 0) {
                  r2 = va(1) | 0;
                  Ta(r2 | 0, 48, 0);
                }
              }
              o2 = c[m2 >> 2] | 0;
              if ((o2 | 0) < (j2 | 0))
                do {
                  n2 = (c[k2 >> 2] | 0) + (o2 << 3) | 0;
                  if (n2) {
                    r2 = n2;
                    c[r2 >> 2] = 0;
                    c[r2 + 4 >> 2] = 0;
                  }
                  o2 = o2 + 1 | 0;
                } while ((o2 | 0) != (j2 | 0));
              c[m2 >> 2] = j2;
            }
            m2 = (c[k2 >> 2] | 0) + (g2 << 3) | 0;
            c[m2 >> 2] = -1;
            c[m2 + 4 >> 2] = 0;
            m2 = b2 + 316 | 0;
            if (!(a[b2 + 93 >> 0] | 0))
              l2 = 0;
            else {
              r2 = b2 + 72 | 0;
              l2 = +h[r2 >> 3] * 1389796;
              l2 = l2 - +(~~(l2 / 2147483647) | 0) * 2147483647;
              h[r2 >> 3] = l2;
              l2 = l2 / 2147483647 * 1e-5;
            }
            k2 = b2 + 320 | 0;
            if ((c[k2 >> 2] | 0) < (j2 | 0)) {
              n2 = b2 + 324 | 0;
              o2 = c[n2 >> 2] | 0;
              if ((o2 | 0) < (j2 | 0)) {
                r2 = g2 + 2 - o2 & -2;
                p2 = (o2 >> 1) + 2 & -2;
                p2 = (r2 | 0) > (p2 | 0) ? r2 : p2;
                if ((p2 | 0) > (2147483647 - o2 | 0)) {
                  r2 = va(1) | 0;
                  Ta(r2 | 0, 48, 0);
                }
                q2 = c[m2 >> 2] | 0;
                r2 = p2 + o2 | 0;
                c[n2 >> 2] = r2;
                r2 = Ud(q2, r2 << 3) | 0;
                c[m2 >> 2] = r2;
                if ((r2 | 0) == 0 ? (c[(Oa() | 0) >> 2] | 0) == 12 : 0) {
                  r2 = va(1) | 0;
                  Ta(r2 | 0, 48, 0);
                }
              }
              p2 = c[k2 >> 2] | 0;
              if ((p2 | 0) < (j2 | 0)) {
                n2 = c[m2 >> 2] | 0;
                do {
                  o2 = n2 + (p2 << 3) | 0;
                  if (o2)
                    h[o2 >> 3] = 0;
                  p2 = p2 + 1 | 0;
                } while ((p2 | 0) != (j2 | 0));
              }
              c[k2 >> 2] = j2;
            }
            h[(c[m2 >> 2] | 0) + (g2 << 3) >> 3] = l2;
            kc(b2 + 588 | 0, g2, 0);
            kc(b2 + 348 | 0, g2, 1);
            k2 = b2 + 364 | 0;
            d2 = a[d2 >> 0] | 0;
            jc(k2, j2);
            a[(c[k2 >> 2] | 0) + g2 >> 0] = d2;
            k2 = b2 + 380 | 0;
            d2 = b2 + 384 | 0;
            if ((c[d2 >> 2] | 0) < (j2 | 0)) {
              m2 = b2 + 388 | 0;
              o2 = c[m2 >> 2] | 0;
              if ((o2 | 0) < (j2 | 0)) {
                r2 = g2 + 2 - o2 & -2;
                n2 = (o2 >> 1) + 2 & -2;
                n2 = (r2 | 0) > (n2 | 0) ? r2 : n2;
                if ((n2 | 0) > (2147483647 - o2 | 0)) {
                  r2 = va(1) | 0;
                  Ta(r2 | 0, 48, 0);
                }
                q2 = c[k2 >> 2] | 0;
                r2 = n2 + o2 | 0;
                c[m2 >> 2] = r2;
                r2 = Ud(q2, r2) | 0;
                c[k2 >> 2] = r2;
                if ((r2 | 0) == 0 ? (c[(Oa() | 0) >> 2] | 0) == 12 : 0) {
                  r2 = va(1) | 0;
                  Ta(r2 | 0, 48, 0);
                }
              }
              m2 = c[d2 >> 2] | 0;
              if ((m2 | 0) < (j2 | 0))
                do {
                  n2 = (c[k2 >> 2] | 0) + m2 | 0;
                  if (n2)
                    a[n2 >> 0] = 0;
                  m2 = m2 + 1 | 0;
                } while ((m2 | 0) != (j2 | 0));
              c[d2 >> 2] = j2;
            }
            d2 = b2 + 288 | 0;
            k2 = c[d2 >> 2] | 0;
            if ((k2 | 0) < (j2 | 0)) {
              r2 = g2 + 2 - k2 & -2;
              j2 = (k2 >> 1) + 2 & -2;
              j2 = (r2 | 0) > (j2 | 0) ? r2 : j2;
              if ((j2 | 0) > (2147483647 - k2 | 0)) {
                r2 = va(1) | 0;
                Ta(r2 | 0, 48, 0);
              }
              q2 = b2 + 280 | 0;
              p2 = c[q2 >> 2] | 0;
              r2 = j2 + k2 | 0;
              c[d2 >> 2] = r2;
              r2 = Ud(p2, r2 << 2) | 0;
              c[q2 >> 2] = r2;
              if ((r2 | 0) == 0 ? (c[(Oa() | 0) >> 2] | 0) == 12 : 0) {
                r2 = va(1) | 0;
                Ta(r2 | 0, 48, 0);
              }
            }
            j2 = b2 + 380 | 0;
            d2 = (c[j2 >> 2] | 0) + g2 | 0;
            k2 = (a[d2 >> 0] | 0) == 0;
            if (e2) {
              if (k2) {
                r2 = b2 + 200 | 0;
                q2 = r2;
                q2 = ne(c[q2 >> 2] | 0, c[q2 + 4 >> 2] | 0, 1, 0) | 0;
                c[r2 >> 2] = q2;
                c[r2 + 4 >> 2] = F;
              }
            } else if (!k2) {
              r2 = b2 + 200 | 0;
              q2 = r2;
              q2 = ne(c[q2 >> 2] | 0, c[q2 + 4 >> 2] | 0, -1, -1) | 0;
              c[r2 >> 2] = q2;
              c[r2 + 4 >> 2] = F;
            }
            a[d2 >> 0] = e2 & 1;
            e2 = b2 + 460 | 0;
            if ((c[b2 + 476 >> 2] | 0) > (g2 | 0) ? (c[(c[b2 + 472 >> 2] | 0) + (g2 << 2) >> 2] | 0) > -1 : 0) {
              i2 = f2;
              return g2 | 0;
            }
            if (!(a[(c[j2 >> 2] | 0) + g2 >> 0] | 0)) {
              i2 = f2;
              return g2 | 0;
            }
            lc(e2, g2);
            i2 = f2;
            return g2 | 0;
          }
          function Kb(b2, e2) {
            b2 = b2 | 0;
            e2 = e2 | 0;
            var f2 = 0, g2 = 0, h2 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, n2 = 0, o2 = 0, p2 = 0, q2 = 0, r2 = 0, s2 = 0, t2 = 0, u2 = 0;
            f2 = i2;
            i2 = i2 + 16 | 0;
            k2 = f2 + 1 | 0;
            j2 = f2;
            g2 = b2 + 492 | 0;
            if (!(a[g2 >> 0] | 0)) {
              s2 = 0;
              i2 = f2;
              return s2 | 0;
            }
            s2 = c[e2 >> 2] | 0;
            h2 = e2 + 4 | 0;
            l2 = c[h2 >> 2] | 0;
            a[k2 + 0 >> 0] = a[j2 + 0 >> 0] | 0;
            oc(s2, l2, k2);
            l2 = c[h2 >> 2] | 0;
            a:
              do
                if ((l2 | 0) > 0) {
                  k2 = b2 + 332 | 0;
                  j2 = a[528] | 0;
                  m2 = 0;
                  n2 = 0;
                  p2 = -2;
                  while (1) {
                    s2 = c[e2 >> 2] | 0;
                    o2 = c[s2 + (m2 << 2) >> 2] | 0;
                    r2 = d[(c[k2 >> 2] | 0) + (o2 >> 1) >> 0] | 0;
                    t2 = r2 ^ o2 & 1;
                    q2 = t2 & 255;
                    u2 = j2 & 255;
                    if ((o2 | 0) == (p2 ^ 1 | 0) ? 1 : (q2 << 24 >> 24 == j2 << 24 >> 24 & (u2 >>> 1 ^ 1) | u2 & 2 & t2 | 0) != 0) {
                      b2 = 1;
                      break;
                    }
                    t2 = a[536] | 0;
                    u2 = t2 & 255;
                    if ((o2 | 0) != (p2 | 0) ? ((u2 >>> 1 ^ 1) & q2 << 24 >> 24 == t2 << 24 >> 24 | r2 & 2 & u2 | 0) == 0 : 0) {
                      c[s2 + (n2 << 2) >> 2] = o2;
                      l2 = c[h2 >> 2] | 0;
                      n2 = n2 + 1 | 0;
                    } else
                      o2 = p2;
                    m2 = m2 + 1 | 0;
                    if ((m2 | 0) < (l2 | 0))
                      p2 = o2;
                    else
                      break a;
                  }
                  i2 = f2;
                  return b2 | 0;
                } else {
                  m2 = 0;
                  n2 = 0;
                }
              while (0);
            j2 = m2 - n2 | 0;
            if ((j2 | 0) > 0) {
              l2 = l2 - j2 | 0;
              c[h2 >> 2] = l2;
            }
            if (!l2) {
              a[g2 >> 0] = 0;
              u2 = 0;
              i2 = f2;
              return u2 | 0;
            } else if ((l2 | 0) == 1) {
              t2 = c[c[e2 >> 2] >> 2] | 0;
              s2 = t2 >> 1;
              a[(c[b2 + 332 >> 2] | 0) + s2 >> 0] = (t2 & 1 ^ 1) & 255 ^ 1;
              u2 = c[b2 + 296 >> 2] | 0;
              s2 = (c[b2 + 396 >> 2] | 0) + (s2 << 3) | 0;
              c[s2 >> 2] = -1;
              c[s2 + 4 >> 2] = u2;
              s2 = b2 + 284 | 0;
              u2 = c[s2 >> 2] | 0;
              c[s2 >> 2] = u2 + 1;
              c[(c[b2 + 280 >> 2] | 0) + (u2 << 2) >> 2] = t2;
              u2 = (Mb(b2) | 0) == -1;
              a[g2 >> 0] = u2 & 1;
              i2 = f2;
              return u2 | 0;
            } else {
              e2 = pc(b2 + 544 | 0, e2, 0) | 0;
              h2 = b2 + 256 | 0;
              g2 = b2 + 260 | 0;
              k2 = c[g2 >> 2] | 0;
              j2 = b2 + 264 | 0;
              if ((k2 | 0) == (c[j2 >> 2] | 0)) {
                l2 = (k2 >> 1) + 2 & -2;
                l2 = (l2 | 0) < 2 ? 2 : l2;
                if ((l2 | 0) > (2147483647 - k2 | 0)) {
                  u2 = va(1) | 0;
                  Ta(u2 | 0, 48, 0);
                }
                t2 = c[h2 >> 2] | 0;
                u2 = l2 + k2 | 0;
                c[j2 >> 2] = u2;
                u2 = Ud(t2, u2 << 2) | 0;
                c[h2 >> 2] = u2;
                if ((u2 | 0) == 0 ? (c[(Oa() | 0) >> 2] | 0) == 12 : 0) {
                  u2 = va(1) | 0;
                  Ta(u2 | 0, 48, 0);
                }
                k2 = c[g2 >> 2] | 0;
              }
              c[g2 >> 2] = k2 + 1;
              g2 = (c[h2 >> 2] | 0) + (k2 << 2) | 0;
              if (g2)
                c[g2 >> 2] = e2;
              Nb(b2, e2);
              u2 = 1;
              i2 = f2;
              return u2 | 0;
            }
            return 0;
          }
          function Lb(b2, d2, e2) {
            b2 = b2 | 0;
            d2 = d2 | 0;
            e2 = e2 | 0;
            var f2 = 0, g2 = 0;
            f2 = c[d2 >> 2] | 0;
            d2 = f2 >> 1;
            a[(c[b2 + 332 >> 2] | 0) + d2 >> 0] = (f2 & 1 ^ 1) & 255 ^ 1;
            g2 = c[b2 + 296 >> 2] | 0;
            d2 = (c[b2 + 396 >> 2] | 0) + (d2 << 3) | 0;
            c[d2 >> 2] = e2;
            c[d2 + 4 >> 2] = g2;
            e2 = b2 + 284 | 0;
            d2 = c[e2 >> 2] | 0;
            c[e2 >> 2] = d2 + 1;
            c[(c[b2 + 280 >> 2] | 0) + (d2 << 2) >> 2] = f2;
            return;
          }
          function Mb(b2) {
            b2 = b2 | 0;
            var e2 = 0, f2 = 0, g2 = 0, h2 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, n2 = 0, o2 = 0, p2 = 0, q2 = 0, r2 = 0, s2 = 0, t2 = 0, u2 = 0, v2 = 0, w2 = 0, x2 = 0, y2 = 0, z2 = 0, A2 = 0, B2 = 0, C2 = 0, D2 = 0, E2 = 0, G2 = 0, H2 = 0, I2 = 0, J2 = 0, K2 = 0, L2 = 0, M2 = 0, N2 = 0, O2 = 0, P2 = 0;
            k2 = i2;
            i2 = i2 + 16 | 0;
            r2 = k2;
            h2 = b2 + 512 | 0;
            t2 = c[h2 >> 2] | 0;
            q2 = b2 + 284 | 0;
            if ((t2 | 0) >= (c[q2 >> 2] | 0)) {
              M2 = 0;
              K2 = 0;
              O2 = -1;
              N2 = b2 + 184 | 0;
              I2 = N2;
              L2 = I2;
              L2 = c[L2 >> 2] | 0;
              I2 = I2 + 4 | 0;
              I2 = c[I2 >> 2] | 0;
              I2 = ne(L2 | 0, I2 | 0, M2 | 0, K2 | 0) | 0;
              L2 = F;
              J2 = N2;
              c[J2 >> 2] = I2;
              N2 = N2 + 4 | 0;
              c[N2 >> 2] = L2;
              N2 = b2 + 520 | 0;
              L2 = N2;
              J2 = L2;
              J2 = c[J2 >> 2] | 0;
              L2 = L2 + 4 | 0;
              L2 = c[L2 >> 2] | 0;
              K2 = je(J2 | 0, L2 | 0, M2 | 0, K2 | 0) | 0;
              M2 = F;
              L2 = N2;
              c[L2 >> 2] = K2;
              N2 = N2 + 4 | 0;
              c[N2 >> 2] = M2;
              i2 = k2;
              return O2 | 0;
            }
            o2 = b2 + 280 | 0;
            j2 = b2 + 428 | 0;
            g2 = b2 + 412 | 0;
            l2 = b2 + 332 | 0;
            m2 = b2 + 544 | 0;
            n2 = r2 + 4 | 0;
            e2 = b2 + 396 | 0;
            p2 = b2 + 296 | 0;
            f2 = b2 + 456 | 0;
            z2 = -1;
            s2 = 0;
            do {
              c[h2 >> 2] = t2 + 1;
              w2 = c[(c[o2 >> 2] | 0) + (t2 << 2) >> 2] | 0;
              if (a[(c[j2 >> 2] | 0) + w2 >> 0] | 0) {
                u2 = c[g2 >> 2] | 0;
                t2 = u2 + (w2 * 12 | 0) + 4 | 0;
                y2 = c[t2 >> 2] | 0;
                if ((y2 | 0) > 0) {
                  u2 = u2 + (w2 * 12 | 0) | 0;
                  v2 = 0;
                  x2 = 0;
                  do {
                    B2 = c[u2 >> 2] | 0;
                    A2 = B2 + (v2 << 3) | 0;
                    if ((c[(c[c[f2 >> 2] >> 2] | 0) + (c[A2 >> 2] << 2) >> 2] & 3 | 0) != 1) {
                      N2 = A2;
                      O2 = c[N2 + 4 >> 2] | 0;
                      y2 = B2 + (x2 << 3) | 0;
                      c[y2 >> 2] = c[N2 >> 2];
                      c[y2 + 4 >> 2] = O2;
                      y2 = c[t2 >> 2] | 0;
                      x2 = x2 + 1 | 0;
                    }
                    v2 = v2 + 1 | 0;
                  } while ((v2 | 0) < (y2 | 0));
                } else {
                  v2 = 0;
                  x2 = 0;
                }
                u2 = v2 - x2 | 0;
                if ((u2 | 0) > 0)
                  c[t2 >> 2] = y2 - u2;
                a[(c[j2 >> 2] | 0) + w2 >> 0] = 0;
              }
              t2 = c[g2 >> 2] | 0;
              s2 = s2 + 1 | 0;
              u2 = c[t2 + (w2 * 12 | 0) >> 2] | 0;
              t2 = t2 + (w2 * 12 | 0) + 4 | 0;
              x2 = c[t2 >> 2] | 0;
              v2 = u2 + (x2 << 3) | 0;
              a:
                do
                  if (!x2) {
                    v2 = u2;
                    y2 = u2;
                  } else {
                    w2 = w2 ^ 1;
                    x2 = (x2 << 3) + -1 | 0;
                    B2 = u2;
                    y2 = u2;
                    while (1) {
                      while (1) {
                        b:
                          while (1) {
                            H2 = c[B2 + 4 >> 2] | 0;
                            O2 = d[(c[l2 >> 2] | 0) + (H2 >> 1) >> 0] ^ H2 & 1;
                            J2 = a[528] | 0;
                            I2 = J2 & 255;
                            K2 = I2 & 2;
                            I2 = I2 >>> 1 ^ 1;
                            if ((O2 & 255) << 24 >> 24 == J2 << 24 >> 24 & I2 | K2 & O2) {
                              E2 = 19;
                              break;
                            }
                            A2 = c[B2 >> 2] | 0;
                            E2 = c[m2 >> 2] | 0;
                            G2 = E2 + (A2 << 2) | 0;
                            C2 = E2 + (A2 + 1 << 2) | 0;
                            D2 = c[C2 >> 2] | 0;
                            if ((D2 | 0) == (w2 | 0)) {
                              O2 = E2 + (A2 + 2 << 2) | 0;
                              D2 = c[O2 >> 2] | 0;
                              c[C2 >> 2] = D2;
                              c[O2 >> 2] = w2;
                            }
                            C2 = B2 + 8 | 0;
                            c[r2 >> 2] = A2;
                            c[n2 >> 2] = D2;
                            if ((D2 | 0) != (H2 | 0) ? (O2 = d[(c[l2 >> 2] | 0) + (D2 >> 1) >> 0] ^ D2 & 1, ((O2 & 255) << 24 >> 24 == J2 << 24 >> 24 & I2 | K2 & O2 | 0) != 0) : 0) {
                              E2 = 27;
                              break;
                            }
                            K2 = c[G2 >> 2] | 0;
                            if (K2 >>> 0 <= 95) {
                              E2 = 31;
                              break;
                            }
                            I2 = c[l2 >> 2] | 0;
                            J2 = a[536] | 0;
                            H2 = J2 & 255;
                            O2 = H2 & 2;
                            H2 = H2 >>> 1 ^ 1;
                            N2 = 2;
                            while (1) {
                              L2 = G2 + (N2 << 2) + 4 | 0;
                              M2 = c[L2 >> 2] | 0;
                              P2 = d[I2 + (M2 >> 1) >> 0] ^ M2 & 1;
                              N2 = N2 + 1 | 0;
                              if (!((P2 & 255) << 24 >> 24 == J2 << 24 >> 24 & H2 | O2 & P2))
                                break;
                              if ((N2 | 0) >= (K2 >>> 5 | 0)) {
                                E2 = 32;
                                break b;
                              }
                            }
                            P2 = E2 + (A2 + 2 << 2) | 0;
                            c[P2 >> 2] = M2;
                            c[L2 >> 2] = w2;
                            qc((c[g2 >> 2] | 0) + ((c[P2 >> 2] ^ 1) * 12 | 0) | 0, r2);
                            if ((C2 | 0) == (v2 | 0))
                              break a;
                            else
                              B2 = C2;
                          }
                        if ((E2 | 0) == 19) {
                          E2 = 0;
                          N2 = B2;
                          O2 = c[N2 + 4 >> 2] | 0;
                          P2 = y2;
                          c[P2 >> 2] = c[N2 >> 2];
                          c[P2 + 4 >> 2] = O2;
                          B2 = B2 + 8 | 0;
                          y2 = y2 + 8 | 0;
                        } else if ((E2 | 0) == 27) {
                          E2 = 0;
                          O2 = r2;
                          P2 = c[O2 + 4 >> 2] | 0;
                          B2 = y2;
                          c[B2 >> 2] = c[O2 >> 2];
                          c[B2 + 4 >> 2] = P2;
                          B2 = C2;
                          y2 = y2 + 8 | 0;
                        } else if ((E2 | 0) == 31) {
                          J2 = a[536] | 0;
                          E2 = 32;
                        }
                        if ((E2 | 0) == 32) {
                          E2 = y2 + 8 | 0;
                          G2 = r2;
                          I2 = c[G2 + 4 >> 2] | 0;
                          H2 = y2;
                          c[H2 >> 2] = c[G2 >> 2];
                          c[H2 + 4 >> 2] = I2;
                          H2 = D2 >> 1;
                          I2 = D2 & 1;
                          G2 = (c[l2 >> 2] | 0) + H2 | 0;
                          P2 = d[G2 >> 0] ^ I2;
                          O2 = J2 & 255;
                          if ((P2 & 255) << 24 >> 24 == J2 << 24 >> 24 & (O2 >>> 1 ^ 1) | O2 & 2 & P2)
                            break;
                          a[G2 >> 0] = (I2 ^ 1) & 255 ^ 1;
                          y2 = c[p2 >> 2] | 0;
                          B2 = (c[e2 >> 2] | 0) + (H2 << 3) | 0;
                          c[B2 >> 2] = A2;
                          c[B2 + 4 >> 2] = y2;
                          B2 = c[q2 >> 2] | 0;
                          c[q2 >> 2] = B2 + 1;
                          c[(c[o2 >> 2] | 0) + (B2 << 2) >> 2] = D2;
                          B2 = C2;
                          y2 = E2;
                        }
                        if ((B2 | 0) == (v2 | 0))
                          break a;
                      }
                      c[h2 >> 2] = c[q2 >> 2];
                      if (C2 >>> 0 < v2 >>> 0) {
                        z2 = (u2 + (x2 - C2) | 0) >>> 3;
                        while (1) {
                          N2 = C2;
                          C2 = C2 + 8 | 0;
                          O2 = c[N2 + 4 >> 2] | 0;
                          P2 = E2;
                          c[P2 >> 2] = c[N2 >> 2];
                          c[P2 + 4 >> 2] = O2;
                          if (C2 >>> 0 >= v2 >>> 0)
                            break;
                          else
                            E2 = E2 + 8 | 0;
                        }
                        B2 = B2 + (z2 + 2 << 3) | 0;
                        y2 = y2 + (z2 + 2 << 3) | 0;
                      } else {
                        B2 = C2;
                        y2 = E2;
                      }
                      if ((B2 | 0) == (v2 | 0)) {
                        z2 = A2;
                        break;
                      } else
                        z2 = A2;
                    }
                  }
                while (0);
              u2 = v2 - y2 | 0;
              if ((u2 | 0) > 0)
                c[t2 >> 2] = (c[t2 >> 2] | 0) - (u2 >> 3);
              t2 = c[h2 >> 2] | 0;
            } while ((t2 | 0) < (c[q2 >> 2] | 0));
            N2 = s2;
            L2 = ((s2 | 0) < 0) << 31 >> 31;
            P2 = z2;
            O2 = b2 + 184 | 0;
            J2 = O2;
            M2 = J2;
            M2 = c[M2 >> 2] | 0;
            J2 = J2 + 4 | 0;
            J2 = c[J2 >> 2] | 0;
            J2 = ne(M2 | 0, J2 | 0, N2 | 0, L2 | 0) | 0;
            M2 = F;
            K2 = O2;
            c[K2 >> 2] = J2;
            O2 = O2 + 4 | 0;
            c[O2 >> 2] = M2;
            O2 = b2 + 520 | 0;
            M2 = O2;
            K2 = M2;
            K2 = c[K2 >> 2] | 0;
            M2 = M2 + 4 | 0;
            M2 = c[M2 >> 2] | 0;
            L2 = je(K2 | 0, M2 | 0, N2 | 0, L2 | 0) | 0;
            N2 = F;
            M2 = O2;
            c[M2 >> 2] = L2;
            O2 = O2 + 4 | 0;
            c[O2 >> 2] = N2;
            i2 = k2;
            return P2 | 0;
          }
          function Nb(a2, b2) {
            a2 = a2 | 0;
            b2 = b2 | 0;
            var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h2 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0;
            d2 = i2;
            i2 = i2 + 16 | 0;
            k2 = d2 + 8 | 0;
            f2 = d2;
            g2 = c[a2 + 544 >> 2] | 0;
            e2 = g2 + (b2 << 2) | 0;
            h2 = g2 + (b2 + 1 << 2) | 0;
            j2 = a2 + 412 | 0;
            l2 = (c[j2 >> 2] | 0) + ((c[h2 >> 2] ^ 1) * 12 | 0) | 0;
            g2 = g2 + (b2 + 2 << 2) | 0;
            m2 = c[g2 >> 2] | 0;
            c[k2 >> 2] = b2;
            c[k2 + 4 >> 2] = m2;
            qc(l2, k2);
            g2 = (c[j2 >> 2] | 0) + ((c[g2 >> 2] ^ 1) * 12 | 0) | 0;
            h2 = c[h2 >> 2] | 0;
            c[f2 >> 2] = b2;
            c[f2 + 4 >> 2] = h2;
            qc(g2, f2);
            if (!(c[e2 >> 2] & 4)) {
              m2 = a2 + 208 | 0;
              l2 = m2;
              l2 = ne(c[l2 >> 2] | 0, c[l2 + 4 >> 2] | 0, 1, 0) | 0;
              c[m2 >> 2] = l2;
              c[m2 + 4 >> 2] = F;
              m2 = a2 + 224 | 0;
              l2 = m2;
              l2 = ne((c[e2 >> 2] | 0) >>> 5 | 0, 0, c[l2 >> 2] | 0, c[l2 + 4 >> 2] | 0) | 0;
              c[m2 >> 2] = l2;
              c[m2 + 4 >> 2] = F;
              i2 = d2;
              return;
            } else {
              m2 = a2 + 216 | 0;
              l2 = m2;
              l2 = ne(c[l2 >> 2] | 0, c[l2 + 4 >> 2] | 0, 1, 0) | 0;
              c[m2 >> 2] = l2;
              c[m2 + 4 >> 2] = F;
              m2 = a2 + 232 | 0;
              l2 = m2;
              l2 = ne((c[e2 >> 2] | 0) >>> 5 | 0, 0, c[l2 >> 2] | 0, c[l2 + 4 >> 2] | 0) | 0;
              c[m2 >> 2] = l2;
              c[m2 + 4 >> 2] = F;
              i2 = d2;
              return;
            }
          }
          function Ob(b2, d2, e2) {
            b2 = b2 | 0;
            d2 = d2 | 0;
            e2 = e2 | 0;
            var f2 = 0, g2 = 0, h2 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, n2 = 0, o2 = 0, p2 = 0;
            g2 = i2;
            i2 = i2 + 16 | 0;
            l2 = g2 + 4 | 0;
            j2 = g2;
            h2 = c[b2 + 544 >> 2] | 0;
            f2 = h2 + (d2 << 2) | 0;
            k2 = c[h2 + (d2 + 1 << 2) >> 2] ^ 1;
            if (!e2) {
              c[l2 >> 2] = k2;
              e2 = b2 + 428 | 0;
              m2 = c[e2 >> 2] | 0;
              k2 = m2 + k2 | 0;
              if (!(a[k2 >> 0] | 0)) {
                a[k2 >> 0] = 1;
                mc(b2 + 444 | 0, l2);
                m2 = c[e2 >> 2] | 0;
              }
              d2 = c[h2 + (d2 + 2 << 2) >> 2] ^ 1;
              c[j2 >> 2] = d2;
              d2 = m2 + d2 | 0;
              if (!(a[d2 >> 0] | 0)) {
                a[d2 >> 0] = 1;
                mc(b2 + 444 | 0, j2);
              }
            } else {
              j2 = b2 + 412 | 0;
              e2 = c[j2 >> 2] | 0;
              l2 = e2 + (k2 * 12 | 0) | 0;
              h2 = h2 + (d2 + 2 << 2) | 0;
              k2 = e2 + (k2 * 12 | 0) + 4 | 0;
              m2 = c[k2 >> 2] | 0;
              a:
                do
                  if ((m2 | 0) > 0) {
                    p2 = c[l2 >> 2] | 0;
                    o2 = 0;
                    while (1) {
                      n2 = o2 + 1 | 0;
                      if ((c[p2 + (o2 << 3) >> 2] | 0) == (d2 | 0)) {
                        n2 = o2;
                        break a;
                      }
                      if ((n2 | 0) < (m2 | 0))
                        o2 = n2;
                      else
                        break;
                    }
                  } else
                    n2 = 0;
                while (0);
              m2 = m2 + -1 | 0;
              if ((n2 | 0) < (m2 | 0)) {
                do {
                  e2 = c[l2 >> 2] | 0;
                  m2 = n2;
                  n2 = n2 + 1 | 0;
                  o2 = e2 + (n2 << 3) | 0;
                  p2 = c[o2 + 4 >> 2] | 0;
                  m2 = e2 + (m2 << 3) | 0;
                  c[m2 >> 2] = c[o2 >> 2];
                  c[m2 + 4 >> 2] = p2;
                  m2 = (c[k2 >> 2] | 0) + -1 | 0;
                } while ((n2 | 0) < (m2 | 0));
                e2 = c[j2 >> 2] | 0;
              }
              c[k2 >> 2] = m2;
              j2 = c[h2 >> 2] ^ 1;
              h2 = e2 + (j2 * 12 | 0) | 0;
              j2 = e2 + (j2 * 12 | 0) + 4 | 0;
              k2 = c[j2 >> 2] | 0;
              b:
                do
                  if ((k2 | 0) > 0) {
                    e2 = c[h2 >> 2] | 0;
                    m2 = 0;
                    while (1) {
                      l2 = m2 + 1 | 0;
                      if ((c[e2 + (m2 << 3) >> 2] | 0) == (d2 | 0)) {
                        l2 = m2;
                        break b;
                      }
                      if ((l2 | 0) < (k2 | 0))
                        m2 = l2;
                      else
                        break;
                    }
                  } else
                    l2 = 0;
                while (0);
              d2 = k2 + -1 | 0;
              if ((l2 | 0) < (d2 | 0))
                do {
                  n2 = c[h2 >> 2] | 0;
                  d2 = l2;
                  l2 = l2 + 1 | 0;
                  o2 = n2 + (l2 << 3) | 0;
                  p2 = c[o2 + 4 >> 2] | 0;
                  d2 = n2 + (d2 << 3) | 0;
                  c[d2 >> 2] = c[o2 >> 2];
                  c[d2 + 4 >> 2] = p2;
                  d2 = (c[j2 >> 2] | 0) + -1 | 0;
                } while ((l2 | 0) < (d2 | 0));
              c[j2 >> 2] = d2;
            }
            if (!(c[f2 >> 2] & 4)) {
              p2 = b2 + 208 | 0;
              o2 = p2;
              o2 = ne(c[o2 >> 2] | 0, c[o2 + 4 >> 2] | 0, -1, -1) | 0;
              c[p2 >> 2] = o2;
              c[p2 + 4 >> 2] = F;
              p2 = b2 + 224 | 0;
              o2 = p2;
              o2 = je(c[o2 >> 2] | 0, c[o2 + 4 >> 2] | 0, (c[f2 >> 2] | 0) >>> 5 | 0, 0) | 0;
              c[p2 >> 2] = o2;
              c[p2 + 4 >> 2] = F;
              i2 = g2;
              return;
            } else {
              p2 = b2 + 216 | 0;
              o2 = p2;
              o2 = ne(c[o2 >> 2] | 0, c[o2 + 4 >> 2] | 0, -1, -1) | 0;
              c[p2 >> 2] = o2;
              c[p2 + 4 >> 2] = F;
              p2 = b2 + 232 | 0;
              o2 = p2;
              o2 = je(c[o2 >> 2] | 0, c[o2 + 4 >> 2] | 0, (c[f2 >> 2] | 0) >>> 5 | 0, 0) | 0;
              c[p2 >> 2] = o2;
              c[p2 + 4 >> 2] = F;
              i2 = g2;
              return;
            }
          }
          function Pb(b2, e2) {
            b2 = b2 | 0;
            e2 = e2 | 0;
            var f2 = 0, g2 = 0, h2 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, n2 = 0, o2 = 0;
            h2 = i2;
            g2 = b2 + 544 | 0;
            m2 = c[g2 >> 2] | 0;
            f2 = m2 + (e2 << 2) | 0;
            Ob(b2, e2, 0);
            m2 = c[m2 + (e2 + 1 << 2) >> 2] | 0;
            j2 = m2 >> 1;
            m2 = (d[(c[b2 + 332 >> 2] | 0) + j2 >> 0] | 0) ^ m2 & 1;
            o2 = a[528] | 0;
            n2 = o2 & 255;
            if ((((m2 & 255) << 24 >> 24 == o2 << 24 >> 24 & (n2 >>> 1 ^ 1) | n2 & 2 & m2 | 0) != 0 ? (k2 = (c[b2 + 396 >> 2] | 0) + (j2 << 3) | 0, l2 = c[k2 >> 2] | 0, (l2 | 0) != -1) : 0) ? ((c[g2 >> 2] | 0) + (l2 << 2) | 0) == (f2 | 0) : 0)
              c[k2 >> 2] = -1;
            c[f2 >> 2] = c[f2 >> 2] & -4 | 1;
            n2 = c[(c[g2 >> 2] | 0) + (e2 << 2) >> 2] | 0;
            o2 = b2 + 556 | 0;
            c[o2 >> 2] = ((((n2 >>> 3 & 1) + (n2 >>> 5) << 2) + 4 | 0) >>> 2) + (c[o2 >> 2] | 0);
            i2 = h2;
            return;
          }
          function Qb(b2, e2) {
            b2 = b2 | 0;
            e2 = e2 | 0;
            var f2 = 0, g2 = 0, h2 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0;
            f2 = i2;
            g2 = c[e2 >> 2] | 0;
            if (g2 >>> 0 <= 31) {
              l2 = 0;
              i2 = f2;
              return l2 | 0;
            }
            h2 = c[b2 + 332 >> 2] | 0;
            j2 = a[528] | 0;
            k2 = j2 & 255;
            l2 = k2 & 2;
            k2 = k2 >>> 1 ^ 1;
            b2 = 0;
            while (1) {
              m2 = c[e2 + (b2 << 2) + 4 >> 2] | 0;
              m2 = (d[h2 + (m2 >> 1) >> 0] | 0) ^ m2 & 1;
              b2 = b2 + 1 | 0;
              if ((m2 & 255) << 24 >> 24 == j2 << 24 >> 24 & k2 | l2 & m2) {
                g2 = 1;
                e2 = 5;
                break;
              }
              if ((b2 | 0) >= (g2 >>> 5 | 0)) {
                g2 = 0;
                e2 = 5;
                break;
              }
            }
            if ((e2 | 0) == 5) {
              i2 = f2;
              return g2 | 0;
            }
            return 0;
          }
          function Rb(b2, d2) {
            b2 = b2 | 0;
            d2 = d2 | 0;
            var e2 = 0, f2 = 0, g2 = 0, h2 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, n2 = 0, o2 = 0, p2 = 0, q2 = 0, r2 = 0, s2 = 0, t2 = 0, u2 = 0;
            g2 = i2;
            e2 = b2 + 296 | 0;
            if ((c[e2 >> 2] | 0) <= (d2 | 0)) {
              i2 = g2;
              return;
            }
            f2 = b2 + 284 | 0;
            s2 = c[f2 >> 2] | 0;
            j2 = b2 + 292 | 0;
            t2 = c[j2 >> 2] | 0;
            u2 = c[t2 + (d2 << 2) >> 2] | 0;
            if ((s2 | 0) > (u2 | 0)) {
              r2 = b2 + 280 | 0;
              m2 = b2 + 332 | 0;
              l2 = b2 + 88 | 0;
              k2 = b2 + 348 | 0;
              n2 = b2 + 460 | 0;
              p2 = b2 + 476 | 0;
              q2 = b2 + 472 | 0;
              o2 = b2 + 380 | 0;
              do {
                s2 = s2 + -1 | 0;
                u2 = c[(c[r2 >> 2] | 0) + (s2 << 2) >> 2] >> 1;
                a[(c[m2 >> 2] | 0) + u2 >> 0] = a[544] | 0;
                t2 = c[l2 >> 2] | 0;
                if ((t2 | 0) <= 1) {
                  if ((t2 | 0) == 1 ? (s2 | 0) > (c[(c[j2 >> 2] | 0) + ((c[e2 >> 2] | 0) + -1 << 2) >> 2] | 0) : 0)
                    h2 = 7;
                } else
                  h2 = 7;
                if ((h2 | 0) == 7) {
                  h2 = 0;
                  a[(c[k2 >> 2] | 0) + u2 >> 0] = c[(c[r2 >> 2] | 0) + (s2 << 2) >> 2] & 1;
                }
                if (!((c[p2 >> 2] | 0) > (u2 | 0) ? (c[(c[q2 >> 2] | 0) + (u2 << 2) >> 2] | 0) > -1 : 0))
                  h2 = 11;
                if ((h2 | 0) == 11 ? (h2 = 0, (a[(c[o2 >> 2] | 0) + u2 >> 0] | 0) != 0) : 0)
                  lc(n2, u2);
                t2 = c[j2 >> 2] | 0;
                u2 = c[t2 + (d2 << 2) >> 2] | 0;
              } while ((s2 | 0) > (u2 | 0));
              s2 = c[f2 >> 2] | 0;
            }
            c[b2 + 512 >> 2] = u2;
            b2 = c[t2 + (d2 << 2) >> 2] | 0;
            if ((s2 - b2 | 0) > 0)
              c[f2 >> 2] = b2;
            if (((c[e2 >> 2] | 0) - d2 | 0) <= 0) {
              i2 = g2;
              return;
            }
            c[e2 >> 2] = d2;
            i2 = g2;
            return;
          }
          function Sb(b2) {
            b2 = b2 | 0;
            var d2 = 0, e2 = 0, f2 = 0, g2 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, n2 = 0, o2 = 0, p2 = 0, q2 = 0, r2 = 0;
            d2 = i2;
            f2 = b2 + 72 | 0;
            q2 = +h[f2 >> 3] * 1389796;
            q2 = q2 - +(~~(q2 / 2147483647) | 0) * 2147483647;
            h[f2 >> 3] = q2;
            l2 = b2 + 464 | 0;
            if (q2 / 2147483647 < +h[b2 + 64 >> 3] ? (m2 = c[l2 >> 2] | 0, (m2 | 0) != 0) : 0) {
              q2 = q2 * 1389796;
              q2 = q2 - +(~~(q2 / 2147483647) | 0) * 2147483647;
              h[f2 >> 3] = q2;
              m2 = c[(c[b2 + 460 >> 2] | 0) + (~~(+(m2 | 0) * (q2 / 2147483647)) << 2) >> 2] | 0;
              o2 = a[(c[b2 + 332 >> 2] | 0) + m2 >> 0] | 0;
              n2 = a[544] | 0;
              p2 = n2 & 255;
              if (((p2 >>> 1 ^ 1) & o2 << 24 >> 24 == n2 << 24 >> 24 | o2 & 2 & p2 | 0) != 0 ? (a[(c[b2 + 380 >> 2] | 0) + m2 >> 0] | 0) != 0 : 0) {
                p2 = b2 + 176 | 0;
                o2 = p2;
                o2 = ne(c[o2 >> 2] | 0, c[o2 + 4 >> 2] | 0, 1, 0) | 0;
                c[p2 >> 2] = o2;
                c[p2 + 4 >> 2] = F;
              }
            } else
              m2 = -1;
            n2 = b2 + 460 | 0;
            p2 = b2 + 332 | 0;
            o2 = b2 + 380 | 0;
            while (1) {
              if (((m2 | 0) != -1 ? (r2 = a[(c[p2 >> 2] | 0) + m2 >> 0] | 0, j2 = a[544] | 0, e2 = j2 & 255, g2 = e2 >>> 1 ^ 1, (g2 & r2 << 24 >> 24 == j2 << 24 >> 24 | r2 & 2 & e2 | 0) != 0) : 0) ? (a[(c[o2 >> 2] | 0) + m2 >> 0] | 0) != 0 : 0)
                break;
              if (!(c[l2 >> 2] | 0)) {
                e2 = -2;
                k2 = 17;
                break;
              }
              m2 = rc(n2) | 0;
            }
            if ((k2 | 0) == 17) {
              i2 = d2;
              return e2 | 0;
            }
            l2 = a[(c[b2 + 364 >> 2] | 0) + m2 >> 0] | 0;
            k2 = l2 & 255;
            if (!(g2 & l2 << 24 >> 24 == j2 << 24 >> 24 | e2 & 2 & k2)) {
              p2 = a[528] | 0;
              r2 = p2 & 255;
              r2 = ((r2 >>> 1 ^ 1) & l2 << 24 >> 24 == p2 << 24 >> 24 | k2 & 2 & r2 | 0) != 0 | m2 << 1;
              i2 = d2;
              return r2 | 0;
            }
            if (!(a[b2 + 92 >> 0] | 0)) {
              r2 = (a[(c[b2 + 348 >> 2] | 0) + m2 >> 0] | 0) != 0 | m2 << 1;
              i2 = d2;
              return r2 | 0;
            } else {
              q2 = +h[f2 >> 3] * 1389796;
              q2 = q2 - +(~~(q2 / 2147483647) | 0) * 2147483647;
              h[f2 >> 3] = q2;
              r2 = q2 / 2147483647 < 0.5 | m2 << 1;
              i2 = d2;
              return r2 | 0;
            }
            return 0;
          }
          function Tb(b2, d2, e2, f2) {
            b2 = b2 | 0;
            d2 = d2 | 0;
            e2 = e2 | 0;
            f2 = f2 | 0;
            var j2 = 0, k2 = 0, l2 = 0, m2 = 0, n2 = 0, o2 = 0, p2 = 0, q2 = 0, r2 = 0, s2 = 0, t2 = 0, u2 = 0, v2 = 0, w2 = 0, x2 = 0, y2 = 0, z2 = 0, A2 = 0, B2 = 0, C2 = 0, D2 = 0, E2 = 0, G2 = 0, H2 = 0, I2 = 0, J2 = 0, K2 = 0, L2 = 0, M2 = 0, N2 = 0, O2 = 0, P2 = 0, Q2 = 0, R2 = 0, S2 = 0, T2 = 0, U2 = 0;
            j2 = i2;
            i2 = i2 + 16 | 0;
            p2 = j2 + 8 | 0;
            t2 = j2 + 4 | 0;
            n2 = j2;
            m2 = e2 + 4 | 0;
            k2 = c[m2 >> 2] | 0;
            l2 = e2 + 8 | 0;
            if ((k2 | 0) == (c[l2 >> 2] | 0)) {
              q2 = (k2 >> 1) + 2 & -2;
              q2 = (q2 | 0) < 2 ? 2 : q2;
              if ((q2 | 0) > (2147483647 - k2 | 0)) {
                S2 = va(1) | 0;
                Ta(S2 | 0, 48, 0);
              }
              R2 = c[e2 >> 2] | 0;
              S2 = q2 + k2 | 0;
              c[l2 >> 2] = S2;
              S2 = Ud(R2, S2 << 2) | 0;
              c[e2 >> 2] = S2;
              if ((S2 | 0) == 0 ? (c[(Oa() | 0) >> 2] | 0) == 12 : 0) {
                S2 = va(1) | 0;
                Ta(S2 | 0, 48, 0);
              }
              k2 = c[m2 >> 2] | 0;
            }
            l2 = (c[e2 >> 2] | 0) + (k2 << 2) | 0;
            if (l2) {
              c[l2 >> 2] = 0;
              k2 = c[m2 >> 2] | 0;
            }
            c[m2 >> 2] = k2 + 1;
            q2 = b2 + 544 | 0;
            H2 = b2 + 280 | 0;
            k2 = b2 + 588 | 0;
            l2 = b2 + 396 | 0;
            C2 = b2 + 504 | 0;
            E2 = b2 + 316 | 0;
            D2 = b2 + 540 | 0;
            B2 = b2 + 476 | 0;
            A2 = b2 + 472 | 0;
            z2 = b2 + 460 | 0;
            y2 = b2 + 488 | 0;
            x2 = b2 + 296 | 0;
            v2 = b2 + 496 | 0;
            w2 = b2 + 272 | 0;
            G2 = b2 + 268 | 0;
            J2 = -2;
            I2 = (c[b2 + 284 >> 2] | 0) + -1 | 0;
            K2 = 0;
            do {
              L2 = c[q2 >> 2] | 0;
              d2 = L2 + (d2 << 2) | 0;
              M2 = c[d2 >> 2] | 0;
              if ((M2 & 4 | 0) != 0 ? (r2 = +h[v2 >> 3], S2 = d2 + (M2 >>> 5 << 2) + 4 | 0, T2 = r2 + +g[S2 >> 2], g[S2 >> 2] = T2, T2 > 1e20) : 0) {
                O2 = c[w2 >> 2] | 0;
                if ((O2 | 0) > 0) {
                  N2 = c[G2 >> 2] | 0;
                  M2 = 0;
                  do {
                    S2 = L2 + (c[N2 + (M2 << 2) >> 2] << 2) | 0;
                    S2 = S2 + ((c[S2 >> 2] | 0) >>> 5 << 2) + 4 | 0;
                    g[S2 >> 2] = +g[S2 >> 2] * 1e-20;
                    M2 = M2 + 1 | 0;
                  } while ((M2 | 0) != (O2 | 0));
                }
                h[v2 >> 3] = r2 * 1e-20;
              }
              J2 = (J2 | 0) != -2 & 1;
              if (J2 >>> 0 < (c[d2 >> 2] | 0) >>> 5 >>> 0)
                do {
                  M2 = c[d2 + (J2 << 2) + 4 >> 2] | 0;
                  c[t2 >> 2] = M2;
                  M2 = M2 >> 1;
                  L2 = (c[k2 >> 2] | 0) + M2 | 0;
                  do
                    if ((a[L2 >> 0] | 0) == 0 ? (c[(c[l2 >> 2] | 0) + (M2 << 3) + 4 >> 2] | 0) > 0 : 0) {
                      O2 = c[E2 >> 2] | 0;
                      S2 = O2 + (M2 << 3) | 0;
                      T2 = +h[C2 >> 3] + +h[S2 >> 3];
                      h[S2 >> 3] = T2;
                      if (T2 > 1e100) {
                        P2 = c[D2 >> 2] | 0;
                        if ((P2 | 0) > 0) {
                          N2 = 0;
                          do {
                            S2 = O2 + (N2 << 3) | 0;
                            h[S2 >> 3] = +h[S2 >> 3] * 1e-100;
                            N2 = N2 + 1 | 0;
                          } while ((N2 | 0) != (P2 | 0));
                        }
                        h[C2 >> 3] = +h[C2 >> 3] * 1e-100;
                      }
                      if ((c[B2 >> 2] | 0) > (M2 | 0) ? (u2 = c[A2 >> 2] | 0, s2 = c[u2 + (M2 << 2) >> 2] | 0, (s2 | 0) > -1) : 0) {
                        N2 = c[z2 >> 2] | 0;
                        O2 = c[N2 + (s2 << 2) >> 2] | 0;
                        a:
                          do
                            if (!s2)
                              R2 = 0;
                            else {
                              S2 = s2;
                              while (1) {
                                R2 = S2;
                                S2 = S2 + -1 >> 1;
                                Q2 = N2 + (S2 << 2) | 0;
                                P2 = c[Q2 >> 2] | 0;
                                U2 = c[c[y2 >> 2] >> 2] | 0;
                                if (!(+h[U2 + (O2 << 3) >> 3] > +h[U2 + (P2 << 3) >> 3]))
                                  break a;
                                c[N2 + (R2 << 2) >> 2] = P2;
                                c[u2 + (c[Q2 >> 2] << 2) >> 2] = R2;
                                if (!S2) {
                                  R2 = 0;
                                  break;
                                }
                              }
                            }
                          while (0);
                        c[N2 + (R2 << 2) >> 2] = O2;
                        c[u2 + (O2 << 2) >> 2] = R2;
                      }
                      a[L2 >> 0] = 1;
                      if ((c[(c[l2 >> 2] | 0) + (M2 << 3) + 4 >> 2] | 0) < (c[x2 >> 2] | 0)) {
                        mc(e2, t2);
                        break;
                      } else {
                        K2 = K2 + 1 | 0;
                        break;
                      }
                    }
                  while (0);
                  J2 = J2 + 1 | 0;
                } while ((J2 | 0) < ((c[d2 >> 2] | 0) >>> 5 | 0));
              d2 = c[H2 >> 2] | 0;
              L2 = c[k2 >> 2] | 0;
              do {
                J2 = I2;
                I2 = I2 + -1 | 0;
                J2 = c[d2 + (J2 << 2) >> 2] | 0;
                N2 = J2 >> 1;
                M2 = L2 + N2 | 0;
              } while ((a[M2 >> 0] | 0) == 0);
              d2 = c[(c[l2 >> 2] | 0) + (N2 << 3) >> 2] | 0;
              a[M2 >> 0] = 0;
              K2 = K2 + -1 | 0;
            } while ((K2 | 0) > 0);
            c[c[e2 >> 2] >> 2] = J2 ^ 1;
            t2 = b2 + 616 | 0;
            v2 = c[t2 >> 2] | 0;
            s2 = b2 + 620 | 0;
            if (!v2)
              w2 = c[s2 >> 2] | 0;
            else {
              c[s2 >> 2] = 0;
              w2 = 0;
            }
            u2 = c[m2 >> 2] | 0;
            if ((w2 | 0) < (u2 | 0)) {
              y2 = b2 + 624 | 0;
              x2 = c[y2 >> 2] | 0;
              if ((x2 | 0) < (u2 | 0)) {
                U2 = u2 + 1 - x2 & -2;
                w2 = (x2 >> 1) + 2 & -2;
                w2 = (U2 | 0) > (w2 | 0) ? U2 : w2;
                if ((w2 | 0) > (2147483647 - x2 | 0)) {
                  U2 = va(1) | 0;
                  Ta(U2 | 0, 48, 0);
                }
                U2 = w2 + x2 | 0;
                c[y2 >> 2] = U2;
                v2 = Ud(v2, U2 << 2) | 0;
                c[t2 >> 2] = v2;
                if ((v2 | 0) == 0 ? (c[(Oa() | 0) >> 2] | 0) == 12 : 0) {
                  U2 = va(1) | 0;
                  Ta(U2 | 0, 48, 0);
                }
              }
              w2 = c[s2 >> 2] | 0;
              b:
                do
                  if ((w2 | 0) < (u2 | 0))
                    while (1) {
                      v2 = v2 + (w2 << 2) | 0;
                      if (v2)
                        c[v2 >> 2] = 0;
                      w2 = w2 + 1 | 0;
                      if ((w2 | 0) == (u2 | 0))
                        break b;
                      v2 = c[t2 >> 2] | 0;
                    }
                while (0);
              c[s2 >> 2] = u2;
              u2 = c[m2 >> 2] | 0;
            }
            if ((u2 | 0) > 0) {
              w2 = c[t2 >> 2] | 0;
              v2 = c[e2 >> 2] | 0;
              x2 = 0;
              do {
                c[w2 + (x2 << 2) >> 2] = c[v2 + (x2 << 2) >> 2];
                x2 = x2 + 1 | 0;
                u2 = c[m2 >> 2] | 0;
              } while ((x2 | 0) < (u2 | 0));
            }
            v2 = c[b2 + 84 >> 2] | 0;
            if ((v2 | 0) == 1)
              if ((u2 | 0) > 1) {
                n2 = c[e2 >> 2] | 0;
                o2 = 1;
                v2 = 1;
                while (1) {
                  u2 = c[n2 + (o2 << 2) >> 2] | 0;
                  p2 = c[l2 >> 2] | 0;
                  w2 = c[p2 + (u2 >> 1 << 3) >> 2] | 0;
                  c:
                    do
                      if ((w2 | 0) != -1) {
                        x2 = (c[q2 >> 2] | 0) + (w2 << 2) | 0;
                        y2 = c[x2 >> 2] | 0;
                        if (y2 >>> 0 > 63) {
                          w2 = c[k2 >> 2] | 0;
                          z2 = 1;
                          while (1) {
                            U2 = c[x2 + (z2 << 2) + 4 >> 2] >> 1;
                            if ((a[w2 + U2 >> 0] | 0) == 0 ? (c[p2 + (U2 << 3) + 4 >> 2] | 0) > 0 : 0)
                              break;
                            z2 = z2 + 1 | 0;
                            if ((z2 | 0) >= (y2 >>> 5 | 0))
                              break c;
                          }
                          c[n2 + (v2 << 2) >> 2] = u2;
                          v2 = v2 + 1 | 0;
                        }
                      } else {
                        c[n2 + (v2 << 2) >> 2] = u2;
                        v2 = v2 + 1 | 0;
                      }
                    while (0);
                  o2 = o2 + 1 | 0;
                  p2 = c[m2 >> 2] | 0;
                  if ((o2 | 0) >= (p2 | 0)) {
                    n2 = p2;
                    break;
                  }
                }
              } else {
                n2 = u2;
                o2 = 1;
                v2 = 1;
              }
            else if ((v2 | 0) == 2)
              if ((u2 | 0) > 1) {
                q2 = 1;
                v2 = 1;
                do {
                  w2 = c[e2 >> 2] | 0;
                  u2 = c[w2 + (q2 << 2) >> 2] | 0;
                  if ((c[(c[l2 >> 2] | 0) + (u2 >> 1 << 3) >> 2] | 0) != -1) {
                    c[n2 >> 2] = u2;
                    c[p2 + 0 >> 2] = c[n2 + 0 >> 2];
                    if (!(Ub(b2, p2) | 0)) {
                      u2 = c[e2 >> 2] | 0;
                      w2 = u2;
                      u2 = c[u2 + (q2 << 2) >> 2] | 0;
                      o2 = 62;
                    }
                  } else
                    o2 = 62;
                  if ((o2 | 0) == 62) {
                    o2 = 0;
                    c[w2 + (v2 << 2) >> 2] = u2;
                    v2 = v2 + 1 | 0;
                  }
                  q2 = q2 + 1 | 0;
                  u2 = c[m2 >> 2] | 0;
                } while ((q2 | 0) < (u2 | 0));
                n2 = u2;
                o2 = q2;
              } else {
                n2 = u2;
                o2 = 1;
                v2 = 1;
              }
            else {
              n2 = u2;
              o2 = u2;
              v2 = u2;
            }
            U2 = b2 + 240 | 0;
            S2 = U2;
            S2 = ne(c[S2 >> 2] | 0, c[S2 + 4 >> 2] | 0, n2 | 0, ((n2 | 0) < 0) << 31 >> 31 | 0) | 0;
            c[U2 >> 2] = S2;
            c[U2 + 4 >> 2] = F;
            o2 = o2 - v2 | 0;
            if ((o2 | 0) > 0) {
              n2 = n2 - o2 | 0;
              c[m2 >> 2] = n2;
            }
            U2 = b2 + 248 | 0;
            S2 = U2;
            S2 = ne(c[S2 >> 2] | 0, c[S2 + 4 >> 2] | 0, n2 | 0, ((n2 | 0) < 0) << 31 >> 31 | 0) | 0;
            c[U2 >> 2] = S2;
            c[U2 + 4 >> 2] = F;
            if ((n2 | 0) == 1)
              e2 = 0;
            else {
              e2 = c[e2 >> 2] | 0;
              if ((n2 | 0) > 2) {
                b2 = c[l2 >> 2] | 0;
                m2 = 2;
                o2 = 1;
                do {
                  o2 = (c[b2 + (c[e2 + (m2 << 2) >> 2] >> 1 << 3) + 4 >> 2] | 0) > (c[b2 + (c[e2 + (o2 << 2) >> 2] >> 1 << 3) + 4 >> 2] | 0) ? m2 : o2;
                  m2 = m2 + 1 | 0;
                } while ((m2 | 0) < (n2 | 0));
              } else
                o2 = 1;
              S2 = e2 + (o2 << 2) | 0;
              U2 = c[S2 >> 2] | 0;
              e2 = e2 + 4 | 0;
              c[S2 >> 2] = c[e2 >> 2];
              c[e2 >> 2] = U2;
              e2 = c[(c[l2 >> 2] | 0) + (U2 >> 1 << 3) + 4 >> 2] | 0;
            }
            c[f2 >> 2] = e2;
            if ((c[s2 >> 2] | 0) > 0)
              f2 = 0;
            else {
              i2 = j2;
              return;
            }
            do {
              a[(c[k2 >> 2] | 0) + (c[(c[t2 >> 2] | 0) + (f2 << 2) >> 2] >> 1) >> 0] = 0;
              f2 = f2 + 1 | 0;
            } while ((f2 | 0) < (c[s2 >> 2] | 0));
            i2 = j2;
            return;
          }
          function Ub(b2, d2) {
            b2 = b2 | 0;
            d2 = d2 | 0;
            var e2 = 0, f2 = 0, g2 = 0, h2 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, n2 = 0, o2 = 0, p2 = 0, q2 = 0, r2 = 0, s2 = 0, t2 = 0, u2 = 0;
            e2 = i2;
            n2 = c[d2 >> 2] | 0;
            l2 = b2 + 396 | 0;
            q2 = c[l2 >> 2] | 0;
            k2 = b2 + 544 | 0;
            s2 = (c[k2 >> 2] | 0) + (c[q2 + (n2 >> 1 << 3) >> 2] << 2) | 0;
            h2 = b2 + 604 | 0;
            f2 = b2 + 608 | 0;
            if (c[h2 >> 2] | 0)
              c[f2 >> 2] = 0;
            g2 = b2 + 588 | 0;
            j2 = b2 + 612 | 0;
            b2 = b2 + 616 | 0;
            o2 = 1;
            while (1) {
              if (o2 >>> 0 < (c[s2 >> 2] | 0) >>> 5 >>> 0) {
                r2 = c[s2 + (o2 << 2) + 4 >> 2] | 0;
                p2 = r2 >> 1;
                if ((c[q2 + (p2 << 3) + 4 >> 2] | 0) != 0 ? (m2 = a[(c[g2 >> 2] | 0) + p2 >> 0] | 0, (m2 + -1 << 24 >> 24 & 255) >= 2) : 0) {
                  s2 = c[f2 >> 2] | 0;
                  t2 = (s2 | 0) == (c[j2 >> 2] | 0);
                  if (m2 << 24 >> 24 == 3 ? 1 : (c[q2 + (p2 << 3) >> 2] | 0) == -1) {
                    k2 = 8;
                    break;
                  }
                  if (t2) {
                    q2 = (s2 >> 1) + 2 & -2;
                    q2 = (q2 | 0) < 2 ? 2 : q2;
                    if ((q2 | 0) > (2147483647 - s2 | 0)) {
                      k2 = 24;
                      break;
                    }
                    u2 = c[h2 >> 2] | 0;
                    t2 = q2 + s2 | 0;
                    c[j2 >> 2] = t2;
                    t2 = Ud(u2, t2 << 3) | 0;
                    c[h2 >> 2] = t2;
                    if ((t2 | 0) == 0 ? (c[(Oa() | 0) >> 2] | 0) == 12 : 0) {
                      k2 = 24;
                      break;
                    }
                    s2 = c[f2 >> 2] | 0;
                  }
                  c[f2 >> 2] = s2 + 1;
                  q2 = (c[h2 >> 2] | 0) + (s2 << 3) | 0;
                  if (q2) {
                    u2 = q2;
                    c[u2 >> 2] = o2;
                    c[u2 + 4 >> 2] = n2;
                  }
                  c[d2 >> 2] = r2;
                  s2 = c[l2 >> 2] | 0;
                  n2 = r2;
                  q2 = s2;
                  s2 = (c[k2 >> 2] | 0) + (c[s2 + (p2 << 3) >> 2] << 2) | 0;
                  o2 = 0;
                }
              } else {
                n2 = (c[g2 >> 2] | 0) + (n2 >> 1) | 0;
                if (!(a[n2 >> 0] | 0)) {
                  a[n2 >> 0] = 2;
                  mc(b2, d2);
                }
                n2 = c[f2 >> 2] | 0;
                if (!n2) {
                  f2 = 1;
                  k2 = 34;
                  break;
                }
                u2 = n2 + -1 | 0;
                n2 = c[h2 >> 2] | 0;
                o2 = c[n2 + (u2 << 3) >> 2] | 0;
                n2 = c[n2 + (u2 << 3) + 4 >> 2] | 0;
                c[d2 >> 2] = n2;
                q2 = c[l2 >> 2] | 0;
                s2 = (c[k2 >> 2] | 0) + (c[q2 + (n2 >> 1 << 3) >> 2] << 2) | 0;
                c[f2 >> 2] = u2;
              }
              o2 = o2 + 1 | 0;
            }
            if ((k2 | 0) == 8) {
              if (t2) {
                k2 = (s2 >> 1) + 2 & -2;
                k2 = (k2 | 0) < 2 ? 2 : k2;
                if ((k2 | 0) > (2147483647 - s2 | 0)) {
                  u2 = va(1) | 0;
                  Ta(u2 | 0, 48, 0);
                }
                t2 = c[h2 >> 2] | 0;
                u2 = k2 + s2 | 0;
                c[j2 >> 2] = u2;
                u2 = Ud(t2, u2 << 3) | 0;
                c[h2 >> 2] = u2;
                if ((u2 | 0) == 0 ? (c[(Oa() | 0) >> 2] | 0) == 12 : 0) {
                  u2 = va(1) | 0;
                  Ta(u2 | 0, 48, 0);
                }
                s2 = c[f2 >> 2] | 0;
              }
              j2 = s2 + 1 | 0;
              c[f2 >> 2] = j2;
              k2 = (c[h2 >> 2] | 0) + (s2 << 3) | 0;
              if (k2) {
                j2 = k2;
                c[j2 >> 2] = 0;
                c[j2 + 4 >> 2] = n2;
                j2 = c[f2 >> 2] | 0;
              }
              if ((j2 | 0) > 0)
                k2 = 0;
              else {
                u2 = 0;
                i2 = e2;
                return u2 | 0;
              }
              do {
                l2 = (c[g2 >> 2] | 0) + (c[(c[h2 >> 2] | 0) + (k2 << 3) + 4 >> 2] >> 1) | 0;
                if (!(a[l2 >> 0] | 0)) {
                  a[l2 >> 0] = 3;
                  mc(b2, (c[h2 >> 2] | 0) + (k2 << 3) + 4 | 0);
                  j2 = c[f2 >> 2] | 0;
                }
                k2 = k2 + 1 | 0;
              } while ((k2 | 0) < (j2 | 0));
              f2 = 0;
              i2 = e2;
              return f2 | 0;
            } else if ((k2 | 0) == 24)
              Ta(va(1) | 0, 48, 0);
            else if ((k2 | 0) == 34) {
              i2 = e2;
              return f2 | 0;
            }
            return 0;
          }
          function Vb(b2, d2, e2) {
            b2 = b2 | 0;
            d2 = d2 | 0;
            e2 = e2 | 0;
            var f2 = 0, g2 = 0, h2 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, n2 = 0, o2 = 0, p2 = 0, q2 = 0, r2 = 0, s2 = 0, t2 = 0, u2 = 0, v2 = 0;
            j2 = i2;
            i2 = i2 + 32 | 0;
            h2 = j2 + 16 | 0;
            g2 = j2 + 12 | 0;
            k2 = j2 + 8 | 0;
            f2 = j2;
            n2 = e2 + 20 | 0;
            l2 = e2 + 16 | 0;
            if ((c[n2 >> 2] | 0) > 0) {
              m2 = 0;
              do {
                a[(c[e2 >> 2] | 0) + (c[(c[l2 >> 2] | 0) + (m2 << 2) >> 2] | 0) >> 0] = 0;
                m2 = m2 + 1 | 0;
              } while ((m2 | 0) < (c[n2 >> 2] | 0));
            }
            if (c[l2 >> 2] | 0)
              c[n2 >> 2] = 0;
            m2 = c[d2 >> 2] | 0;
            c[k2 >> 2] = m2;
            c[g2 >> 2] = m2;
            c[h2 + 0 >> 2] = c[g2 + 0 >> 2];
            sc(e2, h2, 0);
            l2 = (c[e2 >> 2] | 0) + m2 | 0;
            if (!(a[l2 >> 0] | 0)) {
              a[l2 >> 0] = 1;
              mc(e2 + 16 | 0, k2);
            }
            if (!(c[b2 + 296 >> 2] | 0)) {
              i2 = j2;
              return;
            }
            d2 = m2 >> 1;
            o2 = b2 + 588 | 0;
            a[(c[o2 >> 2] | 0) + d2 >> 0] = 1;
            p2 = c[b2 + 284 >> 2] | 0;
            n2 = b2 + 292 | 0;
            s2 = c[c[n2 >> 2] >> 2] | 0;
            if ((p2 | 0) > (s2 | 0)) {
              k2 = b2 + 280 | 0;
              l2 = b2 + 396 | 0;
              m2 = e2 + 16 | 0;
              b2 = b2 + 544 | 0;
              do {
                p2 = p2 + -1 | 0;
                r2 = c[(c[k2 >> 2] | 0) + (p2 << 2) >> 2] | 0;
                q2 = r2 >> 1;
                if (a[(c[o2 >> 2] | 0) + q2 >> 0] | 0) {
                  s2 = c[l2 >> 2] | 0;
                  t2 = c[s2 + (q2 << 3) >> 2] | 0;
                  a:
                    do
                      if ((t2 | 0) == -1) {
                        r2 = r2 ^ 1;
                        c[f2 >> 2] = r2;
                        c[g2 >> 2] = r2;
                        c[h2 + 0 >> 2] = c[g2 + 0 >> 2];
                        sc(e2, h2, 0);
                        r2 = (c[e2 >> 2] | 0) + r2 | 0;
                        if (!(a[r2 >> 0] | 0)) {
                          a[r2 >> 0] = 1;
                          mc(m2, f2);
                        }
                      } else {
                        r2 = (c[b2 >> 2] | 0) + (t2 << 2) | 0;
                        t2 = c[r2 >> 2] | 0;
                        if (t2 >>> 0 > 63) {
                          u2 = 1;
                          while (1) {
                            v2 = c[r2 + (u2 << 2) + 4 >> 2] >> 1;
                            if ((c[s2 + (v2 << 3) + 4 >> 2] | 0) > 0) {
                              a[(c[o2 >> 2] | 0) + v2 >> 0] = 1;
                              t2 = c[r2 >> 2] | 0;
                            }
                            u2 = u2 + 1 | 0;
                            if ((u2 | 0) >= (t2 >>> 5 | 0))
                              break a;
                            s2 = c[l2 >> 2] | 0;
                          }
                        }
                      }
                    while (0);
                  a[(c[o2 >> 2] | 0) + q2 >> 0] = 0;
                  s2 = c[c[n2 >> 2] >> 2] | 0;
                }
              } while ((p2 | 0) > (s2 | 0));
            }
            a[(c[o2 >> 2] | 0) + d2 >> 0] = 0;
            i2 = j2;
            return;
          }
          function Wb(b2) {
            b2 = b2 | 0;
            var e2 = 0, f2 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, n2 = 0, o2 = 0, p2 = 0, q2 = 0, r2 = 0, s2 = 0, t2 = 0, u2 = 0, v2 = 0, w2 = 0, x2 = 0, y2 = 0, z2 = 0;
            f2 = i2;
            i2 = i2 + 16 | 0;
            p2 = f2 + 4 | 0;
            u2 = f2;
            e2 = b2 + 272 | 0;
            w2 = c[e2 >> 2] | 0;
            n2 = +h[b2 + 496 >> 3] / +(w2 | 0);
            k2 = b2 + 544 | 0;
            l2 = b2 + 268 | 0;
            v2 = c[l2 >> 2] | 0;
            c[u2 >> 2] = k2;
            c[p2 + 0 >> 2] = c[u2 + 0 >> 2];
            tc(v2, w2, p2);
            p2 = c[e2 >> 2] | 0;
            if ((p2 | 0) > 0) {
              m2 = b2 + 332 | 0;
              o2 = b2 + 396 | 0;
              q2 = 0;
              v2 = 0;
              do {
                t2 = c[l2 >> 2] | 0;
                u2 = c[t2 + (q2 << 2) >> 2] | 0;
                w2 = c[k2 >> 2] | 0;
                r2 = w2 + (u2 << 2) | 0;
                s2 = c[r2 >> 2] | 0;
                do
                  if (s2 >>> 0 > 95) {
                    x2 = c[w2 + (u2 + 1 << 2) >> 2] | 0;
                    w2 = x2 >> 1;
                    x2 = (d[(c[m2 >> 2] | 0) + w2 >> 0] | 0) ^ x2 & 1;
                    z2 = a[528] | 0;
                    y2 = z2 & 255;
                    if (((x2 & 255) << 24 >> 24 == z2 << 24 >> 24 & (y2 >>> 1 ^ 1) | y2 & 2 & x2 | 0) != 0 ? (z2 = c[(c[o2 >> 2] | 0) + (w2 << 3) >> 2] | 0, (z2 | 0) != -1 & (z2 | 0) == (u2 | 0)) : 0) {
                      j2 = 9;
                      break;
                    }
                    if ((q2 | 0) >= ((p2 | 0) / 2 | 0 | 0) ? !(+g[r2 + (s2 >>> 5 << 2) + 4 >> 2] < n2) : 0) {
                      j2 = 9;
                      break;
                    }
                    Pb(b2, u2);
                  } else
                    j2 = 9;
                while (0);
                if ((j2 | 0) == 9) {
                  j2 = 0;
                  c[t2 + (v2 << 2) >> 2] = u2;
                  v2 = v2 + 1 | 0;
                }
                q2 = q2 + 1 | 0;
                p2 = c[e2 >> 2] | 0;
              } while ((q2 | 0) < (p2 | 0));
            } else {
              q2 = 0;
              v2 = 0;
            }
            j2 = q2 - v2 | 0;
            if ((j2 | 0) > 0)
              c[e2 >> 2] = p2 - j2;
            if (!(+((c[b2 + 556 >> 2] | 0) >>> 0) > +h[b2 + 96 >> 3] * +((c[b2 + 548 >> 2] | 0) >>> 0))) {
              i2 = f2;
              return;
            }
            gb[c[(c[b2 >> 2] | 0) + 8 >> 2] & 31](b2);
            i2 = f2;
            return;
          }
          function Xb(b2, e2) {
            b2 = b2 | 0;
            e2 = e2 | 0;
            var f2 = 0, g2 = 0, h2 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, n2 = 0, o2 = 0, p2 = 0, q2 = 0, r2 = 0, s2 = 0, t2 = 0, u2 = 0, v2 = 0, w2 = 0, x2 = 0;
            f2 = i2;
            g2 = e2 + 4 | 0;
            m2 = c[g2 >> 2] | 0;
            if ((m2 | 0) > 0) {
              j2 = b2 + 544 | 0;
              h2 = b2 + 332 | 0;
              k2 = 0;
              l2 = 0;
              do {
                u2 = c[e2 >> 2] | 0;
                p2 = c[u2 + (k2 << 2) >> 2] | 0;
                m2 = (c[j2 >> 2] | 0) + (p2 << 2) | 0;
                o2 = c[m2 >> 2] | 0;
                do
                  if (o2 >>> 0 > 31) {
                    v2 = c[h2 >> 2] | 0;
                    r2 = a[528] | 0;
                    q2 = r2 & 255;
                    w2 = q2 & 2;
                    q2 = q2 >>> 1 ^ 1;
                    s2 = o2 >>> 5;
                    t2 = 0;
                    do {
                      x2 = c[m2 + (t2 << 2) + 4 >> 2] | 0;
                      x2 = (d[v2 + (x2 >> 1) >> 0] | 0) ^ x2 & 1;
                      t2 = t2 + 1 | 0;
                      if ((x2 & 255) << 24 >> 24 == r2 << 24 >> 24 & q2 | w2 & x2) {
                        n2 = 7;
                        break;
                      }
                    } while ((t2 | 0) < (s2 | 0));
                    if ((n2 | 0) == 7) {
                      n2 = 0;
                      Pb(b2, p2);
                      break;
                    }
                    if (o2 >>> 0 > 95) {
                      n2 = a[536] | 0;
                      q2 = o2 >>> 5;
                      p2 = 2;
                      do {
                        r2 = m2 + (p2 << 2) + 4 | 0;
                        x2 = c[r2 >> 2] | 0;
                        x2 = (d[(c[h2 >> 2] | 0) + (x2 >> 1) >> 0] | 0) ^ x2 & 1;
                        w2 = n2 & 255;
                        if ((x2 & 255) << 24 >> 24 == n2 << 24 >> 24 & (w2 >>> 1 ^ 1) | w2 & 2 & x2) {
                          c[r2 >> 2] = c[m2 + (q2 + -1 << 2) + 4 >> 2];
                          o2 = c[m2 >> 2] | 0;
                          if (o2 & 8) {
                            o2 = o2 >>> 5;
                            c[m2 + (o2 + -1 << 2) + 4 >> 2] = c[m2 + (o2 << 2) + 4 >> 2];
                            o2 = c[m2 >> 2] | 0;
                          }
                          o2 = o2 + -32 | 0;
                          c[m2 >> 2] = o2;
                          p2 = p2 + -1 | 0;
                        }
                        p2 = p2 + 1 | 0;
                        q2 = o2 >>> 5;
                      } while ((p2 | 0) < (q2 | 0));
                      p2 = c[e2 >> 2] | 0;
                      u2 = p2;
                      p2 = c[p2 + (k2 << 2) >> 2] | 0;
                      n2 = 16;
                    } else
                      n2 = 16;
                  } else
                    n2 = 16;
                while (0);
                if ((n2 | 0) == 16) {
                  n2 = 0;
                  c[u2 + (l2 << 2) >> 2] = p2;
                  l2 = l2 + 1 | 0;
                }
                k2 = k2 + 1 | 0;
                m2 = c[g2 >> 2] | 0;
              } while ((k2 | 0) < (m2 | 0));
            } else {
              k2 = 0;
              l2 = 0;
            }
            e2 = k2 - l2 | 0;
            if ((e2 | 0) <= 0) {
              i2 = f2;
              return;
            }
            c[g2 >> 2] = m2 - e2;
            i2 = f2;
            return;
          }
          function Yb(b2) {
            b2 = b2 | 0;
            var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h2 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, n2 = 0, o2 = 0, p2 = 0, q2 = 0;
            g2 = i2;
            i2 = i2 + 16 | 0;
            e2 = g2 + 4 | 0;
            h2 = g2;
            c[e2 >> 2] = 0;
            d2 = e2 + 4 | 0;
            c[d2 >> 2] = 0;
            f2 = e2 + 8 | 0;
            c[f2 >> 2] = 0;
            c[h2 >> 2] = 0;
            j2 = b2 + 540 | 0;
            n2 = c[j2 >> 2] | 0;
            if ((n2 | 0) > 0) {
              l2 = b2 + 380 | 0;
              k2 = b2 + 332 | 0;
              m2 = 0;
              do {
                if ((a[(c[l2 >> 2] | 0) + m2 >> 0] | 0) != 0 ? (p2 = a[(c[k2 >> 2] | 0) + m2 >> 0] | 0, q2 = a[544] | 0, o2 = q2 & 255, ((o2 >>> 1 ^ 1) & p2 << 24 >> 24 == q2 << 24 >> 24 | p2 & 2 & o2 | 0) != 0) : 0) {
                  nc(e2, h2);
                  n2 = c[j2 >> 2] | 0;
                }
                m2 = m2 + 1 | 0;
                c[h2 >> 2] = m2;
              } while ((m2 | 0) < (n2 | 0));
            }
            uc(b2 + 460 | 0, e2);
            b2 = c[e2 >> 2] | 0;
            if (!b2) {
              i2 = g2;
              return;
            }
            c[d2 >> 2] = 0;
            Td(b2);
            c[e2 >> 2] = 0;
            c[f2 >> 2] = 0;
            i2 = g2;
            return;
          }
          function Zb(b2) {
            b2 = b2 | 0;
            var d2 = 0, e2 = 0, f2 = 0, g2 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, n2 = 0, o2 = 0, p2 = 0, q2 = 0, r2 = 0, s2 = 0;
            d2 = i2;
            f2 = b2 + 492 | 0;
            if ((a[f2 >> 0] | 0) != 0 ? (Mb(b2) | 0) == -1 : 0) {
              f2 = b2 + 284 | 0;
              g2 = b2 + 516 | 0;
              if ((c[f2 >> 2] | 0) == (c[g2 >> 2] | 0)) {
                s2 = 1;
                i2 = d2;
                return s2 | 0;
              }
              j2 = b2 + 520 | 0;
              s2 = j2;
              r2 = c[s2 + 4 >> 2] | 0;
              if ((r2 | 0) > 0 | (r2 | 0) == 0 & (c[s2 >> 2] | 0) >>> 0 > 0) {
                s2 = 1;
                i2 = d2;
                return s2 | 0;
              }
              Xb(b2, b2 + 268 | 0);
              if (a[b2 + 536 >> 0] | 0) {
                Xb(b2, b2 + 256 | 0);
                l2 = b2 + 564 | 0;
                k2 = b2 + 568 | 0;
                if ((c[k2 >> 2] | 0) > 0) {
                  n2 = b2 + 588 | 0;
                  m2 = 0;
                  do {
                    a[(c[n2 >> 2] | 0) + (c[(c[l2 >> 2] | 0) + (m2 << 2) >> 2] | 0) >> 0] = 1;
                    m2 = m2 + 1 | 0;
                  } while ((m2 | 0) < (c[k2 >> 2] | 0));
                }
                p2 = c[f2 >> 2] | 0;
                if ((p2 | 0) > 0) {
                  m2 = c[b2 + 280 >> 2] | 0;
                  n2 = c[b2 + 588 >> 2] | 0;
                  q2 = 0;
                  o2 = 0;
                  do {
                    r2 = c[m2 + (q2 << 2) >> 2] | 0;
                    if (!(a[n2 + (r2 >> 1) >> 0] | 0)) {
                      c[m2 + (o2 << 2) >> 2] = r2;
                      p2 = c[f2 >> 2] | 0;
                      o2 = o2 + 1 | 0;
                    }
                    q2 = q2 + 1 | 0;
                  } while ((q2 | 0) < (p2 | 0));
                } else {
                  q2 = 0;
                  o2 = 0;
                }
                m2 = q2 - o2 | 0;
                if ((m2 | 0) > 0) {
                  p2 = p2 - m2 | 0;
                  c[f2 >> 2] = p2;
                }
                c[b2 + 512 >> 2] = p2;
                a:
                  do
                    if ((c[k2 >> 2] | 0) > 0) {
                      o2 = b2 + 588 | 0;
                      m2 = 0;
                      do {
                        a[(c[o2 >> 2] | 0) + (c[(c[l2 >> 2] | 0) + (m2 << 2) >> 2] | 0) >> 0] = 0;
                        m2 = m2 + 1 | 0;
                        n2 = c[k2 >> 2] | 0;
                      } while ((m2 | 0) < (n2 | 0));
                      if ((n2 | 0) > 0) {
                        n2 = b2 + 580 | 0;
                        o2 = b2 + 584 | 0;
                        m2 = b2 + 576 | 0;
                        p2 = 0;
                        while (1) {
                          r2 = c[n2 >> 2] | 0;
                          if ((r2 | 0) == (c[o2 >> 2] | 0)) {
                            q2 = (r2 >> 1) + 2 & -2;
                            q2 = (q2 | 0) < 2 ? 2 : q2;
                            if ((q2 | 0) > (2147483647 - r2 | 0)) {
                              e2 = 28;
                              break;
                            }
                            s2 = c[m2 >> 2] | 0;
                            q2 = q2 + r2 | 0;
                            c[o2 >> 2] = q2;
                            q2 = Ud(s2, q2 << 2) | 0;
                            c[m2 >> 2] = q2;
                            if ((q2 | 0) == 0 ? (c[(Oa() | 0) >> 2] | 0) == 12 : 0) {
                              e2 = 28;
                              break;
                            }
                            r2 = c[n2 >> 2] | 0;
                          } else
                            q2 = c[m2 >> 2] | 0;
                          s2 = q2 + (r2 << 2) | 0;
                          if (s2) {
                            c[s2 >> 2] = 0;
                            r2 = c[n2 >> 2] | 0;
                          }
                          c[n2 >> 2] = r2 + 1;
                          s2 = c[l2 >> 2] | 0;
                          c[q2 + (r2 << 2) >> 2] = c[s2 + (p2 << 2) >> 2];
                          p2 = p2 + 1 | 0;
                          if ((p2 | 0) >= (c[k2 >> 2] | 0))
                            break a;
                        }
                        if ((e2 | 0) == 28)
                          Ta(va(1) | 0, 48, 0);
                      } else
                        e2 = 21;
                    } else
                      e2 = 21;
                  while (0);
                if ((e2 | 0) == 21)
                  s2 = c[l2 >> 2] | 0;
                if (s2)
                  c[k2 >> 2] = 0;
              }
              if (+((c[b2 + 556 >> 2] | 0) >>> 0) > +h[b2 + 96 >> 3] * +((c[b2 + 548 >> 2] | 0) >>> 0))
                gb[c[(c[b2 >> 2] | 0) + 8 >> 2] & 31](b2);
              Yb(b2);
              c[g2 >> 2] = c[f2 >> 2];
              r2 = b2 + 224 | 0;
              s2 = b2 + 232 | 0;
              r2 = ne(c[s2 >> 2] | 0, c[s2 + 4 >> 2] | 0, c[r2 >> 2] | 0, c[r2 + 4 >> 2] | 0) | 0;
              s2 = j2;
              c[s2 >> 2] = r2;
              c[s2 + 4 >> 2] = F;
              s2 = 1;
              i2 = d2;
              return s2 | 0;
            }
            a[f2 >> 0] = 0;
            s2 = 0;
            i2 = d2;
            return s2 | 0;
          }
          function _b(b2, e2, f2) {
            b2 = b2 | 0;
            e2 = e2 | 0;
            f2 = f2 | 0;
            var j2 = 0, l2 = 0, m2 = 0, n2 = 0, o2 = 0, p2 = 0, q2 = 0, r2 = 0, s2 = 0, t2 = 0, u2 = 0, v2 = 0, w2 = 0, x2 = 0, y2 = 0, z2 = 0, A2 = 0, B2 = 0, C2 = 0, D2 = 0, E2 = 0, G2 = 0, H2 = 0, I2 = 0, J2 = 0, K2 = 0, L2 = 0, M2 = 0, N2 = 0, O2 = 0, P2 = 0, Q2 = 0, R2 = 0, T2 = 0, U2 = 0, V2 = 0, W2 = 0, X2 = 0, Y2 = 0, Z2 = 0, _4 = 0, $2 = 0, aa2 = 0, ba2 = 0, ca2 = 0, da2 = 0, ea2 = 0, fa2 = 0, ga2 = 0, ha2 = 0, ia2 = 0, ja2 = 0, ka2 = 0, la2 = 0, ma2 = 0, na2 = 0, oa2 = 0, pa2 = 0, qa2 = 0, ra2 = 0, sa2 = 0, ta2 = 0;
            n2 = i2;
            i2 = i2 + 64 | 0;
            _4 = n2;
            G2 = n2 + 60 | 0;
            B2 = n2 + 56 | 0;
            j2 = n2 + 44 | 0;
            $2 = n2 + 40 | 0;
            c[j2 >> 2] = 0;
            m2 = j2 + 4 | 0;
            c[m2 >> 2] = 0;
            l2 = j2 + 8 | 0;
            c[l2 >> 2] = 0;
            N2 = e2 + 160 | 0;
            M2 = N2;
            M2 = ne(c[M2 >> 2] | 0, c[M2 + 4 >> 2] | 0, 1, 0) | 0;
            c[N2 >> 2] = M2;
            c[N2 + 4 >> 2] = F;
            N2 = (f2 | 0) < 0;
            M2 = e2 + 680 | 0;
            L2 = e2 + 664 | 0;
            K2 = e2 + 672 | 0;
            q2 = e2 + 296 | 0;
            w2 = e2 + 272 | 0;
            o2 = e2 + 284 | 0;
            I2 = e2 + 640 | 0;
            E2 = e2 + 308 | 0;
            D2 = e2 + 304 | 0;
            r2 = e2 + 332 | 0;
            H2 = e2 + 292 | 0;
            ba2 = e2 + 168 | 0;
            t2 = e2 + 396 | 0;
            v2 = e2 + 280 | 0;
            J2 = e2 + 184 | 0;
            C2 = e2 + 192 | 0;
            u2 = e2 + 48 | 0;
            U2 = e2 + 504 | 0;
            Y2 = e2 + 56 | 0;
            aa2 = e2 + 496 | 0;
            ca2 = e2 + 656 | 0;
            O2 = e2 + 144 | 0;
            P2 = e2 + 648 | 0;
            Q2 = e2 + 128 | 0;
            R2 = e2 + 44 | 0;
            T2 = e2 + 200 | 0;
            V2 = e2 + 208 | 0;
            W2 = e2 + 224 | 0;
            X2 = e2 + 216 | 0;
            s2 = e2 + 232 | 0;
            Z2 = e2 + 540 | 0;
            p2 = e2 + 292 | 0;
            x2 = e2 + 544 | 0;
            z2 = e2 + 276 | 0;
            y2 = e2 + 268 | 0;
            A2 = e2 + 268 | 0;
            da2 = 0;
            a:
              while (1) {
                ea2 = N2 | (da2 | 0) < (f2 | 0);
                while (1) {
                  ga2 = Mb(e2) | 0;
                  if ((ga2 | 0) != -1)
                    break;
                  if (!ea2) {
                    ga2 = 41;
                    break a;
                  }
                  if (a[M2 >> 0] | 0) {
                    ga2 = 41;
                    break a;
                  }
                  ga2 = L2;
                  ha2 = c[ga2 + 4 >> 2] | 0;
                  if ((ha2 | 0) >= 0 ? (sa2 = C2, ra2 = c[sa2 + 4 >> 2] | 0, !(ra2 >>> 0 < ha2 >>> 0 | ((ra2 | 0) == (ha2 | 0) ? (c[sa2 >> 2] | 0) >>> 0 < (c[ga2 >> 2] | 0) >>> 0 : 0))) : 0) {
                    ga2 = 41;
                    break a;
                  }
                  ga2 = K2;
                  ha2 = c[ga2 + 4 >> 2] | 0;
                  if ((ha2 | 0) >= 0 ? (sa2 = J2, ra2 = c[sa2 + 4 >> 2] | 0, !(ra2 >>> 0 < ha2 >>> 0 | ((ra2 | 0) == (ha2 | 0) ? (c[sa2 >> 2] | 0) >>> 0 < (c[ga2 >> 2] | 0) >>> 0 : 0))) : 0) {
                    ga2 = 41;
                    break a;
                  }
                  if ((c[q2 >> 2] | 0) == 0 ? !(Zb(e2) | 0) : 0) {
                    ga2 = 50;
                    break a;
                  }
                  if (+((c[w2 >> 2] | 0) - (c[o2 >> 2] | 0) | 0) >= +h[I2 >> 3])
                    Wb(e2);
                  while (1) {
                    ga2 = c[q2 >> 2] | 0;
                    if ((ga2 | 0) >= (c[E2 >> 2] | 0)) {
                      ga2 = 59;
                      break;
                    }
                    ka2 = c[(c[D2 >> 2] | 0) + (ga2 << 2) >> 2] | 0;
                    ha2 = d[(c[r2 >> 2] | 0) + (ka2 >> 1) >> 0] | 0;
                    sa2 = ha2 ^ ka2 & 1;
                    ia2 = sa2 & 255;
                    pa2 = a[528] | 0;
                    ra2 = pa2 & 255;
                    if (!(ia2 << 24 >> 24 == pa2 << 24 >> 24 & (ra2 >>> 1 ^ 1) | ra2 & 2 & sa2)) {
                      ga2 = 56;
                      break;
                    }
                    c[G2 >> 2] = c[o2 >> 2];
                    nc(H2, G2);
                  }
                  if ((ga2 | 0) == 56) {
                    ga2 = 0;
                    ra2 = a[536] | 0;
                    sa2 = ra2 & 255;
                    if ((sa2 >>> 1 ^ 1) & ia2 << 24 >> 24 == ra2 << 24 >> 24 | ha2 & 2 & sa2) {
                      ga2 = 57;
                      break a;
                    }
                    if ((ka2 | 0) == -2)
                      ga2 = 59;
                  }
                  if ((ga2 | 0) == 59) {
                    sa2 = ba2;
                    sa2 = ne(c[sa2 >> 2] | 0, c[sa2 + 4 >> 2] | 0, 1, 0) | 0;
                    ka2 = ba2;
                    c[ka2 >> 2] = sa2;
                    c[ka2 + 4 >> 2] = F;
                    ka2 = Sb(e2) | 0;
                    if ((ka2 | 0) == -2) {
                      ga2 = 60;
                      break a;
                    }
                  }
                  c[_4 >> 2] = c[o2 >> 2];
                  nc(H2, _4);
                  sa2 = ka2 >> 1;
                  a[(c[r2 >> 2] | 0) + sa2 >> 0] = (ka2 & 1 ^ 1) & 255 ^ 1;
                  ra2 = c[q2 >> 2] | 0;
                  sa2 = (c[t2 >> 2] | 0) + (sa2 << 3) | 0;
                  c[sa2 >> 2] = -1;
                  c[sa2 + 4 >> 2] = ra2;
                  sa2 = c[o2 >> 2] | 0;
                  c[o2 >> 2] = sa2 + 1;
                  c[(c[v2 >> 2] | 0) + (sa2 << 2) >> 2] = ka2;
                }
                ra2 = C2;
                ra2 = ne(c[ra2 >> 2] | 0, c[ra2 + 4 >> 2] | 0, 1, 0) | 0;
                sa2 = C2;
                c[sa2 >> 2] = ra2;
                c[sa2 + 4 >> 2] = F;
                da2 = da2 + 1 | 0;
                if (!(c[q2 >> 2] | 0)) {
                  ga2 = 5;
                  break;
                }
                if (c[j2 >> 2] | 0)
                  c[m2 >> 2] = 0;
                Tb(e2, ga2, j2, B2);
                Rb(e2, c[B2 >> 2] | 0);
                if ((c[m2 >> 2] | 0) == 1) {
                  ra2 = c[c[j2 >> 2] >> 2] | 0;
                  sa2 = ra2 >> 1;
                  a[(c[r2 >> 2] | 0) + sa2 >> 0] = (ra2 & 1 ^ 1) & 255 ^ 1;
                  pa2 = c[q2 >> 2] | 0;
                  sa2 = (c[t2 >> 2] | 0) + (sa2 << 3) | 0;
                  c[sa2 >> 2] = -1;
                  c[sa2 + 4 >> 2] = pa2;
                  sa2 = c[o2 >> 2] | 0;
                  c[o2 >> 2] = sa2 + 1;
                  c[(c[v2 >> 2] | 0) + (sa2 << 2) >> 2] = ra2;
                } else {
                  ea2 = pc(x2, j2, 1) | 0;
                  ga2 = c[w2 >> 2] | 0;
                  if ((ga2 | 0) == (c[z2 >> 2] | 0)) {
                    ha2 = (ga2 >> 1) + 2 & -2;
                    ha2 = (ha2 | 0) < 2 ? 2 : ha2;
                    if ((ha2 | 0) > (2147483647 - ga2 | 0)) {
                      ga2 = 14;
                      break;
                    }
                    ra2 = c[y2 >> 2] | 0;
                    sa2 = ha2 + ga2 | 0;
                    c[z2 >> 2] = sa2;
                    sa2 = Ud(ra2, sa2 << 2) | 0;
                    c[y2 >> 2] = sa2;
                    if ((sa2 | 0) == 0 ? (c[(Oa() | 0) >> 2] | 0) == 12 : 0) {
                      ga2 = 14;
                      break;
                    }
                    ga2 = c[w2 >> 2] | 0;
                  }
                  c[w2 >> 2] = ga2 + 1;
                  ga2 = (c[y2 >> 2] | 0) + (ga2 << 2) | 0;
                  if (ga2)
                    c[ga2 >> 2] = ea2;
                  Nb(e2, ea2);
                  ia2 = c[x2 >> 2] | 0;
                  sa2 = ia2 + (ea2 << 2) | 0;
                  fa2 = +h[aa2 >> 3];
                  sa2 = sa2 + ((c[sa2 >> 2] | 0) >>> 5 << 2) + 4 | 0;
                  ta2 = fa2 + +g[sa2 >> 2];
                  g[sa2 >> 2] = ta2;
                  if (ta2 > 1e20) {
                    ha2 = c[w2 >> 2] | 0;
                    if ((ha2 | 0) > 0) {
                      ga2 = c[A2 >> 2] | 0;
                      ka2 = 0;
                      do {
                        sa2 = ia2 + (c[ga2 + (ka2 << 2) >> 2] << 2) | 0;
                        sa2 = sa2 + ((c[sa2 >> 2] | 0) >>> 5 << 2) + 4 | 0;
                        g[sa2 >> 2] = +g[sa2 >> 2] * 1e-20;
                        ka2 = ka2 + 1 | 0;
                      } while ((ka2 | 0) != (ha2 | 0));
                    }
                    h[aa2 >> 3] = fa2 * 1e-20;
                  }
                  ra2 = c[c[j2 >> 2] >> 2] | 0;
                  sa2 = ra2 >> 1;
                  a[(c[r2 >> 2] | 0) + sa2 >> 0] = (ra2 & 1 ^ 1) & 255 ^ 1;
                  pa2 = c[q2 >> 2] | 0;
                  sa2 = (c[t2 >> 2] | 0) + (sa2 << 3) | 0;
                  c[sa2 >> 2] = ea2;
                  c[sa2 + 4 >> 2] = pa2;
                  sa2 = c[o2 >> 2] | 0;
                  c[o2 >> 2] = sa2 + 1;
                  c[(c[v2 >> 2] | 0) + (sa2 << 2) >> 2] = ra2;
                }
                h[U2 >> 3] = 1 / +h[u2 >> 3] * +h[U2 >> 3];
                h[aa2 >> 3] = 1 / +h[Y2 >> 3] * +h[aa2 >> 3];
                sa2 = (c[ca2 >> 2] | 0) + -1 | 0;
                c[ca2 >> 2] = sa2;
                if (sa2)
                  continue;
                fa2 = +h[O2 >> 3] * +h[P2 >> 3];
                h[P2 >> 3] = fa2;
                c[ca2 >> 2] = ~~fa2;
                fa2 = +h[Q2 >> 3] * +h[I2 >> 3];
                h[I2 >> 3] = fa2;
                if ((c[R2 >> 2] | 0) <= 0)
                  continue;
                ga2 = c[C2 >> 2] | 0;
                ea2 = c[T2 >> 2] | 0;
                oa2 = c[q2 >> 2] | 0;
                if (!oa2)
                  ha2 = o2;
                else
                  ha2 = c[p2 >> 2] | 0;
                ha2 = c[ha2 >> 2] | 0;
                na2 = c[V2 >> 2] | 0;
                ma2 = c[W2 >> 2] | 0;
                la2 = c[X2 >> 2] | 0;
                ka2 = s2;
                ia2 = c[ka2 >> 2] | 0;
                ka2 = c[ka2 + 4 >> 2] | 0;
                ja2 = +(c[Z2 >> 2] | 0);
                qa2 = 1 / ja2;
                if ((oa2 | 0) < 0)
                  ta2 = 0;
                else {
                  pa2 = 0;
                  ta2 = 0;
                  while (1) {
                    if (!pa2)
                      ra2 = 0;
                    else
                      ra2 = c[(c[p2 >> 2] | 0) + (pa2 + -1 << 2) >> 2] | 0;
                    if ((pa2 | 0) == (oa2 | 0))
                      sa2 = o2;
                    else
                      sa2 = (c[p2 >> 2] | 0) + (pa2 << 2) | 0;
                    ta2 = ta2 + +S(+qa2, + +(pa2 | 0)) * +((c[sa2 >> 2] | 0) - ra2 | 0);
                    if ((pa2 | 0) == (oa2 | 0))
                      break;
                    else
                      pa2 = pa2 + 1 | 0;
                  }
                }
                c[_4 >> 2] = ga2;
                c[_4 + 4 >> 2] = ea2 - ha2;
                c[_4 + 8 >> 2] = na2;
                c[_4 + 12 >> 2] = ma2;
                c[_4 + 16 >> 2] = ~~fa2;
                c[_4 + 20 >> 2] = la2;
                sa2 = _4 + 24 | 0;
                h[k >> 3] = (+(ia2 >>> 0) + 4294967296 * +(ka2 >>> 0)) / +(la2 | 0);
                c[sa2 >> 2] = c[k >> 2];
                c[sa2 + 4 >> 2] = c[k + 4 >> 2];
                sa2 = _4 + 32 | 0;
                h[k >> 3] = ta2 / ja2 * 100;
                c[sa2 >> 2] = c[k >> 2];
                c[sa2 + 4 >> 2] = c[k + 4 >> 2];
                La(1832, _4 | 0) | 0;
              }
            if ((ga2 | 0) == 5)
              a[b2 >> 0] = a[536] | 0;
            else if ((ga2 | 0) == 14)
              Ta(va(1) | 0, 48, 0);
            else if ((ga2 | 0) == 41) {
              fa2 = +(c[Z2 >> 2] | 0);
              ja2 = 1 / fa2;
              r2 = c[q2 >> 2] | 0;
              if ((r2 | 0) < 0)
                qa2 = 0;
              else {
                q2 = 0;
                qa2 = 0;
                while (1) {
                  if (!q2)
                    s2 = 0;
                  else
                    s2 = c[(c[p2 >> 2] | 0) + (q2 + -1 << 2) >> 2] | 0;
                  if ((q2 | 0) == (r2 | 0))
                    t2 = o2;
                  else
                    t2 = (c[p2 >> 2] | 0) + (q2 << 2) | 0;
                  qa2 = qa2 + +S(+ja2, + +(q2 | 0)) * +((c[t2 >> 2] | 0) - s2 | 0);
                  if ((q2 | 0) == (r2 | 0))
                    break;
                  else
                    q2 = q2 + 1 | 0;
                }
              }
              h[e2 + 528 >> 3] = qa2 / fa2;
              Rb(e2, 0);
              a[b2 >> 0] = a[544] | 0;
            } else if ((ga2 | 0) == 50)
              a[b2 >> 0] = a[536] | 0;
            else if ((ga2 | 0) == 57) {
              c[$2 >> 2] = ka2 ^ 1;
              sa2 = e2 + 16 | 0;
              c[_4 + 0 >> 2] = c[$2 + 0 >> 2];
              Vb(e2, _4, sa2);
              a[b2 >> 0] = a[536] | 0;
            } else if ((ga2 | 0) == 60)
              a[b2 >> 0] = a[528] | 0;
            b2 = c[j2 >> 2] | 0;
            if (!b2) {
              i2 = n2;
              return;
            }
            c[m2 >> 2] = 0;
            Td(b2);
            c[j2 >> 2] = 0;
            c[l2 >> 2] = 0;
            i2 = n2;
            return;
          }
          function $b(b2, d2) {
            b2 = b2 | 0;
            d2 = d2 | 0;
            var e2 = 0, f2 = 0, g2 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, n2 = 0, o2 = 0, p2 = 0, q2 = 0, r2 = 0, s2 = 0, t2 = 0, u2 = 0, v2 = 0, w2 = 0, x2 = 0, y2 = 0, z2 = 0, A2 = 0, B2 = 0;
            f2 = i2;
            i2 = i2 + 16 | 0;
            j2 = f2;
            e2 = d2 + 4 | 0;
            if (c[e2 >> 2] | 0)
              c[d2 + 8 >> 2] = 0;
            g2 = d2 + 36 | 0;
            k2 = d2 + 32 | 0;
            if ((c[g2 >> 2] | 0) > 0) {
              l2 = d2 + 16 | 0;
              m2 = 0;
              do {
                a[(c[l2 >> 2] | 0) + (c[(c[k2 >> 2] | 0) + (m2 << 2) >> 2] | 0) >> 0] = 0;
                m2 = m2 + 1 | 0;
              } while ((m2 | 0) < (c[g2 >> 2] | 0));
            }
            if (c[k2 >> 2] | 0)
              c[g2 >> 2] = 0;
            k2 = d2 + 492 | 0;
            if (!(a[k2 >> 0] | 0)) {
              a[b2 >> 0] = a[536] | 0;
              i2 = f2;
              return;
            }
            l2 = d2 + 152 | 0;
            y2 = l2;
            y2 = ne(c[y2 >> 2] | 0, c[y2 + 4 >> 2] | 0, 1, 0) | 0;
            c[l2 >> 2] = y2;
            c[l2 + 4 >> 2] = F;
            z2 = +h[d2 + 120 >> 3] * +(c[d2 + 208 >> 2] | 0);
            l2 = d2 + 640 | 0;
            h[l2 >> 3] = z2;
            v2 = +(c[d2 + 104 >> 2] | 0);
            if (z2 < v2)
              h[l2 >> 3] = v2;
            w2 = c[d2 + 136 >> 2] | 0;
            h[d2 + 648 >> 3] = +(w2 | 0);
            c[d2 + 656 >> 2] = w2;
            w2 = a[544] | 0;
            l2 = d2 + 44 | 0;
            if ((c[l2 >> 2] | 0) > 0) {
              Ka(2288) | 0;
              Ka(2368) | 0;
              Ka(2448) | 0;
              Ka(2528) | 0;
              o2 = a[544] | 0;
            } else
              o2 = w2;
            n2 = d2 + 192 | 0;
            m2 = d2 + 184 | 0;
            y2 = o2 & 255;
            a:
              do
                if ((y2 >>> 1 ^ 1) & w2 << 24 >> 24 == o2 << 24 >> 24 | w2 & 2 & y2) {
                  q2 = d2 + 80 | 0;
                  t2 = d2 + 112 | 0;
                  p2 = d2 + 108 | 0;
                  o2 = d2 + 680 | 0;
                  r2 = d2 + 664 | 0;
                  s2 = d2 + 672 | 0;
                  u2 = 0;
                  while (1) {
                    v2 = +h[t2 >> 3];
                    if (!(a[q2 >> 0] | 0))
                      v2 = +S(+v2, + +(u2 | 0));
                    else {
                      y2 = u2 + 1 | 0;
                      if ((u2 | 0) > 0) {
                        x2 = 0;
                        w2 = 1;
                        do {
                          x2 = x2 + 1 | 0;
                          w2 = w2 << 1 | 1;
                        } while ((w2 | 0) < (y2 | 0));
                        y2 = w2 + -1 | 0;
                      } else {
                        x2 = 0;
                        y2 = 0;
                      }
                      if ((y2 | 0) != (u2 | 0)) {
                        w2 = u2;
                        do {
                          A2 = y2 >> 1;
                          x2 = x2 + -1 | 0;
                          w2 = (w2 | 0) % (A2 | 0) | 0;
                          y2 = A2 + -1 | 0;
                        } while ((y2 | 0) != (w2 | 0));
                      }
                      v2 = +S(+v2, + +(x2 | 0));
                    }
                    _b(j2, d2, ~~(v2 * +(c[p2 >> 2] | 0)));
                    w2 = a[j2 >> 0] | 0;
                    if (a[o2 >> 0] | 0)
                      break a;
                    y2 = r2;
                    x2 = c[y2 + 4 >> 2] | 0;
                    if ((x2 | 0) >= 0 ? (A2 = n2, B2 = c[A2 + 4 >> 2] | 0, !(B2 >>> 0 < x2 >>> 0 | ((B2 | 0) == (x2 | 0) ? (c[A2 >> 2] | 0) >>> 0 < (c[y2 >> 2] | 0) >>> 0 : 0))) : 0)
                      break a;
                    y2 = s2;
                    x2 = c[y2 + 4 >> 2] | 0;
                    if ((x2 | 0) >= 0 ? (B2 = m2, A2 = c[B2 + 4 >> 2] | 0, !(A2 >>> 0 < x2 >>> 0 | ((A2 | 0) == (x2 | 0) ? (c[B2 >> 2] | 0) >>> 0 < (c[y2 >> 2] | 0) >>> 0 : 0))) : 0)
                      break a;
                    A2 = a[544] | 0;
                    B2 = A2 & 255;
                    if (!((B2 >>> 1 ^ 1) & w2 << 24 >> 24 == A2 << 24 >> 24 | w2 & 2 & B2))
                      break;
                    else
                      u2 = u2 + 1 | 0;
                  }
                }
              while (0);
            if ((c[l2 >> 2] | 0) > 0)
              Ka(2528) | 0;
            A2 = a[528] | 0;
            B2 = A2 & 255;
            j2 = w2 & 2;
            if (!((B2 >>> 1 ^ 1) & w2 << 24 >> 24 == A2 << 24 >> 24 | j2 & B2)) {
              A2 = a[536] | 0;
              B2 = A2 & 255;
              if (((B2 >>> 1 ^ 1) & w2 << 24 >> 24 == A2 << 24 >> 24 | j2 & B2 | 0) != 0 ? (c[g2 >> 2] | 0) == 0 : 0)
                a[k2 >> 0] = 0;
            } else {
              g2 = d2 + 540 | 0;
              jc(e2, c[g2 >> 2] | 0);
              if ((c[g2 >> 2] | 0) > 0) {
                j2 = d2 + 332 | 0;
                k2 = 0;
                do {
                  a[(c[e2 >> 2] | 0) + k2 >> 0] = a[(c[j2 >> 2] | 0) + k2 >> 0] | 0;
                  k2 = k2 + 1 | 0;
                } while ((k2 | 0) < (c[g2 >> 2] | 0));
              }
            }
            Rb(d2, 0);
            a[b2 >> 0] = w2;
            i2 = f2;
            return;
          }
          function ac(b2, e2) {
            b2 = b2 | 0;
            e2 = e2 | 0;
            var f2 = 0, g2 = 0, h2 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, n2 = 0, o2 = 0, p2 = 0, q2 = 0, r2 = 0, s2 = 0, t2 = 0, u2 = 0, v2 = 0, w2 = 0;
            f2 = i2;
            h2 = b2 + 412 | 0;
            vc(h2);
            k2 = b2 + 540 | 0;
            if ((c[k2 >> 2] | 0) > 0) {
              j2 = b2 + 544 | 0;
              g2 = 0;
              do {
                l2 = g2 << 1;
                n2 = c[h2 >> 2] | 0;
                m2 = n2 + (l2 * 12 | 0) + 4 | 0;
                if ((c[m2 >> 2] | 0) > 0) {
                  p2 = n2 + (l2 * 12 | 0) | 0;
                  o2 = 0;
                  do {
                    s2 = (c[p2 >> 2] | 0) + (o2 << 3) | 0;
                    n2 = c[s2 >> 2] | 0;
                    q2 = c[j2 >> 2] | 0;
                    r2 = q2 + (n2 << 2) | 0;
                    if (!(c[r2 >> 2] & 16)) {
                      t2 = wc(e2, r2) | 0;
                      c[s2 >> 2] = t2;
                      c[r2 >> 2] = c[r2 >> 2] | 16;
                      c[q2 + (n2 + 1 << 2) >> 2] = t2;
                    } else
                      c[s2 >> 2] = c[q2 + (n2 + 1 << 2) >> 2];
                    o2 = o2 + 1 | 0;
                  } while ((o2 | 0) < (c[m2 >> 2] | 0));
                  m2 = c[h2 >> 2] | 0;
                } else
                  m2 = n2;
                n2 = l2 | 1;
                l2 = m2 + (n2 * 12 | 0) + 4 | 0;
                if ((c[l2 >> 2] | 0) > 0) {
                  r2 = m2 + (n2 * 12 | 0) | 0;
                  q2 = 0;
                  do {
                    m2 = (c[r2 >> 2] | 0) + (q2 << 3) | 0;
                    p2 = c[m2 >> 2] | 0;
                    o2 = c[j2 >> 2] | 0;
                    n2 = o2 + (p2 << 2) | 0;
                    if (!(c[n2 >> 2] & 16)) {
                      t2 = wc(e2, n2) | 0;
                      c[m2 >> 2] = t2;
                      c[n2 >> 2] = c[n2 >> 2] | 16;
                      c[o2 + (p2 + 1 << 2) >> 2] = t2;
                    } else
                      c[m2 >> 2] = c[o2 + (p2 + 1 << 2) >> 2];
                    q2 = q2 + 1 | 0;
                  } while ((q2 | 0) < (c[l2 >> 2] | 0));
                }
                g2 = g2 + 1 | 0;
              } while ((g2 | 0) < (c[k2 >> 2] | 0));
            }
            g2 = b2 + 284 | 0;
            if ((c[g2 >> 2] | 0) > 0) {
              l2 = b2 + 280 | 0;
              k2 = b2 + 396 | 0;
              j2 = b2 + 544 | 0;
              h2 = b2 + 332 | 0;
              m2 = 0;
              do {
                r2 = c[k2 >> 2] | 0;
                p2 = r2 + (c[(c[l2 >> 2] | 0) + (m2 << 2) >> 2] >> 1 << 3) | 0;
                q2 = c[p2 >> 2] | 0;
                do
                  if ((q2 | 0) != -1) {
                    t2 = c[j2 >> 2] | 0;
                    s2 = t2 + (q2 << 2) | 0;
                    o2 = (c[s2 >> 2] & 16 | 0) == 0;
                    if (o2) {
                      u2 = c[t2 + (q2 + 1 << 2) >> 2] | 0;
                      n2 = u2 >> 1;
                      u2 = (d[(c[h2 >> 2] | 0) + n2 >> 0] | 0) ^ u2 & 1;
                      w2 = a[528] | 0;
                      v2 = w2 & 255;
                      if (!((u2 & 255) << 24 >> 24 == w2 << 24 >> 24 & (v2 >>> 1 ^ 1) | v2 & 2 & u2))
                        break;
                      w2 = c[r2 + (n2 << 3) >> 2] | 0;
                      if (!((w2 | 0) != -1 & (w2 | 0) == (q2 | 0)))
                        break;
                      if (o2) {
                        w2 = wc(e2, s2) | 0;
                        c[p2 >> 2] = w2;
                        c[s2 >> 2] = c[s2 >> 2] | 16;
                        c[t2 + (q2 + 1 << 2) >> 2] = w2;
                        break;
                      }
                    }
                    c[p2 >> 2] = c[t2 + (q2 + 1 << 2) >> 2];
                  }
                while (0);
                m2 = m2 + 1 | 0;
              } while ((m2 | 0) < (c[g2 >> 2] | 0));
            }
            g2 = b2 + 272 | 0;
            n2 = c[g2 >> 2] | 0;
            if ((n2 | 0) > 0) {
              j2 = b2 + 268 | 0;
              h2 = b2 + 544 | 0;
              m2 = c[j2 >> 2] | 0;
              k2 = 0;
              l2 = 0;
              do {
                p2 = m2 + (k2 << 2) | 0;
                o2 = c[p2 >> 2] | 0;
                r2 = c[h2 >> 2] | 0;
                q2 = r2 + (o2 << 2) | 0;
                s2 = c[q2 >> 2] | 0;
                if ((s2 & 3 | 0) != 1) {
                  if (!(s2 & 16)) {
                    n2 = wc(e2, q2) | 0;
                    c[p2 >> 2] = n2;
                    c[q2 >> 2] = c[q2 >> 2] | 16;
                    c[r2 + (o2 + 1 << 2) >> 2] = n2;
                    n2 = c[j2 >> 2] | 0;
                    m2 = n2;
                    n2 = c[n2 + (k2 << 2) >> 2] | 0;
                  } else {
                    n2 = c[r2 + (o2 + 1 << 2) >> 2] | 0;
                    c[p2 >> 2] = n2;
                  }
                  c[m2 + (l2 << 2) >> 2] = n2;
                  n2 = c[g2 >> 2] | 0;
                  l2 = l2 + 1 | 0;
                }
                k2 = k2 + 1 | 0;
              } while ((k2 | 0) < (n2 | 0));
            } else {
              k2 = 0;
              l2 = 0;
            }
            h2 = k2 - l2 | 0;
            if ((h2 | 0) > 0)
              c[g2 >> 2] = n2 - h2;
            g2 = b2 + 260 | 0;
            m2 = c[g2 >> 2] | 0;
            if ((m2 | 0) > 0) {
              h2 = b2 + 256 | 0;
              b2 = b2 + 544 | 0;
              l2 = c[h2 >> 2] | 0;
              j2 = 0;
              k2 = 0;
              do {
                n2 = l2 + (j2 << 2) | 0;
                p2 = c[n2 >> 2] | 0;
                o2 = c[b2 >> 2] | 0;
                r2 = o2 + (p2 << 2) | 0;
                q2 = c[r2 >> 2] | 0;
                if ((q2 & 3 | 0) != 1) {
                  if (!(q2 & 16)) {
                    m2 = wc(e2, r2) | 0;
                    c[n2 >> 2] = m2;
                    c[r2 >> 2] = c[r2 >> 2] | 16;
                    c[o2 + (p2 + 1 << 2) >> 2] = m2;
                    m2 = c[h2 >> 2] | 0;
                    l2 = m2;
                    m2 = c[m2 + (j2 << 2) >> 2] | 0;
                  } else {
                    m2 = c[o2 + (p2 + 1 << 2) >> 2] | 0;
                    c[n2 >> 2] = m2;
                  }
                  c[l2 + (k2 << 2) >> 2] = m2;
                  m2 = c[g2 >> 2] | 0;
                  k2 = k2 + 1 | 0;
                }
                j2 = j2 + 1 | 0;
              } while ((j2 | 0) < (m2 | 0));
            } else {
              j2 = 0;
              k2 = 0;
            }
            e2 = j2 - k2 | 0;
            if ((e2 | 0) <= 0) {
              i2 = f2;
              return;
            }
            c[g2 >> 2] = m2 - e2;
            i2 = f2;
            return;
          }
          function bc(b2) {
            b2 = b2 | 0;
            var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h2 = 0, j2 = 0, k2 = 0;
            g2 = i2;
            i2 = i2 + 32 | 0;
            j2 = g2;
            d2 = g2 + 8 | 0;
            e2 = b2 + 548 | 0;
            f2 = b2 + 556 | 0;
            h2 = (c[e2 >> 2] | 0) - (c[f2 >> 2] | 0) | 0;
            c[d2 + 0 >> 2] = 0;
            c[d2 + 4 >> 2] = 0;
            c[d2 + 8 >> 2] = 0;
            c[d2 + 12 >> 2] = 0;
            gc(d2, h2);
            h2 = d2 + 16 | 0;
            a[h2 >> 0] = 0;
            ac(b2, d2);
            if ((c[b2 + 44 >> 2] | 0) > 1) {
              k2 = c[d2 + 4 >> 2] << 2;
              c[j2 >> 2] = c[e2 >> 2] << 2;
              c[j2 + 4 >> 2] = k2;
              La(1888, j2 | 0) | 0;
            }
            a[b2 + 560 >> 0] = a[h2 >> 0] | 0;
            h2 = b2 + 544 | 0;
            j2 = c[h2 >> 2] | 0;
            if (j2)
              Td(j2);
            c[h2 >> 2] = c[d2 >> 2];
            c[e2 >> 2] = c[d2 + 4 >> 2];
            c[b2 + 552 >> 2] = c[d2 + 8 >> 2];
            c[f2 >> 2] = c[d2 + 12 >> 2];
            i2 = g2;
            return;
          }
          function cc() {
            var d2 = 0, e2 = 0, f2 = 0;
            d2 = i2;
            i2 = i2 + 16 | 0;
            e2 = d2;
            a[528] = 0;
            a[536] = 1;
            a[544] = 2;
            xb(552, 608, 624, 2136, 2144);
            c[138] = 2168;
            h[72] = 0;
            h[73] = 1;
            a[592] = 0;
            a[593] = 0;
            b[297] = b[e2 + 0 >> 1] | 0;
            b[298] = b[e2 + 2 >> 1] | 0;
            b[299] = b[e2 + 4 >> 1] | 0;
            h[75] = 0.95;
            xb(664, 720, 736, 2136, 2144);
            c[166] = 2168;
            h[86] = 0;
            h[87] = 1;
            a[704] = 0;
            a[705] = 0;
            b[353] = b[e2 + 0 >> 1] | 0;
            b[354] = b[e2 + 2 >> 1] | 0;
            b[355] = b[e2 + 4 >> 1] | 0;
            h[89] = 0.999;
            xb(776, 832, 848, 2136, 2144);
            c[194] = 2168;
            h[100] = 0;
            h[101] = 1;
            a[816] = 1;
            a[817] = 1;
            b[409] = b[e2 + 0 >> 1] | 0;
            b[410] = b[e2 + 2 >> 1] | 0;
            b[411] = b[e2 + 4 >> 1] | 0;
            h[103] = 0;
            xb(936, 992, 1008, 2136, 2144);
            c[234] = 2168;
            h[120] = 0;
            h[121] = v;
            a[976] = 0;
            a[977] = 0;
            b[489] = b[e2 + 0 >> 1] | 0;
            b[490] = b[e2 + 2 >> 1] | 0;
            b[491] = b[e2 + 4 >> 1] | 0;
            h[123] = 91648253;
            xb(1048, 1080, 1096, 2136, 2016);
            c[262] = 280;
            f2 = 1068 | 0;
            c[f2 >> 2] = 0;
            c[f2 + 4 >> 2] = 2;
            c[269] = 2;
            xb(1160, 1192, 1208, 2136, 2016);
            c[290] = 280;
            f2 = 1180 | 0;
            c[f2 >> 2] = 0;
            c[f2 + 4 >> 2] = 2;
            c[297] = 2;
            xb(1272, 1296, 1312, 2136, 1992);
            c[318] = 160;
            a[1292] = 0;
            xb(1344, 1368, 1376, 2136, 1992);
            c[336] = 160;
            a[1364] = 1;
            xb(1408, 1440, 1448, 2136, 2016);
            c[352] = 280;
            f2 = 1428 | 0;
            c[f2 >> 2] = 1;
            c[f2 + 4 >> 2] = 2147483647;
            c[359] = 100;
            xb(1480, 1536, 1544, 2136, 2144);
            c[370] = 2168;
            h[188] = 1;
            h[189] = v;
            a[1520] = 0;
            a[1521] = 0;
            b[761] = b[e2 + 0 >> 1] | 0;
            b[762] = b[e2 + 2 >> 1] | 0;
            b[763] = b[e2 + 4 >> 1] | 0;
            h[191] = 2;
            xb(1584, 1640, 1648, 2136, 2144);
            c[396] = 2168;
            h[201] = 0;
            h[202] = v;
            a[1624] = 0;
            a[1625] = 0;
            b[813] = b[e2 + 0 >> 1] | 0;
            b[814] = b[e2 + 2 >> 1] | 0;
            b[815] = b[e2 + 4 >> 1] | 0;
            h[204] = 0.2;
            xb(1728, 1760, 1776, 2136, 2016);
            c[432] = 280;
            e2 = 1748 | 0;
            c[e2 >> 2] = 0;
            c[e2 + 4 >> 2] = 2147483647;
            c[439] = 0;
            i2 = d2;
            return;
          }
          function dc(a2) {
            a2 = a2 | 0;
            var b2 = 0;
            b2 = i2;
            pd(a2);
            i2 = b2;
            return;
          }
          function ec(b2, d2) {
            b2 = b2 | 0;
            d2 = d2 | 0;
            var e2 = 0, f2 = 0, g2 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, n2 = 0, o2 = 0, q2 = 0, r2 = 0;
            e2 = i2;
            i2 = i2 + 16 | 0;
            j2 = e2;
            g2 = e2 + 8 | 0;
            if ((a[d2 >> 0] | 0) != 45) {
              o2 = 0;
              i2 = e2;
              return o2 | 0;
            }
            m2 = d2 + 1 | 0;
            f2 = b2 + 4 | 0;
            k2 = c[f2 >> 2] | 0;
            l2 = a[k2 >> 0] | 0;
            a:
              do
                if (l2 << 24 >> 24) {
                  n2 = 0;
                  while (1) {
                    o2 = n2;
                    n2 = n2 + 1 | 0;
                    if ((a[m2 >> 0] | 0) != l2 << 24 >> 24) {
                      b2 = 0;
                      break;
                    }
                    l2 = a[k2 + n2 >> 0] | 0;
                    m2 = d2 + (o2 + 2) | 0;
                    if (!(l2 << 24 >> 24))
                      break a;
                  }
                  i2 = e2;
                  return b2 | 0;
                }
              while (0);
            if ((a[m2 >> 0] | 0) != 61) {
              o2 = 0;
              i2 = e2;
              return o2 | 0;
            }
            k2 = m2 + 1 | 0;
            q2 = +ce(k2, g2);
            if (!(c[g2 >> 2] | 0)) {
              o2 = 0;
              i2 = e2;
              return o2 | 0;
            }
            r2 = +h[b2 + 32 >> 3];
            if (q2 >= r2 ? (a[b2 + 41 >> 0] | 0) == 0 | q2 != r2 : 0) {
              o2 = c[p >> 2] | 0;
              n2 = c[f2 >> 2] | 0;
              c[j2 >> 2] = k2;
              c[j2 + 4 >> 2] = n2;
              Za(o2 | 0, 2024, j2 | 0) | 0;
              ab(1);
            }
            r2 = +h[b2 + 24 >> 3];
            if (q2 <= r2 ? (a[b2 + 40 >> 0] | 0) == 0 | q2 != r2 : 0) {
              o2 = c[p >> 2] | 0;
              n2 = c[f2 >> 2] | 0;
              c[j2 >> 2] = k2;
              c[j2 + 4 >> 2] = n2;
              Za(o2 | 0, 2080, j2 | 0) | 0;
              ab(1);
            }
            h[b2 + 48 >> 3] = q2;
            o2 = 1;
            i2 = e2;
            return o2 | 0;
          }
          function fc(b2, d2) {
            b2 = b2 | 0;
            d2 = d2 | 0;
            var e2 = 0, f2 = 0, g2 = 0, j2 = 0, l2 = 0, m2 = 0, n2 = 0, o2 = 0, q2 = 0;
            e2 = i2;
            i2 = i2 + 48 | 0;
            f2 = e2;
            g2 = c[p >> 2] | 0;
            q2 = c[b2 + 16 >> 2] | 0;
            m2 = (a[b2 + 40 >> 0] | 0) != 0 ? 91 : 40;
            o2 = +h[b2 + 24 >> 3];
            n2 = +h[b2 + 32 >> 3];
            j2 = (a[b2 + 41 >> 0] | 0) != 0 ? 93 : 41;
            l2 = +h[b2 + 48 >> 3];
            c[f2 >> 2] = c[b2 + 4 >> 2];
            c[f2 + 4 >> 2] = q2;
            c[f2 + 8 >> 2] = m2;
            m2 = f2 + 12 | 0;
            h[k >> 3] = o2;
            c[m2 >> 2] = c[k >> 2];
            c[m2 + 4 >> 2] = c[k + 4 >> 2];
            m2 = f2 + 20 | 0;
            h[k >> 3] = n2;
            c[m2 >> 2] = c[k >> 2];
            c[m2 + 4 >> 2] = c[k + 4 >> 2];
            c[f2 + 28 >> 2] = j2;
            j2 = f2 + 32 | 0;
            h[k >> 3] = l2;
            c[j2 >> 2] = c[k >> 2];
            c[j2 + 4 >> 2] = c[k + 4 >> 2];
            Za(g2 | 0, 2232, f2 | 0) | 0;
            if (!d2) {
              i2 = e2;
              return;
            }
            c[f2 >> 2] = c[b2 + 8 >> 2];
            Za(g2 | 0, 2e3, f2 | 0) | 0;
            Sa(10, g2 | 0) | 0;
            i2 = e2;
            return;
          }
          function gc(a2, b2) {
            a2 = a2 | 0;
            b2 = b2 | 0;
            var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h2 = 0;
            d2 = i2;
            e2 = a2 + 8 | 0;
            f2 = c[e2 >> 2] | 0;
            if (f2 >>> 0 < b2 >>> 0)
              h2 = f2;
            else {
              i2 = d2;
              return;
            }
            while (1) {
              if (h2 >>> 0 >= b2 >>> 0)
                break;
              h2 = ((h2 >>> 3) + 2 + (h2 >>> 1) & -2) + h2 | 0;
              c[e2 >> 2] = h2;
              if (h2 >>> 0 <= f2 >>> 0) {
                g2 = 4;
                break;
              }
            }
            if ((g2 | 0) == 4)
              Ta(va(1) | 0, 48, 0);
            e2 = Ud(c[a2 >> 2] | 0, h2 << 2) | 0;
            if ((e2 | 0) == 0 ? (c[(Oa() | 0) >> 2] | 0) == 12 : 0)
              Ta(va(1) | 0, 48, 0);
            c[a2 >> 2] = e2;
            i2 = d2;
            return;
          }
          function hc(a2) {
            a2 = a2 | 0;
            var b2 = 0, d2 = 0, e2 = 0, f2 = 0, g2 = 0, h2 = 0, j2 = 0;
            b2 = i2;
            e2 = a2 + 32 | 0;
            d2 = c[e2 >> 2] | 0;
            if (d2) {
              c[a2 + 36 >> 2] = 0;
              Td(d2);
              c[e2 >> 2] = 0;
              c[a2 + 40 >> 2] = 0;
            }
            e2 = a2 + 16 | 0;
            d2 = c[e2 >> 2] | 0;
            if (d2) {
              c[a2 + 20 >> 2] = 0;
              Td(d2);
              c[e2 >> 2] = 0;
              c[a2 + 24 >> 2] = 0;
            }
            e2 = c[a2 >> 2] | 0;
            if (!e2) {
              i2 = b2;
              return;
            }
            d2 = a2 + 4 | 0;
            g2 = c[d2 >> 2] | 0;
            if ((g2 | 0) > 0) {
              f2 = 0;
              do {
                j2 = e2 + (f2 * 12 | 0) | 0;
                h2 = c[j2 >> 2] | 0;
                if (h2) {
                  c[e2 + (f2 * 12 | 0) + 4 >> 2] = 0;
                  Td(h2);
                  c[j2 >> 2] = 0;
                  c[e2 + (f2 * 12 | 0) + 8 >> 2] = 0;
                  e2 = c[a2 >> 2] | 0;
                  g2 = c[d2 >> 2] | 0;
                }
                f2 = f2 + 1 | 0;
              } while ((f2 | 0) < (g2 | 0));
            }
            c[d2 >> 2] = 0;
            Td(e2);
            c[a2 >> 2] = 0;
            c[a2 + 8 >> 2] = 0;
            i2 = b2;
            return;
          }
          function ic(a2, b2) {
            a2 = a2 | 0;
            b2 = b2 | 0;
            var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h2 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, n2 = 0;
            f2 = i2;
            i2 = i2 + 16 | 0;
            e2 = f2 + 4 | 0;
            d2 = f2;
            l2 = c[b2 >> 2] | 0;
            h2 = l2 + 1 | 0;
            g2 = a2 + 4 | 0;
            if ((c[g2 >> 2] | 0) < (h2 | 0)) {
              k2 = a2 + 8 | 0;
              j2 = c[k2 >> 2] | 0;
              if ((j2 | 0) < (h2 | 0)) {
                m2 = l2 + 2 - j2 & -2;
                l2 = (j2 >> 1) + 2 & -2;
                l2 = (m2 | 0) > (l2 | 0) ? m2 : l2;
                if ((l2 | 0) > (2147483647 - j2 | 0)) {
                  m2 = va(1) | 0;
                  Ta(m2 | 0, 48, 0);
                }
                n2 = c[a2 >> 2] | 0;
                m2 = l2 + j2 | 0;
                c[k2 >> 2] = m2;
                m2 = Ud(n2, m2 * 12 | 0) | 0;
                c[a2 >> 2] = m2;
                if ((m2 | 0) == 0 ? (c[(Oa() | 0) >> 2] | 0) == 12 : 0) {
                  n2 = va(1) | 0;
                  Ta(n2 | 0, 48, 0);
                }
              }
              k2 = c[g2 >> 2] | 0;
              if ((k2 | 0) < (h2 | 0)) {
                j2 = c[a2 >> 2] | 0;
                do {
                  l2 = j2 + (k2 * 12 | 0) | 0;
                  if (l2) {
                    c[l2 >> 2] = 0;
                    c[j2 + (k2 * 12 | 0) + 4 >> 2] = 0;
                    c[j2 + (k2 * 12 | 0) + 8 >> 2] = 0;
                  }
                  k2 = k2 + 1 | 0;
                } while ((k2 | 0) != (h2 | 0));
              }
              c[g2 >> 2] = h2;
              l2 = c[b2 >> 2] | 0;
            }
            g2 = c[a2 >> 2] | 0;
            if (!(c[g2 + (l2 * 12 | 0) >> 2] | 0)) {
              m2 = l2;
              n2 = a2 + 16 | 0;
              c[d2 >> 2] = m2;
              c[e2 + 0 >> 2] = c[d2 + 0 >> 2];
              sc(n2, e2, 0);
              i2 = f2;
              return;
            }
            c[g2 + (l2 * 12 | 0) + 4 >> 2] = 0;
            m2 = c[b2 >> 2] | 0;
            n2 = a2 + 16 | 0;
            c[d2 >> 2] = m2;
            c[e2 + 0 >> 2] = c[d2 + 0 >> 2];
            sc(n2, e2, 0);
            i2 = f2;
            return;
          }
          function jc(b2, d2) {
            b2 = b2 | 0;
            d2 = d2 | 0;
            var e2 = 0, f2 = 0, g2 = 0, h2 = 0, j2 = 0, k2 = 0, l2 = 0;
            f2 = i2;
            e2 = b2 + 4 | 0;
            if ((c[e2 >> 2] | 0) >= (d2 | 0)) {
              i2 = f2;
              return;
            }
            h2 = b2 + 8 | 0;
            g2 = c[h2 >> 2] | 0;
            if ((g2 | 0) < (d2 | 0)) {
              k2 = d2 + 1 - g2 & -2;
              j2 = (g2 >> 1) + 2 & -2;
              j2 = (k2 | 0) > (j2 | 0) ? k2 : j2;
              if ((j2 | 0) > (2147483647 - g2 | 0)) {
                k2 = va(1) | 0;
                Ta(k2 | 0, 48, 0);
              }
              l2 = c[b2 >> 2] | 0;
              k2 = j2 + g2 | 0;
              c[h2 >> 2] = k2;
              k2 = Ud(l2, k2) | 0;
              c[b2 >> 2] = k2;
              if ((k2 | 0) == 0 ? (c[(Oa() | 0) >> 2] | 0) == 12 : 0) {
                l2 = va(1) | 0;
                Ta(l2 | 0, 48, 0);
              }
            }
            g2 = c[e2 >> 2] | 0;
            if ((g2 | 0) < (d2 | 0)) {
              b2 = c[b2 >> 2] | 0;
              do {
                h2 = b2 + g2 | 0;
                if (h2)
                  a[h2 >> 0] = 0;
                g2 = g2 + 1 | 0;
              } while ((g2 | 0) != (d2 | 0));
            }
            c[e2 >> 2] = d2;
            i2 = f2;
            return;
          }
          function kc(b2, d2, e2) {
            b2 = b2 | 0;
            d2 = d2 | 0;
            e2 = e2 | 0;
            var f2 = 0, g2 = 0, h2 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, n2 = 0;
            h2 = i2;
            g2 = d2 + 1 | 0;
            f2 = b2 + 4 | 0;
            if ((c[f2 >> 2] | 0) >= (g2 | 0)) {
              l2 = c[b2 >> 2] | 0;
              l2 = l2 + d2 | 0;
              a[l2 >> 0] = e2;
              i2 = h2;
              return;
            }
            k2 = b2 + 8 | 0;
            j2 = c[k2 >> 2] | 0;
            if ((j2 | 0) < (g2 | 0)) {
              m2 = d2 + 2 - j2 & -2;
              l2 = (j2 >> 1) + 2 & -2;
              l2 = (m2 | 0) > (l2 | 0) ? m2 : l2;
              if ((l2 | 0) > (2147483647 - j2 | 0)) {
                m2 = va(1) | 0;
                Ta(m2 | 0, 48, 0);
              }
              n2 = c[b2 >> 2] | 0;
              m2 = l2 + j2 | 0;
              c[k2 >> 2] = m2;
              m2 = Ud(n2, m2) | 0;
              c[b2 >> 2] = m2;
              if ((m2 | 0) == 0 ? (c[(Oa() | 0) >> 2] | 0) == 12 : 0) {
                n2 = va(1) | 0;
                Ta(n2 | 0, 48, 0);
              }
            }
            j2 = c[f2 >> 2] | 0;
            if ((j2 | 0) < (g2 | 0))
              do {
                k2 = (c[b2 >> 2] | 0) + j2 | 0;
                if (k2)
                  a[k2 >> 0] = 0;
                j2 = j2 + 1 | 0;
              } while ((j2 | 0) != (g2 | 0));
            c[f2 >> 2] = g2;
            n2 = c[b2 >> 2] | 0;
            n2 = n2 + d2 | 0;
            a[n2 >> 0] = e2;
            i2 = h2;
            return;
          }
          function lc(a2, b2) {
            a2 = a2 | 0;
            b2 = b2 | 0;
            var d2 = 0, e2 = 0, f2 = 0, g2 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, n2 = 0, o2 = 0;
            d2 = i2;
            i2 = i2 + 16 | 0;
            g2 = d2;
            c[g2 >> 2] = b2;
            j2 = a2 + 12 | 0;
            f2 = b2 + 1 | 0;
            e2 = a2 + 16 | 0;
            if ((c[e2 >> 2] | 0) < (f2 | 0)) {
              l2 = a2 + 20 | 0;
              k2 = c[l2 >> 2] | 0;
              if ((k2 | 0) < (f2 | 0)) {
                n2 = b2 + 2 - k2 & -2;
                m2 = (k2 >> 1) + 2 & -2;
                m2 = (n2 | 0) > (m2 | 0) ? n2 : m2;
                if ((m2 | 0) > (2147483647 - k2 | 0)) {
                  n2 = va(1) | 0;
                  Ta(n2 | 0, 48, 0);
                }
                o2 = c[j2 >> 2] | 0;
                n2 = m2 + k2 | 0;
                c[l2 >> 2] = n2;
                n2 = Ud(o2, n2 << 2) | 0;
                c[j2 >> 2] = n2;
                if ((n2 | 0) == 0 ? (c[(Oa() | 0) >> 2] | 0) == 12 : 0) {
                  o2 = va(1) | 0;
                  Ta(o2 | 0, 48, 0);
                }
              }
              k2 = c[e2 >> 2] | 0;
              if ((f2 | 0) > (k2 | 0))
                ke((c[j2 >> 2] | 0) + (k2 << 2) | 0, -1, f2 - k2 << 2 | 0) | 0;
              c[e2 >> 2] = f2;
            }
            c[(c[j2 >> 2] | 0) + (b2 << 2) >> 2] = c[a2 + 4 >> 2];
            nc(a2, g2);
            e2 = c[j2 >> 2] | 0;
            g2 = c[e2 + (b2 << 2) >> 2] | 0;
            b2 = c[a2 >> 2] | 0;
            f2 = c[b2 + (g2 << 2) >> 2] | 0;
            if (!g2) {
              n2 = 0;
              o2 = b2 + (n2 << 2) | 0;
              c[o2 >> 2] = f2;
              o2 = e2 + (f2 << 2) | 0;
              c[o2 >> 2] = n2;
              i2 = d2;
              return;
            }
            a2 = a2 + 28 | 0;
            while (1) {
              j2 = g2;
              g2 = g2 + -1 >> 1;
              k2 = b2 + (g2 << 2) | 0;
              l2 = c[k2 >> 2] | 0;
              o2 = c[c[a2 >> 2] >> 2] | 0;
              if (!(+h[o2 + (f2 << 3) >> 3] > +h[o2 + (l2 << 3) >> 3])) {
                a2 = 14;
                break;
              }
              c[b2 + (j2 << 2) >> 2] = l2;
              c[e2 + (c[k2 >> 2] << 2) >> 2] = j2;
              if (!g2) {
                j2 = 0;
                a2 = 14;
                break;
              }
            }
            if ((a2 | 0) == 14) {
              o2 = b2 + (j2 << 2) | 0;
              c[o2 >> 2] = f2;
              o2 = e2 + (f2 << 2) | 0;
              c[o2 >> 2] = j2;
              i2 = d2;
              return;
            }
          }
          function mc(a2, b2) {
            a2 = a2 | 0;
            b2 = b2 | 0;
            var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h2 = 0, j2 = 0;
            d2 = i2;
            e2 = a2 + 4 | 0;
            f2 = c[e2 >> 2] | 0;
            g2 = a2 + 8 | 0;
            h2 = c[g2 >> 2] | 0;
            if ((f2 | 0) == (h2 | 0) & (h2 | 0) < (f2 + 1 | 0)) {
              h2 = (f2 >> 1) + 2 & -2;
              h2 = (h2 | 0) < 2 ? 2 : h2;
              if ((h2 | 0) > (2147483647 - f2 | 0)) {
                h2 = va(1) | 0;
                Ta(h2 | 0, 48, 0);
              }
              j2 = c[a2 >> 2] | 0;
              f2 = h2 + f2 | 0;
              c[g2 >> 2] = f2;
              f2 = Ud(j2, f2 << 2) | 0;
              c[a2 >> 2] = f2;
              if ((f2 | 0) == 0 ? (c[(Oa() | 0) >> 2] | 0) == 12 : 0) {
                j2 = va(1) | 0;
                Ta(j2 | 0, 48, 0);
              }
            } else
              f2 = c[a2 >> 2] | 0;
            j2 = c[e2 >> 2] | 0;
            c[e2 >> 2] = j2 + 1;
            e2 = f2 + (j2 << 2) | 0;
            if (!e2) {
              i2 = d2;
              return;
            }
            c[e2 >> 2] = c[b2 >> 2];
            i2 = d2;
            return;
          }
          function nc(a2, b2) {
            a2 = a2 | 0;
            b2 = b2 | 0;
            var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h2 = 0, j2 = 0;
            d2 = i2;
            e2 = a2 + 4 | 0;
            f2 = c[e2 >> 2] | 0;
            g2 = a2 + 8 | 0;
            h2 = c[g2 >> 2] | 0;
            if ((f2 | 0) == (h2 | 0) & (h2 | 0) < (f2 + 1 | 0)) {
              h2 = (f2 >> 1) + 2 & -2;
              h2 = (h2 | 0) < 2 ? 2 : h2;
              if ((h2 | 0) > (2147483647 - f2 | 0)) {
                h2 = va(1) | 0;
                Ta(h2 | 0, 48, 0);
              }
              j2 = c[a2 >> 2] | 0;
              f2 = h2 + f2 | 0;
              c[g2 >> 2] = f2;
              f2 = Ud(j2, f2 << 2) | 0;
              c[a2 >> 2] = f2;
              if ((f2 | 0) == 0 ? (c[(Oa() | 0) >> 2] | 0) == 12 : 0) {
                j2 = va(1) | 0;
                Ta(j2 | 0, 48, 0);
              }
            } else
              f2 = c[a2 >> 2] | 0;
            j2 = c[e2 >> 2] | 0;
            c[e2 >> 2] = j2 + 1;
            e2 = f2 + (j2 << 2) | 0;
            if (!e2) {
              i2 = d2;
              return;
            }
            c[e2 >> 2] = c[b2 >> 2];
            i2 = d2;
            return;
          }
          function oc(b2, d2, e2) {
            b2 = b2 | 0;
            d2 = d2 | 0;
            e2 = e2 | 0;
            var f2 = 0, g2 = 0, h2 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, n2 = 0, o2 = 0, p2 = 0;
            e2 = i2;
            i2 = i2 + 16 | 0;
            f2 = e2 + 2 | 0;
            h2 = e2 + 1 | 0;
            g2 = e2;
            if ((d2 | 0) < 16) {
              g2 = d2 + -1 | 0;
              if ((g2 | 0) > 0)
                h2 = 0;
              else {
                i2 = e2;
                return;
              }
              do {
                f2 = h2;
                h2 = h2 + 1 | 0;
                if ((h2 | 0) < (d2 | 0)) {
                  k2 = f2;
                  j2 = h2;
                  do {
                    k2 = (c[b2 + (j2 << 2) >> 2] | 0) < (c[b2 + (k2 << 2) >> 2] | 0) ? j2 : k2;
                    j2 = j2 + 1 | 0;
                  } while ((j2 | 0) != (d2 | 0));
                } else
                  k2 = f2;
                n2 = b2 + (f2 << 2) | 0;
                o2 = c[n2 >> 2] | 0;
                p2 = b2 + (k2 << 2) | 0;
                c[n2 >> 2] = c[p2 >> 2];
                c[p2 >> 2] = o2;
              } while ((h2 | 0) != (g2 | 0));
              i2 = e2;
              return;
            }
            j2 = c[b2 + (((d2 | 0) / 2 | 0) << 2) >> 2] | 0;
            m2 = -1;
            n2 = d2;
            while (1) {
              do {
                m2 = m2 + 1 | 0;
                l2 = b2 + (m2 << 2) | 0;
                k2 = c[l2 >> 2] | 0;
              } while ((k2 | 0) < (j2 | 0));
              do {
                n2 = n2 + -1 | 0;
                o2 = b2 + (n2 << 2) | 0;
                p2 = c[o2 >> 2] | 0;
              } while ((j2 | 0) < (p2 | 0));
              if ((m2 | 0) >= (n2 | 0))
                break;
              c[l2 >> 2] = p2;
              c[o2 >> 2] = k2;
            }
            a[f2 + 0 >> 0] = a[h2 + 0 >> 0] | 0;
            oc(b2, m2, f2);
            p2 = d2 - m2 | 0;
            a[f2 + 0 >> 0] = a[g2 + 0 >> 0] | 0;
            oc(l2, p2, f2);
            i2 = e2;
            return;
          }
          function pc(a2, b2, e2) {
            a2 = a2 | 0;
            b2 = b2 | 0;
            e2 = e2 | 0;
            var f2 = 0, h2 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0;
            f2 = i2;
            k2 = e2 & 1;
            j2 = d[a2 + 16 >> 0] | 0 | k2;
            h2 = b2 + 4 | 0;
            l2 = ((j2 + (c[h2 >> 2] | 0) << 2) + 4 | 0) >>> 2;
            m2 = a2 + 4 | 0;
            gc(a2, l2 + (c[m2 >> 2] | 0) | 0);
            e2 = c[m2 >> 2] | 0;
            l2 = l2 + e2 | 0;
            c[m2 >> 2] = l2;
            if (l2 >>> 0 < e2 >>> 0)
              Ta(va(1) | 0, 48, 0);
            a2 = (c[a2 >> 2] | 0) + (e2 << 2) | 0;
            if (!a2) {
              i2 = f2;
              return e2 | 0;
            }
            j2 = j2 << 3 | k2 << 2;
            c[a2 >> 2] = c[a2 >> 2] & -32 | j2;
            j2 = c[h2 >> 2] << 5 | j2;
            c[a2 >> 2] = j2;
            if ((c[h2 >> 2] | 0) > 0) {
              j2 = c[b2 >> 2] | 0;
              b2 = 0;
              do {
                c[a2 + (b2 << 2) + 4 >> 2] = c[j2 + (b2 << 2) >> 2];
                b2 = b2 + 1 | 0;
              } while ((b2 | 0) < (c[h2 >> 2] | 0));
              j2 = c[a2 >> 2] | 0;
            }
            if (!(j2 & 8)) {
              i2 = f2;
              return e2 | 0;
            }
            h2 = j2 >>> 5;
            if (j2 & 4) {
              g[a2 + (h2 << 2) + 4 >> 2] = 0;
              i2 = f2;
              return e2 | 0;
            }
            if (!h2) {
              h2 = 0;
              j2 = 0;
            } else {
              j2 = 0;
              b2 = 0;
              do {
                j2 = 1 << ((c[a2 + (b2 << 2) + 4 >> 2] | 0) >>> 1 & 31) | j2;
                b2 = b2 + 1 | 0;
              } while ((b2 | 0) < (h2 | 0));
            }
            c[a2 + (h2 << 2) + 4 >> 2] = j2;
            i2 = f2;
            return e2 | 0;
          }
          function qc(a2, b2) {
            a2 = a2 | 0;
            b2 = b2 | 0;
            var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h2 = 0, j2 = 0;
            d2 = i2;
            e2 = a2 + 4 | 0;
            f2 = c[e2 >> 2] | 0;
            g2 = a2 + 8 | 0;
            h2 = c[g2 >> 2] | 0;
            if ((f2 | 0) == (h2 | 0) & (h2 | 0) < (f2 + 1 | 0)) {
              h2 = (f2 >> 1) + 2 & -2;
              h2 = (h2 | 0) < 2 ? 2 : h2;
              if ((h2 | 0) > (2147483647 - f2 | 0)) {
                h2 = va(1) | 0;
                Ta(h2 | 0, 48, 0);
              }
              j2 = c[a2 >> 2] | 0;
              f2 = h2 + f2 | 0;
              c[g2 >> 2] = f2;
              f2 = Ud(j2, f2 << 3) | 0;
              c[a2 >> 2] = f2;
              if ((f2 | 0) == 0 ? (c[(Oa() | 0) >> 2] | 0) == 12 : 0) {
                j2 = va(1) | 0;
                Ta(j2 | 0, 48, 0);
              }
            } else
              f2 = c[a2 >> 2] | 0;
            j2 = c[e2 >> 2] | 0;
            c[e2 >> 2] = j2 + 1;
            e2 = f2 + (j2 << 3) | 0;
            if (!e2) {
              i2 = d2;
              return;
            }
            g2 = b2;
            h2 = c[g2 + 4 >> 2] | 0;
            j2 = e2;
            c[j2 >> 2] = c[g2 >> 2];
            c[j2 + 4 >> 2] = h2;
            i2 = d2;
            return;
          }
          function rc(a2) {
            a2 = a2 | 0;
            var b2 = 0, d2 = 0, e2 = 0, f2 = 0, g2 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, n2 = 0, o2 = 0, p2 = 0, q2 = 0, r2 = 0, s2 = 0;
            b2 = i2;
            d2 = c[a2 >> 2] | 0;
            f2 = c[d2 >> 2] | 0;
            k2 = a2 + 4 | 0;
            o2 = c[d2 + ((c[k2 >> 2] | 0) + -1 << 2) >> 2] | 0;
            c[d2 >> 2] = o2;
            e2 = c[a2 + 12 >> 2] | 0;
            c[e2 + (o2 << 2) >> 2] = 0;
            c[e2 + (f2 << 2) >> 2] = -1;
            o2 = (c[k2 >> 2] | 0) + -1 | 0;
            c[k2 >> 2] = o2;
            if ((o2 | 0) <= 1) {
              i2 = b2;
              return f2 | 0;
            }
            g2 = c[d2 >> 2] | 0;
            l2 = a2 + 28 | 0;
            a2 = 0;
            m2 = 1;
            while (1) {
              n2 = (a2 << 1) + 2 | 0;
              if ((n2 | 0) < (o2 | 0)) {
                p2 = c[d2 + (n2 << 2) >> 2] | 0;
                s2 = c[d2 + (m2 << 2) >> 2] | 0;
                o2 = c[c[l2 >> 2] >> 2] | 0;
                q2 = +h[o2 + (p2 << 3) >> 3];
                r2 = +h[o2 + (s2 << 3) >> 3];
                if (!(q2 > r2)) {
                  p2 = s2;
                  q2 = r2;
                  j2 = 6;
                }
              } else {
                o2 = c[c[l2 >> 2] >> 2] | 0;
                j2 = c[d2 + (m2 << 2) >> 2] | 0;
                p2 = j2;
                q2 = +h[o2 + (j2 << 3) >> 3];
                j2 = 6;
              }
              if ((j2 | 0) == 6) {
                j2 = 0;
                n2 = m2;
              }
              if (!(q2 > +h[o2 + (g2 << 3) >> 3]))
                break;
              c[d2 + (a2 << 2) >> 2] = p2;
              c[e2 + (p2 << 2) >> 2] = a2;
              m2 = n2 << 1 | 1;
              o2 = c[k2 >> 2] | 0;
              if ((m2 | 0) >= (o2 | 0)) {
                a2 = n2;
                break;
              } else
                a2 = n2;
            }
            c[d2 + (a2 << 2) >> 2] = g2;
            c[e2 + (g2 << 2) >> 2] = a2;
            i2 = b2;
            return f2 | 0;
          }
          function sc(b2, d2, e2) {
            b2 = b2 | 0;
            d2 = d2 | 0;
            e2 = e2 | 0;
            var f2 = 0, g2 = 0, h2 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0;
            f2 = i2;
            k2 = c[d2 >> 2] | 0;
            d2 = k2 + 1 | 0;
            g2 = b2 + 4 | 0;
            if ((c[g2 >> 2] | 0) >= (d2 | 0)) {
              i2 = f2;
              return;
            }
            j2 = b2 + 8 | 0;
            h2 = c[j2 >> 2] | 0;
            if ((h2 | 0) < (d2 | 0)) {
              l2 = k2 + 2 - h2 & -2;
              k2 = (h2 >> 1) + 2 & -2;
              k2 = (l2 | 0) > (k2 | 0) ? l2 : k2;
              if ((k2 | 0) > (2147483647 - h2 | 0)) {
                l2 = va(1) | 0;
                Ta(l2 | 0, 48, 0);
              }
              m2 = c[b2 >> 2] | 0;
              l2 = k2 + h2 | 0;
              c[j2 >> 2] = l2;
              l2 = Ud(m2, l2) | 0;
              c[b2 >> 2] = l2;
              if ((l2 | 0) == 0 ? (c[(Oa() | 0) >> 2] | 0) == 12 : 0) {
                m2 = va(1) | 0;
                Ta(m2 | 0, 48, 0);
              }
            }
            h2 = c[g2 >> 2] | 0;
            if ((h2 | 0) < (d2 | 0))
              do {
                a[(c[b2 >> 2] | 0) + h2 >> 0] = e2;
                h2 = h2 + 1 | 0;
              } while ((h2 | 0) != (d2 | 0));
            c[g2 >> 2] = d2;
            i2 = f2;
            return;
          }
          function tc(a2, b2, d2) {
            a2 = a2 | 0;
            b2 = b2 | 0;
            d2 = d2 | 0;
            var e2 = 0, f2 = 0, h2 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, n2 = 0, o2 = 0, p2 = 0, q2 = 0, r2 = 0, s2 = 0, t2 = 0, u2 = 0, v2 = 0;
            e2 = i2;
            i2 = i2 + 16 | 0;
            h2 = e2 + 8 | 0;
            f2 = e2 + 4 | 0;
            j2 = e2;
            if ((b2 | 0) < 16) {
              f2 = b2 + -1 | 0;
              if ((f2 | 0) <= 0) {
                i2 = e2;
                return;
              }
              h2 = c[d2 >> 2] | 0;
              d2 = 0;
              do {
                j2 = d2;
                d2 = d2 + 1 | 0;
                if ((d2 | 0) < (b2 | 0)) {
                  k2 = c[h2 >> 2] | 0;
                  m2 = j2;
                  l2 = d2;
                  do {
                    n2 = k2 + (c[a2 + (l2 << 2) >> 2] << 2) | 0;
                    u2 = c[n2 >> 2] | 0;
                    q2 = u2 >>> 5;
                    if (u2 >>> 0 > 95) {
                      o2 = k2 + (c[a2 + (m2 << 2) >> 2] << 2) | 0;
                      p2 = (c[o2 >> 2] | 0) >>> 5;
                      if ((p2 | 0) == 2)
                        m2 = l2;
                      else
                        m2 = +g[n2 + (q2 << 2) + 4 >> 2] < +g[o2 + (p2 << 2) + 4 >> 2] ? l2 : m2;
                    }
                    l2 = l2 + 1 | 0;
                  } while ((l2 | 0) != (b2 | 0));
                } else
                  m2 = j2;
                s2 = a2 + (j2 << 2) | 0;
                t2 = c[s2 >> 2] | 0;
                u2 = a2 + (m2 << 2) | 0;
                c[s2 >> 2] = c[u2 >> 2];
                c[u2 >> 2] = t2;
              } while ((d2 | 0) != (f2 | 0));
              i2 = e2;
              return;
            }
            k2 = c[a2 + (((b2 | 0) / 2 | 0) << 2) >> 2] | 0;
            q2 = -1;
            o2 = b2;
            while (1) {
              t2 = q2 + 1 | 0;
              p2 = a2 + (t2 << 2) | 0;
              u2 = c[p2 >> 2] | 0;
              l2 = c[d2 >> 2] | 0;
              m2 = c[l2 >> 2] | 0;
              s2 = m2 + (u2 << 2) | 0;
              r2 = c[s2 >> 2] | 0;
              q2 = m2 + (k2 << 2) | 0;
              n2 = c[q2 >> 2] | 0;
              a:
                do
                  if (r2 >>> 0 > 95)
                    while (1) {
                      v2 = n2 >>> 5;
                      if ((v2 | 0) != 2 ? !(+g[s2 + (r2 >>> 5 << 2) + 4 >> 2] < +g[q2 + (v2 << 2) + 4 >> 2]) : 0) {
                        q2 = t2;
                        break a;
                      }
                      t2 = t2 + 1 | 0;
                      p2 = a2 + (t2 << 2) | 0;
                      u2 = c[p2 >> 2] | 0;
                      s2 = m2 + (u2 << 2) | 0;
                      r2 = c[s2 >> 2] | 0;
                      if (r2 >>> 0 <= 95) {
                        q2 = t2;
                        break;
                      }
                    }
                  else
                    q2 = t2;
                while (0);
              o2 = o2 + -1 | 0;
              s2 = a2 + (o2 << 2) | 0;
              r2 = m2 + (k2 << 2) | 0;
              b:
                do
                  if (n2 >>> 0 > 95)
                    while (1) {
                      t2 = m2 + (c[s2 >> 2] << 2) | 0;
                      v2 = (c[t2 >> 2] | 0) >>> 5;
                      if ((v2 | 0) != 2 ? !(+g[r2 + (n2 >>> 5 << 2) + 4 >> 2] < +g[t2 + (v2 << 2) + 4 >> 2]) : 0)
                        break b;
                      v2 = o2 + -1 | 0;
                      s2 = a2 + (v2 << 2) | 0;
                      o2 = v2;
                    }
                while (0);
              if ((q2 | 0) >= (o2 | 0))
                break;
              c[p2 >> 2] = c[s2 >> 2];
              c[s2 >> 2] = u2;
            }
            c[f2 >> 2] = l2;
            c[h2 + 0 >> 2] = c[f2 + 0 >> 2];
            tc(a2, q2, h2);
            v2 = b2 - q2 | 0;
            c[j2 >> 2] = l2;
            c[h2 + 0 >> 2] = c[j2 + 0 >> 2];
            tc(p2, v2, h2);
            i2 = e2;
            return;
          }
          function uc(a2, b2) {
            a2 = a2 | 0;
            b2 = b2 | 0;
            var d2 = 0, e2 = 0, f2 = 0, g2 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, n2 = 0, o2 = 0, p2 = 0, q2 = 0, r2 = 0, s2 = 0;
            e2 = i2;
            f2 = a2 + 4 | 0;
            j2 = c[f2 >> 2] | 0;
            g2 = c[a2 >> 2] | 0;
            if ((j2 | 0) > 0) {
              l2 = c[a2 + 12 >> 2] | 0;
              k2 = 0;
              do {
                c[l2 + (c[g2 + (k2 << 2) >> 2] << 2) >> 2] = -1;
                k2 = k2 + 1 | 0;
                j2 = c[f2 >> 2] | 0;
              } while ((k2 | 0) < (j2 | 0));
            }
            if (g2) {
              c[f2 >> 2] = 0;
              j2 = 0;
            }
            g2 = b2 + 4 | 0;
            if ((c[g2 >> 2] | 0) > 0) {
              k2 = a2 + 12 | 0;
              j2 = 0;
              do {
                s2 = (c[b2 >> 2] | 0) + (j2 << 2) | 0;
                c[(c[k2 >> 2] | 0) + (c[s2 >> 2] << 2) >> 2] = j2;
                nc(a2, s2);
                j2 = j2 + 1 | 0;
              } while ((j2 | 0) < (c[g2 >> 2] | 0));
              j2 = c[f2 >> 2] | 0;
            }
            if ((j2 | 0) <= 1) {
              i2 = e2;
              return;
            }
            g2 = c[a2 >> 2] | 0;
            b2 = a2 + 28 | 0;
            a2 = a2 + 12 | 0;
            o2 = j2;
            k2 = (j2 | 0) / 2 | 0;
            while (1) {
              k2 = k2 + -1 | 0;
              j2 = c[g2 + (k2 << 2) >> 2] | 0;
              m2 = k2 << 1 | 1;
              a:
                do
                  if ((m2 | 0) < (o2 | 0)) {
                    l2 = k2;
                    while (1) {
                      n2 = (l2 << 1) + 2 | 0;
                      if ((n2 | 0) < (o2 | 0)) {
                        p2 = c[g2 + (n2 << 2) >> 2] | 0;
                        s2 = c[g2 + (m2 << 2) >> 2] | 0;
                        o2 = c[c[b2 >> 2] >> 2] | 0;
                        q2 = +h[o2 + (p2 << 3) >> 3];
                        r2 = +h[o2 + (s2 << 3) >> 3];
                        if (!(q2 > r2)) {
                          p2 = s2;
                          q2 = r2;
                          d2 = 16;
                        }
                      } else {
                        o2 = c[c[b2 >> 2] >> 2] | 0;
                        d2 = c[g2 + (m2 << 2) >> 2] | 0;
                        p2 = d2;
                        q2 = +h[o2 + (d2 << 3) >> 3];
                        d2 = 16;
                      }
                      if ((d2 | 0) == 16) {
                        d2 = 0;
                        n2 = m2;
                      }
                      if (!(q2 > +h[o2 + (j2 << 3) >> 3]))
                        break a;
                      c[g2 + (l2 << 2) >> 2] = p2;
                      c[(c[a2 >> 2] | 0) + (p2 << 2) >> 2] = l2;
                      m2 = n2 << 1 | 1;
                      o2 = c[f2 >> 2] | 0;
                      if ((m2 | 0) >= (o2 | 0)) {
                        l2 = n2;
                        break;
                      } else
                        l2 = n2;
                    }
                  } else
                    l2 = k2;
                while (0);
              c[g2 + (l2 << 2) >> 2] = j2;
              c[(c[a2 >> 2] | 0) + (j2 << 2) >> 2] = l2;
              if ((k2 | 0) <= 0)
                break;
              o2 = c[f2 >> 2] | 0;
            }
            i2 = e2;
            return;
          }
          function vc(b2) {
            b2 = b2 | 0;
            var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h2 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, n2 = 0, o2 = 0, p2 = 0, q2 = 0, r2 = 0, s2 = 0;
            e2 = i2;
            d2 = b2 + 36 | 0;
            l2 = c[d2 >> 2] | 0;
            f2 = b2 + 32 | 0;
            n2 = c[f2 >> 2] | 0;
            if ((l2 | 0) > 0) {
              h2 = b2 + 16 | 0;
              g2 = b2 + 44 | 0;
              j2 = 0;
              do {
                k2 = n2 + (j2 << 2) | 0;
                m2 = c[k2 >> 2] | 0;
                if (a[(c[h2 >> 2] | 0) + m2 >> 0] | 0) {
                  n2 = c[b2 >> 2] | 0;
                  l2 = n2 + (m2 * 12 | 0) + 4 | 0;
                  p2 = c[l2 >> 2] | 0;
                  if ((p2 | 0) > 0) {
                    m2 = n2 + (m2 * 12 | 0) | 0;
                    n2 = 0;
                    o2 = 0;
                    do {
                      q2 = c[m2 >> 2] | 0;
                      r2 = q2 + (n2 << 3) | 0;
                      if ((c[(c[c[g2 >> 2] >> 2] | 0) + (c[r2 >> 2] << 2) >> 2] & 3 | 0) != 1) {
                        s2 = r2;
                        r2 = c[s2 + 4 >> 2] | 0;
                        p2 = q2 + (o2 << 3) | 0;
                        c[p2 >> 2] = c[s2 >> 2];
                        c[p2 + 4 >> 2] = r2;
                        p2 = c[l2 >> 2] | 0;
                        o2 = o2 + 1 | 0;
                      }
                      n2 = n2 + 1 | 0;
                    } while ((n2 | 0) < (p2 | 0));
                  } else {
                    n2 = 0;
                    o2 = 0;
                  }
                  m2 = n2 - o2 | 0;
                  if ((m2 | 0) > 0)
                    c[l2 >> 2] = p2 - m2;
                  a[(c[h2 >> 2] | 0) + (c[k2 >> 2] | 0) >> 0] = 0;
                  l2 = c[d2 >> 2] | 0;
                  n2 = c[f2 >> 2] | 0;
                }
                j2 = j2 + 1 | 0;
              } while ((j2 | 0) < (l2 | 0));
            }
            if (!n2) {
              i2 = e2;
              return;
            }
            c[d2 >> 2] = 0;
            i2 = e2;
            return;
          }
          function wc(a2, b2) {
            a2 = a2 | 0;
            b2 = b2 | 0;
            var e2 = 0, f2 = 0, h2 = 0, j2 = 0, k2 = 0;
            f2 = i2;
            j2 = c[b2 >> 2] | 0;
            h2 = j2 >>> 2 & 1 | (d[a2 + 16 >> 0] | 0);
            j2 = ((h2 + (j2 >>> 5) << 2) + 4 | 0) >>> 2;
            k2 = a2 + 4 | 0;
            gc(a2, j2 + (c[k2 >> 2] | 0) | 0);
            e2 = c[k2 >> 2] | 0;
            j2 = j2 + e2 | 0;
            c[k2 >> 2] = j2;
            if (j2 >>> 0 < e2 >>> 0)
              Ta(va(1) | 0, 48, 0);
            a2 = (c[a2 >> 2] | 0) + (e2 << 2) | 0;
            if (!a2) {
              i2 = f2;
              return e2 | 0;
            }
            h2 = c[b2 >> 2] & -9 | h2 << 3;
            c[a2 >> 2] = h2;
            if ((c[b2 >> 2] | 0) >>> 0 > 31) {
              h2 = 0;
              do {
                c[a2 + (h2 << 2) + 4 >> 2] = c[b2 + (h2 << 2) + 4 >> 2];
                h2 = h2 + 1 | 0;
              } while ((h2 | 0) < ((c[b2 >> 2] | 0) >>> 5 | 0));
              h2 = c[a2 >> 2] | 0;
            }
            if (!(h2 & 8)) {
              i2 = f2;
              return e2 | 0;
            }
            j2 = h2 >>> 5;
            b2 = b2 + (j2 << 2) + 4 | 0;
            if (!(h2 & 4)) {
              c[a2 + (j2 << 2) + 4 >> 2] = c[b2 >> 2];
              i2 = f2;
              return e2 | 0;
            } else {
              g[a2 + (j2 << 2) + 4 >> 2] = +g[b2 >> 2];
              i2 = f2;
              return e2 | 0;
            }
            return 0;
          }
          function xc(b2) {
            b2 = b2 | 0;
            var d2 = 0, e2 = 0, f2 = 0, g2 = 0, j2 = 0, k2 = 0;
            d2 = i2;
            i2 = i2 + 16 | 0;
            g2 = d2;
            Gb(b2);
            c[b2 >> 2] = 3424;
            c[b2 + 684 >> 2] = c[719];
            c[b2 + 688 >> 2] = c[747];
            c[b2 + 692 >> 2] = c[785];
            h[b2 + 696 >> 3] = +h[411];
            a[b2 + 704 >> 0] = a[2652] | 0;
            a[b2 + 705 >> 0] = a[2724] | 0;
            a[b2 + 706 >> 0] = a[2804] | 0;
            a[b2 + 707 >> 0] = 1;
            c[b2 + 708 >> 2] = 0;
            c[b2 + 712 >> 2] = 0;
            c[b2 + 716 >> 2] = 0;
            c[b2 + 720 >> 2] = 1;
            a[b2 + 724 >> 0] = 1;
            e2 = b2 + 732 | 0;
            k2 = b2 + 544 | 0;
            c[b2 + 760 >> 2] = 0;
            c[b2 + 764 >> 2] = 0;
            c[b2 + 768 >> 2] = 0;
            c[b2 + 776 >> 2] = 0;
            c[b2 + 780 >> 2] = 0;
            c[b2 + 784 >> 2] = 0;
            c[b2 + 792 >> 2] = 0;
            c[b2 + 796 >> 2] = 0;
            c[b2 + 800 >> 2] = 0;
            j2 = b2 + 804 | 0;
            c[e2 + 0 >> 2] = 0;
            c[e2 + 4 >> 2] = 0;
            c[e2 + 8 >> 2] = 0;
            c[e2 + 12 >> 2] = 0;
            c[e2 + 16 >> 2] = 0;
            c[e2 + 20 >> 2] = 0;
            c[j2 >> 2] = k2;
            j2 = b2 + 808 | 0;
            c[j2 >> 2] = 0;
            c[b2 + 812 >> 2] = 0;
            c[b2 + 816 >> 2] = 0;
            e2 = b2 + 824 | 0;
            c[e2 + 0 >> 2] = 0;
            c[e2 + 4 >> 2] = 0;
            c[e2 + 8 >> 2] = 0;
            c[e2 + 12 >> 2] = 0;
            c[e2 + 16 >> 2] = 0;
            c[e2 + 20 >> 2] = 0;
            c[b2 + 852 >> 2] = j2;
            Qc(b2 + 856 | 0, 1);
            j2 = b2 + 868 | 0;
            e2 = b2 + 892 | 0;
            c[b2 + 920 >> 2] = 0;
            c[b2 + 924 >> 2] = 0;
            c[j2 + 0 >> 2] = 0;
            c[j2 + 4 >> 2] = 0;
            c[j2 + 8 >> 2] = 0;
            c[j2 + 12 >> 2] = 0;
            c[j2 + 16 >> 2] = 0;
            c[e2 + 0 >> 2] = 0;
            c[e2 + 4 >> 2] = 0;
            c[e2 + 8 >> 2] = 0;
            c[e2 + 12 >> 2] = 0;
            c[e2 + 16 >> 2] = 0;
            c[e2 + 20 >> 2] = 0;
            e2 = g2 + 4 | 0;
            c[e2 >> 2] = 0;
            j2 = g2 + 8 | 0;
            c[j2 >> 2] = 2;
            f2 = Ud(0, 8) | 0;
            c[g2 >> 2] = f2;
            if ((f2 | 0) == 0 ? (c[(Oa() | 0) >> 2] | 0) == 12 : 0)
              Ta(va(1) | 0, 48, 0);
            c[f2 >> 2] = -2;
            c[e2 >> 2] = 1;
            a[b2 + 560 >> 0] = 1;
            c[b2 + 928 >> 2] = pc(k2, g2, 0) | 0;
            a[b2 + 536 >> 0] = 0;
            if (!f2) {
              i2 = d2;
              return;
            }
            c[e2 >> 2] = 0;
            Td(f2);
            c[g2 >> 2] = 0;
            c[j2 >> 2] = 0;
            i2 = d2;
            return;
          }
          function yc(a2) {
            a2 = a2 | 0;
            var b2 = 0;
            b2 = i2;
            zc(a2);
            pd(a2);
            i2 = b2;
            return;
          }
          function zc(a2) {
            a2 = a2 | 0;
            var b2 = 0, d2 = 0, e2 = 0;
            b2 = i2;
            c[a2 >> 2] = 3424;
            d2 = a2 + 904 | 0;
            e2 = c[d2 >> 2] | 0;
            if (e2) {
              c[a2 + 908 >> 2] = 0;
              Td(e2);
              c[d2 >> 2] = 0;
              c[a2 + 912 >> 2] = 0;
            }
            d2 = a2 + 892 | 0;
            e2 = c[d2 >> 2] | 0;
            if (e2) {
              c[a2 + 896 >> 2] = 0;
              Td(e2);
              c[d2 >> 2] = 0;
              c[a2 + 900 >> 2] = 0;
            }
            d2 = a2 + 876 | 0;
            e2 = c[d2 >> 2] | 0;
            if (e2) {
              c[a2 + 880 >> 2] = 0;
              Td(e2);
              c[d2 >> 2] = 0;
              c[a2 + 884 >> 2] = 0;
            }
            d2 = a2 + 856 | 0;
            e2 = c[d2 >> 2] | 0;
            if (e2) {
              c[a2 + 860 >> 2] = 0;
              Td(e2);
              c[d2 >> 2] = 0;
              c[a2 + 864 >> 2] = 0;
            }
            e2 = a2 + 836 | 0;
            d2 = c[e2 >> 2] | 0;
            if (d2) {
              c[a2 + 840 >> 2] = 0;
              Td(d2);
              c[e2 >> 2] = 0;
              c[a2 + 844 >> 2] = 0;
            }
            d2 = a2 + 824 | 0;
            e2 = c[d2 >> 2] | 0;
            if (e2) {
              c[a2 + 828 >> 2] = 0;
              Td(e2);
              c[d2 >> 2] = 0;
              c[a2 + 832 >> 2] = 0;
            }
            d2 = a2 + 808 | 0;
            e2 = c[d2 >> 2] | 0;
            if (e2) {
              c[a2 + 812 >> 2] = 0;
              Td(e2);
              c[d2 >> 2] = 0;
              c[a2 + 816 >> 2] = 0;
            }
            Rc(a2 + 760 | 0);
            d2 = a2 + 744 | 0;
            e2 = c[d2 >> 2] | 0;
            if (e2) {
              c[a2 + 748 >> 2] = 0;
              Td(e2);
              c[d2 >> 2] = 0;
              c[a2 + 752 >> 2] = 0;
            }
            d2 = a2 + 732 | 0;
            e2 = c[d2 >> 2] | 0;
            if (!e2) {
              Ib(a2);
              i2 = b2;
              return;
            }
            c[a2 + 736 >> 2] = 0;
            Td(e2);
            c[d2 >> 2] = 0;
            c[a2 + 740 >> 2] = 0;
            Ib(a2);
            i2 = b2;
            return;
          }
          function Ac(b2, d2, e2) {
            b2 = b2 | 0;
            d2 = d2 | 0;
            e2 = e2 | 0;
            var f2 = 0, g2 = 0, h2 = 0, j2 = 0, k2 = 0, l2 = 0;
            f2 = i2;
            i2 = i2 + 32 | 0;
            h2 = f2 + 12 | 0;
            k2 = f2 + 8 | 0;
            l2 = f2 + 16 | 0;
            g2 = f2 + 4 | 0;
            j2 = f2;
            a[l2 >> 0] = a[d2 >> 0] | 0;
            a[h2 + 0 >> 0] = a[l2 + 0 >> 0] | 0;
            e2 = Jb(b2, h2, e2) | 0;
            c[k2 >> 2] = e2;
            kc(b2 + 876 | 0, e2, 0);
            kc(b2 + 904 | 0, e2, 0);
            if (!(a[b2 + 724 >> 0] | 0)) {
              i2 = f2;
              return e2 | 0;
            }
            l2 = b2 + 808 | 0;
            d2 = e2 << 1;
            c[g2 >> 2] = d2;
            c[h2 + 0 >> 2] = c[g2 + 0 >> 2];
            Sc(l2, h2, 0);
            c[j2 >> 2] = d2 | 1;
            c[h2 + 0 >> 2] = c[j2 + 0 >> 2];
            Sc(l2, h2, 0);
            Tc(b2 + 760 | 0, k2);
            kc(b2 + 744 | 0, e2, 0);
            Uc(b2 + 824 | 0, e2);
            i2 = f2;
            return e2 | 0;
          }
          function Bc(b2, e2, f2, g2) {
            b2 = b2 | 0;
            e2 = e2 | 0;
            f2 = f2 | 0;
            g2 = g2 | 0;
            var h2 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, n2 = 0, o2 = 0, p2 = 0, q2 = 0, r2 = 0, s2 = 0, t2 = 0, u2 = 0, v2 = 0, w2 = 0, x2 = 0;
            k2 = i2;
            i2 = i2 + 32 | 0;
            h2 = k2 + 4 | 0;
            r2 = k2;
            p2 = k2 + 16 | 0;
            c[h2 >> 2] = 0;
            j2 = h2 + 4 | 0;
            c[j2 >> 2] = 0;
            l2 = h2 + 8 | 0;
            c[l2 >> 2] = 0;
            s2 = a[2608] | 0;
            a[b2 >> 0] = s2;
            m2 = e2 + 724 | 0;
            f2 = (d[m2 >> 0] & (f2 & 1) | 0) != 0;
            if (f2) {
              u2 = e2 + 308 | 0;
              x2 = c[u2 >> 2] | 0;
              if ((x2 | 0) > 0) {
                t2 = e2 + 304 | 0;
                s2 = e2 + 876 | 0;
                v2 = 0;
                do {
                  w2 = c[(c[t2 >> 2] | 0) + (v2 << 2) >> 2] >> 1;
                  c[r2 >> 2] = w2;
                  w2 = (c[s2 >> 2] | 0) + w2 | 0;
                  if (!(a[w2 >> 0] | 0)) {
                    a[w2 >> 0] = 1;
                    nc(h2, r2);
                    x2 = c[u2 >> 2] | 0;
                  }
                  v2 = v2 + 1 | 0;
                } while ((v2 | 0) < (x2 | 0));
              }
              r2 = (Cc(e2, g2) | 0) & 1 ^ 1;
              a[b2 >> 0] = r2;
              g2 = a[2608] | 0;
            } else {
              g2 = s2;
              r2 = s2;
            }
            x2 = g2 & 255;
            if (!((x2 >>> 1 ^ 1) & r2 << 24 >> 24 == g2 << 24 >> 24 | x2 & 2 & (r2 & 255))) {
              if ((c[e2 + 44 >> 2] | 0) > 0)
                Ka(3760) | 0;
            } else {
              $b(p2, e2);
              r2 = a[p2 >> 0] | 0;
              a[b2 >> 0] = r2;
            }
            w2 = a[2608] | 0;
            x2 = w2 & 255;
            if ((((x2 >>> 1 ^ 1) & r2 << 24 >> 24 == w2 << 24 >> 24 | x2 & 2 & (r2 & 255) | 0) != 0 ? (a[e2 + 707 >> 0] | 0) != 0 : 0) ? (q2 = (c[e2 + 736 >> 2] | 0) + -1 | 0, (q2 | 0) > 0) : 0) {
              b2 = e2 + 732 | 0;
              p2 = e2 + 4 | 0;
              do {
                g2 = c[b2 >> 2] | 0;
                u2 = c[g2 + (q2 << 2) >> 2] | 0;
                v2 = q2 + -1 | 0;
                w2 = c[g2 + (v2 << 2) >> 2] | 0;
                q2 = c[p2 >> 2] | 0;
                a:
                  do
                    if ((u2 | 0) > 1) {
                      s2 = a[2616] | 0;
                      r2 = s2 & 255;
                      t2 = r2 & 2;
                      r2 = r2 >>> 1 ^ 1;
                      x2 = v2;
                      while (1) {
                        w2 = d[q2 + (w2 >> 1) >> 0] ^ w2 & 1;
                        v2 = u2 + -1 | 0;
                        if (!((w2 & 255) << 24 >> 24 == s2 << 24 >> 24 & r2 | t2 & w2))
                          break a;
                        u2 = x2 + -1 | 0;
                        w2 = c[g2 + (u2 << 2) >> 2] | 0;
                        if ((v2 | 0) > 1) {
                          x2 = u2;
                          u2 = v2;
                        } else {
                          x2 = u2;
                          u2 = v2;
                          o2 = 20;
                          break;
                        }
                      }
                    } else {
                      x2 = v2;
                      o2 = 20;
                    }
                  while (0);
                if ((o2 | 0) == 20) {
                  o2 = 0;
                  a[q2 + (w2 >> 1) >> 0] = (w2 & 1 ^ 1) & 255 ^ 1;
                }
                q2 = x2 - u2 | 0;
              } while ((q2 | 0) > 0);
            }
            if (f2 ? (n2 = c[j2 >> 2] | 0, (n2 | 0) > 0) : 0) {
              o2 = c[h2 >> 2] | 0;
              f2 = e2 + 876 | 0;
              p2 = 0;
              do {
                b2 = c[o2 + (p2 << 2) >> 2] | 0;
                a[(c[f2 >> 2] | 0) + b2 >> 0] = 0;
                if (a[m2 >> 0] | 0)
                  Vc(e2, b2);
                p2 = p2 + 1 | 0;
              } while ((p2 | 0) < (n2 | 0));
            }
            e2 = c[h2 >> 2] | 0;
            if (!e2) {
              i2 = k2;
              return;
            }
            c[j2 >> 2] = 0;
            Td(e2);
            c[h2 >> 2] = 0;
            c[l2 >> 2] = 0;
            i2 = k2;
            return;
          }
          function Cc(b2, d2) {
            b2 = b2 | 0;
            d2 = d2 | 0;
            var e2 = 0, f2 = 0, g2 = 0, j2 = 0, l2 = 0, m2 = 0, n2 = 0, o2 = 0, p2 = 0, q2 = 0, r2 = 0, s2 = 0, t2 = 0, u2 = 0, v2 = 0, w2 = 0, x2 = 0, y2 = 0, z2 = 0, A2 = 0, B2 = 0, C2 = 0, D2 = 0, E2 = 0, F2 = 0, G2 = 0, H2 = 0, I2 = 0, J2 = 0;
            m2 = i2;
            i2 = i2 + 16 | 0;
            j2 = m2;
            if (!(Zb(b2) | 0)) {
              H2 = 0;
              i2 = m2;
              return H2 | 0;
            }
            l2 = b2 + 724 | 0;
            if (!(a[l2 >> 0] | 0)) {
              H2 = 1;
              i2 = m2;
              return H2 | 0;
            }
            x2 = b2 + 924 | 0;
            v2 = b2 + 872 | 0;
            w2 = b2 + 868 | 0;
            u2 = b2 + 860 | 0;
            r2 = b2 + 680 | 0;
            y2 = b2 + 824 | 0;
            g2 = b2 + 828 | 0;
            o2 = b2 + 836 | 0;
            z2 = b2 + 904 | 0;
            A2 = b2 + 332 | 0;
            e2 = b2 + 44 | 0;
            B2 = b2 + 704 | 0;
            D2 = b2 + 706 | 0;
            E2 = b2 + 696 | 0;
            p2 = b2 + 556 | 0;
            q2 = b2 + 548 | 0;
            C2 = b2 + 876 | 0;
            s2 = b2 + 920 | 0;
            t2 = b2 + 284 | 0;
            a:
              while (1) {
                if (((c[x2 >> 2] | 0) <= 0 ? (c[s2 >> 2] | 0) >= (c[t2 >> 2] | 0) : 0) ? (c[g2 >> 2] | 0) <= 0 : 0)
                  break;
                Ic(b2);
                G2 = c[v2 >> 2] | 0;
                H2 = c[w2 >> 2] | 0;
                F2 = G2 - H2 | 0;
                if ((G2 | 0) < (H2 | 0))
                  F2 = (c[u2 >> 2] | 0) + F2 | 0;
                if (!((F2 | 0) <= 0 ? (c[s2 >> 2] | 0) >= (c[t2 >> 2] | 0) : 0))
                  n2 = 11;
                if ((n2 | 0) == 11 ? (n2 = 0, !(Jc(b2, 1) | 0)) : 0) {
                  n2 = 12;
                  break;
                }
                H2 = c[g2 >> 2] | 0;
                if (a[r2 >> 0] | 0) {
                  n2 = 15;
                  break;
                }
                if (!H2)
                  continue;
                else
                  F2 = 0;
                while (1) {
                  J2 = c[y2 >> 2] | 0;
                  G2 = c[J2 >> 2] | 0;
                  I2 = c[J2 + (H2 + -1 << 2) >> 2] | 0;
                  c[J2 >> 2] = I2;
                  H2 = c[o2 >> 2] | 0;
                  c[H2 + (I2 << 2) >> 2] = 0;
                  c[H2 + (G2 << 2) >> 2] = -1;
                  H2 = (c[g2 >> 2] | 0) + -1 | 0;
                  c[g2 >> 2] = H2;
                  if ((H2 | 0) > 1)
                    Wc(y2, 0);
                  if (a[r2 >> 0] | 0)
                    continue a;
                  if ((a[(c[z2 >> 2] | 0) + G2 >> 0] | 0) == 0 ? (I2 = a[(c[A2 >> 2] | 0) + G2 >> 0] | 0, H2 = a[2624] | 0, J2 = H2 & 255, ((J2 >>> 1 ^ 1) & I2 << 24 >> 24 == H2 << 24 >> 24 | I2 & 2 & J2 | 0) != 0) : 0) {
                    if ((c[e2 >> 2] | 0) > 1 & ((F2 | 0) % 100 | 0 | 0) == 0) {
                      c[j2 >> 2] = c[g2 >> 2];
                      La(3504, j2 | 0) | 0;
                    }
                    if (a[B2 >> 0] | 0) {
                      J2 = (c[C2 >> 2] | 0) + G2 | 0;
                      H2 = a[J2 >> 0] | 0;
                      a[J2 >> 0] = 1;
                      if (!(Lc(b2, G2) | 0)) {
                        n2 = 29;
                        break a;
                      }
                      a[(c[C2 >> 2] | 0) + G2 >> 0] = H2 << 24 >> 24 != 0 & 1;
                    }
                    if ((((a[D2 >> 0] | 0) != 0 ? (I2 = a[(c[A2 >> 2] | 0) + G2 >> 0] | 0, H2 = a[2624] | 0, J2 = H2 & 255, ((J2 >>> 1 ^ 1) & I2 << 24 >> 24 == H2 << 24 >> 24 | I2 & 2 & J2 | 0) != 0) : 0) ? (a[(c[C2 >> 2] | 0) + G2 >> 0] | 0) == 0 : 0) ? !(Mc(b2, G2) | 0) : 0) {
                      n2 = 35;
                      break a;
                    }
                    if (+((c[p2 >> 2] | 0) >>> 0) > +h[E2 >> 3] * +((c[q2 >> 2] | 0) >>> 0))
                      gb[c[(c[b2 >> 2] | 0) + 8 >> 2] & 31](b2);
                  }
                  H2 = c[g2 >> 2] | 0;
                  if (!H2)
                    continue a;
                  else
                    F2 = F2 + 1 | 0;
                }
              }
            do
              if ((n2 | 0) == 12)
                a[b2 + 492 >> 0] = 0;
              else if ((n2 | 0) == 15) {
                r2 = c[b2 + 824 >> 2] | 0;
                if ((H2 | 0) <= 0) {
                  if (!r2)
                    break;
                } else {
                  t2 = c[o2 >> 2] | 0;
                  s2 = 0;
                  do {
                    c[t2 + (c[r2 + (s2 << 2) >> 2] << 2) >> 2] = -1;
                    s2 = s2 + 1 | 0;
                  } while ((s2 | 0) < (c[g2 >> 2] | 0));
                }
                c[g2 >> 2] = 0;
              } else if ((n2 | 0) == 29)
                a[b2 + 492 >> 0] = 0;
              else if ((n2 | 0) == 35)
                a[b2 + 492 >> 0] = 0;
            while (0);
            if (!d2) {
              if (+((c[p2 >> 2] | 0) >>> 0) > +h[b2 + 96 >> 3] * +((c[q2 >> 2] | 0) >>> 0))
                gb[c[(c[b2 >> 2] | 0) + 8 >> 2] & 31](b2);
            } else {
              d2 = b2 + 744 | 0;
              p2 = c[d2 >> 2] | 0;
              if (p2) {
                c[b2 + 748 >> 2] = 0;
                Td(p2);
                c[d2 >> 2] = 0;
                c[b2 + 752 >> 2] = 0;
              }
              Xc(b2 + 760 | 0, 1);
              d2 = b2 + 808 | 0;
              p2 = c[d2 >> 2] | 0;
              if (p2) {
                c[b2 + 812 >> 2] = 0;
                Td(p2);
                c[d2 >> 2] = 0;
                c[b2 + 816 >> 2] = 0;
              }
              p2 = b2 + 824 | 0;
              d2 = c[p2 >> 2] | 0;
              if ((c[g2 >> 2] | 0) <= 0) {
                if (d2)
                  n2 = 48;
              } else {
                n2 = c[o2 >> 2] | 0;
                o2 = 0;
                do {
                  c[n2 + (c[d2 + (o2 << 2) >> 2] << 2) >> 2] = -1;
                  o2 = o2 + 1 | 0;
                } while ((o2 | 0) < (c[g2 >> 2] | 0));
                n2 = 48;
              }
              if ((n2 | 0) == 48) {
                c[g2 >> 2] = 0;
                Td(d2);
                c[p2 >> 2] = 0;
                c[b2 + 832 >> 2] = 0;
              }
              Yc(b2 + 856 | 0, 1);
              a[l2 >> 0] = 0;
              a[b2 + 536 >> 0] = 1;
              a[b2 + 560 >> 0] = 0;
              c[b2 + 728 >> 2] = c[b2 + 540 >> 2];
              Yb(b2);
              gb[c[(c[b2 >> 2] | 0) + 8 >> 2] & 31](b2);
            }
            if ((c[e2 >> 2] | 0) > 0 ? (f2 = c[b2 + 736 >> 2] | 0, (f2 | 0) > 0) : 0) {
              h[k >> 3] = +(f2 << 2 >>> 0) * 95367431640625e-20;
              c[j2 >> 2] = c[k >> 2];
              c[j2 + 4 >> 2] = c[k + 4 >> 2];
              La(3528, j2 | 0) | 0;
            }
            J2 = (a[b2 + 492 >> 0] | 0) != 0;
            i2 = m2;
            return J2 | 0;
          }
          function Dc(b2, d2) {
            b2 = b2 | 0;
            d2 = d2 | 0;
            var e2 = 0, f2 = 0, g2 = 0, h2 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, n2 = 0, o2 = 0, p2 = 0, q2 = 0;
            e2 = i2;
            i2 = i2 + 16 | 0;
            g2 = e2;
            j2 = b2 + 256 | 0;
            k2 = b2 + 260 | 0;
            h2 = c[k2 >> 2] | 0;
            if ((a[b2 + 705 >> 0] | 0) != 0 ? Ec(b2, d2) | 0 : 0) {
              p2 = 1;
              i2 = e2;
              return p2 | 0;
            }
            if (!(Kb(b2, d2) | 0)) {
              p2 = 0;
              i2 = e2;
              return p2 | 0;
            }
            if (!(a[b2 + 724 >> 0] | 0)) {
              p2 = 1;
              i2 = e2;
              return p2 | 0;
            }
            d2 = c[k2 >> 2] | 0;
            if ((d2 | 0) != (h2 + 1 | 0)) {
              p2 = 1;
              i2 = e2;
              return p2 | 0;
            }
            p2 = c[(c[j2 >> 2] | 0) + (d2 + -1 << 2) >> 2] | 0;
            c[g2 >> 2] = p2;
            m2 = (c[b2 + 544 >> 2] | 0) + (p2 << 2) | 0;
            Zc(b2 + 856 | 0, p2);
            if ((c[m2 >> 2] | 0) >>> 0 <= 31) {
              p2 = 1;
              i2 = e2;
              return p2 | 0;
            }
            l2 = b2 + 760 | 0;
            k2 = b2 + 808 | 0;
            j2 = b2 + 744 | 0;
            h2 = b2 + 924 | 0;
            d2 = b2 + 824 | 0;
            n2 = b2 + 840 | 0;
            b2 = b2 + 836 | 0;
            o2 = 0;
            do {
              p2 = m2 + (o2 << 2) + 4 | 0;
              _c((c[l2 >> 2] | 0) + ((c[p2 >> 2] >> 1) * 12 | 0) | 0, g2);
              q2 = (c[k2 >> 2] | 0) + (c[p2 >> 2] << 2) | 0;
              c[q2 >> 2] = (c[q2 >> 2] | 0) + 1;
              a[(c[j2 >> 2] | 0) + (c[p2 >> 2] >> 1) >> 0] = 1;
              c[h2 >> 2] = (c[h2 >> 2] | 0) + 1;
              p2 = c[p2 >> 2] >> 1;
              if ((c[n2 >> 2] | 0) > (p2 | 0) ? (f2 = c[(c[b2 >> 2] | 0) + (p2 << 2) >> 2] | 0, (f2 | 0) > -1) : 0)
                Wc(d2, f2);
              o2 = o2 + 1 | 0;
            } while ((o2 | 0) < ((c[m2 >> 2] | 0) >>> 5 | 0));
            f2 = 1;
            i2 = e2;
            return f2 | 0;
          }
          function Ec(b2, e2) {
            b2 = b2 | 0;
            e2 = e2 | 0;
            var f2 = 0, g2 = 0, h2 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, n2 = 0, o2 = 0, p2 = 0, q2 = 0, r2 = 0, s2 = 0;
            k2 = i2;
            i2 = i2 + 16 | 0;
            h2 = k2 + 8 | 0;
            j2 = k2 + 4 | 0;
            g2 = k2;
            c[j2 >> 2] = c[b2 + 284 >> 2];
            nc(b2 + 292 | 0, j2);
            j2 = e2 + 4 | 0;
            m2 = c[j2 >> 2] | 0;
            a:
              do
                if ((m2 | 0) > 0) {
                  f2 = b2 + 332 | 0;
                  l2 = 0;
                  while (1) {
                    n2 = c[(c[e2 >> 2] | 0) + (l2 << 2) >> 2] | 0;
                    p2 = d[(c[f2 >> 2] | 0) + (n2 >> 1) >> 0] | 0;
                    q2 = p2 ^ n2 & 1;
                    o2 = q2 & 255;
                    s2 = a[2608] | 0;
                    r2 = s2 & 255;
                    if (o2 << 24 >> 24 == s2 << 24 >> 24 & (r2 >>> 1 ^ 1) | r2 & 2 & q2)
                      break;
                    r2 = a[2616] | 0;
                    s2 = r2 & 255;
                    if (!((s2 >>> 1 ^ 1) & o2 << 24 >> 24 == r2 << 24 >> 24 | p2 & 2 & s2)) {
                      c[g2 >> 2] = n2 ^ 1;
                      c[h2 + 0 >> 2] = c[g2 + 0 >> 2];
                      Lb(b2, h2, -1);
                      m2 = c[j2 >> 2] | 0;
                    }
                    l2 = l2 + 1 | 0;
                    if ((l2 | 0) >= (m2 | 0))
                      break a;
                  }
                  Rb(b2, 0);
                  s2 = 1;
                  i2 = k2;
                  return s2 | 0;
                }
              while (0);
            s2 = (Mb(b2) | 0) != -1;
            Rb(b2, 0);
            i2 = k2;
            return s2 | 0;
          }
          function Fc(b2, d2) {
            b2 = b2 | 0;
            d2 = d2 | 0;
            var e2 = 0, f2 = 0, g2 = 0, h2 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, n2 = 0;
            e2 = i2;
            i2 = i2 + 16 | 0;
            g2 = e2;
            f2 = (c[b2 + 544 >> 2] | 0) + (d2 << 2) | 0;
            if (!(a[b2 + 724 >> 0] | 0)) {
              Pb(b2, d2);
              i2 = e2;
              return;
            }
            if ((c[f2 >> 2] | 0) >>> 0 <= 31) {
              Pb(b2, d2);
              i2 = e2;
              return;
            }
            j2 = b2 + 808 | 0;
            k2 = b2 + 776 | 0;
            h2 = b2 + 792 | 0;
            l2 = 0;
            do {
              m2 = f2 + (l2 << 2) + 4 | 0;
              n2 = (c[j2 >> 2] | 0) + (c[m2 >> 2] << 2) | 0;
              c[n2 >> 2] = (c[n2 >> 2] | 0) + -1;
              Vc(b2, c[m2 >> 2] >> 1);
              m2 = c[m2 >> 2] >> 1;
              c[g2 >> 2] = m2;
              m2 = (c[k2 >> 2] | 0) + m2 | 0;
              if (!(a[m2 >> 0] | 0)) {
                a[m2 >> 0] = 1;
                nc(h2, g2);
              }
              l2 = l2 + 1 | 0;
            } while ((l2 | 0) < ((c[f2 >> 2] | 0) >>> 5 | 0));
            Pb(b2, d2);
            i2 = e2;
            return;
          }
          function Gc(b2, e2, f2) {
            b2 = b2 | 0;
            e2 = e2 | 0;
            f2 = f2 | 0;
            var g2 = 0, h2 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, n2 = 0, o2 = 0, p2 = 0, q2 = 0, r2 = 0, s2 = 0;
            g2 = i2;
            i2 = i2 + 16 | 0;
            j2 = g2 + 4 | 0;
            h2 = g2;
            l2 = c[b2 + 544 >> 2] | 0;
            k2 = l2 + (e2 << 2) | 0;
            Zc(b2 + 856 | 0, e2);
            if ((c[k2 >> 2] & -32 | 0) == 64) {
              Fc(b2, e2);
              p2 = c[f2 >> 2] | 0;
              f2 = c[k2 >> 2] | 0;
              a:
                do
                  if (f2 >>> 0 > 31) {
                    m2 = f2 >>> 5;
                    n2 = 0;
                    while (1) {
                      o2 = n2 + 1 | 0;
                      if ((c[k2 + (n2 << 2) + 4 >> 2] | 0) == (p2 | 0)) {
                        o2 = n2;
                        break a;
                      }
                      if ((o2 | 0) < (m2 | 0))
                        n2 = o2;
                      else
                        break;
                    }
                  } else {
                    m2 = 0;
                    o2 = 0;
                  }
                while (0);
              n2 = m2 + -1 | 0;
              if ((o2 | 0) < (n2 | 0))
                do {
                  f2 = o2;
                  o2 = o2 + 1 | 0;
                  c[k2 + (f2 << 2) + 4 >> 2] = c[k2 + (o2 << 2) + 4 >> 2];
                  f2 = c[k2 >> 2] | 0;
                  m2 = f2 >>> 5;
                  n2 = m2 + -1 | 0;
                } while ((o2 | 0) < (n2 | 0));
              if (f2 & 8) {
                c[k2 + (n2 << 2) + 4 >> 2] = c[k2 + (m2 << 2) + 4 >> 2];
                f2 = c[k2 >> 2] | 0;
              }
              m2 = f2 + -32 | 0;
              c[k2 >> 2] = m2;
              m2 = m2 >>> 5;
              if (!m2) {
                m2 = 0;
                f2 = 0;
              } else {
                f2 = 0;
                n2 = 0;
                do {
                  f2 = 1 << ((c[k2 + (n2 << 2) + 4 >> 2] | 0) >>> 1 & 31) | f2;
                  n2 = n2 + 1 | 0;
                } while ((n2 | 0) < (m2 | 0));
              }
              c[k2 + (m2 << 2) + 4 >> 2] = f2;
            } else {
              Ob(b2, e2, 1);
              f2 = c[f2 >> 2] | 0;
              n2 = c[k2 >> 2] | 0;
              b:
                do
                  if (n2 >>> 0 > 31) {
                    m2 = n2 >>> 5;
                    o2 = 0;
                    while (1) {
                      p2 = o2 + 1 | 0;
                      if ((c[k2 + (o2 << 2) + 4 >> 2] | 0) == (f2 | 0)) {
                        p2 = o2;
                        break b;
                      }
                      if ((p2 | 0) < (m2 | 0))
                        o2 = p2;
                      else
                        break;
                    }
                  } else {
                    m2 = 0;
                    p2 = 0;
                  }
                while (0);
              o2 = m2 + -1 | 0;
              if ((p2 | 0) < (o2 | 0))
                do {
                  n2 = p2;
                  p2 = p2 + 1 | 0;
                  c[k2 + (n2 << 2) + 4 >> 2] = c[k2 + (p2 << 2) + 4 >> 2];
                  n2 = c[k2 >> 2] | 0;
                  m2 = n2 >>> 5;
                  o2 = m2 + -1 | 0;
                } while ((p2 | 0) < (o2 | 0));
              if (n2 & 8) {
                c[k2 + (o2 << 2) + 4 >> 2] = c[k2 + (m2 << 2) + 4 >> 2];
                n2 = c[k2 >> 2] | 0;
              }
              o2 = n2 + -32 | 0;
              c[k2 >> 2] = o2;
              o2 = o2 >>> 5;
              if (!o2) {
                o2 = 0;
                m2 = 0;
              } else {
                m2 = 0;
                n2 = 0;
                do {
                  m2 = 1 << ((c[k2 + (n2 << 2) + 4 >> 2] | 0) >>> 1 & 31) | m2;
                  n2 = n2 + 1 | 0;
                } while ((n2 | 0) < (o2 | 0));
              }
              c[k2 + (o2 << 2) + 4 >> 2] = m2;
              Nb(b2, e2);
              m2 = f2 >> 1;
              n2 = c[b2 + 760 >> 2] | 0;
              o2 = n2 + (m2 * 12 | 0) | 0;
              n2 = n2 + (m2 * 12 | 0) + 4 | 0;
              p2 = c[n2 >> 2] | 0;
              c:
                do
                  if ((p2 | 0) > 0) {
                    s2 = c[o2 >> 2] | 0;
                    q2 = 0;
                    while (1) {
                      r2 = q2 + 1 | 0;
                      if ((c[s2 + (q2 << 2) >> 2] | 0) == (e2 | 0))
                        break c;
                      if ((r2 | 0) < (p2 | 0))
                        q2 = r2;
                      else {
                        q2 = r2;
                        break;
                      }
                    }
                  } else
                    q2 = 0;
                while (0);
              p2 = p2 + -1 | 0;
              if ((q2 | 0) < (p2 | 0)) {
                o2 = c[o2 >> 2] | 0;
                do {
                  p2 = q2;
                  q2 = q2 + 1 | 0;
                  c[o2 + (p2 << 2) >> 2] = c[o2 + (q2 << 2) >> 2];
                  p2 = (c[n2 >> 2] | 0) + -1 | 0;
                } while ((q2 | 0) < (p2 | 0));
              }
              c[n2 >> 2] = p2;
              s2 = (c[b2 + 808 >> 2] | 0) + (f2 << 2) | 0;
              c[s2 >> 2] = (c[s2 >> 2] | 0) + -1;
              Vc(b2, m2);
            }
            if ((c[k2 >> 2] & -32 | 0) != 32) {
              s2 = 1;
              i2 = g2;
              return s2 | 0;
            }
            l2 = c[l2 + (e2 + 1 << 2) >> 2] | 0;
            k2 = d[(c[b2 + 332 >> 2] | 0) + (l2 >> 1) >> 0] | 0;
            s2 = k2 ^ l2 & 1;
            e2 = s2 & 255;
            q2 = a[2624] | 0;
            r2 = q2 & 255;
            if (!(e2 << 24 >> 24 == q2 << 24 >> 24 & (r2 >>> 1 ^ 1) | r2 & 2 & s2)) {
              r2 = a[2616] | 0;
              s2 = r2 & 255;
              if ((s2 >>> 1 ^ 1) & e2 << 24 >> 24 == r2 << 24 >> 24 | k2 & 2 & s2) {
                s2 = 0;
                i2 = g2;
                return s2 | 0;
              }
            } else {
              c[h2 >> 2] = l2;
              c[j2 + 0 >> 2] = c[h2 + 0 >> 2];
              Lb(b2, j2, -1);
            }
            s2 = (Mb(b2) | 0) == -1;
            i2 = g2;
            return s2 | 0;
          }
          function Hc(a2, b2, d2, e2, f2) {
            a2 = a2 | 0;
            b2 = b2 | 0;
            d2 = d2 | 0;
            e2 = e2 | 0;
            f2 = f2 | 0;
            var g2 = 0, h2 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, n2 = 0, o2 = 0;
            g2 = i2;
            i2 = i2 + 16 | 0;
            j2 = g2 + 4 | 0;
            h2 = g2;
            o2 = a2 + 708 | 0;
            c[o2 >> 2] = (c[o2 >> 2] | 0) + 1;
            if (c[f2 >> 2] | 0)
              c[f2 + 4 >> 2] = 0;
            k2 = (c[b2 >> 2] | 0) >>> 5 >>> 0 < (c[d2 >> 2] | 0) >>> 5 >>> 0;
            a2 = k2 ? d2 : b2;
            b2 = k2 ? b2 : d2;
            k2 = c[b2 >> 2] | 0;
            a:
              do
                if (k2 >>> 0 > 31) {
                  d2 = 0;
                  b:
                    while (1) {
                      l2 = c[b2 + (d2 << 2) + 4 >> 2] | 0;
                      c:
                        do
                          if ((l2 >> 1 | 0) != (e2 | 0)) {
                            m2 = c[a2 >> 2] | 0;
                            d:
                              do
                                if (m2 >>> 0 > 31) {
                                  n2 = 0;
                                  while (1) {
                                    o2 = c[a2 + (n2 << 2) + 4 >> 2] | 0;
                                    n2 = n2 + 1 | 0;
                                    if ((l2 ^ o2) >>> 0 < 2)
                                      break;
                                    if ((n2 | 0) >= (m2 >>> 5 | 0))
                                      break d;
                                  }
                                  if ((o2 | 0) == (l2 ^ 1 | 0)) {
                                    f2 = 0;
                                    break b;
                                  } else
                                    break c;
                                }
                              while (0);
                            c[j2 >> 2] = l2;
                            mc(f2, j2);
                            k2 = c[b2 >> 2] | 0;
                          }
                        while (0);
                      d2 = d2 + 1 | 0;
                      if ((d2 | 0) >= (k2 >>> 5 | 0))
                        break a;
                    }
                  i2 = g2;
                  return f2 | 0;
                }
              while (0);
            d2 = c[a2 >> 2] | 0;
            if (d2 >>> 0 <= 31) {
              o2 = 1;
              i2 = g2;
              return o2 | 0;
            }
            j2 = 0;
            do {
              b2 = c[a2 + (j2 << 2) + 4 >> 2] | 0;
              if ((b2 >> 1 | 0) != (e2 | 0)) {
                c[h2 >> 2] = b2;
                mc(f2, h2);
                d2 = c[a2 >> 2] | 0;
              }
              j2 = j2 + 1 | 0;
            } while ((j2 | 0) < (d2 >>> 5 | 0));
            f2 = 1;
            i2 = g2;
            return f2 | 0;
          }
          function Ic(b2) {
            b2 = b2 | 0;
            var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h2 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, n2 = 0, o2 = 0, p2 = 0, q2 = 0, r2 = 0, s2 = 0, t2 = 0, u2 = 0, v2 = 0, w2 = 0;
            d2 = i2;
            k2 = b2 + 924 | 0;
            if (!(c[k2 >> 2] | 0)) {
              i2 = d2;
              return;
            }
            h2 = b2 + 856 | 0;
            e2 = b2 + 872 | 0;
            f2 = b2 + 868 | 0;
            j2 = b2 + 860 | 0;
            g2 = b2 + 544 | 0;
            l2 = 0;
            while (1) {
              w2 = c[e2 >> 2] | 0;
              m2 = c[f2 >> 2] | 0;
              n2 = w2 - m2 | 0;
              if ((w2 | 0) < (m2 | 0))
                n2 = (c[j2 >> 2] | 0) + n2 | 0;
              if ((l2 | 0) >= (n2 | 0))
                break;
              n2 = (c[g2 >> 2] | 0) + (c[(c[h2 >> 2] | 0) + (((m2 + l2 | 0) % (c[j2 >> 2] | 0) | 0) << 2) >> 2] << 2) | 0;
              m2 = c[n2 >> 2] | 0;
              if (!(m2 & 3))
                c[n2 >> 2] = m2 & -4 | 2;
              l2 = l2 + 1 | 0;
            }
            l2 = b2 + 540 | 0;
            q2 = c[l2 >> 2] | 0;
            if ((q2 | 0) > 0) {
              n2 = b2 + 744 | 0;
              o2 = b2 + 776 | 0;
              m2 = b2 + 760 | 0;
              b2 = b2 + 804 | 0;
              p2 = 0;
              do {
                if (a[(c[n2 >> 2] | 0) + p2 >> 0] | 0) {
                  r2 = (c[o2 >> 2] | 0) + p2 | 0;
                  if (a[r2 >> 0] | 0) {
                    s2 = c[m2 >> 2] | 0;
                    q2 = s2 + (p2 * 12 | 0) + 4 | 0;
                    u2 = c[q2 >> 2] | 0;
                    if ((u2 | 0) > 0) {
                      s2 = c[s2 + (p2 * 12 | 0) >> 2] | 0;
                      v2 = 0;
                      t2 = 0;
                      do {
                        w2 = c[s2 + (v2 << 2) >> 2] | 0;
                        if ((c[(c[c[b2 >> 2] >> 2] | 0) + (w2 << 2) >> 2] & 3 | 0) != 1) {
                          c[s2 + (t2 << 2) >> 2] = w2;
                          u2 = c[q2 >> 2] | 0;
                          t2 = t2 + 1 | 0;
                        }
                        v2 = v2 + 1 | 0;
                      } while ((v2 | 0) < (u2 | 0));
                    } else {
                      v2 = 0;
                      t2 = 0;
                    }
                    s2 = v2 - t2 | 0;
                    if ((s2 | 0) > 0)
                      c[q2 >> 2] = u2 - s2;
                    a[r2 >> 0] = 0;
                  }
                  r2 = c[m2 >> 2] | 0;
                  q2 = r2 + (p2 * 12 | 0) + 4 | 0;
                  t2 = c[q2 >> 2] | 0;
                  if ((t2 | 0) > 0) {
                    r2 = r2 + (p2 * 12 | 0) | 0;
                    s2 = 0;
                    do {
                      u2 = c[(c[r2 >> 2] | 0) + (s2 << 2) >> 2] | 0;
                      if (!(c[(c[g2 >> 2] | 0) + (u2 << 2) >> 2] & 3)) {
                        Zc(h2, u2);
                        t2 = (c[g2 >> 2] | 0) + (c[(c[r2 >> 2] | 0) + (s2 << 2) >> 2] << 2) | 0;
                        c[t2 >> 2] = c[t2 >> 2] & -4 | 2;
                        t2 = c[q2 >> 2] | 0;
                      }
                      s2 = s2 + 1 | 0;
                    } while ((s2 | 0) < (t2 | 0));
                  }
                  a[(c[n2 >> 2] | 0) + p2 >> 0] = 0;
                  q2 = c[l2 >> 2] | 0;
                }
                p2 = p2 + 1 | 0;
              } while ((p2 | 0) < (q2 | 0));
              l2 = 0;
            } else
              l2 = 0;
            while (1) {
              w2 = c[e2 >> 2] | 0;
              m2 = c[f2 >> 2] | 0;
              n2 = w2 - m2 | 0;
              if ((w2 | 0) < (m2 | 0))
                n2 = (c[j2 >> 2] | 0) + n2 | 0;
              if ((l2 | 0) >= (n2 | 0))
                break;
              m2 = (c[g2 >> 2] | 0) + (c[(c[h2 >> 2] | 0) + (((m2 + l2 | 0) % (c[j2 >> 2] | 0) | 0) << 2) >> 2] << 2) | 0;
              n2 = c[m2 >> 2] | 0;
              if ((n2 & 3 | 0) == 2)
                c[m2 >> 2] = n2 & -4;
              l2 = l2 + 1 | 0;
            }
            c[k2 >> 2] = 0;
            i2 = d2;
            return;
          }
          function Jc(b2, d2) {
            b2 = b2 | 0;
            d2 = d2 | 0;
            var e2 = 0, f2 = 0, g2 = 0, h2 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, n2 = 0, o2 = 0, p2 = 0, q2 = 0, r2 = 0, s2 = 0, t2 = 0, u2 = 0, v2 = 0, w2 = 0, x2 = 0, y2 = 0, z2 = 0, A2 = 0, B2 = 0, C2 = 0, D2 = 0, E2 = 0, F2 = 0, G2 = 0, H2 = 0, I2 = 0, J2 = 0, K2 = 0, L2 = 0, M2 = 0, N2 = 0, O2 = 0, P2 = 0;
            e2 = i2;
            i2 = i2 + 16 | 0;
            m2 = e2;
            x2 = e2 + 12 | 0;
            g2 = b2 + 856 | 0;
            l2 = b2 + 872 | 0;
            q2 = b2 + 868 | 0;
            j2 = b2 + 860 | 0;
            u2 = b2 + 680 | 0;
            f2 = b2 + 920 | 0;
            h2 = b2 + 284 | 0;
            t2 = b2 + 280 | 0;
            r2 = b2 + 544 | 0;
            s2 = b2 + 928 | 0;
            o2 = b2 + 44 | 0;
            n2 = b2 + 776 | 0;
            v2 = b2 + 692 | 0;
            p2 = b2 + 804 | 0;
            k2 = b2 + 760 | 0;
            C2 = 0;
            F2 = 0;
            D2 = 0;
            a:
              while (1) {
                E2 = c[q2 >> 2] | 0;
                do {
                  A2 = c[l2 >> 2] | 0;
                  B2 = (A2 | 0) < (E2 | 0);
                  A2 = A2 - E2 | 0;
                  if (B2)
                    G2 = (c[j2 >> 2] | 0) + A2 | 0;
                  else
                    G2 = A2;
                  if ((G2 | 0) <= 0 ? (c[f2 >> 2] | 0) >= (c[h2 >> 2] | 0) : 0) {
                    f2 = 1;
                    j2 = 53;
                    break a;
                  }
                  if (a[u2 >> 0] | 0) {
                    j2 = 8;
                    break a;
                  }
                  if (B2)
                    A2 = (c[j2 >> 2] | 0) + A2 | 0;
                  if ((A2 | 0) == 0 ? (z2 = c[f2 >> 2] | 0, (z2 | 0) < (c[h2 >> 2] | 0)) : 0) {
                    c[f2 >> 2] = z2 + 1;
                    c[(c[r2 >> 2] | 0) + ((c[s2 >> 2] | 0) + 1 << 2) >> 2] = c[(c[t2 >> 2] | 0) + (z2 << 2) >> 2];
                    A2 = (c[r2 >> 2] | 0) + (c[s2 >> 2] << 2) | 0;
                    B2 = (c[A2 >> 2] | 0) >>> 5;
                    if (!B2) {
                      B2 = 0;
                      G2 = 0;
                    } else {
                      G2 = 0;
                      E2 = 0;
                      do {
                        G2 = 1 << ((c[A2 + (E2 << 2) + 4 >> 2] | 0) >>> 1 & 31) | G2;
                        E2 = E2 + 1 | 0;
                      } while ((E2 | 0) < (B2 | 0));
                    }
                    c[A2 + (B2 << 2) + 4 >> 2] = G2;
                    Zc(g2, c[s2 >> 2] | 0);
                    E2 = c[q2 >> 2] | 0;
                  }
                  A2 = c[(c[g2 >> 2] | 0) + (E2 << 2) >> 2] | 0;
                  E2 = E2 + 1 | 0;
                  J2 = c[j2 >> 2] | 0;
                  E2 = (E2 | 0) == (J2 | 0) ? 0 : E2;
                  c[q2 >> 2] = E2;
                  G2 = c[r2 >> 2] | 0;
                  B2 = G2 + (A2 << 2) | 0;
                  I2 = c[B2 >> 2] | 0;
                } while ((I2 & 3 | 0) != 0);
                if (d2 ? (c[o2 >> 2] | 0) > 1 : 0) {
                  H2 = C2 + 1 | 0;
                  if (!((C2 | 0) % 1e3 | 0)) {
                    I2 = c[l2 >> 2] | 0;
                    c[m2 >> 2] = I2 - E2 + ((I2 | 0) < (E2 | 0) ? J2 : 0);
                    c[m2 + 4 >> 2] = D2;
                    c[m2 + 8 >> 2] = F2;
                    La(3440, m2 | 0) | 0;
                    I2 = c[B2 >> 2] | 0;
                    C2 = H2;
                  } else
                    C2 = H2;
                }
                E2 = G2 + (A2 + 1 << 2) | 0;
                G2 = c[E2 >> 2] >> 1;
                if (I2 >>> 0 > 63) {
                  H2 = c[k2 >> 2] | 0;
                  I2 = I2 >>> 5;
                  J2 = 1;
                  do {
                    P2 = c[B2 + (J2 << 2) + 4 >> 2] >> 1;
                    G2 = (c[H2 + (P2 * 12 | 0) + 4 >> 2] | 0) < (c[H2 + (G2 * 12 | 0) + 4 >> 2] | 0) ? P2 : G2;
                    J2 = J2 + 1 | 0;
                  } while ((J2 | 0) < (I2 | 0));
                }
                I2 = (c[n2 >> 2] | 0) + G2 | 0;
                if (a[I2 >> 0] | 0) {
                  J2 = c[k2 >> 2] | 0;
                  H2 = J2 + (G2 * 12 | 0) + 4 | 0;
                  M2 = c[H2 >> 2] | 0;
                  if ((M2 | 0) > 0) {
                    J2 = c[J2 + (G2 * 12 | 0) >> 2] | 0;
                    L2 = 0;
                    K2 = 0;
                    do {
                      N2 = c[J2 + (L2 << 2) >> 2] | 0;
                      if ((c[(c[c[p2 >> 2] >> 2] | 0) + (N2 << 2) >> 2] & 3 | 0) != 1) {
                        c[J2 + (K2 << 2) >> 2] = N2;
                        M2 = c[H2 >> 2] | 0;
                        K2 = K2 + 1 | 0;
                      }
                      L2 = L2 + 1 | 0;
                    } while ((L2 | 0) < (M2 | 0));
                  } else {
                    L2 = 0;
                    K2 = 0;
                  }
                  J2 = L2 - K2 | 0;
                  if ((J2 | 0) > 0)
                    c[H2 >> 2] = M2 - J2;
                  a[I2 >> 0] = 0;
                }
                I2 = c[k2 >> 2] | 0;
                H2 = c[I2 + (G2 * 12 | 0) >> 2] | 0;
                I2 = I2 + (G2 * 12 | 0) + 4 | 0;
                if ((c[I2 >> 2] | 0) > 0)
                  J2 = 0;
                else
                  continue;
                while (1) {
                  N2 = c[B2 >> 2] | 0;
                  if (N2 & 3)
                    continue a;
                  K2 = c[H2 + (J2 << 2) >> 2] | 0;
                  L2 = c[r2 >> 2] | 0;
                  O2 = L2 + (K2 << 2) | 0;
                  M2 = c[O2 >> 2] | 0;
                  b:
                    do
                      if (((!((M2 & 3 | 0) != 0 | (K2 | 0) == (A2 | 0)) ? (P2 = c[v2 >> 2] | 0, y2 = M2 >>> 5, (P2 | 0) == -1 | (y2 | 0) < (P2 | 0)) : 0) ? (w2 = N2 >>> 5, y2 >>> 0 >= w2 >>> 0) : 0) ? (c[B2 + (w2 << 2) + 4 >> 2] & ~c[O2 + (y2 << 2) + 4 >> 2] | 0) == 0 : 0) {
                        L2 = L2 + (K2 + 1 << 2) | 0;
                        do
                          if (N2 >>> 0 > 31) {
                            if (M2 >>> 0 > 31) {
                              O2 = -2;
                              M2 = 0;
                            } else
                              break b;
                            while (1) {
                              N2 = c[E2 + (M2 << 2) >> 2] | 0;
                              c:
                                do
                                  if ((O2 | 0) == -2) {
                                    P2 = 0;
                                    while (1) {
                                      O2 = c[L2 + (P2 << 2) >> 2] | 0;
                                      if ((N2 | 0) == (O2 | 0)) {
                                        N2 = -2;
                                        break c;
                                      }
                                      P2 = P2 + 1 | 0;
                                      if ((N2 | 0) == (O2 ^ 1 | 0))
                                        break c;
                                      if (P2 >>> 0 >= y2 >>> 0)
                                        break b;
                                    }
                                  } else {
                                    P2 = 0;
                                    while (1) {
                                      if ((N2 | 0) == (c[L2 + (P2 << 2) >> 2] | 0)) {
                                        N2 = O2;
                                        break c;
                                      }
                                      P2 = P2 + 1 | 0;
                                      if (P2 >>> 0 >= y2 >>> 0)
                                        break b;
                                    }
                                  }
                                while (0);
                              M2 = M2 + 1 | 0;
                              if (M2 >>> 0 >= w2 >>> 0)
                                break;
                              else
                                O2 = N2;
                            }
                            if ((N2 | 0) == -2)
                              break;
                            else if ((N2 | 0) == -1)
                              break b;
                            c[x2 >> 2] = N2 ^ 1;
                            c[m2 + 0 >> 2] = c[x2 + 0 >> 2];
                            if (!(Gc(b2, K2, m2) | 0)) {
                              f2 = 0;
                              j2 = 53;
                              break a;
                            }
                            F2 = F2 + 1 | 0;
                            J2 = (((N2 >> 1 | 0) == (G2 | 0)) << 31 >> 31) + J2 | 0;
                            break b;
                          }
                        while (0);
                        Fc(b2, K2);
                        D2 = D2 + 1 | 0;
                      }
                    while (0);
                  J2 = J2 + 1 | 0;
                  if ((J2 | 0) >= (c[I2 >> 2] | 0))
                    continue a;
                }
              }
            if ((j2 | 0) == 8) {
              Yc(g2, 0);
              c[f2 >> 2] = c[h2 >> 2];
              P2 = 1;
              i2 = e2;
              return P2 | 0;
            } else if ((j2 | 0) == 53) {
              i2 = e2;
              return f2 | 0;
            }
            return 0;
          }
          function Kc(b2, e2, f2) {
            b2 = b2 | 0;
            e2 = e2 | 0;
            f2 = f2 | 0;
            var g2 = 0, h2 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, n2 = 0, o2 = 0, p2 = 0, q2 = 0, r2 = 0, s2 = 0, t2 = 0;
            h2 = i2;
            i2 = i2 + 16 | 0;
            g2 = h2 + 12 | 0;
            m2 = h2 + 8 | 0;
            k2 = h2 + 4 | 0;
            j2 = h2;
            l2 = (c[b2 + 544 >> 2] | 0) + (f2 << 2) | 0;
            if (c[l2 >> 2] & 3) {
              r2 = 1;
              i2 = h2;
              return r2 | 0;
            }
            if (Qb(b2, l2) | 0) {
              r2 = 1;
              i2 = h2;
              return r2 | 0;
            }
            c[m2 >> 2] = c[b2 + 284 >> 2];
            nc(b2 + 292 | 0, m2);
            p2 = c[l2 >> 2] | 0;
            if (p2 >>> 0 > 31) {
              m2 = b2 + 332 | 0;
              n2 = 0;
              o2 = -2;
              do {
                q2 = c[l2 + (n2 << 2) + 4 >> 2] | 0;
                r2 = q2 >> 1;
                if ((r2 | 0) != (e2 | 0) ? (r2 = (d[(c[m2 >> 2] | 0) + r2 >> 0] | 0) ^ q2 & 1, t2 = a[2616] | 0, s2 = t2 & 255, ((r2 & 255) << 24 >> 24 == t2 << 24 >> 24 & (s2 >>> 1 ^ 1) | s2 & 2 & r2 | 0) == 0) : 0) {
                  c[k2 >> 2] = q2 ^ 1;
                  c[g2 + 0 >> 2] = c[k2 + 0 >> 2];
                  Lb(b2, g2, -1);
                  p2 = c[l2 >> 2] | 0;
                } else
                  o2 = q2;
                n2 = n2 + 1 | 0;
              } while ((n2 | 0) < (p2 >>> 5 | 0));
            } else
              o2 = -2;
            t2 = (Mb(b2) | 0) == -1;
            Rb(b2, 0);
            if (!t2) {
              t2 = b2 + 712 | 0;
              c[t2 >> 2] = (c[t2 >> 2] | 0) + 1;
              c[j2 >> 2] = o2;
              c[g2 + 0 >> 2] = c[j2 + 0 >> 2];
              if (!(Gc(b2, f2, g2) | 0)) {
                t2 = 0;
                i2 = h2;
                return t2 | 0;
              }
            }
            t2 = 1;
            i2 = h2;
            return t2 | 0;
          }
          function Lc(b2, d2) {
            b2 = b2 | 0;
            d2 = d2 | 0;
            var e2 = 0, f2 = 0, g2 = 0, h2 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, n2 = 0, o2 = 0;
            e2 = i2;
            h2 = (c[b2 + 776 >> 2] | 0) + d2 | 0;
            f2 = b2 + 760 | 0;
            if (a[h2 >> 0] | 0) {
              k2 = c[f2 >> 2] | 0;
              g2 = k2 + (d2 * 12 | 0) + 4 | 0;
              n2 = c[g2 >> 2] | 0;
              if ((n2 | 0) > 0) {
                j2 = b2 + 804 | 0;
                k2 = c[k2 + (d2 * 12 | 0) >> 2] | 0;
                m2 = 0;
                l2 = 0;
                do {
                  o2 = c[k2 + (m2 << 2) >> 2] | 0;
                  if ((c[(c[c[j2 >> 2] >> 2] | 0) + (o2 << 2) >> 2] & 3 | 0) != 1) {
                    c[k2 + (l2 << 2) >> 2] = o2;
                    n2 = c[g2 >> 2] | 0;
                    l2 = l2 + 1 | 0;
                  }
                  m2 = m2 + 1 | 0;
                } while ((m2 | 0) < (n2 | 0));
              } else {
                m2 = 0;
                l2 = 0;
              }
              j2 = m2 - l2 | 0;
              if ((j2 | 0) > 0)
                c[g2 >> 2] = n2 - j2;
              a[h2 >> 0] = 0;
            }
            g2 = c[f2 >> 2] | 0;
            n2 = a[(c[b2 + 332 >> 2] | 0) + d2 >> 0] | 0;
            m2 = a[2624] | 0;
            o2 = m2 & 255;
            if (!((o2 >>> 1 ^ 1) & n2 << 24 >> 24 == m2 << 24 >> 24 | n2 & 2 & o2)) {
              o2 = 1;
              i2 = e2;
              return o2 | 0;
            }
            f2 = g2 + (d2 * 12 | 0) + 4 | 0;
            h2 = c[f2 >> 2] | 0;
            if (!h2) {
              o2 = 1;
              i2 = e2;
              return o2 | 0;
            }
            a:
              do
                if ((h2 | 0) > 0) {
                  g2 = g2 + (d2 * 12 | 0) | 0;
                  h2 = 0;
                  while (1) {
                    if (!(Kc(b2, d2, c[(c[g2 >> 2] | 0) + (h2 << 2) >> 2] | 0) | 0)) {
                      b2 = 0;
                      break;
                    }
                    h2 = h2 + 1 | 0;
                    if ((h2 | 0) >= (c[f2 >> 2] | 0))
                      break a;
                  }
                  i2 = e2;
                  return b2 | 0;
                }
              while (0);
            o2 = Jc(b2, 0) | 0;
            i2 = e2;
            return o2 | 0;
          }
          function Mc(b2, d2) {
            b2 = b2 | 0;
            d2 = d2 | 0;
            var e2 = 0, f2 = 0, g2 = 0, h2 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, n2 = 0, o2 = 0, p2 = 0, q2 = 0, r2 = 0, s2 = 0, t2 = 0, u2 = 0, v2 = 0, w2 = 0, x2 = 0, y2 = 0, z2 = 0, A2 = 0, B2 = 0, C2 = 0, D2 = 0, E2 = 0, G2 = 0, H2 = 0, I2 = 0, J2 = 0, K2 = 0, L2 = 0, M2 = 0, N2 = 0, O2 = 0, P2 = 0, Q2 = 0, R2 = 0, S2 = 0, T2 = 0, U2 = 0, V2 = 0, W2 = 0, X2 = 0, Y2 = 0, Z2 = 0;
            e2 = i2;
            i2 = i2 + 48 | 0;
            s2 = e2 + 36 | 0;
            r2 = e2 + 32 | 0;
            t2 = e2 + 28 | 0;
            u2 = e2 + 24 | 0;
            f2 = e2 + 12 | 0;
            g2 = e2;
            n2 = (c[b2 + 776 >> 2] | 0) + d2 | 0;
            m2 = b2 + 760 | 0;
            if (a[n2 >> 0] | 0) {
              q2 = c[m2 >> 2] | 0;
              o2 = q2 + (d2 * 12 | 0) + 4 | 0;
              y2 = c[o2 >> 2] | 0;
              if ((y2 | 0) > 0) {
                p2 = b2 + 804 | 0;
                q2 = c[q2 + (d2 * 12 | 0) >> 2] | 0;
                w2 = 0;
                v2 = 0;
                do {
                  z2 = c[q2 + (w2 << 2) >> 2] | 0;
                  if ((c[(c[c[p2 >> 2] >> 2] | 0) + (z2 << 2) >> 2] & 3 | 0) != 1) {
                    c[q2 + (v2 << 2) >> 2] = z2;
                    y2 = c[o2 >> 2] | 0;
                    v2 = v2 + 1 | 0;
                  }
                  w2 = w2 + 1 | 0;
                } while ((w2 | 0) < (y2 | 0));
              } else {
                w2 = 0;
                v2 = 0;
              }
              p2 = w2 - v2 | 0;
              if ((p2 | 0) > 0)
                c[o2 >> 2] = y2 - p2;
              a[n2 >> 0] = 0;
            }
            v2 = c[m2 >> 2] | 0;
            w2 = v2 + (d2 * 12 | 0) | 0;
            c[f2 >> 2] = 0;
            n2 = f2 + 4 | 0;
            c[n2 >> 2] = 0;
            o2 = f2 + 8 | 0;
            c[o2 >> 2] = 0;
            c[g2 >> 2] = 0;
            q2 = g2 + 4 | 0;
            c[q2 >> 2] = 0;
            p2 = g2 + 8 | 0;
            c[p2 >> 2] = 0;
            v2 = v2 + (d2 * 12 | 0) + 4 | 0;
            a:
              do
                if ((c[v2 >> 2] | 0) > 0) {
                  y2 = b2 + 544 | 0;
                  B2 = d2 << 1;
                  A2 = 0;
                  do {
                    C2 = (c[w2 >> 2] | 0) + (A2 << 2) | 0;
                    E2 = (c[y2 >> 2] | 0) + (c[C2 >> 2] << 2) | 0;
                    Z2 = c[E2 >> 2] | 0;
                    z2 = Z2 >>> 5;
                    b:
                      do
                        if (Z2 >>> 0 > 31) {
                          G2 = 0;
                          while (1) {
                            D2 = G2 + 1 | 0;
                            if ((c[E2 + (G2 << 2) + 4 >> 2] | 0) == (B2 | 0)) {
                              D2 = G2;
                              break b;
                            }
                            if ((D2 | 0) < (z2 | 0))
                              G2 = D2;
                            else
                              break;
                          }
                        } else
                          D2 = 0;
                      while (0);
                    _c((D2 | 0) < (z2 | 0) ? f2 : g2, C2);
                    A2 = A2 + 1 | 0;
                    z2 = c[v2 >> 2] | 0;
                  } while ((A2 | 0) < (z2 | 0));
                  y2 = c[n2 >> 2] | 0;
                  B2 = (y2 | 0) > 0;
                  if (B2) {
                    C2 = c[q2 >> 2] | 0;
                    K2 = (C2 | 0) > 0;
                    J2 = b2 + 544 | 0;
                    D2 = c[f2 >> 2] | 0;
                    A2 = c[g2 >> 2] | 0;
                    E2 = b2 + 708 | 0;
                    I2 = b2 + 684 | 0;
                    H2 = b2 + 688 | 0;
                    P2 = 0;
                    G2 = 0;
                    while (1) {
                      if (K2) {
                        M2 = D2 + (G2 << 2) | 0;
                        L2 = c[J2 >> 2] | 0;
                        N2 = c[E2 >> 2] | 0;
                        O2 = 0;
                        do {
                          S2 = L2 + (c[M2 >> 2] << 2) | 0;
                          U2 = L2 + (c[A2 + (O2 << 2) >> 2] << 2) | 0;
                          N2 = N2 + 1 | 0;
                          c[E2 >> 2] = N2;
                          Q2 = (c[S2 >> 2] | 0) >>> 5 >>> 0 < (c[U2 >> 2] | 0) >>> 5 >>> 0;
                          R2 = Q2 ? U2 : S2;
                          U2 = Q2 ? S2 : U2;
                          S2 = R2 + 4 | 0;
                          Q2 = U2 + 4 | 0;
                          R2 = c[R2 >> 2] | 0;
                          T2 = R2 >>> 5;
                          W2 = T2 + -1 | 0;
                          U2 = c[U2 >> 2] | 0;
                          c:
                            do
                              if (U2 >>> 0 > 31) {
                                V2 = 0;
                                while (1) {
                                  Z2 = c[Q2 + (V2 << 2) >> 2] | 0;
                                  d:
                                    do
                                      if ((Z2 >> 1 | 0) != (d2 | 0)) {
                                        e:
                                          do
                                            if (R2 >>> 0 > 31) {
                                              Y2 = 0;
                                              while (1) {
                                                X2 = c[S2 + (Y2 << 2) >> 2] | 0;
                                                Y2 = Y2 + 1 | 0;
                                                if ((X2 ^ Z2) >>> 0 < 2)
                                                  break;
                                                if ((Y2 | 0) >= (T2 | 0))
                                                  break e;
                                              }
                                              if ((X2 | 0) == (Z2 ^ 1 | 0))
                                                break c;
                                              else
                                                break d;
                                            }
                                          while (0);
                                        W2 = W2 + 1 | 0;
                                      }
                                    while (0);
                                  V2 = V2 + 1 | 0;
                                  if ((V2 | 0) >= (U2 >>> 5 | 0)) {
                                    x2 = 28;
                                    break;
                                  }
                                }
                              } else
                                x2 = 28;
                            while (0);
                          if ((x2 | 0) == 28) {
                            x2 = 0;
                            if ((P2 | 0) >= ((c[I2 >> 2] | 0) + z2 | 0)) {
                              b2 = 1;
                              break a;
                            }
                            Z2 = c[H2 >> 2] | 0;
                            if ((Z2 | 0) != -1 & (W2 | 0) > (Z2 | 0)) {
                              b2 = 1;
                              break a;
                            } else
                              P2 = P2 + 1 | 0;
                          }
                          O2 = O2 + 1 | 0;
                        } while ((O2 | 0) < (C2 | 0));
                      }
                      G2 = G2 + 1 | 0;
                      if ((G2 | 0) >= (y2 | 0)) {
                        x2 = 32;
                        break;
                      }
                    }
                  } else {
                    B2 = 0;
                    x2 = 32;
                  }
                } else {
                  y2 = 0;
                  B2 = 0;
                  x2 = 32;
                }
              while (0);
            f:
              do
                if ((x2 | 0) == 32) {
                  a[(c[b2 + 904 >> 2] | 0) + d2 >> 0] = 1;
                  z2 = b2 + 380 | 0;
                  A2 = (c[z2 >> 2] | 0) + d2 | 0;
                  if (a[A2 >> 0] | 0) {
                    Z2 = b2 + 200 | 0;
                    Y2 = Z2;
                    Y2 = ne(c[Y2 >> 2] | 0, c[Y2 + 4 >> 2] | 0, -1, -1) | 0;
                    c[Z2 >> 2] = Y2;
                    c[Z2 + 4 >> 2] = F;
                  }
                  a[A2 >> 0] = 0;
                  A2 = b2 + 460 | 0;
                  if (!((c[b2 + 476 >> 2] | 0) > (d2 | 0) ? (c[(c[b2 + 472 >> 2] | 0) + (d2 << 2) >> 2] | 0) > -1 : 0))
                    x2 = 36;
                  if ((x2 | 0) == 36 ? (a[(c[z2 >> 2] | 0) + d2 >> 0] | 0) != 0 : 0)
                    lc(A2, d2);
                  x2 = b2 + 716 | 0;
                  c[x2 >> 2] = (c[x2 >> 2] | 0) + 1;
                  x2 = c[q2 >> 2] | 0;
                  if ((y2 | 0) > (x2 | 0)) {
                    A2 = b2 + 732 | 0;
                    if ((x2 | 0) > 0) {
                      u2 = b2 + 544 | 0;
                      t2 = c[g2 >> 2] | 0;
                      E2 = b2 + 736 | 0;
                      D2 = 0;
                      do {
                        C2 = (c[u2 >> 2] | 0) + (c[t2 + (D2 << 2) >> 2] << 2) | 0;
                        z2 = c[E2 >> 2] | 0;
                        if ((c[C2 >> 2] | 0) >>> 0 > 31) {
                          G2 = 0;
                          H2 = -1;
                          do {
                            Z2 = C2 + (G2 << 2) + 4 | 0;
                            c[s2 >> 2] = c[Z2 >> 2];
                            _c(A2, s2);
                            H2 = (c[Z2 >> 2] >> 1 | 0) == (d2 | 0) ? G2 + z2 | 0 : H2;
                            G2 = G2 + 1 | 0;
                          } while ((G2 | 0) < ((c[C2 >> 2] | 0) >>> 5 | 0));
                        } else
                          H2 = -1;
                        Z2 = c[A2 >> 2] | 0;
                        X2 = Z2 + (H2 << 2) | 0;
                        Y2 = c[X2 >> 2] | 0;
                        Z2 = Z2 + (z2 << 2) | 0;
                        c[X2 >> 2] = c[Z2 >> 2];
                        c[Z2 >> 2] = Y2;
                        c[r2 >> 2] = (c[C2 >> 2] | 0) >>> 5;
                        _c(A2, r2);
                        D2 = D2 + 1 | 0;
                      } while ((D2 | 0) < (x2 | 0));
                    }
                    c[s2 >> 2] = d2 << 1;
                    _c(A2, s2);
                    c[r2 >> 2] = 1;
                    _c(A2, r2);
                  } else {
                    D2 = b2 + 732 | 0;
                    if (B2) {
                      G2 = b2 + 544 | 0;
                      E2 = c[f2 >> 2] | 0;
                      z2 = b2 + 736 | 0;
                      H2 = 0;
                      do {
                        C2 = (c[G2 >> 2] | 0) + (c[E2 + (H2 << 2) >> 2] << 2) | 0;
                        A2 = c[z2 >> 2] | 0;
                        if ((c[C2 >> 2] | 0) >>> 0 > 31) {
                          I2 = 0;
                          J2 = -1;
                          do {
                            Z2 = C2 + (I2 << 2) + 4 | 0;
                            c[s2 >> 2] = c[Z2 >> 2];
                            _c(D2, s2);
                            J2 = (c[Z2 >> 2] >> 1 | 0) == (d2 | 0) ? I2 + A2 | 0 : J2;
                            I2 = I2 + 1 | 0;
                          } while ((I2 | 0) < ((c[C2 >> 2] | 0) >>> 5 | 0));
                        } else
                          J2 = -1;
                        Z2 = c[D2 >> 2] | 0;
                        X2 = Z2 + (J2 << 2) | 0;
                        Y2 = c[X2 >> 2] | 0;
                        Z2 = Z2 + (A2 << 2) | 0;
                        c[X2 >> 2] = c[Z2 >> 2];
                        c[Z2 >> 2] = Y2;
                        c[r2 >> 2] = (c[C2 >> 2] | 0) >>> 5;
                        _c(D2, r2);
                        H2 = H2 + 1 | 0;
                      } while ((H2 | 0) < (y2 | 0));
                    }
                    c[t2 >> 2] = d2 << 1 | 1;
                    _c(D2, t2);
                    c[u2 >> 2] = 1;
                    _c(D2, u2);
                  }
                  if ((c[v2 >> 2] | 0) > 0) {
                    r2 = 0;
                    do {
                      Fc(b2, c[(c[w2 >> 2] | 0) + (r2 << 2) >> 2] | 0);
                      r2 = r2 + 1 | 0;
                    } while ((r2 | 0) < (c[v2 >> 2] | 0));
                  }
                  r2 = b2 + 628 | 0;
                  g:
                    do
                      if (B2) {
                        s2 = b2 + 544 | 0;
                        w2 = c[f2 >> 2] | 0;
                        A2 = c[g2 >> 2] | 0;
                        if ((x2 | 0) > 0)
                          v2 = 0;
                        else {
                          r2 = 0;
                          while (1) {
                            r2 = r2 + 1 | 0;
                            if ((r2 | 0) >= (y2 | 0))
                              break g;
                          }
                        }
                        do {
                          u2 = w2 + (v2 << 2) | 0;
                          t2 = 0;
                          do {
                            Z2 = c[s2 >> 2] | 0;
                            if (Hc(b2, Z2 + (c[u2 >> 2] << 2) | 0, Z2 + (c[A2 + (t2 << 2) >> 2] << 2) | 0, d2, r2) | 0 ? !(Dc(b2, r2) | 0) : 0) {
                              b2 = 0;
                              break f;
                            }
                            t2 = t2 + 1 | 0;
                          } while ((t2 | 0) < (x2 | 0));
                          v2 = v2 + 1 | 0;
                        } while ((v2 | 0) < (y2 | 0));
                      }
                    while (0);
                  r2 = c[m2 >> 2] | 0;
                  m2 = r2 + (d2 * 12 | 0) | 0;
                  s2 = c[m2 >> 2] | 0;
                  if (s2) {
                    c[r2 + (d2 * 12 | 0) + 4 >> 2] = 0;
                    Td(s2);
                    c[m2 >> 2] = 0;
                    c[r2 + (d2 * 12 | 0) + 8 >> 2] = 0;
                  }
                  m2 = b2 + 412 | 0;
                  d2 = d2 << 1;
                  s2 = c[m2 >> 2] | 0;
                  r2 = s2 + (d2 * 12 | 0) + 4 | 0;
                  if ((c[r2 >> 2] | 0) == 0 ? (l2 = s2 + (d2 * 12 | 0) | 0, k2 = c[l2 >> 2] | 0, (k2 | 0) != 0) : 0) {
                    c[r2 >> 2] = 0;
                    Td(k2);
                    c[l2 >> 2] = 0;
                    c[s2 + (d2 * 12 | 0) + 8 >> 2] = 0;
                    s2 = c[m2 >> 2] | 0;
                  }
                  k2 = d2 | 1;
                  l2 = s2 + (k2 * 12 | 0) + 4 | 0;
                  if ((c[l2 >> 2] | 0) == 0 ? (j2 = s2 + (k2 * 12 | 0) | 0, h2 = c[j2 >> 2] | 0, (h2 | 0) != 0) : 0) {
                    c[l2 >> 2] = 0;
                    Td(h2);
                    c[j2 >> 2] = 0;
                    c[s2 + (k2 * 12 | 0) + 8 >> 2] = 0;
                  }
                  b2 = Jc(b2, 0) | 0;
                  A2 = c[g2 >> 2] | 0;
                }
              while (0);
            if (A2) {
              c[q2 >> 2] = 0;
              Td(A2);
              c[g2 >> 2] = 0;
              c[p2 >> 2] = 0;
            }
            g2 = c[f2 >> 2] | 0;
            if (!g2) {
              i2 = e2;
              return b2 | 0;
            }
            c[n2 >> 2] = 0;
            Td(g2);
            c[f2 >> 2] = 0;
            c[o2 >> 2] = 0;
            i2 = e2;
            return b2 | 0;
          }
          function Nc(b2, d2) {
            b2 = b2 | 0;
            d2 = d2 | 0;
            var e2 = 0, f2 = 0, g2 = 0, h2 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, n2 = 0, o2 = 0, p2 = 0, q2 = 0, r2 = 0, s2 = 0, t2 = 0;
            e2 = i2;
            if (!(a[b2 + 724 >> 0] | 0)) {
              i2 = e2;
              return;
            }
            l2 = b2 + 540 | 0;
            if ((c[l2 >> 2] | 0) > 0) {
              j2 = b2 + 760 | 0;
              f2 = b2 + 804 | 0;
              g2 = b2 + 776 | 0;
              k2 = b2 + 544 | 0;
              h2 = 0;
              do {
                n2 = c[j2 >> 2] | 0;
                m2 = n2 + (h2 * 12 | 0) + 4 | 0;
                p2 = c[m2 >> 2] | 0;
                if ((p2 | 0) > 0) {
                  n2 = c[n2 + (h2 * 12 | 0) >> 2] | 0;
                  q2 = 0;
                  o2 = 0;
                  do {
                    r2 = c[n2 + (q2 << 2) >> 2] | 0;
                    if ((c[(c[c[f2 >> 2] >> 2] | 0) + (r2 << 2) >> 2] & 3 | 0) != 1) {
                      c[n2 + (o2 << 2) >> 2] = r2;
                      p2 = c[m2 >> 2] | 0;
                      o2 = o2 + 1 | 0;
                    }
                    q2 = q2 + 1 | 0;
                  } while ((q2 | 0) < (p2 | 0));
                } else {
                  q2 = 0;
                  o2 = 0;
                }
                n2 = q2 - o2 | 0;
                if ((n2 | 0) > 0)
                  c[m2 >> 2] = p2 - n2;
                a[(c[g2 >> 2] | 0) + h2 >> 0] = 0;
                n2 = c[j2 >> 2] | 0;
                m2 = n2 + (h2 * 12 | 0) + 4 | 0;
                if ((c[m2 >> 2] | 0) > 0) {
                  r2 = n2 + (h2 * 12 | 0) | 0;
                  p2 = 0;
                  do {
                    n2 = (c[r2 >> 2] | 0) + (p2 << 2) | 0;
                    o2 = c[n2 >> 2] | 0;
                    q2 = c[k2 >> 2] | 0;
                    s2 = q2 + (o2 << 2) | 0;
                    if (!(c[s2 >> 2] & 16)) {
                      t2 = wc(d2, s2) | 0;
                      c[n2 >> 2] = t2;
                      c[s2 >> 2] = c[s2 >> 2] | 16;
                      c[q2 + (o2 + 1 << 2) >> 2] = t2;
                    } else
                      c[n2 >> 2] = c[q2 + (o2 + 1 << 2) >> 2];
                    p2 = p2 + 1 | 0;
                  } while ((p2 | 0) < (c[m2 >> 2] | 0));
                }
                h2 = h2 + 1 | 0;
              } while ((h2 | 0) < (c[l2 >> 2] | 0));
            }
            f2 = b2 + 856 | 0;
            t2 = c[b2 + 872 >> 2] | 0;
            g2 = b2 + 868 | 0;
            m2 = c[g2 >> 2] | 0;
            k2 = t2 - m2 | 0;
            if ((t2 | 0) < (m2 | 0))
              k2 = (c[b2 + 860 >> 2] | 0) + k2 | 0;
            a:
              do
                if ((k2 | 0) > 0) {
                  h2 = b2 + 860 | 0;
                  j2 = b2 + 544 | 0;
                  while (1) {
                    l2 = c[(c[f2 >> 2] | 0) + (m2 << 2) >> 2] | 0;
                    n2 = m2 + 1 | 0;
                    c[g2 >> 2] = (n2 | 0) == (c[h2 >> 2] | 0) ? 0 : n2;
                    n2 = c[j2 >> 2] | 0;
                    o2 = n2 + (l2 << 2) | 0;
                    m2 = c[o2 >> 2] | 0;
                    if (!(m2 & 3)) {
                      if (!(m2 & 16)) {
                        t2 = wc(d2, o2) | 0;
                        c[o2 >> 2] = c[o2 >> 2] | 16;
                        c[n2 + (l2 + 1 << 2) >> 2] = t2;
                        l2 = t2;
                      } else
                        l2 = c[n2 + (l2 + 1 << 2) >> 2] | 0;
                      Zc(f2, l2);
                    }
                    k2 = k2 + -1 | 0;
                    if ((k2 | 0) <= 0)
                      break a;
                    m2 = c[g2 >> 2] | 0;
                  }
                } else
                  j2 = b2 + 544 | 0;
              while (0);
            b2 = b2 + 928 | 0;
            f2 = c[b2 >> 2] | 0;
            h2 = c[j2 >> 2] | 0;
            g2 = h2 + (f2 << 2) | 0;
            if (!(c[g2 >> 2] & 16)) {
              t2 = wc(d2, g2) | 0;
              c[b2 >> 2] = t2;
              c[g2 >> 2] = c[g2 >> 2] | 16;
              c[h2 + (f2 + 1 << 2) >> 2] = t2;
              i2 = e2;
              return;
            } else {
              c[b2 >> 2] = c[h2 + (f2 + 1 << 2) >> 2];
              i2 = e2;
              return;
            }
          }
          function Oc(b2) {
            b2 = b2 | 0;
            var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h2 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0;
            h2 = i2;
            i2 = i2 + 32 | 0;
            l2 = h2;
            d2 = h2 + 8 | 0;
            e2 = b2 + 544 | 0;
            f2 = b2 + 548 | 0;
            g2 = b2 + 556 | 0;
            j2 = (c[f2 >> 2] | 0) - (c[g2 >> 2] | 0) | 0;
            c[d2 + 0 >> 2] = 0;
            c[d2 + 4 >> 2] = 0;
            c[d2 + 8 >> 2] = 0;
            c[d2 + 12 >> 2] = 0;
            gc(d2, j2);
            j2 = d2 + 16 | 0;
            k2 = b2 + 560 | 0;
            a[j2 >> 0] = a[k2 >> 0] | 0;
            Nc(b2, d2);
            ac(b2, d2);
            if ((c[b2 + 44 >> 2] | 0) > 1) {
              m2 = c[d2 + 4 >> 2] << 2;
              c[l2 >> 2] = c[f2 >> 2] << 2;
              c[l2 + 4 >> 2] = m2;
              La(3608, l2 | 0) | 0;
            }
            a[k2 >> 0] = a[j2 >> 0] | 0;
            j2 = c[e2 >> 2] | 0;
            if (j2)
              Td(j2);
            c[e2 >> 2] = c[d2 >> 2];
            c[f2 >> 2] = c[d2 + 4 >> 2];
            c[b2 + 552 >> 2] = c[d2 + 8 >> 2];
            c[g2 >> 2] = c[d2 + 12 >> 2];
            i2 = h2;
            return;
          }
          function Pc() {
            var d2 = 0, e2 = 0, f2 = 0;
            d2 = i2;
            i2 = i2 + 16 | 0;
            e2 = d2;
            a[2608] = 0;
            a[2616] = 1;
            a[2624] = 2;
            xb(2632, 2656, 2664, 3744, 3752);
            c[658] = 160;
            a[2652] = 0;
            xb(2704, 2728, 2736, 3744, 3752);
            c[676] = 160;
            a[2724] = 0;
            xb(2784, 2808, 2816, 3744, 3752);
            c[696] = 160;
            a[2804] = 1;
            xb(2848, 2880, 2888, 3744, 3736);
            c[712] = 280;
            f2 = 2868 | 0;
            c[f2 >> 2] = -2147483648;
            c[f2 + 4 >> 2] = 2147483647;
            c[719] = 0;
            xb(2960, 2992, 3e3, 3744, 3736);
            c[740] = 280;
            f2 = 2980 | 0;
            c[f2 >> 2] = -1;
            c[f2 + 4 >> 2] = 2147483647;
            c[747] = 20;
            xb(3112, 3144, 3152, 3744, 3736);
            c[778] = 280;
            f2 = 3132 | 0;
            c[f2 >> 2] = -1;
            c[f2 + 4 >> 2] = 2147483647;
            c[785] = 1e3;
            xb(3240, 3296, 3312, 3744, 3720);
            c[810] = 2168;
            h[408] = 0;
            h[409] = v;
            a[3280] = 0;
            a[3281] = 0;
            b[1641] = b[e2 + 0 >> 1] | 0;
            b[1642] = b[e2 + 2 >> 1] | 0;
            b[1643] = b[e2 + 4 >> 1] | 0;
            h[411] = 0.5;
            i2 = d2;
            return;
          }
          function Qc(a2, b2) {
            a2 = a2 | 0;
            b2 = b2 | 0;
            var d2 = 0, e2 = 0, f2 = 0, g2 = 0;
            d2 = i2;
            c[a2 >> 2] = 0;
            e2 = a2 + 4 | 0;
            c[e2 >> 2] = 0;
            f2 = a2 + 8 | 0;
            c[f2 >> 2] = 0;
            if ((b2 | 0) <= 0) {
              i2 = d2;
              return;
            }
            g2 = b2 + 1 & -2;
            g2 = (g2 | 0) > 2 ? g2 : 2;
            c[f2 >> 2] = g2;
            f2 = Ud(0, g2 << 2) | 0;
            c[a2 >> 2] = f2;
            if ((f2 | 0) == 0 ? (c[(Oa() | 0) >> 2] | 0) == 12 : 0)
              Ta(va(1) | 0, 48, 0);
            a2 = c[e2 >> 2] | 0;
            if ((a2 | 0) < (b2 | 0))
              do {
                g2 = f2 + (a2 << 2) | 0;
                if (g2)
                  c[g2 >> 2] = 0;
                a2 = a2 + 1 | 0;
              } while ((a2 | 0) != (b2 | 0));
            c[e2 >> 2] = b2;
            i2 = d2;
            return;
          }
          function Rc(a2) {
            a2 = a2 | 0;
            var b2 = 0, d2 = 0, e2 = 0, f2 = 0, g2 = 0, h2 = 0, j2 = 0;
            b2 = i2;
            e2 = a2 + 32 | 0;
            d2 = c[e2 >> 2] | 0;
            if (d2) {
              c[a2 + 36 >> 2] = 0;
              Td(d2);
              c[e2 >> 2] = 0;
              c[a2 + 40 >> 2] = 0;
            }
            e2 = a2 + 16 | 0;
            d2 = c[e2 >> 2] | 0;
            if (d2) {
              c[a2 + 20 >> 2] = 0;
              Td(d2);
              c[e2 >> 2] = 0;
              c[a2 + 24 >> 2] = 0;
            }
            e2 = c[a2 >> 2] | 0;
            if (!e2) {
              i2 = b2;
              return;
            }
            d2 = a2 + 4 | 0;
            g2 = c[d2 >> 2] | 0;
            if ((g2 | 0) > 0) {
              f2 = 0;
              do {
                j2 = e2 + (f2 * 12 | 0) | 0;
                h2 = c[j2 >> 2] | 0;
                if (h2) {
                  c[e2 + (f2 * 12 | 0) + 4 >> 2] = 0;
                  Td(h2);
                  c[j2 >> 2] = 0;
                  c[e2 + (f2 * 12 | 0) + 8 >> 2] = 0;
                  e2 = c[a2 >> 2] | 0;
                  g2 = c[d2 >> 2] | 0;
                }
                f2 = f2 + 1 | 0;
              } while ((f2 | 0) < (g2 | 0));
            }
            c[d2 >> 2] = 0;
            Td(e2);
            c[a2 >> 2] = 0;
            c[a2 + 8 >> 2] = 0;
            i2 = b2;
            return;
          }
          function Sc(a2, b2, d2) {
            a2 = a2 | 0;
            b2 = b2 | 0;
            d2 = d2 | 0;
            var e2 = 0, f2 = 0, g2 = 0, h2 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0;
            e2 = i2;
            b2 = c[b2 >> 2] | 0;
            g2 = b2 + 1 | 0;
            f2 = a2 + 4 | 0;
            if ((c[f2 >> 2] | 0) >= (g2 | 0)) {
              k2 = c[a2 >> 2] | 0;
              k2 = k2 + (b2 << 2) | 0;
              c[k2 >> 2] = d2;
              i2 = e2;
              return;
            }
            h2 = a2 + 8 | 0;
            k2 = c[h2 >> 2] | 0;
            if ((k2 | 0) < (g2 | 0)) {
              l2 = b2 + 2 - k2 & -2;
              j2 = (k2 >> 1) + 2 & -2;
              j2 = (l2 | 0) > (j2 | 0) ? l2 : j2;
              if ((j2 | 0) > (2147483647 - k2 | 0)) {
                l2 = va(1) | 0;
                Ta(l2 | 0, 48, 0);
              }
              m2 = c[a2 >> 2] | 0;
              l2 = j2 + k2 | 0;
              c[h2 >> 2] = l2;
              l2 = Ud(m2, l2 << 2) | 0;
              c[a2 >> 2] = l2;
              if ((l2 | 0) == 0 ? (c[(Oa() | 0) >> 2] | 0) == 12 : 0) {
                m2 = va(1) | 0;
                Ta(m2 | 0, 48, 0);
              }
            }
            k2 = c[f2 >> 2] | 0;
            if ((k2 | 0) < (g2 | 0)) {
              h2 = c[a2 >> 2] | 0;
              do {
                j2 = h2 + (k2 << 2) | 0;
                if (j2)
                  c[j2 >> 2] = 0;
                k2 = k2 + 1 | 0;
              } while ((k2 | 0) != (g2 | 0));
            }
            c[f2 >> 2] = g2;
            m2 = c[a2 >> 2] | 0;
            m2 = m2 + (b2 << 2) | 0;
            c[m2 >> 2] = d2;
            i2 = e2;
            return;
          }
          function Tc(b2, d2) {
            b2 = b2 | 0;
            d2 = d2 | 0;
            var e2 = 0, f2 = 0, g2 = 0, h2 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0;
            e2 = i2;
            k2 = c[d2 >> 2] | 0;
            g2 = k2 + 1 | 0;
            f2 = b2 + 4 | 0;
            if ((c[f2 >> 2] | 0) < (g2 | 0)) {
              j2 = b2 + 8 | 0;
              h2 = c[j2 >> 2] | 0;
              if ((h2 | 0) < (g2 | 0)) {
                l2 = k2 + 2 - h2 & -2;
                k2 = (h2 >> 1) + 2 & -2;
                k2 = (l2 | 0) > (k2 | 0) ? l2 : k2;
                if ((k2 | 0) > (2147483647 - h2 | 0)) {
                  l2 = va(1) | 0;
                  Ta(l2 | 0, 48, 0);
                }
                m2 = c[b2 >> 2] | 0;
                l2 = k2 + h2 | 0;
                c[j2 >> 2] = l2;
                l2 = Ud(m2, l2 * 12 | 0) | 0;
                c[b2 >> 2] = l2;
                if ((l2 | 0) == 0 ? (c[(Oa() | 0) >> 2] | 0) == 12 : 0) {
                  m2 = va(1) | 0;
                  Ta(m2 | 0, 48, 0);
                }
              }
              j2 = c[f2 >> 2] | 0;
              if ((j2 | 0) < (g2 | 0)) {
                h2 = c[b2 >> 2] | 0;
                do {
                  k2 = h2 + (j2 * 12 | 0) | 0;
                  if (k2) {
                    c[k2 >> 2] = 0;
                    c[h2 + (j2 * 12 | 0) + 4 >> 2] = 0;
                    c[h2 + (j2 * 12 | 0) + 8 >> 2] = 0;
                  }
                  j2 = j2 + 1 | 0;
                } while ((j2 | 0) != (g2 | 0));
              }
              c[f2 >> 2] = g2;
              h2 = c[d2 >> 2] | 0;
            } else
              h2 = k2;
            f2 = c[b2 >> 2] | 0;
            if (c[f2 + (h2 * 12 | 0) >> 2] | 0) {
              c[f2 + (h2 * 12 | 0) + 4 >> 2] = 0;
              h2 = c[d2 >> 2] | 0;
            }
            d2 = b2 + 16 | 0;
            f2 = h2 + 1 | 0;
            g2 = b2 + 20 | 0;
            if ((c[g2 >> 2] | 0) >= (f2 | 0)) {
              i2 = e2;
              return;
            }
            j2 = b2 + 24 | 0;
            b2 = c[j2 >> 2] | 0;
            if ((b2 | 0) < (f2 | 0)) {
              m2 = h2 + 2 - b2 & -2;
              h2 = (b2 >> 1) + 2 & -2;
              h2 = (m2 | 0) > (h2 | 0) ? m2 : h2;
              if ((h2 | 0) > (2147483647 - b2 | 0)) {
                m2 = va(1) | 0;
                Ta(m2 | 0, 48, 0);
              }
              l2 = c[d2 >> 2] | 0;
              m2 = h2 + b2 | 0;
              c[j2 >> 2] = m2;
              m2 = Ud(l2, m2) | 0;
              c[d2 >> 2] = m2;
              if ((m2 | 0) == 0 ? (c[(Oa() | 0) >> 2] | 0) == 12 : 0) {
                m2 = va(1) | 0;
                Ta(m2 | 0, 48, 0);
              }
            }
            b2 = c[g2 >> 2] | 0;
            if ((b2 | 0) < (f2 | 0))
              do {
                a[(c[d2 >> 2] | 0) + b2 >> 0] = 0;
                b2 = b2 + 1 | 0;
              } while ((b2 | 0) != (f2 | 0));
            c[g2 >> 2] = f2;
            i2 = e2;
            return;
          }
          function Uc(a2, b2) {
            a2 = a2 | 0;
            b2 = b2 | 0;
            var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h2 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, n2 = 0, o2 = 0, p2 = 0, q2 = 0, r2 = 0;
            d2 = i2;
            i2 = i2 + 16 | 0;
            g2 = d2;
            c[g2 >> 2] = b2;
            f2 = a2 + 12 | 0;
            e2 = b2 + 1 | 0;
            h2 = a2 + 16 | 0;
            if ((c[h2 >> 2] | 0) < (e2 | 0)) {
              k2 = a2 + 20 | 0;
              j2 = c[k2 >> 2] | 0;
              if ((j2 | 0) < (e2 | 0)) {
                m2 = b2 + 2 - j2 & -2;
                l2 = (j2 >> 1) + 2 & -2;
                l2 = (m2 | 0) > (l2 | 0) ? m2 : l2;
                if ((l2 | 0) > (2147483647 - j2 | 0)) {
                  m2 = va(1) | 0;
                  Ta(m2 | 0, 48, 0);
                }
                n2 = c[f2 >> 2] | 0;
                m2 = l2 + j2 | 0;
                c[k2 >> 2] = m2;
                m2 = Ud(n2, m2 << 2) | 0;
                c[f2 >> 2] = m2;
                if ((m2 | 0) == 0 ? (c[(Oa() | 0) >> 2] | 0) == 12 : 0) {
                  n2 = va(1) | 0;
                  Ta(n2 | 0, 48, 0);
                }
              }
              j2 = c[h2 >> 2] | 0;
              if ((e2 | 0) > (j2 | 0))
                ke((c[f2 >> 2] | 0) + (j2 << 2) | 0, -1, e2 - j2 << 2 | 0) | 0;
              c[h2 >> 2] = e2;
            }
            c[(c[f2 >> 2] | 0) + (b2 << 2) >> 2] = c[a2 + 4 >> 2];
            nc(a2, g2);
            e2 = c[f2 >> 2] | 0;
            j2 = c[e2 + (b2 << 2) >> 2] | 0;
            b2 = c[a2 >> 2] | 0;
            f2 = c[b2 + (j2 << 2) >> 2] | 0;
            if (!j2) {
              m2 = 0;
              n2 = b2 + (m2 << 2) | 0;
              c[n2 >> 2] = f2;
              n2 = e2 + (f2 << 2) | 0;
              c[n2 >> 2] = m2;
              i2 = d2;
              return;
            }
            a2 = a2 + 28 | 0;
            g2 = f2 << 1;
            h2 = g2 | 1;
            while (1) {
              m2 = j2;
              j2 = j2 + -1 >> 1;
              l2 = b2 + (j2 << 2) | 0;
              k2 = c[l2 >> 2] | 0;
              r2 = c[c[a2 >> 2] >> 2] | 0;
              o2 = c[r2 + (g2 << 2) >> 2] | 0;
              q2 = c[r2 + (h2 << 2) >> 2] | 0;
              o2 = we(q2 | 0, ((q2 | 0) < 0) << 31 >> 31 | 0, o2 | 0, ((o2 | 0) < 0) << 31 >> 31 | 0) | 0;
              q2 = F;
              p2 = k2 << 1;
              n2 = c[r2 + (p2 << 2) >> 2] | 0;
              p2 = c[r2 + ((p2 | 1) << 2) >> 2] | 0;
              n2 = we(p2 | 0, ((p2 | 0) < 0) << 31 >> 31 | 0, n2 | 0, ((n2 | 0) < 0) << 31 >> 31 | 0) | 0;
              p2 = F;
              if (!(q2 >>> 0 < p2 >>> 0 | (q2 | 0) == (p2 | 0) & o2 >>> 0 < n2 >>> 0)) {
                a2 = 14;
                break;
              }
              c[b2 + (m2 << 2) >> 2] = k2;
              c[e2 + (c[l2 >> 2] << 2) >> 2] = m2;
              if (!j2) {
                m2 = 0;
                a2 = 14;
                break;
              }
            }
            if ((a2 | 0) == 14) {
              r2 = b2 + (m2 << 2) | 0;
              c[r2 >> 2] = f2;
              r2 = e2 + (f2 << 2) | 0;
              c[r2 >> 2] = m2;
              i2 = d2;
              return;
            }
          }
          function Vc(b2, d2) {
            b2 = b2 | 0;
            d2 = d2 | 0;
            var e2 = 0, f2 = 0, g2 = 0, h2 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, n2 = 0, o2 = 0, p2 = 0, q2 = 0, r2 = 0, s2 = 0, t2 = 0, u2 = 0;
            e2 = i2;
            h2 = b2 + 824 | 0;
            l2 = (c[b2 + 840 >> 2] | 0) > (d2 | 0);
            if (l2 ? (c[(c[b2 + 836 >> 2] | 0) + (d2 << 2) >> 2] | 0) > -1 : 0)
              j2 = 7;
            else
              j2 = 3;
            do
              if ((j2 | 0) == 3) {
                if (a[(c[b2 + 876 >> 2] | 0) + d2 >> 0] | 0) {
                  i2 = e2;
                  return;
                }
                if (a[(c[b2 + 904 >> 2] | 0) + d2 >> 0] | 0) {
                  i2 = e2;
                  return;
                }
                o2 = a[(c[b2 + 332 >> 2] | 0) + d2 >> 0] | 0;
                n2 = a[2624] | 0;
                p2 = n2 & 255;
                if ((p2 >>> 1 ^ 1) & o2 << 24 >> 24 == n2 << 24 >> 24 | o2 & 2 & p2)
                  if (l2) {
                    j2 = 7;
                    break;
                  } else
                    break;
                else {
                  i2 = e2;
                  return;
                }
              }
            while (0);
            if ((j2 | 0) == 7 ? (f2 = c[b2 + 836 >> 2] | 0, g2 = f2 + (d2 << 2) | 0, k2 = c[g2 >> 2] | 0, (k2 | 0) > -1) : 0) {
              d2 = c[h2 >> 2] | 0;
              j2 = c[d2 + (k2 << 2) >> 2] | 0;
              a:
                do
                  if (!k2)
                    o2 = 0;
                  else {
                    l2 = b2 + 852 | 0;
                    m2 = j2 << 1;
                    b2 = m2 | 1;
                    while (1) {
                      o2 = k2;
                      k2 = k2 + -1 >> 1;
                      p2 = d2 + (k2 << 2) | 0;
                      n2 = c[p2 >> 2] | 0;
                      u2 = c[c[l2 >> 2] >> 2] | 0;
                      r2 = c[u2 + (m2 << 2) >> 2] | 0;
                      t2 = c[u2 + (b2 << 2) >> 2] | 0;
                      r2 = we(t2 | 0, ((t2 | 0) < 0) << 31 >> 31 | 0, r2 | 0, ((r2 | 0) < 0) << 31 >> 31 | 0) | 0;
                      t2 = F;
                      s2 = n2 << 1;
                      q2 = c[u2 + (s2 << 2) >> 2] | 0;
                      s2 = c[u2 + ((s2 | 1) << 2) >> 2] | 0;
                      q2 = we(s2 | 0, ((s2 | 0) < 0) << 31 >> 31 | 0, q2 | 0, ((q2 | 0) < 0) << 31 >> 31 | 0) | 0;
                      s2 = F;
                      if (!(t2 >>> 0 < s2 >>> 0 | (t2 | 0) == (s2 | 0) & r2 >>> 0 < q2 >>> 0))
                        break a;
                      c[d2 + (o2 << 2) >> 2] = n2;
                      c[f2 + (c[p2 >> 2] << 2) >> 2] = o2;
                      if (!k2) {
                        o2 = 0;
                        break;
                      }
                    }
                  }
                while (0);
              c[d2 + (o2 << 2) >> 2] = j2;
              c[f2 + (j2 << 2) >> 2] = o2;
              Wc(h2, c[g2 >> 2] | 0);
              i2 = e2;
              return;
            }
            Uc(h2, d2);
            i2 = e2;
            return;
          }
          function Wc(a2, b2) {
            a2 = a2 | 0;
            b2 = b2 | 0;
            var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h2 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, n2 = 0, o2 = 0, p2 = 0, q2 = 0, r2 = 0, s2 = 0, t2 = 0, u2 = 0;
            d2 = i2;
            e2 = c[a2 >> 2] | 0;
            f2 = c[e2 + (b2 << 2) >> 2] | 0;
            m2 = b2 << 1 | 1;
            l2 = a2 + 4 | 0;
            o2 = c[l2 >> 2] | 0;
            if ((m2 | 0) >= (o2 | 0)) {
              p2 = b2;
              q2 = a2 + 12 | 0;
              o2 = e2 + (p2 << 2) | 0;
              c[o2 >> 2] = f2;
              q2 = c[q2 >> 2] | 0;
              q2 = q2 + (f2 << 2) | 0;
              c[q2 >> 2] = p2;
              i2 = d2;
              return;
            }
            h2 = a2 + 28 | 0;
            k2 = f2 << 1;
            j2 = k2 | 1;
            a2 = a2 + 12 | 0;
            while (1) {
              n2 = (b2 << 1) + 2 | 0;
              if ((n2 | 0) < (o2 | 0)) {
                p2 = c[e2 + (n2 << 2) >> 2] | 0;
                q2 = c[e2 + (m2 << 2) >> 2] | 0;
                u2 = p2 << 1;
                o2 = c[c[h2 >> 2] >> 2] | 0;
                s2 = c[o2 + (u2 << 2) >> 2] | 0;
                u2 = c[o2 + ((u2 | 1) << 2) >> 2] | 0;
                s2 = we(u2 | 0, ((u2 | 0) < 0) << 31 >> 31 | 0, s2 | 0, ((s2 | 0) < 0) << 31 >> 31 | 0) | 0;
                u2 = F;
                t2 = q2 << 1;
                r2 = c[o2 + (t2 << 2) >> 2] | 0;
                t2 = c[o2 + ((t2 | 1) << 2) >> 2] | 0;
                r2 = we(t2 | 0, ((t2 | 0) < 0) << 31 >> 31 | 0, r2 | 0, ((r2 | 0) < 0) << 31 >> 31 | 0) | 0;
                t2 = F;
                if (!(u2 >>> 0 < t2 >>> 0 | (u2 | 0) == (t2 | 0) & s2 >>> 0 < r2 >>> 0)) {
                  p2 = q2;
                  g2 = 7;
                }
              } else {
                p2 = c[e2 + (m2 << 2) >> 2] | 0;
                o2 = c[c[h2 >> 2] >> 2] | 0;
                g2 = 7;
              }
              if ((g2 | 0) == 7) {
                g2 = 0;
                n2 = m2;
              }
              r2 = p2 << 1;
              t2 = c[o2 + (r2 << 2) >> 2] | 0;
              r2 = c[o2 + ((r2 | 1) << 2) >> 2] | 0;
              t2 = we(r2 | 0, ((r2 | 0) < 0) << 31 >> 31 | 0, t2 | 0, ((t2 | 0) < 0) << 31 >> 31 | 0) | 0;
              r2 = F;
              u2 = c[o2 + (k2 << 2) >> 2] | 0;
              s2 = c[o2 + (j2 << 2) >> 2] | 0;
              u2 = we(s2 | 0, ((s2 | 0) < 0) << 31 >> 31 | 0, u2 | 0, ((u2 | 0) < 0) << 31 >> 31 | 0) | 0;
              s2 = F;
              if (!(r2 >>> 0 < s2 >>> 0 | (r2 | 0) == (s2 | 0) & t2 >>> 0 < u2 >>> 0)) {
                g2 = 10;
                break;
              }
              c[e2 + (b2 << 2) >> 2] = p2;
              c[(c[a2 >> 2] | 0) + (p2 << 2) >> 2] = b2;
              m2 = n2 << 1 | 1;
              o2 = c[l2 >> 2] | 0;
              if ((m2 | 0) >= (o2 | 0)) {
                b2 = n2;
                g2 = 10;
                break;
              } else
                b2 = n2;
            }
            if ((g2 | 0) == 10) {
              u2 = e2 + (b2 << 2) | 0;
              c[u2 >> 2] = f2;
              u2 = c[a2 >> 2] | 0;
              u2 = u2 + (f2 << 2) | 0;
              c[u2 >> 2] = b2;
              i2 = d2;
              return;
            }
          }
          function Xc(a2, b2) {
            a2 = a2 | 0;
            b2 = b2 | 0;
            var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h2 = 0, j2 = 0, k2 = 0;
            d2 = i2;
            h2 = c[a2 >> 2] | 0;
            if (h2) {
              e2 = a2 + 4 | 0;
              f2 = c[e2 >> 2] | 0;
              a:
                do
                  if ((f2 | 0) > 0) {
                    g2 = 0;
                    while (1) {
                      j2 = h2 + (g2 * 12 | 0) | 0;
                      k2 = c[j2 >> 2] | 0;
                      if (k2) {
                        c[h2 + (g2 * 12 | 0) + 4 >> 2] = 0;
                        Td(k2);
                        c[j2 >> 2] = 0;
                        c[h2 + (g2 * 12 | 0) + 8 >> 2] = 0;
                        f2 = c[e2 >> 2] | 0;
                      }
                      g2 = g2 + 1 | 0;
                      if ((g2 | 0) >= (f2 | 0))
                        break a;
                      h2 = c[a2 >> 2] | 0;
                    }
                  }
                while (0);
              c[e2 >> 2] = 0;
              if (b2) {
                Td(c[a2 >> 2] | 0);
                c[a2 >> 2] = 0;
                c[a2 + 8 >> 2] = 0;
              }
            }
            e2 = a2 + 16 | 0;
            f2 = c[e2 >> 2] | 0;
            if ((f2 | 0) != 0 ? (c[a2 + 20 >> 2] = 0, b2) : 0) {
              Td(f2);
              c[e2 >> 2] = 0;
              c[a2 + 24 >> 2] = 0;
            }
            f2 = a2 + 32 | 0;
            e2 = c[f2 >> 2] | 0;
            if (!e2) {
              i2 = d2;
              return;
            }
            c[a2 + 36 >> 2] = 0;
            if (!b2) {
              i2 = d2;
              return;
            }
            Td(e2);
            c[f2 >> 2] = 0;
            c[a2 + 40 >> 2] = 0;
            i2 = d2;
            return;
          }
          function Yc(a2, b2) {
            a2 = a2 | 0;
            b2 = b2 | 0;
            var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h2 = 0, j2 = 0;
            e2 = i2;
            f2 = c[a2 >> 2] | 0;
            d2 = a2 + 4 | 0;
            if (f2) {
              c[d2 >> 2] = 0;
              if (b2) {
                Td(f2);
                c[a2 >> 2] = 0;
                c[a2 + 8 >> 2] = 0;
                f2 = 0;
              }
            } else
              f2 = 0;
            if ((c[d2 >> 2] | 0) >= 1) {
              h2 = a2 + 16 | 0;
              c[h2 >> 2] = 0;
              h2 = a2 + 12 | 0;
              c[h2 >> 2] = 0;
              i2 = e2;
              return;
            }
            h2 = a2 + 8 | 0;
            g2 = c[h2 >> 2] | 0;
            if ((g2 | 0) < 1) {
              j2 = 2 - g2 & -2;
              b2 = (g2 >> 1) + 2 & -2;
              b2 = (j2 | 0) > (b2 | 0) ? j2 : b2;
              if ((b2 | 0) > (2147483647 - g2 | 0)) {
                j2 = va(1) | 0;
                Ta(j2 | 0, 48, 0);
              }
              j2 = b2 + g2 | 0;
              c[h2 >> 2] = j2;
              f2 = Ud(f2, j2 << 2) | 0;
              c[a2 >> 2] = f2;
              if ((f2 | 0) == 0 ? (c[(Oa() | 0) >> 2] | 0) == 12 : 0) {
                j2 = va(1) | 0;
                Ta(j2 | 0, 48, 0);
              }
            }
            b2 = c[d2 >> 2] | 0;
            if ((b2 | 0) < 1)
              while (1) {
                g2 = f2 + (b2 << 2) | 0;
                if (g2)
                  c[g2 >> 2] = 0;
                if (!b2)
                  break;
                else
                  b2 = b2 + 1 | 0;
              }
            c[d2 >> 2] = 1;
            j2 = a2 + 16 | 0;
            c[j2 >> 2] = 0;
            j2 = a2 + 12 | 0;
            c[j2 >> 2] = 0;
            i2 = e2;
            return;
          }
          function Zc(a2, b2) {
            a2 = a2 | 0;
            b2 = b2 | 0;
            var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h2 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0;
            e2 = i2;
            i2 = i2 + 16 | 0;
            d2 = e2;
            f2 = a2 + 16 | 0;
            j2 = c[f2 >> 2] | 0;
            c[f2 >> 2] = j2 + 1;
            c[(c[a2 >> 2] | 0) + (j2 << 2) >> 2] = b2;
            j2 = c[f2 >> 2] | 0;
            b2 = a2 + 4 | 0;
            h2 = c[b2 >> 2] | 0;
            if ((j2 | 0) == (h2 | 0)) {
              c[f2 >> 2] = 0;
              j2 = 0;
            }
            g2 = a2 + 12 | 0;
            if ((c[g2 >> 2] | 0) != (j2 | 0)) {
              i2 = e2;
              return;
            }
            Qc(d2, (h2 * 3 | 0) + 1 >> 1);
            l2 = c[g2 >> 2] | 0;
            m2 = c[b2 >> 2] | 0;
            if ((l2 | 0) < (m2 | 0)) {
              j2 = c[a2 >> 2] | 0;
              k2 = c[d2 >> 2] | 0;
              m2 = 0;
              while (1) {
                h2 = m2 + 1 | 0;
                c[k2 + (m2 << 2) >> 2] = c[j2 + (l2 << 2) >> 2];
                l2 = l2 + 1 | 0;
                m2 = c[b2 >> 2] | 0;
                if ((l2 | 0) >= (m2 | 0)) {
                  k2 = h2;
                  break;
                } else
                  m2 = h2;
              }
            } else
              k2 = 0;
            h2 = c[a2 >> 2] | 0;
            if ((c[f2 >> 2] | 0) > 0) {
              j2 = c[d2 >> 2] | 0;
              l2 = 0;
              while (1) {
                c[j2 + (k2 << 2) >> 2] = c[h2 + (l2 << 2) >> 2];
                l2 = l2 + 1 | 0;
                if ((l2 | 0) >= (c[f2 >> 2] | 0))
                  break;
                else
                  k2 = k2 + 1 | 0;
              }
              m2 = c[b2 >> 2] | 0;
            }
            c[g2 >> 2] = 0;
            c[f2 >> 2] = m2;
            if (!h2)
              f2 = a2 + 8 | 0;
            else {
              c[b2 >> 2] = 0;
              Td(h2);
              c[a2 >> 2] = 0;
              f2 = a2 + 8 | 0;
              c[f2 >> 2] = 0;
            }
            c[a2 >> 2] = c[d2 >> 2];
            l2 = d2 + 4 | 0;
            c[b2 >> 2] = c[l2 >> 2];
            m2 = d2 + 8 | 0;
            c[f2 >> 2] = c[m2 >> 2];
            c[d2 >> 2] = 0;
            c[l2 >> 2] = 0;
            c[m2 >> 2] = 0;
            i2 = e2;
            return;
          }
          function _c(a2, b2) {
            a2 = a2 | 0;
            b2 = b2 | 0;
            var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h2 = 0, j2 = 0;
            d2 = i2;
            e2 = a2 + 4 | 0;
            f2 = c[e2 >> 2] | 0;
            g2 = a2 + 8 | 0;
            h2 = c[g2 >> 2] | 0;
            if ((f2 | 0) == (h2 | 0) & (h2 | 0) < (f2 + 1 | 0)) {
              h2 = (f2 >> 1) + 2 & -2;
              h2 = (h2 | 0) < 2 ? 2 : h2;
              if ((h2 | 0) > (2147483647 - f2 | 0)) {
                h2 = va(1) | 0;
                Ta(h2 | 0, 48, 0);
              }
              j2 = c[a2 >> 2] | 0;
              f2 = h2 + f2 | 0;
              c[g2 >> 2] = f2;
              f2 = Ud(j2, f2 << 2) | 0;
              c[a2 >> 2] = f2;
              if ((f2 | 0) == 0 ? (c[(Oa() | 0) >> 2] | 0) == 12 : 0) {
                j2 = va(1) | 0;
                Ta(j2 | 0, 48, 0);
              }
            } else
              f2 = c[a2 >> 2] | 0;
            j2 = c[e2 >> 2] | 0;
            c[e2 >> 2] = j2 + 1;
            e2 = f2 + (j2 << 2) | 0;
            if (!e2) {
              i2 = d2;
              return;
            }
            c[e2 >> 2] = c[b2 >> 2];
            i2 = d2;
            return;
          }
          function $c() {
            var a2 = 0, b2 = 0;
            b2 = i2;
            Ka(3864) | 0;
            a2 = od(936) | 0;
            xc(a2);
            i2 = b2;
            return a2 | 0;
          }
          function ad(a2) {
            a2 = a2 | 0;
            var b2 = 0;
            b2 = i2;
            if (!a2) {
              i2 = b2;
              return;
            }
            gb[c[(c[a2 >> 2] | 0) + 4 >> 2] & 31](a2);
            i2 = b2;
            return;
          }
          function bd() {
            var b2 = 0, d2 = 0, e2 = 0;
            b2 = i2;
            i2 = i2 + 16 | 0;
            d2 = b2;
            e2 = od(936) | 0;
            xc(e2);
            c[964] = e2;
            Cc(e2, 1) | 0;
            e2 = c[964] | 0;
            a[d2 + 0 >> 0] = a[3840] | 0;
            Ac(e2, d2, 1) | 0;
            i2 = b2;
            return;
          }
          function cd(b2) {
            b2 = b2 | 0;
            var d2 = 0, e2 = 0, f2 = 0;
            d2 = i2;
            i2 = i2 + 16 | 0;
            e2 = d2;
            if ((c[962] | 0) >= (b2 | 0)) {
              i2 = d2;
              return;
            }
            do {
              f2 = c[964] | 0;
              a[e2 + 0 >> 0] = a[3840] | 0;
              Ac(f2, e2, 1) | 0;
              f2 = (c[962] | 0) + 1 | 0;
              c[962] = f2;
            } while ((f2 | 0) < (b2 | 0));
            i2 = d2;
            return;
          }
          function dd(b2) {
            b2 = b2 | 0;
            var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h2 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0;
            g2 = i2;
            i2 = i2 + 32 | 0;
            h2 = g2 + 16 | 0;
            e2 = g2 + 4 | 0;
            j2 = g2;
            c[e2 >> 2] = 0;
            f2 = e2 + 4 | 0;
            c[f2 >> 2] = 0;
            d2 = e2 + 8 | 0;
            c[d2 >> 2] = 0;
            k2 = c[b2 >> 2] | 0;
            if (k2)
              do {
                l2 = (k2 | 0) < 0 ? 0 - k2 | 0 : k2;
                if ((c[962] | 0) < (l2 | 0))
                  do {
                    m2 = c[964] | 0;
                    a[h2 + 0 >> 0] = a[3840] | 0;
                    Ac(m2, h2, 1) | 0;
                    m2 = (c[962] | 0) + 1 | 0;
                    c[962] = m2;
                  } while ((m2 | 0) < (l2 | 0));
                c[j2 >> 2] = l2 << 1 | k2 >>> 31;
                mc(e2, j2);
                b2 = b2 + 4 | 0;
                k2 = c[b2 >> 2] | 0;
              } while ((k2 | 0) != 0);
            j2 = c[964] | 0;
            h2 = j2 + 628 | 0;
            ld(e2, h2);
            h2 = Dc(j2, h2) | 0;
            j2 = c[e2 >> 2] | 0;
            if (!j2) {
              i2 = g2;
              return h2 | 0;
            }
            c[f2 >> 2] = 0;
            Td(j2);
            c[e2 >> 2] = 0;
            c[d2 >> 2] = 0;
            i2 = g2;
            return h2 | 0;
          }
          function ed() {
            var b2 = 0, d2 = 0, e2 = 0, f2 = 0;
            d2 = i2;
            i2 = i2 + 16 | 0;
            b2 = d2;
            e2 = c[964] | 0;
            f2 = e2 + 664 | 0;
            c[f2 + 0 >> 2] = -1;
            c[f2 + 4 >> 2] = -1;
            c[f2 + 8 >> 2] = -1;
            c[f2 + 12 >> 2] = -1;
            if (c[e2 + 304 >> 2] | 0)
              c[e2 + 308 >> 2] = 0;
            Bc(b2, e2, 1, 0);
            i2 = d2;
            return (a[b2 >> 0] | 0) == 0 | 0;
          }
          function fd() {
            return (c[(c[964] | 0) + 4 >> 2] | 0) + 1 | 0;
          }
          function gd() {
            return c[962] | 0;
          }
          function hd(b2) {
            b2 = b2 | 0;
            var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h2 = 0, j2 = 0;
            d2 = i2;
            i2 = i2 + 32 | 0;
            h2 = d2 + 16 | 0;
            f2 = d2 + 4 | 0;
            j2 = d2;
            c[f2 >> 2] = 0;
            e2 = f2 + 4 | 0;
            c[e2 >> 2] = 0;
            g2 = f2 + 8 | 0;
            c[g2 >> 2] = 0;
            c[j2 >> 2] = b2 << 1;
            mc(f2, j2);
            b2 = c[964] | 0;
            j2 = b2 + 664 | 0;
            c[j2 + 0 >> 2] = -1;
            c[j2 + 4 >> 2] = -1;
            c[j2 + 8 >> 2] = -1;
            c[j2 + 12 >> 2] = -1;
            ld(f2, b2 + 304 | 0);
            Bc(h2, b2, 1, 0);
            b2 = (a[h2 >> 0] | 0) == 0;
            h2 = c[f2 >> 2] | 0;
            if (!h2) {
              i2 = d2;
              return b2 | 0;
            }
            c[e2 >> 2] = 0;
            Td(h2);
            c[f2 >> 2] = 0;
            c[g2 >> 2] = 0;
            i2 = d2;
            return b2 | 0;
          }
          function id(a2) {
            a2 = a2 | 0;
            var b2 = 0, d2 = 0, e2 = 0;
            b2 = i2;
            i2 = i2 + 16 | 0;
            e2 = b2;
            d2 = c[964] | 0;
            c[e2 >> 2] = a2 << 1 | 1;
            a2 = d2 + 628 | 0;
            if (c[a2 >> 2] | 0)
              c[d2 + 632 >> 2] = 0;
            mc(a2, e2);
            Dc(d2, a2) | 0;
            i2 = b2;
            return;
          }
          function jd() {
            return c[(c[964] | 0) + 36 >> 2] | 0;
          }
          function kd() {
            return c[(c[964] | 0) + 32 >> 2] | 0;
          }
          function ld(a2, b2) {
            a2 = a2 | 0;
            b2 = b2 | 0;
            var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h2 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0;
            d2 = i2;
            h2 = c[b2 >> 2] | 0;
            e2 = b2 + 4 | 0;
            if (!h2)
              j2 = c[e2 >> 2] | 0;
            else {
              c[e2 >> 2] = 0;
              j2 = 0;
            }
            e2 = a2 + 4 | 0;
            f2 = c[e2 >> 2] | 0;
            g2 = b2 + 4 | 0;
            if ((j2 | 0) < (f2 | 0)) {
              k2 = b2 + 8 | 0;
              j2 = c[k2 >> 2] | 0;
              if ((j2 | 0) < (f2 | 0)) {
                m2 = f2 + 1 - j2 & -2;
                l2 = (j2 >> 1) + 2 & -2;
                l2 = (m2 | 0) > (l2 | 0) ? m2 : l2;
                if ((l2 | 0) > (2147483647 - j2 | 0)) {
                  m2 = va(1) | 0;
                  Ta(m2 | 0, 48, 0);
                }
                m2 = l2 + j2 | 0;
                c[k2 >> 2] = m2;
                h2 = Ud(h2, m2 << 2) | 0;
                c[b2 >> 2] = h2;
                if ((h2 | 0) == 0 ? (c[(Oa() | 0) >> 2] | 0) == 12 : 0) {
                  m2 = va(1) | 0;
                  Ta(m2 | 0, 48, 0);
                }
              }
              j2 = c[g2 >> 2] | 0;
              a:
                do
                  if ((j2 | 0) < (f2 | 0))
                    while (1) {
                      h2 = h2 + (j2 << 2) | 0;
                      if (h2)
                        c[h2 >> 2] = 0;
                      j2 = j2 + 1 | 0;
                      if ((j2 | 0) == (f2 | 0))
                        break a;
                      h2 = c[b2 >> 2] | 0;
                    }
                while (0);
              c[g2 >> 2] = f2;
              f2 = c[e2 >> 2] | 0;
            }
            if ((f2 | 0) <= 0) {
              i2 = d2;
              return;
            }
            b2 = c[b2 >> 2] | 0;
            a2 = c[a2 >> 2] | 0;
            f2 = 0;
            do {
              c[b2 + (f2 << 2) >> 2] = c[a2 + (f2 << 2) >> 2];
              f2 = f2 + 1 | 0;
            } while ((f2 | 0) < (c[e2 >> 2] | 0));
            i2 = d2;
            return;
          }
          function md(a2, b2) {
            a2 = a2 | 0;
            b2 = b2 | 0;
            var d2 = 0;
            d2 = i2;
            i2 = i2 + 16 | 0;
            c[d2 >> 2] = b2;
            b2 = c[p >> 2] | 0;
            ua(b2 | 0, a2 | 0, d2 | 0) | 0;
            Sa(10, b2 | 0) | 0;
            Wa();
          }
          function nd() {
            var a2 = 0, b2 = 0;
            a2 = i2;
            i2 = i2 + 16 | 0;
            if (!(Ja(4064, 3) | 0)) {
              b2 = Ha(c[1014] | 0) | 0;
              i2 = a2;
              return b2 | 0;
            } else
              md(4072, a2);
            return 0;
          }
          function od(a2) {
            a2 = a2 | 0;
            var b2 = 0, d2 = 0;
            b2 = i2;
            a2 = (a2 | 0) == 0 ? 1 : a2;
            d2 = Sd(a2) | 0;
            if (d2) {
              i2 = b2;
              return d2 | 0;
            }
            while (1) {
              d2 = vd() | 0;
              if (!d2) {
                a2 = 4;
                break;
              }
              jb[d2 & 3]();
              d2 = Sd(a2) | 0;
              if (d2) {
                a2 = 5;
                break;
              }
            }
            if ((a2 | 0) == 4) {
              d2 = va(4) | 0;
              c[d2 >> 2] = 4248;
              Ta(d2 | 0, 4296, 12);
            } else if ((a2 | 0) == 5) {
              i2 = b2;
              return d2 | 0;
            }
            return 0;
          }
          function pd(a2) {
            a2 = a2 | 0;
            var b2 = 0;
            b2 = i2;
            Td(a2);
            i2 = b2;
            return;
          }
          function qd(a2) {
            a2 = a2 | 0;
            var b2 = 0;
            b2 = i2;
            pd(a2);
            i2 = b2;
            return;
          }
          function rd(a2) {
            a2 = a2 | 0;
            return;
          }
          function sd(a2) {
            a2 = a2 | 0;
            return 4264;
          }
          function td(a2) {
            a2 = a2 | 0;
            var b2 = 0;
            b2 = i2;
            i2 = i2 + 16 | 0;
            jb[a2 & 3]();
            md(4312, b2);
          }
          function ud() {
            var a2 = 0, b2 = 0;
            b2 = nd() | 0;
            if (((b2 | 0) != 0 ? (a2 = c[b2 >> 2] | 0, (a2 | 0) != 0) : 0) ? (b2 = a2 + 48 | 0, (c[b2 >> 2] & -256 | 0) == 1126902528 ? (c[b2 + 4 >> 2] | 0) == 1129074247 : 0) : 0)
              td(c[a2 + 12 >> 2] | 0);
            b2 = c[968] | 0;
            c[968] = b2 + 0;
            td(b2);
          }
          function vd() {
            var a2 = 0;
            a2 = c[1102] | 0;
            c[1102] = a2 + 0;
            return a2 | 0;
          }
          function wd(a2) {
            a2 = a2 | 0;
            return;
          }
          function xd(a2) {
            a2 = a2 | 0;
            return;
          }
          function yd(a2) {
            a2 = a2 | 0;
            return;
          }
          function zd(a2) {
            a2 = a2 | 0;
            return;
          }
          function Ad(a2) {
            a2 = a2 | 0;
            return;
          }
          function Bd(a2) {
            a2 = a2 | 0;
            var b2 = 0;
            b2 = i2;
            pd(a2);
            i2 = b2;
            return;
          }
          function Cd(a2) {
            a2 = a2 | 0;
            var b2 = 0;
            b2 = i2;
            pd(a2);
            i2 = b2;
            return;
          }
          function Dd(a2, b2, d2) {
            a2 = a2 | 0;
            b2 = b2 | 0;
            d2 = d2 | 0;
            var e2 = 0, f2 = 0, g2 = 0, h2 = 0;
            e2 = i2;
            i2 = i2 + 64 | 0;
            f2 = e2;
            if ((a2 | 0) == (b2 | 0)) {
              h2 = 1;
              i2 = e2;
              return h2 | 0;
            }
            if (!b2) {
              h2 = 0;
              i2 = e2;
              return h2 | 0;
            }
            b2 = Hd(b2, 4504, 4560, 0) | 0;
            if (!b2) {
              h2 = 0;
              i2 = e2;
              return h2 | 0;
            }
            h2 = f2 + 0 | 0;
            g2 = h2 + 56 | 0;
            do {
              c[h2 >> 2] = 0;
              h2 = h2 + 4 | 0;
            } while ((h2 | 0) < (g2 | 0));
            c[f2 >> 2] = b2;
            c[f2 + 8 >> 2] = a2;
            c[f2 + 12 >> 2] = -1;
            c[f2 + 48 >> 2] = 1;
            mb[c[(c[b2 >> 2] | 0) + 28 >> 2] & 3](b2, f2, c[d2 >> 2] | 0, 1);
            if ((c[f2 + 24 >> 2] | 0) != 1) {
              h2 = 0;
              i2 = e2;
              return h2 | 0;
            }
            c[d2 >> 2] = c[f2 + 16 >> 2];
            h2 = 1;
            i2 = e2;
            return h2 | 0;
          }
          function Ed(b2, d2, e2, f2) {
            b2 = b2 | 0;
            d2 = d2 | 0;
            e2 = e2 | 0;
            f2 = f2 | 0;
            var g2 = 0, h2 = 0;
            b2 = i2;
            g2 = d2 + 16 | 0;
            h2 = c[g2 >> 2] | 0;
            if (!h2) {
              c[g2 >> 2] = e2;
              c[d2 + 24 >> 2] = f2;
              c[d2 + 36 >> 2] = 1;
              i2 = b2;
              return;
            }
            if ((h2 | 0) != (e2 | 0)) {
              h2 = d2 + 36 | 0;
              c[h2 >> 2] = (c[h2 >> 2] | 0) + 1;
              c[d2 + 24 >> 2] = 2;
              a[d2 + 54 >> 0] = 1;
              i2 = b2;
              return;
            }
            e2 = d2 + 24 | 0;
            if ((c[e2 >> 2] | 0) != 2) {
              i2 = b2;
              return;
            }
            c[e2 >> 2] = f2;
            i2 = b2;
            return;
          }
          function Fd(a2, b2, d2, e2) {
            a2 = a2 | 0;
            b2 = b2 | 0;
            d2 = d2 | 0;
            e2 = e2 | 0;
            var f2 = 0;
            f2 = i2;
            if ((c[b2 + 8 >> 2] | 0) != (a2 | 0)) {
              i2 = f2;
              return;
            }
            Ed(0, b2, d2, e2);
            i2 = f2;
            return;
          }
          function Gd(a2, b2, d2, e2) {
            a2 = a2 | 0;
            b2 = b2 | 0;
            d2 = d2 | 0;
            e2 = e2 | 0;
            var f2 = 0;
            f2 = i2;
            if ((a2 | 0) == (c[b2 + 8 >> 2] | 0)) {
              Ed(0, b2, d2, e2);
              i2 = f2;
              return;
            } else {
              a2 = c[a2 + 8 >> 2] | 0;
              mb[c[(c[a2 >> 2] | 0) + 28 >> 2] & 3](a2, b2, d2, e2);
              i2 = f2;
              return;
            }
          }
          function Hd(d2, e2, f2, g2) {
            d2 = d2 | 0;
            e2 = e2 | 0;
            f2 = f2 | 0;
            g2 = g2 | 0;
            var h2 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, n2 = 0, o2 = 0, p2 = 0, q2 = 0;
            h2 = i2;
            i2 = i2 + 64 | 0;
            j2 = h2;
            k2 = c[d2 >> 2] | 0;
            l2 = d2 + (c[k2 + -8 >> 2] | 0) | 0;
            k2 = c[k2 + -4 >> 2] | 0;
            c[j2 >> 2] = f2;
            c[j2 + 4 >> 2] = d2;
            c[j2 + 8 >> 2] = e2;
            c[j2 + 12 >> 2] = g2;
            n2 = j2 + 16 | 0;
            o2 = j2 + 20 | 0;
            e2 = j2 + 24 | 0;
            m2 = j2 + 28 | 0;
            g2 = j2 + 32 | 0;
            d2 = j2 + 40 | 0;
            p2 = (k2 | 0) == (f2 | 0);
            q2 = n2 + 0 | 0;
            f2 = q2 + 36 | 0;
            do {
              c[q2 >> 2] = 0;
              q2 = q2 + 4 | 0;
            } while ((q2 | 0) < (f2 | 0));
            b[n2 + 36 >> 1] = 0;
            a[n2 + 38 >> 0] = 0;
            if (p2) {
              c[j2 + 48 >> 2] = 1;
              kb[c[(c[k2 >> 2] | 0) + 20 >> 2] & 3](k2, j2, l2, l2, 1, 0);
              q2 = (c[e2 >> 2] | 0) == 1 ? l2 : 0;
              i2 = h2;
              return q2 | 0;
            }
            fb[c[(c[k2 >> 2] | 0) + 24 >> 2] & 3](k2, j2, l2, 1, 0);
            j2 = c[j2 + 36 >> 2] | 0;
            if (!j2) {
              q2 = (c[d2 >> 2] | 0) == 1 & (c[m2 >> 2] | 0) == 1 & (c[g2 >> 2] | 0) == 1 ? c[o2 >> 2] | 0 : 0;
              i2 = h2;
              return q2 | 0;
            } else if ((j2 | 0) == 1) {
              if ((c[e2 >> 2] | 0) != 1 ? !((c[d2 >> 2] | 0) == 0 & (c[m2 >> 2] | 0) == 1 & (c[g2 >> 2] | 0) == 1) : 0) {
                q2 = 0;
                i2 = h2;
                return q2 | 0;
              }
              q2 = c[n2 >> 2] | 0;
              i2 = h2;
              return q2 | 0;
            } else {
              q2 = 0;
              i2 = h2;
              return q2 | 0;
            }
            return 0;
          }
          function Id(b2, d2, e2, f2, g2) {
            b2 = b2 | 0;
            d2 = d2 | 0;
            e2 = e2 | 0;
            f2 = f2 | 0;
            g2 = g2 | 0;
            var h2 = 0;
            b2 = i2;
            a[d2 + 53 >> 0] = 1;
            if ((c[d2 + 4 >> 2] | 0) != (f2 | 0)) {
              i2 = b2;
              return;
            }
            a[d2 + 52 >> 0] = 1;
            f2 = d2 + 16 | 0;
            h2 = c[f2 >> 2] | 0;
            if (!h2) {
              c[f2 >> 2] = e2;
              c[d2 + 24 >> 2] = g2;
              c[d2 + 36 >> 2] = 1;
              if (!((g2 | 0) == 1 ? (c[d2 + 48 >> 2] | 0) == 1 : 0)) {
                i2 = b2;
                return;
              }
              a[d2 + 54 >> 0] = 1;
              i2 = b2;
              return;
            }
            if ((h2 | 0) != (e2 | 0)) {
              h2 = d2 + 36 | 0;
              c[h2 >> 2] = (c[h2 >> 2] | 0) + 1;
              a[d2 + 54 >> 0] = 1;
              i2 = b2;
              return;
            }
            e2 = d2 + 24 | 0;
            f2 = c[e2 >> 2] | 0;
            if ((f2 | 0) == 2)
              c[e2 >> 2] = g2;
            else
              g2 = f2;
            if (!((g2 | 0) == 1 ? (c[d2 + 48 >> 2] | 0) == 1 : 0)) {
              i2 = b2;
              return;
            }
            a[d2 + 54 >> 0] = 1;
            i2 = b2;
            return;
          }
          function Jd(b2, d2, e2, f2, g2) {
            b2 = b2 | 0;
            d2 = d2 | 0;
            e2 = e2 | 0;
            f2 = f2 | 0;
            g2 = g2 | 0;
            var h2 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0;
            h2 = i2;
            if ((b2 | 0) == (c[d2 + 8 >> 2] | 0)) {
              if ((c[d2 + 4 >> 2] | 0) != (e2 | 0)) {
                i2 = h2;
                return;
              }
              j2 = d2 + 28 | 0;
              if ((c[j2 >> 2] | 0) == 1) {
                i2 = h2;
                return;
              }
              c[j2 >> 2] = f2;
              i2 = h2;
              return;
            }
            if ((b2 | 0) != (c[d2 >> 2] | 0)) {
              l2 = c[b2 + 8 >> 2] | 0;
              fb[c[(c[l2 >> 2] | 0) + 24 >> 2] & 3](l2, d2, e2, f2, g2);
              i2 = h2;
              return;
            }
            if ((c[d2 + 16 >> 2] | 0) != (e2 | 0) ? (k2 = d2 + 20 | 0, (c[k2 >> 2] | 0) != (e2 | 0)) : 0) {
              c[d2 + 32 >> 2] = f2;
              f2 = d2 + 44 | 0;
              if ((c[f2 >> 2] | 0) == 4) {
                i2 = h2;
                return;
              }
              l2 = d2 + 52 | 0;
              a[l2 >> 0] = 0;
              m2 = d2 + 53 | 0;
              a[m2 >> 0] = 0;
              b2 = c[b2 + 8 >> 2] | 0;
              kb[c[(c[b2 >> 2] | 0) + 20 >> 2] & 3](b2, d2, e2, e2, 1, g2);
              if (a[m2 >> 0] | 0) {
                if (!(a[l2 >> 0] | 0)) {
                  b2 = 1;
                  j2 = 13;
                }
              } else {
                b2 = 0;
                j2 = 13;
              }
              do
                if ((j2 | 0) == 13) {
                  c[k2 >> 2] = e2;
                  m2 = d2 + 40 | 0;
                  c[m2 >> 2] = (c[m2 >> 2] | 0) + 1;
                  if ((c[d2 + 36 >> 2] | 0) == 1 ? (c[d2 + 24 >> 2] | 0) == 2 : 0) {
                    a[d2 + 54 >> 0] = 1;
                    if (b2)
                      break;
                  } else
                    j2 = 16;
                  if ((j2 | 0) == 16 ? b2 : 0)
                    break;
                  c[f2 >> 2] = 4;
                  i2 = h2;
                  return;
                }
              while (0);
              c[f2 >> 2] = 3;
              i2 = h2;
              return;
            }
            if ((f2 | 0) != 1) {
              i2 = h2;
              return;
            }
            c[d2 + 32 >> 2] = 1;
            i2 = h2;
            return;
          }
          function Kd(b2, d2, e2, f2, g2) {
            b2 = b2 | 0;
            d2 = d2 | 0;
            e2 = e2 | 0;
            f2 = f2 | 0;
            g2 = g2 | 0;
            var h2 = 0;
            g2 = i2;
            if ((c[d2 + 8 >> 2] | 0) == (b2 | 0)) {
              if ((c[d2 + 4 >> 2] | 0) != (e2 | 0)) {
                i2 = g2;
                return;
              }
              d2 = d2 + 28 | 0;
              if ((c[d2 >> 2] | 0) == 1) {
                i2 = g2;
                return;
              }
              c[d2 >> 2] = f2;
              i2 = g2;
              return;
            }
            if ((c[d2 >> 2] | 0) != (b2 | 0)) {
              i2 = g2;
              return;
            }
            if ((c[d2 + 16 >> 2] | 0) != (e2 | 0) ? (h2 = d2 + 20 | 0, (c[h2 >> 2] | 0) != (e2 | 0)) : 0) {
              c[d2 + 32 >> 2] = f2;
              c[h2 >> 2] = e2;
              b2 = d2 + 40 | 0;
              c[b2 >> 2] = (c[b2 >> 2] | 0) + 1;
              if ((c[d2 + 36 >> 2] | 0) == 1 ? (c[d2 + 24 >> 2] | 0) == 2 : 0)
                a[d2 + 54 >> 0] = 1;
              c[d2 + 44 >> 2] = 4;
              i2 = g2;
              return;
            }
            if ((f2 | 0) != 1) {
              i2 = g2;
              return;
            }
            c[d2 + 32 >> 2] = 1;
            i2 = g2;
            return;
          }
          function Ld(a2, b2, d2, e2, f2, g2) {
            a2 = a2 | 0;
            b2 = b2 | 0;
            d2 = d2 | 0;
            e2 = e2 | 0;
            f2 = f2 | 0;
            g2 = g2 | 0;
            var h2 = 0;
            h2 = i2;
            if ((a2 | 0) == (c[b2 + 8 >> 2] | 0)) {
              Id(0, b2, d2, e2, f2);
              i2 = h2;
              return;
            } else {
              a2 = c[a2 + 8 >> 2] | 0;
              kb[c[(c[a2 >> 2] | 0) + 20 >> 2] & 3](a2, b2, d2, e2, f2, g2);
              i2 = h2;
              return;
            }
          }
          function Md(a2, b2, d2, e2, f2, g2) {
            a2 = a2 | 0;
            b2 = b2 | 0;
            d2 = d2 | 0;
            e2 = e2 | 0;
            f2 = f2 | 0;
            g2 = g2 | 0;
            g2 = i2;
            if ((c[b2 + 8 >> 2] | 0) != (a2 | 0)) {
              i2 = g2;
              return;
            }
            Id(0, b2, d2, e2, f2);
            i2 = g2;
            return;
          }
          function Nd(a2, b2, d2) {
            a2 = a2 | 0;
            b2 = b2 | 0;
            d2 = d2 | 0;
            var e2 = 0, f2 = 0;
            e2 = i2;
            i2 = i2 + 16 | 0;
            f2 = e2;
            c[f2 >> 2] = c[d2 >> 2];
            a2 = eb[c[(c[a2 >> 2] | 0) + 16 >> 2] & 1](a2, b2, f2) | 0;
            b2 = a2 & 1;
            if (!a2) {
              i2 = e2;
              return b2 | 0;
            }
            c[d2 >> 2] = c[f2 >> 2];
            i2 = e2;
            return b2 | 0;
          }
          function Od(a2) {
            a2 = a2 | 0;
            var b2 = 0;
            b2 = i2;
            if (!a2)
              a2 = 0;
            else
              a2 = (Hd(a2, 4504, 4672, 0) | 0) != 0;
            i2 = b2;
            return a2 & 1 | 0;
          }
          function Pd() {
            var a2 = 0, b2 = 0, d2 = 0, e2 = 0, f2 = 0;
            a2 = i2;
            i2 = i2 + 16 | 0;
            b2 = a2;
            a2 = a2 + 12 | 0;
            d2 = nd() | 0;
            if (!d2)
              md(4040, b2);
            d2 = c[d2 >> 2] | 0;
            if (!d2)
              md(4040, b2);
            f2 = d2 + 48 | 0;
            e2 = c[f2 >> 2] | 0;
            f2 = c[f2 + 4 >> 2] | 0;
            if (!((e2 & -256 | 0) == 1126902528 & (f2 | 0) == 1129074247)) {
              c[b2 >> 2] = c[970];
              md(4e3, b2);
            }
            if ((e2 | 0) == 1126902529 & (f2 | 0) == 1129074247)
              e2 = c[d2 + 44 >> 2] | 0;
            else
              e2 = d2 + 80 | 0;
            c[a2 >> 2] = e2;
            f2 = c[d2 >> 2] | 0;
            d2 = c[f2 + 4 >> 2] | 0;
            if (eb[c[(c[4432 >> 2] | 0) + 16 >> 2] & 1](4432, f2, a2) | 0) {
              f2 = c[a2 >> 2] | 0;
              e2 = c[970] | 0;
              f2 = ib[c[(c[f2 >> 2] | 0) + 8 >> 2] & 1](f2) | 0;
              c[b2 >> 2] = e2;
              c[b2 + 4 >> 2] = d2;
              c[b2 + 8 >> 2] = f2;
              md(3904, b2);
            } else {
              c[b2 >> 2] = c[970];
              c[b2 + 4 >> 2] = d2;
              md(3952, b2);
            }
          }
          function Qd() {
            var a2 = 0;
            a2 = i2;
            i2 = i2 + 16 | 0;
            if (!(Ma(4056, 20) | 0)) {
              i2 = a2;
              return;
            } else
              md(4128, a2);
          }
          function Rd(a2) {
            a2 = a2 | 0;
            var b2 = 0;
            b2 = i2;
            i2 = i2 + 16 | 0;
            Td(a2);
            if (!(Pa(c[1014] | 0, 0) | 0)) {
              i2 = b2;
              return;
            } else
              md(4184, b2);
          }
          function Sd(a2) {
            a2 = a2 | 0;
            var b2 = 0, d2 = 0, e2 = 0, f2 = 0, g2 = 0, h2 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, n2 = 0, o2 = 0, p2 = 0, q2 = 0, r2 = 0, s2 = 0, t2 = 0, u2 = 0, v2 = 0, w2 = 0, x2 = 0, y2 = 0, z2 = 0, A2 = 0, B2 = 0, C2 = 0, D2 = 0, E2 = 0, F2 = 0, G2 = 0, H2 = 0;
            b2 = i2;
            do
              if (a2 >>> 0 < 245) {
                if (a2 >>> 0 < 11)
                  a2 = 16;
                else
                  a2 = a2 + 11 & -8;
                x2 = a2 >>> 3;
                p2 = c[1206] | 0;
                w2 = p2 >>> x2;
                if (w2 & 3) {
                  g2 = (w2 & 1 ^ 1) + x2 | 0;
                  f2 = g2 << 1;
                  d2 = 4864 + (f2 << 2) | 0;
                  f2 = 4864 + (f2 + 2 << 2) | 0;
                  h2 = c[f2 >> 2] | 0;
                  j2 = h2 + 8 | 0;
                  e2 = c[j2 >> 2] | 0;
                  do
                    if ((d2 | 0) != (e2 | 0)) {
                      if (e2 >>> 0 < (c[1210] | 0) >>> 0)
                        Wa();
                      k2 = e2 + 12 | 0;
                      if ((c[k2 >> 2] | 0) == (h2 | 0)) {
                        c[k2 >> 2] = d2;
                        c[f2 >> 2] = e2;
                        break;
                      } else
                        Wa();
                    } else
                      c[1206] = p2 & ~(1 << g2);
                  while (0);
                  H2 = g2 << 3;
                  c[h2 + 4 >> 2] = H2 | 3;
                  H2 = h2 + (H2 | 4) | 0;
                  c[H2 >> 2] = c[H2 >> 2] | 1;
                  H2 = j2;
                  i2 = b2;
                  return H2 | 0;
                }
                v2 = c[1208] | 0;
                if (a2 >>> 0 > v2 >>> 0) {
                  if (w2) {
                    h2 = 2 << x2;
                    h2 = w2 << x2 & (h2 | 0 - h2);
                    h2 = (h2 & 0 - h2) + -1 | 0;
                    d2 = h2 >>> 12 & 16;
                    h2 = h2 >>> d2;
                    j2 = h2 >>> 5 & 8;
                    h2 = h2 >>> j2;
                    f2 = h2 >>> 2 & 4;
                    h2 = h2 >>> f2;
                    g2 = h2 >>> 1 & 2;
                    h2 = h2 >>> g2;
                    e2 = h2 >>> 1 & 1;
                    e2 = (j2 | d2 | f2 | g2 | e2) + (h2 >>> e2) | 0;
                    h2 = e2 << 1;
                    g2 = 4864 + (h2 << 2) | 0;
                    h2 = 4864 + (h2 + 2 << 2) | 0;
                    f2 = c[h2 >> 2] | 0;
                    d2 = f2 + 8 | 0;
                    j2 = c[d2 >> 2] | 0;
                    do
                      if ((g2 | 0) != (j2 | 0)) {
                        if (j2 >>> 0 < (c[1210] | 0) >>> 0)
                          Wa();
                        k2 = j2 + 12 | 0;
                        if ((c[k2 >> 2] | 0) == (f2 | 0)) {
                          c[k2 >> 2] = g2;
                          c[h2 >> 2] = j2;
                          E2 = c[1208] | 0;
                          break;
                        } else
                          Wa();
                      } else {
                        c[1206] = p2 & ~(1 << e2);
                        E2 = v2;
                      }
                    while (0);
                    H2 = e2 << 3;
                    e2 = H2 - a2 | 0;
                    c[f2 + 4 >> 2] = a2 | 3;
                    g2 = f2 + a2 | 0;
                    c[f2 + (a2 | 4) >> 2] = e2 | 1;
                    c[f2 + H2 >> 2] = e2;
                    if (E2) {
                      f2 = c[1211] | 0;
                      l2 = E2 >>> 3;
                      j2 = l2 << 1;
                      h2 = 4864 + (j2 << 2) | 0;
                      k2 = c[1206] | 0;
                      l2 = 1 << l2;
                      if (k2 & l2) {
                        j2 = 4864 + (j2 + 2 << 2) | 0;
                        k2 = c[j2 >> 2] | 0;
                        if (k2 >>> 0 < (c[1210] | 0) >>> 0)
                          Wa();
                        else {
                          D2 = j2;
                          C2 = k2;
                        }
                      } else {
                        c[1206] = k2 | l2;
                        D2 = 4864 + (j2 + 2 << 2) | 0;
                        C2 = h2;
                      }
                      c[D2 >> 2] = f2;
                      c[C2 + 12 >> 2] = f2;
                      c[f2 + 8 >> 2] = C2;
                      c[f2 + 12 >> 2] = h2;
                    }
                    c[1208] = e2;
                    c[1211] = g2;
                    H2 = d2;
                    i2 = b2;
                    return H2 | 0;
                  }
                  p2 = c[1207] | 0;
                  if (p2) {
                    d2 = (p2 & 0 - p2) + -1 | 0;
                    G2 = d2 >>> 12 & 16;
                    d2 = d2 >>> G2;
                    F2 = d2 >>> 5 & 8;
                    d2 = d2 >>> F2;
                    H2 = d2 >>> 2 & 4;
                    d2 = d2 >>> H2;
                    f2 = d2 >>> 1 & 2;
                    d2 = d2 >>> f2;
                    e2 = d2 >>> 1 & 1;
                    e2 = c[5128 + ((F2 | G2 | H2 | f2 | e2) + (d2 >>> e2) << 2) >> 2] | 0;
                    d2 = (c[e2 + 4 >> 2] & -8) - a2 | 0;
                    f2 = e2;
                    while (1) {
                      g2 = c[f2 + 16 >> 2] | 0;
                      if (!g2) {
                        g2 = c[f2 + 20 >> 2] | 0;
                        if (!g2)
                          break;
                      }
                      f2 = (c[g2 + 4 >> 2] & -8) - a2 | 0;
                      H2 = f2 >>> 0 < d2 >>> 0;
                      d2 = H2 ? f2 : d2;
                      f2 = g2;
                      e2 = H2 ? g2 : e2;
                    }
                    h2 = c[1210] | 0;
                    if (e2 >>> 0 < h2 >>> 0)
                      Wa();
                    f2 = e2 + a2 | 0;
                    if (e2 >>> 0 >= f2 >>> 0)
                      Wa();
                    g2 = c[e2 + 24 >> 2] | 0;
                    k2 = c[e2 + 12 >> 2] | 0;
                    do
                      if ((k2 | 0) == (e2 | 0)) {
                        k2 = e2 + 20 | 0;
                        j2 = c[k2 >> 2] | 0;
                        if (!j2) {
                          k2 = e2 + 16 | 0;
                          j2 = c[k2 >> 2] | 0;
                          if (!j2) {
                            B2 = 0;
                            break;
                          }
                        }
                        while (1) {
                          l2 = j2 + 20 | 0;
                          m2 = c[l2 >> 2] | 0;
                          if (m2) {
                            j2 = m2;
                            k2 = l2;
                            continue;
                          }
                          l2 = j2 + 16 | 0;
                          m2 = c[l2 >> 2] | 0;
                          if (!m2)
                            break;
                          else {
                            j2 = m2;
                            k2 = l2;
                          }
                        }
                        if (k2 >>> 0 < h2 >>> 0)
                          Wa();
                        else {
                          c[k2 >> 2] = 0;
                          B2 = j2;
                          break;
                        }
                      } else {
                        j2 = c[e2 + 8 >> 2] | 0;
                        if (j2 >>> 0 < h2 >>> 0)
                          Wa();
                        h2 = j2 + 12 | 0;
                        if ((c[h2 >> 2] | 0) != (e2 | 0))
                          Wa();
                        l2 = k2 + 8 | 0;
                        if ((c[l2 >> 2] | 0) == (e2 | 0)) {
                          c[h2 >> 2] = k2;
                          c[l2 >> 2] = j2;
                          B2 = k2;
                          break;
                        } else
                          Wa();
                      }
                    while (0);
                    do
                      if (g2) {
                        j2 = c[e2 + 28 >> 2] | 0;
                        h2 = 5128 + (j2 << 2) | 0;
                        if ((e2 | 0) == (c[h2 >> 2] | 0)) {
                          c[h2 >> 2] = B2;
                          if (!B2) {
                            c[1207] = c[1207] & ~(1 << j2);
                            break;
                          }
                        } else {
                          if (g2 >>> 0 < (c[1210] | 0) >>> 0)
                            Wa();
                          h2 = g2 + 16 | 0;
                          if ((c[h2 >> 2] | 0) == (e2 | 0))
                            c[h2 >> 2] = B2;
                          else
                            c[g2 + 20 >> 2] = B2;
                          if (!B2)
                            break;
                        }
                        h2 = c[1210] | 0;
                        if (B2 >>> 0 < h2 >>> 0)
                          Wa();
                        c[B2 + 24 >> 2] = g2;
                        g2 = c[e2 + 16 >> 2] | 0;
                        do
                          if (g2)
                            if (g2 >>> 0 < h2 >>> 0)
                              Wa();
                            else {
                              c[B2 + 16 >> 2] = g2;
                              c[g2 + 24 >> 2] = B2;
                              break;
                            }
                        while (0);
                        g2 = c[e2 + 20 >> 2] | 0;
                        if (g2)
                          if (g2 >>> 0 < (c[1210] | 0) >>> 0)
                            Wa();
                          else {
                            c[B2 + 20 >> 2] = g2;
                            c[g2 + 24 >> 2] = B2;
                            break;
                          }
                      }
                    while (0);
                    if (d2 >>> 0 < 16) {
                      H2 = d2 + a2 | 0;
                      c[e2 + 4 >> 2] = H2 | 3;
                      H2 = e2 + (H2 + 4) | 0;
                      c[H2 >> 2] = c[H2 >> 2] | 1;
                    } else {
                      c[e2 + 4 >> 2] = a2 | 3;
                      c[e2 + (a2 | 4) >> 2] = d2 | 1;
                      c[e2 + (d2 + a2) >> 2] = d2;
                      h2 = c[1208] | 0;
                      if (h2) {
                        g2 = c[1211] | 0;
                        k2 = h2 >>> 3;
                        l2 = k2 << 1;
                        h2 = 4864 + (l2 << 2) | 0;
                        j2 = c[1206] | 0;
                        k2 = 1 << k2;
                        if (j2 & k2) {
                          j2 = 4864 + (l2 + 2 << 2) | 0;
                          k2 = c[j2 >> 2] | 0;
                          if (k2 >>> 0 < (c[1210] | 0) >>> 0)
                            Wa();
                          else {
                            A2 = j2;
                            z2 = k2;
                          }
                        } else {
                          c[1206] = j2 | k2;
                          A2 = 4864 + (l2 + 2 << 2) | 0;
                          z2 = h2;
                        }
                        c[A2 >> 2] = g2;
                        c[z2 + 12 >> 2] = g2;
                        c[g2 + 8 >> 2] = z2;
                        c[g2 + 12 >> 2] = h2;
                      }
                      c[1208] = d2;
                      c[1211] = f2;
                    }
                    H2 = e2 + 8 | 0;
                    i2 = b2;
                    return H2 | 0;
                  }
                }
              } else if (a2 >>> 0 <= 4294967231) {
                z2 = a2 + 11 | 0;
                a2 = z2 & -8;
                B2 = c[1207] | 0;
                if (B2) {
                  A2 = 0 - a2 | 0;
                  z2 = z2 >>> 8;
                  if (z2)
                    if (a2 >>> 0 > 16777215)
                      C2 = 31;
                    else {
                      G2 = (z2 + 1048320 | 0) >>> 16 & 8;
                      H2 = z2 << G2;
                      F2 = (H2 + 520192 | 0) >>> 16 & 4;
                      H2 = H2 << F2;
                      C2 = (H2 + 245760 | 0) >>> 16 & 2;
                      C2 = 14 - (F2 | G2 | C2) + (H2 << C2 >>> 15) | 0;
                      C2 = a2 >>> (C2 + 7 | 0) & 1 | C2 << 1;
                    }
                  else
                    C2 = 0;
                  D2 = c[5128 + (C2 << 2) >> 2] | 0;
                  a:
                    do
                      if (!D2) {
                        F2 = 0;
                        z2 = 0;
                      } else {
                        if ((C2 | 0) == 31)
                          z2 = 0;
                        else
                          z2 = 25 - (C2 >>> 1) | 0;
                        F2 = 0;
                        E2 = a2 << z2;
                        z2 = 0;
                        while (1) {
                          G2 = c[D2 + 4 >> 2] & -8;
                          H2 = G2 - a2 | 0;
                          if (H2 >>> 0 < A2 >>> 0)
                            if ((G2 | 0) == (a2 | 0)) {
                              A2 = H2;
                              F2 = D2;
                              z2 = D2;
                              break a;
                            } else {
                              A2 = H2;
                              z2 = D2;
                            }
                          H2 = c[D2 + 20 >> 2] | 0;
                          D2 = c[D2 + (E2 >>> 31 << 2) + 16 >> 2] | 0;
                          F2 = (H2 | 0) == 0 | (H2 | 0) == (D2 | 0) ? F2 : H2;
                          if (!D2)
                            break;
                          else
                            E2 = E2 << 1;
                        }
                      }
                    while (0);
                  if ((F2 | 0) == 0 & (z2 | 0) == 0) {
                    H2 = 2 << C2;
                    B2 = B2 & (H2 | 0 - H2);
                    if (!B2)
                      break;
                    H2 = (B2 & 0 - B2) + -1 | 0;
                    D2 = H2 >>> 12 & 16;
                    H2 = H2 >>> D2;
                    C2 = H2 >>> 5 & 8;
                    H2 = H2 >>> C2;
                    E2 = H2 >>> 2 & 4;
                    H2 = H2 >>> E2;
                    G2 = H2 >>> 1 & 2;
                    H2 = H2 >>> G2;
                    F2 = H2 >>> 1 & 1;
                    F2 = c[5128 + ((C2 | D2 | E2 | G2 | F2) + (H2 >>> F2) << 2) >> 2] | 0;
                  }
                  if (F2)
                    while (1) {
                      H2 = (c[F2 + 4 >> 2] & -8) - a2 | 0;
                      B2 = H2 >>> 0 < A2 >>> 0;
                      A2 = B2 ? H2 : A2;
                      z2 = B2 ? F2 : z2;
                      B2 = c[F2 + 16 >> 2] | 0;
                      if (B2) {
                        F2 = B2;
                        continue;
                      }
                      F2 = c[F2 + 20 >> 2] | 0;
                      if (!F2)
                        break;
                    }
                  if ((z2 | 0) != 0 ? A2 >>> 0 < ((c[1208] | 0) - a2 | 0) >>> 0 : 0) {
                    f2 = c[1210] | 0;
                    if (z2 >>> 0 < f2 >>> 0)
                      Wa();
                    d2 = z2 + a2 | 0;
                    if (z2 >>> 0 >= d2 >>> 0)
                      Wa();
                    e2 = c[z2 + 24 >> 2] | 0;
                    g2 = c[z2 + 12 >> 2] | 0;
                    do
                      if ((g2 | 0) == (z2 | 0)) {
                        h2 = z2 + 20 | 0;
                        g2 = c[h2 >> 2] | 0;
                        if (!g2) {
                          h2 = z2 + 16 | 0;
                          g2 = c[h2 >> 2] | 0;
                          if (!g2) {
                            x2 = 0;
                            break;
                          }
                        }
                        while (1) {
                          j2 = g2 + 20 | 0;
                          k2 = c[j2 >> 2] | 0;
                          if (k2) {
                            g2 = k2;
                            h2 = j2;
                            continue;
                          }
                          j2 = g2 + 16 | 0;
                          k2 = c[j2 >> 2] | 0;
                          if (!k2)
                            break;
                          else {
                            g2 = k2;
                            h2 = j2;
                          }
                        }
                        if (h2 >>> 0 < f2 >>> 0)
                          Wa();
                        else {
                          c[h2 >> 2] = 0;
                          x2 = g2;
                          break;
                        }
                      } else {
                        h2 = c[z2 + 8 >> 2] | 0;
                        if (h2 >>> 0 < f2 >>> 0)
                          Wa();
                        j2 = h2 + 12 | 0;
                        if ((c[j2 >> 2] | 0) != (z2 | 0))
                          Wa();
                        f2 = g2 + 8 | 0;
                        if ((c[f2 >> 2] | 0) == (z2 | 0)) {
                          c[j2 >> 2] = g2;
                          c[f2 >> 2] = h2;
                          x2 = g2;
                          break;
                        } else
                          Wa();
                      }
                    while (0);
                    do
                      if (e2) {
                        f2 = c[z2 + 28 >> 2] | 0;
                        g2 = 5128 + (f2 << 2) | 0;
                        if ((z2 | 0) == (c[g2 >> 2] | 0)) {
                          c[g2 >> 2] = x2;
                          if (!x2) {
                            c[1207] = c[1207] & ~(1 << f2);
                            break;
                          }
                        } else {
                          if (e2 >>> 0 < (c[1210] | 0) >>> 0)
                            Wa();
                          f2 = e2 + 16 | 0;
                          if ((c[f2 >> 2] | 0) == (z2 | 0))
                            c[f2 >> 2] = x2;
                          else
                            c[e2 + 20 >> 2] = x2;
                          if (!x2)
                            break;
                        }
                        f2 = c[1210] | 0;
                        if (x2 >>> 0 < f2 >>> 0)
                          Wa();
                        c[x2 + 24 >> 2] = e2;
                        e2 = c[z2 + 16 >> 2] | 0;
                        do
                          if (e2)
                            if (e2 >>> 0 < f2 >>> 0)
                              Wa();
                            else {
                              c[x2 + 16 >> 2] = e2;
                              c[e2 + 24 >> 2] = x2;
                              break;
                            }
                        while (0);
                        e2 = c[z2 + 20 >> 2] | 0;
                        if (e2)
                          if (e2 >>> 0 < (c[1210] | 0) >>> 0)
                            Wa();
                          else {
                            c[x2 + 20 >> 2] = e2;
                            c[e2 + 24 >> 2] = x2;
                            break;
                          }
                      }
                    while (0);
                    b:
                      do
                        if (A2 >>> 0 >= 16) {
                          c[z2 + 4 >> 2] = a2 | 3;
                          c[z2 + (a2 | 4) >> 2] = A2 | 1;
                          c[z2 + (A2 + a2) >> 2] = A2;
                          f2 = A2 >>> 3;
                          if (A2 >>> 0 < 256) {
                            h2 = f2 << 1;
                            e2 = 4864 + (h2 << 2) | 0;
                            g2 = c[1206] | 0;
                            f2 = 1 << f2;
                            do
                              if (!(g2 & f2)) {
                                c[1206] = g2 | f2;
                                w2 = 4864 + (h2 + 2 << 2) | 0;
                                v2 = e2;
                              } else {
                                f2 = 4864 + (h2 + 2 << 2) | 0;
                                g2 = c[f2 >> 2] | 0;
                                if (g2 >>> 0 >= (c[1210] | 0) >>> 0) {
                                  w2 = f2;
                                  v2 = g2;
                                  break;
                                }
                                Wa();
                              }
                            while (0);
                            c[w2 >> 2] = d2;
                            c[v2 + 12 >> 2] = d2;
                            c[z2 + (a2 + 8) >> 2] = v2;
                            c[z2 + (a2 + 12) >> 2] = e2;
                            break;
                          }
                          e2 = A2 >>> 8;
                          if (e2)
                            if (A2 >>> 0 > 16777215)
                              e2 = 31;
                            else {
                              G2 = (e2 + 1048320 | 0) >>> 16 & 8;
                              H2 = e2 << G2;
                              F2 = (H2 + 520192 | 0) >>> 16 & 4;
                              H2 = H2 << F2;
                              e2 = (H2 + 245760 | 0) >>> 16 & 2;
                              e2 = 14 - (F2 | G2 | e2) + (H2 << e2 >>> 15) | 0;
                              e2 = A2 >>> (e2 + 7 | 0) & 1 | e2 << 1;
                            }
                          else
                            e2 = 0;
                          f2 = 5128 + (e2 << 2) | 0;
                          c[z2 + (a2 + 28) >> 2] = e2;
                          c[z2 + (a2 + 20) >> 2] = 0;
                          c[z2 + (a2 + 16) >> 2] = 0;
                          g2 = c[1207] | 0;
                          h2 = 1 << e2;
                          if (!(g2 & h2)) {
                            c[1207] = g2 | h2;
                            c[f2 >> 2] = d2;
                            c[z2 + (a2 + 24) >> 2] = f2;
                            c[z2 + (a2 + 12) >> 2] = d2;
                            c[z2 + (a2 + 8) >> 2] = d2;
                            break;
                          }
                          h2 = c[f2 >> 2] | 0;
                          if ((e2 | 0) == 31)
                            e2 = 0;
                          else
                            e2 = 25 - (e2 >>> 1) | 0;
                          c:
                            do
                              if ((c[h2 + 4 >> 2] & -8 | 0) != (A2 | 0)) {
                                e2 = A2 << e2;
                                while (1) {
                                  g2 = h2 + (e2 >>> 31 << 2) + 16 | 0;
                                  f2 = c[g2 >> 2] | 0;
                                  if (!f2)
                                    break;
                                  if ((c[f2 + 4 >> 2] & -8 | 0) == (A2 | 0)) {
                                    p2 = f2;
                                    break c;
                                  } else {
                                    e2 = e2 << 1;
                                    h2 = f2;
                                  }
                                }
                                if (g2 >>> 0 < (c[1210] | 0) >>> 0)
                                  Wa();
                                else {
                                  c[g2 >> 2] = d2;
                                  c[z2 + (a2 + 24) >> 2] = h2;
                                  c[z2 + (a2 + 12) >> 2] = d2;
                                  c[z2 + (a2 + 8) >> 2] = d2;
                                  break b;
                                }
                              } else
                                p2 = h2;
                            while (0);
                          f2 = p2 + 8 | 0;
                          e2 = c[f2 >> 2] | 0;
                          H2 = c[1210] | 0;
                          if (p2 >>> 0 >= H2 >>> 0 & e2 >>> 0 >= H2 >>> 0) {
                            c[e2 + 12 >> 2] = d2;
                            c[f2 >> 2] = d2;
                            c[z2 + (a2 + 8) >> 2] = e2;
                            c[z2 + (a2 + 12) >> 2] = p2;
                            c[z2 + (a2 + 24) >> 2] = 0;
                            break;
                          } else
                            Wa();
                        } else {
                          H2 = A2 + a2 | 0;
                          c[z2 + 4 >> 2] = H2 | 3;
                          H2 = z2 + (H2 + 4) | 0;
                          c[H2 >> 2] = c[H2 >> 2] | 1;
                        }
                      while (0);
                    H2 = z2 + 8 | 0;
                    i2 = b2;
                    return H2 | 0;
                  }
                }
              } else
                a2 = -1;
            while (0);
            p2 = c[1208] | 0;
            if (p2 >>> 0 >= a2 >>> 0) {
              e2 = p2 - a2 | 0;
              d2 = c[1211] | 0;
              if (e2 >>> 0 > 15) {
                c[1211] = d2 + a2;
                c[1208] = e2;
                c[d2 + (a2 + 4) >> 2] = e2 | 1;
                c[d2 + p2 >> 2] = e2;
                c[d2 + 4 >> 2] = a2 | 3;
              } else {
                c[1208] = 0;
                c[1211] = 0;
                c[d2 + 4 >> 2] = p2 | 3;
                H2 = d2 + (p2 + 4) | 0;
                c[H2 >> 2] = c[H2 >> 2] | 1;
              }
              H2 = d2 + 8 | 0;
              i2 = b2;
              return H2 | 0;
            }
            p2 = c[1209] | 0;
            if (p2 >>> 0 > a2 >>> 0) {
              G2 = p2 - a2 | 0;
              c[1209] = G2;
              H2 = c[1212] | 0;
              c[1212] = H2 + a2;
              c[H2 + (a2 + 4) >> 2] = G2 | 1;
              c[H2 + 4 >> 2] = a2 | 3;
              H2 = H2 + 8 | 0;
              i2 = b2;
              return H2 | 0;
            }
            do
              if (!(c[1324] | 0)) {
                p2 = Ga(30) | 0;
                if (!(p2 + -1 & p2)) {
                  c[1326] = p2;
                  c[1325] = p2;
                  c[1327] = -1;
                  c[1328] = -1;
                  c[1329] = 0;
                  c[1317] = 0;
                  c[1324] = (Ya(0) | 0) & -16 ^ 1431655768;
                  break;
                } else
                  Wa();
              }
            while (0);
            x2 = a2 + 48 | 0;
            p2 = c[1326] | 0;
            w2 = a2 + 47 | 0;
            A2 = p2 + w2 | 0;
            p2 = 0 - p2 | 0;
            v2 = A2 & p2;
            if (v2 >>> 0 <= a2 >>> 0) {
              H2 = 0;
              i2 = b2;
              return H2 | 0;
            }
            z2 = c[1316] | 0;
            if ((z2 | 0) != 0 ? (G2 = c[1314] | 0, H2 = G2 + v2 | 0, H2 >>> 0 <= G2 >>> 0 | H2 >>> 0 > z2 >>> 0) : 0) {
              H2 = 0;
              i2 = b2;
              return H2 | 0;
            }
            d:
              do
                if (!(c[1317] & 4)) {
                  B2 = c[1212] | 0;
                  e:
                    do
                      if (B2) {
                        z2 = 5272 | 0;
                        while (1) {
                          C2 = c[z2 >> 2] | 0;
                          if (C2 >>> 0 <= B2 >>> 0 ? (y2 = z2 + 4 | 0, (C2 + (c[y2 >> 2] | 0) | 0) >>> 0 > B2 >>> 0) : 0)
                            break;
                          z2 = c[z2 + 8 >> 2] | 0;
                          if (!z2) {
                            o2 = 181;
                            break e;
                          }
                        }
                        if (z2) {
                          A2 = A2 - (c[1209] | 0) & p2;
                          if (A2 >>> 0 < 2147483647) {
                            p2 = Aa(A2 | 0) | 0;
                            if ((p2 | 0) == ((c[z2 >> 2] | 0) + (c[y2 >> 2] | 0) | 0)) {
                              z2 = A2;
                              o2 = 190;
                            } else {
                              z2 = A2;
                              o2 = 191;
                            }
                          } else
                            z2 = 0;
                        } else
                          o2 = 181;
                      } else
                        o2 = 181;
                    while (0);
                  do
                    if ((o2 | 0) == 181) {
                      y2 = Aa(0) | 0;
                      if ((y2 | 0) != (-1 | 0)) {
                        A2 = y2;
                        z2 = c[1325] | 0;
                        p2 = z2 + -1 | 0;
                        if (!(p2 & A2))
                          z2 = v2;
                        else
                          z2 = v2 - A2 + (p2 + A2 & 0 - z2) | 0;
                        p2 = c[1314] | 0;
                        A2 = p2 + z2 | 0;
                        if (z2 >>> 0 > a2 >>> 0 & z2 >>> 0 < 2147483647) {
                          H2 = c[1316] | 0;
                          if ((H2 | 0) != 0 ? A2 >>> 0 <= p2 >>> 0 | A2 >>> 0 > H2 >>> 0 : 0) {
                            z2 = 0;
                            break;
                          }
                          p2 = Aa(z2 | 0) | 0;
                          if ((p2 | 0) == (y2 | 0)) {
                            p2 = y2;
                            o2 = 190;
                          } else
                            o2 = 191;
                        } else
                          z2 = 0;
                      } else
                        z2 = 0;
                    }
                  while (0);
                  f:
                    do
                      if ((o2 | 0) == 190) {
                        if ((p2 | 0) != (-1 | 0)) {
                          q2 = z2;
                          o2 = 201;
                          break d;
                        }
                      } else if ((o2 | 0) == 191) {
                        o2 = 0 - z2 | 0;
                        do
                          if ((p2 | 0) != (-1 | 0) & z2 >>> 0 < 2147483647 & x2 >>> 0 > z2 >>> 0 ? (u2 = c[1326] | 0, u2 = w2 - z2 + u2 & 0 - u2, u2 >>> 0 < 2147483647) : 0)
                            if ((Aa(u2 | 0) | 0) == (-1 | 0)) {
                              Aa(o2 | 0) | 0;
                              z2 = 0;
                              break f;
                            } else {
                              z2 = u2 + z2 | 0;
                              break;
                            }
                        while (0);
                        if ((p2 | 0) == (-1 | 0))
                          z2 = 0;
                        else {
                          q2 = z2;
                          o2 = 201;
                          break d;
                        }
                      }
                    while (0);
                  c[1317] = c[1317] | 4;
                  o2 = 198;
                } else {
                  z2 = 0;
                  o2 = 198;
                }
              while (0);
            if ((((o2 | 0) == 198 ? v2 >>> 0 < 2147483647 : 0) ? (t2 = Aa(v2 | 0) | 0, s2 = Aa(0) | 0, (t2 | 0) != (-1 | 0) & (s2 | 0) != (-1 | 0) & t2 >>> 0 < s2 >>> 0) : 0) ? (r2 = s2 - t2 | 0, q2 = r2 >>> 0 > (a2 + 40 | 0) >>> 0, q2) : 0) {
              p2 = t2;
              q2 = q2 ? r2 : z2;
              o2 = 201;
            }
            if ((o2 | 0) == 201) {
              r2 = (c[1314] | 0) + q2 | 0;
              c[1314] = r2;
              if (r2 >>> 0 > (c[1315] | 0) >>> 0)
                c[1315] = r2;
              r2 = c[1212] | 0;
              g:
                do
                  if (r2) {
                    t2 = 5272 | 0;
                    while (1) {
                      s2 = c[t2 >> 2] | 0;
                      v2 = t2 + 4 | 0;
                      w2 = c[v2 >> 2] | 0;
                      if ((p2 | 0) == (s2 + w2 | 0)) {
                        o2 = 213;
                        break;
                      }
                      u2 = c[t2 + 8 >> 2] | 0;
                      if (!u2)
                        break;
                      else
                        t2 = u2;
                    }
                    if (((o2 | 0) == 213 ? (c[t2 + 12 >> 2] & 8 | 0) == 0 : 0) ? r2 >>> 0 >= s2 >>> 0 & r2 >>> 0 < p2 >>> 0 : 0) {
                      c[v2 >> 2] = w2 + q2;
                      d2 = (c[1209] | 0) + q2 | 0;
                      e2 = r2 + 8 | 0;
                      if (!(e2 & 7))
                        e2 = 0;
                      else
                        e2 = 0 - e2 & 7;
                      H2 = d2 - e2 | 0;
                      c[1212] = r2 + e2;
                      c[1209] = H2;
                      c[r2 + (e2 + 4) >> 2] = H2 | 1;
                      c[r2 + (d2 + 4) >> 2] = 40;
                      c[1213] = c[1328];
                      break;
                    }
                    s2 = c[1210] | 0;
                    if (p2 >>> 0 < s2 >>> 0) {
                      c[1210] = p2;
                      s2 = p2;
                    }
                    v2 = p2 + q2 | 0;
                    t2 = 5272 | 0;
                    while (1) {
                      if ((c[t2 >> 2] | 0) == (v2 | 0)) {
                        o2 = 223;
                        break;
                      }
                      u2 = c[t2 + 8 >> 2] | 0;
                      if (!u2)
                        break;
                      else
                        t2 = u2;
                    }
                    if ((o2 | 0) == 223 ? (c[t2 + 12 >> 2] & 8 | 0) == 0 : 0) {
                      c[t2 >> 2] = p2;
                      h2 = t2 + 4 | 0;
                      c[h2 >> 2] = (c[h2 >> 2] | 0) + q2;
                      h2 = p2 + 8 | 0;
                      if (!(h2 & 7))
                        h2 = 0;
                      else
                        h2 = 0 - h2 & 7;
                      j2 = p2 + (q2 + 8) | 0;
                      if (!(j2 & 7))
                        n2 = 0;
                      else
                        n2 = 0 - j2 & 7;
                      o2 = p2 + (n2 + q2) | 0;
                      k2 = h2 + a2 | 0;
                      j2 = p2 + k2 | 0;
                      m2 = o2 - (p2 + h2) - a2 | 0;
                      c[p2 + (h2 + 4) >> 2] = a2 | 3;
                      h:
                        do
                          if ((o2 | 0) != (r2 | 0)) {
                            if ((o2 | 0) == (c[1211] | 0)) {
                              H2 = (c[1208] | 0) + m2 | 0;
                              c[1208] = H2;
                              c[1211] = j2;
                              c[p2 + (k2 + 4) >> 2] = H2 | 1;
                              c[p2 + (H2 + k2) >> 2] = H2;
                              break;
                            }
                            r2 = q2 + 4 | 0;
                            u2 = c[p2 + (r2 + n2) >> 2] | 0;
                            if ((u2 & 3 | 0) == 1) {
                              a2 = u2 & -8;
                              t2 = u2 >>> 3;
                              i:
                                do
                                  if (u2 >>> 0 >= 256) {
                                    l2 = c[p2 + ((n2 | 24) + q2) >> 2] | 0;
                                    t2 = c[p2 + (q2 + 12 + n2) >> 2] | 0;
                                    do
                                      if ((t2 | 0) == (o2 | 0)) {
                                        v2 = n2 | 16;
                                        u2 = p2 + (r2 + v2) | 0;
                                        t2 = c[u2 >> 2] | 0;
                                        if (!t2) {
                                          u2 = p2 + (v2 + q2) | 0;
                                          t2 = c[u2 >> 2] | 0;
                                          if (!t2) {
                                            g2 = 0;
                                            break;
                                          }
                                        }
                                        while (1) {
                                          w2 = t2 + 20 | 0;
                                          v2 = c[w2 >> 2] | 0;
                                          if (v2) {
                                            t2 = v2;
                                            u2 = w2;
                                            continue;
                                          }
                                          w2 = t2 + 16 | 0;
                                          v2 = c[w2 >> 2] | 0;
                                          if (!v2)
                                            break;
                                          else {
                                            t2 = v2;
                                            u2 = w2;
                                          }
                                        }
                                        if (u2 >>> 0 < s2 >>> 0)
                                          Wa();
                                        else {
                                          c[u2 >> 2] = 0;
                                          g2 = t2;
                                          break;
                                        }
                                      } else {
                                        u2 = c[p2 + ((n2 | 8) + q2) >> 2] | 0;
                                        if (u2 >>> 0 < s2 >>> 0)
                                          Wa();
                                        v2 = u2 + 12 | 0;
                                        if ((c[v2 >> 2] | 0) != (o2 | 0))
                                          Wa();
                                        s2 = t2 + 8 | 0;
                                        if ((c[s2 >> 2] | 0) == (o2 | 0)) {
                                          c[v2 >> 2] = t2;
                                          c[s2 >> 2] = u2;
                                          g2 = t2;
                                          break;
                                        } else
                                          Wa();
                                      }
                                    while (0);
                                    if (!l2)
                                      break;
                                    s2 = c[p2 + (q2 + 28 + n2) >> 2] | 0;
                                    t2 = 5128 + (s2 << 2) | 0;
                                    do
                                      if ((o2 | 0) != (c[t2 >> 2] | 0)) {
                                        if (l2 >>> 0 < (c[1210] | 0) >>> 0)
                                          Wa();
                                        s2 = l2 + 16 | 0;
                                        if ((c[s2 >> 2] | 0) == (o2 | 0))
                                          c[s2 >> 2] = g2;
                                        else
                                          c[l2 + 20 >> 2] = g2;
                                        if (!g2)
                                          break i;
                                      } else {
                                        c[t2 >> 2] = g2;
                                        if (g2)
                                          break;
                                        c[1207] = c[1207] & ~(1 << s2);
                                        break i;
                                      }
                                    while (0);
                                    o2 = c[1210] | 0;
                                    if (g2 >>> 0 < o2 >>> 0)
                                      Wa();
                                    c[g2 + 24 >> 2] = l2;
                                    s2 = n2 | 16;
                                    l2 = c[p2 + (s2 + q2) >> 2] | 0;
                                    do
                                      if (l2)
                                        if (l2 >>> 0 < o2 >>> 0)
                                          Wa();
                                        else {
                                          c[g2 + 16 >> 2] = l2;
                                          c[l2 + 24 >> 2] = g2;
                                          break;
                                        }
                                    while (0);
                                    l2 = c[p2 + (r2 + s2) >> 2] | 0;
                                    if (!l2)
                                      break;
                                    if (l2 >>> 0 < (c[1210] | 0) >>> 0)
                                      Wa();
                                    else {
                                      c[g2 + 20 >> 2] = l2;
                                      c[l2 + 24 >> 2] = g2;
                                      break;
                                    }
                                  } else {
                                    g2 = c[p2 + ((n2 | 8) + q2) >> 2] | 0;
                                    r2 = c[p2 + (q2 + 12 + n2) >> 2] | 0;
                                    u2 = 4864 + (t2 << 1 << 2) | 0;
                                    do
                                      if ((g2 | 0) != (u2 | 0)) {
                                        if (g2 >>> 0 < s2 >>> 0)
                                          Wa();
                                        if ((c[g2 + 12 >> 2] | 0) == (o2 | 0))
                                          break;
                                        Wa();
                                      }
                                    while (0);
                                    if ((r2 | 0) == (g2 | 0)) {
                                      c[1206] = c[1206] & ~(1 << t2);
                                      break;
                                    }
                                    do
                                      if ((r2 | 0) == (u2 | 0))
                                        l2 = r2 + 8 | 0;
                                      else {
                                        if (r2 >>> 0 < s2 >>> 0)
                                          Wa();
                                        s2 = r2 + 8 | 0;
                                        if ((c[s2 >> 2] | 0) == (o2 | 0)) {
                                          l2 = s2;
                                          break;
                                        }
                                        Wa();
                                      }
                                    while (0);
                                    c[g2 + 12 >> 2] = r2;
                                    c[l2 >> 2] = g2;
                                  }
                                while (0);
                              o2 = p2 + ((a2 | n2) + q2) | 0;
                              m2 = a2 + m2 | 0;
                            }
                            g2 = o2 + 4 | 0;
                            c[g2 >> 2] = c[g2 >> 2] & -2;
                            c[p2 + (k2 + 4) >> 2] = m2 | 1;
                            c[p2 + (m2 + k2) >> 2] = m2;
                            g2 = m2 >>> 3;
                            if (m2 >>> 0 < 256) {
                              l2 = g2 << 1;
                              d2 = 4864 + (l2 << 2) | 0;
                              m2 = c[1206] | 0;
                              g2 = 1 << g2;
                              do
                                if (!(m2 & g2)) {
                                  c[1206] = m2 | g2;
                                  f2 = 4864 + (l2 + 2 << 2) | 0;
                                  e2 = d2;
                                } else {
                                  l2 = 4864 + (l2 + 2 << 2) | 0;
                                  g2 = c[l2 >> 2] | 0;
                                  if (g2 >>> 0 >= (c[1210] | 0) >>> 0) {
                                    f2 = l2;
                                    e2 = g2;
                                    break;
                                  }
                                  Wa();
                                }
                              while (0);
                              c[f2 >> 2] = j2;
                              c[e2 + 12 >> 2] = j2;
                              c[p2 + (k2 + 8) >> 2] = e2;
                              c[p2 + (k2 + 12) >> 2] = d2;
                              break;
                            }
                            e2 = m2 >>> 8;
                            do
                              if (!e2)
                                e2 = 0;
                              else {
                                if (m2 >>> 0 > 16777215) {
                                  e2 = 31;
                                  break;
                                }
                                G2 = (e2 + 1048320 | 0) >>> 16 & 8;
                                H2 = e2 << G2;
                                F2 = (H2 + 520192 | 0) >>> 16 & 4;
                                H2 = H2 << F2;
                                e2 = (H2 + 245760 | 0) >>> 16 & 2;
                                e2 = 14 - (F2 | G2 | e2) + (H2 << e2 >>> 15) | 0;
                                e2 = m2 >>> (e2 + 7 | 0) & 1 | e2 << 1;
                              }
                            while (0);
                            l2 = 5128 + (e2 << 2) | 0;
                            c[p2 + (k2 + 28) >> 2] = e2;
                            c[p2 + (k2 + 20) >> 2] = 0;
                            c[p2 + (k2 + 16) >> 2] = 0;
                            g2 = c[1207] | 0;
                            f2 = 1 << e2;
                            if (!(g2 & f2)) {
                              c[1207] = g2 | f2;
                              c[l2 >> 2] = j2;
                              c[p2 + (k2 + 24) >> 2] = l2;
                              c[p2 + (k2 + 12) >> 2] = j2;
                              c[p2 + (k2 + 8) >> 2] = j2;
                              break;
                            }
                            f2 = c[l2 >> 2] | 0;
                            if ((e2 | 0) == 31)
                              e2 = 0;
                            else
                              e2 = 25 - (e2 >>> 1) | 0;
                            j:
                              do
                                if ((c[f2 + 4 >> 2] & -8 | 0) != (m2 | 0)) {
                                  e2 = m2 << e2;
                                  while (1) {
                                    g2 = f2 + (e2 >>> 31 << 2) + 16 | 0;
                                    l2 = c[g2 >> 2] | 0;
                                    if (!l2)
                                      break;
                                    if ((c[l2 + 4 >> 2] & -8 | 0) == (m2 | 0)) {
                                      d2 = l2;
                                      break j;
                                    } else {
                                      e2 = e2 << 1;
                                      f2 = l2;
                                    }
                                  }
                                  if (g2 >>> 0 < (c[1210] | 0) >>> 0)
                                    Wa();
                                  else {
                                    c[g2 >> 2] = j2;
                                    c[p2 + (k2 + 24) >> 2] = f2;
                                    c[p2 + (k2 + 12) >> 2] = j2;
                                    c[p2 + (k2 + 8) >> 2] = j2;
                                    break h;
                                  }
                                } else
                                  d2 = f2;
                              while (0);
                            e2 = d2 + 8 | 0;
                            f2 = c[e2 >> 2] | 0;
                            H2 = c[1210] | 0;
                            if (d2 >>> 0 >= H2 >>> 0 & f2 >>> 0 >= H2 >>> 0) {
                              c[f2 + 12 >> 2] = j2;
                              c[e2 >> 2] = j2;
                              c[p2 + (k2 + 8) >> 2] = f2;
                              c[p2 + (k2 + 12) >> 2] = d2;
                              c[p2 + (k2 + 24) >> 2] = 0;
                              break;
                            } else
                              Wa();
                          } else {
                            H2 = (c[1209] | 0) + m2 | 0;
                            c[1209] = H2;
                            c[1212] = j2;
                            c[p2 + (k2 + 4) >> 2] = H2 | 1;
                          }
                        while (0);
                      H2 = p2 + (h2 | 8) | 0;
                      i2 = b2;
                      return H2 | 0;
                    }
                    e2 = 5272 | 0;
                    while (1) {
                      d2 = c[e2 >> 2] | 0;
                      if (d2 >>> 0 <= r2 >>> 0 ? (n2 = c[e2 + 4 >> 2] | 0, m2 = d2 + n2 | 0, m2 >>> 0 > r2 >>> 0) : 0)
                        break;
                      e2 = c[e2 + 8 >> 2] | 0;
                    }
                    e2 = d2 + (n2 + -39) | 0;
                    if (!(e2 & 7))
                      e2 = 0;
                    else
                      e2 = 0 - e2 & 7;
                    d2 = d2 + (n2 + -47 + e2) | 0;
                    d2 = d2 >>> 0 < (r2 + 16 | 0) >>> 0 ? r2 : d2;
                    e2 = d2 + 8 | 0;
                    f2 = p2 + 8 | 0;
                    if (!(f2 & 7))
                      f2 = 0;
                    else
                      f2 = 0 - f2 & 7;
                    H2 = q2 + -40 - f2 | 0;
                    c[1212] = p2 + f2;
                    c[1209] = H2;
                    c[p2 + (f2 + 4) >> 2] = H2 | 1;
                    c[p2 + (q2 + -36) >> 2] = 40;
                    c[1213] = c[1328];
                    c[d2 + 4 >> 2] = 27;
                    c[e2 + 0 >> 2] = c[1318];
                    c[e2 + 4 >> 2] = c[1319];
                    c[e2 + 8 >> 2] = c[1320];
                    c[e2 + 12 >> 2] = c[1321];
                    c[1318] = p2;
                    c[1319] = q2;
                    c[1321] = 0;
                    c[1320] = e2;
                    e2 = d2 + 28 | 0;
                    c[e2 >> 2] = 7;
                    if ((d2 + 32 | 0) >>> 0 < m2 >>> 0)
                      do {
                        H2 = e2;
                        e2 = e2 + 4 | 0;
                        c[e2 >> 2] = 7;
                      } while ((H2 + 8 | 0) >>> 0 < m2 >>> 0);
                    if ((d2 | 0) != (r2 | 0)) {
                      d2 = d2 - r2 | 0;
                      e2 = r2 + (d2 + 4) | 0;
                      c[e2 >> 2] = c[e2 >> 2] & -2;
                      c[r2 + 4 >> 2] = d2 | 1;
                      c[r2 + d2 >> 2] = d2;
                      e2 = d2 >>> 3;
                      if (d2 >>> 0 < 256) {
                        f2 = e2 << 1;
                        d2 = 4864 + (f2 << 2) | 0;
                        g2 = c[1206] | 0;
                        e2 = 1 << e2;
                        do
                          if (!(g2 & e2)) {
                            c[1206] = g2 | e2;
                            k2 = 4864 + (f2 + 2 << 2) | 0;
                            j2 = d2;
                          } else {
                            f2 = 4864 + (f2 + 2 << 2) | 0;
                            e2 = c[f2 >> 2] | 0;
                            if (e2 >>> 0 >= (c[1210] | 0) >>> 0) {
                              k2 = f2;
                              j2 = e2;
                              break;
                            }
                            Wa();
                          }
                        while (0);
                        c[k2 >> 2] = r2;
                        c[j2 + 12 >> 2] = r2;
                        c[r2 + 8 >> 2] = j2;
                        c[r2 + 12 >> 2] = d2;
                        break;
                      }
                      e2 = d2 >>> 8;
                      if (e2)
                        if (d2 >>> 0 > 16777215)
                          e2 = 31;
                        else {
                          G2 = (e2 + 1048320 | 0) >>> 16 & 8;
                          H2 = e2 << G2;
                          F2 = (H2 + 520192 | 0) >>> 16 & 4;
                          H2 = H2 << F2;
                          e2 = (H2 + 245760 | 0) >>> 16 & 2;
                          e2 = 14 - (F2 | G2 | e2) + (H2 << e2 >>> 15) | 0;
                          e2 = d2 >>> (e2 + 7 | 0) & 1 | e2 << 1;
                        }
                      else
                        e2 = 0;
                      j2 = 5128 + (e2 << 2) | 0;
                      c[r2 + 28 >> 2] = e2;
                      c[r2 + 20 >> 2] = 0;
                      c[r2 + 16 >> 2] = 0;
                      f2 = c[1207] | 0;
                      g2 = 1 << e2;
                      if (!(f2 & g2)) {
                        c[1207] = f2 | g2;
                        c[j2 >> 2] = r2;
                        c[r2 + 24 >> 2] = j2;
                        c[r2 + 12 >> 2] = r2;
                        c[r2 + 8 >> 2] = r2;
                        break;
                      }
                      f2 = c[j2 >> 2] | 0;
                      if ((e2 | 0) == 31)
                        e2 = 0;
                      else
                        e2 = 25 - (e2 >>> 1) | 0;
                      k:
                        do
                          if ((c[f2 + 4 >> 2] & -8 | 0) != (d2 | 0)) {
                            e2 = d2 << e2;
                            j2 = f2;
                            while (1) {
                              f2 = j2 + (e2 >>> 31 << 2) + 16 | 0;
                              g2 = c[f2 >> 2] | 0;
                              if (!g2)
                                break;
                              if ((c[g2 + 4 >> 2] & -8 | 0) == (d2 | 0)) {
                                h2 = g2;
                                break k;
                              } else {
                                e2 = e2 << 1;
                                j2 = g2;
                              }
                            }
                            if (f2 >>> 0 < (c[1210] | 0) >>> 0)
                              Wa();
                            else {
                              c[f2 >> 2] = r2;
                              c[r2 + 24 >> 2] = j2;
                              c[r2 + 12 >> 2] = r2;
                              c[r2 + 8 >> 2] = r2;
                              break g;
                            }
                          } else
                            h2 = f2;
                        while (0);
                      e2 = h2 + 8 | 0;
                      d2 = c[e2 >> 2] | 0;
                      H2 = c[1210] | 0;
                      if (h2 >>> 0 >= H2 >>> 0 & d2 >>> 0 >= H2 >>> 0) {
                        c[d2 + 12 >> 2] = r2;
                        c[e2 >> 2] = r2;
                        c[r2 + 8 >> 2] = d2;
                        c[r2 + 12 >> 2] = h2;
                        c[r2 + 24 >> 2] = 0;
                        break;
                      } else
                        Wa();
                    }
                  } else {
                    H2 = c[1210] | 0;
                    if ((H2 | 0) == 0 | p2 >>> 0 < H2 >>> 0)
                      c[1210] = p2;
                    c[1318] = p2;
                    c[1319] = q2;
                    c[1321] = 0;
                    c[1215] = c[1324];
                    c[1214] = -1;
                    d2 = 0;
                    do {
                      H2 = d2 << 1;
                      G2 = 4864 + (H2 << 2) | 0;
                      c[4864 + (H2 + 3 << 2) >> 2] = G2;
                      c[4864 + (H2 + 2 << 2) >> 2] = G2;
                      d2 = d2 + 1 | 0;
                    } while ((d2 | 0) != 32);
                    d2 = p2 + 8 | 0;
                    if (!(d2 & 7))
                      d2 = 0;
                    else
                      d2 = 0 - d2 & 7;
                    H2 = q2 + -40 - d2 | 0;
                    c[1212] = p2 + d2;
                    c[1209] = H2;
                    c[p2 + (d2 + 4) >> 2] = H2 | 1;
                    c[p2 + (q2 + -36) >> 2] = 40;
                    c[1213] = c[1328];
                  }
                while (0);
              d2 = c[1209] | 0;
              if (d2 >>> 0 > a2 >>> 0) {
                G2 = d2 - a2 | 0;
                c[1209] = G2;
                H2 = c[1212] | 0;
                c[1212] = H2 + a2;
                c[H2 + (a2 + 4) >> 2] = G2 | 1;
                c[H2 + 4 >> 2] = a2 | 3;
                H2 = H2 + 8 | 0;
                i2 = b2;
                return H2 | 0;
              }
            }
            c[(Oa() | 0) >> 2] = 12;
            H2 = 0;
            i2 = b2;
            return H2 | 0;
          }
          function Td(a2) {
            a2 = a2 | 0;
            var b2 = 0, d2 = 0, e2 = 0, f2 = 0, g2 = 0, h2 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, n2 = 0, o2 = 0, p2 = 0, q2 = 0, r2 = 0, s2 = 0, t2 = 0, u2 = 0, v2 = 0, w2 = 0;
            b2 = i2;
            if (!a2) {
              i2 = b2;
              return;
            }
            q2 = a2 + -8 | 0;
            r2 = c[1210] | 0;
            if (q2 >>> 0 < r2 >>> 0)
              Wa();
            n2 = c[a2 + -4 >> 2] | 0;
            m2 = n2 & 3;
            if ((m2 | 0) == 1)
              Wa();
            j2 = n2 & -8;
            h2 = a2 + (j2 + -8) | 0;
            do
              if (!(n2 & 1)) {
                u2 = c[q2 >> 2] | 0;
                if (!m2) {
                  i2 = b2;
                  return;
                }
                q2 = -8 - u2 | 0;
                n2 = a2 + q2 | 0;
                m2 = u2 + j2 | 0;
                if (n2 >>> 0 < r2 >>> 0)
                  Wa();
                if ((n2 | 0) == (c[1211] | 0)) {
                  e2 = a2 + (j2 + -4) | 0;
                  o2 = c[e2 >> 2] | 0;
                  if ((o2 & 3 | 0) != 3) {
                    e2 = n2;
                    o2 = m2;
                    break;
                  }
                  c[1208] = m2;
                  c[e2 >> 2] = o2 & -2;
                  c[a2 + (q2 + 4) >> 2] = m2 | 1;
                  c[h2 >> 2] = m2;
                  i2 = b2;
                  return;
                }
                t2 = u2 >>> 3;
                if (u2 >>> 0 < 256) {
                  e2 = c[a2 + (q2 + 8) >> 2] | 0;
                  o2 = c[a2 + (q2 + 12) >> 2] | 0;
                  p2 = 4864 + (t2 << 1 << 2) | 0;
                  if ((e2 | 0) != (p2 | 0)) {
                    if (e2 >>> 0 < r2 >>> 0)
                      Wa();
                    if ((c[e2 + 12 >> 2] | 0) != (n2 | 0))
                      Wa();
                  }
                  if ((o2 | 0) == (e2 | 0)) {
                    c[1206] = c[1206] & ~(1 << t2);
                    e2 = n2;
                    o2 = m2;
                    break;
                  }
                  if ((o2 | 0) != (p2 | 0)) {
                    if (o2 >>> 0 < r2 >>> 0)
                      Wa();
                    p2 = o2 + 8 | 0;
                    if ((c[p2 >> 2] | 0) == (n2 | 0))
                      s2 = p2;
                    else
                      Wa();
                  } else
                    s2 = o2 + 8 | 0;
                  c[e2 + 12 >> 2] = o2;
                  c[s2 >> 2] = e2;
                  e2 = n2;
                  o2 = m2;
                  break;
                }
                s2 = c[a2 + (q2 + 24) >> 2] | 0;
                t2 = c[a2 + (q2 + 12) >> 2] | 0;
                do
                  if ((t2 | 0) == (n2 | 0)) {
                    u2 = a2 + (q2 + 20) | 0;
                    t2 = c[u2 >> 2] | 0;
                    if (!t2) {
                      u2 = a2 + (q2 + 16) | 0;
                      t2 = c[u2 >> 2] | 0;
                      if (!t2) {
                        p2 = 0;
                        break;
                      }
                    }
                    while (1) {
                      v2 = t2 + 20 | 0;
                      w2 = c[v2 >> 2] | 0;
                      if (w2) {
                        t2 = w2;
                        u2 = v2;
                        continue;
                      }
                      v2 = t2 + 16 | 0;
                      w2 = c[v2 >> 2] | 0;
                      if (!w2)
                        break;
                      else {
                        t2 = w2;
                        u2 = v2;
                      }
                    }
                    if (u2 >>> 0 < r2 >>> 0)
                      Wa();
                    else {
                      c[u2 >> 2] = 0;
                      p2 = t2;
                      break;
                    }
                  } else {
                    u2 = c[a2 + (q2 + 8) >> 2] | 0;
                    if (u2 >>> 0 < r2 >>> 0)
                      Wa();
                    r2 = u2 + 12 | 0;
                    if ((c[r2 >> 2] | 0) != (n2 | 0))
                      Wa();
                    v2 = t2 + 8 | 0;
                    if ((c[v2 >> 2] | 0) == (n2 | 0)) {
                      c[r2 >> 2] = t2;
                      c[v2 >> 2] = u2;
                      p2 = t2;
                      break;
                    } else
                      Wa();
                  }
                while (0);
                if (s2) {
                  r2 = c[a2 + (q2 + 28) >> 2] | 0;
                  t2 = 5128 + (r2 << 2) | 0;
                  if ((n2 | 0) == (c[t2 >> 2] | 0)) {
                    c[t2 >> 2] = p2;
                    if (!p2) {
                      c[1207] = c[1207] & ~(1 << r2);
                      e2 = n2;
                      o2 = m2;
                      break;
                    }
                  } else {
                    if (s2 >>> 0 < (c[1210] | 0) >>> 0)
                      Wa();
                    r2 = s2 + 16 | 0;
                    if ((c[r2 >> 2] | 0) == (n2 | 0))
                      c[r2 >> 2] = p2;
                    else
                      c[s2 + 20 >> 2] = p2;
                    if (!p2) {
                      e2 = n2;
                      o2 = m2;
                      break;
                    }
                  }
                  r2 = c[1210] | 0;
                  if (p2 >>> 0 < r2 >>> 0)
                    Wa();
                  c[p2 + 24 >> 2] = s2;
                  s2 = c[a2 + (q2 + 16) >> 2] | 0;
                  do
                    if (s2)
                      if (s2 >>> 0 < r2 >>> 0)
                        Wa();
                      else {
                        c[p2 + 16 >> 2] = s2;
                        c[s2 + 24 >> 2] = p2;
                        break;
                      }
                  while (0);
                  q2 = c[a2 + (q2 + 20) >> 2] | 0;
                  if (q2)
                    if (q2 >>> 0 < (c[1210] | 0) >>> 0)
                      Wa();
                    else {
                      c[p2 + 20 >> 2] = q2;
                      c[q2 + 24 >> 2] = p2;
                      e2 = n2;
                      o2 = m2;
                      break;
                    }
                  else {
                    e2 = n2;
                    o2 = m2;
                  }
                } else {
                  e2 = n2;
                  o2 = m2;
                }
              } else {
                e2 = q2;
                o2 = j2;
              }
            while (0);
            if (e2 >>> 0 >= h2 >>> 0)
              Wa();
            m2 = a2 + (j2 + -4) | 0;
            n2 = c[m2 >> 2] | 0;
            if (!(n2 & 1))
              Wa();
            if (!(n2 & 2)) {
              if ((h2 | 0) == (c[1212] | 0)) {
                w2 = (c[1209] | 0) + o2 | 0;
                c[1209] = w2;
                c[1212] = e2;
                c[e2 + 4 >> 2] = w2 | 1;
                if ((e2 | 0) != (c[1211] | 0)) {
                  i2 = b2;
                  return;
                }
                c[1211] = 0;
                c[1208] = 0;
                i2 = b2;
                return;
              }
              if ((h2 | 0) == (c[1211] | 0)) {
                w2 = (c[1208] | 0) + o2 | 0;
                c[1208] = w2;
                c[1211] = e2;
                c[e2 + 4 >> 2] = w2 | 1;
                c[e2 + w2 >> 2] = w2;
                i2 = b2;
                return;
              }
              o2 = (n2 & -8) + o2 | 0;
              m2 = n2 >>> 3;
              do
                if (n2 >>> 0 >= 256) {
                  l2 = c[a2 + (j2 + 16) >> 2] | 0;
                  m2 = c[a2 + (j2 | 4) >> 2] | 0;
                  do
                    if ((m2 | 0) == (h2 | 0)) {
                      n2 = a2 + (j2 + 12) | 0;
                      m2 = c[n2 >> 2] | 0;
                      if (!m2) {
                        n2 = a2 + (j2 + 8) | 0;
                        m2 = c[n2 >> 2] | 0;
                        if (!m2) {
                          k2 = 0;
                          break;
                        }
                      }
                      while (1) {
                        q2 = m2 + 20 | 0;
                        p2 = c[q2 >> 2] | 0;
                        if (p2) {
                          m2 = p2;
                          n2 = q2;
                          continue;
                        }
                        p2 = m2 + 16 | 0;
                        q2 = c[p2 >> 2] | 0;
                        if (!q2)
                          break;
                        else {
                          m2 = q2;
                          n2 = p2;
                        }
                      }
                      if (n2 >>> 0 < (c[1210] | 0) >>> 0)
                        Wa();
                      else {
                        c[n2 >> 2] = 0;
                        k2 = m2;
                        break;
                      }
                    } else {
                      n2 = c[a2 + j2 >> 2] | 0;
                      if (n2 >>> 0 < (c[1210] | 0) >>> 0)
                        Wa();
                      p2 = n2 + 12 | 0;
                      if ((c[p2 >> 2] | 0) != (h2 | 0))
                        Wa();
                      q2 = m2 + 8 | 0;
                      if ((c[q2 >> 2] | 0) == (h2 | 0)) {
                        c[p2 >> 2] = m2;
                        c[q2 >> 2] = n2;
                        k2 = m2;
                        break;
                      } else
                        Wa();
                    }
                  while (0);
                  if (l2) {
                    m2 = c[a2 + (j2 + 20) >> 2] | 0;
                    n2 = 5128 + (m2 << 2) | 0;
                    if ((h2 | 0) == (c[n2 >> 2] | 0)) {
                      c[n2 >> 2] = k2;
                      if (!k2) {
                        c[1207] = c[1207] & ~(1 << m2);
                        break;
                      }
                    } else {
                      if (l2 >>> 0 < (c[1210] | 0) >>> 0)
                        Wa();
                      m2 = l2 + 16 | 0;
                      if ((c[m2 >> 2] | 0) == (h2 | 0))
                        c[m2 >> 2] = k2;
                      else
                        c[l2 + 20 >> 2] = k2;
                      if (!k2)
                        break;
                    }
                    h2 = c[1210] | 0;
                    if (k2 >>> 0 < h2 >>> 0)
                      Wa();
                    c[k2 + 24 >> 2] = l2;
                    l2 = c[a2 + (j2 + 8) >> 2] | 0;
                    do
                      if (l2)
                        if (l2 >>> 0 < h2 >>> 0)
                          Wa();
                        else {
                          c[k2 + 16 >> 2] = l2;
                          c[l2 + 24 >> 2] = k2;
                          break;
                        }
                    while (0);
                    h2 = c[a2 + (j2 + 12) >> 2] | 0;
                    if (h2)
                      if (h2 >>> 0 < (c[1210] | 0) >>> 0)
                        Wa();
                      else {
                        c[k2 + 20 >> 2] = h2;
                        c[h2 + 24 >> 2] = k2;
                        break;
                      }
                  }
                } else {
                  k2 = c[a2 + j2 >> 2] | 0;
                  j2 = c[a2 + (j2 | 4) >> 2] | 0;
                  a2 = 4864 + (m2 << 1 << 2) | 0;
                  if ((k2 | 0) != (a2 | 0)) {
                    if (k2 >>> 0 < (c[1210] | 0) >>> 0)
                      Wa();
                    if ((c[k2 + 12 >> 2] | 0) != (h2 | 0))
                      Wa();
                  }
                  if ((j2 | 0) == (k2 | 0)) {
                    c[1206] = c[1206] & ~(1 << m2);
                    break;
                  }
                  if ((j2 | 0) != (a2 | 0)) {
                    if (j2 >>> 0 < (c[1210] | 0) >>> 0)
                      Wa();
                    a2 = j2 + 8 | 0;
                    if ((c[a2 >> 2] | 0) == (h2 | 0))
                      l2 = a2;
                    else
                      Wa();
                  } else
                    l2 = j2 + 8 | 0;
                  c[k2 + 12 >> 2] = j2;
                  c[l2 >> 2] = k2;
                }
              while (0);
              c[e2 + 4 >> 2] = o2 | 1;
              c[e2 + o2 >> 2] = o2;
              if ((e2 | 0) == (c[1211] | 0)) {
                c[1208] = o2;
                i2 = b2;
                return;
              }
            } else {
              c[m2 >> 2] = n2 & -2;
              c[e2 + 4 >> 2] = o2 | 1;
              c[e2 + o2 >> 2] = o2;
            }
            h2 = o2 >>> 3;
            if (o2 >>> 0 < 256) {
              j2 = h2 << 1;
              d2 = 4864 + (j2 << 2) | 0;
              k2 = c[1206] | 0;
              h2 = 1 << h2;
              if (k2 & h2) {
                j2 = 4864 + (j2 + 2 << 2) | 0;
                h2 = c[j2 >> 2] | 0;
                if (h2 >>> 0 < (c[1210] | 0) >>> 0)
                  Wa();
                else {
                  f2 = j2;
                  g2 = h2;
                }
              } else {
                c[1206] = k2 | h2;
                f2 = 4864 + (j2 + 2 << 2) | 0;
                g2 = d2;
              }
              c[f2 >> 2] = e2;
              c[g2 + 12 >> 2] = e2;
              c[e2 + 8 >> 2] = g2;
              c[e2 + 12 >> 2] = d2;
              i2 = b2;
              return;
            }
            f2 = o2 >>> 8;
            if (f2)
              if (o2 >>> 0 > 16777215)
                f2 = 31;
              else {
                v2 = (f2 + 1048320 | 0) >>> 16 & 8;
                w2 = f2 << v2;
                u2 = (w2 + 520192 | 0) >>> 16 & 4;
                w2 = w2 << u2;
                f2 = (w2 + 245760 | 0) >>> 16 & 2;
                f2 = 14 - (u2 | v2 | f2) + (w2 << f2 >>> 15) | 0;
                f2 = o2 >>> (f2 + 7 | 0) & 1 | f2 << 1;
              }
            else
              f2 = 0;
            g2 = 5128 + (f2 << 2) | 0;
            c[e2 + 28 >> 2] = f2;
            c[e2 + 20 >> 2] = 0;
            c[e2 + 16 >> 2] = 0;
            j2 = c[1207] | 0;
            h2 = 1 << f2;
            a:
              do
                if (j2 & h2) {
                  g2 = c[g2 >> 2] | 0;
                  if ((f2 | 0) == 31)
                    f2 = 0;
                  else
                    f2 = 25 - (f2 >>> 1) | 0;
                  b:
                    do
                      if ((c[g2 + 4 >> 2] & -8 | 0) != (o2 | 0)) {
                        f2 = o2 << f2;
                        while (1) {
                          j2 = g2 + (f2 >>> 31 << 2) + 16 | 0;
                          h2 = c[j2 >> 2] | 0;
                          if (!h2)
                            break;
                          if ((c[h2 + 4 >> 2] & -8 | 0) == (o2 | 0)) {
                            d2 = h2;
                            break b;
                          } else {
                            f2 = f2 << 1;
                            g2 = h2;
                          }
                        }
                        if (j2 >>> 0 < (c[1210] | 0) >>> 0)
                          Wa();
                        else {
                          c[j2 >> 2] = e2;
                          c[e2 + 24 >> 2] = g2;
                          c[e2 + 12 >> 2] = e2;
                          c[e2 + 8 >> 2] = e2;
                          break a;
                        }
                      } else
                        d2 = g2;
                    while (0);
                  g2 = d2 + 8 | 0;
                  f2 = c[g2 >> 2] | 0;
                  w2 = c[1210] | 0;
                  if (d2 >>> 0 >= w2 >>> 0 & f2 >>> 0 >= w2 >>> 0) {
                    c[f2 + 12 >> 2] = e2;
                    c[g2 >> 2] = e2;
                    c[e2 + 8 >> 2] = f2;
                    c[e2 + 12 >> 2] = d2;
                    c[e2 + 24 >> 2] = 0;
                    break;
                  } else
                    Wa();
                } else {
                  c[1207] = j2 | h2;
                  c[g2 >> 2] = e2;
                  c[e2 + 24 >> 2] = g2;
                  c[e2 + 12 >> 2] = e2;
                  c[e2 + 8 >> 2] = e2;
                }
              while (0);
            w2 = (c[1214] | 0) + -1 | 0;
            c[1214] = w2;
            if (!w2)
              d2 = 5280 | 0;
            else {
              i2 = b2;
              return;
            }
            while (1) {
              d2 = c[d2 >> 2] | 0;
              if (!d2)
                break;
              else
                d2 = d2 + 8 | 0;
            }
            c[1214] = -1;
            i2 = b2;
            return;
          }
          function Ud(a2, b2) {
            a2 = a2 | 0;
            b2 = b2 | 0;
            var d2 = 0, e2 = 0, f2 = 0;
            d2 = i2;
            do
              if (a2) {
                if (b2 >>> 0 > 4294967231) {
                  c[(Oa() | 0) >> 2] = 12;
                  e2 = 0;
                  break;
                }
                if (b2 >>> 0 < 11)
                  e2 = 16;
                else
                  e2 = b2 + 11 & -8;
                e2 = fe(a2 + -8 | 0, e2) | 0;
                if (e2) {
                  e2 = e2 + 8 | 0;
                  break;
                }
                e2 = Sd(b2) | 0;
                if (!e2)
                  e2 = 0;
                else {
                  f2 = c[a2 + -4 >> 2] | 0;
                  f2 = (f2 & -8) - ((f2 & 3 | 0) == 0 ? 8 : 4) | 0;
                  pe(e2 | 0, a2 | 0, (f2 >>> 0 < b2 >>> 0 ? f2 : b2) | 0) | 0;
                  Td(a2);
                }
              } else
                e2 = Sd(b2) | 0;
            while (0);
            i2 = d2;
            return e2 | 0;
          }
          function Vd(a2) {
            a2 = a2 | 0;
            if ((a2 | 0) == 32)
              a2 = 1;
            else
              a2 = (a2 + -9 | 0) >>> 0 < 5;
            return a2 & 1 | 0;
          }
          function Wd(b2, e2, f2, g2, h2) {
            b2 = b2 | 0;
            e2 = e2 | 0;
            f2 = f2 | 0;
            g2 = g2 | 0;
            h2 = h2 | 0;
            var j2 = 0, k2 = 0, l2 = 0, m2 = 0, n2 = 0, o2 = 0, p2 = 0, q2 = 0, r2 = 0, s2 = 0, t2 = 0;
            j2 = i2;
            if (e2 >>> 0 > 36) {
              c[(Oa() | 0) >> 2] = 22;
              s2 = 0;
              t2 = 0;
              F = s2;
              i2 = j2;
              return t2 | 0;
            }
            k2 = b2 + 4 | 0;
            l2 = b2 + 100 | 0;
            do {
              m2 = c[k2 >> 2] | 0;
              if (m2 >>> 0 < (c[l2 >> 2] | 0) >>> 0) {
                c[k2 >> 2] = m2 + 1;
                o2 = d[m2 >> 0] | 0;
              } else
                o2 = Zd(b2) | 0;
            } while ((Vd(o2) | 0) != 0);
            do
              if ((o2 | 0) == 43 | (o2 | 0) == 45) {
                m2 = ((o2 | 0) == 45) << 31 >> 31;
                n2 = c[k2 >> 2] | 0;
                if (n2 >>> 0 < (c[l2 >> 2] | 0) >>> 0) {
                  c[k2 >> 2] = n2 + 1;
                  o2 = d[n2 >> 0] | 0;
                  break;
                } else {
                  o2 = Zd(b2) | 0;
                  break;
                }
              } else
                m2 = 0;
            while (0);
            n2 = (e2 | 0) == 0;
            do
              if ((e2 & -17 | 0) == 0 & (o2 | 0) == 48) {
                o2 = c[k2 >> 2] | 0;
                if (o2 >>> 0 < (c[l2 >> 2] | 0) >>> 0) {
                  c[k2 >> 2] = o2 + 1;
                  o2 = d[o2 >> 0] | 0;
                } else
                  o2 = Zd(b2) | 0;
                if ((o2 | 32 | 0) != 120)
                  if (n2) {
                    e2 = 8;
                    f2 = 46;
                    break;
                  } else {
                    f2 = 32;
                    break;
                  }
                e2 = c[k2 >> 2] | 0;
                if (e2 >>> 0 < (c[l2 >> 2] | 0) >>> 0) {
                  c[k2 >> 2] = e2 + 1;
                  o2 = d[e2 >> 0] | 0;
                } else
                  o2 = Zd(b2) | 0;
                if ((d[o2 + 5321 >> 0] | 0) > 15) {
                  g2 = (c[l2 >> 2] | 0) == 0;
                  if (!g2)
                    c[k2 >> 2] = (c[k2 >> 2] | 0) + -1;
                  if (!f2) {
                    Yd(b2, 0);
                    s2 = 0;
                    t2 = 0;
                    F = s2;
                    i2 = j2;
                    return t2 | 0;
                  }
                  if (g2) {
                    s2 = 0;
                    t2 = 0;
                    F = s2;
                    i2 = j2;
                    return t2 | 0;
                  }
                  c[k2 >> 2] = (c[k2 >> 2] | 0) + -1;
                  s2 = 0;
                  t2 = 0;
                  F = s2;
                  i2 = j2;
                  return t2 | 0;
                } else {
                  e2 = 16;
                  f2 = 46;
                }
              } else {
                e2 = n2 ? 10 : e2;
                if ((d[o2 + 5321 >> 0] | 0) >>> 0 < e2 >>> 0)
                  f2 = 32;
                else {
                  if (c[l2 >> 2] | 0)
                    c[k2 >> 2] = (c[k2 >> 2] | 0) + -1;
                  Yd(b2, 0);
                  c[(Oa() | 0) >> 2] = 22;
                  s2 = 0;
                  t2 = 0;
                  F = s2;
                  i2 = j2;
                  return t2 | 0;
                }
              }
            while (0);
            if ((f2 | 0) == 32)
              if ((e2 | 0) == 10) {
                e2 = o2 + -48 | 0;
                if (e2 >>> 0 < 10) {
                  n2 = 0;
                  do {
                    n2 = (n2 * 10 | 0) + e2 | 0;
                    e2 = c[k2 >> 2] | 0;
                    if (e2 >>> 0 < (c[l2 >> 2] | 0) >>> 0) {
                      c[k2 >> 2] = e2 + 1;
                      o2 = d[e2 >> 0] | 0;
                    } else
                      o2 = Zd(b2) | 0;
                    e2 = o2 + -48 | 0;
                  } while (e2 >>> 0 < 10 & n2 >>> 0 < 429496729);
                  p2 = 0;
                } else {
                  n2 = 0;
                  p2 = 0;
                }
                e2 = o2 + -48 | 0;
                if (e2 >>> 0 < 10) {
                  do {
                    q2 = we(n2 | 0, p2 | 0, 10, 0) | 0;
                    r2 = F;
                    s2 = ((e2 | 0) < 0) << 31 >> 31;
                    t2 = ~s2;
                    if (r2 >>> 0 > t2 >>> 0 | (r2 | 0) == (t2 | 0) & q2 >>> 0 > ~e2 >>> 0)
                      break;
                    n2 = ne(q2 | 0, r2 | 0, e2 | 0, s2 | 0) | 0;
                    p2 = F;
                    e2 = c[k2 >> 2] | 0;
                    if (e2 >>> 0 < (c[l2 >> 2] | 0) >>> 0) {
                      c[k2 >> 2] = e2 + 1;
                      o2 = d[e2 >> 0] | 0;
                    } else
                      o2 = Zd(b2) | 0;
                    e2 = o2 + -48 | 0;
                  } while (e2 >>> 0 < 10 & (p2 >>> 0 < 429496729 | (p2 | 0) == 429496729 & n2 >>> 0 < 2576980378));
                  if (e2 >>> 0 <= 9) {
                    e2 = 10;
                    f2 = 72;
                  }
                }
              } else
                f2 = 46;
            a:
              do
                if ((f2 | 0) == 46) {
                  if (!(e2 + -1 & e2)) {
                    f2 = a[5584 + ((e2 * 23 | 0) >>> 5 & 7) >> 0] | 0;
                    r2 = a[o2 + 5321 >> 0] | 0;
                    n2 = r2 & 255;
                    if (n2 >>> 0 < e2 >>> 0) {
                      o2 = n2;
                      n2 = 0;
                      do {
                        n2 = o2 | n2 << f2;
                        o2 = c[k2 >> 2] | 0;
                        if (o2 >>> 0 < (c[l2 >> 2] | 0) >>> 0) {
                          c[k2 >> 2] = o2 + 1;
                          s2 = d[o2 >> 0] | 0;
                        } else
                          s2 = Zd(b2) | 0;
                        r2 = a[s2 + 5321 >> 0] | 0;
                        o2 = r2 & 255;
                      } while (o2 >>> 0 < e2 >>> 0 & n2 >>> 0 < 134217728);
                      p2 = 0;
                    } else {
                      p2 = 0;
                      n2 = 0;
                      s2 = o2;
                    }
                    o2 = oe(-1, -1, f2 | 0) | 0;
                    q2 = F;
                    if ((r2 & 255) >>> 0 >= e2 >>> 0 | (p2 >>> 0 > q2 >>> 0 | (p2 | 0) == (q2 | 0) & n2 >>> 0 > o2 >>> 0)) {
                      o2 = s2;
                      f2 = 72;
                      break;
                    }
                    while (1) {
                      n2 = le(n2 | 0, p2 | 0, f2 | 0) | 0;
                      p2 = F;
                      n2 = r2 & 255 | n2;
                      r2 = c[k2 >> 2] | 0;
                      if (r2 >>> 0 < (c[l2 >> 2] | 0) >>> 0) {
                        c[k2 >> 2] = r2 + 1;
                        s2 = d[r2 >> 0] | 0;
                      } else
                        s2 = Zd(b2) | 0;
                      r2 = a[s2 + 5321 >> 0] | 0;
                      if ((r2 & 255) >>> 0 >= e2 >>> 0 | (p2 >>> 0 > q2 >>> 0 | (p2 | 0) == (q2 | 0) & n2 >>> 0 > o2 >>> 0)) {
                        o2 = s2;
                        f2 = 72;
                        break a;
                      }
                    }
                  }
                  r2 = a[o2 + 5321 >> 0] | 0;
                  f2 = r2 & 255;
                  if (f2 >>> 0 < e2 >>> 0) {
                    n2 = 0;
                    do {
                      n2 = f2 + (ba(n2, e2) | 0) | 0;
                      f2 = c[k2 >> 2] | 0;
                      if (f2 >>> 0 < (c[l2 >> 2] | 0) >>> 0) {
                        c[k2 >> 2] = f2 + 1;
                        q2 = d[f2 >> 0] | 0;
                      } else
                        q2 = Zd(b2) | 0;
                      r2 = a[q2 + 5321 >> 0] | 0;
                      f2 = r2 & 255;
                    } while (f2 >>> 0 < e2 >>> 0 & n2 >>> 0 < 119304647);
                    p2 = 0;
                  } else {
                    n2 = 0;
                    p2 = 0;
                    q2 = o2;
                  }
                  if ((r2 & 255) >>> 0 < e2 >>> 0) {
                    f2 = xe(-1, -1, e2 | 0, 0) | 0;
                    o2 = F;
                    while (1) {
                      if (p2 >>> 0 > o2 >>> 0 | (p2 | 0) == (o2 | 0) & n2 >>> 0 > f2 >>> 0) {
                        o2 = q2;
                        f2 = 72;
                        break a;
                      }
                      s2 = we(n2 | 0, p2 | 0, e2 | 0, 0) | 0;
                      t2 = F;
                      r2 = r2 & 255;
                      if (t2 >>> 0 > 4294967295 | (t2 | 0) == -1 & s2 >>> 0 > ~r2 >>> 0) {
                        o2 = q2;
                        f2 = 72;
                        break a;
                      }
                      n2 = ne(r2 | 0, 0, s2 | 0, t2 | 0) | 0;
                      p2 = F;
                      q2 = c[k2 >> 2] | 0;
                      if (q2 >>> 0 < (c[l2 >> 2] | 0) >>> 0) {
                        c[k2 >> 2] = q2 + 1;
                        q2 = d[q2 >> 0] | 0;
                      } else
                        q2 = Zd(b2) | 0;
                      r2 = a[q2 + 5321 >> 0] | 0;
                      if ((r2 & 255) >>> 0 >= e2 >>> 0) {
                        o2 = q2;
                        f2 = 72;
                        break;
                      }
                    }
                  } else {
                    o2 = q2;
                    f2 = 72;
                  }
                }
              while (0);
            if ((f2 | 0) == 72) {
              if ((d[o2 + 5321 >> 0] | 0) >>> 0 < e2 >>> 0) {
                do {
                  f2 = c[k2 >> 2] | 0;
                  if (f2 >>> 0 < (c[l2 >> 2] | 0) >>> 0) {
                    c[k2 >> 2] = f2 + 1;
                    f2 = d[f2 >> 0] | 0;
                  } else
                    f2 = Zd(b2) | 0;
                } while ((d[f2 + 5321 >> 0] | 0) >>> 0 < e2 >>> 0);
                c[(Oa() | 0) >> 2] = 34;
                p2 = h2;
                n2 = g2;
              }
            }
            if (c[l2 >> 2] | 0)
              c[k2 >> 2] = (c[k2 >> 2] | 0) + -1;
            if (!(p2 >>> 0 < h2 >>> 0 | (p2 | 0) == (h2 | 0) & n2 >>> 0 < g2 >>> 0)) {
              if (!((g2 & 1 | 0) != 0 | false | (m2 | 0) != 0)) {
                c[(Oa() | 0) >> 2] = 34;
                t2 = ne(g2 | 0, h2 | 0, -1, -1) | 0;
                s2 = F;
                F = s2;
                i2 = j2;
                return t2 | 0;
              }
              if (p2 >>> 0 > h2 >>> 0 | (p2 | 0) == (h2 | 0) & n2 >>> 0 > g2 >>> 0) {
                c[(Oa() | 0) >> 2] = 34;
                s2 = h2;
                t2 = g2;
                F = s2;
                i2 = j2;
                return t2 | 0;
              }
            }
            t2 = ((m2 | 0) < 0) << 31 >> 31;
            t2 = je(n2 ^ m2 | 0, p2 ^ t2 | 0, m2 | 0, t2 | 0) | 0;
            s2 = F;
            F = s2;
            i2 = j2;
            return t2 | 0;
          }
          function Xd(b2, e2, f2) {
            b2 = b2 | 0;
            e2 = e2 | 0;
            f2 = f2 | 0;
            var g2 = 0, h2 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, n2 = 0, o2 = 0, p2 = 0, q2 = 0, r2 = 0, s2 = 0, t2 = 0, w2 = 0, x2 = 0, y2 = 0, z2 = 0, A2 = 0, B2 = 0, C2 = 0, D2 = 0, E2 = 0, G2 = 0, H2 = 0, I2 = 0, J2 = 0, K2 = 0, L2 = 0;
            g2 = i2;
            i2 = i2 + 512 | 0;
            k2 = g2;
            if (!e2) {
              e2 = 24;
              j2 = -149;
            } else if ((e2 | 0) == 2) {
              e2 = 53;
              j2 = -1074;
            } else if ((e2 | 0) == 1) {
              e2 = 53;
              j2 = -1074;
            } else {
              J2 = 0;
              i2 = g2;
              return +J2;
            }
            n2 = b2 + 4 | 0;
            o2 = b2 + 100 | 0;
            do {
              h2 = c[n2 >> 2] | 0;
              if (h2 >>> 0 < (c[o2 >> 2] | 0) >>> 0) {
                c[n2 >> 2] = h2 + 1;
                w2 = d[h2 >> 0] | 0;
              } else
                w2 = Zd(b2) | 0;
            } while ((Vd(w2) | 0) != 0);
            do
              if ((w2 | 0) == 43 | (w2 | 0) == 45) {
                h2 = 1 - (((w2 | 0) == 45 & 1) << 1) | 0;
                m2 = c[n2 >> 2] | 0;
                if (m2 >>> 0 < (c[o2 >> 2] | 0) >>> 0) {
                  c[n2 >> 2] = m2 + 1;
                  w2 = d[m2 >> 0] | 0;
                  break;
                } else {
                  w2 = Zd(b2) | 0;
                  break;
                }
              } else
                h2 = 1;
            while (0);
            r2 = 0;
            do {
              if ((w2 | 32 | 0) != (a[5600 + r2 >> 0] | 0))
                break;
              do
                if (r2 >>> 0 < 7) {
                  m2 = c[n2 >> 2] | 0;
                  if (m2 >>> 0 < (c[o2 >> 2] | 0) >>> 0) {
                    c[n2 >> 2] = m2 + 1;
                    w2 = d[m2 >> 0] | 0;
                    break;
                  } else {
                    w2 = Zd(b2) | 0;
                    break;
                  }
                }
              while (0);
              r2 = r2 + 1 | 0;
            } while (r2 >>> 0 < 8);
            do
              if ((r2 | 0) == 3)
                p2 = 23;
              else if ((r2 | 0) != 8) {
                m2 = (f2 | 0) != 0;
                if (r2 >>> 0 > 3 & m2)
                  if ((r2 | 0) == 8)
                    break;
                  else {
                    p2 = 23;
                    break;
                  }
                a:
                  do
                    if (!r2) {
                      r2 = 0;
                      do {
                        if ((w2 | 32 | 0) != (a[5616 + r2 >> 0] | 0))
                          break a;
                        do
                          if (r2 >>> 0 < 2) {
                            s2 = c[n2 >> 2] | 0;
                            if (s2 >>> 0 < (c[o2 >> 2] | 0) >>> 0) {
                              c[n2 >> 2] = s2 + 1;
                              w2 = d[s2 >> 0] | 0;
                              break;
                            } else {
                              w2 = Zd(b2) | 0;
                              break;
                            }
                          }
                        while (0);
                        r2 = r2 + 1 | 0;
                      } while (r2 >>> 0 < 3);
                    }
                  while (0);
                if (!r2) {
                  do
                    if ((w2 | 0) == 48) {
                      m2 = c[n2 >> 2] | 0;
                      if (m2 >>> 0 < (c[o2 >> 2] | 0) >>> 0) {
                        c[n2 >> 2] = m2 + 1;
                        m2 = d[m2 >> 0] | 0;
                      } else
                        m2 = Zd(b2) | 0;
                      if ((m2 | 32 | 0) != 120) {
                        if (!(c[o2 >> 2] | 0)) {
                          w2 = 48;
                          break;
                        }
                        c[n2 >> 2] = (c[n2 >> 2] | 0) + -1;
                        w2 = 48;
                        break;
                      }
                      k2 = c[n2 >> 2] | 0;
                      if (k2 >>> 0 < (c[o2 >> 2] | 0) >>> 0) {
                        c[n2 >> 2] = k2 + 1;
                        z2 = d[k2 >> 0] | 0;
                        x2 = 0;
                      } else {
                        z2 = Zd(b2) | 0;
                        x2 = 0;
                      }
                      while (1) {
                        if ((z2 | 0) == 46) {
                          p2 = 70;
                          break;
                        } else if ((z2 | 0) != 48) {
                          k2 = 0;
                          m2 = 0;
                          s2 = 0;
                          r2 = 0;
                          w2 = 0;
                          y2 = 0;
                          G2 = 1;
                          t2 = 0;
                          q2 = 0;
                          break;
                        }
                        k2 = c[n2 >> 2] | 0;
                        if (k2 >>> 0 < (c[o2 >> 2] | 0) >>> 0) {
                          c[n2 >> 2] = k2 + 1;
                          z2 = d[k2 >> 0] | 0;
                          x2 = 1;
                          continue;
                        } else {
                          z2 = Zd(b2) | 0;
                          x2 = 1;
                          continue;
                        }
                      }
                      if ((p2 | 0) == 70) {
                        k2 = c[n2 >> 2] | 0;
                        if (k2 >>> 0 < (c[o2 >> 2] | 0) >>> 0) {
                          c[n2 >> 2] = k2 + 1;
                          z2 = d[k2 >> 0] | 0;
                        } else
                          z2 = Zd(b2) | 0;
                        if ((z2 | 0) == 48) {
                          s2 = 0;
                          r2 = 0;
                          do {
                            k2 = c[n2 >> 2] | 0;
                            if (k2 >>> 0 < (c[o2 >> 2] | 0) >>> 0) {
                              c[n2 >> 2] = k2 + 1;
                              z2 = d[k2 >> 0] | 0;
                            } else
                              z2 = Zd(b2) | 0;
                            s2 = ne(s2 | 0, r2 | 0, -1, -1) | 0;
                            r2 = F;
                          } while ((z2 | 0) == 48);
                          k2 = 0;
                          m2 = 0;
                          x2 = 1;
                          w2 = 1;
                          y2 = 0;
                          G2 = 1;
                          t2 = 0;
                          q2 = 0;
                        } else {
                          k2 = 0;
                          m2 = 0;
                          s2 = 0;
                          r2 = 0;
                          w2 = 1;
                          y2 = 0;
                          G2 = 1;
                          t2 = 0;
                          q2 = 0;
                        }
                      }
                      b:
                        while (1) {
                          B2 = z2 + -48 | 0;
                          do
                            if (B2 >>> 0 >= 10) {
                              A2 = z2 | 32;
                              C2 = (z2 | 0) == 46;
                              if (!((A2 + -97 | 0) >>> 0 < 6 | C2))
                                break b;
                              if (C2)
                                if (!w2) {
                                  s2 = m2;
                                  r2 = k2;
                                  w2 = 1;
                                  break;
                                } else {
                                  z2 = 46;
                                  break b;
                                }
                              else {
                                B2 = (z2 | 0) > 57 ? A2 + -87 | 0 : B2;
                                p2 = 83;
                                break;
                              }
                            } else
                              p2 = 83;
                          while (0);
                          if ((p2 | 0) == 83) {
                            p2 = 0;
                            do
                              if (!((k2 | 0) < 0 | (k2 | 0) == 0 & m2 >>> 0 < 8)) {
                                if ((k2 | 0) < 0 | (k2 | 0) == 0 & m2 >>> 0 < 14) {
                                  J2 = G2 * 0.0625;
                                  I2 = J2;
                                  q2 = q2 + J2 * +(B2 | 0);
                                  break;
                                }
                                if ((B2 | 0) == 0 | (y2 | 0) != 0)
                                  I2 = G2;
                                else {
                                  y2 = 1;
                                  I2 = G2;
                                  q2 = q2 + G2 * 0.5;
                                }
                              } else {
                                I2 = G2;
                                t2 = B2 + (t2 << 4) | 0;
                              }
                            while (0);
                            m2 = ne(m2 | 0, k2 | 0, 1, 0) | 0;
                            k2 = F;
                            x2 = 1;
                            G2 = I2;
                          }
                          z2 = c[n2 >> 2] | 0;
                          if (z2 >>> 0 < (c[o2 >> 2] | 0) >>> 0) {
                            c[n2 >> 2] = z2 + 1;
                            z2 = d[z2 >> 0] | 0;
                            continue;
                          } else {
                            z2 = Zd(b2) | 0;
                            continue;
                          }
                        }
                      if (!x2) {
                        e2 = (c[o2 >> 2] | 0) == 0;
                        if (!e2)
                          c[n2 >> 2] = (c[n2 >> 2] | 0) + -1;
                        if (f2) {
                          if (!e2 ? (l2 = c[n2 >> 2] | 0, c[n2 >> 2] = l2 + -1, (w2 | 0) != 0) : 0)
                            c[n2 >> 2] = l2 + -2;
                        } else
                          Yd(b2, 0);
                        J2 = +(h2 | 0) * 0;
                        i2 = g2;
                        return +J2;
                      }
                      p2 = (w2 | 0) == 0;
                      l2 = p2 ? m2 : s2;
                      p2 = p2 ? k2 : r2;
                      if ((k2 | 0) < 0 | (k2 | 0) == 0 & m2 >>> 0 < 8)
                        do {
                          t2 = t2 << 4;
                          m2 = ne(m2 | 0, k2 | 0, 1, 0) | 0;
                          k2 = F;
                        } while ((k2 | 0) < 0 | (k2 | 0) == 0 & m2 >>> 0 < 8);
                      do
                        if ((z2 | 32 | 0) == 112) {
                          m2 = he(b2, f2) | 0;
                          k2 = F;
                          if ((m2 | 0) == 0 & (k2 | 0) == -2147483648)
                            if (!f2) {
                              Yd(b2, 0);
                              J2 = 0;
                              i2 = g2;
                              return +J2;
                            } else {
                              if (!(c[o2 >> 2] | 0)) {
                                m2 = 0;
                                k2 = 0;
                                break;
                              }
                              c[n2 >> 2] = (c[n2 >> 2] | 0) + -1;
                              m2 = 0;
                              k2 = 0;
                              break;
                            }
                        } else if (!(c[o2 >> 2] | 0)) {
                          m2 = 0;
                          k2 = 0;
                        } else {
                          c[n2 >> 2] = (c[n2 >> 2] | 0) + -1;
                          m2 = 0;
                          k2 = 0;
                        }
                      while (0);
                      l2 = le(l2 | 0, p2 | 0, 2) | 0;
                      l2 = ne(l2 | 0, F | 0, -32, -1) | 0;
                      k2 = ne(l2 | 0, F | 0, m2 | 0, k2 | 0) | 0;
                      l2 = F;
                      if (!t2) {
                        J2 = +(h2 | 0) * 0;
                        i2 = g2;
                        return +J2;
                      }
                      if ((l2 | 0) > 0 | (l2 | 0) == 0 & k2 >>> 0 > (0 - j2 | 0) >>> 0) {
                        c[(Oa() | 0) >> 2] = 34;
                        J2 = +(h2 | 0) * 17976931348623157e292 * 17976931348623157e292;
                        i2 = g2;
                        return +J2;
                      }
                      H2 = j2 + -106 | 0;
                      E2 = ((H2 | 0) < 0) << 31 >> 31;
                      if ((l2 | 0) < (E2 | 0) | (l2 | 0) == (E2 | 0) & k2 >>> 0 < H2 >>> 0) {
                        c[(Oa() | 0) >> 2] = 34;
                        J2 = +(h2 | 0) * 22250738585072014e-324 * 22250738585072014e-324;
                        i2 = g2;
                        return +J2;
                      }
                      if ((t2 | 0) > -1)
                        do {
                          t2 = t2 << 1;
                          if (!(q2 >= 0.5))
                            G2 = q2;
                          else {
                            G2 = q2 + -1;
                            t2 = t2 | 1;
                          }
                          q2 = q2 + G2;
                          k2 = ne(k2 | 0, l2 | 0, -1, -1) | 0;
                          l2 = F;
                        } while ((t2 | 0) > -1);
                      j2 = je(32, 0, j2 | 0, ((j2 | 0) < 0) << 31 >> 31 | 0) | 0;
                      j2 = ne(k2 | 0, l2 | 0, j2 | 0, F | 0) | 0;
                      H2 = F;
                      if (0 > (H2 | 0) | 0 == (H2 | 0) & e2 >>> 0 > j2 >>> 0)
                        if ((j2 | 0) < 0) {
                          e2 = 0;
                          p2 = 126;
                        } else {
                          e2 = j2;
                          p2 = 124;
                        }
                      else
                        p2 = 124;
                      if ((p2 | 0) == 124)
                        if ((e2 | 0) < 53)
                          p2 = 126;
                        else {
                          j2 = e2;
                          G2 = +(h2 | 0);
                          I2 = 0;
                        }
                      if ((p2 | 0) == 126) {
                        I2 = +(h2 | 0);
                        j2 = e2;
                        G2 = I2;
                        I2 = +Va(+ +_d(1, 84 - e2 | 0), +I2);
                      }
                      H2 = (j2 | 0) < 32 & q2 != 0 & (t2 & 1 | 0) == 0;
                      q2 = G2 * (H2 ? 0 : q2) + (I2 + G2 * +(((H2 & 1) + t2 | 0) >>> 0)) - I2;
                      if (!(q2 != 0))
                        c[(Oa() | 0) >> 2] = 34;
                      J2 = +$d(q2, k2);
                      i2 = g2;
                      return +J2;
                    }
                  while (0);
                  m2 = j2 + e2 | 0;
                  l2 = 0 - m2 | 0;
                  B2 = 0;
                  while (1) {
                    if ((w2 | 0) == 46) {
                      p2 = 137;
                      break;
                    } else if ((w2 | 0) != 48) {
                      D2 = 0;
                      C2 = 0;
                      A2 = 0;
                      break;
                    }
                    r2 = c[n2 >> 2] | 0;
                    if (r2 >>> 0 < (c[o2 >> 2] | 0) >>> 0) {
                      c[n2 >> 2] = r2 + 1;
                      w2 = d[r2 >> 0] | 0;
                      B2 = 1;
                      continue;
                    } else {
                      w2 = Zd(b2) | 0;
                      B2 = 1;
                      continue;
                    }
                  }
                  if ((p2 | 0) == 137) {
                    p2 = c[n2 >> 2] | 0;
                    if (p2 >>> 0 < (c[o2 >> 2] | 0) >>> 0) {
                      c[n2 >> 2] = p2 + 1;
                      w2 = d[p2 >> 0] | 0;
                    } else
                      w2 = Zd(b2) | 0;
                    if ((w2 | 0) == 48) {
                      D2 = 0;
                      C2 = 0;
                      do {
                        D2 = ne(D2 | 0, C2 | 0, -1, -1) | 0;
                        C2 = F;
                        p2 = c[n2 >> 2] | 0;
                        if (p2 >>> 0 < (c[o2 >> 2] | 0) >>> 0) {
                          c[n2 >> 2] = p2 + 1;
                          w2 = d[p2 >> 0] | 0;
                        } else
                          w2 = Zd(b2) | 0;
                      } while ((w2 | 0) == 48);
                      B2 = 1;
                      A2 = 1;
                    } else {
                      D2 = 0;
                      C2 = 0;
                      A2 = 1;
                    }
                  }
                  c[k2 >> 2] = 0;
                  z2 = w2 + -48 | 0;
                  E2 = (w2 | 0) == 46;
                  c:
                    do
                      if (z2 >>> 0 < 10 | E2) {
                        p2 = k2 + 496 | 0;
                        y2 = 0;
                        x2 = 0;
                        t2 = 0;
                        s2 = 0;
                        r2 = 0;
                        d:
                          while (1) {
                            do
                              if (E2)
                                if (!A2) {
                                  D2 = y2;
                                  C2 = x2;
                                  A2 = 1;
                                } else
                                  break d;
                              else {
                                E2 = ne(y2 | 0, x2 | 0, 1, 0) | 0;
                                x2 = F;
                                H2 = (w2 | 0) != 48;
                                if ((s2 | 0) >= 125) {
                                  if (!H2) {
                                    y2 = E2;
                                    break;
                                  }
                                  c[p2 >> 2] = c[p2 >> 2] | 1;
                                  y2 = E2;
                                  break;
                                }
                                y2 = k2 + (s2 << 2) | 0;
                                if (t2)
                                  z2 = w2 + -48 + ((c[y2 >> 2] | 0) * 10 | 0) | 0;
                                c[y2 >> 2] = z2;
                                t2 = t2 + 1 | 0;
                                z2 = (t2 | 0) == 9;
                                y2 = E2;
                                B2 = 1;
                                t2 = z2 ? 0 : t2;
                                s2 = (z2 & 1) + s2 | 0;
                                r2 = H2 ? E2 : r2;
                              }
                            while (0);
                            w2 = c[n2 >> 2] | 0;
                            if (w2 >>> 0 < (c[o2 >> 2] | 0) >>> 0) {
                              c[n2 >> 2] = w2 + 1;
                              w2 = d[w2 >> 0] | 0;
                            } else
                              w2 = Zd(b2) | 0;
                            z2 = w2 + -48 | 0;
                            E2 = (w2 | 0) == 46;
                            if (!(z2 >>> 0 < 10 | E2)) {
                              p2 = 160;
                              break c;
                            }
                          }
                        z2 = (B2 | 0) != 0;
                        p2 = 168;
                      } else {
                        y2 = 0;
                        x2 = 0;
                        t2 = 0;
                        s2 = 0;
                        r2 = 0;
                        p2 = 160;
                      }
                    while (0);
                  do
                    if ((p2 | 0) == 160) {
                      z2 = (A2 | 0) == 0;
                      D2 = z2 ? y2 : D2;
                      C2 = z2 ? x2 : C2;
                      z2 = (B2 | 0) != 0;
                      if (!(z2 & (w2 | 32 | 0) == 101))
                        if ((w2 | 0) > -1) {
                          p2 = 168;
                          break;
                        } else {
                          p2 = 170;
                          break;
                        }
                      z2 = he(b2, f2) | 0;
                      w2 = F;
                      do
                        if ((z2 | 0) == 0 & (w2 | 0) == -2147483648)
                          if (!f2) {
                            Yd(b2, 0);
                            J2 = 0;
                            i2 = g2;
                            return +J2;
                          } else {
                            if (!(c[o2 >> 2] | 0)) {
                              z2 = 0;
                              w2 = 0;
                              break;
                            }
                            c[n2 >> 2] = (c[n2 >> 2] | 0) + -1;
                            z2 = 0;
                            w2 = 0;
                            break;
                          }
                      while (0);
                      b2 = ne(z2 | 0, w2 | 0, D2 | 0, C2 | 0) | 0;
                      C2 = F;
                    }
                  while (0);
                  if ((p2 | 0) == 168)
                    if (c[o2 >> 2] | 0) {
                      c[n2 >> 2] = (c[n2 >> 2] | 0) + -1;
                      if (z2)
                        b2 = D2;
                      else
                        p2 = 171;
                    } else
                      p2 = 170;
                  if ((p2 | 0) == 170)
                    if (z2)
                      b2 = D2;
                    else
                      p2 = 171;
                  if ((p2 | 0) == 171) {
                    c[(Oa() | 0) >> 2] = 22;
                    Yd(b2, 0);
                    J2 = 0;
                    i2 = g2;
                    return +J2;
                  }
                  n2 = c[k2 >> 2] | 0;
                  if (!n2) {
                    J2 = +(h2 | 0) * 0;
                    i2 = g2;
                    return +J2;
                  }
                  if ((b2 | 0) == (y2 | 0) & (C2 | 0) == (x2 | 0) & ((x2 | 0) < 0 | (x2 | 0) == 0 & y2 >>> 0 < 10) ? e2 >>> 0 > 30 | (n2 >>> e2 | 0) == 0 : 0) {
                    J2 = +(h2 | 0) * +(n2 >>> 0);
                    i2 = g2;
                    return +J2;
                  }
                  H2 = (j2 | 0) / -2 | 0;
                  E2 = ((H2 | 0) < 0) << 31 >> 31;
                  if ((C2 | 0) > (E2 | 0) | (C2 | 0) == (E2 | 0) & b2 >>> 0 > H2 >>> 0) {
                    c[(Oa() | 0) >> 2] = 34;
                    J2 = +(h2 | 0) * 17976931348623157e292 * 17976931348623157e292;
                    i2 = g2;
                    return +J2;
                  }
                  H2 = j2 + -106 | 0;
                  E2 = ((H2 | 0) < 0) << 31 >> 31;
                  if ((C2 | 0) < (E2 | 0) | (C2 | 0) == (E2 | 0) & b2 >>> 0 < H2 >>> 0) {
                    c[(Oa() | 0) >> 2] = 34;
                    J2 = +(h2 | 0) * 22250738585072014e-324 * 22250738585072014e-324;
                    i2 = g2;
                    return +J2;
                  }
                  if (t2) {
                    if ((t2 | 0) < 9) {
                      n2 = k2 + (s2 << 2) | 0;
                      o2 = c[n2 >> 2] | 0;
                      do {
                        o2 = o2 * 10 | 0;
                        t2 = t2 + 1 | 0;
                      } while ((t2 | 0) != 9);
                      c[n2 >> 2] = o2;
                    }
                    s2 = s2 + 1 | 0;
                  }
                  if ((r2 | 0) < 9 ? (r2 | 0) <= (b2 | 0) & (b2 | 0) < 18 : 0) {
                    if ((b2 | 0) == 9) {
                      J2 = +(h2 | 0) * +((c[k2 >> 2] | 0) >>> 0);
                      i2 = g2;
                      return +J2;
                    }
                    if ((b2 | 0) < 9) {
                      J2 = +(h2 | 0) * +((c[k2 >> 2] | 0) >>> 0) / +(c[5632 + (8 - b2 << 2) >> 2] | 0);
                      i2 = g2;
                      return +J2;
                    }
                    H2 = e2 + 27 + (ba(b2, -3) | 0) | 0;
                    n2 = c[k2 >> 2] | 0;
                    if ((H2 | 0) > 30 | (n2 >>> H2 | 0) == 0) {
                      J2 = +(h2 | 0) * +(n2 >>> 0) * +(c[5632 + (b2 + -10 << 2) >> 2] | 0);
                      i2 = g2;
                      return +J2;
                    }
                  }
                  n2 = (b2 | 0) % 9 | 0;
                  if (!n2) {
                    n2 = 0;
                    o2 = 0;
                  } else {
                    f2 = (b2 | 0) > -1 ? n2 : n2 + 9 | 0;
                    p2 = c[5632 + (8 - f2 << 2) >> 2] | 0;
                    if (s2) {
                      r2 = 1e9 / (p2 | 0) | 0;
                      n2 = 0;
                      o2 = 0;
                      t2 = 0;
                      do {
                        D2 = k2 + (t2 << 2) | 0;
                        E2 = c[D2 >> 2] | 0;
                        H2 = ((E2 >>> 0) / (p2 >>> 0) | 0) + o2 | 0;
                        c[D2 >> 2] = H2;
                        o2 = ba((E2 >>> 0) % (p2 >>> 0) | 0, r2) | 0;
                        E2 = t2;
                        t2 = t2 + 1 | 0;
                        if ((E2 | 0) == (n2 | 0) & (H2 | 0) == 0) {
                          n2 = t2 & 127;
                          b2 = b2 + -9 | 0;
                        }
                      } while ((t2 | 0) != (s2 | 0));
                      if (o2) {
                        c[k2 + (s2 << 2) >> 2] = o2;
                        s2 = s2 + 1 | 0;
                      }
                    } else {
                      n2 = 0;
                      s2 = 0;
                    }
                    o2 = 0;
                    b2 = 9 - f2 + b2 | 0;
                  }
                  e:
                    while (1) {
                      f2 = k2 + (n2 << 2) | 0;
                      if ((b2 | 0) < 18) {
                        do {
                          r2 = 0;
                          f2 = s2 + 127 | 0;
                          while (1) {
                            f2 = f2 & 127;
                            p2 = k2 + (f2 << 2) | 0;
                            t2 = le(c[p2 >> 2] | 0, 0, 29) | 0;
                            t2 = ne(t2 | 0, F | 0, r2 | 0, 0) | 0;
                            r2 = F;
                            if (r2 >>> 0 > 0 | (r2 | 0) == 0 & t2 >>> 0 > 1e9) {
                              H2 = xe(t2 | 0, r2 | 0, 1e9, 0) | 0;
                              t2 = ye(t2 | 0, r2 | 0, 1e9, 0) | 0;
                              r2 = H2;
                            } else
                              r2 = 0;
                            c[p2 >> 2] = t2;
                            p2 = (f2 | 0) == (n2 | 0);
                            if (!((f2 | 0) != (s2 + 127 & 127 | 0) | p2))
                              s2 = (t2 | 0) == 0 ? f2 : s2;
                            if (p2)
                              break;
                            else
                              f2 = f2 + -1 | 0;
                          }
                          o2 = o2 + -29 | 0;
                        } while ((r2 | 0) == 0);
                      } else {
                        if ((b2 | 0) != 18)
                          break;
                        do {
                          if ((c[f2 >> 2] | 0) >>> 0 >= 9007199) {
                            b2 = 18;
                            break e;
                          }
                          r2 = 0;
                          p2 = s2 + 127 | 0;
                          while (1) {
                            p2 = p2 & 127;
                            t2 = k2 + (p2 << 2) | 0;
                            w2 = le(c[t2 >> 2] | 0, 0, 29) | 0;
                            w2 = ne(w2 | 0, F | 0, r2 | 0, 0) | 0;
                            r2 = F;
                            if (r2 >>> 0 > 0 | (r2 | 0) == 0 & w2 >>> 0 > 1e9) {
                              H2 = xe(w2 | 0, r2 | 0, 1e9, 0) | 0;
                              w2 = ye(w2 | 0, r2 | 0, 1e9, 0) | 0;
                              r2 = H2;
                            } else
                              r2 = 0;
                            c[t2 >> 2] = w2;
                            t2 = (p2 | 0) == (n2 | 0);
                            if (!((p2 | 0) != (s2 + 127 & 127 | 0) | t2))
                              s2 = (w2 | 0) == 0 ? p2 : s2;
                            if (t2)
                              break;
                            else
                              p2 = p2 + -1 | 0;
                          }
                          o2 = o2 + -29 | 0;
                        } while ((r2 | 0) == 0);
                      }
                      n2 = n2 + 127 & 127;
                      if ((n2 | 0) == (s2 | 0)) {
                        H2 = s2 + 127 & 127;
                        s2 = k2 + ((s2 + 126 & 127) << 2) | 0;
                        c[s2 >> 2] = c[s2 >> 2] | c[k2 + (H2 << 2) >> 2];
                        s2 = H2;
                      }
                      c[k2 + (n2 << 2) >> 2] = r2;
                      b2 = b2 + 9 | 0;
                    }
                  f:
                    while (1) {
                      f2 = s2 + 1 & 127;
                      p2 = k2 + ((s2 + 127 & 127) << 2) | 0;
                      while (1) {
                        t2 = (b2 | 0) == 18;
                        r2 = (b2 | 0) > 27 ? 9 : 1;
                        while (1) {
                          w2 = 0;
                          while (1) {
                            x2 = w2 + n2 & 127;
                            if ((x2 | 0) == (s2 | 0)) {
                              w2 = 2;
                              break;
                            }
                            y2 = c[k2 + (x2 << 2) >> 2] | 0;
                            z2 = c[5624 + (w2 << 2) >> 2] | 0;
                            if (y2 >>> 0 < z2 >>> 0) {
                              w2 = 2;
                              break;
                            }
                            x2 = w2 + 1 | 0;
                            if (y2 >>> 0 > z2 >>> 0)
                              break;
                            if ((x2 | 0) < 2)
                              w2 = x2;
                            else {
                              w2 = x2;
                              break;
                            }
                          }
                          if ((w2 | 0) == 2 & t2)
                            break f;
                          o2 = r2 + o2 | 0;
                          if ((n2 | 0) == (s2 | 0))
                            n2 = s2;
                          else
                            break;
                        }
                        t2 = (1 << r2) + -1 | 0;
                        w2 = 1e9 >>> r2;
                        x2 = n2;
                        y2 = 0;
                        do {
                          D2 = k2 + (n2 << 2) | 0;
                          E2 = c[D2 >> 2] | 0;
                          H2 = (E2 >>> r2) + y2 | 0;
                          c[D2 >> 2] = H2;
                          y2 = ba(E2 & t2, w2) | 0;
                          H2 = (n2 | 0) == (x2 | 0) & (H2 | 0) == 0;
                          n2 = n2 + 1 & 127;
                          b2 = H2 ? b2 + -9 | 0 : b2;
                          x2 = H2 ? n2 : x2;
                        } while ((n2 | 0) != (s2 | 0));
                        if (!y2) {
                          n2 = x2;
                          continue;
                        }
                        if ((f2 | 0) != (x2 | 0))
                          break;
                        c[p2 >> 2] = c[p2 >> 2] | 1;
                        n2 = x2;
                      }
                      c[k2 + (s2 << 2) >> 2] = y2;
                      n2 = x2;
                      s2 = f2;
                    }
                  b2 = n2 & 127;
                  if ((b2 | 0) == (s2 | 0)) {
                    c[k2 + (f2 + -1 << 2) >> 2] = 0;
                    s2 = f2;
                  }
                  G2 = +((c[k2 + (b2 << 2) >> 2] | 0) >>> 0);
                  b2 = n2 + 1 & 127;
                  if ((b2 | 0) == (s2 | 0)) {
                    s2 = s2 + 1 & 127;
                    c[k2 + (s2 + -1 << 2) >> 2] = 0;
                  }
                  q2 = +(h2 | 0);
                  I2 = q2 * (G2 * 1e9 + +((c[k2 + (b2 << 2) >> 2] | 0) >>> 0));
                  h2 = o2 + 53 | 0;
                  j2 = h2 - j2 | 0;
                  if ((j2 | 0) < (e2 | 0))
                    if ((j2 | 0) < 0) {
                      e2 = 0;
                      b2 = 1;
                      p2 = 244;
                    } else {
                      e2 = j2;
                      b2 = 1;
                      p2 = 243;
                    }
                  else {
                    b2 = 0;
                    p2 = 243;
                  }
                  if ((p2 | 0) == 243)
                    if ((e2 | 0) < 53)
                      p2 = 244;
                    else {
                      G2 = 0;
                      J2 = 0;
                    }
                  if ((p2 | 0) == 244) {
                    L2 = +Va(+ +_d(1, 105 - e2 | 0), +I2);
                    K2 = +cb2(+I2, + +_d(1, 53 - e2 | 0));
                    G2 = L2;
                    J2 = K2;
                    I2 = L2 + (I2 - K2);
                  }
                  f2 = n2 + 2 & 127;
                  do
                    if ((f2 | 0) != (s2 | 0)) {
                      k2 = c[k2 + (f2 << 2) >> 2] | 0;
                      do
                        if (k2 >>> 0 >= 5e8) {
                          if (k2 >>> 0 > 5e8) {
                            J2 = q2 * 0.75 + J2;
                            break;
                          }
                          if ((n2 + 3 & 127 | 0) == (s2 | 0)) {
                            J2 = q2 * 0.5 + J2;
                            break;
                          } else {
                            J2 = q2 * 0.75 + J2;
                            break;
                          }
                        } else {
                          if ((k2 | 0) == 0 ? (n2 + 3 & 127 | 0) == (s2 | 0) : 0)
                            break;
                          J2 = q2 * 0.25 + J2;
                        }
                      while (0);
                      if ((53 - e2 | 0) <= 1)
                        break;
                      if (+cb2(+J2, 1) != 0)
                        break;
                      J2 = J2 + 1;
                    }
                  while (0);
                  q2 = I2 + J2 - G2;
                  do
                    if ((h2 & 2147483647 | 0) > (-2 - m2 | 0)) {
                      if (+Q(+q2) >= 9007199254740992) {
                        b2 = (b2 | 0) != 0 & (e2 | 0) == (j2 | 0) ? 0 : b2;
                        o2 = o2 + 1 | 0;
                        q2 = q2 * 0.5;
                      }
                      if ((o2 + 50 | 0) <= (l2 | 0) ? !((b2 | 0) != 0 & J2 != 0) : 0)
                        break;
                      c[(Oa() | 0) >> 2] = 34;
                    }
                  while (0);
                  L2 = +$d(q2, o2);
                  i2 = g2;
                  return +L2;
                } else if ((r2 | 0) == 3) {
                  e2 = c[n2 >> 2] | 0;
                  if (e2 >>> 0 < (c[o2 >> 2] | 0) >>> 0) {
                    c[n2 >> 2] = e2 + 1;
                    e2 = d[e2 >> 0] | 0;
                  } else
                    e2 = Zd(b2) | 0;
                  if ((e2 | 0) == 40)
                    e2 = 1;
                  else {
                    if (!(c[o2 >> 2] | 0)) {
                      L2 = u;
                      i2 = g2;
                      return +L2;
                    }
                    c[n2 >> 2] = (c[n2 >> 2] | 0) + -1;
                    L2 = u;
                    i2 = g2;
                    return +L2;
                  }
                  while (1) {
                    h2 = c[n2 >> 2] | 0;
                    if (h2 >>> 0 < (c[o2 >> 2] | 0) >>> 0) {
                      c[n2 >> 2] = h2 + 1;
                      h2 = d[h2 >> 0] | 0;
                    } else
                      h2 = Zd(b2) | 0;
                    if (!((h2 + -48 | 0) >>> 0 < 10 | (h2 + -65 | 0) >>> 0 < 26) ? !((h2 + -97 | 0) >>> 0 < 26 | (h2 | 0) == 95) : 0)
                      break;
                    e2 = e2 + 1 | 0;
                  }
                  if ((h2 | 0) == 41) {
                    L2 = u;
                    i2 = g2;
                    return +L2;
                  }
                  h2 = (c[o2 >> 2] | 0) == 0;
                  if (!h2)
                    c[n2 >> 2] = (c[n2 >> 2] | 0) + -1;
                  if (!m2) {
                    c[(Oa() | 0) >> 2] = 22;
                    Yd(b2, 0);
                    L2 = 0;
                    i2 = g2;
                    return +L2;
                  }
                  if ((e2 | 0) == 0 | h2) {
                    L2 = u;
                    i2 = g2;
                    return +L2;
                  }
                  do {
                    e2 = e2 + -1 | 0;
                    c[n2 >> 2] = (c[n2 >> 2] | 0) + -1;
                  } while ((e2 | 0) != 0);
                  q2 = u;
                  i2 = g2;
                  return +q2;
                } else {
                  if (c[o2 >> 2] | 0)
                    c[n2 >> 2] = (c[n2 >> 2] | 0) + -1;
                  c[(Oa() | 0) >> 2] = 22;
                  Yd(b2, 0);
                  L2 = 0;
                  i2 = g2;
                  return +L2;
                }
              }
            while (0);
            if ((p2 | 0) == 23) {
              e2 = (c[o2 >> 2] | 0) == 0;
              if (!e2)
                c[n2 >> 2] = (c[n2 >> 2] | 0) + -1;
              if (!(r2 >>> 0 < 4 | (f2 | 0) == 0 | e2))
                do {
                  c[n2 >> 2] = (c[n2 >> 2] | 0) + -1;
                  r2 = r2 + -1 | 0;
                } while (r2 >>> 0 > 3);
            }
            L2 = +(h2 | 0) * v;
            i2 = g2;
            return +L2;
          }
          function Yd(a2, b2) {
            a2 = a2 | 0;
            b2 = b2 | 0;
            var d2 = 0, e2 = 0, f2 = 0, g2 = 0;
            d2 = i2;
            c[a2 + 104 >> 2] = b2;
            f2 = c[a2 + 8 >> 2] | 0;
            e2 = c[a2 + 4 >> 2] | 0;
            g2 = f2 - e2 | 0;
            c[a2 + 108 >> 2] = g2;
            if ((b2 | 0) != 0 & (g2 | 0) > (b2 | 0)) {
              c[a2 + 100 >> 2] = e2 + b2;
              i2 = d2;
              return;
            } else {
              c[a2 + 100 >> 2] = f2;
              i2 = d2;
              return;
            }
          }
          function Zd(b2) {
            b2 = b2 | 0;
            var e2 = 0, f2 = 0, g2 = 0, h2 = 0, j2 = 0, k2 = 0, l2 = 0;
            f2 = i2;
            j2 = b2 + 104 | 0;
            l2 = c[j2 >> 2] | 0;
            if (!((l2 | 0) != 0 ? (c[b2 + 108 >> 2] | 0) >= (l2 | 0) : 0))
              k2 = 3;
            if ((k2 | 0) == 3 ? (e2 = be(b2) | 0, (e2 | 0) >= 0) : 0) {
              k2 = c[j2 >> 2] | 0;
              j2 = c[b2 + 8 >> 2] | 0;
              if ((k2 | 0) != 0 ? (g2 = c[b2 + 4 >> 2] | 0, h2 = k2 - (c[b2 + 108 >> 2] | 0) + -1 | 0, (j2 - g2 | 0) > (h2 | 0)) : 0)
                c[b2 + 100 >> 2] = g2 + h2;
              else
                c[b2 + 100 >> 2] = j2;
              g2 = c[b2 + 4 >> 2] | 0;
              if (j2) {
                l2 = b2 + 108 | 0;
                c[l2 >> 2] = j2 + 1 - g2 + (c[l2 >> 2] | 0);
              }
              b2 = g2 + -1 | 0;
              if ((d[b2 >> 0] | 0 | 0) == (e2 | 0)) {
                l2 = e2;
                i2 = f2;
                return l2 | 0;
              }
              a[b2 >> 0] = e2;
              l2 = e2;
              i2 = f2;
              return l2 | 0;
            }
            c[b2 + 100 >> 2] = 0;
            l2 = -1;
            i2 = f2;
            return l2 | 0;
          }
          function _d(a2, b2) {
            a2 = +a2;
            b2 = b2 | 0;
            var d2 = 0, e2 = 0;
            d2 = i2;
            if ((b2 | 0) > 1023) {
              a2 = a2 * 898846567431158e293;
              e2 = b2 + -1023 | 0;
              if ((e2 | 0) > 1023) {
                b2 = b2 + -2046 | 0;
                b2 = (b2 | 0) > 1023 ? 1023 : b2;
                a2 = a2 * 898846567431158e293;
              } else
                b2 = e2;
            } else if ((b2 | 0) < -1022) {
              a2 = a2 * 22250738585072014e-324;
              e2 = b2 + 1022 | 0;
              if ((e2 | 0) < -1022) {
                b2 = b2 + 2044 | 0;
                b2 = (b2 | 0) < -1022 ? -1022 : b2;
                a2 = a2 * 22250738585072014e-324;
              } else
                b2 = e2;
            }
            b2 = le(b2 + 1023 | 0, 0, 52) | 0;
            e2 = F;
            c[k >> 2] = b2;
            c[k + 4 >> 2] = e2;
            a2 = a2 * +h[k >> 3];
            i2 = d2;
            return +a2;
          }
          function $d(a2, b2) {
            a2 = +a2;
            b2 = b2 | 0;
            var c2 = 0;
            c2 = i2;
            a2 = +_d(a2, b2);
            i2 = c2;
            return +a2;
          }
          function ae(b2) {
            b2 = b2 | 0;
            var d2 = 0, e2 = 0, f2 = 0;
            e2 = i2;
            f2 = b2 + 74 | 0;
            d2 = a[f2 >> 0] | 0;
            a[f2 >> 0] = d2 + 255 | d2;
            f2 = b2 + 20 | 0;
            d2 = b2 + 44 | 0;
            if ((c[f2 >> 2] | 0) >>> 0 > (c[d2 >> 2] | 0) >>> 0)
              eb[c[b2 + 36 >> 2] & 1](b2, 0, 0) | 0;
            c[b2 + 16 >> 2] = 0;
            c[b2 + 28 >> 2] = 0;
            c[f2 >> 2] = 0;
            f2 = c[b2 >> 2] | 0;
            if (!(f2 & 20)) {
              f2 = c[d2 >> 2] | 0;
              c[b2 + 8 >> 2] = f2;
              c[b2 + 4 >> 2] = f2;
              f2 = 0;
              i2 = e2;
              return f2 | 0;
            }
            if (!(f2 & 4)) {
              f2 = -1;
              i2 = e2;
              return f2 | 0;
            }
            c[b2 >> 2] = f2 | 32;
            f2 = -1;
            i2 = e2;
            return f2 | 0;
          }
          function be(a2) {
            a2 = a2 | 0;
            var b2 = 0, e2 = 0;
            b2 = i2;
            i2 = i2 + 16 | 0;
            e2 = b2;
            if ((c[a2 + 8 >> 2] | 0) == 0 ? (ae(a2) | 0) != 0 : 0)
              a2 = -1;
            else if ((eb[c[a2 + 32 >> 2] & 1](a2, e2, 1) | 0) == 1)
              a2 = d[e2 >> 0] | 0;
            else
              a2 = -1;
            i2 = b2;
            return a2 | 0;
          }
          function ce(a2, b2) {
            a2 = a2 | 0;
            b2 = b2 | 0;
            var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h2 = 0;
            d2 = i2;
            i2 = i2 + 112 | 0;
            e2 = d2;
            h2 = e2 + 0 | 0;
            g2 = h2 + 112 | 0;
            do {
              c[h2 >> 2] = 0;
              h2 = h2 + 4 | 0;
            } while ((h2 | 0) < (g2 | 0));
            g2 = e2 + 4 | 0;
            c[g2 >> 2] = a2;
            h2 = e2 + 8 | 0;
            c[h2 >> 2] = -1;
            c[e2 + 44 >> 2] = a2;
            c[e2 + 76 >> 2] = -1;
            Yd(e2, 0);
            f2 = +Xd(e2, 1, 1);
            e2 = (c[g2 >> 2] | 0) - (c[h2 >> 2] | 0) + (c[e2 + 108 >> 2] | 0) | 0;
            if (!b2) {
              i2 = d2;
              return +f2;
            }
            if (e2)
              a2 = a2 + e2 | 0;
            c[b2 >> 2] = a2;
            i2 = d2;
            return +f2;
          }
          function de(a2, b2, d2) {
            a2 = a2 | 0;
            b2 = b2 | 0;
            d2 = d2 | 0;
            var e2 = 0, f2 = 0, g2 = 0;
            e2 = i2;
            i2 = i2 + 112 | 0;
            g2 = e2;
            c[g2 >> 2] = 0;
            f2 = g2 + 4 | 0;
            c[f2 >> 2] = a2;
            c[g2 + 44 >> 2] = a2;
            if ((a2 | 0) < 0)
              c[g2 + 8 >> 2] = -1;
            else
              c[g2 + 8 >> 2] = a2 + 2147483647;
            c[g2 + 76 >> 2] = -1;
            Yd(g2, 0);
            d2 = Wd(g2, d2, 1, -2147483648, 0) | 0;
            if (!b2) {
              i2 = e2;
              return d2 | 0;
            }
            c[b2 >> 2] = a2 + ((c[f2 >> 2] | 0) + (c[g2 + 108 >> 2] | 0) - (c[g2 + 8 >> 2] | 0));
            i2 = e2;
            return d2 | 0;
          }
          function ee(b2, c2) {
            b2 = b2 | 0;
            c2 = c2 | 0;
            var d2 = 0, e2 = 0, f2 = 0;
            d2 = i2;
            f2 = a[b2 >> 0] | 0;
            e2 = a[c2 >> 0] | 0;
            if (f2 << 24 >> 24 == 0 ? 1 : f2 << 24 >> 24 != e2 << 24 >> 24)
              c2 = f2;
            else {
              do {
                b2 = b2 + 1 | 0;
                c2 = c2 + 1 | 0;
                f2 = a[b2 >> 0] | 0;
                e2 = a[c2 >> 0] | 0;
              } while (!(f2 << 24 >> 24 == 0 ? 1 : f2 << 24 >> 24 != e2 << 24 >> 24));
              c2 = f2;
            }
            i2 = d2;
            return (c2 & 255) - (e2 & 255) | 0;
          }
          function fe(a2, b2) {
            a2 = a2 | 0;
            b2 = b2 | 0;
            var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h2 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, n2 = 0, o2 = 0, p2 = 0, q2 = 0, r2 = 0;
            d2 = i2;
            f2 = a2 + 4 | 0;
            e2 = c[f2 >> 2] | 0;
            l2 = e2 & -8;
            j2 = a2 + l2 | 0;
            m2 = c[1210] | 0;
            h2 = e2 & 3;
            if (!((h2 | 0) != 1 & a2 >>> 0 >= m2 >>> 0 & a2 >>> 0 < j2 >>> 0))
              Wa();
            g2 = a2 + (l2 | 4) | 0;
            p2 = c[g2 >> 2] | 0;
            if (!(p2 & 1))
              Wa();
            if (!h2) {
              if (b2 >>> 0 < 256) {
                r2 = 0;
                i2 = d2;
                return r2 | 0;
              }
              if (l2 >>> 0 >= (b2 + 4 | 0) >>> 0 ? (l2 - b2 | 0) >>> 0 <= c[1326] << 1 >>> 0 : 0) {
                r2 = a2;
                i2 = d2;
                return r2 | 0;
              }
              r2 = 0;
              i2 = d2;
              return r2 | 0;
            }
            if (l2 >>> 0 >= b2 >>> 0) {
              h2 = l2 - b2 | 0;
              if (h2 >>> 0 <= 15) {
                r2 = a2;
                i2 = d2;
                return r2 | 0;
              }
              c[f2 >> 2] = e2 & 1 | b2 | 2;
              c[a2 + (b2 + 4) >> 2] = h2 | 3;
              c[g2 >> 2] = c[g2 >> 2] | 1;
              ge(a2 + b2 | 0, h2);
              r2 = a2;
              i2 = d2;
              return r2 | 0;
            }
            if ((j2 | 0) == (c[1212] | 0)) {
              g2 = (c[1209] | 0) + l2 | 0;
              if (g2 >>> 0 <= b2 >>> 0) {
                r2 = 0;
                i2 = d2;
                return r2 | 0;
              }
              r2 = g2 - b2 | 0;
              c[f2 >> 2] = e2 & 1 | b2 | 2;
              c[a2 + (b2 + 4) >> 2] = r2 | 1;
              c[1212] = a2 + b2;
              c[1209] = r2;
              r2 = a2;
              i2 = d2;
              return r2 | 0;
            }
            if ((j2 | 0) == (c[1211] | 0)) {
              h2 = (c[1208] | 0) + l2 | 0;
              if (h2 >>> 0 < b2 >>> 0) {
                r2 = 0;
                i2 = d2;
                return r2 | 0;
              }
              g2 = h2 - b2 | 0;
              if (g2 >>> 0 > 15) {
                c[f2 >> 2] = e2 & 1 | b2 | 2;
                c[a2 + (b2 + 4) >> 2] = g2 | 1;
                c[a2 + h2 >> 2] = g2;
                e2 = a2 + (h2 + 4) | 0;
                c[e2 >> 2] = c[e2 >> 2] & -2;
                e2 = a2 + b2 | 0;
              } else {
                c[f2 >> 2] = e2 & 1 | h2 | 2;
                e2 = a2 + (h2 + 4) | 0;
                c[e2 >> 2] = c[e2 >> 2] | 1;
                e2 = 0;
                g2 = 0;
              }
              c[1208] = g2;
              c[1211] = e2;
              r2 = a2;
              i2 = d2;
              return r2 | 0;
            }
            if (p2 & 2) {
              r2 = 0;
              i2 = d2;
              return r2 | 0;
            }
            g2 = (p2 & -8) + l2 | 0;
            if (g2 >>> 0 < b2 >>> 0) {
              r2 = 0;
              i2 = d2;
              return r2 | 0;
            }
            h2 = g2 - b2 | 0;
            o2 = p2 >>> 3;
            do
              if (p2 >>> 0 >= 256) {
                n2 = c[a2 + (l2 + 24) >> 2] | 0;
                o2 = c[a2 + (l2 + 12) >> 2] | 0;
                do
                  if ((o2 | 0) == (j2 | 0)) {
                    p2 = a2 + (l2 + 20) | 0;
                    o2 = c[p2 >> 2] | 0;
                    if (!o2) {
                      p2 = a2 + (l2 + 16) | 0;
                      o2 = c[p2 >> 2] | 0;
                      if (!o2) {
                        k2 = 0;
                        break;
                      }
                    }
                    while (1) {
                      r2 = o2 + 20 | 0;
                      q2 = c[r2 >> 2] | 0;
                      if (q2) {
                        o2 = q2;
                        p2 = r2;
                        continue;
                      }
                      q2 = o2 + 16 | 0;
                      r2 = c[q2 >> 2] | 0;
                      if (!r2)
                        break;
                      else {
                        o2 = r2;
                        p2 = q2;
                      }
                    }
                    if (p2 >>> 0 < m2 >>> 0)
                      Wa();
                    else {
                      c[p2 >> 2] = 0;
                      k2 = o2;
                      break;
                    }
                  } else {
                    p2 = c[a2 + (l2 + 8) >> 2] | 0;
                    if (p2 >>> 0 < m2 >>> 0)
                      Wa();
                    m2 = p2 + 12 | 0;
                    if ((c[m2 >> 2] | 0) != (j2 | 0))
                      Wa();
                    q2 = o2 + 8 | 0;
                    if ((c[q2 >> 2] | 0) == (j2 | 0)) {
                      c[m2 >> 2] = o2;
                      c[q2 >> 2] = p2;
                      k2 = o2;
                      break;
                    } else
                      Wa();
                  }
                while (0);
                if (n2) {
                  m2 = c[a2 + (l2 + 28) >> 2] | 0;
                  o2 = 5128 + (m2 << 2) | 0;
                  if ((j2 | 0) == (c[o2 >> 2] | 0)) {
                    c[o2 >> 2] = k2;
                    if (!k2) {
                      c[1207] = c[1207] & ~(1 << m2);
                      break;
                    }
                  } else {
                    if (n2 >>> 0 < (c[1210] | 0) >>> 0)
                      Wa();
                    m2 = n2 + 16 | 0;
                    if ((c[m2 >> 2] | 0) == (j2 | 0))
                      c[m2 >> 2] = k2;
                    else
                      c[n2 + 20 >> 2] = k2;
                    if (!k2)
                      break;
                  }
                  j2 = c[1210] | 0;
                  if (k2 >>> 0 < j2 >>> 0)
                    Wa();
                  c[k2 + 24 >> 2] = n2;
                  m2 = c[a2 + (l2 + 16) >> 2] | 0;
                  do
                    if (m2)
                      if (m2 >>> 0 < j2 >>> 0)
                        Wa();
                      else {
                        c[k2 + 16 >> 2] = m2;
                        c[m2 + 24 >> 2] = k2;
                        break;
                      }
                  while (0);
                  j2 = c[a2 + (l2 + 20) >> 2] | 0;
                  if (j2)
                    if (j2 >>> 0 < (c[1210] | 0) >>> 0)
                      Wa();
                    else {
                      c[k2 + 20 >> 2] = j2;
                      c[j2 + 24 >> 2] = k2;
                      break;
                    }
                }
              } else {
                k2 = c[a2 + (l2 + 8) >> 2] | 0;
                l2 = c[a2 + (l2 + 12) >> 2] | 0;
                p2 = 4864 + (o2 << 1 << 2) | 0;
                if ((k2 | 0) != (p2 | 0)) {
                  if (k2 >>> 0 < m2 >>> 0)
                    Wa();
                  if ((c[k2 + 12 >> 2] | 0) != (j2 | 0))
                    Wa();
                }
                if ((l2 | 0) == (k2 | 0)) {
                  c[1206] = c[1206] & ~(1 << o2);
                  break;
                }
                if ((l2 | 0) != (p2 | 0)) {
                  if (l2 >>> 0 < m2 >>> 0)
                    Wa();
                  m2 = l2 + 8 | 0;
                  if ((c[m2 >> 2] | 0) == (j2 | 0))
                    n2 = m2;
                  else
                    Wa();
                } else
                  n2 = l2 + 8 | 0;
                c[k2 + 12 >> 2] = l2;
                c[n2 >> 2] = k2;
              }
            while (0);
            if (h2 >>> 0 < 16) {
              c[f2 >> 2] = g2 | e2 & 1 | 2;
              r2 = a2 + (g2 | 4) | 0;
              c[r2 >> 2] = c[r2 >> 2] | 1;
              r2 = a2;
              i2 = d2;
              return r2 | 0;
            } else {
              c[f2 >> 2] = e2 & 1 | b2 | 2;
              c[a2 + (b2 + 4) >> 2] = h2 | 3;
              r2 = a2 + (g2 | 4) | 0;
              c[r2 >> 2] = c[r2 >> 2] | 1;
              ge(a2 + b2 | 0, h2);
              r2 = a2;
              i2 = d2;
              return r2 | 0;
            }
            return 0;
          }
          function ge(a2, b2) {
            a2 = a2 | 0;
            b2 = b2 | 0;
            var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h2 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, n2 = 0, o2 = 0, p2 = 0, q2 = 0, r2 = 0, s2 = 0, t2 = 0, u2 = 0, v2 = 0;
            d2 = i2;
            h2 = a2 + b2 | 0;
            l2 = c[a2 + 4 >> 2] | 0;
            do
              if (!(l2 & 1)) {
                p2 = c[a2 >> 2] | 0;
                if (!(l2 & 3)) {
                  i2 = d2;
                  return;
                }
                l2 = a2 + (0 - p2) | 0;
                m2 = p2 + b2 | 0;
                r2 = c[1210] | 0;
                if (l2 >>> 0 < r2 >>> 0)
                  Wa();
                if ((l2 | 0) == (c[1211] | 0)) {
                  e2 = a2 + (b2 + 4) | 0;
                  n2 = c[e2 >> 2] | 0;
                  if ((n2 & 3 | 0) != 3) {
                    e2 = l2;
                    n2 = m2;
                    break;
                  }
                  c[1208] = m2;
                  c[e2 >> 2] = n2 & -2;
                  c[a2 + (4 - p2) >> 2] = m2 | 1;
                  c[h2 >> 2] = m2;
                  i2 = d2;
                  return;
                }
                s2 = p2 >>> 3;
                if (p2 >>> 0 < 256) {
                  e2 = c[a2 + (8 - p2) >> 2] | 0;
                  n2 = c[a2 + (12 - p2) >> 2] | 0;
                  o2 = 4864 + (s2 << 1 << 2) | 0;
                  if ((e2 | 0) != (o2 | 0)) {
                    if (e2 >>> 0 < r2 >>> 0)
                      Wa();
                    if ((c[e2 + 12 >> 2] | 0) != (l2 | 0))
                      Wa();
                  }
                  if ((n2 | 0) == (e2 | 0)) {
                    c[1206] = c[1206] & ~(1 << s2);
                    e2 = l2;
                    n2 = m2;
                    break;
                  }
                  if ((n2 | 0) != (o2 | 0)) {
                    if (n2 >>> 0 < r2 >>> 0)
                      Wa();
                    o2 = n2 + 8 | 0;
                    if ((c[o2 >> 2] | 0) == (l2 | 0))
                      q2 = o2;
                    else
                      Wa();
                  } else
                    q2 = n2 + 8 | 0;
                  c[e2 + 12 >> 2] = n2;
                  c[q2 >> 2] = e2;
                  e2 = l2;
                  n2 = m2;
                  break;
                }
                q2 = c[a2 + (24 - p2) >> 2] | 0;
                s2 = c[a2 + (12 - p2) >> 2] | 0;
                do
                  if ((s2 | 0) == (l2 | 0)) {
                    u2 = 16 - p2 | 0;
                    t2 = a2 + (u2 + 4) | 0;
                    s2 = c[t2 >> 2] | 0;
                    if (!s2) {
                      t2 = a2 + u2 | 0;
                      s2 = c[t2 >> 2] | 0;
                      if (!s2) {
                        o2 = 0;
                        break;
                      }
                    }
                    while (1) {
                      v2 = s2 + 20 | 0;
                      u2 = c[v2 >> 2] | 0;
                      if (u2) {
                        s2 = u2;
                        t2 = v2;
                        continue;
                      }
                      u2 = s2 + 16 | 0;
                      v2 = c[u2 >> 2] | 0;
                      if (!v2)
                        break;
                      else {
                        s2 = v2;
                        t2 = u2;
                      }
                    }
                    if (t2 >>> 0 < r2 >>> 0)
                      Wa();
                    else {
                      c[t2 >> 2] = 0;
                      o2 = s2;
                      break;
                    }
                  } else {
                    t2 = c[a2 + (8 - p2) >> 2] | 0;
                    if (t2 >>> 0 < r2 >>> 0)
                      Wa();
                    r2 = t2 + 12 | 0;
                    if ((c[r2 >> 2] | 0) != (l2 | 0))
                      Wa();
                    u2 = s2 + 8 | 0;
                    if ((c[u2 >> 2] | 0) == (l2 | 0)) {
                      c[r2 >> 2] = s2;
                      c[u2 >> 2] = t2;
                      o2 = s2;
                      break;
                    } else
                      Wa();
                  }
                while (0);
                if (q2) {
                  s2 = c[a2 + (28 - p2) >> 2] | 0;
                  r2 = 5128 + (s2 << 2) | 0;
                  if ((l2 | 0) == (c[r2 >> 2] | 0)) {
                    c[r2 >> 2] = o2;
                    if (!o2) {
                      c[1207] = c[1207] & ~(1 << s2);
                      e2 = l2;
                      n2 = m2;
                      break;
                    }
                  } else {
                    if (q2 >>> 0 < (c[1210] | 0) >>> 0)
                      Wa();
                    r2 = q2 + 16 | 0;
                    if ((c[r2 >> 2] | 0) == (l2 | 0))
                      c[r2 >> 2] = o2;
                    else
                      c[q2 + 20 >> 2] = o2;
                    if (!o2) {
                      e2 = l2;
                      n2 = m2;
                      break;
                    }
                  }
                  r2 = c[1210] | 0;
                  if (o2 >>> 0 < r2 >>> 0)
                    Wa();
                  c[o2 + 24 >> 2] = q2;
                  p2 = 16 - p2 | 0;
                  q2 = c[a2 + p2 >> 2] | 0;
                  do
                    if (q2)
                      if (q2 >>> 0 < r2 >>> 0)
                        Wa();
                      else {
                        c[o2 + 16 >> 2] = q2;
                        c[q2 + 24 >> 2] = o2;
                        break;
                      }
                  while (0);
                  p2 = c[a2 + (p2 + 4) >> 2] | 0;
                  if (p2)
                    if (p2 >>> 0 < (c[1210] | 0) >>> 0)
                      Wa();
                    else {
                      c[o2 + 20 >> 2] = p2;
                      c[p2 + 24 >> 2] = o2;
                      e2 = l2;
                      n2 = m2;
                      break;
                    }
                  else {
                    e2 = l2;
                    n2 = m2;
                  }
                } else {
                  e2 = l2;
                  n2 = m2;
                }
              } else {
                e2 = a2;
                n2 = b2;
              }
            while (0);
            l2 = c[1210] | 0;
            if (h2 >>> 0 < l2 >>> 0)
              Wa();
            m2 = a2 + (b2 + 4) | 0;
            o2 = c[m2 >> 2] | 0;
            if (!(o2 & 2)) {
              if ((h2 | 0) == (c[1212] | 0)) {
                v2 = (c[1209] | 0) + n2 | 0;
                c[1209] = v2;
                c[1212] = e2;
                c[e2 + 4 >> 2] = v2 | 1;
                if ((e2 | 0) != (c[1211] | 0)) {
                  i2 = d2;
                  return;
                }
                c[1211] = 0;
                c[1208] = 0;
                i2 = d2;
                return;
              }
              if ((h2 | 0) == (c[1211] | 0)) {
                v2 = (c[1208] | 0) + n2 | 0;
                c[1208] = v2;
                c[1211] = e2;
                c[e2 + 4 >> 2] = v2 | 1;
                c[e2 + v2 >> 2] = v2;
                i2 = d2;
                return;
              }
              n2 = (o2 & -8) + n2 | 0;
              m2 = o2 >>> 3;
              do
                if (o2 >>> 0 >= 256) {
                  k2 = c[a2 + (b2 + 24) >> 2] | 0;
                  o2 = c[a2 + (b2 + 12) >> 2] | 0;
                  do
                    if ((o2 | 0) == (h2 | 0)) {
                      o2 = a2 + (b2 + 20) | 0;
                      m2 = c[o2 >> 2] | 0;
                      if (!m2) {
                        o2 = a2 + (b2 + 16) | 0;
                        m2 = c[o2 >> 2] | 0;
                        if (!m2) {
                          j2 = 0;
                          break;
                        }
                      }
                      while (1) {
                        p2 = m2 + 20 | 0;
                        q2 = c[p2 >> 2] | 0;
                        if (q2) {
                          m2 = q2;
                          o2 = p2;
                          continue;
                        }
                        q2 = m2 + 16 | 0;
                        p2 = c[q2 >> 2] | 0;
                        if (!p2)
                          break;
                        else {
                          m2 = p2;
                          o2 = q2;
                        }
                      }
                      if (o2 >>> 0 < l2 >>> 0)
                        Wa();
                      else {
                        c[o2 >> 2] = 0;
                        j2 = m2;
                        break;
                      }
                    } else {
                      m2 = c[a2 + (b2 + 8) >> 2] | 0;
                      if (m2 >>> 0 < l2 >>> 0)
                        Wa();
                      p2 = m2 + 12 | 0;
                      if ((c[p2 >> 2] | 0) != (h2 | 0))
                        Wa();
                      l2 = o2 + 8 | 0;
                      if ((c[l2 >> 2] | 0) == (h2 | 0)) {
                        c[p2 >> 2] = o2;
                        c[l2 >> 2] = m2;
                        j2 = o2;
                        break;
                      } else
                        Wa();
                    }
                  while (0);
                  if (k2) {
                    m2 = c[a2 + (b2 + 28) >> 2] | 0;
                    l2 = 5128 + (m2 << 2) | 0;
                    if ((h2 | 0) == (c[l2 >> 2] | 0)) {
                      c[l2 >> 2] = j2;
                      if (!j2) {
                        c[1207] = c[1207] & ~(1 << m2);
                        break;
                      }
                    } else {
                      if (k2 >>> 0 < (c[1210] | 0) >>> 0)
                        Wa();
                      l2 = k2 + 16 | 0;
                      if ((c[l2 >> 2] | 0) == (h2 | 0))
                        c[l2 >> 2] = j2;
                      else
                        c[k2 + 20 >> 2] = j2;
                      if (!j2)
                        break;
                    }
                    h2 = c[1210] | 0;
                    if (j2 >>> 0 < h2 >>> 0)
                      Wa();
                    c[j2 + 24 >> 2] = k2;
                    k2 = c[a2 + (b2 + 16) >> 2] | 0;
                    do
                      if (k2)
                        if (k2 >>> 0 < h2 >>> 0)
                          Wa();
                        else {
                          c[j2 + 16 >> 2] = k2;
                          c[k2 + 24 >> 2] = j2;
                          break;
                        }
                    while (0);
                    h2 = c[a2 + (b2 + 20) >> 2] | 0;
                    if (h2)
                      if (h2 >>> 0 < (c[1210] | 0) >>> 0)
                        Wa();
                      else {
                        c[j2 + 20 >> 2] = h2;
                        c[h2 + 24 >> 2] = j2;
                        break;
                      }
                  }
                } else {
                  j2 = c[a2 + (b2 + 8) >> 2] | 0;
                  a2 = c[a2 + (b2 + 12) >> 2] | 0;
                  b2 = 4864 + (m2 << 1 << 2) | 0;
                  if ((j2 | 0) != (b2 | 0)) {
                    if (j2 >>> 0 < l2 >>> 0)
                      Wa();
                    if ((c[j2 + 12 >> 2] | 0) != (h2 | 0))
                      Wa();
                  }
                  if ((a2 | 0) == (j2 | 0)) {
                    c[1206] = c[1206] & ~(1 << m2);
                    break;
                  }
                  if ((a2 | 0) != (b2 | 0)) {
                    if (a2 >>> 0 < l2 >>> 0)
                      Wa();
                    b2 = a2 + 8 | 0;
                    if ((c[b2 >> 2] | 0) == (h2 | 0))
                      k2 = b2;
                    else
                      Wa();
                  } else
                    k2 = a2 + 8 | 0;
                  c[j2 + 12 >> 2] = a2;
                  c[k2 >> 2] = j2;
                }
              while (0);
              c[e2 + 4 >> 2] = n2 | 1;
              c[e2 + n2 >> 2] = n2;
              if ((e2 | 0) == (c[1211] | 0)) {
                c[1208] = n2;
                i2 = d2;
                return;
              }
            } else {
              c[m2 >> 2] = o2 & -2;
              c[e2 + 4 >> 2] = n2 | 1;
              c[e2 + n2 >> 2] = n2;
            }
            b2 = n2 >>> 3;
            if (n2 >>> 0 < 256) {
              a2 = b2 << 1;
              h2 = 4864 + (a2 << 2) | 0;
              j2 = c[1206] | 0;
              b2 = 1 << b2;
              if (j2 & b2) {
                a2 = 4864 + (a2 + 2 << 2) | 0;
                j2 = c[a2 >> 2] | 0;
                if (j2 >>> 0 < (c[1210] | 0) >>> 0)
                  Wa();
                else {
                  g2 = a2;
                  f2 = j2;
                }
              } else {
                c[1206] = j2 | b2;
                g2 = 4864 + (a2 + 2 << 2) | 0;
                f2 = h2;
              }
              c[g2 >> 2] = e2;
              c[f2 + 12 >> 2] = e2;
              c[e2 + 8 >> 2] = f2;
              c[e2 + 12 >> 2] = h2;
              i2 = d2;
              return;
            }
            f2 = n2 >>> 8;
            if (f2)
              if (n2 >>> 0 > 16777215)
                f2 = 31;
              else {
                u2 = (f2 + 1048320 | 0) >>> 16 & 8;
                v2 = f2 << u2;
                t2 = (v2 + 520192 | 0) >>> 16 & 4;
                v2 = v2 << t2;
                f2 = (v2 + 245760 | 0) >>> 16 & 2;
                f2 = 14 - (t2 | u2 | f2) + (v2 << f2 >>> 15) | 0;
                f2 = n2 >>> (f2 + 7 | 0) & 1 | f2 << 1;
              }
            else
              f2 = 0;
            g2 = 5128 + (f2 << 2) | 0;
            c[e2 + 28 >> 2] = f2;
            c[e2 + 20 >> 2] = 0;
            c[e2 + 16 >> 2] = 0;
            a2 = c[1207] | 0;
            h2 = 1 << f2;
            if (!(a2 & h2)) {
              c[1207] = a2 | h2;
              c[g2 >> 2] = e2;
              c[e2 + 24 >> 2] = g2;
              c[e2 + 12 >> 2] = e2;
              c[e2 + 8 >> 2] = e2;
              i2 = d2;
              return;
            }
            g2 = c[g2 >> 2] | 0;
            if ((f2 | 0) == 31)
              f2 = 0;
            else
              f2 = 25 - (f2 >>> 1) | 0;
            a:
              do
                if ((c[g2 + 4 >> 2] & -8 | 0) != (n2 | 0)) {
                  f2 = n2 << f2;
                  a2 = g2;
                  while (1) {
                    h2 = a2 + (f2 >>> 31 << 2) + 16 | 0;
                    g2 = c[h2 >> 2] | 0;
                    if (!g2)
                      break;
                    if ((c[g2 + 4 >> 2] & -8 | 0) == (n2 | 0))
                      break a;
                    else {
                      f2 = f2 << 1;
                      a2 = g2;
                    }
                  }
                  if (h2 >>> 0 < (c[1210] | 0) >>> 0)
                    Wa();
                  c[h2 >> 2] = e2;
                  c[e2 + 24 >> 2] = a2;
                  c[e2 + 12 >> 2] = e2;
                  c[e2 + 8 >> 2] = e2;
                  i2 = d2;
                  return;
                }
              while (0);
            f2 = g2 + 8 | 0;
            h2 = c[f2 >> 2] | 0;
            v2 = c[1210] | 0;
            if (!(g2 >>> 0 >= v2 >>> 0 & h2 >>> 0 >= v2 >>> 0))
              Wa();
            c[h2 + 12 >> 2] = e2;
            c[f2 >> 2] = e2;
            c[e2 + 8 >> 2] = h2;
            c[e2 + 12 >> 2] = g2;
            c[e2 + 24 >> 2] = 0;
            i2 = d2;
            return;
          }
          function he(a2, b2) {
            a2 = a2 | 0;
            b2 = b2 | 0;
            var e2 = 0, f2 = 0, g2 = 0, h2 = 0, j2 = 0, k2 = 0;
            e2 = i2;
            g2 = a2 + 4 | 0;
            h2 = c[g2 >> 2] | 0;
            f2 = a2 + 100 | 0;
            if (h2 >>> 0 < (c[f2 >> 2] | 0) >>> 0) {
              c[g2 >> 2] = h2 + 1;
              j2 = d[h2 >> 0] | 0;
            } else
              j2 = Zd(a2) | 0;
            if ((j2 | 0) == 43 | (j2 | 0) == 45) {
              k2 = c[g2 >> 2] | 0;
              h2 = (j2 | 0) == 45 & 1;
              if (k2 >>> 0 < (c[f2 >> 2] | 0) >>> 0) {
                c[g2 >> 2] = k2 + 1;
                j2 = d[k2 >> 0] | 0;
              } else
                j2 = Zd(a2) | 0;
              if ((j2 + -48 | 0) >>> 0 > 9 & (b2 | 0) != 0 ? (c[f2 >> 2] | 0) != 0 : 0)
                c[g2 >> 2] = (c[g2 >> 2] | 0) + -1;
            } else
              h2 = 0;
            if ((j2 + -48 | 0) >>> 0 > 9) {
              if (!(c[f2 >> 2] | 0)) {
                j2 = -2147483648;
                k2 = 0;
                F = j2;
                i2 = e2;
                return k2 | 0;
              }
              c[g2 >> 2] = (c[g2 >> 2] | 0) + -1;
              j2 = -2147483648;
              k2 = 0;
              F = j2;
              i2 = e2;
              return k2 | 0;
            } else
              b2 = 0;
            do {
              b2 = j2 + -48 + (b2 * 10 | 0) | 0;
              j2 = c[g2 >> 2] | 0;
              if (j2 >>> 0 < (c[f2 >> 2] | 0) >>> 0) {
                c[g2 >> 2] = j2 + 1;
                j2 = d[j2 >> 0] | 0;
              } else
                j2 = Zd(a2) | 0;
            } while ((j2 + -48 | 0) >>> 0 < 10 & (b2 | 0) < 214748364);
            k2 = ((b2 | 0) < 0) << 31 >> 31;
            if ((j2 + -48 | 0) >>> 0 < 10)
              do {
                k2 = we(b2 | 0, k2 | 0, 10, 0) | 0;
                b2 = F;
                j2 = ne(j2 | 0, ((j2 | 0) < 0) << 31 >> 31 | 0, -48, -1) | 0;
                b2 = ne(j2 | 0, F | 0, k2 | 0, b2 | 0) | 0;
                k2 = F;
                j2 = c[g2 >> 2] | 0;
                if (j2 >>> 0 < (c[f2 >> 2] | 0) >>> 0) {
                  c[g2 >> 2] = j2 + 1;
                  j2 = d[j2 >> 0] | 0;
                } else
                  j2 = Zd(a2) | 0;
              } while ((j2 + -48 | 0) >>> 0 < 10 & ((k2 | 0) < 21474836 | (k2 | 0) == 21474836 & b2 >>> 0 < 2061584302));
            if ((j2 + -48 | 0) >>> 0 < 10)
              do {
                j2 = c[g2 >> 2] | 0;
                if (j2 >>> 0 < (c[f2 >> 2] | 0) >>> 0) {
                  c[g2 >> 2] = j2 + 1;
                  j2 = d[j2 >> 0] | 0;
                } else
                  j2 = Zd(a2) | 0;
              } while ((j2 + -48 | 0) >>> 0 < 10);
            if (c[f2 >> 2] | 0)
              c[g2 >> 2] = (c[g2 >> 2] | 0) + -1;
            g2 = (h2 | 0) != 0;
            h2 = je(0, 0, b2 | 0, k2 | 0) | 0;
            j2 = g2 ? F : k2;
            k2 = g2 ? h2 : b2;
            F = j2;
            i2 = e2;
            return k2 | 0;
          }
          function ie() {
          }
          function je(a2, b2, c2, d2) {
            a2 = a2 | 0;
            b2 = b2 | 0;
            c2 = c2 | 0;
            d2 = d2 | 0;
            b2 = b2 - d2 - (c2 >>> 0 > a2 >>> 0 | 0) >>> 0;
            return (F = b2, a2 - c2 >>> 0 | 0) | 0;
          }
          function ke(b2, d2, e2) {
            b2 = b2 | 0;
            d2 = d2 | 0;
            e2 = e2 | 0;
            var f2 = 0, g2 = 0, h2 = 0, i3 = 0;
            f2 = b2 + e2 | 0;
            if ((e2 | 0) >= 20) {
              d2 = d2 & 255;
              i3 = b2 & 3;
              h2 = d2 | d2 << 8 | d2 << 16 | d2 << 24;
              g2 = f2 & ~3;
              if (i3) {
                i3 = b2 + 4 - i3 | 0;
                while ((b2 | 0) < (i3 | 0)) {
                  a[b2 >> 0] = d2;
                  b2 = b2 + 1 | 0;
                }
              }
              while ((b2 | 0) < (g2 | 0)) {
                c[b2 >> 2] = h2;
                b2 = b2 + 4 | 0;
              }
            }
            while ((b2 | 0) < (f2 | 0)) {
              a[b2 >> 0] = d2;
              b2 = b2 + 1 | 0;
            }
            return b2 - e2 | 0;
          }
          function le(a2, b2, c2) {
            a2 = a2 | 0;
            b2 = b2 | 0;
            c2 = c2 | 0;
            if ((c2 | 0) < 32) {
              F = b2 << c2 | (a2 & (1 << c2) - 1 << 32 - c2) >>> 32 - c2;
              return a2 << c2;
            }
            F = a2 << c2 - 32;
            return 0;
          }
          function me(b2) {
            b2 = b2 | 0;
            var c2 = 0;
            c2 = b2;
            while (a[c2 >> 0] | 0)
              c2 = c2 + 1 | 0;
            return c2 - b2 | 0;
          }
          function ne(a2, b2, c2, d2) {
            a2 = a2 | 0;
            b2 = b2 | 0;
            c2 = c2 | 0;
            d2 = d2 | 0;
            c2 = a2 + c2 >>> 0;
            return (F = b2 + d2 + (c2 >>> 0 < a2 >>> 0 | 0) >>> 0, c2 | 0) | 0;
          }
          function oe(a2, b2, c2) {
            a2 = a2 | 0;
            b2 = b2 | 0;
            c2 = c2 | 0;
            if ((c2 | 0) < 32) {
              F = b2 >>> c2;
              return a2 >>> c2 | (b2 & (1 << c2) - 1) << 32 - c2;
            }
            F = 0;
            return b2 >>> c2 - 32 | 0;
          }
          function pe(b2, d2, e2) {
            b2 = b2 | 0;
            d2 = d2 | 0;
            e2 = e2 | 0;
            var f2 = 0;
            if ((e2 | 0) >= 4096)
              return Ca(b2 | 0, d2 | 0, e2 | 0) | 0;
            f2 = b2 | 0;
            if ((b2 & 3) == (d2 & 3)) {
              while (b2 & 3) {
                if (!e2)
                  return f2 | 0;
                a[b2 >> 0] = a[d2 >> 0] | 0;
                b2 = b2 + 1 | 0;
                d2 = d2 + 1 | 0;
                e2 = e2 - 1 | 0;
              }
              while ((e2 | 0) >= 4) {
                c[b2 >> 2] = c[d2 >> 2];
                b2 = b2 + 4 | 0;
                d2 = d2 + 4 | 0;
                e2 = e2 - 4 | 0;
              }
            }
            while ((e2 | 0) > 0) {
              a[b2 >> 0] = a[d2 >> 0] | 0;
              b2 = b2 + 1 | 0;
              d2 = d2 + 1 | 0;
              e2 = e2 - 1 | 0;
            }
            return f2 | 0;
          }
          function qe(a2, b2, c2) {
            a2 = a2 | 0;
            b2 = b2 | 0;
            c2 = c2 | 0;
            if ((c2 | 0) < 32) {
              F = b2 >> c2;
              return a2 >>> c2 | (b2 & (1 << c2) - 1) << 32 - c2;
            }
            F = (b2 | 0) < 0 ? -1 : 0;
            return b2 >> c2 - 32 | 0;
          }
          function re(b2) {
            b2 = b2 | 0;
            var c2 = 0;
            c2 = a[n + (b2 >>> 24) >> 0] | 0;
            if ((c2 | 0) < 8)
              return c2 | 0;
            c2 = a[n + (b2 >> 16 & 255) >> 0] | 0;
            if ((c2 | 0) < 8)
              return c2 + 8 | 0;
            c2 = a[n + (b2 >> 8 & 255) >> 0] | 0;
            if ((c2 | 0) < 8)
              return c2 + 16 | 0;
            return (a[n + (b2 & 255) >> 0] | 0) + 24 | 0;
          }
          function se(b2) {
            b2 = b2 | 0;
            var c2 = 0;
            c2 = a[m + (b2 & 255) >> 0] | 0;
            if ((c2 | 0) < 8)
              return c2 | 0;
            c2 = a[m + (b2 >> 8 & 255) >> 0] | 0;
            if ((c2 | 0) < 8)
              return c2 + 8 | 0;
            c2 = a[m + (b2 >> 16 & 255) >> 0] | 0;
            if ((c2 | 0) < 8)
              return c2 + 16 | 0;
            return (a[m + (b2 >>> 24) >> 0] | 0) + 24 | 0;
          }
          function te(a2, b2) {
            a2 = a2 | 0;
            b2 = b2 | 0;
            var c2 = 0, d2 = 0, e2 = 0, f2 = 0;
            f2 = a2 & 65535;
            d2 = b2 & 65535;
            c2 = ba(d2, f2) | 0;
            e2 = a2 >>> 16;
            d2 = (c2 >>> 16) + (ba(d2, e2) | 0) | 0;
            b2 = b2 >>> 16;
            a2 = ba(b2, f2) | 0;
            return (F = (d2 >>> 16) + (ba(b2, e2) | 0) + (((d2 & 65535) + a2 | 0) >>> 16) | 0, d2 + a2 << 16 | c2 & 65535 | 0) | 0;
          }
          function ue(a2, b2, c2, d2) {
            a2 = a2 | 0;
            b2 = b2 | 0;
            c2 = c2 | 0;
            d2 = d2 | 0;
            var e2 = 0, f2 = 0, g2 = 0, h2 = 0, i3 = 0, j2 = 0;
            j2 = b2 >> 31 | ((b2 | 0) < 0 ? -1 : 0) << 1;
            i3 = ((b2 | 0) < 0 ? -1 : 0) >> 31 | ((b2 | 0) < 0 ? -1 : 0) << 1;
            f2 = d2 >> 31 | ((d2 | 0) < 0 ? -1 : 0) << 1;
            e2 = ((d2 | 0) < 0 ? -1 : 0) >> 31 | ((d2 | 0) < 0 ? -1 : 0) << 1;
            h2 = je(j2 ^ a2, i3 ^ b2, j2, i3) | 0;
            g2 = F;
            b2 = f2 ^ j2;
            a2 = e2 ^ i3;
            a2 = je((ze(h2, g2, je(f2 ^ c2, e2 ^ d2, f2, e2) | 0, F, 0) | 0) ^ b2, F ^ a2, b2, a2) | 0;
            return a2 | 0;
          }
          function ve(a2, b2, d2, e2) {
            a2 = a2 | 0;
            b2 = b2 | 0;
            d2 = d2 | 0;
            e2 = e2 | 0;
            var f2 = 0, g2 = 0, h2 = 0, j2 = 0, k2 = 0, l2 = 0;
            f2 = i2;
            i2 = i2 + 8 | 0;
            j2 = f2 | 0;
            h2 = b2 >> 31 | ((b2 | 0) < 0 ? -1 : 0) << 1;
            g2 = ((b2 | 0) < 0 ? -1 : 0) >> 31 | ((b2 | 0) < 0 ? -1 : 0) << 1;
            l2 = e2 >> 31 | ((e2 | 0) < 0 ? -1 : 0) << 1;
            k2 = ((e2 | 0) < 0 ? -1 : 0) >> 31 | ((e2 | 0) < 0 ? -1 : 0) << 1;
            b2 = je(h2 ^ a2, g2 ^ b2, h2, g2) | 0;
            a2 = F;
            ze(b2, a2, je(l2 ^ d2, k2 ^ e2, l2, k2) | 0, F, j2) | 0;
            a2 = je(c[j2 >> 2] ^ h2, c[j2 + 4 >> 2] ^ g2, h2, g2) | 0;
            b2 = F;
            i2 = f2;
            return (F = b2, a2) | 0;
          }
          function we(a2, b2, c2, d2) {
            a2 = a2 | 0;
            b2 = b2 | 0;
            c2 = c2 | 0;
            d2 = d2 | 0;
            var e2 = 0, f2 = 0;
            e2 = a2;
            f2 = c2;
            a2 = te(e2, f2) | 0;
            c2 = F;
            return (F = (ba(b2, f2) | 0) + (ba(d2, e2) | 0) + c2 | c2 & 0, a2 | 0 | 0) | 0;
          }
          function xe(a2, b2, c2, d2) {
            a2 = a2 | 0;
            b2 = b2 | 0;
            c2 = c2 | 0;
            d2 = d2 | 0;
            a2 = ze(a2, b2, c2, d2, 0) | 0;
            return a2 | 0;
          }
          function ye(a2, b2, d2, e2) {
            a2 = a2 | 0;
            b2 = b2 | 0;
            d2 = d2 | 0;
            e2 = e2 | 0;
            var f2 = 0, g2 = 0;
            g2 = i2;
            i2 = i2 + 8 | 0;
            f2 = g2 | 0;
            ze(a2, b2, d2, e2, f2) | 0;
            i2 = g2;
            return (F = c[f2 + 4 >> 2] | 0, c[f2 >> 2] | 0) | 0;
          }
          function ze(a2, b2, d2, e2, f2) {
            a2 = a2 | 0;
            b2 = b2 | 0;
            d2 = d2 | 0;
            e2 = e2 | 0;
            f2 = f2 | 0;
            var g2 = 0, h2 = 0, i3 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, n2 = 0, o2 = 0, p2 = 0;
            h2 = a2;
            j2 = b2;
            i3 = j2;
            l2 = d2;
            g2 = e2;
            k2 = g2;
            if (!i3) {
              g2 = (f2 | 0) != 0;
              if (!k2) {
                if (g2) {
                  c[f2 >> 2] = (h2 >>> 0) % (l2 >>> 0);
                  c[f2 + 4 >> 2] = 0;
                }
                k2 = 0;
                m2 = (h2 >>> 0) / (l2 >>> 0) >>> 0;
                return (F = k2, m2) | 0;
              } else {
                if (!g2) {
                  l2 = 0;
                  m2 = 0;
                  return (F = l2, m2) | 0;
                }
                c[f2 >> 2] = a2 | 0;
                c[f2 + 4 >> 2] = b2 & 0;
                l2 = 0;
                m2 = 0;
                return (F = l2, m2) | 0;
              }
            }
            m2 = (k2 | 0) == 0;
            do
              if (l2) {
                if (!m2) {
                  k2 = (re(k2 | 0) | 0) - (re(i3 | 0) | 0) | 0;
                  if (k2 >>> 0 <= 31) {
                    m2 = k2 + 1 | 0;
                    l2 = 31 - k2 | 0;
                    a2 = k2 - 31 >> 31;
                    j2 = m2;
                    b2 = h2 >>> (m2 >>> 0) & a2 | i3 << l2;
                    a2 = i3 >>> (m2 >>> 0) & a2;
                    k2 = 0;
                    l2 = h2 << l2;
                    break;
                  }
                  if (!f2) {
                    l2 = 0;
                    m2 = 0;
                    return (F = l2, m2) | 0;
                  }
                  c[f2 >> 2] = a2 | 0;
                  c[f2 + 4 >> 2] = j2 | b2 & 0;
                  l2 = 0;
                  m2 = 0;
                  return (F = l2, m2) | 0;
                }
                k2 = l2 - 1 | 0;
                if (k2 & l2) {
                  l2 = (re(l2 | 0) | 0) + 33 - (re(i3 | 0) | 0) | 0;
                  p2 = 64 - l2 | 0;
                  m2 = 32 - l2 | 0;
                  n2 = m2 >> 31;
                  o2 = l2 - 32 | 0;
                  a2 = o2 >> 31;
                  j2 = l2;
                  b2 = m2 - 1 >> 31 & i3 >>> (o2 >>> 0) | (i3 << m2 | h2 >>> (l2 >>> 0)) & a2;
                  a2 = a2 & i3 >>> (l2 >>> 0);
                  k2 = h2 << p2 & n2;
                  l2 = (i3 << p2 | h2 >>> (o2 >>> 0)) & n2 | h2 << m2 & l2 - 33 >> 31;
                  break;
                }
                if (f2) {
                  c[f2 >> 2] = k2 & h2;
                  c[f2 + 4 >> 2] = 0;
                }
                if ((l2 | 0) == 1) {
                  o2 = j2 | b2 & 0;
                  p2 = a2 | 0 | 0;
                  return (F = o2, p2) | 0;
                } else {
                  p2 = se(l2 | 0) | 0;
                  o2 = i3 >>> (p2 >>> 0) | 0;
                  p2 = i3 << 32 - p2 | h2 >>> (p2 >>> 0) | 0;
                  return (F = o2, p2) | 0;
                }
              } else {
                if (m2) {
                  if (f2) {
                    c[f2 >> 2] = (i3 >>> 0) % (l2 >>> 0);
                    c[f2 + 4 >> 2] = 0;
                  }
                  o2 = 0;
                  p2 = (i3 >>> 0) / (l2 >>> 0) >>> 0;
                  return (F = o2, p2) | 0;
                }
                if (!h2) {
                  if (f2) {
                    c[f2 >> 2] = 0;
                    c[f2 + 4 >> 2] = (i3 >>> 0) % (k2 >>> 0);
                  }
                  o2 = 0;
                  p2 = (i3 >>> 0) / (k2 >>> 0) >>> 0;
                  return (F = o2, p2) | 0;
                }
                l2 = k2 - 1 | 0;
                if (!(l2 & k2)) {
                  if (f2) {
                    c[f2 >> 2] = a2 | 0;
                    c[f2 + 4 >> 2] = l2 & i3 | b2 & 0;
                  }
                  o2 = 0;
                  p2 = i3 >>> ((se(k2 | 0) | 0) >>> 0);
                  return (F = o2, p2) | 0;
                }
                k2 = (re(k2 | 0) | 0) - (re(i3 | 0) | 0) | 0;
                if (k2 >>> 0 <= 30) {
                  a2 = k2 + 1 | 0;
                  l2 = 31 - k2 | 0;
                  j2 = a2;
                  b2 = i3 << l2 | h2 >>> (a2 >>> 0);
                  a2 = i3 >>> (a2 >>> 0);
                  k2 = 0;
                  l2 = h2 << l2;
                  break;
                }
                if (!f2) {
                  o2 = 0;
                  p2 = 0;
                  return (F = o2, p2) | 0;
                }
                c[f2 >> 2] = a2 | 0;
                c[f2 + 4 >> 2] = j2 | b2 & 0;
                o2 = 0;
                p2 = 0;
                return (F = o2, p2) | 0;
              }
            while (0);
            if (!j2) {
              g2 = l2;
              e2 = 0;
              i3 = 0;
            } else {
              h2 = d2 | 0 | 0;
              g2 = g2 | e2 & 0;
              e2 = ne(h2, g2, -1, -1) | 0;
              d2 = F;
              i3 = 0;
              do {
                m2 = l2;
                l2 = k2 >>> 31 | l2 << 1;
                k2 = i3 | k2 << 1;
                m2 = b2 << 1 | m2 >>> 31 | 0;
                n2 = b2 >>> 31 | a2 << 1 | 0;
                je(e2, d2, m2, n2) | 0;
                p2 = F;
                o2 = p2 >> 31 | ((p2 | 0) < 0 ? -1 : 0) << 1;
                i3 = o2 & 1;
                b2 = je(m2, n2, o2 & h2, (((p2 | 0) < 0 ? -1 : 0) >> 31 | ((p2 | 0) < 0 ? -1 : 0) << 1) & g2) | 0;
                a2 = F;
                j2 = j2 - 1 | 0;
              } while ((j2 | 0) != 0);
              g2 = l2;
              e2 = 0;
            }
            h2 = 0;
            if (f2) {
              c[f2 >> 2] = b2;
              c[f2 + 4 >> 2] = a2;
            }
            o2 = (k2 | 0) >>> 31 | (g2 | h2) << 1 | (h2 << 1 | k2 >>> 31) & 0 | e2;
            p2 = (k2 << 1 | 0 >>> 31) & -2 | i3;
            return (F = o2, p2) | 0;
          }
          function Ae(a2, b2, c2, d2) {
            a2 = a2 | 0;
            b2 = b2 | 0;
            c2 = c2 | 0;
            d2 = d2 | 0;
            return eb[a2 & 1](b2 | 0, c2 | 0, d2 | 0) | 0;
          }
          function Be(a2, b2, c2, d2, e2, f2) {
            a2 = a2 | 0;
            b2 = b2 | 0;
            c2 = c2 | 0;
            d2 = d2 | 0;
            e2 = e2 | 0;
            f2 = f2 | 0;
            fb[a2 & 3](b2 | 0, c2 | 0, d2 | 0, e2 | 0, f2 | 0);
          }
          function Ce(a2, b2) {
            a2 = a2 | 0;
            b2 = b2 | 0;
            gb[a2 & 31](b2 | 0);
          }
          function De(a2, b2, c2) {
            a2 = a2 | 0;
            b2 = b2 | 0;
            c2 = c2 | 0;
            hb[a2 & 3](b2 | 0, c2 | 0);
          }
          function Ee(a2, b2) {
            a2 = a2 | 0;
            b2 = b2 | 0;
            return ib[a2 & 1](b2 | 0) | 0;
          }
          function Fe(a2) {
            a2 = a2 | 0;
            jb[a2 & 3]();
          }
          function Ge(a2, b2, c2, d2, e2, f2, g2) {
            a2 = a2 | 0;
            b2 = b2 | 0;
            c2 = c2 | 0;
            d2 = d2 | 0;
            e2 = e2 | 0;
            f2 = f2 | 0;
            g2 = g2 | 0;
            kb[a2 & 3](b2 | 0, c2 | 0, d2 | 0, e2 | 0, f2 | 0, g2 | 0);
          }
          function He(a2, b2, c2) {
            a2 = a2 | 0;
            b2 = b2 | 0;
            c2 = c2 | 0;
            return lb[a2 & 3](b2 | 0, c2 | 0) | 0;
          }
          function Ie(a2, b2, c2, d2, e2) {
            a2 = a2 | 0;
            b2 = b2 | 0;
            c2 = c2 | 0;
            d2 = d2 | 0;
            e2 = e2 | 0;
            mb[a2 & 3](b2 | 0, c2 | 0, d2 | 0, e2 | 0);
          }
          function Je(a2, b2, c2) {
            a2 = a2 | 0;
            b2 = b2 | 0;
            c2 = c2 | 0;
            ca(0);
            return 0;
          }
          function Ke(a2, b2, c2, d2, e2) {
            a2 = a2 | 0;
            b2 = b2 | 0;
            c2 = c2 | 0;
            d2 = d2 | 0;
            e2 = e2 | 0;
            ca(1);
          }
          function Le(a2) {
            a2 = a2 | 0;
            ca(2);
          }
          function Me(a2, b2) {
            a2 = a2 | 0;
            b2 = b2 | 0;
            ca(3);
          }
          function Ne(a2) {
            a2 = a2 | 0;
            ca(4);
            return 0;
          }
          function Oe() {
            ca(5);
          }
          function Pe() {
            bb();
          }
          function Qe(a2, b2, c2, d2, e2, f2) {
            a2 = a2 | 0;
            b2 = b2 | 0;
            c2 = c2 | 0;
            d2 = d2 | 0;
            e2 = e2 | 0;
            f2 = f2 | 0;
            ca(6);
          }
          function Re(a2, b2) {
            a2 = a2 | 0;
            b2 = b2 | 0;
            ca(7);
            return 0;
          }
          function Se(a2, b2, c2, d2) {
            a2 = a2 | 0;
            b2 = b2 | 0;
            c2 = c2 | 0;
            d2 = d2 | 0;
            ca(8);
          }
          var eb = [Je, Dd];
          var fb = [Ke, Kd, Jd, Ke];
          var gb = [Le, wb, yb, Ab, Db, Ib, Hb, bc, dc, zc, yc, Oc, rd, qd, yd, Bd, zd, Ad, Cd, zb, Rd, Le, Le, Le, Le, Le, Le, Le, Le, Le, Le, Le];
          var hb = [Me, Cb, Fb, fc];
          var ib = [Ne, sd];
          var jb = [Oe, Pe, Pd, Qd];
          var kb = [Qe, Md, Ld, Qe];
          var lb = [Re, Bb, Eb, ec];
          var mb = [Se, Fd, Gd, Se];
          return { _yo: $c, _strlen: me, _retireVar: id, _bitshift64Lshr: oe, _unyo: ad, _solve: ed, _bitshift64Shl: le, _getSolution: fd, ___cxa_is_pointer_type: Od, _memset: ke, _getNumVars: gd, _memcpy: pe, _getConflictClauseSize: jd, _addClause: dd, _i64Subtract: je, _createTheSolver: bd, _realloc: Ud, _i64Add: ne, _solveAssuming: hd, ___cxa_can_catch: Nd, _ensureVar: cd, _getConflictClause: kd, _free: Td, _malloc: Sd, __GLOBAL__I_a: cc, __GLOBAL__I_a127: Pc, runPostSets: ie, stackAlloc: nb, stackSave: ob, stackRestore: pb, setThrew: qb, setTempRet0: tb, getTempRet0: ub, dynCall_iiii: Ae, dynCall_viiiii: Be, dynCall_vi: Ce, dynCall_vii: De, dynCall_ii: Ee, dynCall_v: Fe, dynCall_viiiiii: Ge, dynCall_iii: He, dynCall_viiii: Ie };
        }(Module.asmGlobalArg, Module.asmLibraryArg, buffer);
        var _yo = Module["_yo"] = asm["_yo"];
        var _strlen = Module["_strlen"] = asm["_strlen"];
        var _retireVar = Module["_retireVar"] = asm["_retireVar"];
        var _bitshift64Lshr = Module["_bitshift64Lshr"] = asm["_bitshift64Lshr"];
        var _unyo = Module["_unyo"] = asm["_unyo"];
        var _solve = Module["_solve"] = asm["_solve"];
        var _bitshift64Shl = Module["_bitshift64Shl"] = asm["_bitshift64Shl"];
        var _getSolution = Module["_getSolution"] = asm["_getSolution"];
        var ___cxa_is_pointer_type = Module["___cxa_is_pointer_type"] = asm["___cxa_is_pointer_type"];
        var _memset = Module["_memset"] = asm["_memset"];
        var _getNumVars = Module["_getNumVars"] = asm["_getNumVars"];
        var _memcpy = Module["_memcpy"] = asm["_memcpy"];
        var _getConflictClauseSize = Module["_getConflictClauseSize"] = asm["_getConflictClauseSize"];
        var _addClause = Module["_addClause"] = asm["_addClause"];
        var _i64Subtract = Module["_i64Subtract"] = asm["_i64Subtract"];
        var _createTheSolver = Module["_createTheSolver"] = asm["_createTheSolver"];
        var _realloc = Module["_realloc"] = asm["_realloc"];
        var _i64Add = Module["_i64Add"] = asm["_i64Add"];
        var _solveAssuming = Module["_solveAssuming"] = asm["_solveAssuming"];
        var ___cxa_can_catch = Module["___cxa_can_catch"] = asm["___cxa_can_catch"];
        var _ensureVar = Module["_ensureVar"] = asm["_ensureVar"];
        var _getConflictClause = Module["_getConflictClause"] = asm["_getConflictClause"];
        var _free = Module["_free"] = asm["_free"];
        var _malloc = Module["_malloc"] = asm["_malloc"];
        var __GLOBAL__I_a = Module["__GLOBAL__I_a"] = asm["__GLOBAL__I_a"];
        var __GLOBAL__I_a127 = Module["__GLOBAL__I_a127"] = asm["__GLOBAL__I_a127"];
        var runPostSets = Module["runPostSets"] = asm["runPostSets"];
        var dynCall_iiii = Module["dynCall_iiii"] = asm["dynCall_iiii"];
        var dynCall_viiiii = Module["dynCall_viiiii"] = asm["dynCall_viiiii"];
        var dynCall_vi = Module["dynCall_vi"] = asm["dynCall_vi"];
        var dynCall_vii = Module["dynCall_vii"] = asm["dynCall_vii"];
        var dynCall_ii = Module["dynCall_ii"] = asm["dynCall_ii"];
        var dynCall_v = Module["dynCall_v"] = asm["dynCall_v"];
        var dynCall_viiiiii = Module["dynCall_viiiiii"] = asm["dynCall_viiiiii"];
        var dynCall_iii = Module["dynCall_iii"] = asm["dynCall_iii"];
        var dynCall_viiii = Module["dynCall_viiii"] = asm["dynCall_viiii"];
        Runtime.stackAlloc = asm["stackAlloc"];
        Runtime.stackSave = asm["stackSave"];
        Runtime.stackRestore = asm["stackRestore"];
        Runtime.setTempRet0 = asm["setTempRet0"];
        Runtime.getTempRet0 = asm["getTempRet0"];
        var i64Math = function() {
          var goog = { math: {} };
          goog.math.Long = function(low, high) {
            this.low_ = low | 0;
            this.high_ = high | 0;
          };
          goog.math.Long.IntCache_ = {};
          goog.math.Long.fromInt = function(value) {
            if (-128 <= value && value < 128) {
              var cachedObj = goog.math.Long.IntCache_[value];
              if (cachedObj) {
                return cachedObj;
              }
            }
            var obj = new goog.math.Long(value | 0, value < 0 ? -1 : 0);
            if (-128 <= value && value < 128) {
              goog.math.Long.IntCache_[value] = obj;
            }
            return obj;
          };
          goog.math.Long.fromNumber = function(value) {
            if (isNaN(value) || !isFinite(value)) {
              return goog.math.Long.ZERO;
            } else if (value <= -goog.math.Long.TWO_PWR_63_DBL_) {
              return goog.math.Long.MIN_VALUE;
            } else if (value + 1 >= goog.math.Long.TWO_PWR_63_DBL_) {
              return goog.math.Long.MAX_VALUE;
            } else if (value < 0) {
              return goog.math.Long.fromNumber(-value).negate();
            } else {
              return new goog.math.Long(value % goog.math.Long.TWO_PWR_32_DBL_ | 0, value / goog.math.Long.TWO_PWR_32_DBL_ | 0);
            }
          };
          goog.math.Long.fromBits = function(lowBits, highBits) {
            return new goog.math.Long(lowBits, highBits);
          };
          goog.math.Long.fromString = function(str, opt_radix) {
            if (str.length == 0) {
              throw Error("number format error: empty string");
            }
            var radix = opt_radix || 10;
            if (radix < 2 || 36 < radix) {
              throw Error("radix out of range: " + radix);
            }
            if (str.charAt(0) == "-") {
              return goog.math.Long.fromString(str.substring(1), radix).negate();
            } else if (str.indexOf("-") >= 0) {
              throw Error('number format error: interior "-" character: ' + str);
            }
            var radixToPower = goog.math.Long.fromNumber(Math.pow(radix, 8));
            var result2 = goog.math.Long.ZERO;
            for (var i2 = 0; i2 < str.length; i2 += 8) {
              var size2 = Math.min(8, str.length - i2);
              var value = parseInt(str.substring(i2, i2 + size2), radix);
              if (size2 < 8) {
                var power = goog.math.Long.fromNumber(Math.pow(radix, size2));
                result2 = result2.multiply(power).add(goog.math.Long.fromNumber(value));
              } else {
                result2 = result2.multiply(radixToPower);
                result2 = result2.add(goog.math.Long.fromNumber(value));
              }
            }
            return result2;
          };
          goog.math.Long.TWO_PWR_16_DBL_ = 1 << 16;
          goog.math.Long.TWO_PWR_24_DBL_ = 1 << 24;
          goog.math.Long.TWO_PWR_32_DBL_ = goog.math.Long.TWO_PWR_16_DBL_ * goog.math.Long.TWO_PWR_16_DBL_;
          goog.math.Long.TWO_PWR_31_DBL_ = goog.math.Long.TWO_PWR_32_DBL_ / 2;
          goog.math.Long.TWO_PWR_48_DBL_ = goog.math.Long.TWO_PWR_32_DBL_ * goog.math.Long.TWO_PWR_16_DBL_;
          goog.math.Long.TWO_PWR_64_DBL_ = goog.math.Long.TWO_PWR_32_DBL_ * goog.math.Long.TWO_PWR_32_DBL_;
          goog.math.Long.TWO_PWR_63_DBL_ = goog.math.Long.TWO_PWR_64_DBL_ / 2;
          goog.math.Long.ZERO = goog.math.Long.fromInt(0);
          goog.math.Long.ONE = goog.math.Long.fromInt(1);
          goog.math.Long.NEG_ONE = goog.math.Long.fromInt(-1);
          goog.math.Long.MAX_VALUE = goog.math.Long.fromBits(4294967295 | 0, 2147483647 | 0);
          goog.math.Long.MIN_VALUE = goog.math.Long.fromBits(0, 2147483648 | 0);
          goog.math.Long.TWO_PWR_24_ = goog.math.Long.fromInt(1 << 24);
          goog.math.Long.prototype.toInt = function() {
            return this.low_;
          };
          goog.math.Long.prototype.toNumber = function() {
            return this.high_ * goog.math.Long.TWO_PWR_32_DBL_ + this.getLowBitsUnsigned();
          };
          goog.math.Long.prototype.toString = function(opt_radix) {
            var radix = opt_radix || 10;
            if (radix < 2 || 36 < radix) {
              throw Error("radix out of range: " + radix);
            }
            if (this.isZero()) {
              return "0";
            }
            if (this.isNegative()) {
              if (this.equals(goog.math.Long.MIN_VALUE)) {
                var radixLong = goog.math.Long.fromNumber(radix);
                var div = this.div(radixLong);
                var rem = div.multiply(radixLong).subtract(this);
                return div.toString(radix) + rem.toInt().toString(radix);
              } else {
                return "-" + this.negate().toString(radix);
              }
            }
            var radixToPower = goog.math.Long.fromNumber(Math.pow(radix, 6));
            var rem = this;
            var result2 = "";
            while (true) {
              var remDiv = rem.div(radixToPower);
              var intval = rem.subtract(remDiv.multiply(radixToPower)).toInt();
              var digits = intval.toString(radix);
              rem = remDiv;
              if (rem.isZero()) {
                return digits + result2;
              } else {
                while (digits.length < 6) {
                  digits = "0" + digits;
                }
                result2 = "" + digits + result2;
              }
            }
          };
          goog.math.Long.prototype.getHighBits = function() {
            return this.high_;
          };
          goog.math.Long.prototype.getLowBits = function() {
            return this.low_;
          };
          goog.math.Long.prototype.getLowBitsUnsigned = function() {
            return this.low_ >= 0 ? this.low_ : goog.math.Long.TWO_PWR_32_DBL_ + this.low_;
          };
          goog.math.Long.prototype.getNumBitsAbs = function() {
            if (this.isNegative()) {
              if (this.equals(goog.math.Long.MIN_VALUE)) {
                return 64;
              } else {
                return this.negate().getNumBitsAbs();
              }
            } else {
              var val = this.high_ != 0 ? this.high_ : this.low_;
              for (var bit = 31; bit > 0; bit--) {
                if ((val & 1 << bit) != 0) {
                  break;
                }
              }
              return this.high_ != 0 ? bit + 33 : bit + 1;
            }
          };
          goog.math.Long.prototype.isZero = function() {
            return this.high_ == 0 && this.low_ == 0;
          };
          goog.math.Long.prototype.isNegative = function() {
            return this.high_ < 0;
          };
          goog.math.Long.prototype.isOdd = function() {
            return (this.low_ & 1) == 1;
          };
          goog.math.Long.prototype.equals = function(other) {
            return this.high_ == other.high_ && this.low_ == other.low_;
          };
          goog.math.Long.prototype.notEquals = function(other) {
            return this.high_ != other.high_ || this.low_ != other.low_;
          };
          goog.math.Long.prototype.lessThan = function(other) {
            return this.compare(other) < 0;
          };
          goog.math.Long.prototype.lessThanOrEqual = function(other) {
            return this.compare(other) <= 0;
          };
          goog.math.Long.prototype.greaterThan = function(other) {
            return this.compare(other) > 0;
          };
          goog.math.Long.prototype.greaterThanOrEqual = function(other) {
            return this.compare(other) >= 0;
          };
          goog.math.Long.prototype.compare = function(other) {
            if (this.equals(other)) {
              return 0;
            }
            var thisNeg = this.isNegative();
            var otherNeg = other.isNegative();
            if (thisNeg && !otherNeg) {
              return -1;
            }
            if (!thisNeg && otherNeg) {
              return 1;
            }
            if (this.subtract(other).isNegative()) {
              return -1;
            } else {
              return 1;
            }
          };
          goog.math.Long.prototype.negate = function() {
            if (this.equals(goog.math.Long.MIN_VALUE)) {
              return goog.math.Long.MIN_VALUE;
            } else {
              return this.not().add(goog.math.Long.ONE);
            }
          };
          goog.math.Long.prototype.add = function(other) {
            var a48 = this.high_ >>> 16;
            var a32 = this.high_ & 65535;
            var a16 = this.low_ >>> 16;
            var a00 = this.low_ & 65535;
            var b48 = other.high_ >>> 16;
            var b32 = other.high_ & 65535;
            var b16 = other.low_ >>> 16;
            var b00 = other.low_ & 65535;
            var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
            c00 += a00 + b00;
            c16 += c00 >>> 16;
            c00 &= 65535;
            c16 += a16 + b16;
            c32 += c16 >>> 16;
            c16 &= 65535;
            c32 += a32 + b32;
            c48 += c32 >>> 16;
            c32 &= 65535;
            c48 += a48 + b48;
            c48 &= 65535;
            return goog.math.Long.fromBits(c16 << 16 | c00, c48 << 16 | c32);
          };
          goog.math.Long.prototype.subtract = function(other) {
            return this.add(other.negate());
          };
          goog.math.Long.prototype.multiply = function(other) {
            if (this.isZero()) {
              return goog.math.Long.ZERO;
            } else if (other.isZero()) {
              return goog.math.Long.ZERO;
            }
            if (this.equals(goog.math.Long.MIN_VALUE)) {
              return other.isOdd() ? goog.math.Long.MIN_VALUE : goog.math.Long.ZERO;
            } else if (other.equals(goog.math.Long.MIN_VALUE)) {
              return this.isOdd() ? goog.math.Long.MIN_VALUE : goog.math.Long.ZERO;
            }
            if (this.isNegative()) {
              if (other.isNegative()) {
                return this.negate().multiply(other.negate());
              } else {
                return this.negate().multiply(other).negate();
              }
            } else if (other.isNegative()) {
              return this.multiply(other.negate()).negate();
            }
            if (this.lessThan(goog.math.Long.TWO_PWR_24_) && other.lessThan(goog.math.Long.TWO_PWR_24_)) {
              return goog.math.Long.fromNumber(this.toNumber() * other.toNumber());
            }
            var a48 = this.high_ >>> 16;
            var a32 = this.high_ & 65535;
            var a16 = this.low_ >>> 16;
            var a00 = this.low_ & 65535;
            var b48 = other.high_ >>> 16;
            var b32 = other.high_ & 65535;
            var b16 = other.low_ >>> 16;
            var b00 = other.low_ & 65535;
            var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
            c00 += a00 * b00;
            c16 += c00 >>> 16;
            c00 &= 65535;
            c16 += a16 * b00;
            c32 += c16 >>> 16;
            c16 &= 65535;
            c16 += a00 * b16;
            c32 += c16 >>> 16;
            c16 &= 65535;
            c32 += a32 * b00;
            c48 += c32 >>> 16;
            c32 &= 65535;
            c32 += a16 * b16;
            c48 += c32 >>> 16;
            c32 &= 65535;
            c32 += a00 * b32;
            c48 += c32 >>> 16;
            c32 &= 65535;
            c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
            c48 &= 65535;
            return goog.math.Long.fromBits(c16 << 16 | c00, c48 << 16 | c32);
          };
          goog.math.Long.prototype.div = function(other) {
            if (other.isZero()) {
              throw Error("division by zero");
            } else if (this.isZero()) {
              return goog.math.Long.ZERO;
            }
            if (this.equals(goog.math.Long.MIN_VALUE)) {
              if (other.equals(goog.math.Long.ONE) || other.equals(goog.math.Long.NEG_ONE)) {
                return goog.math.Long.MIN_VALUE;
              } else if (other.equals(goog.math.Long.MIN_VALUE)) {
                return goog.math.Long.ONE;
              } else {
                var halfThis = this.shiftRight(1);
                var approx = halfThis.div(other).shiftLeft(1);
                if (approx.equals(goog.math.Long.ZERO)) {
                  return other.isNegative() ? goog.math.Long.ONE : goog.math.Long.NEG_ONE;
                } else {
                  var rem = this.subtract(other.multiply(approx));
                  var result2 = approx.add(rem.div(other));
                  return result2;
                }
              }
            } else if (other.equals(goog.math.Long.MIN_VALUE)) {
              return goog.math.Long.ZERO;
            }
            if (this.isNegative()) {
              if (other.isNegative()) {
                return this.negate().div(other.negate());
              } else {
                return this.negate().div(other).negate();
              }
            } else if (other.isNegative()) {
              return this.div(other.negate()).negate();
            }
            var res = goog.math.Long.ZERO;
            var rem = this;
            while (rem.greaterThanOrEqual(other)) {
              var approx = Math.max(1, Math.floor(rem.toNumber() / other.toNumber()));
              var log2 = Math.ceil(Math.log(approx) / Math.LN2);
              var delta = log2 <= 48 ? 1 : Math.pow(2, log2 - 48);
              var approxRes = goog.math.Long.fromNumber(approx);
              var approxRem = approxRes.multiply(other);
              while (approxRem.isNegative() || approxRem.greaterThan(rem)) {
                approx -= delta;
                approxRes = goog.math.Long.fromNumber(approx);
                approxRem = approxRes.multiply(other);
              }
              if (approxRes.isZero()) {
                approxRes = goog.math.Long.ONE;
              }
              res = res.add(approxRes);
              rem = rem.subtract(approxRem);
            }
            return res;
          };
          goog.math.Long.prototype.modulo = function(other) {
            return this.subtract(this.div(other).multiply(other));
          };
          goog.math.Long.prototype.not = function() {
            return goog.math.Long.fromBits(~this.low_, ~this.high_);
          };
          goog.math.Long.prototype.and = function(other) {
            return goog.math.Long.fromBits(this.low_ & other.low_, this.high_ & other.high_);
          };
          goog.math.Long.prototype.or = function(other) {
            return goog.math.Long.fromBits(this.low_ | other.low_, this.high_ | other.high_);
          };
          goog.math.Long.prototype.xor = function(other) {
            return goog.math.Long.fromBits(this.low_ ^ other.low_, this.high_ ^ other.high_);
          };
          goog.math.Long.prototype.shiftLeft = function(numBits) {
            numBits &= 63;
            if (numBits == 0) {
              return this;
            } else {
              var low = this.low_;
              if (numBits < 32) {
                var high = this.high_;
                return goog.math.Long.fromBits(low << numBits, high << numBits | low >>> 32 - numBits);
              } else {
                return goog.math.Long.fromBits(0, low << numBits - 32);
              }
            }
          };
          goog.math.Long.prototype.shiftRight = function(numBits) {
            numBits &= 63;
            if (numBits == 0) {
              return this;
            } else {
              var high = this.high_;
              if (numBits < 32) {
                var low = this.low_;
                return goog.math.Long.fromBits(low >>> numBits | high << 32 - numBits, high >> numBits);
              } else {
                return goog.math.Long.fromBits(high >> numBits - 32, high >= 0 ? 0 : -1);
              }
            }
          };
          goog.math.Long.prototype.shiftRightUnsigned = function(numBits) {
            numBits &= 63;
            if (numBits == 0) {
              return this;
            } else {
              var high = this.high_;
              if (numBits < 32) {
                var low = this.low_;
                return goog.math.Long.fromBits(low >>> numBits | high << 32 - numBits, high >>> numBits);
              } else if (numBits == 32) {
                return goog.math.Long.fromBits(high, 0);
              } else {
                return goog.math.Long.fromBits(high >>> numBits - 32, 0);
              }
            }
          };
          var navigator2 = { appName: "Modern Browser" };
          var dbits;
          var canary = 244837814094590;
          var j_lm = (canary & 16777215) == 15715070;
          function BigInteger(a, b, c) {
            if (a != null)
              if ("number" == typeof a)
                this.fromNumber(a, b, c);
              else if (b == null && "string" != typeof a)
                this.fromString(a, 256);
              else
                this.fromString(a, b);
          }
          function nbi() {
            return new BigInteger(null);
          }
          function am1(i2, x, w, j, c, n) {
            while (--n >= 0) {
              var v = x * this[i2++] + w[j] + c;
              c = Math.floor(v / 67108864);
              w[j++] = v & 67108863;
            }
            return c;
          }
          function am2(i2, x, w, j, c, n) {
            var xl = x & 32767, xh = x >> 15;
            while (--n >= 0) {
              var l = this[i2] & 32767;
              var h = this[i2++] >> 15;
              var m = xh * l + h * xl;
              l = xl * l + ((m & 32767) << 15) + w[j] + (c & 1073741823);
              c = (l >>> 30) + (m >>> 15) + xh * h + (c >>> 30);
              w[j++] = l & 1073741823;
            }
            return c;
          }
          function am3(i2, x, w, j, c, n) {
            var xl = x & 16383, xh = x >> 14;
            while (--n >= 0) {
              var l = this[i2] & 16383;
              var h = this[i2++] >> 14;
              var m = xh * l + h * xl;
              l = xl * l + ((m & 16383) << 14) + w[j] + c;
              c = (l >> 28) + (m >> 14) + xh * h;
              w[j++] = l & 268435455;
            }
            return c;
          }
          if (j_lm && navigator2.appName == "Microsoft Internet Explorer") {
            BigInteger.prototype.am = am2;
            dbits = 30;
          } else if (j_lm && navigator2.appName != "Netscape") {
            BigInteger.prototype.am = am1;
            dbits = 26;
          } else {
            BigInteger.prototype.am = am3;
            dbits = 28;
          }
          BigInteger.prototype.DB = dbits;
          BigInteger.prototype.DM = (1 << dbits) - 1;
          BigInteger.prototype.DV = 1 << dbits;
          var BI_FP = 52;
          BigInteger.prototype.FV = Math.pow(2, BI_FP);
          BigInteger.prototype.F1 = BI_FP - dbits;
          BigInteger.prototype.F2 = 2 * dbits - BI_FP;
          var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
          var BI_RC = new Array();
          var rr, vv;
          rr = "0".charCodeAt(0);
          for (vv = 0; vv <= 9; ++vv)
            BI_RC[rr++] = vv;
          rr = "a".charCodeAt(0);
          for (vv = 10; vv < 36; ++vv)
            BI_RC[rr++] = vv;
          rr = "A".charCodeAt(0);
          for (vv = 10; vv < 36; ++vv)
            BI_RC[rr++] = vv;
          function int2char(n) {
            return BI_RM.charAt(n);
          }
          function intAt(s, i2) {
            var c = BI_RC[s.charCodeAt(i2)];
            return c == null ? -1 : c;
          }
          function bnpCopyTo(r) {
            for (var i2 = this.t - 1; i2 >= 0; --i2)
              r[i2] = this[i2];
            r.t = this.t;
            r.s = this.s;
          }
          function bnpFromInt(x) {
            this.t = 1;
            this.s = x < 0 ? -1 : 0;
            if (x > 0)
              this[0] = x;
            else if (x < -1)
              this[0] = x + DV;
            else
              this.t = 0;
          }
          function nbv(i2) {
            var r = nbi();
            r.fromInt(i2);
            return r;
          }
          function bnpFromString(s, b) {
            var k;
            if (b == 16)
              k = 4;
            else if (b == 8)
              k = 3;
            else if (b == 256)
              k = 8;
            else if (b == 2)
              k = 1;
            else if (b == 32)
              k = 5;
            else if (b == 4)
              k = 2;
            else {
              this.fromRadix(s, b);
              return;
            }
            this.t = 0;
            this.s = 0;
            var i2 = s.length, mi = false, sh = 0;
            while (--i2 >= 0) {
              var x = k == 8 ? s[i2] & 255 : intAt(s, i2);
              if (x < 0) {
                if (s.charAt(i2) == "-")
                  mi = true;
                continue;
              }
              mi = false;
              if (sh == 0)
                this[this.t++] = x;
              else if (sh + k > this.DB) {
                this[this.t - 1] |= (x & (1 << this.DB - sh) - 1) << sh;
                this[this.t++] = x >> this.DB - sh;
              } else
                this[this.t - 1] |= x << sh;
              sh += k;
              if (sh >= this.DB)
                sh -= this.DB;
            }
            if (k == 8 && (s[0] & 128) != 0) {
              this.s = -1;
              if (sh > 0)
                this[this.t - 1] |= (1 << this.DB - sh) - 1 << sh;
            }
            this.clamp();
            if (mi)
              BigInteger.ZERO.subTo(this, this);
          }
          function bnpClamp() {
            var c = this.s & this.DM;
            while (this.t > 0 && this[this.t - 1] == c)
              --this.t;
          }
          function bnToString(b) {
            if (this.s < 0)
              return "-" + this.negate().toString(b);
            var k;
            if (b == 16)
              k = 4;
            else if (b == 8)
              k = 3;
            else if (b == 2)
              k = 1;
            else if (b == 32)
              k = 5;
            else if (b == 4)
              k = 2;
            else
              return this.toRadix(b);
            var km = (1 << k) - 1, d, m = false, r = "", i2 = this.t;
            var p = this.DB - i2 * this.DB % k;
            if (i2-- > 0) {
              if (p < this.DB && (d = this[i2] >> p) > 0) {
                m = true;
                r = int2char(d);
              }
              while (i2 >= 0) {
                if (p < k) {
                  d = (this[i2] & (1 << p) - 1) << k - p;
                  d |= this[--i2] >> (p += this.DB - k);
                } else {
                  d = this[i2] >> (p -= k) & km;
                  if (p <= 0) {
                    p += this.DB;
                    --i2;
                  }
                }
                if (d > 0)
                  m = true;
                if (m)
                  r += int2char(d);
              }
            }
            return m ? r : "0";
          }
          function bnNegate() {
            var r = nbi();
            BigInteger.ZERO.subTo(this, r);
            return r;
          }
          function bnAbs() {
            return this.s < 0 ? this.negate() : this;
          }
          function bnCompareTo(a) {
            var r = this.s - a.s;
            if (r != 0)
              return r;
            var i2 = this.t;
            r = i2 - a.t;
            if (r != 0)
              return this.s < 0 ? -r : r;
            while (--i2 >= 0)
              if ((r = this[i2] - a[i2]) != 0)
                return r;
            return 0;
          }
          function nbits(x) {
            var r = 1, t;
            if ((t = x >>> 16) != 0) {
              x = t;
              r += 16;
            }
            if ((t = x >> 8) != 0) {
              x = t;
              r += 8;
            }
            if ((t = x >> 4) != 0) {
              x = t;
              r += 4;
            }
            if ((t = x >> 2) != 0) {
              x = t;
              r += 2;
            }
            if ((t = x >> 1) != 0) {
              x = t;
              r += 1;
            }
            return r;
          }
          function bnBitLength() {
            if (this.t <= 0)
              return 0;
            return this.DB * (this.t - 1) + nbits(this[this.t - 1] ^ this.s & this.DM);
          }
          function bnpDLShiftTo(n, r) {
            var i2;
            for (i2 = this.t - 1; i2 >= 0; --i2)
              r[i2 + n] = this[i2];
            for (i2 = n - 1; i2 >= 0; --i2)
              r[i2] = 0;
            r.t = this.t + n;
            r.s = this.s;
          }
          function bnpDRShiftTo(n, r) {
            for (var i2 = n; i2 < this.t; ++i2)
              r[i2 - n] = this[i2];
            r.t = Math.max(this.t - n, 0);
            r.s = this.s;
          }
          function bnpLShiftTo(n, r) {
            var bs = n % this.DB;
            var cbs = this.DB - bs;
            var bm = (1 << cbs) - 1;
            var ds = Math.floor(n / this.DB), c = this.s << bs & this.DM, i2;
            for (i2 = this.t - 1; i2 >= 0; --i2) {
              r[i2 + ds + 1] = this[i2] >> cbs | c;
              c = (this[i2] & bm) << bs;
            }
            for (i2 = ds - 1; i2 >= 0; --i2)
              r[i2] = 0;
            r[ds] = c;
            r.t = this.t + ds + 1;
            r.s = this.s;
            r.clamp();
          }
          function bnpRShiftTo(n, r) {
            r.s = this.s;
            var ds = Math.floor(n / this.DB);
            if (ds >= this.t) {
              r.t = 0;
              return;
            }
            var bs = n % this.DB;
            var cbs = this.DB - bs;
            var bm = (1 << bs) - 1;
            r[0] = this[ds] >> bs;
            for (var i2 = ds + 1; i2 < this.t; ++i2) {
              r[i2 - ds - 1] |= (this[i2] & bm) << cbs;
              r[i2 - ds] = this[i2] >> bs;
            }
            if (bs > 0)
              r[this.t - ds - 1] |= (this.s & bm) << cbs;
            r.t = this.t - ds;
            r.clamp();
          }
          function bnpSubTo(a, r) {
            var i2 = 0, c = 0, m = Math.min(a.t, this.t);
            while (i2 < m) {
              c += this[i2] - a[i2];
              r[i2++] = c & this.DM;
              c >>= this.DB;
            }
            if (a.t < this.t) {
              c -= a.s;
              while (i2 < this.t) {
                c += this[i2];
                r[i2++] = c & this.DM;
                c >>= this.DB;
              }
              c += this.s;
            } else {
              c += this.s;
              while (i2 < a.t) {
                c -= a[i2];
                r[i2++] = c & this.DM;
                c >>= this.DB;
              }
              c -= a.s;
            }
            r.s = c < 0 ? -1 : 0;
            if (c < -1)
              r[i2++] = this.DV + c;
            else if (c > 0)
              r[i2++] = c;
            r.t = i2;
            r.clamp();
          }
          function bnpMultiplyTo(a, r) {
            var x = this.abs(), y = a.abs();
            var i2 = x.t;
            r.t = i2 + y.t;
            while (--i2 >= 0)
              r[i2] = 0;
            for (i2 = 0; i2 < y.t; ++i2)
              r[i2 + x.t] = x.am(0, y[i2], r, i2, 0, x.t);
            r.s = 0;
            r.clamp();
            if (this.s != a.s)
              BigInteger.ZERO.subTo(r, r);
          }
          function bnpSquareTo(r) {
            var x = this.abs();
            var i2 = r.t = 2 * x.t;
            while (--i2 >= 0)
              r[i2] = 0;
            for (i2 = 0; i2 < x.t - 1; ++i2) {
              var c = x.am(i2, x[i2], r, 2 * i2, 0, 1);
              if ((r[i2 + x.t] += x.am(i2 + 1, 2 * x[i2], r, 2 * i2 + 1, c, x.t - i2 - 1)) >= x.DV) {
                r[i2 + x.t] -= x.DV;
                r[i2 + x.t + 1] = 1;
              }
            }
            if (r.t > 0)
              r[r.t - 1] += x.am(i2, x[i2], r, 2 * i2, 0, 1);
            r.s = 0;
            r.clamp();
          }
          function bnpDivRemTo(m, q, r) {
            var pm = m.abs();
            if (pm.t <= 0)
              return;
            var pt = this.abs();
            if (pt.t < pm.t) {
              if (q != null)
                q.fromInt(0);
              if (r != null)
                this.copyTo(r);
              return;
            }
            if (r == null)
              r = nbi();
            var y = nbi(), ts = this.s, ms = m.s;
            var nsh = this.DB - nbits(pm[pm.t - 1]);
            if (nsh > 0) {
              pm.lShiftTo(nsh, y);
              pt.lShiftTo(nsh, r);
            } else {
              pm.copyTo(y);
              pt.copyTo(r);
            }
            var ys = y.t;
            var y0 = y[ys - 1];
            if (y0 == 0)
              return;
            var yt = y0 * (1 << this.F1) + (ys > 1 ? y[ys - 2] >> this.F2 : 0);
            var d1 = this.FV / yt, d2 = (1 << this.F1) / yt, e = 1 << this.F2;
            var i2 = r.t, j = i2 - ys, t = q == null ? nbi() : q;
            y.dlShiftTo(j, t);
            if (r.compareTo(t) >= 0) {
              r[r.t++] = 1;
              r.subTo(t, r);
            }
            BigInteger.ONE.dlShiftTo(ys, t);
            t.subTo(y, y);
            while (y.t < ys)
              y[y.t++] = 0;
            while (--j >= 0) {
              var qd = r[--i2] == y0 ? this.DM : Math.floor(r[i2] * d1 + (r[i2 - 1] + e) * d2);
              if ((r[i2] += y.am(0, qd, r, j, 0, ys)) < qd) {
                y.dlShiftTo(j, t);
                r.subTo(t, r);
                while (r[i2] < --qd)
                  r.subTo(t, r);
              }
            }
            if (q != null) {
              r.drShiftTo(ys, q);
              if (ts != ms)
                BigInteger.ZERO.subTo(q, q);
            }
            r.t = ys;
            r.clamp();
            if (nsh > 0)
              r.rShiftTo(nsh, r);
            if (ts < 0)
              BigInteger.ZERO.subTo(r, r);
          }
          function bnMod(a) {
            var r = nbi();
            this.abs().divRemTo(a, null, r);
            if (this.s < 0 && r.compareTo(BigInteger.ZERO) > 0)
              a.subTo(r, r);
            return r;
          }
          function Classic(m) {
            this.m = m;
          }
          function cConvert(x) {
            if (x.s < 0 || x.compareTo(this.m) >= 0)
              return x.mod(this.m);
            else
              return x;
          }
          function cRevert(x) {
            return x;
          }
          function cReduce(x) {
            x.divRemTo(this.m, null, x);
          }
          function cMulTo(x, y, r) {
            x.multiplyTo(y, r);
            this.reduce(r);
          }
          function cSqrTo(x, r) {
            x.squareTo(r);
            this.reduce(r);
          }
          Classic.prototype.convert = cConvert;
          Classic.prototype.revert = cRevert;
          Classic.prototype.reduce = cReduce;
          Classic.prototype.mulTo = cMulTo;
          Classic.prototype.sqrTo = cSqrTo;
          function bnpInvDigit() {
            if (this.t < 1)
              return 0;
            var x = this[0];
            if ((x & 1) == 0)
              return 0;
            var y = x & 3;
            y = y * (2 - (x & 15) * y) & 15;
            y = y * (2 - (x & 255) * y) & 255;
            y = y * (2 - ((x & 65535) * y & 65535)) & 65535;
            y = y * (2 - x * y % this.DV) % this.DV;
            return y > 0 ? this.DV - y : -y;
          }
          function Montgomery(m) {
            this.m = m;
            this.mp = m.invDigit();
            this.mpl = this.mp & 32767;
            this.mph = this.mp >> 15;
            this.um = (1 << m.DB - 15) - 1;
            this.mt2 = 2 * m.t;
          }
          function montConvert(x) {
            var r = nbi();
            x.abs().dlShiftTo(this.m.t, r);
            r.divRemTo(this.m, null, r);
            if (x.s < 0 && r.compareTo(BigInteger.ZERO) > 0)
              this.m.subTo(r, r);
            return r;
          }
          function montRevert(x) {
            var r = nbi();
            x.copyTo(r);
            this.reduce(r);
            return r;
          }
          function montReduce(x) {
            while (x.t <= this.mt2)
              x[x.t++] = 0;
            for (var i2 = 0; i2 < this.m.t; ++i2) {
              var j = x[i2] & 32767;
              var u0 = j * this.mpl + ((j * this.mph + (x[i2] >> 15) * this.mpl & this.um) << 15) & x.DM;
              j = i2 + this.m.t;
              x[j] += this.m.am(0, u0, x, i2, 0, this.m.t);
              while (x[j] >= x.DV) {
                x[j] -= x.DV;
                x[++j]++;
              }
            }
            x.clamp();
            x.drShiftTo(this.m.t, x);
            if (x.compareTo(this.m) >= 0)
              x.subTo(this.m, x);
          }
          function montSqrTo(x, r) {
            x.squareTo(r);
            this.reduce(r);
          }
          function montMulTo(x, y, r) {
            x.multiplyTo(y, r);
            this.reduce(r);
          }
          Montgomery.prototype.convert = montConvert;
          Montgomery.prototype.revert = montRevert;
          Montgomery.prototype.reduce = montReduce;
          Montgomery.prototype.mulTo = montMulTo;
          Montgomery.prototype.sqrTo = montSqrTo;
          function bnpIsEven() {
            return (this.t > 0 ? this[0] & 1 : this.s) == 0;
          }
          function bnpExp(e, z) {
            if (e > 4294967295 || e < 1)
              return BigInteger.ONE;
            var r = nbi(), r2 = nbi(), g = z.convert(this), i2 = nbits(e) - 1;
            g.copyTo(r);
            while (--i2 >= 0) {
              z.sqrTo(r, r2);
              if ((e & 1 << i2) > 0)
                z.mulTo(r2, g, r);
              else {
                var t = r;
                r = r2;
                r2 = t;
              }
            }
            return z.revert(r);
          }
          function bnModPowInt(e, m) {
            var z;
            if (e < 256 || m.isEven())
              z = new Classic(m);
            else
              z = new Montgomery(m);
            return this.exp(e, z);
          }
          BigInteger.prototype.copyTo = bnpCopyTo;
          BigInteger.prototype.fromInt = bnpFromInt;
          BigInteger.prototype.fromString = bnpFromString;
          BigInteger.prototype.clamp = bnpClamp;
          BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
          BigInteger.prototype.drShiftTo = bnpDRShiftTo;
          BigInteger.prototype.lShiftTo = bnpLShiftTo;
          BigInteger.prototype.rShiftTo = bnpRShiftTo;
          BigInteger.prototype.subTo = bnpSubTo;
          BigInteger.prototype.multiplyTo = bnpMultiplyTo;
          BigInteger.prototype.squareTo = bnpSquareTo;
          BigInteger.prototype.divRemTo = bnpDivRemTo;
          BigInteger.prototype.invDigit = bnpInvDigit;
          BigInteger.prototype.isEven = bnpIsEven;
          BigInteger.prototype.exp = bnpExp;
          BigInteger.prototype.toString = bnToString;
          BigInteger.prototype.negate = bnNegate;
          BigInteger.prototype.abs = bnAbs;
          BigInteger.prototype.compareTo = bnCompareTo;
          BigInteger.prototype.bitLength = bnBitLength;
          BigInteger.prototype.mod = bnMod;
          BigInteger.prototype.modPowInt = bnModPowInt;
          BigInteger.ZERO = nbv(0);
          BigInteger.ONE = nbv(1);
          function bnpFromRadix(s, b) {
            this.fromInt(0);
            if (b == null)
              b = 10;
            var cs = this.chunkSize(b);
            var d = Math.pow(b, cs), mi = false, j = 0, w = 0;
            for (var i2 = 0; i2 < s.length; ++i2) {
              var x = intAt(s, i2);
              if (x < 0) {
                if (s.charAt(i2) == "-" && this.signum() == 0)
                  mi = true;
                continue;
              }
              w = b * w + x;
              if (++j >= cs) {
                this.dMultiply(d);
                this.dAddOffset(w, 0);
                j = 0;
                w = 0;
              }
            }
            if (j > 0) {
              this.dMultiply(Math.pow(b, j));
              this.dAddOffset(w, 0);
            }
            if (mi)
              BigInteger.ZERO.subTo(this, this);
          }
          function bnpChunkSize(r) {
            return Math.floor(Math.LN2 * this.DB / Math.log(r));
          }
          function bnSigNum() {
            if (this.s < 0)
              return -1;
            else if (this.t <= 0 || this.t == 1 && this[0] <= 0)
              return 0;
            else
              return 1;
          }
          function bnpDMultiply(n) {
            this[this.t] = this.am(0, n - 1, this, 0, 0, this.t);
            ++this.t;
            this.clamp();
          }
          function bnpDAddOffset(n, w) {
            if (n == 0)
              return;
            while (this.t <= w)
              this[this.t++] = 0;
            this[w] += n;
            while (this[w] >= this.DV) {
              this[w] -= this.DV;
              if (++w >= this.t)
                this[this.t++] = 0;
              ++this[w];
            }
          }
          function bnpToRadix(b) {
            if (b == null)
              b = 10;
            if (this.signum() == 0 || b < 2 || b > 36)
              return "0";
            var cs = this.chunkSize(b);
            var a = Math.pow(b, cs);
            var d = nbv(a), y = nbi(), z = nbi(), r = "";
            this.divRemTo(d, y, z);
            while (y.signum() > 0) {
              r = (a + z.intValue()).toString(b).substr(1) + r;
              y.divRemTo(d, y, z);
            }
            return z.intValue().toString(b) + r;
          }
          function bnIntValue() {
            if (this.s < 0) {
              if (this.t == 1)
                return this[0] - this.DV;
              else if (this.t == 0)
                return -1;
            } else if (this.t == 1)
              return this[0];
            else if (this.t == 0)
              return 0;
            return (this[1] & (1 << 32 - this.DB) - 1) << this.DB | this[0];
          }
          function bnpAddTo(a, r) {
            var i2 = 0, c = 0, m = Math.min(a.t, this.t);
            while (i2 < m) {
              c += this[i2] + a[i2];
              r[i2++] = c & this.DM;
              c >>= this.DB;
            }
            if (a.t < this.t) {
              c += a.s;
              while (i2 < this.t) {
                c += this[i2];
                r[i2++] = c & this.DM;
                c >>= this.DB;
              }
              c += this.s;
            } else {
              c += this.s;
              while (i2 < a.t) {
                c += a[i2];
                r[i2++] = c & this.DM;
                c >>= this.DB;
              }
              c += a.s;
            }
            r.s = c < 0 ? -1 : 0;
            if (c > 0)
              r[i2++] = c;
            else if (c < -1)
              r[i2++] = this.DV + c;
            r.t = i2;
            r.clamp();
          }
          BigInteger.prototype.fromRadix = bnpFromRadix;
          BigInteger.prototype.chunkSize = bnpChunkSize;
          BigInteger.prototype.signum = bnSigNum;
          BigInteger.prototype.dMultiply = bnpDMultiply;
          BigInteger.prototype.dAddOffset = bnpDAddOffset;
          BigInteger.prototype.toRadix = bnpToRadix;
          BigInteger.prototype.intValue = bnIntValue;
          BigInteger.prototype.addTo = bnpAddTo;
          var Wrapper = { abs: function(l, h) {
            var x = new goog.math.Long(l, h);
            var ret;
            if (x.isNegative()) {
              ret = x.negate();
            } else {
              ret = x;
            }
            HEAP32[tempDoublePtr >> 2] = ret.low_;
            HEAP32[tempDoublePtr + 4 >> 2] = ret.high_;
          }, ensureTemps: function() {
            if (Wrapper.ensuredTemps)
              return;
            Wrapper.ensuredTemps = true;
            Wrapper.two32 = new BigInteger();
            Wrapper.two32.fromString("4294967296", 10);
            Wrapper.two64 = new BigInteger();
            Wrapper.two64.fromString("18446744073709551616", 10);
            Wrapper.temp1 = new BigInteger();
            Wrapper.temp2 = new BigInteger();
          }, lh2bignum: function(l, h) {
            var a = new BigInteger();
            a.fromString(h.toString(), 10);
            var b = new BigInteger();
            a.multiplyTo(Wrapper.two32, b);
            var c = new BigInteger();
            c.fromString(l.toString(), 10);
            var d = new BigInteger();
            c.addTo(b, d);
            return d;
          }, stringify: function(l, h, unsigned) {
            var ret = new goog.math.Long(l, h).toString();
            if (unsigned && ret[0] == "-") {
              Wrapper.ensureTemps();
              var bignum = new BigInteger();
              bignum.fromString(ret, 10);
              ret = new BigInteger();
              Wrapper.two64.addTo(bignum, ret);
              ret = ret.toString(10);
            }
            return ret;
          }, fromString: function(str, base, min2, max2, unsigned) {
            Wrapper.ensureTemps();
            var bignum = new BigInteger();
            bignum.fromString(str, base);
            var bigmin = new BigInteger();
            bigmin.fromString(min2, 10);
            var bigmax = new BigInteger();
            bigmax.fromString(max2, 10);
            if (unsigned && bignum.compareTo(BigInteger.ZERO) < 0) {
              var temp = new BigInteger();
              bignum.addTo(Wrapper.two64, temp);
              bignum = temp;
            }
            var error = false;
            if (bignum.compareTo(bigmin) < 0) {
              bignum = bigmin;
              error = true;
            } else if (bignum.compareTo(bigmax) > 0) {
              bignum = bigmax;
              error = true;
            }
            var ret = goog.math.Long.fromString(bignum.toString());
            HEAP32[tempDoublePtr >> 2] = ret.low_;
            HEAP32[tempDoublePtr + 4 >> 2] = ret.high_;
            if (error)
              throw "range error";
          } };
          return Wrapper;
        }();
        if (memoryInitializer) {
          if (typeof Module["locateFile"] === "function") {
            memoryInitializer = Module["locateFile"](memoryInitializer);
          } else if (Module["memoryInitializerPrefixURL"]) {
            memoryInitializer = Module["memoryInitializerPrefixURL"] + memoryInitializer;
          }
          if (ENVIRONMENT_IS_NODE || ENVIRONMENT_IS_SHELL) {
            var data = Module["readBinary"](memoryInitializer);
            HEAPU8.set(data, STATIC_BASE);
          } else {
            addRunDependency("memory initializer");
            Browser.asyncLoad(memoryInitializer, function(data2) {
              HEAPU8.set(data2, STATIC_BASE);
              removeRunDependency("memory initializer");
            }, function(data2) {
              throw "could not load memory initializer " + memoryInitializer;
            });
          }
        }
        function ExitStatus(status) {
          this.name = "ExitStatus";
          this.message = "Program terminated with exit(" + status + ")";
          this.status = status;
        }
        ExitStatus.prototype = new Error();
        ExitStatus.prototype.constructor = ExitStatus;
        var initialStackTop;
        var preloadStartTime = null;
        var calledMain = false;
        dependenciesFulfilled = function runCaller() {
          if (!Module["calledRun"] && shouldRunNow)
            run();
          if (!Module["calledRun"])
            dependenciesFulfilled = runCaller;
        };
        Module["callMain"] = Module.callMain = function callMain(args2) {
          assert(runDependencies == 0, "cannot call main when async dependencies remain! (listen on __ATMAIN__)");
          assert(__ATPRERUN__.length == 0, "cannot call main when preRun functions remain to be called");
          args2 = args2 || [];
          ensureInitRuntime();
          var argc = args2.length + 1;
          function pad() {
            for (var i3 = 0; i3 < 4 - 1; i3++) {
              argv.push(0);
            }
          }
          var argv = [allocate(intArrayFromString(Module["thisProgram"]), "i8", ALLOC_NORMAL)];
          pad();
          for (var i2 = 0; i2 < argc - 1; i2 = i2 + 1) {
            argv.push(allocate(intArrayFromString(args2[i2]), "i8", ALLOC_NORMAL));
            pad();
          }
          argv.push(0);
          argv = allocate(argv, "i32", ALLOC_NORMAL);
          initialStackTop = STACKTOP;
          try {
            var ret = Module["_main"](argc, argv, 0);
            exit(ret);
          } catch (e) {
            if (e instanceof ExitStatus) {
              return;
            } else if (e == "SimulateInfiniteLoop") {
              Module["noExitRuntime"] = true;
              return;
            } else {
              if (e && typeof e === "object" && e.stack)
                Module.printErr("exception thrown: " + [e, e.stack]);
              throw e;
            }
          } finally {
            calledMain = true;
          }
        };
        function run(args2) {
          args2 = args2 || Module["arguments"];
          if (preloadStartTime === null)
            preloadStartTime = Date.now();
          if (runDependencies > 0) {
            return;
          }
          preRun();
          if (runDependencies > 0)
            return;
          if (Module["calledRun"])
            return;
          function doRun() {
            if (Module["calledRun"])
              return;
            Module["calledRun"] = true;
            if (ABORT)
              return;
            ensureInitRuntime();
            preMain();
            if (ENVIRONMENT_IS_WEB && preloadStartTime !== null) {
              Module.printErr("pre-main prep time: " + (Date.now() - preloadStartTime) + " ms");
            }
            if (Module["_main"] && shouldRunNow) {
              Module["callMain"](args2);
            }
            postRun();
          }
          if (Module["setStatus"]) {
            Module["setStatus"]("Running...");
            setTimeout(function() {
              setTimeout(function() {
                Module["setStatus"]("");
              }, 1);
              doRun();
            }, 1);
          } else {
            doRun();
          }
        }
        Module["run"] = Module.run = run;
        function exit(status) {
          if (Module["noExitRuntime"]) {
            return;
          }
          ABORT = true;
          EXITSTATUS = status;
          STACKTOP = initialStackTop;
          exitRuntime();
          if (ENVIRONMENT_IS_NODE) {
            process["stdout"]["once"]("drain", function() {
              process["exit"](status);
            });
            console.log(" ");
            setTimeout(function() {
              process["exit"](status);
            }, 500);
          } else if (ENVIRONMENT_IS_SHELL && typeof quit === "function") {
            quit(status);
          }
          throw new ExitStatus(status);
        }
        Module["exit"] = Module.exit = exit;
        function abort(text) {
          if (text) {
            Module.print(text);
            Module.printErr(text);
          }
          ABORT = true;
          EXITSTATUS = 1;
          var extra = "\nIf this abort() is unexpected, build with -s ASSERTIONS=1 which can give more information.";
          throw "abort() at " + stackTrace() + extra;
        }
        Module["abort"] = Module.abort = abort;
        if (Module["preInit"]) {
          if (typeof Module["preInit"] == "function")
            Module["preInit"] = [Module["preInit"]];
          while (Module["preInit"].length > 0) {
            Module["preInit"].pop()();
          }
        }
        var shouldRunNow = true;
        if (Module["noInitialRun"]) {
          shouldRunNow = false;
        }
        run();
        var origMalloc = Module._malloc;
        var origFree = Module._free;
        var MEMSTATS = { totalMemory: Module.HEAPU8.length, heapUsed: 0 };
        var MEMSTATS_DATA = { pointerToSizeMap: {}, getSizeOfPointer: function(ptr) {
          return MEMSTATS_DATA.pointerToSizeMap[ptr];
        } };
        Module.MEMSTATS = MEMSTATS;
        Module.MEMSTATS_DATA = MEMSTATS_DATA;
        var hookedMalloc = function(size2) {
          var ptr = origMalloc(size2);
          if (!ptr) {
            return 0;
          }
          MEMSTATS.heapUsed += size2;
          MEMSTATS_DATA.pointerToSizeMap[ptr] = size2;
          return ptr;
        };
        var hookedFree = function(ptr) {
          if (ptr) {
            MEMSTATS.heapUsed -= MEMSTATS_DATA.getSizeOfPointer(ptr) || 0;
            delete MEMSTATS_DATA.pointerToSizeMap[ptr];
          }
          return origFree(ptr);
        };
        Module._malloc = hookedMalloc;
        Module._free = hookedFree;
        _malloc = hookedMalloc;
        _free = hookedFree;
        var setInnerMalloc, setInnerFree;
        if (setInnerMalloc) {
          setInnerMalloc(hookedMalloc);
          setInnerFree(hookedFree);
        }
        return module.exports;
      };
      if (typeof module !== "undefined") {
        module.exports = C_MINISAT;
      }
    }
  });

  // node_modules/underscore/modules/_setup.js
  var VERSION, root, ArrayProto, ObjProto, SymbolProto, push, slice, toString, hasOwnProperty, supportsArrayBuffer, supportsDataView, nativeIsArray, nativeKeys, nativeCreate, nativeIsView, _isNaN, _isFinite, hasEnumBug, nonEnumerableProps, MAX_ARRAY_INDEX;
  var init_setup = __esm({
    "node_modules/underscore/modules/_setup.js"() {
      VERSION = "1.13.8";
      root = typeof self == "object" && self.self === self && self || typeof global == "object" && global.global === global && global || Function("return this")() || {};
      ArrayProto = Array.prototype;
      ObjProto = Object.prototype;
      SymbolProto = typeof Symbol !== "undefined" ? Symbol.prototype : null;
      push = ArrayProto.push;
      slice = ArrayProto.slice;
      toString = ObjProto.toString;
      hasOwnProperty = ObjProto.hasOwnProperty;
      supportsArrayBuffer = typeof ArrayBuffer !== "undefined";
      supportsDataView = typeof DataView !== "undefined";
      nativeIsArray = Array.isArray;
      nativeKeys = Object.keys;
      nativeCreate = Object.create;
      nativeIsView = supportsArrayBuffer && ArrayBuffer.isView;
      _isNaN = isNaN;
      _isFinite = isFinite;
      hasEnumBug = !{ toString: null }.propertyIsEnumerable("toString");
      nonEnumerableProps = [
        "valueOf",
        "isPrototypeOf",
        "toString",
        "propertyIsEnumerable",
        "hasOwnProperty",
        "toLocaleString"
      ];
      MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
    }
  });

  // node_modules/underscore/modules/restArguments.js
  function restArguments(func2, startIndex) {
    startIndex = startIndex == null ? func2.length - 1 : +startIndex;
    return function() {
      var length = Math.max(arguments.length - startIndex, 0), rest2 = Array(length), index = 0;
      for (; index < length; index++) {
        rest2[index] = arguments[index + startIndex];
      }
      switch (startIndex) {
        case 0:
          return func2.call(this, rest2);
        case 1:
          return func2.call(this, arguments[0], rest2);
        case 2:
          return func2.call(this, arguments[0], arguments[1], rest2);
      }
      var args2 = Array(startIndex + 1);
      for (index = 0; index < startIndex; index++) {
        args2[index] = arguments[index];
      }
      args2[startIndex] = rest2;
      return func2.apply(this, args2);
    };
  }
  var init_restArguments = __esm({
    "node_modules/underscore/modules/restArguments.js"() {
    }
  });

  // node_modules/underscore/modules/isObject.js
  function isObject(obj) {
    var type2 = typeof obj;
    return type2 === "function" || type2 === "object" && !!obj;
  }
  var init_isObject = __esm({
    "node_modules/underscore/modules/isObject.js"() {
    }
  });

  // node_modules/underscore/modules/isNull.js
  function isNull(obj) {
    return obj === null;
  }
  var init_isNull = __esm({
    "node_modules/underscore/modules/isNull.js"() {
    }
  });

  // node_modules/underscore/modules/isUndefined.js
  function isUndefined(obj) {
    return obj === void 0;
  }
  var init_isUndefined = __esm({
    "node_modules/underscore/modules/isUndefined.js"() {
    }
  });

  // node_modules/underscore/modules/isBoolean.js
  function isBoolean(obj) {
    return obj === true || obj === false || toString.call(obj) === "[object Boolean]";
  }
  var init_isBoolean = __esm({
    "node_modules/underscore/modules/isBoolean.js"() {
      init_setup();
    }
  });

  // node_modules/underscore/modules/isElement.js
  function isElement(obj) {
    return !!(obj && obj.nodeType === 1);
  }
  var init_isElement = __esm({
    "node_modules/underscore/modules/isElement.js"() {
    }
  });

  // node_modules/underscore/modules/_tagTester.js
  function tagTester(name) {
    var tag = "[object " + name + "]";
    return function(obj) {
      return toString.call(obj) === tag;
    };
  }
  var init_tagTester = __esm({
    "node_modules/underscore/modules/_tagTester.js"() {
      init_setup();
    }
  });

  // node_modules/underscore/modules/isString.js
  var isString_default;
  var init_isString = __esm({
    "node_modules/underscore/modules/isString.js"() {
      init_tagTester();
      isString_default = tagTester("String");
    }
  });

  // node_modules/underscore/modules/isNumber.js
  var isNumber_default;
  var init_isNumber = __esm({
    "node_modules/underscore/modules/isNumber.js"() {
      init_tagTester();
      isNumber_default = tagTester("Number");
    }
  });

  // node_modules/underscore/modules/isDate.js
  var isDate_default;
  var init_isDate = __esm({
    "node_modules/underscore/modules/isDate.js"() {
      init_tagTester();
      isDate_default = tagTester("Date");
    }
  });

  // node_modules/underscore/modules/isRegExp.js
  var isRegExp_default;
  var init_isRegExp = __esm({
    "node_modules/underscore/modules/isRegExp.js"() {
      init_tagTester();
      isRegExp_default = tagTester("RegExp");
    }
  });

  // node_modules/underscore/modules/isError.js
  var isError_default;
  var init_isError = __esm({
    "node_modules/underscore/modules/isError.js"() {
      init_tagTester();
      isError_default = tagTester("Error");
    }
  });

  // node_modules/underscore/modules/isSymbol.js
  var isSymbol_default;
  var init_isSymbol = __esm({
    "node_modules/underscore/modules/isSymbol.js"() {
      init_tagTester();
      isSymbol_default = tagTester("Symbol");
    }
  });

  // node_modules/underscore/modules/isArrayBuffer.js
  var isArrayBuffer_default;
  var init_isArrayBuffer = __esm({
    "node_modules/underscore/modules/isArrayBuffer.js"() {
      init_tagTester();
      isArrayBuffer_default = tagTester("ArrayBuffer");
    }
  });

  // node_modules/underscore/modules/isFunction.js
  var isFunction, nodelist, isFunction_default;
  var init_isFunction = __esm({
    "node_modules/underscore/modules/isFunction.js"() {
      init_tagTester();
      init_setup();
      isFunction = tagTester("Function");
      nodelist = root.document && root.document.childNodes;
      if (typeof /./ != "function" && typeof Int8Array != "object" && typeof nodelist != "function") {
        isFunction = function(obj) {
          return typeof obj == "function" || false;
        };
      }
      isFunction_default = isFunction;
    }
  });

  // node_modules/underscore/modules/_hasObjectTag.js
  var hasObjectTag_default;
  var init_hasObjectTag = __esm({
    "node_modules/underscore/modules/_hasObjectTag.js"() {
      init_tagTester();
      hasObjectTag_default = tagTester("Object");
    }
  });

  // node_modules/underscore/modules/_stringTagBug.js
  var hasDataViewBug, isIE11;
  var init_stringTagBug = __esm({
    "node_modules/underscore/modules/_stringTagBug.js"() {
      init_setup();
      init_hasObjectTag();
      hasDataViewBug = supportsDataView && (!/\[native code\]/.test(String(DataView)) || hasObjectTag_default(new DataView(new ArrayBuffer(8))));
      isIE11 = typeof Map !== "undefined" && hasObjectTag_default(/* @__PURE__ */ new Map());
    }
  });

  // node_modules/underscore/modules/isDataView.js
  function alternateIsDataView(obj) {
    return obj != null && isFunction_default(obj.getInt8) && isArrayBuffer_default(obj.buffer);
  }
  var isDataView, isDataView_default;
  var init_isDataView = __esm({
    "node_modules/underscore/modules/isDataView.js"() {
      init_tagTester();
      init_isFunction();
      init_isArrayBuffer();
      init_stringTagBug();
      isDataView = tagTester("DataView");
      isDataView_default = hasDataViewBug ? alternateIsDataView : isDataView;
    }
  });

  // node_modules/underscore/modules/isArray.js
  var isArray_default;
  var init_isArray = __esm({
    "node_modules/underscore/modules/isArray.js"() {
      init_setup();
      init_tagTester();
      isArray_default = nativeIsArray || tagTester("Array");
    }
  });

  // node_modules/underscore/modules/_has.js
  function has(obj, key2) {
    return obj != null && hasOwnProperty.call(obj, key2);
  }
  var init_has = __esm({
    "node_modules/underscore/modules/_has.js"() {
      init_setup();
    }
  });

  // node_modules/underscore/modules/isArguments.js
  var isArguments, isArguments_default;
  var init_isArguments = __esm({
    "node_modules/underscore/modules/isArguments.js"() {
      init_tagTester();
      init_has();
      isArguments = tagTester("Arguments");
      (function() {
        if (!isArguments(arguments)) {
          isArguments = function(obj) {
            return has(obj, "callee");
          };
        }
      })();
      isArguments_default = isArguments;
    }
  });

  // node_modules/underscore/modules/isFinite.js
  function isFinite2(obj) {
    return !isSymbol_default(obj) && _isFinite(obj) && !isNaN(parseFloat(obj));
  }
  var init_isFinite = __esm({
    "node_modules/underscore/modules/isFinite.js"() {
      init_setup();
      init_isSymbol();
    }
  });

  // node_modules/underscore/modules/isNaN.js
  function isNaN2(obj) {
    return isNumber_default(obj) && _isNaN(obj);
  }
  var init_isNaN = __esm({
    "node_modules/underscore/modules/isNaN.js"() {
      init_setup();
      init_isNumber();
    }
  });

  // node_modules/underscore/modules/constant.js
  function constant(value) {
    return function() {
      return value;
    };
  }
  var init_constant = __esm({
    "node_modules/underscore/modules/constant.js"() {
    }
  });

  // node_modules/underscore/modules/_createSizePropertyCheck.js
  function createSizePropertyCheck(getSizeProperty) {
    return function(collection) {
      var sizeProperty = getSizeProperty(collection);
      return typeof sizeProperty == "number" && sizeProperty >= 0 && sizeProperty <= MAX_ARRAY_INDEX;
    };
  }
  var init_createSizePropertyCheck = __esm({
    "node_modules/underscore/modules/_createSizePropertyCheck.js"() {
      init_setup();
    }
  });

  // node_modules/underscore/modules/_shallowProperty.js
  function shallowProperty(key2) {
    return function(obj) {
      return obj == null ? void 0 : obj[key2];
    };
  }
  var init_shallowProperty = __esm({
    "node_modules/underscore/modules/_shallowProperty.js"() {
    }
  });

  // node_modules/underscore/modules/_getByteLength.js
  var getByteLength_default;
  var init_getByteLength = __esm({
    "node_modules/underscore/modules/_getByteLength.js"() {
      init_shallowProperty();
      getByteLength_default = shallowProperty("byteLength");
    }
  });

  // node_modules/underscore/modules/_isBufferLike.js
  var isBufferLike_default;
  var init_isBufferLike = __esm({
    "node_modules/underscore/modules/_isBufferLike.js"() {
      init_createSizePropertyCheck();
      init_getByteLength();
      isBufferLike_default = createSizePropertyCheck(getByteLength_default);
    }
  });

  // node_modules/underscore/modules/isTypedArray.js
  function isTypedArray(obj) {
    return nativeIsView ? nativeIsView(obj) && !isDataView_default(obj) : isBufferLike_default(obj) && typedArrayPattern.test(toString.call(obj));
  }
  var typedArrayPattern, isTypedArray_default;
  var init_isTypedArray = __esm({
    "node_modules/underscore/modules/isTypedArray.js"() {
      init_setup();
      init_isDataView();
      init_constant();
      init_isBufferLike();
      typedArrayPattern = /\[object ((I|Ui)nt(8|16|32)|Float(32|64)|Uint8Clamped|Big(I|Ui)nt64)Array\]/;
      isTypedArray_default = supportsArrayBuffer ? isTypedArray : constant(false);
    }
  });

  // node_modules/underscore/modules/_getLength.js
  var getLength_default;
  var init_getLength = __esm({
    "node_modules/underscore/modules/_getLength.js"() {
      init_shallowProperty();
      getLength_default = shallowProperty("length");
    }
  });

  // node_modules/underscore/modules/_collectNonEnumProps.js
  function emulatedSet(keys2) {
    var hash = {};
    for (var l = keys2.length, i2 = 0; i2 < l; ++i2)
      hash[keys2[i2]] = true;
    return {
      contains: function(key2) {
        return hash[key2] === true;
      },
      push: function(key2) {
        hash[key2] = true;
        return keys2.push(key2);
      }
    };
  }
  function collectNonEnumProps(obj, keys2) {
    keys2 = emulatedSet(keys2);
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = isFunction_default(constructor) && constructor.prototype || ObjProto;
    var prop = "constructor";
    if (has(obj, prop) && !keys2.contains(prop))
      keys2.push(prop);
    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !keys2.contains(prop)) {
        keys2.push(prop);
      }
    }
  }
  var init_collectNonEnumProps = __esm({
    "node_modules/underscore/modules/_collectNonEnumProps.js"() {
      init_setup();
      init_isFunction();
      init_has();
    }
  });

  // node_modules/underscore/modules/keys.js
  function keys(obj) {
    if (!isObject(obj))
      return [];
    if (nativeKeys)
      return nativeKeys(obj);
    var keys2 = [];
    for (var key2 in obj)
      if (has(obj, key2))
        keys2.push(key2);
    if (hasEnumBug)
      collectNonEnumProps(obj, keys2);
    return keys2;
  }
  var init_keys = __esm({
    "node_modules/underscore/modules/keys.js"() {
      init_isObject();
      init_setup();
      init_has();
      init_collectNonEnumProps();
    }
  });

  // node_modules/underscore/modules/isEmpty.js
  function isEmpty(obj) {
    if (obj == null)
      return true;
    var length = getLength_default(obj);
    if (typeof length == "number" && (isArray_default(obj) || isString_default(obj) || isArguments_default(obj)))
      return length === 0;
    return getLength_default(keys(obj)) === 0;
  }
  var init_isEmpty = __esm({
    "node_modules/underscore/modules/isEmpty.js"() {
      init_getLength();
      init_isArray();
      init_isString();
      init_isArguments();
      init_keys();
    }
  });

  // node_modules/underscore/modules/isMatch.js
  function isMatch(object2, attrs) {
    var _keys = keys(attrs), length = _keys.length;
    if (object2 == null)
      return !length;
    var obj = Object(object2);
    for (var i2 = 0; i2 < length; i2++) {
      var key2 = _keys[i2];
      if (attrs[key2] !== obj[key2] || !(key2 in obj))
        return false;
    }
    return true;
  }
  var init_isMatch = __esm({
    "node_modules/underscore/modules/isMatch.js"() {
      init_keys();
    }
  });

  // node_modules/underscore/modules/underscore.js
  function _(obj) {
    if (obj instanceof _)
      return obj;
    if (!(this instanceof _))
      return new _(obj);
    this._wrapped = obj;
  }
  var init_underscore = __esm({
    "node_modules/underscore/modules/underscore.js"() {
      init_setup();
      _.VERSION = VERSION;
      _.prototype.value = function() {
        return this._wrapped;
      };
      _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;
      _.prototype.toString = function() {
        return String(this._wrapped);
      };
    }
  });

  // node_modules/underscore/modules/_toBufferView.js
  function toBufferView(bufferSource) {
    return new Uint8Array(
      bufferSource.buffer || bufferSource,
      bufferSource.byteOffset || 0,
      getByteLength_default(bufferSource)
    );
  }
  var init_toBufferView = __esm({
    "node_modules/underscore/modules/_toBufferView.js"() {
      init_getByteLength();
    }
  });

  // node_modules/underscore/modules/isEqual.js
  function isEqual(a, b) {
    var todo = [{ a, b }];
    var aStack = [], bStack = [];
    while (todo.length) {
      var frame = todo.pop();
      if (frame === true) {
        aStack.pop();
        bStack.pop();
        continue;
      }
      a = frame.a;
      b = frame.b;
      if (a === b) {
        if (a !== 0 || 1 / a === 1 / b)
          continue;
        return false;
      }
      if (a == null || b == null)
        return false;
      if (a !== a) {
        if (b !== b)
          continue;
        return false;
      }
      var type2 = typeof a;
      if (type2 !== "function" && type2 !== "object" && typeof b != "object")
        return false;
      if (a instanceof _)
        a = a._wrapped;
      if (b instanceof _)
        b = b._wrapped;
      var className = toString.call(a);
      if (className !== toString.call(b))
        return false;
      if (hasDataViewBug && className == "[object Object]" && isDataView_default(a)) {
        if (!isDataView_default(b))
          return false;
        className = tagDataView;
      }
      switch (className) {
        case "[object RegExp]":
        case "[object String]":
          if ("" + a === "" + b)
            continue;
          return false;
        case "[object Number]":
          todo.push({ a: +a, b: +b });
          continue;
        case "[object Date]":
        case "[object Boolean]":
          if (+a === +b)
            continue;
          return false;
        case "[object Symbol]":
          if (SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b))
            continue;
          return false;
        case "[object ArrayBuffer]":
        case tagDataView:
          todo.push({ a: toBufferView(a), b: toBufferView(b) });
          continue;
      }
      var areArrays = className === "[object Array]";
      if (!areArrays && isTypedArray_default(a)) {
        var byteLength = getByteLength_default(a);
        if (byteLength !== getByteLength_default(b))
          return false;
        if (a.buffer === b.buffer && a.byteOffset === b.byteOffset)
          continue;
        areArrays = true;
      }
      if (!areArrays) {
        if (typeof a != "object" || typeof b != "object")
          return false;
        var aCtor = a.constructor, bCtor = b.constructor;
        if (aCtor !== bCtor && !(isFunction_default(aCtor) && aCtor instanceof aCtor && isFunction_default(bCtor) && bCtor instanceof bCtor) && ("constructor" in a && "constructor" in b)) {
          return false;
        }
      }
      var length = aStack.length;
      while (length--) {
        if (aStack[length] === a) {
          if (bStack[length] === b)
            break;
          return false;
        }
      }
      if (length >= 0)
        continue;
      aStack.push(a);
      bStack.push(b);
      todo.push(true);
      if (areArrays) {
        length = a.length;
        if (length !== b.length)
          return false;
        while (length--) {
          todo.push({ a: a[length], b: b[length] });
        }
      } else {
        var _keys = keys(a), key2;
        length = _keys.length;
        if (keys(b).length !== length)
          return false;
        while (length--) {
          key2 = _keys[length];
          if (!has(b, key2))
            return false;
          todo.push({ a: a[key2], b: b[key2] });
        }
      }
    }
    return true;
  }
  var tagDataView;
  var init_isEqual = __esm({
    "node_modules/underscore/modules/isEqual.js"() {
      init_underscore();
      init_setup();
      init_getByteLength();
      init_isTypedArray();
      init_isFunction();
      init_stringTagBug();
      init_isDataView();
      init_keys();
      init_has();
      init_toBufferView();
      tagDataView = "[object DataView]";
    }
  });

  // node_modules/underscore/modules/allKeys.js
  function allKeys(obj) {
    if (!isObject(obj))
      return [];
    var keys2 = [];
    for (var key2 in obj)
      keys2.push(key2);
    if (hasEnumBug)
      collectNonEnumProps(obj, keys2);
    return keys2;
  }
  var init_allKeys = __esm({
    "node_modules/underscore/modules/allKeys.js"() {
      init_isObject();
      init_setup();
      init_collectNonEnumProps();
    }
  });

  // node_modules/underscore/modules/_methodFingerprint.js
  function ie11fingerprint(methods) {
    var length = getLength_default(methods);
    return function(obj) {
      if (obj == null)
        return false;
      var keys2 = allKeys(obj);
      if (getLength_default(keys2))
        return false;
      for (var i2 = 0; i2 < length; i2++) {
        if (!isFunction_default(obj[methods[i2]]))
          return false;
      }
      return methods !== weakMapMethods || !isFunction_default(obj[forEachName]);
    };
  }
  var forEachName, hasName, commonInit, mapTail, mapMethods, weakMapMethods, setMethods;
  var init_methodFingerprint = __esm({
    "node_modules/underscore/modules/_methodFingerprint.js"() {
      init_getLength();
      init_isFunction();
      init_allKeys();
      forEachName = "forEach";
      hasName = "has";
      commonInit = ["clear", "delete"];
      mapTail = ["get", hasName, "set"];
      mapMethods = commonInit.concat(forEachName, mapTail);
      weakMapMethods = commonInit.concat(mapTail);
      setMethods = ["add"].concat(commonInit, forEachName, hasName);
    }
  });

  // node_modules/underscore/modules/isMap.js
  var isMap_default;
  var init_isMap = __esm({
    "node_modules/underscore/modules/isMap.js"() {
      init_tagTester();
      init_stringTagBug();
      init_methodFingerprint();
      isMap_default = isIE11 ? ie11fingerprint(mapMethods) : tagTester("Map");
    }
  });

  // node_modules/underscore/modules/isWeakMap.js
  var isWeakMap_default;
  var init_isWeakMap = __esm({
    "node_modules/underscore/modules/isWeakMap.js"() {
      init_tagTester();
      init_stringTagBug();
      init_methodFingerprint();
      isWeakMap_default = isIE11 ? ie11fingerprint(weakMapMethods) : tagTester("WeakMap");
    }
  });

  // node_modules/underscore/modules/isSet.js
  var isSet_default;
  var init_isSet = __esm({
    "node_modules/underscore/modules/isSet.js"() {
      init_tagTester();
      init_stringTagBug();
      init_methodFingerprint();
      isSet_default = isIE11 ? ie11fingerprint(setMethods) : tagTester("Set");
    }
  });

  // node_modules/underscore/modules/isWeakSet.js
  var isWeakSet_default;
  var init_isWeakSet = __esm({
    "node_modules/underscore/modules/isWeakSet.js"() {
      init_tagTester();
      isWeakSet_default = tagTester("WeakSet");
    }
  });

  // node_modules/underscore/modules/values.js
  function values(obj) {
    var _keys = keys(obj);
    var length = _keys.length;
    var values2 = Array(length);
    for (var i2 = 0; i2 < length; i2++) {
      values2[i2] = obj[_keys[i2]];
    }
    return values2;
  }
  var init_values = __esm({
    "node_modules/underscore/modules/values.js"() {
      init_keys();
    }
  });

  // node_modules/underscore/modules/pairs.js
  function pairs(obj) {
    var _keys = keys(obj);
    var length = _keys.length;
    var pairs2 = Array(length);
    for (var i2 = 0; i2 < length; i2++) {
      pairs2[i2] = [_keys[i2], obj[_keys[i2]]];
    }
    return pairs2;
  }
  var init_pairs = __esm({
    "node_modules/underscore/modules/pairs.js"() {
      init_keys();
    }
  });

  // node_modules/underscore/modules/invert.js
  function invert(obj) {
    var result2 = {};
    var _keys = keys(obj);
    for (var i2 = 0, length = _keys.length; i2 < length; i2++) {
      result2[obj[_keys[i2]]] = _keys[i2];
    }
    return result2;
  }
  var init_invert = __esm({
    "node_modules/underscore/modules/invert.js"() {
      init_keys();
    }
  });

  // node_modules/underscore/modules/functions.js
  function functions(obj) {
    var names = [];
    for (var key2 in obj) {
      if (isFunction_default(obj[key2]))
        names.push(key2);
    }
    return names.sort();
  }
  var init_functions = __esm({
    "node_modules/underscore/modules/functions.js"() {
      init_isFunction();
    }
  });

  // node_modules/underscore/modules/_createAssigner.js
  function createAssigner(keysFunc, defaults) {
    return function(obj) {
      var length = arguments.length;
      if (defaults)
        obj = Object(obj);
      if (length < 2 || obj == null)
        return obj;
      for (var index = 1; index < length; index++) {
        var source2 = arguments[index], keys2 = keysFunc(source2), l = keys2.length;
        for (var i2 = 0; i2 < l; i2++) {
          var key2 = keys2[i2];
          if (!defaults || obj[key2] === void 0)
            obj[key2] = source2[key2];
        }
      }
      return obj;
    };
  }
  var init_createAssigner = __esm({
    "node_modules/underscore/modules/_createAssigner.js"() {
    }
  });

  // node_modules/underscore/modules/extend.js
  var extend_default;
  var init_extend = __esm({
    "node_modules/underscore/modules/extend.js"() {
      init_createAssigner();
      init_allKeys();
      extend_default = createAssigner(allKeys);
    }
  });

  // node_modules/underscore/modules/extendOwn.js
  var extendOwn_default;
  var init_extendOwn = __esm({
    "node_modules/underscore/modules/extendOwn.js"() {
      init_createAssigner();
      init_keys();
      extendOwn_default = createAssigner(keys);
    }
  });

  // node_modules/underscore/modules/defaults.js
  var defaults_default;
  var init_defaults = __esm({
    "node_modules/underscore/modules/defaults.js"() {
      init_createAssigner();
      init_allKeys();
      defaults_default = createAssigner(allKeys, true);
    }
  });

  // node_modules/underscore/modules/_baseCreate.js
  function ctor() {
    return function() {
    };
  }
  function baseCreate(prototype) {
    if (!isObject(prototype))
      return {};
    if (nativeCreate)
      return nativeCreate(prototype);
    var Ctor = ctor();
    Ctor.prototype = prototype;
    var result2 = new Ctor();
    Ctor.prototype = null;
    return result2;
  }
  var init_baseCreate = __esm({
    "node_modules/underscore/modules/_baseCreate.js"() {
      init_isObject();
      init_setup();
    }
  });

  // node_modules/underscore/modules/create.js
  function create(prototype, props) {
    var result2 = baseCreate(prototype);
    if (props)
      extendOwn_default(result2, props);
    return result2;
  }
  var init_create = __esm({
    "node_modules/underscore/modules/create.js"() {
      init_baseCreate();
      init_extendOwn();
    }
  });

  // node_modules/underscore/modules/clone.js
  function clone(obj) {
    if (!isObject(obj))
      return obj;
    return isArray_default(obj) ? obj.slice() : extend_default({}, obj);
  }
  var init_clone = __esm({
    "node_modules/underscore/modules/clone.js"() {
      init_isObject();
      init_isArray();
      init_extend();
    }
  });

  // node_modules/underscore/modules/tap.js
  function tap(obj, interceptor) {
    interceptor(obj);
    return obj;
  }
  var init_tap = __esm({
    "node_modules/underscore/modules/tap.js"() {
    }
  });

  // node_modules/underscore/modules/toPath.js
  function toPath(path2) {
    return isArray_default(path2) ? path2 : [path2];
  }
  var init_toPath = __esm({
    "node_modules/underscore/modules/toPath.js"() {
      init_underscore();
      init_isArray();
      _.toPath = toPath;
    }
  });

  // node_modules/underscore/modules/_toPath.js
  function toPath2(path2) {
    return _.toPath(path2);
  }
  var init_toPath2 = __esm({
    "node_modules/underscore/modules/_toPath.js"() {
      init_underscore();
      init_toPath();
    }
  });

  // node_modules/underscore/modules/_deepGet.js
  function deepGet(obj, path2) {
    var length = path2.length;
    for (var i2 = 0; i2 < length; i2++) {
      if (obj == null)
        return void 0;
      obj = obj[path2[i2]];
    }
    return length ? obj : void 0;
  }
  var init_deepGet = __esm({
    "node_modules/underscore/modules/_deepGet.js"() {
    }
  });

  // node_modules/underscore/modules/get.js
  function get(object2, path2, defaultValue) {
    var value = deepGet(object2, toPath2(path2));
    return isUndefined(value) ? defaultValue : value;
  }
  var init_get = __esm({
    "node_modules/underscore/modules/get.js"() {
      init_toPath2();
      init_deepGet();
      init_isUndefined();
    }
  });

  // node_modules/underscore/modules/has.js
  function has2(obj, path2) {
    path2 = toPath2(path2);
    var length = path2.length;
    for (var i2 = 0; i2 < length; i2++) {
      var key2 = path2[i2];
      if (!has(obj, key2))
        return false;
      obj = obj[key2];
    }
    return !!length;
  }
  var init_has2 = __esm({
    "node_modules/underscore/modules/has.js"() {
      init_has();
      init_toPath2();
    }
  });

  // node_modules/underscore/modules/identity.js
  function identity(value) {
    return value;
  }
  var init_identity = __esm({
    "node_modules/underscore/modules/identity.js"() {
    }
  });

  // node_modules/underscore/modules/matcher.js
  function matcher(attrs) {
    attrs = extendOwn_default({}, attrs);
    return function(obj) {
      return isMatch(obj, attrs);
    };
  }
  var init_matcher = __esm({
    "node_modules/underscore/modules/matcher.js"() {
      init_extendOwn();
      init_isMatch();
    }
  });

  // node_modules/underscore/modules/property.js
  function property(path2) {
    path2 = toPath2(path2);
    return function(obj) {
      return deepGet(obj, path2);
    };
  }
  var init_property = __esm({
    "node_modules/underscore/modules/property.js"() {
      init_deepGet();
      init_toPath2();
    }
  });

  // node_modules/underscore/modules/_optimizeCb.js
  function optimizeCb(func2, context, argCount) {
    if (context === void 0)
      return func2;
    switch (argCount == null ? 3 : argCount) {
      case 1:
        return function(value) {
          return func2.call(context, value);
        };
      case 3:
        return function(value, index, collection) {
          return func2.call(context, value, index, collection);
        };
      case 4:
        return function(accumulator, value, index, collection) {
          return func2.call(context, accumulator, value, index, collection);
        };
    }
    return function() {
      return func2.apply(context, arguments);
    };
  }
  var init_optimizeCb = __esm({
    "node_modules/underscore/modules/_optimizeCb.js"() {
    }
  });

  // node_modules/underscore/modules/_baseIteratee.js
  function baseIteratee(value, context, argCount) {
    if (value == null)
      return identity;
    if (isFunction_default(value))
      return optimizeCb(value, context, argCount);
    if (isObject(value) && !isArray_default(value))
      return matcher(value);
    return property(value);
  }
  var init_baseIteratee = __esm({
    "node_modules/underscore/modules/_baseIteratee.js"() {
      init_identity();
      init_isFunction();
      init_isObject();
      init_isArray();
      init_matcher();
      init_property();
      init_optimizeCb();
    }
  });

  // node_modules/underscore/modules/iteratee.js
  function iteratee(value, context) {
    return baseIteratee(value, context, Infinity);
  }
  var init_iteratee = __esm({
    "node_modules/underscore/modules/iteratee.js"() {
      init_underscore();
      init_baseIteratee();
      _.iteratee = iteratee;
    }
  });

  // node_modules/underscore/modules/_cb.js
  function cb(value, context, argCount) {
    if (_.iteratee !== iteratee)
      return _.iteratee(value, context);
    return baseIteratee(value, context, argCount);
  }
  var init_cb = __esm({
    "node_modules/underscore/modules/_cb.js"() {
      init_underscore();
      init_baseIteratee();
      init_iteratee();
    }
  });

  // node_modules/underscore/modules/mapObject.js
  function mapObject(obj, iteratee2, context) {
    iteratee2 = cb(iteratee2, context);
    var _keys = keys(obj), length = _keys.length, results = {};
    for (var index = 0; index < length; index++) {
      var currentKey = _keys[index];
      results[currentKey] = iteratee2(obj[currentKey], currentKey, obj);
    }
    return results;
  }
  var init_mapObject = __esm({
    "node_modules/underscore/modules/mapObject.js"() {
      init_cb();
      init_keys();
    }
  });

  // node_modules/underscore/modules/noop.js
  function noop() {
  }
  var init_noop = __esm({
    "node_modules/underscore/modules/noop.js"() {
    }
  });

  // node_modules/underscore/modules/propertyOf.js
  function propertyOf(obj) {
    if (obj == null)
      return noop;
    return function(path2) {
      return get(obj, path2);
    };
  }
  var init_propertyOf = __esm({
    "node_modules/underscore/modules/propertyOf.js"() {
      init_noop();
      init_get();
    }
  });

  // node_modules/underscore/modules/times.js
  function times(n, iteratee2, context) {
    var accum = Array(Math.max(0, n));
    iteratee2 = optimizeCb(iteratee2, context, 1);
    for (var i2 = 0; i2 < n; i2++)
      accum[i2] = iteratee2(i2);
    return accum;
  }
  var init_times = __esm({
    "node_modules/underscore/modules/times.js"() {
      init_optimizeCb();
    }
  });

  // node_modules/underscore/modules/random.js
  function random(min2, max2) {
    if (max2 == null) {
      max2 = min2;
      min2 = 0;
    }
    return min2 + Math.floor(Math.random() * (max2 - min2 + 1));
  }
  var init_random = __esm({
    "node_modules/underscore/modules/random.js"() {
    }
  });

  // node_modules/underscore/modules/now.js
  var now_default;
  var init_now = __esm({
    "node_modules/underscore/modules/now.js"() {
      now_default = Date.now || function() {
        return (/* @__PURE__ */ new Date()).getTime();
      };
    }
  });

  // node_modules/underscore/modules/_createEscaper.js
  function createEscaper(map2) {
    var escaper = function(match) {
      return map2[match];
    };
    var source2 = "(?:" + keys(map2).join("|") + ")";
    var testRegexp = RegExp(source2);
    var replaceRegexp = RegExp(source2, "g");
    return function(string) {
      string = string == null ? "" : "" + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  }
  var init_createEscaper = __esm({
    "node_modules/underscore/modules/_createEscaper.js"() {
      init_keys();
    }
  });

  // node_modules/underscore/modules/_escapeMap.js
  var escapeMap_default;
  var init_escapeMap = __esm({
    "node_modules/underscore/modules/_escapeMap.js"() {
      escapeMap_default = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#x27;",
        "`": "&#x60;"
      };
    }
  });

  // node_modules/underscore/modules/escape.js
  var escape_default;
  var init_escape = __esm({
    "node_modules/underscore/modules/escape.js"() {
      init_createEscaper();
      init_escapeMap();
      escape_default = createEscaper(escapeMap_default);
    }
  });

  // node_modules/underscore/modules/_unescapeMap.js
  var unescapeMap_default;
  var init_unescapeMap = __esm({
    "node_modules/underscore/modules/_unescapeMap.js"() {
      init_invert();
      init_escapeMap();
      unescapeMap_default = invert(escapeMap_default);
    }
  });

  // node_modules/underscore/modules/unescape.js
  var unescape_default;
  var init_unescape = __esm({
    "node_modules/underscore/modules/unescape.js"() {
      init_createEscaper();
      init_unescapeMap();
      unescape_default = createEscaper(unescapeMap_default);
    }
  });

  // node_modules/underscore/modules/templateSettings.js
  var templateSettings_default;
  var init_templateSettings = __esm({
    "node_modules/underscore/modules/templateSettings.js"() {
      init_underscore();
      templateSettings_default = _.templateSettings = {
        evaluate: /<%([\s\S]+?)%>/g,
        interpolate: /<%=([\s\S]+?)%>/g,
        escape: /<%-([\s\S]+?)%>/g
      };
    }
  });

  // node_modules/underscore/modules/template.js
  function escapeChar(match) {
    return "\\" + escapes[match];
  }
  function template(text, settings, oldSettings) {
    if (!settings && oldSettings)
      settings = oldSettings;
    settings = defaults_default({}, settings, _.templateSettings);
    var matcher2 = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join("|") + "|$", "g");
    var index = 0;
    var source2 = "__p+='";
    text.replace(matcher2, function(match, escape, interpolate, evaluate, offset) {
      source2 += text.slice(index, offset).replace(escapeRegExp, escapeChar);
      index = offset + match.length;
      if (escape) {
        source2 += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source2 += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source2 += "';\n" + evaluate + "\n__p+='";
      }
      return match;
    });
    source2 += "';\n";
    var argument = settings.variable;
    if (argument) {
      if (!bareIdentifier.test(argument))
        throw new Error(
          "variable is not a bare identifier: " + argument
        );
    } else {
      source2 = "with(obj||{}){\n" + source2 + "}\n";
      argument = "obj";
    }
    source2 = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + source2 + "return __p;\n";
    var render;
    try {
      render = new Function(argument, "_", source2);
    } catch (e) {
      e.source = source2;
      throw e;
    }
    var template2 = function(data2) {
      return render.call(this, data2, _);
    };
    template2.source = "function(" + argument + "){\n" + source2 + "}";
    return template2;
  }
  var noMatch, escapes, escapeRegExp, bareIdentifier;
  var init_template = __esm({
    "node_modules/underscore/modules/template.js"() {
      init_defaults();
      init_underscore();
      init_templateSettings();
      noMatch = /(.)^/;
      escapes = {
        "'": "'",
        "\\": "\\",
        "\r": "r",
        "\n": "n",
        "\u2028": "u2028",
        "\u2029": "u2029"
      };
      escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;
      bareIdentifier = /^\s*(\w|\$)+\s*$/;
    }
  });

  // node_modules/underscore/modules/result.js
  function result(obj, path2, fallback) {
    path2 = toPath2(path2);
    var length = path2.length;
    if (!length) {
      return isFunction_default(fallback) ? fallback.call(obj) : fallback;
    }
    for (var i2 = 0; i2 < length; i2++) {
      var prop = obj == null ? void 0 : obj[path2[i2]];
      if (prop === void 0) {
        prop = fallback;
        i2 = length;
      }
      obj = isFunction_default(prop) ? prop.call(obj) : prop;
    }
    return obj;
  }
  var init_result = __esm({
    "node_modules/underscore/modules/result.js"() {
      init_isFunction();
      init_toPath2();
    }
  });

  // node_modules/underscore/modules/uniqueId.js
  function uniqueId(prefix) {
    var id = ++idCounter + "";
    return prefix ? prefix + id : id;
  }
  var idCounter;
  var init_uniqueId = __esm({
    "node_modules/underscore/modules/uniqueId.js"() {
      idCounter = 0;
    }
  });

  // node_modules/underscore/modules/chain.js
  function chain(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  }
  var init_chain = __esm({
    "node_modules/underscore/modules/chain.js"() {
      init_underscore();
    }
  });

  // node_modules/underscore/modules/_executeBound.js
  function executeBound(sourceFunc, boundFunc, context, callingContext, args2) {
    if (!(callingContext instanceof boundFunc))
      return sourceFunc.apply(context, args2);
    var self2 = baseCreate(sourceFunc.prototype);
    var result2 = sourceFunc.apply(self2, args2);
    if (isObject(result2))
      return result2;
    return self2;
  }
  var init_executeBound = __esm({
    "node_modules/underscore/modules/_executeBound.js"() {
      init_baseCreate();
      init_isObject();
    }
  });

  // node_modules/underscore/modules/partial.js
  var partial, partial_default;
  var init_partial = __esm({
    "node_modules/underscore/modules/partial.js"() {
      init_restArguments();
      init_executeBound();
      init_underscore();
      partial = restArguments(function(func2, boundArgs) {
        var placeholder = partial.placeholder;
        var bound = function() {
          var position = 0, length = boundArgs.length;
          var args2 = Array(length);
          for (var i2 = 0; i2 < length; i2++) {
            args2[i2] = boundArgs[i2] === placeholder ? arguments[position++] : boundArgs[i2];
          }
          while (position < arguments.length)
            args2.push(arguments[position++]);
          return executeBound(func2, bound, this, this, args2);
        };
        return bound;
      });
      partial.placeholder = _;
      partial_default = partial;
    }
  });

  // node_modules/underscore/modules/bind.js
  var bind_default;
  var init_bind = __esm({
    "node_modules/underscore/modules/bind.js"() {
      init_restArguments();
      init_isFunction();
      init_executeBound();
      bind_default = restArguments(function(func2, context, args2) {
        if (!isFunction_default(func2))
          throw new TypeError("Bind must be called on a function");
        var bound = restArguments(function(callArgs) {
          return executeBound(func2, bound, context, this, args2.concat(callArgs));
        });
        return bound;
      });
    }
  });

  // node_modules/underscore/modules/_isArrayLike.js
  var isArrayLike_default;
  var init_isArrayLike = __esm({
    "node_modules/underscore/modules/_isArrayLike.js"() {
      init_createSizePropertyCheck();
      init_getLength();
      isArrayLike_default = createSizePropertyCheck(getLength_default);
    }
  });

  // node_modules/underscore/modules/_flatten.js
  function flatten(input, depth, strict) {
    if (!depth && depth !== 0)
      depth = Infinity;
    var output = [], idx = 0, i2 = 0, length = getLength_default(input) || 0, stack = [];
    while (true) {
      if (i2 >= length) {
        if (!stack.length)
          break;
        var frame = stack.pop();
        i2 = frame.i;
        input = frame.v;
        length = getLength_default(input);
        continue;
      }
      var value = input[i2++];
      if (stack.length >= depth) {
        output[idx++] = value;
      } else if (isArrayLike_default(value) && (isArray_default(value) || isArguments_default(value))) {
        stack.push({ i: i2, v: input });
        i2 = 0;
        input = value;
        length = getLength_default(input);
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  }
  var init_flatten = __esm({
    "node_modules/underscore/modules/_flatten.js"() {
      init_getLength();
      init_isArrayLike();
      init_isArray();
      init_isArguments();
    }
  });

  // node_modules/underscore/modules/bindAll.js
  var bindAll_default;
  var init_bindAll = __esm({
    "node_modules/underscore/modules/bindAll.js"() {
      init_restArguments();
      init_flatten();
      init_bind();
      bindAll_default = restArguments(function(obj, keys2) {
        keys2 = flatten(keys2, false, false);
        var index = keys2.length;
        if (index < 1)
          throw new Error("bindAll must be passed function names");
        while (index--) {
          var key2 = keys2[index];
          obj[key2] = bind_default(obj[key2], obj);
        }
        return obj;
      });
    }
  });

  // node_modules/underscore/modules/memoize.js
  function memoize(func2, hasher) {
    var memoize2 = function(key2) {
      var cache = memoize2.cache;
      var address = "" + (hasher ? hasher.apply(this, arguments) : key2);
      if (!has(cache, address))
        cache[address] = func2.apply(this, arguments);
      return cache[address];
    };
    memoize2.cache = {};
    return memoize2;
  }
  var init_memoize = __esm({
    "node_modules/underscore/modules/memoize.js"() {
      init_has();
    }
  });

  // node_modules/underscore/modules/delay.js
  var delay_default;
  var init_delay = __esm({
    "node_modules/underscore/modules/delay.js"() {
      init_restArguments();
      delay_default = restArguments(function(func2, wait, args2) {
        return setTimeout(function() {
          return func2.apply(null, args2);
        }, wait);
      });
    }
  });

  // node_modules/underscore/modules/defer.js
  var defer_default;
  var init_defer = __esm({
    "node_modules/underscore/modules/defer.js"() {
      init_partial();
      init_delay();
      init_underscore();
      defer_default = partial_default(delay_default, _, 1);
    }
  });

  // node_modules/underscore/modules/throttle.js
  function throttle(func2, wait, options) {
    var timeout, context, args2, result2;
    var previous = 0;
    if (!options)
      options = {};
    var later = function() {
      previous = options.leading === false ? 0 : now_default();
      timeout = null;
      result2 = func2.apply(context, args2);
      if (!timeout)
        context = args2 = null;
    };
    var throttled = function() {
      var _now = now_default();
      if (!previous && options.leading === false)
        previous = _now;
      var remaining = wait - (_now - previous);
      context = this;
      args2 = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = _now;
        result2 = func2.apply(context, args2);
        if (!timeout)
          context = args2 = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result2;
    };
    throttled.cancel = function() {
      clearTimeout(timeout);
      previous = 0;
      timeout = context = args2 = null;
    };
    return throttled;
  }
  var init_throttle = __esm({
    "node_modules/underscore/modules/throttle.js"() {
      init_now();
    }
  });

  // node_modules/underscore/modules/debounce.js
  function debounce(func2, wait, immediate) {
    var timeout, previous, args2, result2, context;
    var later = function() {
      var passed = now_default() - previous;
      if (wait > passed) {
        timeout = setTimeout(later, wait - passed);
      } else {
        timeout = null;
        if (!immediate)
          result2 = func2.apply(context, args2);
        if (!timeout)
          args2 = context = null;
      }
    };
    var debounced = restArguments(function(_args) {
      context = this;
      args2 = _args;
      previous = now_default();
      if (!timeout) {
        timeout = setTimeout(later, wait);
        if (immediate)
          result2 = func2.apply(context, args2);
      }
      return result2;
    });
    debounced.cancel = function() {
      clearTimeout(timeout);
      timeout = args2 = context = null;
    };
    return debounced;
  }
  var init_debounce = __esm({
    "node_modules/underscore/modules/debounce.js"() {
      init_restArguments();
      init_now();
    }
  });

  // node_modules/underscore/modules/wrap.js
  function wrap(func2, wrapper) {
    return partial_default(wrapper, func2);
  }
  var init_wrap = __esm({
    "node_modules/underscore/modules/wrap.js"() {
      init_partial();
    }
  });

  // node_modules/underscore/modules/negate.js
  function negate(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  }
  var init_negate = __esm({
    "node_modules/underscore/modules/negate.js"() {
    }
  });

  // node_modules/underscore/modules/compose.js
  function compose() {
    var args2 = arguments;
    var start = args2.length - 1;
    return function() {
      var i2 = start;
      var result2 = args2[start].apply(this, arguments);
      while (i2--)
        result2 = args2[i2].call(this, result2);
      return result2;
    };
  }
  var init_compose = __esm({
    "node_modules/underscore/modules/compose.js"() {
    }
  });

  // node_modules/underscore/modules/after.js
  function after(times2, func2) {
    return function() {
      if (--times2 < 1) {
        return func2.apply(this, arguments);
      }
    };
  }
  var init_after = __esm({
    "node_modules/underscore/modules/after.js"() {
    }
  });

  // node_modules/underscore/modules/before.js
  function before(times2, func2) {
    var memo;
    return function() {
      if (--times2 > 0) {
        memo = func2.apply(this, arguments);
      }
      if (times2 <= 1)
        func2 = null;
      return memo;
    };
  }
  var init_before = __esm({
    "node_modules/underscore/modules/before.js"() {
    }
  });

  // node_modules/underscore/modules/once.js
  var once_default;
  var init_once = __esm({
    "node_modules/underscore/modules/once.js"() {
      init_partial();
      init_before();
      once_default = partial_default(before, 2);
    }
  });

  // node_modules/underscore/modules/findKey.js
  function findKey(obj, predicate, context) {
    predicate = cb(predicate, context);
    var _keys = keys(obj), key2;
    for (var i2 = 0, length = _keys.length; i2 < length; i2++) {
      key2 = _keys[i2];
      if (predicate(obj[key2], key2, obj))
        return key2;
    }
  }
  var init_findKey = __esm({
    "node_modules/underscore/modules/findKey.js"() {
      init_cb();
      init_keys();
    }
  });

  // node_modules/underscore/modules/_createPredicateIndexFinder.js
  function createPredicateIndexFinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength_default(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array))
          return index;
      }
      return -1;
    };
  }
  var init_createPredicateIndexFinder = __esm({
    "node_modules/underscore/modules/_createPredicateIndexFinder.js"() {
      init_cb();
      init_getLength();
    }
  });

  // node_modules/underscore/modules/findIndex.js
  var findIndex_default;
  var init_findIndex = __esm({
    "node_modules/underscore/modules/findIndex.js"() {
      init_createPredicateIndexFinder();
      findIndex_default = createPredicateIndexFinder(1);
    }
  });

  // node_modules/underscore/modules/findLastIndex.js
  var findLastIndex_default;
  var init_findLastIndex = __esm({
    "node_modules/underscore/modules/findLastIndex.js"() {
      init_createPredicateIndexFinder();
      findLastIndex_default = createPredicateIndexFinder(-1);
    }
  });

  // node_modules/underscore/modules/sortedIndex.js
  function sortedIndex(array, obj, iteratee2, context) {
    iteratee2 = cb(iteratee2, context, 1);
    var value = iteratee2(obj);
    var low = 0, high = getLength_default(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee2(array[mid]) < value)
        low = mid + 1;
      else
        high = mid;
    }
    return low;
  }
  var init_sortedIndex = __esm({
    "node_modules/underscore/modules/sortedIndex.js"() {
      init_cb();
      init_getLength();
    }
  });

  // node_modules/underscore/modules/_createIndexFinder.js
  function createIndexFinder(dir, predicateFind, sortedIndex2) {
    return function(array, item, idx) {
      var i2 = 0, length = getLength_default(array);
      if (typeof idx == "number") {
        if (dir > 0) {
          i2 = idx >= 0 ? idx : Math.max(idx + length, i2);
        } else {
          length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex2 && idx && length) {
        idx = sortedIndex2(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i2, length), isNaN2);
        return idx >= 0 ? idx + i2 : -1;
      }
      for (idx = dir > 0 ? i2 : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item)
          return idx;
      }
      return -1;
    };
  }
  var init_createIndexFinder = __esm({
    "node_modules/underscore/modules/_createIndexFinder.js"() {
      init_getLength();
      init_setup();
      init_isNaN();
    }
  });

  // node_modules/underscore/modules/indexOf.js
  var indexOf_default;
  var init_indexOf = __esm({
    "node_modules/underscore/modules/indexOf.js"() {
      init_sortedIndex();
      init_findIndex();
      init_createIndexFinder();
      indexOf_default = createIndexFinder(1, findIndex_default, sortedIndex);
    }
  });

  // node_modules/underscore/modules/lastIndexOf.js
  var lastIndexOf_default;
  var init_lastIndexOf = __esm({
    "node_modules/underscore/modules/lastIndexOf.js"() {
      init_findLastIndex();
      init_createIndexFinder();
      lastIndexOf_default = createIndexFinder(-1, findLastIndex_default);
    }
  });

  // node_modules/underscore/modules/find.js
  function find(obj, predicate, context) {
    var keyFinder = isArrayLike_default(obj) ? findIndex_default : findKey;
    var key2 = keyFinder(obj, predicate, context);
    if (key2 !== void 0 && key2 !== -1)
      return obj[key2];
  }
  var init_find = __esm({
    "node_modules/underscore/modules/find.js"() {
      init_isArrayLike();
      init_findIndex();
      init_findKey();
    }
  });

  // node_modules/underscore/modules/findWhere.js
  function findWhere(obj, attrs) {
    return find(obj, matcher(attrs));
  }
  var init_findWhere = __esm({
    "node_modules/underscore/modules/findWhere.js"() {
      init_find();
      init_matcher();
    }
  });

  // node_modules/underscore/modules/each.js
  function each(obj, iteratee2, context) {
    iteratee2 = optimizeCb(iteratee2, context);
    var i2, length;
    if (isArrayLike_default(obj)) {
      for (i2 = 0, length = obj.length; i2 < length; i2++) {
        iteratee2(obj[i2], i2, obj);
      }
    } else {
      var _keys = keys(obj);
      for (i2 = 0, length = _keys.length; i2 < length; i2++) {
        iteratee2(obj[_keys[i2]], _keys[i2], obj);
      }
    }
    return obj;
  }
  var init_each = __esm({
    "node_modules/underscore/modules/each.js"() {
      init_optimizeCb();
      init_isArrayLike();
      init_keys();
    }
  });

  // node_modules/underscore/modules/map.js
  function map(obj, iteratee2, context) {
    iteratee2 = cb(iteratee2, context);
    var _keys = !isArrayLike_default(obj) && keys(obj), length = (_keys || obj).length, results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = _keys ? _keys[index] : index;
      results[index] = iteratee2(obj[currentKey], currentKey, obj);
    }
    return results;
  }
  var init_map = __esm({
    "node_modules/underscore/modules/map.js"() {
      init_cb();
      init_isArrayLike();
      init_keys();
    }
  });

  // node_modules/underscore/modules/_createReduce.js
  function createReduce(dir) {
    var reducer = function(obj, iteratee2, memo, initial2) {
      var _keys = !isArrayLike_default(obj) && keys(obj), length = (_keys || obj).length, index = dir > 0 ? 0 : length - 1;
      if (!initial2) {
        memo = obj[_keys ? _keys[index] : index];
        index += dir;
      }
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = _keys ? _keys[index] : index;
        memo = iteratee2(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    };
    return function(obj, iteratee2, memo, context) {
      var initial2 = arguments.length >= 3;
      return reducer(obj, optimizeCb(iteratee2, context, 4), memo, initial2);
    };
  }
  var init_createReduce = __esm({
    "node_modules/underscore/modules/_createReduce.js"() {
      init_isArrayLike();
      init_keys();
      init_optimizeCb();
    }
  });

  // node_modules/underscore/modules/reduce.js
  var reduce_default;
  var init_reduce = __esm({
    "node_modules/underscore/modules/reduce.js"() {
      init_createReduce();
      reduce_default = createReduce(1);
    }
  });

  // node_modules/underscore/modules/reduceRight.js
  var reduceRight_default;
  var init_reduceRight = __esm({
    "node_modules/underscore/modules/reduceRight.js"() {
      init_createReduce();
      reduceRight_default = createReduce(-1);
    }
  });

  // node_modules/underscore/modules/filter.js
  function filter(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    each(obj, function(value, index, list) {
      if (predicate(value, index, list))
        results.push(value);
    });
    return results;
  }
  var init_filter = __esm({
    "node_modules/underscore/modules/filter.js"() {
      init_cb();
      init_each();
    }
  });

  // node_modules/underscore/modules/reject.js
  function reject(obj, predicate, context) {
    return filter(obj, negate(cb(predicate)), context);
  }
  var init_reject = __esm({
    "node_modules/underscore/modules/reject.js"() {
      init_filter();
      init_negate();
      init_cb();
    }
  });

  // node_modules/underscore/modules/every.js
  function every(obj, predicate, context) {
    predicate = cb(predicate, context);
    var _keys = !isArrayLike_default(obj) && keys(obj), length = (_keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = _keys ? _keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj))
        return false;
    }
    return true;
  }
  var init_every = __esm({
    "node_modules/underscore/modules/every.js"() {
      init_cb();
      init_isArrayLike();
      init_keys();
    }
  });

  // node_modules/underscore/modules/some.js
  function some(obj, predicate, context) {
    predicate = cb(predicate, context);
    var _keys = !isArrayLike_default(obj) && keys(obj), length = (_keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = _keys ? _keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj))
        return true;
    }
    return false;
  }
  var init_some = __esm({
    "node_modules/underscore/modules/some.js"() {
      init_cb();
      init_isArrayLike();
      init_keys();
    }
  });

  // node_modules/underscore/modules/contains.js
  function contains(obj, item, fromIndex, guard) {
    if (!isArrayLike_default(obj))
      obj = values(obj);
    if (typeof fromIndex != "number" || guard)
      fromIndex = 0;
    return indexOf_default(obj, item, fromIndex) >= 0;
  }
  var init_contains = __esm({
    "node_modules/underscore/modules/contains.js"() {
      init_isArrayLike();
      init_values();
      init_indexOf();
    }
  });

  // node_modules/underscore/modules/invoke.js
  var invoke_default;
  var init_invoke = __esm({
    "node_modules/underscore/modules/invoke.js"() {
      init_restArguments();
      init_isFunction();
      init_map();
      init_deepGet();
      init_toPath2();
      invoke_default = restArguments(function(obj, path2, args2) {
        var contextPath, func2;
        if (isFunction_default(path2)) {
          func2 = path2;
        } else {
          path2 = toPath2(path2);
          contextPath = path2.slice(0, -1);
          path2 = path2[path2.length - 1];
        }
        return map(obj, function(context) {
          var method = func2;
          if (!method) {
            if (contextPath && contextPath.length) {
              context = deepGet(context, contextPath);
            }
            if (context == null)
              return void 0;
            method = context[path2];
          }
          return method == null ? method : method.apply(context, args2);
        });
      });
    }
  });

  // node_modules/underscore/modules/pluck.js
  function pluck(obj, key2) {
    return map(obj, property(key2));
  }
  var init_pluck = __esm({
    "node_modules/underscore/modules/pluck.js"() {
      init_map();
      init_property();
    }
  });

  // node_modules/underscore/modules/where.js
  function where(obj, attrs) {
    return filter(obj, matcher(attrs));
  }
  var init_where = __esm({
    "node_modules/underscore/modules/where.js"() {
      init_filter();
      init_matcher();
    }
  });

  // node_modules/underscore/modules/max.js
  function max(obj, iteratee2, context) {
    var result2 = -Infinity, lastComputed = -Infinity, value, computed;
    if (iteratee2 == null || typeof iteratee2 == "number" && typeof obj[0] != "object" && obj != null) {
      obj = isArrayLike_default(obj) ? obj : values(obj);
      for (var i2 = 0, length = obj.length; i2 < length; i2++) {
        value = obj[i2];
        if (value != null && value > result2) {
          result2 = value;
        }
      }
    } else {
      iteratee2 = cb(iteratee2, context);
      each(obj, function(v, index, list) {
        computed = iteratee2(v, index, list);
        if (computed > lastComputed || computed === -Infinity && result2 === -Infinity) {
          result2 = v;
          lastComputed = computed;
        }
      });
    }
    return result2;
  }
  var init_max = __esm({
    "node_modules/underscore/modules/max.js"() {
      init_isArrayLike();
      init_values();
      init_cb();
      init_each();
    }
  });

  // node_modules/underscore/modules/min.js
  function min(obj, iteratee2, context) {
    var result2 = Infinity, lastComputed = Infinity, value, computed;
    if (iteratee2 == null || typeof iteratee2 == "number" && typeof obj[0] != "object" && obj != null) {
      obj = isArrayLike_default(obj) ? obj : values(obj);
      for (var i2 = 0, length = obj.length; i2 < length; i2++) {
        value = obj[i2];
        if (value != null && value < result2) {
          result2 = value;
        }
      }
    } else {
      iteratee2 = cb(iteratee2, context);
      each(obj, function(v, index, list) {
        computed = iteratee2(v, index, list);
        if (computed < lastComputed || computed === Infinity && result2 === Infinity) {
          result2 = v;
          lastComputed = computed;
        }
      });
    }
    return result2;
  }
  var init_min = __esm({
    "node_modules/underscore/modules/min.js"() {
      init_isArrayLike();
      init_values();
      init_cb();
      init_each();
    }
  });

  // node_modules/underscore/modules/toArray.js
  function toArray(obj) {
    if (!obj)
      return [];
    if (isArray_default(obj))
      return slice.call(obj);
    if (isString_default(obj)) {
      return obj.match(reStrSymbol);
    }
    if (isArrayLike_default(obj))
      return map(obj, identity);
    return values(obj);
  }
  var reStrSymbol;
  var init_toArray = __esm({
    "node_modules/underscore/modules/toArray.js"() {
      init_isArray();
      init_setup();
      init_isString();
      init_isArrayLike();
      init_map();
      init_identity();
      init_values();
      reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
    }
  });

  // node_modules/underscore/modules/sample.js
  function sample(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike_default(obj))
        obj = values(obj);
      return obj[random(obj.length - 1)];
    }
    var sample2 = toArray(obj);
    var length = getLength_default(sample2);
    n = Math.max(Math.min(n, length), 0);
    var last2 = length - 1;
    for (var index = 0; index < n; index++) {
      var rand = random(index, last2);
      var temp = sample2[index];
      sample2[index] = sample2[rand];
      sample2[rand] = temp;
    }
    return sample2.slice(0, n);
  }
  var init_sample = __esm({
    "node_modules/underscore/modules/sample.js"() {
      init_isArrayLike();
      init_values();
      init_getLength();
      init_random();
      init_toArray();
    }
  });

  // node_modules/underscore/modules/shuffle.js
  function shuffle(obj) {
    return sample(obj, Infinity);
  }
  var init_shuffle = __esm({
    "node_modules/underscore/modules/shuffle.js"() {
      init_sample();
    }
  });

  // node_modules/underscore/modules/sortBy.js
  function sortBy(obj, iteratee2, context) {
    var index = 0;
    iteratee2 = cb(iteratee2, context);
    return pluck(map(obj, function(value, key2, list) {
      return {
        value,
        index: index++,
        criteria: iteratee2(value, key2, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0)
          return 1;
        if (a < b || b === void 0)
          return -1;
      }
      return left.index - right.index;
    }), "value");
  }
  var init_sortBy = __esm({
    "node_modules/underscore/modules/sortBy.js"() {
      init_cb();
      init_pluck();
      init_map();
    }
  });

  // node_modules/underscore/modules/_group.js
  function group(behavior, partition) {
    return function(obj, iteratee2, context) {
      var result2 = partition ? [[], []] : {};
      iteratee2 = cb(iteratee2, context);
      each(obj, function(value, index) {
        var key2 = iteratee2(value, index, obj);
        behavior(result2, value, key2);
      });
      return result2;
    };
  }
  var init_group = __esm({
    "node_modules/underscore/modules/_group.js"() {
      init_cb();
      init_each();
    }
  });

  // node_modules/underscore/modules/groupBy.js
  var groupBy_default;
  var init_groupBy = __esm({
    "node_modules/underscore/modules/groupBy.js"() {
      init_group();
      init_has();
      groupBy_default = group(function(result2, value, key2) {
        if (has(result2, key2))
          result2[key2].push(value);
        else
          result2[key2] = [value];
      });
    }
  });

  // node_modules/underscore/modules/indexBy.js
  var indexBy_default;
  var init_indexBy = __esm({
    "node_modules/underscore/modules/indexBy.js"() {
      init_group();
      indexBy_default = group(function(result2, value, key2) {
        result2[key2] = value;
      });
    }
  });

  // node_modules/underscore/modules/countBy.js
  var countBy_default;
  var init_countBy = __esm({
    "node_modules/underscore/modules/countBy.js"() {
      init_group();
      init_has();
      countBy_default = group(function(result2, value, key2) {
        if (has(result2, key2))
          result2[key2]++;
        else
          result2[key2] = 1;
      });
    }
  });

  // node_modules/underscore/modules/partition.js
  var partition_default;
  var init_partition = __esm({
    "node_modules/underscore/modules/partition.js"() {
      init_group();
      partition_default = group(function(result2, value, pass) {
        result2[pass ? 0 : 1].push(value);
      }, true);
    }
  });

  // node_modules/underscore/modules/size.js
  function size(obj) {
    if (obj == null)
      return 0;
    return isArrayLike_default(obj) ? obj.length : keys(obj).length;
  }
  var init_size = __esm({
    "node_modules/underscore/modules/size.js"() {
      init_isArrayLike();
      init_keys();
    }
  });

  // node_modules/underscore/modules/_keyInObj.js
  function keyInObj(value, key2, obj) {
    return key2 in obj;
  }
  var init_keyInObj = __esm({
    "node_modules/underscore/modules/_keyInObj.js"() {
    }
  });

  // node_modules/underscore/modules/pick.js
  var pick_default;
  var init_pick = __esm({
    "node_modules/underscore/modules/pick.js"() {
      init_restArguments();
      init_isFunction();
      init_optimizeCb();
      init_allKeys();
      init_keyInObj();
      init_flatten();
      pick_default = restArguments(function(obj, keys2) {
        var result2 = {}, iteratee2 = keys2[0];
        if (obj == null)
          return result2;
        if (isFunction_default(iteratee2)) {
          if (keys2.length > 1)
            iteratee2 = optimizeCb(iteratee2, keys2[1]);
          keys2 = allKeys(obj);
        } else {
          iteratee2 = keyInObj;
          keys2 = flatten(keys2, false, false);
          obj = Object(obj);
        }
        for (var i2 = 0, length = keys2.length; i2 < length; i2++) {
          var key2 = keys2[i2];
          var value = obj[key2];
          if (iteratee2(value, key2, obj))
            result2[key2] = value;
        }
        return result2;
      });
    }
  });

  // node_modules/underscore/modules/omit.js
  var omit_default;
  var init_omit = __esm({
    "node_modules/underscore/modules/omit.js"() {
      init_restArguments();
      init_isFunction();
      init_negate();
      init_map();
      init_flatten();
      init_contains();
      init_pick();
      omit_default = restArguments(function(obj, keys2) {
        var iteratee2 = keys2[0], context;
        if (isFunction_default(iteratee2)) {
          iteratee2 = negate(iteratee2);
          if (keys2.length > 1)
            context = keys2[1];
        } else {
          keys2 = map(flatten(keys2, false, false), String);
          iteratee2 = function(value, key2) {
            return !contains(keys2, key2);
          };
        }
        return pick_default(obj, iteratee2, context);
      });
    }
  });

  // node_modules/underscore/modules/initial.js
  function initial(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  }
  var init_initial = __esm({
    "node_modules/underscore/modules/initial.js"() {
      init_setup();
    }
  });

  // node_modules/underscore/modules/first.js
  function first(array, n, guard) {
    if (array == null || array.length < 1)
      return n == null || guard ? void 0 : [];
    if (n == null || guard)
      return array[0];
    return initial(array, array.length - n);
  }
  var init_first = __esm({
    "node_modules/underscore/modules/first.js"() {
      init_initial();
    }
  });

  // node_modules/underscore/modules/rest.js
  function rest(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  }
  var init_rest = __esm({
    "node_modules/underscore/modules/rest.js"() {
      init_setup();
    }
  });

  // node_modules/underscore/modules/last.js
  function last(array, n, guard) {
    if (array == null || array.length < 1)
      return n == null || guard ? void 0 : [];
    if (n == null || guard)
      return array[array.length - 1];
    return rest(array, Math.max(0, array.length - n));
  }
  var init_last = __esm({
    "node_modules/underscore/modules/last.js"() {
      init_rest();
    }
  });

  // node_modules/underscore/modules/compact.js
  function compact(array) {
    return filter(array, Boolean);
  }
  var init_compact = __esm({
    "node_modules/underscore/modules/compact.js"() {
      init_filter();
    }
  });

  // node_modules/underscore/modules/flatten.js
  function flatten2(array, depth) {
    return flatten(array, depth, false);
  }
  var init_flatten2 = __esm({
    "node_modules/underscore/modules/flatten.js"() {
      init_flatten();
    }
  });

  // node_modules/underscore/modules/difference.js
  var difference_default;
  var init_difference = __esm({
    "node_modules/underscore/modules/difference.js"() {
      init_restArguments();
      init_flatten();
      init_filter();
      init_contains();
      difference_default = restArguments(function(array, rest2) {
        rest2 = flatten(rest2, true, true);
        return filter(array, function(value) {
          return !contains(rest2, value);
        });
      });
    }
  });

  // node_modules/underscore/modules/without.js
  var without_default;
  var init_without = __esm({
    "node_modules/underscore/modules/without.js"() {
      init_restArguments();
      init_difference();
      without_default = restArguments(function(array, otherArrays) {
        return difference_default(array, otherArrays);
      });
    }
  });

  // node_modules/underscore/modules/uniq.js
  function uniq(array, isSorted, iteratee2, context) {
    if (!isBoolean(isSorted)) {
      context = iteratee2;
      iteratee2 = isSorted;
      isSorted = false;
    }
    if (iteratee2 != null)
      iteratee2 = cb(iteratee2, context);
    var result2 = [];
    var seen = [];
    for (var i2 = 0, length = getLength_default(array); i2 < length; i2++) {
      var value = array[i2], computed = iteratee2 ? iteratee2(value, i2, array) : value;
      if (isSorted && !iteratee2) {
        if (!i2 || seen !== computed)
          result2.push(value);
        seen = computed;
      } else if (iteratee2) {
        if (!contains(seen, computed)) {
          seen.push(computed);
          result2.push(value);
        }
      } else if (!contains(result2, value)) {
        result2.push(value);
      }
    }
    return result2;
  }
  var init_uniq = __esm({
    "node_modules/underscore/modules/uniq.js"() {
      init_isBoolean();
      init_cb();
      init_getLength();
      init_contains();
    }
  });

  // node_modules/underscore/modules/union.js
  var union_default;
  var init_union = __esm({
    "node_modules/underscore/modules/union.js"() {
      init_restArguments();
      init_uniq();
      init_flatten();
      union_default = restArguments(function(arrays) {
        return uniq(flatten(arrays, true, true));
      });
    }
  });

  // node_modules/underscore/modules/intersection.js
  function intersection(array) {
    var result2 = [];
    var argsLength = arguments.length;
    for (var i2 = 0, length = getLength_default(array); i2 < length; i2++) {
      var item = array[i2];
      if (contains(result2, item))
        continue;
      var j;
      for (j = 1; j < argsLength; j++) {
        if (!contains(arguments[j], item))
          break;
      }
      if (j === argsLength)
        result2.push(item);
    }
    return result2;
  }
  var init_intersection = __esm({
    "node_modules/underscore/modules/intersection.js"() {
      init_getLength();
      init_contains();
    }
  });

  // node_modules/underscore/modules/unzip.js
  function unzip(array) {
    var length = array && max(array, getLength_default).length || 0;
    var result2 = Array(length);
    for (var index = 0; index < length; index++) {
      result2[index] = pluck(array, index);
    }
    return result2;
  }
  var init_unzip = __esm({
    "node_modules/underscore/modules/unzip.js"() {
      init_max();
      init_getLength();
      init_pluck();
    }
  });

  // node_modules/underscore/modules/zip.js
  var zip_default;
  var init_zip = __esm({
    "node_modules/underscore/modules/zip.js"() {
      init_restArguments();
      init_unzip();
      zip_default = restArguments(unzip);
    }
  });

  // node_modules/underscore/modules/object.js
  function object(list, values2) {
    var result2 = {};
    for (var i2 = 0, length = getLength_default(list); i2 < length; i2++) {
      if (values2) {
        result2[list[i2]] = values2[i2];
      } else {
        result2[list[i2][0]] = list[i2][1];
      }
    }
    return result2;
  }
  var init_object = __esm({
    "node_modules/underscore/modules/object.js"() {
      init_getLength();
    }
  });

  // node_modules/underscore/modules/range.js
  function range(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    if (!step) {
      step = stop < start ? -1 : 1;
    }
    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range2 = Array(length);
    for (var idx = 0; idx < length; idx++, start += step) {
      range2[idx] = start;
    }
    return range2;
  }
  var init_range = __esm({
    "node_modules/underscore/modules/range.js"() {
    }
  });

  // node_modules/underscore/modules/chunk.js
  function chunk(array, count) {
    if (count == null || count < 1)
      return [];
    var result2 = [];
    var i2 = 0, length = array.length;
    while (i2 < length) {
      result2.push(slice.call(array, i2, i2 += count));
    }
    return result2;
  }
  var init_chunk = __esm({
    "node_modules/underscore/modules/chunk.js"() {
      init_setup();
    }
  });

  // node_modules/underscore/modules/_chainResult.js
  function chainResult(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  }
  var init_chainResult = __esm({
    "node_modules/underscore/modules/_chainResult.js"() {
      init_underscore();
    }
  });

  // node_modules/underscore/modules/mixin.js
  function mixin(obj) {
    each(functions(obj), function(name) {
      var func2 = _[name] = obj[name];
      _.prototype[name] = function() {
        var args2 = [this._wrapped];
        push.apply(args2, arguments);
        return chainResult(this, func2.apply(_, args2));
      };
    });
    return _;
  }
  var init_mixin = __esm({
    "node_modules/underscore/modules/mixin.js"() {
      init_underscore();
      init_each();
      init_functions();
      init_setup();
      init_chainResult();
    }
  });

  // node_modules/underscore/modules/underscore-array-methods.js
  var underscore_array_methods_default;
  var init_underscore_array_methods = __esm({
    "node_modules/underscore/modules/underscore-array-methods.js"() {
      init_underscore();
      init_each();
      init_setup();
      init_chainResult();
      each(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function(name) {
        var method = ArrayProto[name];
        _.prototype[name] = function() {
          var obj = this._wrapped;
          if (obj != null) {
            method.apply(obj, arguments);
            if ((name === "shift" || name === "splice") && obj.length === 0) {
              delete obj[0];
            }
          }
          return chainResult(this, obj);
        };
      });
      each(["concat", "join", "slice"], function(name) {
        var method = ArrayProto[name];
        _.prototype[name] = function() {
          var obj = this._wrapped;
          if (obj != null)
            obj = method.apply(obj, arguments);
          return chainResult(this, obj);
        };
      });
      underscore_array_methods_default = _;
    }
  });

  // node_modules/underscore/modules/index.js
  var modules_exports = {};
  __export(modules_exports, {
    VERSION: () => VERSION,
    after: () => after,
    all: () => every,
    allKeys: () => allKeys,
    any: () => some,
    assign: () => extendOwn_default,
    before: () => before,
    bind: () => bind_default,
    bindAll: () => bindAll_default,
    chain: () => chain,
    chunk: () => chunk,
    clone: () => clone,
    collect: () => map,
    compact: () => compact,
    compose: () => compose,
    constant: () => constant,
    contains: () => contains,
    countBy: () => countBy_default,
    create: () => create,
    debounce: () => debounce,
    default: () => underscore_array_methods_default,
    defaults: () => defaults_default,
    defer: () => defer_default,
    delay: () => delay_default,
    detect: () => find,
    difference: () => difference_default,
    drop: () => rest,
    each: () => each,
    escape: () => escape_default,
    every: () => every,
    extend: () => extend_default,
    extendOwn: () => extendOwn_default,
    filter: () => filter,
    find: () => find,
    findIndex: () => findIndex_default,
    findKey: () => findKey,
    findLastIndex: () => findLastIndex_default,
    findWhere: () => findWhere,
    first: () => first,
    flatten: () => flatten2,
    foldl: () => reduce_default,
    foldr: () => reduceRight_default,
    forEach: () => each,
    functions: () => functions,
    get: () => get,
    groupBy: () => groupBy_default,
    has: () => has2,
    head: () => first,
    identity: () => identity,
    include: () => contains,
    includes: () => contains,
    indexBy: () => indexBy_default,
    indexOf: () => indexOf_default,
    initial: () => initial,
    inject: () => reduce_default,
    intersection: () => intersection,
    invert: () => invert,
    invoke: () => invoke_default,
    isArguments: () => isArguments_default,
    isArray: () => isArray_default,
    isArrayBuffer: () => isArrayBuffer_default,
    isBoolean: () => isBoolean,
    isDataView: () => isDataView_default,
    isDate: () => isDate_default,
    isElement: () => isElement,
    isEmpty: () => isEmpty,
    isEqual: () => isEqual,
    isError: () => isError_default,
    isFinite: () => isFinite2,
    isFunction: () => isFunction_default,
    isMap: () => isMap_default,
    isMatch: () => isMatch,
    isNaN: () => isNaN2,
    isNull: () => isNull,
    isNumber: () => isNumber_default,
    isObject: () => isObject,
    isRegExp: () => isRegExp_default,
    isSet: () => isSet_default,
    isString: () => isString_default,
    isSymbol: () => isSymbol_default,
    isTypedArray: () => isTypedArray_default,
    isUndefined: () => isUndefined,
    isWeakMap: () => isWeakMap_default,
    isWeakSet: () => isWeakSet_default,
    iteratee: () => iteratee,
    keys: () => keys,
    last: () => last,
    lastIndexOf: () => lastIndexOf_default,
    map: () => map,
    mapObject: () => mapObject,
    matcher: () => matcher,
    matches: () => matcher,
    max: () => max,
    memoize: () => memoize,
    methods: () => functions,
    min: () => min,
    mixin: () => mixin,
    negate: () => negate,
    noop: () => noop,
    now: () => now_default,
    object: () => object,
    omit: () => omit_default,
    once: () => once_default,
    pairs: () => pairs,
    partial: () => partial_default,
    partition: () => partition_default,
    pick: () => pick_default,
    pluck: () => pluck,
    property: () => property,
    propertyOf: () => propertyOf,
    random: () => random,
    range: () => range,
    reduce: () => reduce_default,
    reduceRight: () => reduceRight_default,
    reject: () => reject,
    rest: () => rest,
    restArguments: () => restArguments,
    result: () => result,
    sample: () => sample,
    select: () => filter,
    shuffle: () => shuffle,
    size: () => size,
    some: () => some,
    sortBy: () => sortBy,
    sortedIndex: () => sortedIndex,
    tail: () => rest,
    take: () => first,
    tap: () => tap,
    template: () => template,
    templateSettings: () => templateSettings_default,
    throttle: () => throttle,
    times: () => times,
    toArray: () => toArray,
    toPath: () => toPath,
    transpose: () => unzip,
    unescape: () => unescape_default,
    union: () => union_default,
    uniq: () => uniq,
    unique: () => uniq,
    uniqueId: () => uniqueId,
    unzip: () => unzip,
    values: () => values,
    where: () => where,
    without: () => without_default,
    wrap: () => wrap,
    zip: () => zip_default
  });
  var init_modules = __esm({
    "node_modules/underscore/modules/index.js"() {
      init_setup();
      init_restArguments();
      init_isObject();
      init_isNull();
      init_isUndefined();
      init_isBoolean();
      init_isElement();
      init_isString();
      init_isNumber();
      init_isDate();
      init_isRegExp();
      init_isError();
      init_isSymbol();
      init_isArrayBuffer();
      init_isDataView();
      init_isArray();
      init_isFunction();
      init_isArguments();
      init_isFinite();
      init_isNaN();
      init_isTypedArray();
      init_isEmpty();
      init_isMatch();
      init_isEqual();
      init_isMap();
      init_isWeakMap();
      init_isSet();
      init_isWeakSet();
      init_keys();
      init_allKeys();
      init_values();
      init_pairs();
      init_invert();
      init_functions();
      init_extend();
      init_extendOwn();
      init_defaults();
      init_create();
      init_clone();
      init_tap();
      init_get();
      init_has2();
      init_mapObject();
      init_identity();
      init_constant();
      init_noop();
      init_toPath();
      init_property();
      init_propertyOf();
      init_matcher();
      init_times();
      init_random();
      init_now();
      init_escape();
      init_unescape();
      init_templateSettings();
      init_template();
      init_result();
      init_uniqueId();
      init_chain();
      init_iteratee();
      init_partial();
      init_bind();
      init_bindAll();
      init_memoize();
      init_delay();
      init_defer();
      init_throttle();
      init_debounce();
      init_wrap();
      init_negate();
      init_compose();
      init_after();
      init_before();
      init_once();
      init_findKey();
      init_findIndex();
      init_findLastIndex();
      init_sortedIndex();
      init_indexOf();
      init_lastIndexOf();
      init_find();
      init_findWhere();
      init_each();
      init_map();
      init_reduce();
      init_reduceRight();
      init_filter();
      init_reject();
      init_every();
      init_some();
      init_contains();
      init_invoke();
      init_pluck();
      init_where();
      init_max();
      init_min();
      init_shuffle();
      init_sample();
      init_sortBy();
      init_groupBy();
      init_indexBy();
      init_countBy();
      init_partition();
      init_toArray();
      init_size();
      init_pick();
      init_omit();
      init_first();
      init_initial();
      init_last();
      init_rest();
      init_compact();
      init_flatten2();
      init_without();
      init_uniq();
      init_union();
      init_intersection();
      init_difference();
      init_unzip();
      init_zip();
      init_object();
      init_range();
      init_chunk();
      init_mixin();
      init_underscore_array_methods();
    }
  });

  // node_modules/underscore/modules/index-default.js
  var _2, index_default_default;
  var init_index_default = __esm({
    "node_modules/underscore/modules/index-default.js"() {
      init_modules();
      init_modules();
      _2 = mixin(modules_exports);
      _2._ = _2;
      index_default_default = _2;
    }
  });

  // node_modules/underscore/modules/index-all.js
  var index_all_exports = {};
  __export(index_all_exports, {
    VERSION: () => VERSION,
    after: () => after,
    all: () => every,
    allKeys: () => allKeys,
    any: () => some,
    assign: () => extendOwn_default,
    before: () => before,
    bind: () => bind_default,
    bindAll: () => bindAll_default,
    chain: () => chain,
    chunk: () => chunk,
    clone: () => clone,
    collect: () => map,
    compact: () => compact,
    compose: () => compose,
    constant: () => constant,
    contains: () => contains,
    countBy: () => countBy_default,
    create: () => create,
    debounce: () => debounce,
    default: () => index_default_default,
    defaults: () => defaults_default,
    defer: () => defer_default,
    delay: () => delay_default,
    detect: () => find,
    difference: () => difference_default,
    drop: () => rest,
    each: () => each,
    escape: () => escape_default,
    every: () => every,
    extend: () => extend_default,
    extendOwn: () => extendOwn_default,
    filter: () => filter,
    find: () => find,
    findIndex: () => findIndex_default,
    findKey: () => findKey,
    findLastIndex: () => findLastIndex_default,
    findWhere: () => findWhere,
    first: () => first,
    flatten: () => flatten2,
    foldl: () => reduce_default,
    foldr: () => reduceRight_default,
    forEach: () => each,
    functions: () => functions,
    get: () => get,
    groupBy: () => groupBy_default,
    has: () => has2,
    head: () => first,
    identity: () => identity,
    include: () => contains,
    includes: () => contains,
    indexBy: () => indexBy_default,
    indexOf: () => indexOf_default,
    initial: () => initial,
    inject: () => reduce_default,
    intersection: () => intersection,
    invert: () => invert,
    invoke: () => invoke_default,
    isArguments: () => isArguments_default,
    isArray: () => isArray_default,
    isArrayBuffer: () => isArrayBuffer_default,
    isBoolean: () => isBoolean,
    isDataView: () => isDataView_default,
    isDate: () => isDate_default,
    isElement: () => isElement,
    isEmpty: () => isEmpty,
    isEqual: () => isEqual,
    isError: () => isError_default,
    isFinite: () => isFinite2,
    isFunction: () => isFunction_default,
    isMap: () => isMap_default,
    isMatch: () => isMatch,
    isNaN: () => isNaN2,
    isNull: () => isNull,
    isNumber: () => isNumber_default,
    isObject: () => isObject,
    isRegExp: () => isRegExp_default,
    isSet: () => isSet_default,
    isString: () => isString_default,
    isSymbol: () => isSymbol_default,
    isTypedArray: () => isTypedArray_default,
    isUndefined: () => isUndefined,
    isWeakMap: () => isWeakMap_default,
    isWeakSet: () => isWeakSet_default,
    iteratee: () => iteratee,
    keys: () => keys,
    last: () => last,
    lastIndexOf: () => lastIndexOf_default,
    map: () => map,
    mapObject: () => mapObject,
    matcher: () => matcher,
    matches: () => matcher,
    max: () => max,
    memoize: () => memoize,
    methods: () => functions,
    min: () => min,
    mixin: () => mixin,
    negate: () => negate,
    noop: () => noop,
    now: () => now_default,
    object: () => object,
    omit: () => omit_default,
    once: () => once_default,
    pairs: () => pairs,
    partial: () => partial_default,
    partition: () => partition_default,
    pick: () => pick_default,
    pluck: () => pluck,
    property: () => property,
    propertyOf: () => propertyOf,
    random: () => random,
    range: () => range,
    reduce: () => reduce_default,
    reduceRight: () => reduceRight_default,
    reject: () => reject,
    rest: () => rest,
    restArguments: () => restArguments,
    result: () => result,
    sample: () => sample,
    select: () => filter,
    shuffle: () => shuffle,
    size: () => size,
    some: () => some,
    sortBy: () => sortBy,
    sortedIndex: () => sortedIndex,
    tail: () => rest,
    take: () => first,
    tap: () => tap,
    template: () => template,
    templateSettings: () => templateSettings_default,
    throttle: () => throttle,
    times: () => times,
    toArray: () => toArray,
    toPath: () => toPath,
    transpose: () => unzip,
    unescape: () => unescape_default,
    union: () => union_default,
    uniq: () => uniq,
    unique: () => uniq,
    uniqueId: () => uniqueId,
    unzip: () => unzip,
    values: () => values,
    where: () => where,
    without: () => without_default,
    wrap: () => wrap,
    zip: () => zip_default
  });
  var init_index_all = __esm({
    "node_modules/underscore/modules/index-all.js"() {
      init_index_default();
      init_modules();
    }
  });

  // node_modules/logic-solver/minisat_wrapper.js
  var require_minisat_wrapper = __commonJS({
    "node_modules/logic-solver/minisat_wrapper.js"(exports2, module2) {
      var C_MINISAT2 = require_minisat();
      var _3 = (init_index_all(), __toCommonJS(index_all_exports));
      var MiniSat;
      MiniSat = function() {
        var C = this._C = C_MINISAT2();
        this._native = {
          getStackPointer: function() {
            return C.Runtime.stackSave();
          },
          setStackPointer: function(ptr) {
            C.Runtime.stackRestore(ptr);
          },
          allocateBytes: function(len) {
            return C.allocate(len, "i8", C.ALLOC_STACK);
          },
          pushString: function(str) {
            return this.allocateBytes(C.intArrayFromString(str));
          },
          savingStack: function(func2) {
            var SP = this.getStackPointer();
            try {
              return func2(this, C);
            } finally {
              this.setStackPointer(SP);
            }
          }
        };
        C._createTheSolver();
        this._clauses = [];
      };
      MiniSat.prototype.ensureVar = function(v) {
        this._C._ensureVar(v);
      };
      MiniSat.prototype.addClause = function(terms) {
        this._clauses.push(terms);
        return this._native.savingStack(function(native, C) {
          var termsPtr = C.allocate((terms.length + 1) * 4, "i32", C.ALLOC_STACK);
          _3.each(terms, function(t, i2) {
            C.setValue(termsPtr + i2 * 4, t, "i32");
          });
          C.setValue(termsPtr + terms.length * 4, 0, "i32");
          return C._addClause(termsPtr) ? true : false;
        });
      };
      MiniSat.prototype.solve = function() {
        return this._C._solve() ? true : false;
      };
      MiniSat.prototype.solveAssuming = function(v) {
        return this._C._solveAssuming(v) ? true : false;
      };
      MiniSat.prototype.getSolution = function() {
        var solution = [null];
        var C = this._C;
        var numVars = C._getNumVars();
        var solPtr = C._getSolution();
        for (var i2 = 0; i2 < numVars; i2++) {
          solution[i2 + 1] = C.getValue(solPtr + i2, "i8") === 0;
        }
        return solution;
      };
      MiniSat.prototype.retireVar = function(v) {
        this._C._retireVar(v);
      };
      MiniSat.prototype.getConflictClause = function() {
        var C = this._C;
        var numTerms = C._getConflictClauseSize();
        var clausePtr = C._getConflictClause();
        var terms = [];
        for (var i2 = 0; i2 < numTerms; i2++) {
          var t = C.getValue(clausePtr + i2 * 4, "i32");
          var v = t >>> 1;
          var s = t & 1 ? -1 : 1;
          terms[i2] = v * s;
        }
        return terms;
      };
      module2.exports = MiniSat;
    }
  });

  // node_modules/logic-solver/logic-solver.js
  var require_logic_solver = __commonJS({
    "node_modules/logic-solver/logic-solver.js"(exports2, module2) {
      var MiniSat = require_minisat_wrapper();
      var _3 = (init_index_all(), __toCommonJS(index_all_exports));
      var Logic;
      Logic = {};
      var withDescription = function(description, tester) {
        tester.description = description;
        return tester;
      };
      var lazyInstanceofTester = function(description, obj, constructorName) {
        return withDescription(description, function(x) {
          return x instanceof obj[constructorName];
        });
      };
      Logic.isNumTerm = withDescription(
        "a NumTerm (non-zero integer)",
        function(x) {
          return x === (x | 0) && x !== 0;
        }
      );
      Logic.isNameTerm = withDescription(
        "a NameTerm (string)",
        function(x) {
          return typeof x === "string" && !/^-*[0-9]*$/.test(x);
        }
      );
      Logic.isTerm = withDescription(
        "a Term (appropriate string or number)",
        function(x) {
          return Logic.isNumTerm(x) || Logic.isNameTerm(x);
        }
      );
      Logic.isWholeNumber = withDescription(
        "a whole number (integer >= 0)",
        function(x) {
          return x === (x | 0) && x >= 0;
        }
      );
      Logic.isFormula = lazyInstanceofTester("a Formula", Logic, "Formula");
      Logic.isClause = lazyInstanceofTester("a Clause", Logic, "Clause");
      Logic.isBits = lazyInstanceofTester("a Bits", Logic, "Bits");
      Logic._isInteger = withDescription(
        "an integer",
        function(x) {
          return x === (x | 0);
        }
      );
      Logic._isFunction = withDescription(
        "a Function",
        function(x) {
          return typeof x === "function";
        }
      );
      Logic._isString = withDescription(
        "a String",
        function(x) {
          return typeof x === "string";
        }
      );
      Logic._isArrayWhere = function(tester) {
        var description = "an array";
        if (tester.description) {
          description += " of " + tester.description;
        }
        return withDescription(description, function(x) {
          if (!_3.isArray(x)) {
            return false;
          } else {
            for (var i2 = 0; i2 < x.length; i2++) {
              if (!tester(x[i2])) {
                return false;
              }
            }
            return true;
          }
        });
      };
      Logic._isFormulaOrTerm = withDescription(
        "a Formula or Term",
        function(x) {
          return Logic.isFormula(x) || Logic.isTerm(x);
        }
      );
      Logic._isFormulaOrTermOrBits = withDescription(
        "a Formula, Term, or Bits",
        function(x) {
          return Logic.isFormula(x) || Logic.isBits(x) || Logic.isTerm(x);
        }
      );
      Logic._MiniSat = MiniSat;
      var isInteger = Logic._isInteger;
      var isFunction2 = Logic._isFunction;
      var isString = Logic._isString;
      var isArrayWhere = Logic._isArrayWhere;
      var isFormulaOrTerm = Logic._isFormulaOrTerm;
      var isFormulaOrTermOrBits = Logic._isFormulaOrTermOrBits;
      Logic._assert = function(value, tester, description) {
        if (!tester(value)) {
          var displayValue = typeof value === "string" ? JSON.stringify(value) : value;
          throw new Error(displayValue + " is not " + (tester.description || description));
        }
      };
      var assertNumArgs = function(actual, expected, funcName) {
        if (actual !== expected) {
          throw new Error("Expected " + expected + " args in " + funcName + ", got " + actual);
        }
      };
      var assert2 = Logic._assert;
      Logic._assertIfEnabled = function(value, tester, description) {
        if (assert2)
          assert2(value, tester, description);
      };
      Logic.disablingAssertions = function(f) {
        var oldAssert = assert2;
        try {
          assert2 = null;
          return f();
        } finally {
          assert2 = oldAssert;
        }
      };
      Logic._disablingTypeChecks = Logic.disablingAssertions;
      Logic.not = function(operand) {
        if (assert2)
          assert2(operand, isFormulaOrTerm);
        if (operand instanceof Logic.Formula) {
          return new Logic.NotFormula(operand);
        } else {
          if (typeof operand === "number") {
            return -operand;
          } else if (operand.charAt(0) === "-") {
            return operand.slice(1);
          } else {
            return "-" + operand;
          }
        }
      };
      Logic.NAME_FALSE = "$F";
      Logic.NAME_TRUE = "$T";
      Logic.NUM_FALSE = 1;
      Logic.NUM_TRUE = 2;
      Logic.TRUE = Logic.NAME_TRUE;
      Logic.FALSE = Logic.NAME_FALSE;
      Logic.Formula = function() {
      };
      Logic._defineFormula = function(constructor, typeName, methods) {
        if (assert2)
          assert2(constructor, isFunction2);
        if (assert2)
          assert2(typeName, isString);
        constructor.prototype = new Logic.Formula();
        constructor.prototype.type = typeName;
        if (methods) {
          _3.extend(constructor.prototype, methods);
        }
      };
      Logic.Formula.prototype.generateClauses = function(isTrue, termifier) {
        throw new Error("Cannot generate this Formula; it must be expanded");
      };
      Logic.Formula._nextGuid = 1;
      Logic.Formula.prototype._guid = null;
      Logic.Formula.prototype.guid = function() {
        if (this._guid === null) {
          this._guid = Logic.Formula._nextGuid++;
        }
        return this._guid;
      };
      Logic.Clause = function() {
        var terms = _3.flatten(arguments);
        if (assert2)
          assert2(terms, isArrayWhere(Logic.isNumTerm));
        this.terms = terms;
      };
      Logic.Clause.prototype.append = function() {
        return new Logic.Clause(this.terms.concat(_3.flatten(arguments)));
      };
      var FormulaInfo = function() {
        this.varName = null;
        this.varNum = null;
        this.occursPositively = false;
        this.occursNegatively = false;
        this.isRequired = false;
        this.isForbidden = false;
      };
      Logic.Termifier = function(solver) {
        this.solver = solver;
      };
      Logic.Termifier.prototype.clause = function() {
        var self2 = this;
        var formulas = _3.flatten(arguments);
        if (assert2)
          assert2(formulas, isArrayWhere(isFormulaOrTerm));
        return new Logic.Clause(_3.map(formulas, function(f) {
          return self2.term(f);
        }));
      };
      Logic.Termifier.prototype.term = function(formula) {
        return this.solver._formulaToTerm(formula);
      };
      Logic.Termifier.prototype.generate = function(isTrue, formula) {
        return this.solver._generateFormula(isTrue, formula, this);
      };
      Logic.Solver = function() {
        var self2 = this;
        self2.clauses = [];
        self2._num2name = [null];
        self2._name2num = {};
        var F = self2.getVarNum(Logic.NAME_FALSE, false, true);
        var T = self2.getVarNum(Logic.NAME_TRUE, false, true);
        if (F !== Logic.NUM_FALSE || T !== Logic.NUM_TRUE) {
          throw new Error("Assertion failure: $T and $F have wrong numeric value");
        }
        self2._F_used = false;
        self2._T_used = false;
        self2.clauses.push(new Logic.Clause(-Logic.NUM_FALSE));
        self2.clauses.push(new Logic.Clause(Logic.NUM_TRUE));
        self2._formulaInfo = {};
        self2._nextFormulaNumByType = {};
        self2._ungeneratedFormulas = {};
        self2._numClausesAddedToMiniSat = 0;
        self2._unsat = false;
        self2._minisat = new MiniSat();
        self2._termifier = new Logic.Termifier(self2);
      };
      Logic.Solver.prototype.getVarNum = function(vname, noCreate, _createInternals) {
        var key2 = " " + vname;
        if (_3.has(this._name2num, key2)) {
          return this._name2num[key2];
        } else if (noCreate) {
          return 0;
        } else {
          if (vname.charAt(0) === "$" && !_createInternals) {
            throw new Error("Only generated variable names can start with $");
          }
          var vnum = this._num2name.length;
          this._name2num[key2] = vnum;
          this._num2name.push(vname);
          return vnum;
        }
      };
      Logic.Solver.prototype.getVarName = function(vnum) {
        if (assert2)
          assert2(vnum, isInteger);
        var num2name = this._num2name;
        if (vnum < 1 || vnum >= num2name.length) {
          throw new Error("Bad variable num: " + vnum);
        } else {
          return num2name[vnum];
        }
      };
      Logic.Solver.prototype.toNumTerm = function(t, noCreate) {
        var self2 = this;
        if (assert2)
          assert2(t, Logic.isTerm);
        if (typeof t === "number") {
          return t;
        } else {
          var not = false;
          while (t.charAt(0) === "-") {
            t = t.slice(1);
            not = !not;
          }
          var n = self2.getVarNum(t, noCreate);
          if (!n) {
            return 0;
          } else {
            return not ? -n : n;
          }
        }
      };
      Logic.Solver.prototype.toNameTerm = function(t) {
        var self2 = this;
        if (assert2)
          assert2(t, Logic.isTerm);
        if (typeof t === "string") {
          while (t.slice(0, 2) === "--") {
            t = t.slice(2);
          }
          return t;
        } else {
          var not = false;
          if (t < 0) {
            not = true;
            t = -t;
          }
          t = self2.getVarName(t);
          if (not) {
            t = "-" + t;
          }
          return t;
        }
      };
      Logic.Solver.prototype._addClause = function(cls, _extraTerms, _useTermOverride) {
        var self2 = this;
        if (assert2)
          assert2(cls, Logic.isClause);
        var extraTerms = null;
        if (_extraTerms) {
          extraTerms = _extraTerms;
          if (assert2)
            assert2(extraTerms, isArrayWhere(Logic.isNumTerm));
        }
        var usedF = false;
        var usedT = false;
        var numRealTerms = cls.terms.length;
        if (extraTerms) {
          cls = cls.append(extraTerms);
        }
        for (var i2 = 0; i2 < cls.terms.length; i2++) {
          var t = cls.terms[i2];
          var v = t < 0 ? -t : t;
          if (v === Logic.NUM_FALSE) {
            usedF = true;
          } else if (v === Logic.NUM_TRUE) {
            usedT = true;
          } else if (v < 1 || v >= self2._num2name.length) {
            throw new Error("Bad variable number: " + v);
          } else if (i2 < numRealTerms) {
            if (_useTermOverride) {
              _useTermOverride(t);
            } else {
              self2._useFormulaTerm(t);
            }
          }
        }
        this._F_used = this._F_used || usedF;
        this._T_used = this._T_used || usedT;
        this.clauses.push(cls);
      };
      Logic.Solver.prototype._useFormulaTerm = function(t, _addClausesOverride) {
        var self2 = this;
        if (assert2)
          assert2(t, Logic.isNumTerm);
        var v = t < 0 ? -t : t;
        if (!_3.has(self2._ungeneratedFormulas, v)) {
          return;
        }
        var formula = self2._ungeneratedFormulas[v];
        var info = self2._getFormulaInfo(formula);
        var positive = t > 0;
        var deferredAddClauses = null;
        var addClauses;
        if (!_addClausesOverride) {
          deferredAddClauses = [];
          addClauses = function(clauses2, extraTerms) {
            deferredAddClauses.push({
              clauses: clauses2,
              extraTerms
            });
          };
        } else {
          addClauses = _addClausesOverride;
        }
        if (positive && !info.occursPositively) {
          info.occursPositively = true;
          var clauses = self2._generateFormula(true, formula);
          addClauses(clauses, [-v]);
        } else if (!positive && !info.occursNegatively) {
          info.occursNegatively = true;
          var clauses = self2._generateFormula(false, formula);
          addClauses(clauses, [v]);
        }
        if (info.occursPositively && info.occursNegatively) {
          delete self2._ungeneratedFormulas[v];
        }
        if (!(deferredAddClauses && deferredAddClauses.length)) {
          return;
        }
        var useTerm = function(t2) {
          self2._useFormulaTerm(t2, addClauses);
        };
        while (deferredAddClauses.length) {
          var next = deferredAddClauses.pop();
          self2._addClauses(next.clauses, next.extraTerms, useTerm);
        }
      };
      Logic.Solver.prototype._addClauses = function(array, _extraTerms, _useTermOverride) {
        if (assert2)
          assert2(array, isArrayWhere(Logic.isClause));
        var self2 = this;
        _3.each(array, function(cls) {
          self2._addClause(cls, _extraTerms, _useTermOverride);
        });
      };
      Logic.Solver.prototype.require = function() {
        this._requireForbidImpl(true, _3.flatten(arguments));
      };
      Logic.Solver.prototype.forbid = function() {
        this._requireForbidImpl(false, _3.flatten(arguments));
      };
      Logic.Solver.prototype._requireForbidImpl = function(isRequire, formulas) {
        var self2 = this;
        if (assert2)
          assert2(formulas, isArrayWhere(isFormulaOrTerm));
        _3.each(formulas, function(f) {
          if (f instanceof Logic.NotFormula) {
            self2._requireForbidImpl(!isRequire, [f.operand]);
          } else if (f instanceof Logic.Formula) {
            var info = self2._getFormulaInfo(f);
            if (info.varNum !== null) {
              var sign = isRequire ? 1 : -1;
              self2._addClause(new Logic.Clause(sign * info.varNum));
            } else {
              self2._addClauses(self2._generateFormula(isRequire, f));
            }
            if (isRequire) {
              info.isRequired = true;
            } else {
              info.isForbidden = true;
            }
          } else {
            self2._addClauses(self2._generateFormula(isRequire, f));
          }
        });
      };
      Logic.Solver.prototype._generateFormula = function(isTrue, formula, _termifier) {
        var self2 = this;
        if (assert2)
          assert2(formula, isFormulaOrTerm);
        if (formula instanceof Logic.NotFormula) {
          return self2._generateFormula(!isTrue, formula.operand);
        } else if (formula instanceof Logic.Formula) {
          var info = self2._getFormulaInfo(formula);
          if (isTrue && info.isRequired || !isTrue && info.isForbidden) {
            return [];
          } else if (isTrue && info.isForbidden || !isTrue && info.isRequired) {
            return [new Logic.Clause()];
          } else {
            var ret = formula.generateClauses(
              isTrue,
              _termifier || self2._termifier
            );
            return _3.isArray(ret) ? ret : [ret];
          }
        } else {
          var t = self2.toNumTerm(formula);
          var sign = isTrue ? 1 : -1;
          if (t === sign * Logic.NUM_TRUE || t === -sign * Logic.NUM_FALSE) {
            return [];
          } else if (t === sign * Logic.NUM_FALSE || t === -sign * Logic.NUM_TRUE) {
            return [new Logic.Clause()];
          } else {
            return [new Logic.Clause(sign * t)];
          }
        }
      };
      Logic.Solver.prototype._clauseData = function() {
        var clauses = _3.pluck(this.clauses, "terms");
        if (!this._T_used) {
          clauses.splice(1, 1);
        }
        if (!this._F_used) {
          clauses.splice(0, 1);
        }
        return clauses;
      };
      Logic.Solver.prototype._clauseStrings = function() {
        var self2 = this;
        var clauseData = self2._clauseData();
        return _3.map(clauseData, function(clause) {
          return _3.map(clause, function(nterm) {
            var str = self2.toNameTerm(nterm);
            if (/\s/.test(str)) {
              var sign = "";
              if (str.charAt(0) === "-") {
                sign = "-";
                str = str.slice(1);
              }
              str = sign + '"' + str + '"';
            }
            return str;
          }).join(" v ");
        });
      };
      Logic.Solver.prototype._getFormulaInfo = function(formula, _noCreate) {
        var self2 = this;
        var guid = formula.guid();
        if (!self2._formulaInfo[guid]) {
          if (_noCreate) {
            return null;
          }
          self2._formulaInfo[guid] = new FormulaInfo();
        }
        return self2._formulaInfo[guid];
      };
      Logic.Solver.prototype._formulaToTerm = function(formula) {
        var self2 = this;
        if (_3.isArray(formula)) {
          if (assert2)
            assert2(formula, isArrayWhere(isFormulaOrTerm));
          return _3.map(formula, _3.bind(self2._formulaToTerm, self2));
        } else {
          if (assert2)
            assert2(formula, isFormulaOrTerm);
        }
        if (formula instanceof Logic.NotFormula) {
          return Logic.not(self2._formulaToTerm(formula.operand));
        } else if (formula instanceof Logic.Formula) {
          var info = this._getFormulaInfo(formula);
          if (info.isRequired) {
            return Logic.NUM_TRUE;
          } else if (info.isForbidden) {
            return Logic.NUM_FALSE;
          } else if (info.varNum === null) {
            var type2 = formula.type;
            if (!this._nextFormulaNumByType[type2]) {
              this._nextFormulaNumByType[type2] = 1;
            }
            var numForVarName = this._nextFormulaNumByType[type2]++;
            info.varName = "$" + formula.type + numForVarName;
            info.varNum = this.getVarNum(info.varName, false, true);
            this._ungeneratedFormulas[info.varNum] = formula;
          }
          return info.varNum;
        } else {
          return self2.toNumTerm(formula);
        }
      };
      Logic.or = function() {
        var args2 = _3.flatten(arguments);
        if (args2.length === 0) {
          return Logic.FALSE;
        } else if (args2.length === 1) {
          if (assert2)
            assert2(args2[0], isFormulaOrTerm);
          return args2[0];
        } else {
          return new Logic.OrFormula(args2);
        }
      };
      Logic.OrFormula = function(operands) {
        if (assert2)
          assert2(operands, isArrayWhere(isFormulaOrTerm));
        this.operands = operands;
      };
      Logic._defineFormula(Logic.OrFormula, "or", {
        generateClauses: function(isTrue, t) {
          if (isTrue) {
            return t.clause(this.operands);
          } else {
            var result2 = [];
            _3.each(this.operands, function(o) {
              result2.push.apply(result2, t.generate(false, o));
            });
            return result2;
          }
        }
      });
      Logic.NotFormula = function(operand) {
        if (assert2)
          assert2(operand, isFormulaOrTerm);
        this.operand = operand;
      };
      Logic._defineFormula(Logic.NotFormula, "not");
      Logic.and = function() {
        var args2 = _3.flatten(arguments);
        if (args2.length === 0) {
          return Logic.TRUE;
        } else if (args2.length === 1) {
          if (assert2)
            assert2(args2[0], isFormulaOrTerm);
          return args2[0];
        } else {
          return new Logic.AndFormula(args2);
        }
      };
      Logic.AndFormula = function(operands) {
        if (assert2)
          assert2(operands, isArrayWhere(isFormulaOrTerm));
        this.operands = operands;
      };
      Logic._defineFormula(Logic.AndFormula, "and", {
        generateClauses: function(isTrue, t) {
          if (isTrue) {
            var result2 = [];
            _3.each(this.operands, function(o) {
              result2.push.apply(result2, t.generate(true, o));
            });
            return result2;
          } else {
            return t.clause(_3.map(this.operands, Logic.not));
          }
        }
      });
      var group2 = function(array, N) {
        var ret = [];
        for (var i2 = 0; i2 < array.length; i2 += N) {
          ret.push(array.slice(i2, i2 + N));
        }
        return ret;
      };
      Logic.xor = function() {
        var args2 = _3.flatten(arguments);
        if (args2.length === 0) {
          return Logic.FALSE;
        } else if (args2.length === 1) {
          if (assert2)
            assert2(args2[0], isFormulaOrTerm);
          return args2[0];
        } else {
          return new Logic.XorFormula(args2);
        }
      };
      Logic.XorFormula = function(operands) {
        if (assert2)
          assert2(operands, isArrayWhere(isFormulaOrTerm));
        this.operands = operands;
      };
      Logic._defineFormula(Logic.XorFormula, "xor", {
        generateClauses: function(isTrue, t) {
          var args2 = this.operands;
          var not = Logic.not;
          if (args2.length > 3) {
            return t.generate(
              isTrue,
              Logic.xor(
                _3.map(group2(this.operands, 3), function(group3) {
                  return Logic.xor(group3);
                })
              )
            );
          } else if (isTrue) {
            if (args2.length === 0) {
              return t.clause();
            } else if (args2.length === 1) {
              return t.clause(args2[0]);
            } else if (args2.length === 2) {
              var A = args2[0], B = args2[1];
              return [
                t.clause(A, B),
                // A v B
                t.clause(not(A), not(B))
              ];
            } else if (args2.length === 3) {
              var A = args2[0], B = args2[1], C = args2[2];
              return [
                t.clause(A, B, C),
                // A v B v C
                t.clause(A, not(B), not(C)),
                // A v -B v -C
                t.clause(not(A), B, not(C)),
                // -A v B v -C
                t.clause(not(A), not(B), C)
              ];
            }
          } else {
            if (args2.length === 0) {
              return [];
            } else if (args2.length === 1) {
              return t.clause(not(args2[0]));
            } else if (args2.length === 2) {
              var A = args2[0], B = args2[1];
              return [
                t.clause(A, not(B)),
                // A v -B
                t.clause(not(A), B)
              ];
            } else if (args2.length === 3) {
              var A = args2[0], B = args2[1], C = args2[2];
              return [
                t.clause(not(A), not(B), not(C)),
                // -A v -B v -C
                t.clause(not(A), B, C),
                // -A v B v C
                t.clause(A, not(B), C),
                // A v -B v C
                t.clause(A, B, not(C))
              ];
            }
          }
        }
      });
      Logic.atMostOne = function() {
        var args2 = _3.flatten(arguments);
        if (args2.length <= 1) {
          return Logic.TRUE;
        } else {
          return new Logic.AtMostOneFormula(args2);
        }
      };
      Logic.AtMostOneFormula = function(operands) {
        if (assert2)
          assert2(operands, isArrayWhere(isFormulaOrTerm));
        this.operands = operands;
      };
      Logic._defineFormula(Logic.AtMostOneFormula, "atMostOne", {
        generateClauses: function(isTrue, t) {
          var args2 = this.operands;
          var not = Logic.not;
          if (args2.length <= 1) {
            return [];
          } else if (args2.length === 2) {
            return t.generate(isTrue, Logic.not(Logic.and(args2)));
          } else if (isTrue && args2.length === 3) {
            var clauses = [];
            for (var i2 = 0; i2 < args2.length; i2++) {
              for (var j = i2 + 1; j < args2.length; j++) {
                clauses.push(t.clause(not(args2[i2]), not(args2[j])));
              }
            }
            return clauses;
          } else if (!isTrue && args2.length === 3) {
            var A = args2[0], B = args2[1], C = args2[2];
            return [t.clause(A, B), t.clause(A, C), t.clause(B, C)];
          } else {
            var groups = group2(args2, 3);
            var ors = _3.map(groups, function(g) {
              return Logic.or(g);
            });
            if (groups[groups.length - 1].length < 2) {
              groups.pop();
            }
            var atMostOnes = _3.map(groups, function(g) {
              return Logic.atMostOne(g);
            });
            return t.generate(isTrue, Logic.and(Logic.atMostOne(ors), atMostOnes));
          }
        }
      });
      Logic.implies = function(A, B) {
        if (assert2)
          assertNumArgs(arguments.length, 2, "Logic.implies");
        return new Logic.ImpliesFormula(A, B);
      };
      Logic.ImpliesFormula = function(A, B) {
        if (assert2)
          assert2(A, isFormulaOrTerm);
        if (assert2)
          assert2(B, isFormulaOrTerm);
        if (assert2)
          assertNumArgs(arguments.length, 2, "Logic.implies");
        this.A = A;
        this.B = B;
      };
      Logic._defineFormula(Logic.ImpliesFormula, "implies", {
        generateClauses: function(isTrue, t) {
          return t.generate(isTrue, Logic.or(Logic.not(this.A), this.B));
        }
      });
      Logic.equiv = function(A, B) {
        if (assert2)
          assertNumArgs(arguments.length, 2, "Logic.equiv");
        return new Logic.EquivFormula(A, B);
      };
      Logic.EquivFormula = function(A, B) {
        if (assert2)
          assert2(A, isFormulaOrTerm);
        if (assert2)
          assert2(B, isFormulaOrTerm);
        if (assert2)
          assertNumArgs(arguments.length, 2, "Logic.equiv");
        this.A = A;
        this.B = B;
      };
      Logic._defineFormula(Logic.EquivFormula, "equiv", {
        generateClauses: function(isTrue, t) {
          return t.generate(!isTrue, Logic.xor(this.A, this.B));
        }
      });
      Logic.exactlyOne = function() {
        var args2 = _3.flatten(arguments);
        if (args2.length === 0) {
          return Logic.FALSE;
        } else if (args2.length === 1) {
          if (assert2)
            assert2(args2[0], isFormulaOrTerm);
          return args2[0];
        } else {
          return new Logic.ExactlyOneFormula(args2);
        }
      };
      Logic.ExactlyOneFormula = function(operands) {
        if (assert2)
          assert2(operands, isArrayWhere(isFormulaOrTerm));
        this.operands = operands;
      };
      Logic._defineFormula(Logic.ExactlyOneFormula, "exactlyOne", {
        generateClauses: function(isTrue, t) {
          var args2 = this.operands;
          if (args2.length < 3) {
            return t.generate(isTrue, Logic.xor(args2));
          } else {
            return t.generate(isTrue, Logic.and(
              Logic.atMostOne(args2),
              Logic.or(args2)
            ));
          }
        }
      });
      Logic.Bits = function(formulaArray) {
        if (assert2)
          assert2(formulaArray, isArrayWhere(isFormulaOrTerm));
        this.bits = formulaArray;
      };
      Logic.constantBits = function(wholeNumber) {
        if (assert2)
          assert2(wholeNumber, Logic.isWholeNumber);
        var result2 = [];
        while (wholeNumber) {
          result2.push(wholeNumber & 1 ? Logic.TRUE : Logic.FALSE);
          wholeNumber >>>= 1;
        }
        return new Logic.Bits(result2);
      };
      Logic.variableBits = function(baseName, nbits) {
        if (assert2)
          assert2(nbits, Logic.isWholeNumber);
        var result2 = [];
        for (var i2 = 0; i2 < nbits; i2++) {
          result2.push(baseName + "$" + i2);
        }
        return new Logic.Bits(result2);
      };
      Logic.lessThanOrEqual = function(bits1, bits2) {
        return new Logic.LessThanOrEqualFormula(bits1, bits2);
      };
      Logic.LessThanOrEqualFormula = function(bits1, bits2) {
        if (assert2)
          assert2(bits1, Logic.isBits);
        if (assert2)
          assert2(bits2, Logic.isBits);
        if (assert2)
          assertNumArgs(arguments.length, 2, "Bits comparison function");
        this.bits1 = bits1;
        this.bits2 = bits2;
      };
      var genLTE = function(bits1, bits2, t, notEqual) {
        var ret = [];
        var A = bits1.bits.slice();
        var B = bits2.bits.slice();
        if (notEqual && !bits2.bits.length) {
          return t.clause();
        }
        while (A.length > B.length) {
          var hi = A.pop();
          ret.push(t.clause(Logic.not(hi)));
        }
        var xors = _3.map(B, function(b, i3) {
          if (i3 < A.length) {
            return Logic.xor(A[i3], b);
          } else {
            return b;
          }
        });
        for (var i2 = A.length - 1; i2 >= 0; i2--) {
          ret.push(t.clause(xors.slice(i2 + 1), Logic.not(A[i2]), B[i2]));
        }
        if (notEqual) {
          ret.push.apply(ret, t.generate(true, Logic.or(xors)));
        }
        return ret;
      };
      Logic._defineFormula(Logic.LessThanOrEqualFormula, "lte", {
        generateClauses: function(isTrue, t) {
          if (isTrue) {
            return genLTE(this.bits1, this.bits2, t, false);
          } else {
            return genLTE(this.bits2, this.bits1, t, true);
          }
        }
      });
      Logic.lessThan = function(bits1, bits2) {
        return new Logic.LessThanFormula(bits1, bits2);
      };
      Logic.LessThanFormula = function(bits1, bits2) {
        if (assert2)
          assert2(bits1, Logic.isBits);
        if (assert2)
          assert2(bits2, Logic.isBits);
        if (assert2)
          assertNumArgs(arguments.length, 2, "Bits comparison function");
        this.bits1 = bits1;
        this.bits2 = bits2;
      };
      Logic._defineFormula(Logic.LessThanFormula, "lt", {
        generateClauses: function(isTrue, t) {
          if (isTrue) {
            return genLTE(this.bits1, this.bits2, t, true);
          } else {
            return genLTE(this.bits2, this.bits1, t, false);
          }
        }
      });
      Logic.greaterThan = function(bits1, bits2) {
        return Logic.lessThan(bits2, bits1);
      };
      Logic.greaterThanOrEqual = function(bits1, bits2) {
        return Logic.lessThanOrEqual(bits2, bits1);
      };
      Logic.equalBits = function(bits1, bits2) {
        return new Logic.EqualBitsFormula(bits1, bits2);
      };
      Logic.EqualBitsFormula = function(bits1, bits2) {
        if (assert2)
          assert2(bits1, Logic.isBits);
        if (assert2)
          assert2(bits2, Logic.isBits);
        if (assert2)
          assertNumArgs(arguments.length, 2, "Logic.equalBits");
        this.bits1 = bits1;
        this.bits2 = bits2;
      };
      Logic._defineFormula(Logic.EqualBitsFormula, "equalBits", {
        generateClauses: function(isTrue, t) {
          var A = this.bits1.bits;
          var B = this.bits2.bits;
          var nbits = Math.max(A.length, B.length);
          var facts = [];
          for (var i2 = 0; i2 < nbits; i2++) {
            if (i2 >= A.length) {
              facts.push(Logic.not(B[i2]));
            } else if (i2 >= B.length) {
              facts.push(Logic.not(A[i2]));
            } else {
              facts.push(Logic.equiv(A[i2], B[i2]));
            }
          }
          return t.generate(isTrue, Logic.and(facts));
        }
      });
      Logic.HalfAdderSum = function(formula1, formula2) {
        if (assert2)
          assert2(formula1, isFormulaOrTerm);
        if (assert2)
          assert2(formula2, isFormulaOrTerm);
        if (assert2)
          assertNumArgs(arguments.length, 2, "Logic.HalfAdderSum");
        this.a = formula1;
        this.b = formula2;
      };
      Logic._defineFormula(Logic.HalfAdderSum, "hsum", {
        generateClauses: function(isTrue, t) {
          return t.generate(isTrue, Logic.xor(this.a, this.b));
        }
      });
      Logic.HalfAdderCarry = function(formula1, formula2) {
        if (assert2)
          assert2(formula1, isFormulaOrTerm);
        if (assert2)
          assert2(formula2, isFormulaOrTerm);
        if (assert2)
          assertNumArgs(arguments.length, 2, "Logic.HalfAdderCarry");
        this.a = formula1;
        this.b = formula2;
      };
      Logic._defineFormula(Logic.HalfAdderCarry, "hcarry", {
        generateClauses: function(isTrue, t) {
          return t.generate(isTrue, Logic.and(this.a, this.b));
        }
      });
      Logic.FullAdderSum = function(formula1, formula2, formula3) {
        if (assert2)
          assert2(formula1, isFormulaOrTerm);
        if (assert2)
          assert2(formula2, isFormulaOrTerm);
        if (assert2)
          assert2(formula3, isFormulaOrTerm);
        if (assert2)
          assertNumArgs(arguments.length, 3, "Logic.FullAdderSum");
        this.a = formula1;
        this.b = formula2;
        this.c = formula3;
      };
      Logic._defineFormula(Logic.FullAdderSum, "fsum", {
        generateClauses: function(isTrue, t) {
          return t.generate(isTrue, Logic.xor(this.a, this.b, this.c));
        }
      });
      Logic.FullAdderCarry = function(formula1, formula2, formula3) {
        if (assert2)
          assert2(formula1, isFormulaOrTerm);
        if (assert2)
          assert2(formula2, isFormulaOrTerm);
        if (assert2)
          assert2(formula3, isFormulaOrTerm);
        if (assert2)
          assertNumArgs(arguments.length, 3, "Logic.FullAdderCarry");
        this.a = formula1;
        this.b = formula2;
        this.c = formula3;
      };
      Logic._defineFormula(Logic.FullAdderCarry, "fcarry", {
        generateClauses: function(isTrue, t) {
          return t.generate(
            !isTrue,
            Logic.atMostOne(this.a, this.b, this.c)
          );
        }
      });
      var binaryWeightedSum = function(varsByWeight) {
        if (assert2)
          assert2(
            varsByWeight,
            isArrayWhere(isArrayWhere(isFormulaOrTerm))
          );
        var buckets = _3.map(varsByWeight, _3.clone);
        var lowestWeight = 0;
        var output = [];
        while (lowestWeight < buckets.length) {
          var bucket = buckets[lowestWeight];
          if (!bucket.length) {
            output.push(Logic.FALSE);
            lowestWeight++;
          } else if (bucket.length === 1) {
            output.push(bucket[0]);
            lowestWeight++;
          } else if (bucket.length === 2) {
            var sum = new Logic.HalfAdderSum(bucket[0], bucket[1]);
            var carry = new Logic.HalfAdderCarry(bucket[0], bucket[1]);
            bucket.length = 0;
            bucket.push(sum);
            pushToNth(buckets, lowestWeight + 1, carry);
          } else {
            var c = bucket.pop();
            var b = bucket.pop();
            var a = bucket.pop();
            var sum = new Logic.FullAdderSum(a, b, c);
            var carry = new Logic.FullAdderCarry(a, b, c);
            bucket.push(sum);
            pushToNth(buckets, lowestWeight + 1, carry);
          }
        }
        return output;
      };
      var pushToNth = function(arrayOfArrays, n, newItem) {
        while (n >= arrayOfArrays.length) {
          arrayOfArrays.push([]);
        }
        arrayOfArrays[n].push(newItem);
      };
      var checkWeightedSumArgs = function(formulas, weights) {
        if (assert2)
          assert2(formulas, isArrayWhere(isFormulaOrTerm));
        if (typeof weights === "number") {
          if (assert2)
            assert2(weights, Logic.isWholeNumber);
        } else {
          if (assert2)
            assert2(weights, isArrayWhere(Logic.isWholeNumber));
          if (formulas.length !== weights.length) {
            throw new Error("Formula array and weight array must be same length; they are " + formulas.length + " and " + weights.length);
          }
        }
      };
      Logic.weightedSum = function(formulas, weights) {
        checkWeightedSumArgs(formulas, weights);
        if (formulas.length === 0) {
          return new Logic.Bits([]);
        }
        if (typeof weights === "number") {
          weights = _3.map(formulas, function() {
            return weights;
          });
        }
        var binaryWeighted = [];
        _3.each(formulas, function(f, i2) {
          var w = weights[i2];
          var whichBit = 0;
          while (w) {
            if (w & 1) {
              pushToNth(binaryWeighted, whichBit, f);
            }
            w >>>= 1;
            whichBit++;
          }
        });
        return new Logic.Bits(binaryWeightedSum(binaryWeighted));
      };
      Logic.sum = function() {
        var things = _3.flatten(arguments);
        if (assert2)
          assert2(things, isArrayWhere(isFormulaOrTermOrBits));
        var binaryWeighted = [];
        _3.each(things, function(x) {
          if (x instanceof Logic.Bits) {
            _3.each(x.bits, function(b, i2) {
              pushToNth(binaryWeighted, i2, b);
            });
          } else {
            pushToNth(binaryWeighted, 0, x);
          }
        });
        return new Logic.Bits(binaryWeightedSum(binaryWeighted));
      };
      Logic.Solver.prototype.solve = function(_assumpVar) {
        var self2 = this;
        if (_assumpVar !== void 0) {
          if (!(_assumpVar >= 1)) {
            throw new Error("_assumpVar must be a variable number");
          }
        }
        if (self2._unsat) {
          return null;
        }
        while (self2._numClausesAddedToMiniSat < self2.clauses.length) {
          var i2 = self2._numClausesAddedToMiniSat;
          var terms = self2.clauses[i2].terms;
          if (assert2)
            assert2(terms, isArrayWhere(Logic.isNumTerm));
          var stillSat = self2._minisat.addClause(terms);
          self2._numClausesAddedToMiniSat++;
          if (!stillSat) {
            self2._unsat = true;
            return null;
          }
        }
        if (assert2)
          assert2(this._num2name.length - 1, Logic.isWholeNumber);
        self2._minisat.ensureVar(this._num2name.length - 1);
        var stillSat = _assumpVar ? self2._minisat.solveAssuming(_assumpVar) : self2._minisat.solve();
        if (!stillSat) {
          if (!_assumpVar) {
            self2._unsat = true;
          }
          return null;
        }
        return new Logic.Solution(self2, self2._minisat.getSolution());
      };
      Logic.Solver.prototype.solveAssuming = function(formula) {
        if (assert2)
          assert2(formula, isFormulaOrTerm);
        var assump = new Logic.Assumption(formula);
        var assumpVar = this._formulaToTerm(assump);
        if (!(typeof assumpVar === "number" && assumpVar > 0)) {
          throw new Error("Assertion failure: not a positive numeric term");
        }
        this._useFormulaTerm(assumpVar);
        var result2 = this.solve(assumpVar);
        this._minisat.retireVar(assumpVar);
        return result2;
      };
      Logic.Assumption = function(formula) {
        if (assert2)
          assert2(formula, isFormulaOrTerm);
        this.formula = formula;
      };
      Logic._defineFormula(Logic.Assumption, "assump", {
        generateClauses: function(isTrue, t) {
          if (isTrue) {
            return t.clause(this.formula);
          } else {
            return t.clause(Logic.not(this.formula));
          }
        }
      });
      Logic.Solution = function(_solver, _assignment) {
        var self2 = this;
        self2._solver = _solver;
        self2._assignment = _assignment;
        self2._ungeneratedFormulas = _3.clone(_solver._ungeneratedFormulas);
        self2._formulaValueCache = {};
        self2._termifier = new Logic.Termifier(self2._solver);
        self2._termifier.term = function(formula) {
          return self2.evaluate(formula) ? Logic.NUM_TRUE : Logic.NUM_FALSE;
        };
        self2._ignoreUnknownVariables = false;
      };
      Logic.Solution.prototype.ignoreUnknownVariables = function() {
        this._ignoreUnknownVariables = true;
      };
      Logic.Solution.prototype.getMap = function() {
        var solver = this._solver;
        var assignment = this._assignment;
        var result2 = {};
        for (var i2 = 1; i2 < assignment.length; i2++) {
          var name = solver.getVarName(i2);
          if (name && name.charAt(0) !== "$") {
            result2[name] = assignment[i2];
          }
        }
        return result2;
      };
      Logic.Solution.prototype.getTrueVars = function() {
        var solver = this._solver;
        var assignment = this._assignment;
        var result2 = [];
        for (var i2 = 1; i2 < assignment.length; i2++) {
          if (assignment[i2]) {
            var name = solver.getVarName(i2);
            if (name && name.charAt(0) !== "$") {
              result2.push(name);
            }
          }
        }
        result2.sort();
        return result2;
      };
      Logic.Solution.prototype.getFormula = function() {
        var solver = this._solver;
        var assignment = this._assignment;
        var terms = [];
        for (var i2 = 1; i2 < assignment.length; i2++) {
          var name = solver.getVarName(i2);
          if (name && name.charAt(0) !== "$") {
            terms.push(assignment[i2] ? i2 : -i2);
          }
        }
        return Logic.and(terms);
      };
      Logic.Solution.prototype.evaluate = function(formulaOrBits) {
        var self2 = this;
        if (assert2)
          assert2(formulaOrBits, isFormulaOrTermOrBits);
        if (formulaOrBits instanceof Logic.Bits) {
          var ret = 0;
          _3.each(formulaOrBits.bits, function(f, i2) {
            if (self2.evaluate(f)) {
              ret += 1 << i2;
            }
          });
          return ret;
        }
        var solver = self2._solver;
        var ignoreUnknownVariables = self2._ignoreUnknownVariables;
        var assignment = self2._assignment;
        var formula = formulaOrBits;
        if (formula instanceof Logic.NotFormula) {
          return !self2.evaluate(formula.operand);
        } else if (formula instanceof Logic.Formula) {
          var cachedResult = self2._formulaValueCache[formula.guid()];
          if (typeof cachedResult === "boolean") {
            return cachedResult;
          } else {
            var value;
            var info = solver._getFormulaInfo(formula, true);
            if (info && info.varNum && info.varNum < assignment.length && !_3.has(self2._ungeneratedFormulas, info.varNum)) {
              value = assignment[info.varNum];
            } else {
              var clauses = solver._generateFormula(true, formula, self2._termifier);
              var value = _3.all(clauses, function(cls) {
                return _3.any(cls.terms, function(t) {
                  return self2.evaluate(t);
                });
              });
            }
            self2._formulaValueCache[formula.guid()] = value;
            return value;
          }
        } else {
          var numTerm = solver.toNumTerm(formula, true);
          if (!numTerm) {
            if (ignoreUnknownVariables) {
              return false;
            } else {
              var vname = String(formula).replace(/^-*/, "");
              throw new Error("No such variable: " + vname);
            }
          }
          var v = numTerm;
          var isNot = false;
          if (numTerm < 0) {
            v = -v;
            isNot = true;
          }
          if (v < 1 || v >= assignment.length) {
            var vname = v;
            if (v >= 1 && v < solver._num2name.length) {
              vname = solver._num2name[v];
            }
            if (ignoreUnknownVariables) {
              return false;
            } else {
              throw new Error("Variable not part of solution: " + vname);
            }
          }
          var ret = assignment[v];
          if (isNot) {
            ret = !ret;
          }
          return ret;
        }
      };
      Logic.Solution.prototype.getWeightedSum = function(formulas, weights) {
        checkWeightedSumArgs(formulas, weights);
        var total = 0;
        if (typeof weights === "number") {
          for (var i2 = 0; i2 < formulas.length; i2++) {
            total += weights * (this.evaluate(formulas[i2]) ? 1 : 0);
          }
        } else {
          for (var i2 = 0; i2 < formulas.length; i2++) {
            total += weights[i2] * (this.evaluate(formulas[i2]) ? 1 : 0);
          }
        }
        return total;
      };
      var getNonZeroWeightedTerms = function(costTerms, costWeights) {
        if (typeof costWeights === "number") {
          return costWeights ? costTerms : [];
        } else {
          var terms = [];
          for (var i2 = 0; i2 < costTerms.length; i2++) {
            if (costWeights[i2]) {
              terms.push(costTerms[i2]);
            }
          }
          return terms;
        }
      };
      var minMaxWS = function(solver, solution, costTerms, costWeights, options, isMin) {
        var curSolution = solution;
        var curCost = curSolution.getWeightedSum(costTerms, costWeights);
        var optFormula = options && options.formula;
        var weightedSum = optFormula || Logic.weightedSum(costTerms, costWeights);
        var progress = options && options.progress;
        var strategy = options && options.strategy;
        var nonZeroTerms = null;
        if (isMin && curCost > 0) {
          if (progress) {
            progress("trying", 0);
          }
          var zeroSolution = null;
          nonZeroTerms = getNonZeroWeightedTerms(costTerms, costWeights);
          var zeroSolution = solver.solveAssuming(Logic.not(Logic.or(nonZeroTerms)));
          if (zeroSolution) {
            curSolution = zeroSolution;
            curCost = 0;
          }
        }
        if (isMin && strategy === "bottom-up") {
          for (var trialCost = 1; trialCost < curCost; trialCost++) {
            if (progress) {
              progress("trying", trialCost);
            }
            var costIsTrialCost = Logic.equalBits(
              weightedSum,
              Logic.constantBits(trialCost)
            );
            var newSolution = solver.solveAssuming(costIsTrialCost);
            if (newSolution) {
              curSolution = newSolution;
              curCost = trialCost;
              break;
            }
          }
        } else if (strategy && strategy !== "default") {
          throw new Error("Bad strategy: " + strategy);
        } else {
          strategy = "default";
        }
        if (strategy === "default") {
          while (isMin ? curCost > 0 : true) {
            if (progress) {
              progress("improving", curCost);
            }
            var improvement = (isMin ? Logic.lessThan : Logic.greaterThan)(
              weightedSum,
              Logic.constantBits(curCost)
            );
            var newSolution = solver.solveAssuming(improvement);
            if (!newSolution) {
              break;
            }
            solver.require(improvement);
            curSolution = newSolution;
            curCost = curSolution.getWeightedSum(costTerms, costWeights);
          }
        }
        if (isMin && curCost === 0) {
          if (!nonZeroTerms) {
            nonZeroTerms = getNonZeroWeightedTerms(costTerms, costWeights);
          }
          solver.forbid(nonZeroTerms);
        } else {
          solver.require(Logic.equalBits(weightedSum, Logic.constantBits(curCost)));
        }
        if (progress) {
          progress("finished", curCost);
        }
        return curSolution;
      };
      Logic.Solver.prototype.minimizeWeightedSum = function(solution, costTerms, costWeights, options) {
        return minMaxWS(this, solution, costTerms, costWeights, options, true);
      };
      Logic.Solver.prototype.maximizeWeightedSum = function(solution, costTerms, costWeights, options) {
        return minMaxWS(this, solution, costTerms, costWeights, options, false);
      };
      module2.exports = Logic;
    }
  });

  // entry.js
  var require_entry = __commonJS({
    "entry.js"(exports2, module2) {
      module2.exports = require_logic_solver();
    }
  });
  return require_entry();
})();
