/**
 * @param {number} x
 * @return {boolean}
 */
var isPalindrome = function(x) {
    return x < 0 ? false : (x === +x.toString().split("").reverse().join(""));

};import input from './is_palindrome.input.mjs';
input.forEach((input) => { 
  console.log(isPalindrome(input));});