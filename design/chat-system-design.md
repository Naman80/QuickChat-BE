# Chat Application Data & API Design (WhatsApp-like)

## Tech Stack (Current Phase)

- Frontend: React
- Backend: Node.js + Express
- Realtime: WebSocket (Socket.IO / WS)
- Database (Phase-1): In-memory / PostgreSQL
- Database (Scale): Cassandra / DynamoDB
- Cache (Later): Redis

---

## 1. Core Design Principles

1. Messages are stored once.
2. User-specific state is stored separately.
3. Sidebar uses metadata, not messages.
4. Messages are fetched lazily and paginated.
5. Cursor-based pagination only.
6. Unread counts are precomputed.

---

## 2. Core Entities

- User
- Conversation
- ConversationParticipant
- Message
- MessageUserState

---

## 3. Database Schema

### 3.1 User

```sql
User (
  id UUID PRIMARY KEY,
  name VARCHAR,
  phone VARCHAR UNIQUE,
  createdAt TIMESTAMP
)
```

### 3.2 Conversation

```sql
Conversation (
  id UUID PRIMARY KEY,
  type ENUM('direct', 'group'),
  lastMessageId UUID,
  updatedAt TIMESTAMP,
  createdAt TIMESTAMP
)
```

### 3.3 ConversationParticipant

```sql
ConversationParticipant (
  conversationId UUID,
  userId UUID,
  role ENUM('admin', 'member'),
  lastReadMessageId UUID,
  unreadCount INT DEFAULT 0,
  joinedAt TIMESTAMP,
  leftAt TIMESTAMP NULL,
  PRIMARY KEY (conversationId, userId)
)
```

### 3.4 Message

```sql
Message (
  id UUID PRIMARY KEY,
  conversationId UUID,
  senderId UUID,
  content TEXT,
  contentType ENUM('text', 'image', 'video'),
  deletedForEveryone BOOLEAN DEFAULT FALSE,
  editedAt TIMESTAMP NULL,
  createdAt TIMESTAMP
)
```

### 3.5 MessageUserState

```sql
MessageUserState (
  messageId UUID,
  userId UUID,
  status ENUM('sent', 'delivered', 'read'),
  deletedForUser BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (messageId, userId)
)
```

---

## 4. Sidebar (Conversation List)

### API

```
GET /conversations
```

### Query

```sql
SELECT
  c.id,
  c.type,
  c.updatedAt,
  m.content,
  m.deletedForEveryone,
  m.createdAt AS lastMessageTime,
  cp.unreadCount
FROM ConversationParticipant cp
JOIN Conversation c ON c.id = cp.conversationId
LEFT JOIN Message m ON m.id = c.lastMessageId
WHERE cp.userId = ?
ORDER BY c.updatedAt DESC
LIMIT 30;
```

---

## 5. Open Chat (Paginated Messages)

### API

```
GET /conversations/:conversationId/messages?limit=30
```

### Query

```sql
SELECT m.*
FROM Message m
JOIN MessageUserState mus ON mus.messageId = m.id
WHERE m.conversationId = ?
  AND mus.userId = ?
  AND mus.deletedForUser = FALSE
ORDER BY m.createdAt DESC
LIMIT 30;
```

---

## 6. Pagination (Scroll Up)

### API

```
GET /conversations/:id/messages?before=timestamp&limit=30
```

### Query

```sql
SELECT m.*
FROM Message m
JOIN MessageUserState mus ON mus.messageId = m.id
WHERE m.conversationId = ?
  AND mus.userId = ?
  AND mus.deletedForUser = FALSE
  AND m.createdAt < ?
ORDER BY m.createdAt DESC
LIMIT 30;
```

---

## 7. Read Receipts

```sql
UPDATE ConversationParticipant
SET lastReadMessageId = ?, unreadCount = 0
WHERE conversationId = ? AND userId = ?;
```

---

## 8. Delete Message

### Delete for Me

```sql
UPDATE MessageUserState
SET deletedForUser = TRUE
WHERE messageId = ? AND userId = ?;
```

### Delete for Everyone

```sql
UPDATE Message
SET deletedForEveryone = TRUE;
```

---

## 9. Edit Message

```sql
UPDATE Message
SET content = ?, editedAt = NOW()
WHERE id = ? AND senderId = ?;
```

---

## 10. Scaling Notes

- Use indexes on (conversationId, createdAt).
- Sidebar queries must be metadata-only.
- Never fetch full chat history.
- Avoid OFFSET pagination.

---

## 11. Mental Model

Conversation → Thread  
Message → Immutable Event  
User State → Personal View  
Sidebar → Cached Metadata  
Chat Window → Paginated Stream
