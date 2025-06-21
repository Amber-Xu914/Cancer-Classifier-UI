import {
  Dispatch, SetStateAction, useEffect, useRef, useState,
} from 'react';

export interface IUseFetch<DataType> {
  loading: boolean;
  error: boolean;
  list: DataType[];
  setList: Dispatch<SetStateAction<DataType[]>>;
}

export default function useFetch<DataType>(
  fetchData: (p: number, l: number) => Promise<DataType[]>,
  page: number,
  setPage: Dispatch<SetStateAction<number>>,
  setEmpty: Dispatch<SetStateAction<boolean>>,
  refresh?: boolean,
  setRefresh?: Dispatch<SetStateAction<boolean>>,
): IUseFetch<DataType> {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [list, setList] = useState<DataType[]>([]);
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);

  const lastPageLoaded = useRef<number>(0);

  const limit = 10;

  // For page changes
  useEffect(() => {
    async function sendQuery(): Promise<void> {
      if (page < 1) {
        setLoading(true);
      } else {
        try {
          setLoading(true);
          setError(false);
          const res = await fetchData(page, limit);
          if (isFirstLoad) setIsFirstLoad(false);
          setList((prev) => [...prev, ...res]);
          if (res.length === 0) {
            setEmpty(true);
          }
          setLoading(false);
        } catch (err) {
          setLoading(false);
          setError(true);
        }
      }
    }

    if (lastPageLoaded.current === page && page !== 0 && !isFirstLoad) {
      setList([]);
      setEmpty(false);
      setPage(0);
      lastPageLoaded.current = 0;
    } else if (!isFirstLoad) {
      sendQuery();
      lastPageLoaded.current = page;
    } else if (isFirstLoad) {
      setIsFirstLoad(false);
    }
  }, [page, isFirstLoad, fetchData, setPage, setEmpty]);

  // For refresh
  useEffect(() => {
    async function refreshList(): Promise<void> {
      setError(false);
      fetchData(1, limit * page).then(
        (res) => {
          setList([...res]);
          if (res.length === 0) {
            setEmpty(true);
          }
        },
        () => {
          setLoading(false);
          setError(true);
        },
      );
      if (setRefresh) setRefresh(false);
    }

    if (refresh) {
      refreshList();
    }
  }, [
    refresh,
    page,
    setRefresh,
    fetchData,
    setEmpty,
  ]);

  return {
    loading, error, list, setList,
  };
}
