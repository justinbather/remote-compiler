/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */

let args = String(process.argv.slice(2));
let arg1 = args[0].split("-");
console.log(args);
console.log(twoSum(arg1, args[1]));
