---
title: "JavaScript 中的 for 循环"
published: 2023-08-23 09:02:00
category: Web 开发
series: "Vue 补充与实践"
seriesOrder: 3
hubs: ["vue-supplements"]
---

# 【补充】JS中的for循环操作

```js
//补充： js循环
var arr = [33, 2, 3, 4, 6, 7, 4]
// 1 基础for循环
// for (var i = 0; i < arr.length; i++) {
//     console.log(arr[i])
// }
// 2 in的循环(不怎么用)，循环出索引
// for (i in arr) {
//     // console.log(i)
//     console.log(arr[i])
// }

//3 of 循环  es6的语法  循环出value值
// for (i of arr) {
//     console.log(i)
// }


// 4 数组的循环
// arr.forEach(function (value, index) {
//     console.log(index, '--', value)
// })

// 5 jq的循环
// $.each(arr, function (index, value) {
//     console.log(index, '--', value)
// })
```

# 
