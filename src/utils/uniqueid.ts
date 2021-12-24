export default function uuid2(len:number) :string {
    var chars: Array<string> = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid: Array<string> = [];

    if (len) {
        for (let i = 0; i < len; i++) {
            uuid[i] = chars[0 | Math.random() * chars.length];
        }
    }

    let id:string = `sw_${uuid.join('')}_${new Date().getTime()}`
 
    return id;
}
