import { ChatBoxtype } from "vue/types/chatBoxType";


async function dbHandle(chatbox: ChatBoxtype) {

    if ("indexedDB" in window) {
        // 支持
        console.log(" 支持indexedDB...");
        // createindexDB();    //创建数据库，接下来我们就到这里来了嘛
        createindexDB(chatbox);
    } else {
        // 不支持
        console.log("不支持indexedDB...");
        // window.indexedDB = window.mozIndexedDB || window.webkitIndexedDB;
    }

}

function createindexDB(chatbox: ChatBoxtype) {
    //1-我们先创建一个对象，放一些数据比如dbInfo ，可以设置数据库名字dbName，数据库的版本dbVersion 

    var dbInfo = {
        dbName: "DataBaseTest001",
        dbVersion: 2021,
        dbInstance: {}
    };

    //2-创建数据库 indexedDB.open方法用于打开数据库。返回的是一个对象，第一个参数是数据库名称，格式为字符串。第二个参数是数据库版本。

    var openRequest = window.indexedDB.open(dbInfo.dbName, dbInfo.dbVersion);

    //3-创建数据库时会触发三个事件之一，这三个事件，分别是upgradeneeded，success，onerror。

    openRequest.onupgradeneeded = function (e: any) {    //第一次打开数据库 ^-*

        console.log("第一次打开该数据库，或者数据库版本发生变化....");
        var db = e?.target?.result;
        var storeNames = db.objectStoreNames;

        //创建数据库的表格（或者叫数据库仓库）
        if (!storeNames.contains('swchat_msg_test001')) {
            let store:any = db.createObjectStore('swchat_msg_test001', {
                keyPath: "indexDBId",
                autoIncrement: true
            })

            store.createIndex('myid','myid',{unique:false})
            store.createIndex('time','time',{unique:false})
            store.createIndex('clientid','clientid',{unique:false})
            store.createIndex('roomid','roomid',{unique:false})
            store.createIndex('content','content',{unique:false})
        }
    }

    openRequest.onsuccess = function (e: any) {          //success：打开成功^-^  
        console.log("数据库打开成功...");
        var db = e?.target?.result;

        var storeNames = db.objectStoreNames;

        //创建数据库的表格（或者叫数据库仓库）
        if (!storeNames.contains('swchat_msg_test001')) {
            let store:any = db.createObjectStore('swchat_msg_test001', {
                keyPath: "indexDBId",
                autoIncrement: true
            })
            store.createIndex('myid','myid',{unique:false})
            store.createIndex('time','time',{unique:false})
            store.createIndex('clientid','clientid',{unique:false})
            store.createIndex('roomid','roomid',{unique:false})
            store.createIndex('content','content',{unique:false})
        }

        //4-这里面我要写很多要调用的函数了，比如，下面.....wu la wu la.....

        add_data(db, chatbox);  //数据库中添加数据
        // del_data(db);  //数据库中删除数据
        // deal_data(db); //读取数据
        // update_data(db);//更新数据（类似于Add方法）
        // traverse_data(db); //遍历数据
    }

    openRequest.onerror = function (e) {              //error：打开失败*-*

        console.log("数据库打开失败...");
        console.dir(e);
    }
}

function add_data(db: any, chatbox: ChatBoxtype) {
    var name = "添加数据"

    //1-把前面创建的数据库，传递过来 
    var db = db;

    //2-返回一个事务对象,indexDB 数据库只有  readwrite 以及readonly两个状态。 
    var tt = db.transaction(["swchat_msg_test001"], "readwrite");

    //3-objectStore方法用于返回指定的对象仓库(数据库表格)对象。 
    var store = tt.objectStore("swchat_msg_test001");

    //4-创建一个要添加的对象.

    //5-添加数据：add方法的第一个参数是所要添加的数据，第二个参数是这条数据对应的键名（key）       

    var request = store.add(chatbox);
    //6-添加数据：add方法也有两个事件，一个error一个success可以在回调函数中调用。
    request.onerror = function (e: any) {
        console.log("Error", e.target.error.name);
        // error handler
        console.log("数据添加失败...");
    }

    request.onsuccess = function (e: any) {
        // success handler
        console.log("数据添加成功...");

    }
}

function del_data(db: any) {

    //1-把前面创建的数据库，传递过来  

    var db = db;

    //2-返回一个事务对象,indexDB 数据库只有  readwrite 以及readonly两个可爱的状态。 返回一个事务对象。 

    var t = db.transaction(["chart"], "readwrite");

    //3-objectStore方法用于返回“数据库表格”对象。delete方法的参数是数据的键名         

    var req = t.objectStore("chart").delete(2);

    //4-删除数据：delete方法也有两个事件，一个error一个success可以在回调函数中调用。 

    req.onerror = function (e: any) {
        console.log("Error", e.target.error.name);
        // error handler
        console.log("删除数据失败!");
    }

    req.onsuccess = function (e: any) {
        // success handler
        console.log("删除数据成功!");
    }
}

function update_data(db: any) {

    //1-把前面创建的数据库，传递过来  

    var db = db;

    //2-返回一个事务对象,indexDB 数据库只有  readwrite 以及readonly两个可爱的状态。 返回一个事务对象。 

    var trans = db.transaction(["chart"], "readwrite");
    var store = trans.objectStore("chart");

    //3-创建一个要添加的对象，类似于add方法，但是这里对象的名称一定要和前面一样。              
    var o = {
        LOVE: 201314,
        M: "mayouchen",
        Z: "zhangxuejing"
    };

    //4-更新记录：put方法。  

    var request = store.put(o);
}

//遍历数据：openCursor方法 (openCursor方法，它在当前对象仓库里面建立一个读取光标（cursor）)
function traverse_data(db: any) {

    //1-把前面创建的数据库，传递过来  

    var db = db;

    //2-返回一个事务对象,indexDB 数据库只有  readwrite 以及readonly两个可爱的状态。 返回一个事务对象。 

    var trans = db.transaction(["chart"], "readwrite");

    //3-objectStore方法用于返回指定的对象仓库(数据库表格)对象。 

    var store = trans.objectStore("chart");

    //4-创建一个游标，和Oracle里面的游标一模一样，类似JAVA里面的容器遍历的iterator()就是一个性能，估计发明IndexDB的作者可能的认真学过JAVA，这里纯属虚构，忽略，忽略......   

    var cursor = store.openCursor();

    cursor.onsuccess = function (e: any) {
        var res = e.target.result;
        if (res) {
            console.log("Key", res.key);
            console.log("Data", res.value);
            store.delete(res.key)
            res.continue();

            //5-continue方法将光标移到下一个数据对象，如果当前数据对象已经是最后一个数据了，则光标指向null。
        }
    }
}

function create_index(db: any) {

    //1-设置数据库中的数据对象 

    var o = {
        LOVE: 201314,
        M: "mayouchen",
        Z: "zhangxuejing"
    };


    //2-创建索引 

    var store = db.createObjectStore("o", { autoIncrement: true });

    //3-设置索引  createIndex方法接受三个参数，第一个是索引名称，第二个是建立索引的属性名，第三个是参数对象。  

    store.createIndex("M", "M", { unique: false });
    store.createIndex("Z", "Z", { unique: true });

    //4-通过索引获取数据
    var t = db.transaction(["o"], "readonly");
    var store = t.objectStore("o");
    var index = store.index("M");

    var request = index.get("M");
    var request = index.get("M");
    console.log("通过索引获取数据:" + request);
}

export default dbHandle