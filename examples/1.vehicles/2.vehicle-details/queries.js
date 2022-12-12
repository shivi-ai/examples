import qql from 'graphql-tag';

export const getVehicleListQuery = qql`
query vehicleList {
  vehicleList(
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

export const getVehicleDetailsQuery = qql`
query vehicle($vehicleId: ID!) {
  vehicle(id: $vehicleId) {
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
