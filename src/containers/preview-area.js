/* globals ResizeObserver */

import { motion, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { useContext, useEffect, useRef, useMemo, Fragment, useState } from 'react'
import AspectRatio from 'react-aspect-ratio'
import { Box, Flex, Input, Spinner, Select, Textarea, ColorPicker } from 'theme-ui'

import {
  InternalLink,
  ExternalLink,
  Button,
  LiveError,
  LivePreview
} from '@/components'

import { OVERLAY_STATE, PREVIEW_CARD_WIDTH } from '@/constants'
import { AppContext } from '@/context'
import { theme } from '@/theme'
import { useQueryVariables } from '@/context/QueryVariablesContext'
import { parseHTML, generateHTML } from '@/lib/htmlParser'

const getWidth = el => (el ? el.getBoundingClientRect().width : 0)

const DEFAULT_MAIN_WIDTH = PREVIEW_CARD_WIDTH + parseInt(theme.space[4]) * 2

const PreviewScaler = ({ mainRef, ...props }) => {
  const motionMainWidth = useMotionValue(DEFAULT_MAIN_WIDTH)
  const springMainWidth = useTransform(
    motionMainWidth,
    [300, DEFAULT_MAIN_WIDTH],
    [0.3, 1]
  )
  const scale = useSpring(springMainWidth, {
    stiffness: 150,
    damping: 120,
    mass: 1.5
  })

  useEffect(() => {
    if (mainRef.current) {
      const onResize = () => motionMainWidth.set(getWidth(mainRef.current))

      onResize()

      const resizeObserver = new ResizeObserver(onResize)
      resizeObserver.observe(mainRef.current)

      window.addEventListener('resize', onResize)

      return () => {
        window.removeEventListener('resize', onResize)
        resizeObserver.disconnect()
      }
    }
  }, [mainRef, motionMainWidth])

  return <motion.div style={{ scale }} {...props} />
}

export const PreviewArea = ({ isEditor, editorContent, setEditorContent }) => {
  const {
    downloadScreenshot,
    showOverlay,
    theme: { bg, color }
  } = useContext(AppContext)

  const { queryVariables } = useQueryVariables()
  const [previewKey, setPreviewKey] = useState(0)
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [uiMode, setUiMode] = useState(false)
  const [parsedContent, setParsedContent] = useState({
    text: '',
    image: '',
    font: 'Arial',
    backgroundColor: '#ffffff',
    textColor: '#000000'
  })

  const mainRef = useRef()

  const PreviewWrap = useMemo(() => (isEditor ? PreviewScaler : Fragment), [isEditor])

  const wrapProps = useMemo(() => (isEditor ? { mainRef } : {}), [isEditor, mainRef])

  useEffect(() => {
    setPreviewKey(prevKey => prevKey + 1)
  }, [queryVariables])

  useEffect(() => {
    if (uiMode) {
      const parsed = parseHTML(editorContent)
      setParsedContent(parsed)
    }
  }, [uiMode, editorContent])

  const handleDownload = async () => {
    if (!mainRef.current) return

    const html = mainRef.current.innerHTML
    const css = '' // Add any additional CSS here

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ html, css }),
      })

      if (!response.ok) throw new Error('Failed to generate image')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = 'preview.png'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading image:', error)
      alert('Failed to download image. Please try again.')
    }
  }

  const handleFileChange = (event) => {
    setFile(event.target.files[0])
  }

  const handleFromImage = async () => {
    if (!file) {
      alert('Please select a file')
      return
    }
    
    setLoading(true)
    
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('https://<your-cloudflare-worker-url>', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.text()
      setEditorContent(data)
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred while processing the file')
    } finally {
      setLoading(false)
    }
  }

  const handleUiChange = (key, value) => {
    setParsedContent(prev => ({ ...prev, [key]: value }))
  }

  const applyUiChanges = () => {
    const newHtml = generateHTML(parsedContent)
    setEditorContent(newHtml)
  }

  const toggleUiMode = () => {
    setUiMode(!uiMode)
  }

  return (
    <Box
      as='main'
      ref={mainRef}
      id="preview-area"
      sx={{
        flex: ['none', '', 1],
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        mb: [4, '', 0],
        mt: [-4, 3, 0],
        minHeight: 0
      }}
    >
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <AspectRatio ratio='16/9' style={{ minWidth: PREVIEW_CARD_WIDTH }}>
          <PreviewWrap {...wrapProps}>
            <LivePreview
              key={previewKey}
              onClick={isEditor ? showOverlay(OVERLAY_STATE.PREVIEW) : undefined}
              isEditor={isEditor}
              queryVariables={queryVariables}
            />
          </PreviewWrap>
        </AspectRatio>
      </Box>

      {isEditor && (
        <>
          <Flex
            sx={{
              alignItems: 'center',
              position: 'absolute',
              left: 3,
              top: 3
            }}
          >
            <ExternalLink
              href='https://cards.n0nft.com'
              title='Microlink – Browser as API'
              sx={{
                mr: 2,
                width: '24px',
                height: '24px',
                background:
                  "url('https://cdn.cards.n0nft.com/logo/logo.svg') no-repeat center center / 22px",
                fontSize: '0px',
                color: 'transparent',
                userSelect: 'none'
              }}
              rel=''
            >
              Microlink – Browser as API
            </ExternalLink>
            {[
              {
                href:
                  'https://cards.n0nft.com/docs/cards/getting-started/overview',
                children: 'Docs',
                title: 'Read documentation',
                rel: ''
              },
              {
                href: 'https://github.com/wanghaisheng/cards',
                title: 'See source code on GitHub',
                children: 'GitHub'
              },
              {
                href: 'https://twitter.com/wanghaisheng',
                title: 'Follow us on Twitter',
                children: 'Twitter'
              }
            ].map((props, key) => (
              <ExternalLink
                {...props}
                key={key}
                sx={{ color, fontSize: 0, mr: 2 }}
              />
            ))}
          </Flex>

          <Flex
            sx={{
              alignItems: 'center',
              justifyContent: 'center',
              mt: ['-18vw', '-6vw', 0],
              mb: [3, '', 0],
              position: 'relative'
            }}
          >
            <InternalLink href='#' sx={{ color }} onClick={downloadScreenshot}>
              Download
            </InternalLink>
            <Box sx={{ ml: 3 }}>
              <Button
                sx={{ color: bg, bg: color }}
                onClick={showOverlay(OVERLAY_STATE.PREVIEW)}
              >
                Embed
              </Button>
            </Box>
          </Flex>

          <Box sx={{ bottom: 0, position: 'absolute', width: '100%' }}>
            <LiveError />
          </Box>

          <Flex sx={{ flexDirection: 'column', gap: 3, mt: 3 }}>
            <Button onClick={handleDownload}>
              Download Preview
            </Button>
            <Flex sx={{ alignItems: 'center', gap: 2 }}>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              <Button onClick={handleFromImage} disabled={loading}>
                {loading ? <Spinner size={16} /> : 'From Image'}
              </Button>
            </Flex>
            <Button onClick={toggleUiMode}>
              {uiMode ? 'Switch to Code Mode' : 'Switch to UI Mode'}
            </Button>
            {uiMode && (
              <Box>
                <Textarea
                  value={parsedContent.text}
                  onChange={(e) => handleUiChange('text', e.target.value)}
                  placeholder="Enter text"
                />
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0]
                    const reader = new FileReader()
                    reader.onloadend = () => {
                      handleUiChange('image', reader.result)
                    }
                    reader.readAsDataURL(file)
                  }}
                />
                <Select
                  value={parsedContent.font}
                  onChange={(e) => handleUiChange('font', e.target.value)}
                >
                  <option>Arial</option>
                  <option>Helvetica</option>
                  <option>Times New Roman</option>
                  <option>Courier</option>
                </Select>
                <ColorPicker
                  value={parsedContent.backgroundColor}
                  onChange={(color) => handleUiChange('backgroundColor', color)}
                />
                <ColorPicker
                  value={parsedContent.textColor}
                  onChange={(color) => handleUiChange('textColor', color)}
                />
                <Button onClick={applyUiChanges}>Apply Changes</Button>
              </Box>
            )}
          </Flex>
        </>
      )}
    </Box>
  )
}