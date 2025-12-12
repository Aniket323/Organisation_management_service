const express = require('express');
const router = express.Router();
const orgController = require('../controllers/organization.conrtroller');
const auth = require('../middleware/auth.middleware');

// Create org
router.post('/create', orgController.createOrgHandler);

// Get org by name
router.get('/get', orgController.getOrgHandler);

// Update org (rename/admin update)
router.put('/update', orgController.updateOrgHandler);

// Delete org (authenticated admin only)
router.delete('/delete', auth, orgController.deleteOrgHandler);

// Admin login
router.post('/admin/login', orgController.adminLoginHandler);

module.exports = router;
