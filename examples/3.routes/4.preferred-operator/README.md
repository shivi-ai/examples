# Plot a route based on operator preference

This tutorial covers how to plot a route that is based on operator preference. By using operator preference you can customize routes to exclude or prioritize certain station operators.

Certain use cases for when this could be used;

1. Support a certain level of payment compability
2. Prioritize stations that you are partnering with
3. Exclude stations that are not compatible with your car list

The operator list can be searched by name and filtered on alpha 2 based country codes. In this example we use a small subset of countries to filter the list. The full list can be found on our API schema.

To see this example live 👉 [demo](https://examples.chargetrip.com/?id=preferred-operator`).

### Technical stack

The Chargetrip API is built around GraphQL. If you're not familiar with GraphQL, [going over the specs](https://graphql.org/learn/) will be helpful. Don't worry, you don't need to be an expert to use this API, this getting started guide should be enough to get going.

To see our Chargetrip API in action, you can go to the [Playground](https://playground.chargetrip.com/). It has a big collection of mutations/queries for you to experience the power of our API.

This example is built with vanilla JS. To establish a connection with Chargetrip API, we use [urql](https://formidable.com/open-source/urql/) - lightweight GraphQL client. We use our Playground environment for this example. It means that only part of our extensive database is available. You need a registered `x-client-id` to access the full database.

### Steps to take

1. Query a route with default and hardcoded parameters.
2. Query a list of operators.
3. Configure the UI to allow for configuring operator preferences and exclusions.
4. Store preferences and update the route on request.

### Useful links

1. Chargetrip GraphAPI [docs](https://docs.chargetrip.com/);
2. Chargetrip GraphAPI [playground](https://playground.chargetrip.com/);
3. Chargetrip GraphAPI schema [information](https://voyager.chargetrip.com/).
