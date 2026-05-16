// Embedding helper. Calls OpenAI text-embedding-3-small (1536 dims) when OPENAI_API_KEY
// is set; otherwise returns deterministic zero-vectors so the rest of the pipeline runs
// in dev without external dependencies.

const DIMENSIONS = 1536;
const MODEL = "openai/text-embedding-3-small";

export async function embed(texts: string[]): Promise<{ model: string; vectors: number[][] }> {
  if (!process.env.OPENAI_API_KEY) {
    return {
      model: `${MODEL}+stub`,
      vectors: texts.map(() => new Array<number>(DIMENSIONS).fill(0)),
    };
  }

  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "text-embedding-3-small",
      input: texts,
    }),
  });
  if (!res.ok) {
    throw new Error(`Embedding API failed: ${res.status} ${await res.text()}`);
  }
  const payload = (await res.json()) as { data: { embedding: number[] }[] };
  return { model: MODEL, vectors: payload.data.map((d) => d.embedding) };
}

export const EMBEDDING_DIMENSIONS = DIMENSIONS;
