/* Interactive state map. Data: data/states.json (USDA ERS). Shapes: data/us-states.json (U.S. Census via us-atlas). */
(async function () {
  const ROOT = (window.SITE && SITE.ROOT) || "";
  const esc = (window.SITE && SITE.esc) || ((s) => s);
  const $ = (id) => document.getElementById(id);
  const HIGHLIGHT = ["MN"];

  // Single-hue sequential scale (green, matching the game's accent)
  const BINS = [
    { max: 10, color: "#e2efe7", label: "Under 10%" },
    { max: 12, color: "#b3d6c3", label: "10–11.9%" },
    { max: 14, color: "#79b498", label: "12–13.9%" },
    { max: 16, color: "#3e8a6b", label: "14–15.9%" },
    { max: Infinity, color: "#17513d", label: "16% or more" }
  ];
  const colorFor = (v) => BINS.find((b) => v < b.max).color;

  let shapes, data;
  try {
    [shapes, data] = await Promise.all([
      fetch(ROOT + "data/us-states.json").then((r) => r.json()),
      fetch(ROOT + "data/states.json").then((r) => r.json())
    ]);
  } catch (e) {
    $("info").innerHTML = '<p>The map data could not load. If you opened this file directly, run a local server instead (see README).</p>';
    return;
  }
  const US = data.us;
  const byAbbr = Object.fromEntries(data.states.map((s) => [s.abbr, s]));
  const svg = $("usmap"), tip = $("tip"), box = $("mapBox");
  const NS = "http://www.w3.org/2000/svg";

  // ---------- Draw ----------
  const gAll = document.createElementNS(NS, "g");
  const gTop = document.createElementNS(NS, "g"); gTop.setAttribute("class", "top");
  const paths = {};
  for (const sh of shapes.states) {
    const s = byAbbr[sh.abbr]; if (!s) continue;
    const p = document.createElementNS(NS, "path");
    p.setAttribute("d", sh.d);
    p.setAttribute("fill", colorFor(s.food_insecure_pct));
    p.setAttribute("tabindex", "0");
    p.setAttribute("role", "button");
    p.setAttribute("aria-label", `${s.name}: ${s.food_insecure_pct.toFixed(1)}% of households food insecure`);
    p.dataset.abbr = s.abbr;
    if (HIGHLIGHT.includes(s.abbr)) p.classList.add("hl");
    (HIGHLIGHT.includes(s.abbr) ? gTop : gAll).appendChild(p);
    paths[s.abbr] = p;
  }
  svg.append(gAll, gTop);
  for (const sh of shapes.states) {          // labels for the highlighted states
    if (!HIGHLIGHT.includes(sh.abbr) || !sh.label) continue;
    const t = document.createElementNS(NS, "text");
    t.setAttribute("x", sh.label[0]); t.setAttribute("y", sh.label[1] + 5);
    t.setAttribute("text-anchor", "middle");
    t.textContent = sh.abbr;
    svg.appendChild(t);
  }

  // ---------- Legend ----------
  $("legend").innerHTML = BINS.map((b) => `<span><i class="sw" style="background:${b.color}"></i>${b.label}</span>`).join("")
    + `<span><i class="hlk"></i>Minnesota</span>`
    + `<span class="muted">U.S. average: ${US.food_insecure_pct.toFixed(1)}%</span>`;

  // ---------- Info panel ----------
  const pts = (d) => Math.abs(d).toFixed(1) + " percentage point" + (Math.abs(d).toFixed(1) === "1.0" ? "" : "s");
  function compare(v, us) {
    const d = v - us;
    if (Math.abs(d) < 0.05) return `the same as the U.S. average (${us.toFixed(1)}%)`;
    return `${pts(d)} ${d > 0 ? "above" : "below"} the U.S. average (${us.toFixed(1)}%)`;
  }
  function infoHTML(s) {
    return `<h3>${esc(s.name)}</h3>
      <div class="stat"><span>Food insecure<small>% of households (±${s.food_insecure_moe.toFixed(1)})</small></span><b>${s.food_insecure_pct.toFixed(1)}%</b></div>
      <div class="stat"><span>Very low food security<small>% of households (±${s.very_low_moe.toFixed(1)})</small></span><b>${s.very_low_pct.toFixed(1)}%</b></div>
      <p class="cmp">Food insecurity is <strong>${compare(s.food_insecure_pct, US.food_insecure_pct)}</strong>.
        ${s.food_insecure_sig_diff_from_us ? "ERS found this difference statistically significant." : "ERS found this difference <em>not</em> statistically significant."}</p>
      <p class="cmp">Very low food security is ${compare(s.very_low_pct, US.very_low_pct)}.</p>
      <span class="cite">(USDA ERS, 2025) · 2022–2024 average</span>`;
  }
  let selected = null;
  function show(abbr) { const s = byAbbr[abbr]; if (s) $("info").innerHTML = infoHTML(s); }
  function select(abbr, fromSelect) {
    if (selected && paths[selected]) paths[selected].classList.remove("sel");
    selected = abbr;
    if (paths[abbr]) { paths[abbr].classList.add("sel"); paths[abbr].parentNode.appendChild(paths[abbr]); }
    show(abbr);
    if (!fromSelect) $("stateSelect").value = abbr;
  }

  // ---------- Tooltip ----------
  function placeTip(evt, s) {
    const r = box.getBoundingClientRect();
    tip.innerHTML = `<strong>${esc(s.name)}</strong><br>${s.food_insecure_pct.toFixed(1)}% food insecure`;
    tip.style.left = (evt.clientX - r.left) + "px";
    tip.style.top = (evt.clientY - r.top) + "px";
    tip.classList.add("on");
  }

  // ---------- Events ----------
  svg.addEventListener("pointermove", (e) => {
    const p = e.target.closest("path"); if (!p || e.pointerType === "touch") { tip.classList.remove("on"); return; }
    const s = byAbbr[p.dataset.abbr]; placeTip(e, s); show(s.abbr);
  });
  svg.addEventListener("pointerleave", () => { tip.classList.remove("on"); if (selected) show(selected); });
  svg.addEventListener("click", (e) => { const p = e.target.closest("path"); if (p) { tip.classList.remove("on"); select(p.dataset.abbr); } });
  svg.addEventListener("focusin", (e) => { const p = e.target.closest("path"); if (p) show(p.dataset.abbr); });
  svg.addEventListener("focusout", () => { if (selected) show(selected); });
  svg.addEventListener("keydown", (e) => {
    const p = e.target.closest("path");
    if (p && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); select(p.dataset.abbr); }
  });

  // ---------- Select menu ----------
  const sorted = [...data.states].sort((a, b) => a.name.localeCompare(b.name));
  $("stateSelect").innerHTML = sorted.map((s) => `<option value="${s.abbr}">${esc(s.name)}</option>`).join("");
  $("stateSelect").addEventListener("change", (e) => select(e.target.value, true));

  // ---------- Minnesota callout ----------
  $("callouts").innerHTML = HIGHLIGHT.map((a) => {
    const s = byAbbr[a];
    return `<div class="callout"><button type="button" data-pick="${a}" aria-label="Show ${esc(s.name)} details">
      <span>${esc(s.name)}</span><b>${s.food_insecure_pct.toFixed(1)}%</b>
      <span>food insecure · ${s.very_low_pct.toFixed(1)}% very low food security</span></button></div>`;
  }).join("");
  $("callouts").addEventListener("click", (e) => { const b = e.target.closest("[data-pick]"); if (b) select(b.dataset.pick); });

  // ---------- Table ----------
  const rows = [...data.states].sort((a, b) => b.food_insecure_pct - a.food_insecure_pct);
  $("tableWrap").innerHTML = `<div style="overflow-x:auto"><table>
    <caption class="muted" style="text-align:left;padding:4px 0 8px">Sorted from highest to lowest food insecurity</caption>
    <thead><tr><th>State</th><th class="n">Food insecure</th><th class="n">Very low food security</th><th>Food insecurity different from U.S.?</th></tr></thead>
    <tbody>
    <tr><td><strong>U.S. average</strong></td><td class="n"><strong>${US.food_insecure_pct.toFixed(1)}%</strong></td><td class="n"><strong>${US.very_low_pct.toFixed(1)}%</strong></td><td>—</td></tr>
    ${rows.map((s) => `<tr class="${HIGHLIGHT.includes(s.abbr) ? "hl" : ""}"><td>${esc(s.name)}</td>
      <td class="n">${s.food_insecure_pct.toFixed(1)}% <span class="muted">±${s.food_insecure_moe.toFixed(1)}</span></td>
      <td class="n">${s.very_low_pct.toFixed(1)}% <span class="muted">±${s.very_low_moe.toFixed(1)}</span></td>
      <td>${s.food_insecure_sig_diff_from_us ? "Yes" : "No"}</td></tr>`).join("")}
    </tbody></table></div>`;

  select("MN");
})();
