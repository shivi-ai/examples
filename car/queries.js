import qql from 'graphql-tag';

export const getCarList = qql`
query carList {
    carList(size: 10, page: 0) {
      id
      externalId
      make
      carModel
      batteryUsableKwh
      connectors{
        standard
      }
      range {
        wltp
        best {
          highway
          city
          combined
        }
        worst {
          highway
          city
          combined
        }
      }
      batteryEfficiency {
        average
        best {
          highway
          city
          combined
        }
        worst {
          highway
          city
          combined
        }
      }
      power
      acceleration
      topSpeed
      torque
      images{
        type
        url
      }
    }
  }
`;
