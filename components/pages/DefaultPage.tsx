import Head from 'next/head'
import { FC, ReactElement } from 'react'
import { DefaultBodyComponent, DEFAULT_TITLE } from './constants'

interface Props {
  bodyElement?: ReactElement
  title?: string
}

export const DefaultPage: FC<Props> = ({
  bodyElement = <DefaultBodyComponent />,
  title = DEFAULT_TITLE,
}) => {
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
      <div
        className="container"
        style={{ marginBottom: '1rem', marginTop: '1rem' }}
      >
        <h1>{title}</h1>
        <main>{bodyElement}</main>
      </div>
    </>
  )
}
