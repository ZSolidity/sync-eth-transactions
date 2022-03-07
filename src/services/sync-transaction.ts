import {BaseService} from './base-service'

export class SyncTransaction extends BaseService {
  constructor() {
    super("SyncTransaction")
  }

  public sync_transaction() {
    this.logger.debug("a");
  }
}