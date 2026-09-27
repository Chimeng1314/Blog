---
title: "ATM分"
published: 2023-05-19 09:02:00
category: 编程语言
series: "Python 高级"
seriesOrder: 18
hubs: ["python-advanced"]
---

# 【一】需求
```python
# ATM ： 提款姬


# def save_data(file_path,)

# user_pwd_dict ={}
# 文本 ： dream-521
# dream,521
# user_info.txt : 每一个人的信息就是一行
# dream_flow.txt :

# print(time.localtime())

# 注册 ： 存储到文件中 用户名 - 登录密码 - 年龄 - 银行卡号(1314) - 取款密码 - 余额(1000)
# 登录 ： 直接将用户信息从文件中取出，然后进行比对 用户名 - 密码
# 取款 :  验证你的取款密码，更改余额   余额(1000) ，记录你的提款信息 -- 文件里 - 加时间
# 转账 ： 验证你的取款密码，更改余额 目标银行卡号去转 记录你的提款信息 -- 文件里
```

# 【二】代码
```python
# -*-coding: Utf-8 -*-
# @File : 01ATM .py
# author: Chimengmeng
# blog_url : https://www.cnblogs.com/dream-ze/
# Time：2023/12/11
from datetime import datetime

# ATM ： 提款姬


# def save_data(file_path,)

# user_pwd_dict ={}
# 文本 ： dream-521
# dream,521
# user_info.txt : 每一个人的信息就是一行
# dream_flow.txt :

# print(time.localtime())

# 注册 ： 存储到文件中 用户名 - 登录密码 - 年龄 - 银行卡号(1314) - 取款密码 - 余额(1000)
# 登录 ： 直接将用户信息从文件中取出，然后进行比对 用户名 - 密码
# 取款 :  验证你的取款密码，更改余额   余额(1000) ，记录你的提款信息 -- 文件里 - 加时间
# 转账 ： 验证你的取款密码，更改余额 目标银行卡号去转 记录你的提款信息 -- 文件里


login_user_dict = {'username': '',
                   'is_admin': False,
                   'pay_pwd': '',
                   'bank_id': '',
                   'balance': ''}


def read_data(tag, path):
    user_pwd_dict = {}
    user_bank_dict = {}
    user_log_list = []
    user_flow_list = []
    with open(path, 'r', encoding='utf8') as fp:
        data_old = fp.read()
    data_list = data_old.split('\n')
    data_list.pop()
    if tag == 'login':
        for data in data_list:
            username, password, role = data.split('|')
            user_pwd_dict[username] = {'password': password, 'role': role}
        return user_pwd_dict
    elif tag == 'bank':
        for data in data_list:
            username, pay_password, bank_id, balance = data.split('|')
            user_bank_dict[username] = {'pay_password': pay_password, 'bank_id': bank_id, 'balance': balance}
        return user_bank_dict
    elif tag == 'log':
        for data in data_list:
            user_log_list.append(data)
        return user_log_list
    elif tag == 'flow':
        for data in data_list:
            user_flow_list.append(data)
        return user_flow_list


def create_data(tag=None, **kwargs):
    data = '|'.join(kwargs.values())
    if tag == 'log':
        data = f'当前用户 {kwargs.get("username")} 于 {datetime.now().strftime("%Y年%m月%d日 %H时%M分%S秒")} :>>>> {kwargs.get("msg")}!'
    elif tag == 'flow':
        data = f'当前用户 {kwargs.get("username")} 于 {datetime.now().strftime("%Y年%m月%d日 %H时%M分%S秒")} :>>>> {kwargs.get("msg")}!'
    return data


def save_data(mode='a', **kwargs):
    try:
        with open(kwargs.get('path'), mode, encoding='utf8') as fp:
            fp.write(kwargs.get('data') + '\n')
        return True, 'ok'
    except Exception as e:
        return False, e


def get_user_pwd():
    username = input("请输入用户名 :>>>> ").strip()
    password = input("请输入密码 :>>>> ").strip()
    return username, password


def register():
    try:
        username, password = get_user_pwd()
        if username == 'dream' and password == '521':
            role = 'admin'
        else:
            role = 'normal'
        pwd_data = create_data(username=username, password=password, role=role)
        bank_data = create_data(username=username, pay_pwd='None', bank_id='000000', balance=str(0))
        log_data = create_data(tag="log", username=username, msg="注册成功")
        save_data(path='user_pwd.txt', data=pwd_data)
        save_data(path='user_bank.txt', data=bank_data)
        save_data(path='user_log.txt', data=log_data)
        return True, f'用户 {username} :>>>> 注册成功!'
    except Exception as e:
        return False, e


def init_bank_data(username):
    # {'dream': {'pay_password': 'None', 'bank_id': 0, 'balance': 0}}
    try:
        user_bank_dict = read_data(tag='bank', path='user_bank.txt')
        user_bank_data = user_bank_dict.get(username)
        login_user_dict.update(
            pay_pwd=user_bank_data.get('pay_password'),
            bank_id=user_bank_data.get('bank_id'),
            balance=user_bank_data.get('balance')
        )
        return True, 'ok'
    except Exception as e:
        return False, e


def login():
    # {'dream': {'password': '521', 'role': 'admin'}}
    user_pwd_dict = read_data(tag='login', path='user_pwd.txt')
    # ['当前用户 dream 于 2023年12月11日 15时03分00秒 :>>>> 注册成功!']
    user_log_list = read_data(tag='log', path='user_log.txt')
    username, password = get_user_pwd()
    user_pwd_dict = user_pwd_dict.get(username)
    if not user_pwd_dict:
        save_data(path='user_log.txt', data=create_data(tag="log", username=username, msg="尝试登陆但未注册"))
        return False, f'用户 {username} :>>>>请先注册,谢谢!'
    if password == user_pwd_dict.get('password'):
        save_data(path='user_log.txt', data=create_data(tag="log", username=username, msg="登陆成功"))
        login_user_dict.update(username=username)
        if user_pwd_dict.get('role') == 'admin':
            login_user_dict['is_admin'] = True
        else:
            login_user_dict['is_admin'] = False
        flag, msg = init_bank_data(username)
        if not flag:
            return False, msg
        return True, f'用户 {username} :>>>> 登陆成功!'


def login_auth(func):
    def inner(*args, **kwargs):
        # 校验是否登陆
        if not login_user_dict.get('username'):
            save_data(path='user_log.txt',
                      data=create_data(tag="log", username="未知用户", msg="访问功能但未登录"))
            return False, '未登录,请先登录!'
        # 校验银行信息是否初始化
        if not login_user_dict['balance'] and func.__name__ != "change_bank_info":
            return False, f'未激活银行卡!'
        return func(*args, **kwargs)

    return inner


def check_id_type(bank_id, pay_pwd):
    if not bank_id.isdigit() or not pay_pwd.isdigit():
        return False, f'当前卡号或密码 :>>>> 不合法!'
    if len(bank_id) != 6 or len(pay_pwd) != 6:
        return False, f'当前卡号或密码 :>>>> 不符合合法长度!'
    return True, f'ok'


# 初始化银行信息
@login_auth
def change_bank_info():
    # {'dream': {'pay_password': 'None', 'bank_id': 0, 'balance': 0}}
    user_bank_dict = read_data(tag='bank', path='user_bank.txt')
    username = login_user_dict['username']
    bank_id = input("请输入银行账号(6位数字) :>>>> ").strip()
    if bank_id in user_bank_dict[username].values():
        return False, f'当前卡号已存在!'
    pay_pwd = input("请输入付款密码(6位数字) :>>>> ").strip()
    flag, msg = check_id_type(bank_id, pay_pwd)
    if not flag:
        return msg
    bank_data = create_data(username=username, pay_pwd=pay_pwd, bank_id=bank_id, balance=str(1000))
    save_data(path='user_bank.txt', data=bank_data)
    save_data(path='user_log.txt', data=create_data(tag="log", username=username, msg="初始化银行信息完成!"))
    save_data(path='user_flow.txt',
              data=create_data(tag="flow", username=username, msg=f"初始化成功! 当前账户余额 :>>>> {1000}"))
    user_bank_data = user_bank_dict.get(username)
    flag, msg = init_bank_data(username)
    if not flag:
        return False, msg
    return True, f'用户 {username} :>>>> 银行卡激活成功!'


def _check_input_balance(balance, tag=None):
    old_balance = int(login_user_dict['balance'])
    if not balance.isdigit() or int(balance) < 0:
        return False, f'非法的金额'
    if tag == 'get_balance' or tag == 'transfer':
        if int(balance) > old_balance:
            return False, f'余额不足,当前余额 :>>>> {old_balance}'
    return True, old_balance


# 取款
@login_auth
def get_balance():
    # 输入提现的金额
    balance = input("请输入取款金额 :>>>> ").strip()
    flag, old_balance = _check_input_balance(balance, tag='get_balance')
    # 判断当前余额是否合法并且充足
    if not flag:
        return False, old_balance
    # 原来的余额 - 提现的余额
    old_balance -= int(balance)
    # 更新用户信息
    login_user_dict['balance'] = old_balance
    username = login_user_dict['username']
    bank_data = create_data(username=username, pay_pwd=login_user_dict['pay_pwd'],
                            bank_id=login_user_dict['bank_id'], balance=str(old_balance))
    save_data(path='user_bank.txt', data=bank_data)
    save_data(path='user_log.txt',
              data=create_data(tag="log", username=username, msg=f"用户 {username} 提现 {balance} 完成!"))
    save_data(path='user_flow.txt',
              data=create_data(tag="flow", username=username, msg=f"提现成功! 当前账户余额 :>>>> {old_balance}"))
    return True, f'用户 {username} 提现 {balance} 完成!'


# 转账
@login_auth
def transfer():
    user_bank_dict = read_data(tag='bank', path='user_bank.txt')
    # 我的用户银行数据
    my_username = login_user_dict.get('username')
    my_user_bank_data = user_bank_dict[my_username]
    # 输入提现的金额
    balance = input("请输入转账金额 :>>>> ").strip()
    to_username = input("请输入转账对方用户名 :>>>> ").strip()
    to_bank_id = input("请输入转账银行卡号 :>>>> ").strip()
    my_pay_pwd = input("请输入提款密码 :>>>> ").strip()
    # 对方用户银行数据
    to_user_bank_data = user_bank_dict.get(to_username)
    if not to_user_bank_data:
        return False, f'对方账户 {to_username} :>>>> 不存在!'
    # 校验银行卡和密码格式
    flag, msg = check_id_type(bank_id=to_bank_id, pay_pwd=my_pay_pwd)
    if not flag:
        return msg
    # 校验当前余额是否格式正确并且，符合最小余额
    flag, old_balance = _check_input_balance(balance, tag='get_balance')
    if not flag:
        return False, old_balance
    if login_user_dict['pay_pwd'] != my_pay_pwd:
        return False, "密码错误"
    # 开始向对方账户转账
    # 自己账户减钱
    old_balance -= int(balance)
    # 对方账户加钱
    to_user_bank_data['balance'] = int(balance) + int(to_user_bank_data['balance'])
    # 写入数据
    bank_data_me = create_data(username=my_username, pay_pwd=login_user_dict['pay_pwd'],
                               bank_id=login_user_dict['bank_id'], balance=str(old_balance))
    bank_data_to = create_data(username=to_username, pay_pwd=to_user_bank_data['pay_password'],
                               bank_id=to_user_bank_data['bank_id'],
                               to_user_bank_data=str(to_user_bank_data['balance']))
    save_data(path='user_bank.txt', data=bank_data_me)
    save_data(path='user_bank.txt', data=bank_data_to)
    save_data(path='user_flow.txt',
              data=create_data(tag="flow", username=my_username,
                               msg=f"向{to_username}转账成功! 当前账户余额 :>>>> {old_balance}"))
    save_data(path='user_flow.txt',
              data=create_data(tag="flow", username=to_username,
                               msg=f"来自{my_username}收账成功! 当前账户余额 :>>>> {int(to_user_bank_data['balance'])}"))

    return True, f'当前用户 {my_username} 向目标用户 {to_username} 转账 {balance} 成功!'


# 存款
@login_auth
def add_balance():
    # 输入充值的金额
    balance = input("请输入充值金额 :>>>> ").strip()
    flag, old_balance = _check_input_balance(balance)
    # 判断当前余额是否合法并且充足
    if not flag:
        return False, old_balance
    # 原来的余额 - 提现的余额
    old_balance += int(balance)
    # 更新用户信息
    login_user_dict['balance'] = old_balance
    username = login_user_dict['username']
    bank_data = create_data(username=username, pay_pwd=login_user_dict['pay_pwd'],
                            bank_id=login_user_dict['bank_id'], balance=str(old_balance))
    save_data(path='user_bank.txt', data=bank_data)
    save_data(path='user_log.txt',
              data=create_data(tag="log", username=username, msg=f"用户 {username} 存储 {balance} 完成!"))
    save_data(path='user_flow.txt',
              data=create_data(tag="flow", username=username, msg=f"存储成功! 当前账户余额 :>>>> {old_balance}"))
    return True, f'用户 {username} 存储 {balance} 完成!'


# 查看流水
@login_auth
def check_flow():
    # ['当前用户 dream 于 2023年12月11日 15时03分00秒 :>>>> 注册成功!']
    user_flow_list = read_data(tag='flow', path='user_flow.txt')
    count = 0
    print(f"************* 流水打印开始 *************")
    for flow in user_flow_list:
        count += 1
        print(f"当前第 {count} 条流水 :>>>> {flow}")
    print(f"************* 流水打印结束 *************")
    return True, ' ----- 流水打印完成! ----- '


# 查看银行信息
@login_auth
def check_bank():
    user_bank_dict = read_data(tag='bank', path='user_bank.txt')
    username = login_user_dict['username']
    user_bank_data = user_bank_dict[username]
    print(f'''
    ------ 当前用户 {username} 信息如下 ------ 
        用   户 :>>>> {username}
        支付密码 :>>>> {user_bank_data['pay_password']}
        银行卡号 :>>>> {user_bank_data['bank_id']}
        银行余额 :>>>> {user_bank_data['balance']}
    ''')
    return True, f'当前用户 {username} :>>>> 银行信息查看完成 !'


func_menu = '''
===================用户功能菜单=====================
                  1.注册
                  2.登陆
                  3.激活银行卡
                  4.取款
                  5.转账
                  6.充值余额
                  7.查看流水
                  8.查看银行信息(查看自己的卡号、余额、流水等信息)
======================欢迎使用=======================
'''

func_dict = {
    1: register,
    2: login,
    3: change_bank_info,
    4: get_balance,
    5: transfer,
    6: add_balance,
    7: check_flow,
    8: check_bank
}


def main():
    while True:
        print(func_menu)
        func_id = input("请输入功能ID :>>>> ").strip()
        if not func_id.isdigit():
            print(f"请输入合法的功能ID :>>>> {func_id}")
            continue
        func_id = int(func_id)
        if func_id not in func_dict:
            print(f"未找到对应的功能ID :>>>> {func_id}")
            continue
        func = func_dict.get(func_id)
        flag, msg = func()
        if flag:
            print(msg)
        else:
            print(msg)
            continue


main()
```

