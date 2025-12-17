import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { toDate } from '../utils/timestampUtils';

export default function Admin({ user }) {
  const [allThoughts, setAllThoughts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "thoughts"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const thoughts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAllThoughts(thoughts);
        setLoading(false);
      },
      (error) => {
        console.error("Firestore error:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this thought?")) return;
    await deleteDoc(doc(db, "thoughts", id));
  };

  return (
    <div className="w-[35rem] mt-16">
      <h1 className="text-2xl font-bold mb-2">Admin Panel</h1>
      <p className="mb-6">Welcome Admin 👑</p>

      <h2 className="text-xl font-semibold mb-4">All Users' Thoughts</h2>

      {loading && <p className="text-stone-500">Loading thoughts...</p>}

      {!loading && allThoughts.length === 0 && (
        <p className="text-stone-500">No thoughts yet</p>
      )}

      {!loading && allThoughts.length > 0 && (
        <ul className="space-y-4">
          {allThoughts.map((t) => (
            <li
              key={t.id}
              className="p-4 bg-white rounded-lg shadow-md"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-stone-700 mb-2">{t.title}</h3>
                  <p className="text-stone-600 whitespace-pre-wrap text-base leading-relaxed mb-2">
                    {t.description}
                  </p>
                  <p className="text-stone-500 text-sm">
                    {t.username || 'Unknown'} • Created: {
                      toDate(t.createdAt).toLocaleDateString()
                    }
                  </p>
                </div>

                <button
                  onClick={() => handleDelete(t.id)}
                  className="px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 text-sm ml-4"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
