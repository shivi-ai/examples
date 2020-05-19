# Build a station map with Chargetrip API

This tutorial covers a basics of building a simple station map: 
 1. showing a stations on a map; 
 2. showing what kind of station it is and what its status is
 
This example is build with JS and requires the basic understanding of GraphQL language. You can read this tutorial ["GraphQL starter quide"]() to see GraphQL in action.    

### Preparation 

Our Playground has a station database that is populated with freely available European station data from [OCM](https://openchargemap.org/site). Importing your own database or using one of the databased Chargetrip has an integration with, is possible. For more details, contact us.  

### Technical stack

For this example we use [urql](https://formidable.com/open-source/urql/) - lightweight GraphQL client. 


### Steps to take 

Once we have a station database, we can display the stations on the map: 

1. We have to query the stations around a geojson point. The `stationAround` query is used for that. We will need to pass information about a geojson point, and the distance you want to search in. In addition to this you can also add the power you would like the stations to have or what amenities should be around. As a result we will get a list of stations that meet your requirements. You can read all the details about this query in our [Graph API documentation](https://docs.chargetrip.com/#get-stations-around-a-geojson-point).        
2. With the station details we can show the stations on a map. To show the stations we need the ``location`` object, where the coordinates are stored.   
3. We can also get information about the charging speed and the availabilty of a charging station. This we can use to display different icons for different charging stations. 

### Useful links

1. Chargetrip GraphAPI [docs](https://docs.chargetrip.com/);
2. Chargetrip GraphAPI [playground](https://playground.chargetrip.com/);
3. Chargetrip GraphAPI schema [information](https://voyager.chargetrip.com/).
