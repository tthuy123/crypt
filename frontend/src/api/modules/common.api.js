import Client from "../client.api";

const Common = {
    async pow(data) {
        try {
            const response = await Client.post("common/pow", data); // gọi API pow
            return response;
        } catch (error) {
            if (error.response) {
                return error.response;
            }
        }
    },

    async modularInverse(data) {
        try {
            const response = await Client.post("common/modular-inverse", data); // gọi API modular-inverse
            return response;
        } catch (error) {
            if (error.response) {
                return error.response;
            }
        }
    },

    async checkPrime(data) {
        try {
            const response = await Client.post("common/prime", data); // gọi API prime
            return response;
        } catch (error) {
            if (error.response) {
                return error.response;
            }
        }
    }
}

export default Common;
