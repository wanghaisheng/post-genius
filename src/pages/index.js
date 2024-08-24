import { AppFrame, Spinner } from '@/components'
import { useEffect, useState } from 'react'
import { PreviewArea, Sidebar } from '@/containers'
import { useRouter } from 'next/router'
import { Box, Flex } from 'theme-ui'

export default function Index () {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(false)
  }, [])

  return (
    <AppFrame>
      {isLoading ? (
        <Spinner />
      ) : (
        <Flex sx={{ width: '100%', height: '100%' }}>
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            <PreviewArea isEditor={false} />
          </Box>
          <Sidebar />
        </Flex>
      )}
    </AppFrame>
  )
}