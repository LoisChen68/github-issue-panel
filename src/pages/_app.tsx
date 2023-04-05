import '@/styles/globals.scss'
import '@/styles/reset.scss'
import style from '@/styles/App.module.scss'
import type { AppProps } from 'next/app'
import ModalContextProvider from '@/contexts/ModalContext'
import Layout from '@/Layout/Layout'
import UserDataContextProvider from '@/contexts/UserContext'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ModalContextProvider>
      <UserDataContextProvider>
        <Layout />
        <div className={style.container}>
          <Component {...pageProps} />
        </div>
      </UserDataContextProvider>
    </ModalContextProvider>
  )
}
