import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

import AuthService from "../../utils/auth.js";

const ProfilePictureUpload = () => {
  const userProfile = AuthService.getProfile();
  const username = userProfile?.data?.username || "";

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

  const handleCrop = async () => {
    if (!cropper) {
      return;
    }
  
    try {
      // Get the cropped data as a Blob
      const croppedBlob = await new Promise((resolve) => {
        cropper.getCroppedCanvas().toBlob((blob) => {
          resolve(blob);
        });
      });
  
      // Create an S3 instance
      const s3 = new AWS.S3();
  
      // Set the bucket name and key (path) for the object
      const bucketName = "juggler-app-bucket";
      // TODO: Do I need to adapt to the file extension?
      const key = `${username}/profilePicture.png`;
  
      // Upload the Blob to S3
      await s3
        .upload({
          Bucket: bucketName,
          Key: key,
          Body: croppedBlob,
          ContentType: "image/png",
          ACL: "public-read", // Adjust ACL as needed
        })
        .promise();
  
      // Handle success, e.g., redirect to another page
      window.location.href = "/success";
    } catch (error) {
      console.error(error);
      // Handle error, e.g., show an error message to the user
    }
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
