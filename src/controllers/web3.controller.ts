import Web3 from "web3"
import BaseCommon from "../commons/base.common"
import * as RealUsdtContractAddress from "../config/real-abi/usdt-contract.json"
import * as TestUsdtContractAddress from "../config/test-abi/usdt-contract.json"
import * as GFunctions from "../global/functions"
export default class Web3Controller extends BaseCommon {
  private serviceProvider: string
  private web3: any
  private contractAddress: any
  private transferMethod: string

  constructor() {
    super("Web3Controller")

    this.contractAddress = {}

    if (`${process.env.REAL_NETWORK}` == 'true') {
      this.serviceProvider = `https://:${process.env.INFURA_SEC}@mainnet.infura.io/v3/${process.env.INFURA_KEY}`//, {keepAlive: false, timeout:60000})
      this.contractAddress["usdt"] = RealUsdtContractAddress.address
    } else {
      this.serviceProvider = `https://:${process.env.INFURA_SEC}@rinkeby.infura.io/v3/${process.env.INFURA_KEY}`//, {keepAlive: false, timeout:60000})
      this.contractAddress["usdt"] = TestUsdtContractAddress.address
    }
    this.web3 = new Web3(this.serviceProvider)
    this.transferMethod = "0xa9059cbb"

    /*this.web3.eth.getTransaction("0xd234dae15a4cfa90b8d91a5127359883babd0bfca89cbb919b62cb82885793cd").then((res:any)=>{
      this.logInfo(res)
    })*/
  }

  public async getLastBlockNumber() {
    return new Promise((resolve, reject) => {
      try{
        this.web3.eth.getBlockNumber().then((res:any) => {
          resolve(res)
        })
      } catch (err: any) {
        reject(err)
      }
    })
  }

  public async getEthTransactions(blockNumber: number) {
    return new Promise((resolve, reject) => {
      try{
        this.web3.eth.getBlock(blockNumber, true).then((res:any) => {
          resolve(res)
        })
      } catch (err: any) {
        reject(err)
      }
    })
  }
  
  public isEthTransaction(transaction: any) {
    if (transaction.input != '0x') {
      return false
    }

    if (transaction.value == '0') {
      return false
    }

    if (transaction.to == null) {
      return false
    }

    return true
  }

  public isErc20Transaction(tokenName: string, transaction: any) {
    if (tokenName == null || tokenName.length == 0) {
      return false
    }

    if (transaction.to != this.contractAddress[tokenName]) {
      return false
    }
    
    let method = transaction.input.substring(0, 10)
    
    if (method != this.transferMethod) {
      return false
    }

    if (transaction.value != '0') {
      return false
    }

    return true
  }

  public getTransferMethodParams(tokenName:string, transaction: any) {
    if (!this.isErc20Transaction(tokenName, transaction)) {
      return null
    }

    let to = transaction.input.substring(10, 74)
    let value = transaction.input.substring(75, 139)

    to = "0x" + GFunctions.removeZero(to)
    value =  GFunctions.hexToDec(GFunctions.removeZero(value))

    return {to: to, value: value, contract: transaction.to}
  }

  private getContractAddress(tokenName: string) {
    return this.contractAddress[tokenName]
  }
}
