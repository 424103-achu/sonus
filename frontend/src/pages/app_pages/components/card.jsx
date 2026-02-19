import React from "react";

export default function StoryCard({ title, summary, detail, image, href }) {
  const CardWrapper = href ? "a" : "div";

  return (
    <CardWrapper
      href={href}
      className={`window-card ${href ? "window-link" : ""}`}
    >
      <img src={image} alt={title} className="window-image" />
      <div className="window-content">
        <h3>{title}</h3>
        <p>{summary}</p>
        <small>{detail}</small>
      </div>
    </CardWrapper>
  );
}
