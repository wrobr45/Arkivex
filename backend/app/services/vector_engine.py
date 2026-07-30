import math
import re

class VectorEmbeddingEngine:
    """Vector Embeddings Generator & Cosine Similarity Engine."""

    @staticmethod
    def chunk_text(text: str, chunk_size: int = 400, overlap: int = 50) -> list:
        """Split text into overlapping chunks."""
        chunks = []
        start = 0
        while start < len(text):
            end = start + chunk_size
            chunks.append(text[start:end])
            start += chunk_size - overlap
        return chunks if chunks else [text]

    @staticmethod
    def generate_embedding(text: str) -> list:
        """Generate a 64-dimensional pseudo-normalized embedding vector for text."""
        words = re.findall(r'\w+', text.lower())
        vector = [0.0] * 64
        for word in words:
            idx = sum(ord(c) for c in word) % 64
            vector[idx] += 1.0
            
        # Normalize vector to unit length
        magnitude = math.sqrt(sum(v * v for v in vector))
        if magnitude > 0:
            vector = [v / magnitude for v in vector]
        return vector

    @staticmethod
    def cosine_similarity(vec_a: list, vec_b: list) -> float:
        """Compute cosine similarity score between two vector embeddings."""
        dot_product = sum(a * b for a, b in zip(vec_a, vec_b))
        mag_a = math.sqrt(sum(a * a for a in vec_a))
        mag_b = math.sqrt(sum(b * b for b in vec_b))
        if mag_a == 0 or mag_b == 0:
            return 0.0
        return round(dot_product / (mag_a * mag_b), 4)

    @classmethod
    def search_semantic_similarity(cls, query: str, documents: list) -> list:
        """Run vector similarity search over document chunks."""
        query_vector = cls.generate_embedding(query)
        results = []

        for doc in documents:
            title = doc.get("title", "Untitled Document")
            ocr_text = doc.get("ocr_text", "") or doc.get("ai_summary", "")
            chunks = cls.chunk_text(ocr_text)

            best_score = 0.0
            best_chunk = ""

            for chunk in chunks:
                chunk_vector = cls.generate_embedding(chunk)
                sim_score = cls.cosine_similarity(query_vector, chunk_vector)
                if sim_score > best_score:
                    best_score = sim_score
                    best_chunk = chunk

            if best_score > 0.15:
                results.append({
                    "document_id": doc.get("id"),
                    "title": title,
                    "category": doc.get("category"),
                    "similarity_score": round(best_score * 100, 1),
                    "matched_chunk": best_chunk,
                })

        results.sort(key=lambda x: x["similarity_score"], reverse=True)
        return results
