import qql from 'graphql-tag';

export const getStationsAround = qql`
query stationAround($query: StationAroundQuery!){
  stationAround(
      query: $query
      size: 10
      page: 0
    ) {
      id
      external_id
      address
      location {
        type
        coordinates
      }
      elevation
      amenities
      power
      speed
      status
      }
  }
`;
