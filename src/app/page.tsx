'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useTemplate } from '@/context/TemplateContext';
import TemplateSwitcher from '@/components/shared/TemplateSwitcher';
import NoirElegance from '@/components/templates/NoirElegance';
import ArcticMinimal from '@/components/templates/ArcticMinimal';
import TerminalHacker from '@/components/templates/TerminalHacker';
import EditorialLuxe from '@/components/templates/EditorialLuxe';
import NeonCyber from '@/components/templates/NeonCyber';
import Glassmorphism from '@/components/templates/Glassmorphism';
import ExecutivePro from '@/components/templates/ExecutivePro';
import MonochromeSplit from '@/components/templates/MonochromeSplit';
import DarkEmber from '@/components/templates/DarkEmber';
import MidnightPortfolio from '@/components/templates/MidnightPortfolio';
import { TemplateName } from '@/types/templates';
import { ComponentType } from 'react';

const templateMap: Record<TemplateName, ComponentType> = {
  noir: NoirElegance,
  arctic: ArcticMinimal,
  term: TerminalHacker,
  edit: EditorialLuxe,
  neon: NeonCyber,
  glass: Glassmorphism,
  exec: ExecutivePro,
  mono: MonochromeSplit,
  ember: DarkEmber,
  midnight: MidnightPortfolio,
};

export default function Home() {
  const { current, isTransitioning } = useTemplate();
  const ActiveTemplate = templateMap[current];

  return (
    <>
      <TemplateSwitcher />
      <div style={{ paddingTop: '58px', minHeight: '100vh' }}>
        <AnimatePresence mode="wait">
          {!isTransitioning && (
            <motion.div
              key={current}
              initial={{ opacity: 0, scale: 0.97, y: 20, filter: 'blur(12px)' }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.97, y: -10, filter: 'blur(8px)' }}
              transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1] as const,
              }}
            >
              <ActiveTemplate />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
