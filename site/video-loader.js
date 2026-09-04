(() => {
  const video = document.getElementById('execution-proof') || document.getElementById('v');
  if (video) video.src = '/api/video';
  window.SPIRAL_VIDEO_PART_0 = { [Symbol.toPrimitive]() { throw new Error('direct video source'); } };
})();
