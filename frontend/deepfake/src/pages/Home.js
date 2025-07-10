import React, { useContext, useEffect, useRef, useState } from "react";
import { ShieldCheck, Video, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import hostContext from "../context/HostContext";
const HomePage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([])
  const [previewVideoURL, setPreviewVideoURL] = useState(null);

  const context = useContext(hostContext)
  const { host } = context
  const authToken = localStorage.getItem("Authtoken")
  useEffect(() => {
    if (!localStorage.getItem("Authtoken")) {
      navigate("/login");
    }
    handelHistory();

  }, []);

  const handleLogout = () => {
    localStorage.removeItem("Authtoken");
    navigate("/login");
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };


  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      toast.error("Please select a valid video file.");
      return;
    }
 const localVideoURL = URL.createObjectURL(file);
  setPreviewVideoURL(localVideoURL); // This sets the preview
    try {
      setLoading(true);
      setPrediction(null);

      const formData = new FormData();
      formData.append("video", file);

      const response = await axios.post(`${host}api/video/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          'Authorization': `Bearer ${authToken}`
        },
      });

      if (response.data) {
       setPrediction({
  label: response.data.label,
  confidence: response.data.confidence,
  score: response.data.score,
  video: response.data.video
});
        console.log(response.data)
        toast.success("Prediction received!");
      } else {
        toast.error("No response from server.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error uploading video or processing prediction.");
    } finally {
      setLoading(false);
    }
  };

  const handelHistory = async () => {
    try {
      const response = await axios.get(`${host}api/video/history`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      })
      if (response.data && response.data.length > 0) {
        const history = response.data.map(item => ({
          label: item.result,
          confidence: item.confidence,
          videoPath: item.videoPath,
          uploadedAt: new Date(item.uploadedAt).toLocaleString()
        }));
        setHistory(history);
        console.log(history)
      } else {
        toast.info("No history found")
      }
    } catch (error) {
      console.error("Error fetching history: ", error)

    }

  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 text-white">
      <ToastContainer position="top-right" />

      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 bg-opacity-20 bg-black backdrop-blur-md">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ShieldCheck className="w-6 h-6" />
          Deepfake Detector
        </h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full hover:bg-gray-200 transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col justify-center items-center text-center px-4 py-20">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
          Detect Deepfakes Instantly
        </h2>
        <p className="text-lg md:text-xl text-white/90 max-w-2xl mb-8">
          Our AI-powered tool analyzes your video and tells you whether it's real or fake using advanced deep learning models.
        </p>

        {/* Upload Video Button */}
        <button
          onClick={handleUploadClick}
          disabled={loading}
          className="bg-white text-indigo-600 font-semibold px-6 py-3 rounded-full shadow-lg hover:scale-105 transition disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Upload Video"}
          <Video className="inline ml-2" />
        </button>

        {/* Hidden Input */}
        <input
          type="file"
          accept="video/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />{previewVideoURL && (
  <div className="mt-8">
    <h3 className="text-xl font-semibold mb-2">Uploaded Video Preview</h3>
    <video
      src={previewVideoURL}
      controls
      autoPlay
      className="w-full max-w-xl rounded-xl shadow"
    />
    {loading && (
      <p className="text-white mt-2 animate-pulse text-center">
        Analyzing video, please wait...
      </p>
    )}
  </div>
)}

        {/* Prediction Output */}
        {prediction && (
          <div className="mt-8 bg-white/10 p-6 rounded-xl shadow-lg max-w-lg w-full">
            <h3 className="text-2xl font-bold mb-2">Prediction Result</h3>
            <p className="text-xl">
              Status:{" "}
              <span className={`font-bold ${prediction.label === "Real" ? "text-green-400" : "text-red-400"}`}>
                {prediction.label}
              </span>
            </p>
            <p className="text-lg text-white/80">
              Confidence: {prediction.confidence}%
            </p>
          </div>
        )}
      </section>

      {/* How It Works */}
      <section className="px-4 py-12 bg-white text-black rounded-t-3xl">
        <div className="max-w-5xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-6">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 border rounded-xl shadow hover:shadow-xl transition">
              <h4 className="text-lg font-semibold mb-2">Upload Video</h4>
              <p className="text-gray-700 text-sm">
                Upload any video and our model will analyze frame by frame.
              </p>
            </div>
            <div className="p-4 border rounded-xl shadow hover:shadow-xl transition">
              <h4 className="text-lg font-semibold mb-2">AI Analysis</h4>
              <p className="text-gray-700 text-sm">
                Our AI checks facial movements, blinking, and more.
              </p>
            </div>
            <div className="p-4 border rounded-xl shadow hover:shadow-xl transition">
              <h4 className="text-lg font-semibold mb-2">See Results</h4>
              <p className="text-gray-700 text-sm">
                Get a prediction with probability of real or fake video.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
