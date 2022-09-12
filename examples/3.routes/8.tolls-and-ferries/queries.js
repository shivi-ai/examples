import qql from 'graphql-tag';
/*
 * In this example we request a route from Oslo, Norway to Aalborg, Denmark
 * Your origin and destination are required fields. You also need to select an EV.
 * Only the EV ID here is mandatory, all other fields are optional and when not specified will use the default values.
 * The changing conditions are:
 *   - 75.5% SoC at Oslo, Norway
 *   - EV can charge at CHAdeMO changers
 *   - should use climate (temperature and weather conditions)
 *   - min power of chargers is 43 kWh. This is the default setting
 *   - one passenger in the car (drive alone)
 */
export const createRouteQuery = qql`
mutation newRoute{
  newRoute(
    input: {
      ev: { 
        id: "5d161be8c9eef43905d9d216", 
        plugs: { chargingPower: 150, standard: TESLA_S }
        adapters: [
          { chargingPower: 150, standard: IEC_62196_T2_COMBO }
          { chargingPower: 150, standard: CHADEMO }
        ]
        battery: { stateOfCharge: { value: 80, type: percentage } }, 
        climate: true, occupants: 1 
      }
      routeRequest: {
        origin: {
          type: Feature
          geometry: { type: Point, coordinates: [9.935932, 57.046707] }
          properties: { name: "Aalborg, Denmark" }
        }
        destination: {
          type: Feature
          geometry: { type: Point, coordinates: [10.757933, 59.911491] }
          properties: { name: "Oslo, Norway" }
        }
      }
    }
  )
}
`;

export const routeUpdateSubscription = qql`
subscription routeUpdatedById($id: ID!){
  routeUpdatedById(id: $id) {
    status
    route {
      tags
      charges
      saving {
        money
        co2
      }
      chargeTime
      distance
      duration
      consumption
      polyline
      legs{
        chargeTime
        origin{
          geometry{
            type
            coordinates
          }
          properties
        }
        destination{
          geometry
          {
            type
            coordinates
          }
          properties
        }
      }
    }
  }
}
`;
