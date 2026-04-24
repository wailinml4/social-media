# Service Layer Implementation

## Overview

The service layer abstracts all data fetching operations from components. Currently running in mock mode with simulated network delays and random error simulation (5% rate).

## Structure

- `api.js` - Base axios configuration with mock mode flag
- `postsService.js` - Posts CRUD with pagination
- `commentsService.js` - Comments operations
- `profileService.js` - User profile, posts, bookmarks
- `storiesService.js` - Stories operations
- `messagesService.js` - Chat/messaging operations
- `notificationsService.js` - Notifications operations

## Switching to Real API

1. Open `src/services/api.js`
2. Change `const USE_MOCK_API = true;` to `const USE_MOCK_API = false;`
3. Update `const BASE_URL = 'http://localhost:3000/api';` to your actual API endpoint
4. In each service file, replace the mock implementation in the `if (USE_MOCK_API)` block with real axios calls:

Example for `postsService.js`:

```javascript
export const getAll = async ({ offset = 0, limit = 10 } = {}) => {
  if (USE_MOCK_API) {
    await simulateDelay();
    simulateError();
    return mockPostsDB.slice(offset, offset + limit);
  }
  // Real API call
  const response = await api.get("/posts", { params: { offset, limit } });
  return response.data;
};
```

## Features

- **Network Delay Simulation**: 800ms delay for all mock requests
- **Error Simulation**: 5% random error rate for testing error handling
- **Pagination Support**: `getAll()` methods accept `{ offset, limit }` options
- **JSDoc Comments**: All methods documented
