class ApiClient {
  constructor (basePath) {
    this.basePath = basePath
  }

  async get (path) {
    return await fetch(`${this.basePath}${path}`, {
      method: 'get',
      headers: {
        'Content-Type': 'Application/json'
      }
    })
  }

  async post (path, body) {
    return await fetch(`${this.basePath}${path}`, {
      method: 'post',
      headers: {
        'Content-Type': 'Application/json'
      },
      body: JSON.stringify(body)
    })
  }
}


const apiClient = new ApiClient(process.env.REACT_APP_BACKEND_ENTRYPOINT)
export default apiClient
