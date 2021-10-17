export const getCurrentTabUrl = (
  callback: (url: string | undefined) => void
): void => {
  const queryInfo = { active: true, lastFocusedWindow: true };

  chrome.tabs &&
    chrome.tabs.query(queryInfo, (tabs) => {
      callback(tabs[0].url);
    });
};

export const getCurrentTabUId = (
  callback: (url: number | undefined) => void
): void => {
  const queryInfo = { active: true, lastFocusedWindow: true };

  chrome.tabs &&
    chrome.tabs.query(queryInfo, (tabs) => {
      callback(tabs[0].id);
    });
};

export const getArtist = (callback: (result: any) => void): void => {
  const queryInfo = { active: true, lastFocusedWindow: true };

  getCurrentTabUId((id) => {
    if (id) {
      console.log('has id ', id);
      chrome.tabs.executeScript(
        id,
        {
          code: 'document.getElementsByClassName("now-info-title")[0].innerHTML',
        },
        callback
      );
    }
  });
};

export const getSong = (callback: (result: any) => void): void => {
  const queryInfo = { active: true, lastFocusedWindow: true };

  getCurrentTabUId((id) => {
    if (id) {
      console.log('has id ', id);
      chrome.tabs.executeScript(
        id,
        {
          code: 'document.getElementsByClassName("now-info-subtitle")[0].innerHTML',
        },
        callback
      );
    }
  });
};
