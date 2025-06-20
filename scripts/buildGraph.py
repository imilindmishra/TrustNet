import networkx as nx
from pymongo import MongoClient

def build_and_save_scores():
    uri = "mongodb://localhost:27017"
    client = MongoClient(uri)
    db = client['trustGraph']
    interactions_collection = db['interactions']
    scores_collection = db['trust_scores']
    
    print("Successfully connected to MongoDB.")
    
    interactions = list(interactions_collection.find({}))
    if not interactions:
        print("No interactions found in the database.")
        return

    print(f"Found {len(interactions)} interactions. Building graph...")

    G = nx.DiGraph()
    for interaction in interactions:
        if 'from' in interaction and 'to' in interaction:
            G.add_edge(
                interaction['from'], 
                interaction['to'], 
                type=interaction.get('type', 'unknown')
            )

    print("Graph built. Calculating weighted scores...")
    
    interaction_weights = {
        'endorsement': 1.5,
        'collaboration': 1.0,
        'profile': 0.1
    }
    
    trust_scores_raw = {node: 0.0 for node in G.nodes()}
    for node in G.nodes():
        for u, v, data in G.in_edges(node, data=True):
            interaction_type = data.get('type', 'unknown')
            trust_scores_raw[v] += interaction_weights.get(interaction_type, 0)
            
    print("Normalizing scores to 0-100 scale...")
    
    max_score = max(trust_scores_raw.values()) if trust_scores_raw else 0
    
    trust_scores_normalized = {}
    if max_score > 0:
        for node, score in trust_scores_raw.items():
            normalized_score = (score / max_score) * 100
            trust_scores_normalized[node] = normalized_score
    else:
        trust_scores_normalized = trust_scores_raw

    print("Scores normalized. Saving to database...")

    scores_collection.delete_many({})
    scores_to_insert = []
    for address, score in trust_scores_normalized.items():
        scores_to_insert.append({'address': address, 'score': score})

    if scores_to_insert:
        scores_collection.insert_many(scores_to_insert)
        print(f"Successfully saved {len(scores_to_insert)} normalized trust scores.")
    else:
        print("No scores to save.")

    client.close()
    print("MongoDB connection closed. Script finished.")

if __name__ == "__main__":
    build_and_save_scores()
