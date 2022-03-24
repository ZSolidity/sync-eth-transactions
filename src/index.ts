import dotenv from "dotenv"
import SyncTransactionService from "./services/sync.transaction.service"
import DatabaseService from "./services/database.service"

dotenv.config()

let dbService = new DatabaseService()

dbService.connectToDatabase()
  .then(()=>{
    let syncTranService = new SyncTransactionService(dbService)
    let timeid = setInterval(async ()=>{
        await syncTranService.execute()
        .then((res) => {})
        .catch((error) =>{
          console.log(error)
        })

        //await syncErc20TranService.execute()
        //.then((res) => {})
        //.catch((error) =>{
        //  console.log(error)
        //})
    }, 10000)
  })
  .catch((err:Error) => {
    console.error("Database connection failed", err)
  })

process.on('uncaughtException', error => {
  console.log(error)
})