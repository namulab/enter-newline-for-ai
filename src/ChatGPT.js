(function () {
    "use strict";
    window.__EnterNewlineCore.setup({
        site: "ChatGPT",
        guard: "__chatgpt_enter_ctrl_send",
        selector: [
            '#prompt-textarea[contenteditable="true"]',
            '[data-testid="prompt-textarea"][contenteditable="true"]',
            '[contenteditable="true"][data-lexical-editor="true"]',
            'form[data-chatgpt-composer] [data-composer-markdown][contenteditable="true"][role="textbox"]'
        ].join(", "),
        eventRoot: "window",
        newlineMode: "syntheticShiftEnterKeysOnly",
        ctrlEnter: "button",
        sendButtonSelectors: '[data-testid="send-button"], [data-testid*="send"], button[type="submit"]',
        requestSubmitFallback: true,
        blockOtherEnter: true
    });
})();
