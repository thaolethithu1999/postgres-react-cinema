import { Db } from 'mongodb';
import { buildQuery, PointMapper, SearchBuilder } from 'mongodb-extension';
import { Log, ViewManager } from 'onecore';
import { Event, EventFilter, eventModel, EventRepository, EventService } from './event';
import { EventController } from './event-controller';
export * from './event';
export { EventController };

import { MongoEventRepository } from './mongo-event-repository';

export class EventManager extends ViewManager<Event, string> implements EventService {
  constructor(repository: EventRepository) {
    super(repository);
  }
}

export function useEventController(log: Log, db: Db): EventController {
  const mapper = new PointMapper<Event>('geo', 'latitude', 'longitude');
  const builder = new SearchBuilder<Event, EventFilter>(db, 'event', buildQuery, eventModel, mapper.fromPoint);
  const repository = new MongoEventRepository(db, mapper.fromPoint);
  const service = new EventManager(repository);
  return new EventController(log, builder.search, service);
}
