/**
 * Money Blueprint content bank — shared block type.
 *
 * The engine owns facts, the bank owns voice. Every block is addressable by a pure
 * key derived deterministically from the chart by the derivation module (facts.ts).
 * A block never asserts what is in a given chart, it only describes what a factor
 * means. See money-blueprint/content-bank/SCHEMA.md at the repo root.
 */

export interface BankBlock {
  /** The interpretation itself. 150-250 words, Betty's voice. */
  body: string;
  /** One-line action the reader can take. Closes the block so nothing reads as pure description. */
  action: string;
  /** Short label used in summary tables and the one-page pin-up. */
  label?: string;
}
