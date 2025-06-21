import { ReactNode } from "react";

export interface ICommonFilter {
  id?: string;
  name?: string;
  userId?: string;
}

export interface ISelectOption<T> {
  label: string;
  value: T;
  tooltip?: ReactNode;
}
