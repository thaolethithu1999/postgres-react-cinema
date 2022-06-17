import { Attributes, DateRange, Filter, Repository, Service } from 'onecore';

export interface BookingFilter extends Filter {
  bookingId?: string;
  id?: string;
  userId?: string;
  name?: string;
  type?: string;
  description?: string;
  subject: string;
  startTime: Date;
  endTime: Date;
  status?: string;
}
export interface Booking {
  bookingId?: string;
  id?: string;
  userId?: string;
  name?: string;
  type?: string;
  description?: string;
  subject: string;
  startTime: Date;
  endTime: Date;
  status?: string;
}
export interface BookingRepository extends Repository<Booking, string> {
}
export interface BookingService extends Service<Booking, string, BookingFilter> {
}

export const bookingModel: Attributes = {
  id: {
    key: true
  },
  name: {
    required: true,
    q: true
  },
  type: {
    match: 'equal',
    required: true
  },
  description: {
    q: true
  },
  status: {
    match: 'equal'
  },
  imageURL: {},
  startTime: {
    type: 'datetime',
  },
  endTime: {
    type: 'datetime',
  },
  locationId: {
    match: 'equal'
  }
};
