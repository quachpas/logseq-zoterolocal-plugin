import { Badge, Flex, Text, Title } from '@mantine/core'
import { useCallback, useEffect, useRef } from 'react'
import { UseFormReset } from 'react-hook-form'

import { FormValues } from '../features/search-item'
import { CreatorItem, ZotData } from '../interfaces'
import { insertZotIntoGraph } from '../services/insert-zot-into-graph'
import { replaceTemplateWithValues } from '../services/replace-template-with-values'
import divStyle from '../styles/Div.module.css'

interface ResultCardProps {
  flag: 'full' | 'table' | 'citation'
  uuid: string
  item: ZotData
  reset: UseFormReset<FormValues>
  isSelected?: boolean
  onSelect?: () => void
}

const Creators = ({
  index,
  length,
  creator,
}: {
  index: number
  length: number
  creator: CreatorItem
}) => {
  return (
    <Text size="sm" mr="0.2rem">
      {creator.firstName} {creator.lastName} ({creator.creatorType})
      {length - index == 1 ? '' : ','}
    </Text>
  )
}

export const ResultCard = ({ flag, uuid, item, reset, isSelected = false, onSelect }: ResultCardProps) => {
  const { title, creators, itemType, citeKey, date } = item
  const cardRef = useRef<HTMLDivElement>(null)

  const insertCitation = useCallback(async () => {
    if (!citeKey || citeKey === 'N/A') {
      logseq.UI.showMsg(
        'Citation key not configured properly in Better BibTex',
        'error',
      )
      return
    }
    const templateStr = await replaceTemplateWithValues(
      logseq.settings!.citekeyTemplate as string,
      item,
    )
    await logseq.Editor.insertAtEditingCursor(templateStr)

    reset()
    logseq.hideMainUI()
  }, [item])

  const insertZot = useCallback(async () => {
    const pageName = await insertZotIntoGraph(item)
    reset()
    if (!pageName) return

    await logseq.Editor.updateBlock(uuid, `[[${pageName}]]`)
  }, [item])


  const handleClick = () => {
    if (flag === 'citation') insertCitation()
    if (flag === 'full') insertZot()
  }

  // Listen for selectItem event from keyboard navigation
  useEffect(() => {
    if (!isSelected) return

    const handleSelectEvent = () => {
      if (isSelected) {
        handleClick()
      }
    }

    const container = cardRef.current?.parentElement
    container?.addEventListener('selectItem', handleSelectEvent)

    return () => {
      container?.removeEventListener('selectItem', handleSelectEvent)
    }
  }, [isSelected, handleClick])

  return (
    <Flex
      ref={cardRef}
      onClick={handleClick}
      onMouseEnter={onSelect}
      direction="row"
      justify="space-between"
      my="0.2rem"
      className={divStyle.div}
      style={isSelected ? { backgroundColor: '#dbeafe' } : undefined}
    >
      <Flex p="lg" w="70%" direction="column">
        <Title size="md">
          {title}{' '}
          <Badge radius="sm" color="#A9A9A9" px="0.2rem">
            {itemType}
          </Badge>
        </Title>
        <Flex dir="row" wrap="wrap" mt="0.2rem">
          {creators &&
            creators.map((creator, index) => (
              <Creators
                key={index}
                index={index}
                length={creators.length}
                creator={creator}
              />
            ))}
        </Flex>
        {citeKey && <Text size="xs">Cite Key: {citeKey}</Text>}
      </Flex>
      <Flex p="lg" w="25%" direction="column" align="flex-end">
        <Text size="sm">{date}</Text>
        <Badge
          radius="sm"
          size="sm"
          px="0.2rem"
          color={item.inGraph ? 'green' : 'red'}
        >
          {item.inGraph ? 'in graph' : 'not in graph'}
        </Badge>
      </Flex>
    </Flex>
  )
}
