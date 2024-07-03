const mongoose = require("mongoose");
const Note = require('../models/note');
const User = require('../models/user');
const { notes } = require("../config/logging");
const log = notes;
const NodeRSA = require('node-rsa');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');

let key_private = new NodeRSA();
let key_public = new NodeRSA();

var public = fs.readFileSync('./Keys/public.pem', 'utf8');
var private = fs.readFileSync('./Keys/private.pem', 'utf8');

key_private.importKey(private);
key_public.importKey(public);

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'utils/uploads/pdf'); 
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Set the file name
  }
});

const upload = multer({ storage: storage }).single('pdf');

// ====================================================
// Add a new note to the schema
// POST: /api/notes/
// ====================================================
exports.addMessage = (req, res, next) => {
  upload(req, res, function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    log.info('Incoming post request to add a new message');
    const senderID = req.body.senderId;
    const receiverId = req.body.receiverId;
    const userMessage = req.body.message;
    const pdfDetails = req.file ? {
      url: req.file.path,
      fileName: req.file.originalname,
      fileSize: req.file.size
    } : null;

    // Check if the senderId and receiverId exist.
    // Find sender id
    User.countDocuments({ _id: senderID }, (err, count) => {
      if (err) return res.status(400).json({ error: err.message });

      if (count <= 0) {
        return res.status(404).json('User with id ' + senderID + ' not found!');
      }

      // Find receiverId
      User.countDocuments({ _id: receiverId }, (err, count) => {
        if (err) return res.status(400).json({ error: err.message });

        if (count <= 0) {
          return res.status(404).json('User with id ' + receiverId + ' not found!');
        } else {
          log.info('Both users found');
          const note = new Note({
            _id: new mongoose.Types.ObjectId(),
            senderId: senderID,
            receiverId: receiverId,
            message: userMessage,
            pdf: pdfDetails // save PDF details if provided
          });

          User.findById(receiverId).select('info.name').exec((err, receiverName) => {
            if (err) return res.status(400).json({ message: `Cannot add note. Error = ${err.message}`, error: err });

            if (!receiverName) return res.status(404).json({ message: 'Not found' });

            note.save(error => {
              if (error) return res.status(400).json({ message: `Cannot add note. Error = ${error.message}`, error: error });

              return res.status(200).json({ message: 'Successfully added a note.', userNote: note, receiverName: receiverName });
            });
          });
        }
      });
    });
  });
};

// ====================================================
// Updates an existing note (read or unread)
// PUT: /api/notes/
// ====================================================
exports.updateStatus = (req, res, next) => {
  const noteID = req.body.noteID; // id of the note
  log.info(`Note id = ${noteID}`);

  Note.findByIdAndUpdate(noteID, { status: 'read' }, (err, data) => {
    if (err) return res.status(400).json({ message: 'Invalid ID supplied', error: err });

    if (!data) {
      return res.status(404).json({ message: 'Note not found' });
    }

    log.info('status successfully updated' + data);
    return res.status(200).json({ message: 'Status successfully updated.' });
  });
};

// ====================================================
// Fetch all the notes received by a user
// GET: /api/notes/:userId
// ====================================================
exports.getNotesForUser = (req, res, next) => {
  const userID = req.params.userId;

  // Check if user id exists:
  User.countDocuments({ _id: userID }, (err, count) => {
    if (err) return res.status(400).json({ error: err.message });

    if (count <= 0) {
      return res.status(404).json('User with id ' + userID + ' not found!');
    }

    // Find all the notes sent to userID
    Note.find({ $or: [{ receiverId: userID }, { senderId: userID }] })
      .sort({ createdAt: -1 })
      .populate({ path: 'senderId', select: 'info.name' })
      .exec((error, foundNotes) => {
        if (error) return res.status(400).json({ error: error.message });

        if (foundNotes.length === 0) return res.status(404).json({ message: `${userID} has not received any notes.` });

        foundNotes.forEach(currentUser => {
          if (currentUser.senderId.info.name.length > 60) {
            currentUser.senderId.info.name = key_private.decrypt(currentUser.senderId.info.name, 'utf8');
          }
        });

        return res.status(200).json({ foundNotes: foundNotes });
      });
  });
};

// ====================================================
// Delete a note
// DELETE: /api/notes/:noteId
// ====================================================
exports.deleteNote = (req, res, next) => {
  const noteID = req.params.noteId;

  log.info(`Deleting note with note id = ${noteID}`);

  Note.findByIdAndDelete(noteID, (error, data) => {
    if (error) return res.status(400).json({ error: error.message });

    if (!data) return res.status(404).json({ message: 'Notes does not exist.' });

    return res.status(200).json({ message: 'Note deleted' });
  });
};
