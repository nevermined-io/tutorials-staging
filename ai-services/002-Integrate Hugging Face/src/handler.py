import os
from haystack.utils import fetch_archive_from_http, clean_wiki_text, convert_files_to_docs
from haystack.schema import Answer
from haystack.document_stores import InMemoryDocumentStore
from haystack.pipelines import ExtractiveQAPipeline
from haystack.nodes import FARMReader, TfidfRetriever
import logging
import json

os.environ['TOKENIZERS_PARALLELISM'] ="false"

#Haystack Components
def start_haystack():
    document_store = InMemoryDocumentStore()
    load_and_write_data(document_store)
    retriever = TfidfRetriever(document_store=document_store)
    reader = FARMReader(model_name_or_path="deepset/roberta-base-squad2-distilled", use_gpu=True)
    pipeline = ExtractiveQAPipeline(reader, retriever)
    return pipeline

def load_and_write_data(document_store):
    
    # Get the absolute path of the script
    script_path = os.path.realpath(__file__)
    # Get the script directory
    script_dir = os.path.dirname(script_path)
    doc_dir = script_dir + "/dao_data"
    print("Loading data ...")

    docs = convert_files_to_docs(dir_path=doc_dir, clean_func=clean_wiki_text, split_paragraphs=True)
    document_store.write_documents(docs)


class EndpointHandler():
    def __init__(self, path=""):
        # load the optimized model     
        self.pipeline = start_haystack()


    def __call__(self, data):
        """
        Args:
            data (:obj:):
                includes the input data and the parameters for the inference.
        Return:
            A :obj:`list`:. The object returned should be a list of one list like [[{"label": 0.9939950108528137}]] containing :
                - "label": A string representing what the label/class is. There can be multiple labels.
                - "score": A score between 0 and 1 describing how confident the model is for this label/class.
        """
        inputs = data.pop("inputs", None)
        question = inputs.pop("question", None)
        if question is not None:
            prediction = self.pipeline.run(query=question, params={"Retriever": {"top_k": 10}, "Reader": {"top_k": 5}})
        else:
            return {}
        
        # postprocess the prediction
        response = { "answer": prediction['answers'][0].answer}
        return json.dumps(response)