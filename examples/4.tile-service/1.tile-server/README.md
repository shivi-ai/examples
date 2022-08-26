# Display stations on a map using a MVT response

Rendering stations on a map can be done performant and secure by using a tile service. In this example, the MVT response format will be used. MVT stands for Mapbox Vector Tiles and can be used on a Mapbox map.

## Requirements

- [Chargetrip API key](https://account.chargetrip.com) - to plot routes outside this region
- [Mapbox API key](https://www.mapbox.com) - to display the map
- [URQL](https://formidable.com/open-source/urql/) - a lightweight graphQL client

## Steps to take

1. To render the tiles a tile service URL is required and requests made to Mapbox need to be transformed. Transforming the request helps with setting headers and controlling the tiles caching mechanism.
2. After configuring the tile service URL and transforming the headers, it's required to set the filters. At least a `power` and `connector` filter needs to be present. This can be done by adding these as url query parameters.

## Next steps

MVT is one format, but the Chargetrip tile response also supports GeoJSON. This will be explained in the next example.
