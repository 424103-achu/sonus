function StoryCard({ story }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl min-h-65 border border-white/10 bg-black hover:-translate-y-2 hover:shadow-2xl transition duration-300">

      <img
        src={story.image}
        alt={story.title}
        className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition duration-300"
      />

      <div className="absolute inset-0 bg-linear-to-br from-black/90 to-black/30"></div>

      <div className="relative p-6 flex flex-col gap-2 z-10">

        <h3 className="text-xl font-semibold text-white">
          {story.title}
        </h3>

        <p className="text-gray-200 text-sm">
          {story.summary}
        </p>

        <small className="text-gray-400">
          {story.detail}
        </small>

      </div>

    </div>
  );
}

export default StoryCard;