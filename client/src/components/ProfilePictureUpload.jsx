import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

const ProfilePictureUpload = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [cropper, setCropper] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setUploadedImage(file);

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleCrop = () => {
    const croppedData = cropper.getCroppedCanvas().toDataURL();
    console.log("[ProfilePictureUpload.jsx] croppedData:", croppedData);

    // Use the fetch API to send the data to the server

    // Create FormData
    const formData = new FormData();
    formData.append(
      "profileImage",
      dataURItoBlob(croppedData),
      "profileImage.png"
    );

    // TODO: Will the port be a problem when deploying to Heroku?

    fetch("http://localhost:3001/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: croppedData }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error uploading file");
        }
        // Handle success, e.g., redirect to another page
        window.location.href = "/success";
      })
      .catch((error) => {
        console.error(error);
        // Handle error, e.g., show an error message to the user
      });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: false,
    name: "profileImage", // TODO: Is this necessary?
  });

  // Function to convert data URL to Blob
  function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: "image/png" });
  }

  // TODO: Add the option to have the profile picture as the background to the upload area
  return (
    <div>
      {!uploadedImage && (
        <div
          {...getRootProps()}
          className={`upload-area-jg ${isDragActive ? "drag-active" : ""}}`}
        >
          <input {...getInputProps()} />
          <>
            <span className="material-symbols-outlined">upload_file</span>
            {isDragActive ? (
              <p>Drop your image here...</p>
            ) : (
              <p>Click or drag file here</p>
            )}
          </>
        </div>
      )}
      {uploadedImage && (
        <>
          <div className="crop-area-jg">
            <Cropper
              src={imagePreview}
              dragMode="move"
              aspectRatio={1}
              guides={false}
              center={false}
              cropBoxMovable={false}
              cropBoxResizable={false}
              viewMode={1}
              background={false}
              style={{ width: "100%", height: "100%" }}
              responsive={true}
              autoCropArea={1}
              checkCrossOrigin={false}
              onInitialized={(instance) => {
                setCropper(instance);
              }}
            />
            <section>
              <p>Zoom or move picture to fit the circle.</p>
            </section>
            <button onClick={handleCrop}>Crop Image</button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfilePictureUpload;
