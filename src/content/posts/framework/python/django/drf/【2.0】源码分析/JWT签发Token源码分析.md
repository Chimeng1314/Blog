---
title: "DRF JWT 签发 Token 源码分析"
published: 2023-08-14 15:12:00
category: Web 开发
series: "DRF 源码分析"
seriesOrder: 13
hubs: ["drf-source-analysis"]
---

# 【一】JWT介绍

- JWT（JSON Web Token）是一种用于身份认证和授权的开放标准（RFC 7519）。
- 它基于JSON格式定义了一种安全的令牌，用于在客户端和服务器之间传输信息。

# 【二】JWT三段式

> - JWT（JSON Web Token）是一种用于身份认证和授权的开放标准（RFC 7519）。
> - 它基于JSON格式定义了一种安全的令牌，用于在客户端和服务器之间传输信息。

JWT由三个部分组成：头部（Header）、载荷（Payload）和签名（Signature）：

## 【1】头部（Header）：

- 头部通常由两部分组成：
  - 令牌类型和算法。
  - 令牌类型通常为"JWT"。
  - 算法定义了用于生成签名的算法，例如HMAC、RSA或者ECDSA等。
- 示例：

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

## 【2】载荷（Payload）：

- 载荷包含了关于用户或实体的声明和其他附加信息。
- JWT规范定义了一些标准的声明（例如：iss-签发者、exp-过期时间、sub-主题、aud-受众），并且允许自定义声明。
- 示例：

```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "admin": true
}
```

## 【3】签名（Signature）：

- 签名是将头部和载荷进行签名，以确保令牌的完整性和真实性。
  - 签名通常使用密钥进行加密，以防止其被篡改。
  - 服务器在接收到请求时使用同样的密钥对签名进行验证。
- 示例：

```scss
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secretKey
)
```

## 【4】最终的JWT

- 由上述三个部分用`.`拼成一个完整的字符串，构成最终的JWT

# 【三】JWT开发流程

## 【1】JWT工作流程如下：

1. 用户向服务器发送登录请求，提供用户名和密码。
2. 服务器验证用户凭证，如果通过验证，生成JWT并将其返回给客户端。
3. 客户端收到JWT后，保存在本地（通常在本地存储或者Cookie中）。
4. 客户端每次访问受限资源时，在请求头中附带JWT。
5. 服务器接收到请求后，使用相同的密钥解析JWT，验证其有效性和完整性，然后根据需要执行相应的操作。

## 【2】JWT开发流程

### 第一部分：签发token的过程(登录)

> - 用户携带用户名和密码，访问我，我们校验通过，生成token串，返回给前端

- 用户携带用户名和密码访问应用后端。
- 应用后端校验用户提供的用户名和密码是否正确。
- 如果校验通过，应用后端生成一个JWT Token，并将其返回给前端。
  - JWT Token包含三个部分：Header、Payload和Signature。
  - Header包含了关于Token类型和所使用的算法的信息。
  - Payload包含了要传递的数据，例如用户ID、角色等。
  - Signature是使用密钥对Header和Payload进行签名的结果，用于验证Token的真实性。
  - 这些部分通常会经过Base64编码组合成一个字符串。
- 前端收到JWT Token后，可以将其保存在本地
  - 例如LocalStorage或者Cookie中，在后续需要使用Token的请求中携带它。

### 第二部分：token认证过程

> - token认证过程，登录认证时使用，其实就是咱们之前讲的认证类，在认证类中完成对token的认证操作
> - 用户访问我们需要登陆后才能访问的接口，必须携带我们签发的token串(请求头)
> - 我们取出token，验证该token是否过期，是否被篡改，是否是伪造的
> - 如果正常，说明荷载中的数据，就是安全的，可以根据荷载中的用户id，查询出当前登录用户，放到request中即可

- 用户访问需要登录才能访问的接口，请求头中携带JWT Token。
- 后端从请求头中获取JWT Token。
- 后端对Token进行解析和验证，确保Token的完整性和真实性。
  - 验证Token的完整性可以通过验签来实现，即使用密钥对Token的签名部分进行验证。
  - 验证Token的真实性可以通过检查Token的有效期以及其他业务逻辑来实现。
- 如果Token验证通过，后端能够从Token的Payload部分获取到用户的相关信息，例如用户ID。
- 后端可以根据用户ID查询数据库或其他存储系统，获取该用户的详细信息。
- 后端将获取到的用户信息添加到请求的上下文中，以便后续的处理逻辑可以使用该信息进行权限控制、数据处理等操作。

# 【四】JWT的优点

- 简洁：由于使用JSON格式，JWT具有易读性和可理解性。
- 自包含：JWT中包含了所有必要的信息，减少服务器端的存储开销。
- 可扩展：JWT允许自定义声明来满足特定需求。
- 跨域支持：JWT可以在不同域之间进行传递，并实现跨域认证。

然而，使用JWT需要注意以下几点：

- JWT无法撤销：一旦JWT被签发，就无法主动撤销，只能等待过期时间到达或者通过其他方式进行处理。
- 令牌大小：由于JWT包含载荷信息，其大小较大，可能会影响网络传输和存储开销。

总结来说，JWT是一种灵活且安全的身份认证和授权机制，可以用于构建分布式系统和跨域认证场景。但在使用时需注意安全性和令牌的大小。

# 【五】djangorestframework-jwt自动签发token

## 【1】安装

```python
pip3 install djangorestframework-jwt
```

## 【2】签发过程

- 登录过程(快速签发)
  - 登录接口
    - 在URL路由中添加登录接口路径，使用`obtain_jwt_token`函数进行用户身份验证并签发JWT Token。
  - 基于 auth 的user表签发

```python
from django.contrib import admin
from django.urls import path
from rest_framework_jwt.views import obtain_jwt_token

urlpatterns = [
    path('admin/', admin.site.urls),
    path('login/', obtain_jwt_token),  # 登录接口有了，并且可以签发token
]
```

- `{{host}}login/`

  ```js
  {
      "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6ImFkbWluIiwiZXhwIjoxNjkwNzk5OTE0LCJlbWFpbCI6IiJ9.2KlbMxOsa1V7LDGzY2wQlWfJWvqCjEV4SSLtllnec_U"
  }
  ```

## 【3】总结

### 【1】签发：只需要在路由中配置

```python
from rest_framework_jwt.views import obtain_jwt_token
urlpatterns = [
    path('login/', obtain_jwt_token), 
]
```

> - 在路由中配置登录接口路径，使用`obtain_jwt_token`函数进行用户身份验证并签发JWT Token。

### 【2】认证：视图类上加

```python
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from rest_framework.permissions import IsAuthenticated


class BookView(APIView):
    authentication_classes = [JSONWebTokenAuthentication] # 认证类，drf-jwt提供的
    permission_classes = [IsAuthenticated] # 权限类，drf提供的
```

> - 使用JWT认证方法需要在视图类中添加相应的认证类和权限类。
>   - 认证类：`JSONWebTokenAuthentication`，该类提供了JWT的认证功能。
>   - 权限类：`IsAuthenticated`，该类用于验证请求是否来自已认证的用户。

- 访问的时候，要在请求头中携带，必须叫
  - `Authorization`:`jwt token串`

## 【4】Django + JWT 自定制返回格式

- 登录签发token的接口，要返回code，msg，username,token等信息

- 写个函数，函数返回字典格式，返回的格式，会被序列化，前端看到

  ```python
  def common_response(token, user=None, request=None):
      return {
          'code': '100',
          'msg': '登录成功',
          'username': user.username,
          'token': token,
      }
  ```

- 写的函数配置一下

  ```python
  JWT_AUTH = {
      'JWT_RESPONSE_PAYLOAD_HANDLER': 'app01.jwt_response.common_response',
      'JWT_EXPIRATION_DELTA': datetime.timedelta(seconds=300),# 设置token过期时间，默认5分钟过期
  }
  ```

# 【六】Django + JWT 自定义用户表签发认证(手动签发)

## 【1】签发部分

### 【1】创建用户表

```python
from django.db import models


# Create your models here.
class User(models.Model):
    username = models.CharField(max_length=32)
    password = models.CharField(max_length=255)
    age = models.IntegerField()
```

### 【2】登录接口

- 路由

```python
path('login/', views.UserView.as_view({"post": "login"})), 
```

- 视图

```python
# 自定义用户表，写登录接口做 token 签发
from rest_framework.viewsets import ViewSet
from app01 import models
from rest_framework.response import Response
from rest_framework_jwt.settings import api_settings

jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER


class UserView(ViewSet):
    back_dict = {"code": 100, "msg": ""}

    def login(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user_obj = models.User.objects.filter(username=username, password=password).first()
        if user_obj:
            # 登陆成功,签发token
            # （1）通过user获取荷载(payload)
            payload = jwt_payload_handler(user_obj)
            print(payload) # {'user_id': 1, 'username': 'dream', 'exp': datetime.datetime(2023, 7, 31, 11, 45, 10, 630745)}
            # （2） 通过荷载获得 token
            token = jwt_encode_handler(payload)
            self.back_dict['code'] = 100
            self.back_dict['msg'] = "用户登录成功"
            self.back_dict['username'] = user_obj.username
            self.back_dict['token'] = token
            return Response(self.back_dict)
        else:
            # 登陆失败
            self.back_dict['code'] = 102
            self.back_dict['msg'] = "用户名或密码错误"
            return Response(self.back_dict)
```

- 携带错误信息

  - `{{host}}login/`

  ```python
  {
      "username":"admin",
      "password":521
  }
  
  {
      "code": 102,
      "msg": "用户名或密码错误"
  }
  ```

- 携带正确信息

  - `{{host}}login/`

  ```python
  {
      "username":"dream",
      "password":521
  }
  
  
  {
      "code": 100,
      "msg": "用户登录成功",
      "username": "dream",
      "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6ImRyZWFtIiwiZXhwIjoxNjkwODA0MDMzfQ.VGcEd0HkMH4aAG_2EoorOx90Rw8G5bPGe4eGWaaDgI4"
  }
  ```

## 【2】认证部分

- drf的认证类定义方式
- 在认证类中，自己写逻辑

```python
# -*-coding: Utf-8 -*-
# @File : jwt_authentication .py
# author: Chimengmeng
# blog_url : https://www.cnblogs.com/dream-ze/
# Time：2023/7/31
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_jwt.settings import api_settings
import jwt
from app01 import models

jwt_decode_handler = api_settings.JWT_DECODE_HANDLER


class JWTAuthentication(BaseAuthentication):
    #
    def authenticate(self, request):
        # 获取到请求头中携带的 token ： 可自定义名字
        token = request.META.get('HTTP_TOKEN')
        # 校验token是否过期

        # 校验token是否合法
        try:
            payload = jwt_decode_handler(token)
            # 如果认证通过，payload就可以认为是安全的，我们就可以使用
            user_id = payload.get('user_id')

            # 每个需要登录后才能访问的接口，都会走这个认证类
            # 一旦走一次就要去数据库中查询一次，这样会对数据库造成压力
            # user = models.User.objects.filter(pk=user_id)

            # 优化 --- 除了指定字段，其他字段不能校验
            user = models.User(username=payload.get('username'), user_id=user_id)
        except jwt.ExpiredSignature:
            raise AuthenticationFailed("token超时")
        except jwt.DecodeError:
            raise AuthenticationFailed("解码失败")
        except jwt.InvalidTokenError:
            raise AuthenticationFailed("token异常")
        except Exception:
            raise AuthenticationFailed("token认证异常")

        return user, token
```

- 视图

```python
from app01.JWT_ap.jwt_authentication import JWTAuthentication


class UserInfoView(ViewSet):
    back_dict = {"code": 100, "msg": ""}
    authentication_classes = [JWTAuthentication]

    def login(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user_obj = models.User.objects.filter(username=username, password=password).first()
        if user_obj:
            # 登陆成功,签发token
            # （1）通过user获取荷载(payload)
            payload = jwt_payload_handler(user_obj)
            print(
                payload)  # {'user_id': 1, 'username': 'dream', 'exp': datetime.datetime(2023, 7, 31, 11, 45, 10, 630745)}
            # （2） 通过荷载获得 token
            token = jwt_encode_handler(payload)
            self.back_dict['code'] = 100
            self.back_dict['msg'] = "用户登录成功"
            self.back_dict['username'] = user_obj.username
            self.back_dict['token'] = token
            return Response(self.back_dict)
        else:
            # 登陆失败
            self.back_dict['code'] = 102
            self.back_dict['msg'] = "用户名或密码错误"
            return Response(self.back_dict)
```

- 路由

```python
path('books/', views.UserInfoView.as_view({"post": "login"})),  # 登录接口有了，并且可以签发token
```

- 不携带token/错误toke

  ```js
  {
      "detail": "解码失败"
  }
  ```

# 【七】rest_framework_jwt源码分析

## 【1】流程分析

```python
# from rest_framework_jwt.views import obtain_jwt_token
# obtain_jwt_token就是ObtainJSONWebToken.as_view()---》视图类.as_view()
```

> - 引入了`rest_framework_jwt`模块，并且使用了`obtain_jwt_token`函数，该函数实际上是`ObtainJSONWebToken.as_view()`方法的别名。
> - `JSONWebTokenAPIView`是一个API视图类，继承自`rest_framework`框架的`APIView`类。
>   - 它用于处理接收到的包含用户用户名和密码的POST请求，并返回一个JSON Web Token，该令牌可以用于后续的身份验证请求。

- `obtain_jwt_token`---->`ObtainJSONWebToken.as_view()`

```python
class ObtainJSONWebToken(JSONWebTokenAPIView):
    """
    API View that receives a POST with a user's username and password.

    Returns a JSON Web Token that can be used for authenticated requests.
    """
    serializer_class = JSONWebTokenSerializer
```

> - `JSONWebTokenAPIView`的`serializer_class`属性指定了用于序列化和验证用户输入的数据的序列化器类
>   - 这里使用的是`JSONWebTokenSerializer`。

- `JSONWebTokenAPIView`

```python
class JSONWebTokenAPIView(APIView):
    """
    Base API View that various JWT interactions inherit from.
    """
    # 局部禁用权限和认证
    permission_classes = ()
    authentication_classes = ()

    def get_serializer_context(self):
        """
        Extra context provided to the serializer class.
        """
        return {
            'request': self.request,
            'view': self,
        }

    def get_serializer_class(self):
        """
        Return the class to use for the serializer.
        Defaults to using `self.serializer_class`.
        You may want to override this if you need to provide different
        serializations depending on the incoming request.
        (Eg. admins get full serialization, others get basic serialization)
        """
        assert self.serializer_class is not None, (
            "'%s' should either include a `serializer_class` attribute, "
            "or override the `get_serializer_class()` method."
            % self.__class__.__name__)
        return self.serializer_class

    def get_serializer(self, *args, **kwargs):
        """
        Return the serializer instance that should be used for validating and
        deserializing input, and for serializing output.
        """
        serializer_class = self.get_serializer_class()
        kwargs['context'] = self.get_serializer_context()
        return serializer_class(*args, **kwargs)
	
    # post 请求：签发签名
    def post(self, request, *args, **kwargs):
        # serializer = JSONWebTokenSerializer(data=request.data)
        serializer = self.get_serializer(data=request.data)
		# 调用序列化类的 is_valid()
        # 字段自己的校验规则，局部钩子/全局钩子
        if serializer.is_valid(): # 全局钩子校验参数，生成token
            # 从序列化类中取出 user
            user = serializer.object.get('user') or request.user
            # 从序列化类中取出 token
            token = serializer.object.get('token')
            # 定制返回格式时，重写了 jwt_response_payload_handler 方法
            response_data = jwt_response_payload_handler(token, user, request)
            # 返回字典
            response = Response(response_data)
            if api_settings.JWT_AUTH_COOKIE:
                expiration = (datetime.utcnow() +
                              api_settings.JWT_EXPIRATION_DELTA)
                response.set_cookie(api_settings.JWT_AUTH_COOKIE,
                                    token,
                                    expires=expiration,
                                    httponly=True)
            return response

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

```

> - `permission_classes`和`authentication_classes`字段:
>   - 这两个字段用于定义API视图的权限和认证类，默认情况下为空元组，即没有任何限制和认证要求。
> - `get_serializer_context`方法:
>   - 此方法返回给序列化器类的额外上下文信息。
>   - 默认情况下，提供了`request`和`view`信息作为上下文。
> - `get_serializer_class`方法:
>   - 该方法返回用于序列化的类。
>   - 默认情况下使用`self.serializer_class`字段的值。
>   - 如果需要根据请求的不同提供不同的序列化方式，可以重写此方法。
> - `get_serializer`方法:
>   - 该方法返回一个序列化器的实例，用于验证、反序列化输入和序列化输出。
>   - 首先通过`get_serializer_class`方法获取序列化器类。
>   - 然后将额外的上下文信息传递给序列化器实例的`context`参数。
>   - 最后返回序列化器的实例。
> - `post`方法:
>   - 这是处理POST请求的方法，负责签发JWT令牌。
>   - 首先通过`self.get_serializer(data=request.data)`获取序列化器的实例。
>   - 利用序列化器的`is_valid()`方法对请求数据进行校验，包括全局钩子和字段自定义的校验规则。
>   - 如果校验通过，从序列化器中获取用户对象和令牌对象。
>   - 接下来调用`jwt_response_payload_handler`方法自定义返回格式，并将令牌、用户和请求作为参数传递给它，获取返回数据字典。
>   - 创建一个响应对象，将返回数据作为内容进行响应。
>   - 如果配置文件中使用了JWT的cookie认证(`api_settings.JWT_AUTH_COOKIE`)，则设置JWT的cookie，设置过期时间为当前时间加上JWT的过期时间差(`api_settings.JWT_EXPIRATION_DELTA`)。
>   - 最后返回响应对象。
>   - 如果校验失败，返回错误信息和HTTP 400错误状态码的响应。

- `JSONWebTokenSerializer`的全局钩子/局部钩子
  - 全局钩子

```python
def validate(self, attrs):
    # attrs ： 前端传入校验过的数据{username:dream,password:521}
    credentials = {
        # 获取 username
        self.username_field: attrs.get(self.username_field),
        # 获取password
        'password': attrs.get('password')
    }
	
    # 全部为真 ： 检验 credentials中字典的 value 全部有值
    if all(credentials.values()):
        # user = authenticate(将前端传入的数据全部打散)
        # user=authenticate(username=前端传入的，password=前端传入的)
        # authenticate ： auth模块的用户名和密码认证函数，可以传入用户名和密码，去auth的user表中校验用户是否存在
        # 等同于：User.object.filter(username=username,password=加密后的密码).first()
        user = authenticate(**credentials)

        if user:
            if not user.is_active:
                msg = _('User account is disabled.')
                raise serializers.ValidationError(msg)

            payload = jwt_payload_handler(user)

            return {
                'token': jwt_encode_handler(payload),
                'user': user
            }
        else:
            msg = _('Unable to log in with provided credentials.')
            raise serializers.ValidationError(msg)
    else:
        msg = _('Must include "{username_field}" and "password".')
        msg = msg.format(username_field=self.username_field)
        raise serializers.ValidationError(msg)
```

> - 上述代码是一个JSONWebTokenSerializer的全局钩子(validate方法)。
>   - 在该代码段中，validate方法接收前端传入的经过验证的数据(attrs)，然后提取用户名和密码，并进行用户认证。
> - 首先，定义了一个credentials字典，其中包含用户名(self.username_field)和密码('password')。
>   - 通过attrs.get()方法从前端传入的数据中获取对应的值，并将其赋给credentials字典中的相应键。
> - 接下来，使用all()函数判断credentials字典中的值是否全部存在（即用户名和密码都不为空）。
>   - 如果是，则调用authenticate()函数进行用户认证。
> - authenticate()函数是在Django的auth模块中进行用户名和密码认证的函数。
>   - 它接收用户名和密码作为参数，在auth的user表中校验用户是否存在。
>   - 相当于执行了类似于User.objects.filter(username=username, password=加密后的密码).first()的查询，返回用户对象。
> - 如果用户认证成功，继续进行进一步的操作。
>   - 首先判断用户是否激活，如果用户未激活，则抛出ValidationError异常，提示用户账户已被禁用。
> - 接着，生成payload（有效载荷）对象，该对象包含了用户的信息。然后，通过jwt_encode_handler()函数对payload进行加密处理，得到一个token。
>   - 最后，将token和user对象作为字典返回。
> - 如果用户认证失败，则抛出ValidationError异常，提示无法使用提供的凭据登录。
>
> - 如果credentials字典中的值存在空值（即用户名或密码为空），则抛出ValidationError异常，提醒必须包含用户名和密码。
>
> - 总结：该全局钩子的作用是对前端传入的数据进行校验和用户认证，并返回包含token和用户信息的字典。如果验证或认证失败，则抛出相应的异常。

- `jwt_response_payload_handler(token, user, request)`
  - 定制返回数据格式

```python
jwt_response_payload_handler = api_settings.JWT_RESPONSE_PAYLOAD_HANDLER
```

## 【2】源码分析

- BaseJSONWebTokenAuthentication

```python
from rest_framework_jwt.settings import api_settings

# 从DRF JWT设置中导入了JWT解码处理器和获取用户名的处理器
jwt_decode_handler = api_settings.JWT_DECODE_HANDLER
jwt_get_username_from_payload = api_settings.JWT_PAYLOAD_GET_USERNAME_HANDLER


class BaseJSONWebTokenAuthentication(BaseAuthentication):
    """
    Token based authentication using the JSON Web Token standard.
    """
	
    # 这个方法用于验证JWT令牌并返回用户和令牌的元组，如果令牌有效。如果令牌无效，则返回 None。
    def authenticate(self, request):
        """
        Returns a two-tuple of `User` and token if a valid signature has been
        supplied using JWT-based authentication.  Otherwise returns `None`.
        """
        # 从请求中获取JWT令牌值
        jwt_value = self.get_jwt_value(request)
        if jwt_value is None:
            return None

        try:
            # 使用JWT解码处理器解码JWT令牌，并获取其中的载荷（payload）
            payload = jwt_decode_handler(jwt_value)
        except jwt.ExpiredSignature:
            # 如果令牌过期，则抛出 AuthenticationFailed 异常
            msg = _('Signature has expired.')
            raise exceptions.AuthenticationFailed(msg)
        except jwt.DecodeError:
            # 如果解码时出现错误，抛出 AuthenticationFailed 异常
            msg = _('Error decoding signature.')
            raise exceptions.AuthenticationFailed(msg)
        except jwt.InvalidTokenError:
            # 如果令牌无效，抛出 AuthenticationFailed 异常
            raise exceptions.AuthenticationFailed()
		
        # 使用 authenticate_credentials 方法验证令牌的有效性，并返回用户对象
        user = self.authenticate_credentials(payload)
		
        # 返回用户对象和校验成功的token串
        return (user, jwt_value)
	
    # 验证令牌的有效性并返回与令牌关联的用户
    def authenticate_credentials(self, payload):
        """
        Returns an active user that matches the payload's user id and email.
        """
        # 获取用户模型
        User = get_user_model()
        # 从JWT令牌的载荷中获取用户名
        username = jwt_get_username_from_payload(payload)
		
        # 如果载荷中没有用户名，抛出 AuthenticationFailed 异常
        if not username:
            msg = _('Invalid payload.')
            raise exceptions.AuthenticationFailed(msg)

        try:
            # 尝试通过用户名获取用户对象
            user = User.objects.get_by_natural_key(username)
        except User.DoesNotExist:
            # 如果用户不存在，抛出 AuthenticationFailed 异常
            msg = _('Invalid signature.')
            raise exceptions.AuthenticationFailed(msg)
		
        # 如果用户被禁用，抛出 AuthenticationFailed 异常
        if not user.is_active:
            msg = _('User account is disabled.')
            raise exceptions.AuthenticationFailed(msg)
		
        # 返回验证通过的用户对象
        return user
```

- JSONWebTokenAuthentication

```python
class JSONWebTokenAuthentication(BaseJSONWebTokenAuthentication):
    """
    Clients should authenticate by passing the token key in the "Authorization"
    HTTP header, prepended with the string specified in the setting
    `JWT_AUTH_HEADER_PREFIX`. For example:

        Authorization: JWT eyJhbGciOiAiSFMyNTYiLCAidHlwIj
    """
    
    www_authenticate_realm = 'api'
	
    # 该方法用于获取JWT令牌的值，它从请求的 Authorization 头中提取JWT令牌
    def get_jwt_value(self, request):
        # 检查请求的 Authorization 头是否存在
        # 然后使用 split() 方法拆分这个内容。这样，它可以检查 Authorization 头是否包含 JWT 令牌。
        auth = get_authorization_header(request).split()
        # 获取 JWT 令牌的前缀（prefix），这个前缀由 api_settings.JWT_AUTH_HEADER_PREFIX 指定，通常是 "JWT"。
        auth_header_prefix = api_settings.JWT_AUTH_HEADER_PREFIX.lower()
		
        # 如果没有找到 Authorization 头
        if not auth:
            # 它会检查是否启用了JWT令牌的Cookie支持，并尝试从Cookie中获取令牌。
            if api_settings.JWT_AUTH_COOKIE:
                # 如果启用了，它会尝试从请求的 Cookie 中获取 JWT 令牌。
                return request.COOKIES.get(api_settings.JWT_AUTH_COOKIE)
            return None
		
        # 首先，它会确保 Authorization 头的第一个元素（通常是前缀）与设置中定义的前缀相匹配，不区分大小写。
        if smart_text(auth[0].lower()) != auth_header_prefix:
            return None
		
        # 然后，它检查 Authorization 头的长度是否合法。
        # JWT 令牌的格式是 "Bearer {token}"，如果头部长度不等于 2，它会引发 AuthenticationFailed 异常
        if len(auth) == 1:
            msg = _('Invalid Authorization header. No credentials provided.')
            raise exceptions.AuthenticationFailed(msg)
        elif len(auth) > 2:
            msg = _('Invalid Authorization header. Credentials string '
                    'should not contain spaces.')
            raise exceptions.AuthenticationFailed(msg)
		
        # 如果前缀匹配，它返回JWT令牌的值
        return auth[1]

    def authenticate_header(self, request):
        """
        Return a string to be used as the value of the `WWW-Authenticate`
        header in a `401 Unauthenticated` response, or `None` if the
        authentication scheme should return `403 Permission Denied` responses.
        """
        # 如果 Authorization 头存在
        # 它会检查JWT令牌的前缀是否匹配设置中定义的前缀（通过 api_settings.JWT_AUTH_HEADER_PREFIX 指定）。
        return '{0} realm="{1}"'.format(api_settings.JWT_AUTH_HEADER_PREFIX, self.www_authenticate_realm)
```

# 【八】djangorestframework-simplejwt源码分析(自动签发token)

## 【1】流程分析

### （1）安装 `djangorestframework-simplejwt` 模块

```python
pip install djangorestframework-simplejwt
```

### （2）settings文件注册APP

```python
from datetime import timedelta

# （1）注册APP
INSTALLED_APPS = [
	...
    # jwt认证模块注册
    'rest_framework_simplejwt',
	...
]

# （2）配置登陆校验类(自定义或使用Django的)
AUTHENTICATION_BACKENDS = [
    'DreamShopApi.utils.common_authentications.Authentice',
]


# （3）配置令牌失效时间
SIMPLE_JWT = {
    # 访问令牌的有效时间
    "ACCESS_TOKEN_LIFETIME":timedelta(minutes=5),
}

# （4）# djangorestframework-simplejwt 配置令牌信息
SIMPLE_JWT = {
    # token有效时长(返回的 access 有效时长) - 访问令牌的有效时间
    'ACCESS_TOKEN_LIFETIME': datetime.timedelta(seconds=10),
    # token刷新的有效时间(返回的 refresh 有效时长) - 刷新令牌的有效时间
    'REFRESH_TOKEN_LIFETIME': datetime.timedelta(days=1),

    # 若为 True ，则刷新后的refresh_token 有更新的有效时间
    'ROTATE_REFRESH_TOKENS': False,
    # 若为 True ， 则刷新后的token将添加到黑名单中
    'BLACKLIST_AFTER_ROTATION': True,

    # 对称算法：HS256 HS384 HS512
    # 非对称算法：RSA
    'ALGORITHM': 'HS256',
    #
    'SIGNING_KEY': SECRET_KEY,
    # if signing_key, verifying_key will be ignored
    'VERIFYING_KEY': None,
    #
    'AUDIENCE': None,
    #
    'ISSUER': None,

    # AUTHORIZATION: Bearer < token >
    'AUTH_HEADER_TYPES': ("Bearer"),
    # if HTTP_X_ACCESS_TOKEN,x_ACCESS_TOKEN : Bearer < token >
    "AUTH_HEADER_NAME": "HTTP_AUTHORIZATION",
    #
    Bearer < token >
    # 使用唯一不变的数据库字段，将包含在生成令牌中以标识用户
    'USER_ID_FIELD': "id",

    "USER_ID_CLAIM": "user_id"
}
```

### （3）路由配置

- 三个路由都要有

```python
from rest_framework_simplejwt.views import TokenRefreshView,TokenVerifyView

path('login_admin/', AutoTokenLoginView.as_view()),
# 刷新 token 接口
path('token/refresh/', TokenRefreshView.as_view()),
# 校验token
path('token/verify/', TokenVerifyView.as_view()),
```

#### （4）视图函数

```python
class AutoTokenLoginView(TokenObtainPairView):

    def post(self, request, *args, **kwargs):
        # 校验数据 ---- 使用的是 TokenObtainPairView 的序列化类
        serializer = self.get_serializer(data=request.data)
        try:
            # raise_exception : 异常主动抛出
            # 校验数据
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            raise InvalidToken(e.args[0])
        result = serializer.validated_data

        id = serializer.user.id
        phone = serializer.user.phone
        email = serializer.user.email
        username = serializer.user.username
        token = result.pop("access")
        re_token = result.pop("refresh")
        return CommonResponse(msg="成功了", id=id, username=username,
                              phone=phone, email=email,
                              token=token, re_token=re_token,
                              status=status.HTTP_200_OK)
```

## 【2】源码分析

### （1）api_settings

```python
from datetime import timedelta
from typing import Any, Dict

from django.conf import settings
from django.test.signals import setting_changed
from django.utils.translation import gettext_lazy as _
from rest_framework.settings import APISettings as _APISettings

from .utils import format_lazy

USER_SETTINGS = getattr(settings, "SIMPLE_JWT", None)

# 默认配置设置（DEFAULTS 字典）
DEFAULTS = {
    # 访问令牌的生命周期，默认为5分钟
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=5),

    # 刷新令牌的生命周期，默认为1天
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),

    # 是否轮换刷新令牌，默认为False
    "ROTATE_REFRESH_TOKENS": False,

    # 轮换后是否将令牌列入黑名单，默认为False
    "BLACKLIST_AFTER_ROTATION": False,

    # 是否更新用户的最后登录时间，默认为False
    "UPDATE_LAST_LOGIN": False,

    # 令牌的签名算法，默认为HS256
    "ALGORITHM": "HS256",

    # 用于签名的密钥，默认为Django项目的SECRET_KEY
    "SIGNING_KEY": settings.SECRET_KEY,

    # 用于验证的密钥，默认为空
    "VERIFYING_KEY": "",

    # 令牌的受众（Audience）声明，默认为None
    "AUDIENCE": None,

    # 令牌的发行者（Issuer）声明，默认为None
    "ISSUER": None,

    # JSON编码器，默认为None
    "JSON_ENCODER": None,

    # JSON Web Key (JWK) URL，默认为None
    "JWK_URL": None,

    # 时间偏差，默认为0
    "LEEWAY": 0,

    # 认证头部的类型，默认为("Bearer",)
    "AUTH_HEADER_TYPES": ("Bearer",),

    # 认证头部的名称，默认为"HTTP_AUTHORIZATION"
    "AUTH_HEADER_NAME": "HTTP_AUTHORIZATION",

    # 用户ID字段，默认为"id"
    "USER_ID_FIELD": "id",

    # 用户ID声明，默认为"user_id"
    "USER_ID_CLAIM": "user_id",

    # 用户认证规则，默认为"rest_framework_simplejwt.authentication.default_user_authentication_rule"
    "USER_AUTHENTICATION_RULE": "rest_framework_simplejwt.authentication.default_user_authentication_rule",

    # 认证令牌类，默认为("rest_framework_simplejwt.tokens.AccessToken",)
    "AUTH_TOKEN_CLASSES": ("rest_framework_simplejwt.tokens.AccessToken",),

    # 令牌类型声明，默认为"token_type"
    "TOKEN_TYPE_CLAIM": "token_type",

    # JWT ID声明，默认为"jti"
    "JTI_CLAIM": "jti",

    # 令牌用户类，默认为"rest_framework_simplejwt.models.TokenUser"
    "TOKEN_USER_CLASS": "rest_framework_simplejwt.models.TokenUser",

    # 滑动刷新令牌的刷新过期时间声明，默认为"refresh_exp"
    "SLIDING_TOKEN_REFRESH_EXP_CLAIM": "refresh_exp",

    # 滑动刷新令牌的生命周期，默认为5分钟
    "SLIDING_TOKEN_LIFETIME": timedelta(minutes=5),

    # 滑动刷新令牌的刷新生命周期，默认为1天
    "SLIDING_TOKEN_REFRESH_LIFETIME": timedelta(days=1),

    # 普通令牌获取序列化器，默认为"rest_framework_simplejwt.serializers.TokenObtainPairSerializer"
    "TOKEN_OBTAIN_SERIALIZER": "rest_framework_simplejwt.serializers.TokenObtainPairSerializer",

    # 令牌刷新序列化器，默认为"rest_framework_simplejwt.serializers.TokenRefreshSerializer"
    "TOKEN_REFRESH_SERIALIZER": "rest_framework_simplejwt.serializers.TokenRefreshSerializer",

    # 令牌验证序列化器，默认为"rest_framework_simplejwt.serializers.TokenVerifySerializer"
    "TOKEN_VERIFY_SERIALIZER": "rest_framework_simplejwt.serializers.TokenVerifySerializer",

    # 令牌加入黑名单序列化器，默认为"rest_framework_simplejwt.serializers.TokenBlacklistSerializer"
    "TOKEN_BLACKLIST_SERIALIZER": "rest_framework_simplejwt.serializers.TokenBlacklistSerializer",

    # 是否检查撤销令牌，默认为False
    "CHECK_REVOKE_TOKEN": False,

    # 撤销令牌的声明，默认为"hash_password"
    "REVOKE_TOKEN_CLAIM": "hash_password",
}


IMPORT_STRINGS = (
    # 认证令牌类
    "AUTH_TOKEN_CLASSES",
    
    # JSON编码器
    "JSON_ENCODER",
    
    # 令牌用户类
    "TOKEN_USER_CLASS",
    
    # 用户认证规则
    "USER_AUTHENTICATION_RULE",
)

REMOVED_SETTINGS = (
    # 认证头部类型
    "AUTH_HEADER_TYPE",
    
    # 认证令牌类
    "AUTH_TOKEN_CLASS",
    
    # 密钥
    "SECRET_KEY",
    
    # 令牌后端类
    "TOKEN_BACKEND_CLASS",
)


# APISettings 类继承了 _APISettings 类，这是 Simple JWT 库中用于管理配置设置的基类。
class APISettings(_APISettings):  # pragma: no cover
    # __check_user_settings 方法是一个私有方法，用于检查用户设置是否包含已被删除的设置。
    # 它接受一个名为 user_settings 的字典参数，其中包含了用户在项目中自定义的配置设置。
    def __check_user_settings(self, user_settings: Dict[str, Any]) -> Dict[str, Any]:
        
        # 定义了一个名为 SETTINGS_DOC 的常量，该常量包含了配置文档的链接，用户可以在文档中查看可用设置。
        SETTINGS_DOC = "https://django-rest-framework-simplejwt.readthedocs.io/en/latest/settings.html"
		
        # 遍历名为 REMOVED_SETTINGS 的列表，该列表包含了已被删除的设置的名称。
        for setting in REMOVED_SETTINGS:
            # 对于每个已被删除的设置
            if setting in user_settings:
                # 如果它在用户设置中存在，就会引发一个 RuntimeError 异常，提供相应的错误消息
                # 告诉用户该设置已被删除，并提供文档链接供用户查看可用设置。
                raise RuntimeError(
                    format_lazy(
                        _(
                            "The '{}' setting has been removed. Please refer to '{}' for available settings."
                        ),
                        setting,
                        SETTINGS_DOC,
                    )
                )
		# 如果用户设置中不包含任何已被删除的设置，方法将返回用户设置本身，没有进行任何修改。
        return user_settings


# 创建api_settings对象，用于管理Simple JWT的配置设置
api_settings = APISettings(USER_SETTINGS, DEFAULTS, IMPORT_STRINGS)

# 定义一个函数reload_api_settings，用于在配置发生更改时重新加载Simple JWT的配置设置
def reload_api_settings(*args, **kwargs) -> None:
    global api_settings

    setting, value = kwargs["setting"], kwargs["value"]

    # 如果配置发生更改，并且更改的配置项是"SIMPLE_JWT"
    if setting == "SIMPLE_JWT":
        # 重新创建api_settings对象，使用新的配置值
        api_settings = APISettings(value, DEFAULTS, IMPORT_STRINGS)

# 使用setting_changed.connect方法连接reload_api_settings函数，以便在配置发生更改时触发重新加载配置设置的操作
setting_changed.connect(reload_api_settings)
```

### （2）views

```python
class TokenViewBase(generics.GenericAPIView):
    # 这些类属性定义了视图的权限和身份验证类。
    # 它们都被设置为空，这意味着该视图不需要任何权限和身份验证。
    permission_classes = ()
    authentication_classes = ()
	
    # 定义序列化器类。serializer_class 可以直接设置，或者从 _serializer_class 指定的字符串中动态导入。
    # 如果指定了 serializer_class，将使用它；否则，将尝试根据 _serializer_class 导入相应的序列化器类。
    serializer_class = None
    _serializer_class = ""
	
    # 定义了身份验证领域（Realm），通常用于设置 WWW-Authenticate 头的值。
    www_authenticate_realm = "api"
	
    # 用于获取要用于序列化数据的序列化器类。
    # 这个方法允许根据需要灵活地选择序列化器。
    def get_serializer_class(self) -> Serializer:
        """
        If serializer_class is set, use it directly. Otherwise get the class from settings.
        """
		# 如果 serializer_class 已经设置，它将直接返回；
        if self.serializer_class:
            return self.serializer_class
        try:
            # 否则，它将尝试从 _serializer_class 导入相应的序列化器类。
            return import_string(self._serializer_class)
        except ImportError:
            msg = "Could not import serializer '%s'" % self._serializer_class
            raise ImportError(msg)
	
    # 用于返回 WWW-Authenticate 头的值，通常用于在身份验证失败时返回给客户端的响应头。
    # 它将 AUTH_HEADER_TYPES 中的第一个类型与 www_authenticate_realm 组合成头部值。
    def get_authenticate_header(self, request: Request) -> str:
        return '{} realm="{}"'.format(
            AUTH_HEADER_TYPES[0],
            self.www_authenticate_realm,
        )
	
    # 这个方法处理 HTTP POST 请求。
    def post(self, request: Request, *args, **kwargs) -> Response:
        
        # 它首先使用 get_serializer 方法获取序列化器实例，并将请求数据传递给序列化器进行验证。
        serializer = self.get_serializer(data=request.data)

        try:
            # 如果验证成功，它将返回一个包含序列化器验证数据的响应，状态码为 HTTP_200_OK。
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            # 如果序列化器验证失败，将引发异常并返回相应的错误响应
            raise InvalidToken(e.args[0])

        return Response(serializer.validated_data, status=status.HTTP_200_OK)

# 用于生成访问令牌（access token）和刷新令牌（refresh token）的 DRF 视图
class TokenObtainPairView(TokenViewBase):
    """
    # 这意味着 TokenObtainPairView 类继承了 TokenViewBase 类的属性和方法。
    # TokenViewBase 类似乎是一个通用的基础视图，用于处理令牌相关的操作。
    Takes a set of user credentials and returns an access and refresh JSON web
    token pair to prove the authentication of those credentials.
    """
	
    # _serializer_class 属性被设置为 api_settings.TOKEN_OBTAIN_SERIALIZER，这是一个用于生成令牌的序列化器类。
    # 在 TokenObtainPairView 中，这个序列化器将用于处理用户的凭证（通常是用户名和密码）并生成访问令牌和刷新令牌。
    _serializer_class = api_settings.TOKEN_OBTAIN_SERIALIZER
    	
    # post 方法：
    # TokenObtainPairView 类继承了 TokenViewBase 类的 post 方法，这个方法用于处理 HTTP POST 请求。
    # 在 post 方法中，它首先使用 _serializer_class 属性指定的序列化器来验证用户的凭证。
    # 如果验证成功，它将生成并返回访问令牌和刷新令牌的 JSON 响应，表示用户已成功登录并且可以使用这些令牌来进行后续请求。
    # 如果验证失败，它将返回相应的错误响应，通常包括错误消息。

# token_obtain_pair 视图函数通过 TokenObtainPairView.as_view() 创建
# 这允许你将该视图绑定到特定的 URL 路由，以便在需要时调用它来获取令牌
token_obtain_pair = TokenObtainPairView.as_view()


class TokenRefreshView(TokenViewBase):
    """
    # TokenRefreshView 类继承了 TokenViewBase 类的属性和方法。TokenViewBase 类似乎是一个通用的基础视图，用于处理令牌相关的操作
    Takes a refresh type JSON web token and returns an access type JSON web
    token if the refresh token is valid.
    """
	
    # _serializer_class 属性被设置为 api_settings.TOKEN_REFRESH_SERIALIZER，这是一个用于刷新令牌的序列化器类。
    # 在 TokenRefreshView 中，这个序列化器将用于处理刷新令牌，并生成新的访问令牌。
    _serializer_class = api_settings.TOKEN_REFRESH_SERIALIZER
    
    # post 方法：
    # TokenRefreshView 类继承了 TokenViewBase 类的 post 方法，这个方法用于处理 HTTP POST 请求。
    # 在 post 方法中，它首先使用 _serializer_class 属性指定的序列化器来验证刷新令牌。
    # 如果刷新令牌有效，它将生成并返回一个新的访问令牌的 JSON 响应，表示用户已成功刷新令牌并且可以使用新的访问令牌来进行后续请求。
    # 如果刷新令牌无效或过期，它将返回相应的错误响应，通常包括错误消息。

# token_refresh 视图函数通过 TokenRefreshView.as_view() 创建
# 这允许你将该视图绑定到特定的 URL 路由，以便在需要时调用它来刷新令牌
token_refresh = TokenRefreshView.as_view()


class TokenObtainSlidingView(TokenViewBase):
    """
    # TokenObtainSlidingView 类继承了 TokenViewBase 类的属性和方法。
    # TokenViewBase 类似乎是一个通用的基础视图，用于处理令牌相关的操作。
    Takes a set of user credentials and returns a sliding JSON web token to
    prove the authentication of those credentials.
    """
	
    # _serializer_class 属性被设置为 api_settings.SLIDING_TOKEN_OBTAIN_SERIALIZER，这是一个用于生成滑动令牌的序列化器类。
    # 在 TokenObtainSlidingView 中，这个序列化器将用于处理用户的凭证（通常是用户名和密码）并生成滑动令牌。
    _serializer_class = api_settings.SLIDING_TOKEN_OBTAIN_SERIALIZER
    	
    # post 方法：
    # TokenObtainSlidingView 类继承了 TokenViewBase 类的 post 方法，这个方法用于处理 HTTP POST 请求。
    # 在 post 方法中，它首先使用 _serializer_class 属性指定的序列化器来验证用户的凭证。
    # 如果验证成功，它将生成并返回一个滑动令牌的 JSON 响应，表示用户已成功登录并且可以使用滑动令牌来进行后续请求。
    # 滑动令牌具有自动刷新机制，只要用户保持活动状态，令牌就会自动延长其有效期。因此，不需要显式的令牌刷新操作。

# token_obtain_sliding 视图函数通过 TokenObtainSlidingView.as_view() 创建
# 这允许你将该视图绑定到特定的 URL 路由，以便在需要时调用它来获取滑动令牌。
token_obtain_sliding = TokenObtainSlidingView.as_view()


class TokenRefreshSlidingView(TokenViewBase):
    """
    Takes a sliding JSON web token and returns a new, refreshed version if the
    token's refresh period has not expired.
    """
	
    # _serializer_class 属性被设置为 api_settings.SLIDING_TOKEN_REFRESH_SERIALIZER，这是一个用于刷新滑动令牌的序列化器类。
    # 在 TokenRefreshSlidingView 中，这个序列化器将用于处理滑动令牌并生成新的滑动令牌。
    _serializer_class = api_settings.SLIDING_TOKEN_REFRESH_SERIALIZER
    	
    # post 方法：
    # TokenRefreshSlidingView 类继承了 TokenViewBase 类的 post 方法，这个方法用于处理 HTTP POST 请求。
    # 在 post 方法中，它首先使用 _serializer_class 属性指定的序列化器来验证滑动令牌。
    # 如果滑动令牌的刷新期限尚未过期，它将生成并返回一个新的滑动令牌的 JSON 响应，表示用户的滑动令牌已成功刷新并且可以使用新的滑动令牌来进行后续请求。
    # 如果滑动令牌的刷新期限已过期，它将返回相应的错误响应，通常包括错误消息。

# token_refresh_sliding 视图函数通过 TokenRefreshSlidingView.as_view() 创建
# 这允许你将该视图绑定到特定的 URL 路由，以便在需要时调用它来刷新滑动令牌。
token_refresh_sliding = TokenRefreshSlidingView.as_view()


class TokenVerifyView(TokenViewBase):
    """
    Takes a token and indicates if it is valid.  This view provides no
    information about a token's fitness for a particular use.
    """
	
    # _serializer_class 属性被设置为 api_settings.TOKEN_VERIFY_SERIALIZER，这是一个用于验证令牌的序列化器类。
    # 在 TokenVerifyView 中，这个序列化器将用于验证用户提供的令牌是否有效。
    _serializer_class = api_settings.TOKEN_VERIFY_SERIALIZER
    
    # post 方法：
    # TokenVerifyView 类继承了 TokenViewBase 类的 post 方法，这个方法用于处理 HTTP POST 请求。
    # 在 post 方法中，它首先使用 _serializer_class 属性指定的序列化器来验证用户提供的令牌。
    # 如果令牌有效，它将返回一个成功的响应，表示令牌是有效的。
    # 如果令牌无效，它将返回相应的错误响应，通常包括错误消息。

# token_verify 视图函数通过 TokenVerifyView.as_view() 创建
# 这允许你将该视图绑定到特定的 URL 路由，以便在需要时调用它来验证令牌的有效性。
token_verify = TokenVerifyView.as_view()


class TokenBlacklistView(TokenViewBase):
    """
    Takes a token and blacklists it. Must be used with the
    `rest_framework_simplejwt.token_blacklist` app installed.
    """
	
    # _serializer_class 属性被设置为 api_settings.TOKEN_BLACKLIST_SERIALIZER
    # 这是一个用于将令牌加入黑名单的序列化器类。
    # 在 TokenBlacklistView 中，这个序列化器将用于处理用户提供的令牌并将其标记为黑名单中的无效令牌。
    _serializer_class = api_settings.TOKEN_BLACKLIST_SERIALIZER
    
    # post 方法：
    # TokenBlacklistView 类继承了 TokenViewBase 类的 post 方法，这个方法用于处理 HTTP POST 请求。
    # 在 post 方法中，它首先使用 _serializer_class 属性指定的序列化器来处理用户提供的令牌，并将其标记为黑名单中的无效令牌。
    # 加入黑名单的令牌将无法再用于进行有效的身份验证，从而有效地注销用户或限制其访问权限。

# token_blacklist 视图函数通过 TokenBlacklistView.as_view() 创建
# 这允许你将该视图绑定到特定的 URL 路由，以便在需要时调用它来将令牌加入黑名单。
token_blacklist = TokenBlacklistView.as_view()
```

### （3）serializers

```python
# 创建一个类型变量AuthUser，用于表示用户对象，可以是AbstractBaseUser或TokenUser
AuthUser = TypeVar("AuthUser", AbstractBaseUser, TokenUser)

# 如果启用了TOKEN_BLACKLIST设置，导入相关模块
if api_settings.BLACKLIST_AFTER_ROTATION:
    from .token_blacklist.models import BlacklistedToken

# 自定义密码字段，用于输入密码
# 输入密码，并将输入字段的input_type样式设置为"password"，以确保在前端表单中显示密码输入框。
class PasswordField(serializers.CharField):
    def __init__(self, *args, **kwargs) -> None:
        kwargs.setdefault("style", {})
        # 设置格式为 password
        kwargs["style"]["input_type"] = "password"
        # 设置只写属性
        kwargs["write_only"] = True
        # 调用父类初始化
        super().__init__(*args, **kwargs)

# TokenObtainSerializer类，用于验证用户并获取令牌
class TokenObtainSerializer(serializers.Serializer):
    # 用户名字段，默认为用户模型中的用户名字段
    username_field = get_user_model().USERNAME_FIELD
    # 令牌类，默认为None
    token_class: Optional[Type[Token]] = None

    # 默认错误消息，用于自定义错误消息
    default_error_messages = {
        "no_active_account": _("No active account found with the given credentials")
    }

    def __init__(self, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)

        # 添加用户名字段和密码字段到序列化器中
        self.fields[self.username_field] = serializers.CharField(write_only=True)
        self.fields["password"] = PasswordField()

    # 验证方法，用于验证用户凭证
    def validate(self, attrs: Dict[str, Any]) -> Dict[Any, Any]:
        authenticate_kwargs = {
            self.username_field: attrs[self.username_field],
            "password": attrs["password"],
        }
        try:
            authenticate_kwargs["request"] = self.context["request"]
        except KeyError:
            pass

        self.user = authenticate(**authenticate_kwargs)

        # 检查用户是否满足自定义的用户验证规则
        if not api_settings.USER_AUTHENTICATION_RULE(self.user):
            raise exceptions.AuthenticationFailed(
                self.error_messages["no_active_account"],
                "no_active_account",
            )

        return {}

    # 获取令牌的方法，用于返回用户的令牌
    @classmethod
    def get_token(cls, user: AuthUser) -> Token:
        return cls.token_class.for_user(user)  # type: ignore

# TokenObtainPairSerializer类，用于获取访问令牌和刷新令牌对
# 这就是为什么拿到签发的结果中包含一个 refresh token 和 access token
class TokenObtainPairSerializer(TokenObtainSerializer):
    token_class = RefreshToken

    def validate(self, attrs: Dict[str, Any]) -> Dict[str, str]:
        data = super().validate(attrs)

        refresh = self.get_token(self.user)

        data["refresh"] = str(refresh)
        data["access"] = str(refresh.access_token)

        # 如果配置要求更新最后登录时间，则执行更新操作
        if api_settings.UPDATE_LAST_LOGIN:
            update_last_login(None, self.user)

        return data

# TokenObtainSlidingSerializer类，用于获取滑动令牌
class TokenObtainSlidingSerializer(TokenObtainSerializer):
    token_class = SlidingToken

    def validate(self, attrs: Dict[str, Any]) -> Dict[str, str]:
        data = super().validate(attrs)

        token = self.get_token(self.user)

        data["token"] = str(token)

        # 如果配置要求更新最后登录时间，则执行更新操作
        if api_settings.UPDATE_LAST_LOGIN:
            update_last_login(None, self.user)

        return data

# TokenRefreshSerializer类，用于刷新访问令牌
class TokenRefreshSerializer(serializers.Serializer):
    refresh = serializers.CharField()
    access = serializers.CharField(read_only=True)
    token_class = RefreshToken

    def validate(self, attrs: Dict[str, Any]) -> Dict[str, str]:
        refresh = self.token_class(attrs["refresh"])

        data = {"access": str(refresh.access_token)}

        # 如果配置要求轮换刷新令牌，执行相应的操作
        if api_settings.ROTATE_REFRESH_TOKENS:
            if api_settings.BLACKLIST_AFTER_ROTATION:
                try:
                    # 尝试将刷新令牌加入黑名单
                    refresh.blacklist()
                except AttributeError:
                    # 如果没有安装黑名单应用，'blacklist'方法将不会存在
                    pass

            refresh.set_jti()
            refresh.set_exp()
            refresh.set_iat()

            data["refresh"] = str(refresh)

        return data

# TokenRefreshSlidingSerializer类，用于刷新滑动令牌
class TokenRefreshSlidingSerializer(serializers.Serializer):
    token = serializers.CharField()
    token_class = SlidingToken

    def validate(self, attrs: Dict[str, Any]) -> Dict[str, str]:
        token = self.token_class(attrs["token"])

        # 检查"refresh_exp"声明中的时间戳是否已过期
        token.check_exp(api_settings.SLIDING_TOKEN_REFRESH_EXP_CLAIM)

        # 更新"exp"和"iat"声明
        token.set_exp()
        token.set_iat()

        return {"token": str(token)}

# TokenVerifySerializer类，用于验证令牌的有效性
class TokenVerifySerializer(serializers.Serializer):
    token = serializers.CharField(write_only=True)

    def validate(self, attrs: Dict[str, None]) -> Dict[Any, Any]:
        token = UntypedToken(attrs["token"])

        # 如果启用了令牌黑名单，并且在已安装应用列表中，检查令牌是否被列入黑名单
        if (
            api_settings.BLACKLIST_AFTER_ROTATION
            and "rest_framework_simplejwt.token_blacklist" in settings.INSTALLED_APPS
        ):
            jti = token.get(api_settings.JTI_CLAIM)
            if BlacklistedToken.objects.filter(token__jti=jti).exists():
                raise ValidationError("Token is blacklisted")

        return {}

# TokenBlacklistSerializer类，用于将令牌列入黑名单
class TokenBlacklistSerializer(serializers.Serializer):
    refresh = serializers.CharField(write_only=True)
    token_class = RefreshToken

    def validate(self, attrs: Dict[str, Any]) -> Dict[Any, Any]:
        refresh = self.token_class(attrs["refresh"])
        try:
            refresh.blacklist()
        except AttributeError:
            pass
        return {}
```

