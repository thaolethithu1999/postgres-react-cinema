import { Db } from 'mongodb';
import { buildQuery, SearchBuilder } from 'mongodb-extension';
import { Log, ViewManager } from 'onecore';
import { Tour, TourFilter, tourModel, TourRepository, TourService } from './tour';
import { TourController } from './tour-controller';
export * from './tour';
export { TourController };

import { MongoTourRepository } from './mongo-tour-repository';

export class TourManager extends ViewManager<Tour, string> implements TourService {
  constructor(repository: TourRepository) {
    super(repository);
  }
}

export function useTourController(log: Log, db: Db): TourController {
  const builder = new SearchBuilder<Tour, TourFilter>(db, 'tour', buildQuery, tourModel);
  const repository = new MongoTourRepository(db);
  const service = new TourManager(repository);
  return new TourController(log, builder.search, service);
}
