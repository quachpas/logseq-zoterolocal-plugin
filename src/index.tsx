import '@logseq/libs'

import { BlockCursorPosition } from '@logseq/libs/dist/LSPlugin'
import { createRoot } from 'react-dom/client'

import { handlePopup } from './handle-popup'
import { GlossaryObj } from './interfaces'
import { isValidSettings } from './services/check-settings'
import { createTemplateGlossary } from './services/create-template-glossary'
import { testZotConnection } from './services/get-zot-items'
import { handleSettings } from './settings'
import { ZotContainer } from './ZotContainer'

const main = async () => {
  console.log('logseq-zoterolocal-plugin loaded')

  // Used to handle any popups
  handlePopup()

  // Get initial items
  const response = await testZotConnection()
  handleSettings(response)
  if (response.code === 'error') return

  const validSettings = isValidSettings()
  if (!validSettings) return

  // Create schema for ZotItem properties
  const { supportDb } = await logseq.App.getInfo()

  if (supportDb) {
    const allProps = await logseq.Editor.getAllProperties()
    if (allProps && allProps.length > 0) {
      const propsInserted = allProps.filter((prop) =>
        prop.ident?.includes('zoterolocal'),
      )
      if (propsInserted.length === 0) {
        const propsArray = [
          'accessDate',
          'attachments',
          'citeKey',
          'collections',
          'creators',
          'date',
          'dateAdded',
          'dateModified',
          'DOI',
          'ISBN',
          'ISSN',
          'issue',
          'itemType',
          'journalAbbreviation',
          'key',
          'language',
          'libraryCatalog',
          'libraryLink',
          'publicationTitle',
          'relations',
          'shortTitle',
          'tags',
          'title',
          'url',
          'volume',
        ]

        for (const prop of propsArray) {
          let fixedProp = ''
          if (prop !== 'ISSN' && prop !== 'ISBN' && prop !== 'DOI') {
            fixedProp = prop.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)
          } else {
            fixedProp = prop
          }

          if (prop === 'attachments') {
            await logseq.Editor.upsertProperty(
              fixedProp,
              {
                type: 'default',
                cardinality: 'many',
              },
              { name: fixedProp },
            )
          } else if (prop === 'creators') {
            await logseq.Editor.upsertProperty(
              'authors',
              {
                cardinality: 'many',
                type: 'node',
              },
              { name: 'authors' },
            )
          } else if (prop.includes('date') || prop.includes('Date')) {
            await logseq.Editor.upsertProperty(
              fixedProp,
              {
                type: 'date',
                cardinality: 'one',
              },
              { name: fixedProp },
            )
          } else if (prop === 'itemType') {
            await logseq.Editor.upsertProperty(
              fixedProp,
              {
                type: 'node',
                cardinality: 'one',
              },
              { name: fixedProp },
            )
          } else if (prop === 'tags') {
            await logseq.Editor.upsertProperty(
              fixedProp,
              {
                type: 'node',
                cardinality: 'many',
              },
              { name: fixedProp },
            )
          } else if (prop === 'url' || prop === 'libraryLink') {
            await logseq.Editor.upsertProperty(
              fixedProp,
              {
                type: 'url',
                cardinality: 'one',
              },
              { name: fixedProp },
            )
          } else {
            await logseq.Editor.upsertProperty(
              fixedProp,
              {
                type: 'default',
              },
              { name: fixedProp },
            )
          }
        }
      }
    }
  }

  const el = document.getElementById('app')
  if (!el) return
  const root = createRoot(el)

  ///////////////////////////////////
  // INSERT FULL DOCUMENT IN GRAPH //
  ///////////////////////////////////
  logseq.Editor.registerSlashCommand('Zotero: Insert full item', async (e) => {
    const { rect } =
      (await logseq.Editor.getEditingCursorPosition()) as BlockCursorPosition
    root.render(<ZotContainer flag={'full'} uuid={e.uuid} rect={rect} />)
    logseq.showMainUI()

    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key !== 'Escape') {
        const searchField: HTMLInputElement =
          document.querySelector('#search-field')!
        searchField.focus()
      }
    })
  })

  //////////////////////////////
  // INSERT CITATION IN GRAPH //
  //////////////////////////////
  logseq.Editor.registerSlashCommand(
    'Zotero: Cite (insert citation)',
    async (e) => {
      const { rect } =
        (await logseq.Editor.getEditingCursorPosition()) as BlockCursorPosition
      root.render(<ZotContainer flag={'citation'} uuid={e.uuid} rect={rect} />)
      logseq.showMainUI()

      document.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key !== 'Escape') {
          const searchField: HTMLInputElement =
            document.querySelector('#search-field')!
          searchField.focus()
        }
      })
    },
  )

  //////////////////////////////////////////
  // DEPRECATED: REGISTER ICON TO TOOLBAR //
  //////////////////////////////////////////
  logseq.provideModel({
    async viewZotItems() {
      root.render(<ZotContainer flag={'table'} />)
      logseq.showMainUI()
    },
  })
  logseq.App.registerUIItem('toolbar', {
    key: 'logseq-zoterolocal-plugin',
    template: `<a data-on-click="viewZotItems" class="button"><i class="ti ti-news"></i></a>`,
  })

  // Insert glossary as blocks for user to choose
  logseq.Editor.registerSlashCommand('Insert Zotero template', async (e) => {
    const glossaryObj: Partial<GlossaryObj> = {
      // <% notes %> is not inside because they should belong in the blocks, not properties
      accessDate: '<% accessDate %>',
      attachments: '<% attachments %>',
      citeKey: '<% citeKey %>',
      collections: '<% collections %>',
      authors: '<% creators %>',
      date: '<% date %>',
      dateAdded: '<% dateAdded %>',
      dateModified: '<% dateModified %>',
      DOI: '<% DOI %>',
      ISBN: '<% ISBN %>',
      ISSN: '<% ISSN %>',
      issue: '<% issue %>',
      itemType: '<% itemType %>',
      journalAbbreviation: '<% journalAbbreviation %>',
      key: '<% key %>',
      language: '<% language %>',
      libraryCatalog: '<% libraryCatalog %>',
      libraryLink: '<% libraryLink %>',
      pages: '<% pages %>',
      parentItem: '<% parentItem %>',
      publicationTitle: '<% publicationTitle %>',
      relations: '<% relations %>',
      shortTitle: '<% shortTitle %>',
      tags: '<% tags %>',
      itemTitle: '<% title %>',
      url: '<% url %>',
      version: '<% version %>',
      volume: '<% volume %>',
    }

    await logseq.Editor.updateBlock(e.uuid, `Zotero Template`)

    // Add template props
    await logseq.Editor.upsertBlockProperty(
      e.uuid,
      'template',
      'Zotero Template',
    )
    await logseq.Editor.upsertBlockProperty(
      e.uuid,
      'template-including-parent',
      false,
    )

    await createTemplateGlossary(glossaryObj, e.uuid)
  })
}

logseq.ready(main).catch(console.error)
