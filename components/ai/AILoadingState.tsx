import styles from "./AILoadingState.module.css";

export default function AILoadingState({ message = "Analyzing..." }: { message?: string }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.dots}>
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
      </div>
      <p className={styles.message}>{message}</p>
    </div>
  );
}
