import { Box, Flex, Button, Divider, type ButtonProps } from '@chakra-ui/react'
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
  DataArray,
  LinkOff,
} from '@mui/icons-material/'
import { useCallback, useMemo } from 'react'
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
import isUrl from 'is-url'
import type { BaseEditor, BaseElement, Descendant } from 'slate'
import { withHistory } from 'slate-history'
import { css } from '@emotion/css'
const HOTKEYS: Hotkeys = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+s': 'strikethrough',
  'mod+`': 'code',
}

const LIST_TYPES = ['numbered-list', 'bulleted-list']
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']

interface IconButtonProps extends ButtonProps {
  label: string | JSX.Element
}

interface BlockButtonProps extends ButtonProps {
  label: string | JSX.Element
  format: string
}

interface MarkButtonProps extends ButtonProps {
  label: string | JSX.Element
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

const TextEditor = (): JSX.Element => {
  const renderElement = useCallback(
    (props: ElementProps) => <Element {...props} />,
    []
  )
  const renderLeaf = useCallback((props: LeafProps) => <Leaf {...props} />, [])
  const editor = useMemo(() => {
    const withPlugins = (editor: BaseEditor): BaseEditor => {
      withInlines(editor)
      withMentions(editor)
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
        h="120px"
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
          <IconButton label={<DataArray fontSize="small" />} />
        </Flex>
        <Editable
          style={{
            width: '95%',
            marginRight: '20px',
          }}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Type a message..."
          spellCheck
          autoFocus
          onKeyDown={(event: React.KeyboardEvent) => {
            for (const hotkey in HOTKEYS) {
              if (isHotkey(hotkey, event)) {
                event.preventDefault()
                const mark = HOTKEYS[hotkey]
                toggleMark(editor, mark)
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

const toggleBlock = (editor: BaseEditor, format: string): void => {
  const isActive = isBlockActive(editor, format, {
    blockType: TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type',
  })
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: (n) => {
      if ('type' in n) {
        return (
          !Editor.isEditor(n) &&
          SlateElement.isElement(n) &&
          LIST_TYPES.includes(n.type as string) &&
          !TEXT_ALIGN_TYPES.includes(format)
        )
      }
      return false
    },
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
}

const toggleMark = (editor: BaseEditor, format: string): void => {
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
  if (selection === null || selection === undefined) return false

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
  return marks !== null && marks !== undefined && marks[format]
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
        <ul style={style} {...attributes}>
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
        <ol style={style} {...attributes}>
          {children}
        </ol>
      )
    case 'link':
      return <LinkComponent {...props} />
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      )
  }
}

const withInlines = (editor: BaseEditor): BaseEditor => {
  const { insertData, insertText, isInline, isElementReadOnly, isSelectable } =
    editor

  editor.isInline = (element: MyElement) =>
    ['link', 'button', 'badge'].includes(element.type) || isInline(element)

  editor.isElementReadOnly = (element: MyElement) =>
    element.type === 'badge' || isElementReadOnly(element)

  editor.isSelectable = (element: MyElement) =>
    element.type !== 'badge' && isSelectable(element)

  editor.insertText = (text) => {
    if (text && isUrl(text)) {
      wrapLink(editor, text)
    } else {
      insertText(text)
    }
  }

  editor.insertData = (data) => {
    const text = data.getData('text/plain')

    if (text && isUrl(text)) {
      wrapLink(editor, text)
    } else {
      insertData(data)
    }
  }

  return editor
}
const withMentions = (editor: BaseEditor): BaseEditor => {
  const { isInline, isVoid, markableVoid } = editor

  editor.isInline = (element: MyElement) => {
    return element.type === 'mention' ? true : isInline(element)
  }

  editor.isVoid = (element: MyElement) => {
    return element.type === 'mention' ? true : isVoid(element)
  }

  editor.markableVoid = (element: MyElement) => {
    return element.type === 'mention' || markableVoid(element)
  }

  return editor
}
const LinkComponent = ({ attributes, children, element }: any): JSX.Element => {
  const selected = useSelected()
  return (
    <a
      {...attributes}
      href={element.url}
      className={
        selected
          ? css`
              box-shadow: 0 0 0 3px #ddd;
            `
          : ''
      }
      style={{ color: 'blue' }}
    >
      {children}
    </a>
  )
}

const insertLink = (editor: BaseEditor, url: string): void => {
  if (editor.selection) {
    wrapLink(editor, url)
  }
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

const Leaf = ({ attributes, children, leaf }: LeafProps): JSX.Element => {
  let newChildren = children
  if (leaf.bold === true) {
    newChildren = <strong>{newChildren}</strong>
  }

  if (leaf.code === true) {
    newChildren = <code>{newChildren}</code>
  }

  if (leaf.italic === true) {
    newChildren = <em>{newChildren}</em>
  }

  if (leaf.underline === true) {
    newChildren = <u>{newChildren}</u>
  }

  if (leaf.strikethrough === true) {
    newChildren = <del>{newChildren}</del>
  }

  return <span {...attributes}>{newChildren}</span>
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
  return (
    <Button
      size="sm"
      mr="2"
      background="rgba(0, 0, 0, 0)"
      color="zinc300"
      p="1px"
      _hover={{ background: 'rgba(0, 0, 0, 0.2)' }}
      {...props}
      active={isBlockActive(
        editor,
        format,
        TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
      )}
      onMouseDown={(event) => {
        event.preventDefault()
        toggleBlock(editor, format)
      }}
    >
      {label}
    </Button>
  )
}

const AddLinkButton = (): JSX.Element => {
  const editor = useSlate()
  return (
    <Button
      size="sm"
      mr="2"
      background="rgba(0, 0, 0, 0)"
      color="zinc300"
      p="1px"
      _hover={{ background: 'rgba(0, 0, 0, 0.2)' }}
      onMouseDown={(event) => {
        event.preventDefault()
        const url = window.prompt('Enter the URL of the link:')
        if (!url) return
        insertLink(editor, url)
      }}
    >
      <InsertLink fontSize="small" />
    </Button>
  )
}
const RemoveLinkButton = (): JSX.Element => {
  const editor = useSlate()

  return (
    <Button
      size="sm"
      mr="2"
      background="rgba(0, 0, 0, 0)"
      color="zinc300"
      p="1px"
      _hover={{ background: 'rgba(0, 0, 0, 0.2)' }}
      onMouseDown={() => {
        if (isLinkActive(editor)) {
          unwrapLink(editor)
        }
      }}
    >
      <LinkOff fontSize="small" />
    </Button>
  )
}

const MarkButton = ({
  format,
  label,
  ...props
}: MarkButtonProps): JSX.Element => {
  const editor = useSlate()
  return (
    <Button
      size="sm"
      mr="2"
      background="rgba(0, 0, 0, 0)"
      color="zinc300"
      p="1px"
      _hover={{ background: 'rgba(0, 0, 0, 0.2)' }}
      {...props}
      active={isMarkActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault()
        toggleMark(editor, format)
      }}
    >
      {label}
    </Button>
  )
}

const initialValue: any[] = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
]

export default TextEditor
