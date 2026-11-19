'use client';
// Owner (18 Nov): "the grade and manufacturer labels look like 1990s boxes of letters; I want cool, bold, techy, modern
// tags, each with its own shiny gradient colour, like the teardown look". One tag family used everywhere (shop cards,
// product view, search, ads): grades are filled chamfered chips with their own gradient and a light that sweeps across
// all tags in step; makers are graphite chips with a glowing dot in their own colour; offers are vivid, with an icon.
import React from 'react';
import { T } from '@/components/site/ui';

/** grade code (product.grade) → css key; quality id (catalogue) → the same key */
const Q2G: Record<string, string> = { original: 'OR', compatible: 'CO', standard: 'ST', aaa: 'AQ', aa: 'AA', 'oled-soft': 'OL', 'oled-big': 'OB', 'oled-small': 'OS', incell: 'IN', ather: 'OT', other: 'OT' };
const N2G: Record<string, string> = { original: 'OR', compatible: 'CO', standard: 'ST', aaa: 'AQ', aa: 'AA', 'oled soft': 'OL', 'oled big': 'OB', 'oled small': 'OS', incell: 'IN', other: 'OT' };
const M2K: Record<string, string> = { 'service-pack': 'sp', oem: 'oem', repaied: 'ro', gx: 'gx', zy: 'zy', yk: 'yk', taiwan: 'tw', anther: 'ot', other: 'ot' };
const MN2K: Record<string, string> = { 'service pack': 'sp', oem: 'oem', 'repaired oled': 'ro', refurbished: 'ro', gx: 'gx', zy: 'zy', yk: 'yk', taiwan: 'tw', other: 'ot' };
export const gradeKey = (g: string) => (g.length === 2 && g === g.toUpperCase() ? g : Q2G[g] || N2G[g.toLowerCase()] || 'OT');
export const makerKey = (m: string) => M2K[m] || MN2K[m.toLowerCase()] || 'ot';

// owner (18 Nov night): "the tags look AI and cheap". v5: quiet, clean labels. A quality is a soft-tinted rounded label
// in its own clean colour; a manufacturer is a plain grey outlined label (no colours, no dots, no bars).
export function GradeTag({ g, name, size }: { g: string; name: string; size?: 'sm' | 'lg' }) {
  return <span className={'tq q-' + gradeKey(g) + (size ? ' ' + size : '')}>{name}</span>;
}
export function MakerTag({ m, name, size }: { m: string; name: string; size?: 'sm' | 'lg' }) {
  return <span className={'tm k-' + makerKey(m || name) + (size ? ' ' + size : '')}>{name}</span>;
}
export function DealTag({ pct }: { pct: number }) {
  return <span className="tg tg-x deal"><svg width="11" height="11" viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2 4 14h7l-1 8 9-12h-7z" fill="currentColor" /></svg><b>−{pct}%</b></span>;
}
export function BestTag() {
  return <span className="tg tg-x best"><svg width="11" height="11" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c1 4 5 5.5 5 10.5A5 5 0 0 1 12 18a5 5 0 0 1-5-5.5c0-2 1-3.4 2-4.3.2 1.6 1 2.6 2 3 0-3.4.4-6.2 1-9.2z" fill="currentColor" /></svg><b>{T('BEST SELLER')}</b></span>;
}
export function NewTag() {
  return <span className="tg tg-x new"><i className="tg-ping" aria-hidden="true" /><b>{T('NEW')}</b></span>;
}
