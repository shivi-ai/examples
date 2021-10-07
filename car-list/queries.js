import qql from 'graphql-tag';

export const carListQuery = qql`
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
