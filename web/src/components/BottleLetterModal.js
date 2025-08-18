import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import "../css/BottleLetterModal.css";

export default function BottleLetterModal({ open, onClose, onSubmit }) {
  const overlayRef = useRef(null);

  // ESC로 닫기 & 바디 스크롤 잠금
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="blm-overlay"
      ref={overlayRef}
      onMouseDown={(e) => {
        if (e.target === overlayRef.current) onClose?.(); // 바깥 클릭 닫기
      }}
    >
      <section
        className="blm-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="blm-title"
      >
        {/* 닫기 버튼 */}
        <button className="blm-close" onClick={onClose} aria-label="닫기">
          ×
        </button>

        {/* 헤더 */}
        <header className="blm-header">
          <h2 id="blm-title">Bottle Story</h2>
          <p className="blm-sub">여러분의 고민.. 누군가 들어줄 수 있습니다.</p>
        </header>

        {/* 편지지 */}
        <div className="blm-paper" aria-label="편지지">
          {/* 세로 여백선 */}
          <span className="blm-margin-line" aria-hidden />
          {/* 가로 줄 */}
          <div className="blm-paper-lines" aria-hidden />
          <textarea
            className="blm-textarea"
            placeholder="이곳에 편지를 적어보세요..."
            maxLength={1000}
          />
        </div>

        {/* 액션 */}
        <div className="blm-actions">
          <button
            className="blm-primary"
            onClick={() => {
              onSubmit?.();
              onClose?.();
            }}
          >
            바다에 띄우기
          </button>
        </div>
      </section>
    </div>,
    document.body
  );
}
