import dotenv from 'dotenv'

import {BaseService} from './services/base-service'

let test = new BaseService("abcd")
test.logInfo("A")
test.logError("B")
test.logDebug("C")

async function main() {
    try { 
        console.log("a")
    } catch (err:any) {
        console.log(err)
    }
    setTimeout(main, 10000);
}

//main()

process.on('uncaughtException', error => {
    console.log(error)
})