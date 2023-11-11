import {DocumentLang, Tone} from '@/types';
import {withExponentialBackoff} from '@/lib/utils/promises';
import {fetchSimpleSuggestionByPayload} from '@/lib/fetchers';
import {
    EssayChatScript,
} from '../services/constants';
import {MarkdownToEditorValue} from '../utils/slate';


interface EssayGenerationProps {
    title: string;
    tone: Tone;
    lang: DocumentLang;
    context?: string;
}

async function generate(props: EssayGenerationProps) {
    console.log('GENERATING ESSAY');

    const {title, tone, lang} = props;

    const initTime = Date.now();
    const essay = withExponentialBackoff(
        async () => {
            return fetchSimpleSuggestionByPayload({
                payload: EssayChatScript(title, lang, tone, 'context'),
            });
        },
        5,
        500
    );

    const {text, wordsCount} = await essay;

    console.log('ESSAY GENERATED IN', Date.now() - initTime, 'ms');
    const slateData = MarkdownToEditorValue(text)

    return {
        slateData,
        wordsCount,
    }
}

export {generate};
