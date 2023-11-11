import { DocumentLang, DocumentLangIsoToName, IBlogPost, Tone } from '@/types';
import { Descendant, Node } from 'slate';
import { withExponentialBackoff } from '@/lib/utils/promises';
import { fetchSimpleSuggestion } from '@/lib/fetchers';
import { Advices, SpanishConclutionGenericTitles } from '../services/constants';

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
  lang: string;
  context?: string;
}

async function generate(props: PostGenerationProps): Promise<IBlogPost> {
  console.log('GENERATING BLOG POST');
  const initTime = Date.now();
  const { title, tone, lang, context } = props;

  const langName = DocumentLangIsoToName[lang as DocumentLang];

  let wordsCount = 0;

  const summary = await withExponentialBackoff(
    () =>
      getSummary({
        lang: langName,
        prompt: title,
        isAccepted: true,
        tone: tone
      }),
    5,
    500
  );

  wordsCount += summary.wordsCount;

  const index = await getIndex({
    prompt: summary.text,
    lang: langName,
    isAccepted: true,
    tone: tone,
    context: context
  });

  wordsCount += index.wordsCount;

  const sectionPromises = index.index.map((sectionTitle: string) => {
    return withExponentialBackoff(
      async () => {
        const { text, wordsCount } = await getSectionContent({
          prompt: sectionTitle,
          lang: langName,
          isAccepted: true,
          tone: tone,
          context: context
        });
        return { title: sectionTitle, content: text, wordsCount: wordsCount };
      },
      5,
      500
    );
  });

  sectionPromises.push(
    withExponentialBackoff(
      () =>
        getEpilogue({
          prompt: title,
          lang: langName,
          isAccepted: true,
          tone: tone,
          context: context
        }),
      5,
      500
    )
  );

  const sections = await Promise.all(sectionPromises);
  const epilogue = sections.pop();

  wordsCount += sections.reduce((acc, section) => acc + section.wordsCount, 0);
  wordsCount += epilogue.wordsCount;

  const data = {
    title,
    summary: summary.text,
    index: index.index,
    sections,
    epilogue: epilogue.text,
    wordsCount,
    slateData: null
  } as IBlogPost;

  data.slateData = serializeToSlate(data);

  console.log('BLOG POST GENERATED');
  console.log('TIME ELAPSED', Date.now() - initTime);

  return data;
}

async function getSummary(props: BlogPostSuggestionProps) {
  const { prompt, isAccepted, tone, lang, context } = props;

  return await fetchSimpleSuggestion({
    prompt: `Context: ${context}\nUsanto un tono ${tone} genera un resumen en idioma ${lang} para un articulo de blog titulado "${prompt}" con el contenido en el idioma del titulo\n`,
    isAccepted: isAccepted
  });
}

async function getIndex(props: BlogPostSuggestionProps) {
  const { prompt, isAccepted, tone, lang, context } = props;

  let { text, wordsCount } = await fetchSimpleSuggestion({
    prompt: `Context:${context}\nUsando un tono ${tone} genera una lista en idioma ${lang} de titulos para las ideas principales en  este resumen, utiliza el formato ["titulo1","titulo2","titulo3"] \n ${prompt} \n`,
    isAccepted: isAccepted
  });

  //remove new lines from text
  text = text.replace('\n', '');
  console.log('TEXT_TO_PARSE', text);
  const index = JSON.parse(text);

  return { index, wordsCount };
}

async function getSectionContent(props: BlogPostSuggestionProps) {
  const { prompt, isAccepted, tone, lang, context } = props;

  return await fetchSimpleSuggestion({
    prompt: `Context:${context}:\n Usando un tono ${tone} profundiza en idioma ${lang} acerca del siguiente punto: "${prompt}" \n`,
    isAccepted: isAccepted
  });
}

async function getEpilogue(props: BlogPostSuggestionProps) {
  const { prompt, isAccepted, tone, lang, context } = props;

  return await fetchSimpleSuggestion({
    prompt: `Context:${context}\nUsando un tono ${tone} genera un epilogo en idioma ${lang} para este articulo de blog acerca de ${prompt} \n`,
    isAccepted: isAccepted
  });
}

const emptySlateBlock = {
  type: 'paragraph',
  children: [{ text: '' }]
};

function serializeToSlate(blogPost: IBlogPost) {
  // TODO: Add ul-li to serialize the index
  const { summary, sections } = blogPost;

  const summaryNode = {
    type: 'paragraph',
    children: [{ text: summary }]
  };

  let sectionsNodes: Descendant[] = [];
  sections.forEach((section) => {
    const sectionTitleNode = {
      type: 'heading-two',
      children: [{ text: section.title }]
    };

    const sectionContentNode = {
      type: 'paragraph',
      children: [{ text: section.content }]
    };

    sectionsNodes.push(sectionTitleNode);
    sectionsNodes.push(sectionContentNode);
    // add a new line
    sectionsNodes.push({ type: 'paragraph', children: [{ text: '' }] } as Node);
  });

  // get ramdom spanish conclution generic title
  const epilogueTitle =
    SpanishConclutionGenericTitles[
      Math.floor(Math.random() * SpanishConclutionGenericTitles.length)
    ];

  const epilogueTitleNode = {
    type: 'heading-two',
    children: [{ text: epilogueTitle }]
  };
  const epilogueNode = {
    type: 'paragraph',
    children: [{ text: blogPost.epilogue }]
  };

  return [
    ...Advices,
    summaryNode,
    emptySlateBlock,
    ...sectionsNodes,
    emptySlateBlock,
    epilogueTitleNode,
    epilogueNode
  ];
}

export { generate, serializeToSlate };
