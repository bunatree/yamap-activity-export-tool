// YAMAPはCSS-in-JS（ハッシュ化されたクラス名、例: css-xhr9y）を採用しており、
// 意味のあるクラス名やIDが存在しないため、要素の構造・属性・テキスト内容を手がかりに取得する。

// 「日記」タブ（/article）のHTMLを取得してパースする。
// 「活動データ」タブの写真はサムネイルサイズ（rs:fill:336:336等）だが、
// 「日記」タブは旧UIのままで、写真の原寸に近いサイズ（rs:fit:1440:1080等）と
// 説明文の全文がサーバー側で生成されたHTMLにそのまま含まれているため、こちらから取得する。
async function fetchArticleDocument() {
  const articleUrl = window.location.href.replace(/\/article\/?$/, '').replace(/\/?$/, '') + '/article';
  try {
    const response = await fetch(articleUrl);
    const html = await response.text();
    return new DOMParser().parseFromString(html, 'text/html');
  } catch (error) {
    console.error('Failed to fetch the article page:', error);
    return null;
  }
}

async function gatherActivityData() {

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
  const calorie = getStatByLabel('カロリー');

  const url = window.location.href;

  // 説明文と写真は「日記」タブのHTMLから取得する（原寸に近い写真と全文の説明文が得られるため）
  const articleDoc = await fetchArticleDocument();

  const description = articleDoc?.querySelector('.Article__Description')?.textContent.trim();

  // 写真情報の取得（写真ギャラリーのfigure要素）
  const photos = Array.from(articleDoc?.querySelectorAll('figure.ImagesGalleryList__Item') || []).map(figure => {

    // 原寸に近いサイズの画像URLは、拡大表示用リンクのhref属性に入っている
    const imageLinkElm = figure.querySelector('a[itemprop="contentUrl"]');
    const captionElm = figure.querySelector('.ImagesGalleryList__Caption__OnList__Caption');
    const takenAtElm = figure.querySelector('.ImagesGalleryList__Caption__OnList__Date');
    const img = figure.querySelector('img');

    return {
      url: imageLinkElm?.getAttribute('href')?.replace(/\?.*/, ''),
      // キャプションがあればその内容を取得し、なければimg.altを使う
      memo: captionElm?.textContent.trim() || img?.alt,
      // 撮影日時（例: "2026.07.05(日) 06:19"）。YAMAPがEXIFを削除した写真にEXIFを復元するために使う
      takenAt: takenAtElm?.textContent.trim()
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
    gatherActivityData().then(data => {
      sendResponse(data);
    });
    return true; // 非同期応答を維持するために true を返す
  }

  if (request.action === 'downloadGpx') {
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
