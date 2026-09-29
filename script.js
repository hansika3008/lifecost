const money = n => new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:2}).format(n);

function val(id){ return Number(document.getElementById(id).value); }
function show(id, html){ document.getElementById(id).innerHTML = html; }

function costPerUse(){
  const p=val("cpu-price"), u=val("cpu-uses");
  show("cpu-result", p>=0&&u>0 ? `≈ ${money(p/u)} per use` : "Enter a price and a number of uses.");
}
function costPerHour(){
  const p=val("cph-price"), h=val("cph-hours");
  show("cph-result", p>=0&&h>0 ? `≈ ${money(p/h)} per hour` : "Enter a price and total hours.");
}
function buyVsRent(){
  const b=val("bvr-buy"), r=val("bvr-rent");
  if(b>=0&&r>0){ const days=b/r; show("bvr-result", `Break-even: ≈ ${days.toFixed(1)} rental days.<br><small>Below that, renting costs less; above that, buying may cost less, before other costs.</small>`); }
  else show("bvr-result","Enter a purchase price and rental price.");
}
function subscriptionCost(){
  const m=val("sub-month"), y=val("sub-years");
  if(m>=0&&y>0){ show("sub-result", `Total: ${money(m*y*12)}<br><small>Yearly cost: ${money(m*12)}</small>`); }
  else show("sub-result","Enter a monthly price and number of years.");
}
function keepVsReplace(){
  const repair=val("kvr-repair"), replacement=val("kvr-new"), years=val("kvr-years");
  if(repair>=0&&replacement>=0&&years>0){
    const keep=repair*years, replace=replacement;
    const diff=Math.abs(keep-replace);
    show("kvr-result", keep<replace
      ? `Keeping costs ${money(keep)} over ${years} years.<br><small>That's ${money(diff)} less than the replacement price, before other factors.</small>`
      : `Replacing costs ${money(replace)} upfront.<br><small>Maintenance on the old item would be ${money(keep)} over ${years} years.</small>`);
  } else show("kvr-result","Enter all three values.");
}
