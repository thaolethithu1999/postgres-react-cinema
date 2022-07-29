import axios from 'axios';
import { HttpRequest } from 'axios-core';
import { options, storage } from 'uione';
import {RateCommentService, RateService} from './rate/rate';

// import { CinemaClient, CinemaService } from './cinema';
import { FilmClient, FilmService, FilmRateService, FilmRateClient } from './film';
import { RateClient, RateCommentClient } from './rate';


const httpRequest = new HttpRequest(axios, options);
export interface Config {
  film_url: string;
  film_rate_url: string;
  rate_film_url: string;
  rate_film_comment_url: string;
}
class ApplicationContext {
  filmService?: FilmService;
  filmRateService?: FilmRateService;
  rateService?: RateService;
  rateCommentService?: RateCommentService;
  constructor() {
    this.getConfig = this.getConfig.bind(this);
    this.getFilmService = this.getFilmService.bind(this);
    this.getFilmRateService = this.getFilmRateService.bind(this);
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

  getFilmRateService(): RateService {
    if (!this.rateService) {
      const c = this.getConfig();
      this.rateService = new RateClient(httpRequest, c.rate_film_url);
    }
    return this.rateService;
  }

  getFilmRateCommentService(): RateCommentService {
    if(!this.rateCommentService){
      const c = this.getConfig();
      this.rateCommentService = new  RateCommentClient(httpRequest, c.rate_film_comment_url)
    }
    return this.rateCommentService;
  }

}

export const context = new ApplicationContext();

export function useFilm(): FilmService {
  return context.getFilmService();
}

export function useFilmRate(): RateService {
  return context.getFilmRateService();
}

export function useFilmRateComment(): RateCommentService {
  return context.getFilmRateCommentService();
}
