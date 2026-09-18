(function () {
    "use strict";
    window.__EnterNewlineCore.setup({
        site: "GoogleAI",
        guard: "__google_ai_enter_ctrl_send",
        selector: 'textarea.ITIRGe[aria-autocomplete="none"][maxlength="8192"]',
        newlineMode: "direct",
        ctrlEnter: "buttonOrNative",
        searchDocument: false,
        searchForm: false,
        stopPropagation: true
    });
})();
