package com.example.notesapp.controller;

import com.example.notesapp.model.Note;
import com.example.notesapp.service.NoteService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "http://localhost:3000")
public class NoteController {

    @Autowired
    private NoteService noteService;

    @GetMapping
    public List<Note> getAllNotes() {
        return noteService.getAllNotes();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Note> getNoteById(@PathVariable Long id) {
        return noteService.getNoteById(id)
                .map(note -> ResponseEntity.ok().body(note))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/share/{shareToken}")
    public ResponseEntity<Note> getNoteByShareToken(@PathVariable String shareToken) {
        return (ResponseEntity<Note>) (ResponseEntity<Note>) noteService.getNoteByShareToken(shareToken)
                .map(note -> {
                    if (note.getIsPublic()) {
                        return ResponseEntity.ok().body(note);
                    } else {
                        return ResponseEntity.notFound().build();
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Note createNote(@Valid @RequestBody Note note) {
        return noteService.createNote(note);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Note> updateNote(@PathVariable Long id, @Valid @RequestBody Note noteDetails) {
        try {
            Note updatedNote = noteService.updateNote(id, noteDetails);
            return ResponseEntity.ok(updatedNote);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/toggle-public")
    public ResponseEntity<Note> togglePublicStatus(@PathVariable Long id) {
        try {
            Note updatedNote = noteService.togglePublicStatus(id);
            return ResponseEntity.ok(updatedNote);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNote(@PathVariable Long id) {
        try {
            noteService.deleteNote(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}