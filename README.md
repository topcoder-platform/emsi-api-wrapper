# emsi-skills-api-wrapper
Wrapper library for EMSI skills API: https://api.lightcast.io/apis/skills#overview

This EMSI API wrapper exposes the following functions to interact with EMSI api:
1. getApiToken() - Generate a jwt token to use with subsequent EMSI API calls
2. getSkillById(skillId, token) - Get the EMSI skill details by emsi skill id
3. extractSkillsFromText(text, token) - Extract the EMSI skills from the given text
4. extractSkillsFromFile(binaryData, fileType, token) - Extract the EMSI skills from the given file, 
                                                        file must be utf-8 encoded pdf or docx
5. getRelatedSkills(skillIds, token) - Get the skills related to given skills ids
6. searchSkills(criteria, token) - Get all EMSI skills matching the given criteria, the search criteria is an
                                   object which has the same fields as the url parameters of the GET /skills endpoint
                                   see query parameters names at https://api.lightcast.io/apis/skills#get-list-all-skills

Sample criteria object for searching for skills is:
```javascript
const criteria = {
    q: 'Java',
    typeIds: 'ST1,ST2',
    fields: 'id,name',
    limit:5
}
```

# Configuration:
The configuration of the application using this library should have the following structure:

```bash
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
```

The above configuration parameters can be used for accessing the EMSI API, only need to additionally set the following parameters in the application environment
```bash
export EMSI_SKILLS_API_CLIENT_ID=<client_id>
export EMSI_SKILLS_API_CLIENT_SECRET=<client_secret>
```

# Usage:
1. In order to use this wrapper, it needs to be included in the application `package.json`
```
"emsi-api-wrapper": "topcoder-platform/emsi-api-wrapper.git#develop"
```

2. Create an instance of the wrapper:
```javascript
const emsiApiWrapper = require('emsi-api-wrapper')
const config = require('config')
const client = emsiApiWrapper(config);
```

3. Call the wrapper functions:
```javascript
const token = await client.getApiToken()

/**
* Version information API
*/
console.log(`Version API`)
let detailedVersionInfo = await client.getVersionDetails(false, token)
console.log(`Full version details: ${JSON.stringify(detailedVersionInfo)}`)
detailedVersionInfo = await client.getVersionDetails(true, token)
console.log(`Only version details: ${JSON.stringify(detailedVersionInfo)}`)

const text = 'Java Backend API'
const emsiSkills = await client.extractSkillsFromText(text, token)

for(const emsiSkill of emsiSkills) {
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

/**
* This extraction from file API only supoports utf-8 encoded PDF and docx file
*/
console.log('Extract skills from file')
const file = fs.readFileSync('./resume.docx')
const skillsFromFile = await client.extractSkillsFromFile(Buffer.from(file, 'utf-8'), 'docx', token)
console.log(`The extracted skill are: ${JSON.stringify(skillsFromFile)}`)
```


A sample application which shows how to use the wrapper is provided at [sample-app](./docs/sample-app)