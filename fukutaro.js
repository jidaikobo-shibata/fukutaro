/**
 * Fukutaro
 *
 * This JavaScript class is designed to synchronize YouTube video playback with audio descriptions.
 * It enhances web accessibility by providing timed audio descriptions for YouTube videos.
 *
 * Originally developed for Windows Scripting Host by Yoichi Kodera.
 * Currently maintained by shibata@jidaikobo.com.
 */

class Fukutaro {
    static iframeApiRequested = false;

    /**
     * Initializes the Fukutaro class for handling YouTube video audio descriptions.
     * @param {string} playerId - The ID of the YouTube iframe element.
     * @param {string} scriptId - The ID of the textarea containing the audio description script.
     */
    constructor(playerId, scriptId) {
        this.playerId = playerId;
        this.scriptId = scriptId;
        this.language = this.getLanguage(); // Determine the language from the div element
        this.i18nTexts = {
            en: {
                mute: 'Check to mute audio description for "%s"',
                unmute: 'Uncheck to enable audio description for "%s"'
            },
            ja: {
                mute: 'チェックを入れると「%s」の音声解説をミュートします',
                unmute: 'チェックを外すと「%s」の音声解説が有効になります'
            }
        };
        this.fktrPlayer = null;
        this.fktrTimer = null;
        this.fktrPlaying = null;
        this.fktrLines = [];
        this.audioDescriptionEnabled = true;
        // console.log('Fukutaro initialized');
        this.init();
    }

    /**
     * Determines the language from the div element's lang attribute.
     * Defaults to English ('en') if not specified.
     * @returns {string} The language code ('en' or 'ja').
     */
    getLanguage() {
        const playerContainer = document.getElementById(this.playerId);
        const lang = playerContainer.getAttribute('lang');
        return lang && lang.startsWith('ja') ? 'ja' : 'en';
    }

    /**
     * Initializes the YouTube IFrame API and the checkbox for toggling audio descriptions.
     */
    init() {
        Fukutaro.loadYouTubeIframeApi();
        document.getElementById(this.scriptId).addEventListener('input', this.updateScript.bind(this));
        this.appendCheckbox();
        this.updateScript();  // 初期ロード時にスクリプトを更新
    }

    /**
     * Loads the YouTube IFrame API script once per page.
     */
    static loadYouTubeIframeApi() {
        if (Fukutaro.iframeApiRequested) return;
        if (document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
            Fukutaro.iframeApiRequested = true;
            return;
        }

        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        Fukutaro.iframeApiRequested = true;
    }

    /**
     * Appends a checkbox below the YouTube iframe to toggle audio descriptions.
     */
    appendCheckbox() {
        const playerContainer = document.getElementById(this.playerId);
        const container = document.createElement('div');
        container.style.marginTop = '10px';
        container.style.marginBottom = '10px';

        const label = document.createElement('label');
        label.setAttribute('lang', this.language); // ラベルの言語を設定
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        const span = document.createElement('span');

        // Set initial and dynamic label text using data attribute
        const videoTitle = playerContainer.getAttribute('data-youtube_title');
        span.textContent = this.formatString(this.i18nTexts[this.language].mute, videoTitle);

        label.appendChild(checkbox);
        label.appendChild(span);
        container.appendChild(label);
        playerContainer.parentNode.insertBefore(container, playerContainer.nextSibling);

        checkbox.addEventListener('change', () => {
            this.audioDescriptionEnabled = !checkbox.checked;
            span.textContent = this.audioDescriptionEnabled ? this.formatString(this.i18nTexts[this.language].mute, videoTitle) : this.formatString(this.i18nTexts[this.language].unmute, videoTitle);
            // console.log('Audio description ' + (this.audioDescriptionEnabled ? 'enabled' : 'disabled'));
        });
    }

    /**
     * Formats a string by replacing the %s placeholder with the specified value.
     * @param {string} str - The string containing the %s placeholder.
     * @param {string} value - The value to insert into the placeholder.
     * @returns {string} The formatted string.
     */
    formatString(str, value) {
        return str.replace('%s', value);
    }

    /**
     * Updates the audio description script from the textarea content.
     */
    updateScript() {
        // console.log('Updating script...');
        this.fktrLines = Fukutaro.scriptToArray(this.scriptId);
        // console.log('Script updated:', this.fktrLines);
    }

    /**
     * Converts the textarea script content into an array of audio description cues.
     * @param {string} scriptId - The ID of the textarea containing the audio description script.
     * @returns {Array} An array of objects representing the audio description cues.
     */
    static scriptToArray(scriptId) {
        const textarea = document.getElementById(scriptId);
        const lines = [];
        const script = textarea.value.split('\n');
        script.forEach((line, index) => {
            line = line.trim();
            if (line.trim().startsWith(';') || line.trim() === '') return;
            const parts = line.split(' ');
            lines.push({
                time: Fukutaro.codeToSeconds(parts[0]),
                pause: parseFloat(parts[1]) || 0,
                rate: parseFloat(parts[2]) || 1,
                text: parts.slice(3).join(' ')
            });
        });
        return lines;
    }

    /**
     * Converts a time string (HH:MM:SS) into seconds.
     * @param {string} time - The time string to convert.
     * @returns {number} The time in seconds.
     */
    static codeToSeconds(time) {
        const parts = time.split(':').map(parseFloat).reverse();
        let seconds = 0;
        if (parts[0] !== undefined) seconds += parts[0];
        if (parts[1] !== undefined) seconds += parts[1] * 60;
        if (parts[2] !== undefined) seconds += parts[2] * 3600;
        return seconds;
    }

    /**
     * Called when the YouTube IFrame API is ready to initialize the player.
     */
    onYouTubeIframeAPIReady() {
        // console.log('YouTube IFrame API Ready');
        this.fktrPlayer = new YT.Player(this.playerId, {
            videoId: document.getElementById(this.playerId).dataset.youtube_id,
            events: {
                onReady: (event) => {
                    this.trackPlayerProgress();
                },
                onStateChange: (event) => {
                    // console.log('Player state change:', event.data);
                    if (event.data === YT.PlayerState.PLAYING || event.data === YT.PlayerState.PAUSED) {
                        this.trackPlayerProgress();
                    }
                },
            },
            playerVars: { rel: 0, showinfo: 0, controls: 1 }
        });
    }

    /**
     * Tracks the progress of the video and synchronizes the audio descriptions.
     */
    trackPlayerProgress() {
        clearTimeout(this.fktrTimer);
        const currentTime = this.fktrPlayer.getCurrentTime();
        const playerState = this.fktrPlayer.getPlayerState();
        // console.log('Tracking progress... Current Time:', currentTime);
        // console.log('Player state:', playerState);

        for (let i = 0; i < this.fktrLines.length; i++) {
            if (
                this.fktrPlaying !== this.fktrLines[i].time &&
                currentTime > this.fktrLines[i].time &&
                currentTime < this.fktrLines[i].time + 0.2
            ) {
                this.fktrPlaying = this.fktrLines[i].time;
                const synthes = new SpeechSynthesisUtterance(this.fktrLines[i].text);
                synthes.rate = this.fktrLines[i].rate;
                // console.log('Preparing to speak:', this.fktrLines[i].text);
                if (playerState === YT.PlayerState.PLAYING) {
                    this.fktrPlayer.pauseVideo();
                    if (this.audioDescriptionEnabled) {
                        speechSynthesis.speak(synthes);
                        // console.log('Speaking:', this.fktrLines[i].text);
                    }
                    setTimeout(() => this.fktrPlayer.playVideo(), this.fktrLines[i].pause * 1000);
                }
            }
        }

        this.fktrTimer = setTimeout(() => this.trackPlayerProgress(), 100);
    }
}
