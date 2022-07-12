import { HttpRequest } from 'axios-core';
import { Client } from 'web-clients';
import { Item, ItemFilter, itemModel, ItemService } from './item';

export * from './item';

export class ItemClient extends Client<Item, string, ItemFilter> implements ItemService {
  constructor(http: HttpRequest, private url: string) {
    super(http, url, itemModel);
    this.searchGet = false;
    this.getMyItem = this.getMyItem.bind(this);
    this.updateItem = this.updateItem.bind(this);
  }

  getMyItem(id: string | undefined): Promise<Item | null> {
    const url = this.url + '/' + id;
    return this.http.get<Item>(url).catch(err => {
      const data = (err && err.response) ? err.response : err;
      if (data && (data.status === 404 || data.status === 410)) {
        return null;
      }
      throw err;
    });
  }
  updateItem(item: Item, id: string): Promise<Item | null> {
    const url = this.url + '/' + id;
    return this.http.put<Item>(url, item).catch(err => {
      const data = (err && err.response) ? err.response : err;
      if (data && (data.status === 404 || data.status === 410)) {
        return null;
      }
      throw err;
    });
  }
  postOnly(s: ItemFilter): boolean {
    return true;
  }
}
