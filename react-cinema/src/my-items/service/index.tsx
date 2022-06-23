import axios from 'axios';
import { HttpRequest } from 'axios-core';
import { options, storage } from 'uione';
import { ItemClient, ItemService } from './item';
export * from './item';
// axios.defaults.withCredentials = true;

const httpRequest = new HttpRequest(axios, options);
export interface Config {
  item_url: string;
}
class ApplicationContext {
  itemService?: ItemService;
  constructor() {
    this.getConfig = this.getConfig.bind(this); 
    this.getItemService = this.getItemService.bind(this); 
  }
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
}

export const context = new ApplicationContext();

export function getItemService(): ItemService {
  return context.getItemService();
}
