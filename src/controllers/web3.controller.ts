import Web3 from "web3"
import BaseCommon from "../commons/base.common"

export default class Web3Controller extends BaseCommon {
  private serviceProvider: string
  private web3: any

  constructor() {
    super("Web3Controller")
    if (`${process.env.REAL_NETWORK}` == 'true') {
      this.serviceProvider = `https://:${process.env.INFURA_SEC}@mainnet.infura.io/v3/${process.env.INFURA_KEY}`//, {keepAlive: false, timeout:60000})
    } else {
      this.serviceProvider = `https://:${process.env.INFURA_SEC}@rinkeby.infura.io/v3/${process.env.INFURA_KEY}`//, {keepAlive: false, timeout:60000})
    }
    this.web3 = new Web3(this.serviceProvider)
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
}
