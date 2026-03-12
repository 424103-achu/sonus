import express from "express";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
     // example data (temporary test)
    const stories = [
      {
        id: 1,
        title: "School",
        summary: "A place where I learnt how to be kind",
        detail: "Favorite memory",
        image:
          "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
      },
    ];

    // const stories = await db.query("SELECT * FROM stories");
    res.json(stories);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stories" });
  }
});

export default router;