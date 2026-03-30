import styles from "./Card.module.css";

export type CardProps = {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
};

export default function Card({ children, className = "", padding = true }: CardProps) {
  return (
    <div className={`${styles.card} ${padding ? styles.padded : ""} ${className}`}>
      {children}
    </div>
  );
}
