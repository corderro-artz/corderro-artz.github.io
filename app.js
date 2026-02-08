/* ===== CONFIG ===== */
var CONFIG = {
  username: 'corderro-artz',
  brand: {
    name: 'vaporsoft',
    tagline: 'where code meets nostalgia',
    description: 'Building software with retro aesthetics and modern sensibilities.'
  },
  contact: [
    { label: 'GitHub', url: 'https://github.com/corderro-artz', icon: '🐙' },
    { label: 'Email', url: 'mailto:hello@vaporsoft.dev', icon: '✉' }
  ],
  langColors: {
    'C#':         '#9b4f96',
    'C++':        '#0057b7',
    'Python':     '#3572a5',
    'JavaScript': '#f1e05a',
    'TypeScript': '#3178c6',
    'HTML':       '#e34c26',
    'CSS':        '#563d7c',
    'Java':       '#b07219',
    'Rust':       '#dea584',
    'Go':         '#00add8',
    'Ruby':       '#701516',
    'PHP':        '#4f5d95',
    'Swift':      '#ffac45',
    'Kotlin':     '#a97bff',
    'Shell':      '#89e051',
    'Vue':        '#41b883',
    'Svelte':     '#ff3e00',
  },
  langIconMap: {
    'C#':         'icon-csharp.svg',
    'C++':        'icon-cpp.svg',
    'Python':     'icon-python.svg',
    'JavaScript': 'icon-javascript.svg',
    'TypeScript': 'icon-typescript.svg',
    'HTML':       'icon-html.svg',
  },
  pinnedRepos: ['win95-oem-keygen', 'mc-texture-tool', 'ai-governance'],
  bootDuration: 2500,
  windowDefaults: { width: 500, height: 380 }
};

/* ===== STATE ===== */
var STATE = {
  repos: [],
  windows: {},
  topZ: 100,
  startMenuOpen: false,
  nextWindowId: 0
};

/* ===== BOOT ===== */
var Boot = {
  run: function(callback) {
    var bootEl = document.getElementById('boot-screen');
    setTimeout(function() {
      bootEl.classList.add('fade-out');
      setTimeout(function() {
        bootEl.style.display = 'none';
        document.getElementById('desktop').removeAttribute('hidden');
        if (callback) callback();
      }, 600);
    }, CONFIG.bootDuration);
  }
};

/* ===== GITHUB API ===== */
var GitHubAPI = {
  CACHE_KEY: 'vaporsoft_repos',
  fetch: function(callback) {
    var cached = sessionStorage.getItem(this.CACHE_KEY);
    if (cached) {
      try {
        callback(JSON.parse(cached));
        return;
      } catch (e) {}
    }
    var self = this;
    fetch('https://api.github.com/users/' + CONFIG.username + '/repos?sort=updated&per_page=30')
      .then(function(res) {
        if (!res.ok) {
          console.warn('GitHub API error:', res.status);
          return [];
        }
        return res.json();
      })
      .then(function(data) {
        if (Array.isArray(data)) {
          sessionStorage.setItem(self.CACHE_KEY, JSON.stringify(data));
          callback(data);
        } else {
          callback([]);
        }
      })
      .catch(function(err) {
        console.warn('GitHub API fetch failed:', err);
        callback([]);
      });
  }
};

/* ===== ICONS ===== */
var Icons = {
  render: function(repos) {
    STATE.repos = repos;
    var grid = document.getElementById('icon-grid');
    grid.innerHTML = '';

    // Filter out the .github.io repo itself from the icon list (or keep it, your choice)
    repos.forEach(function(repo) {
      var icon = Icons.createIcon(repo);
      grid.appendChild(icon);
    });

    // Add "My Projects" icon
    var projectsIcon = Icons.createProjectsIcon();
    grid.appendChild(projectsIcon);

    // Add "About" icon
    var aboutIcon = Icons.createAboutIcon();
    grid.appendChild(aboutIcon);
  },

  createIcon: function(repo) {
    var el = document.createElement('div');
    el.className = 'desktop-icon';
    el.title = repo.description || repo.name;

    var imgSrc = Icons.getIconSrc(repo.language);
    el.innerHTML =
      '<img src="' + imgSrc + '" alt="' + (repo.language || 'project') + '">' +
      '<div class="desktop-icon-label">' + Icons.escapeHtml(repo.name) + '</div>';

    el.addEventListener('click', function() {
      document.querySelectorAll('.desktop-icon').forEach(function(i) {
        i.classList.remove('selected');
      });
      el.classList.add('selected');
    });

    el.addEventListener('dblclick', function() {
      Windows.open(repo);
    });

    return el;
  },

  createProjectsIcon: function() {
    var el = document.createElement('div');
    el.className = 'desktop-icon';
    el.title = 'My Projects';
    el.innerHTML =
      '<img src="assets/icons/icon-default.svg" alt="projects">' +
      '<div class="desktop-icon-label">My Projects</div>';
    el.addEventListener('dblclick', function() {
      Windows.openProjects();
    });
    return el;
  },

  createAboutIcon: function() {
    var el = document.createElement('div');
    el.className = 'desktop-icon';
    el.title = 'About vaporsoft Desktop';
    el.innerHTML =
      '<img src="assets/icons/icon-default.svg" alt="about">' +
      '<div class="desktop-icon-label">About</div>';
    el.addEventListener('dblclick', function() {
      Windows.openAbout();
    });
    return el;
  },

  getIconSrc: function(lang) {
    if (lang && CONFIG.langIconMap[lang]) {
      return 'assets/icons/' + CONFIG.langIconMap[lang];
    }
    return 'assets/icons/icon-default.svg';
  },

  escapeHtml: function(str) {
    return (str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }
};

/* ===== WINDOWS ===== */
var Windows = {
  open: function(repo) {
    var id = 'win-' + (STATE.nextWindowId++);
    var title = repo.name;
    var win = Windows.create(id, title, repo.language);

    var content = win.querySelector('.win-content');
    content.style.height = (CONFIG.windowDefaults.height - 48) + 'px';

    if (repo.has_pages) {
      var iframe = document.createElement('iframe');
      iframe.className = 'win-iframe';
      iframe.src = 'https://' + CONFIG.username + '.github.io/' + repo.name + '/';
      content.appendChild(iframe);
    } else {
      content.innerHTML = '<div class="readme-loading">Loading README\u2026</div>';
      README.fetch(repo, function(md) {
        if (md) {
          content.innerHTML = '<div class="readme-content">' + Markdown.parse(md) + '</div>';
        } else {
          content.innerHTML = Windows.buildProjectCard(repo);
        }
      });
    }

    document.getElementById('window-layer').appendChild(win);
    Windows.focus(id);
    Taskbar.addWindow(id, title);
    STATE.windows[id] = { id: id, title: title, minimized: false };
  },

  openAbout: function() {
    var id = 'win-about';
    if (document.getElementById(id)) {
      Windows.focus(id);
      return;
    }
    var win = Windows.create(id, 'About vaporsoft Desktop', null);
    var content = win.querySelector('.win-content');
    content.style.height = '260px';
    content.innerHTML =
      '<div class="about-card">' +
      '<div class="about-logo"></div>' +
      '<h2>vaporsoft Desktop</h2>' +
      '<div class="version">Version 1.0 &bull; &copy; 2024 vaporsoft</div>' +
      '<p>' + Icons.escapeHtml(CONFIG.brand.description) + '</p>' +
      '<p style="margin-top:12px"><a href="https://github.com/corderro-artz" style="color:#000080">github.com/corderro-artz</a></p>' +
      '</div>';
    document.getElementById('window-layer').appendChild(win);
    Windows.focus(id);
    Taskbar.addWindow(id, 'About');
    STATE.windows[id] = { id: id, title: 'About', minimized: false };
  },

  openProjects: function() {
    var id = 'win-projects';
    if (document.getElementById(id)) {
      Windows.focus(id);
      return;
    }
    var win = Windows.create(id, 'My Projects', null);
    var content = win.querySelector('.win-content');
    content.style.height = '320px';

    var pinned = CONFIG.pinnedRepos;
    var pinnedRepos = pinned.map(function(name) {
      return STATE.repos.find(function(r) { return r.name === name; });
    }).filter(Boolean);

    // If repos haven't loaded yet, show all repos
    if (pinnedRepos.length === 0 && STATE.repos.length > 0) {
      pinnedRepos = STATE.repos.slice(0, 6);
    }

    var html = '<div class="projects-list"><h2>Pinned Projects</h2>';
    if (pinnedRepos.length === 0) {
      html += '<div class="readme-loading">Loading projects\u2026</div>';
    } else {
      pinnedRepos.forEach(function(repo) {
        var lang = repo.language || 'Unknown';
        var color = CONFIG.langColors[lang] || '#888';
        html +=
          '<div class="project-item" data-repo="' + Icons.escapeHtml(repo.name) + '">' +
          '<img src="' + Icons.getIconSrc(repo.language) + '" alt="">' +
          '<div class="project-item-info">' +
          '<div class="project-item-name">' + Icons.escapeHtml(repo.name) + '</div>' +
          '<div class="project-item-desc">' + Icons.escapeHtml(repo.description || 'No description') + '</div>' +
          '<div class="project-item-meta">' +
          '<span style="color:' + color + '">&#9679; ' + Icons.escapeHtml(lang) + '</span>' +
          ' &nbsp;&#9733; ' + (repo.stargazers_count || 0) +
          '</div>' +
          '</div>' +
          '</div>';
      });
    }
    html += '</div>';
    content.innerHTML = html;

    // Bind click on each project item to open its window
    content.querySelectorAll('.project-item').forEach(function(item) {
      item.addEventListener('click', function() {
        var name = item.dataset.repo;
        var repo = STATE.repos.find(function(r) { return r.name === name; });
        if (repo) Windows.open(repo);
      });
    });

    document.getElementById('window-layer').appendChild(win);
    Windows.focus(id);
    Taskbar.addWindow(id, 'My Projects');
    STATE.windows[id] = { id: id, title: 'My Projects', minimized: false };
  },

  create: function(id, title, lang) {
    var win = document.createElement('div');
    win.className = 'win bevel-raised';
    win.id = id;
    win.style.width = CONFIG.windowDefaults.width + 'px';
    win.style.height = CONFIG.windowDefaults.height + 'px';

    // Cascade offset
    var offset = (STATE.nextWindowId * 24) % 200;
    win.style.left = (80 + offset) + 'px';
    win.style.top = (40 + offset) + 'px';

    var iconSrc = Icons.getIconSrc(lang);
    win.innerHTML =
      '<div class="win-titlebar">' +
      '<img class="win-title-icon" src="' + iconSrc + '" alt="">' +
      '<span class="win-title-text">' + Icons.escapeHtml(title) + '</span>' +
      '<div class="win-controls">' +
      '<button class="win-btn win-btn-min" title="Minimize">_</button>' +
      '<button class="win-btn win-btn-max" title="Maximize">&#9633;</button>' +
      '<button class="win-btn win-btn-close" title="Close">&#10005;</button>' +
      '</div>' +
      '</div>' +
      '<div class="win-menubar"><span>File</span><span>View</span><span>Help</span></div>' +
      '<div class="win-content"></div>';

    Windows.bindControls(win, id);
    Windows.makeDraggable(win);
    win.addEventListener('mousedown', function() { Windows.focus(id); });

    return win;
  },

  bindControls: function(win, id) {
    win.querySelector('.win-btn-close').addEventListener('click', function() {
      Windows.close(id);
    });
    win.querySelector('.win-btn-min').addEventListener('click', function() {
      Windows.minimize(id);
    });
    win.querySelector('.win-btn-max').addEventListener('click', function() {
      Windows.toggleMaximize(win);
    });
  },

  close: function(id) {
    var el = document.getElementById(id);
    if (el) el.remove();
    Taskbar.removeWindow(id);
    delete STATE.windows[id];
  },

  minimize: function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.classList.add('minimized');
      STATE.windows[id].minimized = true;
      Taskbar.updateWindowBtn(id, false);
    }
  },

  restore: function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.classList.remove('minimized');
      STATE.windows[id].minimized = false;
      Windows.focus(id);
      Taskbar.updateWindowBtn(id, true);
    }
  },

  toggleMaximize: function(win) {
    if (win.dataset.maximized === '1') {
      win.style.left = win.dataset.prevLeft;
      win.style.top = win.dataset.prevTop;
      win.style.width = win.dataset.prevWidth;
      win.style.height = win.dataset.prevHeight;
      win.dataset.maximized = '0';
    } else {
      win.dataset.prevLeft = win.style.left;
      win.dataset.prevTop = win.style.top;
      win.dataset.prevWidth = win.style.width;
      win.dataset.prevHeight = win.style.height;
      win.style.left = '0';
      win.style.top = '0';
      win.style.width = '100%';
      win.style.height = 'calc(100vh - 32px)';
      win.dataset.maximized = '1';
    }
  },

  focus: function(id) {
    STATE.topZ += 1;
    document.querySelectorAll('.win').forEach(function(w) {
      w.classList.add('inactive');
    });
    var el = document.getElementById(id);
    if (el) {
      el.style.zIndex = STATE.topZ;
      el.classList.remove('inactive');
    }
    Taskbar.setActive(id);
  },

  makeDraggable: function(win) {
    var titlebar = win.querySelector('.win-titlebar');
    var startX, startY, startLeft, startTop;
    var dragging = false;

    titlebar.addEventListener('mousedown', function(e) {
      if (e.target.tagName === 'BUTTON') return;
      if (win.dataset.maximized === '1') return;
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startLeft = parseInt(win.style.left) || 0;
      startTop = parseInt(win.style.top) || 0;
      e.preventDefault();
    });

    document.addEventListener('mousemove', function(e) {
      if (!dragging) return;
      var dx = e.clientX - startX;
      var dy = e.clientY - startY;
      win.style.left = Math.max(0, startLeft + dx) + 'px';
      win.style.top = Math.max(0, startTop + dy) + 'px';
    });

    document.addEventListener('mouseup', function() {
      dragging = false;
    });
  },

  buildProjectCard: function(repo) {
    var lang = repo.language || 'Unknown';
    var color = CONFIG.langColors[lang] || '#888';
    var desc = repo.description ? Icons.escapeHtml(repo.description) : 'No description provided.';
    return '<div class="project-card">' +
      '<img class="repo-icon" src="' + Icons.getIconSrc(repo.language) + '" alt="">' +
      '<h2>' + Icons.escapeHtml(repo.name) + '</h2>' +
      '<span class="lang-badge" style="background:' + color + '">' + Icons.escapeHtml(lang) + '</span>' +
      '<div class="description">' + desc + '</div>' +
      '<div class="stats">' +
      '<span>&#9733; ' + (repo.stargazers_count || 0) + '</span>' +
      '<span>&#8481; ' + (repo.forks_count || 0) + '</span>' +
      '</div>' +
      '<a class="btn-github" href="' + repo.html_url + '" target="_blank" rel="noopener">View on GitHub</a>' +
      '</div>';
  }
};

/* ===== MARKDOWN ===== */
var Markdown = {
  parse: function(md) {
    // Escape HTML first
    var s = md
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Fenced code blocks
    s = s.replace(/```[\w]*\n([\s\S]*?)```/g, function(_, code) {
      return '<pre><code>' + code.trimEnd() + '</code></pre>';
    });

    // Inline code
    s = s.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Images before links
    s = s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2">');

    // Links
    s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

    // Bold & italic
    s = s.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/\*(.+?)\*/g, '<em>$1</em>');
    s = s.replace(/__(.+?)__/g, '<strong>$1</strong>');
    s = s.replace(/_(.+?)_/g, '<em>$1</em>');

    // HR
    s = s.replace(/^---+$/gm, '<hr>');

    // Headers
    s = s.replace(/^#{6}\s+(.+)$/gm, '<h6>$1</h6>');
    s = s.replace(/^#{5}\s+(.+)$/gm, '<h5>$1</h5>');
    s = s.replace(/^#{4}\s+(.+)$/gm, '<h4>$1</h4>');
    s = s.replace(/^#{3}\s+(.+)$/gm, '<h3>$1</h3>');
    s = s.replace(/^#{2}\s+(.+)$/gm, '<h2>$1</h2>');
    s = s.replace(/^#\s+(.+)$/gm, '<h1>$1</h1>');

    // Blockquotes
    s = s.replace(/^&gt;\s?(.*)$/gm, '<blockquote>$1</blockquote>');

    // Unordered lists (simple — consecutive lines)
    s = s.replace(/^[\*\-]\s+(.+)$/gm, '<li>$1</li>');
    s = s.replace(/(<li>[\s\S]*?<\/li>)/g, function(m) {
      if (!m.startsWith('<ul>')) return '<ul>' + m + '</ul>';
      return m;
    });

    // Ordered lists
    s = s.replace(/^\d+\.\s+(.+)$/gm, '<oli>$1</oli>');
    s = s.replace(/(<oli>[\s\S]*?<\/oli>)/g, function(m) {
      return '<ol>' + m.replace(/<\/?oli>/g, function(t) { return t === '<oli>' ? '<li>' : '</li>'; }) + '</ol>';
    });

    // Paragraphs: wrap double-newline-separated blocks not already tagged
    var lines = s.split(/\n\n+/);
    s = lines.map(function(block) {
      block = block.trim();
      if (!block) return '';
      if (/^<[hupbodli]/.test(block) || /^<pre/.test(block) || /^<hr/.test(block) || /^<blockquote/.test(block)) return block;
      return '<p>' + block.replace(/\n/g, '<br>') + '</p>';
    }).join('\n');

    return s;
  }
};

/* ===== README ===== */
var README = {
  fetch: function(repo, callback) {
    var branches = ['main', 'master'];
    var idx = 0;
    function tryNext() {
      if (idx >= branches.length) { callback(null); return; }
      var branch = branches[idx++];
      fetch('https://raw.githubusercontent.com/' + CONFIG.username + '/' + repo.name + '/' + branch + '/README.md')
        .then(function(res) {
          if (res.ok) return res.text();
          return null;
        })
        .then(function(text) {
          if (text) callback(text);
          else tryNext();
        })
        .catch(function() { tryNext(); });
    }
    tryNext();
  }
};

/* ===== TASKBAR ===== */
var Taskbar = {
  init: function() {
    Taskbar.updateClock();
    setInterval(Taskbar.updateClock, 10000);
  },

  updateClock: function() {
    var now = new Date();
    var h = now.getHours();
    var m = now.getMinutes();
    var ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    var str = h + ':' + (m < 10 ? '0' + m : m) + ' ' + ampm;
    document.getElementById('taskbar-clock').textContent = str;
  },

  addWindow: function(id, title) {
    var btn = document.createElement('button');
    btn.className = 'taskbar-win-btn active';
    btn.id = 'tbtn-' + id;
    btn.textContent = title;
    btn.addEventListener('click', function() {
      if (STATE.windows[id] && STATE.windows[id].minimized) {
        Windows.restore(id);
      } else {
        Windows.minimize(id);
      }
    });
    document.getElementById('taskbar-windows').appendChild(btn);
  },

  removeWindow: function(id) {
    var btn = document.getElementById('tbtn-' + id);
    if (btn) btn.remove();
  },

  setActive: function(id) {
    document.querySelectorAll('.taskbar-win-btn').forEach(function(b) {
      b.classList.remove('active');
    });
    var btn = document.getElementById('tbtn-' + id);
    if (btn) btn.classList.add('active');
  },

  updateWindowBtn: function(id, active) {
    var btn = document.getElementById('tbtn-' + id);
    if (btn) {
      if (active) btn.classList.add('active');
      else btn.classList.remove('active');
    }
  }
};

/* ===== START MENU ===== */
var StartMenu = {
  init: function() {
    var btn = document.getElementById('start-btn');
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      StartMenu.toggle();
    });

    document.getElementById('start-shutdown').addEventListener('click', function() {
      StartMenu.close();
      Boot.run(function() {});
      setTimeout(function() {
        document.getElementById('boot-screen').style.display = 'flex';
        document.getElementById('boot-screen').classList.remove('fade-out');
      }, 100);
    });

    StartMenu.populate();

    document.addEventListener('click', function() {
      StartMenu.close();
    });
  },

  toggle: function() {
    STATE.startMenuOpen = !STATE.startMenuOpen;
    var menu = document.getElementById('start-menu');
    if (STATE.startMenuOpen) {
      menu.removeAttribute('hidden');
    } else {
      menu.setAttribute('hidden', '');
    }
  },

  close: function() {
    STATE.startMenuOpen = false;
    document.getElementById('start-menu').setAttribute('hidden', '');
  },

  populate: function() {
    var contactEl = document.getElementById('start-menu-contacts');
    CONFIG.contact.forEach(function(c) {
      var a = document.createElement('a');
      a.className = 'start-menu-link';
      a.href = c.url;
      a.target = '_blank';
      a.rel = 'noopener';
      a.innerHTML = '<span class="link-icon">' + c.icon + '</span>' + c.label;
      contactEl.appendChild(a);
    });

    var aboutEl = document.getElementById('start-menu-about');
    var p = document.createElement('div');
    p.className = 'start-menu-link';
    p.style.cursor = 'default';
    p.style.pointerEvents = 'none';
    p.textContent = CONFIG.brand.description;
    aboutEl.appendChild(p);
  }
};

/* ===== CONTEXT MENU ===== */
var ContextMenu = {
  init: function() {
    var desktop = document.getElementById('desktop');
    var menu = document.getElementById('context-menu');

    desktop.addEventListener('contextmenu', function(e) {
      if (e.target === desktop || e.target === document.getElementById('icon-grid')) {
        e.preventDefault();
        menu.style.left = e.clientX + 'px';
        menu.style.top = Math.min(e.clientY, window.innerHeight - 80) + 'px';
        menu.removeAttribute('hidden');
      }
    });

    document.addEventListener('click', function() {
      menu.setAttribute('hidden', '');
    });

    document.getElementById('ctx-refresh').addEventListener('click', function() {
      sessionStorage.removeItem(GitHubAPI.CACHE_KEY);
      GitHubAPI.fetch(Icons.render);
    });

    document.getElementById('ctx-about').addEventListener('click', function() {
      Windows.openAbout();
    });
  }
};

/* ===== MOBILE ===== */
var Mobile = {
  check: function() {
    if (window.innerWidth < 600) {
      document.getElementById('mobile-notice').removeAttribute('hidden');
      document.getElementById('desktop').setAttribute('hidden', '');
      document.getElementById('boot-screen').style.display = 'none';
      return true;
    }
    return false;
  }
};

/* ===== APP INIT ===== */
var App = {
  init: function() {
    if (Mobile.check()) return;

    Boot.run(function() {
      Taskbar.init();
      StartMenu.init();
      ContextMenu.init();
      GitHubAPI.fetch(function(repos) {
        Icons.render(repos);
      });
    });
  }
};

// Start
App.init();
