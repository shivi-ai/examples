# Build a route with Chargetrip API

This tutorial covers a basics of building a simple route between an origin and a destination: 
 1. showing a route on a map; 
 2. showing charging stations and charging time information;
 3. showing information about whole journey duration;  
 4. showing information about energy consumption.   
 
This example is build with JS and requires the basic understanding of GraphQL language. You can read this tutorial ["GraphQL starter quide"]() to see GraphQL in action.  
You can see it up and running [here](https://chargetrip.github.io/examples/route/).     

### Preparation

To build a route, you will need a car (the associated consumption model of a car will be applied to the routing engine), station database, origin and a destination. 

For the purpose of this example, we use **Porsche Taycan**, **Berlin** as an origin and **Amsterdam** as a destination point. If you want to expand this example and select another car, please look in the [API documentation](https://docs.chargetrip.com/#cars) on how to do so. 

Our Playground has a station database that is populated with freely available European station data from [OCM](https://openchargemap.org/site) so you can try planning routes across Europe. Importing your own database or using one of the databased Chargetrip has an integration with, is possible. For more details, contact us.  

### Technical stack

For this example we use [urql](https://formidable.com/open-source/urql/) - lightweight GraphQL client. 


### Steps to take 

Once we have a car and station database, we can start planning the route: 

1. We have to request a new route. The `newRoute` mutation is used for that. We will need to pass car information, origin and destination. As a result we will get ID of a new route. You can read all the details about this mutation in our [Graph API documentation](https://docs.chargetrip.com/#request-a-new-route).   
2. With a route ID we can request route information. We will subscribe to a route update to receive dynamic updates for it (recommended route, alternative routes (if available), time duration, consumption etc). You can read all the details about this subscription in our [Graph API documentation](https://docs.chargetrip.com/#subscribe-to-route-updates).     
3. Having a route details, we can show a route on a map. To show stations, where a car must stop for charging, we use route ``legs`` object, where each leg is a station.   
4. We can also query route details for an information like total distance, duration of a trip, consumption etc. You can see all available fields to query in the [Chargetrip API documentation](https://docs.chargetrip.com/#get-route-details).
5. Final step is to show the route on a map. We use [MapboxGL JS](https://docs.mapbox.com/mapbox-gl-js/overview/#quickstart) in this example. 

### Useful links

1. Chargetrip GraphAPI [docs](https://docs.chargetrip.com/);
2. Chargetrip GraphAPI [playground](https://playground.chargetrip.com/);
3. Chargetrip GraphAPI schema [information](https://voyager.chargetrip.com/).
