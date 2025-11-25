import { useQuery } from '@tanstack/react-query'

import { ZotData } from '../interfaces'
import {
  getZotItemsFromQueryString,
  getZotItemsWithoutQueryString,
} from '../services/get-zot-items'

export const useZotItems = () => {
  return useQuery<ZotData[], Error>({
    queryKey: ['zotItems'],
    queryFn: getZotItemsWithoutQueryString,
    retry: false,
    refetchOnWindowFocus: false,
  })
}

export const useZotItem = (queryString: string, options = {}) => {
  return useQuery<ZotData[], Error>({
    queryKey: ['zotItem', queryString],
    queryFn: () => getZotItemsFromQueryString(queryString),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!queryString && queryString.length > 3,
    ...options,
  })
}
