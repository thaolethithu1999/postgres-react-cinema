import { Attributes, Filter, Service, Tracking } from 'onecore';

export interface CinemaFilter extends Filter {
  id: string;
  name?: string;
  address?: string;
  status?: string;
  parent?: string;
  longitude: number;
  latitude: number;
}
export const galleryModel: Attributes = {
  url: {
    required: true,
  },
  type: {
    required: true,
  },
};
export interface Gallery {
  url: string;
  type: string;
}

export interface Cinema extends Tracking {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  status?: string;
  address?: string;
  parent?: string;
  createdby?: string;
  createdat?: Date;
  updatedby?: string;
  updatedat?: Date;
  imageURL?: string;
  coverURL?: string;
  gallery?: Gallery[];
}



export interface CinemaService extends Service<Cinema, string, CinemaFilter> {
  getCinemasByRole(id: string): Promise<Cinema[]>;
}


export const cinemaModel: Attributes = {
  id: {
    key: true,
    length: 40
  },
  name: {
    required: true,
    length: 255,
  },
  longitude: {
    type: 'number',
  },
  latitude: {
    type: 'number',
  },
  address: {
    length: 255,
  },
  parent: {
    length: 40
  },
  status: {
    length: 1
  },
  createdBy: {},
  createdAt: {
    column: 'createdat',
    type: 'datetime'
  },
  updatedBy: {},
  updatedAt: {
    column: 'createdat',
    type: 'datetime'
  },
  gallery: {
    column: 'gallery',
    type: 'array',
    typeof: galleryModel,
  }
};

