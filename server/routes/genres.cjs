const express = require('express');
const router = express.Router();
const db = require('../config/database.cjs');

router.get('/', (req, res) => {
  db.all('SELECT * FROM genres ORDER BY nome', [], (err, genres) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar gêneros' });
    }

    res.json(genres);
  });
});

module.exports = router;
