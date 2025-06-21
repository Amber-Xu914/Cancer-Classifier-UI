import { AxiosInstance } from 'axios';
import { IUser } from '../../../../Types/User/User.types';
import { ICommonResp } from '../../../../Types/Common/Response.types';
import { ICommonFilter } from '../../../../Types/Common/Filter.types';

export interface IStudiesClient {
  getAllStudies(params?: ICommonFilter): Promise<ICommonResp<string>[]>;
  getUsersByStudyId(studyId: string): Promise<IUser[]>;
}

export function createStudiesClient(instance: AxiosInstance): IStudiesClient {
  async function getAllStudies(params?: ICommonFilter): Promise<ICommonResp<string>[]> {
    const resp = await instance.get('/auth/studies', {
      params,
    });
    return resp.data;
  }

  async function getUsersByStudyId(studyId: string): Promise<IUser[]> {
    const resp = await instance.get(`/auth/studies/${studyId}/users`);
    return resp.data;
  }

  return {
    getAllStudies,
    getUsersByStudyId,
  };
}
