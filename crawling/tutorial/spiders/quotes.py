import scrapy
from bs4 import BeautifulSoup
import nltk
import re
class QuotesSpider(scrapy.Spider):
    name = "quotes1"

    def start_requests(self):
        urls = [
            'https://www.christenunie.nl'
        ]
        for url in urls:
            yield scrapy.Request(url=url, callback=self.parse)

    def parse(self, response):
        html = response.body
        # soup = BeautifulSoup(response.body, 'html.parser')
        # texts = soup.findAll(text=True)
        # visible_texts = filter(self.visible, texts); type(visible_texts)
        # print visible_texts
        soup = BeautifulSoup(html, "lxml")
        # header = soup.find("div", {"id": "header"})
        # if not header:
        #     print "Went into if"
        #     header = soup.find("header", {"class": "header"})
        # try:
        #     for script in header(["script", "style"]):
        #         script.extract()
        # except:
        # header = header.get_text().rstrip()
        # print header
        for script in soup(["script", "style"]):
            script.extract()
        text = soup.get_text().rstrip()
        letters_only = re.sub("[^a-zA-Z]", " ", text)
        letters_only = re.sub(" +", " ", letters_only)
        # print type(letters_only)
        # print type(letters_only)
        print letters_only

