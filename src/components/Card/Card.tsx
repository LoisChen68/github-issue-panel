import axios from 'axios'
import { useState } from 'react'
import Image from 'next/image'
import { BiDotsVertical } from 'react-icons/bi'
import style from './Card.module.scss'
import Menu from '../Menu/Menu'

interface CardProps {
  label: string
  title: string
  body: string
  imgUrl: string
  owner: string
  repo: string
  issue_number: number
}

const labelList = [
  { id: 1, name: 'Open' },
  { id: 2, name: 'In Progress' },
  { id: 3, name: 'Done' }
]

const githubUrl = 'https://api.github.com'

export default function Card({ owner, repo, issue_number, label, title, body, imgUrl }: CardProps) {
  const [labelMenu, setLabelMenu] = useState(false)
  const [changeLabel, setChangeLabel] = useState<string>()
  const token = localStorage.getItem('token')

  const handleLabelClick = () => {
    !labelMenu ? setLabelMenu(true) : setLabelMenu(false)
  }

  const handleMenuItemClick = (label: string) => {
    try {
      axios.patch(`${githubUrl}/repos/${owner}/${repo}/issues/${issue_number}`, {
        labels: [`${label}`]
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      setLabelMenu(false)
      setChangeLabel(label)
    }
    catch (e) {
      console.log(e)
    }
  }

  return (
    <div className={style.wrapper}>
      <div className={style.container}>
        <div className={style['label-dot-icon-group']}>
          <div className={style['label-menu-group']}>
            {changeLabel
              ? <div className={style[`label-${changeLabel.toLocaleLowerCase().replace(' ', '-')}`]} onClick={handleLabelClick}>
                {changeLabel}
              </div>
              : <div className={style[`label-${label.toLocaleLowerCase().replace(' ', '-')}`]} onClick={handleLabelClick}>
                {label}
              </div>
            }
            {labelMenu && <Menu menuList={labelList} onMenuItemClick={handleMenuItemClick} />}
          </div>
          <div className={style['dot-icon']}><BiDotsVertical /></div>
        </div>

        <div className={style['avatar-title-group']}>
          <Image src={imgUrl} alt="avatar" width={30} height={30} className={style.avatar} />
          <p className={style.title}>{title}</p>
        </div>
        <p className={style.body}>{body}</p>
      </div>
    </div>
  )
}