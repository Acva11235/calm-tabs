let isMusicTab = false;
const videoSelector = 'video.video-stream.html5-main-video';

// Function to send messages to the background script
function sendMessage(action) {
    chrome.runtime.sendMessage({ action: action });
}

function checkMainVideoState(videoElement) {
    if (videoElement) {
        if (videoElement.paused) {
            sendMessage('video_paused');
        } else {
            sendMessage('video_playing');
        }
    }
}

function initializeVideoElement() {
    const videoElement = document.querySelector(videoSelector);

    if (videoElement) {
        console.log('Main video element found:', videoElement);

        if (!videoElement._hasEventListeners) {
            videoElement.addEventListener('play', () => {
                console.log('Main video is playing');
                sendMessage('video_playing');
            });

            videoElement.addEventListener('pause', () => {
                console.log('Main video is paused');
                sendMessage('video_paused');
            });

            videoElement._hasEventListeners = true;
        }

        checkMainVideoState(videoElement);
    } else {
        console.log('Main video element not found.');
    }
}

initializeVideoElement();

const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE && node.matches(videoSelector)) {
                    initializeVideoElement();
                }
            });
        } else if (mutation.type === 'attributes' && mutation.target.matches(videoSelector)) {
            initializeVideoElement();
        }
    });
});

observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "pause_music") {
        console.log("Message received from background.js to pause music");
        const video = document.querySelector(videoSelector);
        if (video) {
            video.pause();
        }
    } else if (request.action === "resume_music") {
        console.log("Message received from background.js to play music");
        const video = document.querySelector(videoSelector);
        if (video) {
            video.play();
        }
    } else if (request.action === "set_music_tab") {
        isMusicTab = true;
        sendMessage("set_music_tab");
    } else if (request.action === "clear_music_tab") {
        isMusicTab = false;
    }
});


// let isMusicTab = false;
// const videoSelector = 'video.video-stream.html5-main-video';

// // Function to send messages to the background script
// function sendMessage(action) {
//     chrome.runtime.sendMessage({ action: action });
// }

// // Function to check the main video element's state
// function checkMainVideoState(videoElement) {
//     if (videoElement) {
//         if (videoElement.paused) {
//             sendMessage('video_paused');
//         } else {
//             sendMessage('video_playing');
//         }
//     }
// }

// // Function to initialize video element and event listeners
// function initializeVideoElement() {
//     // Select the main video element
//     const videoElement = document.querySelector(videoSelector);

//     if (videoElement) {
//         console.log('Main video element found:', videoElement);

//         // Ensure only one set of event listeners are attached
//         if (!videoElement._hasEventListeners) {
//             videoElement.addEventListener('play', () => {
//                 console.log('Main video is playing');
//                 sendMessage('video_playing');
//             });

//             videoElement.addEventListener('pause', () => {
//                 console.log('Main video is paused');
//                 sendMessage('video_paused');
//             });

//             videoElement._hasEventListeners = true;
//         }

//         // Initial state check
//         checkMainVideoState(videoElement);
//     } else {
//         console.log('Main video element not found.');
//     }
// }

// // Initialize video element on script load
// initializeVideoElement();

// // Use MutationObserver to handle dynamic content changes
// const observer = new MutationObserver((mutations) => {
//     mutations.forEach((mutation) => {
//         if (mutation.type === 'childList') {
//             mutation.addedNodes.forEach(node => {
//                 if (node.nodeType === Node.ELEMENT_NODE && node.matches(videoSelector)) {
//                     initializeVideoElement();
//                 }
//             });
//         } else if (mutation.type === 'attributes' && mutation.target.matches(videoSelector)) {
//             initializeVideoElement();
//         }
//     });
// });

// // Start observing the document for changes
// observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });

// // Function to fade in the volume
// function fadeIn(video, duration) {
//     video.volume = 0;
//     video.play();
//     const step = 0.1 / (duration / 100); // Calculate the volume increment
//     const fade = setInterval(() => {
//         if (video.volume < 1) {
//             video.volume = Math.min(video.volume + step, 1);
//         } else {
//             clearInterval(fade);
//         }
//     }, 100); // Adjust volume every 100ms
// }

// // Handle messages from the background script
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.action === "pause_music") {
//         console.log("Message received from background.js to pause music");
//         const video = document.querySelector(videoSelector);
//         if (video) {
//             video.pause();
//         }
//     } else if (request.action === "resume_music") {
//         console.log("Message received from background.js to play music");
//         const video = document.querySelector(videoSelector);
//         if (video) {
//             video.play();
//         }
//     } else if (request.action === "set_music_tab") {
//         isMusicTab = true;
//         sendMessage("set_music_tab");
//     } else if (request.action === "clear_music_tab") {
//         isMusicTab = false;
//     }
// });
