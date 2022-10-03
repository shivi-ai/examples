export function parseSeconds(secs) {
  const hours = Math.floor(secs / 3600);
  const minutes = Math.floor((secs % 3600) / 60);
  return { hours, minutes };
}

/**
 * Gets minutes and hours from a duration.
 *
 * @param duration {number} seconds
 * @returns {string} string in format h:min
 */
export const getDurationString = (duration, formatForChargingStations = false) => {
  const { hours: durationHours, minutes: durationMinutes } = parseSeconds(duration);

  if (formatForChargingStations) {
    return `${durationHours}:${durationMinutes}`;
  }
  return durationHours === 0 ? `${durationMinutes} min` : `${durationHours} hr ${durationMinutes} min`;
};

/**
 * Small helper function to debounce search terms
 */
export const debounce = (func, wait) => {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
