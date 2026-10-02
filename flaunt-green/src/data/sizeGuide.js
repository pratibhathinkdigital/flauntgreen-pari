// Actual measurement charts shown in the PDP "Size Guide" modal.
// Measurements are in inches unless noted otherwise.

export const WOMEN_SIZE_CHART = [
  { size: "XS", bust: "33–34", waist: "25–26", hips: "35–36" },
  { size: "S",  bust: "35–36", waist: "27–28", hips: "37–38" },
  { size: "M",  bust: "37–38", waist: "29–30", hips: "39–40" },
  { size: "L",  bust: "39–40", waist: "31–32", hips: "41–42" },
  { size: "XL", bust: "41–42", waist: "33–34", hips: "43–44" },
  { size: "XXL", bust: "43–44", waist: "35–36", hips: "45–46" },
];

export const MEN_SIZE_CHART = [
  { size: "S",  chest: "36–38", waist: "30–32", length: "27–28" },
  { size: "M",  chest: "38–40", waist: "32–34", length: "28–29" },
  { size: "L",  chest: "40–42", waist: "34–36", length: "29–30" },
  { size: "XL", chest: "42–44", waist: "36–38", length: "30–31" },
  { size: "XXL", chest: "44–46", waist: "38–40", length: "31–32" },
];

export const PET_SIZE_CHART = [
  { size: "XS", neck: "10–12", chest: "14–18", weight: "Up to 3 kg" },
  { size: "S",  neck: "12–14", chest: "18–22", weight: "3–7 kg" },
  { size: "M",  neck: "14–16", chest: "22–26", weight: "7–12 kg" },
  { size: "L",  neck: "16–18", chest: "26–31", weight: "12–20 kg" },
  { size: "XL", neck: "18–20", chest: "31–36", weight: "20–30 kg" },
];

/**
 * Resolve which chart to show on the PDP based on the customer's
 * navigation path gender segment ("her", "him", "dog-togs", "dog_togs").
 */
export function getSizeGuide(breadcrumbPath = "") {
  const p = breadcrumbPath || "";
  if (/him/.test(p)) return { title: "Men's Size Guide", chart: MEN_SIZE_CHART, note: "Measurements in inches. If between sizes, we recommend sizing up for a relaxed fit." };
  if (/dog/.test(p)) return { title: "Pet Size Guide", chart: PET_SIZE_CHART, note: "Measure around the neck and the widest part of the chest. If between sizes, size up for comfort." };
  return { title: "Women's Size Guide", chart: WOMEN_SIZE_CHART, note: "Measurements in inches. If between sizes, we recommend sizing up for a relaxed fit." };
}