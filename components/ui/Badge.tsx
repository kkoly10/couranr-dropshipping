import styles from "./Badge.module.css";

export type BadgeVariant = "new" | "bestseller" | "sale" | "instock" | "category";

export type BadgeProps = {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
};

export default function Badge({ variant, children, className = "" }: BadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
}
