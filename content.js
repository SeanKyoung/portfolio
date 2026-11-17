/* ======================================================================
   CONTENT — this is the only file you need to edit to update the site.

   HOW IT WORKS
   - Everything between "quotes" is text that appears on the site.
     Change the words, keep the quotes.
   - Anything left empty ("" or []) shows a dashed "To fill in" box on
     the site, so you can see what is still missing.
   - Lines starting with // are notes to you. The site ignores them.
   - Every item in a list ends with a comma.
   - If your text contains a " character, write it as \" instead.
   - For a new paragraph inside one piece of text, add a new "quoted"
     item to the list (see about.paragraphs below).

   IMAGES
   - Put the image file in the "images" folder.
   - Then write its path here, for example  "images/my-photo.jpg".
   - Use simple file names: lowercase, no spaces.

   If the site goes blank after an edit, a quote or comma is missing
   near the last thing you changed.
   ====================================================================== */

window.CONTENT = {

  /* ---------- ABOUT ---------- */
  about: {
    photo: "images/canopy-oak.webp",
    intro: "I'm Sean Kyoung, a student researcher investigating the molecular systems plants use to sense danger, communicate stress, and survive.",
    paragraphs: [
      // "First paragraph about you.",
      // "Second paragraph.",
    ],
    facts: [
      ["Focus", "Biology / Environmental Science / Plant Immunity"],
      ["Program", "ISM 2026"],
      ["School", ""],
      ["Based in", ""],
      ["Contact", ""],
    ],
  },

  /* ---------- RESUME ---------- */
  resume: {
    photo: "images/canopy-pines.webp",
    // Put your resume PDF in the "files" folder, then write its path here,
    // e.g. "files/Sean-Kyoung-Resume.pdf". Empty = no download button.
    file: "",
    sections: [
      { title: "Education", items: [
        // "School name — Class of 2026",
      ] },
      { title: "Research & Experience", items: [] },
      { title: "Skills", items: [] },
      { title: "Awards & Activities", items: [] },
    ],
  },

  /* ---------- ABOUT ISM ---------- */
  ism: {
    photo: "images/canopy-oak.webp",
    paragraphs: [],
    milestones: [
      ["Phase 1", ""],
      ["Phase 2", ""],
      ["Phase 3", ""],
      ["Phase 4", ""],
    ],
  },

  /* ---------- BLOG ----------
     Newest post goes at the TOP of the list. To add a post, copy the
     example block below, paste it right after the "blog: [" line,
     remove the // at the start of each line, and fill it in.          */
  blog: [
    // {
    //   title: "First week in the lab",
    //   date: "Nov 16, 2026",
    //   image: "",                       // optional, e.g. "images/lab.jpg"
    //   paragraphs: [
    //     "What I did this week.",
    //     "What I learned and what comes next.",
    //   ],
    // },
  ],

  /* ---------- RESEARCH ---------- */
  research: {
    photo: "images/canopy-pines.webp",
    question: [],
    method: [],
    findings: [],
    sources: [],
  },

  /* ---------- MENTOR ---------- */
  mentor: {
    photo: "images/canopy-oak.webp",
    paragraphs: [],
    facts: [
      ["Name", ""],
      ["Role", ""],
      ["Institution", ""],
      ["Field", ""],
    ],
  },

  /* ---------- PROJECTS ----------
     type must be one of: "research", "field", "writing"
     (these match the filter buttons on the page).                     */
  projects: [
    // {
    //   title: "Project title",
    //   type: "research",
    //   text: "One or two sentences on what it is and what you did.",
    //   image: "",                       // optional
    //   link: "",                        // optional, e.g. "https://..."
    // },
  ],

  projectsPhoto: "images/canopy-pines.webp",
  blogPhoto: "images/canopy-oak.webp",
};
