module.exports = function (arr) {
  for (let m = 0; m < arr.length - 1; m++) {
    for (let n = 0; n < arr.length - 1 - m; n++) {
      if (arr[n].minPrice <arr[n + 1].minPrice) {
        let temObj =arr[n]
        arr[n] =arr[n + 1]
        arr[n + 1] = temObj
      }
    }
  }
  return arr
}