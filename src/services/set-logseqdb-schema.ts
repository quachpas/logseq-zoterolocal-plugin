export const setLogseqDbSchema = async () => {
  const allProps = await logseq.Editor.getAllProperties()
  if (allProps && allProps.length > 0) {
    const propsInserted = allProps.filter((prop) =>
      prop.ident?.includes('zoterolocal'),
    )
    if (propsInserted.length === 0) {
      // Needed to check if the schema has already been inserted as re-setting the schema can messs with cardinality and type. Looks like at this point, Logseq allows duplicate properties
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
