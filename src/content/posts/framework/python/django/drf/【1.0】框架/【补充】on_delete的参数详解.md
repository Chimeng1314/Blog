---
title: "Django on_delete 参数详解"
published: 2024-11-01 09:00:00
category: Web 开发
series: "DRF 基础"
seriesOrder: 23
hubs: ["drf-basics"]
---

# 【补充】on_delete的参数详解

## `models.CASCADE`（级联删除）: 

当删除与该字段关联的对象时，所有相关的对象将被级联删除。例如，如果一个出版社对象被删除了，与该出版社相关联的所有图书对象也会被删除。

## `models.SET_DEFAULT`：（设置为默认值）:

 当删除与该字段关联的对象时，该字段的值将设置为字段的默认值。这要求你同时定义了一个默认值。例如，如果一个出版社对象被删除了，与该出版社相关联的图书对象的出版社字段将被设置为默认的出版社。

## `models.SET_NULL`：（设置为空）: 

- 当删除与该字段关联的对象时，该字段的值将被设置为`NULL`，即空。这要求你将该字段设置为可为空。例如，如果一个出版社对象被删除了，与该出版社相关联的图书对象的出版社字段将被设置为空。

## `models.SET()`：（设置为指定值或执行函数）: 

- 当删除与该字段关联的对象时，该字段的值将被设置为指定的值或执行指定的函数。你可以传递一个值作为参数，也可以传递一个函数，该函数将在删除关联对象时执行并返回一个值。例如，你可以设置一个函数，将与删除的出版社对象创建时间相关的特定日期作为图书对象的出版日期。

## `models.DO_NOTHING()`：（什么都不做）: 

- 当删除与该字段关联的对象时，不会进行任何操作。这意味着数据库中的关联完整性约束将被忽略，并且你需要确保在应用层面处理好相关的逻辑。要在使用这个选项时生效，你需要将`db_constraint`参数设置为`False`，以避免在数据库级别建立外键约束。

# 【补充】逻辑外键

- 逻辑外键是指在数据库中没有直接建立外键约束，但在应用程序的逻辑层面上表达了两个实体之间的关联关系。
- 与物理外键不同，逻辑外键不会限制或强制执行数据的完整性。

## 优点：

- 增删查改数据快：
  - 由于没有物理外键的约束，操作数据时不需要考虑维护和检查外键完整性，因此执行增删查改操作的效率更高。


## 缺点：

- 容易出现脏数据：
  - 没有物理外键约束的情况下，存在风险引入脏数据或不一致数据。
  - 例如，当删除了一个关联对象时，没有物理外键约束可以阻止该对象在其他地方被引用。


- 在实际应用中是否建立物理外键约束往往取决于具体的需求、系统设计和团队工作流程。
  - 在某些情况下，使用逻辑外键而不建立物理外键可以提高数据库操作的性能和灵活性。
  - 然而，这也意味着需要在应用层面上自行处理关联对象的完整性和数据一致性。
  - 团队需要通过其他方式来控制和保障数据的完整性，例如编写合适的验证逻辑或者使用事务等技术手段。
- 总结而言，逻辑外键提供了一种灵活的方式来表达实体之间的关联关系，并且可以在特定情况下提高数据库操作的性能。
- 然而，它也带来了管理和维护数据完整性的挑战，需要开发团队仔细评估和权衡使用该方法的利弊以及适应性。

# 【准备数据】

```python
from django.db import models


# Create your models here.
class Book(models.Model):
    name = models.CharField(max_length=32)
    price = models.CharField(max_length=32)

    # on_delete
    # models.CASCADE: 级联删除，只要删除 publish ，跟publish关联的book，全部被删除
    # models.SET_DEFAULT: 只要删除 publish ，跟publish关联的book，publish的字段都会变成默认值，(建议配合default一起使用)
    # models.SET_NULL: 只要删除 publish ，跟publish关联的book，publish的字段都会变成空，(建议配合null一起使用)
    # models.SET(): （放个值）,只要删除 publish ，跟publish关联的book，publish的字段都会set设的值或执行函数
    # models.DO_NOTHING(): 什么都不做，但是它需要跟db_constraint=False 配合，表示不建立外键约束，创建逻辑外检，而不是物理外检
    # 逻辑外检：虽然有外键关系但不会约束外键的数据存储要求
    # 不建立物理外键的好处？
    # 优点：增删查改数据快
    # 缺点：容易出现脏数据
    # 在实际应用中，都不建立物理外检而是建立逻辑外键
    publish = models.ForeignKey(to="Publish", on_delete=models.SET_NULL, null=True, blank=True)
    authors = models.ManyToManyField(to="Author")


class Publish(models.Model):
    name = models.CharField(max_length=32)
    addr = models.CharField(max_length=32)


class Author(models.Model):
    name = models.CharField(max_length=32)
    phone = models.CharField(max_length=11)
    # 本质上就是foreignkey，但是唯一，多的方是唯一，形成了一对一
    author_detail = models.OneToOneField(to="AuthorDetail", on_delete=models.CASCADE)


class AuthorDetail(models.Model):
    email = models.CharField(max_length=32)
    age = models.IntegerField()
```

# 【示例参考】
