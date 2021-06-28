var express = require('express');
var router = express.Router();

// Require controller modules.
var user_controller = require('../controllers/userController');

// Home
router.get('/', user_controller.users_list);

// User - POST - recebe os dados em formato JSON de um user, cria esse user na base de dados 
// e retorna uma resposta JSON com os detalhes do user (o id deve ser gerado na base de dados)
router.post('/register', user_controller.register_user);

// User - POST - recebe os dados do username e da password de um user 
// e retorna OK caso tenha dado login corretamente.
router.post('/authenticate', user_controller.login_user);

router.get('/:id', user_controller.get_user_by_id);
router.post('/addFavorite/:id', user_controller.add_favorite);
router.post('/removeFavorite/:id', user_controller.remove_favorite);
router.get('/:id/favorited/:photoid', user_controller.already_favorited);
router.get('/:id/liked/:photoid', user_controller.already_liked);
router.get('/favorites/:id', user_controller.getFavoritePhotosIds);

module.exports = router;