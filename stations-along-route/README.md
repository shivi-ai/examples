# Build a route with Chargetrip API that shows alternative stations

This tutorial covers the basics of building a simple route between an origin and a destination:

1.  show a route on a map;
2.  show charging stations and information about the journey;
3.  show alternative charging stations.

To see this example live 👉 [demo](https://chargetrip.github.io/examples/stations-along-route/).

### Technical stack

The Chargetrip API is built around GraphQL. If you're not familiar with GraphQL, [going over the specs](https://graphql.org/learn/) will be helpful. Don't worry, you don't need to be an expert to use this API, this getting started guide should be enough to get going.

To see our Chargetrip API in action, you can go to the [Playground](https://playground.chargetrip.com/). It has a big collection of mutations/queries for you to experience the power of our API.

This example is built with vanilla JS. To establish a connection with Chargetrip API, we use [urql](https://formidable.com/open-source/urql/) - lightweight GraphQL client.
We use our Playground environment for this example. It means that only part of our extensive database is available. You need a registered `x-client-id` to access the full database.

### Preparation

To build a route, you will need a car (the associated consumption model of a vehicle will be applied to the routing algorithm), station database, origin, and a destination.

For this example, we use **Tesla model S**, **Amsterdam** as an origin, and **Osnabrück** as a destination point.
Chargetrip operates an extensive database of EVs, each with their specific consumption models. You can find more information about our database and available queries by checking [Chargetrip API documentation](https://docs.chargetrip.com/#cars).

Our Playground has a station database that is populated with freely available European station data from [OCM](https://openchargemap.org/site). Importing your own database or using one of the databases Chargetrip has an integration with, is possible. For more details, contact us.

### Steps to take

Once we have a car and station database, we can start planning the route:

1. We have to request a new route. For that we use the `newRoute` mutation. We will need to pass information about the car, origin and destination. As a result we will get an ID of a newly created route. In order to show stations along a route, we need to add `stationsAlongRouteRadius` to our mutation and give it a radius between 500 and 5000 meters. You can read all the details about this mutation in our [Chargetrip API documentation](https://docs.chargetrip.com/#request-a-new-route).
2. With a route ID we can request route information. We will subscribe to a route update to receive dynamic updates for it (recommended route, alternative routes (if available), time duration, consumption etc). You can read all the details about this subscription in our [Graph API documentation](https://docs.chargetrip.com/#subscribe-to-route-updates).
3. Having the route details we can show a route on a map. To show stations, where a car must stop for charging, we use the route `legs` object.
4. We can also query route details for information like total distance, duration of a trip, consumption etc. You can see all available fields to query in the [Chargetrip API documentation](https://docs.chargetrip.com/#get-route-details).
5. We can now show the route on a map. We use [MapboxGL JS](https://docs.mapbox.com/mapbox-gl-js/overview/#quickstart) in this example.
6. Finally we can use the `stationsAlongRoute` object tot display alternative stations.

### Useful links

1. Chargetrip API [docs](https://docs.chargetrip.com/)
2. Chargetrip API Playground [playground](https://playground.chargetrip.com/)
3. Chargetrip API schema [information](https://voyager.chargetrip.com/).
