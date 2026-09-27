---
title: "浏览器存储与 Cookie"
published: 2023-08-23 10:30:00
category: Web 开发
series: "Vue 补充与实践"
seriesOrder: 5
hubs: ["vue-supplements"]
---

# 【补充】localstorage和sessionstorage,和cookie

- 前端存储数据
  - 登录成功，有token，存本地
    - 京东...
  - 不登陆加购物车
    - 迪卡侬官网
- 前端可以存数据的位置
  - localstorage：永久存储，除非你删除，关闭浏览器，再打开还会在
  - sessionstorage：只在当前会话生效，关闭浏览器，就没了
  - cookie：有过期时间，到了过期时间，自动删除

```vue
<template>
<div class="home">
    <h1>操作localstorage,永久存储</h1>
    <button @click="addLocalstorage">增加</button>
    <button @click="getLocalstorage">查</button>
    <button @click="deleteLocalstorage">删除</button>
    <h1>操作sessiostorage,当前会话，关闭浏览器</h1>
    <button @click="addSessiostorage">增加</button>
    <button @click="getSessiostorage">查</button>
    <button @click="deleteSessiostorage">删除</button>


    <h1>操作cookie,有过期时间</h1>
    <button @click="addCookie">增加</button>
    <button @click="getCookie">查</button>
    <button @click="deleteCookie">删除</button>

    </div>
</template>

<script>

    export default {
        name: 'HomeView',
        methods: {
            addLocalstorage() {
                var userinfo = {name: 'dream', age: 19}
                localStorage.setItem('userinfo', JSON.stringify(userinfo))

            },
            getLocalstorage() {
                var userinfo = localStorage.getItem('userinfo')
                console.log(JSON.parse(userinfo).name)

            },
            deleteLocalstorage() {
                localStorage.clear()
                localStorage.removeItem('userinfo')

            },
            addSessiostorage() {
                var userinfo = {name: '彭于晏', age: 19}
                sessionStorage.setItem('userinfo', JSON.stringify(userinfo))

            },
            getSessiostorage() {
                var userinfo = sessionStorage.getItem('userinfo')
                console.log(JSON.parse(userinfo).name)

            },
            deleteSessiostorage() {
                sessionStorage.clear()
                sessionStorage.removeItem('userinfo')

            },
            addCookie() {
                // 需要借助于第三方  vue-cookies
                // cnpm install -S vue-cookies
                this.$cookies.set('name', '刘亦菲', '300s')

            },
            getCookie() {
                console.log(this.$cookies.get('name'))

            },
            deleteCookie() {
                this.$cookies.remove('name')

            },
        }


    }
</script>

```

## 【1】localStorage:

- localStorage用于在浏览器中永久保存数据，除非手动删除或清除浏览器缓存。
  - 即使关闭浏览器再次打开，数据仍然可以被访问到。
- 在登录成功后
  - 如果有token需要持久保存，可以将token存储在localStorage中。
- localStorage提供了setItem(key, value)和getItem(key)等方法来设置和获取数据。
- 示例代码如下：

```javascript
// 存储token到localStorage
localStorage.setItem('token', 'your_token_here');

// 从localStorage中获取token
const token = localStorage.getItem('token');
```

## 【2】sessionStorage:

- sessionStorage用于在当前会话中临时保存数据，一旦会话结束（浏览器窗口关闭），数据就会被清除。
- 当用户未登录但需要加入购物车时，可以使用sessionStorage来存储相关数据。
- sessionStorage的使用方式与localStorage类似，示例代码如下：

```javascript
// 存储购物车商品ID到sessionStorage
sessionStorage.setItem('cartItemId', 'your_item_id_here');

// 从sessionStorage中获取购物车商品ID
const cartItemId = sessionStorage.getItem('cartItemId');
```

## 【3】cookie:

- cookie是存储在用户浏览器上的小型文本文件，它具有过期时间。
  - 当过期时间到达时，cookie会被自动删除。
- 可以使用cookie来实现一些需要在多个页面之间共享的数据。
- 通过document.cookie属性可以设置和获取cookie值。
- 示例代码如下：

```javascript
// 存储一个带过期时间的cookie
document.cookie = 'token=your_token_here; expires=Thu, 1 Jan 2024 12:00:00 UTC; path=/';
  
// 获取cookie
const cookieValue = document.cookie;
```

## 【4】小结

- 需要注意的是，安全性方面，为了避免敏感信息泄露，不建议将用户的敏感数据直接存储在localStorage、sessionStorage或cookie中。
  - 在实际开发中，对于敏感信息，最好使用安全的传输方式（例如HTTPS）进行传输，并在服务器端进行相应的验证和存储。
- 另外
  - 对于cookie，还需要注意设置合适的域名和路径，以确保cookie的正确读取和写入。
  - 同时，需要注意防止跨站脚本攻击(XSS)和跨站请求伪造攻击(CSRF)，对cookie进行适当的安全处理。
