(() => {
  const STORAGE_KEY = "hoverHighlighterEnabled";
  const extensionApi = globalThis.browser ?? globalThis.chrome;

  const toggle = document.getElementById("enabledToggle");
  const statusBadge = document.getElementById("statusBadge");

  const setUi = (enabled) => {
    if (toggle) {
      toggle.checked = enabled;
    }
    document.body.dataset.enabled = String(enabled);

    if (statusBadge) {
      statusBadge.textContent = enabled ? "ON" : "OFF";
    }
  };

  const load = async () => {
    try {
      const result = await extensionApi.storage.local.get(STORAGE_KEY);
      const enabled = result?.[STORAGE_KEY] !== false;
      setUi(enabled);
    } catch {
      setUi(true);
    }
  };

  if (toggle) {
    toggle.addEventListener("change", async () => {
      const enabled = toggle.checked;
      try {
        await extensionApi.storage.local.set({ [STORAGE_KEY]: enabled });
        setUi(enabled);
      } catch {
        setUi(!enabled);
      }
    });
  }

  load();
})();
