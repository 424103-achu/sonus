import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "../auth_pages/components/Footer";
import { useAuth } from "../../hooks/useAuth";
import { searchUsers } from "../../services/userService";

function Home() {
  const { user } = useAuth();
  const [stories, setStories] = useState([]);
  const navigate = useNavigate();
  

  useEffect(() => {

    const mockDB = [

      {
        id: "school",
        title: "School",
        category: "education",
        summary: "A place where I learnt how to be kind",
        detail: "Favorite memory: Best Outgoing Boy.",
        image:
          "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80",
      },

      {
        id: "graduation",
        title: "Graduation",
        category: "education",
        summary: "A place where I explored all of my interests",
        detail: "Favourite memory - not yet...",
        image:
          "https://images.unsplash.com/photo-1462536943532-57a629f6cc60?auto=format&fit=crop&w=800&q=80",
      },

      {
        id: "friends",
        title: "Friends",
        category: "social",
        summary: "Many memories with different people",
        detail: "A shared book with many stories...",
        image:
          "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80",
      },

      {
        id: "close-friends",
        title: "Close Friends",
        category: "social",
        summary: "My people who know every plot twist in my life",
        detail: "Unfiltered...",
        image:
          "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80",
      },

      {
        id: "family",
        title: "Family",
        category: "social",
        summary: "After all family first...",
        detail: "Lovely family...",
        image:
          "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80",
      },

      {
        id: "hobbies",
        title: "Hobbies",
        summary: "Jack of all trades Master of none",
        detail: "Latest obsession...",
        image:
          "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80",
      },

      {
        id: "comfort-zone",
        title: "Comfort Zone",
        summary: "Ambient playlists and favourite series",
        detail: "Love repeating things I enjoy...",
        image:
          "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80",
      },

      {
        id: "creative-works",
        title: "Creative Works",
        summary: "Short films and interactive timelines",
        detail: "Mixing live-action interviews with illustration",
        image:
          "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80",
      },

    ];

    setStories(mockDB);

  }, []);

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

      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black via-[#0b0b0d] to-black"></div>

      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-red-600/10 blur-[160px] rounded-full"></div>
      <div className="absolute top-[40%] -right-40 w-[500px] h-[500px] bg-red-500/10 blur-[160px] rounded-full"></div>

      <Navbar />

      <header className="text-center pt-32 pb-24 px-4">

        <p className="uppercase tracking-[0.3em] text-xs text-gray-400 mb-8">
          Personal Showcase
        </p>

        <h1 className="text-5xl font-bold mb-10">
          <span className="bg-red-600 px-6 py-2 rounded-lg">
          {user?.username || "User"}
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
                      onClick={() =>navigate(`/story/${user.user_id}/${item.id}`)}
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