export interface ICommonResp<T> {
  id: string;
  name: T;
}

export interface IScopeResp<T> extends ICommonResp<T> {
  applicationId: string;
  applicationName: string;
}
