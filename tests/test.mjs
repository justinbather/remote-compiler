/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
import input from "./twoSum.input.mjs";

input.forEach((input) => {
  console.log(twoSum(input[0], input[1]));
});
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