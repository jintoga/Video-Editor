import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Download } from "lucide-react"; // Using Lucide icons

export function HomePage() {
    const [dragActive, setDragActive] = useState(false);
    const navigate = useNavigate();

    const handleFileUpload = (file) => {
        if (file) {
            const videoUrl = URL.createObjectURL(file);
            const fileName = file.name; // Get file name
            navigate("/editor", { state: { videoUrl, fileName } });
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = () => {
        setDragActive(false);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setDragActive(false);
        if (event.dataTransfer.files.length > 0) {
            handleFileUpload(event.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (event) => {
        if (event.target.files.length > 0) {
            handleFileUpload(event.target.files[0]);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen w-full bg-white">
            <div className="flex flex-col items-center text-center">
                {/* Title */}
                <h1 className="text-5xl font-extrabold text-black">Trim Video</h1>
                <p className="text-lg text-gray-600 mt-2">Trim or cut video of any format</p>

                {/* File Upload Button */}
                <label className="mt-6 flex items-center justify-center w-64 bg-[#2563eb] hover:bg-[#1e4bb8] py-4 px-8 rounded-lg text-lg cursor-pointer shadow-md transition-all duration-200 relative">
                    <span className="flex-1 text-center text-white font-semibold">Open file</span>
                    <ChevronDown className="w-5 h-5 ml-2 text-white" />
                    <input type="file" accept="video/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} />
                </label>




                {/* Drag & Drop Area */}
                <div
                    className={`mt-6 flex flex-col items-center text-gray-500 ${dragActive ? "text-blue-500" : "text-gray-400"
                        }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <Download className="w-6 h-6 mb-1" />
                    <p className="text-sm">or drop file here</p>
                </div>
            </div>
        </div>
    );
}
