import StoryCard from "./storyCard";

function StorySection({ label, items }) {
  if (!items.length) return null;

  return (
    <div className="window-section">

      <h3 className="window-section-title">
        {label}
      </h3>

      <div className="window-section-grid">
        {items.map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>

    </div>
  );
}

export default StorySection;