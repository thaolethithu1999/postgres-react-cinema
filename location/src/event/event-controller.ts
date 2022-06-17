import { LoadSearchHandler, Log } from 'express-ext';
import { Search } from 'onecore';
import { Event, EventFilter, EventService } from './event';

export class EventController extends LoadSearchHandler<Event, string, EventFilter> {
  constructor(log: Log, find: Search<Event, EventFilter>, service: EventService) {
    super(log, find, service);
  }
}
