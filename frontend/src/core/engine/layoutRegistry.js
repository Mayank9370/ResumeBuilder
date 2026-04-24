import { getRegisteredTemplate } from '@/modules/resume-builder/utils/resumeTemplates';
import LinearLayoutStrategy from '@/core/engine/strategies/LinearLayoutStrategy';
import DualColumnLayoutStrategy from '@/core/engine/strategies/DualColumnLayoutStrategy';

export const LAYOUT_STRATEGIES = {
    LINEAR: LinearLayoutStrategy,
    DUAL_COLUMN: DualColumnLayoutStrategy,
    // Alias Mappings for Legacy/Compatibility
    'single-column': LinearLayoutStrategy,
};

// ========================================
// PHASE V14.5: STRICT REGISTRY GOVERNANCE
// ========================================
// Rule 1: NO Silent Default Fallbacks
// Rule 2: Registry is the Single Source of Truth
// Rule 3: Fail Fast on Configuration Errors

export const resolveLayoutStrategy = (templateId) => {
    // 1. Validate Input
    if (!templateId) {
        console.warn(`[LAYOUT REGISTRY] CRITICAL: templateId is undefined. This indicates an upstream issue.`);
        // For strictness, we should probably throw or return a safe error state.
        // But throwing might crash the entire app if error boundary isn't tight.
        // Given user request "FAIL fast (dev + CI)", Throwing is appropriate.
        throw new Error("Layout Resolution Error: templateId is undefined.");
    }

    // 2. Lookup in Generated Registry
    const template = getRegisteredTemplate(templateId);

    if (!template) {
        console.error(`[LAYOUT REGISTRY] GOVERNANCE VIOLATION: Template ID '${templateId}' is not registered.`);
        // Hard Failure as requested
        throw new Error(`Layout Resolution Error: Template '${templateId}' not found in Registry. Please check registry.generated.js`);
    }

    // 3. Resolve Strategy Key
    const strategyKey = template.layoutStrategy;

    // 4. Map to Component
    const StrategyComponent = LAYOUT_STRATEGIES[strategyKey];

    if (!StrategyComponent) {
        console.error(`[LAYOUT REGISTRY] GOVERNANCE VIOLATION: Template '${templateId}' specifies unknown strategy '${strategyKey}'`);
        throw new Error(`Layout Resolution Error: Unknown strategy '${strategyKey}' for template '${templateId}'`);
    }

    // 5. Success
    // console.log(`[LAYOUT REGISTRY] Resolved: ${templateId} -> ${strategyKey}`);
    return StrategyComponent;
};
