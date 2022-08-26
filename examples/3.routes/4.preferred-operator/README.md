# Mutate to use preferred operators while routing

Operators are different. Think about payment methods, locations, charger experience. To take care of this, operators can be ranked and excluded. Either in the dashboard or in the API. In this example, the API approach will be demonstrated.

## Requirements

- [Chargetrip API key](https://account.chargetrip.com) - to plot routes outside this region
- [Mapbox API key](https://www.mapbox.com) - to display the map
- [URQL](https://formidable.com/open-source/urql/) - a lightweight graphQL client

## Steps to take

1. Plotting a route with preferred operators starts by executing the `newRoute` mutation. This mutation requires information about the car, origin and destination. To use preferred operators the `operators` argument needs to be configured. The `type` needs to be set as well as the `ranking` or `excluding`. After the mutation is finished executing a route `id` will be returned.
2. This `id` can be used to request route updates through the `routeUpdatedById` subscription. This subscription receives dynamic updates.
3. After the subscription returns `done` as status, a route with preferred operators will be returned. If there are no operator preferred stations available it will fallback on stations from other operators. If all stations on a segment are `excluded` a route can fail to compute. The `polyline` and `legs` object can be used to display the route and charge stations on the map. Additional data such as distance, duration and consumption are also available.

## Next steps

To take routes a step further, elevation plots and dynamic variables will be introduced. Let's head over to that.
