// Shared core for Enter Newline for AI.
// Site files only provide a stable editor selector and site-specific behavior.
(function () {
    "use strict";

    if (window.__EnterNewlineCore) return;

    const ext = globalThis.browser ?? globalThis.chrome;

    function setup(config) {
        if (window[config.guard]) return;
        window[config.guard] = true;

        let enabled = true;
        let installed = false;
        let blockNextSubmit = false;
        let passthroughOnce = false;

        const eventRoot = config.eventRoot === "window" ? window : document;

        function isEditorEvent(e) {
            const target = e && e.target;
            return target instanceof Element && target.matches(config.selector);
        }

        function stopEvent(e) {
            e.preventDefault();
            if (config.stopPropagation) {
                try { e.stopPropagation(); } catch {}
            }
            try { e.stopImmediatePropagation(); } catch {}
        }

        function ensureFormGuard(form) {
            if (!form || form.__enterNewlineGuarded) return;
            form.__enterNewlineGuarded = true;
            form.addEventListener("submit", (e) => {
                if (!blockNextSubmit) return;
                e.preventDefault();
                try { e.stopImmediatePropagation(); } catch {}
                blockNextSubmit = false;
            }, {capture: true});
        }

        function findSendButton(from) {
            const selectors = config.sendButtonSelectors;
            if (!selectors) return null;

            let root = null;
            if (config.sendRootSelector) {
                try { root = from?.closest?.(config.sendRootSelector); } catch {}
            }

            let button = null;
            if (root) {
                try { button = root.querySelector(selectors); } catch {}
            }
            if (!button && config.searchDocument !== false) {
                try { button = document.querySelector(selectors); } catch {}
            }
            if (!button && config.searchForm !== false) {
                const form = from?.closest?.("form");
                try { button = form?.querySelector?.(selectors) || null; } catch {}
            }
            return button;
        }

        function sendViaButton(from) {
            const form = from?.closest?.("form");
            ensureFormGuard(form);

            const button = findSendButton(from);
            if (button && !button.disabled && button.getAttribute?.("aria-disabled") !== "true") {
                try {
                    button.click();
                    return true;
                } catch {}
            }

            if (config.requestSubmitFallback && form?.requestSubmit) {
                form.requestSubmit();
                return true;
            }
            return false;
        }

        function sendViaNativeEnter(target) {
            passthroughOnce = true;
            const ev = {
                key: "Enter", code: "Enter", keyCode: 13, which: 13,
                bubbles: true, cancelable: true
            };
            try { target.dispatchEvent(new KeyboardEvent("keydown", ev)); } catch {}
            try { target.dispatchEvent(new KeyboardEvent("keyup", ev)); } catch {}
            setTimeout(() => { passthroughOnce = false; }, 0);
        }

        function synthShiftEnterKeysOnly(target) {
            const ev = {
                key: "Enter", code: "Enter", keyCode: 13, which: 13,
                shiftKey: true, bubbles: true, cancelable: true
            };
            try { target.dispatchEvent(new KeyboardEvent("keydown", ev)); } catch {}
            try { target.dispatchEvent(new KeyboardEvent("keyup", ev)); } catch {}
        }

        function insertBreakTextarea(target) {
            const start = target.selectionStart;
            const end = target.selectionEnd;
            const value = target.value;
            const before = value.slice(0, start);
            const after = value.slice(end);

            target.value = before + "\n" + after;
            const pos = before.length + 1;
            try { target.setSelectionRange(pos, pos); } catch {}
            try {
                target.dispatchEvent(new InputEvent("input", {
                    bubbles: true,
                    cancelable: false,
                    inputType: "insertLineBreak",
                    data: "\n"
                }));
            } catch {}
        }

        function insertNewline(target) {
            if (config.newlineMode === "syntheticShiftEnterKeysOnly") {
                synthShiftEnterKeysOnly(target);
                return;
            }
            if (target.tagName === "TEXTAREA") {
                insertBreakTextarea(target);
            }
        }

        function handleKey(e) {
            if (!enabled || passthroughOnce) return;
            if (e.isComposing || e.key === "Process") return;
            if (!(e.key === "Enter" || e.keyCode === 13)) return;
            if (!isEditorEvent(e)) return;

            const editor = e.target;
            ensureFormGuard(editor.closest?.("form"));

            if (e.ctrlKey || e.metaKey) {
                if (config.ctrlEnter === "pass") {
                    blockNextSubmit = false;
                    return;
                }

                stopEvent(e);
                try { editor.focus(); } catch {}

                const sent = sendViaButton(editor);
                if (!sent && config.ctrlEnter === "buttonOrNative") {
                    sendViaNativeEnter(editor);
                }
                blockNextSubmit = false;
                return;
            }

            if (!e.shiftKey && !e.altKey) {
                stopEvent(e);
                try { editor.focus(); } catch {}
                insertNewline(editor);
                blockNextSubmit = true;
                setTimeout(() => { blockNextSubmit = false; }, 0);
            }
        }

        function blockOtherEnter(e) {
            if (!enabled || !isEditorEvent(e)) return;
            if (e.isComposing || e.key === "Process") return;
            if (e.key === "Enter" || e.keyCode === 13) {
                e.preventDefault();
                try { e.stopImmediatePropagation(); } catch {}
            }
        }

        function enable() {
            if (installed) return;
            eventRoot.addEventListener("keydown", handleKey, {capture: true, passive: false});
            if (config.blockOtherEnter) {
                eventRoot.addEventListener("keypress", blockOtherEnter, true);
                eventRoot.addEventListener("keyup", blockOtherEnter, true);
            }
            installed = true;
        }

        function disable() {
            if (!installed) return;
            eventRoot.removeEventListener("keydown", handleKey, true);
            if (config.blockOtherEnter) {
                eventRoot.removeEventListener("keypress", blockOtherEnter, true);
                eventRoot.removeEventListener("keyup", blockOtherEnter, true);
            }
            installed = false;
        }

        try {
            ext.storage.local.get({disabled: {}}).then((state) => {
                enabled = !(state.disabled || {})[config.site];
                if (enabled) enable();
            });
            ext.storage.onChanged.addListener((changes, area) => {
                if (area !== "local" || !changes.disabled) return;
                enabled = !(changes.disabled.newValue || {})[config.site];
                if (enabled) enable(); else disable();
            });
        } catch {
            enable();
        }
    }

    window.__EnterNewlineCore = {setup};
})();
