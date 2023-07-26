import { OpenAI } from 'langchain/llms/openai';
import { PersonaConfiguration } from '../config/PersonaConfigurations';

async function translateQuery(userQuery: string, activePersonas: string[]) {
  const model = new OpenAI({
    temperature: 0, // increase temperature to get more creative answers
    modelName: 'gpt-3.5-turbo', //change this to gpt-4 if you have access
  });

  // Find the details of the active personas in the configuration
  const activePersonasDetails = activePersonas.map(persona => {
    const personaDetails = PersonaConfiguration.find(p => p.name === persona);
    if (!personaDetails) {
      throw new Error(`No configuration found for persona: ${persona}`);
    }
    return personaDetails;
  });

  // Create a prompt that includes the QA_PROMPTs of the active personas and the user's query
  const prompt = `
    These are the personas trying to help the user with their query:
    ${activePersonasDetails.map(p => `${p.name}: ${p.QA_PROMPT}`).join('\n')}
    The user's query is: "${userQuery}".
    Please separate the query into subqueries and assign these subqueries to the most appropriate personas based on their QA_PROMPT.
    The response should be in the format "persona: subquery" for each persona, and nothing else.
  `;

  // Ask the question to the model
  const response = await model.call(prompt);

  // The response should be a mapping of persona names to subqueries
  // Parse the response into a structured format
  const translatedQueries = response.split('\n').reduce((acc, line) => {
    const [persona, subquery] = line.split(': ');
    if (!persona || !subquery) {
      throw new Error(`Unexpected response format from model: ${line}`);
    }
    acc[persona] = subquery;
    return acc;
  }, {} as Record<string, string>);

  return translatedQueries;
}
