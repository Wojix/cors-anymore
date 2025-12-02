/* script.js
- URLを取得してプロキシ経由でフェッチします。
- 取得した内容はテキストとして表示します。
- プロキシの指定は上部の入力で変更できます。
*/


// DOM 要素を取得
const urlInput = document.getElementById('urlInput');
const fetchBtn = document.getElementById('fetchBtn');
const output = document.getElementById('output');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');
const proxyInput = document.getElementById('proxyInput');
const useProxyBtn = document.getElementById('useProxyBtn');


// デフォルトのプロキシベース
let PROXY_BASE = proxyInput.value || '';


useProxyBtn.addEventListener('click', () => {
PROXY_BASE = proxyInput.value.trim();
// ユーザー向けの普通の口調で注意喚起
alert('プロキシを更新しました。プロキシの末尾にスラッシュがあるか確認してね。');
});


// GET ボタン押下で動く
fetchBtn.addEventListener('click', async () => {
const rawUrl = urlInput.value.trim();
if (!rawUrl) return alert('URLを入れてください');


// URLのバリデーション的な簡易チェック
if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
return alert('URLは http:// または https:// で始めてください');
}


output.value = '読み込み中...';


try {
// PROXY_BASE がある場合は path ベースのプロキシを想定して結合
// 例: PROXY_BASE = "https://cors-anymore.onrender.com/" => fetch("https://cors-anymore.onrender.com/https://example.com")
const target = (PROXY_BASE ? PROXY_BASE.replace(/\/+$/,'') + '/' : '') + rawUrl;


const res = await fetch(target, { method: 'GET' });
if (!res.ok) throw new Error('ステータスコード ' + res.status);


// テキストとして受け取る
const text = await res.text();
output.value = text;
} catch (err) {
output.value = '取得に失敗しました\n' + err.message;
}
});


// コピー機能
copyBtn.addEventListener('click', async () => {
try {
await navigator.clipboard.writeText(output.value);
alert('コピーしたよ');
} catch (e) {
alert('コピーに失敗した。ブラウザの設定確認して');
}
});


// ダウンロード機能（.htmlファイルとして保存）
downloadBtn.addEventListener('click', () => {
const blob = new Blob([output.value], { type: 'text/html' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'page.html';
document.body.appendChild(a);
a.click();
a.remove();
URL.revokeObjectURL(url);
});
