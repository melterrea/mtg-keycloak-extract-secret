const { getInput } = require("@actions/core");

const getInputsObject = () => {
  const keycloakUrl = getInput("keycloakUrl");
  const realm = getInput("realm");
  const clientId = getInput("clientId");
  const username = getInput("username");
  const password = getInput("password");

  return {
    keycloakUrl,
    realm,
    clientId,
    username,
    password,
  };
};

module.exports = {
  getInputsObject,
};
