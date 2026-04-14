/**
 * Loads demo manifest and file contents via fetch (serve site over HTTP, not file://).
 */
(function (global) {
    var DEFAULT_MANIFEST = 'demo-data/airport/manifest.json';

    function fetchText(url) {
        return fetch(url, { cache: 'no-store' }).then(function (res) {
            if (!res.ok) throw new Error(url + ': HTTP ' + res.status);
            return res.text();
        });
    }

    function loadManifest(manifestUrl) {
        return fetchText(manifestUrl || DEFAULT_MANIFEST).then(JSON.parse);
    }

    function sliceLines(text, startLine, endLine) {
        var lines = text.split(/\r?\n/);
        var start = Math.max(0, (startLine || 1) - 1);
        var end = endLine == null ? lines.length : Math.min(lines.length, endLine);
        return lines.slice(start, end).join('\n');
    }

    function languageForPath(path) {
        var lower = String(path).toLowerCase();
        if (lower.endsWith('.java')) return 'java';
        if (lower.endsWith('.gradle')) return 'groovy';
        if (lower.endsWith('.yml') || lower.endsWith('.yaml')) return 'yaml';
        if (lower.endsWith('.http')) return 'http';
        if (lower.endsWith('.json')) return 'json';
        if (lower.endsWith('.xml')) return 'markup';
        if (lower.endsWith('.properties')) return 'properties';
        if (lower.endsWith('.modelhike') || lower.endsWith('.dsl') || lower.endsWith('.md')) return 'ini';
        return null;
    }

    function setIdePreLanguageClass(codeEl, langOrNull) {
        var pre = codeEl && codeEl.parentElement;
        if (!pre || pre.tagName !== 'PRE') return;
        pre.className = langOrNull ? 'ide-file-pre language-' + langOrNull : 'ide-file-pre';
    }

    function highlightCode(codeEl, path, sourceText) {
        if (!codeEl) return;
        var text = sourceText != null ? sourceText : codeEl.textContent;
        var lang = languageForPath(path);
        if (!lang) {
            codeEl.removeAttribute('class');
            codeEl.textContent = text;
            setIdePreLanguageClass(codeEl, null);
            return;
        }
        var P = global.Prism;
        var grammar = P && P.languages && P.languages[lang];
        codeEl.className = 'language-' + lang;
        if (grammar && P.highlight) {
            codeEl.innerHTML = P.highlight(text, grammar, lang);
            setIdePreLanguageClass(codeEl, lang);
        } else if (P && P.highlightElement) {
            codeEl.textContent = text;
            P.highlightElement(codeEl);
            setIdePreLanguageClass(codeEl, lang);
        } else {
            codeEl.textContent = text;
            setIdePreLanguageClass(codeEl, null);
        }
    }

    function stripHomepagePrismPre(pre) {
        if (!pre || pre.tagName !== 'PRE') return;
        pre.classList.remove('code-preview-prism');
        var rm = [];
        var i;
        for (i = 0; i < pre.classList.length; i++) {
            if (/^language-/.test(pre.classList[i])) rm.push(pre.classList[i]);
        }
        for (i = 0; i < rm.length; i++) pre.classList.remove(rm[i]);
    }

    function highlightHomepageCode(codeEl, path, sourceText) {
        if (!codeEl) return;
        var text = sourceText != null ? sourceText : codeEl.textContent;
        var pre = codeEl.parentElement;
        stripHomepagePrismPre(pre);
        var lang = path != null && path !== '' ? languageForPath(path) : null;
        var P = global.Prism;
        if (!lang || !P || !P.languages || !P.languages[lang]) {
            codeEl.removeAttribute('class');
            codeEl.textContent = text;
            return;
        }
        var grammar = P.languages[lang];
        codeEl.className = 'language-' + lang;
        if (grammar && P.highlight) {
            codeEl.innerHTML = P.highlight(text, grammar, lang);
            if (pre && pre.tagName === 'PRE') {
                pre.classList.add('code-preview-prism');
                pre.classList.add('language-' + lang);
            }
        } else {
            codeEl.textContent = text;
        }
    }

    var PRISM_CDN = 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/';
    var HOMEPAGE_PRISM_SCRIPTS = [
        'components/prism-core.min.js',
        'components/prism-markup.min.js',
        'components/prism-clike.min.js',
        'components/prism-java.min.js',
        'components/prism-groovy.min.js',
        'components/prism-yaml.min.js',
        'components/prism-json.min.js',
        'components/prism-http.min.js',
        'components/prism-properties.min.js',
        'components/prism-ini.min.js'
    ];

    var homepagePrismLoadPromise = null;

    function appendStylesheet(href) {
        return new Promise(function (resolve, reject) {
            var el = document.createElement('link');
            el.rel = 'stylesheet';
            el.href = href;
            el.onload = function () {
                resolve();
            };
            el.onerror = function () {
                reject(new Error(href));
            };
            document.head.appendChild(el);
        });
    }

    function appendScript(src) {
        return new Promise(function (resolve, reject) {
            var s = document.createElement('script');
            s.src = src;
            s.async = false;
            s.onload = function () {
                resolve();
            };
            s.onerror = function () {
                reject(new Error(src));
            };
            document.head.appendChild(s);
        });
    }

    function loadHomepagePrismAssets() {
        return appendStylesheet(PRISM_CDN + 'themes/prism-tomorrow.min.css').then(function () {
            return HOMEPAGE_PRISM_SCRIPTS.reduce(function (chain, path) {
                return chain.then(function () {
                    return appendScript(PRISM_CDN + path);
                });
            }, Promise.resolve());
        });
    }

    function ensureHomepagePrismLoaded() {
        if (!homepagePrismLoadPromise) {
            homepagePrismLoadPromise = loadHomepagePrismAssets();
        }
        return homepagePrismLoadPromise;
    }

    function escapeCssIdent(value) {
        if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') {
            return CSS.escape(value);
        }
        return String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    }

    function appendPathWithBoldFilename(target, value) {
        if (!target) return;
        var full = String(value || '');
        var parts = full.split('/');
        var filename = parts.pop() || full;
        var dir = parts.length ? parts.join('/') + '/' : '';

        target.textContent = '';
        if (dir) {
            var dirSpan = document.createElement('span');
            dirSpan.className = 'code-preview-file-dir';
            dirSpan.textContent = dir;
            target.appendChild(dirSpan);
        }
        var name = document.createElement('span');
        name.className = 'code-preview-file-name';
        name.textContent = filename;
        target.appendChild(name);
    }

    function setOutputPreviewLabel(target, prefix, value, index, total) {
        if (!target) return;
        target.textContent = '';

        var title = document.createElement('span');
        title.className = 'code-preview-output-preview-title';
        title.textContent = prefix;
        target.appendChild(title);

        target.appendChild(document.createTextNode(': '));

        var name = document.createElement('span');
        name.className = 'code-preview-output-preview-name';
        name.textContent = value;
        target.appendChild(name);

        target.appendChild(
            document.createTextNode(' (' + index + ' of ' + total + ')')
        );
    }

    function commonDirPrefix(paths) {
        var norm = (paths || []).map(function (p) {
            return String(p || '').replace(/\\/g, '/');
        }).filter(Boolean);
        if (norm.length === 0) return '';
        if (norm.length === 1) {
            var p = norm[0];
            var i = p.lastIndexOf('/');
            return i >= 0 ? p.slice(0, i + 1) : '';
        }
        var a = norm[0];
        for (var k = 1; k < norm.length; k++) {
            var b = norm[k];
            var j = 0;
            var max = Math.min(a.length, b.length);
            while (j < max && a.charCodeAt(j) === b.charCodeAt(j)) j++;
            a = a.slice(0, j);
        }
        var lastSlash = a.lastIndexOf('/');
        return lastSlash >= 0 ? a.slice(0, lastSlash + 1) : '';
    }

    function buildFileTree(files) {
        var root = {};
        function insertPath(node, parts, entry) {
            if (parts.length === 1) {
                if (!node.__files) node.__files = [];
                node.__files.push({ name: parts[0], entry: entry });
                return;
            }
            var dir = parts[0];
            if (!node[dir]) node[dir] = {};
            insertPath(node[dir], parts.slice(1), entry);
        }
        var list = files || [];
        var pathStrings = list.map(function (e) {
            return e.path;
        });
        var prefix = commonDirPrefix(pathStrings);
        list.forEach(function (entry) {
            var full = String(entry.path || '').replace(/\\/g, '/');
            var rel = prefix && full.indexOf(prefix) === 0 ? full.slice(prefix.length) : full;
            var parts = rel
                .split('/')
                .map(function (p) {
                    return p.trim();
                })
                .filter(Boolean);
            if (parts.length === 0) {
                var leaf = full.split('/').filter(Boolean).pop() || full;
                parts = [leaf];
            }
            insertPath(root, parts, entry);
        });
        return root;
    }

    function renderTreeNode(container, node, selectFileFn) {
        var folderKeys = Object.keys(node).filter(function (k) {
            return k !== '__files';
        });
        folderKeys.sort();

        folderKeys.forEach(function (folder) {
            var details = document.createElement('details');
            details.className = 'ide-tree-details';
            details.open = true;
            var summary = document.createElement('summary');
            summary.className = 'ide-tree-folder';
            summary.textContent = folder;
            details.appendChild(summary);
            var inner = document.createElement('div');
            inner.className = 'ide-tree-inner';
            renderTreeNode(inner, node[folder], selectFileFn);
            details.appendChild(inner);
            container.appendChild(details);
        });

        if (node.__files && node.__files.length) {
            node.__files.sort(function (a, b) {
                return a.name.localeCompare(b.name);
            });
            node.__files.forEach(function (f) {
                var btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'ide-file-btn ide-tree-leaf';
                btn.setAttribute('data-path', f.entry.path);
                btn.textContent = f.name;
                btn.addEventListener('click', function () {
                    selectFileFn(f.entry);
                });
                container.appendChild(btn);
            });
        }
    }

    function findGeneratedFilesGroup(manifest) {
        var groups = manifest.groups || [];
        var best = null;
        var bestScore = -1;
        for (var i = 0; i < groups.length; i++) {
            var g = groups[i];
            var n = g.files && g.files.length ? g.files.length : 0;
            if (n === 0) continue;
            var score = n;
            if (g.layout === 'tree') score += 1000;
            if (/generated/i.test(g.title || '')) score += 100;
            if (score > bestScore) {
                bestScore = score;
                best = g;
            }
        }
        return best;
    }

    function initHomepagePreview(options) {
        var manifestUrl = (options && options.manifestUrl) || DEFAULT_MANIFEST;
        var root = document.getElementById('mh-code-preview');
        if (!root) return;

        var modelTitle = root.querySelector('[data-mh-preview-title="model"]');
        var modelBody = root.querySelector('[data-mh-preview-body="model"]');
        var outputSummary = root.querySelector('[data-mh-preview-output-summary]');
        var outputList = root.querySelector('[data-mh-preview-output-list]');
        var outputListWrap = root.querySelector('[data-mh-preview-output-list-wrap]');
        var outputEmpty = root.querySelector('[data-mh-preview-output-empty]');
        var outputPreviewWrap = root.querySelector('[data-mh-output-preview-wrap]');
        var outputPreviewLabel = root.querySelector('[data-mh-output-preview-label]');
        var outputPreviewBody = root.querySelector('[data-mh-output-preview-body]');
        var errEl = root.querySelector('[data-mh-preview-error]');

        function fail(msg) {
            if (errEl) {
                errEl.hidden = false;
                errEl.textContent = msg;
            }
        }

        var codePreviewNeedsPrism = false;
        var highlightPayload = {
            ready: false,
            hp: null,
            modelText: '',
            previewEntry: null,
            previewText: null
        };

        function runHomepageSyntaxHighlight() {
            if (!codePreviewNeedsPrism || !highlightPayload.ready) return;
            ensureHomepagePrismLoaded()
                .then(function () {
                    var h = highlightPayload;
                    if (modelBody && h.hp) {
                        modelBody.textContent = h.modelText;
                    }
                    if (h.previewEntry && outputPreviewBody && h.previewText != null) {
                        highlightHomepageCode(
                            outputPreviewBody,
                            h.previewEntry.path,
                            h.previewText
                        );
                    }
                })
                .catch(function () {});
        }

        if ('IntersectionObserver' in global) {
            var prismIo = new IntersectionObserver(
                function (entries) {
                    var i;
                    for (i = 0; i < entries.length; i++) {
                        if (entries[i].isIntersecting) {
                            codePreviewNeedsPrism = true;
                            prismIo.disconnect();
                            runHomepageSyntaxHighlight();
                            break;
                        }
                    }
                },
                { rootMargin: '200px 0px', threshold: 0 }
            );
            prismIo.observe(root);
        } else {
            codePreviewNeedsPrism = true;
        }

        loadManifest(manifestUrl)
            .then(function (manifest) {
                var hp = manifest.homepagePreview;
                if (!hp || !hp.model) {
                    fail('Manifest missing homepagePreview.model.');
                    return;
                }
                if (modelTitle) modelTitle.textContent = hp.model.title || hp.model.path;

                var gen = findGeneratedFilesGroup(manifest);
                var previewPromise = Promise.resolve();
                highlightPayload.previewEntry = null;
                highlightPayload.previewText = null;

                if (outputPreviewWrap) outputPreviewWrap.hidden = true;
                if (outputPreviewBody) highlightHomepageCode(outputPreviewBody, '', '');
                if (outputPreviewLabel) outputPreviewLabel.textContent = '';

                if (outputSummary && outputList) {
                    if (gen && gen.files && gen.files.length) {
                        var files = gen.files.slice().sort(function (a, b) {
                            return String(a.label || a.path).localeCompare(String(b.label || b.path));
                        });
                        outputList.innerHTML = '';
                        files.forEach(function (f) {
                            var li = document.createElement('li');
                            appendPathWithBoldFilename(li, f.label || f.path);
                            outputList.appendChild(li);
                        });
                        if (outputListWrap) outputListWrap.hidden = false;
                        if (outputEmpty) outputEmpty.hidden = true;
                        outputSummary.textContent =
                            files.length + ' file' + (files.length === 1 ? '' : 's') + ' · full source in explorer';

                        var previewEntry = null;
                        for (var fi = 0; fi < files.length; fi++) {
                            if (/\.java$/i.test(String(files[fi].path || ''))) {
                                previewEntry = files[fi];
                                break;
                            }
                        }
                        if (previewEntry && outputPreviewWrap && outputPreviewLabel && outputPreviewBody) {
                            var pIdx = files.indexOf(previewEntry) + 1;
                            var pName =
                                previewEntry.label ||
                                String(previewEntry.path || '')
                                    .split('/')
                                    .filter(Boolean)
                                    .pop() ||
                                previewEntry.path;
                            setOutputPreviewLabel(
                                outputPreviewLabel,
                                'Preview — one of the generated files',
                                pName,
                                pIdx,
                                files.length
                            );
                            highlightPayload.previewEntry = previewEntry;
                            previewPromise = fetchText(previewEntry.path)
                                .then(function (text) {
                                    highlightPayload.previewText = text;
                                    if (outputPreviewBody) outputPreviewBody.textContent = text;
                                    outputPreviewWrap.hidden = false;
                                })
                                .catch(function () {
                                    highlightPayload.previewEntry = null;
                                    highlightPayload.previewText = null;
                                    outputPreviewWrap.hidden = true;
                                });
                        }
                    } else {
                        if (outputListWrap) outputListWrap.hidden = true;
                        outputList.innerHTML = '';
                        if (outputEmpty) outputEmpty.hidden = false;
                        outputSummary.textContent = 'No generated files';
                    }
                }

                return Promise.all([
                    fetchText(hp.model.path).then(function (t) {
                        var sliced = sliceLines(t, hp.model.startLine, hp.model.endLine);
                        highlightPayload.hp = hp;
                        highlightPayload.modelText = sliced;
                        if (modelBody) modelBody.textContent = sliced;
                    }),
                    previewPromise
                ]);
            })
            .then(function () {
                if (!highlightPayload.hp) return;
                highlightPayload.ready = true;
                runHomepageSyntaxHighlight();
            })
            .catch(function (e) {
                fail(
                    'Could not load preview. Serve this site over HTTP (e.g. python3 -m http.server) so fetch can read demo-data/. ' +
                        (e && e.message ? e.message : '')
                );
            });
    }

    function initIdePage(options) {
        var manifestUrl = (options && options.manifestUrl) || DEFAULT_MANIFEST;
        var sidebar = document.getElementById('ide-sidebar');
        var titleEl = document.getElementById('ide-file-title');
        var descEl = document.getElementById('ide-file-desc');
        var codeEl = document.getElementById('ide-file-code');
        var bodyEl = document.getElementById('ide-file-body');
        var errEl = document.getElementById('ide-error');

        var codeTarget = codeEl || bodyEl;
        if (!sidebar || !codeTarget) return;

        var cache = {};

        function showError(msg) {
            if (errEl) {
                errEl.hidden = false;
                errEl.textContent = msg;
            }
        }

        function clearActive() {
            sidebar.querySelectorAll('.ide-file-btn').forEach(function (btn) {
                btn.classList.remove('ide-file-btn-active');
            });
        }

        function selectFile(entry) {
            if (titleEl) titleEl.textContent = entry.label || entry.path;
            if (descEl) descEl.textContent = entry.description || '';
            if (codeEl) codeEl.removeAttribute('class');
            setIdePreLanguageClass(codeTarget, null);
            codeTarget.textContent = 'Loading…';

            var path = entry.path;
            var p = cache[path]
                ? Promise.resolve(cache[path])
                : fetchText(path).then(function (text) {
                      cache[path] = text;
                      return text;
                  });

            p.then(function (text) {
                highlightCode(codeTarget, path, text);
                if (errEl) errEl.hidden = true;
            }).catch(function (e) {
                codeTarget.textContent = '';
                showError(
                    'Could not load file. Use a local HTTP server from the website root. ' + (e && e.message ? e.message : '')
                );
            });

            clearActive();
            sidebar.querySelectorAll('.ide-file-btn[data-path="' + escapeCssIdent(path) + '"]').forEach(function (btn) {
                btn.classList.add('ide-file-btn-active');
            });
        }

        loadManifest(manifestUrl)
            .then(function (manifest) {
                var h1 = document.getElementById('ide-page-title');
                var sub = document.getElementById('ide-page-subtitle');
                if (h1 && manifest.title) h1.textContent = manifest.title;
                if (sub && manifest.subtitle) sub.textContent = manifest.subtitle;

                (manifest.groups || []).forEach(function (group) {
                    var gh = document.createElement('div');
                    gh.className = 'ide-group';
                    var gt = document.createElement('div');
                    gt.className = 'ide-group-title';
                    gt.textContent = group.title || 'Files';
                    gh.appendChild(gt);

                    if (group.layout === 'tree' && group.files && group.files.length) {
                        var treeRoot = document.createElement('div');
                        treeRoot.className = 'ide-tree-root';
                        var tree = buildFileTree(group.files);
                        renderTreeNode(treeRoot, tree, selectFile);
                        gh.appendChild(treeRoot);
                    } else {
                        (group.files || []).forEach(function (file) {
                            var btn = document.createElement('button');
                            btn.type = 'button';
                            btn.className = 'ide-file-btn';
                            btn.setAttribute('data-path', file.path);
                            btn.textContent = file.label || file.path;
                            btn.addEventListener('click', function () {
                                selectFile(file);
                            });
                            gh.appendChild(btn);
                        });
                    }

                    sidebar.appendChild(gh);
                });

                var first = manifest.groups && manifest.groups[0] && manifest.groups[0].files && manifest.groups[0].files[0];
                if (first) selectFile(first);
            })
            .catch(function (e) {
                showError('Failed to load manifest: ' + (e && e.message ? e.message : String(e)));
            });
    }

    global.ModelHikeDemo = {
        loadManifest: loadManifest,
        initHomepagePreview: initHomepagePreview,
        initIdePage: initIdePage
    };
})(typeof window !== 'undefined' ? window : globalThis);
