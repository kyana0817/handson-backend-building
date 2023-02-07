const SECRET_KEY = 'abcdefghijklnmop12345'

const { createHmac } = await import('node:crypto')

export function hashKey(plain) {
  const hmac = createHmac('sha256', SECRET_KEY)
  hmac.update(plain)
  return hmac.digest('hex');
}

export function base64Encoder(plain) {
  const buff = new Buffer.from(plain, 'utf8')
  return buff.toString('base64')
}

export function base64Decoder(encoded) {
  const buff = new Buffer.from(encoded, 'base64')
  return buff.toString('utf8')
}

export function randomHash() {
  const str = Math.random().toString(36).slice(5, 20);
  return hashKey(str)
}
