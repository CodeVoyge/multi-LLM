'use server'

import { initializeSampleData } from './db-utils'

export async function initializeDatabase() {
  await initializeSampleData()
}
