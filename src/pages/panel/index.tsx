import Card from "@/components/Card/Card"
import style from '../../styles/Panel.module.scss'
import axios from "axios"
import { useEffect, useState } from "react"
import router from "next/router"

interface IssueData {
  id: number
  title: string
  body: string
  user: User
  labels: Label[]
}

interface User {
  avatar_url: string
}

interface Label {
  id: number
  name: string
}

export default function Panel() {
  const [userData, setUserData] = useState({ login: '' })
  const [issuesData, setIssuesData] = useState<Array<IssueData>>([])
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    const token = localStorage.getItem('token')
    axios
      .get(`https://api.github.com/user`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => setUserData(res.data))
      .catch(err => {
        console.log(err)
        router.push('/')
      })

    axios.get(`https://api.github.com/issues`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        setIsLoading(false)
        setIssuesData(res.data)
      })
      .catch(err => console.log(err))
  }, [])
  return (
    <>
      <h1 className={style['user-name']}>{userData.login}</h1>
      {issuesData.length === 0 && !isLoading
        ? <p>這裡風平浪靜! 目前沒有 Issue</p>
        : issuesData.map(issue => (
          <div key={issue.id}>
            <Card
              label={
                issue.labels.find(item => item.name === 'Done') && 'Done' ||
                issue.labels.find(item => item.name === 'In Progress') && 'In Progress' ||
                issue.labels.find(item => item.name === 'Open') && 'Open' || 'Open'
              }
              title={issue.title}
              body={issue.body}
              imgUrl={issue.user.avatar_url}
            />
          </div>
        ))
      }

    </>
  )
}