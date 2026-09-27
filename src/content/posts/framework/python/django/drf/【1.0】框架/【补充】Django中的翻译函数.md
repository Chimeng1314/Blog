---
title: "Django 中的翻译函数"
published: 2023-08-07 15:12:00
category: Web 开发
series: "DRF 基础"
seriesOrder: 21
hubs: ["drf-basics"]
---

# 【补充】Django中的翻译函数

```python
# 只要做了国际化，会自动翻译成，当前国家的语言
from django.utils.translation import gettext_lazy as _
# 使用方法 _是一个函数，函数调用，可以将参数翻译成其他语言
_('hello')
```

- `django.utils.translation`：

  - 这是Django框架提供的翻译模块，用于处理多语言支持和翻译。

- `gettext_lazy()` 函数：

  - 这是一个延迟加载版本的翻译函数，用于在运行时动态地翻译字符串。

  - 它接受一个字符串作为参数，并返回一个被翻译后的字符串对象。

- `_('hello')`：

  - 这是一个使用了 `gettext_lazy()` 函数的例子，将字符串 `'hello'` 进行翻译。
  - 通过在字符串前加上 `_`，Django会自动将其翻译成当前国家的语言。

  > - 注意：
  >   - 需要先在Django项目中做国际化配置，包括指定可用的语言、提供相应的翻译文件等。
  >   - 只有在正确配置了国际化后，翻译才能正常工作。

- 使用翻译函数 `gettext_lazy()` 和 `gettext()` 可以方便地支持多语言。
- 通过对需要翻译的字符串进行包装，Django将根据当前语言环境自动选择合适的翻译文本来替换原始字符串，从而实现页面内容的国际化。

