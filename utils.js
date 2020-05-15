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
export const getDurationString = duration => {
  const { hours: durationHours, minutes: durationMinutes } = parseSeconds(duration);

  return durationHours === 0 ? `${durationMinutes} min` : `${durationHours} h ${durationMinutes} min`;
};
