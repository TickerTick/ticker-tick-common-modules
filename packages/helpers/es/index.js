function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var regenerator = {exports: {}};

var runtime = {exports: {}};

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

(function (module) {
	var runtime = (function (exports) {

	  var Op = Object.prototype;
	  var hasOwn = Op.hasOwnProperty;
	  var undefined$1; // More compressible than void 0.
	  var $Symbol = typeof Symbol === "function" ? Symbol : {};
	  var iteratorSymbol = $Symbol.iterator || "@@iterator";
	  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
	  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

	  function define(obj, key, value) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	    return obj[key];
	  }
	  try {
	    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
	    define({}, "");
	  } catch (err) {
	    define = function(obj, key, value) {
	      return obj[key] = value;
	    };
	  }

	  function wrap(innerFn, outerFn, self, tryLocsList) {
	    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
	    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
	    var generator = Object.create(protoGenerator.prototype);
	    var context = new Context(tryLocsList || []);

	    // The ._invoke method unifies the implementations of the .next,
	    // .throw, and .return methods.
	    generator._invoke = makeInvokeMethod(innerFn, self, context);

	    return generator;
	  }
	  exports.wrap = wrap;

	  // Try/catch helper to minimize deoptimizations. Returns a completion
	  // record like context.tryEntries[i].completion. This interface could
	  // have been (and was previously) designed to take a closure to be
	  // invoked without arguments, but in all the cases we care about we
	  // already have an existing method we want to call, so there's no need
	  // to create a new function object. We can even get away with assuming
	  // the method takes exactly one argument, since that happens to be true
	  // in every case, so we don't have to touch the arguments object. The
	  // only additional allocation required is the completion record, which
	  // has a stable shape and so hopefully should be cheap to allocate.
	  function tryCatch(fn, obj, arg) {
	    try {
	      return { type: "normal", arg: fn.call(obj, arg) };
	    } catch (err) {
	      return { type: "throw", arg: err };
	    }
	  }

	  var GenStateSuspendedStart = "suspendedStart";
	  var GenStateSuspendedYield = "suspendedYield";
	  var GenStateExecuting = "executing";
	  var GenStateCompleted = "completed";

	  // Returning this object from the innerFn has the same effect as
	  // breaking out of the dispatch switch statement.
	  var ContinueSentinel = {};

	  // Dummy constructor functions that we use as the .constructor and
	  // .constructor.prototype properties for functions that return Generator
	  // objects. For full spec compliance, you may wish to configure your
	  // minifier not to mangle the names of these two functions.
	  function Generator() {}
	  function GeneratorFunction() {}
	  function GeneratorFunctionPrototype() {}

	  // This is a polyfill for %IteratorPrototype% for environments that
	  // don't natively support it.
	  var IteratorPrototype = {};
	  define(IteratorPrototype, iteratorSymbol, function () {
	    return this;
	  });

	  var getProto = Object.getPrototypeOf;
	  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
	  if (NativeIteratorPrototype &&
	      NativeIteratorPrototype !== Op &&
	      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
	    // This environment has a native %IteratorPrototype%; use it instead
	    // of the polyfill.
	    IteratorPrototype = NativeIteratorPrototype;
	  }

	  var Gp = GeneratorFunctionPrototype.prototype =
	    Generator.prototype = Object.create(IteratorPrototype);
	  GeneratorFunction.prototype = GeneratorFunctionPrototype;
	  define(Gp, "constructor", GeneratorFunctionPrototype);
	  define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
	  GeneratorFunction.displayName = define(
	    GeneratorFunctionPrototype,
	    toStringTagSymbol,
	    "GeneratorFunction"
	  );

	  // Helper for defining the .next, .throw, and .return methods of the
	  // Iterator interface in terms of a single ._invoke method.
	  function defineIteratorMethods(prototype) {
	    ["next", "throw", "return"].forEach(function(method) {
	      define(prototype, method, function(arg) {
	        return this._invoke(method, arg);
	      });
	    });
	  }

	  exports.isGeneratorFunction = function(genFun) {
	    var ctor = typeof genFun === "function" && genFun.constructor;
	    return ctor
	      ? ctor === GeneratorFunction ||
	        // For the native GeneratorFunction constructor, the best we can
	        // do is to check its .name property.
	        (ctor.displayName || ctor.name) === "GeneratorFunction"
	      : false;
	  };

	  exports.mark = function(genFun) {
	    if (Object.setPrototypeOf) {
	      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
	    } else {
	      genFun.__proto__ = GeneratorFunctionPrototype;
	      define(genFun, toStringTagSymbol, "GeneratorFunction");
	    }
	    genFun.prototype = Object.create(Gp);
	    return genFun;
	  };

	  // Within the body of any async function, `await x` is transformed to
	  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
	  // `hasOwn.call(value, "__await")` to determine if the yielded value is
	  // meant to be awaited.
	  exports.awrap = function(arg) {
	    return { __await: arg };
	  };

	  function AsyncIterator(generator, PromiseImpl) {
	    function invoke(method, arg, resolve, reject) {
	      var record = tryCatch(generator[method], generator, arg);
	      if (record.type === "throw") {
	        reject(record.arg);
	      } else {
	        var result = record.arg;
	        var value = result.value;
	        if (value &&
	            typeof value === "object" &&
	            hasOwn.call(value, "__await")) {
	          return PromiseImpl.resolve(value.__await).then(function(value) {
	            invoke("next", value, resolve, reject);
	          }, function(err) {
	            invoke("throw", err, resolve, reject);
	          });
	        }

	        return PromiseImpl.resolve(value).then(function(unwrapped) {
	          // When a yielded Promise is resolved, its final value becomes
	          // the .value of the Promise<{value,done}> result for the
	          // current iteration.
	          result.value = unwrapped;
	          resolve(result);
	        }, function(error) {
	          // If a rejected Promise was yielded, throw the rejection back
	          // into the async generator function so it can be handled there.
	          return invoke("throw", error, resolve, reject);
	        });
	      }
	    }

	    var previousPromise;

	    function enqueue(method, arg) {
	      function callInvokeWithMethodAndArg() {
	        return new PromiseImpl(function(resolve, reject) {
	          invoke(method, arg, resolve, reject);
	        });
	      }

	      return previousPromise =
	        // If enqueue has been called before, then we want to wait until
	        // all previous Promises have been resolved before calling invoke,
	        // so that results are always delivered in the correct order. If
	        // enqueue has not been called before, then it is important to
	        // call invoke immediately, without waiting on a callback to fire,
	        // so that the async generator function has the opportunity to do
	        // any necessary setup in a predictable way. This predictability
	        // is why the Promise constructor synchronously invokes its
	        // executor callback, and why async functions synchronously
	        // execute code before the first await. Since we implement simple
	        // async functions in terms of async generators, it is especially
	        // important to get this right, even though it requires care.
	        previousPromise ? previousPromise.then(
	          callInvokeWithMethodAndArg,
	          // Avoid propagating failures to Promises returned by later
	          // invocations of the iterator.
	          callInvokeWithMethodAndArg
	        ) : callInvokeWithMethodAndArg();
	    }

	    // Define the unified helper method that is used to implement .next,
	    // .throw, and .return (see defineIteratorMethods).
	    this._invoke = enqueue;
	  }

	  defineIteratorMethods(AsyncIterator.prototype);
	  define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
	    return this;
	  });
	  exports.AsyncIterator = AsyncIterator;

	  // Note that simple async functions are implemented on top of
	  // AsyncIterator objects; they just return a Promise for the value of
	  // the final result produced by the iterator.
	  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
	    if (PromiseImpl === void 0) PromiseImpl = Promise;

	    var iter = new AsyncIterator(
	      wrap(innerFn, outerFn, self, tryLocsList),
	      PromiseImpl
	    );

	    return exports.isGeneratorFunction(outerFn)
	      ? iter // If outerFn is a generator, return the full iterator.
	      : iter.next().then(function(result) {
	          return result.done ? result.value : iter.next();
	        });
	  };

	  function makeInvokeMethod(innerFn, self, context) {
	    var state = GenStateSuspendedStart;

	    return function invoke(method, arg) {
	      if (state === GenStateExecuting) {
	        throw new Error("Generator is already running");
	      }

	      if (state === GenStateCompleted) {
	        if (method === "throw") {
	          throw arg;
	        }

	        // Be forgiving, per 25.3.3.3.3 of the spec:
	        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
	        return doneResult();
	      }

	      context.method = method;
	      context.arg = arg;

	      while (true) {
	        var delegate = context.delegate;
	        if (delegate) {
	          var delegateResult = maybeInvokeDelegate(delegate, context);
	          if (delegateResult) {
	            if (delegateResult === ContinueSentinel) continue;
	            return delegateResult;
	          }
	        }

	        if (context.method === "next") {
	          // Setting context._sent for legacy support of Babel's
	          // function.sent implementation.
	          context.sent = context._sent = context.arg;

	        } else if (context.method === "throw") {
	          if (state === GenStateSuspendedStart) {
	            state = GenStateCompleted;
	            throw context.arg;
	          }

	          context.dispatchException(context.arg);

	        } else if (context.method === "return") {
	          context.abrupt("return", context.arg);
	        }

	        state = GenStateExecuting;

	        var record = tryCatch(innerFn, self, context);
	        if (record.type === "normal") {
	          // If an exception is thrown from innerFn, we leave state ===
	          // GenStateExecuting and loop back for another invocation.
	          state = context.done
	            ? GenStateCompleted
	            : GenStateSuspendedYield;

	          if (record.arg === ContinueSentinel) {
	            continue;
	          }

	          return {
	            value: record.arg,
	            done: context.done
	          };

	        } else if (record.type === "throw") {
	          state = GenStateCompleted;
	          // Dispatch the exception by looping back around to the
	          // context.dispatchException(context.arg) call above.
	          context.method = "throw";
	          context.arg = record.arg;
	        }
	      }
	    };
	  }

	  // Call delegate.iterator[context.method](context.arg) and handle the
	  // result, either by returning a { value, done } result from the
	  // delegate iterator, or by modifying context.method and context.arg,
	  // setting context.delegate to null, and returning the ContinueSentinel.
	  function maybeInvokeDelegate(delegate, context) {
	    var method = delegate.iterator[context.method];
	    if (method === undefined$1) {
	      // A .throw or .return when the delegate iterator has no .throw
	      // method always terminates the yield* loop.
	      context.delegate = null;

	      if (context.method === "throw") {
	        // Note: ["return"] must be used for ES3 parsing compatibility.
	        if (delegate.iterator["return"]) {
	          // If the delegate iterator has a return method, give it a
	          // chance to clean up.
	          context.method = "return";
	          context.arg = undefined$1;
	          maybeInvokeDelegate(delegate, context);

	          if (context.method === "throw") {
	            // If maybeInvokeDelegate(context) changed context.method from
	            // "return" to "throw", let that override the TypeError below.
	            return ContinueSentinel;
	          }
	        }

	        context.method = "throw";
	        context.arg = new TypeError(
	          "The iterator does not provide a 'throw' method");
	      }

	      return ContinueSentinel;
	    }

	    var record = tryCatch(method, delegate.iterator, context.arg);

	    if (record.type === "throw") {
	      context.method = "throw";
	      context.arg = record.arg;
	      context.delegate = null;
	      return ContinueSentinel;
	    }

	    var info = record.arg;

	    if (! info) {
	      context.method = "throw";
	      context.arg = new TypeError("iterator result is not an object");
	      context.delegate = null;
	      return ContinueSentinel;
	    }

	    if (info.done) {
	      // Assign the result of the finished delegate to the temporary
	      // variable specified by delegate.resultName (see delegateYield).
	      context[delegate.resultName] = info.value;

	      // Resume execution at the desired location (see delegateYield).
	      context.next = delegate.nextLoc;

	      // If context.method was "throw" but the delegate handled the
	      // exception, let the outer generator proceed normally. If
	      // context.method was "next", forget context.arg since it has been
	      // "consumed" by the delegate iterator. If context.method was
	      // "return", allow the original .return call to continue in the
	      // outer generator.
	      if (context.method !== "return") {
	        context.method = "next";
	        context.arg = undefined$1;
	      }

	    } else {
	      // Re-yield the result returned by the delegate method.
	      return info;
	    }

	    // The delegate iterator is finished, so forget it and continue with
	    // the outer generator.
	    context.delegate = null;
	    return ContinueSentinel;
	  }

	  // Define Generator.prototype.{next,throw,return} in terms of the
	  // unified ._invoke helper method.
	  defineIteratorMethods(Gp);

	  define(Gp, toStringTagSymbol, "Generator");

	  // A Generator should always return itself as the iterator object when the
	  // @@iterator function is called on it. Some browsers' implementations of the
	  // iterator prototype chain incorrectly implement this, causing the Generator
	  // object to not be returned from this call. This ensures that doesn't happen.
	  // See https://github.com/facebook/regenerator/issues/274 for more details.
	  define(Gp, iteratorSymbol, function() {
	    return this;
	  });

	  define(Gp, "toString", function() {
	    return "[object Generator]";
	  });

	  function pushTryEntry(locs) {
	    var entry = { tryLoc: locs[0] };

	    if (1 in locs) {
	      entry.catchLoc = locs[1];
	    }

	    if (2 in locs) {
	      entry.finallyLoc = locs[2];
	      entry.afterLoc = locs[3];
	    }

	    this.tryEntries.push(entry);
	  }

	  function resetTryEntry(entry) {
	    var record = entry.completion || {};
	    record.type = "normal";
	    delete record.arg;
	    entry.completion = record;
	  }

	  function Context(tryLocsList) {
	    // The root entry object (effectively a try statement without a catch
	    // or a finally block) gives us a place to store values thrown from
	    // locations where there is no enclosing try statement.
	    this.tryEntries = [{ tryLoc: "root" }];
	    tryLocsList.forEach(pushTryEntry, this);
	    this.reset(true);
	  }

	  exports.keys = function(object) {
	    var keys = [];
	    for (var key in object) {
	      keys.push(key);
	    }
	    keys.reverse();

	    // Rather than returning an object with a next method, we keep
	    // things simple and return the next function itself.
	    return function next() {
	      while (keys.length) {
	        var key = keys.pop();
	        if (key in object) {
	          next.value = key;
	          next.done = false;
	          return next;
	        }
	      }

	      // To avoid creating an additional object, we just hang the .value
	      // and .done properties off the next function object itself. This
	      // also ensures that the minifier will not anonymize the function.
	      next.done = true;
	      return next;
	    };
	  };

	  function values(iterable) {
	    if (iterable) {
	      var iteratorMethod = iterable[iteratorSymbol];
	      if (iteratorMethod) {
	        return iteratorMethod.call(iterable);
	      }

	      if (typeof iterable.next === "function") {
	        return iterable;
	      }

	      if (!isNaN(iterable.length)) {
	        var i = -1, next = function next() {
	          while (++i < iterable.length) {
	            if (hasOwn.call(iterable, i)) {
	              next.value = iterable[i];
	              next.done = false;
	              return next;
	            }
	          }

	          next.value = undefined$1;
	          next.done = true;

	          return next;
	        };

	        return next.next = next;
	      }
	    }

	    // Return an iterator with no values.
	    return { next: doneResult };
	  }
	  exports.values = values;

	  function doneResult() {
	    return { value: undefined$1, done: true };
	  }

	  Context.prototype = {
	    constructor: Context,

	    reset: function(skipTempReset) {
	      this.prev = 0;
	      this.next = 0;
	      // Resetting context._sent for legacy support of Babel's
	      // function.sent implementation.
	      this.sent = this._sent = undefined$1;
	      this.done = false;
	      this.delegate = null;

	      this.method = "next";
	      this.arg = undefined$1;

	      this.tryEntries.forEach(resetTryEntry);

	      if (!skipTempReset) {
	        for (var name in this) {
	          // Not sure about the optimal order of these conditions:
	          if (name.charAt(0) === "t" &&
	              hasOwn.call(this, name) &&
	              !isNaN(+name.slice(1))) {
	            this[name] = undefined$1;
	          }
	        }
	      }
	    },

	    stop: function() {
	      this.done = true;

	      var rootEntry = this.tryEntries[0];
	      var rootRecord = rootEntry.completion;
	      if (rootRecord.type === "throw") {
	        throw rootRecord.arg;
	      }

	      return this.rval;
	    },

	    dispatchException: function(exception) {
	      if (this.done) {
	        throw exception;
	      }

	      var context = this;
	      function handle(loc, caught) {
	        record.type = "throw";
	        record.arg = exception;
	        context.next = loc;

	        if (caught) {
	          // If the dispatched exception was caught by a catch block,
	          // then let that catch block handle the exception normally.
	          context.method = "next";
	          context.arg = undefined$1;
	        }

	        return !! caught;
	      }

	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        var record = entry.completion;

	        if (entry.tryLoc === "root") {
	          // Exception thrown outside of any try block that could handle
	          // it, so set the completion value of the entire function to
	          // throw the exception.
	          return handle("end");
	        }

	        if (entry.tryLoc <= this.prev) {
	          var hasCatch = hasOwn.call(entry, "catchLoc");
	          var hasFinally = hasOwn.call(entry, "finallyLoc");

	          if (hasCatch && hasFinally) {
	            if (this.prev < entry.catchLoc) {
	              return handle(entry.catchLoc, true);
	            } else if (this.prev < entry.finallyLoc) {
	              return handle(entry.finallyLoc);
	            }

	          } else if (hasCatch) {
	            if (this.prev < entry.catchLoc) {
	              return handle(entry.catchLoc, true);
	            }

	          } else if (hasFinally) {
	            if (this.prev < entry.finallyLoc) {
	              return handle(entry.finallyLoc);
	            }

	          } else {
	            throw new Error("try statement without catch or finally");
	          }
	        }
	      }
	    },

	    abrupt: function(type, arg) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc <= this.prev &&
	            hasOwn.call(entry, "finallyLoc") &&
	            this.prev < entry.finallyLoc) {
	          var finallyEntry = entry;
	          break;
	        }
	      }

	      if (finallyEntry &&
	          (type === "break" ||
	           type === "continue") &&
	          finallyEntry.tryLoc <= arg &&
	          arg <= finallyEntry.finallyLoc) {
	        // Ignore the finally entry if control is not jumping to a
	        // location outside the try/catch block.
	        finallyEntry = null;
	      }

	      var record = finallyEntry ? finallyEntry.completion : {};
	      record.type = type;
	      record.arg = arg;

	      if (finallyEntry) {
	        this.method = "next";
	        this.next = finallyEntry.finallyLoc;
	        return ContinueSentinel;
	      }

	      return this.complete(record);
	    },

	    complete: function(record, afterLoc) {
	      if (record.type === "throw") {
	        throw record.arg;
	      }

	      if (record.type === "break" ||
	          record.type === "continue") {
	        this.next = record.arg;
	      } else if (record.type === "return") {
	        this.rval = this.arg = record.arg;
	        this.method = "return";
	        this.next = "end";
	      } else if (record.type === "normal" && afterLoc) {
	        this.next = afterLoc;
	      }

	      return ContinueSentinel;
	    },

	    finish: function(finallyLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.finallyLoc === finallyLoc) {
	          this.complete(entry.completion, entry.afterLoc);
	          resetTryEntry(entry);
	          return ContinueSentinel;
	        }
	      }
	    },

	    "catch": function(tryLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc === tryLoc) {
	          var record = entry.completion;
	          if (record.type === "throw") {
	            var thrown = record.arg;
	            resetTryEntry(entry);
	          }
	          return thrown;
	        }
	      }

	      // The context.catch method must only be called with a location
	      // argument that corresponds to a known catch block.
	      throw new Error("illegal catch attempt");
	    },

	    delegateYield: function(iterable, resultName, nextLoc) {
	      this.delegate = {
	        iterator: values(iterable),
	        resultName: resultName,
	        nextLoc: nextLoc
	      };

	      if (this.method === "next") {
	        // Deliberately forget the last sent value so that we don't
	        // accidentally pass it on to the delegate.
	        this.arg = undefined$1;
	      }

	      return ContinueSentinel;
	    }
	  };

	  // Regardless of whether this script is executing as a CommonJS module
	  // or not, return the runtime object so that we can declare the variable
	  // regeneratorRuntime in the outer scope, which allows this module to be
	  // injected easily by `bin/regenerator --include-runtime script.js`.
	  return exports;

	}(
	  // If this script is executing as a CommonJS module, use module.exports
	  // as the regeneratorRuntime namespace. Otherwise create a new empty
	  // object. Either way, the resulting object will be used to initialize
	  // the regeneratorRuntime variable at the top of this file.
	  module.exports 
	));

	try {
	  regeneratorRuntime = runtime;
	} catch (accidentalStrictMode) {
	  // This module should not be running in strict mode, so the above
	  // assignment should always work unless something is misconfigured. Just
	  // in case runtime.js accidentally runs in strict mode, in modern engines
	  // we can explicitly access globalThis. In older engines we can escape
	  // strict mode using a global Function call. This could conceivably fail
	  // if a Content Security Policy forbids using Function, but in that case
	  // the proper solution is to fix the accidental strict mode problem. If
	  // you've misconfigured your bundler to force strict mode and applied a
	  // CSP to forbid Function, and you're not willing to fix either of those
	  // problems, please detail your unique predicament in a GitHub issue.
	  if (typeof globalThis === "object") {
	    globalThis.regeneratorRuntime = runtime;
	  } else {
	    Function("r", "regeneratorRuntime = r")(runtime);
	  }
	}
} (runtime));

(function (module) {
	module.exports = runtime.exports;
} (regenerator));

var _regeneratorRuntime = /*@__PURE__*/getDefaultExportFromCjs(regenerator.exports);

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _arrayLikeToArray$2(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

function _unsupportedIterableToArray$2(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray$2(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$2(o, minLen);
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray$2(arr, i) || _nonIterableRest();
}

function _createForOfIteratorHelper$1(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$1(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray$1(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$1(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen); }

function _arrayLikeToArray$1(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

// * k means const, common convention in backend
var kFullFilterObject = {
  storyTypes: {
    // Use the singular form

    /* top_story: {
      value: "top_story",
      label: "Top story",
    }, */
    financial_business_news: {
      value: "financial_business_news",
      label: "Best business news"
    },
    analysis: {
      value: "analysis",
      label: "Stock analysis"
    },
    industry: {
      value: "industry",
      label: "Industry publication"
    },
    // government: { value: "government", label: "Govt. News" },
    most_relevant: {
      value: "most_relevant",
      label: "Most relevant news"
    },
    sec_filing: {
      value: "sec_filing",
      label: "SEC filing"
    },
    financial_sec_filing: {
      value: "financial_sec_filing",
      label: "Financial report"
    },
    ipo_sec_filing: {
      value: "ipo_sec_filing",
      label: "IPO SEC filing"
    },
    earnings_call: {
      value: "earnings_call",
      label: "Earnings Call"
    },
    trading_activity: {
      value: "trading_activity",
      label: "Trading Activity"
    },
    market_news: {
      value: "market_news",
      label: "Market News"
    }
  },
  exclusions: {
    unimportant_sec_filing: {
      value: "unimportant_sec_filing",
      label: "Less important SEC filing"
    },
    ugc: {
      value: "ugc",
      label: "UGC stories (e.g. Reddit)"
    },
    trading_activity: {
      value: "trading_activity",
      label: "Trading Activity"
    },
    market_news: {
      value: "market_news",
      label: "Market News"
    }
  }
};
var kDefaultFilter = {
  // An empty array means all types are acceptable.
  storyTypes: [],
  exclusions: ["unimportant_sec_filing", "ugc", "trading_activity", "market_news"] // All options: us_rss, cn_rss,
  // This one is not exposed to users.
  // An empty array means all sources are acceptable.
  // source_types: [],

};
/**
 *
 */

function convertFilter2KV(filter) {
  var exclArray = (filter === null || filter === void 0 ? void 0 : filter.exclusions) || [];
  var storyTypeArray = (filter === null || filter === void 0 ? void 0 : filter.storyTypes) || [];
  var filterKV = {
    exclusions: {},
    storyTypes: {}
  };

  var _iterator = _createForOfIteratorHelper$1(exclArray),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var excl = _step.value;
      filterKV.exclusions[excl] = true;
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  var _iterator2 = _createForOfIteratorHelper$1(storyTypeArray),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var storyType = _step2.value;
      filterKV.storyTypes[storyType] = true;
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }

  return filterKV;
}
/**
 *
 */

function convertKV2Filter(filterKV) {
  var filter = {
    exclusions: [],
    storyTypes: []
  };
  var exclObj = filterKV.exclusions;
  var storyTypesObj = filterKV.storyTypes;

  for (var _i = 0, _Object$entries = Object.entries(exclObj); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
        excl = _Object$entries$_i[0],
        exclValueBool = _Object$entries$_i[1];

    if (exclValueBool) {
      filter.exclusions.push(excl);
    }
  }

  for (var _i2 = 0, _Object$entries2 = Object.entries(storyTypesObj); _i2 < _Object$entries2.length; _i2++) {
    var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i2], 2),
        storyType = _Object$entries2$_i[0],
        storyTypeValueBool = _Object$entries2$_i[1];

    if (storyTypeValueBool) {
      filter.storyTypes.push(storyType);
    }
  }

  return filter;
}

var queryString = {};

var strictUriEncode = str => encodeURIComponent(str).replace(/[!'()*]/g, x => `%${x.charCodeAt(0).toString(16).toUpperCase()}`);

var token = '%[a-f0-9]{2}';
var singleMatcher = new RegExp(token, 'gi');
var multiMatcher = new RegExp('(' + token + ')+', 'gi');

function decodeComponents(components, split) {
	try {
		// Try to decode the entire string first
		return decodeURIComponent(components.join(''));
	} catch (err) {
		// Do nothing
	}

	if (components.length === 1) {
		return components;
	}

	split = split || 1;

	// Split the array in 2 parts
	var left = components.slice(0, split);
	var right = components.slice(split);

	return Array.prototype.concat.call([], decodeComponents(left), decodeComponents(right));
}

function decode(input) {
	try {
		return decodeURIComponent(input);
	} catch (err) {
		var tokens = input.match(singleMatcher);

		for (var i = 1; i < tokens.length; i++) {
			input = decodeComponents(tokens, i).join('');

			tokens = input.match(singleMatcher);
		}

		return input;
	}
}

function customDecodeURIComponent(input) {
	// Keep track of all the replacements and prefill the map with the `BOM`
	var replaceMap = {
		'%FE%FF': '\uFFFD\uFFFD',
		'%FF%FE': '\uFFFD\uFFFD'
	};

	var match = multiMatcher.exec(input);
	while (match) {
		try {
			// Decode as big chunks as possible
			replaceMap[match[0]] = decodeURIComponent(match[0]);
		} catch (err) {
			var result = decode(match[0]);

			if (result !== match[0]) {
				replaceMap[match[0]] = result;
			}
		}

		match = multiMatcher.exec(input);
	}

	// Add `%C2` at the end of the map to make sure it does not replace the combinator before everything else
	replaceMap['%C2'] = '\uFFFD';

	var entries = Object.keys(replaceMap);

	for (var i = 0; i < entries.length; i++) {
		// Replace all decoded components
		var key = entries[i];
		input = input.replace(new RegExp(key, 'g'), replaceMap[key]);
	}

	return input;
}

var decodeUriComponent = function (encodedURI) {
	if (typeof encodedURI !== 'string') {
		throw new TypeError('Expected `encodedURI` to be of type `string`, got `' + typeof encodedURI + '`');
	}

	try {
		encodedURI = encodedURI.replace(/\+/g, ' ');

		// Try the built in decoder first
		return decodeURIComponent(encodedURI);
	} catch (err) {
		// Fallback to a more advanced decoder
		return customDecodeURIComponent(encodedURI);
	}
};

var splitOnFirst = (string, separator) => {
	if (!(typeof string === 'string' && typeof separator === 'string')) {
		throw new TypeError('Expected the arguments to be of type `string`');
	}

	if (separator === '') {
		return [string];
	}

	const separatorIndex = string.indexOf(separator);

	if (separatorIndex === -1) {
		return [string];
	}

	return [
		string.slice(0, separatorIndex),
		string.slice(separatorIndex + separator.length)
	];
};

var filterObj = function (obj, predicate) {
	var ret = {};
	var keys = Object.keys(obj);
	var isArr = Array.isArray(predicate);

	for (var i = 0; i < keys.length; i++) {
		var key = keys[i];
		var val = obj[key];

		if (isArr ? predicate.indexOf(key) !== -1 : predicate(key, val, obj)) {
			ret[key] = val;
		}
	}

	return ret;
};

(function (exports) {
	const strictUriEncode$1 = strictUriEncode;
	const decodeComponent = decodeUriComponent;
	const splitOnFirst$1 = splitOnFirst;
	const filterObject = filterObj;

	const isNullOrUndefined = value => value === null || value === undefined;

	const encodeFragmentIdentifier = Symbol('encodeFragmentIdentifier');

	function encoderForArrayFormat(options) {
		switch (options.arrayFormat) {
			case 'index':
				return key => (result, value) => {
					const index = result.length;

					if (
						value === undefined ||
						(options.skipNull && value === null) ||
						(options.skipEmptyString && value === '')
					) {
						return result;
					}

					if (value === null) {
						return [...result, [encode(key, options), '[', index, ']'].join('')];
					}

					return [
						...result,
						[encode(key, options), '[', encode(index, options), ']=', encode(value, options)].join('')
					];
				};

			case 'bracket':
				return key => (result, value) => {
					if (
						value === undefined ||
						(options.skipNull && value === null) ||
						(options.skipEmptyString && value === '')
					) {
						return result;
					}

					if (value === null) {
						return [...result, [encode(key, options), '[]'].join('')];
					}

					return [...result, [encode(key, options), '[]=', encode(value, options)].join('')];
				};

			case 'comma':
			case 'separator':
			case 'bracket-separator': {
				const keyValueSep = options.arrayFormat === 'bracket-separator' ?
					'[]=' :
					'=';

				return key => (result, value) => {
					if (
						value === undefined ||
						(options.skipNull && value === null) ||
						(options.skipEmptyString && value === '')
					) {
						return result;
					}

					// Translate null to an empty string so that it doesn't serialize as 'null'
					value = value === null ? '' : value;

					if (result.length === 0) {
						return [[encode(key, options), keyValueSep, encode(value, options)].join('')];
					}

					return [[result, encode(value, options)].join(options.arrayFormatSeparator)];
				};
			}

			default:
				return key => (result, value) => {
					if (
						value === undefined ||
						(options.skipNull && value === null) ||
						(options.skipEmptyString && value === '')
					) {
						return result;
					}

					if (value === null) {
						return [...result, encode(key, options)];
					}

					return [...result, [encode(key, options), '=', encode(value, options)].join('')];
				};
		}
	}

	function parserForArrayFormat(options) {
		let result;

		switch (options.arrayFormat) {
			case 'index':
				return (key, value, accumulator) => {
					result = /\[(\d*)\]$/.exec(key);

					key = key.replace(/\[\d*\]$/, '');

					if (!result) {
						accumulator[key] = value;
						return;
					}

					if (accumulator[key] === undefined) {
						accumulator[key] = {};
					}

					accumulator[key][result[1]] = value;
				};

			case 'bracket':
				return (key, value, accumulator) => {
					result = /(\[\])$/.exec(key);
					key = key.replace(/\[\]$/, '');

					if (!result) {
						accumulator[key] = value;
						return;
					}

					if (accumulator[key] === undefined) {
						accumulator[key] = [value];
						return;
					}

					accumulator[key] = [].concat(accumulator[key], value);
				};

			case 'comma':
			case 'separator':
				return (key, value, accumulator) => {
					const isArray = typeof value === 'string' && value.includes(options.arrayFormatSeparator);
					const isEncodedArray = (typeof value === 'string' && !isArray && decode(value, options).includes(options.arrayFormatSeparator));
					value = isEncodedArray ? decode(value, options) : value;
					const newValue = isArray || isEncodedArray ? value.split(options.arrayFormatSeparator).map(item => decode(item, options)) : value === null ? value : decode(value, options);
					accumulator[key] = newValue;
				};

			case 'bracket-separator':
				return (key, value, accumulator) => {
					const isArray = /(\[\])$/.test(key);
					key = key.replace(/\[\]$/, '');

					if (!isArray) {
						accumulator[key] = value ? decode(value, options) : value;
						return;
					}

					const arrayValue = value === null ?
						[] :
						value.split(options.arrayFormatSeparator).map(item => decode(item, options));

					if (accumulator[key] === undefined) {
						accumulator[key] = arrayValue;
						return;
					}

					accumulator[key] = [].concat(accumulator[key], arrayValue);
				};

			default:
				return (key, value, accumulator) => {
					if (accumulator[key] === undefined) {
						accumulator[key] = value;
						return;
					}

					accumulator[key] = [].concat(accumulator[key], value);
				};
		}
	}

	function validateArrayFormatSeparator(value) {
		if (typeof value !== 'string' || value.length !== 1) {
			throw new TypeError('arrayFormatSeparator must be single character string');
		}
	}

	function encode(value, options) {
		if (options.encode) {
			return options.strict ? strictUriEncode$1(value) : encodeURIComponent(value);
		}

		return value;
	}

	function decode(value, options) {
		if (options.decode) {
			return decodeComponent(value);
		}

		return value;
	}

	function keysSorter(input) {
		if (Array.isArray(input)) {
			return input.sort();
		}

		if (typeof input === 'object') {
			return keysSorter(Object.keys(input))
				.sort((a, b) => Number(a) - Number(b))
				.map(key => input[key]);
		}

		return input;
	}

	function removeHash(input) {
		const hashStart = input.indexOf('#');
		if (hashStart !== -1) {
			input = input.slice(0, hashStart);
		}

		return input;
	}

	function getHash(url) {
		let hash = '';
		const hashStart = url.indexOf('#');
		if (hashStart !== -1) {
			hash = url.slice(hashStart);
		}

		return hash;
	}

	function extract(input) {
		input = removeHash(input);
		const queryStart = input.indexOf('?');
		if (queryStart === -1) {
			return '';
		}

		return input.slice(queryStart + 1);
	}

	function parseValue(value, options) {
		if (options.parseNumbers && !Number.isNaN(Number(value)) && (typeof value === 'string' && value.trim() !== '')) {
			value = Number(value);
		} else if (options.parseBooleans && value !== null && (value.toLowerCase() === 'true' || value.toLowerCase() === 'false')) {
			value = value.toLowerCase() === 'true';
		}

		return value;
	}

	function parse(query, options) {
		options = Object.assign({
			decode: true,
			sort: true,
			arrayFormat: 'none',
			arrayFormatSeparator: ',',
			parseNumbers: false,
			parseBooleans: false
		}, options);

		validateArrayFormatSeparator(options.arrayFormatSeparator);

		const formatter = parserForArrayFormat(options);

		// Create an object with no prototype
		const ret = Object.create(null);

		if (typeof query !== 'string') {
			return ret;
		}

		query = query.trim().replace(/^[?#&]/, '');

		if (!query) {
			return ret;
		}

		for (const param of query.split('&')) {
			if (param === '') {
				continue;
			}

			let [key, value] = splitOnFirst$1(options.decode ? param.replace(/\+/g, ' ') : param, '=');

			// Missing `=` should be `null`:
			// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
			value = value === undefined ? null : ['comma', 'separator', 'bracket-separator'].includes(options.arrayFormat) ? value : decode(value, options);
			formatter(decode(key, options), value, ret);
		}

		for (const key of Object.keys(ret)) {
			const value = ret[key];
			if (typeof value === 'object' && value !== null) {
				for (const k of Object.keys(value)) {
					value[k] = parseValue(value[k], options);
				}
			} else {
				ret[key] = parseValue(value, options);
			}
		}

		if (options.sort === false) {
			return ret;
		}

		return (options.sort === true ? Object.keys(ret).sort() : Object.keys(ret).sort(options.sort)).reduce((result, key) => {
			const value = ret[key];
			if (Boolean(value) && typeof value === 'object' && !Array.isArray(value)) {
				// Sort object keys, not values
				result[key] = keysSorter(value);
			} else {
				result[key] = value;
			}

			return result;
		}, Object.create(null));
	}

	exports.extract = extract;
	exports.parse = parse;

	exports.stringify = (object, options) => {
		if (!object) {
			return '';
		}

		options = Object.assign({
			encode: true,
			strict: true,
			arrayFormat: 'none',
			arrayFormatSeparator: ','
		}, options);

		validateArrayFormatSeparator(options.arrayFormatSeparator);

		const shouldFilter = key => (
			(options.skipNull && isNullOrUndefined(object[key])) ||
			(options.skipEmptyString && object[key] === '')
		);

		const formatter = encoderForArrayFormat(options);

		const objectCopy = {};

		for (const key of Object.keys(object)) {
			if (!shouldFilter(key)) {
				objectCopy[key] = object[key];
			}
		}

		const keys = Object.keys(objectCopy);

		if (options.sort !== false) {
			keys.sort(options.sort);
		}

		return keys.map(key => {
			const value = object[key];

			if (value === undefined) {
				return '';
			}

			if (value === null) {
				return encode(key, options);
			}

			if (Array.isArray(value)) {
				if (value.length === 0 && options.arrayFormat === 'bracket-separator') {
					return encode(key, options) + '[]';
				}

				return value
					.reduce(formatter(key), [])
					.join('&');
			}

			return encode(key, options) + '=' + encode(value, options);
		}).filter(x => x.length > 0).join('&');
	};

	exports.parseUrl = (url, options) => {
		options = Object.assign({
			decode: true
		}, options);

		const [url_, hash] = splitOnFirst$1(url, '#');

		return Object.assign(
			{
				url: url_.split('?')[0] || '',
				query: parse(extract(url), options)
			},
			options && options.parseFragmentIdentifier && hash ? {fragmentIdentifier: decode(hash, options)} : {}
		);
	};

	exports.stringifyUrl = (object, options) => {
		options = Object.assign({
			encode: true,
			strict: true,
			[encodeFragmentIdentifier]: true
		}, options);

		const url = removeHash(object.url).split('?')[0] || '';
		const queryFromUrl = exports.extract(object.url);
		const parsedQueryFromUrl = exports.parse(queryFromUrl, {sort: false});

		const query = Object.assign(parsedQueryFromUrl, object.query);
		let queryString = exports.stringify(query, options);
		if (queryString) {
			queryString = `?${queryString}`;
		}

		let hash = getHash(object.url);
		if (object.fragmentIdentifier) {
			hash = `#${options[encodeFragmentIdentifier] ? encode(object.fragmentIdentifier, options) : object.fragmentIdentifier}`;
		}

		return `${url}${queryString}${hash}`;
	};

	exports.pick = (input, filter, options) => {
		options = Object.assign({
			parseFragmentIdentifier: true,
			[encodeFragmentIdentifier]: false
		}, options);

		const {url, query, fragmentIdentifier} = exports.parseUrl(input, options);
		return exports.stringifyUrl({
			url,
			query: filterObject(query, filter),
			fragmentIdentifier
		}, options);
	};

	exports.exclude = (input, filter, options) => {
		const exclusionFilter = Array.isArray(filter) ? key => !filter.includes(key) : (key, value) => !filter(key, value);

		return exports.pick(input, exclusionFilter, options);
	};
} (queryString));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
var TICKER_TICK_SITE_REGEX = new RegExp("^https://.*tickertick.com/");
var HIGH_QUALITY_SOURCE_TYPE = ["us_rss", "us_sec"];
var FIN_BIZ_NEWS_QUERY = "T:fin_news";
var ANALYSIS_QUERY = "T:analysis";
var INDUSTRY_QUERY = "T:industry";
var EARNINGS_CALL_QUERY = "T:earning";
var MARKET_NEWS_QUERY = "T:market";
var TRADING_ACTIVITY_QUERY = "T:trade";
var SEC_FILING_QUERY = "(and s:sec tld:gov)";
var GOV_QUERY = "(diff tld:gov s:sec)"; // Note that foreign companies' 6-k forms for quarterly earnings
// are not included here.

var FINANCIAL_SEC_FILING_QUERY = "T:sec_fin";
var IPO_SEC_QUERY = "T:sec_ipo";
var SEC_IMPORTANT_FILING_QUERY = "T:sec_important";
var UNIMPORTANT_SEC_FILING_QUERY = "\n(diff \n    ".concat(SEC_FILING_QUERY, "\n    ").concat(SEC_IMPORTANT_FILING_QUERY, "\n)\n");
var UGC_QUERY = "T:ugc";
var kExclusionQueryMap = {
  unimportant_sec_filing: UNIMPORTANT_SEC_FILING_QUERY,
  ugc: UGC_QUERY,
  trading_activity: TRADING_ACTIVITY_QUERY,
  market_news: MARKET_NEWS_QUERY
};
var BEST_TAG = ".best.";
var kStoryTypeQueryMap = {
  sec_filing: SEC_FILING_QUERY,
  financial_sec_filing: FINANCIAL_SEC_FILING_QUERY,
  ipo_sec_filing: IPO_SEC_QUERY,
  earnings_call: EARNINGS_CALL_QUERY,
  trading_activity: TRADING_ACTIVITY_QUERY,
  market_news: MARKET_NEWS_QUERY,
  financial_business_news: FIN_BIZ_NEWS_QUERY,
  analysis: ANALYSIS_QUERY,
  industry: INDUSTRY_QUERY,
  government: GOV_QUERY
};
var kSecStoryTypes = new Set(["earnings_call", "sec_filing", "financial_sec_filing", "ipo_sec_filing"]);

var isValidUrl = function isValidUrl(url) {
  var isValid = false;

  try {
    new URL(url);
    isValid = true;
  } catch (e) {
    console.error("Invalid URL: " + url);
  }

  return isValid;
};

var isBest = function isBest(story) {
  if (story.tags && story.tags.indexOf(BEST_TAG) >= 0) {
    return true;
  }

  if (story.best) {
    return true;
  }

  return false;
};

function extractTopStories(stories) {
  var minClusterSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;
  var topStories = [];

  var _iterator = _createForOfIteratorHelper(stories),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var story = _step.value;
      var isTopStory = false;

      if (minClusterSize == 1) {
        isTopStory = isBest(story);
      } else if (story.similar_stories) {
        if (1 + story.similar_stories.length >= minClusterSize) {
          isTopStory = true;
        } else if (isBest(story)) {
          isTopStory = true;
        } else if (story.similar_stories_full) {
          var _iterator2 = _createForOfIteratorHelper(story.similar_stories_full),
              _step2;

          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var ss = _step2.value;

              if (isBest(story)) {
                isTopStory = true;
                break;
              }
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
        }
      }

      if (isTopStory) {
        topStories.push(story);
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return topStories;
}
function getTopStories(stories) {
  for (var clusterSize = 3; clusterSize >= 1; --clusterSize) {
    var top_stories = extractTopStories(stories, clusterSize);

    if (top_stories.length > 0) {
      return top_stories;
    }
  }

  return stories;
} // May throw an exception

function fetchStories(_x) {
  return _fetchStories.apply(this, arguments);
}

function _fetchStories() {
  _fetchStories = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(feedUrl) {
    var response, result, id_to_story, similar_stories, removed_stories, _iterator5, _step5, story, bestIdx, _iterator7, _step7, similar_story_id, primary_stories, _iterator6, _step6, _story, _iterator8, _step8, sid;

    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return fetch(feedUrl);

          case 2:
            response = _context.sent;

            if (!(response.status !== 200)) {
              _context.next = 6;
              break;
            }

            if (window) {
              window.Swal.fire("Try again?", "FAILED TO FETCH FEEDS", "error");
            }

            return _context.abrupt("return");

          case 6:
            _context.next = 8;
            return response.json();

          case 8:
            result = _context.sent;
            id_to_story = new Map();
            similar_stories = new Set();
            removed_stories = new Set();
            _iterator5 = _createForOfIteratorHelper(result.stories);

            try {
              for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
                story = _step5.value;

                if (isBest(story)) {
                  story.best = true;
                  bestIdx = story.tags.indexOf(BEST_TAG);

                  if (bestIdx >= 0) {
                    story.tags.splice(bestIdx, 1);

                    if (story.tags.length == 0) {
                      delete story.tags;
                    }
                  }
                } // Remove 'favicon_url' to any other site.


                if (story.favicon_url && !story.favicon_url.match(TICKER_TICK_SITE_REGEX)) {
                  delete story.favicon_url;
                } // Remove invalid 'url'


                if (!isValidUrl(story.url)) {
                  removed_stories.add(story.id);
                }

                id_to_story[story.id] = story;

                if (story.similar_stories) {
                  _iterator7 = _createForOfIteratorHelper(story.similar_stories);

                  try {
                    for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
                      similar_story_id = _step7.value;
                      similar_stories.add(similar_story_id);
                    }
                  } catch (err) {
                    _iterator7.e(err);
                  } finally {
                    _iterator7.f();
                  }
                }
              }
            } catch (err) {
              _iterator5.e(err);
            } finally {
              _iterator5.f();
            }

            primary_stories = [];
            _iterator6 = _createForOfIteratorHelper(result.stories);
            _context.prev = 16;

            _iterator6.s();

          case 18:
            if ((_step6 = _iterator6.n()).done) {
              _context.next = 26;
              break;
            }

            _story = _step6.value;

            if (!(similar_stories.has(_story.id) || removed_stories.has(_story.id))) {
              _context.next = 22;
              break;
            }

            return _context.abrupt("continue", 24);

          case 22:
            if (_story.similar_stories) {
              _story.similar_stories_full = [];
              _iterator8 = _createForOfIteratorHelper(_story.similar_stories);

              try {
                for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
                  sid = _step8.value;

                  if (!removed_stories.has(sid)) {
                    _story.similar_stories_full.push(id_to_story[sid]);
                  }
                }
              } catch (err) {
                _iterator8.e(err);
              } finally {
                _iterator8.f();
              }
            }

            primary_stories.push(_story);

          case 24:
            _context.next = 18;
            break;

          case 26:
            _context.next = 31;
            break;

          case 28:
            _context.prev = 28;
            _context.t0 = _context["catch"](16);

            _iterator6.e(_context.t0);

          case 31:
            _context.prev = 31;

            _iterator6.f();

            return _context.finish(31);

          case 34:
            result.stories = primary_stories;
            return _context.abrupt("return", result);

          case 36:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[16, 28, 31, 34]]);
  }));
  return _fetchStories.apply(this, arguments);
}

function getBlockedWebsitesTerm(blocked_websites) {
  var blocked_websites_terms = blocked_websites.map(function (website) {
    var parts = website.split(".");

    if (parts.length < 2) {
      // Not a valid website
      return "";
    }

    var domain_term = "s:" + parts[0];
    var tld_term = "tld:" + parts.slice(1).join(".");
    return "(and ".concat(domain_term, " ").concat(tld_term, ")");
  }).filter( // Remove empty terms
  function (term) {
    return term.length > 0;
  });

  if (blocked_websites_terms.length == 0) {
    return null;
  }

  if (blocked_websites_terms.length == 1) {
    return blocked_websites_terms[0];
  }

  return "(or ".concat(blocked_websites_terms.join(" "), ")");
}

var buildFeedUrlParameters = function buildFeedUrlParameters(tickers, filters) {
  var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  if (typeof tickers === "string") {
    tickers = [tickers];
  }

  filters = Object.assign(kDefaultFilter, filters);
  var lastId = opts.lastId,
      useSourceTypes = opts.useSourceTypes,
      blocked_websites = opts.blocked_websites;
  var params = new URLSearchParams(); // Return true iff the filters only look for SEC stories.

  var onlySecStories = function onlySecStories(story_types) {
    var non_sec_types = 0;
    var types = 0;

    var _iterator3 = _createForOfIteratorHelper(story_types),
        _step3;

    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var type = _step3.value;

        if (kStoryTypeQueryMap[type]) {
          types++;

          if (!kSecStoryTypes.has(type)) {
            non_sec_types++;
          }
        }
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }

    return types > 0 && non_sec_types == 0;
  };

  var only_sec_stories = onlySecStories(filters.storyTypes);
  var ticker_term_prefix = "tt:";

  if (only_sec_stories) {
    // This is an optimization to help the backend retrieve stories faster.
    ticker_term_prefix = "t0:";
  }

  var or_terms = tickers.map(function (t) {
    var term = ticker_term_prefix + t;

    if (only_sec_stories) {
      return term;
    } // "TT:" only matches titles.


    var title_term = ticker_term_prefix.toUpperCase() + t;
    var high_prio_story_type_queries = [FIN_BIZ_NEWS_QUERY, ANALYSIS_QUERY, INDUSTRY_QUERY, EARNINGS_CALL_QUERY];
    var top_type_terms = "(or ".concat(high_prio_story_type_queries.join(" "), ")"); // Only fin news stories can match descriptions. 

    return "(or ".concat(title_term, " (and tag:").concat(BEST_TAG, " ").concat(term, " ").concat(top_type_terms, "))");
  });
  var query = "(or ".concat(or_terms.join(" "), ")");

  if (useSourceTypes) {
    // ( and (or ) (or ) )
    query = "(and ".concat(query, " (or ").concat(HIGH_QUALITY_SOURCE_TYPE.map(function (t) {
      return "st:" + t;
    }).join(" "), "))");
  }

  if (lastId) {
    params.append("last", lastId);
  }

  var extractSubqueries = function extractSubqueries(key_to_subquery_map, key_array) {
    var queries = [];

    var _iterator4 = _createForOfIteratorHelper(key_array),
        _step4;

    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var key = _step4.value;

        if (key_to_subquery_map[key]) {
          queries.push(key_to_subquery_map[key]);
        } else if (key == "most_relevant") {
          var t0_or = tickers.map(function (t) {
            return "T0:" + t;
          }).join(" ");
          queries.push("(or ".concat(FIN_BIZ_NEWS_QUERY, " (or ").concat(t0_or, "))"));
        }
      }
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }

    return queries;
  };

  var n = 101;
  var story_type_queries = extractSubqueries(kStoryTypeQueryMap, filters.storyTypes);

  if (story_type_queries.length > 0) {
    query = "(and ".concat(query, " (or ").concat(story_type_queries.join(" "), "))"); // It takes much longer time for the backend to retrieve the same number
    // of stories with story type constraints than without them.
    // Therefore, reduce 'n' here to shorten story fetching time.

    n = 51;
  }

  var exclusion_queries = extractSubqueries(kExclusionQueryMap, filters.exclusions);

  if (blocked_websites) {
    var blocked_websites_or_term = getBlockedWebsitesTerm(blocked_websites);

    if (blocked_websites_or_term) {
      exclusion_queries.push(blocked_websites_or_term);
    }
  }

  if (exclusion_queries.length > 0) {
    query = "(diff ".concat(query, " (or ").concat(exclusion_queries.join(" "), "))");
  } // http protocal doesn't limit the url length.
  // The TickerTick backend http server doesn't have a limit either.


  if (query.length > 4000) {
    console.error("Backend search query too long (".concat(query.length, " bytes) for filters: ").concat(filters));
  }

  params.append("n", n);
  params.append("q", query);
  return params;
};
var buildUrlWithUtmParams = function buildUrlWithUtmParams(url, utmParams) {
  var urlObj = new URL(url);
  var parsed = queryString.parse(urlObj.search);
  var newUrlSearch = queryString.stringify(_objectSpread(_objectSpread({}, parsed), {}, {
    utm_source: utmParams.utm_source,
    utm_campaign: utmParams.utm_campaign,
    utm_medium: utmParams.utm_medium
  }));
  urlObj.search = "?".concat(newUrlSearch);
  return urlObj.toString(); // urlObj.href also works
};

export { buildFeedUrlParameters, buildUrlWithUtmParams, convertFilter2KV, convertKV2Filter, extractTopStories, fetchStories, getTopStories, kDefaultFilter, kFullFilterObject };
