# Bungie.net API Integration

This document outlines our implementation of the Bungie.net API using the official `bungie-api-ts` package, which provides comprehensive TypeScript definitions and API helpers.

## Table of Contents
1. [Setup and Installation](#setup-and-installation)
2. [Type System Overview](#type-system-overview)
3. [API Client Implementation](#api-client-implementation)
4. [Manifest Management](#manifest-management)
5. [Profile and Inventory](#profile-and-inventory)
6. [Best Practices](#best-practices)
7. [Common Use Cases](#common-use-cases)
8. [Error Handling](#error-handling)
9. [Performance Considerations](#performance-considerations)

## Setup and Installation

### Dependencies
```bash
npm install bungie-api-ts
```

### Environment Variables
```env
NEXT_PUBLIC_BUNGIE_API_KEY=your_api_key_here
```

## Type System Overview

### Key Type Imports
```typescript
// Import specific endpoints and types
import { 
  getProfile, 
  getDestinyManifest,
  getDestinyManifestSlice,
  HttpClientConfig 
} from 'bungie-api-ts/destiny2'

// Import type definitions
import { 
  DestinyInventoryComponent, 
  DestinyInventoryItemDefinition,
  ServerResponse,
  DestinyProfileResponse
} from 'bungie-api-ts/destiny2'
```

### HTTP Client Setup
```typescript
// Create a type-safe HTTP client
async function bungieHttpClient(config: HttpClientConfig): Promise<any> {
  const headers: Record<string, string> = {
    'X-API-Key': process.env.NEXT_PUBLIC_BUNGIE_API_KEY || '',
    ...config.params?.headers
  }

  if (config.params?.body) {
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(config.url, {
    method: config.params?.method || 'GET',
    headers,
    body: config.params?.body ? JSON.stringify(config.params.body) : undefined
  })

  if (!response.ok) {
    throw new Error(`Bungie API error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}
```

## API Client Implementation

### Making API Calls
```typescript
// Example: Getting a player profile
const profileResponse = await getProfile(bungieHttpClient, {
  components: [DestinyComponentType.Profiles, DestinyComponentType.Characters],
  destinyMembershipId: '12345',
  membershipType: BungieMembershipType.TigerPsn
})

// Response is fully typed
const profile: ServerResponse<DestinyProfileResponse> = profileResponse
```

## Manifest Management

### Downloading the Manifest
```typescript
// Get manifest metadata
const manifest = await getDestinyManifest(bungieHttpClient)

// Download specific tables with type safety
const manifestTables = await getDestinyManifestSlice(bungieHttpClient, {
  destinyManifest: manifest,
  tableNames: ['DestinyInventoryItemDefinition', 'DestinySocketDefinition'],
  language: 'en'
})

// Tables are fully typed
const items: Record<string, DestinyInventoryItemDefinition> = 
  manifestTables.DestinyInventoryItemDefinition
```

### Manifest Helper Functions
```typescript
// Type-safe manifest table fetching
async function getDefinitionTable<T extends keyof typeof DestinyDefinitions>(
  tableName: T
): Promise<typeof DestinyDefinitions[T]> {
  const manifest = await getDestinyManifest(bungieHttpClient)
  const tables = await getDestinyManifestSlice(bungieHttpClient, {
    destinyManifest: manifest,
    tableNames: [tableName],
    language: 'en'
  })
  return tables[tableName]
}

// Usage
const itemDefs = await getDefinitionTable('DestinyInventoryItemDefinition')
const socketDefs = await getDefinitionTable('DestinySocketDefinition')
```

## Common Use Cases

### Inventory Management
```typescript
// Get a player's inventory
async function getInventory(membershipType: BungieMembershipType, membershipId: string) {
  const response = await getProfile(bungieHttpClient, {
    components: [DestinyComponentType.ProfileInventories],
    destinyMembershipId: membershipId,
    membershipType
  })
  
  return response.Response.profileInventory.data
}

// Get item details
async function getItemDetails(itemHash: number) {
  const itemDefs = await getDefinitionTable('DestinyInventoryItemDefinition')
  return itemDefs[itemHash]
}
```

### Character Management
```typescript
// Get character details
async function getCharacterDetails(
  membershipType: BungieMembershipType,
  membershipId: string,
  characterId: string
) {
  const response = await getProfile(bungieHttpClient, {
    components: [
      DestinyComponentType.Characters,
      DestinyComponentType.CharacterInventories,
      DestinyComponentType.CharacterEquipment
    ],
    destinyMembershipId: membershipId,
    membershipType
  })
  
  return {
    character: response.Response.characters.data[characterId],
    inventory: response.Response.characterInventories.data[characterId],
    equipment: response.Response.characterEquipment.data[characterId]
  }
}
```

## Error Handling

### Type-Safe Error Handling
```typescript
interface BungieError extends Error {
  errorCode: number
  errorStatus: string
  messagingData?: Record<string, string>
}

async function handleBungieRequest<T>(
  request: Promise<ServerResponse<T>>
): Promise<T> {
  try {
    const response = await request
    
    if (response.ErrorCode !== 1) {
      const error = new Error(response.Message) as BungieError
      error.errorCode = response.ErrorCode
      error.errorStatus = response.ErrorStatus
      error.messagingData = response.MessageData
      throw error
    }
    
    return response.Response
  } catch (error) {
    if ((error as BungieError).errorCode) {
      // Handle Bungie-specific errors
      console.error('Bungie API Error:', error)
    } else {
      // Handle network or other errors
      console.error('Request Error:', error)
    }
    throw error
  }
}
```

## Performance Optimizations

### Manifest Caching
```typescript
import { IDBPDatabase, openDB } from 'idb'

interface ManifestCache {
  version: string
  tables: Record<string, unknown>
  timestamp: number
}

class ManifestManager {
  private db: IDBPDatabase | null = null
  private readonly DB_NAME = 'destiny2-manifest'
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

  async init() {
    this.db = await openDB(this.DB_NAME, 1, {
      upgrade(db) {
        db.createObjectStore('manifest')
      }
    })
  }

  async getTable<T>(tableName: string): Promise<T | null> {
    if (!this.db) await this.init()
    
    const cache: ManifestCache | undefined = await this.db!.get('manifest', tableName)
    
    if (cache && Date.now() - cache.timestamp < this.CACHE_DURATION) {
      return cache.tables as T
    }
    
    return null
  }

  async setTable(tableName: string, data: unknown, version: string) {
    if (!this.db) await this.init()
    
    const cache: ManifestCache = {
      version,
      tables: data,
      timestamp: Date.now()
    }
    
    await this.db!.put('manifest', cache, tableName)
  }
}
```

## Testing

### API Mocking
```typescript
// Mock HTTP client for testing
const mockHttpClient: typeof bungieHttpClient = async (config) => {
  // Mock responses based on URL
  if (config.url.includes('/Manifest/')) {
    return {
      Response: {
        version: '1234',
        jsonWorldContentPaths: {
          en: '/content/json/en/1234/'
        }
      },
      ErrorCode: 1
    }
  }
  
  throw new Error(`Unhandled mock URL: ${config.url}`)
}

describe('Manifest Management', () => {
  it('should fetch manifest metadata', async () => {
    const manifest = await getDestinyManifest(mockHttpClient)
    expect(manifest.Response.version).toBe('1234')
  })
})
```

## Best Practices

### Type Safety
- Always use the provided type definitions
- Avoid using `any` types
- Leverage type inference where possible

### API Usage
- Cache manifest data appropriately
- Respect rate limits
- Bundle component requests
- Use proper error handling

### Performance
- Implement manifest caching
- Use component batching
- Monitor API quotas
- Cache frequently accessed data

## Common Issues and Solutions

### Rate Limiting
```typescript
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  let lastError: Error
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      
      if ((error as BungieError).errorCode === 31) { // ThrottleError
        const delay = baseDelay * Math.pow(2, i)
        await new Promise(resolve => setTimeout(resolve, delay))
        continue
      }
      
      throw error
    }
  }
  
  throw lastError
}
```

### Token Management
```typescript
class TokenManager {
  private static readonly TOKEN_KEY = 'bungie_token'
  
  static async getToken(): Promise<string | null> {
    return localStorage.getItem(this.TOKEN_KEY)
  }
  
  static async setToken(token: string): Promise<void> {
    localStorage.setItem(this.TOKEN_KEY, token)
  }
  
  static async refreshToken(): Promise<string> {
    // Implement token refresh logic
    return ''
  }
}
```

## Additional Resources

- [Bungie API Documentation](https://bungie-net.github.io/)
- [bungie-api-ts Repository](https://github.com/DestinyItemManager/bungie-api-ts)
- [Destiny 2 Manifest Explorer](https://data.destinysets.com/)
- [DIM Documentation](https://github.com/DestinyItemManager/DIM/wiki) 