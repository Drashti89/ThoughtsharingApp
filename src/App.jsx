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

import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  updateDoc,
  serverTimestamp,
  onSnapshot,
  orderBy,
  arrayUnion,
  arrayRemove,
  where
} from "firebase/firestore";
import { db } from "./firebase";

import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { normalizeTimestamp } from "./utils/timestampUtils";

export default function App() {
  const { user, logout, loading: authLoading } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [thoughtToDeleteId, setThoughtToDeleteId] = useState(null);

  const { isAddModalOpen, selectedThoughtId } = useSelector(s => s.ui);
  const thoughts = useSelector(s => s.thoughts.items);

  /* ---------------- AUTH → REDUX ---------------- */
  useEffect(() => {
    if (authLoading) return;

    dispatch(
      user
        ? setUser({
            uid: user.uid,
            email: user.email,
            username: user.username,
            isAdmin: user.isAdmin,
            emailVerified: user.emailVerified
          })
        : setUser(null)
    );
  }, [user, authLoading, dispatch]);

  /* ---------------- FIRST TIME USER ---------------- */
 useEffect(() => {
  if (!user || !user.emailVerified) return;

  const unsub = onSnapshot(doc(db, "users", user.uid), snap => {
    if (!snap.exists()) {
      setIsFirstTimeUser(true);
      return;
    }

    const data = snap.data();
    const hasUsername = !!data.username;

    // controls redirect logic
    setIsFirstTimeUser(!hasUsername);

    // 🔴 THIS IS THE IMPORTANT PART
    if (hasUsername && user.username !== data.username) {
      dispatch(setUser({ ...user, username: data.username }));
    }
  });

  return () => unsub();
}, [user, dispatch]);


  /* ---------------- WELCOME POPUP ---------------- */
  useEffect(() => {
    if (!user || !user.username || isFirstTimeUser) return;

    if (!localStorage.getItem(`welcome_${user.uid}`)) {
      setShowWelcomePopup(true);
    }
  }, [user, isFirstTimeUser]);

  const handleWelcomeClose = () => {
    if (user) localStorage.setItem(`welcome_${user.uid}`, "true");
    setShowWelcomePopup(false);
  };

  const handleWelcomeStartWriting = () => {
    handleWelcomeClose();
    dispatch(toggleAddModal(true));
  };

  /* ---------------- THOUGHTS LISTENER (RULE SAFE) ---------------- */
  useEffect(() => {
    if (!user) return;

    const publicQuery = query(
      collection(db, "thoughts"),
      where("visibility", "==", "public"),
      orderBy("createdAt", "desc")
    );

    const ownQuery = query(
      collection(db, "thoughts"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    let ownUnsub = () => {};

    const publicUnsub = onSnapshot(publicQuery, pubSnap => {
      const publicThoughts = pubSnap.docs.map(d => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          createdAt: normalizeTimestamp(data.createdAt),
          updatedAt: data.updatedAt ? normalizeTimestamp(data.updatedAt) : null
        };
      });

      ownUnsub = onSnapshot(ownQuery, ownSnap => {
        const ownThoughts = ownSnap.docs.map(d => {
          const data = d.data();
          return {
            id: d.id,
            ...data,
            createdAt: normalizeTimestamp(data.createdAt),
            updatedAt: data.updatedAt ? normalizeTimestamp(data.updatedAt) : null
          };
        });

        const merged = [...publicThoughts, ...ownThoughts].sort((a, b) => {
          const tA = a.updatedAt ?? a.createdAt;
          const tB = b.updatedAt ?? b.createdAt;
          return tB - tA;
        });

        dispatch(setThoughts(merged));
      });
    });

    return () => {
      publicUnsub();
      ownUnsub();
    };
  }, [user, dispatch]);

  /* ---------------- ACTIONS ---------------- */
  const handleStartThoughts = () => dispatch(toggleAddModal(true));
  const handleCancelThought = () => dispatch(setSelectedThoughtId(undefined));
  const handleSelectThought = id => dispatch(setSelectedThoughtId(id));

  /* ---------------- DELETE ---------------- */
  const handleDeleteThought = id => {
    setThoughtToDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    const thought = thoughts.find(t => t.id === thoughtToDeleteId);
    if (thought && (user.isAdmin || thought.userId === user.uid)) {
      await deleteDoc(doc(db, "thoughts", thought.id));
      toast.success("Deleted your thoughts 🗑️");
    }
    setShowDeleteConfirm(false);
    setThoughtToDeleteId(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setThoughtToDeleteId(null);
  };

  /* ---------------- ADD ---------------- */
  const handleAddThoughts = async data => {
    if (!user) return;

    await addDoc(collection(db, "thoughts"), {
      ...data,
      userId: user.uid,
      username: user.username || "Unknown",
      visibility: data.visibility || "public",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      likedBy: []
    });

    toast.success("keep your memory saved  ✅");
  };

  /* ---------------- EDIT ---------------- */
  const handleEditThought = async updated => {
    if (!user) return;
    if (user.isAdmin || updated.userId === user.uid) {
      const { id, ...rest } = updated;
      await updateDoc(doc(db, "thoughts", id), {
        ...rest,
        updatedAt: serverTimestamp()
      });
      toast.success("Updated your Thoghts successfully ");
    }
  };

  /* ---------------- LIKE / UNLIKE ---------------- */
  const handleToggleLike = async id => {
    if (!user) return;
    const thought = thoughts.find(t => t.id === id);
    if (!thought) return;

    const liked = thought.likedBy.includes(user.uid);
    dispatch(toggleLikeOptimistic({ thoughtId: id, userId: user.uid }));

    try {
      await updateDoc(doc(db, "thoughts", id), {
        likedBy: liked ? arrayRemove(user.uid) : arrayUnion(user.uid),
      });
    } catch {
      dispatch(toggleLikeOptimistic({ thoughtId: id, userId: user.uid }));
      toast.error("Like failed");
    }
  };

  /* ---------------- RESET USERNAME ---------------- */
  const handleResetUsername = async () => {
    if (!user) return;
    if (!window.confirm("Are you sure you want to reset your username?")) return;

    await updateDoc(doc(db, "users", user.uid), { username: null });

    setIsFirstTimeUser(true);
    setShowWelcomePopup(false);

    navigate("/set-username", { replace: true });
  };

  const selectedThought = thoughts.find(t => t.id === selectedThoughtId);

  /* ---------------- MAIN LAYOUT (FIXED) ---------------- */
  const MainLayout = () => (
    <>
     <button
      onClick={() => setIsSidebarOpen(p => !p)}
      className="md:hidden fixed top-5 left-4 z-[60] w-14 h-14 flex items-center justify-center bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl shadow-xl"
    >
      <span className="text-xl">☰</span>
      </button>


      <div className="pt-8 md:pt-0 flex flex-col md:flex-row bg-white h-screen">
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

       <div className="flex-1 px-6 md:px-10 pt-5 md:pt-18 h-screen overflow-y-auto">
          {selectedThought ? (
            <div className="mt-6 md:mt-10">
              <SelectedThoughts
                thought={selectedThought}
                onEdit={handleEditThought}
                onDelete={() => handleDeleteThought(selectedThought.id)}
                onCancel={handleCancelThought}
                user={user}
                onToggleLike={handleToggleLike}
              />
            </div>

          ) : (
            <NotesGrid
              thoughts={thoughts}
              onSelectThought={handleSelectThought}
              selectedThoughtId={selectedThoughtId}
              onDelete={handleDeleteThought}
              user={user}
              onToggleLike={handleToggleLike}
              onStartWriting={handleStartThoughts}
            />
          )}
        </div>
      </div>
    </>
  );

  if (authLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <>
      <ToastContainer autoClose={2500} newestOnTop />

      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/signup" element={!user ? <SignUp /> : <Navigate to="/" />} />

        <Route
          path="/set-username"
          element={
            user && user.emailVerified && isFirstTimeUser
              ? <SetUsername />
              : <Navigate to="/" />
          }
        />

        <Route
          path="/admin"
          element={user && user.isAdmin ? <MainLayout /> : <Navigate to="/" />}
        />

        <Route
          path="/"
          element={
            user
              ? user.isAdmin
                ? <Navigate to="/admin" />
                : isFirstTimeUser
                  ? <Navigate to="/set-username" />
                  : <MainLayout />
              : <Home />
          }
        />
      </Routes>

      <NewThoughtModal
        isOpen={isAddModalOpen}
        onClose={() => dispatch(toggleAddModal(false))}
        onAdd={handleAddThoughts}
        user={user}
      />

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 w-[90%] max-w-sm shadow-2xl border border-stone-100">
            <h3 className="text-lg font-bold mb-4">Are you sure You want to delete Your Memory?</h3>
            <div className="flex gap-3 mt-6">
             <button
                onClick={cancelDelete}
                className="flex-1 px-4 py-3 bg-stone-100 text-stone-700 rounded-xl hover:bg-stone-200 transition"
            >
                Cancel
              </button>


              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:from-red-600 hover:to-pink-700 transition shadow-md"
              >
                🗑️ Delete
              </button>

            </div>
          </div>
        </div>
      )}

      <WelcomePopup
        isOpen={showWelcomePopup}
        onClose={handleWelcomeClose}
        onStartWriting={handleWelcomeStartWriting}
      />
    </>
  );
}
