
/**
 * Client
**/

import * as runtime from './runtime/index';
declare const prisma: unique symbol
export type PrismaPromise<A> = Promise<A> & {[prisma]: true}
type UnwrapPromise<P extends any> = P extends Promise<infer R> ? R : P
type UnwrapTuple<Tuple extends readonly unknown[]> = {
  [K in keyof Tuple]: K extends `${number}` ? Tuple[K] extends PrismaPromise<infer X> ? X : UnwrapPromise<Tuple[K]> : UnwrapPromise<Tuple[K]>
};


/**
 * Model PasswordReset
 * 
 */
export type PasswordReset = {
  tokenHash: string
  expiration: number
}

/**
 * Model EmailUpdate
 * 
 */
export type EmailUpdate = {
  newEmail: string
  tokenHash: string
  expiration: Date
}

/**
 * Model Metadata
 * 
 */
export type Metadata = {
  keyword: string | null
  region: string | null
  categories: Category[]
  auction: boolean | null
  priceRangeGte: number | null
  priceRangeLte: number | null
  dateGte: Date | null
  origins: ListingOrigin[]
}

/**
 * Model Price
 * 
 */
export type Price = {
  value: number
  currency: Currency
}

/**
 * Model Paramater
 * 
 */
export type Paramater = {
  label: string
  value: string
}

/**
 * Model Watcher
 * 
 */
export type Watcher = {
  metadata: Metadata
  id: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Model UserWatcher
 * 
 */
export type UserWatcher = {
  id: string
  watcherId: string
  notifiedAt: Date | null
  createdAt: Date
  updatedAt: Date
  userId: string
}

/**
 * Model User
 * 
 */
export type User = {
  passwordReset: PasswordReset | null
  emailUpdate: EmailUpdate | null
  id: string
  email: string
  password: string | null
  premium: boolean
  roles: Role[]
  loginStrategy: LoginStrategy
  likedListingIDs: string[]
}

/**
 * Model Listing
 * 
 */
export type Listing = {
  price: Price | null
  parameters: Paramater[]
  id: string
  origin_id: string
  title: string
  body: string | null
  category: Category
  date: Date
  redirectUrl: string
  imageUrl: string[]
  region: string | null
  origin: ListingOrigin
  isAuction: boolean
  auctionEnd: Date | null
  likedByUserIDs: string[]
  entryPoint: string
}

/**
 * Model ScrapingLog
 * 
 */
export type ScrapingLog = {
  id: string
  added_count: number
  error_count: number
  entryPoint: string
  scrapeToId: string | null
  scrapeToDate: Date | null
  target: ListingOrigin
  triggered_by: ScraperTrigger
  createdAt: Date
  updatedAt: Date
}

/**
 * Model EmailRecord
 * 
 */
export type EmailRecord = {
  id: string
  to: string
  from: string
  type: EmailType
  userId: string | null
  createdAt: Date
}


/**
 * Enums
 */

// Based on
// https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275

export const LoginStrategy: {
  GOOGLE: 'GOOGLE',
  LOCAL: 'LOCAL'
};

export type LoginStrategy = (typeof LoginStrategy)[keyof typeof LoginStrategy]


export const Role: {
  USER: 'USER',
  ADMIN: 'ADMIN',
  GUEST: 'GUEST'
};

export type Role = (typeof Role)[keyof typeof Role]


export const Category: {
  FORDON: 'FORDON',
  FOR_HEMMET: 'FOR_HEMMET',
  PERSONLIGT: 'PERSONLIGT',
  ELEKTRONIK: 'ELEKTRONIK',
  FRITID_HOBBY: 'FRITID_HOBBY',
  AFFARSVERKSAMHET: 'AFFARSVERKSAMHET',
  OVRIGT: 'OVRIGT'
};

export type Category = (typeof Category)[keyof typeof Category]


export const ListingOrigin: {
  Blocket: 'Blocket',
  Tradera: 'Tradera',
  Sellpy: 'Sellpy',
  Blipp: 'Blipp',
  Citiboard: 'Citiboard',
  Shpock: 'Shpock',
  Bytbil: 'Bytbil',
  Kvdbil: 'Kvdbil',
  Bilweb: 'Bilweb'
};

export type ListingOrigin = (typeof ListingOrigin)[keyof typeof ListingOrigin]


export const ScraperTrigger: {
  Manual: 'Manual',
  Scheduled: 'Scheduled'
};

export type ScraperTrigger = (typeof ScraperTrigger)[keyof typeof ScraperTrigger]


export const EmailType: {
  WATCHER: 'WATCHER',
  ACCOUNT: 'ACCOUNT',
  EMAIL_CONFIRM: 'EMAIL_CONFIRM',
  PASSWORD_RESET: 'PASSWORD_RESET',
  INFO: 'INFO'
};

export type EmailType = (typeof EmailType)[keyof typeof EmailType]


export const Currency: {
  SEK: 'SEK'
};

export type Currency = (typeof Currency)[keyof typeof Currency]


/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Watchers
 * const watchers = await prisma.watcher.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  T extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof T ? T['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<T['log']> : never : never,
  GlobalReject = 'rejectOnNotFound' extends keyof T
    ? T['rejectOnNotFound']
    : false
      > {
      /**
       * @private
       */
      private fetcher;
      /**
       * @private
       */
      private readonly dmmf;
      /**
       * @private
       */
      private connectionPromise?;
      /**
       * @private
       */
      private disconnectionPromise?;
      /**
       * @private
       */
      private readonly engineConfig;
      /**
       * @private
       */
      private readonly measurePerformance;

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Watchers
   * const watchers = await prisma.watcher.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<T, Prisma.PrismaClientOptions>);
  $on<V extends (U | 'beforeExit')>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : V extends 'beforeExit' ? () => Promise<void> : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): Promise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): Promise<void>;

  /**
   * Add a middleware
   */
  $use(cb: Prisma.Middleware): void

/**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends PrismaPromise<any>[]>(arg: [...P]): Promise<UnwrapTuple<P>>;


  /**
   * Executes a raw MongoDB command and returns the result of it.
   * @example
   * ```
   * const user = await prisma.$runCommandRaw({
   *   aggregate: 'User',
   *   pipeline: [{ $match: { name: 'Bob' } }, { $project: { email: true, _id: false } }],
   *   explain: false,
   * })
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $runCommandRaw(command: Prisma.InputJsonObject): PrismaPromise<Prisma.JsonObject>;

      /**
   * `prisma.watcher`: Exposes CRUD operations for the **Watcher** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Watchers
    * const watchers = await prisma.watcher.findMany()
    * ```
    */
  get watcher(): Prisma.WatcherDelegate<GlobalReject>;

  /**
   * `prisma.userWatcher`: Exposes CRUD operations for the **UserWatcher** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserWatchers
    * const userWatchers = await prisma.userWatcher.findMany()
    * ```
    */
  get userWatcher(): Prisma.UserWatcherDelegate<GlobalReject>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<GlobalReject>;

  /**
   * `prisma.listing`: Exposes CRUD operations for the **Listing** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Listings
    * const listings = await prisma.listing.findMany()
    * ```
    */
  get listing(): Prisma.ListingDelegate<GlobalReject>;

  /**
   * `prisma.scrapingLog`: Exposes CRUD operations for the **ScrapingLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ScrapingLogs
    * const scrapingLogs = await prisma.scrapingLog.findMany()
    * ```
    */
  get scrapingLog(): Prisma.ScrapingLogDelegate<GlobalReject>;

  /**
   * `prisma.emailRecord`: Exposes CRUD operations for the **EmailRecord** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more EmailRecords
    * const emailRecords = await prisma.emailRecord.findMany()
    * ```
    */
  get emailRecord(): Prisma.EmailRecordDelegate<GlobalReject>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  /**
   * Prisma Client JS version: 3.14.0
   * Query Engine version: efdf9b1183dddfd4258cd181a72125755215ab7b
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON object.
   * This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from. 
   */
  export type JsonObject = {[Key in string]?: JsonValue}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON array.
   */
  export interface JsonArray extends Array<JsonValue> {}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches any valid JSON value.
   */
  export type JsonValue = string | number | boolean | JsonObject | JsonArray | null

  /**
   * Matches a JSON object.
   * Unlike `JsonObject`, this type allows undefined and read-only properties.
   */
  export type InputJsonObject = {readonly [Key in string]?: InputJsonValue | null}

  /**
   * Matches a JSON array.
   * Unlike `JsonArray`, readonly arrays are assignable to this type.
   */
  export interface InputJsonArray extends ReadonlyArray<InputJsonValue | null> {}

  /**
   * Matches any valid value that can be used as an input for operations like
   * create and update as the value of a JSON field. Unlike `JsonValue`, this
   * type allows read-only arrays and read-only object properties and disallows
   * `null` at the top level.
   *
   * `null` cannot be used as the value of a JSON field because its meaning
   * would be ambiguous. Use `Prisma.JsonNull` to store the JSON null value or
   * `Prisma.DbNull` to clear the JSON value and set the field to the database
   * NULL value instead.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-by-null-values
   */
  export type InputJsonValue = string | number | boolean | InputJsonObject | InputJsonArray

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: 'DbNull'

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: 'JsonNull'

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: 'AnyNull'

  type SelectAndInclude = {
    select: any
    include: any
  }
  type HasSelect = {
    select: any
  }
  type HasInclude = {
    include: any
  }
  type CheckSelect<T, S, U> = T extends SelectAndInclude
    ? 'Please either choose `select` or `include`'
    : T extends HasSelect
    ? U
    : T extends HasInclude
    ? U
    : S

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => Promise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = {
    [key in keyof T]: T[key] extends false | undefined | null ? never : key
  }[keyof T]

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Buffer
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Exact<A, W = unknown> = 
  W extends unknown ? A extends Narrowable ? Cast<A, W> : Cast<
  {[K in keyof A]: K extends keyof W ? Exact<A[K], W[K]> : never},
  {[K in keyof W]: K extends keyof A ? Exact<A[K], W[K]> : W[K]}>
  : never;

  type Narrowable = string | number | boolean | bigint;

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;

  export function validator<V>(): <S>(select: Exact<S, V>) => S;

  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but with an array
   */
  type PickArray<T, K extends Array<keyof T>> = Prisma__Pick<T, TupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T

  class PrismaClientFetcher {
    private readonly prisma;
    private readonly debug;
    private readonly hooks?;
    constructor(prisma: PrismaClient<any, any>, debug?: boolean, hooks?: Hooks | undefined);
    request<T>(document: any, dataPath?: string[], rootField?: string, typeName?: string, isList?: boolean, callsite?: string): Promise<T>;
    sanitizeMessage(message: string): string;
    protected unpack(document: any, data: any, path: string[], rootField?: string, isList?: boolean): any;
  }

  export const ModelName: {
    Watcher: 'Watcher',
    UserWatcher: 'UserWatcher',
    User: 'User',
    Listing: 'Listing',
    ScrapingLog: 'ScrapingLog',
    EmailRecord: 'EmailRecord'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  export type RejectOnNotFound = boolean | ((error: Error) => Error)
  export type RejectPerModel = { [P in ModelName]?: RejectOnNotFound }
  export type RejectPerOperation =  { [P in "findUnique" | "findFirst"]?: RejectPerModel | RejectOnNotFound } 
  type IsReject<T> = T extends true ? True : T extends (err: Error) => Error ? True : False
  export type HasReject<
    GlobalRejectSettings extends Prisma.PrismaClientOptions['rejectOnNotFound'],
    LocalRejectSettings,
    Action extends PrismaAction,
    Model extends ModelName
  > = LocalRejectSettings extends RejectOnNotFound
    ? IsReject<LocalRejectSettings>
    : GlobalRejectSettings extends RejectPerOperation
    ? Action extends keyof GlobalRejectSettings
      ? GlobalRejectSettings[Action] extends RejectOnNotFound
        ? IsReject<GlobalRejectSettings[Action]>
        : GlobalRejectSettings[Action] extends RejectPerModel
        ? Model extends keyof GlobalRejectSettings[Action]
          ? IsReject<GlobalRejectSettings[Action][Model]>
          : False
        : False
      : False
    : IsReject<GlobalRejectSettings>
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'

  export interface PrismaClientOptions {
    /**
     * Configure findUnique/findFirst to throw an error if the query returns null. 
     *  * @example
     * ```
     * // Reject on both findUnique/findFirst
     * rejectOnNotFound: true
     * // Reject only on findFirst with a custom error
     * rejectOnNotFound: { findFirst: (err) => new Error("Custom Error")}
     * // Reject on user.findUnique with a custom error
     * rejectOnNotFound: { findUnique: {User: (err) => new Error("User not found")}}
     * ```
     */
    rejectOnNotFound?: RejectOnNotFound | RejectPerOperation
    /**
     * Overwrites the datasource url from your prisma.schema file
     */
    datasources?: Datasources

    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat

    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: Array<LogLevel | LogDefinition>
  }

  export type Hooks = {
    beforeRequest?: (options: { query: string, path: string[], rootField?: string, typeName?: string, document: any }) => any
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findMany'
    | 'findFirst'
    | 'create'
    | 'createMany'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'

  /**
   * These options are being passed in to the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => Promise<T>,
  ) => Promise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type WatcherCountOutputType
   */


  export type WatcherCountOutputType = {
    UserWatcher: number
  }

  export type WatcherCountOutputTypeSelect = {
    UserWatcher?: boolean
  }

  export type WatcherCountOutputTypeGetPayload<
    S extends boolean | null | undefined | WatcherCountOutputTypeArgs,
    U = keyof S
      > = S extends true
        ? WatcherCountOutputType
    : S extends undefined
    ? never
    : S extends WatcherCountOutputTypeArgs
    ?'include' extends U
    ? WatcherCountOutputType 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
    P extends keyof WatcherCountOutputType ? WatcherCountOutputType[P] : never
  } 
    : WatcherCountOutputType
  : WatcherCountOutputType




  // Custom InputTypes

  /**
   * WatcherCountOutputType without action
   */
  export type WatcherCountOutputTypeArgs = {
    /**
     * Select specific fields to fetch from the WatcherCountOutputType
     * 
    **/
    select?: WatcherCountOutputTypeSelect | null
  }



  /**
   * Count Type UserCountOutputType
   */


  export type UserCountOutputType = {
    watchers: number
    likedListings: number
    EmailRecord: number
  }

  export type UserCountOutputTypeSelect = {
    watchers?: boolean
    likedListings?: boolean
    EmailRecord?: boolean
  }

  export type UserCountOutputTypeGetPayload<
    S extends boolean | null | undefined | UserCountOutputTypeArgs,
    U = keyof S
      > = S extends true
        ? UserCountOutputType
    : S extends undefined
    ? never
    : S extends UserCountOutputTypeArgs
    ?'include' extends U
    ? UserCountOutputType 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
    P extends keyof UserCountOutputType ? UserCountOutputType[P] : never
  } 
    : UserCountOutputType
  : UserCountOutputType




  // Custom InputTypes

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeArgs = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     * 
    **/
    select?: UserCountOutputTypeSelect | null
  }



  /**
   * Count Type ListingCountOutputType
   */


  export type ListingCountOutputType = {
    likedBy: number
  }

  export type ListingCountOutputTypeSelect = {
    likedBy?: boolean
  }

  export type ListingCountOutputTypeGetPayload<
    S extends boolean | null | undefined | ListingCountOutputTypeArgs,
    U = keyof S
      > = S extends true
        ? ListingCountOutputType
    : S extends undefined
    ? never
    : S extends ListingCountOutputTypeArgs
    ?'include' extends U
    ? ListingCountOutputType 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
    P extends keyof ListingCountOutputType ? ListingCountOutputType[P] : never
  } 
    : ListingCountOutputType
  : ListingCountOutputType




  // Custom InputTypes

  /**
   * ListingCountOutputType without action
   */
  export type ListingCountOutputTypeArgs = {
    /**
     * Select specific fields to fetch from the ListingCountOutputType
     * 
    **/
    select?: ListingCountOutputTypeSelect | null
  }



  /**
   * Models
   */

  /**
   * Model PasswordReset
   */





  export type PasswordResetSelect = {
    tokenHash?: boolean
    expiration?: boolean
  }

  export type PasswordResetGetPayload<
    S extends boolean | null | undefined | PasswordResetArgs,
    U = keyof S
      > = S extends true
        ? PasswordReset
    : S extends undefined
    ? never
    : S extends PasswordResetArgs
    ?'include' extends U
    ? PasswordReset 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
    P extends keyof PasswordReset ? PasswordReset[P] : never
  } 
    : PasswordReset
  : PasswordReset



  export interface PasswordResetDelegate<GlobalRejectSettings> {





  }

  /**
   * The delegate class that acts as a "Promise-like" for PasswordReset.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__PasswordResetClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';


    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * PasswordReset without action
   */
  export type PasswordResetArgs = {
    /**
     * Select specific fields to fetch from the PasswordReset
     * 
    **/
    select?: PasswordResetSelect | null
  }



  /**
   * Model EmailUpdate
   */





  export type EmailUpdateSelect = {
    newEmail?: boolean
    tokenHash?: boolean
    expiration?: boolean
  }

  export type EmailUpdateGetPayload<
    S extends boolean | null | undefined | EmailUpdateArgs,
    U = keyof S
      > = S extends true
        ? EmailUpdate
    : S extends undefined
    ? never
    : S extends EmailUpdateArgs
    ?'include' extends U
    ? EmailUpdate 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
    P extends keyof EmailUpdate ? EmailUpdate[P] : never
  } 
    : EmailUpdate
  : EmailUpdate



  export interface EmailUpdateDelegate<GlobalRejectSettings> {





  }

  /**
   * The delegate class that acts as a "Promise-like" for EmailUpdate.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__EmailUpdateClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';


    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * EmailUpdate without action
   */
  export type EmailUpdateArgs = {
    /**
     * Select specific fields to fetch from the EmailUpdate
     * 
    **/
    select?: EmailUpdateSelect | null
  }



  /**
   * Model Metadata
   */





  export type MetadataSelect = {
    keyword?: boolean
    region?: boolean
    categories?: boolean
    auction?: boolean
    priceRangeGte?: boolean
    priceRangeLte?: boolean
    dateGte?: boolean
    origins?: boolean
  }

  export type MetadataGetPayload<
    S extends boolean | null | undefined | MetadataArgs,
    U = keyof S
      > = S extends true
        ? Metadata
    : S extends undefined
    ? never
    : S extends MetadataArgs
    ?'include' extends U
    ? Metadata 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
    P extends keyof Metadata ? Metadata[P] : never
  } 
    : Metadata
  : Metadata



  export interface MetadataDelegate<GlobalRejectSettings> {





  }

  /**
   * The delegate class that acts as a "Promise-like" for Metadata.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__MetadataClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';


    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * Metadata without action
   */
  export type MetadataArgs = {
    /**
     * Select specific fields to fetch from the Metadata
     * 
    **/
    select?: MetadataSelect | null
  }



  /**
   * Model Price
   */





  export type PriceSelect = {
    value?: boolean
    currency?: boolean
  }

  export type PriceGetPayload<
    S extends boolean | null | undefined | PriceArgs,
    U = keyof S
      > = S extends true
        ? Price
    : S extends undefined
    ? never
    : S extends PriceArgs
    ?'include' extends U
    ? Price 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
    P extends keyof Price ? Price[P] : never
  } 
    : Price
  : Price



  export interface PriceDelegate<GlobalRejectSettings> {





  }

  /**
   * The delegate class that acts as a "Promise-like" for Price.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__PriceClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';


    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * Price without action
   */
  export type PriceArgs = {
    /**
     * Select specific fields to fetch from the Price
     * 
    **/
    select?: PriceSelect | null
  }



  /**
   * Model Paramater
   */





  export type ParamaterSelect = {
    label?: boolean
    value?: boolean
  }

  export type ParamaterGetPayload<
    S extends boolean | null | undefined | ParamaterArgs,
    U = keyof S
      > = S extends true
        ? Paramater
    : S extends undefined
    ? never
    : S extends ParamaterArgs
    ?'include' extends U
    ? Paramater 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
    P extends keyof Paramater ? Paramater[P] : never
  } 
    : Paramater
  : Paramater



  export interface ParamaterDelegate<GlobalRejectSettings> {





  }

  /**
   * The delegate class that acts as a "Promise-like" for Paramater.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__ParamaterClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';


    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * Paramater without action
   */
  export type ParamaterArgs = {
    /**
     * Select specific fields to fetch from the Paramater
     * 
    **/
    select?: ParamaterSelect | null
  }



  /**
   * Model Watcher
   */


  export type AggregateWatcher = {
    _count: WatcherCountAggregateOutputType | null
    _min: WatcherMinAggregateOutputType | null
    _max: WatcherMaxAggregateOutputType | null
  }

  export type WatcherMinAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WatcherMaxAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WatcherCountAggregateOutputType = {
    id: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type WatcherMinAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WatcherMaxAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WatcherCountAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type WatcherAggregateArgs = {
    /**
     * Filter which Watcher to aggregate.
     * 
    **/
    where?: WatcherWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Watchers to fetch.
     * 
    **/
    orderBy?: Enumerable<WatcherOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: WatcherWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Watchers from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Watchers.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Watchers
    **/
    _count?: true | WatcherCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WatcherMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WatcherMaxAggregateInputType
  }

  export type GetWatcherAggregateType<T extends WatcherAggregateArgs> = {
        [P in keyof T & keyof AggregateWatcher]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWatcher[P]>
      : GetScalarType<T[P], AggregateWatcher[P]>
  }




  export type WatcherGroupByArgs = {
    where?: WatcherWhereInput
    orderBy?: Enumerable<WatcherOrderByWithAggregationInput>
    by: Array<WatcherScalarFieldEnum>
    having?: WatcherScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WatcherCountAggregateInputType | true
    _min?: WatcherMinAggregateInputType
    _max?: WatcherMaxAggregateInputType
  }


  export type WatcherGroupByOutputType = {
    id: string
    createdAt: Date
    updatedAt: Date
    _count: WatcherCountAggregateOutputType | null
    _min: WatcherMinAggregateOutputType | null
    _max: WatcherMaxAggregateOutputType | null
  }

  type GetWatcherGroupByPayload<T extends WatcherGroupByArgs> = PrismaPromise<
    Array<
      PickArray<WatcherGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WatcherGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WatcherGroupByOutputType[P]>
            : GetScalarType<T[P], WatcherGroupByOutputType[P]>
        }
      >
    >


  export type WatcherSelect = {
    metadata?: boolean | MetadataArgs
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    UserWatcher?: boolean | UserWatcherFindManyArgs
    _count?: boolean | WatcherCountOutputTypeArgs
  }

  export type WatcherInclude = {
    UserWatcher?: boolean | UserWatcherFindManyArgs
    _count?: boolean | WatcherCountOutputTypeArgs
  }

  export type WatcherGetPayload<
    S extends boolean | null | undefined | WatcherArgs,
    U = keyof S
      > = S extends true
        ? Watcher
    : S extends undefined
    ? never
    : S extends WatcherArgs | WatcherFindManyArgs
    ?'include' extends U
    ? Watcher  & {
    [P in TrueKeys<S['include']>]:
        P extends 'metadata' ? MetadataGetPayload<S['include'][P]> :
        P extends 'UserWatcher' ? Array < UserWatcherGetPayload<S['include'][P]>>  :
        P extends '_count' ? WatcherCountOutputTypeGetPayload<S['include'][P]> :  never
  } 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
        P extends 'metadata' ? MetadataGetPayload<S['select'][P]> :
        P extends 'UserWatcher' ? Array < UserWatcherGetPayload<S['select'][P]>>  :
        P extends '_count' ? WatcherCountOutputTypeGetPayload<S['select'][P]> :  P extends keyof Watcher ? Watcher[P] : never
  } 
    : Watcher
  : Watcher


  type WatcherCountArgs = Merge<
    Omit<WatcherFindManyArgs, 'select' | 'include'> & {
      select?: WatcherCountAggregateInputType | true
    }
  >

  export interface WatcherDelegate<GlobalRejectSettings> {
    /**
     * Find zero or one Watcher that matches the filter.
     * @param {WatcherFindUniqueArgs} args - Arguments to find a Watcher
     * @example
     * // Get one Watcher
     * const watcher = await prisma.watcher.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends WatcherFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, WatcherFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'Watcher'> extends True ? CheckSelect<T, Prisma__WatcherClient<Watcher>, Prisma__WatcherClient<WatcherGetPayload<T>>> : CheckSelect<T, Prisma__WatcherClient<Watcher | null >, Prisma__WatcherClient<WatcherGetPayload<T> | null >>

    /**
     * Find the first Watcher that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WatcherFindFirstArgs} args - Arguments to find a Watcher
     * @example
     * // Get one Watcher
     * const watcher = await prisma.watcher.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends WatcherFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, WatcherFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'Watcher'> extends True ? CheckSelect<T, Prisma__WatcherClient<Watcher>, Prisma__WatcherClient<WatcherGetPayload<T>>> : CheckSelect<T, Prisma__WatcherClient<Watcher | null >, Prisma__WatcherClient<WatcherGetPayload<T> | null >>

    /**
     * Find zero or more Watchers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WatcherFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Watchers
     * const watchers = await prisma.watcher.findMany()
     * 
     * // Get first 10 Watchers
     * const watchers = await prisma.watcher.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const watcherWithIdOnly = await prisma.watcher.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends WatcherFindManyArgs>(
      args?: SelectSubset<T, WatcherFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<Watcher>>, PrismaPromise<Array<WatcherGetPayload<T>>>>

    /**
     * Create a Watcher.
     * @param {WatcherCreateArgs} args - Arguments to create a Watcher.
     * @example
     * // Create one Watcher
     * const Watcher = await prisma.watcher.create({
     *   data: {
     *     // ... data to create a Watcher
     *   }
     * })
     * 
    **/
    create<T extends WatcherCreateArgs>(
      args: SelectSubset<T, WatcherCreateArgs>
    ): CheckSelect<T, Prisma__WatcherClient<Watcher>, Prisma__WatcherClient<WatcherGetPayload<T>>>

    /**
     * Create many Watchers.
     *     @param {WatcherCreateManyArgs} args - Arguments to create many Watchers.
     *     @example
     *     // Create many Watchers
     *     const watcher = await prisma.watcher.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends WatcherCreateManyArgs>(
      args?: SelectSubset<T, WatcherCreateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Delete a Watcher.
     * @param {WatcherDeleteArgs} args - Arguments to delete one Watcher.
     * @example
     * // Delete one Watcher
     * const Watcher = await prisma.watcher.delete({
     *   where: {
     *     // ... filter to delete one Watcher
     *   }
     * })
     * 
    **/
    delete<T extends WatcherDeleteArgs>(
      args: SelectSubset<T, WatcherDeleteArgs>
    ): CheckSelect<T, Prisma__WatcherClient<Watcher>, Prisma__WatcherClient<WatcherGetPayload<T>>>

    /**
     * Update one Watcher.
     * @param {WatcherUpdateArgs} args - Arguments to update one Watcher.
     * @example
     * // Update one Watcher
     * const watcher = await prisma.watcher.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends WatcherUpdateArgs>(
      args: SelectSubset<T, WatcherUpdateArgs>
    ): CheckSelect<T, Prisma__WatcherClient<Watcher>, Prisma__WatcherClient<WatcherGetPayload<T>>>

    /**
     * Delete zero or more Watchers.
     * @param {WatcherDeleteManyArgs} args - Arguments to filter Watchers to delete.
     * @example
     * // Delete a few Watchers
     * const { count } = await prisma.watcher.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends WatcherDeleteManyArgs>(
      args?: SelectSubset<T, WatcherDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more Watchers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WatcherUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Watchers
     * const watcher = await prisma.watcher.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends WatcherUpdateManyArgs>(
      args: SelectSubset<T, WatcherUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one Watcher.
     * @param {WatcherUpsertArgs} args - Arguments to update or create a Watcher.
     * @example
     * // Update or create a Watcher
     * const watcher = await prisma.watcher.upsert({
     *   create: {
     *     // ... data to create a Watcher
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Watcher we want to update
     *   }
     * })
    **/
    upsert<T extends WatcherUpsertArgs>(
      args: SelectSubset<T, WatcherUpsertArgs>
    ): CheckSelect<T, Prisma__WatcherClient<Watcher>, Prisma__WatcherClient<WatcherGetPayload<T>>>

    /**
     * Find zero or more Watchers that matches the filter.
     * @param {WatcherFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const watcher = await prisma.watcher.findRaw({
     *   filter: { age: { $gt: 25 } } 
     * })
    **/
    findRaw(
      args?: WatcherFindRawArgs
    ): PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a Watcher.
     * @param {WatcherAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const watcher = await prisma.watcher.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
    **/
    aggregateRaw(
      args?: WatcherAggregateRawArgs
    ): PrismaPromise<JsonObject>

    /**
     * Count the number of Watchers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WatcherCountArgs} args - Arguments to filter Watchers to count.
     * @example
     * // Count the number of Watchers
     * const count = await prisma.watcher.count({
     *   where: {
     *     // ... the filter for the Watchers we want to count
     *   }
     * })
    **/
    count<T extends WatcherCountArgs>(
      args?: Subset<T, WatcherCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WatcherCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Watcher.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WatcherAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WatcherAggregateArgs>(args: Subset<T, WatcherAggregateArgs>): PrismaPromise<GetWatcherAggregateType<T>>

    /**
     * Group by Watcher.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WatcherGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WatcherGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WatcherGroupByArgs['orderBy'] }
        : { orderBy?: WatcherGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WatcherGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWatcherGroupByPayload<T> : PrismaPromise<InputErrors>
  }

  /**
   * The delegate class that acts as a "Promise-like" for Watcher.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__WatcherClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    metadata<T extends MetadataArgs = {}>(args?: Subset<T, MetadataArgs>): CheckSelect<T, Prisma__MetadataClient<Metadata | null >, Prisma__MetadataClient<MetadataGetPayload<T> | null >>;

    UserWatcher<T extends UserWatcherFindManyArgs = {}>(args?: Subset<T, UserWatcherFindManyArgs>): CheckSelect<T, PrismaPromise<Array<UserWatcher>>, PrismaPromise<Array<UserWatcherGetPayload<T>>>>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * Watcher findUnique
   */
  export type WatcherFindUniqueArgs = {
    /**
     * Select specific fields to fetch from the Watcher
     * 
    **/
    select?: WatcherSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: WatcherInclude | null
    /**
     * Throw an Error if a Watcher can't be found
     * 
    **/
    rejectOnNotFound?: RejectOnNotFound
    /**
     * Filter, which Watcher to fetch.
     * 
    **/
    where: WatcherWhereUniqueInput
  }


  /**
   * Watcher findFirst
   */
  export type WatcherFindFirstArgs = {
    /**
     * Select specific fields to fetch from the Watcher
     * 
    **/
    select?: WatcherSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: WatcherInclude | null
    /**
     * Throw an Error if a Watcher can't be found
     * 
    **/
    rejectOnNotFound?: RejectOnNotFound
    /**
     * Filter, which Watcher to fetch.
     * 
    **/
    where?: WatcherWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Watchers to fetch.
     * 
    **/
    orderBy?: Enumerable<WatcherOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Watchers.
     * 
    **/
    cursor?: WatcherWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Watchers from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Watchers.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Watchers.
     * 
    **/
    distinct?: Enumerable<WatcherScalarFieldEnum>
  }


  /**
   * Watcher findMany
   */
  export type WatcherFindManyArgs = {
    /**
     * Select specific fields to fetch from the Watcher
     * 
    **/
    select?: WatcherSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: WatcherInclude | null
    /**
     * Filter, which Watchers to fetch.
     * 
    **/
    where?: WatcherWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Watchers to fetch.
     * 
    **/
    orderBy?: Enumerable<WatcherOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Watchers.
     * 
    **/
    cursor?: WatcherWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Watchers from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Watchers.
     * 
    **/
    skip?: number
    distinct?: Enumerable<WatcherScalarFieldEnum>
  }


  /**
   * Watcher create
   */
  export type WatcherCreateArgs = {
    /**
     * Select specific fields to fetch from the Watcher
     * 
    **/
    select?: WatcherSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: WatcherInclude | null
    /**
     * The data needed to create a Watcher.
     * 
    **/
    data: XOR<WatcherCreateInput, WatcherUncheckedCreateInput>
  }


  /**
   * Watcher createMany
   */
  export type WatcherCreateManyArgs = {
    /**
     * The data used to create many Watchers.
     * 
    **/
    data: Enumerable<WatcherCreateManyInput>
  }


  /**
   * Watcher update
   */
  export type WatcherUpdateArgs = {
    /**
     * Select specific fields to fetch from the Watcher
     * 
    **/
    select?: WatcherSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: WatcherInclude | null
    /**
     * The data needed to update a Watcher.
     * 
    **/
    data: XOR<WatcherUpdateInput, WatcherUncheckedUpdateInput>
    /**
     * Choose, which Watcher to update.
     * 
    **/
    where: WatcherWhereUniqueInput
  }


  /**
   * Watcher updateMany
   */
  export type WatcherUpdateManyArgs = {
    /**
     * The data used to update Watchers.
     * 
    **/
    data: XOR<WatcherUpdateManyMutationInput, WatcherUncheckedUpdateManyInput>
    /**
     * Filter which Watchers to update
     * 
    **/
    where?: WatcherWhereInput
  }


  /**
   * Watcher upsert
   */
  export type WatcherUpsertArgs = {
    /**
     * Select specific fields to fetch from the Watcher
     * 
    **/
    select?: WatcherSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: WatcherInclude | null
    /**
     * The filter to search for the Watcher to update in case it exists.
     * 
    **/
    where: WatcherWhereUniqueInput
    /**
     * In case the Watcher found by the `where` argument doesn't exist, create a new Watcher with this data.
     * 
    **/
    create: XOR<WatcherCreateInput, WatcherUncheckedCreateInput>
    /**
     * In case the Watcher was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<WatcherUpdateInput, WatcherUncheckedUpdateInput>
  }


  /**
   * Watcher delete
   */
  export type WatcherDeleteArgs = {
    /**
     * Select specific fields to fetch from the Watcher
     * 
    **/
    select?: WatcherSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: WatcherInclude | null
    /**
     * Filter which Watcher to delete.
     * 
    **/
    where: WatcherWhereUniqueInput
  }


  /**
   * Watcher deleteMany
   */
  export type WatcherDeleteManyArgs = {
    /**
     * Filter which Watchers to delete
     * 
    **/
    where?: WatcherWhereInput
  }


  /**
   * Watcher findRaw
   */
  export type WatcherFindRawArgs = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     * 
    **/
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     * 
    **/
    options?: InputJsonValue
  }


  /**
   * Watcher aggregateRaw
   */
  export type WatcherAggregateRawArgs = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     * 
    **/
    pipeline?: Array<InputJsonValue>
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     * 
    **/
    options?: InputJsonValue
  }


  /**
   * Watcher without action
   */
  export type WatcherArgs = {
    /**
     * Select specific fields to fetch from the Watcher
     * 
    **/
    select?: WatcherSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: WatcherInclude | null
  }



  /**
   * Model UserWatcher
   */


  export type AggregateUserWatcher = {
    _count: UserWatcherCountAggregateOutputType | null
    _min: UserWatcherMinAggregateOutputType | null
    _max: UserWatcherMaxAggregateOutputType | null
  }

  export type UserWatcherMinAggregateOutputType = {
    id: string | null
    watcherId: string | null
    notifiedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
    userId: string | null
  }

  export type UserWatcherMaxAggregateOutputType = {
    id: string | null
    watcherId: string | null
    notifiedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
    userId: string | null
  }

  export type UserWatcherCountAggregateOutputType = {
    id: number
    watcherId: number
    notifiedAt: number
    createdAt: number
    updatedAt: number
    userId: number
    _all: number
  }


  export type UserWatcherMinAggregateInputType = {
    id?: true
    watcherId?: true
    notifiedAt?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
  }

  export type UserWatcherMaxAggregateInputType = {
    id?: true
    watcherId?: true
    notifiedAt?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
  }

  export type UserWatcherCountAggregateInputType = {
    id?: true
    watcherId?: true
    notifiedAt?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
    _all?: true
  }

  export type UserWatcherAggregateArgs = {
    /**
     * Filter which UserWatcher to aggregate.
     * 
    **/
    where?: UserWatcherWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserWatchers to fetch.
     * 
    **/
    orderBy?: Enumerable<UserWatcherOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: UserWatcherWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserWatchers from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserWatchers.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserWatchers
    **/
    _count?: true | UserWatcherCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserWatcherMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserWatcherMaxAggregateInputType
  }

  export type GetUserWatcherAggregateType<T extends UserWatcherAggregateArgs> = {
        [P in keyof T & keyof AggregateUserWatcher]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserWatcher[P]>
      : GetScalarType<T[P], AggregateUserWatcher[P]>
  }




  export type UserWatcherGroupByArgs = {
    where?: UserWatcherWhereInput
    orderBy?: Enumerable<UserWatcherOrderByWithAggregationInput>
    by: Array<UserWatcherScalarFieldEnum>
    having?: UserWatcherScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserWatcherCountAggregateInputType | true
    _min?: UserWatcherMinAggregateInputType
    _max?: UserWatcherMaxAggregateInputType
  }


  export type UserWatcherGroupByOutputType = {
    id: string
    watcherId: string
    notifiedAt: Date | null
    createdAt: Date
    updatedAt: Date
    userId: string
    _count: UserWatcherCountAggregateOutputType | null
    _min: UserWatcherMinAggregateOutputType | null
    _max: UserWatcherMaxAggregateOutputType | null
  }

  type GetUserWatcherGroupByPayload<T extends UserWatcherGroupByArgs> = PrismaPromise<
    Array<
      PickArray<UserWatcherGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserWatcherGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserWatcherGroupByOutputType[P]>
            : GetScalarType<T[P], UserWatcherGroupByOutputType[P]>
        }
      >
    >


  export type UserWatcherSelect = {
    id?: boolean
    watcherId?: boolean
    watcher?: boolean | WatcherArgs
    notifiedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    user?: boolean | UserArgs
  }

  export type UserWatcherInclude = {
    watcher?: boolean | WatcherArgs
    user?: boolean | UserArgs
  }

  export type UserWatcherGetPayload<
    S extends boolean | null | undefined | UserWatcherArgs,
    U = keyof S
      > = S extends true
        ? UserWatcher
    : S extends undefined
    ? never
    : S extends UserWatcherArgs | UserWatcherFindManyArgs
    ?'include' extends U
    ? UserWatcher  & {
    [P in TrueKeys<S['include']>]:
        P extends 'watcher' ? WatcherGetPayload<S['include'][P]> :
        P extends 'user' ? UserGetPayload<S['include'][P]> :  never
  } 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
        P extends 'watcher' ? WatcherGetPayload<S['select'][P]> :
        P extends 'user' ? UserGetPayload<S['select'][P]> :  P extends keyof UserWatcher ? UserWatcher[P] : never
  } 
    : UserWatcher
  : UserWatcher


  type UserWatcherCountArgs = Merge<
    Omit<UserWatcherFindManyArgs, 'select' | 'include'> & {
      select?: UserWatcherCountAggregateInputType | true
    }
  >

  export interface UserWatcherDelegate<GlobalRejectSettings> {
    /**
     * Find zero or one UserWatcher that matches the filter.
     * @param {UserWatcherFindUniqueArgs} args - Arguments to find a UserWatcher
     * @example
     * // Get one UserWatcher
     * const userWatcher = await prisma.userWatcher.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends UserWatcherFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, UserWatcherFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'UserWatcher'> extends True ? CheckSelect<T, Prisma__UserWatcherClient<UserWatcher>, Prisma__UserWatcherClient<UserWatcherGetPayload<T>>> : CheckSelect<T, Prisma__UserWatcherClient<UserWatcher | null >, Prisma__UserWatcherClient<UserWatcherGetPayload<T> | null >>

    /**
     * Find the first UserWatcher that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserWatcherFindFirstArgs} args - Arguments to find a UserWatcher
     * @example
     * // Get one UserWatcher
     * const userWatcher = await prisma.userWatcher.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends UserWatcherFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, UserWatcherFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'UserWatcher'> extends True ? CheckSelect<T, Prisma__UserWatcherClient<UserWatcher>, Prisma__UserWatcherClient<UserWatcherGetPayload<T>>> : CheckSelect<T, Prisma__UserWatcherClient<UserWatcher | null >, Prisma__UserWatcherClient<UserWatcherGetPayload<T> | null >>

    /**
     * Find zero or more UserWatchers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserWatcherFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserWatchers
     * const userWatchers = await prisma.userWatcher.findMany()
     * 
     * // Get first 10 UserWatchers
     * const userWatchers = await prisma.userWatcher.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWatcherWithIdOnly = await prisma.userWatcher.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends UserWatcherFindManyArgs>(
      args?: SelectSubset<T, UserWatcherFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<UserWatcher>>, PrismaPromise<Array<UserWatcherGetPayload<T>>>>

    /**
     * Create a UserWatcher.
     * @param {UserWatcherCreateArgs} args - Arguments to create a UserWatcher.
     * @example
     * // Create one UserWatcher
     * const UserWatcher = await prisma.userWatcher.create({
     *   data: {
     *     // ... data to create a UserWatcher
     *   }
     * })
     * 
    **/
    create<T extends UserWatcherCreateArgs>(
      args: SelectSubset<T, UserWatcherCreateArgs>
    ): CheckSelect<T, Prisma__UserWatcherClient<UserWatcher>, Prisma__UserWatcherClient<UserWatcherGetPayload<T>>>

    /**
     * Create many UserWatchers.
     *     @param {UserWatcherCreateManyArgs} args - Arguments to create many UserWatchers.
     *     @example
     *     // Create many UserWatchers
     *     const userWatcher = await prisma.userWatcher.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends UserWatcherCreateManyArgs>(
      args?: SelectSubset<T, UserWatcherCreateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Delete a UserWatcher.
     * @param {UserWatcherDeleteArgs} args - Arguments to delete one UserWatcher.
     * @example
     * // Delete one UserWatcher
     * const UserWatcher = await prisma.userWatcher.delete({
     *   where: {
     *     // ... filter to delete one UserWatcher
     *   }
     * })
     * 
    **/
    delete<T extends UserWatcherDeleteArgs>(
      args: SelectSubset<T, UserWatcherDeleteArgs>
    ): CheckSelect<T, Prisma__UserWatcherClient<UserWatcher>, Prisma__UserWatcherClient<UserWatcherGetPayload<T>>>

    /**
     * Update one UserWatcher.
     * @param {UserWatcherUpdateArgs} args - Arguments to update one UserWatcher.
     * @example
     * // Update one UserWatcher
     * const userWatcher = await prisma.userWatcher.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends UserWatcherUpdateArgs>(
      args: SelectSubset<T, UserWatcherUpdateArgs>
    ): CheckSelect<T, Prisma__UserWatcherClient<UserWatcher>, Prisma__UserWatcherClient<UserWatcherGetPayload<T>>>

    /**
     * Delete zero or more UserWatchers.
     * @param {UserWatcherDeleteManyArgs} args - Arguments to filter UserWatchers to delete.
     * @example
     * // Delete a few UserWatchers
     * const { count } = await prisma.userWatcher.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends UserWatcherDeleteManyArgs>(
      args?: SelectSubset<T, UserWatcherDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserWatchers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserWatcherUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserWatchers
     * const userWatcher = await prisma.userWatcher.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends UserWatcherUpdateManyArgs>(
      args: SelectSubset<T, UserWatcherUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one UserWatcher.
     * @param {UserWatcherUpsertArgs} args - Arguments to update or create a UserWatcher.
     * @example
     * // Update or create a UserWatcher
     * const userWatcher = await prisma.userWatcher.upsert({
     *   create: {
     *     // ... data to create a UserWatcher
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserWatcher we want to update
     *   }
     * })
    **/
    upsert<T extends UserWatcherUpsertArgs>(
      args: SelectSubset<T, UserWatcherUpsertArgs>
    ): CheckSelect<T, Prisma__UserWatcherClient<UserWatcher>, Prisma__UserWatcherClient<UserWatcherGetPayload<T>>>

    /**
     * Find zero or more UserWatchers that matches the filter.
     * @param {UserWatcherFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const userWatcher = await prisma.userWatcher.findRaw({
     *   filter: { age: { $gt: 25 } } 
     * })
    **/
    findRaw(
      args?: UserWatcherFindRawArgs
    ): PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a UserWatcher.
     * @param {UserWatcherAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const userWatcher = await prisma.userWatcher.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
    **/
    aggregateRaw(
      args?: UserWatcherAggregateRawArgs
    ): PrismaPromise<JsonObject>

    /**
     * Count the number of UserWatchers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserWatcherCountArgs} args - Arguments to filter UserWatchers to count.
     * @example
     * // Count the number of UserWatchers
     * const count = await prisma.userWatcher.count({
     *   where: {
     *     // ... the filter for the UserWatchers we want to count
     *   }
     * })
    **/
    count<T extends UserWatcherCountArgs>(
      args?: Subset<T, UserWatcherCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserWatcherCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserWatcher.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserWatcherAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserWatcherAggregateArgs>(args: Subset<T, UserWatcherAggregateArgs>): PrismaPromise<GetUserWatcherAggregateType<T>>

    /**
     * Group by UserWatcher.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserWatcherGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserWatcherGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserWatcherGroupByArgs['orderBy'] }
        : { orderBy?: UserWatcherGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserWatcherGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserWatcherGroupByPayload<T> : PrismaPromise<InputErrors>
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserWatcher.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__UserWatcherClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    watcher<T extends WatcherArgs = {}>(args?: Subset<T, WatcherArgs>): CheckSelect<T, Prisma__WatcherClient<Watcher | null >, Prisma__WatcherClient<WatcherGetPayload<T> | null >>;

    user<T extends UserArgs = {}>(args?: Subset<T, UserArgs>): CheckSelect<T, Prisma__UserClient<User | null >, Prisma__UserClient<UserGetPayload<T> | null >>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * UserWatcher findUnique
   */
  export type UserWatcherFindUniqueArgs = {
    /**
     * Select specific fields to fetch from the UserWatcher
     * 
    **/
    select?: UserWatcherSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UserWatcherInclude | null
    /**
     * Throw an Error if a UserWatcher can't be found
     * 
    **/
    rejectOnNotFound?: RejectOnNotFound
    /**
     * Filter, which UserWatcher to fetch.
     * 
    **/
    where: UserWatcherWhereUniqueInput
  }


  /**
   * UserWatcher findFirst
   */
  export type UserWatcherFindFirstArgs = {
    /**
     * Select specific fields to fetch from the UserWatcher
     * 
    **/
    select?: UserWatcherSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UserWatcherInclude | null
    /**
     * Throw an Error if a UserWatcher can't be found
     * 
    **/
    rejectOnNotFound?: RejectOnNotFound
    /**
     * Filter, which UserWatcher to fetch.
     * 
    **/
    where?: UserWatcherWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserWatchers to fetch.
     * 
    **/
    orderBy?: Enumerable<UserWatcherOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserWatchers.
     * 
    **/
    cursor?: UserWatcherWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserWatchers from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserWatchers.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserWatchers.
     * 
    **/
    distinct?: Enumerable<UserWatcherScalarFieldEnum>
  }


  /**
   * UserWatcher findMany
   */
  export type UserWatcherFindManyArgs = {
    /**
     * Select specific fields to fetch from the UserWatcher
     * 
    **/
    select?: UserWatcherSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UserWatcherInclude | null
    /**
     * Filter, which UserWatchers to fetch.
     * 
    **/
    where?: UserWatcherWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserWatchers to fetch.
     * 
    **/
    orderBy?: Enumerable<UserWatcherOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserWatchers.
     * 
    **/
    cursor?: UserWatcherWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserWatchers from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserWatchers.
     * 
    **/
    skip?: number
    distinct?: Enumerable<UserWatcherScalarFieldEnum>
  }


  /**
   * UserWatcher create
   */
  export type UserWatcherCreateArgs = {
    /**
     * Select specific fields to fetch from the UserWatcher
     * 
    **/
    select?: UserWatcherSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UserWatcherInclude | null
    /**
     * The data needed to create a UserWatcher.
     * 
    **/
    data: XOR<UserWatcherCreateInput, UserWatcherUncheckedCreateInput>
  }


  /**
   * UserWatcher createMany
   */
  export type UserWatcherCreateManyArgs = {
    /**
     * The data used to create many UserWatchers.
     * 
    **/
    data: Enumerable<UserWatcherCreateManyInput>
  }


  /**
   * UserWatcher update
   */
  export type UserWatcherUpdateArgs = {
    /**
     * Select specific fields to fetch from the UserWatcher
     * 
    **/
    select?: UserWatcherSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UserWatcherInclude | null
    /**
     * The data needed to update a UserWatcher.
     * 
    **/
    data: XOR<UserWatcherUpdateInput, UserWatcherUncheckedUpdateInput>
    /**
     * Choose, which UserWatcher to update.
     * 
    **/
    where: UserWatcherWhereUniqueInput
  }


  /**
   * UserWatcher updateMany
   */
  export type UserWatcherUpdateManyArgs = {
    /**
     * The data used to update UserWatchers.
     * 
    **/
    data: XOR<UserWatcherUpdateManyMutationInput, UserWatcherUncheckedUpdateManyInput>
    /**
     * Filter which UserWatchers to update
     * 
    **/
    where?: UserWatcherWhereInput
  }


  /**
   * UserWatcher upsert
   */
  export type UserWatcherUpsertArgs = {
    /**
     * Select specific fields to fetch from the UserWatcher
     * 
    **/
    select?: UserWatcherSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UserWatcherInclude | null
    /**
     * The filter to search for the UserWatcher to update in case it exists.
     * 
    **/
    where: UserWatcherWhereUniqueInput
    /**
     * In case the UserWatcher found by the `where` argument doesn't exist, create a new UserWatcher with this data.
     * 
    **/
    create: XOR<UserWatcherCreateInput, UserWatcherUncheckedCreateInput>
    /**
     * In case the UserWatcher was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<UserWatcherUpdateInput, UserWatcherUncheckedUpdateInput>
  }


  /**
   * UserWatcher delete
   */
  export type UserWatcherDeleteArgs = {
    /**
     * Select specific fields to fetch from the UserWatcher
     * 
    **/
    select?: UserWatcherSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UserWatcherInclude | null
    /**
     * Filter which UserWatcher to delete.
     * 
    **/
    where: UserWatcherWhereUniqueInput
  }


  /**
   * UserWatcher deleteMany
   */
  export type UserWatcherDeleteManyArgs = {
    /**
     * Filter which UserWatchers to delete
     * 
    **/
    where?: UserWatcherWhereInput
  }


  /**
   * UserWatcher findRaw
   */
  export type UserWatcherFindRawArgs = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     * 
    **/
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     * 
    **/
    options?: InputJsonValue
  }


  /**
   * UserWatcher aggregateRaw
   */
  export type UserWatcherAggregateRawArgs = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     * 
    **/
    pipeline?: Array<InputJsonValue>
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     * 
    **/
    options?: InputJsonValue
  }


  /**
   * UserWatcher without action
   */
  export type UserWatcherArgs = {
    /**
     * Select specific fields to fetch from the UserWatcher
     * 
    **/
    select?: UserWatcherSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UserWatcherInclude | null
  }



  /**
   * Model User
   */


  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    password: string | null
    premium: boolean | null
    loginStrategy: LoginStrategy | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    password: string | null
    premium: boolean | null
    loginStrategy: LoginStrategy | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    password: number
    premium: number
    roles: number
    loginStrategy: number
    likedListingIDs: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    password?: true
    premium?: true
    loginStrategy?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    password?: true
    premium?: true
    loginStrategy?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    password?: true
    premium?: true
    roles?: true
    loginStrategy?: true
    likedListingIDs?: true
    _all?: true
  }

  export type UserAggregateArgs = {
    /**
     * Filter which User to aggregate.
     * 
    **/
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     * 
    **/
    orderBy?: Enumerable<UserOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs = {
    where?: UserWhereInput
    orderBy?: Enumerable<UserOrderByWithAggregationInput>
    by: Array<UserScalarFieldEnum>
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }


  export type UserGroupByOutputType = {
    id: string
    email: string
    password: string | null
    premium: boolean
    roles: Role[]
    loginStrategy: LoginStrategy
    likedListingIDs: string[]
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = PrismaPromise<
    Array<
      PickArray<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect = {
    passwordReset?: boolean | PasswordResetArgs
    emailUpdate?: boolean | EmailUpdateArgs
    id?: boolean
    email?: boolean
    password?: boolean
    premium?: boolean
    watchers?: boolean | UserWatcherFindManyArgs
    roles?: boolean
    loginStrategy?: boolean
    likedListingIDs?: boolean
    likedListings?: boolean | ListingFindManyArgs
    EmailRecord?: boolean | EmailRecordFindManyArgs
    _count?: boolean | UserCountOutputTypeArgs
  }

  export type UserInclude = {
    watchers?: boolean | UserWatcherFindManyArgs
    likedListings?: boolean | ListingFindManyArgs
    EmailRecord?: boolean | EmailRecordFindManyArgs
    _count?: boolean | UserCountOutputTypeArgs
  }

  export type UserGetPayload<
    S extends boolean | null | undefined | UserArgs,
    U = keyof S
      > = S extends true
        ? User
    : S extends undefined
    ? never
    : S extends UserArgs | UserFindManyArgs
    ?'include' extends U
    ? User  & {
    [P in TrueKeys<S['include']>]:
        P extends 'passwordReset' ? PasswordResetGetPayload<S['include'][P]> | null :
        P extends 'emailUpdate' ? EmailUpdateGetPayload<S['include'][P]> | null :
        P extends 'watchers' ? Array < UserWatcherGetPayload<S['include'][P]>>  :
        P extends 'likedListings' ? Array < ListingGetPayload<S['include'][P]>>  :
        P extends 'EmailRecord' ? Array < EmailRecordGetPayload<S['include'][P]>>  :
        P extends '_count' ? UserCountOutputTypeGetPayload<S['include'][P]> :  never
  } 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
        P extends 'passwordReset' ? PasswordResetGetPayload<S['select'][P]> | null :
        P extends 'emailUpdate' ? EmailUpdateGetPayload<S['select'][P]> | null :
        P extends 'watchers' ? Array < UserWatcherGetPayload<S['select'][P]>>  :
        P extends 'likedListings' ? Array < ListingGetPayload<S['select'][P]>>  :
        P extends 'EmailRecord' ? Array < EmailRecordGetPayload<S['select'][P]>>  :
        P extends '_count' ? UserCountOutputTypeGetPayload<S['select'][P]> :  P extends keyof User ? User[P] : never
  } 
    : User
  : User


  type UserCountArgs = Merge<
    Omit<UserFindManyArgs, 'select' | 'include'> & {
      select?: UserCountAggregateInputType | true
    }
  >

  export interface UserDelegate<GlobalRejectSettings> {
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends UserFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, UserFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'User'> extends True ? CheckSelect<T, Prisma__UserClient<User>, Prisma__UserClient<UserGetPayload<T>>> : CheckSelect<T, Prisma__UserClient<User | null >, Prisma__UserClient<UserGetPayload<T> | null >>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends UserFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, UserFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'User'> extends True ? CheckSelect<T, Prisma__UserClient<User>, Prisma__UserClient<UserGetPayload<T>>> : CheckSelect<T, Prisma__UserClient<User | null >, Prisma__UserClient<UserGetPayload<T> | null >>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends UserFindManyArgs>(
      args?: SelectSubset<T, UserFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<User>>, PrismaPromise<Array<UserGetPayload<T>>>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
    **/
    create<T extends UserCreateArgs>(
      args: SelectSubset<T, UserCreateArgs>
    ): CheckSelect<T, Prisma__UserClient<User>, Prisma__UserClient<UserGetPayload<T>>>

    /**
     * Create many Users.
     *     @param {UserCreateManyArgs} args - Arguments to create many Users.
     *     @example
     *     // Create many Users
     *     const user = await prisma.user.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends UserCreateManyArgs>(
      args?: SelectSubset<T, UserCreateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
    **/
    delete<T extends UserDeleteArgs>(
      args: SelectSubset<T, UserDeleteArgs>
    ): CheckSelect<T, Prisma__UserClient<User>, Prisma__UserClient<UserGetPayload<T>>>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends UserUpdateArgs>(
      args: SelectSubset<T, UserUpdateArgs>
    ): CheckSelect<T, Prisma__UserClient<User>, Prisma__UserClient<UserGetPayload<T>>>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends UserDeleteManyArgs>(
      args?: SelectSubset<T, UserDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends UserUpdateManyArgs>(
      args: SelectSubset<T, UserUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
    **/
    upsert<T extends UserUpsertArgs>(
      args: SelectSubset<T, UserUpsertArgs>
    ): CheckSelect<T, Prisma__UserClient<User>, Prisma__UserClient<UserGetPayload<T>>>

    /**
     * Find zero or more Users that matches the filter.
     * @param {UserFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const user = await prisma.user.findRaw({
     *   filter: { age: { $gt: 25 } } 
     * })
    **/
    findRaw(
      args?: UserFindRawArgs
    ): PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a User.
     * @param {UserAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const user = await prisma.user.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
    **/
    aggregateRaw(
      args?: UserAggregateRawArgs
    ): PrismaPromise<JsonObject>

    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : PrismaPromise<InputErrors>
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__UserClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    passwordReset<T extends PasswordResetArgs = {}>(args?: Subset<T, PasswordResetArgs>): CheckSelect<T, Prisma__PasswordResetClient<PasswordReset | null >, Prisma__PasswordResetClient<PasswordResetGetPayload<T> | null >>;

    emailUpdate<T extends EmailUpdateArgs = {}>(args?: Subset<T, EmailUpdateArgs>): CheckSelect<T, Prisma__EmailUpdateClient<EmailUpdate | null >, Prisma__EmailUpdateClient<EmailUpdateGetPayload<T> | null >>;

    watchers<T extends UserWatcherFindManyArgs = {}>(args?: Subset<T, UserWatcherFindManyArgs>): CheckSelect<T, PrismaPromise<Array<UserWatcher>>, PrismaPromise<Array<UserWatcherGetPayload<T>>>>;

    likedListings<T extends ListingFindManyArgs = {}>(args?: Subset<T, ListingFindManyArgs>): CheckSelect<T, PrismaPromise<Array<Listing>>, PrismaPromise<Array<ListingGetPayload<T>>>>;

    EmailRecord<T extends EmailRecordFindManyArgs = {}>(args?: Subset<T, EmailRecordFindManyArgs>): CheckSelect<T, PrismaPromise<Array<EmailRecord>>, PrismaPromise<Array<EmailRecordGetPayload<T>>>>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * User findUnique
   */
  export type UserFindUniqueArgs = {
    /**
     * Select specific fields to fetch from the User
     * 
    **/
    select?: UserSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UserInclude | null
    /**
     * Throw an Error if a User can't be found
     * 
    **/
    rejectOnNotFound?: RejectOnNotFound
    /**
     * Filter, which User to fetch.
     * 
    **/
    where: UserWhereUniqueInput
  }


  /**
   * User findFirst
   */
  export type UserFindFirstArgs = {
    /**
     * Select specific fields to fetch from the User
     * 
    **/
    select?: UserSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UserInclude | null
    /**
     * Throw an Error if a User can't be found
     * 
    **/
    rejectOnNotFound?: RejectOnNotFound
    /**
     * Filter, which User to fetch.
     * 
    **/
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     * 
    **/
    orderBy?: Enumerable<UserOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     * 
    **/
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     * 
    **/
    distinct?: Enumerable<UserScalarFieldEnum>
  }


  /**
   * User findMany
   */
  export type UserFindManyArgs = {
    /**
     * Select specific fields to fetch from the User
     * 
    **/
    select?: UserSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UserInclude | null
    /**
     * Filter, which Users to fetch.
     * 
    **/
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     * 
    **/
    orderBy?: Enumerable<UserOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     * 
    **/
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     * 
    **/
    skip?: number
    distinct?: Enumerable<UserScalarFieldEnum>
  }


  /**
   * User create
   */
  export type UserCreateArgs = {
    /**
     * Select specific fields to fetch from the User
     * 
    **/
    select?: UserSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UserInclude | null
    /**
     * The data needed to create a User.
     * 
    **/
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }


  /**
   * User createMany
   */
  export type UserCreateManyArgs = {
    /**
     * The data used to create many Users.
     * 
    **/
    data: Enumerable<UserCreateManyInput>
  }


  /**
   * User update
   */
  export type UserUpdateArgs = {
    /**
     * Select specific fields to fetch from the User
     * 
    **/
    select?: UserSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UserInclude | null
    /**
     * The data needed to update a User.
     * 
    **/
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     * 
    **/
    where: UserWhereUniqueInput
  }


  /**
   * User updateMany
   */
  export type UserUpdateManyArgs = {
    /**
     * The data used to update Users.
     * 
    **/
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     * 
    **/
    where?: UserWhereInput
  }


  /**
   * User upsert
   */
  export type UserUpsertArgs = {
    /**
     * Select specific fields to fetch from the User
     * 
    **/
    select?: UserSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UserInclude | null
    /**
     * The filter to search for the User to update in case it exists.
     * 
    **/
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     * 
    **/
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }


  /**
   * User delete
   */
  export type UserDeleteArgs = {
    /**
     * Select specific fields to fetch from the User
     * 
    **/
    select?: UserSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UserInclude | null
    /**
     * Filter which User to delete.
     * 
    **/
    where: UserWhereUniqueInput
  }


  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs = {
    /**
     * Filter which Users to delete
     * 
    **/
    where?: UserWhereInput
  }


  /**
   * User findRaw
   */
  export type UserFindRawArgs = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     * 
    **/
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     * 
    **/
    options?: InputJsonValue
  }


  /**
   * User aggregateRaw
   */
  export type UserAggregateRawArgs = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     * 
    **/
    pipeline?: Array<InputJsonValue>
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     * 
    **/
    options?: InputJsonValue
  }


  /**
   * User without action
   */
  export type UserArgs = {
    /**
     * Select specific fields to fetch from the User
     * 
    **/
    select?: UserSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UserInclude | null
  }



  /**
   * Model Listing
   */


  export type AggregateListing = {
    _count: ListingCountAggregateOutputType | null
    _min: ListingMinAggregateOutputType | null
    _max: ListingMaxAggregateOutputType | null
  }

  export type ListingMinAggregateOutputType = {
    id: string | null
    origin_id: string | null
    title: string | null
    body: string | null
    category: Category | null
    date: Date | null
    redirectUrl: string | null
    region: string | null
    origin: ListingOrigin | null
    isAuction: boolean | null
    auctionEnd: Date | null
    entryPoint: string | null
  }

  export type ListingMaxAggregateOutputType = {
    id: string | null
    origin_id: string | null
    title: string | null
    body: string | null
    category: Category | null
    date: Date | null
    redirectUrl: string | null
    region: string | null
    origin: ListingOrigin | null
    isAuction: boolean | null
    auctionEnd: Date | null
    entryPoint: string | null
  }

  export type ListingCountAggregateOutputType = {
    id: number
    origin_id: number
    title: number
    body: number
    category: number
    date: number
    redirectUrl: number
    imageUrl: number
    region: number
    origin: number
    isAuction: number
    auctionEnd: number
    likedByUserIDs: number
    entryPoint: number
    _all: number
  }


  export type ListingMinAggregateInputType = {
    id?: true
    origin_id?: true
    title?: true
    body?: true
    category?: true
    date?: true
    redirectUrl?: true
    region?: true
    origin?: true
    isAuction?: true
    auctionEnd?: true
    entryPoint?: true
  }

  export type ListingMaxAggregateInputType = {
    id?: true
    origin_id?: true
    title?: true
    body?: true
    category?: true
    date?: true
    redirectUrl?: true
    region?: true
    origin?: true
    isAuction?: true
    auctionEnd?: true
    entryPoint?: true
  }

  export type ListingCountAggregateInputType = {
    id?: true
    origin_id?: true
    title?: true
    body?: true
    category?: true
    date?: true
    redirectUrl?: true
    imageUrl?: true
    region?: true
    origin?: true
    isAuction?: true
    auctionEnd?: true
    likedByUserIDs?: true
    entryPoint?: true
    _all?: true
  }

  export type ListingAggregateArgs = {
    /**
     * Filter which Listing to aggregate.
     * 
    **/
    where?: ListingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Listings to fetch.
     * 
    **/
    orderBy?: Enumerable<ListingOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: ListingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Listings from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Listings.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Listings
    **/
    _count?: true | ListingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ListingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ListingMaxAggregateInputType
  }

  export type GetListingAggregateType<T extends ListingAggregateArgs> = {
        [P in keyof T & keyof AggregateListing]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateListing[P]>
      : GetScalarType<T[P], AggregateListing[P]>
  }




  export type ListingGroupByArgs = {
    where?: ListingWhereInput
    orderBy?: Enumerable<ListingOrderByWithAggregationInput>
    by: Array<ListingScalarFieldEnum>
    having?: ListingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ListingCountAggregateInputType | true
    _min?: ListingMinAggregateInputType
    _max?: ListingMaxAggregateInputType
  }


  export type ListingGroupByOutputType = {
    id: string
    origin_id: string
    title: string
    body: string | null
    category: Category
    date: Date
    redirectUrl: string
    imageUrl: string[]
    region: string | null
    origin: ListingOrigin
    isAuction: boolean
    auctionEnd: Date | null
    likedByUserIDs: string[]
    entryPoint: string
    _count: ListingCountAggregateOutputType | null
    _min: ListingMinAggregateOutputType | null
    _max: ListingMaxAggregateOutputType | null
  }

  type GetListingGroupByPayload<T extends ListingGroupByArgs> = PrismaPromise<
    Array<
      PickArray<ListingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ListingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ListingGroupByOutputType[P]>
            : GetScalarType<T[P], ListingGroupByOutputType[P]>
        }
      >
    >


  export type ListingSelect = {
    price?: boolean | PriceArgs
    parameters?: boolean | ParamaterArgs
    id?: boolean
    origin_id?: boolean
    title?: boolean
    body?: boolean
    category?: boolean
    date?: boolean
    redirectUrl?: boolean
    imageUrl?: boolean
    region?: boolean
    origin?: boolean
    isAuction?: boolean
    auctionEnd?: boolean
    likedByUserIDs?: boolean
    likedBy?: boolean | UserFindManyArgs
    entryPoint?: boolean
    _count?: boolean | ListingCountOutputTypeArgs
  }

  export type ListingInclude = {
    likedBy?: boolean | UserFindManyArgs
    _count?: boolean | ListingCountOutputTypeArgs
  }

  export type ListingGetPayload<
    S extends boolean | null | undefined | ListingArgs,
    U = keyof S
      > = S extends true
        ? Listing
    : S extends undefined
    ? never
    : S extends ListingArgs | ListingFindManyArgs
    ?'include' extends U
    ? Listing  & {
    [P in TrueKeys<S['include']>]:
        P extends 'price' ? PriceGetPayload<S['include'][P]> | null :
        P extends 'parameters' ? Array < ParamaterGetPayload<S['include'][P]>>  :
        P extends 'likedBy' ? Array < UserGetPayload<S['include'][P]>>  :
        P extends '_count' ? ListingCountOutputTypeGetPayload<S['include'][P]> :  never
  } 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
        P extends 'price' ? PriceGetPayload<S['select'][P]> | null :
        P extends 'parameters' ? Array < ParamaterGetPayload<S['select'][P]>>  :
        P extends 'likedBy' ? Array < UserGetPayload<S['select'][P]>>  :
        P extends '_count' ? ListingCountOutputTypeGetPayload<S['select'][P]> :  P extends keyof Listing ? Listing[P] : never
  } 
    : Listing
  : Listing


  type ListingCountArgs = Merge<
    Omit<ListingFindManyArgs, 'select' | 'include'> & {
      select?: ListingCountAggregateInputType | true
    }
  >

  export interface ListingDelegate<GlobalRejectSettings> {
    /**
     * Find zero or one Listing that matches the filter.
     * @param {ListingFindUniqueArgs} args - Arguments to find a Listing
     * @example
     * // Get one Listing
     * const listing = await prisma.listing.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends ListingFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, ListingFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'Listing'> extends True ? CheckSelect<T, Prisma__ListingClient<Listing>, Prisma__ListingClient<ListingGetPayload<T>>> : CheckSelect<T, Prisma__ListingClient<Listing | null >, Prisma__ListingClient<ListingGetPayload<T> | null >>

    /**
     * Find the first Listing that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListingFindFirstArgs} args - Arguments to find a Listing
     * @example
     * // Get one Listing
     * const listing = await prisma.listing.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends ListingFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, ListingFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'Listing'> extends True ? CheckSelect<T, Prisma__ListingClient<Listing>, Prisma__ListingClient<ListingGetPayload<T>>> : CheckSelect<T, Prisma__ListingClient<Listing | null >, Prisma__ListingClient<ListingGetPayload<T> | null >>

    /**
     * Find zero or more Listings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListingFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Listings
     * const listings = await prisma.listing.findMany()
     * 
     * // Get first 10 Listings
     * const listings = await prisma.listing.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const listingWithIdOnly = await prisma.listing.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends ListingFindManyArgs>(
      args?: SelectSubset<T, ListingFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<Listing>>, PrismaPromise<Array<ListingGetPayload<T>>>>

    /**
     * Create a Listing.
     * @param {ListingCreateArgs} args - Arguments to create a Listing.
     * @example
     * // Create one Listing
     * const Listing = await prisma.listing.create({
     *   data: {
     *     // ... data to create a Listing
     *   }
     * })
     * 
    **/
    create<T extends ListingCreateArgs>(
      args: SelectSubset<T, ListingCreateArgs>
    ): CheckSelect<T, Prisma__ListingClient<Listing>, Prisma__ListingClient<ListingGetPayload<T>>>

    /**
     * Create many Listings.
     *     @param {ListingCreateManyArgs} args - Arguments to create many Listings.
     *     @example
     *     // Create many Listings
     *     const listing = await prisma.listing.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends ListingCreateManyArgs>(
      args?: SelectSubset<T, ListingCreateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Delete a Listing.
     * @param {ListingDeleteArgs} args - Arguments to delete one Listing.
     * @example
     * // Delete one Listing
     * const Listing = await prisma.listing.delete({
     *   where: {
     *     // ... filter to delete one Listing
     *   }
     * })
     * 
    **/
    delete<T extends ListingDeleteArgs>(
      args: SelectSubset<T, ListingDeleteArgs>
    ): CheckSelect<T, Prisma__ListingClient<Listing>, Prisma__ListingClient<ListingGetPayload<T>>>

    /**
     * Update one Listing.
     * @param {ListingUpdateArgs} args - Arguments to update one Listing.
     * @example
     * // Update one Listing
     * const listing = await prisma.listing.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends ListingUpdateArgs>(
      args: SelectSubset<T, ListingUpdateArgs>
    ): CheckSelect<T, Prisma__ListingClient<Listing>, Prisma__ListingClient<ListingGetPayload<T>>>

    /**
     * Delete zero or more Listings.
     * @param {ListingDeleteManyArgs} args - Arguments to filter Listings to delete.
     * @example
     * // Delete a few Listings
     * const { count } = await prisma.listing.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends ListingDeleteManyArgs>(
      args?: SelectSubset<T, ListingDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more Listings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Listings
     * const listing = await prisma.listing.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends ListingUpdateManyArgs>(
      args: SelectSubset<T, ListingUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one Listing.
     * @param {ListingUpsertArgs} args - Arguments to update or create a Listing.
     * @example
     * // Update or create a Listing
     * const listing = await prisma.listing.upsert({
     *   create: {
     *     // ... data to create a Listing
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Listing we want to update
     *   }
     * })
    **/
    upsert<T extends ListingUpsertArgs>(
      args: SelectSubset<T, ListingUpsertArgs>
    ): CheckSelect<T, Prisma__ListingClient<Listing>, Prisma__ListingClient<ListingGetPayload<T>>>

    /**
     * Find zero or more Listings that matches the filter.
     * @param {ListingFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const listing = await prisma.listing.findRaw({
     *   filter: { age: { $gt: 25 } } 
     * })
    **/
    findRaw(
      args?: ListingFindRawArgs
    ): PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a Listing.
     * @param {ListingAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const listing = await prisma.listing.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
    **/
    aggregateRaw(
      args?: ListingAggregateRawArgs
    ): PrismaPromise<JsonObject>

    /**
     * Count the number of Listings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListingCountArgs} args - Arguments to filter Listings to count.
     * @example
     * // Count the number of Listings
     * const count = await prisma.listing.count({
     *   where: {
     *     // ... the filter for the Listings we want to count
     *   }
     * })
    **/
    count<T extends ListingCountArgs>(
      args?: Subset<T, ListingCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ListingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Listing.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ListingAggregateArgs>(args: Subset<T, ListingAggregateArgs>): PrismaPromise<GetListingAggregateType<T>>

    /**
     * Group by Listing.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ListingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ListingGroupByArgs['orderBy'] }
        : { orderBy?: ListingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ListingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetListingGroupByPayload<T> : PrismaPromise<InputErrors>
  }

  /**
   * The delegate class that acts as a "Promise-like" for Listing.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__ListingClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    price<T extends PriceArgs = {}>(args?: Subset<T, PriceArgs>): CheckSelect<T, Prisma__PriceClient<Price | null >, Prisma__PriceClient<PriceGetPayload<T> | null >>;

    parameters<T extends ParamaterArgs = {}>(args?: Subset<T, ParamaterArgs>): CheckSelect<T, PrismaPromise<Array<Paramater>>, PrismaPromise<Array<ParamaterGetPayload<T>>>>;

    likedBy<T extends UserFindManyArgs = {}>(args?: Subset<T, UserFindManyArgs>): CheckSelect<T, PrismaPromise<Array<User>>, PrismaPromise<Array<UserGetPayload<T>>>>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * Listing findUnique
   */
  export type ListingFindUniqueArgs = {
    /**
     * Select specific fields to fetch from the Listing
     * 
    **/
    select?: ListingSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ListingInclude | null
    /**
     * Throw an Error if a Listing can't be found
     * 
    **/
    rejectOnNotFound?: RejectOnNotFound
    /**
     * Filter, which Listing to fetch.
     * 
    **/
    where: ListingWhereUniqueInput
  }


  /**
   * Listing findFirst
   */
  export type ListingFindFirstArgs = {
    /**
     * Select specific fields to fetch from the Listing
     * 
    **/
    select?: ListingSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ListingInclude | null
    /**
     * Throw an Error if a Listing can't be found
     * 
    **/
    rejectOnNotFound?: RejectOnNotFound
    /**
     * Filter, which Listing to fetch.
     * 
    **/
    where?: ListingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Listings to fetch.
     * 
    **/
    orderBy?: Enumerable<ListingOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Listings.
     * 
    **/
    cursor?: ListingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Listings from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Listings.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Listings.
     * 
    **/
    distinct?: Enumerable<ListingScalarFieldEnum>
  }


  /**
   * Listing findMany
   */
  export type ListingFindManyArgs = {
    /**
     * Select specific fields to fetch from the Listing
     * 
    **/
    select?: ListingSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ListingInclude | null
    /**
     * Filter, which Listings to fetch.
     * 
    **/
    where?: ListingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Listings to fetch.
     * 
    **/
    orderBy?: Enumerable<ListingOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Listings.
     * 
    **/
    cursor?: ListingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Listings from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Listings.
     * 
    **/
    skip?: number
    distinct?: Enumerable<ListingScalarFieldEnum>
  }


  /**
   * Listing create
   */
  export type ListingCreateArgs = {
    /**
     * Select specific fields to fetch from the Listing
     * 
    **/
    select?: ListingSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ListingInclude | null
    /**
     * The data needed to create a Listing.
     * 
    **/
    data: XOR<ListingCreateInput, ListingUncheckedCreateInput>
  }


  /**
   * Listing createMany
   */
  export type ListingCreateManyArgs = {
    /**
     * The data used to create many Listings.
     * 
    **/
    data: Enumerable<ListingCreateManyInput>
  }


  /**
   * Listing update
   */
  export type ListingUpdateArgs = {
    /**
     * Select specific fields to fetch from the Listing
     * 
    **/
    select?: ListingSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ListingInclude | null
    /**
     * The data needed to update a Listing.
     * 
    **/
    data: XOR<ListingUpdateInput, ListingUncheckedUpdateInput>
    /**
     * Choose, which Listing to update.
     * 
    **/
    where: ListingWhereUniqueInput
  }


  /**
   * Listing updateMany
   */
  export type ListingUpdateManyArgs = {
    /**
     * The data used to update Listings.
     * 
    **/
    data: XOR<ListingUpdateManyMutationInput, ListingUncheckedUpdateManyInput>
    /**
     * Filter which Listings to update
     * 
    **/
    where?: ListingWhereInput
  }


  /**
   * Listing upsert
   */
  export type ListingUpsertArgs = {
    /**
     * Select specific fields to fetch from the Listing
     * 
    **/
    select?: ListingSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ListingInclude | null
    /**
     * The filter to search for the Listing to update in case it exists.
     * 
    **/
    where: ListingWhereUniqueInput
    /**
     * In case the Listing found by the `where` argument doesn't exist, create a new Listing with this data.
     * 
    **/
    create: XOR<ListingCreateInput, ListingUncheckedCreateInput>
    /**
     * In case the Listing was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<ListingUpdateInput, ListingUncheckedUpdateInput>
  }


  /**
   * Listing delete
   */
  export type ListingDeleteArgs = {
    /**
     * Select specific fields to fetch from the Listing
     * 
    **/
    select?: ListingSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ListingInclude | null
    /**
     * Filter which Listing to delete.
     * 
    **/
    where: ListingWhereUniqueInput
  }


  /**
   * Listing deleteMany
   */
  export type ListingDeleteManyArgs = {
    /**
     * Filter which Listings to delete
     * 
    **/
    where?: ListingWhereInput
  }


  /**
   * Listing findRaw
   */
  export type ListingFindRawArgs = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     * 
    **/
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     * 
    **/
    options?: InputJsonValue
  }


  /**
   * Listing aggregateRaw
   */
  export type ListingAggregateRawArgs = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     * 
    **/
    pipeline?: Array<InputJsonValue>
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     * 
    **/
    options?: InputJsonValue
  }


  /**
   * Listing without action
   */
  export type ListingArgs = {
    /**
     * Select specific fields to fetch from the Listing
     * 
    **/
    select?: ListingSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ListingInclude | null
  }



  /**
   * Model ScrapingLog
   */


  export type AggregateScrapingLog = {
    _count: ScrapingLogCountAggregateOutputType | null
    _avg: ScrapingLogAvgAggregateOutputType | null
    _sum: ScrapingLogSumAggregateOutputType | null
    _min: ScrapingLogMinAggregateOutputType | null
    _max: ScrapingLogMaxAggregateOutputType | null
  }

  export type ScrapingLogAvgAggregateOutputType = {
    added_count: number | null
    error_count: number | null
  }

  export type ScrapingLogSumAggregateOutputType = {
    added_count: number | null
    error_count: number | null
  }

  export type ScrapingLogMinAggregateOutputType = {
    id: string | null
    added_count: number | null
    error_count: number | null
    entryPoint: string | null
    scrapeToId: string | null
    scrapeToDate: Date | null
    target: ListingOrigin | null
    triggered_by: ScraperTrigger | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ScrapingLogMaxAggregateOutputType = {
    id: string | null
    added_count: number | null
    error_count: number | null
    entryPoint: string | null
    scrapeToId: string | null
    scrapeToDate: Date | null
    target: ListingOrigin | null
    triggered_by: ScraperTrigger | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ScrapingLogCountAggregateOutputType = {
    id: number
    added_count: number
    error_count: number
    entryPoint: number
    scrapeToId: number
    scrapeToDate: number
    target: number
    triggered_by: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ScrapingLogAvgAggregateInputType = {
    added_count?: true
    error_count?: true
  }

  export type ScrapingLogSumAggregateInputType = {
    added_count?: true
    error_count?: true
  }

  export type ScrapingLogMinAggregateInputType = {
    id?: true
    added_count?: true
    error_count?: true
    entryPoint?: true
    scrapeToId?: true
    scrapeToDate?: true
    target?: true
    triggered_by?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ScrapingLogMaxAggregateInputType = {
    id?: true
    added_count?: true
    error_count?: true
    entryPoint?: true
    scrapeToId?: true
    scrapeToDate?: true
    target?: true
    triggered_by?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ScrapingLogCountAggregateInputType = {
    id?: true
    added_count?: true
    error_count?: true
    entryPoint?: true
    scrapeToId?: true
    scrapeToDate?: true
    target?: true
    triggered_by?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ScrapingLogAggregateArgs = {
    /**
     * Filter which ScrapingLog to aggregate.
     * 
    **/
    where?: ScrapingLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ScrapingLogs to fetch.
     * 
    **/
    orderBy?: Enumerable<ScrapingLogOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: ScrapingLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ScrapingLogs from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ScrapingLogs.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ScrapingLogs
    **/
    _count?: true | ScrapingLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ScrapingLogAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ScrapingLogSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ScrapingLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ScrapingLogMaxAggregateInputType
  }

  export type GetScrapingLogAggregateType<T extends ScrapingLogAggregateArgs> = {
        [P in keyof T & keyof AggregateScrapingLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateScrapingLog[P]>
      : GetScalarType<T[P], AggregateScrapingLog[P]>
  }




  export type ScrapingLogGroupByArgs = {
    where?: ScrapingLogWhereInput
    orderBy?: Enumerable<ScrapingLogOrderByWithAggregationInput>
    by: Array<ScrapingLogScalarFieldEnum>
    having?: ScrapingLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ScrapingLogCountAggregateInputType | true
    _avg?: ScrapingLogAvgAggregateInputType
    _sum?: ScrapingLogSumAggregateInputType
    _min?: ScrapingLogMinAggregateInputType
    _max?: ScrapingLogMaxAggregateInputType
  }


  export type ScrapingLogGroupByOutputType = {
    id: string
    added_count: number
    error_count: number
    entryPoint: string
    scrapeToId: string | null
    scrapeToDate: Date | null
    target: ListingOrigin
    triggered_by: ScraperTrigger
    createdAt: Date
    updatedAt: Date
    _count: ScrapingLogCountAggregateOutputType | null
    _avg: ScrapingLogAvgAggregateOutputType | null
    _sum: ScrapingLogSumAggregateOutputType | null
    _min: ScrapingLogMinAggregateOutputType | null
    _max: ScrapingLogMaxAggregateOutputType | null
  }

  type GetScrapingLogGroupByPayload<T extends ScrapingLogGroupByArgs> = PrismaPromise<
    Array<
      PickArray<ScrapingLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ScrapingLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ScrapingLogGroupByOutputType[P]>
            : GetScalarType<T[P], ScrapingLogGroupByOutputType[P]>
        }
      >
    >


  export type ScrapingLogSelect = {
    id?: boolean
    added_count?: boolean
    error_count?: boolean
    entryPoint?: boolean
    scrapeToId?: boolean
    scrapeToDate?: boolean
    target?: boolean
    triggered_by?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ScrapingLogGetPayload<
    S extends boolean | null | undefined | ScrapingLogArgs,
    U = keyof S
      > = S extends true
        ? ScrapingLog
    : S extends undefined
    ? never
    : S extends ScrapingLogArgs | ScrapingLogFindManyArgs
    ?'include' extends U
    ? ScrapingLog 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
    P extends keyof ScrapingLog ? ScrapingLog[P] : never
  } 
    : ScrapingLog
  : ScrapingLog


  type ScrapingLogCountArgs = Merge<
    Omit<ScrapingLogFindManyArgs, 'select' | 'include'> & {
      select?: ScrapingLogCountAggregateInputType | true
    }
  >

  export interface ScrapingLogDelegate<GlobalRejectSettings> {
    /**
     * Find zero or one ScrapingLog that matches the filter.
     * @param {ScrapingLogFindUniqueArgs} args - Arguments to find a ScrapingLog
     * @example
     * // Get one ScrapingLog
     * const scrapingLog = await prisma.scrapingLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends ScrapingLogFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, ScrapingLogFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'ScrapingLog'> extends True ? CheckSelect<T, Prisma__ScrapingLogClient<ScrapingLog>, Prisma__ScrapingLogClient<ScrapingLogGetPayload<T>>> : CheckSelect<T, Prisma__ScrapingLogClient<ScrapingLog | null >, Prisma__ScrapingLogClient<ScrapingLogGetPayload<T> | null >>

    /**
     * Find the first ScrapingLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScrapingLogFindFirstArgs} args - Arguments to find a ScrapingLog
     * @example
     * // Get one ScrapingLog
     * const scrapingLog = await prisma.scrapingLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends ScrapingLogFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, ScrapingLogFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'ScrapingLog'> extends True ? CheckSelect<T, Prisma__ScrapingLogClient<ScrapingLog>, Prisma__ScrapingLogClient<ScrapingLogGetPayload<T>>> : CheckSelect<T, Prisma__ScrapingLogClient<ScrapingLog | null >, Prisma__ScrapingLogClient<ScrapingLogGetPayload<T> | null >>

    /**
     * Find zero or more ScrapingLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScrapingLogFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ScrapingLogs
     * const scrapingLogs = await prisma.scrapingLog.findMany()
     * 
     * // Get first 10 ScrapingLogs
     * const scrapingLogs = await prisma.scrapingLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const scrapingLogWithIdOnly = await prisma.scrapingLog.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends ScrapingLogFindManyArgs>(
      args?: SelectSubset<T, ScrapingLogFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<ScrapingLog>>, PrismaPromise<Array<ScrapingLogGetPayload<T>>>>

    /**
     * Create a ScrapingLog.
     * @param {ScrapingLogCreateArgs} args - Arguments to create a ScrapingLog.
     * @example
     * // Create one ScrapingLog
     * const ScrapingLog = await prisma.scrapingLog.create({
     *   data: {
     *     // ... data to create a ScrapingLog
     *   }
     * })
     * 
    **/
    create<T extends ScrapingLogCreateArgs>(
      args: SelectSubset<T, ScrapingLogCreateArgs>
    ): CheckSelect<T, Prisma__ScrapingLogClient<ScrapingLog>, Prisma__ScrapingLogClient<ScrapingLogGetPayload<T>>>

    /**
     * Create many ScrapingLogs.
     *     @param {ScrapingLogCreateManyArgs} args - Arguments to create many ScrapingLogs.
     *     @example
     *     // Create many ScrapingLogs
     *     const scrapingLog = await prisma.scrapingLog.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends ScrapingLogCreateManyArgs>(
      args?: SelectSubset<T, ScrapingLogCreateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Delete a ScrapingLog.
     * @param {ScrapingLogDeleteArgs} args - Arguments to delete one ScrapingLog.
     * @example
     * // Delete one ScrapingLog
     * const ScrapingLog = await prisma.scrapingLog.delete({
     *   where: {
     *     // ... filter to delete one ScrapingLog
     *   }
     * })
     * 
    **/
    delete<T extends ScrapingLogDeleteArgs>(
      args: SelectSubset<T, ScrapingLogDeleteArgs>
    ): CheckSelect<T, Prisma__ScrapingLogClient<ScrapingLog>, Prisma__ScrapingLogClient<ScrapingLogGetPayload<T>>>

    /**
     * Update one ScrapingLog.
     * @param {ScrapingLogUpdateArgs} args - Arguments to update one ScrapingLog.
     * @example
     * // Update one ScrapingLog
     * const scrapingLog = await prisma.scrapingLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends ScrapingLogUpdateArgs>(
      args: SelectSubset<T, ScrapingLogUpdateArgs>
    ): CheckSelect<T, Prisma__ScrapingLogClient<ScrapingLog>, Prisma__ScrapingLogClient<ScrapingLogGetPayload<T>>>

    /**
     * Delete zero or more ScrapingLogs.
     * @param {ScrapingLogDeleteManyArgs} args - Arguments to filter ScrapingLogs to delete.
     * @example
     * // Delete a few ScrapingLogs
     * const { count } = await prisma.scrapingLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends ScrapingLogDeleteManyArgs>(
      args?: SelectSubset<T, ScrapingLogDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more ScrapingLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScrapingLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ScrapingLogs
     * const scrapingLog = await prisma.scrapingLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends ScrapingLogUpdateManyArgs>(
      args: SelectSubset<T, ScrapingLogUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one ScrapingLog.
     * @param {ScrapingLogUpsertArgs} args - Arguments to update or create a ScrapingLog.
     * @example
     * // Update or create a ScrapingLog
     * const scrapingLog = await prisma.scrapingLog.upsert({
     *   create: {
     *     // ... data to create a ScrapingLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ScrapingLog we want to update
     *   }
     * })
    **/
    upsert<T extends ScrapingLogUpsertArgs>(
      args: SelectSubset<T, ScrapingLogUpsertArgs>
    ): CheckSelect<T, Prisma__ScrapingLogClient<ScrapingLog>, Prisma__ScrapingLogClient<ScrapingLogGetPayload<T>>>

    /**
     * Find zero or more ScrapingLogs that matches the filter.
     * @param {ScrapingLogFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const scrapingLog = await prisma.scrapingLog.findRaw({
     *   filter: { age: { $gt: 25 } } 
     * })
    **/
    findRaw(
      args?: ScrapingLogFindRawArgs
    ): PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a ScrapingLog.
     * @param {ScrapingLogAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const scrapingLog = await prisma.scrapingLog.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
    **/
    aggregateRaw(
      args?: ScrapingLogAggregateRawArgs
    ): PrismaPromise<JsonObject>

    /**
     * Count the number of ScrapingLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScrapingLogCountArgs} args - Arguments to filter ScrapingLogs to count.
     * @example
     * // Count the number of ScrapingLogs
     * const count = await prisma.scrapingLog.count({
     *   where: {
     *     // ... the filter for the ScrapingLogs we want to count
     *   }
     * })
    **/
    count<T extends ScrapingLogCountArgs>(
      args?: Subset<T, ScrapingLogCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ScrapingLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ScrapingLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScrapingLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ScrapingLogAggregateArgs>(args: Subset<T, ScrapingLogAggregateArgs>): PrismaPromise<GetScrapingLogAggregateType<T>>

    /**
     * Group by ScrapingLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScrapingLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ScrapingLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ScrapingLogGroupByArgs['orderBy'] }
        : { orderBy?: ScrapingLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ScrapingLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetScrapingLogGroupByPayload<T> : PrismaPromise<InputErrors>
  }

  /**
   * The delegate class that acts as a "Promise-like" for ScrapingLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__ScrapingLogClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';


    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * ScrapingLog findUnique
   */
  export type ScrapingLogFindUniqueArgs = {
    /**
     * Select specific fields to fetch from the ScrapingLog
     * 
    **/
    select?: ScrapingLogSelect | null
    /**
     * Throw an Error if a ScrapingLog can't be found
     * 
    **/
    rejectOnNotFound?: RejectOnNotFound
    /**
     * Filter, which ScrapingLog to fetch.
     * 
    **/
    where: ScrapingLogWhereUniqueInput
  }


  /**
   * ScrapingLog findFirst
   */
  export type ScrapingLogFindFirstArgs = {
    /**
     * Select specific fields to fetch from the ScrapingLog
     * 
    **/
    select?: ScrapingLogSelect | null
    /**
     * Throw an Error if a ScrapingLog can't be found
     * 
    **/
    rejectOnNotFound?: RejectOnNotFound
    /**
     * Filter, which ScrapingLog to fetch.
     * 
    **/
    where?: ScrapingLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ScrapingLogs to fetch.
     * 
    **/
    orderBy?: Enumerable<ScrapingLogOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ScrapingLogs.
     * 
    **/
    cursor?: ScrapingLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ScrapingLogs from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ScrapingLogs.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ScrapingLogs.
     * 
    **/
    distinct?: Enumerable<ScrapingLogScalarFieldEnum>
  }


  /**
   * ScrapingLog findMany
   */
  export type ScrapingLogFindManyArgs = {
    /**
     * Select specific fields to fetch from the ScrapingLog
     * 
    **/
    select?: ScrapingLogSelect | null
    /**
     * Filter, which ScrapingLogs to fetch.
     * 
    **/
    where?: ScrapingLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ScrapingLogs to fetch.
     * 
    **/
    orderBy?: Enumerable<ScrapingLogOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ScrapingLogs.
     * 
    **/
    cursor?: ScrapingLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ScrapingLogs from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ScrapingLogs.
     * 
    **/
    skip?: number
    distinct?: Enumerable<ScrapingLogScalarFieldEnum>
  }


  /**
   * ScrapingLog create
   */
  export type ScrapingLogCreateArgs = {
    /**
     * Select specific fields to fetch from the ScrapingLog
     * 
    **/
    select?: ScrapingLogSelect | null
    /**
     * The data needed to create a ScrapingLog.
     * 
    **/
    data: XOR<ScrapingLogCreateInput, ScrapingLogUncheckedCreateInput>
  }


  /**
   * ScrapingLog createMany
   */
  export type ScrapingLogCreateManyArgs = {
    /**
     * The data used to create many ScrapingLogs.
     * 
    **/
    data: Enumerable<ScrapingLogCreateManyInput>
  }


  /**
   * ScrapingLog update
   */
  export type ScrapingLogUpdateArgs = {
    /**
     * Select specific fields to fetch from the ScrapingLog
     * 
    **/
    select?: ScrapingLogSelect | null
    /**
     * The data needed to update a ScrapingLog.
     * 
    **/
    data: XOR<ScrapingLogUpdateInput, ScrapingLogUncheckedUpdateInput>
    /**
     * Choose, which ScrapingLog to update.
     * 
    **/
    where: ScrapingLogWhereUniqueInput
  }


  /**
   * ScrapingLog updateMany
   */
  export type ScrapingLogUpdateManyArgs = {
    /**
     * The data used to update ScrapingLogs.
     * 
    **/
    data: XOR<ScrapingLogUpdateManyMutationInput, ScrapingLogUncheckedUpdateManyInput>
    /**
     * Filter which ScrapingLogs to update
     * 
    **/
    where?: ScrapingLogWhereInput
  }


  /**
   * ScrapingLog upsert
   */
  export type ScrapingLogUpsertArgs = {
    /**
     * Select specific fields to fetch from the ScrapingLog
     * 
    **/
    select?: ScrapingLogSelect | null
    /**
     * The filter to search for the ScrapingLog to update in case it exists.
     * 
    **/
    where: ScrapingLogWhereUniqueInput
    /**
     * In case the ScrapingLog found by the `where` argument doesn't exist, create a new ScrapingLog with this data.
     * 
    **/
    create: XOR<ScrapingLogCreateInput, ScrapingLogUncheckedCreateInput>
    /**
     * In case the ScrapingLog was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<ScrapingLogUpdateInput, ScrapingLogUncheckedUpdateInput>
  }


  /**
   * ScrapingLog delete
   */
  export type ScrapingLogDeleteArgs = {
    /**
     * Select specific fields to fetch from the ScrapingLog
     * 
    **/
    select?: ScrapingLogSelect | null
    /**
     * Filter which ScrapingLog to delete.
     * 
    **/
    where: ScrapingLogWhereUniqueInput
  }


  /**
   * ScrapingLog deleteMany
   */
  export type ScrapingLogDeleteManyArgs = {
    /**
     * Filter which ScrapingLogs to delete
     * 
    **/
    where?: ScrapingLogWhereInput
  }


  /**
   * ScrapingLog findRaw
   */
  export type ScrapingLogFindRawArgs = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     * 
    **/
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     * 
    **/
    options?: InputJsonValue
  }


  /**
   * ScrapingLog aggregateRaw
   */
  export type ScrapingLogAggregateRawArgs = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     * 
    **/
    pipeline?: Array<InputJsonValue>
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     * 
    **/
    options?: InputJsonValue
  }


  /**
   * ScrapingLog without action
   */
  export type ScrapingLogArgs = {
    /**
     * Select specific fields to fetch from the ScrapingLog
     * 
    **/
    select?: ScrapingLogSelect | null
  }



  /**
   * Model EmailRecord
   */


  export type AggregateEmailRecord = {
    _count: EmailRecordCountAggregateOutputType | null
    _min: EmailRecordMinAggregateOutputType | null
    _max: EmailRecordMaxAggregateOutputType | null
  }

  export type EmailRecordMinAggregateOutputType = {
    id: string | null
    to: string | null
    from: string | null
    type: EmailType | null
    userId: string | null
    createdAt: Date | null
  }

  export type EmailRecordMaxAggregateOutputType = {
    id: string | null
    to: string | null
    from: string | null
    type: EmailType | null
    userId: string | null
    createdAt: Date | null
  }

  export type EmailRecordCountAggregateOutputType = {
    id: number
    to: number
    from: number
    type: number
    userId: number
    createdAt: number
    _all: number
  }


  export type EmailRecordMinAggregateInputType = {
    id?: true
    to?: true
    from?: true
    type?: true
    userId?: true
    createdAt?: true
  }

  export type EmailRecordMaxAggregateInputType = {
    id?: true
    to?: true
    from?: true
    type?: true
    userId?: true
    createdAt?: true
  }

  export type EmailRecordCountAggregateInputType = {
    id?: true
    to?: true
    from?: true
    type?: true
    userId?: true
    createdAt?: true
    _all?: true
  }

  export type EmailRecordAggregateArgs = {
    /**
     * Filter which EmailRecord to aggregate.
     * 
    **/
    where?: EmailRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EmailRecords to fetch.
     * 
    **/
    orderBy?: Enumerable<EmailRecordOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: EmailRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EmailRecords from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EmailRecords.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned EmailRecords
    **/
    _count?: true | EmailRecordCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EmailRecordMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EmailRecordMaxAggregateInputType
  }

  export type GetEmailRecordAggregateType<T extends EmailRecordAggregateArgs> = {
        [P in keyof T & keyof AggregateEmailRecord]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEmailRecord[P]>
      : GetScalarType<T[P], AggregateEmailRecord[P]>
  }




  export type EmailRecordGroupByArgs = {
    where?: EmailRecordWhereInput
    orderBy?: Enumerable<EmailRecordOrderByWithAggregationInput>
    by: Array<EmailRecordScalarFieldEnum>
    having?: EmailRecordScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EmailRecordCountAggregateInputType | true
    _min?: EmailRecordMinAggregateInputType
    _max?: EmailRecordMaxAggregateInputType
  }


  export type EmailRecordGroupByOutputType = {
    id: string
    to: string
    from: string
    type: EmailType
    userId: string | null
    createdAt: Date
    _count: EmailRecordCountAggregateOutputType | null
    _min: EmailRecordMinAggregateOutputType | null
    _max: EmailRecordMaxAggregateOutputType | null
  }

  type GetEmailRecordGroupByPayload<T extends EmailRecordGroupByArgs> = PrismaPromise<
    Array<
      PickArray<EmailRecordGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EmailRecordGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EmailRecordGroupByOutputType[P]>
            : GetScalarType<T[P], EmailRecordGroupByOutputType[P]>
        }
      >
    >


  export type EmailRecordSelect = {
    id?: boolean
    to?: boolean
    from?: boolean
    type?: boolean
    user?: boolean | UserArgs
    userId?: boolean
    createdAt?: boolean
  }

  export type EmailRecordInclude = {
    user?: boolean | UserArgs
  }

  export type EmailRecordGetPayload<
    S extends boolean | null | undefined | EmailRecordArgs,
    U = keyof S
      > = S extends true
        ? EmailRecord
    : S extends undefined
    ? never
    : S extends EmailRecordArgs | EmailRecordFindManyArgs
    ?'include' extends U
    ? EmailRecord  & {
    [P in TrueKeys<S['include']>]:
        P extends 'user' ? UserGetPayload<S['include'][P]> | null :  never
  } 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
        P extends 'user' ? UserGetPayload<S['select'][P]> | null :  P extends keyof EmailRecord ? EmailRecord[P] : never
  } 
    : EmailRecord
  : EmailRecord


  type EmailRecordCountArgs = Merge<
    Omit<EmailRecordFindManyArgs, 'select' | 'include'> & {
      select?: EmailRecordCountAggregateInputType | true
    }
  >

  export interface EmailRecordDelegate<GlobalRejectSettings> {
    /**
     * Find zero or one EmailRecord that matches the filter.
     * @param {EmailRecordFindUniqueArgs} args - Arguments to find a EmailRecord
     * @example
     * // Get one EmailRecord
     * const emailRecord = await prisma.emailRecord.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends EmailRecordFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, EmailRecordFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'EmailRecord'> extends True ? CheckSelect<T, Prisma__EmailRecordClient<EmailRecord>, Prisma__EmailRecordClient<EmailRecordGetPayload<T>>> : CheckSelect<T, Prisma__EmailRecordClient<EmailRecord | null >, Prisma__EmailRecordClient<EmailRecordGetPayload<T> | null >>

    /**
     * Find the first EmailRecord that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailRecordFindFirstArgs} args - Arguments to find a EmailRecord
     * @example
     * // Get one EmailRecord
     * const emailRecord = await prisma.emailRecord.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends EmailRecordFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, EmailRecordFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'EmailRecord'> extends True ? CheckSelect<T, Prisma__EmailRecordClient<EmailRecord>, Prisma__EmailRecordClient<EmailRecordGetPayload<T>>> : CheckSelect<T, Prisma__EmailRecordClient<EmailRecord | null >, Prisma__EmailRecordClient<EmailRecordGetPayload<T> | null >>

    /**
     * Find zero or more EmailRecords that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailRecordFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EmailRecords
     * const emailRecords = await prisma.emailRecord.findMany()
     * 
     * // Get first 10 EmailRecords
     * const emailRecords = await prisma.emailRecord.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const emailRecordWithIdOnly = await prisma.emailRecord.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends EmailRecordFindManyArgs>(
      args?: SelectSubset<T, EmailRecordFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<EmailRecord>>, PrismaPromise<Array<EmailRecordGetPayload<T>>>>

    /**
     * Create a EmailRecord.
     * @param {EmailRecordCreateArgs} args - Arguments to create a EmailRecord.
     * @example
     * // Create one EmailRecord
     * const EmailRecord = await prisma.emailRecord.create({
     *   data: {
     *     // ... data to create a EmailRecord
     *   }
     * })
     * 
    **/
    create<T extends EmailRecordCreateArgs>(
      args: SelectSubset<T, EmailRecordCreateArgs>
    ): CheckSelect<T, Prisma__EmailRecordClient<EmailRecord>, Prisma__EmailRecordClient<EmailRecordGetPayload<T>>>

    /**
     * Create many EmailRecords.
     *     @param {EmailRecordCreateManyArgs} args - Arguments to create many EmailRecords.
     *     @example
     *     // Create many EmailRecords
     *     const emailRecord = await prisma.emailRecord.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends EmailRecordCreateManyArgs>(
      args?: SelectSubset<T, EmailRecordCreateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Delete a EmailRecord.
     * @param {EmailRecordDeleteArgs} args - Arguments to delete one EmailRecord.
     * @example
     * // Delete one EmailRecord
     * const EmailRecord = await prisma.emailRecord.delete({
     *   where: {
     *     // ... filter to delete one EmailRecord
     *   }
     * })
     * 
    **/
    delete<T extends EmailRecordDeleteArgs>(
      args: SelectSubset<T, EmailRecordDeleteArgs>
    ): CheckSelect<T, Prisma__EmailRecordClient<EmailRecord>, Prisma__EmailRecordClient<EmailRecordGetPayload<T>>>

    /**
     * Update one EmailRecord.
     * @param {EmailRecordUpdateArgs} args - Arguments to update one EmailRecord.
     * @example
     * // Update one EmailRecord
     * const emailRecord = await prisma.emailRecord.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends EmailRecordUpdateArgs>(
      args: SelectSubset<T, EmailRecordUpdateArgs>
    ): CheckSelect<T, Prisma__EmailRecordClient<EmailRecord>, Prisma__EmailRecordClient<EmailRecordGetPayload<T>>>

    /**
     * Delete zero or more EmailRecords.
     * @param {EmailRecordDeleteManyArgs} args - Arguments to filter EmailRecords to delete.
     * @example
     * // Delete a few EmailRecords
     * const { count } = await prisma.emailRecord.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends EmailRecordDeleteManyArgs>(
      args?: SelectSubset<T, EmailRecordDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more EmailRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailRecordUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EmailRecords
     * const emailRecord = await prisma.emailRecord.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends EmailRecordUpdateManyArgs>(
      args: SelectSubset<T, EmailRecordUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one EmailRecord.
     * @param {EmailRecordUpsertArgs} args - Arguments to update or create a EmailRecord.
     * @example
     * // Update or create a EmailRecord
     * const emailRecord = await prisma.emailRecord.upsert({
     *   create: {
     *     // ... data to create a EmailRecord
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EmailRecord we want to update
     *   }
     * })
    **/
    upsert<T extends EmailRecordUpsertArgs>(
      args: SelectSubset<T, EmailRecordUpsertArgs>
    ): CheckSelect<T, Prisma__EmailRecordClient<EmailRecord>, Prisma__EmailRecordClient<EmailRecordGetPayload<T>>>

    /**
     * Find zero or more EmailRecords that matches the filter.
     * @param {EmailRecordFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const emailRecord = await prisma.emailRecord.findRaw({
     *   filter: { age: { $gt: 25 } } 
     * })
    **/
    findRaw(
      args?: EmailRecordFindRawArgs
    ): PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a EmailRecord.
     * @param {EmailRecordAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const emailRecord = await prisma.emailRecord.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
    **/
    aggregateRaw(
      args?: EmailRecordAggregateRawArgs
    ): PrismaPromise<JsonObject>

    /**
     * Count the number of EmailRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailRecordCountArgs} args - Arguments to filter EmailRecords to count.
     * @example
     * // Count the number of EmailRecords
     * const count = await prisma.emailRecord.count({
     *   where: {
     *     // ... the filter for the EmailRecords we want to count
     *   }
     * })
    **/
    count<T extends EmailRecordCountArgs>(
      args?: Subset<T, EmailRecordCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EmailRecordCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a EmailRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailRecordAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EmailRecordAggregateArgs>(args: Subset<T, EmailRecordAggregateArgs>): PrismaPromise<GetEmailRecordAggregateType<T>>

    /**
     * Group by EmailRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailRecordGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EmailRecordGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EmailRecordGroupByArgs['orderBy'] }
        : { orderBy?: EmailRecordGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EmailRecordGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEmailRecordGroupByPayload<T> : PrismaPromise<InputErrors>
  }

  /**
   * The delegate class that acts as a "Promise-like" for EmailRecord.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__EmailRecordClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    user<T extends UserArgs = {}>(args?: Subset<T, UserArgs>): CheckSelect<T, Prisma__UserClient<User | null >, Prisma__UserClient<UserGetPayload<T> | null >>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * EmailRecord findUnique
   */
  export type EmailRecordFindUniqueArgs = {
    /**
     * Select specific fields to fetch from the EmailRecord
     * 
    **/
    select?: EmailRecordSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: EmailRecordInclude | null
    /**
     * Throw an Error if a EmailRecord can't be found
     * 
    **/
    rejectOnNotFound?: RejectOnNotFound
    /**
     * Filter, which EmailRecord to fetch.
     * 
    **/
    where: EmailRecordWhereUniqueInput
  }


  /**
   * EmailRecord findFirst
   */
  export type EmailRecordFindFirstArgs = {
    /**
     * Select specific fields to fetch from the EmailRecord
     * 
    **/
    select?: EmailRecordSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: EmailRecordInclude | null
    /**
     * Throw an Error if a EmailRecord can't be found
     * 
    **/
    rejectOnNotFound?: RejectOnNotFound
    /**
     * Filter, which EmailRecord to fetch.
     * 
    **/
    where?: EmailRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EmailRecords to fetch.
     * 
    **/
    orderBy?: Enumerable<EmailRecordOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EmailRecords.
     * 
    **/
    cursor?: EmailRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EmailRecords from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EmailRecords.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EmailRecords.
     * 
    **/
    distinct?: Enumerable<EmailRecordScalarFieldEnum>
  }


  /**
   * EmailRecord findMany
   */
  export type EmailRecordFindManyArgs = {
    /**
     * Select specific fields to fetch from the EmailRecord
     * 
    **/
    select?: EmailRecordSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: EmailRecordInclude | null
    /**
     * Filter, which EmailRecords to fetch.
     * 
    **/
    where?: EmailRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EmailRecords to fetch.
     * 
    **/
    orderBy?: Enumerable<EmailRecordOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing EmailRecords.
     * 
    **/
    cursor?: EmailRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EmailRecords from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EmailRecords.
     * 
    **/
    skip?: number
    distinct?: Enumerable<EmailRecordScalarFieldEnum>
  }


  /**
   * EmailRecord create
   */
  export type EmailRecordCreateArgs = {
    /**
     * Select specific fields to fetch from the EmailRecord
     * 
    **/
    select?: EmailRecordSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: EmailRecordInclude | null
    /**
     * The data needed to create a EmailRecord.
     * 
    **/
    data: XOR<EmailRecordCreateInput, EmailRecordUncheckedCreateInput>
  }


  /**
   * EmailRecord createMany
   */
  export type EmailRecordCreateManyArgs = {
    /**
     * The data used to create many EmailRecords.
     * 
    **/
    data: Enumerable<EmailRecordCreateManyInput>
  }


  /**
   * EmailRecord update
   */
  export type EmailRecordUpdateArgs = {
    /**
     * Select specific fields to fetch from the EmailRecord
     * 
    **/
    select?: EmailRecordSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: EmailRecordInclude | null
    /**
     * The data needed to update a EmailRecord.
     * 
    **/
    data: XOR<EmailRecordUpdateInput, EmailRecordUncheckedUpdateInput>
    /**
     * Choose, which EmailRecord to update.
     * 
    **/
    where: EmailRecordWhereUniqueInput
  }


  /**
   * EmailRecord updateMany
   */
  export type EmailRecordUpdateManyArgs = {
    /**
     * The data used to update EmailRecords.
     * 
    **/
    data: XOR<EmailRecordUpdateManyMutationInput, EmailRecordUncheckedUpdateManyInput>
    /**
     * Filter which EmailRecords to update
     * 
    **/
    where?: EmailRecordWhereInput
  }


  /**
   * EmailRecord upsert
   */
  export type EmailRecordUpsertArgs = {
    /**
     * Select specific fields to fetch from the EmailRecord
     * 
    **/
    select?: EmailRecordSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: EmailRecordInclude | null
    /**
     * The filter to search for the EmailRecord to update in case it exists.
     * 
    **/
    where: EmailRecordWhereUniqueInput
    /**
     * In case the EmailRecord found by the `where` argument doesn't exist, create a new EmailRecord with this data.
     * 
    **/
    create: XOR<EmailRecordCreateInput, EmailRecordUncheckedCreateInput>
    /**
     * In case the EmailRecord was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<EmailRecordUpdateInput, EmailRecordUncheckedUpdateInput>
  }


  /**
   * EmailRecord delete
   */
  export type EmailRecordDeleteArgs = {
    /**
     * Select specific fields to fetch from the EmailRecord
     * 
    **/
    select?: EmailRecordSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: EmailRecordInclude | null
    /**
     * Filter which EmailRecord to delete.
     * 
    **/
    where: EmailRecordWhereUniqueInput
  }


  /**
   * EmailRecord deleteMany
   */
  export type EmailRecordDeleteManyArgs = {
    /**
     * Filter which EmailRecords to delete
     * 
    **/
    where?: EmailRecordWhereInput
  }


  /**
   * EmailRecord findRaw
   */
  export type EmailRecordFindRawArgs = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     * 
    **/
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     * 
    **/
    options?: InputJsonValue
  }


  /**
   * EmailRecord aggregateRaw
   */
  export type EmailRecordAggregateRawArgs = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     * 
    **/
    pipeline?: Array<InputJsonValue>
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     * 
    **/
    options?: InputJsonValue
  }


  /**
   * EmailRecord without action
   */
  export type EmailRecordArgs = {
    /**
     * Select specific fields to fetch from the EmailRecord
     * 
    **/
    select?: EmailRecordSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: EmailRecordInclude | null
  }



  /**
   * Enums
   */

  // Based on
  // https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275

  export const WatcherScalarFieldEnum: {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type WatcherScalarFieldEnum = (typeof WatcherScalarFieldEnum)[keyof typeof WatcherScalarFieldEnum]


  export const UserWatcherScalarFieldEnum: {
    id: 'id',
    watcherId: 'watcherId',
    notifiedAt: 'notifiedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    userId: 'userId'
  };

  export type UserWatcherScalarFieldEnum = (typeof UserWatcherScalarFieldEnum)[keyof typeof UserWatcherScalarFieldEnum]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    password: 'password',
    premium: 'premium',
    roles: 'roles',
    loginStrategy: 'loginStrategy',
    likedListingIDs: 'likedListingIDs'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const ListingScalarFieldEnum: {
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
  };

  export type ListingScalarFieldEnum = (typeof ListingScalarFieldEnum)[keyof typeof ListingScalarFieldEnum]


  export const ScrapingLogScalarFieldEnum: {
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
  };

  export type ScrapingLogScalarFieldEnum = (typeof ScrapingLogScalarFieldEnum)[keyof typeof ScrapingLogScalarFieldEnum]


  export const EmailRecordScalarFieldEnum: {
    id: 'id',
    to: 'to',
    from: 'from',
    type: 'type',
    userId: 'userId',
    createdAt: 'createdAt'
  };

  export type EmailRecordScalarFieldEnum = (typeof EmailRecordScalarFieldEnum)[keyof typeof EmailRecordScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  /**
   * Deep Input Types
   */


  export type WatcherWhereInput = {
    AND?: Enumerable<WatcherWhereInput>
    OR?: Enumerable<WatcherWhereInput>
    NOT?: Enumerable<WatcherWhereInput>
    metadata?: XOR<MetadataCompositeFilter, MetadataObjectEqualityInput>
    id?: StringFilter | string
    createdAt?: DateTimeFilter | Date | string
    updatedAt?: DateTimeFilter | Date | string
    UserWatcher?: UserWatcherListRelationFilter
  }

  export type WatcherOrderByWithRelationInput = {
    metadata?: MetadataOrderByInput
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    UserWatcher?: UserWatcherOrderByRelationAggregateInput
  }

  export type WatcherWhereUniqueInput = {
    id?: string
  }

  export type WatcherOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: WatcherCountOrderByAggregateInput
    _max?: WatcherMaxOrderByAggregateInput
    _min?: WatcherMinOrderByAggregateInput
  }

  export type WatcherScalarWhereWithAggregatesInput = {
    AND?: Enumerable<WatcherScalarWhereWithAggregatesInput>
    OR?: Enumerable<WatcherScalarWhereWithAggregatesInput>
    NOT?: Enumerable<WatcherScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    createdAt?: DateTimeWithAggregatesFilter | Date | string
    updatedAt?: DateTimeWithAggregatesFilter | Date | string
  }

  export type UserWatcherWhereInput = {
    AND?: Enumerable<UserWatcherWhereInput>
    OR?: Enumerable<UserWatcherWhereInput>
    NOT?: Enumerable<UserWatcherWhereInput>
    id?: StringFilter | string
    watcherId?: StringFilter | string
    watcher?: XOR<WatcherRelationFilter, WatcherWhereInput>
    notifiedAt?: DateTimeNullableFilter | Date | string | null
    createdAt?: DateTimeFilter | Date | string
    updatedAt?: DateTimeFilter | Date | string
    userId?: StringFilter | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type UserWatcherOrderByWithRelationInput = {
    id?: SortOrder
    watcherId?: SortOrder
    watcher?: WatcherOrderByWithRelationInput
    notifiedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type UserWatcherWhereUniqueInput = {
    id?: string
  }

  export type UserWatcherOrderByWithAggregationInput = {
    id?: SortOrder
    watcherId?: SortOrder
    notifiedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    _count?: UserWatcherCountOrderByAggregateInput
    _max?: UserWatcherMaxOrderByAggregateInput
    _min?: UserWatcherMinOrderByAggregateInput
  }

  export type UserWatcherScalarWhereWithAggregatesInput = {
    AND?: Enumerable<UserWatcherScalarWhereWithAggregatesInput>
    OR?: Enumerable<UserWatcherScalarWhereWithAggregatesInput>
    NOT?: Enumerable<UserWatcherScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    watcherId?: StringWithAggregatesFilter | string
    notifiedAt?: DateTimeNullableWithAggregatesFilter | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter | Date | string
    updatedAt?: DateTimeWithAggregatesFilter | Date | string
    userId?: StringWithAggregatesFilter | string
  }

  export type UserWhereInput = {
    AND?: Enumerable<UserWhereInput>
    OR?: Enumerable<UserWhereInput>
    NOT?: Enumerable<UserWhereInput>
    passwordReset?: XOR<PasswordResetNullableCompositeFilter, PasswordResetObjectEqualityInput> | null
    emailUpdate?: XOR<EmailUpdateNullableCompositeFilter, EmailUpdateObjectEqualityInput> | null
    id?: StringFilter | string
    email?: StringFilter | string
    password?: StringNullableFilter | string | null
    premium?: BoolFilter | boolean
    watchers?: UserWatcherListRelationFilter
    roles?: EnumRoleNullableListFilter
    loginStrategy?: EnumLoginStrategyFilter | LoginStrategy
    likedListingIDs?: StringNullableListFilter
    likedListings?: ListingListRelationFilter
    EmailRecord?: EmailRecordListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    passwordReset?: PasswordResetOrderByInput
    emailUpdate?: EmailUpdateOrderByInput
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    premium?: SortOrder
    watchers?: UserWatcherOrderByRelationAggregateInput
    roles?: SortOrder
    loginStrategy?: SortOrder
    likedListingIDs?: SortOrder
    likedListings?: ListingOrderByRelationAggregateInput
    EmailRecord?: EmailRecordOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = {
    id?: string
    email?: string
  }

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    premium?: SortOrder
    roles?: SortOrder
    loginStrategy?: SortOrder
    likedListingIDs?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: Enumerable<UserScalarWhereWithAggregatesInput>
    OR?: Enumerable<UserScalarWhereWithAggregatesInput>
    NOT?: Enumerable<UserScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    email?: StringWithAggregatesFilter | string
    password?: StringNullableWithAggregatesFilter | string | null
    premium?: BoolWithAggregatesFilter | boolean
    roles?: EnumRoleNullableListFilter
    loginStrategy?: EnumLoginStrategyWithAggregatesFilter | LoginStrategy
    likedListingIDs?: StringNullableListFilter
  }

  export type ListingWhereInput = {
    AND?: Enumerable<ListingWhereInput>
    OR?: Enumerable<ListingWhereInput>
    NOT?: Enumerable<ListingWhereInput>
    price?: XOR<PriceNullableCompositeFilter, PriceObjectEqualityInput> | null
    parameters?: XOR<ParamaterCompositeListFilter, Enumerable<ParamaterObjectEqualityInput>>
    id?: StringFilter | string
    origin_id?: StringFilter | string
    title?: StringFilter | string
    body?: StringNullableFilter | string | null
    category?: EnumCategoryFilter | Category
    date?: DateTimeFilter | Date | string
    redirectUrl?: StringFilter | string
    imageUrl?: StringNullableListFilter
    region?: StringNullableFilter | string | null
    origin?: EnumListingOriginFilter | ListingOrigin
    isAuction?: BoolFilter | boolean
    auctionEnd?: DateTimeNullableFilter | Date | string | null
    likedByUserIDs?: StringNullableListFilter
    likedBy?: UserListRelationFilter
    entryPoint?: StringFilter | string
  }

  export type ListingOrderByWithRelationInput = {
    price?: PriceOrderByInput
    parameters?: ParamaterOrderByCompositeAggregateInput
    id?: SortOrder
    origin_id?: SortOrder
    title?: SortOrder
    body?: SortOrder
    category?: SortOrder
    date?: SortOrder
    redirectUrl?: SortOrder
    imageUrl?: SortOrder
    region?: SortOrder
    origin?: SortOrder
    isAuction?: SortOrder
    auctionEnd?: SortOrder
    likedByUserIDs?: SortOrder
    likedBy?: UserOrderByRelationAggregateInput
    entryPoint?: SortOrder
  }

  export type ListingWhereUniqueInput = {
    id?: string
    origin_id?: string
  }

  export type ListingOrderByWithAggregationInput = {
    id?: SortOrder
    origin_id?: SortOrder
    title?: SortOrder
    body?: SortOrder
    category?: SortOrder
    date?: SortOrder
    redirectUrl?: SortOrder
    imageUrl?: SortOrder
    region?: SortOrder
    origin?: SortOrder
    isAuction?: SortOrder
    auctionEnd?: SortOrder
    likedByUserIDs?: SortOrder
    entryPoint?: SortOrder
    _count?: ListingCountOrderByAggregateInput
    _max?: ListingMaxOrderByAggregateInput
    _min?: ListingMinOrderByAggregateInput
  }

  export type ListingScalarWhereWithAggregatesInput = {
    AND?: Enumerable<ListingScalarWhereWithAggregatesInput>
    OR?: Enumerable<ListingScalarWhereWithAggregatesInput>
    NOT?: Enumerable<ListingScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    origin_id?: StringWithAggregatesFilter | string
    title?: StringWithAggregatesFilter | string
    body?: StringNullableWithAggregatesFilter | string | null
    category?: EnumCategoryWithAggregatesFilter | Category
    date?: DateTimeWithAggregatesFilter | Date | string
    redirectUrl?: StringWithAggregatesFilter | string
    imageUrl?: StringNullableListFilter
    region?: StringNullableWithAggregatesFilter | string | null
    origin?: EnumListingOriginWithAggregatesFilter | ListingOrigin
    isAuction?: BoolWithAggregatesFilter | boolean
    auctionEnd?: DateTimeNullableWithAggregatesFilter | Date | string | null
    likedByUserIDs?: StringNullableListFilter
    entryPoint?: StringWithAggregatesFilter | string
  }

  export type ScrapingLogWhereInput = {
    AND?: Enumerable<ScrapingLogWhereInput>
    OR?: Enumerable<ScrapingLogWhereInput>
    NOT?: Enumerable<ScrapingLogWhereInput>
    id?: StringFilter | string
    added_count?: IntFilter | number
    error_count?: IntFilter | number
    entryPoint?: StringFilter | string
    scrapeToId?: StringNullableFilter | string | null
    scrapeToDate?: DateTimeNullableFilter | Date | string | null
    target?: EnumListingOriginFilter | ListingOrigin
    triggered_by?: EnumScraperTriggerFilter | ScraperTrigger
    createdAt?: DateTimeFilter | Date | string
    updatedAt?: DateTimeFilter | Date | string
  }

  export type ScrapingLogOrderByWithRelationInput = {
    id?: SortOrder
    added_count?: SortOrder
    error_count?: SortOrder
    entryPoint?: SortOrder
    scrapeToId?: SortOrder
    scrapeToDate?: SortOrder
    target?: SortOrder
    triggered_by?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ScrapingLogWhereUniqueInput = {
    id?: string
  }

  export type ScrapingLogOrderByWithAggregationInput = {
    id?: SortOrder
    added_count?: SortOrder
    error_count?: SortOrder
    entryPoint?: SortOrder
    scrapeToId?: SortOrder
    scrapeToDate?: SortOrder
    target?: SortOrder
    triggered_by?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ScrapingLogCountOrderByAggregateInput
    _avg?: ScrapingLogAvgOrderByAggregateInput
    _max?: ScrapingLogMaxOrderByAggregateInput
    _min?: ScrapingLogMinOrderByAggregateInput
    _sum?: ScrapingLogSumOrderByAggregateInput
  }

  export type ScrapingLogScalarWhereWithAggregatesInput = {
    AND?: Enumerable<ScrapingLogScalarWhereWithAggregatesInput>
    OR?: Enumerable<ScrapingLogScalarWhereWithAggregatesInput>
    NOT?: Enumerable<ScrapingLogScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    added_count?: IntWithAggregatesFilter | number
    error_count?: IntWithAggregatesFilter | number
    entryPoint?: StringWithAggregatesFilter | string
    scrapeToId?: StringNullableWithAggregatesFilter | string | null
    scrapeToDate?: DateTimeNullableWithAggregatesFilter | Date | string | null
    target?: EnumListingOriginWithAggregatesFilter | ListingOrigin
    triggered_by?: EnumScraperTriggerWithAggregatesFilter | ScraperTrigger
    createdAt?: DateTimeWithAggregatesFilter | Date | string
    updatedAt?: DateTimeWithAggregatesFilter | Date | string
  }

  export type EmailRecordWhereInput = {
    AND?: Enumerable<EmailRecordWhereInput>
    OR?: Enumerable<EmailRecordWhereInput>
    NOT?: Enumerable<EmailRecordWhereInput>
    id?: StringFilter | string
    to?: StringFilter | string
    from?: StringFilter | string
    type?: EnumEmailTypeFilter | EmailType
    user?: XOR<UserRelationFilter, UserWhereInput> | null
    userId?: StringNullableFilter | string | null
    createdAt?: DateTimeFilter | Date | string
  }

  export type EmailRecordOrderByWithRelationInput = {
    id?: SortOrder
    to?: SortOrder
    from?: SortOrder
    type?: SortOrder
    user?: UserOrderByWithRelationInput
    userId?: SortOrder
    createdAt?: SortOrder
  }

  export type EmailRecordWhereUniqueInput = {
    id?: string
  }

  export type EmailRecordOrderByWithAggregationInput = {
    id?: SortOrder
    to?: SortOrder
    from?: SortOrder
    type?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    _count?: EmailRecordCountOrderByAggregateInput
    _max?: EmailRecordMaxOrderByAggregateInput
    _min?: EmailRecordMinOrderByAggregateInput
  }

  export type EmailRecordScalarWhereWithAggregatesInput = {
    AND?: Enumerable<EmailRecordScalarWhereWithAggregatesInput>
    OR?: Enumerable<EmailRecordScalarWhereWithAggregatesInput>
    NOT?: Enumerable<EmailRecordScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    to?: StringWithAggregatesFilter | string
    from?: StringWithAggregatesFilter | string
    type?: EnumEmailTypeWithAggregatesFilter | EmailType
    userId?: StringNullableWithAggregatesFilter | string | null
    createdAt?: DateTimeWithAggregatesFilter | Date | string
  }

  export type WatcherCreateInput = {
    metadata: XOR<MetadataCreateEnvelopeInput, MetadataCreateInput>
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    UserWatcher?: UserWatcherCreateNestedManyWithoutWatcherInput
  }

  export type WatcherUncheckedCreateInput = {
    metadata: XOR<MetadataCreateEnvelopeInput, MetadataCreateInput>
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    UserWatcher?: UserWatcherUncheckedCreateNestedManyWithoutWatcherInput
  }

  export type WatcherUpdateInput = {
    metadata?: XOR<MetadataUpdateEnvelopeInput, MetadataCreateInput>
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    UserWatcher?: UserWatcherUpdateManyWithoutWatcherInput
  }

  export type WatcherUncheckedUpdateInput = {
    metadata?: XOR<MetadataUpdateEnvelopeInput, MetadataCreateInput>
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    UserWatcher?: UserWatcherUncheckedUpdateManyWithoutWatcherInput
  }

  export type WatcherCreateManyInput = {
    metadata: XOR<MetadataCreateEnvelopeInput, MetadataCreateInput>
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WatcherUpdateManyMutationInput = {
    metadata?: XOR<MetadataUpdateEnvelopeInput, MetadataCreateInput>
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WatcherUncheckedUpdateManyInput = {
    metadata?: XOR<MetadataUpdateEnvelopeInput, MetadataCreateInput>
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserWatcherCreateInput = {
    id?: string
    watcher: WatcherCreateNestedOneWithoutUserWatcherInput
    notifiedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutWatchersInput
  }

  export type UserWatcherUncheckedCreateInput = {
    id?: string
    watcherId: string
    notifiedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
  }

  export type UserWatcherUpdateInput = {
    watcher?: WatcherUpdateOneRequiredWithoutUserWatcherInput
    notifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutWatchersInput
  }

  export type UserWatcherUncheckedUpdateInput = {
    watcherId?: StringFieldUpdateOperationsInput | string
    notifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type UserWatcherCreateManyInput = {
    id?: string
    watcherId: string
    notifiedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
  }

  export type UserWatcherUpdateManyMutationInput = {
    notifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserWatcherUncheckedUpdateManyInput = {
    watcherId?: StringFieldUpdateOperationsInput | string
    notifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type UserCreateInput = {
    passwordReset?: XOR<PasswordResetNullableCreateEnvelopeInput, PasswordResetCreateInput> | null
    emailUpdate?: XOR<EmailUpdateNullableCreateEnvelopeInput, EmailUpdateCreateInput> | null
    id?: string
    email: string
    password?: string | null
    premium?: boolean
    watchers?: UserWatcherCreateNestedManyWithoutUserInput
    roles?: UserCreaterolesInput | Enumerable<Role>
    loginStrategy?: LoginStrategy
    likedListingIDs?: UserCreatelikedListingIDsInput | Enumerable<string>
    likedListings?: ListingCreateNestedManyWithoutLikedByInput
    EmailRecord?: EmailRecordCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    passwordReset?: XOR<PasswordResetNullableCreateEnvelopeInput, PasswordResetCreateInput> | null
    emailUpdate?: XOR<EmailUpdateNullableCreateEnvelopeInput, EmailUpdateCreateInput> | null
    id?: string
    email: string
    password?: string | null
    premium?: boolean
    watchers?: UserWatcherUncheckedCreateNestedManyWithoutUserInput
    roles?: UserCreaterolesInput | Enumerable<Role>
    loginStrategy?: LoginStrategy
    likedListingIDs?: UserCreatelikedListingIDsInput | Enumerable<string>
    likedListings?: ListingUncheckedCreateNestedManyWithoutLikedByInput
    EmailRecord?: EmailRecordUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    passwordReset?: XOR<PasswordResetNullableUpdateEnvelopeInput, PasswordResetCreateInput> | null
    emailUpdate?: XOR<EmailUpdateNullableUpdateEnvelopeInput, EmailUpdateCreateInput> | null
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    premium?: BoolFieldUpdateOperationsInput | boolean
    watchers?: UserWatcherUpdateManyWithoutUserInput
    roles?: UserUpdaterolesInput | Enumerable<Role>
    loginStrategy?: EnumLoginStrategyFieldUpdateOperationsInput | LoginStrategy
    likedListingIDs?: UserUpdatelikedListingIDsInput | Enumerable<string>
    likedListings?: ListingUpdateManyWithoutLikedByInput
    EmailRecord?: EmailRecordUpdateManyWithoutUserInput
  }

  export type UserUncheckedUpdateInput = {
    passwordReset?: XOR<PasswordResetNullableUpdateEnvelopeInput, PasswordResetCreateInput> | null
    emailUpdate?: XOR<EmailUpdateNullableUpdateEnvelopeInput, EmailUpdateCreateInput> | null
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    premium?: BoolFieldUpdateOperationsInput | boolean
    watchers?: UserWatcherUncheckedUpdateManyWithoutUserInput
    roles?: UserUpdaterolesInput | Enumerable<Role>
    loginStrategy?: EnumLoginStrategyFieldUpdateOperationsInput | LoginStrategy
    likedListingIDs?: UserUpdatelikedListingIDsInput | Enumerable<string>
    likedListings?: ListingUncheckedUpdateManyWithoutLikedByInput
    EmailRecord?: EmailRecordUncheckedUpdateManyWithoutUserInput
  }

  export type UserCreateManyInput = {
    passwordReset?: XOR<PasswordResetNullableCreateEnvelopeInput, PasswordResetCreateInput> | null
    emailUpdate?: XOR<EmailUpdateNullableCreateEnvelopeInput, EmailUpdateCreateInput> | null
    id?: string
    email: string
    password?: string | null
    premium?: boolean
    roles?: UserCreaterolesInput | Enumerable<Role>
    loginStrategy?: LoginStrategy
    likedListingIDs?: UserCreatelikedListingIDsInput | Enumerable<string>
  }

  export type UserUpdateManyMutationInput = {
    passwordReset?: XOR<PasswordResetNullableUpdateEnvelopeInput, PasswordResetCreateInput> | null
    emailUpdate?: XOR<EmailUpdateNullableUpdateEnvelopeInput, EmailUpdateCreateInput> | null
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    premium?: BoolFieldUpdateOperationsInput | boolean
    roles?: UserUpdaterolesInput | Enumerable<Role>
    loginStrategy?: EnumLoginStrategyFieldUpdateOperationsInput | LoginStrategy
    likedListingIDs?: UserUpdatelikedListingIDsInput | Enumerable<string>
  }

  export type UserUncheckedUpdateManyInput = {
    passwordReset?: XOR<PasswordResetNullableUpdateEnvelopeInput, PasswordResetCreateInput> | null
    emailUpdate?: XOR<EmailUpdateNullableUpdateEnvelopeInput, EmailUpdateCreateInput> | null
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    premium?: BoolFieldUpdateOperationsInput | boolean
    roles?: UserUpdaterolesInput | Enumerable<Role>
    loginStrategy?: EnumLoginStrategyFieldUpdateOperationsInput | LoginStrategy
    likedListingIDs?: UserUpdatelikedListingIDsInput | Enumerable<string>
  }

  export type ListingCreateInput = {
    price?: XOR<PriceNullableCreateEnvelopeInput, PriceCreateInput> | null
    parameters?: XOR<ParamaterListCreateEnvelopeInput, Enumerable<ParamaterCreateInput>>
    id?: string
    origin_id: string
    title: string
    body?: string | null
    category: Category
    date?: Date | string
    redirectUrl: string
    imageUrl?: ListingCreateimageUrlInput | Enumerable<string>
    region?: string | null
    origin: ListingOrigin
    isAuction?: boolean
    auctionEnd?: Date | string | null
    likedByUserIDs?: ListingCreatelikedByUserIDsInput | Enumerable<string>
    likedBy?: UserCreateNestedManyWithoutLikedListingsInput
    entryPoint: string
  }

  export type ListingUncheckedCreateInput = {
    price?: XOR<PriceNullableCreateEnvelopeInput, PriceCreateInput> | null
    parameters?: XOR<ParamaterListCreateEnvelopeInput, Enumerable<ParamaterCreateInput>>
    id?: string
    origin_id: string
    title: string
    body?: string | null
    category: Category
    date?: Date | string
    redirectUrl: string
    imageUrl?: ListingCreateimageUrlInput | Enumerable<string>
    region?: string | null
    origin: ListingOrigin
    isAuction?: boolean
    auctionEnd?: Date | string | null
    likedByUserIDs?: ListingCreatelikedByUserIDsInput | Enumerable<string>
    likedBy?: UserUncheckedCreateNestedManyWithoutLikedListingsInput
    entryPoint: string
  }

  export type ListingUpdateInput = {
    price?: XOR<PriceNullableUpdateEnvelopeInput, PriceCreateInput> | null
    parameters?: XOR<ParamaterListUpdateEnvelopeInput, Enumerable<ParamaterCreateInput>>
    origin_id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    body?: NullableStringFieldUpdateOperationsInput | string | null
    category?: EnumCategoryFieldUpdateOperationsInput | Category
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    redirectUrl?: StringFieldUpdateOperationsInput | string
    imageUrl?: ListingUpdateimageUrlInput | Enumerable<string>
    region?: NullableStringFieldUpdateOperationsInput | string | null
    origin?: EnumListingOriginFieldUpdateOperationsInput | ListingOrigin
    isAuction?: BoolFieldUpdateOperationsInput | boolean
    auctionEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    likedByUserIDs?: ListingUpdatelikedByUserIDsInput | Enumerable<string>
    likedBy?: UserUpdateManyWithoutLikedListingsInput
    entryPoint?: StringFieldUpdateOperationsInput | string
  }

  export type ListingUncheckedUpdateInput = {
    price?: XOR<PriceNullableUpdateEnvelopeInput, PriceCreateInput> | null
    parameters?: XOR<ParamaterListUpdateEnvelopeInput, Enumerable<ParamaterCreateInput>>
    origin_id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    body?: NullableStringFieldUpdateOperationsInput | string | null
    category?: EnumCategoryFieldUpdateOperationsInput | Category
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    redirectUrl?: StringFieldUpdateOperationsInput | string
    imageUrl?: ListingUpdateimageUrlInput | Enumerable<string>
    region?: NullableStringFieldUpdateOperationsInput | string | null
    origin?: EnumListingOriginFieldUpdateOperationsInput | ListingOrigin
    isAuction?: BoolFieldUpdateOperationsInput | boolean
    auctionEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    likedByUserIDs?: ListingUpdatelikedByUserIDsInput | Enumerable<string>
    likedBy?: UserUncheckedUpdateManyWithoutLikedListingsInput
    entryPoint?: StringFieldUpdateOperationsInput | string
  }

  export type ListingCreateManyInput = {
    price?: XOR<PriceNullableCreateEnvelopeInput, PriceCreateInput> | null
    parameters?: XOR<ParamaterListCreateEnvelopeInput, Enumerable<ParamaterCreateInput>>
    id?: string
    origin_id: string
    title: string
    body?: string | null
    category: Category
    date?: Date | string
    redirectUrl: string
    imageUrl?: ListingCreateimageUrlInput | Enumerable<string>
    region?: string | null
    origin: ListingOrigin
    isAuction?: boolean
    auctionEnd?: Date | string | null
    likedByUserIDs?: ListingCreatelikedByUserIDsInput | Enumerable<string>
    entryPoint: string
  }

  export type ListingUpdateManyMutationInput = {
    price?: XOR<PriceNullableUpdateEnvelopeInput, PriceCreateInput> | null
    parameters?: XOR<ParamaterListUpdateEnvelopeInput, Enumerable<ParamaterCreateInput>>
    origin_id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    body?: NullableStringFieldUpdateOperationsInput | string | null
    category?: EnumCategoryFieldUpdateOperationsInput | Category
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    redirectUrl?: StringFieldUpdateOperationsInput | string
    imageUrl?: ListingUpdateimageUrlInput | Enumerable<string>
    region?: NullableStringFieldUpdateOperationsInput | string | null
    origin?: EnumListingOriginFieldUpdateOperationsInput | ListingOrigin
    isAuction?: BoolFieldUpdateOperationsInput | boolean
    auctionEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    likedByUserIDs?: ListingUpdatelikedByUserIDsInput | Enumerable<string>
    entryPoint?: StringFieldUpdateOperationsInput | string
  }

  export type ListingUncheckedUpdateManyInput = {
    price?: XOR<PriceNullableUpdateEnvelopeInput, PriceCreateInput> | null
    parameters?: XOR<ParamaterListUpdateEnvelopeInput, Enumerable<ParamaterCreateInput>>
    origin_id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    body?: NullableStringFieldUpdateOperationsInput | string | null
    category?: EnumCategoryFieldUpdateOperationsInput | Category
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    redirectUrl?: StringFieldUpdateOperationsInput | string
    imageUrl?: ListingUpdateimageUrlInput | Enumerable<string>
    region?: NullableStringFieldUpdateOperationsInput | string | null
    origin?: EnumListingOriginFieldUpdateOperationsInput | ListingOrigin
    isAuction?: BoolFieldUpdateOperationsInput | boolean
    auctionEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    likedByUserIDs?: ListingUpdatelikedByUserIDsInput | Enumerable<string>
    entryPoint?: StringFieldUpdateOperationsInput | string
  }

  export type ScrapingLogCreateInput = {
    id?: string
    added_count: number
    error_count: number
    entryPoint: string
    scrapeToId?: string | null
    scrapeToDate?: Date | string | null
    target: ListingOrigin
    triggered_by: ScraperTrigger
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ScrapingLogUncheckedCreateInput = {
    id?: string
    added_count: number
    error_count: number
    entryPoint: string
    scrapeToId?: string | null
    scrapeToDate?: Date | string | null
    target: ListingOrigin
    triggered_by: ScraperTrigger
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ScrapingLogUpdateInput = {
    added_count?: IntFieldUpdateOperationsInput | number
    error_count?: IntFieldUpdateOperationsInput | number
    entryPoint?: StringFieldUpdateOperationsInput | string
    scrapeToId?: NullableStringFieldUpdateOperationsInput | string | null
    scrapeToDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    target?: EnumListingOriginFieldUpdateOperationsInput | ListingOrigin
    triggered_by?: EnumScraperTriggerFieldUpdateOperationsInput | ScraperTrigger
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScrapingLogUncheckedUpdateInput = {
    added_count?: IntFieldUpdateOperationsInput | number
    error_count?: IntFieldUpdateOperationsInput | number
    entryPoint?: StringFieldUpdateOperationsInput | string
    scrapeToId?: NullableStringFieldUpdateOperationsInput | string | null
    scrapeToDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    target?: EnumListingOriginFieldUpdateOperationsInput | ListingOrigin
    triggered_by?: EnumScraperTriggerFieldUpdateOperationsInput | ScraperTrigger
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScrapingLogCreateManyInput = {
    id?: string
    added_count: number
    error_count: number
    entryPoint: string
    scrapeToId?: string | null
    scrapeToDate?: Date | string | null
    target: ListingOrigin
    triggered_by: ScraperTrigger
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ScrapingLogUpdateManyMutationInput = {
    added_count?: IntFieldUpdateOperationsInput | number
    error_count?: IntFieldUpdateOperationsInput | number
    entryPoint?: StringFieldUpdateOperationsInput | string
    scrapeToId?: NullableStringFieldUpdateOperationsInput | string | null
    scrapeToDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    target?: EnumListingOriginFieldUpdateOperationsInput | ListingOrigin
    triggered_by?: EnumScraperTriggerFieldUpdateOperationsInput | ScraperTrigger
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScrapingLogUncheckedUpdateManyInput = {
    added_count?: IntFieldUpdateOperationsInput | number
    error_count?: IntFieldUpdateOperationsInput | number
    entryPoint?: StringFieldUpdateOperationsInput | string
    scrapeToId?: NullableStringFieldUpdateOperationsInput | string | null
    scrapeToDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    target?: EnumListingOriginFieldUpdateOperationsInput | ListingOrigin
    triggered_by?: EnumScraperTriggerFieldUpdateOperationsInput | ScraperTrigger
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EmailRecordCreateInput = {
    id?: string
    to: string
    from: string
    type: EmailType
    user?: UserCreateNestedOneWithoutEmailRecordInput
    createdAt?: Date | string
  }

  export type EmailRecordUncheckedCreateInput = {
    id?: string
    to: string
    from: string
    type: EmailType
    userId?: string | null
    createdAt?: Date | string
  }

  export type EmailRecordUpdateInput = {
    to?: StringFieldUpdateOperationsInput | string
    from?: StringFieldUpdateOperationsInput | string
    type?: EnumEmailTypeFieldUpdateOperationsInput | EmailType
    user?: UserUpdateOneWithoutEmailRecordInput
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EmailRecordUncheckedUpdateInput = {
    to?: StringFieldUpdateOperationsInput | string
    from?: StringFieldUpdateOperationsInput | string
    type?: EnumEmailTypeFieldUpdateOperationsInput | EmailType
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EmailRecordCreateManyInput = {
    id?: string
    to: string
    from: string
    type: EmailType
    userId?: string | null
    createdAt?: Date | string
  }

  export type EmailRecordUpdateManyMutationInput = {
    to?: StringFieldUpdateOperationsInput | string
    from?: StringFieldUpdateOperationsInput | string
    type?: EnumEmailTypeFieldUpdateOperationsInput | EmailType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EmailRecordUncheckedUpdateManyInput = {
    to?: StringFieldUpdateOperationsInput | string
    from?: StringFieldUpdateOperationsInput | string
    type?: EnumEmailTypeFieldUpdateOperationsInput | EmailType
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MetadataCompositeFilter = {
    equals?: MetadataObjectEqualityInput
    is?: MetadataWhereInput
    isNot?: MetadataWhereInput
  }

  export type MetadataObjectEqualityInput = {
    keyword?: string | null
    region?: string | null
    categories?: Enumerable<Category>
    auction?: boolean | null
    priceRangeGte?: number | null
    priceRangeLte?: number | null
    dateGte?: Date | string | null
    origins?: Enumerable<ListingOrigin>
  }

  export type StringFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    mode?: QueryMode
    not?: NestedStringFilter | string
  }

  export type DateTimeFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string>
    notIn?: Enumerable<Date> | Enumerable<string>
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeFilter | Date | string
  }

  export type UserWatcherListRelationFilter = {
    every?: UserWatcherWhereInput
    some?: UserWatcherWhereInput
    none?: UserWatcherWhereInput
  }

  export type MetadataOrderByInput = {
    keyword?: SortOrder
    region?: SortOrder
    categories?: SortOrder
    auction?: SortOrder
    priceRangeGte?: SortOrder
    priceRangeLte?: SortOrder
    dateGte?: SortOrder
    origins?: SortOrder
  }

  export type UserWatcherOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type WatcherCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WatcherMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WatcherMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter | string
    _count?: NestedIntFilter
    _min?: NestedStringFilter
    _max?: NestedStringFilter
  }

  export type DateTimeWithAggregatesFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string>
    notIn?: Enumerable<Date> | Enumerable<string>
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeWithAggregatesFilter | Date | string
    _count?: NestedIntFilter
    _min?: NestedDateTimeFilter
    _max?: NestedDateTimeFilter
  }

  export type WatcherRelationFilter = {
    is?: WatcherWhereInput
    isNot?: WatcherWhereInput
  }

  export type DateTimeNullableFilter = {
    equals?: Date | string | null
    in?: Enumerable<Date> | Enumerable<string> | null
    notIn?: Enumerable<Date> | Enumerable<string> | null
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeNullableFilter | Date | string | null
    isSet?: boolean
  }

  export type UserRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type UserWatcherCountOrderByAggregateInput = {
    id?: SortOrder
    watcherId?: SortOrder
    notifiedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
  }

  export type UserWatcherMaxOrderByAggregateInput = {
    id?: SortOrder
    watcherId?: SortOrder
    notifiedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
  }

  export type UserWatcherMinOrderByAggregateInput = {
    id?: SortOrder
    watcherId?: SortOrder
    notifiedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter = {
    equals?: Date | string | null
    in?: Enumerable<Date> | Enumerable<string> | null
    notIn?: Enumerable<Date> | Enumerable<string> | null
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeNullableWithAggregatesFilter | Date | string | null
    _count?: NestedIntNullableFilter
    _min?: NestedDateTimeNullableFilter
    _max?: NestedDateTimeNullableFilter
    isSet?: boolean
  }

  export type PasswordResetNullableCompositeFilter = {
    equals?: PasswordResetObjectEqualityInput | null
    is?: PasswordResetWhereInput | null
    isNot?: PasswordResetWhereInput | null
    isSet?: boolean
  }

  export type PasswordResetObjectEqualityInput = {
    tokenHash: string
    expiration: number
  }

  export type EmailUpdateNullableCompositeFilter = {
    equals?: EmailUpdateObjectEqualityInput | null
    is?: EmailUpdateWhereInput | null
    isNot?: EmailUpdateWhereInput | null
    isSet?: boolean
  }

  export type EmailUpdateObjectEqualityInput = {
    newEmail: string
    tokenHash: string
    expiration: Date | string
  }

  export type StringNullableFilter = {
    equals?: string | null
    in?: Enumerable<string> | null
    notIn?: Enumerable<string> | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    mode?: QueryMode
    not?: NestedStringNullableFilter | string | null
    isSet?: boolean
  }

  export type BoolFilter = {
    equals?: boolean
    not?: NestedBoolFilter | boolean
  }

  export type EnumRoleNullableListFilter = {
    equals?: Enumerable<Role> | null
    has?: Role | null
    hasEvery?: Enumerable<Role>
    hasSome?: Enumerable<Role>
    isEmpty?: boolean
  }

  export type EnumLoginStrategyFilter = {
    equals?: LoginStrategy
    in?: Enumerable<LoginStrategy>
    notIn?: Enumerable<LoginStrategy>
    not?: NestedEnumLoginStrategyFilter | LoginStrategy
  }

  export type StringNullableListFilter = {
    equals?: Enumerable<string> | null
    has?: string | null
    hasEvery?: Enumerable<string>
    hasSome?: Enumerable<string>
    isEmpty?: boolean
  }

  export type ListingListRelationFilter = {
    every?: ListingWhereInput
    some?: ListingWhereInput
    none?: ListingWhereInput
  }

  export type EmailRecordListRelationFilter = {
    every?: EmailRecordWhereInput
    some?: EmailRecordWhereInput
    none?: EmailRecordWhereInput
  }

  export type PasswordResetOrderByInput = {
    tokenHash?: SortOrder
    expiration?: SortOrder
  }

  export type EmailUpdateOrderByInput = {
    newEmail?: SortOrder
    tokenHash?: SortOrder
    expiration?: SortOrder
  }

  export type ListingOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type EmailRecordOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    premium?: SortOrder
    roles?: SortOrder
    loginStrategy?: SortOrder
    likedListingIDs?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    premium?: SortOrder
    loginStrategy?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    premium?: SortOrder
    loginStrategy?: SortOrder
  }

  export type StringNullableWithAggregatesFilter = {
    equals?: string | null
    in?: Enumerable<string> | null
    notIn?: Enumerable<string> | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter | string | null
    _count?: NestedIntNullableFilter
    _min?: NestedStringNullableFilter
    _max?: NestedStringNullableFilter
    isSet?: boolean
  }

  export type BoolWithAggregatesFilter = {
    equals?: boolean
    not?: NestedBoolWithAggregatesFilter | boolean
    _count?: NestedIntFilter
    _min?: NestedBoolFilter
    _max?: NestedBoolFilter
  }

  export type EnumLoginStrategyWithAggregatesFilter = {
    equals?: LoginStrategy
    in?: Enumerable<LoginStrategy>
    notIn?: Enumerable<LoginStrategy>
    not?: NestedEnumLoginStrategyWithAggregatesFilter | LoginStrategy
    _count?: NestedIntFilter
    _min?: NestedEnumLoginStrategyFilter
    _max?: NestedEnumLoginStrategyFilter
  }

  export type PriceNullableCompositeFilter = {
    equals?: PriceObjectEqualityInput | null
    is?: PriceWhereInput | null
    isNot?: PriceWhereInput | null
    isSet?: boolean
  }

  export type PriceObjectEqualityInput = {
    value: number
    currency: Currency
  }

  export type ParamaterCompositeListFilter = {
    equals?: Enumerable<ParamaterObjectEqualityInput>
    every?: ParamaterWhereInput
    some?: ParamaterWhereInput
    none?: ParamaterWhereInput
    isEmpty?: boolean
    isSet?: boolean
  }

  export type ParamaterObjectEqualityInput = {
    label: string
    value: string
  }

  export type EnumCategoryFilter = {
    equals?: Category
    in?: Enumerable<Category>
    notIn?: Enumerable<Category>
    not?: NestedEnumCategoryFilter | Category
  }

  export type EnumListingOriginFilter = {
    equals?: ListingOrigin
    in?: Enumerable<ListingOrigin>
    notIn?: Enumerable<ListingOrigin>
    not?: NestedEnumListingOriginFilter | ListingOrigin
  }

  export type UserListRelationFilter = {
    every?: UserWhereInput
    some?: UserWhereInput
    none?: UserWhereInput
  }

  export type PriceOrderByInput = {
    value?: SortOrder
    currency?: SortOrder
  }

  export type ParamaterOrderByCompositeAggregateInput = {
    _count?: SortOrder
  }

  export type UserOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ListingCountOrderByAggregateInput = {
    id?: SortOrder
    origin_id?: SortOrder
    title?: SortOrder
    body?: SortOrder
    category?: SortOrder
    date?: SortOrder
    redirectUrl?: SortOrder
    imageUrl?: SortOrder
    region?: SortOrder
    origin?: SortOrder
    isAuction?: SortOrder
    auctionEnd?: SortOrder
    likedByUserIDs?: SortOrder
    entryPoint?: SortOrder
  }

  export type ListingMaxOrderByAggregateInput = {
    id?: SortOrder
    origin_id?: SortOrder
    title?: SortOrder
    body?: SortOrder
    category?: SortOrder
    date?: SortOrder
    redirectUrl?: SortOrder
    region?: SortOrder
    origin?: SortOrder
    isAuction?: SortOrder
    auctionEnd?: SortOrder
    entryPoint?: SortOrder
  }

  export type ListingMinOrderByAggregateInput = {
    id?: SortOrder
    origin_id?: SortOrder
    title?: SortOrder
    body?: SortOrder
    category?: SortOrder
    date?: SortOrder
    redirectUrl?: SortOrder
    region?: SortOrder
    origin?: SortOrder
    isAuction?: SortOrder
    auctionEnd?: SortOrder
    entryPoint?: SortOrder
  }

  export type EnumCategoryWithAggregatesFilter = {
    equals?: Category
    in?: Enumerable<Category>
    notIn?: Enumerable<Category>
    not?: NestedEnumCategoryWithAggregatesFilter | Category
    _count?: NestedIntFilter
    _min?: NestedEnumCategoryFilter
    _max?: NestedEnumCategoryFilter
  }

  export type EnumListingOriginWithAggregatesFilter = {
    equals?: ListingOrigin
    in?: Enumerable<ListingOrigin>
    notIn?: Enumerable<ListingOrigin>
    not?: NestedEnumListingOriginWithAggregatesFilter | ListingOrigin
    _count?: NestedIntFilter
    _min?: NestedEnumListingOriginFilter
    _max?: NestedEnumListingOriginFilter
  }

  export type IntFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntFilter | number
  }

  export type EnumScraperTriggerFilter = {
    equals?: ScraperTrigger
    in?: Enumerable<ScraperTrigger>
    notIn?: Enumerable<ScraperTrigger>
    not?: NestedEnumScraperTriggerFilter | ScraperTrigger
  }

  export type ScrapingLogCountOrderByAggregateInput = {
    id?: SortOrder
    added_count?: SortOrder
    error_count?: SortOrder
    entryPoint?: SortOrder
    scrapeToId?: SortOrder
    scrapeToDate?: SortOrder
    target?: SortOrder
    triggered_by?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ScrapingLogAvgOrderByAggregateInput = {
    added_count?: SortOrder
    error_count?: SortOrder
  }

  export type ScrapingLogMaxOrderByAggregateInput = {
    id?: SortOrder
    added_count?: SortOrder
    error_count?: SortOrder
    entryPoint?: SortOrder
    scrapeToId?: SortOrder
    scrapeToDate?: SortOrder
    target?: SortOrder
    triggered_by?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ScrapingLogMinOrderByAggregateInput = {
    id?: SortOrder
    added_count?: SortOrder
    error_count?: SortOrder
    entryPoint?: SortOrder
    scrapeToId?: SortOrder
    scrapeToDate?: SortOrder
    target?: SortOrder
    triggered_by?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ScrapingLogSumOrderByAggregateInput = {
    added_count?: SortOrder
    error_count?: SortOrder
  }

  export type IntWithAggregatesFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntWithAggregatesFilter | number
    _count?: NestedIntFilter
    _avg?: NestedFloatFilter
    _sum?: NestedIntFilter
    _min?: NestedIntFilter
    _max?: NestedIntFilter
  }

  export type EnumScraperTriggerWithAggregatesFilter = {
    equals?: ScraperTrigger
    in?: Enumerable<ScraperTrigger>
    notIn?: Enumerable<ScraperTrigger>
    not?: NestedEnumScraperTriggerWithAggregatesFilter | ScraperTrigger
    _count?: NestedIntFilter
    _min?: NestedEnumScraperTriggerFilter
    _max?: NestedEnumScraperTriggerFilter
  }

  export type EnumEmailTypeFilter = {
    equals?: EmailType
    in?: Enumerable<EmailType>
    notIn?: Enumerable<EmailType>
    not?: NestedEnumEmailTypeFilter | EmailType
  }

  export type EmailRecordCountOrderByAggregateInput = {
    id?: SortOrder
    to?: SortOrder
    from?: SortOrder
    type?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
  }

  export type EmailRecordMaxOrderByAggregateInput = {
    id?: SortOrder
    to?: SortOrder
    from?: SortOrder
    type?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
  }

  export type EmailRecordMinOrderByAggregateInput = {
    id?: SortOrder
    to?: SortOrder
    from?: SortOrder
    type?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumEmailTypeWithAggregatesFilter = {
    equals?: EmailType
    in?: Enumerable<EmailType>
    notIn?: Enumerable<EmailType>
    not?: NestedEnumEmailTypeWithAggregatesFilter | EmailType
    _count?: NestedIntFilter
    _min?: NestedEnumEmailTypeFilter
    _max?: NestedEnumEmailTypeFilter
  }

  export type MetadataCreateEnvelopeInput = {
    set?: MetadataCreateInput
  }

  export type MetadataCreateInput = {
    keyword?: string | null
    region?: string | null
    categories?: MetadataCreatecategoriesInput | Enumerable<Category>
    auction?: boolean | null
    priceRangeGte?: number | null
    priceRangeLte?: number | null
    dateGte?: Date | string | null
    origins?: MetadataCreateoriginsInput | Enumerable<ListingOrigin>
  }

  export type UserWatcherCreateNestedManyWithoutWatcherInput = {
    create?: XOR<Enumerable<UserWatcherCreateWithoutWatcherInput>, Enumerable<UserWatcherUncheckedCreateWithoutWatcherInput>>
    connectOrCreate?: Enumerable<UserWatcherCreateOrConnectWithoutWatcherInput>
    createMany?: UserWatcherCreateManyWatcherInputEnvelope
    connect?: Enumerable<UserWatcherWhereUniqueInput>
  }

  export type UserWatcherUncheckedCreateNestedManyWithoutWatcherInput = {
    create?: XOR<Enumerable<UserWatcherCreateWithoutWatcherInput>, Enumerable<UserWatcherUncheckedCreateWithoutWatcherInput>>
    connectOrCreate?: Enumerable<UserWatcherCreateOrConnectWithoutWatcherInput>
    createMany?: UserWatcherCreateManyWatcherInputEnvelope
    connect?: Enumerable<UserWatcherWhereUniqueInput>
  }

  export type MetadataUpdateEnvelopeInput = {
    set?: MetadataCreateInput
    update?: MetadataUpdateInput
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type UserWatcherUpdateManyWithoutWatcherInput = {
    create?: XOR<Enumerable<UserWatcherCreateWithoutWatcherInput>, Enumerable<UserWatcherUncheckedCreateWithoutWatcherInput>>
    connectOrCreate?: Enumerable<UserWatcherCreateOrConnectWithoutWatcherInput>
    upsert?: Enumerable<UserWatcherUpsertWithWhereUniqueWithoutWatcherInput>
    createMany?: UserWatcherCreateManyWatcherInputEnvelope
    set?: Enumerable<UserWatcherWhereUniqueInput>
    disconnect?: Enumerable<UserWatcherWhereUniqueInput>
    delete?: Enumerable<UserWatcherWhereUniqueInput>
    connect?: Enumerable<UserWatcherWhereUniqueInput>
    update?: Enumerable<UserWatcherUpdateWithWhereUniqueWithoutWatcherInput>
    updateMany?: Enumerable<UserWatcherUpdateManyWithWhereWithoutWatcherInput>
    deleteMany?: Enumerable<UserWatcherScalarWhereInput>
  }

  export type UserWatcherUncheckedUpdateManyWithoutWatcherInput = {
    create?: XOR<Enumerable<UserWatcherCreateWithoutWatcherInput>, Enumerable<UserWatcherUncheckedCreateWithoutWatcherInput>>
    connectOrCreate?: Enumerable<UserWatcherCreateOrConnectWithoutWatcherInput>
    upsert?: Enumerable<UserWatcherUpsertWithWhereUniqueWithoutWatcherInput>
    createMany?: UserWatcherCreateManyWatcherInputEnvelope
    set?: Enumerable<UserWatcherWhereUniqueInput>
    disconnect?: Enumerable<UserWatcherWhereUniqueInput>
    delete?: Enumerable<UserWatcherWhereUniqueInput>
    connect?: Enumerable<UserWatcherWhereUniqueInput>
    update?: Enumerable<UserWatcherUpdateWithWhereUniqueWithoutWatcherInput>
    updateMany?: Enumerable<UserWatcherUpdateManyWithWhereWithoutWatcherInput>
    deleteMany?: Enumerable<UserWatcherScalarWhereInput>
  }

  export type WatcherCreateNestedOneWithoutUserWatcherInput = {
    create?: XOR<WatcherCreateWithoutUserWatcherInput, WatcherUncheckedCreateWithoutUserWatcherInput>
    connectOrCreate?: WatcherCreateOrConnectWithoutUserWatcherInput
    connect?: WatcherWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutWatchersInput = {
    create?: XOR<UserCreateWithoutWatchersInput, UserUncheckedCreateWithoutWatchersInput>
    connectOrCreate?: UserCreateOrConnectWithoutWatchersInput
    connect?: UserWhereUniqueInput
  }

  export type WatcherUpdateOneRequiredWithoutUserWatcherInput = {
    create?: XOR<WatcherCreateWithoutUserWatcherInput, WatcherUncheckedCreateWithoutUserWatcherInput>
    connectOrCreate?: WatcherCreateOrConnectWithoutUserWatcherInput
    upsert?: WatcherUpsertWithoutUserWatcherInput
    connect?: WatcherWhereUniqueInput
    update?: XOR<WatcherUpdateWithoutUserWatcherInput, WatcherUncheckedUpdateWithoutUserWatcherInput>
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
    unset?: boolean
  }

  export type UserUpdateOneRequiredWithoutWatchersInput = {
    create?: XOR<UserCreateWithoutWatchersInput, UserUncheckedCreateWithoutWatchersInput>
    connectOrCreate?: UserCreateOrConnectWithoutWatchersInput
    upsert?: UserUpsertWithoutWatchersInput
    connect?: UserWhereUniqueInput
    update?: XOR<UserUpdateWithoutWatchersInput, UserUncheckedUpdateWithoutWatchersInput>
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type PasswordResetNullableCreateEnvelopeInput = {
    set?: PasswordResetCreateInput | null
  }

  export type PasswordResetCreateInput = {
    tokenHash: string
    expiration: number
  }

  export type EmailUpdateNullableCreateEnvelopeInput = {
    set?: EmailUpdateCreateInput | null
  }

  export type EmailUpdateCreateInput = {
    newEmail: string
    tokenHash: string
    expiration: Date | string
  }

  export type UserWatcherCreateNestedManyWithoutUserInput = {
    create?: XOR<Enumerable<UserWatcherCreateWithoutUserInput>, Enumerable<UserWatcherUncheckedCreateWithoutUserInput>>
    connectOrCreate?: Enumerable<UserWatcherCreateOrConnectWithoutUserInput>
    createMany?: UserWatcherCreateManyUserInputEnvelope
    connect?: Enumerable<UserWatcherWhereUniqueInput>
  }

  export type UserCreaterolesInput = {
    set: Enumerable<Role>
  }

  export type UserCreatelikedListingIDsInput = {
    set: Enumerable<string>
  }

  export type ListingCreateNestedManyWithoutLikedByInput = {
    create?: XOR<Enumerable<ListingCreateWithoutLikedByInput>, Enumerable<ListingUncheckedCreateWithoutLikedByInput>>
    connectOrCreate?: Enumerable<ListingCreateOrConnectWithoutLikedByInput>
    connect?: Enumerable<ListingWhereUniqueInput>
  }

  export type EmailRecordCreateNestedManyWithoutUserInput = {
    create?: XOR<Enumerable<EmailRecordCreateWithoutUserInput>, Enumerable<EmailRecordUncheckedCreateWithoutUserInput>>
    connectOrCreate?: Enumerable<EmailRecordCreateOrConnectWithoutUserInput>
    createMany?: EmailRecordCreateManyUserInputEnvelope
    connect?: Enumerable<EmailRecordWhereUniqueInput>
  }

  export type UserWatcherUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<Enumerable<UserWatcherCreateWithoutUserInput>, Enumerable<UserWatcherUncheckedCreateWithoutUserInput>>
    connectOrCreate?: Enumerable<UserWatcherCreateOrConnectWithoutUserInput>
    createMany?: UserWatcherCreateManyUserInputEnvelope
    connect?: Enumerable<UserWatcherWhereUniqueInput>
  }

  export type ListingUncheckedCreateNestedManyWithoutLikedByInput = {
    create?: XOR<Enumerable<ListingCreateWithoutLikedByInput>, Enumerable<ListingUncheckedCreateWithoutLikedByInput>>
    connectOrCreate?: Enumerable<ListingCreateOrConnectWithoutLikedByInput>
    connect?: Enumerable<ListingWhereUniqueInput>
  }

  export type EmailRecordUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<Enumerable<EmailRecordCreateWithoutUserInput>, Enumerable<EmailRecordUncheckedCreateWithoutUserInput>>
    connectOrCreate?: Enumerable<EmailRecordCreateOrConnectWithoutUserInput>
    createMany?: EmailRecordCreateManyUserInputEnvelope
    connect?: Enumerable<EmailRecordWhereUniqueInput>
  }

  export type PasswordResetNullableUpdateEnvelopeInput = {
    set?: PasswordResetCreateInput | null
    upsert?: PasswordResetUpsertInput
    unset?: boolean
  }

  export type EmailUpdateNullableUpdateEnvelopeInput = {
    set?: EmailUpdateCreateInput | null
    upsert?: EmailUpdateUpsertInput
    unset?: boolean
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
    unset?: boolean
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type UserWatcherUpdateManyWithoutUserInput = {
    create?: XOR<Enumerable<UserWatcherCreateWithoutUserInput>, Enumerable<UserWatcherUncheckedCreateWithoutUserInput>>
    connectOrCreate?: Enumerable<UserWatcherCreateOrConnectWithoutUserInput>
    upsert?: Enumerable<UserWatcherUpsertWithWhereUniqueWithoutUserInput>
    createMany?: UserWatcherCreateManyUserInputEnvelope
    set?: Enumerable<UserWatcherWhereUniqueInput>
    disconnect?: Enumerable<UserWatcherWhereUniqueInput>
    delete?: Enumerable<UserWatcherWhereUniqueInput>
    connect?: Enumerable<UserWatcherWhereUniqueInput>
    update?: Enumerable<UserWatcherUpdateWithWhereUniqueWithoutUserInput>
    updateMany?: Enumerable<UserWatcherUpdateManyWithWhereWithoutUserInput>
    deleteMany?: Enumerable<UserWatcherScalarWhereInput>
  }

  export type UserUpdaterolesInput = {
    set?: Enumerable<Role>
    push?: Enumerable<Role>
  }

  export type EnumLoginStrategyFieldUpdateOperationsInput = {
    set?: LoginStrategy
  }

  export type UserUpdatelikedListingIDsInput = {
    set?: Enumerable<string>
    push?: string | Enumerable<string>
  }

  export type ListingUpdateManyWithoutLikedByInput = {
    create?: XOR<Enumerable<ListingCreateWithoutLikedByInput>, Enumerable<ListingUncheckedCreateWithoutLikedByInput>>
    connectOrCreate?: Enumerable<ListingCreateOrConnectWithoutLikedByInput>
    upsert?: Enumerable<ListingUpsertWithWhereUniqueWithoutLikedByInput>
    set?: Enumerable<ListingWhereUniqueInput>
    disconnect?: Enumerable<ListingWhereUniqueInput>
    delete?: Enumerable<ListingWhereUniqueInput>
    connect?: Enumerable<ListingWhereUniqueInput>
    update?: Enumerable<ListingUpdateWithWhereUniqueWithoutLikedByInput>
    updateMany?: Enumerable<ListingUpdateManyWithWhereWithoutLikedByInput>
    deleteMany?: Enumerable<ListingScalarWhereInput>
  }

  export type EmailRecordUpdateManyWithoutUserInput = {
    create?: XOR<Enumerable<EmailRecordCreateWithoutUserInput>, Enumerable<EmailRecordUncheckedCreateWithoutUserInput>>
    connectOrCreate?: Enumerable<EmailRecordCreateOrConnectWithoutUserInput>
    upsert?: Enumerable<EmailRecordUpsertWithWhereUniqueWithoutUserInput>
    createMany?: EmailRecordCreateManyUserInputEnvelope
    set?: Enumerable<EmailRecordWhereUniqueInput>
    disconnect?: Enumerable<EmailRecordWhereUniqueInput>
    delete?: Enumerable<EmailRecordWhereUniqueInput>
    connect?: Enumerable<EmailRecordWhereUniqueInput>
    update?: Enumerable<EmailRecordUpdateWithWhereUniqueWithoutUserInput>
    updateMany?: Enumerable<EmailRecordUpdateManyWithWhereWithoutUserInput>
    deleteMany?: Enumerable<EmailRecordScalarWhereInput>
  }

  export type UserWatcherUncheckedUpdateManyWithoutUserInput = {
    create?: XOR<Enumerable<UserWatcherCreateWithoutUserInput>, Enumerable<UserWatcherUncheckedCreateWithoutUserInput>>
    connectOrCreate?: Enumerable<UserWatcherCreateOrConnectWithoutUserInput>
    upsert?: Enumerable<UserWatcherUpsertWithWhereUniqueWithoutUserInput>
    createMany?: UserWatcherCreateManyUserInputEnvelope
    set?: Enumerable<UserWatcherWhereUniqueInput>
    disconnect?: Enumerable<UserWatcherWhereUniqueInput>
    delete?: Enumerable<UserWatcherWhereUniqueInput>
    connect?: Enumerable<UserWatcherWhereUniqueInput>
    update?: Enumerable<UserWatcherUpdateWithWhereUniqueWithoutUserInput>
    updateMany?: Enumerable<UserWatcherUpdateManyWithWhereWithoutUserInput>
    deleteMany?: Enumerable<UserWatcherScalarWhereInput>
  }

  export type ListingUncheckedUpdateManyWithoutLikedByInput = {
    create?: XOR<Enumerable<ListingCreateWithoutLikedByInput>, Enumerable<ListingUncheckedCreateWithoutLikedByInput>>
    connectOrCreate?: Enumerable<ListingCreateOrConnectWithoutLikedByInput>
    upsert?: Enumerable<ListingUpsertWithWhereUniqueWithoutLikedByInput>
    set?: Enumerable<ListingWhereUniqueInput>
    disconnect?: Enumerable<ListingWhereUniqueInput>
    delete?: Enumerable<ListingWhereUniqueInput>
    connect?: Enumerable<ListingWhereUniqueInput>
    update?: Enumerable<ListingUpdateWithWhereUniqueWithoutLikedByInput>
    updateMany?: Enumerable<ListingUpdateManyWithWhereWithoutLikedByInput>
    deleteMany?: Enumerable<ListingScalarWhereInput>
  }

  export type EmailRecordUncheckedUpdateManyWithoutUserInput = {
    create?: XOR<Enumerable<EmailRecordCreateWithoutUserInput>, Enumerable<EmailRecordUncheckedCreateWithoutUserInput>>
    connectOrCreate?: Enumerable<EmailRecordCreateOrConnectWithoutUserInput>
    upsert?: Enumerable<EmailRecordUpsertWithWhereUniqueWithoutUserInput>
    createMany?: EmailRecordCreateManyUserInputEnvelope
    set?: Enumerable<EmailRecordWhereUniqueInput>
    disconnect?: Enumerable<EmailRecordWhereUniqueInput>
    delete?: Enumerable<EmailRecordWhereUniqueInput>
    connect?: Enumerable<EmailRecordWhereUniqueInput>
    update?: Enumerable<EmailRecordUpdateWithWhereUniqueWithoutUserInput>
    updateMany?: Enumerable<EmailRecordUpdateManyWithWhereWithoutUserInput>
    deleteMany?: Enumerable<EmailRecordScalarWhereInput>
  }

  export type PriceNullableCreateEnvelopeInput = {
    set?: PriceCreateInput | null
  }

  export type PriceCreateInput = {
    value: number
    currency: Currency
  }

  export type ParamaterListCreateEnvelopeInput = {
    set?: Enumerable<ParamaterCreateInput>
  }

  export type ParamaterCreateInput = {
    label: string
    value: string
  }

  export type ListingCreateimageUrlInput = {
    set: Enumerable<string>
  }

  export type ListingCreatelikedByUserIDsInput = {
    set: Enumerable<string>
  }

  export type UserCreateNestedManyWithoutLikedListingsInput = {
    create?: XOR<Enumerable<UserCreateWithoutLikedListingsInput>, Enumerable<UserUncheckedCreateWithoutLikedListingsInput>>
    connectOrCreate?: Enumerable<UserCreateOrConnectWithoutLikedListingsInput>
    connect?: Enumerable<UserWhereUniqueInput>
  }

  export type UserUncheckedCreateNestedManyWithoutLikedListingsInput = {
    create?: XOR<Enumerable<UserCreateWithoutLikedListingsInput>, Enumerable<UserUncheckedCreateWithoutLikedListingsInput>>
    connectOrCreate?: Enumerable<UserCreateOrConnectWithoutLikedListingsInput>
    connect?: Enumerable<UserWhereUniqueInput>
  }

  export type PriceNullableUpdateEnvelopeInput = {
    set?: PriceCreateInput | null
    upsert?: PriceUpsertInput
    unset?: boolean
  }

  export type ParamaterListUpdateEnvelopeInput = {
    set?: Enumerable<ParamaterCreateInput>
    push?: Enumerable<ParamaterCreateInput>
    updateMany?: ParamaterUpdateManyInput
    deleteMany?: ParamaterDeleteManyInput
  }

  export type EnumCategoryFieldUpdateOperationsInput = {
    set?: Category
  }

  export type ListingUpdateimageUrlInput = {
    set?: Enumerable<string>
    push?: string | Enumerable<string>
  }

  export type EnumListingOriginFieldUpdateOperationsInput = {
    set?: ListingOrigin
  }

  export type ListingUpdatelikedByUserIDsInput = {
    set?: Enumerable<string>
    push?: string | Enumerable<string>
  }

  export type UserUpdateManyWithoutLikedListingsInput = {
    create?: XOR<Enumerable<UserCreateWithoutLikedListingsInput>, Enumerable<UserUncheckedCreateWithoutLikedListingsInput>>
    connectOrCreate?: Enumerable<UserCreateOrConnectWithoutLikedListingsInput>
    upsert?: Enumerable<UserUpsertWithWhereUniqueWithoutLikedListingsInput>
    set?: Enumerable<UserWhereUniqueInput>
    disconnect?: Enumerable<UserWhereUniqueInput>
    delete?: Enumerable<UserWhereUniqueInput>
    connect?: Enumerable<UserWhereUniqueInput>
    update?: Enumerable<UserUpdateWithWhereUniqueWithoutLikedListingsInput>
    updateMany?: Enumerable<UserUpdateManyWithWhereWithoutLikedListingsInput>
    deleteMany?: Enumerable<UserScalarWhereInput>
  }

  export type UserUncheckedUpdateManyWithoutLikedListingsInput = {
    create?: XOR<Enumerable<UserCreateWithoutLikedListingsInput>, Enumerable<UserUncheckedCreateWithoutLikedListingsInput>>
    connectOrCreate?: Enumerable<UserCreateOrConnectWithoutLikedListingsInput>
    upsert?: Enumerable<UserUpsertWithWhereUniqueWithoutLikedListingsInput>
    set?: Enumerable<UserWhereUniqueInput>
    disconnect?: Enumerable<UserWhereUniqueInput>
    delete?: Enumerable<UserWhereUniqueInput>
    connect?: Enumerable<UserWhereUniqueInput>
    update?: Enumerable<UserUpdateWithWhereUniqueWithoutLikedListingsInput>
    updateMany?: Enumerable<UserUpdateManyWithWhereWithoutLikedListingsInput>
    deleteMany?: Enumerable<UserScalarWhereInput>
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumScraperTriggerFieldUpdateOperationsInput = {
    set?: ScraperTrigger
  }

  export type UserCreateNestedOneWithoutEmailRecordInput = {
    create?: XOR<UserCreateWithoutEmailRecordInput, UserUncheckedCreateWithoutEmailRecordInput>
    connectOrCreate?: UserCreateOrConnectWithoutEmailRecordInput
    connect?: UserWhereUniqueInput
  }

  export type EnumEmailTypeFieldUpdateOperationsInput = {
    set?: EmailType
  }

  export type UserUpdateOneWithoutEmailRecordInput = {
    create?: XOR<UserCreateWithoutEmailRecordInput, UserUncheckedCreateWithoutEmailRecordInput>
    connectOrCreate?: UserCreateOrConnectWithoutEmailRecordInput
    upsert?: UserUpsertWithoutEmailRecordInput
    disconnect?: boolean
    delete?: boolean
    connect?: UserWhereUniqueInput
    update?: XOR<UserUpdateWithoutEmailRecordInput, UserUncheckedUpdateWithoutEmailRecordInput>
  }

  export type MetadataWhereInput = {
    AND?: Enumerable<MetadataWhereInput>
    OR?: Enumerable<MetadataWhereInput>
    NOT?: Enumerable<MetadataWhereInput>
    keyword?: StringNullableFilter | string | null
    region?: StringNullableFilter | string | null
    categories?: EnumCategoryNullableListFilter
    auction?: BoolNullableFilter | boolean | null
    priceRangeGte?: IntNullableFilter | number | null
    priceRangeLte?: IntNullableFilter | number | null
    dateGte?: DateTimeNullableFilter | Date | string | null
    origins?: EnumListingOriginNullableListFilter
  }

  export type NestedStringFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringFilter | string
  }

  export type NestedDateTimeFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string>
    notIn?: Enumerable<Date> | Enumerable<string>
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeFilter | Date | string
  }

  export type NestedStringWithAggregatesFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringWithAggregatesFilter | string
    _count?: NestedIntFilter
    _min?: NestedStringFilter
    _max?: NestedStringFilter
  }

  export type NestedIntFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntFilter | number
  }

  export type NestedDateTimeWithAggregatesFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string>
    notIn?: Enumerable<Date> | Enumerable<string>
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeWithAggregatesFilter | Date | string
    _count?: NestedIntFilter
    _min?: NestedDateTimeFilter
    _max?: NestedDateTimeFilter
  }

  export type NestedDateTimeNullableFilter = {
    equals?: Date | string | null
    in?: Enumerable<Date> | Enumerable<string> | null
    notIn?: Enumerable<Date> | Enumerable<string> | null
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeNullableFilter | Date | string | null
    isSet?: boolean
  }

  export type NestedDateTimeNullableWithAggregatesFilter = {
    equals?: Date | string | null
    in?: Enumerable<Date> | Enumerable<string> | null
    notIn?: Enumerable<Date> | Enumerable<string> | null
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeNullableWithAggregatesFilter | Date | string | null
    _count?: NestedIntNullableFilter
    _min?: NestedDateTimeNullableFilter
    _max?: NestedDateTimeNullableFilter
    isSet?: boolean
  }

  export type NestedIntNullableFilter = {
    equals?: number | null
    in?: Enumerable<number> | null
    notIn?: Enumerable<number> | null
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntNullableFilter | number | null
    isSet?: boolean
  }

  export type PasswordResetWhereInput = {
    AND?: Enumerable<PasswordResetWhereInput>
    OR?: Enumerable<PasswordResetWhereInput>
    NOT?: Enumerable<PasswordResetWhereInput>
    tokenHash?: StringFilter | string
    expiration?: IntFilter | number
  }

  export type EmailUpdateWhereInput = {
    AND?: Enumerable<EmailUpdateWhereInput>
    OR?: Enumerable<EmailUpdateWhereInput>
    NOT?: Enumerable<EmailUpdateWhereInput>
    newEmail?: StringFilter | string
    tokenHash?: StringFilter | string
    expiration?: DateTimeFilter | Date | string
  }

  export type NestedStringNullableFilter = {
    equals?: string | null
    in?: Enumerable<string> | null
    notIn?: Enumerable<string> | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringNullableFilter | string | null
    isSet?: boolean
  }

  export type NestedBoolFilter = {
    equals?: boolean
    not?: NestedBoolFilter | boolean
  }

  export type NestedEnumLoginStrategyFilter = {
    equals?: LoginStrategy
    in?: Enumerable<LoginStrategy>
    notIn?: Enumerable<LoginStrategy>
    not?: NestedEnumLoginStrategyFilter | LoginStrategy
  }

  export type NestedStringNullableWithAggregatesFilter = {
    equals?: string | null
    in?: Enumerable<string> | null
    notIn?: Enumerable<string> | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringNullableWithAggregatesFilter | string | null
    _count?: NestedIntNullableFilter
    _min?: NestedStringNullableFilter
    _max?: NestedStringNullableFilter
    isSet?: boolean
  }

  export type NestedBoolWithAggregatesFilter = {
    equals?: boolean
    not?: NestedBoolWithAggregatesFilter | boolean
    _count?: NestedIntFilter
    _min?: NestedBoolFilter
    _max?: NestedBoolFilter
  }

  export type NestedEnumLoginStrategyWithAggregatesFilter = {
    equals?: LoginStrategy
    in?: Enumerable<LoginStrategy>
    notIn?: Enumerable<LoginStrategy>
    not?: NestedEnumLoginStrategyWithAggregatesFilter | LoginStrategy
    _count?: NestedIntFilter
    _min?: NestedEnumLoginStrategyFilter
    _max?: NestedEnumLoginStrategyFilter
  }

  export type PriceWhereInput = {
    AND?: Enumerable<PriceWhereInput>
    OR?: Enumerable<PriceWhereInput>
    NOT?: Enumerable<PriceWhereInput>
    value?: IntFilter | number
    currency?: EnumCurrencyFilter | Currency
  }

  export type ParamaterWhereInput = {
    AND?: Enumerable<ParamaterWhereInput>
    OR?: Enumerable<ParamaterWhereInput>
    NOT?: Enumerable<ParamaterWhereInput>
    label?: StringFilter | string
    value?: StringFilter | string
  }

  export type NestedEnumCategoryFilter = {
    equals?: Category
    in?: Enumerable<Category>
    notIn?: Enumerable<Category>
    not?: NestedEnumCategoryFilter | Category
  }

  export type NestedEnumListingOriginFilter = {
    equals?: ListingOrigin
    in?: Enumerable<ListingOrigin>
    notIn?: Enumerable<ListingOrigin>
    not?: NestedEnumListingOriginFilter | ListingOrigin
  }

  export type NestedEnumCategoryWithAggregatesFilter = {
    equals?: Category
    in?: Enumerable<Category>
    notIn?: Enumerable<Category>
    not?: NestedEnumCategoryWithAggregatesFilter | Category
    _count?: NestedIntFilter
    _min?: NestedEnumCategoryFilter
    _max?: NestedEnumCategoryFilter
  }

  export type NestedEnumListingOriginWithAggregatesFilter = {
    equals?: ListingOrigin
    in?: Enumerable<ListingOrigin>
    notIn?: Enumerable<ListingOrigin>
    not?: NestedEnumListingOriginWithAggregatesFilter | ListingOrigin
    _count?: NestedIntFilter
    _min?: NestedEnumListingOriginFilter
    _max?: NestedEnumListingOriginFilter
  }

  export type NestedEnumScraperTriggerFilter = {
    equals?: ScraperTrigger
    in?: Enumerable<ScraperTrigger>
    notIn?: Enumerable<ScraperTrigger>
    not?: NestedEnumScraperTriggerFilter | ScraperTrigger
  }

  export type NestedIntWithAggregatesFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntWithAggregatesFilter | number
    _count?: NestedIntFilter
    _avg?: NestedFloatFilter
    _sum?: NestedIntFilter
    _min?: NestedIntFilter
    _max?: NestedIntFilter
  }

  export type NestedFloatFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedFloatFilter | number
  }

  export type NestedEnumScraperTriggerWithAggregatesFilter = {
    equals?: ScraperTrigger
    in?: Enumerable<ScraperTrigger>
    notIn?: Enumerable<ScraperTrigger>
    not?: NestedEnumScraperTriggerWithAggregatesFilter | ScraperTrigger
    _count?: NestedIntFilter
    _min?: NestedEnumScraperTriggerFilter
    _max?: NestedEnumScraperTriggerFilter
  }

  export type NestedEnumEmailTypeFilter = {
    equals?: EmailType
    in?: Enumerable<EmailType>
    notIn?: Enumerable<EmailType>
    not?: NestedEnumEmailTypeFilter | EmailType
  }

  export type NestedEnumEmailTypeWithAggregatesFilter = {
    equals?: EmailType
    in?: Enumerable<EmailType>
    notIn?: Enumerable<EmailType>
    not?: NestedEnumEmailTypeWithAggregatesFilter | EmailType
    _count?: NestedIntFilter
    _min?: NestedEnumEmailTypeFilter
    _max?: NestedEnumEmailTypeFilter
  }

  export type MetadataCreatecategoriesInput = {
    set: Enumerable<Category>
  }

  export type MetadataCreateoriginsInput = {
    set: Enumerable<ListingOrigin>
  }

  export type UserWatcherCreateWithoutWatcherInput = {
    id?: string
    notifiedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutWatchersInput
  }

  export type UserWatcherUncheckedCreateWithoutWatcherInput = {
    id?: string
    notifiedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
  }

  export type UserWatcherCreateOrConnectWithoutWatcherInput = {
    where: UserWatcherWhereUniqueInput
    create: XOR<UserWatcherCreateWithoutWatcherInput, UserWatcherUncheckedCreateWithoutWatcherInput>
  }

  export type UserWatcherCreateManyWatcherInputEnvelope = {
    data: Enumerable<UserWatcherCreateManyWatcherInput>
  }

  export type MetadataUpdateInput = {
    keyword?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    categories?: MetadataUpdatecategoriesInput | Enumerable<Category>
    auction?: NullableBoolFieldUpdateOperationsInput | boolean | null
    priceRangeGte?: NullableIntFieldUpdateOperationsInput | number | null
    priceRangeLte?: NullableIntFieldUpdateOperationsInput | number | null
    dateGte?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    origins?: MetadataUpdateoriginsInput | Enumerable<ListingOrigin>
  }

  export type UserWatcherUpsertWithWhereUniqueWithoutWatcherInput = {
    where: UserWatcherWhereUniqueInput
    update: XOR<UserWatcherUpdateWithoutWatcherInput, UserWatcherUncheckedUpdateWithoutWatcherInput>
    create: XOR<UserWatcherCreateWithoutWatcherInput, UserWatcherUncheckedCreateWithoutWatcherInput>
  }

  export type UserWatcherUpdateWithWhereUniqueWithoutWatcherInput = {
    where: UserWatcherWhereUniqueInput
    data: XOR<UserWatcherUpdateWithoutWatcherInput, UserWatcherUncheckedUpdateWithoutWatcherInput>
  }

  export type UserWatcherUpdateManyWithWhereWithoutWatcherInput = {
    where: UserWatcherScalarWhereInput
    data: XOR<UserWatcherUpdateManyMutationInput, UserWatcherUncheckedUpdateManyWithoutUserWatcherInput>
  }

  export type UserWatcherScalarWhereInput = {
    AND?: Enumerable<UserWatcherScalarWhereInput>
    OR?: Enumerable<UserWatcherScalarWhereInput>
    NOT?: Enumerable<UserWatcherScalarWhereInput>
    id?: StringFilter | string
    watcherId?: StringFilter | string
    notifiedAt?: DateTimeNullableFilter | Date | string | null
    createdAt?: DateTimeFilter | Date | string
    updatedAt?: DateTimeFilter | Date | string
    userId?: StringFilter | string
  }

  export type WatcherCreateWithoutUserWatcherInput = {
    metadata: XOR<MetadataCreateEnvelopeInput, MetadataCreateInput>
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WatcherUncheckedCreateWithoutUserWatcherInput = {
    metadata: XOR<MetadataCreateEnvelopeInput, MetadataCreateInput>
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WatcherCreateOrConnectWithoutUserWatcherInput = {
    where: WatcherWhereUniqueInput
    create: XOR<WatcherCreateWithoutUserWatcherInput, WatcherUncheckedCreateWithoutUserWatcherInput>
  }

  export type UserCreateWithoutWatchersInput = {
    passwordReset?: XOR<PasswordResetNullableCreateEnvelopeInput, PasswordResetCreateInput> | null
    emailUpdate?: XOR<EmailUpdateNullableCreateEnvelopeInput, EmailUpdateCreateInput> | null
    id?: string
    email: string
    password?: string | null
    premium?: boolean
    roles?: UserCreaterolesInput | Enumerable<Role>
    loginStrategy?: LoginStrategy
    likedListingIDs?: UserCreatelikedListingIDsInput | Enumerable<string>
    likedListings?: ListingCreateNestedManyWithoutLikedByInput
    EmailRecord?: EmailRecordCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutWatchersInput = {
    passwordReset?: XOR<PasswordResetNullableCreateEnvelopeInput, PasswordResetCreateInput> | null
    emailUpdate?: XOR<EmailUpdateNullableCreateEnvelopeInput, EmailUpdateCreateInput> | null
    id?: string
    email: string
    password?: string | null
    premium?: boolean
    roles?: UserCreaterolesInput | Enumerable<Role>
    loginStrategy?: LoginStrategy
    likedListingIDs?: UserCreatelikedListingIDsInput | Enumerable<string>
    likedListings?: ListingUncheckedCreateNestedManyWithoutLikedByInput
    EmailRecord?: EmailRecordUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutWatchersInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutWatchersInput, UserUncheckedCreateWithoutWatchersInput>
  }

  export type WatcherUpsertWithoutUserWatcherInput = {
    update: XOR<WatcherUpdateWithoutUserWatcherInput, WatcherUncheckedUpdateWithoutUserWatcherInput>
    create: XOR<WatcherCreateWithoutUserWatcherInput, WatcherUncheckedCreateWithoutUserWatcherInput>
  }

  export type WatcherUpdateWithoutUserWatcherInput = {
    metadata?: XOR<MetadataUpdateEnvelopeInput, MetadataCreateInput>
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WatcherUncheckedUpdateWithoutUserWatcherInput = {
    metadata?: XOR<MetadataUpdateEnvelopeInput, MetadataCreateInput>
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUpsertWithoutWatchersInput = {
    update: XOR<UserUpdateWithoutWatchersInput, UserUncheckedUpdateWithoutWatchersInput>
    create: XOR<UserCreateWithoutWatchersInput, UserUncheckedCreateWithoutWatchersInput>
  }

  export type UserUpdateWithoutWatchersInput = {
    passwordReset?: XOR<PasswordResetNullableUpdateEnvelopeInput, PasswordResetCreateInput> | null
    emailUpdate?: XOR<EmailUpdateNullableUpdateEnvelopeInput, EmailUpdateCreateInput> | null
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    premium?: BoolFieldUpdateOperationsInput | boolean
    roles?: UserUpdaterolesInput | Enumerable<Role>
    loginStrategy?: EnumLoginStrategyFieldUpdateOperationsInput | LoginStrategy
    likedListingIDs?: UserUpdatelikedListingIDsInput | Enumerable<string>
    likedListings?: ListingUpdateManyWithoutLikedByInput
    EmailRecord?: EmailRecordUpdateManyWithoutUserInput
  }

  export type UserUncheckedUpdateWithoutWatchersInput = {
    passwordReset?: XOR<PasswordResetNullableUpdateEnvelopeInput, PasswordResetCreateInput> | null
    emailUpdate?: XOR<EmailUpdateNullableUpdateEnvelopeInput, EmailUpdateCreateInput> | null
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    premium?: BoolFieldUpdateOperationsInput | boolean
    roles?: UserUpdaterolesInput | Enumerable<Role>
    loginStrategy?: EnumLoginStrategyFieldUpdateOperationsInput | LoginStrategy
    likedListingIDs?: UserUpdatelikedListingIDsInput | Enumerable<string>
    likedListings?: ListingUncheckedUpdateManyWithoutLikedByInput
    EmailRecord?: EmailRecordUncheckedUpdateManyWithoutUserInput
  }

  export type UserWatcherCreateWithoutUserInput = {
    id?: string
    watcher: WatcherCreateNestedOneWithoutUserWatcherInput
    notifiedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserWatcherUncheckedCreateWithoutUserInput = {
    id?: string
    watcherId: string
    notifiedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserWatcherCreateOrConnectWithoutUserInput = {
    where: UserWatcherWhereUniqueInput
    create: XOR<UserWatcherCreateWithoutUserInput, UserWatcherUncheckedCreateWithoutUserInput>
  }

  export type UserWatcherCreateManyUserInputEnvelope = {
    data: Enumerable<UserWatcherCreateManyUserInput>
  }

  export type ListingCreateWithoutLikedByInput = {
    price?: XOR<PriceNullableCreateEnvelopeInput, PriceCreateInput> | null
    parameters?: XOR<ParamaterListCreateEnvelopeInput, Enumerable<ParamaterCreateInput>>
    id?: string
    origin_id: string
    title: string
    body?: string | null
    category: Category
    date?: Date | string
    redirectUrl: string
    imageUrl?: ListingCreateimageUrlInput | Enumerable<string>
    region?: string | null
    origin: ListingOrigin
    isAuction?: boolean
    auctionEnd?: Date | string | null
    likedByUserIDs?: ListingCreatelikedByUserIDsInput | Enumerable<string>
    entryPoint: string
  }

  export type ListingUncheckedCreateWithoutLikedByInput = {
    price?: XOR<PriceNullableCreateEnvelopeInput, PriceCreateInput> | null
    parameters?: XOR<ParamaterListCreateEnvelopeInput, Enumerable<ParamaterCreateInput>>
    id?: string
    origin_id: string
    title: string
    body?: string | null
    category: Category
    date?: Date | string
    redirectUrl: string
    imageUrl?: ListingCreateimageUrlInput | Enumerable<string>
    region?: string | null
    origin: ListingOrigin
    isAuction?: boolean
    auctionEnd?: Date | string | null
    likedByUserIDs?: ListingCreatelikedByUserIDsInput | Enumerable<string>
    entryPoint: string
  }

  export type ListingCreateOrConnectWithoutLikedByInput = {
    where: ListingWhereUniqueInput
    create: XOR<ListingCreateWithoutLikedByInput, ListingUncheckedCreateWithoutLikedByInput>
  }

  export type EmailRecordCreateWithoutUserInput = {
    id?: string
    to: string
    from: string
    type: EmailType
    createdAt?: Date | string
  }

  export type EmailRecordUncheckedCreateWithoutUserInput = {
    id?: string
    to: string
    from: string
    type: EmailType
    createdAt?: Date | string
  }

  export type EmailRecordCreateOrConnectWithoutUserInput = {
    where: EmailRecordWhereUniqueInput
    create: XOR<EmailRecordCreateWithoutUserInput, EmailRecordUncheckedCreateWithoutUserInput>
  }

  export type EmailRecordCreateManyUserInputEnvelope = {
    data: Enumerable<EmailRecordCreateManyUserInput>
  }

  export type PasswordResetUpsertInput = {
    set: PasswordResetCreateInput | null
    update: PasswordResetUpdateInput
  }

  export type EmailUpdateUpsertInput = {
    set: EmailUpdateCreateInput | null
    update: EmailUpdateUpdateInput
  }

  export type UserWatcherUpsertWithWhereUniqueWithoutUserInput = {
    where: UserWatcherWhereUniqueInput
    update: XOR<UserWatcherUpdateWithoutUserInput, UserWatcherUncheckedUpdateWithoutUserInput>
    create: XOR<UserWatcherCreateWithoutUserInput, UserWatcherUncheckedCreateWithoutUserInput>
  }

  export type UserWatcherUpdateWithWhereUniqueWithoutUserInput = {
    where: UserWatcherWhereUniqueInput
    data: XOR<UserWatcherUpdateWithoutUserInput, UserWatcherUncheckedUpdateWithoutUserInput>
  }

  export type UserWatcherUpdateManyWithWhereWithoutUserInput = {
    where: UserWatcherScalarWhereInput
    data: XOR<UserWatcherUpdateManyMutationInput, UserWatcherUncheckedUpdateManyWithoutWatchersInput>
  }

  export type ListingUpsertWithWhereUniqueWithoutLikedByInput = {
    where: ListingWhereUniqueInput
    update: XOR<ListingUpdateWithoutLikedByInput, ListingUncheckedUpdateWithoutLikedByInput>
    create: XOR<ListingCreateWithoutLikedByInput, ListingUncheckedCreateWithoutLikedByInput>
  }

  export type ListingUpdateWithWhereUniqueWithoutLikedByInput = {
    where: ListingWhereUniqueInput
    data: XOR<ListingUpdateWithoutLikedByInput, ListingUncheckedUpdateWithoutLikedByInput>
  }

  export type ListingUpdateManyWithWhereWithoutLikedByInput = {
    where: ListingScalarWhereInput
    data: XOR<ListingUpdateManyMutationInput, ListingUncheckedUpdateManyWithoutLikedListingsInput>
  }

  export type ListingScalarWhereInput = {
    AND?: Enumerable<ListingScalarWhereInput>
    OR?: Enumerable<ListingScalarWhereInput>
    NOT?: Enumerable<ListingScalarWhereInput>
    id?: StringFilter | string
    origin_id?: StringFilter | string
    title?: StringFilter | string
    body?: StringNullableFilter | string | null
    category?: EnumCategoryFilter | Category
    date?: DateTimeFilter | Date | string
    redirectUrl?: StringFilter | string
    imageUrl?: StringNullableListFilter
    region?: StringNullableFilter | string | null
    origin?: EnumListingOriginFilter | ListingOrigin
    isAuction?: BoolFilter | boolean
    auctionEnd?: DateTimeNullableFilter | Date | string | null
    likedByUserIDs?: StringNullableListFilter
    entryPoint?: StringFilter | string
  }

  export type EmailRecordUpsertWithWhereUniqueWithoutUserInput = {
    where: EmailRecordWhereUniqueInput
    update: XOR<EmailRecordUpdateWithoutUserInput, EmailRecordUncheckedUpdateWithoutUserInput>
    create: XOR<EmailRecordCreateWithoutUserInput, EmailRecordUncheckedCreateWithoutUserInput>
  }

  export type EmailRecordUpdateWithWhereUniqueWithoutUserInput = {
    where: EmailRecordWhereUniqueInput
    data: XOR<EmailRecordUpdateWithoutUserInput, EmailRecordUncheckedUpdateWithoutUserInput>
  }

  export type EmailRecordUpdateManyWithWhereWithoutUserInput = {
    where: EmailRecordScalarWhereInput
    data: XOR<EmailRecordUpdateManyMutationInput, EmailRecordUncheckedUpdateManyWithoutEmailRecordInput>
  }

  export type EmailRecordScalarWhereInput = {
    AND?: Enumerable<EmailRecordScalarWhereInput>
    OR?: Enumerable<EmailRecordScalarWhereInput>
    NOT?: Enumerable<EmailRecordScalarWhereInput>
    id?: StringFilter | string
    to?: StringFilter | string
    from?: StringFilter | string
    type?: EnumEmailTypeFilter | EmailType
    userId?: StringNullableFilter | string | null
    createdAt?: DateTimeFilter | Date | string
  }

  export type UserCreateWithoutLikedListingsInput = {
    passwordReset?: XOR<PasswordResetNullableCreateEnvelopeInput, PasswordResetCreateInput> | null
    emailUpdate?: XOR<EmailUpdateNullableCreateEnvelopeInput, EmailUpdateCreateInput> | null
    id?: string
    email: string
    password?: string | null
    premium?: boolean
    watchers?: UserWatcherCreateNestedManyWithoutUserInput
    roles?: UserCreaterolesInput | Enumerable<Role>
    loginStrategy?: LoginStrategy
    likedListingIDs?: UserCreatelikedListingIDsInput | Enumerable<string>
    EmailRecord?: EmailRecordCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutLikedListingsInput = {
    passwordReset?: XOR<PasswordResetNullableCreateEnvelopeInput, PasswordResetCreateInput> | null
    emailUpdate?: XOR<EmailUpdateNullableCreateEnvelopeInput, EmailUpdateCreateInput> | null
    id?: string
    email: string
    password?: string | null
    premium?: boolean
    watchers?: UserWatcherUncheckedCreateNestedManyWithoutUserInput
    roles?: UserCreaterolesInput | Enumerable<Role>
    loginStrategy?: LoginStrategy
    likedListingIDs?: UserCreatelikedListingIDsInput | Enumerable<string>
    EmailRecord?: EmailRecordUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutLikedListingsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutLikedListingsInput, UserUncheckedCreateWithoutLikedListingsInput>
  }

  export type PriceUpsertInput = {
    set: PriceCreateInput | null
    update: PriceUpdateInput
  }

  export type ParamaterUpdateManyInput = {
    where: ParamaterWhereInput
    data: ParamaterUpdateInput
  }

  export type ParamaterDeleteManyInput = {
    where: ParamaterWhereInput
  }

  export type UserUpsertWithWhereUniqueWithoutLikedListingsInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutLikedListingsInput, UserUncheckedUpdateWithoutLikedListingsInput>
    create: XOR<UserCreateWithoutLikedListingsInput, UserUncheckedCreateWithoutLikedListingsInput>
  }

  export type UserUpdateWithWhereUniqueWithoutLikedListingsInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutLikedListingsInput, UserUncheckedUpdateWithoutLikedListingsInput>
  }

  export type UserUpdateManyWithWhereWithoutLikedListingsInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutLikedByInput>
  }

  export type UserScalarWhereInput = {
    AND?: Enumerable<UserScalarWhereInput>
    OR?: Enumerable<UserScalarWhereInput>
    NOT?: Enumerable<UserScalarWhereInput>
    id?: StringFilter | string
    email?: StringFilter | string
    password?: StringNullableFilter | string | null
    premium?: BoolFilter | boolean
    roles?: EnumRoleNullableListFilter
    loginStrategy?: EnumLoginStrategyFilter | LoginStrategy
    likedListingIDs?: StringNullableListFilter
  }

  export type UserCreateWithoutEmailRecordInput = {
    passwordReset?: XOR<PasswordResetNullableCreateEnvelopeInput, PasswordResetCreateInput> | null
    emailUpdate?: XOR<EmailUpdateNullableCreateEnvelopeInput, EmailUpdateCreateInput> | null
    id?: string
    email: string
    password?: string | null
    premium?: boolean
    watchers?: UserWatcherCreateNestedManyWithoutUserInput
    roles?: UserCreaterolesInput | Enumerable<Role>
    loginStrategy?: LoginStrategy
    likedListingIDs?: UserCreatelikedListingIDsInput | Enumerable<string>
    likedListings?: ListingCreateNestedManyWithoutLikedByInput
  }

  export type UserUncheckedCreateWithoutEmailRecordInput = {
    passwordReset?: XOR<PasswordResetNullableCreateEnvelopeInput, PasswordResetCreateInput> | null
    emailUpdate?: XOR<EmailUpdateNullableCreateEnvelopeInput, EmailUpdateCreateInput> | null
    id?: string
    email: string
    password?: string | null
    premium?: boolean
    watchers?: UserWatcherUncheckedCreateNestedManyWithoutUserInput
    roles?: UserCreaterolesInput | Enumerable<Role>
    loginStrategy?: LoginStrategy
    likedListingIDs?: UserCreatelikedListingIDsInput | Enumerable<string>
    likedListings?: ListingUncheckedCreateNestedManyWithoutLikedByInput
  }

  export type UserCreateOrConnectWithoutEmailRecordInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutEmailRecordInput, UserUncheckedCreateWithoutEmailRecordInput>
  }

  export type UserUpsertWithoutEmailRecordInput = {
    update: XOR<UserUpdateWithoutEmailRecordInput, UserUncheckedUpdateWithoutEmailRecordInput>
    create: XOR<UserCreateWithoutEmailRecordInput, UserUncheckedCreateWithoutEmailRecordInput>
  }

  export type UserUpdateWithoutEmailRecordInput = {
    passwordReset?: XOR<PasswordResetNullableUpdateEnvelopeInput, PasswordResetCreateInput> | null
    emailUpdate?: XOR<EmailUpdateNullableUpdateEnvelopeInput, EmailUpdateCreateInput> | null
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    premium?: BoolFieldUpdateOperationsInput | boolean
    watchers?: UserWatcherUpdateManyWithoutUserInput
    roles?: UserUpdaterolesInput | Enumerable<Role>
    loginStrategy?: EnumLoginStrategyFieldUpdateOperationsInput | LoginStrategy
    likedListingIDs?: UserUpdatelikedListingIDsInput | Enumerable<string>
    likedListings?: ListingUpdateManyWithoutLikedByInput
  }

  export type UserUncheckedUpdateWithoutEmailRecordInput = {
    passwordReset?: XOR<PasswordResetNullableUpdateEnvelopeInput, PasswordResetCreateInput> | null
    emailUpdate?: XOR<EmailUpdateNullableUpdateEnvelopeInput, EmailUpdateCreateInput> | null
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    premium?: BoolFieldUpdateOperationsInput | boolean
    watchers?: UserWatcherUncheckedUpdateManyWithoutUserInput
    roles?: UserUpdaterolesInput | Enumerable<Role>
    loginStrategy?: EnumLoginStrategyFieldUpdateOperationsInput | LoginStrategy
    likedListingIDs?: UserUpdatelikedListingIDsInput | Enumerable<string>
    likedListings?: ListingUncheckedUpdateManyWithoutLikedByInput
  }

  export type EnumCategoryNullableListFilter = {
    equals?: Enumerable<Category> | null
    has?: Category | null
    hasEvery?: Enumerable<Category>
    hasSome?: Enumerable<Category>
    isEmpty?: boolean
  }

  export type BoolNullableFilter = {
    equals?: boolean | null
    not?: NestedBoolNullableFilter | boolean | null
    isSet?: boolean
  }

  export type IntNullableFilter = {
    equals?: number | null
    in?: Enumerable<number> | null
    notIn?: Enumerable<number> | null
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntNullableFilter | number | null
    isSet?: boolean
  }

  export type EnumListingOriginNullableListFilter = {
    equals?: Enumerable<ListingOrigin> | null
    has?: ListingOrigin | null
    hasEvery?: Enumerable<ListingOrigin>
    hasSome?: Enumerable<ListingOrigin>
    isEmpty?: boolean
  }

  export type EnumCurrencyFilter = {
    equals?: Currency
    in?: Enumerable<Currency>
    notIn?: Enumerable<Currency>
    not?: NestedEnumCurrencyFilter | Currency
  }

  export type UserWatcherCreateManyWatcherInput = {
    id?: string
    notifiedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
  }

  export type MetadataUpdatecategoriesInput = {
    set?: Enumerable<Category>
    push?: Enumerable<Category>
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
    unset?: boolean
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
    unset?: boolean
  }

  export type MetadataUpdateoriginsInput = {
    set?: Enumerable<ListingOrigin>
    push?: Enumerable<ListingOrigin>
  }

  export type UserWatcherUpdateWithoutWatcherInput = {
    notifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutWatchersInput
  }

  export type UserWatcherUncheckedUpdateWithoutWatcherInput = {
    notifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type UserWatcherUncheckedUpdateManyWithoutUserWatcherInput = {
    notifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type UserWatcherCreateManyUserInput = {
    id?: string
    watcherId: string
    notifiedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EmailRecordCreateManyUserInput = {
    id?: string
    to: string
    from: string
    type: EmailType
    createdAt?: Date | string
  }

  export type PasswordResetUpdateInput = {
    tokenHash?: StringFieldUpdateOperationsInput | string
    expiration?: IntFieldUpdateOperationsInput | number
  }

  export type EmailUpdateUpdateInput = {
    newEmail?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    expiration?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserWatcherUpdateWithoutUserInput = {
    watcher?: WatcherUpdateOneRequiredWithoutUserWatcherInput
    notifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserWatcherUncheckedUpdateWithoutUserInput = {
    watcherId?: StringFieldUpdateOperationsInput | string
    notifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserWatcherUncheckedUpdateManyWithoutWatchersInput = {
    watcherId?: StringFieldUpdateOperationsInput | string
    notifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ListingUpdateWithoutLikedByInput = {
    price?: XOR<PriceNullableUpdateEnvelopeInput, PriceCreateInput> | null
    parameters?: XOR<ParamaterListUpdateEnvelopeInput, Enumerable<ParamaterCreateInput>>
    origin_id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    body?: NullableStringFieldUpdateOperationsInput | string | null
    category?: EnumCategoryFieldUpdateOperationsInput | Category
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    redirectUrl?: StringFieldUpdateOperationsInput | string
    imageUrl?: ListingUpdateimageUrlInput | Enumerable<string>
    region?: NullableStringFieldUpdateOperationsInput | string | null
    origin?: EnumListingOriginFieldUpdateOperationsInput | ListingOrigin
    isAuction?: BoolFieldUpdateOperationsInput | boolean
    auctionEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    likedByUserIDs?: ListingUpdatelikedByUserIDsInput | Enumerable<string>
    entryPoint?: StringFieldUpdateOperationsInput | string
  }

  export type ListingUncheckedUpdateWithoutLikedByInput = {
    price?: XOR<PriceNullableUpdateEnvelopeInput, PriceCreateInput> | null
    parameters?: XOR<ParamaterListUpdateEnvelopeInput, Enumerable<ParamaterCreateInput>>
    origin_id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    body?: NullableStringFieldUpdateOperationsInput | string | null
    category?: EnumCategoryFieldUpdateOperationsInput | Category
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    redirectUrl?: StringFieldUpdateOperationsInput | string
    imageUrl?: ListingUpdateimageUrlInput | Enumerable<string>
    region?: NullableStringFieldUpdateOperationsInput | string | null
    origin?: EnumListingOriginFieldUpdateOperationsInput | ListingOrigin
    isAuction?: BoolFieldUpdateOperationsInput | boolean
    auctionEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    likedByUserIDs?: ListingUpdatelikedByUserIDsInput | Enumerable<string>
    entryPoint?: StringFieldUpdateOperationsInput | string
  }

  export type ListingUncheckedUpdateManyWithoutLikedListingsInput = {
    price?: XOR<PriceNullableUpdateEnvelopeInput, PriceCreateInput> | null
    parameters?: XOR<ParamaterListUpdateEnvelopeInput, Enumerable<ParamaterCreateInput>>
    origin_id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    body?: NullableStringFieldUpdateOperationsInput | string | null
    category?: EnumCategoryFieldUpdateOperationsInput | Category
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    redirectUrl?: StringFieldUpdateOperationsInput | string
    imageUrl?: ListingUpdateimageUrlInput | Enumerable<string>
    region?: NullableStringFieldUpdateOperationsInput | string | null
    origin?: EnumListingOriginFieldUpdateOperationsInput | ListingOrigin
    isAuction?: BoolFieldUpdateOperationsInput | boolean
    auctionEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    likedByUserIDs?: ListingUpdatelikedByUserIDsInput | Enumerable<string>
    entryPoint?: StringFieldUpdateOperationsInput | string
  }

  export type EmailRecordUpdateWithoutUserInput = {
    to?: StringFieldUpdateOperationsInput | string
    from?: StringFieldUpdateOperationsInput | string
    type?: EnumEmailTypeFieldUpdateOperationsInput | EmailType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EmailRecordUncheckedUpdateWithoutUserInput = {
    to?: StringFieldUpdateOperationsInput | string
    from?: StringFieldUpdateOperationsInput | string
    type?: EnumEmailTypeFieldUpdateOperationsInput | EmailType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EmailRecordUncheckedUpdateManyWithoutEmailRecordInput = {
    to?: StringFieldUpdateOperationsInput | string
    from?: StringFieldUpdateOperationsInput | string
    type?: EnumEmailTypeFieldUpdateOperationsInput | EmailType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PriceUpdateInput = {
    value?: IntFieldUpdateOperationsInput | number
    currency?: EnumCurrencyFieldUpdateOperationsInput | Currency
  }

  export type ParamaterUpdateInput = {
    label?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
  }

  export type UserUpdateWithoutLikedListingsInput = {
    passwordReset?: XOR<PasswordResetNullableUpdateEnvelopeInput, PasswordResetCreateInput> | null
    emailUpdate?: XOR<EmailUpdateNullableUpdateEnvelopeInput, EmailUpdateCreateInput> | null
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    premium?: BoolFieldUpdateOperationsInput | boolean
    watchers?: UserWatcherUpdateManyWithoutUserInput
    roles?: UserUpdaterolesInput | Enumerable<Role>
    loginStrategy?: EnumLoginStrategyFieldUpdateOperationsInput | LoginStrategy
    likedListingIDs?: UserUpdatelikedListingIDsInput | Enumerable<string>
    EmailRecord?: EmailRecordUpdateManyWithoutUserInput
  }

  export type UserUncheckedUpdateWithoutLikedListingsInput = {
    passwordReset?: XOR<PasswordResetNullableUpdateEnvelopeInput, PasswordResetCreateInput> | null
    emailUpdate?: XOR<EmailUpdateNullableUpdateEnvelopeInput, EmailUpdateCreateInput> | null
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    premium?: BoolFieldUpdateOperationsInput | boolean
    watchers?: UserWatcherUncheckedUpdateManyWithoutUserInput
    roles?: UserUpdaterolesInput | Enumerable<Role>
    loginStrategy?: EnumLoginStrategyFieldUpdateOperationsInput | LoginStrategy
    likedListingIDs?: UserUpdatelikedListingIDsInput | Enumerable<string>
    EmailRecord?: EmailRecordUncheckedUpdateManyWithoutUserInput
  }

  export type UserUncheckedUpdateManyWithoutLikedByInput = {
    passwordReset?: XOR<PasswordResetNullableUpdateEnvelopeInput, PasswordResetCreateInput> | null
    emailUpdate?: XOR<EmailUpdateNullableUpdateEnvelopeInput, EmailUpdateCreateInput> | null
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    premium?: BoolFieldUpdateOperationsInput | boolean
    roles?: UserUpdaterolesInput | Enumerable<Role>
    loginStrategy?: EnumLoginStrategyFieldUpdateOperationsInput | LoginStrategy
    likedListingIDs?: UserUpdatelikedListingIDsInput | Enumerable<string>
  }

  export type NestedBoolNullableFilter = {
    equals?: boolean | null
    not?: NestedBoolNullableFilter | boolean | null
    isSet?: boolean
  }

  export type NestedEnumCurrencyFilter = {
    equals?: Currency
    in?: Enumerable<Currency>
    notIn?: Enumerable<Currency>
    not?: NestedEnumCurrencyFilter | Currency
  }

  export type EnumCurrencyFieldUpdateOperationsInput = {
    set?: Currency
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.DMMF.Document;
}