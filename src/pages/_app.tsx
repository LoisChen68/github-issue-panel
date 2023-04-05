import '@/styles/globals.scss'
import '@/styles/reset.scss'
import style from '@/styles/Layout.module.scss'
import type { AppProps } from 'next/app'
import router from 'next/router'
import ModalContextProvider from '@/contexts/ModalContext'
import Link from 'next/link'

export default function App({ Component, pageProps }: AppProps) {

  const handleLogoutClick = () => {
    localStorage.removeItem('token')
    router.push('/')
  }

  return (
    <ModalContextProvider>
      <div className={style['nav-bar-wrapper']}>
        <div className={style['nav-bar-container']}>
          <Link href='/panel'>Issues</Link>
          <button onClick={handleLogoutClick}>Log Out</button>
        </div>
      </div>
      <div className={style.container}>
        <Component {...pageProps} />
      </div>
    </ModalContextProvider>
  )
}
