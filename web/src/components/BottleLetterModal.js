import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "../css/BottleLetterModal.css";
import api from '../api/api';
import Swal from "sweetalert2";

export default function BottleLetterModal({ open, onClose, onSubmit }) {
  const overlayRef = useRef(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [lat, setLat] = useState(null);
  const [lot, setLot] = useState(null);

  // ESC로 닫기 & 바디 스크롤 잠금
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

      if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLot(position.coords.longitude);
      },
      (error) => {
        console.error(error);
        alert("위치 정보를 가져올 수 없습니다.");
      }
    );
  } else {
    alert("브라우저가 위치 정보를 지원하지 않습니다.");
  }
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
        <button
          className="blm-close"
          onClick={() => {
            setTitle("");
            setContent("");
            onClose?.();
          }}
          aria-label="닫기"
        >
          ×
        </button>

        {/* 헤더 */}
        <header className="blm-header">
          <input
            id="blm-title"
            className="blm-title-input"
            placeholder="제목을 입력하세요..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={50}
          />
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
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        {/* 액션 */}
        <div className="blm-actions">
          <button
            className="blm-primary"
              onClick={async () => {
                try {
                  if(!title){
                    alert('제목은 필수 입력항목입니다.')
                    setTitle("");
                    return;
                  }
                  console.log(content)
                  if(!content){
                    alert('내용은 필수 입력항목입니다.')
                    setContent("");
                      return;
                  }
                  // API 호출: title과 content 전달
                  await api.post("/bottle/letter", { title, content,lat,lot });

                  // 필요하면 부모 컴포넌트 콜백
                  onSubmit?.({ title, content });

                  // 모달 닫기
                  onClose?.();

                  // 입력 초기화
                  setTitle("");
                  setContent("");

                  Swal.fire({
                    icon: "success",
                    title: "편지가 바다에 띄워졌어요!",
                    text: "누군가 당신의 편지를 확인할 수도 있습니다.",
                    confirmButtonText: "확인",
                  });
                } catch (error) {
                  setTitle("");
                  setContent("");
                  console.error(error);
                  Swal.fire({
                    icon: "error",
                    title: "편지 띄우기 실패 ",
                    text: error.response?.data?.msg || "오류가 발생했습니다.",
                    confirmButtonText: "확인",
                  });
                  onClose?.();

                }
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
