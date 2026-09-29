const money = n =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  }).format(n);

const num = id => Number(document.getElementById(id).value) || 0;

function loadExample(item, price, years, uses, maintenance, resale) {
  document.getElementById("item").value = item;
  document.getElementById("price").value = price;
  document.getElementById("years").value = years;
  document.getElementById("uses").value = uses;
  document.getElementById("maintenance").value = maintenance;
  document.getElementById("resale").value = resale;
  document.getElementById("calculator").scrollIntoView({ behavior: "smooth" });
  calculateRealCost();
}

function getPurchaseData(prefix) {
  return {
    item: document.getElementById(prefix + "Item").value.trim() || "Purchase",
    price: num(prefix + "Price"),
    years: num(prefix + "Years"),
    uses: num(prefix + "Uses"),
    maintenance: num(prefix + "Maintenance"),
    resale: num(prefix + "Resale")
  };
}

function calculate(data) {
  if (data.price <= 0 || data.years <= 0 || data.uses <= 0) return null;

  const totalMaintenance = data.maintenance * data.years;
  const net = Math.max(0, data.price + totalMaintenance - data.resale);
  const totalUses = data.uses * 52 * data.years;

  return {
    ...data,
    totalMaintenance,
    net,
    totalUses,
    perUse: net / totalUses,
    perDay: net / (data.years * 365),
    perMonth: net / (data.years * 12),
    perYear: net / data.years
  };
}

function calculateRealCost() {
  const data = {
    item: document.getElementById("item").value.trim() || "This purchase",
    price: num("price"),
    years: num("years"),
    uses: num("uses"),
    maintenance: num("maintenance"),
    resale: num("resale")
  };
  const result = document.getElementById("result");
  const calc = calculate(data);

  if (!calc) {
    result.innerHTML = `
      <div class="result-placeholder">
        <span>NEED MORE INFORMATION</span>
        <h3>Enter price, lifespan and weekly usage.</h3>
        <p>Those three values are required to estimate the real cost.</p>
      </div>`;
    return;
  }

  const gross = calc.price + calc.totalMaintenance;
  const purchasePct = gross > 0 ? (calc.price / gross) * 100 : 0;
  const maintenancePct = gross > 0 ? (calc.totalMaintenance / gross) * 100 : 0;
  const resalePct = gross > 0 ? (calc.resale / gross) * 100 : 0;

  result.innerHTML = `
    <div class="result-main">
      <div class="result-top">${escapeHtml(calc.item.toUpperCase())} · ESTIMATED REAL COST</div>
      <div class="result-highlight">
        <small>NET COST OVER ${calc.years} YEAR${calc.years == 1 ? "" : "S"}</small>
        <strong>${money(calc.net)}</strong>
        <span>after maintenance and expected resale</span>
      </div>
      <div class="metric-grid">
        <div class="result-item"><small>Cost per use</small><strong>${money(calc.perUse)}</strong></div>
        <div class="result-item"><small>Cost per day</small><strong>${money(calc.perDay)}</strong></div>
        <div class="result-item"><small>Cost per month</small><strong>${money(calc.perMonth)}</strong></div>
        <div class="result-item"><small>Average cost per year</small><strong>${money(calc.perYear)}</strong></div>
      </div>
      <div class="usage-card">
        <div><small>ESTIMATED TOTAL USES</small><strong>${Math.round(calc.totalUses).toLocaleString("en-IN")}</strong></div>
        <div><small>WEEKLY USAGE</small><strong>${calc.uses.toLocaleString("en-IN")}</strong></div>
      </div>
      <div class="breakdown">
        <div class="breakdown-title">COST BREAKDOWN</div>
        <div class="breakdown-row"><span>Purchase price</span><strong>${money(calc.price)}</strong></div>
        <div class="bar"><span style="width:${purchasePct}%"></span></div>
        <div class="breakdown-row"><span>Total maintenance</span><strong>${money(calc.totalMaintenance)}</strong></div>
        <div class="bar"><span style="width:${maintenancePct}%"></span></div>
        <div class="breakdown-row resale-row"><span>Expected resale</span><strong>− ${money(calc.resale)}</strong></div>
        <div class="bar resale-bar"><span style="width:${Math.min(resalePct,100)}%"></span></div>
      </div>
      <div class="result-note">Estimate based on your inputs. It does not account for financing, taxes, opportunity cost, unexpected repairs or changes in resale value.</div>
    </div>`;
}

function comparePurchases() {
  const a = calculate(getPurchaseData("a"));
  const b = calculate(getPurchaseData("b"));
  const result = document.getElementById("compareResult");

  if (!a || !b) {
    result.innerHTML = `
      <div class="result-placeholder light-placeholder">
        <span>NEED MORE INFORMATION</span>
        <h3>Complete the required fields for both purchases.</h3>
        <p>Price, lifespan and weekly usage are required for A and B.</p>
      </div>`;
    return;
  }

  result.innerHTML = `
    <div class="comparison-table-wrap">
      <div class="comparison-heading">
        <div>
          <span>COMPARISON RESULTS</span>
          <h3>${escapeHtml(a.item)} vs ${escapeHtml(b.item)}</h3>
        </div>
        <small>Numbers are estimates based on your inputs.</small>
      </div>
      <div class="comparison-table">
        <div class="table-row table-head">
          <div>Metric</div><div><span class="mini-badge">A</span>${escapeHtml(a.item)}</div><div><span class="mini-badge">B</span>${escapeHtml(b.item)}</div>
        </div>
        <div class="table-row"><div>Purchase price</div><div>${money(a.price)}</div><div>${money(b.price)}</div></div>
        <div class="table-row"><div>Net cost</div><div>${money(a.net)}</div><div>${money(b.net)}</div></div>
        <div class="table-row"><div>Cost per use</div><div>${money(a.perUse)}</div><div>${money(b.perUse)}</div></div>
        <div class="table-row"><div>Cost per day</div><div>${money(a.perDay)}</div><div>${money(b.perDay)}</div></div>
        <div class="table-row"><div>Cost per month</div><div>${money(a.perMonth)}</div><div>${money(b.perMonth)}</div></div>
        <div class="table-row"><div>Average cost/year</div><div>${money(a.perYear)}</div><div>${money(b.perYear)}</div></div>
        <div class="table-row"><div>Estimated total uses</div><div>${Math.round(a.totalUses).toLocaleString("en-IN")}</div><div>${Math.round(b.totalUses).toLocaleString("en-IN")}</div></div>
      </div>
      <p class="comparison-note">LifeCost shows the calculated differences but does not select a purchase for you. Consider your needs, budget, quality, features and other factors alongside these estimates.</p>
    </div>`;
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[character]));
}

function showMessage(id, message) {
  const el = document.getElementById(id);
  if (el) el.textContent = message || "";
}

function clearCalculator() {
  ["item","price","years","uses","maintenance","resale"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
  document.getElementById("result").innerHTML = `
    <div class="result-placeholder">
      <span>YOUR RESULT</span>
      <h3>See the real cost of your purchase.</h3>
      <p>Enter the numbers on the left and we'll break the purchase down into simple metrics.</p>
    </div>`;
  showMessage("calcMessage", "");
}

function clearComparison() {
  ["aItem","aPrice","aYears","aUses","aMaintenance","aResale","bItem","bPrice","bYears","bUses","bMaintenance","bResale"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
  document.getElementById("compareResult").innerHTML = `
    <div class="result-placeholder light-placeholder">
      <span>COMPARISON</span>
      <h3>Enter both purchases to see the side-by-side numbers.</h3>
      <p>The comparison shows the calculated metrics for A and B without telling you what to choose.</p>
    </div>`;
  showMessage("compareMessage", "");
}

function validatePurchase(data, messageId) {
  const missing = [];
  if (data.price <= 0) missing.push("price");
  if (data.years <= 0) missing.push("lifespan");
  if (data.uses <= 0) missing.push("weekly usage");
  if (missing.length) {
    showMessage(messageId, "Please enter a valid " + missing.join(", ") + ".");
    return false;
  }
  if (data.maintenance < 0 || data.resale < 0) {
    showMessage(messageId, "Maintenance and resale cannot be negative.");
    return false;
  }
  showMessage(messageId, "");
  return true;
}

const originalCalculateRealCost = calculateRealCost;
calculateRealCost = function() {
  const data = {
    item: document.getElementById("item").value.trim() || "This purchase",
    price: num("price"),
    years: num("years"),
    uses: num("uses"),
    maintenance: num("maintenance"),
    resale: num("resale")
  };
  if (!validatePurchase(data, "calcMessage")) {
    document.getElementById("result").innerHTML = `
      <div class="result-placeholder">
        <span>CHECK YOUR INPUTS</span>
        <h3>Add the required purchase details.</h3>
        <p>Price, lifespan and weekly usage must be greater than zero.</p>
      </div>`;
    return;
  }
  originalCalculateRealCost();
};

const originalComparePurchases = comparePurchases;
comparePurchases = function() {
  const aData = getPurchaseData("a");
  const bData = getPurchaseData("b");
  if (!validatePurchase(aData, "compareMessage") || !validatePurchase(bData, "compareMessage")) {
    document.getElementById("compareResult").innerHTML = `
      <div class="result-placeholder light-placeholder">
        <span>CHECK YOUR INPUTS</span>
        <h3>Complete the required fields for both purchases.</h3>
        <p>Price, lifespan and weekly usage must be greater than zero.</p>
      </div>`;
    return;
  }
  showMessage("compareMessage", "");
  originalComparePurchases();
  document.getElementById("compareResult").scrollIntoView({behavior:"smooth", block:"start"});
};

document.addEventListener("keydown", event => {
  if (event.key === "Enter" && event.target.tagName === "INPUT") {
    const formPanel = event.target.closest(".form-panel");
    const compareCard = event.target.closest(".compare-card");
    if (formPanel) calculateRealCost();
    else if (compareCard) comparePurchases();
  }
});

// V7: additional LifeCost tools
function positiveNumber(id) {
  const value = Number(document.getElementById(id)?.value);
  return Number.isFinite(value) && value >= 0 ? value : 0;
}

function calculateBuyRent() {
  const price = positiveNumber("brPrice");
  const years = Number(document.getElementById("brYears").value);
  const annual = positiveNumber("brAnnual");
  const resale = positiveNumber("brResale");
  const rent = positiveNumber("brRent");
  const el = document.getElementById("brResult");

  if (price <= 0 || years <= 0 || rent <= 0) {
    el.innerHTML = "Enter a purchase price, ownership period and monthly rent.";
    return;
  }
  const buy = Math.max(0, price + annual * years - resale);
  const rentTotal = rent * 12 * years;
  const difference = Math.abs(buy - rentTotal);
  el.innerHTML = `
    <div class="mini-grid">
      <div>Estimated buy cost<strong>${money(buy)}</strong></div>
      <div>Estimated rent cost<strong>${money(rentTotal)}</strong></div>
    </div>
    <p>Difference: <strong>${money(difference)}</strong></p>`;
}

function calculateSubscription() {
  const name = document.getElementById("subName").value.trim() || "Subscription";
  const monthly = positiveNumber("subMonthly");
  const months = Number(document.getElementById("subMonths").value);
  const uses = positiveNumber("subUses");
  const el = document.getElementById("subResult");

  if (monthly <= 0 || months <= 0) {
    el.innerHTML = "Enter a monthly price and number of months.";
    return;
  }
  const total = monthly * months;
  const perUse = uses > 0 ? monthly / uses : null;
  el.innerHTML = `
    <div><strong>${escapeHtml(name)}</strong></div>
    <div>Total over ${months} months<strong>${money(total)}</strong></div>
    ${perUse === null ? "<p>Add monthly uses to estimate cost per use.</p>" : `<p>Estimated cost per use: <strong>${money(perUse)}</strong></p>`}`;
}

function calculateKeepReplace() {
  const current = positiveNumber("krCurrent");
  const years = Number(document.getElementById("krYears").value);
  const replacement = positiveNumber("krNew");
  const resale = positiveNumber("krResale");
  const el = document.getElementById("krResult");

  if (years <= 0 || replacement <= 0) {
    el.innerHTML = "Enter the time period and replacement price.";
    return;
  }
  const keep = current * years;
  const replace = Math.max(0, replacement - resale);
  el.innerHTML = `
    <div class="mini-grid">
      <div>Estimated keep cost<strong>${money(keep)}</strong></div>
      <div>Estimated replace cost<strong>${money(replace)}</strong></div>
    </div>
    <p>Difference: <strong>${money(Math.abs(keep - replace))}</strong></p>`;
}
