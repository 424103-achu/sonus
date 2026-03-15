import { useEffect, useState } from "react";
import api from "../../api/api";
import StorySection from "./storySection";

function StoryGrid() {

  const [stories, setStories] = useState([]);

  useEffect(() => {

    async function fetchStories() {
      try {
        const res = await api.get("/api/stories");
        setStories(res.data);
      } catch (err) {
        console.error("Failed to fetch stories:", err);
      }
    }

    fetchStories();

  }, []);

  const socialPriority = ["Family", "Close Friends", "Friends"];
  const highlightPriority = ["Hobbies", "Comfort Zone", "Creative Works"];

  const sortSocial = (items) =>
    [...items].sort(
      (a, b) =>
        socialPriority.indexOf(a.title) -
        socialPriority.indexOf(b.title)
    );

  const sortHighlights = (items) =>
    [...items].sort(
      (a, b) =>
        highlightPriority.indexOf(a.title) -
        highlightPriority.indexOf(b.title)
    );

  const sections = [
    {
      label: "Education",
      items: stories.filter((story) => story.category === "education"),
    },
    {
      label: "Social",
      items: sortSocial(
        stories.filter((story) => story.category === "social")
      ),
    },
    {
      label: "Highlights",
      items: sortHighlights(
        stories.filter((story) => !story.category)
      ),
    },
  ];

  return (
    <div className="story-grid">
      {sections.map((section) => (
        <StorySection
          key={section.label}
          label={section.label}
          items={section.items}
        />
      ))}
    </div>
  );
}

export default StoryGrid;