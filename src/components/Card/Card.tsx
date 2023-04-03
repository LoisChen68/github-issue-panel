import style from './Card.module.scss'
import Image from 'next/image'
import { BiDotsVertical } from 'react-icons/bi'

interface data {
  label: string
  title: string
  body: string
  imgUrl: string
}



export default function Card({ label, title, body, imgUrl }: data) {
  return (
    <div className={style.wrapper}>
      <div className={style.container}>
        <div className={style['label-dot-icon-group']}>
          {label === 'Open' && <div className={style['label']}>{label}</div>}
          {label === 'In Progress' && <div className={style['label-progress']}>{label}</div>}
          {label === 'Done' && <div className={style['label-done']}>{label}</div>}
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