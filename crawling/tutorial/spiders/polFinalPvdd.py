import scrapy
from scrapy.spiders import CrawlSpider, Rule
from scrapy.linkextractors import LinkExtractor
from bs4 import BeautifulSoup
import urllib2
import re
from nltk import word_tokenize
import sys


class PoliticsSpider(scrapy.spiders.CrawlSpider):
    name = "polFinalPvdd"
    start_urls = ['https://www.partijvoordedieren.nl']
    allowed_domains = ["partijvoordedieren.nl"]
    rules = (
    	Rule(LinkExtractor(allow=("partijvoordedieren.nl/"), 
    		deny=()), follow=True, callback="parse_contents"),)
    	# Rule(LinkExtractor(allow=("http://www.pvv.nl/index.php/fracties/")), callback="parse_contents")

            # 'http://www.pvv.nl/in-de-media.html?start=950']
#tags=('a', 'link', 'li' 'area')
    def parse_contents(self, response):
    	html = response.body
    	d = {}
        soup = BeautifulSoup(html, "lxml")
        for script in soup(["script", "style"]):
            script.extract()
        text = soup.get_text().strip()
        letters_only = re.sub("[^a-zA-Z]", " ", text)
        letters_only = re.sub(" +", " ", letters_only)
        # Get only words (i.e. remove numbers and symbols)
        corpus_tokenized = []
        # Tokenize
        tokens0 = word_tokenize(letters_only.lower().decode('utf-8'))
        page = response.url.split("/")[-2]
        d[page] = tokens0
        return d


    # def visible(self, element):
    #     if element.parent.name in ['style', 'script', '[document]', 'head', 'title']:
    #         return False
    #     elif re.match('<!--.*-->', element.encode('utf-8')):
    #         return False
    #     return True
