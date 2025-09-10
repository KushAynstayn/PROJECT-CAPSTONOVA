"use client";

import React, { useState } from "react";
import ViewerLoginPage from "@/components/viewer/viewer-login";
import ViewerSignUpPage from "@/components/viewer/viewer-signup";
import SuccessMessage from "@/components/viewer/viewer-success-message";

{
  /* This component will handle the state for showing either the login or sign-up form. */
}

const AuthModal = ({ onClose }: { onClose: () => void }) => {
  const [currentView, setCurrentView] = useState("login"); // 'login' | 'signup' | 'success'

  const handleLoginSuccess = () => {
    setCurrentView("success");
  };

  const handleSignupSuccess = () => {
    setCurrentView("success");
  };

  const handleSwitchToSignUp = () => setCurrentView("signup");
  const handleSwitchToLogin = () => setCurrentView("login");

  let content;
  if (currentView === "login") {
    content = (
      <ViewerLoginPage
        onClose={onClose}
        onSwitchToSignUp={handleSwitchToSignUp}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  } else if (currentView === "signup") {
    content = (
      <ViewerSignUpPage
        onClose={onClose}
        onSwitchToLogin={handleSwitchToLogin}
        onSignupSuccess={handleSignupSuccess}
      />
    );
  } else if (currentView === "success") {
    content = <SuccessMessage onClose={onClose} />;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 backdrop-blur-md"
        onClick={onClose}
      ></div>
      {content}
    </div>
  );
};

export default AuthModal;
