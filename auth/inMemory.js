import { createClient } from 'redis'
import _ from 'lodash'

import {
  hashKey
} from './utils.js'
import { refreshLimit } from './jwt.js'

const client = createClient({password: 'password'})

await client.connect()

export function registerUser({email, password}) {
  const hashPassword = hashKey(password)
  client.hSet(`user:${email}`, 'password', hashPassword)
}

export function setRefreshToken({email}, refreshToken) {
  client.hSet(`user:${email}`, {
    refreshLimit: refreshLimit(),
    refreshToken: refreshToken
  })
}

export function setUserAttributes({sub}, attributes) {
  client.hSet(`user:${sub}`, attributes)
}

export async function userExist({email}) {
  const user = await client.hGetAll(`user:${email}`)
  
  return !(_.isEmpty(user))
}

export async function authenticate({email, password}) {
  const hashPassword = hashKey(password)
  const savedPassword = await client.hGet(`user:${email}`, 'password')

  return hashPassword === savedPassword
}

export async function fetchUser(email) {
  return await client.hGetAll(`user:${email}`)
}
