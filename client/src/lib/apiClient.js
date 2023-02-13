import storage from "../utils/storage"
import { refresh } from "./auth"

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
    const data = await res.json()
    if (res.ok) {
      return data
    } else if (data.message === 'token refresh') {
      await refresh()
      return await this.get(path)
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
    const data = await res.json()
    if (res.ok) {
      return data
    } else if (data.message === 'token refresh') {
      await refresh()
      return await this.post(path, body)
    } else {
      throw new Error()
    }
  }

  async delete (path) {
    const res = await fetch(`${this.basePath}${path}`, {
      method: 'delete',
      headers: this.headers()
    })
    const data = await res.json()
    if (res.ok) {
      return data
    } else if (data.message === 'token refresh') {
      await refresh()
      return await this.delete(path)
    } else {
      throw new Error()
    }
  }
}


const apiClient = new ApiClient(process.env.REACT_APP_BACKEND_ENTRYPOINT)
export default apiClient
