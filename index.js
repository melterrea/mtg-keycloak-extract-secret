const axios = require("axios");
const querystring = require("querystring");
const { getInputsObject } = require("./src/utils");

const getClientSecret = async (inputObject) => {
  const { keycloakUrl, realm, clientId, username, password } = inputObject;

  // Get access token
  const tokenResponse = await axios.post(
    `${keycloakUrl}/realms/master/protocol/openid-connect/token`,
    querystring.stringify({
      grant_type: "password",
      client_id: "admin-cli",
      username: username,
      password: password,
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  const options = {
    headers: {
      Authorization: `Bearer ${tokenResponse.data.access_token}`,
    },
  };

  // GET All clients for the realm
  const clientsResponse = await axios.get(
    `${keycloakUrl}/admin/realms/${realm}/clients`,
    options
  );

  if (!clientsResponse.data || !clientsResponse.data.length) {
    throw "No response for clients.";
  }

  const client = clientsResponse.data.find(
    (client) => client["clientId"] === clientId
  );

  if (!client) {
    throw "No client found with this clientId.";
  }

  // Get client secret
  const clientSecretResponse = await axios.get(
    `${keycloakUrl}/admin/realms/${realm}/clients/${client["id"]}/client-secret`,
    options
  );

  return clientSecretResponse.data.value;
};

(async () => {
  const inputsObject = getInputsObject();
  const clientSecret = await getClientSecret(inputsObject);
  core.setOutput("secret", clientSecret);
  core.setSecret(clientSecret); // hiding in the worfklow console
})();
