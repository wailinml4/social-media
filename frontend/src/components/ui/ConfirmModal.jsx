import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useModal } from '../../context/ModalContext';
import { useModalAnimation } from '../../animations/useModalAnimation';

const ConfirmModal = () => {
  const {
    isConfirmModalOpen,
    confirmModalData,
    closeConfirmModal,
  } = useModal();

  const overlayRef = useRef(null);
  const modalRef = useRef(null);
  const { isRendered } = useModalAnimation(isConfirmModalOpen, {
    overlayRef,
    modalRef,
  });

  useEffect(() => {
    if (!isConfirmModalOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeConfirmModal();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isConfirmModalOpen, closeConfirmModal]);

  if (!isRendered || !confirmModalData) return null;

  const {
    title = 'Confirm',
    message = 'Are you sure?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
  } = confirmModalData;

  const handleConfirm = async () => {
    closeConfirmModal();
    await onConfirm?.();
  };

  return (
    <div className="fixed inset-0 z-[140] flex items-end justify-center sm:items-center sm:p-6">
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/40 backdrop-blur-xl"
        onClick={closeConfirmModal}
      />

      <div
        ref={modalRef}
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#050505] shadow-[0_0_50px_rgba(0,0,0,0.5)]"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-white">{title}</h2>
            {confirmModalData.subtitle && (
              <p className="mt-1 text-sm text-text-dim">{confirmModalData.subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={closeConfirmModal}
            className="flex h-9 w-9 items-center justify-center rounded-full text-white/55 transition-all duration-200 hover:bg-white/5 hover:text-white"
            aria-label="Close modal"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        <div className="px-5 py-6">
          <p className="text-sm text-white/70">{message}</p>
        </div>

        <div className="flex items-center gap-3 border-t border-white/10 px-5 py-4">
          <button
            type="button"
            onClick={closeConfirmModal}
            className="flex-1 rounded-full border border-white/10 px-4 py-3 text-sm text-white/80 transition-all duration-200 hover:bg-white/5"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 rounded-full bg-red-500 px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-red-400"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
