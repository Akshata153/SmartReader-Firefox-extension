"use strict";
const HIGHLIGHT_ORIGINAL_BG = "hhHighlightOriginalBg";
const LINK_ORIGINAL_COLOR = "hhLinkOriginalColor";
const LAVENDER_HIGHLIGHT_FLAG = "hhLavenderHighlighted";
const HEADING_HIGHLIGHT_FLAG = "hhHeadingHighlighted";
const LINK_HIGHLIGHT_FLAG = "hhLinkHighlighted";
const EXTENSION_ENABLED_KEY = "hoverHighlighterEnabled";
const HEADING_SELECTOR = "h1, h2, h3, h4, h5, h6";
const WINE_COLOR = "#722F37";
const LAVENDER_COLOR = "#E6E6FA";
const WHITISH_GREY_COLOR = "#E5E7EB";
const IS_GOOGLE_URL = window.location.href.toLowerCase().includes("google.com");
const extensionApi = globalThis.browser ?? globalThis.chrome ?? null;
let isExtensionEnabled = true;
const restorePersistentHighlights = () => {
    const headingElements = document.querySelectorAll("h1[data-hh-heading-highlighted], h2[data-hh-heading-highlighted], h3[data-hh-heading-highlighted], h4[data-hh-heading-highlighted], h5[data-hh-heading-highlighted], h6[data-hh-heading-highlighted]");
    headingElements.forEach((heading) => {
        heading.style.backgroundColor =
            heading.dataset[HIGHLIGHT_ORIGINAL_BG] ?? "";
        delete heading.dataset[HIGHLIGHT_ORIGINAL_BG];
        delete heading.dataset[HEADING_HIGHLIGHT_FLAG];
    });
    const lavenderElements = document.querySelectorAll("p[data-hh-lavender-highlighted], span[data-hh-lavender-highlighted]");
    lavenderElements.forEach((element) => {
        element.style.backgroundColor =
            element.dataset[HIGHLIGHT_ORIGINAL_BG] ?? "";
        delete element.dataset[HIGHLIGHT_ORIGINAL_BG];
        delete element.dataset[LAVENDER_HIGHLIGHT_FLAG];
    });
};
const setEnabledState = (enabled) => {
    isExtensionEnabled = enabled;
    if (!isExtensionEnabled) {
        restorePersistentHighlights();
    }
};
const loadEnabledState = async () => {
    try {
        if (!extensionApi?.storage?.local?.get)
            return;
        const result = await extensionApi.storage.local.get(EXTENSION_ENABLED_KEY);
        setEnabledState(result?.[EXTENSION_ENABLED_KEY] !== false);
    }
    catch {
        setEnabledState(true);
    }
};
const bindStorageListener = () => {
    if (!extensionApi?.storage?.onChanged?.addListener)
        return;
    extensionApi.storage.onChanged.addListener((changes, areaName) => {
        if (areaName !== "local")
            return;
        const changed = changes[EXTENSION_ENABLED_KEY];
        if (!changed)
            return;
        setEnabledState(changed.newValue !== false);
    });
};
const onMouseOver = (event) => {
    if (!isExtensionEnabled)
        return;
    const target = event.target;
    if (!target)
        return;
    const heading = target.closest(HEADING_SELECTOR);
    if (heading) {
        if (!heading.dataset[HEADING_HIGHLIGHT_FLAG]) {
            heading.dataset[HIGHLIGHT_ORIGINAL_BG] = heading.style.backgroundColor;
            heading.dataset[HEADING_HIGHLIGHT_FLAG] = "1";
        }
        heading.style.backgroundColor = WINE_COLOR;
        heading.style.color = WHITISH_GREY_COLOR;
    }
    const lavenderTag = target.closest("p, span");
    if (lavenderTag && !lavenderTag.closest(HEADING_SELECTOR)) {
        if (!lavenderTag.dataset[LAVENDER_HIGHLIGHT_FLAG]) {
            lavenderTag.dataset[HIGHLIGHT_ORIGINAL_BG] =
                lavenderTag.style.backgroundColor;
            lavenderTag.dataset[LAVENDER_HIGHLIGHT_FLAG] = "1";
        }
        lavenderTag.style.backgroundColor = LAVENDER_COLOR;
        lavenderTag.style.color = "black";
    }
    const citeTag = target.closest("cite");
    if (citeTag) {
        citeTag.style.color = "black";
    }
    const link = target.closest("a");
    if (link) {
        if (!link.dataset[LINK_HIGHLIGHT_FLAG]) {
            link.dataset[LINK_ORIGINAL_COLOR] = link.style.color;
            link.dataset[LINK_HIGHLIGHT_FLAG] = "1";
        }
        link.style.color = "black";
    }
};
const onMouseOut = (event) => {
    if (!isExtensionEnabled)
        return;
    const target = event.target;
    if (!target)
        return;
    const related = event.relatedTarget;
    const link = target.closest("a");
    if (link) {
        if (related && link.contains(related))
            return;
        if (link.dataset[LINK_HIGHLIGHT_FLAG]) {
            link.style.color = link.dataset[LINK_ORIGINAL_COLOR] ?? "";
            delete link.dataset[LINK_ORIGINAL_COLOR];
            delete link.dataset[LINK_HIGHLIGHT_FLAG];
        }
    }
};
if (!IS_GOOGLE_URL) {
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);
    bindStorageListener();
    void loadEnabledState();
}
