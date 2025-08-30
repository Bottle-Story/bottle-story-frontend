import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import FullScene from "./components/FullScene";
import Login from "./components/LoginPage";
import api from "./api/api";
import './App.css';

// ===== 위치 동의 모달 =====
function LocationModal() {
  const handleOpenSettings = () => {
    alert(
      "브라우저에서 위치 권한이 거부되었습니다.\n\n" +
      "브라우저 설정에서 위치 권한을 허용해주세요.\n\n" +
      "예시:\n" +
      "- Chrome: 주소창 옆 자물쇠 → 위치 → 허용\n" +
      "- Safari(iOS): 설정 → Safari → 위치 허용"
    );
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <h2>위치 정보 제공이 필요합니다</h2>
        <p>앱 사용을 위해 위치 정보 제공에 동의해 주세요.</p>
        <button className="retry-btn" onClick={handleOpenSettings}>
          위치 권한 안내
        </button>
      </div>
    </div>
  );
}

// ===== 보호 라우트 (로그인 + 위치 권한) =====
function ProtectedRoute({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

  // 위치 확인
  const checkLocation = () => {
    setIsLoading(true);
    setHasLocationPermission(false);

    if (!navigator.geolocation) {
      alert("현재 브라우저는 위치 정보를 지원하지 않습니다.");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => {
        setHasLocationPermission(true);
        setIsLoading(false);
      },
      () => {
        setHasLocationPermission(false);
        setIsLoading(false);
      }
    );
  };

  // 로그인 확인 + 위치 확인
  useEffect(() => {
    const checkAuthAndLocation = async () => {
      try {
        const response = await api.get("/member/isAuth");
        if (response.status === 200) {
          setIsAuthenticated(true);
          checkLocation();
        } else {
          setIsAuthenticated(false);
          setIsLoading(false);
        }
      } catch {
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    };
    checkAuthAndLocation();
  }, []);

  if (isLoading) return <div className="loading">로딩중...</div>;
  if (!isAuthenticated) return <Navigate to="/doit" replace />;
  if (!hasLocationPermission) return <LocationModal />;

  return children;
}

// ===== 공개 라우트 (로그인 상태면 접근 불가) =====
function PublicRoute({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get("/member/isAuth");
        setIsAuthenticated(response.status === 200);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (isLoading) return <div className="loading">로딩중...</div>;

  return isAuthenticated ? <Navigate to="/" replace /> : children;
}

// ===== App 컴포넌트 =====
export default function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <FullScene />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doit"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
      </Routes>
    </Router>
  );
}
