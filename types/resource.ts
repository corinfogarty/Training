import { Resource, Category, User } from '@prisma/client'

export interface ResourceWithRelations extends Resource {
  category?: Category
  favoritedBy?: User[]
  completedBy?: User[]
} 