function isPalindrome(x) {
  return x < 0 ? false : (x === +x.toString().split("").reverse().join(""));
};


const input = [121, -121, 10]

input.forEach((item) => {
  console.log(isPalindrome(item))
})
