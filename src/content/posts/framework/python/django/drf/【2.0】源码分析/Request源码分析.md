---
title: "DRF Request 源码分析"
published: 2024-11-02 14:00:00
category: Web 开发
series: "DRF 源码分析"
seriesOrder: 2
hubs: ["drf-source-analysis"]
---

# 【一】路由入口

```python
from django.contrib import admin
from django.urls import path
from book import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('test/', views.TestView.as_view()),
    path('test_http/', views.TestHttpResponse.as_view()),
]
```

# 【二】视图分析

## 【1】原生的request对象

```python
from django.shortcuts import render, HttpResponse
from django.views import View
```

```python
class TestHttpResponse(View):
    def get(self, request, *args, **kwargs):
        print(request)
        print(type(request))
        print(dir(request))

        return HttpResponse('ok')
```

```ini
<WSGIRequest: GET '/test_http/'>
```

> - 原生的request对象

```ini
<class 'django.core.handlers.wsgi.WSGIRequest'>
```

> - 原生的request对象属于 WSGIRequest 的对象

```ini
['COOKIES', 
'FILES', 
'GET', 
'META', 
'POST', 
'__class__', '__delattr__', '__dict__', '__dir__', '__doc__', '__eq__', '__format__', '__ge__', '__getattribute__', '__gt__', '__hash__', '__init__', '__init_subclass__', '__iter__', '__le__', '__lt__', '__module__', '__ne__', '__new__', '__reduce__', '__reduce_ex__', '__repr__', '__setattr__', '__sizeof__', '__str__', '__subclasshook__', '__weakref__', '_current_scheme_host', '_encoding', '_get_full_path', '_get_post', '_get_raw_host', '_get_scheme', '_initialize_handlers', '_load_post_and_files', '_mark_post_parse_error', '_messages', '_read_started', '_set_content_type_params', '_set_post', '_stream', 
'_upload_handlers', 
'accepted_types', 
'accepts', 
'body', 
'build_absolute_uri', 
'close', 
'content_params', 
'content_type', 
'csrf_processing_done', 
'encoding', 
'environ', 
'get_full_path', 
'get_full_path_info', 
'get_host', 
'get_port', 
'get_raw_uri', 
'get_signed_cookie', 
'headers', 
'is_ajax', 
'is_secure', 
'method', 
'parse_file_upload', 
'path', 
'path_info', 
'read', 
'readline', 
'readlines', 
'resolver_match', 
'scheme', 
'session', 
'upload_handlers', 
'user']
```

> - 原生的request对象中有上述类属性
> - 我们筛选，找重要的筛一下
>   - COOKIES
>   - FILES
>   - GET
>   - META
>   - POST

## 【2】DRF的request对象

```python
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
```

```python
class TestView(APIView):
    def get(self, request, *args, **kwargs):
        print(request)
        print(type(request))
        print(dir(request))

        return Response('ok')
```

- 我们先查看这个request对象都有什么

```ini
<rest_framework.request.Request: GET '/test/'>
```

> - 从上面的 request 对象中我们可以看到这是属于 rest_framework 中的 Request 的对象

```ini
<class 'rest_framework.request.Request'>
```

> - 它的类型也验证了上述他就是一个 rest_framework 的新的 Request 对象

```ini
['DATA', 
'FILES', 
'POST', 
'QUERY_PARAMS', 
'__class__', '__delattr__', '__dict__', '__dir__', '__doc__', '__eq__', '__format__', '__ge__', '__getattr__', '__getattribute__', '__gt__', '__hash__', '__init__', '__init_subclass__', '__le__', '__lt__', '__module__', '__ne__', '__new__', '__reduce__', '__reduce_ex__', '__repr__', '__setattr__', '__sizeof__', '__str__', '__subclasshook__', '__weakref__', '_auth', '_authenticate', '_authenticator', '_content_type', '_data', '_default_negotiator', '_files', '_full_data', '_load_data_and_files', '_load_stream', '_not_authenticated', '_parse', '_request', '_stream', '_supports_form_parsing', '_user', 
'accepted_media_type', 
'accepted_renderer', 
'auth', 
'authenticators', 
'content_type', 
'data', 
'force_plaintext_errors', 
'negotiator', 
'parser_context', 
'parsers', 
'query_params', 
'stream', 
'successful_authenticator', 
'user', 
'version', 
'versioning_scheme']
```

> - 我们通过查看他的类属性，可以发现和我们原生的 request 有很多不一样的方法
> - 同样的我们筛一下
>   - DATA
>   - FILES
>   - POST
>   - QUERY_PARAMS

## 【3】小结

- 通过上述两个视图函数中的request对象的属性比较，我们可以清楚地看到，新的request对象多了一些不一样的方法
- 比如原生的request中的GET方法不见了，新的request方法多了一个QUERY_PARAMS方法
- 那接下来我们就来分析一下他们之间到底有哪些联系

# 【三】新的 Request 源码

## 【1】入口

- 既然是 rest_framework 中新封装的方法，那么在他的源码中就一定有这个方法，我们通过下述入口进入到 Request 类中

```python
from rest_framework.request import Request
```

## 【2】源码

```python
class Request:
    """
    Wrapper allowing to enhance a standard `HttpRequest` instance.

    Kwargs:
        - request(HttpRequest). The original request instance.
        - parsers(list/tuple). The parsers to use for parsing the
          request content.
        - authenticators(list/tuple). The authenticators used to try
          authenticating the request's user.
    """

    def __init__(self, request, parsers=None, authenticators=None,
                 negotiator=None, parser_context=None):
        assert isinstance(request, HttpRequest), (
            'The `request` argument must be an instance of '
            '`django.http.HttpRequest`, not `{}.{}`.'
            .format(request.__class__.__module__, request.__class__.__name__)
        )

        self._request = request
        self.parsers = parsers or ()
        self.authenticators = authenticators or ()
        self.negotiator = negotiator or self._default_negotiator()
        self.parser_context = parser_context
        self._data = Empty
        self._files = Empty
        self._full_data = Empty
        self._content_type = Empty
        self._stream = Empty

        if self.parser_context is None:
            self.parser_context = {}
        self.parser_context['request'] = self
        self.parser_context['encoding'] = request.encoding or settings.DEFAULT_CHARSET

        force_user = getattr(request, '_force_auth_user', None)
        force_token = getattr(request, '_force_auth_token', None)
        if force_user is not None or force_token is not None:
            forced_auth = ForcedAuthentication(force_user, force_token)
            self.authenticators = (forced_auth,)

    def __repr__(self):
        return '<%s.%s: %s %r>' % (
            self.__class__.__module__,
            self.__class__.__name__,
            self.method,
            self.get_full_path())

    def _default_negotiator(self):
        return api_settings.DEFAULT_CONTENT_NEGOTIATION_CLASS()

    @property
    def content_type(self):
        meta = self._request.META
        return meta.get('CONTENT_TYPE', meta.get('HTTP_CONTENT_TYPE', ''))

    @property
    def stream(self):
        """
        Returns an object that may be used to stream the request content.
        """
        if not _hasattr(self, '_stream'):
            self._load_stream()
        return self._stream

    @property
    def query_params(self):
        """
        More semantically correct name for request.GET.
        """
        return self._request.GET

    @property
    def data(self):
        if not _hasattr(self, '_full_data'):
            self._load_data_and_files()
        return self._full_data

    @property
    def user(self):
        """
        Returns the user associated with the current request, as authenticated
        by the authentication classes provided to the request.
        """
        if not hasattr(self, '_user'):
            with wrap_attributeerrors():
                self._authenticate()
        return self._user

    @user.setter
    def user(self, value):
        """
        Sets the user on the current request. This is necessary to maintain
        compatibility with django.contrib.auth where the user property is
        set in the login and logout functions.

        Note that we also set the user on Django's underlying `HttpRequest`
        instance, ensuring that it is available to any middleware in the stack.
        """
        self._user = value
        self._request.user = value

    @property
    def auth(self):
        """
        Returns any non-user authentication information associated with the
        request, such as an authentication token.
        """
        if not hasattr(self, '_auth'):
            with wrap_attributeerrors():
                self._authenticate()
        return self._auth

    @auth.setter
    def auth(self, value):
        """
        Sets any non-user authentication information associated with the
        request, such as an authentication token.
        """
        self._auth = value
        self._request.auth = value

    @property
    def successful_authenticator(self):
        """
        Return the instance of the authentication instance class that was used
        to authenticate the request, or `None`.
        """
        if not hasattr(self, '_authenticator'):
            with wrap_attributeerrors():
                self._authenticate()
        return self._authenticator

    def _load_data_and_files(self):
        """
        Parses the request content into `self.data`.
        """
        if not _hasattr(self, '_data'):
            self._data, self._files = self._parse()
            if self._files:
                self._full_data = self._data.copy()
                self._full_data.update(self._files)
            else:
                self._full_data = self._data

            # if a form media type, copy data & files refs to the underlying
            # http request so that closable objects are handled appropriately.
            if is_form_media_type(self.content_type):
                self._request._post = self.POST
                self._request._files = self.FILES

    def _load_stream(self):
        """
        Return the content body of the request, as a stream.
        """
        meta = self._request.META
        try:
            content_length = int(
                meta.get('CONTENT_LENGTH', meta.get('HTTP_CONTENT_LENGTH', 0))
            )
        except (ValueError, TypeError):
            content_length = 0

        if content_length == 0:
            self._stream = None
        elif not self._request._read_started:
            self._stream = self._request
        else:
            self._stream = io.BytesIO(self.body)

    def _supports_form_parsing(self):
        """
        Return True if this requests supports parsing form data.
        """
        form_media = (
            'application/x-www-form-urlencoded',
            'multipart/form-data'
        )
        return any(parser.media_type in form_media for parser in self.parsers)

    def _parse(self):
        """
        Parse the request content, returning a two-tuple of (data, files)

        May raise an `UnsupportedMediaType`, or `ParseError` exception.
        """
        media_type = self.content_type
        try:
            stream = self.stream
        except RawPostDataException:
            if not hasattr(self._request, '_post'):
                raise
            # If request.POST has been accessed in middleware, and a method='POST'
            # request was made with 'multipart/form-data', then the request stream
            # will already have been exhausted.
            if self._supports_form_parsing():
                return (self._request.POST, self._request.FILES)
            stream = None

        if stream is None or media_type is None:
            if media_type and is_form_media_type(media_type):
                empty_data = QueryDict('', encoding=self._request._encoding)
            else:
                empty_data = {}
            empty_files = MultiValueDict()
            return (empty_data, empty_files)

        parser = self.negotiator.select_parser(self, self.parsers)

        if not parser:
            raise exceptions.UnsupportedMediaType(media_type)

        try:
            parsed = parser.parse(stream, media_type, self.parser_context)
        except Exception:
            # If we get an exception during parsing, fill in empty data and
            # re-raise.  Ensures we don't simply repeat the error when
            # attempting to render the browsable renderer response, or when
            # logging the request or similar.
            self._data = QueryDict('', encoding=self._request._encoding)
            self._files = MultiValueDict()
            self._full_data = self._data
            raise

        # Parser classes may return the raw data, or a
        # DataAndFiles object.  Unpack the result as required.
        try:
            return (parsed.data, parsed.files)
        except AttributeError:
            empty_files = MultiValueDict()
            return (parsed, empty_files)

    def _authenticate(self):
        """
        Attempt to authenticate the request using each authentication instance
        in turn.
        """
        for authenticator in self.authenticators:
            try:
                user_auth_tuple = authenticator.authenticate(self)
            except exceptions.APIException:
                self._not_authenticated()
                raise

            if user_auth_tuple is not None:
                self._authenticator = authenticator
                self.user, self.auth = user_auth_tuple
                return

        self._not_authenticated()

    def _not_authenticated(self):
        """
        Set authenticator, user & authtoken representing an unauthenticated request.

        Defaults are None, AnonymousUser & None.
        """
        self._authenticator = None

        if api_settings.UNAUTHENTICATED_USER:
            self.user = api_settings.UNAUTHENTICATED_USER()
        else:
            self.user = None

        if api_settings.UNAUTHENTICATED_TOKEN:
            self.auth = api_settings.UNAUTHENTICATED_TOKEN()
        else:
            self.auth = None

    def __getattr__(self, attr):
        """
        If an attribute does not exist on this instance, then we also attempt
        to proxy it to the underlying HttpRequest object.
        """
        try:
            return getattr(self._request, attr)
        except AttributeError:
            return self.__getattribute__(attr)

    @property
    def DATA(self):
        raise NotImplementedError(
            '`request.DATA` has been deprecated in favor of `request.data` '
            'since version 3.0, and has been fully removed as of version 3.2.'
        )

    @property
    def POST(self):
        # Ensure that request.POST uses our request parsing.
        if not _hasattr(self, '_data'):
            self._load_data_and_files()
        if is_form_media_type(self.content_type):
            return self._data
        return QueryDict('', encoding=self._request._encoding)

    @property
    def FILES(self):
        # Leave this one alone for backwards compat with Django's request.FILES
        # Different from the other two cases, which are not valid property
        # names on the WSGIRequest class.
        if not _hasattr(self, '_files'):
            self._load_data_and_files()
        return self._files

    @property
    def QUERY_PARAMS(self):
        raise NotImplementedError(
            '`request.QUERY_PARAMS` has been deprecated in favor of `request.query_params` '
            'since version 3.0, and has been fully removed as of version 3.2.'
        )

    def force_plaintext_errors(self, value):
        # Hack to allow our exception handler to force choice of
        # plaintext or html error responses.
        self._request.is_ajax = lambda: value
```

## 【3】逐段源码分析

### （1）init方法

```python
# 行声明了一个名为"Request"的类
class Request:
    """
    # 允许对标准的'HttpRequest'实例进行增强处理，意思就是可以调用原来的类的方法
    Wrapper allowing to enhance a standard `HttpRequest` instance.

    Kwargs:
    	# 请求(HttpRequest)原始的请求实例
    	该行给出了第一个参数的说明，即原始的请求实例(HttpRequest)
        - request(HttpRequest). The original request instance.
        
        # 解析器（列表/元组）。用于解析请求内容的解析器。
		  该行给出了第二个参数的说明，即用于解析请求内容的解析器。
        - parsers(list/tuple). The parsers to use for parsing the
          request content.
          
        # 用于验证请求用户身份的认证器
        - authenticators(list/tuple). The authenticators used to try
          authenticating the request's user.
    """
	# 类的初识化方法，在这里完成类的初始化
    # parsers ： 解析器
    # authenticators：认证用户
    # negotiator
    # parser_context：解析的内容
    def __init__(self, request, parsers=None, authenticators=None,
                 negotiator=None, parser_context=None):
        # 断言：判断当前的 request 对象是否属于 HttpRequest 类
        assert isinstance(request, HttpRequest), (
            
            # 这个 request 对象必须是 django.http.HttpRequest 的类实例且不能为空
            'The `request` argument must be an instance of '
            '`django.http.HttpRequest`, not `{}.{}`.'
            .format(request.__class__.__module__, request.__class__.__name__)
        )
		
        # _request ： 这个是新的request对象，对其做隐藏
        # request ：这个是原来的 request对象 对象
        # 最简单的例子就是下面的 创建 query_params 的时候，有一个 return self._request.GET
        # 从这里我们就可以看出 query_params = self._request.GET = request.GET
        self._request = request
        
        # parsers ：解析器，处理请求过来的数据
        self.parsers = parsers or ()
        
        # authenticators ：是否有认证
        self.authenticators = authenticators or ()
        
        # negotiator可以解析Accept头部字段，该字段指示客户端能够接受的响应格式（如JSON、XML等）
        self.negotiator = negotiator or self._default_negotiator()
        # 包含解析请求体相关信息的上下文对象，在DRF中用于帮助确定如何解析请求体，并确保请求体被正确地转换为视图方法可使用的数据结构。
        self.parser_context = parser_context
        
        # _data属性代表请求的数据内容，它被初始化为空
        self._data = Empty
        
        # _files属性代表请求的文件内容，也被初始化为空
        self._files = Empty
        
        # _full_data属性可能表示整个请求的数据，包括数据和文件内容，但在这里也被初始化为空
        self._full_data = Empty
        
        # 请求的内容类型（MIME类型），它同样被初始化为空
        self._content_type = Empty
        
        # 请求的流式数据，但同样被初始化为空
        self._stream = Empty
		
        # 检查了self.parser_context是否为None。如果是None，则将其赋值为空字典{}。
        if self.parser_context is None:
            self.parser_context = {}
            
        # 将self（即当前对象实例）添加到self.parser_context['request']中，以提供给解析器使用。
        self.parser_context['request'] = self
        
        # 获取请求的编码方式request.encoding，如果不存在则使用settings.DEFAULT_CHARSET作为默认编码方式，并将其赋值给self.parser_context['encoding']
        self.parser_context['encoding'] = request.encoding or settings.DEFAULT_CHARSET
		
        # 获取request对象的属性_force_auth_user和_force_auth_token的值，并分别保存在force_user和force_token变量中。
        force_user = getattr(request, '_force_auth_user', None)
        force_token = getattr(request, '_force_auth_token', None)
        
        # 检查force_user或force_token是否有值
        # 如果有，则创建ForcedAuthentication对象forced_auth，并将其作为元组的元素赋值给self.authenticators属性。
        if force_user is not None or force_token is not None:
            forced_auth = ForcedAuthentication(force_user, force_token)
            self.authenticators = (forced_auth,)
```

### （2）repr 和 _default_negotiator

```python
# __repr__方法用于返回类的字符串表示
# 在这段代码中，__repr__方法返回一个格式化字符串，包含类的模块名、类名、HTTP方法和完整路径。
# 这里返回的也就是我们上面的 print(request) 返回的内容  <rest_framework.request.Request: GET '/test/'>
def __repr__(self):
    return '<%s.%s: %s %r>' % (
        self.__class__.__module__,
        self.__class__.__name__,
        self.method,
        self.get_full_path())

# 用于返回默认的内容协商类实例
# 根据代码，它是通过调用api_settings.DEFAULT_CONTENT_NEGOTIATION_CLASS()来获得的
# 这个函数很可能是从应用程序的设置（api_settings）中获取默认的内容协商类，并返回其实例。
def _default_negotiator(self):
    return api_settings.DEFAULT_CONTENT_NEGOTIATION_CLASS()
```

### （3）content_type

```python
# @property装饰器将该方法转换为一个只读属性，可以像访问普通属性一样访问它，而无需通过调用方法
@property
def content_type(self):
	# 将原来的 request 对象的 元数据（META） 赋值给新的 meta 变量
    meta = self._request.META
    # content_type属性根据请求的元数据（META）获取内容类型
    # 它首先尝试从CONTENT_TYPE键获取内容类型，如果键不存在，则尝试从HTTP_CONTENT_TYPE键获取内容类型。
    # 如果这两个键都不存在，它会返回一个空字符串作为默认值。
    return meta.get('CONTENT_TYPE', meta.get('HTTP_CONTENT_TYPE', ''))
```

### （4）stream

```python
# @property装饰器将该方法转换为一个只读属性，可以像访问普通属性一样访问它，而无需通过调用方法
@property
def stream(self):
    """
    # 返回一个对象，可用于流式传输请求内容。
    Returns an object that may be used to stream the request content.
    """
    
    # 首先检查是否存在名为_stream的属性，利用_hasattr函数判断。
    # 如果不存在该属性，则调用_load_stream方法加载流对象，并将其存储在self._stream属性中。
    # 这意味着流对象只会在第一次访问stream属性时被加载，以提高性能和资源利用效率。
    if not _hasattr(self, '_stream'):
        self._load_stream()
    return self._stream
```

- `_load_stream`

```python
def _load_stream(self):
    """
    # 返回请求体的内容作为流式数据
    Return the content body of the request, as a stream.
    """
    
    # 封装原来的 request 对象中的元数据
    meta = self._request.META
    
    # 从元数据中获取请求内容的长度（CONTENT_LENGTH或HTTP_CONTENT_LENGTH）
    # 这个长度表示了请求体的大小。
    try:
        
        # 从元数据中获取请求内容的长度
        content_length = int(
            meta.get('CONTENT_LENGTH', meta.get('HTTP_CONTENT_LENGTH', 0))
        )
    # 如果无法将获取到的长度转换为整数（ValueError或TypeError），则将长度设为0
    except (ValueError, TypeError):
        content_length = 0
	
    # 如果长度为0，表示请求没有内容，将_stream设置为None
    if content_length == 0:
        self._stream = None
    
    # 如果_request的_read_started属性为False，说明请求还未开始读取内容
    # 将_stream设置为self._request，即直接使用请求对象
    elif not self._request._read_started:
        self._stream = self._request
        
    # 如果以上条件都不满足，将_stream设置为io.BytesIO(self.body)，即将请求的内容作为字节流进行处理
    else:
        self._stream = io.BytesIO(self.body)
```

- `_read_started`
  - 原来的request中的方法

```python
def read(self, *args, **kwargs):
    # 首先，代码将_read_started属性设置为True，表示读取已开始
    self._read_started = True
    try:
        # 然后，代码调用self._stream.read(*args, **kwargs)来读取流中的内容，并返回读取结果
        return self._stream.read(*args, **kwargs)
    except OSError as e:
        # 捕获并抛出异常
        raise UnreadablePostError(*e.args) from e
```

### （5）query_params

```python
# @property装饰器将该方法转换为一个只读属性，可以像访问普通属性一样访问它，而无需通过调用方法
@property
def query_params(self):
    """
    More semantically correct name for request.GET.
    """
    # 将原来的 GET 方法进行封装变成了 query_params 方法
    return self._request.GET
```

### （6）data

```python
# @property装饰器将该方法转换为一个只读属性，可以像访问普通属性一样访问它，而无需通过调用方法
@property
def data(self):
    # 首先检查对象是否已经存在_full_data属性
    if not _hasattr(self, '_full_data'):
        # 如果不存在，则调用_load_data_and_files()方法加载数据
        self._load_data_and_files()
    # 返回数据
    return self._full_data
```

- `_load_data_and_files`

```python
def _load_data_and_files(self):
    """
    # 从 self.data 中解析 request 携带的内容
    Parses the request content into `self.data`.
    """
    
    # 检查对象是否存在 _data 属性来确定是否需要执行解析操作
    if not _hasattr(self, '_data'):
        
        # 如果 _data 属性不存在，则调用 _parse() 方法进行解析
        # 将解析得到的数据分别赋值给 self._data 和 self._files 两个属性
        self._data, self._files = self._parse()
        
        # 是否存在文件数据（self._files）
        if self._files:
            # 如果存在文件数据，那么将 self._data 的副本赋值给 self._full_data
            # 并使用 update() 方法将 self._files 合并到 self._full_data 中
            self._full_data = self._data.copy()
            self._full_data.update(self._files)
            
        # 如果不存在文件数据，则直接将 self._data 赋值给 self._full_data
        else:
            self._full_data = self._data

        # if a form media type, copy data & files refs to the underlying
        # http request so that closable objects are handled appropriately.
        # 根据请求的媒体类型，判断是否为表单类型（is_form_media_type() 方法）。
        if is_form_media_type(self.content_type):
            # 如果是表单类型，则将 self.POST 和 self.FILES 的引用复制给底层的 HTTP 请求对象（self._request），以便适当地处理可关闭的对象
            # 如果是 post 请求携带的数据则 将数据赋值给原来 request 的 post 
            self._request._post = self.POST
            
            # 如果是文件则将数据赋值给 原来的files对象
            self._request._files = self.FILES
```

### （7）user(@property)

```python
# @property装饰器将该方法转换为一个只读属性，可以像访问普通属性一样访问它，而无需通过调用方法
@property
def user(self):
    """
    # 返回一个用户对象是被认证过的
    Returns the user associated with the current request, as authenticated
    by the authentication classes provided to the request.
    """
    
    # 检查对象是否具有 _user 属性来确定是否需要进行身份验证
    if not hasattr(self, '_user'):
        
        # 如果 _user 属性不存在，则调用 _authenticate() 方法来进行身份验证操作
        with wrap_attributeerrors():
            self._authenticate()
    return self._user
```

- `wrap_attributeerrors`

```python
# 定义了一个 @contextmanager（上下文管理器）
@contextmanager
def wrap_attributeerrors():
    """
    # 用于捕获并重新引发在身份验证期间遇到的 AttributeError 异常
    Used to re-raise AttributeErrors caught during authentication, preventing
    these errors from otherwise being handled by the attribute access protocol.
    """
    
    # 使用 try 块来执行包含在 yield 语句之前的代码
    try:
        
        # 当执行到 yield 时，将暂停执行，并将控制权返回给调用方
        yield
    
    # 捕获异常
    except AttributeError:
        
        # 获取当前异常信息
        info = sys.exc_info()
        # 将 获取到的当前异常信息 封装成 WrappedAttributeError 错误类型
        exc = WrappedAttributeError(str(info[1]))
        
        # 抛出异常 
        raise exc.with_traceback(info[2])
```

- `_authenticate`

```python
def _authenticate(self):
    """
    # 尝试使用每个身份验证实例依次对请求进行身份验证。
    Attempt to authenticate the request using each authentication instance
    in turn.
    """
    
    # 循环遍历 self.authenticators 列表中的每个身份验证器
    for authenticator in self.authenticators:
        try:
            
            # 对于每个身份验证器，通过调用其 authenticate 方法来尝试对当前请求进行身份验证。
            user_auth_tuple = authenticator.authenticate(self)
            
        # 捕获异常
        except exceptions.APIException:
            
            # 
            self._not_authenticated()
            raise
		
        # 如果 authenticate 方法返回的 user_auth_tuple 不为 None，则表示身份验证成功。
        if user_auth_tuple is not None:
            # 设置 self._authenticator 为当前的身份验证器
            self._authenticator = authenticator
            # 将 user_auth_tuple 中的用户对象和身份验证信息分别赋值给 self.user 和 self.auth
            self.user, self.auth = user_auth_tuple
            return
        
	# 如果所有的身份验证器都无法完成身份验证，将调用 _not_authenticated 方法来处理身份验证失败的情况。
    self._not_authenticated()

```

- `authenticator.authenticate`

```python
# 身份验证类
class ForcedAuthentication:
    """
    This authentication class is used if the test client or request factory
    forcibly authenticated the request.
    """

    def __init__(self, force_user, force_token):
        self.force_user = force_user
        self.force_token = force_token

    def authenticate(self, request):
        # 对请求进行身份验证。
        # 此方法接受一个请求对象作为参数，并返回一个元组 (self.force_user, self.force_token)
        # 其中包含预设的用户和令牌信息。
        return (self.force_user, self.force_token)
```

### （8）_parse

```python
def _parse(self):
    """
    # 解析请求内容，并返回一个包含数据和文件的二元组 (data, files)
    Parse the request content, returning a two-tuple of (data, files)

    May raise an `UnsupportedMediaType`, or `ParseError` exception.
    """
    
    # 获取请求的 content_type（媒体类型）
    media_type = self.content_type
    try:
        # 获取请求的 stream（流）
        stream = self.stream
    except RawPostDataException:
        
        # 是否已经在中间件中访问过 request.POST，并且进行了一个 method='POST' 且请求的媒体类型为 'multipart/form-data' 的请求
        if not hasattr(self._request, '_post'):
            raise
        # If request.POST has been accessed in middleware, and a method='POST'
        # request was made with 'multipart/form-data', then the request stream
        # will already have been exhausted.
        
        # 如果符合条件，则直接返回 (self._request.POST, self._request.FILES)
        if self._supports_form_parsing():
            return (self._request.POST, self._request.FILES)
        stream = None
	
    # 如果获取的 stream 或 media_type 为 None
    if stream is None or media_type is None:
        
        # 根据媒体类型判断是否为表单类型，返回空的 QueryDict 和 MultiValueDict 对象。
        if media_type and is_form_media_type(media_type):
            empty_data = QueryDict('', encoding=self._request._encoding)
        else:
            empty_data = {}
        empty_files = MultiValueDict()
        return (empty_data, empty_files)
	
    # 根据请求的媒体类型使用协商器 negotiator 和解析器 parser 进行解析。
    parser = self.negotiator.select_parser(self, self.parsers)
	
    # 如果没有找到相应的解析器，则抛出 UnsupportedMediaType 异常
    if not parser:
        raise exceptions.UnsupportedMediaType(media_type)

    try:
        # 使用找到的解析器 parser 对流 stream 进行解析，传入媒体类型和解析器上下文 parser_context。
        # 如果在解析过程中发生异常，则填充空数据，并重新抛出异常
        # 以确保不会在尝试渲染可浏览的响应或记录请求等操作时重复出现错误。
        parsed = parser.parse(stream, media_type, self.parser_context)
    except Exception:
        # If we get an exception during parsing, fill in empty data and
        # re-raise.  Ensures we don't simply repeat the error when
        # attempting to render the browsable renderer response, or when
        # logging the request or similar.
        self._data = QueryDict('', encoding=self._request._encoding)
        self._files = MultiValueDict()
        self._full_data = self._data
        raise

    # Parser classes may return the raw data, or a
    # DataAndFiles object.  Unpack the result as required.
    try:
        # 根据解析器的返回结果
        # 如果返回的对象具有 data 属性和 files 属性，则分别返回 (parsed.data, parsed.files)
        return (parsed.data, parsed.files)
    except AttributeError:
        # 否则，返回 (parsed, empty_files)，其中 empty_files 是一个空的 MultiValueDict 对象
        empty_files = MultiValueDict()
        return (parsed, empty_files)
```

# 【四】总结

```python
class TestView(APIView):
    def post(self, request, *args, **kwargs):
        '''

        :param request: 新的request，不是原来的那个
        :return:
        '''
        # # rest_framework中的新 request
        print(type(request))  

        # 继承 APIView 后，无论是post请求还是 get请求，获取数据都是从 data 中获取
        # 新的request中有了data 属性
        print(request.data)  

        # 原来的request.POST中还有数据，但是数据类型支持的没有data全，比如json格式的数据
        print(request.POST)

        # 提交文件是 form-data 格式，还在 request.FILES 中
        print(request.FILES)

        # 新的request的其他属性，使用起来和原来的一样
        print(request.method)
        # 有文件传入时，用 data 属性就会报错
        print(request.body)  
        # 请求路径
        print(request.path)

        # Response 和 JsonResponse 很像，但是比 JsonResponse 功能更加强大
        # 可以传字符串，列表，字典都可以，就是不能传对象
        return Response("ok")
```

# 【补充】限制请求的数据类型

## 【1】前端传入的数据支持的格式

- DRF支持以下三种请求编码格式：

  - urlencoded

  - form-data

  - json


## 【2】限制只能接受某种或某几种编码格式

- 有两种方式可以限制请求只能接受某种或某几种编码格式。

### 方式一：在视图类上设置`parser_classes`属性

- 这种方式只对该视图类有效。

```python
from rest_framework.parsers import JSONParser, FormParser, MultiPartParser

class BookView(APIView):
    parser_classes = [JSONParser, FormParser]
```

### 方式二：在DRF配置文件中设置`DEFAULT_PARSER_CLASSES`

- 这种方式是全局有效，在项目的DRF配置文件（一般是`settings.py`文件）中添加如下配置：

```python
REST_FRAMEWORK = {
    'DEFAULT_PARSER_CLASSES': [
        'rest_framework.parsers.JSONParser',
        # 'rest_framework.parsers.FormParser',
        # 'rest_framework.parsers.MultiPartParser',
    ],
}
```

## 【3】全局配置了只支持JSON，局部想支持所有三种编码格式

- 如果全局配置了只支持JSON编码格式
  - 但您的局部视图类想支持所有三种编码格式，只需要在该视图类中指定所有三个编码器。

```python
from rest_framework.parsers import JSONParser, FormParser, MultiPartParser

class BookView(APIView):
    parser_classes = [JSONParser, FormParser, MultiPartParser]
```

## 【4】总结

- DRF处理请求的编码格式遵循以下顺序：

  - 首先从视图类中查找`parser_classes`属性，如果设置了特定的编码器，将使用该编码器。

  - 如果视图类没有设置特定的编码器，则会到项目的DRF配置文件中查找`DEFAULT_PARSER_CLASSES`，如果配置了编码器列表，将使用该列表中的编码器。

  - 最后，如果既没有在视图类中设置编码器，也没有在项目的DRF配置文件中配置编码器列表，将使用DRF默认的配置。


## 【5】源码分析

### （1）位置

- DRF 源码中的 parsers 方法

![image-20230913162112797](http://zhaochunze.dream521.site/202309131621944.png)

### （2）源码分析

```python
"""
Parsers are used to parse the content of incoming HTTP requests.

They give us a generic way of being able to handle various media types
on the request, such as form content or json encoded data.
"""
import codecs

from django.conf import settings
from django.core.files.uploadhandler import StopFutureHandlers
from django.http import QueryDict
from django.http.multipartparser import ChunkIter
from django.http.multipartparser import \
    MultiPartParser as DjangoMultiPartParser
from django.http.multipartparser import MultiPartParserError

from rest_framework import renderers
from rest_framework.compat import parse_header_parameters
from rest_framework.exceptions import ParseError
from rest_framework.settings import api_settings
from rest_framework.utils import json


# 封装解析后的数据和相关文件
class DataAndFiles:
    def __init__(self, data, files):
        self.data = data
        self.files = files

# 定义了所有解析器应该扩展的基本功能
class BaseParser:
    """
    # 所有解析器都应该扩展' BaseParser '，指定' media_type '属性，并重写' .parse() '方法。
    All parsers should extend `BaseParser`, specifying a `media_type`
    attribute, and overriding the `.parse()` method.
    """
    # 指定媒体类型的解析器
    media_type = None
	
    # 流是要读取的参数，可选的media_type和parser_context参数是解析器的上下文信息。
    def parse(self, stream, media_type=None, parser_context=None):
        """
        # 给定要读取的流，返回解析后的表示形式。应该返回解析过的数据，还是一个由解析的数据和文件。
        Given a stream to read from, return the parsed representation.
        Should return parsed data, or a `DataAndFiles` object consisting of the
        parsed data and files.
        """
        raise NotImplementedError(".parse() must be overridden.")

# JSON格式数据解析类
class JSONParser(BaseParser):
    """
    Parses JSON-serialized data.
    """
    # 媒体类型，被设置为'application/json'，表示该解析器处理JSON类型的数据。
    media_type = 'application/json'
    # 用于渲染响应的渲染器类
    renderer_class = renderers.JSONRenderer
    # 表示是否采用严格模式进行JSON解析
    strict = api_settings.STRICT_JSON
	
    # 流参数和可选的media_type、parser_context参数。
    # parser_context用于传递解析器的上下文信息。
    def parse(self, stream, media_type=None, parser_context=None):
        """
        # 将传入字节流解析为JSON并返回结果数据。
        Parses the incoming bytestream as JSON and returns the resulting data.
        """
        # 如果没有提供parser_context，则默认为空字典
        parser_context = parser_context or {}
        
        # 从parser_context中获取编码方式，默认使用settings.DEFAULT_CHARSET作为编码方式
        encoding = parser_context.get('encoding', settings.DEFAULT_CHARSET)

        try:
            # 通过使用指定的编码方式对流进行解码，创建一个解码后的流对象
            decoded_stream = codecs.getreader(encoding)(stream)
            
            # 如果strict为真，则使用json.strict_constant作为解析常量
            parse_constant = json.strict_constant if self.strict else None
            
            # 使用json.load()方法从解码后的流对象中加载JSON数据并返回解析结果
            return json.load(decoded_stream, parse_constant=parse_constant)
        except ValueError as exc:
            
            # 引发自定义的异常ParseError，并附带错误信息。
            raise ParseError('JSON parse error - %s' % str(exc))

# form data 格式数据解析器
class FormParser(BaseParser):
    """
    Parser for form data.
    """
    # 媒体类型，被设置为 'application/x-www-form-urlencoded'
    # 表示该解析器处理URL编码形式的表单数据。
    media_type = 'application/x-www-form-urlencoded'
	
    # 接受一个流参数和可选的media_type、parser_context参数。
    # parser_context用于传递解析器的上下文信息。
    def parse(self, stream, media_type=None, parser_context=None):
        """
        Parses the incoming bytestream as a URL encoded form,
        and returns the resulting QueryDict.
        """
        # 如果没有提供parser_context，则默认为空字典。
        parser_context = parser_context or {}
        
        # 从parser_context中获取编码方式，默认使用settings.DEFAULT_CHARSET作为编码方式。
        encoding = parser_context.get('encoding', settings.DEFAULT_CHARSET)
        
        # 通过调用stream.read()方法读取流中的数据，并使用指定的编码方式对数据进行解码
        # 返回解析后的数据作为QueryDict对象。
        # QueryDict是Django框架中的一个类，用于处理表单数据，并提供了方便的方法来访问和操作表单字段的值
        return QueryDict(stream.read(), encoding=encoding)

# multipart 格式数据解析器
class MultiPartParser(BaseParser):
    """
    # 多部分表单数据的解析器，其中可能包括文件数据。
    Parser for multipart form data, which may include file data.
    """
    
    # 媒体类型，被设置为 'multipart/form-data'，表示该解析器处理多部分表单数据
    media_type = 'multipart/form-data'
	
    # 接受一个流参数和可选的media_type、parser_context参数。
    # parser_context用于传递解析器的上下文信息。
    def parse(self, stream, media_type=None, parser_context=None):
        """
        将传入字节流解析为多部分编码形式，并返回一个DataAndFiles对象。
        Parses the incoming bytestream as a multipart encoded form,
        and returns a DataAndFiles object.
		
		文本数据将是一个包含所有表单参数的' QueryDict '。
		文件类型将是一个包含所有表单文件的“QueryDict”
        `.data` will be a `QueryDict` containing all the form parameters.
        `.files` will be a `QueryDict` containing all the form files.
        """
        
        # 如果没有提供parser_context，则默认为空字典。
        parser_context = parser_context or {}
        
        # 从parser_context中获取request对象。
        # request对象是Django框架中代表HTTP请求的对象，通过request.META可以获取请求的元数据。
        request = parser_context['request']
        
        # 获取解码方式，默认使用settings.DEFAULT_CHARSET作为编码方式
        encoding = parser_context.get('encoding', settings.DEFAULT_CHARSET)
        
        # 创建一个副本meta，并将其内容修改为与request.META一致
        # 但将CONTENT_TYPE字段设置为给定的media_type。
        meta = request.META.copy()
        meta['CONTENT_TYPE'] = media_type
        
        # 获取request对象的上传处理程序列表upload_handlers
        upload_handlers = request.upload_handlers

        try:
            # 使用DjangoMultiPartParser类和之前设置的参数来创建一个解析器parser对象
            parser = DjangoMultiPartParser(meta, stream, upload_handlers, encoding)
            
            # 并调用其parse()方法解析表单数据
            # parse()方法会返回解析后的数据和文件
            data, files = parser.parse()
            
            # 将解析后的数据和文件打包成DataAndFiles对象并返回
            return DataAndFiles(data, files)
        except MultiPartParserError as exc:
            
            # 捕获并将其转换为ParseError异常抛出
            raise ParseError('Multipart form parse error - %s' % str(exc))


class FileUploadParser(BaseParser):
    """
    # 解析文件类型的数据
    Parser for file upload data.
    """
    # 媒体类型，表示传入数据的类型，默认为*/*
    media_type = '*/*'
    errors = {
        'unhandled': 'FileUpload parse error - none of upload handlers can handle the stream',
        'no_filename': 'Missing filename. Request should include a Content-Disposition header with a filename parameter.',
    }
	
    # 处理传入的字节流，并将其视为原始文件上传
    def parse(self, stream, media_type=None, parser_context=None):
        """
        # 将传入的字节流视为原始文件上传并返回' DataAndFiles '对象。
        Treats the incoming bytestream as a raw file upload and returns
        a `DataAndFiles` object.

        `.data` will be None (we expect request body to be a file content).
        `.files` will be a `QueryDict` containing one 'file' element.
        """
        
        # 如果没有提供parser_context，则默认为空字典。
        parser_context = parser_context or {}
        
        # 从parser_context中获取request对象。
        # request对象是Django框架中代表HTTP请求的对象，通过request.META可以获取请求的元数据。
        request = parser_context['request']
        
        # 获取解码方式，默认使用settings.DEFAULT_CHARSET作为编码方式
        encoding = parser_context.get('encoding', settings.DEFAULT_CHARSET)
        
        # 将原来的元数据赋值给meta
        meta = request.META
        
        # 获取request对象的上传处理程序列表upload_handlers
        upload_handlers = request.upload_handlers
        
        # 文件的名称（filename）是通过调用get_filename方法获取的
        filename = self.get_filename(stream, media_type, parser_context)
		
        # 如果没有获取到文件名，会抛出一个ParseError异常，提示缺少文件名的错误信息。
        if not filename:
            raise ParseError(self.errors['no_filename'])

        # Note that this code is extracted from Django's handling of
        # 文件上传在MultiPartParser
        # file uploads in MultiPartParser.
        
        # 从元数据中获取内容类型（content_type）
        content_type = meta.get('HTTP_CONTENT_TYPE',
                                meta.get('CONTENT_TYPE', ''))
        try:
            
            # 从元数据中获取内容长度（content_length）。
            content_length = int(meta.get('HTTP_CONTENT_LENGTH',
                                          meta.get('CONTENT_LENGTH', 0)))
        except (ValueError, TypeError):
            # # 如果获取失败，则将内容长度设置为None。
            content_length = None
		
        # 看看处理程序是否需要处理解析
        # See if the handler will want to take care of the parsing.
        # 遍历上传处理器（upload_handlers）列表，调用每个处理器的handle_raw_input方法
        # 将字节流、元数据、内容长度等参数传递给处理器进行处理
        for handler in upload_handlers:
            result = handler.handle_raw_input(stream,
                                              meta,
                                              content_length,
                                              None,
                                              encoding)
            
            # 如果处理器返回的结果不为None，则将结果包装成DataAndFiles对象并返回
            if result is not None:
                # 文件对象存储在files属性中，键名为'file'
                return DataAndFiles({}, {'file': result[1]})
		
        # 标准情况
        # This is the standard case.
        # 遍历upload_handlers列表
        # 找到其中具有chunk_size属性的对象
        # 并将它们的chunk_size属性提取出来形成一个可能大小的列表possible_sizes
        possible_sizes = [x.chunk_size for x in upload_handlers if x.chunk_size]
        
        # 确定文件块的大小chunk_size。
        # 这里使用了一个最小值函数，它比较了2 ** 31 - 4和possible_sizes列表中的元素，然后返回最小值。
        # 这个值将用于分割上传的文件为多个部分（块）进行处理。
        chunk_size = min([2 ** 31 - 4] + possible_sizes)
        
        # 创建一个迭代器chunks，用于迭代处理输入的流数据。
        # 这个迭代器将根据chunk_size将流数据切分成多个块。
        chunks = ChunkIter(stream, chunk_size)
        
        # 
        counters = [0] * len(upload_handlers)
        
		# 遍历upload_handlers列表
        for index, handler in enumerate(upload_handlers):
            try:
                # 依次调用每个处理程序的new_file方法，传入文件相关的信息，用于初始化文件的处理。
                handler.new_file(None, filename, content_type,
                                 content_length, encoding)
            except StopFutureHandlers:
                # 如果某个处理程序抛出了StopFutureHandlers异常，表示不再需要其他处理程序继续处理该文件
                # 那么后续的处理程序将被跳过，循环结束。
                upload_handlers = upload_handlers[:index + 1]
                break
		
        # 对于每个块，再次遍历upload_handlers列表
        for chunk in chunks:
            # 并依次调用每个处理程序的receive_data_chunk方法，传入当前块的数据和对应处理程序的计数器值
            # 该方法用于接收处理块数据，并返回处理后的块数据给下一次迭代使用
            for index, handler in enumerate(upload_handlers):
                chunk_length = len(chunk)
                chunk = handler.receive_data_chunk(chunk, counters[index])
                # 同时，更新计数器的值，以跟踪已经接收的数据量。
                counters[index] += chunk_length
                
                # 在遍历过程中，如果某个处理程序返回了None，表示不再需要继续处理后续块数据，那么内部循环将被中断，继续处理下一个块数据
                if chunk is None:
                    break
		
        # 完成所有块的处理后，再次遍历upload_handlers列表
        # 该方法用于标识文件已经传输完成，并返回最终的文件对象（如果有）。
        for index, handler in enumerate(upload_handlers):
            
            # 并依次调用每个处理程序的file_complete方法，传入对应处理程序的计数器值
            file_obj = handler.file_complete(counters[index])
            
            # 如果某个处理程序返回了文件对象，则会立即返回结果，其中包含数据字典和文件对象
            if file_obj is not None:
                return DataAndFiles({}, {'file': file_obj})
	
    	# 如果没有任何处理程序返回文件对象，说明无法处理该文件类型或发生未处理的错误
        # 将抛出ParseError异常，异常信息为self.errors['unhandled']
        raise ParseError(self.errors['unhandled'])

    def get_filename(self, stream, media_type, parser_context):
        """
        Detects the uploaded file name. First searches a 'filename' url kwarg.
        Then tries to parse Content-Disposition header.
        """
        try:
            # 首先尝试从parser_context参数中的kwargs字典中获取filename键对应的值。
            # 如果成功获取到文件名，则直接返回该文件名。
            return parser_context['kwargs']['filename']
        except KeyError:
            pass

        try:
            meta = parser_context['request'].META
            # 如果上一步未成功获取文件名，则尝试从HTTP请求头中的Content-Disposition字段解析文件名。
            # 解析过程中会检查是否有附加的参数，如filename*或filename。
            disposition, params = parse_header_parameters(meta['HTTP_CONTENT_DISPOSITION'])
            
            # 如果filename*存在，则返回其对应的值作为文件名
            if 'filename*' in params:
                return params['filename*']
            
            # 否则，返回filename参数的值作为文件名
            else:
                return params['filename']
        except (AttributeError, KeyError, ValueError):
            pass
```

