// makechain.ts
import { OpenAI } from 'langchain/llms/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { ConversationalRetrievalQAChain } from 'langchain/chains';
import { PersonaConfiguration } from '../config/PersonaConfigurations';

const CONDENSE_PROMPT = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`;

export const makeChain = async (vectorstore: PineconeStore, activePersonas: string[]) => {
  const model = new OpenAI({
    temperature: 0, // increase temepreature to get more creative answers
    modelName: 'gpt-3.5-turbo', //change this to gpt-4 if you have access
  });

  // Create a chain for each active persona
  const chains = await Promise.all(activePersonas.map(async (persona) => {
    // Find the persona's details in the configuration
    const personaDetails = PersonaConfiguration.find(p => p.name === persona);

    if (!personaDetails) {
      throw new Error(`No configuration found for persona: ${persona}`);
    }

    return ConversationalRetrievalQAChain.fromLLM(
      model,
      vectorstore.asRetriever(),
      {
        qaTemplate: personaDetails.QA_PROMPT, // Use the persona's QA_PROMPT
        questionGeneratorTemplate: CONDENSE_PROMPT,
        returnSourceDocuments: true, //The number of source documents returned is 4 by default
      },
    );
  }));

  return chains;
};
