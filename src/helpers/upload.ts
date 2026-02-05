const uploadFileToS3 = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to upload file");
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw error;
  }
};

export default uploadFileToS3;
