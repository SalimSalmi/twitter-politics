# -*- coding: utf-8 -*-
"""
Created on Tue Mar 28 12:16:09 2017

@author: abi
"""

import numpy as np
import pandas as pd
import scipy.cluster.hierarchy as clust
import graphlab as gl
from sklearn.cluster import AgglomerativeClustering
from sklearn import preprocessing

dataset = pd.read_csv('nokeys-filtered.csv')
encode_party = {"party":     {"vvd": 0, "sp": 1, "sgp" :2, "pvv" : 3, 
                              "pvda" : 4, "gl" : 5, "d66" : 6, "cu" : 7,
                              "cda" : 8, "50p" : 9}}

dataset.replace(encode_party, inplace=True)
dataset.head()
geo1 = np.array(dataset.iloc[:,2])
geo2 = np.array(dataset.iloc[:,3])
idUser = np.array(dataset.iloc[:,0])
party = np.array(dataset.iloc[:,1])
region = np.array(dataset.iloc[:,4])
listparty = np.array(party)


#encode_party=pd.Series(party2.tolist(), dtype = "category")

def normalize(array):
    normalized_array = []
    for i in array:
        register = i/float(max(array))
        normalized_array.append(register)
    return normalized_array
    
    
geo1_norm = np.array(normalize(geo1))
geo2_norm = np.array(normalize(geo2))
id_norm = np.array(normalize(idUser))
party_norm = np.array(normalize(party))
region_norm = np.array(normalize(region))


clustVal = np.column_stack((region_norm, party_norm))



preprocess_dataF = gl.SFrame({'geo1': geo1_norm,
                              'geo2': geo2_norm})

                            
amstParts = gl.nearest_neighbors.create(preprocess_dataF,
                                        features=['geo1','geo2'],
                                        distance=gl.distances.euclidean)

knn = amstParts.query(preprocess_dataF[:7], k = 35)

dendrogram = clust.dendrogram(clust.linkage(clustVal, method = 'complete'))

amsClust = AgglomerativeClustering(n_clusters = 8, affinity = 'cosine', 
                                   linkage = 'complete')
                                   
vectorClust = amsClust.fit_predict(clustVal)














                              







