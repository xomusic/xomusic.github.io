/**
 * XoMusic Desktop Enhancement Script
 * This script handles desktop-specific behaviors
 */

document.addEventListener('DOMContentLoaded', function() {
  // Only run this code on desktop screens
  const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
  
  if (isDesktop) {
    // Get references to player elements
    const playerScreen = document.getElementById('playerScreen');
    const audioPlayer = document.getElementById('audioPlayer');
    
    // Ensure player is visible on desktop
    if (playerScreen) {
      playerScreen.classList.remove('hidden');
      playerScreen.style.opacity = '1';
      playerScreen.style.visibility = 'visible';
    }
    
    // Listen for audio play events to ensure player is visible
    if (audioPlayer) {
      audioPlayer.addEventListener('play', function() {
        if (playerScreen) {
          playerScreen.classList.remove('hidden');
          playerScreen.style.opacity = '1';
          playerScreen.style.visibility = 'visible';
        }
      });
    }
    
    // Fix control button spacing
    const controlsContainer = playerScreen.querySelector('.flex.items-center.justify-center.space-x-8');
    if (controlsContainer) {
      // Reset space-x-8 utility class that might be causing overflow
      controlsContainer.classList.remove('space-x-8');
      controlsContainer.style.display = 'flex';
      controlsContainer.style.justifyContent = 'space-between';
      controlsContainer.style.width = '100%';
      controlsContainer.style.maxWidth = '250px';
      controlsContainer.style.margin = '0 auto 0.5rem auto';
      controlsContainer.style.padding = '0.5rem';
      
      // Fix individual control buttons to ensure they're visible
      const buttons = controlsContainer.querySelectorAll('button');
      buttons.forEach(button => {
        button.style.margin = '0 2px';
        button.style.flexShrink = '0';
      });
    }
    
    // Ensure proper sizing of player elements
    const playerCover = document.getElementById('playerCover');
    if (playerCover) {
      playerCover.style.borderRadius = '12px';
      playerCover.classList.remove('rounded-full');
    }
    
    // Make sure the player container has proper height
    const playerContainer = playerScreen.querySelector('div.px-4');
    if (playerContainer) {
      playerContainer.style.height = 'auto';
      playerContainer.style.minHeight = 'auto';
      playerContainer.style.paddingBottom = '1rem';
    }
  }
});
