import urllib.request
import re


def getContent(url, page):
    """
    爬取某一页所有的段子信息
    """

    # 伪装成浏览器
    headers = ('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36')
    opener = urllib.request.build_opener()
    opener.addheaders = [headers]
    # 将opener安装到全局
    urllib.request.install_opener(opener)
    data = urllib.request.urlopen(url).read().decode('utf-8')
    # 正则表达式
    userpat = '<h2>(.*?)</h2>'
    contentpat = '<div class="content">(.*?)</div>'
    # 找到所有的内容
    userlist = re.compile(userpat, re.S).findall(data)
    contentlist = re.compile(contentpat, re.S).findall(data)
    x = 1
    for content in contentlist:
        content = content.replace('\n', '')
        name = 'content' + str(x)
        exec(name + '=content')
        x += 1

    y = 1
    for user in userlist:
        name = 'content' + str(y)
        print('用户' + str(page) + str(y) + '是：' + user)
        print('内容是：')
        exec('print(' + name + ')')
        print('\n')
        y += 1

for i in range(1, 30):
    url = 'http://www.qiushibaike.com/8hr/page/' + str(i)
    getContent(url, i)
