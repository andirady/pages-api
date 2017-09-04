function PageApi(linksId, pagesSelector, defaultPageId) {
  // Aliases
  let elById = document.getElementById.bind(document);
  let creEl = document.createElement.bind(document);
  let qs = document.querySelector.bind(document);
  let qsAll = document.querySelectorAll.bind(document);

  let links_ = elById(linksId);
  let pagesSelector_ = pagesSelector;

  function walk(path, callback) {
    let i = 0;
    do {
      i = path.indexOf('/', i+1);
      if (i <= 0) break;

      callback(path.substring(0, i));
    } while (true);
  }

  function liOfPage(pageId) {
    let link = links_.querySelector(`a[href="#${pageId}"]`);
    if (link != null)
      return link.parentElement;
    return null;
  }

  /**
   * Add className to the elem.
   * The className will be removed from any elements
   * which are direct descendant of the parent element.
   */
  function uqClass(elem, className) {
    let par = elem.parentElement;
    let all = par.getElementsByClassName(className);
    for (let el of all)
      if (el.parentElement == par)
        el.classList.remove(className);

    elem.classList.add(className);
  }

  function showPage(id) {
    let target = elById(id);
    if (target.dataset.noContent) {
      let ul = target.li.getElementsByTagName('ul')[0];
      let href = null;

      for (let ch of ul.children) {
        if (ch.classList.contains('selected')) {
          href = ch.getElementsByTagName('a')[0].href;
          break;
        }
      }

      if (href == null)
        href = ul.children[0].getElementsByTagName('a')[0].href;

      window.location.hash = href.substr(href.indexOf('#'));
    } else {
      uqClass(target, 'show');
    }
    
    walk(id, parId => {
      uqClass(liOfPage(parId), 'selected');
    });
    uqClass(target.li, 'selected');
  }

  function pageId() {
    return window.location.hash.substring(1);
  }

  // Create page links.
  for (let pg of qsAll(pagesSelector_)) {
    let id = pg.id;
    let ul = links_;
    walk(id, parId => {
      let par = elById(parId);
      let parLi = liOfPage(parId);

      for (let parUl of parLi.getElementsByTagName('ul')) {
        if (parUl.parentElement == parLi) {
          ul = parUl;
          return;
        }
      }

      ul = creEl('ul');
      parLi.appendChild(ul);
    });

    let li = creEl('li');
    let a = creEl('a');

    a.href = '#' + id;
    a.innerHTML = pg.title;
    ul.appendChild(li).appendChild(a);
    pg.li = li;
  }

  // Show page in URL.
  if (pageId() != "") {
    showPage(pageId());
  } else {
    window.location.hash = "#" + defaultPageId;
  }

  // Monitor URL.
  window.onhashchange = (e) => {
    let id = pageId();
    showPage(pageId());
  };
}
