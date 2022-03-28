export * from './lib/types'
export * from './lib/database'
export * from './lib/filterData'
export * from './lib/errorCodes'
import { Auth } from './lib/errorCodes'

class _Types {
    private _auth = new Auth()
    get Auth() {
        return this._auth
    }
}

class Mewi {
    private _types = new _Types()
    get Types() {
        return this._types
    }
}

const mewi = new Mewi()

export default mewi
export const Types = mewi.Types
