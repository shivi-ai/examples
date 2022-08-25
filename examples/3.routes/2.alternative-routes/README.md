# Mutate to display alternative routes

One route is good, but three routes is better. That's why alternatives can be displayed alongside the preferred route. These alternatives are usually the next fastest route and are easy to implement.

## Requirements

- [Chargetrip API key](https://account.chargetrip.com) - to plot routes outside this region
- [Mapbox API key](https://www.mapbox.com) - to display the map
- [URQL](https://formidable.com/open-source/urql/) - a lightweight graphQL client

## Steps to take

1. Plotting alternative routes starts by executing the `newRoute` mutation. This mutation requires information about the car, origin and destination. After the mutation is finished executing a route `id` will be returned.
2. This `id` can be used to request route updates through the `routeUpdatedById` subscription. This subscription receives dynamic updates.
3. After the subscription returns `done` as status, the `route` and `alternatives` fields can be used to plot the routes on a map. Both are utilizing the same object so the `polyline` and the `legs` object are the ones to display a line and charge stations on a map. Additional data such as distance, duration and consumption can also be rendered per alternative. The route field will always be preferred over the alternatives.

## Next steps

Now that everything about basic routing is explained, it's time to add additional features to the route. Let's learn about stations along routes, preferred operators and more in the next examples.
