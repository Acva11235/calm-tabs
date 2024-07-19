let isMusicTab = false;

function sendMessage(action) {
    chrome.runtime.sendMessage({ action: action });
}

document.addEventListener('play', (event) => {
    if (event.target.tagName === 'VIDEO') {
        sendMessage('video_playing');
    }
}, true);

document.addEventListener('pause', (event) => {
    if (event.target.tagName === 'VIDEO') {
        sendMessage('video_paused');
    }
}, true);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "pause_music") {
        let video = document.querySelector('video');
        if (video) {
        video.pause();
        }
    } else if (request.action === "resume_music") {
        let video = document.querySelector('video');
        if (video) {
        video.play();
        }
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "set_music_tab") {
        isMusicTab = true;
        sendMessage("set_music_tab");
    }
});
