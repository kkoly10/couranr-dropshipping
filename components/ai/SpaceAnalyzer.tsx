"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { SpaceAnalysis } from "@/types";
import AILoadingState from "@/components/ai/AILoadingState";
import AIRecommendationCard from "@/components/ai/AIRecommendationCard";
import styles from "./SpaceAnalyzer.module.css";

type Tab = "describe" | "upload";

export default function SpaceAnalyzer() {
  const [activeTab, setActiveTab] = useState<Tab>("describe");
  const [description, setDescription] = useState("");
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SpaceAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function readFileAsBase64(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(",")[1];
      setImageBase64(base64);
      setMimeType(file.type);
      setFileName(file.name);
    };
    reader.readAsDataURL(file);
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) readFileAsBase64(file);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) readFileAsBase64(file);
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(true);
  }

  function handleDragLeave() {
    setDragOver(false);
  }

  async function handleSubmit() {
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const body =
        activeTab === "describe"
          ? { description }
          : { imageBase64, mimeType };

      const res = await fetch("/api/ai/analyzer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error("Analysis failed. Please try again.");
      }

      const data: SpaceAnalysis = await res.json();
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const canSubmit =
    activeTab === "describe"
      ? description.trim().length > 0
      : imageBase64 !== null;

  return (
    <div className={styles.wrapper}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === "describe" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("describe")}
        >
          Describe
        </button>
        <button
          className={`${styles.tab} ${activeTab === "upload" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("upload")}
        >
          Upload Photo
        </button>
      </div>

      {activeTab === "describe" && (
        <textarea
          className={styles.textarea}
          placeholder="I have a small apartment desk by the window. Cables everywhere. My laptop sits flat on the desk which hurts my neck. Very little storage. Budget is around $150."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
        />
      )}

      {activeTab === "upload" && (
        <div
          className={`${styles.dropZone} ${dragOver ? styles.dropZoneActive : ""}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className={styles.fileInput}
          />
          {fileName ? (
            <p className={styles.dropZoneText}>{fileName}</p>
          ) : (
            <p className={styles.dropZoneText}>
              Drag &amp; drop a photo here, or click to browse
            </p>
          )}
        </div>
      )}

      <button
        className={styles.submitButton}
        onClick={handleSubmit}
        disabled={!canSubmit || loading}
      >
        Analyze My Space
      </button>

      {loading && <AILoadingState message="Analyzing your space..." />}

      {error && <p className={styles.error}>{error}</p>}

      {result && (
        <div className={styles.results}>
          <div className={styles.assessment}>
            <h3 className={styles.sectionTitle}>Space Assessment</h3>
            <p className={styles.assessmentText}>{result.space_assessment}</p>
          </div>

          <div className={styles.problems}>
            <h3 className={styles.sectionTitle}>Top Problems</h3>
            <ul className={styles.problemList}>
              {result.top_problems.map((problem, i) => (
                <li key={i} className={styles.problemItem}>
                  {problem}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.recommendations}>
            <h3 className={styles.sectionTitle}>Recommendations</h3>
            <div className={styles.recommendationGrid}>
              {result.recommendations.map((rec, i) => (
                <AIRecommendationCard key={i} recommendation={rec} />
              ))}
            </div>
          </div>

          <div className={styles.footer}>
            <p className={styles.totalPrice}>
              Estimated Total: ${result.total.toFixed(2)}
            </p>
            {result.transformation_note && (
              <p className={styles.transformationNote}>
                {result.transformation_note}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
