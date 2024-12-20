import { useState } from 'react';

export function useSuggestionModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [callback, setCallback] = useState<((value: string) => void) | null>(null);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    description: ''
  });

  const openModal = (
    config: { title: string; description: string },
    onSubmit: (value: string) => void
  ) => {
    setModalConfig(config);
    setCallback(() => onSubmit);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setCallback(null);
  };

  const handleSubmit = (value: string) => {
    if (callback) {
      callback(value);
    }
    closeModal();
  };

  return {
    isOpen,
    modalConfig,
    openModal,
    closeModal,
    handleSubmit
  };
}
