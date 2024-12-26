const RASA_SERVER_URL = import.meta.env.VITE_RASA_SERVER_URL || 'http://localhost:5005';

class RasaService {
  async sendMessage(message, sessionId) {
    try {
      const response = await fetch(`${RASA_SERVER_URL}/webhooks/rest/webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: sessionId,
          message: message
        }),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error sending message to Rasa:', error);
      throw error;
    }
  }

  async trackEvent(event, sessionId) {
    try {
      const response = await fetch(`${RASA_SERVER_URL}/conversations/${sessionId}/tracker/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error tracking event:', error);
      throw error;
    }
  }
}

export const rasaService = new RasaService();
