const SAME_DAY_VARIANT_IDS = new Set([
  "71304855585021",
  "46150010962173"
]);
const SAME_DAY_HANDLES = new Set([
  "same-day-iphone",
  "turn-around-time-fatest-4-hours"
]);

export function isSameDayLine(line) {
  if (!line) return false;
  const variantId = String(line.variant_id || line.variantId || "");
  if (SAME_DAY_VARIANT_IDS.has(variantId)) return true;
  const handle = String(line.handle || line.sku || "").toLowerCase();
  if (SAME_DAY_HANDLES.has(handle)) return true;
  const title = String(line.title || "").toLowerCase();
  if (title.includes("same-day") || title.includes("same day")) return true;
  if (title.includes("fatest") && title.includes("4")) return true;
  return false;
}

export function findSameDayLine(order) {
  for (const line of order?.line_items || []) {
    if (isSameDayLine(line)) return line;
  }
  return null;
}

function propertyValue(line, name) {
  const props = line?.properties || [];
  if (Array.isArray(props)) {
    const hit = props.find((p) => p && p.name === name);
    return hit ? String(hit.value || "") : "";
  }
  if (props && typeof props === "object") return String(props[name] || "");
  return "";
}

export function sameDayDateFromOrder(order) {
  for (const line of order?.line_items || []) {
    const dedicated = propertyValue(line, "Same-day date");
    if (/^\d{4}-\d{2}-\d{2}$/.test(dedicated)) return dedicated;
  }
  for (const line of order?.line_items || []) {
    const collect = propertyValue(line, "Collection Date");
    if (/^\d{4}-\d{2}-\d{2}$/.test(collect)) return collect;
  }
  return null;
}

export function reserveRequestFromOrder(order) {
  const line = findSameDayLine(order);
  if (!line) return null;
  const repair = (order.line_items || []).find((item) => !isSameDayLine(item) && item.handle);
  return {
    orderId: order.id ? String(order.id) : String(order.order_number || ""),
    date: sameDayDateFromOrder(order),
    handle: repair ? String(repair.handle) : null,
    variantId: String(line.variant_id || "")
  };
}

export function annotateSuccessSlackText(text, order, extra = {}) {
  const sameDay = Boolean(findSameDayLine(order));
  const prefix = extra.reserveFailed
    ? "SAME-DAY RESERVE FAILED"
    : sameDay
      ? "SAME-DAY"
      : "";
  if (!prefix) return text;
  if (String(text || "").includes(prefix)) return text;
  return `*${prefix}*\n\n${text}`;
}

export async function reserveSameDayOnPaid(order, deps = {}) {
  const request = reserveRequestFromOrder(order);
  if (!request) return { skipped: true, reason: "not_same_day" };
  if (!request.date) return { ok: false, skipped: false, reason: "missing_date", request };
  const url = deps.reserveUrl || process.env.SAME_DAY_RESERVE_URL || "http://127.0.0.1:8061/same-day/reserve";
  const secret = deps.reserveSecret || process.env.SAME_DAY_RESERVE_SECRET || "";
  const fetchImpl = deps.fetchImpl || fetch;
  const response = await fetchImpl(url, {
    method: "POST",
    headers: {
      Authorization: secret ? `Bearer ${secret}` : "",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(request)
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) return { ok: false, reason: `http_${response.status}`, request, body };
  return { ok: Boolean(body.ok), request, body };
}

export async function refundSameDayLine(order, shopify) {
  const line = findSameDayLine(order);
  if (!line || !shopify?.request || !order?.id) return { refunded: false, reason: "missing" };
  const payload = await shopify.request(`/orders/${order.id}/refunds.json`, {
    method: "POST",
    body: JSON.stringify({
      refund: {
        notify: false,
        note: "SAME-DAY RESERVE FAILED — speed line removed, repair kept",
        refund_line_items: [
          {
            line_item_id: line.id,
            quantity: line.quantity || 1,
            restock_type: "no_restock"
          }
        ]
      }
    })
  });
  return { refunded: Boolean(payload?.refund?.id), refundId: payload?.refund?.id || null };
}
