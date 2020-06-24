import qql from 'graphql-tag';

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
