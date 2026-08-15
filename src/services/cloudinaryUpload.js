import {
  CLOUDINARY_UPLOAD_PRESET,
  CLOUDINARY_UPLOAD_URL,
} from "../config/cloudinary";

const ERRORS = {
  failed: "Image upload failed. Please try again.",
  invalid: "Please select a valid image file.",
  noUrl: "Cloudinary did not return an image URL.",
};

function parseCloudinaryResponse(xhr) {
  let data;

  try {
    data = JSON.parse(xhr.responseText);
  } catch {
    throw new Error(ERRORS.failed);
  }

  if (xhr.status < 200 || xhr.status >= 300) {
    throw new Error(
      data?.error?.message || ERRORS.failed,
    );
  }

  if (!data.secure_url) {
    throw new Error(ERRORS.noUrl);
  }

  return data.secure_url;
}

export function uploadImageToCloudinaryWithProgress(file, onProgress) {
  if (!file?.type?.startsWith("image/")) {
    return Promise.reject(
      new Error(ERRORS.invalid),
    );
  }

  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", CLOUDINARY_UPLOAD_URL);

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable || typeof onProgress !== "function") return;
      onProgress(Math.min(100, Math.round((event.loaded / event.total) * 100)));
    };

    xhr.onload = () => {
      try {
        resolve(parseCloudinaryResponse(xhr));
      } catch (error) {
        reject(error);
      }
    };

    xhr.onerror = () => {
      reject(new Error(ERRORS.failed));
    };

    xhr.send(formData);
  });
}

export async function uploadImageToCloudinary(file) {
  return uploadImageToCloudinaryWithProgress(file);
}
