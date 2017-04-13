import scrapy
from scrapy.spiders import CrawlSpider, Rule
from scrapy.linkextractors import LinkExtractor
from bs4 import BeautifulSoup
import urllib2
import re
from nltk import word_tokenize
import sys


class PoliticsSpider(scrapy.spiders.CrawlSpider):
    name = "pol3"
    start_urls = ['https://groenlinks.nl/standpunten']
    allowed_domains = ["groenlinks.nl"]
    rules = (
    	Rule(LinkExtractor(allow=("groenlinks.nl/"), 
    		deny=()), follow=True, callback="parse_contents"),)
    	# Rule(LinkExtractor(allow=("http://www.pvv.nl/index.php/fracties/")), callback="parse_contents")

            # 'http://www.pvv.nl/in-de-media.html?start=950']
#tags=('a', 'link', 'li' 'area')
    def parse_contents(self, response):

        soup = BeautifulSoup(response.body, 'html.parser')
        texts = soup.findAll(text=True)
        visible_texts = filter(self.visible, texts)
        return {response.url.split("/")[-2]: visible_texts}
    def visible(self, element):
        if element.parent.name in ['style', 'script', '[document]', 'head', 'title']:
            return False
        elif re.match('<!--.*-->', element.encode('utf-8')):
            return False
        return True