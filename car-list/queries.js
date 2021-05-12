import qql from 'graphql-tag';

export const getCarList = qql`
query carList($page: Int, $size: Int, $search: String, $availability: [Int]) {
  carList(
    page: $page, 
    size: $size, 
    search: $search, 
    filter: {
      availability: $availability
    }
  ) {
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
