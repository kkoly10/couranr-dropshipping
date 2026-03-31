import { buildProductContext } from "./context-builder";

export async function buildFlywheelContext(): Promise<string> {
  // Flywheel data is added progressively as customer data accumulates.
  // At launch this returns empty string — the context builder provides
  // the full product catalog which is sufficient for day-one AI features.
  // As orders, AI interactions, and reviews grow, this function will
  // inject frequently-bought-together pairs, top-converting recs, and
  // review sentiment into Claude's context.
  return "";
}

export async function buildFullContext(): Promise<string> {
  const [productContext, flywheelContext] = await Promise.all([
    buildProductContext(),
    buildFlywheelContext(),
  ]);

  return flywheelContext
    ? productContext + "\n" + flywheelContext
    : productContext;
}
