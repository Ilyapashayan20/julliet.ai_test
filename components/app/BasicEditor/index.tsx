import isHotkey from 'is-hotkey';
import React, {
  ChangeEventHandler,
  useCallback,
  useEffect,
  useRef
} from 'react';
import {
  Editor,
  Element as SlateElement,
  Transforms,
  Node,
  Range
} from 'slate';
import {Editable, Slate, useFocused, useSlate} from 'slate-react';

import {ImageElement, InsertImageButton} from './images';
import {Portal, Menu} from './components';
import {BlockButton, FormatButton} from './buttons';

import {
  Box,
  Icon,
  Text,
  Button as ChakraButton,
  Badge,
  Spinner,
  Center,
  VStack,
  useColorMode,
  HStack,
  useColorModeValue,
  useBreakpointValue
} from '@chakra-ui/react';
import {
  MdArrowBack,
  MdCode,
  MdFormatAlignCenter,
  MdFormatAlignLeft,
  MdFormatAlignRight,
  MdFormatBold,
  MdFormatItalic,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdFormatQuote,
  MdFormatUnderlined
} from 'react-icons/md';
import {Button, Toolbar} from './components';
import {useAppStore, useDocDetailStore} from '@/lib/store';
import TitleEditor from './TitleEditor';
import {
  DocumentTypeToColor,
  DocumentTypeToSpanish,
  Tone,
  ToneToColor,
  ToneToSpanish
} from '@/types';
import JullietPowerIcon from '../ui/julliet/icons/JullietPower';
import JullietEditIcon from '../ui/julliet/icons/JullietEdit';
import {addNodesAfterSelection} from '@/lib/utils/slate';
import {fetchRewriteSelection, fetchSimpleSuggestion} from '@/lib/fetchers';

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
  tab: 'accept-suggestion',
  'shift+tab': 'change-suggestion',
  escape: 'cancel-suggestion'
};


interface SlateEditorProps {
  title?: string;
  handleTitleChange: ChangeEventHandler<HTMLInputElement>;
  lastUpdate: any;
  editor: any;
  initialValue: any;
  onChange: any;
  placeholder: string;
  onSuggestionChange: any;
  onSuggestionAccept: any;
  onSuggestionCancel: any;
}

const BasicEditor = (props: SlateEditorProps) => {
  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const [isLoading, setIsLoading] = React.useState(false);


  const {
    title,
    placeholder,
    lastUpdate,
    handleTitleChange,
    editor,
    initialValue,
    onChange,
    onSuggestionAccept,
    onSuggestionChange,
    onSuggestionCancel
  } = props;

  const loaderBg = useColorModeValue('blackAlpha.700', 'whiteAlpha.700');
  return (
    <>
      {isLoading && (
        <Box
          position="fixed"
          top="0"
          left="0"
          width="100%"
          h="100vh"
          zIndex="999999"
          opacity={0.8}
          bg={loaderBg}
        >
          <Center h="100%">
            <VStack>
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="brand.500"
                w="200px"
                h="200px"
              />
              <Text
                fontSize="2xl"
                fontWeight="bold"
                color="white"
                ml="4"
                mt="4"
              >
                Cargando...
              </Text>
            </VStack>
          </Center>
        </Box>
      )}
      <Slate
        editor={editor} value={initialValue} onChange={onChange}>
        {/* TODO: Fix the HoveringToolBar is appearing sometimes */}
        {/* {isDesktop && ( */}
        {/*   <HoveringToolbar setIsLoading={setIsLoading} title={title} /> */}
        {/* )} */}
        <EditorToolbar
          setIsLoading={setIsLoading}
          handleTitleChange={handleTitleChange}
          title={title}
          lastUpdate={lastUpdate}
        />

        <Editable
          style={{
            marginTop: '-4rem',
          }}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder={placeholder}
          spellCheck
          autoFocus
          onKeyDown={(event) => {
            for (const hotkey in HOTKEYS) {
              if (isHotkey(hotkey, event as any)) {
                event.preventDefault();
                // @ts-ignore
                const mark = HOTKEYS[hotkey] as string;

                switch (mark) {
                  case 'accept-suggestion':
                    onSuggestionAccept();
                    break;
                  case 'change-suggestion':
                    onSuggestionChange();
                    break;
                  case 'cancel-suggestion':
                    onSuggestionCancel();
                    break;
                }

                toggleMark(editor, mark);
              }
            }
          }}
        />
      </Slate>
    </>
  );
};


const generateParagraph = async (editor: any, title: string) => {
  const selectedText = Editor.string(editor, editor.selection);

  const {text: suggestedText} = await fetchSimpleSuggestion({
    prompt: `Contexto: ${title} \n\n ${selectedText}`,
    isAccepted: false
  });

  const newNodes = [
    {
      type: 'paragraph',
      children: [{text: suggestedText}]
    } as Node,
    {
      type: 'paragraph',
      children: [{text: ''}]
    } as Node
  ];

  addNodesAfterSelection(editor, newNodes);
};

const rewriteSelection = async (editor: any, title: string) => {
  const [node, _] = Editor.node(editor, editor.selection);
  const selectedText = Editor.string(editor, editor.selection);

  console.log('selectedText', selectedText);

  let {text} = await fetchRewriteSelection({
    selection: selectedText,
    // @ts-ignore
    text: node.text || selectedText,
    context: title
  });

  text = text.replace(/(\r\n|\n|\r)/gm, '');
  Transforms.insertText(editor, text);
};

const toggleMark = (editor: any, format: string) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};


const isMarkActive = (editor: any, format: string) => {
  const marks = Editor.marks(editor);
  // @ts-ignore
  return marks ? marks[format] === true : false;
};

const Element = ({
  attributes,
  children,
  element
}: {
  attributes: any;
  children: any;
  element: any;
}) => {
  const style = {textAlign: element.align};
  switch (element.type) {
    case 'image':
      return (
        <ImageElement attributes={attributes} element={element}>
          {children}
        </ImageElement>
      );
    case 'bulleted-list':
    case 'bulleted_list':
      return (
        <ul style={style} {...attributes}>
          {children}
        </ul>
      );
    case 'paragraph':
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
    case 'heading-one':
    case 'heading_one':
      console.log('heading-one');
      return (
        <h1 style={style} {...attributes}>
          {children}
        </h1>
      );
    case 'heading-two':
    case 'heading_two':
      return (
        <h2 style={style} {...attributes}>
          {children}
        </h2>
      );
    case 'heading-three':
    case 'heading_three':
      return (
        <h3 style={style} {...attributes}>
          {children}
        </h3>
      );
    case 'block-quote':
    case 'block_quote':
      return (
        <blockquote style={style} {...attributes}>
          {children}
        </blockquote>
      );
    case 'code-block':
    case 'code_block':
      return (
        <p
          style={style}
          {...attributes}
          className="p-2 text-sm bg-gray-100 rounded-md"
        >
          <code>{children}</code>
        </p>
      );
    case 'list-item':
    case 'list_item':
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      );
    case 'numbered-list':
    case 'numbered_list':
    case 'ol-list':
    case 'ol_list':
      return (
        <ol style={style} {...attributes}>
          {children}
        </ol>
      );
    case 'bulleted-list':
    case 'bulleted_list':
    case 'ul-list':
    case 'ul_list':
      return (
        <ul style={style} {...attributes}>
          {children}
        </ul>
      );
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
  }
};

const Leaf = ({attributes, children, leaf}: any) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};


const ActionButton = ({icon, color, onClick, title = ''}: any) => {
  const editor = useSlate();

  const buttonBg = useColorModeValue('gray.100', 'white');
  const buttonColor = useColorModeValue('gray.600', 'blackAlpha.900');
  return (
    <Button
      title={title}
      onMouseDown={(event: any) => {
        event.preventDefault();
        onClick(editor);
      }}
      className="hover:bg-gray-200 w-[24px] flex items-center text-center justify-center rounded"
    >
      {icon && title ? (
        <HStack
          spacing={3}
          bg={buttonBg}
          p={1}
          rounded="md"
          shadow="sm"
          color={buttonColor}
        >
          <Icon as={icon} boxSize="22px" color="brand.400" mt="1" />
          {title && (
            <Text fontSize="xs" fontWeight="bold">
              {title}
            </Text>
          )}
        </HStack>
      ) : (
        <Icon as={icon} boxSize="22px" color="brand.400" mt="1" />
      )}
    </Button>
  );
};

// @ts-ignore
const isFormatActive = (editor, format) => {
  // @ts-ignore
  const [match] = Editor.nodes(editor, {
    // @ts-ignore
    match: (n) => n[format] === true,
    mode: 'all'
  });
  return !!match;
};

const HoveringToolbar = ({setIsLoading, title}: any) => {
  const ref = useRef<HTMLDivElement | null>();
  const editor = useSlate();
  const inFocus = useFocused();

  useEffect(() => {
    const el = ref.current;
    const {selection} = editor;

    if (!el) {
      return;
    }

    if (
      !selection ||
      !inFocus ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === ''
    ) {
      el.removeAttribute('style');
      return;
    }

    const domSelection = window.getSelection();
    if (!domSelection) {
      return;
    }

    const domRange = domSelection.getRangeAt(0);
    const rect = domRange.getBoundingClientRect();
    el.style.opacity = '1';
    el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight}px`;
    el.style.left = `${rect.left + window.pageXOffset - el.offsetWidth / 2 + rect.width / 2
      }px`;
  });

  const {colorMode} = useColorMode();

  return (
    <Portal>
      <Menu
        zIndex={999999}
        colorMode={colorMode === 'dark' ? 'light' : 'dark'}
        ref={ref as any}
        p="8px 7px 6px"
        position="absolute"
        top="-1000px"
        left="-1000px"
        mt="-6px"
        opacity="0"
        bgColor="gray.800"
        borderRadius="4px"
        transition="opacity 0.75s"
        onMouseDown={(e: Event) => {
          // prevent toolbar from taking focus away from editor
          e.preventDefault();
        }}
      >
        <ActionButton
          format="AddParagraph"
          color="#591da9"
          onClick={async (editor: any) => {
            setIsLoading(true);
            await generateParagraph(editor, title as string);
            setIsLoading(false);
          }}
          icon={JullietPowerIcon}
          title="Generar párrafo"
        />
        <ActionButton
          format="link"
          color="#591da9"
          icon={JullietEditIcon}
          onClick={async (editor: any) => {
            setIsLoading(true);
            await rewriteSelection(editor, title as string);
            setIsLoading(false);
          }}
          title="Reescribir selección"
        />
      </Menu>
    </Portal>
  );
};


function EditorToolbar({setIsLoading, title, handleTitleChange, lastUpdate}: any) {
  const appStore = useAppStore();
  const {colorMode} = useColorMode()
  const isDesktop = useBreakpointValue({base: false, md: true});
  const docDetailStore = useDocDetailStore();

  return (
    <Box
      left={{
        base: 0,
        md: appStore.isSidebarOpen ? '40.9rem' : '29.70rem'
      }}
      position="fixed"
      top={{base: '0', md: appStore.showTopBanner ? 5 : '0'}}
      right="0"
      zIndex="100"
    >
      <Box
        px={{base: 4, md: 12}}
        py={{base: 4, md: 4}}
        bgColor={colorMode === 'light' ? 'white' : 'gray.900'}
        color={colorMode === 'light' ? 'gray.900' : 'white'}
      >
        {!isDesktop && (
          <ChakraButton
            _hover={{
              bg: 'brand.600',
              color: 'white'
            }}
            bg="transparent"
            className="inline-flex items-center mt-4"
            color={colorMode === 'light' ? 'gray.900' : 'brand.400'}
            size="xs"
            onClick={() => {
              docDetailStore.setShowSidebar(true);
            }}
            mt={{
              base: appStore.showTopBanner ? '108px' : 0,
              md: appStore.showTopBanner ? '110px' : 0
            }}
          >
            <MdArrowBack className="mr-2" /> Volver a mis documentos
          </ChakraButton>
        )}
        <TitleEditor
          mt={{base: 6, md: 0}}
          title={title}
          handleTitleChange={handleTitleChange}
          color={colorMode === 'light' ? 'gray.900' : 'white'}
        />
        <div className="items-center justify-between md:flex">
          <div className="flex my-2 gap-2">
            <Badge
              paddingX={3}
              color="black"
              size="xs"
              bg={
                DocumentTypeToColor[
                docDetailStore?.document?.type as string
                ]
              }
            >
              {
                DocumentTypeToSpanish[
                docDetailStore?.document?.type as string
                ]
              }
            </Badge>
            <Badge
              paddingX={3}
              size="xs"
              color="black"
              bg={ToneToColor[docDetailStore?.document?.tone as Tone]}
            >
              {ToneToSpanish[docDetailStore?.document?.tone as Tone]}
            </Badge>
            <Badge bg="brand.500" paddingX={3} size="xs" color="black">
              {docDetailStore?.document?.word_count} Palabras
            </Badge>
          </div>

          <Text fontSize="xs" as="i">
            Modificado {lastUpdate}
          </Text>
        </div>
      </Box>
      {/**
           * className={css`
              border-bottom: 1px solid #eee !important;
              border-top: 1px solid #eee !important;
              padding: 5px 4rem !important;
              max-width: 100%;
            `}
           */}
      <Toolbar className="toolbar__editor">
        <FormatButton format="bold" textColor="black" icon={MdFormatBold} />
        <FormatButton
          format="italic"
          textColor="black"
          icon={MdFormatItalic}
        />
        <FormatButton
          format="underline"
          textColor="black"
          icon={MdFormatUnderlined}
        />
        <BlockButton format="paragraph" textColor="black" text="P" />
        <BlockButton format="heading-one" textColor="black" text="H1" />
        <BlockButton format="heading-two" textColor="black" text="H2" />
        <BlockButton format="heading-three" textColor="black" text="H3" />
        <BlockButton
          format="block-quote"
          textColor="black"
          icon={MdFormatQuote}
        />
        <BlockButton format="code-block" textColor="black" icon={MdCode} />
        <BlockButton
          format="numbered-list"
          textColor="black"
          icon={MdFormatListNumbered}
        />
        <BlockButton
          format="bulleted-list"
          textColor="black"
          icon={MdFormatListBulleted}
        />
        <BlockButton
          format="left"
          textColor="black"
          icon={MdFormatAlignLeft}
        />
        <BlockButton
          format="center"
          textColor="black"
          icon={MdFormatAlignCenter}
        />
        <BlockButton
          format="right"
          textColor="black"
          icon={MdFormatAlignRight}
        />
        <InsertImageButton />
        <ActionButton
          format="AddParagraph"
          color="#591da9"
          icon={JullietPowerIcon}
          onClick={async (editor: any) => {
            setIsLoading(true);
            await generateParagraph(editor, title as string);
            setIsLoading(false);
          }}
        />
        <ActionButton
          format="link"
          color="#591da9"
          icon={JullietEditIcon}
          onClick={async (editor: any) => {
            setIsLoading(true);
            await rewriteSelection(editor, title as string);
            setIsLoading(false);
          }}
        />
      </Toolbar>
    </Box>
  );
};

export default BasicEditor;
