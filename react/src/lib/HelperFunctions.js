function getOffsetFromTopOfPage(el) {
  let rect = el.getBoundingClientRect(),
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return rect.top + scrollTop;
}

function performOffset(e) {
  e.preventDefault();
  let header = document?.body?.querySelector('header');
  let anchor = document?.body?.querySelector(e.target.closest('a').hash);
  let anchorPosition = getOffsetFromTopOfPage(anchor);
  let offsetAmount = header.offsetHeight + 15;
  anchor.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
  window.scrollTo({ top: anchorPosition - offsetAmount, behavior: 'smooth' });
  return false;
}

export function handleAnchorOffsetUrlHash() {
  //timeout of zero to wait for dom load
  setTimeout(function () {
    let hash = window.location.hash;

    if (hash.length === 0 || !/^[A-Za-z#]+[\w\-:.]*$/.test(hash)) return;
    let anchor = document?.body.querySelector(hash);

    if (!anchor) return;
    let header = document?.body?.querySelector('.GlobalHeader');
    let anchorPosition = getOffsetFromTopOfPage(anchor);
    let offsetAmount = header.offsetHeight + 15;
    anchor.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    window.scrollTo({ top: anchorPosition - offsetAmount, behavior: 'smooth' });
  }, 0);
}

export function handleAnchorOffset(container) {
  const anchorLinks = container?.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach((link) => {
    link.addEventListener('click', performOffset, false);
  });
}

/**
 * Utility function that runs a test at an interval until either the test returns true or the
 * elapsed time expires
 *
 * @param {()=>boolean} test a function that returns a boolean
 * @param {number} [maxWaitinMs=15000] max milliseconds to check
 * @returns {Promise}
 */
export function waitFor(test, maxWaitinMs = 15000) {
  let interval;

  const timer = new Promise((resolve, reject) => {
    let elapsed = 0;
    const ms = 500;
    interval = setInterval(() => {
      const testResult = test();

      if (testResult) {
        clearInterval(interval);
        resolve();
        return;
      }
      elapsed += ms;
      if (elapsed > maxWaitinMs) {
        clearInterval(interval);
        reject();
        return;
      }
    }, ms);
  });
  return {
    timer,
    cancel() {
      clearInterval(interval);
    },
  };
}
