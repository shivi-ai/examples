# Display all stations with the Vector Tile Server

This tutorial explains how to show charging stations on a map by using the Chargetrip Vector Tile Server:

1. The Chargetrip Tile Server offers a pre-rendered fully clustered charge station solution with the ability to filter stations;
2. Zoom in/out and recenter the map when clicking on a cluster;
3. This example shows stations from two different providers: EcoMovement and Open Charge Map.

To see this example live 👉 [demo](https://chargetrip.github.io/examples/tile-server/?provider=eco#eco).

### Technical stack

The Chargetrip API is built around GraphQL. If you aren't familiar with GraphQL, [going over the specs](https://graphql.org/learn/) will be helpful. Don't worry, you don't need to be an expert to use this API, this getting started guide should be enough to get going.

To see our Chargetrip API in action, you can go to the [Playground](https://playground.chargetrip.com/). It has a big collection of mutations/queries for you to experience the power of our API.

This example is built with vanilla JS. Only part of our extensive database is available. You need a registered `x-client-id` to access the full database.

The Tile Service we use is [Clusterbuster](https://github.com/chargetrip/clusterbuster) - one of our open-source projects. Clusterbuster creates a faster way of loading a high amount of points (clustered and filtered) on a map using vector tiles.

### Steps to take

This examples uses the Chargetrip Tile Service to show the stations on the map. Our Tile Service is not only super fast, but also secures the data of our providers, like EcoMovement. This example shows only part of EcoMovement database. If you want to use a full database, please contact us.

1. We have to fetch the stations from our Tile Server. You need to add a set of filters to the tile requests for rendering stations on your map. You can read all the details about the Tile Server in our [Graph API documentation](https://docs.chargetrip.com/#tile-service). In this example we fetch stations with either a CHADEMO or IEC_62196_T2_COMBO connector. You can see them in the request.
2. After we have accessed the tile server, we can show the stations on a map. We use [MapboxGL JS](https://docs.mapbox.com/mapbox-gl-js/overview/#quickstart) in this example.

### Useful links

1. Chargetrip API [docs](https://docs.chargetrip.com/)
2. Chargetrip API [playground](https://playground.chargetrip.com/)
3. Chargetrip API schema [information](https://voyager.chargetrip.com/)
4. Chargetrip Tile Service [docs](https://docs.chargetrip.com/#tile-service).
