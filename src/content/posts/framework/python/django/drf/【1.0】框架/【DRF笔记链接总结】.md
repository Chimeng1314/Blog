---
title: "DRF 笔记链接总结"
published: 2024-11-01 14:00:00
category: Web 开发
series: "DRF 基础"
seriesOrder: 24
hubs: ["drf-basics"]
---

# 【DRF笔记链接总结】

# [【一】Web应用模式/API接口测试/Postman](https://www.cnblogs.com/dream-ze/p/17593131.html)

- 前后端开发模式：
  - 混合：
    - 前后端代码交织在一起，同一份代码中既包含前端逻辑又包含后端逻辑。
  - 分离：
    - 前后端代码分离开发，前端专注于用户界面设计和交互逻辑，后端则负责数据处理和业务逻辑。
- API接口
  - 地址：
    - API接口的URL地址，用于标识特定资源或执行特定操作。
    - 例如：http://example.com/api/users
  - 请求方法：
    - HTTP协议定义了多种请求方法，常见的有GET、POST、PUT、DELETE等。
  - 请求参数：
  - 返回值：
    - API接口响应的数据，通常以JSON格式返回。
- postman的使用
  - Postman是一款常用的API接口测试工具，可以用于发送HTTP请求、查看响应结果、调试接口等。

# [【二】Restful规范](https://www.cnblogs.com/dream-ze/p/17593135.html)

- restful规范
  - 使用HTTP协议定义请求方法：GET、POST、PUT、DELETE等。
  - 使用URL地址标识资源：每个资源都有一个唯一的URL地址。
  - 使用合适的HTTP状态码：响应请求时，使用正确的HTTP状态码表示请求的结果。
  - 使用合适的HTTP动词：HTTP动词用于表示对资源的操作类型。
  - 使用标准的数据格式：通常使用JSON格式传输数据。
- 在Django中写符合规范的接口

# [【三】序列化/反序列化-DRF介绍-CBV源码分析-APIView源码分析](https://www.cnblogs.com/dream-ze/p/17593136.html)

- 序列化与反序列化

  - 序列化：
    - 将对象的状态转换为可以存储或传输的形式的过程称为序列化。

  - 反序列化：
    - 将已序列化的数据恢复为对象的过程称为反序列化。

- CBV源码分析

  - 路由中的视图类.as_view()
  - Django的View的as_view()
  - 执行结果的 view 内存地址
  - 请求过来，路由匹配成功
  - view(request)
  - return self.dispatch()
  - View的dispatch

- APIView

  - APIView继承了View
  - 视图类的class BookView(APIView)
  - 路由中视图类.as_view()
  - drf的APIView的as_view()
  - 调用父类的as_view去除csrf
  - View的as_view内部的view闭包函数
  - return self.dispatch()
  - APIView的dispatch()

# [【四】Request类源码分析](https://www.cnblogs.com/dream-ze/p/17593137.html)

- `request.data`: 
  - `request.data`是一个属性，用于获取请求的数据。
- `request.query_params`
  - `request.query_params`也是一个属性，用于获取请求的查询参数。
- `request.FILES`
  - `request.FILES`是一个属性，用于获取请求中的文件数据。
- `request.method`
  - `request.method`是一个属性，用于获取HTTP请求的方法。
- `request.path`
  - `request.path`是一个属性，用于获取请求的路径部分。
- ...
- 重写了魔法方法
  - 除了上述属性之外，Request类还重写了魔法方法`__getattr__`。
    - 这个魔法方法在对象.属性访问时会自动触发，当访问的属性不存在时，会执行`__getattr__`方法中的逻辑。
  - 在Request类中，`__getattr__`方法通过反射技术实现了对`self._request`属性的访问。
    - `self._request`属性是一个低级的HttpRequest实例，它包含了更多原生的请求数据。
  - 通过重写了`__getattr__`方法，Request类可以在访问不存在的属性时，将请求委托给`self._request`对象，并从中获取对应的属性值。

# [【五】序列化组件相关](https://www.cnblogs.com/dream-ze/p/17593138.html)

- 序列化组件主要提供了两个功能
  - 反序列化
  - 序列化校验
- Serialzier
- 定义序列化类/使用序列化类
- 序列化字段
- 字段参数

# [【六】序列化高级用法-定制/保存/修改/校验/源码分析](https://www.cnblogs.com/dream-ze/p/17593140.html)

- 反序列化校验/保存/更新
- ModelSerializer的使用
- 序列化，定制返回格式

# [【七】请求与响应分析](https://www.cnblogs.com/dream-ze/p/17593144.html)

- Request类的请求
  - 接受前端传入的编码格式:json,urlencoded,form-data
    - 局部配置
    - 全局配置
  - Request的源码
- Response类的响应
  - 前端看到的形式(浏览器，json)
  - 源码分析
    - data
    - headers
    - status_code

# [【八】视图类/视图集相关](https://www.cnblogs.com/dream-ze/p/17593146.html)

- 2 个视图基类
  - `APIView`
  - `GenericAPIView`
- 5 个视图扩展类
  - `ListAPIView`
  - `CreateAPIView`
  - `DestroyAPIView`
  - `UpdateAPIView`
  - `RetrieveAPIView`
- 9 个视图子类
  - `CreateModelMixin`
  - `ListModelMixin`
  - `RetrieveModelMixin`
  - `DestroyModelMixin`
  - `UpdateModelMixin`
  - `ListCreateAPIView`
  - `RetrieveUpdateDestroyAPIView`
  - `RetrieveDestroyAPIView`
  - `RetrieveUpdateAPIView`
- 视图集
  - `ModelViewSet`
  - `ReadOnlyModelViewSet`
  - `ViewSetMixin`
  - `ViewSet`
  - `GenericViewSet`

# [【九】路由相关-注册/映射/转换器](https://www.cnblogs.com/dream-ze/p/17593148.html)



# [【十】登录/认证/权限/频率组件-源码分析](https://www.cnblogs.com/dream-ze/p/17593150.html)

- 认证：
  - 创建一个自定义的类来继承Django框架中的BaseAuthentication。
  - 重写authenticate方法来执行认证过程
  - 如果认证成功，你可以返回一个包含用户和认证信息的元组；
  - 如果认证失败，你可以选择抛出一个异常。
  - 可以在全局或局部配置文件中设置认证方式

- 权限：
  - 创建一个与BaseAuthentication相似的类，继承自它来进行权限控制。
  - 重写其中的方法来定义你的权限逻辑
  - 如果用户拥有足够的权限，】允许他们访问某些资源；反之，抛出一个异常或返回错误信息。
- 频率：
  - 创建一个自定义的类来继承SimpleRateThrottle。
  - 重写get_cache_key方法来确定在缓存中存储频率限制所用的键值。
    - 这个键值可以基于不同的因素，比如IP地址或用户ID。
    - 返回什么，就以什么做限制[ip,用户id]
  - 类属性：
    - 可以使用类属性scope来指定频率限制的范围。
    - scope
  - 对于频率限制，可以在全局或局部的配置文件中进行设置。

- 频率类：
  - 可以创建一个自定义的类，并继承Django框架中的BaseThrottle。
  - 在这个类中，你需要重写allow_request方法来确定是否允许请求。
  - 如果请求的频率在设定的限制范围内，你可以返回True；否则，返回False。

# [【十一】过滤/排序/分页](https://www.cnblogs.com/dream-ze/p/17594587.html)

- 排序
  - 我们可以使用内置的排序功能来对查询结果进行排序。
    - 为了实现排序功能，我们需要继承`GenericAPIView`类
    - 并在视图类中配置`filter_backends=[OrderingFilter]`属性。
- 过滤
  - 在Django中，我们可以使用内置的`SearchFilter`来进行模糊查询。
  - 此外，还可以使用第三方库`django-filter`实现更强大的过滤功能。
  - 如果需要自定义过滤逻辑，我们可以自己编写一个类，并继承`BaseFilterBackend`，然后重写`filter_queryset`方法来实现过滤操作
- 分页
  - PageNumberPagination
    - 这是一种基于页码的分页方式。
    - 它将结果集按照每页显示的数量进行分页，并提供了相关的类属性来控制分页效果，如`page_size`（每页显示的数量）、`max_page_size`（最多显示的数量）等。
    - 在视图类中继承`PageNumberPagination`，并在类属性中配置相关参数来控制分页效果。
  - LimitOffsetPagination
    - 这是一种基于偏移量的分页方式。
    - 它通过指定偏移量和限制数量来获取结果集的片段，并提供了类属性来控制分页效果，如`default_limit`（默认每页显示的数量）、`max_limit`（最多显示的数量）等。
    - 在视图类中继承`LimitOffsetPagination`，并在类属性中配置相关参数来控制分页效果。
  - CursorPagination
    - 这是一种基于游标的分页方式。
    - 它使用特定的游标值作为参考点来获取结果集，并提供了类属性来控制分页效果，如`cursor_query_param`（表示当前游标值的查询参数）等。
    - 在视图类中继承`CursorPagination`，并在类属性中配置相关参数来控制分页效果。

# [【十二】异常处理](https://www.cnblogs.com/dream-ze/p/17594595.html)

- 创建自定义的异常处理函数：
  - 首先，我们需要创建一个函数来处理异常，并定义它的输入参数为`exc`和`context`，其中`exc`代表捕获的异常对象，`context`表示异常发生的上下文信息。
  - 在函数内部，调用DRF中默认的异常处理函数`exception_handler`，将`exc`和`context`作为参数传递给它。
- 处理异常并返回响应：
  - 根据实际需求，在自定义的异常处理函数中对异常进行处理。
  - 如果成功处理了异常且无需返回特定的响应内容，则返回`None`。
  - 如果需要返回自定义的响应内容，可以通过创建一个`Response`对象，并设置相应的状态码、错误信息等。
- 配置全局异常处理函数：
  - 在DRF的配置文件中，配置全局异常处理函数，以便在出现异常时能够调用该函数进行处理。
  - 可以通过设置`EXCEPTION_HANDLER`参数，并指定为自定义的异常处理函数。

# [【十三】接口文档](https://www.cnblogs.com/dream-ze/p/17594597.html)

- 使用CoRAPI（Code-Reading Assistant for API）等自动生成工具，可以根据代码的注释和结构生成接口文档。

# [【十四】JWT认证](https://www.cnblogs.com/dream-ze/p/17594603.html)

- JWT（JSON Web Token）是一种用于身份认证和授权的开放标准。

  - 它由三部分组成，即Header、Payload和Signature，通常以Base64编码的形式传输。

- JWT是什么

  - JWT是一种基于JSON的安全令牌，用于在客户端和服务器之间传输信息。
  - JWT可以通过数字签名保证传输的信息不被篡改，并且可以使用密钥进行验证和解码。

- 三段式

  - Header：包含算法类型和令牌类型等信息。
  - Payload：包含自定义的用户信息或声明等。
  - Signature：根据Header和Payload以及密钥生成的签名，用于验证令牌的完整性。

- 开发重点：签发，认证

  - 签发：在用户认证成功后，将用户信息和其他需要的声明信息生成JWT并返回给客户端。
  - 认证：客户端将JWT发送给服务器，在服务器验证JWT的合法性并解析出其中的用户信息进行认证和授权。

- 使用djangorestframework-jwt实现快速签发和认证：

  - 基于auth的user表快速签发：
    - djangorestframework-jwt提供了`ObtainJSONWebToken`视图，可以基于Django的内置`User`模型直接进行用户认证并签发JWT。
  - 基于内置的认证类认证，配合权限：
    - djangorestframework-jwt还可以与Django的内置认证类和权限系统结合使用，进行JWT的验证和用户权限的控制。

# [【十五】权限控制](https://www.cnblogs.com/dream-ze/p/17596111.html)

# [【十六】大总结](https://www.cnblogs.com/dream-ze/p/17596113.html)
