'use client';

import Image from 'next/image';
import { useContent } from '@/context/ContentContext';
import { TemplateName } from '@/types/templates';

interface ProfilePhotoProps {
  template: TemplateName;
  className?: string;
}

export default function ProfilePhoto({ template, className }: ProfilePhotoProps) {
  const { photoUrl } = useContent();

  return (
    <div className={className}>
      <Image
        src={photoUrl}
        alt="Camilo"
        fill
        sizes="(max-width: 968px) 280px, 380px"
        className="profile-photo"
        priority={template === 'noir'}
      />
    </div>
  );
}
