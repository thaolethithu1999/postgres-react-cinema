import axios from 'axios';
import { HttpRequest } from 'axios-core';
import { options, storage } from 'uione';

// import { CinemaClient, CinemaService } from './cinema';
import { FilmClient, FilmService, FilmRateService, FilmRateClient } from './film';


const httpRequest = new HttpRequest(axios, options);
export interface Config {
  film_url: string;
  film_rate_url: string;
}
class ApplicationContext {
  filmService?: FilmService;
  filmRateService?: FilmRateService;
  constructor() {
    this.getConfig = this.getConfig.bind(this);
    this.getFilmService = this.getFilmService.bind(this);
  }
  getConfig(): Config {
    return storage.config();
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

}

export const context = new ApplicationContext();

export function useFilm(): FilmService {
  return context.getFilmService();
}

export function useFilmRate(): FilmRateService {
  return context.getFilmRateService();
}

