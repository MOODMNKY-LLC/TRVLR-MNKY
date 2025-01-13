# Destiny 2 Manifest Manager

The `ManifestManager` class provides a robust solution for handling Destiny 2 manifest data in your application, supporting both local SQLite storage and Supabase integration. This guide explains how to use the manifest manager effectively in your app.

## Table of Contents
1. [Basic Usage](#basic-usage)
2. [Initialization](#initialization)
3. [Retrieving Data](#retrieving-data)
4. [Common Use Cases](#common-use-cases)
5. [Best Practices](#best-practices)
6. [Error Handling](#error-handling)

## Basic Usage

```typescript
import { ManifestManager } from '@/utils/manifest-manager'

// Create an instance
const manifestManager = new ManifestManager()

// Initialize (required before any operations)
await manifestManager.initialize()
```

## Initialization

The manifest manager needs to be initialized before use. This process:
- Checks for existing manifest files
- Downloads new manifest versions if needed
- Sets up SQLite and Supabase connections

```typescript
// In your app initialization (e.g., app/layout.tsx)
import { ManifestManager } from '@/utils/manifest-manager'

export async function generateMetadata() {
  const manifestManager = new ManifestManager()
  await manifestManager.initialize()
  return {
    // ... your metadata
  }
}
```

## Retrieving Data

### Getting Single Items

```typescript
// Get a specific item by hash
const gjallarhorn = await manifestManager.getDefinition<'DestinyInventoryItemDefinition'>(
  'DestinyInventoryItemDefinition',
  1363886209 // Gjallarhorn hash
)

if (gjallarhorn) {
  console.log(gjallarhorn.displayProperties.name)
  console.log(gjallarhorn.itemTypeDisplayName)
}
```

### Getting Entire Tables

```typescript
// Get all inventory items
const items = await manifestManager.getTable<'DestinyInventoryItemDefinition'>(
  'DestinyInventoryItemDefinition'
)

if (items) {
  // Filter for exotic weapons
  const exoticWeapons = Object.values(items).filter(item => 
    item.inventory?.tierTypeName === 'Exotic' && 
    item.itemType === 3
  )
}
```

### Using with Server Components

```typescript
// app/weapons/page.tsx
import { ManifestManager } from '@/utils/manifest-manager'

export default async function WeaponsPage() {
  const manager = new ManifestManager()
  await manager.initialize()
  
  const items = await manager.getTable<'DestinyInventoryItemDefinition'>(
    'DestinyInventoryItemDefinition'
  )
  
  const weapons = Object.values(items || {}).filter(item => 
    item.itemType === 3 // Weapons
  )
  
  return (
    <div>
      <h1>Weapons</h1>
      <div className="grid grid-cols-3 gap-4">
        {weapons.map(weapon => (
          <WeaponCard key={weapon.hash} weapon={weapon} />
        ))}
      </div>
    </div>
  )
}
```

### Using with Client Components

```typescript
'use client'

import { useState, useEffect } from 'react'
import { ManifestManager } from '@/utils/manifest-manager'
import type { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2'

export function WeaponSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const [weapons, setWeapons] = useState<DestinyInventoryItemDefinition[]>([])
  
  useEffect(() => {
    async function loadWeapons() {
      const manager = new ManifestManager()
      await manager.initialize()
      
      const items = await manager.getTable<'DestinyInventoryItemDefinition'>(
        'DestinyInventoryItemDefinition'
      )
      
      if (items) {
        const weaponsList = Object.values(items).filter(item => 
          item.itemType === 3 &&
          item.displayProperties.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setWeapons(weaponsList)
      }
    }
    
    loadWeapons()
  }, [searchTerm])
  
  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search weapons..."
      />
      <div className="weapon-results">
        {weapons.map(weapon => (
          <div key={weapon.hash}>
            {weapon.displayProperties.name}
          </div>
        ))}
      </div>
    </div>
  )
}
```

## Common Use Cases

### 1. Inventory Management

```typescript
async function getCharacterLoadout(characterId: string) {
  const manager = new ManifestManager()
  await manager.initialize()
  
  // Get equipped items from Bungie API
  const equipped = await getCharacterEquipment(characterId)
  
  // Enrich with manifest data
  const loadout = await Promise.all(
    equipped.map(async item => {
      const definition = await manager.getDefinition<'DestinyInventoryItemDefinition'>(
        'DestinyInventoryItemDefinition',
        item.itemHash
      )
      return {
        ...item,
        definition
      }
    })
  )
  
  return loadout
}
```

### 2. Activity Browser

```typescript
async function getAvailableActivities() {
  const manager = new ManifestManager()
  await manager.initialize()
  
  const activities = await manager.getTable<'DestinyActivityDefinition'>(
    'DestinyActivityDefinition'
  )
  
  return Object.values(activities || {}).filter(activity =>
    activity.activityModes?.includes(2) // Raids
  )
}
```

### 3. Vendor Inventory

```typescript
async function getVendorInventory(vendorHash: number) {
  const manager = new ManifestManager()
  await manager.initialize()
  
  // Get vendor definition
  const vendorDef = await manager.getDefinition<'DestinyVendorDefinition'>(
    'DestinyVendorDefinition',
    vendorHash
  )
  
  // Get current inventory from Bungie API
  const inventory = await getVendorItems(vendorHash)
  
  // Enrich with manifest data
  return {
    vendor: vendorDef,
    items: await Promise.all(
      inventory.map(async item => ({
        ...item,
        definition: await manager.getDefinition<'DestinyInventoryItemDefinition'>(
          'DestinyInventoryItemDefinition',
          item.itemHash
        )
      }))
    )
  }
}
```

## Best Practices

1. **Initialization**
   - Initialize the manager as early as possible in your app lifecycle
   - Consider using a singleton pattern for the manager instance
   - Close the manager when it's no longer needed

2. **Performance**
   - Cache results when appropriate
   - Use table-level queries instead of individual item queries when possible
   - Consider using Supabase for distributed deployments

3. **Error Handling**
   - Always check for null returns from getDefinition and getTable
   - Implement retry logic for network operations
   - Provide fallback UI for when manifest data is unavailable

## Error Handling

```typescript
async function safeManifestOperation<T>(
  operation: () => Promise<T>
): Promise<T | null> {
  try {
    const manager = new ManifestManager()
    await manager.initialize()
    return await operation()
  } catch (error) {
    console.error('Manifest operation failed:', error)
    // Implement your error reporting here
    return null
  } finally {
    manager.close()
  }
}

// Usage example
const weapon = await safeManifestOperation(async () => {
  return await manager.getDefinition<'DestinyInventoryItemDefinition'>(
    'DestinyInventoryItemDefinition',
    1363886209
  )
})
```

## Environment Setup

Ensure these environment variables are set in your `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
BUNGIE_API_KEY=your_bungie_api_key
```

## Testing

Use the provided test script to verify your setup:

```bash
npm run test:manifest
```

This will run through basic operations and verify that the manifest manager is working correctly. 