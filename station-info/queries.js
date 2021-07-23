import qql from 'graphql-tag';

/**
 * For this query we are requesting data about a specific station
 */
export const getStationData = qql`
query station($stationId: ID!){
  station(id: $stationId) {
    id
    name
    coordinates {
      latitude
      longitude
    }
    parking_type
    operator {
      name
    }
    opening_times {
      twentyfourseven
    }
    chargers {
      standard
      power
      price
      speed
      status {
        free
        busy
        unknown
        error
      }
      total
    }
    physical_address {
      continent
      country
      county
      city
      street
      number
      postalCode
      what3Words
      formattedAddress
    }
    amenities
    status
  }
}
`;

/**
 * For this query we are requesting the 20 closest stations.
 * The default for this query is 10.
 */
export const getStationsAround = qql`
query stationAround($query: StationAroundQuery!){
  stationAround(
      query: $query
      size: 20
      page: 0
    ) {
      id
      location {
        type
        coordinates
      }
      status
      speed
    }
  }
`;
