import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.sendFile('home.html', {root: req.staticRoot});
});

router.get('/privacy', (req, res) => {
  res.sendFile('privacy.html', {root: req.staticRoot});
});

router.get('/success', (req, res) => {
  res.sendFile('success.html', {root: req.staticRoot});
});

router.get('/faq', (req, res) => {
  res.sendFile('faq.html', {root: req.staticRoot});
});

export default router;