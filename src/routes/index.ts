import express from 'express';
import auth from './auth.routes';
import user from './user.routes'

const router = express.Router();


router.use(user);
router.use(auth);

router.get('/healthcheck', (_, res) => {
    res.sendStatus(200);
});


export default router;
