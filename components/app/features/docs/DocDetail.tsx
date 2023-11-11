import {
  Container,
  Box,
  Text,
  Stack,
  Flex,
  useBreakpointValue,
  MenuItem,
  HStack,
  Icon,
  useDisclosure,
  useColorModeValue
} from '@chakra-ui/react';
import {fetchDocumentSuggestions} from '@/lib/fetchers';
import {
  useAcceptSuggestion,
  useDocumentById,
  useSaveDocument,
  useUpdateDocumentTitle
} from '@/lib/hooks';

import BasicEditor from '@/components/app/BasicEditor';
import {withHistory} from 'slate-history';
import {useEffect, useMemo, useRef, useState} from 'react';
import {withReact} from 'slate-react';
import {createEditor, Descendant, Editor} from 'slate';
import {useDebounce} from '@/lib/utils/hooks';
import {formatRelativeDate} from '@/lib/utils/dates';
import {isValidSlateValue, getTextBeforeCaret} from '@/lib/utils/slate';
import FloatButton from '@/components/app/ui/FloatButton';
import Dots from '@/components/app/ui/dots';
import {getCaretCoordinates} from '@/lib/utils/caret';
import {MdAdd, MdPublish, MdShield} from 'react-icons/md';
import DocPublishDrawer from '@/components/app/features/docs/DocPublishDrawer';
import InfoModal from '@/components/app/features/docs/InfoModal';
import {useAppStore, useDocDetailStore} from '@/lib/store';
import JullietError from '@/components/app/ui/julliet/icons/JullietError';
import {setIntercomVisibility} from '@/lib/utils/intercom';
import {useUser} from '@/lib/utils/useUser';
import {withImages} from '@/components/app/BasicEditor/images';
import {useRouter} from 'next/router';

const getEditableElement = () => {
  const selection = window.getSelection();
  if (selection) {
    if (selection.anchorNode) {
      return selection.anchorNode.parentElement;
    }
  }
};

const removeSuggestion = () => {
  const elements = document.querySelector('.suggestion-span');
  elements?.remove();
};

const DocDetail = () => {
  const store = useDocDetailStore();
  const editorRef = useRef<Editor | null>(null);
  const canLoadEditor = !editorRef.current || !store.document || store.documentIsSaving;
  if (canLoadEditor) {
    editorRef.current = withImages(withHistory(withReact(createEditor())));
  }
  const editor: Editor | null = editorRef.current;
  const [editorValue, setEditorValue] = useState<Descendant[]>([]);
  const debouncedEditorValue = useDebounce(editorValue, 1000);
  const toSaveEditorValue = useDebounce(editorValue, 2000);
  const [isToolTipOpen, setIsToolTipOpen] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [suggestionId, setSuggestionId] = useState('');
  const [title, setTitle] = useState<string>('');
  const debouncedTitle = useDebounce(title, 300);
  const [loaderPosition, setLoaderPosition] = useState({left: 0, top: 0});
  const [isSuggestionFetching, setIsSuggestionFetching] = useState(false);
  const {
    isOpen: isPublishDrawerOpen,
    onOpen: onPublishDrawerOpen,
    onClose: onPublishDrawerClose
  } = useDisclosure();
  const [docId, setDocId] = useState<string | null>(null);

  const {canCreate} = useUser();
  const router = useRouter();

  useEffect(() => {
    if (store.document) {
      setDocId(String(store.document?.id));
    }
  }, [store.document]);

  function getSuggestion(prompt: string) {
    if (!canCreate) {
      console.log('no credits');
      return;
    }
    setIsSuggestionFetching(true);
    fetchDocumentSuggestions({
      documentId: docId as string,
      prompt: prompt
    })
      .then((data) => {
        console.log(data);
        setSuggestionId(data.id);
        setSuggestion(data.text);
        setIsSuggestionFetching(false);
      })
      .catch((err) => {
        setIsSuggestionFetching(false);
      });
  }

  const {data: myDocument, isLoading} = useDocumentById({
    id: docId as string,
    enabled: !!docId,
    cacheTime: 0
  });

  const initialValue = useMemo(() => {
    if (myDocument?.data && isValidSlateValue(myDocument.data)) {
      return myDocument.data;
    }
    return baseValue;
  }, [myDocument]);

  useEffect(() => {
    setTitle(myDocument?.title);
    store.setDocument(myDocument);
  }, [myDocument]);

  const {mutateAsync: acceptSuggestionAsync} = useAcceptSuggestion({
    suggestionId: suggestionId
  });

  useEffect(() => {
    showSuggestion();
  }, [suggestion]);

  const {mutateAsync: saveDocument} = useSaveDocument({
    documentId: docId as string,
    data: debouncedEditorValue
  });

  const updateTitle = useUpdateDocumentTitle({
    documentId: docId as string,
    title: debouncedTitle
  });

  useEffect(() => {
    if (debouncedTitle) {
      updateTitle();
    }
  }, [debouncedTitle]);

  const showSuggestion = () => {
    if (!suggestion) return;

    const element = getEditableElement();
    // add span with suggestion
    if (element) {
      const span = document.createElement('span');
      span.classList.add('suggestion-span');
      span.innerText = suggestion;
      element?.appendChild(span);
    }

    setIsToolTipOpen(true);
  };

  const handleOnChange = (value: Descendant[]) => {
    setIsToolTipOpen(false);
    setEditorValue(value);
  };

  useEffect(() => {
    setLoaderPosition(getCaretCoordinates());
  }, [debouncedEditorValue]);

  useEffect(() => {
    if (toSaveEditorValue && toSaveEditorValue.length) {
      store.setDocumentIsSaving(true);
      saveDocument().then(() => {
        console.log('saved');
        store.setDocumentIsSaving(false);
      }).catch((err: any) => {
        console.log(err);
        store.setDocumentIsSaving(false);
      });
    }
  }, [toSaveEditorValue]);

  const onSuggestionAccept = () => {
    removeSuggestion();
    const beforeText = getTextBeforeCaret(editor);
    if (editor) {
      if (beforeText) {
        // last char is space
        const lastChar = beforeText[beforeText.length - 1];
        if (lastChar === ' ') {
          editor.insertText(suggestion);
        } else {
          editor.insertText(` ${suggestion}`);
        }
      } else {
        editor.insertText(suggestion);
      }
    }

    acceptSuggestionAsync().then(() => {
      setSuggestion('');
    });
  };

  const onSuggestionChange = () => {
    console.log('onSuggestionChange');
    removeSuggestion();
    const beforeText = getTextBeforeCaret(editor);
    if (beforeText) {
      getSuggestion(beforeText);
    } else {
      console.log('no text before caret');
      getSuggestion(`${myDocument.title}\n`);
    }
  };

  const handleTitleChange = (e: any) => {
    setTitle(e.target.value);
  };

  useEffect(() => {
    setIntercomVisibility(false);
    return () => {
      setIntercomVisibility(true);
    };
  }, []);

  const placeholder =
    'Escribe y pulsa SHIFT + TAB para solicitar una sugerencia, pulsa TAB para aceptarla o ESC para rechazarla.';

  const iconModalColor = useColorModeValue('gray.500', 'white');
  return (
    <>
      <InfoModal isOpen={store.isModalOpen} onClose={store.onModalClose} />
      {!isLoading && store.document ? (
        <Box
          as="main"
          maxW="90%"
          mx="auto"
          py={28}
          px={{base: '4', md: '8'}}
          onClick={() => setIsToolTipOpen(false)}
          className="editor-wrapper"
        >
          <SuggestionToolTip isOpen={isToolTipOpen} />
          <BasicEditor
            placeholder={
              !isSuggestionFetching && !suggestionId ? placeholder : ''
            }
            title={myDocument?.title}
            handleTitleChange={handleTitleChange}
            lastUpdate={formatRelativeDate(myDocument.updated_at)}
            editor={editor}
            initialValue={initialValue}
            onChange={handleOnChange}
            onSuggestionAccept={onSuggestionAccept}
            onSuggestionChange={onSuggestionChange}
            onSuggestionCancel={removeSuggestion}
          />
          {isSuggestionFetching && (
            <Dots
              position="fixed"
              size="5px"
              left={loaderPosition.left + 10}
              top={loaderPosition.top + 10}
            />
          )}
        </Box>
      ) : (
        <Container py="8" flex="1">
          <Text>Loading...</Text>
        </Container>
      )}
      <FloatButton>
        <MenuItem
          shadow="md"
          rounded="md"
          bg="white"
          onClick={() => router.push('/app/docs/assistant')}
        >
          <HStack spacing="2">
            <Icon as={MdAdd} mr="2" color="brand.600" />
            <Text>Nuevo</Text>
          </HStack>
        </MenuItem>
        <MenuItem
          shadow="md"
          rounded="md"
          bg="white"
          onClick={onPublishDrawerOpen}
        >
          <HStack spacing="2">
            <Icon as={MdPublish} mr="2" color="brand.600" />
            <Text>Publicar</Text>
          </HStack>
        </MenuItem>
        <MenuItem shadow="md" rounded="md" bg="white">
          <HStack
            spacing="2"
            onClick={() => {
              store.setModalTitle('¡Ups, me has pillado!');
              store.setModalIcon(JullietError as any);
              store.setModalIcon(
                <Icon as={JullietError} w={24} h={24} fill={iconModalColor} />
              );
              store.setModalMessage(
                'Esta funcionlidad no esta disponible aun, pero pronto lo estara!'
              );
              store.onModalOpen();
            }}
          >
            <Icon as={MdShield} mr="2" color="brand.600" />
            <Text>Revisar originalidad</Text>
          </HStack>
        </MenuItem>
      </FloatButton>
      <DocPublishDrawer
        isOpen={isPublishDrawerOpen}
        onClose={onPublishDrawerClose}
      />
    </>
  );
};

export const SuggestionToolTip = (props: any) => {
  const {isOpen} = props;

  return (
    <Box
      bg="yellow.200"
      aria-label="a tooltip"
      position="fixed"
      borderRadius="md"
      shadow="md"
      top="0"
      right="0"
      style={{display: 'inline-block'}}
      hidden={!isOpen}
      margin="4"
      padding="4"
    >
      <Stack>
        <Text color="black" ml="2" fontWeight="bold">
          {' '}
          Atajos de teclado:{' '}
        </Text>
        <Text color="black" p={2} fontSize="0.9rem" border={10}>
          <b>TAB</b>: aceptar la sugerencia
          <br />
          <b>SHIFT + TAB</b>: cambiar la sugerencia
        </Text>
      </Stack>
    </Box>
  );
};

const baseValue: Descendant[] = [
  {
    // @ts-ignore
    type: 'paragraph',
    children: [{text: ''}]
  }
];

export default DocDetail;
