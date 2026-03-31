"use client";

import { useEffect, useState } from "react";
import styles from "./CookieConsent.module.css";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("couranr-cookie-consent") === null) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const handleAccept = () => {
    localStorage.setItem("couranr-cookie-consent", "accepted");
    setVisible(false);
    window.location.reload();
  };

  const handleDecline = () => {
    localStorage.setItem("couranr-cookie-consent", "declined");
    setVisible(false);
  };

  return (
    <div className={styles.banner}>
      <div className={styles.inner}>
        <p className={styles.text}>
          We use cookies for analytics and to personalize your experience.
        </p>
        <div className={styles.buttons}>
          <button className={styles.accept} onClick={handleAccept}>
            Accept
          </button>
          <button className={styles.decline} onClick={handleDecline}>
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
