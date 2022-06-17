import { Db } from 'mongodb';
import { buildQuery, SearchBuilder } from 'mongodb-extension';
import { Log, ViewManager } from 'onecore';
import { Bookable, BookableFilter, bookableModel, BookableRepository, BookableService } from './bookable';
import { BookableController } from './bookable-controller';
export * from './bookable';
export { BookableController };

import { MongoBookableRepository } from './mongo-bookable-repository';

export class BookableManager extends ViewManager<Bookable, string> implements BookableService {
  constructor(repository: BookableRepository) {
    super(repository);
  }
}

export function useBookableController(log: Log, db: Db): BookableController {
  const builder = new SearchBuilder<Bookable, BookableFilter>(db, 'bookable', buildQuery, bookableModel);
  const repository = new MongoBookableRepository(db);
  const service = new BookableManager(repository);
  return new BookableController(log, builder.search, service);
}
