# LogicalJS
A library that performs [logic gate](https://en.wikipedia.org/wiki/Logic_gate) operations. Ever had the need to perform an XOR operation?
Ever needed to perform huge amounts of `&&` to check an **AND** operation? Then this library is for you! It features all the logic gates and then some!

### Performance
This library was build with performance in mind. It's code could be a little simpler, but would require many more unnecessary iterations to some of the collections. All tests are performed with only 100K elements lists for test speed and to avoid 'out of memory' errors. It is, however, recommended that you test with whatever huge numbers you can get away with.


## Installation
Bower: `bower install logicaljs`

Npm: `npm install logicaljs`


## Usage
The library exports the object `logical`, which has the following well-known methods:
+ **AND**: *Returns true if all inputs are true*;
+ **OR**: *Returns true if at least one input is true*;
+ **XOR**: *Returns true if one and only one condition is true*;
+ **NOR**: *Returns true none of the inputs is true*;
+ **XNOR**: *Returns true if ALL or NO inputs are true*;
+ **NAND**: *Returns true if NOT ALL inputs are true*;
+ **NOT**: *Inverts every array element's value*.

It also has a **strictXor** method. It is a strict check to see if the collection only has 1 truthful element, instead of the tradtional electronics convention of odd/parity.


For usage instructions, [please refer to the docs](https://fgarci03.github.io/logicaljs/).


## Roadmap
+ Add more test cases;
+ increase performance.

## Contributing
Guidelines for contributing are simple: have performance in mind! Please perform tests before submitting a pull request. It will be faster for me to approve them.

### How to contribute?
Just clone the repo and do `npm install` and then `grunt test`. You're all set!

## Credits
Filipe Garcia [https://github.com/fgarci03/](https://github.com/fgarci03/)

Copyright - [MIT](LICENSE.md)
