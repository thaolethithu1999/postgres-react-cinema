import { Controller, Log } from 'express-ext';
import { Trip, TripFilter, TripService } from './trip';

export class TripController extends Controller<Trip, string, TripFilter> {
  constructor(log: Log, service: TripService) {
    super(log, service);
  }
}
