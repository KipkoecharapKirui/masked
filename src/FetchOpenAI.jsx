export async function fetchOpenAIResponse(prompt) {
  const apiKey = import.meta.env.VITE_APP_OPENAI_API_KEY;
  

  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 150,
      }),
    });

    const data = await response.json();
    console.log(data);
    
    if (response.ok) {
      return data.choices[0]?.message.content.trim();
    } else {
      console.error("OpenAI API error:", data);
      return "An error occurred. Please try again.";
    }
  } catch (error) {
    console.error("Network error:", error);
    return "Network error. Please check your connection.";
  }
}
