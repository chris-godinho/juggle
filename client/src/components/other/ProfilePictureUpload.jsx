import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";

import { Uppy } from "@uppy/core";
import ImageEditor from "@uppy/image-editor";
import { Dashboard, DragDrop, ProgressBar } from "@uppy/react";
import Transloadit from "@uppy/transloadit";

import AuthService from "../../utils/auth.js";

import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import "@uppy/image-editor/dist/style.min.css";

const ProfilePictureUpload = () => {
  const userProfile = AuthService.getProfile();
  const fetchedUsername = userProfile?.data?.username || "";

  const [isUploaded, setIsUploaded] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    setUsername(fetchedUsername);
  }, [fetchedUsername]);

  const resetUpload = () => {
    setIsUploaded(false);
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

  // TODO: Downloads/access will need a presigned URL (might need server side for that)

  // TODO: Add the option to have the profile picture as the background to the upload area

  const [uppy] = useState(
    new Uppy({
      restrictions: {
        maxFileSize: 5000000,
        maxTotalFileSize: 5000000,
        maxNumberOfFiles: 1,
        minNumberOfFiles: 1,
        allowedFileTypes: ["image/*"],
      },
      meta: { username: username },
    })
      // TODO: Create Transloadit Assembly to convert picture to .jpg
      .use(Transloadit, {
        id: "Transloadit",
        assemblyOptions: {
          params: {
            auth: {
              key: "55b7b7bf8b474873a15cae1a2badf647", // Public key, no need to hide
            },
            template_id: "8850d7c7939140a090a902a946bdf3d6", // Public template, no need to hide
            fields: {
              username: username,
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
      // TODO: Add procedure for picture cropping after upload
      // https://uppy.io/docs/image-editor/
      .on("upload-success", (file, response) => {
        // TODO: What needs to be added here?
        console.log("response.status", response.status);
        console.log("response.body", response.body);
        setIsUploaded(true);
      })
  );

  return (
    <div>
      {!isUploaded && uppy && (
        <div className="upload-area-jg">
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
      )}
      {isUploaded && (
        <div className="upload-confirmed-container-jg">
          <div className="upload-confirmed-jg"></div>
          <button className="button-jg upload-button-jg" onClick={resetUpload} >Upload Again</button>
        </div>
      )}
    </div>
  );
};

export default ProfilePictureUpload;
