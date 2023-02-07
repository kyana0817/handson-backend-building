import { createClient } from 'redis'

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

export function refreshTokenSet({email}, refreshToken) {
  client.hSet(`user:${email}`, 'refreshLimit', refreshLimit(), 'refreshToken', refreshToken)
}

export async function userExist({email, password}) {
  const hashPassword = hashKey(password)
  const savedPassword = await client.hGet(`user:${email}`, 'password') 

  return hashPassword === savedPassword
}

export async function fetchApplicationId({email}) {
  return await client.hGet(`user:${email}`, 'applicationId')
}
