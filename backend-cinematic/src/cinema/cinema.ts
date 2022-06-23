import { Attributes, DateRange, Filter, Repository, Service, ViewRepository, ViewService } from 'onecore';

export interface CinemaFilter extends Filter {
  cinemaId?: string;
  cinemaName?: string;
  latitude?: string;
  longitude?: string;
  status?: string;
  createdby?: string;
  createdat?: Date | DateRange;
  parentCinema?: string;
  updatedby?: string;
  updatedat?: Date | DateRange;
}
export interface CinemaInfo {
  id: string;
  rate: number;
  rate1: number;
  rate2: number;
  rate3: number;
  rate4: number;
  rate5: number;
  viewCount: number;
}
export interface Cinema {
  cinemaId: string;
  cinemaName: string;
  imageURL?: string;  
  coverURL?: string;
  latitude?: string;
  longitude?: string;
  status?: string;
  parentCinema?: string;
  createdby?: string;
  createdat?: Date;
  updatedby?: string;
  updatedat?: Date;
  gallery?: string;
  info?: CinemaInfo;
}

export interface RateFilter extends Filter {
  id: string;
  review?: string;
  cinemaId?: string;
  userId?: string;
  rateTime: Date;
}



export interface CinemaRate {
  id?: string;
  cinemaId: string;
  userId: string;
  rate: number;
  rateTime?: Date;
  review?: string;
}

export interface CinemaRateFilter extends Filter {
  id?: string;
  cinemaId?: string;
  userId?: string;
  rateTime?: Date;
  review?: string;
}

export interface CinemaRepository extends Repository<Cinema, string> { }

export interface CinemaService extends Service<Cinema, string, CinemaFilter> {
  rate(rate: CinemaRate): Promise<boolean>;
}

export interface CinemaInfoRepository extends Repository<CinemaInfo, string> { };

export interface CinemaRateRepository extends Repository<CinemaRate, string> { };

export interface CinemaRateService extends Service<CinemaRate, string, CinemaRateFilter> { };

export const galleryModel: Attributes = {
  url: {
    required: true,
  },
  type: {
    required: true,
  },
};

export const cinemaModel: Attributes = {
  id: {
    key: true,
    length: 40
  },
  name: {
    required: true,
    length: 255,
  },
  latitude: {
    length: 255,
  },
  longitude: {
    length: 255,
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
  imageURL: {},
  coverURL: {},
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

export const cinemaRateModel: Attributes = {
  id: {
    key: true
  },
  cinemaId: {
    required: true
  },
  userId: {
    required: true
  },
  rate: {
    type: 'integer',
    min: 1,
    max: 5
  },
  rateTime: {
    type: 'datetime',
  },
  review: {
    q: true,
  },
}

export const cinemaInfoModel: Attributes = {
  id: {
    key: true,
  },
  viewCount: {
    type: 'number'
  },
  rate: {
    type: 'number'
  },
  rate1: {
    type: 'number',
  },
  rate2: {
    type: 'number',
  },
  rate3: {
    type: 'number',
  },
  rate4: {
    type: 'number',
  },
  rate5: {
    type: 'number',
  },
}

