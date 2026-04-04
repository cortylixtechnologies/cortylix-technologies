
## Plan: Update Logo and Move Links to Footer

### 1. Create a New Text-Based Logo for Navbar
Since no specific logo image was provided, I'll create a fresh text-based logo design in the navbar:
- Create a modern gradient logo icon with "CT" initials
- Update the company name display style
- Remove the current image-based logo reference

### 2. Update Navbar (src/components/layout/Navbar.tsx)
- Replace the current logo image with a new stylized text/icon logo
- Remove "Track Ticket" button from the navbar CTA section
- Remove "Admin Login" button from the navbar CTA section
- Keep only the "IT Support" and "Account" dropdown (for logged-in users)
- Also update the mobile menu to remove these links

### 3. Update Footer (src/components/layout/Footer.tsx)
- Add "Track Ticket" link to the Support section in `footerLinks.support`
- Add "Admin Login" link to the Support section in `footerLinks.support`
- Also update the footer's brand section to use the same new logo design for consistency

### Files to modify:
- `src/components/layout/Navbar.tsx` - New logo + remove Track Ticket and Admin Login buttons
- `src/components/layout/Footer.tsx` - Add Track Ticket and Admin Login links to Support section + update logo

This keeps the navigation clean with authentication options accessible in the footer where users typically expect account-related links.
