import storage from "../utils/storage"

const baseurl = process.env.REACT_APP_AUTH_ENTRYPOINT

export async function signup(email, password) {
  storage.clear()

  const res = await fetch(`${baseurl}/register`, {
    method: 'post',
    headers: {
      'Content-Type': 'Application/json'
    },
    body: JSON.stringify({email, password})
  })

  if (res.ok) {
    const token = await res.json()
    storage.store(token)
  } else {
    throw new Error()    
  }  
}

export async function login(email, password) {
  storage.clear()

  const res = await fetch(`${baseurl}/login`, {
    method: 'post',
    headers: {
      'Content-Type': 'Application/json'
    },
    body: JSON.stringify({email, password})
  })

  if (res.ok) {
    const token = await res.json()
    storage.store(token)
  } else {
    throw new Error()
  }
}
