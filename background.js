let musicTabId = null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "set_music_tab") {
        musicTabId = sender.tab.id;
    } 
    else if (request.action === "video_playing" && musicTabId !== sender.tab.id) {
        if (musicTabId) {
            chrome.tabs.sendMessage(musicTabId, { action: "pause_music" });
        }
    } 
    else if (request.action === "video_paused" && musicTabId !== sender.tab.id) {
        if (musicTabId) {
            chrome.tabs.sendMessage(musicTabId, { action: "resume_music" });
        }
    }
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
    if (tabId === musicTabId) {
        musicTabId = null;
    }
});
