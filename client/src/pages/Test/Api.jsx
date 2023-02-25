import { useState, useEffect } from 'react'
import apiClient from '../../lib/apiClient'

export default function Api () {
  const [data, setData] = useState({})

  useEffect(() => {
    (async () => {
      const res = await apiClient.get('/client')
      setData(res)
    })()
  }, [])

  return (
    <div>
      <p>http://localhost:8000/client</p>
      <p>
        response: <br/>
        {JSON.stringify(data)}
      </p>
    </div>
  )
}