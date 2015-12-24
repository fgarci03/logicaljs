(function () {
  var root = typeof self === 'object' && self.self === self && self ||
    typeof global === 'object' && global.global === global && global ||
    this;

  // Create a safe reference to the Logical object for use below.
  var logical = function (obj) {
    if (obj instanceof logical) return obj;
    if (!(this instanceof logical)) return new logical(obj);
  };

  // Save the previous value of the `logical` variable.
  var previousLogical = root.logical;

  // Run Logical.js in *noConflict* mode, returning the `logical` variable to its
  // previous owner. Returns a reference to the Logical object.
  logical.noConflict = function () {
    root.logical = previousLogical;
    return this;
  };


  //-----------------
  // Helpers
  //-----------------

  var collectionIsNotArrayError = new Error("Collection MUST be an array. Doh!");

  var isArray = function (object) {
    return Object.prototype.toString.call(object) === '[object Array]';
  };

  /**
   * @name truthCounter
   * @description <h4><strong>Gets the number of truthful elements in a collection<strong><h4>
   *
   * @private
   * @ignore
   *
   * @param {Array} collection    The property to evaluate.
   *
   * @returns {Number}            The number of truthful elements in a collection.
   */
  var truthCounter = function (collection) {
    if (!isArray(collection)) {
      throw collectionIsNotArrayError;
    }

    var count = 0;
    for (var i = 0; i < collection.length; i++) {
      if (collection[i]) {
        count++;
      }
    }

    return count;
  };

  /**
   * @name iterator
   * @description <h4><strong>Multi purpose iterator to evaluate all kinds of expressions.<strong><h4>
   *
   * <p>It simply iterates through the collection and when it finds an element
   * that meets the criteria, it returns the value you passed in 'resultIfTrue'.
   * <br />
   * This is the main engine for checking elements where you don't need to iterate
   * the full collection to know the result - 'and', 'or', 'nor', 'nand'.</p>
   *
   * @example
   * /* iterator(collection, false, true) -> logical.and()
   *  *resultIfTrue = false; expectFalseCondition = true;
   *  *
   *
   * for (var i = 0; i < collection.length; i++) {
   *   if(!collection[i]) { // ---> expectFalseCondition, right?
   *     return false;      // ---> resultIfTrue (or: result if the condition is met)
   *   }
   * }
   * return true;           // ---> !resultIfFalse
   *
   * /* As you can see, setting the 'expectFalseCondition' to true made it check if
   *  * a given element in the collection was false. Setting the 'resultIfTrue' to
   *  * false made it return false when the condition is met.
   *
   * @private
   * @ignore
   *
   * @param {Array} collection                The collection to iterate (object or array).
   * @param {Boolean} resultIfConditionIsMet  The result returned if the condition is met.
   * @param {Boolean} expectFalseCondition    The condition you are looking for in order to return the defined 'resultIfConditionIsMet'.
   *
   * @returns {Boolean}                       The final result.
   */
  var iterator = function (collection, resultIfConditionIsMet, expectFalseCondition) {
    if (!isArray(collection)) {
      throw collectionIsNotArrayError;
    }

    for (var i = 0; i < collection.length; i++) {
      var condition = expectFalseCondition ? !collection[i] : collection[i];

      if (condition) {
        return resultIfConditionIsMet;
      }
    }

    return !resultIfConditionIsMet;
  };


  //-------------
  // Public Methods
  //-------------

  /**
   * @name and
   * @description <h4><strong>Checks if all the conditions are true<strong><h4>
   *
   * @example
   * var array = [false, false, true];
   * var bool = logical.and(array);
   *
   * console.log(bool); // false
   *
   *
   * @public
   * @method
   *
   * @param {Array} collection  The collection to iterate.
   *
   * @returns {Boolean}         True if all conditions are true.
   */
  logical.and = function (collection) {
    return iterator(collection, false, true);
  };

  /**
   * @name or
   * @description <h4><strong>Checks if at least one condition is true<strong><h4>
   *
   * @example
   * var array = [false, false, true];
   * var bool = logical.or(array);
   *
   * console.log(bool); // true
   *
   *
   * @public
   * @method
   *
   * @param {Array} collection  The collection to iterate.
   *
   * @returns {Boolean}         True if at least one condition is true.
   */
  logical.or = function (collection) {
    return iterator(collection, true, false);
  };

  /**
   * @name xor
   * @description <h4><strong>Checks if the number of truthful conditions is odd<strong><h4>
   *
   * @example
   * var array = [true, true, true];
   * var bool = logical.xor(array);
   *
   * console.log(bool); // true
   *
   *
   * @public
   * @method
   *
   * @param {Array} collection  The collection to iterate.
   *
   * @returns {Boolean}         True if the number of truthful conditions is odd.
   */
  logical.xor = function (collection) {
    var numberOfTruths = truthCounter(collection);
    var output = false;

    if (collection.length <= 3) {
      output = logical.strictXor(collection);
    } else {
      output = numberOfTruths % 2 !== 0;
    }

    return output;
  };

  /**
   * @name strictXor
   * @description <h4><strong>Checks if one and only one condition is true<strong><h4>
   *
   * @example
   * var array = [false, false, true];
   * var bool = logical.strictXor(array);
   *
   * console.log(bool); // true
   *
   *
   * @public
   * @method
   *
   * @param {Array} collection  The collection to iterate.
   *
   * @returns {Boolean}         True if one and only one condition is true.
   */
  logical.strictXor = function (collection) {
    if (!isArray(collection)) {
      throw collectionIsNotArrayError;
    }

    var count = 0;

    for (var i = 0; i < collection.length; i++) {
      if (collection[i]) {
        count++;
        if (count > 1) {
          break;
        }
      }
    }

    return count === 1;
  };

  /**
   * @name nor
   * @description <h4><strong>Checks if no condition is true<strong><h4>
   *
   * @example
   * var array = [false, false, true];
   * var bool = logical.nor(array);
   *
   * console.log(bool); // false
   *
   *
   * @public
   * @method
   *
   * @param {Array} collection  The collection to iterate.
   *
   * @returns {Boolean}         True if no condition is true.
   */
  logical.nor = function (collection) {
    return iterator(collection, false, false);
  };

  /**
   * @name xnor
   * @description <h4><strong>Checks if all or no condition is true<strong><h4>
   *
   * @example
   * var array = [false, false, false];
   * var bool = logical.xnor(array);
   *
   * console.log(bool); // true
   *
   *
   * @public
   * @method
   *
   * @param {Array} collection  The collection to iterate.
   *
   * @returns {Boolean}         True if all or no condition is true.
   */
  logical.xnor = function (collection) {
    /*
     * NOTE: This could be accomplished simply with
     * 'logical.and(collection) || logical.nor(collection)',
     * but it would require 2 iterations on most cases, instead of just one.
     */
    var numberOfTruthfulElements = truthCounter(collection);
    return numberOfTruthfulElements === collection.length || !numberOfTruthfulElements;
  };

  /**
   * @name nand
   * @description <h4><strong>Checks if not all conditions are true<strong><h4>
   *
   * @example
   * var array = [false, false, true];
   * var bool = logical.not(array);
   *
   * console.log(bool); // true
   *
   *
   * @public
   * @method
   *
   * @param {Array} collection  The collection to iterate.
   *
   * @returns {Boolean}         True if not all conditions are true.
   */
  logical.nand = function (collection) {
    return iterator(collection, true, true);
  };

  /**
   * @name not
   * @description <h4><strong>Inverts every element<strong><h4>
   *
   * <p><strong>NOTE</strong>: The collection is passed by reference.
   * This method does not return any value, and it changes the original collection.</p>
   *
   * @example
   * var array = [false, false, true];
   * logical.not(array);
   *
   * console.log(array); // [true, true, false]
   *
   *
   * @public
   * @method
   *
   * @param {Array} collection  The collection to iterate.
   * @return {void}             This method has no return value.
   */
  logical.not = function (collection) {
    if (!isArray(collection)) {
      throw collectionIsNotArrayError;
    }

    for (var i = 0; i < collection.length; i++) {
      collection[i] = !collection[i];
    }
  };

  //-------------

  // Export the Logical object for **Node.js**, with
  // backwards-compatibility for their old module API. If we're in
  // the browser, add `logical` as a global object.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = logical;
    }
    exports.logical = logical;
  } else {
    root.logical = logical;
  }

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, Logical registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('Logical', [], function () {
      return logical;
    });
  }
}());
