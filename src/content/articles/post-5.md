---
title: "The Sneaky Database Connection Pool Bug That Almost Ruined Our Demo"
pubDate: 2025-05-23
description: "Have you ever encountered a bug that seems to play hide and seek with you? One that makes everything look perfect during development and testing, only to rear its ugly head at the worst possible moment? Well, let me tell you about the most frustrating 48 hours of our recent development cycle."
image:
    url: "/images/post-5/thumbnail.png"
    alt: "Thumbnail"
author: 'Karan Rajbhar'
tags: ["Database", "Connection Pool", "Bug", "Google Cloud Run"]
slug: "database-connection-pool-bug-demo"
---

## The Sneaky Database Connection Pool Bug That Almost Ruined Our Demo

Have you ever encountered a bug that seems to play hide and seek with you? One that makes everything look perfect during development and testing, only to rear its ugly head at the worst possible moment? Well, let me tell you about the most frustrating 48 hours of our recent development cycle.

## The Beginning: A Simple Seed Script Problem

Our team was deep into developing our application, and like most development teams, we had a seed script that would populate our database with test data on every deployment. It was a pretty standard setup - nothing fancy, just a script that would run and feed data into our PostgreSQL database.

But then things started getting weird. Sometimes our seed script would just... hang. It would get stuck for no apparent reason, and we couldn't figure out why. The script would work fine most of the time, but occasionally it would freeze, forcing us to restart the deployment process.

## Enter Cursor AI: The "Solution"

Frustrated with these random hangs, we decided to ask Cursor AI for help. After analyzing our database connection code, the AI suggested that our application running on Google Cloud Run was never properly releasing database connections. The theory made sense - if connections weren't being closed properly, the seed script could get stuck waiting for available connections.

The AI recommended we modify our database connector from a singleton pattern that reused a single connection to a connection pool pattern. Here's what we changed:

## The Code Changes

**Before (Original Singleton Pattern):**
```python
class DatabaseConnector:
    _instance = None

    def __new__(cls, config: Optional[Dict[str, Any]] = None):
        """Implement singleton pattern"""
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self, config: Optional[Dict[str, Any]] = None):
        """Initialize with database configuration."""
        if not hasattr(self, 'initialized'):
            self.config = config or {
                'dbname': str(settings.POSTGRES_DB),
                'user': str(settings.POSTGRES_USER),
                'password': str(settings.POSTGRES_PASSWORD),
                'host': str(settings.POSTGRES_HOST),
                'port': str(settings.POSTGRES_PORT)
            }
            self._conn = None
            self.initialized = True
    
    def connect(self) -> None:
        """Establish database connection."""
        if not self._conn or self._conn.closed:
            try:
                self._conn = psycopg2.connect(**self.config)
            except psycopg2.Error as e:
                logger.error(f"Failed to connect to database: {str(e)}")
                raise RuntimeError(f"Database connection failed: {str(e)}")

# Global database instance - single connection reused everywhere
db = DatabaseConnector()
```

**After (Connection Pool Pattern):**
```python
class DatabaseConnector:
    _pool = None

    @classmethod
    def initialize_pool(cls, config: Optional[Dict[str, Any]] = None):
        """Initialize the connection pool once at application startup"""
        if cls._pool is None:
            db_config = config or {
                'dbname': str(settings.POSTGRES_DB),
                'user': str(settings.POSTGRES_USER),
                'password': str(settings.POSTGRES_PASSWORD),
                'host': str(settings.POSTGRES_HOST),
                'port': str(settings.POSTGRES_PORT)
            }
            try:
                cls._pool = pool.ThreadedConnectionPool(
                    minconn=1,
                    maxconn=20,
                    **db_config
                )
                logger.info("Database connection pool initialized")
            except psycopg2.Error as e:
                logger.error(f"Failed to initialize connection pool: {str(e)}")
                raise RuntimeError(f"Database connection pool initialization failed: {str(e)}")
    
    def connect(self) -> None:
        """Get a connection from the pool"""
        if not self._conn or self._conn.closed:
            try:
                self._conn = DatabaseConnector._pool.getconn()
                # Set autocommit to True by default for read operations
                self._conn.autocommit = True
            except psycopg2.Error as e:
                logger.error(f"Failed to get connection from pool: {str(e)}")
                raise RuntimeError(f"Database connection failed: {str(e)}")

    def return_to_pool(self) -> None:
        """Return the connection to the pool"""
        if self._conn and not self._conn.closed:
            # Make sure we're not leaving transactions open
            if not self._conn.autocommit:
                try:
                    self._conn.rollback()
                except:
                    pass
            DatabaseConnector._pool.putconn(self._conn)
            self._conn = None

# FastAPI dependency for request-scoped database connections
def get_db() -> Generator[DatabaseConnector, None, None]:
    """Get database connector for dependency injection in FastAPI."""
    db = DatabaseConnector()  # Get a fresh connection from the pool
    try:
        yield db
    finally:
        db.close()  # Return connection to pool when request is done
```

The key changes Cursor AI suggested:
- **Replace singleton with connection pool**: Instead of one persistent connection, use a pool of 1-20 connections
- **Request-scoped connections**: Each API request gets its own connection from the pool
- **Proper cleanup**: Connections are returned to the pool after each request
- **Better resource management**: No more hanging connections blocking the seed script

## The False Victory

After implementing these changes, everything seemed perfect. The seed script executed in seconds instead of hanging. Deployments became smooth and fast. Our tests passed, manual testing worked flawlessly, and we felt like we'd solved a major architectural issue.

For about 24 hours, we were heroes.

## The Plot Twist: The 30-Minute Time Bomb

Then disaster struck, and it couldn't have come at a worse time. The day before our important demo, one of our team members was doing some final testing when he noticed something alarming - all our APIs were returning empty results.

At first, I thought it was just a deployment issue. Maybe the app was still starting up, or there was a temporary glitch. But when I checked the database directly, all our data was there. Everything looked normal from the database side.

That's when I decided to dig into the Google Cloud Run logs, and there it was - the smoking gun:

```
Database connection could not be established because connection pool is full
```

## The Revelation: A Time-Delayed Bug

This was the most insidious type of bug - one that doesn't show up immediately. Here's what was actually happening:

1. **Fresh deployment**: Everything works perfectly because the connection pool starts empty
2. **Initial testing**: All APIs work fine, manual testing passes, everything seems great
3. **The 30-45 minute mark**: The connection pool gradually fills up as connections aren't being properly returned
4. **Total failure**: Once the pool is full, no new connections can be established, and all APIs start failing

The tricky part was that this bug had a delayed onset. When you deploy and immediately test, everything works. Your integration tests pass, your manual testing works, and you think you've fixed the original problem. But then, after about 30-45 minutes of normal operation, the application would suddenly break.

## The Real Fix

Looking back at our "solution," we realized we'd introduced a new problem while trying to solve the original one. Our connection pool implementation had a subtle flaw - connections weren't being properly returned to the pool in all scenarios, especially during error conditions.

We had to go back and ensure that:
- Connections are always returned to the pool, even when exceptions occur
- The `finally` blocks properly handle connection cleanup
- Error scenarios don't leave connections hanging
- We're using context managers correctly for automatic resource management

## Lessons Learned

1. **Time-delayed bugs are the worst**: Some bugs only manifest after your application has been running for a while. Always do extended testing, not just immediate post-deployment checks.

2. **Pool management is tricky**: Connection pools seem simple in theory, but proper resource management requires careful attention to all code paths, especially error handling.

3. **Monitor your resources**: Set up alerts for connection pool usage, database connection counts, and other resource metrics. Don't wait for total failure to discover resource leaks.

4. **Test the fix, not just the feature**: When you fix one problem, make sure you haven't introduced another. Our "fix" actually created a worse problem than the original.

5. **Always have a rollback plan**: If we hadn't caught this before the demo, it would have been a disaster. Always be prepared to quickly revert changes.

## The Happy Ending

We caught the bug just in time, fixed the connection pool management properly, and our demo went off without a hitch. But it was a close call that reminded us why thorough testing and monitoring are so crucial in production applications.

The irony? Our original seed script hanging issue was probably just a minor timeout problem that could have been fixed with a simple connection timeout adjustment. Instead, we over-engineered a solution that created a much more serious problem.

Sometimes the simplest fix is the right fix. But when it isn't, make sure you test thoroughly - not just for 5 minutes after deployment, but for the long haul.

---

*Have you ever encountered a similar time-delayed bug? Share your war stories in the comments below. These kinds of experiences make us all better developers!*