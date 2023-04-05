import axios from 'axios'
import router from 'next/router'
import { createContext, useContext, useState } from 'react'

interface UserDataContextData {
  fetchUser: (token: string) => void
  userData: UserData
}

interface UserData {
  login: string
}

const userDataContext = createContext<UserDataContextData | undefined>(
  undefined
)

const githubUrl = 'https://api.github.com'

export default function UserDataContextProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [userData, setUserData] = useState<UserData>({ login: '' })

  const fetchUser = async (token: string) => {
    try {
      const { data } = await axios.get(`${githubUrl}/user`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setUserData(data)
    } catch (e) {
      console.log(e)
      router.push('/')
    }
  }

  const userDataContextData: UserDataContextData = {
    fetchUser,
    userData
  }
  return (
    <userDataContext.Provider value={userDataContextData}>
      {children}
    </userDataContext.Provider>
  )
}

export function useUserData() {
  return useContext(userDataContext)
}
