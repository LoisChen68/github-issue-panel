import '@/styles/globals.scss'
import '@/styles/reset.scss'
import style from '@/styles/Layout.module.scss'
import type { AppProps } from 'next/app'
import router from 'next/router'

export default function App({ Component, pageProps }: AppProps) {
  function handleLogoutClick() {
    localStorage.removeItem('token')
    router.push('/')
  }
  return (
    <div className={style.wrapper}>
      <div className={style['nav-bar-wrapper']}>
        <div className={style['nav-bar-container']}>
          <span>Navbar</span>
          <button onClick={handleLogoutClick}>Log Out</button>
        </div>
      </div>
      <div className={style.container}>
        <Component {...pageProps} />
      </div>
    </div>
  )
}
