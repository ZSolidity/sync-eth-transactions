import { ObjectId } from "mongodb";

export const COLLECTION_NAME = "sync_status"

export interface Collection {
    id?: ObjectId;
    key: string;
    value: number;
    status: number;
    timestamp: number;
}

export const jsonSchema = {
    $jsonSchema: {
        bsonType: "object",
        required: ["key", "value", "status", "timestamp"],
        additionalProperties: false,
        properties: {
            _id: {},
            key: {
                bsonType: "string",
                description: "'key' is required and is a string",
            },
            value: {
                bsonType: "number",
                description: "'value' is required and is a number",
            },
            status: {
                bsonType: "number",
                description: "'status' is required and is a number",
            },
            timestamp: {
                bsonType: "number",
                description: "'timestamp' is required and is a number",
            },
        },
    },
};
