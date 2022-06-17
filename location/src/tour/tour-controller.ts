import { LoadSearchHandler, Log } from 'express-ext';
import { Search } from 'onecore';
import { Tour, TourFilter, TourService } from './tour';

export class TourController extends LoadSearchHandler<Tour, string, TourFilter> {
  constructor(log: Log, find: Search<Tour, TourFilter>, service: TourService) {
    super(log, find, service);
  }
}
