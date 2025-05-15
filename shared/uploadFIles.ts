import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

interface UploadFile {
    file: File;
    id: string;
    progress: number;
    size: string;
}

interface UseFileUploadProps {
    accept: { [key: string]: string[] };
    maxSize: number;
    minFiles?: number;
    maxFiles?: number;
}

export const useFileUpload = ({ accept, maxSize, minFiles = 1, maxFiles }: UseFileUploadProps) => {
    const [files, setFiles] = useState<UploadFile[]>([]);
    const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
    const [uploadError, setUploadError] = useState<{ [key: string]: boolean }>({});
    const [uploading, setUploading] = useState(false);
    const [alreadyMinFiles, setAlreadyMinFiles] = useState(false);

    const formatFileSize = (size: number) => {
        return size >= 1000000
            ? `${(size / 1000000).toFixed(2)} MB`
            : `${(size / 1000).toFixed(2)} KB`;
    };

    const onDrop = (acceptedFiles: File[]) => {
        const newFiles = acceptedFiles.map((file) => ({
            file,
            id: Math.random().toString(36).substring(7),
            progress: 0,
            size: formatFileSize(file.size),
        }));

        setFiles((prevFiles) => {
            // Se maxFiles estiver definido, limita o número de arquivos
            if (maxFiles) {
                return [...prevFiles, ...newFiles].slice(0, maxFiles);  // Limita o número de arquivos
            }
            return [...prevFiles, ...newFiles];
        });
  
        setUploading(true);
        newFiles.forEach(uploadFile);
    };

    const retryUpload = (fileObj: UploadFile) => {
        setUploadError((prevErrors) => {
            const { [fileObj.id]: removed, ...rest } = prevErrors;
            return rest;
        });
        uploadFile(fileObj);
    };

    const retryAllFailedUploads = () => {
        files.forEach((file) => {
            if (uploadError[file.id]) {
                retryUpload(file);
            }
        });
    };

    const removeFile = (id: string) => {
        setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
        setUploadProgress((prevProgress) => {
            const { [id]: removed, ...rest } = prevProgress;
            return rest;
        });
    };

    const uploadFile = (fileObj: UploadFile) => {
        const formData = new FormData();
        formData.append('file', fileObj.file);
    
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/upload', true); // Substitua '/upload' com o endpoint real
    
        let fakeProgress = 0;
        const totalDuration = 800; // Ajuste para 800 milissegundos
    
        const simulateProgress = () => {
            if (fakeProgress < 90) {
                fakeProgress += 5; // Aumenta a taxa de incremento para chegar rapidamente a 90%
                setUploadProgress((prevProgress) => ({
                    ...prevProgress,
                    [fileObj.id]: fakeProgress,
                }));
            }
        };
    
        const progressInterval = setInterval(simulateProgress, totalDuration / 18); // 18 passos de 5%
    
        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const realProgress = Math.round((event.loaded * 100) / event.total);
                if (realProgress >= 90) {
                    clearInterval(progressInterval);
                }
                setUploadProgress((prevProgress) => ({
                    ...prevProgress,
                    [fileObj.id]: Math.max(fakeProgress, realProgress),
                }));
            }
        };
    
        xhr.onload = () => {
            clearInterval(progressInterval);
            if (xhr.status === 200) {
                setUploadProgress((prevProgress) => ({
                    ...prevProgress,
                    [fileObj.id]: 100,
                }));
                setUploading(false);
            } else {
                setUploadError((prevErrors) => ({
                    ...prevErrors,
                    [fileObj.id]: true,
                }));
            }
        };
    
        xhr.onerror = () => {
            clearInterval(progressInterval);
            setUploadError((prevErrors) => ({
                ...prevErrors,
                [fileObj.id]: true,
            }));
        };
    
        setTimeout(() => {
            xhr.send(formData);
        }, totalDuration);
    };    

    useEffect(() => {
        setAlreadyMinFiles(files.length >= minFiles);
    }, [files, minFiles]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept,
        maxSize,
    });

    return {
        files,
        uploadProgress,
        uploadError,
        uploading,
        alreadyMinFiles,
        getRootProps,
        getInputProps,
        retryUpload,
        retryAllFailedUploads,
        removeFile,
    };
};
