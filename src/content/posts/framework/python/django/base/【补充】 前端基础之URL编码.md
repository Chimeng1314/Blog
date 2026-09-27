---
title: "前端基础之URL编码"
published: 2023-07-28 15:12:00
category: Web 开发
series: "Django 基础"
seriesOrder: 42
hubs: ["django-basics"]
---

# 【一】URL 解码 / 编码详解
当 URL 路径或者查询参数中，带有中文或者特殊字符的时候，就需要对 URL 进行编码（采用十六进制[编码格式](https://so.csdn.net/so/search?q=%E7%BC%96%E7%A0%81%E6%A0%BC%E5%BC%8F&spm=1001.2101.3001.7020)）。URL 编码的原则是使用安全字符去表示那些不安全的字符。

安全字符，指的是没有特殊用途或者特殊意义的字符。

# 【二】URL基本组成
+ URL 是由一些简单的组件构成 
    - 比如协议、域名、端口号、路径和查询字符串等
    - 示例如下：

```python
http://www.ccc.net/index?param=10
```

+ 路径和查询字符串之间使用问号?隔开。 
    - 上述示例的域名为 www.ccc.net
    - 路径为 index
    - 查询字符串为 param=1。
+ URL 中规定了一些具有特殊意义的字符，常被用来分隔两个不同的 URL 组件，这些字符被称为保留字符。 
    - 例如：
    - 冒号： 
        * 用于分隔协议和主机组件，斜杠用于分隔主机和路径
    - ?： 
        * 用于分隔路径和查询参数等。
    - =： 
        * 用于表示查询参数中的键值对。
    - &： 
        * 符号用于分隔查询多个键值对。
    - 其余常用的保留字符有： 
        * / . … # @ $ + ; %

# 【三】哪些字符需要编码
+ URL 之所以需要编码，是因为 URL 中的某些字符会引起歧义 
    - 比如 URL 查询参数中包含了”&”或者”%”就会造成服务器解析错误；
    - 再比如，URL 的编码格式采用的是 ASCII 码而非 Unicode 格式，这表明 URL 中不允许包含任何非 ASCII 字符（比如中文），否则就会造成 URL 解析错误。
+ URL 编码协议规定（RFC3986 协议）： 
    - URL 中只允许使用 ASCII 字符集可以显示的字符，比如英文字母、数字、和- _ . ~ ! *这 6 个特殊字符。
    - 当在 URL 中使用不属于 ASCII 字符集的字符时，就要使用特殊的符号对该字符进行编码
    - 比如空格需要用%20来表示。
+ 除了无法显示的字符需要编码外，还需要对 URL 中的部分保留字符和不安全字符进行编码。 
    - 下面列举了部分不安全字符：

[ ] < > " " { } | \ ^ * · ‘ ’ 等

+ 下面示例，查询字符串中包含一些特殊字符，这些特殊字符不需要编码：

[http://www.ccc.net/index?param=10!*&param1=20!-~_](http://www.ccc.net/index?param=10!*&param1=20!-~_)

+ 下表对 URL 中部分保留字符和不安全字符进行了说明：

# 【四】**URL特殊字符编码**
| 字符 | 含义 | 十六进制值编码 |
| --- | --- | --- |
| + | URL 中 + 号表示空格 | %2B |
| 空格 | URL中的空格可以编码为 + 号或者 %20 | %20 |
| / | 分隔目录和子目录 | %2F |
| ? | 分隔实际的 URL 和参数 | %3F |
| % | 指定特殊字符 | %25 |
| # | 表示书签 | %23 |
| & | URL 中指定的参数间的分隔符 | %26 |
| = | URL 中指定参数的值 | %3D |


+ 下面简单总结一下，哪些字符需要编码 
    - 分为以下三种情况：

ASCII 表中没有对应的可显示字符

例如：

	汉字。

	不安全字符，包括：# ”% <> [] {} | \ ^ ` 。

	部分保留字符，即 & / : ; = ? @ 。

# 【五】Python实现编码与解码
+ Python 的标准库 
    - [urllib](https://so.csdn.net/so/search?q=urllib&spm=1001.2101.3001.7020).parse模块中提供了用来编码和解码的方法
    - 分别是 
        * urlencode()
        * unquote()

| 方法 | 说明 |
| --- | --- |
| urlencode() | 该方法实现了对 url 地址的编码操作 |
| unquote() | 该方法将编码后的 url 地址进行还原，被称为解码 |


## 【1】**编码urlencode()**
+ 下面以百度搜索为例进行讲解。 
    - 首先打开百度首页，在搜索框中输入“爬虫”，然后点击“百度一下”。
    - 当搜索结果显示后，此时地址栏的 URL 信息
    - 如下所示：

```python
https://www.baidu.com/s?wd=爬虫&rsv_spt=1&rsv_iqid=0xa3ca348c0001a2ab&issp=1&f=8&rsv_bp=1&rsv_idx=2&ie=utf-8&tn=baiduhome_pg&rsv_enter=1&rsv_dl=ib&rsv_sug3=8&rsv_sug1=7&rsv_sug7=101
```

+ 可以看出 URL 中有很多的查询字符串 
    - 第一个查询字符串就是“wd=爬虫”
    - 其中 wd 表示查询字符串的键
    - 而“爬虫”则代表您输入的值。
+ 在网页地址栏中删除多余的查询字符串，最后显示的 URL 
    - 如下所示：

```python
https://www.baidu.com/s?wd=爬虫
```

+ 使用搜索修改后的 URL 进行搜索，依然会得到相同页面。
+ 因此可知“wd”参数是百度搜索的关键查询参数。
+ 下面编写爬虫程序对 “wd=爬虫”进行编码
+ 如下所示：

```python
# -*-coding: Utf-8 -*-
# @File : URL编码 .py
# author: Chimengmeng
# blog_url : https://www.cnblogs.com/dream-ze/
# Time：2023/5/21

# 导入parse模块
from urllib import parse

# 构建查询字符串字典
query_string = {
    'wd': '爬虫'
}
# 调用parse模块的urlencode()进行编码
result = parse.urlencode(query_string)
# 使用format函数格式化字符串，拼接url地址
url = 'http://www.baidu.com/s?{}'.format(result)
print(url)

# http://www.baidu.com/s?wd=%E7%88%AC%E8%99%AB
```

+ 编码后的 URL 地址依然可以通过地网页址栏实现搜索功能。 
    - 除了使用 urlencode() 方法之外
    - 也可以使用 quote(string) 方法实现编码，代码如下：

```python
# -*-coding: Utf-8 -*-
# @File : URL编码 .py
# author: Chimengmeng
# blog_url : https://www.cnblogs.com/dream-ze/
# Time：2023/5/21

from urllib import parse

# 注意url的书写格式，和 urlencode存在不同
url = 'http://www.baidu.com/s?wd={}'
word = input('请输入要搜索的内容:')
# quote()只能对字符串进行编码
query_string = parse.quote(word)
print(url.format(query_string))

# 请输入要搜索的内容:爬虫
# http://www.baidu.com/s?wd=%E7%88%AC%E8%99%AB
```

注意：

	quote() 只能对字符串编码，

	urlencode() 可以直接对查询字符串字典进行编码。

因此在定义 URL 时，需要注意两者之间的差异。

```python
# urllib.parse
urllib.parse.urlencode({'key':'value'}) #字典
urllib.parse.quote(string) #字符串
```

## 【2】**解码unquote(string)**
+ 解码是对编码后的 URL 进行还原的一种操作 
    - 示例代码如下：

```python
# -*-coding: Utf-8 -*-
# @File : URL编码 .py
# author: Chimengmeng
# blog_url : https://www.cnblogs.com/dream-ze/
# Time：2023/5/21

from urllib import parse

string = '%E7%88%AC%E8%99%AB'
result = parse.unquote(string)
print(result)

# 爬虫
```

## 【3】**URL地址拼接方式**
+ 最后，给大家介绍三种拼接 URL 地址的方法。
+ 除了使用 format() 函数外，还可以使用字符串相加，以及字符串占位符
+ 总结如下： 
    - 纯文本复制

```python
# -*-coding: Utf-8 -*-
# @File : URL编码 .py
# author: Chimengmeng
# blog_url : https://www.cnblogs.com/dream-ze/
# Time：2023/5/21

# 1、字符串相加
baseurl = 'http://www.baidu.com/s?'
params = 'wd=%E7%88%AC%E8%99%AB'
url = baseurl + params
# 2、字符串格式化（占位符）
params = 'wd=%E7%88%AC%E8%99%AB'
url = 'http://www.baidu.com/s?%s' % params
# 3、format()方法
url = 'http://www.baidu.com/s?{}'
params = 'wd=%E7%88%AC%E8%99%AB'
url = url.format(params)
```

