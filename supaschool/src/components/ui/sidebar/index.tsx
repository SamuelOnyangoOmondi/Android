
import * as React from "react"

// Re-export everything from the individual files
export * from "./context"
export * from "./sidebar-provider"
export * from "./sidebar-main"
export * from "./sidebar-trigger"
export * from "./sidebar-rail"
export * from "./sidebar-inset"
export * from "./sidebar-content-components"
export * from "./sidebar-group"
export * from "./sidebar-menu"
export * from "./sidebar-menu-sub"

// Also re-export from the backward-compatibility file to maintain any existing imports
export * from "./sidebar-components"
