import { Group } from '../Auth/Group.types';
import { Role } from '../Auth/Role.types';
import { Scope } from '../Auth/Scope.types';
import { ICommonResp, IScopeResp } from '../Common/Response.types';

export interface IUser {
  id: string;
  azureId: string;
  givenName: string;
  familyName: string;
  email: string;
  title?: string;
  avatar?: string;
}

export interface IMetadata {
  groups: ICommonResp<Group>[];
  roles: ICommonResp<Role>[];
  studies: ICommonResp<string>[];
  sites: ICommonResp<string>[];
  scopes: IScopeResp<Scope>[];
  // TODO - To be implemented in auth MS first
  // samples: ISampleResp[];
}

export interface IUserWithMetadata extends IUser, IMetadata {}

export interface IAvatar {
  background?: string,
  border?: string,
  url?: string,
}

export interface IFetchUsersFilter {
  ids?: string[];
  azureIds?: string[];
  groupIds?: string[];
  roleIds?: string[];
  scopeIds?: string[];
  studyIds?: string[];
}
