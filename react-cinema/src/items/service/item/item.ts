import { Attributes, Filter, Service, Tracking, Repository } from 'onecore';

export interface ItemFilter extends Filter {
  id: string;
  title: string;
  status: string;
  description: string;
  categories: string[];
}
export interface Item extends Tracking {
  id: string;
  title: string;
  status: string;
  description?: string;
  categories: string[];
}

export const itemModel: Attributes = {
  id: {
    key: true,
    length: 40,
    required: true,
  },
  title: {
    length: 100,
    required: true,
    q: true
  },
  description: {
    length: 100,
    q: true
  },
  status: {
    length: 100,
    required: true,
    q: true
  },
  categories: {
    type: 'primitives',
  }
};

export interface ItemService extends Service<Item, string, ItemFilter> {
  getMyItem(id: string | undefined): Promise<Item | null>;
  updateItem(item: Item, id: string): Promise<Item | null>;
}
