export const fetchGeminiResponse = async (prompt, imageBase64 = null) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error("API key not configured");

  // Use gemini-2.0-flash as per your API dashboard
  const model = imageBase64 ? "gemini-pro-vision" : "gemini-2.0-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  // Enhanced prompt formatting for text queries
  const formattedPrompt = imageBase64 
    ? prompt 
    : `Please respond using markdown with:
       • Clear paragraphs
       • Code blocks (\`\`\`language)
       • Tables using pipes
       • Lists with bullet points
       • Bold/italic for emphasis\n\n${prompt}`;

  const requestBody = {
    contents: [{
      parts: [
        { text: formattedPrompt },
        ...(imageBase64 ? [{
          inlineData: {
            mimeType: "image/jpeg",
            data: imageBase64.split(',')[1] // Remove base64 prefix
          }
        }] : [])
      ]
    }],
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
      topK: 40,
      maxOutputTokens: 2048
    },
    safetySettings: [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_ONLY_HIGH"
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_ONLY_HIGH"
      }
    ]
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", {
        status: response.status,
        error: errorData.error
      });
      throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated";
    
  } catch (error) {
    console.error("Network Error:", error);
    throw new Error(`Failed to fetch: ${error.message}`);
  }
};