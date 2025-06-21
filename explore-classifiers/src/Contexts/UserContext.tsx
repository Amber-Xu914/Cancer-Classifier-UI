import {
  useEffect, useState, createContext, ReactNode, useContext, useMemo,
  useCallback,
} from 'react';
import { IUserWithMetadata } from '../Types/User/User.types';
import { ICommonResp, IScopeResp } from '../Types/Common/Response.types';
import { Group } from '../Types/Auth/Group.types';
import { Role } from '../Types/Auth/Role.types';
import { useBaseSDK } from './BaseSDKContext';
import { Scope } from '../Types/Auth/Scope.types';

interface IProps {
  children: ReactNode;
}

interface IUserContext {
  currentUser?: IUserWithMetadata;
  loading: boolean;
  error?: string;
  users: IUserWithMetadata[];
  groups: ICommonResp<Group>[];
  roles: ICommonResp<Role>[];
  pseudoRoleScopes: IScopeResp<Scope>[];
  getGroupById: (groupId: string) => Group | null;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const UserContext = createContext<IUserContext>({
  loading: true,
  users: [],
  groups: [],
  roles: [],
  pseudoRoleScopes: [],
  getGroupById: () => null,
});

UserContext.displayName = 'UserContext';

export const useUser = (): IUserContext => useContext(UserContext);

export function UserProvider({ children }: IProps): React.ReactElement {
  const baseSDK = useBaseSDK();

  const [currentUser, setCurrentUser] = useState<IUserWithMetadata>();
  const [users, setUsers] = useState<IUserWithMetadata[]>([]);
  const [roles, setRoles] = useState<ICommonResp<Role>[]>([]);
  const [groups, setGroups] = useState<ICommonResp<Group>[]>([]);
  const [pseudoRoleScopes, setPseudoRoleScopes] = useState<IScopeResp<Scope>[]>([]);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function getCurrentUser(): Promise<void> {
      const currUser = await baseSDK.auth.users.getCurrentUser();
      setCurrentUser(currUser);
    }

    async function getAllUsers(): Promise<void> {
      const usersResp = await baseSDK.auth.users.getAllUsers();
      setUsers(usersResp.sort((a, b) => a.givenName.localeCompare(b.givenName)));
    }

    async function getAllGroups(): Promise<void> {
      const groupsResp = await baseSDK.auth.groups.getAllGroups();
      setGroups(groupsResp);
    }

    async function getAllRoles(): Promise<void> {
      const rolesResp = await baseSDK.auth.roles.getAllRoles();
      setRoles(rolesResp);

      // Fetch scopes for pseudo roles
      const pseudoRoleId = rolesResp.find((r) => r.name === 'Application Pseudo Role');
      const scopes = await baseSDK.auth.scopes.getScopesByRoleId(pseudoRoleId?.id || '');
      setPseudoRoleScopes(scopes);
    }

    setLoading(true);
    try {
      getCurrentUser();
      getAllUsers();
      getAllGroups();
      getAllRoles();
    } catch (err) {
      setError('An error occurred while getting current user');
    } finally {
      setLoading(false);
    }
  }, [baseSDK.auth]);

  const getGroupById = useCallback((groupId: string): Group | null => (
    groups.find((group) => group.id === groupId)?.name || null
  ), [groups]);

  const value = useMemo<IUserContext>(() => ({
    currentUser,
    loading,
    error,
    users,
    groups,
    roles,
    pseudoRoleScopes,
    getGroupById,
  }), [
    currentUser,
    loading,
    error,
    users,
    groups,
    roles,
    pseudoRoleScopes,
    getGroupById,
  ]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}
