import { Db } from 'mongodb';
import { buildQuery, SearchBuilder } from 'mongodb-extension';
import { Log, Manager, Search } from 'onecore';
import { Booking, BookingFilter, bookingModel, BookingRepository, BookingService } from './booking';
import { BookingController } from './booking-controller';
export * from './booking';
export { BookingController };

import { MongoBookingRepository } from './mongo-booking-repository';

export class BookingManager extends Manager<Booking, string, BookingFilter> implements BookingService {
  constructor(search: Search<Booking, BookingFilter>, repository: BookingRepository) {
    super(search, repository);
  }
}
export function useBookingService(db: Db): BookingService {
  const builder = new SearchBuilder<Booking, BookingFilter>(db, 'booking', buildQuery, bookingModel);
  const repository = new MongoBookingRepository(db);
  return new BookingManager(builder.search, repository);
}
export function useBookingController(log: Log, db: Db): BookingController {
  return new BookingController(log, useBookingService(db));
}
