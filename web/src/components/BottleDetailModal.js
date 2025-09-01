// BottleDetailModal.js
import React, { useEffect, useState } from 'react';
import '../css/BottleDetailModal.css';
import api from '../api/api';
import Swal from "sweetalert2";

export default function BottleDetailModal({ open, bottleId, onClose, onLeave, onSubmit }) {
  const [bottle, setBottle] = useState(null);
  const [text, setText] = useState('');

    useEffect(() => {
    const fetchBottle = async () => {
      try {
        if (open && bottleId) {
          // 사용자 정보 예시 (테스트 용도)
          const res = await api.get("/bottle/letter/detail", {  
             params: { btlLtrNo: bottleId } 
           });
          console.log("내 정보:", res.data);
                  setBottle({
          id: res.data.data.btlLtrNo,
          title: res.data.data.title,
          content: res.data.data.content
        });

          // // 병 정보 가져오기
          // const bottleRes = await api.get(`/api/bottle/${bottleId}`);
          // setBottle(bottleRes.data);
        }
      } catch (err) {
        console.error(err);
        setBottle({
          id: bottleId,
          title: '불러오기 실패',
          content: '내용을 가져올 수 없습니다.'
        });
      }
    };

    fetchBottle();
  }, [open, bottleId]);

  if (!open || !bottle) return null;

const handleLeave = async () => {
  try {
    if (open && bottleId) {

      const res = await api.post("/bottle/justFlow", { btlLtrNo: bottleId });
      console.log(res.data);
      if (res.status === 200) {
           Swal.fire({
           icon: "success",
           title: "흘려보내기 성공",
           text: '유리병 편지를 그냥 흘려보냈습니다.',
           confirmButtonText: "확인",
           });
          onLeave(bottle.id);
      }else{
           Swal.fire({
           icon: "error",
           title: "흘려보내기 실패 ",
           text:  "오류가 발생했습니다.",
           confirmButtonText: "확인",
           });
      }
    }
  } catch (err) {
           Swal.fire({
           icon: "error",
           title: "흘려보내기 실패",
           text: err.response?.data?.msg || "오류가 발생했습니다.",
           confirmButtonText: "확인",
           });
  }

  console.log('bottle:' + bottle.id);

  onClose();
};

const handleSubmit = () => {
  // if (!bottle) return;
  // if (text.trim() === '') return;
  // if (onSubmit) {
  //   fetch(`/api/bottle/${bottle.id}/reply`, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ text }),
  //   })
  //     .then(() => onSubmit(bottle.id))
  //     .catch(() => onSubmit(bottle.id)); // 수정
  // }
  // setText('');
  // onClose();

    console.log('bottle:'+bottle.id);
  onLeave(bottle.id);
  onClose();
};

  return (
    <div className="blm-overlay" onClick={onClose}>
      <div className="blm-modal" onClick={(e) => e.stopPropagation()}>
        <button className="blm-close" onClick={onClose}>&times;</button>

        <div className="blm-header">
          <h2>{bottle.title || '편지'}</h2>
          <div className="blm-sub">{bottle.date ? new Date(bottle.date).toLocaleDateString() : ''}</div>
        </div>

        <div className="blm-paper">
          <div className="blm-margin-line"></div>
          <div className="blm-paper-lines"></div>
          <div className="blm-textarea" style={{ whiteSpace: 'pre-wrap', pointerEvents: 'none' }}>
            {bottle.content || '내용이 없습니다.'}
          </div>
        </div>

        <div className="blm-input-wrapper">
          <div className="blm-paper blm-input-paper">
            <div className="blm-margin-line"></div>
            <div className="blm-paper-lines"></div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="한번 답장을 남겨보세요... 혹시 읽을지도..."
            />
          </div>
          <div className="blm-input-actions blm-input-actions-bottom">
            <button className="blm-primary blm-left" onClick={handleLeave}>그냥 흘려보내기</button>
            <button className="blm-primary blm-right" onClick={handleSubmit}>작성</button>
          </div>
        </div>
      </div>
    </div>
  );
}
