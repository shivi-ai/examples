# Query stations around

To display stations at a certain location and display them on a map, the stationAround query can be used. This query can be combined with some additional filters for more precise results.

## Requirements

- [Chargetrip API key](https://account.chargetrip.com) - to fetch stations all over Europe instead of a subset
- [Mapbox API key](https://www.mapbox.com) - to display the map
- [URQL](https://formidable.com/open-source/urql/) - a lightweight graphQL client

## Steps to take

1. Start by implementing the `stationAround` query. The `stationAround` query requires a GeoJSON location and the distance around this GeoJSON location as arguments. Optionally a `power` or `amenity` filter can be applied to plot stations that meet the requirements.
2. In this example the `distance`, `power` and `amenity` are dynamic. To do so, additional logic is written to request new data everytime one of these filters are updated.
3. With this logic in place, it's time to render the stations onto a map based on their location. The availability of the station will also be taken into account to show the differences on the map.

## Next steps

After stations are available on a map, fetching additional station data on interaction is a logical next step. So let's move onto the next example to fetch data such as chargers, predicted availability, amenities or operator details.
