import scrapy
from scrapy.spiders import CrawlSpider, Rule
from scrapy.linkextractors import LinkExtractor
from bs4 import BeautifulSoup
import urllib2
import re
from nltk import word_tokenize
import sys


class QuotesSpider(scrapy.Spider):
    name = "quotes"
    content = []
    rules = (Rule(LinkExtractor(allow=("http://www.pvv.nl/"), deny=(), tags=('a', 'link', 'li' 'area')), callback='self.parse', follow=True),)
    start_urls = [
            'http://www.pvv.nl/in-de-media.html?start=0',
            # 'http://www.pvv.nl/in-de-media.html?start=950'
        ]




    def parse(self, response):
        soup = BeautifulSoup(response.body, 'html.parser')
        texts = soup.findAll(text=True)
        visible_texts = filter(self.visible, texts); type(visible_texts)
        names = []
        for element in xrange(len(visible_texts)):
            names.append(visible_texts[element])
        combined = ''
        for i in xrange(len(names)):
            combined = combined + ' ' + names[i];
        # Get only words (i.e. remove numbers and symbols)
        corpus_tokenized = []
        letters_only = re.sub("[^a-zA-Z]", " ", combined)
        # Tokenize
        tokens0 = word_tokenize(letters_only.lower().decode('utf-8'))
        page = response.url.split("/")[-2]
        filename = 'quotes-%s.html' % page
        self.content += tokens0
        sys.stderr.write("LOOK HERE\n\n" + str(len(self.content)) + "\n\n")

        with open('PVV', 'wb') as f:
            f.write(str(self.content))
    def visible(self, element):
        if element.parent.name in ['style', 'script', '[document]', 'head', 'title']:
            return False
        elif re.match('<!--.*-->', element.encode('utf-8')):
            return False
        return True
        #     f.write(response.body)
        # self.log('Saved file %s' % filename)

        # print response
        # page = response.url.split("/")[-2]
        # filename = 'quotes-%s.html' % page
        # with open(filename, 'wb') as f:
        #     f.write(response.body)
        # self.log('Saved file %s' % filename)

