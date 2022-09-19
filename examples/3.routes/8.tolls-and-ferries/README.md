# Display tolls and ferries on your journey overview

Does your route involve extra hassle such as ferries and/or tolls? It's simple to include these on the journey overview in order to better inform users about what to expect.

## Requirements

- [Chargetrip API key](https://account.chargetrip.com) - to plot routes outside this region
- [Mapbox API key](https://www.mapbox.com) - to display the map
- [URQL](https://formidable.com/open-source/urql/) - a lightweight graphQL client

## Steps to take

1. As we have previously covered, to display a route requires first a `newRoute` mutation, which returns a `routeId`, followed by a `routeUpdatedById` subscription in order to receive updates about the route.
2. Due to ferry steps being returned from the API within the same leg as regular steps, we can then split up the legs. Inside `interface.js` we first see if a leg contains a ferry route, and if so, we split up the leg so as to more easily display it as a step on the journey overview.
3. We also check if the leg contains tolls before rendering the entire journey overview, which we have now split into separate legs.

## Next steps

The last couple of examples explained most of the variables when it comes to routing. Next steps would be exploring the routing api reference to play around with occupants, different vehicles or even cargo.
