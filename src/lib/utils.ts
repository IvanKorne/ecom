export function extractPrice(...elements: any) {
  for (const element of elements) {
    const price = element.text().trim();
    if (price) {
      return price.replace(/[^\d.]/g, "");
    }
  }
  return " ";
}

export function extractCurrency(element: any) {
  const currencyText = element.text().trim().slice(0, 1);
  return currencyText || "";
}
