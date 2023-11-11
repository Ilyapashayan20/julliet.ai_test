import {
  DocumentLang,
  DocumentLangIsoToName,
  IBlogPostOutline,
  Tone
} from '@/types';
import { Descendant } from 'slate';
import { Advices, BlogPostOutlineScript } from '@/lib/services/constants';
import { fetchSimpleSuggestion } from '@/lib/fetchers';
import { withExponentialBackoff } from '@/lib/utils/promises';

interface PostGenerationProps {
  title: string;
  tone: Tone;
  lang: DocumentLang;
  context?: string;
}

interface BlogPostSuggestionProps {
  prompt: string;
  isAccepted: boolean;
  tone: Tone;
  langName: string;
  context?: string;
}

async function generate(props: PostGenerationProps): Promise<IBlogPostOutline> {
  console.log('GENERATING BLOG POST OUTLINE');
  const initTime = Date.now();
  const { title, tone, lang, context } = props;

  const langName = DocumentLangIsoToName[lang as DocumentLang];

  const { outline, wordsCount } = await withExponentialBackoff(
    () =>
      getOutline({
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
    sections: outline.sections,
    wordsCount
  } as IBlogPostOutline;

  data.slateData = serializeToSlate(data);
  console.log('BLOG POST OUTLINE GENERATED');
  console.log('TIME TO GENERATE BLOG POST OUTLINE', Date.now() - initTime);
  return data;
}

async function getOutline(props: BlogPostSuggestionProps) {
  const { prompt, isAccepted, tone, langName, context } = props;

  let { text, wordsCount } = await fetchSimpleSuggestion({
    prompt: BlogPostOutlineScript(prompt, langName, tone),
    isAccepted: isAccepted
  });

  //remove new lines from text
  text = text.replace('\n', '');
  console.log('TEXT_TO_PARSE', text);
  const outline = JSON.parse(text);

  return { outline, wordsCount };
}

const emptySlateBlock = {
  type: 'paragraph',
  children: [{ text: '' }]
};

function serializeToSlate(blogPostOutline: IBlogPostOutline) {
  const { sections } = blogPostOutline;

  let sectionsNodes: Descendant[] = [];
  sections.forEach((section) => {
    const sectionH2Node = {
      type: 'heading-two',
      children: [{ text: section.title }] as Descendant[]
    };
    sectionsNodes.push(sectionH2Node);
    sectionsNodes.push(emptySlateBlock);

    section.sections.forEach((subSection, idx) => {
      const sectionH3Node = {
        type: 'heading-three',
        children: [{ text: `${idx + 1}. ${subSection.title}` }] as Descendant[]
      } as Descendant;

      sectionsNodes.push(sectionH3Node);
      sectionsNodes.push(emptySlateBlock);
    });

    sectionsNodes.push(emptySlateBlock);
  });

  return [...Advices, emptySlateBlock, ...sectionsNodes, emptySlateBlock];
}

export { generate, serializeToSlate };
