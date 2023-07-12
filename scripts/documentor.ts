import fs from 'fs';
import path from 'path';
import util from 'util';
import { Document } from "langchain/document";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { pinecone } from '@/utils/pinecone-client';
import { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE } from '@/config/pinecone';

// Promisify fs.readdir and fs.readFile
const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);

// Get Pinecone index
const pineconeIndex = pinecone.Index(PINECONE_INDEX_NAME);

async function main() {
    const sources = await readdir('md_docs');

    for (const source of sources) {
        const dirPath = path.join('md_docs', source);
        const files = await readdir(dirPath);

        for (const file of files) {
            const filePath = path.join(dirPath, file);
            const markdownText = await readFile(filePath, 'utf8');

            // Extract page number from the file name
            const match = file.match(/markdown_page_(\d+)\.md/);
            if (!match) {
                console.error(`Invalid file name: ${file}`);
                continue;
            }
            const page = match[1];

            const metadata = {
                source: source,
                page: page,
            };

            // Create a Document object
            const document = new Document({
                pageContent: markdownText,
                metadata: metadata,
            });

            // Split the document into smaller chunks
            const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 500 });
            const splitDocs = await textSplitter.splitDocuments([document]);

            // Store the chunks in the PineconeStore
            console.log("splitDoc:", splitDocs)
            await PineconeStore.fromDocuments(splitDocs, new OpenAIEmbeddings(), {
                pineconeIndex,
                namespace: PINECONE_NAME_SPACE,
                textKey: 'text',
            });
        }
    }
}

main().catch(console.error);
