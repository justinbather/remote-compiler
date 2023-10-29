/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */

let args = process.argv.slice(2);
let arg1 = args[0].slice(1, -1).split(",");
let arg2 = args[1];
console.log(arg1, arg2);
console.log(twoSum(arg1, arg2));
function twoSum(nums, target) {
    let mp = new Map()

    for (let i=0; i<nums.length; i++){
        let diff = target - nums[i]

        if(mp.has(diff)) {
            return [i, mp.get(diff)]
        }

        mp.set(nums[i], i)
    }

    
};