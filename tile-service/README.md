# Display all stations with the Vector Tile Server

This tutorial explains how to show charging stations on a map by using the Vector Tile Server:

1. Using the Chargetrip Tile Service - a Vector Tile Server that offers a pre-rendered fully clustered charge station solution with the ability to filter stations.
2. Zooming in and recentering the map when clicking on a cluster.

This example is build with JS and requires the basic understanding of GraphQL language. You can read this tutorial ["GraphQL starter quide"]() to see GraphQL in action.

### Preparation

Our Playground has a station database that is populated with freely available European station data from [OCM](https://openchargemap.org/site). Importing your own database or using one of the databased Chargetrip has an integration with, is possible. For more details, contact us. This example will show all stations available within the playground that have CHADEMO or IEC_62196_T2_COMBO connectors.

### Technical stack

For this example we use [urql](https://formidable.com/open-source/urql/) - lightweight GraphQL client.
The Tile Service we use is based on Clusterbuster which is one of our open source projects. Clusterbuster creates a faster way of loading a high amount of points (clustered and filtered) on a map using Vector Tiles [Clusterbuster](https://github.com/chargetrip/clusterbuster).

### Steps to take

Once we have a station database, we can display the stations on the map:

1. We have to fetch the stations from our Tile Server. The Chargetrip Tile Service is a Vector Tile Server that offers a pre-rendered fully clustered charge station solution inlcluding filters to superchargers your station map. For rendering stations on your map, you need to add a set of filters to the tile requests. You can read all the details about the Tile Server in our [Graph API documentation](https://docs.chargetrip.com/#tile-service).
2. After we have accessed the tile server, we can show the stations on a map.

### Useful links

1. Chargetrip GraphAPI [docs](https://docs.chargetrip.com/);
2. Chargetrip GraphAPI [playground](https://playground.chargetrip.com/);
3. Chargetrip GraphAPI schema [information](https://voyager.chargetrip.com/);
4. Chargetrip Tile server [docs](https://docs.chargetrip.com/#tile-service);
