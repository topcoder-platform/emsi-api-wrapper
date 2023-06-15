module.exports = (config) => {
  // export functions
  return {
    getApiToken: () => {
      return require('./src/services/AuthService').getApiToken(config)
    },
    getSkillById: (skillId, token) => {
      return require('./src/services/EmsiSkillService').getSkillById(config, skillId, token)
    },
    searchSkills: (criteria, token) => {
      return require('./src/services/EmsiSkillService').searchSkills(config, criteria, token)
    },
    extractSkillsFromText: (text, token) => {
      return require('./src/services/EmsiSkillService').extractSkillsFromText(config, text, token)
    },
    extractSkillsFromFile: (binaryData, fileType, token) => {
      return require('./src/services/EmsiSkillService').extractSkillsFromFile(config, binaryData, fileType, token)
    },
    getRelatedSkills: (skillIds, token) => {
      return require('./src/services/EmsiSkillService').getRelatedSkills(config, skillIds, token)
    },
    getVersionDetails: (onlyVersionFlag, token) => {
      return require('./src/services/EmsiSkillService').getVersionDetails(config, onlyVersionFlag, token)
    },
    getVersionChanges: (version, token) => {
      return require('./src/services/EmsiSkillService').getVersionChanges(config, version, token)
    }
  }
}
