

## Database Relationships

```mermaid
erDiagram
    User ||--o{ Blog : creates
    User ||--o{ LogIn : has
    User }|--o{ Reading : tracks
    Blog }|--o{ Reading : in
    
    User {
        int id PK
        string username
        string name
        boolean disabled
        timestamp created_at
        timestamp updated_at
    }
    
    Blog {
        int id PK
        string author
        string url
        string title
        int likes
        int year
        int userId FK
        timestamp created_at
        timestamp updated_at
    }
    
    Reading {
        int id PK
        int user_id FK
        int blog_id FK
        boolean read
        timestamp created_at
        timestamp updated_at
    }
    
    LogIn {
        int id PK
        int user_id FK
        timestamp login_time
        timestamp created_at
        timestamp updated_at
    }
    
    Session {
        string sid PK
        json sess
        timestamp expire
    }

