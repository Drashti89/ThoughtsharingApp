// Test script to verify username update logic
// This simulates the Firestore update process

console.log("Testing username update logic...");

// Mock data
const mockUser = {
    uid: "test-user-123",
    username: "oldusername"
};

const mockThoughts = [
    {
        id: "thought-1",
        userId: "test-user-123",
        username: "oldusername",
        title: "First thought",
        description: "This is my first thought"
    },
    {
        id: "thought-2", 
        userId: "test-user-123",
        username: "oldusername",
        title: "Second thought",
        description: "This is my second thought"
    },
    {
        id: "thought-3",
        userId: "other-user-456",
        username: "otheruser",
        title: "Other user's thought",
        description: "This belongs to another user"
    }
];

// Simulate the update logic
const newUsername = "newusername";

console.log("\nBefore update:");
console.log("User username:", mockUser.username);
console.log("Thoughts:");
mockThoughts.forEach(thought => {
    console.log(`  - ${thought.title} by ${thought.username} (userId: ${thought.userId})`);
});

// Update user username
mockUser.username = newUsername;

// Update thoughts belonging to this user
const updatedThoughts = mockThoughts.map(thought => {
    if (thought.userId === mockUser.uid) {
        return {
            ...thought,
            username: newUsername
        };
    }
    return thought;
});

console.log("\nAfter update:");
console.log("User username:", mockUser.username);
console.log("Thoughts:");
updatedThoughts.forEach(thought => {
    console.log(`  - ${thought.title} by ${thought.username} (userId: ${thought.userId})`);
});

// Verify the results
const userThoughts = updatedThoughts.filter(thought => thought.userId === mockUser.uid);
const allUserThoughtsHaveNewUsername = userThoughts.every(thought => thought.username === newUsername);
const otherUserThoughtsUnchanged = updatedThoughts.filter(thought => thought.userId !== mockUser.uid).every(thought => thought.username !== newUsername);

console.log("\nTest results:");
console.log("✅ All user's thoughts have new username:", allUserThoughtsHaveNewUsername);
console.log("✅ Other users' thoughts unchanged:", otherUserThoughtsUnchanged);
console.log("✅ Total thoughts updated:", userThoughts.length);

if (allUserThoughtsHaveNewUsername && otherUserThoughtsUnchanged) {
    console.log("\n🎉 Username update logic test PASSED!");
} else {
    console.log("\n❌ Username update logic test FAILED!");
}