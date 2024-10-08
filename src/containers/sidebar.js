import { useCallback, useContext, useState, useRef } from 'react'
import { Box, Flex, Input, Button, Switch, Label as ThemeUILabel } from 'theme-ui'
import dynamic from 'next/dynamic';
import { saveAs } from 'file-saver'
import { toPng } from 'html-to-image';

import {
  ButtonIcon,
  JSONViewer,
  Label,
  LiveEditor,
  SearchableSelect,
  VerticalDragBar
} from '@/components'
import {
  GitHubIcon,
  InfoIcon,
  KeyboardIcon,
  ThemeIcon
} from '@/components/icons'
import {
  ASIDE_MAX_WIDTH,
  ASIDE_MIN_WIDTH,
  ASIDE_WIDTH_KEY,
  DEFAULT_ASIDE_WIDTH,
  OVERLAY_STATE,
  SEARCH_WIDTH
} from '@/constants'
import { useWindowSize } from '@/hooks'
import { AppContext } from '@/context'
import { getPresetSlug, store } from '@/lib'

export const Sidebar = () => {
  const size = useWindowSize()
  const {
    changeTheme,
    code,
    colorMode,
    handleCode,
    handlePresetChange,
    handleQueryVariables,
    presetOptions,
    presetRef,
    queryVariables,
    showOverlay,
    theme
  } = useContext(AppContext)
  const { color, bg, borderColor, iconColor } = theme

  const [asideWidth, setAsideWidth] = useState(
    store.get(ASIDE_WIDTH_KEY) || DEFAULT_ASIDE_WIDTH
  )
  const [url, setUrl] = useState('')
  const [isEditorExpanded, setIsEditorExpanded] = useState(false)
  const [isQueryVarExpanded, setIsQueryVarExpanded] = useState(true)
  const [isUIMode, setIsUIMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleWidthResize = useCallback(width => {
    setAsideWidth(width)
    store.set(ASIDE_WIDTH_KEY, width)
  }, [])

  const presetSelectValue = getPresetSlug(presetRef.current.name)

  const handleSelectChange = useCallback(
    event => handlePresetChange(event.value),
    [handlePresetChange]
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      console.log('Fetching title for URL:', url)
      const response = await fetch(`https://get-title.v2ray-tokyo.workers.dev/?url=${encodeURIComponent(url)}`)
      console.log('Response status:', response.status)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Parsed data:', data)
      
      const { title } = data
      if (title) {
        console.log('Title found:', title)
        const updatedVariables = { ...queryVariables, title: title }
        handleQueryVariables(updatedVariables)
        setUrl('')
      } else {
        console.log('No title found in response')
        throw new Error('No title found in response')
      }
    } catch (error) {
      console.error('Error fetching title:', error)
      alert(`Failed to fetch title: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleEditor = () => {
    setIsEditorExpanded(!isEditorExpanded)
  }

  const toggleQueryVar = () => {
    setIsQueryVarExpanded(!isQueryVarExpanded)
  }

  const toggleEditorMode = () => {
    setIsUIMode(!isUIMode)
  }

  const handleInputChange = (key, value) => {
    handleQueryVariables({ ...queryVariables, [key]: value })
  }

  const handleDownload = async () => {
    try {
      const previewElement = document.getElementById('preview-area');
      if (!previewElement) {
        console.error('Preview element not found');
        alert('Unable to generate image: Preview element not found');
        return;
      }

      const dataUrl = await toPng(previewElement, { quality: 0.95 });
      
      const link = document.createElement('a');
      link.download = 'preview.png';
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
      alert(`Failed to generate image: ${error.message}`);
    }
  }

  const renderUIEditor = () => {
    return (
      <Box sx={{ mt: 3 }}>
        {Object.entries(queryVariables).map(([key, value]) => (
          <Box key={key} sx={{ mb: 2 }}>
            <ThemeUILabel htmlFor={key} sx={{ mb: 1, display: 'block' }}>
              {key}
            </ThemeUILabel>
            <Input
              id={key}
              value={value}
              onChange={(e) => handleInputChange(key, e.target.value)}
              sx={{
                width: '100%',
                borderRadius: '6px',
                border: '1px solid',
                borderColor: 'gray.3',
                padding: '8px',
                '&:focus': {
                  outline: 'none',
                  borderColor: '#6366F1',
                  boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.2)',
                },
              }}
            />
          </Box>
        ))}
      </Box>
    )
  }

  const modernButtonStyle = {
    background: 'linear-gradient(45deg, #6366F1, #8B5CF6)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '10px 16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
      background: 'linear-gradient(45deg, #4F46E5, #7C3AED)',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      transform: 'translateY(-2px)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
  }

  return (
    <Flex
      as='aside'
      sx={{
        borderLeft: 1,
        borderColor,
        bg,
        flexDirection: 'column',
        fontFamily: 'mono',
        fontSize: 2,
        fontWeight: 'light',
        height: '100vh',
        maxWidth: ['100%', '', ASIDE_MAX_WIDTH(size)],
        minWidth: ASIDE_MIN_WIDTH,
        position: 'relative',
        width: ['100%', '', asideWidth],
        willChange: 'width',
        display: 'flex',
      }}
    >
      <VerticalDragBar onDrag={handleWidthResize} />

      <Flex
        as='header'
        sx={{
          alignItems: 'center',
          bg,
          borderBottom: 1,
          borderTop: [1, '', 0],
          borderColor,
          p: 3,
          color,
          justifyContent: 'space-between',
          flex: '0 0 auto'
        }}
      >
        <Box sx={{ flex: `0 1 ${SEARCH_WIDTH}`, mr: 3 }}>
          <SearchableSelect
            color={color}
            bg={bg}
            selectedValue={presetSelectValue}
            options={presetOptions}
            onChange={handleSelectChange}
          />
        </Box>

        <Flex
          sx={{
            alignItems: 'center',
            flex: '0 0 auto'
          }}
        >
          <ButtonIcon
            as='button'
            title='Show keybindings'
            color={iconColor}
            hoverColor={color}
            onClick={showOverlay(OVERLAY_STATE.KEYBINDINGS)}
          >
            <KeyboardIcon />
          </ButtonIcon>
          <Box sx={{ ml: '6px' }}>
            <ButtonIcon
              as='button'
              title='Learn more about the project'
              color={iconColor}
              hoverColor={color}
              onClick={showOverlay(OVERLAY_STATE.ABOUT)}
            >
              <InfoIcon />
            </ButtonIcon>
          </Box>
          <Box sx={{ ml: '6px' }}>
            <ButtonIcon
              as='a'
              href='https://github.com/wanghaisheng/cards'
              target='_blank'
              rel='noopener noreferrer'
              title='See on GitHub'
              color={iconColor}
              hoverColor={color}
            >
              <GitHubIcon />
            </ButtonIcon>
          </Box>
          <Box sx={{ ml: '6px' }}>
            <ButtonIcon
              as='button'
              title='Toggle theme'
              color={iconColor}
              hoverColor={color}
              onClick={changeTheme}
            >
              <ThemeIcon />
            </ButtonIcon>
          </Box>
        </Flex>
      </Flex>

      <Button 
        onClick={handleDownload} 
        sx={{ 
          ...modernButtonStyle,
          m: 2,
          width: 'calc(100% - 16px)',
        }}
      >
        Download Preview
      </Button>

      <Button 
        onClick={toggleEditor} 
        sx={{ 
          ...modernButtonStyle,
          m: 2,
          width: 'calc(100% - 16px)',
        }}
      >
        {isEditorExpanded ? 'Collapse Editor' : 'Expand Editor'}
      </Button>

      <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {isEditorExpanded && (
          <Box
            sx={{
              borderBottom: 1,
              borderColor,
              pl: 3,
              overflow: 'hidden',
              flex: 1,
              minHeight: 0,
            }}
          >
            <Box sx={{ position: 'relative' }}>
              <Label sx={{ color, borderColor, textTransform: 'lowercase' }}>
                Editor
              </Label>
            </Box>

            <Box sx={{ height: 'calc(100% - 30px)', overflow: 'auto' }}>
              <LiveEditor
                theme={theme}
                themeKey={colorMode}
                code={code}
                onChange={handleCode}
              />
            </Box>
          </Box>
        )}

        <Box sx={{ flex: 1, minHeight: 0, borderTop: 1, borderColor, display: 'flex', flexDirection: 'column' }}>
          <Flex sx={{ alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
            <Label sx={{ color, borderColor, textTransform: 'lowercase' }}>
              Query Variables
            </Label>
            <Flex>
              <Button 
                onClick={toggleQueryVar} 
                sx={{ 
                  ...modernButtonStyle,
                  padding: '6px 12px',
                  fontSize: '14px',
                  mr: 2
                }}
              >
                {isQueryVarExpanded ? 'Collapse' : 'Expand'}
              </Button>
              <Flex sx={{ alignItems: 'center' }}>
                <ThemeUILabel htmlFor="editor-mode-switch" sx={{ mr: 2, color }}>
                  UI Mode
                </ThemeUILabel>
                <Switch
                  id="editor-mode-switch"
                  checked={isUIMode}
                  onChange={toggleEditorMode}
                />
              </Flex>
            </Flex>
          </Flex>

          {isQueryVarExpanded && (
            <Box sx={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
              <Box
                as='section'
                sx={{
                  bg,
                  p: 3,
                }}
              >
                {isUIMode ? (
                  renderUIEditor()
                ) : (
                  <JSONViewer theme={theme} onChange={handleQueryVariables}>
                    {queryVariables}
                  </JSONViewer>
                )}
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      <Box sx={{ p: 3, borderTop: 1, borderColor }}>
        <form onSubmit={handleSubmit}>
          <Flex sx={{ alignItems: 'center' }}>
            <Input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL"
              required
              sx={{ 
                flex: 1, 
                mr: 2,
                borderRadius: '6px',
                border: '1px solid',
                borderColor: 'gray.3',
                padding: '10px',
                '&:focus': {
                  outline: 'none',
                  borderColor: '#6366F1',
                  boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.2)',
                },
              }}
            />
            <Button 
              type="submit" 
              sx={modernButtonStyle}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Get Title'}
            </Button>
          </Flex>
        </form>
      </Box>
    </Flex>
  )
}