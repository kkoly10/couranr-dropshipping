import styles from "./SupplierBadge.module.css";

const supplierNames: Record<string, string> = {
  zendrop: "Zendrop US",
  spocket: "Spocket Verified Supplier",
  cj_dropshipping: "CJ Dropshipping US",
  wayfair: "Wayfair",
  home_depot: "Home Depot",
  walmart: "Walmart",
};

export type SupplierBadgeProps = {
  supplier: string;
  shippingDaysMin?: number;
  shippingDaysMax?: number;
};

export default function SupplierBadge({
  supplier,
  shippingDaysMin = 2,
  shippingDaysMax = 8,
}: SupplierBadgeProps) {
  const displayName = supplierNames[supplier] ?? supplier;

  return (
    <div className={styles.badge}>
      <span className={styles.item}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        Fulfilled by {displayName}
      </span>
      <span className={styles.dot}>&middot;</span>
      <span className={styles.item}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="3" width="15" height="13" />
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
        US Warehouse &middot; Ships {shippingDaysMin}–{shippingDaysMax} days
      </span>
      <span className={styles.dot}>&middot;</span>
      <span className={styles.item}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        Couranr Verified
      </span>
    </div>
  );
}
