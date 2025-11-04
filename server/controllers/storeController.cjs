const db = require('../config/database.cjs');

// Listar planos de assinatura
const getSubscriptionPlans = (req, res) => {
  db.all('SELECT * FROM subscription_plans', [], (err, plans) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar planos' });
    }

    res.json(plans);
  });
};

// Criar assinatura
const createSubscription = (req, res) => {
  const { planId } = req.body;
  const userId = req.user.id;

  // Buscar plano
  db.get('SELECT * FROM subscription_plans WHERE id = ?', [planId], (err, plan) => {
    if (err || !plan) {
      return res.status(404).json({ error: 'Plano não encontrado' });
    }

    const startDate = new Date().toISOString();
    const endDate = new Date(Date.now() + plan.durationDays * 24 * 60 * 60 * 1000).toISOString();

    db.run(
      'INSERT INTO user_subscriptions (userId, planId, startDate, endDate) VALUES (?, ?, ?, ?)',
      [userId, planId, startDate, endDate],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Erro ao criar assinatura' });
        }

        res.status(201).json({
          message: 'Assinatura criada com sucesso',
          id: this.lastID,
          startDate,
          endDate
        });
      }
    );
  });
};

// Verificar assinatura ativa do usuário
const checkSubscription = (req, res) => {
  const userId = req.user.id;
  const now = new Date().toISOString();

  db.get(`
    SELECT us.*, sp.name, sp.price, sp.description
    FROM user_subscriptions us
    LEFT JOIN subscription_plans sp ON us.planId = sp.id
    WHERE us.userId = ? AND us.endDate > ?
    ORDER BY us.endDate DESC
    LIMIT 1
  `, [userId, now], (err, subscription) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao verificar assinatura' });
    }

    if (!subscription) {
      return res.json({ hasActiveSubscription: false });
    }

    res.json({
      hasActiveSubscription: true,
      subscription
    });
  });
};

// Listar produtos
const getProducts = (req, res) => {
  db.all('SELECT * FROM products', [], (err, products) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar produtos' });
    }

    res.json(products);
  });
};

// Buscar produto por ID
const getProductById = (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM products WHERE id = ?', [id], (err, product) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar produto' });
    }

    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    res.json(product);
  });
};

// Criar venda
const createSale = (req, res) => {
  const { items } = req.body; // items: [{ productId, quantity, price }]
  const userId = req.user.id;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Carrinho vazio' });
  }

  // Calcular total
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  db.run(
    'INSERT INTO sales (userId, total) VALUES (?, ?)',
    [userId, total],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Erro ao criar venda' });
      }

      const saleId = this.lastID;

      // Inserir itens da venda
      const insertItem = db.prepare('INSERT INTO sale_items (saleId, productId, quantity, price) VALUES (?, ?, ?, ?)');
      items.forEach(item => {
        insertItem.run(saleId, item.productId, item.quantity, item.price);
      });
      insertItem.finalize();

      res.status(201).json({
        message: 'Compra realizada com sucesso',
        saleId,
        total
      });
    }
  );
};

// Buscar vendas do usuário
const getUserSales = (req, res) => {
  const userId = req.user.id;

  db.all(`
    SELECT s.*, 
           GROUP_CONCAT(p.name) as products
    FROM sales s
    LEFT JOIN sale_items si ON s.id = si.saleId
    LEFT JOIN products p ON si.productId = p.id
    WHERE s.userId = ?
    GROUP BY s.id
    ORDER BY s.date DESC
  `, [userId], (err, sales) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar vendas' });
    }

    res.json(sales);
  });
};

module.exports = {
  getSubscriptionPlans,
  createSubscription,
  checkSubscription,
  getProducts,
  getProductById,
  createSale,
  getUserSales
};
