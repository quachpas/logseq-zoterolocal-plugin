import { ZOT_DATA_KEY_MAP } from '../constants'

export const setLogseqDbSchema = async () => {
  const _addingTagMsg = await logseq.UI.showMsg(
    'Adding tag. Please wait...',
    'success',
  )
  /**
   Approach:
   1) Define all properties
   2) Add user-defined properties to Zotero tag
   **/
  const allProps = await logseq.Editor.getAllProperties()
  if (allProps && allProps.length > 0) {
    const propsInserted = allProps.filter((prop) =>
      prop.ident?.includes('zoterolocal'),
    )
    if (propsInserted.length === 0) {
      // Needed to check if the schema has already been inserted as re-setting the schema can messs with cardinality and type. Looks like at this point, Logseq allows duplicate properties
      const propsArray = Object.keys(ZOT_DATA_KEY_MAP)
      const allLsProps = await logseq.Editor.getAllProperties()

      for (const prop of propsArray) {
        let fixedProp = ''
        if (prop !== 'ISSN' && prop !== 'ISBN' && prop !== 'DOI') {
          fixedProp = prop.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)
        } else {
          fixedProp = prop
        }

        for (const lsProp of allLsProps!) {
          if (fixedProp !== lsProp.name) {
            if (prop === 'attachments') {
              await logseq.Editor.upsertProperty(
                fixedProp,
                {
                  cardinality: 'many',
                  type: 'default',
                },
                { name: fixedProp },
              )
            } else if (prop === 'creators') {
              await logseq.Editor.upsertProperty(
                fixedProp,
                {
                  cardinality: 'many',
                  type: 'node',
                },
                { name: fixedProp },
              )
            } else if (
              prop === 'accessDate' ||
              prop === 'dateAdded' ||
              prop === 'dateModified'
            ) {
              await logseq.Editor.upsertProperty(
                fixedProp,
                {
                  type: 'date',
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
  }

  // Create Zotero tag
  await logseq.Editor.createTag(logseq.settings?.zotTag as string)

  // Add props to Zotero tag
  const userDefinedProps = logseq.settings?.pageProps as string[]

  for (const prop of userDefinedProps) {
    let fixedProp = ''
    if (prop !== 'ISSN' && prop !== 'ISBN' && prop !== 'DOI') {
      fixedProp = prop.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)
    } else {
      fixedProp = prop
    }

    await logseq.Editor.addTagProperty(
      logseq.settings?.zotTag as string,
      fixedProp,
    )
  }

  logseq.UI.closeMsg('addingTagMsg')

  await logseq.UI.showMsg(
    `logseq-zoterolocal-plugin loaded. Tag: ${logseq.settings?.zotTag} added.`,
    'success',
  )
}
