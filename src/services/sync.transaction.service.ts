import Web3 from 'web3'
import BaseCommon from '../commons/base.common'
import DatabaseService from './database.service'
import Web3Controller from '../controllers/web3.controller'
import * as Constants from '../global/constants'
import * as gFunctiongs from '../global/functions'

export default class SyncTransaction extends BaseCommon {
  private dbService: DatabaseService
  private web3Controller: Web3Controller

  constructor(_dbService: DatabaseService) {
    super("SyncTransaction Service")
    this.dbService = _dbService
    this.web3Controller = new Web3Controller()
    this.logInfo("SyncTransaction service is started")
  }

  private async syncTransactions(blockNumber: number, lastSyncStatus: any) {
    if (blockNumber === lastSyncStatus.value) {
      if (lastSyncStatus.status === Constants.SYNC_STATUS_COMPLETED) {
        this.logInfo(`skipped because already completed`)
        return true
      } else {
        this.logInfo(`delete not completed transactions`)
        await this.dbService.deleteEthTransactions(blockNumber)
      }
    }
    
    await this.dbService.updateSyncStatus("LAST_BLOCK_NUMBER", blockNumber, Constants.SYNC_STATUS_PROGRESS)
    this.logInfo(`>>>>>>>>>>>> udpate sync status, blockNumber=${blockNumber}, value=${Constants.SYNC_STATUS_PROGRESS}`)

    try { 
      let trasactionList:any = await this.web3Controller.getEthTransactions(blockNumber)

      trasactionList.transactions.forEach(async(transaction: any) => {
        if (transaction.value == '0' || transaction.to == null) {
          return
        }
        try { 
          this.logInfo(`add transaction, hash=${transaction.hash}`)
          await this.dbService.addEthTransaction(transaction)
        } catch (error) {
          this.logError(`Exception has been occurred while adding eth transactions. Error Message=[${error}], Transaction=[${JSON.stringify(transaction)}]`)
        }
      })

      this.logInfo(`<<<<<<<<<<< update sync status, blockNumber=${blockNumber}, value=${Constants.SYNC_STATUS_COMPLETED}`)
      await this.dbService.updateSyncStatus("LAST_BLOCK_NUMBER", blockNumber, Constants.SYNC_STATUS_COMPLETED, trasactionList.timestamp)
    } catch (err: any) {
      this.logError(`Exception has been occured on [syncTransactions]. ${err}`)
      return false;
    }
   
    return true;
  }

  public async execute() {
    return new Promise(async (resolve, reject) => {
      let lastSyncStatus:any = await this.dbService.getSyncStatus("LAST_BLOCK_NUMBER")

      try { 
        let currentBlockNumber:any = await this.web3Controller.getLastBlockNumber()
        this.logInfo(`CURRENT BLOCKNUMBER=${currentBlockNumber}`)
        if (lastSyncStatus === null) {
          await this.dbService.addSyncStatus("LAST_BLOCK_NUMBER", currentBlockNumber)
        } else {
          if (lastSyncStatus.value < currentBlockNumber) {
            for(let index=lastSyncStatus.value; index < currentBlockNumber; index++) {
              this.logInfo(`|||||||||||||||||||||||||||||||||||||||||||||||||`)
              this.logInfo(`syncTransactions(${index})`)
              if (!await this.syncTransactions(index, lastSyncStatus)) {
                break
              }
            }
          }
        }
        resolve({success: true})
      } catch (err) {
        reject({success: false, message: err})
      }
    })
    /*
    this.web3.eth.getBlock(12062475, true).then((res:any) => {
      this.logInfo(res)
    })*/
  }
}