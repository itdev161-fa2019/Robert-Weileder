activity-4
/*jshint esversion: 8 */
import express from 'express';
import connectDatabase from './config/db';
import { check, validationResult } from 'express-validator';
import cors from 'cors';

/*jshint esversion: 8 */
import express from 'express';
import connectDatabase from './config/db';
import { check, validationResult } from 'express-validator';
master

// Initialize express application
const app = express();

// Connect database
connectDatabase();

// Configure Middleware
app.use(express.json({ extended: false }));
activity-4
app.use(
    cors({
        origin: 'http://localhost:3000'
    })
);

master

// API endpoints
/**
 * @route GET /
 * @desc Test endpoint
 */
app.get('/', (req, res) =>
    res.send('http get request sent to root api endpoint')
);

/**
 * @route POST api/users
 * @desc Register user
 */
app.post(
    '/api/users',
    [
        check('name', 'Please enter your name')
            .not()
            .isEmpty(),
        check('email', 'Please enter your email').isEmail(),
        check(
            'password',
            'Please enter a password with 6 or more characters'
            ).isLength({ min: 6 })
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        } else {
            return res.send(req.body);
        }
    }
);

// Connection listener
activity-4
const port = 5000;
app.listen(port, () => console.log(`Express server running on port ${port}`));

app.listen(3000, () => console.log('Express server running on port 3000'));
master
