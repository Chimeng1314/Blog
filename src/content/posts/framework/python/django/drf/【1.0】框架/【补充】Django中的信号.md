---
title: "Django 中的信号"
published: 2024-10-31 14:00:00
category: Web 开发
series: "DRF 基础"
seriesOrder: 22
hubs: ["drf-basics"]
---

# 【一】Django中的信号

- Django中的信号是一种机制，用于在特定事件发生时自动触发相关的操作或函数。
  - 通过使用信号，可以实现模块间的解耦和事件驱动的编程。
- 在Django中，有两种类型的信号：内置信号和自定义信号。

# 【二】内置信号

- Django提供了许多内置信号，以便我们在与数据库交互、处理请求和响应等方面执行特定的操作。

```python
#Model signals
pre_init                    # django的modal执行其构造方法前，自动触发
post_init                   # django的modal执行其构造方法后，自动触发
pre_save                    # django的modal对象保存前，自动触发
post_save                   # django的modal对象保存后，自动触发
pre_delete                  # django的modal对象删除前，自动触发
post_delete                 # django的modal对象删除后，自动触发
m2m_changed                 # django的modal中使用m2m字段操作第三张表（add,remove,clear）前后，自动触发
class_prepared              # 程序启动时，检测已注册的app中modal类，对于每一个类，自动触发
Management signals
pre_migrate                 # 执行migrate命令前，自动触发
post_migrate                # 执行migrate命令后，自动触发
Request/response signals
request_started             # 请求到来前，自动触发
request_finished            # 请求结束后，自动触发
got_request_exception       # 请求异常后，自动触发
Test signals
setting_changed             # 使用test测试修改配置文件时，自动触发
template_rendered           # 使用test测试渲染模板时，自动触发
Database Wrappers
connection_created          # 创建数据库连接时，自动触发
```

```python
from django.db.models.signals import pre_save
from django.dispatch import receiver
@receiver(pre_save)
def my_callback(sender, **kwargs):
    print("对象创建成功")
    print(sender)
    print(kwargs)
```

## 1. Model signals（模型信号）

- `pre_init`：在执行模型的构造函数之前触发。这个信号可以在实例化一个模型对象之前执行一些操作，比如设置默认值。

  ```python
  @receiver(pre_init, sender=MyModel)
  def pre_init_callback(sender, **kwargs):
      print("Before initializing MyModel instance.")
  ```

- `post_init`：在执行模型的构造函数之后触发。这个信号允许在实例化一个模型对象之后执行一些操作，比如初始化关联对象。

  ```python
  @receiver(post_init, sender=MyModel)
  def post_init_callback(sender, instance, **kwargs):
      print(f"After initializing {instance} instance.")
  ```

- `pre_save`：在保存模型对象之前触发。这个信号可以用于在保存模型对象之前进行一些预处理或验证操作。

  ```python
  @receiver(pre_save, sender=MyModel)
  def pre_save_callback(sender, instance, **kwargs):
      print(f"Before saving {instance} instance.")
  ```

- `post_save`：在保存模型对象之后触发。这个信号可以用于在保存模型对象之后执行一些后处理操作。

  ```python
  @receiver(post_save, sender=MyModel)
  def post_save_callback(sender, instance, created, **kwargs):
      if created:
          print(f"New {instance} instance has been saved.")
      else:
          print(f"{instance} instance has been updated.")
  ```

- `pre_delete`：在删除模型对象之前触发。这个信号可以用于执行一些与删除关联的操作。

  ```python
  @receiver(pre_delete, sender=MyModel)
  def pre_delete_callback(sender, instance, **kwargs):
      print(f"Before deleting {instance} instance.")
  ```

- `post_delete`：在删除模型对象之后触发。这个信号可以用于执行一些与删除关联的操作。

  ```python
  @receiver(post_delete, sender=MyModel)
  def post_delete_callback(sender, instance, **kwargs):
      print(f"{instance} instance has been deleted.")
  ```

- `m2m_changed`：当使用Many-to-Many字段操作第三张中间表时触发，比如add、remove和clear等操作。这个信号可以用于在修改Many-to-Many关系时进行额外的处理操作。

  ```python
  @receiver(m2m_changed, sender=MyModel.m2m_field.through)
  def m2m_changed_callback(sender, instance, action, reverse, **kwargs):
      if action == "pre_add":
          print(f"Adding related objects to {instance}.")
      elif action == "pre_remove":
          print(f"Removing related objects from {instance}.")
      # 其他操作类似
  ```

- `class_prepared`：在程序启动时检测已注册的应用程序中的模型类，并为每个类触发一次。这个信号可以用于在模型类准备就绪后执行一些初始化操作。

  ```python
  @receiver(class_prepared, sender=MyModel)
  def class_prepared_callback(sender, **kwargs):
      print(f"{sender} class is prepared and ready to use.")
  ```

## 2. Management signals（管理信号）

- `pre_migrate`：在执行migrate命令之前触发。这个信号可以用于在执行数据库迁移之前执行一些自定义操作。

  ```python
  @receiver(pre_migrate)
  def pre_migrate_callback(sender, app_config, **kwargs):
      print(f"Preparing to migrate {app_config.label}.")
  ```

- `post_migrate`：在执行migrate命令之后触发。这个信号可以用于在执行数据库迁移之后执行一些自定义操作。

  ```python
  @receiver(post_migrate)
  def post_migrate_callback(sender, app_config, **kwargs):
      print(f"{app_config.label} has been migrated successfully.")
  ```

## 3. Request/response signals（请求/响应信号）

- `request_started`：在请求到达之前触发。这个信号可以用于在处理请求之前执行一些操作，比如记录请求的开始时间。

  ```python
  @receiver(request_started)
  def request_started_callback(sender, environ, **kwargs):
      print("Request started.")
  ```

- `request_finished`：在请求处理完毕后触发。这个信号可以用于在每个请求处理完毕后执行一些操作，比如记录请求的结束时间。

  ```python
  @receiver(request_finished)
  def request_finished_callback(sender, **kwargs):
      print("Request finished.")
  ```

- `got_request_exception`：在请求处理过程中出现异常时触发。这个信号可以用于在处理请求异常时执行一些额外的操作。

  ```python
  @receiver(got_request_exception)
  def got_request_exception_callback(sender, request, **kwargs):
      print(f"Exception occurred while processing request: {kwargs.get('exception')}.")
  ```

## 4. Test signals（测试信号）

- `setting_changed`：在使用测试修改配置文件时触发。这个信号可以用于在进行测试期间管理配置更改，并对更改进行特定的响应。

  ```python
  @receiver(setting_changed)
  def setting_changed_callback(sender, setting, value, enter, **kwargs):
      if enter:
          print(f"Setting '{setting}' changed to '{value}'.")
      else:
          print(f"Setting '{setting}' restored to its original value.")
  ```

- `template_rendered`：在使用测试渲染模板时触发。这个信号可以用于在进行模板渲染测试时执行一些验证或记录操作。

  ```python
  @receiver(template_rendered)
  def template_rendered_callback(sender, template, content, **kwargs):
      print(f"Template '{template.name}' has been rendered with content: {content}.")
  ```

## 5. Database Wrappers（数据库包装器）

- `connection_created`：在创建数据库连接时触发。这个信号可以用于在每次创建数据库连接时执行一些操作，比如设置连接特定的选项。

  ```python
  @receiver(connection_created)
  def connection_created_callback(sender, connection, **kwargs):
      print("Database connection created.")
  ```

通过使用`@receiver`装饰器并定义相应的回调函数，我们可以将这些信号与特定的操作关联起来，以便在信号触发时执行相应的逻辑。以上就是对不同类型信号的扩展和解释，以及相关示例。

# 【三】内置信号使用(当user表创建用户，就给用户发个邮件)

```python
1 写个函数   #放到__init__里
from django.db.models.signals import pre_save
import logging
def callBack(sender, **kwargs):
    logging.debug('%s创建了一个%s对象'%(sender._meta.model_name,kwargs.get('instance').title))


2 绑定内置信号   
pre_save.connect(callBack)
3 等待触发

```

```python
# 在__init__.py文件中添加以下代码

from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from django.core.mail import send_mail

@receiver(post_save, sender=User)
def send_email_on_user_creation(sender, instance, created, **kwargs):
    if created:
        # 发送电子邮件给新创建的用户
        subject = '欢迎加入我们的网站'
        message = '您已成功注册我们的网站。感谢您的加入！'
        from_email = 'noreply@example.com'
        to_email = instance.email
        send_mail(subject, message, from_email, [to_email])
```

> - 在上述代码中，我们定义了一个名为`send_email_on_user_creation`的回调函数，它会在用户模型（User）保存后触发。
> - 在回调函数中，我们通过`send_mail`函数向新创建的用户发送欢迎邮件。

# 【四】自定义信号

- 除了内置信号，Django还支持自定义信号。
  - 通过自定义信号，我们可以在应用程序中定义自己的事件，并根据需要触发和处理这些事件。

- 下面是自定义信号的基本步骤：

  - 定义信号：在某个文件中定义信号对象，并指定传递的参数（可以是任意数量的参数）。

  - 注册信号：编写接收信号的回调函数，并使用`connect`方法将其连接到信号上。

  - 触发信号：在适当的时候，使用`send`方法触发信号并传递相应的参数。

```python
# myapp/signals.py 文件

from django.dispatch import Signal

pizza_done = Signal(providing_args=['toppings', 'size'])

# views.py 文件
from myapp.signals import pizza_done

def order_pizza(request):
    # ... 执行订购披萨的逻辑
    toppings = ['pepperoni', 'mushrooms']
    size = 'large'
    
    # 披萨制作完成后触发信号
    pizza_done.send(sender='myapp', toppings=toppings, size=size)
    
# signals.py 文件
from myapp.signals import pizza_done

def callback(sender, **kwargs):
    print('Pizza is ready!')
    print('Toppings:', kwargs['toppings'])
    print('Size:', kwargs['size'])

# 将回调函数连接到自定义信号
pizza_done.connect(callback)
```

- 在上述示例中，我们首先定义了一个名为`pizza_done`的自定义信号对象，并指定它可以传递两个参数：`toppings`和`size`。
- 然后，在`order_pizza`函数中，当披萨制作完成后，我们使用`pizza_done.send`方法触发信号，并传递相关的参数。
- 最后，我们编写了一个名为`callback`的回调函数，并将其连接到自定义信号`pizza_done`上。

```python
#1 定义信号（一般创建一个py文件）（toppings，size 是接受的参数）

import django.dispatch
pizza_done = django.dispatch.Signal(providing_args=["toppings", "size"])
# 2 注册信号
def callback(sender, **kwargs):
    print("callback")
    print(sender,kwargs)
pizza_done.connect(callback)

# 3 触发信号
from 路径 import pizza_done
pizza_done.send(sender='seven',toppings=123, size=456) 
```

# 【五】自定义信号的应用场景

## （1）缓存更新与双写一致性

- 在分布式系统中，缓存是提高性能和减少对后端资源压力的常见手段。
- 当数据更新时，需要及时更新缓存以保持数据的一致性。
- 使用自定义信号可以实现双写一致性，确保数据在更新完成前，缓存已经被刷新。
- 例如，在电子商务平台中，当用户下单购买商品时，除了更新数据库中的订单信息，还可以发送一个自定义信号，通知缓存系统更新该订单相关信息，以避免缓存数据与数据库数据不一致。

## （2）异步任务处理

- 在复杂的系统中，有许多需要异步执行的任务，如发送邮件、生成报表、处理图像等。
- 通过自定义信号，可以触发异步任务并将结果通知给相应的模块。
- 例如，在一个社交媒体平台上发布帖子时，可以异步处理图片的上传和压缩，并通过自定义信号将处理结果返回给前端页面，使用户能够即时查看上传图片的处理状态。

## （3）事件驱动的系统架构

- 自定义信号还可以用于实现事件驱动的系统架构。
- 当某个事件发生时，可以发送相应的自定义信号，触发事件处理器执行相应的逻辑。
- 例如，在一个在线支付系统中，当用户完成支付操作时，可以发送一个自定义信号，通知相应的模块进行订单处理、库存更新等操作。

## （4）状态同步与通知

- 自定义信号还可以用于状态同步和通知。
- 当多个模块之间需要共享某个状态，并保持实时更新时，可以使用自定义信号来实现状态的同步和通知。
- 例如，在一个即时通讯软件中，当用户上线或下线时，可以通过发送自定义信号来通知好友列表进行状态的更新，以便及时显示对方的在线状态。

# 【六】自定义信号的应用场景分析

## 1. 缓存更新与双写一致性

- 在分布式系统中，为了提高性能和减少对后端资源的压力，常常使用缓存来保存热门的数据。
- 然而，当数据发生更新时，需要确保缓存与数据库的数据保持一致，避免脏读或不一致的情况发生。
- 自定义信号可以用于实现双写一致性，确保缓存在更新完成前已经被刷新。
- 假设有一个电子商务平台，用户通过下单购买商品，需要更新订单信息同时更新缓存。
- 具体步骤如下：

### **场景需求分析：**

- 用户下单购买商品时，首先会将订单信息写入数据库。
- 同时，发送一个自定义信号，通知缓存系统更新该订单相关信息。

### **代码演示：**

```python
# 示例代码中使用了Python的signal模块，来实现自定义信号
import signal

def update_cache(signal, frame):
    # 更新缓存的逻辑，将数据库中对应订单的缓存数据进行刷新
    pass

def handle_order():
    # 处理用户下单的逻辑，包括写入数据库等操作
    # ...

    # 发送自定义信号，触发更新缓存的操作
    signal.alarm(1)

# 注册自定义信号的处理函数
signal.signal(signal.SIGALRM, update_cache)

# 用户下单购买商品时调用handle_order进行处理
handle_order()
```

## 2. 异步任务处理

- 复杂的系统中存在许多需要异步执行的任务，如邮件发送、报表生成、图像处理等。
- 通过自定义信号，可以触发异步任务，并将结果通知给相应的模块。
- 假设在一个社交媒体平台上发布帖子时，需要异步处理上传的图片，包括图片的上传和压缩，并通过自定义信号将处理结果返回给前端页面，以使用户能即时查看图片处理状态。

### **场景需求分析：**

- 用户在发布帖子时上传图片，需要对图片进行异步处理。
- 处理完成后，用自定义信号通知前端页面并显示图片的处理状态。

### **代码演示：**

```python
import signal

def handle_image_processing(signal, frame):
    # 图片处理的具体逻辑，例如上传、压缩等操作
    pass

def handle_post():
    # 帖子处理的逻辑，包括获取用户提交的数据等操作
    # ...

    # 发送自定义信号，触发图片处理操作
    signal.alarm(1)

# 注册自定义信号的处理函数
signal.signal(signal.SIGALRM, handle_image_processing)

# 用户发布帖子时调用handle_post进行处理
handle_post()
```

## 3. 事件驱动的系统架构

- 自定义信号还可以用于实现基于事件驱动的系统架构。
- 当某个事件发生时，通过发送相应的自定义信号，触发事件处理器执行相应的逻辑。
- 假设一个在线支付系统中，用户完成支付操作时，需要通知相应的模块进行订单处理和库存更新等操作。

### **场景需求分析：**

- 在用户完成支付操作时，通过发送自定义信号通知相关模块进行订单处理和库存更新。

### **代码演示：**

```python
import signal

def handle_payment(signal, frame):
    # 进行订单处理、库存更新等操作
    pass

def handle_checkout():
    # 处理用户支付的逻辑，包括获取支付信息等操作
    # ...

    # 发送自定义信号，触发相关模块进行后续处理
    signal.alarm(1)

# 注册自定义信号的处理函数
signal.signal(signal.SIGALRM, handle_payment)

# 用户支付操作完成时调用handle_checkout进行处理
handle_checkout()
```

## 4. 状态同步与通知

- 自定义信号还可以用于状态同步和通知的场景。
- 当多个模块之间需要共享某个状态，并保持实时更新时，可以使用自定义信号来实现状态的同步和通知。
- 假设在一个即时通讯软件中，当用户上线或下线时，通过发送自定义信号来通知好友列表进行状态更新，以便及时显示对方的在线状态。

### **场景需求分析：**

- 在用户上线或下线时，发送自定义信号通知好友列表进行状态的更新。

### **代码演示：**

```python
import signal

def update_status(signal, frame):
    # 更新状态的逻辑，通常会从消息队列等数据源获取实时状态信息并进行更新
    pass

def handle_user_status_change():
    # 处理用户上线/下线的逻辑，包括更新用户状态等操作
    # ...

    # 发送自定义信号，触发好友列表的状态更新
    signal.alarm(1)

# 注册自定义信号的处理函数
signal.signal(signal.SIGALRM, update_status)

# 用户上线/下线时调用handle_user_status_change进行处理
handle_user_status_change()
```

# 
