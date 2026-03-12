export type Suggest = {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
  display?: string;
};

export type CacheEntry = { ts: number; data: unknown };
