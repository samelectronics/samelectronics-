'use client';
/**
 * Minimal React host for the components converted from the Claude Design prototypes.
 *
 * The prototypes ran on the design tool's "dc" runtime: an HTML template bound with
 * {{ expressions }} plus a logic class (`class Component extends DCLogic`) whose
 * renderVals() feeds the template. scripts/archive/dc-codegen.mjs turned each template into JSX (12 Oct);
 * this file reproduces the runtime semantics the logic classes rely on (state, lifecycle,
 * the .sc-host wrapper, text interpolation and style parsing) so the visuals and
 * behaviour stay identical to design/project/.
 */
import React from 'react';
import { site } from '@/content/facts';

type AnyProps = Record<string, any>;
export type Vals = Record<string, any>;

/** Base class for the design's logic classes (was DCLogic / StreamableLogic). */
export class DCLogic {
  props: AnyProps;
  state: AnyProps = {};
  /** Back-pointer to the React host, installed after construction. */
  __host: DCHostBase | null = null;
  constructor(props?: AnyProps) {
    this.props = props || {};
  }
  setState(update: AnyProps | ((prev: AnyProps) => AnyProps), cb?: () => void) {
    this.__host && this.__host.__setLogicState(update, cb);
  }
  forceUpdate() {
    this.__host && this.__host.forceUpdate();
  }
  componentDidMount() {}
  componentDidUpdate(_prevProps: AnyProps) {}
  componentWillUnmount() {}
  /** The flat object the template renders against (merged over props). */
  renderVals(): Vals {
    return {};
  }
}
export const StreamableLogic = DCLogic;

const kebabToCamel = (s: string) => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

/** Inline style string → React style object (same parsing as the dc runtime). */
export function cssToObj(css: string): React.CSSProperties {
  const o: AnyProps = {};
  for (const decl of css.split(';')) {
    const i = decl.indexOf(':');
    if (i < 0) continue;
    const prop = decl.slice(0, i).trim();
    o[prop.startsWith('--') ? prop : kebabToCamel(prop)] = decl.slice(i + 1).trim();
  }
  return o;
}

/** A style attribute bound as a whole ({{ x }}): strings are parsed, objects pass through. */
export function st(v: unknown): any {
  return typeof v === 'string' ? cssToObj(v) : v;
}

/** One part of an attribute that mixes text and {{ }} bindings. */
export function s(v: unknown): any {
  return v ?? '';
}

/** A {{ value }} inside text content. */
export function t(v: unknown): React.ReactNode {
  if (v === undefined || v === null || typeof v === 'boolean') return null;
  if (React.isValidElement(v) || Array.isArray(v)) return v as React.ReactNode;
  return <span className="sc-interp">{String(v)}</span>;
}

/** value / checked bound to undefined render as empty / unchecked (controlled inputs). */
export const val = (v: unknown): any => (v === undefined ? '' : v);
export const chk = (v: unknown): any => (v === undefined ? false : v);

/** Concatenate class names, skipping empties. */
export const cx = (...c: unknown[]) => c.filter(Boolean).join(' ') || undefined;

const HOST_STYLE_PROPS = new Set(['position', 'left', 'right', 'top', 'bottom', 'inset', 'width', 'height', 'z-index', 'transform']);

/** Only positioning properties of a component's style attribute reach its host element. */
export function hostPositionStyle(style: unknown): React.CSSProperties | undefined {
  const all = typeof style === 'string' ? cssToObj(style) : style != null && typeof style === 'object' ? (style as AnyProps) : null;
  if (!all) return undefined;
  const out: AnyProps = {};
  for (const [k, v] of Object.entries(all)) {
    const kebab = k.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase());
    if (HOST_STYLE_PROPS.has(kebab)) out[k] = v;
  }
  return Object.keys(out).length ? out : undefined;
}

type LogicClass = new (props: AnyProps) => DCLogic;
type HostProps = AnyProps & { __hostStyle?: React.CSSProperties };

function userProps(p: HostProps): AnyProps {
  const { __hostStyle, ...rest } = p;
  return rest;
}

abstract class DCHostBase extends React.Component<HostProps, { __v: number; __err: string | null }> {
  abstract __setLogicState(update: AnyProps | ((prev: AnyProps) => AnyProps), cb?: () => void): void;
}

/**
 * Wrap a converted template + its logic class as a React component.
 * Renders `<div class="sc-host" data-sc-name=…>` around the template, as the design runtime did.
 */
export function createDC(name: string, Logic: LogicClass | null, render: (v: Vals) => React.ReactNode) {
  class Host extends DCHostBase {
    static displayName = name.replace(/\s+/g, '');
    logic: DCLogic;
    constructor(props: HostProps) {
      super(props);
      this.state = { __v: 0, __err: null };
      const L = Logic || DCLogic;
      try {
        this.logic = new L(userProps(props));
      } catch (e) {
        console.error(e);
        this.logic = new DCLogic(userProps(props));
      }
      this.logic.__host = this;
    }
    static getDerivedStateFromError(e: unknown) {
      return { __err: e instanceof Error && e.message ? e.message : String(e) };
    }
    componentDidCatch(e: unknown, info: React.ErrorInfo) {
      console.error('[' + name + '] render error:', e, info?.componentStack || '');
    }
    __setLogicState(update: AnyProps | ((prev: AnyProps) => AnyProps), cb?: () => void) {
      const prev = this.logic.state;
      const patch = typeof update === 'function' ? update(prev) : update;
      this.logic.state = { ...prev, ...patch };
      this.setState((st) => ({ __v: st.__v + 1 }), cb);
    }
    componentDidMount() {
      try {
        this.logic.componentDidMount();
      } catch (e) {
        console.error(e);
      }
    }
    componentDidUpdate(prevProps: HostProps) {
      this.logic.props = userProps(this.props);
      try {
        this.logic.componentDidUpdate(prevProps);
      } catch (e) {
        console.error(e);
      }
    }
    componentWillUnmount() {
      try {
        this.logic.componentWillUnmount();
      } catch (e) {
        console.error(e);
      }
    }
    render() {
      const up = userProps(this.props);
      this.logic.props = up;
      // $facts: company facts (src/content/facts.ts) that replaced literals in the design templates.
      let vals: Vals = { $facts: site, ...up };
      try {
        vals = { $facts: site, ...up, ...(this.logic.renderVals() || {}) };
      } catch (e) {
        console.error(name + '.renderVals():', e);
      }
      return (
        <div className={'sc-host' + (this.state.__err ? ' sc-has-error' : '')} style={this.props.__hostStyle} data-sc-name={name}>
          {this.state.__err ? null : render(vals)}
        </div>
      );
    }
  }
  return Host as unknown as React.ComponentType<AnyProps>;
}
