let musicTabId = null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "set_music_tab") {
        musicTabId = sender.tab.id;
        console.log("Music tab set:", musicTabId);
    } 
    else if (request.action === "video_playing" && musicTabId !== sender.tab.id) {
        if (musicTabId) {
            console.log("Sending command from background.js to pause music");
            chrome.tabs.sendMessage(musicTabId, { action: "pause_music" });
        }
    } 
    else if (request.action === "video_paused" && musicTabId !== sender.tab.id) {
        if (musicTabId) {
            console.log("Sending command from background.js to resume music");
            chrome.tabs.sendMessage(musicTabId, { action: "resume_music" });
        }
    }
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
    if (tabId === musicTabId) {
        musicTabId = null;
        console.log("Music tab closed:", tabId);
    }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tabId === musicTabId) {
        console.log("Music tab updated:", tabId, changeInfo);
    }
});

setInterval(() => {
    if (musicTabId) {
        chrome.tabs.get(musicTabId, (tab) => {
            if (chrome.runtime.lastError || !tab) {
                console.log("Music tab lost, resetting:", musicTabId);
                musicTabId = null;
            } else {
                console.log("Music tab still valid:", musicTabId);
            }
        });
    }
}, 60000); // Check every minute
