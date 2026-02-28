(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod4) => function __require() {
    return mod4 || (0, cb[__getOwnPropNames(cb)[0]])((mod4 = { exports: {} }).exports, mod4), mod4.exports;
  };
  var __copyProps = (to2, from3, except3, desc) => {
    if (from3 && typeof from3 === "object" || typeof from3 === "function") {
      for (let key2 of __getOwnPropNames(from3))
        if (!__hasOwnProp.call(to2, key2) && key2 !== except3)
          __defProp(to2, key2, { get: () => from3[key2], enumerable: !(desc = __getOwnPropDesc(from3, key2)) || desc.enumerable });
    }
    return to2;
  };
  var __toESM = (mod4, isNodeMode, target6) => (target6 = mod4 != null ? __create(__getProtoOf(mod4)) : {}, __copyProps(
    isNodeMode || !mod4 || !mod4.__esModule ? __defProp(target6, "default", { value: mod4, enumerable: true }) : target6,
    mod4
  ));

  // node_modules/big-integer/BigInteger.js
  var require_BigInteger = __commonJS({
    "node_modules/big-integer/BigInteger.js"(exports, module) {
      var bigInt2 = function(undefined2) {
        "use strict";
        var BASE = 1e7, LOG_BASE = 7, MAX_INT = 9007199254740992, MAX_INT_ARR = smallToArray(MAX_INT), DEFAULT_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";
        var supportsNativeBigInt = typeof BigInt === "function";
        function Integer(v, radix, alphabet, caseSensitive) {
          if (typeof v === "undefined")
            return Integer[0];
          if (typeof radix !== "undefined")
            return +radix === 10 && !alphabet ? parseValue(v) : parseBase(v, radix, alphabet, caseSensitive);
          return parseValue(v);
        }
        function BigInteger(value18, sign2) {
          this.value = value18;
          this.sign = sign2;
          this.isSmall = false;
        }
        BigInteger.prototype = Object.create(Integer.prototype);
        function SmallInteger(value18) {
          this.value = value18;
          this.sign = value18 < 0;
          this.isSmall = true;
        }
        SmallInteger.prototype = Object.create(Integer.prototype);
        function NativeBigInt(value18) {
          this.value = value18;
        }
        NativeBigInt.prototype = Object.create(Integer.prototype);
        function isPrecise(n) {
          return -MAX_INT < n && n < MAX_INT;
        }
        function smallToArray(n) {
          if (n < 1e7)
            return [n];
          if (n < 1e14)
            return [n % 1e7, Math.floor(n / 1e7)];
          return [n % 1e7, Math.floor(n / 1e7) % 1e7, Math.floor(n / 1e14)];
        }
        function arrayToSmall(arr) {
          trim2(arr);
          var length9 = arr.length;
          if (length9 < 4 && compareAbs(arr, MAX_INT_ARR) < 0) {
            switch (length9) {
              case 0:
                return 0;
              case 1:
                return arr[0];
              case 2:
                return arr[0] + arr[1] * BASE;
              default:
                return arr[0] + (arr[1] + arr[2] * BASE) * BASE;
            }
          }
          return arr;
        }
        function trim2(v) {
          var i3 = v.length;
          while (v[--i3] === 0)
            ;
          v.length = i3 + 1;
        }
        function createArray(length9) {
          var x = new Array(length9);
          var i3 = -1;
          while (++i3 < length9) {
            x[i3] = 0;
          }
          return x;
        }
        function truncate(n) {
          if (n > 0)
            return Math.floor(n);
          return Math.ceil(n);
        }
        function add2(a2, b2) {
          var l_a = a2.length, l_b = b2.length, r = new Array(l_a), carry = 0, base2 = BASE, sum3, i3;
          for (i3 = 0; i3 < l_b; i3++) {
            sum3 = a2[i3] + b2[i3] + carry;
            carry = sum3 >= base2 ? 1 : 0;
            r[i3] = sum3 - carry * base2;
          }
          while (i3 < l_a) {
            sum3 = a2[i3] + carry;
            carry = sum3 === base2 ? 1 : 0;
            r[i3++] = sum3 - carry * base2;
          }
          if (carry > 0)
            r.push(carry);
          return r;
        }
        function addAny(a2, b2) {
          if (a2.length >= b2.length)
            return add2(a2, b2);
          return add2(b2, a2);
        }
        function addSmall(a2, carry) {
          var l = a2.length, r = new Array(l), base2 = BASE, sum3, i3;
          for (i3 = 0; i3 < l; i3++) {
            sum3 = a2[i3] - base2 + carry;
            carry = Math.floor(sum3 / base2);
            r[i3] = sum3 - carry * base2;
            carry += 1;
          }
          while (carry > 0) {
            r[i3++] = carry % base2;
            carry = Math.floor(carry / base2);
          }
          return r;
        }
        BigInteger.prototype.add = function(v) {
          var n = parseValue(v);
          if (this.sign !== n.sign) {
            return this.subtract(n.negate());
          }
          var a2 = this.value, b2 = n.value;
          if (n.isSmall) {
            return new BigInteger(addSmall(a2, Math.abs(b2)), this.sign);
          }
          return new BigInteger(addAny(a2, b2), this.sign);
        };
        BigInteger.prototype.plus = BigInteger.prototype.add;
        SmallInteger.prototype.add = function(v) {
          var n = parseValue(v);
          var a2 = this.value;
          if (a2 < 0 !== n.sign) {
            return this.subtract(n.negate());
          }
          var b2 = n.value;
          if (n.isSmall) {
            if (isPrecise(a2 + b2))
              return new SmallInteger(a2 + b2);
            b2 = smallToArray(Math.abs(b2));
          }
          return new BigInteger(addSmall(b2, Math.abs(a2)), a2 < 0);
        };
        SmallInteger.prototype.plus = SmallInteger.prototype.add;
        NativeBigInt.prototype.add = function(v) {
          return new NativeBigInt(this.value + parseValue(v).value);
        };
        NativeBigInt.prototype.plus = NativeBigInt.prototype.add;
        function subtract(a2, b2) {
          var a_l = a2.length, b_l = b2.length, r = new Array(a_l), borrow = 0, base2 = BASE, i3, difference3;
          for (i3 = 0; i3 < b_l; i3++) {
            difference3 = a2[i3] - borrow - b2[i3];
            if (difference3 < 0) {
              difference3 += base2;
              borrow = 1;
            } else
              borrow = 0;
            r[i3] = difference3;
          }
          for (i3 = b_l; i3 < a_l; i3++) {
            difference3 = a2[i3] - borrow;
            if (difference3 < 0)
              difference3 += base2;
            else {
              r[i3++] = difference3;
              break;
            }
            r[i3] = difference3;
          }
          for (; i3 < a_l; i3++) {
            r[i3] = a2[i3];
          }
          trim2(r);
          return r;
        }
        function subtractAny(a2, b2, sign2) {
          var value18;
          if (compareAbs(a2, b2) >= 0) {
            value18 = subtract(a2, b2);
          } else {
            value18 = subtract(b2, a2);
            sign2 = !sign2;
          }
          value18 = arrayToSmall(value18);
          if (typeof value18 === "number") {
            if (sign2)
              value18 = -value18;
            return new SmallInteger(value18);
          }
          return new BigInteger(value18, sign2);
        }
        function subtractSmall(a2, b2, sign2) {
          var l = a2.length, r = new Array(l), carry = -b2, base2 = BASE, i3, difference3;
          for (i3 = 0; i3 < l; i3++) {
            difference3 = a2[i3] + carry;
            carry = Math.floor(difference3 / base2);
            difference3 %= base2;
            r[i3] = difference3 < 0 ? difference3 + base2 : difference3;
          }
          r = arrayToSmall(r);
          if (typeof r === "number") {
            if (sign2)
              r = -r;
            return new SmallInteger(r);
          }
          return new BigInteger(r, sign2);
        }
        BigInteger.prototype.subtract = function(v) {
          var n = parseValue(v);
          if (this.sign !== n.sign) {
            return this.add(n.negate());
          }
          var a2 = this.value, b2 = n.value;
          if (n.isSmall)
            return subtractSmall(a2, Math.abs(b2), this.sign);
          return subtractAny(a2, b2, this.sign);
        };
        BigInteger.prototype.minus = BigInteger.prototype.subtract;
        SmallInteger.prototype.subtract = function(v) {
          var n = parseValue(v);
          var a2 = this.value;
          if (a2 < 0 !== n.sign) {
            return this.add(n.negate());
          }
          var b2 = n.value;
          if (n.isSmall) {
            return new SmallInteger(a2 - b2);
          }
          return subtractSmall(b2, Math.abs(a2), a2 >= 0);
        };
        SmallInteger.prototype.minus = SmallInteger.prototype.subtract;
        NativeBigInt.prototype.subtract = function(v) {
          return new NativeBigInt(this.value - parseValue(v).value);
        };
        NativeBigInt.prototype.minus = NativeBigInt.prototype.subtract;
        BigInteger.prototype.negate = function() {
          return new BigInteger(this.value, !this.sign);
        };
        SmallInteger.prototype.negate = function() {
          var sign2 = this.sign;
          var small2 = new SmallInteger(-this.value);
          small2.sign = !sign2;
          return small2;
        };
        NativeBigInt.prototype.negate = function() {
          return new NativeBigInt(-this.value);
        };
        BigInteger.prototype.abs = function() {
          return new BigInteger(this.value, false);
        };
        SmallInteger.prototype.abs = function() {
          return new SmallInteger(Math.abs(this.value));
        };
        NativeBigInt.prototype.abs = function() {
          return new NativeBigInt(this.value >= 0 ? this.value : -this.value);
        };
        function multiplyLong(a2, b2) {
          var a_l = a2.length, b_l = b2.length, l = a_l + b_l, r = createArray(l), base2 = BASE, product4, carry, i3, a_i, b_j;
          for (i3 = 0; i3 < a_l; ++i3) {
            a_i = a2[i3];
            for (var j = 0; j < b_l; ++j) {
              b_j = b2[j];
              product4 = a_i * b_j + r[i3 + j];
              carry = Math.floor(product4 / base2);
              r[i3 + j] = product4 - carry * base2;
              r[i3 + j + 1] += carry;
            }
          }
          trim2(r);
          return r;
        }
        function multiplySmall(a2, b2) {
          var l = a2.length, r = new Array(l), base2 = BASE, carry = 0, product4, i3;
          for (i3 = 0; i3 < l; i3++) {
            product4 = a2[i3] * b2 + carry;
            carry = Math.floor(product4 / base2);
            r[i3] = product4 - carry * base2;
          }
          while (carry > 0) {
            r[i3++] = carry % base2;
            carry = Math.floor(carry / base2);
          }
          return r;
        }
        function shiftLeft(x, n) {
          var r = [];
          while (n-- > 0)
            r.push(0);
          return r.concat(x);
        }
        function multiplyKaratsuba(x, y) {
          var n = Math.max(x.length, y.length);
          if (n <= 30)
            return multiplyLong(x, y);
          n = Math.ceil(n / 2);
          var b2 = x.slice(n), a2 = x.slice(0, n), d = y.slice(n), c = y.slice(0, n);
          var ac = multiplyKaratsuba(a2, c), bd = multiplyKaratsuba(b2, d), abcd = multiplyKaratsuba(addAny(a2, b2), addAny(c, d));
          var product4 = addAny(addAny(ac, shiftLeft(subtract(subtract(abcd, ac), bd), n)), shiftLeft(bd, 2 * n));
          trim2(product4);
          return product4;
        }
        function useKaratsuba(l1, l2) {
          return -0.012 * l1 - 0.012 * l2 + 15e-6 * l1 * l2 > 0;
        }
        BigInteger.prototype.multiply = function(v) {
          var n = parseValue(v), a2 = this.value, b2 = n.value, sign2 = this.sign !== n.sign, abs3;
          if (n.isSmall) {
            if (b2 === 0)
              return Integer[0];
            if (b2 === 1)
              return this;
            if (b2 === -1)
              return this.negate();
            abs3 = Math.abs(b2);
            if (abs3 < BASE) {
              return new BigInteger(multiplySmall(a2, abs3), sign2);
            }
            b2 = smallToArray(abs3);
          }
          if (useKaratsuba(a2.length, b2.length))
            return new BigInteger(multiplyKaratsuba(a2, b2), sign2);
          return new BigInteger(multiplyLong(a2, b2), sign2);
        };
        BigInteger.prototype.times = BigInteger.prototype.multiply;
        function multiplySmallAndArray(a2, b2, sign2) {
          if (a2 < BASE) {
            return new BigInteger(multiplySmall(b2, a2), sign2);
          }
          return new BigInteger(multiplyLong(b2, smallToArray(a2)), sign2);
        }
        SmallInteger.prototype._multiplyBySmall = function(a2) {
          if (isPrecise(a2.value * this.value)) {
            return new SmallInteger(a2.value * this.value);
          }
          return multiplySmallAndArray(Math.abs(a2.value), smallToArray(Math.abs(this.value)), this.sign !== a2.sign);
        };
        BigInteger.prototype._multiplyBySmall = function(a2) {
          if (a2.value === 0)
            return Integer[0];
          if (a2.value === 1)
            return this;
          if (a2.value === -1)
            return this.negate();
          return multiplySmallAndArray(Math.abs(a2.value), this.value, this.sign !== a2.sign);
        };
        SmallInteger.prototype.multiply = function(v) {
          return parseValue(v)._multiplyBySmall(this);
        };
        SmallInteger.prototype.times = SmallInteger.prototype.multiply;
        NativeBigInt.prototype.multiply = function(v) {
          return new NativeBigInt(this.value * parseValue(v).value);
        };
        NativeBigInt.prototype.times = NativeBigInt.prototype.multiply;
        function square(a2) {
          var l = a2.length, r = createArray(l + l), base2 = BASE, product4, carry, i3, a_i, a_j;
          for (i3 = 0; i3 < l; i3++) {
            a_i = a2[i3];
            carry = 0 - a_i * a_i;
            for (var j = i3; j < l; j++) {
              a_j = a2[j];
              product4 = 2 * (a_i * a_j) + r[i3 + j] + carry;
              carry = Math.floor(product4 / base2);
              r[i3 + j] = product4 - carry * base2;
            }
            r[i3 + l] = carry;
          }
          trim2(r);
          return r;
        }
        BigInteger.prototype.square = function() {
          return new BigInteger(square(this.value), false);
        };
        SmallInteger.prototype.square = function() {
          var value18 = this.value * this.value;
          if (isPrecise(value18))
            return new SmallInteger(value18);
          return new BigInteger(square(smallToArray(Math.abs(this.value))), false);
        };
        NativeBigInt.prototype.square = function(v) {
          return new NativeBigInt(this.value * this.value);
        };
        function divMod1(a2, b2) {
          var a_l = a2.length, b_l = b2.length, base2 = BASE, result = createArray(b2.length), divisorMostSignificantDigit = b2[b_l - 1], lambda = Math.ceil(base2 / (2 * divisorMostSignificantDigit)), remainder2 = multiplySmall(a2, lambda), divisor = multiplySmall(b2, lambda), quotientDigit, shift, carry, borrow, i3, l, q2;
          if (remainder2.length <= a_l)
            remainder2.push(0);
          divisor.push(0);
          divisorMostSignificantDigit = divisor[b_l - 1];
          for (shift = a_l - b_l; shift >= 0; shift--) {
            quotientDigit = base2 - 1;
            if (remainder2[shift + b_l] !== divisorMostSignificantDigit) {
              quotientDigit = Math.floor((remainder2[shift + b_l] * base2 + remainder2[shift + b_l - 1]) / divisorMostSignificantDigit);
            }
            carry = 0;
            borrow = 0;
            l = divisor.length;
            for (i3 = 0; i3 < l; i3++) {
              carry += quotientDigit * divisor[i3];
              q2 = Math.floor(carry / base2);
              borrow += remainder2[shift + i3] - (carry - q2 * base2);
              carry = q2;
              if (borrow < 0) {
                remainder2[shift + i3] = borrow + base2;
                borrow = -1;
              } else {
                remainder2[shift + i3] = borrow;
                borrow = 0;
              }
            }
            while (borrow !== 0) {
              quotientDigit -= 1;
              carry = 0;
              for (i3 = 0; i3 < l; i3++) {
                carry += remainder2[shift + i3] - base2 + divisor[i3];
                if (carry < 0) {
                  remainder2[shift + i3] = carry + base2;
                  carry = 0;
                } else {
                  remainder2[shift + i3] = carry;
                  carry = 1;
                }
              }
              borrow += carry;
            }
            result[shift] = quotientDigit;
          }
          remainder2 = divModSmall(remainder2, lambda)[0];
          return [arrayToSmall(result), arrayToSmall(remainder2)];
        }
        function divMod2(a2, b2) {
          var a_l = a2.length, b_l = b2.length, result = [], part = [], base2 = BASE, guess, xlen, highx, highy, check;
          while (a_l) {
            part.unshift(a2[--a_l]);
            trim2(part);
            if (compareAbs(part, b2) < 0) {
              result.push(0);
              continue;
            }
            xlen = part.length;
            highx = part[xlen - 1] * base2 + part[xlen - 2];
            highy = b2[b_l - 1] * base2 + b2[b_l - 2];
            if (xlen > b_l) {
              highx = (highx + 1) * base2;
            }
            guess = Math.ceil(highx / highy);
            do {
              check = multiplySmall(b2, guess);
              if (compareAbs(check, part) <= 0)
                break;
              guess--;
            } while (guess);
            result.push(guess);
            part = subtract(part, check);
          }
          result.reverse();
          return [arrayToSmall(result), arrayToSmall(part)];
        }
        function divModSmall(value18, lambda) {
          var length9 = value18.length, quotient = createArray(length9), base2 = BASE, i3, q2, remainder2, divisor;
          remainder2 = 0;
          for (i3 = length9 - 1; i3 >= 0; --i3) {
            divisor = remainder2 * base2 + value18[i3];
            q2 = truncate(divisor / lambda);
            remainder2 = divisor - q2 * lambda;
            quotient[i3] = q2 | 0;
          }
          return [quotient, remainder2 | 0];
        }
        function divModAny(self, v) {
          var value18, n = parseValue(v);
          if (supportsNativeBigInt) {
            return [new NativeBigInt(self.value / n.value), new NativeBigInt(self.value % n.value)];
          }
          var a2 = self.value, b2 = n.value;
          var quotient;
          if (b2 === 0)
            throw new Error("Cannot divide by zero");
          if (self.isSmall) {
            if (n.isSmall) {
              return [new SmallInteger(truncate(a2 / b2)), new SmallInteger(a2 % b2)];
            }
            return [Integer[0], self];
          }
          if (n.isSmall) {
            if (b2 === 1)
              return [self, Integer[0]];
            if (b2 == -1)
              return [self.negate(), Integer[0]];
            var abs3 = Math.abs(b2);
            if (abs3 < BASE) {
              value18 = divModSmall(a2, abs3);
              quotient = arrayToSmall(value18[0]);
              var remainder2 = value18[1];
              if (self.sign)
                remainder2 = -remainder2;
              if (typeof quotient === "number") {
                if (self.sign !== n.sign)
                  quotient = -quotient;
                return [new SmallInteger(quotient), new SmallInteger(remainder2)];
              }
              return [new BigInteger(quotient, self.sign !== n.sign), new SmallInteger(remainder2)];
            }
            b2 = smallToArray(abs3);
          }
          var comparison = compareAbs(a2, b2);
          if (comparison === -1)
            return [Integer[0], self];
          if (comparison === 0)
            return [Integer[self.sign === n.sign ? 1 : -1], Integer[0]];
          if (a2.length + b2.length <= 200)
            value18 = divMod1(a2, b2);
          else
            value18 = divMod2(a2, b2);
          quotient = value18[0];
          var qSign = self.sign !== n.sign, mod4 = value18[1], mSign = self.sign;
          if (typeof quotient === "number") {
            if (qSign)
              quotient = -quotient;
            quotient = new SmallInteger(quotient);
          } else
            quotient = new BigInteger(quotient, qSign);
          if (typeof mod4 === "number") {
            if (mSign)
              mod4 = -mod4;
            mod4 = new SmallInteger(mod4);
          } else
            mod4 = new BigInteger(mod4, mSign);
          return [quotient, mod4];
        }
        BigInteger.prototype.divmod = function(v) {
          var result = divModAny(this, v);
          return {
            quotient: result[0],
            remainder: result[1]
          };
        };
        NativeBigInt.prototype.divmod = SmallInteger.prototype.divmod = BigInteger.prototype.divmod;
        BigInteger.prototype.divide = function(v) {
          return divModAny(this, v)[0];
        };
        NativeBigInt.prototype.over = NativeBigInt.prototype.divide = function(v) {
          return new NativeBigInt(this.value / parseValue(v).value);
        };
        SmallInteger.prototype.over = SmallInteger.prototype.divide = BigInteger.prototype.over = BigInteger.prototype.divide;
        BigInteger.prototype.mod = function(v) {
          return divModAny(this, v)[1];
        };
        NativeBigInt.prototype.mod = NativeBigInt.prototype.remainder = function(v) {
          return new NativeBigInt(this.value % parseValue(v).value);
        };
        SmallInteger.prototype.remainder = SmallInteger.prototype.mod = BigInteger.prototype.remainder = BigInteger.prototype.mod;
        BigInteger.prototype.pow = function(v) {
          var n = parseValue(v), a2 = this.value, b2 = n.value, value18, x, y;
          if (b2 === 0)
            return Integer[1];
          if (a2 === 0)
            return Integer[0];
          if (a2 === 1)
            return Integer[1];
          if (a2 === -1)
            return n.isEven() ? Integer[1] : Integer[-1];
          if (n.sign) {
            return Integer[0];
          }
          if (!n.isSmall)
            throw new Error("The exponent " + n.toString() + " is too large.");
          if (this.isSmall) {
            if (isPrecise(value18 = Math.pow(a2, b2)))
              return new SmallInteger(truncate(value18));
          }
          x = this;
          y = Integer[1];
          while (true) {
            if (b2 & true) {
              y = y.times(x);
              --b2;
            }
            if (b2 === 0)
              break;
            b2 /= 2;
            x = x.square();
          }
          return y;
        };
        SmallInteger.prototype.pow = BigInteger.prototype.pow;
        NativeBigInt.prototype.pow = function(v) {
          var n = parseValue(v);
          var a2 = this.value, b2 = n.value;
          var _0 = BigInt(0), _1 = BigInt(1), _2 = BigInt(2);
          if (b2 === _0)
            return Integer[1];
          if (a2 === _0)
            return Integer[0];
          if (a2 === _1)
            return Integer[1];
          if (a2 === BigInt(-1))
            return n.isEven() ? Integer[1] : Integer[-1];
          if (n.isNegative())
            return new NativeBigInt(_0);
          var x = this;
          var y = Integer[1];
          while (true) {
            if ((b2 & _1) === _1) {
              y = y.times(x);
              --b2;
            }
            if (b2 === _0)
              break;
            b2 /= _2;
            x = x.square();
          }
          return y;
        };
        BigInteger.prototype.modPow = function(exp2, mod4) {
          exp2 = parseValue(exp2);
          mod4 = parseValue(mod4);
          if (mod4.isZero())
            throw new Error("Cannot take modPow with modulus 0");
          var r = Integer[1], base2 = this.mod(mod4);
          if (exp2.isNegative()) {
            exp2 = exp2.multiply(Integer[-1]);
            base2 = base2.modInv(mod4);
          }
          while (exp2.isPositive()) {
            if (base2.isZero())
              return Integer[0];
            if (exp2.isOdd())
              r = r.multiply(base2).mod(mod4);
            exp2 = exp2.divide(2);
            base2 = base2.square().mod(mod4);
          }
          return r;
        };
        NativeBigInt.prototype.modPow = SmallInteger.prototype.modPow = BigInteger.prototype.modPow;
        function compareAbs(a2, b2) {
          if (a2.length !== b2.length) {
            return a2.length > b2.length ? 1 : -1;
          }
          for (var i3 = a2.length - 1; i3 >= 0; i3--) {
            if (a2[i3] !== b2[i3])
              return a2[i3] > b2[i3] ? 1 : -1;
          }
          return 0;
        }
        BigInteger.prototype.compareAbs = function(v) {
          var n = parseValue(v), a2 = this.value, b2 = n.value;
          if (n.isSmall)
            return 1;
          return compareAbs(a2, b2);
        };
        SmallInteger.prototype.compareAbs = function(v) {
          var n = parseValue(v), a2 = Math.abs(this.value), b2 = n.value;
          if (n.isSmall) {
            b2 = Math.abs(b2);
            return a2 === b2 ? 0 : a2 > b2 ? 1 : -1;
          }
          return -1;
        };
        NativeBigInt.prototype.compareAbs = function(v) {
          var a2 = this.value;
          var b2 = parseValue(v).value;
          a2 = a2 >= 0 ? a2 : -a2;
          b2 = b2 >= 0 ? b2 : -b2;
          return a2 === b2 ? 0 : a2 > b2 ? 1 : -1;
        };
        BigInteger.prototype.compare = function(v) {
          if (v === Infinity) {
            return -1;
          }
          if (v === -Infinity) {
            return 1;
          }
          var n = parseValue(v), a2 = this.value, b2 = n.value;
          if (this.sign !== n.sign) {
            return n.sign ? 1 : -1;
          }
          if (n.isSmall) {
            return this.sign ? -1 : 1;
          }
          return compareAbs(a2, b2) * (this.sign ? -1 : 1);
        };
        BigInteger.prototype.compareTo = BigInteger.prototype.compare;
        SmallInteger.prototype.compare = function(v) {
          if (v === Infinity) {
            return -1;
          }
          if (v === -Infinity) {
            return 1;
          }
          var n = parseValue(v), a2 = this.value, b2 = n.value;
          if (n.isSmall) {
            return a2 == b2 ? 0 : a2 > b2 ? 1 : -1;
          }
          if (a2 < 0 !== n.sign) {
            return a2 < 0 ? -1 : 1;
          }
          return a2 < 0 ? 1 : -1;
        };
        SmallInteger.prototype.compareTo = SmallInteger.prototype.compare;
        NativeBigInt.prototype.compare = function(v) {
          if (v === Infinity) {
            return -1;
          }
          if (v === -Infinity) {
            return 1;
          }
          var a2 = this.value;
          var b2 = parseValue(v).value;
          return a2 === b2 ? 0 : a2 > b2 ? 1 : -1;
        };
        NativeBigInt.prototype.compareTo = NativeBigInt.prototype.compare;
        BigInteger.prototype.equals = function(v) {
          return this.compare(v) === 0;
        };
        NativeBigInt.prototype.eq = NativeBigInt.prototype.equals = SmallInteger.prototype.eq = SmallInteger.prototype.equals = BigInteger.prototype.eq = BigInteger.prototype.equals;
        BigInteger.prototype.notEquals = function(v) {
          return this.compare(v) !== 0;
        };
        NativeBigInt.prototype.neq = NativeBigInt.prototype.notEquals = SmallInteger.prototype.neq = SmallInteger.prototype.notEquals = BigInteger.prototype.neq = BigInteger.prototype.notEquals;
        BigInteger.prototype.greater = function(v) {
          return this.compare(v) > 0;
        };
        NativeBigInt.prototype.gt = NativeBigInt.prototype.greater = SmallInteger.prototype.gt = SmallInteger.prototype.greater = BigInteger.prototype.gt = BigInteger.prototype.greater;
        BigInteger.prototype.lesser = function(v) {
          return this.compare(v) < 0;
        };
        NativeBigInt.prototype.lt = NativeBigInt.prototype.lesser = SmallInteger.prototype.lt = SmallInteger.prototype.lesser = BigInteger.prototype.lt = BigInteger.prototype.lesser;
        BigInteger.prototype.greaterOrEquals = function(v) {
          return this.compare(v) >= 0;
        };
        NativeBigInt.prototype.geq = NativeBigInt.prototype.greaterOrEquals = SmallInteger.prototype.geq = SmallInteger.prototype.greaterOrEquals = BigInteger.prototype.geq = BigInteger.prototype.greaterOrEquals;
        BigInteger.prototype.lesserOrEquals = function(v) {
          return this.compare(v) <= 0;
        };
        NativeBigInt.prototype.leq = NativeBigInt.prototype.lesserOrEquals = SmallInteger.prototype.leq = SmallInteger.prototype.lesserOrEquals = BigInteger.prototype.leq = BigInteger.prototype.lesserOrEquals;
        BigInteger.prototype.isEven = function() {
          return (this.value[0] & 1) === 0;
        };
        SmallInteger.prototype.isEven = function() {
          return (this.value & 1) === 0;
        };
        NativeBigInt.prototype.isEven = function() {
          return (this.value & BigInt(1)) === BigInt(0);
        };
        BigInteger.prototype.isOdd = function() {
          return (this.value[0] & 1) === 1;
        };
        SmallInteger.prototype.isOdd = function() {
          return (this.value & 1) === 1;
        };
        NativeBigInt.prototype.isOdd = function() {
          return (this.value & BigInt(1)) === BigInt(1);
        };
        BigInteger.prototype.isPositive = function() {
          return !this.sign;
        };
        SmallInteger.prototype.isPositive = function() {
          return this.value > 0;
        };
        NativeBigInt.prototype.isPositive = SmallInteger.prototype.isPositive;
        BigInteger.prototype.isNegative = function() {
          return this.sign;
        };
        SmallInteger.prototype.isNegative = function() {
          return this.value < 0;
        };
        NativeBigInt.prototype.isNegative = SmallInteger.prototype.isNegative;
        BigInteger.prototype.isUnit = function() {
          return false;
        };
        SmallInteger.prototype.isUnit = function() {
          return Math.abs(this.value) === 1;
        };
        NativeBigInt.prototype.isUnit = function() {
          return this.abs().value === BigInt(1);
        };
        BigInteger.prototype.isZero = function() {
          return false;
        };
        SmallInteger.prototype.isZero = function() {
          return this.value === 0;
        };
        NativeBigInt.prototype.isZero = function() {
          return this.value === BigInt(0);
        };
        BigInteger.prototype.isDivisibleBy = function(v) {
          var n = parseValue(v);
          if (n.isZero())
            return false;
          if (n.isUnit())
            return true;
          if (n.compareAbs(2) === 0)
            return this.isEven();
          return this.mod(n).isZero();
        };
        NativeBigInt.prototype.isDivisibleBy = SmallInteger.prototype.isDivisibleBy = BigInteger.prototype.isDivisibleBy;
        function isBasicPrime(v) {
          var n = v.abs();
          if (n.isUnit())
            return false;
          if (n.equals(2) || n.equals(3) || n.equals(5))
            return true;
          if (n.isEven() || n.isDivisibleBy(3) || n.isDivisibleBy(5))
            return false;
          if (n.lesser(49))
            return true;
        }
        function millerRabinTest(n, a2) {
          var nPrev = n.prev(), b2 = nPrev, r = 0, d, t, i3, x;
          while (b2.isEven())
            b2 = b2.divide(2), r++;
          next:
            for (i3 = 0; i3 < a2.length; i3++) {
              if (n.lesser(a2[i3]))
                continue;
              x = bigInt2(a2[i3]).modPow(b2, n);
              if (x.isUnit() || x.equals(nPrev))
                continue;
              for (d = r - 1; d != 0; d--) {
                x = x.square().mod(n);
                if (x.isUnit())
                  return false;
                if (x.equals(nPrev))
                  continue next;
              }
              return false;
            }
          return true;
        }
        BigInteger.prototype.isPrime = function(strict) {
          var isPrime = isBasicPrime(this);
          if (isPrime !== undefined2)
            return isPrime;
          var n = this.abs();
          var bits = n.bitLength();
          if (bits <= 64)
            return millerRabinTest(n, [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]);
          var logN = Math.log(2) * bits.toJSNumber();
          var t = Math.ceil(strict === true ? 2 * Math.pow(logN, 2) : logN);
          for (var a2 = [], i3 = 0; i3 < t; i3++) {
            a2.push(bigInt2(i3 + 2));
          }
          return millerRabinTest(n, a2);
        };
        NativeBigInt.prototype.isPrime = SmallInteger.prototype.isPrime = BigInteger.prototype.isPrime;
        BigInteger.prototype.isProbablePrime = function(iterations, rng) {
          var isPrime = isBasicPrime(this);
          if (isPrime !== undefined2)
            return isPrime;
          var n = this.abs();
          var t = iterations === undefined2 ? 5 : iterations;
          for (var a2 = [], i3 = 0; i3 < t; i3++) {
            a2.push(bigInt2.randBetween(2, n.minus(2), rng));
          }
          return millerRabinTest(n, a2);
        };
        NativeBigInt.prototype.isProbablePrime = SmallInteger.prototype.isProbablePrime = BigInteger.prototype.isProbablePrime;
        BigInteger.prototype.modInv = function(n) {
          var t = bigInt2.zero, newT = bigInt2.one, r = parseValue(n), newR = this.abs(), q2, lastT, lastR;
          while (!newR.isZero()) {
            q2 = r.divide(newR);
            lastT = t;
            lastR = r;
            t = newT;
            r = newR;
            newT = lastT.subtract(q2.multiply(newT));
            newR = lastR.subtract(q2.multiply(newR));
          }
          if (!r.isUnit())
            throw new Error(this.toString() + " and " + n.toString() + " are not co-prime");
          if (t.compare(0) === -1) {
            t = t.add(n);
          }
          if (this.isNegative()) {
            return t.negate();
          }
          return t;
        };
        NativeBigInt.prototype.modInv = SmallInteger.prototype.modInv = BigInteger.prototype.modInv;
        BigInteger.prototype.next = function() {
          var value18 = this.value;
          if (this.sign) {
            return subtractSmall(value18, 1, this.sign);
          }
          return new BigInteger(addSmall(value18, 1), this.sign);
        };
        SmallInteger.prototype.next = function() {
          var value18 = this.value;
          if (value18 + 1 < MAX_INT)
            return new SmallInteger(value18 + 1);
          return new BigInteger(MAX_INT_ARR, false);
        };
        NativeBigInt.prototype.next = function() {
          return new NativeBigInt(this.value + BigInt(1));
        };
        BigInteger.prototype.prev = function() {
          var value18 = this.value;
          if (this.sign) {
            return new BigInteger(addSmall(value18, 1), true);
          }
          return subtractSmall(value18, 1, this.sign);
        };
        SmallInteger.prototype.prev = function() {
          var value18 = this.value;
          if (value18 - 1 > -MAX_INT)
            return new SmallInteger(value18 - 1);
          return new BigInteger(MAX_INT_ARR, true);
        };
        NativeBigInt.prototype.prev = function() {
          return new NativeBigInt(this.value - BigInt(1));
        };
        var powersOfTwo = [1];
        while (2 * powersOfTwo[powersOfTwo.length - 1] <= BASE)
          powersOfTwo.push(2 * powersOfTwo[powersOfTwo.length - 1]);
        var powers2Length = powersOfTwo.length, highestPower2 = powersOfTwo[powers2Length - 1];
        function shift_isSmall(n) {
          return Math.abs(n) <= BASE;
        }
        BigInteger.prototype.shiftLeft = function(v) {
          var n = parseValue(v).toJSNumber();
          if (!shift_isSmall(n)) {
            throw new Error(String(n) + " is too large for shifting.");
          }
          if (n < 0)
            return this.shiftRight(-n);
          var result = this;
          if (result.isZero())
            return result;
          while (n >= powers2Length) {
            result = result.multiply(highestPower2);
            n -= powers2Length - 1;
          }
          return result.multiply(powersOfTwo[n]);
        };
        NativeBigInt.prototype.shiftLeft = SmallInteger.prototype.shiftLeft = BigInteger.prototype.shiftLeft;
        BigInteger.prototype.shiftRight = function(v) {
          var remQuo;
          var n = parseValue(v).toJSNumber();
          if (!shift_isSmall(n)) {
            throw new Error(String(n) + " is too large for shifting.");
          }
          if (n < 0)
            return this.shiftLeft(-n);
          var result = this;
          while (n >= powers2Length) {
            if (result.isZero() || result.isNegative() && result.isUnit())
              return result;
            remQuo = divModAny(result, highestPower2);
            result = remQuo[1].isNegative() ? remQuo[0].prev() : remQuo[0];
            n -= powers2Length - 1;
          }
          remQuo = divModAny(result, powersOfTwo[n]);
          return remQuo[1].isNegative() ? remQuo[0].prev() : remQuo[0];
        };
        NativeBigInt.prototype.shiftRight = SmallInteger.prototype.shiftRight = BigInteger.prototype.shiftRight;
        function bitwise(x, y, fn) {
          y = parseValue(y);
          var xSign = x.isNegative(), ySign = y.isNegative();
          var xRem = xSign ? x.not() : x, yRem = ySign ? y.not() : y;
          var xDigit = 0, yDigit = 0;
          var xDivMod = null, yDivMod = null;
          var result = [];
          while (!xRem.isZero() || !yRem.isZero()) {
            xDivMod = divModAny(xRem, highestPower2);
            xDigit = xDivMod[1].toJSNumber();
            if (xSign) {
              xDigit = highestPower2 - 1 - xDigit;
            }
            yDivMod = divModAny(yRem, highestPower2);
            yDigit = yDivMod[1].toJSNumber();
            if (ySign) {
              yDigit = highestPower2 - 1 - yDigit;
            }
            xRem = xDivMod[0];
            yRem = yDivMod[0];
            result.push(fn(xDigit, yDigit));
          }
          var sum3 = fn(xSign ? 1 : 0, ySign ? 1 : 0) !== 0 ? bigInt2(-1) : bigInt2(0);
          for (var i3 = result.length - 1; i3 >= 0; i3 -= 1) {
            sum3 = sum3.multiply(highestPower2).add(bigInt2(result[i3]));
          }
          return sum3;
        }
        BigInteger.prototype.not = function() {
          return this.negate().prev();
        };
        NativeBigInt.prototype.not = SmallInteger.prototype.not = BigInteger.prototype.not;
        BigInteger.prototype.and = function(n) {
          return bitwise(this, n, function(a2, b2) {
            return a2 & b2;
          });
        };
        NativeBigInt.prototype.and = SmallInteger.prototype.and = BigInteger.prototype.and;
        BigInteger.prototype.or = function(n) {
          return bitwise(this, n, function(a2, b2) {
            return a2 | b2;
          });
        };
        NativeBigInt.prototype.or = SmallInteger.prototype.or = BigInteger.prototype.or;
        BigInteger.prototype.xor = function(n) {
          return bitwise(this, n, function(a2, b2) {
            return a2 ^ b2;
          });
        };
        NativeBigInt.prototype.xor = SmallInteger.prototype.xor = BigInteger.prototype.xor;
        var LOBMASK_I = 1 << 30, LOBMASK_BI = (BASE & -BASE) * (BASE & -BASE) | LOBMASK_I;
        function roughLOB(n) {
          var v = n.value, x = typeof v === "number" ? v | LOBMASK_I : typeof v === "bigint" ? v | BigInt(LOBMASK_I) : v[0] + v[1] * BASE | LOBMASK_BI;
          return x & -x;
        }
        function integerLogarithm(value18, base2) {
          if (base2.compareTo(value18) <= 0) {
            var tmp = integerLogarithm(value18, base2.square(base2));
            var p2 = tmp.p;
            var e = tmp.e;
            var t = p2.multiply(base2);
            return t.compareTo(value18) <= 0 ? { p: t, e: e * 2 + 1 } : { p: p2, e: e * 2 };
          }
          return { p: bigInt2(1), e: 0 };
        }
        BigInteger.prototype.bitLength = function() {
          var n = this;
          if (n.compareTo(bigInt2(0)) < 0) {
            n = n.negate().subtract(bigInt2(1));
          }
          if (n.compareTo(bigInt2(0)) === 0) {
            return bigInt2(0);
          }
          return bigInt2(integerLogarithm(n, bigInt2(2)).e).add(bigInt2(1));
        };
        NativeBigInt.prototype.bitLength = SmallInteger.prototype.bitLength = BigInteger.prototype.bitLength;
        function max10(a2, b2) {
          a2 = parseValue(a2);
          b2 = parseValue(b2);
          return a2.greater(b2) ? a2 : b2;
        }
        function min8(a2, b2) {
          a2 = parseValue(a2);
          b2 = parseValue(b2);
          return a2.lesser(b2) ? a2 : b2;
        }
        function gcd(a2, b2) {
          a2 = parseValue(a2).abs();
          b2 = parseValue(b2).abs();
          if (a2.equals(b2))
            return a2;
          if (a2.isZero())
            return b2;
          if (b2.isZero())
            return a2;
          var c = Integer[1], d, t;
          while (a2.isEven() && b2.isEven()) {
            d = min8(roughLOB(a2), roughLOB(b2));
            a2 = a2.divide(d);
            b2 = b2.divide(d);
            c = c.multiply(d);
          }
          while (a2.isEven()) {
            a2 = a2.divide(roughLOB(a2));
          }
          do {
            while (b2.isEven()) {
              b2 = b2.divide(roughLOB(b2));
            }
            if (a2.greater(b2)) {
              t = b2;
              b2 = a2;
              a2 = t;
            }
            b2 = b2.subtract(a2);
          } while (!b2.isZero());
          return c.isUnit() ? a2 : a2.multiply(c);
        }
        function lcm(a2, b2) {
          a2 = parseValue(a2).abs();
          b2 = parseValue(b2).abs();
          return a2.divide(gcd(a2, b2)).multiply(b2);
        }
        function randBetween(a2, b2, rng) {
          a2 = parseValue(a2);
          b2 = parseValue(b2);
          var usedRNG = rng || Math.random;
          var low2 = min8(a2, b2), high2 = max10(a2, b2);
          var range3 = high2.subtract(low2).add(1);
          if (range3.isSmall)
            return low2.add(Math.floor(usedRNG() * range3));
          var digits = toBase2(range3, BASE).value;
          var result = [], restricted = true;
          for (var i3 = 0; i3 < digits.length; i3++) {
            var top3 = restricted ? digits[i3] + (i3 + 1 < digits.length ? digits[i3 + 1] / BASE : 0) : BASE;
            var digit = truncate(usedRNG() * top3);
            result.push(digit);
            if (digit < digits[i3])
              restricted = false;
          }
          return low2.add(Integer.fromArray(result, BASE, false));
        }
        var parseBase = function(text7, base2, alphabet, caseSensitive) {
          alphabet = alphabet || DEFAULT_ALPHABET;
          text7 = String(text7);
          if (!caseSensitive) {
            text7 = text7.toLowerCase();
            alphabet = alphabet.toLowerCase();
          }
          var length9 = text7.length;
          var i3;
          var absBase = Math.abs(base2);
          var alphabetValues = {};
          for (i3 = 0; i3 < alphabet.length; i3++) {
            alphabetValues[alphabet[i3]] = i3;
          }
          for (i3 = 0; i3 < length9; i3++) {
            var c = text7[i3];
            if (c === "-")
              continue;
            if (c in alphabetValues) {
              if (alphabetValues[c] >= absBase) {
                if (c === "1" && absBase === 1)
                  continue;
                throw new Error(c + " is not a valid digit in base " + base2 + ".");
              }
            }
          }
          base2 = parseValue(base2);
          var digits = [];
          var isNegative = text7[0] === "-";
          for (i3 = isNegative ? 1 : 0; i3 < text7.length; i3++) {
            var c = text7[i3];
            if (c in alphabetValues)
              digits.push(parseValue(alphabetValues[c]));
            else if (c === "<") {
              var start2 = i3;
              do {
                i3++;
              } while (text7[i3] !== ">" && i3 < text7.length);
              digits.push(parseValue(text7.slice(start2 + 1, i3)));
            } else
              throw new Error(c + " is not a valid character");
          }
          return parseBaseFromArray(digits, base2, isNegative);
        };
        function parseBaseFromArray(digits, base2, isNegative) {
          var val = Integer[0], pow4 = Integer[1], i3;
          for (i3 = digits.length - 1; i3 >= 0; i3--) {
            val = val.add(digits[i3].times(pow4));
            pow4 = pow4.times(base2);
          }
          return isNegative ? val.negate() : val;
        }
        function stringify2(digit, alphabet) {
          alphabet = alphabet || DEFAULT_ALPHABET;
          if (digit < alphabet.length) {
            return alphabet[digit];
          }
          return "<" + digit + ">";
        }
        function toBase2(n, base2) {
          base2 = bigInt2(base2);
          if (base2.isZero()) {
            if (n.isZero())
              return { value: [0], isNegative: false };
            throw new Error("Cannot convert nonzero numbers to base 0.");
          }
          if (base2.equals(-1)) {
            if (n.isZero())
              return { value: [0], isNegative: false };
            if (n.isNegative())
              return {
                value: [].concat.apply(
                  [],
                  Array.apply(null, Array(-n.toJSNumber())).map(Array.prototype.valueOf, [1, 0])
                ),
                isNegative: false
              };
            var arr = Array.apply(null, Array(n.toJSNumber() - 1)).map(Array.prototype.valueOf, [0, 1]);
            arr.unshift([1]);
            return {
              value: [].concat.apply([], arr),
              isNegative: false
            };
          }
          var neg = false;
          if (n.isNegative() && base2.isPositive()) {
            neg = true;
            n = n.abs();
          }
          if (base2.isUnit()) {
            if (n.isZero())
              return { value: [0], isNegative: false };
            return {
              value: Array.apply(null, Array(n.toJSNumber())).map(Number.prototype.valueOf, 1),
              isNegative: neg
            };
          }
          var out = [];
          var left = n, divmod;
          while (left.isNegative() || left.compareAbs(base2) >= 0) {
            divmod = left.divmod(base2);
            left = divmod.quotient;
            var digit = divmod.remainder;
            if (digit.isNegative()) {
              digit = base2.minus(digit).abs();
              left = left.next();
            }
            out.push(digit.toJSNumber());
          }
          out.push(left.toJSNumber());
          return { value: out.reverse(), isNegative: neg };
        }
        function toBaseString(n, base2, alphabet) {
          var arr = toBase2(n, base2);
          return (arr.isNegative ? "-" : "") + arr.value.map(function(x) {
            return stringify2(x, alphabet);
          }).join("");
        }
        BigInteger.prototype.toArray = function(radix) {
          return toBase2(this, radix);
        };
        SmallInteger.prototype.toArray = function(radix) {
          return toBase2(this, radix);
        };
        NativeBigInt.prototype.toArray = function(radix) {
          return toBase2(this, radix);
        };
        BigInteger.prototype.toString = function(radix, alphabet) {
          if (radix === undefined2)
            radix = 10;
          if (radix !== 10)
            return toBaseString(this, radix, alphabet);
          var v = this.value, l = v.length, str = String(v[--l]), zeros = "0000000", digit;
          while (--l >= 0) {
            digit = String(v[l]);
            str += zeros.slice(digit.length) + digit;
          }
          var sign2 = this.sign ? "-" : "";
          return sign2 + str;
        };
        SmallInteger.prototype.toString = function(radix, alphabet) {
          if (radix === undefined2)
            radix = 10;
          if (radix != 10)
            return toBaseString(this, radix, alphabet);
          return String(this.value);
        };
        NativeBigInt.prototype.toString = SmallInteger.prototype.toString;
        NativeBigInt.prototype.toJSON = BigInteger.prototype.toJSON = SmallInteger.prototype.toJSON = function() {
          return this.toString();
        };
        BigInteger.prototype.valueOf = function() {
          return parseInt(this.toString(), 10);
        };
        BigInteger.prototype.toJSNumber = BigInteger.prototype.valueOf;
        SmallInteger.prototype.valueOf = function() {
          return this.value;
        };
        SmallInteger.prototype.toJSNumber = SmallInteger.prototype.valueOf;
        NativeBigInt.prototype.valueOf = NativeBigInt.prototype.toJSNumber = function() {
          return parseInt(this.toString(), 10);
        };
        function parseStringValue(v) {
          if (isPrecise(+v)) {
            var x = +v;
            if (x === truncate(x))
              return supportsNativeBigInt ? new NativeBigInt(BigInt(x)) : new SmallInteger(x);
            throw new Error("Invalid integer: " + v);
          }
          var sign2 = v[0] === "-";
          if (sign2)
            v = v.slice(1);
          var split3 = v.split(/e/i);
          if (split3.length > 2)
            throw new Error("Invalid integer: " + split3.join("e"));
          if (split3.length === 2) {
            var exp2 = split3[1];
            if (exp2[0] === "+")
              exp2 = exp2.slice(1);
            exp2 = +exp2;
            if (exp2 !== truncate(exp2) || !isPrecise(exp2))
              throw new Error("Invalid integer: " + exp2 + " is not a valid exponent.");
            var text7 = split3[0];
            var decimalPlace = text7.indexOf(".");
            if (decimalPlace >= 0) {
              exp2 -= text7.length - decimalPlace - 1;
              text7 = text7.slice(0, decimalPlace) + text7.slice(decimalPlace + 1);
            }
            if (exp2 < 0)
              throw new Error("Cannot include negative exponent part for integers");
            text7 += new Array(exp2 + 1).join("0");
            v = text7;
          }
          var isValid2 = /^([0-9][0-9]*)$/.test(v);
          if (!isValid2)
            throw new Error("Invalid integer: " + v);
          if (supportsNativeBigInt) {
            return new NativeBigInt(BigInt(sign2 ? "-" + v : v));
          }
          var r = [], max11 = v.length, l = LOG_BASE, min9 = max11 - l;
          while (max11 > 0) {
            r.push(+v.slice(min9, max11));
            min9 -= l;
            if (min9 < 0)
              min9 = 0;
            max11 -= l;
          }
          trim2(r);
          return new BigInteger(r, sign2);
        }
        function parseNumberValue(v) {
          if (supportsNativeBigInt) {
            return new NativeBigInt(BigInt(v));
          }
          if (isPrecise(v)) {
            if (v !== truncate(v))
              throw new Error(v + " is not an integer.");
            return new SmallInteger(v);
          }
          return parseStringValue(v.toString());
        }
        function parseValue(v) {
          if (typeof v === "number") {
            return parseNumberValue(v);
          }
          if (typeof v === "string") {
            return parseStringValue(v);
          }
          if (typeof v === "bigint") {
            return new NativeBigInt(v);
          }
          return v;
        }
        for (var i2 = 0; i2 < 1e3; i2++) {
          Integer[i2] = parseValue(i2);
          if (i2 > 0)
            Integer[-i2] = parseValue(-i2);
        }
        Integer.one = Integer[1];
        Integer.zero = Integer[0];
        Integer.minusOne = Integer[-1];
        Integer.max = max10;
        Integer.min = min8;
        Integer.gcd = gcd;
        Integer.lcm = lcm;
        Integer.isInstance = function(x) {
          return x instanceof BigInteger || x instanceof SmallInteger || x instanceof NativeBigInt;
        };
        Integer.randBetween = randBetween;
        Integer.fromArray = function(digits, base2, isNegative) {
          return parseBaseFromArray(digits.map(parseValue), parseValue(base2 || 10), isNegative);
        };
        return Integer;
      }();
      if (typeof module !== "undefined" && module.hasOwnProperty("exports")) {
        module.exports = bigInt2;
      }
      if (typeof define === "function" && define.amd) {
        define(function() {
          return bigInt2;
        });
      }
    }
  });

  // output/Effect.Aff/foreign.js
  var Aff = function() {
    var EMPTY = {};
    var PURE = "Pure";
    var THROW = "Throw";
    var CATCH = "Catch";
    var SYNC = "Sync";
    var ASYNC = "Async";
    var BIND = "Bind";
    var BRACKET = "Bracket";
    var FORK = "Fork";
    var SEQ = "Sequential";
    var MAP = "Map";
    var APPLY = "Apply";
    var ALT = "Alt";
    var CONS = "Cons";
    var RESUME = "Resume";
    var RELEASE = "Release";
    var FINALIZER = "Finalizer";
    var FINALIZED = "Finalized";
    var FORKED = "Forked";
    var FIBER = "Fiber";
    var THUNK = "Thunk";
    function Aff2(tag, _1, _2, _3) {
      this.tag = tag;
      this._1 = _1;
      this._2 = _2;
      this._3 = _3;
    }
    function AffCtr(tag) {
      var fn = function(_1, _2, _3) {
        return new Aff2(tag, _1, _2, _3);
      };
      fn.tag = tag;
      return fn;
    }
    function nonCanceler2(error4) {
      return new Aff2(PURE, void 0);
    }
    function runEff(eff) {
      try {
        eff();
      } catch (error4) {
        setTimeout(function() {
          throw error4;
        }, 0);
      }
    }
    function runSync(left, right, eff) {
      try {
        return right(eff());
      } catch (error4) {
        return left(error4);
      }
    }
    function runAsync(left, eff, k) {
      try {
        return eff(k)();
      } catch (error4) {
        k(left(error4))();
        return nonCanceler2;
      }
    }
    var Scheduler = function() {
      var limit = 1024;
      var size5 = 0;
      var ix = 0;
      var queue = new Array(limit);
      var draining = false;
      function drain() {
        var thunk;
        draining = true;
        while (size5 !== 0) {
          size5--;
          thunk = queue[ix];
          queue[ix] = void 0;
          ix = (ix + 1) % limit;
          thunk();
        }
        draining = false;
      }
      return {
        isDraining: function() {
          return draining;
        },
        enqueue: function(cb) {
          var i2, tmp;
          if (size5 === limit) {
            tmp = draining;
            drain();
            draining = tmp;
          }
          queue[(ix + size5) % limit] = cb;
          size5++;
          if (!draining) {
            drain();
          }
        }
      };
    }();
    function Supervisor(util) {
      var fibers = {};
      var fiberId = 0;
      var count = 0;
      return {
        register: function(fiber) {
          var fid = fiberId++;
          fiber.onComplete({
            rethrow: true,
            handler: function(result) {
              return function() {
                count--;
                delete fibers[fid];
              };
            }
          })();
          fibers[fid] = fiber;
          count++;
        },
        isEmpty: function() {
          return count === 0;
        },
        killAll: function(killError, cb) {
          return function() {
            if (count === 0) {
              return cb();
            }
            var killCount = 0;
            var kills = {};
            function kill2(fid) {
              kills[fid] = fibers[fid].kill(killError, function(result) {
                return function() {
                  delete kills[fid];
                  killCount--;
                  if (util.isLeft(result) && util.fromLeft(result)) {
                    setTimeout(function() {
                      throw util.fromLeft(result);
                    }, 0);
                  }
                  if (killCount === 0) {
                    cb();
                  }
                };
              })();
            }
            for (var k in fibers) {
              if (fibers.hasOwnProperty(k)) {
                killCount++;
                kill2(k);
              }
            }
            fibers = {};
            fiberId = 0;
            count = 0;
            return function(error4) {
              return new Aff2(SYNC, function() {
                for (var k2 in kills) {
                  if (kills.hasOwnProperty(k2)) {
                    kills[k2]();
                  }
                }
              });
            };
          };
        }
      };
    }
    var SUSPENDED = 0;
    var CONTINUE = 1;
    var STEP_BIND = 2;
    var STEP_RESULT = 3;
    var PENDING = 4;
    var RETURN = 5;
    var COMPLETED = 6;
    function Fiber(util, supervisor, aff) {
      var runTick = 0;
      var status = SUSPENDED;
      var step5 = aff;
      var fail3 = null;
      var interrupt = null;
      var bhead = null;
      var btail = null;
      var attempts = null;
      var bracketCount = 0;
      var joinId = 0;
      var joins = null;
      var rethrow = true;
      function run5(localRunTick) {
        var tmp, result, attempt;
        while (true) {
          tmp = null;
          result = null;
          attempt = null;
          switch (status) {
            case STEP_BIND:
              status = CONTINUE;
              try {
                step5 = bhead(step5);
                if (btail === null) {
                  bhead = null;
                } else {
                  bhead = btail._1;
                  btail = btail._2;
                }
              } catch (e) {
                status = RETURN;
                fail3 = util.left(e);
                step5 = null;
              }
              break;
            case STEP_RESULT:
              if (util.isLeft(step5)) {
                status = RETURN;
                fail3 = step5;
                step5 = null;
              } else if (bhead === null) {
                status = RETURN;
              } else {
                status = STEP_BIND;
                step5 = util.fromRight(step5);
              }
              break;
            case CONTINUE:
              switch (step5.tag) {
                case BIND:
                  if (bhead) {
                    btail = new Aff2(CONS, bhead, btail);
                  }
                  bhead = step5._2;
                  status = CONTINUE;
                  step5 = step5._1;
                  break;
                case PURE:
                  if (bhead === null) {
                    status = RETURN;
                    step5 = util.right(step5._1);
                  } else {
                    status = STEP_BIND;
                    step5 = step5._1;
                  }
                  break;
                case SYNC:
                  status = STEP_RESULT;
                  step5 = runSync(util.left, util.right, step5._1);
                  break;
                case ASYNC:
                  status = PENDING;
                  step5 = runAsync(util.left, step5._1, function(result2) {
                    return function() {
                      if (runTick !== localRunTick) {
                        return;
                      }
                      runTick++;
                      Scheduler.enqueue(function() {
                        if (runTick !== localRunTick + 1) {
                          return;
                        }
                        status = STEP_RESULT;
                        step5 = result2;
                        run5(runTick);
                      });
                    };
                  });
                  return;
                case THROW:
                  status = RETURN;
                  fail3 = util.left(step5._1);
                  step5 = null;
                  break;
                case CATCH:
                  if (bhead === null) {
                    attempts = new Aff2(CONS, step5, attempts, interrupt);
                  } else {
                    attempts = new Aff2(CONS, step5, new Aff2(CONS, new Aff2(RESUME, bhead, btail), attempts, interrupt), interrupt);
                  }
                  bhead = null;
                  btail = null;
                  status = CONTINUE;
                  step5 = step5._1;
                  break;
                case BRACKET:
                  bracketCount++;
                  if (bhead === null) {
                    attempts = new Aff2(CONS, step5, attempts, interrupt);
                  } else {
                    attempts = new Aff2(CONS, step5, new Aff2(CONS, new Aff2(RESUME, bhead, btail), attempts, interrupt), interrupt);
                  }
                  bhead = null;
                  btail = null;
                  status = CONTINUE;
                  step5 = step5._1;
                  break;
                case FORK:
                  status = STEP_RESULT;
                  tmp = Fiber(util, supervisor, step5._2);
                  if (supervisor) {
                    supervisor.register(tmp);
                  }
                  if (step5._1) {
                    tmp.run();
                  }
                  step5 = util.right(tmp);
                  break;
                case SEQ:
                  status = CONTINUE;
                  step5 = sequential4(util, supervisor, step5._1);
                  break;
              }
              break;
            case RETURN:
              bhead = null;
              btail = null;
              if (attempts === null) {
                status = COMPLETED;
                step5 = interrupt || fail3 || step5;
              } else {
                tmp = attempts._3;
                attempt = attempts._1;
                attempts = attempts._2;
                switch (attempt.tag) {
                  case CATCH:
                    if (interrupt && interrupt !== tmp && bracketCount === 0) {
                      status = RETURN;
                    } else if (fail3) {
                      status = CONTINUE;
                      step5 = attempt._2(util.fromLeft(fail3));
                      fail3 = null;
                    }
                    break;
                  case RESUME:
                    if (interrupt && interrupt !== tmp && bracketCount === 0 || fail3) {
                      status = RETURN;
                    } else {
                      bhead = attempt._1;
                      btail = attempt._2;
                      status = STEP_BIND;
                      step5 = util.fromRight(step5);
                    }
                    break;
                  case BRACKET:
                    bracketCount--;
                    if (fail3 === null) {
                      result = util.fromRight(step5);
                      attempts = new Aff2(CONS, new Aff2(RELEASE, attempt._2, result), attempts, tmp);
                      if (interrupt === tmp || bracketCount > 0) {
                        status = CONTINUE;
                        step5 = attempt._3(result);
                      }
                    }
                    break;
                  case RELEASE:
                    attempts = new Aff2(CONS, new Aff2(FINALIZED, step5, fail3), attempts, interrupt);
                    status = CONTINUE;
                    if (interrupt && interrupt !== tmp && bracketCount === 0) {
                      step5 = attempt._1.killed(util.fromLeft(interrupt))(attempt._2);
                    } else if (fail3) {
                      step5 = attempt._1.failed(util.fromLeft(fail3))(attempt._2);
                    } else {
                      step5 = attempt._1.completed(util.fromRight(step5))(attempt._2);
                    }
                    fail3 = null;
                    bracketCount++;
                    break;
                  case FINALIZER:
                    bracketCount++;
                    attempts = new Aff2(CONS, new Aff2(FINALIZED, step5, fail3), attempts, interrupt);
                    status = CONTINUE;
                    step5 = attempt._1;
                    break;
                  case FINALIZED:
                    bracketCount--;
                    status = RETURN;
                    step5 = attempt._1;
                    fail3 = attempt._2;
                    break;
                }
              }
              break;
            case COMPLETED:
              for (var k in joins) {
                if (joins.hasOwnProperty(k)) {
                  rethrow = rethrow && joins[k].rethrow;
                  runEff(joins[k].handler(step5));
                }
              }
              joins = null;
              if (interrupt && fail3) {
                setTimeout(function() {
                  throw util.fromLeft(fail3);
                }, 0);
              } else if (util.isLeft(step5) && rethrow) {
                setTimeout(function() {
                  if (rethrow) {
                    throw util.fromLeft(step5);
                  }
                }, 0);
              }
              return;
            case SUSPENDED:
              status = CONTINUE;
              break;
            case PENDING:
              return;
          }
        }
      }
      function onComplete(join8) {
        return function() {
          if (status === COMPLETED) {
            rethrow = rethrow && join8.rethrow;
            join8.handler(step5)();
            return function() {
            };
          }
          var jid = joinId++;
          joins = joins || {};
          joins[jid] = join8;
          return function() {
            if (joins !== null) {
              delete joins[jid];
            }
          };
        };
      }
      function kill2(error4, cb) {
        return function() {
          if (status === COMPLETED) {
            cb(util.right(void 0))();
            return function() {
            };
          }
          var canceler = onComplete({
            rethrow: false,
            handler: function() {
              return cb(util.right(void 0));
            }
          })();
          switch (status) {
            case SUSPENDED:
              interrupt = util.left(error4);
              status = COMPLETED;
              step5 = interrupt;
              run5(runTick);
              break;
            case PENDING:
              if (interrupt === null) {
                interrupt = util.left(error4);
              }
              if (bracketCount === 0) {
                if (status === PENDING) {
                  attempts = new Aff2(CONS, new Aff2(FINALIZER, step5(error4)), attempts, interrupt);
                }
                status = RETURN;
                step5 = null;
                fail3 = null;
                run5(++runTick);
              }
              break;
            default:
              if (interrupt === null) {
                interrupt = util.left(error4);
              }
              if (bracketCount === 0) {
                status = RETURN;
                step5 = null;
                fail3 = null;
              }
          }
          return canceler;
        };
      }
      function join7(cb) {
        return function() {
          var canceler = onComplete({
            rethrow: false,
            handler: cb
          })();
          if (status === SUSPENDED) {
            run5(runTick);
          }
          return canceler;
        };
      }
      return {
        kill: kill2,
        join: join7,
        onComplete,
        isSuspended: function() {
          return status === SUSPENDED;
        },
        run: function() {
          if (status === SUSPENDED) {
            if (!Scheduler.isDraining()) {
              Scheduler.enqueue(function() {
                run5(runTick);
              });
            } else {
              run5(runTick);
            }
          }
        }
      };
    }
    function runPar(util, supervisor, par, cb) {
      var fiberId = 0;
      var fibers = {};
      var killId = 0;
      var kills = {};
      var early = new Error("[ParAff] Early exit");
      var interrupt = null;
      var root2 = EMPTY;
      function kill2(error4, par2, cb2) {
        var step5 = par2;
        var head6 = null;
        var tail3 = null;
        var count = 0;
        var kills2 = {};
        var tmp, kid;
        loop:
          while (true) {
            tmp = null;
            switch (step5.tag) {
              case FORKED:
                if (step5._3 === EMPTY) {
                  tmp = fibers[step5._1];
                  kills2[count++] = tmp.kill(error4, function(result) {
                    return function() {
                      count--;
                      if (count === 0) {
                        cb2(result)();
                      }
                    };
                  });
                }
                if (head6 === null) {
                  break loop;
                }
                step5 = head6._2;
                if (tail3 === null) {
                  head6 = null;
                } else {
                  head6 = tail3._1;
                  tail3 = tail3._2;
                }
                break;
              case MAP:
                step5 = step5._2;
                break;
              case APPLY:
              case ALT:
                if (head6) {
                  tail3 = new Aff2(CONS, head6, tail3);
                }
                head6 = step5;
                step5 = step5._1;
                break;
            }
          }
        if (count === 0) {
          cb2(util.right(void 0))();
        } else {
          kid = 0;
          tmp = count;
          for (; kid < tmp; kid++) {
            kills2[kid] = kills2[kid]();
          }
        }
        return kills2;
      }
      function join7(result, head6, tail3) {
        var fail3, step5, lhs, rhs, tmp, kid;
        if (util.isLeft(result)) {
          fail3 = result;
          step5 = null;
        } else {
          step5 = result;
          fail3 = null;
        }
        loop:
          while (true) {
            lhs = null;
            rhs = null;
            tmp = null;
            kid = null;
            if (interrupt !== null) {
              return;
            }
            if (head6 === null) {
              cb(fail3 || step5)();
              return;
            }
            if (head6._3 !== EMPTY) {
              return;
            }
            switch (head6.tag) {
              case MAP:
                if (fail3 === null) {
                  head6._3 = util.right(head6._1(util.fromRight(step5)));
                  step5 = head6._3;
                } else {
                  head6._3 = fail3;
                }
                break;
              case APPLY:
                lhs = head6._1._3;
                rhs = head6._2._3;
                if (fail3) {
                  head6._3 = fail3;
                  tmp = true;
                  kid = killId++;
                  kills[kid] = kill2(early, fail3 === lhs ? head6._2 : head6._1, function() {
                    return function() {
                      delete kills[kid];
                      if (tmp) {
                        tmp = false;
                      } else if (tail3 === null) {
                        join7(fail3, null, null);
                      } else {
                        join7(fail3, tail3._1, tail3._2);
                      }
                    };
                  });
                  if (tmp) {
                    tmp = false;
                    return;
                  }
                } else if (lhs === EMPTY || rhs === EMPTY) {
                  return;
                } else {
                  step5 = util.right(util.fromRight(lhs)(util.fromRight(rhs)));
                  head6._3 = step5;
                }
                break;
              case ALT:
                lhs = head6._1._3;
                rhs = head6._2._3;
                if (lhs === EMPTY && util.isLeft(rhs) || rhs === EMPTY && util.isLeft(lhs)) {
                  return;
                }
                if (lhs !== EMPTY && util.isLeft(lhs) && rhs !== EMPTY && util.isLeft(rhs)) {
                  fail3 = step5 === lhs ? rhs : lhs;
                  step5 = null;
                  head6._3 = fail3;
                } else {
                  head6._3 = step5;
                  tmp = true;
                  kid = killId++;
                  kills[kid] = kill2(early, step5 === lhs ? head6._2 : head6._1, function() {
                    return function() {
                      delete kills[kid];
                      if (tmp) {
                        tmp = false;
                      } else if (tail3 === null) {
                        join7(step5, null, null);
                      } else {
                        join7(step5, tail3._1, tail3._2);
                      }
                    };
                  });
                  if (tmp) {
                    tmp = false;
                    return;
                  }
                }
                break;
            }
            if (tail3 === null) {
              head6 = null;
            } else {
              head6 = tail3._1;
              tail3 = tail3._2;
            }
          }
      }
      function resolve(fiber) {
        return function(result) {
          return function() {
            delete fibers[fiber._1];
            fiber._3 = result;
            join7(result, fiber._2._1, fiber._2._2);
          };
        };
      }
      function run5() {
        var status = CONTINUE;
        var step5 = par;
        var head6 = null;
        var tail3 = null;
        var tmp, fid;
        loop:
          while (true) {
            tmp = null;
            fid = null;
            switch (status) {
              case CONTINUE:
                switch (step5.tag) {
                  case MAP:
                    if (head6) {
                      tail3 = new Aff2(CONS, head6, tail3);
                    }
                    head6 = new Aff2(MAP, step5._1, EMPTY, EMPTY);
                    step5 = step5._2;
                    break;
                  case APPLY:
                    if (head6) {
                      tail3 = new Aff2(CONS, head6, tail3);
                    }
                    head6 = new Aff2(APPLY, EMPTY, step5._2, EMPTY);
                    step5 = step5._1;
                    break;
                  case ALT:
                    if (head6) {
                      tail3 = new Aff2(CONS, head6, tail3);
                    }
                    head6 = new Aff2(ALT, EMPTY, step5._2, EMPTY);
                    step5 = step5._1;
                    break;
                  default:
                    fid = fiberId++;
                    status = RETURN;
                    tmp = step5;
                    step5 = new Aff2(FORKED, fid, new Aff2(CONS, head6, tail3), EMPTY);
                    tmp = Fiber(util, supervisor, tmp);
                    tmp.onComplete({
                      rethrow: false,
                      handler: resolve(step5)
                    })();
                    fibers[fid] = tmp;
                    if (supervisor) {
                      supervisor.register(tmp);
                    }
                }
                break;
              case RETURN:
                if (head6 === null) {
                  break loop;
                }
                if (head6._1 === EMPTY) {
                  head6._1 = step5;
                  status = CONTINUE;
                  step5 = head6._2;
                  head6._2 = EMPTY;
                } else {
                  head6._2 = step5;
                  step5 = head6;
                  if (tail3 === null) {
                    head6 = null;
                  } else {
                    head6 = tail3._1;
                    tail3 = tail3._2;
                  }
                }
            }
          }
        root2 = step5;
        for (fid = 0; fid < fiberId; fid++) {
          fibers[fid].run();
        }
      }
      function cancel(error4, cb2) {
        interrupt = util.left(error4);
        var innerKills;
        for (var kid in kills) {
          if (kills.hasOwnProperty(kid)) {
            innerKills = kills[kid];
            for (kid in innerKills) {
              if (innerKills.hasOwnProperty(kid)) {
                innerKills[kid]();
              }
            }
          }
        }
        kills = null;
        var newKills = kill2(error4, root2, cb2);
        return function(killError) {
          return new Aff2(ASYNC, function(killCb) {
            return function() {
              for (var kid2 in newKills) {
                if (newKills.hasOwnProperty(kid2)) {
                  newKills[kid2]();
                }
              }
              return nonCanceler2;
            };
          });
        };
      }
      run5();
      return function(killError) {
        return new Aff2(ASYNC, function(killCb) {
          return function() {
            return cancel(killError, killCb);
          };
        });
      };
    }
    function sequential4(util, supervisor, par) {
      return new Aff2(ASYNC, function(cb) {
        return function() {
          return runPar(util, supervisor, par, cb);
        };
      });
    }
    Aff2.EMPTY = EMPTY;
    Aff2.Pure = AffCtr(PURE);
    Aff2.Throw = AffCtr(THROW);
    Aff2.Catch = AffCtr(CATCH);
    Aff2.Sync = AffCtr(SYNC);
    Aff2.Async = AffCtr(ASYNC);
    Aff2.Bind = AffCtr(BIND);
    Aff2.Bracket = AffCtr(BRACKET);
    Aff2.Fork = AffCtr(FORK);
    Aff2.Seq = AffCtr(SEQ);
    Aff2.ParMap = AffCtr(MAP);
    Aff2.ParApply = AffCtr(APPLY);
    Aff2.ParAlt = AffCtr(ALT);
    Aff2.Fiber = Fiber;
    Aff2.Supervisor = Supervisor;
    Aff2.Scheduler = Scheduler;
    Aff2.nonCanceler = nonCanceler2;
    return Aff2;
  }();
  var _pure = Aff.Pure;
  var _throwError = Aff.Throw;
  function _catchError(aff) {
    return function(k) {
      return Aff.Catch(aff, k);
    };
  }
  function _map(f) {
    return function(aff) {
      if (aff.tag === Aff.Pure.tag) {
        return Aff.Pure(f(aff._1));
      } else {
        return Aff.Bind(aff, function(value18) {
          return Aff.Pure(f(value18));
        });
      }
    };
  }
  function _bind(aff) {
    return function(k) {
      return Aff.Bind(aff, k);
    };
  }
  function _fork(immediate) {
    return function(aff) {
      return Aff.Fork(immediate, aff);
    };
  }
  var _liftEffect = Aff.Sync;
  function _parAffMap(f) {
    return function(aff) {
      return Aff.ParMap(f, aff);
    };
  }
  function _parAffApply(aff1) {
    return function(aff2) {
      return Aff.ParApply(aff1, aff2);
    };
  }
  var makeAff = Aff.Async;
  function generalBracket(acquire) {
    return function(options2) {
      return function(k) {
        return Aff.Bracket(acquire, options2, k);
      };
    };
  }
  function _makeFiber(util, aff) {
    return function() {
      return Aff.Fiber(util, null, aff);
    };
  }
  var _delay = function() {
    function setDelay(n, k) {
      if (n === 0 && typeof setImmediate !== "undefined") {
        return setImmediate(k);
      } else {
        return setTimeout(k, n);
      }
    }
    function clearDelay(n, t) {
      if (n === 0 && typeof clearImmediate !== "undefined") {
        return clearImmediate(t);
      } else {
        return clearTimeout(t);
      }
    }
    return function(right, ms) {
      return Aff.Async(function(cb) {
        return function() {
          var timer = setDelay(ms, cb(right()));
          return function() {
            return Aff.Sync(function() {
              return right(clearDelay(ms, timer));
            });
          };
        };
      });
    };
  }();
  var _sequential = Aff.Seq;

  // output/Control.Apply/foreign.js
  var arrayApply = function(fs) {
    return function(xs) {
      var l = fs.length;
      var k = xs.length;
      var result = new Array(l * k);
      var n = 0;
      for (var i2 = 0; i2 < l; i2++) {
        var f = fs[i2];
        for (var j = 0; j < k; j++) {
          result[n++] = f(xs[j]);
        }
      }
      return result;
    };
  };

  // output/Control.Semigroupoid/index.js
  var semigroupoidFn = {
    compose: function(f) {
      return function(g) {
        return function(x) {
          return f(g(x));
        };
      };
    }
  };
  var compose = function(dict) {
    return dict.compose;
  };

  // output/Control.Category/index.js
  var identity = function(dict) {
    return dict.identity;
  };
  var categoryFn = {
    identity: function(x) {
      return x;
    },
    Semigroupoid0: function() {
      return semigroupoidFn;
    }
  };

  // output/Data.Boolean/index.js
  var otherwise = true;

  // output/Data.Function/index.js
  var on = function(f) {
    return function(g) {
      return function(x) {
        return function(y) {
          return f(g(x))(g(y));
        };
      };
    };
  };
  var flip = function(f) {
    return function(b2) {
      return function(a2) {
        return f(a2)(b2);
      };
    };
  };
  var $$const = function(a2) {
    return function(v) {
      return a2;
    };
  };
  var applyFlipped = function(x) {
    return function(f) {
      return f(x);
    };
  };

  // output/Data.Functor/foreign.js
  var arrayMap = function(f) {
    return function(arr) {
      var l = arr.length;
      var result = new Array(l);
      for (var i2 = 0; i2 < l; i2++) {
        result[i2] = f(arr[i2]);
      }
      return result;
    };
  };

  // output/Data.Unit/foreign.js
  var unit = void 0;

  // output/Type.Proxy/index.js
  var $$Proxy = /* @__PURE__ */ function() {
    function $$Proxy2() {
    }
    ;
    $$Proxy2.value = new $$Proxy2();
    return $$Proxy2;
  }();

  // output/Data.Functor/index.js
  var map = function(dict) {
    return dict.map;
  };
  var mapFlipped = function(dictFunctor) {
    var map121 = map(dictFunctor);
    return function(fa) {
      return function(f) {
        return map121(f)(fa);
      };
    };
  };
  var $$void = function(dictFunctor) {
    return map(dictFunctor)($$const(unit));
  };
  var voidLeft = function(dictFunctor) {
    var map121 = map(dictFunctor);
    return function(f) {
      return function(x) {
        return map121($$const(x))(f);
      };
    };
  };
  var voidRight = function(dictFunctor) {
    var map121 = map(dictFunctor);
    return function(x) {
      return map121($$const(x));
    };
  };
  var functorFn = {
    map: /* @__PURE__ */ compose(semigroupoidFn)
  };
  var functorArray = {
    map: arrayMap
  };

  // output/Control.Apply/index.js
  var identity2 = /* @__PURE__ */ identity(categoryFn);
  var applyFn = {
    apply: function(f) {
      return function(g) {
        return function(x) {
          return f(x)(g(x));
        };
      };
    },
    Functor0: function() {
      return functorFn;
    }
  };
  var applyArray = {
    apply: arrayApply,
    Functor0: function() {
      return functorArray;
    }
  };
  var apply = function(dict) {
    return dict.apply;
  };
  var applyFirst = function(dictApply) {
    var apply12 = apply(dictApply);
    var map50 = map(dictApply.Functor0());
    return function(a2) {
      return function(b2) {
        return apply12(map50($$const)(a2))(b2);
      };
    };
  };
  var applySecond = function(dictApply) {
    var apply12 = apply(dictApply);
    var map50 = map(dictApply.Functor0());
    return function(a2) {
      return function(b2) {
        return apply12(map50($$const(identity2))(a2))(b2);
      };
    };
  };

  // output/Control.Applicative/index.js
  var pure = function(dict) {
    return dict.pure;
  };
  var unless = function(dictApplicative) {
    var pure114 = pure(dictApplicative);
    return function(v) {
      return function(v1) {
        if (!v) {
          return v1;
        }
        ;
        if (v) {
          return pure114(unit);
        }
        ;
        throw new Error("Failed pattern match at Control.Applicative (line 68, column 1 - line 68, column 65): " + [v.constructor.name, v1.constructor.name]);
      };
    };
  };
  var when = function(dictApplicative) {
    var pure114 = pure(dictApplicative);
    return function(v) {
      return function(v1) {
        if (v) {
          return v1;
        }
        ;
        if (!v) {
          return pure114(unit);
        }
        ;
        throw new Error("Failed pattern match at Control.Applicative (line 63, column 1 - line 63, column 63): " + [v.constructor.name, v1.constructor.name]);
      };
    };
  };
  var liftA1 = function(dictApplicative) {
    var apply8 = apply(dictApplicative.Apply0());
    var pure114 = pure(dictApplicative);
    return function(f) {
      return function(a2) {
        return apply8(pure114(f))(a2);
      };
    };
  };
  var applicativeArray = {
    pure: function(x) {
      return [x];
    },
    Apply0: function() {
      return applyArray;
    }
  };

  // output/Control.Bind/foreign.js
  var arrayBind = function(arr) {
    return function(f) {
      var result = [];
      for (var i2 = 0, l = arr.length; i2 < l; i2++) {
        Array.prototype.push.apply(result, f(arr[i2]));
      }
      return result;
    };
  };

  // output/Control.Bind/index.js
  var identity3 = /* @__PURE__ */ identity(categoryFn);
  var discard = function(dict) {
    return dict.discard;
  };
  var bindArray = {
    bind: arrayBind,
    Apply0: function() {
      return applyArray;
    }
  };
  var bind = function(dict) {
    return dict.bind;
  };
  var bindFlipped = function(dictBind) {
    return flip(bind(dictBind));
  };
  var composeKleisliFlipped = function(dictBind) {
    var bindFlipped12 = bindFlipped(dictBind);
    return function(f) {
      return function(g) {
        return function(a2) {
          return bindFlipped12(f)(g(a2));
        };
      };
    };
  };
  var composeKleisli = function(dictBind) {
    var bind18 = bind(dictBind);
    return function(f) {
      return function(g) {
        return function(a2) {
          return bind18(f(a2))(g);
        };
      };
    };
  };
  var discardUnit = {
    discard: function(dictBind) {
      return bind(dictBind);
    }
  };
  var join = function(dictBind) {
    var bind18 = bind(dictBind);
    return function(m) {
      return bind18(m)(identity3);
    };
  };

  // output/Control.Monad/index.js
  var unlessM = function(dictMonad) {
    var bind18 = bind(dictMonad.Bind1());
    var unless2 = unless(dictMonad.Applicative0());
    return function(mb) {
      return function(m) {
        return bind18(mb)(function(b2) {
          return unless2(b2)(m);
        });
      };
    };
  };
  var liftM1 = function(dictMonad) {
    var bind18 = bind(dictMonad.Bind1());
    var pure31 = pure(dictMonad.Applicative0());
    return function(f) {
      return function(a2) {
        return bind18(a2)(function(a$prime) {
          return pure31(f(a$prime));
        });
      };
    };
  };
  var ap = function(dictMonad) {
    var bind18 = bind(dictMonad.Bind1());
    var pure31 = pure(dictMonad.Applicative0());
    return function(f) {
      return function(a2) {
        return bind18(f)(function(f$prime) {
          return bind18(a2)(function(a$prime) {
            return pure31(f$prime(a$prime));
          });
        });
      };
    };
  };

  // output/Data.Semigroup/foreign.js
  var concatString = function(s1) {
    return function(s2) {
      return s1 + s2;
    };
  };
  var concatArray = function(xs) {
    return function(ys) {
      if (xs.length === 0)
        return ys;
      if (ys.length === 0)
        return xs;
      return xs.concat(ys);
    };
  };

  // output/Data.Symbol/index.js
  var reflectSymbol = function(dict) {
    return dict.reflectSymbol;
  };

  // output/Record.Unsafe/foreign.js
  var unsafeGet = function(label5) {
    return function(rec) {
      return rec[label5];
    };
  };

  // output/Data.Semigroup/index.js
  var semigroupString = {
    append: concatString
  };
  var semigroupArray = {
    append: concatArray
  };
  var append = function(dict) {
    return dict.append;
  };

  // output/Control.Alt/index.js
  var alt = function(dict) {
    return dict.alt;
  };

  // output/Data.Bounded/foreign.js
  var topInt = 2147483647;
  var bottomInt = -2147483648;
  var topChar = String.fromCharCode(65535);
  var bottomChar = String.fromCharCode(0);
  var topNumber = Number.POSITIVE_INFINITY;
  var bottomNumber = Number.NEGATIVE_INFINITY;

  // output/Data.Ord/foreign.js
  var unsafeCompareImpl = function(lt) {
    return function(eq5) {
      return function(gt) {
        return function(x) {
          return function(y) {
            return x < y ? lt : x === y ? eq5 : gt;
          };
        };
      };
    };
  };
  var ordIntImpl = unsafeCompareImpl;
  var ordNumberImpl = unsafeCompareImpl;
  var ordStringImpl = unsafeCompareImpl;
  var ordCharImpl = unsafeCompareImpl;

  // output/Data.Eq/foreign.js
  var refEq = function(r1) {
    return function(r2) {
      return r1 === r2;
    };
  };
  var eqBooleanImpl = refEq;
  var eqIntImpl = refEq;
  var eqNumberImpl = refEq;
  var eqCharImpl = refEq;
  var eqStringImpl = refEq;

  // output/Data.Eq/index.js
  var eqUnit = {
    eq: function(v) {
      return function(v1) {
        return true;
      };
    }
  };
  var eqString = {
    eq: eqStringImpl
  };
  var eqNumber = {
    eq: eqNumberImpl
  };
  var eqInt = {
    eq: eqIntImpl
  };
  var eqChar = {
    eq: eqCharImpl
  };
  var eqBoolean = {
    eq: eqBooleanImpl
  };
  var eq = function(dict) {
    return dict.eq;
  };
  var eq2 = /* @__PURE__ */ eq(eqBoolean);
  var notEq = function(dictEq) {
    var eq32 = eq(dictEq);
    return function(x) {
      return function(y) {
        return eq2(eq32(x)(y))(false);
      };
    };
  };

  // output/Data.Ordering/index.js
  var LT = /* @__PURE__ */ function() {
    function LT2() {
    }
    ;
    LT2.value = new LT2();
    return LT2;
  }();
  var GT = /* @__PURE__ */ function() {
    function GT2() {
    }
    ;
    GT2.value = new GT2();
    return GT2;
  }();
  var EQ = /* @__PURE__ */ function() {
    function EQ2() {
    }
    ;
    EQ2.value = new EQ2();
    return EQ2;
  }();

  // output/Data.Ring/foreign.js
  var intSub = function(x) {
    return function(y) {
      return x - y | 0;
    };
  };

  // output/Data.Semiring/foreign.js
  var intAdd = function(x) {
    return function(y) {
      return x + y | 0;
    };
  };
  var intMul = function(x) {
    return function(y) {
      return x * y | 0;
    };
  };

  // output/Data.Semiring/index.js
  var semiringInt = {
    add: intAdd,
    zero: 0,
    mul: intMul,
    one: 1
  };

  // output/Data.Ring/index.js
  var ringInt = {
    sub: intSub,
    Semiring0: function() {
      return semiringInt;
    }
  };

  // output/Data.Ord/index.js
  var ordUnit = {
    compare: function(v) {
      return function(v1) {
        return EQ.value;
      };
    },
    Eq0: function() {
      return eqUnit;
    }
  };
  var ordString = /* @__PURE__ */ function() {
    return {
      compare: ordStringImpl(LT.value)(EQ.value)(GT.value),
      Eq0: function() {
        return eqString;
      }
    };
  }();
  var ordNumber = /* @__PURE__ */ function() {
    return {
      compare: ordNumberImpl(LT.value)(EQ.value)(GT.value),
      Eq0: function() {
        return eqNumber;
      }
    };
  }();
  var ordInt = /* @__PURE__ */ function() {
    return {
      compare: ordIntImpl(LT.value)(EQ.value)(GT.value),
      Eq0: function() {
        return eqInt;
      }
    };
  }();
  var ordChar = /* @__PURE__ */ function() {
    return {
      compare: ordCharImpl(LT.value)(EQ.value)(GT.value),
      Eq0: function() {
        return eqChar;
      }
    };
  }();
  var compare = function(dict) {
    return dict.compare;
  };
  var max = function(dictOrd) {
    var compare3 = compare(dictOrd);
    return function(x) {
      return function(y) {
        var v = compare3(x)(y);
        if (v instanceof LT) {
          return y;
        }
        ;
        if (v instanceof EQ) {
          return x;
        }
        ;
        if (v instanceof GT) {
          return x;
        }
        ;
        throw new Error("Failed pattern match at Data.Ord (line 181, column 3 - line 184, column 12): " + [v.constructor.name]);
      };
    };
  };
  var min = function(dictOrd) {
    var compare3 = compare(dictOrd);
    return function(x) {
      return function(y) {
        var v = compare3(x)(y);
        if (v instanceof LT) {
          return x;
        }
        ;
        if (v instanceof EQ) {
          return x;
        }
        ;
        if (v instanceof GT) {
          return y;
        }
        ;
        throw new Error("Failed pattern match at Data.Ord (line 172, column 3 - line 175, column 12): " + [v.constructor.name]);
      };
    };
  };
  var clamp = function(dictOrd) {
    var min1 = min(dictOrd);
    var max1 = max(dictOrd);
    return function(low2) {
      return function(hi) {
        return function(x) {
          return min1(hi)(max1(low2)(x));
        };
      };
    };
  };

  // output/Data.Bounded/index.js
  var top = function(dict) {
    return dict.top;
  };
  var boundedInt = {
    top: topInt,
    bottom: bottomInt,
    Ord0: function() {
      return ordInt;
    }
  };
  var boundedChar = {
    top: topChar,
    bottom: bottomChar,
    Ord0: function() {
      return ordChar;
    }
  };
  var bottom = function(dict) {
    return dict.bottom;
  };

  // output/Data.Show/foreign.js
  var showIntImpl = function(n) {
    return n.toString();
  };
  var showNumberImpl = function(n) {
    var str = n.toString();
    return isNaN(str + ".0") ? str : str + ".0";
  };

  // output/Data.Show/index.js
  var showNumber = {
    show: showNumberImpl
  };
  var showInt = {
    show: showIntImpl
  };
  var show = function(dict) {
    return dict.show;
  };

  // output/Data.Generic.Rep/index.js
  var Inl = /* @__PURE__ */ function() {
    function Inl2(value0) {
      this.value0 = value0;
    }
    ;
    Inl2.create = function(value0) {
      return new Inl2(value0);
    };
    return Inl2;
  }();
  var Inr = /* @__PURE__ */ function() {
    function Inr2(value0) {
      this.value0 = value0;
    }
    ;
    Inr2.create = function(value0) {
      return new Inr2(value0);
    };
    return Inr2;
  }();
  var NoArguments = /* @__PURE__ */ function() {
    function NoArguments2() {
    }
    ;
    NoArguments2.value = new NoArguments2();
    return NoArguments2;
  }();
  var Constructor = function(x) {
    return x;
  };
  var Argument = function(x) {
    return x;
  };
  var to = function(dict) {
    return dict.to;
  };
  var from = function(dict) {
    return dict.from;
  };

  // output/Data.Maybe/index.js
  var identity4 = /* @__PURE__ */ identity(categoryFn);
  var Nothing = /* @__PURE__ */ function() {
    function Nothing2() {
    }
    ;
    Nothing2.value = new Nothing2();
    return Nothing2;
  }();
  var Just = /* @__PURE__ */ function() {
    function Just2(value0) {
      this.value0 = value0;
    }
    ;
    Just2.create = function(value0) {
      return new Just2(value0);
    };
    return Just2;
  }();
  var maybe = function(v) {
    return function(v1) {
      return function(v2) {
        if (v2 instanceof Nothing) {
          return v;
        }
        ;
        if (v2 instanceof Just) {
          return v1(v2.value0);
        }
        ;
        throw new Error("Failed pattern match at Data.Maybe (line 237, column 1 - line 237, column 51): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
      };
    };
  };
  var isNothing = /* @__PURE__ */ maybe(true)(/* @__PURE__ */ $$const(false));
  var isJust = /* @__PURE__ */ maybe(false)(/* @__PURE__ */ $$const(true));
  var functorMaybe = {
    map: function(v) {
      return function(v1) {
        if (v1 instanceof Just) {
          return new Just(v(v1.value0));
        }
        ;
        return Nothing.value;
      };
    }
  };
  var map2 = /* @__PURE__ */ map(functorMaybe);
  var fromMaybe = function(a2) {
    return maybe(a2)(identity4);
  };
  var fromJust = function() {
    return function(v) {
      if (v instanceof Just) {
        return v.value0;
      }
      ;
      throw new Error("Failed pattern match at Data.Maybe (line 288, column 1 - line 288, column 46): " + [v.constructor.name]);
    };
  };
  var eqMaybe = function(dictEq) {
    var eq5 = eq(dictEq);
    return {
      eq: function(x) {
        return function(y) {
          if (x instanceof Nothing && y instanceof Nothing) {
            return true;
          }
          ;
          if (x instanceof Just && y instanceof Just) {
            return eq5(x.value0)(y.value0);
          }
          ;
          return false;
        };
      }
    };
  };
  var applyMaybe = {
    apply: function(v) {
      return function(v1) {
        if (v instanceof Just) {
          return map2(v.value0)(v1);
        }
        ;
        if (v instanceof Nothing) {
          return Nothing.value;
        }
        ;
        throw new Error("Failed pattern match at Data.Maybe (line 67, column 1 - line 69, column 30): " + [v.constructor.name, v1.constructor.name]);
      };
    },
    Functor0: function() {
      return functorMaybe;
    }
  };
  var bindMaybe = {
    bind: function(v) {
      return function(v1) {
        if (v instanceof Just) {
          return v1(v.value0);
        }
        ;
        if (v instanceof Nothing) {
          return Nothing.value;
        }
        ;
        throw new Error("Failed pattern match at Data.Maybe (line 125, column 1 - line 127, column 28): " + [v.constructor.name, v1.constructor.name]);
      };
    },
    Apply0: function() {
      return applyMaybe;
    }
  };
  var applicativeMaybe = /* @__PURE__ */ function() {
    return {
      pure: Just.create,
      Apply0: function() {
        return applyMaybe;
      }
    };
  }();

  // output/Data.Either/index.js
  var Left = /* @__PURE__ */ function() {
    function Left2(value0) {
      this.value0 = value0;
    }
    ;
    Left2.create = function(value0) {
      return new Left2(value0);
    };
    return Left2;
  }();
  var Right = /* @__PURE__ */ function() {
    function Right2(value0) {
      this.value0 = value0;
    }
    ;
    Right2.create = function(value0) {
      return new Right2(value0);
    };
    return Right2;
  }();
  var note = function(a2) {
    return maybe(new Left(a2))(Right.create);
  };
  var functorEither = {
    map: function(f) {
      return function(m) {
        if (m instanceof Left) {
          return new Left(m.value0);
        }
        ;
        if (m instanceof Right) {
          return new Right(f(m.value0));
        }
        ;
        throw new Error("Failed pattern match at Data.Either (line 0, column 0 - line 0, column 0): " + [m.constructor.name]);
      };
    }
  };
  var map3 = /* @__PURE__ */ map(functorEither);
  var either = function(v) {
    return function(v1) {
      return function(v2) {
        if (v2 instanceof Left) {
          return v(v2.value0);
        }
        ;
        if (v2 instanceof Right) {
          return v1(v2.value0);
        }
        ;
        throw new Error("Failed pattern match at Data.Either (line 208, column 1 - line 208, column 64): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
      };
    };
  };
  var hush = /* @__PURE__ */ function() {
    return either($$const(Nothing.value))(Just.create);
  }();
  var applyEither = {
    apply: function(v) {
      return function(v1) {
        if (v instanceof Left) {
          return new Left(v.value0);
        }
        ;
        if (v instanceof Right) {
          return map3(v.value0)(v1);
        }
        ;
        throw new Error("Failed pattern match at Data.Either (line 70, column 1 - line 72, column 30): " + [v.constructor.name, v1.constructor.name]);
      };
    },
    Functor0: function() {
      return functorEither;
    }
  };
  var applicativeEither = /* @__PURE__ */ function() {
    return {
      pure: Right.create,
      Apply0: function() {
        return applyEither;
      }
    };
  }();

  // output/Effect/foreign.js
  var pureE = function(a2) {
    return function() {
      return a2;
    };
  };
  var bindE = function(a2) {
    return function(f) {
      return function() {
        return f(a2())();
      };
    };
  };

  // output/Data.EuclideanRing/foreign.js
  var intDegree = function(x) {
    return Math.min(Math.abs(x), 2147483647);
  };
  var intDiv = function(x) {
    return function(y) {
      if (y === 0)
        return 0;
      return y > 0 ? Math.floor(x / y) : -Math.floor(x / -y);
    };
  };
  var intMod = function(x) {
    return function(y) {
      if (y === 0)
        return 0;
      var yy = Math.abs(y);
      return (x % yy + yy) % yy;
    };
  };

  // output/Data.CommutativeRing/index.js
  var commutativeRingInt = {
    Ring0: function() {
      return ringInt;
    }
  };

  // output/Data.EuclideanRing/index.js
  var mod = function(dict) {
    return dict.mod;
  };
  var euclideanRingInt = {
    degree: intDegree,
    div: intDiv,
    mod: intMod,
    CommutativeRing0: function() {
      return commutativeRingInt;
    }
  };
  var div = function(dict) {
    return dict.div;
  };

  // output/Data.Monoid/index.js
  var monoidString = {
    mempty: "",
    Semigroup0: function() {
      return semigroupString;
    }
  };
  var monoidArray = {
    mempty: [],
    Semigroup0: function() {
      return semigroupArray;
    }
  };
  var mempty = function(dict) {
    return dict.mempty;
  };

  // output/Effect/index.js
  var $runtime_lazy = function(name16, moduleName, init4) {
    var state3 = 0;
    var val;
    return function(lineNumber) {
      if (state3 === 2)
        return val;
      if (state3 === 1)
        throw new ReferenceError(name16 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
      state3 = 1;
      val = init4();
      state3 = 2;
      return val;
    };
  };
  var monadEffect = {
    Applicative0: function() {
      return applicativeEffect;
    },
    Bind1: function() {
      return bindEffect;
    }
  };
  var bindEffect = {
    bind: bindE,
    Apply0: function() {
      return $lazy_applyEffect(0);
    }
  };
  var applicativeEffect = {
    pure: pureE,
    Apply0: function() {
      return $lazy_applyEffect(0);
    }
  };
  var $lazy_functorEffect = /* @__PURE__ */ $runtime_lazy("functorEffect", "Effect", function() {
    return {
      map: liftA1(applicativeEffect)
    };
  });
  var $lazy_applyEffect = /* @__PURE__ */ $runtime_lazy("applyEffect", "Effect", function() {
    return {
      apply: ap(monadEffect),
      Functor0: function() {
        return $lazy_functorEffect(0);
      }
    };
  });
  var functorEffect = /* @__PURE__ */ $lazy_functorEffect(20);
  var applyEffect = /* @__PURE__ */ $lazy_applyEffect(23);

  // output/Effect.Exception/foreign.js
  function error(msg) {
    return new Error(msg);
  }
  function message(e) {
    return e.message;
  }
  function throwException(e) {
    return function() {
      throw e;
    };
  }
  function catchException(c) {
    return function(t) {
      return function() {
        try {
          return t();
        } catch (e) {
          if (e instanceof Error || Object.prototype.toString.call(e) === "[object Error]") {
            return c(e)();
          } else {
            return c(new Error(e.toString()))();
          }
        }
      };
    };
  }

  // output/Effect.Exception/index.js
  var pure2 = /* @__PURE__ */ pure(applicativeEffect);
  var map4 = /* @__PURE__ */ map(functorEffect);
  var $$try = function(action2) {
    return catchException(function($3) {
      return pure2(Left.create($3));
    })(map4(Right.create)(action2));
  };
  var $$throw = function($4) {
    return throwException(error($4));
  };

  // output/Control.Monad.Error.Class/index.js
  var throwError = function(dict) {
    return dict.throwError;
  };
  var catchError = function(dict) {
    return dict.catchError;
  };
  var $$try2 = function(dictMonadError) {
    var catchError1 = catchError(dictMonadError);
    var Monad0 = dictMonadError.MonadThrow0().Monad0();
    var map50 = map(Monad0.Bind1().Apply0().Functor0());
    var pure31 = pure(Monad0.Applicative0());
    return function(a2) {
      return catchError1(map50(Right.create)(a2))(function($52) {
        return pure31(Left.create($52));
      });
    };
  };

  // output/Data.Identity/index.js
  var Identity = function(x) {
    return x;
  };
  var functorIdentity = {
    map: function(f) {
      return function(m) {
        return f(m);
      };
    }
  };
  var applyIdentity = {
    apply: function(v) {
      return function(v1) {
        return v(v1);
      };
    },
    Functor0: function() {
      return functorIdentity;
    }
  };
  var bindIdentity = {
    bind: function(v) {
      return function(f) {
        return f(v);
      };
    },
    Apply0: function() {
      return applyIdentity;
    }
  };
  var applicativeIdentity = {
    pure: Identity,
    Apply0: function() {
      return applyIdentity;
    }
  };
  var monadIdentity = {
    Applicative0: function() {
      return applicativeIdentity;
    },
    Bind1: function() {
      return bindIdentity;
    }
  };

  // output/Effect.Ref/foreign.js
  var _new = function(val) {
    return function() {
      return { value: val };
    };
  };
  var read = function(ref2) {
    return function() {
      return ref2.value;
    };
  };
  var modifyImpl = function(f) {
    return function(ref2) {
      return function() {
        var t = f(ref2.value);
        ref2.value = t.state;
        return t.value;
      };
    };
  };
  var write = function(val) {
    return function(ref2) {
      return function() {
        ref2.value = val;
      };
    };
  };

  // output/Effect.Ref/index.js
  var $$void2 = /* @__PURE__ */ $$void(functorEffect);
  var $$new = _new;
  var modify$prime = modifyImpl;
  var modify = function(f) {
    return modify$prime(function(s) {
      var s$prime = f(s);
      return {
        state: s$prime,
        value: s$prime
      };
    });
  };
  var modify_ = function(f) {
    return function(s) {
      return $$void2(modify(f)(s));
    };
  };

  // output/Control.Monad.Rec.Class/index.js
  var bindFlipped2 = /* @__PURE__ */ bindFlipped(bindEffect);
  var map5 = /* @__PURE__ */ map(functorEffect);
  var Loop = /* @__PURE__ */ function() {
    function Loop2(value0) {
      this.value0 = value0;
    }
    ;
    Loop2.create = function(value0) {
      return new Loop2(value0);
    };
    return Loop2;
  }();
  var Done = /* @__PURE__ */ function() {
    function Done2(value0) {
      this.value0 = value0;
    }
    ;
    Done2.create = function(value0) {
      return new Done2(value0);
    };
    return Done2;
  }();
  var tailRecM = function(dict) {
    return dict.tailRecM;
  };
  var monadRecEffect = {
    tailRecM: function(f) {
      return function(a2) {
        var fromDone = function(v) {
          if (v instanceof Done) {
            return v.value0;
          }
          ;
          throw new Error("Failed pattern match at Control.Monad.Rec.Class (line 137, column 30 - line 137, column 44): " + [v.constructor.name]);
        };
        return function __do2() {
          var r = bindFlipped2($$new)(f(a2))();
          (function() {
            while (!function __do3() {
              var v = read(r)();
              if (v instanceof Loop) {
                var e = f(v.value0)();
                write(e)(r)();
                return false;
              }
              ;
              if (v instanceof Done) {
                return true;
              }
              ;
              throw new Error("Failed pattern match at Control.Monad.Rec.Class (line 128, column 22 - line 133, column 28): " + [v.constructor.name]);
            }()) {
            }
            ;
            return {};
          })();
          return map5(fromDone)(read(r))();
        };
      };
    },
    Monad0: function() {
      return monadEffect;
    }
  };

  // output/Unsafe.Coerce/foreign.js
  var unsafeCoerce2 = function(x) {
    return x;
  };

  // output/Control.Monad.ST.Internal/foreign.js
  var map_ = function(f) {
    return function(a2) {
      return function() {
        return f(a2());
      };
    };
  };
  var foreach = function(as3) {
    return function(f) {
      return function() {
        for (var i2 = 0, l = as3.length; i2 < l; i2++) {
          f(as3[i2])();
        }
      };
    };
  };

  // output/Control.Monad.ST.Internal/index.js
  var functorST = {
    map: map_
  };

  // output/Data.HeytingAlgebra/foreign.js
  var boolConj = function(b1) {
    return function(b2) {
      return b1 && b2;
    };
  };
  var boolDisj = function(b1) {
    return function(b2) {
      return b1 || b2;
    };
  };
  var boolNot = function(b2) {
    return !b2;
  };

  // output/Data.HeytingAlgebra/index.js
  var tt = function(dict) {
    return dict.tt;
  };
  var not = function(dict) {
    return dict.not;
  };
  var implies = function(dict) {
    return dict.implies;
  };
  var ff = function(dict) {
    return dict.ff;
  };
  var disj = function(dict) {
    return dict.disj;
  };
  var heytingAlgebraBoolean = {
    ff: false,
    tt: true,
    implies: function(a2) {
      return function(b2) {
        return disj(heytingAlgebraBoolean)(not(heytingAlgebraBoolean)(a2))(b2);
      };
    },
    conj: boolConj,
    disj: boolDisj,
    not: boolNot
  };
  var conj = function(dict) {
    return dict.conj;
  };
  var heytingAlgebraFunction = function(dictHeytingAlgebra) {
    var ff1 = ff(dictHeytingAlgebra);
    var tt1 = tt(dictHeytingAlgebra);
    var implies1 = implies(dictHeytingAlgebra);
    var conj1 = conj(dictHeytingAlgebra);
    var disj1 = disj(dictHeytingAlgebra);
    var not1 = not(dictHeytingAlgebra);
    return {
      ff: function(v) {
        return ff1;
      },
      tt: function(v) {
        return tt1;
      },
      implies: function(f) {
        return function(g) {
          return function(a2) {
            return implies1(f(a2))(g(a2));
          };
        };
      },
      conj: function(f) {
        return function(g) {
          return function(a2) {
            return conj1(f(a2))(g(a2));
          };
        };
      },
      disj: function(f) {
        return function(g) {
          return function(a2) {
            return disj1(f(a2))(g(a2));
          };
        };
      },
      not: function(f) {
        return function(a2) {
          return not1(f(a2));
        };
      }
    };
  };

  // output/Data.Tuple/index.js
  var Tuple = /* @__PURE__ */ function() {
    function Tuple2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Tuple2.create = function(value0) {
      return function(value1) {
        return new Tuple2(value0, value1);
      };
    };
    return Tuple2;
  }();
  var uncurry = function(f) {
    return function(v) {
      return f(v.value0)(v.value1);
    };
  };
  var snd = function(v) {
    return v.value1;
  };
  var functorTuple = {
    map: function(f) {
      return function(m) {
        return new Tuple(m.value0, f(m.value1));
      };
    }
  };
  var fst = function(v) {
    return v.value0;
  };
  var eqTuple = function(dictEq) {
    var eq5 = eq(dictEq);
    return function(dictEq1) {
      var eq12 = eq(dictEq1);
      return {
        eq: function(x) {
          return function(y) {
            return eq5(x.value0)(y.value0) && eq12(x.value1)(y.value1);
          };
        }
      };
    };
  };
  var ordTuple = function(dictOrd) {
    var compare3 = compare(dictOrd);
    var eqTuple1 = eqTuple(dictOrd.Eq0());
    return function(dictOrd1) {
      var compare12 = compare(dictOrd1);
      var eqTuple2 = eqTuple1(dictOrd1.Eq0());
      return {
        compare: function(x) {
          return function(y) {
            var v = compare3(x.value0)(y.value0);
            if (v instanceof LT) {
              return LT.value;
            }
            ;
            if (v instanceof GT) {
              return GT.value;
            }
            ;
            return compare12(x.value1)(y.value1);
          };
        },
        Eq0: function() {
          return eqTuple2;
        }
      };
    };
  };

  // output/Control.Monad.State.Class/index.js
  var state = function(dict) {
    return dict.state;
  };
  var put = function(dictMonadState) {
    var state1 = state(dictMonadState);
    return function(s) {
      return state1(function(v) {
        return new Tuple(unit, s);
      });
    };
  };
  var modify_2 = function(dictMonadState) {
    var state1 = state(dictMonadState);
    return function(f) {
      return state1(function(s) {
        return new Tuple(unit, f(s));
      });
    };
  };
  var modify2 = function(dictMonadState) {
    var state1 = state(dictMonadState);
    return function(f) {
      return state1(function(s) {
        var s$prime = f(s);
        return new Tuple(s$prime, s$prime);
      });
    };
  };
  var get = function(dictMonadState) {
    return state(dictMonadState)(function(s) {
      return new Tuple(s, s);
    });
  };

  // output/Control.Monad.Trans.Class/index.js
  var lift = function(dict) {
    return dict.lift;
  };

  // output/Effect.Class/index.js
  var monadEffectEffect = {
    liftEffect: /* @__PURE__ */ identity(categoryFn),
    Monad0: function() {
      return monadEffect;
    }
  };
  var liftEffect = function(dict) {
    return dict.liftEffect;
  };

  // output/Control.Monad.Writer.Class/index.js
  var tell = function(dict) {
    return dict.tell;
  };

  // output/Control.Monad.Except.Trans/index.js
  var map6 = /* @__PURE__ */ map(functorEither);
  var ExceptT = function(x) {
    return x;
  };
  var withExceptT = function(dictFunctor) {
    var map121 = map(dictFunctor);
    return function(f) {
      return function(v) {
        var mapLeft = function(v1) {
          return function(v2) {
            if (v2 instanceof Right) {
              return new Right(v2.value0);
            }
            ;
            if (v2 instanceof Left) {
              return new Left(v1(v2.value0));
            }
            ;
            throw new Error("Failed pattern match at Control.Monad.Except.Trans (line 42, column 3 - line 42, column 32): " + [v1.constructor.name, v2.constructor.name]);
          };
        };
        return map121(mapLeft(f))(v);
      };
    };
  };
  var runExceptT = function(v) {
    return v;
  };
  var mapExceptT = function(f) {
    return function(v) {
      return f(v);
    };
  };
  var functorExceptT = function(dictFunctor) {
    var map121 = map(dictFunctor);
    return {
      map: function(f) {
        return mapExceptT(map121(map6(f)));
      }
    };
  };
  var except = function(dictApplicative) {
    var $185 = pure(dictApplicative);
    return function($186) {
      return ExceptT($185($186));
    };
  };
  var monadExceptT = function(dictMonad) {
    return {
      Applicative0: function() {
        return applicativeExceptT(dictMonad);
      },
      Bind1: function() {
        return bindExceptT(dictMonad);
      }
    };
  };
  var bindExceptT = function(dictMonad) {
    var bind18 = bind(dictMonad.Bind1());
    var pure31 = pure(dictMonad.Applicative0());
    return {
      bind: function(v) {
        return function(k) {
          return bind18(v)(either(function($187) {
            return pure31(Left.create($187));
          })(function(a2) {
            var v1 = k(a2);
            return v1;
          }));
        };
      },
      Apply0: function() {
        return applyExceptT(dictMonad);
      }
    };
  };
  var applyExceptT = function(dictMonad) {
    var functorExceptT1 = functorExceptT(dictMonad.Bind1().Apply0().Functor0());
    return {
      apply: ap(monadExceptT(dictMonad)),
      Functor0: function() {
        return functorExceptT1;
      }
    };
  };
  var applicativeExceptT = function(dictMonad) {
    return {
      pure: function() {
        var $188 = pure(dictMonad.Applicative0());
        return function($189) {
          return ExceptT($188(Right.create($189)));
        };
      }(),
      Apply0: function() {
        return applyExceptT(dictMonad);
      }
    };
  };
  var monadThrowExceptT = function(dictMonad) {
    var monadExceptT1 = monadExceptT(dictMonad);
    return {
      throwError: function() {
        var $198 = pure(dictMonad.Applicative0());
        return function($199) {
          return ExceptT($198(Left.create($199)));
        };
      }(),
      Monad0: function() {
        return monadExceptT1;
      }
    };
  };
  var altExceptT = function(dictSemigroup) {
    var append16 = append(dictSemigroup);
    return function(dictMonad) {
      var Bind1 = dictMonad.Bind1();
      var bind18 = bind(Bind1);
      var pure31 = pure(dictMonad.Applicative0());
      var functorExceptT1 = functorExceptT(Bind1.Apply0().Functor0());
      return {
        alt: function(v) {
          return function(v1) {
            return bind18(v)(function(rm) {
              if (rm instanceof Right) {
                return pure31(new Right(rm.value0));
              }
              ;
              if (rm instanceof Left) {
                return bind18(v1)(function(rn) {
                  if (rn instanceof Right) {
                    return pure31(new Right(rn.value0));
                  }
                  ;
                  if (rn instanceof Left) {
                    return pure31(new Left(append16(rm.value0)(rn.value0)));
                  }
                  ;
                  throw new Error("Failed pattern match at Control.Monad.Except.Trans (line 86, column 9 - line 88, column 49): " + [rn.constructor.name]);
                });
              }
              ;
              throw new Error("Failed pattern match at Control.Monad.Except.Trans (line 82, column 5 - line 88, column 49): " + [rm.constructor.name]);
            });
          };
        },
        Functor0: function() {
          return functorExceptT1;
        }
      };
    };
  };

  // output/Control.Plus/index.js
  var empty = function(dict) {
    return dict.empty;
  };

  // output/Safe.Coerce/index.js
  var coerce = function() {
    return unsafeCoerce2;
  };

  // output/Data.Newtype/index.js
  var coerce2 = /* @__PURE__ */ coerce();
  var unwrap = function() {
    return coerce2;
  };
  var over = function() {
    return function() {
      return function(v) {
        return coerce2;
      };
    };
  };
  var alaF = function() {
    return function() {
      return function() {
        return function() {
          return function(v) {
            return coerce2;
          };
        };
      };
    };
  };

  // output/Control.Monad.Writer.Trans/index.js
  var WriterT = function(x) {
    return x;
  };
  var runWriterT = function(v) {
    return v;
  };
  var mapWriterT = function(f) {
    return function(v) {
      return f(v);
    };
  };
  var functorWriterT = function(dictFunctor) {
    var map50 = map(dictFunctor);
    return {
      map: function(f) {
        return mapWriterT(map50(function(v) {
          return new Tuple(f(v.value0), v.value1);
        }));
      }
    };
  };
  var applyWriterT = function(dictSemigroup) {
    var append16 = append(dictSemigroup);
    return function(dictApply) {
      var apply8 = apply(dictApply);
      var Functor0 = dictApply.Functor0();
      var map50 = map(Functor0);
      var functorWriterT1 = functorWriterT(Functor0);
      return {
        apply: function(v) {
          return function(v1) {
            var k = function(v3) {
              return function(v4) {
                return new Tuple(v3.value0(v4.value0), append16(v3.value1)(v4.value1));
              };
            };
            return apply8(map50(k)(v))(v1);
          };
        },
        Functor0: function() {
          return functorWriterT1;
        }
      };
    };
  };
  var bindWriterT = function(dictSemigroup) {
    var append16 = append(dictSemigroup);
    var applyWriterT1 = applyWriterT(dictSemigroup);
    return function(dictBind) {
      var bind18 = bind(dictBind);
      var Apply0 = dictBind.Apply0();
      var map50 = map(Apply0.Functor0());
      var applyWriterT2 = applyWriterT1(Apply0);
      return {
        bind: function(v) {
          return function(k) {
            return bind18(v)(function(v1) {
              var v2 = k(v1.value0);
              return map50(function(v3) {
                return new Tuple(v3.value0, append16(v1.value1)(v3.value1));
              })(v2);
            });
          };
        },
        Apply0: function() {
          return applyWriterT2;
        }
      };
    };
  };
  var applicativeWriterT = function(dictMonoid) {
    var mempty7 = mempty(dictMonoid);
    var applyWriterT1 = applyWriterT(dictMonoid.Semigroup0());
    return function(dictApplicative) {
      var pure31 = pure(dictApplicative);
      var applyWriterT2 = applyWriterT1(dictApplicative.Apply0());
      return {
        pure: function(a2) {
          return pure31(new Tuple(a2, mempty7));
        },
        Apply0: function() {
          return applyWriterT2;
        }
      };
    };
  };
  var monadWriterT = function(dictMonoid) {
    var applicativeWriterT1 = applicativeWriterT(dictMonoid);
    var bindWriterT1 = bindWriterT(dictMonoid.Semigroup0());
    return function(dictMonad) {
      var applicativeWriterT2 = applicativeWriterT1(dictMonad.Applicative0());
      var bindWriterT2 = bindWriterT1(dictMonad.Bind1());
      return {
        Applicative0: function() {
          return applicativeWriterT2;
        },
        Bind1: function() {
          return bindWriterT2;
        }
      };
    };
  };
  var monadTellWriterT = function(dictMonoid) {
    var Semigroup0 = dictMonoid.Semigroup0();
    var monadWriterT1 = monadWriterT(dictMonoid);
    return function(dictMonad) {
      var monadWriterT2 = monadWriterT1(dictMonad);
      return {
        tell: function() {
          var $252 = pure(dictMonad.Applicative0());
          var $253 = Tuple.create(unit);
          return function($254) {
            return WriterT($252($253($254)));
          };
        }(),
        Semigroup0: function() {
          return Semigroup0;
        },
        Monad1: function() {
          return monadWriterT2;
        }
      };
    };
  };

  // output/Data.Profunctor/index.js
  var dimap = function(dict) {
    return dict.dimap;
  };

  // output/Control.Parallel.Class/index.js
  var sequential = function(dict) {
    return dict.sequential;
  };
  var parallel = function(dict) {
    return dict.parallel;
  };

  // output/Data.Foldable/foreign.js
  var foldrArray = function(f) {
    return function(init4) {
      return function(xs) {
        var acc = init4;
        var len = xs.length;
        for (var i2 = len - 1; i2 >= 0; i2--) {
          acc = f(xs[i2])(acc);
        }
        return acc;
      };
    };
  };
  var foldlArray = function(f) {
    return function(init4) {
      return function(xs) {
        var acc = init4;
        var len = xs.length;
        for (var i2 = 0; i2 < len; i2++) {
          acc = f(acc)(xs[i2]);
        }
        return acc;
      };
    };
  };

  // output/Data.Bifunctor/index.js
  var identity5 = /* @__PURE__ */ identity(categoryFn);
  var bimap = function(dict) {
    return dict.bimap;
  };
  var lmap = function(dictBifunctor) {
    var bimap1 = bimap(dictBifunctor);
    return function(f) {
      return bimap1(f)(identity5);
    };
  };
  var bifunctorTuple = {
    bimap: function(f) {
      return function(g) {
        return function(v) {
          return new Tuple(f(v.value0), g(v.value1));
        };
      };
    }
  };
  var bifunctorEither = {
    bimap: function(v) {
      return function(v1) {
        return function(v2) {
          if (v2 instanceof Left) {
            return new Left(v(v2.value0));
          }
          ;
          if (v2 instanceof Right) {
            return new Right(v1(v2.value0));
          }
          ;
          throw new Error("Failed pattern match at Data.Bifunctor (line 32, column 1 - line 34, column 36): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
        };
      };
    }
  };

  // output/Data.Maybe.First/index.js
  var semigroupFirst = {
    append: function(v) {
      return function(v1) {
        if (v instanceof Just) {
          return v;
        }
        ;
        return v1;
      };
    }
  };
  var monoidFirst = /* @__PURE__ */ function() {
    return {
      mempty: Nothing.value,
      Semigroup0: function() {
        return semigroupFirst;
      }
    };
  }();

  // output/Data.Monoid.Conj/index.js
  var Conj = function(x) {
    return x;
  };
  var semigroupConj = function(dictHeytingAlgebra) {
    var conj2 = conj(dictHeytingAlgebra);
    return {
      append: function(v) {
        return function(v1) {
          return conj2(v)(v1);
        };
      }
    };
  };
  var monoidConj = function(dictHeytingAlgebra) {
    var semigroupConj1 = semigroupConj(dictHeytingAlgebra);
    return {
      mempty: tt(dictHeytingAlgebra),
      Semigroup0: function() {
        return semigroupConj1;
      }
    };
  };

  // output/Data.Monoid.Disj/index.js
  var Disj = function(x) {
    return x;
  };
  var semigroupDisj = function(dictHeytingAlgebra) {
    var disj2 = disj(dictHeytingAlgebra);
    return {
      append: function(v) {
        return function(v1) {
          return disj2(v)(v1);
        };
      }
    };
  };
  var monoidDisj = function(dictHeytingAlgebra) {
    var semigroupDisj1 = semigroupDisj(dictHeytingAlgebra);
    return {
      mempty: ff(dictHeytingAlgebra),
      Semigroup0: function() {
        return semigroupDisj1;
      }
    };
  };

  // output/Data.Foldable/index.js
  var identity6 = /* @__PURE__ */ identity(categoryFn);
  var unwrap2 = /* @__PURE__ */ unwrap();
  var alaF2 = /* @__PURE__ */ alaF()()()();
  var foldr = function(dict) {
    return dict.foldr;
  };
  var traverse_ = function(dictApplicative) {
    var applySecond2 = applySecond(dictApplicative.Apply0());
    var pure31 = pure(dictApplicative);
    return function(dictFoldable) {
      var foldr22 = foldr(dictFoldable);
      return function(f) {
        return foldr22(function($454) {
          return applySecond2(f($454));
        })(pure31(unit));
      };
    };
  };
  var for_ = function(dictApplicative) {
    var traverse_14 = traverse_(dictApplicative);
    return function(dictFoldable) {
      return flip(traverse_14(dictFoldable));
    };
  };
  var foldl = function(dict) {
    return dict.foldl;
  };
  var indexl = function(dictFoldable) {
    var foldl22 = foldl(dictFoldable);
    return function(idx) {
      var go2 = function(cursor) {
        return function(a2) {
          if (cursor.elem instanceof Just) {
            return cursor;
          }
          ;
          var $296 = cursor.pos === idx;
          if ($296) {
            return {
              elem: new Just(a2),
              pos: cursor.pos
            };
          }
          ;
          return {
            pos: cursor.pos + 1 | 0,
            elem: cursor.elem
          };
        };
      };
      var $455 = foldl22(go2)({
        elem: Nothing.value,
        pos: 0
      });
      return function($456) {
        return function(v) {
          return v.elem;
        }($455($456));
      };
    };
  };
  var intercalate = function(dictFoldable) {
    var foldl22 = foldl(dictFoldable);
    return function(dictMonoid) {
      var append16 = append(dictMonoid.Semigroup0());
      var mempty7 = mempty(dictMonoid);
      return function(sep) {
        return function(xs) {
          var go2 = function(v) {
            return function(v1) {
              if (v.init) {
                return {
                  init: false,
                  acc: v1
                };
              }
              ;
              return {
                init: false,
                acc: append16(v.acc)(append16(sep)(v1))
              };
            };
          };
          return foldl22(go2)({
            init: true,
            acc: mempty7
          })(xs).acc;
        };
      };
    };
  };
  var foldableMaybe = {
    foldr: function(v) {
      return function(v1) {
        return function(v2) {
          if (v2 instanceof Nothing) {
            return v1;
          }
          ;
          if (v2 instanceof Just) {
            return v(v2.value0)(v1);
          }
          ;
          throw new Error("Failed pattern match at Data.Foldable (line 138, column 1 - line 144, column 27): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
        };
      };
    },
    foldl: function(v) {
      return function(v1) {
        return function(v2) {
          if (v2 instanceof Nothing) {
            return v1;
          }
          ;
          if (v2 instanceof Just) {
            return v(v1)(v2.value0);
          }
          ;
          throw new Error("Failed pattern match at Data.Foldable (line 138, column 1 - line 144, column 27): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
        };
      };
    },
    foldMap: function(dictMonoid) {
      var mempty7 = mempty(dictMonoid);
      return function(v) {
        return function(v1) {
          if (v1 instanceof Nothing) {
            return mempty7;
          }
          ;
          if (v1 instanceof Just) {
            return v(v1.value0);
          }
          ;
          throw new Error("Failed pattern match at Data.Foldable (line 138, column 1 - line 144, column 27): " + [v.constructor.name, v1.constructor.name]);
        };
      };
    }
  };
  var foldableEither = {
    foldr: function(v) {
      return function(v1) {
        return function(v2) {
          if (v2 instanceof Left) {
            return v1;
          }
          ;
          if (v2 instanceof Right) {
            return v(v2.value0)(v1);
          }
          ;
          throw new Error("Failed pattern match at Data.Foldable (line 181, column 1 - line 187, column 28): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
        };
      };
    },
    foldl: function(v) {
      return function(v1) {
        return function(v2) {
          if (v2 instanceof Left) {
            return v1;
          }
          ;
          if (v2 instanceof Right) {
            return v(v1)(v2.value0);
          }
          ;
          throw new Error("Failed pattern match at Data.Foldable (line 181, column 1 - line 187, column 28): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
        };
      };
    },
    foldMap: function(dictMonoid) {
      var mempty7 = mempty(dictMonoid);
      return function(v) {
        return function(v1) {
          if (v1 instanceof Left) {
            return mempty7;
          }
          ;
          if (v1 instanceof Right) {
            return v(v1.value0);
          }
          ;
          throw new Error("Failed pattern match at Data.Foldable (line 181, column 1 - line 187, column 28): " + [v.constructor.name, v1.constructor.name]);
        };
      };
    }
  };
  var foldMapDefaultR = function(dictFoldable) {
    var foldr22 = foldr(dictFoldable);
    return function(dictMonoid) {
      var append16 = append(dictMonoid.Semigroup0());
      var mempty7 = mempty(dictMonoid);
      return function(f) {
        return foldr22(function(x) {
          return function(acc) {
            return append16(f(x))(acc);
          };
        })(mempty7);
      };
    };
  };
  var foldableArray = {
    foldr: foldrArray,
    foldl: foldlArray,
    foldMap: function(dictMonoid) {
      return foldMapDefaultR(foldableArray)(dictMonoid);
    }
  };
  var foldMap = function(dict) {
    return dict.foldMap;
  };
  var lookup = function(dictFoldable) {
    var foldMap22 = foldMap(dictFoldable)(monoidFirst);
    return function(dictEq) {
      var eq22 = eq(dictEq);
      return function(a2) {
        var $460 = foldMap22(function(v) {
          var $444 = eq22(a2)(v.value0);
          if ($444) {
            return new Just(v.value1);
          }
          ;
          return Nothing.value;
        });
        return function($461) {
          return unwrap2($460($461));
        };
      };
    };
  };
  var fold = function(dictFoldable) {
    var foldMap22 = foldMap(dictFoldable);
    return function(dictMonoid) {
      return foldMap22(dictMonoid)(identity6);
    };
  };
  var any = function(dictFoldable) {
    var foldMap22 = foldMap(dictFoldable);
    return function(dictHeytingAlgebra) {
      return alaF2(Disj)(foldMap22(monoidDisj(dictHeytingAlgebra)));
    };
  };
  var all = function(dictFoldable) {
    var foldMap22 = foldMap(dictFoldable);
    return function(dictHeytingAlgebra) {
      return alaF2(Conj)(foldMap22(monoidConj(dictHeytingAlgebra)));
    };
  };

  // output/Data.Traversable/foreign.js
  var traverseArrayImpl = function() {
    function array1(a2) {
      return [a2];
    }
    function array2(a2) {
      return function(b2) {
        return [a2, b2];
      };
    }
    function array3(a2) {
      return function(b2) {
        return function(c) {
          return [a2, b2, c];
        };
      };
    }
    function concat2(xs) {
      return function(ys) {
        return xs.concat(ys);
      };
    }
    return function(apply8) {
      return function(map50) {
        return function(pure31) {
          return function(f) {
            return function(array) {
              function go2(bot, top3) {
                switch (top3 - bot) {
                  case 0:
                    return pure31([]);
                  case 1:
                    return map50(array1)(f(array[bot]));
                  case 2:
                    return apply8(map50(array2)(f(array[bot])))(f(array[bot + 1]));
                  case 3:
                    return apply8(apply8(map50(array3)(f(array[bot])))(f(array[bot + 1])))(f(array[bot + 2]));
                  default:
                    var pivot = bot + Math.floor((top3 - bot) / 4) * 2;
                    return apply8(map50(concat2)(go2(bot, pivot)))(go2(pivot, top3));
                }
              }
              return go2(0, array.length);
            };
          };
        };
      };
    };
  }();

  // output/Data.Traversable/index.js
  var identity7 = /* @__PURE__ */ identity(categoryFn);
  var traverse = function(dict) {
    return dict.traverse;
  };
  var sequenceDefault = function(dictTraversable) {
    var traverse22 = traverse(dictTraversable);
    return function(dictApplicative) {
      return traverse22(dictApplicative)(identity7);
    };
  };
  var traversableArray = {
    traverse: function(dictApplicative) {
      var Apply0 = dictApplicative.Apply0();
      return traverseArrayImpl(apply(Apply0))(map(Apply0.Functor0()))(pure(dictApplicative));
    },
    sequence: function(dictApplicative) {
      return sequenceDefault(traversableArray)(dictApplicative);
    },
    Functor0: function() {
      return functorArray;
    },
    Foldable1: function() {
      return foldableArray;
    }
  };

  // output/Control.Parallel/index.js
  var identity8 = /* @__PURE__ */ identity(categoryFn);
  var parTraverse_ = function(dictParallel) {
    var sequential4 = sequential(dictParallel);
    var traverse_7 = traverse_(dictParallel.Applicative1());
    var parallel4 = parallel(dictParallel);
    return function(dictFoldable) {
      var traverse_14 = traverse_7(dictFoldable);
      return function(f) {
        var $48 = traverse_14(function($50) {
          return parallel4(f($50));
        });
        return function($49) {
          return sequential4($48($49));
        };
      };
    };
  };
  var parSequence_ = function(dictParallel) {
    var parTraverse_1 = parTraverse_(dictParallel);
    return function(dictFoldable) {
      return parTraverse_1(dictFoldable)(identity8);
    };
  };

  // output/Effect.Unsafe/foreign.js
  var unsafePerformEffect = function(f) {
    return f();
  };

  // output/Partial.Unsafe/foreign.js
  var _unsafePartial = function(f) {
    return f();
  };

  // output/Partial/foreign.js
  var _crashWith = function(msg) {
    throw new Error(msg);
  };

  // output/Partial/index.js
  var crashWith = function() {
    return _crashWith;
  };

  // output/Partial.Unsafe/index.js
  var crashWith2 = /* @__PURE__ */ crashWith();
  var unsafePartial = _unsafePartial;
  var unsafeCrashWith = function(msg) {
    return unsafePartial(function() {
      return crashWith2(msg);
    });
  };

  // output/Effect.Aff/index.js
  var $runtime_lazy2 = function(name16, moduleName, init4) {
    var state3 = 0;
    var val;
    return function(lineNumber) {
      if (state3 === 2)
        return val;
      if (state3 === 1)
        throw new ReferenceError(name16 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
      state3 = 1;
      val = init4();
      state3 = 2;
      return val;
    };
  };
  var pure3 = /* @__PURE__ */ pure(applicativeEffect);
  var $$void3 = /* @__PURE__ */ $$void(functorEffect);
  var map7 = /* @__PURE__ */ map(functorEffect);
  var Canceler = function(x) {
    return x;
  };
  var suspendAff = /* @__PURE__ */ _fork(false);
  var functorParAff = {
    map: _parAffMap
  };
  var functorAff = {
    map: _map
  };
  var map1 = /* @__PURE__ */ map(functorAff);
  var forkAff = /* @__PURE__ */ _fork(true);
  var ffiUtil = /* @__PURE__ */ function() {
    var unsafeFromRight2 = function(v) {
      if (v instanceof Right) {
        return v.value0;
      }
      ;
      if (v instanceof Left) {
        return unsafeCrashWith("unsafeFromRight: Left");
      }
      ;
      throw new Error("Failed pattern match at Effect.Aff (line 412, column 21 - line 414, column 54): " + [v.constructor.name]);
    };
    var unsafeFromLeft = function(v) {
      if (v instanceof Left) {
        return v.value0;
      }
      ;
      if (v instanceof Right) {
        return unsafeCrashWith("unsafeFromLeft: Right");
      }
      ;
      throw new Error("Failed pattern match at Effect.Aff (line 407, column 20 - line 409, column 55): " + [v.constructor.name]);
    };
    var isLeft = function(v) {
      if (v instanceof Left) {
        return true;
      }
      ;
      if (v instanceof Right) {
        return false;
      }
      ;
      throw new Error("Failed pattern match at Effect.Aff (line 402, column 12 - line 404, column 21): " + [v.constructor.name]);
    };
    return {
      isLeft,
      fromLeft: unsafeFromLeft,
      fromRight: unsafeFromRight2,
      left: Left.create,
      right: Right.create
    };
  }();
  var makeFiber = function(aff) {
    return _makeFiber(ffiUtil, aff);
  };
  var launchAff = function(aff) {
    return function __do2() {
      var fiber = makeFiber(aff)();
      fiber.run();
      return fiber;
    };
  };
  var launchAff_ = function($74) {
    return $$void3(launchAff($74));
  };
  var bracket = function(acquire) {
    return function(completed) {
      return generalBracket(acquire)({
        killed: $$const(completed),
        failed: $$const(completed),
        completed: $$const(completed)
      });
    };
  };
  var applyParAff = {
    apply: _parAffApply,
    Functor0: function() {
      return functorParAff;
    }
  };
  var monadAff = {
    Applicative0: function() {
      return applicativeAff;
    },
    Bind1: function() {
      return bindAff;
    }
  };
  var bindAff = {
    bind: _bind,
    Apply0: function() {
      return $lazy_applyAff(0);
    }
  };
  var applicativeAff = {
    pure: _pure,
    Apply0: function() {
      return $lazy_applyAff(0);
    }
  };
  var $lazy_applyAff = /* @__PURE__ */ $runtime_lazy2("applyAff", "Effect.Aff", function() {
    return {
      apply: ap(monadAff),
      Functor0: function() {
        return functorAff;
      }
    };
  });
  var pure22 = /* @__PURE__ */ pure(applicativeAff);
  var bind1 = /* @__PURE__ */ bind(bindAff);
  var bindFlipped3 = /* @__PURE__ */ bindFlipped(bindAff);
  var $$finally = function(fin) {
    return function(a2) {
      return bracket(pure22(unit))($$const(fin))($$const(a2));
    };
  };
  var monadEffectAff = {
    liftEffect: _liftEffect,
    Monad0: function() {
      return monadAff;
    }
  };
  var liftEffect2 = /* @__PURE__ */ liftEffect(monadEffectAff);
  var effectCanceler = function($75) {
    return Canceler($$const(liftEffect2($75)));
  };
  var joinFiber = function(v) {
    return makeAff(function(k) {
      return map7(effectCanceler)(v.join(k));
    });
  };
  var functorFiber = {
    map: function(f) {
      return function(t) {
        return unsafePerformEffect(makeFiber(map1(f)(joinFiber(t))));
      };
    }
  };
  var killFiber = function(e) {
    return function(v) {
      return bind1(liftEffect2(v.isSuspended))(function(suspended) {
        if (suspended) {
          return liftEffect2($$void3(v.kill(e, $$const(pure3(unit)))));
        }
        ;
        return makeAff(function(k) {
          return map7(effectCanceler)(v.kill(e, k));
        });
      });
    };
  };
  var monadThrowAff = {
    throwError: _throwError,
    Monad0: function() {
      return monadAff;
    }
  };
  var monadErrorAff = {
    catchError: _catchError,
    MonadThrow0: function() {
      return monadThrowAff;
    }
  };
  var $$try3 = /* @__PURE__ */ $$try2(monadErrorAff);
  var runAff = function(k) {
    return function(aff) {
      return launchAff(bindFlipped3(function($80) {
        return liftEffect2(k($80));
      })($$try3(aff)));
    };
  };
  var runAff_ = function(k) {
    return function(aff) {
      return $$void3(runAff(k)(aff));
    };
  };
  var parallelAff = {
    parallel: unsafeCoerce2,
    sequential: _sequential,
    Monad0: function() {
      return monadAff;
    },
    Applicative1: function() {
      return $lazy_applicativeParAff(0);
    }
  };
  var $lazy_applicativeParAff = /* @__PURE__ */ $runtime_lazy2("applicativeParAff", "Effect.Aff", function() {
    return {
      pure: function() {
        var $82 = parallel(parallelAff);
        return function($83) {
          return $82(pure22($83));
        };
      }(),
      Apply0: function() {
        return applyParAff;
      }
    };
  });
  var applicativeParAff = /* @__PURE__ */ $lazy_applicativeParAff(136);
  var monadRecAff = {
    tailRecM: function(k) {
      var go2 = function(a2) {
        return bind1(k(a2))(function(res) {
          if (res instanceof Done) {
            return pure22(res.value0);
          }
          ;
          if (res instanceof Loop) {
            return go2(res.value0);
          }
          ;
          throw new Error("Failed pattern match at Effect.Aff (line 104, column 7 - line 106, column 23): " + [res.constructor.name]);
        });
      };
      return go2;
    },
    Monad0: function() {
      return monadAff;
    }
  };
  var nonCanceler = /* @__PURE__ */ $$const(/* @__PURE__ */ pure22(unit));

  // output/Effect.Aff.Class/index.js
  var monadAffAff = {
    liftAff: /* @__PURE__ */ identity(categoryFn),
    MonadEffect0: function() {
      return monadEffectAff;
    }
  };
  var liftAff = function(dict) {
    return dict.liftAff;
  };

  // output/Data.Array/foreign.js
  var range = function(start2) {
    return function(end3) {
      var step5 = start2 > end3 ? -1 : 1;
      var result = new Array(step5 * (end3 - start2) + 1);
      var i2 = start2, n = 0;
      while (i2 !== end3) {
        result[n++] = i2;
        i2 += step5;
      }
      result[n] = i2;
      return result;
    };
  };
  var replicateFill = function(count) {
    return function(value18) {
      if (count < 1) {
        return [];
      }
      var result = new Array(count);
      return result.fill(value18);
    };
  };
  var replicatePolyfill = function(count) {
    return function(value18) {
      var result = [];
      var n = 0;
      for (var i2 = 0; i2 < count; i2++) {
        result[n++] = value18;
      }
      return result;
    };
  };
  var replicate = typeof Array.prototype.fill === "function" ? replicateFill : replicatePolyfill;
  var fromFoldableImpl = function() {
    function Cons3(head6, tail3) {
      this.head = head6;
      this.tail = tail3;
    }
    var emptyList = {};
    function curryCons(head6) {
      return function(tail3) {
        return new Cons3(head6, tail3);
      };
    }
    function listToArray(list) {
      var result = [];
      var count = 0;
      var xs = list;
      while (xs !== emptyList) {
        result[count++] = xs.head;
        xs = xs.tail;
      }
      return result;
    }
    return function(foldr6) {
      return function(xs) {
        return listToArray(foldr6(curryCons)(emptyList)(xs));
      };
    };
  }();
  var length = function(xs) {
    return xs.length;
  };
  var unconsImpl = function(empty7) {
    return function(next) {
      return function(xs) {
        return xs.length === 0 ? empty7({}) : next(xs[0])(xs.slice(1));
      };
    };
  };
  var indexImpl = function(just) {
    return function(nothing) {
      return function(xs) {
        return function(i2) {
          return i2 < 0 || i2 >= xs.length ? nothing : just(xs[i2]);
        };
      };
    };
  };
  var findIndexImpl = function(just) {
    return function(nothing) {
      return function(f) {
        return function(xs) {
          for (var i2 = 0, l = xs.length; i2 < l; i2++) {
            if (f(xs[i2]))
              return just(i2);
          }
          return nothing;
        };
      };
    };
  };
  var _deleteAt = function(just) {
    return function(nothing) {
      return function(i2) {
        return function(l) {
          if (i2 < 0 || i2 >= l.length)
            return nothing;
          var l1 = l.slice();
          l1.splice(i2, 1);
          return just(l1);
        };
      };
    };
  };
  var _updateAt = function(just) {
    return function(nothing) {
      return function(i2) {
        return function(a2) {
          return function(l) {
            if (i2 < 0 || i2 >= l.length)
              return nothing;
            var l1 = l.slice();
            l1[i2] = a2;
            return just(l1);
          };
        };
      };
    };
  };
  var filter = function(f) {
    return function(xs) {
      return xs.filter(f);
    };
  };
  var sortByImpl = function() {
    function mergeFromTo(compare3, fromOrdering, xs1, xs2, from3, to2) {
      var mid;
      var i2;
      var j;
      var k;
      var x;
      var y;
      var c;
      mid = from3 + (to2 - from3 >> 1);
      if (mid - from3 > 1)
        mergeFromTo(compare3, fromOrdering, xs2, xs1, from3, mid);
      if (to2 - mid > 1)
        mergeFromTo(compare3, fromOrdering, xs2, xs1, mid, to2);
      i2 = from3;
      j = mid;
      k = from3;
      while (i2 < mid && j < to2) {
        x = xs2[i2];
        y = xs2[j];
        c = fromOrdering(compare3(x)(y));
        if (c > 0) {
          xs1[k++] = y;
          ++j;
        } else {
          xs1[k++] = x;
          ++i2;
        }
      }
      while (i2 < mid) {
        xs1[k++] = xs2[i2++];
      }
      while (j < to2) {
        xs1[k++] = xs2[j++];
      }
    }
    return function(compare3) {
      return function(fromOrdering) {
        return function(xs) {
          var out;
          if (xs.length < 2)
            return xs;
          out = xs.slice(0);
          mergeFromTo(compare3, fromOrdering, out, xs.slice(0), 0, xs.length);
          return out;
        };
      };
    };
  }();
  var slice = function(s) {
    return function(e) {
      return function(l) {
        return l.slice(s, e);
      };
    };
  };
  var zipWith = function(f) {
    return function(xs) {
      return function(ys) {
        var l = xs.length < ys.length ? xs.length : ys.length;
        var result = new Array(l);
        for (var i2 = 0; i2 < l; i2++) {
          result[i2] = f(xs[i2])(ys[i2]);
        }
        return result;
      };
    };
  };
  var unsafeIndexImpl = function(xs) {
    return function(n) {
      return xs[n];
    };
  };

  // output/Data.Array.ST/foreign.js
  var pushAll = function(as3) {
    return function(xs) {
      return function() {
        return xs.push.apply(xs, as3);
      };
    };
  };
  var unsafeFreeze = function(xs) {
    return function() {
      return xs;
    };
  };
  function copyImpl(xs) {
    return function() {
      return xs.slice();
    };
  }
  var thaw = copyImpl;
  var sortByImpl2 = function() {
    function mergeFromTo(compare3, fromOrdering, xs1, xs2, from3, to2) {
      var mid;
      var i2;
      var j;
      var k;
      var x;
      var y;
      var c;
      mid = from3 + (to2 - from3 >> 1);
      if (mid - from3 > 1)
        mergeFromTo(compare3, fromOrdering, xs2, xs1, from3, mid);
      if (to2 - mid > 1)
        mergeFromTo(compare3, fromOrdering, xs2, xs1, mid, to2);
      i2 = from3;
      j = mid;
      k = from3;
      while (i2 < mid && j < to2) {
        x = xs2[i2];
        y = xs2[j];
        c = fromOrdering(compare3(x)(y));
        if (c > 0) {
          xs1[k++] = y;
          ++j;
        } else {
          xs1[k++] = x;
          ++i2;
        }
      }
      while (i2 < mid) {
        xs1[k++] = xs2[i2++];
      }
      while (j < to2) {
        xs1[k++] = xs2[j++];
      }
    }
    return function(compare3) {
      return function(fromOrdering) {
        return function(xs) {
          return function() {
            if (xs.length < 2)
              return xs;
            mergeFromTo(compare3, fromOrdering, xs, xs.slice(0), 0, xs.length);
            return xs;
          };
        };
      };
    };
  }();

  // output/Data.Array.ST/index.js
  var withArray = function(f) {
    return function(xs) {
      return function __do2() {
        var result = thaw(xs)();
        f(result)();
        return unsafeFreeze(result)();
      };
    };
  };
  var push = function(a2) {
    return pushAll([a2]);
  };

  // output/Data.Unfoldable/foreign.js
  var unfoldrArrayImpl = function(isNothing2) {
    return function(fromJust11) {
      return function(fst2) {
        return function(snd2) {
          return function(f) {
            return function(b2) {
              var result = [];
              var value18 = b2;
              while (true) {
                var maybe2 = f(value18);
                if (isNothing2(maybe2))
                  return result;
                var tuple = fromJust11(maybe2);
                result.push(fst2(tuple));
                value18 = snd2(tuple);
              }
            };
          };
        };
      };
    };
  };

  // output/Data.Unfoldable1/foreign.js
  var unfoldr1ArrayImpl = function(isNothing2) {
    return function(fromJust11) {
      return function(fst2) {
        return function(snd2) {
          return function(f) {
            return function(b2) {
              var result = [];
              var value18 = b2;
              while (true) {
                var tuple = f(value18);
                result.push(fst2(tuple));
                var maybe2 = snd2(tuple);
                if (isNothing2(maybe2))
                  return result;
                value18 = fromJust11(maybe2);
              }
            };
          };
        };
      };
    };
  };

  // output/Data.Unfoldable1/index.js
  var fromJust2 = /* @__PURE__ */ fromJust();
  var unfoldable1Array = {
    unfoldr1: /* @__PURE__ */ unfoldr1ArrayImpl(isNothing)(fromJust2)(fst)(snd)
  };

  // output/Data.Unfoldable/index.js
  var fromJust3 = /* @__PURE__ */ fromJust();
  var unfoldr = function(dict) {
    return dict.unfoldr;
  };
  var unfoldableArray = {
    unfoldr: /* @__PURE__ */ unfoldrArrayImpl(isNothing)(fromJust3)(fst)(snd),
    Unfoldable10: function() {
      return unfoldable1Array;
    }
  };

  // output/Data.Array/index.js
  var fromJust4 = /* @__PURE__ */ fromJust();
  var append2 = /* @__PURE__ */ append(semigroupArray);
  var updateAt = /* @__PURE__ */ function() {
    return _updateAt(Just.create)(Nothing.value);
  }();
  var unsafeIndex = function() {
    return unsafeIndexImpl;
  };
  var unsafeIndex1 = /* @__PURE__ */ unsafeIndex();
  var uncons = /* @__PURE__ */ function() {
    return unconsImpl($$const(Nothing.value))(function(x) {
      return function(xs) {
        return new Just({
          head: x,
          tail: xs
        });
      };
    });
  }();
  var toUnfoldable = function(dictUnfoldable) {
    var unfoldr3 = unfoldr(dictUnfoldable);
    return function(xs) {
      var len = length(xs);
      var f = function(i2) {
        if (i2 < len) {
          return new Just(new Tuple(unsafeIndex1(xs)(i2), i2 + 1 | 0));
        }
        ;
        if (otherwise) {
          return Nothing.value;
        }
        ;
        throw new Error("Failed pattern match at Data.Array (line 157, column 3 - line 159, column 26): " + [i2.constructor.name]);
      };
      return unfoldr3(f)(0);
    };
  };
  var tail = /* @__PURE__ */ function() {
    return unconsImpl($$const(Nothing.value))(function(v) {
      return function(xs) {
        return new Just(xs);
      };
    });
  }();
  var snoc = function(xs) {
    return function(x) {
      return withArray(push(x))(xs)();
    };
  };
  var singleton2 = function(a2) {
    return [a2];
  };
  var $$null = function(xs) {
    return length(xs) === 0;
  };
  var mapWithIndex = function(f) {
    return function(xs) {
      return zipWith(f)(range(0)(length(xs) - 1 | 0))(xs);
    };
  };
  var init = function(xs) {
    if ($$null(xs)) {
      return Nothing.value;
    }
    ;
    if (otherwise) {
      return new Just(slice(0)(length(xs) - 1 | 0)(xs));
    }
    ;
    throw new Error("Failed pattern match at Data.Array (line 339, column 1 - line 339, column 45): " + [xs.constructor.name]);
  };
  var index = /* @__PURE__ */ function() {
    return indexImpl(Just.create)(Nothing.value);
  }();
  var last = function(xs) {
    return index(xs)(length(xs) - 1 | 0);
  };
  var head = function(xs) {
    return index(xs)(0);
  };
  var fromFoldable = function(dictFoldable) {
    return fromFoldableImpl(foldr(dictFoldable));
  };
  var findIndex = /* @__PURE__ */ function() {
    return findIndexImpl(Just.create)(Nothing.value);
  }();
  var elemIndex = function(dictEq) {
    var eq22 = eq(dictEq);
    return function(x) {
      return findIndex(function(v) {
        return eq22(v)(x);
      });
    };
  };
  var drop = function(n) {
    return function(xs) {
      var $172 = n < 1;
      if ($172) {
        return xs;
      }
      ;
      return slice(n)(length(xs))(xs);
    };
  };
  var deleteAt = /* @__PURE__ */ function() {
    return _deleteAt(Just.create)(Nothing.value);
  }();
  var deleteBy = function(v) {
    return function(v1) {
      return function(v2) {
        if (v2.length === 0) {
          return [];
        }
        ;
        return maybe(v2)(function(i2) {
          return fromJust4(deleteAt(i2)(v2));
        })(findIndex(v(v1))(v2));
      };
    };
  };
  var cons = function(x) {
    return function(xs) {
      return append2([x])(xs);
    };
  };
  var concatMap = /* @__PURE__ */ flip(/* @__PURE__ */ bind(bindArray));
  var mapMaybe = function(f) {
    return concatMap(function() {
      var $190 = maybe([])(singleton2);
      return function($191) {
        return $190(f($191));
      };
    }());
  };

  // output/Data.String.Common/foreign.js
  var replaceAll = function(s1) {
    return function(s2) {
      return function(s3) {
        return s3.replace(new RegExp(s1.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), "g"), s2);
      };
    };
  };
  var split = function(sep) {
    return function(s) {
      return s.split(sep);
    };
  };
  var toLower = function(s) {
    return s.toLowerCase();
  };
  var joinWith = function(s) {
    return function(xs) {
      return xs.join(s);
    };
  };

  // output/Data.String.Utils/foreign.js
  function fromCharArrayImpl(array) {
    return array.join("");
  }
  function toCharArrayImpl(str) {
    return Array.from(str);
  }

  // output/Data.String.CodePoints/foreign.js
  var hasArrayFrom = typeof Array.from === "function";
  var hasStringIterator = typeof Symbol !== "undefined" && Symbol != null && typeof Symbol.iterator !== "undefined" && typeof String.prototype[Symbol.iterator] === "function";
  var hasFromCodePoint = typeof String.prototype.fromCodePoint === "function";
  var hasCodePointAt = typeof String.prototype.codePointAt === "function";
  var _unsafeCodePointAt0 = function(fallback) {
    return hasCodePointAt ? function(str) {
      return str.codePointAt(0);
    } : fallback;
  };
  var _singleton = function(fallback) {
    return hasFromCodePoint ? String.fromCodePoint : fallback;
  };
  var _take = function(fallback) {
    return function(n) {
      if (hasStringIterator) {
        return function(str) {
          var accum = "";
          var iter = str[Symbol.iterator]();
          for (var i2 = 0; i2 < n; ++i2) {
            var o = iter.next();
            if (o.done)
              return accum;
            accum += o.value;
          }
          return accum;
        };
      }
      return fallback(n);
    };
  };
  var _toCodePointArray = function(fallback) {
    return function(unsafeCodePointAt02) {
      if (hasArrayFrom) {
        return function(str) {
          return Array.from(str, unsafeCodePointAt02);
        };
      }
      return fallback;
    };
  };

  // output/Data.Enum/foreign.js
  function toCharCode(c) {
    return c.charCodeAt(0);
  }
  function fromCharCode(c) {
    return String.fromCharCode(c);
  }

  // output/Data.Enum/index.js
  var bottom1 = /* @__PURE__ */ bottom(boundedChar);
  var top1 = /* @__PURE__ */ top(boundedChar);
  var toEnum = function(dict) {
    return dict.toEnum;
  };
  var fromEnum = function(dict) {
    return dict.fromEnum;
  };
  var toEnumWithDefaults = function(dictBoundedEnum) {
    var toEnum1 = toEnum(dictBoundedEnum);
    var fromEnum1 = fromEnum(dictBoundedEnum);
    var bottom22 = bottom(dictBoundedEnum.Bounded0());
    return function(low2) {
      return function(high2) {
        return function(x) {
          var v = toEnum1(x);
          if (v instanceof Just) {
            return v.value0;
          }
          ;
          if (v instanceof Nothing) {
            var $140 = x < fromEnum1(bottom22);
            if ($140) {
              return low2;
            }
            ;
            return high2;
          }
          ;
          throw new Error("Failed pattern match at Data.Enum (line 158, column 33 - line 160, column 62): " + [v.constructor.name]);
        };
      };
    };
  };
  var defaultSucc = function(toEnum$prime) {
    return function(fromEnum$prime) {
      return function(a2) {
        return toEnum$prime(fromEnum$prime(a2) + 1 | 0);
      };
    };
  };
  var defaultPred = function(toEnum$prime) {
    return function(fromEnum$prime) {
      return function(a2) {
        return toEnum$prime(fromEnum$prime(a2) - 1 | 0);
      };
    };
  };
  var charToEnum = function(v) {
    if (v >= toCharCode(bottom1) && v <= toCharCode(top1)) {
      return new Just(fromCharCode(v));
    }
    ;
    return Nothing.value;
  };
  var enumChar = {
    succ: /* @__PURE__ */ defaultSucc(charToEnum)(toCharCode),
    pred: /* @__PURE__ */ defaultPred(charToEnum)(toCharCode),
    Ord0: function() {
      return ordChar;
    }
  };
  var boundedEnumChar = /* @__PURE__ */ function() {
    return {
      cardinality: toCharCode(top1) - toCharCode(bottom1) | 0,
      toEnum: charToEnum,
      fromEnum: toCharCode,
      Bounded0: function() {
        return boundedChar;
      },
      Enum1: function() {
        return enumChar;
      }
    };
  }();

  // output/Data.Int/foreign.js
  var fromNumberImpl = function(just) {
    return function(nothing) {
      return function(n) {
        return (n | 0) === n ? just(n) : nothing;
      };
    };
  };
  var toNumber = function(n) {
    return n;
  };
  var fromStringAsImpl = function(just) {
    return function(nothing) {
      return function(radix) {
        var digits;
        if (radix < 11) {
          digits = "[0-" + (radix - 1).toString() + "]";
        } else if (radix === 11) {
          digits = "[0-9a]";
        } else {
          digits = "[0-9a-" + String.fromCharCode(86 + radix) + "]";
        }
        var pattern2 = new RegExp("^[\\+\\-]?" + digits + "+$", "i");
        return function(s) {
          if (pattern2.test(s)) {
            var i2 = parseInt(s, radix);
            return (i2 | 0) === i2 ? just(i2) : nothing;
          } else {
            return nothing;
          }
        };
      };
    };
  };

  // output/Data.Number/foreign.js
  var isFiniteImpl = isFinite;
  var floor = Math.floor;
  var round = Math.round;

  // output/Data.Number/index.js
  var pi = 3.141592653589793;

  // output/Data.Int/index.js
  var top2 = /* @__PURE__ */ top(boundedInt);
  var bottom2 = /* @__PURE__ */ bottom(boundedInt);
  var fromStringAs = /* @__PURE__ */ function() {
    return fromStringAsImpl(Just.create)(Nothing.value);
  }();
  var fromString = /* @__PURE__ */ fromStringAs(10);
  var fromNumber = /* @__PURE__ */ function() {
    return fromNumberImpl(Just.create)(Nothing.value);
  }();
  var unsafeClamp = function(x) {
    if (!isFiniteImpl(x)) {
      return 0;
    }
    ;
    if (x >= toNumber(top2)) {
      return top2;
    }
    ;
    if (x <= toNumber(bottom2)) {
      return bottom2;
    }
    ;
    if (otherwise) {
      return fromMaybe(0)(fromNumber(x));
    }
    ;
    throw new Error("Failed pattern match at Data.Int (line 72, column 1 - line 72, column 29): " + [x.constructor.name]);
  };
  var round2 = function($37) {
    return unsafeClamp(round($37));
  };
  var floor2 = function($39) {
    return unsafeClamp(floor($39));
  };

  // output/Data.String.CodeUnits/foreign.js
  var fromCharArray = function(a2) {
    return a2.join("");
  };
  var toCharArray = function(s) {
    return s.split("");
  };
  var singleton3 = function(c) {
    return c;
  };
  var length2 = function(s) {
    return s.length;
  };
  var _indexOf = function(just) {
    return function(nothing) {
      return function(x) {
        return function(s) {
          var i2 = s.indexOf(x);
          return i2 === -1 ? nothing : just(i2);
        };
      };
    };
  };
  var _lastIndexOf = function(just) {
    return function(nothing) {
      return function(x) {
        return function(s) {
          var i2 = s.lastIndexOf(x);
          return i2 === -1 ? nothing : just(i2);
        };
      };
    };
  };
  var take = function(n) {
    return function(s) {
      return s.substr(0, n);
    };
  };
  var drop2 = function(n) {
    return function(s) {
      return s.substring(n);
    };
  };
  var splitAt = function(i2) {
    return function(s) {
      return { before: s.substring(0, i2), after: s.substring(i2) };
    };
  };

  // output/Data.String.Unsafe/foreign.js
  var charAt = function(i2) {
    return function(s) {
      if (i2 >= 0 && i2 < s.length)
        return s.charAt(i2);
      throw new Error("Data.String.Unsafe.charAt: Invalid index.");
    };
  };

  // output/Data.String.CodeUnits/index.js
  var stripPrefix = function(v) {
    return function(str) {
      var v1 = splitAt(length2(v))(str);
      var $20 = v1.before === v;
      if ($20) {
        return new Just(v1.after);
      }
      ;
      return Nothing.value;
    };
  };
  var lastIndexOf = /* @__PURE__ */ function() {
    return _lastIndexOf(Just.create)(Nothing.value);
  }();
  var indexOf = /* @__PURE__ */ function() {
    return _indexOf(Just.create)(Nothing.value);
  }();
  var dropRight = function(i2) {
    return function(s) {
      return take(length2(s) - i2 | 0)(s);
    };
  };

  // output/Data.String.CodePoints/index.js
  var $runtime_lazy3 = function(name16, moduleName, init4) {
    var state3 = 0;
    var val;
    return function(lineNumber) {
      if (state3 === 2)
        return val;
      if (state3 === 1)
        throw new ReferenceError(name16 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
      state3 = 1;
      val = init4();
      state3 = 2;
      return val;
    };
  };
  var fromEnum2 = /* @__PURE__ */ fromEnum(boundedEnumChar);
  var map8 = /* @__PURE__ */ map(functorMaybe);
  var unfoldr2 = /* @__PURE__ */ unfoldr(unfoldableArray);
  var div2 = /* @__PURE__ */ div(euclideanRingInt);
  var mod2 = /* @__PURE__ */ mod(euclideanRingInt);
  var compare2 = /* @__PURE__ */ compare(ordInt);
  var unsurrogate = function(lead) {
    return function(trail) {
      return (((lead - 55296 | 0) * 1024 | 0) + (trail - 56320 | 0) | 0) + 65536 | 0;
    };
  };
  var isTrail = function(cu) {
    return 56320 <= cu && cu <= 57343;
  };
  var isLead = function(cu) {
    return 55296 <= cu && cu <= 56319;
  };
  var uncons2 = function(s) {
    var v = length2(s);
    if (v === 0) {
      return Nothing.value;
    }
    ;
    if (v === 1) {
      return new Just({
        head: fromEnum2(charAt(0)(s)),
        tail: ""
      });
    }
    ;
    var cu1 = fromEnum2(charAt(1)(s));
    var cu0 = fromEnum2(charAt(0)(s));
    var $43 = isLead(cu0) && isTrail(cu1);
    if ($43) {
      return new Just({
        head: unsurrogate(cu0)(cu1),
        tail: drop2(2)(s)
      });
    }
    ;
    return new Just({
      head: cu0,
      tail: drop2(1)(s)
    });
  };
  var unconsButWithTuple = function(s) {
    return map8(function(v) {
      return new Tuple(v.head, v.tail);
    })(uncons2(s));
  };
  var toCodePointArrayFallback = function(s) {
    return unfoldr2(unconsButWithTuple)(s);
  };
  var unsafeCodePointAt0Fallback = function(s) {
    var cu0 = fromEnum2(charAt(0)(s));
    var $47 = isLead(cu0) && length2(s) > 1;
    if ($47) {
      var cu1 = fromEnum2(charAt(1)(s));
      var $48 = isTrail(cu1);
      if ($48) {
        return unsurrogate(cu0)(cu1);
      }
      ;
      return cu0;
    }
    ;
    return cu0;
  };
  var unsafeCodePointAt0 = /* @__PURE__ */ _unsafeCodePointAt0(unsafeCodePointAt0Fallback);
  var toCodePointArray = /* @__PURE__ */ _toCodePointArray(toCodePointArrayFallback)(unsafeCodePointAt0);
  var length3 = function($74) {
    return length(toCodePointArray($74));
  };
  var lastIndexOf2 = function(p2) {
    return function(s) {
      return map8(function(i2) {
        return length3(take(i2)(s));
      })(lastIndexOf(p2)(s));
    };
  };
  var indexOf2 = function(p2) {
    return function(s) {
      return map8(function(i2) {
        return length3(take(i2)(s));
      })(indexOf(p2)(s));
    };
  };
  var fromCharCode2 = /* @__PURE__ */ function() {
    var $75 = toEnumWithDefaults(boundedEnumChar)(bottom(boundedChar))(top(boundedChar));
    return function($76) {
      return singleton3($75($76));
    };
  }();
  var singletonFallback = function(v) {
    if (v <= 65535) {
      return fromCharCode2(v);
    }
    ;
    var lead = div2(v - 65536 | 0)(1024) + 55296 | 0;
    var trail = mod2(v - 65536 | 0)(1024) + 56320 | 0;
    return fromCharCode2(lead) + fromCharCode2(trail);
  };
  var singleton4 = /* @__PURE__ */ _singleton(singletonFallback);
  var takeFallback = function(v) {
    return function(v1) {
      if (v < 1) {
        return "";
      }
      ;
      var v2 = uncons2(v1);
      if (v2 instanceof Just) {
        return singleton4(v2.value0.head) + takeFallback(v - 1 | 0)(v2.value0.tail);
      }
      ;
      return v1;
    };
  };
  var take2 = /* @__PURE__ */ _take(takeFallback);
  var eqCodePoint = {
    eq: function(x) {
      return function(y) {
        return x === y;
      };
    }
  };
  var ordCodePoint = {
    compare: function(x) {
      return function(y) {
        return compare2(x)(y);
      };
    },
    Eq0: function() {
      return eqCodePoint;
    }
  };
  var drop3 = function(n) {
    return function(s) {
      return drop2(length2(take2(n)(s)))(s);
    };
  };
  var boundedCodePoint = {
    bottom: 0,
    top: 1114111,
    Ord0: function() {
      return ordCodePoint;
    }
  };
  var boundedEnumCodePoint = /* @__PURE__ */ function() {
    return {
      cardinality: 1114111 + 1 | 0,
      fromEnum: function(v) {
        return v;
      },
      toEnum: function(n) {
        if (n >= 0 && n <= 1114111) {
          return new Just(n);
        }
        ;
        if (otherwise) {
          return Nothing.value;
        }
        ;
        throw new Error("Failed pattern match at Data.String.CodePoints (line 63, column 1 - line 68, column 26): " + [n.constructor.name]);
      },
      Bounded0: function() {
        return boundedCodePoint;
      },
      Enum1: function() {
        return $lazy_enumCodePoint(0);
      }
    };
  }();
  var $lazy_enumCodePoint = /* @__PURE__ */ $runtime_lazy3("enumCodePoint", "Data.String.CodePoints", function() {
    return {
      succ: defaultSucc(toEnum(boundedEnumCodePoint))(fromEnum(boundedEnumCodePoint)),
      pred: defaultPred(toEnum(boundedEnumCodePoint))(fromEnum(boundedEnumCodePoint)),
      Ord0: function() {
        return ordCodePoint;
      }
    };
  });

  // output/Data.String.Regex/foreign.js
  var regexImpl = function(left) {
    return function(right) {
      return function(s1) {
        return function(s2) {
          try {
            return right(new RegExp(s1, s2));
          } catch (e) {
            return left(e.message);
          }
        };
      };
    };
  };
  var _match = function(just) {
    return function(nothing) {
      return function(r) {
        return function(s) {
          var m = s.match(r);
          if (m == null || m.length === 0) {
            return nothing;
          } else {
            for (var i2 = 0; i2 < m.length; i2++) {
              m[i2] = m[i2] == null ? nothing : just(m[i2]);
            }
            return just(m);
          }
        };
      };
    };
  };

  // output/Data.String.Regex.Flags/index.js
  var noFlags = {
    global: false,
    ignoreCase: false,
    multiline: false,
    dotAll: false,
    sticky: false,
    unicode: false
  };

  // output/Data.String.Regex/index.js
  var renderFlags = function(v) {
    return function() {
      if (v.global) {
        return "g";
      }
      ;
      return "";
    }() + (function() {
      if (v.ignoreCase) {
        return "i";
      }
      ;
      return "";
    }() + (function() {
      if (v.multiline) {
        return "m";
      }
      ;
      return "";
    }() + (function() {
      if (v.dotAll) {
        return "s";
      }
      ;
      return "";
    }() + (function() {
      if (v.sticky) {
        return "y";
      }
      ;
      return "";
    }() + function() {
      if (v.unicode) {
        return "u";
      }
      ;
      return "";
    }()))));
  };
  var regex = function(s) {
    return function(f) {
      return regexImpl(Left.create)(Right.create)(s)(renderFlags(f));
    };
  };
  var match = /* @__PURE__ */ function() {
    return _match(Just.create)(Nothing.value);
  }();

  // output/Data.String.Utils/index.js
  var toCharArray2 = function(s) {
    return toCharArrayImpl(s);
  };
  var fromCharArray2 = function(arr) {
    return fromCharArrayImpl(arr);
  };
  var filter2 = function(p2) {
    var $13 = filter(p2);
    return function($14) {
      return fromCharArray2($13(toCharArray2($14)));
    };
  };

  // output/FrettedInstrument.Types/index.js
  var Guitar = /* @__PURE__ */ function() {
    function Guitar2() {
    }
    ;
    Guitar2.value = new Guitar2();
    return Guitar2;
  }();
  var TenorGuitar = /* @__PURE__ */ function() {
    function TenorGuitar2() {
    }
    ;
    TenorGuitar2.value = new TenorGuitar2();
    return TenorGuitar2;
  }();
  var Ukulele = /* @__PURE__ */ function() {
    function Ukulele2() {
    }
    ;
    Ukulele2.value = new Ukulele2();
    return Ukulele2;
  }();
  var Barre = /* @__PURE__ */ function() {
    function Barre2(value0) {
      this.value0 = value0;
    }
    ;
    Barre2.create = function(value0) {
      return new Barre2(value0);
    };
    return Barre2;
  }();
  var OneFret = /* @__PURE__ */ function() {
    function OneFret2(value0) {
      this.value0 = value0;
    }
    ;
    OneFret2.create = function(value0) {
      return new OneFret2(value0);
    };
    return OneFret2;
  }();
  var NoFret = /* @__PURE__ */ function() {
    function NoFret2() {
    }
    ;
    NoFret2.value = new NoFret2();
    return NoFret2;
  }();
  var silent = /* @__PURE__ */ function() {
    return -1 | 0;
  }();
  var showFrettedInstrumentName = {
    show: function(v) {
      if (v instanceof Guitar) {
        return "Guitar";
      }
      ;
      if (v instanceof TenorGuitar) {
        return "Tenor Guitar";
      }
      ;
      if (v instanceof Ukulele) {
        return "Ukulele";
      }
      ;
      throw new Error("Failed pattern match at FrettedInstrument.Types (line 26, column 1 - line 29, column 28): " + [v.constructor.name]);
    }
  };
  var show2 = /* @__PURE__ */ show(showFrettedInstrumentName);
  var open = 0;
  var openStrings = function(stringCount2) {
    return replicate(stringCount2)(open);
  };
  var instrumentNameToURIString = /* @__PURE__ */ function() {
    var $19 = filter2(function(s) {
      return s !== " ";
    });
    return function($20) {
      return toLower($19(show2($20)));
    };
  }();
  var instrumentNameToFileName = /* @__PURE__ */ function() {
    var replaceBlanks = replaceAll(" ")("_");
    return function($21) {
      return toLower(replaceBlanks(show2($21)));
    };
  }();
  var instrumentNameFromURIString = function(s) {
    var readInstrumentName = function(nameStr) {
      if (nameStr === "guitar") {
        return new Just(Guitar.value);
      }
      ;
      if (nameStr === "tenorguitar") {
        return new Just(TenorGuitar.value);
      }
      ;
      if (nameStr === "ukulele") {
        return new Just(Ukulele.value);
      }
      ;
      return Nothing.value;
    };
    var v = readInstrumentName(s);
    if (v instanceof Just) {
      return new Right(v.value0);
    }
    ;
    if (v instanceof Nothing) {
      return new Left("Not a known fretted instrument: " + s);
    }
    ;
    throw new Error("Failed pattern match at FrettedInstrument.Types (line 43, column 3 - line 47, column 53): " + [v.constructor.name]);
  };
  var eqFrettedInstrumentName = {
    eq: function(x) {
      return function(y) {
        if (x instanceof Guitar && y instanceof Guitar) {
          return true;
        }
        ;
        if (x instanceof TenorGuitar && y instanceof TenorGuitar) {
          return true;
        }
        ;
        if (x instanceof Ukulele && y instanceof Ukulele) {
          return true;
        }
        ;
        return false;
      };
    }
  };
  var displayedFretCount = 6;

  // output/Data.Function.Uncurried/foreign.js
  var runFn3 = function(fn) {
    return function(a2) {
      return function(b2) {
        return function(c) {
          return fn(a2, b2, c);
        };
      };
    };
  };
  var runFn4 = function(fn) {
    return function(a2) {
      return function(b2) {
        return function(c) {
          return function(d) {
            return fn(a2, b2, c, d);
          };
        };
      };
    };
  };

  // output/Record/index.js
  var get2 = function(dictIsSymbol) {
    var reflectSymbol2 = reflectSymbol(dictIsSymbol);
    return function() {
      return function(l) {
        return function(r) {
          return unsafeGet(reflectSymbol2(l))(r);
        };
      };
    };
  };

  // output/Data.Array.NonEmpty.Internal/foreign.js
  var traverse1Impl = function() {
    function Cont(fn) {
      this.fn = fn;
    }
    var emptyList = {};
    var ConsCell = function(head6, tail3) {
      this.head = head6;
      this.tail = tail3;
    };
    function finalCell(head6) {
      return new ConsCell(head6, emptyList);
    }
    function consList(x) {
      return function(xs) {
        return new ConsCell(x, xs);
      };
    }
    function listToArray(list) {
      var arr = [];
      var xs = list;
      while (xs !== emptyList) {
        arr.push(xs.head);
        xs = xs.tail;
      }
      return arr;
    }
    return function(apply8) {
      return function(map50) {
        return function(f) {
          var buildFrom = function(x, ys) {
            return apply8(map50(consList)(f(x)))(ys);
          };
          var go2 = function(acc, currentLen, xs) {
            if (currentLen === 0) {
              return acc;
            } else {
              var last4 = xs[currentLen - 1];
              return new Cont(function() {
                var built = go2(buildFrom(last4, acc), currentLen - 1, xs);
                return built;
              });
            }
          };
          return function(array) {
            var acc = map50(finalCell)(f(array[array.length - 1]));
            var result = go2(acc, array.length - 1, array);
            while (result instanceof Cont) {
              result = result.fn();
            }
            return map50(listToArray)(result);
          };
        };
      };
    };
  }();

  // output/Data.FunctorWithIndex/foreign.js
  var mapWithIndexArray = function(f) {
    return function(xs) {
      var l = xs.length;
      var result = Array(l);
      for (var i2 = 0; i2 < l; i2++) {
        result[i2] = f(i2)(xs[i2]);
      }
      return result;
    };
  };

  // output/Data.FunctorWithIndex/index.js
  var mapWithIndex2 = function(dict) {
    return dict.mapWithIndex;
  };
  var functorWithIndexArray = {
    mapWithIndex: mapWithIndexArray,
    Functor0: function() {
      return functorArray;
    }
  };

  // output/Data.TraversableWithIndex/index.js
  var traverseWithIndex = function(dict) {
    return dict.traverseWithIndex;
  };

  // output/Data.Array.NonEmpty.Internal/index.js
  var NonEmptyArray = function(x) {
    return x;
  };
  var semigroupNonEmptyArray = semigroupArray;
  var functorNonEmptyArray = functorArray;
  var foldableNonEmptyArray = foldableArray;

  // output/Data.NonEmpty/index.js
  var NonEmpty = /* @__PURE__ */ function() {
    function NonEmpty2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    NonEmpty2.create = function(value0) {
      return function(value1) {
        return new NonEmpty2(value0, value1);
      };
    };
    return NonEmpty2;
  }();
  var singleton5 = function(dictPlus) {
    var empty7 = empty(dictPlus);
    return function(a2) {
      return new NonEmpty(a2, empty7);
    };
  };
  var functorNonEmpty = function(dictFunctor) {
    var map213 = map(dictFunctor);
    return {
      map: function(f) {
        return function(m) {
          return new NonEmpty(f(m.value0), map213(f)(m.value1));
        };
      }
    };
  };
  var foldableNonEmpty = function(dictFoldable) {
    var foldMap3 = foldMap(dictFoldable);
    var foldl10 = foldl(dictFoldable);
    var foldr6 = foldr(dictFoldable);
    return {
      foldMap: function(dictMonoid) {
        var append16 = append(dictMonoid.Semigroup0());
        var foldMap12 = foldMap3(dictMonoid);
        return function(f) {
          return function(v) {
            return append16(f(v.value0))(foldMap12(f)(v.value1));
          };
        };
      },
      foldl: function(f) {
        return function(b2) {
          return function(v) {
            return foldl10(f)(f(b2)(v.value0))(v.value1);
          };
        };
      },
      foldr: function(f) {
        return function(b2) {
          return function(v) {
            return f(v.value0)(foldr6(f)(b2)(v.value1));
          };
        };
      }
    };
  };

  // output/Data.Array.NonEmpty/index.js
  var fromJust5 = /* @__PURE__ */ fromJust();
  var unsafeFromArray = NonEmptyArray;
  var toArray = function(v) {
    return v;
  };
  var snoc$prime = function(xs) {
    return function(x) {
      return unsafeFromArray(snoc(xs)(x));
    };
  };
  var snoc2 = function(xs) {
    return function(x) {
      return unsafeFromArray(snoc(toArray(xs))(x));
    };
  };
  var singleton6 = function($110) {
    return unsafeFromArray(singleton2($110));
  };
  var fromArray = function(xs) {
    if (length(xs) > 0) {
      return new Just(unsafeFromArray(xs));
    }
    ;
    if (otherwise) {
      return Nothing.value;
    }
    ;
    throw new Error("Failed pattern match at Data.Array.NonEmpty (line 160, column 1 - line 160, column 58): " + [xs.constructor.name]);
  };
  var cons$prime = function(x) {
    return function(xs) {
      return unsafeFromArray(cons(x)(xs));
    };
  };
  var adaptMaybe = function(f) {
    return function($126) {
      return fromJust5(f(toArray($126)));
    };
  };
  var head2 = /* @__PURE__ */ adaptMaybe(head);
  var init2 = /* @__PURE__ */ adaptMaybe(init);
  var last2 = /* @__PURE__ */ adaptMaybe(last);
  var tail2 = /* @__PURE__ */ adaptMaybe(tail);
  var adaptAny = function(f) {
    return function($128) {
      return f(toArray($128));
    };
  };
  var index2 = /* @__PURE__ */ adaptAny(index);
  var unsafeAdapt = function(f) {
    var $129 = adaptAny(f);
    return function($130) {
      return unsafeFromArray($129($130));
    };
  };
  var cons2 = function(x) {
    return unsafeAdapt(cons(x));
  };

  // output/JSURI/foreign.js
  function encodeURIComponent_to_RFC3986(input3) {
    return input3.replace(/[!'()*]/g, function(c) {
      return "%" + c.charCodeAt(0).toString(16);
    });
  }
  function _encodeURIComponent(fail3, succeed, input3) {
    try {
      return succeed(encodeURIComponent_to_RFC3986(encodeURIComponent(input3)));
    } catch (err) {
      return fail3(err);
    }
  }
  function _encodeFormURLComponent(fail3, succeed, input3) {
    try {
      return succeed(encodeURIComponent_to_RFC3986(encodeURIComponent(input3)).replace(/%20/g, "+"));
    } catch (err) {
      return fail3(err);
    }
  }
  function _decodeURIComponent(fail3, succeed, input3) {
    try {
      return succeed(decodeURIComponent(input3));
    } catch (err) {
      return fail3(err);
    }
  }

  // output/JSURI/index.js
  var $$encodeURIComponent = /* @__PURE__ */ function() {
    return runFn3(_encodeURIComponent)($$const(Nothing.value))(Just.create);
  }();
  var encodeFormURLComponent = /* @__PURE__ */ function() {
    return runFn3(_encodeFormURLComponent)($$const(Nothing.value))(Just.create);
  }();
  var $$decodeURIComponent = /* @__PURE__ */ function() {
    return runFn3(_decodeURIComponent)($$const(Nothing.value))(Just.create);
  }();

  // output/Routing.Duplex.Types/index.js
  var emptyRouteState = {
    segments: [],
    params: [],
    hash: ""
  };

  // output/Routing.Duplex.Parser/index.js
  var $runtime_lazy4 = function(name16, moduleName, init4) {
    var state3 = 0;
    var val;
    return function(lineNumber) {
      if (state3 === 2)
        return val;
      if (state3 === 1)
        throw new ReferenceError(name16 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
      state3 = 1;
      val = init4();
      state3 = 2;
      return val;
    };
  };
  var fromJust6 = /* @__PURE__ */ fromJust();
  var map9 = /* @__PURE__ */ map(functorArray);
  var bimap2 = /* @__PURE__ */ bimap(bifunctorTuple);
  var map12 = /* @__PURE__ */ map(functorNonEmptyArray);
  var map22 = /* @__PURE__ */ map(functorFn);
  var foldl2 = /* @__PURE__ */ foldl(foldableNonEmptyArray);
  var append3 = /* @__PURE__ */ append(semigroupNonEmptyArray);
  var Expected = /* @__PURE__ */ function() {
    function Expected2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Expected2.create = function(value0) {
      return function(value1) {
        return new Expected2(value0, value1);
      };
    };
    return Expected2;
  }();
  var ExpectedEndOfPath = /* @__PURE__ */ function() {
    function ExpectedEndOfPath2(value0) {
      this.value0 = value0;
    }
    ;
    ExpectedEndOfPath2.create = function(value0) {
      return new ExpectedEndOfPath2(value0);
    };
    return ExpectedEndOfPath2;
  }();
  var EndOfPath = /* @__PURE__ */ function() {
    function EndOfPath2() {
    }
    ;
    EndOfPath2.value = new EndOfPath2();
    return EndOfPath2;
  }();
  var Fail = /* @__PURE__ */ function() {
    function Fail3(value0) {
      this.value0 = value0;
    }
    ;
    Fail3.create = function(value0) {
      return new Fail3(value0);
    };
    return Fail3;
  }();
  var Success = /* @__PURE__ */ function() {
    function Success2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Success2.create = function(value0) {
      return function(value1) {
        return new Success2(value0, value1);
      };
    };
    return Success2;
  }();
  var Alt = /* @__PURE__ */ function() {
    function Alt2(value0) {
      this.value0 = value0;
    }
    ;
    Alt2.create = function(value0) {
      return new Alt2(value0);
    };
    return Alt2;
  }();
  var Chomp = /* @__PURE__ */ function() {
    function Chomp2(value0) {
      this.value0 = value0;
    }
    ;
    Chomp2.create = function(value0) {
      return new Chomp2(value0);
    };
    return Chomp2;
  }();
  var Prefix = /* @__PURE__ */ function() {
    function Prefix2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Prefix2.create = function(value0) {
      return function(value1) {
        return new Prefix2(value0, value1);
      };
    };
    return Prefix2;
  }();
  var take4 = /* @__PURE__ */ function() {
    return new Chomp(function(state3) {
      var v = uncons(state3.segments);
      if (v instanceof Just) {
        return new Success({
          segments: v.value0.tail,
          params: state3.params,
          hash: state3.hash
        }, v.value0.head);
      }
      ;
      return new Fail(EndOfPath.value);
    });
  }();
  var prefix = /* @__PURE__ */ function() {
    return Prefix.create;
  }();
  var parsePath = /* @__PURE__ */ function() {
    var unsafeDecodeURIComponent = function($328) {
      return fromJust6($$decodeURIComponent($328));
    };
    var toRouteState = function(v) {
      return {
        segments: v.value0.value0,
        params: v.value0.value1,
        hash: v.value1
      };
    };
    var splitNonEmpty = function(v) {
      return function(v1) {
        if (v1 === "") {
          return [];
        }
        ;
        return split(v)(v1);
      };
    };
    var splitSegments = function() {
      var $329 = splitNonEmpty("/");
      return function($330) {
        return function(v) {
          if (v.length === 2 && (v[0] === "" && v[1] === "")) {
            return [""];
          }
          ;
          return map9(unsafeDecodeURIComponent)(v);
        }($329($330));
      };
    }();
    var splitAt4 = function(k) {
      return function(p2) {
        return function(str) {
          var v = indexOf(p2)(str);
          if (v instanceof Just) {
            return new Tuple(take(v.value0)(str), drop2(v.value0 + length2(p2) | 0)(str));
          }
          ;
          if (v instanceof Nothing) {
            return k(str);
          }
          ;
          throw new Error("Failed pattern match at Routing.Duplex.Parser (line 185, column 5 - line 187, column 23): " + [v.constructor.name]);
        };
      };
    };
    var splitKeyValue = function() {
      var $331 = bimap2(unsafeDecodeURIComponent)(unsafeDecodeURIComponent);
      var $332 = splitAt4(flip(Tuple.create)(""))("=");
      return function($333) {
        return $331($332($333));
      };
    }();
    var splitParams = function() {
      var $334 = map9(splitKeyValue);
      var $335 = splitNonEmpty("&");
      return function($336) {
        return $334($335($336));
      };
    }();
    var splitPath = function() {
      var $337 = bimap2(splitSegments)(splitParams);
      var $338 = splitAt4(flip(Tuple.create)(""))("?");
      return function($339) {
        return $337($338($339));
      };
    }();
    var $340 = lmap(bifunctorTuple)(splitPath);
    var $341 = splitAt4(flip(Tuple.create)(""))("#");
    return function($342) {
      return toRouteState($340($341($342)));
    };
  }();
  var functorRouteResult = {
    map: function(f) {
      return function(m) {
        if (m instanceof Fail) {
          return new Fail(m.value0);
        }
        ;
        if (m instanceof Success) {
          return new Success(m.value0, f(m.value1));
        }
        ;
        throw new Error("Failed pattern match at Routing.Duplex.Parser (line 0, column 0 - line 0, column 0): " + [m.constructor.name]);
      };
    }
  };
  var map32 = /* @__PURE__ */ map(functorRouteResult);
  var functorRouteParser = {
    map: function(f) {
      return function(m) {
        if (m instanceof Alt) {
          return new Alt(map12(map(functorRouteParser)(f))(m.value0));
        }
        ;
        if (m instanceof Chomp) {
          return new Chomp(map22(map32(f))(m.value0));
        }
        ;
        if (m instanceof Prefix) {
          return new Prefix(m.value0, map(functorRouteParser)(f)(m.value1));
        }
        ;
        throw new Error("Failed pattern match at Routing.Duplex.Parser (line 0, column 0 - line 0, column 0): " + [m.constructor.name]);
      };
    }
  };
  var end = /* @__PURE__ */ function() {
    return new Chomp(function(state3) {
      var v = head(state3.segments);
      if (v instanceof Nothing) {
        return new Success(state3, unit);
      }
      ;
      if (v instanceof Just) {
        return new Fail(new ExpectedEndOfPath(v.value0));
      }
      ;
      throw new Error("Failed pattern match at Routing.Duplex.Parser (line 256, column 3 - line 258, column 45): " + [v.constructor.name]);
    });
  }();
  var chompPrefix = function(pre2) {
    return function(state3) {
      var v = head(state3.segments);
      if (v instanceof Just && pre2 === v.value0) {
        return new Success({
          segments: drop(1)(state3.segments),
          params: state3.params,
          hash: state3.hash
        }, unit);
      }
      ;
      if (v instanceof Just) {
        return new Fail(new Expected(pre2, v.value0));
      }
      ;
      return new Fail(EndOfPath.value);
    };
  };
  var $lazy_runRouteParser = /* @__PURE__ */ $runtime_lazy4("runRouteParser", "Routing.Duplex.Parser", function() {
    var goAlt = function(v) {
      return function(v1) {
        return function(v2) {
          if (v1 instanceof Fail) {
            return $lazy_runRouteParser(153)(v)(v2);
          }
          ;
          return v1;
        };
      };
    };
    var go2 = function($copy_state) {
      return function($copy_v) {
        var $tco_var_state = $copy_state;
        var $tco_done = false;
        var $tco_result;
        function $tco_loop(state3, v) {
          if (v instanceof Alt) {
            $tco_done = true;
            return foldl2(goAlt(state3))(new Fail(EndOfPath.value))(v.value0);
          }
          ;
          if (v instanceof Chomp) {
            $tco_done = true;
            return v.value0(state3);
          }
          ;
          if (v instanceof Prefix) {
            var v1 = chompPrefix(v.value0)(state3);
            if (v1 instanceof Fail) {
              $tco_done = true;
              return new Fail(v1.value0);
            }
            ;
            if (v1 instanceof Success) {
              $tco_var_state = v1.value0;
              $copy_v = v.value1;
              return;
            }
            ;
            throw new Error("Failed pattern match at Routing.Duplex.Parser (line 149, column 7 - line 151, column 40): " + [v1.constructor.name]);
          }
          ;
          throw new Error("Failed pattern match at Routing.Duplex.Parser (line 145, column 14 - line 151, column 40): " + [v.constructor.name]);
        }
        ;
        while (!$tco_done) {
          $tco_result = $tco_loop($tco_var_state, $copy_v);
        }
        ;
        return $tco_result;
      };
    };
    return go2;
  });
  var runRouteParser = /* @__PURE__ */ $lazy_runRouteParser(142);
  var run3 = function(p2) {
    var $345 = flip(runRouteParser)(p2);
    return function($346) {
      return function(v) {
        if (v instanceof Fail) {
          return new Left(v.value0);
        }
        ;
        if (v instanceof Success) {
          return new Right(v.value1);
        }
        ;
        throw new Error("Failed pattern match at Routing.Duplex.Parser (line 190, column 49 - line 192, column 29): " + [v.constructor.name]);
      }($345(parsePath($346)));
    };
  };
  var as = function(print8) {
    return function(decode2) {
      return function(p2) {
        return new Chomp(function(state3) {
          var v = runRouteParser(state3)(p2);
          if (v instanceof Fail) {
            return new Fail(v.value0);
          }
          ;
          if (v instanceof Success) {
            var v1 = decode2(v.value1);
            if (v1 instanceof Left) {
              return new Fail(new Expected(v1.value0, print8(v.value1)));
            }
            ;
            if (v1 instanceof Right) {
              return new Success(v.value0, v1.value0);
            }
            ;
            throw new Error("Failed pattern match at Routing.Duplex.Parser (line 244, column 7 - line 246, column 36): " + [v1.constructor.name]);
          }
          ;
          throw new Error("Failed pattern match at Routing.Duplex.Parser (line 241, column 3 - line 246, column 36): " + [v.constructor.name]);
        });
      };
    };
  };
  var applyRouteParser = {
    apply: function(fx) {
      return function(x) {
        return new Chomp(function(state3) {
          var v = runRouteParser(state3)(fx);
          if (v instanceof Fail) {
            return new Fail(v.value0);
          }
          ;
          if (v instanceof Success) {
            return map32(v.value1)(runRouteParser(v.value0)(x));
          }
          ;
          throw new Error("Failed pattern match at Routing.Duplex.Parser (line 76, column 5 - line 78, column 56): " + [v.constructor.name]);
        });
      };
    },
    Functor0: function() {
      return functorRouteParser;
    }
  };
  var applicativeRouteParser = {
    pure: /* @__PURE__ */ function() {
      var $347 = flip(Success.create);
      return function($348) {
        return Chomp.create($347($348));
      };
    }(),
    Apply0: function() {
      return applyRouteParser;
    }
  };
  var altSnoc = function(v) {
    return function(v1) {
      var v2 = function(v3) {
        return snoc2(v)(v1);
      };
      if (v1 instanceof Prefix) {
        var $288 = last2(v);
        if ($288 instanceof Prefix) {
          var $289 = v1.value0 === $288.value0;
          if ($289) {
            return snoc$prime(init2(v))(new Prefix(v1.value0, alt(altRouteParser)($288.value1)(v1.value1)));
          }
          ;
          return v2(true);
        }
        ;
        return v2(true);
      }
      ;
      return v2(true);
    };
  };
  var altRouteParser = {
    alt: function(v) {
      return function(v1) {
        if (v instanceof Alt && v1 instanceof Alt) {
          return new Alt(altAppend(v.value0)(v1.value0));
        }
        ;
        if (v instanceof Alt) {
          return new Alt(altSnoc(v.value0)(v1));
        }
        ;
        if (v1 instanceof Alt) {
          return new Alt(altCons(v)(v1.value0));
        }
        ;
        if (v instanceof Prefix && (v1 instanceof Prefix && v.value0 === v1.value0)) {
          return new Prefix(v.value0, alt(altRouteParser)(v.value1)(v1.value1));
        }
        ;
        return new Alt(cons2(v)(singleton6(v1)));
      };
    },
    Functor0: function() {
      return functorRouteParser;
    }
  };
  var altCons = function(v) {
    return function(v1) {
      var v2 = function(v3) {
        return cons2(v)(v1);
      };
      if (v instanceof Prefix) {
        var $308 = head2(v1);
        if ($308 instanceof Prefix) {
          var $309 = v.value0 === $308.value0;
          if ($309) {
            return cons$prime(new Prefix(v.value0, alt(altRouteParser)(v.value1)($308.value1)))(tail2(v1));
          }
          ;
          return v2(true);
        }
        ;
        return v2(true);
      }
      ;
      return v2(true);
    };
  };
  var altAppend = function($copy_ls) {
    return function($copy_rs) {
      var $tco_var_ls = $copy_ls;
      var $tco_done = false;
      var $tco_result;
      function $tco_loop(ls, rs) {
        var v = function(v12) {
          if (otherwise) {
            return append3(ls)(rs);
          }
          ;
          throw new Error("Failed pattern match at Routing.Duplex.Parser (line 98, column 1 - line 101, column 32): " + [ls.constructor.name, rs.constructor.name]);
        };
        var $318 = last2(ls);
        if ($318 instanceof Prefix) {
          var $319 = head2(rs);
          if ($319 instanceof Prefix) {
            var $320 = $318.value0 === $319.value0;
            if ($320) {
              var rs$prime = cons$prime(new Prefix($318.value0, alt(altRouteParser)($318.value1)($319.value1)))(tail2(rs));
              var v1 = fromArray(init2(ls));
              if (v1 instanceof Just) {
                $tco_var_ls = v1.value0;
                $copy_rs = rs$prime;
                return;
              }
              ;
              if (v1 instanceof Nothing) {
                $tco_done = true;
                return rs$prime;
              }
              ;
              throw new Error("Failed pattern match at Routing.Duplex.Parser (line 110, column 9 - line 112, column 26): " + [v1.constructor.name]);
            }
            ;
            $tco_done = true;
            return v(true);
          }
          ;
          $tco_done = true;
          return v(true);
        }
        ;
        $tco_done = true;
        return v(true);
      }
      ;
      while (!$tco_done) {
        $tco_result = $tco_loop($tco_var_ls, $copy_rs);
      }
      ;
      return $tco_result;
    };
  };

  // output/Routing.Duplex.Printer/index.js
  var fromJust7 = /* @__PURE__ */ fromJust();
  var map10 = /* @__PURE__ */ map(functorArray);
  var semigroupRoutePrinter = {
    append: function(v) {
      return function(v1) {
        return function($33) {
          return v1(v($33));
        };
      };
    }
  };
  var put2 = function(str) {
    return function(state3) {
      return {
        segments: snoc(state3.segments)(str),
        params: state3.params,
        hash: state3.hash
      };
    };
  };
  var printPath = function(v) {
    var unsafeEncodeURIComponent = function($35) {
      return fromJust7($$encodeURIComponent($35));
    };
    var printSegments = function(v1) {
      if (v1.length === 1 && v1[0] === "") {
        return "/";
      }
      ;
      return joinWith("/")(map10(unsafeEncodeURIComponent)(v1));
    };
    var printParam = function(v1) {
      return function(v2) {
        if (v2 === "") {
          return unsafeEncodeURIComponent(v1);
        }
        ;
        return unsafeEncodeURIComponent(v1) + ("=" + unsafeEncodeURIComponent(v2));
      };
    };
    var printParams = function(v1) {
      if (v1.length === 0) {
        return "";
      }
      ;
      return "?" + joinWith("&")(map10(uncurry(printParam))(v1));
    };
    var printHash = function(v1) {
      if (v1 === "") {
        return "";
      }
      ;
      return "#" + v1;
    };
    return printSegments(v.segments) + (printParams(v.params) + printHash(v.hash));
  };
  var run4 = /* @__PURE__ */ function() {
    var $36 = applyFlipped(emptyRouteState);
    var $37 = unwrap();
    return function($38) {
      return printPath($36($37($38)));
    };
  }();
  var monoidRoutePRinter = {
    mempty: /* @__PURE__ */ identity(categoryFn),
    Semigroup0: function() {
      return semigroupRoutePrinter;
    }
  };

  // output/Routing.Duplex/index.js
  var append4 = /* @__PURE__ */ append(semigroupRoutePrinter);
  var applyFirst2 = /* @__PURE__ */ applyFirst(applyRouteParser);
  var pure4 = /* @__PURE__ */ pure(applicativeRouteParser);
  var identity9 = /* @__PURE__ */ identity(categoryFn);
  var apply2 = /* @__PURE__ */ apply(applyRouteParser);
  var map11 = /* @__PURE__ */ map(functorRouteParser);
  var mempty2 = /* @__PURE__ */ mempty(monoidRoutePRinter);
  var apply1 = /* @__PURE__ */ apply(applyFn);
  var map13 = /* @__PURE__ */ map(functorFn);
  var RouteDuplex = /* @__PURE__ */ function() {
    function RouteDuplex2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    RouteDuplex2.create = function(value0) {
      return function(value1) {
        return new RouteDuplex2(value0, value1);
      };
    };
    return RouteDuplex2;
  }();
  var segment = /* @__PURE__ */ function() {
    return new RouteDuplex(put2, take4);
  }();
  var profunctorRouteDuplex = {
    dimap: function(f) {
      return function(g) {
        return function(v) {
          return new RouteDuplex(function($137) {
            return v.value0(f($137));
          }, map11(g)(v.value1));
        };
      };
    }
  };
  var print = function(v) {
    return function($138) {
      return run4(v.value0($138));
    };
  };
  var prefix2 = function(s) {
    return function(v) {
      return new RouteDuplex(function(a2) {
        return append4(put2(s))(v.value0(a2));
      }, prefix(s)(v.value1));
    };
  };
  var path = /* @__PURE__ */ function() {
    var $139 = flip(foldr(foldableArray)(prefix2));
    var $140 = split("/");
    return function($141) {
      return $139($140($141));
    };
  }();
  var root = /* @__PURE__ */ path("");
  var parse = function(v) {
    return run3(v.value1);
  };
  var functorRouteDuplex = {
    map: function(f) {
      return function(m) {
        return new RouteDuplex(m.value0, map11(f)(m.value1));
      };
    }
  };
  var end2 = function(v) {
    return new RouteDuplex(v.value0, applyFirst2(v.value1)(end));
  };
  var as2 = function(f) {
    return function(g) {
      return function(v) {
        return new RouteDuplex(function($142) {
          return v.value0(f($142));
        }, as(identity9)(g)(v.value1));
      };
    };
  };
  var applyRouteDuplex = {
    apply: function(v) {
      return function(v1) {
        return new RouteDuplex(apply1(map13(append4)(v.value0))(v1.value0), apply2(v.value1)(v1.value1));
      };
    },
    Functor0: function() {
      return functorRouteDuplex;
    }
  };
  var applicativeRouteDuplex = {
    pure: /* @__PURE__ */ function() {
      var $143 = RouteDuplex.create($$const(mempty2));
      return function($144) {
        return $143(pure4($144));
      };
    }(),
    Apply0: function() {
      return applyRouteDuplex;
    }
  };

  // output/Routing.Duplex.Generic/index.js
  var identity10 = /* @__PURE__ */ identity(categoryFn);
  var map14 = /* @__PURE__ */ map(functorRouteParser);
  var alt2 = /* @__PURE__ */ alt(altRouteParser);
  var dimap2 = /* @__PURE__ */ dimap(profunctorRouteDuplex);
  var noArgs = /* @__PURE__ */ function() {
    return pure(applicativeRouteDuplex)(NoArguments.value);
  }();
  var gRouteNoArguments = {
    gRouteDuplexCtr: identity10
  };
  var gRouteDuplexCtr = function(dict) {
    return dict.gRouteDuplexCtr;
  };
  var gRouteDuplex = function(dict) {
    return dict.gRouteDuplex;
  };
  var gRouteSum = function(dictGRouteDuplex) {
    var gRouteDuplex1 = gRouteDuplex(dictGRouteDuplex);
    return function(dictGRouteDuplex1) {
      var gRouteDuplex2 = gRouteDuplex(dictGRouteDuplex1);
      return {
        gRouteDuplex: function(r) {
          var v = gRouteDuplex1(r);
          var v1 = gRouteDuplex2(r);
          var enc = function(v2) {
            if (v2 instanceof Inl) {
              return v.value0(v2.value0);
            }
            ;
            if (v2 instanceof Inr) {
              return v1.value0(v2.value0);
            }
            ;
            throw new Error("Failed pattern match at Routing.Duplex.Generic (line 33, column 11 - line 35, column 22): " + [v2.constructor.name]);
          };
          var dec = alt2(map14(Inl.create)(v.value1))(map14(Inr.create)(v1.value1));
          return new RouteDuplex(enc, dec);
        }
      };
    };
  };
  var sum2 = function(dictGeneric) {
    var from3 = from(dictGeneric);
    var to2 = to(dictGeneric);
    return function(dictGRouteDuplex) {
      var $66 = dimap2(from3)(to2);
      var $67 = gRouteDuplex(dictGRouteDuplex);
      return function($68) {
        return $66($67($68));
      };
    };
  };
  var gRouteConstructor = function(dictIsSymbol) {
    var get8 = get2(dictIsSymbol)();
    return function() {
      return function(dictGRouteDuplexCtr) {
        var gRouteDuplexCtr1 = gRouteDuplexCtr(dictGRouteDuplexCtr);
        return {
          gRouteDuplex: function(r) {
            var v = end2(gRouteDuplexCtr1(get8($$Proxy.value)(r)));
            var enc = function(v1) {
              return v.value0(v1);
            };
            var dec = map14(Constructor)(v.value1);
            return new RouteDuplex(enc, dec);
          }
        };
      };
    };
  };
  var gRouteArgument = {
    gRouteDuplexCtr: identity10
  };
  var gRouteAll = {
    gRouteDuplexCtr: function(v) {
      return new RouteDuplex(function(v1) {
        return v.value0(v1);
      }, map14(Argument)(v.value1));
    }
  };

  // output/Routing.Duplex.Generic.Syntax/index.js
  var gsepStringRoute = function(dictGRouteDuplexCtr) {
    var gRouteDuplexCtr2 = gRouteDuplexCtr(dictGRouteDuplexCtr);
    return {
      gsep: function(a2) {
        var $15 = prefix2(a2);
        return function($16) {
          return $15(gRouteDuplexCtr2($16));
        };
      }
    };
  };
  var gsep = function(dict) {
    return dict.gsep;
  };

  // output/Navigation.Route/index.js
  var HomeIsSymbol = {
    reflectSymbol: function() {
      return "Home";
    }
  };
  var FrettedInstrumentIsSymbol = {
    reflectSymbol: function() {
      return "FrettedInstrument";
    }
  };
  var BassIsSymbol = {
    reflectSymbol: function() {
      return "Bass";
    }
  };
  var PianoIsSymbol = {
    reflectSymbol: function() {
      return "Piano";
    }
  };
  var gsep2 = /* @__PURE__ */ gsep(/* @__PURE__ */ gsepStringRoute(gRouteNoArguments));
  var eq3 = /* @__PURE__ */ eq(eqFrettedInstrumentName);
  var Home = /* @__PURE__ */ function() {
    function Home2() {
    }
    ;
    Home2.value = new Home2();
    return Home2;
  }();
  var FrettedInstrument = /* @__PURE__ */ function() {
    function FrettedInstrument2(value0) {
      this.value0 = value0;
    }
    ;
    FrettedInstrument2.create = function(value0) {
      return new FrettedInstrument2(value0);
    };
    return FrettedInstrument2;
  }();
  var Bass = /* @__PURE__ */ function() {
    function Bass2() {
    }
    ;
    Bass2.value = new Bass2();
    return Bass2;
  }();
  var Piano = /* @__PURE__ */ function() {
    function Piano2() {
    }
    ;
    Piano2.value = new Piano2();
    return Piano2;
  }();
  var genericRoute = {
    to: function(x) {
      if (x instanceof Inl) {
        return Home.value;
      }
      ;
      if (x instanceof Inr && x.value0 instanceof Inl) {
        return new FrettedInstrument(x.value0.value0);
      }
      ;
      if (x instanceof Inr && (x.value0 instanceof Inr && x.value0.value0 instanceof Inl)) {
        return Bass.value;
      }
      ;
      if (x instanceof Inr && (x.value0 instanceof Inr && x.value0.value0 instanceof Inr)) {
        return Piano.value;
      }
      ;
      throw new Error("Failed pattern match at Navigation.Route (line 24, column 1 - line 24, column 48): " + [x.constructor.name]);
    },
    from: function(x) {
      if (x instanceof Home) {
        return new Inl(NoArguments.value);
      }
      ;
      if (x instanceof FrettedInstrument) {
        return new Inr(new Inl(x.value0));
      }
      ;
      if (x instanceof Bass) {
        return new Inr(new Inr(new Inl(NoArguments.value)));
      }
      ;
      if (x instanceof Piano) {
        return new Inr(new Inr(new Inr(NoArguments.value)));
      }
      ;
      throw new Error("Failed pattern match at Navigation.Route (line 24, column 1 - line 24, column 48): " + [x.constructor.name]);
    }
  };
  var frettedInstrumentName = /* @__PURE__ */ as2(instrumentNameToURIString)(instrumentNameFromURIString);
  var routeCodec = /* @__PURE__ */ root(/* @__PURE__ */ sum2(genericRoute)(/* @__PURE__ */ gRouteSum(/* @__PURE__ */ gRouteConstructor(HomeIsSymbol)()(gRouteNoArguments))(/* @__PURE__ */ gRouteSum(/* @__PURE__ */ gRouteConstructor(FrettedInstrumentIsSymbol)()(gRouteArgument))(/* @__PURE__ */ gRouteSum(/* @__PURE__ */ gRouteConstructor(BassIsSymbol)()(gRouteNoArguments))(/* @__PURE__ */ gRouteConstructor(PianoIsSymbol)()(gRouteNoArguments)))))({
    Home: noArgs,
    FrettedInstrument: /* @__PURE__ */ gsep(/* @__PURE__ */ gsepStringRoute(gRouteAll))("frettedInstrument")(/* @__PURE__ */ frettedInstrumentName(segment)),
    Bass: /* @__PURE__ */ gsep2("bass")(noArgs),
    Piano: /* @__PURE__ */ gsep2("piano")(noArgs)
  }));
  var eqRoute = {
    eq: function(x) {
      return function(y) {
        if (x instanceof Home && y instanceof Home) {
          return true;
        }
        ;
        if (x instanceof FrettedInstrument && y instanceof FrettedInstrument) {
          return eq3(x.value0)(y.value0);
        }
        ;
        if (x instanceof Bass && y instanceof Bass) {
          return true;
        }
        ;
        if (x instanceof Piano && y instanceof Piano) {
          return true;
        }
        ;
        return false;
      };
    }
  };

  // output/Data.List.Types/index.js
  var Nil = /* @__PURE__ */ function() {
    function Nil3() {
    }
    ;
    Nil3.value = new Nil3();
    return Nil3;
  }();
  var Cons = /* @__PURE__ */ function() {
    function Cons3(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Cons3.create = function(value0) {
      return function(value1) {
        return new Cons3(value0, value1);
      };
    };
    return Cons3;
  }();
  var NonEmptyList = function(x) {
    return x;
  };
  var toList = function(v) {
    return new Cons(v.value0, v.value1);
  };
  var listMap = function(f) {
    var chunkedRevMap = function($copy_v) {
      return function($copy_v1) {
        var $tco_var_v = $copy_v;
        var $tco_done = false;
        var $tco_result;
        function $tco_loop(v, v1) {
          if (v1 instanceof Cons && (v1.value1 instanceof Cons && v1.value1.value1 instanceof Cons)) {
            $tco_var_v = new Cons(v1, v);
            $copy_v1 = v1.value1.value1.value1;
            return;
          }
          ;
          var unrolledMap = function(v2) {
            if (v2 instanceof Cons && (v2.value1 instanceof Cons && v2.value1.value1 instanceof Nil)) {
              return new Cons(f(v2.value0), new Cons(f(v2.value1.value0), Nil.value));
            }
            ;
            if (v2 instanceof Cons && v2.value1 instanceof Nil) {
              return new Cons(f(v2.value0), Nil.value);
            }
            ;
            return Nil.value;
          };
          var reverseUnrolledMap = function($copy_v2) {
            return function($copy_v3) {
              var $tco_var_v2 = $copy_v2;
              var $tco_done1 = false;
              var $tco_result2;
              function $tco_loop2(v2, v3) {
                if (v2 instanceof Cons && (v2.value0 instanceof Cons && (v2.value0.value1 instanceof Cons && v2.value0.value1.value1 instanceof Cons))) {
                  $tco_var_v2 = v2.value1;
                  $copy_v3 = new Cons(f(v2.value0.value0), new Cons(f(v2.value0.value1.value0), new Cons(f(v2.value0.value1.value1.value0), v3)));
                  return;
                }
                ;
                $tco_done1 = true;
                return v3;
              }
              ;
              while (!$tco_done1) {
                $tco_result2 = $tco_loop2($tco_var_v2, $copy_v3);
              }
              ;
              return $tco_result2;
            };
          };
          $tco_done = true;
          return reverseUnrolledMap(v)(unrolledMap(v1));
        }
        ;
        while (!$tco_done) {
          $tco_result = $tco_loop($tco_var_v, $copy_v1);
        }
        ;
        return $tco_result;
      };
    };
    return chunkedRevMap(Nil.value);
  };
  var functorList = {
    map: listMap
  };
  var map15 = /* @__PURE__ */ map(functorList);
  var functorNonEmptyList = /* @__PURE__ */ functorNonEmpty(functorList);
  var foldableList = {
    foldr: function(f) {
      return function(b2) {
        var rev3 = function() {
          var go2 = function($copy_v) {
            return function($copy_v1) {
              var $tco_var_v = $copy_v;
              var $tco_done = false;
              var $tco_result;
              function $tco_loop(v, v1) {
                if (v1 instanceof Nil) {
                  $tco_done = true;
                  return v;
                }
                ;
                if (v1 instanceof Cons) {
                  $tco_var_v = new Cons(v1.value0, v);
                  $copy_v1 = v1.value1;
                  return;
                }
                ;
                throw new Error("Failed pattern match at Data.List.Types (line 107, column 7 - line 107, column 23): " + [v.constructor.name, v1.constructor.name]);
              }
              ;
              while (!$tco_done) {
                $tco_result = $tco_loop($tco_var_v, $copy_v1);
              }
              ;
              return $tco_result;
            };
          };
          return go2(Nil.value);
        }();
        var $284 = foldl(foldableList)(flip(f))(b2);
        return function($285) {
          return $284(rev3($285));
        };
      };
    },
    foldl: function(f) {
      var go2 = function($copy_b) {
        return function($copy_v) {
          var $tco_var_b = $copy_b;
          var $tco_done1 = false;
          var $tco_result;
          function $tco_loop(b2, v) {
            if (v instanceof Nil) {
              $tco_done1 = true;
              return b2;
            }
            ;
            if (v instanceof Cons) {
              $tco_var_b = f(b2)(v.value0);
              $copy_v = v.value1;
              return;
            }
            ;
            throw new Error("Failed pattern match at Data.List.Types (line 111, column 12 - line 113, column 30): " + [v.constructor.name]);
          }
          ;
          while (!$tco_done1) {
            $tco_result = $tco_loop($tco_var_b, $copy_v);
          }
          ;
          return $tco_result;
        };
      };
      return go2;
    },
    foldMap: function(dictMonoid) {
      var append22 = append(dictMonoid.Semigroup0());
      var mempty7 = mempty(dictMonoid);
      return function(f) {
        return foldl(foldableList)(function(acc) {
          var $286 = append22(acc);
          return function($287) {
            return $286(f($287));
          };
        })(mempty7);
      };
    }
  };
  var foldr2 = /* @__PURE__ */ foldr(foldableList);
  var foldableNonEmptyList = /* @__PURE__ */ foldableNonEmpty(foldableList);
  var semigroupList = {
    append: function(xs) {
      return function(ys) {
        return foldr2(Cons.create)(ys)(xs);
      };
    }
  };
  var append1 = /* @__PURE__ */ append(semigroupList);
  var monoidList = /* @__PURE__ */ function() {
    return {
      mempty: Nil.value,
      Semigroup0: function() {
        return semigroupList;
      }
    };
  }();
  var semigroupNonEmptyList = {
    append: function(v) {
      return function(as$prime) {
        return new NonEmpty(v.value0, append1(v.value1)(toList(as$prime)));
      };
    }
  };
  var applyList = {
    apply: function(v) {
      return function(v1) {
        if (v instanceof Nil) {
          return Nil.value;
        }
        ;
        if (v instanceof Cons) {
          return append1(map15(v.value0)(v1))(apply(applyList)(v.value1)(v1));
        }
        ;
        throw new Error("Failed pattern match at Data.List.Types (line 157, column 1 - line 159, column 48): " + [v.constructor.name, v1.constructor.name]);
      };
    },
    Functor0: function() {
      return functorList;
    }
  };
  var apply3 = /* @__PURE__ */ apply(applyList);
  var applyNonEmptyList = {
    apply: function(v) {
      return function(v1) {
        return new NonEmpty(v.value0(v1.value0), append1(apply3(v.value1)(new Cons(v1.value0, Nil.value)))(apply3(new Cons(v.value0, v.value1))(v1.value1)));
      };
    },
    Functor0: function() {
      return functorNonEmptyList;
    }
  };
  var altList = {
    alt: append1,
    Functor0: function() {
      return functorList;
    }
  };
  var plusList = /* @__PURE__ */ function() {
    return {
      empty: Nil.value,
      Alt0: function() {
        return altList;
      }
    };
  }();
  var applicativeNonEmptyList = {
    pure: /* @__PURE__ */ function() {
      var $315 = singleton5(plusList);
      return function($316) {
        return NonEmptyList($315($316));
      };
    }(),
    Apply0: function() {
      return applyNonEmptyList;
    }
  };

  // output/Data.List/index.js
  var singleton7 = function(a2) {
    return new Cons(a2, Nil.value);
  };
  var reverse2 = /* @__PURE__ */ function() {
    var go2 = function($copy_v) {
      return function($copy_v1) {
        var $tco_var_v = $copy_v;
        var $tco_done = false;
        var $tco_result;
        function $tco_loop(v, v1) {
          if (v1 instanceof Nil) {
            $tco_done = true;
            return v;
          }
          ;
          if (v1 instanceof Cons) {
            $tco_var_v = new Cons(v1.value0, v);
            $copy_v1 = v1.value1;
            return;
          }
          ;
          throw new Error("Failed pattern match at Data.List (line 368, column 3 - line 368, column 19): " + [v.constructor.name, v1.constructor.name]);
        }
        ;
        while (!$tco_done) {
          $tco_result = $tco_loop($tco_var_v, $copy_v1);
        }
        ;
        return $tco_result;
      };
    };
    return go2(Nil.value);
  }();
  var $$null2 = function(v) {
    if (v instanceof Nil) {
      return true;
    }
    ;
    return false;
  };

  // output/Data.Map.Internal/index.js
  var identity11 = /* @__PURE__ */ identity(categoryFn);
  var Leaf = /* @__PURE__ */ function() {
    function Leaf2() {
    }
    ;
    Leaf2.value = new Leaf2();
    return Leaf2;
  }();
  var Two = /* @__PURE__ */ function() {
    function Two2(value0, value1, value22, value32) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
      this.value3 = value32;
    }
    ;
    Two2.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return function(value32) {
            return new Two2(value0, value1, value22, value32);
          };
        };
      };
    };
    return Two2;
  }();
  var Three = /* @__PURE__ */ function() {
    function Three2(value0, value1, value22, value32, value42, value52, value62) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
      this.value3 = value32;
      this.value4 = value42;
      this.value5 = value52;
      this.value6 = value62;
    }
    ;
    Three2.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return function(value32) {
            return function(value42) {
              return function(value52) {
                return function(value62) {
                  return new Three2(value0, value1, value22, value32, value42, value52, value62);
                };
              };
            };
          };
        };
      };
    };
    return Three2;
  }();
  var TwoLeft = /* @__PURE__ */ function() {
    function TwoLeft2(value0, value1, value22) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
    }
    ;
    TwoLeft2.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return new TwoLeft2(value0, value1, value22);
        };
      };
    };
    return TwoLeft2;
  }();
  var TwoRight = /* @__PURE__ */ function() {
    function TwoRight2(value0, value1, value22) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
    }
    ;
    TwoRight2.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return new TwoRight2(value0, value1, value22);
        };
      };
    };
    return TwoRight2;
  }();
  var ThreeLeft = /* @__PURE__ */ function() {
    function ThreeLeft2(value0, value1, value22, value32, value42, value52) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
      this.value3 = value32;
      this.value4 = value42;
      this.value5 = value52;
    }
    ;
    ThreeLeft2.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return function(value32) {
            return function(value42) {
              return function(value52) {
                return new ThreeLeft2(value0, value1, value22, value32, value42, value52);
              };
            };
          };
        };
      };
    };
    return ThreeLeft2;
  }();
  var ThreeMiddle = /* @__PURE__ */ function() {
    function ThreeMiddle2(value0, value1, value22, value32, value42, value52) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
      this.value3 = value32;
      this.value4 = value42;
      this.value5 = value52;
    }
    ;
    ThreeMiddle2.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return function(value32) {
            return function(value42) {
              return function(value52) {
                return new ThreeMiddle2(value0, value1, value22, value32, value42, value52);
              };
            };
          };
        };
      };
    };
    return ThreeMiddle2;
  }();
  var ThreeRight = /* @__PURE__ */ function() {
    function ThreeRight2(value0, value1, value22, value32, value42, value52) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
      this.value3 = value32;
      this.value4 = value42;
      this.value5 = value52;
    }
    ;
    ThreeRight2.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return function(value32) {
            return function(value42) {
              return function(value52) {
                return new ThreeRight2(value0, value1, value22, value32, value42, value52);
              };
            };
          };
        };
      };
    };
    return ThreeRight2;
  }();
  var KickUp = /* @__PURE__ */ function() {
    function KickUp2(value0, value1, value22, value32) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
      this.value3 = value32;
    }
    ;
    KickUp2.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return function(value32) {
            return new KickUp2(value0, value1, value22, value32);
          };
        };
      };
    };
    return KickUp2;
  }();
  var lookup2 = function(dictOrd) {
    var compare3 = compare(dictOrd);
    return function(k) {
      var go2 = function($copy_v) {
        var $tco_done = false;
        var $tco_result;
        function $tco_loop(v) {
          if (v instanceof Leaf) {
            $tco_done = true;
            return Nothing.value;
          }
          ;
          if (v instanceof Two) {
            var v2 = compare3(k)(v.value1);
            if (v2 instanceof EQ) {
              $tco_done = true;
              return new Just(v.value2);
            }
            ;
            if (v2 instanceof LT) {
              $copy_v = v.value0;
              return;
            }
            ;
            $copy_v = v.value3;
            return;
          }
          ;
          if (v instanceof Three) {
            var v3 = compare3(k)(v.value1);
            if (v3 instanceof EQ) {
              $tco_done = true;
              return new Just(v.value2);
            }
            ;
            var v4 = compare3(k)(v.value4);
            if (v4 instanceof EQ) {
              $tco_done = true;
              return new Just(v.value5);
            }
            ;
            if (v3 instanceof LT) {
              $copy_v = v.value0;
              return;
            }
            ;
            if (v4 instanceof GT) {
              $copy_v = v.value6;
              return;
            }
            ;
            $copy_v = v.value3;
            return;
          }
          ;
          throw new Error("Failed pattern match at Data.Map.Internal (line 241, column 5 - line 241, column 22): " + [v.constructor.name]);
        }
        ;
        while (!$tco_done) {
          $tco_result = $tco_loop($copy_v);
        }
        ;
        return $tco_result;
      };
      return go2;
    };
  };
  var functorMap = {
    map: function(v) {
      return function(v1) {
        if (v1 instanceof Leaf) {
          return Leaf.value;
        }
        ;
        if (v1 instanceof Two) {
          return new Two(map(functorMap)(v)(v1.value0), v1.value1, v(v1.value2), map(functorMap)(v)(v1.value3));
        }
        ;
        if (v1 instanceof Three) {
          return new Three(map(functorMap)(v)(v1.value0), v1.value1, v(v1.value2), map(functorMap)(v)(v1.value3), v1.value4, v(v1.value5), map(functorMap)(v)(v1.value6));
        }
        ;
        throw new Error("Failed pattern match at Data.Map.Internal (line 116, column 1 - line 119, column 110): " + [v.constructor.name, v1.constructor.name]);
      };
    }
  };
  var fromZipper = function($copy_dictOrd) {
    return function($copy_v) {
      return function($copy_v1) {
        var $tco_var_dictOrd = $copy_dictOrd;
        var $tco_var_v = $copy_v;
        var $tco_done = false;
        var $tco_result;
        function $tco_loop(dictOrd, v, v1) {
          if (v instanceof Nil) {
            $tco_done = true;
            return v1;
          }
          ;
          if (v instanceof Cons) {
            if (v.value0 instanceof TwoLeft) {
              $tco_var_dictOrd = dictOrd;
              $tco_var_v = v.value1;
              $copy_v1 = new Two(v1, v.value0.value0, v.value0.value1, v.value0.value2);
              return;
            }
            ;
            if (v.value0 instanceof TwoRight) {
              $tco_var_dictOrd = dictOrd;
              $tco_var_v = v.value1;
              $copy_v1 = new Two(v.value0.value0, v.value0.value1, v.value0.value2, v1);
              return;
            }
            ;
            if (v.value0 instanceof ThreeLeft) {
              $tco_var_dictOrd = dictOrd;
              $tco_var_v = v.value1;
              $copy_v1 = new Three(v1, v.value0.value0, v.value0.value1, v.value0.value2, v.value0.value3, v.value0.value4, v.value0.value5);
              return;
            }
            ;
            if (v.value0 instanceof ThreeMiddle) {
              $tco_var_dictOrd = dictOrd;
              $tco_var_v = v.value1;
              $copy_v1 = new Three(v.value0.value0, v.value0.value1, v.value0.value2, v1, v.value0.value3, v.value0.value4, v.value0.value5);
              return;
            }
            ;
            if (v.value0 instanceof ThreeRight) {
              $tco_var_dictOrd = dictOrd;
              $tco_var_v = v.value1;
              $copy_v1 = new Three(v.value0.value0, v.value0.value1, v.value0.value2, v.value0.value3, v.value0.value4, v.value0.value5, v1);
              return;
            }
            ;
            throw new Error("Failed pattern match at Data.Map.Internal (line 462, column 3 - line 467, column 88): " + [v.value0.constructor.name]);
          }
          ;
          throw new Error("Failed pattern match at Data.Map.Internal (line 459, column 1 - line 459, column 80): " + [v.constructor.name, v1.constructor.name]);
        }
        ;
        while (!$tco_done) {
          $tco_result = $tco_loop($tco_var_dictOrd, $tco_var_v, $copy_v1);
        }
        ;
        return $tco_result;
      };
    };
  };
  var insert3 = function(dictOrd) {
    var fromZipper1 = fromZipper(dictOrd);
    var compare3 = compare(dictOrd);
    return function(k) {
      return function(v) {
        var up = function($copy_v1) {
          return function($copy_v2) {
            var $tco_var_v1 = $copy_v1;
            var $tco_done = false;
            var $tco_result;
            function $tco_loop(v1, v2) {
              if (v1 instanceof Nil) {
                $tco_done = true;
                return new Two(v2.value0, v2.value1, v2.value2, v2.value3);
              }
              ;
              if (v1 instanceof Cons) {
                if (v1.value0 instanceof TwoLeft) {
                  $tco_done = true;
                  return fromZipper1(v1.value1)(new Three(v2.value0, v2.value1, v2.value2, v2.value3, v1.value0.value0, v1.value0.value1, v1.value0.value2));
                }
                ;
                if (v1.value0 instanceof TwoRight) {
                  $tco_done = true;
                  return fromZipper1(v1.value1)(new Three(v1.value0.value0, v1.value0.value1, v1.value0.value2, v2.value0, v2.value1, v2.value2, v2.value3));
                }
                ;
                if (v1.value0 instanceof ThreeLeft) {
                  $tco_var_v1 = v1.value1;
                  $copy_v2 = new KickUp(new Two(v2.value0, v2.value1, v2.value2, v2.value3), v1.value0.value0, v1.value0.value1, new Two(v1.value0.value2, v1.value0.value3, v1.value0.value4, v1.value0.value5));
                  return;
                }
                ;
                if (v1.value0 instanceof ThreeMiddle) {
                  $tco_var_v1 = v1.value1;
                  $copy_v2 = new KickUp(new Two(v1.value0.value0, v1.value0.value1, v1.value0.value2, v2.value0), v2.value1, v2.value2, new Two(v2.value3, v1.value0.value3, v1.value0.value4, v1.value0.value5));
                  return;
                }
                ;
                if (v1.value0 instanceof ThreeRight) {
                  $tco_var_v1 = v1.value1;
                  $copy_v2 = new KickUp(new Two(v1.value0.value0, v1.value0.value1, v1.value0.value2, v1.value0.value3), v1.value0.value4, v1.value0.value5, new Two(v2.value0, v2.value1, v2.value2, v2.value3));
                  return;
                }
                ;
                throw new Error("Failed pattern match at Data.Map.Internal (line 498, column 5 - line 503, column 108): " + [v1.value0.constructor.name, v2.constructor.name]);
              }
              ;
              throw new Error("Failed pattern match at Data.Map.Internal (line 495, column 3 - line 495, column 56): " + [v1.constructor.name, v2.constructor.name]);
            }
            ;
            while (!$tco_done) {
              $tco_result = $tco_loop($tco_var_v1, $copy_v2);
            }
            ;
            return $tco_result;
          };
        };
        var down = function($copy_v1) {
          return function($copy_v2) {
            var $tco_var_v1 = $copy_v1;
            var $tco_done1 = false;
            var $tco_result;
            function $tco_loop(v1, v2) {
              if (v2 instanceof Leaf) {
                $tco_done1 = true;
                return up(v1)(new KickUp(Leaf.value, k, v, Leaf.value));
              }
              ;
              if (v2 instanceof Two) {
                var v3 = compare3(k)(v2.value1);
                if (v3 instanceof EQ) {
                  $tco_done1 = true;
                  return fromZipper1(v1)(new Two(v2.value0, k, v, v2.value3));
                }
                ;
                if (v3 instanceof LT) {
                  $tco_var_v1 = new Cons(new TwoLeft(v2.value1, v2.value2, v2.value3), v1);
                  $copy_v2 = v2.value0;
                  return;
                }
                ;
                $tco_var_v1 = new Cons(new TwoRight(v2.value0, v2.value1, v2.value2), v1);
                $copy_v2 = v2.value3;
                return;
              }
              ;
              if (v2 instanceof Three) {
                var v3 = compare3(k)(v2.value1);
                if (v3 instanceof EQ) {
                  $tco_done1 = true;
                  return fromZipper1(v1)(new Three(v2.value0, k, v, v2.value3, v2.value4, v2.value5, v2.value6));
                }
                ;
                var v4 = compare3(k)(v2.value4);
                if (v4 instanceof EQ) {
                  $tco_done1 = true;
                  return fromZipper1(v1)(new Three(v2.value0, v2.value1, v2.value2, v2.value3, k, v, v2.value6));
                }
                ;
                if (v3 instanceof LT) {
                  $tco_var_v1 = new Cons(new ThreeLeft(v2.value1, v2.value2, v2.value3, v2.value4, v2.value5, v2.value6), v1);
                  $copy_v2 = v2.value0;
                  return;
                }
                ;
                if (v3 instanceof GT && v4 instanceof LT) {
                  $tco_var_v1 = new Cons(new ThreeMiddle(v2.value0, v2.value1, v2.value2, v2.value4, v2.value5, v2.value6), v1);
                  $copy_v2 = v2.value3;
                  return;
                }
                ;
                $tco_var_v1 = new Cons(new ThreeRight(v2.value0, v2.value1, v2.value2, v2.value3, v2.value4, v2.value5), v1);
                $copy_v2 = v2.value6;
                return;
              }
              ;
              throw new Error("Failed pattern match at Data.Map.Internal (line 478, column 3 - line 478, column 55): " + [v1.constructor.name, v2.constructor.name]);
            }
            ;
            while (!$tco_done1) {
              $tco_result = $tco_loop($tco_var_v1, $copy_v2);
            }
            ;
            return $tco_result;
          };
        };
        return down(Nil.value);
      };
    };
  };
  var pop = function(dictOrd) {
    var fromZipper1 = fromZipper(dictOrd);
    var compare3 = compare(dictOrd);
    return function(k) {
      var up = function($copy_ctxs) {
        return function($copy_tree) {
          var $tco_var_ctxs = $copy_ctxs;
          var $tco_done = false;
          var $tco_result;
          function $tco_loop(ctxs, tree) {
            if (ctxs instanceof Nil) {
              $tco_done = true;
              return tree;
            }
            ;
            if (ctxs instanceof Cons) {
              if (ctxs.value0 instanceof TwoLeft && (ctxs.value0.value2 instanceof Leaf && tree instanceof Leaf)) {
                $tco_done = true;
                return fromZipper1(ctxs.value1)(new Two(Leaf.value, ctxs.value0.value0, ctxs.value0.value1, Leaf.value));
              }
              ;
              if (ctxs.value0 instanceof TwoRight && (ctxs.value0.value0 instanceof Leaf && tree instanceof Leaf)) {
                $tco_done = true;
                return fromZipper1(ctxs.value1)(new Two(Leaf.value, ctxs.value0.value1, ctxs.value0.value2, Leaf.value));
              }
              ;
              if (ctxs.value0 instanceof TwoLeft && ctxs.value0.value2 instanceof Two) {
                $tco_var_ctxs = ctxs.value1;
                $copy_tree = new Three(tree, ctxs.value0.value0, ctxs.value0.value1, ctxs.value0.value2.value0, ctxs.value0.value2.value1, ctxs.value0.value2.value2, ctxs.value0.value2.value3);
                return;
              }
              ;
              if (ctxs.value0 instanceof TwoRight && ctxs.value0.value0 instanceof Two) {
                $tco_var_ctxs = ctxs.value1;
                $copy_tree = new Three(ctxs.value0.value0.value0, ctxs.value0.value0.value1, ctxs.value0.value0.value2, ctxs.value0.value0.value3, ctxs.value0.value1, ctxs.value0.value2, tree);
                return;
              }
              ;
              if (ctxs.value0 instanceof TwoLeft && ctxs.value0.value2 instanceof Three) {
                $tco_done = true;
                return fromZipper1(ctxs.value1)(new Two(new Two(tree, ctxs.value0.value0, ctxs.value0.value1, ctxs.value0.value2.value0), ctxs.value0.value2.value1, ctxs.value0.value2.value2, new Two(ctxs.value0.value2.value3, ctxs.value0.value2.value4, ctxs.value0.value2.value5, ctxs.value0.value2.value6)));
              }
              ;
              if (ctxs.value0 instanceof TwoRight && ctxs.value0.value0 instanceof Three) {
                $tco_done = true;
                return fromZipper1(ctxs.value1)(new Two(new Two(ctxs.value0.value0.value0, ctxs.value0.value0.value1, ctxs.value0.value0.value2, ctxs.value0.value0.value3), ctxs.value0.value0.value4, ctxs.value0.value0.value5, new Two(ctxs.value0.value0.value6, ctxs.value0.value1, ctxs.value0.value2, tree)));
              }
              ;
              if (ctxs.value0 instanceof ThreeLeft && (ctxs.value0.value2 instanceof Leaf && (ctxs.value0.value5 instanceof Leaf && tree instanceof Leaf))) {
                $tco_done = true;
                return fromZipper1(ctxs.value1)(new Three(Leaf.value, ctxs.value0.value0, ctxs.value0.value1, Leaf.value, ctxs.value0.value3, ctxs.value0.value4, Leaf.value));
              }
              ;
              if (ctxs.value0 instanceof ThreeMiddle && (ctxs.value0.value0 instanceof Leaf && (ctxs.value0.value5 instanceof Leaf && tree instanceof Leaf))) {
                $tco_done = true;
                return fromZipper1(ctxs.value1)(new Three(Leaf.value, ctxs.value0.value1, ctxs.value0.value2, Leaf.value, ctxs.value0.value3, ctxs.value0.value4, Leaf.value));
              }
              ;
              if (ctxs.value0 instanceof ThreeRight && (ctxs.value0.value0 instanceof Leaf && (ctxs.value0.value3 instanceof Leaf && tree instanceof Leaf))) {
                $tco_done = true;
                return fromZipper1(ctxs.value1)(new Three(Leaf.value, ctxs.value0.value1, ctxs.value0.value2, Leaf.value, ctxs.value0.value4, ctxs.value0.value5, Leaf.value));
              }
              ;
              if (ctxs.value0 instanceof ThreeLeft && ctxs.value0.value2 instanceof Two) {
                $tco_done = true;
                return fromZipper1(ctxs.value1)(new Two(new Three(tree, ctxs.value0.value0, ctxs.value0.value1, ctxs.value0.value2.value0, ctxs.value0.value2.value1, ctxs.value0.value2.value2, ctxs.value0.value2.value3), ctxs.value0.value3, ctxs.value0.value4, ctxs.value0.value5));
              }
              ;
              if (ctxs.value0 instanceof ThreeMiddle && ctxs.value0.value0 instanceof Two) {
                $tco_done = true;
                return fromZipper1(ctxs.value1)(new Two(new Three(ctxs.value0.value0.value0, ctxs.value0.value0.value1, ctxs.value0.value0.value2, ctxs.value0.value0.value3, ctxs.value0.value1, ctxs.value0.value2, tree), ctxs.value0.value3, ctxs.value0.value4, ctxs.value0.value5));
              }
              ;
              if (ctxs.value0 instanceof ThreeMiddle && ctxs.value0.value5 instanceof Two) {
                $tco_done = true;
                return fromZipper1(ctxs.value1)(new Two(ctxs.value0.value0, ctxs.value0.value1, ctxs.value0.value2, new Three(tree, ctxs.value0.value3, ctxs.value0.value4, ctxs.value0.value5.value0, ctxs.value0.value5.value1, ctxs.value0.value5.value2, ctxs.value0.value5.value3)));
              }
              ;
              if (ctxs.value0 instanceof ThreeRight && ctxs.value0.value3 instanceof Two) {
                $tco_done = true;
                return fromZipper1(ctxs.value1)(new Two(ctxs.value0.value0, ctxs.value0.value1, ctxs.value0.value2, new Three(ctxs.value0.value3.value0, ctxs.value0.value3.value1, ctxs.value0.value3.value2, ctxs.value0.value3.value3, ctxs.value0.value4, ctxs.value0.value5, tree)));
              }
              ;
              if (ctxs.value0 instanceof ThreeLeft && ctxs.value0.value2 instanceof Three) {
                $tco_done = true;
                return fromZipper1(ctxs.value1)(new Three(new Two(tree, ctxs.value0.value0, ctxs.value0.value1, ctxs.value0.value2.value0), ctxs.value0.value2.value1, ctxs.value0.value2.value2, new Two(ctxs.value0.value2.value3, ctxs.value0.value2.value4, ctxs.value0.value2.value5, ctxs.value0.value2.value6), ctxs.value0.value3, ctxs.value0.value4, ctxs.value0.value5));
              }
              ;
              if (ctxs.value0 instanceof ThreeMiddle && ctxs.value0.value0 instanceof Three) {
                $tco_done = true;
                return fromZipper1(ctxs.value1)(new Three(new Two(ctxs.value0.value0.value0, ctxs.value0.value0.value1, ctxs.value0.value0.value2, ctxs.value0.value0.value3), ctxs.value0.value0.value4, ctxs.value0.value0.value5, new Two(ctxs.value0.value0.value6, ctxs.value0.value1, ctxs.value0.value2, tree), ctxs.value0.value3, ctxs.value0.value4, ctxs.value0.value5));
              }
              ;
              if (ctxs.value0 instanceof ThreeMiddle && ctxs.value0.value5 instanceof Three) {
                $tco_done = true;
                return fromZipper1(ctxs.value1)(new Three(ctxs.value0.value0, ctxs.value0.value1, ctxs.value0.value2, new Two(tree, ctxs.value0.value3, ctxs.value0.value4, ctxs.value0.value5.value0), ctxs.value0.value5.value1, ctxs.value0.value5.value2, new Two(ctxs.value0.value5.value3, ctxs.value0.value5.value4, ctxs.value0.value5.value5, ctxs.value0.value5.value6)));
              }
              ;
              if (ctxs.value0 instanceof ThreeRight && ctxs.value0.value3 instanceof Three) {
                $tco_done = true;
                return fromZipper1(ctxs.value1)(new Three(ctxs.value0.value0, ctxs.value0.value1, ctxs.value0.value2, new Two(ctxs.value0.value3.value0, ctxs.value0.value3.value1, ctxs.value0.value3.value2, ctxs.value0.value3.value3), ctxs.value0.value3.value4, ctxs.value0.value3.value5, new Two(ctxs.value0.value3.value6, ctxs.value0.value4, ctxs.value0.value5, tree)));
              }
              ;
              $tco_done = true;
              return unsafeCrashWith("The impossible happened in partial function `up`.");
            }
            ;
            throw new Error("Failed pattern match at Data.Map.Internal (line 552, column 5 - line 573, column 86): " + [ctxs.constructor.name]);
          }
          ;
          while (!$tco_done) {
            $tco_result = $tco_loop($tco_var_ctxs, $copy_tree);
          }
          ;
          return $tco_result;
        };
      };
      var removeMaxNode = function($copy_ctx) {
        return function($copy_m) {
          var $tco_var_ctx = $copy_ctx;
          var $tco_done1 = false;
          var $tco_result;
          function $tco_loop(ctx, m) {
            if (m instanceof Two && (m.value0 instanceof Leaf && m.value3 instanceof Leaf)) {
              $tco_done1 = true;
              return up(ctx)(Leaf.value);
            }
            ;
            if (m instanceof Two) {
              $tco_var_ctx = new Cons(new TwoRight(m.value0, m.value1, m.value2), ctx);
              $copy_m = m.value3;
              return;
            }
            ;
            if (m instanceof Three && (m.value0 instanceof Leaf && (m.value3 instanceof Leaf && m.value6 instanceof Leaf))) {
              $tco_done1 = true;
              return up(new Cons(new TwoRight(Leaf.value, m.value1, m.value2), ctx))(Leaf.value);
            }
            ;
            if (m instanceof Three) {
              $tco_var_ctx = new Cons(new ThreeRight(m.value0, m.value1, m.value2, m.value3, m.value4, m.value5), ctx);
              $copy_m = m.value6;
              return;
            }
            ;
            $tco_done1 = true;
            return unsafeCrashWith("The impossible happened in partial function `removeMaxNode`.");
          }
          ;
          while (!$tco_done1) {
            $tco_result = $tco_loop($tco_var_ctx, $copy_m);
          }
          ;
          return $tco_result;
        };
      };
      var maxNode = function($copy_m) {
        var $tco_done2 = false;
        var $tco_result;
        function $tco_loop(m) {
          if (m instanceof Two && m.value3 instanceof Leaf) {
            $tco_done2 = true;
            return {
              key: m.value1,
              value: m.value2
            };
          }
          ;
          if (m instanceof Two) {
            $copy_m = m.value3;
            return;
          }
          ;
          if (m instanceof Three && m.value6 instanceof Leaf) {
            $tco_done2 = true;
            return {
              key: m.value4,
              value: m.value5
            };
          }
          ;
          if (m instanceof Three) {
            $copy_m = m.value6;
            return;
          }
          ;
          $tco_done2 = true;
          return unsafeCrashWith("The impossible happened in partial function `maxNode`.");
        }
        ;
        while (!$tco_done2) {
          $tco_result = $tco_loop($copy_m);
        }
        ;
        return $tco_result;
      };
      var down = function($copy_ctx) {
        return function($copy_m) {
          var $tco_var_ctx = $copy_ctx;
          var $tco_done3 = false;
          var $tco_result;
          function $tco_loop(ctx, m) {
            if (m instanceof Leaf) {
              $tco_done3 = true;
              return Nothing.value;
            }
            ;
            if (m instanceof Two) {
              var v = compare3(k)(m.value1);
              if (m.value3 instanceof Leaf && v instanceof EQ) {
                $tco_done3 = true;
                return new Just(new Tuple(m.value2, up(ctx)(Leaf.value)));
              }
              ;
              if (v instanceof EQ) {
                var max10 = maxNode(m.value0);
                $tco_done3 = true;
                return new Just(new Tuple(m.value2, removeMaxNode(new Cons(new TwoLeft(max10.key, max10.value, m.value3), ctx))(m.value0)));
              }
              ;
              if (v instanceof LT) {
                $tco_var_ctx = new Cons(new TwoLeft(m.value1, m.value2, m.value3), ctx);
                $copy_m = m.value0;
                return;
              }
              ;
              $tco_var_ctx = new Cons(new TwoRight(m.value0, m.value1, m.value2), ctx);
              $copy_m = m.value3;
              return;
            }
            ;
            if (m instanceof Three) {
              var leaves = function() {
                if (m.value0 instanceof Leaf && (m.value3 instanceof Leaf && m.value6 instanceof Leaf)) {
                  return true;
                }
                ;
                return false;
              }();
              var v = compare3(k)(m.value4);
              var v3 = compare3(k)(m.value1);
              if (leaves && v3 instanceof EQ) {
                $tco_done3 = true;
                return new Just(new Tuple(m.value2, fromZipper1(ctx)(new Two(Leaf.value, m.value4, m.value5, Leaf.value))));
              }
              ;
              if (leaves && v instanceof EQ) {
                $tco_done3 = true;
                return new Just(new Tuple(m.value5, fromZipper1(ctx)(new Two(Leaf.value, m.value1, m.value2, Leaf.value))));
              }
              ;
              if (v3 instanceof EQ) {
                var max10 = maxNode(m.value0);
                $tco_done3 = true;
                return new Just(new Tuple(m.value2, removeMaxNode(new Cons(new ThreeLeft(max10.key, max10.value, m.value3, m.value4, m.value5, m.value6), ctx))(m.value0)));
              }
              ;
              if (v instanceof EQ) {
                var max10 = maxNode(m.value3);
                $tco_done3 = true;
                return new Just(new Tuple(m.value5, removeMaxNode(new Cons(new ThreeMiddle(m.value0, m.value1, m.value2, max10.key, max10.value, m.value6), ctx))(m.value3)));
              }
              ;
              if (v3 instanceof LT) {
                $tco_var_ctx = new Cons(new ThreeLeft(m.value1, m.value2, m.value3, m.value4, m.value5, m.value6), ctx);
                $copy_m = m.value0;
                return;
              }
              ;
              if (v3 instanceof GT && v instanceof LT) {
                $tco_var_ctx = new Cons(new ThreeMiddle(m.value0, m.value1, m.value2, m.value4, m.value5, m.value6), ctx);
                $copy_m = m.value3;
                return;
              }
              ;
              $tco_var_ctx = new Cons(new ThreeRight(m.value0, m.value1, m.value2, m.value3, m.value4, m.value5), ctx);
              $copy_m = m.value6;
              return;
            }
            ;
            throw new Error("Failed pattern match at Data.Map.Internal (line 525, column 16 - line 548, column 80): " + [m.constructor.name]);
          }
          ;
          while (!$tco_done3) {
            $tco_result = $tco_loop($tco_var_ctx, $copy_m);
          }
          ;
          return $tco_result;
        };
      };
      return down(Nil.value);
    };
  };
  var foldableMap = {
    foldr: function(f) {
      return function(z) {
        return function(m) {
          if (m instanceof Leaf) {
            return z;
          }
          ;
          if (m instanceof Two) {
            return foldr(foldableMap)(f)(f(m.value2)(foldr(foldableMap)(f)(z)(m.value3)))(m.value0);
          }
          ;
          if (m instanceof Three) {
            return foldr(foldableMap)(f)(f(m.value2)(foldr(foldableMap)(f)(f(m.value5)(foldr(foldableMap)(f)(z)(m.value6)))(m.value3)))(m.value0);
          }
          ;
          throw new Error("Failed pattern match at Data.Map.Internal (line 133, column 17 - line 136, column 85): " + [m.constructor.name]);
        };
      };
    },
    foldl: function(f) {
      return function(z) {
        return function(m) {
          if (m instanceof Leaf) {
            return z;
          }
          ;
          if (m instanceof Two) {
            return foldl(foldableMap)(f)(f(foldl(foldableMap)(f)(z)(m.value0))(m.value2))(m.value3);
          }
          ;
          if (m instanceof Three) {
            return foldl(foldableMap)(f)(f(foldl(foldableMap)(f)(f(foldl(foldableMap)(f)(z)(m.value0))(m.value2))(m.value3))(m.value5))(m.value6);
          }
          ;
          throw new Error("Failed pattern match at Data.Map.Internal (line 137, column 17 - line 140, column 85): " + [m.constructor.name]);
        };
      };
    },
    foldMap: function(dictMonoid) {
      var mempty7 = mempty(dictMonoid);
      var append22 = append(dictMonoid.Semigroup0());
      return function(f) {
        return function(m) {
          if (m instanceof Leaf) {
            return mempty7;
          }
          ;
          if (m instanceof Two) {
            return append22(foldMap(foldableMap)(dictMonoid)(f)(m.value0))(append22(f(m.value2))(foldMap(foldableMap)(dictMonoid)(f)(m.value3)));
          }
          ;
          if (m instanceof Three) {
            return append22(foldMap(foldableMap)(dictMonoid)(f)(m.value0))(append22(f(m.value2))(append22(foldMap(foldableMap)(dictMonoid)(f)(m.value3))(append22(f(m.value5))(foldMap(foldableMap)(dictMonoid)(f)(m.value6)))));
          }
          ;
          throw new Error("Failed pattern match at Data.Map.Internal (line 141, column 17 - line 144, column 93): " + [m.constructor.name]);
        };
      };
    }
  };
  var traversableMap = {
    traverse: function(dictApplicative) {
      var pure114 = pure(dictApplicative);
      var Apply0 = dictApplicative.Apply0();
      var apply8 = apply(Apply0);
      var map121 = map(Apply0.Functor0());
      return function(v) {
        return function(v1) {
          if (v1 instanceof Leaf) {
            return pure114(Leaf.value);
          }
          ;
          if (v1 instanceof Two) {
            return apply8(apply8(apply8(map121(Two.create)(traverse(traversableMap)(dictApplicative)(v)(v1.value0)))(pure114(v1.value1)))(v(v1.value2)))(traverse(traversableMap)(dictApplicative)(v)(v1.value3));
          }
          ;
          if (v1 instanceof Three) {
            return apply8(apply8(apply8(apply8(apply8(apply8(map121(Three.create)(traverse(traversableMap)(dictApplicative)(v)(v1.value0)))(pure114(v1.value1)))(v(v1.value2)))(traverse(traversableMap)(dictApplicative)(v)(v1.value3)))(pure114(v1.value4)))(v(v1.value5)))(traverse(traversableMap)(dictApplicative)(v)(v1.value6));
          }
          ;
          throw new Error("Failed pattern match at Data.Map.Internal (line 160, column 1 - line 175, column 31): " + [v.constructor.name, v1.constructor.name]);
        };
      };
    },
    sequence: function(dictApplicative) {
      return traverse(traversableMap)(dictApplicative)(identity11);
    },
    Functor0: function() {
      return functorMap;
    },
    Foldable1: function() {
      return foldableMap;
    }
  };
  var empty2 = /* @__PURE__ */ function() {
    return Leaf.value;
  }();
  var fromFoldable2 = function(dictOrd) {
    var insert13 = insert3(dictOrd);
    return function(dictFoldable) {
      return foldl(dictFoldable)(function(m) {
        return function(v) {
          return insert13(v.value0)(v.value1)(m);
        };
      })(empty2);
    };
  };
  var $$delete2 = function(dictOrd) {
    var pop12 = pop(dictOrd);
    return function(k) {
      return function(m) {
        return maybe(m)(snd)(pop12(k)(m));
      };
    };
  };
  var alter = function(dictOrd) {
    var lookup13 = lookup2(dictOrd);
    var delete1 = $$delete2(dictOrd);
    var insert13 = insert3(dictOrd);
    return function(f) {
      return function(k) {
        return function(m) {
          var v = f(lookup13(k)(m));
          if (v instanceof Nothing) {
            return delete1(k)(m);
          }
          ;
          if (v instanceof Just) {
            return insert13(k)(v.value0)(m);
          }
          ;
          throw new Error("Failed pattern match at Data.Map.Internal (line 596, column 15 - line 598, column 25): " + [v.constructor.name]);
        };
      };
    };
  };

  // output/Web.Event.EventTarget/foreign.js
  function eventListener(fn) {
    return function() {
      return function(event) {
        return fn(event)();
      };
    };
  }
  function addEventListener(type) {
    return function(listener) {
      return function(useCapture) {
        return function(target6) {
          return function() {
            return target6.addEventListener(type, listener, useCapture);
          };
        };
      };
    };
  }
  function removeEventListener(type) {
    return function(listener) {
      return function(useCapture) {
        return function(target6) {
          return function() {
            return target6.removeEventListener(type, listener, useCapture);
          };
        };
      };
    };
  }

  // output/Web.HTML/foreign.js
  var windowImpl = function() {
    return window;
  };

  // output/Data.Nullable/foreign.js
  var nullImpl = null;
  function nullable(a2, r, f) {
    return a2 == null ? r : f(a2);
  }
  function notNull(x) {
    return x;
  }

  // output/Data.Nullable/index.js
  var toNullable = /* @__PURE__ */ maybe(nullImpl)(notNull);
  var toMaybe = function(n) {
    return nullable(n, Nothing.value, Just.create);
  };

  // output/Web.HTML.HTMLDocument/foreign.js
  function _readyState(doc) {
    return doc.readyState;
  }

  // output/Web.HTML.HTMLDocument.ReadyState/index.js
  var Loading = /* @__PURE__ */ function() {
    function Loading2() {
    }
    ;
    Loading2.value = new Loading2();
    return Loading2;
  }();
  var Interactive = /* @__PURE__ */ function() {
    function Interactive2() {
    }
    ;
    Interactive2.value = new Interactive2();
    return Interactive2;
  }();
  var Complete = /* @__PURE__ */ function() {
    function Complete2() {
    }
    ;
    Complete2.value = new Complete2();
    return Complete2;
  }();
  var parse3 = function(v) {
    if (v === "loading") {
      return new Just(Loading.value);
    }
    ;
    if (v === "interactive") {
      return new Just(Interactive.value);
    }
    ;
    if (v === "complete") {
      return new Just(Complete.value);
    }
    ;
    return Nothing.value;
  };

  // output/Web.HTML.HTMLDocument/index.js
  var map16 = /* @__PURE__ */ map(functorEffect);
  var toParentNode = unsafeCoerce2;
  var toDocument = unsafeCoerce2;
  var readyState = function(doc) {
    return map16(function() {
      var $4 = fromMaybe(Loading.value);
      return function($5) {
        return $4(parse3($5));
      };
    }())(function() {
      return _readyState(doc);
    });
  };

  // output/Web.HTML.HTMLElement/foreign.js
  function _read(nothing, just, value18) {
    var tag = Object.prototype.toString.call(value18);
    if (tag.indexOf("[object HTML") === 0 && tag.indexOf("Element]") === tag.length - 8) {
      return just(value18);
    } else {
      return nothing;
    }
  }
  function offsetTop(el) {
    return function() {
      return el.offsetTop;
    };
  }
  function offsetLeft(el) {
    return function() {
      return el.offsetLeft;
    };
  }

  // output/Web.HTML.HTMLElement/index.js
  var toNode = unsafeCoerce2;
  var fromElement = function(x) {
    return _read(Nothing.value, Just.create, x);
  };

  // output/Effect.Uncurried/foreign.js
  var runEffectFn1 = function runEffectFn12(fn) {
    return function(a2) {
      return function() {
        return fn(a2);
      };
    };
  };

  // output/Web.HTML.Location/foreign.js
  function hash(location2) {
    return function() {
      return location2.hash;
    };
  }
  function setHash(hash2) {
    return function(location2) {
      return function() {
        location2.hash = hash2;
      };
    };
  }

  // output/Web.HTML.Window/foreign.js
  function document2(window2) {
    return function() {
      return window2.document;
    };
  }
  function location(window2) {
    return function() {
      return window2.location;
    };
  }

  // output/Web.HTML.Window/index.js
  var toEventTarget = unsafeCoerce2;

  // output/Web.HTML.Event.HashChangeEvent.EventTypes/index.js
  var hashchange = "hashchange";

  // output/Routing.Hash/index.js
  var bind2 = /* @__PURE__ */ bind(bindEffect);
  var map17 = /* @__PURE__ */ map(functorEffect);
  var bindFlipped4 = /* @__PURE__ */ bindFlipped(bindEffect);
  var join2 = /* @__PURE__ */ join(bindEffect);
  var apply4 = /* @__PURE__ */ apply(applyEffect);
  var pure5 = /* @__PURE__ */ pure(applicativeEffect);
  var voidRight2 = /* @__PURE__ */ voidRight(functorEffect);
  var setHash2 = function(h) {
    return bind2(bind2(windowImpl)(location))(setHash(h));
  };
  var getHash = /* @__PURE__ */ bind2(/* @__PURE__ */ bind2(windowImpl)(location))(/* @__PURE__ */ function() {
    var $16 = map17(function() {
      var $18 = fromMaybe("");
      var $19 = stripPrefix("#");
      return function($20) {
        return $18($19($20));
      };
    }());
    return function($17) {
      return $16(hash($17));
    };
  }());
  var foldHashes = function(cb) {
    return function(init4) {
      return function __do2() {
        var ref2 = bindFlipped4($$new)(bindFlipped4(init4)(getHash))();
        var win = map17(toEventTarget)(windowImpl)();
        var listener = eventListener(function(v) {
          return bindFlipped4(flip(write)(ref2))(join2(apply4(map17(cb)(read(ref2)))(getHash)));
        })();
        addEventListener(hashchange)(listener)(false)(win)();
        return removeEventListener(hashchange)(listener)(false)(win);
      };
    };
  };
  var matchesWith = function(dictFoldable) {
    var indexl2 = indexl(dictFoldable);
    return function(parser) {
      return function(cb) {
        var go2 = function(a2) {
          var $21 = maybe(pure5(a2))(function(b2) {
            return voidRight2(new Just(b2))(cb(a2)(b2));
          });
          var $22 = indexl2(0);
          return function($23) {
            return $21($22(parser($23)));
          };
        };
        return foldHashes(go2)(go2(Nothing.value));
      };
    };
  };

  // output/AppM/index.js
  var toAff = function(v) {
    return v;
  };
  var monadEffectAppM = monadEffectAff;
  var monadAppM = monadAff;
  var navigateAppM = {
    navigate: /* @__PURE__ */ function() {
      var $4 = liftEffect(monadEffectAppM);
      var $5 = print(routeCodec);
      return function($6) {
        return $4(setHash2($5($6)));
      };
    }(),
    Monad0: function() {
      return monadAppM;
    }
  };
  var monadAffAppM = monadAffAff;

  // output/Web.DOM.ParentNode/foreign.js
  var getEffProp = function(name16) {
    return function(node) {
      return function() {
        return node[name16];
      };
    };
  };
  var children = getEffProp("children");
  var _firstElementChild = getEffProp("firstElementChild");
  var _lastElementChild = getEffProp("lastElementChild");
  var childElementCount = getEffProp("childElementCount");
  function _querySelector(selector) {
    return function(node) {
      return function() {
        return node.querySelector(selector);
      };
    };
  }

  // output/Web.DOM.ParentNode/index.js
  var map18 = /* @__PURE__ */ map(functorEffect);
  var querySelector = function(qs) {
    var $2 = map18(toMaybe);
    var $3 = _querySelector(qs);
    return function($4) {
      return $2($3($4));
    };
  };

  // output/Web.HTML.Event.EventTypes/index.js
  var input = "input";
  var domcontentloaded = "DOMContentLoaded";
  var change = "change";

  // output/Halogen.Aff.Util/index.js
  var bind3 = /* @__PURE__ */ bind(bindAff);
  var liftEffect3 = /* @__PURE__ */ liftEffect(monadEffectAff);
  var bindFlipped5 = /* @__PURE__ */ bindFlipped(bindEffect);
  var composeKleisliFlipped2 = /* @__PURE__ */ composeKleisliFlipped(bindEffect);
  var pure6 = /* @__PURE__ */ pure(applicativeAff);
  var bindFlipped1 = /* @__PURE__ */ bindFlipped(bindMaybe);
  var pure1 = /* @__PURE__ */ pure(applicativeEffect);
  var map19 = /* @__PURE__ */ map(functorEffect);
  var discard2 = /* @__PURE__ */ discard(discardUnit);
  var throwError2 = /* @__PURE__ */ throwError(monadThrowAff);
  var selectElement = function(query2) {
    return bind3(liftEffect3(bindFlipped5(composeKleisliFlipped2(function() {
      var $16 = querySelector(query2);
      return function($17) {
        return $16(toParentNode($17));
      };
    }())(document2))(windowImpl)))(function(mel) {
      return pure6(bindFlipped1(fromElement)(mel));
    });
  };
  var runHalogenAff = /* @__PURE__ */ runAff_(/* @__PURE__ */ either(throwException)(/* @__PURE__ */ $$const(/* @__PURE__ */ pure1(unit))));
  var awaitLoad = /* @__PURE__ */ makeAff(function(callback) {
    return function __do2() {
      var rs = bindFlipped5(readyState)(bindFlipped5(document2)(windowImpl))();
      if (rs instanceof Loading) {
        var et = map19(toEventTarget)(windowImpl)();
        var listener = eventListener(function(v) {
          return callback(new Right(unit));
        })();
        addEventListener(domcontentloaded)(listener)(false)(et)();
        return effectCanceler(removeEventListener(domcontentloaded)(listener)(false)(et));
      }
      ;
      callback(new Right(unit))();
      return nonCanceler;
    };
  });
  var awaitBody = /* @__PURE__ */ discard2(bindAff)(awaitLoad)(function() {
    return bind3(selectElement("body"))(function(body2) {
      return maybe(throwError2(error("Could not find body")))(pure6)(body2);
    });
  });

  // output/Data.Exists/index.js
  var runExists = unsafeCoerce2;
  var mkExists = unsafeCoerce2;

  // output/Data.Coyoneda/index.js
  var CoyonedaF = /* @__PURE__ */ function() {
    function CoyonedaF2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    CoyonedaF2.create = function(value0) {
      return function(value1) {
        return new CoyonedaF2(value0, value1);
      };
    };
    return CoyonedaF2;
  }();
  var unCoyoneda = function(f) {
    return function(v) {
      return runExists(function(v1) {
        return f(v1.value0)(v1.value1);
      })(v);
    };
  };
  var coyoneda = function(k) {
    return function(fi) {
      return mkExists(new CoyonedaF(k, fi));
    };
  };
  var functorCoyoneda = {
    map: function(f) {
      return function(v) {
        return runExists(function(v1) {
          return coyoneda(function($180) {
            return f(v1.value0($180));
          })(v1.value1);
        })(v);
      };
    }
  };
  var liftCoyoneda = /* @__PURE__ */ coyoneda(/* @__PURE__ */ identity(categoryFn));

  // output/Halogen.Data.OrdBox/index.js
  var OrdBox = /* @__PURE__ */ function() {
    function OrdBox2(value0, value1, value22) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
    }
    ;
    OrdBox2.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return new OrdBox2(value0, value1, value22);
        };
      };
    };
    return OrdBox2;
  }();
  var mkOrdBox = function(dictOrd) {
    return OrdBox.create(eq(dictOrd.Eq0()))(compare(dictOrd));
  };
  var eqOrdBox = {
    eq: function(v) {
      return function(v1) {
        return v.value0(v.value2)(v1.value2);
      };
    }
  };
  var ordOrdBox = {
    compare: function(v) {
      return function(v1) {
        return v.value1(v.value2)(v1.value2);
      };
    },
    Eq0: function() {
      return eqOrdBox;
    }
  };

  // output/Halogen.Data.Slot/index.js
  var ordTuple2 = /* @__PURE__ */ ordTuple(ordString)(ordOrdBox);
  var pop1 = /* @__PURE__ */ pop(ordTuple2);
  var lookup1 = /* @__PURE__ */ lookup2(ordTuple2);
  var insert1 = /* @__PURE__ */ insert3(ordTuple2);
  var pop2 = function() {
    return function(dictIsSymbol) {
      var reflectSymbol2 = reflectSymbol(dictIsSymbol);
      return function(dictOrd) {
        var mkOrdBox2 = mkOrdBox(dictOrd);
        return function(sym) {
          return function(key2) {
            return function(v) {
              return pop1(new Tuple(reflectSymbol2(sym), mkOrdBox2(key2)))(v);
            };
          };
        };
      };
    };
  };
  var lookup3 = function() {
    return function(dictIsSymbol) {
      var reflectSymbol2 = reflectSymbol(dictIsSymbol);
      return function(dictOrd) {
        var mkOrdBox2 = mkOrdBox(dictOrd);
        return function(sym) {
          return function(key2) {
            return function(v) {
              return lookup1(new Tuple(reflectSymbol2(sym), mkOrdBox2(key2)))(v);
            };
          };
        };
      };
    };
  };
  var insert4 = function() {
    return function(dictIsSymbol) {
      var reflectSymbol2 = reflectSymbol(dictIsSymbol);
      return function(dictOrd) {
        var mkOrdBox2 = mkOrdBox(dictOrd);
        return function(sym) {
          return function(key2) {
            return function(val) {
              return function(v) {
                return insert1(new Tuple(reflectSymbol2(sym), mkOrdBox2(key2)))(val)(v);
              };
            };
          };
        };
      };
    };
  };
  var foreachSlot = function(dictApplicative) {
    var traverse_7 = traverse_(dictApplicative)(foldableMap);
    return function(v) {
      return function(k) {
        return traverse_7(function($54) {
          return k($54);
        })(v);
      };
    };
  };
  var empty3 = empty2;

  // output/DOM.HTML.Indexed.InputAcceptType/index.js
  var map20 = /* @__PURE__ */ map(functorArray);
  var AcceptMediaType = /* @__PURE__ */ function() {
    function AcceptMediaType2(value0) {
      this.value0 = value0;
    }
    ;
    AcceptMediaType2.create = function(value0) {
      return new AcceptMediaType2(value0);
    };
    return AcceptMediaType2;
  }();
  var AcceptFileExtension = /* @__PURE__ */ function() {
    function AcceptFileExtension2(value0) {
      this.value0 = value0;
    }
    ;
    AcceptFileExtension2.create = function(value0) {
      return new AcceptFileExtension2(value0);
    };
    return AcceptFileExtension2;
  }();
  var renderInputAcceptTypeAtom = function(v) {
    if (v instanceof AcceptMediaType) {
      return v.value0;
    }
    ;
    if (v instanceof AcceptFileExtension) {
      return v.value0;
    }
    ;
    throw new Error("Failed pattern match at DOM.HTML.Indexed.InputAcceptType (line 34, column 29 - line 36, column 33): " + [v.constructor.name]);
  };
  var renderInputAcceptType = function(v) {
    return joinWith(",")(map20(renderInputAcceptTypeAtom)(v));
  };
  var mediaType = function(mt) {
    return [new AcceptMediaType(mt)];
  };

  // output/DOM.HTML.Indexed.InputType/index.js
  var InputButton = /* @__PURE__ */ function() {
    function InputButton2() {
    }
    ;
    InputButton2.value = new InputButton2();
    return InputButton2;
  }();
  var InputCheckbox = /* @__PURE__ */ function() {
    function InputCheckbox2() {
    }
    ;
    InputCheckbox2.value = new InputCheckbox2();
    return InputCheckbox2;
  }();
  var InputColor = /* @__PURE__ */ function() {
    function InputColor2() {
    }
    ;
    InputColor2.value = new InputColor2();
    return InputColor2;
  }();
  var InputDate = /* @__PURE__ */ function() {
    function InputDate2() {
    }
    ;
    InputDate2.value = new InputDate2();
    return InputDate2;
  }();
  var InputDatetimeLocal = /* @__PURE__ */ function() {
    function InputDatetimeLocal2() {
    }
    ;
    InputDatetimeLocal2.value = new InputDatetimeLocal2();
    return InputDatetimeLocal2;
  }();
  var InputEmail = /* @__PURE__ */ function() {
    function InputEmail2() {
    }
    ;
    InputEmail2.value = new InputEmail2();
    return InputEmail2;
  }();
  var InputFile = /* @__PURE__ */ function() {
    function InputFile2() {
    }
    ;
    InputFile2.value = new InputFile2();
    return InputFile2;
  }();
  var InputHidden = /* @__PURE__ */ function() {
    function InputHidden2() {
    }
    ;
    InputHidden2.value = new InputHidden2();
    return InputHidden2;
  }();
  var InputImage = /* @__PURE__ */ function() {
    function InputImage2() {
    }
    ;
    InputImage2.value = new InputImage2();
    return InputImage2;
  }();
  var InputMonth = /* @__PURE__ */ function() {
    function InputMonth2() {
    }
    ;
    InputMonth2.value = new InputMonth2();
    return InputMonth2;
  }();
  var InputNumber = /* @__PURE__ */ function() {
    function InputNumber2() {
    }
    ;
    InputNumber2.value = new InputNumber2();
    return InputNumber2;
  }();
  var InputPassword = /* @__PURE__ */ function() {
    function InputPassword2() {
    }
    ;
    InputPassword2.value = new InputPassword2();
    return InputPassword2;
  }();
  var InputRadio = /* @__PURE__ */ function() {
    function InputRadio2() {
    }
    ;
    InputRadio2.value = new InputRadio2();
    return InputRadio2;
  }();
  var InputRange = /* @__PURE__ */ function() {
    function InputRange2() {
    }
    ;
    InputRange2.value = new InputRange2();
    return InputRange2;
  }();
  var InputReset = /* @__PURE__ */ function() {
    function InputReset2() {
    }
    ;
    InputReset2.value = new InputReset2();
    return InputReset2;
  }();
  var InputSearch = /* @__PURE__ */ function() {
    function InputSearch2() {
    }
    ;
    InputSearch2.value = new InputSearch2();
    return InputSearch2;
  }();
  var InputSubmit = /* @__PURE__ */ function() {
    function InputSubmit2() {
    }
    ;
    InputSubmit2.value = new InputSubmit2();
    return InputSubmit2;
  }();
  var InputTel = /* @__PURE__ */ function() {
    function InputTel2() {
    }
    ;
    InputTel2.value = new InputTel2();
    return InputTel2;
  }();
  var InputText = /* @__PURE__ */ function() {
    function InputText2() {
    }
    ;
    InputText2.value = new InputText2();
    return InputText2;
  }();
  var InputTime = /* @__PURE__ */ function() {
    function InputTime2() {
    }
    ;
    InputTime2.value = new InputTime2();
    return InputTime2;
  }();
  var InputUrl = /* @__PURE__ */ function() {
    function InputUrl2() {
    }
    ;
    InputUrl2.value = new InputUrl2();
    return InputUrl2;
  }();
  var InputWeek = /* @__PURE__ */ function() {
    function InputWeek2() {
    }
    ;
    InputWeek2.value = new InputWeek2();
    return InputWeek2;
  }();
  var renderInputType = function(v) {
    if (v instanceof InputButton) {
      return "button";
    }
    ;
    if (v instanceof InputCheckbox) {
      return "checkbox";
    }
    ;
    if (v instanceof InputColor) {
      return "color";
    }
    ;
    if (v instanceof InputDate) {
      return "date";
    }
    ;
    if (v instanceof InputDatetimeLocal) {
      return "datetime-local";
    }
    ;
    if (v instanceof InputEmail) {
      return "email";
    }
    ;
    if (v instanceof InputFile) {
      return "file";
    }
    ;
    if (v instanceof InputHidden) {
      return "hidden";
    }
    ;
    if (v instanceof InputImage) {
      return "image";
    }
    ;
    if (v instanceof InputMonth) {
      return "month";
    }
    ;
    if (v instanceof InputNumber) {
      return "number";
    }
    ;
    if (v instanceof InputPassword) {
      return "password";
    }
    ;
    if (v instanceof InputRadio) {
      return "radio";
    }
    ;
    if (v instanceof InputRange) {
      return "range";
    }
    ;
    if (v instanceof InputReset) {
      return "reset";
    }
    ;
    if (v instanceof InputSearch) {
      return "search";
    }
    ;
    if (v instanceof InputSubmit) {
      return "submit";
    }
    ;
    if (v instanceof InputTel) {
      return "tel";
    }
    ;
    if (v instanceof InputText) {
      return "text";
    }
    ;
    if (v instanceof InputTime) {
      return "time";
    }
    ;
    if (v instanceof InputUrl) {
      return "url";
    }
    ;
    if (v instanceof InputWeek) {
      return "week";
    }
    ;
    throw new Error("Failed pattern match at DOM.HTML.Indexed.InputType (line 33, column 19 - line 55, column 22): " + [v.constructor.name]);
  };

  // output/DOM.HTML.Indexed.StepValue/index.js
  var show3 = /* @__PURE__ */ show(showNumber);
  var Any = /* @__PURE__ */ function() {
    function Any2() {
    }
    ;
    Any2.value = new Any2();
    return Any2;
  }();
  var Step = /* @__PURE__ */ function() {
    function Step3(value0) {
      this.value0 = value0;
    }
    ;
    Step3.create = function(value0) {
      return new Step3(value0);
    };
    return Step3;
  }();
  var renderStepValue = function(v) {
    if (v instanceof Any) {
      return "any";
    }
    ;
    if (v instanceof Step) {
      return show3(v.value0);
    }
    ;
    throw new Error("Failed pattern match at DOM.HTML.Indexed.StepValue (line 13, column 19 - line 15, column 19): " + [v.constructor.name]);
  };

  // output/Halogen.Query.Input/index.js
  var RefUpdate = /* @__PURE__ */ function() {
    function RefUpdate2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    RefUpdate2.create = function(value0) {
      return function(value1) {
        return new RefUpdate2(value0, value1);
      };
    };
    return RefUpdate2;
  }();
  var Action = /* @__PURE__ */ function() {
    function Action3(value0) {
      this.value0 = value0;
    }
    ;
    Action3.create = function(value0) {
      return new Action3(value0);
    };
    return Action3;
  }();
  var functorInput = {
    map: function(f) {
      return function(m) {
        if (m instanceof RefUpdate) {
          return new RefUpdate(m.value0, m.value1);
        }
        ;
        if (m instanceof Action) {
          return new Action(f(m.value0));
        }
        ;
        throw new Error("Failed pattern match at Halogen.Query.Input (line 0, column 0 - line 0, column 0): " + [m.constructor.name]);
      };
    }
  };

  // output/Halogen.VDom.Machine/index.js
  var Step2 = /* @__PURE__ */ function() {
    function Step3(value0, value1, value22, value32) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
      this.value3 = value32;
    }
    ;
    Step3.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return function(value32) {
            return new Step3(value0, value1, value22, value32);
          };
        };
      };
    };
    return Step3;
  }();
  var unStep = unsafeCoerce2;
  var step3 = function(v, a2) {
    return v.value2(v.value1, a2);
  };
  var mkStep = unsafeCoerce2;
  var halt = function(v) {
    return v.value3(v.value1);
  };
  var extract2 = /* @__PURE__ */ unStep(function(v) {
    return v.value0;
  });

  // output/Halogen.VDom.Types/index.js
  var map21 = /* @__PURE__ */ map(functorArray);
  var map110 = /* @__PURE__ */ map(functorTuple);
  var Text = /* @__PURE__ */ function() {
    function Text3(value0) {
      this.value0 = value0;
    }
    ;
    Text3.create = function(value0) {
      return new Text3(value0);
    };
    return Text3;
  }();
  var Elem = /* @__PURE__ */ function() {
    function Elem3(value0, value1, value22, value32) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
      this.value3 = value32;
    }
    ;
    Elem3.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return function(value32) {
            return new Elem3(value0, value1, value22, value32);
          };
        };
      };
    };
    return Elem3;
  }();
  var Keyed = /* @__PURE__ */ function() {
    function Keyed2(value0, value1, value22, value32) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
      this.value3 = value32;
    }
    ;
    Keyed2.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return function(value32) {
            return new Keyed2(value0, value1, value22, value32);
          };
        };
      };
    };
    return Keyed2;
  }();
  var Widget = /* @__PURE__ */ function() {
    function Widget2(value0) {
      this.value0 = value0;
    }
    ;
    Widget2.create = function(value0) {
      return new Widget2(value0);
    };
    return Widget2;
  }();
  var Grafted = /* @__PURE__ */ function() {
    function Grafted2(value0) {
      this.value0 = value0;
    }
    ;
    Grafted2.create = function(value0) {
      return new Grafted2(value0);
    };
    return Grafted2;
  }();
  var Graft = /* @__PURE__ */ function() {
    function Graft2(value0, value1, value22) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
    }
    ;
    Graft2.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return new Graft2(value0, value1, value22);
        };
      };
    };
    return Graft2;
  }();
  var unGraft = function(f) {
    return function($61) {
      return f($61);
    };
  };
  var graft = unsafeCoerce2;
  var bifunctorGraft = {
    bimap: function(f) {
      return function(g) {
        return unGraft(function(v) {
          return graft(new Graft(function($63) {
            return f(v.value0($63));
          }, function($64) {
            return g(v.value1($64));
          }, v.value2));
        });
      };
    }
  };
  var bimap3 = /* @__PURE__ */ bimap(bifunctorGraft);
  var bifunctorVDom = {
    bimap: function(v) {
      return function(v1) {
        return function(v2) {
          if (v2 instanceof Text) {
            return new Text(v2.value0);
          }
          ;
          if (v2 instanceof Grafted) {
            return new Grafted(bimap3(v)(v1)(v2.value0));
          }
          ;
          return new Grafted(graft(new Graft(v, v1, v2)));
        };
      };
    }
  };
  var runGraft = /* @__PURE__ */ unGraft(function(v) {
    var go2 = function(v2) {
      if (v2 instanceof Text) {
        return new Text(v2.value0);
      }
      ;
      if (v2 instanceof Elem) {
        return new Elem(v2.value0, v2.value1, v.value0(v2.value2), map21(go2)(v2.value3));
      }
      ;
      if (v2 instanceof Keyed) {
        return new Keyed(v2.value0, v2.value1, v.value0(v2.value2), map21(map110(go2))(v2.value3));
      }
      ;
      if (v2 instanceof Widget) {
        return new Widget(v.value1(v2.value0));
      }
      ;
      if (v2 instanceof Grafted) {
        return new Grafted(bimap3(v.value0)(v.value1)(v2.value0));
      }
      ;
      throw new Error("Failed pattern match at Halogen.VDom.Types (line 86, column 7 - line 86, column 27): " + [v2.constructor.name]);
    };
    return go2(v.value2);
  });

  // output/Halogen.VDom.Util/foreign.js
  function unsafeGetAny(key2, obj) {
    return obj[key2];
  }
  function unsafeHasAny(key2, obj) {
    return obj.hasOwnProperty(key2);
  }
  function unsafeSetAny(key2, val, obj) {
    obj[key2] = val;
  }
  function forE2(a2, f) {
    var b2 = [];
    for (var i2 = 0; i2 < a2.length; i2++) {
      b2.push(f(i2, a2[i2]));
    }
    return b2;
  }
  function forEachE(a2, f) {
    for (var i2 = 0; i2 < a2.length; i2++) {
      f(a2[i2]);
    }
  }
  function forInE(o, f) {
    var ks = Object.keys(o);
    for (var i2 = 0; i2 < ks.length; i2++) {
      var k = ks[i2];
      f(k, o[k]);
    }
  }
  function diffWithIxE(a1, a2, f1, f2, f3) {
    var a3 = [];
    var l1 = a1.length;
    var l2 = a2.length;
    var i2 = 0;
    while (1) {
      if (i2 < l1) {
        if (i2 < l2) {
          a3.push(f1(i2, a1[i2], a2[i2]));
        } else {
          f2(i2, a1[i2]);
        }
      } else if (i2 < l2) {
        a3.push(f3(i2, a2[i2]));
      } else {
        break;
      }
      i2++;
    }
    return a3;
  }
  function strMapWithIxE(as3, fk, f) {
    var o = {};
    for (var i2 = 0; i2 < as3.length; i2++) {
      var a2 = as3[i2];
      var k = fk(a2);
      o[k] = f(k, i2, a2);
    }
    return o;
  }
  function diffWithKeyAndIxE(o1, as3, fk, f1, f2, f3) {
    var o2 = {};
    for (var i2 = 0; i2 < as3.length; i2++) {
      var a2 = as3[i2];
      var k = fk(a2);
      if (o1.hasOwnProperty(k)) {
        o2[k] = f1(k, i2, o1[k], a2);
      } else {
        o2[k] = f3(k, i2, a2);
      }
    }
    for (var k in o1) {
      if (k in o2) {
        continue;
      }
      f2(k, o1[k]);
    }
    return o2;
  }
  function refEq2(a2, b2) {
    return a2 === b2;
  }
  function createTextNode(s, doc) {
    return doc.createTextNode(s);
  }
  function setTextContent(s, n) {
    n.textContent = s;
  }
  function createElement(ns, name16, doc) {
    if (ns != null) {
      return doc.createElementNS(ns, name16);
    } else {
      return doc.createElement(name16);
    }
  }
  function insertChildIx(i2, a2, b2) {
    var n = b2.childNodes.item(i2) || null;
    if (n !== a2) {
      b2.insertBefore(a2, n);
    }
  }
  function removeChild(a2, b2) {
    if (b2 && a2.parentNode === b2) {
      b2.removeChild(a2);
    }
  }
  function parentNode(a2) {
    return a2.parentNode;
  }
  function setAttribute(ns, attr3, val, el) {
    if (ns != null) {
      el.setAttributeNS(ns, attr3, val);
    } else {
      el.setAttribute(attr3, val);
    }
  }
  function removeAttribute(ns, attr3, el) {
    if (ns != null) {
      el.removeAttributeNS(ns, attr3);
    } else {
      el.removeAttribute(attr3);
    }
  }
  function hasAttribute(ns, attr3, el) {
    if (ns != null) {
      return el.hasAttributeNS(ns, attr3);
    } else {
      return el.hasAttribute(attr3);
    }
  }
  function addEventListener2(ev, listener, el) {
    el.addEventListener(ev, listener, false);
  }
  function removeEventListener2(ev, listener, el) {
    el.removeEventListener(ev, listener, false);
  }
  var jsUndefined = void 0;

  // output/Foreign.Object.ST/foreign.js
  var newImpl = function() {
    return {};
  };
  function poke2(k) {
    return function(v) {
      return function(m) {
        return function() {
          m[k] = v;
          return m;
        };
      };
    };
  }

  // output/Halogen.VDom.Util/index.js
  var unsafeLookup = unsafeGetAny;
  var unsafeFreeze2 = unsafeCoerce2;
  var pokeMutMap = unsafeSetAny;
  var newMutMap = newImpl;

  // output/Web.DOM.Element/foreign.js
  var getProp = function(name16) {
    return function(doctype) {
      return doctype[name16];
    };
  };
  var _namespaceURI = getProp("namespaceURI");
  var _prefix = getProp("prefix");
  var localName = getProp("localName");
  var tagName = getProp("tagName");

  // output/Web.DOM.Element/index.js
  var toNode2 = unsafeCoerce2;

  // output/Halogen.VDom.DOM/index.js
  var $runtime_lazy5 = function(name16, moduleName, init4) {
    var state3 = 0;
    var val;
    return function(lineNumber) {
      if (state3 === 2)
        return val;
      if (state3 === 1)
        throw new ReferenceError(name16 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
      state3 = 1;
      val = init4();
      state3 = 2;
      return val;
    };
  };
  var haltWidget = function(v) {
    return halt(v.widget);
  };
  var $lazy_patchWidget = /* @__PURE__ */ $runtime_lazy5("patchWidget", "Halogen.VDom.DOM", function() {
    return function(state3, vdom) {
      if (vdom instanceof Grafted) {
        return $lazy_patchWidget(291)(state3, runGraft(vdom.value0));
      }
      ;
      if (vdom instanceof Widget) {
        var res = step3(state3.widget, vdom.value0);
        var res$prime = unStep(function(v) {
          return mkStep(new Step2(v.value0, {
            build: state3.build,
            widget: res
          }, $lazy_patchWidget(296), haltWidget));
        })(res);
        return res$prime;
      }
      ;
      haltWidget(state3);
      return state3.build(vdom);
    };
  });
  var patchWidget = /* @__PURE__ */ $lazy_patchWidget(286);
  var haltText = function(v) {
    var parent2 = parentNode(v.node);
    return removeChild(v.node, parent2);
  };
  var $lazy_patchText = /* @__PURE__ */ $runtime_lazy5("patchText", "Halogen.VDom.DOM", function() {
    return function(state3, vdom) {
      if (vdom instanceof Grafted) {
        return $lazy_patchText(82)(state3, runGraft(vdom.value0));
      }
      ;
      if (vdom instanceof Text) {
        if (state3.value === vdom.value0) {
          return mkStep(new Step2(state3.node, state3, $lazy_patchText(85), haltText));
        }
        ;
        if (otherwise) {
          var nextState = {
            build: state3.build,
            node: state3.node,
            value: vdom.value0
          };
          setTextContent(vdom.value0, state3.node);
          return mkStep(new Step2(state3.node, nextState, $lazy_patchText(89), haltText));
        }
        ;
      }
      ;
      haltText(state3);
      return state3.build(vdom);
    };
  });
  var patchText = /* @__PURE__ */ $lazy_patchText(77);
  var haltKeyed = function(v) {
    var parent2 = parentNode(v.node);
    removeChild(v.node, parent2);
    forInE(v.children, function(v1, s) {
      return halt(s);
    });
    return halt(v.attrs);
  };
  var haltElem = function(v) {
    var parent2 = parentNode(v.node);
    removeChild(v.node, parent2);
    forEachE(v.children, halt);
    return halt(v.attrs);
  };
  var eqElemSpec = function(ns1, v, ns2, v1) {
    var $63 = v === v1;
    if ($63) {
      if (ns1 instanceof Just && (ns2 instanceof Just && ns1.value0 === ns2.value0)) {
        return true;
      }
      ;
      if (ns1 instanceof Nothing && ns2 instanceof Nothing) {
        return true;
      }
      ;
      return false;
    }
    ;
    return false;
  };
  var $lazy_patchElem = /* @__PURE__ */ $runtime_lazy5("patchElem", "Halogen.VDom.DOM", function() {
    return function(state3, vdom) {
      if (vdom instanceof Grafted) {
        return $lazy_patchElem(135)(state3, runGraft(vdom.value0));
      }
      ;
      if (vdom instanceof Elem && eqElemSpec(state3.ns, state3.name, vdom.value0, vdom.value1)) {
        var v = length(vdom.value3);
        var v1 = length(state3.children);
        if (v1 === 0 && v === 0) {
          var attrs2 = step3(state3.attrs, vdom.value2);
          var nextState = {
            build: state3.build,
            node: state3.node,
            attrs: attrs2,
            ns: vdom.value0,
            name: vdom.value1,
            children: state3.children
          };
          return mkStep(new Step2(state3.node, nextState, $lazy_patchElem(149), haltElem));
        }
        ;
        var onThis = function(v2, s) {
          return halt(s);
        };
        var onThese = function(ix, s, v2) {
          var res = step3(s, v2);
          insertChildIx(ix, extract2(res), state3.node);
          return res;
        };
        var onThat = function(ix, v2) {
          var res = state3.build(v2);
          insertChildIx(ix, extract2(res), state3.node);
          return res;
        };
        var children2 = diffWithIxE(state3.children, vdom.value3, onThese, onThis, onThat);
        var attrs2 = step3(state3.attrs, vdom.value2);
        var nextState = {
          build: state3.build,
          node: state3.node,
          attrs: attrs2,
          ns: vdom.value0,
          name: vdom.value1,
          children: children2
        };
        return mkStep(new Step2(state3.node, nextState, $lazy_patchElem(172), haltElem));
      }
      ;
      haltElem(state3);
      return state3.build(vdom);
    };
  });
  var patchElem = /* @__PURE__ */ $lazy_patchElem(130);
  var $lazy_patchKeyed = /* @__PURE__ */ $runtime_lazy5("patchKeyed", "Halogen.VDom.DOM", function() {
    return function(state3, vdom) {
      if (vdom instanceof Grafted) {
        return $lazy_patchKeyed(222)(state3, runGraft(vdom.value0));
      }
      ;
      if (vdom instanceof Keyed && eqElemSpec(state3.ns, state3.name, vdom.value0, vdom.value1)) {
        var v = length(vdom.value3);
        if (state3.length === 0 && v === 0) {
          var attrs2 = step3(state3.attrs, vdom.value2);
          var nextState = {
            build: state3.build,
            node: state3.node,
            attrs: attrs2,
            ns: vdom.value0,
            name: vdom.value1,
            children: state3.children,
            length: 0
          };
          return mkStep(new Step2(state3.node, nextState, $lazy_patchKeyed(237), haltKeyed));
        }
        ;
        var onThis = function(v2, s) {
          return halt(s);
        };
        var onThese = function(v2, ix$prime, s, v3) {
          var res = step3(s, v3.value1);
          insertChildIx(ix$prime, extract2(res), state3.node);
          return res;
        };
        var onThat = function(v2, ix, v3) {
          var res = state3.build(v3.value1);
          insertChildIx(ix, extract2(res), state3.node);
          return res;
        };
        var children2 = diffWithKeyAndIxE(state3.children, vdom.value3, fst, onThese, onThis, onThat);
        var attrs2 = step3(state3.attrs, vdom.value2);
        var nextState = {
          build: state3.build,
          node: state3.node,
          attrs: attrs2,
          ns: vdom.value0,
          name: vdom.value1,
          children: children2,
          length: v
        };
        return mkStep(new Step2(state3.node, nextState, $lazy_patchKeyed(261), haltKeyed));
      }
      ;
      haltKeyed(state3);
      return state3.build(vdom);
    };
  });
  var patchKeyed = /* @__PURE__ */ $lazy_patchKeyed(217);
  var buildWidget = function(v, build2, w) {
    var res = v.buildWidget(v)(w);
    var res$prime = unStep(function(v1) {
      return mkStep(new Step2(v1.value0, {
        build: build2,
        widget: res
      }, patchWidget, haltWidget));
    })(res);
    return res$prime;
  };
  var buildText = function(v, build2, s) {
    var node = createTextNode(s, v.document);
    var state3 = {
      build: build2,
      node,
      value: s
    };
    return mkStep(new Step2(node, state3, patchText, haltText));
  };
  var buildKeyed = function(v, build2, ns1, name1, as1, ch1) {
    var el = createElement(toNullable(ns1), name1, v.document);
    var node = toNode2(el);
    var onChild = function(v1, ix, v2) {
      var res = build2(v2.value1);
      insertChildIx(ix, extract2(res), node);
      return res;
    };
    var children2 = strMapWithIxE(ch1, fst, onChild);
    var attrs = v.buildAttributes(el)(as1);
    var state3 = {
      build: build2,
      node,
      attrs,
      ns: ns1,
      name: name1,
      children: children2,
      length: length(ch1)
    };
    return mkStep(new Step2(node, state3, patchKeyed, haltKeyed));
  };
  var buildElem = function(v, build2, ns1, name1, as1, ch1) {
    var el = createElement(toNullable(ns1), name1, v.document);
    var node = toNode2(el);
    var onChild = function(ix, child2) {
      var res = build2(child2);
      insertChildIx(ix, extract2(res), node);
      return res;
    };
    var children2 = forE2(ch1, onChild);
    var attrs = v.buildAttributes(el)(as1);
    var state3 = {
      build: build2,
      node,
      attrs,
      ns: ns1,
      name: name1,
      children: children2
    };
    return mkStep(new Step2(node, state3, patchElem, haltElem));
  };
  var buildVDom = function(spec) {
    var $lazy_build = $runtime_lazy5("build", "Halogen.VDom.DOM", function() {
      return function(v) {
        if (v instanceof Text) {
          return buildText(spec, $lazy_build(59), v.value0);
        }
        ;
        if (v instanceof Elem) {
          return buildElem(spec, $lazy_build(60), v.value0, v.value1, v.value2, v.value3);
        }
        ;
        if (v instanceof Keyed) {
          return buildKeyed(spec, $lazy_build(61), v.value0, v.value1, v.value2, v.value3);
        }
        ;
        if (v instanceof Widget) {
          return buildWidget(spec, $lazy_build(62), v.value0);
        }
        ;
        if (v instanceof Grafted) {
          return $lazy_build(63)(runGraft(v.value0));
        }
        ;
        throw new Error("Failed pattern match at Halogen.VDom.DOM (line 58, column 27 - line 63, column 52): " + [v.constructor.name]);
      };
    });
    var build2 = $lazy_build(58);
    return build2;
  };

  // output/Foreign/foreign.js
  function typeOf(value18) {
    return typeof value18;
  }
  function tagOf(value18) {
    return Object.prototype.toString.call(value18).slice(8, -1);
  }
  function isNull(value18) {
    return value18 === null;
  }
  function isUndefined(value18) {
    return value18 === void 0;
  }
  var isArray = Array.isArray || function(value18) {
    return Object.prototype.toString.call(value18) === "[object Array]";
  };

  // output/Data.List.NonEmpty/index.js
  var singleton9 = /* @__PURE__ */ function() {
    var $200 = singleton5(plusList);
    return function($201) {
      return NonEmptyList($200($201));
    };
  }();
  var head4 = function(v) {
    return v.value0;
  };
  var cons4 = function(y) {
    return function(v) {
      return new NonEmpty(y, new Cons(v.value0, v.value1));
    };
  };

  // output/Foreign/index.js
  var pure7 = /* @__PURE__ */ pure(applicativeEither);
  var ForeignError = /* @__PURE__ */ function() {
    function ForeignError2(value0) {
      this.value0 = value0;
    }
    ;
    ForeignError2.create = function(value0) {
      return new ForeignError2(value0);
    };
    return ForeignError2;
  }();
  var TypeMismatch = /* @__PURE__ */ function() {
    function TypeMismatch2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    TypeMismatch2.create = function(value0) {
      return function(value1) {
        return new TypeMismatch2(value0, value1);
      };
    };
    return TypeMismatch2;
  }();
  var ErrorAtIndex = /* @__PURE__ */ function() {
    function ErrorAtIndex2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    ErrorAtIndex2.create = function(value0) {
      return function(value1) {
        return new ErrorAtIndex2(value0, value1);
      };
    };
    return ErrorAtIndex2;
  }();
  var ErrorAtProperty = /* @__PURE__ */ function() {
    function ErrorAtProperty2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    ErrorAtProperty2.create = function(value0) {
      return function(value1) {
        return new ErrorAtProperty2(value0, value1);
      };
    };
    return ErrorAtProperty2;
  }();
  var unsafeToForeign = unsafeCoerce2;
  var unsafeFromForeign = unsafeCoerce2;
  var fail = function(dictMonad) {
    var $153 = throwError(monadThrowExceptT(dictMonad));
    return function($154) {
      return $153(singleton9($154));
    };
  };
  var readArray = function(dictMonad) {
    var pure114 = pure(applicativeExceptT(dictMonad));
    var fail1 = fail(dictMonad);
    return function(value18) {
      if (isArray(value18)) {
        return pure114(unsafeFromForeign(value18));
      }
      ;
      if (otherwise) {
        return fail1(new TypeMismatch("array", tagOf(value18)));
      }
      ;
      throw new Error("Failed pattern match at Foreign (line 164, column 1 - line 164, column 99): " + [value18.constructor.name]);
    };
  };
  var unsafeReadTagged = function(dictMonad) {
    var pure114 = pure(applicativeExceptT(dictMonad));
    var fail1 = fail(dictMonad);
    return function(tag) {
      return function(value18) {
        if (tagOf(value18) === tag) {
          return pure114(unsafeFromForeign(value18));
        }
        ;
        if (otherwise) {
          return fail1(new TypeMismatch(tag, tagOf(value18)));
        }
        ;
        throw new Error("Failed pattern match at Foreign (line 123, column 1 - line 123, column 104): " + [tag.constructor.name, value18.constructor.name]);
      };
    };
  };
  var readNumber = function(dictMonad) {
    return unsafeReadTagged(dictMonad)("Number");
  };
  var readInt = function(dictMonad) {
    var map50 = map(dictMonad.Bind1().Apply0().Functor0());
    var readNumber1 = readNumber(dictMonad);
    return function(value18) {
      var error4 = new Left(singleton9(new TypeMismatch("Int", tagOf(value18))));
      var fromNumber3 = function() {
        var $155 = maybe(error4)(pure7);
        return function($156) {
          return $155(fromNumber($156));
        };
      }();
      return mapExceptT(map50(either($$const(error4))(fromNumber3)))(readNumber1(value18));
    };
  };
  var readString = function(dictMonad) {
    return unsafeReadTagged(dictMonad)("String");
  };

  // output/Foreign.Object/foreign.js
  function _copyST(m) {
    return function() {
      var r = {};
      for (var k in m) {
        if (hasOwnProperty.call(m, k)) {
          r[k] = m[k];
        }
      }
      return r;
    };
  }
  var empty4 = {};
  function runST(f) {
    return f();
  }
  function _fmapObject(m0, f) {
    var m = {};
    for (var k in m0) {
      if (hasOwnProperty.call(m0, k)) {
        m[k] = f(m0[k]);
      }
    }
    return m;
  }
  function _mapWithKey(m0, f) {
    var m = {};
    for (var k in m0) {
      if (hasOwnProperty.call(m0, k)) {
        m[k] = f(k)(m0[k]);
      }
    }
    return m;
  }
  function _foldM(bind18) {
    return function(f) {
      return function(mz) {
        return function(m) {
          var acc = mz;
          function g(k2) {
            return function(z) {
              return f(z)(k2)(m[k2]);
            };
          }
          for (var k in m) {
            if (hasOwnProperty.call(m, k)) {
              acc = bind18(acc)(g(k));
            }
          }
          return acc;
        };
      };
    };
  }
  function _lookup(no, yes, k, m) {
    return k in m ? yes(m[k]) : no;
  }
  function toArrayWithKey(f) {
    return function(m) {
      var r = [];
      for (var k in m) {
        if (hasOwnProperty.call(m, k)) {
          r.push(f(k)(m[k]));
        }
      }
      return r;
    };
  }
  var keys = Object.keys || toArrayWithKey(function(k) {
    return function() {
      return k;
    };
  });

  // output/Foreign.Object/index.js
  var $$void4 = /* @__PURE__ */ $$void(functorST);
  var foldr3 = /* @__PURE__ */ foldr(foldableArray);
  var identity12 = /* @__PURE__ */ identity(categoryFn);
  var values = /* @__PURE__ */ toArrayWithKey(function(v) {
    return function(v1) {
      return v1;
    };
  });
  var toUnfoldable2 = function(dictUnfoldable) {
    var $86 = toUnfoldable(dictUnfoldable);
    var $87 = toArrayWithKey(Tuple.create);
    return function($88) {
      return $86($87($88));
    };
  };
  var thawST = _copyST;
  var mutate = function(f) {
    return function(m) {
      return runST(function __do2() {
        var s = thawST(m)();
        f(s)();
        return s;
      });
    };
  };
  var mapWithKey = function(f) {
    return function(m) {
      return _mapWithKey(m, f);
    };
  };
  var lookup4 = /* @__PURE__ */ function() {
    return runFn4(_lookup)(Nothing.value)(Just.create);
  }();
  var insert5 = function(k) {
    return function(v) {
      return mutate(poke2(k)(v));
    };
  };
  var functorObject = {
    map: function(f) {
      return function(m) {
        return _fmapObject(m, f);
      };
    }
  };
  var functorWithIndexObject = {
    mapWithIndex: mapWithKey,
    Functor0: function() {
      return functorObject;
    }
  };
  var fromFoldable4 = function(dictFoldable) {
    var fromFoldable1 = fromFoldable(dictFoldable);
    return function(l) {
      return runST(function __do2() {
        var s = newImpl();
        foreach(fromFoldable1(l))(function(v) {
          return $$void4(poke2(v.value0)(v.value1)(s));
        })();
        return s;
      });
    };
  };
  var fold2 = /* @__PURE__ */ _foldM(applyFlipped);
  var foldMap2 = function(dictMonoid) {
    var append16 = append(dictMonoid.Semigroup0());
    var mempty7 = mempty(dictMonoid);
    return function(f) {
      return fold2(function(acc) {
        return function(k) {
          return function(v) {
            return append16(acc)(f(k)(v));
          };
        };
      })(mempty7);
    };
  };
  var foldableObject = {
    foldl: function(f) {
      return fold2(function(z) {
        return function(v) {
          return f(z);
        };
      });
    },
    foldr: function(f) {
      return function(z) {
        return function(m) {
          return foldr3(f)(z)(values(m));
        };
      };
    },
    foldMap: function(dictMonoid) {
      var foldMap12 = foldMap2(dictMonoid);
      return function(f) {
        return foldMap12($$const(f));
      };
    }
  };
  var foldableWithIndexObject = {
    foldlWithIndex: function(f) {
      return fold2(flip(f));
    },
    foldrWithIndex: function(f) {
      return function(z) {
        return function(m) {
          return foldr3(uncurry(f))(z)(toArrayWithKey(Tuple.create)(m));
        };
      };
    },
    foldMapWithIndex: function(dictMonoid) {
      return foldMap2(dictMonoid);
    },
    Foldable0: function() {
      return foldableObject;
    }
  };
  var traversableWithIndexObject = {
    traverseWithIndex: function(dictApplicative) {
      var Apply0 = dictApplicative.Apply0();
      var apply8 = apply(Apply0);
      var map50 = map(Apply0.Functor0());
      var pure114 = pure(dictApplicative);
      return function(f) {
        return function(ms) {
          return fold2(function(acc) {
            return function(k) {
              return function(v) {
                return apply8(map50(flip(insert5(k)))(acc))(f(k)(v));
              };
            };
          })(pure114(empty4))(ms);
        };
      };
    },
    FunctorWithIndex0: function() {
      return functorWithIndexObject;
    },
    FoldableWithIndex1: function() {
      return foldableWithIndexObject;
    },
    Traversable2: function() {
      return traversableObject;
    }
  };
  var traversableObject = {
    traverse: function(dictApplicative) {
      var $93 = traverseWithIndex(traversableWithIndexObject)(dictApplicative);
      return function($94) {
        return $93($$const($94));
      };
    },
    sequence: function(dictApplicative) {
      return traverse(traversableObject)(dictApplicative)(identity12);
    },
    Functor0: function() {
      return functorObject;
    },
    Foldable1: function() {
      return foldableObject;
    }
  };

  // output/Halogen.VDom.DOM.Prop/index.js
  var $runtime_lazy6 = function(name16, moduleName, init4) {
    var state3 = 0;
    var val;
    return function(lineNumber) {
      if (state3 === 2)
        return val;
      if (state3 === 1)
        throw new ReferenceError(name16 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
      state3 = 1;
      val = init4();
      state3 = 2;
      return val;
    };
  };
  var map23 = /* @__PURE__ */ map(functorFn);
  var map111 = /* @__PURE__ */ map(functorMaybe);
  var Created = /* @__PURE__ */ function() {
    function Created2(value0) {
      this.value0 = value0;
    }
    ;
    Created2.create = function(value0) {
      return new Created2(value0);
    };
    return Created2;
  }();
  var Removed = /* @__PURE__ */ function() {
    function Removed2(value0) {
      this.value0 = value0;
    }
    ;
    Removed2.create = function(value0) {
      return new Removed2(value0);
    };
    return Removed2;
  }();
  var Attribute = /* @__PURE__ */ function() {
    function Attribute2(value0, value1, value22) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
    }
    ;
    Attribute2.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return new Attribute2(value0, value1, value22);
        };
      };
    };
    return Attribute2;
  }();
  var Property = /* @__PURE__ */ function() {
    function Property3(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Property3.create = function(value0) {
      return function(value1) {
        return new Property3(value0, value1);
      };
    };
    return Property3;
  }();
  var Handler = /* @__PURE__ */ function() {
    function Handler2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Handler2.create = function(value0) {
      return function(value1) {
        return new Handler2(value0, value1);
      };
    };
    return Handler2;
  }();
  var Ref = /* @__PURE__ */ function() {
    function Ref2(value0) {
      this.value0 = value0;
    }
    ;
    Ref2.create = function(value0) {
      return new Ref2(value0);
    };
    return Ref2;
  }();
  var unsafeGetProperty = unsafeGetAny;
  var setProperty = unsafeSetAny;
  var removeProperty = function(key2, el) {
    var v = hasAttribute(nullImpl, key2, el);
    if (v) {
      return removeAttribute(nullImpl, key2, el);
    }
    ;
    var v1 = typeOf(unsafeGetAny(key2, el));
    if (v1 === "string") {
      return unsafeSetAny(key2, "", el);
    }
    ;
    if (key2 === "rowSpan") {
      return unsafeSetAny(key2, 1, el);
    }
    ;
    if (key2 === "colSpan") {
      return unsafeSetAny(key2, 1, el);
    }
    ;
    return unsafeSetAny(key2, jsUndefined, el);
  };
  var propToStrKey = function(v) {
    if (v instanceof Attribute && v.value0 instanceof Just) {
      return "attr/" + (v.value0.value0 + (":" + v.value1));
    }
    ;
    if (v instanceof Attribute) {
      return "attr/:" + v.value1;
    }
    ;
    if (v instanceof Property) {
      return "prop/" + v.value0;
    }
    ;
    if (v instanceof Handler) {
      return "handler/" + v.value0;
    }
    ;
    if (v instanceof Ref) {
      return "ref";
    }
    ;
    throw new Error("Failed pattern match at Halogen.VDom.DOM.Prop (line 182, column 16 - line 187, column 16): " + [v.constructor.name]);
  };
  var propFromString = unsafeCoerce2;
  var propFromNumber = unsafeCoerce2;
  var propFromInt = unsafeCoerce2;
  var propFromBoolean = unsafeCoerce2;
  var functorProp = {
    map: function(v) {
      return function(v1) {
        if (v1 instanceof Handler) {
          return new Handler(v1.value0, map23(map111(v))(v1.value1));
        }
        ;
        if (v1 instanceof Ref) {
          return new Ref(map23(map111(v))(v1.value0));
        }
        ;
        return v1;
      };
    }
  };
  var buildProp = function(emit) {
    return function(el) {
      var removeProp = function(prevEvents) {
        return function(v, v1) {
          if (v1 instanceof Attribute) {
            return removeAttribute(toNullable(v1.value0), v1.value1, el);
          }
          ;
          if (v1 instanceof Property) {
            return removeProperty(v1.value0, el);
          }
          ;
          if (v1 instanceof Handler) {
            var handler3 = unsafeLookup(v1.value0, prevEvents);
            return removeEventListener2(v1.value0, fst(handler3), el);
          }
          ;
          if (v1 instanceof Ref) {
            return unit;
          }
          ;
          throw new Error("Failed pattern match at Halogen.VDom.DOM.Prop (line 169, column 5 - line 179, column 18): " + [v1.constructor.name]);
        };
      };
      var mbEmit = function(v) {
        if (v instanceof Just) {
          return emit(v.value0)();
        }
        ;
        return unit;
      };
      var haltProp = function(state3) {
        var v = lookup4("ref")(state3.props);
        if (v instanceof Just && v.value0 instanceof Ref) {
          return mbEmit(v.value0.value0(new Removed(el)));
        }
        ;
        return unit;
      };
      var diffProp = function(prevEvents, events) {
        return function(v, v1, v11, v2) {
          if (v11 instanceof Attribute && v2 instanceof Attribute) {
            var $66 = v11.value2 === v2.value2;
            if ($66) {
              return v2;
            }
            ;
            setAttribute(toNullable(v2.value0), v2.value1, v2.value2, el);
            return v2;
          }
          ;
          if (v11 instanceof Property && v2 instanceof Property) {
            var v4 = refEq2(v11.value1, v2.value1);
            if (v4) {
              return v2;
            }
            ;
            if (v2.value0 === "value") {
              var elVal = unsafeGetProperty("value", el);
              var $75 = refEq2(elVal, v2.value1);
              if ($75) {
                return v2;
              }
              ;
              setProperty(v2.value0, v2.value1, el);
              return v2;
            }
            ;
            setProperty(v2.value0, v2.value1, el);
            return v2;
          }
          ;
          if (v11 instanceof Handler && v2 instanceof Handler) {
            var handler3 = unsafeLookup(v2.value0, prevEvents);
            write(v2.value1)(snd(handler3))();
            pokeMutMap(v2.value0, handler3, events);
            return v2;
          }
          ;
          return v2;
        };
      };
      var applyProp = function(events) {
        return function(v, v1, v2) {
          if (v2 instanceof Attribute) {
            setAttribute(toNullable(v2.value0), v2.value1, v2.value2, el);
            return v2;
          }
          ;
          if (v2 instanceof Property) {
            setProperty(v2.value0, v2.value1, el);
            return v2;
          }
          ;
          if (v2 instanceof Handler) {
            var v3 = unsafeGetAny(v2.value0, events);
            if (unsafeHasAny(v2.value0, events)) {
              write(v2.value1)(snd(v3))();
              return v2;
            }
            ;
            var ref2 = $$new(v2.value1)();
            var listener = eventListener(function(ev) {
              return function __do2() {
                var f$prime = read(ref2)();
                return mbEmit(f$prime(ev));
              };
            })();
            pokeMutMap(v2.value0, new Tuple(listener, ref2), events);
            addEventListener2(v2.value0, listener, el);
            return v2;
          }
          ;
          if (v2 instanceof Ref) {
            mbEmit(v2.value0(new Created(el)));
            return v2;
          }
          ;
          throw new Error("Failed pattern match at Halogen.VDom.DOM.Prop (line 113, column 5 - line 135, column 15): " + [v2.constructor.name]);
        };
      };
      var $lazy_patchProp = $runtime_lazy6("patchProp", "Halogen.VDom.DOM.Prop", function() {
        return function(state3, ps2) {
          var events = newMutMap();
          var onThis = removeProp(state3.events);
          var onThese = diffProp(state3.events, events);
          var onThat = applyProp(events);
          var props = diffWithKeyAndIxE(state3.props, ps2, propToStrKey, onThese, onThis, onThat);
          var nextState = {
            events: unsafeFreeze2(events),
            props
          };
          return mkStep(new Step2(unit, nextState, $lazy_patchProp(100), haltProp));
        };
      });
      var patchProp = $lazy_patchProp(87);
      var renderProp = function(ps1) {
        var events = newMutMap();
        var ps1$prime = strMapWithIxE(ps1, propToStrKey, applyProp(events));
        var state3 = {
          events: unsafeFreeze2(events),
          props: ps1$prime
        };
        return mkStep(new Step2(unit, state3, patchProp, haltProp));
      };
      return renderProp;
    };
  };

  // output/Halogen.HTML.Core/index.js
  var map24 = /* @__PURE__ */ map(functorArray);
  var map112 = /* @__PURE__ */ map(functorProp);
  var map25 = /* @__PURE__ */ map(functorInput);
  var bimap4 = /* @__PURE__ */ bimap(bifunctorVDom);
  var HTML = function(x) {
    return x;
  };
  var widget = function($28) {
    return HTML(Widget.create($28));
  };
  var toPropValue = function(dict) {
    return dict.toPropValue;
  };
  var text5 = function($29) {
    return HTML(Text.create($29));
  };
  var prop = function(dictIsProp) {
    var toPropValue1 = toPropValue(dictIsProp);
    return function(v) {
      var $31 = Property.create(v);
      return function($32) {
        return $31(toPropValue1($32));
      };
    };
  };
  var isPropString = {
    toPropValue: propFromString
  };
  var isPropStepValue = {
    toPropValue: function($36) {
      return propFromString(renderStepValue($36));
    }
  };
  var isPropNumber = {
    toPropValue: propFromNumber
  };
  var isPropInt = {
    toPropValue: propFromInt
  };
  var isPropInputType = {
    toPropValue: function($45) {
      return propFromString(renderInputType($45));
    }
  };
  var isPropInputAcceptType = {
    toPropValue: function($46) {
      return propFromString(renderInputAcceptType($46));
    }
  };
  var isPropBoolean = {
    toPropValue: propFromBoolean
  };
  var handler = /* @__PURE__ */ function() {
    return Handler.create;
  }();
  var element = function(ns) {
    return function(name16) {
      return function(props) {
        return function(children2) {
          return new Elem(ns, name16, props, children2);
        };
      };
    };
  };
  var bifunctorHTML = {
    bimap: function(f) {
      return function(g) {
        return function(v) {
          return bimap4(map24(map112(map25(g))))(f)(v);
        };
      };
    }
  };
  var attr = function(ns) {
    return function(v) {
      return Attribute.create(ns)(v);
    };
  };

  // output/Control.Applicative.Free/index.js
  var identity13 = /* @__PURE__ */ identity(categoryFn);
  var Pure = /* @__PURE__ */ function() {
    function Pure2(value0) {
      this.value0 = value0;
    }
    ;
    Pure2.create = function(value0) {
      return new Pure2(value0);
    };
    return Pure2;
  }();
  var Lift = /* @__PURE__ */ function() {
    function Lift3(value0) {
      this.value0 = value0;
    }
    ;
    Lift3.create = function(value0) {
      return new Lift3(value0);
    };
    return Lift3;
  }();
  var Ap = /* @__PURE__ */ function() {
    function Ap2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Ap2.create = function(value0) {
      return function(value1) {
        return new Ap2(value0, value1);
      };
    };
    return Ap2;
  }();
  var mkAp = function(fba) {
    return function(fb) {
      return new Ap(fba, fb);
    };
  };
  var liftFreeAp = /* @__PURE__ */ function() {
    return Lift.create;
  }();
  var goLeft = function(dictApplicative) {
    var pure31 = pure(dictApplicative);
    return function(fStack) {
      return function(valStack) {
        return function(nat) {
          return function(func) {
            return function(count) {
              if (func instanceof Pure) {
                return new Tuple(new Cons({
                  func: pure31(func.value0),
                  count
                }, fStack), valStack);
              }
              ;
              if (func instanceof Lift) {
                return new Tuple(new Cons({
                  func: nat(func.value0),
                  count
                }, fStack), valStack);
              }
              ;
              if (func instanceof Ap) {
                return goLeft(dictApplicative)(fStack)(cons4(func.value1)(valStack))(nat)(func.value0)(count + 1 | 0);
              }
              ;
              throw new Error("Failed pattern match at Control.Applicative.Free (line 102, column 41 - line 105, column 81): " + [func.constructor.name]);
            };
          };
        };
      };
    };
  };
  var goApply = function(dictApplicative) {
    var apply8 = apply(dictApplicative.Apply0());
    return function(fStack) {
      return function(vals) {
        return function(gVal) {
          if (fStack instanceof Nil) {
            return new Left(gVal);
          }
          ;
          if (fStack instanceof Cons) {
            var gRes = apply8(fStack.value0.func)(gVal);
            var $31 = fStack.value0.count === 1;
            if ($31) {
              if (fStack.value1 instanceof Nil) {
                return new Left(gRes);
              }
              ;
              return goApply(dictApplicative)(fStack.value1)(vals)(gRes);
            }
            ;
            if (vals instanceof Nil) {
              return new Left(gRes);
            }
            ;
            if (vals instanceof Cons) {
              return new Right(new Tuple(new Cons({
                func: gRes,
                count: fStack.value0.count - 1 | 0
              }, fStack.value1), new NonEmpty(vals.value0, vals.value1)));
            }
            ;
            throw new Error("Failed pattern match at Control.Applicative.Free (line 83, column 11 - line 88, column 50): " + [vals.constructor.name]);
          }
          ;
          throw new Error("Failed pattern match at Control.Applicative.Free (line 72, column 3 - line 88, column 50): " + [fStack.constructor.name]);
        };
      };
    };
  };
  var functorFreeAp = {
    map: function(f) {
      return function(x) {
        return mkAp(new Pure(f))(x);
      };
    }
  };
  var foldFreeAp = function(dictApplicative) {
    var goApply1 = goApply(dictApplicative);
    var pure31 = pure(dictApplicative);
    var goLeft1 = goLeft(dictApplicative);
    return function(nat) {
      return function(z) {
        var go2 = function($copy_v) {
          var $tco_done = false;
          var $tco_result;
          function $tco_loop(v) {
            if (v.value1.value0 instanceof Pure) {
              var v1 = goApply1(v.value0)(v.value1.value1)(pure31(v.value1.value0.value0));
              if (v1 instanceof Left) {
                $tco_done = true;
                return v1.value0;
              }
              ;
              if (v1 instanceof Right) {
                $copy_v = v1.value0;
                return;
              }
              ;
              throw new Error("Failed pattern match at Control.Applicative.Free (line 54, column 17 - line 56, column 24): " + [v1.constructor.name]);
            }
            ;
            if (v.value1.value0 instanceof Lift) {
              var v1 = goApply1(v.value0)(v.value1.value1)(nat(v.value1.value0.value0));
              if (v1 instanceof Left) {
                $tco_done = true;
                return v1.value0;
              }
              ;
              if (v1 instanceof Right) {
                $copy_v = v1.value0;
                return;
              }
              ;
              throw new Error("Failed pattern match at Control.Applicative.Free (line 57, column 17 - line 59, column 24): " + [v1.constructor.name]);
            }
            ;
            if (v.value1.value0 instanceof Ap) {
              var nextVals = new NonEmpty(v.value1.value0.value1, v.value1.value1);
              $copy_v = goLeft1(v.value0)(nextVals)(nat)(v.value1.value0.value0)(1);
              return;
            }
            ;
            throw new Error("Failed pattern match at Control.Applicative.Free (line 53, column 5 - line 62, column 47): " + [v.value1.value0.constructor.name]);
          }
          ;
          while (!$tco_done) {
            $tco_result = $tco_loop($copy_v);
          }
          ;
          return $tco_result;
        };
        return go2(new Tuple(Nil.value, singleton9(z)));
      };
    };
  };
  var retractFreeAp = function(dictApplicative) {
    return foldFreeAp(dictApplicative)(identity13);
  };
  var applyFreeAp = {
    apply: function(fba) {
      return function(fb) {
        return mkAp(fba)(fb);
      };
    },
    Functor0: function() {
      return functorFreeAp;
    }
  };
  var applicativeFreeAp = /* @__PURE__ */ function() {
    return {
      pure: Pure.create,
      Apply0: function() {
        return applyFreeAp;
      }
    };
  }();
  var foldFreeAp1 = /* @__PURE__ */ foldFreeAp(applicativeFreeAp);
  var hoistFreeAp = function(f) {
    return foldFreeAp1(function($54) {
      return liftFreeAp(f($54));
    });
  };

  // output/Data.CatQueue/index.js
  var CatQueue = /* @__PURE__ */ function() {
    function CatQueue2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    CatQueue2.create = function(value0) {
      return function(value1) {
        return new CatQueue2(value0, value1);
      };
    };
    return CatQueue2;
  }();
  var uncons4 = function($copy_v) {
    var $tco_done = false;
    var $tco_result;
    function $tco_loop(v) {
      if (v.value0 instanceof Nil && v.value1 instanceof Nil) {
        $tco_done = true;
        return Nothing.value;
      }
      ;
      if (v.value0 instanceof Nil) {
        $copy_v = new CatQueue(reverse2(v.value1), Nil.value);
        return;
      }
      ;
      if (v.value0 instanceof Cons) {
        $tco_done = true;
        return new Just(new Tuple(v.value0.value0, new CatQueue(v.value0.value1, v.value1)));
      }
      ;
      throw new Error("Failed pattern match at Data.CatQueue (line 82, column 1 - line 82, column 63): " + [v.constructor.name]);
    }
    ;
    while (!$tco_done) {
      $tco_result = $tco_loop($copy_v);
    }
    ;
    return $tco_result;
  };
  var snoc4 = function(v) {
    return function(a2) {
      return new CatQueue(v.value0, new Cons(a2, v.value1));
    };
  };
  var $$null3 = function(v) {
    if (v.value0 instanceof Nil && v.value1 instanceof Nil) {
      return true;
    }
    ;
    return false;
  };
  var empty5 = /* @__PURE__ */ function() {
    return new CatQueue(Nil.value, Nil.value);
  }();

  // output/Data.CatList/index.js
  var CatNil = /* @__PURE__ */ function() {
    function CatNil2() {
    }
    ;
    CatNil2.value = new CatNil2();
    return CatNil2;
  }();
  var CatCons = /* @__PURE__ */ function() {
    function CatCons2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    CatCons2.create = function(value0) {
      return function(value1) {
        return new CatCons2(value0, value1);
      };
    };
    return CatCons2;
  }();
  var link = function(v) {
    return function(v1) {
      if (v instanceof CatNil) {
        return v1;
      }
      ;
      if (v1 instanceof CatNil) {
        return v;
      }
      ;
      if (v instanceof CatCons) {
        return new CatCons(v.value0, snoc4(v.value1)(v1));
      }
      ;
      throw new Error("Failed pattern match at Data.CatList (line 108, column 1 - line 108, column 54): " + [v.constructor.name, v1.constructor.name]);
    };
  };
  var foldr4 = function(k) {
    return function(b2) {
      return function(q2) {
        var foldl10 = function($copy_v) {
          return function($copy_v1) {
            return function($copy_v2) {
              var $tco_var_v = $copy_v;
              var $tco_var_v1 = $copy_v1;
              var $tco_done = false;
              var $tco_result;
              function $tco_loop(v, v1, v2) {
                if (v2 instanceof Nil) {
                  $tco_done = true;
                  return v1;
                }
                ;
                if (v2 instanceof Cons) {
                  $tco_var_v = v;
                  $tco_var_v1 = v(v1)(v2.value0);
                  $copy_v2 = v2.value1;
                  return;
                }
                ;
                throw new Error("Failed pattern match at Data.CatList (line 124, column 3 - line 124, column 59): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
              }
              ;
              while (!$tco_done) {
                $tco_result = $tco_loop($tco_var_v, $tco_var_v1, $copy_v2);
              }
              ;
              return $tco_result;
            };
          };
        };
        var go2 = function($copy_xs) {
          return function($copy_ys) {
            var $tco_var_xs = $copy_xs;
            var $tco_done1 = false;
            var $tco_result;
            function $tco_loop(xs, ys) {
              var v = uncons4(xs);
              if (v instanceof Nothing) {
                $tco_done1 = true;
                return foldl10(function(x) {
                  return function(i2) {
                    return i2(x);
                  };
                })(b2)(ys);
              }
              ;
              if (v instanceof Just) {
                $tco_var_xs = v.value0.value1;
                $copy_ys = new Cons(k(v.value0.value0), ys);
                return;
              }
              ;
              throw new Error("Failed pattern match at Data.CatList (line 120, column 14 - line 122, column 67): " + [v.constructor.name]);
            }
            ;
            while (!$tco_done1) {
              $tco_result = $tco_loop($tco_var_xs, $copy_ys);
            }
            ;
            return $tco_result;
          };
        };
        return go2(q2)(Nil.value);
      };
    };
  };
  var uncons5 = function(v) {
    if (v instanceof CatNil) {
      return Nothing.value;
    }
    ;
    if (v instanceof CatCons) {
      return new Just(new Tuple(v.value0, function() {
        var $66 = $$null3(v.value1);
        if ($66) {
          return CatNil.value;
        }
        ;
        return foldr4(link)(CatNil.value)(v.value1);
      }()));
    }
    ;
    throw new Error("Failed pattern match at Data.CatList (line 99, column 1 - line 99, column 61): " + [v.constructor.name]);
  };
  var empty6 = /* @__PURE__ */ function() {
    return CatNil.value;
  }();
  var append5 = link;
  var semigroupCatList = {
    append: append5
  };
  var snoc5 = function(cat) {
    return function(a2) {
      return append5(cat)(new CatCons(a2, empty5));
    };
  };

  // output/Control.Monad.Free/index.js
  var $runtime_lazy7 = function(name16, moduleName, init4) {
    var state3 = 0;
    var val;
    return function(lineNumber) {
      if (state3 === 2)
        return val;
      if (state3 === 1)
        throw new ReferenceError(name16 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
      state3 = 1;
      val = init4();
      state3 = 2;
      return val;
    };
  };
  var append6 = /* @__PURE__ */ append(semigroupCatList);
  var map26 = /* @__PURE__ */ map(functorFn);
  var Free = /* @__PURE__ */ function() {
    function Free2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Free2.create = function(value0) {
      return function(value1) {
        return new Free2(value0, value1);
      };
    };
    return Free2;
  }();
  var Return = /* @__PURE__ */ function() {
    function Return2(value0) {
      this.value0 = value0;
    }
    ;
    Return2.create = function(value0) {
      return new Return2(value0);
    };
    return Return2;
  }();
  var Bind = /* @__PURE__ */ function() {
    function Bind2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Bind2.create = function(value0) {
      return function(value1) {
        return new Bind2(value0, value1);
      };
    };
    return Bind2;
  }();
  var toView = function($copy_v) {
    var $tco_done = false;
    var $tco_result;
    function $tco_loop(v) {
      var runExpF = function(v22) {
        return v22;
      };
      var concatF = function(v22) {
        return function(r) {
          return new Free(v22.value0, append6(v22.value1)(r));
        };
      };
      if (v.value0 instanceof Return) {
        var v2 = uncons5(v.value1);
        if (v2 instanceof Nothing) {
          $tco_done = true;
          return new Return(v.value0.value0);
        }
        ;
        if (v2 instanceof Just) {
          $copy_v = concatF(runExpF(v2.value0.value0)(v.value0.value0))(v2.value0.value1);
          return;
        }
        ;
        throw new Error("Failed pattern match at Control.Monad.Free (line 227, column 7 - line 231, column 64): " + [v2.constructor.name]);
      }
      ;
      if (v.value0 instanceof Bind) {
        $tco_done = true;
        return new Bind(v.value0.value0, function(a2) {
          return concatF(v.value0.value1(a2))(v.value1);
        });
      }
      ;
      throw new Error("Failed pattern match at Control.Monad.Free (line 225, column 3 - line 233, column 56): " + [v.value0.constructor.name]);
    }
    ;
    while (!$tco_done) {
      $tco_result = $tco_loop($copy_v);
    }
    ;
    return $tco_result;
  };
  var fromView = function(f) {
    return new Free(f, empty6);
  };
  var freeMonad = {
    Applicative0: function() {
      return freeApplicative;
    },
    Bind1: function() {
      return freeBind;
    }
  };
  var freeFunctor = {
    map: function(k) {
      return function(f) {
        return bindFlipped(freeBind)(function() {
          var $189 = pure(freeApplicative);
          return function($190) {
            return $189(k($190));
          };
        }())(f);
      };
    }
  };
  var freeBind = {
    bind: function(v) {
      return function(k) {
        return new Free(v.value0, snoc5(v.value1)(k));
      };
    },
    Apply0: function() {
      return $lazy_freeApply(0);
    }
  };
  var freeApplicative = {
    pure: function($191) {
      return fromView(Return.create($191));
    },
    Apply0: function() {
      return $lazy_freeApply(0);
    }
  };
  var $lazy_freeApply = /* @__PURE__ */ $runtime_lazy7("freeApply", "Control.Monad.Free", function() {
    return {
      apply: ap(freeMonad),
      Functor0: function() {
        return freeFunctor;
      }
    };
  });
  var bind4 = /* @__PURE__ */ bind(freeBind);
  var pure8 = /* @__PURE__ */ pure(freeApplicative);
  var liftF = function(f) {
    return fromView(new Bind(f, function($192) {
      return pure8($192);
    }));
  };
  var substFree = function(k) {
    var go2 = function(f) {
      var v = toView(f);
      if (v instanceof Return) {
        return pure8(v.value0);
      }
      ;
      if (v instanceof Bind) {
        return bind4(k(v.value0))(map26(go2)(v.value1));
      }
      ;
      throw new Error("Failed pattern match at Control.Monad.Free (line 168, column 10 - line 170, column 33): " + [v.constructor.name]);
    };
    return go2;
  };
  var hoistFree = function(k) {
    return substFree(function($193) {
      return liftF(k($193));
    });
  };
  var foldFree = function(dictMonadRec) {
    var Monad0 = dictMonadRec.Monad0();
    var map121 = map(Monad0.Bind1().Apply0().Functor0());
    var pure114 = pure(Monad0.Applicative0());
    var tailRecM4 = tailRecM(dictMonadRec);
    return function(k) {
      var go2 = function(f) {
        var v = toView(f);
        if (v instanceof Return) {
          return map121(Done.create)(pure114(v.value0));
        }
        ;
        if (v instanceof Bind) {
          return map121(function($199) {
            return Loop.create(v.value1($199));
          })(k(v.value0));
        }
        ;
        throw new Error("Failed pattern match at Control.Monad.Free (line 158, column 10 - line 160, column 37): " + [v.constructor.name]);
      };
      return tailRecM4(go2);
    };
  };

  // output/Halogen.Query.ChildQuery/index.js
  var unChildQueryBox = unsafeCoerce2;

  // output/Unsafe.Reference/foreign.js
  function reallyUnsafeRefEq(a2) {
    return function(b2) {
      return a2 === b2;
    };
  }

  // output/Unsafe.Reference/index.js
  var unsafeRefEq = reallyUnsafeRefEq;

  // output/Halogen.Subscription/index.js
  var $$void5 = /* @__PURE__ */ $$void(functorEffect);
  var bind5 = /* @__PURE__ */ bind(bindEffect);
  var append7 = /* @__PURE__ */ append(semigroupArray);
  var traverse_2 = /* @__PURE__ */ traverse_(applicativeEffect);
  var traverse_1 = /* @__PURE__ */ traverse_2(foldableArray);
  var unsubscribe = function(v) {
    return v;
  };
  var subscribe = function(v) {
    return function(k) {
      return v(function($76) {
        return $$void5(k($76));
      });
    };
  };
  var notify = function(v) {
    return function(a2) {
      return v(a2);
    };
  };
  var create3 = function __do() {
    var subscribers = $$new([])();
    return {
      emitter: function(k) {
        return function __do2() {
          modify_(function(v) {
            return append7(v)([k]);
          })(subscribers)();
          return modify_(deleteBy(unsafeRefEq)(k))(subscribers);
        };
      },
      listener: function(a2) {
        return bind5(read(subscribers))(traverse_1(function(k) {
          return k(a2);
        }));
      }
    };
  };

  // output/Halogen.Query.HalogenM/index.js
  var over2 = /* @__PURE__ */ over()();
  var SubscriptionId = function(x) {
    return x;
  };
  var ForkId = function(x) {
    return x;
  };
  var State = /* @__PURE__ */ function() {
    function State2(value0) {
      this.value0 = value0;
    }
    ;
    State2.create = function(value0) {
      return new State2(value0);
    };
    return State2;
  }();
  var Subscribe = /* @__PURE__ */ function() {
    function Subscribe2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Subscribe2.create = function(value0) {
      return function(value1) {
        return new Subscribe2(value0, value1);
      };
    };
    return Subscribe2;
  }();
  var Unsubscribe = /* @__PURE__ */ function() {
    function Unsubscribe2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Unsubscribe2.create = function(value0) {
      return function(value1) {
        return new Unsubscribe2(value0, value1);
      };
    };
    return Unsubscribe2;
  }();
  var Lift2 = /* @__PURE__ */ function() {
    function Lift3(value0) {
      this.value0 = value0;
    }
    ;
    Lift3.create = function(value0) {
      return new Lift3(value0);
    };
    return Lift3;
  }();
  var ChildQuery2 = /* @__PURE__ */ function() {
    function ChildQuery3(value0) {
      this.value0 = value0;
    }
    ;
    ChildQuery3.create = function(value0) {
      return new ChildQuery3(value0);
    };
    return ChildQuery3;
  }();
  var Raise = /* @__PURE__ */ function() {
    function Raise2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Raise2.create = function(value0) {
      return function(value1) {
        return new Raise2(value0, value1);
      };
    };
    return Raise2;
  }();
  var Par = /* @__PURE__ */ function() {
    function Par2(value0) {
      this.value0 = value0;
    }
    ;
    Par2.create = function(value0) {
      return new Par2(value0);
    };
    return Par2;
  }();
  var Fork = /* @__PURE__ */ function() {
    function Fork2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Fork2.create = function(value0) {
      return function(value1) {
        return new Fork2(value0, value1);
      };
    };
    return Fork2;
  }();
  var Join = /* @__PURE__ */ function() {
    function Join2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Join2.create = function(value0) {
      return function(value1) {
        return new Join2(value0, value1);
      };
    };
    return Join2;
  }();
  var Kill = /* @__PURE__ */ function() {
    function Kill2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Kill2.create = function(value0) {
      return function(value1) {
        return new Kill2(value0, value1);
      };
    };
    return Kill2;
  }();
  var GetRef = /* @__PURE__ */ function() {
    function GetRef2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    GetRef2.create = function(value0) {
      return function(value1) {
        return new GetRef2(value0, value1);
      };
    };
    return GetRef2;
  }();
  var HalogenAp = function(x) {
    return x;
  };
  var HalogenM = function(x) {
    return x;
  };
  var raise = function(o) {
    return liftF(new Raise(o, unit));
  };
  var ordSubscriptionId = ordInt;
  var ordForkId = ordInt;
  var monadTransHalogenM = {
    lift: function(dictMonad) {
      return function($180) {
        return HalogenM(liftF(Lift2.create($180)));
      };
    }
  };
  var monadHalogenM = freeMonad;
  var monadStateHalogenM = {
    state: function($181) {
      return HalogenM(liftF(State.create($181)));
    },
    Monad0: function() {
      return monadHalogenM;
    }
  };
  var monadEffectHalogenM = function(dictMonadEffect) {
    return {
      liftEffect: function() {
        var $186 = liftEffect(dictMonadEffect);
        return function($187) {
          return HalogenM(liftF(Lift2.create($186($187))));
        };
      }(),
      Monad0: function() {
        return monadHalogenM;
      }
    };
  };
  var monadAffHalogenM = function(dictMonadAff) {
    var monadEffectHalogenM1 = monadEffectHalogenM(dictMonadAff.MonadEffect0());
    return {
      liftAff: function() {
        var $188 = liftAff(dictMonadAff);
        return function($189) {
          return HalogenM(liftF(Lift2.create($188($189))));
        };
      }(),
      MonadEffect0: function() {
        return monadEffectHalogenM1;
      }
    };
  };
  var hoist = function(dictFunctor) {
    return function(nat) {
      return function(v) {
        var go2 = function(v1) {
          if (v1 instanceof State) {
            return new State(v1.value0);
          }
          ;
          if (v1 instanceof Subscribe) {
            return new Subscribe(v1.value0, v1.value1);
          }
          ;
          if (v1 instanceof Unsubscribe) {
            return new Unsubscribe(v1.value0, v1.value1);
          }
          ;
          if (v1 instanceof Lift2) {
            return new Lift2(nat(v1.value0));
          }
          ;
          if (v1 instanceof ChildQuery2) {
            return new ChildQuery2(v1.value0);
          }
          ;
          if (v1 instanceof Raise) {
            return new Raise(v1.value0, v1.value1);
          }
          ;
          if (v1 instanceof Par) {
            return new Par(over2(HalogenAp)(hoistFreeAp(hoist(dictFunctor)(nat)))(v1.value0));
          }
          ;
          if (v1 instanceof Fork) {
            return new Fork(hoist(dictFunctor)(nat)(v1.value0), v1.value1);
          }
          ;
          if (v1 instanceof Join) {
            return new Join(v1.value0, v1.value1);
          }
          ;
          if (v1 instanceof Kill) {
            return new Kill(v1.value0, v1.value1);
          }
          ;
          if (v1 instanceof GetRef) {
            return new GetRef(v1.value0, v1.value1);
          }
          ;
          throw new Error("Failed pattern match at Halogen.Query.HalogenM (line 312, column 8 - line 323, column 29): " + [v1.constructor.name]);
        };
        return hoistFree(go2)(v);
      };
    };
  };
  var functorHalogenM = freeFunctor;
  var bindHalogenM = freeBind;
  var applicativeHalogenM = freeApplicative;

  // output/Halogen.Query.HalogenQ/index.js
  var Initialize = /* @__PURE__ */ function() {
    function Initialize3(value0) {
      this.value0 = value0;
    }
    ;
    Initialize3.create = function(value0) {
      return new Initialize3(value0);
    };
    return Initialize3;
  }();
  var Finalize = /* @__PURE__ */ function() {
    function Finalize2(value0) {
      this.value0 = value0;
    }
    ;
    Finalize2.create = function(value0) {
      return new Finalize2(value0);
    };
    return Finalize2;
  }();
  var Receive = /* @__PURE__ */ function() {
    function Receive2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Receive2.create = function(value0) {
      return function(value1) {
        return new Receive2(value0, value1);
      };
    };
    return Receive2;
  }();
  var Action2 = /* @__PURE__ */ function() {
    function Action3(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Action3.create = function(value0) {
      return function(value1) {
        return new Action3(value0, value1);
      };
    };
    return Action3;
  }();
  var Query2 = /* @__PURE__ */ function() {
    function Query4(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Query4.create = function(value0) {
      return function(value1) {
        return new Query4(value0, value1);
      };
    };
    return Query4;
  }();

  // output/Halogen.VDom.Thunk/index.js
  var $runtime_lazy8 = function(name16, moduleName, init4) {
    var state3 = 0;
    var val;
    return function(lineNumber) {
      if (state3 === 2)
        return val;
      if (state3 === 1)
        throw new ReferenceError(name16 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
      state3 = 1;
      val = init4();
      state3 = 2;
      return val;
    };
  };
  var Thunk = /* @__PURE__ */ function() {
    function Thunk2(value0, value1, value22, value32) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
      this.value3 = value32;
    }
    ;
    Thunk2.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return function(value32) {
            return new Thunk2(value0, value1, value22, value32);
          };
        };
      };
    };
    return Thunk2;
  }();
  var unsafeEqThunk = function(v, v1) {
    return refEq2(v.value0, v1.value0) && (refEq2(v.value1, v1.value1) && v.value1(v.value3, v1.value3));
  };
  var runThunk = function(v) {
    return v.value2(v.value3);
  };
  var mapThunk = function(k) {
    return function(v) {
      return new Thunk(v.value0, v.value1, function($51) {
        return k(v.value2($51));
      }, v.value3);
    };
  };
  var hoist2 = mapThunk;
  var buildThunk = function(toVDom) {
    var haltThunk = function(state3) {
      return halt(state3.vdom);
    };
    var $lazy_patchThunk = $runtime_lazy8("patchThunk", "Halogen.VDom.Thunk", function() {
      return function(state3, t2) {
        var $48 = unsafeEqThunk(state3.thunk, t2);
        if ($48) {
          return mkStep(new Step2(extract2(state3.vdom), state3, $lazy_patchThunk(112), haltThunk));
        }
        ;
        var vdom = step3(state3.vdom, toVDom(runThunk(t2)));
        return mkStep(new Step2(extract2(vdom), {
          vdom,
          thunk: t2
        }, $lazy_patchThunk(115), haltThunk));
      };
    });
    var patchThunk = $lazy_patchThunk(108);
    var renderThunk = function(spec) {
      return function(t) {
        var vdom = buildVDom(spec)(toVDom(runThunk(t)));
        return mkStep(new Step2(extract2(vdom), {
          thunk: t,
          vdom
        }, patchThunk, haltThunk));
      };
    };
    return renderThunk;
  };

  // output/Halogen.Component/index.js
  var voidLeft2 = /* @__PURE__ */ voidLeft(functorHalogenM);
  var traverse_3 = /* @__PURE__ */ traverse_(applicativeHalogenM)(foldableMaybe);
  var map27 = /* @__PURE__ */ map(functorHalogenM);
  var lmap2 = /* @__PURE__ */ lmap(bifunctorHTML);
  var pure9 = /* @__PURE__ */ pure(applicativeHalogenM);
  var lookup5 = /* @__PURE__ */ lookup3();
  var pop3 = /* @__PURE__ */ pop2();
  var insert6 = /* @__PURE__ */ insert4();
  var ComponentSlot = /* @__PURE__ */ function() {
    function ComponentSlot2(value0) {
      this.value0 = value0;
    }
    ;
    ComponentSlot2.create = function(value0) {
      return new ComponentSlot2(value0);
    };
    return ComponentSlot2;
  }();
  var ThunkSlot = /* @__PURE__ */ function() {
    function ThunkSlot2(value0) {
      this.value0 = value0;
    }
    ;
    ThunkSlot2.create = function(value0) {
      return new ThunkSlot2(value0);
    };
    return ThunkSlot2;
  }();
  var unComponentSlot = unsafeCoerce2;
  var unComponent = unsafeCoerce2;
  var mkEval = function(args) {
    return function(v) {
      if (v instanceof Initialize) {
        return voidLeft2(traverse_3(args.handleAction)(args.initialize))(v.value0);
      }
      ;
      if (v instanceof Finalize) {
        return voidLeft2(traverse_3(args.handleAction)(args.finalize))(v.value0);
      }
      ;
      if (v instanceof Receive) {
        return voidLeft2(traverse_3(args.handleAction)(args.receive(v.value0)))(v.value1);
      }
      ;
      if (v instanceof Action2) {
        return voidLeft2(args.handleAction(v.value0))(v.value1);
      }
      ;
      if (v instanceof Query2) {
        return unCoyoneda(function(g) {
          var $45 = map27(maybe(v.value1(unit))(g));
          return function($46) {
            return $45(args.handleQuery($46));
          };
        })(v.value0);
      }
      ;
      throw new Error("Failed pattern match at Halogen.Component (line 182, column 15 - line 192, column 71): " + [v.constructor.name]);
    };
  };
  var mkComponentSlot = unsafeCoerce2;
  var mkComponent = unsafeCoerce2;
  var hoistSlot = function(dictFunctor) {
    return function(nat) {
      return function(v) {
        if (v instanceof ComponentSlot) {
          return unComponentSlot(function(slot5) {
            return new ComponentSlot(mkComponentSlot({
              get: slot5.get,
              pop: slot5.pop,
              set: slot5.set,
              component: hoist3(dictFunctor)(nat)(slot5.component),
              input: slot5.input,
              output: slot5.output
            }));
          })(v.value0);
        }
        ;
        if (v instanceof ThunkSlot) {
          return new ThunkSlot(hoist2(lmap2(hoistSlot(dictFunctor)(nat)))(v.value0));
        }
        ;
        throw new Error("Failed pattern match at Halogen.Component (line 279, column 17 - line 284, column 53): " + [v.constructor.name]);
      };
    };
  };
  var hoist3 = function(dictFunctor) {
    var hoist1 = hoist(dictFunctor);
    return function(nat) {
      return unComponent(function(c) {
        return mkComponent({
          initialState: c.initialState,
          render: function() {
            var $47 = lmap2(hoistSlot(dictFunctor)(nat));
            return function($48) {
              return $47(c.render($48));
            };
          }(),
          "eval": function() {
            var $49 = hoist1(nat);
            return function($50) {
              return $49(c["eval"]($50));
            };
          }()
        });
      });
    };
  };
  var defaultEval = /* @__PURE__ */ function() {
    return {
      handleAction: $$const(pure9(unit)),
      handleQuery: $$const(pure9(Nothing.value)),
      receive: $$const(Nothing.value),
      initialize: Nothing.value,
      finalize: Nothing.value
    };
  }();
  var componentSlot = function() {
    return function(dictIsSymbol) {
      var lookup13 = lookup5(dictIsSymbol);
      var pop12 = pop3(dictIsSymbol);
      var insert13 = insert6(dictIsSymbol);
      return function(dictOrd) {
        var lookup23 = lookup13(dictOrd);
        var pop22 = pop12(dictOrd);
        var insert22 = insert13(dictOrd);
        return function(label5) {
          return function(p2) {
            return function(comp) {
              return function(input3) {
                return function(output2) {
                  return mkComponentSlot({
                    get: lookup23(label5)(p2),
                    pop: pop22(label5)(p2),
                    set: insert22(label5)(p2),
                    component: comp,
                    input: input3,
                    output: output2
                  });
                };
              };
            };
          };
        };
      };
    };
  };

  // output/Halogen.Query/index.js
  var mkTell = function(act) {
    return act(unit);
  };

  // output/Control.Monad.Fork.Class/index.js
  var monadForkAff = {
    suspend: suspendAff,
    fork: forkAff,
    join: joinFiber,
    Monad0: function() {
      return monadAff;
    },
    Functor1: function() {
      return functorFiber;
    }
  };
  var fork2 = function(dict) {
    return dict.fork;
  };

  // output/Effect.Console/foreign.js
  var log2 = function(s) {
    return function() {
      console.log(s);
    };
  };
  var warn = function(s) {
    return function() {
      console.warn(s);
    };
  };

  // output/Halogen.HTML.Elements/index.js
  var element2 = /* @__PURE__ */ function() {
    return element(Nothing.value);
  }();
  var h1 = /* @__PURE__ */ element2("h1");
  var input2 = function(props) {
    return element2("input")(props)([]);
  };
  var label4 = /* @__PURE__ */ element2("label");
  var li = /* @__PURE__ */ element2("li");
  var li_ = /* @__PURE__ */ li([]);
  var span4 = /* @__PURE__ */ element2("span");
  var ul = /* @__PURE__ */ element2("ul");
  var div3 = /* @__PURE__ */ element2("div");
  var div_ = /* @__PURE__ */ div3([]);
  var canvas = function(props) {
    return element2("canvas")(props)([]);
  };
  var button = /* @__PURE__ */ element2("button");
  var a = /* @__PURE__ */ element2("a");

  // output/Halogen.HTML.Properties/index.js
  var unwrap3 = /* @__PURE__ */ unwrap();
  var prop2 = function(dictIsProp) {
    return prop(dictIsProp);
  };
  var prop1 = /* @__PURE__ */ prop2(isPropBoolean);
  var prop22 = /* @__PURE__ */ prop2(isPropString);
  var prop3 = /* @__PURE__ */ prop2(isPropInt);
  var prop4 = /* @__PURE__ */ prop2(isPropNumber);
  var step4 = /* @__PURE__ */ prop2(isPropStepValue)("step");
  var type_17 = function(dictIsProp) {
    return prop2(dictIsProp)("type");
  };
  var value12 = function(dictIsProp) {
    return prop2(dictIsProp)("value");
  };
  var width8 = /* @__PURE__ */ prop3("width");
  var min5 = /* @__PURE__ */ prop4("min");
  var max6 = /* @__PURE__ */ prop4("max");
  var id2 = /* @__PURE__ */ prop22("id");
  var href4 = /* @__PURE__ */ prop22("href");
  var height8 = /* @__PURE__ */ prop3("height");
  var $$for = /* @__PURE__ */ prop22("htmlFor");
  var disabled10 = /* @__PURE__ */ prop1("disabled");
  var enabled = /* @__PURE__ */ function() {
    var $30 = not(heytingAlgebraBoolean);
    return function($31) {
      return disabled10($30($31));
    };
  }();
  var class_ = /* @__PURE__ */ function() {
    var $36 = prop22("className");
    return function($37) {
      return $36(unwrap3($37));
    };
  }();
  var attr2 = /* @__PURE__ */ function() {
    return attr(Nothing.value);
  }();
  var accept2 = /* @__PURE__ */ prop2(isPropInputAcceptType)("accept");

  // output/Halogen.HTML/index.js
  var componentSlot2 = /* @__PURE__ */ componentSlot();
  var slot_ = function() {
    return function(dictIsSymbol) {
      var componentSlot1 = componentSlot2(dictIsSymbol);
      return function(dictOrd) {
        var componentSlot22 = componentSlot1(dictOrd);
        return function(label5) {
          return function(p2) {
            return function(component8) {
              return function(input3) {
                return widget(new ComponentSlot(componentSlot22(label5)(p2)(component8)(input3)($$const(Nothing.value))));
              };
            };
          };
        };
      };
    };
  };
  var slot = function() {
    return function(dictIsSymbol) {
      var componentSlot1 = componentSlot2(dictIsSymbol);
      return function(dictOrd) {
        var componentSlot22 = componentSlot1(dictOrd);
        return function(label5) {
          return function(p2) {
            return function(component8) {
              return function(input3) {
                return function(outputQuery) {
                  return widget(new ComponentSlot(componentSlot22(label5)(p2)(component8)(input3)(function($11) {
                    return Just.create(outputQuery($11));
                  })));
                };
              };
            };
          };
        };
      };
    };
  };

  // output/Halogen.Aff.Driver.State/index.js
  var unRenderStateX = unsafeCoerce2;
  var unDriverStateX = unsafeCoerce2;
  var renderStateX_ = function(dictApplicative) {
    var traverse_7 = traverse_(dictApplicative)(foldableMaybe);
    return function(f) {
      return unDriverStateX(function(st) {
        return traverse_7(f)(st.rendering);
      });
    };
  };
  var mkRenderStateX = unsafeCoerce2;
  var renderStateX = function(dictFunctor) {
    return function(f) {
      return unDriverStateX(function(st) {
        return mkRenderStateX(f(st.rendering));
      });
    };
  };
  var mkDriverStateXRef = unsafeCoerce2;
  var mapDriverState = function(f) {
    return function(v) {
      return f(v);
    };
  };
  var initDriverState = function(component8) {
    return function(input3) {
      return function(handler3) {
        return function(lchs) {
          return function __do2() {
            var selfRef = $$new({})();
            var childrenIn = $$new(empty3)();
            var childrenOut = $$new(empty3)();
            var handlerRef = $$new(handler3)();
            var pendingQueries = $$new(new Just(Nil.value))();
            var pendingOuts = $$new(new Just(Nil.value))();
            var pendingHandlers = $$new(Nothing.value)();
            var fresh2 = $$new(1)();
            var subscriptions = $$new(new Just(empty2))();
            var forks = $$new(empty2)();
            var ds = {
              component: component8,
              state: component8.initialState(input3),
              refs: empty2,
              children: empty3,
              childrenIn,
              childrenOut,
              selfRef,
              handlerRef,
              pendingQueries,
              pendingOuts,
              pendingHandlers,
              rendering: Nothing.value,
              fresh: fresh2,
              subscriptions,
              forks,
              lifecycleHandlers: lchs
            };
            write(ds)(selfRef)();
            return mkDriverStateXRef(selfRef);
          };
        };
      };
    };
  };

  // output/Halogen.Aff.Driver.Eval/index.js
  var traverse_4 = /* @__PURE__ */ traverse_(applicativeEffect)(foldableMaybe);
  var bindFlipped6 = /* @__PURE__ */ bindFlipped(bindMaybe);
  var lookup6 = /* @__PURE__ */ lookup2(ordSubscriptionId);
  var bind12 = /* @__PURE__ */ bind(bindAff);
  var liftEffect4 = /* @__PURE__ */ liftEffect(monadEffectAff);
  var discard3 = /* @__PURE__ */ discard(discardUnit);
  var discard1 = /* @__PURE__ */ discard3(bindAff);
  var traverse_12 = /* @__PURE__ */ traverse_(applicativeAff);
  var traverse_22 = /* @__PURE__ */ traverse_12(foldableList);
  var fork3 = /* @__PURE__ */ fork2(monadForkAff);
  var parSequence_2 = /* @__PURE__ */ parSequence_(parallelAff)(foldableList);
  var pure10 = /* @__PURE__ */ pure(applicativeAff);
  var map29 = /* @__PURE__ */ map(functorCoyoneda);
  var parallel2 = /* @__PURE__ */ parallel(parallelAff);
  var map113 = /* @__PURE__ */ map(functorAff);
  var sequential2 = /* @__PURE__ */ sequential(parallelAff);
  var map210 = /* @__PURE__ */ map(functorMaybe);
  var insert7 = /* @__PURE__ */ insert3(ordSubscriptionId);
  var retractFreeAp2 = /* @__PURE__ */ retractFreeAp(applicativeParAff);
  var $$delete3 = /* @__PURE__ */ $$delete2(ordForkId);
  var unlessM2 = /* @__PURE__ */ unlessM(monadEffect);
  var insert12 = /* @__PURE__ */ insert3(ordForkId);
  var traverse_32 = /* @__PURE__ */ traverse_12(foldableMaybe);
  var lookup12 = /* @__PURE__ */ lookup2(ordForkId);
  var lookup22 = /* @__PURE__ */ lookup2(ordString);
  var foldFree2 = /* @__PURE__ */ foldFree(monadRecAff);
  var alter2 = /* @__PURE__ */ alter(ordString);
  var unsubscribe3 = function(sid) {
    return function(ref2) {
      return function __do2() {
        var v = read(ref2)();
        var subs = read(v.subscriptions)();
        return traverse_4(unsubscribe)(bindFlipped6(lookup6(sid))(subs))();
      };
    };
  };
  var queueOrRun = function(ref2) {
    return function(au) {
      return bind12(liftEffect4(read(ref2)))(function(v) {
        if (v instanceof Nothing) {
          return au;
        }
        ;
        if (v instanceof Just) {
          return liftEffect4(write(new Just(new Cons(au, v.value0)))(ref2));
        }
        ;
        throw new Error("Failed pattern match at Halogen.Aff.Driver.Eval (line 188, column 33 - line 190, column 57): " + [v.constructor.name]);
      });
    };
  };
  var handleLifecycle = function(lchs) {
    return function(f) {
      return discard1(liftEffect4(write({
        initializers: Nil.value,
        finalizers: Nil.value
      })(lchs)))(function() {
        return bind12(liftEffect4(f))(function(result) {
          return bind12(liftEffect4(read(lchs)))(function(v) {
            return discard1(traverse_22(fork3)(v.finalizers))(function() {
              return discard1(parSequence_2(v.initializers))(function() {
                return pure10(result);
              });
            });
          });
        });
      });
    };
  };
  var handleAff = /* @__PURE__ */ runAff_(/* @__PURE__ */ either(throwException)(/* @__PURE__ */ $$const(/* @__PURE__ */ pure(applicativeEffect)(unit))));
  var fresh = function(f) {
    return function(ref2) {
      return bind12(liftEffect4(read(ref2)))(function(v) {
        return liftEffect4(modify$prime(function(i2) {
          return {
            state: i2 + 1 | 0,
            value: f(i2)
          };
        })(v.fresh));
      });
    };
  };
  var evalQ = function(render3) {
    return function(ref2) {
      return function(q2) {
        return bind12(liftEffect4(read(ref2)))(function(v) {
          return evalM(render3)(ref2)(v["component"]["eval"](new Query2(map29(Just.create)(liftCoyoneda(q2)), $$const(Nothing.value))));
        });
      };
    };
  };
  var evalM = function(render3) {
    return function(initRef) {
      return function(v) {
        var evalChildQuery = function(ref2) {
          return function(cqb) {
            return bind12(liftEffect4(read(ref2)))(function(v1) {
              return unChildQueryBox(function(v2) {
                var evalChild = function(v3) {
                  return parallel2(bind12(liftEffect4(read(v3)))(function(dsx) {
                    return unDriverStateX(function(ds) {
                      return evalQ(render3)(ds.selfRef)(v2.value1);
                    })(dsx);
                  }));
                };
                return map113(v2.value2)(sequential2(v2.value0(applicativeParAff)(evalChild)(v1.children)));
              })(cqb);
            });
          };
        };
        var go2 = function(ref2) {
          return function(v1) {
            if (v1 instanceof State) {
              return bind12(liftEffect4(read(ref2)))(function(v2) {
                var v3 = v1.value0(v2.state);
                if (unsafeRefEq(v2.state)(v3.value1)) {
                  return pure10(v3.value0);
                }
                ;
                if (otherwise) {
                  return discard1(liftEffect4(write({
                    component: v2.component,
                    state: v3.value1,
                    refs: v2.refs,
                    children: v2.children,
                    childrenIn: v2.childrenIn,
                    childrenOut: v2.childrenOut,
                    selfRef: v2.selfRef,
                    handlerRef: v2.handlerRef,
                    pendingQueries: v2.pendingQueries,
                    pendingOuts: v2.pendingOuts,
                    pendingHandlers: v2.pendingHandlers,
                    rendering: v2.rendering,
                    fresh: v2.fresh,
                    subscriptions: v2.subscriptions,
                    forks: v2.forks,
                    lifecycleHandlers: v2.lifecycleHandlers
                  })(ref2)))(function() {
                    return discard1(handleLifecycle(v2.lifecycleHandlers)(render3(v2.lifecycleHandlers)(ref2)))(function() {
                      return pure10(v3.value0);
                    });
                  });
                }
                ;
                throw new Error("Failed pattern match at Halogen.Aff.Driver.Eval (line 86, column 7 - line 92, column 21): " + [v3.constructor.name]);
              });
            }
            ;
            if (v1 instanceof Subscribe) {
              return bind12(fresh(SubscriptionId)(ref2))(function(sid) {
                return bind12(liftEffect4(subscribe(v1.value0(sid))(function(act) {
                  return handleAff(evalF(render3)(ref2)(new Action(act)));
                })))(function(finalize) {
                  return bind12(liftEffect4(read(ref2)))(function(v2) {
                    return discard1(liftEffect4(modify_(map210(insert7(sid)(finalize)))(v2.subscriptions)))(function() {
                      return pure10(v1.value1(sid));
                    });
                  });
                });
              });
            }
            ;
            if (v1 instanceof Unsubscribe) {
              return discard1(liftEffect4(unsubscribe3(v1.value0)(ref2)))(function() {
                return pure10(v1.value1);
              });
            }
            ;
            if (v1 instanceof Lift2) {
              return v1.value0;
            }
            ;
            if (v1 instanceof ChildQuery2) {
              return evalChildQuery(ref2)(v1.value0);
            }
            ;
            if (v1 instanceof Raise) {
              return bind12(liftEffect4(read(ref2)))(function(v2) {
                return bind12(liftEffect4(read(v2.handlerRef)))(function(handler3) {
                  return discard1(queueOrRun(v2.pendingOuts)(handler3(v1.value0)))(function() {
                    return pure10(v1.value1);
                  });
                });
              });
            }
            ;
            if (v1 instanceof Par) {
              return sequential2(retractFreeAp2(hoistFreeAp(function() {
                var $118 = evalM(render3)(ref2);
                return function($119) {
                  return parallel2($118($119));
                };
              }())(v1.value0)));
            }
            ;
            if (v1 instanceof Fork) {
              return bind12(fresh(ForkId)(ref2))(function(fid) {
                return bind12(liftEffect4(read(ref2)))(function(v2) {
                  return bind12(liftEffect4($$new(false)))(function(doneRef) {
                    return bind12(fork3($$finally(liftEffect4(function __do2() {
                      modify_($$delete3(fid))(v2.forks)();
                      return write(true)(doneRef)();
                    }))(evalM(render3)(ref2)(v1.value0))))(function(fiber) {
                      return discard1(liftEffect4(unlessM2(read(doneRef))(modify_(insert12(fid)(fiber))(v2.forks))))(function() {
                        return pure10(v1.value1(fid));
                      });
                    });
                  });
                });
              });
            }
            ;
            if (v1 instanceof Join) {
              return bind12(liftEffect4(read(ref2)))(function(v2) {
                return bind12(liftEffect4(read(v2.forks)))(function(forkMap) {
                  return discard1(traverse_32(joinFiber)(lookup12(v1.value0)(forkMap)))(function() {
                    return pure10(v1.value1);
                  });
                });
              });
            }
            ;
            if (v1 instanceof Kill) {
              return bind12(liftEffect4(read(ref2)))(function(v2) {
                return bind12(liftEffect4(read(v2.forks)))(function(forkMap) {
                  return discard1(traverse_32(killFiber(error("Cancelled")))(lookup12(v1.value0)(forkMap)))(function() {
                    return pure10(v1.value1);
                  });
                });
              });
            }
            ;
            if (v1 instanceof GetRef) {
              return bind12(liftEffect4(read(ref2)))(function(v2) {
                return pure10(v1.value1(lookup22(v1.value0)(v2.refs)));
              });
            }
            ;
            throw new Error("Failed pattern match at Halogen.Aff.Driver.Eval (line 83, column 12 - line 139, column 33): " + [v1.constructor.name]);
          };
        };
        return foldFree2(go2(initRef))(v);
      };
    };
  };
  var evalF = function(render3) {
    return function(ref2) {
      return function(v) {
        if (v instanceof RefUpdate) {
          return liftEffect4(flip(modify_)(ref2)(mapDriverState(function(st) {
            return {
              component: st.component,
              state: st.state,
              refs: alter2($$const(v.value1))(v.value0)(st.refs),
              children: st.children,
              childrenIn: st.childrenIn,
              childrenOut: st.childrenOut,
              selfRef: st.selfRef,
              handlerRef: st.handlerRef,
              pendingQueries: st.pendingQueries,
              pendingOuts: st.pendingOuts,
              pendingHandlers: st.pendingHandlers,
              rendering: st.rendering,
              fresh: st.fresh,
              subscriptions: st.subscriptions,
              forks: st.forks,
              lifecycleHandlers: st.lifecycleHandlers
            };
          })));
        }
        ;
        if (v instanceof Action) {
          return bind12(liftEffect4(read(ref2)))(function(v1) {
            return evalM(render3)(ref2)(v1["component"]["eval"](new Action2(v.value0, unit)));
          });
        }
        ;
        throw new Error("Failed pattern match at Halogen.Aff.Driver.Eval (line 52, column 20 - line 58, column 62): " + [v.constructor.name]);
      };
    };
  };

  // output/Halogen.Aff.Driver/index.js
  var bind6 = /* @__PURE__ */ bind(bindEffect);
  var discard4 = /* @__PURE__ */ discard(discardUnit);
  var for_2 = /* @__PURE__ */ for_(applicativeEffect)(foldableMaybe);
  var traverse_5 = /* @__PURE__ */ traverse_(applicativeAff)(foldableList);
  var fork4 = /* @__PURE__ */ fork2(monadForkAff);
  var bindFlipped7 = /* @__PURE__ */ bindFlipped(bindEffect);
  var traverse_13 = /* @__PURE__ */ traverse_(applicativeEffect);
  var traverse_23 = /* @__PURE__ */ traverse_13(foldableMaybe);
  var traverse_33 = /* @__PURE__ */ traverse_13(foldableMap);
  var discard22 = /* @__PURE__ */ discard4(bindAff);
  var parSequence_3 = /* @__PURE__ */ parSequence_(parallelAff)(foldableList);
  var liftEffect5 = /* @__PURE__ */ liftEffect(monadEffectAff);
  var pure11 = /* @__PURE__ */ pure(applicativeEffect);
  var map30 = /* @__PURE__ */ map(functorEffect);
  var pure12 = /* @__PURE__ */ pure(applicativeAff);
  var when2 = /* @__PURE__ */ when(applicativeEffect);
  var renderStateX2 = /* @__PURE__ */ renderStateX(functorEffect);
  var $$void6 = /* @__PURE__ */ $$void(functorAff);
  var foreachSlot2 = /* @__PURE__ */ foreachSlot(applicativeEffect);
  var renderStateX_2 = /* @__PURE__ */ renderStateX_(applicativeEffect);
  var tailRecM3 = /* @__PURE__ */ tailRecM(monadRecEffect);
  var voidLeft3 = /* @__PURE__ */ voidLeft(functorEffect);
  var bind13 = /* @__PURE__ */ bind(bindAff);
  var liftEffect1 = /* @__PURE__ */ liftEffect(monadEffectEffect);
  var newLifecycleHandlers = /* @__PURE__ */ function() {
    return $$new({
      initializers: Nil.value,
      finalizers: Nil.value
    });
  }();
  var handlePending = function(ref2) {
    return function __do2() {
      var queue = read(ref2)();
      write(Nothing.value)(ref2)();
      return for_2(queue)(function() {
        var $58 = traverse_5(fork4);
        return function($59) {
          return handleAff($58(reverse2($59)));
        };
      }())();
    };
  };
  var cleanupSubscriptionsAndForks = function(v) {
    return function __do2() {
      bindFlipped7(traverse_23(traverse_33(unsubscribe)))(read(v.subscriptions))();
      write(Nothing.value)(v.subscriptions)();
      bindFlipped7(traverse_33(function() {
        var $60 = killFiber(error("finalized"));
        return function($61) {
          return handleAff($60($61));
        };
      }()))(read(v.forks))();
      return write(empty2)(v.forks)();
    };
  };
  var runUI = function(renderSpec2) {
    return function(component8) {
      return function(i2) {
        var squashChildInitializers = function(lchs) {
          return function(preInits) {
            return unDriverStateX(function(st) {
              var parentInitializer = evalM(render3)(st.selfRef)(st["component"]["eval"](new Initialize(unit)));
              return modify_(function(handlers) {
                return {
                  initializers: new Cons(discard22(parSequence_3(reverse2(handlers.initializers)))(function() {
                    return discard22(parentInitializer)(function() {
                      return liftEffect5(function __do2() {
                        handlePending(st.pendingQueries)();
                        return handlePending(st.pendingOuts)();
                      });
                    });
                  }), preInits),
                  finalizers: handlers.finalizers
                };
              })(lchs);
            });
          };
        };
        var runComponent = function(lchs) {
          return function(handler3) {
            return function(j) {
              return unComponent(function(c) {
                return function __do2() {
                  var lchs$prime = newLifecycleHandlers();
                  var $$var2 = initDriverState(c)(j)(handler3)(lchs$prime)();
                  var pre2 = read(lchs)();
                  write({
                    initializers: Nil.value,
                    finalizers: pre2.finalizers
                  })(lchs)();
                  bindFlipped7(unDriverStateX(function() {
                    var $62 = render3(lchs);
                    return function($63) {
                      return $62(function(v) {
                        return v.selfRef;
                      }($63));
                    };
                  }()))(read($$var2))();
                  bindFlipped7(squashChildInitializers(lchs)(pre2.initializers))(read($$var2))();
                  return $$var2;
                };
              });
            };
          };
        };
        var renderChild = function(lchs) {
          return function(handler3) {
            return function(childrenInRef) {
              return function(childrenOutRef) {
                return unComponentSlot(function(slot5) {
                  return function __do2() {
                    var childrenIn = map30(slot5.pop)(read(childrenInRef))();
                    var $$var2 = function() {
                      if (childrenIn instanceof Just) {
                        write(childrenIn.value0.value1)(childrenInRef)();
                        var dsx = read(childrenIn.value0.value0)();
                        unDriverStateX(function(st) {
                          return function __do3() {
                            flip(write)(st.handlerRef)(function() {
                              var $64 = maybe(pure12(unit))(handler3);
                              return function($65) {
                                return $64(slot5.output($65));
                              };
                            }())();
                            return handleAff(evalM(render3)(st.selfRef)(st["component"]["eval"](new Receive(slot5.input, unit))))();
                          };
                        })(dsx)();
                        return childrenIn.value0.value0;
                      }
                      ;
                      if (childrenIn instanceof Nothing) {
                        return runComponent(lchs)(function() {
                          var $66 = maybe(pure12(unit))(handler3);
                          return function($67) {
                            return $66(slot5.output($67));
                          };
                        }())(slot5.input)(slot5.component)();
                      }
                      ;
                      throw new Error("Failed pattern match at Halogen.Aff.Driver (line 213, column 14 - line 222, column 98): " + [childrenIn.constructor.name]);
                    }();
                    var isDuplicate = map30(function($68) {
                      return isJust(slot5.get($68));
                    })(read(childrenOutRef))();
                    when2(isDuplicate)(warn("Halogen: Duplicate slot address was detected during rendering, unexpected results may occur"))();
                    modify_(slot5.set($$var2))(childrenOutRef)();
                    return bind6(read($$var2))(renderStateX2(function(v) {
                      if (v instanceof Nothing) {
                        return $$throw("Halogen internal error: child was not initialized in renderChild");
                      }
                      ;
                      if (v instanceof Just) {
                        return pure11(renderSpec2.renderChild(v.value0));
                      }
                      ;
                      throw new Error("Failed pattern match at Halogen.Aff.Driver (line 227, column 37 - line 229, column 50): " + [v.constructor.name]);
                    }))();
                  };
                });
              };
            };
          };
        };
        var render3 = function(lchs) {
          return function($$var2) {
            return function __do2() {
              var v = read($$var2)();
              var shouldProcessHandlers = map30(isNothing)(read(v.pendingHandlers))();
              when2(shouldProcessHandlers)(write(new Just(Nil.value))(v.pendingHandlers))();
              write(empty3)(v.childrenOut)();
              write(v.children)(v.childrenIn)();
              var handler3 = function() {
                var $69 = queueOrRun(v.pendingHandlers);
                var $70 = evalF(render3)(v.selfRef);
                return function($71) {
                  return $69($$void6($70($71)));
                };
              }();
              var childHandler = function() {
                var $72 = queueOrRun(v.pendingQueries);
                return function($73) {
                  return $72(handler3(Action.create($73)));
                };
              }();
              var rendering = renderSpec2.render(function($74) {
                return handleAff(handler3($74));
              })(renderChild(lchs)(childHandler)(v.childrenIn)(v.childrenOut))(v.component.render(v.state))(v.rendering)();
              var children2 = read(v.childrenOut)();
              var childrenIn = read(v.childrenIn)();
              foreachSlot2(childrenIn)(function(v1) {
                return function __do3() {
                  var childDS = read(v1)();
                  renderStateX_2(renderSpec2.removeChild)(childDS)();
                  return finalize(lchs)(childDS)();
                };
              })();
              flip(modify_)(v.selfRef)(mapDriverState(function(ds$prime) {
                return {
                  component: ds$prime.component,
                  state: ds$prime.state,
                  refs: ds$prime.refs,
                  children: children2,
                  childrenIn: ds$prime.childrenIn,
                  childrenOut: ds$prime.childrenOut,
                  selfRef: ds$prime.selfRef,
                  handlerRef: ds$prime.handlerRef,
                  pendingQueries: ds$prime.pendingQueries,
                  pendingOuts: ds$prime.pendingOuts,
                  pendingHandlers: ds$prime.pendingHandlers,
                  rendering: new Just(rendering),
                  fresh: ds$prime.fresh,
                  subscriptions: ds$prime.subscriptions,
                  forks: ds$prime.forks,
                  lifecycleHandlers: ds$prime.lifecycleHandlers
                };
              }))();
              return when2(shouldProcessHandlers)(flip(tailRecM3)(unit)(function(v1) {
                return function __do3() {
                  var handlers = read(v.pendingHandlers)();
                  write(new Just(Nil.value))(v.pendingHandlers)();
                  traverse_23(function() {
                    var $75 = traverse_5(fork4);
                    return function($76) {
                      return handleAff($75(reverse2($76)));
                    };
                  }())(handlers)();
                  var mmore = read(v.pendingHandlers)();
                  var $51 = maybe(false)($$null2)(mmore);
                  if ($51) {
                    return voidLeft3(write(Nothing.value)(v.pendingHandlers))(new Done(unit))();
                  }
                  ;
                  return new Loop(unit);
                };
              }))();
            };
          };
        };
        var finalize = function(lchs) {
          return unDriverStateX(function(st) {
            return function __do2() {
              cleanupSubscriptionsAndForks(st)();
              var f = evalM(render3)(st.selfRef)(st["component"]["eval"](new Finalize(unit)));
              modify_(function(handlers) {
                return {
                  initializers: handlers.initializers,
                  finalizers: new Cons(f, handlers.finalizers)
                };
              })(lchs)();
              return foreachSlot2(st.children)(function(v) {
                return function __do3() {
                  var dsx = read(v)();
                  return finalize(lchs)(dsx)();
                };
              })();
            };
          });
        };
        var evalDriver = function(disposed) {
          return function(ref2) {
            return function(q2) {
              return bind13(liftEffect5(read(disposed)))(function(v) {
                if (v) {
                  return pure12(Nothing.value);
                }
                ;
                return evalQ(render3)(ref2)(q2);
              });
            };
          };
        };
        var dispose = function(disposed) {
          return function(lchs) {
            return function(dsx) {
              return handleLifecycle(lchs)(function __do2() {
                var v = read(disposed)();
                if (v) {
                  return unit;
                }
                ;
                write(true)(disposed)();
                finalize(lchs)(dsx)();
                return unDriverStateX(function(v1) {
                  return function __do3() {
                    var v2 = liftEffect1(read(v1.selfRef))();
                    return for_2(v2.rendering)(renderSpec2.dispose)();
                  };
                })(dsx)();
              });
            };
          };
        };
        return bind13(liftEffect5(newLifecycleHandlers))(function(lchs) {
          return bind13(liftEffect5($$new(false)))(function(disposed) {
            return handleLifecycle(lchs)(function __do2() {
              var sio = create3();
              var dsx = bindFlipped7(read)(runComponent(lchs)(function() {
                var $77 = notify(sio.listener);
                return function($78) {
                  return liftEffect5($77($78));
                };
              }())(i2)(component8))();
              return unDriverStateX(function(st) {
                return pure11({
                  query: evalDriver(disposed)(st.selfRef),
                  messages: sio.emitter,
                  dispose: dispose(disposed)(lchs)(dsx)
                });
              })(dsx)();
            });
          });
        });
      };
    };
  };

  // output/Web.DOM.Node/foreign.js
  var getEffProp2 = function(name16) {
    return function(node) {
      return function() {
        return node[name16];
      };
    };
  };
  var baseURI = getEffProp2("baseURI");
  var _ownerDocument = getEffProp2("ownerDocument");
  var _parentNode = getEffProp2("parentNode");
  var _parentElement = getEffProp2("parentElement");
  var childNodes = getEffProp2("childNodes");
  var _firstChild = getEffProp2("firstChild");
  var _lastChild = getEffProp2("lastChild");
  var _previousSibling = getEffProp2("previousSibling");
  var _nextSibling = getEffProp2("nextSibling");
  var _nodeValue = getEffProp2("nodeValue");
  var textContent = getEffProp2("textContent");
  function insertBefore(node1) {
    return function(node2) {
      return function(parent2) {
        return function() {
          parent2.insertBefore(node1, node2);
        };
      };
    };
  }
  function appendChild(node) {
    return function(parent2) {
      return function() {
        parent2.appendChild(node);
      };
    };
  }
  function removeChild2(node) {
    return function(parent2) {
      return function() {
        parent2.removeChild(node);
      };
    };
  }

  // output/Web.DOM.Node/index.js
  var map31 = /* @__PURE__ */ map(functorEffect);
  var parentNode2 = /* @__PURE__ */ function() {
    var $6 = map31(toMaybe);
    return function($7) {
      return $6(_parentNode($7));
    };
  }();
  var nextSibling = /* @__PURE__ */ function() {
    var $15 = map31(toMaybe);
    return function($16) {
      return $15(_nextSibling($16));
    };
  }();

  // output/Halogen.VDom.Driver/index.js
  var $runtime_lazy9 = function(name16, moduleName, init4) {
    var state3 = 0;
    var val;
    return function(lineNumber) {
      if (state3 === 2)
        return val;
      if (state3 === 1)
        throw new ReferenceError(name16 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
      state3 = 1;
      val = init4();
      state3 = 2;
      return val;
    };
  };
  var $$void7 = /* @__PURE__ */ $$void(functorEffect);
  var pure13 = /* @__PURE__ */ pure(applicativeEffect);
  var traverse_6 = /* @__PURE__ */ traverse_(applicativeEffect)(foldableMaybe);
  var unwrap4 = /* @__PURE__ */ unwrap();
  var when3 = /* @__PURE__ */ when(applicativeEffect);
  var not2 = /* @__PURE__ */ not(/* @__PURE__ */ heytingAlgebraFunction(/* @__PURE__ */ heytingAlgebraFunction(heytingAlgebraBoolean)));
  var identity14 = /* @__PURE__ */ identity(categoryFn);
  var bind14 = /* @__PURE__ */ bind(bindAff);
  var liftEffect6 = /* @__PURE__ */ liftEffect(monadEffectAff);
  var map33 = /* @__PURE__ */ map(functorEffect);
  var bindFlipped8 = /* @__PURE__ */ bindFlipped(bindEffect);
  var substInParent = function(v) {
    return function(v1) {
      return function(v2) {
        if (v1 instanceof Just && v2 instanceof Just) {
          return $$void7(insertBefore(v)(v1.value0)(v2.value0));
        }
        ;
        if (v1 instanceof Nothing && v2 instanceof Just) {
          return $$void7(appendChild(v)(v2.value0));
        }
        ;
        return pure13(unit);
      };
    };
  };
  var removeChild3 = function(v) {
    return function __do2() {
      var npn = parentNode2(v.node)();
      return traverse_6(function(pn) {
        return removeChild2(v.node)(pn);
      })(npn)();
    };
  };
  var mkSpec = function(handler3) {
    return function(renderChildRef) {
      return function(document3) {
        var getNode = unRenderStateX(function(v) {
          return v.node;
        });
        var done = function(st) {
          if (st instanceof Just) {
            return halt(st.value0);
          }
          ;
          return unit;
        };
        var buildWidget2 = function(spec) {
          var buildThunk2 = buildThunk(unwrap4)(spec);
          var $lazy_patch = $runtime_lazy9("patch", "Halogen.VDom.Driver", function() {
            return function(st, slot5) {
              if (st instanceof Just) {
                if (slot5 instanceof ComponentSlot) {
                  halt(st.value0);
                  return $lazy_renderComponentSlot(100)(slot5.value0);
                }
                ;
                if (slot5 instanceof ThunkSlot) {
                  var step$prime = step3(st.value0, slot5.value0);
                  return mkStep(new Step2(extract2(step$prime), new Just(step$prime), $lazy_patch(103), done));
                }
                ;
                throw new Error("Failed pattern match at Halogen.VDom.Driver (line 97, column 22 - line 103, column 79): " + [slot5.constructor.name]);
              }
              ;
              return $lazy_render(104)(slot5);
            };
          });
          var $lazy_render = $runtime_lazy9("render", "Halogen.VDom.Driver", function() {
            return function(slot5) {
              if (slot5 instanceof ComponentSlot) {
                return $lazy_renderComponentSlot(86)(slot5.value0);
              }
              ;
              if (slot5 instanceof ThunkSlot) {
                var step5 = buildThunk2(slot5.value0);
                return mkStep(new Step2(extract2(step5), new Just(step5), $lazy_patch(89), done));
              }
              ;
              throw new Error("Failed pattern match at Halogen.VDom.Driver (line 84, column 7 - line 89, column 75): " + [slot5.constructor.name]);
            };
          });
          var $lazy_renderComponentSlot = $runtime_lazy9("renderComponentSlot", "Halogen.VDom.Driver", function() {
            return function(cs) {
              var renderChild = read(renderChildRef)();
              var rsx = renderChild(cs)();
              var node = getNode(rsx);
              return mkStep(new Step2(node, Nothing.value, $lazy_patch(117), done));
            };
          });
          var patch2 = $lazy_patch(91);
          var render3 = $lazy_render(82);
          var renderComponentSlot = $lazy_renderComponentSlot(109);
          return render3;
        };
        var buildAttributes = buildProp(handler3);
        return {
          buildWidget: buildWidget2,
          buildAttributes,
          document: document3
        };
      };
    };
  };
  var renderSpec = function(document3) {
    return function(container) {
      var render3 = function(handler3) {
        return function(child2) {
          return function(v) {
            return function(v1) {
              if (v1 instanceof Nothing) {
                return function __do2() {
                  var renderChildRef = $$new(child2)();
                  var spec = mkSpec(handler3)(renderChildRef)(document3);
                  var machine = buildVDom(spec)(v);
                  var node = extract2(machine);
                  $$void7(appendChild(node)(toNode(container)))();
                  return {
                    machine,
                    node,
                    renderChildRef
                  };
                };
              }
              ;
              if (v1 instanceof Just) {
                return function __do2() {
                  write(child2)(v1.value0.renderChildRef)();
                  var parent2 = parentNode2(v1.value0.node)();
                  var nextSib = nextSibling(v1.value0.node)();
                  var machine$prime = step3(v1.value0.machine, v);
                  var newNode = extract2(machine$prime);
                  when3(not2(unsafeRefEq)(v1.value0.node)(newNode))(substInParent(newNode)(nextSib)(parent2))();
                  return {
                    machine: machine$prime,
                    node: newNode,
                    renderChildRef: v1.value0.renderChildRef
                  };
                };
              }
              ;
              throw new Error("Failed pattern match at Halogen.VDom.Driver (line 157, column 5 - line 173, column 80): " + [v1.constructor.name]);
            };
          };
        };
      };
      return {
        render: render3,
        renderChild: identity14,
        removeChild: removeChild3,
        dispose: removeChild3
      };
    };
  };
  var runUI2 = function(component8) {
    return function(i2) {
      return function(element4) {
        return bind14(liftEffect6(map33(toDocument)(bindFlipped8(document2)(windowImpl))))(function(document3) {
          return runUI(renderSpec(document3)(element4))(component8)(i2);
        });
      };
    };
  };

  // output/Audio.SoundFont/foreign.js
  var sf = function() {
    var context = null;
    var noteRing = 0.1;
    return {
      canPlayOgg: function() {
        var audioTester = document.createElement("audio");
        if (audioTester.canPlayType("audio/ogg")) {
          return true;
        } else {
          return false;
        }
      },
      establishAudioContext: function() {
        if (sf.context === null || sf.context === void 0) {
          sf.context = new (window.AudioContext || window.webkitAudioContext)();
        }
      },
      isWebAudioEnabled: function() {
        sf.establishAudioContext();
        if (sf.context) {
          return true;
        } else {
          return false;
        }
      },
      getCurrentTime: function() {
        sf.establishAudioContext();
        if (sf.context) {
          return sf.context.currentTime;
        } else {
          return 0;
        }
      },
      setNoteRing: function(ring) {
        return function() {
          sf.noteRing = ring;
        };
      },
      _decodeAudioBuffer: function(psuint8array, onError, onSuccess) {
        sf.establishAudioContext();
        var uint8Array = new Uint8Array(psuint8array);
        if (sf.context) {
          sf.context.decodeAudioData(uint8Array.buffer, function(buff) {
            onSuccess(buff);
          }, function(e) {
            onError("DecodeAudioData error", e);
          });
        } else {
          onError("No audio context");
        }
      },
      decodeAudioBufferImpl: function(uintarray) {
        return function(onError, onSuccess) {
          sf._decodeAudioBuffer(uintarray, onError, onSuccess);
          return function(cancelError, cancelerError, cancelerSuccess) {
            cancelerSuccess();
          };
        };
      },
      playFontNote: function(fontNote2) {
        return function() {
          return sf._playFontNote(fontNote2);
        };
      },
      _playFontNote: function(fontNote2) {
        sf.establishAudioContext();
        var source3 = sf.context.createBufferSource();
        var gainNode = sf.context.createGain();
        var timeOn = sf.context.currentTime + fontNote2.timeOffset;
        if (sf.noteRing == null) {
          sf.noteRing = 0.1;
        }
        var timeOff = sf.context.currentTime + fontNote2.timeOffset + fontNote2.duration * (1 + sf.noteRing);
        gainNode.gain.value = fontNote2.gain;
        source3.buffer = fontNote2.buffer;
        source3.connect(gainNode);
        gainNode.connect(sf.context.destination);
        source3.start(timeOn);
        source3.stop(timeOff);
        return fontNote2.timeOffset + fontNote2.duration;
      }
    };
  }();
  var isWebAudioEnabled = sf.isWebAudioEnabled;
  var canPlayOgg = sf.canPlayOgg;
  var setNoteRing = sf.setNoteRing;
  var decodeAudioBufferImpl = sf.decodeAudioBufferImpl;
  var playFontNote = sf.playFontNote;

  // output/Affjax/foreign.js
  function _ajax(platformSpecificDriver, timeoutErrorMessageIdent, requestFailedMessageIdent, mkHeader, options2) {
    return function(errback, callback) {
      var xhr = platformSpecificDriver.newXHR();
      var fixedUrl = platformSpecificDriver.fixupUrl(options2.url, xhr);
      xhr.open(options2.method || "GET", fixedUrl, true, options2.username, options2.password);
      if (options2.headers) {
        try {
          for (var i2 = 0, header2; (header2 = options2.headers[i2]) != null; i2++) {
            xhr.setRequestHeader(header2.field, header2.value);
          }
        } catch (e) {
          errback(e);
        }
      }
      var onerror = function(msgIdent) {
        return function() {
          errback(new Error(msgIdent));
        };
      };
      xhr.onerror = onerror(requestFailedMessageIdent);
      xhr.ontimeout = onerror(timeoutErrorMessageIdent);
      xhr.onload = function() {
        callback({
          status: xhr.status,
          statusText: xhr.statusText,
          headers: xhr.getAllResponseHeaders().split("\r\n").filter(function(header3) {
            return header3.length > 0;
          }).map(function(header3) {
            var i3 = header3.indexOf(":");
            return mkHeader(header3.substring(0, i3))(header3.substring(i3 + 2));
          }),
          body: xhr.response
        });
      };
      xhr.responseType = options2.responseType;
      xhr.withCredentials = options2.withCredentials;
      xhr.timeout = options2.timeout;
      xhr.send(options2.content);
      return function(error4, cancelErrback, cancelCallback) {
        try {
          xhr.abort();
        } catch (e) {
          return cancelErrback(e);
        }
        return cancelCallback();
      };
    };
  }

  // output/Data.MediaType.Common/index.js
  var applicationJSON = "application/json";
  var applicationFormURLEncoded = "application/x-www-form-urlencoded";

  // output/Affjax.RequestBody/index.js
  var ArrayView = /* @__PURE__ */ function() {
    function ArrayView2(value0) {
      this.value0 = value0;
    }
    ;
    ArrayView2.create = function(value0) {
      return new ArrayView2(value0);
    };
    return ArrayView2;
  }();
  var Blob2 = /* @__PURE__ */ function() {
    function Blob4(value0) {
      this.value0 = value0;
    }
    ;
    Blob4.create = function(value0) {
      return new Blob4(value0);
    };
    return Blob4;
  }();
  var Document = /* @__PURE__ */ function() {
    function Document3(value0) {
      this.value0 = value0;
    }
    ;
    Document3.create = function(value0) {
      return new Document3(value0);
    };
    return Document3;
  }();
  var $$String = /* @__PURE__ */ function() {
    function $$String3(value0) {
      this.value0 = value0;
    }
    ;
    $$String3.create = function(value0) {
      return new $$String3(value0);
    };
    return $$String3;
  }();
  var FormData = /* @__PURE__ */ function() {
    function FormData2(value0) {
      this.value0 = value0;
    }
    ;
    FormData2.create = function(value0) {
      return new FormData2(value0);
    };
    return FormData2;
  }();
  var FormURLEncoded = /* @__PURE__ */ function() {
    function FormURLEncoded2(value0) {
      this.value0 = value0;
    }
    ;
    FormURLEncoded2.create = function(value0) {
      return new FormURLEncoded2(value0);
    };
    return FormURLEncoded2;
  }();
  var Json = /* @__PURE__ */ function() {
    function Json3(value0) {
      this.value0 = value0;
    }
    ;
    Json3.create = function(value0) {
      return new Json3(value0);
    };
    return Json3;
  }();
  var toMediaType = function(v) {
    if (v instanceof FormURLEncoded) {
      return new Just(applicationFormURLEncoded);
    }
    ;
    if (v instanceof Json) {
      return new Just(applicationJSON);
    }
    ;
    return Nothing.value;
  };

  // output/Affjax.RequestHeader/index.js
  var unwrap5 = /* @__PURE__ */ unwrap();
  var Accept = /* @__PURE__ */ function() {
    function Accept2(value0) {
      this.value0 = value0;
    }
    ;
    Accept2.create = function(value0) {
      return new Accept2(value0);
    };
    return Accept2;
  }();
  var ContentType = /* @__PURE__ */ function() {
    function ContentType2(value0) {
      this.value0 = value0;
    }
    ;
    ContentType2.create = function(value0) {
      return new ContentType2(value0);
    };
    return ContentType2;
  }();
  var RequestHeader = /* @__PURE__ */ function() {
    function RequestHeader2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    RequestHeader2.create = function(value0) {
      return function(value1) {
        return new RequestHeader2(value0, value1);
      };
    };
    return RequestHeader2;
  }();
  var value13 = function(v) {
    if (v instanceof Accept) {
      return unwrap5(v.value0);
    }
    ;
    if (v instanceof ContentType) {
      return unwrap5(v.value0);
    }
    ;
    if (v instanceof RequestHeader) {
      return v.value1;
    }
    ;
    throw new Error("Failed pattern match at Affjax.RequestHeader (line 26, column 1 - line 26, column 33): " + [v.constructor.name]);
  };
  var name15 = function(v) {
    if (v instanceof Accept) {
      return "Accept";
    }
    ;
    if (v instanceof ContentType) {
      return "Content-Type";
    }
    ;
    if (v instanceof RequestHeader) {
      return v.value0;
    }
    ;
    throw new Error("Failed pattern match at Affjax.RequestHeader (line 21, column 1 - line 21, column 32): " + [v.constructor.name]);
  };

  // output/Affjax.ResponseFormat/index.js
  var identity15 = /* @__PURE__ */ identity(categoryFn);
  var $$ArrayBuffer = /* @__PURE__ */ function() {
    function $$ArrayBuffer2(value0) {
      this.value0 = value0;
    }
    ;
    $$ArrayBuffer2.create = function(value0) {
      return new $$ArrayBuffer2(value0);
    };
    return $$ArrayBuffer2;
  }();
  var Blob3 = /* @__PURE__ */ function() {
    function Blob4(value0) {
      this.value0 = value0;
    }
    ;
    Blob4.create = function(value0) {
      return new Blob4(value0);
    };
    return Blob4;
  }();
  var Document2 = /* @__PURE__ */ function() {
    function Document3(value0) {
      this.value0 = value0;
    }
    ;
    Document3.create = function(value0) {
      return new Document3(value0);
    };
    return Document3;
  }();
  var Json2 = /* @__PURE__ */ function() {
    function Json3(value0) {
      this.value0 = value0;
    }
    ;
    Json3.create = function(value0) {
      return new Json3(value0);
    };
    return Json3;
  }();
  var $$String2 = /* @__PURE__ */ function() {
    function $$String3(value0) {
      this.value0 = value0;
    }
    ;
    $$String3.create = function(value0) {
      return new $$String3(value0);
    };
    return $$String3;
  }();
  var Ignore = /* @__PURE__ */ function() {
    function Ignore2(value0) {
      this.value0 = value0;
    }
    ;
    Ignore2.create = function(value0) {
      return new Ignore2(value0);
    };
    return Ignore2;
  }();
  var toResponseType = function(v) {
    if (v instanceof $$ArrayBuffer) {
      return "arraybuffer";
    }
    ;
    if (v instanceof Blob3) {
      return "blob";
    }
    ;
    if (v instanceof Document2) {
      return "document";
    }
    ;
    if (v instanceof Json2) {
      return "text";
    }
    ;
    if (v instanceof $$String2) {
      return "text";
    }
    ;
    if (v instanceof Ignore) {
      return "";
    }
    ;
    throw new Error("Failed pattern match at Affjax.ResponseFormat (line 44, column 3 - line 50, column 19): " + [v.constructor.name]);
  };
  var toMediaType2 = function(v) {
    if (v instanceof Json2) {
      return new Just(applicationJSON);
    }
    ;
    return Nothing.value;
  };
  var string = /* @__PURE__ */ function() {
    return new $$String2(identity15);
  }();
  var ignore = /* @__PURE__ */ function() {
    return new Ignore(identity15);
  }();

  // output/Affjax.ResponseHeader/index.js
  var ResponseHeader = /* @__PURE__ */ function() {
    function ResponseHeader2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    ResponseHeader2.create = function(value0) {
      return function(value1) {
        return new ResponseHeader2(value0, value1);
      };
    };
    return ResponseHeader2;
  }();

  // output/Control.Monad.Except/index.js
  var unwrap6 = /* @__PURE__ */ unwrap();
  var withExcept = /* @__PURE__ */ withExceptT(functorIdentity);
  var runExcept = function($3) {
    return unwrap6(runExceptT($3));
  };
  var mapExcept = function(f) {
    return mapExceptT(function($4) {
      return Identity(f(unwrap6($4)));
    });
  };

  // output/Data.Argonaut.Core/foreign.js
  function id3(x) {
    return x;
  }
  function stringify(j) {
    return JSON.stringify(j);
  }
  function _caseJson(isNull2, isBool, isNum, isStr, isArr, isObj, j) {
    if (j == null)
      return isNull2();
    else if (typeof j === "boolean")
      return isBool(j);
    else if (typeof j === "number")
      return isNum(j);
    else if (typeof j === "string")
      return isStr(j);
    else if (Object.prototype.toString.call(j) === "[object Array]")
      return isArr(j);
    else
      return isObj(j);
  }

  // output/Data.Argonaut.Core/index.js
  var jsonEmptyObject = /* @__PURE__ */ id3(empty4);
  var caseJsonString = function(d) {
    return function(f) {
      return function(j) {
        return _caseJson($$const(d), $$const(d), $$const(d), f, $$const(d), $$const(d), j);
      };
    };
  };
  var caseJsonObject = function(d) {
    return function(f) {
      return function(j) {
        return _caseJson($$const(d), $$const(d), $$const(d), $$const(d), $$const(d), f, j);
      };
    };
  };

  // output/Data.Argonaut.Parser/foreign.js
  function _jsonParser(fail3, succ2, s) {
    try {
      return succ2(JSON.parse(s));
    } catch (e) {
      return fail3(e.message);
    }
  }

  // output/Data.Argonaut.Parser/index.js
  var jsonParser = function(j) {
    return _jsonParser(Left.create, Right.create, j);
  };

  // output/Data.FormURLEncoded/index.js
  var apply5 = /* @__PURE__ */ apply(applyMaybe);
  var map34 = /* @__PURE__ */ map(functorMaybe);
  var traverse2 = /* @__PURE__ */ traverse(traversableArray)(applicativeMaybe);
  var toArray2 = function(v) {
    return v;
  };
  var encode = /* @__PURE__ */ function() {
    var encodePart = function(v) {
      if (v.value1 instanceof Nothing) {
        return encodeFormURLComponent(v.value0);
      }
      ;
      if (v.value1 instanceof Just) {
        return apply5(map34(function(key2) {
          return function(val) {
            return key2 + ("=" + val);
          };
        })(encodeFormURLComponent(v.value0)))(encodeFormURLComponent(v.value1.value0));
      }
      ;
      throw new Error("Failed pattern match at Data.FormURLEncoded (line 37, column 16 - line 39, column 114): " + [v.constructor.name]);
    };
    var $37 = map34(joinWith("&"));
    var $38 = traverse2(encodePart);
    return function($39) {
      return $37($38(toArray2($39)));
    };
  }();

  // output/Data.HTTP.Method/index.js
  var OPTIONS = /* @__PURE__ */ function() {
    function OPTIONS2() {
    }
    ;
    OPTIONS2.value = new OPTIONS2();
    return OPTIONS2;
  }();
  var GET2 = /* @__PURE__ */ function() {
    function GET3() {
    }
    ;
    GET3.value = new GET3();
    return GET3;
  }();
  var HEAD = /* @__PURE__ */ function() {
    function HEAD2() {
    }
    ;
    HEAD2.value = new HEAD2();
    return HEAD2;
  }();
  var POST2 = /* @__PURE__ */ function() {
    function POST3() {
    }
    ;
    POST3.value = new POST3();
    return POST3;
  }();
  var PUT = /* @__PURE__ */ function() {
    function PUT2() {
    }
    ;
    PUT2.value = new PUT2();
    return PUT2;
  }();
  var DELETE = /* @__PURE__ */ function() {
    function DELETE2() {
    }
    ;
    DELETE2.value = new DELETE2();
    return DELETE2;
  }();
  var TRACE = /* @__PURE__ */ function() {
    function TRACE2() {
    }
    ;
    TRACE2.value = new TRACE2();
    return TRACE2;
  }();
  var CONNECT = /* @__PURE__ */ function() {
    function CONNECT2() {
    }
    ;
    CONNECT2.value = new CONNECT2();
    return CONNECT2;
  }();
  var PROPFIND = /* @__PURE__ */ function() {
    function PROPFIND2() {
    }
    ;
    PROPFIND2.value = new PROPFIND2();
    return PROPFIND2;
  }();
  var PROPPATCH = /* @__PURE__ */ function() {
    function PROPPATCH2() {
    }
    ;
    PROPPATCH2.value = new PROPPATCH2();
    return PROPPATCH2;
  }();
  var MKCOL = /* @__PURE__ */ function() {
    function MKCOL2() {
    }
    ;
    MKCOL2.value = new MKCOL2();
    return MKCOL2;
  }();
  var COPY = /* @__PURE__ */ function() {
    function COPY2() {
    }
    ;
    COPY2.value = new COPY2();
    return COPY2;
  }();
  var MOVE = /* @__PURE__ */ function() {
    function MOVE2() {
    }
    ;
    MOVE2.value = new MOVE2();
    return MOVE2;
  }();
  var LOCK = /* @__PURE__ */ function() {
    function LOCK2() {
    }
    ;
    LOCK2.value = new LOCK2();
    return LOCK2;
  }();
  var UNLOCK = /* @__PURE__ */ function() {
    function UNLOCK2() {
    }
    ;
    UNLOCK2.value = new UNLOCK2();
    return UNLOCK2;
  }();
  var PATCH = /* @__PURE__ */ function() {
    function PATCH2() {
    }
    ;
    PATCH2.value = new PATCH2();
    return PATCH2;
  }();
  var unCustomMethod = function(v) {
    return v;
  };
  var showMethod = {
    show: function(v) {
      if (v instanceof OPTIONS) {
        return "OPTIONS";
      }
      ;
      if (v instanceof GET2) {
        return "GET";
      }
      ;
      if (v instanceof HEAD) {
        return "HEAD";
      }
      ;
      if (v instanceof POST2) {
        return "POST";
      }
      ;
      if (v instanceof PUT) {
        return "PUT";
      }
      ;
      if (v instanceof DELETE) {
        return "DELETE";
      }
      ;
      if (v instanceof TRACE) {
        return "TRACE";
      }
      ;
      if (v instanceof CONNECT) {
        return "CONNECT";
      }
      ;
      if (v instanceof PROPFIND) {
        return "PROPFIND";
      }
      ;
      if (v instanceof PROPPATCH) {
        return "PROPPATCH";
      }
      ;
      if (v instanceof MKCOL) {
        return "MKCOL";
      }
      ;
      if (v instanceof COPY) {
        return "COPY";
      }
      ;
      if (v instanceof MOVE) {
        return "MOVE";
      }
      ;
      if (v instanceof LOCK) {
        return "LOCK";
      }
      ;
      if (v instanceof UNLOCK) {
        return "UNLOCK";
      }
      ;
      if (v instanceof PATCH) {
        return "PATCH";
      }
      ;
      throw new Error("Failed pattern match at Data.HTTP.Method (line 43, column 1 - line 59, column 23): " + [v.constructor.name]);
    }
  };
  var print7 = /* @__PURE__ */ either(/* @__PURE__ */ show(showMethod))(unCustomMethod);

  // output/Effect.Aff.Compat/index.js
  var fromEffectFnAff = function(v) {
    return makeAff(function(k) {
      return function __do2() {
        var v1 = v(function($9) {
          return k(Left.create($9))();
        }, function($10) {
          return k(Right.create($10))();
        });
        return function(e) {
          return makeAff(function(k2) {
            return function __do3() {
              v1(e, function($11) {
                return k2(Left.create($11))();
              }, function($12) {
                return k2(Right.create($12))();
              });
              return nonCanceler;
            };
          });
        };
      };
    });
  };

  // output/Affjax/index.js
  var pure14 = /* @__PURE__ */ pure(/* @__PURE__ */ applicativeExceptT(monadIdentity));
  var fail2 = /* @__PURE__ */ fail(monadIdentity);
  var unsafeReadTagged2 = /* @__PURE__ */ unsafeReadTagged(monadIdentity);
  var alt6 = /* @__PURE__ */ alt(/* @__PURE__ */ altExceptT(semigroupNonEmptyList)(monadIdentity));
  var composeKleisliFlipped3 = /* @__PURE__ */ composeKleisliFlipped(/* @__PURE__ */ bindExceptT(monadIdentity));
  var map35 = /* @__PURE__ */ map(functorMaybe);
  var any3 = /* @__PURE__ */ any(foldableArray)(heytingAlgebraBoolean);
  var eq4 = /* @__PURE__ */ eq(eqString);
  var bindFlipped9 = /* @__PURE__ */ bindFlipped(bindMaybe);
  var map114 = /* @__PURE__ */ map(functorArray);
  var mapFlipped2 = /* @__PURE__ */ mapFlipped(functorAff);
  var $$try4 = /* @__PURE__ */ $$try2(monadErrorAff);
  var pure15 = /* @__PURE__ */ pure(applicativeAff);
  var RequestContentError = /* @__PURE__ */ function() {
    function RequestContentError2(value0) {
      this.value0 = value0;
    }
    ;
    RequestContentError2.create = function(value0) {
      return new RequestContentError2(value0);
    };
    return RequestContentError2;
  }();
  var ResponseBodyError = /* @__PURE__ */ function() {
    function ResponseBodyError2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    ResponseBodyError2.create = function(value0) {
      return function(value1) {
        return new ResponseBodyError2(value0, value1);
      };
    };
    return ResponseBodyError2;
  }();
  var TimeoutError = /* @__PURE__ */ function() {
    function TimeoutError2() {
    }
    ;
    TimeoutError2.value = new TimeoutError2();
    return TimeoutError2;
  }();
  var RequestFailedError = /* @__PURE__ */ function() {
    function RequestFailedError2() {
    }
    ;
    RequestFailedError2.value = new RequestFailedError2();
    return RequestFailedError2;
  }();
  var XHROtherError = /* @__PURE__ */ function() {
    function XHROtherError2(value0) {
      this.value0 = value0;
    }
    ;
    XHROtherError2.create = function(value0) {
      return new XHROtherError2(value0);
    };
    return XHROtherError2;
  }();
  var request2 = function(driver2) {
    return function(req) {
      var parseJSON2 = function(v2) {
        if (v2 === "") {
          return pure14(jsonEmptyObject);
        }
        ;
        return either(function($74) {
          return fail2(ForeignError.create($74));
        })(pure14)(jsonParser(v2));
      };
      var fromResponse = function() {
        if (req.responseFormat instanceof $$ArrayBuffer) {
          return unsafeReadTagged2("ArrayBuffer");
        }
        ;
        if (req.responseFormat instanceof Blob3) {
          return unsafeReadTagged2("Blob");
        }
        ;
        if (req.responseFormat instanceof Document2) {
          return function(x) {
            return alt6(unsafeReadTagged2("Document")(x))(alt6(unsafeReadTagged2("XMLDocument")(x))(unsafeReadTagged2("HTMLDocument")(x)));
          };
        }
        ;
        if (req.responseFormat instanceof Json2) {
          return composeKleisliFlipped3(function($75) {
            return req.responseFormat.value0(parseJSON2($75));
          })(unsafeReadTagged2("String"));
        }
        ;
        if (req.responseFormat instanceof $$String2) {
          return unsafeReadTagged2("String");
        }
        ;
        if (req.responseFormat instanceof Ignore) {
          return $$const(req.responseFormat.value0(pure14(unit)));
        }
        ;
        throw new Error("Failed pattern match at Affjax (line 274, column 18 - line 283, column 57): " + [req.responseFormat.constructor.name]);
      }();
      var extractContent = function(v2) {
        if (v2 instanceof ArrayView) {
          return new Right(v2.value0(unsafeToForeign));
        }
        ;
        if (v2 instanceof Blob2) {
          return new Right(unsafeToForeign(v2.value0));
        }
        ;
        if (v2 instanceof Document) {
          return new Right(unsafeToForeign(v2.value0));
        }
        ;
        if (v2 instanceof $$String) {
          return new Right(unsafeToForeign(v2.value0));
        }
        ;
        if (v2 instanceof FormData) {
          return new Right(unsafeToForeign(v2.value0));
        }
        ;
        if (v2 instanceof FormURLEncoded) {
          return note("Body contains values that cannot be encoded as application/x-www-form-urlencoded")(map35(unsafeToForeign)(encode(v2.value0)));
        }
        ;
        if (v2 instanceof Json) {
          return new Right(unsafeToForeign(stringify(v2.value0)));
        }
        ;
        throw new Error("Failed pattern match at Affjax (line 235, column 20 - line 250, column 69): " + [v2.constructor.name]);
      };
      var addHeader = function(mh) {
        return function(hs) {
          if (mh instanceof Just && !any3(on(eq4)(name15)(mh.value0))(hs)) {
            return snoc(hs)(mh.value0);
          }
          ;
          return hs;
        };
      };
      var headers = function(reqContent) {
        return addHeader(map35(ContentType.create)(bindFlipped9(toMediaType)(reqContent)))(addHeader(map35(Accept.create)(toMediaType2(req.responseFormat)))(req.headers));
      };
      var ajaxRequest = function(v2) {
        return {
          method: print7(req.method),
          url: req.url,
          headers: map114(function(h) {
            return {
              field: name15(h),
              value: value13(h)
            };
          })(headers(req.content)),
          content: v2,
          responseType: toResponseType(req.responseFormat),
          username: toNullable(req.username),
          password: toNullable(req.password),
          withCredentials: req.withCredentials,
          timeout: fromMaybe(0)(map35(function(v1) {
            return v1;
          })(req.timeout))
        };
      };
      var send = function(content3) {
        return mapFlipped2($$try4(fromEffectFnAff(_ajax(driver2, "AffjaxTimeoutErrorMessageIdent", "AffjaxRequestFailedMessageIdent", ResponseHeader.create, ajaxRequest(content3)))))(function(v2) {
          if (v2 instanceof Right) {
            var v1 = runExcept(fromResponse(v2.value0.body));
            if (v1 instanceof Left) {
              return new Left(new ResponseBodyError(head4(v1.value0), v2.value0));
            }
            ;
            if (v1 instanceof Right) {
              return new Right({
                body: v1.value0,
                headers: v2.value0.headers,
                status: v2.value0.status,
                statusText: v2.value0.statusText
              });
            }
            ;
            throw new Error("Failed pattern match at Affjax (line 209, column 9 - line 211, column 52): " + [v1.constructor.name]);
          }
          ;
          if (v2 instanceof Left) {
            return new Left(function() {
              var message2 = message(v2.value0);
              var $61 = message2 === "AffjaxTimeoutErrorMessageIdent";
              if ($61) {
                return TimeoutError.value;
              }
              ;
              var $62 = message2 === "AffjaxRequestFailedMessageIdent";
              if ($62) {
                return RequestFailedError.value;
              }
              ;
              return new XHROtherError(v2.value0);
            }());
          }
          ;
          throw new Error("Failed pattern match at Affjax (line 207, column 144 - line 219, column 28): " + [v2.constructor.name]);
        });
      };
      if (req.content instanceof Nothing) {
        return send(toNullable(Nothing.value));
      }
      ;
      if (req.content instanceof Just) {
        var v = extractContent(req.content.value0);
        if (v instanceof Right) {
          return send(toNullable(new Just(v.value0)));
        }
        ;
        if (v instanceof Left) {
          return pure15(new Left(new RequestContentError(v.value0)));
        }
        ;
        throw new Error("Failed pattern match at Affjax (line 199, column 7 - line 203, column 48): " + [v.constructor.name]);
      }
      ;
      throw new Error("Failed pattern match at Affjax (line 195, column 3 - line 203, column 48): " + [req.content.constructor.name]);
    };
  };
  var defaultRequest = /* @__PURE__ */ function() {
    return {
      method: new Left(GET2.value),
      url: "/",
      headers: [],
      content: Nothing.value,
      username: Nothing.value,
      password: Nothing.value,
      withCredentials: false,
      responseFormat: ignore,
      timeout: Nothing.value
    };
  }();

  // output/Affjax.Web/foreign.js
  var driver = {
    newXHR: function() {
      return new XMLHttpRequest();
    },
    fixupUrl: function(url) {
      return url || "/";
    }
  };

  // output/Affjax.Web/index.js
  var request3 = /* @__PURE__ */ request2(driver);

  // output/Data.Midi.Instrument/index.js
  var elemIndex2 = /* @__PURE__ */ elemIndex(eqChar);
  var foldr5 = /* @__PURE__ */ foldr(foldableArray);
  var Accordion = /* @__PURE__ */ function() {
    function Accordion2() {
    }
    ;
    Accordion2.value = new Accordion2();
    return Accordion2;
  }();
  var AcousticBass = /* @__PURE__ */ function() {
    function AcousticBass2() {
    }
    ;
    AcousticBass2.value = new AcousticBass2();
    return AcousticBass2;
  }();
  var AcousticGrandPiano = /* @__PURE__ */ function() {
    function AcousticGrandPiano2() {
    }
    ;
    AcousticGrandPiano2.value = new AcousticGrandPiano2();
    return AcousticGrandPiano2;
  }();
  var AcousticGuitarNylon = /* @__PURE__ */ function() {
    function AcousticGuitarNylon2() {
    }
    ;
    AcousticGuitarNylon2.value = new AcousticGuitarNylon2();
    return AcousticGuitarNylon2;
  }();
  var AcousticGuitarSteel = /* @__PURE__ */ function() {
    function AcousticGuitarSteel2() {
    }
    ;
    AcousticGuitarSteel2.value = new AcousticGuitarSteel2();
    return AcousticGuitarSteel2;
  }();
  var Agogo = /* @__PURE__ */ function() {
    function Agogo2() {
    }
    ;
    Agogo2.value = new Agogo2();
    return Agogo2;
  }();
  var AltoSax = /* @__PURE__ */ function() {
    function AltoSax2() {
    }
    ;
    AltoSax2.value = new AltoSax2();
    return AltoSax2;
  }();
  var Applause = /* @__PURE__ */ function() {
    function Applause2() {
    }
    ;
    Applause2.value = new Applause2();
    return Applause2;
  }();
  var Bagpipe = /* @__PURE__ */ function() {
    function Bagpipe2() {
    }
    ;
    Bagpipe2.value = new Bagpipe2();
    return Bagpipe2;
  }();
  var Banjo = /* @__PURE__ */ function() {
    function Banjo2() {
    }
    ;
    Banjo2.value = new Banjo2();
    return Banjo2;
  }();
  var BaritoneSax = /* @__PURE__ */ function() {
    function BaritoneSax2() {
    }
    ;
    BaritoneSax2.value = new BaritoneSax2();
    return BaritoneSax2;
  }();
  var Bassoon = /* @__PURE__ */ function() {
    function Bassoon2() {
    }
    ;
    Bassoon2.value = new Bassoon2();
    return Bassoon2;
  }();
  var BirdTweet = /* @__PURE__ */ function() {
    function BirdTweet2() {
    }
    ;
    BirdTweet2.value = new BirdTweet2();
    return BirdTweet2;
  }();
  var BlownBottle = /* @__PURE__ */ function() {
    function BlownBottle2() {
    }
    ;
    BlownBottle2.value = new BlownBottle2();
    return BlownBottle2;
  }();
  var BrassSection = /* @__PURE__ */ function() {
    function BrassSection2() {
    }
    ;
    BrassSection2.value = new BrassSection2();
    return BrassSection2;
  }();
  var BreathNoise = /* @__PURE__ */ function() {
    function BreathNoise2() {
    }
    ;
    BreathNoise2.value = new BreathNoise2();
    return BreathNoise2;
  }();
  var BrightAcousticPiano = /* @__PURE__ */ function() {
    function BrightAcousticPiano2() {
    }
    ;
    BrightAcousticPiano2.value = new BrightAcousticPiano2();
    return BrightAcousticPiano2;
  }();
  var Celesta = /* @__PURE__ */ function() {
    function Celesta2() {
    }
    ;
    Celesta2.value = new Celesta2();
    return Celesta2;
  }();
  var Cello = /* @__PURE__ */ function() {
    function Cello2() {
    }
    ;
    Cello2.value = new Cello2();
    return Cello2;
  }();
  var ChoirAahs = /* @__PURE__ */ function() {
    function ChoirAahs2() {
    }
    ;
    ChoirAahs2.value = new ChoirAahs2();
    return ChoirAahs2;
  }();
  var ChurchOrgan = /* @__PURE__ */ function() {
    function ChurchOrgan2() {
    }
    ;
    ChurchOrgan2.value = new ChurchOrgan2();
    return ChurchOrgan2;
  }();
  var Clarinet = /* @__PURE__ */ function() {
    function Clarinet2() {
    }
    ;
    Clarinet2.value = new Clarinet2();
    return Clarinet2;
  }();
  var Clavinet = /* @__PURE__ */ function() {
    function Clavinet2() {
    }
    ;
    Clavinet2.value = new Clavinet2();
    return Clavinet2;
  }();
  var Contrabass = /* @__PURE__ */ function() {
    function Contrabass2() {
    }
    ;
    Contrabass2.value = new Contrabass2();
    return Contrabass2;
  }();
  var DistortionGuitar = /* @__PURE__ */ function() {
    function DistortionGuitar2() {
    }
    ;
    DistortionGuitar2.value = new DistortionGuitar2();
    return DistortionGuitar2;
  }();
  var DrawbarOrgan = /* @__PURE__ */ function() {
    function DrawbarOrgan2() {
    }
    ;
    DrawbarOrgan2.value = new DrawbarOrgan2();
    return DrawbarOrgan2;
  }();
  var Dulcimer = /* @__PURE__ */ function() {
    function Dulcimer2() {
    }
    ;
    Dulcimer2.value = new Dulcimer2();
    return Dulcimer2;
  }();
  var ElectricBassFinger = /* @__PURE__ */ function() {
    function ElectricBassFinger2() {
    }
    ;
    ElectricBassFinger2.value = new ElectricBassFinger2();
    return ElectricBassFinger2;
  }();
  var ElectricBassPick = /* @__PURE__ */ function() {
    function ElectricBassPick2() {
    }
    ;
    ElectricBassPick2.value = new ElectricBassPick2();
    return ElectricBassPick2;
  }();
  var ElectricGrandPiano = /* @__PURE__ */ function() {
    function ElectricGrandPiano2() {
    }
    ;
    ElectricGrandPiano2.value = new ElectricGrandPiano2();
    return ElectricGrandPiano2;
  }();
  var ElectricGuitarClean = /* @__PURE__ */ function() {
    function ElectricGuitarClean2() {
    }
    ;
    ElectricGuitarClean2.value = new ElectricGuitarClean2();
    return ElectricGuitarClean2;
  }();
  var ElectricGuitarJazz = /* @__PURE__ */ function() {
    function ElectricGuitarJazz2() {
    }
    ;
    ElectricGuitarJazz2.value = new ElectricGuitarJazz2();
    return ElectricGuitarJazz2;
  }();
  var ElectricGuitarMuted = /* @__PURE__ */ function() {
    function ElectricGuitarMuted2() {
    }
    ;
    ElectricGuitarMuted2.value = new ElectricGuitarMuted2();
    return ElectricGuitarMuted2;
  }();
  var ElectricPiano1 = /* @__PURE__ */ function() {
    function ElectricPiano12() {
    }
    ;
    ElectricPiano12.value = new ElectricPiano12();
    return ElectricPiano12;
  }();
  var ElectricPiano2 = /* @__PURE__ */ function() {
    function ElectricPiano22() {
    }
    ;
    ElectricPiano22.value = new ElectricPiano22();
    return ElectricPiano22;
  }();
  var EnglishHorn = /* @__PURE__ */ function() {
    function EnglishHorn2() {
    }
    ;
    EnglishHorn2.value = new EnglishHorn2();
    return EnglishHorn2;
  }();
  var Fiddle = /* @__PURE__ */ function() {
    function Fiddle2() {
    }
    ;
    Fiddle2.value = new Fiddle2();
    return Fiddle2;
  }();
  var Flute = /* @__PURE__ */ function() {
    function Flute2() {
    }
    ;
    Flute2.value = new Flute2();
    return Flute2;
  }();
  var FrenchHorn = /* @__PURE__ */ function() {
    function FrenchHorn2() {
    }
    ;
    FrenchHorn2.value = new FrenchHorn2();
    return FrenchHorn2;
  }();
  var FretlessBass = /* @__PURE__ */ function() {
    function FretlessBass2() {
    }
    ;
    FretlessBass2.value = new FretlessBass2();
    return FretlessBass2;
  }();
  var Fx1Rain = /* @__PURE__ */ function() {
    function Fx1Rain2() {
    }
    ;
    Fx1Rain2.value = new Fx1Rain2();
    return Fx1Rain2;
  }();
  var Fx2Soundtrack = /* @__PURE__ */ function() {
    function Fx2Soundtrack2() {
    }
    ;
    Fx2Soundtrack2.value = new Fx2Soundtrack2();
    return Fx2Soundtrack2;
  }();
  var Fx3Crystal = /* @__PURE__ */ function() {
    function Fx3Crystal2() {
    }
    ;
    Fx3Crystal2.value = new Fx3Crystal2();
    return Fx3Crystal2;
  }();
  var Fx4Atmosphere = /* @__PURE__ */ function() {
    function Fx4Atmosphere2() {
    }
    ;
    Fx4Atmosphere2.value = new Fx4Atmosphere2();
    return Fx4Atmosphere2;
  }();
  var Fx5Brightness = /* @__PURE__ */ function() {
    function Fx5Brightness2() {
    }
    ;
    Fx5Brightness2.value = new Fx5Brightness2();
    return Fx5Brightness2;
  }();
  var Fx6Goblins = /* @__PURE__ */ function() {
    function Fx6Goblins2() {
    }
    ;
    Fx6Goblins2.value = new Fx6Goblins2();
    return Fx6Goblins2;
  }();
  var Fx7Echoes = /* @__PURE__ */ function() {
    function Fx7Echoes2() {
    }
    ;
    Fx7Echoes2.value = new Fx7Echoes2();
    return Fx7Echoes2;
  }();
  var Fx8Scifi = /* @__PURE__ */ function() {
    function Fx8Scifi2() {
    }
    ;
    Fx8Scifi2.value = new Fx8Scifi2();
    return Fx8Scifi2;
  }();
  var Glockenspiel = /* @__PURE__ */ function() {
    function Glockenspiel2() {
    }
    ;
    Glockenspiel2.value = new Glockenspiel2();
    return Glockenspiel2;
  }();
  var GuitarFretNoise = /* @__PURE__ */ function() {
    function GuitarFretNoise2() {
    }
    ;
    GuitarFretNoise2.value = new GuitarFretNoise2();
    return GuitarFretNoise2;
  }();
  var GuitarHarmonics = /* @__PURE__ */ function() {
    function GuitarHarmonics2() {
    }
    ;
    GuitarHarmonics2.value = new GuitarHarmonics2();
    return GuitarHarmonics2;
  }();
  var Gunshot = /* @__PURE__ */ function() {
    function Gunshot2() {
    }
    ;
    Gunshot2.value = new Gunshot2();
    return Gunshot2;
  }();
  var Harmonica = /* @__PURE__ */ function() {
    function Harmonica2() {
    }
    ;
    Harmonica2.value = new Harmonica2();
    return Harmonica2;
  }();
  var Harpsichord = /* @__PURE__ */ function() {
    function Harpsichord2() {
    }
    ;
    Harpsichord2.value = new Harpsichord2();
    return Harpsichord2;
  }();
  var Helicopter = /* @__PURE__ */ function() {
    function Helicopter2() {
    }
    ;
    Helicopter2.value = new Helicopter2();
    return Helicopter2;
  }();
  var HonkytonkPiano = /* @__PURE__ */ function() {
    function HonkytonkPiano2() {
    }
    ;
    HonkytonkPiano2.value = new HonkytonkPiano2();
    return HonkytonkPiano2;
  }();
  var Kalimba = /* @__PURE__ */ function() {
    function Kalimba2() {
    }
    ;
    Kalimba2.value = new Kalimba2();
    return Kalimba2;
  }();
  var Koto = /* @__PURE__ */ function() {
    function Koto2() {
    }
    ;
    Koto2.value = new Koto2();
    return Koto2;
  }();
  var Lead1Square = /* @__PURE__ */ function() {
    function Lead1Square2() {
    }
    ;
    Lead1Square2.value = new Lead1Square2();
    return Lead1Square2;
  }();
  var Lead2Sawtooth = /* @__PURE__ */ function() {
    function Lead2Sawtooth2() {
    }
    ;
    Lead2Sawtooth2.value = new Lead2Sawtooth2();
    return Lead2Sawtooth2;
  }();
  var Lead3Calliope = /* @__PURE__ */ function() {
    function Lead3Calliope2() {
    }
    ;
    Lead3Calliope2.value = new Lead3Calliope2();
    return Lead3Calliope2;
  }();
  var Lead4Chiff = /* @__PURE__ */ function() {
    function Lead4Chiff2() {
    }
    ;
    Lead4Chiff2.value = new Lead4Chiff2();
    return Lead4Chiff2;
  }();
  var Lead5Charang = /* @__PURE__ */ function() {
    function Lead5Charang2() {
    }
    ;
    Lead5Charang2.value = new Lead5Charang2();
    return Lead5Charang2;
  }();
  var Lead6Voice = /* @__PURE__ */ function() {
    function Lead6Voice2() {
    }
    ;
    Lead6Voice2.value = new Lead6Voice2();
    return Lead6Voice2;
  }();
  var Lead7Fifths = /* @__PURE__ */ function() {
    function Lead7Fifths2() {
    }
    ;
    Lead7Fifths2.value = new Lead7Fifths2();
    return Lead7Fifths2;
  }();
  var Lead8BassLead = /* @__PURE__ */ function() {
    function Lead8BassLead2() {
    }
    ;
    Lead8BassLead2.value = new Lead8BassLead2();
    return Lead8BassLead2;
  }();
  var Marimba = /* @__PURE__ */ function() {
    function Marimba2() {
    }
    ;
    Marimba2.value = new Marimba2();
    return Marimba2;
  }();
  var MelodicTom = /* @__PURE__ */ function() {
    function MelodicTom2() {
    }
    ;
    MelodicTom2.value = new MelodicTom2();
    return MelodicTom2;
  }();
  var MusicBox = /* @__PURE__ */ function() {
    function MusicBox2() {
    }
    ;
    MusicBox2.value = new MusicBox2();
    return MusicBox2;
  }();
  var MutedTrumpet = /* @__PURE__ */ function() {
    function MutedTrumpet2() {
    }
    ;
    MutedTrumpet2.value = new MutedTrumpet2();
    return MutedTrumpet2;
  }();
  var Oboe = /* @__PURE__ */ function() {
    function Oboe2() {
    }
    ;
    Oboe2.value = new Oboe2();
    return Oboe2;
  }();
  var Ocarina = /* @__PURE__ */ function() {
    function Ocarina2() {
    }
    ;
    Ocarina2.value = new Ocarina2();
    return Ocarina2;
  }();
  var OrchestraHit = /* @__PURE__ */ function() {
    function OrchestraHit2() {
    }
    ;
    OrchestraHit2.value = new OrchestraHit2();
    return OrchestraHit2;
  }();
  var OrchestralHarp = /* @__PURE__ */ function() {
    function OrchestralHarp2() {
    }
    ;
    OrchestralHarp2.value = new OrchestralHarp2();
    return OrchestralHarp2;
  }();
  var OverdrivenGuitar = /* @__PURE__ */ function() {
    function OverdrivenGuitar2() {
    }
    ;
    OverdrivenGuitar2.value = new OverdrivenGuitar2();
    return OverdrivenGuitar2;
  }();
  var Pad1NewAge = /* @__PURE__ */ function() {
    function Pad1NewAge2() {
    }
    ;
    Pad1NewAge2.value = new Pad1NewAge2();
    return Pad1NewAge2;
  }();
  var Pad2Warm = /* @__PURE__ */ function() {
    function Pad2Warm2() {
    }
    ;
    Pad2Warm2.value = new Pad2Warm2();
    return Pad2Warm2;
  }();
  var Pad3Polysynth = /* @__PURE__ */ function() {
    function Pad3Polysynth2() {
    }
    ;
    Pad3Polysynth2.value = new Pad3Polysynth2();
    return Pad3Polysynth2;
  }();
  var Pad4Choir = /* @__PURE__ */ function() {
    function Pad4Choir2() {
    }
    ;
    Pad4Choir2.value = new Pad4Choir2();
    return Pad4Choir2;
  }();
  var Pad5Bowed = /* @__PURE__ */ function() {
    function Pad5Bowed2() {
    }
    ;
    Pad5Bowed2.value = new Pad5Bowed2();
    return Pad5Bowed2;
  }();
  var Pad6Metallic = /* @__PURE__ */ function() {
    function Pad6Metallic2() {
    }
    ;
    Pad6Metallic2.value = new Pad6Metallic2();
    return Pad6Metallic2;
  }();
  var Pad7Halo = /* @__PURE__ */ function() {
    function Pad7Halo2() {
    }
    ;
    Pad7Halo2.value = new Pad7Halo2();
    return Pad7Halo2;
  }();
  var Pad8Sweep = /* @__PURE__ */ function() {
    function Pad8Sweep2() {
    }
    ;
    Pad8Sweep2.value = new Pad8Sweep2();
    return Pad8Sweep2;
  }();
  var PanFlute = /* @__PURE__ */ function() {
    function PanFlute2() {
    }
    ;
    PanFlute2.value = new PanFlute2();
    return PanFlute2;
  }();
  var PercussiveOrgan = /* @__PURE__ */ function() {
    function PercussiveOrgan2() {
    }
    ;
    PercussiveOrgan2.value = new PercussiveOrgan2();
    return PercussiveOrgan2;
  }();
  var Piccolo = /* @__PURE__ */ function() {
    function Piccolo2() {
    }
    ;
    Piccolo2.value = new Piccolo2();
    return Piccolo2;
  }();
  var PizzicatoStrings = /* @__PURE__ */ function() {
    function PizzicatoStrings2() {
    }
    ;
    PizzicatoStrings2.value = new PizzicatoStrings2();
    return PizzicatoStrings2;
  }();
  var Recorder = /* @__PURE__ */ function() {
    function Recorder2() {
    }
    ;
    Recorder2.value = new Recorder2();
    return Recorder2;
  }();
  var ReedOrgan = /* @__PURE__ */ function() {
    function ReedOrgan2() {
    }
    ;
    ReedOrgan2.value = new ReedOrgan2();
    return ReedOrgan2;
  }();
  var ReverseCymbal = /* @__PURE__ */ function() {
    function ReverseCymbal2() {
    }
    ;
    ReverseCymbal2.value = new ReverseCymbal2();
    return ReverseCymbal2;
  }();
  var RockOrgan = /* @__PURE__ */ function() {
    function RockOrgan2() {
    }
    ;
    RockOrgan2.value = new RockOrgan2();
    return RockOrgan2;
  }();
  var Seashore = /* @__PURE__ */ function() {
    function Seashore2() {
    }
    ;
    Seashore2.value = new Seashore2();
    return Seashore2;
  }();
  var Shakuhachi = /* @__PURE__ */ function() {
    function Shakuhachi2() {
    }
    ;
    Shakuhachi2.value = new Shakuhachi2();
    return Shakuhachi2;
  }();
  var Shamisen = /* @__PURE__ */ function() {
    function Shamisen2() {
    }
    ;
    Shamisen2.value = new Shamisen2();
    return Shamisen2;
  }();
  var Shanai = /* @__PURE__ */ function() {
    function Shanai2() {
    }
    ;
    Shanai2.value = new Shanai2();
    return Shanai2;
  }();
  var Sitar = /* @__PURE__ */ function() {
    function Sitar2() {
    }
    ;
    Sitar2.value = new Sitar2();
    return Sitar2;
  }();
  var SlapBass1 = /* @__PURE__ */ function() {
    function SlapBass12() {
    }
    ;
    SlapBass12.value = new SlapBass12();
    return SlapBass12;
  }();
  var SlapBass2 = /* @__PURE__ */ function() {
    function SlapBass22() {
    }
    ;
    SlapBass22.value = new SlapBass22();
    return SlapBass22;
  }();
  var SopranoSax = /* @__PURE__ */ function() {
    function SopranoSax2() {
    }
    ;
    SopranoSax2.value = new SopranoSax2();
    return SopranoSax2;
  }();
  var SteelDrums = /* @__PURE__ */ function() {
    function SteelDrums2() {
    }
    ;
    SteelDrums2.value = new SteelDrums2();
    return SteelDrums2;
  }();
  var StringEnsemble1 = /* @__PURE__ */ function() {
    function StringEnsemble12() {
    }
    ;
    StringEnsemble12.value = new StringEnsemble12();
    return StringEnsemble12;
  }();
  var StringEnsemble2 = /* @__PURE__ */ function() {
    function StringEnsemble22() {
    }
    ;
    StringEnsemble22.value = new StringEnsemble22();
    return StringEnsemble22;
  }();
  var SynthBass1 = /* @__PURE__ */ function() {
    function SynthBass12() {
    }
    ;
    SynthBass12.value = new SynthBass12();
    return SynthBass12;
  }();
  var SynthBass2 = /* @__PURE__ */ function() {
    function SynthBass22() {
    }
    ;
    SynthBass22.value = new SynthBass22();
    return SynthBass22;
  }();
  var SynthBrass1 = /* @__PURE__ */ function() {
    function SynthBrass12() {
    }
    ;
    SynthBrass12.value = new SynthBrass12();
    return SynthBrass12;
  }();
  var SynthBrass2 = /* @__PURE__ */ function() {
    function SynthBrass22() {
    }
    ;
    SynthBrass22.value = new SynthBrass22();
    return SynthBrass22;
  }();
  var SynthChoir = /* @__PURE__ */ function() {
    function SynthChoir2() {
    }
    ;
    SynthChoir2.value = new SynthChoir2();
    return SynthChoir2;
  }();
  var SynthDrum = /* @__PURE__ */ function() {
    function SynthDrum2() {
    }
    ;
    SynthDrum2.value = new SynthDrum2();
    return SynthDrum2;
  }();
  var SynthStrings1 = /* @__PURE__ */ function() {
    function SynthStrings12() {
    }
    ;
    SynthStrings12.value = new SynthStrings12();
    return SynthStrings12;
  }();
  var SynthStrings2 = /* @__PURE__ */ function() {
    function SynthStrings22() {
    }
    ;
    SynthStrings22.value = new SynthStrings22();
    return SynthStrings22;
  }();
  var TaikoDrum = /* @__PURE__ */ function() {
    function TaikoDrum2() {
    }
    ;
    TaikoDrum2.value = new TaikoDrum2();
    return TaikoDrum2;
  }();
  var TangoAccordion = /* @__PURE__ */ function() {
    function TangoAccordion2() {
    }
    ;
    TangoAccordion2.value = new TangoAccordion2();
    return TangoAccordion2;
  }();
  var TelephoneRing = /* @__PURE__ */ function() {
    function TelephoneRing2() {
    }
    ;
    TelephoneRing2.value = new TelephoneRing2();
    return TelephoneRing2;
  }();
  var TenorSax = /* @__PURE__ */ function() {
    function TenorSax2() {
    }
    ;
    TenorSax2.value = new TenorSax2();
    return TenorSax2;
  }();
  var Timpani = /* @__PURE__ */ function() {
    function Timpani2() {
    }
    ;
    Timpani2.value = new Timpani2();
    return Timpani2;
  }();
  var TinkleBell = /* @__PURE__ */ function() {
    function TinkleBell2() {
    }
    ;
    TinkleBell2.value = new TinkleBell2();
    return TinkleBell2;
  }();
  var TremoloStrings = /* @__PURE__ */ function() {
    function TremoloStrings2() {
    }
    ;
    TremoloStrings2.value = new TremoloStrings2();
    return TremoloStrings2;
  }();
  var Trombone = /* @__PURE__ */ function() {
    function Trombone2() {
    }
    ;
    Trombone2.value = new Trombone2();
    return Trombone2;
  }();
  var Trumpet = /* @__PURE__ */ function() {
    function Trumpet2() {
    }
    ;
    Trumpet2.value = new Trumpet2();
    return Trumpet2;
  }();
  var Tuba = /* @__PURE__ */ function() {
    function Tuba2() {
    }
    ;
    Tuba2.value = new Tuba2();
    return Tuba2;
  }();
  var TubularBells = /* @__PURE__ */ function() {
    function TubularBells2() {
    }
    ;
    TubularBells2.value = new TubularBells2();
    return TubularBells2;
  }();
  var Vibraphone = /* @__PURE__ */ function() {
    function Vibraphone2() {
    }
    ;
    Vibraphone2.value = new Vibraphone2();
    return Vibraphone2;
  }();
  var Viola = /* @__PURE__ */ function() {
    function Viola2() {
    }
    ;
    Viola2.value = new Viola2();
    return Viola2;
  }();
  var Violin = /* @__PURE__ */ function() {
    function Violin2() {
    }
    ;
    Violin2.value = new Violin2();
    return Violin2;
  }();
  var VoiceOohs = /* @__PURE__ */ function() {
    function VoiceOohs2() {
    }
    ;
    VoiceOohs2.value = new VoiceOohs2();
    return VoiceOohs2;
  }();
  var Whistle = /* @__PURE__ */ function() {
    function Whistle2() {
    }
    ;
    Whistle2.value = new Whistle2();
    return Whistle2;
  }();
  var Woodblock = /* @__PURE__ */ function() {
    function Woodblock2() {
    }
    ;
    Woodblock2.value = new Woodblock2();
    return Woodblock2;
  }();
  var Xylophone = /* @__PURE__ */ function() {
    function Xylophone2() {
    }
    ;
    Xylophone2.value = new Xylophone2();
    return Xylophone2;
  }();
  var showName = function(inst) {
    if (inst instanceof Accordion) {
      return "Accordion";
    }
    ;
    if (inst instanceof AcousticBass) {
      return "AcousticBass";
    }
    ;
    if (inst instanceof AcousticGrandPiano) {
      return "AcousticGrandPiano";
    }
    ;
    if (inst instanceof AcousticGuitarNylon) {
      return "AcousticGuitarNylon";
    }
    ;
    if (inst instanceof AcousticGuitarSteel) {
      return "AcousticGuitarSteel";
    }
    ;
    if (inst instanceof Agogo) {
      return "Agogo";
    }
    ;
    if (inst instanceof AltoSax) {
      return "AltoSax";
    }
    ;
    if (inst instanceof Applause) {
      return "Applause";
    }
    ;
    if (inst instanceof Bagpipe) {
      return "Bagpipe";
    }
    ;
    if (inst instanceof Banjo) {
      return "Banjo";
    }
    ;
    if (inst instanceof BaritoneSax) {
      return "BaritoneSax";
    }
    ;
    if (inst instanceof Bassoon) {
      return "Bassoon";
    }
    ;
    if (inst instanceof BirdTweet) {
      return "BirdTweet";
    }
    ;
    if (inst instanceof BlownBottle) {
      return "BlownBottle";
    }
    ;
    if (inst instanceof BrassSection) {
      return "BrassSection";
    }
    ;
    if (inst instanceof BreathNoise) {
      return "BreathNoise";
    }
    ;
    if (inst instanceof BrightAcousticPiano) {
      return "BrightAcousticPiano";
    }
    ;
    if (inst instanceof Celesta) {
      return "Celesta";
    }
    ;
    if (inst instanceof Cello) {
      return "Cello";
    }
    ;
    if (inst instanceof ChoirAahs) {
      return "ChoirAahs";
    }
    ;
    if (inst instanceof ChurchOrgan) {
      return "ChurchOrgan";
    }
    ;
    if (inst instanceof Clarinet) {
      return "Clarinet";
    }
    ;
    if (inst instanceof Clavinet) {
      return "Clavinet";
    }
    ;
    if (inst instanceof Contrabass) {
      return "Contrabass";
    }
    ;
    if (inst instanceof DistortionGuitar) {
      return "DistortionGuitar";
    }
    ;
    if (inst instanceof DrawbarOrgan) {
      return "DrawbarOrgan";
    }
    ;
    if (inst instanceof Dulcimer) {
      return "Dulcimer";
    }
    ;
    if (inst instanceof ElectricBassFinger) {
      return "ElectricBassFinger";
    }
    ;
    if (inst instanceof ElectricBassPick) {
      return "ElectricBassPick";
    }
    ;
    if (inst instanceof ElectricGrandPiano) {
      return "ElectricGrandPiano";
    }
    ;
    if (inst instanceof ElectricGuitarClean) {
      return "ElectricGuitarClean";
    }
    ;
    if (inst instanceof ElectricGuitarJazz) {
      return "ElectricGuitarJazz";
    }
    ;
    if (inst instanceof ElectricGuitarMuted) {
      return "ElectricGuitarMuted";
    }
    ;
    if (inst instanceof ElectricPiano1) {
      return "ElectricPiano1";
    }
    ;
    if (inst instanceof ElectricPiano2) {
      return "ElectricPiano2";
    }
    ;
    if (inst instanceof EnglishHorn) {
      return "EnglishHorn";
    }
    ;
    if (inst instanceof Fiddle) {
      return "Fiddle";
    }
    ;
    if (inst instanceof Flute) {
      return "Flute";
    }
    ;
    if (inst instanceof FrenchHorn) {
      return "FrenchHorn";
    }
    ;
    if (inst instanceof FretlessBass) {
      return "FretlessBass";
    }
    ;
    if (inst instanceof Fx1Rain) {
      return "Fx1Rain";
    }
    ;
    if (inst instanceof Fx2Soundtrack) {
      return "Fx2Soundtrack";
    }
    ;
    if (inst instanceof Fx3Crystal) {
      return "Fx3Crystal";
    }
    ;
    if (inst instanceof Fx4Atmosphere) {
      return "Fx4Atmosphere";
    }
    ;
    if (inst instanceof Fx5Brightness) {
      return "Fx5Brightness";
    }
    ;
    if (inst instanceof Fx6Goblins) {
      return "Fx6Goblins";
    }
    ;
    if (inst instanceof Fx7Echoes) {
      return "Fx7Echoes";
    }
    ;
    if (inst instanceof Fx8Scifi) {
      return "Fx8Scifi";
    }
    ;
    if (inst instanceof Glockenspiel) {
      return "Glockenspiel";
    }
    ;
    if (inst instanceof GuitarFretNoise) {
      return "GuitarFretNoise";
    }
    ;
    if (inst instanceof GuitarHarmonics) {
      return "GuitarHarmonics";
    }
    ;
    if (inst instanceof Gunshot) {
      return "Gunshot";
    }
    ;
    if (inst instanceof Harmonica) {
      return "Harmonica";
    }
    ;
    if (inst instanceof Harpsichord) {
      return "Harpsichord";
    }
    ;
    if (inst instanceof Helicopter) {
      return "Helicopter";
    }
    ;
    if (inst instanceof HonkytonkPiano) {
      return "HonkytonkPiano";
    }
    ;
    if (inst instanceof Kalimba) {
      return "Kalimba";
    }
    ;
    if (inst instanceof Koto) {
      return "Koto";
    }
    ;
    if (inst instanceof Lead1Square) {
      return "Lead1Square";
    }
    ;
    if (inst instanceof Lead2Sawtooth) {
      return "Lead2Sawtooth";
    }
    ;
    if (inst instanceof Lead3Calliope) {
      return "Lead3Calliope";
    }
    ;
    if (inst instanceof Lead4Chiff) {
      return "Lead4Chiff";
    }
    ;
    if (inst instanceof Lead5Charang) {
      return "Lead5Charang";
    }
    ;
    if (inst instanceof Lead6Voice) {
      return "Lead6Voice";
    }
    ;
    if (inst instanceof Lead7Fifths) {
      return "Lead7Fifths";
    }
    ;
    if (inst instanceof Lead8BassLead) {
      return "Lead8BassLead";
    }
    ;
    if (inst instanceof Marimba) {
      return "Marimba";
    }
    ;
    if (inst instanceof MelodicTom) {
      return "MelodicTom";
    }
    ;
    if (inst instanceof MusicBox) {
      return "MusicBox";
    }
    ;
    if (inst instanceof MutedTrumpet) {
      return "MutedTrumpet";
    }
    ;
    if (inst instanceof Oboe) {
      return "Oboe";
    }
    ;
    if (inst instanceof Ocarina) {
      return "Ocarina";
    }
    ;
    if (inst instanceof OrchestraHit) {
      return "OrchestraHit";
    }
    ;
    if (inst instanceof OrchestralHarp) {
      return "OrchestralHarp";
    }
    ;
    if (inst instanceof OverdrivenGuitar) {
      return "OverdrivenGuitar";
    }
    ;
    if (inst instanceof Pad1NewAge) {
      return "Pad1NewAge";
    }
    ;
    if (inst instanceof Pad2Warm) {
      return "Pad2Warm";
    }
    ;
    if (inst instanceof Pad3Polysynth) {
      return "Pad3Polysynth";
    }
    ;
    if (inst instanceof Pad4Choir) {
      return "Pad4Choir";
    }
    ;
    if (inst instanceof Pad5Bowed) {
      return "Pad5Bowed";
    }
    ;
    if (inst instanceof Pad6Metallic) {
      return "Pad6Metallic";
    }
    ;
    if (inst instanceof Pad7Halo) {
      return "Pad7Halo";
    }
    ;
    if (inst instanceof Pad8Sweep) {
      return "Pad8Sweep";
    }
    ;
    if (inst instanceof PanFlute) {
      return "PanFlute";
    }
    ;
    if (inst instanceof PercussiveOrgan) {
      return "PercussiveOrgan";
    }
    ;
    if (inst instanceof Piccolo) {
      return "Piccolo";
    }
    ;
    if (inst instanceof PizzicatoStrings) {
      return "PizzicatoStrings";
    }
    ;
    if (inst instanceof Recorder) {
      return "Recorder";
    }
    ;
    if (inst instanceof ReedOrgan) {
      return "ReedOrgan";
    }
    ;
    if (inst instanceof ReverseCymbal) {
      return "ReverseCymbal";
    }
    ;
    if (inst instanceof RockOrgan) {
      return "RockOrgan";
    }
    ;
    if (inst instanceof Seashore) {
      return "Seashore";
    }
    ;
    if (inst instanceof Shakuhachi) {
      return "Shakuhachi";
    }
    ;
    if (inst instanceof Shamisen) {
      return "Shamisen";
    }
    ;
    if (inst instanceof Shanai) {
      return "Shanai";
    }
    ;
    if (inst instanceof Sitar) {
      return "Sitar";
    }
    ;
    if (inst instanceof SlapBass1) {
      return "SlapBass1";
    }
    ;
    if (inst instanceof SlapBass2) {
      return "SlapBass2";
    }
    ;
    if (inst instanceof SopranoSax) {
      return "SopranoSax";
    }
    ;
    if (inst instanceof SteelDrums) {
      return "SteelDrums";
    }
    ;
    if (inst instanceof StringEnsemble1) {
      return "StringEnsemble1";
    }
    ;
    if (inst instanceof StringEnsemble2) {
      return "StringEnsemble2";
    }
    ;
    if (inst instanceof SynthBass1) {
      return "SynthBass1";
    }
    ;
    if (inst instanceof SynthBass2) {
      return "SynthBass2";
    }
    ;
    if (inst instanceof SynthBrass1) {
      return "SynthBrass1";
    }
    ;
    if (inst instanceof SynthBrass2) {
      return "SynthBrass2";
    }
    ;
    if (inst instanceof SynthChoir) {
      return "SynthChoir";
    }
    ;
    if (inst instanceof SynthDrum) {
      return "SynthDrum";
    }
    ;
    if (inst instanceof SynthStrings1) {
      return "SynthStrings1";
    }
    ;
    if (inst instanceof SynthStrings2) {
      return "SynthStrings2";
    }
    ;
    if (inst instanceof TaikoDrum) {
      return "TaikoDrum";
    }
    ;
    if (inst instanceof TangoAccordion) {
      return "TangoAccordion";
    }
    ;
    if (inst instanceof TelephoneRing) {
      return "TelephoneRing";
    }
    ;
    if (inst instanceof TenorSax) {
      return "TenorSax";
    }
    ;
    if (inst instanceof Timpani) {
      return "Timpani";
    }
    ;
    if (inst instanceof TinkleBell) {
      return "TinkleBell";
    }
    ;
    if (inst instanceof TremoloStrings) {
      return "TremoloStrings";
    }
    ;
    if (inst instanceof Trombone) {
      return "Trombone";
    }
    ;
    if (inst instanceof Trumpet) {
      return "Trumpet";
    }
    ;
    if (inst instanceof Tuba) {
      return "Tuba";
    }
    ;
    if (inst instanceof TubularBells) {
      return "TubularBells";
    }
    ;
    if (inst instanceof Vibraphone) {
      return "Vibraphone";
    }
    ;
    if (inst instanceof Viola) {
      return "Viola";
    }
    ;
    if (inst instanceof Violin) {
      return "Violin";
    }
    ;
    if (inst instanceof VoiceOohs) {
      return "VoiceOohs";
    }
    ;
    if (inst instanceof Whistle) {
      return "Whistle";
    }
    ;
    if (inst instanceof Woodblock) {
      return "Woodblock";
    }
    ;
    if (inst instanceof Xylophone) {
      return "Xylophone";
    }
    ;
    throw new Error("Failed pattern match at Data.Midi.Instrument (line 94, column 3 - line 222, column 29): " + [inst.constructor.name]);
  };
  var contains3 = function(dictEq) {
    var eq12 = eq(dictEq);
    return function(xs) {
      return function(x) {
        return length(filter(function(y) {
          return eq12(y)(x);
        })(xs)) > 0;
      };
    };
  };
  var contains1 = /* @__PURE__ */ contains3(eqChar);
  var asciiUpper = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
  var isUpper = function(c) {
    return contains1(asciiUpper)(c);
  };
  var asciiLower = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
  var toLower2 = function(c) {
    var v = elemIndex2(c)(asciiUpper);
    if (v instanceof Just) {
      return fromMaybe(c)(index(asciiLower)(v.value0));
    }
    ;
    return c;
  };
  var asciiDigit = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  var isDigit = function(c) {
    return contains1(asciiDigit)(c);
  };
  var toGleitzmanName = function(inst) {
    var f = function(c) {
      return function(acc) {
        var $18 = isUpper(c);
        if ($18) {
          return cons("_")(cons(toLower2(c))(acc));
        }
        ;
        var $19 = isDigit(c);
        if ($19) {
          return cons("_")(cons(c)(acc));
        }
        ;
        return cons(toLower2(c))(acc);
      };
    };
    return fromCharArray(drop(1)(foldr5(f)([])(toCharArray(inst))));
  };
  var gleitzmanName = function($23) {
    return toGleitzmanName(showName($23));
  };

  // output/Audio.SoundFont.Gleitz/index.js
  var lookup7 = /* @__PURE__ */ lookup2(ordString);
  var Fluid3 = /* @__PURE__ */ function() {
    function Fluid32() {
    }
    ;
    Fluid32.value = new Fluid32();
    return Fluid32;
  }();
  var MusyngKite = /* @__PURE__ */ function() {
    function MusyngKite2() {
    }
    ;
    MusyngKite2.value = new MusyngKite2();
    return MusyngKite2;
  }();
  var FatBoy = /* @__PURE__ */ function() {
    function FatBoy2() {
    }
    ;
    FatBoy2.value = new FatBoy2();
    return FatBoy2;
  }();
  var MP3 = /* @__PURE__ */ function() {
    function MP32() {
    }
    ;
    MP32.value = new MP32();
    return MP32;
  }();
  var OGG = /* @__PURE__ */ function() {
    function OGG2() {
    }
    ;
    OGG2.value = new OGG2();
    return OGG2;
  }();
  var showSoundFontType = {
    show: function(v) {
      if (v instanceof Fluid3) {
        return "FluidR3_GM";
      }
      ;
      if (v instanceof MusyngKite) {
        return "MusyngKite";
      }
      ;
      if (v instanceof FatBoy) {
        return "FatBoy";
      }
      ;
      throw new Error("Failed pattern match at Audio.SoundFont.Gleitz (line 34, column 1 - line 37, column 25): " + [v.constructor.name]);
    }
  };
  var show1 = /* @__PURE__ */ show(showSoundFontType);
  var showRecordingFormat = {
    show: function(v) {
      if (v instanceof MP3) {
        return "mp3";
      }
      ;
      if (v instanceof OGG) {
        return "ogg";
      }
      ;
      throw new Error("Failed pattern match at Audio.SoundFont.Gleitz (line 28, column 1 - line 30, column 19): " + [v.constructor.name]);
    }
  };
  var show22 = /* @__PURE__ */ show(showRecordingFormat);
  var semitones = /* @__PURE__ */ function() {
    return fromFoldable2(ordString)(foldableArray)([new Tuple("C", 0), new Tuple("D", 2), new Tuple("E", 4), new Tuple("F", 5), new Tuple("G", 7), new Tuple("A", 9), new Tuple("B", 11)]);
  }();
  var gleitzNoteName = function(s) {
    var makeRegex = function() {
      var v = regex("([A-Ga-g])([b#]?)([0-8])")(noFlags);
      if (v instanceof Right) {
        return v.value0;
      }
      ;
      throw new Error("Failed pattern match at Audio.SoundFont.Gleitz (line 117, column 7 - line 119, column 12): " + [v.constructor.name]);
    };
    var makeRegex1 = makeRegex();
    return match(makeRegex1)(s);
  };
  var gleitzBaseUrl = "https://gleitz.github.io/midi-js-soundfonts/";
  var gleitzUrl = function(instrument) {
    return function(fontType) {
      return function(format) {
        return gleitzBaseUrl + (show1(fontType) + ("/" + (gleitzmanName(instrument) + ("-" + (show22(format) + ".js")))));
      };
    };
  };
  var buildMidiPitch = function(octave) {
    return function(pitch) {
      return function(accidental) {
        return (((12 * octave | 0) + pitch | 0) + accidental | 0) + 12 | 0;
      };
    };
  };
  var midiPitch1 = function(s) {
    var v = gleitzNoteName(s);
    if (v instanceof Nothing) {
      return Nothing.value;
    }
    ;
    if (v instanceof Just) {
      var mpitch = function() {
        var v12 = index2(v.value0)(1);
        if (v12 instanceof Just && v12.value0 instanceof Just) {
          return lookup7(v12.value0.value0)(semitones);
        }
        ;
        return Nothing.value;
      }();
      var moctave = function() {
        var v12 = index2(v.value0)(3);
        if (v12 instanceof Just && v12.value0 instanceof Just) {
          return fromString(v12.value0.value0);
        }
        ;
        return Nothing.value;
      }();
      var acc = function() {
        var v12 = index2(v.value0)(2);
        if (v12 instanceof Just && (v12.value0 instanceof Just && v12.value0.value0 === "b")) {
          return -1 | 0;
        }
        ;
        if (v12 instanceof Just && (v12.value0 instanceof Just && v12.value0.value0 === "#")) {
          return 1;
        }
        ;
        return 0;
      }();
      var v1 = new Tuple(mpitch, moctave);
      if (v1.value0 instanceof Just && v1.value1 instanceof Just) {
        return new Just(buildMidiPitch(v1.value1.value0)(v1.value0.value0)(acc));
      }
      ;
      return Nothing.value;
    }
    ;
    throw new Error("Failed pattern match at Audio.SoundFont.Gleitz (line 68, column 3 - line 92, column 23): " + [v.constructor.name]);
  };
  var midiPitch = function(s) {
    return fromMaybe(0)(midiPitch1(s));
  };

  // output/Data.Binary.Base64/foreign.js
  function decodeNodeImpl(Left2, Right2, str) {
    let result;
    const reEmptyString = "^$";
    const leadingQuanta = "^([A-Za-z0-9+/]{4})*";
    const finalQuantum = "([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}(?:=)?|[A-Za-z0-9+/]{2}(?:=){0,2})$";
    const reValidBase64 = new RegExp([reEmptyString, "|", leadingQuanta, finalQuantum].join(""));
    try {
      if (!reValidBase64.test(str)) {
        throw new Error("Invalid input string");
      }
      result = Right2(Buffer.from(str, "base64"));
    } catch (error4) {
      result = Left2(error4);
    }
    return result;
  }

  // output/Data.String.Base64/foreign.js
  function atobImpl(Left2, Right2, str) {
    let result;
    try {
      result = Right2(atob(str));
    } catch (error4) {
      result = Left2(error4);
    }
    return result;
  }

  // output/Data.String.Base64.Internal/foreign.js
  var atobIsDefined = typeof atob === "function";
  function asUint8ArrayImpl(array) {
    return new Uint8Array(array);
  }

  // output/Data.String.Base64.Internal/index.js
  var toRfc4648 = /* @__PURE__ */ function() {
    var $9 = replaceAll("-")("+");
    var $10 = replaceAll("_")("/");
    return function($11) {
      return $9($10($11));
    };
  }();
  var asUint8Array = function(arr) {
    return asUint8ArrayImpl(arr);
  };
  var unsafeStringToUint8ArrayOfCharCodes = /* @__PURE__ */ function() {
    var $12 = map(functorArray)(fromEnum(boundedEnumCodePoint));
    return function($13) {
      return asUint8Array($12(toCodePointArray($13)));
    };
  }();

  // output/Data.String.Base64/index.js
  var atob2 = function(str) {
    return atobImpl(Left.create, Right.create, str);
  };

  // output/Data.Binary.Base64/index.js
  var map36 = /* @__PURE__ */ map(functorEither);
  var decode = function(str) {
    if (atobIsDefined) {
      return map36(unsafeStringToUint8ArrayOfCharCodes)(atob2(toRfc4648(str)));
    }
    ;
    return decodeNodeImpl(Left.create, Right.create, toRfc4648(str));
  };

  // output/Audio.SoundFont.Decoder/index.js
  var map37 = /* @__PURE__ */ map(functorArray);
  var lmap3 = /* @__PURE__ */ lmap(bifunctorTuple);
  var toUnfoldable6 = /* @__PURE__ */ toUnfoldable2(unfoldableArray);
  var fromFoldable5 = /* @__PURE__ */ fromFoldable2(ordInt)(foldableArray);
  var map115 = /* @__PURE__ */ map(functorEither);
  var sequenceDefault2 = /* @__PURE__ */ sequenceDefault(traversableObject)(applicativeEither);
  var map211 = /* @__PURE__ */ map(functorObject);
  var rebaseNoteMap = function(nm) {
    var intermediate = map37(lmap3(midiPitch))(toUnfoldable6(nm));
    return fromFoldable5(intermediate);
  };
  var decodeB64 = function(s) {
    var pos = lastIndexOf2(",")(s);
    if (pos instanceof Just) {
      var text7 = drop3(pos.value0 + 1 | 0)(s);
      return decode(text7);
    }
    ;
    return new Left(error("invalid note definition in Json"));
  };
  var decodeJString = /* @__PURE__ */ function() {
    return caseJsonString(new Left(error("invalid Json string")))(function(s) {
      return decodeB64(s);
    });
  }();
  var decodeJObject = function(jo) {
    return map115(rebaseNoteMap)(sequenceDefault2(map211(decodeJString)(jo)));
  };
  var decodeJson = /* @__PURE__ */ function() {
    return caseJsonObject(new Left(error("invalid Json object")))(function(jobj) {
      return decodeJObject(jobj);
    });
  }();
  var midiJsToNoteMap = function(instrumentName) {
    return function(mjs) {
      var posEnd = lastIndexOf2(",")(mjs);
      var instrument = gleitzmanName(instrumentName);
      var patternString = "MIDI.Soundfont." + (instrument + " = ");
      var posStart = indexOf2(patternString)(mjs);
      var v = new Tuple(posStart, posEnd);
      if (v.value0 instanceof Just && v.value1 instanceof Just) {
        var text7 = drop3(v.value0.value0 + length3(patternString) | 0)(take2(v.value1.value0)(mjs)) + "}";
        var v1 = jsonParser(text7);
        if (v1 instanceof Left) {
          return new Left(error(v1.value0));
        }
        ;
        if (v1 instanceof Right) {
          return decodeJson(v1.value0);
        }
        ;
        throw new Error("Failed pattern match at Audio.SoundFont.Decoder (line 73, column 11 - line 75, column 42): " + [v1.constructor.name]);
      }
      ;
      return new Left(error("Invalid MIDI.js Soundfont format found for " + instrument));
    };
  };

  // output/Audio.SoundFont/index.js
  var bind7 = /* @__PURE__ */ bind(bindAff);
  var mapFlipped3 = /* @__PURE__ */ mapFlipped(functorEither);
  var liftEffect7 = /* @__PURE__ */ liftEffect(monadEffectAff);
  var show12 = /* @__PURE__ */ show(showRecordingFormat);
  var lookup8 = /* @__PURE__ */ lookup2(ordInt);
  var pure16 = /* @__PURE__ */ pure(applicativeEffect);
  var map38 = /* @__PURE__ */ map(functorArray);
  var map116 = /* @__PURE__ */ map(functorEffect);
  var sequenceDefault3 = /* @__PURE__ */ sequenceDefault(traversableArray)(applicativeEffect);
  var pure17 = /* @__PURE__ */ pure(applicativeAff);
  var identity16 = /* @__PURE__ */ identity(categoryFn);
  var traverse3 = /* @__PURE__ */ traverse(traversableMap)(applicativeAff);
  var sequential3 = /* @__PURE__ */ sequential(parallelAff);
  var traverse12 = /* @__PURE__ */ traverse(traversableArray)(applicativeParAff);
  var parallel3 = /* @__PURE__ */ parallel(parallelAff);
  var prefferedRecordingFormat = /* @__PURE__ */ liftM1(monadEffect)(function(b2) {
    if (b2) {
      return OGG.value;
    }
    ;
    return MP3.value;
  })(canPlayOgg);
  var localUrl = function(instrument) {
    return function(localDir) {
      return function(format) {
        return localDir + ("/" + (gleitzmanName(instrument) + ("-" + (show12(format) + ".js"))));
      };
    };
  };
  var lastDuration = function(ns) {
    return fromMaybe(0)(last(ns));
  };
  var fontNote = function(buffer) {
    return function(n) {
      return {
        buffer,
        timeOffset: n.timeOffset,
        duration: n.duration,
        gain: n.gain
      };
    };
  };
  var playNote = function(instruments) {
    return function(note2) {
      var maybeInstrument = index(instruments)(note2.channel);
      if (maybeInstrument instanceof Just) {
        var v = lookup8(note2.id)(maybeInstrument.value0.value1);
        if (v instanceof Just) {
          return playFontNote(fontNote(v.value0)(note2));
        }
        ;
        return pure16(note2.timeOffset + note2.duration);
      }
      ;
      return pure16(note2.timeOffset + note2.duration);
    };
  };
  var playNotes = function(instruments) {
    return function(notes) {
      var pns = map38(playNote(instruments))(notes);
      return map116(lastDuration)(sequenceDefault3(pns));
    };
  };
  var decodeAudioBuffer = function($50) {
    return fromEffectFnAff(decodeAudioBufferImpl($50));
  };
  var loadInstrument = function(maybeLocalDir) {
    return function(instrumentName) {
      return bind7(liftEffect7(prefferedRecordingFormat))(function(recordingFormat) {
        var url = function() {
          if (maybeLocalDir instanceof Just) {
            return localUrl(instrumentName)(maybeLocalDir.value0)(recordingFormat);
          }
          ;
          return gleitzUrl(instrumentName)(MusyngKite.value)(recordingFormat);
        }();
        return bind7(request3({
          method: new Left(GET2.value),
          url,
          headers: defaultRequest.headers,
          content: defaultRequest.content,
          username: defaultRequest.username,
          password: defaultRequest.password,
          withCredentials: defaultRequest.withCredentials,
          responseFormat: string,
          timeout: defaultRequest.timeout
        }))(function(res) {
          var v = mapFlipped3(res)(function(v1) {
            return v1.body;
          });
          if (v instanceof Left) {
            return bind7(liftEffect7(log2("instrument failed to load: " + url)))(function() {
              return pure17(new Tuple(instrumentName, empty2));
            });
          }
          ;
          if (v instanceof Right) {
            var ejson = midiJsToNoteMap(instrumentName)(v.value0);
            var noteMap = either(function(v1) {
              return empty2;
            })(identity16)(ejson);
            return bind7(traverse3(decodeAudioBuffer)(noteMap))(function(font3) {
              return pure17(new Tuple(instrumentName, font3));
            });
          }
          ;
          throw new Error("Failed pattern match at Audio.SoundFont (line 124, column 3 - line 133, column 39): " + [v.constructor.name]);
        });
      });
    };
  };
  var loadInstruments = function(maybeLocalDir) {
    return function(instrumentNames) {
      return sequential3(traverse12(function(name16) {
        return parallel3(loadInstrument(maybeLocalDir)(name16));
      })(instrumentNames));
    };
  };
  var loadRemoteSoundFonts = /* @__PURE__ */ function() {
    return loadInstruments(Nothing.value);
  }();

  // output/Bass.Audio/index.js
  var map39 = /* @__PURE__ */ map(functorArray);
  var join4 = /* @__PURE__ */ join(bindArray);
  var $$void8 = /* @__PURE__ */ $$void(functorEffect);
  var openStringMidiIds = [28, 33, 38, 43];
  var clean = function(notes) {
    return filter(function(note2) {
      return note2.id > 0;
    })(notes);
  };
  var bass = 0;
  var toNote = function(firstFretOffset) {
    return function(stringNumber) {
      return function(fingerPosition) {
        var openStringId = fromMaybe(0)(index(openStringMidiIds)(stringNumber));
        var id4 = (openStringId + fingerPosition.fret | 0) + firstFretOffset | 0;
        return {
          channel: bass,
          id: id4,
          timeOffset: 0,
          duration: 0.8,
          gain: 1
        };
      };
    };
  };
  var toStringNotes = function(firstFretOffset) {
    return function(stringNumber) {
      return function(stringPositions) {
        return clean(map39(toNote(firstFretOffset)(stringNumber))(stringPositions));
      };
    };
  };
  var arpeggiate = function(notes) {
    var f = function(ix) {
      return function(note2) {
        return {
          channel: note2.channel,
          id: note2.id,
          timeOffset: toNumber(ix) * 0.7,
          duration: note2.duration,
          gain: note2.gain
        };
      };
    };
    return mapWithIndex(f)(notes);
  };
  var playChord = function(fingering3) {
    return function(firstFretOffset) {
      return function(instruments) {
        var notes = arpeggiate(join4(mapWithIndex(toStringNotes(firstFretOffset))(fingering3)));
        return $$void8(playNotes(instruments)(notes));
      };
    };
  };

  // output/Bass.FingerStatus/index.js
  var pure18 = /* @__PURE__ */ pure(applicativeEither);
  var readString2 = /* @__PURE__ */ readString(monadIdentity);
  var Primary = /* @__PURE__ */ function() {
    function Primary2() {
    }
    ;
    Primary2.value = new Primary2();
    return Primary2;
  }();
  var Secondary = /* @__PURE__ */ function() {
    function Secondary2() {
    }
    ;
    Secondary2.value = new Secondary2();
    return Secondary2;
  }();
  var showFingerStatus = function(fs) {
    if (fs instanceof Primary) {
      return "Primary";
    }
    ;
    if (fs instanceof Secondary) {
      return "Secondary";
    }
    ;
    throw new Error("Failed pattern match at Bass.FingerStatus (line 45, column 3 - line 47, column 29): " + [fs.constructor.name]);
  };
  var writeForeignFingerStatus = {
    writeImpl: function($9) {
      return unsafeToForeign(showFingerStatus($9));
    }
  };
  var readFingerStatus = function(s) {
    if (s === "Primary") {
      return new Just(Primary.value);
    }
    ;
    if (s === "Secondary") {
      return new Just(Secondary.value);
    }
    ;
    return Nothing.value;
  };
  var readForeignFingerStatus = function(value18) {
    var error4 = new Left(singleton9(new TypeMismatch("FingerStatus", tagOf(value18))));
    var fromString8 = function() {
      var $10 = maybe(error4)(pure18);
      return function($11) {
        return $10(readFingerStatus($11));
      };
    }();
    return mapExcept(either($$const(error4))(fromString8))(readString2(value18));
  };
  var readFingerStatusInst = {
    readImpl: readForeignFingerStatus
  };

  // output/Bass.Types/index.js
  var open2 = /* @__PURE__ */ function() {
    return {
      fret: 0,
      status: Primary.value
    };
  }();
  var isOpenFret = function(fp) {
    return fp.fret === 0;
  };
  var displayedFretCount2 = 5;
  var closedStringsChordName = "silent";
  var closedStrings = [[], [], [], []];

  // output/Color/index.js
  var clamp1 = /* @__PURE__ */ clamp(ordNumber);
  var show4 = /* @__PURE__ */ show(showNumber);
  var HSLA = /* @__PURE__ */ function() {
    function HSLA2(value0, value1, value22, value32) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
      this.value3 = value32;
    }
    ;
    HSLA2.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return function(value32) {
            return new HSLA2(value0, value1, value22, value32);
          };
        };
      };
    };
    return HSLA2;
  }();
  var hsla = function(h) {
    return function(s) {
      return function(l) {
        return function(a2) {
          var s$prime = clamp1(0)(1)(s);
          var l$prime = clamp1(0)(1)(l);
          var a$prime = clamp1(0)(1)(a2);
          return new HSLA(h, s$prime, l$prime, a$prime);
        };
      };
    };
  };
  var hsl = function(h) {
    return function(s) {
      return function(l) {
        return hsla(h)(s)(l)(1);
      };
    };
  };
  var white = /* @__PURE__ */ hsl(0)(0)(1);
  var graytone = function(l) {
    return hsl(0)(0)(l);
  };
  var cssStringHSLA = function(v) {
    var toString = function(n) {
      return show4(toNumber(round2(100 * n)) / 100);
    };
    var saturation = toString(v.value1 * 100) + "%";
    var lightness = toString(v.value2 * 100) + "%";
    var hue = toString(v.value0);
    var alpha = show4(v.value3);
    var $118 = v.value3 === 1;
    if ($118) {
      return "hsl(" + (hue + (", " + (saturation + (", " + (lightness + ")")))));
    }
    ;
    return "hsla(" + (hue + (", " + (saturation + (", " + (lightness + (", " + (alpha + ")")))))));
  };
  var black = /* @__PURE__ */ hsl(0)(0)(0);

  // output/Graphics.Canvas/foreign.js
  function getCanvasElementByIdImpl(id4, Just2, Nothing2) {
    return function() {
      var el = document.getElementById(id4);
      if (el && el instanceof HTMLCanvasElement) {
        return Just2(el);
      } else {
        return Nothing2;
      }
    };
  }
  function getContext2D(c) {
    return function() {
      return c.getContext("2d");
    };
  }
  function setLineWidth(ctx) {
    return function(width9) {
      return function() {
        ctx.lineWidth = width9;
      };
    };
  }
  function setFillStyle(ctx) {
    return function(style3) {
      return function() {
        ctx.fillStyle = style3;
      };
    };
  }
  function setStrokeStyle(ctx) {
    return function(style3) {
      return function() {
        ctx.strokeStyle = style3;
      };
    };
  }
  function setShadowColor(ctx) {
    return function(color) {
      return function() {
        ctx.shadowColor = color;
      };
    };
  }
  function setShadowBlur(ctx) {
    return function(blur3) {
      return function() {
        ctx.shadowBlur = blur3;
      };
    };
  }
  function setShadowOffsetX(ctx) {
    return function(offsetX) {
      return function() {
        ctx.shadowOffsetX = offsetX;
      };
    };
  }
  function setShadowOffsetY(ctx) {
    return function(offsetY) {
      return function() {
        ctx.shadowOffsetY = offsetY;
      };
    };
  }
  function beginPath(ctx) {
    return function() {
      ctx.beginPath();
    };
  }
  function stroke(ctx) {
    return function() {
      ctx.stroke();
    };
  }
  function fill(ctx) {
    return function() {
      ctx.fill();
    };
  }
  function clip(ctx) {
    return function() {
      ctx.clip();
    };
  }
  function lineTo(ctx) {
    return function(x) {
      return function(y) {
        return function() {
          ctx.lineTo(x, y);
        };
      };
    };
  }
  function moveTo2(ctx) {
    return function(x) {
      return function(y) {
        return function() {
          ctx.moveTo(x, y);
        };
      };
    };
  }
  function closePath(ctx) {
    return function() {
      ctx.closePath();
    };
  }
  function arc(ctx) {
    return function(a2) {
      return function() {
        ctx.arc(a2.x, a2.y, a2.radius, a2.start, a2.end, a2.useCounterClockwise);
      };
    };
  }
  function rect(ctx) {
    return function(r) {
      return function() {
        ctx.rect(r.x, r.y, r.width, r.height);
      };
    };
  }
  function clearRect(ctx) {
    return function(r) {
      return function() {
        ctx.clearRect(r.x, r.y, r.width, r.height);
      };
    };
  }
  function scale(ctx) {
    return function(t) {
      return function() {
        ctx.scale(t.scaleX, t.scaleY);
      };
    };
  }
  function rotate(ctx) {
    return function(angle) {
      return function() {
        ctx.rotate(angle);
      };
    };
  }
  function translate(ctx) {
    return function(t) {
      return function() {
        ctx.translate(t.translateX, t.translateY);
      };
    };
  }
  function setFont(ctx) {
    return function(fontspec) {
      return function() {
        ctx.font = fontspec;
      };
    };
  }
  function fillText(ctx) {
    return function(text7) {
      return function(x) {
        return function(y) {
          return function() {
            ctx.fillText(text7, x, y);
          };
        };
      };
    };
  }
  function save(ctx) {
    return function() {
      ctx.save();
    };
  }
  function restore(ctx) {
    return function() {
      ctx.restore();
    };
  }

  // output/Graphics.Canvas/index.js
  var withContext = function(ctx) {
    return function(action2) {
      return function __do2() {
        save(ctx)();
        var a2 = action2();
        restore(ctx)();
        return a2;
      };
    };
  };
  var strokePath = function(ctx) {
    return function(path2) {
      return function __do2() {
        beginPath(ctx)();
        var a2 = path2();
        stroke(ctx)();
        return a2;
      };
    };
  };
  var getCanvasElementById = function(elId) {
    return getCanvasElementByIdImpl(elId, Just.create, Nothing.value);
  };
  var fillPath = function(ctx) {
    return function(path2) {
      return function __do2() {
        beginPath(ctx)();
        var a2 = path2();
        fill(ctx)();
        return a2;
      };
    };
  };

  // output/Graphics.Drawing.Font/index.js
  var intercalate4 = /* @__PURE__ */ intercalate(foldableArray)(monoidString);
  var fold3 = /* @__PURE__ */ fold(foldableMaybe)(monoidString);
  var show5 = /* @__PURE__ */ show(showInt);
  var Font = /* @__PURE__ */ function() {
    function Font2(value0, value1, value22) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
    }
    ;
    Font2.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return new Font2(value0, value1, value22);
        };
      };
    };
    return Font2;
  }();
  var sansSerif = "sans-serif";
  var optionsString = function(v) {
    return intercalate4(" ")([fold3(v.style), fold3(v.variant), fold3(v.weight)]);
  };
  var light = /* @__PURE__ */ function() {
    return {
      style: Nothing.value,
      variant: Nothing.value,
      weight: new Just("lighter")
    };
  }();
  var fontString = function(v) {
    return optionsString(v.value2) + (" " + (show5(v.value1) + ("px " + v.value0)));
  };
  var font2 = /* @__PURE__ */ function() {
    return Font.create;
  }();
  var bold = /* @__PURE__ */ function() {
    return {
      style: Nothing.value,
      variant: Nothing.value,
      weight: new Just("bold")
    };
  }();

  // output/Graphics.Drawing/index.js
  var append8 = /* @__PURE__ */ append(semigroupList);
  var pure19 = /* @__PURE__ */ pure(applicativeEffect);
  var for_3 = /* @__PURE__ */ for_(applicativeEffect);
  var for_1 = /* @__PURE__ */ for_3(foldableList);
  var when4 = /* @__PURE__ */ when(applicativeEffect);
  var $$void9 = /* @__PURE__ */ $$void(functorEffect);
  var for_22 = /* @__PURE__ */ for_3(foldableMaybe);
  var mempty3 = /* @__PURE__ */ mempty(monoidList);
  var Path2 = /* @__PURE__ */ function() {
    function Path3(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Path3.create = function(value0) {
      return function(value1) {
        return new Path3(value0, value1);
      };
    };
    return Path3;
  }();
  var Rectangle = /* @__PURE__ */ function() {
    function Rectangle2(value0) {
      this.value0 = value0;
    }
    ;
    Rectangle2.create = function(value0) {
      return new Rectangle2(value0);
    };
    return Rectangle2;
  }();
  var Arc = /* @__PURE__ */ function() {
    function Arc2(value0) {
      this.value0 = value0;
    }
    ;
    Arc2.create = function(value0) {
      return new Arc2(value0);
    };
    return Arc2;
  }();
  var Composite = /* @__PURE__ */ function() {
    function Composite2(value0) {
      this.value0 = value0;
    }
    ;
    Composite2.create = function(value0) {
      return new Composite2(value0);
    };
    return Composite2;
  }();
  var Fill = /* @__PURE__ */ function() {
    function Fill2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Fill2.create = function(value0) {
      return function(value1) {
        return new Fill2(value0, value1);
      };
    };
    return Fill2;
  }();
  var Outline = /* @__PURE__ */ function() {
    function Outline2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Outline2.create = function(value0) {
      return function(value1) {
        return new Outline2(value0, value1);
      };
    };
    return Outline2;
  }();
  var Text2 = /* @__PURE__ */ function() {
    function Text3(value0, value1, value22, value32, value42) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
      this.value3 = value32;
      this.value4 = value42;
    }
    ;
    Text3.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return function(value32) {
            return function(value42) {
              return new Text3(value0, value1, value22, value32, value42);
            };
          };
        };
      };
    };
    return Text3;
  }();
  var Many = /* @__PURE__ */ function() {
    function Many2(value0) {
      this.value0 = value0;
    }
    ;
    Many2.create = function(value0) {
      return new Many2(value0);
    };
    return Many2;
  }();
  var Scale = /* @__PURE__ */ function() {
    function Scale2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Scale2.create = function(value0) {
      return function(value1) {
        return new Scale2(value0, value1);
      };
    };
    return Scale2;
  }();
  var Translate = /* @__PURE__ */ function() {
    function Translate2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Translate2.create = function(value0) {
      return function(value1) {
        return new Translate2(value0, value1);
      };
    };
    return Translate2;
  }();
  var Rotate = /* @__PURE__ */ function() {
    function Rotate2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Rotate2.create = function(value0) {
      return function(value1) {
        return new Rotate2(value0, value1);
      };
    };
    return Rotate2;
  }();
  var Clipped = /* @__PURE__ */ function() {
    function Clipped2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Clipped2.create = function(value0) {
      return function(value1) {
        return new Clipped2(value0, value1);
      };
    };
    return Clipped2;
  }();
  var WithShadow = /* @__PURE__ */ function() {
    function WithShadow2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    WithShadow2.create = function(value0) {
      return function(value1) {
        return new WithShadow2(value0, value1);
      };
    };
    return WithShadow2;
  }();
  var text6 = /* @__PURE__ */ function() {
    return Text2.create;
  }();
  var semigroupDrawing = {
    append: function(v) {
      return function(v1) {
        if (v instanceof Many) {
          return new Many(append8(v.value0)(singleton7(v1)));
        }
        ;
        if (v1 instanceof Many) {
          return new Many(new Cons(v, v1.value0));
        }
        ;
        return new Many(new Cons(v, new Cons(v1, Nil.value)));
      };
    }
  };
  var render = function(ctx) {
    var renderShape = function(v) {
      if (v instanceof Path2 && v.value1 instanceof Nil) {
        return pure19(unit);
      }
      ;
      if (v instanceof Path2 && v.value1 instanceof Cons) {
        return function __do2() {
          moveTo2(ctx)(v.value1.value0.x)(v.value1.value0.y)();
          for_1(v.value1.value1)(function(pt) {
            return lineTo(ctx)(pt.x)(pt.y);
          })();
          return when4(v.value0)($$void9(closePath(ctx)))();
        };
      }
      ;
      if (v instanceof Rectangle) {
        return $$void9(rect(ctx)(v.value0));
      }
      ;
      if (v instanceof Arc) {
        return $$void9(arc(ctx)(v.value0));
      }
      ;
      if (v instanceof Composite) {
        return for_1(v.value0)(renderShape);
      }
      ;
      throw new Error("Failed pattern match at Graphics.Drawing (line 268, column 3 - line 268, column 38): " + [v.constructor.name]);
    };
    var applyShadow = function(v) {
      return function __do2() {
        for_22(v.color)(function(color) {
          return setShadowColor(ctx)(cssStringHSLA(color));
        })();
        for_22(v.blur)(function(blur3) {
          return setShadowBlur(ctx)(blur3);
        })();
        return for_22(v.offset)(function(offset) {
          return function __do3() {
            setShadowOffsetX(ctx)(offset.x)();
            return setShadowOffsetY(ctx)(offset.y)();
          };
        })();
      };
    };
    var applyOutlineStyle = function(v) {
      return function __do2() {
        for_22(v.color)(function(color) {
          return setStrokeStyle(ctx)(cssStringHSLA(color));
        })();
        return for_22(v.lineWidth)(function(width9) {
          return setLineWidth(ctx)(width9);
        })();
      };
    };
    var applyFillStyle = function(v) {
      return for_22(v.color)(function(color) {
        return setFillStyle(ctx)(cssStringHSLA(color));
      });
    };
    var go2 = function(v) {
      if (v instanceof Fill) {
        return $$void9(withContext(ctx)(function __do2() {
          applyFillStyle(v.value1)();
          return fillPath(ctx)(renderShape(v.value0))();
        }));
      }
      ;
      if (v instanceof Outline) {
        return $$void9(withContext(ctx)(function __do2() {
          applyOutlineStyle(v.value1)();
          return strokePath(ctx)(renderShape(v.value0))();
        }));
      }
      ;
      if (v instanceof Many) {
        return for_1(v.value0)(go2);
      }
      ;
      if (v instanceof Scale) {
        return $$void9(withContext(ctx)(function __do2() {
          scale(ctx)(v.value0)();
          return go2(v.value1)();
        }));
      }
      ;
      if (v instanceof Translate) {
        return $$void9(withContext(ctx)(function __do2() {
          translate(ctx)(v.value0)();
          return go2(v.value1)();
        }));
      }
      ;
      if (v instanceof Rotate) {
        return $$void9(withContext(ctx)(function __do2() {
          rotate(ctx)(v.value0)();
          return go2(v.value1)();
        }));
      }
      ;
      if (v instanceof Clipped) {
        return $$void9(withContext(ctx)(function __do2() {
          renderShape(v.value0)();
          clip(ctx)();
          return go2(v.value1)();
        }));
      }
      ;
      if (v instanceof WithShadow) {
        return $$void9(withContext(ctx)(function __do2() {
          applyShadow(v.value0)();
          return go2(v.value1)();
        }));
      }
      ;
      if (v instanceof Text2) {
        return $$void9(withContext(ctx)(function __do2() {
          setFont(ctx)(fontString(v.value0))();
          applyFillStyle(v.value3)();
          return fillText(ctx)(v.value4)(v.value1)(v.value2)();
        }));
      }
      ;
      throw new Error("Failed pattern match at Graphics.Drawing (line 221, column 3 - line 224, column 21): " + [v.constructor.name]);
    };
    return go2;
  };
  var rectangle = function(x) {
    return function(y) {
      return function(width9) {
        return function(height9) {
          return new Rectangle({
            x,
            y,
            width: width9,
            height: height9
          });
        };
      };
    };
  };
  var monoidDrawing = /* @__PURE__ */ function() {
    return {
      mempty: new Many(mempty3),
      Semigroup0: function() {
        return semigroupDrawing;
      }
    };
  }();
  var filled = /* @__PURE__ */ function() {
    return flip(Fill.create);
  }();
  var fillColor = function(c) {
    return {
      color: new Just(c)
    };
  };
  var arc2 = function(x) {
    return function(y) {
      return function(start2) {
        return function(end3) {
          return function(radius) {
            return new Arc({
              x,
              y,
              start: start2,
              end: end3,
              radius,
              useCounterClockwise: true
            });
          };
        };
      };
    };
  };
  var circle = function(x) {
    return function(y) {
      return arc2(x)(y)(0)(pi * 2);
    };
  };

  // output/Bass.Graphics/index.js
  var mempty4 = /* @__PURE__ */ mempty(monoidDrawing);
  var show6 = /* @__PURE__ */ show(showInt);
  var min6 = /* @__PURE__ */ min(ordInt);
  var append9 = /* @__PURE__ */ append(semigroupDrawing);
  var foldl3 = /* @__PURE__ */ foldl(foldableArray);
  var max7 = /* @__PURE__ */ max(ordNumber);
  var titleDepth = 35;
  var stringWidth = 2;
  var stringCount = 4;
  var silent2 = /* @__PURE__ */ function() {
    return {
      fret: -1 | 0,
      status: Primary.value
    };
  }();
  var nutyOffset = 70;
  var fretWidth = 2;
  var cellSize = 45;
  var fretDepth = cellSize;
  var stringLength = /* @__PURE__ */ function() {
    return toNumber(displayedFretCount2) * fretDepth;
  }();
  var nutDepth = /* @__PURE__ */ function() {
    return cellSize / 3;
  }();
  var nutxOffset = /* @__PURE__ */ function() {
    return cellSize * 1.5;
  }();
  var firstFretLabel = function(fretNo) {
    var $19 = fretNo < 1 || fretNo >= 10;
    if ($19) {
      return mempty4;
    }
    ;
    var ypos = nutDepth + nutyOffset + fretDepth * 0.6;
    var xpos = nutxOffset * 0.6;
    var theFont = font2(sansSerif)(20)(light);
    var displayNumber = show6(fretNo);
    return text6(theFont)(xpos)(ypos)(fillColor(black))(displayNumber);
  };
  var stringSeparation = cellSize;
  var fingeredString = function(coords2) {
    var stringNumber = function() {
      var $20 = coords2.x < nutxOffset / 2;
      if ($20) {
        return 0;
      }
      ;
      return floor2((coords2.x - nutxOffset / 2) / stringSeparation);
    }();
    var fretNumber = function() {
      var $21 = coords2.y < nutDepth + nutyOffset;
      if ($21) {
        return 0;
      }
      ;
      return floor2((coords2.y - (nutDepth + nutyOffset)) / fretDepth) + 1 | 0;
    }();
    return {
      stringNumber: min6(stringNumber)(stringCount - 1 | 0),
      fretNumber: min6(fretNumber)(displayedFretCount2)
    };
  };
  var neckWidth = /* @__PURE__ */ function() {
    return stringSeparation * toNumber(stringCount - 1 | 0);
  }();
  var fret = function(n) {
    var fretyOffset = toNumber(n) * fretDepth;
    return filled(fillColor(black))(rectangle(nutxOffset)(nutDepth + nutyOffset + fretyOffset)(neckWidth)(fretWidth));
  };
  var frets = /* @__PURE__ */ function() {
    var fretNums = range(1)(displayedFretCount2);
    var f = function(acc) {
      return function(n) {
        return append9(acc)(fret(n));
      };
    };
    return foldl3(f)(mempty4)(fretNums);
  }();
  var nut = /* @__PURE__ */ function() {
    return filled(fillColor(graytone(0.8)))(rectangle(nutxOffset)(nutyOffset)(neckWidth + stringWidth)(nutDepth));
  }();
  var openString = function(stringNum) {
    var xpos = nutxOffset + toNumber(stringNum) * stringSeparation;
    var outerRadius = 0.4 * fretDepth / 2;
    var ypos = nutyOffset - (outerRadius + 4);
    var innerRadius = outerRadius - 2;
    return append9(filled(fillColor(black))(circle(xpos)(ypos)(outerRadius)))(filled(fillColor(white))(circle(xpos)(ypos)(innerRadius)));
  };
  var primaryFinger = function(stringNum) {
    return function(fretNumber) {
      var xpos = nutxOffset + toNumber(stringNum) * stringSeparation;
      var radius = 0.6 * fretDepth / 2;
      var ypos = nutDepth + nutyOffset + toNumber(fretNumber) * fretDepth - (radius + 2);
      return filled(fillColor(black))(circle(xpos)(ypos)(radius));
    };
  };
  var secondaryFinger = function(stringNum) {
    return function(fretNumber) {
      var side = fretDepth / 2;
      var xpos = nutxOffset + toNumber(stringNum) * stringSeparation - side / 2;
      var ypos = nutDepth + nutyOffset + toNumber(fretNumber) * fretDepth - (side + 4);
      return filled(fillColor(graytone(0.5)))(rectangle(xpos)(ypos)(side)(side));
    };
  };
  var silentString = function(stringNum) {
    var ypos = nutyOffset - nutDepth * 0.5;
    var theFont = font2(sansSerif)(26)(bold);
    var barLength = 0.25 * stringSeparation;
    var xpos = nutxOffset + toNumber(stringNum) * stringSeparation - barLength;
    return text6(theFont)(xpos)(ypos)(fillColor(black))("x");
  };
  var finger = function(stringNum) {
    return function(fingerPosition) {
      var $22 = fingerPosition.fret > displayedFretCount2 || (stringNum < 0 || stringNum >= stringCount);
      if ($22) {
        return mempty4;
      }
      ;
      var $23 = fingerPosition.fret === open2.fret;
      if ($23) {
        return openString(stringNum);
      }
      ;
      var $24 = fingerPosition.fret === silent2.fret;
      if ($24) {
        return silentString(stringNum);
      }
      ;
      if (fingerPosition.status instanceof Primary) {
        return primaryFinger(stringNum)(fingerPosition.fret);
      }
      ;
      if (fingerPosition.status instanceof Secondary) {
        return secondaryFinger(stringNum)(fingerPosition.fret);
      }
      ;
      throw new Error("Failed pattern match at Bass.Graphics (line 197, column 5 - line 201, column 54): " + [fingerPosition.status.constructor.name]);
    };
  };
  var fingers = function(stringNum) {
    return function(stringPositions) {
      var f = function(acc) {
        return function(fretNum) {
          return append9(acc)(finger(stringNum)(fretNum));
        };
      };
      var $26 = $$null(stringPositions);
      if ($26) {
        return finger(stringNum)(silent2);
      }
      ;
      return foldl3(f)(mempty4)(stringPositions);
    };
  };
  var fingering = function(fingerSpec) {
    return foldl3(append9)(mempty4)(mapWithIndex(fingers)(fingerSpec));
  };
  var title3 = function(name16) {
    var theFont = font2(sansSerif)(35)(bold);
    var displayName = function() {
      var $27 = length2(name16) > 9;
      if ($27) {
        return dropRight(length2(name16) - 9 | 0)(name16);
      }
      ;
      return name16;
    }();
    var textWidth = cellSize / 1.8 * toNumber(length2(displayName));
    var unsafeTitlexOffset = nutxOffset + neckWidth / 2 - textWidth / 2;
    var titlexOffset = max7(unsafeTitlexOffset)(nutxOffset);
    return text6(theFont)(titlexOffset)(titleDepth)(fillColor(black))(displayName);
  };
  var canvasWidth = /* @__PURE__ */ function() {
    return round2(neckWidth + 2 * nutxOffset);
  }();
  var canvasHeight = /* @__PURE__ */ function() {
    return round2(nutDepth + nutyOffset + stringLength + cellSize);
  }();
  var aString = function(n) {
    var yOffset = nutDepth + nutyOffset;
    var xOffset = nutxOffset + toNumber(n) * stringSeparation;
    return filled(fillColor(black))(rectangle(xOffset)(nutDepth + nutyOffset)(stringWidth)(stringLength));
  };
  var strings = /* @__PURE__ */ function() {
    var stringNums = range(0)(stringCount - 1 | 0);
    var f = function(acc) {
      return function(n) {
        return append9(acc)(aString(n));
      };
    };
    return foldl3(f)(mempty4)(stringNums);
  }();
  var displayChord = function(chord) {
    return append9(title3(chord.name))(append9(nut)(append9(frets)(append9(strings)(append9(fingering(chord.fingering))(firstFretLabel(chord.firstFretOffset))))));
  };

  // output/Data.Validation.Semigroup/index.js
  var V = function(x) {
    return x;
  };
  var validation2 = function(v) {
    return function(v1) {
      return function(v2) {
        if (v2 instanceof Left) {
          return v(v2.value0);
        }
        ;
        if (v2 instanceof Right) {
          return v1(v2.value0);
        }
        ;
        throw new Error("Failed pattern match at Data.Validation.Semigroup (line 48, column 1 - line 48, column 84): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
      };
    };
  };
  var invalid2 = function($100) {
    return V(Left.create($100));
  };
  var functorV = functorEither;
  var applyV = function(dictSemigroup) {
    var append16 = append(dictSemigroup);
    return {
      apply: function(v) {
        return function(v1) {
          if (v instanceof Left && v1 instanceof Left) {
            return new Left(append16(v.value0)(v1.value0));
          }
          ;
          if (v instanceof Left) {
            return new Left(v.value0);
          }
          ;
          if (v1 instanceof Left) {
            return new Left(v1.value0);
          }
          ;
          if (v instanceof Right && v1 instanceof Right) {
            return new Right(v.value0(v1.value0));
          }
          ;
          throw new Error("Failed pattern match at Data.Validation.Semigroup (line 89, column 1 - line 93, column 54): " + [v.constructor.name, v1.constructor.name]);
        };
      },
      Functor0: function() {
        return functorV;
      }
    };
  };
  var applicativeV2 = function(dictSemigroup) {
    var applyV1 = applyV(dictSemigroup);
    return {
      pure: function($108) {
        return V(Right.create($108));
      },
      Apply0: function() {
        return applyV1;
      }
    };
  };
  var andThen = function(v1) {
    return function(f) {
      return validation2(invalid2)(f)(v1);
    };
  };

  // output/Yoga.JSON/foreign.js
  function reviver(key2, value18) {
    if (key2 === "big") {
      return BigInt(value18);
    }
    return value18;
  }
  var _parseJSON = (payload) => JSON.parse(payload, reviver);
  var _undefined = void 0;
  function replacer(key2, value18) {
    if (key2 === "big") {
      return value18.toString();
    }
    return value18;
  }
  var _unsafeStringify = (data) => JSON.stringify(data, replacer);

  // output/Data.BigInt/foreign.js
  var import_big_integer = __toESM(require_BigInteger(), 1);

  // output/Foreign.Index/foreign.js
  function unsafeReadPropImpl(f, s, key2, value18) {
    return value18 == null ? f : s(value18[key2]);
  }

  // output/Foreign.Index/index.js
  var unsafeReadProp = function(dictMonad) {
    var fail3 = fail(dictMonad);
    var pure31 = pure(applicativeExceptT(dictMonad));
    return function(k) {
      return function(value18) {
        return unsafeReadPropImpl(fail3(new TypeMismatch("object", typeOf(value18))), pure31, k, value18);
      };
    };
  };
  var readProp = function(dictMonad) {
    return unsafeReadProp(dictMonad);
  };

  // output/Record.Builder/foreign.js
  function copyRecord(rec) {
    var copy2 = {};
    for (var key2 in rec) {
      if ({}.hasOwnProperty.call(rec, key2)) {
        copy2[key2] = rec[key2];
      }
    }
    return copy2;
  }
  function unsafeInsert(l) {
    return function(a2) {
      return function(rec) {
        rec[l] = a2;
        return rec;
      };
    };
  }

  // output/Record.Builder/index.js
  var semigroupoidBuilder = semigroupoidFn;
  var insert8 = function() {
    return function() {
      return function(dictIsSymbol) {
        var reflectSymbol2 = reflectSymbol(dictIsSymbol);
        return function(l) {
          return function(a2) {
            return function(r1) {
              return unsafeInsert(reflectSymbol2(l))(a2)(r1);
            };
          };
        };
      };
    };
  };
  var categoryBuilder = categoryFn;
  var build = function(v) {
    return function(r1) {
      return v(copyRecord(r1));
    };
  };

  // output/Yoga.JSON/index.js
  var identity17 = /* @__PURE__ */ identity(categoryBuilder);
  var readString3 = /* @__PURE__ */ readString(monadIdentity);
  var readInt2 = /* @__PURE__ */ readInt(monadIdentity);
  var applicativeExceptT2 = /* @__PURE__ */ applicativeExceptT(monadIdentity);
  var pure20 = /* @__PURE__ */ pure(applicativeExceptT2);
  var map40 = /* @__PURE__ */ map(functorArray);
  var compose1 = /* @__PURE__ */ compose(semigroupoidBuilder);
  var insert9 = /* @__PURE__ */ insert8()();
  var append10 = /* @__PURE__ */ append(semigroupNonEmptyList);
  var except2 = /* @__PURE__ */ except(applicativeIdentity);
  var functorExceptT2 = /* @__PURE__ */ functorExceptT(functorIdentity);
  var map117 = /* @__PURE__ */ map(functorExceptT2);
  var bindExceptT2 = /* @__PURE__ */ bindExceptT(monadIdentity);
  var pure110 = /* @__PURE__ */ pure(applicativeNonEmptyList);
  var map212 = /* @__PURE__ */ map(functorNonEmptyList);
  var bindFlipped10 = /* @__PURE__ */ bindFlipped(bindExceptT2);
  var lmap4 = /* @__PURE__ */ lmap(bifunctorEither);
  var composeKleisliFlipped4 = /* @__PURE__ */ composeKleisliFlipped(bindExceptT2);
  var readProp2 = /* @__PURE__ */ readProp(monadIdentity);
  var mapWithIndex3 = /* @__PURE__ */ mapWithIndex2(functorWithIndexArray);
  var readArray2 = /* @__PURE__ */ readArray(monadIdentity);
  var writeForeignString = {
    writeImpl: unsafeToForeign
  };
  var writeForeignInt = {
    writeImpl: unsafeToForeign
  };
  var writeForeignFieldsNilRowR = {
    writeImplFields: function(v) {
      return function(v1) {
        return identity17;
      };
    }
  };
  var readForeignString = {
    readImpl: readString3
  };
  var readForeignInt = {
    readImpl: readInt2
  };
  var readForeignFieldsNilRowRo = {
    getFields: function(v) {
      return function(v1) {
        return pure20(identity17);
      };
    }
  };
  var writeImplFields = function(dict) {
    return dict.writeImplFields;
  };
  var writeForeignRecord = function() {
    return function(dictWriteForeignFields) {
      var writeImplFields1 = writeImplFields(dictWriteForeignFields);
      return {
        writeImpl: function(rec) {
          var steps = writeImplFields1($$Proxy.value)(rec);
          return unsafeToForeign(build(steps)({}));
        }
      };
    };
  };
  var writeImpl = function(dict) {
    return dict.writeImpl;
  };
  var writeJSON = function(dictWriteForeign) {
    var $391 = writeImpl(dictWriteForeign);
    return function($392) {
      return _unsafeStringify($391($392));
    };
  };
  var writeForeignArray = function(dictWriteForeign) {
    var writeImpl4 = writeImpl(dictWriteForeign);
    return {
      writeImpl: function(xs) {
        return unsafeToForeign(map40(writeImpl4)(xs));
      }
    };
  };
  var writeForeignFieldsCons = function(dictIsSymbol) {
    var get8 = get2(dictIsSymbol)();
    var insert32 = insert9(dictIsSymbol);
    return function(dictWriteForeign) {
      var writeImpl4 = writeImpl(dictWriteForeign);
      return function(dictWriteForeignFields) {
        var writeImplFields1 = writeImplFields(dictWriteForeignFields);
        return function() {
          return function() {
            return function() {
              return {
                writeImplFields: function(v) {
                  return function(rec) {
                    var rest2 = writeImplFields1($$Proxy.value)(rec);
                    var value18 = writeImpl4(get8($$Proxy.value)(rec));
                    var result = compose1(insert32($$Proxy.value)(value18))(rest2);
                    return result;
                  };
                }
              };
            };
          };
        };
      };
    };
  };
  var $$undefined = _undefined;
  var writeForeignMaybe = function(dictWriteForeign) {
    return {
      writeImpl: maybe($$undefined)(writeImpl(dictWriteForeign))
    };
  };
  var sequenceCombining = function(dictMonoid) {
    var append22 = append(dictMonoid.Semigroup0());
    var mempty7 = mempty(dictMonoid);
    return function(dictFoldable) {
      var foldl10 = foldl(dictFoldable);
      return function(dictApplicative) {
        var pure210 = pure(dictApplicative);
        var fn = function(acc) {
          return function(elem3) {
            var v = runExcept(elem3);
            if (acc instanceof Left && v instanceof Left) {
              return new Left(append10(acc.value0)(v.value0));
            }
            ;
            if (acc instanceof Left && v instanceof Right) {
              return new Left(acc.value0);
            }
            ;
            if (acc instanceof Right && v instanceof Right) {
              return new Right(append22(acc.value0)(pure210(v.value0)));
            }
            ;
            if (acc instanceof Right && v instanceof Left) {
              return new Left(v.value0);
            }
            ;
            throw new Error("Failed pattern match at Yoga.JSON (line 582, column 5 - line 586, column 38): " + [acc.constructor.name, v.constructor.name]);
          };
        };
        var $412 = foldl10(fn)(new Right(mempty7));
        return function($413) {
          return except2($412($413));
        };
      };
    };
  };
  var sequenceCombining1 = /* @__PURE__ */ sequenceCombining(monoidArray)(foldableArray)(applicativeArray);
  var readImpl = function(dict) {
    return dict.readImpl;
  };
  var readForeignMaybe = function(dictReadForeign) {
    return {
      readImpl: function() {
        var readNullOrUndefined = function(v) {
          return function(v1) {
            if (isNull(v1) || isUndefined(v1)) {
              return pure20(Nothing.value);
            }
            ;
            return map117(Just.create)(v(v1));
          };
        };
        return readNullOrUndefined(readImpl(dictReadForeign));
      }()
    };
  };
  var readAtIdx = function(dictReadForeign) {
    var readImpl3 = readImpl(dictReadForeign);
    return function(i2) {
      return function(f) {
        return withExcept(map212(ErrorAtIndex.create(i2)))(readImpl3(f));
      };
    };
  };
  var readForeignArray = function(dictReadForeign) {
    return {
      readImpl: composeKleisliFlipped4(function() {
        var $435 = mapWithIndex3(readAtIdx(dictReadForeign));
        return function($436) {
          return sequenceCombining1($435($436));
        };
      }())(readArray2)
    };
  };
  var parseJSON = /* @__PURE__ */ function() {
    var $441 = lmap4(function($444) {
      return pure110(ForeignError.create(message($444)));
    });
    var $442 = runEffectFn1(_parseJSON);
    return function($443) {
      return ExceptT(Identity($441(unsafePerformEffect($$try($442($443))))));
    };
  }();
  var readJSON = function(dictReadForeign) {
    var $445 = composeKleisliFlipped4(readImpl(dictReadForeign))(parseJSON);
    return function($446) {
      return runExcept($445($446));
    };
  };
  var getFields = function(dict) {
    return dict.getFields;
  };
  var readForeignFieldsCons = function(dictIsSymbol) {
    var reflectSymbol2 = reflectSymbol(dictIsSymbol);
    var insert32 = insert9(dictIsSymbol);
    return function(dictReadForeign) {
      var readImpl3 = readImpl(dictReadForeign);
      return function(dictReadForeignFields) {
        var getFields1 = getFields(dictReadForeignFields);
        return function() {
          return function() {
            return {
              getFields: function(v) {
                return function(obj) {
                  var rest2 = getFields1($$Proxy.value)(obj);
                  var name16 = reflectSymbol2($$Proxy.value);
                  var enrichErrorWithPropName = withExcept(map212(ErrorAtProperty.create(name16)));
                  var value18 = enrichErrorWithPropName(bindFlipped10(readImpl3)(readProp2(name16)(obj)));
                  var first = map117(insert32($$Proxy.value))(value18);
                  return except2(function() {
                    var v1 = runExcept(rest2);
                    var v2 = runExcept(first);
                    if (v2 instanceof Right && v1 instanceof Right) {
                      return new Right(compose1(v2.value0)(v1.value0));
                    }
                    ;
                    if (v2 instanceof Left && v1 instanceof Left) {
                      return new Left(append10(v2.value0)(v1.value0));
                    }
                    ;
                    if (v2 instanceof Right && v1 instanceof Left) {
                      return new Left(v1.value0);
                    }
                    ;
                    if (v2 instanceof Left && v1 instanceof Right) {
                      return new Left(v2.value0);
                    }
                    ;
                    throw new Error("Failed pattern match at Yoga.JSON (line 338, column 5 - line 342, column 34): " + [v2.constructor.name, v1.constructor.name]);
                  }());
                };
              }
            };
          };
        };
      };
    };
  };
  var readForeignRecord = function() {
    return function(dictReadForeignFields) {
      var getFields1 = getFields(dictReadForeignFields);
      return {
        readImpl: function(o) {
          return map117(flip(build)({}))(getFields1($$Proxy.value)(o));
        }
      };
    };
  };

  // output/Serialization.Json/index.js
  var writeForeignRecord2 = /* @__PURE__ */ writeForeignRecord();
  var fingeringIsSymbol = {
    reflectSymbol: function() {
      return "fingering";
    }
  };
  var writeForeignFieldsCons2 = /* @__PURE__ */ writeForeignFieldsCons(fingeringIsSymbol);
  var writeForeignFieldsCons1 = /* @__PURE__ */ writeForeignFieldsCons2(/* @__PURE__ */ writeForeignArray(writeForeignInt));
  var nameIsSymbol = {
    reflectSymbol: function() {
      return "name";
    }
  };
  var writeForeignFieldsCons22 = /* @__PURE__ */ writeForeignFieldsCons(nameIsSymbol)(writeForeignString)(writeForeignFieldsNilRowR)()()();
  var barreIsSymbol = {
    reflectSymbol: function() {
      return "barre";
    }
  };
  var fretNumberIsSymbol = {
    reflectSymbol: function() {
      return "fretNumber";
    }
  };
  var stringNumberIsSymbol = {
    reflectSymbol: function() {
      return "stringNumber";
    }
  };
  var firstFretOffsetIsSymbol = {
    reflectSymbol: function() {
      return "firstFretOffset";
    }
  };
  var writeForeignFieldsCons3 = /* @__PURE__ */ writeForeignFieldsCons(firstFretOffsetIsSymbol)(writeForeignInt)(writeForeignFieldsCons22)()()();
  var fretIsSymbol = {
    reflectSymbol: function() {
      return "fret";
    }
  };
  var statusIsSymbol = {
    reflectSymbol: function() {
      return "status";
    }
  };
  var readForeignRecord2 = /* @__PURE__ */ readForeignRecord();
  var readForeignFieldsCons2 = /* @__PURE__ */ readForeignFieldsCons(fingeringIsSymbol);
  var readForeignFieldsCons1 = /* @__PURE__ */ readForeignFieldsCons2(/* @__PURE__ */ readForeignArray(readForeignInt));
  var readForeignFieldsCons22 = /* @__PURE__ */ readForeignFieldsCons(nameIsSymbol)(readForeignString)(readForeignFieldsNilRowRo)()();
  var readForeignFieldsCons3 = /* @__PURE__ */ readForeignFieldsCons(firstFretOffsetIsSymbol)(readForeignInt)(readForeignFieldsCons22)()();
  var writePiano = /* @__PURE__ */ writeJSON(/* @__PURE__ */ writeForeignRecord2(/* @__PURE__ */ writeForeignFieldsCons1(writeForeignFieldsCons22)()()()));
  var writeFrettedInstrument = /* @__PURE__ */ writeJSON(/* @__PURE__ */ writeForeignRecord2(/* @__PURE__ */ writeForeignFieldsCons(barreIsSymbol)(/* @__PURE__ */ writeForeignMaybe(/* @__PURE__ */ writeForeignRecord2(/* @__PURE__ */ writeForeignFieldsCons(fretNumberIsSymbol)(writeForeignInt)(/* @__PURE__ */ writeForeignFieldsCons(stringNumberIsSymbol)(writeForeignInt)(writeForeignFieldsNilRowR)()()())()()())))(/* @__PURE__ */ writeForeignFieldsCons1(writeForeignFieldsCons3)()()())()()()));
  var writeBass = /* @__PURE__ */ writeJSON(/* @__PURE__ */ writeForeignRecord2(/* @__PURE__ */ writeForeignFieldsCons2(/* @__PURE__ */ writeForeignArray(/* @__PURE__ */ writeForeignArray(/* @__PURE__ */ writeForeignRecord2(/* @__PURE__ */ writeForeignFieldsCons(fretIsSymbol)(writeForeignInt)(/* @__PURE__ */ writeForeignFieldsCons(statusIsSymbol)(writeForeignFingerStatus)(writeForeignFieldsNilRowR)()()())()()()))))(writeForeignFieldsCons3)()()()));
  var readPiano = /* @__PURE__ */ readJSON(/* @__PURE__ */ readForeignRecord2(/* @__PURE__ */ readForeignFieldsCons1(readForeignFieldsCons22)()()));
  var readFrettedInstrument = /* @__PURE__ */ readJSON(/* @__PURE__ */ readForeignRecord2(/* @__PURE__ */ readForeignFieldsCons(barreIsSymbol)(/* @__PURE__ */ readForeignMaybe(/* @__PURE__ */ readForeignRecord2(/* @__PURE__ */ readForeignFieldsCons(fretNumberIsSymbol)(readForeignInt)(/* @__PURE__ */ readForeignFieldsCons(stringNumberIsSymbol)(readForeignInt)(readForeignFieldsNilRowRo)()())()())))(/* @__PURE__ */ readForeignFieldsCons1(readForeignFieldsCons3)()())()()));
  var readBass = /* @__PURE__ */ readJSON(/* @__PURE__ */ readForeignRecord2(/* @__PURE__ */ readForeignFieldsCons2(/* @__PURE__ */ readForeignArray(/* @__PURE__ */ readForeignArray(/* @__PURE__ */ readForeignRecord2(/* @__PURE__ */ readForeignFieldsCons(fretIsSymbol)(readForeignInt)(/* @__PURE__ */ readForeignFieldsCons(statusIsSymbol)(readFingerStatusInst)(readForeignFieldsNilRowRo)()())()()))))(readForeignFieldsCons3)()()));

  // output/Bass.Validation/index.js
  var join5 = /* @__PURE__ */ join(bindArray);
  var pure21 = /* @__PURE__ */ pure(/* @__PURE__ */ applicativeV2(semigroupNonEmptyList));
  var pure111 = /* @__PURE__ */ pure(applicativeNonEmptyList);
  var show7 = /* @__PURE__ */ show(showInt);
  var intercalate5 = /* @__PURE__ */ intercalate(foldableArray)(monoidString);
  var map41 = /* @__PURE__ */ map(functorArray);
  var apply6 = /* @__PURE__ */ apply(/* @__PURE__ */ applyV(semigroupNonEmptyList));
  var map118 = /* @__PURE__ */ map(functorV);
  var validateFingerPositions = function(fingering3) {
    var fingerOutOfRange = function(fingerPosition) {
      return fingerPosition.fret < (-1 | 0) || fingerPosition.fret > displayedFretCount2;
    };
    var v = filter(fingerOutOfRange)(join5(fingering3));
    if (v.length === 0) {
      return pure21(fingering3);
    }
    ;
    if (v.length === 1) {
      return invalid2(pure111("Finger position " + (show7(v[0].fret) + " is out of range.")));
    }
    ;
    var fingers2 = intercalate5(", ")(map41(function(fp) {
      return show7(fp.fret);
    })(v));
    return invalid2(pure111("Finger positions " + (fingers2 + " are out of range.")));
  };
  var validateFingering = function(fingering3) {
    var $22 = length(fingering3) !== 4;
    if ($22) {
      return invalid2(pure111("Fingering for all 4 strings is required."));
    }
    ;
    return validateFingerPositions(fingering3);
  };
  var maxFrets = 36;
  var validateFirstFretOffset = function(offset) {
    var $23 = offset < 0 || offset > maxFrets;
    if ($23) {
      return invalid2(pure111("First fret offset should be between 0 and " + (show7(maxFrets) + ".")));
    }
    ;
    return pure21(offset);
  };
  var validate = function(chordShape) {
    return apply6(map118(function(v) {
      return function(v1) {
        return {
          name: chordShape.name,
          firstFretOffset: v,
          fingering: v1
        };
      };
    })(validateFirstFretOffset(chordShape.firstFretOffset)))(validateFingering(chordShape.fingering));
  };
  var validateJson = function(json) {
    return either($$const(invalid2(pure111("Not a recognisable bass chord format."))))(validate)(readBass(json));
  };

  // output/Common.Export/foreign.js
  function exportAs(canvas2) {
    return function(filename) {
      return function(mimeType) {
        return function() {
          var lnk = document.createElement("a"), e;
          lnk.download = filename;
          lnk.href = canvas2.toDataURL(mimeType);
          if (document.createEvent) {
            e = document.createEvent("MouseEvents");
            e.initMouseEvent(
              "click",
              true,
              true,
              window,
              0,
              0,
              0,
              0,
              0,
              false,
              false,
              false,
              false,
              0,
              null
            );
            lnk.dispatchEvent(e);
          } else if (lnk.fireEvent) {
            lnk.fireEvent("onclick");
          }
        };
      };
    };
  }
  function scaleCanvas(canvas2) {
    return function(factor) {
      return function() {
        var downloadCanvas = document.createElement("canvas");
        var width9 = canvas2.width * factor;
        var height9 = canvas2.height * factor;
        var downloadCtx = downloadCanvas.getContext("2d");
        downloadCanvas.width = width9;
        downloadCanvas.height = height9;
        downloadCtx.drawImage(
          canvas2,
          0,
          0,
          canvas2.width,
          canvas2.height,
          0,
          0,
          width9,
          height9
        );
        return downloadCanvas;
      };
    };
  }

  // output/Common.Types/index.js
  var PNG = /* @__PURE__ */ function() {
    function PNG2() {
    }
    ;
    PNG2.value = new PNG2();
    return PNG2;
  }();
  var JPG = /* @__PURE__ */ function() {
    function JPG2() {
    }
    ;
    JPG2.value = new JPG2();
    return JPG2;
  }();

  // output/Common.Export/index.js
  var toMimeType = function(v) {
    if (v instanceof PNG) {
      return "image/png;base64";
    }
    ;
    if (v instanceof JPG) {
      return "image/jpeg";
    }
    ;
    throw new Error("Failed pattern match at Common.Export (line 9, column 1 - line 9, column 37): " + [v.constructor.name]);
  };

  // output/Common.Utils/index.js
  var mod3 = /* @__PURE__ */ mod(euclideanRingInt);
  var toPitchClass = function(midiPitch2) {
    var $10 = 0 === midiPitch2;
    if ($10) {
      return "-";
    }
    ;
    var v = mod3(midiPitch2)(12);
    if (v === 0) {
      return "C";
    }
    ;
    if (v === 1) {
      return "C#/Db";
    }
    ;
    if (v === 2) {
      return "D";
    }
    ;
    if (v === 3) {
      return "D#/Eb";
    }
    ;
    if (v === 4) {
      return "E";
    }
    ;
    if (v === 5) {
      return "F";
    }
    ;
    if (v === 6) {
      return "F#/Gb";
    }
    ;
    if (v === 7) {
      return "G";
    }
    ;
    if (v === 8) {
      return "G#/Ab";
    }
    ;
    if (v === 9) {
      return "A";
    }
    ;
    if (v === 10) {
      return "A#Bb";
    }
    ;
    if (v === 11) {
      return "B";
    }
    ;
    return "C";
  };
  var safeName = function(s) {
    var safeChars = filter(function(c) {
      return c !== "?" && (c !== "*" && (c !== "%" && c !== "\\"));
    })(toCharArray(s));
    var $12 = $$null(safeChars);
    if ($12) {
      return "unnamed";
    }
    ;
    return fromCharArray(safeChars);
  };
  var jsonFileInputCtx = {
    componentId: "jsoninput",
    isBinary: false,
    prompt: "load",
    accept: /* @__PURE__ */ mediaType(".json")
  };
  var contains4 = function(dictEq) {
    var eq12 = eq(dictEq);
    return function(xs) {
      return function(x) {
        return length(filter(function(y) {
          return eq12(y)(x);
        })(xs)) > 0;
      };
    };
  };

  // output/CSS.String/index.js
  var fromString5 = function(dict) {
    return dict.fromString;
  };

  // output/CSS.Property/index.js
  var Prefixed = /* @__PURE__ */ function() {
    function Prefixed2(value0) {
      this.value0 = value0;
    }
    ;
    Prefixed2.create = function(value0) {
      return new Prefixed2(value0);
    };
    return Prefixed2;
  }();
  var Plain = /* @__PURE__ */ function() {
    function Plain2(value0) {
      this.value0 = value0;
    }
    ;
    Plain2.create = function(value0) {
      return new Plain2(value0);
    };
    return Plain2;
  }();
  var Value = function(x) {
    return x;
  };
  var Key = function(x) {
    return x;
  };
  var value14 = function(dict) {
    return dict.value;
  };
  var isStringPrefixed = /* @__PURE__ */ function() {
    return {
      fromString: Plain.create
    };
  }();
  var fromString6 = /* @__PURE__ */ fromString5(isStringPrefixed);
  var isStringValue = {
    fromString: function($141) {
      return Value(fromString6($141));
    }
  };
  var isStringKey = {
    fromString: function($151) {
      return Key(fromString6($151));
    }
  };
  var cast = function(v) {
    return v;
  };

  // output/Control.Monad.Writer/index.js
  var unwrap7 = /* @__PURE__ */ unwrap();
  var runWriter = function($5) {
    return unwrap7(runWriterT($5));
  };
  var execWriter = function(m) {
    return snd(runWriter(m));
  };

  // output/CSS.Stylesheet/index.js
  var Property2 = /* @__PURE__ */ function() {
    function Property3(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Property3.create = function(value0) {
      return function(value1) {
        return new Property3(value0, value1);
      };
    };
    return Property3;
  }();
  var S = function(x) {
    return x;
  };
  var runS = function(v) {
    return execWriter(v);
  };
  var rule = /* @__PURE__ */ function() {
    var $340 = tell(monadTellWriterT(monoidArray)(monadIdentity));
    return function($341) {
      return S($340(singleton2($341)));
    };
  }();
  var key = function(dictVal) {
    var value18 = value14(dictVal);
    return function(k) {
      return function(v) {
        return rule(new Property2(cast(k), value18(v)));
      };
    };
  };

  // output/CSS.Display/index.js
  var fromString7 = /* @__PURE__ */ fromString5(isStringKey);
  var fromString1 = /* @__PURE__ */ fromString5(isStringValue);
  var valDisplay = {
    value: function(v) {
      return v;
    }
  };
  var displayNone = /* @__PURE__ */ fromString1("none");
  var display = /* @__PURE__ */ key(valDisplay)(/* @__PURE__ */ fromString7("display"));

  // output/Halogen.FileInputComponent.Dom/foreign.js
  function resetInputValue(componentId) {
    return function() {
      var fileInput = document.getElementById(componentId);
      fileInput.value = "";
    };
  }

  // output/CSS.Render/index.js
  var map42 = /* @__PURE__ */ map(functorArray);
  var lookup10 = /* @__PURE__ */ lookup(foldableArray)(eqString);
  var collect$prime = function(v) {
    return function(v1) {
      if (v instanceof Plain && v1 instanceof Plain) {
        return [new Right(new Tuple(v.value0, v1.value0))];
      }
      ;
      if (v instanceof Prefixed && v1 instanceof Plain) {
        return map42(function(v3) {
          return new Right(new Tuple(v3.value0 + v3.value1, v1.value0));
        })(v.value0);
      }
      ;
      if (v instanceof Plain && v1 instanceof Prefixed) {
        return map42(function(v2) {
          return new Right(new Tuple(v.value0, v2.value0 + v2.value1));
        })(v1.value0);
      }
      ;
      if (v instanceof Prefixed && v1 instanceof Prefixed) {
        return map42(function(v2) {
          return maybe(new Left(v2.value0 + v2.value1))(function() {
            var $213 = Tuple.create(v2.value0 + v2.value1);
            return function($214) {
              return Right.create($213(function(v3) {
                return v2.value0 + v3;
              }($214)));
            };
          }())(lookup10(v2.value0)(v1.value0));
        })(v.value0);
      }
      ;
      throw new Error("Failed pattern match at CSS.Render (line 158, column 1 - line 158, column 80): " + [v.constructor.name, v1.constructor.name]);
    };
  };
  var collect2 = function(v) {
    return collect$prime(v.value0)(v.value1);
  };

  // output/Halogen.HTML.CSS/index.js
  var bind8 = /* @__PURE__ */ bind(bindArray);
  var fromFoldable6 = /* @__PURE__ */ fromFoldable4(foldableArray);
  var style2 = /* @__PURE__ */ function() {
    var toString = function() {
      var $13 = joinWith("; ");
      var $14 = foldMap2(monoidArray)(function(key2) {
        return function(val) {
          return [key2 + (": " + val)];
        };
      });
      return function($15) {
        return $13($14($15));
      };
    }();
    var rights = concatMap(foldMap(foldableEither)(monoidArray)(singleton2));
    var property = function(v) {
      if (v instanceof Property2) {
        return new Just(new Tuple(v.value0, v.value1));
      }
      ;
      return Nothing.value;
    };
    var rules = function(rs) {
      var properties = bind8(mapMaybe(property)(rs))(function($16) {
        return rights(collect2($16));
      });
      return fromFoldable6(properties);
    };
    var $17 = attr2("style");
    return function($18) {
      return $17(toString(rules(runS($18))));
    };
  }();

  // output/Web.Event.Event/foreign.js
  function _currentTarget(e) {
    return e.currentTarget;
  }

  // output/Web.Event.Event/index.js
  var currentTarget = function($5) {
    return toMaybe(_currentTarget($5));
  };

  // output/Web.UIEvent.MouseEvent.EventTypes/index.js
  var mouseup = "mouseup";
  var mousedown = "mousedown";
  var click2 = "click";

  // output/Halogen.HTML.Events/index.js
  var map43 = /* @__PURE__ */ map(functorMaybe);
  var composeKleisli2 = /* @__PURE__ */ composeKleisli(bindMaybe);
  var composeKleisliFlipped5 = /* @__PURE__ */ composeKleisliFlipped(/* @__PURE__ */ bindExceptT(monadIdentity));
  var readProp3 = /* @__PURE__ */ readProp(monadIdentity);
  var readString4 = /* @__PURE__ */ readString(monadIdentity);
  var mouseHandler = unsafeCoerce2;
  var handler$prime = function(et) {
    return function(f) {
      return handler(et)(function(ev) {
        return map43(Action.create)(f(ev));
      });
    };
  };
  var handler2 = function(et) {
    return function(f) {
      return handler(et)(function(ev) {
        return new Just(new Action(f(ev)));
      });
    };
  };
  var onChange = /* @__PURE__ */ handler2(change);
  var onClick = /* @__PURE__ */ function() {
    var $15 = handler2(click2);
    return function($16) {
      return $15(mouseHandler($16));
    };
  }();
  var onMouseDown = /* @__PURE__ */ function() {
    var $27 = handler2(mousedown);
    return function($28) {
      return $27(mouseHandler($28));
    };
  }();
  var onMouseUp = /* @__PURE__ */ function() {
    var $39 = handler2(mouseup);
    return function($40) {
      return $39(mouseHandler($40));
    };
  }();
  var addForeignPropHandler = function(key2) {
    return function(prop5) {
      return function(reader) {
        return function(f) {
          var go2 = function(a2) {
            return composeKleisliFlipped5(reader)(readProp3(prop5))(unsafeToForeign(a2));
          };
          return handler$prime(key2)(composeKleisli2(currentTarget)(function(e) {
            return either($$const(Nothing.value))(function($85) {
              return Just.create(f($85));
            })(runExcept(go2(e)));
          }));
        };
      };
    };
  };
  var onValueInput = /* @__PURE__ */ addForeignPropHandler(input)("value")(readString4);

  // output/JS.FileIO/foreign.js
  function loadTextFileImpl(elementid) {
    return function(onError, onSuccess) {
      _loadFileImpl(elementid, false, onError, onSuccess);
      return function(cancelError, cancelerError, cancelerSuccess) {
        cancelerSuccess();
      };
    };
  }
  function loadBinaryFileAsTextImpl(elementid) {
    return function(onError, onSuccess) {
      _loadFileImpl(elementid, true, onError, onSuccess);
      return function(cancelError, cancelerError, cancelerSuccess) {
        cancelerSuccess();
      };
    };
  }
  function _loadFileImpl(elementid, asBinary, onError, onSuccess) {
    var selectedFile = document.getElementById(elementid).files[0];
    var reader = new FileReader();
    reader.onload = function(event) {
      var contents = event.target.result;
      var filespec = { contents, name: selectedFile.name };
      onSuccess(filespec);
    };
    if (typeof selectedFile != "undefined") {
      if (asBinary) {
        reader.readAsBinaryString(selectedFile);
      } else {
        reader.readAsText(selectedFile);
      }
    } else {
      onError("file not found");
    }
  }
  function saveTextFile(filespec) {
    return function() {
      var a2 = document.createElement("a");
      var file = new Blob([filespec.contents], { type: "text/plain;charset=utf-8" });
      var url = URL.createObjectURL(file);
      a2.href = url;
      a2.download = filespec.name;
      document.body.appendChild(a2);
      a2.click();
      setTimeout(function() {
        document.body.removeChild(a2);
        window.URL.revokeObjectURL(url);
      }, 100);
      return true;
    };
  }

  // output/JS.FileIO/index.js
  var loadTextFile = function($1) {
    return fromEffectFnAff(loadTextFileImpl($1));
  };
  var loadBinaryFileAsText = function($2) {
    return fromEffectFnAff(loadBinaryFileAsTextImpl($2));
  };

  // output/Halogen.FileInputComponent/index.js
  var type_19 = /* @__PURE__ */ type_17(isPropInputType);
  var bind9 = /* @__PURE__ */ bind(bindHalogenM);
  var modify5 = /* @__PURE__ */ modify2(monadStateHalogenM);
  var pure23 = /* @__PURE__ */ pure(applicativeHalogenM);
  var FileLoaded = /* @__PURE__ */ function() {
    function FileLoaded2(value0) {
      this.value0 = value0;
    }
    ;
    FileLoaded2.create = function(value0) {
      return new FileLoaded2(value0);
    };
    return FileLoaded2;
  }();
  var LoadFile = /* @__PURE__ */ function() {
    function LoadFile2() {
    }
    ;
    LoadFile2.value = new LoadFile2();
    return LoadFile2;
  }();
  var component = function(dictMonadAff) {
    var liftAff2 = liftAff(monadAffHalogenM(dictMonadAff));
    var liftEffect9 = liftEffect(monadEffectHalogenM(dictMonadAff.MonadEffect0()));
    return function(ctx) {
      var noDisplayStyle = style2(display(displayNone));
      var render3 = function(state3) {
        return span4([class_("fileInput")])([label4([$$for(ctx.componentId), class_("hoverable fileInputLabel")])([text5(ctx.prompt)]), input2([onChange(function(v) {
          return LoadFile.value;
        }), type_19(InputFile.value), id2(ctx.componentId), accept2(ctx.accept), enabled(state3.isEnabled), noDisplayStyle])]);
      };
      var initialState = function(v) {
        return {
          mfsp: Nothing.value,
          isEnabled: true
        };
      };
      var handleQuery = function(v) {
        return bind9(modify5(function(state3) {
          var $18 = {};
          for (var $19 in state3) {
            if ({}.hasOwnProperty.call(state3, $19)) {
              $18[$19] = state3[$19];
            }
            ;
          }
          ;
          $18.isEnabled = v.value0;
          return $18;
        }))(function() {
          return pure23(new Just(v.value1));
        });
      };
      var handleAction = function(v) {
        return bind9(function() {
          if (ctx.isBinary) {
            return liftAff2(loadBinaryFileAsText(ctx.componentId));
          }
          ;
          return liftAff2(loadTextFile(ctx.componentId));
        }())(function(filespec) {
          return bind9(modify5(function(state3) {
            var $25 = {};
            for (var $26 in state3) {
              if ({}.hasOwnProperty.call(state3, $26)) {
                $25[$26] = state3[$26];
              }
              ;
            }
            ;
            $25.mfsp = new Just(filespec);
            return $25;
          }))(function() {
            return bind9(liftEffect9(resetInputValue(ctx.componentId)))(function() {
              return raise(new FileLoaded(filespec));
            });
          });
        });
      };
      return mkComponent({
        initialState,
        render: render3,
        "eval": mkEval({
          handleAction,
          handleQuery,
          receive: defaultEval.receive,
          initialize: Nothing.value,
          finalize: Nothing.value
        })
      });
    };
  };

  // output/Web.UIEvent.MouseEvent/foreign.js
  function clientX(e) {
    return e.clientX;
  }
  function clientY(e) {
    return e.clientY;
  }

  // output/Bass.Page/index.js
  var join6 = /* @__PURE__ */ join(bindArray);
  var slot2 = /* @__PURE__ */ slot()({
    reflectSymbol: function() {
      return "loadfile";
    }
  })(ordUnit);
  var type_20 = /* @__PURE__ */ type_17(isPropInputType);
  var value15 = /* @__PURE__ */ value12(isPropString);
  var show8 = /* @__PURE__ */ show(showInt);
  var fromJust8 = /* @__PURE__ */ fromJust();
  var bind10 = /* @__PURE__ */ bind(bindHalogenM);
  var modify6 = /* @__PURE__ */ modify2(monadStateHalogenM);
  var pure24 = /* @__PURE__ */ pure(applicativeHalogenM);
  var get4 = /* @__PURE__ */ get(monadStateHalogenM);
  var show13 = /* @__PURE__ */ show(showNumber);
  var put4 = /* @__PURE__ */ put(monadStateHalogenM);
  var append11 = /* @__PURE__ */ append(semigroupString);
  var foldl5 = /* @__PURE__ */ foldl(foldableNonEmptyList);
  var GetCanvasOffset = /* @__PURE__ */ function() {
    function GetCanvasOffset4(value0) {
      this.value0 = value0;
    }
    ;
    GetCanvasOffset4.create = function(value0) {
      return new GetCanvasOffset4(value0);
    };
    return GetCanvasOffset4;
  }();
  var LoadInstruments = /* @__PURE__ */ function() {
    function LoadInstruments4(value0) {
      this.value0 = value0;
    }
    ;
    LoadInstruments4.create = function(value0) {
      return new LoadInstruments4(value0);
    };
    return LoadInstruments4;
  }();
  var DisplayFingering = /* @__PURE__ */ function() {
    function DisplayFingering4(value0) {
      this.value0 = value0;
    }
    ;
    DisplayFingering4.create = function(value0) {
      return new DisplayFingering4(value0);
    };
    return DisplayFingering4;
  }();
  var Init = /* @__PURE__ */ function() {
    function Init5() {
    }
    ;
    Init5.value = new Init5();
    return Init5;
  }();
  var EditFingering = /* @__PURE__ */ function() {
    function EditFingering4(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    EditFingering4.create = function(value0) {
      return function(value1) {
        return new EditFingering4(value0, value1);
      };
    };
    return EditFingering4;
  }();
  var ClearFingering = /* @__PURE__ */ function() {
    function ClearFingering4() {
    }
    ;
    ClearFingering4.value = new ClearFingering4();
    return ClearFingering4;
  }();
  var GetChordName = /* @__PURE__ */ function() {
    function GetChordName4(value0) {
      this.value0 = value0;
    }
    ;
    GetChordName4.create = function(value0) {
      return new GetChordName4(value0);
    };
    return GetChordName4;
  }();
  var GetFirstFretNumber = /* @__PURE__ */ function() {
    function GetFirstFretNumber3(value0) {
      this.value0 = value0;
    }
    ;
    GetFirstFretNumber3.create = function(value0) {
      return new GetFirstFretNumber3(value0);
    };
    return GetFirstFretNumber3;
  }();
  var GetImageScale = /* @__PURE__ */ function() {
    function GetImageScale4(value0) {
      this.value0 = value0;
    }
    ;
    GetImageScale4.create = function(value0) {
      return new GetImageScale4(value0);
    };
    return GetImageScale4;
  }();
  var Export = /* @__PURE__ */ function() {
    function Export4(value0) {
      this.value0 = value0;
    }
    ;
    Export4.create = function(value0) {
      return new Export4(value0);
    };
    return Export4;
  }();
  var Load = /* @__PURE__ */ function() {
    function Load4(value0) {
      this.value0 = value0;
    }
    ;
    Load4.create = function(value0) {
      return new Load4(value0);
    };
    return Load4;
  }();
  var Save = /* @__PURE__ */ function() {
    function Save4() {
    }
    ;
    Save4.value = new Save4();
    return Save4;
  }();
  var PlayChord = /* @__PURE__ */ function() {
    function PlayChord4() {
    }
    ;
    PlayChord4.value = new PlayChord4();
    return PlayChord4;
  }();
  var remove = function(stringPositions) {
    return function(fretNumber) {
      return filter(function(v) {
        return v.fret !== fretNumber;
      })(stringPositions);
    };
  };
  var setSecondaryStatus = function(stringPositions) {
    return function(fretNumber) {
      return snoc(remove(stringPositions)(fretNumber))({
        fret: fretNumber,
        status: Secondary.value
      });
    };
  };
  var isSilent = function(fingering3) {
    return $$null(join6(fingering3));
  };
  var extract3 = function(stringPositions) {
    return function(fretNumber) {
      return head(filter(function(v) {
        return v.fret === fretNumber;
      })(stringPositions));
    };
  };
  var _loadfile = /* @__PURE__ */ function() {
    return $$Proxy.value;
  }();
  var component2 = function(dictMonadAff) {
    var liftAff2 = liftAff(monadAffHalogenM(dictMonadAff));
    var liftEffect9 = liftEffect(monadEffectHalogenM(dictMonadAff.MonadEffect0()));
    var renderSaveButton = button([onClick(function(v) {
      return Save.value;
    }), class_("hoverable"), enabled(true)])([text5("save")]);
    var renderPlayButton = function(state3) {
      var enabled2 = length(state3.instruments) > 0 && !isSilent(state3.chordShape.fingering);
      var className2 = function() {
        if (enabled2) {
          return "hoverable";
        }
        ;
        return "unhoverable";
      }();
      return div_([button([onClick(function(v) {
        return PlayChord.value;
      }), class_(className2), enabled(enabled2)])([text5("play")])]);
    };
    var renderLoadButton = slot2(_loadfile)(unit)(component(dictMonadAff)(jsonFileInputCtx))(unit)(Load.create);
    var renderImageScaleSlider = function(state3) {
      var toScale = function(s) {
        return fromMaybe(100)(fromString(s));
      };
      return div3([class_("leftPanelComponent")])([label4([class_("labelAlignment")])([text5("scale download:")]), input2([onValueInput(function($123) {
        return GetImageScale.create(toScale($123));
      }), type_20(InputRange.value), id2("scale-slider"), class_("scaling-slider"), min5(25), max6(1e3), step4(new Step(25)), value15(show8(state3.exportScale))])]);
    };
    var renderFirstFretNoInput = function(state3) {
      return div3([id2("fret-number-div")])([label4([id2("fret-number-label")])([text5("first fret number:")]), input2([onValueInput(GetFirstFretNumber.create), value15(show8(state3.chordShape.firstFretOffset)), type_20(InputNumber.value), min5(0), max6(9), id2("fret-number-edit"), class_("text-input")])]);
    };
    var renderExportPNGButton = button([onClick(function(v) {
      return new Export(PNG.value);
    }), class_("hoverable"), enabled(true)])([text5("download PNG")]);
    var renderClearFingeringButton = button([onClick(function(v) {
      return ClearFingering.value;
    }), class_("hoverable"), enabled(true)])([text5("clear fingering")]);
    var renderChordNameInput = function(state3) {
      return div3([id2("chord-name-div")])([label4([id2("chord-name-label")])([text5("chord name:")]), input2([onValueInput(GetChordName.create), value15(state3.chordShape.name), type_20(InputText.value), id2("chord-name-edit"), class_("text-input")])]);
    };
    var closedStringShape = {
      name: closedStringsChordName,
      firstFretOffset: 0,
      fingering: closedStrings
    };
    var initialState = function(v) {
      return {
        mGraphicsContext: Nothing.value,
        mCanvas: Nothing.value,
        canvasPosition: {
          left: 0,
          top: 0
        },
        chordShape: closedStringShape,
        exportScale: 100,
        instruments: [],
        errorText: ""
      };
    };
    var clearCanvas = function(state3) {
      var graphicsContext = fromJust8(state3.mGraphicsContext);
      return clearRect(graphicsContext)({
        x: 0,
        y: 0,
        width: toNumber(canvasWidth),
        height: toNumber(canvasHeight)
      });
    };
    var handleQuery = function(v) {
      if (v instanceof GetCanvasOffset) {
        return bind10(liftAff2(selectElement("#canvas")))(function(mCanvasElement) {
          var canvasElement = fromJust8(mCanvasElement);
          return bind10(liftEffect9(offsetLeft(canvasElement)))(function(left) {
            return bind10(liftEffect9(offsetTop(canvasElement)))(function(top3) {
              return bind10(modify6(function(st) {
                var $66 = {};
                for (var $67 in st) {
                  if ({}.hasOwnProperty.call(st, $67)) {
                    $66[$67] = st[$67];
                  }
                  ;
                }
                ;
                $66.canvasPosition = {
                  left,
                  top: top3
                };
                return $66;
              }))(function() {
                return pure24(new Just(v.value0));
              });
            });
          });
        });
      }
      ;
      if (v instanceof LoadInstruments) {
        return bind10(liftAff2(loadRemoteSoundFonts([ElectricBassPick.value])))(function(instruments) {
          return bind10(modify6(function(st) {
            var $70 = {};
            for (var $71 in st) {
              if ({}.hasOwnProperty.call(st, $71)) {
                $70[$71] = st[$71];
              }
              ;
            }
            ;
            $70.instruments = instruments;
            return $70;
          }))(function() {
            return pure24(new Just(v.value0));
          });
        });
      }
      ;
      if (v instanceof DisplayFingering) {
        return bind10(get4)(function(state3) {
          var graphicsCtx = fromJust8(state3.mGraphicsContext);
          return bind10(liftEffect9(function __do2() {
            clearCanvas(state3)();
            return render(graphicsCtx)(displayChord(state3.chordShape))();
          }))(function() {
            return pure24(new Just(v.value0));
          });
        });
      }
      ;
      throw new Error("Failed pattern match at Bass.Page (line 345, column 17 - line 371, column 23): " + [v.constructor.name]);
    };
    var canvasClickHandler = function(me) {
      return new EditFingering(clientX(me), clientY(me));
    };
    var render3 = function(state3) {
      return div_([h1([class_("center")])([text5("Bass Pattern Editor")]), canvas([id2("canvas"), onClick(canvasClickHandler), height8(canvasHeight), width8(canvasWidth)]), renderChordNameInput(state3), renderFirstFretNoInput(state3), div_([renderImageScaleSlider(state3), text5(show13(toNumber(state3.exportScale) / 100))]), div_([renderClearFingeringButton, renderExportPNGButton]), div_([renderLoadButton, renderSaveButton]), renderPlayButton(state3), text5(state3.errorText)]);
    };
    var alterFingering = function(fingeredString3) {
      return function(fingering3) {
        var currentStringPositions = fromJust8(index(fingering3)(fingeredString3.stringNumber));
        var newStringPositions = function() {
          var $75 = $$null(currentStringPositions);
          if ($75) {
            return [{
              fret: fingeredString3.fretNumber,
              status: Primary.value
            }];
          }
          ;
          var maybeFingering = extract3(currentStringPositions)(fingeredString3.fretNumber);
          if (maybeFingering instanceof Just) {
            var $77 = isOpenFret(maybeFingering.value0);
            if ($77) {
              return remove(currentStringPositions)(fingeredString3.fretNumber);
            }
            ;
            if (maybeFingering.value0.status instanceof Primary) {
              return setSecondaryStatus(currentStringPositions)(fingeredString3.fretNumber);
            }
            ;
            if (maybeFingering.value0.status instanceof Secondary) {
              return remove(currentStringPositions)(fingeredString3.fretNumber);
            }
            ;
            throw new Error("Failed pattern match at Bass.Page (line 411, column 19 - line 418, column 78): " + [maybeFingering.value0.status.constructor.name]);
          }
          ;
          return snoc(currentStringPositions)({
            fret: fingeredString3.fretNumber,
            status: Primary.value
          });
        }();
        var mNewFingering = updateAt(fingeredString3.stringNumber)(newStringPositions)(fingering3);
        return fromMaybe(fingering3)(mNewFingering);
      };
    };
    var handleAction = function(v) {
      if (v instanceof Init) {
        return bind10(liftEffect9(getCanvasElementById("canvas")))(function(mCanvas) {
          var canvas2 = fromJust8(mCanvas);
          return bind10(liftEffect9(getContext2D(canvas2)))(function(graphicsCtx) {
            return bind10(modify6(function(st) {
              var $81 = {};
              for (var $82 in st) {
                if ({}.hasOwnProperty.call(st, $82)) {
                  $81[$82] = st[$82];
                }
                ;
              }
              ;
              $81.mGraphicsContext = new Just(graphicsCtx);
              $81.mCanvas = mCanvas;
              return $81;
            }))(function() {
              return bind10(handleQuery(new GetCanvasOffset(unit)))(function() {
                return bind10(handleQuery(new DisplayFingering(unit)))(function() {
                  return bind10(handleQuery(new LoadInstruments(unit)))(function() {
                    return pure24(unit);
                  });
                });
              });
            });
          });
        });
      }
      ;
      if (v instanceof EditFingering) {
        return bind10(get4)(function(state3) {
          var y = toNumber(v.value1) - state3.canvasPosition.top;
          var x = toNumber(v.value0) - state3.canvasPosition.left;
          var $84 = y > titleDepth;
          if ($84) {
            var fstring = fingeredString({
              x,
              y
            });
            var newFingering = alterFingering(fstring)(state3.chordShape.fingering);
            var newShape = function() {
              var $85 = {};
              for (var $86 in state3.chordShape) {
                if ({}.hasOwnProperty.call(state3.chordShape, $86)) {
                  $85[$86] = state3["chordShape"][$86];
                }
                ;
              }
              ;
              $85.fingering = newFingering;
              return $85;
            }();
            return bind10(modify6(function(st) {
              var $88 = {};
              for (var $89 in st) {
                if ({}.hasOwnProperty.call(st, $89)) {
                  $88[$89] = st[$89];
                }
                ;
              }
              ;
              $88.chordShape = newShape;
              $88.errorText = "";
              return $88;
            }))(function() {
              return bind10(handleQuery(new DisplayFingering(unit)))(function() {
                return pure24(unit);
              });
            });
          }
          ;
          return pure24(unit);
        });
      }
      ;
      if (v instanceof GetChordName) {
        return bind10(get4)(function(state3) {
          var newShape = function() {
            var $93 = {};
            for (var $94 in state3.chordShape) {
              if ({}.hasOwnProperty.call(state3.chordShape, $94)) {
                $93[$94] = state3["chordShape"][$94];
              }
              ;
            }
            ;
            $93.name = v.value0;
            return $93;
          }();
          var newState = function() {
            var $96 = {};
            for (var $97 in state3) {
              if ({}.hasOwnProperty.call(state3, $97)) {
                $96[$97] = state3[$97];
              }
              ;
            }
            ;
            $96.chordShape = newShape;
            $96.errorText = "";
            return $96;
          }();
          return bind10(put4(newState))(function() {
            return bind10(handleQuery(new DisplayFingering(unit)))(function() {
              return pure24(unit);
            });
          });
        });
      }
      ;
      if (v instanceof GetFirstFretNumber) {
        return bind10(get4)(function(state3) {
          var fret3 = fromMaybe(0)(fromString(v.value0));
          var newShape = function() {
            var $100 = {};
            for (var $101 in state3.chordShape) {
              if ({}.hasOwnProperty.call(state3.chordShape, $101)) {
                $100[$101] = state3["chordShape"][$101];
              }
              ;
            }
            ;
            $100.firstFretOffset = fret3;
            return $100;
          }();
          var newState = function() {
            var $103 = {};
            for (var $104 in state3) {
              if ({}.hasOwnProperty.call(state3, $104)) {
                $103[$104] = state3[$104];
              }
              ;
            }
            ;
            $103.chordShape = newShape;
            $103.errorText = "";
            return $103;
          }();
          return bind10(put4(newState))(function() {
            return bind10(handleQuery(new DisplayFingering(unit)))(function() {
              return pure24(unit);
            });
          });
        });
      }
      ;
      if (v instanceof ClearFingering) {
        return bind10(modify6(function(st) {
          var $107 = {};
          for (var $108 in st) {
            if ({}.hasOwnProperty.call(st, $108)) {
              $107[$108] = st[$108];
            }
            ;
          }
          ;
          $107.chordShape = closedStringShape;
          $107.errorText = "";
          return $107;
        }))(function() {
          return bind10(handleQuery(new DisplayFingering(unit)))(function() {
            return pure24(unit);
          });
        });
      }
      ;
      if (v instanceof GetImageScale) {
        return bind10(modify6(function(st) {
          var $110 = {};
          for (var $111 in st) {
            if ({}.hasOwnProperty.call(st, $111)) {
              $110[$111] = st[$111];
            }
            ;
          }
          ;
          $110.exportScale = v.value0;
          return $110;
        }))(function() {
          return pure24(unit);
        });
      }
      ;
      if (v instanceof Export) {
        return bind10(get4)(function(state3) {
          var scaleFactor = toNumber(state3.exportScale) / 100;
          var originalCanvas = fromJust8(state3.mCanvas);
          var mimeType = toMimeType(v.value0);
          var fileName = safeName(state3.chordShape.name) + "_bass";
          return bind10(liftEffect9(scaleCanvas(originalCanvas)(scaleFactor)))(function(canvas2) {
            return bind10(liftEffect9(exportAs(canvas2)(fileName)(mimeType)))(function() {
              return pure24(unit);
            });
          });
        });
      }
      ;
      if (v instanceof Load) {
        return bind10(get4)(function(state3) {
          var validated = validateJson(v.value0.value0.contents);
          var newState = validation2(function(errs) {
            var $115 = {};
            for (var $116 in state3) {
              if ({}.hasOwnProperty.call(state3, $116)) {
                $115[$116] = state3[$116];
              }
              ;
            }
            ;
            $115.errorText = foldl5(append11)("")(errs);
            return $115;
          })(function(chordShape) {
            var $118 = {};
            for (var $119 in state3) {
              if ({}.hasOwnProperty.call(state3, $119)) {
                $118[$119] = state3[$119];
              }
              ;
            }
            ;
            $118.chordShape = chordShape;
            $118.errorText = "";
            return $118;
          })(validated);
          return bind10(put4(newState))(function() {
            return bind10(handleQuery(new DisplayFingering(unit)))(function() {
              return pure24(unit);
            });
          });
        });
      }
      ;
      if (v instanceof Save) {
        return bind10(get4)(function(state3) {
          var name16 = safeName(state3.chordShape.name) + "_bass.json";
          var contents = writeBass(state3.chordShape);
          return bind10(liftEffect9(saveTextFile({
            name: name16,
            contents
          })))(function() {
            return pure24(unit);
          });
        });
      }
      ;
      if (v instanceof PlayChord) {
        return bind10(get4)(function(state3) {
          return liftEffect9(playChord(state3.chordShape.fingering)(state3.chordShape.firstFretOffset)(state3.instruments));
        });
      }
      ;
      throw new Error("Failed pattern match at Bass.Page (line 243, column 18 - line 342, column 26): " + [v.constructor.name]);
    };
    return mkComponent({
      initialState,
      render: render3,
      "eval": mkEval({
        handleAction,
        handleQuery: defaultEval.handleQuery,
        receive: defaultEval.receive,
        initialize: new Just(Init.value),
        finalize: Nothing.value
      })
    });
  };

  // output/FrettedInstrument.Guitar.Config/index.js
  var config = /* @__PURE__ */ function() {
    return {
      name: Guitar.value,
      stringCount: 6,
      maxFrets: 27,
      openStringsChordName: "Em7+11",
      openStringMidiIds: [40, 45, 50, 55, 59, 64],
      instrumentName: AcousticGuitarSteel.value
    };
  }();

  // output/FrettedInstrument.Audio/index.js
  var max8 = /* @__PURE__ */ max(ordInt);
  var map44 = /* @__PURE__ */ map(functorArray);
  var $$void10 = /* @__PURE__ */ $$void(functorEffect);
  var possiblyBarredFret = function(stringNumber) {
    return function(fingerPosition) {
      return function(mBarre) {
        if (mBarre instanceof Just) {
          var $8 = mBarre.value0.stringNumber <= stringNumber;
          if ($8) {
            return max8(mBarre.value0.fretNumber)(fingerPosition);
          }
          ;
          return fingerPosition;
        }
        ;
        return fingerPosition;
      };
    };
  };
  var channel = 0;
  var toNote2 = function(config4) {
    return function(firstFretOffset) {
      return function(mBarre) {
        return function(stringNumber) {
          return function(fingerPosition) {
            var openStringId = fromMaybe(0)(index(config4.openStringMidiIds)(stringNumber));
            var actualFret = possiblyBarredFret(stringNumber)(fingerPosition)(mBarre);
            var id4 = function() {
              var $10 = actualFret < 0;
              if ($10) {
                return 0;
              }
              ;
              return (openStringId + actualFret | 0) + firstFretOffset | 0;
            }();
            return {
              channel,
              id: id4,
              timeOffset: 0,
              duration: 2,
              gain: 1
            };
          };
        };
      };
    };
  };
  var getMidiPitches = function(config4) {
    return function(fingering3) {
      return function(firstFretOffset) {
        return function(mBarre) {
          var notes = mapWithIndex(toNote2(config4)(firstFretOffset)(mBarre))(fingering3);
          return map44(function(v) {
            return v.id;
          })(notes);
        };
      };
    };
  };
  var playChord2 = function(config4) {
    return function(fingering3) {
      return function(firstFretOffset) {
        return function(mBarre) {
          return function(instruments) {
            var notes = mapWithIndex(toNote2(config4)(firstFretOffset)(mBarre))(fingering3);
            return $$void10(playNotes(instruments)(notes));
          };
        };
      };
    };
  };

  // output/FrettedInstrument.Graphics/index.js
  var mempty5 = /* @__PURE__ */ mempty(monoidDrawing);
  var show9 = /* @__PURE__ */ show(showInt);
  var min7 = /* @__PURE__ */ min(ordInt);
  var append12 = /* @__PURE__ */ append(semigroupDrawing);
  var foldl6 = /* @__PURE__ */ foldl(foldableArray);
  var max9 = /* @__PURE__ */ max(ordNumber);
  var titleDepth2 = 35;
  var stringWidth2 = 2;
  var stringIsBarred = function(mFingeredString) {
    return function(stringNum) {
      if (mFingeredString instanceof Just) {
        return mFingeredString.value0.stringNumber <= stringNum;
      }
      ;
      return false;
    };
  };
  var nutyOffset2 = 70;
  var fretWidth2 = 2;
  var cellSize2 = 36;
  var fretDepth2 = cellSize2;
  var stringLength2 = /* @__PURE__ */ function() {
    return toNumber(displayedFretCount) * fretDepth2;
  }();
  var nutDepth2 = /* @__PURE__ */ function() {
    return cellSize2 / 3;
  }();
  var nutxOffset2 = /* @__PURE__ */ function() {
    return cellSize2 * 1.5;
  }();
  var firstFretLabel2 = function(fretNo) {
    var $22 = fretNo < 1 || fretNo >= 10;
    if ($22) {
      return mempty5;
    }
    ;
    var ypos = nutDepth2 + nutyOffset2 + fretDepth2 * 0.6;
    var xpos = nutxOffset2 * 0.6;
    var theFont = font2(sansSerif)(20)(light);
    var displayNumber = show9(fretNo);
    return text6(theFont)(xpos)(ypos)(fillColor(black))(displayNumber);
  };
  var stringSeparation2 = cellSize2;
  var fingeredString2 = function(config4) {
    return function(coords2) {
      var stringNumber = function() {
        var $23 = coords2.x < nutxOffset2 / 2;
        if ($23) {
          return 0;
        }
        ;
        return floor2((coords2.x - nutxOffset2 / 2) / stringSeparation2);
      }();
      var fretNumber = function() {
        var $24 = coords2.y < nutDepth2 + nutyOffset2;
        if ($24) {
          return 0;
        }
        ;
        return floor2((coords2.y - (nutDepth2 + nutyOffset2)) / fretDepth2) + 1 | 0;
      }();
      return {
        stringNumber: min7(stringNumber)(config4.stringCount - 1 | 0),
        fretNumber: min7(fretNumber)(displayedFretCount)
      };
    };
  };
  var neckWidth2 = function(config4) {
    return stringSeparation2 * toNumber(config4.stringCount - 1 | 0);
  };
  var fret2 = function(config4) {
    return function(n) {
      var fretyOffset = toNumber(n) * fretDepth2;
      return filled(fillColor(black))(rectangle(nutxOffset2)(nutDepth2 + nutyOffset2 + fretyOffset)(neckWidth2(config4))(fretWidth2));
    };
  };
  var frets2 = function(config4) {
    var fretNums = range(1)(displayedFretCount);
    var f = function(acc) {
      return function(n) {
        return append12(acc)(fret2(config4)(n));
      };
    };
    return foldl6(f)(mempty5)(fretNums);
  };
  var nut2 = function(config4) {
    return filled(fillColor(graytone(0.8)))(rectangle(nutxOffset2)(nutyOffset2)(neckWidth2(config4) + stringWidth2)(nutDepth2));
  };
  var openString2 = function(stringNum) {
    var xpos = nutxOffset2 + toNumber(stringNum) * stringSeparation2;
    var outerRadius = 0.5 * fretDepth2 / 2;
    var ypos = nutyOffset2 - (outerRadius + 4);
    var innerRadius = outerRadius - 2;
    return append12(filled(fillColor(black))(circle(xpos)(ypos)(outerRadius)))(filled(fillColor(white))(circle(xpos)(ypos)(innerRadius)));
  };
  var silentString2 = function(stringNum) {
    var ypos = nutyOffset2 - nutDepth2 * 0.5;
    var theFont = font2(sansSerif)(26)(bold);
    var barLength = 0.25 * stringSeparation2;
    var xpos = nutxOffset2 + toNumber(stringNum) * stringSeparation2 - barLength;
    return text6(theFont)(xpos)(ypos)(fillColor(black))("x");
  };
  var finger2 = function(config4) {
    return function(mBarre) {
      return function(stringNum) {
        return function(fretNum) {
          var xpos = nutxOffset2 + toNumber(stringNum) * stringSeparation2;
          var radius = 0.7 * fretDepth2 / 2;
          var ypos = nutDepth2 + nutyOffset2 + toNumber(fretNum) * fretDepth2 - (radius + 2);
          var $25 = fretNum > displayedFretCount || (stringNum < 0 || stringNum >= config4.stringCount);
          if ($25) {
            return mempty5;
          }
          ;
          var $26 = stringIsBarred(mBarre)(stringNum) && fretNum <= open;
          if ($26) {
            return mempty5;
          }
          ;
          var $27 = fretNum === open;
          if ($27) {
            return openString2(stringNum);
          }
          ;
          var $28 = fretNum === silent;
          if ($28) {
            return silentString2(stringNum);
          }
          ;
          return filled(fillColor(black))(circle(xpos)(ypos)(radius));
        };
      };
    };
  };
  var fingering2 = function(config4) {
    return function(fingerSpec) {
      return function(mBarre) {
        return foldl6(append12)(mempty5)(mapWithIndex(finger2(config4)(mBarre))(fingerSpec));
      };
    };
  };
  var string2 = function(n) {
    var yOffset = nutDepth2 + nutyOffset2;
    var xOffset = nutxOffset2 + toNumber(n) * stringSeparation2;
    return filled(fillColor(black))(rectangle(xOffset)(yOffset)(stringWidth2)(stringLength2));
  };
  var strings2 = function(config4) {
    var stringNums = range(0)(config4.stringCount - 1 | 0);
    var f = function(acc) {
      return function(n) {
        return append12(acc)(string2(n));
      };
    };
    return foldl6(f)(mempty5)(stringNums);
  };
  var title4 = function(config4) {
    return function(name16) {
      var theFont = font2(sansSerif)(35)(bold);
      var displayName = function() {
        var $29 = length2(name16) > 9;
        if ($29) {
          return dropRight(length2(name16) - 9 | 0)(name16);
        }
        ;
        return name16;
      }();
      var textWidth = cellSize2 / 1.8 * toNumber(length2(displayName));
      var unsafeTitlexOffset = nutxOffset2 + neckWidth2(config4) / 2 - textWidth / 2;
      var titlexOffset = max9(unsafeTitlexOffset)(nutxOffset2);
      return text6(theFont)(titlexOffset)(titleDepth2)(fillColor(black))(displayName);
    };
  };
  var canvasWidth2 = function(config4) {
    return round2(neckWidth2(config4) + 2 * nutxOffset2);
  };
  var canvasHeight2 = /* @__PURE__ */ function() {
    return round2(nutDepth2 + nutyOffset2 + stringLength2 + cellSize2);
  }();
  var barre = function(config4) {
    return function(mFingeredString) {
      if (mFingeredString instanceof Just) {
        var ystart = nutDepth2 + nutyOffset2 + toNumber(mFingeredString.value0.fretNumber) * fretDepth2 - fretDepth2 / 1.75;
        var ylen = cellSize2 / 2.5;
        var xstart = nutxOffset2 + toNumber(mFingeredString.value0.stringNumber) * stringSeparation2 - stringSeparation2 / 4;
        var xlen = toNumber((config4.stringCount - mFingeredString.value0.stringNumber | 0) - 1 | 0) * stringSeparation2 + stringSeparation2 / 2;
        return filled(fillColor(black))(rectangle(xstart)(ystart)(xlen)(ylen));
      }
      ;
      return mempty5;
    };
  };
  var displayChord2 = function(config4) {
    return function(chord) {
      return append12(title4(config4)(chord.name))(append12(nut2(config4))(append12(frets2(config4))(append12(strings2(config4))(append12(barre(config4)(chord.barre))(append12(fingering2(config4)(chord.fingering)(chord.barre))(firstFretLabel2(chord.firstFretOffset)))))));
    };
  };

  // output/FrettedInstrument.Validation/index.js
  var pure25 = /* @__PURE__ */ pure(applicativeNonEmptyList);
  var show10 = /* @__PURE__ */ show(showInt);
  var pure112 = /* @__PURE__ */ pure(/* @__PURE__ */ applicativeV2(semigroupNonEmptyList));
  var intercalate6 = /* @__PURE__ */ intercalate(foldableArray)(monoidString);
  var map45 = /* @__PURE__ */ map(functorArray);
  var apply7 = /* @__PURE__ */ apply(/* @__PURE__ */ applyV(semigroupNonEmptyList));
  var map119 = /* @__PURE__ */ map(functorV);
  var show14 = /* @__PURE__ */ show(showFrettedInstrumentName);
  var validateFirstFretOffset2 = function(config4) {
    return function(offset) {
      var $25 = offset < 0 || offset > config4.maxFrets;
      if ($25) {
        return invalid2(pure25("First fret offset should be between 0 and " + (show10(config4.maxFrets) + ".")));
      }
      ;
      return pure112(offset);
    };
  };
  var validateFingerPositions2 = function(config4) {
    return function(fingering3) {
      var fingerOutOfRange = function(fingerPosition) {
        return fingerPosition < (-1 | 0) || fingerPosition >= config4.maxFrets;
      };
      var v = filter(fingerOutOfRange)(fingering3);
      if (v.length === 0) {
        return pure112(fingering3);
      }
      ;
      if (v.length === 1) {
        return invalid2(pure25("Finger position " + (show10(v[0]) + " is out of range.")));
      }
      ;
      var fingers2 = intercalate6(", ")(map45(show10)(v));
      return invalid2(pure25("Finger positions " + (fingers2 + " are out of range.")));
    };
  };
  var validateFingering2 = function(config4) {
    return function(fingering3) {
      var message2 = "Fingering for all " + (show10(config4.stringCount) + " strings is required.");
      var $28 = length(fingering3) !== config4.stringCount;
      if ($28) {
        return invalid2(pure25(message2));
      }
      ;
      return validateFingerPositions2(config4)(fingering3);
    };
  };
  var validateBarre = function(mbarre) {
    if (mbarre instanceof Just) {
      var $30 = mbarre.value0.stringNumber < 0 || mbarre.value0.stringNumber >= 6;
      if ($30) {
        return invalid2(pure25("Invalid string number of " + (show10(mbarre.value0.stringNumber) + " in the barr\xE9.")));
      }
      ;
      var $31 = mbarre.value0.fretNumber < 1 || mbarre.value0.fretNumber >= displayedFretCount;
      if ($31) {
        return invalid2(pure25("Invalid fret number of " + (show10(mbarre.value0.fretNumber) + (" in the barr\xE9 which should be between 1 and " + (show10(displayedFretCount - 1 | 0) + ".")))));
      }
      ;
      return pure112(mbarre);
    }
    ;
    return pure112(mbarre);
  };
  var hiddenByBarre = function(mBarre) {
    return function(fs) {
      if (mBarre instanceof Just) {
        return fs.fretNumber > 0 && (mBarre.value0.stringNumber <= fs.stringNumber && mBarre.value0.fretNumber >= fs.fretNumber);
      }
      ;
      return false;
    };
  };
  var checkHiddenByBarre = function(chordShape) {
    if (chordShape.barre instanceof Just) {
      var f = function(stringNumber) {
        return function(fretNumber) {
          var $36 = hiddenByBarre(chordShape.barre)({
            stringNumber,
            fretNumber
          });
          if ($36) {
            return stringNumber;
          }
          ;
          return -1 | 0;
        };
      };
      var hiddenStrings = filter(function(s) {
        return s >= 0;
      })(mapWithIndex(f)(chordShape.fingering));
      if (hiddenStrings.length === 0) {
        return pure112(chordShape);
      }
      ;
      if (hiddenStrings.length === 1) {
        return invalid2(pure25("Fingering for string " + (show10(hiddenStrings[0]) + " is hidden by the barr\xE9.")));
      }
      ;
      var fingers2 = intercalate6(", ")(map45(show10)(hiddenStrings));
      return invalid2(pure25("Fingering for strings " + (fingers2 + " is hidden by the barr\xE9.")));
    }
    ;
    return pure112(chordShape);
  };
  var validate2 = function(config4) {
    return function(chordShape) {
      return andThen(apply7(apply7(map119(function(v) {
        return function(v1) {
          return function(v2) {
            return {
              name: chordShape.name,
              firstFretOffset: v,
              barre: v1,
              fingering: v2
            };
          };
        };
      })(validateFirstFretOffset2(config4)(chordShape.firstFretOffset)))(validateBarre(chordShape.barre)))(validateFingering2(config4)(chordShape.fingering)))(checkHiddenByBarre);
    };
  };
  var validateJson2 = function(config4) {
    return function(json) {
      var message2 = "Not a recognisable " + (toLower(show14(config4.name)) + " chord format.");
      return either($$const(invalid2(pure25(message2))))(validate2(config4))(readFrettedInstrument(json));
    };
  };

  // output/FrettedInstrument.Page/index.js
  var all4 = /* @__PURE__ */ all(foldableArray)(heytingAlgebraBoolean);
  var intercalate7 = /* @__PURE__ */ intercalate(foldableArray)(monoidString);
  var map46 = /* @__PURE__ */ map(functorArray);
  var show11 = /* @__PURE__ */ show(showInt);
  var append13 = /* @__PURE__ */ append(semigroupString);
  var slot3 = /* @__PURE__ */ slot()({
    reflectSymbol: function() {
      return "loadfile";
    }
  })(ordUnit);
  var type_21 = /* @__PURE__ */ type_17(isPropInputType);
  var value16 = /* @__PURE__ */ value12(isPropString);
  var fromJust9 = /* @__PURE__ */ fromJust();
  var show15 = /* @__PURE__ */ show(showFrettedInstrumentName);
  var show23 = /* @__PURE__ */ show(showNumber);
  var bind11 = /* @__PURE__ */ bind(bindHalogenM);
  var modify7 = /* @__PURE__ */ modify2(monadStateHalogenM);
  var pure26 = /* @__PURE__ */ pure(applicativeHalogenM);
  var get5 = /* @__PURE__ */ get(monadStateHalogenM);
  var put5 = /* @__PURE__ */ put(monadStateHalogenM);
  var foldl7 = /* @__PURE__ */ foldl(foldableNonEmptyList);
  var GetCanvasOffset2 = /* @__PURE__ */ function() {
    function GetCanvasOffset4(value0) {
      this.value0 = value0;
    }
    ;
    GetCanvasOffset4.create = function(value0) {
      return new GetCanvasOffset4(value0);
    };
    return GetCanvasOffset4;
  }();
  var LoadInstruments2 = /* @__PURE__ */ function() {
    function LoadInstruments4(value0) {
      this.value0 = value0;
    }
    ;
    LoadInstruments4.create = function(value0) {
      return new LoadInstruments4(value0);
    };
    return LoadInstruments4;
  }();
  var EditFingering2 = /* @__PURE__ */ function() {
    function EditFingering4(value0) {
      this.value0 = value0;
    }
    ;
    EditFingering4.create = function(value0) {
      return new EditFingering4(value0);
    };
    return EditFingering4;
  }();
  var DisplayFingering2 = /* @__PURE__ */ function() {
    function DisplayFingering4(value0) {
      this.value0 = value0;
    }
    ;
    DisplayFingering4.create = function(value0) {
      return new DisplayFingering4(value0);
    };
    return DisplayFingering4;
  }();
  var Init2 = /* @__PURE__ */ function() {
    function Init5() {
    }
    ;
    Init5.value = new Init5();
    return Init5;
  }();
  var MouseDown = /* @__PURE__ */ function() {
    function MouseDown2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    MouseDown2.create = function(value0) {
      return function(value1) {
        return new MouseDown2(value0, value1);
      };
    };
    return MouseDown2;
  }();
  var MouseUp = /* @__PURE__ */ function() {
    function MouseUp2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    MouseUp2.create = function(value0) {
      return function(value1) {
        return new MouseUp2(value0, value1);
      };
    };
    return MouseUp2;
  }();
  var ClearFingering2 = /* @__PURE__ */ function() {
    function ClearFingering4() {
    }
    ;
    ClearFingering4.value = new ClearFingering4();
    return ClearFingering4;
  }();
  var GetChordName2 = /* @__PURE__ */ function() {
    function GetChordName4(value0) {
      this.value0 = value0;
    }
    ;
    GetChordName4.create = function(value0) {
      return new GetChordName4(value0);
    };
    return GetChordName4;
  }();
  var GetFirstFretNumber2 = /* @__PURE__ */ function() {
    function GetFirstFretNumber3(value0) {
      this.value0 = value0;
    }
    ;
    GetFirstFretNumber3.create = function(value0) {
      return new GetFirstFretNumber3(value0);
    };
    return GetFirstFretNumber3;
  }();
  var GetImageScale2 = /* @__PURE__ */ function() {
    function GetImageScale4(value0) {
      this.value0 = value0;
    }
    ;
    GetImageScale4.create = function(value0) {
      return new GetImageScale4(value0);
    };
    return GetImageScale4;
  }();
  var Export2 = /* @__PURE__ */ function() {
    function Export4(value0) {
      this.value0 = value0;
    }
    ;
    Export4.create = function(value0) {
      return new Export4(value0);
    };
    return Export4;
  }();
  var Load2 = /* @__PURE__ */ function() {
    function Load4(value0) {
      this.value0 = value0;
    }
    ;
    Load4.create = function(value0) {
      return new Load4(value0);
    };
    return Load4;
  }();
  var Save2 = /* @__PURE__ */ function() {
    function Save4() {
    }
    ;
    Save4.value = new Save4();
    return Save4;
  }();
  var PlayChord2 = /* @__PURE__ */ function() {
    function PlayChord4() {
    }
    ;
    PlayChord4.value = new PlayChord4();
    return PlayChord4;
  }();
  var _loadfile2 = /* @__PURE__ */ function() {
    return $$Proxy.value;
  }();
  var component3 = function(dictMonadAff) {
    var liftAff2 = liftAff(monadAffHalogenM(dictMonadAff));
    var liftEffect9 = liftEffect(monadEffectHalogenM(dictMonadAff.MonadEffect0()));
    var silentChord = function(fingering3) {
      return function(mBarre) {
        return isNothing(mBarre) && all4(function(fret3) {
          return fret3 === silent;
        })(fingering3);
      };
    };
    var renderSaveButton = button([onClick(function(v) {
      return Save2.value;
    }), class_("hoverable"), enabled(true)])([text5("save")]);
    var renderPlayButton = function(state3) {
      var enabled2 = length(state3.instruments) > 0 && !silentChord(state3.chordShape.fingering)(state3.chordShape.barre);
      var className2 = function() {
        if (enabled2) {
          return "hoverable";
        }
        ;
        return "unhoverable";
      }();
      return div_([button([onClick(function(v) {
        return PlayChord2.value;
      }), class_(className2), enabled(enabled2)])([text5("play")])]);
    };
    var renderPitches = function(state3) {
      var $72 = $$null(state3.pitches);
      if ($72) {
        return text5("");
      }
      ;
      var pitchesString = intercalate7(", ")(map46(show11)(state3.pitches));
      var notes = intercalate7(", ")(map46(toPitchClass)(state3.pitches));
      return div_([div_([text5("pitches: " + pitchesString)]), div_([text5("notes: " + notes)])]);
    };
    var renderLoadButton = slot3(_loadfile2)(unit)(component(dictMonadAff)(jsonFileInputCtx))(unit)(Load2.create);
    var renderImageScaleSlider = function(state3) {
      var toScale = function(s) {
        return fromMaybe(100)(fromString(s));
      };
      return div3([class_("leftPanelComponent")])([label4([class_("labelAlignment")])([text5("scale download:")]), input2([onValueInput(function($173) {
        return GetImageScale2.create(toScale($173));
      }), type_21(InputRange.value), id2("scale-slider"), class_("scaling-slider"), min5(25), max6(1e3), step4(new Step(25)), value16(show11(state3.exportScale))])]);
    };
    var renderFirstFretNoInput = function(state3) {
      return div3([id2("fret-number-div")])([label4([id2("fret-number-label")])([text5("first fret number:")]), input2([onValueInput(GetFirstFretNumber2.create), value16(show11(state3.chordShape.firstFretOffset)), type_21(InputNumber.value), min5(0), max6(9), id2("fret-number-edit"), class_("text-input")])]);
    };
    var renderExportPNGButton = button([onClick(function(v) {
      return new Export2(PNG.value);
    }), class_("hoverable"), enabled(true)])([text5("download PNG")]);
    var renderClearFingeringButton = button([onClick(function(v) {
      return ClearFingering2.value;
    }), class_("hoverable"), enabled(true)])([text5("clear fingering")]);
    var renderChordNameInput = function(state3) {
      return div3([id2("chord-name-div")])([label4([id2("chord-name-label")])([text5("chord name:")]), input2([onValueInput(GetChordName2.create), value16(state3.chordShape.name), type_21(InputText.value), id2("chord-name-edit"), class_("text-input")])]);
    };
    var openStringChordShape = function(config4) {
      return {
        name: config4.openStringsChordName,
        firstFretOffset: 0,
        barre: Nothing.value,
        fingering: openStrings(config4.stringCount)
      };
    };
    var mouseAction = function(mDownFinger) {
      return function(mUpFinger) {
        var v = new Tuple(mDownFinger, mUpFinger);
        if (v.value0 instanceof Just && v.value1 instanceof Just) {
          var $74 = v.value0.value0.fretNumber === v.value1.value0.fretNumber && v.value0.value0.stringNumber === v.value1.value0.stringNumber;
          if ($74) {
            return new OneFret(v.value0.value0);
          }
          ;
          var $75 = v.value0.value0.fretNumber === v.value1.value0.fretNumber && (v.value0.value0.stringNumber < v.value1.value0.stringNumber && v.value0.value0.fretNumber > 0);
          if ($75) {
            return new Barre(v.value0.value0);
          }
          ;
          return NoFret.value;
        }
        ;
        return NoFret.value;
      };
    };
    var initialState = function(input3) {
      return {
        mGraphicsContext: Nothing.value,
        mCanvas: Nothing.value,
        canvasPosition: {
          left: 0,
          top: 0
        },
        mouseDownFinger: Nothing.value,
        mouseUpFinger: Nothing.value,
        chordShape: openStringChordShape(input3.config),
        exportScale: 100,
        instruments: [],
        pitches: [],
        errorText: "",
        config: input3.config
      };
    };
    var hiddenByBarre2 = function(mBarre) {
      return function(fs) {
        if (mBarre instanceof Just) {
          return mBarre.value0.stringNumber <= fs.stringNumber && mBarre.value0.fretNumber >= fs.fretNumber;
        }
        ;
        return false;
      };
    };
    var removeHiddenFingering = function(mBarre) {
      return function(fingering3) {
        if (mBarre instanceof Just) {
          var f = function(stringNumber) {
            return function(fretNumber) {
              var $83 = hiddenByBarre2(mBarre)({
                stringNumber,
                fretNumber
              });
              if ($83) {
                return open;
              }
              ;
              return fretNumber;
            };
          };
          return mapWithIndex(f)(fingering3);
        }
        ;
        return fingering3;
      };
    };
    var clearCanvas = function(state3) {
      var graphicsContext = fromJust9(state3.mGraphicsContext);
      return clearRect(graphicsContext)({
        x: 0,
        y: 0,
        width: toNumber(canvasWidth2(state3.config)),
        height: toNumber(canvasHeight2)
      });
    };
    var canvasMouseUpHandler = function(me) {
      return new MouseUp(clientX(me), clientY(me));
    };
    var canvasMouseDownHandler = function(me) {
      return new MouseDown(clientX(me), clientY(me));
    };
    var render3 = function(state3) {
      return div_([h1([class_("center")])([text5(show15(state3.config.name) + " Chord Editor")]), canvas([id2("canvas"), onMouseDown(canvasMouseDownHandler), onMouseUp(canvasMouseUpHandler), height8(canvasHeight2), width8(canvasWidth2(state3.config))]), renderChordNameInput(state3), renderFirstFretNoInput(state3), div_([renderImageScaleSlider(state3), text5(show23(toNumber(state3.exportScale) / 100))]), div_([renderClearFingeringButton, renderExportPNGButton]), div_([renderLoadButton, renderSaveButton]), renderPlayButton(state3), renderPitches(state3), text5(state3.errorText)]);
    };
    var alterFingering = function(fingeredString3) {
      return function(fingering3) {
        return function(mBarre) {
          var currentFret = fromJust9(index(fingering3)(fingeredString3.stringNumber));
          var newFret = function() {
            var $85 = fingeredString3.fretNumber === 0;
            if ($85) {
              var $86 = currentFret === open;
              if ($86) {
                return silent;
              }
              ;
              return open;
            }
            ;
            var $87 = hiddenByBarre2(mBarre)(fingeredString3);
            if ($87) {
              return currentFret;
            }
            ;
            var $88 = fingeredString3.fretNumber === currentFret;
            if ($88) {
              return open;
            }
            ;
            return fingeredString3.fretNumber;
          }();
          var mNewFingering = updateAt(fingeredString3.stringNumber)(newFret)(fingering3);
          return fromMaybe(fingering3)(mNewFingering);
        };
      };
    };
    var handleQuery = function(v) {
      if (v instanceof GetCanvasOffset2) {
        return bind11(liftAff2(selectElement("#canvas")))(function(mCanvasElement) {
          var canvasElement = fromJust9(mCanvasElement);
          return bind11(liftEffect9(offsetLeft(canvasElement)))(function(left) {
            return bind11(liftEffect9(offsetTop(canvasElement)))(function(top3) {
              return bind11(modify7(function(st) {
                var $90 = {};
                for (var $91 in st) {
                  if ({}.hasOwnProperty.call(st, $91)) {
                    $90[$91] = st[$91];
                  }
                  ;
                }
                ;
                $90.canvasPosition = {
                  left,
                  top: top3
                };
                return $90;
              }))(function() {
                return pure26(new Just(v.value0));
              });
            });
          });
        });
      }
      ;
      if (v instanceof LoadInstruments2) {
        return bind11(get5)(function(state3) {
          return bind11(liftAff2(loadRemoteSoundFonts([state3.config.instrumentName])))(function(instruments) {
            return bind11(modify7(function(st) {
              var $94 = {};
              for (var $95 in st) {
                if ({}.hasOwnProperty.call(st, $95)) {
                  $94[$95] = st[$95];
                }
                ;
              }
              ;
              $94.instruments = instruments;
              return $94;
            }))(function() {
              return pure26(new Just(v.value0));
            });
          });
        });
      }
      ;
      if (v instanceof EditFingering2) {
        return bind11(get5)(function(state3) {
          var action2 = mouseAction(state3.mouseDownFinger)(state3.mouseUpFinger);
          if (action2 instanceof OneFret) {
            var newFingering = alterFingering(action2.value0)(state3.chordShape.fingering)(state3.chordShape.barre);
            var newChord = function() {
              var $99 = {};
              for (var $100 in state3.chordShape) {
                if ({}.hasOwnProperty.call(state3.chordShape, $100)) {
                  $99[$100] = state3["chordShape"][$100];
                }
                ;
              }
              ;
              $99.fingering = newFingering;
              return $99;
            }();
            return bind11(modify7(function(st) {
              var $102 = {};
              for (var $103 in st) {
                if ({}.hasOwnProperty.call(st, $103)) {
                  $102[$103] = st[$103];
                }
                ;
              }
              ;
              $102.chordShape = newChord;
              return $102;
            }))(function() {
              return bind11(handleQuery(new DisplayFingering2(unit)))(function() {
                return pure26(new Just(v.value0));
              });
            });
          }
          ;
          if (action2 instanceof Barre) {
            var newFingering = removeHiddenFingering(new Just(action2.value0))(state3.chordShape.fingering);
            var newShape = function() {
              var $106 = {};
              for (var $107 in state3.chordShape) {
                if ({}.hasOwnProperty.call(state3.chordShape, $107)) {
                  $106[$107] = state3["chordShape"][$107];
                }
                ;
              }
              ;
              $106.barre = new Just(action2.value0);
              $106.fingering = newFingering;
              return $106;
            }();
            var newState = function() {
              var $109 = {};
              for (var $110 in state3) {
                if ({}.hasOwnProperty.call(state3, $110)) {
                  $109[$110] = state3[$110];
                }
                ;
              }
              ;
              $109.chordShape = newShape;
              return $109;
            }();
            return bind11(put5(newState))(function() {
              return bind11(handleQuery(new DisplayFingering2(unit)))(function() {
                return pure26(new Just(v.value0));
              });
            });
          }
          ;
          return pure26(new Just(v.value0));
        });
      }
      ;
      if (v instanceof DisplayFingering2) {
        return bind11(get5)(function(state3) {
          var graphicsCtx = fromJust9(state3.mGraphicsContext);
          return bind11(liftEffect9(function __do2() {
            clearCanvas(state3)();
            return render(graphicsCtx)(displayChord2(state3.config)(state3.chordShape))();
          }))(function() {
            return pure26(new Just(v.value0));
          });
        });
      }
      ;
      throw new Error("Failed pattern match at FrettedInstrument.Page (line 436, column 17 - line 492, column 23): " + [v.constructor.name]);
    };
    var handleAction = function(v) {
      if (v instanceof Init2) {
        return bind11(liftEffect9(getCanvasElementById("canvas")))(function(mCanvas) {
          var canvas2 = fromJust9(mCanvas);
          return bind11(liftEffect9(getContext2D(canvas2)))(function(graphicsCtx) {
            return bind11(modify7(function(st) {
              var $116 = {};
              for (var $117 in st) {
                if ({}.hasOwnProperty.call(st, $117)) {
                  $116[$117] = st[$117];
                }
                ;
              }
              ;
              $116.mGraphicsContext = new Just(graphicsCtx);
              $116.mCanvas = mCanvas;
              return $116;
            }))(function() {
              return bind11(handleQuery(new GetCanvasOffset2(unit)))(function() {
                return bind11(handleQuery(new DisplayFingering2(unit)))(function() {
                  return bind11(handleQuery(new LoadInstruments2(unit)))(function() {
                    return pure26(unit);
                  });
                });
              });
            });
          });
        });
      }
      ;
      if (v instanceof MouseDown) {
        return bind11(get5)(function(state3) {
          var y = toNumber(v.value1) - state3.canvasPosition.top;
          var x = toNumber(v.value0) - state3.canvasPosition.left;
          var $119 = y > titleDepth2;
          if ($119) {
            var fstring = fingeredString2(state3.config)({
              x,
              y
            });
            return bind11(modify7(function(st) {
              var $120 = {};
              for (var $121 in st) {
                if ({}.hasOwnProperty.call(st, $121)) {
                  $120[$121] = st[$121];
                }
                ;
              }
              ;
              $120.mouseDownFinger = new Just(fstring);
              $120.errorText = "";
              $120.pitches = [];
              return $120;
            }))(function() {
              return pure26(unit);
            });
          }
          ;
          return bind11(modify7(function(st) {
            var $123 = {};
            for (var $124 in st) {
              if ({}.hasOwnProperty.call(st, $124)) {
                $123[$124] = st[$124];
              }
              ;
            }
            ;
            $123.mouseDownFinger = Nothing.value;
            $123.errorText = "";
            $123.pitches = [];
            return $123;
          }))(function() {
            return pure26(unit);
          });
        });
      }
      ;
      if (v instanceof MouseUp) {
        return bind11(get5)(function(state3) {
          var y = toNumber(v.value1) - state3.canvasPosition.top;
          var x = toNumber(v.value0) - state3.canvasPosition.left;
          var $128 = y > titleDepth2;
          if ($128) {
            var fstring = fingeredString2(state3.config)({
              x,
              y
            });
            return bind11(modify7(function(st) {
              var $129 = {};
              for (var $130 in st) {
                if ({}.hasOwnProperty.call(st, $130)) {
                  $129[$130] = st[$130];
                }
                ;
              }
              ;
              $129.mouseUpFinger = new Just(fstring);
              $129.errorText = "";
              return $129;
            }))(function() {
              return bind11(handleQuery(new EditFingering2(unit)))(function() {
                return pure26(unit);
              });
            });
          }
          ;
          return bind11(modify7(function(st) {
            var $132 = {};
            for (var $133 in st) {
              if ({}.hasOwnProperty.call(st, $133)) {
                $132[$133] = st[$133];
              }
              ;
            }
            ;
            $132.mouseUpFinger = Nothing.value;
            return $132;
          }))(function() {
            return pure26(unit);
          });
        });
      }
      ;
      if (v instanceof GetChordName2) {
        return bind11(get5)(function(state3) {
          var newShape = function() {
            var $137 = {};
            for (var $138 in state3.chordShape) {
              if ({}.hasOwnProperty.call(state3.chordShape, $138)) {
                $137[$138] = state3["chordShape"][$138];
              }
              ;
            }
            ;
            $137.name = v.value0;
            return $137;
          }();
          var newState = function() {
            var $140 = {};
            for (var $141 in state3) {
              if ({}.hasOwnProperty.call(state3, $141)) {
                $140[$141] = state3[$141];
              }
              ;
            }
            ;
            $140.chordShape = newShape;
            $140.errorText = "";
            $140.pitches = [];
            return $140;
          }();
          return bind11(put5(newState))(function() {
            return bind11(handleQuery(new DisplayFingering2(unit)))(function() {
              return pure26(unit);
            });
          });
        });
      }
      ;
      if (v instanceof GetFirstFretNumber2) {
        return bind11(get5)(function(state3) {
          var fret3 = fromMaybe(0)(fromString(v.value0));
          var newShape = function() {
            var $144 = {};
            for (var $145 in state3.chordShape) {
              if ({}.hasOwnProperty.call(state3.chordShape, $145)) {
                $144[$145] = state3["chordShape"][$145];
              }
              ;
            }
            ;
            $144.firstFretOffset = fret3;
            return $144;
          }();
          var newState = function() {
            var $147 = {};
            for (var $148 in state3) {
              if ({}.hasOwnProperty.call(state3, $148)) {
                $147[$148] = state3[$148];
              }
              ;
            }
            ;
            $147.chordShape = newShape;
            $147.errorText = "";
            return $147;
          }();
          return bind11(put5(newState))(function() {
            return bind11(handleQuery(new DisplayFingering2(unit)))(function() {
              return pure26(unit);
            });
          });
        });
      }
      ;
      if (v instanceof ClearFingering2) {
        return bind11(get5)(function(state3) {
          return bind11(modify7(function(st) {
            var $151 = {};
            for (var $152 in st) {
              if ({}.hasOwnProperty.call(st, $152)) {
                $151[$152] = st[$152];
              }
              ;
            }
            ;
            $151.chordShape = openStringChordShape(state3.config);
            $151.errorText = "";
            $151.pitches = [];
            return $151;
          }))(function() {
            return bind11(handleQuery(new DisplayFingering2(unit)))(function() {
              return pure26(unit);
            });
          });
        });
      }
      ;
      if (v instanceof GetImageScale2) {
        return bind11(modify7(function(st) {
          var $154 = {};
          for (var $155 in st) {
            if ({}.hasOwnProperty.call(st, $155)) {
              $154[$155] = st[$155];
            }
            ;
          }
          ;
          $154.exportScale = v.value0;
          return $154;
        }))(function() {
          return pure26(unit);
        });
      }
      ;
      if (v instanceof Export2) {
        return bind11(get5)(function(state3) {
          var scaleFactor = toNumber(state3.exportScale) / 100;
          var originalCanvas = fromJust9(state3.mCanvas);
          var mimeType = toMimeType(v.value0);
          var fileName = safeName(state3.chordShape.name) + ("_" + instrumentNameToFileName(state3.config.name));
          return bind11(liftEffect9(scaleCanvas(originalCanvas)(scaleFactor)))(function(canvas2) {
            return bind11(liftEffect9(exportAs(canvas2)(fileName)(mimeType)))(function() {
              return pure26(unit);
            });
          });
        });
      }
      ;
      if (v instanceof Load2) {
        return bind11(get5)(function(state3) {
          var validated = validateJson2(state3.config)(v.value0.value0.contents);
          var newState = validation2(function(errs) {
            var $159 = {};
            for (var $160 in state3) {
              if ({}.hasOwnProperty.call(state3, $160)) {
                $159[$160] = state3[$160];
              }
              ;
            }
            ;
            $159.errorText = foldl7(append13)("")(errs);
            return $159;
          })(function(chordShape) {
            var $162 = {};
            for (var $163 in state3) {
              if ({}.hasOwnProperty.call(state3, $163)) {
                $162[$163] = state3[$163];
              }
              ;
            }
            ;
            $162.chordShape = chordShape;
            $162.errorText = "";
            return $162;
          })(validated);
          return bind11(put5(function() {
            var $165 = {};
            for (var $166 in newState) {
              if ({}.hasOwnProperty.call(newState, $166)) {
                $165[$166] = newState[$166];
              }
              ;
            }
            ;
            $165.errorText = "";
            $165.pitches = [];
            return $165;
          }()))(function() {
            return bind11(handleQuery(new DisplayFingering2(unit)))(function() {
              return pure26(unit);
            });
          });
        });
      }
      ;
      if (v instanceof Save2) {
        return bind11(get5)(function(state3) {
          var name16 = safeName(state3.chordShape.name) + ("_" + (instrumentNameToFileName(state3.config.name) + ".json"));
          var contents = writeFrettedInstrument(state3.chordShape);
          return bind11(liftEffect9(saveTextFile({
            name: name16,
            contents
          })))(function() {
            return pure26(unit);
          });
        });
      }
      ;
      if (v instanceof PlayChord2) {
        return bind11(get5)(function(state3) {
          var pitches = getMidiPitches(state3.config)(state3.chordShape.fingering)(state3.chordShape.firstFretOffset)(state3.chordShape.barre);
          return bind11(modify7(function(st) {
            var $170 = {};
            for (var $171 in st) {
              if ({}.hasOwnProperty.call(st, $171)) {
                $170[$171] = st[$171];
              }
              ;
            }
            ;
            $170.pitches = pitches;
            return $170;
          }))(function() {
            return liftEffect9(playChord2(state3.config)(state3.chordShape.fingering)(state3.chordShape.firstFretOffset)(state3.chordShape.barre)(state3.instruments));
          });
        });
      }
      ;
      throw new Error("Failed pattern match at FrettedInstrument.Page (line 293, column 18 - line 433, column 26): " + [v.constructor.name]);
    };
    return mkComponent({
      initialState,
      render: render3,
      "eval": mkEval({
        handleAction,
        handleQuery: defaultEval.handleQuery,
        receive: defaultEval.receive,
        initialize: new Just(Init2.value),
        finalize: Nothing.value
      })
    });
  };

  // output/FrettedInstrument.TenorGuitar.Config/index.js
  var config2 = /* @__PURE__ */ function() {
    return {
      name: TenorGuitar.value,
      stringCount: 4,
      maxFrets: 20,
      openStringsChordName: "C6/9",
      openStringMidiIds: [48, 55, 62, 69],
      instrumentName: AcousticGuitarSteel.value
    };
  }();

  // output/FrettedInstrument.Ukulele.Config/index.js
  var config3 = /* @__PURE__ */ function() {
    return {
      name: Ukulele.value,
      stringCount: 4,
      maxFrets: 15,
      openStringsChordName: "C6",
      openStringMidiIds: [67, 60, 64, 69],
      instrumentName: AcousticGuitarNylon.value
    };
  }();

  // output/Home.Page/index.js
  var Init3 = /* @__PURE__ */ function() {
    function Init5() {
    }
    ;
    Init5.value = new Init5();
    return Init5;
  }();
  var component4 = function(dictMonadAff) {
    var render3 = function(v) {
      return div_([h1([class_("center")])([text5("Chord Editor")]), ul([class_("menu")])([li_([a([href4("#/frettedInstrument/guitar")])([text5("Guitar")])]), li_([a([href4("#/frettedInstrument/tenorguitar")])([text5("Tenor Guitar")])]), li_([a([href4("#/frettedInstrument/ukulele")])([text5("Ukulele")])]), li_([a([href4("#/bass")])([text5("Bass")])]), li_([a([href4("#/piano")])([text5("Piano")])])])]);
    };
    var initialState = function(v) {
      return {};
    };
    return mkComponent({
      initialState,
      render: render3,
      "eval": mkEval({
        handleAction: defaultEval.handleAction,
        handleQuery: defaultEval.handleQuery,
        receive: defaultEval.receive,
        initialize: new Just(Init3.value),
        finalize: Nothing.value
      })
    });
  };

  // output/Navigation.Navigate/index.js
  var lift3 = /* @__PURE__ */ lift(monadTransHalogenM);
  var navigate = function(dict) {
    return dict.navigate;
  };
  var navigateHalogenM = function(dictNavigate) {
    return {
      navigate: function() {
        var $7 = lift3(dictNavigate.Monad0());
        var $8 = navigate(dictNavigate);
        return function($9) {
          return $7($8($9));
        };
      }(),
      Monad0: function() {
        return monadHalogenM;
      }
    };
  };

  // output/Piano.Audio/index.js
  var map47 = /* @__PURE__ */ map(functorArray);
  var $$void11 = /* @__PURE__ */ $$void(functorEffect);
  var piano = 0;
  var toNote3 = function(keyPosition) {
    var id4 = 60 + keyPosition | 0;
    return {
      channel: piano,
      id: id4,
      timeOffset: 0,
      duration: 1.5,
      gain: 1
    };
  };
  var playChord3 = function(fingering3) {
    return function(instruments) {
      var notes = map47(toNote3)(fingering3);
      return $$void11(playNotes(instruments)(notes));
    };
  };

  // output/Piano.Graphics/index.js
  var contains5 = /* @__PURE__ */ contains4(eqInt);
  var mempty6 = /* @__PURE__ */ mempty(monoidDrawing);
  var append14 = /* @__PURE__ */ append(semigroupDrawing);
  var foldl8 = /* @__PURE__ */ foldl(foldableArray);
  var whiteNoteCount = 14;
  var whiteKeyPositions = [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19, 21, 23];
  var titleDepth3 = 56;
  var cellSize3 = 24;
  var keyboardxOffset = /* @__PURE__ */ function() {
    return cellSize3 * 1.5;
  }();
  var keyboardyOffset = /* @__PURE__ */ function() {
    return 3 * cellSize3;
  }();
  var smallCircle = function(colour) {
    return function(xpos) {
      return function(ypos) {
        var radius = 0.3 * cellSize3;
        return filled(fillColor(colour))(circle(xpos)(ypos)(radius));
      };
    };
  };
  var whiteKeyLength = /* @__PURE__ */ function() {
    return cellSize3 * 9;
  }();
  var whiteKeyWidth = /* @__PURE__ */ function() {
    return cellSize3 * 12 / 7;
  }();
  var keyboardWidth = /* @__PURE__ */ function() {
    return toNumber(whiteNoteCount) * whiteKeyWidth;
  }();
  var title5 = function(name16) {
    var theFont = font2(sansSerif)(60)(bold);
    var textWidth = cellSize3 * 1.1 * toNumber(length2(name16));
    var titlexOffset = keyboardxOffset + (keyboardWidth - textWidth) / 2;
    return text6(theFont)(titlexOffset)(titleDepth3)(fillColor(black))(name16);
  };
  var whiteKey = function(fingering3) {
    return function(n) {
      var xOffset = keyboardxOffset + toNumber(n) * whiteKeyWidth;
      var keyNumber = fromMaybe(-1 | 0)(index(whiteKeyPositions)(n));
      var keyedCircle = function() {
        var $14 = contains5(fingering3)(keyNumber);
        if ($14) {
          return smallCircle(black)(xOffset + whiteKeyWidth * 0.5)(keyboardyOffset + whiteKeyLength * 0.8);
        }
        ;
        return mempty6;
      }();
      var colour = function() {
        var $15 = contains5(fingering3)(keyNumber);
        if ($15) {
          return graytone(0.8);
        }
        ;
        return white;
      }();
      return append14(filled(fillColor(black))(rectangle(xOffset)(keyboardyOffset)(whiteKeyWidth)(whiteKeyLength)))(append14(filled(fillColor(colour))(rectangle(xOffset + 2)(keyboardyOffset + 2)(whiteKeyWidth - 4)(whiteKeyLength - 4)))(keyedCircle));
    };
  };
  var whiteKeys = function(fingering3) {
    var keys4 = range(0)(whiteNoteCount - 1 | 0);
    var f = function(acc) {
      return function(n) {
        return append14(acc)(whiteKey(fingering3)(n));
      };
    };
    return foldl8(f)(mempty6)(keys4);
  };
  var canvasWidth3 = /* @__PURE__ */ function() {
    return round2(2 * keyboardxOffset + toNumber(whiteNoteCount) * whiteKeyWidth);
  }();
  var canvasHeight3 = /* @__PURE__ */ function() {
    return round2(keyboardyOffset + whiteKeyLength + cellSize3);
  }();
  var blackKeyWidth = cellSize3;
  var blackKeyPositions = [1, 3, 6, 8, 10, 13, 15, 18, 20, 22];
  var blackKeyOffset = function(pos) {
    var $16 = pos === 6 || pos === 18;
    if ($16) {
      return toNumber(pos) * blackKeyWidth + 6;
    }
    ;
    return toNumber(pos) * blackKeyWidth;
  };
  var blackKeyLength = /* @__PURE__ */ function() {
    return whiteKeyLength * 0.66;
  }();
  var fingeredKey = function(coords2) {
    var $17 = coords2.x < keyboardxOffset || (coords2.x > keyboardxOffset + keyboardWidth || (coords2.y < keyboardyOffset - cellSize3 / 2 || coords2.y > keyboardyOffset + whiteKeyLength));
    if ($17) {
      return Nothing.value;
    }
    ;
    var $18 = coords2.y < keyboardyOffset + blackKeyLength;
    if ($18) {
      return new Just(floor2((coords2.x - keyboardxOffset) / blackKeyWidth));
    }
    ;
    var keyPos = floor2((coords2.x - keyboardxOffset) / whiteKeyWidth);
    return index(whiteKeyPositions)(keyPos);
  };
  var blackKey = function(fingering3) {
    return function(keyNumber) {
      var keyOffset = blackKeyOffset(keyNumber);
      var xOffset = keyboardxOffset + keyOffset;
      var keyedCircle = function() {
        var $19 = contains5(fingering3)(keyNumber);
        if ($19) {
          return smallCircle(black)(xOffset + blackKeyWidth * 0.5)(keyboardyOffset + blackKeyLength * 0.6);
        }
        ;
        return mempty6;
      }();
      var colour = function() {
        var $20 = contains5(fingering3)(keyNumber);
        if ($20) {
          return graytone(0.8);
        }
        ;
        return black;
      }();
      return append14(filled(fillColor(black))(rectangle(xOffset)(keyboardyOffset)(blackKeyWidth)(blackKeyLength)))(append14(filled(fillColor(colour))(rectangle(xOffset + 1.5)(keyboardyOffset + 1.5)(blackKeyWidth - 3)(blackKeyLength - 3)))(keyedCircle));
    };
  };
  var blackKeys = function(fingering3) {
    var f = function(acc) {
      return function(n) {
        return append14(acc)(blackKey(fingering3)(n));
      };
    };
    return foldl8(f)(mempty6)(blackKeyPositions);
  };
  var displayChord3 = function(chord) {
    return append14(title5(chord.name))(append14(whiteKeys(chord.fingering))(blackKeys(chord.fingering)));
  };

  // output/Piano.Types/index.js
  var unfingered = [];

  // output/Piano.Validation/index.js
  var pure27 = /* @__PURE__ */ pure(/* @__PURE__ */ applicativeV2(semigroupNonEmptyList));
  var pure113 = /* @__PURE__ */ pure(applicativeNonEmptyList);
  var show16 = /* @__PURE__ */ show(showInt);
  var intercalate8 = /* @__PURE__ */ intercalate(foldableArray)(monoidString);
  var map48 = /* @__PURE__ */ map(functorArray);
  var map120 = /* @__PURE__ */ map(functorV);
  var maxKeys = 24;
  var validateFingerPositions3 = function(fingering3) {
    var fingerOutOfRange = function(fingerPosition) {
      return fingerPosition < 0 || fingerPosition >= maxKeys;
    };
    var v = filter(fingerOutOfRange)(fingering3);
    if (v.length === 0) {
      return pure27(fingering3);
    }
    ;
    if (v.length === 1) {
      return invalid2(pure113("Finger position " + (show16(v[0]) + " is out of range.")));
    }
    ;
    var fingers2 = intercalate8(", ")(map48(show16)(v));
    return invalid2(pure113("Finger positions " + (fingers2 + " are out of range.")));
  };
  var validateFingering3 = function(fingering3) {
    var $17 = length(fingering3) > 10;
    if ($17) {
      return invalid2(pure113("Too many fingers."));
    }
    ;
    return validateFingerPositions3(fingering3);
  };
  var validate3 = function(chordShape) {
    return map120(function(v) {
      return {
        name: chordShape.name,
        fingering: v
      };
    })(validateFingering3(chordShape.fingering));
  };
  var validateJson3 = function(json) {
    return either($$const(invalid2(pure113("Not a recognisable piano chord format."))))(validate3)(readPiano(json));
  };

  // output/Piano.Page/index.js
  var slot4 = /* @__PURE__ */ slot()({
    reflectSymbol: function() {
      return "loadfile";
    }
  })(ordUnit);
  var type_22 = /* @__PURE__ */ type_17(isPropInputType);
  var value17 = /* @__PURE__ */ value12(isPropString);
  var show17 = /* @__PURE__ */ show(showInt);
  var fromJust10 = /* @__PURE__ */ fromJust();
  var bind15 = /* @__PURE__ */ bind(bindHalogenM);
  var modify8 = /* @__PURE__ */ modify2(monadStateHalogenM);
  var pure28 = /* @__PURE__ */ pure(applicativeHalogenM);
  var get6 = /* @__PURE__ */ get(monadStateHalogenM);
  var show18 = /* @__PURE__ */ show(showNumber);
  var contains6 = /* @__PURE__ */ contains4(eqInt);
  var put6 = /* @__PURE__ */ put(monadStateHalogenM);
  var append15 = /* @__PURE__ */ append(semigroupString);
  var foldl9 = /* @__PURE__ */ foldl(foldableNonEmptyList);
  var GetCanvasOffset3 = /* @__PURE__ */ function() {
    function GetCanvasOffset4(value0) {
      this.value0 = value0;
    }
    ;
    GetCanvasOffset4.create = function(value0) {
      return new GetCanvasOffset4(value0);
    };
    return GetCanvasOffset4;
  }();
  var LoadInstruments3 = /* @__PURE__ */ function() {
    function LoadInstruments4(value0) {
      this.value0 = value0;
    }
    ;
    LoadInstruments4.create = function(value0) {
      return new LoadInstruments4(value0);
    };
    return LoadInstruments4;
  }();
  var DisplayFingering3 = /* @__PURE__ */ function() {
    function DisplayFingering4(value0) {
      this.value0 = value0;
    }
    ;
    DisplayFingering4.create = function(value0) {
      return new DisplayFingering4(value0);
    };
    return DisplayFingering4;
  }();
  var Init4 = /* @__PURE__ */ function() {
    function Init5() {
    }
    ;
    Init5.value = new Init5();
    return Init5;
  }();
  var EditFingering3 = /* @__PURE__ */ function() {
    function EditFingering4(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    EditFingering4.create = function(value0) {
      return function(value1) {
        return new EditFingering4(value0, value1);
      };
    };
    return EditFingering4;
  }();
  var ClearFingering3 = /* @__PURE__ */ function() {
    function ClearFingering4() {
    }
    ;
    ClearFingering4.value = new ClearFingering4();
    return ClearFingering4;
  }();
  var GetChordName3 = /* @__PURE__ */ function() {
    function GetChordName4(value0) {
      this.value0 = value0;
    }
    ;
    GetChordName4.create = function(value0) {
      return new GetChordName4(value0);
    };
    return GetChordName4;
  }();
  var GetImageScale3 = /* @__PURE__ */ function() {
    function GetImageScale4(value0) {
      this.value0 = value0;
    }
    ;
    GetImageScale4.create = function(value0) {
      return new GetImageScale4(value0);
    };
    return GetImageScale4;
  }();
  var Export3 = /* @__PURE__ */ function() {
    function Export4(value0) {
      this.value0 = value0;
    }
    ;
    Export4.create = function(value0) {
      return new Export4(value0);
    };
    return Export4;
  }();
  var Load3 = /* @__PURE__ */ function() {
    function Load4(value0) {
      this.value0 = value0;
    }
    ;
    Load4.create = function(value0) {
      return new Load4(value0);
    };
    return Load4;
  }();
  var Save3 = /* @__PURE__ */ function() {
    function Save4() {
    }
    ;
    Save4.value = new Save4();
    return Save4;
  }();
  var PlayChord3 = /* @__PURE__ */ function() {
    function PlayChord4() {
    }
    ;
    PlayChord4.value = new PlayChord4();
    return PlayChord4;
  }();
  var _loadfile3 = /* @__PURE__ */ function() {
    return $$Proxy.value;
  }();
  var component5 = function(dictMonadAff) {
    var liftAff2 = liftAff(monadAffHalogenM(dictMonadAff));
    var liftEffect9 = liftEffect(monadEffectHalogenM(dictMonadAff.MonadEffect0()));
    var renderSaveButton = button([onClick(function(v) {
      return Save3.value;
    }), class_("hoverable"), enabled(true)])([text5("save")]);
    var renderPlayButton = function(state3) {
      var enabled2 = length(state3.instruments) > 0 && length(state3.chordShape.fingering) > 0;
      var className2 = function() {
        if (enabled2) {
          return "hoverable";
        }
        ;
        return "unhoverable";
      }();
      return div_([button([onClick(function(v) {
        return PlayChord3.value;
      }), class_(className2), enabled(enabled2)])([text5("play")])]);
    };
    var renderLoadButton = slot4(_loadfile3)(unit)(component(dictMonadAff)(jsonFileInputCtx))(unit)(Load3.create);
    var renderImageScaleSlider = function(state3) {
      var toScale = function(s) {
        return fromMaybe(100)(fromString(s));
      };
      return div3([class_("leftPanelComponent")])([label4([class_("labelAlignment")])([text5("scale download:")]), input2([onValueInput(function($99) {
        return GetImageScale3.create(toScale($99));
      }), type_22(InputRange.value), id2("scale-slider"), class_("scaling-slider"), min5(25), max6(1e3), step4(new Step(25)), value17(show17(state3.exportScale))])]);
    };
    var renderExportPNGButton = button([onClick(function(v) {
      return new Export3(PNG.value);
    }), class_("hoverable"), enabled(true)])([text5("download PNG")]);
    var renderClearFingeringButton = button([onClick(function(v) {
      return ClearFingering3.value;
    }), class_("hoverable"), enabled(true)])([text5("clear fingering")]);
    var renderChordNameInput = function(state3) {
      return div3([id2("chord-name-div")])([label4([id2("chord-name-label")])([text5("chord name:")]), input2([onValueInput(GetChordName3.create), value17(state3.chordShape.name), type_22(InputText.value), id2("chord-name-edit"), class_("text-input")])]);
    };
    var initialChordShape = {
      name: "silent",
      fingering: unfingered
    };
    var initialState = function(v) {
      return {
        mGraphicsContext: Nothing.value,
        mCanvas: Nothing.value,
        canvasPosition: {
          left: 0,
          top: 0
        },
        chordShape: initialChordShape,
        exportScale: 100,
        instruments: [],
        errorText: ""
      };
    };
    var clearCanvas = function(state3) {
      var graphicsContext = fromJust10(state3.mGraphicsContext);
      return clearRect(graphicsContext)({
        x: 0,
        y: 0,
        width: toNumber(canvasWidth3),
        height: toNumber(canvasHeight3)
      });
    };
    var handleQuery = function(v) {
      if (v instanceof GetCanvasOffset3) {
        return bind15(liftAff2(selectElement("#canvas")))(function(mCanvasElement) {
          var canvasElement = fromJust10(mCanvasElement);
          return bind15(liftEffect9(offsetLeft(canvasElement)))(function(left) {
            return bind15(liftEffect9(offsetTop(canvasElement)))(function(top3) {
              return bind15(modify8(function(st) {
                var $53 = {};
                for (var $54 in st) {
                  if ({}.hasOwnProperty.call(st, $54)) {
                    $53[$54] = st[$54];
                  }
                  ;
                }
                ;
                $53.canvasPosition = {
                  left,
                  top: top3
                };
                return $53;
              }))(function() {
                return pure28(new Just(v.value0));
              });
            });
          });
        });
      }
      ;
      if (v instanceof LoadInstruments3) {
        return bind15(liftAff2(loadRemoteSoundFonts([AcousticGrandPiano.value])))(function(instruments) {
          return bind15(modify8(function(st) {
            var $57 = {};
            for (var $58 in st) {
              if ({}.hasOwnProperty.call(st, $58)) {
                $57[$58] = st[$58];
              }
              ;
            }
            ;
            $57.instruments = instruments;
            return $57;
          }))(function() {
            return pure28(new Just(v.value0));
          });
        });
      }
      ;
      if (v instanceof DisplayFingering3) {
        return bind15(get6)(function(state3) {
          var graphicsCtx = fromJust10(state3.mGraphicsContext);
          return bind15(liftEffect9(function __do2() {
            clearCanvas(state3)();
            return render(graphicsCtx)(displayChord3(state3.chordShape))();
          }))(function() {
            return pure28(new Just(v.value0));
          });
        });
      }
      ;
      throw new Error("Failed pattern match at Piano.Page (line 321, column 17 - line 352, column 23): " + [v.constructor.name]);
    };
    var canvasClickHandler = function(me) {
      return new EditFingering3(clientX(me), clientY(me));
    };
    var render3 = function(state3) {
      return div_([h1([class_("center")])([text5("Piano Chord Editor")]), canvas([id2("canvas"), onClick(canvasClickHandler), height8(canvasHeight3), width8(canvasWidth3)]), renderChordNameInput(state3), div_([renderImageScaleSlider(state3), text5(show18(toNumber(state3.exportScale) / 100))]), div_([renderClearFingeringButton, renderExportPNGButton]), div_([renderLoadButton, renderSaveButton]), renderPlayButton(state3), text5(state3.errorText)]);
    };
    var alterFingering = function(fingeredKey2) {
      return function(fingering3) {
        var $62 = contains6(fingering3)(fingeredKey2);
        if ($62) {
          return filter(function(x) {
            return x !== fingeredKey2;
          })(fingering3);
        }
        ;
        return cons(fingeredKey2)(fingering3);
      };
    };
    var handleAction = function(v) {
      if (v instanceof Init4) {
        return bind15(liftEffect9(getCanvasElementById("canvas")))(function(mCanvas) {
          var canvas2 = fromJust10(mCanvas);
          return bind15(liftEffect9(getContext2D(canvas2)))(function(graphicsCtx) {
            return bind15(modify8(function(st) {
              var $64 = {};
              for (var $65 in st) {
                if ({}.hasOwnProperty.call(st, $65)) {
                  $64[$65] = st[$65];
                }
                ;
              }
              ;
              $64.mGraphicsContext = new Just(graphicsCtx);
              $64.mCanvas = mCanvas;
              return $64;
            }))(function() {
              return bind15(handleQuery(new GetCanvasOffset3(unit)))(function() {
                return bind15(handleQuery(new DisplayFingering3(unit)))(function() {
                  return bind15(handleQuery(new LoadInstruments3(unit)))(function() {
                    return pure28(unit);
                  });
                });
              });
            });
          });
        });
      }
      ;
      if (v instanceof EditFingering3) {
        return bind15(get6)(function(state3) {
          var y = toNumber(v.value1) - state3.canvasPosition.top;
          var x = toNumber(v.value0) - state3.canvasPosition.left;
          var mKey = fingeredKey({
            x,
            y
          });
          var $67 = isJust(mKey);
          if ($67) {
            var key2 = fromJust10(mKey);
            var newFingering = alterFingering(key2)(state3.chordShape.fingering);
            var newChordShape = function() {
              var $68 = {};
              for (var $69 in state3.chordShape) {
                if ({}.hasOwnProperty.call(state3.chordShape, $69)) {
                  $68[$69] = state3["chordShape"][$69];
                }
                ;
              }
              ;
              $68.fingering = newFingering;
              return $68;
            }();
            return bind15(modify8(function(st) {
              var $71 = {};
              for (var $72 in st) {
                if ({}.hasOwnProperty.call(st, $72)) {
                  $71[$72] = st[$72];
                }
                ;
              }
              ;
              $71.chordShape = newChordShape;
              $71.errorText = "";
              return $71;
            }))(function() {
              return bind15(handleQuery(new DisplayFingering3(unit)))(function() {
                return pure28(unit);
              });
            });
          }
          ;
          return pure28(unit);
        });
      }
      ;
      if (v instanceof GetChordName3) {
        return bind15(get6)(function(state3) {
          var newShape = function() {
            var $76 = {};
            for (var $77 in state3.chordShape) {
              if ({}.hasOwnProperty.call(state3.chordShape, $77)) {
                $76[$77] = state3["chordShape"][$77];
              }
              ;
            }
            ;
            $76.name = v.value0;
            return $76;
          }();
          var newState = function() {
            var $79 = {};
            for (var $80 in state3) {
              if ({}.hasOwnProperty.call(state3, $80)) {
                $79[$80] = state3[$80];
              }
              ;
            }
            ;
            $79.chordShape = newShape;
            $79.errorText = "";
            return $79;
          }();
          return bind15(put6(newState))(function() {
            return bind15(handleQuery(new DisplayFingering3(unit)))(function() {
              return pure28(unit);
            });
          });
        });
      }
      ;
      if (v instanceof ClearFingering3) {
        return bind15(modify8(function(st) {
          var $83 = {};
          for (var $84 in st) {
            if ({}.hasOwnProperty.call(st, $84)) {
              $83[$84] = st[$84];
            }
            ;
          }
          ;
          $83.chordShape = initialChordShape;
          $83.errorText = "";
          return $83;
        }))(function() {
          return bind15(handleQuery(new DisplayFingering3(unit)))(function() {
            return pure28(unit);
          });
        });
      }
      ;
      if (v instanceof GetImageScale3) {
        return bind15(modify8(function(st) {
          var $86 = {};
          for (var $87 in st) {
            if ({}.hasOwnProperty.call(st, $87)) {
              $86[$87] = st[$87];
            }
            ;
          }
          ;
          $86.exportScale = v.value0;
          return $86;
        }))(function() {
          return pure28(unit);
        });
      }
      ;
      if (v instanceof Export3) {
        return bind15(get6)(function(state3) {
          var scaleFactor = toNumber(state3.exportScale) / 100;
          var originalCanvas = fromJust10(state3.mCanvas);
          var mimeType = toMimeType(v.value0);
          var fileName = safeName(state3.chordShape.name) + "_piano";
          return bind15(liftEffect9(scaleCanvas(originalCanvas)(scaleFactor)))(function(canvas2) {
            return bind15(liftEffect9(exportAs(canvas2)(fileName)(mimeType)))(function() {
              return pure28(unit);
            });
          });
        });
      }
      ;
      if (v instanceof Load3) {
        return bind15(get6)(function(state3) {
          var validated = validateJson3(v.value0.value0.contents);
          var newState = validation2(function(errs) {
            var $91 = {};
            for (var $92 in state3) {
              if ({}.hasOwnProperty.call(state3, $92)) {
                $91[$92] = state3[$92];
              }
              ;
            }
            ;
            $91.errorText = foldl9(append15)("")(errs);
            return $91;
          })(function(chordShape) {
            var $94 = {};
            for (var $95 in state3) {
              if ({}.hasOwnProperty.call(state3, $95)) {
                $94[$95] = state3[$95];
              }
              ;
            }
            ;
            $94.chordShape = chordShape;
            $94.errorText = "";
            return $94;
          })(validated);
          return bind15(put6(newState))(function() {
            return bind15(handleQuery(new DisplayFingering3(unit)))(function() {
              return pure28(unit);
            });
          });
        });
      }
      ;
      if (v instanceof Save3) {
        return bind15(get6)(function(state3) {
          var name16 = safeName(state3.chordShape.name) + "_piano.json";
          var contents = writePiano(state3.chordShape);
          return bind15(liftEffect9(saveTextFile({
            name: name16,
            contents
          })))(function() {
            return pure28(unit);
          });
        });
      }
      ;
      if (v instanceof PlayChord3) {
        return bind15(get6)(function(state3) {
          return liftEffect9(playChord3(state3.chordShape.fingering)(state3.instruments));
        });
      }
      ;
      throw new Error("Failed pattern match at Piano.Page (line 230, column 18 - line 318, column 76): " + [v.constructor.name]);
    };
    return mkComponent({
      initialState,
      render: render3,
      "eval": mkEval({
        handleAction,
        handleQuery: defaultEval.handleQuery,
        receive: defaultEval.receive,
        initialize: new Just(Init4.value),
        finalize: Nothing.value
      })
    });
  };

  // output/Navigation.Router/index.js
  var slot_2 = /* @__PURE__ */ slot_();
  var slot_1 = /* @__PURE__ */ slot_2({
    reflectSymbol: function() {
      return "home";
    }
  })(ordUnit);
  var slot_22 = /* @__PURE__ */ slot_2({
    reflectSymbol: function() {
      return "frettedInstrument";
    }
  })(ordUnit);
  var slot_3 = /* @__PURE__ */ slot_2({
    reflectSymbol: function() {
      return "piano";
    }
  })(ordUnit);
  var slot_4 = /* @__PURE__ */ slot_2({
    reflectSymbol: function() {
      return "bass";
    }
  })(ordUnit);
  var bind16 = /* @__PURE__ */ bind(bindHalogenM);
  var get7 = /* @__PURE__ */ get(monadStateHalogenM);
  var discard5 = /* @__PURE__ */ discard(discardUnit)(bindHalogenM);
  var when5 = /* @__PURE__ */ when(applicativeHalogenM);
  var notEq2 = /* @__PURE__ */ notEq(/* @__PURE__ */ eqMaybe(eqRoute));
  var modify_3 = /* @__PURE__ */ modify_2(monadStateHalogenM);
  var pure29 = /* @__PURE__ */ pure(applicativeHalogenM);
  var map49 = /* @__PURE__ */ map(functorHalogenM);
  var Navigate = /* @__PURE__ */ function() {
    function Navigate2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Navigate2.create = function(value0) {
      return function(value1) {
        return new Navigate2(value0, value1);
      };
    };
    return Navigate2;
  }();
  var Initialize2 = /* @__PURE__ */ function() {
    function Initialize3() {
    }
    ;
    Initialize3.value = new Initialize3();
    return Initialize3;
  }();
  var getFrettedInstrumentConfig = function(name16) {
    if (name16 instanceof Guitar) {
      return config;
    }
    ;
    if (name16 instanceof TenorGuitar) {
      return config2;
    }
    ;
    if (name16 instanceof Ukulele) {
      return config3;
    }
    ;
    throw new Error("Failed pattern match at Navigation.Router (line 98, column 3 - line 104, column 21): " + [name16.constructor.name]);
  };
  var component6 = function(dictMonadAff) {
    var component1 = component4(dictMonadAff);
    var component22 = component3(dictMonadAff);
    var component32 = component5(dictMonadAff);
    var component42 = component2(dictMonadAff);
    var liftEffect9 = liftEffect(monadEffectHalogenM(dictMonadAff.MonadEffect0()));
    return function(dictNavigate) {
      var navigate2 = navigate(navigateHalogenM(dictNavigate));
      var render3 = function(v) {
        if (v.route instanceof Just) {
          if (v.route.value0 instanceof Home) {
            return slot_1($$Proxy.value)(unit)(component1)(unit);
          }
          ;
          if (v.route.value0 instanceof FrettedInstrument) {
            var config4 = getFrettedInstrumentConfig(v.route.value0.value0);
            return slot_22($$Proxy.value)(unit)(component22)({
              config: config4
            });
          }
          ;
          if (v.route.value0 instanceof Piano) {
            return slot_3($$Proxy.value)(unit)(component32)(unit);
          }
          ;
          if (v.route.value0 instanceof Bass) {
            return slot_4($$Proxy.value)(unit)(component42)(unit);
          }
          ;
          throw new Error("Failed pattern match at Navigation.Router (line 79, column 15 - line 90, column 62): " + [v.route.value0.constructor.name]);
        }
        ;
        if (v.route instanceof Nothing) {
          return div_([text5("Oh no! That page wasn't found.")]);
        }
        ;
        throw new Error("Failed pattern match at Navigation.Router (line 78, column 22 - line 93, column 59): " + [v.route.constructor.name]);
      };
      var handleQuery = function(v) {
        return bind16(get7)(function(v1) {
          return discard5(when5(notEq2(v1.route)(new Just(v.value0)))(modify_3(function(v2) {
            var $51 = {};
            for (var $52 in v2) {
              if ({}.hasOwnProperty.call(v2, $52)) {
                $51[$52] = v2[$52];
              }
              ;
            }
            ;
            $51.route = new Just(v.value0);
            return $51;
          })))(function() {
            return pure29(new Just(v.value1));
          });
        });
      };
      var handleAction = function(v) {
        return bind16(map49(function() {
          var $58 = parse(routeCodec);
          return function($59) {
            return hush($58($59));
          };
        }())(liftEffect9(getHash)))(function(initialRoute) {
          return navigate2(fromMaybe(Home.value)(initialRoute));
        });
      };
      return mkComponent({
        initialState: function(v) {
          return {
            route: Nothing.value
          };
        },
        render: render3,
        "eval": mkEval({
          handleAction,
          handleQuery,
          receive: defaultEval.receive,
          initialize: new Just(Initialize2.value),
          finalize: defaultEval.finalize
        })
      });
    };
  };

  // output/Main/index.js
  var bind17 = /* @__PURE__ */ bind(bindAff);
  var hoist4 = /* @__PURE__ */ hoist3(functorAff);
  var component7 = /* @__PURE__ */ component6(monadAffAppM)(navigateAppM);
  var $$void12 = /* @__PURE__ */ $$void(functorAff);
  var liftEffect8 = /* @__PURE__ */ liftEffect(monadEffectAff);
  var matchesWith2 = /* @__PURE__ */ matchesWith(foldableEither);
  var when6 = /* @__PURE__ */ when(applicativeEffect);
  var notEq3 = /* @__PURE__ */ notEq(/* @__PURE__ */ eqMaybe(eqRoute));
  var pure30 = /* @__PURE__ */ pure(applicativeAff);
  var main2 = /* @__PURE__ */ runHalogenAff(/* @__PURE__ */ bind17(awaitBody)(function(body2) {
    var rootComponent = hoist4(toAff)(component7);
    return bind17(runUI2(rootComponent)(unit)(body2))(function(halogenIO) {
      return $$void12(liftEffect8(matchesWith2(parse(routeCodec))(function(old) {
        return function($$new2) {
          return when6(notEq3(old)(new Just($$new2)))(launchAff_(bind17(halogenIO.query(mkTell(Navigate.create($$new2))))(function(_response) {
            return pure30(unit);
          })));
        };
      })));
    });
  }));

  // <stdin>
  main2();
})();
