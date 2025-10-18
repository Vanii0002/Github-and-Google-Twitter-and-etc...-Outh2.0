import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello from Router 1!');
});

router.get('/home', (req, res) => {
  res.render('home');
});

router.get('/happy', (req, res) => {
  res.send('I am very happy today!');
});  



// authantication route


export default router;