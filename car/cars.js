import Mustache from 'mustache';

/**
 * Display car details based on the data we get from the Chargetrip API.
 * @param cars {object} All cars we have fetched from the API
 */
export const displayCarsData = (cars = []) => {
  const profiles = [];

  cars.map(car => {
    profiles.push({
      make: car.make ?? 'Unknown',
      model: car.carModel ?? 'Unknown',
      image: car.images?.[0]?.url,
      range: `${car.range?.best?.city ?? 'Unknown'} km`,
      battery: `${car.batteryUsableKwh ?? 'Unknown'} kWh`,
      efficiency: `${car.batteryEfficiency?.average ?? 'Unknown'} kWh`,
      plug: car.connectors?.[0]?.standard ?? 'Unknown',
      cityMild: `${car.range?.best?.city ?? 'Unknown'} km`,
      cityCold: `${car.range?.worst?.city ?? 'Unknown'} km`,
      highwayMild: `${car.range?.best?.highway ?? 'Unknown'} km`,
      highwayCold: `${car.range?.worst?.highway ?? 'Unknown'} km`,
      combinedMild: `${car.range?.best?.combined ?? 'Unknown'} km`,
      combinedCold: `${car.range?.worst?.combined ?? 'Unknown'} km`,
      acceleration: `${car.acceleration ?? 'Unknown'} s`,
      topSpeed: `${car.topSpeed ?? 'Unknown'} Km/h`,
      power: `${car.power ?? 'Unknown'} KW`,
      torque: `${car.torque ?? 'Unknown'} Nm`,
    });
  });

  const template = document.getElementById('car-template').innerHTML;
  document.getElementById('cars').innerHTML = Mustache.render(template, {
    carProfile: profiles,
  });
};
