import React, { useState } from 'react';
import axios from 'axios';

interface FileUploaderProps {
  onUploadSuccess: (urls: string[]) => void;
}

interface FileUploadProgress {
  file: File;
  progress: number;
  status: string;
  loadedBytes: number;
  totalBytes: number;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onUploadSuccess }) => {
  const [filesProgress, setFilesProgress] = useState<FileUploadProgress[]>([]);

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post('https://api.escuelajs.co/api/v1/files/upload', formData, {
        onUploadProgress: (progressEvent) => {
          const loaded = progressEvent.loaded ?? 0;
          const total = progressEvent.total ?? 0;
          const percent = (loaded / total) * 100;

          setFilesProgress((prevProgress) =>
            prevProgress.map((fileProgress) =>
              fileProgress.file === file
                ? {
                    ...fileProgress,
                    progress: Math.round(percent),
                    status: `${Math.round(percent)}% uploaded...`,
                    loadedBytes: loaded,
                    totalBytes: total,
                  }
                : fileProgress
            )
          );
        }
      });

      const fileUrl = response.data.location; // Adjust based on your API response
      setFilesProgress((prevProgress) =>
        prevProgress.map((fileProgress) =>
          fileProgress.file === file
            ? { ...fileProgress, status: "Upload successful!", progress: 100 }
            : fileProgress
        )
      );
      onUploadSuccess(fileUrl);
    } catch (error) {
      setFilesProgress((prevProgress) =>
        prevProgress.map((fileProgress) =>
          fileProgress.file === file ? { ...fileProgress, status: "Upload failed!" } : fileProgress
        )
      );
      console.error(error);
    }
  };

  const handleFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    const initialFilesProgress = selectedFiles.map((file) => ({
      file,
      progress: 0,
      status: '',
      loadedBytes: 0,
      totalBytes: 0,
    }));
    setFilesProgress(initialFilesProgress);
    selectedFiles.forEach(uploadFile);
  };

  return (
    <div className="flex flex-col items-center mt-8 space-y-4">
      <input type="file" name="files" multiple onChange={handleFilesChange} className="border p-2" />
      {filesProgress.map((fileProgress, index) => (
        <div key={index} className="w-full mt-4">
          <label className="block">
            {fileProgress.file.name} progress: <progress value={fileProgress.progress} max="100" className="w-full" />
          </label>
          <p>{fileProgress.status}</p>
          <p>Uploaded {fileProgress.loadedBytes} bytes of {fileProgress.totalBytes}</p>
        </div>
      ))}
    </div>
  );
};

export default FileUploader;
