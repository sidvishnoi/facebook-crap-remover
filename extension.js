chrome.storage.sync.get({ keywords: [] }, res => {
  fbCrapRemover(res.keywords);
});

function fbCrapRemover(keywords) {
  console.log('Activated Facebook Crap Remover with keywords:', keywords);

  function removeCrap() {
    const selector = '#contentArea div[role="article"]:not(.noncrap)';
    /** @type {NodeListOf<HTMLDivElement>} */
    const elems = document.querySelectorAll(selector);
    elems.forEach(article => {
      article.classList.add('noncrap');
      const wordList = new Set(article.innerText.toLowerCase().split(/\s+/));
      if (keywords.some(keyword => wordList.has(keyword))) {
        article.remove();
        console.count('[Facebook Crap Remover] Posts Hidden');
        chrome.storage.local.get({ count: 0 }, res => {
          chrome.storage.local.set({ count: res.count + 1 });
        });
      }
    });
  }

  function isArticleAdded(mutation) {
    // TODO: this filter can be improved a lot
    return mutation.addedNodes.length;
  }

  const observer = new MutationObserver(mutations => {
    if (mutations.some(isArticleAdded)) removeCrap();
  });

  const timer = setInterval(() => {
    const contentArea = document.getElementById('contentArea');
    if (!contentArea) return;
    clearInterval(timer);
    observer.observe(contentArea, { childList: true, subtree: true });
    removeCrap();
  }, 200);
}
