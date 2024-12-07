---
title: GarbageCollection入門
tags: GarbageCollection
---

# GarbageCollection入門(編集中)
Garbage Collection(以下、GC)とは、動的に確保されたメモリを管理するプログラムである。


## 基本3種
GCの実装アイデアは次の3つに大別することができる。
- Reference Counting
- Mark and Sweep
- Mark and Copy

それぞれの欠点を補うため、後述するように、実用的なプログラミング言語のGCはより複雑な仕組みで実装される。

### Reference Counting
##### メリット
- 負荷が分散される

##### デメリット
- 循環参照でメモリリークする

### Mark and Sweep
##### メリット
- 循環参照も正しく解放できる

##### デメリット
- GCが走ったとき、メインプログラムが固まる

### Mark and Copy
##### メリット

##### デメリット
