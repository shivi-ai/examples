/**
 * To establish a connection with Chargetrip GraphQL API you need to have an API key.
 * The keys in this example are public and only provide access to a small part of our extensive database.
 * You need a registered `x-client-id` to access the full database.
 * Read more on how to get your own key in our documentation (https://docs.chargetrip.com/#authorisation).
 */
const headers = {
  //Replace this x-client-id and app-id with your own to get access to more cars
  'x-client-id': '5ed1175bad06853b3aa1e492',
  'x-app-id': '623998b2c35130073829b2d2',
};
export const getTiles = async (coord, zoom) => {
  return fetch(
    `https://api.chargetrip.io/station/${zoom}/${coord.x}/${coord.y}/tile.json?connectors[]=IEC_62196_T2&connectors[]=IEC_62196_T2_COMBO&connectors[]=TESLA_S&connectors[]=CHADEMO&powerGroups[]=fast&powerGroups[]=turbo`,
    {
      headers,
    },
  )
    .then(response => response.json())
    .then(data => {
      return data;
    })
    .catch(e => {
      console.log(e);
      return {};
    });
};
