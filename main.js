const LS_val = "pythonEditor";
let currentLanguage = localStorage.getItem("language") || "en";
let pyodide;
const codeArea = document.getElementById("code");
const highlighter = document.getElementById("highlighter");
const lineNumbers = document.getElementById("line-numbers");
const output = document.getElementById("output");
const runBtn = document.getElementById("runBtn");
const languageSelector = document.getElementById("language");
let currentMode = "editor";
let currentProblem = null;

const problemSelect = document.getElementById("problemSelect");

problemSelect.addEventListener("change", () => {
    loadProblem(problemSelect.value);
});

function populateProblems() {

    const selected = problemSelect.value;

    problemSelect.innerHTML = "";

    for (const key in problems) {

        const option = document.createElement("option");
        option.value = key;
        option.textContent = problems[key].title[currentLanguage];

        if (key === selected)
            option.selected = true;

        problemSelect.appendChild(option);
    }
}

function formatText(text) {
    return text
        .trim()
        .replace(/\n\s+/g, "\n");
}

function loadProblem(key) {

    currentProblem = problems[key];

    document.getElementById("problemTitle").textContent =
        currentProblem.title[currentLanguage];

    document.getElementById("problemStatement").textContent =
        formatText(currentProblem.statement[currentLanguage]);

    document.getElementById("problemInput").textContent =
        formatText(currentProblem.input[currentLanguage]);

    document.getElementById("problemOutput").textContent =
        formatText(currentProblem.output[currentLanguage]);

    document.getElementById("problemConstraints").textContent =
        formatText(currentProblem.constraints[currentLanguage]);

}

function applyLanguage() {

    const t = translations[currentLanguage];
    if (!t) return;

    document.title = t.title;

    document.getElementById("title").textContent = t.title;
    document.getElementById("outputTitle").textContent = t.output;

    runBtn.textContent = t.run;

    document.getElementById("stopBtn").textContent = t.stop;
    document.getElementById("uploadBtn").textContent = t.upload;
    document.getElementById("copyBtn").textContent = t.copy;
    document.getElementById("downloadBtn").textContent = t.download;
    document.getElementById("clearBtn").textContent = t.clear;

    populateProblems();

    if (currentProblem) {
        loadProblem(problemSelect.value);
    }
}

languageSelector.addEventListener("change", e => {

    currentLanguage = e.target.value;

    localStorage.setItem("language", currentLanguage);

    applyLanguage();

});

// --- 1. HIGHLIGHTER ---
function applyHighlight(text) {
    let html = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const patterns = [
        { name: 'comment', regex: /#.*$/gm },
        { name: 'string',  regex: /(['"])(?:(?=(\\?))\2.)*?\1/g },
        { name: 'keyword', regex: /\b(def|class|if|else|elif|for|while|return|import|from|try|except|as|with|in|is|not|and|or|lambda|pass|break|continue)\b/g },
        { name: 'builtin', regex: /\b(print|input|len|range|str|int|float|list|dict|set|type|sum|max|min)\b/g }
    ];
    let parts = [{ text: html, isToken: false }];
    patterns.forEach(p => {
        let newParts = [];
        parts.forEach(part => {
            if (part.isToken) newParts.push(part);
            else {
                let lastIdx = 0, m;
                while ((m = p.regex.exec(part.text)) !== null) {
                    if (m.index > lastIdx) newParts.push({ text: part.text.substring(lastIdx, m.index), isToken: false });
                    newParts.push({ text: `<span class="hl-${p.name}">${m[0]}</span>`, isToken: true });
                    lastIdx = p.regex.lastIndex;
                }
                if (lastIdx < part.text.length) newParts.push({ text: part.text.substring(lastIdx), isToken: false });
            }
        });
        parts = newParts;
    });
    return parts.map(p => p.text).join("");
}

// --- 2. EDITOR SYNC ---
function updateEditor() {
    const val = codeArea.value;
    highlighter.innerHTML = applyHighlight(val) + "\n";
    
    const lines = val.split('\n');
    const displayCount = Math.max(lines.length, 20);
    let numStr = '';
    for (let i = 1; i <= displayCount; i++) {
        numStr += (i > lines.length) ? `<span style="opacity:0.2">${i}</span><br>` : `${i}<br>`;
    }
    lineNumbers.innerHTML = numStr;
    localStorage.setItem(LS_val, val);
}

codeArea.addEventListener('scroll', () => {
    highlighter.scrollTop = lineNumbers.scrollTop = codeArea.scrollTop;
    highlighter.scrollLeft = codeArea.scrollLeft;
});

codeArea.addEventListener('input', updateEditor);

// --- 3. KEYBOARD SHORTCUTS ---
const pairs = { '(': ')', '[': ']', '{': '}', '"': '"', "'": "'" };

codeArea.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        runCode();
        return;
    }

    const s = this.selectionStart, e_idx = this.selectionEnd, v = this.value;
    if (pairs[e.key]) {
        e.preventDefault();
        this.value = v.substring(0, s) + e.key + pairs[e.key] + v.substring(e_idx);
        this.selectionStart = this.selectionEnd = s + 1;
        updateEditor();
    }
    if (e.key === 'Tab') {
        e.preventDefault();
        this.value = v.substring(0, s) + "    " + v.substring(e_idx);
        this.selectionStart = this.selectionEnd = s + 4;
        updateEditor();
    }
    if (e.key === 'Enter') {
        e.preventDefault();
        const lineStart = v.lastIndexOf("\n", s - 1) + 1;
        const currentLine = v.substring(lineStart, s);
        let indent = currentLine.match(/^\s*/)[0];
        if (currentLine.trimEnd().endsWith(":")) indent += "    ";
        this.value = v.substring(0, s) + "\n" + indent + v.substring(e_idx);
        this.selectionStart = this.selectionEnd = s + 1 + indent.length;
        updateEditor();
    }
});

// --- 4. ENGINE LOGIC ---
async function setupPyodide() {
  runBtn.disabled = true;
  try {
    pyodide = await loadPyodide();
    window.update_out = (t) => { output.textContent += t; output.scrollTop = output.scrollHeight; };
    await pyodide.runPythonAsync(`
import sys, builtins, js, importlib
def reset_streams():
    class S:
        def write(self, s): js.update_out(s)
        def flush(self): pass
    sys.stdout = sys.stderr = S()
reset_streams()
builtins.input = lambda m="": js.prompt(m)

orig = builtins.__import__
def guard(n, g=None, l=None, f=(), lev=0):
    base = n.split('.')[0]
    if base not in sys.builtin_module_names and base not in sys.modules:
        if not importlib.util.find_spec(base):
            raise ImportError(f"\\n[!] Blocked: '{n}' is external.")
    return orig(n, g, l, f, lev)
builtins.__import__ = guard
    `);
    runBtn.disabled = false;
    const t = translations[currentLanguage];
      runBtn.textContent = t.run;
      output.textContent = t.ready + "\n";
  } catch (e) {
    output.textContent = e;
}
}
  
async function runCode() {
    if (runBtn.disabled) return;
    output.textContent = "";
    await pyodide.runPythonAsync("reset_streams()");
    try {
        await pyodide.runPythonAsync(codeArea.value);
    } catch (err) {
        output.textContent += "\n" + err;
    }
}

function resetEngine() {
    const t = translations[currentLanguage];

    if (confirm(t.restartConfirm)) {
        output.textContent = t.restarting;
        setupPyodide();
    }
}

// --- 5. UTILS ---
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        codeArea.value = e.target.result;
        updateEditor();
        // Reset file input so same file can be uploaded again if needed
        event.target.value = '';
    };
    reader.readAsText(file);
}

function copyCode() {
    navigator.clipboard.writeText(codeArea.value);
    const b = event.target;
    const oldText = b.innerText;
    b.innerText = translations[currentLanguage].copied;
    setTimeout(() => b.innerText = oldText, 1500);
}

function downloadCode() {
    let filename = prompt(
        translations[currentLanguage].filename,
        "script.py"
    );    
    if (filename === null) return;
    if (!filename.endsWith(".py")) filename += ".py";
    const blob = new Blob([codeArea.value], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
}

function clearEditor() {
    if (confirm(translations[currentLanguage].clearConfirm)) {
        codeArea.value = "";
        updateEditor();
    }
}

window.onload = () => {

    const saved = localStorage.getItem(LS_val);
    if (saved) codeArea.value = saved;

    languageSelector.value = currentLanguage;

    document.getElementById("problemPanel").style.display = "block";

    applyLanguage();

    loadProblem(problemSelect.value);

    updateEditor();

    setupPyodide();

    output.textContent = translations[currentLanguage].starting;
};
