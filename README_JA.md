# Fukutaro

[English README](./README.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Fukutaro は、YouTube 動画の再生にあわせてタイミング付きの音声解説を同期させる JavaScript ユーティリティです。障害のある方を含むすべての利用者にとって、動画コンテンツのアクセシビリティを高めます。動画のタイムスタンプに紐づいたスクリプトに基づいて音声合成を自動実行できるため、[WCAG 2.2](https://www.w3.org/TR/WCAG22/) に沿った形で、コンテンツへのアクセスを支援できます。

## Getting Started

### Prerequisites

- モダンな Web 技術に対応した最新のブラウザ
- HTML と JavaScript の基本知識

### Usage

Fukutaro を Web プロジェクトに組み込むことで、YouTube 動画に同期した音声解説を提供できます。`data-youtube_id` には対象の YouTube 動画 ID を、`data-youtube_title` には音声解説の切り替えラベルに使う動画タイトルを設定してください。

本番環境では、`main` ブランチではなく `@v1.0.0` のようなタグ付きバージョンを参照してください。`fukutaro.js` は YouTube IFrame Player API を自動で読み込みます。

以下は、jsDelivr を使うシンプルな例です。

```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>Fukutaro Example</title>
</head>
<body>
    <!-- 実際の YouTube 動画 ID に置き換えてください -->
    <div
        id="fukutaro_movie"
        data-youtube_id="YOUR_YOUTUBE_VIDEO_ID"
        data-youtube_title="Video Title"
    ></div>
    <textarea id="fukutaro_script" aria-label="Timed Audio Description">
        00:10 5 1.0 This is a test audio description.
        00:20 5 1.0 Another test audio description.
    </textarea>

    <script src="https://cdn.jsdelivr.net/gh/jidaikobo-shibata/fukutaro@v1.0.0/fukutaro.js"></script>
    <script>
        const fukutaro = new Fukutaro('fukutaro_movie', 'fukutaro_script');

        function onYouTubeIframeAPIReady() {
            fukutaro.onYouTubeIframeAPIReady();
        }
    </script>
</body>
</html>
```

## Script Format Description

Fukutaro の音声解説スクリプトは、半角スペース区切りの 4 要素で構成された行を並べて記述します。

1. ***Time Code***: 音声解説を開始する動画内の時刻です（例: `00:10`）。この時刻で対応する音声解説が開始されます。
1. ***Pause Duration***: 音声解説を始める前に動画を停止する秒数です（例: `5`）。重要な映像内容に音声解説が重ならないようにするために使えます。[1.2.7 拡張音声解説 (収録済) (レベル AAA)](https://waic.jp/translations/WCAG22/Understanding/extended-audio-description-prerecorded) への対応でも有効です。
1. ***Speech Rate***: 読み上げ速度です。数値が大きいほど速くなります（例: `1.0` は標準、`1.5` はより高速）。
1. ***Audio Description Content***: 読み上げる本文です（例: `This is a test audio description.`）。映像の動きや状況、視覚情報の補足を記述します。

これらを使うことで、Fukutaro は音声解説を必要とする利用者に対して、よりアクセシブルな動画体験を提供できます。記述例は次のとおりです。

```
00:10 5 1.0 This is a test audio description.
00:20 3 0.8 Another test audio description.
```

## Sample

- [Fukutaro - test page](https://a11yc.com/fukutarojs/): 日本語音声のみ

## Accessibility Compliance

Fukutaro は、以下のような WCAG 2.0 - 2.2 の達成を支援することを目指しています。

- 時間依存メディアに対する解決策を提供
  - [1.2.3 音声解説、又はメディアに対する代替 (収録済) (レベル A)](https://waic.jp/translations/WCAG22/Understanding/audio-description-or-media-alternative-prerecorded.html)
  - [1.2.5 音声解説 (収録済) (レベル AA)](https://waic.jp/translations/WCAG22/Understanding/audio-description-prerecorded)
  - [1.2.7 拡張音声解説 (収録済) (レベル AAA)](https://waic.jp/translations/WCAG22/Understanding/extended-audio-description-prerecorded)

## License

このプロジェクトは MIT License のもとで提供されています。詳細は [LICENSE](https://github.com/jidaikobo-shibata/fukutaro/blob/main/LICENSE) を参照してください。

## Acknowledgments

- コード最適化やトラブルシューティングの助言をくれた OpenAI の ChatGPT に感謝します。
- このプロジェクト実装の基盤となる YouTube IFrame Player API に感謝します。
