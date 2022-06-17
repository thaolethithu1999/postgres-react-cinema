import axios from 'axios';
import { HttpRequest } from 'axios-core';
import { useState } from 'react';
import { options, storage } from 'uione';
import { LocationClient } from './location';
import { LocationRateClient } from './location-rate';
import { LocationRateService } from './location-rate/location-rate';
import { LocationService } from './location/location';

export * from './location';
export * from './location-rate';

const httpRequest = new HttpRequest(axios, options);
export interface Config {
  cinema_url: string;
  category_url: string;
  film_url: string;
  role_url: string;
  privilege_url: string;
  audit_log_url: string;
  location_url: string;
  location_rate_url: string;
}
class ApplicationContext {
  locationService?: LocationService;
  locationRateService?: LocationRateService;
  constructor() {
    this.getConfig = this.getConfig.bind(this);
    this.getLocationService = this.getLocationService.bind(this);
    this.getLocationRateService = this.getLocationRateService.bind(this);
  }
  getConfig(): Config {
    return storage.config();
  }

  getLocationService(): LocationService {
    if (!this.locationService) {
      const c = this.getConfig();
      this.locationService = new LocationClient(httpRequest, c.location_url);
    }
    return this.locationService;
  }
  getLocationRateService(): LocationRateService {
    if (!this.locationRateService) {
      const c = this.getConfig();
      this.locationRateService = new LocationRateClient(httpRequest, c.location_rate_url, c.location_url);
    }
    return this.locationRateService;
  }
}

export const context = new ApplicationContext();

export function useLocationsService(): LocationService {
  const [service] = useState(() => context.getLocationService());
  return service;
}

export function getLocationRates(): LocationRateService {
  return context.getLocationRateService();
}
