import storage from "../utils/storage"

const baseurl = process.env.REACT_APP_AUTH_ENTRYPOINT

export async function test() {
  const res = await ( await (`${baseurl}`, {
    method: 'get',
    headers: {
      'Content-Type': 'Application/json'
    }
  })).json()

  console.log(res)

}


export async function signup(email, password) {
  const res = await  fetch(`${baseurl}/register`, {
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
