# Query the details of a vehicle

After building a vehicle list in the previous example, it's time to learn more about the details of a vehicle. This example serves as a guide on how to display vehicle specific data such as range, performance and images.

## Requirements

- [Chargetrip API key](https://account.chargetrip.com) - to fetch all vehicles instead of a subset.
- [Mapbox API key](https://www.mapbox.com) - to display the map
- [URQL](https://formidable.com/open-source/urql/) - a lightweight graphQL client

## Steps to take

1. First use the simplified `vehicleList` query to render a list of vehicles.
2. Based upon the vehicle `id`, additional data can be requested by using the `vehicle` query.
3. After receiving the additional vehicle data, it can be displayed in the user interface. This time around, the full vehicle image is being used.

## Next steps

Now that the vehicle features are explained, it is useful to take a look at stations in the next examples. After the station examples, the fundamentals for EV routing are explained, which allows for actual EV routing.
