"use client";

import { useState } from "react";
import type { QuizAnswers, StylistResult } from "@/types";
import AILoadingState from "@/components/ai/AILoadingState";
import AIRecommendationCard from "@/components/ai/AIRecommendationCard";
import styles from "./SpaceStylist.module.css";

const STEPS = [
  {
    key: "spaceType" as const,
    question: "What type of space?",
    options: ["Home Office", "Shared Space", "Bedroom Desk", "Living Room Corner"],
  },
  {
    key: "aesthetic" as const,
    question: "Your aesthetic?",
    options: ["Minimal & Clean", "Warm & Natural", "Bold & Modern", "Cozy & Compact"],
  },
  {
    key: "painPoint" as const,
    question: "Biggest pain point?",
    options: ["Cable Chaos", "No Storage", "Bad Posture", "Poor Lighting", "General Mess"],
  },
  {
    key: "budget" as const,
    question: "Budget?",
    options: ["$50\u2013$100", "$100\u2013$200", "$200+"],
  },
  {
    key: "currentSetup" as const,
    question: "What do you already have?",
    options: ["Nothing", "Some Basics", "Full Setup to Upgrade", "Just Want Accessories"],
  },
];

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export default function SpaceStylist() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StylistResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSelect(value: string) {
    const step = STEPS[currentStep];
    const updated = { ...answers, [step.key]: value };
    setAnswers(updated);

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      submitQuiz(updated as QuizAnswers);
    }
  }

  function handleBack() {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }

  async function submitQuiz(quizAnswers: QuizAnswers) {
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/stylist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quizAnswers),
      });

      if (!res.ok) {
        throw new Error("Failed to get recommendations. Please try again.");
      }

      const data: StylistResult = await res.json();
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function handleStartOver() {
    setCurrentStep(0);
    setAnswers({});
    setResult(null);
    setError(null);
  }

  const showQuiz = !loading && !result && !error;
  const progress = loading || result ? 100 : ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className={styles.wrapper}>
      {/* Progress bar */}
      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
      </div>

      {showQuiz && (
        <>
          <p className={styles.stepLabel}>Step {currentStep + 1} of 5</p>

          <div className={styles.step}>
            <h2 className={styles.stepQuestion}>{STEPS[currentStep].question}</h2>

            <div
              className={`${styles.optionGrid} ${
                STEPS[currentStep].options.length === 4 ? styles.optionGrid4 : ""
              }`}
            >
              {STEPS[currentStep].options.map((option) => (
                <button
                  key={option}
                  className={styles.optionCard}
                  onClick={() => handleSelect(option)}
                >
                  {option}
                </button>
              ))}
            </div>

            {currentStep > 0 && (
              <button className={styles.backButton} onClick={handleBack}>
                &larr; Back
              </button>
            )}
          </div>
        </>
      )}

      {loading && <AILoadingState message="Building your personalized setup..." />}

      {error && (
        <>
          <p className={styles.error}>{error}</p>
          <button className={styles.startOver} onClick={handleStartOver}>
            Start Over
          </button>
        </>
      )}

      {result && (
        <div className={styles.results}>
          <h2 className={styles.headline}>{result.headline}</h2>

          <div className={styles.recommendationGrid}>
            {result.recommendations.map((rec, i) => (
              <AIRecommendationCard key={i} recommendation={rec} />
            ))}
          </div>

          {result.bundle_note && (
            <p className={styles.bundleNote}>{result.bundle_note}</p>
          )}

          <div className={styles.footer}>
            <p className={styles.totalPrice}>Total: {formatPrice(result.total)}</p>
            <button className={styles.addAllButton}>Add All to Cart</button>
          </div>

          <button className={styles.startOver} onClick={handleStartOver}>
            Start Over
          </button>
        </div>
      )}
    </div>
  );
}
