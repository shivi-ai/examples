import qql from 'graphql-tag';

export const getCarList = qql`
query carList {
    carList(size: 10, page: 0) {
      id
      make
      carModel
      batteryUsableKwh
      connectors{
        standard
      }
      chargetripRange {
       best
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
      imagesData{
        image {
          type
          url
        }
      }
    }
  }
`;
