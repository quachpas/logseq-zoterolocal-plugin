import { SettingSchemaDesc } from '@logseq/libs/dist/LSPlugin.user'

export const handleSettings = async ({
  code,
  msg,
}: {
  code: 'error' | 'success'
  msg: string
}) => {
  let settings: SettingSchemaDesc[] = [
    {
      key: 'testConnection',
      type: 'heading',
      title: 'Connection Test',
      description: msg,
      default: '',
    },
  ]

  if (code === 'success') {
    const pluginSettings: SettingSchemaDesc[] = [
      {
        key: 'pagenameTemplate',
        type: 'string',
        title: 'Page Name Template',
        description: `Specify the page name for each Zotero import. Available placeholders: <% citeKey %>, <% title %>`,
        default: `R: <% citeKey %>`,
      },
      {
        key: 'citekeyTemplate',
        type: 'string',
        title: 'Template for Cite Key',
        description: `Specify the template when using the command /Zotero: Insert citation. Ensure that <% citeKey %> placeholder is indicated in your template`,
        default: '[@<% citeKey %>]',
      },
      {
        key: 'pageProps',
        type: 'enum',
        title: 'Page Properties (DB version)',
        description: 'Indicate the properties to include for each Zotero item',
        default: [
          'accessDate',
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
        ],
        enumPicker: 'checkbox',
        enumChoices: [
          'accessDate',
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
        ],
      },
      {
        key: 'zotTemplate',
        type: 'string',
        title: 'Template Name (MD version)',
        description:
          'The template name that holds your template for a Zotero page. Ensure that include parent is set to false. ',
        default: 'Zotero Template',
      },
      {
        key: 'authorTemplate',
        type: 'string',
        title: 'Author Template (MD version)',
        description:
          'Specify how authors should be shown in the properties. Available placeholders: <% firstName %>, <% lastName %>, <% creatorType %>',
        default: '<% firstName %> <% lastName %> (<% creatorType %>)',
      },
    ]

    settings = [...settings, ...pluginSettings]
  }

  logseq.useSettingsSchema(settings)
}
