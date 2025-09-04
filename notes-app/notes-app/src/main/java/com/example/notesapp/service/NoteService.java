package com.example.notesapp.service;

import com.example.notesapp.model.Note;
import com.example.notesapp.repository.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class NoteService {

    @Autowired
    private NoteRepository noteRepository;

    public List<Note> getAllNotes() {
        return noteRepository.findAllOrderByUpdatedAtDesc();
    }

    public Optional<Note> getNoteById(Long id) {
        return noteRepository.findById(id);
    }

    public Optional<Note> getNoteByShareToken(String shareToken) {
        return noteRepository.findByShareToken(shareToken);
    }

    public Note createNote(Note note) {
        if (note.getShareToken() == null || note.getShareToken().isEmpty()) {
            note.setShareToken(UUID.randomUUID().toString());
        }
        return noteRepository.save(note);
    }

    public Note updateNote(Long id, Note noteDetails) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note not found with id: " + id));

        note.setTitle(noteDetails.getTitle());
        note.setContent(noteDetails.getContent());
        note.setIsPublic(noteDetails.getIsPublic());

        return noteRepository.save(note);
    }

    public void deleteNote(Long id) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note not found with id: " + id));
        noteRepository.delete(note);
    }

    public Note togglePublicStatus(Long id) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note not found with id: " + id));
        note.setIsPublic(!note.getIsPublic());
        return noteRepository.save(note);
    }
}