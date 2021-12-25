class ApiUrl {
    rootUrl: string;
    test: string;
    getFriend: string;
    registerandlogin: string;
    constructor() {
        this.rootUrl = "http://203.174.57.179:3000/"
        this.test = `${this.rootUrl}test`
        this.getFriend = `${this.rootUrl}getfriend`
        this.registerandlogin = `${this.rootUrl}registerandlogin`
    }
}



export default ApiUrl