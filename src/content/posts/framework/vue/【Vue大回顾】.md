---
title: "Vue 大回顾"
published: 2023-08-30 09:46:00
category: Web 开发
series: "Vue 补充与实践"
seriesOrder: 13
hubs: ["vue-supplements"]
---

# 【Vue大回顾】

# 【一】Vue入门

## 【1】MVVM（Model-View-ViewModel）架构

- MVVM（Model-View-ViewModel）是一种软件架构模式，用于将用户界面（View）与应用程序逻辑（Model）之间的关系进行解耦。
- 在MVVM中，ViewModel扮演着连接View和Model之间的角色，负责处理视图逻辑和数据绑定。

### （1）Model（模型）：

- Model代表应用程序的数据和业务逻辑。
  - 它通常包含数据访问、验证、持久化等功能，但不关心显示方式或用户交互。
- 在一个Vue应用中，Model可以是从服务器获取的数据，也可以是在前端定义的数据对象。

### （2）View（视图）：

- View是用户界面的表示，负责展示数据给用户，并接收用户的输入操作。
  - 它通常是由HTML和CSS来实现的。
- 在MVVM中，View是被动的，它不处理任何业务逻辑，只是根据ViewModel提供的数据来呈现界面。

### （3）ViewModel（视图模型）：

- ViewModel是View和Model之间的桥梁，它持有View所需的数据和命令，并通过双向数据绑定机制，确保View的变化反映在ViewModel中，同时ViewModel的变化也会更新View。
- ViewModel还负责处理用户界面的逻辑，例如表单验证、按钮点击事件等，以及与Model进行交互。
- 在Vue中，ViewModel由Vue实例表示，它包含了数据对象、计算属性、方法、监听器等，用于响应View和Model的变化。

### （4）MVVM架构的核心特点包括：

- 数据绑定：
  - View的展示和Model的数据保持同步
  - 当Model改变时，View会自动更新，而用户在View上的操作也会反映到Model上。

- 双向绑定：
  - 除了数据从Model到View的单向绑定外
  - MVVM还具备双向绑定的能力，即当用户在View上修改数据时，这些变化也会反映到Model上。

- 解耦合：
  - View和Model之间通过ViewModel进行交互，使得彼此之间解耦，提高代码的可维护性和可测试性。

- 逻辑复用：
  - 通过使用组件化开发的思想，ViewModel的逻辑可以被复用，提高开发效率。


### （5）总结来说

- MVVM架构通过引入ViewModel层，将View和Model解耦合并实现双向绑定，提供了一种更加灵活和可扩展的方式来开发和维护用户界面。
  - 在Vue中，采用MVVM架构可以帮助开发人员更加高效地构建现代化的Web应用程序。

## 【2】组件化开发，单页面应用

- 组件化开发和单页面应用是现代前端开发中常见的两个概念，它们在构建复杂、可重用和可维护的Web应用方面起到了重要作用。


### （1）组件化开发：

- 组件化开发是指将一个大型应用程序拆分成多个独立、可重用的组件，每个组件负责特定的功能，并独立进行开发、测试和维护。
  - 组件化开发的核心思想是"divide and conquer"，通过拆分应用程序到组件级别，可以提高代码的可读性、可维护性和可测试性。
- 在组件化开发中，每个组件都是具有独立功能的独立单元，它包含自己的模板（视图）、样式（CSS）和逻辑（JavaScript）。
  - 组件可以嵌套使用，从而实现复杂的应用程序结构。
  - 组件之间通过接口（props）进行通信，数据流动的方式更加清晰可控。
- 常见的组件化开发框架有Vue.js、React等。
  - 这些框架提供了组件开发所需的生命周期管理、状态管理、数据响应等基本能力，使得开发人员可以更加高效地构建复杂的Web应用程序。

### （2）单页面应用（Single Page Application，SPA）：

- 单页面应用是指在Web应用中，只有一个HTML页面，所有的内容和交互都在这个页面内部通过动态加载和局部刷新来实现。
  - 相比传统多页面应用，单页面应用具有更好的用户体验和流畅的交互效果。
- 在单页面应用中，用户在与应用程序交互时，页面不会重新加载，而是通过前端路由（如vue-router）来管理URL和页面状态的切换。
  - 通过异步加载数据和组件，单页面应用可以实现快速响应和良好的用户体验。

- 单页面应用的核心优势包括：
  - 更好的用户体验：页面切换更加流畅，避免了页面加载的延迟。

  - 更高的性能：减少了服务器的请求次数，提升了应用程序的加载速度。

  - 更好的代码复用：可以将通用的逻辑和组件进行封装，以便在不同页面中复用。


- 需要注意的是，单页面应用对前端开发要求较高，涉及到前端路由、状态管理、异步加载等技术。
  - 在构建大型应用时，需要对代码进行合理组织和分割，以确保应用的性能和可维护性。

### （3）综上所述

- 组件化开发和单页面应用是现代前端开发中的重要概念，它们通过拆分应用程序到组件级别、实现单页面的动态加载和切换，提高了开发的效率、用户体验和应用性能。

## 【3】vue渐进式框架 

- Vue是一款渐进式JavaScript框架，用于构建用户界面。它被设计成易用、灵活且高效的工具，可在Web开发中实现复杂的单页面应用和交互式用户界面。


### （1）渐进式的意思是

- Vue可以逐步应用到项目中，也可以作为一个库使用。
- 你可以从一个简单的JavaScript文件开始，然后逐步引入Vue的特性和功能，以满足你的项目需求。

- Vue的核心库只关注视图层，并封装了一些常用的功能，如模板语法、响应式数据绑定、组件系统等。
  - 它的API简洁友好，可以快速上手。同时，Vue还提供了一些有用的插件和附加库，如vue-router用于前端路由、vuex用于状态管理等，使得在构建复杂应用时更加便捷。

### （2）Vue的特点和优势包括：

- 响应式数据绑定：
  - Vue使用双向数据绑定机制，可以轻松实现将数据同步到视图层或者视图层与数据的变更同步。

- 组件化开发：
  - Vue拥有强大的组件系统，允许开发者将应用程序划分成独立、可复用的组件，使得代码更加可维护和可测试。

- 虚拟DOM：
  - Vue通过虚拟DOM，将组件树的操作映射为最小化的真实DOM操作，提高了性能和渲染的效率。

- 指令系统：
  - Vue提供了丰富的指令系统，如v-if、v-for、v-bind等，使得开发者可以更加便捷地操作DOM和实现交互逻辑。

- 生态系统：
  - Vue拥有活跃的社区和丰富的生态系统，提供了大量的插件和库以及周边工具，以满足不同项目的需求。


### （3）总之

- Vue作为一款渐进式框架，通过其简洁易用、高效灵活的特性，赢得了广大开发者的喜爱。
- 它可适用于各种规模的应用项目，并提供了丰富的生态系统支持。
- 无论是初学者还是经验丰富的开发者，都可以从Vue中受益，快速构建出高质量的Web应用。

## 【4】js框架

### （1）vue2

- Vue2是Vue.js的第二个主要版本，它是一款流行的JavaScript框架，用于构建用户界面。
- Vue2采用了渐进式的设计理念，具有响应式数据绑定和组件化开发等特性。

- 核心功能包括：

  - 响应式数据绑定：
    - Vue2使用双向数据绑定机制，通过将数据模型与视图进行关联，实现数据的自动更新。

  - 组件化开发：
    - Vue2采用组件化开发模式，允许将页面划分为独立、可复用的组件，提高了代码的可维护性和可测试性。

  - 模板语法：
    - Vue2使用基于HTML的模板语法，使开发者可以直观地描述视图的结构和行为。

  - 虚拟DOM：
    - Vue2通过虚拟DOM技术，将组件树的状态变更映射为最小化的真实DOM操作，提高了渲染性能。

- 除了核心功能之外，Vue2还提供了一系列的附加特性和工具

  - 如vue-router用于前端路由管理
  - vuex用于状态管理
  - vue-cli用于项目搭建等。

- 这些工具和插件丰富了Vue2的生态系统，帮助开发者更加高效地构建复杂的Web应用程序。

### （2）vue3 

- Vue3是Vue.js的第三个主要版本，它是在Vue2的基础上进行了全面升级和优化的一款JavaScript框架。
- Vue3在性能、开发体验和生态系统等方面带来了许多改进。

- Vue3的一些重要特性包括：
  - 更好的性能：
    - Vue3通过对响应式系统和虚拟DOM的改进，提升了组件的渲染性能和整体性能表现。
  - Composition API：
    - Vue3引入了Composition API，它是一种基于函数的API风格，使得组合逻辑更加灵活和可维护。
  - 更小的体积：
    - Vue3支持树摇和按需引入，可以使打包后的文件更小，加载更快。
  - 更好的TypeScript支持：
    - Vue3对TypeScript的支持更加友好，提供了全面的类型推导和类型检查功能。
  - 逐步升级：
    - Vue3提供了逐步迁移的方案，使得从Vue2迁移到Vue3变得更加容易。

### （3）总的来说

- Vue3在继承Vue2优点的同时，改进了性能、开发体验和生态系统等方面。
- 它具有更好的性能表现、更灵活的开发风格和更友好的TypeScript支持，对于构建现代化的Web应用程序具有很大的吸引力。
- 不过，需要注意的是，由于Vue3的一些改动，对于已有的Vue2项目，升级到Vue3可能需要一些工作和调整。

## 【5】第一个helloworld

### （1）安装Vue：

- 首先，在项目中引入Vue.js库。可以通过CDN引入，也可以使用npm安装。


### （2）创建HTML文件：

- 在HTML文件中，通过`<script>`标签引入Vue库，并在`<body>`标签中添加一个容器元素，用于挂载Vue实例。

```html
<!DOCTYPE html>
<html>
<head>
  <title>Hello World with Vue</title>
  <script src="https://cdn.jsdelivr.net/npm/vue"></script>
</head>
<body>
  <div id="app">
    <!-- 这里将会渲染Vue实例中的内容 -->
  </div>

  <script>
    // 在这里编写Vue的代码
  </script>
</body>
</html>
```

### （4）创建Vue实例：

- 在上述的`<script>`标签中，创建Vue实例并将其挂载到容器元素中。

```html
<script>
  new Vue({
    el: '#app',
    data: {
      message: 'Hello, World!' // 在data中定义message属性，初始值为'Hello, World!'
    }
  })
</script>
```

### （5）渲染数据：

- 使用双花括号`{{}}`将数据绑定到HTML模板中，实现数据的渲染。

```html
<div id="app">
  <p>{{ message }}</p>
</div>
```

### （6）完整的示例代码如下：

```html
<!DOCTYPE html>
<html>
<head>
  <title>Hello World with Vue</title>
  <script src="https://cdn.jsdelivr.net/npm/vue"></script>
</head>
<body>
  <div id="app">
    <p>{{ message }}</p>
  </div>

  <script>
    new Vue({
      el: '#app',
      data: {
        message: 'Hello, World!'
      }
    })
  </script>
</body>
</html>
```

- 以上代码会在浏览器中显示一个页面，其中包含一个段落标签`<p>`，并且通过数据绑定将`message`的值显示在页面中，即显示"Hello, World!"。
- 这样，就完成了Vue中的第一个"Hello World"示例。

## 【6】插值语法和三目运算符

- 在Vue中，`{{}}`是一种插值语法，用于在模板中绑定数据并将其显示到页面上。
  - 它可以用于在HTML元素、属性和文本内容中插入Vue实例中的数据。

### （1）在文本内容中插值：

```html
<p>{{ message }}</p>
```

- 在上述代码中，`{{ message }}`会被替换为Vue实例中的`message`属性的值。
- 当`message`属性的值发生变化时，页面上的文本内容也会自动更新。

### （2）在HTML属性中插值：

```html
<a href="{{ url }}">{{ linkText }}</a>
```

- 在上述代码中，`{{ url }}`和`{{ linkText }}`分别会被Vue实例中的`url`和`linkText`属性的值替换。
- 可以将动态的属性值绑定到Vue实例中的属性上。

### （3）使用三目运算符：

```html
<p>{{ isShow ? '显示' : '隐藏' }}</p>
```

- 上述代码中，通过三目运算符`?`和`:`根据`isShow`属性的值决定显示"显示"还是"隐藏"。
- 当`isShow`为`true`时，显示"显示"；当`isShow`为`false`时，显示"隐藏"。

> 需要注意的是，在插值语法中，只能进行简单的表达式计算，不能使用复杂的逻辑或函数调用。如果需要更复杂的计算逻辑，应该使用计算属性或方法来处理。

# 【二】指令系统

- 指令是Vue的一个核心特性，用于在模板中直接操作DOM。

## 【1】文本指令：

在Vue中，常见的文本指令包括`v-html`、`v-text`、`v-show`和`v-if`，它们分别用于动态地更新HTML内容、文本内容的显示、元素的显示和隐藏。

### （1）`v-html`指令：

- 作用：用于将Vue实例中的数据作为原始HTML内容进行渲染。
- 示例：

  ```html
  <div v-html="htmlContent"></div>
  ```

  上述代码会将Vue实例中的`htmlContent`属性的值作为HTML内容插入到`<div></div>`标签中。注意，由于使用了动态HTML内容，需要谨慎防止XSS攻击。

### （2）`v-text`指令：

- 作用：用于将Vue实例中的数据作为纯文本进行渲染。
- 示例：

  ```html
  <p v-text="message"></p>
  ```

  上述代码会将Vue实例中的`message`属性的值作为纯文本插入到`<p></p>`标签中。与插值语法类似，`v-text`指令会随着Vue实例中数据的变化自动更新文本内容。

### （3）`v-show`指令：

- 作用：根据表达式的值，控制元素的显示和隐藏。
- 示例：

  ```html
  <div v-show="isVisible">显示内容</div>
  ```

  上述代码中，`div`元素会根据Vue实例中的`isVisible`属性的值来决定是否显示。当`isVisible`为`true`时，元素会显示；当`isVisible`为`false`时，元素会隐藏，但仍然占据DOM空间。

### （4）`v-if`指令：

- 作用：根据表达式的值，控制元素的存在与否。
- 示例：

  ```html
  <div v-if="isExist">存在的元素</div>
  ```

  上述代码中，`div`元素会根据Vue实例中的`isExist`属性的值来决定是否在DOM中存在。当`isExist`为`true`时，元素存在于DOM中；当`isExist`为`false`时，元素从DOM中移除。

> - 需要注意的是
>   - `v-show`只是通过CSS的`display`属性来控制元素的显示和隐藏，元素实际上一直存在于DOM中；
>   - `v-if`将元素的存在与否直接影响到DOM结构。
> - 因此，在频繁切换显示和隐藏的情况下，使用`v-show`更高效。

## 【2】事件指令：

> v-on:事件名='函数'----》@事件名='函数'

- 事件指令是Vue中用于监听和处理DOM事件的指令。
  - 常见的事件指令包括`v-on`和`@`，它们都用于绑定事件处理函数。

### （1）`v-on`指令：

- 作用：用于监听DOM事件，并在事件触发时调用相应的处理函数。
- 示例：


```html
<button v-on:click="handleClick">点击按钮</button>
```

- 上述代码会在点击按钮时调用Vue实例中名为`handleClick`的方法。
- 可以根据需要监听任意的DOM事件，如`click`、`mouseover`、`change`等。

### （2）`@`简写形式：

- 作用：是对`v-on`指令的简写形式，常用于绑定事件处理函数。
- 示例：

  ```html
  <button @click="handleClick">点击按钮</button>
  ```

- 上述代码与前面的示例等价，都会调用Vue实例中的`handleClick`方法。

### （3）事件处理函数

- 可以定义在Vue实例的`methods`中，以供后续调用。例如：

```javascript
var vm = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  },
  methods: {
    handleClick: function () {
      console.log('按钮被点击了！');
    }
  }
});
```

- 需要注意的是，事件处理函数可以在函数体内访问Vue实例的数据和方法。
- 除了使用简单的表达式之外，还可以传递额外的参数或者使用内联语句。
- 例如：

```html
<button @click="handleClick($event, '额外参数')">点击按钮</button>
```

```javascript
methods: {
  handleClick: function (event, extraParam) {
    console.log('按钮被点击了！', event, extraParam);
  }
}
```

- 上述代码中，`$event`是一个特殊变量，可以在事件处理函数中访问原生事件对象。


## 【3】属性指令：

> v-bind:属性名=变量----》:属性名=变量

- 属性指令是Vue中用于动态绑定HTML元素属性的指令。
  - 常见的属性指令包括`v-bind`和`:`，它们都用于将属性与Vue实例的数据进行绑定。

### （1）`v-bind`指令：

- 作用：用于动态绑定HTML元素的属性。
- 示例：

  ```html
  <img v-bind:src="imageSrc">
  ```

- 上述代码会将`<img>`标签的`src`属性与Vue实例中名为`imageSrc`的数据绑定，从而动态地显示对应的图片。

### （2）`:`简写形式：

- 作用：是对`v-bind`指令的简写形式，常用于动态绑定HTML元素的属性。
- 示例：

  ```html
  <img :src="imageSrc">
  ```

- 上述代码与前面的示例等价，效果相同。

### （3）属性值位置使用表达式

- 可以直接使用Vue实例的数据或者计算属性。
- 例如：

```html
<div :class="{'active': isActive}"></div>
```

- 上述代码会根据Vue实例中的`isActive`数据决定是否给`<div>`元素添加`active`类。


### （4）传递静态字符串以及拼接动态值来绑定属性

如下所示：

```html
<a :href="'/user/' + userId">用户主页</a>
```

- 上述代码会将`href`属性绑定到一个由`'/user/'`字符串和Vue实例中的`userId`数据拼接而成的链接。


> - 需要注意的是
>   - 属性绑定不仅限于HTML元素的标准属性
>   - 还可以用于Vue组件的自定义属性。
>   - 例如：
>
> ```html
> <my-component :prop-name="dataValue"></my-component>
> ```
>
> - 上述代码会将Vue实例中的`dataValue`数据传递给自定义组件的`prop-name`属性。
>

## 【4】style和class： 

- 在Vue中，可以通过`style`和`class`属性来动态设置HTML元素的样式和类。


### （1）字符串形式：

- `style`属性字符串形式用于直接设置元素的内联样式。
- 示例：

  ```html
  <div style="color: red; font-size: 18px;">Hello, Vue!</div>
  ```

  上述代码会将`<div>`元素的文字颜色设置为红色，字体大小设置为18像素。

### （2）数组形式：

- `class`属性数组形式用于根据多个条件动态设置元素的类。
- 示例：

  ```html
  <div :class="['highlight', isActive ? 'active' : '']">Dynamic Class</div>
  ```

  上述代码会给`<div>`元素添加`highlight`类，并根据`isActive`数据的值决定是否添加`active`类。

### （3）对象形式：

- `style`属性对象形式用于根据不同情况动态设置元素的内联样式。
- `class`属性对象形式用于根据多个条件动态设置元素的类。
- 示例：

  ```html
  <div :style="{ color: textColor, 'font-size': fontSize + 'px' }">Dynamic Style</div>
  <div :class="{ highlight: isHighlighted, active: isActive }">Dynamic Class</div>
  ```

  上述代码会根据Vue实例中的`textColor`和`fontSize`数据动态设置`<div>`元素的样式，以及根据`isHighlighted`和`isActive`数据的值动态设置类名。

> - 通过使用组合不同的样式和类绑定方式，可以在Vue中实现灵活的样式和类的动态设置。
>
> - 需要注意的是
>   - 在绑定中可以使用计算属性或者直接引用Vue实例中的数据来根据业务需要进行样式和类的动态设定。

# 【三】v-if v-else-if  v-else

- 在Vue中，`v-if`、`v-else-if`和`v-else`是用来根据条件动态地显示或隐藏HTML元素的指令。


## 【1】`v-if`指令：

- 用法：`v-if="condition"`，其中`condition`是一个返回布尔值的表达式。
- 功能：根据条件的真假决定是否渲染DOM元素。
- 示例：

  ```html
  <div v-if="isUserLoggedIn">Welcome, User!</div>
  ```

  上述代码会根据`isUserLoggedIn`的值决定是否显示`<div>`元素。

## 【2】`v-else-if`指令：

- 用法：`v-else-if="condition"`，其中`condition`是一个返回布尔值的表达式。
- 功能：用于在多个条件判断的情况下，根据条件的真假决定是否渲染DOM元素。
- 注意：`v-else-if`必须紧跟在`v-if`或`v-else-if`指令之后。
- 示例：

  ```html
  <div v-if="isUserAdmin">Welcome, Admin!</div>
  <div v-else-if="isUserModerator">Welcome, Moderator!</div>
  ```

  上述代码会根据`isUserAdmin`和`isUserModerator`的值决定分别显示不同的`<div>`元素。

## 【3】`v-else`指令：

- 用法：`v-else`
- 功能：用于在`v-if`或者`v-else-if`条件为假时，渲染DOM元素。
- 注意：`v-else`必须紧跟在`v-if`或`v-else-if`指令之后。
- 示例：

  ```html
  <div v-if="isUserLoggedIn">Welcome, User!</div>
  <div v-else>Please log in to continue.</div>
  ```

  上述代码会在`isUserLoggedIn`为真时显示第一个`<div>`元素，否则显示第二个`<div>`元素。

> - 通过使用`v-if`、`v-else-if`和`v-else`指令，可以根据条件的不同动态地渲染不同的DOM元素，从而实现灵活的条件渲染。
>
> - 需要注意的是，在开发中，经常需要考虑`v-if`、`v-else-if`和`v-else`指令的性能影响，避免不必要的DOM操作，尽量减少不必要的条件判断。

# 【四】v-for(可以接受两个值)

- 在Vue中，`v-for`指令用于循环渲染HTML元素或组件。
  - 它可以接受多种数据类型作为遍历源，包括数字、字符串、数组和对象。

## 【1】数字：

- 使用数字作为遍历源时，`v-for`会重复渲染指定数量的元素。
- 示例：

  ```html
  <ul>
    <li v-for="num in 5" :key="num">{{ num }}</li>
  </ul>
  ```

  上述代码会渲染一个包含5个列表项的无序列表。

## 【2】字符串：

- 使用字符串作为遍历源时，`v-for`会将字符串拆分为单个字符进行遍历，并渲染相应的元素。
- 示例：

  ```html
  <div>
    <span v-for="char in 'Vue'">{{ char }}</span>
  </div>
  ```

  上述代码会渲染一个包含3个`<span>`元素的`<div>`，每个`<span>`元素显示字符串'Vue'的一个字符。

## 【3】数组：

- 使用数组作为遍历源时，`v-for`会迭代数组的每个元素，并渲染相应的元素。
- 示例：

  ```html
  <ul>
    <li v-for="item in items" :key="item.id">{{ item.name }}</li>
  </ul>
  ```

  上述代码会根据`items`数组中的元素数量，渲染相应数量的列表项。

## 【4】对象：

- 使用对象作为遍历源时，`v-for`会迭代对象的每个属性，并渲染相应的元素。
- 示例：

  ```html
  <ul>
    <li v-for="(value, key) in user" :key="key">{{ key }}: {{ value }}</li>
  </ul>
  ```

  上述代码会渲染一个包含用户信息的列表，每个列表项显示一个属性和对应的值。

## 【5】`key`值的解释：加速虚拟DOM替换

- 在使用`v-for`进行循环渲染时，Vue需要为每个生成的元素分配一个唯一的`key`属性，以便更高效地更新和重新渲染DOM。
- `key`值应该是每个被迭代的元素中唯一且稳定的标识符。
- 通过提供正确的`key`，Vue能够快速准确地找到需要更新的元素，而无需重新创建整个列表，从而提高性能。

## 【6】总结：

- `v-for`指令可以接受数字、字符串、数组和对象作为遍历源，并根据不同的数据类型进行相应的渲染。
- 同时，为循环生成的元素提供唯一的`key`值，有助于加速虚拟DOM的替换过程，提高渲染的效率。

# 【五】给对象增加值，失去了响应式

- 在Vue中，当你想给一个已经存在的对象添加新的属性时，普通的对象赋值方式可能会导致页面不会发生变化，失去了响应式。
- 为了解决这个问题，你可以使用`Vue.set`方法来给对象动态添加属性并保持响应式。

## 【1】`Vue.set`方法的语法如下：

```javascript
Vue.set(object, key, value)
```

> 其中：
> - `object`是要修改的对象。
> - `key`是要添加的属性名。
> - `value`是要添加的属性值。
>

- 使用`Vue.set`方法后，Vue会对被修改的对象进行特殊处理，以保持响应式。
- 这样，在你通过`Vue.set`向对象添加新属性时，页面会相应地更新。

## 【2】示例：

```javascript
// 定义一个Vue实例
new Vue({
  data() {
    return {
      user: {
        name: 'John',
        age: 25,
      },
    };
  },
  methods: {
    addProperty() {
      // 使用Vue.set动态添加属性
      Vue.set(this.user, 'email', 'john@example.com');
    },
  },
});
```

- 在上述示例中，我们有一个名为`user`的对象，初始时只有`name`和`age`两个属性。通过调用`addProperty`方法并使用`Vue.set`，我们向`user`对象添加了一个新属性`email`。
- 由于使用了`Vue.set`，页面会对变化做出响应，显示新添加的属性。

## 【3】总结：

- 使用普通的对象赋值方式给对象增加新的属性可能导致页面不会进行响应式更新。
- 为了解决这个问题，可以使用`Vue.set`方法来给对象添加属性，并保持响应式。
- 通过调用`Vue.set`方法并传入对象、属性名和属性值，可以确保页面能够正确地响应对象属性的变化。

# 【六】数据双向绑定

- 数据双向绑定是Vue框架中的一个重要特性
  - 通过`v-model`指令可以实现将表单控件的值和Vue实例中的数据进行双向绑定。
- 当使用`v-model`指令时，它会根据不同的表单控件类型来自动选择正确的行为。
- 以下是一些常见的表单控件类型及其对应的`v-model`用法：

## 【1】`<input type="text">`：文本输入框

```html
<input type="text" v-model="message">
```

## 【2】`<input type="password">`：密码输入框

```html
<input type="password" v-model="password">
```

## 【3】`<input type="checkbox">`：复选框

```html
<input type="checkbox" v-model="isChecked">
```

## 【4】`<input type="radio">`：单选框

```html
<input type="radio" value="option1" v-model="selectedOption">
<input type="radio" value="option2" v-model="selectedOption">
```

## 【5】`<select>`：下拉框

```html
<select v-model="selectedValue">
  <option value="option1">Option 1</option>
  <option value="option2">Option 2</option>
</select>
```

## 【6】小结

- 通过使用`v-model`，表单控件的值会与Vue实例中的数据进行双向绑定
  - 当用户在表单控件中输入内容时，该变动会自动更新Vue实例中相应的数据；
  - 反之，当Vue实例中的数据改变时，表单控件的值也会自动更新以反映最新的数据。
- 双向绑定使得开发者无需手动监听表单控件的输入事件和手动更新数据，简化了数据绑定的过程，提高了开发效率。


> - 需要注意的是，`v-model`指令只能应用在支持值（value）和输入事件（input）的表单元素上。
> - 对于其他自定义组件，可以通过`model`选项来创建自定义的双向绑定。

## 【7】总结

- 通过使用`v-model`指令，可以实现将表单控件和Vue实例中的数据进行双向绑定，简化了数据绑定的操作。
- 不同类型的表单控件需要使用不同的`v-model`用法来实现双向数据绑定。

# 【七】 input的事件处理

- 在Web开发中，针对`<input>`元素，常用的事件处理包括`input`事件、`change`事件、`blur`事件和`focus`事件。
- 以下是对它们的详细解释：

## 【1】`input`事件：

- 当用户在输入框中键入或粘贴文本时触发。该事件会在每次输入变化时都被触发，可以用来实时响应用户的输入。

```javascript
<input type="text" @input="handleInput">
```
```javascript
methods: {
  handleInput(event) {
    console.log(event.target.value);
  }
}
```
- 在这个例子中，`handleInput`方法会在每次输入改变时被调用，打印出当前输入框的值。

## 【2】`change`事件：

- 当输入框的值发生改变且失去焦点时触发，也可以通过按下Enter键使输入框失去焦点从而触发该事件。

```javascript
<input type="text" @change="handleChange">
```
```javascript
methods: {
  handleChange(event) {
    console.log(event.target.value);
  }
}
```
- 在这个例子中，`handleChange`方法会在输入框的值被改变并失去焦点时被调用，打印出当前输入框的值。

## 【3】`blur`事件：

- 当输入框失去焦点时触发，即用户点击输入框外部或者将焦点转移到页面上的其他元素时触发。

```javascript
<input type="text" @blur="handleBlur">
```
```javascript
methods: {
  handleBlur(event) {
    console.log("Input blurred");
  }
}
```
- 在这个例子中，`handleBlur`方法会在输入框失去焦点时被调用，打印出"Input blurred"。

## 【4】`focus`事件：

- 当输入框获得焦点时触发，即用户点击输入框或使用Tab键将焦点移动到输入框时触发。

```javascript
<input type="text" @focus="handleFocus">
```
```javascript
methods: {
  handleFocus(event) {
    console.log("Input focused");
  }
}
```
- 在这个例子中，`handleFocus`方法会在输入框获得焦点时被调用，打印出"Input focused"。

> - 这些事件处理可以用来实现各种交互逻辑。
> - 通过监听这些事件，开发者可以及时响应用户的输入、值的变化、焦点转移等行为，并进行相应的处理。

# 【八】过滤案例

> 数组的过滤 filter---》传匿名函数---》返回true或false，如果返回true表示保留，返回false表示不保留---》this指向问题
>
> indexOf：判断一个子字符串是否再字符串中 >=0

## 【1】使用过滤器（Filter）来对数组过滤

- 在Vue中，我们可以使用过滤器（Filter）来对数组进行过滤操作。
  - 下面是一个示例：
- 假设我们有一个包含多个用户对象的数组，每个用户对象包含姓名和年龄信息。
- 现在我们想要过滤出年龄大于等于18岁的用户。

```javascript
<template>
  <div>
    <ul>
      <li v-for="user in filteredUsers" :key="user.id">
        {{ user.name }} - {{ user.age }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      users: [
        { id: 1, name: "Alice", age: 20 },
        { id: 2, name: "Bob", age: 17 },
        { id: 3, name: "Charlie", age: 25 },
        { id: 4, name: "David", age: 16 },
      ],
    };
  },
  computed: {
    filteredUsers() {
      return this.users.filter((user) => user.age >= 18);
    },
  },
};
</script>
```

- 在这个示例中，我们定义了一个名为`users`的数组，包含了四个用户对象。
- 然后利用Vue的计算属性`filteredUsers`来实现对数组的过滤操作。在计算属性中，我们使用`filter`方法，并传入一个匿名函数作为回调。
  - 该匿名函数中的逻辑判断了用户的年龄是否大于等于18岁
    - 如果大于等于18岁则返回`true`，表示保留该用户对象
    - 否则返回`false`，表示不保留该用户对象。

- 最后，我们在模板中使用`v-for`指令遍历`filteredUsers`数组中的元素，将满足过滤条件的用户信息展示出来。

## 【2】indexOf

- 另外，关于字符串的过滤可以使用JavaScript中的字符串方法`indexOf`。
  - 当`indexOf`方法返回大于等于0的值时，表示子字符串出现在字符串中；
  - 当返回-1时，表示子字符串不存在于字符串中。
- 可以通过该方法来判断一个子字符串是否在一个字符串中。

# 【九】事件修饰符

> - .stop	
>   - 只处理自己的事件，不再把事件冒泡给父标签（阻止事件冒泡），在子标签身上加
> - .self	
>   - 只处理自己的事件，子控件冒泡的事件不处理
> - .prevent	
>   - 阻止a链接的跳转
> - .once	
>   - 事件只会触发一次（适用于抽奖页面）

- 事件修饰符是Vue提供的一种语法糖，用于在处理事件时添加额外的行为或修改事件的默认行为。
- 下面详细解释所提到的事件修饰符：

## 【1】`.stop`：

- 只处理自己的事件，不再将事件冒泡给父标签。
- 可以在子标签上使用`.stop`修饰符，当事件发生在该子标签上时，父级元素不会触发相同类型的事件。例如：

```html
<div @click="parentMethod">
  <button @click.stop="childMethod">点击我</button>
</div>
```
- 在以上示例中，当点击`button`时，只会触发`childMethod`方法，而不会触发`parentMethod`方法。


## 【2】`.self`：

- 只处理自己的事件，不处理子元素的冒泡事件。
- 可以在绑定事件的元素上使用`.self`修饰符，当事件发生在该元素上时，其子元素触发的相同类型的事件不会被处理。例如：

```html
<div @click.self="parentMethod">
  <button @click="childMethod">点击我</button>
</div>
```
- 在以上示例中，当点击`button`时，只会触发`childMethod`方法，不会触发`parentMethod`方法。


## 【3】`.prevent`：

- 阻止默认行为，主要用于阻止`<a>`标签的跳转行为。
- 可以在触发事件的元素上使用`.prevent`修饰符，当事件发生时，浏览器默认的行为（例如跳转链接）将被阻止。
- 例如：

```html
<a href="https://www.example.com" @click.prevent="doSomething">点击我</a>
```
- 在以上示例中，当点击该链接时，会执行`doSomething`方法而不触发链接的跳转行为。


## 【4】`.once`：

- 事件只会触发一次，适用于只需触发一次的场景，比如抽奖页面中的按钮。
- 可以在绑定事件的元素上使用`.once`修饰符，当事件第一次触发后，再次触发相同类型的事件将不再处理。
- 例如：

```html
<button @click.once="handleClick">点击一次</button>
```
- 在以上示例中，当按钮被点击后，`handleClick`方法会被执行，并且再次点击按钮将不再触发该方法。


# 【十】事件冒泡

- 事件冒泡是指在DOM结构中，当一个元素上发生某个事件（例如点击事件）
  - 该事件将从触发元素开始向上冒泡到祖先元素，逐级触发这些祖先元素上相同类型的事件。

## 【1】事件冒泡按照以下顺序进行：

- 事件首先在触发元素上触发，并执行对应的事件处理函数。
- 然后事件继续冒泡到当前元素的父级元素，再次触发相同类型的事件，并执行事件处理函数。
- 这个过程一直重复，直到事件冒泡到文档根元素或被阻止。

> - 通过事件冒泡
>   - 我们可以方便地监听事件并在合适的层级处理事件
>   - 而不需要在每个子元素上都绑定事件处理函数。

## 【2】阻止事件冒泡

- 在JavaScript和Vue中，可以通过事件修饰符（如`.stop`和`.self`）来控制事件冒泡的行为。
  - 例如`.stop`修饰符可阻止事件继续向上冒泡
  - `.self`修饰符可使事件仅在当前元素上触发而不触发父级元素上相同类型的事件。

## 【3】事件冒泡的好处包括：

- 提高代码的可维护性和可扩展性：
  - 通过将事件处理函数绑定在父级元素上，可以减少在子元素上添加事件监听的代码量，使代码更清晰、简洁。

- 方便处理动态添加的元素：
  - 当动态添加新的子元素时，无需重新绑定事件，因为事件冒泡会自动触发父元素上的事件处理函数。

- 充分利用事件委托的优势：
  - 事件委托是一种性能优化技术，通过将事件处理委托给父级元素，减少了内存占用和事件处理函数数量。


## 【4】总结

- 然而
  - 在某些特定情况下，事件冒泡可能会带来一些不便
  - 例如需要在特定元素上停止事件传播或阻止默认行为。
  - 在这些情况下，可以使用适当的事件修饰符或调用事件对象提供的方法来控制事件的冒泡或阻止行为。

- 总之
  - 事件冒泡机制是前端开发中的重要概念，通过适当的处理和利用，可以提高代码的易读性、可维护性和性能。

# 【十一】按键事件和修饰符

> - @keyup
> - @keyup.enter

- 按键事件和修饰符是在前端开发中用于监听用户按键操作的一种机制。
- 通过使用不同的事件和修饰符，可以方便地捕获和处理特定按键的触发。

## 【1】@keyup/@keyup.enter

- `@keyup`：
  - 这是Vue.js中的一个按键事件修饰符，用于捕获键盘按键弹起的时刻。
  - 当用户释放按键时，`@keyup`事件会被触发，并执行对应的事件处理函数。

- `@keyup.enter`：
  - 这是Vue.js中的按键事件修饰符的一种特殊形式，用于捕获回车键（Enter键）被释放的时刻。
  - 当用户释放回车键时，`@keyup.enter`事件会被触发，并执行对应的事件处理函数。

## 【2】监听用户回车操作

- 举个例子来说，如果你想监听用户在输入框中输入完成后按下回车键的操作，你可以使用`@keyup.enter`修饰符来实现。
- HTML模板中的示例代码如下：

```html
<template>
  <input type="text" @keyup.enter="handleEnterKey">
</template>
```

- 在以上代码中，`@keyup.enter`修饰符绑定了名为`handleEnterKey`的事件处理函数。
- 当用户在输入框中按下回车键后释放，`handleEnterKey`函数会被调用执行。

```javascript
<script>
export default {
  methods: {
    handleEnterKey() {
      // 处理回车键按下后的操作
      console.log('Enter key was pressed');
    }
  }
}
</script>
```

## 【3】原生的`keyup`事件来监听键盘按键

- 在JavaScript中，你也可以使用原生的`keyup`事件来监听键盘按键，并通过判断`event.keyCode`或`event.key`来确定触发的按键是否为回车键。
- 但使用Vue.js的修饰符语法，能够简化代码，并使得处理不同按键的操作更加清晰易懂。

## 【4】小结

- 按键事件和修饰符是用于捕获和处理键盘按键操作的一种机制。
- 通过使用`@keyup`事件和不同的修饰符，尤其是`@keyup.enter`修饰符，你可以方便地监听和处理特定按键（如回车键）的操作。

# 【十二】checkbox ,radio

- 在Vue中，可以使用`<input>`元素和绑定数据的方式来创建checkbox和radio组件，并实现单选和多选功能。


## 【1】单选（Radio）：

- 首先，你需要创建一个`<input type="radio">`元素，并绑定一个唯一的`value`值和一个`v-model`指令，用于实现数据双向绑定。
- 在相同的`name`属性下创建多个radio元素，这样它们就会成为一个单选组。
- 当选中其中一个radio时，对应的`value`值将通过`v-model`指令传递给绑定的数据，从而实现单选功能。

- 举个例子来说，以下是一个基本的单选示例：


```html
<template>
  <div>
    <label>
      <input type="radio" value="option1" v-model="selectedOption">
      Option 1
    </label>
    <label>
      <input type="radio" value="option2" v-model="selectedOption">
      Option 2
    </label>
    <p>Selected option: {{ selectedOption }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedOption: ''
    }
  }
}
</script>
```

- 在上述代码中，我们创建了两个radio选项，分别绑定了值为`option1`和`option2`。
- 这两个radio元素拥有相同的`name`属性，形成单选组。
- 当选中其中一个选项时，对应的`value`值将传递给`selectedOption`，从而更新绑定的数据，并实现单选功能。

## 【2】多选（Checkbox）：

- 类似于单选，你需要创建一个`<input type="checkbox">`元素，并绑定一个唯一的`value`值和一个`v-model`指令。
- 当checkbox被选中时，对应的`value`值将通过`v-model`指令传递给绑定的数据，从而实现多选功能。

- 以下是一个基本的多选示例：


```html
<template>
  <div>
    <label>
      <input type="checkbox" value="option1" v-model="selectedOptions">
      Option 1
    </label>
    <label>
      <input type="checkbox" value="option2" v-model="selectedOptions">
      Option 2
    </label>
    <p>Selected options: {{ selectedOptions }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedOptions: []
    }
  }
}
</script>
```

- 在上述代码中，我们创建了两个checkbox选项，分别绑定了值为`option1`和`option2`。
- 当选中其中一个或多个checkbox时，对应的`value`值会被推送到`selectedOptions`数组中，从而更新绑定的数据，并实现多选功能。

## 【3】总结：

- 在Vue中，你可以使用`v-model`指令和绑定数据的方式来实现checkbox和radio的单选和多选功能。
- 通过指定不同的`value`值和适当地使用`name`属性，你可以创建单选组或多个独立的checkbox/radio组件，并通过数据的变化来进行选择。

# 【十三】购物车案例

- 在Vue中，一个常见的购物车案例通常包括全选/全不选功能和增加/减少商品数量功能。

## 【1】全选/全不选：

- 首先，你需要在数据中定义一个变量来表示是否全选的状态，比如命名为`selectedAll`，并将其初始化为`false`。
- 在界面上创建一个checkbox，并使用`v-model`指令将其与`selectedAll`数据进行双向绑定。
- 当点击全选checkbox时，通过修改`selectedAll`的值，可以实现全选/全不选的效果。
  - 当`selectedAll`为`true`时，将会选中所有商品的checkbox
  - 当`selectedAll`为`false`时，将会取消选中所有商品的checkbox。

- 以下是一个简单的示例：


```html
<template>
  <div>
    <label>
      <input type="checkbox" v-model="selectedAll">
      Select All
    </label>
    <div v-for="item in items" :key="item.id">
      <label>
        <input type="checkbox" v-model="item.selected">
        {{ item.name }}
      </label>
      <span>{{ item.price }}</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedAll: false,
      items: [
        { id: 1, name: 'Product A', price: 10, selected: false },
        { id: 2, name: 'Product B', price: 20, selected: false },
        { id: 3, name: 'Product C', price: 30, selected: false },
      ]
    }
  },
  watch: {
    selectedAll(newVal) {
      this.items.forEach(item => {
        item.selected = newVal;
      });
    }
  }
}
</script>
```

- 在上述代码中，我们在`data`中定义了`selectedAll`变量来表示全选状态，并定义了一个包含商品信息的数组`items`。
  - 通过`v-model="selectedAll"`将全选checkbox与`selectedAll`数据进行双向绑定。
- 当点击全选checkbox时，`watch`属性会监视`selectedAll`变量的变化，在`watch`的回调函数中，我们遍历`items`数组，将每个商品的`selected`字段设为和`selectedAll`一致的值，从而实现全选/全不选的效果。


## 【2】增加/减少商品数量：

- 对于增加和减少商品数量的功能，你可以为每个商品定义一个`quantity`字段，表示商品的数量。
- 在页面上创建一个增加按钮和一个减少按钮，并使用`@click`事件监听器来响应按钮点击事件。
  - 在点击增加按钮时，可以通过修改对应商品的`quantity`字段来增加商品数量；
  - 在点击减少按钮时，可以通过修改对应商品的`quantity`字段来减少商品数量。

- 以下是示例代码：


```html
<template>
  <div>
    <div v-for="item in items" :key="item.id">
      <label>
        <input type="checkbox" v-model="item.selected">
        {{ item.name }}
      </label>
      <span>{{ item.price }}</span>
      <div>
        <button @click="increaseQuantity(item)">+</button>
        <span>{{ item.quantity }}</span>
        <button @click="decreaseQuantity(item)">-</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        { id: 1, name: 'Product A', price: 10, selected: false, quantity: 1 },
        { id: 2, name: 'Product B', price: 20, selected: false, quantity: 1 },
        { id: 3, name: 'Product C', price: 30, selected: false, quantity: 1 },
      ]
    }
  },
  methods: {
    increaseQuantity(item) {
      item.quantity++;
    },
    decreaseQuantity(item) {
      if (item.quantity > 1) {
        item.quantity--;
      }
    }
  }
}
</script>
```

- 在上述代码中，我们为每个商品添加了`quantity`字段，并通过增加按钮和减少按钮来改变该字段的值。
- 点击增加按钮会将对应商品的`quantity`加1，点击减少按钮则会将对应商品的`quantity`减1，但最小不能小于1。

## 【3】总结：

- 在Vue中，你可以使用数据的双向绑定以及事件监听器来实现购物车案例中的全选/全不选和增加/减少商品数量的功能。
- 全选/全不选可以通过一个变量来表示状态，并通过修改该变量的值来选中或取消选中所有商品。
- 增加/减少商品数量可以通过修改商品对象中的一个字段来实现。

# 【十四】v-model进阶

- 在Vue中，v-model指令是一个常用的双向绑定指令，用于在表单元素和Vue实例之间建立数据绑定关系。
- 除了基本的用法之外，v-model还提供了一些进阶的功能，其中包括`lazy`、`number`和`trim`

## 【1】`lazy`：

- 默认情况下，v-model会在输入框的`input`事件触发时同步更新数据。
  - 但有时我们希望在失去焦点时才更新数据，这时可以使用`lazy`修饰符。
- 使用`lazy`修饰符后，v-model会在与表单元素关联的`change`事件触发时才更新数据。
- 这个功能通常用于处理大量输入内容或者需要进行复杂计算的场景，避免不必要的数据更新。

- 示例：


```html
<template>
  <div>
    <input v-model.lazy="message" type="text">
    <p>{{ message }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: ''
    }
  }
}
</script>
```

- 在上述代码中，使用`v-model.lazy`将输入框的值与Vue实例的message属性进行双向绑定。当输入框失去焦点时，才会触发数据的更新操作。


## 【2】`number`：

- 在默认情况下，v-model会将用户的输入视为字符串。
  - 但对于某些需要处理数字的情况，我们可以使用`number`修饰符。
- 使用`number`修饰符后，v-model会自动将用户输入的值转换为数字类型。

- 示例：


```html
<template>
  <div>
    <input v-model.number="count" type="number">
    <p>{{ count }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 0
    }
  }
}
</script>
```

- 在上述代码中，使用`v-model.number`将数字输入框与Vue实例的count属性进行双向绑定。
  - 无论用户输入的是字符串还是数字，vue都会将其转换为数字类型，并更新到count字段。

## 【3】`trim`：

- 在默认情况下，v-model不会去除用户输入内容的前后空格。
  - 但在某些情况下，我们希望去掉用户输入内容的首尾空格，这时可以使用`trim`修饰符。
- 使用`trim`修饰符后，v-model会自动去掉用户输入内容的首尾空格。

- 示例：


```html
<template>
  <div>
    <input v-model.trim="name" type="text">
    <p>{{ name }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: ''
    }
  }
}
</script>
```

- 在上述代码中，使用`v-model.trim`将输入框与Vue实例的name属性进行双向绑定。
- 无论用户输入的内容前后有没有空格，vue都会去掉首尾空格，并将结果更新到name字段。

# 【十五】跟后端交互

> - 延伸阅读：[【补充】前后端交互的三种方式](/posts/framework/vue/【补充】前后端交互的三种方式/)

- `axios`是一个常用的基于Promise的HTTP客户端，可以用于浏览器和Node.js中发送HTTP请求。

## 【1】GET请求示例：

```javascript
axios.get('请求地址', { params: { name: 'dream', age: 19 }, headers: { 请求头 } })
  .then(res => {
    const data = res.data; // 响应体内容，通常包括code、msg和result等字段
    const resultData = res.data.result.data; // 响应体中的具体数据
    // 在这里处理响应数据
  });
```

- 上述代码通过`axios.get`方法发送一个GET请求。请求地址是第一个参数传递，请求参数可以通过`params`字段指定为一个对象。
- `headers`字段可以用来设置请求头。
- 在`then`函数中，通过`res.data`获取响应体内容，一般情况下包括`code`、`msg`和`result`等字段。可以根据实际接口定义来获取相应字段的值。
- 根据需要，可以从响应体的`result`字段中进一步获取具体的数据。

## 【2】POST请求示例：

```javascript
axios.post('请求地址', { name: 'dream', age: 19 }, { headers: { 请求头 } })
  .then(res => {
    // 在这里处理响应数据
  });
```

- 上述代码通过`axios.post`方法发送一个POST请求。请求地址是第一个参数传递，请求数据可以通过第二个参数传递为一个对象。
- `headers`字段同样可以用来设置请求头。
- 在`then`函数中，可以处理获取到的响应数据。

# 【十六】跨越问题

> - 延伸阅读：[【补充】后端接口处理跨域](/posts/framework/vue/【补充】后端接口处理跨域/)

- 在Vue中使用axios进行跨域请求时，可能会遇到跨域问题。
  - 跨域是由于浏览器的同源策略限制导致的，即只允许在相同协议、域名和端口下进行请求。
- 要解决Vue中的axios跨域问题，可以采用以下终极解决方案：


## 【1】后端设置允许跨域请求：

- 在后端服务器上进行配置，允许Vue应用所在的域名进行跨域请求。
- 根据后端技术不同，具体的配置方法可能有所差异。

## 【2】使用代理方式：

- 在Vue应用的配置文件`vue.config.js`中进行代理配置，将跨域请求转发给后端服务器。
- 以下是一个示例的配置：

```javascript
module.exports = {
  devServer: {
    proxy: {
      '^/api': {
        target: 'http://后端服务器地址',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}
```

- 上述配置中，`/^/api`表示以`/api`开头的请求会被代理转发。
- `target`指定了后端服务器的地址。
- `changeOrigin`设置为`true`表示更改请求头中的Origin值为目标URL。
- `pathRewrite`用于重写请求路径，这里将`/api`前缀去掉。

## 【3】修改发送请求时将路径设置为代理的路径

```javascript
axios.get('/api/请求路径')
  .then(res => {
    // 处理响应数据
  });
```

- 这样就可以通过代理来解决跨域问题。

## 【4】JSONP跨域： 

- JSONP是一种利用`<script>`标签没有跨域限制的特性来实现跨域请求的方法。
- 不过，这种方法只适用于GET请求，并且需要后端服务器对JSONP请求进行相应的处理。

# 【十七】计算属性监听属性

- 在Vue中，我们可以使用`computed`和`watch`来实现对属性的计算和响应式监听。


## 【1】**computed中：**

- `computed`是一个计算属性，它是基于其依赖的数据进行计算，并返回计算结果。
- 计算属性会根据依赖的数据进行缓存，只有当依赖发生变化时，才会重新计算。
- 在模板中，可以通过调用计算属性的方式来获取其计算结果。
- 例如，在Vue组件中定义一个`fullName`计算属性，它由`firstName`和`lastName`两个属性计算而来：


```javascript
data() {
  return {
    firstName: 'John',
    lastName: 'Doe'
  };
},
computed: {
  fullName() {
    return this.firstName + ' ' + this.lastName;
  }
}
```

- 在模板中可以直接使用`{{ fullName }}`来获取`fullName`的计算结果。

## 【2】**watch中：**

- `watch`是一个侦听器，它会在指定的属性发生变化时执行相应的操作。
- 通过`watch`可以监听一个或多个属性，并在属性发生变化时执行回调函数。
- 例如，在Vue组件中定义一个`message`属性和相应的`watch`侦听器：


```javascript
data() {
  return {
    message: ''
  };
},
watch: {
  message(newValue, oldValue) {
    console.log('message changed:', newValue);
  }
}
```

- 当`message`属性的值发生变化时，`watch`中定义的回调函数会被执行。
- 其中，`newValue`表示新的属性值，`oldValue`表示旧的属性值。
- 可以在`watch`中执行一些异步操作、API请求或其他需要监听属性变化的逻辑。

## 【3】总结：

- `computed`中的计算属性是基于其依赖的数据进行计算，并返回计算结果。
- `watch`中的侦听器用于监听指定属性的变化，并执行相应的操作。

> - 使用`computed`可以通过简单的表达式或函数来计算属性的值
> - 而`watch`适用于需要对属性变化做出响应的情况
>   - 比如异步操作或某些需要监听特定属性变化的逻辑。

# 【十八】Vue2中的8个生命周期 

## 【8个生命周期】

- 在Vue.js 2中，有8个生命周期钩子函数，它们按照调用顺序可以分为三个阶段：
  - 创建阶段、更新阶段和销毁阶段。

### （1）**beforeCreate**：

- 在实例初始化之后，数据观测(data observer) 和 event/watcher 事件配置之前被调用。
- 在这个阶段，实例的属性、方法和观测(data observer)都还没有初始化。

### （2）**created**：

- 在实例创建完成后被调用。
- 此时，已经完成了数据观测(data observer)，属性和方法的运算，初始化事件，使用`mounted`可以访问到DOM元素，但尚未挂载到DOM上。

### （3）**beforeMount**：

- 在挂载开始之前被调用。
- 相关的render函数首次被调用，且返回的render函数还没渲染到真实的DOM中。

### （4）**mounted**：

- 在实例挂载到DOM元素后调用，此时可以操作DOM元素。
- 该阶段表示Vue实例已经被挂载到了HTML文档中，并且可以通过this.$el访问到挂载元素。

### （5）**beforeUpdate**：

- 在数据更新之前被调用，发生在虚拟DOM重新渲染和打补丁之前。
- 可以在此阶段进行状态的保存或者修改。

### （6）**updated**：

- 在数据更新之后被调用，发生在虚拟DOM重新渲染和打补丁之后。
- 该阶段可以访问更新后的DOM元素。
- 需要注意的是，避免在此钩子函数中修改数据，以免导致无限循环的更新。

### （7）**beforeDestroy**：

- 在实例销毁之前被调用。
- 此时实例仍然可以访问，并且所有绑定的指令和事件监听器都将被移除。

### （8）**destroyed**：

- 在实例销毁之后调用。
- 此时所有的指令和事件监听器都已被解除绑定，所有的子实例也都已被销毁。

## 【案例】

### **案例一：**

- 假设我们有一个简单的计时器组件，当组件加载到页面上时开始计时，当组件被销毁时停止计时。
- 我们可以使用生命周期钩子函数来实现这个功能:

```javascript
Vue.component('timer', {
  template: '<div>{{ time }}</div>',
  data() {
    return {
      time: 0,
      timerInterval: null
    };
  },
  mounted() {
    this.timerInterval = setInterval(() => {
      this.time++;
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.timerInterval);
  }
});
```

- 在上述代码中，我们在`mounted`钩子函数中创建了一个定时器，每秒钟自增时间，并将其绑定到`time`变量。
- 在组件即将销毁之前，我们清除了定时器。

### **案例二：**

- 在某些情况下，我们可能需要在组件加载后立即执行某些操作，例如获取异步数据。
- 我们可以使用`created`钩子函数来实现这一点：

```javascript
Vue.component('user-profile', {
  template: '<div>{{ name }} - {{ email }}</div>',
  data() {
    return {
      name: '',
      email: ''
    };
  },
  created() {
    this.fetchUserData();
  },
  methods: {
    fetchUserData() {
      // 模拟异步请求
      setTimeout(() => {
        this.name = 'John Doe';
        this.email = 'johndoe@example.com';
      }, 1000);
    }
  }
});
```

- 在上述例子中，我们在`created`钩子函数中调用了`fetchUserData`方法，该方法模拟一个异步请求获取用户数据，并将数据绑定到对应的变量上。




# 【十九】定时任务相关

> 定时任务：setInterval(匿名函数,3000)
>
> 延迟任务:setTimeout(匿名函数，2000)
>
> clearInterval()
>
> clearTimeout()

## 【1】设置任务

- 当涉及到定时任务和延迟任务时，可以使用`setInterval`和`setTimeout`函数来调度代码执行。
  - 这两个函数的第一个参数是一个匿名函数或函数表达式，用于指定要执行的任务。
  - 第二个参数是时间间隔（以毫秒为单位），用于指定任务的执行频率或延迟时间。

- `setInterval(匿名函数, 3000)`：
  - `setInterval`函数会重复执行指定的匿名函数，直到被取消。

  - 在上述示例中，匿名函数将每隔3秒执行一次。

- `setTimeout(匿名函数, 2000)`：
  - `setTimeout`函数会延迟指定的时间后执行一次匿名函数。
  - 在上述示例中，匿名函数将在2秒后执行。


## 【2】取消任务的执行

- 在进行定时任务或延迟任务时，我们还可以使用`clearInterval`和`clearTimeout`函数来取消任务的执行。


- `clearInterval()`：`clearInterval`函数用于停止通过`setInterval`函数设置的定时任务。

- `clearTimeout()`：`clearTimeout`函数用于取消通过`setTimeout`函数设置的延迟任务。

## 【3】示例

- 例如，下面是一个简单的示例，每隔2秒钟输出一次 "Hello World!"，并在5秒后停止输出：

```javascript
let intervalId = setInterval(() => {
  console.log("Hello World!");
}, 2000);

setTimeout(() => {
  clearInterval(intervalId);
}, 5000);
```

- 在上述代码中，我们使用`setInterval`函数每隔2秒钟输出一次 "Hello World!"，并使用`setTimeout`函数在5秒后使用`clearInterval`函数停止输出。


# 【拓展】秒杀系统的简单思路

## 【1】设计思路：

- 商品库存管理：
  - 需要设计一个数据库表用于存储商品的库存信息，并提供相应的接口用于查询和修改库存数量。
- 秒杀活动管理：
  - 需要设计一个数据库表用于存储秒杀活动的信息，包括活动时间、商品ID等，并提供相应的接口用于查询活动信息。
- 用户秒杀操作：
  - 当用户发起秒杀请求时，系统需要检查商品库存是否充足，如果充足则减少库存数量，并生成订单记录。

## 【2】逻辑代码实现：

```javascript
// 假设使用Node.js和MongoDB进行开发

// 导入相关模块
const express = require('express');
const mongoose = require('mongoose');

// 连接MongoDB数据库
mongoose.connect('mongodb://localhost/seckill', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 定义商品库存模型
const Product = mongoose.model('Product', {
  name: String,
  stock: Number,
});

// 定义秒杀活动模型
const SeckillActivity = mongoose.model('SeckillActivity', {
  productId: String,
  startTime: Date,
  endTime: Date,
});

// 创建Express应用
const app = express();

// 获取商品库存接口
app.get('/product/:id/stock', async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await Product.findOne({ _id: productId });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ stock: product.stock });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 秒杀接口
app.post('/seckill', async (req, res) => {
  const productId = req.body.productId;
  const currentTime = new Date();
  try {
    // 检查秒杀活动是否存在且正在进行中
    const activity = await SeckillActivity.findOne({
      productId: productId,
      startTime: { $lte: currentTime },
      endTime: { $gte: currentTime },
    });
    if (!activity) {
      return res.status(404).json({ message: 'Seckill activity not found or expired' });
    }

    // 检查商品库存是否充足
    const product = await Product.findOne({ _id: productId });
    if (!product || product.stock <= 0) {
      return res.status(403).json({ message: 'Insufficient product stock' });
    }

    // 减少商品库存数量
    product.stock--;
    await product.save();

    // 创建订单记录
    const order = new Order({
      productId: productId,
      userId: req.currentUser.id, // 假设已实现用户身份验证功能
    });
    await order.save();

    res.json({ message: 'Seckill success' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 启动服务器
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
```

- 上述代码使用Express和Mongoose实现了一个简单的秒杀系统。其中，通过"/product/:id/stock"接口可以获取商品库存信息，通过"/seckill"接口可以发起秒杀操作。


# 【二十】组件

局部组件：项目中导入，注册模式，都是局部组件

全局组件

组件有自己的样式，html，js

组件中的data必须是函数，返回一个对象

## 【1】局部组件：

- 局部组件是指在一个Vue项目中，将组件导入并注册在特定的组件内部，该组件只在该作用域内有效。
- 通常情况下，局部组件通过import语句导入，在组件选项中使用components属性进行注册。
- 例如，如果有一个名为MyComponent的局部组件，在父组件内引入并注册：

```javascript
<template>
  <div>
    <my-component></my-component>
  </div>
</template>

<script>
import MyComponent from './MyComponent.vue';

export default {
  name: 'ParentComponent',
  components: {
    MyComponent,
  },
}
</script>
```

## 【2】全局组件：

- 全局组件是指在一个Vue项目中，将组件注册到全局 Vue 实例中，从而可以在任何组件中使用。
- 全局组件可以在 main.js 或者其他全局注册文件中进行注册。
- 例如，如果有一个名为MyComponent的全局组件，在 main.js 内进行注册：

```javascript
// main.js

import Vue from 'vue';
import MyComponent from './MyComponent.vue';

Vue.component('my-component', MyComponent);

new Vue({
  // ...
}).$mount('#app');
```

## 【3】组件的结构：

- 一个组件通常由三个文件组成：模板（即 HTML）、脚本（即 JS）和样式（即 CSS）。
- 这些文件通常打包在同一个.vue文件中。例如，一个名为MyComponent的组件可能的.vue文件内容如下：

```vue
<template>
  <div>
    <h1>{{ title }}</h1>
    <p>{{ message }}</p>
  </div>
</template>

<script>
export default {
  name: 'MyComponent',
  data() {
    return {
      title: 'Welcome',
      message: 'Hello, world!',
    }
  },
}
</script>

<style>
h1 {
  color: blue;
}

p {
  font-size: 14px;
}
</style>
```

## 【4】组件中的data属性必须是一个函数，返回一个对象：

- 在组件定义时，data属性必须是一个函数而不是一个对象字面量，这是为了确保每个组件实例都有自己的数据副本，防止多个组件实例之间的数据污染。
- 因此，正确的写法是将data属性定义为一个函数，并在函数内返回一个包含需要的数据的对象。例如：

```javascript
<script>
export default {
  name: 'MyComponent',
  data() {
    return {
      title: 'Welcome',
      message: 'Hello, world!',
    }
  },
}
</script>
```

## 【5】总结：

- Vue中的组件分为局部组件和全局组件。组件包含了模板、脚本和样式，并且在组件中的data属性必须是一个函数，返回一个对象。
- 通过合理使用组件可以提高代码的可复用性，使得项目结构更加清晰和易于维护。

# 【二十一】组件间通信

## 【1】父传子（通过自定义属性）：

- 这种方式是通过在父组件上使用自定义属性并将数据传递给子组件。
- 在父组件的模板中使用子组件时，可以通过给子组件元素添加属性来传递数据。
- 子组件可以通过props选项来声明接收这些属性，并在模板中直接使用它们。
- 例如，在父组件中将一个名为xxx的属性传递给子组件：

```html
<template>
  <div>
    <child-component :xxx="true"></child-component>
  </div>
</template>
```

- 在子组件中，需要使用props选项来声明接收xxx属性，并在模板中直接使用它：

```javascript
<script>
export default {
  name: 'ChildComponent',
  props: ['xxx'],
}
</script>

<template>
  <div>
    <p>{{ xxx }}</p>
  </div>
</template>
```

## 【2】子传父（通过自定义事件）：

- 这种方式是通过子组件触发父组件中自定义的事件来向父组件传递数据。
- 在子组件中，可以使用`this.$emit('事件名',参数)`方法触发一个自定义事件，并传递相应的参数。
- 在父组件的模板中监听子组件触发的事件，并执行相应的函数来处理接收到的数据。
- 例如，在子组件中触发一个名为`myevent`的自定义事件并传递参数：

```javascript
// ChildComponent.vue
<script>
export default {
  name: 'ChildComponent',
  methods: {
    handleClick() {
      this.$emit('myevent', 'Hello from child component');
    }
  },
}
</script>

<template>
  <button @click="handleClick">Click me</button>
</template>
```

- 在父组件中监听子组件触发的`myevent`事件，并执行相应的函数来处理数据：

```html
<template>
  <div>
    <child-component @myevent="handleEvent"></child-component>
  </div>
</template>

<script>
export default {
  name: 'ParentComponent',
  methods: {
    handleEvent(data) {
      console.log(data); // 输出: "Hello from child component"
    }
  },
}
</script>
```

- 这样，就实现了子组件向父组件传递数据的功能。

## 【3】总结：

- Vue中的组件间通信可以通过父组件向子组件传递数据和子组件向父组件传递事件来实现。
- 父传子可以通过给子组件添加自定义属性并在props选项中声明接收，子传父可以通过子组件触发自定义事件并在父组件中监听并处理。
- 这两种方式使得组件之间可以进行灵活的数据交互，提高了组件的复用性和可维护性。

# 【二十二】ref属性

- ref属性是Vue.js框架中的一个重要属性，它用于在组件或普通标签上获取对应的DOM元素或组件实例。
  - 通过ref属性，开发者可以直接访问和操作DOM元素或组件，而不需要在模板中使用选择器查找。
- 当ref属性放在普通标签上时，可以使用this.$refs.名字来获取对应的DOM对象。
  - 例如，如果在某个div标签上添加了ref属性并命名为"myDiv"，可以通过this.$refs.myDiv来访问这个DOM对象，从而进行一些DOM操作，如修改样式、添加事件监听器等。

- 当ref属性放在组件上时，可以通过this.$refs.名字来获取对应的组件对象。
  - 除了组件对象，还可以通过这个组件对象直接访问组件的数据和方法。
  - 这样就可以在父组件中直接调用子组件的数据和方法，实现组件间的交互。

- 总结：
  - ref属性可以放在普通标签或组件上。

  - 在普通标签上，this.$refs.名字用于获取对应的DOM对象。

  - 在组件上，this.$refs.名字用于获取对应的组件对象，并可以直接访问组件的数据和方法。


# 【二十三】动态组件

## 【1】动态切换

- 动态组件是Vue.js框架中提供的一种功能，它可以根据不同的条件或状态动态地切换显示不同的组件。
  - 通过使用动态组件，我们可以在同一个位置动态加载不同的组件，实现更加灵活和可复用的组件化开发。
- 在Vue.js中，可以使用`<component>`标签来创建一个占位符，然后使用`is`属性指定要渲染的组件。
  - 这个`is`属性的值可以是一个动态变量，通过改变这个变量的值，就可以动态地切换显示不同的组件。
- 例如
  - 我们可以在父组件中定义一个`currentComponent`变量，然后通过改变这个变量的值来动态切换显示不同的子组件，示例代码如下：

```html
<template>
  <div>
    <button @click="changeComponent('ComponentA')">显示组件A</button>
    <button @click="changeComponent('ComponentB')">显示组件B</button>
    <component :is="currentComponent"></component>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentComponent: 'ComponentA'
    };
  },
  methods: {
    changeComponent(component) {
      this.currentComponent = component;
    }
  }
}
</script>
```

- 在上述代码中，点击不同的按钮会通过`changeComponent`方法改变`currentComponent`的值，从而动态地切换显示不同的子组件。

## 【2】保留动态组件的状态

- 除了动态组件，Vue.js还提供了`<keep-alive>`组件，它用于保留动态组件的状态。
  - 当使用`<keep-alive>`包裹动态组件时，这些组件将保留在内存中而不是被销毁，这样在切换回已经加载过的组件时，可以保持之前的状态和数据。

- 示例代码如下：


```html
<template>
  <div>
    <button @click="changeComponent('ComponentA')">显示组件A</button>
    <button @click="changeComponent('ComponentB')">显示组件B</button>
    <button @click="resetComponent">重置组件</button>
    <keep-alive>
      <component :is="currentComponent"></component>
    </keep-alive>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentComponent: ''
    };
  },
  methods: {
    changeComponent(component) {
      this.currentComponent = component() {
      this.currentComponent = '';
    }
  }
}
</script>
```

- 上述代码中，点击"显示组件A"或"显示组件B"按钮会切换显示对应的子组件，并且使用`<keep-alive>`组件保持其状态。
  - 点击"重置组件"按钮会清除当前加载的子组件，下次再加载组件时会重新创建。

- 通过动态组件和`<keep-alive>`组件，我们可以实现更加灵活和可复用的UI组件化开发。

# 【二十四】插槽

## 【1】`<slot>` 标签

- `<slot>` 标签是Vue.js中用于动态替换组件中某块内容的特殊标记。
  - 它可以用在组件模板中，作为占位符来接收父组件传递的内容，并将该内容替换到指定位置。
- 使用 `<slot>` 标签时，可以在组件模板中定义一个或多个 `<slot></slot>` 标签，并可以给每个 `<slot>` 标签添加名称，以便在父组件中具体指定内容插入的位置。


## 【2】示例

- 例如，下面是一个示例代码，展示了如何使用具名插槽和默认插槽：

```html
<!-- 父组件模板 -->
<template>
  <div>
    <h2>父组件</h2>
    <!-- 默认插槽 -->
    <slot></slot>
    <!-- 具名插槽 -->
    <slot name="prefix"></slot>
    <!-- 具名插槽 -->
    <slot name="suffix"></slot>
  </div>
</template>

<!-- 子组件模板 -->
<template>
  <div>
    <h3>子组件</h3>
    <!-- 使用默认插槽 -->
    <slot>默认内容</slot>
    <!-- 使用具名插槽 -->
    <slot name="prefix"></slot>
    <slot name="suffix"></slot>
  </div>
</template>
```

- 在上述示例中，父组件定义了一个默认插槽（没有名称），以及两个具名插槽（分别为 "prefix" 和 "suffix"）。
  - 子组件中的 `<slot>` 标签用于接收父组件传递的内容，并将其插入到相应的位置。

## 【3】具名插槽

- 使用具名插槽时，需要在父组件中通过特殊的标签形式来传递具名插槽的内容。
- 比如，在父组件中可以使用下面的代码：

```html
<template>
  <div>
    <h1>父组件</h1>
    <!-- 默认插槽 -->
    <child-component>
      <dream>I am default content.</dream>
    </child-component>
    <!-- 具名插槽 -->
    <child-component>
      <template v-slot:prefix>
        <i class="el-input__icon el-icon-search"></i>
      </template>
      <template v-slot:suffix>
        <i class="el-input__icon el-icon-delete"></i>
      </template>
    </child-component>
  </div>
</template>
```

- 在上述代码中，通过`<dream>`标签包裹的内容替换了子组件中的默认插槽内容，而使用 `v-slot` 的指令则可以将具名插槽内容传递给子组件中对应名称的插槽。


# 【二十五】第三方ui组件库

- ElementUi：
  - (https://element.eleme.cn/#/zh-CN/component/installation)

- Element Plus
  - https://element-plus.org/

- Vant 3
  - https://vant-contrib.gitee.io/vant/next
- Ant Design Vue
  - https://2x.antdv.com/docs/vue/introduce-cn/
- iView
  - https://www.iviewui.com/docs/guide/introduce
- TDesign
  - https://t.design/docs/
- PrimeVue
  - https://www.primefaces.org/primevue/showcase-v3/
- Vue Material
  - https://vuematerial.io/
- Buefy
  - https://buefy.org/
- Naive UI
  - https://www.naiveui.com/
- Quasar
  - https://quasar.dev/

# 【二十六】vue-cli创建项目

- 为了使用Vue CLI创建项目，你首先需要确保你的电脑上安装了Node.js环境。
- Node.js是一个用于运行JavaScript的开发环境。

## 【1】安装Node.js环境：

- 你可以从Node.js官方网站（https://nodejs.org）下载适合你操作系统的最新版本。

- 安装完成后，可以使用`node -v`命令来验证安装是否成功。


## 【2】安装npm：

- npm是Node.js的包管理工具，通过npm可以安装和管理项目依赖的各种包。

- npm会随着Node.js的安装一同被安装。

- 你可以使用`npm -v`命令来验证安装是否成功。


## 【3】安装Vue CLI：

- Vue CLI是一个用于快速搭建Vue.js项目的命令行工具。
- 你可以使用以下命令来全局安装Vue CLI：

```bash
npm install -g @vue/cli
```

## 【4】创建项目：

- 打开命令行终端，通过以下命令在指定目录中创建一个新的Vue项目：

```bash
vue create 项目名
```

- 例如，如果你想创建一个名为"my-project"的项目，可以使用以下命令：


```bash
vue create my-project
```

## 【5】选择项目配置：

- 创建项目时，Vue CLI会询问你关于项目配置的一些问题。

- 你可以根据需要进行选择，或者直接按回车键选择默认配置。


## 【6】等待安装依赖：

- 创建项目后，Vue CLI会自动下载和安装项目所需的依赖包。

- 这个过程可能需要一些时间，取决于你的网络速度和项目的规模。


## 【7】项目目录结构：

- 创建完成后，你会在指定的项目目录下看到如下的目录结构：

```
- node_modules  // 存放项目依赖的第三方包
- public        // 存放静态资源文件
  - index.html  // 项目的入口HTML文件
- src           // 存放项目源代码
  - assets      // 存放项目的静态资源文件（如图片、样式等）
  - components  // 存放Vue组件
  - App.vue     // 项目的根Vue组件
  - main.js     // 项目的入口JavaScript文件
- .gitignore    // Git版本控制忽略文件列表
- babel.config.js   // Babel配置文件
- package.json  // 项目配置文件，记录项目的依赖和命令脚本等信息
- README.md     // 项目的说明文档
```

- 在`src`目录下，你可以编写组件并进一步配置你的项目
  - 比如更改路由设置、添加其他功能等。

# 【二十七】Vuex(状态管理器)

> - const actions = {}   # 一般是组件中触发它     
>   - this.$store.dispatch()
> - const mutations = {} # 一般是acitons触发它    
>   - xx.commit()
> - const state = {}  # 放变量

- Vuex是一个状态管理模式的实现，用于在Vue.js应用程序中集中管理应用程序的状态（数据）。
  - 它包含了一组应对复杂应用中共享状态的规则。
- 在Vuex中，有三个核心概念：
  - state（状态）、mutations（变更）和actions（动作）。

## 【1】state（状态）：

- `state`是存储应用程序中各种数据的地方，它代表着应用程序的状态。
- 可以将`state`看作是应用程序的数据库，所有组件都可以从`state`中获取数据。
- 你可以在`state`中声明和初始化需要共享的变量。例如：

```javascript
const state = {
  count: 0,
  currentUser: null
};
```

## 【2】mutations（变更）：

- `mutations`是用于修改`state`的唯一方式。
- 每个`mutation`都是一个函数，它接受`state`作为第一个参数，并且可以接受额外的参数用于修改`state`中的数据。
- 通过提交一个`mutation`来修改`state`，只有通过`mutation`来修改`state`才能确保状态的变更是可追踪和可预测的。
- 例如：

```javascript
const mutations = {
  increment(state) {
    state.count++;
  },
  setCurrentUser(state, user) {
    state.currentUser = user;
  }
};
```

- 当需要修改`state`时，在组件中可以通过`this.$store.commit()`方法触发`mutation`。例如：


```javascript
this.$store.commit('increment');
this.$store.commit('setCurrentUser', user);
```

## 【3】actions（动作）：

- `actions`用于处理异步操作或者批量的`mutations`触发。
- 它们可以包含任意异步操作，并且可以通过使用`context.commit()`方法来触发`mutation`。
- 在组件中，可以通过`this.$store.dispatch()`方法来触发`action`。
- 例如：

```javascript
const actions = {
  fetchCurrentUser(context) {
    // 异步操作获取用户数据
    api.fetchUser().then(user => {
      context.commit('setCurrentUser', user);
    });
  }
};
```

- 从组件中触发`actions`：


```javascript
this.$store.dispatch('fetchCurrentUser');
```

- 在组件之间进行通信时，可以通过触发`actions`来改变`state`的值，并且所有的组件都能获取到最新的`state`数据。


> - 需要注意的是，为了更好地管理和维护状态数据，建议将`state`、`mutations`和`actions`拆分成模块化的方式进行管理。
> - 这样可以提高代码的可读性和可维护性。

# 【二十八】混入

- 混入（Mixin）是一种在Vue.js中抽取和重用组件逻辑的方式，用于解决组件之间的代码重复问题。
  - 它允许我们将一些公共的逻辑、选项或者钩子函数封装成一个可重用的Mixin对象，然后在多个组件中引入并使用这个Mixin。

## 【1】选项合并

- 在Vue.js 2.x版本中，混入可以用来合并组件选项（Options）中的同名属性，如果组件和Mixin中有相同的选项，则会发生选项合并。
- 例如，存在一个`mixin`对象：

```javascript
const mixin = {
  created() {
    console.log('Mixin created hook');
  },
  methods: {
    sharedMethod() {
      console.log('Shared method from mixin');
    }
  }
};
```

- 在组件中使用混入：


```javascript
Vue.component('my-component', {
  mixins: [mixin],
  created() {
    console.log('Component created hook');
  },
  methods: {
    componentMethod() {
      console.log('Component-specific method');
      this.sharedMethod(); // 可以调用混入中的方法
    }
  }
});
```

- 在上述例子中，组件会继承并合并混入对象中的`created`方法和`sharedMethod`方法。

## 【2】局部混入/全局混入

- 但在Vue.js 3.x版本中，由于使用了`Composition API`，混入不再推荐使用。
- 取而代之的是使用函数式组件和自定义Hook来实现类似的功能。

### （1）局部混入（Local Mixin）：

- 在Vue.js 2.x版本中，我们可以针对单个组件进行混入。
- 在组件中使用`mixins`选项来引入一个或多个混入对象，并将它们合并到组件的选项中。例如：

```javascript
const myMixin = {
  created() {
    console.log('Mixin created hook');
  },
  methods: {
    sharedMethod() {
      console.log('Shared method from mixin');
    }
  }
};

export default {
  mixins: [myMixin],
  created() {
    console.log('Component created hook');
  }
};
```

### （2）全局混入（Global Mixin）：

- 在Vue.js 2.x版本中，我们还可以将混入对象全局注册，以便在应用程序的所有组件中都可以使用混入的逻辑。
- 例如：

```javascript
Vue.mixin({
  created() {
    console.log('Global mixin created hook');
  },
  methods: {
    globalMethod() {
      console.log('Global method from mixin');
    }
  }
});
```

> - 需要注意的是，全局混入可能会导致命名冲突和意外行为，所以在使用全局混入时要谨慎。
>

## 【3】总结

- 混入是一种用于抽取和重用组件逻辑的方式，在Vue.js 2.x版本中可用于局部混入和全局混入。
- 而在Vue.js 3.x版本中，推荐使用自定义Hook和函数式组件来实现类似的功能。

# 【二十九】插件

- 在Vue.js中，插件是一种扩展和增强Vue应用功能的方式。
  - 它们通常由第三方开发者创建，并以可插拔的形式集成到Vue应用中。插件可以提供全局功能、指令、过滤器、组件等。

## 【1】Vuex：

- Vuex是Vue应用中使用的状态管理库，用于管理应用的共享状态。
- 通过`Vue.use(vuex)`方法将Vuex引入Vue应用后
- 我们可以在组件中通过`this.$store`来访问Vuex的store对象
- 从而进行状态的读取和修改。

## 【2】Vue Router：

- Vue Router是Vue应用的官方路由管理器，用于实现单页面应用（SPA）的前端路由。
- 在使用Vue Router后
  - 我们可以通过`this.$router`访问路由实例
  - 通过`this.$route`来访问当前路由的信息。
  - `router-view`用于显示匹配到的组件
  - `router-link`用于生成链接。

## 【3】Element UI：

- Element UI是一个基于Vue.js的UI组件库，提供了丰富的预先设计好的UI组件。
  - 在使用Element UI时，我们可以直接引入所需的组件并在Vue应用中使用。

## 【4】自定义插件

- 除了使用第三方插插件，给Vue应用添加自定义逻辑导出一个对象，并且该对象中必须包含一个名为`install`的方法。
- 在这个方法中，你可以实现你想要的逻辑和功能。
- 例如：

```js
export default {
  install(Vue) {
    // 实现逻辑
  }
}
```

- 在应用的`main.js`文件中使用`Vue.use()`方法来安装插件
- 例如：

```js
import MyPlugin from './plugins/my-plugin';

Vue.use(MyPlugin);
```

## 【5】小结

- 插件是一种扩展和增强Vue应用功能的方式
  - 在Vue中可以使用第三方插件如Vuex、Vue Router和Element UI
  - 也可以自定义插件来添加自定义逻辑和功能。

# 【三十】导入导出语法

- 在JavaScript中，有两种常见的导入和导出语法可用于模块化开发：
  - 匿名导出导入和命名导出导入。

## 【1】匿名导出导入：

- 在导出时，使用`export default`关键字，后面跟着一个对象、函数或表达式。
  - 这种方式可以在导入时给予它一个任意的名称。
- 例如，在一个名为`index.js`的文件中导出一个默认对象：


```javascript
export default {
  // 对象的内容
}
```

- 在另一个地方导入这个默认对象：


```javascript
import xx from '路径'
// 使用xx来引用默认导出的对象
```

- 在导入时，我们可以自定义变量名（在这种情况下是`xx`），用来引用导出的默认对象。


## 【2】命名导出导入：

- 在导出时，使用`export`关键字，后面跟着`const`、`let`或`var`关键字，并且在导出的内容前面添加一个变量名。
  - 这种方式可以选择性地导入模块中的指定内容。
- 例如，在一个名为`index.js`的文件中，我们可以按以下方式导出多个变量：


```javascript
export const name = 'dream';
export const age = 19;
export const ref = 'dream';
```

- 在另一个地方导入这些导出的变量：


```javascript
import { name, age, ref } from '路径'
// 可以直接使用name, age, ref这些变量
```

- 在导入时，我们使用大括号`{}`将要导入的变量名列出，并且需要与导出时的变量名保持一致。


## 【3】小结

- 匿名导出导入允许我们在导入时自定义变量名来引用默认导出的对象
- 命名导出导入允许我们选择性地导入模块中的指定内容。

# 【三十一】scoped样式

- 在前端开发中，Scoped样式是一种用于限定样式作用范围的技术。
  - 它可以确保只有特定组件或元素内部的样式规则生效，而不会对其他组件或元素产生任何影响。
- 在Vue.js中，我们可以使用`<style scoped>`来创建Scoped样式。
  - 当一个组件的样式被声明为Scoped样式时，这些样式只会应用于当前组件的模板中的元素，并且不会影响其他组件或全局的样式。
- 例如，假设我们有一个名为"Button"的组件，并且想要为它应用一些特定的样式：


```vue
<template>
  <button class="button">Click me</button>
</template>

<style scoped>
.button {
  background-color: blue;
  color: white;
  border: none;
  padding: 10px 20px;
}
</style>
```

- 在上面的示例中，我们在`<style>`标签中添加了`scoped`属性，以将样式限定在当前组件的作用域内。

- 这意味着只有当前组件模板中的`<button>`元素会受到这些样式的影响。
  - 换句话说，如果我们在页面中使用多个"Button"组件，它们之间的样式不会相互干扰。
- Scoped样式通过使用一些特殊的选择器来实现这种隔离性。
  - 当Vue编译组件时，它会自动生成一些独特的属性和选择器，以确保样式只应用在当前组件内部的元素上。
- Scoped样式是非常有用的，它提供了一种简单且可预测的方式来管理组件的样式，同时避免了全局样式的冲突问题。


# 【三十二】Router使用

## 【1】两个组件：`router-link`和`router-view`

- `router-link`：
  - 用于生成一个带有点击事件的链接，可以使用`to`属性来指定跳转的路径。
- `router-view`：
  - 用于显示当前路由匹配到的组件。

## 【2】最简单使用，配置路由，写组件：

- 路由的基本配置包括创建路由对象、定义路由规则和对应的组件，以及将路由对象挂载到Vue应用中。

## 【3】使用`router-link`或JavaScript控制路径跳转：

> router-link   to属性    字符串，对象

- `router-link`：
  - 通过使用`<router-link>`标签来创建一个导航链接。
- JS控制路径跳转：
  - 使用`this.$router.push(字符串，对象)`方法进行路由跳转。

## 【4】`router-link`的`to`属性可以是字符串或对象：

- 字符串：指定要跳转的路径。
- 对象：包含路由的各种参数，如名称、路径、参数和查询等。

## 【5】路由跳转的对象属性：

- `name`：通过路由名称进行跳转。
- `path`：指定要跳转的路径。
- `params`：通过路由参数进行跳转。
- `query`：通过查询参数进行跳转。

## 【6】组件中使用上一个组件传递过来的数据：

- `query`：通过`this.$route.query`来访问查询参数的值。
- `params`：通过`this.$route.params`来访问路由参数的值。

## 【7】相关API：

- `this.$router.push(path)`：相当于点击路由链接进行跳转，可以返回到当前路由界面。
- `this.$router.replace(path)`：用新路由替换当前路由，不可返回到当前路由界面。
- `this.$router.back()`：返回上一个记录的路由。
- `this.$router.go(-1)`：返回上一个记录的路由。
- `this.$router.go(1)`：转到下一个记录的路由。

## 【8】多级路由/多级路由:

### （1）多级路由：

- 多级路由是指在前端应用中通过配置嵌套的路由规则，实现多层级的页面导航和路由跳转。
  - 通常情况下，一个前端应用由多个页面组成，而每个页面又可以包含多个子页面或子组件。
  - 使用多级路由可以方便地管理这些层次关系，使得页面之间的跳转更加清晰和灵活。

- 例如，一个电商网站可能有以下多级路由结构：
  - `/`：首页

  - `/products`：产品列表页

  - `/products/:id`：单个产品详情页

  - `/cart`：购物车页面

  - `/checkout`：结算页面


- 在多级路由中，通过在路由配置中定义路径和组件的映射关系，可以实现页面间的无缝跳转和切换，从而提供良好的用户体验。

### （2）命名路由：

- 命名路由是给路由规则设置独一无二的名称，以便后续通过名称找到对应的路由。
  - 使用命名路由可以方便地进行路由跳转和参数传递，而不需要直接使用具体的URL路径。
- 在前端框架或库中，通常会提供API来定义和使用命名路由。
  - 通过为每个路由配置一个唯一的名称，可以在各种场景下使用这个名称来执行相应的路由操作。
- 例如，在Vue Router中，可以使用命名路由进行编程式导航：

```javascript
// 跳转到具有名称为 'products' 的路由
router.push({ name: 'products' });

// 跳转到具有名称为 'productDetails' 的路由，并传递参数 id
router.push({ name: 'productDetails', params: { id: 1 } });
```

- 使用命名路由可以提高代码的可读性和维护性，特别是在需要频繁进行路由跳转的场景下，使得代码更加简洁和易于理解。

## 【9】编程式路由导航：

- 通过`this.$router`实例对象进行路由的导航控制。

## 【10】路由两种模式：

### （1）`history`模式：

- 使用HTML5 History API来实现路由跳转，URL中没有`#`符号。
- 在`history`模式下，通过改变浏览器历史记录中的URL来实现路由跳转和页面切换。
- 可以使用`pushState`方法或者`replaceState`方法来改变URL，并且不会引起页面的刷新。
- 优点：URL更美观，没有`#`符号，更符合传统的URL形式；可以使用`back`和`forward`方法进行前进和后退操作。
- 缺点：需要服务器端的支持，因为在`history`模式下，直接访问URL时，如果服务器没有正确配置路由，会返回404错误。

### （2）`hash`模式：

- 在URL中使用`#`符号来实现路由切换，即URL中的哈希值（锚点）来表示不同的页面。
- 在`hash`模式下，通过监听`hashchange`事件来响应URL中哈希值的变化，从而实现路由的切换。
- 优点：对于不支持HTML5 History API的浏览器，也能良好地支持路由切换；不需要服务器端的特殊配置。
- 缺点：URL中带有`#`符号，不够美观；通过`location.hash`获取或设置哈希值时，需要注意一些兼容性问题。

### （3）小结

- 如果需要更美观的URL并且服务器端能够支持，可以选择`history`模式。
- 如果需要兼容旧版本浏览器或者对URL美观度要求较低，可以选择`hash`模式。

## 【11】路由守卫：

- 路由守卫（Route Guards）是用于在路由跳转前、跳转时、跳转后执行一些特定逻辑的机制。
  - 通过设置路由守卫，我们可以对路由进行拦截、控制和验证，以保证应用程序的安全性和正确性。
- 在大多数前端框架和库中，都提供了路由守卫的功能。
  - 常见的包括全局前置守卫、全局解析守卫、全局后置守卫，以及组件级别的守卫。


### （1）全局前置守卫（Global Before Guards）：

- 全局前置守卫会在路由导航开始之前被调用，允许我们在路由跳转前进行一些操作
  - 例如用户身份验证、权限判断等。
- 如果在前置守卫中返回 `false` 或者一个带有重定向路径信息的对象，路由导航将被中断。

### （2）全局解析守卫（Global Resolve Guards）：

- 全局解析守卫会在路由激活之前被调用，允许我们在路由跳转前获取所需的数据。
- 这个过程可以是异步的，在数据准备完毕之前，路由导航会等待。
- 一旦数据准备好，路由就会被激活。

### （3）全局后置守卫（Global After Guards）：

- 全局后置守卫会在路由导航结束之后被调用，可以用来处理一些日志记录或清理任务等。
- 由于无法获取到导航的结果，所以不能对跳转操作进行影响。

### （4）其他

- 除了全局守卫，某些框架还提供了组件级别的守卫
  - 如Vue Router中的路由独享的守卫（Route-Specific Guards）和组件内的守卫（Component Guards）。
  - 这些守卫允许我们在特定的路由或组件中执行相关的逻辑。
- 通过配置和使用这些不同类型的路由守卫，我们可以灵活地控制路由跳转过程中的各个环节，满足不同的业务需求和安全要求。




## 【12】Vue动态路由使用后 404 错误

- 当使用Vue框架的动态路由功能时，可能会遇到404页面不存在的问题
  - 主要原因是在刷新页面时，动态路由会被清除，导致尚未加载路由而显示404页面。

- 解决这个问题的方法是
  - 您可以将动态路由的配置存储在持久化的地方
    - 比如后端或浏览器本地存储中。
  - 这样，在刷新页面时，您可以先从持久化的地方恢复动态路由配置，然后重新注册路由。
  - 这样就能保证在刷新页面时动态路由不会丢失并正常加载路由。

- 具体实现方法如下：

  - 在项目中创建一个全局的路由配置文件（比如`asyncRoutes.js`），用于存储动态路由配置。

  - 在刷新页面时，在`created`或`mounted`等生命周期钩子函数中，从持久化的地方（比如后端接口或浏览器本地存储）获取动态路由配置，并将其保存到本地。

  - 使用Vue Router提供的方法（如`addRoutes`）将动态路由配置添加到已有的基础路由中。

  - 这样，当用户刷新页面时，动态路由会重新加载，并且404页面不会出现。


# 【三十三】localstorage/sessionstorage/cookie

在Vue中，我们可以使用以下三种方式来处理客户端的本地存储：localStorage、sessionStorage和cookie。

## 【1】localStorage: 

- localStorage是HTML5引入的Web Storage API之一，它提供了一种在客户端持久化存储数据的方式。
- localStorage保存的数据会一直存在，直到主动被删除。
- 在Vue中，可以使用以下代码将数据存储到localStorage中：

```javascript
// 存储数据到localStorage
localStorage.setItem('key', 'value');
```

- 要从localStorage中获取数据，可以使用以下代码：


```javascript
// 从localStorage获取数据
var value = localStorage.getItem('key');
```

## 【2】sessionStorage:

- sessionStorage与localStorage类似，也是Web Storage API的一部分。

- 不同之处在于sessionStorage中存储的数据在用户关闭浏览器窗口后会被自动删除。

- 因此，如果您需要在当前会话期间保留数据，但在用户离开网站后不再需要，可以使用sessionStorage。

- 在Vue中，使用sessionStorage的方式与localStorage相似：

 ```javascript
  // 存储数据到sessionStorage
  sessionStorage.setItem('key', 'value');
  
  // 从sessionStorage获取数据
  var value = sessionStorage.getItem('key');
 ```

## 【3】cookie:

- cookie是一种传统的用于在客户端存储小块数据的机制。
- 它在HTTP协议头中传递数据，并在浏览器中保存。
- 与localStorage和sessionStorage不同，cookie的主要目的是与服务器进行数据交互，因此在Vue中将它用于客户端本地存储可能较少见。
- 在Vue中，可以使用第三方库（如js-cookie）来处理cookie。
- 以下是一个使用js-cookie库设置和获取cookie的示例：

```bash
# 安装js-cookie库
npm install js-cookie

# 在代码中使用js-cookie
import Cookies from 'js-cookie';

// 设置cookie
Cookies.set('name', 'value');

// 获取cookie
var value = Cookies.get('name');
```

- 这些本地存储方式在Vue中可以根据需求进行选择。
- localStorage和sessionStorage适合保存较大的数据，并且在不同页面之间共享数据。
- 而cookie则更适合与服务器交互和实现用户认证。

































































































































