package com.example.notesapp.repository;

import com.example.notesapp.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {

    Optional<Note> findByShareToken(String shareToken);

    @Query("SELECT n FROM Note n WHERE n.isPublic = true ORDER BY n.updatedAt DESC")
    List<Note> findPublicNotes();

    @Query("SELECT n FROM Note n ORDER BY n.updatedAt DESC")
    List<Note> findAllOrderByUpdatedAtDesc();
}