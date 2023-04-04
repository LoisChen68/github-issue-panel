import { createContext, useContext, useState } from "react";

interface ModalContextData {
  handleSetModal: (modal: string) => void
  modalState: string
}

const modalContext = createContext<ModalContextData | undefined>(undefined)

export default function ModalContextProvider({ children }: {
  children: React.ReactNode
}) {
  const [modalState, setModalState] = useState('')


  const handleSetModal = (modal: string) => {
    setModalState(modal)
  }

  const modalContextData: ModalContextData = {
    handleSetModal,
    modalState
  }
  return (
    <modalContext.Provider value={modalContextData}>
      {children}
    </modalContext.Provider>
  )
}

export function useModalState() {
  return useContext(modalContext)
}