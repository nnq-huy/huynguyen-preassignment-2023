export type Station = {
  id: number;
  name: string;
  address: string;
  x: number;
  y: number;
};
export interface StationInfo extends Station {
  departure_count: number;
  return_count: number;
  avg_starting_dist: number;
  avg_ending_dist: number;
  most_popular_return: Array<String>;
  most_popular_departure: Array<String>;
}
export type Journey = {
  departure_time: string;
  return_time: string;
  departure_station_id: number;
  departure_station: string;
  return_station_id: number;
  return_station: string;
  duration: number;
  distance: number;
};
