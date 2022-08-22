import qql from 'graphql-tag';

/*
 * In this example we request a route from Hanover, Germany to Nørresundby, Denmark
 * Your origin and destination are required fields. You also need to select an EV.
 * Only the EV ID here is mandatory, all other fields are optional and when not specified will use the default values.
 * The changing conditions are:
 *   - full battery at Amsterdam, Netherlands
 *   - EV can charge at CHAdeMO changers
 *   - should use climate (temperature and weather conditions)
 *   - min power of chargers is 43 kWh. This is the default setting
 *   - one passenger in the car (drive alone)
 *   - optionally a preferred operator selection which is used to compute a route aligned with the operator ranking
 */
export const createRouteQuery = qql`
mutation newRoute($type: RouteOperatorsType, $level1: [ID], $level2: [ID], $level3: [ID], $exclude: [ID]) {
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
          operators:{ 
            type: $type 
            ranking: { 
              level1: $level1
              level2: $level2
              level3: $level3
            }
            exclude: $exclude
          }
          origin: {
            type: Feature
            geometry: { type: Point, coordinates: [9.732625731357011, 52.3806314590276] }
            properties: { name: "Hanover, Germany" }

          }
          destination: {
            type: Feature
            geometry: { type: Point, coordinates: [9.922192327081783, 57.046057998779176] }
            properties: { name: "Aalborg, Denmark" }
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
      duration
      polyline
      legs{
        name
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

export const searchOperatorListQuery = qql`
query operatorList($page: Int, $size: Int, $search: String, $countries: [CountryCodeAlpha2!]) {
    operatorList(
        page: $page, 
        size: $size,
        search: $search,
        filter: {
          countries: $countries
        }
    ) {
      id
      name
    }
}
`;
