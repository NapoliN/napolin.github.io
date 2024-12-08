import MarkdownIt from 'markdown-it';

export const Plugin = (md: MarkdownIt) => {
    const DOT_MARKER = ':::';
    const cache = new Map();

    md.block.ruler.before('fence', 'dot_fence', (state, startLine, endLine, silent) => {
        const startPos = state.bMarks[startLine] + state.tShift[startLine];
        const maxPos = state.eMarks[startLine];
        const marker = state.src.slice(startPos, maxPos).trim();
        if (!/:::\s*dot/.test(marker)) return false;

        if (silent) return true;

        let nextLine = startLine + 1;
        let content = '';

        while (nextLine < endLine) {
            const lineStart = state.bMarks[nextLine] + state.tShift[nextLine];
            const lineEnd = state.eMarks[nextLine];
            const line = state.src.slice(lineStart, lineEnd).trim();

            if (line === DOT_MARKER) {
                break;
            }

            content += state.src.slice(lineStart, lineEnd) + '\n';
            nextLine++;
        }

        if (nextLine >= endLine) return false;

        const token = state.push('dot_fence', 'strong', 0);
        token.content = content.trim();

        state.line = nextLine + 1;

        return true;
    });

    md.renderer.rules['dot_fence'] = (tokens, idx) => {
        const content = tokens[idx].content;
        console.log(content);
        return `graphvizcontent\{\{${content}\}\}graphvizcontent\n`;
    };
};