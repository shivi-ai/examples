# Display toll roads and ferries on your journey overview

This example will explain how to add ferries and toll roads to the journey overview in order to better inform users about what to expect.

## Requirements

- [Chargetrip API key](https://account.chargetrip.com) - to plot routes outside this region
- [Mapbox API key](https://www.mapbox.com) - to display the map
- [URQL](https://formidable.com/open-source/urql/) - a lightweight graphQL client

## Steps to take

1. Plotting a route starts with executing the `newRoute` mutation. This mutation requires information about the car, origin and destination. After the mutation is finished executing a route `id` will be returned.
2. Ferry steps are not split up by default. Inside `interface.js` it is first necessary to see if a leg contains a ferry route, and if so, to then split up the leg so as to more easily display it as a step on the journey overview.
3. It is also useful to check if the leg contains toll roads before rendering the entire journey overview, which has now been split into separate legs.

## Next steps

The last couple of examples explained most of the variables when it comes to routing. In the next step, the vector tile service is introduced.
