# Mutate to display route elevation data

Route elevation has impact on the battery performance. Having the elevation data at hand with segment details demonstrates this.

## Requirements

- [Chargetrip API key](https://account.chargetrip.com) - to plot routes outside this region
- [Mapbox API key](https://www.mapbox.com) - to display the map
- [URQL](https://formidable.com/open-source/urql/) - a lightweight graphQL client
- [Chart.js](https://www.chartjs.org/docs/latest/) - to display a graph

## Steps to take

1. Plotting elevation data starts by executing the `newRoute` mutation. This mutation requires information about the car, origin and destination. After the mutation is finished executing a route `id` will be returned.
2. This `id` can be used to request route updates through the `routeUpdatedById` subscription. This subscription receives dynamic updates.
3. After the subscription returns `done` as status, the `pathPlot` field will be available. It contains 100 segments which are rendered using the open source `chart.js` library. The `polyline` and `legs` object can be used to display the route and charge stations on the map. Additional data such as distance, duration and consumption are also available.

## Next steps

As seen in the example, route elevation impacts the battery performance. To be more conservative or aggressive on battery level, it might be useful to play with the capacity. This will be explained in the next example.
