import { ZotData, ZotItem } from './interfaces'

export const ZOT_URL = 'http://127.0.0.1:23119/api/users/0'
export const COLLECTIONS_URL = 'http://127.0.0.1:23119/api/users/0/collections'
export const ZOTERO_LIBRARY_ITEM = 'zotero://select/library/items?itemKey='
export const BASE_QUERY = {
  sort: 'dateAdded',
  direction: 'desc',
}

export const FUSE_KEYS = [
  {
    name: 'combinedSearch',
    weight: 1,
    getFn: (obj: ZotItem) => {
      const authors = obj.data.creators
        ? obj.data.creators
            .filter((creator) => creator.creatorType === 'author')
            .map((author) => `${author.firstName} ${author.lastName}`)
            .join(' ')
        : ''
      const year = obj.data.date
        ? new Date(obj.data.date).getFullYear().toString()
        : ''
      return `${authors} ${obj.data.title} ${year}`.trim()
    },
  },
  {
    name: 'creators',
    weight: 0.9,
    getFn: (obj: ZotItem) => {
      return obj.data.creators
        ? obj.data.creators
            .filter((creator) => creator.creatorType === 'author')
            .map((author) => `${author.firstName} ${author.lastName}`)
            .join(' ')
        : ''
    },
  },
  { name: 'title', weight: 0.9 },
  {
    name: 'date',
    weight: 0.7,
  },
  { name: 'abstractNote', weight: 0.3 },
  { name: 'citeKey', weight: 0.6 },
  { name: 'itemType', weight: 0.2 },
  { name: 'journalAbbreviation', weight: 0.4 },
  { name: 'key', weight: 0.5 },
  { name: 'publicationTitle', weight: 0.5 },
  { name: 'shortTitle', weight: 0.4 },
  { name: 'url', weight: 0.3 },
]

export const FUSE_THRESHOLD = 0.6

export const DEBOUNCE_DELAY = 400

export const ZOT_DATA_KEY_MAP = {
  key: true,
  version: true,
  itemType: true,
  title: true,
  parentItem: true,
  abstractNote: true,
  date: true,
  language: true,
  shortTitle: true,
  libraryCatalog: true,
  url: true,
  accessDate: true,
  extra: true,
  note: true,
  linkMode: true,
  contentType: true,
  charset: true,
  filename: true,
  mtime: true,
  md5: true,
  tags: true,
  collections: true,
  relations: true,
  dateAdded: true,
  dateModified: true,
  creators: true,
  publisher: true,
  ISBN: true,
  ISSN: true,
  pages: true,
  bookTitle: true,
  volume: true,
  publicationTitle: true,
  DOI: true,
  issue: true,
  journalAbbreviation: true,
  repository: true,
  archiveID: true,
  archive: true,
  archiveLocation: true,
  callNumber: true,
  series: true,
  seriesNumber: true,
  seriesText: true,
  seriesTitle: true,
  numberOfVolumes: true,
  numPages: true,
  place: true,
  university: true,
  institution: true,
  company: true,
  country: true,
  court: true,
  legislativeBody: true,
  committee: true,
  distributor: true,
  meetingPlace: true,
  year: true,
  month: true,
  day: true,
  filingDate: true,
  issueDate: true,
  caseName: true,
  docketNumber: true,
  code: true,
  codeNumber: true,
  codePages: true,
  codeVolume: true,
  billNumber: true,
  applicationNumber: true,
  patentNumber: true,
  issuingAuthority: true,
  legalStatus: true,
  reportNumber: true,
  reportType: true,
  thesisType: true,
  manuscriptType: true,
  mapType: true,
  scale: true,
  presentationType: true,
  meetingName: true,
  artworkMedium: true,
  artworkSize: true,
  medium: true,
  audioFileType: true,
  audioRecordingFormat: true,
  videoRecordingFormat: true,
  runningTime: true,
  radioProgramTitle: true,
  tvProgramTitle: true,
  network: true,
  studio: true,
  label: true,
  websiteTitle: true,
  websiteType: true,
  blogTitle: true,
  forumTitle: true,
  postType: true,
  encyclopediaTitle: true,
  edition: true,
  firstPage: true,
  section: true,
  subject: true,
  genre: true,
  references: true,
  history: true,
  system: true,
  versionNumber: true,
  email: true,
  rights: true,
  license: true,
  number: true,
  assignee: true,
  // --- Custom plugin fields ---
  attachments: true,
  citeKey: true,
  inGraph: true,
  libraryLink: true,
  notes: true,
} satisfies Record<keyof ZotData, true>
