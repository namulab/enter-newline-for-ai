/* options.js - 先頭大文字化などの変換なし版（拡張子だけ除去） */
(async function(){
	"use strict";

	const ext = globalThis.browser ?? globalThis.chrome;

	// manifest から content_scripts の js を収集
	const mf = ext.runtime.getManifest();
	const files = new Set();
	(mf.content_scripts || []).forEach(cs => {
		(cs.js || []).forEach(p => {
			const name = p.split("/").pop();
			if (/^(?:options|common)\.js$/i.test(name)) return;	// UI/共通コアは除外
			files.add(name);
		});
	});

	// 表示と設定キーは「拡張子を除いたファイル名」をそのまま使う
	const targets = Array.from(files)
		.map(n => n.replace(/\.js$/i, ""))
		.sort((a,b)=>a.localeCompare(b));

	// 既存設定（未設定は全有効）
	const st = await ext.storage.local.get({disabled:{}});
	const disabled = st.disabled || {};

	// UI生成
	const list = document.getElementById("list");
	targets.forEach(k => {
		const id = "cb-"+k;
		const wrap = document.createElement("label");
		const cb = document.createElement("input");
		cb.type = "checkbox";
		cb.id = id;
		cb.dataset.key = k;			// 変換なし
		cb.checked = !disabled[k];	// 未設定=有効
		const tt = document.createElement("span");
		tt.textContent = k;			// 変換なしで表示
		wrap.appendChild(cb);
		wrap.appendChild(tt);
		list.appendChild(wrap);
	});

	// 保存
	document.getElementById("save").addEventListener("click", async () => {
		const next = {};
		list.querySelectorAll('input[type="checkbox"]').forEach(cb => {
			const key = cb.dataset.key;
			if (!cb.checked) next[key] = true; // チェックオフ=無効
		});
		await ext.storage.local.set({disabled: next});
	});
})();
