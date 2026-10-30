const pool = require('../config/db');

const addProject = async (req, res) => {
    try {
        const { title, description, tech_stack, github_link, live_url } = req.body;
        
        // Guard (middleware) ne req.user mein token ka data daal diya tha
        // Token banate waqt humne user.id ko 'sub' ke andar rakha tha
        const userId = req.user.sub; 

        if (!title || !description || !tech_stack) {
            return res.status(400).json({ error: 'Title, description aur tech_stack zaroori hain' });
        }

        const insertQuery = `
            INSERT INTO projects (title, description, tech_stack, github_link, live_url, user_id)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
        
        const values = [title, description, tech_stack, github_link, live_url, userId];
        const newProject = await pool.query(insertQuery, values);

        res.status(201).json({
            message: 'Project successfully upload ho gaya! 🚀',
            project: newProject.rows[0]
        });

    } catch (error) {
        console.error('Project Upload Error:', error.message);
        res.status(500).json({ error: 'Project save karne mein server error' });
    }
};

const getAllProjects = async (req, res) => {
    try {
        // Token se ID 'sub' ke through hi nikalni hai
        const userId = req.user.sub; 

        const query = `
            SELECT p.id, p.title, p.description, p.tech_stack, p.github_link, p.live_url, p.created_at,
                   u.name AS student_name, u.course AS student_course
            FROM projects p
            JOIN users u ON p.user_id = u.id
            WHERE p.user_id != $1
            ORDER BY p.created_at DESC;
        `;
        
        const result = await pool.query(query, [userId]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Projects Fetch Error:', error.message);
        res.status(500).json({ error: 'Projects fetch error' });
    }
};

// Sirf logged-in user ke projects laane ka function
const getMyProjects = async (req, res) => {
    try {
        const userId = req.user.sub; // Token se hume user ki id mil gayi
        
        // Database ko bolenge ki sirf wohi projects do jinki user_id is user se match karti ho
        const query = `
            SELECT * FROM projects 
            WHERE user_id = $1 
            ORDER BY created_at DESC;
        `;
        const result = await pool.query(query, [userId]);
        
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('My Projects Fetch Error:', error.message);
        res.status(500).json({ error: 'Aapke projects laane mein server error' });
    }
};

// Project Edit (Update) karne ka function
const updateProject = async (req, res) => {
    try {
        const { id } = req.params; // URL se project ki ID nikal li
        const { title, description, tech_stack, github_link, live_url } = req.body;
        const userId = req.user.sub; // Security: Kisne request bheji hai

        // COALESCE ka matlab hai ki agar koi field nahi bheji, toh purani wali hi rehne do
        const updateQuery = `
            UPDATE projects
            SET title = COALESCE($1, title),
                description = COALESCE($2, description),
                tech_stack = COALESCE($3, tech_stack),
                github_link = COALESCE($4, github_link),
                live_url = COALESCE($5, live_url)
            WHERE id = $6 AND user_id = $7
            RETURNING *;
        `;
        const values = [title, description, tech_stack, github_link, live_url, id, userId];
        const result = await pool.query(updateQuery, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Project nahi mila ya aapko isse edit karne ki permission nahi hai' });
        }
        res.status(200).json({ message: 'Project successfully update ho gaya! 🚀', project: result.rows[0] });
    } catch (error) {
        console.error('Update Error:', error.message);
        res.status(500).json({ error: 'Project update karne mein server error' });
    }
};

// Project Delete karne ka function
const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.sub;

        const deleteQuery = `DELETE FROM projects WHERE id = $1 AND user_id = $2 RETURNING *;`;
        const result = await pool.query(deleteQuery, [id, userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Project nahi mila ya aapko isse delete karne ki permission nahi hai' });
        }
        res.status(200).json({ message: 'Project successfully delete ho gaya! 🗑️' });
    } catch (error) {
        console.error('Delete Error:', error.message);
        res.status(500).json({ error: 'Project delete karne mein server error' });
    }
};
// Module exports mein naya function add karna mat bhoolna:
module.exports = { addProject, getAllProjects, getMyProjects, updateProject, deleteProject };
