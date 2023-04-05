import style from './Menu.module.scss'
import { BiEdit } from 'react-icons/bi'
import { MdDeleteOutline } from 'react-icons/md'

interface MenuProps {
  menuList: MenuItem[]
  menuName: string
  onMenuItemClick: (e: string) => void
}

interface MenuItem {
  id: number
  name: string
}

export default function Menu({
  onMenuItemClick,
  menuName,
  menuList
}: MenuProps) {
  return (
    <ul className={style[`wrapper-${menuName}`]}>
      {menuList.map((item: MenuItem) => (
        <li
          className={style[`li-${item.name.toLowerCase().replace(' ', '-')}`]}
          onClick={() => onMenuItemClick(item.name)}
          key={item.id}
        >
          {menuName === 'label' && `■ ${item.name}`}
          {menuName === 'feature' && item.name === 'Edit' && (
            <>
              <span>
                <BiEdit />{' '}
              </span>
              <span>Edit</span>{' '}
            </>
          )}
          {menuName === 'feature' && item.name === 'Delete' && (
            <>
              <span>
                <MdDeleteOutline />{' '}
              </span>
              <span>Delete</span>
            </>
          )}
        </li>
      ))}
    </ul>
  )
}
