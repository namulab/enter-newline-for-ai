(function () {
    "use strict";
    window.__EnterNewlineCore.setup({
        site: "Claude",
        guard: "__claude_enter_ctrl_send",
        selector: 'div[data-testid="chat-input"][contenteditable="true"][role="textbox"]',
        newlineMode: "syntheticShiftEnterKeysOnly",
        ctrlEnter: "pass",
        stopPropagation: true
    });
})();
