import { BlockEntity, IBatchBlock } from '@logseq/libs/dist/LSPlugin'
import { format, parse, parseISO } from 'date-fns'

import { ZotData } from '../interfaces'
import { getZotCollections } from './get-zot-items'
import { handleContentBlocks } from './handle-content-blocks'
import { replaceTemplateWithValues } from './replace-template-with-values'

export const insertZotIntoGraph = async (zotItem: ZotData) => {
  const msgId = await logseq.UI.showMsg('Inserting into graph...', 'warning')
  const { supportDb } = await logseq.App.getInfo()

  const pageName = (logseq.settings!.pagenameTemplate as string)
    .replace('<% title %>', zotItem.title)
    .replace('<% citeKey %>', zotItem.citeKey)
    .trim()

  if (supportDb) {
    // Create page
    if (
      (logseq.settings!.pagenameTemplate as string).includes('<% citeKey %>') &&
      zotItem.citeKey === 'N/A'
    ) {
      logseq.UI.showMsg(
        'Cite key is not configured properly in BetterBibTex',
        'error',
      )
      return
    }

    let existingPage = await logseq.Editor.getPage(pageName)
    if (!existingPage) {
      //Create page
      existingPage = await logseq.Editor.createPage(
        pageName,
        {},
        {
          redirect: true,
          createFirstBlock: false,
          journal: false,
        },
      )
    }
    if (!existingPage) return

    // Manually add one property by one property
    const selectedPageProps = logseq.settings?.pageProperties as string[]
    for (const prop of selectedPageProps) {
      let fixedProp = ''
      if (prop !== 'ISSN' && prop !== 'ISBN' && prop !== 'DOI') {
        fixedProp = prop.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)
      } else {
        fixedProp = prop
      }

      // @ts-expect-error need to type later
      const value = zotItem[prop]

      if (
        prop === 'version' ||
        prop === 'collections' ||
        prop === 'pages' ||
        prop === 'parentItem' ||
        value === undefined ||
        value === null ||
        value === '' ||
        (Array.isArray(value) && value.length === 0) || // Empty array
        (typeof value === 'object' && Object.keys(value).length === 0)
      ) {
        continue
      } else if (prop === 'attachments') {
        for (const attachment of value) {
          const url = `[${attachment.title}](${decodeURI(attachment.url ?? attachment.href)})`
          await logseq.Editor.upsertBlockProperty(
            existingPage.uuid,
            fixedProp,
            url,
          )
        }
      } else if (prop.includes('date') || prop.includes('Date')) {
        const page = await logseq.Editor.createJournalPage(
          format(
            parseISO(value) || parse(value, 'yyyy-MM-dd', new Date()),
            'yyyy-MM-dd',
          ),
        )
        if (!page) continue
        await logseq.Editor.upsertBlockProperty(
          existingPage.uuid,
          fixedProp,
          page.id,
        )
      } else if (prop === 'creators') {
        const creatorPageIds: number[] = []

        for (const creator of value) {
          const page = await logseq.Editor.createPage(
            `${creator.firstName} ${creator.lastName}`,
            {},
            { redirect: false },
          )
          if (page) creatorPageIds.push(page.id)
        }

        for (const id of creatorPageIds) {
          await logseq.Editor.upsertBlockProperty(
            existingPage.uuid,
            'authors',
            id,
          )
        }
      } else {
        await logseq.Editor.upsertBlockProperty(
          existingPage.uuid,
          fixedProp,
          value,
        )
      }
    }
  }

  if (!supportDb) {
    const templateName = logseq.settings!.zotTemplate as string
    if (!templateName && templateName.length === 0) {
      logseq.UI.showMsg(
        'Please define a template name in the plugin settings first',
        'error',
      )
      return
    }

    const templateRoot = await logseq.App.getTemplate(templateName)
    if (!templateRoot) {
      logseq.UI.showMsg(`Unable to locate template`, 'error')
      return
    }
    if (templateRoot.properties!.templateIncludingParent === 'false') {
      logseq.UI.showMsg(
        `Ensure that the template property 'template-including-parent' is set to false or that your template block has its properties set`,
        'error',
      )
      return
    }

    const template = (await logseq.Editor.getBlock(templateRoot.uuid, {
      includeChildren: true,
    }))!.children as BlockEntity[]

    if (template.length === 0) {
      logseq.UI.showMsg(`Please ensure a template is created`, 'error')
      return
    }

    const collections = await getZotCollections()

    // template[0] will always be the block properties
    const pageProps = await replaceTemplateWithValues(
      template[0]!.content as string,
      zotItem,
      collections,
    )

    // Can only be <% title %> or <% citeKey %>. Latter may not be 'N/A'
    if (
      (logseq.settings!.pagenameTemplate as string).includes('<% citeKey %>') &&
      zotItem.citeKey === 'N/A'
    ) {
      logseq.UI.showMsg(
        'Cite key is not configured properly in BetterBibTex',
        'error',
      )
      return
    }

    const existingPage = await logseq.Editor.getPage(pageName)
    if (!existingPage) {
      //Create page
      await logseq.Editor.createPage(
        pageName,
        {},
        {
          redirect: false,
          createFirstBlock: false,
          journal: false,
        },
      )
      // Create properties block
      const propsBlock = await logseq.Editor.appendBlockInPage(
        pageName,
        pageProps,
      )
      // Add content from template
      // First block is the properties, which has already been inserted
      const contentBlockArr = template.slice(1) as BlockEntity[]
      const result: IBatchBlock[] = []

      await handleContentBlocks(contentBlockArr, zotItem, result)
      await logseq.Editor.insertBatchBlock(propsBlock!.uuid, result)
    }
  }

  logseq.UI.closeMsg(msgId)
  logseq.UI.showMsg('Completed!', 'success')
  logseq.hideMainUI()
  return pageName
}
