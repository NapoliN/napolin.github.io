---
title: BEAST攻撃
tags:
  - セキュリティ
  - Network
date: 2025/8/20
---

# BEAST攻撃

TLS1.0にまで存在した脆弱性を利用した攻撃。

### 条件
- 中間者攻撃が成立する
    - 攻撃者は暗号化された通信を観測できる
    - 攻撃者はvictimに対して任意のリクエストを発生させられる

### 攻撃結果
暗号化された通信の内容が解読される。
特に、

## 背景
この辺りの知識は追加で必要だった。
- ブロック暗号
- TLSレコード

### ブロック暗号
ブロック暗号では、平文を特定の長さに区切って暗号化する。

::: dot
digraph G {
  rankdir=TB;
  graph [nodesep=1.0, ranksep=0.6];
  node  [fontname="Noto Sans JP", fontsize=14];

  // 左の行ラベル
  row_plain [label="平文",  shape=plain];
  row_enc   [label="暗号化", shape=plain];
  row_cipher[label="暗号文", shape=plain];

  // 上段（平文）
  p1   [label="P_1", shape=circle,  width=0.5, fixedsize=true];
  p2   [label="P_2", shape=circle,  width=0.5, fixedsize=true];
  pEll [label="…", shape=plain];
  pnm1 [label="P_n-1", shape=circle,  width=0.5, fixedsize=true];
  pn   [label="P_n", shape=circle,  width=0.5, fixedsize=true];

  mEll [label="…", shape=plain];

  // 下段（暗号文）
  c1   [label="c_1", shape=diamond, width=0.7, fixedsize=true];
  c2   [label="c_2", shape=diamond, width=0.7, fixedsize=true];
  cEll [label="…", shape=plain];
  cnm1   [label="c_n-1", shape=diamond, width=0.7, fixedsize=true];
  cn   [label="c_n", shape=diamond, width=0.7, fixedsize=true];

  // 同じ行で横並び
  {rank=same; row_plain;  p1;  p2;  pEll; pnm1; pn;}
  {rank=same; row_cipher; c1;  c2;  cEll; cnm1; cn;}

  // 矢印（↓）
  p1 -> c1;
  p2 -> c2;
  pn -> cn;
  pnm1 -> cnm1;

  // 列の整列用に不可視エッジ
  row_plain -> row_enc -> row_cipher [style=invis];
  pEll -> mEll -> cEll [style=invis];
}
:::

このように、ブロックごとに単に暗号化する方式を**EBC**という。同じ鍵・同じ平文に対して常に同じ暗号文を返すので、あまりセキュアでない。
じゃあどうするかというと、$i$番ブロックの暗号化を行う前に、$i$番ブロックの平文と$i-1$番ブロックの暗号文でXORを取る。
こうすることで、同じ平文ブロックが存在したとしても暗号文は異なる値となり、安全性があがる。

ここで1つ問題が生じる。0番ブロックは前の暗号文が存在しない。
そこで、IV(初期化ベクトル)と呼ばれるランダムな値で構成されたブロックを利用する。0番ブロックの暗号文は、IVと平文をXORしたものを暗号化することによって生成される。

#### CBCモード
$i$番目の平文ブロックを$P_i$、初期化ベクトルを$\mathit{IV}$、暗号化関数を$E$としたとき、$i$番目の暗号ブロック$C_i$は以下のように構成される。

$$
C_i = \left\\{ \begin{array}{ll}
E(\mathit{IV} \oplus P_i) & \text{if}~~ i=1\\\\
E(C_{i-1} \oplus P_i) & \text{otherwise}
\end{array}\right.
$$

:::dot
digraph G {
  rankdir=TB;
  graph [nodesep=0.45, ranksep=0.4];
  node  [fontname="Noto Sans JP", fontsize=14];
  edge  [fontname="Noto Sans JP", fontsize=18];

  // 左の行ラベル
  row_plain [label="平文",  shape=plain];
  row_xor   [label="", shape=plain];
  row_enc   [label="暗号化", shape=plain];
  row_cipher[label="暗号文", shape=plain];

  // 上段（平文）

  p1   [label="P_1", shape=circle,  width=0.6, fixedsize=true];
  p2   [label="P_2", shape=circle,  width=0.6, fixedsize=true];
  p3   [label="P_3", shape=circle,  width=0.6, fixedsize=true];
  pEll [label="…", shape=plain];
  pnm1 [label="P_n-1", shape=circle,  width=0.6, fixedsize=true];
  pn   [label="P_n", shape=circle,  width=0.6, fixedsize=true];

  // 中段上
  xor1 [label="XOR", shape=box, fixedsize=true];
  xor2 [label="XOR", shape=box, fixedsize=true];
  xor3 [label="XOR", shape=box, fixedsize=true];

  xornm1 [label="XOR", shape=box, fixedsize=true];
  xorn [label="XOR", shape=box, fixedsize=true];

  mEll [label="…", shape=plain];

  // 下段（暗号文）
  iv   [label="IV", shape=circle, width=0.5, fixedsize=true];
  c1   [label="c_1", shape=diamond, width=0.7, fixedsize=true];
  c2   [label="c_2", shape=diamond, width=0.7, fixedsize=true];
  cEll [label="…", shape=plain];
  cnm2 [label="c_n-2", shape=diamond, width=0.7, fixedsize=true];
  cnm1   [label="c_n-1", shape=diamond, width=0.7, fixedsize=true];
  cn   [label="c_n", shape=diamond, width=0.7, fixedsize=true];

  // 同じ行で横並び
  {rank=same; row_plain;  p1;  p2; p3;  pEll; pnm1; pn;}
  {rank=same; row_cipher; c1; iv;  c2;  cEll; cnm2; cnm1; cn;}
  {rank=same; row_xor; xor1; xor2; xor3; xornm1; xorn;}

  // 矢印（↓）
  p1 -> xor1;
  iv -> xor1;
  xor1 -> c1 [label="E"];
  
  p2 -> xor2;
  c1 -> xor2;
  xor2 -> c2 [label="E"];

  p3 -> xor3;
  c2 -> xor3;

  cnm2 -> xornm1;
  pnm1 -> xornm1;
  xornm1 -> cnm1 [label="E"];

  cnm1 -> xorn;
  pn -> xorn;
  xorn -> cn [label="E"];

  // 列の整列用に不可視エッジ
  row_plain -> row_xor -> row_enc -> row_cipher [style=invis];
  pEll -> mEll -> cEll [style=invis];
  
}
:::

なお復号は、暗号文$C_i$を復号したものに対して暗号文$C_{i-1}$とXORを取ることで平文$P_i$を得ることができる。
これは$x \oplus x = \mathit{id}$ であることによる。

$$
D(C_i) = (P_i \oplus C_{i-1}) \oplus C_{i-1}
$$


:::info
参考サイト
https://zenn.dev/kunosu/books/12fa489ef0821d803c4d/viewer/cbc
:::

### TLS
TLS(Transport Layer Security)は、TCP上で暗号化通信を行うためにプロトコル。
TLSの重要ポイントはハンドシェイクとかDH鍵交換とか色々ありますが、この記事のスコープ外なので割愛。
ここでは暗号化されたTLS通信のデータがどのようにネットワーク上を流れるのか、というのに焦点をあてる。

ハンドシェイクプロトコルによってTLSコネクションが確立されたあと、実際のアプロケーションデータは次の手順で処理される。

#### 送信側の処理
1. 送信メッセージをレコード長で指定された長さ(MAX 16KB)に分割する。
1. 圧縮する (option、TLS1.3で廃止)
1. MACを付加する (改ざん検知)
1. 暗号化
1. ヘッダ付けてレコードとして下位プロトコルに送信

受信側の処理はこの逆順。

::: warning
TLS1.0では、2番目以降のレコードのIVは「前レコードの最後の暗号ブロック」と定義される(最初のIVはハンドシェイク時に生成:generated with the other keys and secrets when the security parameters are set.)。
すなわち、$j$番レコードのIVは$C^j_{n}$である。
この仕様により、攻撃者は初期化ベクトルを観測することができる（攻撃者が次送るレコードの平文を細工することで、IVを打ち消すことができる。詳細は後述）。
:::

## 原理
$k$番目のレコードの$i$番目の平文、すなわち$p^k_i$をターゲットとします。攻撃者はこの平文を直接知ることはできません。
CBCの仕組みにより、対応する暗号文$c^k_i$は次のように構成されます。
$$
c^k_i = E(c^k_{i-1} \oplus p^k_i)
$$

さて、攻撃者はこの暗号文$c^k_i$を観測することができます。
ここで、攻撃者は任意の平文を暗号化させることができるので、次のように考えます。
- 推測文$g$と$c^k_{i-1}$をXORさせたものを暗号化した結果が、$c^k_i$と一致したならば、$g=p^k_i$である

これを行うために、$l$番目のレコードの1番ブロックを次のように設定します。
$$
p^l_1 = c^k_{i-1} \oplus c^{l-1}_n \oplus g
$$

この平文ブロックの暗号文$p^l_1$は次のように求められます。

$$
\begin{array}{rl}
c^l_1 & = E(p^l_1 \oplus c^{l-1}\_n) \\\\
&= E(c^k\_{i-1} \oplus c^{l-1}_n \oplus g \oplus c^{l-1}\_n) \\\\
&= E(c^k\_{i-1} \oplus g)
\end{array}
$$

ここで、攻撃者は$c_i^k$と$c^l_1$が一致するように$g$を総当たりで試します。
一致したときに使った$g$が平文$p^k_i$となります。

:::info
ブロックが16バイトなら、1ブロック割るために最大$2^{256}$回の試行が必要になります。
このままでは現実的じゃないですね。
:::

### 試行に必要な回数を減らす
前節での指摘の通り、総当たりして平文の暗号化結果が偶然$g$と一致するのを狙うのは現実的ではありません。
なんとか総当たりを行う範囲を減らす方法がないか、考えてみます。

攻撃者は、victimが送る文章を任意に操作できる、ということを思い出しましょう。
任意に操作できる、ということは、狙ったデータ(例えばcookie)の前に任意の量のprefixをつけることが可能、ということです。
仮に流出させたい平文が$i$番ブロックに存在する「de ad be af be be ab cd ef 01 02 03 04 05 06 07」だったとしましょう。
これを解読するためには16バイトが丸々一致するのを狙う必要があり、前述のように$2^{256}$回の試行が必要となり現実的ではありません。

ここで、このデータの前に、15個の「A」(41 41 41 41...)を付加させてみます。
そうすると、$i$番ブロックのデータは「41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 de」となり、未知のバイトは1バイトになります。
1バイトを当てれば解読(暗号文が一致)できるので、これを割り出すのは高々$2^8=256$回の試行で済みます。

次に2バイト目の「ad」を割り出しましょう。
データの前に14個の「A」を付加させると、$i$番ブロックのデータは「41 41 41 41 41 41 41 41 41 41 41 41 41 41 de ad」となります。
ここで、15バイト目の「de」は先ほどの攻撃で割り出したので、未知のバイトはやはり1バイトです。

このように総当たり攻撃を繰り返し、未知のバイトを1バイトずつ割り出していきます。
1バイト割り出すのに最大$2^8$回の試行が必要だったので、16バイト割り出すためには最大$2^{12}=4096$回の試行で済むことになります。ずいぶん楽になってしまいました。

## 攻撃フロー
1. victimに仕組まれたHTTPSリクエストを投げさせ、内容を観測する。 *1
1. 観測した内容から、ターゲット$c^k_i,c^k\_{i-1}$を記録する。
1. 任意バイト送信機構 *2を使って、準備レコードを投げ、最終暗号ブロック$c^{l-1}_n$を記録する。
1. 上2つの記録から平文を生成して、任意バイト送信機構を通じて投げる
1. 先頭ブロックの暗号文$c^l_1$と$ターゲット$c^k_i$を比較する。一致しなければ3に戻ってやり直し。

:::info
*1: HTTPヘッダのフォーマットを考慮すると、どのブロックに何のデータがあるかは推測可能。
:::

:::info
*2: 前のレコードの最後の暗号ブロックの結果を見て送る平文ブロックを生成して投げるという手法なので、任意バイトをレコードとして送信させられる仕組みが必要となる。
通常のHTTPSリクエストでこれを実現するのは難しい（というか、無理じゃね？）

当時はJavaアプレットなどを利用して任意バイト送信の仕組みを悪用していたらしい。
:::