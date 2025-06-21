import { AxiosInstance } from 'axios';
import { IFetchUsersFilter, IUserWithMetadata } from '../../../../Types/User/User.types';

export interface IUsersClient {
  getCurrentUser(): Promise<IUserWithMetadata>;
  getAllUsers(params?: IFetchUsersFilter): Promise<IUserWithMetadata[]>;
  getUserById(userId: string): Promise<IUserWithMetadata>;
  getUserByAzureId(azureId: string): Promise<IUserWithMetadata>;
}

export function createUsersClient(instance: AxiosInstance): IUsersClient {
  async function getAllUsers(params?: IFetchUsersFilter): Promise<IUserWithMetadata[]> {
    const resp = await instance.get('/auth/users', {
      params,
    });
    return resp.data;
  }

  async function getCurrentUser(): Promise<IUserWithMetadata> {
    const resp = await instance.get('/auth/users/me');
    return resp.data;
  }

  async function getUserById(userId: string): Promise<IUserWithMetadata> {
    const resp = await instance.get(`/auth/users/${userId}`);
    return resp.data;
  }

  async function getUserByAzureId(azureId: string): Promise<IUserWithMetadata> {
    const resp = await instance.get(`/auth/users/azure/${azureId}`);

    return resp.data;
  }

  return {
    getAllUsers,
    getCurrentUser,
    getUserById,
    getUserByAzureId,
  };
}
