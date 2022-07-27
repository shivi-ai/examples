import qql from 'graphql-tag';

/*
 * In this example we request a isoline with Hanover, Germany as point of origin.
 * Your origin is a required field. You also need to select an EV.
 * Season and polygon_count are optional
 * The conditions are:
 *   - origin Hanover, Germany
 *   - The EV is a BMW i3s 94 Ah (2017-2018)
 *   - season is summer
 *   - polygon count is 3
 */
export const createIsoline = qql`
mutation createIsoline {
  createIsoline(
    input: {
      vehicle_id: "5d161beec9eef4c250d9d225"
      origin: {
        type: Feature
        geometry: { type: Point, coordinates: [9.9936818, 53.5510846] }
        properties: { name: "Hamburg, Germany" }
      }
      polygon_count: 3
      season: summer
    }
  )
}
`;

export const isolineSubscription = qql`
subscription createIsoline($id: ID!){
  isoline(id: $id) {
      status
      polygons{
        type
        geometry{
          coordinates
        }
        properties{
          index
        }
      }
      polygon_count
      season
      origin{
        geometry{
          coordinates
        }
      }
    }
  }
`;
