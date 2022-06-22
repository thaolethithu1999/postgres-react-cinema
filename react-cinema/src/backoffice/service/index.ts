import axios from 'axios';
import { HttpRequest } from 'axios-core';
import { options, storage } from 'uione';
import { CategoryClient, CategoryService } from './category';
import { FilmClient, FilmService } from './film';
import { LocationClient } from './location';
import { LocationRateClient } from './location-rate';
import { LocationRateService } from './location-rate/location-rate';
import { LocationService } from './location/location';
import { MasterDataClient, MasterDataService } from './master-data';

import { CinemaClient} from './cinema';
import { CinemaRateService } from './cinema-rate/cinema-rate';
import { CinemaRateClient } from './cinema-rate';
import { CinemaService} from '../service/cinema/cinema';


export * from './cinema';
export * from './category';
export * from './cinema-rate';

const httpRequest = new HttpRequest(axios, options);
export interface Config {
  cinema_url: string;
  category_url: string;
  film_url: string;
  role_url: string;
  privilege_url: string;
  audit_log_url: string;
  location_backoffice_url: string;
  location_rate_url: string;
  //
  cinema_rate_url: string;
}
class ApplicationContext {
  cinemaService?: CinemaService;
  categoryService?: CategoryService;
  filmService?: FilmService;
  masterDataService?: MasterDataService;
  locationService?: LocationService;
  locationRateService?: LocationRateService;
  //add
  cinemaRateService?: CinemaRateService;

  constructor() {
    this.getConfig = this.getConfig.bind(this);
    this.getCinemaService = this.getCinemaService.bind(this);
    this.getMasterDataService = this.getMasterDataService.bind(this);
    this.getCategoryService = this.getCategoryService.bind(this);
    this.getFilmService = this.getFilmService.bind(this);
    this.getLocationService = this.getLocationService.bind(this);
    //add
    this.getCinemaService = this.getCinemaService.bind(this);
  }
  getConfig(): Config {
    return storage.config();
  }

  getCinemaService(): CinemaService {
    if (!this.cinemaService) {
      const c = this.getConfig();
      this.cinemaService = new CinemaClient(httpRequest, c.cinema_url);
    }
    return this.cinemaService;
  }
  //add
  getCinemaRateService(): CinemaRateService {
    if(!this.cinemaRateService) {
      const c = this.getConfig();
      this.cinemaRateService = new CinemaRateClient(httpRequest, c.cinema_rate_url, c.cinema_url)
    }
    return this.cinemaRateService;
  }

  getFilmService(): FilmService {
    if (!this.filmService) {
      const c = this.getConfig();
      this.filmService = new FilmClient(httpRequest, c.film_url);
    }
    return this.filmService;
  }

  getCategoryService(): CategoryService {
    if (!this.categoryService) {
      const c = this.getConfig();
      this.categoryService = new CategoryClient(httpRequest, c.category_url);
    }
    return this.categoryService;
  }

  getMasterDataService(): MasterDataService {
    if (!this.masterDataService) {
      this.masterDataService = new MasterDataClient();
    }
    return this.masterDataService;
  }
  getLocationService(): LocationService {
    if (!this.locationService) {
      const c = this.getConfig();
      this.locationService = new LocationClient(httpRequest, c.location_backoffice_url);
    }
    return this.locationService;
  }

}

export const context = new ApplicationContext();

export function useCinema(): CinemaService {
  return context.getCinemaService();
}
//add
export function getCinemaRates(): CinemaRateService {
  return context.getCinemaRateService();
}

export function useCategory(): CategoryService {
  return context.getCategoryService();
}
export function useFilm(): FilmService {
  return context.getFilmService();
}
export function useMasterData(): MasterDataService {
  return context.getMasterDataService();
}

export function getLocations(): LocationService {
  return context.getLocationService();
}

