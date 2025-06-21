import { AxiosInstance } from 'axios';
import { IScopeResp } from '../../../../Types/Common/Response.types';
import { ICommonFilter } from '../../../../Types/Common/Filter.types';
import { Scope } from '../../../../Types/Auth/Scope.types';

export interface IScopesClient {
  getAllScopes(params?: ICommonFilter): Promise<IScopeResp<Scope>[]>;
  getScopesByRoleId(roleId: string): Promise<IScopeResp<Scope>[]>;
}

export function createScopesClient(instance: AxiosInstance): IScopesClient {
  async function getAllScopes(params?: ICommonFilter): Promise<IScopeResp<Scope>[]> {
    const resp = await instance.get('/auth/scopes', {
      params,
    });
    return resp.data;
  }

  async function getScopesByRoleId(roleId: string): Promise<IScopeResp<Scope>[]> {
    const resp = await instance.get(`/auth/roles/${roleId}/scopes`);

    return resp.data;
  }

  return {
    getAllScopes,
    getScopesByRoleId,
  };
}
