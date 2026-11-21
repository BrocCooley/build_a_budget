/* Shared site behavior: header, footer, and filling in your words from content.js.
   Each page sets <body data-root="../"> (or "" on the home page) and data-page="map" etc. */
(function () {
  const body = document.body;
  const ROOT = body.dataset.root || "";
  const PAGE = body.dataset.page || "";
  const C = window.CONTENT || {};
  const CFG = window.SITE_CONFIG || {};

  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  // **bold** and *italic* only; everything else is plain text
  const inline = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>");
  window.SITE = { ROOT, esc, inline };

  // ---------- Header + footer ----------
  const NAV = [
    ["home", "Home", ""],
    ["map", "Map", "map/"],
    ["game", "Game", "game/"],
    ["what-now", "What Now", "what-now/"],
    ["works-cited", "Works Cited", "works-cited/"]
  ];
  const title = C.site_title && !/^TODO:/i.test(C.site_title) ? C.site_title : "Food Insecurity in the U.S.";
  const header = document.getElementById("site-header");
  if (header) {
    header.className = "site-header";
    header.innerHTML = `<div class="wrap">
      <a class="brand" href="${ROOT || "./"}">${esc(title)}</a>
      <nav aria-label="Main"><ul class="nav">${NAV.map(([id, label, href]) =>
        `<li><a href="${ROOT}${href || ""}"${id === PAGE ? ' aria-current="page"' : ""}>${label}</a></li>`).join("")}</ul></nav>
    </div>`;
    if (!header.previousElementSibling || !header.previousElementSibling.classList.contains("skip")) {
      header.insertAdjacentHTML("beforebegin", '<a class="skip" href="#main">Skip to content</a>');
    }
  }
  const footer = document.getElementById("site-footer");
  if (footer) {
    footer.className = "site-footer";
    footer.innerHTML = `<div class="wrap">
      <span>${CFG.AUTHOR ? "Created by " + esc(CFG.AUTHOR) + " · " : ""}A multimodal project on food insecurity</span>
      <span><a href="${ROOT}works-cited/">Works Cited</a></span>
    </div>`;
  }

  // ---------- YOUR WORDS ----------
  // <div data-content="home_thesis"></div> → your text, or a yellow placeholder if it still starts with "TODO:"
  // Turns your text into short, scannable pieces:
  //   paragraphs (blank line between), bullet lists ("- " lines), and cards ("- **Name:** sentence" lines)
  function renderText(val) {
    return val.split(/\n\s*\n/).map((block) => {
      const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
      const isList = lines.length && lines.every((l) => /^[-•]\s+/.test(l));
      if (isList) {
        const items = lines.map((l) => l.replace(/^[-•]\s+/, ""));
        const cardRe = /^\*\*(.+?)\*\*:?\s*(.*)$/;
        if (items.every((i) => cardRe.test(i))) {
          return `<div class="content-cards">${items.map((i) => {
            const m = i.match(cardRe);
            return `<div class="content-card"><h3>${inline(m[1].replace(/:$/, ""))}</h3>${m[2] ? `<p>${inline(m[2])}</p>` : ""}</div>`;
          }).join("")}</div>`;
        }
        return `<ul class="content-list">${items.map((i) => `<li>${inline(i)}</li>`).join("")}</ul>`;
      }
      return `<p>${lines.map(inline).join("<br>")}</p>`;
    }).join("");
  }

  document.querySelectorAll("[data-content]").forEach((el) => {
    const key = el.dataset.content;
    const val = typeof C[key] === "string" ? C[key].trim() : "";
    if (!val || /^TODO:/i.test(val)) {
      const q = val.replace(/^TODO:\s*/i, "") || "Write this section.";
      el.innerHTML = `<div class="yw" role="note"><span class="yw-label">YOUR WORDS</span><p>${q.split("\n").map(inline).join("<br>")}</p><span class="yw-key">content.js → ${esc(key)}</span></div>`;
      el.classList.add("is-placeholder");
    } else {
      el.innerHTML = `<div class="content-text">${renderText(val)}</div>`;
    }
  });

  document.querySelectorAll("[data-site-title]").forEach((el) => { el.textContent = title; });
  if (PAGE !== "home") document.title = document.title.replace("{site}", title);
  else document.title = title;
})();
