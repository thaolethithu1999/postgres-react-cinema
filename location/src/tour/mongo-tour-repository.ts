import { Db } from 'mongodb';
import { ViewRepository } from 'mongodb-extension';
import { Tour, tourModel, TourRepository } from './tour';

export class MongoTourRepository extends ViewRepository<Tour, string> implements TourRepository {
  constructor(db: Db) {
    super(db, 'tour', tourModel);
  }
}
