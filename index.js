const axios = require("axios");
const { getInputsObject } = require("./src/utils");

const getClientSecret = async (inputObject) => {
  const { keycloakUrl, realm, clientId, username, password } = inputObject;

  // Get access token
  const tokenResponse = await axios.post(
    `${keycloakUrl}/realms/master/protocol/openid-connect/token`,
    {
      grant_type: "password",
      client_id: "admin-cli",
      username: username,
      password: password,
    }
  );

  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const clientsResponse = await axios.get(
    `${keycloakUrl}/admin/realms/${realm}/clients`,
    options
  );

  console.log("clients response data: ", clientsResponse.data);

  const accessToken = tokenResponse.data.access_token;

  // Get client secret
  const clientResponse = await axios.get(
    `${keycloakUrl}/admin/realms/${realm}/clients/${clientId}/client-secret`,
    options
  );

  return clientResponse.data.value;
};

(async () => {
  const clientSecret = await getClientSecret(getInputsObject());
  console.log(clientSecret);
})();
