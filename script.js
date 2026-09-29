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

  document.getElementById("calculator").scrollIntoView({
    behavior: "smooth"
  });

  calculateRealCost();
}

function calculateRealCost() {
  const item = document.getElementById("item").value.trim() || "This purchase";
  const price = num("price");
  const years = num("years");
  const uses = num("uses");
  const maintenance = num("maintenance");
  const resale = num("resale");
  const result = document.getElementById("result");

  if (price <= 0 || years <= 0 || uses <= 0) {
    result.innerHTML = `
      <div class="result-placeholder">
        <span>NEED MORE INFORMATION</span>
        <h3>Enter price, lifespan and weekly usage.</h3>
        <p>Those three values are required to estimate the real cost.</p>
      </div>`;
    return;
  }

  const totalMaintenance = maintenance * years;
  const net = Math.max(0, price + totalMaintenance - resale);
  const totalUses = uses * 52 * years;
  const perUse = net / totalUses;
  const perDay = net / (years * 365);
  const perMonth = net / (years * 12);
  const perYear = net / years;

  const grossBeforeResale = price + totalMaintenance;
  const purchasePct = grossBeforeResale > 0 ? (price / grossBeforeResale) * 100 : 0;
  const maintenancePct = grossBeforeResale > 0 ? (totalMaintenance / grossBeforeResale) * 100 : 0;
  const resalePct = grossBeforeResale > 0 ? (resale / grossBeforeResale) * 100 : 0;

  result.innerHTML = `
    <div class="result-main">
      <div class="result-top">${escapeHtml(item.toUpperCase())} · ESTIMATED REAL COST</div>

      <div class="result-highlight">
        <small>NET COST OVER ${years} YEAR${years == 1 ? "" : "S"}</small>
        <strong>${money(net)}</strong>
        <span>after maintenance and expected resale</span>
      </div>

      <div class="metric-grid">
        <div class="result-item">
          <small>Cost per use</small>
          <strong>${money(perUse)}</strong>
        </div>
        <div class="result-item">
          <small>Cost per day</small>
          <strong>${money(perDay)}</strong>
        </div>
        <div class="result-item">
          <small>Cost per month</small>
          <strong>${money(perMonth)}</strong>
        </div>
        <div class="result-item">
          <small>Average cost per year</small>
          <strong>${money(perYear)}</strong>
        </div>
      </div>

      <div class="usage-card">
        <div>
          <small>ESTIMATED TOTAL USES</small>
          <strong>${Math.round(totalUses).toLocaleString("en-IN")}</strong>
        </div>
        <div>
          <small>WEEKLY USAGE</small>
          <strong>${uses.toLocaleString("en-IN")}</strong>
        </div>
      </div>

      <div class="breakdown">
        <div class="breakdown-title">COST BREAKDOWN</div>
        <div class="breakdown-row">
          <span>Purchase price</span><strong>${money(price)}</strong>
        </div>
        <div class="bar"><span style="width:${purchasePct}%"></span></div>

        <div class="breakdown-row">
          <span>Total maintenance</span><strong>${money(totalMaintenance)}</strong>
        </div>
        <div class="bar"><span style="width:${maintenancePct}%"></span></div>

        <div class="breakdown-row resale-row">
          <span>Expected resale</span><strong>− ${money(resale)}</strong>
        </div>
        <div class="bar resale-bar"><span style="width:${Math.min(resalePct, 100)}%"></span></div>
      </div>

      <div class="result-note">
        Estimate based on your inputs. It does not account for financing, taxes,
        opportunity cost, unexpected repairs or changes in resale value.
      </div>
    </div>`;
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[character]));
}
