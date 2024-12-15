---
title: GarbageCollection入門
tags: GarbageCollection
date: 2024/12/15
---

# GarbageCollection入門(編集中)
学部時代の輪講で読んだ「Garbage Collection by Richard Jones, Rafael D Lins(1st Edition)」 を読み直してみる。

::: dot
digraph {
node_A [
    label = "This is a Label of Node A";
];
}
:::


## Preliminary
Garbage Collection(以下、GC)とは、動的に確保されたメモリを管理するプログラムである。

### Allocation Policy
メモリ割り付け戦略
#### Static Allocation
プログラム中の全ての変数の番地をコンパイル時に決定する戦略。
歴史的には、Fortran 77までがこの戦略を用いていた。

::: success
**メリット**
- 動作が高速（全てのメモリアクセスがdirectlyに計算できるため）
- メモリ枯渇などによる実行時エラーが発生しない。
:::

::: error
**デメリット**
- 全てのデータ構造の大きさを静的に決定する必要がある。
- 手続きごとに1つのスペースなので、再帰呼び出しが出来ない。
:::


#### Stack Allocation
手続きが呼び出される度に、フレームをスタックに積み、returnされるごとにpopする戦略。現代の言語でもおなじみ？
::: success
**メリット**
- 呼び出しごとにフレームが生成されるため、再帰呼び出しが可能になった。
- 配列の長さなどをcallerからパラメータ渡しすることで可変にできる。
::: 

::: error
**デメリット**
- procedure内の変数の値を、呼び出し間で共有できない(例えば、自分が呼び出された回数を保持するとか)。
- フレーム内の値はcallerから参照できない(変数の生存期間がprocedure内に限定される)。
- データ構造の大きさがコンパイル時に決まるオブジェクトのみ、手続きの戻り値とすることができる。
:::

#### Heap Allocation
Stack AllocationのLIFOによる制約(stackの頭でしかallocate-deallocateできない)を緩和して、any orderでできるようにする。
::: success
- リストとか木とかを再帰使ってサクッと書けるようになる
- データ構造の大きさをruntimeに決定することができる。
- データ構造の大きさがruntimeに決まるオブジェクトを、手続きの戻り値とすることができる。
- 関数クロージャを戻り値にできる(Stack Allocationだと、関数そのものを戻り値にすることしかできない)
:::

### Dungling references
メモリを解放したとき、そのメモリが別のオブジェクトによって参照されたままでいる状態のこと。
Use After Free(UAF)攻撃の原因となる。

次のような構造体`list`を考える。
```c++
struct list {
    int value;
    struct list *next;
};
```
そして、次のコードを考える。
```c++
struct *list a = new list();
struct *list b = new list();
a->next = b;
delete b; 
```
このとき、`a->next`は解放済みのメモリを指しており、dangling referenceとなる。
運が良ければクラッシュしてくれるけど、間違ったまま動作しちゃうと最悪だね。大体Segmentation Faultしてバグの原因が分からなくて泣く。

## 基本3種
GCの実装アイデアは次の3つに大別することができる。
- Reference Counting
- Mark and Sweep
- Mark and Copy

それぞれの欠点を補うため、後述するように、実用的なプログラミング言語のGCはより複雑な仕組みで実装される。

### Reference Counting
それぞれのオブジェクトが、自分を指しているポインタの数を管理する方式。

::: success
**メリット**
- GCにかかる負荷が(時間的に)全体に分散される
- 使わなくなったタイミングで回収されるので、空間局所性が高い(ので、cache miss/page faultが発生しにくい)
:::

::: error
**デメリット**
- 全てのオブジェクトに追加のフィールドが必要
- 回収にかかるコストは、解放するオブジェクトから繋がっているポインタの数に依存する
― ポインタの書き換えの度にcountの変更処理が必要
- 循環参照でメモリリークが発生する
:::

::: info
**補足**

実用的なプログラムでは、大体のオブジェクトは短命だし共有されない。
解放したメモリをすぐ使えれば空間局所性を活かせるので、Reference Countingは実用的なプログラムでは高速な動作が期待できる。
:::

### Mark and Sweep
::: success
**メリット**
- 循環参照も正しく解放できる
:::

::: error
**デメリット**
- GCにかかる負荷がGC実行時に集中する(ユーザプログラムから見ると、固まった状態になる)
:::

### Mark and Copy
##### メリット

##### デメリット
