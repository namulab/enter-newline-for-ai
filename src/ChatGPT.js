(function () {
    "use strict";
    window.__EnterNewlineCore.setup({
        site: "ChatGPT",
        guard: "__chatgpt_enter_ctrl_send",
        selector: '#prompt-textarea[contenteditable="true"][role="textbox"]',
        eventRoot: "window",
        newlineMode: "syntheticShiftEnterKeysOnly",
        ctrlEnter: "button",
        sendButtonSelectors: '[data-testid="send-button"], [data-testid*="send"], button[type="submit"]',
        requestSubmitFallback: true,
        blockOtherEnter: true
    });
})();
