import React, { useState, useEffect, useRef } from "react";

import { useUserSettings } from "../contextproviders/UserSettingsProvider.jsx";

import { Uppy } from "@uppy/core";
import ImageEditor from "@uppy/image-editor";
import { Dashboard, DragDrop, ProgressBar } from "@uppy/react";
import Transloadit from "@uppy/transloadit";

import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import "@uppy/image-editor/dist/style.min.css";

import Auth from "../../utils/auth.js";

const ProfilePictureUpload = () => {

  const { userSettings, isLoadingSettings, setProfilePictureUpdated } = useUserSettings();

  const userProfile = Auth.getProfile();
  const fetchedUsername = userProfile?.data?.username;

  const [isUploaded, setIsUploaded] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [uploadReset, setUploadReset] = useState(false);

  const styleElementRef = useRef(null);


  useEffect(() => {
    if (!isLoadingSettings) {
      setImageUrl(userSettings?.profilePictureUrl || "");
    }
  }, [isLoadingSettings, userSettings]);

  useEffect(() => {
    console.log("[ProfilePictureUpload.jsx] useEffect");
    console.log("[ProfilePictureUpload.jsx] fetchedUsername:", fetchedUsername);
    if (!uploadReset) {

      setProfilePictureUpdated(true);

      if (imageUrl && imageUrl !== "") {
        console.log("[ProfilePictureUpload.jsx] imageUrl", imageUrl);
        console.log("[ProfilePictureUpload.jsx] setting isUploaded to true...");
        setIsUploaded(true);
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
    }
  }, [fetchedUsername, isUploaded, imageUrl, uploadReset]);

  const resetUpload = () => {
    console.log("[ProfilePictureUpload.jsx] resetUpload");
    console.log("[ProfilePictureUpload.jsx] Setting uploadReset to true...");
    setUploadReset(true);
  };

  // TODO: Allow picture to be deleted?
  // const [deleteFile] = useMutation(DELETE_FILE);
  // Do all the setup if yes
  /*
  const handleDeleteFile = async (fileName) => {
    try {
      // Send a request to the server to delete the file
      const response = await deleteFile({
        variables: {
          username: username || userProfile?.data?.username,
          fileName,
        },
      });
    } catch (error) {
      console.error("[FileManagementWidget.jsx]: Error deleting file:", error);
    }
  };
  */

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
          dragMode: "move",
          aspectRatio: 1,
          guides: false,
          center: false,
          cropBoxMovable: false,
          cropBoxResizable: false,
          viewMode: 1,
          responsive: true,
          movable: true,
          scalable: true,
          background: false,
          style: { width: "100%", height: "100%" },
          autoCropArea: 1,
          checkCrossOrigin: false,
        },
      })
      .on("upload-success", (file, response) => {
        setIsUploaded(true);
        setUploadReset(false);
      })
  );

  return (
    <div className="upload-area-container-jg">
      {uppy && (
        <div
          className={
            isUploaded && !uploadReset ? "uploaded-picture-jg upload-area-jg" : "upload-area-jg"
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
            onClick={resetUpload}
          />
        </div>
      )}
    </div>
  );
};

export default ProfilePictureUpload;
