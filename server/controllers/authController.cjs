const db = require('../config/database.cjs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth.cjs');

const register = async (req, res) => {
  try {
    const { nome_usuario, email, password, role = 'user' } = req.body;

    // Validações
    if (!nome_usuario || !email || !password) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    // Verificar se email já existe
    db.get('SELECT id FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao verificar email' });
      }

      if (user) {
        return res.status(400).json({ error: 'Email já cadastrado' });
      }

      // Hash da senha
      const hashedPassword = await bcrypt.hash(password, 10);

      // Inserir usuário
      db.run(
        'INSERT INTO users (nome_usuario, email, password, role) VALUES (?, ?, ?, ?)',
        [nome_usuario, email, hashedPassword, role],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Erro ao criar usuário' });
          }

          // Gerar token
          const token = jwt.sign(
            { id: this.lastID, email, role },
            JWT_SECRET,
            { expiresIn: '7d' }
          );

          // Buscar usuário completo
          db.get('SELECT id, nome_usuario, email, avatar_url, role FROM users WHERE id = ?', [this.lastID], (err, newUser) => {
            if (err) {
              return res.status(500).json({ error: 'Erro ao buscar usuário' });
            }

            res.status(201).json({
              message: 'Usuário criado com sucesso',
              token,
              user: newUser
            });
          });
        }
      );
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validações
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    // Buscar usuário
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao buscar usuário' });
      }

      if (!user) {
        return res.status(401).json({ error: 'Email ou senha incorretos' });
      }

      // Verificar senha
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Email ou senha incorretos' });
      }

      // Gerar token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Remover senha do objeto de resposta
      delete user.password;

      res.json({
        message: 'Login realizado com sucesso',
        token,
        user
      });
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const getMe = (req, res) => {
  db.get('SELECT id, nome_usuario, email, avatar_url, role FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar usuário' });
    }

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Verificar assinatura ativa
    const now = new Date().toISOString();
    db.get(
      'SELECT * FROM user_subscriptions WHERE userId = ? AND endDate > ? ORDER BY endDate DESC LIMIT 1',
      [user.id, now],
      (err, subscription) => {
        if (err) {
          console.error('Erro ao buscar assinatura:', err);
        }

        res.json({
          ...user,
          hasActiveSubscription: !!subscription
        });
      }
    );
  });
};

module.exports = { register, login, getMe };
