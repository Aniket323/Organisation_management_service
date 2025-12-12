const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true } // hashed
});

const MasterOrgSchema = new mongoose.Schema({
  organizationName: { type: String, required: true, unique: true },
  collectionName: { type: String, required: true }, // e.g. org_<orgname>
  admin: AdminSchema,
  createdAt: { type: Date, default: () => new Date() },
  meta: { type: Object, default: {} } // connection details, etc.
});

module.exports = mongoose.model('MasterOrg', MasterOrgSchema);
