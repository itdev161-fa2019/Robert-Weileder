import express from 'express';
import connectDatabase from './config/db';
import { check, validationResult } from 'express-validator';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from 'config';
import User from './models/User';
import Game from './models/Game';
import auth from './middleware/auth';


// Initialize express application
const app = express();

// Connect database
connectDatabase();

// Configure Middleware
app.use(express.json({ extended: false }));
app.use(
    cors({
        origin: 'http://localhost:3000'
    })
);

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
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        } else {
            const { name, email, password } = req.body;
            try {
                // Check if user exists
                let user = await User.findOne({ email: email });
                if (user) {
                    return res
                        .status(400)
                        .json({ errors: [{ msg: 'User already exists'}] });
                }

                // Create a new user
                user = new User({
                    name: name,
                    email: email,
                    password: password
                });

                // Encrypt the password
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(password, salt);

                // Save to the db and return
                await user.save();
                
                // Generate and return a JWT token
                returnToken(user, res);
			  } catch (error) {
                res.status(500).send('Server error');
            }
        }
    }
);

/**
 * @route POST api/login
 * @desc Login user*/
app.post(
  '/api/login',
  [
    check('email', 'Please enter a valid email').isEmail(),
	check('password', 'A password is required').exists()
  ],
  async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
	  return res.status(422).json({ errors: errors.array() });
	} else {
	  const { email, password } = req.body;
	  try {
		// Check if user exists
		let user = await User.findOne({ email: email });
		if (!user) {
		  return res
		    .status(400)
			.json({ errors: [{ msg: 'Invalid email or password' }] });
		}
		
		// Check password
		const match = await bcrypt.compare(password, user.password);
		if (!match) {
		  return res
		    .status(400)
			  .json({ errors: [{ msg: 'Invalid email or password' }] });
		}
		
		// Generate and return a JWT token
		returnToken(user, res);
	  } catch (error) {
		res.status(500).send('Server error');
	  }
 	 }
    }
  );

  const returnToken = (user, res) => {
	const payload = {
	  user: {
		id: user.id
	  }
	};
	
	jwt.sign(
	  payload,
	  config.get('jwtSecret'),
	  { expiresIn: '10hr' },
	  (err, token) => {
	    if (err) throw err;
		res.json({ token: token });
	  }
    );
  };

/**
 * @route GET api/auth
 * @desc Authenticate user
 */
app.get('/api/auth', auth, async (req, res) => {
  try {
	const user = await User.findById(req.user.id);
	res.status(200).json(user);
  } catch (error) {
	res.status(500).send('Unknown server error');
  }
});

// Game endpoints
/**
 * @route GAME api/games
 * @desc Create game
 */
app.post(
  '/api/games',
  [
    auth,
    [
      check('title', 'Title text is required')
        .not()
        .isEmpty(),
      check('platform', 'Platform text is required')
        .not()
        .isEmpty(),
      check('developer', 'Developer text is required')
        .not()
        .isEmpty(),
      check('genre', 'Genre text is required')
        .not()
        .isEmpty(),
      check('rating', 'ESRB rating text is required')
        .not()
        .isEmpty(),
      check('prodYear', 'Year produced text is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    } else {
      const { title, platform, developer, genre, rating, prodYear, comment } = req.body;
      try {
        // Get the user who created the game
        const user = await User.findById(req.user.id);

        // Create a new game
        const game = new Game({
          user: user.id,
          title: title,
          platform: platform,
          developer: developer,
          genre: genre,
          rating: rating,
          prodYear: prodYear,
          comment: comment
        });

        // Save to the db and return
        await game.save();

        res.json(game);
      } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
      }
    }
  }
);

/**
 * @route GET api/games
 * @desc Get games
 */
app.get('/api/games', auth, async (req, res) => {
  try {
    const games = await Game.find().sort({ date: -1 });
        
    res.json(games);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

/**
 * @route GET api/games/:id
 * @desc Get game
 */
app.get('/api/games/:id', auth, async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
      
    // Make sure the game was found
    if (!game) {
      return res.status(404).json({ msg: 'Game not found' });
    }
      
    res.json(game);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

/**
 * @route DELETE api/games/:id
 * @desc Delete a game
 */
app.delete('/api/games/:id', auth, async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
      
    // Make sure the game was found
    if (!game) {
      return res.status(404).json({ msg: 'Post not found' });
    }
      
    // Make sure the user created the game
    if (game.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
      
    await game.remove();
      
    res.json({ msg: 'Game removed' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

/**
 * @route PUT api/games/:id
 * @desc Update a game
 */
app.put('/api/games/:id', auth, async (req, res) => {
  try {
    const { title, platform, developer, genre, rating, prodYear, comment } = req.body;
    const game = await Game.findById(req.params.id);
    
    // Make sure the game was found
    if (!game) {
      return res.status(404).json({ msg: 'game not found' });
    }
      
    // Make sure the request user created the game
    if (game.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
      
    // Update the game and return
    game.title = title || game.title;
    game.platform = platform || game.platform;
    game.developer = developer || game.developer;
    game.genre = genre || game.genre;
    game.rating = rating || game.rating;
    game.prodYear = prodYear || game.prodYear;
    game.comment = comment || game.comment;
    
      
    await game.save();
      
    res.json(game);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Connection listener
const port = 5000;
app.listen(port, () => console.log(`Express server running on port ${port}`));
