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

  const clientsResponse = await axios.get(
    `${keycloakUrl}/admin/realms/${realm}/clients`,
    options
  );

  console.log("clients response data: ", clientsResponse.data);

  // Get client secret
  const clientResponse = await axios.get(
    `${keycloakUrl}/admin/realms/${realm}/clients/${clientId}/client-secret`,
    options
  );

  return clientResponse.data.value;
};

(async () => {
  const inputsObject = getInputsObject();
  const clientSecret = await getClientSecret(inputsObject);
  console.log(clientSecret);
})();
