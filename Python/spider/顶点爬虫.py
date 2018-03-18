import urllib.request
import re
from lxml import etree


def getHtml(url):
    html = urllib.request.urlopen(url).read()
    return html


def getChapter(url):
    pass

# 章节信息
chapter = '//*[@id="list"]/dl/dd/a'
chapter_link = '//*[@id="list"]/dl/dd/a/@href'
chapter_title = '//*[@class="bookname"]/h1/text()'
chapter_content = '//*[@id="content"]/text()'
chapter_number = 0

# 网页信息
'''
将会扩充为搜索小说名字进行爬取
'''
web_url = 'http://www.booktxt.net'
novel_url = web_url + '/1_1439'

html = getHtml(novel_url)

# 创建html选择器，为xPath匹配做准备
selector = etree.HTML(html)
chapter_number = selector.xpath(chapter).__len__()
print(chapter_number)

chapter_link = selector.xpath(chapter_link)

for i in range(0, chapter_number):
    print('正在爬取第', i, '章')
    chapter_url = web_url + chapter_link[i]
    html = getHtml(chapter_url)
    selector = etree.HTML(html)
    html.replace('\xa0', ' ')
    print(html)
    fh2 = open('./修真聊天群.txt', 'a', encoding='utf-8')
    title = selector.xpath(chapter_title)[0]
    fh2.write('\n\n' + title + ' \n\n')
    content = selector.xpath(chapter_content)
    for j in content:
        # if j == '\r\n':
        #     continue
        fh2.write(j + ' ')
    fh2.close()
