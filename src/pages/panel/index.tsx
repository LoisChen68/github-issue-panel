import Card from "@/components/Card/Card"
import style from '../../styles/Panel.module.scss'
import axios from "axios"
import { useEffect, useState } from "react"
import router from "next/router"
import Search from "@/components/Search/Search"

interface IssueData {
  id: number
  title: string
  body: string
  user: User
  labels: Label[]
  repository: Repo
  number: number
}

interface User {
  avatar_url: string
}

interface Label {
  id: number
  name: string
}

interface Repo {
  name: string
  owner: Owner
}

interface Owner {
  login: string
}

const githubUrl = 'https://api.github.com'

export default function Panel() {
  const [userData, setUserData] = useState({ login: '' })
  const [issuesData, setIssuesData] = useState<Array<IssueData>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchText, setSearchText] = useState<string>('')
  const [disPlaySearchText, setDisPlaySearchText] = useState('')
  const [searchIssues, setSearchIssues] = useState<Array<IssueData>>([])

  useEffect(() => {
    const token = localStorage.getItem('token')

    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`${githubUrl}/user`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setUserData(data)
      }
      catch (e) {
        console.log(e)
        router.push('/')
      }
    }

    const fetchIssues = async () => {
      try {
        const { data } = await axios.get(`${githubUrl}/issues`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        setIsLoading(false)
        setIssuesData(data)
      }
      catch (e) {
        console.log(e)
      }
    }
    fetchUser()
    fetchIssues()
  }, [])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
  }

  useEffect(() => {
    const timeOutId = setTimeout(() => setDisPlaySearchText(searchText), 500)
    return () => clearTimeout(timeOutId)
  }, [searchText])

  useEffect(() => {
    if (disPlaySearchText) {
      const userName = userData.login
      const searchIssues = async () => {
        try {
          const token = localStorage.getItem('token')
          const { data } = await axios.get(`${githubUrl}/search/issues?q=${disPlaySearchText}+assignee:${userName}+state:open`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          setSearchIssues(data.items)
        }
        catch (e) {
          console.log(e)
        }
      }
      searchIssues()
    }
  }, [disPlaySearchText, userData.login])

  return (
    <>
      <div className={style['user-name-search-group']}>
        <h1 className={style['user-name']}>{userData.login}</h1>
        <Search value={searchText} onChange={handleSearchChange} />
      </div>
      {searchText.length !== 0 && searchIssues.length === 0 && <p>查無結果</p>}
      {searchText.length !== 0
        ? searchIssues.map(issue =>
          <div key={issue.id}>
            <Card
              label={
                issue.labels.find(item => item.name === 'Done') && 'Done' ||
                issue.labels.find(item => item.name === 'In Progress') && 'In Progress' ||
                issue.labels.find(item => item.name === 'Open') && 'Open' || 'Open'
              }
              owner={issue.repository?.owner?.login}
              repo={issue.repository?.name}
              issue_number={issue.number}
              title={issue.title}
              body={issue.body}
              imgUrl={issue.user.avatar_url}
            />
          </div>
        )
        : issuesData.length === 0 && !isLoading
          ? <p>這裡風平浪靜! 目前沒有 Issue</p>
          : issuesData.map(issue => (
            <div key={issue.id}>
              <Card
                label={
                  issue.labels.find(item => item.name === 'Done') && 'Done' ||
                  issue.labels.find(item => item.name === 'In Progress') && 'In Progress' ||
                  issue.labels.find(item => item.name === 'Open') && 'Open' || 'Open'
                }
                owner={issue.repository.owner.login}
                repo={issue.repository.name}
                issue_number={issue.number}
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