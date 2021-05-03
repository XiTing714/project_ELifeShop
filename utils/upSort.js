
module.exports = function (arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - 1 - i; j++) {
      if (arr[j].minPrice > arr[j + 1].minPrice) {
        let temObj = arr[j]
        arr[j] = arr[j + 1]
        arr[j + 1] = temObj
      }
    }
  }
  return arr
}


