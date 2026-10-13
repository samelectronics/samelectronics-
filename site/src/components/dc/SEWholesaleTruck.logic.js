// @ts-nocheck
/* eslint-disable */
// Logic class from design/project/SE Wholesale Truck.dc.html, unchanged except for this header, the export
// and webpackIgnore on runtime imports. Converted 12 Oct 2026; maintained by hand since.
import React from 'react';
import { DCLogic, StreamableLogic } from '@/dc/runtime';

class Component extends DCLogic {
  state = { ph: 0 };
  componentDidMount() { this.t0 = performance.now(); this.iv = setInterval(() => { const t = ((performance.now() - this.t0) / 1000) % 12; this.setState({ ph: t }); }, 250); }
  componentWillUnmount() { clearInterval(this.iv); }
  renderVals() {
    const n = Math.max(1, Math.min(16, Number(this.props.n) || 4)), t = this.state.ph, dest = ['Accra', 'Lagos', 'Nairobi', 'Muscat', 'Amman'][Math.floor((performance.now() - (this.t0 || 0)) / 12000) % 5];
    const status = t < 0.6 ? 'Pallet in position' : t < 3.6 ? 'Stacking ' + n + ' carton' + (n > 1 ? 's' : '') + '…' : t < 4.6 ? 'Wrapping…' : t < 6.6 ? 'Wrapped · truck reversing in' : t < 7.8 ? 'Loading' : t < 10 ? 'Off to dispatch · ' + dest : 'Next pallet…';
    const o = { status, wrapH: Math.ceil(n / 4) * 24 + 2, wheelState: (t > 4.6 && t < 6.6) || t > 7.8 ? 'running' : 'paused' };
    for (let i = 0; i < 16; i++) o['cDisp' + i] = i < n ? 'block' : 'none';
    return o;
  }
}

export default Component;
