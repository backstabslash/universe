import {
  Box,
  Flex,
  Button,
  Divider,
  type ButtonProps,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
} from '@chakra-ui/react'
import {
  FormatBold,
  FormatItalic,
  StrikethroughS,
  FormatListBulleted,
  Code,
  FormatListNumberedRounded,
  Add,
  Send,
  AlternateEmail,
  EmojiEmotions,
  FormatColorText,
  InsertLink,
  LinkOff,
  DataArray,
} from '@mui/icons-material/'
import React, { useCallback, useMemo } from 'react'
import isHotkey from 'is-hotkey'
import {
  Editable,
  withReact,
  useSlate,
  Slate,
  useSelected,
  type ReactEditor,
} from 'slate-react'
import {
  Editor,
  Transforms,
  createEditor,
  Range,
  Element as SlateElement,
} from 'slate'
import type { BaseEditor, BaseElement, Descendant } from 'slate'
import { withHistory } from 'slate-history'
import styled from 'styled-components'

interface IconButtonProps extends ButtonProps {
  label: string | JSX.Element
}

interface BlockButtonProps extends IconButtonProps {
  format: string
}

interface MarkButtonProps extends IconButtonProps {
  format: string
}

interface ElementProps {
  attributes: any
  children: any
  element: any
}

interface LeafProps {
  attributes: any
  children: any
  leaf: any
}

type Marks = Record<string, boolean>

interface MyElement extends BaseElement {
  align?: string
  type?: string
  url?: string
}

type Hotkeys = Record<string, string>
interface LinkElement {
  type: 'link'
  url: string
  children: Descendant[]
}

const HOTKEYS: Hotkeys = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+s': 'strikethrough',
  'mod+`': 'code',
}

const LIST_TYPES = ['numbered-list', 'bulleted-list']
const TEXT_ALIGN_TYPES = ['left']

const initialValue: any[] = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
]

const StyledEditable = styled(Editable)`
  &:focus {
    outline: none;
  }
`

const TextEditor = (): JSX.Element => {
  const renderElement = useCallback(
    (props: ElementProps) => <Element {...props} />,
    []
  )
  const renderLeaf = useCallback((props: LeafProps) => <Leaf {...props} />, [])
  const editor = useMemo(() => {
    const withPlugins = (editor: BaseEditor): BaseEditor => {
      withInlines(editor)
      // withMentions(editor)
      return editor
    }
    return withPlugins(withReact(withHistory(createEditor())))
  }, [])
  return (
    <Slate editor={editor as ReactEditor} initialValue={initialValue}>
      <Flex
        background="rgba(0, 0, 0, 0.2)"
        border="1px"
        borderColor="zinc800"
        borderRadius="10px"
        _hover={{ borderColor: 'zinc600' }}
        _focusVisible={{ borderColor: 'zinc600' }}
        width="100%"
        h="140px"
        alignItems="center"
        justifyContent="center"
        flexDirection={'column'}
      >
        <Flex
          mt="5px"
          ml="20px"
          mb="5px"
          alignItems="center"
          justifyContent="left"
          width="100%"
        >
          <MarkButton format="bold" label={<FormatBold fontSize="small" />} />
          <MarkButton
            format="italic"
            label={<FormatItalic fontSize="small" />}
          />
          <MarkButton
            format="strikethrough"
            label={<StrikethroughS fontSize="small" />}
          />
          <Divider orientation="vertical" h="20px" m="0" p="0" mr="8px" />
          <AddLinkButton />
          <RemoveLinkButton />
          <Divider orientation="vertical" h="20px" m="0" p="0" mr="8px" />
          <BlockButton
            label={<FormatListNumberedRounded fontSize="small" />}
            format="numbered-list"
          />
          <BlockButton
            format="bulleted-list"
            label={<FormatListBulleted fontSize="small" />}
          />
          <Divider orientation="vertical" h="20px" m="0" p="0" mr="8px" />
          <MarkButton format="code" label={<Code fontSize="small" />} />
          <BlockButton
            format="code-block"
            label={<DataArray fontSize="small" />}
          />
        </Flex>
        <StyledEditable
          style={{
            width: '90ch',
            // maxWidth: '95%',
            overflow: 'auto',
            height: '100%',
            margin: 'auto',
            fontFamily: 'Libre Fraklin',
            fontSize: '18px',
            fontWeight: 500,
            color: '#d4d4d8',
          }}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Type a message..."
          spellCheck
          onKeyDown={(event: React.KeyboardEvent) => {
            for (const hotkey in HOTKEYS) {
              if (isHotkey(hotkey, event)) {
                event.preventDefault()
                const mark = HOTKEYS[hotkey]
                toggleMark(editor, mark)
              }
            }

            if (event.key === 'ArrowRight') {
              const { selection } = editor
              if (selection && Range.isCollapsed(selection)) {
                const match = Editor.above(editor, {
                  match: (n) => (n as MyElement).type === 'link',
                })
                if (match) {
                  const [, path] = match
                  if (Editor.isEnd(editor, selection.focus, path)) {
                    const pointAfterLink = Editor.after(editor, path)
                    if (pointAfterLink) {
                      Transforms.select(editor, pointAfterLink)
                      event.preventDefault()
                    }
                  }
                }
              }
            }
          }}
        />
        <Flex
          alignItems="center"
          justifyContent="space-between"
          width="100%"
          ml="20px"
        >
          <Box>
            <IconButton label={<Add />} mb="5px" mt="5px" />
            <IconButton
              label={<FormatColorText fontSize="small" />}
              mb="5px"
              mt="5px"
            />
            <IconButton
              label={<EmojiEmotions fontSize="small" />}
              mb="5px"
              mt="5px"
            />
            <IconButton
              label={<AlternateEmail fontSize="small" />}
              mb="5px"
              mt="5px"
            />
          </Box>
          <Box>
            <IconButton
              label={<Send fontSize="small" />}
              mb="5px"
              mr="30px"
              mt="5px"
            />
          </Box>
        </Flex>
      </Flex>
    </Slate>
  )
}

const withInlines = (editor: BaseEditor): BaseEditor => {
  const { isInline } = editor

  editor.isInline = (element: MyElement) =>
    (element.type !== undefined &&
      element.type !== null &&
      ['link', 'button', 'badge'].includes(element.type)) ||
    isInline(element)

  return editor
}

const toggleBlock = (editor: BaseEditor, format: string): void => {
  const isActive = isBlockActive(editor, format, {
    blockType: TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type',
  })
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes((n as MyElement).type ?? '') &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  })
  let newProperties: Partial<MyElement>
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    }
  } else {
    newProperties = {
      type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    }
  }
  Transforms.setNodes<MyElement>(editor, newProperties)

  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }

  if (format === 'code-block') {
    if (editor.selection) {
      for (const [node, path] of Editor.nodes(editor, {
        at: editor.selection,
      })) {
        if (SlateElement.isElement(node)) {
          Transforms.select(editor, path)

          const marks = Editor.marks(editor)
          if (marks) {
            Object.keys(marks).forEach((mark) => {
              Editor.removeMark(editor, mark)
            })
          }

          Transforms.unwrapNodes(editor, {
            match: (n) => (n as MyElement).type === 'link',
          })
        }
      }
    }
  }
}

const toggleMark = (editor: BaseEditor, format: string): void => {
  const [match] = Editor.nodes(editor, {
    match: (n) => (n as MyElement).type === 'code-block',
  })

  if (match) {
    return
  }
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

const isBlockActive = (
  editor: BaseEditor,
  format: any,
  { blockType = 'type' }: any
): boolean => {
  const { selection } = editor
  if (selection === null) return false

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n[blockType as keyof BaseElement] === format,
    })
  )

  return Boolean(match)
}

const isMarkActive = (editor: BaseEditor, format: any): boolean => {
  const marks = Editor.marks(editor) as Marks
  return marks && marks[format]
}

const isLinkActive = (editor: BaseEditor): boolean => {
  const [link] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      (n as LinkElement).type === 'link',
  })
  return Boolean(link)
}

const insertLink = (editor: BaseEditor, url: string): void => {
  if (editor.selection) {
    wrapLink(editor, url)
  }
}

const unwrapLink = (editor: BaseEditor): void => {
  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      (n as LinkElement).type === 'link',
  })
}

const wrapLink = (editor: BaseEditor, url: string): void => {
  if (isLinkActive(editor)) {
    unwrapLink(editor)
  }

  const { selection } = editor
  const isCollapsed = selection && Range.isCollapsed(selection)
  const link: LinkElement = {
    type: 'link',
    url,
    children: isCollapsed ? [{ text: url }] : [],
  }

  if (isCollapsed) {
    Transforms.insertNodes(editor, link)
  } else {
    Transforms.wrapNodes(editor, link, { split: true })
    Transforms.collapse(editor, { edge: 'end' })
  }
}

const Element = (props: ElementProps): JSX.Element => {
  const { attributes, children, element } = props
  const style = { textAlign: element.align }
  switch (element.type) {
    case 'block-quote':
      return (
        <blockquote style={style} {...attributes}>
          {children}
        </blockquote>
      )
    case 'bulleted-list':
      return (
        <ul style={{ ...style, paddingLeft: '20px' }} {...attributes}>
          {children}
        </ul>
      )
    case 'heading-one':
      return (
        <h1 style={style} {...attributes}>
          {children}
        </h1>
      )
    case 'heading-two':
      return (
        <h2 style={style} {...attributes}>
          {children}
        </h2>
      )
    case 'list-item':
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      )
    case 'numbered-list':
      return (
        <ol style={{ ...style, paddingLeft: '20px' }} {...attributes}>
          {children}
        </ol>
      )
    case 'link':
      return <LinkComponent {...props} />
    case 'code-block':
      return (
        <div
          style={{
            backgroundColor: '#18181b',
            color: '#d4d4d8',
            fontSize: '0.8em',
            whiteSpace: 'pre-wrap',
            fontFamily: 'Courier New, monospace',
          }}
          {...attributes}
        >
          {children}
        </div>
      )
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      )
  }
}

const Leaf = ({ attributes, children, leaf }: LeafProps): JSX.Element => {
  let newChildren = children

  if (leaf.bold === true) {
    newChildren = <strong>{newChildren}</strong>
  }

  if (leaf.code === true) {
    newChildren = (
      <code
        style={{
          backgroundColor: '#27272a',
          color: 'orange',
          border: '1px solid #71717a',
          fontSize: '0.8em',
        }}
      >
        {newChildren}
      </code>
    )
  }

  if (leaf.italic === true) {
    newChildren = <em>{newChildren}</em>
  }

  if (leaf.strikethrough === true) {
    newChildren = <del>{newChildren}</del>
  }

  return <span {...attributes}>{newChildren}</span>
}
const LinkComponent = ({ attributes, children, element }: any): JSX.Element => {
  const selected = useSelected()
  return (
    <a
      {...attributes}
      href={element.url}
      className={selected}
      style={{ color: '#1D9BD1', textDecoration: 'underline' }}
    >
      {children}
    </a>
  )
}

const IconButton = ({ label, ...props }: IconButtonProps): JSX.Element => (
  <Button
    size="sm"
    mr="2"
    background="rgba(0, 0, 0, 0)"
    color="zinc300"
    p="1px"
    _hover={{ background: 'rgba(0, 0, 0, 0.2)' }}
    {...props}
  >
    {label}
  </Button>
)
const BlockButton = ({
  format,
  label,
  ...props
}: BlockButtonProps): JSX.Element => {
  const editor = useSlate()
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
  )

  return (
    <Button
      size="sm"
      mr="2"
      background={isActive ? 'zinc900' : 'rgba(0, 0, 0, 0)'}
      color={isActive ? 'zinc300' : 'zinc300'}
      p="1px"
      _hover={{ background: 'zinc900' }}
      {...props}
      active={isActive}
      onMouseDown={(event) => {
        event.preventDefault()
        toggleBlock(editor, format)
      }}
    >
      {label}
    </Button>
  )
}

const MarkButton = ({
  format,
  label,
  ...props
}: MarkButtonProps): JSX.Element => {
  const editor = useSlate()
  const isActive = isMarkActive(editor, format)

  const [match] = Editor.nodes(editor, {
    match: (n) => (n as MyElement).type === 'code-block',
  })

  return (
    <Button
      size="sm"
      mr="2"
      background={isActive ? 'zinc900' : 'rgba(0, 0, 0, 0)'}
      color={isActive ? 'zinc300' : 'zinc300'}
      p="1px"
      _hover={{
        background: match ? 'rgba(0, 0, 0, 0)' : 'zinc900',
      }}
      {...props}
      active={isActive}
      disabled={Boolean(match)}
      onMouseDown={(event) => {
        event.preventDefault()
        if (!match) {
          toggleMark(editor, format)
        }
      }}
    >
      {label}
    </Button>
  )
}

const AddLinkButton = (): JSX.Element => {
  const editor = useSlate()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [url, setUrl] = React.useState<string>('')

  const handleSave = (): void => {
    if (url.trim() === '') return
    insertLink(editor, url)
    setUrl('')
    onClose()
  }

  const [match] = Editor.nodes(editor, {
    match: (n) => (n as MyElement).type === 'code-block',
  })

  return (
    <>
      <Button
        size="sm"
        mr="2"
        background="rgba(0, 0, 0, 0)"
        color="zinc300"
        p="1px"
        _hover={{
          background: match ? 'rgba(0, 0, 0, 0)' : 'zinc900',
        }}
        onMouseDown={(event) => {
          event.preventDefault()
          if (!match) {
            onOpen()
          }
        }}
      >
        <InsertLink fontSize="small" />
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          setUrl('')
          onClose()
        }}
      >
        <ModalOverlay />
        <ModalContent bgColor={'zinc900'} color={'zinc300'}>
          <ModalHeader>Enter the URL of the link:</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              value={url}
              onChange={(event) => {
                setUrl(event.target.value)
              }}
              placeholder="Enter URL"
            />
          </ModalBody>

          <ModalFooter>
            <Button
              bg="#16a34a"
              _hover={{ background: '#14532d' }}
              _active={{ background: '#14532d' }}
              color="zinc100"
              mr={3}
              onClick={handleSave}
            >
              Save
            </Button>
            <Button
              color="zinc100"
              bg="zinc800"
              _hover={{ background: 'rgba(0, 0, 0, 0.2)' }}
              _active={{ background: 'rgba(0, 0, 0, 0.2)' }}
              onClick={() => {
                setUrl('')
                onClose()
              }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
const RemoveLinkButton = (): JSX.Element => {
  const editor = useSlate()
  const [match] = Editor.nodes(editor, {
    match: (n) => (n as MyElement).type === 'code-block',
  })

  return (
    <Button
      size="sm"
      mr="2"
      background="rgba(0, 0, 0, 0)"
      color="zinc300"
      p="1px"
      _hover={{
        background: match ? 'rgba(0, 0, 0, 0)' : 'zinc900',
      }}
      onMouseDown={() => {
        if (!match && isLinkActive(editor)) {
          unwrapLink(editor)
        }
      }}
    >
      <LinkOff fontSize="small" />
    </Button>
  )
}

export default TextEditor
