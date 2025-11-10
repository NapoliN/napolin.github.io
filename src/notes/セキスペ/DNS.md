---
title: セキスペ入門 DNS
tags: 
    - セキスペ
date: 2025/10/20
---

# セキスペ入門：DNSセキュリティ
DNSの基礎知識については別途記事を書く予定。

DNS(Domain Name System)は、ホスト名とIPアドレスの対応付けを行うデータベースのような機能を提供する分散型システムです。
各ドメインに対してゾーンと呼ばれる管理単位が割り当てられ、ゾーンを管理する権利DNSサーバがそのドメインに対する名前解決を担当します。
ホスト名を用いてアクセスするクライアントは、DNS解決を行いて対応するIPアドレスを取得し、そのIPアドレスに対して通信を行います。
そのため、DNSの応答が改ざんされたり、偽の応答が返されたりすると、クライアントは誤ったIPアドレスにアクセスしてしまい、サービス妨害や情報漏洩などの被害が発生する可能性があります。

代表的な攻撃手法の紹介を行った後、それらの問題を解決するための技術について説明します。

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
    participant Owner as ドメイン所有者
    participant CDN as CDNサービス
    participant Attacker as 攻撃者
    participant Victim as 被害者ユーザ

    Owner->>CDN: sub.example.cdnprovider.comを登録
    Owner->>DNS: CNAMEレコードを追加<br/> sub.example.com -> sub.example.cdnprovider.com

    Owner->>CDN: CDNサービスの利用停止
    Attacker->>CDN: sub.example.cdnprovider.comを登録

    Victim->>DNS: DNSクエリ: sub.example.com
    DNS-->>Victim: CNAME応答: sub.example.cdnprovider.com
    Victim->>CDN: HTTPリクエスト: sub.example.cdnprovider.com
    CDN-->>Victim: 悪意のあるコンテンツ
:::

## リソースレコード
ゾーンファイルに記述される、DNSのデータの単位。

色んなレコードタイプがある。

| レコードタイプ | 説明 |
| -------------- | ---- |
| A              | ホスト名からIPv4アドレスを引く |
| AAAA           | ホスト名からIPv6アドレスを引く |
| CNAME          | ホスト名の別名を定義する (Canonical Name) |
| MX             | メールサーバのホスト名を指定する (Mail eXchanger) |
| NS             | そのゾーンを管理するDNSサーバのホスト名を指定する (Name Server) |

::: info
**CAAレコード**

Certification Authority Authorization。
登録されたドメインに対応する証明書の発行を許可する認証局を指定するレコード。
ドメイン所有者でない第三者が勝手にそのドメインのサーバ証明書を発行することを防ぐことができる。
認証局はサーバ証明書の発行前にDNSに問い合わせ、ドメイン所有者が当該CAからの証明書発行を許可しているかチェックする。
サーバ証明書/ワイルドカード証明書を発行可能なCAのドメイン、無効リクエストの報告先メアドを指定できる。
:::

## DNSSEC
DNS Security Extensions.
DNS権威サーバの応答にデジタル署名を付与し、応答の改ざん検知と応答元の認証を行う仕組み。
1. リゾルバがDNSクエリを送信
2. 権威サーバが応答にデジタル署名を付与して返す
3. リゾルバは、応答に付与された署名を検証する

PKI同様、ルートからの信頼の連鎖(chain of trust)を利用する。
リゾルバはルートゾーンの公開鍵をトラストアンカーとして保持するため、そこから始まる信頼の連鎖をたどって応答の正当性を検証できる。

## DoT
DNS over TLS.
TCP 853番ポートでTLSセッションを確立し、その上でDNSクエリ/応答をやり取りする仕組み。

## DoH
DNS over HTTPS.
HTTPSセッション上でDNSクエリ/応答をやり取りする仕組み。


