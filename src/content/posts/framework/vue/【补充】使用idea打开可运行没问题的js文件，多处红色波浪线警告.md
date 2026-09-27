---
title: "IDEA 打开 JavaScript 文件的警告处理"
published: 2023-08-27 09:02:00
category: Web 开发
series: "Vue 补充与实践"
seriesOrder: 10
hubs: ["vue-supplements"]
---

# 【补充】使用idea打开可运行没问题的js文件，多处红色波浪线警告

# 【一】问题说明

- 问题主要发现于在pycharm中打开Vue项目发现所有JS文件代码底下都是红色波浪线

- 当我们将鼠标悬停在红色波浪线的代码上时，他会提示

  ```
  JSHint: 'export' is only available in ES6 (use 'esversion: 6').(W119)
  ```

  - 这个警告是由JSHint静态代码分析工具生成的，它告诉你在当前的JavaScript代码中使用了ES6的"export"语法，但是没有指定正确的ES版本。
  - ES6（也被称为ES2015）引入了模块化的概念，使用关键字"export"将变量、函数或类从一个模块导出。
  - 然而，JSHint默认不支持ES6语法。

![1](https://oss.silentdream.top/2026/09/27/14-03-46-9aa29ecd-1-9a348a.png)

# 【二】解决办法

- 项目是ES6语法，改一下JavaScript语言的代码分析工具即可。
- 具体方法：
- File 
  -  Settings 
    -  Languages & Frameworks 
      -  JavaScript 
        -  Code Quality Tools 
          -  JSHint

![2](https://oss.silentdream.top/2026/09/27/14-03-46-7f939aee-2-bdfe16.png)

- 将这个配置选项关闭即可解决

![3](https://oss.silentdream.top/2026/09/27/14-03-46-7b025675-3-654386.png)

