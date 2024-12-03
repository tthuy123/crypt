import Client from "../client.api";

const ElGamal = {
    async factors(data) {
        try {
            const response = await Client.post("elgamal/factors", data); // Gọi API factors
            return response;
        } catch (error) {
            if (error.response) {
                return error.response;
            }
        }
    },

    async primitiveElement(data) {
        try {
            const response = await Client.post("elgamal/primitive-element", data); // Gọi API primitive-element
            return response;
        } catch (error) {
            if (error.response) {
                return error.response;
            }
        }
    },

    async keyGenerate(data) {
        try {
            const response = await Client.post("elgamal/key-generate", data); // Gọi API key-generate
            return response;
        } catch (error) {
            if (error.response) {
                return error.response;
            }
        }
    },

    async encrypt(data) {
        try {
            const response = await Client.post("elgamal/encrypt", data); // Gọi API encrypt
            return response;
        } catch (error) {
            if (error.response) {
                return error.response;
            }
        }
    },

    async decrypt(data) {
        try {
            const response = await Client.post("elgamal/decrypt", data); // Gọi API decrypt
            return response;
        } catch (error) {
            if (error.response) {
                return error.response;
            }
        }
    },

    async sign(data) {
        try {
            const response = await Client.post("elgamal/encrypt-sig", data); // Gọi API sign
            return response;
        } catch (error) {
            if (error.response) {
                return error.response;
            }
        }
    },

    async verify(data) {
        try {
            const response = await Client.post("elgamal/check-sig", data); // Gọi API verify
            return response;
        } catch (error) {
            if (error.response) {
                return error.response;
            }
        }
    }
}

export default ElGamal;
