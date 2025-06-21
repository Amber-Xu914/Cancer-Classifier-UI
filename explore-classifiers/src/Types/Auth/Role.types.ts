export const mappedRoles = [
  'Application Role',
] as const;
export type MappedRole = typeof mappedRoles[number];

export const pseudoRoles = [
  'Application Pseudo Role',
] as const;
export type PseudoRole = typeof pseudoRoles[number];

export const roles = [
  ...mappedRoles,
  ...pseudoRoles,
] as const;
export type Role = typeof roles[number];
