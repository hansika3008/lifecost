const money=n=>new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:2}).format(n);
const num=id=>Number(document.getElementById(id).value)||0;
function loadExample(item,price,years,uses,maintenance,resale){
  document.getElementById("item").value=item;document.getElementById("price").value=price;
  document.getElementById("years").value=years;document.getElementById("uses").value=uses;
  document.getElementById("maintenance").value=maintenance;document.getElementById("resale").value=resale;
  document.getElementById("calculator").scrollIntoView({behavior:"smooth"});calculateRealCost();
}
function calculateRealCost(){
  const item=document.getElementById("item").value.trim()||"This purchase";
  const price=num("price"),years=num("years"),uses=num("uses"),maintenance=num("maintenance"),resale=num("resale");
  const result=document.getElementById("result");
  if(price<=0||years<=0||uses<=0){result.innerHTML='<div class="result-placeholder"><span>NEED MORE INFORMATION</span><h3>Enter price, lifespan and weekly usage.</h3><p>Those three values are required to estimate the real cost.</p></div>';return;}
  const net=Math.max(0,price+(maintenance*years)-resale);
  const totalUses=uses*52*years;
  const perUse=net/totalUses;
  const perDay=net/(years*365);
  const perYear=net/years;
  result.innerHTML=`<div class="result-main">
    <div class="result-top">${item.toUpperCase()} · ESTIMATED REAL COST</div>
    <div class="result-item"><small>Net cost over ${years} year${years==1?"":"s"}</small><strong>${money(net)}</strong></div>
    <div class="result-item"><small>Cost per use</small><strong>${money(perUse)}</strong></div>
    <div class="result-item"><small>Cost per day of ownership</small><strong>${money(perDay)}</strong></div>
    <div class="result-item"><small>Average cost per year</small><strong>${money(perYear)}</strong></div>
    <div class="result-note">Estimate based on your inputs. It does not account for financing, taxes, opportunity cost, unexpected repairs or changes in resale value.</div>
  </div>`;
}
