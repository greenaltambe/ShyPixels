chrome.runtime.onMessage.addListener(
  (
    message: { action: string; [key: string]: unknown },
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response: unknown) => void
  ) => {
    if (message.action === "startSelection") {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tabId = tabs[0]?.id;
        if (tabId !== undefined) {
          chrome.tabs.sendMessage(
            tabId,
            { action: "startSelection" },
            (response) => {
              sendResponse(response);
            }
          );
        }
      });
      return true; // async response
    }

    if (message.action === "refreshRules") {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tabId = tabs[0]?.id;
        if (tabId !== undefined) {
          chrome.tabs.sendMessage(
            tabId,
            { action: "refreshRules" },
            (response) => {
              sendResponse(response);
            }
          );
        }
      });
      return true;
    }

    return false;
  }
);
