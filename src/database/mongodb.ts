import mongoose from "mongoose";
import { MONGODB_URI } from "../config";

export async function connectDatabase() {
    try{
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB");

        // cleanup of a once-used unique index on the collections collection.
        // previous versions created one document per saved item and enforced a
        // unique {consumerId,type,itemId} index.  with the current aggregated
        // schema we no longer need the index, and having it around causes
        // errors if a document is ever inserted with null/undefined fields.
        try {
            const coll = mongoose.connection.collection("collections");
            const indexes = await coll.indexes();
            const legacyName = "consumerId_1_type_1_itemId_1";
            if (indexes.some((idx: any) => idx.name === legacyName)) {
                await coll.dropIndex(legacyName);
                console.log(`Dropped legacy index ${legacyName}`);
            }
        } catch (e: any) {
            if (e.codeName && e.codeName !== "IndexNotFound") {
                console.warn("Error while cleaning up indexes:", e);
            }
        }
    }
    catch(error){
        console.error(`Database Eroor: ${error}`);
        process.exit(1); //Exit process with failure
    }
    
}