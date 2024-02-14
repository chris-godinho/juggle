// DeleteProfilePictureModal.jsx
// Opens a modal to confirm the deletion of user's profile picture

import React from "react";

import { useModal } from "../contextproviders/ModalProvider.jsx";

const DeleteProfilePictureModal = ({ handleDeleteFile }) => {
    
  const { closeModal } = useModal();

  return (
    <div className="modal-jg">
      <div className="modal-content-jg">
        <div>
          <h3>Delete Profile Picture</h3>
          <p>
            Are you sure you want to delete your profile picture?
            <br />
            This action cannot be reversed.
          </p>
          <div className="delete-modal-button-tray-jg">
            <button
              className="button-jg login-signup-delete-button-jg"
              onClick={() => {
                handleDeleteFile();
                closeModal();
              }}
            >
              Delete File
            </button>
            <button className="button-jg" onClick={closeModal}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteProfilePictureModal;
