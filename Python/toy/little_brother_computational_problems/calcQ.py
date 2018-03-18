import random
import re

mulTable = [str(a) + ',' + str(b) + ',' + str(a * b)
            for a in range(1, 10) for b in range(1, 10)]

productTable = [str(a * b) for a in range(1, 10) for b in range(1, 10)]

operator = ['+', '-', '×', '÷']

X, Y, Z, Res = 0, 0, 0, None
flag = 1

repat = '"\d,\d,"+str(Res)+"$"'

string = ''

op = [None, None]


def Search(Res):
    '''
    搜索口诀表
    '''
    lists = []
    for val in mulTable:
        lists += re.findall(eval(repat), val)
    return lists


def Addition(X, Y, Z, Res, flag):
    X = random.randint(1, 99)
    Y = random.randint(1, X)
    op = '+'
    if(Res):
        Z = random.randint(int(Res), 200)
        flag = 0
        Res += Z
        return [Z, Res, flag, op]
    else:
        Res = X + Y
        return [X, Y, Res, op]


def Subtraction(X, Y, Z, Res, flag):
    X = random.randint(3, 99)
    Y = random.randint(2, X - 1)
    op = '-'
    if(Res):
        Z = random.randint(1, int(Res))
        flag = 0
        Res -= Z
        return [Z, Res, flag, op]
    else:
        Res = X - Y
        return [X, Y, Res, op]


def Multiplication(X, Y, Z, Res, flag):
    X = random.randint(1, 9)
    Y = random.randint(1, 20)
    op = '×'
    if(Res):
        if len(str(Res)) <= 2:
            flag = 0
            Z = random.randint(1, 9)
            Res *= Z
        return [Z, Res, flag, op]
    else:
        Res = X * Y
        return [X, Y, Res, op]


def Division(X, Y, Z, Res, flag):
    a, b = random.randint(1, 9), random.randint(1, 9)
    X = a * b
    Y = a if random.randint(0, 1) == 1 else b
    op = '÷'
    if(Res):
        if str(Res) in productTable:
            flag = 0
            result = random.sample(Search(Res), 1)
            Z = result[0].split(',')[random.randint(0, 1)]
            Res /= int(Z)
        return [int(Z), int(Res), flag, op]
    else:
        Res = X / Y
        return [X, Y, Res, op]


def randFH(X, Y, Z, Res, flag):
    '''
    随机前半部分
    '''
    return operation[operator[random.randint(0, 3)]](X, Y, Z, Res, flag)


def randLH(X, Y, Z, Res, flag):
    '''
    随机后半部分
    '''
    return operation[operator[random.randint(0, 3)]](X, Y, Z, Res, flag)


def formatStr(X, Y, Z, op, Res):
    '''
    整理格式
    '''
    if type(Z) == str:
        print(op)
    if\
        (op[1] == operator[2] or
         op[1] == operator[3]) and\
        (op[0] == operator[0] or
         op[0] == operator[1]):
        if(Res):
            return '%-25s' % ('(%d %s %d) %s %d = %d' % (X, op[0], Y, op[1], Z, Res))
        else:
            return '%-25s' % ('(%d %s %d) %s %d =' % (X, op[0], Y, op[1], Z))
    else:
        if(Res != None):
            return '%-25s' % ('%d %s %d %s %d = %d' % (X, op[0], Y, op[1], Z, Res))
        else:
            return '%-25s' % ('%d %s %d %s %d =' % (X, op[0], Y, op[1], Z))

operation = {
    '+': Addition,
    '-': Subtraction,
    '×': Multiplication,
    '÷': Division
}

list1 = []
list2 = []

for i in range(50):
    Res = None
    flag = 1
    X, Y, Res, op[0] = randFH(X, Y, Z, Res, flag)
    while(flag):
        Z, Res, flag, op[1] = randLH(X, Y, Z, Res, flag)
    list1.append(formatStr(X, Y, Z, op, Res))
    list2.append(formatStr(X, Y, Z, op, None))
    if (i % 2) and (i > 0):
        list1.append('\n\n')
        list2.append('\n\n')
for item in list1:
    print(item, end=" ")
for item in list2:
    print(item, end=" ")
