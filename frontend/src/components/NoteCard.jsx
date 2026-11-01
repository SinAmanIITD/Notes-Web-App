export default function NoteCard({ note, onEdit, onDelete }) {
  return (
    <div className="col-md-4 mb-3">
      <div className="card h-100 shadow-sm">
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{note.title}</h5>
          <p className="card-text flex-grow-1" style={{ whiteSpace: "pre-wrap" }}>
            {note.content}
          </p>
          <small className="text-muted mb-2">
            Updated {new Date(note.updated_at).toLocaleString()}
          </small>
          <div className="d-flex gap-2">
            <button className="btn btn-sm btn-outline-primary" onClick={() => onEdit(note)}>
              Edit
            </button>
            <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(note.id)}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
