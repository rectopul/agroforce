import { useRouter } from "next/router"
import { useEffect, useState } from "react";

import qs from 'query-string';

export function usePagination() {
  const { locale } = useRouter();
  const history = useRouter();

  const [ actualPage, setActualPage ] = useState<number>(
    getActualPage() || 1
  );

  function getActualPage(): number | undefined {
    const queryParams = qs.parse(String(locale));
    const page = queryParams.page;

    return page ? Number(page) : undefined;
  }

  useEffect(() => {
    const queryParams = qs.parse(String(locale?.search(actualPage as any)));

    history.push({
      search: qs.stringify({
        ...queryParams,
        page: actualPage
      })
    })
  }, [actualPage])

  return {
    setActualPage,
    actualPage
  }
}
