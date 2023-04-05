import Card from '@/components/Card/Card'
import style from '../../styles/Panel.module.scss'
import axios from 'axios'
import { useEffect, useState } from 'react'
import Search from '@/components/Search/Search'
import { useModalState } from '@/contexts/ModalContext'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useUserData } from '@/contexts/UserContext'

interface IssueData {
  id: number
  title: string
  body: string
  user: User
  labels: Label[]
  repository: Repo
  number: number
  created_at: string
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

const labelList = [
  { id: 0, name: 'All' },
  { id: 1, name: 'Open' },
  { id: 2, name: 'In Progress' },
  { id: 3, name: 'Done' }
]

const githubUrl = 'https://api.github.com'

export default function Panel() {
  const [issuesData, setIssuesData] = useState<Array<IssueData>>([])
  const [searchIssues, setSearchIssues] = useState<Array<IssueData>>([])
  const [filterIssues, setFilterIssues] = useState<Array<IssueData>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState(false)
  const [sort, setSort] = useState('Newest')
  const [searchText, setSearchText] = useState<string>('')
  const [disPlaySearchText, setDisPlaySearchText] = useState('')
  const [targetLabel, setTargetLabel] = useState('')
  const [page, setPage] = useState(2)
  const [hasMore, setHasMore] = useState(true)
  const modalState = useModalState()
  const userData = useUserData()

  useEffect(() => {
    const token = localStorage.getItem('token') || ''

    const fetchIssues = async () => {
      try {
        const { data } = await axios.get(
          `${githubUrl}/issues?page=1&per_page=10`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        setIsLoading(false)
        setIssuesData(data)
      } catch (e) {
        console.log(e)
      }
    }
    if (userData?.userData.login === '') {
      userData?.fetchUser(token)
    }

    fetchIssues()
  }, [userData])

  const getMoreIssues = async () => {
    const token = localStorage.getItem('token')
    try {
      const { data } = await axios.get(
        `${githubUrl}/issues?page=${page}&per_page=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      setIssuesData(issuesData.concat(data))
      if (data.length === 0) setHasMore(false)
      setPage((page) => page + 1)
    } catch (e) {
      console.log(e)
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
  }

  useEffect(() => {
    const timeOutId = setTimeout(() => setDisPlaySearchText(searchText), 500)
    return () => clearTimeout(timeOutId)
  }, [searchText])

  useEffect(() => {
    if (disPlaySearchText) {
      setFilter(false)
      setTargetLabel('')
      const userName = userData?.userData.login
      const searchIssues = async () => {
        try {
          const token = localStorage.getItem('token')
          const { data } = await axios.get(
            `${githubUrl}/search/issues?q=${disPlaySearchText}+assignee:${userName}+state:open`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
          setSearchIssues(data.items)
        } catch (e) {
          console.log(e)
        }
      }
      searchIssues()
    }
  }, [disPlaySearchText, userData?.userData.login])

  const handleLabelTagClick = (label: string) => {
    setSearchText('')
    setSearchIssues([])
    if (label === 'All') {
      setTargetLabel('')
      setFilterIssues([])
      setFilter(false)
    } else if (label !== 'All') {
      const data = issuesData.filter((issue) =>
        issue.labels.find((item) => item.name === label)
      )
      setFilter(true)
      setTargetLabel(label)
      setFilterIssues(data)
    }
  }

  const handleSortClick = () => {
    if (sort === 'Oldest') {
      setSort('Newest')
      if (!filter && searchIssues.length === 0) {
        const sortIssues = issuesData.sort((a: IssueData, b: IssueData) => {
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )
        })
        setIssuesData(sortIssues)
      }
      if (filter) {
        const sortFilterIssue = filterIssues.sort(
          (a: IssueData, b: IssueData) => {
            return (
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
            )
          }
        )
        setFilterIssues(sortFilterIssue)
      }
      if (searchIssues) {
        const sortSearchIssue = searchIssues.sort(
          (a: IssueData, b: IssueData) => {
            return (
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
            )
          }
        )
        setSearchIssues(sortSearchIssue)
      }
    } else if (sort === 'Newest') {
      setSort('Oldest')
      if (!filter && searchIssues.length === 0) {
        const sortIssues = issuesData.sort((a: IssueData, b: IssueData) => {
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          )
        })
        setIssuesData(sortIssues)
      }
      if (filter) {
        const sortFilterIssue = filterIssues.sort(
          (a: IssueData, b: IssueData) => {
            return (
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()
            )
          }
        )
        setFilterIssues(sortFilterIssue)
      }
      if (searchIssues) {
        const sortSearchIssue = searchIssues.sort(
          (a: IssueData, b: IssueData) => {
            return (
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()
            )
          }
        )
        setSearchIssues(sortSearchIssue)
      }
    }
  }

  const handleBodyClick = () => {
    modalState?.modalState !== '' && modalState?.modalState !== 'edit'
      ? modalState?.handleSetModal('')
      : modalState?.modalState
    modalState?.menuState.menu !== ''
      ? modalState?.handleSetMenu(0, '')
      : modalState?.menuState
  }

  return (
    <div onClick={handleBodyClick}>
      <div className={style['user-name-search-group']}>
        <h1 className={style['user-name']}>{userData?.userData.login}</h1>
        <Search value={searchText} onChange={handleSearchChange} />
        <div className={style['label-tags-sort-group']}>
          <ul className={style.labels}>
            {labelList.map((label) => (
              <li
                key={label.id}
                onClick={() => handleLabelTagClick(label.name)}
                className={
                  targetLabel === label.name ? style['label-on-focus'] : ''
                }
              >{`${label.name}`}</li>
            ))}
          </ul>
          <span onClick={handleSortClick}>{sort}</span>
        </div>
      </div>
      {searchText.length !== 0 && searchIssues.length === 0 ? (
        <p className={style['no-issues-text']}>查無結果</p>
      ) : (
        searchIssues.map((issue) => (
          <div key={issue.id}>
            <Card
              label={
                (issue.labels.find((item) => item.name === 'Done') && 'Done') ||
                (issue.labels.find((item) => item.name === 'In Progress') &&
                  'In Progress') ||
                (issue.labels.find((item) => item.name === 'Open') && 'Open') ||
                'No Label'
              }
              owner={issue.repository?.owner?.login}
              repo={issue.repository?.name}
              issue_number={issue.number}
              title={issue.title}
              body={issue.body}
              imgUrl={issue.user.avatar_url}
            />
          </div>
        ))
      )}
      {filter && filterIssues.length === 0 ? (
        <p className={style['no-issues-text']}>查無結果</p>
      ) : (
        filter &&
        filterIssues.map((issue) => (
          <div key={issue.id}>
            <Card
              label={
                (issue.labels.find((item) => item.name === 'Done') && 'Done') ||
                (issue.labels.find((item) => item.name === 'In Progress') &&
                  'In Progress') ||
                (issue.labels.find((item) => item.name === 'Open') && 'Open') ||
                'No Label'
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
      )}
      <InfiniteScroll
        dataLength={issuesData.length}
        next={getMoreIssues}
        hasMore={hasMore}
        loader={<p>Loading</p>}
        style={{ width: '100%', overflow: 'inherit' }}
      >
        {issuesData.length === 0 &&
        !isLoading &&
        !filter &&
        searchText.length === 0 ? (
          <p className={style['no-issues-text']}>
            這裡風平浪靜! 目前沒有 Issue
          </p>
        ) : (
          !isLoading &&
          !filter &&
          searchText.length === 0 &&
          issuesData.map((issue) => (
            <div key={issue.id}>
              <Card
                label={
                  (issue.labels.find((item) => item.name === 'Done') &&
                    'Done') ||
                  (issue.labels.find((item) => item.name === 'In Progress') &&
                    'In Progress') ||
                  (issue.labels.find((item) => item.name === 'Open') &&
                    'Open') ||
                  'No Label'
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
        )}
      </InfiniteScroll>
    </div>
  )
}
