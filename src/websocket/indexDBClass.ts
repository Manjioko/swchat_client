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
                //2-创建数据库 indexedDB.open方法用于打开数据库。返回的是一个对象，第一个参数是数据库名称，格式为字符串。第二个参数是数据库版本。
                let openRequest = window.indexedDB.open(dbInfo.dbName, dbInfo.dbVersion);

                //3-创建数据库时会触发三个事件之一，这三个事件，分别是upgradeneeded，success，onerror。
                openRequest.onupgradeneeded = (e: any) => {    //第一次打开数据库

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
                        store.createIndex('userlist', 'userlist', { unique: true })
                        store.createIndex('contactlist', 'contactlist', { unique: true })
                        console.log("swchat_msg_test001 创建成功")
                    }
                }

                openRequest.onsuccess = (e: any) => {
                    console.log("数据库打开成功...");
                    let db = e?.target?.result;

                    resolve(db)
                }

                openRequest.onerror = (e: any) => {

                    console.log("数据库打开失败...");
                    reject(false)
                }
            } else {
                // 不支持
                console.log("不支持indexedDB...");
                // window.indexedDB = window.mozIndexedDB || window.webkitIndexedDB;
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
            getRoomMSG.onsuccess = (e: any) => {
                let result = e.target.result;
                if (result) {
                    console.log("getRoomMSG 已存在值")
                } else {
                    console.log("getRoomMSG 不存在值, 即将写入数据")
                    let request = store.add({ roomid: roomid, chatBox: [] })
                    request.onsuccess = (event) => {
                        console.log(`${roomid} 数据写入成功`);
                    };

                    request.onerror = (event) => {
                        console.log(`${roomid} 数据写入失败`);
                    }

                }
            }

            getRoomMSG.onerror = (err: any) => {
                console.log(err)
            }

        }).catch((err: any) => {
            console.log(err)
        })
    }

    private updateDataToDB(roomid: string, chatBox: ChatBoxtype) {
        this.dbPromise.then(db => {
            let tr = db.transaction(['swchat_msg_test001'], 'readwrite')
            let store = tr.objectStore('swchat_msg_test001')

            let index = store.index("roomid")
            let getRoomMSG = index.get(roomid)
            getRoomMSG.onsuccess = function (e: any) {
                let result = e.target.result;
                if (result) {
                    console.log("updateDataToDB getRoomMSG 已存在值,即将更新chatBox")
                    result.chatBox.push(chatBox)
                    store.put(result)
                } else {
                    console.log("updateDataToDB getRoomMSG 不存在值")
                }
            }

            getRoomMSG.onerror = (err: any) => {
                console.log(err)
            }

        }).catch((err: any) => {
            console.log(err)
        })
    }

    private getDataFromDB(roomid: string,chatLen?:number): Promise<any> {
        return new Promise((resolve, reject) => {
            this.dbPromise.then(db => {
                let tr = db.transaction(['swchat_msg_test001'], 'readwrite')
                let store = tr.objectStore('swchat_msg_test001')
                let index = store.index("roomid")
                let getRoomMSG = index.get(roomid)
                getRoomMSG.onsuccess = (e: any) => {
                    let result = e.target.result;
                    if (result) {
                        // 返回聊天消息的数组
                        let someChat = []
                        // 每次返回20条消息
                        let len = 20
                        // 聊天消息的总长度
                        let chatboxLen = chatLen ? result.chatBox.length - chatLen - 1 : result.chatBox.length - 1
                        console.log("cahtboxlen is: " + chatboxLen)

                        // 获取20条消息放入somechat中
                        while(len > 0 && chatboxLen >= 0) {
                            let data = result.chatBox[chatboxLen]
                            if(data) {
                                someChat.unshift(data)
                            }
                            len --
                            chatboxLen --
                        }
                        // 返回someChat
                        resolve(someChat)
                    } else {
                        resolve(false)
                    }
                }

                getRoomMSG.onerror = (err: any) => {
                    reject(err)
                }

            }).catch((err: any) => {
                console.log(err)
            })
        })
    }

    private saveUserListDataToDB(clientid:string,listObject:any) {
        this.dbPromise.then(db => {
            let tr = db.transaction(['swchat_msg_test001'], 'readwrite')
            let store = tr.objectStore('swchat_msg_test001')

            let index = store.index("userlist")
            let getRoomMSG = index.get('userlist')
            getRoomMSG.onsuccess = function (e: any) {
                let result = e.target.result;
                if (result) {
                    console.log("saveUserListDataToDB,即将更新listObject")
                    // result.chatBox.push(chatBox)
                    result[clientid] = listObject
                    store.put(result)
                } else {
                    console.log("saveUserListDataToDB 不存在值")
                    let newstore:any = {}
                    newstore['userlist'] = 'userlist'
                    newstore[clientid] = listObject
                    store.add(newstore)
                }
            }

            getRoomMSG.onerror = (err: any) => {
                console.log(`saveUserListDataToDB 保存失败,原因是: ${err}`)
            }

        }).catch((err: any) => {
            console.log(err)
        })
    }

    private getUserListDataFromDB():Promise<any> {
        return new Promise((resolve,reject) => {
            this.dbPromise.then(db => {
                let tr = db.transaction(['swchat_msg_test001'], 'readwrite')
                let store = tr.objectStore('swchat_msg_test001')
    
                let index = store.index("userlist")
                let getRoomMSG = index.get('userlist')
                getRoomMSG.onsuccess = function (e: any) {
                    let result = e.target.result;
                    if (result) {
                        console.log("saveUserListDataToDB,即将获取userlist...")
                        resolve(result)
                    } else {
                        console.log("saveUserListDataToDB 不存在值,返回false")
                        resolve(false)
                    }
                }
    
                getRoomMSG.onerror = (err: any) => {
                    console.log(`saveUserListDataToDB 获取失败,原因是: ${err}`)
                    reject(`saveUserListDataToDB 获取失败,原因是: ${err}`)
                }
    
            }).catch((err: any) => {
                console.log(err)
            })
        })
    }

    private saveContactListDataToDB(contactlist:Array<any>) {
        this.dbPromise.then(db => {
            let tr = db.transaction(['swchat_msg_test001'], 'readwrite')
            let store = tr.objectStore('swchat_msg_test001')

            let index = store.index("contactlist")
            let getRoomMSG = index.get('contactlist')
            getRoomMSG.onsuccess = function (e: any) {
                let result = e.target.result;
                if (result) {
                    console.log("saveContactListDataToDB,即将更新contactlist")
                    result['list'] = contactlist
                    store.put(result)
                } else {
                    console.log("saveContactListDataToDB 不存在值,即将创建saveContactListDataToDB数据")
                    let data:any = {}
                    data['contactlist'] = "contactlist"
                    data['list'] = contactlist
                    store.add(data)
                }

            }

            getRoomMSG.onerror = (err: any) => {
                console.log(`saveContactListDataToDB 保存失败,原因是: ${err}`)
            }

        }).catch((err: any) => {
            console.log(err)
        })
    }

    private getContactListDataFromDB() {
        return new Promise((resolve,reject) => {
            this.dbPromise.then(db => {
                let tr = db.transaction(['swchat_msg_test001'], 'readwrite')
                let store = tr.objectStore('swchat_msg_test001')
    
                let index = store.index("contactlist")
                let getRoomMSG = index.get('contactlist')
                getRoomMSG.onsuccess = function (e: any) {
                    let result = e.target.result;
                    if (result) {
                        console.log("saveContactListDataToDB,即将获取contactlist...")
                        resolve(result)
                    } else {
                        console.log("saveContactListDataToDB 不存在值,返回false")
                        resolve(false)
                    }
                }
    
                getRoomMSG.onerror = (err: any) => {
                    console.log(`saveContactListDataToDB 获取失败,原因是: ${err}`)
                    reject(`saveContactListDataToDB 获取失败,原因是: ${err}`)
                }
    
            }).catch((err: any) => {
                console.log(err)
            })
        })
    }
}