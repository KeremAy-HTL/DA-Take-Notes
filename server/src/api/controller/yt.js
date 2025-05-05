import chalk from 'chalk';
import * as model from '../model/yt.js';

//  chalk.green Erfolgsnachrichten
//  chalk.red Fehlernachrichten
//  chalk.yellow Warnungen
//  chalk.cyan Debug-Informationen

const getEverything = async (req, res) => {
  try {
    const { rows } = await model.getEverything();
    console.log(chalk.green('Fetched all records successfully.'));
    return res.status(200).json(rows);
  } catch (error) {
    console.error(chalk.red('Error fetching records:'), error);
    return res.status(500).send('An error occurred while fetching records.');
  }
};

const getApi = async (req, res) => {
  try {
    const videourl = req.query;
    const { rows } = await model.getApi(videourl);
    console.log(chalk.green('Fetched API data for video URL:'), videourl);
    return res.status(200).json(rows);
  } catch (error) {
    console.error(chalk.red('Error fetching API data:'), error);
    return res.status(500).send('An error occurred while fetching API data.');
  }
};

const insertVideo = async (req, res) => {
  try {
    const { videourl, videolength, title, userId } = req.body;
    const { rows } = await model.insertVideo(videourl, videolength, title, userId);
    console.log(chalk.green('Inserted video successfully:'), videourl);
    return res.status(200).json(rows); // Send the inserted video details as the response
  } catch (error) {
    console.error(chalk.red('Error inserting video:'), error.message); // Log the error message
    return res.status(500).send('An error occurred while inserting video.');
  }
};

const postVideoNotiz = async (req, res) => {
  try {
    const { videourl, videolength, title, content, timestamp, userId } = req.body;
    console.log(chalk.cyan('Processing postVideoNotiz with URL:'), videourl);

    if (!videourl || typeof videourl !== 'string') {
      console.error(chalk.red('Invalid videourl provided.'));
      return res.status(400).json({ error: 'Invalid videourl.' });
    }
    if (!userId) {
      console.error(chalk.red('Invalid userId provided.'));
      return res.status(400).json({ error: 'Invalid userId.' });
    }

    const videoResult = await model.getApi(videourl);
    let videoId;

    if (!videoResult || videoResult.length === 0) {
      console.log(chalk.yellow('Video not found, inserting new video.'));
      const result = await model.insertVideo(videourl, title, videolength, userId);
      videoId = result[0]?.video_id;
    } else {
      console.log(chalk.green('Video found:'), videoResult[0]);
      videoId = videoResult[0].video_id;
    }

    if (!videoId) {
      console.error(chalk.red('Failed to retrieve videoId.'));
      return res.status(500).json({ error: 'Error processing video.' });
    }

    console.log(chalk.blue('Inserting note...'));
    const noteResult = await model.insertNotiz(title, content, userId);

    console.log(chalk.blue('InsertNotiz result:'), noteResult); // DEBUG

    // Hier war der Fehler: falsche Schreibweise von noteid
    const noteId = noteResult[0]?.noteid || noteResult[0]?.NoteID;

    if (!noteId) {
      console.error(chalk.red('Failed to insert note. Note result was:'), noteResult);
      return res.status(500).json({ error: 'Error inserting note.' });
    }

    console.log(chalk.blue('Extracted NoteID:'), noteId); // DEBUG

    console.log(chalk.magenta('Inserting YouTube Note with:'), { timestamp, noteId, videoId });
    const youtubeNoteResult = await model.insertYouTubeNote(timestamp, noteId, videoId);

    console.log(chalk.magenta('YouTube Note result:'), youtubeNoteResult); // DEBUG

    if (!youtubeNoteResult || youtubeNoteResult.length === 0) {
      console.error(chalk.red('Failed to insert YouTube note.'));
      return res.status(500).json({ error: 'Error inserting YouTube note.' });
    }

    console.log(chalk.green('Note inserted and linked successfully.'));
    return res.status(200).json({ message: 'Note inserted successfully.' });
  } catch (error) {
    console.error(chalk.red('Error in postVideoNotiz:'), error);
    return res.status(500).json({ error: 'An error occurred while inserting the note.' });
  }
};

const delVideoNotiz = async (req, res) => {
  try {
    await model.delVideoNote(req.params.id);
    console.log(chalk.green('Deleted video note with ID:'), req.params.id);
    return res.status(200).send('Video note deleted successfully.');
  } catch (error) {
    console.error(chalk.red('Error deleting video note:'), error);
    return res.status(500).send('An error occurred while deleting the video note.');
  }
};

const getVideoNote = async (req, res) => {
  try {
    const { rows } = await model.getVideoNote(req.params.id);
    console.log(chalk.green('Fetched video note for ID:'), req.params.id);
    return res.status(200).json(rows);
  } catch (error) {
    console.error(chalk.red('Error fetching video note:'), error);
    return res.status(500).send('An error occurred while fetching the video note.');
  }
};

const patchYouTubeNoteWithUpdates = async (req, res) => {
  try {
    const { youtubeNoteId, title, content } = req.body;
    const updatedNote = await model.updateNoteFromYouTubeNote(youtubeNoteId, title, content);

    // Ensure updatedNote is correctly structured before accessing rows
    if (!updatedNote || !updatedNote.rows || updatedNote.rows.length === 0) {
      console.warn(chalk.yellow('Note found for the given YouTubeNoteID.'));
      return res.status(304).json({ message: 'Note not found for the given YouTubeNoteID' });
    }

    console.log(chalk.green('Note updated successfully via YouTubeNote.'));
    return res.status(200).json({
      message: 'Note updated successfully via YouTubeNote',
      note: updatedNote.rows[0],
    });
  } catch (error) {
    console.error(chalk.red('Error updating note:'), error.message);
  }
  return null;
};

const deleteYouTubeNoteAndAssociatedNoteController = async (req, res) => {
  try {
    const { youtubeNoteId } = req.params;
    console.log(chalk.cyan('Deleting YouTubeNote and associated Note with ID:'), youtubeNoteId);

    const result = await model.deleteYouTubeNoteAndAssociatedNote(youtubeNoteId);
    console.log(chalk.green('Deleted YouTubeNote and associated Note successfully.'));
    res.status(200).json({
      message: `YouTubeNote and associated Note with ID ${youtubeNoteId} successfully deleted.`,
      deletedYouTubeNote: result,
    });
  } catch (error) {
    console.error(chalk.red('Error deleting YouTubeNote and associated Note:'), error);
    res.status(500).json({
      message: 'An error occurred while deleting the YouTubeNote and associated Note',
      error,
    });
  }
};

export {
  getApi,
  getEverything,
  delVideoNotiz,
  getVideoNote,
  insertVideo,
  patchYouTubeNoteWithUpdates,
  postVideoNotiz,
  deleteYouTubeNoteAndAssociatedNoteController,
};
