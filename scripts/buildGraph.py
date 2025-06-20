import networkx as nx
from pymongo import MongoClient
import time
from transformers import pipeline

def build_and_save_scores():
    uri = "mongodb://localhost:27017/"
    client = MongoClient(uri)
    db = client['trustGraph']
    interactions_collection = db['interactions']
    scores_collection = db['trust_scores']
    
    print("Successfully connected to MongoDB.")
    
    print("Loading sentiment analysis model (this may take a moment on first run)...")
    sentiment_pipeline = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")
    print("Sentiment analysis model loaded successfully.")

    interactions = list(interactions_collection.find({}))
    if not interactions:
        print("No interactions found in the database.")
        return

    print(f"\nFound {len(interactions)} interactions. Building graph...")

    G = nx.DiGraph()
    
    interaction_weights = {
        'endorsement': 1.5,
        'collaboration': 1.0,
        'profile': 0.1
    }

    for interaction in interactions:
        if 'from' in interaction and 'to' in interaction:
            interaction_type = interaction.get('type', 'unknown')
            if interaction_type == 'endorsement':
                print(f"  [TEE Simulation] 'Decrypting' endorsement from {interaction['from']}...")
                time.sleep(0.05) 

            weight = interaction_weights.get(interaction_type, 0)
            G.add_edge(
                interaction['from'], 
                interaction['to'], 
                weight=weight,
                type=interaction_type,
                details=interaction.get('details', {})
            )

    print("\nGraph built. Calculating base scores using PageRank algorithm...")
    pagerank_scores = nx.pagerank(G, alpha=0.85, weight='weight')
    
    print("Analyzing endorsement sentiment for score boosts...")
    sentiment_boosts = {node: 0.0 for node in G.nodes()}
    
    for u, v, data in G.edges(data=True):
        if data.get('type') == 'endorsement':
            text = data.get('details', {}).get('content', '')
            if text:
                result = sentiment_pipeline(text)[0]
                label = result['label']
                score_impact = 0
                
                if label == 'POSITIVE' and result['score'] > 0.8:
                    score_impact = 10
                elif label == 'NEGATIVE' and result['score'] > 0.8:
                    score_impact = -10
                
                if score_impact != 0:
                    sentiment_boosts[v] += score_impact
                    print(f"  Sentiment boost of {score_impact} for {v} from endorsement: '{text}'")

    print("\nNormalizing PageRank and applying sentiment boosts...")
    max_pagerank_score = max(pagerank_scores.values()) if pagerank_scores else 0
    final_scores = {}

    if max_pagerank_score > 0:
        for node, score in pagerank_scores.items():
            normalized_pagerank = (score / max_pagerank_score) * 100
            boost = sentiment_boosts.get(node, 0.0)
            final_score = normalized_pagerank + boost
            final_score = max(0, min(100, final_score))
            final_scores[node] = final_score
    else:
        final_scores = pagerank_scores

    print("Scores calculated. Saving to database...")
    scores_collection.delete_many({})
    scores_to_insert = [{'address': address, 'score': score} for address, score in final_scores.items()]

    if scores_to_insert:
        scores_collection.insert_many(scores_to_insert)
        print(f"Successfully saved {len(final_scores)} hybrid trust scores.")

    client.close()
    print("MongoDB connection closed. Script finished.")

if __name__ == "__main__":
    build_and_save_scores()