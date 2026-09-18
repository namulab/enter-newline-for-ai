(function () {
    "use strict";
    window.__EnterNewlineCore.setup({
        site: "Perplexity",
        guard: "__perplexity_enter_ctrl_send",
        selector: 'div#ask-input[contenteditable="true"][role="textbox"]',
        newlineMode: "syntheticShiftEnterKeysOnly",
        ctrlEnter: "pass",
        stopPropagation: true
    });
})();
