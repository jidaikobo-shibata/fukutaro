# Fukutaro

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Fukutaro is a JavaScript utility designed to synchronize YouTube video playback with timed audio description, enhancing the accessibility of video content for all users, including those with disabilities. It allows developers to implement automated speech synthesis based on scripted cues tied to video timestamps, ensuring that users can access content effectively in line with [WCAG 2.2](https://www.w3.org/TR/WCAG22/) standards.

## Getting Started

### Prerequisites

- Modern web browser with Modern web technology support.
- Basic knowledge of HTML and JavaScript.

### Usage

Embed Fukutaro in your web project to provide synchronized audio description for YouTube videos. You can specify any YouTube video by setting the `data-youtube_id` attribute to the desired video ID. Here is a simple example of how to set it up:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Fukutaro Example</title>
</head>
<body>
    <!-- Ensure you replace 'YOUR_YOUTUBE_VIDEO_ID' with the actual YouTube Video ID -->
    <div id="fukutaro_movie" data-youtube_id="YOUR_YOUTUBE_VIDEO_ID"></div>
    <textarea id="fukutaro_script" aria-label="Timed Audio Description">
        00:10 5 1.0 This is a test audio description.
        00:20 5 1.0 Another test audio description.
    </textarea>

    <!-- Load YouTube IFrame Player API -->
    <script src="https://www.youtube.com/iframe_api"></script>
    <!-- Initialize Fukutaro -->
    <script src="path/to/fukutaro.js"></script>
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
The audio description script for Fukutaro consists of lines formatted with space-separated values, each containing four key elements:

1. ***Time Code***: Specifies the exact time in the video when the audio description should begin (e.g., 00:10). This triggers the corresponding audio description at the precise moment.
1. ***Pause Duration***: Indicates the length of time in seconds the video will pause before starting the audio description (e.g., 5). This feature is particularly useful for meeting WCAG 2.2 criterion [1.2.7 Extended Audio Description (Prerecorded) (AAA)](https://www.w3.org/WAI/WCAG22/Understanding/extended-audio-description-prerecorded.html), as it provides additional time for audio descriptions without overlapping crucial video content.
1. ***Speech Rate***: Determines the speed at which the audio description is read. A higher number means faster speech (e.g., 1.0 represents normal speed, while 1.5 would be faster). This allows for adjustment according to the viewer's preference and the complexity of the information being conveyed.
1. ***Audio Description Content***: The text to be spoken (e.g., "This is a test audio description."). This provides detailed descriptions of visual content that are essential for understanding the action, setting, or visual cues in the video.

By utilizing these elements, Fukutaro enhances the accessibility of video content, making it more inclusive for all viewers, especially those who rely on audio descriptions. Here's how you can structure your script:

```
00:10 5 1.0 This is a test audio description.
00:20 3 0.8 Another test audio description.
```

## Sample

- [Fukutaro - test page](https://a11yc.com/fukutarojs/): Japanese audio only

## Accessibility Compliance
Fukutaro aims to support WCAG 2.0 - 2.2 compliance by providing features that:

- Offer solutions for time-based media
  - [1.2.3 Audio Description or Media Alternative (Prerecorded) (A)](https://www.w3.org/WAI/WCAG22/Understanding/audio-description-or-media-alternative-prerecorded)
  - [1.2.5 Audio Description (Prerecorded) (AA)](https://www.w3.org/WAI/WCAG22/Understanding/audio-description-prerecorded)
  - [1.2.7 Extended Audio Description (Prerecorded) (AAA)](https://www.w3.org/WAI/WCAG22/Understanding/extended-audio-description-prerecorded.html)

## License
This project is licensed under the MIT License - [see the LICENSE file for details](https://github.com/jidaikobo-shibata/fukutaro/blob/main/LICENSE).

## Acknowledgments

- Thanks to OpenAI's ChatGPT for code optimization suggestions and troubleshooting advice.
- YouTube IFrame Player API for providing the platform necessary to implement this project.
