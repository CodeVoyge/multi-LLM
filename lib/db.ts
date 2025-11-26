// In-memory database store for demo purposes
// In production, replace with a real database (PostgreSQL, MongoDB, etc.)

export interface User {
  id: string
  email: string
  password: string
  role: "user" | "admin"
  createdAt: string
}

export interface ComparisonRequest {
  id: string
  userId: string
  prompt: string
  responses: {
    modelId: string
    modelName: string
    content: string
    score: number
    highlights: string[]
  }[]
  createdAt: string
  updatedAt: string
}

export interface LLMConfig {
  id: string
  name: string
  provider: string
  apiKey: string
  apiEndpoint: string
  active: boolean
  createdAt: string
}

export interface ComparisonLog {
  id: string
  userId: string
  prompt: string
  modelUsed: string[]
  responseTime: number
  createdAt: string
}

class Database {
  private users: Map<string, User> = new Map()
  private comparisons: Map<string, ComparisonRequest> = new Map()
  private llmConfigs: Map<string, LLMConfig> = new Map()
  private comparisonLogs: ComparisonLog[] = []
  private initialized = false

  // User methods
  addUser(user: User) {
    this.users.set(user.id, user)
  }

  getUserById(id: string): User | undefined {
    return this.users.get(id)
  }

  getUserByEmail(email: string): User | undefined {
    for (const user of this.users.values()) {
      if (user.email === email) return user
    }
    return undefined
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values())
  }

  // Comparison methods
  addComparison(comparison: ComparisonRequest) {
    this.comparisons.set(comparison.id, comparison)
  }

  getComparison(id: string): ComparisonRequest | undefined {
    return this.comparisons.get(id)
  }

  getUserComparisons(userId: string): ComparisonRequest[] {
    return Array.from(this.comparisons.values()).filter((c) => c.userId === userId)
  }

  getAllComparisons(): ComparisonRequest[] {
    return Array.from(this.comparisons.values())
  }

  // LLM Config methods
  addLLMConfig(config: LLMConfig) {
    this.llmConfigs.set(config.id, config)
  }

  getLLMConfig(id: string): LLMConfig | undefined {
    return this.llmConfigs.get(id)
  }

  getActiveLLMConfigs(): LLMConfig[] {
    return Array.from(this.llmConfigs.values()).filter((c) => c.active)
  }

  getAllLLMConfigs(): LLMConfig[] {
    return Array.from(this.llmConfigs.values())
  }

  updateLLMConfig(id: string, updates: Partial<LLMConfig>) {
    const config = this.llmConfigs.get(id)
    if (config) {
      this.llmConfigs.set(id, { ...config, ...updates })
    }
  }

  deleteLLMConfig(id: string) {
    this.llmConfigs.delete(id)
  }

  // Logging methods
  addComparisonLog(log: ComparisonLog) {
    this.comparisonLogs.push(log)
  }

  getComparisonLogs(userId?: string): ComparisonLog[] {
    if (userId) {
      return this.comparisonLogs.filter((l) => l.userId === userId)
    }
    return this.comparisonLogs
  }

  getAnalytics() {
    return {
      totalComparisons: this.comparisons.size,
      totalUsers: this.users.size,
      totalLogs: this.comparisonLogs.length,
      averageResponseTime:
        this.comparisonLogs.length > 0
          ? this.comparisonLogs.reduce((sum, log) => sum + log.responseTime, 0) / this.comparisonLogs.length
          : 0,
    }
  }

  initialize() {
    if (this.initialized) return

    // Add sample admin user
    if (!this.getUserByEmail("admin@example.com")) {
      this.addUser({
        id: "admin-001",
        email: "admin@example.com",
        password: "password123",
        role: "admin",
        createdAt: new Date().toISOString(),
      })
    }

    // Add sample regular user
    if (!this.getUserByEmail("user@example.com")) {
      this.addUser({
        id: "user-001",
        email: "user@example.com",
        password: "password123",
        role: "user",
        createdAt: new Date().toISOString(),
      })
    }

    // Add sample LLM configs
    if (this.getAllLLMConfigs().length === 0) {
      this.addLLMConfig({
        id: "config-001",
        name: "GPT-4 Turbo",
        provider: "OpenAI",
        apiKey: "sk-demo-key-placeholder",
        apiEndpoint: "https://api.openai.com/v1",
        active: true,
        createdAt: new Date().toISOString(),
      })

      this.addLLMConfig({
        id: "config-002",
        name: "Gemini Pro",
        provider: "Google",
        apiKey: "gemini-demo-key-placeholder",
        apiEndpoint: "https://api.google.com/v1",
        active: true,
        createdAt: new Date().toISOString(),
      })

      this.addLLMConfig({
        id: "config-003",
        name: "Claude 3 Opus",
        provider: "Anthropic",
        apiKey: "claude-demo-key-placeholder",
        apiEndpoint: "https://api.anthropic.com/v1",
        active: true,
        createdAt: new Date().toISOString(),
      })
    }

    this.initialized = true
  }
}

declare global {
  var dbInstance: Database | undefined
}

function getDb(): Database {
  if (!globalThis.dbInstance) {
    globalThis.dbInstance = new Database()
    globalThis.dbInstance.initialize()
  }
  return globalThis.dbInstance
}

export const db = getDb()
