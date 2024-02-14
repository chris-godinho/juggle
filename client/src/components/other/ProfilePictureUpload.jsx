// ProfilePictureUpload.jsx
// Used to upload a profile picture for the user

import React, { useState, useEffect, useRef } from "react";
import { useMutation } from "@apollo/client";

import { useUserSettings } from "../contextproviders/UserSettingsProvider.jsx";
import { useModal } from "../contextproviders/ModalProvider.jsx";

import { Uppy } from "@uppy/core";
import ImageEditor from "@uppy/image-editor";
import { Dashboard, DragDrop, ProgressBar } from "@uppy/react";
import Transloadit from "@uppy/transloadit";

import DeleteProfilePictureModal from "./DeleteProfilePictureModal.jsx";

import { DELETE_FILE } from "../../utils/mutations.js";

// Import styles for @uppy plugins
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import "@uppy/image-editor/dist/style.min.css";

import Auth from "../../utils/auth.js";

const ProfilePictureUpload = () => {
  const {
    userSettings,
    isLoadingSettings,
    deleteProfilePictureUrl,
    setTemporaryProfilePictureUrl,
    refreshProfilePictureUpload
  } = useUserSettings();

  // Get the username from the user's profile for S3 folder name
  const userProfile = Auth.getProfile();
  const fetchedUsername = userProfile?.data?.username;

  // Initialize the deleteFile mutation
  const [deleteFile] = useMutation(DELETE_FILE);

  // State for the profile picture upload
  const [isUploaded, setIsUploaded] = useState(false);

  // Presigned URL for profile picture
  const [imageUrl, setImageUrl] = useState("");

  // Style element for the uploaded picture
  const styleElementRef = useRef(null);

  // Open the modal
  const { openModal } = useModal();

  // Set the profile picture URL when the user settings are done loading
  useEffect(() => {
    if (!isLoadingSettings && userSettings?.profilePictureUrl && !isUploaded) {
      setImageUrl(userSettings?.profilePictureUrl || "");
    }
  }, [isLoadingSettings, userSettings]);

  // Apply profile picture URL to upload area's background
  useEffect(() => {
    if (imageUrl && imageUrl !== "") {
      if (styleElementRef.current) {
        styleElementRef.current.innerHTML = `
          .upload-area-jg::before {
            background-image: url(${imageUrl});
          }
        `;
      } else {
        // Create the style element
        const styleElement = document.createElement("style");
        styleElement.type = "text/css";
        styleElement.innerHTML = `
          .uploaded-picture-jg::before {
            background-image: url(${imageUrl});
          }
        `;
        // Append the style element to the head
        document.head.appendChild(styleElement);
        styleElementRef.current = styleElement;
      }
    }
  }, [fetchedUsername, imageUrl]);

  // Delete the file from S3
  const handleDeleteFile = async (fileName) => {
    try {
      // Send a request to the server to delete the file
      const response = await deleteFile({
        variables: {
          username: fetchedUsername || userProfile?.data?.username,
          fileName: "profilePicture.jpg",
        },
      });

      if (response?.data?.deleteFile) {
        console.log(`File ${fileName} deleted?`);
        console.log("Response:", response);
        setImageUrl("");
        deleteProfilePictureUrl();
      }
    } catch (error) {
      console.error("[FileManagementWidget.jsx]: Error deleting file:", error);
    }
  };

  // Initialize Uppy
  const [uppy] = useState(
    new Uppy({
      restrictions: {
        maxFileSize: 5000000,
        maxTotalFileSize: 5000000,
        maxNumberOfFiles: 1,
        minNumberOfFiles: 1,
        allowedFileTypes: ["image/*"],
      },
      meta: { username: fetchedUsername },
    })
      .use(Transloadit, {
        id: "Transloadit",
        assemblyOptions: {
          params: {
            auth: {
              key: "55b7b7bf8b474873a15cae1a2badf647", // Public key, no need to hide
            },
            template_id: "8850d7c7939140a090a902a946bdf3d6", // Public template, no need to hide
            fields: {
              username: fetchedUsername,
            },
          },
        },
      })
      .use(ImageEditor, {
        actions: {
          revert: false,
          rotate: false,
          granularRotate: false,
          flip: false,
          zoomIn: true,
          zoomOut: true,
          cropSquare: false,
          cropWidescreen: false,
          cropWidescreenVertical: false,
        },
        cropperOptions: {
          viewMode: 1,
          dragMode: "move",
          background: false,
          guides: false,
          center: false,
          cropBoxResizable: false,
          responsive: true,
          movable: true,
          scalable: true,
          zoomable: true,
          zoomOnTouch: true,
          zoomOnWheel: true,
          style: { width: "100%", height: "100%" },
          autoCropArea: 1,
          checkCrossOrigin: false,
        },
      })
      .on("file-added", (file) => {
        setIsUploaded(false);
        setImageUrl("");
      })
      .on("upload-success", (file, response) => {
        setIsUploaded(true);
        setImageUrl(response?.uploadURL || "");
        setTemporaryProfilePictureUrl(response?.uploadURL || "");
        refreshProfilePictureUpload();
      })
  );

  return (
    <div className="upload-area-container-jg">
      {uppy && (
        <>
          <div
            className={
              imageUrl ? "uploaded-picture-jg upload-area-jg" : "upload-area-jg"
            }
          >
            <Dashboard
              id="uppy-dashboard-jg"
              uppy={uppy}
              plugins={["ImageEditor"]}
              height="39vh"
              width="39vh"
              autoOpenFileEditor={true}
              theme="dark"
            />
          </div>
          {imageUrl && (
          <button
            className="button-jg login-signup-delete-button-jg profile-picture-delete-button-jg"
            onClick={() =>
              openModal(
                <DeleteProfilePictureModal
                  handleDeleteFile={handleDeleteFile}
                />
              )
            }
          >
            Delete
          </button>
        )}
        </>
      )}
    </div>
  );
};

export default ProfilePictureUpload;
