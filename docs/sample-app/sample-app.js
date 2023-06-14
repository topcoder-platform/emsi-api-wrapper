const emsiApiWrapper = require('emsi-api-wrapper')
const config = require('config')
const fs = require('fs')

const client = emsiApiWrapper(config);
(async () => {
  // Get API token
  const token = await client.getApiToken()

  const text = 'Java Backend API'

  console.log(`Extract skills from text '${text}'`)
  const emsiSkills = await client.extractSkillsFromText(text, token)
  console.log(`Extracted skills = ${JSON.stringify(emsiSkills, null, 2)}`)

  for (const emsiSkill of emsiSkills) {
    console.log(`Get the skill details, skillId = ${emsiSkill.skillId} `)
    const details = await client.getSkillById(emsiSkill.skillId, token)
    console.log(`Skill details = ${JSON.stringify(details, null, 2)}`)
  }

  console.log('Search all skills with Javascript name, limited to 5 skills')
  const searchCriteria = {
    q: 'Javascript',
    limit: 5
  }

  const searchSkillsResult = await client.searchSkills(searchCriteria, token)
  console.log(`The searched skills are = ${JSON.stringify(searchSkillsResult, null, 2)}`)

  console.log('Extract skills from file name')
  const file = fs.readFileSync('./resume.docx', { encoding: 'utf-8' })
  const skillsFromFile = await client.extractSkillsFromFile(Buffer.from(file), 'docx', token)
  console.log(`The extracted skill are: ${JSON.stringify(skillsFromFile)}`)
})()
