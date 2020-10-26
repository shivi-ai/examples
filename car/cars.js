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
      image: car.imagesData?.image?.url,
      range: `${car.chargetripRange.best ?? 'Unknown'} km`,
      plug: car.connectors?.[0]?.standard ?? 'Unknown',
    });
  });

  const template = document.getElementById('car-template').innerHTML;
  document.getElementById('cars').innerHTML = Mustache.render(template, {
    carProfile: profiles,
  });
};
