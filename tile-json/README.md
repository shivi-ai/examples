# Display all stations with the Vector Tile Service

This tutorial guides you through the process of showing charging stations on a map by using the GeoJSON response from the Chargetrip Tile Service:

1. The Chargetrip Tile Service offers a pre-rendered fully clustered charge station solution with the ability to filter stations;
2. Zoom in/out and recenter the map when clicking on a cluster;
3. This example shows stations from the EcoMovement provider.

To see this example live 👉 [demo](https://chargetrip.github.io/examples/tile-json/).

### Technical stack

The Chargetrip API is built around GraphQL. If you aren't familiar with GraphQL, [going over the specs](https://graphql.org/learn/) will be helpful. Don't worry, you don't need to be an expert to use this API, this getting started guide should be enough to get going.

To see our Chargetrip API in action, you can go to the [Playground](https://playground.chargetrip.com/). It has a big collection of mutations/queries for you to experience the power of our API.

This example is built with vanilla JS. Only part of our extensive database is available. You need a registered `x-client-id` to access the full database.

### Steps to take

The Chargetrip Tile Service supports both `mvt` and `GeoJSON` responses. This example shows how to use the `GeoJSON` response on Google Maps. Our Tile Service is not only super fast, but also secures the data of our providers, like EcoMovement. This example shows only part of EcoMovement database. If you want to use a full database, please contact us.

1. We have to fetch the stations from our Tile Service. You need to add a set of filters to the tile requests for rendering stations on your map. You can read all the details about the Tile Service in our [Graph API documentation](https://developers.chargetrip.com/API-Reference/Tile-Service/introduction). In this example we fetch stations with either a CHADEMO or IEC_62196_T2_COMBO connector. You can see them in the request.
2. After we have accessed the tile service, we can show the stations on a map. We use the [Google Maps Javascript API](https://developers.google.com/maps/documentation/javascript?hl=nl) in this example.

### Useful links

1. Chargetrip API [docs](https://developers.chargetrip.com/)
2. Chargetrip API [playground](https://playground.chargetrip.com/)
3. Chargetrip API schema [information](https://voyager.chargetrip.com/)
4. Chargetrip Tile Service [docs](https://developers.chargetrip.com/API-Reference/Tile-Service/introduction).
