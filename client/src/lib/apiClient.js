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
    return await fetch(`${this.basePath}${path}`, {
      method: 'get',
      headers: this.headers()
    })
  }

  async post (path, body) {
    return await (await fetch(`${this.basePath}${path}`, {
      method: 'post',
      headers: this.headers(),
      body: JSON.stringify(body)
    })).json()
  }
}


const apiClient = new ApiClient(process.env.REACT_APP_BACKEND_ENTRYPOINT)
export default apiClient
