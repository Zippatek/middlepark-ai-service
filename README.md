# MiddlePark AI Service (Microservice)

This is the standalone AI Agent microservice for MiddlePark Properties. It handles the customer-facing chat widget API and the Customer Service admin dashboard.

## 🚀 How to Run

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   # LLM Provider (gemini or openai)
   AI_PROVIDER=gemini
   GOOGLE_GEMINI_API_KEY=your_key_here
   # OPENAI_API_KEY=your_key_here

   # Dashboard Auth
   NEXT_PUBLIC_AGENT_DASHBOARD_TOKEN=middlepark-cs-2026
   ```

3. **Start the Development Server**
   ```bash
   npm run dev -- -p 3001
   ```
   *Note: We run it on port 3001 to avoid conflicting with the main MiddlePark Next.js app running on port 3000.*

4. **Access the Application**
   - **CS Dashboard:** `http://localhost:3001/dashboard`
   - **Chat API Endpoint:** `http://localhost:3001/api/chat`
   - **Conversations API:** `http://localhost:3001/api/conversations`

## Integration with Main App

To use the widget on the main MiddlePark website, simply copy the `src/ai-agent/client/ChatWidget.tsx` component into your main project, and update its internal `fetch()` calls to point to `http://localhost:3001/api/chat` instead of relative paths.
