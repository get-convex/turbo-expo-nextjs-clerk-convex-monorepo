# RecipeAI - TODO & Missing Features

> **Last Updated:** 2024-11-17
> **Status:** Post-refactor from notes app to recipe management platform

---

## 🔴 **CRITICAL - Must Fix Immediately**

### 1. Mobile App (React Native/Expo) - Completely Outdated
**Status:** ❌ Not Started
**Priority:** P0 - Blocking mobile functionality

The entire mobile app still uses the old notes system and needs complete refactoring:

- [ ] Refactor `apps/native/src/screens/NotesDashboardScreen.tsx` → `RecipesDashboardScreen.tsx`
- [ ] Refactor `apps/native/src/screens/CreateNoteScreen.tsx` → `CreateRecipeScreen.tsx`
- [ ] Refactor `apps/native/src/screens/InsideNoteScreen.tsx` → `RecipeDetailsScreen.tsx`
- [ ] Update `apps/native/src/navigation/Navigation.tsx` to use recipe routes
- [ ] Update `apps/native/app.json` branding from "NotesContract" to "RecipeAI"
- [ ] Design mobile UI for:
  - Recipe ingredients list
  - Instructions steps
  - Variations timeline
  - AI extraction flow
  - Recipe search/filter

**Files Affected:**
- `apps/native/src/screens/*.tsx` (all screens)
- `apps/native/src/navigation/Navigation.tsx`
- `apps/native/app.json`

---

### 2. Remove Old Notes System
**Status:** ❌ Not Started
**Priority:** P0 - Technical debt & confusion

Old notes code still exists alongside new recipe system:

**Backend:**
- [ ] Remove `packages/backend/convex/notes.ts` (or clearly mark as legacy)
- [ ] Remove notes table from schema OR keep if supporting legacy data

**Web App - Routes:**
- [ ] Delete `apps/web/src/app/notes/page.tsx`
- [ ] Delete `apps/web/src/app/notes/[slug]/page.tsx`

**Web App - Components:**
- [ ] Delete `apps/web/src/components/notes/Notes.tsx`
- [ ] Delete `apps/web/src/components/notes/NoteItem.tsx`
- [ ] Delete `apps/web/src/components/notes/NoteDetails.tsx`
- [ ] Delete `apps/web/src/components/notes/CreateNote.tsx`
- [ ] Delete `apps/web/src/components/notes/DeleteNote.tsx`
- [ ] Delete `apps/web/src/components/notes/Checkbox.tsx`

**Home Page Components:**
- [ ] Delete `apps/web/src/components/home/Testimonials.tsx` (if unused)
- [ ] Delete `apps/web/src/components/home/Footer.tsx` (if unused)
- [ ] Delete `apps/web/src/components/home/FooterHero.tsx` (if unused)

---

### 3. Schema & Data Migration
**Status:** ⚠️ Partially Complete
**Priority:** P0 - Data consistency

- [ ] Decide: Keep notes table for legacy support OR fully migrate to recipes
- [ ] If migrating: Create migration script to convert notes → recipes
- [ ] Update Convex schema accordingly
- [ ] Test with production data

---

## 🟡 **IMPORTANT - Core Functionality**

### 4. Recipe Editing
**Status:** ⚠️ Backend exists, UI missing
**Priority:** P1 - Essential feature

**Backend:** ✅ `updateRecipe` mutation exists (`packages/backend/convex/recipes.ts` lines 88-119)

**Frontend - Missing:**
- [ ] Create `apps/web/src/components/recipes/EditRecipe.tsx` component
- [ ] Add "Edit Recipe" button to `RecipeDetails.tsx`
- [ ] Pre-populate form with existing recipe data
- [ ] Wire up `useMutation(api.recipes.updateRecipe)`
- [ ] Handle optimistic updates
- [ ] Add success/error states

**Mobile:**
- [ ] Create edit screen for mobile app
- [ ] Add edit button to recipe details

---

### 5. Recipe Variation Editing
**Status:** ❌ Not Implemented
**Priority:** P1 - Important for variations feature

**Backend - Missing:**
- [ ] Create `updateRecipeVariation` mutation in `packages/backend/convex/recipes.ts`
- [ ] Add proper authorization checks (user owns variation)

**Frontend - Missing:**
- [ ] Add "Edit" button to variation cards in `RecipeDetails.tsx`
- [ ] Create edit modal/form for variations
- [ ] Allow editing: title, notes, modifications, rating
- [ ] Update UI after successful edit

---

### 6. Image Upload & Management
**Status:** ❌ Not Implemented
**Priority:** P1 - Major UX improvement

**Current:** Schema has `imageUrl` field but no upload system

**Backend - Needed:**
- [ ] Implement Convex file storage (docs: https://docs.convex.dev/file-storage)
- [ ] Create `generateUploadUrl` mutation for images
- [ ] Create `saveRecipeImage` mutation to update recipe.imageUrl
- [ ] Handle image deletion when recipe is deleted
- [ ] Add image validation (size, format)

**Frontend - Needed:**
- [ ] Add image upload to `CreateRecipe.tsx` form
- [ ] Add image management to `EditRecipe.tsx`
- [ ] Create image preview component
- [ ] Handle upload progress
- [ ] Display actual images in recipe cards (currently shows emoji)
- [ ] Display images in recipe detail view
- [ ] Add image zoom/lightbox

**Mobile:**
- [ ] Implement native image picker
- [ ] Camera integration for taking recipe photos
- [ ] Image upload from gallery

---

### 7. URL Import Feature (YouTube, Instagram, Websites)
**Status:** ❌ Placeholder only
**Priority:** P1 - Advertised feature

**Current:** Alert message in `CreateRecipe.tsx` lines 61-64

**Backend - Needed:**
- [ ] Create `extractFromUrl` action in `packages/backend/convex/openai.ts`
- [ ] Implement YouTube transcript extraction
  - Use YouTube Data API or transcript scraping
  - Parse cooking instructions from video descriptions
- [ ] Implement Instagram parsing
  - Use Instagram Graph API or web scraping
  - Extract recipe from post caption
- [ ] Implement generic recipe website scraping
  - Detect common recipe schema (schema.org)
  - Fallback to AI extraction from HTML
- [ ] Handle various URL formats and edge cases

**Frontend - Needed:**
- [ ] Wire up URL input to backend action
- [ ] Show loading state during extraction
- [ ] Handle errors (invalid URL, parsing failed)
- [ ] Preview extracted recipe before saving
- [ ] Allow editing extracted data before creating recipe

---

### 8. Form Validation
**Status:** ⚠️ Basic validation only
**Priority:** P1 - Data quality & UX

**Current Issues:**
- Basic `trim()` checks
- Alert-based error messages
- No visual field-level feedback

**Needed:**
- [ ] Install validation library (Zod or Yup)
- [ ] Create validation schemas for:
  - Recipe creation
  - Recipe editing
  - Variation creation
- [ ] Add field-level error messages
- [ ] Visual indicators for invalid fields (red borders, error text)
- [ ] Prevent submission if validation fails
- [ ] Server-side validation in mutations
- [ ] Validate ingredient amounts (must be positive numbers)
- [ ] Validate URLs in source field

---

### 9. Loading & Error States
**Status:** ⚠️ Incomplete
**Priority:** P1 - User experience

**Current:** Basic loading skeletons exist

**Needed:**
- [ ] Create error boundary components:
  - `RecipeErrorBoundary.tsx`
  - `VariationErrorBoundary.tsx`
- [ ] Add toast notification system (react-hot-toast or sonner)
- [ ] Implement retry mechanisms for failed actions
- [ ] Add offline indicators
- [ ] Better loading states:
  - Skeleton screens for all async content
  - Inline spinners for actions (saving, deleting)
  - Progress bars for uploads
- [ ] Handle specific error cases:
  - Network errors
  - Authentication errors
  - Not found errors
  - Permission errors
  - Validation errors

---

### 10. Delete Recipe Variation
**Status:** ⚠️ Backend exists, UI missing
**Priority:** P2 - Nice to have

**Backend:** ✅ `deleteRecipeVariation` mutation exists

**Frontend - Missing:**
- [ ] Add delete button to variation cards in `RecipeDetails.tsx`
- [ ] Add confirmation dialog
- [ ] Wire up mutation
- [ ] Handle optimistic updates

---

## 🟢 **NICE-TO-HAVE - Enhanced Features**

### 11. Print View for Recipes
**Status:** ❌ Not Implemented
**Priority:** P2

- [ ] Create print-specific CSS (`@media print`)
- [ ] Add "Print Recipe" button to `RecipeDetails.tsx`
- [ ] Format for printing:
  - Hide navigation, sidebar
  - Clean ingredient list
  - Step-by-step instructions
  - Optional variations section
- [ ] Option to print with/without images
- [ ] Page break handling for long recipes

---

### 12. Share Functionality
**Status:** ❌ Not Implemented
**Priority:** P2

- [ ] Add "Share" button to recipe details
- [ ] Copy recipe link to clipboard
- [ ] Generate shareable public links (requires backend)
- [ ] Social media sharing:
  - Pinterest (with image)
  - Facebook
  - Twitter/X
  - WhatsApp
- [ ] Email recipe option
- [ ] Native share API for mobile

---

### 13. Export Recipes
**Status:** ❌ Not Implemented
**Priority:** P2

- [ ] Export individual recipe to PDF
- [ ] Export to JSON format
- [ ] Export to Markdown
- [ ] Bulk export all recipes
- [ ] Export with/without images
- [ ] Import from exported formats

---

### 14. Grocery List Generation
**Status:** ❌ Not Implemented
**Priority:** P2

- [ ] Generate shopping list from recipe ingredients
- [ ] Combine ingredients from multiple recipes
- [ ] Interactive checklist (check off as you shop)
- [ ] Categorize by store section (produce, dairy, etc.)
- [ ] Scale quantities based on servings
- [ ] Share grocery list
- [ ] Mobile-optimized grocery mode

---

### 15. Recipe Scaling
**Status:** ⚠️ Servings field exists, no scaling logic
**Priority:** P2

- [ ] Add serving size adjuster UI
- [ ] Automatic ingredient quantity recalculation
- [ ] Handle fractional amounts (1.5 cups, etc.)
- [ ] Support for US/metric conversions
- [ ] Preserve original serving size
- [ ] Update instructions if quantities mentioned

---

### 16. Advanced Search & Filtering
**Status:** ⚠️ Basic search exists
**Priority:** P2

**Current:** Simple text search on title, description, tags

**Enhancements Needed:**
- [ ] Filter by tags (multi-select)
- [ ] Filter by prep time (< 30min, 30-60min, etc.)
- [ ] Filter by cook time
- [ ] Filter by ingredients ("what can I make with...")
- [ ] Sort options:
  - Newest first
  - Oldest first
  - Quickest (total time)
  - Most variations
  - Alphabetical
- [ ] Advanced search with multiple criteria
- [ ] Save search filters
- [ ] Recent searches

---

### 17. Recipe Collections/Folders
**Status:** ❌ Not Implemented
**Priority:** P3

**Backend:**
- [ ] Create `collections` table in schema
- [ ] Create `recipeCollections` junction table
- [ ] CRUD mutations for collections
- [ ] Query recipes by collection

**Frontend:**
- [ ] Collections management UI
- [ ] Create/edit/delete collections
- [ ] Assign recipes to collections (multi-select)
- [ ] Collection detail view
- [ ] Filter by collection in recipe list
- [ ] Default collections ("Favorites", "To Try")

---

### 18. Meal Planning
**Status:** ❌ Not Implemented
**Priority:** P3

- [ ] Create meal plan schema (days, meals)
- [ ] Calendar view UI (week/month)
- [ ] Drag-drop recipes to calendar
- [ ] Generate grocery list from meal plan
- [ ] Recipe suggestions based on:
  - Dietary preferences
  - Ingredients on hand
  - Past favorites
- [ ] Meal prep indicators
- [ ] Leftover tracking

---

### 19. Cooking Mode
**Status:** ❌ Not Implemented
**Priority:** P3

- [ ] Step-by-step cooking view
- [ ] Large, easy-to-read text
- [ ] "Next Step" / "Previous Step" buttons
- [ ] Timer integration for timed steps
- [ ] Keep screen awake during cooking
- [ ] Hands-free mode (voice commands - future)
- [ ] Progress indicator
- [ ] Quick access to ingredient list

---

### 20. Recipe Notes & Cooking History
**Status:** ⚠️ Only in variations
**Priority:** P3

**Enhancements:**
- [ ] Add general notes to main recipe (not just variations)
- [ ] Cooking history timeline
- [ ] Track when recipe was cooked
- [ ] Success/failure indicators
- [ ] Upload photos from cooking session
- [ ] Link variations to cooking dates
- [ ] "Last cooked on..." indicator

---

### 21. Social Features
**Status:** ❌ Not Implemented
**Priority:** P4 - Future

- [ ] User profiles
- [ ] Follow other users
- [ ] Public recipe sharing
- [ ] Community ratings
- [ ] Comments on recipes
- [ ] Trending/popular recipes page
- [ ] Recipe recommendations
- [ ] Activity feed

---

### 22. AI Enhancements
**Status:** ⚠️ Basic AI exists
**Priority:** P3

**Current:** AI extraction and modification

**Enhancements:**
- [ ] AI recipe suggestions based on ingredients
- [ ] Cooking tips and substitutions
- [ ] Nutrition facts estimation
- [ ] Dietary restriction adaptations
- [ ] Cooking technique explanations
- [ ] Wine/beverage pairing suggestions
- [ ] Recipe difficulty estimation
- [ ] Smart tagging/categorization

---

## 🔧 **TECHNICAL IMPROVEMENTS**

### 23. Testing
**Status:** ❌ No tests
**Priority:** P2

- [ ] Set up testing framework (Vitest + React Testing Library)
- [ ] Unit tests for:
  - Recipe mutations
  - AI extraction logic
  - Utility functions
- [ ] Integration tests for:
  - Recipe creation flow
  - Variation creation
  - Search functionality
- [ ] E2E tests (Playwright):
  - Critical user journeys
  - Recipe CRUD
  - AI extraction
- [ ] Test coverage reporting

---

### 24. CI/CD Pipeline
**Status:** ❌ Not Implemented
**Priority:** P2

- [ ] Set up GitHub Actions
- [ ] Automated testing on PR
- [ ] Linting and type checking
- [ ] Build verification
- [ ] Automated deployment:
  - Convex backend
  - Next.js web app (Vercel)
  - Mobile app (Expo EAS)
- [ ] Environment variable validation

---

### 25. Performance Optimization
**Status:** ⚠️ Basic optimization
**Priority:** P2

- [ ] Image optimization (next/image for web)
- [ ] Code splitting and lazy loading
- [ ] Pagination for large recipe lists
- [ ] Virtual scrolling for long lists
- [ ] Debounce search input
- [ ] Memoize expensive calculations
- [ ] Optimize Convex queries (indexes)
- [ ] Bundle size analysis

---

### 26. Accessibility
**Status:** ⚠️ Basic support
**Priority:** P2

- [ ] Keyboard navigation throughout
- [ ] ARIA labels for interactive elements
- [ ] Screen reader testing
- [ ] Color contrast compliance (WCAG AA)
- [ ] Focus management in modals
- [ ] Alt text for images
- [ ] Skip navigation links
- [ ] Accessible forms with proper labels

---

### 27. Mobile App Parity
**Status:** ❌ Mobile far behind web
**Priority:** P2

After basic refactoring, add:
- [ ] All web features in mobile
- [ ] Native camera integration
- [ ] Native sharing
- [ ] Offline support (local storage)
- [ ] Push notifications
- [ ] Widget for quick recipe access
- [ ] Apple Watch/Android Wear support

---

### 28. Internationalization (i18n)
**Status:** ❌ English only
**Priority:** P3

- [ ] Set up i18n framework (next-intl or react-i18next)
- [ ] Extract all strings to translation files
- [ ] Support major languages:
  - Spanish
  - French
  - German
  - Italian
  - Japanese
  - Chinese
- [ ] RTL support for Arabic, Hebrew
- [ ] Locale-specific date/time formatting
- [ ] Unit conversion (metric/imperial)

---

### 29. Analytics & Monitoring
**Status:** ❌ Not Implemented
**Priority:** P2

- [ ] Set up analytics (PostHog, Mixpanel, or similar)
- [ ] Track key events:
  - Recipe created
  - AI extraction used
  - Variation created
  - Recipe shared
  - Errors encountered
- [ ] Error monitoring (Sentry)
- [ ] Performance monitoring
- [ ] User feedback collection

---

### 30. Documentation
**Status:** ⚠️ Basic README
**Priority:** P2

- [ ] API documentation for backend
- [ ] Component documentation (Storybook)
- [ ] User guide/help center
- [ ] Developer setup guide
- [ ] Contribution guidelines
- [ ] Architecture decision records (ADRs)
- [ ] Deployment guide

---

## 📊 **PRIORITY SUMMARY**

### **P0 - Critical (Fix Immediately)**
1. ✅ Mobile app refactoring (recipes instead of notes)
2. ✅ Remove old notes system
3. ✅ Schema & data migration decision

### **P1 - Important (Core Functionality)**
4. Recipe editing UI
5. Recipe variation editing
6. Image upload & management
7. URL import (YouTube/Instagram/websites)
8. Form validation
9. Loading & error states
10. Delete variation UI

### **P2 - Nice to Have (Enhanced UX)**
11. Print view
12. Share functionality
13. Export recipes
14. Grocery lists
15. Recipe scaling
16. Advanced search
17. Testing
18. CI/CD
19. Performance optimization
20. Accessibility
21. Mobile parity
22. Analytics

### **P3 - Future Enhancements**
23. Recipe collections
24. Meal planning
25. Cooking mode
26. Recipe notes/history
27. AI enhancements
28. Internationalization
29. Documentation

### **P4 - Long-term Vision**
30. Social features

---

## 🎯 **RECOMMENDED IMPLEMENTATION ORDER**

### **Sprint 1: Critical Cleanup (Week 1)**
- [ ] Refactor mobile app screens to use recipes
- [ ] Remove old notes system (web + backend)
- [ ] Add recipe editing UI
- [ ] Add variation editing

### **Sprint 2: Core Features (Week 2)**
- [ ] Implement image upload & storage
- [ ] Add proper form validation
- [ ] Improve loading/error states
- [ ] Delete variation UI

### **Sprint 3: Major Features (Week 3)**
- [ ] URL import (YouTube, Instagram, websites)
- [ ] Recipe scaling
- [ ] Advanced search & filters
- [ ] Share functionality

### **Sprint 4: Polish & Testing (Week 4)**
- [ ] Print view
- [ ] Export functionality
- [ ] Set up testing framework
- [ ] Write critical tests
- [ ] Performance optimization

### **Sprint 5: Nice-to-Haves (Week 5)**
- [ ] Grocery list generation
- [ ] Recipe collections
- [ ] Cooking mode
- [ ] Mobile app parity

### **Future Sprints**
- Meal planning
- Social features
- AI enhancements
- Internationalization

---

## 📝 **NOTES**

- **Font Loading:** PP Pangram Sans Compact uses `local()` - add web font files for guaranteed loading
- **Build Status:** Cannot verify due to npm registry issues - will compile once dependencies install
- **Backend Ready:** Most backend mutations exist, focus on frontend UI
- **Design System:** Complete and beautiful, just needs features wired up

---

**Last Audit Date:** 2024-11-17
**Next Review:** After Sprint 1 completion
