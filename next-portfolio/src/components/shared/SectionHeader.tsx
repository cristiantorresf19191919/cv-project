'use client';

import AnimatedSection from './AnimatedSection';

interface SectionHeaderProps {
  tag: string;
  title: string;
  tagClass: string;
  titleClass: string;
  wrapperClass: string;
}

export default function SectionHeader({
  tag,
  title,
  tagClass,
  titleClass,
  wrapperClass,
}: SectionHeaderProps) {
  return (
    <AnimatedSection>
      <div className={wrapperClass}>
        <div className={tagClass}>{tag}</div>
        <div className={titleClass}>{title}</div>
      </div>
    </AnimatedSection>
  );
}
