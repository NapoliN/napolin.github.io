---
title: POODLE攻撃
tags: Security, Network
date: 2025/8/21
---

# POODLE攻撃

## 概要
POODLE（Padding Oracle On Downgraded Legacy Encryption）攻撃は、SSL 3.0の脆弱性を利用した暗号化通信の解読手法。
SSL3.0の欠陥であり、SSL3.0の使用が禁止となった。

## 主なポイント
- SSL 3.0のCBCモードのパディング処理の不備を悪用
- 攻撃者が暗号文の一部を操作し、平文を段階的に復元可能
- TLSを用いている場合でも、ダウングレード攻撃によってSSL3.0による通信に切り替わってしまうケースがあった

## 原理
