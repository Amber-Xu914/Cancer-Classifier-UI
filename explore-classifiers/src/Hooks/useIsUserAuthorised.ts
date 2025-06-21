import { useState, useEffect } from 'react';
import { Scope } from '../Types/Auth/Scope.types';
import { useUser } from '../Contexts/UserContext';

export function useIsUserAuthorised(
  scope: Scope,
  isPseudoRoleApplicable?: boolean,
): boolean {
  const {
    currentUser,
    pseudoRoleScopes,
  } = useUser();

  const [isAuthorised, setIsAuthorised] = useState<boolean>(false);

  useEffect(() => {
    const scopes: Scope[] = currentUser?.scopes.map((s) => s.name) || [];

    // Append scopes from pseudo-roles
    if (isPseudoRoleApplicable) scopes.push(...pseudoRoleScopes.map((s) => s.name));

    setIsAuthorised(scopes.includes(scope) || false);
  }, [
    scope,
    pseudoRoleScopes,
    currentUser?.scopes,
    isPseudoRoleApplicable,
  ]);

  return isAuthorised;
}
