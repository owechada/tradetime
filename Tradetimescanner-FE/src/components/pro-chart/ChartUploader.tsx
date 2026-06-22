import React, { useRef, useState } from "react";
import { FaCamera, FaImage, FaFileAlt, FaTimes, FaCloudUploadAlt } from "react-icons/fa";

interface ChartUploaderProps {
    onFileSelect: (file: File | null) => void;
    selectedFile: File | null;
}

export const ChartUploader: React.FC<ChartUploaderProps> = ({ onFileSelect, selectedFile }) => {
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onFileSelect(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const clearSelection = () => {
        onFileSelect(null);
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        if (cameraInputRef.current) cameraInputRef.current.value = "";
    };

    const triggerGallery = () => fileInputRef.current?.click();
    const triggerCamera = () => cameraInputRef.current?.click();

    return (
        <div className="w-full">
            <div className="flex flex-col items-center justify-center w-full">
                {!selectedFile ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                        <button
                            onClick={triggerCamera}
                            className="flex flex-col items-center justify-center p-6 bg-white/70 backdrop-blur-md border-2 border-dashed border-primary/30 rounded-2xl hover:border-primary/60 hover:bg-primary/5 transition-all group"
                        >
                            <div className="p-4 bg-primary/10 rounded-full mb-3 group-hover:scale-110 transition-transform">
                                <FaCamera className="text-primary text-2xl" />
                            </div>
                            <span className="font-bold text-gray-800">Camera</span>
                            <p className="text-xs text-gray-500 mt-1">Capture chart directly</p>
                        </button>

                        <button
                            onClick={triggerGallery}
                            className="flex flex-col items-center justify-center p-6 bg-white/70 backdrop-blur-md border-2 border-dashed border-blue-400/30 rounded-2xl hover:border-blue-400/60 hover:bg-blue-400/5 transition-all group"
                        >
                            <div className="p-4 bg-blue-100 rounded-full mb-3 group-hover:scale-110 transition-transform">
                                <FaImage className="text-blue-500 text-2xl" />
                            </div>
                            <span className="font-bold text-gray-800">Gallery / Files</span>
                            <p className="text-xs text-gray-500 mt-1">PNG, JPG, PDF</p>
                        </button>
                    </div>
                ) : (
                    <div className="relative w-full rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-lg">
                        {preview && !selectedFile.name.endsWith(".pdf") ? (
                            <img src={preview} alt="Preview" className="w-full h-auto max-h-[300px] object-contain" />
                        ) : (
                            <div className="flex flex-col items-center justify-center p-10 bg-gray-50">
                                <FaFileAlt className="text-gray-400 text-5xl mb-4" />
                                <p className="text-sm font-medium text-gray-700">{selectedFile.name}</p>
                                <p className="text-xs text-gray-500">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                            </div>
                        )}
                        <button
                            onClick={clearSelection}
                            className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
                        >
                            <FaTimes size={16} />
                        </button>
                    </div>
                )}
            </div>

            {/* Hidden Inputs */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*,application/pdf"
                className="hidden"
            />
            <input
                type="file"
                ref={cameraInputRef}
                onChange={handleFileChange}
                accept="image/*"
                capture="environment"
                className="hidden"
            />
        </div>
    );
};
