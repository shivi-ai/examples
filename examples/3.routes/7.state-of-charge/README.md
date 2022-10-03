# Update a route based on the state of charge

A car is not always fully charged and in the same location. That's why the state of charge can be treated as a variable. By hooking it up to a slider the impact on a route becomes visible.

## Requirements

- [Chargetrip API key](https://account.chargetrip.com) - to plot routes outside this region
- [Mapbox API key](https://www.mapbox.com) - to display the map
- [URQL](https://formidable.com/open-source/urql/) - a lightweight graphQL client

## Steps to take

1. Plotting a route based on battery capacity starts by executing the `newRoute` mutation. This mutation requires information about the car, origin and destination. To support changing the battery capacity, the `ev.battery.stateOfCharge` argument needs to be treated as a variable. After the mutation is finished executing a route `id` will be returned.
2. This `id` can be used to request route updates through the `routeUpdatedById` subscription. This subscription receives dynamic updates.
3. After the subscription returns `done` as status, the `polyline` and `legs` fields will be available. These can be used to display the route and charge stations on the map. Additional data such as distance, duration and consumption are also available.
4. Now the `ev.battery.stateOfCharge` will be tied to a slider in the UI. Every time the slider gets updated, a new route will be generated and displayed to show the impact.

## Next steps

In this last example, it's possible to see how a route is impacted by a car's state of charge. The next step will cover how to add ferries and toll roads to the journey overview.
