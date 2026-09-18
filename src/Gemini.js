(function () {
    "use strict";
    window.__EnterNewlineCore.setup({
        site: "Gemini",
        guard: "__gemini_enter_ctrl_send",
        selector: 'div.ql-editor.textarea.new-input-ui[contenteditable="true"][role="textbox"]',
        newlineMode: "syntheticShiftEnterKeysOnly",
        ctrlEnter: "pass",
        stopPropagation: true
    });
})();
