---
title: "Django 配置参数的作用"
published: 2023-08-07 14:08:00
category: Web 开发
series: "DRF 基础"
seriesOrder: 20
hubs: ["drf-basics"]
---

# Settings.py中的配置的作用

# 【1】路径相关

```python
# pathlib : 3.8+以后的模块，跟路径相关
from pathlib import Path

# （1）项目根目录路径
BASE_DIR = Path(__file__).resolve().parent.parent
```

- 上述内容是在Django项目配置文件中使用pathlib模块设置项目根目录路径的操作。

- 在Python 3.8及更高版本中，pathlib模块提供了一种简洁且面向对象的方式来处理文件路径。
  - 它能够跨不同操作系统（如Windows、Linux等）自动适配路径分隔符，并提供了一系列方法用于操作和查询文件路径。
- 该代码中的BASE_DIR变量使用Path类创建一个路径对象，通过`__file__`获取当前文件的绝对路径。
  - `resolve()`方法将路径解析成绝对路径，`parent`属性获取父级路径，再次调用`parent`属性获取上一级目录，即项目的根目录路径。
- 使用BASE_DIR可以方便地引用项目中的其他文件或目录，比如静态文件、模板文件、数据库文件等。
- 这样做的好处是，无论项目在哪个环境下运行，都可以通过相对路径来访问这些文件，而不需要担心具体的操作系统路径差异。
- 总之，通过使用pathlib的Path类操作项目根路径，能够提高代码的可读性和可移植性，减少对特定操作系统的依赖性。

# 【2】加密相关

```python
# （2）秘钥：Django中涉及到加密的部分都会用到这个秘钥，加密方式比较复杂且每次启动随机生成
SECRET_KEY = 'django-insecure-l5+%*wz-9y$asd877eevfeub7#n^(2d9iht0unjdr^c%_2!$9e'
```

- 上述内容是Django项目配置文件中的SECRET_KEY参数设置。
  - SECRET_KEY是一个用于加密和验证敏感信息的密钥
  - 通常在Django中涉及到加密的部分都会使用这个秘钥。
- SECRET_KEY是用于保护Django项目的安全性的关键元素。
  - 它被用于生成和校验令牌、加密用户密码、生成会话ID等重要操作。
  - 使用复杂的密钥可以增加系统的安全性，因为相同的密钥被多个应用程序使用时，即使一个应用程序的密钥被泄露，其他应用程序依然能继续保持安全。
  - 由于加密方式比较复杂，每次启动项目时会随机生成一个新的密钥。
- 在实际应用中，SECRET_KEY需要保密，并妥善保存。
  - 泄露SECRET_KEY可能导致恶意攻击者能够更容易地破解加密的数据或进行其他危害系统安全的行为。
  - 因此，在项目部署和维护过程中，务必要确保SECRET_KEY的安全性。

# 【3】DEBUG模式相关

```python
# （3）DEBUG模式：
# 为 True 时，启动项目，访问项目的地址时，如果发生错误会将错误完全展示给前端(开发人员检查错误的方式之一)
# 为 False 时，启动项目，访问项目的地址时，如果发生错误会将错误隐藏，只展示500页面(项目上线时，修改为False)
DEBUG = True
```

- 上述内容是一个调试模式(DEBUG mode)的设置说明。
  - 在一个项目的配置文件中，通常会有一个名为DEBUG的参数，用来控制项目是否处于调试模式。
- 当DEBUG设置为True时
  - 启动项目并访问项目的地址时，如果发生错误，错误信息会完全展示给前端用户
  - 这对开发人员来说非常有用，因为他们可以直接在浏览器中查看错误详细信息，并进行调试和修正。
- 当DEBUG设置为False时
  - 启动项目并访问项目的地址时，如果发生错误，错误信息会被隐藏，只会展示一个通用的404页面。
  - 这种做法适用于将项目部署到生产环境中时，主要是为了避免将敏感信息或技术细节暴露给终端用户。
- 一般来说
  - 在项目从开发环境迁移到生产环境时，需要将DEBUG设置为False，以确保错误信息不会泄露给未授权的用户。
  - 这样做的目的是保护系统的安全性和保密性。

# 【4】地址相关

```python
# （4）项目是要部署在某个服务器上的，列表内填写指定服务器地址,*代表任意地址
ALLOWED_HOSTS = []
```

- 上述代码是在Django项目的配置文件中设置允许访问该项目的服务器地址列表。

- ALLOWED_HOSTS变量是一个空列表，用于存储允许访问该项目的服务器地址。
  - 在部署Django项目时，为了增加安全性，Django默认要求在settings.py文件中明确指定允许访问的服务器地址。
- 服务器地址可以是具体的IP地址或域名，可以使用字符串来表示。
  - 如果想要允许任意地址访问该项目，则可以在ALLOWED_HOSTS中添加通配符`'*'`。
- 举个例子
  - 假设要允许两个服务器（192.168.0.1和example.com）访问该项目
  - 那么ALLOWED_HOSTS可以设置为：

```
ALLOWED_HOSTS = ['192.168.0.1', 'example.com']
```

- 而如果希望允许任意地址访问该项目
  - 则可以将ALLOWED_HOSTS设置为：

```
ALLOWED_HOSTS = ['*']
```

- 注意，尽管使用`'*'`可以允许任意地址访问项目，但在实际部署中，建议仅将ALLOWED_HOSTS设置为可信的、确切的服务器地址，以增加安全性和防止恶意访问。

# 【5】APP相关

```python
# （5）注册的APP
INSTALLED_APPS = [
    # 后台管理APP，后台的表一般属于其他APP
    'django.contrib.admin',
    # auth模块，UserInfo表，里面有六张表
    'django.contrib.auth',
    # 有一张 contenttypes 表
    'django.contrib.contenttypes',
    # 有关 session信息的表
    'django.contrib.sessions',
    # 消息框架
    'django.contrib.messages',
    # 静态文件开启的APP
    'django.contrib.staticfiles',
    # 自定义APP
    'app01',
]
```

- `'django.contrib.admin'`: 
  - 这是Django自带的后台管理应用程序，它提供了一个可视化的管理界面，用于管理网站的各种数据模型。
- `'django.contrib.auth'`: 
  - 这个应用程序提供了认证和授权功能。
  - 其中包含一个名为`UserInfo`的模型表，该表用于存储用户的身份验证和授权相关信息。
  - 此外，还包含其他与用户身份验证相关的六张表。
- `'django.contrib.contenttypes'`: 
  - 这个应用程序提供了用于跟踪模型上下文的功能。
  - 其中包含一个名为`contenttypes`的表，用于存储模型的元数据信息。
- `'django.contrib.sessions'`: 
  - 这个应用程序提供了处理会话（session）的功能。
  - 它可以存储和检索与特定用户会话相关的数据。
- `'django.contrib.messages'`: 
  - 这个应用程序提供了消息传递机制，用于向用户显示临时性的一次性消息
  - 例如成功消息或错误消息。
- `'django.contrib.staticfiles'`: 
  - 这个应用程序用于处理静态文件
  - 例如CSS、JavaScript和图像等。
  - 它提供了一个处理和提供这些静态文件的方法。
- `'app01'`: 
  - 这是自定义的应用程序
  - 可以根据实际情况进行命名，并在其中编写特定功能的代码。

# 【6】中间件相关

```python
MIDDLEWARE = [
    # 安全相关
    'django.middleware.security.SecurityMiddleware',
    # session 相关
    'django.contrib.sessions.middleware.SessionMiddleware',
    # 公共相关：URL重写/静态文件相关
    'django.middleware.common.CommonMiddleware',
    # 防止跨站请求伪造（CSRF）攻击
    'django.middleware.csrf.CsrfViewMiddleware',
    # 处理用户认证
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    # 处理并传递消息给用户
    'django.contrib.messages.middleware.MessageMiddleware',
    # 设置 HTTP 头信息限制网页
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

```

- `django.middleware.security.SecurityMiddleware`：
  - 该中间件通过一些安全策略（如HTTP安全头）来增强应用程序的安全性。

- `django.contrib.sessions.middleware.SessionMiddleware`：
  - 该中间件为每个请求提供会话支持，使得应用程序可以跟踪用户的会话状态。

- `django.middleware.common.CommonMiddleware`：
  - 该中间件提供了一些常用的功能，如URL重写和处理静态文件。

- `django.middleware.csrf.CsrfViewMiddleware`：
  - 该中间件用于防止跨站请求伪造（CSRF）攻击。

- `django.contrib.auth.middleware.AuthenticationMiddleware`：
  - 该中间件处理用户认证，为每个请求关联相应的用户对象。

- `django.contrib.messages.middleware.MessageMiddleware`：
  - 该中间件用于在渲染模板时处理并传递消息给用户。

- `django.middleware.clickjacking.XFrameOptionsMiddleware`：
  - 该中间件提供了点击劫持保护，通过设置 HTTP 头信息限制网页在 iframe 中的使用。


# 【7】根路由相关

```python
# 指定根路由位置
ROOT_URLCONF = 'day05.urls'
```

- 上述代码是在Django项目的配置文件中指定了项目的根路由位置。

- ROOT_URLCONF变量用于定义Django项目的主路由配置模块。
  - 该变量的值应为一个字符串，指定包含项目URL映射规则的模块路径。
- 在给定的示例中
  - 'day05.urls'是指定的根路由位置。
  - 这意味着Django将在名为'day05'的Python模块中查找名为'urls'的URL映射规则。
- 通常
  - 在Django项目中，可以通过创建一个名为'urls.py'的模块来定义URL映射规则。
  - 这个模块可以放在项目的根目录或某个应用目录中。
  - 然后，使用ROOT_URLCONF变量来指定这个模块的路径。
- 例如
  - 如果在项目的根目录中存在一个名为'urls.py'的模块
  - 则可以将ROOT_URLCONF设置为：

```
ROOT_URLCONF = 'urls'
```

- 或者
  - 如果将'urls.py'模块放在名为'day05'的应用目录中
  - 则可以将ROOT_URLCONF设置为：

```
ROOT_URLCONF = 'day05.urls'
```

- 通过设置正确的根路由位置，Django能够正确地解析和处理项目中的URL请求，并调用相应的视图函数。

# 【8】模版文件所在路径

```python
# 模版文件所在路径
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        # 必须是列表
        'DIRS': [BASE_DIR / 'templates']
        ,
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]
```

- 上述代码片段是Django项目的配置文件中的TEMPLATES设置，它用于指定模板文件所在的路径。

- 在Django中，模板文件用于定义网页的结构和呈现逻辑。
  - Django的模板系统可以通过配置来确定模板文件所在的路径。
- 在给定的示例中
  - TEMPLATES是一个列表，其中包含了一个字典作为配置选项。
  - 这个字典中的'DIRS'键用于指定模板文件所在的路径。
  - 在示例中，指定了一个路径，即BASE_DIR / 'templates'。
- BASE_DIR是Django项目的根目录路径，可以在项目的配置文件中定义。
  - 'templates'是一个目录名称，用于存放模板文件。
- 因此，上述代码表示在Django项目中，将模板文件放置在根目录下的一个名为'templates'的子目录中。

- 使用上述配置后
  - Django的模板加载器将会在指定的路径中搜索模板文件。
  - 当需要使用模板时，可以在视图函数或其他地方引用模板文件，并根据配置的模板路径进行查找和加载。

# 【9】项目上线相关

```python
# 项目上线时运行项目的地址
WSGI_APPLICATION = 'day05.wsgi.application'
```

- 上述代码片段是Django项目的配置文件中的WSGI（Web Server Gateway Interface）应用程序配置。

- 在示例中
  - WSGI_APPLICATION变量指定了项目在上线时运行的应用程序地址。
- 'day05.wsgi.application'是一个字符串
  - 它指定了项目的WSGI应用程序所在的模块路径。
- 具体来说
  - 'day05'指代了项目的根目录或设置文件所在的位置
  - 而'wsgi'是项目中定义WSGI应用程序的模块名称。
- 通过指定WSGI_APPLICATION
  - Django框架能够找到并加载该模块，以便在项目上线时启动并运行应用程序。
- 请注意，具体的地址和模块名称可能会因项目结构而有所不同，这里只是基于示例给出了一种典型的配置方式。

- 根据实际项目的目录结构和命名规范，需要修改WSGI_APPLICATION的值以正确指定项目的WSGI应用程序位置。

# 【10】数据库相关

```python
# 数据库相关相关配置文件
# （1）sqlite3 作为数据库
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# （2）MySQL作为数据库
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': '数据库名',
        'USER': '用户名',
        'PASSWORD': '密码',
        'HOST': '数据库地址',
        'PORT': 端口,
        'CHARSET': '字符编码集',
    }
}

```

- SQLite3作为数据库：

  - 在这种配置下，Django将使用SQLite3作为默认的数据库引擎。
  - 相关配置信息如下：
  - 'ENGINE': 'django.db.backends.sqlite3'：
    - 指定数据库引擎为SQLite3。

  - 'NAME': BASE_DIR / 'db.sqlite3'：
    - 指定数据库文件的路径和名称。


  - 在该示例中
    - 数据库文件将存放在项目的根目录下，并命名为'db.sqlite3'。

- MySQL作为数据库：
  - 在这种配置下，Django将使用MySQL作为数据库引擎。
  - 相关配置信息如下：
  - 'ENGINE': 'django.db.backends.mysql'：
    - 指定数据库引擎为MySQL。
  - 'NAME': '数据库名'：
    - 指定要连接的MySQL数据库的名称。
  - 'USER': '用户名'：
    - 指定连接数据库所使用的用户名。
  - 'PASSWORD': '密码'：
    - 指定连接数据库所使用的密码。
  - 'HOST': '数据库地址'：
    - 指定连接数据库所使用的主机地址。
    - 可以填写IP地址或域名。
  - 'PORT': 端口：
    - 指定连接数据库所使用的端口号。
  - 'CHARSET': '字符编码集'：
    - 指定数据库所采用的字符编码集。

# 【11】身份验证密码验证器相关

```python
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

```

- 以上代码片段是Django项目的身份验证密码验证器配置。

- 在Django中，密码验证器用于验证和强化用户设置的密码。
  - 密码验证器可以检查密码的相似性、最小长度、常见密码以及数字密码等方面的安全要求。
- 该代码片段中的配置指定了四个密码验证器，其详细解释如下：


- UserAttributeSimilarityValidator：
   - 名称：'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'
   - 功能：检查密码是否过于类似于与用户相关的属性 (例如用户名、电子邮件地址)。
   - 作用：防止用户将与他们的个人信息密切相关的属性作为密码。

- MinimumLengthValidator：
   - 名称：'django.contrib.auth.password_validation.MinimumLengthValidator'
   - 功能：检查密码的最小长度。
   - 作用：要求用户设置的密码必须满足最小长度要求，以提高密码的安全性。

- CommonPasswordValidator：
   - 名称：'django.contrib.auth.password_validation.CommonPasswordValidator'
   - 功能：检查密码是否为常见的密码。
   - 作用：防止用户使用容易被猜到的常见密码，以增加密码的安全性。

- NumericPasswordValidator：
   - 名称：'django.contrib.auth.password_validation.NumericPasswordValidator'
   - 功能：检查密码中是否包含数字字符。
   - 作用：通过要求密码中包含数字字符，进一步增加密码的安全性。

- 通过配置这些密码验证器，您可以自定义密码的验证规则，并提高用户设置的密码的安全性。
- 您可以根据需要添加、删除或调整这些验证器以满足特定的密码策略要求。

# 【12】语言国际化相关

```python
# 语言 zh-hans(中文)
LANGUAGE_CODE = 'en-us'
# 时区 Asia/Shanghai(上海时区)
TIME_ZONE = 'UTC'
# 
USE_I18N = True

USE_L10N = True
# 是否使用 TIME_ZONE 时间
USE_TZ = True
```

- 以上代码片段是Django项目的配置文件中的语言、时区和国际化设置。


- LANGUAGE_CODE：
   - 语言代码：'en-us'
   - 作用：指定项目使用的语言。在此示例中，语言代码为英文（美国）。
   - 说明：这个设置决定了Django如何处理本地化内容，包括日期、时间、数字格式等。如果您想要切换到其他语言，只需将该设置更改为相应的语言代码，例如'zh-hans'表示简体中文。

- TIME_ZONE：
   - 时区：'UTC'
   - 作用：指定项目的默认时间区域。在此示例中，时区为协调世界时（UTC）。
   - 说明：该设置决定了Django如何处理日期和时间，以及如何将它们转换为用户所在的本地时区。如果您的项目需要使用其他时区，请将该设置更改为相应的时区名称，例如'Asia/Shanghai'表示上海时区。

- USE_I18N：
   - 值：True
   - 作用：指定是否启用国际化支持（Internationalization，简称i18n）。
   - 说明：国际化是一种将应用程序本地化以适应不同语言和地区的能力。启用国际化支持后，您可以使用Django提供的工具来管理不同语言的翻译文本，并在应用程序中进行语言切换。

- USE_L10N：
   - 值：True
   - 作用：指定是否启用本地化支持（Localization，简称l10n）。
   - 说明：本地化是将应用程序的内容适应不同地区的能力，例如数字格式、日期格式等。启用本地化支持后，Django将按照指定的语言和地区设置来处理这些内容。

- USE_TZ：
   - 值：True
   - 作用：指定是否使用时区。
   - 说明：当启用时区支持时，Django会将日期和时间存储为UTC（协调世界时），并在渲染页面时根据用户所在的时区进行自动转换。这样可以确保在不同时区之间正确显示日期和时间。

- 通过配置这些设置，您可以根据项目需求来调整语言、时区以及国际化和本地化的支持，以提供更好的用户体验。
- 如果需要更改任何设置，请直接修改对应的值即可。

# 【13】静态文件相关

```python
# 静态文件位置
STATIC_URL = '/static/'
```

- 以上代码片段是Django项目的配置文件中关于静态文件位置的设置。


- STATIC_URL：
  - 值：'/static/'

  - 作用：指定了静态文件在URL中的访问路径。

  - 说明：静态文件包括CSS样式表、JavaScript脚本和图片等不经常变化的文件。当浏览器请求这些文件时，Django将使用STATIC_URL来构建静态文件的URL路径。在上述示例中，静态文件的URL路径将以'/static/'开头。


- 在一个典型的Django项目中，您可以在项目的根目录下创建一个名为'static'的文件夹，并在该文件夹中组织您的静态文件。
  - 例如，可以在'static'文件夹下创建一个名为'mystyle.css'的CSS文件。
- 当您在HTML模板中需要引用静态文件时，可以使用Django模板语言的静态文件标签。
  - 例如，如果要在模板中引用上述示例中的'mystyle.css'文件，可以使用以下代码：

```html
<link rel="stylesheet" href="{% static 'mystyle.css' %}">
```

- 在模板被渲染为HTML页面时，Django将自动根据STATIC_URL和静态文件的路径构建正确的URL，并将其插入到HTML代码中。

- 通过配置STATIC_URL，您可以轻松地定义静态文件的URL路径，并确保正确地在HTML模板中引用这些静态文件，从而使您的网页能够加载和显示所需的静态资源。

# 【14】主键自增相关

```python
# 在表中默认不写ID，ID主键自增，之前全是AutoField，长度较短
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
```

- 以上代码片段是Django项目的配置文件中关于默认主键字段的设置。

- DEFAULT_AUTO_FIELD：
  - 值：'django.db.models.BigAutoField'

  - 作用：指定了默认的主键字段类型。

  - 说明：在Django 3.2版本之前，默认的主键字段类型是AutoField，长度较短。从Django 3.2版本开始，默认的主键字段类型被更改为了BigAutoField，长度更长。


- 主键字段是一种用于唯一标识数据库表中每一行数据的字段。
  - 默认情况下，Django为每个模型自动添加一个名为'id'的主键字段，并将其类型设置为AutoField。
  - AutoField类型的字段使用整数来表示主键，并且具有较短的最大长度限制。
- 然而，当主键字段所需的最大长度超过AutoField的限制时
  - 例如使用PostgreSQL数据库时，就需要将默认的主键字段类型设置为更长的类型，即BigAutoField。
- 通过设置DEFAULT_AUTO_FIELD为'django.db.models.BigAutoField'，您可以确保在创建表时的主键字段类型为BigAutoField。
  - 这样，当使用PostgreSQL等数据库时，主键字段的最大长度将被扩展，并能满足更长的要求。
- 请注意
  - 在旧版本的Django中，您也可以手动为每个模型指定BigAutoField作为主键字段类型
  - 而不是依赖于默认值的更改。例如：

```python
from django.db import models

class MyModel(models.Model):
    id = models.BigAutoField(primary_key=True)
    # 其他字段...
```

- 总结：
  - 通过设置DEFAULT_AUTO_FIELD为'django.db.models.BigAutoField'
  - 您可以将默认的主键字段类型设置为更长的BigAutoField
  - 在需要更大长度的情况下使用更可靠的主键字段类型。































































