import networkx as nx
from pymongo import MongoClient
import time
from transformers import pipeline

def build_and_save_scores():
    uri = "mongodb+srv://imilindmishra:oCF3JZQKl79au7t3@cluster0.tlma9.mongodb.net/trustGraph"
    client = MongoClient(uri)
    db = client['trustGraph']
    interactions_collection = db['interactions']
    scores_collection = db['trust_scores']
    
    print("Successfully connected to MongoDB.")
    
    print("Loading sentiment analysis model...")
    sentiment_pipeline = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")
    print("Sentiment analysis model loaded.")

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
                print(f"  [TEE Simulation] Processing endorsement from {interaction['from']}...")
                time.sleep(0.05) 

            weight = interaction_weights.get(interaction_type, 0)
            G.add_edge(
                interaction['from'], 
                interaction['to'], 
                weight=weight,
                type=interaction_type,
                details=interaction.get('details', {})
            )

    print("\nGraph built. Calculating scores and analysis...")
    
    pagerank_scores = nx.pagerank(G, alpha=0.85, weight='weight')
    
    sentiment_boosts = {node: 0.0 for node in G.nodes()}
    sentiment_counts = {node: {'positive': 0, 'negative': 0} for node in G.nodes()}
    
    for u, v, data in G.edges(data=True):
        if data.get('type') == 'endorsement':
            text = data.get('details', {}).get('content', '')
            if text:
                result = sentiment_pipeline(text)[0]
                label = result['label']
                
                if label == 'POSITIVE' and result['score'] > 0.8:
                    sentiment_boosts[v] += 10
                    sentiment_counts[v]['positive'] += 1
                elif label == 'NEGATIVE' and result['score'] > 0.8:
                    sentiment_boosts[v] -= 10
                    sentiment_counts[v]['negative'] += 1

    network_stats = {node: {'collaborations': 0, 'endorsementsReceived': 0} for node in G.nodes()}
    for node in G.nodes():
        for u, v, data in G.in_edges(node, data=True):
            if data.get('type') == 'collaboration':
                network_stats[v]['collaborations'] += 1
            elif data.get('type') == 'endorsement':
                network_stats[v]['endorsementsReceived'] += 1

    max_pagerank_score = max(pagerank_scores.values()) if pagerank_scores else 0
    
    scores_to_insert = []
    for node in G.nodes():
        normalized_pagerank = (pagerank_scores.get(node, 0) / max_pagerank_score) * 100 if max_pagerank_score > 0 else 0
        boost = sentiment_boosts.get(node, 0.0)
        final_score = max(0, min(100, normalized_pagerank + boost))
        
        pos_count = sentiment_counts.get(node, {}).get('positive', 0)
        neg_count = sentiment_counts.get(node, {}).get('negative', 0)
        sentiment_label = "Neutral"
        if pos_count > neg_count:
            sentiment_label = "Positive"
        elif neg_count > pos_count:
            sentiment_label = "Negative"
        elif pos_count > 0 and pos_count == neg_count:
            sentiment_label = "Mixed"

        analysis_object = {
            'address': node,
            'finalScore': final_score,
            'scoreBreakdown': {
                'pageRankScore': normalized_pagerank,
                'sentimentBoost': boost
            },
            'networkAnalysis': {
                'collaborations': network_stats.get(node, {}).get('collaborations', 0),
                'endorsementsReceived': network_stats.get(node, {}).get('endorsementsReceived', 0)
            },
            'endorsementQuality': {
                'sentimentLabel': sentiment_label,
                'positiveCount': pos_count,
                'negativeCount': neg_count
            }
        }
        scores_to_insert.append(analysis_object)

    print("Analysis complete. Saving to database...")
    scores_collection.delete_many({})
    if scores_to_insert:
        scores_collection.insert_many(scores_to_insert)
        print(f"Successfully saved {len(scores_to_insert)} detailed analysis records.")

    client.close()
    print("MongoDB connection closed. Script finished.")

if __name__ == "__main__":
    build_and_save_scores()