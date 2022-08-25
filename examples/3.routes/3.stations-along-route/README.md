# Mutate to display stations along a route

Whenever the recommended stations along the route are not enough, it's possible to show additional stations along the route. To render these, all that is needed is a radius along the route.

## Requirements

- [Chargetrip API key](https://account.chargetrip.com) - to plot routes outside this region
- [Mapbox API key](https://www.mapbox.com) - to display the map
- [URQL](https://formidable.com/open-source/urql/) - a lightweight graphQL client

## Steps to take

1. Plotting a route with stations along a route starts by executing the `newRoute` mutation. This mutation requires information about the car, origin and destination. To support stations along a route, the `stationsAlongRouteRadius` argument needs to be provided. After the mutation is finished executing a route id will be returned.
2. This `id` can be used to request route updates through the `routeUpdatedById` subscription. This subscription receives dynamic updates.
3. After the subscription returns `done` as status, the stationsAlongRoute field can be used to plot stations around the route on the map. Apart from the `stationsAlongRoute`, the `polyline` and `legs` object can be used to display the route and recommended charge stations on the map. Additional data such as distance, duration and consumption are also available.

## Next steps

With the stations along the route feature, there will always be a station around the corner. To improve the usability of these stations, preferred operators will be explained in the next step.
