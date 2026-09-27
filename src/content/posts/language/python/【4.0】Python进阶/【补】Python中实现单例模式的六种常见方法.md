---
title: "Python中实现单例模式的六种常见方法"
published: 2024-08-20 15:00:00
category: 编程语言
series: "Python 面向对象进阶"
seriesOrder: 14
hubs: ["python-oop"]
---

# 【零】引入
## 【1】前言
+ 我们知道，经典设计模式总共有 23 种，但其中只有少数几种被广泛采用。
+ 根据我的工作经验，实际常用的可能不超过其中的一半。
+ 如果随机找一位程序员，并要求他列举出自己最熟悉的三种设计模式，那么单例模式肯定会是其中之一，这也是今天我们要讨论的。

## 【2】为什么要单例模式
+ 单例设计模式（Singleton Design Pattern）: 一个类只允许创建一个对象（或者实例），那这个类就是一个单例类，这种设计模式就叫作单例设计模式，简称单例模式。
+ 当一个类的功能比较单一，只需要一个实例对象就可以完成需求时，就可以使用单例模式来节省内存资源。

**【通常】单例模式创建的对象是进程唯一的, 单例类中对象的唯一性的作用范围是进程内的，在进程间是不唯一的。**

## 【3】如何实现一个单例
+ 要实现一个单例，我们需要知道要重点关注的点是哪些？
    - 考虑对象创建时的线程安全问题
    - 考虑是否支持延迟加载
    - 考虑获取实例的性能是否高（是否加锁）
+ 在python中，我们可以使用多种方法来实现单例模式
    - 使用模块
    - 使用装饰器
    - 使用类（方法）
    - 基于__new__方法实现
    - 基于元类metaclass实现

## 【4】饿汉式与懒汉式
### （1）饿汉式(着急吃)
+ 饿汉式的实现方式比较简单。在类加载的时候，instance 静态实例就已经创建并初始化好了，所以，instance 实例的创建过程是线程安全的。
+ 不过，这样的实现方式不支持延迟加载（在真正用到 IdGenerator 的时候，再创建实例）。
+ 一种常见的方式是利用python模块化实现单例。

```python
# id_generator_module.py

import threading


class IdGenerator:
    def __init__(self):
        self._lock = threading.Lock()
        self.id = 0

    def get_id(self):
        with self._lock:
            self.id += 1
            return self.id


# 创建单例实例
id_generator_instance = IdGenerator()
```

+ 在另一个文件（例如 main.py）中导入模块并使用单例模式

```python
# main.py

import id_generator_module

if __name__ == '__main__':
    singleton1 = id_generator_module.id_generator_instance
    singleton2 = id_generator_module.id_generator_instance

    print(singleton1 is singleton2)  # 输出 True，表示是同一个实例
```

+ Python中可以使用模块的方式非常简单地实现单例模式，因为Python模块在程序中只会被导入一次，所以它天生就是单例的。

### （2）懒汉式（不着急吃）
+ 有饿汉式，对应的，就有懒汉式。懒汉式相对于饿汉式的优势是支持延迟加载。
    - 使用装饰器
    - 使用类（方法）
    - 基于__new__方法实现
    - 基于元类metaclass实现

# 【一】类属性
## 【1】类产生对象
+ 当我们有一个类，类里面有很多方法
+ 当我们想使用这些方法的时候，我们的第一想法是实例化得到一个对象，再用对象去调用相应的方法
+ 但是不同的人，都想用这一个方法的时候，就需要每一个人都去实例化对象，用对象调用方法
+ 但是我们不去使用对象中的其他属性，只用到其中一种属性，于是这对于系统来说是一种开销

```python
# 创建一个普通的类
class MysqlControl(object):
    pass


# 实例化类得到对象 --- 类只要加 () 实例化就会产生一个全新的对象
obj_one = MysqlControl()
obj_two = MysqlControl()

# 查看对象  --- 发现虽然是同一个类实例化得到的对象，但是对象的地址不一样
print(obj_one)
# <__main__.MysqlControl object at 0x00000204C2BB3FD0>
print(obj_two)
# <__main__.MysqlControl object at 0x00000204C2BB3F40>
print(obj_one is obj_two)
# False
```

## 【2】类属性包装成方法
```python
class Singleton(object):
    _instance = None

    def __init__(self, ip, port):
        self.ip = ip
        self.port = port

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = Singleton('127.0.0.1', 3306)
        return cls._instance


obj_one = Singleton.get_instance()
obj_two = Singleton.get_instance()

print(obj_one) 
# <__main__.Singleton object at 0x0000023CA8B03E50>
print(obj_two)
# <__main__.Singleton object at 0x0000023CA8B03E50>
print(obj_one is obj_two)
# True 
# 输出 True，表示是同一个实例
```

+ 使用类属性保存实例，通过类方法获取实例。
+ 在第一次调用get_instance方法时创建实例，并在后续调用中直接返回该实例。

# 【二】装饰器
```python
def singleton(cls):
    instances = {}

    def wrapper(*args, **kwargs):
        if cls not in instances:
            instances[cls] = cls(*args, **kwargs)
        return instances[cls]

    return wrapper


@singleton
class Singleton:
    pass


singleton_one = Singleton()
singleton_two = Singleton()

print(singleton_one)
# <__main__.Singleton object at 0x000001C0B531A770>
print(singleton_two)
# <__main__.Singleton object at 0x000001C0B531A770>
print(singleton_one is singleton_two)
# True

# 输出 True，表示是同一个实例

# # 使用 __call__ 方法获取单例
singleton_three = Singleton()
print(singleton_one is singleton_three)
# True
```

+ 使用装饰器将原来的类包装成一个新的类，通过闭包和字典保存实例。
+ 在每次实例化时，先检查字典中是否已经存在该类的实例，如果不存在才创建实例并返回。

# 【三】元类(metaclass)
```python
class SingletonType(type):
    def __init__(cls, name, bases, attrs):
        super(SingletonType, cls).__init__(name, bases, attrs)
        cls.instance = None

    def __call__(cls, *args, **kwargs):
        if cls.instance is None:
            cls.instance = super(SingletonType, cls).__call__(*args, **kwargs)
        return cls.instance


class Singleton(metaclass=SingletonType):
    pass


singleton_one = Singleton()
singleton_two = Singleton()

print(singleton_one)
# <__main__.Singleton object at 0x000001C0B531A770>
print(singleton_two)
# <__main__.Singleton object at 0x000001C0B531A770>
print(singleton_one is singleton_two)
# True

# 输出 True，表示是同一个实例

# # 使用 __call__ 方法获取单例
singleton_three = Singleton()
print(singleton_one is singleton_three)
# True
```

+ 定义一个元类，在元类的__call__方法中判断实例是否已存在，如果不存在则调用父类的__call__方法来创建并返回实例。

# 【四】基于__new__方法
## 【1】思路
+ 在Python中，对象的实例化过程通常遵循以下步骤： 
    - 首先，执行类的__new__方法，如果未定义此方法，将默认调用父类的__new__方法来创建一个实例化对象。
    - 接着，再执行__init__方法来对这个新创建的对象进行初始化。
+ 我们可以充分利用这个实例化过程来实现单例模式。 
    - 具体做法是在类的__new__方法中判断是否已经存在实例，如果存在，则直接返回现有的实例，否则创建一个新的实例。
    - 这样就能够确保只有一个实例存在，从而实现了单例模式的效果。

## 【2】代码
```python
class Singleton(object):
    def __new__(cls, *args, **kwargs):
        if not hasattr(cls, '_instance'):
            cls._instance = super().__new__(cls)
        return cls._instance


singleton_one = Singleton()
singleton_two = Singleton()

print(singleton_one)
# <__main__.Singleton object at 0x000001C0B531A770>
print(singleton_two)
# <__main__.Singleton object at 0x000001C0B531A770>
print(singleton_one is singleton_two)
# True

# 输出 True，表示是同一个实例

# # 使用 __call__ 方法获取单例
singleton_three = Singleton()
print(singleton_one is singleton_three)
# True
```

+ 重写__new__方法，在实例化对象时判断类中是否已有实例，如果没有则调用父类的__new__方法来创建并返回。

## 【3】优势
+ 这种实现方式会导致频繁加锁、释放锁，以及并发度低等问题，频繁的调用会产生性能瓶颈。

# 【五】基于模块
```python
# singleton.py
class Singleton:
    pass

singleton_instance = Singleton()
```

+ 将实例化操作放在模块级别，通过导入该模块来获取实例。
+ 由于Python模块在运行时只会被导入一次，因此保证了实例的单一性。

# 【使用场景】
## 【1】配置信息
+ 某个项目的配置信息存放在一个配置文件中，通过一个 Config 的类来读取配置文件的信息。
+ 如果在程序运行期间，有很多地方都需要使用配置文件的内容，也就是说，很多地方都需要创建 Config 对象的实例，这就导致系统中存在多个 Config 的实例对象，而这样会严重浪费内存资源，尤其是在配置文件内容很多的情况下。
+ 事实上，类似 Config 这样的类，我们希望在程序运行期间只存在一个实例对象。

```python
import configparser
import threading


class Config:
    _instance = None
    _lock = threading.Lock()

    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super(Config, cls).__new__(cls)
                    cls._instance.load_config()
        return cls._instance

    def load_config(self):
        self.config = configparser.ConfigParser()
        if not self.config.read('config.ini'):
            # 如果配置文件不存在，设置默认配置
            self.set_default_config()

    def set_default_config(self):
        # 设置默认配置
        self.config['Section1'] = {'key1': 'default_value1', 'key2': 'default_value2'}

    def get_config(self, section, key):
        return self.config.get(section, key)

    def update_config(self, section, key, value):
        self.config.set(section, key, value)
        with open('config.ini', 'w') as config_file:
            self.config.write(config_file)


if __name__ == "__main__":
    config = Config()

    # 获取配置信息
    value1 = config.get_config("Section1", "key1")
    print(value1)

    # 更新配置信息
    config.update_config("Section1", "key1", "new_value")

    # 获取更新后的配置信息
    updated_value1 = config.get_config("Section1", "key1")
    print(updated_value1)
```

## 【2】分布式ID(雪花算法)
+ 分布式ID生成是一个常见的需求，以下是一个使用雪花算法实现分布式ID生成的Python代码示例，并将雪花算法的生成ID功能与单例模式结合使用，创建了一个单例类，该类包含了雪花算法的实例，并确保只有一个该类的实例存在

```python
import threading
import time


class SnowflakeIDGenerator:
    def __init__(self, worker_id, datacenter_id):
        # 41位时间戳位
        self.timestamp_bits = 41
        # 10位工作机器ID位
        self.worker_id_bits = 10
        # 12位序列号位
        self.sequence_bits = 12

        # 最大工作机器ID和最大序列号
        self.max_worker_id = -1 ^ (-1 << self.worker_id_bits)
        self.max_sequence = -1 ^ (-1 << self.sequence_bits)

        # 时间戳左移的位数
        self.timestamp_shift = self.worker_id_bits + self.sequence_bits
        # 工作机器ID左移的位数
        self.worker_id_shift = self.sequence_bits

        # 配置工作机器ID和数据中心ID
        self.worker_id = worker_id
        self.datacenter_id = datacenter_id

        # 初始化序列号
        self.sequence = 0
        # 上次生成ID的时间戳
        self.last_timestamp = -1

        # 线程锁，用于保护并发生成ID的安全性
        self.lock = threading.Lock()

        # 校验工作机器ID和数据中心ID是否合法
        if self.worker_id < 0 or self.worker_id > self.max_worker_id:
            raise ValueError(f"Worker ID must be between 0 and {self.max_worker_id}")
        if self.datacenter_id < 0 or self.datacenter_id > self.max_worker_id:
            raise ValueError(f"Datacenter ID must be between 0 and {self.max_worker_id}")

    def _current_timestamp(self):
        return int(time.time() * 1000)

    def _wait_for_next_timestamp(self, last_timestamp):
        timestamp = self._current_timestamp()
        while timestamp <= last_timestamp:
            timestamp = self._current_timestamp()
        return timestamp

    def generate_id(self):
        with self.lock:
            current_timestamp = self._current_timestamp()
            if current_timestamp < self.last_timestamp:
                raise ValueError("Clock moved backwards. Refusing to generate ID.")

            if current_timestamp == self.last_timestamp:
                self.sequence = (self.sequence + 1) & self.max_sequence
                if self.sequence == 0:
                    current_timestamp = self._wait_for_next_timestamp(self.last_timestamp)
            else:
                self.sequence = 0

            self.last_timestamp = current_timestamp

            # 构造ID
            timestamp = current_timestamp << self.timestamp_shift
            worker_id = self.worker_id << self.worker_id_shift
            id = timestamp | worker_id | self.sequence
            return id


class SingletonSnowflakeGenerator:
    _instance_lock = threading.Lock()
    _instance = None

    def __new__(cls, worker_id, datacenter_id):
        if cls._instance is None:
            with cls._instance_lock:
                if cls._instance is None:
                    cls._instance = SnowflakeIDGenerator(worker_id, datacenter_id)
        return cls._instance


if __name__ == "__main__":
    generator1 = SingletonSnowflakeGenerator(worker_id=1, datacenter_id=1)
    generator2 = SingletonSnowflakeGenerator(worker_id=2, datacenter_id=2)

    print(generator1 is generator2)  # 输出 True，表示是同一个实例

    id1 = generator1.generate_id()  
    id2 = generator2.generate_id()  

    print(id1)  # 7108005303425175552
    print(id2)  # 7108005303425175553
```

## 【3】数据库连接池
+ 确保在应用程序中只存在一个数据库连接池的实例，以提高性能和资源利用率。

```python
import threading
import pymysql
from dbutils.pooled_db import PooledDB


class DatabaseConnectionPoolProxy:
    _instance_lock = threading.Lock()

    def __new__(cls, *args, **kwargs):
        if not hasattr(DatabaseConnectionPoolProxy, "_instance"):
            with DatabaseConnectionPoolProxy._instance_lock:
                if not hasattr(DatabaseConnectionPoolProxy, "_instance"):
                    DatabaseConnectionPoolProxy._instance = object.__new__(cls)
                    cls._instance.initialize_pool()
        return DatabaseConnectionPoolProxy._instance

    def initialize_pool(self):
        self.pool = PooledDB(
            creator=pymysql,
            maxconnections=6,
            mincached=2,
            maxcached=5,
            maxshared=3,
            blocking=True,
            maxusage=None,
            # 配置其他数据库连接池参数
            host='192.168.91.1',
            port=3306,
            user='root',
            password='root',
            database='inventory',
            charset='utf8'
        )

    def get_connection(self):
        if self.pool:
            return self.pool.connection()

    def execute_query(self, query, params=None):
        conn = self.get_connection()
        if conn:
            cursor = conn.cursor()
            try:
                cursor.execute(query, params)
                result = cursor.fetchall()
                return result
            finally:
                cursor.close()
                conn.close()


if __name__ == "__main__":
    db_proxy = DatabaseConnectionPoolProxy()
    result = db_proxy.execute_query("SELECT * FROM inventory WHERE id=%s", [5])

    print(result)

    db_proxy1 = DatabaseConnectionPoolProxy()
    db_proxy2 = DatabaseConnectionPoolProxy()

    print(db_proxy1 is db_proxy2)  # True
```

## 【4】缓存管理
+ 管理应用程序中的缓存数据，确保只有一个缓存管理器实例来避免数据一致性问题。

```python
import threading


class CacheManager:
    _instance = None
    _lock = threading.Lock()

    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super(CacheManager, cls).__new__(cls)
                    cls._instance.initialize_cache()
        return cls._instance

    def initialize_cache(self):
        self.cache_data = {}  # 实际缓存数据的数据结构

    def get_data(self, key):
        return self.cache_data.get(key)

    def set_data(self, key, value):
        with self._lock:
            self.cache_data[key] = value


if __name__ == "__main__":
    cache_manager1 = CacheManager()
    cache_manager1.set_data("key1", "value1")

    cache_manager2 = CacheManager()
    value = cache_manager2.get_data("key1")
    print(value)  # 输出 "value1"

    print(cache_manager1 is cache_manager2)  # 如果为 True，则是单例模式
```

## 【5】线程池
+ 确保在应用程序中只存在一个线程池的实例，以管理并发任务的执行。

```python
import threading
from concurrent.futures import ThreadPoolExecutor


class ThreadPoolManager:
    _instance = None
    _lock = threading.Lock()

    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super(ThreadPoolManager, cls).__new__(cls)
                    cls._instance.initialize_thread_pool()
        return cls._instance

    def initialize_thread_pool(self):
        self.thread_pool = ThreadPoolExecutor(max_workers=4)  # 最大工作线程数

    def submit_task(self, task_function, *args, **kwargs):
        return self.thread_pool.submit(task_function, *args, **kwargs)


if __name__ == "__main__":
    thread_pool_manager1 = ThreadPoolManager()


    def sample_task(x):
        return x * 2


    future = thread_pool_manager1.submit_task(sample_task, 5)
    result = future.result()
    print(result)  # 输出 10

    thread_pool_manager2 = ThreadPoolManager()

    print(thread_pool_manager1 is thread_pool_manager2)  # 如果为 True，则是单例模式
```

