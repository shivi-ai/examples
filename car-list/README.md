# Query all cars from our database

This tutorial covers how to fetch cars from our database:

1.  query all cars using the Chargetrip GraphQL API;
2.  display information about the cars.

To see this example live 👉 [demo](https://chargetrip.github.io/examples/car/).

### Technical stack

The Chargetrip API is built around GraphQL. If you're not familiar with GraphQL, [going over the specs](https://graphql.org/learn/) will be helpful. Don't worry, you don't need to be an expert to use this API, this getting started guide should be enough to get going.

To see our Chargetrip API in action, you can go to the [Playground](https://playground.chargetrip.com/). It has a big collection of mutations/queries for you to experience the power of our API.

This example is built with vanilla JS. To establish a connection with Chargetrip API, we use [urql](https://formidable.com/open-source/urql/) - lightweight GraphQL client. We use our Playground environment for this example. It means that only part of our extensive database is available. You need a registered `x-client-id` to access the full database.

### Preparation

Our Playground gives you access to only 4 cars. Some car parameters are courtesy of our partner [EV Database](https://ev-database.org/). If you want to access the full database, please contact us.

### Steps to take

1. Query a list of all cars. Using GraphQL you can query only the data you need. You can read all the details about this query in our [Graph API documentation](https://docs.chargetrip.com/#getting-a-list-of-all-cars).
2. Show information about the cars.

### Useful links

1. Chargetrip GraphAPI [docs](https://docs.chargetrip.com/);
2. Chargetrip GraphAPI [playground](https://playground.chargetrip.com/);
3. Chargetrip GraphAPI schema [information](https://voyager.chargetrip.com/).
