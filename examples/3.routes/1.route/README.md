# Mutate to create a new route

Stations and cars are fun, but it's time to take a look at routing. In this first example the basics will be explained. It will serve as a starting point for more complex routing examples.

## Requirements

- [Chargetrip API key](https://account.chargetrip.com) - to plot routes outside this region
- [Mapbox API key](https://www.mapbox.com) - to display the map
- [URQL](https://formidable.com/open-source/urql/) - a lightweight graphQL client

## Steps to take

1. Plotting a route starts by executing the `newRoute` mutation. This mutation requires information about the car, origin and destination. After the mutation is finished executing a route `id` will be returned.
2. This `id` can be used to request route updates through the `routeUpdatedById` subscription. This subscription receives dynamic updates.
3. After the subscription returns done as status, data can be rendered onto the screen. The `polyline` and the `legs` object will be used to display charge stations on the map. Total distance, duration of a trip, consumption are displayed on the side.

## Next steps

This example provides the basis for all upcoming routing examples. More features such as alternative routes, stations along a route, preferred operators and an elevation plot will be added on top of this.
