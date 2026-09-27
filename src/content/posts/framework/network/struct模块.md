---
title: "struct 模块"
published: 2024-11-28 09:00:00
category: Python 学习
series: "Python 网络编程"
seriesOrder: 15
hubs: ["python-network-programming"]
---

# struct模块

> 案例详见：[（4）socket套接字使用模版 - Chimengmeng - 博客园 (cnblogs.com)](https://www.cnblogs.com/dream-ze/p/17499411.html)

- `struct.pack()`是Python内置模块`struct`中的一个函数
  - 它的作用是将指定的数据按照指定的格式进行打包，并将打包后的结果转换成一个字节序列（byte string）
  - 可以用于在网络上传输或者储存于文件中。
- `struct.pack(fmt, v1, v2, ...)`

  - 其中，`fmt`为格式字符串，指定了需要打包的数据的格式，后面的`v1`,`v2`,...则是需要打包的数据。
  - 这些数据会按照`fmt`的格式被编码成二进制的字节串，并返回这个字节串。

`fmt`的常用格式符如下：

* `x`   --- 填充字节
* `c`   --- char类型，占1字节
* `b`   --- signed char类型，占1字节
* `B`   --- unsigned char类型，占1字节
* `h`   --- short类型，占2字节
* `H`   --- unsigned short类型，占2字节
* `i`   --- int类型，占4字节
* `I`   --- unsigned int类型，占4字节
* `l`   --- long类型，占4字节（32位机器上）或者8字节（64位机器上）
* `L`   --- unsigned long类型，占4字节（32位机器上）或者8字节（64位机器上）
* `q`   --- long long类型，占8字节
* `Q`   --- unsigned long long类型，占8字节
* `f`   --- float类型，占4字节
* `d`   --- double类型，占8字节
* `s`   --- char[]类型，占指定字节个数，需要用数字指定长度
* `p`   --- char[]类型，跟`s`一样，但通常用来表示字符串
* `?`   --- bool类型，占1字节

具体的格式化规则可以在Python文档中查看（[链接](https://docs.python.org/3/library/struct.html#format-characters)）。
