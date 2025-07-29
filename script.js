/*
 * Upstate Sound & Repair – Script
 *
 * Provides basic interactivity for the site: toggles the
 * navigation menu on small screens and sets the current year
 * in the footer.
 */

// Wait until the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Mobile navigation toggle
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.querySelector('nav ul');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });
  }
  // Close nav when a link is clicked (useful for single page navigation)
  const links = navLinks?.querySelectorAll('a');
  links?.forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('show')) {
        navLinks.classList.remove('show');
      }
    });
  });
  // Set current year in footer
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    const now = new Date();
    yearSpan.textContent = now.getFullYear().toString();
  }
});