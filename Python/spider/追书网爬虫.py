import urllib.request
import re
from lxml import etree


def getHtml(url):
    html = urllib.request.urlopen(url).read().decode(
        'utf-8', 'ignore')
    return html


def getChapter(url):
    pass

# 章节信息/html/body/div[6]/dl/dd[2]/a
chapter = '//*[@id="list"]/dl/dd/a'
chapter_link = '//*[@id="list"]/dl/dd/a/@href'
chapter_title = '//*[@class="bookname"]/h1/text()'
chapter_content = '//*[@id="content"]/text()'
chapter_number = 0

# 网页信息
'''
将会扩充为搜索小说名字进行爬取
'''
web_url = 'https://www.zhuishu.tw'
novel_url = web_url + '/id14322/'

html = getHtml(novel_url)

# 创建html选择器，为xPath匹配做准备//*[@id="main"]/h1
selector = etree.HTML(html)
chapter_number = selector.xpath(chapter).__len__()
print(chapter_number)

chapter_link = selector.xpath(chapter_link)

for i in range(0, chapter_number):
    print('正在爬取第', i, '章')
    chapter_url = web_url + chapter_link[i]
    html = getHtml(chapter_url)
    selector = etree.HTML(html)
    fh2 = open('./我的老婆是双胞胎.txt', 'a', encoding='utf-8')
    title = selector.xpath(chapter_title)[0]
    fh2.write('\n' + title + ' \n')
    content = selector.xpath(chapter_content)
    for j in content:
        fh2.write('\n\n' + j)
    fh2.close()
