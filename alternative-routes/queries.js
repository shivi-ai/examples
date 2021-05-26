import qql from 'graphql-tag';

/*
 * In this example we request a route from Milan, Italy to Frankfurt, Germany
 * The changing conditions are:
 *   - The state of charge is 72.5 kwh
 *   - EV can charge at Tesla, CHADEMO and Type 2 changers
 *   - should use climate (temperature and weather conditions)
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
            geometry: { type: Point, coordinates: [9.180471169780414, 45.46866785869714] }
            properties: { name: "Milan, Italy" }

          }
          destination: {
            type: Feature
            geometry: { type: Point, coordinates: [8.691150976172072, 50.11546729917974] }
            properties: { name: "Frankfurt, Germany" }
          }
        }
      }
    )
  }
`;

export const queryRoute = qql`
query getRoute($id: ID!) {
  route(id: $id) {
    alternatives {
      polyline
      charges
      duration
      distance
      consumption
      chargeTime
      saving {
        money
        co2
      }
      legs{
        distance
        chargeTime
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
    route {
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
        distance
        chargeTime
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
    status
  }
}`;

export const routeUpdate = qql`
subscription routeUpdatedById($id: ID!){
  routeUpdatedById(id: $id) {
    status
    alternatives {
      type
      polyline
      charges
      duration
      distance
      consumption
      chargeTime
      saving {
        money
        co2
      }
      legs{
        distance
        chargeTime
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
    route {
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
        distance
        chargeTime
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
