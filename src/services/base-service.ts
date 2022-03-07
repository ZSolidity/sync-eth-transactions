import Log4js from "log4js";
import Log4jsConfigure from "./../config/log4js.json"

export class BaseService{
    public logger:any;

    constructor(_service_name:string) {
      Log4js.configure(Log4jsConfigure);
      this.logger = Log4js.getLogger(_service_name)
    }
    
    public logInfo(_msg:any) {
      this.logger.info(_msg)
    }

    public logDebug(_msg:any) {
      this.logger.debug(_msg)
    }

    public logError(_msg:any) {
      this.logger.error(_msg)
    }

    protected onError(_msg:any) {
      let datetime = new Date()
      console.log(`${datetime} [onError]:${_msg}`)
    }

    protected onException(_msg:any){
      let datetime = new Date()
      console.log(`${datetime} [onException]:${_msg}`)
    }

    protected onInfo(_msg:any){
      let datetime = new Date()
      console.log(`${datetime} [onInfo]:${_msg}`)
    }
}