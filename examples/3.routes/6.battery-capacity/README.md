# Update a route based on the battery capacity

Extending or limiting the battery capacity determines whether the routing will be conservative or aggressive. To make sure a charger or destination can be reached we advise to remain within the boundaries of -20% and +20% of the battery capacity.

## Requirements

- [Chargetrip API key](https://account.chargetrip.com) - to plot routes outside this region
- [Mapbox API key](https://www.mapbox.com) - to display the map
- [URQL](https://formidable.com/open-source/urql/) - a lightweight graphQL client

## Steps to take

1. Plotting a route based on battery capacity starts by executing the `newRoute` mutation. This mutation requires information about the car, origin and destination. To support changing the battery capacity, the `ev.battery.capacity` argument needs to be treated as a variable. After the mutation is finished executing a route `id` will be returned.
2. This `id` can be used to request route updates through the `routeUpdatedById` subscription. This subscription receives dynamic updates.
3. After the subscription returns `done` as status, the `polyline` and `legs` fields will be available. These can be used to display the route and charge stations on the map. Additional data such as distance, duration and consumption are also available.
4. Now the `ev.battery.capacity` will be tied to a slider in the UI. Every time the slider gets updated, a new route will be generated and displayed to show the impact.

## Next steps

Of course a car is not always at the same battery percentage. So apart from adjusting the battery capacity, the current state of charge can be set. How this is done, is explained in our next example.
