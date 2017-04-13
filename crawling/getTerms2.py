import json
from pprint import pprint
from nltk import word_tokenize
import re
from nltk import FreqDist

# List of all words
corpus = ""
with open('/Users/user/Delft/IR/project/crawl/tutorial/quotes.json') as data_file:
	data = json.load(data_file)

# print data[13]['vacatures'][0:10]
for i in xrange(13):
	key = data[i].keys()[0]
	for j in xrange(len(data[i][key])):
		corpus = corpus + " " + data[i][key][j]

letters_only = re.sub("[^a-zA-Z]", " ", corpus)

tokens = word_tokenize(letters_only.lower().decode('utf-8'))
filter_str = "google facebook De gebruikt cookies en scripts van Google om de site continue te verbeteren. Ook gebruiken we na toestemming cookies en scripts van Facebook, YouTube en Visual Website Optimizor om je bezoek aan de website zo optimaal mogelijk te maken. Daarnaast maken we gebruik van advertising cookies voor het tonen van relevante advertenties. Meer informatie staat op onze cookie pagina."
filter_str = filter_str.translate(None, ".")
filter_list = filter_str.split(" ")

tokens = [x for x in tokens if x not in filter_list]


def print_top_words(n, corpus):

    print "there are in total {} words, and {} unique words".format(len(corpus), len(set(corpus)))    
    fdist = FreqDist(corpus);
    top_word_count = fdist.most_common(n)
    print "top words:"
    for top_word in top_word_count:
        print i, top_word[0], top_word[1]

def return_top_words(n, corpus):
	fdist = FreqDist(corpus);
	d = {}
    top_word_count = fdist.most_common(n)
    for x in xrange(len(top_word_count)):
    	d[top_word_count[x][0]] = d[top_word_count[x][1]]
   	return d
# print(len(tokens))
# sym_diff = set(tokens).symmetric_difference(set(filter_list))
# print(len(sym_diff))
# print type(list(sym_diff))
# count = 0
# for x in sym_diff:
# 	print x
# 	count += 1
# 	if count == 9:
# 		break
# tokens = list(set(tokens)^set(filter_list))

# print_top_words(50, list(tokens))

# set1 = set([1,1,2,3])
# set2 = set([2,3,5,6])
# print set1^set2



