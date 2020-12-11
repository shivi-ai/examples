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
    ) {
      location {
        type
        coordinates
      }
      power
      speed
      status
      }
  }
`;
