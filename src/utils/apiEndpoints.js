const API_ENDPOINTS = {



  LOGS: (baseURL, dataSource, connectionIdentifier, logKey, token) =>
    `${baseURL}/api/session/data/${dataSource}/history/connections/${connectionIdentifier}/logs/${logKey}?token=${token}`,
};

export default API_ENDPOINTS;
