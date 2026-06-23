/**
 * audio.js — Jimmy Buffett Audio Player + Confetti
 * Manages audio playback and confetti animation.
 */

import { setWfhApproved } from './state.js';

// Webpack 5 resolves this via asset/resource rule
// eslint-disable-next-line @typescript-eslint/no-var-requires
import audioAsset from '../assets/Its_Five_O_Clock_Somewhere.mp3';
const audioFile = audioAsset;

let audio = null;
let jimmyButton = null;
let volumeControl = null;

/**
 * Initialize audio element and event listeners.
 */
export function initAudio() {
    audio = document.getElementById('jimmyAudio');
    jimmyButton = document.getElementById('jimmyButton');
    volumeControl = document.getElementById('volumeControl');

    if (audio) {
        audio.src = audioFile;
        audio.volume = 0.5;
    }

    if (volumeControl) {
        volumeControl.value = 50;
    }
}

/**
 * Play or pause the Jimmy Buffett track.
 */
export function playJimmy() {
    if (!audio) return;

    audio
        .play()
        .then(() => {
            console.log("🎶 It's 5 o'clock somewhere!");
            alert("🌴 It's 5 o'clock somewhere. You are now on island time.");
            triggerConfetti();

            if (jimmyButton) {
                jimmyButton.textContent = '⏸️ Pause Tropical Vibes';
                jimmyButton.style.backgroundColor = '#d32f2f';
            }

            // Toggle play/pause
            jimmyButton.onclick = function () {
                if (audio.paused) {
                    audio.play();
                    this.textContent = '⏸️ Pause Tropical Vibes';
                    this.style.backgroundColor = '#d32f2f';
                } else {
                    audio.pause();
                    this.textContent = "🎵 Play: It's 5 O'Clock Somewhere";
                    this.style.backgroundColor = '#ff9800';
                }
            };
        })
        .catch((err) => {
            console.warn('Audio play failed:', err);
            alert('🔇 Please click somewhere on the page first, then try again.');
        });
}

/**
 * Adjust the audio volume.
 * @param {number} value — 0–100
 */
export function adjustVolume(value) {
    if (audio) {
        audio.volume = value / 100;
    }
}

/**
 * Trigger a confetti animation (50 particles).
 */
export function triggerConfetti() {
    const colors = ['#f44336', '#ff9800', '#4caf50', '#2196f3', '#9c27b0'];

    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.position = 'fixed';
        confetti.style.width = `${Math.random() * 10}px`;
        confetti.style.height = `${Math.random() * 10}px`;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.zIndex = '1000';
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.top = '-10px';
        confetti.style.opacity = '0.7';

        confetti.animate(
            [
                { transform: 'translateY(0) rotate(0deg)', opacity: 0.7 },
                { transform: 'translateY(100vh) rotate(720deg)', opacity: 0 },
            ],
            {
                duration: 3000 + Math.random() * 2000,
                easing: 'cubic-bezier(0.2, 0.8, 0.8, 0.2)',
                fill: 'forwards',
            },
        );

        document.body.appendChild(confetti);

        setTimeout(() => {
            if (confetti.parentElement) document.body.removeChild(confetti);
        }, 5000);
    }
}



/**
 * Get the last guilt score.
 * @returns {number}
 */
export function getLastGuiltScore() {
    return lastGuiltScore;
}

/**
 * Setup the Ctrl+E keyboard shortcut for Jimmy Buffett.
 */
export function initKeyboardShortcut() {
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey && e.key === 'e') || e.key === '🎵') {
            e.preventDefault();
            if (audio) {
                audio.currentTime = 0;
                audio
                    .play()
                    .then(() => {
                        alert('🎉 Jimmy Buffett has entered the office!');
                        triggerConfetti();
                    })
                    .catch(() => {
                        alert('🔇 Click the audio button first to enable sound.');
                    });
            }
        }
    });
}
