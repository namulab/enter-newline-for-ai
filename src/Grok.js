(function () {
    "use strict";
    window.__EnterNewlineCore.setup({
        site: "Grok",
        guard: "__grok_enter_ctrl_send",
        selector: 'div.query-bar-editor[contenteditable="true"][role="textbox"]',
        newlineMode: "syntheticShiftEnterKeysOnly",
        ctrlEnter: "pass",
        stopPropagation: true
    });
})();
