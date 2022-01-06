import 'antd/dist/antd.css'
import Head from 'next/head'
import { FC } from 'react'
import styles from './AntdBasePage.module.scss'

const DEFAULT_TITLE = 'Default Title'

interface Props {
  title?: string
}

export const AntdBasePage: FC<Props> = ({
  children,
  title = DEFAULT_TITLE,
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} key="title" />
      </Head>
      <main className={styles.main}>
        <div className="container">
          <h1>{title}</h1>
          {children}
        </div>
      </main>
    </>
  )
}
