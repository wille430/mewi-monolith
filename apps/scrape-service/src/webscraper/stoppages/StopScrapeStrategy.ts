export interface IStopScrapeStrategy<T> {
  shouldStop(res: T): boolean | Promise<boolean>;

  indexOfLastValid(res: T): number | Promise<number>;

  update(res: T): void | Promise<void>;

  start(): void | Promise<void>;

  stop(): void | Promise<void>;
}
