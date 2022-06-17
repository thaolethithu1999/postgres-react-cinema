import { HealthController, LogController, Logger, Middleware, MiddlewareController, resources } from 'express-ext';
import { LocationRateController } from 'location/rate-controller';
import { Db } from 'mongodb';
import { MongoChecker } from 'mongodb-extension';
import { createValidator } from 'xvalidators';
import { ArticleController, useArticleController } from './article';
import { BookableController, useBookableController } from './bookable';
import { BookingController, useBookingController } from './booking';
import { EventController, useEventController } from './event';
import { LocationController, useLocationController, useLocationRateController } from './location';
import { TourController, useTourController } from './tour';
import { TripController, useTripController } from './trip';

resources.createValidator = createValidator;

export interface ApplicationContext {
  health: HealthController;
  log: LogController;
  middleware: MiddlewareController;
  article: ArticleController;
  bookable: BookableController;
  booking: BookingController;
  event: EventController;
  location: LocationController;
  tour: TourController;
  trip: TripController;
  rate: LocationRateController;
}
export function useContext(db: Db, logger: Logger, midLogger: Middleware): ApplicationContext {
  const log = new LogController(logger);
  const middleware = new MiddlewareController(midLogger);
  const mongoChecker = new MongoChecker(db);
  const health = new HealthController([mongoChecker]);

  const article = useArticleController(logger.error, db);
  const bookable = useBookableController(logger.error, db);
  const booking = useBookingController(logger.error, db);
  const event = useEventController(logger.error, db);
  const location = useLocationController(logger.error, db);
  const tour = useTourController(logger.error, db);
  const trip = useTripController(logger.error, db);
  const rate = useLocationRateController(logger.error, db);
  return { health, log, middleware, article, bookable, booking, event, location, tour, trip, rate };
}
