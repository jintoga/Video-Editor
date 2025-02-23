import { useRef, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Play, Pause } from "lucide-react";

export function EditorPage() {
    const location = useLocation();
    const fileName = location.state?.fileName || "Untitled Video";
    const videoUrl = location.state?.videoUrl;

    const videoRef = useRef(null);
    const hiddenVideoRef = useRef(null); // Hidden video for thumbnails
    const canvasRef = useRef(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [thumbnails, setThumbnails] = useState([]);
    const [loadingThumbnails, setLoadingThumbnails] = useState([]);

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            video.addEventListener("timeupdate", handleTimeUpdate);
            video.addEventListener("loadedmetadata", handleMetadataLoaded);
        }
        return () => {
            if (video) {
                video.removeEventListener("timeupdate", handleTimeUpdate);
                video.removeEventListener("loadedmetadata", handleMetadataLoaded);
            }
        };
    }, []);

    const handleMetadataLoaded = () => {
        setDuration(videoRef.current.duration);
        generateThumbnails();
    };

    const handleTimeUpdate = () => {
        setProgress(videoRef.current.currentTime);
    };

    const handleSeek = (e) => {
        const newTime = parseFloat(e.target.value);
        videoRef.current.currentTime = newTime;
        setProgress(newTime);
    };

    const togglePlay = () => {
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const generateThumbnails = async () => {
        const video = hiddenVideoRef.current; // Use the hidden video
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        if (!video) return;

        const numFrames = 20;
        const interval = video.duration / numFrames;
        setLoadingThumbnails(new Array(numFrames).fill(true));
        setThumbnails([]); // Reset thumbnails

        // Set canvas size to match video aspect ratio
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        for (let i = 0; i < numFrames; i++) {
            const time = i * interval;

            await new Promise((resolve) => {
                const handleSeeked = () => {
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const thumbnail = canvas.toDataURL("image/jpeg");

                    setThumbnails((prev) => [...prev, { time, src: thumbnail }]);

                    setLoadingThumbnails((prev) => {
                        const updated = [...prev];
                        updated[i] = false;
                        return updated;
                    });

                    video.removeEventListener("seeked", handleSeeked);
                    resolve();
                };

                video.addEventListener("seeked", handleSeeked);
                video.currentTime = time; // Seek the hidden video
            });
        }
    };

    return (
        <div className="flex flex-col items-center w-full h-screen bg-gradient-to-b from-[#0F396A] to-[#0A2B52] p-4">
            <h2 className="text-lg text-white font-semibold mb-4">{fileName}</h2>

            {videoUrl ? (
                <div className="relative w-full max-w-4xl mt-6">
                    <div className="relative w-full max-w-4xl flex justify-center">
                        {/* Main Video Player */}
                        <video ref={videoRef} src={videoUrl} className="w-[640px] rounded-lg" />

                        {/* Hidden Video for Thumbnail Generation */}
                        <video ref={hiddenVideoRef} src={videoUrl} className="hidden" />

                        {/* Canvas for capturing frames */}
                        <canvas ref={canvasRef} width={160} height={90} className="hidden"></canvas>
                    </div>
                </div>
            ) : (
                <p className="text-red-500 text-lg">No video loaded</p>
            )}

            {/* Thumbnails and Progress Bar */}
            <div className="relative w-full mt-4 flex items-center overflow-hidden min-h-[48px]">
                <input
                    type="range"
                    min="0"
                    max={duration}
                    step="1"
                    value={progress}
                    onChange={handleSeek}
                    className="w-full z-10 opacity-0 absolute h-full cursor-pointer"
                />
                <div className="flex w-full">
                    {thumbnails.map((thumb, index) => (
                        <div key={index} className="flex-1 h-12 relative">
                            {loadingThumbnails[index] && (
                                <div className="absolute top-0 left-0 w-full h-full bg-gray-700 flex items-center justify-center">
                                    <div className="w-8 h-1 bg-white animate-pulse"></div>
                                </div>
                            )}
                            <img
                                src={thumb.src}
                                alt={`Frame ${index}`}
                                className="w-full h-12 cursor-pointer hover:opacity-80 object-cover"
                                onClick={() => (videoRef.current.currentTime = thumb.time)}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Play/Pause Button */}
            <div className="w-full flex justify-start mt-6 pl-4">
                <button
                    onClick={togglePlay}
                    className="bg-black/50 rounded-lg w-24 h-12 flex items-center justify-center">
                    {isPlaying ? <Pause size={20} className="text-white" /> : <Play size={20} className="text-white" />}
                </button>
            </div>
        </div>
    );
}
