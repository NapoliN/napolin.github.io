---
title: Vite + React + github.ioでmdファイルをお手軽公開
tags:
  - "React"
  - "Programming"
---
# Vite + React + github.ioでmdファイルをお手軽公開

Vite + React でポートフォリオを作り、github pagesで静的ホストしています。

知見とかをブログっぽく公開できたらかっこいいかな～と思ったのでやってみました。~~jekyll使って簡単にできるらしいですね~~

テスト兼備忘録として綴ります。

## やったこと
- mdファイルをレンダリングする
- mathjaxを使って数式を表示できるようにする
- フォルダの中身を自動的に読み込んでgithub pages上で公開する

基本ライブラリ頼りでエイヤッてするだけなので難しいことはやってないです。

## 準備. 必要なライブラリをインストールする
viteでマークダウンを扱えるようにするライブラリはいくつかありますが、更新が新しい＆TypeScriptの型のサポートがあるという理由で`vite-pluguin-markdown`を選びました。

入れるのは次の5つ。
- `markdown-it`: markdownを読み込めるようにしてくれるやつ
- `@types/markdown-it` ↑の型定義ファイル
- `vite-pluguin-markdown` ↑↑のwrapperプラグイン
- `@shikijs/markdown-it` Syntax Highlighter shikiのmarkdown用プラグイン
- `better-react-mathjax` mathjaxのreact用warpperプラグイン、mathjax本体も勝手に入れてくれるはず

```bash
npm i -D markdown-it @types/markdown-it vite-plugin-markdown @shikijs/markdown-it
npm i better-react-mathjax
```
(どれをdevdependenciesにするべきなのかは正直分からん)

## mdを読み込めるようにする

#### 1. vite-env.d.tsを編集する
`vite-env.d.ts`に以下をコピペします。これで補完・型チェックが効くようになります。
```typescript
declare module '*.md' {
    // "unknown" would be more detailed depends on how you structure frontmatter
    const attributes: Record<string, unknown>; 
  
    // When "Mode.TOC" is requested
    const toc: { level: string, content: string }[];
  
    // When "Mode.HTML" is requested
    const html: string;
  
    // When "Mode.RAW" is requested
    const raw: string
  
    // When "Mode.React" is requested. VFC could take a generic like React.VFC<{ MyComponent: TypeOfMyComponent }>
    import React from 'react'
    const ReactComponent: React.VFC;
    
  
    // Modify below per your usage
    export { attributes, toc, html, ReactComponent };
  }
```

#### 2. mdファイルをコンポーネントとして読み込む。
mdファイルを`src/notes/helloworld.md`に保存したとしましょう。
このライブラリは便利で、mdファイルをコンポーネントとして読み込むことができます。
が、バグってるのでHTMLで読み込みます:crying-hard:
``` tsx
import { html as Markdown } from "./notes/helloworld.md"

const MarkdownViewer = () => {
    return (
        <div dangerouslySetInnerHTML={{__html:Markdown}}>
        </div>
    )
}
```

これでmdファイルをHTMLに変換して読み込むことができます。

## 数式を表示できるようにする
上記の設定だと数式環境を表示することができません。今後使いたくなる気がするので入れました。

#### 1. 数式環境を導入したいコンテキストをwrapする
数式環境を使いたい要素を`MathJaxContext`で囲みます。さっきのファイルを次のように書き換えます。
これでこの要素内において、MathJaxの記法が有効になります。

``` tsx
import { html as Markdown } from "./notes/helloworld.md"
import { MathJaxContext } from 'better-react-mathjax';

const MarkdownViewer = () => {
    return (
        <MathJaxContext>
            <div dangerouslySetInnerHTML={{__html:Markdown}}>
            </div>
        </MathJaxContext>
    )
}
```

#### 2.設定を調整する
Mathjax環境のインライン数式は、デフォルトだと`\(expression\)`という形式を採用しています。
TeXとかHackMDに慣れた人類にとってはやや使い勝手が悪いので、 `$expression$`の形式に変更しましょう。
入れたMathjaxのversionが3系列だったので、`Mathjax3Config`をimportします。

```tsx
import { html as Markdown } from "./notes/helloworld.md"
import { MathJax3Config, MathJaxContext } from 'better-react-mathjax';

const config: MathJax3Config = {
    tex:{
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']],
    }
};

const MarkdownViewer = () => {
    return (
        <MathJaxContext config={config}>
            <div dangerouslySetInnerHTML={{__html:Markdown}}>
            </div>
        </MathJaxContext>
    )
}
```
inline数式、display数式として使いたいデリミタをそれぞれ2要素の配列として渡せばよいです。
これで$\frac{1}{2}$とかインライン数式を表示できるようになります。

## cssスタイルを導入する
chatGPTに「Markdownに使えるようなcss、モノクロでスタイリッシュなやつ」って言って書いてもらいました。書いてもらったのが[こちら](https://github.com/NapoliN/napolin.github.io/blob/master/src/pages/Markdown.css)。
シンタックスハイライトは別で入れないといけないので、shikiを導入しました。これっていう理由はないです。
`vite-pluggin-markdown`は使う`markdown-it`のインスタンスをinjectionできるので、`vite.config.ts`を編集してオプションとして指定してあげます。


最終的に`vite.config.ts`はこんな感じになります。
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { plugin as markdown, PluginOptions as MdOption, Mode as MdMode } from "vite-plugin-markdown"
import Shiki from '@shikijs/markdown-it'
import MarkdownIt from 'markdown-it'

const md = MarkdownIt()

Shiki({
  themes: {
    light: 'tokyo-night',
    dark: 'tokyo-night'
  }
}).then((highlighter) => {
  md.use(highlighter)
})

const mdOption: MdOption = {
  mode: [MdMode.HTML],
  markdownIt: md
}

export default defineConfig({
  plugins: [react(), markdown(mdOption)],
  build: {
    outDir: './docs',

  },
  optimizeDeps: {
    exclude: ["react-icons", "react-router-dom"]
  }
})

```


## フォルダの中身を自動で読み込む
ここまでの設定で、mdをポートフォリオ上で表示することができました。

さて、mdを追加するたびに手書きでimportしてなんてやってらんないので、フォルダ内においただけで自動的にページを生やせるようにしたいと思いました。
静的ホスティングサービスでデプロイしてるので、フォルダ構造考えて動的にファイル読んで～みたいなことはできません。

そこで、prebuildで読み込むべきファイルをjsonでリストアップしてそこから動的importする。という形式をとります。
このやり口は別記事に詳しく書く予定。

