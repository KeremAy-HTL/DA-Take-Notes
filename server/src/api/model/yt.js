/* eslint-disable camelcase */
import query from '../../db/lite.js';

const getEverything = () =>
  query(`
  SELECT v.video_id,
       v.videourl,
       v.title AS videotitel,
       v.videolength AS zeitlaenge,
       n.noteid AS notiz_id,
       yn.timestamp AS zeitpunkt,
       n.content AS inhalt,
       n.title as title
FROM video v
LEFT JOIN youtubenote yn ON v.video_id = yn.video_id
LEFT JOIN note n ON yn.noteid = n.noteid
WHERE n.user_id = 1;`);

const getApi = (videourl) =>
  query('SELECT video_id, videourl, title, videolength FROM Video WHERE videourl = ?;', [videourl]);

// const insertNotiz = (titel, inhalt, zeitpunkt, video_id) => {
//   const insertQuery = `
//       WITH new_note AS (
//         INSERT INTO note (title, content, user_id)
//         VALUES ($1, $2, 1)
//         RETURNING noteid
//       )
//       INSERT INTO youtubenote (timestamp, noteid, video_id)
//       SELECT $3, new_note.noteid, $4
//       FROM new_note;
//     `;
//   return query(insertQuery, [titel, inhalt, zeitpunkt, video_id]);
// };

const getVideoByURL = (url) => {
  const selectQuery = 'SELECT * from video WHERE videourl = $1';
  return query(selectQuery, [url]);
};

const delVideoNote = (id) => {
  const deleteQuery = `WITH deleted_youtubenote AS (
  DELETE FROM youtubenote
  WHERE noteid = $1
),
deleted_note AS (
  DELETE FROM note
  WHERE noteid = $1
)
SELECT $1;`;

  return query(deleteQuery, [id]);
};

const getVideoNote = (video_id) =>
  query(
    `SELECT n.*,
       y.video_id as video_id
FROM note n
JOIN youtubenote y on n.noteid = y.noteid
WHERE video_id = $1;`,
    [video_id],
  );

// post video notiz
// Insert Video
// const insertVideo = (videourl, videolength, title, user_id) =>
//   query(
//     `
//         INSERT INTO video (videourl, videolength, title, user_id)
//         VALUES ($1, $2, $3, $4)
//         RETURNING *;
//     `,
//     [videourl, videolength, title, user_id],
//   );

// const insertVideo = (videourl, title, videolength, userId) =>
//   query(
//     `INSERT INTO Video (videourl, title, videolength, user_id)
//      VALUES ($1, $2, $3, $4)
//      RETURNING video_id;`, // Gib nur video_id zurück
//     [videourl, title, videolength, userId],
//   );

// Neue Notiz einfügen
// const insertNotiz = (title, content, userId) =>
//   query(
//     `INSERT INTO Note (Title, Content, user_id)
//      VALUES ($1, $2, $3)
//      RETURNING NoteID;`, // Gib die NoteID zurück
//     [title, content, userId],
//   );

// YouTube-Notiz verknüpfen
// const insertYouTubeNote = (timestamp, noteId, videoId) =>
//   query(
//     `INSERT INTO YouTubeNote (Timestamp, NoteID, video_id)
//      VALUES ($1, $2, $3)
//      RETURNING *;`, // Optional: Gib die gesamte YouTube-Notiz zurück
//     [timestamp, noteId, videoId],
//   );

// hier kommen die SQLITE queries

const insertVideo = (videourl, videolength, title, userId) =>
  query(
    `
      INSERT INTO Video (videourl, title, videolength, user_id)
      VALUES ($1, $2, $3, $4)
      RETURNING video_id;
      `,
    [videourl, title, videolength, userId], // Ensure parameters are in the right order
  );

const insertNotiz = (title, content, userId) =>
  query('INSERT INTO Note (Title, Content, user_id) VALUES (?, ?, ?) RETURNING noteid;', [
    title,
    content,
    userId,
  ]);

const insertYouTubeNote = async (timestamp, noteId, videoId) =>
  query('INSERT INTO YouTubeNote (Timestamp, NoteID, video_id) VALUES (?, ?, ?) RETURNING *;', [
    timestamp,
    noteId,
    videoId,
  ]);

// patch bzw. update
const updateNoteFromYouTubeNote = async (youtubeNoteId, title, content) => {
  const queryText = `
    UPDATE Note
    SET Title = $1, Content = $2
    WHERE NoteID = (
        SELECT NoteID FROM YouTubeNote WHERE YouTubeNoteID = $3
    )
    RETURNING *;
  `;
  return query(queryText, [title, content, youtubeNoteId]);
};

// Lösche eine YouTubeNote und die zugehörige Note
const deleteYouTubeNoteAndAssociatedNote = async (youtubeNoteId) =>
  query(
    `
    DELETE FROM youtubenote
    WHERE youtubenoteid = $1
    RETURNING *;
    `,
    [youtubeNoteId],
  );

const getVideoByID = (id) => query('SELECT * from video WHERE video_id = $1', [id]);

export {
  getEverything,
  getApi,
  insertVideo,
  getVideoByURL,
  delVideoNote,
  getVideoByID,
  getVideoNote,
  insertYouTubeNote,
  insertNotiz,
  updateNoteFromYouTubeNote,
  deleteYouTubeNoteAndAssociatedNote,
};
