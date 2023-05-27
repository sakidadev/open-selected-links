import { GetLinksFromSelection, MakeTabsForLinks } from "./utils.js";

const kCurWindowMenuItemId = "open-selected-links-cur-window";

const OpenLinksInSelection = async function (info, tab) {
  console.log("Got menu click: ", info.menuItemId);
  const options = {};
  if (info.menuItemId === kCurWindowMenuItemId) {
    options.windowId = chrome.windows.WINDOW_ID_CURRENT;
    options.tabId = tab.id;
  } else {
    // Not our circus, not our monkeys.
    return;
  }
  const { links } = await GetLinksFromSelection(tab.id, info.frameId);
  await MakeTabsForLinks(links, options);
};

const Setup = async () => {
  console.log("Creating context menus");
  await chrome.contextMenus.removeAll();

  await chrome.contextMenus.create(
    {
      id: kCurWindowMenuItemId,
      contexts: ["selection"],
      type: "normal",
      title: chrome.i18n.getMessage("Menu01"),
      visible: true,
    },
    () => {
      console.log("Added cur-window menu item");
    }
  );

  chrome.contextMenus.onClicked.addListener(OpenLinksInSelection);
};

Setup();
