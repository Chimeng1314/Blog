---
title: "ES6 简写推导"
published: 2023-08-23 08:18:00
category: Web 开发
series: "Vue 补充与实践"
seriesOrder: 2
hubs: ["vue-supplements"]
---

# 【补充】es6的简写推导

```html
// es6的简写形式
var a = {"name": "dream", "age": 19}
var b = {name: "dream", age: 19} // 一次简写
var name = "dream"
var age = 19
var f = function (){}
var d = {"name": name, "age": age,"f":function () {}} // 二次简写
var e = {name, age,f} // 三次简写 ---> {"name": name, "age": age,f:function () {}}
```

