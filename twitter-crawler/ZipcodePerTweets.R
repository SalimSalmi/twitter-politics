library(rgeos)
library(sp)
library(rgdal)

netherParts <- readOGR("buurt_2011_v3.shp", layer = "buurt_2011_v3")
amstParts <- subset(netherParts, GM_NAAM == 'Amsterdam')

tweetData = read.csv("nokeys-filtered-Result-HierarchicalV1.csv")

tweets <- data.frame(Longitude = tweetData$geo1,
                  Latitude = tweetData$geo2,
                  names = tweetData$party)

tweets2 <- data.frame(Longitude = tweetData$geo1,
                     Latitude = tweetData$geo2,
                     names = tweetData$party)

amstParts2 <- readOGR("amstParts54016.shp", layer = "amstParts54016")

coordinates(tweets) <- ~ Longitude + Latitude
tweets3 <- readOGR("tweets54016.shp", layer = "tweets54016")



datJoint <- over(tweets3, amstParts2)
datJoint1 <- over(amstParts2, tweets3)
