class storage {
    // 本地存储 username
    setLocalUsername(username: string) {
        localStorage.setItem("username", username)
    }
    getLocalUsername(): string | null {
        return localStorage.getItem("username")
    }
    // 本地存储password
    setLocalPassword(pw: string) {
        localStorage.setItem("password", pw)
    }
    getLocalPassword(): string | null {
        return localStorage.getItem("password")
    }
    // 本地存储userid
    setLocalUserid(id: string) {
        localStorage.setItem("userid", id)
    }
    getLocalUserid(): string | null {
        return localStorage.getItem("userid")
    }
    // 本地存储client
    setLocalClientid(id: string) {
        localStorage.setItem("clientid", id)
    }
    getLocalClientid(): string | null {
        return localStorage.getItem("clientid")
    }
    // 本地存储roomid
    setLocalRoomid(roomid: string) {
        localStorage.setItem("roomid", roomid)
    }
    getLocalRoomid(): string | null {
        return localStorage.getItem("roomid")
    }
}

export default new storage()