import { Application } from 'express';
import { ApplicationContext } from './context';

export function route(app: Application, ctx: ApplicationContext): void {
  app.get('/health', ctx.health.check);
  app.patch('/log', ctx.log.config);
  app.patch('/middleware', ctx.middleware.config);

  app.post('/articles/search', ctx.article.search);
  app.get('/articles/search', ctx.article.search);
  app.get('/articles/:id', ctx.article.load);

  app.post('/bookables/search', ctx.bookable.search);
  app.get('/bookables/search', ctx.bookable.search);
  app.get('/bookables/:id', ctx.bookable.load);

  app.post('/bookings/search', ctx.booking.search);
  app.get('/bookings/search', ctx.booking.search);
  app.get('/bookings/:id', ctx.booking.load);
  app.post('/bookings', ctx.booking.create);
  app.put('/bookings/:id', ctx.booking.update);
  app.patch('/bookings/:id', ctx.booking.patch);
  app.delete('/bookings/:id', ctx.booking.delete);

  app.post('/events/search', ctx.event.search);
  app.get('/events/search', ctx.event.search);
  app.get('/events/:id', ctx.event.load);

  app.post('/locations/search', ctx.location.search);
  app.get('/locations/search', ctx.location.search);
  app.get('/locations/:id', ctx.location.load);
  app.post('/locations/rateLocation', ctx.location.rate);

  app.get('/location-rates/search', ctx.rate.search);
  app.post('/location-rates/search', ctx.rate.search);
  app.get('/location-rates/:id', ctx.rate.load);

  app.post('/tours/search', ctx.tour.search);
  app.get('/tours/search', ctx.tour.search);
  app.get('/tours/:id', ctx.tour.load);

  app.post('/trips/search', ctx.trip.search);
  app.get('/trips/search', ctx.trip.search);
  app.get('/trips/:id', ctx.trip.load);
  app.post('/trips', ctx.trip.create);
  app.put('/trips/:id', ctx.trip.update);
  app.patch('/trips/:id', ctx.trip.patch);
  app.delete('/trips/:id', ctx.trip.delete);
}
