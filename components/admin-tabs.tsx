'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { APIManagement } from './admin/api-management'
import { AdminAnalytics } from './admin/admin-analytics'

export function AdminTabs() {
  return (
    <Tabs defaultValue="apis" className="w-full">
      <TabsList className="bg-slate-800 border border-slate-700">
        <TabsTrigger value="apis">LLM APIs</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
      </TabsList>

      <TabsContent value="apis" className="space-y-4">
        <APIManagement />
      </TabsContent>

      <TabsContent value="analytics" className="space-y-4">
        <AdminAnalytics />
      </TabsContent>
    </Tabs>
  )
}
