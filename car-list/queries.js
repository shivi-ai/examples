import qql from 'graphql-tag';

export const getCarList = qql`
query carList($page: Int, $size: Int, $search: String) {
  carList(page: $page, size: $size, search: $search) {
    id
    naming {
      make
      model
      version
      edition
      chargetrip_version
    }
    media {
      image {
        thumbnail_url
        thumbnail_height
        thumbnail_width
      }
    }
  }
}
`;
