// YAMAPはCSS-in-JS（ハッシュ化されたクラス名、例: css-xhr9y）を採用しており、
// 意味のあるクラス名やIDが存在しないため、要素の構造・属性・テキスト内容を手がかりに取得する。

// 表示中の活動日記が自分のものかどうかを判定する。
// YAMAPは本人にだけ「編集」リンク（/activities/<id>/edit）を表示するため、これを本人確認に用いる。
// 本ツールは私的使用（自分の記録のバックアップ）を目的としており、他人の活動日記は対象外とする。
function isOwnActivity() {
  const activityId = window.location.pathname.match(/\/activities\/(\d+)/)?.[1];
  if (!activityId) return false;
  return !!document.querySelector(`a[href^="/activities/${activityId}/edit"]`);
}

// 「日記」タブ（/article）のHTMLに埋め込まれたNext.jsのデータ（__NEXT_DATA__）を取得する。
// 表示用のHTML（ハッシュ化クラス名）はYAMAPのUI変更のたびに壊れるが、
// このJSONはアプリケーションの内部データなので構造が比較的安定している。
// さらに、撮影日時は表示用の文字列ではなくUnixタイムスタンプが得られる。
async function fetchActivityData() {
  const activityPath = window.location.pathname.replace(/\/article\/?$/, '').replace(/\/+$/, '');
  const articleUrl = window.location.origin + activityPath + '/article';
  try {
    // ブラウザのキャッシュに残った古いHTMLを掴まないようにする
    const response = await fetch(articleUrl, { cache: 'no-cache' });
    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const nextDataElm = doc.querySelector('#__NEXT_DATA__');
    if (!nextDataElm) {
      console.error('__NEXT_DATA__ not found in the article page.');
      return null;
    }
    return JSON.parse(nextDataElm.textContent)?.props?.pageProps?.activity || null;
  } catch (error) {
    console.error('Failed to fetch the article page:', error);
    return null;
  }
}

// Unixタイムスタンプを、YAMAPの表示と同じ現地時刻の文字列（例: "2026.08.25 04:49:18"）に変換する。
// 活動日記が持つタイムゾーン（timeZone: 9 なら UTC+9）で計算する。
function formatTakenAt(unixSeconds, timeZoneHours) {
  if (!unixSeconds) return undefined;
  const date = new Date((unixSeconds + (timeZoneHours || 0) * 3600) * 1000);
  const pad = (num) => String(num).padStart(2, '0');
  return `${date.getUTCFullYear()}.${pad(date.getUTCMonth() + 1)}.${pad(date.getUTCDate())}`
    + ` ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`;
}

async function gatherActivityData() {

  // 説明文と写真は「日記」タブの埋め込みデータから取得する
  const articleData = await fetchActivityData();
  if (!articleData) {
    return { error: 'articleFetchFailed' };
  }

  const title = document.querySelector('h1')?.textContent.trim();

  // 日付と行動日数（同じ親要素内で日付の隣に並ぶ要素）
  const dateElm = Array.from(document.querySelectorAll('span')).find(elm => /\d{4}年\d{1,2}月\d{1,2}日/.test(elm.textContent || ''));
  const date = dateElm?.textContent.trim();
  const days = dateElm?.nextElementSibling?.textContent.trim();

  // ユーザー名（/users/ へのリンクのうち最初のもの）
  const userName = document.querySelector('a[href^="/users/"]')?.textContent.trim();

  const prefName = Array.from(document.querySelectorAll('a[href*="/mountains/prefectures/"]'))
    .map(pref => pref.textContent.trim())
    .join(' ');

  const tags = Array.from(document.querySelectorAll('a[href^="/tags/"]'))
    .map(tag => tag.textContent.trim())
    .join(' ');

  const mapName = document.querySelector('a[href^="/maps/"]')?.textContent.trim();

  // 活動データの各数値（<dt>のラベルテキストから対応する<dd>を取得）
  const getStatByLabel = (label) => {
    const dtElm = Array.from(document.querySelectorAll('dt')).find(dt => dt.textContent.trim().includes(label));
    return dtElm?.nextElementSibling?.textContent.trim();
  };
  const distance = getStatByLabel('距離');
  const ascent = getStatByLabel('のぼり');
  const descent = getStatByLabel('くだり');

  // カロリーはYAMAPのUI刷新で「活動データ」タブから削除されたため、埋め込みデータから取得する
  const calorie = articleData.calorie ? `${articleData.calorie}kcal` : undefined;

  const url = window.location.href;

  const description = articleData.description?.trim();

  const photos = (articleData.images || []).map(image => {
    return {
      // url は表示用に縮小・再圧縮（imgproxyのrs:fit/q:50）された画像のURL。
      // 縮小前のファイルを指す baseUrl は、2026年9月末からYAMAP側でアクセスできなくなった（503等のエラーを返す）。
      // imgproxyのURLは署名付きのため、サイズや画質の指定を書き換えることはできない。
      url: image.url || image.baseUrl,
      memo: (image.caption || '').trim(),
      // 撮影日時。YAMAPがEXIFを削除した写真にEXIFを復元するために使う
      takenAt: formatTakenAt(image.takenAt, articleData.timeZone)
    };
  });

  // console.log({ date, days, userName, prefName, mapName, title, url, distance, ascent, descent, calorie, description, tags, photos });

  return {
    date, days, userName, prefName, mapName, title, url, distance, ascent, descent, calorie, description, tags, photos
  };
}

// メッセージをリッスンして gatherActivityData を呼び出す
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  if (request.action === 'gatherData') {
    if (!isOwnActivity()) {
      sendResponse({ error: 'notOwnActivity' });
      return;
    }
    gatherActivityData().then(data => {
      sendResponse(data);
    });
    return true; // 非同期応答を維持するために true を返す
  }

  if (request.action === 'downloadGpx') {
    if (!isOwnActivity()) {
      sendResponse({ error: 'notOwnActivity' });
      return;
    }
    // GPXデータのエクスポートボタン（意味のあるクラス名がないため、ボタンのテキストで特定する）
    const gpxButton = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.trim() === 'エクスポート');
    if (gpxButton) {
      gpxButton.click();
      sendResponse({ success: true });
    } else {
      console.error('GPX download button not found.');
      sendResponse({ error: 'GPX download button not found.' });
    }
  }

  // メッセージをコンソールに出力
  if (request.message) {
    console.log(request.message);
  }

});
