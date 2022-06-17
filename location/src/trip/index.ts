import { Db } from 'mongodb';
import { buildQuery, SearchBuilder } from 'mongodb-extension';
import { Log, Manager, Search } from 'onecore';
import { Trip, TripFilter, tripModel, TripRepository, TripService } from './trip';
import { TripController } from './trip-controller';
export * from './trip';
export { TripController };

import { MongoTripRepository } from './mongo-trip-repository';

export class TripManager extends Manager<Trip, string, TripFilter> implements TripService {
  constructor(search: Search<Trip, TripFilter>, repository: TripRepository) {
    super(search, repository);
  }
}
export function useTripService(db: Db): TripService {
  const builder = new SearchBuilder<Trip, TripFilter>(db, 'trip', buildQuery, tripModel);
  const repository = new MongoTripRepository(db);
  return new TripManager(builder.search, repository);
}
export function useTripController(log: Log, db: Db): TripController {
  return new TripController(log, useTripService(db));
}
