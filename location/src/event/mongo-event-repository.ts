import { Db } from 'mongodb';
import { ViewRepository } from 'mongodb-extension';
import { Event, eventModel, EventRepository } from './event';

export class MongoEventRepository extends ViewRepository<Event, string> implements EventRepository {
  constructor(db: Db, fromPoint: (v: Event) => Event) {
    super(db, 'event', eventModel, fromPoint);
  }
}
