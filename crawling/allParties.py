import getTerms
import operator

########
# Have to modify that 
# Should have incremental ints as keys as party names
# which are same as filenames as values
partyNums = {0: "50p", 1: "pvda"}
########
########


allTerms = {}
idfs = {}


# Loop over every party
# Return a nested dict 
# Outer dict k: int, v: dict
# Inner dict k: term, v: frequency
for x in xrange(len(partyNums)):
	allTerms[x] =  getTerms.getTerms("/Users/user/Delft/IR/project/crawl/tutorial/res/1100/" + partyNums[x]+'.json')
	# Save all idfs into a dict of dicts
	# Outer dict k: int, v: dict
	# Inner dict k: term, v: present or not
	idfs[x] = {}


# Get TFIDF for each term
# TF - how many times present in a domain - have that from top word count
# IDF - in how many domain is there that c
# Loop over every party
for x in xrange(len(allTerms)):
	# Loop over every word for the party
	for y in allTerms[x]:
		# initialise the count for the word
		idfs[x][y] = 0
		# Loop over every party in which the word could be
		for z in xrange(len(allTerms)):
			# If the term is present on a domain
			# Increment the count
			if y in allTerms[z]:
				 idfs[x][y] += 1

# Now that we have TFs from allTerms and IDFs get TFIDF
tfidf = {}
# For every party
for x in xrange(len(allTerms)):
	tfidf[x] = {};
	# For every word inside that party
	for y in allTerms[x]:
		tfidf[x][y] = float(allTerms[x][y])/idfs[x][y]
		# print y; print allTerms[x][y]; print idfs[x][y];print tfidf[x][y]

sorted_lists = {}
for x in xrange(len(tfidf)):
	sorted_lists[x] = sorted(tfidf[x].items(),key=operator.itemgetter(1), reverse = True);

# Set the number of terms shown per party
n = 30
for x in xrange(len(tfidf)):
	print "For party " + partyNums[x] + " the most unique terms based on tfidf are:"
	for y in xrange(n):
		print sorted_lists[x][y]
	print "\n"
