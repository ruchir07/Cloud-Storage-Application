import React from 'react';
import { Download, Trash2, File as FileIcon, FileText, Image as ImageIcon, FileArchive, Film } from 'lucide-react';

const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

const FileCard = ({ file, onDelete }) => {
    const isImage = file.format.startsWith('image/');
    
    let Icon = FileIcon;
    if (isImage) Icon = ImageIcon;
    else if (file.format.startsWith('video/')) Icon = Film;
    else if (file.format.includes('pdf') || file.format.includes('document') || file.format.includes('text')) Icon = FileText;
    else if (file.format.includes('zip') || file.format.includes('compressed')) Icon = FileArchive;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group">
            <div className="aspect-video w-full bg-gray-50 flex items-center justify-center relative overflow-hidden">
                {isImage ? (
                    <img src={file.url} alt={file.originalName} className="object-cover w-full h-full" loading="lazy" />
                ) : (
                    <Icon className="w-16 h-16 text-primary-300" />
                )}
                
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center space-x-4 backdrop-blur-sm">
                    <a
                        href={file.url}
                        target="_blank"
                        rel="noreferrer"
                        download={file.originalName}
                        className="bg-white/20 p-2 rounded-full hover:bg-white/40 text-white transition"
                        title="View / Download"
                    >
                        <Download className="w-5 h-5" />
                    </a>
                    <button
                        onClick={() => onDelete(file._id)}
                        className="bg-red-500/80 p-2 rounded-full hover:bg-red-500 text-white transition"
                        title="Delete"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>
            
            <div className="p-4">
                <p className="font-medium text-gray-900 truncate" title={file.originalName}>
                    {file.originalName}
                </p>
                <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                    <span>{formatBytes(file.size)}</span>
                    <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
        </div>
    );
};

export default FileCard;
