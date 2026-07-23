import { UserDataFunctions } from '@microsoft/fabric-user-data-functions';

const udf = new UserDataFunctions();

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
 * A simple greeting function.
 *
 * Define the input/output types for this function in ./types.ts so that
 * RayfinClient can invoke it with full type-safety from your frontend app.
 */
udf.func('helloWorld', (firstName: string, lastName: string): string => {
  console.log(`helloWorld invoked for ${firstName} ${lastName}`);
  return `Hello ${firstName} ${lastName}!`;
}, []);

/**
 * Chat with Azure AI Foundry
 * Keeps the API key server-side for security
 */
udf.func(
  'chatWithAI',
  async (userMessage: string): Promise<AIResponse> => {
    const endpoint = process.env.VITE_AI_FOUNDRY_ENDPOINT;
    const apiKey = process.env.VITE_AI_FOUNDRY_API_KEY;

    console.log('[AI Chat Function] Processing message:', userMessage.substring(0, 50) + '...');

    if (!endpoint || !apiKey) {
      console.error('[AI Chat Function] Configuration missing');
      return {
        content: '❌ **Configuration Error**: AI Foundry not configured on server',
      };
    }

    try {
      console.log('[AI Chat Function] Calling endpoint:', endpoint);
      
      // Call Azure AI Foundry API using fetch
      const response = await fetch(`${endpoint}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey,
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: userMessage,
            },
          ],
          max_tokens: 1024,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[AI Chat Function] API error:', response.status, errorText);
        return {
          content: `❌ **API Error**: ${response.status}\n\nServer logs have details.`,
        };
      }

      const data = await response.json();
      console.log('[AI Chat Function] Response received');

      // Parse the response - Azure AI Foundry returns choices array
      const content = 
        data.choices?.[0]?.message?.content ||
        data.content ||
        data.text ||
        'No response from AI';

      return {
        content,
        // If API returns structured data, parse it here
        table: data.table,
        chart: data.chart,
      };
    } catch (error) {
      console.error('[AI Chat Function] Request failed:', error);
      return {
        content: `❌ **Error**: ${error instanceof Error ? error.message : 'Connection failed'}\n\nCheck server logs for details.`,
      };
    }
  },
  []
);
