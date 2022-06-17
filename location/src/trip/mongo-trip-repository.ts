import { Db } from 'mongodb';
import { Repository } from 'mongodb-extension';
import { Trip, tripModel, TripRepository } from './trip';

export class MongoTripRepository extends Repository<Trip, string> implements TripRepository {
  constructor(db: Db) {
    super(db, 'trip', tripModel);
  }
}
