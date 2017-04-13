import pysal as ps
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.preprocessing import scale
from sklearn.preprocessing import MinMaxScaler
import geopandas as gpd
from sklearn.metrics import *

#Assigning each tweet to a party
df = pd.read_csv('TweetsWithZipcode.csv', names=['ID', 'Party', 'Lat', 'Long', 'Region', 'Label', 'POSTCODE'])
l = ["vvd","d66" ,"gl","sp","cu","cda","pvda","pvv","sgp", "50p"]
for col in l:
    df[col] = 0
for tweet in range(0,185):
    if df['Party'][tweet] == 'vvd':
        df['vvd'][tweet] = 1
    elif df['Party'][tweet] == 'd66':
        df['d66'][tweet] = 1
    elif df['Party'][tweet] == 'gl':
        df['gl'][tweet] = 1
    elif df['Party'][tweet] == 'sp':
        df['sp'][tweet] = 1
    elif df['Party'][tweet] == 'cu':
        df['cu'][tweet] = 1
    elif df['Party'][tweet] == 'cda':
        df['cda'][tweet] = 1
    elif df['Party'][tweet] == 'pvda':
        df['pvda'][tweet] = 1
    elif df['Party'][tweet] == 'pvv':
        df['pvv'][tweet] = 1
    elif df['Party'][tweet] == 'sgp':
        df['sgp'][tweet] = 1
    elif df['Party'][tweet] == '50p':
        df['50p'][tweet] = 1

 
# Computing the number of tweets per party per postcode and polygon
df_post = df.groupby('POSTCODE')[l].sum().rename(lambda x: str(int(x)))

# Half polygons with shared zipcode
df_post.loc['1012'] = df_post.loc['1012']/2
df_post.loc['1017'] = df_post.loc['1017']/2
df_post.loc['1013'] = df_post.loc['1013']/2
df_post.loc['1051'] = df_post.loc['1051']/2
df_post.loc['1071'] = df_post.loc['1071']/2
df_post.loc['1077'] = df_post.loc['1077']/2
df_post.loc['1078'] = df_post.loc['1078']/2
df_post.loc['1091'] = df_post.loc['1091']/2


# Computing the total nuber of tweets per polygon
index = df_post.index.values
sums = []
for x in xrange(len(index)):
    sums.append(sum(df_post.loc[index[x],]))
df2 = pd.DataFrame({"Total":sums}, index = index)
df2 = pd.concat([df_post, df2], axis = 1)


# # Defining dict with political position for each party in range [0-1] representing left-right
vals = {'vvd':0.75,'d66':0.5, 'gl':0, 'sp':0, 'cu':0.5, "cda":0.75, 'pvda':0.25, 'pvv':1, 'sgp':1, '50p':0.5}


# Make a new df adding the total number and the political alignment attribute
sums = []
for x in xrange(len(index)):
    dSum = 0
    for y in vals.keys():
        dSum += df_post.loc[index[x],y] * vals[y]
    sums.append(float(dSum)/df2.loc[index[x],'Total'])
sums = pd.DataFrame({"Pol_align":sums}, index = index)
# sums
scores = pd.concat([df2, sums], axis = 1)
scores
zc = gpd.read_file('amstParts28992.shp')
zc['geometry']
zsc = zc[['geometry', 'POSTCODE']].join(scores, on='POSTCODE')\
                                 .dropna()

#Weight spatial matrix
W = ps.weights.KNN.from_dataframe(zsc, k=3)

#Max-p algorithm
attr = np.array([[e] for e in list(zsc["Pol_align"])])
fl = np.array([np.array([q]) for q in list(zsc["Total"])])
maxp = ps.region.Maxp(W, attr, floor =7, floor_variable = fl, initial=10000)
print(maxp.p)
#Regionalization output file
zsc_2= zsc
zsc_2['index1'] = zsc_2.index
zsc_2['Region'] = zsc_2['index1'].map(maxp.area2region)
zsc_2.to_csv('regions.csv')
