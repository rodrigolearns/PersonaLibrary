import { pinecone } from '@/utils/pinecone-client';
import { Document, DocumentInput } from "langchain/document";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE } from '@/config/pinecone';

// Get Pinecone index
const pineconeIndex = pinecone.Index(PINECONE_INDEX_NAME);

// Sample data
const markdownText = "# This is a markdown text\nThis is the content of the markdown file. The content of this file is useful only to know that Rodrigo is crazy about Camille";

const metadata = {
    source: "example.pdf",
    authors: "John Doe",
    page: "1",
    section: "Introduction",
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
