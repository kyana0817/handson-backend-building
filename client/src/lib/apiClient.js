import storage from "../utils/storage"

class ApiClient {
  constructor (basePath) {
    this.basePath = basePath
  }

  headers () {
    const token = storage.getToken()? `Bearer ${storage.getToken()}`: undefined

    return JSON.parse(JSON.stringify({
      'Content-Type': 'Application/json',
      'Authorization': token
    }))
  }

  async get (path) {
    const res = await fetch(`${this.basePath}${path}`, {
      method: 'get',
      headers: this.headers()
    })

    if (res.ok) {
      return await res.json()
    } else {
      throw new Error()
    }
  }

  async post (path, body) {
    const res = await fetch(`${this.basePath}${path}`, {
      method: 'post',
      headers: this.headers(),
      body: JSON.stringify(body)
    })
    if (res.ok) {
      return await res.json()
    } else {
      throw new Error()
    }
  }
}


const apiClient = new ApiClient(process.env.REACT_APP_BACKEND_ENTRYPOINT)
export default apiClient
