/**
 * Skills Normalizer Utility
 * 
 * Purpose: Standardize and semantically categorize technical skills for "New ATS" format.
 * Constraints: CONSTANT_TIME dictionary lookups, Zero-Start (no backend dep), Safe Fallbacks.
 */

// 1. Dictionary for Naming Standardization
const NAME_MAP = {
    // Languages
    "js": "JavaScript",
    "ts": "TypeScript",
    "cpp": "C++",
    "c++": "C++", // standardizing casing
    "golang": "Go",
    "python3": "Python",
    // Frameworks & Runtimes
    "nodejs": "Node.js",
    "node.js": "Node.js",
    "express": "Express.js",
    "expressjs": "Express.js",
    "reactjs": "React",
    "nextjs": "Next.js",
    "next.js": "Next.js",
    "vuejs": "Vue.js",
    "vue": "Vue.js",
    "angularjs": "Angular", // Legacy handling
    "dotnet": ".NET",
    "spring boot": "Spring Boot",
    "springboot": "Spring Boot",
    // DBs
    "postgres": "PostgreSQL",
    "postgresql": "PostgreSQL",
    "mongo": "MongoDB",
    "mongodb": "MongoDB",
    "mssql": "SQL Server",
    // Cloud & DevOps
    "aws": "AWS", // casing
    "amazon web services": "AWS",
    "gcp": "Google Cloud",
    "azure": "Azure",
    "k8s": "Kubernetes",
    "kubernetes": "Kubernetes",
    "docker": "Docker",
    "terraform": "Terraform",
    "jenkins": "Jenkins",
    "github actions": "GitHub Actions",
    // OS
    "linux": "Linux",
    "unix": "Unix",
    "windows": "Windows",
    // Observability
    "datadog": "Datadog",
    "prometheus": "Prometheus",
    "grafana": "Grafana",
    "splunk": "Splunk",
    "newrelic": "New Relic",
    // Domain / Support
    "zendesk": "Zendesk",
    "salesforce": "Salesforce",
    "jira": "Jira",
    "confluence": "Confluence",
    "servicenow": "ServiceNow",
    "crm": "CRM"
};

// 2. Semantic Buckets (Keyword matching)
const BUCKETS = [
    {
        name: "Programming Languages",
        keywords: ["javascript", "typescript", "python", "java", "c++", "c#", "go", "ruby", "php", "swift", "kotlin", "rust", "scala", "html", "css", "sql"]
    },
    {
        name: "Frameworks & Databases",
        keywords: ["react", "next.js", "vue.js", "angular", "node.js", "express.js", "django", "flask", "spring", "spring boot", "dot net", ".net", "postgresql", "mongodb", "mysql", "redis", "elasticsearch", "oracle", "sql server", "sqlite", "mariadb", "dynamodb"]
    },
    {
        name: "Cloud & Infrastructure",
        keywords: ["aws", "azure", "google cloud", "docker", "kubernetes", "terraform", "ansible", "jenkins", "gitlab ci", "github actions", "circleci", "nginx", "apache", "linux", "unix", "bash", "shell"]
    },
    {
        name: "Observability & Monitoring",
        keywords: ["datadog", "prometheus", "grafana", "splunk", "new relic", "elk", "kibana", "elastic stack", "cloudwatch"]
    },
    {
        name: "Domain Expertise",
        keywords: ["customer support", "technical support", "crm", "zendesk", "salesforce", "jira", "confluence", "servicenow", "itil", "incident management", "troubleshooting", "sla management", "operations"]
    }
];

export const normalizeSkills = (rawInput) => {
    // Step A: Flatten all input into a single list of strings first
    let flatSkills = [];

    const flatten = (item) => {
        if (typeof item === 'string') {
            flatSkills.push(item);
        } else if (Array.isArray(item)) {
            item.forEach(flatten);
        } else if (typeof item === 'object' && item !== null) {
            // Extract from object structures
            const children = item.data || item.skills || item.items || item.subcategories || item.bullets;
            if (children) {
                flatten(children);
            } else {
                // LEAF NODE: Extract text from common keys
                const text = item.name || item.content || item.value || item.label;
                if (typeof text === 'string') {
                    flatSkills.push(text);
                }
            }
        }
    };


    flatten(rawInput);

    // Filter duplicates and empty strings
    flatSkills = [...new Set(flatSkills.map(s => s.trim()).filter(s => s))];

    // Step B: Normalize Names & Categorize
    const categorized = {};
    BUCKETS.forEach(b => categorized[b.name] = []);
    categorized["Other Skills"] = []; // Fallback

    flatSkills.forEach(rawSkill => {
        const lower = rawSkill.toLowerCase();

        // 1. Name Standardization
        let cleanName = rawSkill; // Default to original casing
        if (NAME_MAP[lower]) {
            cleanName = NAME_MAP[lower];
        }

        // 2. Bucket Matching
        let placed = false;

        // Check exact bucket matches or substring matches
        for (const bucket of BUCKETS) {
            // Check if normalized name matches any keyword in the bucket
            // logic: keyword should match the skill string whole or significantly
            // Simpler approach: Check if cleanName starts with or contains known keywords
            // but we must be careful not to over-match (e.g. "Java" matching "JavaScript")

            const match = bucket.keywords.some(k => {
                const kLower = k.toLowerCase();
                const skillLower = cleanName.toLowerCase();
                return skillLower === kLower || skillLower.startsWith(kLower + " ") || skillLower.endsWith(" " + kLower);
                // Loose matching for multi-word skills like "AWS Lambda" matching "AWS" keywords
            });

            if (match) {
                categorized[bucket.name].push(cleanName);
                placed = true;
                break; // Stop after first bucket match (priority order)
            }
        }

        if (!placed) {
            categorized["Other Skills"].push(cleanName);
        }
    });

    // Step C: Construct Output
    const output = [];

    // Add primary buckets
    BUCKETS.forEach(bucket => {
        if (categorized[bucket.name].length > 0) {
            output.push({
                name: bucket.name,
                data: categorized[bucket.name]
            });
        }
    });

    // Add Other Skills at the end
    if (categorized["Other Skills"].length > 0) {
        // If "Other Skills" is the ONLY category, maybe rename it to "Skills" or "Core Skills" for better aesthetics
        // But for now, adhering to strict buckets
        const name = output.length === 0 ? "Core Skills" : "Other Skills";
        output.push({
            name: name,
            data: categorized["Other Skills"]
        });
    }

    return output;
};
