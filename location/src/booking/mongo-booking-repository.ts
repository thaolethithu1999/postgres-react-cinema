import { Db } from 'mongodb';
import { Repository } from 'mongodb-extension';
import { Booking, bookingModel, BookingRepository } from './booking';

export class MongoBookingRepository extends Repository<Booking, string> implements BookingRepository {
  constructor(db: Db) {
    super(db, 'booking', bookingModel);
  }
}
