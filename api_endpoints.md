# Turfly Backend API Endpoints

This document outlines all the available REST API endpoints in the Turfly backend.

## General Response Format

All successful API endpoints return a response in the following JSON format:

```json
{
  "success": true,
  "message": "A descriptive message",
  "data": { ... } // Response data, array, or null if no data
}
```

Error responses generally follow a similar structure but with `"success": false` and potentially an `"errors"` field.

---

## 🔐 Auth Routes (`/auth`)

| Method | Endpoint | Description | Success Response Message | Response Data |
|--------|----------|-------------|--------------------------|---------------|
| `POST` | `/auth/register` | Register a new user | `User registered successfully` | User object |
| `POST` | `/auth/login` | Log in a user | `Logged in successfully` | `{ accessToken, refreshToken }` |
| `POST` | `/auth/refresh-token` | Refresh auth token | `Token refreshed successfully` | `{ accessToken, refreshToken }` |
| `POST` | `/auth/logout` | Log out user | `Logged out successfully` | `null` |

---

## 👤 Users Routes (`/users`)

| Method | Endpoint | Description | Success Response Message | Response Data |
|--------|----------|-------------|--------------------------|---------------|
| `GET` | `/users/me` | Get current user profile | `Profile fetched successfully` | User object |
| `PATCH` | `/users/me` | Update current user profile | `Profile updated successfully` | User object |
| `GET` | `/users/` | Search/list users | `Users fetched successfully` | Array of User objects |
| `GET` | `/users/:id` | Get user by ID | `User fetched successfully` | User object |

---

## 🏟️ Venues Routes (`/venues`)

| Method | Endpoint | Description | Success Response Message | Response Data |
|--------|----------|-------------|--------------------------|---------------|
| `GET` | `/venues/` | Get all/search venues | `Venues fetched successfully` | Array of Venue objects |
| `GET` | `/venues/:id` | Get venue by ID | `Venue fetched successfully` | Venue object |
| `POST` | `/venues/` | Create a new venue | `Venue created successfully` | Venue object |
| `PATCH` | `/venues/:id` | Update a venue | `Venue updated successfully` | Venue object |
| `DELETE` | `/venues/:id` | Delete a venue | `Venue deleted successfully` | `null` |

---

## ⚽ Sports Routes (`/sports`)

| Method | Endpoint | Description | Success Response Message | Response Data |
|--------|----------|-------------|--------------------------|---------------|
| `GET` | `/sports/` | Get all sports | `Sports fetched successfully` | Array of Sport objects |
| `GET` | `/sports/:id` | Get sport by ID | `Sport fetched successfully` | Sport object |
| `POST` | `/sports/` | Create a sport | `Sport created successfully` | Sport object |
| `PATCH` | `/sports/:id` | Update a sport | `Sport updated successfully` | Sport object |
| `DELETE` | `/sports/:id` | Delete a sport | `Sport deleted successfully` | `null` |

---

## 🤝 Meetups Routes (`/meetups`)

| Method | Endpoint | Description | Success Response Message | Response Data |
|--------|----------|-------------|--------------------------|---------------|
| `GET` | `/meetups/` | Search meetups | `Meetups fetched successfully` | Array of Meetup objects |
| `GET` | `/meetups/:id` | Get meetup by ID | `Meetup fetched successfully` | Meetup object |
| `POST` | `/meetups/` | Create a meetup | `Meetup created successfully` | Meetup object |
| `PATCH` | `/meetups/:id` | Update a meetup | `Meetup updated successfully` | Meetup object |
| `DELETE` | `/meetups/:id` | Delete a meetup | `Meetup deleted successfully` | `null` |

---

## 👥 Participants Routes (`/participants`)

| Method | Endpoint | Description | Success Response Message | Response Data |
|--------|----------|-------------|--------------------------|---------------|
| `POST` | `/participants/:meetupId/join` | Join a meetup | `Join request sent successfully` | Participant object |
| `POST` | `/participants/:meetupId/leave` | Leave a meetup | `Left meetup successfully` | `null` |
| `PATCH` | `/participants/:meetupId/users/:userId/status` | Update participant status | `Participant status updated to <status>` | Participant object |

---

## 👫 Friendships Routes (`/friendships`)

| Method | Endpoint | Description | Success Response Message | Response Data |
|--------|----------|-------------|--------------------------|---------------|
| `POST` | `/friendships/request/:userId` | Send friend request | `Friend request sent` | Friendship object |
| `PATCH` | `/friendships/request/:userId/accept` | Accept friend request | `Friend request accepted` | Friendship object |
| `PATCH` | `/friendships/request/:userId/reject` | Reject friend request | `Friend request rejected` | `null` |
| `DELETE` | `/friendships/:userId` | Remove friend/unfollow | `Friend removed / Unfollowed successfully` | `null` |
| `GET` | `/friendships/followers` | Get followers | `Followers fetched successfully` | Array of User objects |
| `GET` | `/friendships/following` | Get following | `Following fetched successfully` | Array of User objects |

---

## ⭐ Reviews Routes (`/reviews`)

| Method | Endpoint | Description | Success Response Message | Response Data |
|--------|----------|-------------|--------------------------|---------------|
| `GET` | `/reviews/user/:userId` | Get reviews of a user | `Reviews fetched successfully` | Array of Review objects |
| `POST` | `/reviews/` | Create a review | `Review created successfully` | Review object |

---

## 💬 Chats Routes (`/chats`)

| Method | Endpoint | Description | Success Response Message | Response Data |
|--------|----------|-------------|--------------------------|---------------|
| `GET` | `/chats/` | Get user chats | `Chats fetched successfully` | Array of Chat objects |
| `GET` | `/chats/:chatId/messages` | Get chat messages | `Messages fetched successfully` | Array of Message objects |

---

## 🔔 Notifications Routes (`/notifications`)

| Method | Endpoint | Description | Success Response Message | Response Data |
|--------|----------|-------------|--------------------------|---------------|
| `GET` | `/notifications/` | Get user notifications | `Notifications fetched successfully` | Array of Notification objects |
| `PATCH` | `/notifications/:id/read` | Mark a notification as read| `Notification marked as read` | Notification object |
| `PATCH` | `/notifications/read-all` | Mark all as read | `All notifications marked as read` | `null` |
