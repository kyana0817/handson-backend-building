import {
  hashKey,
  base64Encoder,
  base64Decoder,
  randomHash
} from './utils.js'

const EXPIRE_TIME = 43200000
const REFRESH_TIME  = 2592000000


function expireLimit() {
  const date = new Date()
  return date.getTime() + EXPIRE_TIME
}

export function refreshLimit() {
  const date = new Date()
  return date.getTime() + REFRESH_TIME
}

function jwtHeader () {
  return base64Encoder(JSON.stringify({
    alg: 'HS256',
    typ: 'JWT' 
  })).replace(/={1,2}$/, '')
}

function jwtPayload ({email}) {
  const date = new Date()
  return base64Encoder(JSON.stringify({
    iss: 'react_handson_connect',
    iat: date.getTime(),
    sub: email,
    exp: expireLimit()
  })).replace(/={1,2}$/, '')
}

function jwtSignature (header, payload) {
  return hashKey(`${header}.${payload}`)
}

function isExpire(expire) {
  const date = new Date()

  return date.getTime() < expire
}

export function jwtIssue (profile) {
  const header = jwtHeader()
  const payload = jwtPayload(profile)
  const signature = jwtSignature(header, payload)

  return `${header}.${payload}.${signature}`
}

export function refreshTokenIssue() {
  const refreshToken = randomHash()

  return refreshToken
}

export function checkSignature(token) {
  const [header, payload, signature] = token.split('.')
  const test = jwtSignature(header, payload)

  return test === signature
}

export function parsePayload(token) {
  const [, payload,] = token.split('.')
  
  return JSON.parse(base64Decoder(payload))
}


export function verify(token) {

  if (checkSignature(token)) {
    const payload = parsePayload(token)

    if (isExpire(payload.exp)) {
      return [true, payload]
    }

    return [false, {message: 'token refresh'}]
  }

  return [false, {message: 'bad token'}]
}
