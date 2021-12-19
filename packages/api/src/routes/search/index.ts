import { Router } from 'express';
import { getAll, query, queryWithFilters, suggest } from './controller';

const router = Router();

router.get('/', getAll)

router.get('/:query', query)
router.post('/:query', queryWithFilters)

router.get('/suggest/:keyword', suggest)

export default router