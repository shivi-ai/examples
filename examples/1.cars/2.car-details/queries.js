import qql from 'graphql-tag';

export const getCarListQuery = qql`
query carList {
  carList(
    page: 0, 
    size: 12
  ) {
    id
    naming {
      make
      model
      chargetrip_version
    }
    media {
      image {
        thumbnail_url
      }
    }
  }
}
`;

export const getCarDetailsQuery = qql`
query car($carId: ID) {
  car(id: $carId) {
    naming {
      make
      model
      chargetrip_version
    }
    media {
      image {
        url
      }
      brand {
        thumbnail_url
      }
    }
    battery {
      usable_kwh
    }
    range {
      real
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
      chargetrip_range {
        best
        worst
      }
    }
    routing {
      fast_charging_support
    }
    connectors {
      standard
    }
    performance {
      acceleration
      top_speed
    }
  }
}
`;
