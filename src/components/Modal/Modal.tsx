import { useState } from 'react'
import { IoMdClose } from 'react-icons/io'
import style from './Modal.module.scss'
import axios from 'axios'
import { useModalState } from '@/contexts/ModalContext'

interface ModalProps {
  owner: string
  repo: string
  issue_number: number
  title: string
  body: string
  onCloseClick: (e: React.MouseEvent) => void
}

const githubUrl = 'https://api.github.com'

export default function Modal({
  onCloseClick,
  owner,
  repo,
  issue_number,
  title,
  body
}: ModalProps) {
  const token = localStorage.getItem('token')
  const [titleText, setTitleText] = useState(title)
  const [bodyText, setBodyText] = useState(body)
  const modalState = useModalState()

  const handleSaveClick = () => {
    try {
      axios.patch(
        `${githubUrl}/repos/${owner}/${repo}/issues/${issue_number}`,
        {
          title: titleText,
          body: bodyText
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
    } catch (e) {
      console.log(e)
    }
    modalState?.handleSetModal('')
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitleText(e.target.value)
  }

  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBodyText(e.target.value)
  }

  return (
    <>
      <div className={style.wrapper}>
        <div className={style.container}>
          <span className={style.close} onClick={onCloseClick}>
            <IoMdClose />
          </span>
          <input
            defaultValue={titleText}
            onChange={(e) => handleTitleChange(e)}
          />
          <textarea
            defaultValue={bodyText}
            rows={10}
            onChange={(e) => handleBodyChange(e)}
          />
          <button onClick={handleSaveClick}>Save</button>
        </div>
      </div>
      <div
        className={style.backdrop}
        onClick={() => modalState?.handleSetModal('')}
      />
    </>
  )
}
