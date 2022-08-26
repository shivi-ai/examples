# Display stations on a map using a GeoJSON response

Rendering stations on a map can be done performant and secure by using a tile service. In this example, the GeoJSON response format will be used and displayed on Google Maps instance.

## Requirements

- [Chargetrip API key](https://account.chargetrip.com) - to plot routes outside this region
- [Google Maps API key](https://developers.google.com/maps) - to display the map
- [URQL](https://formidable.com/open-source/urql/) - a lightweight graphQL client

## Steps to take

1. To render the tiles a tile service URL is required and authorization headers need to be set.
2. After that, stations can be requested based upon the maps `zoom` level and the `x` and `y` coordinates of the tiles.
3. Doing this on each map update allows for having up-to-date states on every tile.
4. To make sure stations are being received provide at least a `power` and `connector` filter. Other filters are optional. These filters can be added as url query parameters.

## Next steps

With MVT and GeoJSON responses explained, there is not much left to cover on our tile service. Next steps would be playing around with filters and mabye rendering it on a different map provider.
