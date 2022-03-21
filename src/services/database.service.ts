import * as mongoDB from "mongoDB";
import * as dotenv from "dotenv";
import BaseCommon from "../commons/base.common"
import * as SyncStatusModal from "../models/sync.status.modal"
import * as EthTransactionModal from "../models/eth.transaction.modal"
import * as EthTransactionERC20Modal from "../models/eth.transaction.erc20"
import * as Constants from "../global/constants"

export default class DatabaseService extends BaseCommon {
  constructor() {
    super("Database Service")
  }

  private collections: {
    syncStatus?: mongoDB.Collection<SyncStatusModal.Collection>
    ethTransaction?: mongoDB.Collection<EthTransactionModal.Collection>
  } = {};

  private async applyValidateSchema(db: mongoDB.Db, collectionName: any, jsonSchema: any) {
    await db.command({
      collMod: collectionName,
      validator: jsonSchema
    }).catch(async (error: mongoDB.MongoServerError) => {
      if (error.codeName === 'NamespaceNotFound') {
        await db.createCollection(collectionName, { validator: jsonSchema });
      }
    });
  }

  public async connectToDatabase() {
    const dbConnectionUrl: any = process.env.DB_CONNECTION_URL
    const client = new mongoDB.MongoClient(dbConnectionUrl);

    await client.connect();

    const db = client.db(process.env.DB_NAME);

    await this.applyValidateSchema(db, SyncStatusModal.COLLECTION_NAME, SyncStatusModal.jsonSchema);
    await this.applyValidateSchema(db, EthTransactionModal.COLLECTION_NAME, EthTransactionModal.jsonSchema);

    const syncStatusCollection = db.collection<SyncStatusModal.Collection>(SyncStatusModal.COLLECTION_NAME);
    const ethTransactionCollection = db.collection<EthTransactionModal.Collection>(EthTransactionModal.COLLECTION_NAME);

    this.collections.syncStatus = syncStatusCollection;
    this.collections.ethTransaction = ethTransactionCollection;

    this.collections.ethTransaction.createIndex(EthTransactionModal.jsonIndex)

    this.logInfo(`Successfully connected to database: ${db.databaseName}`)
  }

  public async getSyncStatus(key: string) {
    let document = await this.getCollections().syncStatus?.findOne({key:key})
    return document
  }

  public async updateSyncStatus(key: string, value: number, status: number, timestamp: number = 0) {
    let params = {}

    if (timestamp != 0) {
      params = {value:value, status:status, timestamp:timestamp}
    } else {
      params = {value:value, status:status}
    }

    return await this.getCollections().syncStatus?.updateOne({key: key}, {
      $set:params
    })
  }

  public async addSyncStatus(key: string, value: number) {
    return await this.getCollections().syncStatus?.insertOne({
      key: key,
      value: value,
      status: Constants.SYNC_STATUS_NONE,
      timestamp: 0
    })
  }

  public async deleteEthTransactions(blockNumber: number) {
    return await this.getCollections().ethTransaction?.deleteMany({blockNumber: blockNumber})
  }

  public async addEthTransaction(transaction: any) {
    return await this.getCollections().ethTransaction?.insertOne({
      blockNumber: transaction.blockNumber,
      hash: transaction.hash,
      from: transaction.from,
      to: transaction.to,
      value: transaction.value
    })
  }

  private getCollections() {
    return this.collections
  }
}

