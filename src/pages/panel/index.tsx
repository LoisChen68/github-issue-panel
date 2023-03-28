import axios from "axios"
import { useEffect, useState } from "react"

export default function Panel() {
  const [userData, setUserData] = useState({ login: '' })

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token !== undefined) {
      axios
        .get(`https://api.github.com/user`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(res => setUserData(res.data))
        .catch(err => console.log(err))
    }
  }, [])


  return <h1>{userData.login}</h1>
}