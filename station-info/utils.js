export const ConnectorName = {
  CHADEMO: 'CHAdeMO',
  DOMESTIC_A: 'Domestic A (Nema)',
  DOMESTIC_B: 'Domestic B (Nema)',
  DOMESTIC_C: 'Domestic C (CEE)',
  DOMESTIC_D: 'Domestic D (IS)',
  DOMESTIC_E: 'Domestic E (CEE)',
  DOMESTIC_F: 'Domestic F (Schuko)',
  DOMESTIC_G: 'Domestic G (UK)',
  DOMESTIC_H: 'Domestic H (SI)',
  DOMESTIC_I: 'Domestic I (AS/MZS)',
  DOMESTIC_J: 'Domestic J (SEV)',
  DOMESTIC_K: 'Domestic K (DS)',
  DOMESTIC_L: 'Domestic L (CEI)',
  IEC_60309_2_single_16: 'CENELEC 16 (Single)',
  IEC_60309_2_three_16: 'CENELEC 16 (Three)',
  IEC_60309_2_three_32: 'CENELEC 32',
  IEC_60309_2_three_64: 'CENELEC 64',
  IEC_62196_T1: 'Type 1 (J1172)',
  IEC_62196_T1_COMBO: 'CCS 1',
  IEC_62196_T2: 'Type 2',
  IEC_62196_T2_COMBO: 'CCS 2',
  IEC_62196_T3A: 'Type 3A',
  IEC_62196_T3C: 'Type 3C',
  PANTOGRAPH_BOTTOM_UP: 'Panto Up',
  PANTOGRAPH_TOP_DOWN: 'Panto Down',
  TESLA_R: 'Tesla R',
  TESLA_S: 'Tesla',
};

export const ConnectorStatus = {
  FREE: 'free',
  BUSY: 'busy',
  UNKNOWN: 'unknown',
  ERROR: 'error',
};

export const Amenities = {
  coffee: 'Coffee',
  hotel: 'Hotel',
  museum: 'Museum',
  park: 'Park',
  playground: 'Playground',
  bathroom: 'Bathroom',
  restaurant: 'Restaurant',
  shopping: 'Shopping mall',
  supermarket: 'Supermarket',
  pharmacy: 'Pharmacy',
};

export const ParkingType = {
  ALONG_MOTORWAY: 'Along motorway',
  PARKING_GARAGE: 'Parking garage',
  PARKING_LOT: 'Parking lot',
  ON_DRIVEWAY: 'On driveway',
  ON_STREET: 'On street',
  UNDERGROUND_GARAGE: 'Underground garage',
};

export const getParkingType = type => ParkingType[type] || 'Unknown';
export const getAmenityName = type => Amenities[type] || 'Unknown';
export const getConnectorName = name => ConnectorName[name] || 'Unknown';

/* We don't provide icon for these plug types. The default plug icon is shown instead.*/
const noPlugIcon = [
  ConnectorName.IEC_60309_2_single_16,
  ConnectorName.IEC_60309_2_three_16,
  ConnectorName.IEC_60309_2_three_32,
  ConnectorName.IEC_60309_2_three_64,
  ConnectorName.PANTOGRAPH_BOTTOM_UP,
  ConnectorName.PANTOGRAPH_TOP_DOWN,
];
export const getConnectorIcon = standard =>
  `plug-${ConnectorName[standard] && noPlugIcon.indexOf(standard) === -1 ? standard.toUpperCase() : 'DEFAULT'}`;

/**
 * We are interested only in the availability of the station, so we first check if there are available connectors.
 *
 * @param charger
 * @returns {string} Status of a connector
 */
export const getConnectorStatus = charger => {
  if (charger.status.free) {
    return ConnectorStatus.FREE;
  } else if (charger.status.busy) {
    return ConnectorStatus.BUSY;
  } else if (charger.status.unknown) {
    return ConnectorStatus.UNKNOWN;
  } else {
    return ConnectorStatus.ERROR;
  }
};

export const getConnectorStatusLabel = status => {
  switch (status) {
    case ConnectorStatus.FREE:
      return 'Available';
    case ConnectorStatus.BUSY:
      return 'All in use';
    case ConnectorStatus.UNKNOWN:
      return 'Unknown';
    case ConnectorStatus.ERROR:
      return 'Broken';
  }
};
