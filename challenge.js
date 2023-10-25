const missingInt = (arr) => {
  const required = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  for (let i = 0; i < required.length; i++) {
    if (arr.indexOf(required[i]) < 0) {
      return required[i];
    }
  }

  return;
};

console.log(missingInt([0, 2, 3, 4, 5, 6, 7, 8, 9]));
