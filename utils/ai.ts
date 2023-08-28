import { PromptTemplate } from "langchain/prompts";
import { OpenAI } from "langchain/llms/openai"
import { StructuredOutputParser } from "langchain/output_parsers";

import z from 'zod';
import { Document } from "langchain/document";
import { loadQARefineChain } from "langchain/chains";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

const parser = StructuredOutputParser.fromZodSchema(z.object({
    sentimentScore: z.number().describe('sentiment of the text and rated on a scale from -10 to 10, where -10 is extremely negative, 0 is neutral, and 10 is extremely positive.'),
    mood: z.string().describe("the mood of the people who wrote the journal entry."),    
    subject: z.string().describe("the subject of the journal entry. I might be a person, place, or thing and i have to be able to understand main idea of the journal. Remember it's a journal, so no title something like 'my day' or 'a day' or 'a special day'."),
    summary: z.string().describe("a quick summary of the entire entry."),
    negative: z.boolean().describe("is the journal entry negative? (i.e. does it contain negative emotions?)."),
    color: z.string().describe("a hexadecimal code represents that mood of the entry. Example #0101fe for blue representing happiness."),
}));
const getPrompt = async (entry:string) => {
    const format_instructions = parser.getFormatInstructions();

    const prompt = new PromptTemplate({
        template: 'analyze the following journal entry. Follow the instructions and format your response to match the format instructions, no matter what! \n {format_instructions} \n {entry}',
        inputVariables: ['entry'],
        partialVariables: {format_instructions},
    });
    const input = await prompt.format({
        entry
    });
    return input;
}

export const analyze = async (prompt)=> {
    const input = await getPrompt(prompt);
    const model = new OpenAI({
        temperature:0,
        modelName:"gpt-3.5-turbo",
    });
    const result = await model.call(input);
    try{
        return parser.parse(result);
    }catch(e){
        console.error(e);
    }
}


export const qa = async (question,entries)=> {
    const docs = entries.map(entry=>{
        return new Document({
            pageContent: entry.content,
            metadata:{
                id:entry.id,
                createdAt:entry.createdAt,
            }
        })
    });
    const model = new OpenAI({
        temperature:0,
        modelName:"gpt-3.5-turbo",
    });
    const chain = loadQARefineChain(model);
    const embeddings = new OpenAIEmbeddings();
    const store = await MemoryVectorStore.fromDocuments(docs,embeddings);
    const relevants = await store.similaritySearch(question);
    const questionWithoutContext = `I'm going to ask you a question about the journal entries. Please don't give me any context and just answer!! Also ignore tell me things like "based on the given context"!! Its important. Dont do it. \n Question:\n ${question} \n`
    const res = await chain.call({
        input_documents:relevants,
        question:questionWithoutContext
    });
    return res.output_text;
}
