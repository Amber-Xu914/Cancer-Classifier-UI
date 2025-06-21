import { Box } from '@mui/material';
import { Dispatch, ReactNode, SetStateAction, useEffect, useRef, useState } from 'react';
import useFetch from '../../Hooks/useFetch';
import LoadingAnimation from '../Animations/LoadingAnimation';
import { ScrollableSection } from './ScrollableSection';
import CustomTypography from './Typography';

interface IProps<DataType> {
  fetch: (page: number, limit: number) => Promise<DataType[]>;
  mapping: (
    data: DataType,
    key: number,
    update?: (value: DataType) => void,
    setRefresh?: Dispatch<SetStateAction<boolean>>
  ) => ReactNode;
  beforeMappingContent?: ReactNode;
  className?: string;
  updateCount?: (count: number) => void;
  loadOnce?: boolean;
  parentLoading?: boolean;
}

export default function InfiniteScrollSection<DataType>({
  fetch,
  mapping,
  beforeMappingContent,
  className,
  updateCount,
  loadOnce,
  parentLoading = false,
}: IProps<DataType>): React.ReactElement {
  const [page, setPage] = useState<number>(0);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [empty, setEmpty] = useState<boolean>(false);

  const observer = useRef<IntersectionObserver | null>(null);
  const loader = useRef<HTMLDivElement>(null);
  const id = useRef<string>(`wrapper-${Date.now()}`);

  const { loading, error, list, setList } = useFetch(
    fetch,
    page,
    setPage,
    setEmpty,
    refresh,
    setRefresh
  );

  useEffect(() => {
    if (updateCount !== undefined) {
      updateCount(list.length);
    }
  }, [list, updateCount]);

  useEffect(() => {
    function handleObserver(entries: IntersectionObserverEntry[]): void {
      const target = entries[0];
      if (target.isIntersecting) {
        setPage((prev) => prev + 1);
      }
    }

    const options = {
      root: document.getElementById(id.current),
      rootMargin: '0px',
      threshold: 0,
    };

    if (page === 0) {
      if (observer.current !== null) {
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver(handleObserver, options);
      if (loader.current) {
        observer.current.observe(loader.current);
      }
    }
  }, [id, page]);

  return (
    <ScrollableSection
      id={id.current}
      className={className}
      style={{
        maxHeight: '100vh',
        width: '100%',
        overflow: 'auto',
      }}
    >
      {beforeMappingContent}
      <div>
        {list.map((item, key) =>
          mapping(
            item,
            key,
            (newItem) => {
              const newList = [...list];
              newList[key] = newItem;
              setList(newList);
            },
            setRefresh
          )
        )}
      </div>
      {(loading || !loadOnce) && (
        <Box
          ref={loader}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          height={list.length > 0 ? '200px' : '600px'}
          width="100%"
          textAlign="center"
          fontWeight="bold"
        >
          {empty && !parentLoading && (
            <CustomTypography variant="bodyRegular" fontWeight="bold">
              No more data to load.
            </CustomTypography>
          )}
          {(loading || parentLoading) && (
            <LoadingAnimation
              msg={
                list.length === 0 && (
                  <>
                    <CustomTypography
                      variant="bodyRegular"
                      fontWeight="bold"
                      style={{ marginBottom: '5px' }}
                    >
                      LOADING...
                    </CustomTypography>
                    <CustomTypography variant="bodyRegular" fontWeight="bold">
                      Give us a moment. The data will be ready shortly.
                    </CustomTypography>
                  </>
                )
              }
            />
          )}
          {error && (
            <CustomTypography variant="bodyRegular" fontWeight="bold">
              There was an error fetching the data.
            </CustomTypography>
          )}
        </Box>
      )}
    </ScrollableSection>
  );
}
