interface AIResponse {
  content: string;
  table?: {
    headers: string[];
    rows: (string | number)[][];
  };
  chart?: {
    type: 'line' | 'bar' | 'pie';
    data: Record<string, any>[];
    dataKey?: string;
    xAxisKey?: string;
  };
}

/**
 * Call Azure AI Foundry API
 * Replace with your actual API endpoint and configuration
 */
export async function callAIFoundryAPI(userMessage: string): Promise<AIResponse> {
  const apiEndpoint = import.meta.env.VITE_AI_FOUNDRY_ENDPOINT;
  const apiKey = import.meta.env.VITE_AI_FOUNDRY_API_KEY;

  if (!apiEndpoint || !apiKey) {
    throw new Error('AI Foundry API configuration missing. Set VITE_AI_FOUNDRY_ENDPOINT and VITE_AI_FOUNDRY_API_KEY in .env.local');
  }

  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        message: userMessage,
        // Add other parameters as needed by your AI Foundry deployment
      }),
    });

    if (!response.ok) {
      throw new Error(`AI Foundry API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Parse the response based on your AI Foundry API format
    // This example assumes the API returns structured data like:
    // { content: string, table?: {...}, chart?: {...} }
    
    return {
      content: data.content || data.text || data.message || '',
      table: data.table,
      chart: data.chart,
    };
  } catch (error) {
    console.error('AI Foundry API call failed:', error);
    throw error;
  }
}
