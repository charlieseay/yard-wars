/**
 * Regional Atlas - Course and Distillery Data
 * Embedded static data for offline geofencing
 */

import { Course, Distillery, RegionalPack } from '../types/game';

// Example Kentucky Bourbon Trail pack
export const kentuckyBourbonTrail: RegionalPack = {
  id: 'kentucky-bourbon-trail',
  name: 'Kentucky Bourbon Trail',
  region: 'Kentucky',
  courses: [
    {
      id: 'iroquois-park-louisville',
      name: 'Iroquois Park',
      city: 'Louisville',
      state: 'KY',
      latitude: 38.1744,
      longitude: -85.7636,
      holes: 18,
    },
    {
      id: 'charlie-vettiner-louisville',
      name: 'Charlie Vettiner Park',
      city: 'Louisville',
      state: 'KY',
      latitude: 38.2847,
      longitude: -85.5858,
      holes: 27,
    },
  ],
  distilleries: [
    {
      id: 'angels-envy-louisville',
      name: "Angel's Envy Distillery",
      city: 'Louisville',
      state: 'KY',
      latitude: 38.2571,
      longitude: -85.7468,
      description: 'Known for port barrel-finished bourbon',
    },
    {
      id: 'woodford-reserve-versailles',
      name: 'Woodford Reserve',
      city: 'Versailles',
      state: 'KY',
      latitude: 38.0531,
      longitude: -84.8769,
      description: 'Historic National Landmark distillery',
    },
    {
      id: 'buffalo-trace-frankfort',
      name: 'Buffalo Trace Distillery',
      city: 'Frankfort',
      state: 'KY',
      latitude: 38.1894,
      longitude: -84.8800,
      description: 'Oldest continuously operating distillery',
    },
  ],
};

/**
 * Get all regional packs
 */
export function getAllRegionalPacks(): RegionalPack[] {
  return [kentuckyBourbonTrail];
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in miles
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959; // Earth radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Find distilleries within radius of a location
 */
export function findNearbyDistilleries(
  latitude: number,
  longitude: number,
  radiusMiles: number = 15
): Distillery[] {
  const allPacks = getAllRegionalPacks();
  const allDistilleries = allPacks.flatMap(pack => pack.distilleries);

  return allDistilleries.filter(distillery => {
    const distance = calculateDistance(
      latitude,
      longitude,
      distillery.latitude,
      distillery.longitude
    );
    return distance <= radiusMiles;
  });
}
