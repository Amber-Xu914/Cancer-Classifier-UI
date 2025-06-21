import { AxiosInstance } from 'axios';
import { IUsersClient, createUsersClient } from './Clients/Users/Users.client';
import { IRolesClient, createRolesClient } from './Clients/Roles/Roles.client';
import { IStudiesClient, createStudiesClient } from './Clients/Studies/Studies.client';
import { ISitesClient, createSitesClient } from './Clients/Sites/Sites.client';
import { IScopesClient, createScopesClient } from './Clients/Scopes/Scopes.client';
import { IGroupsClient, createGroupsClient } from './Clients/Groups/Groups.client';

export interface IAuthSDK {
  users: IUsersClient;
  groups: IGroupsClient;
  roles: IRolesClient;
  studies: IStudiesClient;
  sites: ISitesClient;
  scopes: IScopesClient;
}

export function createAuthSDK(
  instance: AxiosInstance,
): IAuthSDK {
  return {
    users: createUsersClient(instance),
    groups: createGroupsClient(instance),
    roles: createRolesClient(instance),
    studies: createStudiesClient(instance),
    sites: createSitesClient(instance),
    scopes: createScopesClient(instance),
  };
}
