const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

const initDatabase = require('./config/initDatabase.cjs');
const seedDatabase = require('./config/seedDatabase.cjs');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', /\.manusvm\.computer$/],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Servir arquivos estáticos (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rotas
app.use('/api/auth', require('./routes/auth.cjs'));
app.use('/api/stories', require('./routes/stories.cjs'));
app.use('/api/chapters', require('./routes/chapters.cjs'));
app.use('/api/store', require('./routes/store.cjs'));
app.use('/api/genres', require('./routes/genres.cjs'));
app.use('/api/upload', require('./routes/upload.cjs'));

// Rota de teste
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API Fabulis funcionando!' });
});

// Inicializar banco de dados e servidor
const startServer = async () => {
  try {
    console.log('Inicializando banco de dados...');
    await initDatabase();
    
    console.log('Populando banco de dados com dados iniciais...');
    await seedDatabase();
    
    app.listen(PORT, () => {
      console.log(`\n🚀 Servidor rodando em http://localhost:${PORT}`);
      console.log(`📚 API disponível em http://localhost:${PORT}/api`);
      console.log(`✅ Health check: http://localhost:${PORT}/api/health\n`);
    });
  } catch (error) {
    console.error('Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
