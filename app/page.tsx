export default function Home() {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        fontFamily: "var(--font-display)",
      }}
    >
      <h1 style={{ fontSize: "var(--text-4xl)", color: "var(--color-espresso)" }}>
        COURANR
      </h1>
      <p
        style={{
          fontSize: "var(--text-lg)",
          color: "var(--color-taupe)",
          marginTop: "var(--space-4)",
          fontFamily: "var(--font-body)",
        }}
      >
        Desk setup &amp; home organization — coming soon.
      </p>
    </main>
  );
}
