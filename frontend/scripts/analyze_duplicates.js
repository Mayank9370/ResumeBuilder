
import fs from 'fs';

const GENERATED_REGISTRY = [
    {
        "id": "glass-fusion",
        "name": "Glass Fusion",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": { "geometric": true, "photo": true },
        "tags": ["Glass", "Creative", "Fusion", "Composed"],
        "pricing": { "premium": false },
        "__folder": "glass-fusion"
    },
    {
        "id": "mint-fresh",
        "name": "Mint Fresh",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": { "geometric": true, "photo": true },
        "tags": ["Mint", "Fresh", "Circle", "Composed"],
        "pricing": { "premium": false },
        "__folder": "mint-fresh"
    },

    {
        "id": "abstract-vivid",
        "name": "Abstract Vivid",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": { "geometric": true, "photo": true },
        "tags": ["Abstract", "Vivid", "Creative", "Composed"],
        "pricing": { "premium": false },
        "__folder": "abstract-vivid"
    },
    {
        "id": "glass-overlay",
        "name": "Glass Overlay",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": { "geometric": true, "photo": true },
        "tags": ["Glass", "Creative", "Overlay", "Composed"],
        "pricing": { "premium": false },
        "__folder": "glass-overlay"
    },
    {
        "id": "mint-circle",
        "name": "Mint Circle",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": { "geometric": true, "photo": true },
        "tags": ["Mint", "Circle", "Fresh", "Composed"],
        "pricing": { "premium": false },
        "__folder": "mint-circle"
    },
    {
        "id": "geometric-modern",
        "name": "Geometric Modern",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": { "geometric": true, "photo": true },
        "tags": ["Geometric", "Angular", "Modern", "Composed"],
        "pricing": { "premium": false },
        "__folder": "geometric-modern"
    },
    {
        "id": "abstract-pop",
        "name": "Abstract Pop",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": { "geometric": true, "photo": true },
        "tags": ["Abstract", "Pop", "Colorful", "Composed"],
        "pricing": { "premium": false },
        "__folder": "abstract-pop"
    },

    {
        "id": "international-standard",
        "name": "International Standard",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": { "geometric": false, "photo": true },
        "tags": ["International", "Professional", "Standard", "Composed"],
        "pricing": { "premium": false },
        "__folder": "international-standard"
    },
    {
        "id": "compact-one-page",
        "name": "Compact One-Page",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": { "geometric": false, "photo": false },
        "tags": ["Compact", "OnePage", "Dense", "Composed"],
        "pricing": { "premium": false },
        "__folder": "compact-one-page"
    },
    {
        "id": "boxed-modern",
        "name": "Boxed Modern",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": { "geometric": true, "photo": true },
        "tags": ["Boxed", "Modern", "Structured", "Composed"],
        "pricing": { "premium": false },
        "__folder": "boxed-modern"
    },
    {
        "id": "typographic-focus",
        "name": "Typographic Focus",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": { "geometric": false, "photo": false },
        "tags": ["Typographic", "Minimal", "Bold", "Composed"],
        "pricing": { "premium": false },
        "__folder": "typographic-focus"
    },
    {
        "id": "minimalist-split",
        "name": "Minimalist Split",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": { "geometric": false, "photo": false },
        "tags": ["Minimal", "Split", "Clean", "Composed"],
        "pricing": { "premium": false },
        "__folder": "minimalist-split"
    },

    {
        "id": "infographic-cv",
        "name": "Infographic CV",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": { "geometric": true, "photo": true },
        "tags": ["Infographic", "Creative", "Skills", "Composed"],
        "pricing": { "premium": false },
        "__folder": "infographic-cv"
    },
    {
        "id": "creative-timeline",
        "name": "Creative Timeline",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": { "geometric": true, "photo": true },
        "tags": ["Timeline", "Creative", "Modern", "Composed"],
        "pricing": { "premium": false },
        "__folder": "creative-timeline"
    },
    {
        "id": "dark-mode-dev",
        "name": "Dark Mode Dev",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": { "geometric": true, "photo": true },
        "tags": ["Dark", "Dev", "Code", "Composed"],
        "pricing": { "premium": false },
        "__folder": "dark-mode-dev"
    },
    {
        "id": "magazine-profile",
        "name": "Magazine Profile",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": { "geometric": false, "photo": true },
        "tags": ["Magazine", "Editorial", "Cream", "Composed"],
        "pricing": { "premium": false },
        "__folder": "magazine-profile"
    },
    {
        "id": "product-manager",
        "name": "Product Manager",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": { "geometric": true, "photo": true },
        "tags": ["Product", "Manager", "Teal", "Composed"],
        "pricing": { "premium": false },
        "__folder": "product-manager"
    },
    {
        "id": "engineering-lead",
        "name": "Engineering Lead",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": { "geometric": false, "photo": false },
        "tags": ["Engineering", "Lead", "Blue", "Composed"],
        "pricing": { "premium": false },
        "__folder": "engineering-lead"
    },
    {
        "id": "entry-level",
        "name": "Entry Level",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": { "geometric": true, "photo": true },
        "tags": ["Entry", "Student", "Amber", "Composed"],
        "pricing": { "premium": false },
        "__folder": "entry-level"
    },
    {
        "id": "startup-ready",
        "name": "Startup Ready",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": { "geometric": true, "photo": true },
        "tags": ["Startup", "Creative", "Violet", "Composed"],
        "pricing": { "premium": false },
        "__folder": "startup-ready"
    },
    {
        "id": "academic-cv",
        "name": "Academic CV",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": { "geometric": false, "photo": false },
        "tags": ["Academic", "Clean", "Serif", "Composed"],
        "pricing": { "premium": false },
        "__folder": "academic-cv"
    },


    {
        "id": "executive-pro",
        "name": "Executive Pro",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": { "geometric": false, "photo": false },
        "tags": ["Executive", "Serif", "Professional", "Composed"],
        "pricing": { "premium": false },
        "__folder": "executive-pro"
    },
    {
        "id": "modern-grid",
        "name": "Modern Grid",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": { "geometric": true, "photo": true },
        "tags": ["Modern", "Grid", "Clean", "Composed"],
        "pricing": { "premium": false },
        "__folder": "modern-grid"
    },
    {
        "id": "tech-minimalist",
        "name": "Tech Minimalist",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": { "geometric": false, "photo": false },
        "tags": ["Tech", "Minimal", "Clean", "Composed"],
        "pricing": { "premium": false },
        "__folder": "tech-minimalist"
    },
    {
        "id": "teal-modern",
        "name": "Teal Modern",
        "version": "1.0.1",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": { "geometric": true, "photo": true },
        "tags": ["Teal", "Modern", "Composed", "Creative"],
        "pricing": { "premium": false },
        "__folder": "teal-modern"
    },
    {
        "id": "lavender-lime",
        "name": "Lavender Lime",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": { "geometric": true, "photo": true },
        "tags": ["Lavender", "Lime", "Creative", "Composed"],
        "pricing": { "premium": false },
        "__folder": "lavender-lime"
    },


    {
        "id": "glass-overlay",
        "name": "Glass Overlay",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": { "geometric": true, "photo": true },
        "tags": ["Glassmorphism", "Soft", "Modern", "Composed"],
        "pricing": { "premium": false },
        "__folder": "glass-overlay"
    },
    {
        "id": "bold-horizon",
        "name": "Bold Horizon",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": { "photo": true },
        "tags": ["Bold", "Gradient", "Header", "Composed"],
        "pricing": { "premium": false },
        "__folder": "bold-horizon"
    },
    {
        "id": "right-mind",
        "name": "Right Mind",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": { "photo": true },
        "tags": ["Sidebar-Right", "Teal", "Creative", "Composed"],
        "pricing": { "premium": false },
        "__folder": "right-mind"
    },
    {
        "id": "minimal-boxed",
        "name": "Minimal Boxed",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": { "photo": true },
        "tags": ["Grid", "Boxed", "Minimal", "Composed"],
        "pricing": { "premium": false },
        "__folder": "minimal-boxed"
    },
    {
        "id": "mint-circle",
        "name": "Mint Circle",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": {
             "geometric": true,
             "photo": true
        },
        "tags": ["Circle", "Mint", "Creative", "Composed"],
        "pricing": { "premium": false },
        "__folder": "mint-circle"
    },
    {
        "id": "geometric-modern",
        "name": "Geometric Modern",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": {
             "geometric": true
        },
        "tags": ["Geometric", "Modern", "Composed"],
        "pricing": { "premium": false },
        "__folder": "geometric-modern"
    },
    {
        "id": "creative-sidebar",
        "name": "Creative Sidebar",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": {
             "photo": true,
             "geometric": true
        },
        "tags": ["Creative", "Sidebar", "Composed"],
        "pricing": { "premium": false },
        "__folder": "creative-sidebar"
    },
    {
        "id": "geometric-sidebar",
        "name": "Geometric Sidebar",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": {
             "geometric": true
        },
        "tags": ["Modern", "Geometric", "Teal"],
        "pricing": { "premium": false },
        "__folder": "geometric-sidebar"
    },
    {
        "id": "teal-side-label",
        "name": "Teal Side Label (Restored)",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": { "photo": false },
        "tags": ["Teal", "Label", "Restored"],
        "pricing": { "premium": false },
        "__folder": "minimalist"
    },
    {
        "id": "geometric-angular",
        "name": "Geometric Angular",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": {
             "geometric": true,
             "photo": true
        },
        "tags": ["Geometric", "Angular", "Dark", "Blue"],
        "pricing": { "premium": false },
        "__folder": "geometric-angular"
    },
    {
        "id": "geometric-layers",
        "name": "Geometric Layers",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": {
             "geometric": true,
             "photo": true
        },
        "tags": ["Geometric", "Layers", "Modern", "Clean"],
        "pricing": { "premium": false },
        "__folder": "geometric-layers"
    },
    {
        "id": "galaxy-circle",
        "name": "Galaxy Circle",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": {
             "geometric": true,
             "photo": true
        },
        "tags": ["Galaxy", "Circle", "Purple", "Gradient"],
        "pricing": { "premium": false },
        "__folder": "galaxy-circle"
    },
    {
        "id": "abstract-shapes",
        "name": "Abstract Shapes",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": {
             "geometric": true,
             "photo": true
        },
        "tags": ["Abstract", "Shapes", "Playful", "Amber"],
        "pricing": { "premium": false },
        "__folder": "abstract-shapes"
    },


    {
        "id": "alpine",
        "name": "The Alpine",
        "version": "1.0.0",
        "author": "Fundo V12",
        "layoutStrategy": "LINEAR",
        "capabilities": [
            "no-photo"
        ],
        "tags": [
            "Swiss",
            "Grid",
            "Bold"
        ],
        "pricing": {
            "premium": false
        },
        "__folder": "alpine"
    },

    {
        "id": "architect",
        "name": "The Architect",
        "version": 1,
        "author": "Antigravity",
        "family": "SPECIALIST",
        "layoutStrategy": "SIDEBAR",
        "tags": [
            "Structure",
            "Boxed",
            "Blueprint",
            "Technical"
        ],
        "capabilities": {
            "photo": {
                "supported": true,
                "positions": [
                    "sidebar-top"
                ]
            },
            "docx": { "supported": "PARTIAL" }
        },
        "description": "A structural, bordered design that feels like a technical blueprint. High density for specialists.",
        "__folder": "architect"
    },
    {
        "id": "artistic-sidebar",
        "name": "Artistic Gutter",
        "version": "1.0.0",
        "author": "Fundo V12",
        "layoutStrategy": "COMPOSED",
        "capabilities": [
            "no-photo"
        ],
        "tags": [
            "Design",
            "Asymmetric",
            "Space"
        ],
        "pricing": {
            "premium": false
        },
        "__folder": "artistic-sidebar"
    },
    {
        "id": "blue-box-header",
        "name": "Blue Box Header (Alias)",
        "version": "1.0.0",
        "author": "Fundo V12",
        "layoutStrategy": "COMPOSED",
        "capabilities": [
            "no-photo"
        ],
        "tags": [
            "Finance",
            "Tabular",
            "Data"
        ],
        "pricing": {
            "premium": false
        },
        "__folder": "blue-box-header"
    },

    {
        "id": "bold-lines",
        "name": "Bold Lines (Alias)",
        "version": "1.0.0",
        "author": "Fundo V12",
        "layoutStrategy": "COMPOSED",
        "capabilities": {
            "photo": false
        },
        "tags": [
            "Finance",
            "Heavy",
            "Structured"
        ],
        "pricing": {
            "premium": false
        },
        "__folder": "bold-lines"
    },
    {
        "id": "canvas",
        "name": "The Canvas",
        "version": "1.0.0",
        "author": "Fundo V12",
        "layoutStrategy": "COMPOSED",
        "capabilities": [
            "photo"
        ],
        "tags": [
            "White",
            "Soft",
            "Photo"
        ],
        "pricing": {
            "premium": false
        },
        "__folder": "canvas"
    },

    {
        "id": "catalyst",
        "name": "The Catalyst",
        "version": 1,
        "author": "Antigravity",
        "family": "INNOVATOR",
        "layoutStrategy": "COMPOSED",
        "tags": [
            "Energy",
            "Orange",
            "Startup",
            "Modern"
        ],
        "capabilities": {
            "photo": {
                "supported": true,
                "positions": [
                    "header-right"
                ]
            }
        },
        "__folder": "catalyst"
    },
    {
        "id": "chairman",
        "name": "The Chairman",
        "version": "1.0.0",
        "author": "Fundo V12",
        "layoutStrategy": "COMPOSED",
        "capabilities": [
            "no-photo"
        ],
        "tags": [
            "Dominant",
            "Board",
            "Heavy"
        ],
        "pricing": {
            "premium": false
        },
        "__folder": "chairman"
    },


    {
        "id": "classic-sidebar",
        "name": "Classic Sidebar",
        "version": "1.0.0",
        "author": "Fundo V12",
        "layoutStrategy": "COMPOSED",
        "capabilities": [
            "no-photo"
        ],
        "tags": [],
        "pricing": {
            "premium": false
        },
        "__folder": "classic-sidebar"
    },
    {
        "id": "clinical",
        "name": "The Clinical",
        "version": "1.0.0",
        "author": "Fundo V12",
        "layoutStrategy": "LINEAR",
        "capabilities": [
            "no-photo"
        ],
        "tags": [
            "Medical",
            "Precise",
            "Teal"
        ],
        "pricing": {
            "premium": false
        },
        "__folder": "clinical"
    },

    {
        "id": "diplomat",
        "name": "The Diplomat",
        "version": "1.0.0",
        "author": "Fundo V12",
        "layoutStrategy": "LINEAR",
        "capabilities": [
            "no-photo"
        ],
        "tags": [
            "Elegant",
            "Soft",
            "International"
        ],
        "pricing": {
            "premium": false
        },
        "__folder": "diplomat"
    },
    {
        "id": "director",
        "name": "The Director",
        "version": "1.0.0",
        "author": "Fundo V12",
        "layoutStrategy": "LINEAR",
        "capabilities": [
            "no-photo"
        ],
        "tags": [
            "Executive",
            "Modern",
            "Sharp"
        ],
        "pricing": {
            "premium": false
        },
        "__folder": "director"
    },


    {
        "id": "editorial-grid",
        "name": "Editorial Grid",
        "version": 1,
        "author": "Antigravity",
        "family": "NARRATOR",
        "layoutStrategy": "COMPOSED",
        "tags": [
            "Magazine",
            "Serif",
            "High-Contrast",
            "Grid"
        ],
        "capabilities": {},
        "description": "A sophisticated two-column grid layout inspired by high-end print typography. Balances density with readability.",
        "__folder": "editorial-grid"
    },
    {
        "id": "engineer",
        "name": "The Engineer",
        "version": "1.0.0",
        "author": "Fundo V12",
        "layoutStrategy": "LINEAR",
        "capabilities": [
            "no-photo"
        ],
        "tags": [
            "Dense",
            "Technical",
            "Compact"
        ],
        "pricing": {
            "premium": false
        },
        "__folder": "engineer"
    },
    {
        "id": "essence",
        "name": "The Essence",
        "version": "1.0.0",
        "author": "Fundo V12",
        "layoutStrategy": "LINEAR",
        "capabilities": [
            "no-photo"
        ],
        "tags": [
            "Pure",
            "No-Frills",
            "Writer"
        ],
        "pricing": {
            "premium": false
        },
        "__folder": "essence"
    },

    {
        "id": "fellow",
        "name": "The Fellow",
        "version": "1.0.0",
        "author": "Fundo V12",
        "layoutStrategy": "LINEAR",
        "capabilities": [
            "no-photo"
        ],
        "tags": [
            "Academic",
            "CV",
            "Dense"
        ],
        "pricing": {
            "premium": false
        },
        "__folder": "fellow"
    },

    {
        "id": "flux",
        "name": "The Flux",
        "version": "1.0.0",
        "author": "Fundo V12",
        "layoutStrategy": "COMPOSED",
        "capabilities": [
            "no-photo"
        ],
        "tags": [
            "Creative",
            "Airy",
            "Design"
        ],
        "pricing": {
            "premium": false
        },
        "__folder": "flux"
    },

    {
        "id": "legacy",
        "name": "The Legacy",
        "version": "1.0.0",
        "author": "Fundo V12",
        "layoutStrategy": "LINEAR",
        "capabilities": [
            "no-photo"
        ],
        "tags": [
            "Academic",
            "Old",
            "Serif"
        ],
        "pricing": {
            "premium": false
        },
        "__folder": "legacy"
    },
    {
        "id": "logic",
        "name": "The Logic",
        "version": "1.0.0",
        "author": "Fundo V12",
        "layoutStrategy": "LINEAR",
        "capabilities": [
            "no-photo"
        ],
        "tags": [
            "Code",
            "Dev",
            "Mono"
        ],
        "pricing": {
            "premium": false
        },
        "__folder": "logic"
    },
    {
        "id": "minimalist",
        "name": "Minimalist",
        "version": "1.0.0",
        "author": "Fundo Legacy",
        "layoutStrategy": "single-column",
        "capabilities": [
            "no-photo"
        ],
        "tags": [
            "ATS Optimized",
            "Minimal",
            "Clean"
        ],
        "pricing": {
            "premium": false
        },
        "__folder": "minimalist"
    },


    {
        "id": "nordic",
        "name": "The Nordic",
        "version": "1.0.0",
        "author": "Fundo V12",
        "layoutStrategy": "LINEAR",
        "capabilities": [
            "no-photo"
        ],
        "tags": [
            "Clean",
            "Open",
            "Light"
        ],
        "pricing": {
            "premium": false
        },
        "__folder": "nordic"
    },


    {
        "id": "presidio",
        "name": "The Presidio",
        "version": "1.0.0",
        "author": "Fundo V12",
        "layoutStrategy": "LINEAR",
        "capabilities": [
            "no-photo"
        ],
        "tags": [
            "Gov",
            "Block",
            "Grey"
        ],
        "pricing": {
            "premium": false
        },
        "__folder": "presidio"
    },



    {
        "id": "professional-timeline",
        "name": "Flow Line",
        "version": "1.0.0",
        "author": "Fundo V12",
        "layoutStrategy": "LINEAR",
        "capabilities": [
            "no-photo"
        ],
        "tags": [
            "Timeline",
            "Flow",
            "Left"
        ],
        "pricing": {
            "premium": false
        },
        "__folder": "professional-timeline"
    },
    {
        "id": "senator",
        "name": "The Senator",
        "version": "1.0.0",
        "author": "Fundo V12",
        "layoutStrategy": "LINEAR",
        "capabilities": [
            "no-photo"
        ],
        "tags": [
            "Traditional",
            "Legal",
            "Centered"
        ],
        "pricing": {
            "premium": false
        },
        "__folder": "senator"
    },

    {
        "id": "signal",
        "name": "The Signal",
        "version": "1.0.0",
        "author": "Fundo V12",
        "layoutStrategy": "COMPOSED",
        "capabilities": [
            "no-photo"
        ],
        "tags": [
            "Loud",
            "Sales",
            "Bold"
        ],
        "pricing": {
            "premium": false
        },
        "__folder": "signal"
    },
    {
        "id": "silicon",
        "name": "The Silicon",
        "version": "1.0.0",
        "author": "Fundo V12",
        "layoutStrategy": "LINEAR",
        "capabilities": [
            "no-photo"
        ],
        "tags": [
            "Tech",
            "Modern",
            "Blue"
        ],
        "pricing": {
            "premium": false
        },
        "__folder": "silicon"
    },

    {
        "id": "soft-rose",
        "name": "Soft Rose",
        "version": "1.0.0",
        "author": "Fundo V12",
        "layoutStrategy": "COMPOSED",
        "capabilities": [
            "no-photo"
        ],
        "tags": [],
        "pricing": {
            "premium": false
        },
        "__folder": "soft-rose"
    },
    {
        "id": "storyteller",
        "name": "The Storyteller",
        "version": "1.0.0",
        "author": "Fundo V12",
        "layoutStrategy": "LINEAR",
        "capabilities": [
            "no-photo"
        ],
        "tags": [
            "Reader",
            "Humanist",
            "Flow"
        ],
        "pricing": {
            "premium": false
        },
        "__folder": "storyteller"
    },


    {
        "id": "vertex",
        "name": "The Vertex",
        "version": "1.0.0",
        "author": "Fundo V12",
        "layoutStrategy": "COMPOSED",
        "capabilities": [
            "no-photo"
        ],
        "tags": [
            "Geometric",
            "Sharp",
            "Game"
        ],
        "pricing": {
            "premium": false
        },
        "__folder": "vertex"
    },

    {
        "id": "zen",
        "name": "The Zen",
        "version": "1.0.0",
        "author": "Fundo V12",
        "layoutStrategy": "LINEAR",
        "capabilities": [
            "no-photo"
        ],
        "tags": [
            "Centered",
            "Calm",
            "Wellness"
        ],
        "pricing": {
            "premium": false
        },
        "__folder": "zen"
    },
    {
        "id": "creative-spark",
        "name": "Creative Spark",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": { "geometric": true, "photo": true },
        "tags": ["Creative", "Spark", "Modern", "Composed"],
        "pricing": { "premium": false },
        "__folder": "creative-spark"
    },
    {
        "id": "hexagon-tech",
        "name": "Hexagon Tech",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": { "geometric": true, "photo": true },
        "tags": ["Hexagon", "Tech", "Dark", "Composed"],
        "pricing": { "premium": false },
        "__folder": "hexagon-tech"
    },
    {
        "id": "artistic-splash",
        "name": "Artistic Splash",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": { "geometric": true, "photo": true },
        "tags": ["Artistic", "Splash", "Soft", "Composed"],
        "pricing": { "premium": false },
        "__folder": "artistic-splash"
    },
    {
        "id": "modern-minimal",
        "name": "Modern Minimal",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": { "photo": true },
        "tags": ["Modern", "Minimal", "Clean", "Composed"],
        "pricing": { "premium": false },
        "__folder": "modern-minimal"
    },
    {
        "id": "sleek-sidebar",
        "name": "Sleek Sidebar",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": { "photo": true },
        "tags": ["Sleek", "Sidebar", "Dark", "Composed"],
        "pricing": { "premium": false },
        "__folder": "sleek-sidebar"
    },
    {
        "id": "urban-bold",
        "name": "Urban Bold",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": { "geometric": true, "photo": true },
        "tags": ["Urban", "Bold", "Black", "Composed"],
        "pricing": { "premium": false },
        "__folder": "urban-bold"
    },
    {
        "id": "soft-gradient",
        "name": "Soft Gradient",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": { "photo": true },
        "tags": ["Soft", "Gradient", "Modern", "Composed"],
        "pricing": { "premium": false },
        "__folder": "soft-gradient"
    },
    {
        "id": "professional-clean",
        "name": "Professional Clean",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": { "photo": false },
        "tags": ["Professional", "Clean", "ATS", "Composed"],
        "pricing": { "premium": false },
        "__folder": "professional-clean"
    },
    {
        "id": "standard-corporate",
        "name": "Standard Corporate",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": { "photo": false },
        "tags": ["Standard", "Corporate", "Serif", "Composed"],
        "pricing": { "premium": false },
        "__folder": "standard-corporate"
    },
    {
        "id": "simple-essence",
        "name": "Simple Essence",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": { "photo": false },
        "tags": ["Simple", "Essence", "Linear", "Composed"],
        "pricing": { "premium": false },
        "__folder": "simple-essence"
    },

    {
        "id": "brutal-sharp",
        "name": "Brutal Sharp",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": { "geometric": true, "photo": true },
        "tags": ["Brutal", "Sharp", "Bold", "Composed"],
        "pricing": { "premium": false },
        "__folder": "brutal-sharp"
    },
    {
        "id": "glass-prism",
        "name": "Glass Prism",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": { "geometric": true, "photo": true },
        "tags": ["Glass", "Prism", "Modern", "Composed"],
        "pricing": { "premium": false },
        "__folder": "glass-prism"
    },
    {
        "id": "abstract-curve",
        "name": "Abstract Curve",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": { "geometric": true, "photo": true },
        "tags": ["Abstract", "Curve", "Artistic", "Composed"],
        "pricing": { "premium": false },
        "__folder": "abstract-curve"
    },
    {
        "id": "tech-grid",
        "name": "Tech Grid",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": { "geometric": true, "photo": true },
        "tags": ["Tech", "Grid", "Structured", "Composed"],
        "pricing": { "premium": false },
        "__folder": "tech-grid"
    },
    {
        "id": "compact-cards",
        "name": "Compact Cards",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": { "photo": true },
        "tags": ["Compact", "Cards", "Grid", "Composed"],
        "pricing": { "premium": false },
        "__folder": "compact-cards"
    },
    {
        "id": "vibrant-wave",
        "name": "Vibrant Wave",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": { "geometric": true, "photo": true },
        "tags": ["Vibrant", "Wave", "Creative", "Composed"],
        "pricing": { "premium": false },
        "__folder": "vibrant-wave"
    },
    {
        "id": "monogram-header",
        "name": "Monogram Header",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": { "geometric": true, "photo": true },
        "tags": ["Monogram", "Fashion", "Minimal", "Composed"],
        "pricing": { "premium": false },
        "__folder": "monogram-header"
    },
    {
        "id": "sidekick",
        "name": "Sidekick",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": { "photo": true },
        "tags": ["Sidekick", "Narrow", "Efficient", "Composed"],
        "pricing": { "premium": false },
        "__folder": "sidekick"
    },
    {
        "id": "retro-pop",
        "name": "Retro Pop",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": { "geometric": true, "photo": true },
        "tags": ["Retro", "Pop", "90s", "Composed"],
        "pricing": { "premium": false },
        "__folder": "retro-pop"
    },
    {
        "id": "modern-elegant",
        "name": "Modern Elegant",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": { "photo": true },
        "tags": ["Modern", "Elegant", "Clean", "Composed"],
        "pricing": { "premium": false },
        "__folder": "modern-elegant"
    },
    {
        "id": "creative-bold",
        "name": "Creative Bold",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": { "photo": true, "geometric": true },
        "tags": ["Creative", "Bold", "Geometric", "Composed"],
        "pricing": { "premium": false },
        "__folder": "creative-bold"
    },


    {
        "id": "onyx-premium",
        "name": "Onyx Premium",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": { "photo": false, "geometric": false },
        "tags": ["Luxury", "Dark", "Gold", "Composed"],
        "pricing": { "premium": true },
        "__folder": "onyx-premium"
    },
    {
        "id": "abstract-pop",
        "name": "Abstract Pop",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": { "photo": true, "geometric": true },
        "tags": ["Creative", "Abstract", "Vibrant", "Composed"],
        "pricing": { "premium": false },
        "__folder": "abstract-pop"
    },
    {
        "id": "luminous-layers",
        "name": "Luminous Layers",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": { "photo": true, "geometric": true },
        "tags": ["Glassmorphism", "Soft", "Pastel", "Composed"],
        "pricing": { "premium": false },
        "__folder": "luminous-layers"
    },
    {
        "id": "modern-mosaic",
        "name": "Modern Mosaic",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": { "photo": true, "geometric": true },
        "tags": ["Grid", "Bento", "Bold", "Composed"],
        "pricing": { "premium": false },
        "__folder": "modern-mosaic"
    }
    ,
    {
        "id": "editorial-one",
        "name": "Editorial One",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": { "photo": false, "geometric": false },
        "tags": ["Minimal", "Editorial", "Serif", "Composed"],
        "pricing": { "premium": false },
        "__folder": "editorial-one"
    },
    {
        "id": "aurora-cards",
        "name": "Aurora Cards",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": { "photo": true, "geometric": false },
        "tags": ["Soft", "Gradient", "Cards", "Composed"],
        "pricing": { "premium": false },
        "__folder": "aurora-cards"
    },
    {
        "id": "vertical-flow",
        "name": "Vertical Flow",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": { "photo": true, "geometric": false },
        "tags": ["Timeline", "Vertical", "Clean", "Composed"],
        "pricing": { "premium": false },
        "__folder": "vertical-flow"
    },
    {
        "id": "offset-studio",
        "name": "Offset Studio",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": { "photo": true, "geometric": true },
        "tags": ["Creative", "Asymmetric", "Bold", "Composed"],
        "pricing": { "premium": false },
        "__folder": "offset-studio"
    },
    {
        "id": "tech-pro",
        "name": "Tech Pro",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "COMPOSED",
        "capabilities": { "photo": false, "geometric": false },
        "tags": ["Corporate", "Structured", "ATS", "Composed"],
        "pricing": { "premium": false },
        "__folder": "tech-pro"
    }
];

function analyzeRegistry(registry) {
    const idMap = new Map();
    const folderMap = new Map();
    const nameMap = new Map();

    const result = {
        duplicatesById: [],
        duplicatesByFolder: [],
        duplicatesByName: [],
        suspiciouslySimilar: []
    };

    registry.forEach((item) => {
        // ID check
        if (idMap.has(item.id)) {
            result.duplicatesById.push({
                original: idMap.get(item.id),
                duplicate: item
            });
        }
        idMap.set(item.id, item);

        // Folder check
        if (folderMap.has(item.__folder)) {
            result.duplicatesByFolder.push({
                folder: item.__folder,
                item1: folderMap.get(item.__folder).id,
                item2: item.id
            });
        } else {
            folderMap.set(item.__folder, item);
        }

        // Name check
        if (nameMap.has(item.name)) {
            result.duplicatesByName.push({
                name: item.name,
                item1: nameMap.get(item.name).id,
                item2: item.id
            });
        } else {
            nameMap.set(item.name, item);
        }
    });

    return result;
}

const analysis = analyzeRegistry(GENERATED_REGISTRY);
fs.writeFileSync('analysis_result.json', JSON.stringify(analysis, null, 2));
console.log("Analysis written to analysis_result.json");
