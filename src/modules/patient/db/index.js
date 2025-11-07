import Model from "../models/index.js";

const addData = async (data) => {
    try {
        return await Model.create(data);
    } catch (error) {
        throw error;
    }
}

const getData = async () => {
    try {

    } catch (error) {
        throw error;
    }
}

const getDataByEmail = async (email) => {
    try {
        return await Model.findOne({ email });
    } catch (err) {
        console.log(err);
    }
}

export { addData, getDataByEmail };
