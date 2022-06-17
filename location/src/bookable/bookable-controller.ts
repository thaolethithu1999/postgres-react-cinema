import { LoadSearchHandler, Log } from 'express-ext';
import { Search } from 'onecore';
import { Bookable, BookableFilter, BookableService } from './bookable';

export class BookableController extends LoadSearchHandler<Bookable, string, BookableFilter> {
  constructor(log: Log, find: Search<Bookable, BookableFilter>, service: BookableService) {
    super(log, find, service);
  }
}
