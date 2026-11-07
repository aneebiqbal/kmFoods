/**
 * The Pantry Shelf was replaced by the Market Shelf. This module re-exports it
 * so existing imports keep working during the redesign.
 */
export { MarketShelf as PantryShelf } from "@/components/market-shelf";
export type { Shelf } from "@/components/market-shelf";
