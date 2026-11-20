// Plays every path through every month (up to CONFIG.maxMonths) using the game's own math.
// Run: node tools/test-months.js
const fs = require("fs"), vm = require("vm"), path = require("path");
const html = fs.readFileSync(path.join(__dirname, "..", "game", "play", "index.html"), "utf8");
const ctx = {};
vm.runInNewContext(html.slice(html.indexOf("const CONFIG"), html.indexOf("// </calc>")) +
  "\nthis.CONFIG=CONFIG;this.computePath=computePath;this.simulateMonths=simulateMonths;this.leftovers=leftovers;this.cardSchedule=cardSchedule;", ctx);
const { CONFIG, computePath, simulateMonths, leftovers, cardSchedule } = ctx;
const money = (n) => (n < 0 ? "-$" : "+$") + Math.abs(n).toFixed(2);
let fails = 0;

// 1) Month 1 must match the original one-month math exactly, on every path
for (const city of ["fargo", "minneapolis"]) for (const housing of ["oneBR", "twoBR"]) for (const care of ["center", "home"])
  for (const transport of ["car", "bus"]) for (const surprise of ["pay", "card", "skip"]) {
    const c = { housing, care, transport, surprise };
    const a = computePath(city, c), b = simulateMonths(city, c, {}, null, 1)[0];
    for (const k of ["gap", "foodGap", "billsBehind", "daysFed", "mealsSkipped", "leftover", "snap", "foodMoney"])
      if (Math.abs(a[k] - b[k]) > 1e-9) { fails++; console.log("MISMATCH", city, JSON.stringify(c), k, a[k], b[k]); }
  }
console.log("Month-1 consistency vs original math:", fails ? fails + " mismatches" : "all 48 paths identical");

// 2) Every multi-month branch for paths that survive month 1
const sched = cardSchedule();
console.log(`Card schedule: ${sched.length} payments, total $${sched.reduce((a, b) => a + b, 0).toFixed(2)}; maxMonths = ${CONFIG.maxMonths}\n`);
const rows = [];
function explore(city, c, mc, label) {
  const ms = simulateMonths(city, c, mc);
  const lastRec = ms[ms.length - 1];
  if (!lastRec.red && lastRec.event && lastRec.choice == null && lastRec.month < 99) {   // needs a choice this month
    for (const ch of ["pay", "card", "skip"]) explore(city, c, Object.assign({}, mc, { [lastRec.month]: ch }), label + ` m${lastRec.month}:${ch}`);
    return;
  }
  const lo = leftovers(ms);
  rows.push({
    Path: label,
    Months: ms.map((r) => `M${r.month} ${money(-r.gap)}${r.red ? " RED" : ""}`).join(" | "),
    Outcome: lastRec.red ? `red in month ${lastRec.month}` : `survived ${lastRec.month} mo`,
    "Card still owed": lo.cardOwed ? "$" + lo.cardOwed.toFixed(2) : "",
    "Bill still skipped": lo.stillSkipped ? "yes" : ""
  });
}
for (const city of ["fargo", "minneapolis"]) for (const housing of ["oneBR", "twoBR"]) for (const care of ["center", "home"])
  for (const transport of ["car", "bus"]) for (const surprise of ["pay", "card", "skip"]) {
    const c = { housing, care, transport, surprise };
    if (simulateMonths(city, c, {}, null, 1)[0].red) continue;    // already red in month 1: no month 2
    explore(city, c, {}, `${city === "fargo" ? "Fargo" : "Mpls"} ${housing}/${care}/${transport} m1:${surprise}`);
  }
for (const r of rows) console.log(`${r.Path.padEnd(44)} ${r.Months.padEnd(60)} ${r.Outcome.padEnd(18)} ${r["Card still owed"].padEnd(9)} ${r["Bill still skipped"]}`);
const red = rows.filter((r) => r.Outcome.startsWith("red")).length;
console.log(`\n${rows.length} multi-month branches from the paths that survive month 1 | ${red} end red | ${rows.length - red} survive ${CONFIG.maxMonths} months`);
process.exit(fails ? 1 : 0);
