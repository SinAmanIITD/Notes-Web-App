import client from "./client";

export const listNotes = () => client.get("/notes/").then((r) => r.data);
export const createNote = (note) => client.post("/notes/", note).then((r) => r.data);
export const updateNote = (id, note) => client.patch(`/notes/${id}/`, note).then((r) => r.data);
export const deleteNote = (id) => client.delete(`/notes/${id}/`);
