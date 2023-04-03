import axios from "axios"
import { useEffect } from "react"
import router from 'next/router'

export default function Load() {
  useEffect(() => {
    const url = window.location.href
    const code = url.split("?code=")[1]
    axios
      .get(`/api/getAccessToken?code=${code}`)
      .then(res => {
        localStorage.setItem('token', res.data.access_token)
        router.push('/panel')
      })
      .catch(err => console.log(err))
  }, [])
}