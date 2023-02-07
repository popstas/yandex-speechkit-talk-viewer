function insertYandexMetrika () {
  (function (m, e, t, r, i, k, a) {
    m[i] = m[i] || function () {
      (m[i].a = m[i].a || []).push(arguments)
    }
    m[i].l = 1 * new Date()
    k = e.createElement(t), a = e.getElementsByTagName(t)[0], k.async = 1, k.src = r, a.parentNode.insertBefore(k, a)
  })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym')
}

export default ({route, store, app}, inject) => {
  const ym_id = process.env.YM_ID || false;
  if (ym_id) {
    insertYandexMetrika();
    window.ym(ym_id, 'init', {clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: true})
  }
}
