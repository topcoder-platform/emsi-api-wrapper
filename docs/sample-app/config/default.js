/**
 * The application configuration file
 */

module.exports = {
  EMSI_SKILLS_API: {
    AUTH_URL: process.env.EMSI_AUTH_URL || 'https://auth.emsicloud.com/connect/token',
    BASE_URL: process.env.EMSI_SKILLS_BASE_URL || 'https://emsiservices.com/skills',
    CLIENT_ID: process.env.EMSI_SKILLS_API_CLIENT_ID,
    CLIENT_SECRET: process.env.EMSI_SKILLS_API_CLIENT_SECRET,
    GRANT_TYPE: process.env.EMSI_AUTH_GRANT_TYPE || 'client_credentials',
    SCOPE: process.env.EMSI_AUTH_SCOPE || 'emsi_open',
    VERSION: process.env.EMSI_SKILLS_API_VERSION || 'latest',
    SKILLS_EXTRACTION_CONFIDENCE_THRESHOLD: process.env.EMSI_SKILLS_EXTRACTION_CONFIDENCE_THRESHOLD || '0.6',
    MAXIMUM_RELATED_SKILLS_TO_RETRIEVE_PER_REQUEST: process.env.MAXIMUM_RELATED_SKILLS_TO_RETRIEVE_PER_REQUEST || 5
  }
}
