import axios from 'axios';
import { HttpRequest } from 'axios-core';
import { useEffect, useState } from 'react';
import { options, storage } from 'uione';
import { AppreciationClient, AppreciationService } from './appreciation';
import { AppreciationReplyClient, AppreciationReplyService } from './appreciation-reply';
import { ProfileClient, ProfileService, UserClient, UserService } from './user';
export interface Config {
  myprofile_url: string;
  user_url: string;
  profile_url: string;
  appreciation_url: string;
  appreciation_reply_url: string;
}

const httpRequest = new HttpRequest(axios, options);
class ApplicationContext {
  profileService?: ProfileService;
  userService?: UserService;
  appreciationService?: AppreciationService;
  appreciationReplyService?: AppreciationReplyService;

  constructor() {
    this.getConfig = this.getConfig.bind(this);
    this.getUserService = this.getUserService.bind(this);
    this.getMyProfileService = this.getMyProfileService.bind(this);
  }
  getConfig(): Config {
    return storage.config();
  }
  getMyProfileService(): ProfileService {
    if (!this.profileService) {
      const c = this.getConfig();
      this.profileService = new ProfileClient(httpRequest, c.myprofile_url);
    }
    return this.profileService;
  }
  getUserService(): UserService {
    if (!this.userService) {
      const c = this.getConfig();
      this.userService = new UserClient(httpRequest, c.profile_url);
    }
    return this.userService;
  }

  getAppreciationService(): AppreciationService {
    if (!this.appreciationService) {
      const c = this.getConfig();
      this.appreciationService = new AppreciationClient(httpRequest, c.appreciation_url);
    }
    return this.appreciationService;
  }
  getAppreciationReplyService(): AppreciationReplyService {
    if (!this.appreciationReplyService) {
      const c = this.getConfig();
      this.appreciationReplyService = new AppreciationReplyClient(httpRequest, c.appreciation_reply_url);
    }
    return this.appreciationReplyService;
  }
}

export const appContext = new ApplicationContext();

export function useUserService(): UserService | undefined {
  const [context, setContext] = useState<UserService>();
  useEffect(() => {
    setContext(appContext.getUserService());
  }, []);
  return context;
}

export function useMyProfileService(): ProfileService | undefined {
  const [context, setContext] = useState<ProfileService>();
  useEffect(() => {
    setContext(appContext.getMyProfileService());
  }, []);
  return context;
}

export function useAppreciationService(): AppreciationService | undefined {
  const [context, setContext] = useState<AppreciationService>();
  useEffect(() => {
    setContext(appContext.getAppreciationService());
  }, []);
  return context;
}


export function useAppreciationReplyService(): AppreciationReplyService | undefined {
  const [context, setContext] = useState<AppreciationReplyService>();
  useEffect(() => {
    setContext(appContext.getAppreciationReplyService());
  }, []);
  return context;
}

