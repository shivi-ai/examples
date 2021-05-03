import Mustache from 'mustache';

/**
 * Display car details based on the data we get from the Chargetrip API.
 * @param cars {object} All cars we have fetched from the API
 */
export const displayCarsData = (cars = []) => {
  const profiles = [];

  cars.map(car => {
    profiles.push({
      make: car.naming.make ?? 'Unknown',
      model: car.naming.model ?? 'Unknown',
      image: car.media?.image?.url,
      range: `${car.range.chargetrip_range.best ?? 'Unknown'} km`,
      battery: `${car.battery.usable_kwh ?? 'Unknown'} kWh`,
      plug: car.connectors?.[0]?.standard ?? 'Unknown',
      power: `${car.connectors?.[0]?.power ?? 'Unknown'} kWh`,
      adapter: car.adapters?.[0]?.standard ?? 'No adapter',
      adaptpower: car.adapters?.[0]?.power ? `${car.adapters?.[0]?.power + ' kwh'}` : '',
    });
  });

  const template = document.getElementById('car-template').innerHTML;
  document.getElementById('cars').innerHTML = Mustache.render(template, {
    carProfile: profiles,
  });
};
