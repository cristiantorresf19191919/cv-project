'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useTemplate } from '@/context/TemplateContext';
import TemplateSwitcher from '@/components/shared/TemplateSwitcher';
import ScrollProgress from '@/components/shared/ScrollProgress';
import KeyboardNav from '@/components/shared/KeyboardNav';
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
import SereneBento from '@/components/templates/SereneBento';
import Horizon from '@/components/templates/Horizon';
import AuroraBorealis from '@/components/templates/AuroraBorealis';
import PaperCraft from '@/components/templates/PaperCraft';
import Retrowave from '@/components/templates/Retrowave';
import Blueprint from '@/components/templates/Blueprint';
import Brutalist from '@/components/templates/Brutalist';
import CosmicDust from '@/components/templates/CosmicDust';
import CommandPalette from '@/components/shared/CommandPalette';
import FloatingActions from '@/components/shared/FloatingActions';
import LiveAvailability from '@/components/shared/LiveAvailability';
import VisitorPulse from '@/components/shared/VisitorPulse';
import AnalyticsBadge from '@/components/shared/AnalyticsBadge';
import EasterEgg from '@/components/shared/EasterEgg';
// New feature components
import Toast from '@/components/shared/Toast';
import TLDRSummary from '@/components/shared/TLDRSummary';
import CalendarCTA from '@/components/shared/CalendarCTA';
import SkillsMatrix from '@/components/shared/SkillsMatrix';
import SectionIndicator from '@/components/shared/SectionIndicator';
import KeyboardShortcutsOverlay from '@/components/shared/KeyboardShortcutsOverlay';
import IntroAnimation from '@/components/shared/IntroAnimation';
import TransitionLoader from '@/components/shared/TransitionLoader';
import MobileBottomSheet from '@/components/shared/MobileBottomSheet';
import FocusMode from '@/components/shared/FocusMode';
import QRShareCard from '@/components/shared/QRShareCard';
import TemplateCompare from '@/components/shared/TemplateCompare';
import AchievementBadges from '@/components/shared/AchievementBadges';
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
  serene: SereneBento,
  horizon: Horizon,
  aurora: AuroraBorealis,
  paper: PaperCraft,
  retro: Retrowave,
  blueprint: Blueprint,
  brutal: Brutalist,
  cosmic: CosmicDust,
};

export default function Home() {
  const { current, isTransitioning } = useTemplate();
  const ActiveTemplate = templateMap[current];

  return (
    <>
      <IntroAnimation />
      <ScrollProgress />
      <TemplateSwitcher />
      <KeyboardNav />
      <CommandPalette />
      <FloatingActions />
      <LiveAvailability />
      <VisitorPulse />
      <AnalyticsBadge />
      <EasterEgg />
      <SectionIndicator />
      <KeyboardShortcutsOverlay />
      <TransitionLoader />
      <MobileBottomSheet />
      <FocusMode />
      <QRShareCard />
      <TemplateCompare />
      <AchievementBadges />
      <Toast />
      <div style={{ paddingTop: '58px', minHeight: '100vh', overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          {!isTransitioning && (
            <motion.div
              key={current}
              data-pdf-target
              initial={{ opacity: 0, x: '40%', scale: 0.98, filter: 'blur(4px)' }}
              animate={{ opacity: 1, x: '0%', scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: '-25%', scale: 0.98, filter: 'blur(3px)' }}
              transition={{
                duration: 0.35,
                ease: [0.16, 1, 0.3, 1] as const,
              }}
            >
              <TLDRSummary />
              <ActiveTemplate />
              <SkillsMatrix />
              <CalendarCTA />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
