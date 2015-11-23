/**
 * Created by fgarcia on 19/09/2015.
 */

describe('LogicalJS ->', function () {
  var generateHugeCollection = function (random, elementValue) {
    var collection = [];
    elementValue = typeof elementValue === 'undefined' ? false : elementValue;

    for (var i = 0; i < 100000; i++) {
      elementValue = random ? !elementValue : elementValue;
      collection.push(elementValue);
    }

    return collection;
  };

  var hugeTruthyArray = generateHugeCollection(false, true);
  var hugeFalsyArray = generateHugeCollection(false, false);
  var hugeMixedArray = generateHugeCollection(true);

  var hugeFalsyArrayWithSingleTrue = function () {
    var newArray = hugeFalsyArray.slice();
    newArray.push(true);
    return newArray;
  };

  var hugeFalsyArrayWithDoubleTrue = function () {
    var newArray = hugeFalsyArray.slice();
    newArray.push(true, true);
    return newArray;
  };

  var hugeFalsyArrayWithTripleTrue = function () {
    var newArray = hugeFalsyArray.slice();
    newArray.push(true, true, true);
    return newArray;
  };

  describe('Methods:', function () {
    describe('logical.and', function () {
      it('should return true only and if only all elements are true', function () {
        expect(logical.and([true, true])).toBeTruthy();
        expect(logical.and([true, false])).toBeFalsy();
        expect(logical.and([false, false])).toBeFalsy();
      });

      it('should handle huge collections', function () {
        expect(logical.and(hugeTruthyArray)).toBeTruthy();
        expect(logical.and(hugeFalsyArray)).toBeFalsy();
        expect(logical.and(hugeMixedArray)).toBeFalsy();
      });
    });

    describe('logical.or', function () {
      it('should return true if at least one element is true', function () {
        expect(logical.or([true, true])).toBeTruthy();
        expect(logical.or([true, false])).toBeTruthy();
        expect(logical.or([false, false])).toBeFalsy();
      });

      it('should handle huge collections', function () {
        expect(logical.or(hugeTruthyArray)).toBeTruthy();
        expect(logical.or(hugeFalsyArray)).toBeFalsy();
        expect(logical.or(hugeMixedArray)).toBeTruthy();
      });
    });

    describe('logical.xor', function () {
      it('should return true if the number of truthful conditions is pair (and not 0) if there are more than 2 inputs', function () {
        expect(logical.xor([true, true])).toBeFalsy();
        expect(logical.xor([true, false])).toBeTruthy();
        expect(logical.xor([false, false])).toBeFalsy();
        expect(logical.xor([false, false, true])).toBeTruthy();
        expect(logical.xor([false, false, true, true])).toBeFalsy();
      });

      it('should handle huge collections', function () {
        expect(logical.xor(hugeFalsyArrayWithSingleTrue())).toBeTruthy();
        expect(logical.xor(hugeFalsyArrayWithDoubleTrue())).toBeFalsy();
        expect(logical.xor(hugeFalsyArrayWithTripleTrue())).toBeTruthy();
      });
    });

    describe('logical.strictXor', function () {
      it('should return true only and if only one element is true', function () {
        expect(logical.strictXor([true, true])).toBeFalsy();
        expect(logical.strictXor([true, false])).toBeTruthy();
        expect(logical.strictXor([false, false])).toBeFalsy();
        expect(logical.strictXor([true, false, true])).toBeFalsy();
        expect(logical.strictXor([true, false, false])).toBeTruthy();
      });

      it('should handle huge collections', function () {
        expect(logical.strictXor(hugeTruthyArray)).toBeFalsy();
        expect(logical.strictXor(hugeFalsyArray)).toBeFalsy();
        expect(logical.strictXor(hugeMixedArray)).toBeFalsy();
        expect(logical.strictXor(hugeFalsyArrayWithSingleTrue())).toBeTruthy();
        expect(logical.strictXor(hugeFalsyArrayWithDoubleTrue())).toBeFalsy();
        expect(logical.strictXor(hugeFalsyArrayWithTripleTrue())).toBeFalsy();
      });
    });

    describe('logical.nor', function () {
      it('should return true if no condition is true', function () {
        expect(logical.nor([true, true])).toBeFalsy();
        expect(logical.nor([true, false])).toBeFalsy();
        expect(logical.nor([false, false])).toBeTruthy();
        expect(logical.nor([true, false, true])).toBeFalsy();
        expect(logical.nor([true, false, false])).toBeFalsy();
      });

      it('should handle huge collections', function () {
        expect(logical.nor(hugeTruthyArray)).toBeFalsy();
        expect(logical.nor(hugeFalsyArray)).toBeTruthy();
        expect(logical.nor(hugeMixedArray)).toBeFalsy();
        expect(logical.nor(hugeFalsyArrayWithSingleTrue())).toBeFalsy();
      });
    });

    describe('logical.xnor', function () {
      it('should return true if none or all conditions are true', function () {
        expect(logical.xnor([true, true])).toBeTruthy();
        expect(logical.xnor([true, false])).toBeFalsy();
        expect(logical.xnor([false, false])).toBeTruthy();
        expect(logical.xnor([true, false, true])).toBeFalsy();
        expect(logical.xnor([true, false, false])).toBeFalsy();
      });

      it('should handle huge collections', function () {
        expect(logical.xnor(hugeTruthyArray)).toBeTruthy();
        expect(logical.xnor(hugeFalsyArray)).toBeTruthy();
        expect(logical.xnor(hugeMixedArray)).toBeFalsy();
        expect(logical.xnor(hugeFalsyArrayWithSingleTrue())).toBeFalsy();
      });
    });

    describe('logical.nand', function () {
      it('should return true if not all conditions are true', function () {
        expect(logical.nand([true, true])).toBeFalsy();
        expect(logical.nand([true, false])).toBeTruthy();
        expect(logical.nand([false, false])).toBeTruthy();
        expect(logical.nand([true, false, true])).toBeTruthy();
        expect(logical.nand([true, false, false])).toBeTruthy();
      });

      it('should handle huge collections', function () {
        expect(logical.nand(hugeTruthyArray)).toBeFalsy();
        expect(logical.nand(hugeFalsyArray)).toBeTruthy();
        expect(logical.nand(hugeMixedArray)).toBeTruthy();
        expect(logical.nand(hugeFalsyArrayWithSingleTrue())).toBeTruthy();
      });
    });

    describe('logical.not', function () {
      it('should return an array with the inverse of each element', function () {
        var mixedArray = [true, false, true, false];
        var invertedMixedArray = [false, true, false, true];

        logical.not(mixedArray);
        expect(mixedArray).toEqual(invertedMixedArray);
      });

      it('should handle huge collections', function () {
        logical.not(hugeTruthyArray);
        expect(hugeTruthyArray).toEqual(hugeFalsyArray);
      });
    });
  });

  describe('Handling other data types', function () {
    it('should throw on other data types', function () {
      expect(function () {
        logical.and();
      }).toThrow();

      expect(function () {
        logical.or(null)
      }).toThrow();

      expect(function () {
        logical.strictXor(7337)
      }).toThrow();

      expect(function () {
        logical.nand(0)
      }).toThrow();

      expect(function () {
        logical.nand({})
      }).toThrow();
    });
  });
});
