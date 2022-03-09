import dotenv from 'dotenv'
import SyncTransaction from './services/sync-transaction'

let sync_transaction = new SyncTransaction()

async function main() {
    try { 
        sync_transaction.execute()
    } catch (err:any) {
        console.log(err)
    }
    setTimeout(main, 10000);
}

main()

process.on('uncaughtException', error => {
    console.log(error)
})