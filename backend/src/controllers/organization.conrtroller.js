const { hashPassword, comparePassword } = require('../utils/crypto.util');
const { createOrganization, getOrganizationByName, updateOrganization, deleteOrganization } = require('../services/org.service');
const MasterOrg = require('../models/MasterOrg');
const jwt = require('jsonwebtoken');
const jwtCfg = require('../config/jwt.config');

async function createOrgHandler(req, res) {
  try {
    const { organization_name, email, password } = req.body;
    if (!organization_name || !email || !password) return res.status(400).json({ error: 'Missing fields' });

    const passwordHash = await hashPassword(password);
    const result = await createOrganization({ organizationName: organization_name, adminEmail: email, adminPasswordHash: passwordHash });

    return res.status(201).json({ ok: true, data: result });
  } catch (err) {
    return res.status(400).json({ ok: false, message: err.message });
  }
}

async function getOrgHandler(req, res) {
  try {
    const organization_name = req.query.organization_name;
    if (!organization_name) return res.status(400).json({ error: 'organization_name query required' });

    const org = await getOrganizationByName(organization_name);
    if (!org) return res.status(404).json({ error: 'Organization not found' });

    return res.json({ ok: true, data: org });
  } catch (err) {
    return res.status(500).json({ ok: false, message: err.message });
  }
}

async function updateOrgHandler(req, res) {
  try {
    const { organization_name, new_organization_name, email, password } = req.body;
    if (!organization_name) return res.status(400).json({ error: 'organization_name required' });

    let passwordHash;
    if (password) passwordHash = await hashPassword(password);

    const master = await updateOrganization({ organizationName: organization_name, newOrganizationName: new_organization_name, email, passwordHash });

    return res.json({ ok: true, data: master });
  } catch (err) {
    return res.status(400).json({ ok: false, message: err.message });
  }
}

async function deleteOrgHandler(req, res) {
  try {
    const { organization_name } = req.body;
    if (!organization_name) return res.status(400).json({ error: 'organization_name required' });


    const requestingAdminEmail = req.adminEmail;
    await deleteOrganization({ organizationName: organization_name, requestingAdminEmail });

    return res.json({ ok: true, message: 'Organization deleted' });
  } catch (err) {
    return res.status(400).json({ ok: false, message: err.message });
  }
}


async function adminLoginHandler(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email & password required' });

    const master = await MasterOrg.findOne({ 'admin.email': email });

    if (!master) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await comparePassword(password, master.admin.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const payload = {
      adminEmail: master.admin.email,
      organizationName: master.organizationName,
      organizationId: master._id.toString()
    };

    const token = jwt.sign(payload, jwtCfg.secret, { expiresIn: jwtCfg.expiresIn });

    res.cookie('token', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 2 });

    return res.json({ ok: true, token, org: { organizationName: master.organizationName, organizationId: master._id }});
  } catch (err) {
    return res.status(500).json({ ok: false, message: err.message });
  }
}

module.exports = { createOrgHandler, getOrgHandler, updateOrgHandler, deleteOrgHandler, adminLoginHandler };
