import { db } from './db'

export async function initializeSampleData() {
  // Add sample admin user
  const existingAdmin = db.getUserByEmail('admin@example.com')
  if (!existingAdmin) {
    db.addUser({
      id: 'admin-001',
      email: 'admin@example.com',
      password: 'password123', // In production, use hashed passwords
      role: 'admin',
      createdAt: new Date().toISOString(),
    })
  }

  // Add sample LLM configs
  if (db.getAllLLMConfigs().length === 0) {
    db.addLLMConfig({
      id: 'config-001',
      name: 'GPT-4 Turbo',
      provider: 'OpenAI',
      apiKey: 'sk-demo-key-placeholder',
      apiEndpoint: 'https://api.openai.com/v1',
      active: true,
      createdAt: new Date().toISOString(),
    })

    db.addLLMConfig({
      id: 'config-002',
      name: 'Gemini Pro',
      provider: 'Google',
      apiKey: 'gemini-demo-key-placeholder',
      apiEndpoint: 'https://api.google.com/v1',
      active: true,
      createdAt: new Date().toISOString(),
    })

    db.addLLMConfig({
      id: 'config-003',
      name: 'Claude 3 Opus',
      provider: 'Anthropic',
      apiKey: 'claude-demo-key-placeholder',
      apiEndpoint: 'https://api.anthropic.com/v1',
      active: true,
      createdAt: new Date().toISOString(),
    })
  }
}
