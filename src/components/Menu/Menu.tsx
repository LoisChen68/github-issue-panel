import style from './Menu.module.scss'

interface MenuProps {
  menuList: MenuItem[]
  onMenuItemClick: (e: string) => void
}

interface MenuItem {
  id: number
  name: string
}


export default function Menu({ onMenuItemClick, menuList }: MenuProps) {

  return (
    <ul className={style.wrapper}>
      {menuList.map((item: MenuItem) =>
        <li
          className={style[`li-${item.name.toLowerCase().replace(' ', '-')}`]}
          onClick={() => onMenuItemClick(item.name)}
          key={item.id}
        >
          ■ {item.name}
        </li>
      )}
    </ul>
  )
}