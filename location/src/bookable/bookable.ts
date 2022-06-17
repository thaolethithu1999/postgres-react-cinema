import { Attributes, Filter, NumberRange, ViewRepository, ViewService } from 'onecore';

export interface BookableFilter extends Filter {
  id?: string;
  name?: string;
  type?: string;
  status?: string[]|string;
  capacity?: number|NumberRange;
  locationId?: string[]|string;
}
export interface Bookable {
  id?: string;
  name?: string;
  type?: string;
  description?: string;
  status?: string;
  imageURL?: string;
  customURL?: string;
  capacity?: number;
  locationId?: string;
}
export interface BookableRepository extends ViewRepository<Bookable, string> {
}
export interface BookableService extends ViewService<Bookable, string> {
}

export const bookableModel: Attributes = {
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
  capacity: {
    type: 'number',
  },
  locationId: {
    match: 'equal'
  }
};
