import { Flex, Input, Text } from '@mantine/core'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

import { ResultCard } from '../../components/ResultCard'
import { DEBOUNCE_DELAY } from '../../constants'
import { useDebounce } from '../../hooks/use-debounce'
import { useZotItem } from '../../hooks/use-items'
import { ZotData } from '../../interfaces'

export interface FormValues {
  search: string
}

export const SearchItem = ({
  flag,
  rect: { x, y },
  uuid,
}: {
  flag: 'full' | 'table' | 'citation'
  rect: { x: number; y: number }
  uuid: string
}) => {
  const { register, watch, reset } = useForm<FormValues>({
    defaultValues: {
      search: '',
    },
  })
  const queryString = watch('search')
  const debounceSearch = useDebounce(queryString, DEBOUNCE_DELAY)

  const { data: zotDataResult } = useZotItem(debounceSearch)

  const [selectedIndex, setSelectedIndex] = useState<number>(-1)
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down')
  const resultContainerRef = useRef<HTMLDivElement>(null)

  // Reset selection when search results change
  useEffect(() => {
    setSelectedIndex(-1)
  }, [zotDataResult])

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && resultContainerRef.current) {
      const selectedElement = resultContainerRef.current.children[selectedIndex] as HTMLElement
      if (selectedElement) {
        // Use 'start' when scrolling up to show the item at the top, 'nearest' when scrolling down
        const block = scrollDirection === 'up' ? 'start' : 'nearest'
        selectedElement.scrollIntoView({ block, behavior: 'smooth' })
      }
    }
  }, [selectedIndex, scrollDirection])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!zotDataResult || zotDataResult.length === 0) return

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setScrollDirection('down')
        setSelectedIndex((prev) =>
          prev < zotDataResult.length - 1 ? prev + 1 : prev
        )
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setScrollDirection('up')
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev))
      } else if (e.key === 'Enter' && selectedIndex >= 0) {
        e.preventDefault()
        // Trigger the selection - the ResultCard will handle the action
        const selectedItem = zotDataResult[selectedIndex]
        if (selectedItem) {
          // We need to trigger the same action as clicking the ResultCard
          const event = new CustomEvent('selectItem', { detail: { index: selectedIndex } })
          resultContainerRef.current?.dispatchEvent(event)
        }
      }
    },
    [zotDataResult, selectedIndex]
  )

  return (
    <Flex
      style={{ left: x, top: y, boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)' }}
      bg="#fff"
      direction="column"
      pos="absolute"
      w="40rem"
    >
      <Input
        id="search-field"
        w="full"
        {...register('search')}
        type="text"
        placeholder="Start searching"
        onKeyDown={handleKeyDown}
        rightSectionWidth="5rem"
        rightSection={
          <>
            {zotDataResult && zotDataResult.length == 0 && (
              <Text size="0.8rem" pl="sm" pt="0.2rem">
                No results
              </Text>
            )}
            {zotDataResult && zotDataResult.length > 0 && (
              <Text size="0.8rem" pl="sm" pt="0.2rem">
                {zotDataResult.length} results
              </Text>
            )}
          </>
        }
      />
      <Flex
        ref={resultContainerRef}
        direction="column"
        mah="18rem"
        style={{ flex: '0 1 auto', overflowY: 'scroll' }}
      >
        {zotDataResult &&
          zotDataResult.map((item: ZotData, index: number) => (
            <ResultCard
              key={item.key}
              flag={flag}
              uuid={uuid}
              item={item}
              reset={reset}
              isSelected={index === selectedIndex}
              onSelect={() => setSelectedIndex(index)}
            />
          ))}
      </Flex>
    </Flex>
  )
}
