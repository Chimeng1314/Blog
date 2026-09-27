---
title: "Vue vm 对象简解"
published: 2023-08-25 08:18:00
category: Web 开发
series: "Vue 补充与实践"
seriesOrder: 6
hubs: ["vue-supplements"]
---

# 【补充】vm对象简解

```python
<body>
<div id="app">
    <!--插值语法-->
    <h1>{{name}}</h1>
    <br>
    <h2> 方法中的 this 对象 </h2>
    <button @click="handleClick1">点我</button>
</div>
</body>

<script>
    <!--  将创建的Vue对象封装到 vm 变量里面。控制台全局可以通过 vm.name 取值  -->
    // 写在 data 或 methods 中的属性或方法，可以从 vm 中直接 通过 vm.属性取值
    // methods的函数中，如果想使用data或methods中的属性，直接this.名字  就可以了
    var vm = new Vue({
        el: "#app",
        data: {
            name: "dream",
        },
        methods: {
            handleClick1() {
                console.log(this) // this 就是当前的 实例的 vm 对象
                // xr {_uid: 0, _isVue: true, __v_skip: true, _scope: t, $options: {…}, …}
            }
        },
    })
</script>
```

> - `vm`是一个Vue实例对象的变量名。
>
>   - Vue实例对象是Vue.js框架中最核心的概念之一，它扮演着连接数据和视图的桥梁作用。
>
>   - 数据绑定：
>     - 通过将`vm`对象传递给模板语法，可以实现数据的动态渲染。
>     - 例如，在模板中使用`{{name}}`的插值语法，`name`会被`vm`对象中的`data`属性中的`name`所替换，从而实现了`name`数据的动态展示。
>
>   - 方法调用：
>     - 在`vm`对象的`methods`属性中定义的方法，可以通过模板中的事件绑定（如`@click="handleClick1"`）来进行调用。
>     - 在这个例子中，当点击按钮时，会触发`handleClick1`方法，输出`this`对象。
>     - 在方法中，`this`指向当前的Vue实例对象`vm`，通过`this`可以访问到`vm`实例中的属性和方法。
>
> - 总结起来，`vm`对象是Vue实例对象的引用，通过这个对象可以访问和操作Vue实例的数据和方法。
>   - 它的作用是管理数据和行为，实现数据的双向绑定，以及处理用户交互和响应。
>   - 在模板中可以通过`vm`对象来访问数据，并触发相应的方法来实现业务逻辑的处理。

# 
