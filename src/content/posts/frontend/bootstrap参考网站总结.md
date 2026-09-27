---
title: "Bootstrap 参考网站总结"
published: 2024-11-20 09:00:00
category: Web 开发
series: "前端工程与网络基础"
seriesOrder: 6
hubs: ["frontend-web-tools-network"]
---

# bootstrap参考网站总结

# 【一】官方文档

> 总官网：https://www.bootcss.com/

> Bootstrap v3：https://v3.bootcss.com/

# 【二】图标样式

> https://fontawesome.com.cn/

# 【三】弹框样式

> 样式展示：http://lipis.github.io/bootstrap-sweetalert/

> 文件地址：https://github.com/lipis/bootstrap-sweetalert

# 【引入方式总结】

> 使用方法：copy到head里面

## 【一】CDN链接引入

```html
    <!--  CDN 链接 引入方法  -->
    <!--  Bootstrap 的 CSS 样式文件  -->
    <link rel="stylesheet" href="https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/3.4.1/css/bootstrap.min.css">
    <!--  Bootstrap 的 JS 文件 (动画效果需要jQuery)  -->
    <script src="https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/3.4.1/js/bootstrap.min.js">// bootstrap </script>
    <!--  jQuery 文件  -->
    <script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.6.4/jquery.min.js"> // jquery</script>
```

## 【二】本地链接引入

### 【1】引入方法

```html
<!--  本地 链接 引入方法  -->
    <!--  Websource 文件夹 拷贝到当前文件夹下即可使用  -->
    <!--  jQuery 文件  -->
    <script src="Websource\jQuery\node_modules\jquery\dist\jquery.min.js"></script>
    <!--  Bootstrap 的 JS 文件 (动画效果需要jQuery)  -->
    <script src="Websource\Bootstrap\js\bootstrap.min.js"></script>
    <!--  Bootstrap 的 CSS 样式文件  -->
    <link rel="stylesheet" href="Websource\Bootstrap\css\bootstrap.min.css">
    <!-- bootstrap-sweetalert(弹框) 的 CSS 文件   -->
    <link rel="stylesheet" href="Websource\bootstrap-sweetalert\dist\sweetalert.css">
    <!-- bootstrap-sweetalert(弹框) 的 JS 文件 -->
    <script src="Websource\bootstrap-sweetalert\dist\sweetalert.js"></script>
```

### 【2】文件构成

- 文件结构

```
|-- Websource
	|-- Bootstrap
		|-- css
			|-- bootstrap.min.css
		|-- fonts(不可缺少)
			|--全部文件
		|-- js
			|-- bootstrap.min.js
	|-- bootstrap-sweetalert
		|-- dist
			|-- sweetalert.min.js
    |-- Icon
    	|-- 全部文件
    |-- jQuery
    	|-- node_modules
    		|-- jquery
    			|-- dist
    				|-- jquery.min.js

```

- 以上为必须文件

> 理论上只需要我链接引入的那部分文件就可以了，其他的都可以忽略(已标记文件夹的除外)
>
> 只要官方下载的包没问题，根据我的命名规范进行命名
>
> 引入一般不会有大问题
>
> 如果文件不生效，建议根据我的路径文件名去修改自己的路径
