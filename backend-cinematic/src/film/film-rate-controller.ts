import { Request, Response } from 'express';
import { Controller, Log } from 'express-ext';
import { FilmRate, FilmRateFilter, FilmRateService, UsefulFilmFilter } from './film';

export class FilmRateController extends Controller<FilmRate, string, FilmRateFilter> {
  constructor(log: Log, public filmRateService: FilmRateService) {
    super(log, filmRateService);
    this.usefulFilm = this.usefulFilm.bind(this);
    this.usefulSearch = this.usefulSearch.bind(this);
  }

  usefulFilm(req: Request, res: Response) {
    const { id, author } = req.body;
    if (id && author) {
      const useful: UsefulFilmFilter = {
        id, author
      };
      return this.filmRateService.usefulFilm(useful).then(
        rs => {
          if (rs > 0) {
            res.status(200).json(rs).end();
          } else {
            res.status(500).json(rs).end();
          }
        }
      );
    } else {
      return res.status(400).end('data cannot be empty');
    }
  }

  usefulSearch(req: Request, res: Response) {
    const { id, author } = req.body;
    if (id && author) {
      const useful: UsefulFilmFilter = {
        id, author
      };
      return this.filmRateService.usefulSearch(useful).then(
        rs => {
          res.status(200).json(rs).end();
        }
      );
    } else {
      return res.status(400).end('data cannot be empty');
    }
  }
}
