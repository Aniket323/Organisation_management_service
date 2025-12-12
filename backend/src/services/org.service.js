const { getNativeDb, mongoose } = require('../db');
const MasterOrg = require('../models/MasterOrg');


function buildCollectionName(orgName) {
  const safe = orgName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  return `org_${safe}`;
}

async function createOrganization({ organizationName, adminEmail, adminPasswordHash }) {
  // check existence
  const exists = await MasterOrg.findOne({ organizationName });
  if (exists) throw new Error('Organization already exists');

  const collectionName = buildCollectionName(organizationName);

  const db = getNativeDb();
  await db.createCollection(collectionName); 

  // create master entry
  const master = new MasterOrg({
    organizationName,
    collectionName,
    admin: {
      email: adminEmail,
      passwordHash: adminPasswordHash
    },
    meta: { createdBy: adminEmail }
  });

  await master.save();

  return {
    organizationName: master.organizationName,
    collectionName: master.collectionName,
    adminEmail: adminEmail
  };
}

async function getOrganizationByName(organizationName) {
  return MasterOrg.findOne({ organizationName }).lean();
}


async function updateOrganization({ organizationName, newOrganizationName, email, passwordHash }) {
  const master = await MasterOrg.findOne({ organizationName });
  if (!master) throw new Error('Organization not found');

  if (!newOrganizationName || newOrganizationName === organizationName) {
    if (email) master.admin.email = email;
    if (passwordHash) master.admin.passwordHash = passwordHash;
    await master.save();
    return master;
  }

  // ensure new name not taken
  const existing = await MasterOrg.findOne({ organizationName: newOrganizationName });
  if (existing) throw new Error('New organization name already exists');

  const newCollectionName = buildCollectionName(newOrganizationName);
  const db = getNativeDb();

  // create new collection
  await db.createCollection(newCollectionName);

  const oldColl = db.collection(master.collectionName);
  const newColl = db.collection(newCollectionName);

  const cursor = oldColl.find({});
  const docs = await cursor.toArray();
  if (docs.length > 0) {
    const docsToInsert = docs.map(d => {
      const copy = { ...d };
      delete copy._id;
      return copy;
    });
    await newColl.insertMany(docsToInsert);
  }

  // update master record
  master.organizationName = newOrganizationName;
  master.collectionName = newCollectionName;
  if (email) master.admin.email = email;
  if (passwordHash) master.admin.passwordHash = passwordHash;

  await master.save();

  return master;
}

async function deleteOrganization({ organizationName, requestingAdminEmail }) {
  // only allow deletion if admin matches
  const master = await MasterOrg.findOne({ organizationName });
  if (!master) throw new Error('Organization not found');

  if (master.admin.email !== requestingAdminEmail) {
    throw new Error('Not authorized to delete this organization');
  }

  const db = getNativeDb();
  // drop collection (safe if exists)
  const colNames = (await db.listCollections({}, { nameOnly: true }).toArray()).map(c => c.name);
  if (colNames.includes(master.collectionName)) {
    await db.dropCollection(master.collectionName);
  }

  await MasterOrg.deleteOne({ organizationName });

  return true;
}

module.exports = { createOrganization, getOrganizationByName, updateOrganization, deleteOrganization };
