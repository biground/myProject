import urllib.request
import http.cookiejar
import re

# 视频编号
videoId = '2359557934'
# 第一条评论id
comId = '0'
url = 'http://video.coral.qq.com/varticle/' + videoId + '/comment/v2?callback=jQuery1124016684015458395196_1516080267273&orinum=10&oriorder=o&pageflag=1&cursor=' + \
    comId + '&scorecursor=0&orirepnum=2&reporder=o&reppageflag=1&source=9&_=1516080267276'

headers = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Encoding': 'gb2312,utf-8',
    'Accept-Language': 'zh-CN,zh;q=0.8,en-US;q=0.5,en,q=0.3',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36',
    'Connection': 'keep-alive',
    'referer': 'qq.com'
}

# 处理cookie
cjar = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cjar))
headall = []
for key, value in headers.items():
    item = (key, value)
    headall.append(item)
opener.addheaders = headall
urllib.request.install_opener(opener)


def craw(videoId, comId):
    """
    实现自动抓取对应评论网页并返回抓取数据
    """
    url = 'http://video.coral.qq.com/varticle/' + videoId + '/comment/v2?callback=jQuery1124016684015458395196_1516080267273&orinum=10&oriorder=o&pageflag=1&cursor=' + \
        comId + '&scorecursor=0&orirepnum=2&reporder=o&reppageflag=1&source=9&_=1516080267276'
    data = urllib.request.urlopen(url).read().decode('utf-8')
    return data

idpat = '"userid":"(.*?)"'
contentpat = '"content":"(.*?)"'
lastpat = '"last":"(.*?)"'

for i in range(1, 10):
    print('---------------------------------------------------')
    print('page:' + str(i))
    data = craw(videoId, comId)
    lastId = re.compile(lastpat, re.S).findall(data)
    idlist = re.compile(idpat, re.S).findall(data)
    contentlist = re.compile(contentpat, re.S).findall(data)
    for j in range(0, 10):
        try:
            userpat = '"userid":"' + str(idlist[j]) + '","nick":"(.*?)"'
            userlist = re.compile(userpat, re.S).findall(data)
            print('user:' + eval('u"' + userlist[0] + '"'))
            print('content:' + eval('u"' + contentlist[j] + '"'))
            print('\n')
        except Exception as err:
            print(err)
    comId = lastId[0]
