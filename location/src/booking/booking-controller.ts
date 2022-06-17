import { Controller, Log } from 'express-ext';
import { Booking, BookingFilter, BookingService } from './booking';

export class BookingController extends Controller<Booking, string, BookingFilter> {
  constructor(log: Log, service: BookingService) {
    super(log, service);
  }
}
