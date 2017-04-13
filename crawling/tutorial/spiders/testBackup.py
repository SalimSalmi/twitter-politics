import scrapy
from scrapy.spiders import CrawlSpider, Rule
from scrapy.linkextractors import LinkExtractor
from bs4 import BeautifulSoup
import urllib2
import re
from nltk import word_tokenize
import sys


class PoliticsSpider(scrapy.spiders.CrawlSpider):
    name = "pol"
    start_urls = ['https://www.vvd.nl/']
    allowed_domains = ["vvd.nl"]
    rules = (
    	Rule(LinkExtractor(allow=("vvd.nl/"), 
    		deny=()), follow=True, callback="parse_contents"),)
    	# Rule(LinkExtractor(allow=("http://www.pvv.nl/index.php/fracties/")), callback="parse_contents")

            # 'http://www.pvv.nl/in-de-media.html?start=950']
#tags=('a', 'link', 'li' 'area')
    def parse_contents(self, response):
    	
    	d = {}
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
        d[page] = tokens0
        return d


    def visible(self, element):
        if element.parent.name in ['style', 'script', '[document]', 'head', 'title']:
            return False
        elif re.match('<!--.*-->', element.encode('utf-8')):
            return False
        return True
