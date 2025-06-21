import axios from 'axios';
import { useAccount, useMsal } from '@azure/msal-react';
import {
  ReactNode, createContext, useCallback, useContext, useEffect, useState,
} from 'react';
import { IAuthSDK, createAuthSDK } from '../Utils/SDK/AuthSDK';
import LoadingPage from '../Components/Pages/Loading/LoadingPage';

export interface IBaseSDK {
  auth: IAuthSDK;
}

interface IProps {
  children: ReactNode;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const BaseSDKContext = createContext<IBaseSDK>({} as IBaseSDK);
export const useBaseSDK = (): IBaseSDK => useContext(BaseSDKContext);

export function BaseSDKProvider({ children }: IProps): React.ReactElement {
  const {
    accounts,
    inProgress,
    instance: msalInstance,
  } = useMsal();
  const account = useAccount(accounts[0] || {});

  const [baseSDK, setBaseSDK] = useState<IBaseSDK>();

  const createInterceptors = useCallback(async (req: any) => {
    // Magic to ensure calls to wait for auth first
    while (inProgress !== 'none') { /* wait for auth */ }
    if (msalInstance && account) {
      try {
        const tokenResult = await msalInstance.acquireTokenSilent({
          scopes: [`${import.meta.env.VITE_AUTH_CLIENT_ID}/User.Read`],
          account,
        });
        const newReq = req;
        newReq.headers.Authorization = `Bearer ${tokenResult.accessToken}`;
        newReq.headers['Content-Type'] = 'application/json';

        return newReq;
      } catch (err) {
        msalInstance.logoutRedirect({
          // Return false if you would like to stop navigation after local logout
          onRedirectNavigate: () => false,
        });
        console.error(err);
      }
    }
    return req;
  }, [account, inProgress, msalInstance]);

  useEffect(() => {
    function initBaseSDK(): IBaseSDK {
      const instance = axios.create({
        baseURL: import.meta.env.VITE_API_URL,
      });
      const authInstance = axios.create({
        baseURL: import.meta.env.VITE_AUTH_URL,
      });

      instance.interceptors.request.use(createInterceptors);
      authInstance.interceptors.request.use(createInterceptors);

      return {
        auth: createAuthSDK(authInstance),
      };
    }
    if (inProgress === 'none') setBaseSDK(initBaseSDK());
  }, [createInterceptors, inProgress]);

  return baseSDK ? (
    <BaseSDKContext.Provider value={baseSDK}>
      {children}
    </BaseSDKContext.Provider>
  ) : (
    <LoadingPage />
  );
}
