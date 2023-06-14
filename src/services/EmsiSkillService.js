const axios = require('axios')
const axiosThrottle = require('axios-request-throttle')
const _ = require('lodash')
const queryString = require('querystring')

// Throttle the calls that are made to EMSI API
axiosThrottle.use(axios, { requestsPerSecond: 200 })

/**
 * Gets the EMSI skill identified by the given id
 *
 * @param {String} skillId the id of the emsi skill to retrieve
 * @param {String} token the emsi skill API access token
 * @returns
 */
const getSkillById = async (config, skillId, token) => {
  const axiosConfig = {
    method: 'get',
    url: `${config.EMSI_SKILLS_API.BASE_URL}/versions/${config.EMSI_SKILLS_API.VERSION}/skills/${skillId}`,
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const response = await axios(axiosConfig)
  return response.data.data
}

/**
 * Extract the EMSI skills from the given text
 *
 * @param config The configuration object
 * @param text The text from which to extract the EMSI skills
 * @param token The EMSI skills API token
 * @returns {Promise<*[]|{skills: *[], relatedSkills: *[]}>}
 */
const extractSkillsFromText = async (config, text, token) => {
  if (_.isEmpty(text)) {
    // The text is missing, then return an empty array
    return []
  }

  const axiosConfig = {
    method: 'post',
    url: `${config.EMSI_SKILLS_API.BASE_URL}/versions/${config.EMSI_SKILLS_API.VERSION}/extract`,
    headers: {
      Authorization: `Bearer ${token}`
    },
    data: { text }
  }

  const response = await axios(axiosConfig)

  const emsiSkills = []

  // iterate over the EMSI skills data
  for (const emsiSkill of response.data.data) {
    const categoryInfo = await getSkillCategoryInfo(config, emsiSkill.skill.id, token)

    emsiSkills.push(
      {
        skillId: emsiSkill.skill.id,
        name: emsiSkill.skill.name,
        category: categoryInfo.category,
        subcategory: categoryInfo.subCategory,
        confidence: emsiSkill.confidence
      })
  }

  return emsiSkills
}

/**
 *
 * @param {Object} config - The configuration object
 * @param {Buffer} binaryData - The binary data of the file to extract EMSI skills from
 * @param {String} fileType - The type of file
 * @param {String} token - The EMSI skills API token
 * @returns
 */
const extractSkillsFromFile = async (config, binaryData, fileType, token) => {
  if (_.isEmpty(binaryData) || _.isNull(binaryData) || _.isUndefined(binaryData)) {
    return []
  }

  // pdf and doc files are only allowed
  if (fileType !== 'pdf' && fileType !== 'docx') {
    console.log(`Supported file types are pdf and docx. The API does not support file type ${fileType}`)
    return []
  }

  const contentType = fileType === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

  const axiosConfig = {
    method: 'post',
    url: `${config.EMSI_SKILLS_API.BASE_URL}/versions/${config.EMSI_SKILLS_API.VERSION}/extract`,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': contentType
    },
    data: binaryData
  }

  const response = await axios(axiosConfig)

  const emsiSkills = []

  // iterate over the EMSI skills data
  for (const emsiSkill of response.data.data) {
    const categoryInfo = await getSkillCategoryInfo(config, emsiSkill.skill.id, token)

    emsiSkills.push(
      {
        skillId: emsiSkill.skill.id,
        name: emsiSkill.skill.name,
        category: categoryInfo.category,
        subcategory: categoryInfo.subCategory,
        confidence: emsiSkill.confidence
      })
  }

  return emsiSkills
}

/**
 * Gets the EMSI skills related to the given skills Ids
 *
 * @param {Array} skillIds An array of skills ids for which to retrieve the related skills
 * @param {*} token
 * @returns
 */
const getRelatedSkills = async (config, skillIds, token) => {
  const axiosConfig = {
    method: 'post',
    url: `${config.EMSI_SKILLS_API.BASE_URL}/versions/${config.EMSI_SKILLS_API.VERSION}/related`,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    data: {
      ids: skillIds,
      limit: config.EMSI_SKILLS_API.MAXIMUM_RELATED_SKILLS_TO_RETRIEVE_PER_REQUEST
    }
  }

  const response = await axios(axiosConfig)

  // Return the result
  return response.data.data
}

/**
 * Gets the skills category and sub category information for the given skillId from EMSI API
 *
 * @param {*} skillId
 * @param {*} token
 * @returns
 */
const getSkillCategoryInfo = async (config, skillId, token) => {
  const skill = await getSkillById(config, skillId, token)
  return {
    category: _.get(skill, 'category'),
    subCategory: _.get(skill, 'subcategory')
  }
}

/**
 *
 * @param {Object} config - The configuration object
 * @param {Object} criteria - The query string key, value
 * @param {String} token - The bearer token
 * @returns
 */
const searchSkills = async (config, criteria, token) => {
  let url
  if (_.isNull(criteria) || _.isEmpty(criteria) || _.isUndefined(criteria)) {
    url = `${config.EMSI_SKILLS_API.BASE_URL}/versions/${config.EMSI_SKILLS_API.VERSION}/skills`
  } else {
    const query = `?${queryString.encode(criteria)}`
    url = `${config.EMSI_SKILLS_API.BASE_URL}/versions/${config.EMSI_SKILLS_API.VERSION}/skills${query}`
  }

  const axiosConfig = {
    method: 'get',
    url,
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const response = await axios(axiosConfig)
  return response.data.data
}

module.exports = {
  getSkillById,
  searchSkills,
  extractSkillsFromText,
  extractSkillsFromFile,
  getRelatedSkills
}
