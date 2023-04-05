import axios from 'axios'
import { useState } from 'react'
import Image from 'next/image'
import { BiDotsVertical } from 'react-icons/bi'
import style from './Card.module.scss'
import Menu from '../Menu/Menu'
import Modal from '../Modal/Modal'
import { useModalState } from '@/contexts/ModalContext'

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

const featureList = [
  { id: 1, name: 'Edit' },
  { id: 2, name: 'Delete' }
]

const githubUrl = 'https://api.github.com'

export default function Card({ owner, repo, issue_number, label, title, body, imgUrl }: CardProps) {
  const [changeLabel, setChangeLabel] = useState<string>()
  const token = localStorage.getItem('token')
  const modalState = useModalState()

  const handleLabelClick = (id: number, menu: string) => {
    modalState?.menuState.menu === 'label'
      ? modalState?.handleSetMenu(0, '')
      : modalState?.handleSetMenu(id, menu)
  }

  const handleLabelMenuItemClick = (label: string) => {
    try {
      axios.patch(`${githubUrl}/repos/${owner}/${repo}/issues/${issue_number}`, {
        labels: [`${label}`]
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      modalState?.handleSetMenu(0, '')
      setChangeLabel(label)
    }
    catch (e) {
      console.log(e)
    }
  }

  const handleDotClick = (id: number, menu: string) => {
    modalState?.menuState.menu === 'dot'
      ? modalState?.handleSetMenu(0, '')
      : modalState?.handleSetMenu(id, menu)
  }

  const handleDotMenuItemClick = (feature: string) => {
    if (feature === 'Delete') {
      try {
        axios.patch(`${githubUrl}/repos/${owner}/${repo}/issues/${issue_number}`, {
          state: 'closed'
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      }
      catch (e) {
        console.log(e)
      }
    }
    if (feature === 'Edit') {
      modalState?.handleSetModal('edit')
    }
    modalState?.handleSetMenu(0, '')
  }

  const handleCloseClick = () => {
    modalState?.handleSetModal('')
  }

  return (
    <div className={style.wrapper}>
      <div className={style.container}>
        <div className={style['label-dot-icon-group']}>
          <div className={style['label-menu-group']}>
            {changeLabel
              ? <div className={style[`label-${changeLabel.toLocaleLowerCase().replace(' ', '-')}`]} onClick={() => handleLabelClick(issue_number, 'label')}>
                {changeLabel}
              </div>
              : <div className={style[`label-${label.toLocaleLowerCase().replace(' ', '-')}`]} onClick={() => handleLabelClick(issue_number, 'label')}>
                {label}
              </div>
            }
            {modalState?.menuState.id === issue_number && modalState?.menuState.menu === 'label' && <Menu menuName='label' menuList={labelList} onMenuItemClick={handleLabelMenuItemClick} />}
          </div>
          <div className={style['dot-menu-group']}>
            <div className={style['dot-icon']} onClick={() => handleDotClick(issue_number, 'dot')}>
              <BiDotsVertical />
            </div>
            {modalState?.menuState.id === issue_number && modalState?.menuState.menu === 'dot' && <Menu menuName='feature' menuList={featureList} onMenuItemClick={handleDotMenuItemClick} />}
          </div>
        </div>
        <div className={style['avatar-title-group']}>
          <Image src={imgUrl} alt="avatar" width={30} height={30} className={style.avatar} />
          <p className={style.title}>{title}</p>
        </div>
        <p className={style.body}>{body}</p>
        <p>Repo: {repo}</p>
      </div>
      {modalState?.modalState === 'edit' &&
        <Modal
          owner={owner}
          repo={repo}
          issue_number={issue_number}
          title={title}
          body={body}
          onCloseClick={handleCloseClick} />}
    </div>
  )
}