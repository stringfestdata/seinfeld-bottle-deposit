const carData = {
  saab: {
    mpgModifier: 1,
    extraCost: 0,
    blurb:
      "Jerry's SAAB is smooth and practical-ish. A respectable choice, assuming no one steals your spot.",
  },
  lebaron: {
    mpgModifier: 0.85,
    extraCost: 8,
    blurb:
      "Jon Voight's LeBaron has character... and maybe mystery repair costs. Budget extra for drama.",
  },
  mailtruck: {
    mpgModifier: 0.6,
    extraCost: 14,
    blurb:
      "Newman's mail truck can haul a mountain of cans, but it's thirsty and probably smells like mail bins.",
  },
  rental: {
    mpgModifier: 0.95,
    extraCost: 22,
    blurb:
      "The questionable rental is a gamble. Could be fine. Could be all reservation and no car.",
  },
};

const els = {
  containerCount: document.getElementById("containerCount"),
  mpg: document.getElementById("mpg"),
  gasPrice: document.getElementById("gasPrice"),
  distance: document.getElementById("distance"),
  carSelect: document.getElementById("carSelect"),
  extras: document.getElementById("extras"),
  depositValue: document.getElementById("depositValue"),
  tripCost: document.getElementById("tripCost"),
  netResult: document.getElementById("netResult"),
  verdict: document.getElementById("verdict"),
  profitBar: document.getElementById("profitBar"),
  carBlurb: document.getElementById("carBlurb"),
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function toNumber(input) {
  const val = Number(input);
  return Number.isFinite(val) && val > 0 ? val : 0;
}

function render() {
  const containers = toNumber(els.containerCount.value);
  const baseMpg = toNumber(els.mpg.value);
  const gasPrice = toNumber(els.gasPrice.value);
  const oneWay = toNumber(els.distance.value);
  const extras = toNumber(els.extras.value);
  const selected = carData[els.carSelect.value];

  const deposit = containers * 0.1;
  const roundTripMiles = oneWay * 2;
  const effectiveMpg = Math.max(1, baseMpg * selected.mpgModifier);
  const fuelGallons = roundTripMiles / effectiveMpg;
  const fuelCost = fuelGallons * gasPrice;
  const totalCost = fuelCost + extras + selected.extraCost;
  const net = deposit - totalCost;

  els.depositValue.textContent = currency.format(deposit);
  els.tripCost.textContent = currency.format(totalCost);
  els.netResult.textContent = currency.format(net);
  els.carBlurb.textContent = selected.blurb;

  const ratio = Math.min(Math.abs(net) / Math.max(deposit, 1), 1);
  els.profitBar.style.width = `${Math.max(10, ratio * 100)}%`;

  if (net >= 0) {
    els.verdict.textContent =
      "You made money! Newman would call this a beautiful system.";
    els.profitBar.style.background = "var(--profit)";
    els.netResult.style.color = "var(--profit)";
  } else {
    els.verdict.textContent =
      "You're losing money. Even Kramer might scrap this plan.";
    els.profitBar.style.background = "var(--loss)";
    els.netResult.style.color = "var(--loss)";
  }
}

Object.values(els).forEach((el) => {
  if (el instanceof HTMLInputElement || el instanceof HTMLSelectElement) {
    el.addEventListener("input", render);
    el.addEventListener("change", render);
  }
});

render();
