import { AxiosInstance } from 'axios';
import { IUser } from '../../../../Types/User/User.types';
import { ICommonResp } from '../../../../Types/Common/Response.types';
import { ICommonFilter } from '../../../../Types/Common/Filter.types';

export interface ISitesClient {
  getAllSites(params?: ICommonFilter): Promise<ICommonResp<string>[]>;
  getUsersBySiteId(siteId: string): Promise<IUser[]>;
}

export function createSitesClient(instance: AxiosInstance): ISitesClient {
  async function getAllSites(params?: ICommonFilter): Promise<ICommonResp<string>[]> {
    const resp = await instance.get('/auth/sites', {
      params,
    });
    return resp.data;
  }

  async function getUsersBySiteId(siteId: string): Promise<IUser[]> {
    const resp = await instance.get(`/auth/sites/${siteId}/users`);
    return resp.data;
  }

  return {
    getAllSites,
    getUsersBySiteId,
  };
}
