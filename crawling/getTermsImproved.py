import json
from nltk import word_tokenize
import re
from nltk import FreqDist
import datetime


def print_top_words(n, corpus):
    print "there are in total {} words, and {} unique words".format(len(corpus), len(set(corpus)))
    fdist = FreqDist(corpus);
    top_word_count = fdist.most_common(n)
    print "top words:"
    for top_word in top_word_count:
        print i, top_word[0], top_word[1]


def return_top_words(corpus):
    # Process a tokenized list (corpus)
    # print type(corpus)
    # print len(corpus)
    # print corpus
    fdist = FreqDist(corpus);
    # Transform what will otherwise be a tuple output into a dict
    d = {};
    # Get the tuples
    top_word_count = fdist.most_common();
    # Make them into a dictionary k: word v: count
    for x in xrange(len(top_word_count)):
        # print type(str(top_word_count[x][0]))
        d[str(top_word_count[x][0])] = int(top_word_count[x][1])
    # print d
    # print len(d)
    # with open('/Users/user/Delft/IR/project/crawl/tutorial/res/test3.txt', 'w+') as out:
    #     for x in d:
    #         out.write(str(x)+": " + str(d[x])+'\n')
    # print len(d)
    return d

def getTerms(input):
    # Takes in a json file with every entry visible content for one page as a string
    # And outputs a list of tokens (multiple instances of a word allowed)
    # t = datetime.datetime.now()

    # List of all words
    corpus = ""

    # I'm not 100% sure everything I do is needed, but for some reason all pages already come pseudo-tokenized.
    # To get rid of any non-alphabetic chars i still make everything into a string
    # And then filter and retokenize

    # Load json as a list (list entries which are dicts,
    # in which k: name of the page v: list of individual tokens)
    with open(input) as data_file:
        data = json.load(data_file)
        # print len(data)
    # return {3:'no'}
    # Add every page in a domain into a long string essentially making a long document that
    # is the content of the whole domain
    # Loop over every entry
    # print type(data)
    # key = data[0].keys()[0]
    # print type(data[0][key])
    filter_str = "google facebook De gebruikt cookies en scripts van Google om de site continue te verbeteren. Ook gebruiken we na toestemming cookies en scripts van Facebook, YouTube en Visual Website Optimizor om je bezoek aan de website zo optimaal mogelijk te maken. Daarnaast maken we gebruik van advertising cookies voor het tonen van relevante advertenties. Meer informatie staat op onze cookie pagina."
    filter_str = filter_str.lower().translate(None, ".")
    filter_list = filter_str.split(" ")
    stoplist1 = ['media', 'facebook', 'partij', 'cookies', 'youtube', '']
    with open('/Users/user/Delft/IR/project/crawl/tutorial/stopwords/dutch') as w:
        stoplist2 = w.readlines()
        stoplist2 = [x.rstrip() for x in stoplist2]
        filter_list = list(set(stoplist1 + stoplist2))
    with open('/Users/user/Delft/IR/project/crawl/tutorial/internetwords.txt') as w:
        stoplist2 = w.readlines()
        stoplist2 = [x.rstrip().lower() for x in stoplist2]
        filter_list = list(set(filter_list + stoplist2))
    stoplist3  = ["nieuws", "thema", "s", "partijnieuws", "end", "tab", "nav", "begin", "tab", "panes", "item", "image",
                 "item", "image", "nico", "de", "vos", "weer", "lid", "van", "plus", "lees", "meer", "item", "image",
                 "item", "image", "zorgmedewerkers", "verdienen", "respect", "en", "collega", "s", "erbij", "lees",
                 "meer", "item", "image", "item", "image", "wiebes", "belooft", "verbetering", "belastingtelefoon",
                 "lees", "meer", "item", "image", "item", "image", "beoordelingscriteria", "voor", "een", "coalitie",
                 "lees", "meer", "item", "image", "item", "image", "meer", "wijkagenten", "vergroten", "het", "gevoel",
                 "van", "veiligheid", "lees", "meer", "item", "image", "item", "image", "stoppen", "met", "bezuinigen",
                 "op", "openbaar", "vervoer", "lees", "meer", "item", "image", "item", "image", "niet", "indexeren",
                 "pensioenen", "is", "niet", "uit", "te", "leggen", "lees", "meer", "item", "image", "item", "image",
                 "knokken", "tot", "de", "laatste", "stembus", "gesloten", "is", "lees", "meer", "item", "image",
                 "item", "image", "groningse", "bedrijven", "doen", "het", "zelf", "lees", "meer", "item", "image",
                 "item", "image", "in", "drie", "jaar", "euro", "aan", "giften", "lees", "meer", "item", "image",
                 "item", "image", "ellende", "aardbevingen", "solidair", "oplossen", "lees", "meer", "item", "image",
                 "item", "image", "piratenpartij", "schiet", "met", "losse", "flodders", "lees", "meer", "end", "tab",
                 "panes", "standpunten", "hoe", "denkt", "plus", "over", "koopkracht", "pensioenen", "en", "de", "aow",
                 "en", "over", "zorg", "wonen", "en", "veiligheid", "klik", "doe", "mee", "doe", "mee", "en", "steun",
                 "plus", "word", "lid", "doe", "een", "gift", "word", "vrijwilliger", "spotlight", "spotlight",
                 "spotlight", "spotlight", "standpunten", "hoe", "denkt", "plus", "over", "koopkracht", "pensioenen",
                 "en", "de", "aow", "en", "over", "zorg", "wonen", "en", "veiligheid", "klik", "doe", "mee", "doe",
                 "mee", "en", "steun", "plus", "word", "lid", "doe", "een", "gift", "word", "vrijwilliger", "spotlight",
                 "spotlight", "sections", "plus", "in", "de", "provincie", "plus", "in", "de", "gemeente", "plus", "in",
                 "het", "waterschap", "klik", "hier", "om", "vandaag", "nog", "lid", "te", "worden", "de", "tweede",
                 "kamerfractie", "van", "plus", "v", "l", "n", "r", "corrie", "van", "brenk", "henk", "krol", "l",
                 "onie", "sazias", "en", "martin", "van", "rooijen", "alle", "kinderen", "moeten", "overal", "ter",
                 "wereld", "naar", "school", "kunnen", "corrie", "van", "brenk", "en", "henk", "krol", "nemen",
                 "daarover", "een", "petitie", "in", "ontvangst", "henk", "krol", "wordt", "toegezongen", "door", "het",
                 "amsterdams", "volkskoor", "op", "de", "verkiezingsavond", "van", "plus", "volop", "media", "aandacht",
                 "bij", "de", "eerste", "fractievergadering", "na", "de", "verkiezingen", "trek", "aan", "de", "bel",
                 "voor", "het", "liliane", "fonds", "met", "kamerlid", "corrie", "van", "brenk", "deze", "grafiek",
                 "zegt", "alles", "de", "koopkrachtontwikkeling", "tussen", "en", "cijfers", "cpb", "grafiek",
                 "rabobank", "foot", "navigation", "spotlight", "contactgegevens", "plus", "postbus", "cg", "den",
                 "haag", "telefoon", "email", "mail", "info", "pluspartij", "n", "l", "volg", "plus", "partij",
                 "beginselverklaring", "statuten", "organogram", "huishoudelijk", "reglement", "beroepscommissie",
                 "handreiking", "integriteit", "spotlight", "foot", "navigation",
                  'canvas', 'topbar', 'handheld', 'inline', 'ios', 'feature', 'toggle', 'injection', 'query', 'spambots',
                  'meta', 'main', 'sidebar', 'footer', 'article', 'via', 'script', 'for', 'header', 'js', 'head',
                  'googlecode', 'respond', 'system', 'trunk', 'display', 'html', 'plugin', 'use', 'like', 'javascript',
                  'analytics', 'typo', 'maxserv', 'overlay', 'markup', 'licensed', 'renders', 'extensions', 'viewhelpers',
                  'menu', 'contact', 'owners', 'disclaimers', 'copyright', 'early', 'initially', 'video', 'placeholder',
                  'under', 'contribution', 'noindex', 'foldout', 'dashboard', 'customize', 'tooltip', 'div', 'button',
                  'arrow', 'inner', 'disclosure', 'wordpress', 'artikel', 'com', 'twitter', 'scripts', 'advertising',
                  'false', 'website', 'lsdexception', 'iframe', 'accepteer', 'vimeo', 'rss', 'contact', 'content',
                  'semihidden', 'cloudflare', 'endif', 'ie', 'html', 'section', 'alt', 'img', 'browsehappy', 'window',
                  'contains', 'trunk', 'javascripts', 'assets', 'required', 'upgrade', 'podcast',
                  'tweet', 'whatsapp', 'linkedin', 'google', 'inschrijven', 'doneer', 'close', 'kamer', 'plannen',
                  'artikelen', 'welkom', 'achternaam', 'voornaam', 'contributie', 'nieuwsbrief', 'adres',
                  'mailadres', 'politiek', 'partijen', 'mediacontactpublicatiese', 'onsmediacontactpublicatiese',
                  'homeactueelnieuwseerlijk', 'mijnieuwsvideo', 'disclaimer','publicaties', 'direct', 'actueel',
                  'mediaradiocolumnspublicatiesnieuwsbrievennieuwsflitsenartikelenlinksbekijk','parlement',
                  'menuhomeover', 'scroll', 'wordenactueelblogagendanieuwsbriefpartijorganisatiepartijstructuurmissie',
                  'svideo', 'bestuurlokaalkandidatenfoto', 'obj', 'follow', 'endstream', 'sitemap', 'cookie',
                  'href', 'labels', 'privacybeleid', 'quote', 'http', 'inloggen', 'help', 'sluiten', 'open', 'tweet',
                  'publicatie', 'menunieuws', 'menustandpunten', 'agenda', 'home', 'nieuwe', 'english', 'pagina',
                  'visual', 'cookiebeleid', 'shopprinting', 'pvdaprivacy', 'bijpvda', 'developed', 'pvdaeuropa',
                  'doneer', 'flickr', 'ajax', 'google', 'mailadres', 'forms', 'max', 'site', 'geaccepteerd',
                  'nbeginpagina', 'talentmanagement', 'privacyprotocol', 'logic', 'should', 'privacy', 'adresgegevens',
                  'akkoord', 'this', 'the', 'slidelayouts', 'slidelayout', 'left', 'and', 'ppt', 'francais', 'deutsch',
                  'downloads', 'abc', 'agenda', 'spnet', 'spword', 'share', 'enable', 'even', 'mei', 'januari',
                  'oktober', 'juni', 'februari', 'december', 'september', 'maart', 'april', 'juli', 'augustus',
                  'november', 'december', 'maand', 'jaar', 'visual', 'cookiebeleid', 'priority', 'continue',
                  'printing', 'shop', 'informatie', 'shading', 'forms', 'true', 'xobject', 'cheap', 'sluit', 'wij',
                  'submenu', 'mijnpvda', 'gravity', 'foto', 'amsterdam', 'webmail', 'handle', 'standpunt', 'purposes',
                  'powered', 'webshop', 'namethis', 'phonethis', 'emailthis', 'commentsthis', 'webnl', 'jan',
                  'writing', 'doneren', 'winkel', 'communicatie', 'contactpagina', 'rotterdam', 'fractie', 'programma',
                  'enter', 'your', 'categorie', 'reacties']
    filter_list = list(set(filter_list + stoplist3))

    tokens = []
    for x in xrange(len(data)):
        key = data[x].keys()[0]
        l = data[x][key]
        l = [re.sub("[^a-zA-Z]", "", y).lower() for y in l]
        # print "Original: " + str(len(l))
        l = [y for y in l if y not in filter_list and len(y) > 2 and len(y) < 15]

        tokens = tokens + l
        # print  "Updated: " + str(len(l))

    d = return_top_words(tokens)
    # print d
    # print d
    return d
    # print datetime.datetime.now() - t
#
# q = {}
#
# getTerms('/Users/user/Delft/IR/project/crawl/tutorial/res/1100/vvd.json')
# print len(q[0])
    # # Now we have a long string, which is filtered for non alphabetic
    # letters_only = re.sub("[^a-zA-Z]", " ", corpus).lower()
    # # Tokenized
    # tokens = word_tokenize(letters_only.lower().decode('utf-8'))
    # # Getting rid of non-political words that kept popping up on pvda
    # filter_str = "google facebook De gebruikt cookies en scripts van Google om de site continue te verbeteren. Ook gebruiken we na toestemming cookies en scripts van Facebook, YouTube en Visual Website Optimizor om je bezoek aan de website zo optimaal mogelijk te maken. Daarnaast maken we gebruik van advertising cookies voor het tonen van relevante advertenties. Meer informatie staat op onze cookie pagina."
    # filter_str = filter_str.lower().translate(None, ".")
    # filter_list = filter_str.split(" ")
    # # Load a list of dutch stopwords
    # with open('/Users/user/Delft/IR/project/crawl/tutorial/stopwords/dutch') as w:
    #     stopwords = w.readlines()
    #     stopwords = [x.rstrip() for x in stopwords]
    # # Combine two filter lists
    # filter_list = list(set(filter_list + stopwords))

    # filter_list = list(set(filter_list + stopwords))
    #
    # # Get tokens that are not in the filter list
    # tokens = [x for x in tokens if x not in filter_list]
    # # Get a dictionary of word: count
    # d = return_top_words(tokens)
    # return d
    #
    #

# def getTerms2(input):
#     return 'SUCCESS'