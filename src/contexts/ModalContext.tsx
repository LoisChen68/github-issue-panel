import { createContext, useContext, useState } from 'react'

interface ModalContextData {
  handleSetModal: (modal: string) => void
  handleSetMenu: (id: number, menu: string) => void
  modalState: string
  menuState: { id: number; menu: string }
}

const modalContext = createContext<ModalContextData | undefined>(undefined)

export default function ModalContextProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [modalState, setModalState] = useState('')
  const [menuState, setMenuState] = useState({ id: 0, menu: '' })

  const handleSetModal = (modal: string) => {
    setModalState(modal)
  }

  const handleSetMenu = (id: number, menu: string) => {
    setMenuState({ id: id, menu: menu })
  }

  const modalContextData: ModalContextData = {
    handleSetModal,
    handleSetMenu,
    modalState,
    menuState
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
