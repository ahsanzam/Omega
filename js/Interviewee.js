/**
 * An interviewee, including their static properties and dynamic state.
 * @typedef {Object} Interviewee
 * @property {string} name - The interviewee's name, as displayed to the user.
 * @property {string} title - The interviewee's title, as displayed to the user.
 * @property {string} profileImage - The relative path to the interviewee's profile image.
 * @property {string} videoDirectory - The relative path of the directory in which to look for the response videos.
 * @property {Object[]} questions - The questions the interviewee can be asked.
 * @property {string} questions[].prompt - The question itself.
 * @property {string} questions[].responseVideo - The relative path to the video of the interviewee's response, relative to videoDirectory.
 * @property {boolean} questions[].disabled - If true, this question can no longer be asked. If undefined, false is assumed.
 * @property {number} timeRemaining - The time remaining for this interview, in seconds. This value is not set initially for each interviewee. It is used dynamically during the application's execution.
 * @property {boolean} disabled - If true, this interviewee can no longer be interviewed. If undefined, false is assumed.
 */
// TODO: idle videos?
