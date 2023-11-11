import {DocumentLang, DocumentLangIsoToName} from "@/types";
import OpenAI from "openai";

export const JullietChatScript = (conversation: string) => {
    return `
Hum: Hola actua como un chatbot que genera contenido de acuerdo a las necesidades del usuario.
Julliet: Hola 👋, soy Julliet, ¿en qué puedo ayudarte?
${conversation}
Generate the response using HTML tags
`.trim();
};

export const BlogPostOutlineScript = (
    title: string,
    langName: string,
    tone: string,
    context?: string
) => `
{
  "title": BLOG_POST_TITLE,
  "sections": [{
             "title": H2_TITLE_1,
             "sections": [{"title": H3_TITLE_1}, {"title": H3_TITLE_2}]
        },
        {
             "title": H2_TITLE_2,
             "sections": [{"title": H3_TITLE_1}, {"title": H3_TITLE_2}]
        },
        {
             "title": H2_TITLE_3,
             "sections": [{"title": H3_TITLE_1}, {"title": H3_TITLE_2}]
        }
   ]
}
Siguiendo la estructura descrita anteriormente, genera en idioma ${langName} y usando un tono: ${tone}, un estructura de un blog post, con el titulo "${title}\n"
Context: ${context || title}\n
`;

export const EmailScript = (
    title: string,
    langName: string,
    tone: string,
    context?: string
) => `
Context: ${context || title}\n
Genera en idioma ${langName} y usando un tono: ${tone}, un email de 3 párrafos, con el titulo "${title}\n"`;

export const SpanishConclutionGenericTitles = [
    'Conclusión',
    'Resumen',
    'Conclusiones',
    'Resumen final',
    'En términos generales',
    'En conclusión'
];

export const FanFictionSummaryScript = (
    title: string,
    lang: string,
    tone: string,
    context?: string
) => `
    Context: ${context || title}\n
    Act like a professional writer and write in ${lang} a fan fiction history based on the title:
    "${title}"\n`;


export const EssayChatScript = (
    title: string,
    lang: string,
    tone: string,
    context?: string
): OpenAI.Chat.CreateChatCompletionRequestMessage[] => {

    const langName = DocumentLangIsoToName[lang as DocumentLang];
    return [
        {
            role: 'user',
            content: `
            ${context || title}\n
            Act like a professional writer and write in ${langName} with a voice tone ${tone} and help me to write an essay about "${title}", the essay needs to have the following structure:

* Index
* Introduction
* Body with index titles and citations
* Conclusion
* FAQ
* Bibliography

IMPORTANT Each index point MUST have at least 2 paragraphs inside the body.\n
Add at least 5 questions and answers in the FAQ section\n
Apegate a la realidad, no menciones nada de el origen de la generación de este documento
Return the response always using the MARKDOWN syntax`.trim()
        }
    ]
}


const ConsejoNode = {
    type: 'paragraph',
    children: [
        {
            text: 'Pro Tip #1: 👋 Puedes crear más párrafos creando títulos y luego seleccionando el texto y pulsando la opción "Generar Párrafo".'
        }
    ]
};

const ConsejoNode2 = {
    type: 'paragraph',
    children: [
        {
            text: 'Pro Tip #2: También puedes reescribir el texto seleccionando el texto y pulsando la opción "Reescribir Selección".'
        }
    ]
};

export const Advices = [ConsejoNode, ConsejoNode2];
