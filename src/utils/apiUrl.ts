class ApiUrl {
    rootUrl: string;
    test: string;
    getFriend: string;
    registerandlogin: string;
    getMyfriendList: string;
    removeFriend: string;
    constructor() {
        // http://203.174.57.179:3000/
        this.rootUrl = "http://203.174.57.179:3000"
        // /test
        this.test = `${this.rootUrl}/test`
        // /getfriend
        this.getFriend = `${this.rootUrl}/getfriend`
        // /registerandlogin
        this.registerandlogin = `${this.rootUrl}/registerandlogin`
        // /getmyfriendlist
        this.getMyfriendList = `${this.rootUrl}/getmyfriendlist`
        // /removefriend
        this.removeFriend = `${this.rootUrl}/removefriend`
    }
}



export default ApiUrl