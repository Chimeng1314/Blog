---
title: "JoinableQueue 模块"
published: 2024-12-04 09:00:00
category: Python 学习
series: "Python 并发编程"
seriesOrder: 9
hubs: ["python-concurrent-programming"]
---

# JoinableQueue模块

> 案例博客：[【1.0】知识点小结（进程相关） - Chimengmeng - 博客园 (cnblogs.com)](https://www.cnblogs.com/dream-ze/p/17502069.html)

> JoinableQueue是Python中的一个线程安全的队列
>
> 它是Queue.Queue类的子类
>
> 可以在多线程环境下使用。
>
> JoinableQueue提供了额外的方法，使得任务管理更加便捷。

## JoinableQueue的主要特点如下：

1. 线程安全：支持多线程同时读写同一个队列。
2. 队列管理：可以很方便地管理队列中的任务，包括添加、获取、删除和清空等操作。
3. 阻塞策略：当队列为空时，获取任务的线程可以被阻塞，直到有新的任务加入队列；当队列满时，添加任务的线程可以被阻塞，直到有位置空出来。

## JoinableQueue提供了以下方法：

```python
put(item [, block [, timeout]])
```

> - 将item添加到队列中。
>
> - 如果队列已满
>   - block参数为True时，会阻塞直到队列有空位；
>
>   - 如果timeout参数不为None，则最多阻塞timeout秒，超时则抛出Full异常。

```python
put_nowait(item)
```

> 功能与put一样，但是没有阻塞策略。

```python
get([block [, timeout]])
```

> 从队列中获取一个任务
>
> - 如果队列为空，block参数为True时会阻塞直到队列中有新的任务；
>
> - 如果timeout参数不为None，则最多阻塞timeout秒，超时则抛出Empty异常。

```python
get_nowait()
```

> 功能与get一样，但是没有阻塞策略。

```python
task_done()
```

> 表示队列中的一个任务已经处理完成，将会通知join()方法等待所有任务完成的线程。

```python
join()
```

> 等待队列中所有任务都被处理完毕。


总之，JoinableQueue是Python中一个非常方便实用的线程安全队列，可以灵活地管理队列中的任务，并在多线程环境下保证数据的安全性。

# 演示案例

> 
