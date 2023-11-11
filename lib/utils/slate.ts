import {Descendant, Editor, Node, Transforms, Range} from 'slate';
import escapeHtml from 'escape-html';
import {Text} from 'slate';
import {unified} from 'unified';
import markdown from 'remark-parse';
import slate from 'remark-slate';

export const getEditorText = (editorValue: Descendant[]) => {
    try {
        return editorValue.map((node) => Node.string(node)).join('\n');
    } catch (e) {
        console.log('Bad slate value', editorValue);
        return '';
    }
};

export const getWordCount = (editorValue: Descendant[]) => {
    return getEditorText(editorValue).split(/\s+/g).length;
};

export const isValidSlateValue = (value: any) => {
    return (
        Array.isArray(value) && value.length > 0 && getEditorText(value).length > 0
    );
};

function serialize(node: Node): string {
    if (Text.isText(node)) {
        let string = escapeHtml(node.text);
        // @ts-ignore
        if (node.bold) {
            string = `<strong>${string}</strong>`;
        }
        return string;
    }

    const children = node.children.map((n) => serialize(n)).join('');

    // @ts-ignore
    switch (node.type) {
        case 'quote':
            return `<blockquote><p>${children}</p></blockquote>`;
        case 'paragraph':
            return `<p>${children}</p>`;
        case 'link':
            // @ts-ignore
            return `<a href="${escapeHtml(node.url)}">${children}</a>`;
        default:
            return children;
    }
}

export const getDataAsHtml = (data: Descendant[]) => {
    return data.map((n) => serialize(n)).join('');
};

export function createTextBlock(text: string): Descendant[] {
    const res = text.split('\n').map((line) => {
        return {
            type: 'paragraph',
            children: [{text: line}]
        };
    });

    return res;
}

export function addNodesAfterSelection(editor: any, nodes: Node[]) {
    const [_, path] = Editor.node(editor, editor.selection);
    const newLocation = Editor.after(editor, path, {distance: 1});
    Transforms.insertNodes(editor, nodes, {at: newLocation});
}

export function getCurrentSelection(editor: any): Range | undefined {
    const {selection} = editor;
    if (selection == null || !Range.isCollapsed(selection)) {
        return; // nothing to do -- no current word.
    }
    return selection;
}

export function getTextBeforeCaret(editor: any): string {
    const selection = getCurrentSelection(editor);
    let beforeText = '';
    if (selection) {
        // @ts-ignore
        const before = Editor.before(editor, selection);
        if (before) {
            const {path} = before;
            for (let i = 0; i <= path[0]; i++) {
                const text = Editor.string(editor, {
                    anchor: {path: [i], offset: 0},
                    focus: {path: [i], offset: 0}
                });
                beforeText += text;
            }
        }
    }
    return beforeText;
}

export function getCurrentWord(editor: any): Range | undefined {
    const {selection} = editor;
    if (selection == null || !Range.isCollapsed(selection)) {
        return; // nothing to do -- no current word.
    }
    const {focus} = selection;
    const [node, path] = Editor.node(editor, focus);
    if (!Text.isText(node)) {
        // focus must be in a text node.
        return;
    }
    const {offset} = focus;
    const siblings: any[] = Node.parent(editor, path).children as any;

    // We move to the left from the cursor until leaving the current
    // word and to the right as well in order to find the
    // start and end of the current word.
    let start = {i: path[path.length - 1], offset};
    let end = {i: path[path.length - 1], offset};
    if (offset == siblings[start.i]?.text?.length) {
        // special case when starting at the right hand edge of text node.
        moveRight(start);
        moveRight(end);
    }
    const start0 = {...start};
    const end0 = {...end};

    function len(node: any): number {
        // being careful that there could be some non-text nodes in there, which
        // we just treat as length 0.
        return node?.text?.length ?? 0;
    }

    function charAt(pos: {i: number; offset: number}): string {
        const c = siblings[pos.i]?.text?.[pos.offset] ?? '';
        return c;
    }

    function moveLeft(pos: {i: number; offset: number}): boolean {
        if (pos.offset == 0) {
            pos.i -= 1;
            pos.offset = Math.max(0, len(siblings[pos.i]) - 1);
            return true;
        } else {
            pos.offset -= 1;
            return true;
        }
        return false;
    }

    function moveRight(pos: {i: number; offset: number}): boolean {
        if (pos.offset + 1 < len(siblings[pos.i])) {
            pos.offset += 1;
            return true;
        } else {
            if (pos.i + 1 < siblings.length) {
                pos.offset = 0;
                pos.i += 1;
                return true;
            } else {
                if (pos.offset < len(siblings[pos.i])) {
                    pos.offset += 1; // end of the last block.
                    return true;
                }
            }
        }
        return false;
    }

    while (charAt(start).match(/\w/) && moveLeft(start)) {}
    // move right 1.
    moveRight(start);
    while (charAt(end).match(/\w/) && moveRight(end)) {}
    if (
        (start.i === start0.i && start.offset === start0.offset) ||
        (end.i === end0.i && end.offset === end0.offset)
    ) {
        // if at least one endpoint doesn't change, cursor was not inside a word,
        // so we do not select.
        return;
    }

    const path0 = path.slice(0, path.length - 1);
    return {
        anchor: {path: path0.concat([start.i]), offset: start.offset},
        focus: {path: path0.concat([end.i]), offset: end.offset}
    };
}


export function MarkdownToEditorValue(markdownText: string) {
    const processor = unified()
        .use(markdown)
        .use(slate);

    const {result} = processor.processSync(markdownText);

    // @ts-ignore
    const slateData = result.map((block: any) => {
        // replace underscores with hyphens in types
        // const type = block.type.replace('_', '-');

        return {
            type: block.type,
            children: block.children,
        };
    });


    // Add empty paragraphs after each block
    const newSlateData = slateData.reduce((acc: any, block: any) => {
        acc.push(block);
        acc.push({
            type: 'paragraph',
            children: [{text: ''}]
        });
        return acc;
    }, []);

    return newSlateData;
}
