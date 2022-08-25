# Query station details

To query the details of astation, a station `id` is required. This can be passed into the `station` query. From there, amenities, predicted availability and other details can be used.

## Requirements

- [Chargetrip API key](https://account.chargetrip.com) - to fetch stations all over Europe instead of a subset
- [Mapbox API key](https://www.mapbox.com) - to display the map
- [URQL](https://formidable.com/open-source/urql/) - a lightweight graphQL client

## Steps to take

1. Just like the previous example, the `stationAround` query is used to display stations around a GeoJSON location.
2. With stations available on the map, click interactions can be added.
3. A click handler on the station icon will initiate the `station` query. This example will request the chargers, amenities, predicted availability and operator details. More fields are available within the API reference.
4. After receiving the data, it will be rendered on the screen.

## Next steps

After stations are available on a map, fetching additional station data on interaction is a logical next step. So let's move onto the next example to fetch data such as chargers, predicted availability, amenities or operator details.
