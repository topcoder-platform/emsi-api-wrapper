const qs = require('qs')
const axios = require('axios')

/**
 * Gets the EMSI API bearer token to be used for subsequent calls
 *
 * @returns
 */
const getApiToken = async (config) => {
  const data = qs.stringify({
    client_id: config.EMSI_SKILLS_API.CLIENT_ID,
    client_secret: config.EMSI_SKILLS_API.CLIENT_SECRET,
    grant_type: config.EMSI_SKILLS_API.GRANT_TYPE,
    scope: config.EMSI_SKILLS_API.SCOPE
  })

  const axiosConfig = {
    method: 'post',
    url: config.EMSI_SKILLS_API.AUTH_URL,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data
  }

  const response = await axios(axiosConfig)

  return response.data.access_token
}

module.exports = {
  getApiToken
}
