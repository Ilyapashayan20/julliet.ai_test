import {
  DocumentLang,
  DocumentLangIsoToName,
  IFanFiction,
  Tone
} from '@/types';
import { FanFictionSummaryScript } from '@/lib/services/constants';
import { withExponentialBackoff } from '@/lib/utils/promises';
import { fetchSimpleSuggestion } from '@/lib/fetchers';
import { Descendant } from 'slate';

interface FanFictionGenerationProps {
  title: string;
  tone: Tone;
  lang: DocumentLang;
  context?: string;
}

interface FanFictionSuggestionProps {
  prompt: string;
  isAccepted: boolean;
  tone: Tone;
  lang: string;
  context?: string;
}

async function generate(
  props: FanFictionGenerationProps
): Promise<IFanFiction> {
  const { title, tone, lang, context } = props;

  let totalWordsCount = 0;

  const { summary, wordsCount: summaryWordsCount } =
    await withExponentialBackoff(
      () =>
        getSummary({
          prompt: title,
          isAccepted: true,
          tone: tone,
          lang,
          context
        }),
      5,
      500
    );

  totalWordsCount += summaryWordsCount;

  const data = {
    title,
    paragraphs: summary,
    wordsCount: totalWordsCount
  } as IFanFiction;

  data.slateData = serializeToSlate(data);
  return data;
}

async function getSummary(props: FanFictionSuggestionProps) {
  const { prompt, isAccepted, tone, lang, context } = props;

  let { text, wordsCount } = await fetchSimpleSuggestion({
    prompt: FanFictionSummaryScript(prompt, lang, tone, context),
    isAccepted: isAccepted,
    maxTokens: 3500,
    temperature: 0.6
  });

  //remove new lines from text
  console.log('TEXT_TO_PARSE', text);
  const paragraphs = text.split('\n');

  return { summary: paragraphs, wordsCount };
}

const emptySlateBlock = {
  type: 'paragraph',
  children: [{ text: '' }]
};

function serializeToSlate(fanfiction: IFanFiction) {
  let sectionsNodes: Descendant[] = [];
  fanfiction.paragraphs.forEach((paragraph: string) => {
    const paragraphNode = {
      type: 'paragraph',
      children: [{ text: paragraph }]
    } as Descendant;

    sectionsNodes.push(paragraphNode);
  });

  return [emptySlateBlock, ...sectionsNodes, emptySlateBlock, emptySlateBlock];
}

export { generate, serializeToSlate };
