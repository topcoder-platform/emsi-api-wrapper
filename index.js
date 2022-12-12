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
    getRelatedSkills: (skillIds, token) => {
      return require('./src/services/EmsiSkillService').getRelatedSkills(config, skillIds, token)
    }
  }
}
