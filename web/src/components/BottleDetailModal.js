// BottleDetailModal.js
import React, { useEffect, useState } from 'react';
import '../css/BottleDetailModal.css';

export default function BottleDetailModal({ open, bottleId, onClose, onLeave, onSubmit }) {
  const [bottle, setBottle] = useState(null);
  const [text, setText] = useState('');

  useEffect(() => {
    // if (open && bottleId) {
    //   fetch(`/api/bottle/${bottleId}`)
    //     .then(res => res.json())
    //     .then(data => setBottle(data))
    //     .catch(err => {
    //       console.error(err);
    //       setBottle({ title: '불러오기 실패', content: '내용을 가져올 수 없습니다.' });
    //     });
    // }
      if (open && bottleId) {
    // API 호출 대신 임시 데이터
    setBottle({ 
      id: bottleId,   // <- id를 넣어야 handleLeave/handleSubmit에서 사용 가능
      title: '불러오기 실패', 
      content: '내용을 가져올 수 없습니다.' 
    });
  }
  }, [open, bottleId]);

  if (!open || !bottle) return null;

const handleLeave = () => {
  // if (!bottle) return; // 안전장치
  // if (onLeave) {
  //   fetch(`/api/bottle/${bottle.id}/leave`, { method: 'POST' })
  //     .then(() => onLeave(bottle.id))
  //     .catch(() => onLeave(bottle.id)); // 수정
  // } else {
  //   console.warn('onLeave callback 없음');
  // }
  // onClose();
  
  console.log('bottle:'+bottle.id);
  onLeave(bottle.id);
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
