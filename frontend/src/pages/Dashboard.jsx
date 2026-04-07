import React, { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import FileCard from '../components/FileCard';
import UploadModal from '../components/UploadModal';
import { Plus, Loader2 } from 'lucide-react';

const Dashboard = () => {
    const { user, loading: authLoading } = useContext(AuthContext);
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isUploadOpen, setIsUploadOpen] = useState(false);

    const fetchFiles = async () => {
        try {
            const { data } = await api.get('/files');
            setFiles(data);
        } catch (error) {
            console.error('Error fetching files:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchFiles();
        }
    }, [user]);

    if (authLoading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const handleDelete = async (id) => {
        try {
            await api.delete(`/files/${id}`);
            setFiles(files.filter((file) => file._id !== id));
        } catch (error) {
            console.error('Error deleting file:', error);
            alert('Failed to delete file');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Files</h1>
                <button
                    onClick={() => setIsUploadOpen(true)}
                    className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition shadow-sm"
                >
                    <Plus className="w-5 h-5" />
                    <span>Upload File</span>
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                </div>
            ) : files.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                    <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Plus className="w-10 h-10 text-primary-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No files uploaded yet</h3>
                    <p className="text-gray-500">Get started by uploading your first file.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {files.map((file) => (
                        <FileCard key={file._id} file={file} onDelete={handleDelete} />
                    ))}
                </div>
            )}

            {isUploadOpen && (
                <UploadModal
                    onClose={() => setIsUploadOpen(false)}
                    onUploadSuccess={(newFile) => {
                        setFiles([newFile, ...files]);
                        setIsUploadOpen(false);
                    }}
                />
            )}
        </div>
    );
};

export default Dashboard;
