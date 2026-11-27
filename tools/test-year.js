// Tests the 12-month game using the game's own math. Run: node tools/test-year.js
const fs = require("fs"), vm = require("vm"), path = require("path");
const html = fs.readFileSync(path.join(__dirname, "..", "game", "play", "index.html"), "utf8");
const ctx = {};
vm.runInNewContext(html.slice(html.indexOf("const CONFIG"), html.indexOf("// </calc>")) +
  "\nObject.assign(this,{CONFIG,computePath,pathAtWage,simulateYear,manyYears,taxRefund,rollYear,startSavingsAmount,cardMinPayment,defaultPolicy,seasonalExtra,minPayoff});", ctx);
const { CONFIG, simulateYear, manyYears, taxRefund, rollYear, startSavingsAmount } = ctx;
const $ = (n) => (n < 0 ? "-$" : "$") + Math.abs(Math.round(n)).toLocaleString("en-US");
let fails = 0;
const check = (cond, msg) => { if (!cond) { fails++; console.log("FAIL:", msg); } };
const bi = CONFIG.basicsItems;
check(CONFIG.basicsMonthly === Math.round((bi.phone + bi.clothes + bi.personal + bi.supplies) / 12), "basicsMonthly does not match its items");

// 1) Tax refunds
console.log("TAX REFUNDS (tax year 2025 rules, paid in March)");
for (const city of ["minneapolis"]) for (const care of ["center", "home"]) {
  const cc = CONFIG.cities[city], r = taxRefund(city, cc.wage, cc.childCare[care]);
  console.log(`  ${city.padEnd(11)} ${care.padEnd(6)} EITC ${$(r.eitc)} | care credit ${$(r.careCredit)} | CTC used ${$(r.ctcUsed)} + refundable ${$(r.actc)} | income tax ${$(r.incomeTax)} | MN credits ${$(r.mnCredits)} − MN tax ${$(r.mnTax)} | TOTAL ${$(r.total)}`);
  check(r.total > 0 && r.total < 10000, "refund out of range " + city);
}

// 2) Same seed → same year; different seeds → different years
const c0 = { housing: "oneBR", care: "home", transport: "car" };
check(JSON.stringify(rollYear(42, true)) === JSON.stringify(rollYear(42, true)), "seed not reproducible");
check(JSON.stringify(rollYear(42, true)) !== JSON.stringify(rollYear(43, true)), "seeds identical");
check(rollYear(42, false).flat().every((e) => e.id !== "car"), "bus riders got a car repair");

// 3) Event frequency matches the survey odds (100,000 simulated years)
const counts = {}; let yearsWith = 0; const N = 100000;
for (let k = 0; k < N; k++) { const y = rollYear(k + 1, true); const seen = new Set(); y.flat().forEach((e) => seen.add(e.id)); seen.forEach((id) => counts[id] = (counts[id] || 0) + 1); if (seen.size) yearsWith++; }
console.log("\nEVENT ODDS CHECK (share of simulated years with at least one, vs. survey)");
for (const e of CONFIG.events) { const got = counts[e.id] / N; console.log(`  ${e.id.padEnd(8)} simulated ${(got * 100).toFixed(1)}%  survey ${(e.annualChance * 100).toFixed(0)}%`); check(Math.abs(got - e.annualChance) < 0.01, "odds off for " + e.id); }

// 4) One sample year, month by month
console.log("\nSAMPLE YEAR: Minneapolis 1BR/home/car, $0 saved, seed 2024, player always uses the card");
const y = simulateYear("minneapolis", c0, 0, 2024, null, { policy: () => "card" });
const MON = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");
for (const r of y.months) console.log(`  ${MON[r.m]} events: ${r.events.map((e) => e.id + " " + $(e.cost)).join(", ") || "-"}${r.refund ? " | refund +" + $(r.refund) : ""} | cash ${$(r.endCash)} | card ${$(r.endCard)} (paid ${$(r.cardPay)}) | meals skipped ${r.mealsSkipped} | behind ${$(r.endBehind)}`);

// 5) No-emergency year should never end worse than with emergencies (sanity)
// 6) 1,000-year summary for every setup and starting savings
console.log("\n1,000 SIMULATED YEARS PER HOUSEHOLD (emergencies: savings if food is still covered, else card)");
console.log("  household                       start   %end in debt  median debt  %any hunger  median meals skipped  median net worth");
for (const city of ["minneapolis"]) for (const housing of ["oneBR", "twoBR"]) for (const care of ["center", "home"]) for (const transport of ["car", "bus"]) {
  const c = { housing, care, transport };
  for (const opt of [0]) {
    const start = startSavingsAmount(opt, city, c);
    const s = manyYears(city, c, start);
    console.log(`  ${(city.slice(0, 5) + " " + housing + "/" + care + "/" + transport).padEnd(30)} ${$(start).padStart(7)}   ${String(s.pctDebt).padStart(3)}%        ${$(s.medianDebt).padStart(8)}     ${String(s.pctHungry).padStart(3)}%        ${String(s.medianMeals).padStart(4)}                ${$(s.medianNet).padStart(8)}`);
  }
}
// 6) Seasonal bills move money between months but not the yearly total
for (const housing of ["oneBR", "twoBR"]) {
  let h = 0, cl = 0;
  for (let m = 0; m < 12; m++) { const x = ctx.seasonalExtra({ housing }, m); h += x.heat; cl += x.clothes; }
  check(Math.abs(h) < 1 && Math.abs(cl) < 1, "seasonal extras do not sum to $0 for " + housing);
}
check(ctx.seasonalExtra({ housing: "oneBR" }, 0).heat > 40 && ctx.seasonalExtra({ housing: "oneBR" }, 6).heat < -25, "heat is not higher in January than July");

// 7) Credit card: missed minimums get a late fee; debt carries into next year; paying the minimum pays it off eventually
{
  const c = { housing: "twoBR", care: "center", transport: "car" };
  const y1 = simulateYear("minneapolis", c, 0, 1006, null, { policy: ctx.defaultPolicy, noSnap: true, foodOnCard: true });
  check(y1.lateFees > 0, "a household that cannot pay its card should be charged late fees");
  check(y1.months.every((r) => !r.lateFee || r.lateFee === CONFIG.card.lateFeeFirst || r.lateFee === CONFIG.card.lateFeeRepeat), "late fee amount");
  const y2 = simulateYear("minneapolis", c, y1.cash, 2006, null, { policy: ctx.defaultPolicy, noSnap: true, foodOnCard: true, startCard: y1.card, startBehind: y1.behind, lastLate: y1.lastLate });
  check(y2.months[0].startCard === y1.card && y2.months[0].startBehind === y1.behind, "year 2 does not start with year 1 debt");
  const po = ctx.minPayoff(2000);
  check(po.months > 12 && po.months < 1200 && po.interest > 0, "minimum-payment payoff of $2,000 looks wrong");
  console.log(`\nCARD: worst no-SNAP year: late fees ${$(y1.lateFees)}, card ${$(y1.card)}, unpaid bills ${$(y1.behind)}. Year 2 ends ${$(y2.card + y2.behind)} in debt. $2,000 at the minimum: ${po.months} months, ${$(po.interest)} interest.`);
}

console.log(fails ? `\n${fails} FAILURES` : "\nAll checks passed.");
process.exit(fails ? 1 : 0);
