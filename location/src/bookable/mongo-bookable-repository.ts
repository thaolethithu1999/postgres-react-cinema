import { Db } from 'mongodb';
import { ViewRepository } from 'mongodb-extension';
import { Bookable, bookableModel, BookableRepository } from './bookable';

export class MongoBookableRepository extends ViewRepository<Bookable, string> implements BookableRepository {
  constructor(db: Db) {
    super(db, 'bookable', bookableModel);
  }
}
