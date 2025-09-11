import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  defaultMode = 'login' 
}) => {
  const [mode, setMode] = useState(defaultMode);

  useEffect(() => {
    if (isOpen) {
      setMode(defaultMode);
    }
  }, [defaultMode, isOpen]);

  const handleSuccess = () => {
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'login' ? 'Sign In' : 'Sign Up'}
    >
      <div className="mb-4">
        {mode === 'login' ? (
          <LoginForm onSuccess={handleSuccess} />
        ) : (
          <RegisterForm onSuccess={handleSuccess} />
        )}
      </div>
      
      <div className="text-center text-gray-400">
        {mode === 'login' ? (
          <>
            Don't have an account?{' '}
            <button
              onClick={() => setMode('register')}
              className="text-poker-gold hover:underline"
            >
              Sign up
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button
              onClick={() => setMode('login')}
              className="text-poker-gold hover:underline"
            >
              Sign in
            </button>
          </>
        )}
      </div>
    </Modal>
  );
};