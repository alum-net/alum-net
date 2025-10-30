db = db.getSiblingDB('alum-net');
db.createCollection("metadata_init");

// documento de control
db.getCollection('metadata_init').insertOne({
    startupTime: new Date(),
    status: "Database initialized"
});