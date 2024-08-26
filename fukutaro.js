/**
 * Fukutaro
 * maintainer: shibata@jidaikobo.com
 * The original author is Yoichi Kodera.
 * Manages YouTube video playback synchronized with scripted audio description.
 */
class Fukutaro {
	/**
	 * Initializes a new instance of the Fukutaro class.
	 * @param {string} playerId - The ID of the div element where the YouTube player will embed.
	 * @param {string} scriptId - The ID of the textarea element containing the timed script.
	 */
	constructor(playerId, scriptId) {
		this.playerId = playerId;
		this.scriptId = scriptId;
		this.fktrPlayer = null;
		this.fktrTimer = null;
		this.fktrPlaying = null;
		this.fktrLines = [];
		this.init();
	}

	/**
	 * Initializes the YouTube IFrame Player API and sets up the event listener for script updates.
	 */
	init() {
		const tag = document.createElement('script');
		tag.src = 'https://www.youtube.com/iframe_api';
		const firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
		document.getElementById(this.scriptId).addEventListener('input', this.updateScript.bind(this));
	}

	/**
	 * Updates the script lines array with new data from the textarea.
	 */
	updateScript() {
		this.fktrLines = Fukutaro.scriptToArray(this.scriptId);
		// console.log('Script updated from textarea...');
		// console.log('Current script lines:', this.fktrLines);
	}

	/**
	 * Parses the script from the textarea into an array of objects each containing timing and script data.
	 * @param {string} scriptId - The ID of the textarea containing the script.
	 * @returns {Array} An array of objects, each object contains time, pause duration, speech rate, and text.
	 */
	static scriptToArray(scriptId) {
		const textarea = document.getElementById(scriptId);
		const lines = [];
		const script = textarea.value.split('\n');
		script.forEach((line, index) => {
			line = line.trim();
			if (line.trim().startsWith(';') || line.trim() === '') {
				// console.log(`Skipping line ${index}: ${line}`);
				return;
			}
			const parts = line.split(' ');
			lines.push({
				time: Fukutaro.codeToSeconds(parts[0]),
				pause: parseFloat(parts[1]) || 0,
				rate: parseFloat(parts[2]) || 1,
				text: parts.slice(3).join(' ')
			});
			// console.log(`Processed line ${index}:`, lineData);
		});
		return lines;
	}

	/**
	 * Converts a time string in HH:MM:SS format to seconds.
	 * @param {string} time - The time string to convert.
	 * @returns {number} The total number of seconds.
	 */
	static codeToSeconds(time) {
		const parts = time.split(':').map(parseFloat).reverse();
		let seconds = 0;
		if (parts[0] !== undefined) seconds += parts[0]; // Seconds
		if (parts[1] !== undefined) seconds += parts[1] * 60; // Minutes
		if (parts[2] !== undefined) seconds += parts[2] * 3600; // Hours
		return seconds;
	}

	/**
	 * Initializes and configures the YouTube player when the API is ready.
	 */
	onYouTubeIframeAPIReady() {
		this.updateScript();
		this.fktrPlayer = new YT.Player(this.playerId, {
			videoId: document.getElementById(this.playerId).dataset.youtube_id,
			events: {
				onReady: () => this.trackPlayerProgress(),
				onStateChange: (event) => {
					if (event.data === YT.PlayerState.PLAYING || event.data === YT.PlayerState.PAUSED) {
						this.trackPlayerProgress();
					}
				},
				onPlaybackRateChange: () => this.trackPlayerProgress()
			},
			playerVars: {
				rel: 0,
				showinfo: 0,
				controls: 1
			}
		});
	}

	/**
	 * Monitors the current time of the video and triggers speech synthesis for audio description based on the script timing.
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
				// console.log('Speaking:', this.fktrLines[i].text);

				if (playerState === YT.PlayerState.PLAYING) {
					this.fktrPlayer.pauseVideo();
					speechSynthesis.speak(synthes);
					setTimeout(() => this.fktrPlayer.playVideo(), this.fktrLines[i].pause * 1000);
				}
			}
		}

		this.fktrTimer = setTimeout(() => this.trackPlayerProgress(), 100);
	}
}
