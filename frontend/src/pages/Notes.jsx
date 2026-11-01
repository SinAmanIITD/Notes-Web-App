import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import * as notesApi from "../api/notes";
import NoteCard from "../components/NoteCard";
import NoteForm from "../components/NoteForm";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { logout } = useAuth();

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await notesApi.listNotes();
      setNotes(data);
    } catch {
      setError("Failed to load notes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleCreate = async (note) => {
    await notesApi.createNote(note);
    refresh();
  };

  const handleUpdate = async (note) => {
    await notesApi.updateNote(editing.id, note);
    setEditing(null);
    refresh();
  };

  const handleDelete = async (id) => {
    await notesApi.deleteNote(id);
    refresh();
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Notes</h2>
        <button className="btn btn-outline-secondary" onClick={logout}>
          Log out
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <NoteForm
        key={editing?.id || "new"}
        initial={editing}
        onSubmit={editing ? handleUpdate : handleCreate}
        onCancel={() => setEditing(null)}
      />

      {loading ? (
        <p>Loading...</p>
      ) : notes.length === 0 ? (
        <p className="text-muted">No notes yet — add one above.</p>
      ) : (
        <div className="row">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} onEdit={setEditing} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
