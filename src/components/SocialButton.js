
import Modal from "react-modal";
import { useState } from "react";
import SocialConnectorDisplay from "./SocialConnectorDisplay"

const SocialButton = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleActivate = () => {
        openModal()
    }
    return (
        <>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                className="modal"
                overlayClassName="modal-overlay"
            >
                <SocialConnectorDisplay index={3} />
            </Modal>
            <button onClick={handleActivate}>Manage Social</button>
        </>
    )
}

export default SocialButton