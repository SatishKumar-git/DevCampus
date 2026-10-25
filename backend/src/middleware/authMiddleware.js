const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    // 1. Request ke 'headers' se token nikalna
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Access denied! Pehle login karein.' });
    }

    // 2. "Bearer <token>" mein se sirf token ko alag karna
    const token = authHeader.split(' ')[1];

    try {
        // 3. Secret key se token ki asliyat check karna
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 4. User ki details (id, role) ko aage use karne ke liye req mein daal dena
        req.user = decoded; 
        
        // 5. Sab theek hai, request ko aage controller ke paas bhej do
        next(); 
    } catch (error) {
        return res.status(401).json({ error: 'Token nakli ya purana (expire) ho chuka hai!' });
    }
};

module.exports = { protect };