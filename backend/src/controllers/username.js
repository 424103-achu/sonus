app.get("/search-users", (req, res) => {
  const query = req.query.q;

  const sql = "SELECT username FROM users WHERE username LIKE ?";
  db.query(sql, [`%${query}%`], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});
x