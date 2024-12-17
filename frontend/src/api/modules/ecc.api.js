import Client from "../client.api";

const ECC = {
  async pointAdd(data) {
    try {
      const response = await Client.post("ecc/point-add", data); // Gọi API add
      return response;
    } catch (error) {
      if (error.response) {
        return error.response;
      }
    }
  },

  async isPointOnCurve(data) {
    try {
      const response = await Client.post("ecc/point-on-curve", data);
      return response;
    } catch (error) {
      if (error.response) {
        return error.response;
      }
    }
  },

  async pointMultiply(data) {
    try {
      const response = await Client.post("ecc/point-multiply", data);
      return response;
    } catch (error) {
      if (error.response) {
        return error.response;
      }
    }
  },

  async encrypt(data) {
    try {
      const response = await Client.post("ecc/encrypt", data);
      return response;
    } catch (error) {
      if (error.response) {
        return error.response;
      }
    }
  },

  async decrypt(data) {
    try {
      const response = await Client.post("ecc/decrypt", data);
      return response;
    } catch (error) {
      if (error.response) {
        return error.response;
      }
    }
  },

  async curve_points(data) {
    try {
      const response = await Client.post("ecc/count-point", data);
      return response;
    } catch (error) {
      if (error.response) {
        return error.response;
      }
    }
  },

  async getMessagePoint(data) {
    try {
      const response = await Client.post("ecc/get-message-point", data);
      return response;
    } catch (error) {
      if (error.response) {
        return error.response;
      }
    }
  },
};

export default ECC;
