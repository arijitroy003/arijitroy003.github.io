// ─── Blog Engine ───
// Loads markdown articles from blog/ directory, parses frontmatter,
// renders the blog list, and handles article modal + sharing.

(function() {
  'use strict';

  var articles = [];
  var loaded = false;

  // ─── Frontmatter Parser ───
  function parseFrontmatter(raw) {
    var match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) return { meta: {}, body: raw };

    var meta = {};
    var lines = match[1].split('\n');
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      var sep = line.indexOf(':');
      if (sep === -1) continue;
      var key = line.slice(0, sep).trim();
      var val = line.slice(sep + 1).trim();
      // Remove surrounding quotes
      if ((val[0] === '"' && val[val.length - 1] === '"') ||
          (val[0] === "'" && val[val.length - 1] === "'")) {
        val = val.slice(1, -1);
      }
      // Parse array values like [a, b, c]
      if (val[0] === '[' && val[val.length - 1] === ']') {
        val = val.slice(1, -1).split(',').map(function(s) { return s.trim(); });
      }
      meta[key] = val;
    }
    return { meta: meta, body: match[2].trim() };
  }

  // ─── Load All Articles ───
  function loadBlog() {
    if (loaded) return Promise.resolve(articles);

    return fetch('blog/manifest.json')
      .then(function(res) {
        if (!res.ok) throw new Error('Failed to load blog manifest: ' + res.status);
        return res.json();
      })
      .then(function(filenames) {
        var fetches = filenames.map(function(name) {
          return fetch('blog/' + name)
            .then(function(res) {
              if (!res.ok) throw new Error('Failed to load article: ' + name + ' (' + res.status + ')');
              return res.text();
            })
            .then(function(raw) {
              var parsed = parseFrontmatter(raw);
              return {
                filename: name,
                meta: parsed.meta,
                body: parsed.body
              };
            });
        });
        return Promise.all(fetches);
      })
      .then(function(results) {
        articles = results;
        loaded = true;
        return articles;
      })
      .catch(function(err) {
        console.error('Blog load error:', err);
        var container = document.getElementById('blog-list');
        if (container) {
          container.innerHTML = '<p style="color:var(--white-dim);font-family:var(--mono);font-size:12px;padding:20px;">Could not load articles. Try refreshing the page.</p>';
        }
        return [];
      });
  }

  // ─── Render Blog List ───
  function renderBlogList() {
    var container = document.getElementById('blog-list');
    if (!container) return;
    container.innerHTML = '';

    articles.forEach(function(article, index) {
      var meta = article.meta;
      var tags = Array.isArray(meta.tags) ? meta.tags : [];

      var row = document.createElement('div');
      row.className = 'blog-row fade-up' + (index > 0 ? ' delay-' + Math.min(index, 5) : '');

      var tagsHtml = tags.map(function(t) {
        return '<span class="tag">' + escapeHtml(t) + '</span>';
      }).join('');

      var linksHtml = '';
      if (meta.medium) linksHtml += '<a href="' + escapeHtml(meta.medium) + '" target="_blank">medium</a>';
      if (meta.substack) linksHtml += '<a href="' + escapeHtml(meta.substack) + '" target="_blank">substack</a>';
      if (meta.linkedin) linksHtml += '<a href="' + escapeHtml(meta.linkedin) + '" target="_blank">linkedin</a>';
      linksHtml += '<a href="#" onclick="blogEngine.share(event,' + index + ')">share</a>';

      row.innerHTML =
        '<span class="blog-row-date">' + escapeHtml(meta.date || '') + '</span>' +
        '<div class="blog-row-body">' +
          '<span class="blog-row-title" onclick="blogEngine.open(' + index + ')">' + escapeHtml(meta.title || '') + '</span>' +
          '<span class="blog-row-preview">' + escapeHtml(meta.preview || '') + '</span>' +
          '<div class="blog-row-meta">' +
            '<span class="blog-row-tags">' + tagsHtml + '</span>' +
            '<span class="blog-row-links">' + linksHtml + '</span>' +
          '</div>' +
        '</div>' +
        '<span class="blog-row-arrow" onclick="blogEngine.open(' + index + ')">›</span>';

      container.appendChild(row);
    });

    // Re-trigger fade-up animations
    var rows = container.querySelectorAll('.fade-up');
    rows.forEach(function(el) {
      el.style.animation = 'none';
      void el.offsetHeight;
      el.style.animation = '';
    });
  }

  // ─── Open Article Modal ───
  function openArticle(index) {
    var article = articles[index];
    if (!article) return;

    var overlay = document.getElementById('article-overlay');
    var content = document.getElementById('article-content');
    if (!overlay || !content) return;

    var html = '<div class="article-body">' +
      '<div class="proj-card-label">[article · ' + escapeHtml(article.meta.date || '') + ']</div>' +
      marked.parse(article.body) +
      '</div>';

    content.innerHTML = html;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  // ─── Share Article ───
  function shareBlog(e, index) {
    e.preventDefault();
    e.stopPropagation();
    var article = articles[index];
    if (!article) return;
    var articleUrl = window.location.origin + window.location.pathname + '#article-' + index;
    var shareUrl = 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(articleUrl);
    window.open(shareUrl, '_blank', 'width=600,height=500');
  }

  // ─── Deep-link: open article from URL hash ───
  function checkArticleHash() {
    var hash = window.location.hash;
    var match = hash.match(/^#article-(\d+)$/);
    if (match) {
      var index = parseInt(match[1], 10);
      navigate('blog');
      loadBlog().then(function() {
        renderBlogList();
        setTimeout(function() { openArticle(index); }, 100);
      });
    }
  }

  // ─── Utility ───
  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  // ─── Public API ───
  window.blogEngine = {
    open: openArticle,
    share: shareBlog,
    load: function() {
      loadBlog().then(renderBlogList);
    },
    checkHash: checkArticleHash
  };

  // ─── Auto-load when blog page becomes active ───
  var blogPage = document.getElementById('page-blog');
  if (blogPage) {
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.attributeName === 'class' && blogPage.classList.contains('active')) {
          loadBlog().then(renderBlogList);
        }
      });
    });
    observer.observe(blogPage, { attributes: true });

    // If blog is already active on page load
    if (blogPage.classList.contains('active')) {
      loadBlog().then(renderBlogList);
    }
  }

  // Check deep-link hash on load
  window.addEventListener('hashchange', checkArticleHash);
  checkArticleHash();

})();
