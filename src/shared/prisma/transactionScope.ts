export interface TransactionScope {
  run(fn: () => Promise<any>): Promise<any>;
}