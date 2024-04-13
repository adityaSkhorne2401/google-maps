/**
 * @license
 * Copyright 2023 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// To use video ID as parameter input instead of address, replace parameter value with a videoID '-wVXGP6Hkogfqz6sZulUf3'.
const PARAMETER_VALUE = '1600 Amphitheatre Parkway, Mountain View, CA 94043';
const ORIENTATION = 'landscape'; // Supported orientations: landscape, portrait
const FORMAT = 'mp4_medium'; // Supported formats: image, mp4_low, mp4_medium, mp4_high.
const API_KEY = 'AIzaSyA6kjbNIy9pZEUd_k85Sg3eSTsTvnk6ahA';

async function initAerialView() {
  let displayEl;
  if (FORMAT === 'image') {
    displayEl = document.querySelector('img');
  } else {
    displayEl = document.querySelector('video');

    displayEl.addEventListener('click', function() {
      if (displayEl.paused) {
        displayEl.play();
      } else {
        displayEl.pause();
      }
    });
  }
  displayEl.style.display = "block";

  // Parameter key can accept either 'videoId' or 'address' depending on input.
  const parameterKey = videoIdOrAddress(PARAMETER_VALUE);
  const urlParameter = new URLSearchParams();
  urlParameter.set(parameterKey, PARAMETER_VALUE);
  urlParameter.set('key', API_KEY);
  const response = await fetch(`https://aerialview.googleapis.com/v1/videos:lookupVideo?${urlParameter.toString()}`);
  const videoResult = await response.json();

  if (videoResult.state === 'PROCESSING') {
    alert('Video still processing..');
  } else if (videoResult.error && videoResult.error.code === 404) {
    alert('Video not found. To generate video for an address, call on Aerial view renderVideo method.');
  } else {
    videoSrcs = videoResult.uris[FORMAT.toUpperCase()];
    displayEl.src = ORIENTATION === 'landscape' ?
      videoSrcs.landscapeUri : videoSrcs.portraitUri;
  }
}

function videoIdOrAddress(value) {
  const videoIdRegex = /[0-9a-zA-Z\-_]{22}/;
  return value.match(videoIdRegex) ? 'videoId' : 'address';
}

initAerialView();
