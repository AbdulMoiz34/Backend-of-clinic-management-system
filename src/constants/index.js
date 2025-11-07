import "dotenv/config";
import { StatusCodes } from "http-status-codes";
export const { BAD_REQUEST, UNAUTHORIZED, CONFLICT, CREATED, NOT_FOUND, FORBIDDEN, INTERNAL_SERVER_ERROR, OK } = StatusCodes;

const ENV = (process.env || {});

const DELETE_DATA_MESSAGE = "Data deleted successfully.";
const POST_DATA_MESSAGE = 'Data added successfully';
const INTERNAL_SERVER_ERROR_MESSAGE = "Internal server error.";

export { ENV, DELETE_DATA_MESSAGE, POST_DATA_MESSAGE, INTERNAL_SERVER_ERROR_MESSAGE };