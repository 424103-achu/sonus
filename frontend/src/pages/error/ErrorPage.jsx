import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import Button from "../../components/button";
import "../../index.css";

export default function ErrorPage({ 
  errorCode = "404", 
  title = "Page Not Found", 
  message = "Sorry, the page you're looking for doesn't exist.",
  showHomeButton = true 
}) {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen flex flex-col bg-[#0b0b0d] text-white relative overflow-hidden">
      
      {/* Decorative Background */}
      <div className="absolute -top-[20%] -left-[20%] w-[60%] h-[60%] bg-red-600/20 blur-[25vw] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[50%] h-[50%] bg-red-700/10 blur-[20vw] pointer-events-none" />

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 relative z-10">
        
        {/* Error Icon */}
        <div className="mb-8">
          <AlertCircle className="w-24 h-24 text-red-500 animate-pulse" />
        </div>

        {/* Error Code */}
        <h1 className="text-7xl md:text-8xl font-bold text-red-500 mb-4">
          {errorCode}
        </h1>

        {/* Error Title */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          {title}
        </h2>

        {/* Error Message */}
        <p className="text-lg text-zinc-400 text-center max-w-md mb-8">
          {message}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 w-full max-w-md">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 px-6 py-3 rounded-lg border border-white/20 hover:border-white/40 text-white font-semibold transition-colors"
          >
            Go Back
          </button>
          
          {showHomeButton && (
            <button
              onClick={() => navigate("/")}
              className="flex-1 px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors"
            >
              Go Home
            </button>
          )}
        </div>

        {/* Decorative text */}
        <div className="mt-12 text-center">
          <p className="text-sm text-zinc-500">
            If you believe this is a mistake, please contact support.
          </p>
        </div>
      </div>
    </div>
  );
}
