# Creat and display an isoline

This tutorial covers the basics of creating an isoline and showing how far a gien EV can travel:

1.  Create an isoline;
2.  show an isoline on the map;

To see this example live 👉 [demo](https://examples.chargetrip.com/?id=isolines/).

### Technical stack

The Chargetrip API is built around GraphQL. If you're not familiar with GraphQL, [going over the specs](https://graphql.org/learn/) will be helpful. Don't worry, you don't need to be an expert to use this API, this getting started guide should be enough to get going.

To see our Chargetrip API in action, you can go to the [Playground](https://playground.chargetrip.com/). It has a big collection of mutations/queries for you to experience the power of our API.

This example is built with vanilla JS. To establish a connection with Chargetrip API, we use [urql](https://formidable.com/open-source/urql/) - lightweight GraphQL client.
We use our Playground environment for this example. It means that only part of our extensive database is available. You need a registered `x-client-id` to access the full database.

### Preparation

To build an isoline, you will need a car (the associated consumption model of a vehicle will be applied to the isoline algorithm), and an origin.

For this example, we use **BMW i3s 94 Ah (2017 - 2018)** as the vehicle and **Frankfurt, Germany** as an origin.
Chargetrip operates an extensive database of EVs, each with their specific consumption models. You can find more information about our database and available queries by checking [Chargetrip API documentation](https://developers.chargetrip.com/API-Reference/Cars/introduction).

### Steps to take

Once we have selected a car and the amount of polygons, we can create an isoline:

1. We have to request an isoline. For that we use the `createIsoline` mutation. We will need to pass a car ID, origin and the amount of polygons. Adding season to the mutation is optional. As a result we will get an ID of a newly created isoline. You can read all about this mutation in our [Chargetrip API documentation](https://developers.chargetrip.com/API-Reference/isolines/mutate-isoline).
2. With an isoline ID we can request polygon information and show the isoline on a map. Keep in mind that it takes a bit longer for an isloine to calculate, we show a loading bar because of this reason. We use [MapboxGL JS](https://docs.mapbox.com/mapbox-gl-js/overview/#quickstart) in this example.

### Useful links

1. Chargetrip API [docs](https://developers.chargetrip.com/)
2. Chargetrip API Playground [playground](https://playground.chargetrip.com/)
3. Chargetrip API schema [information](https://voyager.chargetrip.com/).
