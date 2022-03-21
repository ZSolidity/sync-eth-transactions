import { ObjectId } from "mongodb";

export const COLLECTION_NAME = "eth_transactions_erc20"

export interface Collection {
    id?: ObjectId;
    blockNumber: number;
    hash: string;
    from: string;
    to: string;
    value: number;
}

export const jsonSchema = {
    $jsonSchema: {
        bsonType: "object",
        required: ["blockNumber", "hash", "from", "to", "value"],
        additionalProperties: false,
        properties: {
            _id: {},
            blockNumber: {
                bsonType: "number",
                description: "'blockNumber' is required and is a number",
            },
            hash: {
                bsonType: "string",
                description: "'hash' is required and is a string",
            },
            from: {
                bsonType: "string",
                description: "'from' is required and is a string",
            },
            to: {
                bsonType: "string",
                description: "'to' is required and is a string",
            },
            value: {
                bsonType: "string",
                description: "'value' is required and is a string",
            },
        },
    },
};

export const jsonIndex = {
    "to":1
}