# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: http://doc.scrapy.org/en/latest/topics/item-pipeline.html

from bs4 import BeautifulSoup
import urllib2
import re
from nltk import word_tokenize
import sys
from scrapy import signals
from scrapy.exporters import CsvItemExporter

# class TutorialPipeline(object):
#     def process_item(self, item, spider):
    	



class TutorialPipeline(object):
  	# def process_item(self, item, spider):
  	# 	print len(item)
    def __init__(self):
        self.files = {}
    count = 0
    @classmethod
    def from_crawler(cls, crawler):
        pipeline = cls()
        crawler.signals.connect(pipeline.spider_opened, signals.spider_opened)
        crawler.signals.connect(pipeline.spider_closed, signals.spider_closed)
        return pipeline

    def spider_opened(self, spider):
        file = open('%s_products.csv' % spider.name, 'w+b')
        self.files[spider] = file
        self.exporter = CsvItemExporter(file)
        self.exporter.start_exporting()

    def spider_closed(self, spider):
        self.exporter.finish_exporting()
        file = self.files.pop(spider)
        file.close()

    def process_item(self, item, spider):
        self.exporter.export_item(item)
        sys.stderr.write(str(self.count)+ "\n\n")
        self.count += 1
        return item