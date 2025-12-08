// Copied from stack overflow :)
// Only use is to make a cool terminal/retro like delay
const delay = millis => new Promise((resolve, reject) => {
  setTimeout(_ => resolve(), millis)
});