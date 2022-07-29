import axios from 'axios';
import { HttpRequest } from 'axios-core';
import { options, storage } from 'uione';
import { CategoryClient, CategoryService } from './category';
// import { CinemaClient, CinemaService } from './cinema';
import { FilmClient, FilmService, FilmRateService, FilmRateClient } from './film';
import { LocationClient } from './location';
import { LocationRateService } from './location-rate/location-rate';
import { LocationService } from './location/location';
import { MasterDataClient, MasterDataService } from './master-data';

import { CinemaClient } from './cinema';
import { CinemaRateService } from './cinema-rate/cinema-rate';
import { CinemaRateClient } from './cinema-rate';
import { CinemaService } from '../service/cinema/cinema';
import { useState } from 'react';
import { RateClient, rateModel, RateService, RateCommentClient, RateCommentService} from './rate';

export * from './cinema';
export * from './category';

const httpRequest = new HttpRequest(axios, options);
export interface Config {
  cinema_url: string;
  category_url: string;
  film_url: string;
  film_rate_url: string;
  role_url: string;
  privilege_url: string;
  audit_log_url: string;
  location_backoffice_url: string;
  location_rate_url: string;
  cinema_rate_url: string;
  rate_cinema_url: string;
  rate_film_url: string;
  rate_cinema_comment_url: string;
  comment_url: string;
}
class ApplicationContext {
  cinemaService?: CinemaService;
  categoryService?: CategoryService;
  filmService?: FilmService;
  filmRateService?: FilmRateService;
  masterDataService?: MasterDataService;
  locationService?: LocationService;
  locationRateService?: LocationRateService;
  cinemaRateService?: CinemaRateService;
  rateService?: RateService;
  rateCommentService?: RateCommentService;

  constructor() {
    this.getConfig = this.getConfig.bind(this);
    this.getCinemaService = this.getCinemaService.bind(this);
    this.getMasterDataService = this.getMasterDataService.bind(this);
    this.getCategoryService = this.getCategoryService.bind(this);
    this.getFilmService = this.getFilmService.bind(this);
    this.getLocationService = this.getLocationService.bind(this);
    this.getCinemaService = this.getCinemaService.bind(this);
    this.getRateService = this.getRateService.bind(this);
    this.getRateCommentService = this.getRateCommentService.bind(this);
  }
  getConfig(): Config {
    return storage.config();
  }

  getRateService(): RateService {
    if (!this.rateService) {
      const c = this.getConfig();
      this.rateService = new RateClient(httpRequest, c.rate_cinema_url);
    }
    return this.rateService;
  }

  getRateCommentService(): RateCommentService {
    if (!this.rateCommentService) {
      const c = this.getConfig();
      this.rateCommentService = new RateCommentClient(httpRequest, c.rate_cinema_comment_url);
    }
    return this.rateCommentService;
  }

  getCinemaService(): CinemaService {
    if (!this.cinemaService) {
      const c = this.getConfig();
      this.cinemaService = new CinemaClient(httpRequest, c.cinema_url);
    }
    return this.cinemaService;
  }

  getCinemaRateService(): CinemaRateService {
    if (!this.cinemaRateService) {
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

  getFilmRateService(): FilmRateService {
    if (!this.filmRateService) {
      const c = this.getConfig();
      this.filmRateService = new FilmRateClient(httpRequest, c.film_rate_url);
    }
    return this.filmRateService;
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

export function useRate(): RateService {
  return context.getRateService();
}

export function useRateComment(): RateCommentService {
  return context.getRateCommentService();
}

export function useCinema(): CinemaService {
  const [service] = useState(() => context.getCinemaService());
  return service;
}

export function getCinemaRates(): CinemaRateService {
  return context.getCinemaRateService();
}

export function useCategory(): CategoryService {
  return context.getCategoryService();
}
export function useFilm(): FilmService {
  return context.getFilmService();
}

export function useFilmRate(): FilmRateService {
  return context.getFilmRateService();
}

export function useMasterData(): MasterDataService {
  return context.getMasterDataService();
}

export function getLocations(): LocationService {
  return context.getLocationService();
}

