"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const source = fs.readFileSync(
    path.join(__dirname, "..", "src", "ChatGPT.js"),
    "utf8"
);

function loadConfig() {
    let config;
    const context = vm.createContext({
        window: {
            __EnterNewlineCore: {
                setup(value) { config = value; }
            }
        }
    });
    vm.runInContext(source, context);
    return config;
}

test("ChatGPT selector supports the current composer variants", () => {
    const {selector} = loadConfig();

    assert.match(selector, /#prompt-textarea/);
    assert.match(selector, /data-testid="prompt-textarea"/);
    assert.match(selector, /data-lexical-editor="true"/);
    assert.match(selector, /data-composer-markdown/);
});

test("ChatGPT still intercepts Enter and sends Ctrl+Enter via the button", () => {
    const config = loadConfig();

    assert.equal(config.newlineMode, "syntheticShiftEnterKeysOnly");
    assert.equal(config.ctrlEnter, "button");
    assert.equal(config.blockOtherEnter, true);
});
