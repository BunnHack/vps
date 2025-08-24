import { nanoid } from "nanoid";
import { createIcons, icons } from "lucide";

const form = document.getElementById("prompt-form");
const input = document.getElementById("prompt-input");
const content = document.getElementById("content");
const sidebar = document.getElementById("sidebar");
const toggleBtn = document.querySelector(".sidebar-toggle");
const statusCount = document.getElementById("status-count");
const filterEven = document.getElementById("filter-even");
const filterOdd = document.getElementById("filter-odd");
const sendBtn = document.getElementById("send-btn");
const modelBtn = document.getElementById("model-btn");
const modelMenu = document.getElementById("model-menu");
const moreBtn = document.querySelector(".more-btn");
const moreMenu = document.getElementById("more-menu");

const labsBtn = document.querySelector(".topbar .labs-btn");
const labsMenu = document.getElementById("labs-menu");

/* sidebar prompt refs */
const formSide = document.getElementById("prompt-form-side");
const inputSide = document.getElementById("prompt-input-side");
const sendBtnSide = document.getElementById("send-btn-side");
const modelBtnSide = document.getElementById("model-btn-side");
const modelMenuSide = document.getElementById("model-menu-side");
const labsBtnSide = document.querySelector("#sidebar .labs-btn");
const labsMenuSide = document.getElementById("labs-menu-side");

/* Tab elements */
const tabs = Array.from(document.querySelectorAll('.sidebar .tab'));
const panels = {
  "tab-shortcuts": document.getElementById("panel-shortcuts"),
  "tab-filters": document.getElementById("panel-filters"),
  "tab-status": document.getElementById("panel-status"),
};

const MODELS = [
  "GPT-4o","GPT-4 Turbo","GPT-3.5 Turbo",
  "Claude 3.5 Sonnet","Claude 3 Opus",
  "Llama 3 70B","Llama 3 8B",
  "Mistral Large","Mixtral 8x7B","Gemini 1.5 Pro"
];
let currentModel = MODELS[0];

const LAB_ITEMS = [
  { name: "AI Models", tip: "Call models to generate text, images, and speech inside your app." },
  { name: "Database", tip: "Store, query, and manage your app’s structured data securely." },
  { name: "Comments", tip: "Collect and display user feedback and discussion threads." },
  { name: "Web Browsing", tip: "Let the assistant read live web pages to gather current info." },
  { name: "Code Interpreter", tip: "Run code for data analysis, plots, and file transformations." },
  { name: "Files", tip: "Upload, manage, and reference files in your conversations." }
];
function buildLabsMenu(menuEl) {
  menuEl.innerHTML = "";
  const g1 = document.createElement("div"); g1.className = "group";
  g1.innerHTML = `<div class="title">Advanced Abilities</div>`;
  LAB_ITEMS.forEach((it, i) => {
    const id = `lab-${it.name.toLowerCase().replace(/\s+/g,'-')}-${i}`;
    const wrap = document.createElement("div");
    wrap.innerHTML = `
      <label class="labs-item" for="${id}">
        <input id="${id}" type="checkbox" />
        <span>${it.name}</span>
      </label>
      <div class="labs-tip">${it.tip}</div>
    `;
    g1.appendChild(wrap);
  });
  const g2 = document.createElement("div"); g2.className = "group";
  g2.innerHTML = `<div class="title">Tooltips <span style="font-weight:600">(no functionality)</span></div>`;
  menuEl.append(g1,g2);
}

let items = [];

function renderItems() {
  content.innerHTML = "";
  const list = document.createDocumentFragment();
  const filtered = items.filter((it, idx) => {
    if (filterEven.checked && (idx + 1) % 2 !== 0) return false;
    if (filterOdd.checked && (idx + 1) % 2 !== 1) return false;
    return true;
  });

  if (filtered.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.innerHTML = "<h1>No items yet</h1><p>Type a prompt above and press Enter.</p>";
    content.appendChild(empty);
  } else {
    filtered.forEach((it) => {
      const card = document.createElement("article");
      card.className = "card";
      card.setAttribute("aria-label", "Prompt item");
      card.innerHTML = `
        <div class="meta">
          <span>#${it.index}</span>
          <span>•</span>
          <time datetime="${it.iso}">${it.time}</time>
          <span>•</span>
          <span>${it.id.slice(0,6)}</span>
        </div>
        <div class="text">${escapeHTML(it.text)}</div>
      `;
      list.appendChild(card);
    });
    content.appendChild(list);
  }
  statusCount.textContent = `${items.length} item${items.length === 1 ? "" : "s"}`;
}

function addItem(text) {
  const now = new Date();
  items.push({
    id: nanoid(),
    index: items.length + 1,
    text,
    iso: now.toISOString(),
    time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  });
  renderItems();
}

function escapeHTML(s) {
  return s.replace(/[&<>"']/g, (c) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
}

function activateTab(id) {
  tabs.forEach(t => {
    const on = t.id === id;
    t.classList.toggle("is-active", on);
    t.setAttribute("aria-selected", String(on));
    const p = panels[t.id];
    if (p) { p.toggleAttribute("hidden", !on); p.classList.toggle("is-active", on); }
  });
}

function buildModelMenu() {
  modelMenu.innerHTML = "";
  MODELS.forEach(name => {
    const b = document.createElement("button");
    b.type = "button"; b.role = "option"; b.textContent = name;
    b.setAttribute("aria-selected", String(name === currentModel));
    b.addEventListener("click", () => { currentModel = name; modelBtn.textContent = name; closeModelMenu(); });
    modelMenu.appendChild(b);
  });
}
/* duplicate for sidebar */
function buildModelMenuSide() {
  modelMenuSide.innerHTML = "";
  MODELS.forEach(name => {
    const b = document.createElement("button");
    b.type = "button"; b.role = "option"; b.textContent = name;
    b.setAttribute("aria-selected", String(name === currentModel));
    b.addEventListener("click", () => { currentModel = name; modelBtnSide.textContent = name; closeModelMenuSide(); });
    modelMenuSide.appendChild(b);
  });
}

function openModelMenu(){ 
  buildModelMenu(); 
  modelMenu.hidden = false; 
  modelBtn.setAttribute("aria-expanded","true"); 
}
function closeModelMenu(){ 
  modelMenu.hidden = true; 
  modelBtn.setAttribute("aria-expanded","false"); 
}
/* sidebar menu open/close */
function openModelMenuSide(){ 
  buildModelMenuSide(); 
  modelMenuSide.hidden = false; 
  modelBtnSide.setAttribute("aria-expanded","true"); 
}
function closeModelMenuSide(){ 
  modelMenuSide.hidden = true; 
  modelBtnSide.setAttribute("aria-expanded","false"); 
}

function openLabs(menuEl, btnEl){ buildLabsMenu(menuEl); menuEl.hidden=false; btnEl.setAttribute("aria-expanded","true"); }
function closeLabs(menuEl, btnEl){ menuEl.hidden=true; btnEl.setAttribute("aria-expanded","false"); }

function openMoreMenu(){ moreMenu.hidden = false; moreBtn.setAttribute("aria-expanded","true"); }
function closeMoreMenu(){ moreMenu.hidden = true; moreBtn.setAttribute("aria-expanded","false"); }

function collapsePrompt() { 
  form.classList.remove("expanded"); 
  formSide?.classList.remove("expanded"); 
}

function submitForm(inputEl) {
    const text = inputEl.value.trim();
    if (!text) return;
    addItem(text);
    inputEl.value = "";
    collapsePrompt();
    inputEl.focus();
}

form.addEventListener("submit", (e) => { 
  e.preventDefault(); 
  submitForm(input); 
});
/* ...existing code... */
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) { 
    e.preventDefault(); 
    submitForm(input); 
  }
});
/* sidebar form events */
formSide.addEventListener("submit", (e) => { 
  e.preventDefault(); 
  submitForm(inputSide); 
});
inputSide.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) { 
    e.preventDefault(); 
    submitForm(inputSide); 
  }
});

input.addEventListener("focus", () => form.classList.add("expanded"));
/* ...existing code... */
inputSide.addEventListener("focus", () => formSide.classList.add("expanded"));

toggleBtn.addEventListener("click", () => {
  const open = sidebar.classList.toggle("open");
  toggleBtn.setAttribute("aria-expanded", String(open));
});
modelBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  const open = modelBtn.getAttribute("aria-expanded") === "true";
  open ? closeModelMenu() : openModelMenu();
});
modelBtnSide.addEventListener("click", (e) => {
  e.stopPropagation();
  const open = modelBtnSide.getAttribute("aria-expanded") === "true";
  open ? closeModelMenuSide() : openModelMenuSide();
});

labsBtn.addEventListener("click",(e)=>{ e.stopPropagation(); (labsBtn.getAttribute("aria-expanded")==="true")? closeLabs(labsMenu,labsBtn): openLabs(labsMenu,labsBtn); });
labsBtnSide.addEventListener("click",(e)=>{ e.stopPropagation(); (labsBtnSide.getAttribute("aria-expanded")==="true")? closeLabs(labsMenuSide,labsBtnSide): openLabs(labsMenuSide,labsBtnSide); });

moreBtn.addEventListener("click",(e)=>{ e.stopPropagation(); (moreBtn.getAttribute("aria-expanded")==="true")? closeMoreMenu(): openMoreMenu(); });
document.getElementById("view-source-btn").addEventListener("click", ()=> { window.open(`view-source:${location.href}`, "_blank"); closeMoreMenu(); });
document.getElementById("copy-url-btn").addEventListener("click", async ()=> { try{ await navigator.clipboard.writeText(location.href); }catch{} closeMoreMenu(); });

document.addEventListener("click", (e) => {
  const t = e.target;
  if (!modelMenu.hidden && !modelMenu.contains(t) && t !== modelBtn) closeModelMenu();
  if (!modelMenuSide.hidden && !modelMenuSide.contains(t) && t !== modelBtnSide) closeModelMenuSide();
  if (!labsMenu.hidden && !labsMenu.contains(t) && t!==labsBtn) closeLabs(labsMenu,labsBtn);
  if (!labsMenuSide.hidden && !labsMenuSide.contains(t) && t!==labsBtnSide) closeLabs(labsMenuSide,labsBtnSide);
  if (!moreMenu.hidden && !moreMenu.contains(e.target) && e.target !== moreBtn) closeMoreMenu();
  const outsideForms = !form.contains(t) && !(formSide && formSide.contains(t));
  const inMenusOrBtns = modelMenu.contains(t) || modelMenuSide.contains(t) || t === modelBtn || t === modelBtnSide || labsMenu.contains(t) || labsMenuSide.contains(t) || t === labsBtn || t === labsBtnSide || moreMenu.contains(t) || t === moreBtn;
  if (outsideForms && !inMenusOrBtns) collapsePrompt();
});

document.addEventListener("keydown", (e) => {
  // focus shortcuts
  if ((e.key === "/" && document.activeElement !== input) ||
      ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === "k"))) {
    e.preventDefault();
    input.focus();
    input.select();
  }
  if (e.key === "Escape" && document.activeElement === input) {
    input.value = "";
    collapsePrompt();
  }
  if (e.key === "Escape" && !modelMenu.hidden) closeModelMenu();
  if (e.key === "Escape" && !modelMenuSide.hidden) closeModelMenuSide();
  if (e.key === "Escape" && !labsMenu.hidden) closeLabs(labsMenu,labsBtn);
  if (e.key === "Escape" && !labsMenuSide.hidden) closeLabs(labsMenuSide,labsBtnSide);
  if (e.key === "Escape" && !moreMenu.hidden) closeMoreMenu();
  if (e.key === "Escape") collapsePrompt();
});

tabs.forEach(tab => {
  tab.addEventListener("click", () => activateTab(tab.id));
  tab.addEventListener("keydown", (e) => {
    if (!["ArrowLeft","ArrowRight","Home","End"].includes(e.key)) return;
    e.preventDefault();
    const i = tabs.indexOf(tab);
    const next = e.key==="ArrowRight"? (i+1)%tabs.length : e.key==="ArrowLeft"? (i-1+tabs.length)%tabs.length : e.key==="Home"? 0 : tabs.length-1;
    tabs[next].focus(); activateTab(tabs[next].id);
  });
});

[filterEven, filterOdd].forEach(cb => {
  cb.addEventListener("change", () => {
    // ensure not both checked; if both, uncheck the other
    if (filterEven.checked && filterOdd.checked) {
      // toggle off the one that was not changed last
      (cb === filterEven ? filterOdd : filterEven).checked = false;
    }
    renderItems();
  });
});

// Initial render
renderItems();

createIcons({ icons, attrs: { width: 18, height: 18, "aria-hidden": "true", focusable: "false" } });