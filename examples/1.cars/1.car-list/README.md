# Query the car list

To start routing a car and consumption model is required. Learn how to provide a list of cars to be able to select the right consumption model.

## Requirements

- [Chargetrip API key](https://account.chargetrip.com) - to fetch all vehicles instead of a subset.
- A Mapbox API key - to display the map
- [URQL](https://formidable.com/open-source/urql/) - a lightweight graphQL client

## Steps to take

1. Use the `carList` query to retrieve a list of cars. GraphQL will allow for only fetching the fields that are needed. The filter and search argument can be used to improve the way of how to look up vehicles. Use the page and size argument to implement pagination. To improve performance even more, the thumbnail image of the vehicle is used.
2. After fetching the data, an `intersectionObserver` needs to be implemented to support endless scroll pagination.
3. With everything set up, it's time to render the list of cars alongside the filters and search onto the screen.

## Next steps

With the `carList` up and running, it's possible to retrieve additional car details. This will be explained in our next example.
