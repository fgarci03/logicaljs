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

  // Current version.
  logical.VERSION = '0.0.1';


  //-----------------
  // Helpers
  //-----------------

  var collectionIsNotArrayError = new Error("Collection MUST be an array. Doh!");

  var isArray = function (object) {
    return Object.prototype.toString.call(object) === '[object Array]';
  };

  /**
   * @name truthCounter
   * @description Gets the number of truthful elements in a collection
   * @private
   *
   * @param {Array} collection    The property to evaluate
   *
   * @returns {Number}            The number of truthful elements in a collection
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
   * @description <h3>Multi purpose iterator to evaluate all kinds of expressions.</h3>
   *
   * <p>It simply iterates through the collection and when it finds an element
   * that meets the criteria, it returns the value you passed in 'resultIfTrue'.
   * <br />
   * This is the main engine for checking elements where you don't need to iterate
   * the full collection to know the result - 'and', 'or', 'nor', 'nand'.</p>
   *
   * @private
   *
   * @param {Array} collection                The collection to iterate (object or array)
   * @param {Boolean} resultIfConditionIsMet  The result returned if the condition is met
   * @param {Boolean} expectFalseCondition    The condition you are looking for in order to return the defined 'resultIfConditionIsMet'
   *
   * @tutorial    Check each method's documentation for a better explanation of what it is doing.
   *
   * @returns {Boolean}                       The final result
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
   * @name AND
   * @description <h3>Checks if all the conditions are true</h3>
   *
   * <strong>iterator(collection, false, true) - What Is It Doing?</strong>
   * <code>resultIfTrue = false; expectFalseCondition = true;</code>
   *
   * <br /><br />
   *
   * <pre>
   * for (var i = 0; i < collection.length; i++) {
   *   if(!collection[i]) { // ---> expectFalseCondition, right?
   *     return false;      // ---> resultIfTrue (or: result if the condition is met)
   *   }
   * }
   * return true;           // ---> !resultIfFalse
   * </pre>
   *
   * <p>As you can see, setting the 'expectFalseCondition' to true made it check if
   * a given element in the collection was false. Setting the 'resultIfTrue' to
   * false made it return false when the condition is met.</p>
   *
   *
   * @public
   *
   * @param {Array} collection  The collection to iterate
   *
   * @returns {Boolean}         True if all conditions are true
   */
  logical.and = function (collection) {
    return iterator(collection, false, true);
  };

  /**
   * @name OR
   * @description <h3>Checks if at least one condition is true</h3>
   *
   * <strong>iterator(collection, true, false) - What Is It Doing?</strong>
   * <code>resultIfTrue = true; expectFalseCondition = false;</code>
   *
   * <br /><br />
   *
   * <pre>
   * for (var i = 0; i < collection.length; i++) {
   *   if(collection[i]) {
   *     return true;
   *   }
   * }
   * return false;
   * </pre>
   *
   *
   * @public
   *
   * @param {Array} collection  The collection to iterate
   *
   * @returns {Boolean}         True if at least one condition is true
   */
  logical.or = function (collection) {
    return iterator(collection, true, false);
  };

  /**
   * @name XOR
   * @description <h3>Checks if the number of truthful conditions is odd</h3>
   * @public
   *
   * @param {Array} collection  The collection to iterate
   *
   * @returns {Boolean}         True if the number of truthful conditions is odd
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
   * @name XOR
   * @description <h3>Checks if one and only one condition is true</h3>
   *
   * @public
   *
   * @param {Array} collection  The collection to iterate
   *
   * @returns {Boolean}         True if one and only one condition is true
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
   * @name NOR
   * @description <h3>Checks if no condition is true</h3>
   *
   * <strong>iterator(collection, false, false) - What Is It Doing?</strong>
   * <code>resultIfTrue = false; expectFalseCondition = false;</code>
   *
   * <br /><br />
   *
   * <pre>
   * for (var i = 0; i < collection.length; i++) {
   *   if(collection[i]) {
   *     return false;
   *   }
   * }
   * return true;
   * </pre>
   *
   *
   * @public
   *
   * @param {Array} collection  The collection to iterate
   *
   * @returns {Boolean}         True if no condition is true
   */
  logical.nor = function (collection) {
    return iterator(collection, false, false);
  };

  /**
   * @name XNOR
   * @description <h3>Checks if all or no condition is true</h3>
   *
   * @public
   *
   * @param {Array} collection  The collection to iterate
   *
   * @returns {Boolean}         True if all or no condition is true
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
   * @name NAND
   * @description <h3>Checks if not all conditions are true</h3>
   *
   * <strong>iterator(collection, true, true) - What Is It Doing?</strong>
   * <code>resultIfTrue = true; expectFalseCondition = true;</code>
   *
   * <br /><br />
   *
   * <pre>
   * for (var i = 0; i < collection.length; i++) {
   *   if(!collection[i]) {
   *     return true;
   *   }
   * }
   * return false;
   * </pre>
   *
   *
   * @public
   *
   * @param {Array} collection  The collection to iterate
   *
   * @returns {Boolean}         True if not all conditions are true
   */
  logical.nand = function (collection) {
    return iterator(collection, true, true);
  };

  /**
   * @name NOT
   * @description <h3>Inverts every element</h3>
   *
   * <p><strong>NOTE</strong>: The collection is passed by reference.
   * This method does not return any value, and it changes the original collection.</p>
   *
   * @public
   *
   * @param {Array} collection  The collection to iterate
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
