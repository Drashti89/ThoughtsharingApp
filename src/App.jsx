import Sidebar from "./components/Sidebar.jsx";
import NotesGrid from "./components/NotesGrid.jsx";
import NewThoughtModal from "./components/NewThoughtModal.jsx";
import SelectedThoughts from "./components/SelectedThoughts.jsx";
import WelcomePopup from "./components/WelcomePopup.jsx";
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
import { collection, addDoc, deleteDoc, doc, query, updateDoc, serverTimestamp, onSnapshot, orderBy, increment, arrayUnion, arrayRemove } from "firebase/firestore";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { normalizeTimestamp, toDate } from "./utils/timestampUtils";

export default function App() {
  const { user, logout, loading: authLoading } = useAuth();
  const dispatch = useDispatch();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  
  // Check if user is new (first time login)
  useEffect(() => {
    if (user && user.username) {
      const hasSeenWelcome = localStorage.getItem(`welcome_${user.uid}`);
      if (!hasSeenWelcome) {
        setShowWelcomePopup(true);
      }
    }
  }, [user]);

  // Mark welcome as seen
  const handleWelcomeClose = () => {
    if (user) {
      localStorage.setItem(`welcome_${user.uid}`, 'true');
    }
    setShowWelcomePopup(false);
  };

  // Handle start writing from welcome popup
  const handleWelcomeStartWriting = () => {
    handleWelcomeClose();
    dispatch(toggleAddModal(true));
  };
  
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



  // 🔄 Load all thoughts with visibility filtering
  useEffect(() => {
    if (user) {
      const q = query(collection(db, 'thoughts'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const allThoughts = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: normalizeTimestamp(data.createdAt) // Normalize to milliseconds
        };
      });

        // Filter thoughts based on visibility
        const filteredThoughts = allThoughts.filter(thought => {
          // If thought has no visibility field (old thoughts), treat as public
          const thoughtVisibility = thought.visibility || 'public';
          
          // Show public thoughts to everyone
          if (thoughtVisibility === 'public') {
            return true;
          }
          
          // Show private thoughts only to the owner
          if (thoughtVisibility === 'private') {
            return thought.userId === user.uid;
          }
          
          return true;
        });

        dispatch(setThoughts(filteredThoughts));
      });
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
            .then(() => toast.success("Thought deleted successfully 🗑️", { className: "custom-toast custom-toast-success" }))
            .catch(err => toast.error("Error deleting thought", { className: "custom-toast custom-toast-error" }));
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
    if (user && (user.isAdmin || updatedThought.userId === user.uid)) 
    {
      const { id, ...data } = updatedThought;
      updateDoc(doc(db, 'thoughts', updatedThought.id), data)
        .then(() => toast.success("Thought updated successfully ✅", { className: "custom-toast custom-toast-success" }))
        .catch(err => toast.error("Error updating thought", { className: "custom-toast custom-toast-error" }));
    }
  }

  function handleAddThoughts(thoughtData) {
    if (!user) return;

    const newThought = {
      ...thoughtData,
      userId: user.uid,
      username: user.username || 'Unknown',
      createdAt: serverTimestamp(),
      likedBy: []
    };

    addDoc(collection(db, 'thoughts'), newThought)
      .then(() => toast.success("Thought saved successfully ✅", { className: "custom-toast custom-toast-success" }))
      .catch(err => toast.error("Error saving thought", { className: "custom-toast custom-toast-error" }));
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
                likedBy: arrayRemove(user.uid)
            });
        } else {
             await updateDoc(thoughtRef, {
                likedBy: arrayUnion(user.uid)
            });
        }
    } catch (e) {
        toast.error("Failed to update like", { className: "custom-toast custom-toast-error" });
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
                window.location.href = "/set-username";


                // Force local update if needed, though auth listener might catch it
                // Logic relies on 'user' object from useAuth, which usually listens to auth state changes, 
                // but might not listen to Firestore 'users' doc changes automatically unless AuthContext does it.
                // Tricking the router by reloading is simplest or we assume AuthContext listens to db.
                // For now, let's just do the db update.
                toast.success("Username reset! Redirecting...", { className: "custom-toast custom-toast-success" });
            } catch (error) {
                toast.error("Failed to reset username", { className: "custom-toast custom-toast-error" });
            }
        }
    }
  }

  const selectedThought = thoughts.find(t => t.id === selectedThoughtId);

  let content;
  if (selectedThought) {
    content = (
      <div className="flex-1 w-full bg-white">
        <div className="max-w-4xl mx-auto px-4 py-6 md:px-8 md:py-12">
          <SelectedThoughts
            thought={selectedThought}
            onDelete={() => handleDeleteThought(selectedThought.id)}
            onEdit={handleEditThought}
            onCancel={handleCancelThought}
            user={user}
            onToggleLike={handleToggleLike}
          />
        </div>
      </div>
    );
  } else {
    content = (
      <div className="flex-1 w-full bg-white">
        <div className="max-w-6xl mx-auto px-4 py-6 md:px-8 md:py-12">
          <NotesGrid
            thoughts={thoughts}
            onSelectThought={handleSelectThought}
            selectedThoughtId={selectedThoughtId}
            onDelete={handleDeleteThought}
            user={user}
            onToggleLike={handleToggleLike}
            onStartWriting={handleStartThoughts}
          />
        </div>
      </div>
    );
  }

  const MainLayout = () => (
    <>
      {/* Hamburger Menu - Mobile Only */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-[60] p-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl hover:from-violet-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>


    <div className="pt-8 md:pt-0 flex flex-col md:flex-row bg-white">

        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onStartAddThought={handleStartThoughts}
          thoughts={thoughts}
          onSelectThought={handleSelectThought}
          selectedThoughtId={selectedThoughtId}
          onLogout={logout}
          user={user}
          onResetUsername={handleResetUsername}
        />

        {/* MAIN CONTENT */}
        <div
          className="
            flex-1
            transition-all duration-300
            pl-0
            md:pl-0
          "
        >
          {content}
        </div>

      </div>

  

      <NewThoughtModal
        isOpen={isAddModalOpen}
        onClose={() => dispatch(toggleAddModal(false))}
        onAdd={handleAddThoughts}
        user={user}
      />
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl border border-stone-100">
                <div className="text-center mb-6">
                    <span className="text-4xl block mb-3">🗑️</span>
                    <h3 className="text-xl font-bold text-stone-800 mb-2">Delete Thought?</h3>
                    <p className="text-stone-600">Are you sure you want to delete this memory? This action cannot be undone.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={cancelDelete}
                        className="flex-1 px-4 py-3 text-stone-600 hover:bg-stone-100 rounded-xl transition-all duration-200 font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={confirmDelete}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                    >
                        🗑️ Delete
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Welcome Popup */}
      <WelcomePopup
        isOpen={showWelcomePopup}
        onClose={handleWelcomeClose}
        onStartWriting={handleWelcomeStartWriting}
      />
    </>
  );

  if (authLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={true}
        closeOnClick={true}
        pauseOnHover={false}
        toastClassName="custom-toast"
        bodyClassName="custom-toast-body"
        limit={1}
        style={{ top: '20px', right: '20px' }}
        newestOnTop={true}
        closeButton={false}
        rtl={false}
      />
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/signup" element={!user ? <SignUp /> : <Navigate to="/" />} />
        <Route path="/set-username" element={user && user.emailVerified ? <SetUsername /> : <Navigate to="/" />} />
        
        <Route path="/admin" element={
          user && user.isAdmin ? (
             !user.username ? <Navigate to="/set-username" /> : <MainLayout />
          ) : <Navigate to="/" />
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
