import Sidebar from "./components/Sidebar.jsx";
import NotesGrid from "./components/NotesGrid.jsx";
import NewThoughtModal from "./components/NewThoughtModal.jsx";
import SelectedThoughts from "./components/SelectedThoughts.jsx";
import Login from "./components/Login.jsx";
import SignUp from "./components/SignUp.jsx";
import SetUsername from "./components/SetUsername.jsx";
import Home from "./components/Home.jsx";

import { useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./store/authSlice";
import { setSelectedThoughtId, toggleAddModal } from "./store/uiSlice";
import { setThoughts, toggleLikeOptimistic } from "./store/thoughtsSlice";

import { db } from "./firebase";
import { collection, addDoc, deleteDoc, doc, query, updateDoc, serverTimestamp, onSnapshot, orderBy, runTransaction, increment, arrayUnion, arrayRemove } from "firebase/firestore";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  const { user, logout, loading: authLoading } = useAuth();
  const dispatch = useDispatch();
  
  // Sync Context Auth to Redux
  useEffect(() => {
    if (!authLoading) {
      if (user) {
        // Redux expects a serializable object
        dispatch(setUser({
            uid: user.uid,
            email: user.email,
            username: user.username,
            isAdmin: user.isAdmin,
            emailVerified: user.emailVerified
        }));
      } else {
        dispatch(setUser(null));
      }
    }
  }, [user, authLoading, dispatch]);

  const { isAddModalOpen, selectedThoughtId } = useSelector(state => state.ui);
  const thoughts = useSelector(state => state.thoughts.items);


  // 🔄 Load all thoughts
  // 🔄 Load all thoughts
  useEffect(() => {
    if (user) {
      const q = query(collection(db, 'thoughts'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const allThoughts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        dispatch(setThoughts(allThoughts));
      }, (err) => console.error(err));
      return () => unsubscribe();
    }
  }, [user, dispatch]);

  function handleStartThoughts() {
    dispatch(toggleAddModal(true));
  }

  function handleCancelThought() {
    dispatch(setSelectedThoughtId(undefined));
  }

  function handleSelectThought(id) {
    dispatch(setSelectedThoughtId(id));
  }

  // 🗑️ Delete Confirmation State
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [thoughtToDeleteId, setThoughtToDeleteId] = useState(null);

  function handleDeleteThought(id) {
    setThoughtToDeleteId(id);
    setShowDeleteConfirm(true);
  }

  function confirmDelete() {
    if (thoughtToDeleteId) {
        const thoughtToDelete = thoughts.find(thought => thought.id === thoughtToDeleteId);
        if (user && (user.isAdmin || thoughtToDelete.userId === user.uid)) {
          deleteDoc(doc(db, 'thoughts', thoughtToDeleteId))
            .then(() => toast.success("Thought deleted successfully 🗑️"))
            .catch(err => toast.error("Error deleting thought"));
        }
    }
    setShowDeleteConfirm(false);
    setThoughtToDeleteId(null);
  }

  function cancelDelete() {
    setShowDeleteConfirm(false);
    setThoughtToDeleteId(null);
  }

  function handleEditThought(updatedThought) {
    if (user && updatedThought.userId === user.uid) {
      const { id, ...data } = updatedThought;
      updateDoc(doc(db, 'thoughts', updatedThought.id), data)
        .then(() => toast.success("Thought updated successfully ✅"))
        .catch(err => toast.error("Error updating thought"));
    }
  }

  function handleAddThoughts(thoughtData) {
    const newThought = {
      ...thoughtData,
      userId: user.uid,
      username: user.username || 'Unknown',
      createdAt: serverTimestamp(),
      likesCount: 0,
      likedBy: []
    };
    addDoc(collection(db, 'thoughts'), newThought)
      .then(() => toast.success("Thought saved successfully ✅"))
      .catch(err => toast.error("Error saving thought"));
  }

  async function handleToggleLike(thoughtId) {
    if (!user) return;
    const thoughtRef = doc(db, 'thoughts', thoughtId);
    
    // Optimistic Update
    dispatch(toggleLikeOptimistic({ thoughtId, userId: user.uid }));

    try {
        const thought = thoughts.find(t => t.id === thoughtId);
        const alreadyLiked = thought && thought.likedBy && thought.likedBy.includes(user.uid);

        if (alreadyLiked) {
             await updateDoc(thoughtRef, {
                likesCount: increment(-1),
                likedBy: arrayRemove(user.uid)
            });
        } else {
             await updateDoc(thoughtRef, {
                likesCount: increment(1),
                likedBy: arrayUnion(user.uid)
            });
        }
    } catch (e) {
        console.error("Like failed", e);
        toast.error("Failed to update like");
        // Revert optimistic update ideally, but simpler for now just to error
    }
  }

  async function handleResetUsername() {
    if (user) {
        if (window.confirm("Are you sure you want to reset your username?")) {
            try {
                await updateDoc(doc(db, 'users', user.uid), {
                    username: null
                });
                // Force local update if needed, though auth listener might catch it
                // Logic relies on 'user' object from useAuth, which usually listens to auth state changes, 
                // but might not listen to Firestore 'users' doc changes automatically unless AuthContext does it.
                // Tricking the router by reloading is simplest or we assume AuthContext listens to db.
                // For now, let's just do the db update.
                toast.success("Username reset! Redirecting...");
            } catch (error) {
                console.error("Error resetting username:", error);
                toast.error("Failed to reset username");
            }
        }
    }
  }

  const selectedThought = thoughts.find(t => t.id === selectedThoughtId);

  let content;
  if (selectedThought) {
    content = (
      <div className="flex-1 h-screen overflow-y-auto p-4 bg-stone-100">
        <SelectedThoughts
          thought={selectedThought}
          onDelete={() => handleDeleteThought(selectedThought.id)}
          onEdit={handleEditThought}
          onCancel={handleCancelThought}
          user={user}
          onToggleLike={handleToggleLike}
        />
      </div>
    );
  } else {
    content = (
      <div className="flex-1 h-screen overflow-y-auto bg-stone-100">
        <NotesGrid
          thoughts={thoughts}
          onSelectThought={handleSelectThought}
          selectedThoughtId={selectedThoughtId}
          onDelete={handleDeleteThought}
          user={user}
          onToggleLike={handleToggleLike}
        />
      </div>
    );
  }

  const MainLayout = () => (
    <>
      <div className="my-10 flex h-screen overflow-hidden bg-stone-100">
        <Sidebar
          onStartAddThought={handleStartThoughts}
          thoughts={thoughts}
          onSelectThought={handleSelectThought}
          selectedThoughtId={selectedThoughtId}
          onLogout={logout}
          user={user}
          onResetUsername={handleResetUsername}
        />
        {content}
      </div>
      <NewThoughtModal
        isOpen={isAddModalOpen}
        onClose={() => dispatch(toggleAddModal(false))}
        onAdd={handleAddThoughts}
        user={user}
      />
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-xl">
                <h3 className="text-xl font-bold text-stone-800 mb-4">Confirm Delete</h3>
                <p className="text-stone-600 mb-6">do you want to delte your memories ?</p>
                <div className="flex justify-end gap-3">
                    <button 
                        onClick={cancelDelete}
                        className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-md transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={confirmDelete}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
      )}
    </>
  );

  if (authLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/signup" element={!user ? <SignUp /> : <Navigate to="/" />} />
        <Route path="/set-username" element={user && user.emailVerified ? <SetUsername /> : <Navigate to="/login" />} />
        
        <Route path="/admin" element={
          user && user.isAdmin ? (
             !user.username ? <Navigate to="/set-username" /> : <MainLayout />
          ) : <Navigate to="/login" />
        } />

        <Route path="/" element={
          user ? (
            user.isAdmin ? <Navigate to="/admin" /> : 
            (!user.username ? <Navigate to="/set-username" /> : <MainLayout />)
          ) : <Home />
        } />
      </Routes>
    </Router>
  );
}
