import { ObjectId } from "mongodb";

export const COLLECTION_NAME = "erc20_transactions"

export interface Collection {
    id?: ObjectId;
    blockNumber: number;
    hash: string;
    from: string;
    to: string;
    value: number;
    contract: string
}

export const jsonSchema = {
    $jsonSchema: {
        bsonType: "object",
        required: ["blockNumber", "hash", "from", "to", "value", "contract"],
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
            contract: {
                bsonType: "string",
                description: "'contract' is required and is a string",
            },
        },
    },
};

export const jsonIndex = {
    "to":1
}