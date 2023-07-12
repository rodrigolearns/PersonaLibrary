
import pinecone 
import random


PINECONE_API_KEY='746303a2-c735-4a0d-9362-da3e926ad4ea'
PINECONE_ENVIRONMENT='northamerica-northeast1-gcp'
PINECONE_INDEX_NAME='indexfingertest'

pinecone.init(
    api_key=PINECONE_API_KEY,      
	environment=PINECONE_ENVIRONMENT
    )

index = pinecone.Index('indexfingertest')
print(index.describe_index_stats())

queries =  [[random.random() for _ in range(1536)] for _ in range(2)]

print(index.query(
    namespace='pdf-test',
    queries=queries,
    top_k=3,
    include_values=False,
    include_metadata=True,
))



delete_response = index.delete(namespace='pdf-test',delete_all=True)

print(delete_response)
