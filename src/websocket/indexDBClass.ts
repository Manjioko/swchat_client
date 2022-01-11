import { ChatBoxtype } from "vue/types/chatBoxType";

export default class indexDB {
    dbPromise: Promise<IDBDatabase>;
    constructor() {
        this.dbPromise = this.createindexDB()
    }

    private async createindexDB(): Promise<IDBDatabase> {
        //1-我们先创建一个对象，放一些数据比如dbInfo ，可以设置数据库名字dbName，数据库的版本dbVersion 
        let dbInfo = {
            dbName: "DataBaseTest001",
            dbVersion: 2021,
            dbInstance: {}
        };

        let db: IDBDatabase = await new Promise((resolve, reject) => {

            if ("indexedDB" in window) {
                // 支持
                console.log(" 支持indexedDB...");
                // createindexDB();    //创建数据库，接下来我们就到这里来了嘛
                // createindexDB(chatbox);
            } else {
                // 不支持
                console.log("不支持indexedDB...");
                // window.indexedDB = window.mozIndexedDB || window.webkitIndexedDB;
            }
            //2-创建数据库 indexedDB.open方法用于打开数据库。返回的是一个对象，第一个参数是数据库名称，格式为字符串。第二个参数是数据库版本。
            let openRequest = window.indexedDB.open(dbInfo.dbName, dbInfo.dbVersion);

            //3-创建数据库时会触发三个事件之一，这三个事件，分别是upgradeneeded，success，onerror。
            openRequest.onupgradeneeded = function (e: any) {    //第一次打开数据库

                console.log("第一次打开该数据库，或者数据库版本发生变化....");
                let db: IDBDatabase = e?.target?.result;
                let storeNames = db.objectStoreNames;

                //创建数据库的表格（或者叫数据库仓库）
                if (!storeNames.contains('swchat_msg_test001')) {
                    let store: any = db.createObjectStore('swchat_msg_test001', {
                        keyPath: "indexDBId",
                        autoIncrement: true
                    })

                    store.createIndex('roomid', 'roomid', { unique: true })
                    console.log("swchat_msg_test001 创建成功")
                }
            }

            openRequest.onsuccess = function (e: any) {          //success：打开成功^-^  
                console.log("数据库打开成功...");
                let db = e?.target?.result;

                resolve(db)
            }

            openRequest.onerror = function (e) {              //error：打开失败*-*

                console.log("数据库打开失败...");
                // console.dir(e);
                reject(false)
            }
        })

        return db
    }

    private addDataToDB(roomid: string) {
        this.dbPromise.then(db => {
            let tr = db.transaction(['swchat_msg_test001'], 'readwrite')
            let store = tr.objectStore('swchat_msg_test001')

            let index = store.index("roomid")
            let getRoomMSG = index.get(roomid)
            getRoomMSG.onsuccess = function (e: any) {
                let result = e.target.result;
                if (result) {
                    console.log("getRoomMSG 已存在值")
                    // result.update(result.chatBox = {username:"test"})
                } else {
                    console.log("getRoomMSG 不存在值, 即将写入数据")
                    let request = store.add({ roomid: roomid, chatBox: [] })
                    request.onsuccess = function (event) {
                        console.log(`${roomid} 数据写入成功`);
                    };

                    request.onerror = function (event) {
                        console.log(`${roomid} 数据写入失败`);
                    }

                }
            }
        })
    }

    private updateDataToDB(roomid: string, chatBox:ChatBoxtype) {
        this.dbPromise.then(db => {
            let tr = db.transaction(['swchat_msg_test001'], 'readwrite')
            let store = tr.objectStore('swchat_msg_test001')

            let index = store.index("roomid")
            let getRoomMSG = index.get(roomid)
            getRoomMSG.onsuccess = function (e: any) {
                let result = e.target.result;
                if (result) {
                    console.log("getRoomMSG 已存在值")
                    result.chatBox.push(chatBox)
                    store.put(result)
                    // result.update(result.chatBox = {username:"test"})
                } else {
                    console.log("getRoomMSG 不存在值, 即将写入数据")
                }
            }
            // getRoomMSG.open
        })
    }
}