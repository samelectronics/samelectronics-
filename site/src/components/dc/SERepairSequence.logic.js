// @ts-nocheck
/* eslint-disable */
// Logic class from design/project/SE Repair Sequence.dc.html, unchanged except for this header, the export
// and webpackIgnore on runtime imports. Converted 12 Oct 2026; maintained by hand since.
import React from 'react';
import { DCLogic, StreamableLogic } from '@/dc/runtime';

class Component extends DCLogic {
  state = { sc: 1 };
  boxRef = React.createRef();
  componentDidMount() { this.ro = new ResizeObserver(() => { const b = this.boxRef.current; if (!b) return; const w = b.clientWidth, h = b.clientHeight - 64; this.setState({ sc: Math.max(0.5, Math.min(1.15, (w - 24) / 620, (h - 10) / 440)).toFixed(3) }); }); setTimeout(() => this.boxRef.current && this.ro.observe(this.boxRef.current), 40); }
  componentWillUnmount() { this.ro && this.ro.disconnect(); }
  renderVals() { return { boxRef: this.boxRef, sc: this.state.sc }; }
}

export default Component;
