// Helper function to generate helpful fallback responses
const generateHelpfulFallback = (userMessage = '') => {
  const lowerMessage = userMessage.toLowerCase();
  
  // Provide helpful responses based on common questions
  if (lowerMessage.includes('contact') || lowerMessage.includes('reach') || lowerMessage.includes('email')) {
    return 'Thank you for your interest in contacting us! You can reach THE DAY NEWS - Your Media Partner In Cyberspace through our contact page. We have a contact form where you can send us a message or submit a tip. You can also follow us on Facebook, YouTube, and LinkedIn for the latest updates.';
  }
  
  if (lowerMessage.includes('podcast') || lowerMessage.includes('episode')) {
    return 'Great question about our podcasts! THE DAY NEWS offers a variety of insightful podcast episodes. You can browse all our podcasts on the Podcasts page, or check out the Latest Podcast section on our homepage. Each episode includes detailed information, and you can watch the full episodes directly from our website.';
  }
  
  if (lowerMessage.includes('about') || lowerMessage.includes('who') || lowerMessage.includes('what')) {
    return 'THE DAY NEWS is Your Media Partner In Cyberspace! We are committed to delivering accurate, timely, and insightful news coverage. Our mission is to provide a platform where truth meets clarity, and information empowers action. We produce engaging podcasts and news content to keep you informed.';
  }
  
  if (lowerMessage.includes('tip') || lowerMessage.includes('submit') || lowerMessage.includes('contribute')) {
    return 'We\'d love to hear from you! You can submit tips or contribute story ideas through our contact page. Just fill out the contact form and check the "Submit a tip" option. Your contributions help us bring important stories to light!';
  }
  
  if (lowerMessage.includes('social') || lowerMessage.includes('facebook') || lowerMessage.includes('youtube') || lowerMessage.includes('linkedin')) {
    return 'You can follow THE DAY NEWS - Your Media Partner In Cyberspace on our social media platforms! Find us on Facebook at thedaynewsglobal, subscribe to our YouTube channel @TheDayNewsGlobal, and connect with us on LinkedIn. Stay updated with our latest content and news!';
  }
  
  // Default helpful response
  return 'Thank you for reaching out to THE DAY NEWS - Your Media Partner In Cyberspace! I\'m here to help you learn more about our podcasts, news content, and services. You can ask me about our latest episodes, how to contact us, our mission, or anything else about THE DAY NEWS. How can I assist you today?';
};

// @desc    Chat with AI chatbot
// @route   POST /api/chatbot
// @access  Public
export const chat = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ message: 'Messages array is required' });
    }

    // Check for GROQ_API_KEY (backend) or VITE_GROQ_API_KEY (fallback)
    const GROQ_API_KEY = process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY;
    const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

    if (!GROQ_API_KEY) {
      console.error('GROQ_API_KEY is missing from environment variables');
      console.error('Available env vars with GROQ:', Object.keys(process.env).filter(k => k.includes('GROQ')));
      return res.status(500).json({ 
        message: 'Chatbot API key is not configured. Please add GROQ_API_KEY to your server/.env file and restart the server.' 
      });
    }

    console.log('GROQ_API_KEY found:', GROQ_API_KEY ? `${GROQ_API_KEY.substring(0, 10)}...` : 'NOT FOUND');

    // System prompt with all website information
    const SYSTEM_PROMPT = `You are a helpful AI assistant for THE DAY NEWS website. Your Media Partner In Cyberspace.

**About THE DAY NEWS:**
THE DAY NEWS is a media production company that serves as "Your Media Partner In Cyberspace". We deliver accurate, timely, and insightful news coverage and engaging podcast content.

**Home Page Information:**
- Main heading: "Welcome to THE DAY NEWS"
- Tagline: "Your Media Partner In Cyberspace"
- Features:
  * Hero section with short video links from podcasts
  * Upcoming Podcasts section - showcasing upcoming podcast episodes with photos and descriptions
  * Latest Podcast section - displays the 4 most recent podcast episodes with thumbnails, descriptions, dates, and "View Full Episode" buttons
  * Podcasts are organized by sections/categories

**Podcasts Page:**
- Title: "All Podcasts"
- Description: "Discover our collection of insightful podcast episodes"
- Features:
  * Search functionality to find podcasts by name or description
  * Podcasts are grouped by sections/categories
  * Each podcast card shows: thumbnail image, name, description, date, duration, and "View Full Episode" button
  * Users can browse all available podcast episodes

**About Page:**
- Title: "About THE DAY NEWS"
- Mission Statement: We are committed to delivering accurate, timely, and insightful news coverage. Our mission is to provide a platform where truth meets clarity, and information empowers action. Through our daily news coverage and engaging podcast series, we strive to bridge the gap between complex global events and your understanding, making news accessible, relevant, and meaningful.
- Team: We have a dedicated team working to bring you quality content
- Contribution: We welcome contributions, tips, and story ideas from our community. Users can submit tips or contact us through the contact page.

**Contact Page:**
- Title: "Contact Us"
- Features:
  * Contact form with fields: Name, Email, Message, and option to "Submit a tip"
  * Social Media Links:
    - Facebook: https://www.facebook.com/thedaynewsglobal
    - YouTube: https://www.youtube.com/@TheDayNewsGlobal
    - LinkedIn: https://www.linkedin.com/company/the-day-news-global/
  * Users can send messages or submit tips through the contact form

**Key Information:**
- Company tagline: "Your Media Partner In Cyberspace"
- We produce podcasts and news content
- We have sections/categories for organizing content
- We feature upcoming podcasts to preview future content
- We showcase latest podcasts on the homepage
- Users can search and browse all podcasts
- We encourage community engagement through tips and contributions

**Your Role:**
- Answer questions about THE DAY NEWS, our content, podcasts, and services
- Help users navigate the website and find information
- Provide information about our mission, team, and how to contact us
- Be friendly, professional, and helpful
- Always mention "Your Media Partner In Cyberspace" when appropriate
- If asked about specific podcasts, guide users to the podcasts page or homepage
- If asked about contacting us, mention the contact page with the form and social media links
- If asked about contributing, mention the contact form has a "Submit a tip" option

Remember: You represent THE DAY NEWS - Your Media Partner In Cyberspace. Be helpful, informative, and maintain a professional yet friendly tone.`;

    // Prepare messages for Groq API
    // Map frontend message roles to Groq API roles
    const apiMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map(msg => {
        let role = msg.role;
        // Convert 'bot' or 'assistant' to 'assistant' for Groq API
        if (role === 'bot' || role === 'assistant') {
          role = 'assistant';
        }
        // Ensure 'user' role is correct
        if (role !== 'user' && role !== 'assistant') {
          role = 'user';
        }
        return {
          role: role,
          content: msg.content,
        };
      }),
    ];

    console.log('Sending to Groq API:', {
      messageCount: apiMessages.length,
      lastMessage: apiMessages[apiMessages.length - 1],
    });

    // Call Groq API
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: apiMessages,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Groq API error status:', response.status);
      console.error('Groq API error response:', errorData);
      
      // Get the last user message for context
      const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || '';
      const fallbackResponse = generateHelpfulFallback(lastUserMessage);
      
      // Still return 200 with helpful message instead of error
      return res.json({ 
        message: fallbackResponse 
      });
    }

    const data = await response.json();
    console.log('Groq API response:', {
      hasChoices: !!data.choices,
      choicesLength: data.choices?.length,
      firstChoice: data.choices?.[0],
    });

    // Check if response has the expected structure
    if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
      console.error('Invalid Groq API response structure:', JSON.stringify(data, null, 2));
      
      // Get the last user message for context
      const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || '';
      const fallbackResponse = generateHelpfulFallback(lastUserMessage);
      
      return res.json({ 
        message: fallbackResponse 
      });
    }

    const botResponse = data.choices[0]?.message?.content;
    
    if (!botResponse || botResponse.trim() === '') {
      console.error('No content in bot response:', JSON.stringify(data.choices[0], null, 2));
      
      // Get the last user message to provide a helpful fallback
      const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || '';
      
      // Provide a helpful fallback response based on the user's question
      const fallbackResponse = generateHelpfulFallback(lastUserMessage);
      
      return res.json({ 
        message: fallbackResponse 
      });
    }

    res.json({ 
      message: botResponse 
    });
  } catch (error) {
    console.error('Chatbot error:', error);
    
    // Get the last user message for context
    const lastUserMessage = req.body.messages?.filter(m => m.role === 'user').pop()?.content || '';
    const fallbackResponse = generateHelpfulFallback(lastUserMessage);
    
    // Return helpful message instead of error
    res.json({ 
      message: fallbackResponse 
    });
  }
};

