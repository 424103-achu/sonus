import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "../auth_pages/components/Footer";
import { useAuth } from "../../hooks/useAuth";
import { storiesData } from "../../data/stories";

function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const stories = storiesData;

  const sections = [
    { key: "education", label: "Education", grid: "md:grid-cols-2" },
    { key: "social", label: "Social", grid: "md:grid-cols-3" },
    { key: "highlights", label: "Highlights", grid: "md:grid-cols-3" },
  ];

  const getItems = (key) => {
    if (key === "highlights") {
      return stories.filter((s) => !s.category);
    }
    return stories.filter((s) => s.category === key);
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col text-white overflow-hidden">

      <div className="absolute inset-0 -z-10 bg-linear-to-b from-black via-[#0b0b0d] to-black"></div>

      <div className="absolute -top-40 -left-40 w-125 h-125 bg-red-600/10 blur-[160px] rounded-full"></div>
      <div className="absolute top-[40%] -right-40 w-125 h-125 bg-red-500/10 blur-[160px] rounded-full"></div>

      <Navbar />

      <header className="text-center pt-32 pb-24 px-4">

        <h1 className="text-5xl font-bold mb-10">
          <span className="bg-red-600 px-6 py-2 rounded-lg">
          {user?.first_name || user?.username || "User"}
          </span>
        </h1>

        <button
          onClick={() =>
            document
              .getElementById("story")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-md font-semibold transition"
        >
          Explore Windows
        </button>

      </header>

      <main id="story" className="flex-1 px-6 pb-16">

        <div className="max-w-6xl mx-auto">

          {sections.map((section) => {
            const items = getItems(section.key);
            if (!items.length) return null;

            return (
              <section key={section.key} className="mb-16">

                <h2 className="text-2xl font-bold mb-6">
                  {section.label}
                </h2>

                <div className={`grid grid-cols-1 ${section.grid} gap-6`}>

                  {items.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => user?.user_id && navigate(`/story/${user.user_id}/${item.id}`)}
                      className="relative rounded-lg overflow-hidden cursor-pointer transform transition duration-300 hover:-translate-y-2 hover:shadow-2xl hover:ring-2 hover:ring-red-600 group"
                    >

                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-56 object-cover transition duration-500 group-hover:scale-110"
                      />

                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/70 transition duration-300"></div>

                      <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-6 group-hover:translate-y-0 transition duration-300">

                        <h3 className="text-lg font-semibold mb-1">
                          {item.title}
                        </h3>

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

      <Footer />

    </div>
  );
}

export default Home;
