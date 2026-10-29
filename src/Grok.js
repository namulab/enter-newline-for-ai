(function () {
    "use strict";

    window.addEventListener("keydown", (e) => {
        if (
            e.key !== "Enter" ||
            e.shiftKey ||
            e.ctrlKey ||
            e.altKey ||
            e.metaKey
        ) {
            return;
        }

        const target = e.target;

        if (
            !(target instanceof HTMLElement) ||
            !target.matches(
                'div.query-bar-editor[contenteditable="true"][role="textbox"]'
            )
        ) {
            return;
        }

        try {
            Object.defineProperty(e, "shiftKey", {
                configurable: true,
                get: () => true
            });
        } catch {
            e.preventDefault();
            e.stopImmediatePropagation();
        }
    }, true);
})();
