import { DocumentLang, DocumentLangIsoToName, IEmail, Tone } from '@/types';
import { Descendant } from 'slate';
import { EmailScript } from '@/lib/services/constants';
import { withExponentialBackoff } from '@/lib/utils/promises';
import { fetchSimpleSuggestion } from '@/lib/fetchers';

interface EmailGenerationProps {
  title: string;
  tone: Tone;
  lang: DocumentLang;
  context?: string;
}

interface EmailSuggestionProps {
  prompt: string;
  isAccepted: boolean;
  tone: Tone;
  langName: string;
  context?: string;
}

async function generate(props: EmailGenerationProps): Promise<IEmail> {
  const { title, tone, lang, context } = props;

  const langName = DocumentLangIsoToName[lang as DocumentLang];

  const { paragraphs, wordsCount } = await withExponentialBackoff(
    () =>
      getEmail({
        prompt: title,
        isAccepted: true,
        tone: tone,
        langName,
        context
      }),
    5,
    500
  );

  const data = {
    title,
    paragraphs,
    wordsCount
  } as IEmail;

  data.slateData = serializeToSlate(data);
  return data;
}

async function getEmail(props: EmailSuggestionProps) {
  const { prompt, isAccepted, tone, langName, context } = props;

  let { text, wordsCount } = await fetchSimpleSuggestion({
    prompt: EmailScript(prompt, langName, tone, context),
    isAccepted: isAccepted
  });

  //remove new lines from text
  console.log('TEXT_TO_PARSE', text);
  const paragraphs = text.split('\n');

  return { paragraphs, wordsCount };
}

const emptySlateBlock = {
  type: 'paragraph',
  children: [{ text: '' }]
};

function serializeToSlate(email: IEmail) {
  const { paragraphs } = email;

  let sectionsNodes: Descendant[] = [];
  paragraphs.forEach((paragraph: string) => {
    const paragraphNode = {
      type: 'paragraph',
      children: [{ text: paragraph }]
    } as Descendant;

    sectionsNodes.push(paragraphNode);
  });

  return [emptySlateBlock, ...sectionsNodes, emptySlateBlock];
}

export { generate, serializeToSlate };
