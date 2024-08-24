import { createGlobalStyle } from 'styled-components'
import { ThemeUIProvider } from 'theme-ui'
import { useState, useEffect } from 'react'
import 'react-aspect-ratio/aspect-ratio.css'

import { notificationStyles } from '@/lib/notification'
import AppContextProvider from '@/context'
import { theme } from '@/theme'
import ErrorBoundary from '../components/ErrorBoundary'
import { useQueryVariables, QueryVariablesProvider } from '@/context/QueryVariablesContext'
import { PreviewArea } from '@/containers/preview-area'

const GlobalStylesheet = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  html {
    background: rgba(255, 255, 255, 0.1);
  }

  ${notificationStyles(theme)}
`

function MyApp({ Component, pageProps }) {
  return (
    <QueryVariablesProvider>
      <AppWithQueryVariables Component={Component} pageProps={pageProps} />
    </QueryVariablesProvider>
  )
}

function AppWithQueryVariables({ Component, pageProps }) {
  const { queryVariables } = useQueryVariables()
  const [previewKey, setPreviewKey] = useState(0)

  useEffect(() => {
    setPreviewKey(prevKey => prevKey + 1)
  }, [queryVariables])

  return (
    <ThemeUIProvider theme={theme}>
      <GlobalStylesheet />
      <ErrorBoundary>
        <AppContextProvider>
          <Component {...pageProps} />
          <PreviewArea queryVariables={queryVariables} key={previewKey} />
        </AppContextProvider>
      </ErrorBoundary>
    </ThemeUIProvider>
  )
}

export default MyApp