const randomstring = require("randomstring");
const commonValues = require("../../../../configs/environment/commonValues");

module.exports = class RandomUtil {

  static getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static generateRandomString(length = commonValues.randomStringLength) {
    return randomstring.generate({ length: length });
  }

};
