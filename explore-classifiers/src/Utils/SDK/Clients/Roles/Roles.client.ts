import { AxiosInstance } from 'axios';
import { IUser } from '../../../../Types/User/User.types';
import { ICommonResp } from '../../../../Types/Common/Response.types';
import { ICommonFilter } from '../../../../Types/Common/Filter.types';
import { Role } from '../../../../Types/Auth/Role.types';

export interface IRolesClient {
  getAllRoles(params?: ICommonFilter): Promise<ICommonResp<Role>[]>;
  getUsersByRoleId(roleId: string): Promise<IUser[]>;
}

export function createRolesClient(instance: AxiosInstance): IRolesClient {
  async function getAllRoles(params?: ICommonFilter): Promise<ICommonResp<Role>[]> {
    const resp = await instance.get('/auth/roles', {
      params,
    });
    return resp.data;
  }

  async function getUsersByRoleId(roleId: string): Promise<IUser[]> {
    const resp = await instance.get(`/auth/roles/${roleId}/users`);
    return resp.data;
  }

  return {
    getAllRoles,
    getUsersByRoleId,
  };
}
