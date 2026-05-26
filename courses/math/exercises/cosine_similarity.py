import math

def cosine_similarity(v1, v2):
    dot_product = sum(a * b for a, b in zip(v1, v2))

    magnitude_v1 = math.sqrt(sum(a ** 2 for a in v1))
    magnitude_v2 = math.sqrt(sum(b ** 2 for b in v2))

    return dot_product / (magnitude_v1 * magnitude_v2)

vector_a = [1, 2, 3]
vector_b = [4, 5, 6]

similarity = cosine_similarity(vector_a, vector_b)

print(f"Cosine Similarity: {similarity}")

