import Head from 'next/head'
import { FC } from 'react'
import styles from './BasePage.module.scss'

const DEFAULT_TITLE = 'Default Title'

interface Props {
  title?: string
}

export const BasePage: FC<Props> = ({ children, title = DEFAULT_TITLE }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} key="title" />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
          crossOrigin="anonymous"
        ></link>
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
