(function () {
  'use strict';

  // ================================================================
  //  CONFIG
  // ================================================================
  const CFG = {
    user: 'guest',
    host: 'vaporsoft.dev',
    shell: 'vaporsoft-web-shell',
    terminal: 'vaporsoft-web-term',
    bootDelay: 1050,
    typeDelay: 18,
    lineDelay: 80,
    version: '2.0.0',
    github: 'corderro-artz',
    githubAPI: 'https://api.github.com',
    pinned: ['corderro-artz.github.io'],
  };

  // ================================================================
  //  NERD FONT ICONS (PUA code points â€” rendered via Symbols Nerd Font Mono)
  // ================================================================
  const NF = {
    terminal: '\uf489', cog: '\uf013', search: '\uf002',
    check: '\uf00c', times: '\uf00d', info: '\uf05a',
    warning: '\uf071', star: '\uf005', sun: '\uf185',
    moon: '\uf186', arrowUp: '\uf062', arrowDown: '\uf063',
    arrowRight: '\uf061', arrowLeft: '\uf060', keyboard: '\uf11c',
    rocket: '\uf135', palette: '\uf1fc', diamond: '\uf219',
    github: '\uf09b', code: '\uf121', tag: '\uf02b',
    bars: '\uf0c9', calendar: '\uf073', clock: '\uf017',
    fork: '\uf126', link: '\uf0c1', download: '\uf019',
    user: '\uf007', home: '\uf015', folder: '\uf07b',
    file: '\uf15b', globe: '\uf0ac', bolt: '\uf0e7',
    chip: '\uf2db', monitor: '\uf26c', key: '\uf084',
    play: '\uf04b', heart: '\uf004', eye: '\uf06e',
    shield: '\uf132', plug: '\uf1e6', cube: '\uf1b2',
    expand: '\uf065', compress: '\uf066', paint: '\uf1fc',
    cmd: '\uf120', archive: '\uf187', bug: '\uf188',
    wrench: '\uf0ad', circle: '\uf111', caretR: '\uf0da',
    caretL: '\uf0d9', question: '\uf059', gitBranch: '\ue725',
  };

  // ================================================================
  //  THEME SYSTEM
  // ================================================================
  const THEMES = {
    // â”€â”€ DARK THEMES (15) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    'green-phosphor': {
      name: 'Green Phosphor', type: 'dark',
      primary: '#00ff41', bright: '#39ff14', dim: 'rgba(0,255,65,0.5)',
      faint: 'rgba(0,255,65,0.08)', bg: '#050505', bgScreen: '#070707',
    },
    'amber-phosphor': {
      name: 'Amber Phosphor', type: 'dark',
      primary: '#ffb000', bright: '#ffc233', dim: 'rgba(255,176,0,0.5)',
      faint: 'rgba(255,176,0,0.08)', bg: '#050505', bgScreen: '#070707',
    },
    'cyan-ice': {
      name: 'Cyan Ice', type: 'dark',
      primary: '#00d4ff', bright: '#33e0ff', dim: 'rgba(0,212,255,0.5)',
      faint: 'rgba(0,212,255,0.08)', bg: '#050505', bgScreen: '#070707',
    },
    'red-alert': {
      name: 'Red Alert', type: 'dark',
      primary: '#ff003c', bright: '#ff3366', dim: 'rgba(255,0,60,0.5)',
      faint: 'rgba(255,0,60,0.08)', bg: '#050505', bgScreen: '#070707',
    },
    'magenta-neon': {
      name: 'Magenta Neon', type: 'dark',
      primary: '#ff2975', bright: '#ff5c99', dim: 'rgba(255,41,117,0.5)',
      faint: 'rgba(255,41,117,0.08)', bg: '#050505', bgScreen: '#070707',
    },
    'purple-haze': {
      name: 'Purple Haze', type: 'dark',
      primary: '#bd93f9', bright: '#d4b8ff', dim: 'rgba(189,147,249,0.5)',
      faint: 'rgba(189,147,249,0.08)', bg: '#0d0b14', bgScreen: '#0f0d18',
    },
    'blue-shift': {
      name: 'Blue Shift', type: 'dark',
      primary: '#60a5fa', bright: '#93c5fd', dim: 'rgba(96,165,250,0.5)',
      faint: 'rgba(96,165,250,0.08)', bg: '#050a14', bgScreen: '#070c18',
    },
    'yellow-spark': {
      name: 'Yellow Spark', type: 'dark',
      primary: '#fde047', bright: '#fef08a', dim: 'rgba(253,224,71,0.5)',
      faint: 'rgba(253,224,71,0.08)', bg: '#0a0900', bgScreen: '#0c0b02',
    },
    'orange-flame': {
      name: 'Orange Flame', type: 'dark',
      primary: '#fb923c', bright: '#fdba74', dim: 'rgba(251,146,60,0.5)',
      faint: 'rgba(251,146,60,0.08)', bg: '#0a0500', bgScreen: '#0c0702',
    },
    'dracula': {
      name: 'Dracula', type: 'dark',
      primary: '#ff79c6', bright: '#ff92d0', dim: 'rgba(255,121,198,0.5)',
      faint: 'rgba(255,121,198,0.08)', bg: '#282a36', bgScreen: '#2c2e3a',
    },
    'monokai-pro': {
      name: 'Monokai Pro', type: 'dark',
      primary: '#a9dc76', bright: '#c1e898', dim: 'rgba(169,220,118,0.5)',
      faint: 'rgba(169,220,118,0.08)', bg: '#2d2a2e', bgScreen: '#312e32',
    },
    'nord-aurora': {
      name: 'Nord Aurora', type: 'dark',
      primary: '#88c0d0', bright: '#a3d3e0', dim: 'rgba(136,192,208,0.5)',
      faint: 'rgba(136,192,208,0.08)', bg: '#2e3440', bgScreen: '#323844',
    },
    'tokyo-night': {
      name: 'Tokyo Night', type: 'dark',
      primary: '#7aa2f7', bright: '#9bb5f9', dim: 'rgba(122,162,247,0.5)',
      faint: 'rgba(122,162,247,0.08)', bg: '#1a1b26', bgScreen: '#1e1f2a',
    },
    'synthwave-84': {
      name: 'Synthwave \u201984', type: 'dark',
      primary: '#f97e72', bright: '#fa9a91', dim: 'rgba(249,126,114,0.5)',
      faint: 'rgba(249,126,114,0.08)', bg: '#262335', bgScreen: '#2a2739',
    },
    // â”€â”€ LIGHT THEMES (15) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    'solarized-light': {
      name: 'Solarized Light', type: 'light',
      primary: '#268bd2', bright: '#4da3e0', dim: 'rgba(38,139,210,0.4)',
      faint: 'rgba(38,139,210,0.06)', bg: '#fdf6e3', bgScreen: '#faf3e0',
    },
    'github-light': {
      name: 'GitHub Light', type: 'light',
      primary: '#0969da', bright: '#2b86e5', dim: 'rgba(9,105,218,0.4)',
      faint: 'rgba(9,105,218,0.06)', bg: '#ffffff', bgScreen: '#fafbfc',
    },
    'paper-white': {
      name: 'Paper White', type: 'light',
      primary: '#383a42', bright: '#4e5059', dim: 'rgba(56,58,66,0.4)',
      faint: 'rgba(56,58,66,0.06)', bg: '#fafafa', bgScreen: '#f5f5f5',
    },
    'rose-pine-dawn': {
      name: 'Ros\u00e9 Pine Dawn', type: 'light',
      primary: '#d7827e', bright: '#e09b98', dim: 'rgba(215,130,126,0.4)',
      faint: 'rgba(215,130,126,0.06)', bg: '#faf4ed', bgScreen: '#f7f0e9',
    },
    'catppuccin-latte': {
      name: 'Catppuccin Latte', type: 'light',
      primary: '#8839ef', bright: '#a05cf2', dim: 'rgba(136,57,239,0.4)',
      faint: 'rgba(136,57,239,0.06)', bg: '#eff1f5', bgScreen: '#ebedf1',
    },
    'everforest-light': {
      name: 'Everforest Light', type: 'light',
      primary: '#5da111', bright: '#72b82a', dim: 'rgba(93,161,17,0.4)',
      faint: 'rgba(93,161,17,0.06)', bg: '#fdf6e3', bgScreen: '#f8f1dc',
    },
    'gruvbox-light': {
      name: 'Gruvbox Light', type: 'light',
      primary: '#af3a03', bright: '#c94f1a', dim: 'rgba(175,58,3,0.4)',
      faint: 'rgba(175,58,3,0.06)', bg: '#fbf1c7', bgScreen: '#f6ecc2',
    },
    'tokyo-light': {
      name: 'Tokyo Light', type: 'light',
      primary: '#3760bf', bright: '#5078d0', dim: 'rgba(55,96,191,0.4)',
      faint: 'rgba(55,96,191,0.06)', bg: '#e1e2e7', bgScreen: '#dddee3',
    },
    'ayu-light': {
      name: 'Ayu Light', type: 'light',
      primary: '#e6ba7e', bright: '#edc994', dim: 'rgba(230,186,126,0.45)',
      faint: 'rgba(230,186,126,0.08)', bg: '#fafafa', bgScreen: '#f5f5f5',
    },
    'one-light': {
      name: 'One Light', type: 'light',
      primary: '#4078f2', bright: '#5a8ff5', dim: 'rgba(64,120,242,0.4)',
      faint: 'rgba(64,120,242,0.06)', bg: '#fafafa', bgScreen: '#f5f5f5',
    },
    'material-lighter': {
      name: 'Material Lighter', type: 'light',
      primary: '#39adb5', bright: '#52c0c8', dim: 'rgba(57,173,181,0.4)',
      faint: 'rgba(57,173,181,0.06)', bg: '#fafafa', bgScreen: '#f5f5f5',
    },
    'nord-light': {
      name: 'Nord Light', type: 'light',
      primary: '#5e81ac', bright: '#7694ba', dim: 'rgba(94,129,172,0.4)',
      faint: 'rgba(94,129,172,0.06)', bg: '#eceff4', bgScreen: '#e8ebf0',
    },
    'ivory': {
      name: 'Ivory', type: 'light',
      primary: '#6c6c6c', bright: '#888888', dim: 'rgba(108,108,108,0.4)',
      faint: 'rgba(108,108,108,0.06)', bg: '#fffff0', bgScreen: '#fafae8',
    },
    'horizon-light': {
      name: 'Horizon Light', type: 'light',
      primary: '#da103f', bright: '#e33358', dim: 'rgba(218,16,63,0.4)',
      faint: 'rgba(218,16,63,0.06)', bg: '#fdf0ed', bgScreen: '#f9ece9',
    },
    'night-owl-light': {
      name: 'Night Owl Light', type: 'light',
      primary: '#403f53', bright: '#565569', dim: 'rgba(64,63,83,0.4)',
      faint: 'rgba(64,63,83,0.06)', bg: '#fbfbfb', bgScreen: '#f6f6f6',
    },
    // â”€â”€ DARK THEMES (continued) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    // Real editor / terminal themes
    'catppuccin-mocha': {
      name: 'Catppuccin Mocha', type: 'dark',
      primary: '#cba6f7', bright: '#d7bbf9', dim: 'rgba(203,166,247,0.5)',
      faint: 'rgba(203,166,247,0.08)', bg: '#1e1e2e', bgScreen: '#222236',
    },
    'catppuccin-frappe': {
      name: 'Catppuccin FrappÃ©', type: 'dark',
      primary: '#ca9ee6', bright: '#d5b1ec', dim: 'rgba(202,158,230,0.5)',
      faint: 'rgba(202,158,230,0.08)', bg: '#303446', bgScreen: '#34384a',
    },
    'catppuccin-macchiato': {
      name: 'Catppuccin Macchiato', type: 'dark',
      primary: '#c6a0f6', bright: '#d2b3f8', dim: 'rgba(198,160,246,0.5)',
      faint: 'rgba(198,160,246,0.08)', bg: '#24273a', bgScreen: '#282b3e',
    },
    'gruvbox-dark': {
      name: 'Gruvbox Dark', type: 'dark',
      primary: '#fe8019', bright: '#fe9a3f', dim: 'rgba(254,128,25,0.5)',
      faint: 'rgba(254,128,25,0.08)', bg: '#282828', bgScreen: '#2c2c2c',
    },
    'solarized-dark': {
      name: 'Solarized Dark', type: 'dark',
      primary: '#268bd2', bright: '#4ca2e0', dim: 'rgba(38,139,210,0.5)',
      faint: 'rgba(38,139,210,0.08)', bg: '#002b36', bgScreen: '#073642',
    },
    'everforest-dark': {
      name: 'Everforest Dark', type: 'dark',
      primary: '#a7c080', bright: '#b9cf98', dim: 'rgba(167,192,128,0.5)',
      faint: 'rgba(167,192,128,0.08)', bg: '#2d353b', bgScreen: '#31393f',
    },
    'rose-pine': {
      name: 'RosÃ© Pine', type: 'dark',
      primary: '#ebbcba', bright: '#f0ccc9', dim: 'rgba(235,188,186,0.5)',
      faint: 'rgba(235,188,186,0.08)', bg: '#191724', bgScreen: '#1d1b28',
    },
    'rose-pine-moon': {
      name: 'RosÃ© Pine Moon', type: 'dark',
      primary: '#ea9a97', bright: '#efb0ae', dim: 'rgba(234,154,151,0.5)',
      faint: 'rgba(234,154,151,0.08)', bg: '#232136', bgScreen: '#27253a',
    },
    'kanagawa': {
      name: 'Kanagawa', type: 'dark',
      primary: '#7e9cd8', bright: '#98b0e2', dim: 'rgba(126,156,216,0.5)',
      faint: 'rgba(126,156,216,0.08)', bg: '#1f1f28', bgScreen: '#23232c',
    },
    'night-owl': {
      name: 'Night Owl', type: 'dark',
      primary: '#82aaff', bright: '#9dbfff', dim: 'rgba(130,170,255,0.5)',
      faint: 'rgba(130,170,255,0.08)', bg: '#011627', bgScreen: '#051b2c',
    },
    'material-ocean': {
      name: 'Material Ocean', type: 'dark',
      primary: '#89ddff', bright: '#a3e5ff', dim: 'rgba(137,221,255,0.5)',
      faint: 'rgba(137,221,255,0.08)', bg: '#0f111a', bgScreen: '#13151e',
    },
    'material-darker': {
      name: 'Material Darker', type: 'dark',
      primary: '#82aaff', bright: '#9dbfff', dim: 'rgba(130,170,255,0.5)',
      faint: 'rgba(130,170,255,0.08)', bg: '#212121', bgScreen: '#252525',
    },
    'material-palenight': {
      name: 'Material Palenight', type: 'dark',
      primary: '#c792ea', bright: '#d4a8f0', dim: 'rgba(199,146,234,0.5)',
      faint: 'rgba(199,146,234,0.08)', bg: '#292d3e', bgScreen: '#2d3142',
    },
    'cobalt2': {
      name: 'Cobalt2', type: 'dark',
      primary: '#ffc600', bright: '#ffd23a', dim: 'rgba(255,198,0,0.5)',
      faint: 'rgba(255,198,0,0.08)', bg: '#193549', bgScreen: '#1d394d',
    },
    'horizon-dark': {
      name: 'Horizon Dark', type: 'dark',
      primary: '#e95678', bright: '#ee7a95', dim: 'rgba(233,86,120,0.5)',
      faint: 'rgba(233,86,120,0.08)', bg: '#1c1e26', bgScreen: '#20222a',
    },
    'ayu-dark': {
      name: 'Ayu Dark', type: 'dark',
      primary: '#e6b450', bright: '#ecc46f', dim: 'rgba(230,180,80,0.5)',
      faint: 'rgba(230,180,80,0.08)', bg: '#0a0e14', bgScreen: '#0e1218',
    },
    'ayu-mirage': {
      name: 'Ayu Mirage', type: 'dark',
      primary: '#ffcc66', bright: '#ffd780', dim: 'rgba(255,204,102,0.5)',
      faint: 'rgba(255,204,102,0.08)', bg: '#1f2430', bgScreen: '#232834',
    },
    'github-dark': {
      name: 'GitHub Dark', type: 'dark',
      primary: '#79c0ff', bright: '#96cfff', dim: 'rgba(121,192,255,0.5)',
      faint: 'rgba(121,192,255,0.08)', bg: '#0d1117', bgScreen: '#11151b',
    },
    'vitesse-dark': {
      name: 'Vitesse Dark', type: 'dark',
      primary: '#4d9375', bright: '#6aab8f', dim: 'rgba(77,147,117,0.5)',
      faint: 'rgba(77,147,117,0.08)', bg: '#121212', bgScreen: '#161616',
    },
    'poimandres': {
      name: 'Poimandres', type: 'dark',
      primary: '#5de4c7', bright: '#7aecd5', dim: 'rgba(93,228,199,0.5)',
      faint: 'rgba(93,228,199,0.08)', bg: '#1b1e28', bgScreen: '#1f222c',
    },
    'andromeda': {
      name: 'Andromeda', type: 'dark',
      primary: '#c74ded', bright: '#d370f1', dim: 'rgba(199,77,237,0.5)',
      faint: 'rgba(199,77,237,0.08)', bg: '#23262e', bgScreen: '#272a32',
    },
    'moonlight': {
      name: 'Moonlight', type: 'dark',
      primary: '#c099ff', bright: '#cfb3ff', dim: 'rgba(192,153,255,0.5)',
      faint: 'rgba(192,153,255,0.08)', bg: '#222436', bgScreen: '#26283a',
    },
    'one-dark': {
      name: 'One Dark', type: 'dark',
      primary: '#61afef', bright: '#7ec0f3', dim: 'rgba(97,175,239,0.5)',
      faint: 'rgba(97,175,239,0.08)', bg: '#282c34', bgScreen: '#2c3038',
    },
    // Creative / CRT themes
    'cyberpunk': {
      name: 'Cyberpunk', type: 'dark',
      primary: '#00ff9f', bright: '#33ffb5', dim: 'rgba(0,255,159,0.5)',
      faint: 'rgba(0,255,159,0.08)', bg: '#0c0c1d', bgScreen: '#101021',
    },
    'vaporwave': {
      name: 'Vaporwave', type: 'dark',
      primary: '#ff71ce', bright: '#ff94da', dim: 'rgba(255,113,206,0.5)',
      faint: 'rgba(255,113,206,0.08)', bg: '#1a0a2e', bgScreen: '#1e0e32',
    },
    'retrowave': {
      name: 'Retrowave', type: 'dark',
      primary: '#ff6c11', bright: '#ff8a42', dim: 'rgba(255,108,17,0.5)',
      faint: 'rgba(255,108,17,0.08)', bg: '#1a1a2e', bgScreen: '#1e1e32',
    },
    'matrix': {
      name: 'Matrix', type: 'dark',
      primary: '#00ff00', bright: '#33ff33', dim: 'rgba(0,255,0,0.5)',
      faint: 'rgba(0,255,0,0.08)', bg: '#000000', bgScreen: '#030303',
    },
    'tron': {
      name: 'Tron', type: 'dark',
      primary: '#6fc3df', bright: '#8fd1e8', dim: 'rgba(111,195,223,0.5)',
      faint: 'rgba(111,195,223,0.08)', bg: '#0c141f', bgScreen: '#101823',
    },
    'outrun': {
      name: 'Outrun', type: 'dark',
      primary: '#ff1493', bright: '#ff43ac', dim: 'rgba(255,20,147,0.5)',
      faint: 'rgba(255,20,147,0.08)', bg: '#0d0221', bgScreen: '#110625',
    },
    'laserwave': {
      name: 'Laserwave', type: 'dark',
      primary: '#b381c5', bright: '#c49ad3', dim: 'rgba(179,129,197,0.5)',
      faint: 'rgba(179,129,197,0.08)', bg: '#27212e', bgScreen: '#2b2532',
    },
    'forest': {
      name: 'Forest', type: 'dark',
      primary: '#4ec930', bright: '#6ed652', dim: 'rgba(78,201,48,0.5)',
      faint: 'rgba(78,201,48,0.08)', bg: '#0a150a', bgScreen: '#0e190e',
    },
    'ocean-deep': {
      name: 'Ocean Deep', type: 'dark',
      primary: '#0077be', bright: '#1a8fd4', dim: 'rgba(0,119,190,0.5)',
      faint: 'rgba(0,119,190,0.08)', bg: '#020c1a', bgScreen: '#06101e',
    },
    'deep-space': {
      name: 'Deep Space', type: 'dark',
      primary: '#8b5cf6', bright: '#a37af8', dim: 'rgba(139,92,246,0.5)',
      faint: 'rgba(139,92,246,0.08)', bg: '#09090f', bgScreen: '#0d0d13',
    },
    'sakura': {
      name: 'Sakura', type: 'dark',
      primary: '#ffb7c5', bright: '#ffc9d4', dim: 'rgba(255,183,197,0.5)',
      faint: 'rgba(255,183,197,0.08)', bg: '#1a1018', bgScreen: '#1e141c',
    },
    'copper-oxide': {
      name: 'Copper Oxide', type: 'dark',
      primary: '#2dd4bf', bright: '#52dece', dim: 'rgba(45,212,191,0.5)',
      faint: 'rgba(45,212,191,0.08)', bg: '#0a1410', bgScreen: '#0e1814',
    },
    'electric-violet': {
      name: 'Electric Violet', type: 'dark',
      primary: '#bf5af2', bright: '#cc7bf5', dim: 'rgba(191,90,242,0.5)',
      faint: 'rgba(191,90,242,0.08)', bg: '#150a20', bgScreen: '#190e24',
    },
    // â”€â”€ LIGHT THEMES (continued) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    'vitesse-light': {
      name: 'Vitesse Light', type: 'light',
      primary: '#393a34', bright: '#53544e', dim: 'rgba(57,58,52,0.4)',
      faint: 'rgba(57,58,52,0.06)', bg: '#ffffff', bgScreen: '#fafafa',
    },
    'slack-morning': {
      name: 'Slack Morning', type: 'light',
      primary: '#1264a3', bright: '#2b7dbc', dim: 'rgba(18,100,163,0.4)',
      faint: 'rgba(18,100,163,0.06)', bg: '#ffffff', bgScreen: '#f8f8f8',
    },
    'sepia': {
      name: 'Sepia', type: 'light',
      primary: '#5b4636', bright: '#74604f', dim: 'rgba(91,70,54,0.4)',
      faint: 'rgba(91,70,54,0.06)', bg: '#f1e7d0', bgScreen: '#ede3cc',
    },
    'pencil-light': {
      name: 'Pencil Light', type: 'light',
      primary: '#20a5ba', bright: '#3db8cc', dim: 'rgba(32,165,186,0.4)',
      faint: 'rgba(32,165,186,0.06)', bg: '#f1f1f1', bgScreen: '#ececec',
    },
    'quiet-light': {
      name: 'Quiet Light', type: 'light',
      primary: '#4b69c6', bright: '#6580d4', dim: 'rgba(75,105,198,0.4)',
      faint: 'rgba(75,105,198,0.06)', bg: '#f5f5f5', bgScreen: '#f0f0f0',
    },
    'min-light': {
      name: 'Min Light', type: 'light',
      primary: '#1b1b1b', bright: '#383838', dim: 'rgba(27,27,27,0.4)',
      faint: 'rgba(27,27,27,0.06)', bg: '#ffffff', bgScreen: '#fafafa',
    },
    'atom-light': {
      name: 'Atom Light', type: 'light',
      primary: '#0184bc', bright: '#1a9dd5', dim: 'rgba(1,132,188,0.4)',
      faint: 'rgba(1,132,188,0.06)', bg: '#fafafa', bgScreen: '#f5f5f5',
    },
    'intellij-light': {
      name: 'IntelliJ Light', type: 'light',
      primary: '#0033b3', bright: '#1a4dc6', dim: 'rgba(0,51,179,0.4)',
      faint: 'rgba(0,51,179,0.06)', bg: '#ffffff', bgScreen: '#f5f5f5',
    },
    'xcode-light': {
      name: 'Xcode Light', type: 'light',
      primary: '#0b4f79', bright: '#246892', dim: 'rgba(11,79,121,0.4)',
      faint: 'rgba(11,79,121,0.06)', bg: '#ffffff', bgScreen: '#f9f9f9',
    },
    'fleet-light': {
      name: 'Fleet Light', type: 'light',
      primary: '#1a7f37', bright: '#339850', dim: 'rgba(26,127,55,0.4)',
      faint: 'rgba(26,127,55,0.06)', bg: '#ffffff', bgScreen: '#f6f8fa',
    },
    'zed-light': {
      name: 'Zed Light', type: 'light',
      primary: '#5746af', bright: '#7060c2', dim: 'rgba(87,70,175,0.4)',
      faint: 'rgba(87,70,175,0.06)', bg: '#f2f2f2', bgScreen: '#ededee',
    },
    'helix-light': {
      name: 'Helix Light', type: 'light',
      primary: '#b07d48', bright: '#c39661', dim: 'rgba(176,125,72,0.4)',
      faint: 'rgba(176,125,72,0.06)', bg: '#fafafa', bgScreen: '#f5f5f5',
    },
    'cream': {
      name: 'Cream', type: 'light',
      primary: '#705d56', bright: '#8a7770', dim: 'rgba(112,93,86,0.4)',
      faint: 'rgba(112,93,86,0.06)', bg: '#fefcf5', bgScreen: '#fbf9f2',
    },
    'mint-fresh': {
      name: 'Mint Fresh', type: 'light',
      primary: '#0d7c66', bright: '#26957f', dim: 'rgba(13,124,102,0.4)',
      faint: 'rgba(13,124,102,0.06)', bg: '#f0faf5', bgScreen: '#ecf6f1',
    },
    'lavender-mist': {
      name: 'Lavender Mist', type: 'light',
      primary: '#7c3aed', bright: '#9560f1', dim: 'rgba(124,58,237,0.4)',
      faint: 'rgba(124,58,237,0.06)', bg: '#f8f5ff', bgScreen: '#f4f1fb',
    },
    'peach-blossom': {
      name: 'Peach Blossom', type: 'light',
      primary: '#c2410c', bright: '#db5a25', dim: 'rgba(194,65,12,0.4)',
      faint: 'rgba(194,65,12,0.06)', bg: '#fff7ed', bgScreen: '#fbf3e9',
    },
    'sand-dune': {
      name: 'Sand Dune', type: 'light',
      primary: '#92683c', bright: '#ab8155', dim: 'rgba(146,104,60,0.4)',
      faint: 'rgba(146,104,60,0.06)', bg: '#f5ecd7', bgScreen: '#f1e8d3',
    },
    'snowfall': {
      name: 'Snowfall', type: 'light',
      primary: '#4a6fa5', bright: '#6389be', dim: 'rgba(74,111,165,0.4)',
      faint: 'rgba(74,111,165,0.06)', bg: '#fbfcfe', bgScreen: '#f6f7fa',
    },
    'morning-dew': {
      name: 'Morning Dew', type: 'light',
      primary: '#2563eb', bright: '#3e7cf0', dim: 'rgba(37,99,235,0.4)',
      faint: 'rgba(37,99,235,0.06)', bg: '#f8fafc', bgScreen: '#f4f6f8',
    },
    'soft-sky': {
      name: 'Soft Sky', type: 'light',
      primary: '#3b82f6', bright: '#5496f8', dim: 'rgba(59,130,246,0.4)',
      faint: 'rgba(59,130,246,0.06)', bg: '#eff6ff', bgScreen: '#ebf2fb',
    },
    'warm-stone': {
      name: 'Warm Stone', type: 'light',
      primary: '#57534e', bright: '#706c67', dim: 'rgba(87,83,78,0.4)',
      faint: 'rgba(87,83,78,0.06)', bg: '#f5f5f4', bgScreen: '#f0f0ef',
    },
    'sage-garden': {
      name: 'Sage Garden', type: 'light',
      primary: '#16a34a', bright: '#2fbc63', dim: 'rgba(22,163,74,0.4)',
      faint: 'rgba(22,163,74,0.06)', bg: '#f0fdf4', bgScreen: '#ecf9f0',
    },
    'coral-reef': {
      name: 'Coral Reef', type: 'light',
      primary: '#ec4899', bright: '#f06ab2', dim: 'rgba(236,72,153,0.4)',
      faint: 'rgba(236,72,153,0.06)', bg: '#fdf2f8', bgScreen: '#f9eef4',
    },
    'parchment': {
      name: 'Parchment', type: 'light',
      primary: '#78350f', bright: '#914e28', dim: 'rgba(120,53,15,0.4)',
      faint: 'rgba(120,53,15,0.06)', bg: '#fef3c7', bgScreen: '#faefc3',
    },
    'spring-meadow': {
      name: 'Spring Meadow', type: 'light',
      primary: '#059669', bright: '#1eaf82', dim: 'rgba(5,150,105,0.4)',
      faint: 'rgba(5,150,105,0.06)', bg: '#ecfdf5', bgScreen: '#e8f9f1',
    },
    // â”€â”€ LIGHT THEMES (new) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    'bamboo-light': {
      name: 'Bamboo Light', type: 'light',
      primary: '#2e7d32', bright: '#43a047', dim: 'rgba(46,125,50,0.4)',
      faint: 'rgba(46,125,50,0.06)', bg: '#f1f8e9', bgScreen: '#edf5e5',
    },
    'terracotta': {
      name: 'Terracotta', type: 'light',
      primary: '#a0522d', bright: '#b8693f', dim: 'rgba(160,82,45,0.4)',
      faint: 'rgba(160,82,45,0.06)', bg: '#fbe9e0', bgScreen: '#f7e5dc',
    },
    'ocean-breeze': {
      name: 'Ocean Breeze', type: 'light',
      primary: '#0277bd', bright: '#0288d1', dim: 'rgba(2,119,189,0.4)',
      faint: 'rgba(2,119,189,0.06)', bg: '#e1f5fe', bgScreen: '#ddf1fa',
    },
    'lilac-dream': {
      name: 'Lilac Dream', type: 'light',
      primary: '#7b1fa2', bright: '#9c27b0', dim: 'rgba(123,31,162,0.4)',
      faint: 'rgba(123,31,162,0.06)', bg: '#f3e5f5', bgScreen: '#efe1f1',
    },
    'golden-hour': {
      name: 'Golden Hour', type: 'light',
      primary: '#e65100', bright: '#ef6c00', dim: 'rgba(230,81,0,0.4)',
      faint: 'rgba(230,81,0,0.06)', bg: '#fff3e0', bgScreen: '#fbefdc',
    },
    'olive-grove': {
      name: 'Olive Grove', type: 'light',
      primary: '#558b2f', bright: '#689f38', dim: 'rgba(85,139,47,0.4)',
      faint: 'rgba(85,139,47,0.06)', bg: '#f9fbe7', bgScreen: '#f5f7e3',
    },
    'rose-quartz': {
      name: 'Rose Quartz', type: 'light',
      primary: '#ad1457', bright: '#c2185b', dim: 'rgba(173,20,87,0.4)',
      faint: 'rgba(173,20,87,0.06)', bg: '#fce4ec', bgScreen: '#f8e0e8',
    },
    'frost-white': {
      name: 'Frost White', type: 'light',
      primary: '#455a64', bright: '#546e7a', dim: 'rgba(69,90,100,0.4)',
      faint: 'rgba(69,90,100,0.06)', bg: '#eceff1', bgScreen: '#e8ebed',
    },
    'maple-leaf': {
      name: 'Maple Leaf', type: 'light',
      primary: '#bf360c', bright: '#d84315', dim: 'rgba(191,54,12,0.4)',
      faint: 'rgba(191,54,12,0.06)', bg: '#fbe9e7', bgScreen: '#f7e5e3',
    },
    'celestial-blue': {
      name: 'Celestial Blue', type: 'light',
      primary: '#1565c0', bright: '#1976d2', dim: 'rgba(21,101,192,0.4)',
      faint: 'rgba(21,101,192,0.06)', bg: '#e3f2fd', bgScreen: '#dfeef9',
    },
    // â”€â”€ ANIMATED THEMES (25) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    'anim-pulse': {
      name: 'Pulse', type: 'animated',
      primary: '#00ff41', bright: '#39ff14', dim: 'rgba(0,255,65,0.5)',
      faint: 'rgba(0,255,65,0.08)', bg: '#050505', bgScreen: '#070707',
      animClass: 'anim-pulse',
    },
    'anim-rainbow': {
      name: 'Rainbow Cycle', type: 'animated',
      primary: '#ff0080', bright: '#ff33a0', dim: 'rgba(255,0,128,0.5)',
      faint: 'rgba(255,0,128,0.08)', bg: '#0a0a0a', bgScreen: '#0e0e0e',
      animClass: 'anim-rainbow',
    },
    'anim-neon-pulse': {
      name: 'Neon Pulse', type: 'animated',
      primary: '#ff2975', bright: '#ff5c99', dim: 'rgba(255,41,117,0.5)',
      faint: 'rgba(255,41,117,0.08)', bg: '#0a0010', bgScreen: '#0e0014',
      animClass: 'anim-neon-pulse',
    },
    'anim-aurora': {
      name: 'Aurora Borealis', type: 'animated',
      primary: '#00e5a0', bright: '#33edb6', dim: 'rgba(0,229,160,0.5)',
      faint: 'rgba(0,229,160,0.08)', bg: '#040e0a', bgScreen: '#08120e',
      animClass: 'anim-aurora',
    },
    'anim-fire-dance': {
      name: 'Fire Dance', type: 'animated',
      primary: '#ff6600', bright: '#ff8533', dim: 'rgba(255,102,0,0.5)',
      faint: 'rgba(255,102,0,0.08)', bg: '#0e0500', bgScreen: '#120904',
      animClass: 'anim-fire-dance',
    },
    'anim-ocean-wave': {
      name: 'Ocean Wave', type: 'animated',
      primary: '#0088cc', bright: '#1a9fe0', dim: 'rgba(0,136,204,0.5)',
      faint: 'rgba(0,136,204,0.08)', bg: '#020810', bgScreen: '#060c14',
      animClass: 'anim-ocean-wave',
    },
    'anim-synthwave': {
      name: 'Synthwave Pulse', type: 'animated',
      primary: '#e040fb', bright: '#e866fc', dim: 'rgba(224,64,251,0.5)',
      faint: 'rgba(224,64,251,0.08)', bg: '#12001a', bgScreen: '#16041e',
      animClass: 'anim-synthwave',
    },
    'anim-heartbeat': {
      name: 'Heartbeat', type: 'animated',
      primary: '#ff1744', bright: '#ff4569', dim: 'rgba(255,23,68,0.5)',
      faint: 'rgba(255,23,68,0.08)', bg: '#0e0004', bgScreen: '#120408',
      animClass: 'anim-heartbeat',
    },
    'anim-breathing': {
      name: 'Breathing', type: 'animated',
      primary: '#00bcd4', bright: '#26c6da', dim: 'rgba(0,188,212,0.5)',
      faint: 'rgba(0,188,212,0.08)', bg: '#001214', bgScreen: '#041618',
      animClass: 'anim-breathing',
    },
    'anim-glitch-storm': {
      name: 'Glitch Storm', type: 'animated',
      primary: '#76ff03', bright: '#91ff35', dim: 'rgba(118,255,3,0.5)',
      faint: 'rgba(118,255,3,0.08)', bg: '#050a00', bgScreen: '#090e04',
      animClass: 'anim-glitch-storm',
    },
    'anim-ember': {
      name: 'Ember Glow', type: 'animated',
      primary: '#ff5722', bright: '#ff7043', dim: 'rgba(255,87,34,0.5)',
      faint: 'rgba(255,87,34,0.08)', bg: '#0e0800', bgScreen: '#120c04',
      animClass: 'anim-ember',
    },
    'anim-ice-shimmer': {
      name: 'Ice Shimmer', type: 'animated',
      primary: '#80deea', bright: '#99e5ef', dim: 'rgba(128,222,234,0.5)',
      faint: 'rgba(128,222,234,0.08)', bg: '#001418', bgScreen: '#04181c',
      animClass: 'anim-ice-shimmer',
    },
    'anim-disco': {
      name: 'Disco Fever', type: 'animated',
      primary: '#d500f9', bright: '#df33fa', dim: 'rgba(213,0,249,0.5)',
      faint: 'rgba(213,0,249,0.08)', bg: '#0a0012', bgScreen: '#0e0416',
      animClass: 'anim-disco',
    },
    'anim-lava': {
      name: 'Lava Flow', type: 'animated',
      primary: '#dd2c00', bright: '#e44e1a', dim: 'rgba(221,44,0,0.5)',
      faint: 'rgba(221,44,0,0.08)', bg: '#100200', bgScreen: '#140604',
      animClass: 'anim-lava',
    },
    'anim-thunder': {
      name: 'Thunderstorm', type: 'animated',
      primary: '#b0bec5', bright: '#cfd8dc', dim: 'rgba(176,190,197,0.5)',
      faint: 'rgba(176,190,197,0.08)', bg: '#0a0e12', bgScreen: '#0e1216',
      animClass: 'anim-thunder',
    },
    'anim-haunted': {
      name: 'Haunted', type: 'animated',
      primary: '#66bb6a', bright: '#81c784', dim: 'rgba(102,187,106,0.5)',
      faint: 'rgba(102,187,106,0.08)', bg: '#020a02', bgScreen: '#060e06',
      animClass: 'anim-haunted',
    },
    'anim-neon-city': {
      name: 'Neon City', type: 'animated',
      primary: '#00e5ff', bright: '#33ebff', dim: 'rgba(0,229,255,0.5)',
      faint: 'rgba(0,229,255,0.08)', bg: '#0a001a', bgScreen: '#0e041e',
      animClass: 'anim-neon-city',
    },
    'anim-solar-flare': {
      name: 'Solar Flare', type: 'animated',
      primary: '#ffd600', bright: '#ffde33', dim: 'rgba(255,214,0,0.5)',
      faint: 'rgba(255,214,0,0.08)', bg: '#0e0c00', bgScreen: '#121004',
      animClass: 'anim-solar-flare',
    },
    'anim-deep-pulse': {
      name: 'Deep Pulse', type: 'animated',
      primary: '#304ffe', bright: '#536dfe', dim: 'rgba(48,79,254,0.5)',
      faint: 'rgba(48,79,254,0.08)', bg: '#000414', bgScreen: '#040818',
      animClass: 'anim-deep-pulse',
    },
    'anim-vapor-shift': {
      name: 'Vapor Shift', type: 'animated',
      primary: '#ff80ab', bright: '#ff99be', dim: 'rgba(255,128,171,0.5)',
      faint: 'rgba(255,128,171,0.08)', bg: '#100818', bgScreen: '#140c1c',
      animClass: 'anim-vapor-shift',
    },
    'anim-starfield': {
      name: 'Starfield', type: 'animated',
      primary: '#e0e0e0', bright: '#f5f5f5', dim: 'rgba(224,224,224,0.5)',
      faint: 'rgba(224,224,224,0.08)', bg: '#000005', bgScreen: '#040409',
      animClass: 'anim-starfield',
    },
    'anim-acid': {
      name: 'Acid Trip', type: 'animated',
      primary: '#aeea00', bright: '#c0ef33', dim: 'rgba(174,234,0,0.5)',
      faint: 'rgba(174,234,0,0.08)', bg: '#0a0e00', bgScreen: '#0e1204',
      animClass: 'anim-acid',
    },
    'anim-plasma': {
      name: 'Plasma Burn', type: 'animated',
      primary: '#aa00ff', bright: '#bb33ff', dim: 'rgba(170,0,255,0.5)',
      faint: 'rgba(170,0,255,0.08)', bg: '#0a0014', bgScreen: '#0e0418',
      animClass: 'anim-plasma',
    },
    'anim-hyper': {
      name: 'Hyper Blink', type: 'animated',
      primary: '#00ffd5', bright: '#33ffe0', dim: 'rgba(0,255,213,0.5)',
      faint: 'rgba(0,255,213,0.08)', bg: '#001210', bgScreen: '#041614',
      animClass: 'anim-hyper',
    },
    'anim-dream': {
      name: 'Dreamy Fade', type: 'animated',
      primary: '#ce93d8', bright: '#d9a9e0', dim: 'rgba(206,147,216,0.5)',
      faint: 'rgba(206,147,216,0.08)', bg: '#0e081a', bgScreen: '#120c1e',
      animClass: 'anim-dream',
    },
  };

  let currentTheme = 'green-phosphor';

  // ================================================================
  //  BADGE STYLE SYSTEM
  // ================================================================
  const BADGE_STYLES = {
    'default': { name: 'Default', desc: 'Bordered with text glow' },
    'pill': { name: 'Pill', desc: 'Rounded capsule with subtle fill' },
    'filled': { name: 'Filled', desc: 'Solid background, bright text' },
    'flat': { name: 'Flat', desc: 'Bold solid blocks, Adobe-inspired' },
    'holo': { name: 'Holo', desc: 'Holographic shimmer effect' },
  };
  let currentBadgeStyle = 'default';

  function setBadgeStyle(id) {
    if (!BADGE_STYLES[id]) return false;
    currentBadgeStyle = id;
    var el = document.getElementById('output');
    if (el) {
      el.classList.remove('badge-style-pill', 'badge-style-filled', 'badge-style-flat', 'badge-style-holo');
      if (id !== 'default') el.classList.add('badge-style-' + id);
    }
    try { localStorage.setItem('vaporsoft-badge-style', id); } catch (e) { }
    return true;
  }

  // ================================================================
  //  PROMPT STYLE SYSTEM
  // ================================================================
  const PROMPTS = {
    'dual-line': {
      name: 'Dual Line',
      desc: 'Oh-My-Posh inspired two-line prompt',
      render() {
        return (
          '<span class="p-bracket">\u250c\u2500\u2500(</span>' +
          '<span class="p-user">' + CFG.user + '</span>' +
          '<span class="p-at">@</span>' +
          '<span class="p-host">' + CFG.host + '</span>' +
          '<span class="p-bracket">)\u2500[</span>' +
          '<span class="p-dir">' + S.cwd + '</span>' +
          '<span class="p-bracket">]</span>\n' +
          '<span class="p-bracket">\u2514\u2500</span>' +
          '<span class="p-dollar">$ </span>'
        );
      }
    },
    'powerline': {
      name: 'Powerline',
      desc: 'Classic Powerline with arrow segments',
      render() {
        return (
          '<span class="pl-seg pl-seg-user">' + NF.user + ' ' + CFG.user + ' </span>' +
          '<span class="pl-arrow pl-arrow-user-host">\uE0B0</span>' +
          '<span class="pl-seg pl-seg-host">' + NF.globe + ' ' + CFG.host + ' </span>' +
          '<span class="pl-arrow pl-arrow-host-dir">\uE0B0</span>' +
          '<span class="pl-seg pl-seg-dir">' + NF.folder + ' ' + S.cwd + ' </span>' +
          '<span class="pl-arrow pl-arrow-dir-end">\uE0B0</span>' +
          '<span class="p-dollar"> $ </span>'
        );
      }
    },
    'minimal': {
      name: 'Minimal',
      desc: 'Clean single-character prompt',
      render() {
        return (
          '<span class="p-dir">' + S.cwd + '</span>' +
          '<span class="p-minimal-sep"> \u203A </span>'
        );
      }
    },
    'classic': {
      name: 'Classic',
      desc: 'Traditional user@host:~$ format',
      render() {
        return (
          '<span class="p-user">' + CFG.user + '</span>' +
          '<span class="p-at">@</span>' +
          '<span class="p-host">' + CFG.host + '</span>' +
          '<span class="p-classic-colon">:</span>' +
          '<span class="p-dir">' + S.cwd + '</span>' +
          '<span class="p-dollar">$ </span>'
        );
      }
    },
    'arrow': {
      name: 'Arrow',
      desc: 'ZSH arrow-style prompt',
      render() {
        return (
          '<span class="p-arrow-icon">\u279C</span> ' +
          '<span class="p-dir">' + S.cwd + '</span>' +
          '<span class="p-arrow-sep"> </span>'
        );
      }
    },
    'lambda': {
      name: 'Lambda',
      desc: 'Functional lambda symbol prompt',
      render() {
        return (
          '<span class="p-lambda">\u03BB</span>' +
          '<span class="p-lambda-dot"> \u00B7 </span>' +
          '<span class="p-dir">' + S.cwd + '</span>' +
          '<span class="p-lambda-sep"> \u203A </span>'
        );
      }
    },
    'starship': {
      name: 'Starship',
      desc: 'Starship-inspired with icons',
      render() {
        return (
          '<span class="p-star-dir">' + NF.folder + ' ' + S.cwd + '</span>' +
          '<span class="p-star-via"> via </span>' +
          '<span class="p-star-lang">' + NF.code + ' ES2026</span>' +
          '<span class="p-star-time"> ' + NF.clock + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + '</span>\n' +
          '<span class="p-star-char">\u276F </span>'
        );
      }
    },
    'hacker': {
      name: 'Hacker',
      desc: 'Matrix-style dark root prompt',
      render() {
        return (
          '<span class="p-hack-bracket">[</span>' +
          '<span class="p-hack-user">' + CFG.user + '</span>' +
          '<span class="p-hack-at">@</span>' +
          '<span class="p-hack-host">' + CFG.host + '</span>' +
          '<span class="p-hack-bracket">]</span>' +
          '<span class="p-hack-dir">-[' + S.cwd + ']</span>' +
          '<span class="p-hack-end">~# </span>'
        );
      }
    },
    'retro': {
      name: 'Retro DOS',
      desc: 'Classic DOS-style C:\\ prompt',
      render() {
        var dosPath = S.cwd.replace(/\//g, '\\').replace('~', 'C:\\VAPOR');
        return (
          '<span class="p-retro-path">' + dosPath + '</span>' +
          '<span class="p-retro-gt">&gt;</span>'
        );
      }
    },
    'blocks': {
      name: 'Blocks',
      desc: 'Unicode block segment prompt',
      render() {
        return (
          '<span class="p-block-l">\u2590</span>' +
          '<span class="p-block-user">' + CFG.user + '</span>' +
          '<span class="p-block-mid">\u2502</span>' +
          '<span class="p-block-dir">' + S.cwd + '</span>' +
          '<span class="p-block-r">\u258C</span>' +
          '<span class="p-dollar"> $ </span>'
        );
      }
    },
    // â”€â”€ STATIC PROMPTS (10 more) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    'fish': {
      name: 'Fish Shell',
      desc: 'Fish shell inspired prompt',
      render() {
        return (
          '<span class="p-fish-user">' + CFG.user + '</span>' +
          '<span class="p-fish-at">@</span>' +
          '<span class="p-fish-host">' + CFG.host + '</span> ' +
          '<span class="p-dir">' + S.cwd + '</span>' +
          '<span class="p-fish-gt"> > </span>'
        );
      }
    },
    'git-status': {
      name: 'Git Status',
      desc: 'Prompt with decorative git branch',
      render() {
        return (
          '<span class="p-git-branch">' + NF.gitBranch + ' main</span> ' +
          '<span class="p-dir">' + S.cwd + '</span>' +
          '<span class="p-dollar"> $ </span>'
        );
      }
    },
    'double-arrow': {
      name: 'Double Arrow',
      desc: 'Double chevron \u00BB prompt',
      render() {
        return (
          '<span class="p-dir">' + S.cwd + '</span>' +
          '<span class="p-dbl-arrow"> \u00BB </span>'
        );
      }
    },
    'brackets': {
      name: 'Brackets',
      desc: 'Bracketed [user:dir]> style',
      render() {
        return (
          '<span class="p-brk-l">[</span>' +
          '<span class="p-user">' + CFG.user + '</span>' +
          '<span class="p-brk-colon">:</span>' +
          '<span class="p-dir">' + S.cwd + '</span>' +
          '<span class="p-brk-r">]</span>' +
          '<span class="p-brk-gt">> </span>'
        );
      }
    },
    'tilde': {
      name: 'Tilde',
      desc: 'Tilde wave ~~> style',
      render() {
        return (
          '<span class="p-user">' + CFG.user + '</span>' +
          '<span class="p-tilde-wave"> ~~> </span>'
        );
      }
    },
    'pipe': {
      name: 'Pipe',
      desc: 'Pipe-separated user|dir$ style',
      render() {
        return (
          '<span class="p-user">' + CFG.user + '</span>' +
          '<span class="p-pipe-sep">|</span>' +
          '<span class="p-dir">' + S.cwd + '</span>' +
          '<span class="p-dollar">$ </span>'
        );
      }
    },
    'diamond': {
      name: 'Diamond',
      desc: 'Diamond symbol \u25C6 prompt',
      render() {
        return (
          '<span class="p-diamond-icon">\u25C6</span> ' +
          '<span class="p-dir">' + S.cwd + '</span>' +
          '<span class="p-minimal-sep"> \u203A </span>'
        );
      }
    },
    'dots': {
      name: 'Dots',
      desc: 'Dotted \u00B7\u00B7\u00B7dir \u25B8 style',
      render() {
        return (
          '<span class="p-dots-prefix">\u00B7\u00B7\u00B7</span>' +
          '<span class="p-dir">' + S.cwd + '</span>' +
          '<span class="p-dots-arrow"> \u25B8 </span>'
        );
      }
    },
    'slash': {
      name: 'Slash',
      desc: 'Forward slash /dir/ prompt',
      render() {
        return (
          '<span class="p-slash-mark">/</span>' +
          '<span class="p-dir">' + S.cwd + '</span>' +
          '<span class="p-slash-mark">/</span>' +
          '<span class="p-dollar"> $ </span>'
        );
      }
    },
    'wave': {
      name: 'Wave',
      desc: 'Wavy \u2248 dir \u226B prompt',
      render() {
        return (
          '<span class="p-wave-icon">\u2248</span> ' +
          '<span class="p-dir">' + S.cwd + '</span>' +
          '<span class="p-wave-arrow"> \u226B </span>'
        );
      }
    },
    // â”€â”€ ANIMATED PROMPTS (10) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    'anim-pulse-glow': {
      name: 'Pulse Glow',
      desc: 'Pulsing glow on prompt text',
      animated: true,
      render() {
        return (
          '<span class="pa-pulse">' + CFG.user + '@' + CFG.host + '</span> ' +
          '<span class="p-dir">' + S.cwd + '</span>' +
          '<span class="p-dollar"> $ </span>'
        );
      }
    },
    'anim-typing-dots': {
      name: 'Typing Dots',
      desc: 'Animated waiting dots',
      animated: true,
      render() {
        return (
          '<span class="p-dir">' + S.cwd + '</span>' +
          '<span class="pa-typing-dots"> \u25CF\u25CF\u25CF</span>' +
          '<span class="p-dollar"> $ </span>'
        );
      }
    },
    'anim-rainbow': {
      name: 'Rainbow',
      desc: 'Color-cycling prompt text',
      animated: true,
      render() {
        return (
          '<span class="pa-rainbow">' + CFG.user + '@' + CFG.host + ':' + S.cwd + '</span>' +
          '<span class="p-dollar"> $ </span>'
        );
      }
    },
    'anim-blink-arrow': {
      name: 'Blink Arrow',
      desc: 'Blinking arrow indicator',
      animated: true,
      render() {
        return (
          '<span class="p-dir">' + S.cwd + '</span>' +
          '<span class="pa-blink-arrow"> \u25B6 </span>'
        );
      }
    },
    'anim-wave-text': {
      name: 'Wave Text',
      desc: 'Wavy bounce text animation',
      animated: true,
      render() {
        var chars = (CFG.user + '@' + CFG.host).split('');
        var waved = chars.map(function (c, i) {
          return '<span class="pa-wave-char" style="animation-delay:' + (i * 0.08) + 's">' + c + '</span>';
        }).join('');
        return (
          waved + ' ' +
          '<span class="p-dir">' + S.cwd + '</span>' +
          '<span class="p-dollar"> $ </span>'
        );
      }
    },
    'anim-glitch': {
      name: 'Glitch',
      desc: 'Occasional glitch flicker',
      animated: true,
      render() {
        return (
          '<span class="pa-glitch" data-text="' + CFG.user + '@' + CFG.host + '">' + CFG.user + '@' + CFG.host + '</span> ' +
          '<span class="p-dir">' + S.cwd + '</span>' +
          '<span class="p-dollar"> $ </span>'
        );
      }
    },
    'anim-fade-in': {
      name: 'Fade In',
      desc: 'Prompt fades in smoothly',
      animated: true,
      render() {
        return (
          '<span class="pa-fade-in">' +
          '<span class="p-user">' + CFG.user + '</span>' +
          '<span class="p-at">@</span>' +
          '<span class="p-host">' + CFG.host + '</span>' +
          '<span class="p-classic-colon">:</span>' +
          '<span class="p-dir">' + S.cwd + '</span>' +
          '<span class="p-dollar">$ </span>' +
          '</span>'
        );
      }
    },
    'anim-neon-flicker': {
      name: 'Neon Flicker',
      desc: 'Neon sign flickering effect',
      animated: true,
      render() {
        return (
          '<span class="pa-neon-flicker">' + CFG.user + '@' + CFG.host + '</span> ' +
          '<span class="p-dir">' + S.cwd + '</span>' +
          '<span class="pa-neon-flicker">> </span>'
        );
      }
    },
    'anim-spin-icon': {
      name: 'Spin Icon',
      desc: 'Spinning icon before prompt',
      animated: true,
      render() {
        return (
          '<span class="pa-spin-icon">' + NF.cog + '</span> ' +
          '<span class="p-dir">' + S.cwd + '</span>' +
          '<span class="p-dollar"> $ </span>'
        );
      }
    },
    'anim-breathing': {
      name: 'Breathing',
      desc: 'Gentle breathing opacity',
      animated: true,
      render() {
        return (
          '<span class="pa-breathing">\u276F</span> ' +
          '<span class="p-dir">' + S.cwd + '</span>' +
          '<span class="pa-breathing"> \u276F </span>'
        );
      }
    },
    // â”€â”€ STATIC PROMPTS (batch 3) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    'zsh-git': {
      name: 'ZSH Git',
      desc: 'ZSH-style with git branch display',
      render() {
        return (
          '<span class="p-arrow-icon">\u279C</span> ' +
          '<span class="p-dir">' + S.cwd + '</span> ' +
          '<span class="p-git-branch">' + NF.gitBranch + ' main</span>' +
          '<span class="p-git-clean"> \u2714</span>' +
          '<span class="p-dollar"> $ </span>'
        );
      }
    },
    'powerline-git': {
      name: 'Powerline Git',
      desc: 'Powerline segments with git info',
      render() {
        return (
          '<span class="pl-seg pl-seg-user">' + NF.user + ' ' + CFG.user + ' </span>' +
          '<span class="pl-arrow pl-arrow-user-host">\uE0B0</span>' +
          '<span class="pl-seg pl-seg-dir">' + NF.folder + ' ' + S.cwd + ' </span>' +
          '<span class="pl-arrow pl-arrow-host-dir">\uE0B0</span>' +
          '<span class="pl-seg pl-seg-git">' + NF.gitBranch + ' main </span>' +
          '<span class="pl-arrow pl-arrow-dir-end">\uE0B0</span>' +
          '<span class="p-dollar"> $ </span>'
        );
      }
    },
    'rust': {
      name: 'Rustacean',
      desc: 'Rust/Cargo inspired \u{1F980} prompt',
      render() {
        return (
          '<span class="p-rust-icon">' + NF.cube + '</span> ' +
          '<span class="p-rust-crate">corderro</span>' +
          '<span class="p-rust-sep">::</span>' +
          '<span class="p-dir">' + S.cwd + '</span>' +
          '<span class="p-rust-arrow"> => </span>'
        );
      }
    },
    'ninja': {
      name: 'Ninja',
      desc: 'Stealthy minimal \u2022\u2022\u2022 prompt',
      render() {
        return (
          '<span class="p-ninja-blade">\u2694</span> ' +
          '<span class="p-dir">' + S.cwd + '</span>' +
          '<span class="p-ninja-dots"> \u00B7\u00B7\u00B7 </span>'
        );
      }
    },
    'pixel': {
      name: 'Pixel',
      desc: 'Retro pixel-art block style',
      render() {
        return (
          '<span class="p-pixel-block">\u2588\u2588</span> ' +
          '<span class="p-user">' + CFG.user + '</span>' +
          '<span class="p-pixel-sep"> \u2502 </span>' +
          '<span class="p-dir">' + S.cwd + '</span>' +
          '<span class="p-pixel-cursor"> \u25AE </span>'
        );
      }
    },
    'matrix': {
      name: 'Matrix',
      desc: 'Wake up Neo... follow the prompt',
      render() {
        return (
          '<span class="p-matrix-wake">[' + CFG.host + ']</span>' +
          '<span class="p-matrix-path"> ' + S.cwd + '</span>' +
          '<span class="p-matrix-cursor"> \u2588</span>' +
          '<span class="p-matrix-trail"> </span>'
        );
      }
    },
    'cyberpunk': {
      name: 'Cyberpunk',
      desc: 'Neon cyberpunk 2077 style',
      render() {
        return (
          '<span class="p-cyber-bracket">[</span>' +
          '<span class="p-cyber-corp">NCPD</span>' +
          '<span class="p-cyber-bracket">]</span> ' +
          '<span class="p-cyber-user">' + CFG.user + '</span>' +
          '<span class="p-cyber-sep">//</span>' +
          '<span class="p-dir">' + S.cwd + '</span>' +
          '<span class="p-cyber-prompt"> > </span>'
        );
      }
    },
    'astronaut': {
      name: 'Astronaut',
      desc: 'Houston, we have a prompt',
      render() {
        return (
          '<span class="p-astro-icon">' + NF.rocket + '</span> ' +
          '<span class="p-astro-mission">MISSION</span>' +
          '<span class="p-astro-sep">::</span>' +
          '<span class="p-dir">' + S.cwd + '</span>' +
          '<span class="p-astro-gt"> \u00BB </span>'
        );
      }
    },
    'ubuntu': {
      name: 'Ubuntu',
      desc: 'Ubuntu Linux default style',
      render() {
        return (
          '<span class="p-ubuntu-user">' + CFG.user + '@' + CFG.host + '</span>' +
          '<span class="p-ubuntu-colon">:</span>' +
          '<span class="p-ubuntu-dir">' + S.cwd + '</span>' +
          '<span class="p-ubuntu-dollar">$ </span>'
        );
      }
    },
    'windows': {
      name: 'Windows CMD',
      desc: 'Classic Windows command prompt',
      render() {
        var winPath = S.cwd.replace(/\//g, '\\').replace('~', 'C:\\Users\\' + CFG.user);
        return (
          '<span class="p-win-path">' + winPath + '</span>' +
          '<span class="p-win-gt">></span>'
        );
      }
    },
    'tokyo': {
      name: 'Tokyo Night',
      desc: 'Inspired by Tokyo Night theme',
      render() {
        return (
          '<span class="p-tokyo-left">\u256D\u2500 </span>' +
          '<span class="p-tokyo-user">' + CFG.user + '</span>' +
          '<span class="p-tokyo-in"> in </span>' +
          '<span class="p-dir">' + S.cwd + '</span>' +
          '<span class="p-tokyo-git"> ' + NF.gitBranch + ' main</span>\n' +
          '<span class="p-tokyo-left">\u2570\u2500 </span>' +
          '<span class="p-tokyo-char">\u276F </span>'
        );
      }
    },
    'kali': {
      name: 'Kali Linux',
      desc: 'Kali Linux pentest prompt',
      render() {
        return (
          '<span class="p-kali-shell">\u250C\u2500\u2500(</span>' +
          '<span class="p-kali-user">' + CFG.user + '\u2327' + CFG.host + '</span>' +
          '<span class="p-kali-shell">)-[</span>' +
          '<span class="p-kali-dir">' + S.cwd + '</span>' +
          '<span class="p-kali-shell">]</span>\n' +
          '<span class="p-kali-shell">\u2514\u2500</span>' +
          '<span class="p-kali-prompt"># </span>'
        );
      }
    },
    // â”€â”€ MORE ANIMATED PROMPTS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    'anim-matrix-rain': {
      name: 'Matrix Rain',
      desc: 'Raining green character effect',
      animated: true,
      render() {
        return (
          '<span class="pa-matrix-rain">\u2593\u2592\u2591</span> ' +
          '<span class="pa-matrix-text">' + CFG.user + '@' + CFG.host + '</span>' +
          '<span class="p-dollar"> \u2588</span>'
        );
      }
    },
    'anim-orbit': {
      name: 'Orbit',
      desc: 'Orbiting satellite icon',
      animated: true,
      render() {
        return (
          '<span class="pa-orbit">' + NF.globe + '</span> ' +
          '<span class="pa-orbit-sat">' + NF.rocket + '</span> ' +
          '<span class="p-dir">' + S.cwd + '</span>' +
          '<span class="p-dollar"> $ </span>'
        );
      }
    },
    'anim-electric': {
      name: 'Electric',
      desc: 'Crackling electric bolt prompt',
      animated: true,
      render() {
        return (
          '<span class="pa-electric">' + NF.bolt + '</span> ' +
          '<span class="p-dir">' + S.cwd + '</span>' +
          '<span class="pa-electric"> ' + NF.bolt + ' </span>'
        );
      }
    },
    'anim-heartbeat-prompt': {
      name: 'Heartbeat',
      desc: 'Pulsing heart beat indicator',
      animated: true,
      render() {
        return (
          '<span class="pa-heartbeat">' + NF.heart + '</span> ' +
          '<span class="p-user">' + CFG.user + '</span>' +
          '<span class="p-at">@</span>' +
          '<span class="p-host">' + CFG.host + '</span> ' +
          '<span class="p-dir">' + S.cwd + '</span>' +
          '<span class="p-dollar"> $ </span>'
        );
      }
    },
    'anim-loading-bar': {
      name: 'Loading Bar',
      desc: 'Animated progress bar prompt',
      animated: true,
      render() {
        return (
          '<span class="pa-loading-bar">' +
          '<span class="pa-bar-fill"></span>' +
          '</span> ' +
          '<span class="p-dir">' + S.cwd + '</span>' +
          '<span class="p-dollar"> $ </span>'
        );
      }
    },
    'anim-fire-prompt': {
      name: 'Fire',
      desc: 'Flickering fire text effect',
      animated: true,
      render() {
        return (
          '<span class="pa-fire">\uD83D\uDD25</span> ' +
          '<span class="pa-fire-text">' + CFG.user + '</span>' +
          '<span class="p-at">@</span>' +
          '<span class="pa-fire-text">' + CFG.host + '</span> ' +
          '<span class="p-dir">' + S.cwd + '</span>' +
          '<span class="pa-fire"> > </span>'
        );
      }
    },
    'anim-scan-line': {
      name: 'Scan Line',
      desc: 'Scanning line across prompt',
      animated: true,
      render() {
        return (
          '<span class="pa-scan-container">' +
          '<span class="pa-scan-line"></span>' +
          '<span class="p-user">' + CFG.user + '</span>' +
          '<span class="p-at">@</span>' +
          '<span class="p-host">' + CFG.host + '</span>' +
          '<span class="p-classic-colon">:</span>' +
          '<span class="p-dir">' + S.cwd + '</span>' +
          '<span class="p-dollar">$ </span>' +
          '</span>'
        );
      }
    },
    'anim-clock-spin': {
      name: 'Clock Spin',
      desc: 'Spinning clock icon before prompt',
      animated: true,
      render() {
        return (
          '<span class="pa-spin-icon">' + NF.clock + '</span> ' +
          '<span class="p-star-time">' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + '</span> ' +
          '<span class="p-dir">' + S.cwd + '</span>' +
          '<span class="p-dollar"> $ </span>'
        );
      }
    },
  };

  let currentPromptStyle = 'dual-line';

  function setPromptStyle(id) {
    if (!PROMPTS[id]) return false;
    currentPromptStyle = id;
    try { localStorage.setItem('vaporsoft-prompt', id); } catch (e) { }
    updatePrompt();
    return true;
  }

  function exportPrompt() {
    var p = PROMPTS[currentPromptStyle];
    return JSON.stringify({ id: currentPromptStyle, name: p.name, desc: p.desc }, null, 2);
  }

  function importPrompt(json) {
    try {
      var p = JSON.parse(json);
      if (!p.id || !p.name || !p.template) {
        return 'Invalid prompt JSON: missing required fields (id, name, template)';
      }
      if (typeof p.template !== 'string') return 'template must be a string';
      PROMPTS[p.id] = {
        name: p.name,
        desc: p.desc || 'Custom prompt',
        render: function () {
          var out = p.template
            .replace(/\{user\}/g, escHTML(CFG.user))
            .replace(/\{host\}/g, escHTML(CFG.host))
            .replace(/\{cwd\}/g, escHTML(S.cwd))
            .replace(/\{shell\}/g, escHTML(CFG.shell))
            .replace(/\{version\}/g, escHTML(CFG.version));
          out = out.replace(/\[green\](.*?)\[\/\]/g, '<span class="c-green-b">$1</span>');
          out = out.replace(/\[amber\](.*?)\[\/\]/g, '<span class="c-amber">$1</span>');
          out = out.replace(/\[cyan\](.*?)\[\/\]/g, '<span class="c-cyan">$1</span>');
          out = out.replace(/\[dim\](.*?)\[\/\]/g, '<span class="c-dim">$1</span>');
          out = out.replace(/\[white\](.*?)\[\/\]/g, '<span class="c-white">$1</span>');
          out = out.replace(/\[red\](.*?)\[\/\]/g, '<span class="c-red">$1</span>');
          out = out.replace(/\[bold\](.*?)\[\/\]/g, '<span class="c-bold">$1</span>');
          return out;
        }
      };
      setPromptStyle(p.id);
      return null;
    } catch (e) {
      return 'Invalid JSON: ' + e.message;
    }
  }

  function applyTheme(id) {
    const t = THEMES[id];
    if (!t) return false;
    currentTheme = id;
    const isLight = t.type === 'light';
    const r = document.documentElement.style;
    r.setProperty('--green', t.primary);
    r.setProperty('--green-bright', t.bright);
    r.setProperty('--green-dim', t.dim);
    r.setProperty('--green-faint', t.faint);
    r.setProperty('--bg', t.bg);
    r.setProperty('--bg-screen', t.bgScreen);
    r.setProperty('--glow', isLight
      ? '0 0 1px ' + t.dim
      : '0 0 2px ' + t.primary + ', 0 0 6px ' + t.dim + ', 0 0 14px ' + t.faint);
    // Adapt secondary colors for light themes
    if (isLight) {
      r.setProperty('--amber', '#b45309');
      r.setProperty('--cyan', '#0e7490');
      r.setProperty('--red', '#dc2626');
      r.setProperty('--magenta', '#be185d');
      r.setProperty('--purple', '#7c3aed');
      r.setProperty('--white', '#3f3f46');
      r.setProperty('--white-bright', '#18181b');
      r.setProperty('--gray', '#71717a');
      r.setProperty('--gray-dark', '#a1a1aa');
      r.setProperty('--glow-amber', 'none');
      r.setProperty('--glow-cyan', 'none');
    } else {
      r.setProperty('--amber', '#ffb000');
      r.setProperty('--cyan', '#00d4ff');
      r.setProperty('--red', '#ff003c');
      r.setProperty('--magenta', '#ff2975');
      r.setProperty('--purple', '#bd93f9');
      r.setProperty('--white', '#b0b0b0');
      r.setProperty('--white-bright', '#e0e0e0');
      r.setProperty('--gray', '#666');
      r.setProperty('--gray-dark', '#333');
      r.setProperty('--glow-amber', '0 0 2px var(--amber), 0 0 6px rgba(255,176,0,0.5)');
      r.setProperty('--glow-cyan', '0 0 2px var(--cyan), 0 0 6px rgba(0,212,255,0.5)');
    }
    document.body.classList.toggle('theme-light', isLight);
    const led = document.getElementById('power-led');
    if (led) {
      led.style.background = t.primary;
      led.style.boxShadow = '0 0 4px ' + t.primary + ', 0 0 10px ' + t.dim;
    }
    // Handle animated theme class on screen
    var screenEl = document.getElementById('screen');
    if (screenEl) {
      var clsList = screenEl.className.split(' ');
      for (var ai = clsList.length - 1; ai >= 0; ai--) {
        if (clsList[ai].startsWith('anim-')) screenEl.classList.remove(clsList[ai]);
      }
      if (t.animClass) screenEl.classList.add(t.animClass);
    }
    document.body.classList.toggle('theme-animated', t.type === 'animated');
    try { localStorage.setItem('vaporsoft-theme', id); } catch (e) { }
    return true;
  }

  function exportTheme() {
    const t = THEMES[currentTheme];
    return JSON.stringify({ id: currentTheme, name: t.name, type: t.type || 'dark', primary: t.primary, bright: t.bright, dim: t.dim, faint: t.faint, bg: t.bg, bgScreen: t.bgScreen }, null, 2);
  }

  function importTheme(json) {
    try {
      const t = JSON.parse(json);
      if (!t.id || !t.primary || !t.bright || !t.dim || !t.faint) {
        return 'Invalid theme JSON: missing required fields (id, primary, bright, dim, faint)';
      }
      THEMES[t.id] = {
        name: t.name || t.id,
        type: t.type || 'dark',
        primary: t.primary, bright: t.bright, dim: t.dim,
        faint: t.faint, bg: t.bg || '#050505', bgScreen: t.bgScreen || '#070707',
      };
      applyTheme(t.id);
      return null;
    } catch (e) {
      return 'Invalid JSON: ' + e.message;
    }
  }

  // ================================================================
  //  STATE
  // ================================================================
  const S = {
    cwd: '~',
    history: [],
    histIdx: -1,
    savedInput: '',
    booting: true,
    mode: 'normal',
    browserIdx: 0,
    detailIdx: -1,
    themeIdx: 0,
    promptIdx: 0,
    zenMode: false,
    repos: [],
    reposLoaded: false,
    reposLoading: false,
    pinnedNames: [],
    pinnedLoaded: false,
    browserView: 'all', // 'all' or 'pinned'
    innerFocus: false, // true when inner sub-panel (e.g. readme) is focused
    customizeTab: 'themes',
    customizeIdx: 0,
  };

  // ================================================================
  //  DOM REFERENCES
  // ================================================================
  let $out, $terminal, $inputLine, $prompt, $inputBefore, $inputAfter,
    $cursor, $ghost, $hidden, $mobileBar, $menuToggle, $quickBtns, $cmdMenu;

  // ================================================================
  //  HELPERS
  // ================================================================
  const h = (tag, cls, text) => '<span class="' + cls + '">' + text + '</span>';

  // ================================================================
  //  PROMPT
  // ================================================================
  function promptHTML() {
    var style = PROMPTS[currentPromptStyle];
    if (style && style.render) {
      return style.render();
    }
    // Fallback to dual-line
    return PROMPTS['dual-line'].render();
  }

  function updatePrompt() {
    $prompt.innerHTML = promptHTML();
    scroll();
  }

  // ================================================================
  //  OUTPUT
  // ================================================================
  function print(html, cls) {
    const d = document.createElement('div');
    d.className = 'output-line' + (cls ? ' ' + cls : '');
    d.innerHTML = html || '&nbsp;';
    $out.appendChild(d);
    scroll();
  }

  function printBlock(html, cls) {
    const d = document.createElement('div');
    d.className = 'output-block' + (cls ? ' ' + cls : '');
    d.innerHTML = html;
    $out.appendChild(d);
    scroll();
  }

  function scroll() { $terminal.scrollTop = $terminal.scrollHeight; }

  // ================================================================
  //  INPUT DISPLAY
  // ================================================================
  function getInputValue() { return $hidden.value; }

  function setInputValue(v) {
    $hidden.value = v;
    renderInput();
  }

  function renderInput() {
    const v = $hidden.value;
    const pos = $hidden.selectionStart || 0;
    $inputBefore.textContent = v.slice(0, pos);
    $inputAfter.textContent = v.slice(pos);
    const suggestion = getSuggestion(v);
    $ghost.textContent = suggestion ? suggestion.slice(v.length) : '';
    scroll();
  }

  function escHTML(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function focusInput() { $hidden.focus({ preventScroll: true }); }

  // ================================================================
  //  SUGGESTION (fish-style ghost text)
  // ================================================================
  function getSuggestion(partial) {
    if (!partial || S.mode !== 'normal') return '';
    const lower = partial.toLowerCase();
    for (const name of cmdNames) {
      if (name.startsWith(lower) && name !== lower) return name;
    }
    for (let i = S.history.length - 1; i >= 0; i--) {
      if (S.history[i].toLowerCase().startsWith(lower) && S.history[i] !== partial) {
        return S.history[i];
      }
    }
    return '';
  }

  // ================================================================
  //  COMMANDS REGISTRY
  // ================================================================
  const CMDS = {};
  let cmdNames = [];

  function reg(name, fn, desc, hidden) {
    CMDS[name] = { fn, desc, hidden: !!hidden };
  }

  // ================================================================
  //  EXECUTE
  // ================================================================
  function exec(raw) {
    const trimmed = raw.trim();
    const frozenPrompt = promptHTML();
    print(frozenPrompt + h('span', 'history-cmd', escHTML(trimmed)), 'history-line');

    if (!trimmed) { updatePrompt(); return; }

    if (!S.history.length || S.history[S.history.length - 1] !== trimmed) {
      S.history.push(trimmed);
    }
    S.histIdx = -1;
    S.savedInput = '';

    const parts = trimmed.split(/\s+/);
    var name = parts[0].toLowerCase();
    if (name === '?') name = 'help';
    const args = parts.slice(1);

    const cmd = CMDS[name];
    if (cmd) {
      cmd.fn(args, trimmed);
    } else {
      print(h('span', 'c-red', 'command not found: ') + h('span', 'c-white', escHTML(name)));
      print(h('span', 'c-dim', "type 'help' for available commands"));
      triggerGlitch();
    }

    if (S.mode === 'normal') updatePrompt();
  }

  // ================================================================
  //  TAB COMPLETION
  // ================================================================
  function tabComplete() {
    const v = getInputValue();
    if (!v) return;
    const lower = v.toLowerCase();
    const matches = cmdNames.filter(n => n.startsWith(lower));

    if (matches.length === 1) {
      setInputValue(matches[0] + ' ');
    } else if (matches.length > 1) {
      const frozenPrompt = promptHTML();
      print(frozenPrompt + h('span', 'history-cmd', escHTML(v)), 'history-line');
      print(matches.map(function (m) { return h('span', 'c-amber', m); }).join('  '));
      updatePrompt();
      var prefix = matches[0];
      for (var mi = 0; mi < matches.length; mi++) {
        while (!matches[mi].startsWith(prefix)) prefix = prefix.slice(0, -1);
      }
      if (prefix.length > v.length) setInputValue(prefix);
    } else {
      triggerGlitch();
    }
  }

  // ================================================================
  //  KEYBOARD HANDLING
  // ================================================================
  function onKeyDown(e) {
    if (S.booting) return;

    // Let links handle their own Enter/click
    if (e.target.tagName === 'A' && e.key === 'Enter') return;

    // In normal mode, keep focus on hidden input so typed characters go there
    if (S.mode === 'normal' && document.activeElement !== $hidden) {
      focusInput();
    }

    // Global keybinds (work in any mode)
    if (e.ctrlKey) {
      switch (e.key) {
        case 'p':
          e.preventDefault();
          if (S.mode !== 'normal') closeAllDialogues();
          setInputValue('');
          exec('github');
          return;
        case 't':
          e.preventDefault();
          if (S.mode !== 'normal') closeAllDialogues();
          setInputValue('');
          exec('customize');
          return;
        case 'k':
          e.preventDefault();
          if (S.mode !== 'normal') closeAllDialogues();
          setInputValue('');
          exec('keybinds');
          return;
      }
    }

    if (S.mode === 'browser') return browserKey(e);
    if (S.mode === 'detail') return detailKey(e);
    if (S.mode === 'customize') return customizeBrowserKey(e);
    if (S.mode === 'keybinds') return keybindKey(e);
    if (S.mode === 'effects') return effectsBrowserKey(e);
    if (S.mode === 'history') return historyBrowserKey(e);

    // Page Up / Page Down scrolls terminal buffer in normal mode
    if (e.key === 'PageDown' || e.key === 'PageUp') {
      e.preventDefault();
      var amount = $terminal.clientHeight * 0.75;
      $terminal.scrollBy(0, e.key === 'PageDown' ? amount : -amount);
      return;
    }

    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        var val = getInputValue();
        setInputValue('');
        $inputLine.style.display = 'none';
        exec(val);
        $inputLine.style.display = '';
        focusInput();
        scroll();
        break;

      case 'Tab':
        e.preventDefault();
        var ghostText = $ghost.textContent;
        if (ghostText) {
          setInputValue(getInputValue() + ghostText);
        } else {
          tabComplete();
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (!S.history.length) {
          triggerGlitch();
        } else {
          historyNav(-1);
        }
        break;

      case 'ArrowDown':
        e.preventDefault();
        if (!S.history.length) {
          triggerGlitch();
        } else {
          historyNav(1);
        }
        break;

      case 'ArrowRight':
        if ($hidden.selectionStart === $hidden.value.length && $ghost.textContent) {
          e.preventDefault();
          setInputValue(getInputValue() + $ghost.textContent);
        }
        break;

      case 'c':
        if (e.ctrlKey) {
          e.preventDefault();
          var fp = promptHTML();
          print(fp + h('span', 'history-cmd', escHTML(getInputValue())) + h('span', 'c-red', '^C'), 'history-line');
          setInputValue('');
          updatePrompt();
          triggerGlitch();
        }
        break;

      case 'l':
        if (e.ctrlKey) {
          e.preventDefault();
          cmdClear();
        }
        break;
    }
  }

  function historyNav(dir) {
    if (!S.history.length) return;
    if (S.histIdx === -1) S.savedInput = getInputValue();

    S.histIdx += dir;
    if (S.histIdx < -1) S.histIdx = -1;
    if (S.histIdx >= S.history.length) S.histIdx = S.history.length - 1;

    if (S.histIdx === -1) {
      setInputValue(S.savedInput);
    } else {
      setInputValue(S.history[S.history.length - 1 - S.histIdx]);
    }
    $hidden.selectionStart = $hidden.selectionEnd = $hidden.value.length;
  }

  // ================================================================
  //  COMMAND: help
  // ================================================================
  reg('help', function () {
    print('');
    print(h('span', 'c-amber c-bold', '  ' + NF.terminal + ' AVAILABLE COMMANDS'));
    print(h('span', 'c-dim', '  \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500'));
    var iconMap = {
      help: NF.question, about: NF.info, github: NF.github,
      prompt: NF.cmd, theme: NF.palette, customize: NF.cog,
      zen: NF.expand, clear: NF.times,
      ls: NF.folder, cd: NF.folder, cat: NF.file, pwd: NF.home,
      whoami: NF.user, date: NF.clock, echo: NF.cmd, tree: NF.gitBranch,
      keybinds: NF.keyboard, links: NF.link, showcase: NF.eye,
      effects: NF.monitor, history: NF.archive, share: NF.link,
    };
    for (var ci = 0; ci < cmdNames.length; ci++) {
      var name = cmdNames[ci];
      var c = CMDS[name];
      if (c.hidden) continue;
      var icon = iconMap[name] || NF.caretR;
      var row = '<div class="help-row">' +
        '<span class="help-cmd">  ' + icon + ' ' + name + '</span>' +
        '<span class="help-desc">' + c.desc + '</span></div>';
      printBlock(row);
    }
    print('');
    print(h('span', 'c-dim', '  Tab to autocomplete \u00b7 \u2191\u2193 for history \u00b7 Ctrl+L to clear'));
    print('');
  }, 'Show available commands');

  // ================================================================
  //  COMMAND: about / neofetch
  // ================================================================
  reg('about', cmdAbout, 'Display system information');
  reg('neofetch', cmdAbout, 'Display system information (alias)', true);

  function cmdAbout() {
    var art = [
      '  \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510',
      '  \u2502 \u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557 \u2502',
      '  \u2502 \u2551  <span class="c-green-b">>_</span>      \u2551 \u2502',
      '  \u2502 \u2551          \u2551 \u2502',
      '  \u2502 \u2551          \u2551 \u2502',
      '  \u2502 \u255a\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255d \u2502',
      '  \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518',
      '     \u250c\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2510   ',
      '     \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518   ',
    ].join('\n');

    var sep = h('span', 'c-dim', '\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500');
    var kv = function (k, v) { return h('span', 'nf-key', k) + h('span', 'nf-val', v); };

    var info = [
      h('span', 'nf-title', CFG.user + '@' + CFG.host),
      sep,
      kv('OS        ', 'VaporSoft Portfolio v' + CFG.version),
      kv('Host      ', CFG.host),
      kv('Kernel    ', 'ECMAScript 2026 (ES17)'),
      kv('Uptime    ', 'Always Online'),
      kv('Shell     ', CFG.shell),
      kv('Theme     ', THEMES[currentTheme].name),
      kv('Prompt    ', PROMPTS[currentPromptStyle].name),
      kv('Badges    ', BADGE_STYLES[currentBadgeStyle].name),
      kv('Terminal  ', CFG.terminal),
      kv('Editor    ', 'VS Code'),
      sep,
      h('span', 'nf-title', 'Languages'),
      langBadges(window.innerWidth < 600 ? 5 : S.zenMode ? 8 : 10),
      sep,
      colorBlocks(),
    ].join('\n');

    var html =
      '<div class="neofetch">' +
      '<div class="neofetch-art output-block">' + art + '</div>' +
      '<div class="neofetch-info output-block">' + info + '</div>' +
      '</div>';

    print('');
    printBlock(html);
    print('');
  }

  function langBadges(max) {
    var keys = Object.keys(LANG_BADGE_MAP);
    var seen = {};
    var unique = keys.map(function (k) {
      var b = LANG_BADGE_MAP[k];
      var key = b.badge + '|' + b.cls;
      if (seen[key]) return null;
      seen[key] = true;
      return { lang: k, badge: b.badge, cls: b.cls };
    }).filter(Boolean);

    if (max && S.repos && S.repos.length) {
      var freq = {};
      S.repos.forEach(function (r) {
        if (r.language) {
          var l = r.language;
          freq[l] = (freq[l] || 0) + 1;
        }
      });
      unique.sort(function (a, b) {
        return (freq[b.lang] || 0) - (freq[a.lang] || 0);
      });
    }

    var badges = unique.map(function (u) {
      return '<span class="badge ' + u.cls + '">' + u.badge + '</span>';
    });
    if (max && max < badges.length) badges = badges.slice(0, max);
    return badges.join(' ');
  }

  function colorBlocks() {
    var cs = getComputedStyle(document.documentElement);
    var colors = [
      cs.getPropertyValue('--bg').trim(),
      cs.getPropertyValue('--red').trim(),
      cs.getPropertyValue('--green').trim(),
      cs.getPropertyValue('--amber').trim(),
      cs.getPropertyValue('--cyan').trim(),
      cs.getPropertyValue('--magenta').trim(),
      cs.getPropertyValue('--purple').trim(),
      cs.getPropertyValue('--white-bright').trim(),
    ];
    return '<div class="neofetch-colors">' +
      colors.map(function (c) { return '<span style="background:' + c + '"></span>'; }).join('') +
      '</div>';
  }

  // ================================================================
  //  COMMAND: theme
  // ================================================================
  // ================================================================
  //  COMMAND: prompt
  // ================================================================
  reg('prompt', function (args) {
    var sub = (args[0] || '').toLowerCase();

    if (!sub || sub === 'list') {
      exec('customize prompts');
      return;
    }

    if (sub === 'export') {
      print('');
      print(h('span', 'c-amber c-bold', '  Current prompt style:'));
      print('');
      var json = exportPrompt();
      json.split('\n').forEach(function (l) { print(h('span', 'c-white', '  ' + escHTML(l))); });
      print('');
      return;
    }

    if (sub === 'import') {
      var jsonStr = args.slice(1).join(' ');
      if (!jsonStr) {
        print(h('span', 'c-red', '  Usage: prompt import {"id":"my-prompt","name":"My Prompt","template":"[green]{user}[/]@[cyan]{host}[/] {cwd} $ "}'));
        return;
      }
      var err = importPrompt(jsonStr);
      if (err) {
        print(h('span', 'c-red', '  ' + err));
        triggerGlitch();
      } else {
        print(h('span', 'c-green-b', '  Prompt imported and applied!'));
      }
      return;
    }

    if (PROMPTS[sub]) {
      setPromptStyle(sub);
      print(h('span', 'c-green-b', '  Prompt set to: ') + h('span', 'c-white', PROMPTS[sub].name));
      triggerGlitch();
    } else {
      print(h('span', 'c-red', '  Unknown prompt: ') + h('span', 'c-white', escHTML(sub)));
      print(h('span', 'c-dim', "  Run 'prompt list' to see available styles."));
      triggerGlitch();
    }
  }, 'Change prompt style');

  reg('theme', function (args) {
    var sub = (args[0] || '').toLowerCase();

    if (!sub || sub === 'list') {
      exec('customize themes');
      return;
    }

    if (sub === 'export') {
      print('');
      print(h('span', 'c-amber c-bold', '  Current theme JSON:'));
      print('');
      var json = exportTheme();
      json.split('\n').forEach(function (l) { print(h('span', 'c-white', '  ' + escHTML(l))); });
      print('');
      print(h('span', 'c-dim', '  Copy the JSON above to share or back up your theme.'));
      print('');
      return;
    }

    if (sub === 'import') {
      var jsonStr = args.slice(1).join(' ');
      if (!jsonStr) {
        print(h('span', 'c-red', '  Usage: theme import {"id":"my-theme","name":"My Theme","primary":"#ff0000","bright":"#ff3333","dim":"rgba(255,0,0,0.5)","faint":"rgba(255,0,0,0.08)"}'));
        return;
      }
      var err = importTheme(jsonStr);
      if (err) {
        print(h('span', 'c-red', '  ' + err));
        triggerGlitch();
      } else {
        print(h('span', 'c-green-b', '  Theme imported and applied!'));
      }
      return;
    }

    if (THEMES[sub]) {
      applyTheme(sub);
      print(h('span', 'c-green-b', '  Theme set to: ') + h('span', 'c-white', THEMES[sub].name));
      triggerGlitch();
    } else {
      print(h('span', 'c-red', '  Unknown theme: ') + h('span', 'c-white', escHTML(sub)));
      print(h('span', 'c-dim', "  Run 'theme list' to see available themes."));
      triggerGlitch();
    }
  }, 'Change terminal theme');

  // ================================================================
  //  UNIFIED CUSTOMIZE BROWSER
  // ================================================================
  var CUSTOMIZE_TABS = ['themes', 'prompts', 'badges'];
  var CUSTOMIZE_TAB_LABELS = {
    themes: NF.palette + ' Themes',
    prompts: NF.cmd + ' Prompts',
    badges: NF.tag + ' Badges',
  };

  reg('customize', function (args) {
    var tab = (args[0] || '').toLowerCase();
    safeOpenDialogue('customize');
    S.customizeTab = CUSTOMIZE_TABS.indexOf(tab) >= 0 ? tab : 'themes';
    S.customizeIdx = 0;
    if (S.customizeTab === 'themes') S.customizeIdx = S.themeIdx || 0;
    if (S.customizeTab === 'prompts') S.customizeIdx = S.promptIdx || 0;
    renderCustomizeBrowser();
  }, 'Open theme / prompt / badge style picker');
  reg('config', function (args) { exec('customize ' + (args[0] || '')); }, 'Alias for customize', true);
  reg('settings', function (args) { exec('customize ' + (args[0] || '')); }, 'Alias for customize', true);

  function getCustomizeItems() {
    if (S.customizeTab === 'themes') return Object.keys(THEMES);
    if (S.customizeTab === 'prompts') return Object.keys(PROMPTS);
    return Object.keys(BADGE_STYLES);
  }

  function renderCustomizeBrowser() {
    var old = $out.querySelector('.customize-browser');
    if (old) old.remove();

    var box = document.createElement('div');
    box.className = 'customize-browser tui-box';

    // Tab bar
    var tabHTML = '<div class="customize-tabs">';
    CUSTOMIZE_TABS.forEach(function (t) {
      tabHTML += '<span class="customize-tab' + (t === S.customizeTab ? ' active' : '') + '" data-tab="' + t + '">' + CUSTOMIZE_TAB_LABELS[t] + '</span>';
    });
    tabHTML += '</div>';

    var items = getCustomizeItems();
    var rows = '';

    if (S.customizeTab === 'themes') {
      items.forEach(function (tid, i) {
        var t = THEMES[tid];
        var sel = i === S.customizeIdx;
        var active = tid === currentTheme ? ' ' + NF.caretL : '';
        var typeBadge;
        if (t.type === 'light') typeBadge = '<span class="badge badge-light theme-type-badge">' + NF.sun + '</span>';
        else if (t.type === 'animated') typeBadge = '<span class="badge badge-animated theme-type-badge">' + NF.bolt + '</span>';
        else typeBadge = '<span class="badge badge-dark theme-type-badge">' + NF.moon + '</span>';
        rows +=
          '<div class="tui-row' + (sel ? ' selected' : '') + '" data-idx="' + i + '">' +
          '<span class="indicator">' + (sel ? NF.caretR : ' ') + '</span>' +
          typeBadge +
          '<span class="theme-id">' + tid + '</span>' +
          '<span class="theme-swatch" style="color:' + t.primary + ';">\u2588\u2588</span>' +
          '<span class="theme-name">' + t.name + active + '</span>' +
          '</div>';
      });
    } else if (S.customizeTab === 'prompts') {
      items.forEach(function (pid, i) {
        var p = PROMPTS[pid];
        var sel = i === S.customizeIdx;
        var active = pid === currentPromptStyle ? ' ' + NF.caretL : '';
        var pAnimBadge = p.animated ? '<span class="badge badge-animated prompt-anim-badge">' + NF.bolt + '</span> ' : '';
        rows +=
          '<div class="tui-row' + (sel ? ' selected' : '') + '" data-idx="' + i + '">' +
          '<span class="indicator">' + (sel ? NF.caretR : ' ') + '</span>' +
          pAnimBadge +
          '<span class="prompt-id">' + pid + '</span>' +
          '<span class="prompt-name">' + p.name + active + '</span>' +
          '<span class="prompt-desc">' + escHTML(p.desc) + '</span>' +
          '</div>';
      });
    } else {
      // badges
      items.forEach(function (bid, i) {
        var b = BADGE_STYLES[bid];
        var sel = i === S.customizeIdx;
        var active = bid === currentBadgeStyle ? ' ' + NF.caretL : '';
        rows +=
          '<div class="tui-row' + (sel ? ' selected' : '') + '" data-idx="' + i + '">' +
          '<span class="indicator">' + (sel ? NF.caretR : ' ') + '</span>' +
          '<span class="badge-style-id">' + bid + '</span>' +
          '<span class="badge-style-name">' + b.name + active + '</span>' +
          '<span class="badge-style-desc">' + escHTML(b.desc) + '</span>' +
          '</div>';
      });
    }

    // Preview section
    var previewHTML = '';
    if (S.customizeTab === 'themes') {
      var previewTid = items[S.customizeIdx];
      var pt = THEMES[previewTid];
      if (pt) {
        var isLight = pt.type === 'light';
        var typeName = pt.type === 'animated' ? NF.bolt + ' Animated' : isLight ? NF.sun + ' Light' : NF.moon + ' Dark';
        var swatches =
          '<span class="theme-swatch-block" style="background:' + pt.primary + '" title="Primary"></span>' +
          '<span class="theme-swatch-block" style="background:' + pt.bright + '" title="Bright"></span>' +
          '<span class="theme-swatch-block" style="background:' + pt.dim + '" title="Dim"></span>' +
          '<span class="theme-swatch-block" style="background:' + pt.bg + ';border:1px solid ' + pt.dim + '" title="BG"></span>';
        var animCls = pt.animClass ? ' ' + pt.animClass : '';
        var sampleLine =
          '<div class="theme-preview-sample' + animCls + '" style="background:' + pt.bgScreen + ';color:' + pt.primary + ';text-shadow:0 0 4px ' + pt.dim + '">' +
          '<span style="color:' + pt.bright + '">' + escHTML(CFG.user) + '</span>' +
          '<span style="color:' + pt.dim + '">@</span>' +
          '<span style="color:' + pt.bright + '">' + escHTML(CFG.host) + '</span>' +
          '<span style="color:' + pt.dim + '">:</span>' +
          '<span style="color:' + pt.primary + '">~</span>' +
          '<span style="color:' + pt.dim + '">$ </span>' +
          '<span style="color:' + pt.primary + '">ls -la</span>' +
          '</div>';
        previewHTML =
          '<div class="theme-preview"><span class="prompt-preview-label">' + NF.eye + ' Preview:</span>' +
          '<div class="theme-preview-meta"><span class="c-dim">' + typeName + '</span> \u00b7 <span style="color:' + pt.primary + '">' + escHTML(pt.name) + '</span></div>' +
          '<div class="theme-preview-swatches">' + swatches + '</div>' +
          sampleLine +
          '</div>';
      }
    } else if (S.customizeTab === 'prompts') {
      var previewPid = items[S.customizeIdx];
      if (PROMPTS[previewPid]) {
        previewHTML = '<div class="prompt-preview"><span class="prompt-preview-label">' + NF.eye + ' Preview:</span><div class="prompt-preview-content">' + PROMPTS[previewPid].render() + '<span class="c-dim">ls -la</span></div></div>';
      }
    } else if (S.customizeTab === 'badges') {
      var previewBid = items[S.customizeIdx];
      var sampleBadges = ['JS', 'PY', 'RS', 'GO', 'TS', 'RB', 'SW', 'EX'];
      var sampleClasses = ['badge-js', 'badge-py', 'badge-rs', 'badge-go', 'badge-ts', 'badge-ruby', 'badge-swift', 'badge-elixir'];
      var sampleHTML = '';
      for (var si = 0; si < sampleBadges.length; si++) {
        sampleHTML += '<span class="badge ' + sampleClasses[si] + '">' + sampleBadges[si] + '</span> ';
      }
      var wrapCls = previewBid !== 'default' ? 'badge-style-' + previewBid : '';
      previewHTML = '<div class="badge-preview ' + wrapCls + '"><span class="prompt-preview-label">' + NF.eye + ' Preview:</span><div class="badge-preview-content">' + sampleHTML + '</div></div>';
    }

    var countLabel = items.length + (S.customizeTab === 'themes' ? ' available' : S.customizeTab === 'prompts' ? ' styles' : ' styles');
    box.innerHTML =
      '<div class="tui-header">' + NF.cog + ' CUSTOMIZE \u2014 ' + countLabel + ' ' + NF.cog + '</div>' +
      tabHTML +
      '<div class="tui-body">' + rows + '</div>' +
      previewHTML +
      '<div class="tui-footer">' +
      '<span class="tui-hints">' + NF.arrowUp + NF.arrowDown + ' Navigate \u00b7 Tab Switch section \u00b7 Enter Apply \u00b7 PgUp/PgDn Scroll \u00b7 q Close</span>' +
      '<span class="tui-actions">' +
      '<button class="tui-btn" data-action="up">' + NF.arrowUp + '</button>' +
      '<button class="tui-btn" data-action="down">' + NF.arrowDown + '</button>' +
      '<button class="tui-btn tui-btn-primary" data-action="select">' + NF.check + ' Apply</button>' +
      '<button class="tui-btn" data-action="close">' + NF.times + '</button>' +
      '</span>' +
      '</div>';

    $out.appendChild(box);
    bindTuiActions(box);

    // Tab click handlers
    box.querySelectorAll('.customize-tab').forEach(function (tabEl) {
      tabEl.addEventListener('click', function () {
        S.customizeTab = tabEl.dataset.tab;
        S.customizeIdx = 0;
        renderCustomizeBrowser();
        focusInput();
      });
    });

    // Row click handlers
    box.querySelectorAll('.tui-row').forEach(function (row) {
      row.addEventListener('click', function () {
        var idx = parseInt(row.dataset.idx, 10);
        if (S.customizeIdx === idx) {
          applyCustomizeSelection(items[idx]);
          renderCustomizeBrowser();
        } else {
          S.customizeIdx = idx;
          renderCustomizeBrowser();
        }
        focusInput();
      });
    });

    // Scroll selected row into view
    var selRow = box.querySelector('.tui-row.selected');
    if (selRow) selRow.scrollIntoView({ block: 'nearest' });

    scroll();
    updateMobileBar();
  }

  function applyCustomizeSelection(key) {
    if (S.customizeTab === 'themes') {
      applyTheme(key);
    } else if (S.customizeTab === 'prompts') {
      setPromptStyle(key);
    } else {
      setBadgeStyle(key);
    }
  }

  function customizeBrowserKey(e) {
    var items = getCustomizeItems();
    switch (e.key) {
      case 'PageUp': case 'PageDown':
        e.preventDefault();
        scrollActivePanel(e.key === 'PageDown');
        break;
      case 'Tab':
        e.preventDefault();
        var ci = CUSTOMIZE_TABS.indexOf(S.customizeTab);
        S.customizeTab = CUSTOMIZE_TABS[(ci + (e.shiftKey ? CUSTOMIZE_TABS.length - 1 : 1)) % CUSTOMIZE_TABS.length];
        S.customizeIdx = 0;
        renderCustomizeBrowser();
        break;
      case 'ArrowUp': case 'w': case 'W': case 'k':
        e.preventDefault();
        if (S.customizeIdx === 0) triggerGlitch();
        else S.customizeIdx = Math.max(0, S.customizeIdx - 1);
        renderCustomizeBrowser();
        break;
      case 'ArrowDown': case 's': case 'S': case 'j':
        e.preventDefault();
        if (S.customizeIdx === items.length - 1) triggerGlitch();
        else S.customizeIdx = Math.min(items.length - 1, S.customizeIdx + 1);
        renderCustomizeBrowser();
        break;
      case 'Enter':
        e.preventDefault();
        applyCustomizeSelection(items[S.customizeIdx]);
        renderCustomizeBrowser();
        break;
      case 'Escape': case 'q':
        e.preventDefault();
        exitCustomizeBrowser();
        break;
    }
  }

  function exitCustomizeBrowser() {
    var old = $out.querySelector('.customize-browser');
    if (old) old.remove();
    S.mode = 'normal';
    $inputLine.style.display = '';
    updatePrompt();
    focusInput();
    scroll();
    updateMobileBar();
  }

  // ================================================================
  //  COMMAND: zen
  // ================================================================
  reg('zen', function () {
    S.zenMode = !S.zenMode;
    var monitor = document.getElementById('monitor');
    monitor.classList.toggle('zen-mode', S.zenMode);
    if (S.zenMode) {
      print(h('span', 'c-cyan', '  ' + NF.compress + ' Zen mode enabled \u2014 centered view'));
    } else {
      print(h('span', 'c-cyan', '  ' + NF.expand + ' Zen mode disabled \u2014 full-width view'));
    }
    triggerGlitch();
  }, 'Toggle centered zen mode');

  // ================================================================
  //  COMMAND: effects — CRT screen effects toggle
  // ================================================================
  var CRT_EFFECTS = [
    { id: 'scanlines', label: 'Scanlines', desc: 'Horizontal CRT scan lines', cls: 'no-scanlines' },
    { id: 'sweep', label: 'Sweep Line', desc: 'Moving horizontal sweep bar', cls: 'no-sweep' },
    { id: 'flicker', label: 'Flicker', desc: 'Subtle screen flicker', cls: 'no-flicker' },
    { id: 'vignette', label: 'Vignette', desc: 'Edge shadow overlay', cls: 'no-vignette' },
    { id: 'phosphor', label: 'Phosphor Glow', desc: 'Screen glow pulsation', cls: 'no-phosphor' },
    { id: 'textglow', label: 'Text Glow', desc: 'Text shadow / bloom', cls: 'no-textglow' },
  ];

  var effectStates = {};
  CRT_EFFECTS.forEach(function (fx) { effectStates[fx.id] = true; });

  function loadEffectStates() {
    try {
      var saved = localStorage.getItem('vaporsoft-effects');
      if (saved) {
        var parsed = JSON.parse(saved);
        CRT_EFFECTS.forEach(function (fx) {
          if (typeof parsed[fx.id] === 'boolean') effectStates[fx.id] = parsed[fx.id];
        });
      }
    } catch (e) { }
  }

  function saveEffectStates() {
    try { localStorage.setItem('vaporsoft-effects', JSON.stringify(effectStates)); } catch (e) { }
  }

  function applyEffectStates() {
    var screen = document.getElementById('screen');
    if (!screen) return;
    CRT_EFFECTS.forEach(function (fx) {
      screen.classList.toggle(fx.cls, !effectStates[fx.id]);
    });
  }

  reg('effects', function () {
    safeOpenDialogue('effects');
    S.effectsIdx = 0;
    renderEffectsBrowser();
  }, 'Toggle CRT screen effects');

  function renderEffectsBrowser() {
    var old = $out.querySelector('.effects-browser');
    if (old) old.remove();

    var box = document.createElement('div');
    box.className = 'effects-browser tui-box';

    var rows = '';
    CRT_EFFECTS.forEach(function (fx, i) {
      var sel = i === S.effectsIdx;
      var on = effectStates[fx.id];
      var toggle = on
        ? '<span class="c-green-b">' + NF.check + ' ON</span>'
        : '<span class="c-red">' + NF.times + ' OFF</span>';
      rows +=
        '<div class="tui-row' + (sel ? ' selected' : '') + '" data-idx="' + i + '">' +
        '<span class="indicator">' + (sel ? NF.caretR : ' ') + '</span>' +
        '<span class="effect-toggle">' + toggle + '</span>' +
        '<span class="effect-label">' + escHTML(fx.label) + '</span>' +
        '<span class="effect-desc">' + escHTML(fx.desc) + '</span>' +
        '</div>';
    });

    box.innerHTML =
      '<div class="tui-header">' + NF.monitor + ' CRT EFFECTS ' + NF.monitor + '</div>' +
      '<div class="tui-body">' + rows + '</div>' +
      '<div class="tui-footer">' +
      '<span class="tui-hints">' + NF.arrowUp + NF.arrowDown + ' Navigate \u00b7 Enter Toggle \u00b7 q Close</span>' +
      '<span class="tui-actions">' +
      '<button class="tui-btn" data-action="up">' + NF.arrowUp + '</button>' +
      '<button class="tui-btn" data-action="down">' + NF.arrowDown + '</button>' +
      '<button class="tui-btn tui-btn-primary" data-action="select">' + NF.check + ' Toggle</button>' +
      '<button class="tui-btn" data-action="close">' + NF.times + '</button>' +
      '</span>' +
      '</div>';

    $out.appendChild(box);
    bindTuiActions(box);

    box.querySelectorAll('.tui-row').forEach(function (row) {
      row.addEventListener('click', function () {
        var idx = parseInt(row.dataset.idx, 10);
        if (S.effectsIdx === idx) {
          toggleEffect(idx);
        } else {
          S.effectsIdx = idx;
        }
        renderEffectsBrowser();
        focusInput();
      });
    });

    var selRow = box.querySelector('.tui-row.selected');
    if (selRow) selRow.scrollIntoView({ block: 'nearest' });

    scroll();
    updateMobileBar();
  }

  function toggleEffect(idx) {
    var fx = CRT_EFFECTS[idx];
    effectStates[fx.id] = !effectStates[fx.id];
    applyEffectStates();
    saveEffectStates();
  }

  function effectsBrowserKey(e) {
    switch (e.key) {
      case 'ArrowUp': case 'w': case 'W': case 'k':
        e.preventDefault();
        if (S.effectsIdx === 0) triggerGlitch();
        else S.effectsIdx--;
        renderEffectsBrowser();
        break;
      case 'ArrowDown': case 's': case 'S': case 'j':
        e.preventDefault();
        if (S.effectsIdx === CRT_EFFECTS.length - 1) triggerGlitch();
        else S.effectsIdx++;
        renderEffectsBrowser();
        break;
      case 'Enter': case ' ':
        e.preventDefault();
        toggleEffect(S.effectsIdx);
        renderEffectsBrowser();
        break;
      case 'Escape': case 'q':
        e.preventDefault();
        exitEffectsBrowser();
        break;
    }
  }

  function exitEffectsBrowser() {
    var el = $out.querySelector('.effects-browser');
    if (el) el.remove();
    S.mode = 'normal';
    $inputLine.style.display = '';
    updatePrompt();
    focusInput();
    scroll();
    updateMobileBar();
  }

  // ================================================================
  //  COMMAND: history — browse & re-run past commands
  // ================================================================
  reg('history', function (args) {
    if (args[0] === 'clear') {
      S.history = [];
      S.histIdx = -1;
      print(h('span', 'c-cyan', '  ' + NF.check + ' History cleared'));
      return;
    }
    if (!S.history.length) {
      print(h('span', 'c-dim', '  No commands in history yet'));
      return;
    }
    safeOpenDialogue('history');
    S.histBrowserIdx = 0;
    renderHistoryBrowser();
  }, 'Browse command history');

  function renderHistoryBrowser() {
    var old = $out.querySelector('.history-browser');
    if (old) old.remove();

    var box = document.createElement('div');
    box.className = 'history-browser tui-box';

    var entries = S.history.slice().reverse();
    var rows = '';
    entries.forEach(function (cmd, i) {
      var sel = i === S.histBrowserIdx;
      rows +=
        '<div class="tui-row' + (sel ? ' selected' : '') + '" data-idx="' + i + '">' +
        '<span class="indicator">' + (sel ? NF.caretR : ' ') + '</span>' +
        '<span class="hist-num">' + (entries.length - i) + '</span>' +
        '<span class="hist-cmd">' + escHTML(cmd) + '</span>' +
        '</div>';
    });

    box.innerHTML =
      '<div class="tui-header">' + NF.archive + ' COMMAND HISTORY \u2014 ' + entries.length + ' entries ' + NF.archive + '</div>' +
      '<div class="tui-body">' + rows + '</div>' +
      '<div class="tui-footer">' +
      '<span class="tui-hints">' + NF.arrowUp + NF.arrowDown + ' Navigate \u00b7 Enter Re-run \u00b7 q Close</span>' +
      '<span class="tui-actions">' +
      '<button class="tui-btn" data-action="up">' + NF.arrowUp + '</button>' +
      '<button class="tui-btn" data-action="down">' + NF.arrowDown + '</button>' +
      '<button class="tui-btn tui-btn-primary" data-action="select">' + NF.play + ' Run</button>' +
      '<button class="tui-btn" data-action="close">' + NF.times + '</button>' +
      '</span>' +
      '</div>';

    $out.appendChild(box);
    bindTuiActions(box);

    box.querySelectorAll('.tui-row').forEach(function (row) {
      row.addEventListener('click', function () {
        var idx = parseInt(row.dataset.idx, 10);
        if (S.histBrowserIdx === idx) {
          exitHistoryBrowser();
          exec(entries[idx]);
        } else {
          S.histBrowserIdx = idx;
          renderHistoryBrowser();
        }
        focusInput();
      });
    });

    var selRow = box.querySelector('.tui-row.selected');
    if (selRow) selRow.scrollIntoView({ block: 'nearest' });

    scroll();
    updateMobileBar();
  }

  function historyBrowserKey(e) {
    var entries = S.history.slice().reverse();
    switch (e.key) {
      case 'PageUp': case 'PageDown':
        e.preventDefault();
        scrollActivePanel(e.key === 'PageDown');
        break;
      case 'ArrowUp': case 'w': case 'W': case 'k':
        e.preventDefault();
        if (S.histBrowserIdx === 0) triggerGlitch();
        else S.histBrowserIdx--;
        renderHistoryBrowser();
        break;
      case 'ArrowDown': case 's': case 'S': case 'j':
        e.preventDefault();
        if (S.histBrowserIdx === entries.length - 1) triggerGlitch();
        else S.histBrowserIdx++;
        renderHistoryBrowser();
        break;
      case 'Enter':
        e.preventDefault();
        var cmd = entries[S.histBrowserIdx];
        exitHistoryBrowser();
        exec(cmd);
        break;
      case 'Escape': case 'q':
        e.preventDefault();
        exitHistoryBrowser();
        break;
    }
  }

  function exitHistoryBrowser() {
    var el = $out.querySelector('.history-browser');
    if (el) el.remove();
    S.mode = 'normal';
    $inputLine.style.display = '';
    updatePrompt();
    focusInput();
    scroll();
    updateMobileBar();
  }

  // ================================================================
  //  COMMAND: share — shareable configuration URL
  // ================================================================
  reg('share', function () {
    var params = new URLSearchParams();
    params.set('theme', currentTheme);
    params.set('prompt', currentPromptStyle);
    if (currentBadgeStyle !== 'default') params.set('badge', currentBadgeStyle);

    // Include disabled effects only
    var disabled = [];
    CRT_EFFECTS.forEach(function (fx) {
      if (!effectStates[fx.id]) disabled.push(fx.id);
    });
    if (disabled.length) params.set('fx', disabled.join(','));

    var url = location.origin + location.pathname + '?' + params.toString();
    print('');
    print(h('span', 'c-amber c-bold', '  ' + NF.link + ' Shareable Configuration URL'));
    print(h('span', 'c-dim', '  \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500'));
    print(h('span', 'c-white c-bold', '  ' + NF.palette + ' Theme:  ') + h('span', 'c-green-b', currentTheme));
    print(h('span', 'c-white c-bold', '  ' + NF.cmd + ' Prompt: ') + h('span', 'c-green-b', currentPromptStyle));
    print(h('span', 'c-white c-bold', '  ' + NF.tag + ' Badge:  ') + h('span', 'c-green-b', currentBadgeStyle));
    if (disabled.length) {
      print(h('span', 'c-white c-bold', '  ' + NF.monitor + ' FX off: ') + h('span', 'c-dim', disabled.join(', ')));
    }
    print('');
    print('  ' + h('span', 'c-cyan', url));
    print('');

    // Copy to clipboard
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(function () {
        toast('URL copied to clipboard!');
      }).catch(function () {
        toast('Copy the URL above to share');
      });
    } else {
      toast('Copy the URL above to share');
    }
  }, 'Generate shareable config URL');

  // ================================================================
  //  COMMAND: projects (live GitHub fetch)
  // ================================================================
  function fetchPinned() {
    if (S.pinnedLoaded) return Promise.resolve();
    return fetch('pinned.json').then(function (resp) {
      if (!resp.ok) throw new Error('no pinned.json');
      return resp.json();
    }).then(function (data) {
      if (Array.isArray(data)) {
        S.pinnedNames = data.map(function (r) { return r.name; });
      }
      S.pinnedLoaded = true;
    }).catch(function () {
      S.pinnedNames = CFG.pinned || [];
      S.pinnedLoaded = true;
    });
  }

  reg('github', function (args) {
    if (!S.reposLoaded && !S.reposLoading) {
      S.reposLoading = true;
      print(h('span', 'c-dim', '  ' + NF.arrowRight + ' Fetching repositories from GitHub...'));

      var repoUrl = CFG.githubAPI + '/users/' + encodeURIComponent(CFG.github) + '/repos?per_page=100&sort=updated';
      var repoFetch = fetch(repoUrl).then(function (resp) {
        if (!resp.ok) throw new Error('GitHub API returned ' + resp.status);
        return resp.json();
      }).then(function (data) {
        S.repos = data
          .filter(function (r) { return !r.private && !r.fork; })
          .sort(function (a, b) { return new Date(b.pushed_at) - new Date(a.pushed_at); });
        S.reposLoaded = true;
        S.reposLoading = false;
      });

      Promise.all([repoFetch, fetchPinned()]).then(function () {
        safeOpenDialogue('browser');
        S.browserIdx = 0;
        renderBrowser();
      }).catch(function (e) {
        print(h('span', 'c-red', '  ' + NF.times + ' Failed to fetch repos: ' + escHTML(e.message)));
        triggerGlitch();
        S.reposLoading = false;
      });
      return;
    }

    if (S.repos.length === 0) {
      print(h('span', 'c-dim', '  No public repositories found.'));
      return;
    }

    safeOpenDialogue('browser');
    S.browserIdx = 0;
    renderBrowser();
  }, 'Browse GitHub repositories');
  reg('projects', CMDS.github.fn, 'Browse GitHub repositories (alias)', true);

  var LANG_BADGE_MAP = {
    'JavaScript': { badge: 'JS', cls: 'badge-js' },
    'TypeScript': { badge: 'TS', cls: 'badge-ts' },
    'Python': { badge: 'PY', cls: 'badge-py' },
    'Jupyter Notebook': { badge: 'JNB', cls: 'badge-py' },
    'Rust': { badge: 'RS', cls: 'badge-rs' },
    'Go': { badge: 'GO', cls: 'badge-go' },
    'CSS': { badge: 'CSS', cls: 'badge-css' },
    'HTML': { badge: 'HTML', cls: 'badge-html' },
    'C++': { badge: 'C++', cls: 'badge-cpp' },
    'C#': { badge: 'C#', cls: 'badge-cs' },
    'C': { badge: 'C', cls: 'badge-cpp' },
    'Java': { badge: 'JV', cls: 'badge-java' },
    'Kotlin': { badge: 'KT', cls: 'badge-kotlin' },
    'Swift': { badge: 'SW', cls: 'badge-swift' },
    'Dart': { badge: 'DT', cls: 'badge-dart' },
    'Ruby': { badge: 'RB', cls: 'badge-ruby' },
    'PHP': { badge: 'PHP', cls: 'badge-php' },
    'Perl': { badge: 'PL', cls: 'badge-perl' },
    'Lua': { badge: 'LUA', cls: 'badge-lua' },
    'Shell': { badge: 'SH', cls: 'badge-shell' },
    'Bash': { badge: 'SH', cls: 'badge-shell' },
    'PowerShell': { badge: 'PS', cls: 'badge-ps' },
    'R': { badge: 'R', cls: 'badge-r' },
    'MATLAB': { badge: 'MAT', cls: 'badge-matlab' },
    'Julia': { badge: 'JL', cls: 'badge-julia' },
    'Scala': { badge: 'SC', cls: 'badge-scala' },
    'Clojure': { badge: 'CLJ', cls: 'badge-clojure' },
    'Haskell': { badge: 'HS', cls: 'badge-haskell' },
    'Elixir': { badge: 'EX', cls: 'badge-elixir' },
    'Erlang': { badge: 'ERL', cls: 'badge-erlang' },
    'F#': { badge: 'F#', cls: 'badge-fsharp' },
    'OCaml': { badge: 'ML', cls: 'badge-ocaml' },
    'Zig': { badge: 'ZIG', cls: 'badge-zig' },
    'Nim': { badge: 'NIM', cls: 'badge-nim' },
    'V': { badge: 'V', cls: 'badge-go' },
    'Assembly': { badge: 'ASM', cls: 'badge-asm' },
    'WASM': { badge: 'WA', cls: 'badge-wasm' },
    'SQL': { badge: 'SQL', cls: 'badge-sql' },
    'GraphQL': { badge: 'GQL', cls: 'badge-gql' },
    'Solidity': { badge: 'SOL', cls: 'badge-sol' },
    'YAML': { badge: 'YML', cls: 'badge-yaml' },
    'TOML': { badge: 'TML', cls: 'badge-toml' },
    'JSON': { badge: 'JSN', cls: 'badge-json' },
    'Markdown': { badge: 'MD', cls: 'badge-md' },
    'LaTeX': { badge: 'TEX', cls: 'badge-latex' },
    'Dockerfile': { badge: 'DKR', cls: 'badge-docker' },
    'Makefile': { badge: 'MK', cls: 'badge-shell' },
    'Objective-C': { badge: 'OC', cls: 'badge-objc' },
    'Svelte': { badge: 'SVT', cls: 'badge-svelte' },
    'Vue': { badge: 'VUE', cls: 'badge-vue' },
    'Sass': { badge: 'SAS', cls: 'badge-sass' },
    'SCSS': { badge: 'SCS', cls: 'badge-sass' },
    'Less': { badge: 'LES', cls: 'badge-css' },
    'CoffeeScript': { badge: 'COF', cls: 'badge-coffee' },
    'Crystal': { badge: 'CR', cls: 'badge-crystal' },
    'Fortran': { badge: 'FTN', cls: 'badge-fortran' },
    'COBOL': { badge: 'COB', cls: 'badge-cobol' },
    'Pascal': { badge: 'PAS', cls: 'badge-pascal' },
    'Groovy': { badge: 'GRV', cls: 'badge-groovy' },
    'Terraform': { badge: 'TF', cls: 'badge-terraform' },
    'HCL': { badge: 'HCL', cls: 'badge-terraform' },
    'Nix': { badge: 'NIX', cls: 'badge-nix' },
    'Verilog': { badge: 'VLG', cls: 'badge-verilog' },
    'VHDL': { badge: 'VHD', cls: 'badge-verilog' },
    'Prolog': { badge: 'PRO', cls: 'badge-prolog' },
    'D': { badge: 'D', cls: 'badge-dlang' },
    'Ada': { badge: 'ADA', cls: 'badge-ada' },
    'Apex': { badge: 'APX', cls: 'badge-apex' },
    'ABAP': { badge: 'ABP', cls: 'badge-abap' },
    'GDScript': { badge: 'GDS', cls: 'badge-gdscript' },
    'Gleam': { badge: 'GLM', cls: 'badge-gleam' },
    'Raku': { badge: 'RKU', cls: 'badge-raku' },
    'Tcl': { badge: 'TCL', cls: 'badge-tcl' },
    'Scheme': { badge: 'SCM', cls: 'badge-scheme' },
    'Racket': { badge: 'RKT', cls: 'badge-racket' },
    'Common Lisp': { badge: 'CL', cls: 'badge-lisp' },
    'Emacs Lisp': { badge: 'EL', cls: 'badge-lisp' },
    'Fennel': { badge: 'FNL', cls: 'badge-fennel' },
    'Forth': { badge: 'FTH', cls: 'badge-forth' },
    'Smalltalk': { badge: 'ST', cls: 'badge-smalltalk' },
    'CUDA': { badge: 'CU', cls: 'badge-cuda' },
    'GLSL': { badge: 'GLS', cls: 'badge-glsl' },
    'HLSL': { badge: 'HLS', cls: 'badge-hlsl' },
    'Mojo': { badge: 'MOJ', cls: 'badge-mojo' },
    'Carbon': { badge: 'CBN', cls: 'badge-carbon' },
    'Odin': { badge: 'ODN', cls: 'badge-odin' },
    'CMake': { badge: 'CMK', cls: 'badge-cmake' },
    'Starlark': { badge: 'STR', cls: 'badge-starlark' },
    'Astro': { badge: 'AST', cls: 'badge-astro' },
    'MDX': { badge: 'MDX', cls: 'badge-mdx' },
    'Pug': { badge: 'PUG', cls: 'badge-pug' },
    'Handlebars': { badge: 'HBS', cls: 'badge-hbs' },
    'EJS': { badge: 'EJS', cls: 'badge-ejs' },
    'Twig': { badge: 'TWG', cls: 'badge-twig' },
    'Jinja': { badge: 'JNJ', cls: 'badge-jinja' },
    'Hack': { badge: 'HCK', cls: 'badge-hack' },
    'Cython': { badge: 'CYT', cls: 'badge-cython' },
    'Reason': { badge: 'RE', cls: 'badge-reason' },
    'ReScript': { badge: 'RES', cls: 'badge-rescript' },
    'Elm': { badge: 'ELM', cls: 'badge-elm' },
    'PureScript': { badge: 'PUR', cls: 'badge-purescript' },
    'Idris': { badge: 'IDR', cls: 'badge-idris' },
    'Agda': { badge: 'AGD', cls: 'badge-agda' },
    'Coq': { badge: 'COQ', cls: 'badge-coq' },
    'Lean': { badge: 'LN', cls: 'badge-lean' },
    'Puppet': { badge: 'PPT', cls: 'badge-puppet' },
    'Dhall': { badge: 'DHL', cls: 'badge-dhall' },
    'Jsonnet': { badge: 'JNT', cls: 'badge-jsonnet' },
  };

  function getLangBadge(lang) {
    if (!lang) return { badge: '--', cls: 'badge-default' };
    return LANG_BADGE_MAP[lang] || { badge: lang.slice(0, 3).toUpperCase(), cls: 'badge-default' };
  }

  function getVisibleRepos() {
    var pinList = S.pinnedNames.length > 0 ? S.pinnedNames : (CFG.pinned || []);
    if (S.browserView === 'pinned' && pinList.length > 0) {
      return S.repos.filter(function (r) { return pinList.indexOf(r.name) !== -1; });
    }
    return S.repos;
  }

  function renderBrowser() {
    var old = $out.querySelector('.project-browser');
    if (old) old.remove();

    var box = document.createElement('div');
    box.className = 'project-browser tui-box';

    var pinList = S.pinnedNames.length > 0 ? S.pinnedNames : (CFG.pinned || []);
    var hasPinned = pinList.length > 0;
    var visible = getVisibleRepos();

    // Pinned section (sticky, above the scrollable body)
    var pinnedHTML = '';
    if (hasPinned && S.browserView === 'all') {
      var pinnedRepos = S.repos.filter(function (r) { return pinList.indexOf(r.name) !== -1; });
      if (pinnedRepos.length > 0) {
        var pinnedCards = '';
        pinnedRepos.forEach(function (r) {
          var lb = getLangBadge(r.language);
          var desc = r.description ? escHTML(r.description) : '<span class="c-dim">No description</span>';
          var stars = r.stargazers_count > 0 ? ' ' + NF.star + r.stargazers_count : '';
          pinnedCards +=
            '<div class="pinned-card">' +
            '<div class="pinned-card-name">' + NF.star + ' ' + escHTML(r.name) + ' <span class="badge ' + lb.cls + '">' + lb.badge + '</span>' + stars + '</div>' +
            '<div class="pinned-card-desc">' + desc + '</div>' +
            '</div>';
        });
        pinnedHTML =
          '<div class="pinned-section">' +
          '<div class="pinned-header">' + NF.star + ' PINNED</div>' +
          pinnedCards +
          '</div>';
      }
    }

    var rows = '';
    visible.forEach(function (r, i) {
      var sel = i === S.browserIdx;
      var lb = getLangBadge(r.language);
      var desc = r.description ? escHTML(r.description) : h('span', 'c-dim', 'No description');
      var stars = r.stargazers_count > 0 ? '<span class="proj-stars">' + NF.star + r.stargazers_count + '</span>' : '';
      rows +=
        '<div class="tui-row' + (sel ? ' selected' : '') + '" data-idx="' + i + '">' +
        '<span class="indicator">' + (sel ? NF.caretR : ' ') + '</span>' +
        '<span class="proj-name">' + escHTML(r.name) + '</span>' +
        '<span class="badge ' + lb.cls + '">' + lb.badge + '</span>' +
        stars +
        '<span class="proj-desc">' + desc + '</span>' +
        '</div>';
    });

    var viewLabel = S.browserView === 'pinned' ? NF.star + ' Pinned' : NF.github + ' All';
    var tabHint = hasPinned ? (' \u00b7 v ' + viewLabel) : '';

    box.innerHTML =
      '<div class="tui-header">' + NF.github + ' GITHUB \u2014 ' + CFG.github + ' \u00b7 ' + visible.length + ' repos ' + NF.github + '</div>' +
      pinnedHTML +
      '<div class="tui-body">' + rows + '</div>' +
      '<div class="tui-footer">' +
      '<span class="tui-hints">' + NF.arrowUp + NF.arrowDown + ' Navigate \u00b7 Enter Open \u00b7 PgUp/PgDn Scroll \u00b7 q Close' + tabHint + '</span>' +
      '<span class="tui-actions">' +
      (hasPinned ? '<button class="tui-btn" data-action="toggle-view">' + NF.star + '</button>' : '') +
      '<button class="tui-btn" data-action="up">' + NF.arrowUp + '</button>' +
      '<button class="tui-btn" data-action="down">' + NF.arrowDown + '</button>' +
      '<button class="tui-btn tui-btn-primary" data-action="select">' + NF.arrowRight + ' Open</button>' +
      '<button class="tui-btn" data-action="close">' + NF.times + '</button>' +
      '</span>' +
      '</div>';

    $out.appendChild(box);
    bindTuiActions(box);

    box.querySelectorAll('.tui-row').forEach(function (row) {
      row.addEventListener('click', function () {
        var idx = parseInt(row.dataset.idx, 10);
        if (S.browserIdx === idx) {
          var visible = getVisibleRepos();
          var realIdx = S.repos.indexOf(visible[idx]);
          showProjectDetail(realIdx >= 0 ? realIdx : idx);
        } else {
          S.browserIdx = idx;
          updateBrowserSelection(box);
        }
        focusInput();
      });
    });

    var selRow = box.querySelector('.tui-row.selected');
    if (selRow) selRow.scrollIntoView({ block: 'nearest' });

    scroll();
    updateMobileBar();
  }

  function updateBrowserSelection(box) {
    if (!box) box = $out.querySelector('.project-browser');
    if (!box) return;
    box.querySelectorAll('.tui-row').forEach(function (row, i) {
      var sel = i === S.browserIdx;
      row.classList.toggle('selected', sel);
      row.querySelector('.indicator').textContent = sel ? NF.caretR : ' ';
    });
    var selRow = box.querySelector('.tui-row.selected');
    if (selRow) selRow.scrollIntoView({ block: 'nearest' });
    scroll();
  }

  function browserKey(e) {
    var visible = getVisibleRepos();
    switch (e.key) {
      case 'PageUp': case 'PageDown':
        e.preventDefault();
        scrollActivePanel(e.key === 'PageDown');
        break;
      case 'ArrowUp': case 'w': case 'W': case 'k':
        e.preventDefault();
        if (S.browserIdx === 0) {
          triggerGlitch();
        } else {
          S.browserIdx = Math.max(0, S.browserIdx - 1);
        }
        updateBrowserSelection();
        break;
      case 'ArrowDown': case 's': case 'S': case 'j':
        e.preventDefault();
        if (S.browserIdx === visible.length - 1) {
          triggerGlitch();
        } else {
          S.browserIdx = Math.min(visible.length - 1, S.browserIdx + 1);
        }
        updateBrowserSelection();
        break;
      case 'Enter':
        e.preventDefault();
        var realIdx = S.repos.indexOf(visible[S.browserIdx]);
        showProjectDetail(realIdx >= 0 ? realIdx : S.browserIdx);
        break;
      case 'v': case 'V':
        e.preventDefault();
        S.browserView = S.browserView === 'all' ? 'pinned' : 'all';
        S.browserIdx = 0;
        renderBrowser();
        break;
      case 'Escape': case 'q':
        e.preventDefault();
        exitBrowser();
        break;
    }
  }

  function exitBrowser() {
    var old = $out.querySelector('.project-browser');
    if (old) old.remove();
    S.mode = 'normal';
    $inputLine.style.display = '';
    updatePrompt();
    focusInput();
    scroll();
    updateMobileBar();
  }

  // ================================================================
  //  PROJECT DETAIL VIEW (rich markdown-style)
  // ================================================================
  function showProjectDetail(idx) {
    S.mode = 'detail';
    S.detailIdx = idx;
    S.innerFocus = false;
    var r = S.repos[idx];

    var old = $out.querySelector('.project-browser');
    if (old) old.remove();

    var box = document.createElement('div');
    box.className = 'project-browser tui-box';

    var lb = getLangBadge(r.language);
    var created = new Date(r.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    var updated = new Date(r.pushed_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

    var detailHTML =
      detailRow(NF.tag + ' Name', escHTML(r.name)) +
      detailRow(NF.code + ' Lang', '<span class="badge ' + lb.cls + '">' + lb.badge + '</span> ' + (r.language || 'N/A')) +
      detailRow(NF.bars + ' Desc', r.description ? escHTML(r.description) : h('span', 'c-dim', 'No description')) +
      detailRow(NF.calendar + ' Created', created) +
      detailRow(NF.clock + ' Updated', updated) +
      detailRow(NF.star + ' Stars', r.stargazers_count) +
      detailRow(NF.fork + ' Forks', r.forks_count) +
      detailRow(NF.link + ' URL', '<a href="' + escHTML(r.html_url) + '" class="c-cyan" target="_blank" rel="noopener">' + escHTML(r.html_url) + '</a>');

    box.innerHTML =
      '<div class="tui-header">' + NF.diamond + ' ' + escHTML(r.name) + ' ' + NF.diamond + '</div>' +
      '<div class="tui-detail" id="detail-content">' + detailHTML + '</div>' +
      '<div class="tui-footer">' +
      '<span class="tui-hints">' + NF.arrowLeft + ' Back \u00b7 PgUp/PgDn Scroll \u00b7 q Close</span>' +
      '<span class="tui-actions">' +
      '<button class="tui-btn" data-action="back">' + NF.arrowLeft + ' Back</button>' +
      '<button class="tui-btn" data-action="close">' + NF.times + ' Close</button>' +
      '</span>' +
      '</div>';

    $out.appendChild(box);
    bindTuiActions(box);
    scroll();
    updateMobileBar();

    // Fetch README
    var readmeUrl = CFG.githubAPI + '/repos/' + encodeURIComponent(CFG.github) + '/' + encodeURIComponent(r.name) + '/readme';
    fetch(readmeUrl, { headers: { 'Accept': 'application/vnd.github.raw+json' } })
      .then(function (resp) { if (resp.ok) return resp.text(); throw new Error('no readme'); })
      .then(function (readme) {
        var detailEl = document.getElementById('detail-content');
        if (detailEl) {
          var readmeDiv = document.createElement('div');
          readmeDiv.className = 'readme-block';
          readmeDiv.innerHTML =
            '<div class="readme-header">\u2500\u2500 README.md \u2500\u2500</div>' +
            '<div class="readme-body">' + renderMarkdown(readme) + '</div>';
          detailEl.appendChild(readmeDiv);
          updateDetailFooter();
          scroll();
        }
      })
      .catch(function () { });

    // Fetch releases
    var relUrl = CFG.githubAPI + '/repos/' + encodeURIComponent(CFG.github) + '/' + encodeURIComponent(r.name) + '/releases?per_page=5';
    fetch(relUrl)
      .then(function (resp) { if (resp.ok) return resp.json(); throw new Error('no releases'); })
      .then(function (releases) {
        if (releases.length > 0) {
          var detailEl = document.getElementById('detail-content');
          if (detailEl) {
            var relDiv = document.createElement('div');
            relDiv.className = 'readme-block';
            var relHTML = '<div class="readme-header">\u2500\u2500 Releases \u2500\u2500</div><div class="readme-body">';
            releases.forEach(function (rel) {
              var tag = escHTML(rel.tag_name);
              var rname = escHTML(rel.name || rel.tag_name);
              relHTML += '<div class="release-item">';
              relHTML += h('span', 'c-amber c-bold', NF.caretR + ' ' + rname) + ' ' + h('span', 'c-dim', '(' + tag + ')') + '\n';
              if (rel.body) {
                relHTML += h('span', 'c-white', '  ' + escHTML(rel.body).slice(0, 200)) + '\n';
              }
              if (rel.assets && rel.assets.length > 0) {
                rel.assets.forEach(function (a) {
                  relHTML += '  <a href="' + escHTML(a.browser_download_url) + '" class="c-cyan" target="_blank" rel="noopener">' + NF.download + ' ' + escHTML(a.name) + '</a> ' + h('span', 'c-dim', '(' + formatBytes(a.size) + ')') + '\n';
                });
              }
              if (rel.zipball_url) {
                relHTML += '  <a href="' + escHTML(rel.zipball_url) + '" class="c-cyan" target="_blank" rel="noopener">' + NF.download + ' Source (zip)</a>\n';
              }
              relHTML += '</div>';
            });
            relHTML += '</div>';
            relDiv.innerHTML = relHTML;
            detailEl.appendChild(relDiv);
            scroll();
          }
        }
      })
      .catch(function () { });
  }

  function formatBytes(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  }

  function detailRow(k, v) {
    return '<div class="detail-row"><dt>' + k + '</dt><dd>' + v + '</dd></div>';
  }

  function renderMarkdown(md) {
    return md.split('\n').map(function (line) {
      if (line.startsWith('### ')) return h('span', 'c-cyan c-bold', escHTML(line.slice(4))) + '\n';
      if (line.startsWith('## ')) return h('span', 'c-cyan c-bold', escHTML(line.slice(3))) + '\n';
      if (line.startsWith('# ')) return h('span', 'c-amber c-bold', escHTML(line.slice(2))) + '\n';
      if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) return h('span', 'c-dim', '\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500') + '\n';
      if (/^\s*[-*+]\s/.test(line)) return h('span', 'c-green-b', '  ' + NF.caretR + ' ') + escHTML(line.replace(/^\s*[-*+]\s/, '')) + '\n';
      if (line.startsWith('```')) return '';
      var processed = escHTML(line);
      processed = processed.replace(/\*\*(.+?)\*\*/g, '<span class="c-white c-bold">$1</span>');
      processed = processed.replace(/`(.+?)`/g, '<span class="c-amber">$1</span>');
      processed = processed.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (m, text, url) {
        if (/^https?:\/\//i.test(url)) return '<a href="' + escHTML(url) + '" target="_blank" rel="noopener noreferrer" class="c-cyan">' + text + '</a>';
        return m;
      });
      return processed + '\n';
    }).join('');
  }

  function detailKey(e) {
    switch (e.key) {
      case 'Tab':
        e.preventDefault();
        toggleInnerFocus();
        break;
      case 'PageUp': case 'PageDown':
        e.preventDefault();
        scrollActivePanel(e.key === 'PageDown');
        break;
      case 'Backspace': case 'ArrowLeft':
        e.preventDefault();
        S.innerFocus = false;
        var old = $out.querySelector('.project-browser');
        if (old) old.remove();
        S.mode = 'browser';
        renderBrowser();
        break;
      case 'Escape': case 'q':
        e.preventDefault();
        S.innerFocus = false;
        var box2 = $out.querySelector('.project-browser');
        if (box2) box2.remove();
        exitBrowser();
        break;
    }
  }

  // ================================================================
  //  COMMAND: links / social
  // ================================================================
  reg('links', function () {
    var sep = h('span', 'c-dim', '  \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500');
    var links = [
      { icon: NF.github, label: 'GitHub', url: 'https://github.com/' + CFG.github, cls: 'c-white' },
      { icon: NF.globe, label: 'Website', url: 'https://' + CFG.host, cls: 'c-cyan' },
      { icon: NF.link, label: 'LinkedIn', url: 'https://linkedin.com/in/corderro', cls: 'c-blue' },
      { icon: NF.code, label: 'Dev.to', url: 'https://dev.to/corderro', cls: 'c-green-b' },
    ];

    print('');
    print(h('span', 'c-amber c-bold', '  ' + NF.link + ' LINKS & SOCIAL'));
    print(sep);
    print('');
    print(h('span', 'c-dim', '  ' + NF.terminal + ' ') + h('span', 'c-green-b c-bold', CFG.host) + h('span', 'c-dim', ' \u2014 CRT terminal portfolio'));
    print(h('span', 'c-dim', '  Retro terminal with 125 themes, 50+ prompts, TUI browsers'));
    print('');
    print(sep);

    for (var i = 0; i < links.length; i++) {
      var l = links[i];
      printBlock(
        '<div class="links-row">' +
        '<span class="links-icon ' + l.cls + '">' + l.icon + '</span>' +
        '<span class="links-label">' + l.label + '</span>' +
        '<a href="' + escHTML(l.url) + '" class="links-url c-cyan" target="_blank" rel="noopener">' + escHTML(l.url) + '</a>' +
        '</div>'
      );
    }

    print('');
    print(sep);
    print(h('span', 'c-dim', '  Built with vanilla JS \u00b7 No frameworks \u00b7 Pure vibes'));
    print('');
  }, 'View links & social profiles');
  reg('social', CMDS.links.fn, 'View links & social profiles (alias)', true);

  // ================================================================
  //  COMMAND: showcase / dev panel
  // ================================================================
  reg('showcase', function () {
    var sep = h('span', 'c-dim', '  \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500');

    print('');
    print(h('span', 'c-amber c-bold', '  ' + NF.eye + ' DESIGN SHOWCASE'));
    print(sep);

    // â”€â”€ Language & Framework Badges â”€â”€
    print('');
    print(h('span', 'c-white c-bold', '  ' + NF.code + ' Language & Framework Badges (' + Object.keys(LANG_BADGE_MAP).length + ')'));
    printBlock('<div class="badge-grid">' + langBadges() + '</div>');

    // â”€â”€ Theme Color Palette (live from current theme) â”€â”€
    print('');
    print(h('span', 'c-white c-bold', '  ' + NF.palette + ' Theme Color Palette'));
    printBlock('  ' + colorBlocks());
    var cs = getComputedStyle(document.documentElement);
    var varNames = ['--bg', '--green', '--green-bright', '--green-dim', '--amber', '--cyan', '--red', '--magenta', '--purple', '--white', '--white-bright', '--gray'];
    var swatches = '  ';
    for (var vi = 0; vi < varNames.length; vi++) {
      var val = cs.getPropertyValue(varNames[vi]).trim();
      swatches += '<span class="showcase-swatch" style="background:' + val + '" title="' + varNames[vi] + ' = ' + escHTML(val) + '"></span>';
      swatches += h('span', 'c-dim', varNames[vi].replace('--', '') + ' ');
    }
    printBlock(swatches);

    // â”€â”€ Theme Type Badges â”€â”€
    print('');
    print(h('span', 'c-white c-bold', '  ' + NF.sun + ' Theme Type Badges'));
    print('  <span class="badge badge-dark">' + NF.moon + ' DARK</span> <span class="badge badge-light">' + NF.sun + ' LIGHT</span> <span class="badge badge-animated">' + NF.bolt + ' ANIM</span>');

    // â”€â”€ Nerd Font Glyphs â”€â”€
    print('');
    print(h('span', 'c-white c-bold', '  ' + NF.diamond + ' Nerd Font Glyphs (' + Object.keys(NF).length + ')'));
    var glyphKeys = Object.keys(NF);
    var glyphLine = '  ';
    for (var i = 0; i < glyphKeys.length; i++) {
      glyphLine += '<span class="showcase-glyph" title="' + escHTML(glyphKeys[i]) + '">' + NF[glyphKeys[i]] + '</span> ';
      if ((i + 1) % 16 === 0) { printBlock(glyphLine); glyphLine = '  '; }
    }
    if (glyphLine.trim()) printBlock(glyphLine);

    // â”€â”€ Glyph Legend â”€â”€
    print('');
    print(h('span', 'c-white c-bold', '  ' + NF.tag + ' Glyph Reference'));
    var legendLine = '';
    for (var j = 0; j < glyphKeys.length; j++) {
      legendLine +=
        '<div class="showcase-legend-row">' +
        '<span class="showcase-glyph-lg">' + NF[glyphKeys[j]] + '</span>' +
        '<span class="c-dim">' + escHTML(glyphKeys[j]) + '</span>' +
        '</div>';
    }
    printBlock('<div class="showcase-legend">' + legendLine + '</div>');

    // â”€â”€ Text Style Classes â”€â”€
    print('');
    print(h('span', 'c-white c-bold', '  ' + NF.paint + ' Text Style Classes'));
    var styles = [
      ['c-red', 'Red'], ['c-green-b', 'Green'], ['c-amber', 'Amber'],
      ['c-cyan', 'Cyan'], ['c-blue', 'Blue'], ['c-white', 'White'],
      ['c-dim', 'Dim'], ['c-red c-bold', 'Bold Red'], ['c-amber c-bold', 'Bold Amber'],
      ['c-cyan c-bold', 'Bold Cyan'], ['c-white c-bold', 'Bold White'],
    ];
    var styleLine = '  ';
    for (var si = 0; si < styles.length; si++) {
      styleLine += h('span', styles[si][0], styles[si][1]) + '  ';
    }
    print(styleLine);

    // â”€â”€ TUI Box Components â”€â”€
    print('');
    print(h('span', 'c-white c-bold', '  ' + NF.monitor + ' TUI Components'));
    printBlock(
      '<div class="showcase-tui-mini tui-box">' +
      '<div class="tui-header">' + NF.diamond + ' Sample TUI Header</div>' +
      '<div style="padding:4px 12px;">' +
      '<div class="tui-row selected"><span class="indicator">' + NF.caretR + '</span> <span class="proj-name">Selected Row</span> <span class="badge badge-js">JS</span></div>' +
      '<div class="tui-row"><span class="indicator"> </span> <span class="proj-name">Normal Row</span> <span class="badge badge-py">PY</span></div>' +
      '</div>' +
      '<div class="tui-footer"><span class="tui-hints">' + NF.arrowUp + NF.arrowDown + ' Navigate</span></div>' +
      '</div>'
    );

    // â”€â”€ Box Drawing â”€â”€
    print('');
    print(h('span', 'c-white c-bold', '  ' + NF.code + ' Box Drawing'));
    printBlock(
      '<div class="showcase-tui-mini tui-box">' +
      '<div style="padding:8px 14px;color:var(--amber);font-weight:700">Box drawing demo</div>' +
      '</div>'
    );
    print(h('span', 'c-dim', '  Chars: ') +
      h('span', 'c-green-b', '\u2500 \u2502 \u250c \u2510 \u2514 \u2518 \u252c \u2534 \u251c \u2524 \u253c') +
      h('span', 'c-dim', '  \u2550 \u2551 \u2554 \u2557 \u255a \u255d'));

    // â”€â”€ Current Config â”€â”€
    print('');
    print(sep);
    var t = THEMES[currentTheme];
    print(h('span', 'c-white c-bold', '  ' + NF.palette + ' Active Theme: ') + h('span', 'c-green-b', t.name) + ' ' + h('span', 'c-dim', '(' + t.type + ')'));
    print(h('span', 'c-white c-bold', '  ' + NF.cmd + ' Active Prompt: ') + h('span', 'c-green-b', PROMPTS[currentPromptStyle].name));
    print(h('span', 'c-white c-bold', '  ' + NF.tag + ' Badge Style:   ') + h('span', 'c-green-b', BADGE_STYLES[currentBadgeStyle].name));
    print(h('span', 'c-white c-bold', '  ' + NF.palette + ' Primary: ') + h('span', '', '<span style="color:' + t.primary + '">\u2588\u2588\u2588</span> ') + h('span', 'c-dim', t.primary));
    print(h('span', 'c-white c-bold', '  ' + NF.palette + ' Bright:  ') + h('span', '', '<span style="color:' + t.bright + '">\u2588\u2588\u2588</span> ') + h('span', 'c-dim', t.bright));
    print(h('span', 'c-white c-bold', '  ' + NF.monitor + ' BG:      ') + h('span', '', '<span style="color:' + t.bg + ';background:#333;padding:0 2px">\u2588\u2588\u2588</span> ') + h('span', 'c-dim', t.bg));
    print(h('span', 'c-dim', '  ' + Object.keys(THEMES).length + ' themes \u00b7 ' + Object.keys(PROMPTS).length + ' prompts \u00b7 ' + Object.keys(BADGE_STYLES).length + ' badge styles \u00b7 ' + Object.keys(NF).length + ' glyphs \u00b7 ' + Object.keys(LANG_BADGE_MAP).length + ' badges'));
    print('');
  }, 'View design component showcase');
  reg('dev', CMDS.showcase.fn, 'View design component showcase (alias)', true);

  // ================================================================
  //  COMMAND: clear
  // ================================================================
  reg('clear', cmdClear, 'Clear terminal screen');

  function cmdClear() {
    $out.innerHTML = '';
    updatePrompt();
  }

  // ================================================================
  //  COMMAND: ls
  // ================================================================
  reg('ls', function (args) {
    var target = resolvePath(args[0] || '.');
    var node = getNode(target);
    if (!node) {
      print(h('span', 'c-red', 'ls: cannot access ') + h('span', 'c-white', "'" + escHTML(args[0] || '.') + "'") + h('span', 'c-red', ': No such file or directory'));
      triggerGlitch();
      return;
    }
    if (node.type === 'file') {
      print(escHTML(target.split('/').pop()));
      return;
    }
    var items = node.children || [];
    var out = '';
    items.forEach(function (name) {
      var fullPath = (target === '~' ? '~/' : target + '/') + name;
      var child = getNode(fullPath);
      if (child && child.type === 'dir') {
        out += h('span', 'c-cyan c-bold', name + '/') + '  ';
      } else {
        out += h('span', 'c-green', name) + '  ';
      }
    });
    print(out || h('span', 'c-dim', '(empty)'));
  }, 'List directory contents');

  // ================================================================
  //  COMMAND: cd
  // ================================================================
  reg('cd', function (args) {
    var target = args[0] || '~';
    var resolved = resolvePath(target);
    var node = getNode(resolved);
    if (!node) {
      print(h('span', 'c-red', 'cd: no such directory: ') + h('span', 'c-white', escHTML(target)));
      triggerGlitch();
      return;
    }
    if (node.type !== 'dir') {
      print(h('span', 'c-red', 'cd: not a directory: ') + h('span', 'c-white', escHTML(target)));
      triggerGlitch();
      return;
    }
    S.cwd = resolved;
    updatePrompt();
  }, 'Change directory');

  // ================================================================
  //  COMMAND: cat
  // ================================================================
  reg('cat', function (args) {
    if (!args[0]) { print(h('span', 'c-red', 'cat: missing file operand')); triggerGlitch(); return; }
    var resolved = resolvePath(args[0]);
    var node = getNode(resolved);
    if (!node) {
      print(h('span', 'c-red', 'cat: ') + h('span', 'c-white', escHTML(args[0])) + h('span', 'c-red', ': No such file'));
      triggerGlitch();
      return;
    }
    if (node.type === 'dir') {
      print(h('span', 'c-red', 'cat: ') + h('span', 'c-white', escHTML(args[0])) + h('span', 'c-red', ': Is a directory'));
      triggerGlitch();
      return;
    }
    var lines = node.content.split('\n');
    lines.forEach(function (line) {
      if (line.startsWith('# ')) {
        print(h('span', 'c-amber c-bold', escHTML(line)));
      } else if (line.startsWith('## ')) {
        print(h('span', 'c-cyan c-bold', escHTML(line)));
      } else {
        print(escHTML(line) || '&nbsp;');
      }
    });
  }, 'Display file contents');

  // ================================================================
  //  COMMAND: pwd
  // ================================================================
  reg('pwd', function () {
    print(h('span', 'c-cyan', S.cwd));
  }, 'Print working directory');

  // ================================================================
  //  COMMAND: whoami
  // ================================================================
  reg('whoami', function () {
    print(h('span', 'c-green-b', CFG.user + '@' + CFG.host));
  }, 'Display current user');

  // ================================================================
  //  COMMAND: date
  // ================================================================
  reg('date', function () {
    print(h('span', 'c-white', new Date().toString()));
  }, 'Show current date/time');

  // ================================================================
  //  COMMAND: echo
  // ================================================================
  reg('echo', function (args) {
    print(escHTML(args.join(' ')));
  }, 'Print text to terminal');

  // ================================================================
  //  COMMAND: tree
  // ================================================================
  reg('tree', function () {
    var lines = [];
    function walk(path, prefix) {
      var node = getNode(path);
      if (!node || node.type !== 'dir') return;
      var children = node.children || [];
      children.forEach(function (name, i) {
        var last = i === children.length - 1;
        var connector = last ? '\u2514\u2500\u2500 ' : '\u251c\u2500\u2500 ';
        var fullPath = path + '/' + name;
        var child = getNode(fullPath);
        if (child && child.type === 'dir') {
          lines.push(prefix + connector + h('span', 'c-cyan c-bold', name + '/'));
          walk(fullPath, prefix + (last ? '    ' : '\u2502   '));
        } else {
          lines.push(prefix + connector + h('span', 'c-green', name));
        }
      });
    }
    lines.push(h('span', 'c-cyan c-bold', '.'));
    walk(S.cwd, '');
    lines.forEach(function (l) { print(l); });
  }, 'Show directory tree');

  // ================================================================
  //  EASTER EGG â€” site-related
  // ================================================================
  reg('vapor', function () {
    print('');
    print(h('span', 'c-magenta c-bold', '  \u2588\u2588\u2588  V A P O R W A V E  \u2588\u2588\u2588'));
    print(h('span', 'c-cyan', '  \u30a2\u30a8\u30b9\u30c6\u30c6\u30a3\u30c3\u30af\u30b9'));
    print(h('span', 'c-dim', "  It's all in the aesthetic."));
    print(h('span', 'c-dim', '  \u2014 vaporsoft.dev'));
    print('');
    vaporRain();
  }, '', true);

  reg('sudo', function () {
    print('');
    print(h('span', 'c-red c-bold', '  \u26a0  Access denied.'));
    print(h('span', 'c-dim', "  Guests don't get root on vaporsoft.dev."));
    print('');
    triggerGlitch();
  }, '', true);

  reg('exit', function () {
    print('');
    print(h('span', 'c-amber', '  There is no escape from the vapor.'));
    print(h('span', 'c-dim', '  vaporsoft.dev \u2014 always online'));
    print('');
  }, '', true);

  reg('rm', function () {
    print(h('span', 'c-red', '  rm: permission denied \u2014 nice try'));
    triggerGlitch();
  }, '', true);

  // ================================================================
  //  VIRTUAL FILE SYSTEM
  // ================================================================
  var FS = {};

  function buildFS() {
    FS['~'] = { type: 'dir', children: ['about.txt', '.config'] };
    FS['~/about.txt'] = {
      type: 'file',
      content: '# About\n\nDomain: vaporsoft.dev\nRole: Developer / Creator\n\nRun the "about" command for the full display.'
    };
    FS['~/.config'] = { type: 'dir', children: ['theme.conf'] };
    FS['~/.config/theme.conf'] = {
      type: 'file',
      content: '# VaporSoft Terminal Theme\nshell=' + CFG.shell + '\nterminal=' + CFG.terminal + '\ncrt_effects=on\nscanlines=on\nglow=high'
    };
  }

  function resolvePath(input) {
    if (!input || input === '~') return '~';
    if (input === '/') return '~';
    if (input.startsWith('~/')) return normalizePath(input);
    if (input.startsWith('/')) return normalizePath('~' + input);
    var base = S.cwd === '~' ? '~/' : S.cwd + '/';
    return normalizePath(base + input);
  }

  function normalizePath(p) {
    var parts = p.replace(/\/+/g, '/').split('/');
    if (parts[0] === '~') {
      var resolved = ['~'];
      for (var i = 1; i < parts.length; i++) {
        if (parts[i] === '' || parts[i] === '.') continue;
        if (parts[i] === '..') {
          if (resolved.length > 1) resolved.pop();
        } else {
          resolved.push(parts[i]);
        }
      }
      return resolved.length === 1 ? '~' : resolved.join('/');
    }
    return p;
  }

  function getNode(path) { return FS[path] || null; }

  // ================================================================
  //  EFFECTS
  // ================================================================
  function triggerGlitch() {
    var screen = document.getElementById('screen');
    screen.classList.remove('glitch');
    void screen.offsetWidth;
    screen.classList.add('glitch');
    setTimeout(function () { screen.classList.remove('glitch'); }, 200);
  }

  function vaporRain() {
    var overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;z-index:200;pointer-events:none;overflow:hidden;';
    document.body.appendChild(overlay);

    var chars = '\u30a2\u30a4\u30a6\u30a8\u30aa\u30ab\u30ad\u30af\u30b1\u30b3\u30b5\u30b7\u30b9\u30bb\u30bd\u30bf\u30c1\u30c4\u30c6\u30c8\u30ca\u30cb\u30cc\u30cd\u30ce\u30cf\u30d2\u30d5\u30d8\u30db\u30de\u30df\u30e0\u30e1\u30e2\u30e4\u30e6\u30e8\u30e9\u30ea\u30eb\u30ec\u30ed\u30ef\u30f2\u30f30123456789';
    var cols = Math.floor(window.innerWidth / 14);

    for (var i = 0; i < cols; i++) {
      var col = document.createElement('div');
      col.style.cssText =
        'position:absolute;top:-100%;left:' + (i * 14) + 'px;' +
        'font-family:var(--font);font-size:14px;color:var(--green);' +
        'text-shadow:0 0 8px var(--green);white-space:pre;line-height:1.2;' +
        'animation:matrix-fall ' + (1.5 + Math.random() * 2) + 's linear ' + (Math.random() * 1) + 's forwards;opacity:0.7;';

      var text = '';
      for (var j = 0; j < 30; j++) {
        text += chars[Math.floor(Math.random() * chars.length)] + '\n';
      }
      col.textContent = text;
      overlay.appendChild(col);
    }

    var style = document.createElement('style');
    style.textContent = '@keyframes matrix-fall{0%{top:-100%;opacity:0}10%{opacity:0.7}90%{opacity:0.7}100%{top:100%;opacity:0}}';
    document.head.appendChild(style);

    setTimeout(function () { overlay.remove(); style.remove(); }, 4000);
  }

  // ================================================================
  //  TOAST NOTIFICATIONS
  // ================================================================
  var $toastContainer;

  function toast(message, duration) {
    if (!$toastContainer) $toastContainer = document.getElementById('toast-container');
    if (!$toastContainer) return;
    duration = duration || 3000;
    var el = document.createElement('div');
    el.className = 'toast';
    el.textContent = message;
    $toastContainer.appendChild(el);
    setTimeout(function () {
      el.classList.add('toast-out');
      setTimeout(function () { el.remove(); }, 200);
    }, duration);
  }

  // ================================================================
  //  PROGRESS BAR (inline in output)
  // ================================================================
  function printProgress(label, percent) {
    var clamped = Math.max(0, Math.min(100, percent));
    var html = '<div class="progress-bar">' +
      '<span class="c-dim">' + escHTML(label) + '</span>' +
      '<span class="progress-track"><span class="progress-fill" style="width:' + clamped + '%"></span></span>' +
      '<span class="progress-label">' + clamped + '%</span>' +
      '</div>';
    printBlock(html);
  }

  // ================================================================
  //  SPINNER (braille animation inline)
  // ================================================================
  var SPINNER_FRAMES = ['\u280b', '\u2819', '\u2838', '\u2834', '\u2826', '\u2807', '\u280f', '\u2839'];

  function createSpinner(parentEl) {
    var span = document.createElement('span');
    span.className = 'c-green-b';
    span.textContent = SPINNER_FRAMES[0];
    parentEl.appendChild(span);
    var frameIdx = 0;
    var interval = setInterval(function () {
      frameIdx = (frameIdx + 1) % SPINNER_FRAMES.length;
      span.textContent = SPINNER_FRAMES[frameIdx];
    }, 100);
    return { el: span, stop: function () { clearInterval(interval); span.remove(); } };
  }

  // ================================================================
  //  DIALOGUE SYSTEM HARDENING
  // ================================================================
  function closeAllDialogues() {
    var removed = false;
    var browser = $out.querySelector('.project-browser');
    if (browser) { browser.remove(); removed = true; }
    var themes = $out.querySelector('.theme-browser');
    if (themes) { themes.remove(); removed = true; }
    var prompts = $out.querySelector('.prompt-browser');
    if (prompts) { prompts.remove(); removed = true; }
    var customize = $out.querySelector('.customize-browser');
    if (customize) { customize.remove(); removed = true; }
    var keybindEl = $out.querySelector('.keybind-page');
    if (keybindEl) { keybindEl.remove(); removed = true; }
    var effectsEl = $out.querySelector('.effects-browser');
    if (effectsEl) { effectsEl.remove(); removed = true; }
    var historyEl = $out.querySelector('.history-browser');
    if (historyEl) { historyEl.remove(); removed = true; }
    if (removed && S.mode !== 'normal') {
      S.mode = 'normal';
      $inputLine.style.display = '';
      updatePrompt();
      focusInput();
      updateMobileBar();
    }
    return removed;
  }

  function safeOpenDialogue(mode) {
    closeAllDialogues();
    S.mode = mode;
    $inputLine.style.display = 'none';
    updateMobileBar();
  }

  // ================================================================
  //  COMMAND: keybinds
  // ================================================================
  var KEYBINDS = [
    {
      section: 'Navigation', binds: [
        { keys: [['Ctrl', 'P']], desc: 'Open GitHub browser' },
        { keys: [['Ctrl', 'T']], desc: 'Open customize panel' },
        { keys: [['Ctrl', 'K']], desc: 'Show keybinds' },
        { keys: [['Ctrl', 'L']], desc: 'Clear terminal' },
        { keys: [['Ctrl', 'C']], desc: 'Cancel current input' },
        { keys: [['Escape']], desc: 'Close active panel' },
      ]
    },
    {
      section: 'Terminal', binds: [
        { keys: [['Tab']], desc: 'Autocomplete / accept suggestion' },
        { keys: [[NF.arrowUp]], desc: 'Previous command in history' },
        { keys: [[NF.arrowDown]], desc: 'Next command in history' },
        { keys: [[NF.arrowRight]], desc: 'Accept ghost suggestion' },
        { keys: [['PgUp']], desc: 'Scroll terminal up' },
        { keys: [['PgDn']], desc: 'Scroll terminal down' },
      ]
    },
    {
      section: 'Panels', binds: [
        { keys: [[NF.arrowUp], ['W'], ['K']], desc: 'Move selection up' },
        { keys: [[NF.arrowDown], ['S'], ['J']], desc: 'Move selection down' },
        { keys: [['Enter']], desc: 'Open / apply selection' },
        { keys: [['Tab']], desc: 'Toggle focus (e.g. README pane)' },
        { keys: [['PgUp']], desc: 'Scroll focused panel up' },
        { keys: [['PgDn']], desc: 'Scroll focused panel down' },
        { keys: [['V']], desc: 'Toggle pinned/all view (browser)' },
        { keys: [['Q']], desc: 'Close panel' },
        { keys: [['Backspace']], desc: 'Go back (detail view)' },
      ]
    },
  ];

  reg('keybinds', function () {
    safeOpenDialogue('keybinds');
    renderKeybindPage();
  }, 'Show keyboard shortcuts');

  function renderKeybindPage() {
    var page = document.createElement('div');
    page.className = 'keybind-page';

    var sectionsHTML = '';
    KEYBINDS.forEach(function (section) {
      var rowsHTML = '';
      section.binds.forEach(function (bind) {
        var keysHTML = bind.keys.map(function (combo) {
          return combo.map(function (k) {
            return '<span class="kbd">' + escHTML(k) + '</span>';
          }).join('<span class="kbd-sep">+</span>');
        }).join(' <span class="c-dim">/</span> ');
        rowsHTML += '<div class="keybind-row">' +
          '<span class="keybind-keys">' + keysHTML + '</span>' +
          '<span class="keybind-desc">' + escHTML(bind.desc) + '</span>' +
          '</div>';
      });
      sectionsHTML += '<div class="keybind-section">' +
        '<div class="keybind-section-title">' + escHTML(section.section) + '</div>' +
        rowsHTML + '</div>';
    });

    page.innerHTML =
      '<div class="keybind-header">' +
      '<h2>' + NF.keyboard + ' Keyboard Shortcuts</h2>' +
      '<p>Quick reference for all available keybinds</p>' +
      '</div>' +
      '<div class="keybind-sections">' + sectionsHTML + '</div>' +
      '<div class="keybind-footer">' +
      '<span class="tui-actions">' +
      '<button class="tui-btn" data-action="close">' + NF.times + ' Close</button>' +
      '</span>' +
      '</div>';

    $out.appendChild(page);
    bindTuiActions(page);
    scroll();
    updateMobileBar();
  }

  function keybindKey(e) {
    if (e.key === 'PageUp' || e.key === 'PageDown') {
      e.preventDefault();
      scrollActivePanel(e.key === 'PageDown');
      return;
    }
    if (e.key === 'Escape' || e.key === 'q') {
      e.preventDefault();
      exitKeybinds();
    }
  }

  function exitKeybinds() {
    var el = $out.querySelector('.keybind-page');
    if (el) el.remove();
    S.mode = 'normal';
    $inputLine.style.display = '';
    updatePrompt();
    focusInput();
    scroll();
    updateMobileBar();
  }

  // ================================================================
  //  TUI ACTION HELPERS
  // ================================================================
  function scrollActivePanel(down) {
    var el;
    if (S.innerFocus) {
      el = $out.querySelector('.readme-body');
    }
    if (!el) {
      el =
        $out.querySelector('.tui-detail') ||
        $out.querySelector('.keybind-sections') ||
        $out.querySelector('.tui-body');
    }
    if (el) {
      var amount = el.clientHeight * 0.75;
      el.scrollBy(0, down ? amount : -amount);
    }
  }

  function toggleInnerFocus() {
    var inner = $out.querySelector('.readme-body');
    if (!inner) return false;
    S.innerFocus = !S.innerFocus;
    inner.classList.toggle('inner-focused', S.innerFocus);
    // Update footer hint to reflect current focus
    updateDetailFooter();
    return true;
  }

  function updateDetailFooter() {
    var box = $out.querySelector('.project-browser');
    if (!box) return;
    var hints = box.querySelector('.tui-hints');
    if (!hints) return;
    var hasInner = !!$out.querySelector('.readme-body');
    var focusLabel = S.innerFocus ? 'README' : 'Detail';
    var tabHint = hasInner ? (' \u00b7 Tab Focus: ' + focusLabel) : '';
    hints.innerHTML = NF.arrowLeft + ' Back \u00b7 PgUp/PgDn Scroll \u00b7 q Close' + tabHint;
  }

  function bindTuiActions(box) {
    var actions = box.querySelector('.tui-actions');
    if (actions) {
      actions.addEventListener('click', function (e) {
        var btn = e.target.closest('.tui-btn');
        if (btn) {
          e.stopPropagation();
          handleNavAction(btn.dataset.action);
          focusInput();
        }
      });
    }
  }

  function handleNavAction(action) {
    if (S.mode === 'browser') {
      var visible = getVisibleRepos();
      switch (action) {
        case 'up':
          if (S.browserIdx === 0) triggerGlitch();
          else S.browserIdx = Math.max(0, S.browserIdx - 1);
          updateBrowserSelection();
          break;
        case 'down':
          if (S.browserIdx === visible.length - 1) triggerGlitch();
          else S.browserIdx = Math.min(visible.length - 1, S.browserIdx + 1);
          updateBrowserSelection();
          break;
        case 'select':
          var realIdx = S.repos.indexOf(visible[S.browserIdx]);
          showProjectDetail(realIdx >= 0 ? realIdx : S.browserIdx);
          break;
        case 'toggle-view':
          S.browserView = S.browserView === 'all' ? 'pinned' : 'all';
          S.browserIdx = 0;
          renderBrowser();
          break;
        case 'close':
          var box1 = $out.querySelector('.project-browser');
          if (box1) box1.remove();
          exitBrowser();
          break;
      }
    } else if (S.mode === 'detail') {
      switch (action) {
        case 'back':
          var old = $out.querySelector('.project-browser');
          if (old) old.remove();
          S.mode = 'browser';
          renderBrowser();
          break;
        case 'close':
          var box2 = $out.querySelector('.project-browser');
          if (box2) box2.remove();
          exitBrowser();
          break;
      }
    } else if (S.mode === 'keybinds') {
      if (action === 'close') exitKeybinds();
    } else if (S.mode === 'customize') {
      var cItems = getCustomizeItems();
      switch (action) {
        case 'up':
          if (S.customizeIdx === 0) triggerGlitch();
          else S.customizeIdx = Math.max(0, S.customizeIdx - 1);
          renderCustomizeBrowser();
          break;
        case 'down':
          if (S.customizeIdx === cItems.length - 1) triggerGlitch();
          else S.customizeIdx = Math.min(cItems.length - 1, S.customizeIdx + 1);
          renderCustomizeBrowser();
          break;
        case 'select':
          applyCustomizeSelection(cItems[S.customizeIdx]);
          renderCustomizeBrowser();
          break;
        case 'tab':
          var ci = CUSTOMIZE_TABS.indexOf(S.customizeTab);
          S.customizeTab = CUSTOMIZE_TABS[(ci + 1) % CUSTOMIZE_TABS.length];
          S.customizeIdx = 0;
          renderCustomizeBrowser();
          break;
        case 'close':
          exitCustomizeBrowser();
          break;
      }
    }
  }

  function updateMobileBar() {
    if (!$mobileBar) return;
    var btns;
    var showMenu = true;
    if (S.mode === 'browser') {
      btns = [
        { cmd: 'nav-up', label: NF.arrowUp },
        { cmd: 'nav-down', label: NF.arrowDown },
        { cmd: 'nav-select', label: 'Open' },
        { cmd: 'nav-close', label: 'Close' },
      ];
      showMenu = false;
    } else if (S.mode === 'detail') {
      btns = [
        { cmd: 'nav-back', label: NF.arrowLeft + ' Back' },
        { cmd: 'nav-close', label: 'Close' },
      ];
      showMenu = false;
    } else if (S.mode === 'keybinds') {
      btns = [
        { cmd: 'nav-close', label: 'Close' },
      ];
      showMenu = false;
    } else if (S.mode === 'customize') {
      btns = [
        { cmd: 'nav-up', label: NF.arrowUp },
        { cmd: 'nav-down', label: NF.arrowDown },
        { cmd: 'nav-select', label: 'Apply' },
        { cmd: 'nav-tab', label: 'Tab' },
        { cmd: 'nav-close', label: 'Close' },
      ];
      showMenu = false;
    } else {
      btns = [
        { cmd: 'help', label: 'help' },
        { cmd: 'about', label: 'about' },
        { cmd: 'github', label: 'github' },
      ];
    }

    if ($quickBtns) {
      $quickBtns.innerHTML = btns.map(function (b) {
        return '<button class="cmd-btn" data-cmd="' + b.cmd + '">' + b.label + '</button>';
      }).join('');
    }

    // Show/hide hamburger when in dialog modes
    if ($menuToggle) {
      $menuToggle.style.display = showMenu ? '' : 'none';
    }
    // Close menu when mode changes
    closeCommandMenu();
  }

  function renderCommandMenu() {
    if (!$cmdMenu) return;
    var iconMap = {
      help: NF.question, about: NF.info, github: NF.github,
      prompt: NF.cmd, theme: NF.palette, customize: NF.cog,
      zen: NF.expand, clear: NF.times,
      ls: NF.folder, cd: NF.folder, cat: NF.file, pwd: NF.home,
      whoami: NF.user, date: NF.clock, echo: NF.cmd, tree: NF.gitBranch,
      keybinds: NF.keyboard, links: NF.link, showcase: NF.eye,
    };
    var rows = '';
    for (var ci = 0; ci < cmdNames.length; ci++) {
      var name = cmdNames[ci];
      var c = CMDS[name];
      if (c.hidden) continue;
      var icon = iconMap[name] || NF.caretR;
      rows += '<button class="cmd-menu-row" data-cmd="' + name + '">' +
        '<span class="menu-icon">' + icon + '</span>' +
        '<span class="menu-label">' + name + '</span>' +
        '<span class="menu-desc">' + escHTML(c.desc) + '</span>' +
        '</button>';
    }
    $cmdMenu.innerHTML =
      '<div class="cmd-menu-header">' + NF.terminal + ' Commands</div>' + rows;
  }

  function toggleCommandMenu() {
    if (!$cmdMenu) return;
    var isOpen = $cmdMenu.classList.contains('open');
    if (isOpen) {
      closeCommandMenu();
    } else {
      renderCommandMenu();
      $cmdMenu.classList.add('open');
      if ($menuToggle) $menuToggle.classList.add('active');
    }
  }

  function closeCommandMenu() {
    if ($cmdMenu) $cmdMenu.classList.remove('open');
    if ($menuToggle) $menuToggle.classList.remove('active');
  }

  // ================================================================
  //  BOOT SEQUENCE
  // ================================================================
  function boot() {
    S.booting = true;
    $inputLine.style.display = 'none';

    var bootLines = [
      { text: h('span', 'c-dim', NF.cog + ' POST v4.2 \u2014 Memory: 65536K OK'), delay: 0 },
      { text: h('span', 'c-dim', NF.chip + ' CPU: ES2026 \u2014 1 core @ \u221e MHz'), delay: 60 },
      { text: h('span', 'c-dim', NF.search + ' Detecting devices\u2026'), delay: 60 },
      { text: h('span', 'c-ok', '/dev/portfolio'), delay: 40 },
      { text: h('span', 'c-ok', '/dev/github'), delay: 40 },
      { text: h('span', 'c-ok', CFG.shell), delay: 40 },
      { text: h('span', 'c-ok', CFG.terminal), delay: 40 },
      { text: h('span', 'c-ok', 'Network: ONLINE'), delay: 40 },
      { text: '__PROGRESS__', delay: 30 },
      { text: '__BANNER__', delay: 100 },
    ];

    var overlayTime = 650;
    setTimeout(function () { runBootLines(bootLines, 0); }, overlayTime);
  }

  function runBootLines(lines, idx) {
    if (idx >= lines.length) {
      finishBoot();
      return;
    }

    var entry = lines[idx];
    var next = function () { runBootLines(lines, idx + 1); };

    if (entry.text === '__PROGRESS__') {
      animateBootProgress(next);
      return;
    }

    if (entry.text === '__BANNER__') {
      showBootBanner();
      setTimeout(next, entry.delay);
      return;
    }

    var d = document.createElement('div');
    d.className = 'output-line boot-line';
    d.innerHTML = entry.text;
    $out.appendChild(d);
    scroll();
    setTimeout(next, entry.delay);
  }

  function animateBootProgress(callback) {
    var width = 30;
    var el = document.createElement('div');
    el.className = 'output-line';
    var label = h('span', 'c-dim', '  Loading ');
    el.innerHTML = label + '<span class="boot-progress"></span>';
    $out.appendChild(el);
    var bar = el.querySelector('.boot-progress');
    var frame = 0;
    var total = width;
    var interval = setInterval(function () {
      frame++;
      var filled = '\u2588'.repeat(frame);
      var empty = '\u2591'.repeat(total - frame);
      var pct = Math.round((frame / total) * 100);
      bar.innerHTML = '<span class="boot-fill">' + filled + '</span>' + empty + ' ' + h('span', 'c-dim', pct + '%');
      scroll();
      if (frame >= total) {
        clearInterval(interval);
        setTimeout(callback, 80);
      }
    }, 18);
  }

  function showBootBanner() {
    print('');
    printBlock(
      '<div class="banner-box">' +
      '<div class="banner-title">' + h('span', 'c-green-b c-bold', NF.terminal) + ' ' + h('span', 'c-amber c-bold', 'vaporsoft.dev') + '</div>' +
      '<div class="banner-sub">' + h('span', 'c-dim', NF.user + ' developer \u00b7 creator') + '</div>' +
      '<div class="banner-sub">' + h('span', 'c-dim', NF.monitor + ' ' + CFG.terminal + ' v' + CFG.version) + '</div>' +
      '</div>'
    );
  }

  function finishBoot() {
    print('');
    print(h('span', 'c-white', '  ' + NF.user + ' Welcome to ' + CFG.terminal + '.'));
    print(h('span', 'c-dim', '  Type ') + h('span', 'c-amber', 'help') + h('span', 'c-dim', ' to see available commands.'));
    print(h('span', 'c-dim', '  Use ') + h('span', 'c-amber', 'Tab') + h('span', 'c-dim', ' for autocomplete, ') + h('span', 'c-amber', '\u2191\u2193') + h('span', 'c-dim', ' for history.'));
    print('');
    S.booting = false;
    $inputLine.style.display = '';
    updatePrompt();
    focusInput();
    scroll();
  }

  function typeLine(html) {
    print(html);
  }

  // ================================================================
  //  INIT
  // ================================================================
  function init() {
    $out = document.getElementById('output');
    $terminal = document.getElementById('terminal');
    $inputLine = document.getElementById('input-line');
    $prompt = document.getElementById('prompt-text');
    $inputBefore = document.getElementById('input-before');
    $inputAfter = document.getElementById('input-after');
    $cursor = document.getElementById('cursor');
    $ghost = document.getElementById('ghost');
    $hidden = document.getElementById('hidden-input');
    $mobileBar = document.getElementById('mobile-bar');
    $menuToggle = document.getElementById('menu-toggle');
    $quickBtns = document.getElementById('mobile-quick-btns');
    $cmdMenu = document.getElementById('cmd-menu');

    buildFS();

    cmdNames = Object.keys(CMDS).filter(function (n) { return !CMDS[n].hidden; }).sort();

    // Restore saved theme
    try {
      var saved = localStorage.getItem('vaporsoft-theme');
      if (saved && THEMES[saved]) applyTheme(saved);
    } catch (e) { }

    // Restore saved prompt style
    try {
      var savedPrompt = localStorage.getItem('vaporsoft-prompt');
      if (savedPrompt && PROMPTS[savedPrompt]) currentPromptStyle = savedPrompt;
    } catch (e) { }

    // Restore saved badge style
    try {
      var savedBadge = localStorage.getItem('vaporsoft-badge-style');
      if (savedBadge && BADGE_STYLES[savedBadge]) setBadgeStyle(savedBadge);
    } catch (e) { }

    // Restore saved CRT effects
    loadEffectStates();
    applyEffectStates();

    // Apply URL parameters (override saved settings)
    try {
      var urlParams = new URLSearchParams(location.search);
      var urlTheme = urlParams.get('theme');
      if (urlTheme && THEMES[urlTheme]) applyTheme(urlTheme);
      var urlPrompt = urlParams.get('prompt');
      if (urlPrompt && PROMPTS[urlPrompt]) { currentPromptStyle = urlPrompt; try { localStorage.setItem('vaporsoft-prompt', urlPrompt); } catch (e) { } }
      var urlBadge = urlParams.get('badge');
      if (urlBadge && BADGE_STYLES[urlBadge]) setBadgeStyle(urlBadge);
      var urlFx = urlParams.get('fx');
      if (urlFx) {
        urlFx.split(',').forEach(function (id) {
          if (effectStates.hasOwnProperty(id)) effectStates[id] = false;
        });
        applyEffectStates();
        saveEffectStates();
      }
    } catch (e) { }

    document.addEventListener('keydown', onKeyDown);
    $hidden.addEventListener('input', function () { renderInput(); });
    $hidden.addEventListener('compositionend', function () { renderInput(); });

    $terminal.addEventListener('click', function (e) {
      if (e.target.closest('.tui-row') || e.target.closest('.cmd-btn')) return;
      focusInput();
    });

    $mobileBar.addEventListener('click', function (e) {
      // Menu toggle
      if (e.target.closest('.menu-toggle')) {
        toggleCommandMenu();
        return;
      }
      var btn = e.target.closest('.cmd-btn') || e.target.closest('.cmd-menu-row');
      if (!btn) return;
      closeCommandMenu();
      var cmd = btn.dataset.cmd;
      if (cmd.startsWith('nav-')) {
        handleNavAction(cmd.slice(4));
        return;
      }
      if (S.mode !== 'normal') return;
      setInputValue('');
      exec(cmd);
      focusInput();
    });

    setTimeout(function () {
      var overlay = document.getElementById('crt-overlay');
      if (overlay) overlay.style.display = 'none';
    }, 700);

    updateMobileBar();
    boot();
  }

  document.addEventListener('DOMContentLoaded', init);

})();
