import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "../auth_pages/components/Footer";
import { storiesData } from "../../data/stories";
import { X, FileText, Eye } from "lucide-react";
import {
  getHomeVisibility,
  getUserResume,
  getUserResumePreviewUrl,
} from "../../services/userService";

function HomeViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [meta, setMeta] = useState(null);
  const [resume, setResume] = useState(null);
  const [showResumePreview, setShowResumePreview] = useState(false);
  const [resumePreviewUrl, setResumePreviewUrl] = useState(null);
  const [resumePreviewLoading, setResumePreviewLoading] = useState(false);
  const [resumeNotice, setResumeNotice] = useState("");

  useEffect(() => {
    if (!showResumePreview) {
      return;
    }

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowResumePreview(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showResumePreview]);

  useEffect(() => {
    const load = async () => {
      try {
        const visibility = await getHomeVisibility(id);
        setMeta(visibility);

        if (visibility.visibleCards.includes("resume")) {
          const resumeData = await getUserResume(id);
          setResume(resumeData);
        }
      } catch (err) {
        console.error("Failed to load view homepage:", err);
      }
    };

    load();
  }, [id]);

  const visibleStories = useMemo(() => {
    if (!meta?.visibleCards) {
      return [];
    }

    return storiesData.filter((story) => meta.visibleCards.includes(story.id));
  }, [meta]);

  const sections = [
    { key: "education", label: "Education", grid: "md:grid-cols-2" },
    { key: "social", label: "Social", grid: "md:grid-cols-3" },
    { key: "highlights", label: "Highlights", grid: "md:grid-cols-3" },
  ];

  const getItems = (key) => {
    if (key === "highlights") {
      return visibleStories.filter((s) => !s.category);
    }

    return visibleStories.filter((s) => s.category === key);
  };

  const displayName =
    meta?.user?.first_name?.trim() || meta?.user?.username || "Profile";

  const handleToggleResumePreview = async () => {
    if (!resume) {
      setResumeNotice("Resume not added.");
      return;
    }

    if (!showResumePreview && !resumePreviewUrl) {
      setResumePreviewLoading(true);
      setResumeNotice("");

      try {
        const signedUrl = await getUserResumePreviewUrl(id);
        setResumePreviewUrl(signedUrl);
      } catch (err) {
        const message = err?.response?.data?.message || "Failed to load resume preview.";
        setResumeNotice(message);
        setResumePreviewLoading(false);
        return;
      }

      setResumePreviewLoading(false);
    }

    setShowResumePreview((prev) => !prev);
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col text-white overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-black via-[#0b0b0d] to-black"></div>
      <div className="absolute -top-40 -left-40 w-125 h-125 bg-red-600/10 blur-[160px] rounded-full"></div>
      <div className="absolute top-[40%] -right-40 w-125 h-125 bg-red-500/10 blur-[160px] rounded-full"></div>

      <Navbar />

      <header className="text-center pt-32 pb-16 px-4">
        <h1 className="text-5xl font-bold mb-4">
          <span className="bg-red-600 px-6 py-2 rounded-lg">{displayName}</span>
        </h1>
      </header>

      <main className="flex-1 px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          {meta?.visibleCards?.includes("resume") && (
            <section className="mb-10 border border-white/10 bg-white/5 rounded-xl p-6">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <FileText size={20} />
                  Resume
                </h2>
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleToggleResumePreview}
                  disabled={!resume || resumePreviewLoading}
                  className="px-5 py-2 rounded-md bg-red-600 hover:bg-red-700 ring-2 ring-red-300/60 shadow-[0_0_24px_rgba(239,68,68,0.45)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Eye size={16} />
                  {resumePreviewLoading
                    ? "Loading..."
                    : showResumePreview
                      ? "Hide Resume"
                      : "Show Resume"}
                </button>
              </div>

              {resumeNotice && (
                <div className="mt-4 text-sm rounded-md px-3 py-2 border border-red-500/40 text-red-300 bg-red-500/10">
                  {resumeNotice}
                </div>
              )}
            </section>
          )}

          {sections.map((section) => {
            const items = getItems(section.key);

            if (!items.length) {
              return null;
            }

            return (
              <section key={section.key} className="mb-14">
                <h2 className="text-2xl font-bold mb-6">{section.label}</h2>

                <div className={`grid grid-cols-1 ${section.grid} gap-6`}>
                  {items.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => navigate(`/story/${id}/${item.id}`)}
                      className="relative rounded-lg overflow-hidden cursor-pointer transform transition duration-300 hover:-translate-y-2 hover:shadow-2xl hover:ring-2 hover:ring-red-600 group"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-56 object-cover transition duration-500 group-hover:scale-110"
                      />

                      <div className="absolute inset-0 bg-black/45 group-hover:bg-black/70 transition duration-300"></div>

                      <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-6 group-hover:translate-y-0 transition duration-300">
                        <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                        <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition duration-300">
                          {item.summary}
                        </p>
                        <small className="text-gray-400 opacity-0 group-hover:opacity-100 transition duration-500">
                          {item.detail}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </main>

      {resume && showResumePreview && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-6xl h-[88vh] bg-[#0b0b0d] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
            <div className="h-14 px-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                <FileText size={18} />
                Resume Preview
              </h3>

              <button
                type="button"
                onClick={() => setShowResumePreview(false)}
                className="p-2 rounded-md border border-white/20 hover:bg-white/10 transition"
                aria-label="Close preview"
              >
                <X size={18} />
              </button>
            </div>

            {resumePreviewLoading && (
              <div className="w-full h-[calc(88vh-56px)] bg-black flex items-center justify-center text-gray-300">
                Loading preview...
              </div>
            )}

            {!resumePreviewLoading && resumePreviewUrl && (
              <iframe
                src={resumePreviewUrl}
                title="Resume Preview"
                className="w-full h-[calc(88vh-56px)] bg-black"
              />
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default HomeViewPage;