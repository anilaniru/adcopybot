import { GoogleGenAI } from "https://esm.run/@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyC5GaoECTKa-xKOS-s3YTp5y1M0Kc0nAT0" });

const input = document.getElementById("productInput");
const button = document.getElementById("generateBtn");
const loading = document.getElementById("loading");
const resultContainer = document.getElementById("resultContainer");

button.addEventListener("click", async () => {
  const productDescription = input.value.trim();
  if (!productDescription) {
    alert("Please enter a product description.");
    return;
  }

  resultContainer.innerHTML = "";
  loading.classList.remove("hidden");

  const fullPrompt = `
Act like a professional digital marketing copywriter.
Generate 3 short, catchy ad copies for this product:
"${productDescription}"
Each copy should:
- Be 1-2 sentences
- Include a strong call to action
- Be emotionally compelling
- Use different tones and styles
Output as plain text only.
`;

  const response = await ai.models.generateContentStream({
    model: "gemini-2.0-flash",
    contents: fullPrompt,
  });

  let text = "";
  for await (const chunk of response) {
    text += chunk.text || "";
  }

  loading.classList.add("hidden");
  const ads = text.split(/\n?\d\.\s*/).filter(Boolean);

  ads.forEach((ad, index) => {
    const div = document.createElement("div");
    div.className = "ad-copy";
    div.innerHTML = `
      <strong>Ad ${index + 1}</strong><br>${ad}
      <button class="copy-btn">📋</button>
    `;
    resultContainer.appendChild(div);

    const copyBtn = div.querySelector(".copy-btn");
    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(ad);
      copyBtn.textContent = "✅ Copied!";
      setTimeout(() => (copyBtn.textContent = "📋"), 1500);
    });
  });
});
