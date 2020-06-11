# Display all stations with the Vector Tile Server

This tutorial explains how to show charging stations on a map by using the Vector Tile Server:

1. Using the Chargetrip Tile Service - a Vector Tile Server that offers a pre-rendered fully clustered charge station solution with the ability to filter stations;
2. Zooming in and recentering the map when clicking on a cluster;
3. Navigating between two different providers. EcoMovement and Open Charge Map.

This example is built with JS and requires a basic understanding of the GraphQL language. You can read this tutorial ["GraphQL starter guide"]() to see GraphQL in action.

### Technical stack

The Chargetrip API is built around GraphQL. If you aren't familiar with GraphQL, [going over the specs](https://graphql.org/learn/) will be helpful. Don't worry, you don't need to be an expert to use this API, this getting started guide should be enough to get going.

To see our Chargetrip API in action, you can go to the [Playground](https://playground.chargetrip.com/). It has a big collection of mutations/queries for you to experience the power of our API.

This example is built with vanilla JS. Only part of our extensive database is available. You need a registered `x-client-id` to access the full database. 

### Preparation

Our Playground has a station database that is populated with freely available European station data from [OCM](https://openchargemap.org/site). Importing your own database or using one of the databases Chargetrip has an integration with, is possible. For more details, contact us. This example shows all stations available within the Playground that have CHADEMO or IEC_62196_T2_COMBO connectors. 

### Technical stack

The Tile Service we use is [Clusterbuster](https://github.com/chargetrip/clusterbuster) - one of our open-source projects. Clusterbuster creates a faster way of loading a high amount of points (clustered and filtered) on a map using vector tiles.

### Steps to take

Our goal is to display stations on the map:

1. We have to fetch the stations from our Tile Server. You need to add a set of filters to the tile requests for rendering stations on your map. You can read all the details about the Tile Server in our [Graph API documentation](https://docs.chargetrip.com/#tile-service).
2. After we have accessed the tile server, we can show the stations on a map. We use [MapboxGL JS](https://docs.mapbox.com/mapbox-gl-js/overview/#quickstart) in this example.

### Useful links

1. Chargetrip API [docs](https://docs.chargetrip.com/)
2. Chargetrip API [playground](https://playground.chargetrip.com/)
3. Chargetrip API schema [information](https://voyager.chargetrip.com/)
4. Chargetrip Tile Service [docs](https://docs.chargetrip.com/#tile-service).
