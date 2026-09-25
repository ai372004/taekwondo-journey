import js from '@eslint/js';

// Browser gameplay code is loaded as plain <script> tags (no bundler, no
// import/export — see index.html), so files share state through window/
// top-level globals by design. `no-undef` can't know that cross-file
// contract without a hand-maintained allowlist, so it stays off for js/**
// and we rely on no-unused-vars + the correctness rules instead.
export default [
  js.configs.recommended,
  {
    files: ['js/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'script',
      globals: {
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        console: 'readonly',
        fetch: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        CustomEvent: 'readonly',
        Audio: 'readonly',
        Image: 'readonly',
        Path2D: 'readonly',
        AudioContext: 'readonly',
        webkitAudioContext: 'readonly',
        speechSynthesis: 'readonly',
        SpeechSynthesisUtterance: 'readonly',
        caches: 'readonly',
        indexedDB: 'readonly',
        location: 'readonly',
        history: 'readonly',
        performance: 'readonly',
        matchMedia: 'readonly',
        MutationObserver: 'readonly',
        ResizeObserver: 'readonly',
        IntersectionObserver: 'readonly',
        getComputedStyle: 'readonly',
        alert: 'readonly',
        confirm: 'readonly',
        prompt: 'readonly',
        self: 'readonly',
        globalThis: 'readonly',
      },
    },
    rules: {
      'no-undef': 'off',
      'no-unused-vars': ['warn', { args: 'none', varsIgnorePattern: '^_' }],
      'no-redeclare': 'off',
      'no-empty': 'warn',
      'no-fallthrough': 'warn',
      'no-cond-assign': ['error', 'except-parens'],
    },
  },
  {
    files: ['sw.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'script',
      globals: {
        self: 'readonly',
        caches: 'readonly',
        fetch: 'readonly',
        clients: 'readonly',
        indexedDB: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        Request: 'readonly',
        Response: 'readonly',
        URL: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': ['warn', { args: 'none', varsIgnorePattern: '^_' }],
    },
  },
  {
    // Node tooling/test scripts. Several of them drive Playwright and pass
    // callbacks into page.evaluate() that execute in the browser, not in
    // Node — so, like js/**, no-undef can't reliably tell a real typo from
    // a legitimate browser/game global and stays off.
    files: ['tests/**/*.mjs', 'tools/**/*.mjs'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        process: 'readonly',
        console: 'readonly',
        __dirname: 'readonly',
        Buffer: 'readonly',
      },
    },
    rules: {
      'no-undef': 'off',
      'no-unused-vars': ['warn', { args: 'none', varsIgnorePattern: '^_' }],
      'no-empty': 'warn',
    },
  },
  {
    ignores: ['www/', 'node_modules/', 'assets/', 'android/', 'ios/', 'store/'],
  },
];
