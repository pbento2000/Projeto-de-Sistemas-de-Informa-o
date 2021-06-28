var express = require('express');
var router = express.Router();

// Require controller modules.
var photo_controller = require('../controllers/photoController');


router.post('/post_photo', photo_controller.post_photo);
router.get('/photo/:id', photo_controller.getPhotoById);
router.delete('/photo/:id', photo_controller.deletePhoto);
router.get('/hasPhotos/:id',photo_controller.hasPhotos);
router.post('/addLike/:id', photo_controller.add_like);
router.post('/removeLike/:id', photo_controller.remove_like);

router.get('/recent_photos_ids', photo_controller.getRecentPhotosIds);
router.get('/popular_photos_ids', photo_controller.getPopularPhotosIds);
router.get('/profile_photos_ids/:username', photo_controller.getProfilePhotosIds);

router.get('/some_photos/:ids', photo_controller.getSomePhotos);

module.exports = router;