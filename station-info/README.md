# Fetch station details with Chargetrip API

This tutorial explains how to fetch station details and suggests how to parse the data.  
To see this example live 👉 [demo](https://chargetrip.github.io/examples/station-info).

### Technical stack

The Chargetrip API is built around GraphQL. If you aren't familiar with GraphQL, [going over the specs](https://graphql.org/learn/) will be helpful. Don't worry, you don't need to be an expert to use this API, this getting started guide should be enough to get going.

To see our Chargetrip API in action, you can go to the [Playground](https://playground.chargetrip.com/). It has a big collection of mutations/queries for you to experience the power of our API.

This example is built with vanilla JS. To establish a connection with Chargetrip API, we use [urql](https://formidable.com/open-source/urql/) - lightweight GraphQL client.
We use our Playground environment for this example. Our Playground has a station database that is populated with freely available European station data from [OCM](https://openchargemap.org/site). It means that only part of our extensive database is available. You need a registered `x-client-id` to access the full database. Importing your own database or using one of the databases Chargetrip has an integration with, is possible. For more details, please contact us.

### Steps to take

To get stations around a location and fetch specific station details:

1. We need to use `stationAround` query. We need to pass the information about a geojson point, and the distance we want to search in. In addition to this we can also add the power we would like the stations to have or specify which amenities should be around. As a result we will get a list of stations that meet our requirements. You can read all the details about this query in our [Graph API documentation](https://docs.chargetrip.com/#get-stations-around-a-geojson-point).
2. Now we can show stations on the map.
3. Click on s station will fetch its details. We use `station` query for that. You can specify what data you would like to get back. You can read all the details about this query in our [Graph API documentation](https://docs.chargetrip.com/#get-single-station-data).
4. Each station has information about the charging speed and the availability. This information is useful if you want to display different icons base on the type of the station or its availability.

### Useful links

1. Chargetrip GraphAPI [docs](https://docs.chargetrip.com/);
2. Chargetrip GraphAPI [playground](https://playground.chargetrip.com/);
3. Chargetrip GraphAPI schema [information](https://voyager.chargetrip.com/).
