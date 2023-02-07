const baseurl = process.env.REACT_APP_AUTH_ENTRYPOINT


export async function test() {
  const res = await ( await  fetch(`${baseurl}`, {
    method: 'get',
    headers: {
      'Content-Type': 'Application/json'
    }
  })).json()

  console.log(res)

}


export async function signup(email, password) {
  const res = await ( await  fetch(`${baseurl}/register`, {
    method: 'post',
    headers: {
      'Content-Type': 'Application/json'
    },
    body: JSON.stringify({email, password})
  })).json()

  console.log(res)
}