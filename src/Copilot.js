(function () {
    "use strict";
    window.__EnterNewlineCore.setup({
        site: "Copilot",
        guard: "__copilot_enter_ctrl_send",
        selector: 'textarea#userInput[data-testid="composer-input"][role="textbox"]',
        newlineMode: "direct",
        ctrlEnter: "buttonOrNative",
        sendRootSelector: 'form, [role="group"], [role="application"], [data-testid], [aria-live], main',
        sendButtonSelectors: '[aria-label="Send"], [aria-label="Submit"], [aria-label*="Send"], [aria-label*="Submit"], [aria-label="送信"], [aria-label*="送信"], [data-testid*="send"], [data-testid*="submit"], button[type="submit"], button[role="button"][title*="Send"], button[role="button"][title*="送信"], button[aria-haspopup="menu"] ~ button',
        requestSubmitFallback: false,
        stopPropagation: true
    });
})();
