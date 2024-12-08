---
title: mdでgraphvizを使ってグラフを書く
---
# mdでgraphvizを使ってグラフを描く

::: dot
digraph G {
    rankdir=LR;
    A->B->C;
}
:::
graphvizなのでかなり自由度高く書ける。
ブロックの前に空行入れる必要だけあるのが難点だけど、まあ我慢

::: dot
digraph G {
    size="10";
    rankdir=LR;
    node [shape=circle];
    End [color="blue"];
    Start -> S1 [label="Initialize"];
    S1 -> S2 [label="Process"];
    S2 -> S3 [label="Success",color="green",fontcolor="green"];
    S2 -> S4 [label="Failure",color="red",fontcolor="red"];
    S4 -> S5 [label="Retry"];
    S5 -> S3 [label="Success",color="green",fontcolor="green"];
    S5 -> S4 [label="Failure",color="red",fontcolor="red"];
    S3 -> End [label="Complete"];
    
    // 非同期的な遷移（ダミーで示す）
    S2 -> S6 [label="Async"];
    S6 -> S3 [label="Async Result"];
}
:::

## 用意
必要なライブラリをインストールする。
```
npm i markdown-it @hpcc-js/wasm-graphviz
```

## Pluginを書く
svgに変換したいテキストを変換するためにプラグインを書きます。
`::: dot (svg content) :::` を `graphviz{{ (svg content) }}graphviz` に置き換える処理を書いてます。

```typescript
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
        return `graphviz\{\{${content}\}\}graphviz\n`
    };
};
```

:::info
最初はプラグイン内で直接置き換えればいいじゃん！と思ってました。
が、どうやらParse中にasync関数は使えないみたいです([FAQ](https://github.com/markdown-it/markdown-it/blob/master/docs/development.md#i-need-async-rule-how-to-do-it))。
:::

## vite.config.tsを編集する

さっき書いたプラグインを使うように書き換えます。

```typescript
const md = MarkdownIt()
md.use(Plugin)
```

## レンダリング前に小細工する
`props.Markdown`にhtml化したマークダウンがstringで入ってます。
regexで置き換えてsvgに変換してあげれば、完成。

``` typescript
  const [html, sethtml] = useState("")
  useEffect(() => {
    let result = props.Markdown
    const convertSvg = async () => {
      const graphviz = await Graphviz.load();
      const matches = result.matchAll(/graphvizcontent\{\{(.*?)\}\}graphvizcontent/gs).toArray();

      const replace = await Promise.all(
        matches.map(async (match) => {
          const content = match[1];
          return graphviz.dot(content, "svg");
        })
      );
      matches.forEach((match,idx) => {
        result = result.replace(match[0], replace[idx])
      })
      sethtml(result);
      
    }
    convertSvg();
  },[])
```

::: info
regexは最小マッチにしないと２つ以上グラフを書いたとき、誤ったマッチが取れるのでバグる。
:::

::: warning
プラグイン挟まずにregexでマッチできるんじゃない？とも思った。
が、特殊記号がエスケープされてしまうので、「特殊記号をエスケープしないために」pluginを挟む必要がある。
:::