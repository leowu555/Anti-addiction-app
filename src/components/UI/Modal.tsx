/**
 * Modal - Animated popup with blur background.
 */

import { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  children: ReactNode;
  /** If false, clicking backdrop won't close */
  closeOnBackdrop?: boolean;
}

export function Modal({ isOpen, onClose, children, closeOnBackdrop = false }: ModalProps) {
  if (!isOpen) return null;

  const handleBackdropClick = () => {
    if (closeOnBackdrop && onClose) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />
      <div
        className="relative z-10 w-full max-w-md rounded-2xl bg-slate-800 p-6 shadow-2xl ring-1 ring-slate-700 animate-modal-in"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
