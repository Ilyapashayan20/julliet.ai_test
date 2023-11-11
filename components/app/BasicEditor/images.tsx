import { css } from '@emotion/css';
import isUrl from 'is-url';
import imageExtensions from 'image-extensions';
import { Transforms } from 'slate';
import {
  ReactEditor,
  useFocused,
  useSelected,
  useSlateStatic
} from 'slate-react';
import { MdDeleteOutline, MdImage } from 'react-icons/md';
import { Button } from './components';
import { Icon, useColorMode } from '@chakra-ui/react';

export const withImages = (editor: any) => {
  const { insertData, isVoid } = editor;

  editor.isVoid = (element: HTMLElement) => {
    // @ts-ignore
    return element.type === 'image' ? true : isVoid(element);
  };

  editor.insertData = (data: any) => {
    const text = data.getData('text/plain');
    const { files } = data;

    if (files && files.length > 0) {
      for (const file of files) {
        const reader = new FileReader();
        const [mime] = file.type.split('/');

        if (mime === 'image') {
          reader.addEventListener('load', () => {
            const url = reader.result;
            insertImage(editor, url as string);
          });

          reader.readAsDataURL(file);
        }
      }
    } else if (isImageUrl(text)) {
      insertImage(editor, text);
    } else {
      insertData(data);
    }
  };

  return editor;
};

const isImageUrl = (url: string) => {
  if (!url) return false;
  if (!isUrl(url)) return false;
  const ext = new URL(url).pathname.split('.').pop();
  return imageExtensions.includes(ext as string);
};

export type EmptyText = {
  text: string;
};

export type ImageElement = {
  type: 'image';
  url: string;
  children: EmptyText[];
};

const insertImage = (editor: any, url: string) => {
  const text = { text: '' };
  const image: ImageElement = { type: 'image', url, children: [text] };
  Transforms.insertNodes(editor, image);
};

export const InsertImageButton = () => {
  const editor = useSlateStatic();
  const { colorMode } = useColorMode();
  const color = { light: 'gray.700', dark: 'white' };
  return (
    <Button
      onMouseDown={(event: Event) => {
        event.preventDefault();
        const url = window.prompt('Enter the URL of the image:');
        if (url && !isImageUrl(url)) {
          alert('URL is not an image');
          return;
        }
        url && insertImage(editor, url);
      }}
      className="toolbar__editor--button hover:bg-gray-200 w-[24px] flex items-center text-center justify-center rounded"
    >
      <Icon as={MdImage} boxSize="18px" color={color[colorMode]} />
    </Button>
  );
};

export const ImageElement = ({ attributes, children, element }: any) => {
  const editor = useSlateStatic();
  const path = ReactEditor.findPath(editor as ReactEditor, element);

  const selected = useSelected();
  const focused = useFocused();
  return (
    <div {...attributes}>
      {children}
      <div
        contentEditable={false}
        className={css`
          position: relative;
        `}
      >
        <img
          src={element.url}
          className={css`
            display: block;
            max-width: 100%;
            max-height: 20em;
            box-shadow: ${selected && focused ? '0 0 0 3px #B4D5FF' : 'none'};
          `}
        />
        <Button
          active
          onClick={() => Transforms.removeNodes(editor, { at: path })}
          className={css`
            display: ${selected && focused ? 'inline' : 'none'};
            position: absolute;
            top: 0.5em;
            left: 0.5em;
            background-color: white;
            border-radius: 4px;
          `}
        >
          <Icon as={MdDeleteOutline} boxSize="18px" />
        </Button>
      </div>
    </div>
  );
};
