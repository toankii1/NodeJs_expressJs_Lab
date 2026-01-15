const express = require('express');
const router = express.Router();
const db = require('../db/mysql');

// Home
router.get('/', async(req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM products');
        res.render('products', { products: rows });
    } catch (err) {
        console.log(err);
        res.status(500).send('Database error');
    }
});

// 2. CREATE (Add product)
router.post('/add', async(req, res) => {
    const { name, price, quantity } = req.body;
    await db.query(
        'INSERT INTO products(name, price, quantity) VALUES (?, ?, ?)', [name, price, quantity]
    );
    res.redirect('/');
});

// 3. DELETE (Xóa sản phẩm)
router.get('/delete/:id', async(req, res) => {
    const id = req.params.id;
    await db.query('DELETE FROM products WHERE id = ?', [id]);
    res.redirect('/');
});

// 4. UPDATE (Form sửa sản phẩm)
router.get('/edit/:id', async(req, res) => {
    const id = req.params.id;
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);

    // Nếu tìm thấy sản phẩm thì render trang edit
    if (rows.length > 0) {
        res.render('edit', { product: rows[0] });
    } else {
        res.redirect('/');
    }
});

// 5. UPDATE (Lưu dữ liệu sửa) 
router.post('/update/:id', async(req, res) => {
    const id = req.params.id;
    const { name, price, quantity } = req.body;

    await db.query(
        'UPDATE products SET name = ?, price = ?, quantity = ? WHERE id = ?', [name, price, quantity, id]
    );
    res.redirect('/');
});

module.exports = router;