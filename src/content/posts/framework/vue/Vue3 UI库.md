---
title: "Vue 3 UI 库"
published: 2023-08-30 08:18:00
category: Web 开发
series: "Vue 3 实践"
seriesOrder: 4
hubs: ["vue3-practice"]
---

# Vue3 UI库

# 【一】Element Plus(ElementUI 的升级版):

- Element Plus 是前端开发者广泛使用的一个基于 Vue 3 的 UI 组件库。它是 ElementUI 的升级版，提供了丰富的组件和样式，以及强大的功能。其基本使用操作包括：

- 安装 Element Plus：
  ```
  npm install element-plus
  ```

- 引入组件：
  ```javascript
  import { ElButton, ElInput } from 'element-plus';
  ```

- 使用组件：
  ```html
  <el-button>Click me</el-button>
  <el-input v-model="inputValue"></el-input>
  ```

官方开发者文档：[https://element-plus.org/](https://element-plus.org/)

# 【二】Vant 3(有赞团队):

Vant 3 是有赞团队开源的移动端 Vue 3 组件库，它提供了丰富的高质量移动端 UI 组件，可以帮助开发者快速构建优秀的移动应用。其基本使用操作包括：

- 安装 Vant 3：
  ```
  npm install vant@next
  ```

- 引入组件：
  ```javascript
  import { Button, Cell } from 'vant';
  ```

- 使用组件：
  ```html
  <van-button type="primary">按钮</van-button>
  <van-cell title="标题" value="内容"></van-cell>
  ```

> 官方开发者文档：[https://vant-contrib.gitee.io/vant/next](https://vant-contrib.gitee.io/vant/next)
>

# 【三】Ant Design Vue(阿里前端):

Ant Design Vue 是阿里前端团队开发的企业级中后台 UI 组件库，它以优雅美观的设计和丰富的组件功能闻名。其基本使用操作包括：

- 安装 Ant Design Vue：
  ```
  npm install ant-design-vue@next
  ```

- 引入组件：
  ```javascript
  import { Button, Input } from 'ant-design-vue';
  ```

- 使用组件：
  ```html
  <a-button type="primary">Primary</a-button>
  <a-input v-model="inputValue"></a-input>
  ```

> 官方开发者文档：[https://2x.antdv.com/docs/vue/introduce-cn/](https://2x.antdv.com/docs/vue/introduce-cn/)
>

# 【四】iView:

- iView 是一款基于 Vue 3 的高质量 UI 组件库，它提供了丰富的组件和工具，具有易用性和可定制性。以下是关于 iView 的介绍：


- 安装 iView：
  ```
  npm install iview@next
  ```

- 引入组件：
  ```javascript
  import { Button, Input } from 'iview';
  ```

- 使用组件：
  ```html
  <i-button type="primary">Primary Button</i-button>
  <i-input v-model="inputValue"></i-input>
  ```

> 官方开发者文档：[https://www.iviewui.com/docs/guide/introduce](https://www.iviewui.com/docs/guide/introduce)

- iView 提供了大量常用组件，如按钮、输入框、表格、弹窗等，同时也支持按需引入，可以根据自己的需求灵活选择组件使用。
- 它还提供了丰富的主题选项和良好的国际化支持，使得开发者能够根据项目需求进行样式和语言的定制。
- iView 社区活跃，有经验丰富的开发者社区以及详细的官方文档。
- 如果在使用过程中遇到问题，可以通过官方文档、社区论坛等方式获得帮助和支持。

# 【五】TDesign(腾讯旗下):

TDesign 是腾讯旗下的优质 UI 组件库之一，它提供了高质量的组件和完善的配套工具，设计风格整洁，文档清晰。其基本使用操作与其他 UI 库类似。

- 安装 TDesign：
  ```
  npm install t-design
  ```

- 引入组件：
  ```javascript
  import { Button, Input } from 't-design';
  ```

- 使用组件：
  ```html
  <t-button type="primary">Primary Button</t-button>
  <t-input v-model="inputValue"></t-input>
  ```

> 官方开发者文档：[https://t.design/docs/](https://t.design/docs/)
>

# 【六】PrimeVue:

PrimeVue 是一个功能强大且全面支持 Vue 3 的 UI 组件库，它提供了大量的易于使用且高度可定制的组件。其基本使用操作与其他 UI 库类似。

- 安装 PrimeVue：
  ```
  npm install primevue@next
  ```

- 引入组件：
  ```javascript
  import { Button, InputText } from 'primevue';
  ```

- 使用组件：
  ```html
  <Button label="Click me"></Button>
  <InputText v-model="inputValue"></InputText>
  ```

> 官方开发者文档：[https://www.primefaces.org/primevue/showcase-v3/](https://www.primefaces.org/primevue/showcase-v3/)
>

# 【七】Vue Material:

Vue Material 是一个基于 Material Design 的 Vue 3 UI 组件库，它提供了丰富的组件和样式。其基本使用操作与其他 UI 库类似。

- 安装 Vue Material：
  ```
  npm install vue-material@next
  ```

- 引入组件：
  ```javascript
  import { MButton, MInput } from 'vue-material';
  ```

- 使用组件：
  ```html
  <m-button>Click me</m-button>
  <m-input v-model="inputValue"></m-input>
  ```

> 官方开发者文档：[https://vuematerial.io/](https://vuematerial.io/)
>

# 【八】Buefy:

Buefy 是一个基于 Bulma CSS 框架的 Vue 3 UI 组件库，它提供了直观易用的组件和样式。其基本使用操作与其他 UI 库类似。

- 安装 Buefy：
  ```
  npm install buefy
  ```

- 引入组件：
  ```javascript
  import { BButton, BInput } from 'buefy';
  ```

- 使用组件：
  ```html
  <b-button type="is-primary">Primary Button</b-button>
  <b-input v-model="inputValue"></b-input>
  ```

> 官方开发者文档：[https://buefy.org/](https://buefy.org/)
>

# 【九】Naive UI:

Naive UI 是一款风格简洁、扁平化的 Vue 3 UI 组件库，设计简洁大方。其基本使用操作与其他 UI 库类似。

- 安装 Naive UI：
  ```
  npm install naive-ui
  ```

- 引入组件：
  ```javascript
  import { NButton, NInput } from 'naive-ui';
  ```

- 使用组件：
  ```html
  <n-button type="primary">Primary Button</n-button>
  <n-input v-model="inputValue"></n-input>
  ```

> 官方开发者文档：[https://www.naiveui.com/](https://www.naiveui.com/)
>

# 【10】Quasar:

Quasar 是一个使用 Vue 3 构建响应式网站、混合移动应用等的高效开发框架，其附带的 UI 组件库提供了众多功能强大的组件。其基本使用操作与其他 UI 库类似。

- 安装 Quasar：
  ```
  npm install @quasar/quasar
  ```

- 引入组件：
  ```javascript
  import { QBtn, QInput } from 'quasar';
  ```

- 使用组件：
  ```html
  <q-btn color="primary">Primary Button</q-btn>
  <q-input v-model="inputValue"></q-input>
  ```

> 官方开发者文档：[https://quasar.dev/](https://quasar.dev/)
