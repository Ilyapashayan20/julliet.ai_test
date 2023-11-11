import {useSlate} from 'slate-react';
import {useColorMode, Icon} from '@chakra-ui/react';
import {Button} from './components';
import {
  Editor,
  Element as SlateElement,
  Transforms
} from 'slate';
import {classNames} from '@/lib/utils/helpers';

const LIST_TYPES = ['numbered-list', 'bulleted-list', 'ol-list', 'ul-list', 'numbered_list', 'bulleted_list', 'ol_list', 'ul_list'];
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify'];

const isBlockActive = (editor: any, format: string, blockType = 'type') => {
  const {selection} = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        // @ts-ignore
        n[blockType] === format
    })
  );

  return !!match;
};

const isMarkActive = (editor: any, format: string) => {
  const marks = Editor.marks(editor);
  // @ts-ignore
  return marks ? marks[format] === true : false;
};

const toggleMark = (editor: any, format: string) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const toggleBlock = (editor: any, format: string) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
  );
  const isList = LIST_TYPES.includes(format);

  console.log('isList', isList);
  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      // @ts-ignore
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true
  });
  let newProperties: Partial<SlateElement>;
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      // @ts-ignore
      align: isActive ? undefined : format
    };
  } else {
    newProperties = {
      // @ts-ignore
      type: isActive ? 'paragraph' : isList ? 'list-item' : format
    };
  }
  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    const block = {type: format, children: []};
    Transforms.wrapNodes(editor, block);
  }
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


const FormatButton = ({
  format,
  icon,
  textColor = 'white',
  disabled = false
}: any) => {
  const editor = useSlate();
  const {colorMode} = useColorMode();
  const color = {light: 'black', dark: 'white'};

  return (
    <Button
      disabled={disabled}
      active={isFormatActive(editor, format)}
      onMouseDown={(event: any) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      <Icon as={icon} boxSize="18px" color={color[colorMode]} />
    </Button>
  );
};

const BlockButton = ({format, icon, textColor = 'white', text}: any) => {
  const editor = useSlate();
  const {colorMode} = useColorMode();
  const color = {light: 'black', dark: 'white'};

  return (
    <Button
      active={isBlockActive(
        editor,
        format,
        TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
      )}
      onMouseDown={(event: any) => {
        console.log('block button clicked');
        console.log(format);
        event.preventDefault();
        toggleBlock(editor, format);
      }}
      className="toolbar__editor--button hover:bg-gray-200 w-[24px] flex items-center text-center justify-center rounded"
    >
      {icon ? (
        <Icon as={icon} boxSize="18px" color={color[colorMode]} />
      ) : (
        <></>
      )}
      {text ? (
        <span
          className={classNames(
            `text-${color} block flex items-center ml-0 justify-center font-bold text-[0.82rem] h-[24px] w-[24px] mt-[1px]`
          )}
        >
          {text}
        </span>
      ) : (
        <></>
      )}
    </Button>
  );
};
export {BlockButton, FormatButton, isFormatActive, toggleMark, isMarkActive};
