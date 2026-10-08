// Stand-in for an analytics script. It sends nothing anywhere; it only proves it ran.
window.__trackerLoaded = true;
document.dispatchEvent(new CustomEvent('tracker:loaded'));
