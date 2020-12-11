import qql from 'graphql-tag';

/*
 * In this example we request a route from Amsterdam, Netherlands to Berlin, Germany
 * Your origin and destination are required fields. You also need to select an EV.
 * Only the EV ID here is mandatory, all other fields are optional and when not specified will use the default values.
 * The changing conditions are:
 *   - full battery at Amsterdam, Netherlands
 *   - EV can charge at CHAdeMO changers
 *   - should use climate (temperature and weather conditions)
 *   - min power of chargers is 43 kWh. This is the default setting
 *   - one passenger in the car (drive alone)
 */
export const createRoute = qql`
mutation newRoute{
    newRoute(
      input: {
        ev: {
          id: "5d161be5c9eef46132d9d20a"
          plugs: { chargingPower: 150, standard: TESLA_S }
          adapters: [
            { chargingPower: 150, standard: IEC_62196_T2_COMBO }
            { chargingPower: 150, standard: CHADEMO }
          ]
          climate: true
          numberOfPassengers: 1
        }
        routeRequest: {
          origin: {
            type: Feature
            geometry: { type: Point, coordinates: [4.8951679, 52.3702157] }
            properties: { name: "Amsterdam, Netherlands" }

          }
          destination: {
            type: Feature
            geometry: { type: Point, coordinates: [13.3888599, 52.5170365] }
            properties: { name: "Berlin, Germany" }
          }
        }
      }
    )
    }
`;

export const routeUpdate = qql`
subscription routeUpdatedById($id: ID!){
  routeUpdatedById(id: $id) {
    status
    route {
      distance
      elevationPlot
      elevationUp
      elevationDown
      polyline
      legs{
        distance
        origin{
          geometry{
            type
            coordinates
          }
        }
        destination{
          geometry
          {
            type
            coordinates
          }
        }
      }
    }
  }
}
`;

export const queryRoute = qql`
query getRoute($id: ID!) {
  route(id: $id) {
    status
    route {
      distance
      elevationPlot
      elevationUp
      elevationDown
      id
      polyline
      legs{
        distance
        origin{
          geometry{
            type
            coordinates
          }
        }
        destination{
          geometry
          {
            type
            coordinates
          }
        }
      }
    }
  }
}`;

export const getRoutePath = (id, location) => `
{
    routePath(
      id: "${id}"
      location: { type: Point, coordinates: [${location}] }
    ) {
      elevation
      averageSpeed
      consumptionPerKm
    }
}`;
