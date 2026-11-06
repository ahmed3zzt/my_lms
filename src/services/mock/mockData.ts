import type { Category, Course, Lesson, Tag, Profile } from '@/types'
import siteData from '@/data'

export const mockProfile: Profile = {
  id: '00000000-0000-0000-0000-000000000001',
  full_name: siteData.profile.name,
  title: siteData.profile.title,
  bio: siteData.profile.bio,
  avatar_url: siteData.profile.avatarUrl,
  github_url: siteData.profile.links.github,
  linkedin_url: siteData.profile.links.linkedin,
  portfolio_url: siteData.profile.links.portfolio,
  email: siteData.profile.email,
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z'
}

export const mockCategories: Category[] = [
  {
    id: '10000000-0000-0000-0000-000000000001',
    name: 'Distributed Systems',
    slug: 'distributed-systems',
    description: 'Consensus protocols, replication, fault tolerance, and event-driven architectures.',
    icon: 'Network',
    sort_order: 1,
    created_at: '2025-01-01T00:00:00Z',
    course_count: 2
  },
  {
    id: '10000000-0000-0000-0000-000000000002',
    name: 'Databases & Storage Engines',
    slug: 'databases',
    description: 'PostgreSQL internals, LSM-trees, B-Trees, MVCC, and query optimization.',
    icon: 'Database',
    sort_order: 2,
    created_at: '2025-01-01T00:00:00Z',
    course_count: 1
  },
  {
    id: '10000000-0000-0000-0000-000000000003',
    name: 'Linux & Systems Programming',
    slug: 'linux-systems',
    description: 'Kernel subsystems, system calls, eBPF, sockets, and memory management.',
    icon: 'Terminal',
    sort_order: 3,
    created_at: '2025-01-01T00:00:00Z',
    course_count: 1
  },
  {
    id: '10000000-0000-0000-0000-000000000004',
    name: 'Clean Architecture & Go',
    slug: 'clean-architecture',
    description: 'Designing modular, scalable, testable microservices in Golang.',
    icon: 'Layers',
    sort_order: 4,
    created_at: '2025-01-01T00:00:00Z',
    course_count: 1
  }
]

export const mockTags: Tag[] = [
  { id: '20000000-0000-0000-0000-000000000001', name: 'Go', slug: 'go', created_at: '2025-01-01T00:00:00Z' },
  { id: '20000000-0000-0000-0000-000000000002', name: 'PostgreSQL', slug: 'postgresql', created_at: '2025-01-01T00:00:00Z' },
  { id: '20000000-0000-0000-0000-000000000003', name: 'Raft', slug: 'raft', created_at: '2025-01-01T00:00:00Z' },
  { id: '20000000-0000-0000-0000-000000000004', name: 'Linux', slug: 'linux', created_at: '2025-01-01T00:00:00Z' },
  { id: '20000000-0000-0000-0000-000000000005', name: 'Architecture', slug: 'architecture', created_at: '2025-01-01T00:00:00Z' }
]

export const mockCourses: Course[] = [
  {
    id: '30000000-0000-0000-0000-000000000001',
    category_id: '10000000-0000-0000-0000-000000000001',
    title: 'Building Distributed Systems in Go',
    slug: 'building-distributed-systems-go',
    description: 'A deep-dive masterclass into consensus algorithms, leader election, log replication, and RPC communication with practical Go implementations.',
    cover_image_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    is_featured: true,
    is_published: true,
    sort_order: 1,
    lesson_count: 3,
    created_at: '2025-01-10T00:00:00Z',
    updated_at: '2025-01-10T00:00:00Z'
  },
  {
    id: '30000000-0000-0000-0000-000000000002',
    category_id: '10000000-0000-0000-0000-000000000002',
    title: 'PostgreSQL Internals: From Disk to Query Execution',
    slug: 'postgresql-internals',
    description: 'Understand how Postgres works under the hood: write-ahead logging (WAL), MVCC, buffer cache, B-Trees, and EXPLAIN ANALYZE mastery.',
    cover_image_url: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80',
    is_featured: true,
    is_published: true,
    sort_order: 2,
    lesson_count: 2,
    created_at: '2025-01-15T00:00:00Z',
    updated_at: '2025-01-15T00:00:00Z'
  },
  {
    id: '30000000-0000-0000-0000-000000000003',
    category_id: '10000000-0000-0000-0000-000000000003',
    title: 'Linux Systems Programming & Performance Tuning',
    slug: 'linux-systems-programming',
    description: 'Explore epoll, non-blocking I/O, cgroups, perf profiling, and optimizing high-throughput network services in Linux.',
    cover_image_url: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=800&q=80',
    is_featured: false,
    is_published: true,
    sort_order: 3,
    lesson_count: 1,
    created_at: '2025-01-20T00:00:00Z',
    updated_at: '2025-01-20T00:00:00Z'
  }
]

export const mockLessons: Lesson[] = [
  {
    id: '40000000-0000-0000-0000-000000000001',
    course_id: '30000000-0000-0000-0000-000000000001',
    title: 'Implementing Raft Leader Election in Go',
    slug: 'implementing-raft-leader-election-go',
    description: 'Learn how nodes in a Raft cluster elect a leader using randomized heartbeat timeouts, term increments, and RPC vote requests.',
    youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    github_repo_url: 'https://github.com/ahmedezz/raft-go-example',
    reading_time_minutes: 12,
    sort_order: 1,
    is_published: true,
    published_at: '2025-01-12T10:00:00Z',
    created_at: '2025-01-12T10:00:00Z',
    updated_at: '2025-01-12T10:00:00Z',
    tags: [mockTags[0], mockTags[2]],
    attachments: [
      {
        id: '50000000-0000-0000-0000-000000000001',
        lesson_id: '40000000-0000-0000-0000-000000000001',
        title: 'raft_election_starter.zip',
        file_url: 'https://example.com/raft_election_starter.zip',
        file_type: 'application/zip',
        file_size: 2457600,
        created_at: '2025-01-12T10:00:00Z'
      },
      {
        id: '50000000-0000-0000-0000-000000000002',
        lesson_id: '40000000-0000-0000-0000-000000000001',
        title: 'Raft_Leader_Election_Cheatsheet.pdf',
        file_url: 'https://example.com/Raft_Leader_Election_Cheatsheet.pdf',
        file_type: 'application/pdf',
        file_size: 1048576,
        created_at: '2025-01-12T10:00:00Z'
      }
    ],
    content_markdown: `## Overview

In distributed systems, achieving consensus in the presence of faulty nodes is one of the foundational challenges. The **Raft Consensus Algorithm** was designed by Diego Ongaro and John Ousterhout to provide the same safety guarantees as Paxos while being significantly more understandable.

In this lesson, we will build the **Leader Election** subsystem in Go.

> [!NOTE]
> Leader election ensures that at any given moment in time, at most one leader can be recognized by a majority of nodes for a given term.

---

## State Machine Architecture

Every Raft peer transitions between three primary states:
1. **Follower**: Passive listener. Responds to incoming RPCs from leaders and candidates.
2. **Candidate**: Initiates election if heartbeat timer expires.
3. **Leader**: Manages log replication and sends periodic heartbeats.

\`\`\`mermaid
stateDiagram-v2
    [*] --> Follower: Initialize
    Follower --> Candidate: Heartbeat Timeout
    Candidate --> Candidate: Split Vote Timeout
    Candidate --> Leader: Receives Majority Votes
    Candidate --> Follower: Discovers Current Leader
    Leader --> Follower: Discovers Higher Term
\`\`\`

---

## Go Implementation: Node Definition

Let's declare our Raft peer structure with thread-safe mutex protections and channel notifications:

\`\`\`go
package raft

import (
	"sync"
	"time"
)

type NodeState int

const (
	Follower NodeState = iota
	Candidate
	Leader
)

type RaftNode struct {
	mu        sync.Mutex
	peers     []*RaftClient
	id        int
	
	// Persistent state on all servers
	currentTerm int
	votedFor    int
	
	// Volatile state
	state          NodeState
	heartbeatReset chan struct{}
}

func NewRaftNode(id int, peers []*RaftClient) *RaftNode {
	return &RaftNode{
		id:             id,
		peers:          peers,
		currentTerm:    0,
		votedFor:       -1,
		state:          Follower,
		heartbeatReset: make(chan struct{}, 1),
	}
}
\`\`\`

---

## RequestVote RPC Structs

When a node transitions to the **Candidate** state, it broadcasts a \`RequestVote\` RPC to all peers in the cluster:

| Field | Type | Description |
| :--- | :--- | :--- |
| \`Term\` | \`int\` | Candidate's current election term |
| \`CandidateID\` | \`int\` | Unique ID of candidate requesting vote |
| \`LastLogIndex\` | \`int\` | Index of candidate's last log entry |
| \`LastLogTerm\` | \`int\` | Term of candidate's last log entry |

\`\`\`go
type RequestVoteArgs struct {
	Term         int
	CandidateID  int
	LastLogIndex int
	LastLogTerm  int
}

type RequestVoteReply struct {
	Term        int
	VoteGranted bool
}
\`\`\`

> [!IMPORTANT]
> Always randomize your election timeout (typically between 150ms and 300ms) to reduce split-vote probability across competing candidates!

---

## Next Steps

In the next lesson, we will hook this state machine into the log replication loop and implement commit indexing.
`
  },
  {
    id: '40000000-0000-0000-0000-000000000002',
    course_id: '30000000-0000-0000-0000-000000000001',
    title: 'Raft Log Replication & Safety Invariants',
    slug: 'raft-log-replication-safety',
    description: 'How Raft guarantees consistency across distributed logs, handling network partitions and leader crashes.',
    youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    github_repo_url: 'https://github.com/ahmedezz/raft-go-example',
    reading_time_minutes: 15,
    sort_order: 2,
    is_published: true,
    published_at: '2025-01-18T10:00:00Z',
    created_at: '2025-01-18T10:00:00Z',
    updated_at: '2025-01-18T10:00:00Z',
    tags: [mockTags[0], mockTags[2]],
    content_markdown: `## Log Replication Flow

Once a leader is elected, it begins accepting commands from clients and replicating them through \`AppendEntries\` RPC calls.

\`\`\`mermaid
sequenceDiagram
    participant Client
    participant Leader
    participant Follower1
    participant Follower2

    Client->>Leader: Submit Command
    Leader->>Follower1: AppendEntries(Term, LogEntry)
    Leader->>Follower2: AppendEntries(Term, LogEntry)
    Follower1-->>Leader: Success ACK
    Follower2-->>Leader: Success ACK
    Leader->>Leader: Commit Log Entry
    Leader-->>Client: Return Success
\`\`\`

### Invariants Maintained
1. **Election Safety**: At most one leader can be elected in a given term.
2. **Leader Append-Only**: A leader never overwrites or truncates its own entries.
3. **Log Matching Property**: If two logs contain an entry with the same index and term, then the logs are identical in all entries up through the given index.
`
  },
  {
    id: '40000000-0000-0000-0000-000000000003',
    course_id: '30000000-0000-0000-0000-000000000002',
    title: 'PostgreSQL MVCC & Tuple Visibility',
    slug: 'postgresql-mvcc-tuple-visibility',
    description: 'Inspect xmin, xmax, page headers, and understand how Postgres executes concurrent transactions without read locks.',
    youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    github_repo_url: 'https://github.com/ahmedezz/postgres-mvcc-notes',
    reading_time_minutes: 10,
    sort_order: 1,
    is_published: true,
    published_at: '2025-01-22T10:00:00Z',
    created_at: '2025-01-22T10:00:00Z',
    updated_at: '2025-01-22T10:00:00Z',
    tags: [mockTags[1]],
    content_markdown: `## Introduction to MVCC

PostgreSQL uses Multi-Version Concurrency Control (MVCC) to ensure that **readers never block writers, and writers never block readers**.

Each tuple on disk contains metadata headers:
- \`xmin\`: The transaction ID that inserted this row.
- \`xmax\`: The transaction ID that deleted or updated this row (0 if active).

\`\`\`sql
-- Inspect row metadata directly using pageinspect extension
CREATE EXTENSION IF NOT EXISTS pageinspect;

SELECT t_xmin, t_xmax, t_ctid, t_data 
FROM heap_page_items(get_raw_page('users', 0));
\`\`\`

> [!TIP]
> Always configure \`autovacuum\` to periodically clean dead tuples and prevent transaction ID wraparound!
`
  }
]
