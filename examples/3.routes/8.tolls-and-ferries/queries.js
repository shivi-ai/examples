import qql from 'graphql-tag';
/*
 * In this example a route from Aalborg, Denmakr to Oslo, Norway is requested.
 * Origin and destination are required fields. An EV also needs to be selected.
 * Only the EV ID here is mandatory, all other fields are optional and when not specified will use the default values.
 * The changing conditions are:
 *   - 80% SoC at Aalborg, Denmark
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
        id: "5d161be5c9eef46132d9d20a", 
        climate: true
        occupants: 2
        plugs: { chargingPower: 150, standard: TESLA_S }
        adapters: [
          { chargingPower: 150, standard: IEC_62196_T2_COMBO }
          { chargingPower: 150, standard: CHADEMO }
        ]
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
        name
        rangeStartPercentage
        rangeEndPercentage
        chargeTime
        operatorName
        plugsAvailable
        stationId
        type
        duration
        distance
        steps {
          type
          distance
          duration
          polyline
        }
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
