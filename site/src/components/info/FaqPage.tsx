'use client';
import React from 'react';
import { PageHero, T } from '@/components/site/ui';
import Faq from '@/components/site/Faq';
export default function FaqPage() {
  return (
    <>
      <PageHero eb={T('HELP · QUESTIONS')} title={T('Questions?')} accent={T('Answered.')} crumb={[[T('Questions')]]} seed={63} sub={T('Parts, repairs, trade, shipping and payments. Search, or pick a topic. Still stuck? Samsoom is one tap away.')} />
      <Faq all />
    </>
  );
}
