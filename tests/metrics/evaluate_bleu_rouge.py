"""
Simple evaluation script for computing BLEU and ROUGE‑L on generated
responses.  This script is provided as an example of how you might
evaluate the quality of answers produced by the chat backend.

Usage:
    python evaluate_bleu_rouge.py "reference text" "candidate text"

For example:
    python evaluate_bleu_rouge.py \
        "The patient has malaria but is otherwise stable." \
        "This patient is diagnosed with malaria but remains clinically stable."

This will print the BLEU score and a very simple ROUGE‑L score based on
longest common subsequence.

Note: this script depends on ``nltk`` which is already included in the
project's requirements.  It uses basic tokenization and is intended
purely for demonstration purposes; for research‑grade evaluations you
should use dedicated libraries such as ``rouge_score`` or ``sacrebleu``.
"""

import sys
import nltk
from nltk.translate.bleu_score import sentence_bleu, SmoothingFunction

def lcs_length(x: list[str], y: list[str]) -> int:
    """Return the length of the longest common subsequence between two lists."""
    m, n = len(x), len(y)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if x[i - 1] == y[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[m][n]

def rouge_l(reference: str, candidate: str) -> float:
    """Compute a simple ROUGE‑L score based on longest common subsequence."""
    ref_tokens = reference.split()
    cand_tokens = candidate.split()
    lcs = lcs_length(ref_tokens, cand_tokens)
    if not ref_tokens or not cand_tokens:
        return 0.0
    precision = lcs / len(cand_tokens)
    recall = lcs / len(ref_tokens)
    if precision + recall == 0:
        return 0.0
    beta = 1.2
    score = ((1 + beta**2) * precision * recall) / (recall + beta**2 * precision)
    return score

def main() -> None:
    if len(sys.argv) != 3:
        print(__doc__)
        sys.exit(1)
    reference, candidate = sys.argv[1], sys.argv[2]
    # ensure nltk data is available
    nltk.download("punkt", quiet=True)
    ref_tokens = nltk.word_tokenize(reference)
    cand_tokens = nltk.word_tokenize(candidate)
    smoothie = SmoothingFunction().method4
    bleu = sentence_bleu([ref_tokens], cand_tokens, smoothing_function=smoothie)
    rouge = rouge_l(reference, candidate)
    print(f"BLEU:  {bleu:.4f}")
    print(f"ROUGE-L: {rouge:.4f}")

if __name__ == "__main__":
    main()
