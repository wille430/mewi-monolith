
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal
} = require('./runtime/index-browser')


const Prisma = {}

exports.Prisma = Prisma

/**
 * Prisma Client JS version: 3.14.0
 * Query Engine version: efdf9b1183dddfd4258cd181a72125755215ab7b
 */
Prisma.prismaVersion = {
  client: "3.14.0",
  engine: "efdf9b1183dddfd4258cd181a72125755215ab7b"
}

Prisma.PrismaClientKnownRequestError = () => {
  throw new Error(`PrismaClientKnownRequestError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  throw new Error(`PrismaClientUnknownRequestError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientRustPanicError = () => {
  throw new Error(`PrismaClientRustPanicError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientInitializationError = () => {
  throw new Error(`PrismaClientInitializationError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientValidationError = () => {
  throw new Error(`PrismaClientValidationError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  throw new Error(`sqltag is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.empty = () => {
  throw new Error(`empty is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.join = () => {
  throw new Error(`join is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.raw = () => {
  throw new Error(`raw is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.validator = () => (val) => val

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = 'DbNull'
Prisma.JsonNull = 'JsonNull'
Prisma.AnyNull = 'AnyNull'

/**
 * Enums
 */
// Based on
// https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275
function makeEnum(x) { return x; }

exports.Prisma.WatcherScalarFieldEnum = makeEnum({
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

exports.Prisma.UserWatcherScalarFieldEnum = makeEnum({
  id: 'id',
  watcherId: 'watcherId',
  notifiedAt: 'notifiedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  userId: 'userId'
});

exports.Prisma.UserScalarFieldEnum = makeEnum({
  id: 'id',
  email: 'email',
  password: 'password',
  premium: 'premium',
  roles: 'roles',
  loginStrategy: 'loginStrategy',
  likedListingIDs: 'likedListingIDs'
});

exports.Prisma.ListingScalarFieldEnum = makeEnum({
  id: 'id',
  origin_id: 'origin_id',
  title: 'title',
  body: 'body',
  category: 'category',
  date: 'date',
  redirectUrl: 'redirectUrl',
  imageUrl: 'imageUrl',
  region: 'region',
  origin: 'origin',
  isAuction: 'isAuction',
  auctionEnd: 'auctionEnd',
  likedByUserIDs: 'likedByUserIDs',
  entryPoint: 'entryPoint'
});

exports.Prisma.ScrapingLogScalarFieldEnum = makeEnum({
  id: 'id',
  added_count: 'added_count',
  error_count: 'error_count',
  entryPoint: 'entryPoint',
  scrapeToId: 'scrapeToId',
  scrapeToDate: 'scrapeToDate',
  target: 'target',
  triggered_by: 'triggered_by',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

exports.Prisma.EmailRecordScalarFieldEnum = makeEnum({
  id: 'id',
  to: 'to',
  from: 'from',
  type: 'type',
  userId: 'userId',
  createdAt: 'createdAt'
});

exports.Prisma.SortOrder = makeEnum({
  asc: 'asc',
  desc: 'desc'
});

exports.Prisma.QueryMode = makeEnum({
  default: 'default',
  insensitive: 'insensitive'
});
exports.LoginStrategy = makeEnum({
  GOOGLE: 'GOOGLE',
  LOCAL: 'LOCAL'
});

exports.Role = makeEnum({
  USER: 'USER',
  ADMIN: 'ADMIN',
  GUEST: 'GUEST'
});

exports.Category = makeEnum({
  FORDON: 'FORDON',
  FOR_HEMMET: 'FOR_HEMMET',
  PERSONLIGT: 'PERSONLIGT',
  ELEKTRONIK: 'ELEKTRONIK',
  FRITID_HOBBY: 'FRITID_HOBBY',
  AFFARSVERKSAMHET: 'AFFARSVERKSAMHET',
  OVRIGT: 'OVRIGT'
});

exports.ListingOrigin = makeEnum({
  Blocket: 'Blocket',
  Tradera: 'Tradera',
  Sellpy: 'Sellpy',
  Blipp: 'Blipp',
  Citiboard: 'Citiboard',
  Shpock: 'Shpock',
  Bytbil: 'Bytbil',
  Kvdbil: 'Kvdbil',
  Bilweb: 'Bilweb'
});

exports.ScraperTrigger = makeEnum({
  Manual: 'Manual',
  Scheduled: 'Scheduled'
});

exports.EmailType = makeEnum({
  WATCHER: 'WATCHER',
  ACCOUNT: 'ACCOUNT',
  EMAIL_CONFIRM: 'EMAIL_CONFIRM',
  PASSWORD_RESET: 'PASSWORD_RESET',
  INFO: 'INFO'
});

exports.Currency = makeEnum({
  SEK: 'SEK'
});

exports.Prisma.ModelName = makeEnum({
  Watcher: 'Watcher',
  UserWatcher: 'UserWatcher',
  User: 'User',
  Listing: 'Listing',
  ScrapingLog: 'ScrapingLog',
  EmailRecord: 'EmailRecord'
});

/**
 * Create the Client
 */
class PrismaClient {
  constructor() {
    throw new Error(
      `PrismaClient is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
    )
  }
}
exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
