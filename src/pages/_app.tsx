import '@/styles/globals.scss'
import style from '@/styles/Layout.module.scss'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={style.wrapper}>
      <div className={style['nav-bar-wrapper']}>
        <div className={style['nav-bar-container']}>
          <span>Navbar</span>
        </div>
      </div>
      <div className={style.container}>
        <Component {...pageProps} />
      </div>
    </div>
  )
}
