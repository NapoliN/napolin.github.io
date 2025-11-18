---
title: セキスペ入門 DNS
tags: 
    - セキスペ
date: 2025/11/18
---

# セキスペ入門：DNSセキュリティ
DNSの基礎知識については別途記事を書くかもしれない。

DNS(Domain Name System)は、ホスト名とIPアドレスの対応付けを行うデータベースのような機能を提供するシステムである。
各ドメインに対してゾーンと呼ばれる管理単位が割り当てられ、ゾーンを管理する権利DNSサーバがそのドメインに対する名前解決を担当する。
歴史的にDNSはUDPを用いた通信が行われ、送信元IPアドレスの偽装が容易であることから、様々な攻撃手法が考案されてきた。
本校では代表的な攻撃手法の紹介を行った後、それらの問題を解決するための技術について説明する。

## 攻撃手法
### DNS amp攻撃 (DNS Reflection攻撃とも)
DNSサーバのオープンリゾルバ機能を悪用し、攻撃対象に大量のDNS応答を送り付けるDDoS攻撃。
ボットネット及びオープンリゾルバDNSサーバを利用することで、少ないリソースでも大規模な攻撃を実現できる。

::: mermaid
sequenceDiagram
    participant Attacker as 攻撃者 <br/> xxx.xxx.xxx.xxx
    participant BotNet as ボットネット <br/> zzz.zzz.zzz.zzz
    participant Victim as 被害者サーバ<br/> yyy.yyy.yyy.yyy
    box rgb(230,230,230) オープンリゾルバ
    participant OpenResolver1 as オープンリゾルバDNSサーバ
    participant OpenResolver2 as オープンリゾルバDNSサーバ
    participant OpenResolver3 as オープンリゾルバDNSサーバ
    end

    Attacker->>BotNet: 攻撃命令
    BotNet->>OpenResolver1: DNSクエリ<br/> (送信元IPを偽装: yyy.yyy.yyy.yyy)
    BotNet->>OpenResolver2: DNSクエリ<br/> (送信元IPを偽装: yyy.yyy.yyy.yyy)
    BotNet->>OpenResolver3: DNSクエリ<br/> (送信元IPを偽装: yyy.yyy.yyy.yyy)
    OpenResolver1-->>Victim: DNS応答
    OpenResolver2-->>Victim: DNS応答
    OpenResolver3-->>Victim: DNS応答
    Note over Victim: 大量のDNS応答により<br/>サービス不能状態に
:::

第三者からのDNSクエリを受け付けるオープンリゾルバにおいて、攻撃者は送信元IPアドレスを被害者サーバのIPアドレスに偽装したDNSクエリを大量に送信する。
オープンリゾルバはそのクエリに対して応答を返すが、応答先は偽装されたIPアドレス(被害者サーバ)になるため、被害者サーバは大量のDNS応答を受け取ることになる。

::: info
**ANYクエリ**

DNSのリソースレコードのうち、指定されたホスト名に関連するすべてのレコードを返すクエリタイプ。
問い合わせのサイズに対し、応答のサイズが非常に大きくなる場合があるので、増幅率が高い。

ANYクエリは現在では非推奨とされており、多くのDNSサーバソフトウェアではANYクエリに対して制限が設けられている。
:::

::: info
UDPで行う通信の中で、クエリに対してリプライのパケットサイズが大きいプロトコルであれば成立するので、NTPやSSDPなども同様の攻撃に利用される。
:::

### DNSキャッシュポイズニング
DNSのキャッシュに不正な情報を注入し、正しい名前解決を妨害する攻撃。

::: mermaid
sequenceDiagram
    participant Attacker as 攻撃者 <br/>
    participant Victim as 被害者クライアント
    participant CacheDNS as キャッシュDNSサーバ <br/>
    participant AuthoritativeDNS as 権威DNSサーバ<br/>
    autonumber

    Attacker->>CacheDNS: DNS問い合わせ<br/> www.example.com
    CacheDNS->>AuthoritativeDNS: 再帰問い合わせ<br/> www.example.com
    Attacker-->>CacheDNS: 偽のDNS応答<br/> www.example.com -> aaa.aaa.aaa.aaa
    Note over CacheDNS: 偽の応答をキャッシュ<br/> www.example.com : aaa.aaa.aaa.aaa
    AuthoritativeDNS--xCacheDNS: 正規のDNS応答(破棄される)<br/> www.example.com -> xxx.xxx.xxx.xxx

    Victim->>CacheDNS: DNS問い合わせ<br/> www.example.com
    CacheDNS-->>Victim: DNS応答<br/> www.example.com: aaa.aaa.aaa.aaa
:::

本来www.example.comのIPアドレスはxxx.xxx.xxx.xxxであるはずが、攻撃者が偽の応答をキャッシュDNSサーバに注入することで、被害者クライアントは誤ってaaa.aaa.aaa.aaaにアクセスしてしまう。
aaa.aaa.aaa.aaaが攻撃者が用意したサーバで、www.example.comを装った内容だった場合、クライアントはそれが偽サイトであることに気づかず、情報漏洩やマルウェア感染などの被害が発生する可能性がある。

この攻撃を成立させるためには、以下の条件を成立させる必要がある。
- 標的のキャッシュDNSサーバに、標的のドメインに対する再帰問い合わせが発生する(つまり、キャッシュされていない/キャッシュが期限切れである)
- 正規のDNS応答が攻撃者の偽の応答よりも遅く到着する
- 偽の応答は、キャッシュDNSサーバが問い合わせに使用したトランザクションIDと送信元ポート番号を正しく含んでいる

これらの条件を満たすため、攻撃者は標的のキャッシュDNSサーバに対して大量のDNSクエリを送り付け、同時に偽の応答を大量に送り付けることで、攻撃の成功率を高める。
送信元ポート番号が固定されている(ソースポートランダマイゼーションが無効化されている)場合、攻撃者はトランザクションIDのみを総当たりで試せばよいため、攻撃の成功率が高くなってしまうため、注意が必要。

::: info
**ソースポートランダマイゼーション**

キャッシュDNSサーバがDNSクエリを送信する際に使用する送信元ポート番号をランダムに変更する仕組み。
攻撃者が偽の応答を生成する際に、正しい送信元ポート番号まで当てる必要があるため、攻撃の成功率を下げる効果がある。
:::

### カミンスキー攻撃
カミンスキー攻撃は、DNSキャッシュポイズニングを成立させるための攻撃の1つ。

前述の手法では、標的のキャッシュDNSサーバから再帰問い合わせを発生させる必要がある、すなわちキャッシュの期限切れのタイミングを狙う必要があり、あまり現実的な攻撃手法とは言えなかった。
カミンスキー攻撃では、存在しないサブドメインに対するDNSクエリを大量に送り付けることで、強制的に再帰問い合わせを発生させることで、攻撃の成功率を高める。

::: mermaid
sequenceDiagram
    participant Attacker as 攻撃者
    participant CacheDNS as キャッシュDNSサーバ
    participant AuthoritativeDNS as 権威DNSサーバ
    autonumber
    Attacker->>CacheDNS: クエリ: aaa.example.com <br/> クエリ: bbb.example.com <br/> クエリ: ccc.example.com ...
    note right of Attacker: 存在しないサブドメインに対する<br/>再帰問い合わせを大量に発生
    CacheDNS->>AuthoritativeDNS: 再帰問い合わせ: aaa.example.com <br/> 再帰問い合わせ: bbb.example.com <br/> 再帰問い合わせ: ccc.example.com ...
    note right of CacheDNS: キャッシュが存在し得ないため、<br/>すべて再帰問い合わせを行う
    Attacker-->>CacheDNS: 対応する偽の応答を大量に送信<br/>送られる内容は後述
    CacheDNS->>CacheDNS: 偽の応答をキャッシュ
    AuthoritativeDNS--xCacheDNS: 正規のDNS応答<br/>(そんなドメインねえよ)
    note right of CacheDNS: トランザクションは終了しているため、<br/>正規の応答は破棄される
:::

攻撃者は偽の応答として、以下のようなレスポンスを送り付ける。
```
Question:
aaa.example.com IN A

Answer: 
www.example.com IN A aaa.aaa.aaa.bbb

Authority: 
example.com IN NS ns.attacker.com
ns.attacker.com IN A aaa.aaa.aaa.aaa
```

これを受け取ったキャッシュDNSサーバは、Answerセクションへの回答として、www.example.comのIPアドレスがaaa.aaa.aaa.bbbであるとキャッシュしてしまう。
さらに、Authorityセクションによって、example.comドメインのNSが攻撃者の用意したDNSサーバ「ns.attacker.com」であるとキャッシュしてしまうため、
以降、キャッシュの有効期限が切れるまで、example.comドメインに対する問い合わせはすべて攻撃者の用意したDNSサーバに転送されてしまう。

### サブドメインテークオーバ攻撃
サブドメインの管理を放棄したあとに、ドメインの移譲設定をそのままにしている状況で、第三者がそのサブドメインを取得し、悪意のあるコンテンツをホストする攻撃。
CDNなどの外部サービスを利用している場合に発生しやすい。

CDNサービスは、次のように設定することで利用することができる。
例えば、example.comドメインのサブドメインであるsub.example.comをCDNサービスでホストするケースを考える。
まず、CDNサービスに登録することで、CDNサービス側でsub.example.cdnprovider.comのようなホスト名が割り当てられる。
次に、example.comドメインのDNSゾーンファイルに以下のようなCNAMEレコードを追加する。

```
sub.example.com IN CNAME sub.example.cdnprovider.com
```

これにより、sub.example.comへのアクセスはCDNサービスに転送され、CDNサービス側でコンテンツが配信されるようになる。

この状態で、CDNサービスの利用を停止し、sub.example.cdnprovider.comのホスト名が解放された場合、第三者が同じホスト名を再登録することが可能になる場合がある。
前述のCNAMEレコードを削除し忘れた場合、sub.example.comへのアクセスは引き続きCDNサービスに転送されるため、第三者が正規ドメインをもったまま悪意のあるコンテンツをホストすることが可能になる。

::: mermaid
sequenceDiagram
    box rgb(230,230,230,0.3) 
        participant Owner as ドメイン所有者
        participant DNS as DNSサーバ
    end
    participant CDN as CDNサービス
    participant Attacker as 攻撃者
    participant Victim as 被害者ユーザ

    autonumber

    Owner->>CDN: sub.example.cdnprovider.comを登録
    Owner->>DNS: CNAMEレコードを追加<br/> sub.example.com -> sub.example.cdnprovider.com

    Owner->>CDN: CDNサービスの利用停止
    Attacker->>CDN: sub.example.cdnprovider.comを再登録

    Victim->>DNS: DNSクエリ: sub.example.com
    DNS-->>Victim: CNAME応答: sub.example.cdnprovider.com
    Victim->>CDN: HTTPリクエスト: sub.example.cdnprovider.com
    CDN-->>Victim: 悪意のあるコンテンツ
:::

1. ドメイン所有者は、CDNサービスに登録し、コンテンツを配信する。
2. ドメイン所有者は、自ドメインのDNSゾーンファイルにCNAMEレコードを追加し、サブドメインをCDNサービスに転送する。
3. ドメイン所有者がCDNサービスの利用を停止する。
4. 攻撃者がCDNサービスに同じホスト名で再登録する。
5. 被害者ユーザが該当のサブドメインにアクセスし、CDNサービスに転送される。
6. 攻撃者がホストする悪意のあるコンテンツが被害者ユーザに配信される。

例えば、攻撃者が元々提供されていたWebサイトと見た目の変わらないフィッシングサイトをホストした場合、被害者ユーザは正規サイトにアクセスしていると誤認し、ID/パスワードなどの機密情報を入力してしまう可能性がある。
URLは正しいドメインを表しているため、パスワード自動入力も機能し、発見は非常に困難といえる。

## CAAレコード
[RFC8659](https://tex2e.github.io/rfc-translater/html/rfc8659.html)参照。Certification Authority Authorization (CAA) Resource Record.
CAAレコードは、DNSに登録されるリソースレコードの1つ。ドメインの所有者が、そのドメインに対応するサーバ証明書の発行を許可する認証局(CA: Certificate Authority)を指定するために使用される。
CAAレコードを設定することで、ドメイン所有者でない第三者が勝手にそのドメインのサーバ証明書を発行することを防ぐことができる。
認証局はサーバ証明書の発行前にDNSに問い合わせ、ドメイン所有者が当該CAからの証明書発行を許可しているかチェックする。
サーバ証明書/ワイルドカード証明書を発行可能なCAのドメイン、無効リクエストの報告先メアドを指定できる。

::: mermaid
sequenceDiagram
    participant Owner as ドメイン所有者
    participant DNS as DNSサーバ
    participant CA_A as 認証局A <br/> ca-a.com
    participant CA_B as 認証局B <br/> ca-b.com
    participant Attacker as 攻撃者
    Owner->>DNS: CAAレコードを追加<br/> example.com IN CAA 0 issue "ca-a.com"

    rect rgb(200,255,200,0.8)
        note over Owner,CA_A: 正規の証明書発行フロー
        Owner->>CA_A : サーバ証明書発行リクエスト<br/> example.com
        CA_A->>DNS: CAAレコード問い合わせ<br/> example.com
        DNS-->>CA_A: CAA応答 <br/> issue "ca-a.com"
        CA_A-->>Owner: サーバ証明書発行
    end
    rect rgb(255,200,200,0.5)
        note over DNS,Attacker: 攻撃者による不正な証明書発行フロー
        Attacker->>CA_B : サーバ証明書発行リクエスト<br/> example.com
        CA_B->>DNS: CAAレコード問い合わせ<br/> example.com
        DNS-->>CA_B: CAA応答 <br/> issue "ca-a.com"
        CA_B--xAttacker: サーバ証明書発行拒否
    end
:::

## DNSSEC
DNS Security Extensions.
DNS権威サーバの応答にデジタル署名を付与し、応答の改ざん検知と応答元の認証を行う仕組み。

関連するRFCは大量にある。
| RFC番号 | タイトル | 概要 |
| ------- | -------- | ---- |
| RFC9364 | DNS Security Extensions (DNSSEC) | 取っ散らかったDNSSEC関連RFCをまとめたもの |
| RFC4033 | DNS Security Introduction and Requirements | DNSSECの概要と要件 |
| RFC4034 | Resource Records for the DNS Security Extensions | DNSSECで使用されるリソースレコードの定義 |
| RFC4035 | Protocol Modifications for the DNS Security Extensions | DNSSECで使用されるプロトコルの定義 |
| RFC3833 | DNS Security Threats and Countermeasures | DNSに対する攻撃手法とDNSSECによる対策 |

通常、DNSはUDPを用いて通信を行うため、送信元IPアドレスを偽装した攻撃が容易に可能である。
例として、DNSキャッシュポイズニング攻撃では、攻撃者が送信元IPアドレスを偽装し、キャッシュDNSサーバに対して正規の応答より先に偽の応答を送り付けることで、キャッシュに不正な情報の注入を行う。

DNSSECでは、権威サーバが提供するデジタル署名を確認し、応答の正当性を検証することで、改ざんやなりすましを防止する。

::: mermaid
sequenceDiagram
    participant Resolver as リゾルバ<br/>=ユーザ
    participant CacheDNS as キャッシュDNS(=フルサービスリゾルバ)
    participant AuthoritativeDNS as 権威DNSサーバ
    autonumber
    Resolver ->>CacheDNS: DNSクエリ
    
    note left of Resolver: 再帰問い合わせを<br/>TLD→SLD→...で行う
    loop 再帰問い合わせ
        
        CacheDNS->>AuthoritativeDNS: DNSクエリ
        AuthoritativeDNS-->>CacheDNS: DNS応答 + デジタル署名
        CacheDNS->>CacheDNS: 署名の検証
    end
    CacheDNS-->>Resolver: DNS応答
:::

1. リゾルバがDNSクエリを送信
2. 権威サーバが応答にデジタル署名を付与して返す
3. リゾルバは、応答に付与された署名を検証する

### 導入設定
ゾーン管理者は以下の手順で署名検証が行える環境を構築する。
1. 鍵ペアを2種類生成する。一方を**ZSK(Zone Signing Key)**、もう一方を**KSK(Key Signing Key)**とする。
2. リソースレコードをZSKの秘密鍵で署名する。署名は**RRSIGレコード(Resource Record Signature)**として公開する。
3. KSK,ZSKの公開鍵をDNSKEYレコードとしてゾーンに追加する。これらのDNSKEYレコードはまとめて**RRset(Resource Record Set)**と呼ばれる。
4. RRsetをKSKの秘密鍵で署名する。署名はRRSIGレコードとして公開する。
4. KSKの公開鍵のハッシュ値を**DSレコード**として親ゾーンに登録する。

::: info
**ZSKとKSK**

DNSKEYには **ZSK(Zone Signing Key)** と **KSK(Key Signing Key)** という2種類がある。
ZSKは、ゾーン内のリソースレコードを署名するときに使う鍵で、KSKはDNSKEYレコード自体(RRset)を署名するときに使う鍵である。
親ゾーンのDSレコードにはKSKのハッシュ値を登録する。

一般に、KSKはZSKよりもローテーションの頻度が低く、長い期間使用される。これは、KSKの変更を行った場合、親ゾーンに登録されているDSレコードも更新する必要があるためである。
逆にZSKの更新では、ゾーン内の各RRSIGレコードを再生成を行うだけで済むため、比較的簡単にローテーションを行うことができる。
このように、鍵の役割を分けることで、セキュリティと運用のバランスを取っている。
:::

### 処理の流れ
リゾルバがwww.example.comのAレコードを問い合わせたときの処理の流れを例に、DNSSECの検証手順を説明する。
ただし説明を簡単にするため、フルサービスリゾルバ(=キャッシュDNS)にはキャッシュが存在せず、ルートゾーンから順に再帰問い合わせが発生するものとする。
問い合わせを受けたフルサービスリゾルバは、まずルートゾーンに対して、.comドメインのNSレコードを問い合わせる。
ルートゾーンの権威サーバは、.comドメインのNSレコードと、その検証のために必要なレコードを返す。ここで、検証に必要なレコードは
- ルートゾーンのDNSKEYレコードおよびそのRRSIG
- .comドメインのNSレコードに対応するRRSIG

である。

フルサービスリゾルバは、まず自身にあらかじめ登録されているトラストアンカー(=ルートゾーンのDNSKEY KSK)を用いて、ルートゾーンのDNSKEYレコードのRRSIGを検証する。
この検証に成功すれば、ルートゾーンのDNSKEY ZSKおよびKSKの正当性が証明される **(1)**。
次に、ルートゾーンのDNSKEY ZSKを用いて、.comドメインのNSレコードに対応するRRSIGを検証する。
この検証は、.comドメインのNSレコードの正当性を証明する **(2)**。
同様の手順で、.comドメインのDSレコードの正当性が証明される **(3)**。

なおルートゾーンを管理する権威サーバは、応答に追加で.comドメインのDSレコードとそれに対応するRRSIGを返す。
このDSレコードは、.comゾーンのDNSKEY KSKのハッシュ値を含み、.comゾーンのKSKの正当性を検証するために使用される。

::: dot
digraph dnssec_chain {

    rankdir=LR;
    nodesep = 0.6;
    ranksep = 0.4;
    node [fontname="monospace", fontsize=10, shape=record, style=filled, fillcolor="#f8f8ff"];
    edge [fontname ="monospace", fontsize=10];

    // フルサービスリゾルバ
    resolver [label=" フルサービスリゾルバ |
        <anchor> トラストアンカー (rootのDNSKEY(KSK))
    ", shape=record, fillcolor="#e8ffe8",width=3];



        subgraph cluster_root {
            label=". (ルートゾーン)"
            root_dnskey [label="{ 
                DNSKEY | {
                    {
                        <rrset> RRset | {
                            <ksk> ルートゾーンのDNSKEY(KSK) |
                            <zsk> ルートゾーンのDNSKEY(ZSK)
                        }
                    } |
                    <rrsig> RRsetに対応するRRSIG
                    }
                }"]
                
            root_ns [label="{
                <ns> NS | {
                    .comドメインのNS |
                    NSレコードに対応するRRSIG
                }
            }"];
            root_ds [label="{
                <ds> DS | {
                    .comドメインのDS |
                    DSレコードに対応するRRSIG
                }
            }"];

            root_dnskey:zsk -> root_ns:ns [label="2.検証", style=dashed, color=red, fontcolor=red]
            root_dnskey:zsk -> root_ds:ds [label="3.検証", style=dashed, color=red, fontcolor=red]
        }

        subgraph cluster_com {
            label=".comゾーン"
            com_dnskey [label="{ 
                DNSKEY | {
                    {
                        <rrset> RRset | {
                            <ksk> .comゾーンのDNSKEY(KSK) |
                            <zsk> .comゾーンのDNSKEY(ZSK)
                        }
                    } |
                    <rrsig> RRsetに対応するRRSIG
                    }
                }"]
                
            com_ns [label="{
                <ns> NS | {
                    .example.comドメインのNS |
                    NSレコードに対応するRRSIG
                }
            }"];
            com_ds [label="{
                <ds> DS | {
                    .example.comドメインのDS |
                    DSレコードに対応するRRSIG
                }
            }"];

            com_dnskey:zsk -> com_ns:ns [label="6.検証", style=dashed, color=red, fontcolor=red]
            com_dnskey:zsk -> com_ds:ds [label="7.検証", style=dashed, color=red, fontcolor=red]
            com_dnskey:ksk -> com_dnskey:rrset [label="5.検証", style=dashed, color=red, fontcolor=red]
        }

        subgraph cluster_example {
            label=".example.comゾーン"
            example_dnskey [label="{ 
                DNSKEY | {
                    {
                        <rrset> RRset | {
                            <ksk> ルートゾーンのDNSKEY(KSK) |
                            <zsk> ルートゾーンのDNSKEY(ZSK)
                        }
                    } |
                    <rrsig> RRsetに対応するRRSIG
                    }
                }"]
                
            example_a [label="{
                <a> A | {
                    www.example.comのAレコード |
                    Aレコードに対応するRRSIG
                }
            }"];

            example_dnskey:zsk -> example_a [label="10.検証", style=dashed, color=red, fontcolor=red]
            example_dnskey:ksk -> example_dnskey:rrset [label="9.検証", style=dashed, color=red, fontcolor=red]
        }

        resolver:anchor -> root_dnskey:rrset [style=dashed, label="1.検証", color=red, fontcolor=red]
        root_ds:ds -> com_dnskey:ksk [label="4.検証", color="blue", style=dashed, fontcolor="blue", constraint=false]
        com_dnskey:ksk -> root_ds:ds [label="公開鍵のハッシュ値を登録", color="orange", fontcolor="orange"]
        example_dnskey:ksk -> com_ds:ds [label="公開鍵のハッシュ値を登録", color="orange", fontcolor="orange"]
        com_ds:ds -> example_dnskey:ksk [label="8.検証", color="blue", style=dashed, fontcolor="blue", constraint=false]

}

:::

ここまでの手順で、フルサービスリゾルバは検証済みの.comゾーンを管理するName Serverを取得した。これを用いて、.comゾーンに対しexample.comドメインのNSレコードを問い合わせる。

example.comゾーンの権威サーバも同様に、example.comドメインのNSレコードと、その検証のために必要なレコードを返す。同時に検証のために
- example.comゾーンのDNSKEYレコードおよびそのRRSIG
- example.comドメインのNSレコードに対応するRRSIG

を追加の情報として返す。

フルサービスリゾルバはまず、.comゾーンのDNSKEYレコードのうち、KSKの正当性を確認する。これは、ルートゾーンからの問い合わせで得たDSレコードを用いて、KSKのハッシュ値を検証することで行う **(4)**。
KSKの正当性が確認できたら、そのKSKを用いて.comゾーンのDNSKEYレコードのRRSIGを検証し、ZSKの正当性を確認する **(5)**。

あとは同様の手順で、example.comドメインのNSレコード **(6)**、DSレコード **(7)**の検証を行う。

最後に、example.comゾーンに対して、www.example.comのAレコードを問い合わせる。
今までと全く同様に、.comゾーンから取得したexample.comゾーンに関するDSレコードを用いてKSKの正当性を検証 **(8)**、
KSKを用いてDNSKEYレコードのRRSIGを検証しZSKの正当性を検証 **(9)** し、
ZSKを用いてwww.example.comのAレコードに対応するRRSIGを検証  **(10)** する。

| 番号 | 使用する鍵/ハッシュ値 | 検証する対象 | 正当性が証明される対象 |
| -- | ---------- | ------------ | ---------------------- |
| 1 | トラストアンカー | ルートゾーンのDNSKEY RRsetのRRSIG | ルートゾーンのDNSKEY ZSK |
| 2 | ルートゾーンのDNSKEY ZSK | .comドメインのNSレコードに対応するRRSIG | .comドメインのNSレコード |
| 3 | ルートゾーンのDNSKEY ZSK | .comドメインのDSレコードに対応するRRSIG | .comドメインのDSレコード |
| 4 | .comドメインのDSレコード | .comゾーンのDNSKEY KSKのハッシュ値 | .comゾーンのDNSKEY KSK |
| 5 | .comゾーンのDNSKEY KSK | .comゾーンのDNSKEY RRsetのRRSIG | .comゾーンのDNSKEY ZSK |
| 6 | .comゾーンのDNSKEY ZSK | example.comドメインのNSレコードに対応するRRSIG | example.comドメインのNSレコード |
| 7 | .comゾーンのDNSKEY ZSK | example.comドメインのDSレコードに対応するRRSIG | example.comドメインのDSレコード |
| 8 | example.comドメインのDSレコード | example.comゾーンのDNSKEY KSKのハッシュ値 | example.comゾーンのDNSKEY KSK |
| 9 | example.comゾーンのDNSKEY KSK | example.comゾーンのDNSKEY RRsetのRRSIG | example.comゾーンのDNSKEY ZSK |
| 10 | example.comゾーンのDNSKEY ZSK | www.example.comドメインのAレコードに対応するRRSIG | www.example.comドメインのAレコード |


ここまでの手順によって、ルートからの**信頼の連鎖(chain of trust)**が、www.example.comのAレコードまで繋がる。

## DoT
DNS over TLS.
TCP 853番ポートでTLSセッションを確立し、その上でDNSクエリ/応答をやり取りする仕組み。

## DoH
DNS over HTTPS.
HTTPSセッション上でDNSクエリ/応答をやり取りする仕組み。


