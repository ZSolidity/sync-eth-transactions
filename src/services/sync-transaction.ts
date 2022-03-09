import {BaseService} from './base-service'
export default class SyncTransaction extends BaseService {
  constructor() {
    super("SyncTransaction")
    this.logInfo("SyncTransaction service is started")
  }

  public execute() {
    this.logInfo("excute")

  }
}