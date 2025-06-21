import { AxiosInstance } from 'axios';
import { IUser } from '../../../../Types/User/User.types';
import { ICommonResp } from '../../../../Types/Common/Response.types';
import { ICommonFilter } from '../../../../Types/Common/Filter.types';
import { Group } from '../../../../Types/Auth/Group.types';

export interface IGroupsClient {
  getAllGroups(params?: ICommonFilter): Promise<ICommonResp<Group>[]>;
  getUsersByGroupId(groupId: string): Promise<IUser[]>;
}

export function createGroupsClient(instance: AxiosInstance): IGroupsClient {
  async function getAllGroups(params?: ICommonFilter): Promise<ICommonResp<Group>[]> {
    const resp = await instance.get('/auth/groups', {
      params,
    });
    return resp.data;
  }

  async function getUsersByGroupId(groupId: string): Promise<IUser[]> {
    const resp = await instance.get(`/auth/groups/${groupId}/users`);
    return resp.data;
  }

  return {
    getAllGroups,
    getUsersByGroupId,
  };
}
