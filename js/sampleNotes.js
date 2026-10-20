/**
 * sampleNotes.js
 * The 10 notes from the Figma design, with the same titles, tags, dates and
 * archived status. They are loaded the very first time the app opens (or
 * after "Reset to Figma notes" in Settings → Backup & Restore).
 *
 * The Figma file only shows the full text of two notes ("React Performance
 * Optimization" and "TypeScript Migration Guide"); those are copied exactly.
 * The other eight have short bodies written to fit their titles.
 */

export const sampleNotes = [
  {
    id: 'figma-react-performance',
    title: 'React Performance Optimization',
    tags: ['Dev', 'React'],
    archived: false,
    updatedAt: '2024-10-29T10:00:00.000Z',
    content: `Key performance optimization techniques:

1. Code Splitting
- Use React.lazy() for route-based splitting
- Implement dynamic imports for heavy components

2. Memoization
- useMemo for expensive calculations
- useCallback for function props
- React.memo for component optimization

3. Virtual List Implementation
- Use react-window for long lists
- Implement infinite scrolling

TODO: Benchmark current application and identify bottlenecks`,
  },
  {
    id: 'figma-japan-travel',
    title: 'Japan Travel Planning',
    tags: ['Travel', 'Personal'],
    archived: false,
    updatedAt: '2024-10-28T10:00:00.000Z',
    content: `Japan Trip Planning - Spring 2025

ITINERARY DRAFT:
Week 1: Tokyo
- Shibuya and Harajuku
- TeamLab Digital Art Museum
- Day trip to Mount Fuji

Week 2: Kyoto & Osaka
- Temple hopping in Kyoto
- Street food tour in Osaka
- Nara deer park day trip

TO-DO:
- Book JR Pass
- Research ryokans
- Make restaurant reservations`,
  },
  {
    id: 'figma-pasta-recipes',
    title: 'Favorite Pasta Recipes',
    tags: ['Cooking', 'Recipes'],
    archived: false,
    updatedAt: '2024-10-27T10:00:00.000Z',
    content: `Classic Italian Recipes:

1. Carbonara
- Eggs + pecorino
- Guanciale
- Fresh black pepper

2. Cacio e Pepe
- Pecorino Romano
- Fresh black pepper
- Pasta water

3. Aglio e Olio
- Garlic
- Olive oil
- Red pepper flakes`,
  },
  {
    id: 'figma-typescript-migration',
    title: 'TypeScript Migration Guide',
    tags: ['Dev', 'React', 'TypeScript'],
    archived: true,
    updatedAt: '2024-10-26T10:00:00.000Z',
    content: `Project migration steps:

1. Initial Setup
- Install TypeScript dependencies
- Configure tsconfig.json
- Set up build pipeline

2. Migration Strategy
- Start with newer modules
- Add type definitions gradually
- Use 'any' temporarily for complex cases

3. Testing Approach
- Update test configuration
- Add type testing
- Validate build process

Deadline: End of Q4 2024`,
  },
  {
    id: 'figma-workout-plan',
    title: 'Weekly Workout Plan',
    tags: ['Dev', 'React'],
    archived: false,
    updatedAt: '2024-10-25T10:00:00.000Z',
    content: `Monday: Upper Body
- Bench Press 4x8
- Rows 4x10
- Shoulder Press 3x12

Wednesday: Lower Body
- Squats 4x8
- Romanian Deadlifts 3x10
- Lunges 3x12 each leg

Friday: Full Body
- Deadlifts 3x5
- Pull-ups 3x8
- Push-ups 3x15`,
  },
  {
    id: 'figma-gift-ideas',
    title: 'Gift Ideas',
    tags: ['Personal', 'Shopping'],
    archived: true,
    updatedAt: '2024-10-20T10:00:00.000Z',
    content: `Birthday & Holiday Gift List:

Mom:
- Cooking class subscription
- Kindle with gardening books

Dad:
- Golf lessons
- Leather wallet

Sister:
- Art supplies set
- Concert tickets`,
  },
  {
    id: 'figma-component-library',
    title: 'React Component Library',
    tags: ['Dev', 'React'],
    archived: true,
    updatedAt: '2024-10-15T10:00:00.000Z',
    content: `Custom Component Library Structure:

1. Basic Components
- Button
- Input
- Card
- Modal

2. Form Components
- FormField
- Checkbox
- RadioGroup
- Select

3. Layout Components
- Container
- Grid
- Flex`,
  },
  {
    id: 'figma-meal-prep',
    title: 'Meal Prep Ideas',
    tags: ['Cooking', 'Health', 'Recipes'],
    archived: false,
    updatedAt: '2024-10-12T10:00:00.000Z',
    content: `Weekly Meal Prep Plan:

Breakfast Options:
- Overnight oats
- Egg muffins
- Smoothie packs

Lunch Containers:
- Quinoa Buddha bowls
- Chicken wraps
- Lentil soup

Snacks:
- Cut vegetables
- Mixed nuts
- Greek yogurt parfaits`,
  },
  {
    id: 'figma-reading-list',
    title: 'Reading List',
    tags: ['Personal', 'Dev'],
    archived: false,
    updatedAt: '2024-10-05T10:00:00.000Z',
    content: `Current Reading Queue:

1. Technical Books
- Clean Code by Robert Martin
- Designing Data-Intensive Applications
- TypeScript Design Patterns

2. Personal Development
- Deep Work by Cal Newport
- Atomic Habits
- The Psychology of Money

Currently Reading: Clean Code`,
  },
  {
    id: 'figma-fitness-goals',
    title: 'Fitness Goals 2025',
    tags: ['Fitness', 'Health', 'Personal'],
    archived: false,
    updatedAt: '2024-09-22T10:00:00.000Z',
    content: `2025 Fitness Objectives:

1. Strength Goals
- Bench press: 225 lbs
- Squat: 315 lbs
- Deadlift: 405 lbs

2. Cardio Goals
- Run half marathon
- 5k under 25 minutes

3. Habits
- Gym 4x per week
- Daily 10k steps
- Sleep 7+ hours`,
  },
];
