import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import FullScene from "./components/FullScene";
import Login from "./components/LoginPage";
import api from "./api/api";

// 보호 라우트 (로그인된 사용자만 접근 가능)
function ProtectedRoute({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get("/member/isAuth");
        if (response.status === 200) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (isLoading) return <div>로딩중...</div>;

  return isAuthenticated ? children : <Navigate to="/doit" replace />;
}

// 공개 라우트 (로그인 상태면 접근 불가 → 홈으로 이동)
function PublicRoute({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get("/member/isAuth");
        if (response.status === 200) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (isLoading) return <div>로딩중...</div>;

  return isAuthenticated ? <Navigate to="/" replace /> : children;
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* 메인: 로그인 필요 */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <FullScene />
            </ProtectedRoute>
          }
        />
        {/* 로그인 페이지: 로그인된 상태면 /로 리다이렉트 */}
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
