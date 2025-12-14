/**
 * FIRESTORE WRITE LOGIC - Creating Thoughts with Username
 * Location: src/App.jsx
 */

// ✅ CORRECT IMPLEMENTATION
function handleAddThoughts(thoughtData) {
  const newThought = {
    ...thoughtData,                          // title, description
    userId: user.uid,                        // Firebase Auth UID (for permissions)
    username: user.username || 'Unknown',    // Duplicated username (for display)
    createdAt: serverTimestamp()             // Firestore server timestamp
  };

  addDoc(collection(db, 'thoughts'), newThought)
    .catch((err) => console.error('Error adding thought:', err));
}

/**
 * FIRESTORE READ LOGIC - Fetching Thoughts with Usernames
 * Location: src/App.jsx
 */

// ✅ CORRECT IMPLEMENTATION
useEffect(() => {
  if (user) {
    const q = query(
      collection(db, 'thoughts'),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allThoughts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()  // Includes: title, description, userId, username, createdAt
      }));
      
      setThoughtsState(prev => ({...prev, thoughts: allThoughts}));
    });

    return () => unsubscribe();
  }
}, [user]);

/**
 * UI DISPLAY - Showing Username
 * Location: ThoughtsFeed.jsx, SelectedThoughts.jsx, Admin.jsx
 */

// ✅ CORRECT IMPLEMENTATION
<p className="text-stone-500 text-sm">
  {thought.username || 'Unknown'} • Created: {new Date(thought.createdAt).toLocaleDateString()}
</p>

/**
 * WHY DUPLICATE USERNAME?
 * 
 * ❌ BAD (Normalized - requires N+1 queries):
 * - Store only userId
 * - Fetch username on every display
 * - 100 thoughts = 100 extra Firestore reads
 * - Slow and expensive
 * 
 * ✅ GOOD (Denormalized - 1 query):
 * - Store userId AND username
 * - Display immediately
 * - 100 thoughts = 1 Firestore read
 * - Fast and cheap
 * 
 * Trade-off: If user changes username, must update all their thoughts
 * (But this is rare, and reads are far more common than username changes)
 */

/**
 * FIRESTORE STRUCTURE
 */

// users/{uid}
{
  username: "johndoe",
  createdAt: Timestamp
}

// thoughts/{autoId}
{
  title: "My thought",
  description: "Description here",
  userId: "abc123xyz",      // For ownership checks
  username: "johndoe",      // For display (DUPLICATED from users)
  createdAt: Timestamp
}
