# Display all stations with the Vector Tile Server

This tutorial explains how to show charging stations on a map by using the Vector Tile Server:

1. Using the Chargetrip Tile Service - a Vector Tile Server that offers a pre-rendered fully clustered charge station solution with the ability to filter stations.
2. Zooming in and recentering the map when clicking on a cluster.

This example is built with JS and requires a basic understanding of the GraphQL language. You can read this tutorial ["GraphQL starter guide"]() to see GraphQL in action.

### Preparation

Our Playground has a station database populated with freely available European station data from [OCM](https://openchargemap.org/site). Importing your database or using one of the databases Chargetrip has an integration with is possible. For more details, contact us. This example shows all stations available within the Playground that have CHADEMO or IEC_62196_T2_COMBO connectors.

### Technical stack

The Tile Service we use is a [Clusterbuster](https://github.com/chargetrip/clusterbuster) - one of our open-source projects. Clusterbuster creates a faster way of loading a high amount of points (clustered and filtered) on a map using vector tiles.

### Steps to take

Our goal is to display stations on the map:

1. We have to fetch the stations from our Tile Server. You need to add a set of filters to the tile requests for rendering stations on your map.
   You can read all the details about the Tile Server in our [Graph API documentation](https://docs.chargetrip.com/#tile-service).
2. After we have accessed the tile server, we can show the stations on a map. We use [MapboxGL JS](https://docs.mapbox.com/mapbox-gl-js/overview/#quickstart) in this example.

### Useful links

1. Chargetrip GraphAPI [docs](https://docs.chargetrip.com/);
2. Chargetrip GraphAPI [playground](https://playground.chargetrip.com/);
3. Chargetrip GraphAPI schema [information](https://voyager.chargetrip.com/);
4. Chargetrip Tile Service [docs](https://docs.chargetrip.com/#tile-service);
