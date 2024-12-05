# Vite + Reactでmdファイルをレンダリングする
###### tags: `IT関連`

メモをgithub.ioでお手軽に公開できるようにしたいなと思いまして。
テスト兼備忘録として綴ります。

## やったこと
- mdファイルをレンダリングする
- mathjaxを使って数式を表示できるようにする
- フォルダの中身を半自動的に読み込んでgithub.io上で公開する

基本ライブラリ頼りでエイヤッてするだけなので難しいことはやってないです。

## mdファイルをレンダリングする

### 1. 必要なライブラリをインストールする
viteでマークダウンを扱えるようにするライブラリはいくつかありますが、更新が新しい＆TypeScriptの型のサポートがあるという理由で`vite-pluguin-markdown`を選びました。
```
npm i -D vite-plugin-markdown
```

### 2. vite-env.d.tsを編集する
`vite-env.d.ts`に以下をコピペします。これで補完・型チェックが効くようになります。
```
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

### 3. mdファイルを書く
`src/assets/helloworld.md`に書きました。

'''
# Helloworld
mdをレンダリングできるかのテスト
'''


### 4. mdファイルをコンポーネントとして読み込む。
このライブラリは便利で、mdファイルをコンポーネントとして読み込むことができます。
```
import { ReactComponent as Markdown} from "./notes/helloworld.md"

return (
    <div>
    ...
        <Markdown />
    </div>
)
```

これでmdファイルをレンダリングすることが可能になります。


## 数式を表示できるようにする
上記の設定だと数式環境を表示することができません。今後使いたくなる気がするので入れました。
今のとこ描画速度とか拘りがないので、Mathjaxを入れることにします。

### 1. 必要なライブラリをインストールする
mathjaxを素で入れても良いとは思いますが、React向けのwrapperっぽいのがあったのでそれを使いました。

説明書きにはまず`package.json`に直書きしろとか書いてますけどなくても問題ないと思います。（そのためのパッケージ管理ツールでは？）
```
npm i better-react-mathjax
```

### 2. 数式環境を導入したいコンテキストをwrapする
数式環境を使いたい要素を`MathJaxContext`で囲みます。
これでこの要素内において、MathJaxの記法が有効になります。

```
import { MathJaxContext } from 'better-react-mathjax'
...
    <MathJaxContext config={config}>
        <div>
            $$
            ma = F
            $$
        </div>
    </MathJaxContext>
```


### 設定を調整する
Mathjax環境のインライン数式は、デフォルトだと`\(expression\)`という形式を採用しています。
TeXとかHackMDに慣れた人類にとってはやや使い勝手が悪いので、 `$expression$`の形式に変更しましょう。
入れたMathjaxのversionが3系列だったので、`Mathjax3Config`をimportします。

```
import { MathJax3Config, MathJaxContext } from 'better-react-mathjax';

const config: MathJax3Config = {
    tex:{
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']],
    }
};
```
inline数式、display数式として使いたいデリミタをそれぞれ2要素の配列として渡せばよいです。

```
    <MathJaxContext config={config}>
        $ \frac{1}{2}$
    </MathJaxContext>
```
これで$\frac{1}{2}$がインライン数式として表示できるようになります。

## md用のcssスタイルを導入する
コードブロックとか碌にスタイル当ててくれなくてみにくいのでcssスタイルの導入を検討中。
あとで書きます

## フォルダの中身を自動で読み込む
mdを追加するたびに手書きでimportしてなんてやってらんないので、フォルダ内においただけで自動的にページを生やせるようにしたい。
静的ホスティングサービスでデプロイしてるので、フォルダ構造考えて動的にファイル読んで～みたいなことはできません。~~ぴえん~~

そこで、prebuildで読み込むべきファイルをjsonでリストアップしてそこから動的importする。という形式をとります。
このやり口は別記事に詳しく書く予定。

