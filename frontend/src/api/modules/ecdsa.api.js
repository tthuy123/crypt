import Client from "../client.api";

const ECDSA = {
  async hash_message(data) {
    try {
      const response = await Client.post("ecdsa/hash", data);
      return response;
    } catch (error) {
      if (error.response) {
        return error.response;
      }
    }
  },

  async isKValid(data) {
    try {
      const response = await Client.post("ecdsa/check-k", data);
      return response;
    } catch (error) {
      if (error.response) {
        return error.response;
      }
    }
  },

  async sign(data) {
    try {
      const response = await Client.post("ecdsa/sign", data);
      return response;
    } catch (error) {
      if (error.response) {
        return error.response;
      }
    }
  },

  async verify(data) {
    try {
      const response = await Client.post("ecdsa/verify", data);
      return response;
    } catch (error) {
      if (error.response) {
        return error.response;
      }
    }
  },
};
export default ECDSA;
