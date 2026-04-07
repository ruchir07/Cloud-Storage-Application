import React, { useState, useRef } from 'react';
import api from '../services/api';
import { X, UploadCloud, Loader2 } from 'lucide-react';

const UploadModal = ({ onClose, onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError('');
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a file first.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setIsUploading(true);
        setError('');

        try {
            const { data } = await api.post('/files/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            onUploadSuccess(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Error uploading file.');
            setIsUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative">
                <div className="flex justify-between items-center p-6 border-b">
                    <h3 className="text-xl font-bold text-gray-900">Upload File</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    {error && (
                        <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-3 rounded-md text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {!file ? (
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition group"
                        >
                            <UploadCloud className="w-12 h-12 text-primary-400 group-hover:text-primary-500 mb-4 transition" />
                            <p className="text-sm font-medium text-gray-700 text-center">
                                Click to browse or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                Any file type supported
                            </p>
                        </div>
                    ) : (
                        <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 flex items-center justify-between">
                            <div className="overflow-hidden">
                                <p className="text-sm font-medium text-gray-900 truncate pr-4">{file.name}</p>
                                <p className="text-xs text-gray-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            <button onClick={() => setFile(null)} className="text-gray-400 hover:text-red-500 p-1">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    <input
                        type="file"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />

                    <div className="mt-8 flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition"
                            disabled={isUploading}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleUpload}
                            disabled={!file || isUploading}
                            className="flex items-center space-x-2 px-6 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 focus:ring-4 focus:ring-primary-100 transition disabled:opacity-50 shadow-sm"
                        >
                            {isUploading && <Loader2 className="w-4 h-4 animate-spin" />}
                            <span>{isUploading ? 'Uploading...' : 'Upload'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadModal;
