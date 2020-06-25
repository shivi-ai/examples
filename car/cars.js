import Mustache from 'mustache';

/**
 * Display car details based on the data we get from the Chargetrip API.
 * @param cars {object} All cars we have fetched from the API
 */
export const displayCarsData = (cars = []) => {
  const profiles = [];

  cars.map(car => {
    profiles.push({
      make: car.make,
      model: car.carModel,
      image: car.images[0].url,
      range: car.range.best.city + ' km',
      battery: car.batteryUsableKwh + ' kWh',
      efficiency: car.batteryEfficiency.average + ' kWh',
      plug: car.connectors[0].standard,
      cityMild: car.range.best.city + ' km',
      cityCold: car.range.worst.city + ' km',
      highwayMild: car.range.best.highway + ' km',
      highwayCold: car.range.worst.highway + ' km',
      combinedMild: car.range.best.combined + ' km',
      combinedCold: car.range.worst.combined + ' km',
      acceleration: car.acceleration + ' s',
      topSpeed: car.topSpeed + ' Km/h',
      power: car.power + ' KW',
      torque: car.torque + ' Nm',
    });
  });

  const template = document.getElementById('car-template').innerHTML;
  document.getElementById('cars').innerHTML = Mustache.render(template, {
    carProfile: profiles,
  });
};
