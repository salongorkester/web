function adjustTitles(className, fontSizeVar) {
  const MIN_SCALE = 0.70;

  function getMaxSize(el) {
    const style = getComputedStyle(el);
    const value = style.getPropertyValue(fontSizeVar).trim() || style.fontSize;
    const prop = String(value).trim().match(/^(-?\d*\.?\d+)([a-z%]*)$/i);
    return {
      value: parseFloat(prop ? prop[1] : value),
      unit: prop ? prop[2] || '' : 'px'
    }
  }

  function wrap(el) {
    el.style.setProperty("white-space", "normal")
  }

  function nowrap(el) {
    el.style.setProperty("white-space", "nowrap")
  }

  function fitsAt(el, scale) {
    const size = getMaxSize(el);
    el.style.fontSize = `${size.value * scale}${size.unit}`;
    nowrap(el)
    return el.scrollWidth <= el.clientWidth + 0.5;
  }

  function fitTitle(el) {
    if (fitsAt(el, 1)) {
      const size = getMaxSize(el);
      el.style.fontSize = `${size.value}${size.unit}`;
      wrap(el);
      return;
    }

    let lo = MIN_SCALE, hi = 1, best = null;
    for (let i = 0; i < 20; i++) {
      const mid = (lo + hi) / 2;
      if (fitsAt(el, mid)) {
        best = mid;
        lo = mid;
      } else {
        hi = mid;
      }
    }

    const size = getMaxSize(el);
    if (best !== null && best >= MIN_SCALE) {
      el.style.fontSize = `${size.value * best}${size.unit}`;
      nowrap(el);
    } else {
      el.style.fontSize = `${size.value}${size.unit}`;
      wrap(el)
    }
  }

  function fitTitles() {
    document.querySelectorAll(`div.${className} h3`).forEach((el) =>{
      fitTitle(el);
    })
  }

  document.querySelectorAll(`div.${className} h3`).forEach((el) =>{
    const ro = new ResizeObserver(fitTitles);
    ro.observe(el.parentElement);
    const mo = new MutationObserver(fitTitles);
    mo.observe(el, { childList: true, characterData: true, subtree: true });
  })

  window.addEventListener('load', fitTitles);
  window.addEventListener('orientationchange', fitTitles);
}
