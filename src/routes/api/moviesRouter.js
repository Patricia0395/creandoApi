const express = require('express');
const router = express.Router();
const {list, detail, create, update, destroy} = require('../../controllers/api/moviesController');

router.get('/', list);
router.get('/:id', detail);
router.post('/', create)
router.put('/:id',update);
router.delete('/:id', destroy)


module.exports = router;