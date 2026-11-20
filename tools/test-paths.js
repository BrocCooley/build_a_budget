// Plays every path in both cities using the exact CONFIG + math from index.html.
// Run:  node test-paths.js
const fs = require("fs");
const vm = require("vm");
const path = require("path");

const html = fs.readFileSync(path.join(__dirname, "..", "game", "play", "index.html"), "utf8");
const start = html.indexOf("const CONFIG");
const end = html.indexOf("// </calc>");
if (start < 0 || end < 0) throw new Error("Could not find CONFIG / calc block in index.html");
const ctx = {};
vm.runInNewContext(html.slice(start, end) + "\nthis.CONFIG = CONFIG; this.computePath = computePath; this.cardPayoff = cardPayoff;", ctx);
const { CONFIG, computePath, cardPayoff } = ctx;

const m = (n) => (n < 0 ? "-" : " ") + "$" + Math.abs(n).toFixed(2);
const rows = [];
let failures = 0;

for (const city of ["fargo", "minneapolis"]) {
  const th = computePath(city, { housing: "oneBR", care: "home", transport: "bus", surprise: "skip" });
  console.log(`\n${CONFIG.cities[city].name}: wage $${th.wage.toFixed(2)}/hr | gross $${th.gross.toFixed(2)}/mo | take-home $${th.net.toFixed(2)}/mo`);
  for (const housing of ["oneBR", "twoBR"])
    for (const care of ["center", "home"])
      for (const transport of ["car", "bus"])
        for (const surprise of ["pay", "card", "skip"]) {
          const c = { housing, care, transport, surprise };
          const r = computePath(city, c);
          // Verify the "Replay earning $Z/hr" wage actually closes the gap on this path
          let check = "";
          if (r.wageToClose != null) {
            const r2 = computePath(city, c, r.wageToClose);
            const r3 = computePath(city, c, Math.round(r.wageToClose * 100 - 1) / 100);
            const ok = r2.gap <= 0 && r3.gap > 0;
            if (!ok) failures++;
            check = ok ? "ok" : "FAIL";
          }
          rows.push({
            City: city === "fargo" ? "Fargo" : "Mpls",
            Housing: housing, Care: care, Transp: transport, Surprise: surprise,
            Rent: r.housing, Care$: r.care, Trans$: r.transport, Basic$: r.basics, Surp$: r.surprise,
            "Cash left": m(r.leftover), SNAP: r.snap, "Food need": r.need.toFixed(0),
            "No SNAP": m(-r.gapNoSnap),
            "Food gap": r.foodGap ? m(-r.foodGap) : "0",
            "Bills behind": r.billsBehind ? m(-r.billsBehind) : "0",
            "Final": m(-r.gap),
            "Food days": r.daysFed + "/30",
            "$/meal": r.perMeal.toFixed(2),
            "Meals skipped": r.mealsSkipped,
            "Choices": r.conscious + "/4",
            "Wage to close": r.wageToClose != null ? "$" + r.wageToClose.toFixed(2) : "-",
            "Wage check": check
          });
        }
}
console.table(rows);
const p = cardPayoff();
console.log(`Credit card: $${CONFIG.surprise.amount} at ${CONFIG.surprise.cardAPR * 100}% APR, $${CONFIG.surprise.cardMonthlyPayment}/mo -> ${p.months} months, $${p.total.toFixed(2)} total`);
console.log("Cash left = take-home − rent − care − transport − basics − surprise. Final = (SNAP + cash left) vs. food need; negative = short (food gap + bills behind).");
const shortCount = rows.filter((r) => r["Final"].startsWith("-")).length;
console.log(`${rows.length} paths | ${shortCount} short of USDA diet | ${rows.length - shortCount} covered | wage-check failures: ${failures}`);
process.exit(failures ? 1 : 0);
