export const isTokenExpired = (exp: number ) : boolean=> {
    const expDate = new Date(exp)
    if (expDate === null) {
        return false
    }
    return !(expDate.valueOf() > (new Date().valueOf()))
}