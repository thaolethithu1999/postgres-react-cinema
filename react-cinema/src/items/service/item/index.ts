import axios from "axios";
import { useState } from "react";
import { options, storage } from "uione";
import { QueryService } from "onecore";
import { HttpRequest } from "axios-core";
import { Client, QueryClient } from "web-clients";
import {
  Item,
  ItemFilter,
  itemModel,
  ItemService,
  ItemResponse,
  ItemResponseFilter,
  ItemResponseService,
  itemResponseModel,
  UsefulItem,
} from "./item";

export * from "./item";

const httpRequest = new HttpRequest(axios, options);
export class ItemClient
  extends Client<Item, string, ItemFilter>
  implements ItemService
{
  constructor(http: HttpRequest, private url: string) {
    super(http, url, itemModel);
    this.searchGet = false;
    this.getItem = this.getItem.bind(this);
    this.updateItem = this.updateItem.bind(this);
    this.saveItem = this.saveItem.bind(this);
  }

  postOnly(s: ItemFilter): boolean {
    return true;
  }

  getItem(id: string | undefined): Promise<Item | null> {
    const url = this.url + "/" + id;
    return this.http.get<Item>(url).catch((err) => {
      const data = err && err.response ? err.response : err;
      if (data && (data.status === 404 || data.status === 410)) {
        return null;
      }
      throw err;
    });
  }

  updateItem(item: Item, id: string): Promise<Item | null> {
    const url = this.url + "/" + id;
    return this.http.put<Item>(url, item).catch((err) => {
      const data = err && err.response ? err.response : err;
      if (data && (data.status === 404 || data.status === 410)) {
        return null;
      }
      throw err;
    });
  }

  saveItem(item: Item): Promise<number> {
    const url = this.url + "/" + item.id;
    return this.http.patch<number>(url, item).catch((err) => {
      const data = err && err.response ? err.response : err;
      if (data && (data.status === 404 || data.status === 410)) {
        return 0;
      }
      throw err;
    });
  }

  responseItem(obj: ItemResponse): Promise<any> {
    const url = `${this.serviceUrl}/rate`;
    return this.http.post(url, obj);
  }
}

export interface Config {
  item_url: string;
  brand_url: string;
}
class ApplicationContext {
  itemService?: ItemService;
  brandService?: QueryService<string>;

  getConfig(): Config {
    return storage.config();
  }

  getItemService(): ItemService {
    if (!this.itemService) {
      const c = this.getConfig();
      this.itemService = new ItemClient(httpRequest, c.item_url);
    }
    return this.itemService;
  }

  getBrandService(): QueryService<string> {
    if (!this.brandService) {
      const c = this.getConfig();
      this.brandService = new QueryClient<string>(httpRequest, c.brand_url);
    }
    return this.brandService;
  }
}

export class ItemResponseClient extends Client<ItemResponse, string, ItemResponseFilter> implements ItemResponseService {
  constructor(http: HttpRequest, public url: string) {
    super(http, url, itemResponseModel);
    // this.searchGet = true;
    this.usefulItem = this.usefulItem.bind(this);
    this.usefulSearch = this.usefulSearch.bind(this);
  }

  protected postOnly(s: ItemResponse): boolean {
    return true;
  }

  usefulItem(obj: UsefulItem): Promise<number> {
    const url = this.url + '/useful';
    return this.http.post<number>(url, obj).catch(err => {
      const data = (err && err.response) ? err.response : err;
      if (data && (data.status === 404 || data.status === 410)) {
        return 0;
      }
      throw err;
    });
  }
  
  usefulSearch(obj: UsefulItem): Promise<number> {
    const url = this.url + '/useful/search';
    return this.http.post<number>(url, obj).catch(err => {
      const data = (err && err.response) ? err.response : err;
      if (data && (data.status === 404 || data.status === 410)) {
        return 0;
      }
      throw err;
    });
  }
}

export const context = new ApplicationContext();

export function useBrandService(): QueryService<string> {
  const [service] = useState(() => context.getBrandService());
  return service;
}
