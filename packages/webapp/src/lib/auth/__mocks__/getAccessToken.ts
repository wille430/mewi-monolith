import * as crypto from 'crypto'

export const getAccessToken = jest.fn().mockReturnValue(crypto.randomUUID())
