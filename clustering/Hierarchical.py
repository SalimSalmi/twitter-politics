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


dataset = pd.read_csv('keys-final(2).csv')
datasetclust = pd.read_csv('hierarchical.csv')

geo1 = np.array(dataset.iloc[:,2])
geo2 = np.array(dataset.iloc[:,3])
party = np.array(dataset.iloc[:,4])
region_clust = np.array(datasetclust.iloc[:,4])
party_clust = np.array(datasetclust.iloc[:,5])


def normalize(array):
    normalized_array = []
    for i in array:
        register = i/float(max(array))
        normalized_array.append(register)
    return normalized_array
    
    
geo1_norm = np.array(normalize(geo1))
geo2_norm = np.array(normalize(geo2))
party_norm = np.array(normalize(party))
region_clustnorm = np.array(normalize(region_clust))
party_clustnorm = np.array(normalize(party_clust))

clustVal = np.column_stack((region_clustnorm, party_clustnorm))



preprocess_dataF = gl.SFrame({'geo1': geo1_norm,
                              'geo2': geo2_norm})

                            
amstParts = gl.nearest_neighbors.create(preprocess_dataF,
                                        features=['geo1','geo2'],
                                        distance=gl.distances.euclidean)

knn = amstParts.query(preprocess_dataF[:20], k = 450)

dendrogram = clust.dendrogram(clust.linkage(clustVal, method = 'complete'))

amsClust = AgglomerativeClustering(n_clusters = 16, affinity = 'cosine', linkage = 'complete')
vectorClust = amsClust.fit_predict(clustVal)














                              







