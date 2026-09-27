---
title: "DRF Response 源码分析"
published: 2024-11-03 09:00:00
category: Web 开发
series: "DRF 源码分析"
seriesOrder: 3
hubs: ["drf-source-analysis"]
---

# 【一】响应类的对象Response源码

## 【1】路由

```python
from django.contrib import admin
from django.urls import path
from book import views

urlpatterns = [
    path('admin/', admin.site.urls),

    path('test/', views.TestView.as_view()),
]
```

## 【2】视图

```python
from rest_framework.views import APIView
from rest_framework.response import Response
```

```python
class TestView(APIView):
    def get(self, request, *args, **kwargs):

        return Response('ok')
```

## 【3】源码

```python
from rest_framework.response import Response
```

```python
class Response(SimpleTemplateResponse):
    """
    An HttpResponse that allows its data to be rendered into
    arbitrary media types.
    """

    def __init__(self, data=None, status=None,
                 template_name=None, headers=None,
                 exception=False, content_type=None):
        """
        Alters the init arguments slightly.
        For example, drop 'template_name', and instead use 'data'.

        Setting 'renderer' and 'media_type' will typically be deferred,
        For example being set automatically by the `APIView`.
        """
        super().__init__(None, status=status)

        if isinstance(data, Serializer):
            msg = (
                'You passed a Serializer instance as data, but '
                'probably meant to pass serialized `.data` or '
                '`.error`. representation.'
            )
            raise AssertionError(msg)

        self.data = data
        self.template_name = template_name
        self.exception = exception
        self.content_type = content_type

        if headers:
            for name, value in headers.items():
                self[name] = value

    @property
    def rendered_content(self):
        renderer = getattr(self, 'accepted_renderer', None)
        accepted_media_type = getattr(self, 'accepted_media_type', None)
        context = getattr(self, 'renderer_context', None)

        assert renderer, ".accepted_renderer not set on Response"
        assert accepted_media_type, ".accepted_media_type not set on Response"
        assert context is not None, ".renderer_context not set on Response"
        context['response'] = self

        media_type = renderer.media_type
        charset = renderer.charset
        content_type = self.content_type

        if content_type is None and charset is not None:
            content_type = "{}; charset={}".format(media_type, charset)
        elif content_type is None:
            content_type = media_type
        self['Content-Type'] = content_type

        ret = renderer.render(self.data, accepted_media_type, context)
        if isinstance(ret, str):
            assert charset, (
                'renderer returned unicode, and did not specify '
                'a charset value.'
            )
            return ret.encode(charset)

        if not ret:
            del self['Content-Type']

        return ret

    @property
    def status_text(self):
        """
        Returns reason text corresponding to our HTTP response status code.
        Provided for convenience.
        """
        return responses.get(self.status_code, '')

    def __getstate__(self):
        """
        Remove attributes from the response that shouldn't be cached.
        """
        state = super().__getstate__()
        for key in (
            'accepted_renderer', 'renderer_context', 'resolver_match',
            'client', 'request', 'json', 'wsgi_request'
        ):
            if key in state:
                del state[key]
        state['_closable_objects'] = []
        return state
```

# 【二】源码分析

## 【1】`__init__`

```python
def __init__(self, data=None, status=None,
             template_name=None, headers=None,
             exception=False, content_type=None):
    """
    # 稍微更改init参数。
    Alters the init arguments slightly.
    # 例如，删除“template_name”，改为使用“data”。
    For example, drop 'template_name', and instead use 'data'.
	
	# 设置“renderer”和“media_type”
    Setting 'renderer' and 'media_type' will typically be deferred,
    For example being set automatically by the `APIView`.
    """
    # 调用父类的 init 方法
    super().__init__(None, status=status)
	
    # 判断当前处理过的数据是否是 序列化过后的数据
    if isinstance(data, Serializer):
        
        # 这里的意思是 ，data 只能是序列化后的 serializer.data 或者是 serializer.errors
        msg = (
            'You passed a Serializer instance as data, but '
            'probably meant to pass serialized `.data` or '
            '`.error`. representation.'
        )
        raise AssertionError(msg)
	
    # 初始化 data 数据
    self.data = data
    # 初识化模板名字
    self.template_name = template_name
    # 初始化异常捕获对象
    self.exception = exception
    # 初始化当前数据类型
    self.content_type = content_type
	
    # 如果头部有数据
    if headers:
        # 遍历头部数据
        for name, value in headers.items():
            # 添加到响应数据中
            self[name] = value
```

## 【2】rendered_content

```python
# 包装成数据属性
@property
# 渲染响应内容
def rendered_content(self):
    # 获取响应对象中的属性值，获取模版渲染器
    renderer = getattr(self, 'accepted_renderer', None)
    # 获取响应对象中的属性值，获取媒体类型
    accepted_media_type = getattr(self, 'accepted_media_type', None)
    # 获取响应对象中的属性值，获取处理过后的数据
    context = getattr(self, 'renderer_context', None)
	
    # 使用断言语句，确保上述获取到的属性值都不为空。如果为空，抛出异常并给出相应的错误提示
    assert renderer, ".accepted_renderer not set on Response"
    assert accepted_media_type, ".accepted_media_type not set on Response"
    assert context is not None, ".renderer_context not set on Response"
    
    # 设置上下文字典中的键response的值为当前的响应对象
    context['response'] = self
	
    # 获取渲染器对象的媒体类型
    media_type = renderer.media_type
    # 获取渲染器对象的编码集
    charset = renderer.charset
    # 获取渲染器对象的数据类型
    content_type = self.content_type
	
    # 如果content_type为空且charset不为空
    if content_type is None and charset is not None:
        # 将media_type和charset拼接为新的content_type值
        content_type = "{}; charset={}".format(media_type, charset)
        
    # 如果content_type还是为空
    elif content_type is None:
        # 则将其值设置为media_type
        content_type = media_type
    
    # 将响应的数据格式添加到响应对象头中
    self['Content-Type'] = content_type
	
    # 使用渲染器渲染数据
    ret = renderer.render(self.data, accepted_media_type, context)
    
    # 判断渲染出来的数据是不是字符串格式
    if isinstance(ret, str):
        
        # 若不存在，则抛出异常并提示渲染器返回了Unicode字符串但未指定字符集
        assert charset, (
            'renderer returned unicode, and did not specify '
            'a charset value.'
        )
        # 如果存在，则将ret按指定的charset进行编码并返回
        return ret.encode(charset)
	
    # 如果ret是字符串类型，再次检查charset是否存在。
    
    # 如果ret为空，则删除响应对象的Content-Type头部属性
    if not ret:
        del self['Content-Type']
	
    # 返回渲染后的结果给调用方
    return ret
```

## 【3】status_text

```python
@property
# 状态码校验
def status_text(self):
    """
    #返回与我们的HTTP响应状态代码相对应的原因文本。
    Returns reason text corresponding to our HTTP response status code.
    Provided for convenience.
    """
    # 获取到响应对象中的状态码并返回
    return responses.get(self.status_code, '')


def __getstate__(self):
    """
    Remove attributes from the response that shouldn't be cached.
    """
    
    # 调用了父类的__getstate__方法来获取父类中定义的状态，并将其赋值给变量state
    state = super().__getstate__()
    
    # 遍历 键
    for key in (
            'accepted_renderer', 'renderer_context', 'resolver_match',
            'client', 'request', 'json', 'wsgi_request'
    ):
        # 判断当前键是否在状态码对象中
        # 如果存在则删除响应的响应头
        if key in state:
            del state[key]
    
    # 将一个空列表赋值给state['_closable_objects']。
    # 目的是确保对象在进行序列化时没有包含不必要的属性，从而避免潜在的问题。
    state['_closable_objects'] = []
    return state
```



# 【三】SimpleTemplateResponse(没什么价值)

```python
class SimpleTemplateResponse(HttpResponse):
    rendering_attrs = ['template_name', 'context_data', '_post_render_callbacks']

    def __init__(self, template, context=None, content_type=None, status=None,
                 charset=None, using=None, headers=None):
        # 很明显，将这两个成员称为“模板”
        # It would seem obvious to call these next two members 'template' and		
        # “context”，但这些名称是作为测试客户端的一部分保留的
        # 'context', but those names are reserved as part of the test Client
        # API为了避免名称冲突，我们使用不同的名称。
        # API. To avoid the name collision, we use different names.
        
        # 初始化模版名字
        self.template_name = template
        # 初始化上下文对象
        self.context_data = context
		
        # 判断是够被使用
        self.using = using
		
        # 是否有回调函数
        self._post_render_callbacks = []
		
        
        # request将当前请求对象存储在已知的子类中
        #关于请求，如TemplateResponse。它是在基类中定义的
        #以最大限度地减少代码重复。
        #这叫做自我_请求，因为self.request被覆盖
        #django.test.client.client.与template_name和context_data不同，
        #_request不应被视为公共API的一部分。
        # _request stores the current request object in subclasses that know
        # about requests, like TemplateResponse. It's defined in the base class
        # to minimize code duplication.
        # It's called self._request because self.request gets overwritten by
        # django.test.client.Client. Unlike template_name and context_data,
        # _request should not be considered part of the public API.
        
        # 初始化 request 对象 ---- 上一步处理过的request对象(视图类中的request对象)
        self._request = None
	
    	#content参数在这里没有意义，因为它将被替换
        #使用渲染的模板，所以我们总是传递空字符串，以便
        #防止错误并提供更短的签名。
        # content argument doesn't make sense here because it will be replaced
        # with rendered template so we always pass empty string in order to
        # prevent errors and provide shorter signature.
        # 调用父类初识化方法初始化
        super().__init__('', content_type, status, charset=charset, headers=headers)
		
        #_is_render跟踪模板和上下文是否已烘焙
        #转化为最终响应。
        #超级__init__不知道什么比将self.content设置为更好的了
        #我们刚刚给它的空字符串，它错误地设置了_is_render
        #True，所以我们在调用super__init__之后将其初始化为False。
        # _is_rendered tracks whether the template and context has been baked
        # into a final response.
        # Super __init__ doesn't know any better than to set self.content to
        # the empty string we just gave it, which wrongly sets _is_rendered
        # True, so we initialize it to False after the call to super __init__.
        self._is_rendered = False

    def __getstate__(self):
        """
        Raise an exception if trying to pickle an unrendered response. Pickle
        only rendered data, not the data used to construct the response.
        """
        obj_dict = self.__dict__.copy()
        if not self._is_rendered:
            raise ContentNotRenderedError('The response content must be '
                                          'rendered before it can be pickled.')
        for attr in self.rendering_attrs:
            if attr in obj_dict:
                del obj_dict[attr]

        return obj_dict

    def resolve_template(self, template):
        """Accept a template object, path-to-template, or list of paths."""
        if isinstance(template, (list, tuple)):
            return select_template(template, using=self.using)
        elif isinstance(template, str):
            return get_template(template, using=self.using)
        else:
            return template

    def resolve_context(self, context):
        return context

    @property
    def rendered_content(self):
        """Return the freshly rendered content for the template and context
        described by the TemplateResponse.

        This *does not* set the final content of the response. To set the
        response content, you must either call render(), or set the
        content explicitly using the value of this property.
        """
        template = self.resolve_template(self.template_name)
        context = self.resolve_context(self.context_data)
        return template.render(context, self._request)

    def add_post_render_callback(self, callback):
        """Add a new post-rendering callback.

        If the response has already been rendered,
        invoke the callback immediately.
        """
        if self._is_rendered:
            callback(self)
        else:
            self._post_render_callbacks.append(callback)

    def render(self):
        """Render (thereby finalizing) the content of the response.

        If the content has already been rendered, this is a no-op.

        Return the baked response instance.
        """
        retval = self
        if not self._is_rendered:
            self.content = self.rendered_content
            for post_callback in self._post_render_callbacks:
                newretval = post_callback(retval)
                if newretval is not None:
                    retval = newretval
        return retval

    @property
    def is_rendered(self):
        return self._is_rendered

    def __iter__(self):
        if not self._is_rendered:
            raise ContentNotRenderedError(
                'The response content must be rendered before it can be iterated over.'
            )
        return super().__iter__()

    @property
    def content(self):
        if not self._is_rendered:
            raise ContentNotRenderedError(
                'The response content must be rendered before it can be accessed.'
            )
        return super().content

    @content.setter
    def content(self, value):
        """Set the content for the response."""
        HttpResponse.content.fset(self, value)
        self._is_rendered = True


class TemplateResponse(SimpleTemplateResponse):
    rendering_attrs = SimpleTemplateResponse.rendering_attrs + ['_request']

    def __init__(self, request, template, context=None, content_type=None,
                 status=None, charset=None, using=None, headers=None):
        super().__init__(template, context, content_type, status, charset, using, headers=headers)
        self._request = request
```

# 【四】响应类的对象Respons参数详解

## 【1】data

- 响应体的内容，可以字符串，字典，列表


## 【2】status

- http响应状态码  

  - drf把所有响应码都定义成了一个常量

  ```python
  from rest_framework.status import HTTP_200_OK
  
  HTTP_100_CONTINUE = 100
  HTTP_101_SWITCHING_PROTOCOLS = 101
  HTTP_102_PROCESSING = 102
  HTTP_103_EARLY_HINTS = 103
  HTTP_200_OK = 200
  HTTP_201_CREATED = 201
  HTTP_202_ACCEPTED = 202
  HTTP_203_NON_AUTHORITATIVE_INFORMATION = 203
  HTTP_204_NO_CONTENT = 204
  HTTP_205_RESET_CONTENT = 205
  HTTP_206_PARTIAL_CONTENT = 206
  HTTP_207_MULTI_STATUS = 207
  HTTP_208_ALREADY_REPORTED = 208
  HTTP_226_IM_USED = 226
  HTTP_300_MULTIPLE_CHOICES = 300
  HTTP_301_MOVED_PERMANENTLY = 301
  HTTP_302_FOUND = 302
  HTTP_303_SEE_OTHER = 303
  HTTP_304_NOT_MODIFIED = 304
  HTTP_305_USE_PROXY = 305
  HTTP_306_RESERVED = 306
  HTTP_307_TEMPORARY_REDIRECT = 307
  HTTP_308_PERMANENT_REDIRECT = 308
  HTTP_400_BAD_REQUEST = 400
  HTTP_401_UNAUTHORIZED = 401
  HTTP_402_PAYMENT_REQUIRED = 402
  HTTP_403_FORBIDDEN = 403
  HTTP_404_NOT_FOUND = 404
  HTTP_405_METHOD_NOT_ALLOWED = 405
  HTTP_406_NOT_ACCEPTABLE = 406
  HTTP_407_PROXY_AUTHENTICATION_REQUIRED = 407
  HTTP_408_REQUEST_TIMEOUT = 408
  HTTP_409_CONFLICT = 409
  HTTP_410_GONE = 410
  HTTP_411_LENGTH_REQUIRED = 411
  HTTP_412_PRECONDITION_FAILED = 412
  HTTP_413_REQUEST_ENTITY_TOO_LARGE = 413
  HTTP_414_REQUEST_URI_TOO_LONG = 414
  HTTP_415_UNSUPPORTED_MEDIA_TYPE = 415
  HTTP_416_REQUESTED_RANGE_NOT_SATISFIABLE = 416
  HTTP_417_EXPECTATION_FAILED = 417
  HTTP_418_IM_A_TEAPOT = 418
  HTTP_421_MISDIRECTED_REQUEST = 421
  HTTP_422_UNPROCESSABLE_ENTITY = 422
  HTTP_423_LOCKED = 423
  HTTP_424_FAILED_DEPENDENCY = 424
  HTTP_425_TOO_EARLY = 425
  HTTP_426_UPGRADE_REQUIRED = 426
  HTTP_428_PRECONDITION_REQUIRED = 428
  HTTP_429_TOO_MANY_REQUESTS = 429
  HTTP_431_REQUEST_HEADER_FIELDS_TOO_LARGE = 431
  HTTP_451_UNAVAILABLE_FOR_LEGAL_REASONS = 451
  HTTP_500_INTERNAL_SERVER_ERROR = 500
  HTTP_501_NOT_IMPLEMENTED = 501
  HTTP_502_BAD_GATEWAY = 502
  HTTP_503_SERVICE_UNAVAILABLE = 503
  HTTP_504_GATEWAY_TIMEOUT = 504
  HTTP_505_HTTP_VERSION_NOT_SUPPORTED = 505
  HTTP_506_VARIANT_ALSO_NEGOTIATES = 506
  HTTP_507_INSUFFICIENT_STORAGE = 507
  HTTP_508_LOOP_DETECTED = 508
  HTTP_509_BANDWIDTH_LIMIT_EXCEEDED = 509
  HTTP_510_NOT_EXTENDED = 510
  HTTP_511_NETWORK_AUTHENTICATION_REQUIRED = 511
  ```


## 【3】template_name

- 模板名字，用浏览器访问，看到好看的页面，用postman访问，返回正常数据
  - 自定制页面
  - 根本不用


## 【4】headers

- 响应头加数据（后面讲跨域问题再讲）
  - headers={'name':'lqz'}


## 【5】content_type

- 响应编码，一般不用

> **三个重要的参数：data，status，headers**

# 【五】请求响应的格式

> - 默认是两种：
>   - 纯json
>   - 浏览器看到的样子

##  【1】限制方式一：

- 在视图类上写
  - 只是局部视图类有效

```python
# 总共有两个个：JSONRenderer,BrowsableAPIRenderer
from rest_framework.renderers import JSONRenderer,BrowsableAPIRenderer
class BookView(APIView):
    renderer_classes = [JSONRenderer]
```

## 【2】限制方式二：

- 在配置文件中写
  - 全局有效

```python
# drf的配置，统一写成它
REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
        # 'rest_framework.renderers.BrowsableAPIRenderer',
    ],
}
```

## 【3】全局配置了只支持json，局部想支持2个

- 只需要在局部，视图类中，写2个即可

```python
from rest_framework.renderers import JSONRenderer,BrowsableAPIRenderer
class BookView(APIView):
    renderer_classes = [JSONRenderer，BrowsableAPIRenderer]
```

