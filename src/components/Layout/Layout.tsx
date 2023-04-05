import router from 'next/router'
import style from './Layout.module.scss'
import Link from 'next/link'
import { useUserData } from '@/contexts/UserContext'

export default function Layout() {
  const userData = useUserData()

  const handleLogoutClick = () => {
    localStorage.removeItem('token')
    router.push('/')
  }

  return (
    <>
      <div className={style['nav-bar-wrapper']}>
        <div className={style['nav-bar-container']}>
          {userData?.userData.login !== '' && (
            <>
              <Link href="/panel">Issues</Link>
              <button onClick={handleLogoutClick}>Log Out</button>
            </>
          )}
        </div>
      </div>
    </>
  )
}
