import { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useInView,
  useScroll,
  useTransform,
} from 'framer-motion';
import {
  Link,
  NavLink,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';

import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  CalendarDays,
  ChevronDown,
  Clapperboard,
  Coins,
  Globe2,
  Instagram,
  Mail,
  Menu,
  MessageCircleMore,
  Pause,
  Play,
  Rocket,
  Send,
  ShieldCheck,
  Sparkles,
  Store,
  TrendingUp,
  X,
} from 'lucide-react';
import clipxLogo from '../clipx-logo.png';
import foreverMediaLogo from '../forever-media-logo-full.png';
import foreverRelayLogo from '../fr-logo.png';
import instagramIcon from './assets/platforms/instagram.png';
import youtubeShortsIcon from './assets/platforms/youtube.png';
import xIcon from './assets/platforms/x-twitter.png';
import tiktokIcon from './assets/platforms/tiktok.ico';
import discordIcon from './assets/platforms/discord-white-icon.png';

const platformIcons = {
  TikTok: tiktokIcon,
  Instagram: instagramIcon,
  'YouTube Shorts': youtubeShortsIcon,
  X: xIcon,
  Discord: discordIcon,
};

const CALENDLY_URL = import.meta.env.VITE_CALENDLY_URL ?? '';
const CALENDLY_SCRIPT_SOURCES = [
  'https://calendly.com/assets/external/widget.js',
  'https://assets.calendly.com/assets/external/widget.js',
];
const CALENDLY_STYLE_SOURCES = [
  'https://calendly.com/assets/external/widget.css',
  'https://assets.calendly.com/assets/external/widget.css',
];

let calendlyScriptPromise;
let calendlyStylePromise;

function loadScriptWithFallback(id, sources) {
  if (typeof document === 'undefined') {
    return Promise.reject(new Error('Document is not available.'));
  }

  if (document.getElementById(id)) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const tryLoad = (index) => {
      if (index >= sources.length) {
        reject(new Error('Unable to load script.'));
        return;
      }

      const script = document.createElement('script');
      script.id = id;
      script.async = true;
      script.src = sources[index];
      script.onload = () => resolve();
      script.onerror = () => {
        script.remove();
        tryLoad(index + 1);
      };
      document.body.appendChild(script);
    };

    tryLoad(0);
  });
}

function loadStylesheetWithFallback(id, sources) {
  if (typeof document === 'undefined') {
    return Promise.reject(new Error('Document is not available.'));
  }

  if (document.getElementById(id)) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const tryLoad = (index) => {
      if (index >= sources.length) {
        reject(new Error('Unable to load stylesheet.'));
        return;
      }

      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = sources[index];
      link.onload = () => resolve();
      link.onerror = () => {
        link.remove();
        tryLoad(index + 1);
      };
      document.head.appendChild(link);
    };

    tryLoad(0);
  });
}

function ensureCalendlyAssets() {
  if (!calendlyStylePromise) {
    calendlyStylePromise = loadStylesheetWithFallback(
      'calendly-widget-style',
      CALENDLY_STYLE_SOURCES,
    ).catch((error) => {
      calendlyStylePromise = undefined;
      throw error;
    });
  }

  if (!calendlyScriptPromise) {
    calendlyScriptPromise = loadScriptWithFallback(
      'calendly-widget-script',
      CALENDLY_SCRIPT_SOURCES,
    ).catch((error) => {
      calendlyScriptPromise = undefined;
      throw error;
    });
  }

  return Promise.all([calendlyStylePromise, calendlyScriptPromise]);
}

async function openCalendlyPopup() {
  if (!CALENDLY_URL) {
    return { ok: false, reason: 'missing-url' };
  }

  await ensureCalendlyAssets();

  if (window.Calendly?.initPopupWidget) {
    window.Calendly.initPopupWidget({ url: CALENDLY_URL });
    return { ok: true };
  }

  window.open(CALENDLY_URL, '_blank', 'noopener,noreferrer');
  return { ok: true };
}

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const letterAnim = {
  hidden: { opacity: 0, y: 60, rotateX: -30 },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'ClipX', to: '/clipx' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Contact Us', to: '/contact' },
];

const homeStats = [
  { value: 100, prefix: '$', suffix: 'K+', label: 'Paid Out to Clippers' },
  { value: 11, suffix: 'K+', label: 'Clipper Network' },
  { value: 1.1, suffix: 'B+', label: 'Views Generated' },
  { value: 150, suffix: '+', label: 'Brand Collaborations' },
  { value: 1, suffix: 'M+', label: 'Clips Created' },
];

const workSteps = [
  {
    number: '01',
    icon: Rocket,
    title: 'Brands & Creators Launch Campaigns',
    description:
      'Set goals, choose budget, upload content, and activate distribution instantly across the network.',
  },
  {
    number: '02',
    icon: Clapperboard,
    title: 'Clippers Create & Distribute',
    description:
      'Clippers select active campaigns, craft short-form edits, and publish across every major short-form channel.',
  },
  {
    number: '03',
    icon: BarChart3,
    title: 'ClipX Tracks Every Result',
    description:
      'Every post, view, and engagement event is monitored in real time for clear campaign transparency.',
  },
  {
    number: '04',
    icon: BadgeCheck,
    title: 'Verified Results. Instant Rewards.',
    description:
      'Brands pay against verified performance while clippers receive rewards tied to real engagement.',
  },
];

const brandLogos = [
  'Polkadot',
  'Spartans',
  'C Major',
  'BlockDAG',
  'Partner 5',
  'Partner 6',
];

const videos = [
  {
    title: 'BlockDAG x Forever Media',
    stats: '12.4M Views / 3,200 Clips / $18K Paid Out',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    poster: 'https://picsum.photos/seed/blockdag/900/540',
    platforms: ['TikTok', 'Instagram', 'YouTube Shorts', 'X'],
  },
  {
    title: 'Spartans Campaign',
    stats: '8.7M Views / 2,100 Clips / $11K Paid Out',
    videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    poster: 'https://picsum.photos/seed/spartans/900/540',
    platforms: ['TikTok', 'Instagram', 'X'],
  },
  {
    title: 'C Major Collab',
    stats: '15.1M Views / 4,400 Clips / $21K Paid Out',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    poster: 'https://picsum.photos/seed/cmajor/900/540',
    platforms: ['TikTok', 'YouTube Shorts', 'Instagram'],
  },
];

const testimonials = [
  {
    name: 'iamRa',
    role: 'Content Creator',
    quote:
      'Forever Media helped me reach 3M+ new viewers through their clipping network. The results were incredible!',
  },
  {
    name: 'Sarah Chen',
    role: 'Brand Manager',
    quote:
      'Their clipping campaigns generated more engagement than our paid ads, at a fraction of the cost.',
  },
  {
    name: 'Pro Clipping',
    role: 'Clipper',
    quote:
      'As a clipper, I have earned consistent income while building my own audience. The community is amazing!',
  },
];

const clipxFeatures = [
  {
    icon: BarChart3,
    title: 'Real-time Analytics',
    description:
      'Monitor views, likes, and engagement across all connected platforms the moment clips go live.',
  },
  {
    icon: Globe2,
    title: 'Multi-Platform Support',
    description:
      'Run TikTok, Instagram, YouTube Shorts, and X tracking through one fast, unified command layer.',
  },
  {
    icon: Coins,
    title: 'Earnings Calculator',
    description:
      'Automated payout estimates keep clippers and campaign operators aligned on verified performance.',
  },
];

const clipxSteps = [
  {
    icon: MessageCircleMore,
    title: 'Join Our Discord',
    description:
      'Verify your account, connect socials, and use /register to get your profile campaign-ready.',
  },
  {
    icon: Sparkles,
    title: 'Use the /help Command',
    description:
      'Discover the full ClipX toolset, command shortcuts, and workflow patterns available in-server.',
  },
  {
    icon: TrendingUp,
    title: 'Submit & Track',
    description:
      'Post your clips, monitor campaign performance, and watch metrics update in real time.',
  },
];

const clientFaqs = [
  {
    question: 'How does ClipX grow my brand?',
    answer:
      'We distribute your content across Instagram Reels, TikTok, YouTube Shorts, and X, boosting visibility and reaching new audiences at scale.',
  },
  {
    question: 'How many clips will I get?',
    answer:
      'There is no fixed ceiling. Our growing global network of clippers continuously creates and posts content during active campaigns.',
  },
  {
    question: 'Do I pay clippers before seeing results?',
    answer:
      'Yes. You define the payout when launching the campaign, and clippers create and post in response to those performance incentives.',
  },
  {
    question: 'How fast will I see results?',
    answer:
      'Campaigns typically start seeing clip activity within the first few days after launch, with momentum compounding as the network picks it up.',
  },
];

const clipperFaqs = [
  {
    question: 'What is Forever Media?',
    answer:
      'Forever Media is the #1 community for clippers who want to get paid for creating and distributing short-form content.',
  },
  {
    question: 'How do I start clipping?',
    answer:
      'Join our Discord to access active campaigns, onboarding channels, and the full clipping workflow immediately.',
  },
  {
    question: 'How do I get paid?',
    answer:
      'We pay through PayPal or crypto, giving clippers fast and flexible payout options based on verified performance.',
  },
  {
    question: 'What if I need help?',
    answer:
      'Open a ticket inside the Discord server and a team member will help you quickly.',
  },
];

const privacySections = [
  {
    title: 'Overview',
    body:
      'At Forever Media, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information across our website, servers and ClipX.',
  },
  {
    title: 'What We Collect',
    body:
      'We collect the information you provide directly to us when you interact with our services, including: Your name and email address (if you contact us or use our services); Social media account links and details when using ClipX or registering on our website; Data submitted through ClipX (e.g., clip links, performance stats). We do not collect or track your IP address or any other location-based data.',
  },
  {
    title: 'How We Use Your Information',
    body:
      'We use your information to: Provide and improve our services; Respond to your inquiries or support requests; Monitor and track the performance of clips submitted via ClipX.',
  },
  {
    title: 'Data Sharing',
    body:
      'We do not sell your personal information. We may share your data with: Third-party service providers to assist with the operation of our services (e.g., hosting or bot management); Legal authorities, if required by law.',
  },
  {
    title: 'Cookies',
    body:
      'Our website may use cookies to help us understand site usage and improve functionality. We do not use cookies to track personal data.',
  },
  {
    title: 'Your Rights',
    body:
      'You have the right to: Request access to your personal information; Update or delete your information; Contact us for any concerns regarding data usage.',
  },
  {
    title: 'Contact Us',
    body:
      'To manage your data or get more details, email us at contact@forevermedia.io.',
  },
];

const termsSections = [
  {
    title: 'Overview',
    body:
      'Welcome to Forever Media. By using our website, servers, and ClipX, you agree to the following Terms of Service.',
  },
  {
    title: 'Use of Our Services',
    body:
      'By using our website, servers or ClipX, you agree to: Use services for lawful purposes only; Not engage in activities that disrupt or abuse our services; Follow any guidelines or instructions provided for using ClipX and our platform.',
  },
  {
    title: 'Content',
    body:
      'All content on our website, main server and ClipX is owned by Forever Media or our partners. You may not: Copy, modify, or distribute content without permission.',
  },
  {
    title: 'User Accounts & Data',
    body:
      'When you use our services: You are responsible for maintaining the security and confidentiality of your account; You agree to provide accurate and complete information when registering or submitting clips.',
  },
  {
    title: 'Refund Policy',
    body:
      'By launching a campaign through Forever Media, you acknowledge that refunds are not offered once the campaign has started.',
  },
  {
    title: 'Disclaimers',
    body:
      'We provide our services "as is." We do not guarantee: That the website or ClipX will always be available or free from errors; Specific results or outcomes from using our services or submitting clips.',
  },
  {
    title: 'Updates and Changes',
    body:
      'We reserve the right to: Modify terms at any time; Update privacy policies. Continued use of our services means you accept the updated terms.',
  },
  {
    title: 'Liability',
    body:
      'Forever Media is not liable for any damages or losses incurred through the use of our website or services.',
  },
  {
    title: 'Contact Us',
    body:
      'For questions or issues regarding these Terms of Service, please contact us at contact@forevermedia.io.',
  },
];

const clipxDocsSections = [
  {
    title: 'Getting Started',
    eyebrow: 'User Commands',
    icon: Rocket,
    items: [
      {
        command: '/register',
        description:
          "Register your first social account with ClipX and begin your journey as a paid clipper. You'll be asked to verify your ownership using a unique code.",
      },
      {
        command: '/addaccount',
        description:
          'Link an additional social media account to your profile. Verified accounts allow you to expand your reach and earn from multiple platforms.',
      },
      {
        command: '/removeaccount',
        description:
          'Remove a previously verified social account from your profile. You must have at least one verified account linked at all times.',
      },
      {
        command: '/forceunlink',
        description:
          'Remove a previously verified social account from any other discord user.',
      },
    ],
  },
  {
    title: 'Submit & Earn',
    eyebrow: 'Distribution',
    icon: Clapperboard,
    items: [
      {
        command: '/submit',
        description:
          'Submit a short-form video from your linked accounts to earn based on views. ClipX will automatically track performance and calculate payouts.',
      },
      {
        command: '/bulksubmit',
        description:
          'Submit upto 70 videos at once without needing to use /submit for each for each clip.',
      },
      {
        command: '/bounty',
        description:
          'Submit a short-form video from your linked accounts to qualify for the bounty payout.',
      },
      {
        command: '/refer',
        description:
          'Generate your personal referral code and invite others to ClipX. Earn bonus payouts when your referred users start submitting videos.',
      },
    ],
  },
  {
    title: 'Payments & Support',
    eyebrow: 'Rewards',
    icon: Coins,
    items: [
      {
        command: '/payment',
        description:
          'Manage your payout methods including PayPal, USDT, ETH, and BTC. You can add, view, or remove payment details securely through this interface.',
      },
      {
        command: '/flex',
        description: 'Generate an image to flex your total earnings with ClipX.',
      },
      {
        command: '/feedback',
        description:
          'Send feedback, bug reports, or feature requests directly to the ClipX team. Your input helps shape future improvements and updates.',
      },
    ],
  },
  {
    title: 'Tracking & Overview',
    eyebrow: 'Analytics',
    icon: BarChart3,
    items: [
      {
        command: '/campaigninfo',
        description:
          "View the campaign's requirements and payout rates for the current campaign.",
      },
      {
        command: '/stats',
        description:
          'View your personal submission statistics including views, estimated earnings, and referral bonuses. Updated in real-time based on platform data.',
      },
      {
        command: '/leaderboard',
        description:
          'See the top-performing clippers in your current campaign. Compete with others and track your rank as you grow your impact and earnings.',
      },
      {
        command: '/anonymousmode',
        description:
          'Enable/Disable anonymous mode, which keeps your username hidden on the leaderboard.',
      },
    ],
  },
];

const clipxAdminDocsSections = [
  {
    title: 'Campaign Setup',
    eyebrow: 'Admin Commands',
    icon: Rocket,
    items: [
      {
        command: '/setup',
        description:
          'Initialize a new campaign on your server by linking required channels and assigning a default role. This is the first step to enable ClipX functionality.',
      },
      {
        command: '/serverdetails',
        description:
          'View current configuration for your campaign, including payout rates, assigned channels, roles, and video rules. Useful for auditing or making updates.',
      },
      {
        command: '/budget',
        description:
          'Set or update the total campaign budget to track payouts and control clip spending. Ensures payouts remain within your financial limits.',
      },
    ],
  },
  {
    title: 'Payouts & Tracking',
    eyebrow: 'Controls',
    icon: Coins,
    items: [
      {
        command: '/setppv',
        description:
          'Define payout-per-view rates for each platform (e.g., TikTok, YouTube). Use this to control how much users earn per X views.',
      },
      {
        command: '/setupbudgetvc',
        description:
          'Create a voice channel that displays the remaining campaign budget in real-time. Automatically updates hourly to reflect current balance.',
      },
      {
        command: '/setviewvc',
        description:
          'Create a voice channel that displays the total views accumulated across all of the clips in the campaign.',
      },
    ],
  },
  {
    title: 'Manage Submission Cycles',
    eyebrow: 'Workflow',
    icon: Sparkles,
    items: [
      {
        command: '/opencycle',
        description:
          'Open the submission window for users to submit clips. Use this when starting a new payout round or campaign period.',
      },
      {
        command: '/closecycle',
        description:
          'Disable clip submissions to pause payouts or end a campaign cycle. Prevents users from submitting during evaluation periods.',
      },
    ],
  },
  {
    title: 'Video Rules & Restrictions',
    eyebrow: 'Guardrails',
    icon: ShieldCheck,
    items: [
      {
        command: '/hashtag',
        description:
          "Add or Remove hashtags required in the clip's caption for a successfull submission.",
      },
      {
        command: '/setlimit',
        description:
          'Set the maximum number of videos a user can submit in a campaign per day.',
      },
      {
        command: '/setminimumviews',
        description:
          'Set the minimum views required a video must have before submitting in the campaign.',
      },
      {
        command: '/setoldest',
        description:
          'Set a cutoff date for the oldest video allowed in submissions. This ensures only recent and relevant content is eligible for payout.',
      },
      {
        command: '/setshortest',
        description:
          'Define the minimum duration (in seconds) a video must be to qualify. Helps avoid payout abuse from ultra-short or clipped content.',
      },
      {
        command: '/setlongest',
        description:
          'Set a maximum allowed video duration in seconds. Clips exceeding this will be automatically rejected, keeping content within format standards.',
      },
    ],
  },
  {
    title: 'Bounty',
    eyebrow: 'Campaign Boosters',
    icon: BadgeCheck,
    items: [
      {
        command: '/bountyset',
        description: 'Set a bounty prize and submission channel for a campaign.',
      },
      {
        command: '/bountywinner',
        description: 'Choose the bounty winner in a campaign.',
      },
    ],
  },
  {
    title: 'Moderation',
    eyebrow: 'Admin Tools',
    icon: Store,
    items: [
      {
        command: '/purge',
        description:
          'Bulk delete a specified number of messages from a channel. Useful for clearing spam or resetting channels during campaign transitions.',
      },
    ],
  },
];

function App() {
  const location = useLocation();
  const [campaignModalOpen, setCampaignModalOpen] = useState(false);
  const [calendlyMessage, setCalendlyMessage] = useState('');

  useEffect(() => {
    setCampaignModalOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!calendlyMessage) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setCalendlyMessage('');
    }, 4200);

    return () => window.clearTimeout(timeoutId);
  }, [calendlyMessage]);

  const handleOpenCampaignModal = () => setCampaignModalOpen(true);
  const handleCloseCampaignModal = () => setCampaignModalOpen(false);
  const handleBookMeeting = async () => {
    let result;

    try {
      result = await openCalendlyPopup();
    } catch (error) {
      setCalendlyMessage('Calendly could not be loaded right now. Please try again in a moment.');
      return;
    }

    if (!result.ok) {
      setCalendlyMessage(
        'Add your Calendly event URL to VITE_CALENDLY_URL to enable meeting booking.',
      );
      return;
    }

    setCampaignModalOpen(false);
  };

  return (
    <SiteChrome>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageTransition>
                <HomePage openCampaignModal={handleOpenCampaignModal} />
              </PageTransition>
            }
          />
          <Route
            path="/clipx"
            element={
              <PageTransition>
                <ClipXPage />
              </PageTransition>
            }
          />
          <Route
            path="/docs"
            element={
              <PageTransition>
                <DocsPage
                  badge={
                    <>
                      <img
                        alt="ClipX"
                        className="h-6 w-6 rounded-full object-cover"
                        src={clipxLogo}
                      />
                      <span>ClipX Documentation</span>
                    </>
                  }
                  ctaLabel="Are you an admin?"
                  ctaTo="/admindocs"
                  sections={clipxDocsSections}
                  subtitle="Complete guide to using our clipping bot."
                  title="ClipX Documentation"
                  variant="violet"
                />
              </PageTransition>
            }
          />
          <Route
            path="/admindocs"
            element={
              <PageTransition>
                <DocsPage
                  badge={
                    <>
                      <img
                        alt="ClipX"
                        className="h-6 w-6 rounded-full object-cover"
                        src={clipxLogo}
                      />
                      <span>ClipX Admin Documentation</span>
                    </>
                  }
                  ctaLabel="Need user docs?"
                  ctaTo="/docs"
                  sections={clipxAdminDocsSections}
                  subtitle="Complete admin guide to using our clipping bot."
                  title="ClipX Admin Documentation"
                  variant="violet"
                />
              </PageTransition>
            }
          />
          <Route
            path="/faq"
            element={
              <PageTransition>
                <FAQPage />
              </PageTransition>
            }
          />
          <Route
            path="/contact"
            element={
              <PageTransition>
                <ContactPage openCalendly={handleBookMeeting} />
              </PageTransition>
            }
          />
          <Route
            path="/privacy"
            element={
              <PageTransition>
                <LegalPage
                  title="Privacy Policy"
                  subtitle="Effective April 22, 2025"
                  sections={privacySections}
                />
              </PageTransition>
            }
          />
          <Route
            path="/terms"
            element={
              <PageTransition>
                <LegalPage
                  title="Terms of Service"
                  subtitle="Effective April 22, 2025"
                  sections={termsSections}
                />
              </PageTransition>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
      <CampaignModal
        onBookMeeting={handleBookMeeting}
        onClose={handleCloseCampaignModal}
        open={campaignModalOpen}
      />
      <AnimatePresence>
        {calendlyMessage ? (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-6 right-6 z-[70] max-w-sm rounded-2xl border border-gold/20 bg-canvas/95 px-5 py-4 text-sm text-ivory shadow-[0_18px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl"
            exit={{ opacity: 0, y: 12 }}
            initial={{ opacity: 0, y: 12 }}
          >
            {calendlyMessage}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </SiteChrome>
  );
}

function SiteChrome({ children }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-canvas text-ivory">
      <NoiseOverlay />
      <CustomCursor />
      <Navbar />
      <main className="relative z-10 pt-24">{children}</main>
      <Footer />
    </div>
  );
}

function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function LogoWordmark({ className = '', footer = false }) {
  return (
    <div className={className}>
      <img
        alt="Forever Media"
        className={footer ? 'h-12 w-auto sm:h-14' : 'h-10 w-auto sm:h-11'}
        src={foreverMediaLogo}
      />
      <p className="mt-2 text-[10px] uppercase tracking-[0.45em] text-mist">EST. 2024</p>
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);

    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-4 py-4 sm:px-6 lg:px-8">
      <div
        className={`mx-auto max-w-7xl rounded-2xl border transition-all duration-300 ${
          scrolled
            ? 'border-gold/30 bg-canvas/90 shadow-[0_24px_80px_rgba(0,0,0,0.45)]'
            : 'border-white/10 bg-canvas/70'
        } backdrop-blur-xl`}
      >
        <div className="flex items-center justify-between px-5 py-4 sm:px-6">
          <Link className="group flex items-end gap-3" to="/">
            <LogoWordmark />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                className={({ isActive }) =>
                  `nav-link text-sm font-semibold uppercase tracking-[0.24em] ${
                    isActive ? 'text-gold' : 'text-ivory/80'
                  }`
                }
                to={link.to}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:block">
            <a
              className="btn-secondary"
              href="https://www.discord.gg/forevermedia"
              rel="noreferrer"
              target="_blank"
            >
              Join Discord
            </a>
          </div>

          <button
            aria-label="Toggle menu"
            className="inline-flex rounded-full border border-white/10 p-3 text-ivory transition hover:border-gold/40 hover:text-gold lg:hidden"
            onClick={() => setMobileOpen((current) => !current)}
            type="button"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              animate={{ height: 'auto', opacity: 1 }}
              className="overflow-hidden border-t border-white/10 lg:hidden"
              exit={{ height: 0, opacity: 0 }}
              initial={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="space-y-5 px-5 py-6">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    className={({ isActive }) =>
                      `block text-base font-semibold uppercase tracking-[0.18em] ${
                        isActive ? 'text-gold' : 'text-ivory/80'
                      }`
                    }
                    to={link.to}
                  >
                    {link.label}
                  </NavLink>
                ))}
                <a
                  className="btn-secondary w-full justify-center"
                  href="https://www.discord.gg/forevermedia"
                  rel="noreferrer"
                  target="_blank"
                >
                  Join Discord
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="relative z-10 mt-16 border-t border-gold/20 bg-black/30">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-14 sm:px-8 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr_1fr_1fr]">
          <div className="max-w-sm space-y-4">
            <LogoWordmark footer />
            <p className="max-w-xs text-sm leading-7 text-mist">
              The #1 performance-based short-form distribution network.
            </p>
          </div>

          <FooterColumn
            title="Navigation"
            items={[
              { label: 'Home', to: '/' },
              { label: 'ClipX', to: '/clipx' },
              { label: 'FAQ', to: '/faq' },
              { label: 'Contact', to: '/contact' },
            ]}
          />
          <FooterColumn
            title="Legal"
            items={[
              { label: 'Privacy Policy', to: '/privacy' },
              { label: 'Terms of Service', to: '/terms' },
            ]}
          />
          <div className="space-y-5">
            <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-gold/80">
              Products
            </h4>
            <div className="space-y-3 text-sm">
              <ProductStatusCard
                label="ClipX"
                logo={clipxLogo}
                status="v2.2.0 - Live"
                to="/docs"
              />
              <ProductStatusCard
                href="https://www.discord.gg/forevermedia"
                label="Forever Relay"
                logo={foreverRelayLogo}
                status="v1.2 - Live"
              />
              <div className="flex flex-wrap gap-3 pt-1">
                <Link
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs uppercase tracking-[0.18em] text-mist transition hover:border-gold/30 hover:text-ivory"
                  to="/docs"
                >
                  ClipX Docs
                  <ArrowRight size={14} />
                </Link>
                <Link
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs uppercase tracking-[0.18em] text-mist transition hover:border-gold/30 hover:text-ivory"
                  to="/admindocs"
                >
                  Admin Docs
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <SocialLink
                href="https://www.discord.gg/forevermedia"
                icon={<img alt="Discord" className="h-4 w-4 object-contain opacity-90" src={discordIcon} />}
                label="Discord"
              />
              <SocialLink
                href="https://www.instagram.com/forevermedia.io"
                icon={<Instagram size={16} />}
                label="Instagram"
              />
              <SocialLink
                href="mailto:contact@forevermedia.io"
                icon={<Mail size={16} />}
                label="Email"
              />
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-mist md:flex-row md:items-center md:justify-between">
          <p>&copy; 2025 Forever Media Global Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link className="transition hover:text-gold" to="/privacy">
              Privacy Policy
            </Link>
            <span className="h-1 w-1 rounded-full bg-gold/70" />
            <Link className="transition hover:text-gold" to="/terms">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function CampaignModal({ open, onClose, onBookMeeting }) {
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-6 py-10 backdrop-blur-md"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="relative w-full max-w-xl overflow-hidden rounded-[32px] border border-white/10 bg-[#070c1f]/95 p-8 shadow-[0_30px_120px_rgba(0,0,0,0.55)]"
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            onClick={(event) => event.stopPropagation()}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(4,6,232,0.2),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(143,171,255,0.16),transparent_36%)]" />
            <div className="relative">
              <div className="flex items-start justify-between gap-6">
                <div className="max-w-lg">
                  <span className="eyebrow">Launch a Campaign</span>
                  <h2 className="mt-4 font-heading text-4xl font-bold tracking-[-0.05em] text-ivory">
                    Choose the fastest way to connect with us.
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-mist">
                    Book a meeting to talk through your launch, or head to the
                    contact page if you would rather send the team an email.
                  </p>
                </div>
                <button
                  aria-label="Close launch campaign modal"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-ivory transition hover:border-gold/40 hover:text-gold"
                  onClick={onClose}
                  type="button"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                <button
                  className="btn-primary w-full justify-center"
                  onClick={onBookMeeting}
                  type="button"
                >
                  Book a Meeting
                  <CalendarDays size={18} />
                </button>
                <Link
                  className="btn-secondary w-full justify-center"
                  onClick={onClose}
                  to="/contact"
                >
                  Send Us an Email
                  <Mail size={18} />
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function FooterColumn({ title, items }) {
  return (
    <div className="space-y-5">
      <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-gold/80">
        {title}
      </h4>
      <div className="space-y-3">
        {items.map((item) => (
          <Link
            key={item.to}
            className="block text-sm text-mist transition hover:text-gold"
            to={item.to}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function SocialLink({ href, icon, label }) {
  return (
    <a
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-ivory/80 transition hover:border-gold/30 hover:text-gold"
      href={href}
      rel="noreferrer"
      target="_blank"
    >
      {icon}
      {label}
    </a>
  );
}

function ProductStatusCard({ label, logo, status, to, href }) {
  const content = (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 transition hover:border-gold/30 hover:bg-white/[0.06]">
      <div className="flex items-center gap-3">
        <img alt={label} className="h-10 w-10 rounded-full object-cover" src={logo} />
        <span className="font-semibold text-ivory">{label}</span>
      </div>
      <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-mist">
        <span className="h-2 w-2 rounded-full bg-emerald-400" />
        {status}
      </span>
    </div>
  );

  if (to) {
    return <Link className="block" to={to}>{content}</Link>;
  }

  if (href) {
    return (
      <a className="block" href={href} rel="noreferrer" target="_blank">
        {content}
      </a>
    );
  }

  return content;
}

function NoiseOverlay() {
  return <div className="noise-overlay pointer-events-none fixed inset-0 z-30" />;
}

function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [interactive, setInteractive] = useState(false);
  const [position, setPosition] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const media = window.matchMedia('(pointer: fine)');
    const sync = () => {
      const active = media.matches;
      setEnabled(active);
      document.body.dataset.cursorEnabled = active ? 'true' : 'false';
    };

    const onMove = (event) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };

    const onOver = (event) => {
      setInteractive(
        Boolean(
          event.target.closest(
            'a, button, input, textarea, select, [role="button"], [data-cursor]',
          ),
        ),
      );
    };

    sync();
    media.addEventListener('change', sync);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);

    return () => {
      media.removeEventListener('change', sync);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      delete document.body.dataset.cursorEnabled;
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-50 hidden lg:block">
      <motion.div
        animate={{
          x: position.x - 6,
          y: position.y - 6,
          scale: interactive ? 1.7 : 1,
        }}
        className="absolute h-3 w-3 rounded-full bg-gold shadow-[0_0_24px_rgba(4,6,232,0.8)]"
        transition={{ duration: 0.14, ease: 'linear' }}
      />
      <motion.div
        animate={{
          x: position.x - 18,
          y: position.y - 18,
          scale: interactive ? 1.35 : 1,
          opacity: interactive ? 0.28 : 0.14,
        }}
        className="absolute h-9 w-9 rounded-full border border-gold/50"
        transition={{ duration: 0.18, ease: 'linear' }}
      />
    </div>
  );
}

function AnimatedSection({ children, className = '' }) {
  return (
    <motion.section
      className={className}
      initial={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, margin: '-80px' }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {children}
    </motion.section>
  );
}

function SectionIntro({ eyebrow, title, description, align = 'center' }) {
  const alignment =
    align === 'center'
      ? 'mx-auto max-w-3xl text-center'
      : 'max-w-3xl text-left';

  return (
    <div className={alignment}>
      {eyebrow ? (
        <span className="eyebrow inline-flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          {eyebrow}
        </span>
      ) : null}
      <h2 className="mt-5 font-heading text-4xl font-bold tracking-[-0.04em] text-ivory sm:text-5xl">
        {title}
      </h2>
      <p className="mt-5 text-base leading-8 text-mist sm:text-lg">{description}</p>
    </div>
  );
}

function GlassCard({ children, className = '' }) {
  return <div className={`glass-card ${className}`}>{children}</div>;
}

function TiltCard({ children, className = '' }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - bounds.left) / bounds.width;
    const py = (event.clientY - bounds.top) / bounds.height;

    setTilt({
      x: (0.5 - py) * 12,
      y: (px - 0.5) * 12,
    });
  };

  return (
    <div
      className={`glass-card transition-transform duration-300 ${className}`}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      onMouseMove={handleMove}
      style={{
        transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(${
          tilt.x !== 0 || tilt.y !== 0 ? -4 : 0
        }px)`,
      }}
    >
      {children}
    </div>
  );
}

function SplitHeadline({
  lines,
  className = '',
  lineClassName = '',
  characterClassName = '',
}) {
  return (
    <motion.div animate="show" className={className} initial="hidden" variants={stagger}>
      {lines.map((line) => (
        <motion.div
          className={`overflow-hidden whitespace-nowrap ${lineClassName}`}
          key={line}
          variants={stagger}
        >
          {line.split('').map((character, index) => (
            <motion.span
              key={`${line}-${index}`}
              className={`inline-block ${characterClassName}`}
              variants={letterAnim}
            >
              {character === ' ' ? '\u00A0' : character}
            </motion.span>
          ))}
        </motion.div>
      ))}
    </motion.div>
  );
}

function ParticleField() {
  const [particles] = useState(() =>
    Array.from({ length: 38 }, (_, index) => ({
      id: index,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: 2 + Math.random() * 3,
      duration: 10 + Math.random() * 10,
      delay: Math.random() * 3,
      opacity: 0.18 + Math.random() * 0.35,
    })),
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          animate={{
            y: [0, -18, 0],
            x: [0, 10, -8, 0],
            opacity: [particle.opacity, particle.opacity * 1.6, particle.opacity],
          }}
          className="absolute rounded-full bg-ivory/70"
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

function HeroBackdrop({ variant = 'gold' }) {
  const primaryOrb =
    variant === 'violet'
      ? 'bg-[radial-gradient(circle,rgba(54,92,255,0.42),transparent_68%)]'
      : 'bg-[radial-gradient(circle,rgba(4,6,232,0.34),transparent_68%)]';
  const secondaryOrb =
    variant === 'violet'
      ? 'bg-[radial-gradient(circle,rgba(162,188,255,0.2),transparent_68%)]'
      : 'bg-[radial-gradient(circle,rgba(104,132,255,0.3),transparent_68%)]';

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className={`absolute -left-16 top-0 h-[36rem] w-[36rem] blur-3xl ${primaryOrb}`} />
      <div
        className={`absolute -bottom-24 right-[-6rem] h-[34rem] w-[34rem] blur-3xl ${secondaryOrb}`}
      />
      <ParticleField />
      <div className="hero-grid absolute inset-0 opacity-35" />
    </div>
  );
}

function PlatformChip({ label }) {
  const iconSrc = platformIcons[label];

  return (
    <span aria-label={label} className="platform-chip" title={label}>
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-gold/20 bg-white/[0.03] text-[10px] font-bold uppercase tracking-[0.18em] text-gold">
        {iconSrc ? (
          <img alt="" className="h-4 w-4 object-contain opacity-90" src={iconSrc} />
        ) : (
          (label === 'YouTube Shorts' ? 'YT' : label[0])
        )}
      </span>
      <span className="sr-only">{label}</span>
    </span>
  );
}

function PlatformIcon({ label, className = '' }) {
  const iconSrc = platformIcons[label];

  if (!iconSrc) {
    return (
      <span className={`text-[10px] font-bold uppercase tracking-[0.18em] text-mist ${className}`}>
        {label === 'YouTube Shorts' ? 'YT' : label[0]}
      </span>
    );
  }

  return <img alt="" className={className} src={iconSrc} />;
}

function StatCounter({ value, prefix = '', suffix = '', label }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) {
      return undefined;
    }

    let frame;
    let startTime;
    const duration = 1800;

    const update = (timestamp) => {
      if (!startTime) {
        startTime = timestamp;
      }

      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) ** 3;

      setCount(value * eased);

      if (progress < 1) {
        frame = window.requestAnimationFrame(update);
      }
    };

    frame = window.requestAnimationFrame(update);
    return () => window.cancelAnimationFrame(frame);
  }, [inView, value]);

  return (
    <div className="text-center" ref={ref}>
      <p className="font-heading text-4xl font-bold tracking-[-0.05em] text-gold sm:text-5xl">
        {prefix}
        {Math.round(count).toLocaleString()}
        {suffix}
      </p>
      <p className="mt-3 text-sm uppercase tracking-[0.2em] text-mist">{label}</p>
    </div>
  );
}

function MarqueeRow({ items, reverse = false }) {
  const duplicated = [...items, ...items];

  return (
    <div className="marquee-shell group">
      <div className={reverse ? 'marquee-track marquee-track-reverse' : 'marquee-track'}>
        {duplicated.map((item, index) => (
          <div className="logo-pill" key={`${item}-${index}`}>
            <span className="logo-mark" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function VideoCard({ title, stats, videoUrl, poster, platforms }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const node = videoRef.current;

    if (!node) {
      return undefined;
    }

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    node.addEventListener('play', onPlay);
    node.addEventListener('pause', onPause);

    return () => {
      node.removeEventListener('play', onPlay);
      node.removeEventListener('pause', onPause);
    };
  }, []);

  const togglePlayback = async () => {
    const node = videoRef.current;

    if (!node) {
      return;
    }

    if (node.paused) {
      try {
        await node.play();
      } catch (error) {
        setPlaying(false);
      }
    } else {
      node.pause();
    }
  };

  return (
    <TiltCard className="group overflow-hidden border-t-2 border-gold/60">
      <div className="relative overflow-hidden rounded-[18px]">
        <video
          className="h-72 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          onClick={togglePlayback}
          playsInline
          poster={poster}
          preload="metadata"
          ref={videoRef}
          src={videoUrl}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-canvas/60 via-transparent to-transparent" />
        {!playing ? (
          <button
            className="absolute inset-0 flex items-center justify-center"
            onClick={togglePlayback}
            type="button"
          >
            <span className="inline-flex h-20 w-20 items-center justify-center rounded-full border border-white/15 bg-black/35 text-gold shadow-[0_0_40px_rgba(4,6,232,0.18)] backdrop-blur-xl transition group-hover:scale-110">
              <Play className="ml-1" size={28} />
            </span>
          </button>
        ) : null}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-full border border-white/10 bg-black/30 px-4 py-2 backdrop-blur-xl">
          <span className="text-xs uppercase tracking-[0.24em] text-mist">
            Campaign Preview
          </span>
          <button
            className="inline-flex items-center gap-2 text-sm font-semibold text-ivory transition hover:text-gold"
            onClick={togglePlayback}
            type="button"
          >
            {playing ? <Pause size={16} /> : <Play size={16} />}
            {playing ? 'Pause' : 'Play'}
          </button>
        </div>
      </div>

      <div className="space-y-5 px-6 pb-6 pt-5">
        <div>
          <h3 className="font-heading text-2xl font-bold tracking-[-0.03em] text-ivory">
            {title}
          </h3>
          <p className="mt-3 text-sm uppercase tracking-[0.16em] text-mist">{stats}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {platforms.map((platform) => (
            <span
              aria-label={platform}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]"
              key={platform}
              title={platform}
            >
              <PlatformIcon className="h-4 w-4 object-contain opacity-90" label={platform} />
              <span className="sr-only">{platform}</span>
            </span>
          ))}
        </div>
      </div>
    </TiltCard>
  );
}

function SectionAngle({ flip = false }) {
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 ${
        flip ? '-top-px rotate-180' : '-bottom-px'
      }`}
    >
      <svg
        className="h-16 w-full text-canvas/95 sm:h-24"
        preserveAspectRatio="none"
        viewBox="0 0 1440 120"
      >
        <path
          d="M0,24 C220,110 470,0 720,56 C960,108 1180,18 1440,64 L1440,120 L0,120 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

function HomePage({ openCampaignModal }) {
  return (
    <div>
      <section className="relative isolate flex min-h-[calc(100vh-6rem)] items-center overflow-hidden px-6 pb-20 pt-10 sm:px-8 lg:px-10">
        <HeroBackdrop />
        <div className="mx-auto grid w-full max-w-7xl gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="max-w-4xl">
            <motion.div
              animate="show"
              initial="hidden"
              variants={fadeUp}
              className="inline-flex rounded-full border border-gold/25 bg-white/[0.05] px-5 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-gold backdrop-blur-xl"
            >
              * The #1 Clipping Network
            </motion.div>

            <SplitHeadline
              characterClassName="text-ivory"
              className="mt-8 font-display text-[clamp(4rem,10vw,8.75rem)] leading-[0.9] tracking-[0.04em]"
              lines={['Clip to create.', 'Built to scale.']}
            />

            <motion.p
              className="mt-8 max-w-2xl text-lg leading-8 text-mist sm:text-xl"
              initial={{ opacity: 0, y: 30 }}
              transition={{ delay: 0.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              Forever Media reshapes content distribution, scaling short-form
              media through a global network of clippers. More reach. Less cost.
              Real results.
            </motion.p>

            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="mt-10 flex flex-col gap-4 sm:flex-row"
              initial={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.72, duration: 0.65 }}
            >
              <a
                className="btn-primary"
                href="https://www.discord.gg/forevermedia"
                rel="noreferrer"
                target="_blank"
              >
                Get Paid to Clip
                <ArrowRight size={18} />
              </a>
              <button
                className="btn-secondary"
                onClick={openCampaignModal}
                type="button"
              >
                Launch a Campaign
              </button>
            </motion.div>

            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="mt-10 flex flex-wrap items-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.84, duration: 0.6 }}
            >
              {['TikTok', 'Instagram', 'YouTube Shorts', 'X'].map((platform) => (
                <PlatformChip key={platform} label={platform} />
              ))}
              <span className="text-sm uppercase tracking-[0.22em] text-mist">
                Distribute across 4 platforms
              </span>
            </motion.div>
          </div>

          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
            initial={{ opacity: 0, scale: 0.94 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <GlassCard className="relative overflow-hidden bg-[#0b1024] p-6 shadow-none backdrop-blur-none sm:p-8">
              <div className="relative space-y-6">
                <div className="flex items-center justify-between">
                  <span className="eyebrow">Live Campaign Surface</span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-emerald-300">
                    <span className="h-2 w-2 rounded-full bg-emerald-300" />
                    Syncing
                  </span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <GlassCard className="bg-[#0f1733] p-5 shadow-none backdrop-blur-none">
                    <p className="text-xs uppercase tracking-[0.24em] text-mist">
                      Active Reach
                    </p>
                    <p className="mt-4 font-heading text-4xl font-bold tracking-[-0.05em] text-gold">
                      94.8M
                    </p>
                    <p className="mt-2 text-sm text-mist">
                      Rolling clip views across active creator drops.
                    </p>
                  </GlassCard>
                  <GlassCard className="bg-[#0f1733] p-5 shadow-none backdrop-blur-none">
                    <p className="text-xs uppercase tracking-[0.24em] text-mist">
                      Campaign Velocity
                    </p>
                    <p className="mt-4 font-heading text-4xl font-bold tracking-[-0.05em] text-ivory">
                      3.4x
                    </p>
                    <p className="mt-2 text-sm text-mist">
                      Faster content spread than a standard paid social launch.
                    </p>
                  </GlassCard>
                </div>

              </div>
            </GlassCard>
          </motion.div>
        </div>

        <motion.div
          animate={{ opacity: 1, y: [0, 10, 0] }}
          className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 text-xs uppercase tracking-[0.3em] text-mist"
          initial={{ opacity: 0 }}
          transition={{ delay: 1.1, duration: 2, repeat: Infinity }}
        >
          <span>Scroll</span>
          <span className="flex h-11 w-7 items-start justify-center rounded-full border border-white/15 p-1.5">
            <span className="h-2 w-2 rounded-full bg-gold" />
          </span>
        </motion.div>

        <SectionAngle />
      </section>

      <AnimatedSection className="px-6 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="glass-card grid gap-8 px-6 py-8 lg:grid-cols-5 lg:gap-0 lg:px-8">
            {homeStats.map((stat, index) => (
              <div
                className={`relative lg:px-6 ${
                  index < homeStats.length - 1
                    ? 'lg:after:absolute lg:after:right-0 lg:after:top-1/2 lg:after:h-16 lg:after:w-px lg:after:-translate-y-1/2 lg:after:bg-gold/25'
                    : ''
                }`}
                key={stat.label}
              >
                <StatCounter {...stat} />
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="relative px-6 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionIntro
            description="Our streamlined process connects brands with clippers to maximize content reach and engagement."
            title="How Forever Media Works"
          />
          <div className="relative mt-16">
            <motion.div
              className="absolute left-24 right-24 top-1/2 hidden h-px origin-left bg-gradient-to-r from-transparent via-gold/40 to-transparent lg:block"
              initial={{ scaleX: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              whileInView={{ scaleX: 1 }}
            />
            <div className="grid gap-6 lg:grid-cols-4">
              {workSteps.map((step) => {
                const Icon = step.icon;

                return (
                  <TiltCard className="relative overflow-hidden px-6 pb-7 pt-8" key={step.number}>
                    <span className="pointer-events-none absolute right-5 top-2 font-display text-7xl text-gold/10">
                      {step.number}
                    </span>
                    <div className="relative space-y-5">
                      <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-gold/20 bg-gold/10 text-gold">
                        <Icon size={22} />
                      </span>
                      <div>
                        <h3 className="font-heading text-2xl font-bold tracking-[-0.03em]">
                          {step.title}
                        </h3>
                        <p className="mt-4 text-sm leading-7 text-mist">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </TiltCard>
                );
              })}
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="px-6 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionIntro
            description="We have partnered with top creators, brands, and companies to amplify their content and reach."
            title="Trusted by Leading Brands & Creators"
          />
          <div className="mt-14 space-y-6">
            <MarqueeRow items={brandLogos} />
            <MarqueeRow items={brandLogos} reverse />
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="relative overflow-hidden px-6 py-24 sm:px-8 lg:px-10">
        <SectionAngle flip />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(4,6,232,0.1),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(143,171,255,0.1),transparent_36%)]" />
        <div className="mx-auto max-w-7xl">
          <SectionIntro
            eyebrow="Showcase"
            description="Real campaigns. Real reach. See what we have built for our partners."
            title="Past Campaign Results"
          />
          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {videos.map((video) => (
              <VideoCard key={video.title} {...video} />
            ))}
          </div>
        </div>
      </AnimatedSection>

      <TestimonialsSection />

      <AnimatedSection className="relative px-6 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] p-4 shadow-glow backdrop-blur-2xl sm:p-6">
            <div className="pointer-events-none absolute inset-y-8 left-1/2 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-gold/60 to-transparent lg:block" />
            <div className="grid gap-4 lg:grid-cols-2">
              <GlassCard className="relative overflow-hidden px-8 py-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(4,6,232,0.18),transparent_34%)]" />
                <div className="relative max-w-md space-y-5">
                  <span className="eyebrow">For Brands</span>
                  <h3 className="font-heading text-4xl font-bold tracking-[-0.05em] text-ivory">
                    Scale Your Content
                  </h3>
                  <p className="text-base leading-8 text-mist">
                    Launch a campaign and tap into a global network of clippers ready
                    to distribute your content across every major platform.
                  </p>
                  <button
                    className="btn-primary"
                    onClick={openCampaignModal}
                    type="button"
                  >
                    Launch a Campaign
                    <ArrowRight size={18} />
                  </button>
                </div>
              </GlassCard>

              <GlassCard className="relative overflow-hidden px-8 py-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(143,171,255,0.16),transparent_34%)]" />
                <div className="relative max-w-md space-y-5">
                  <span className="eyebrow">For Clippers</span>
                  <h3 className="font-heading text-4xl font-bold tracking-[-0.05em] text-ivory">
                    Get Paid to Clip
                  </h3>
                  <p className="text-base leading-8 text-mist">
                    Join the #1 clipping community, pick active campaigns, post
                    content, and earn instantly based on real verified performance.
                  </p>
                  <a
                    className="btn-secondary"
                    href="https://www.discord.gg/forevermedia"
                    rel="noreferrer"
                    target="_blank"
                  >
                    Join Discord
                    <ArrowRight size={18} />
                  </a>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}

function TestimonialsSection() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const yOne = useTransform(scrollYProgress, [0, 1], [40, -30]);
  const yTwo = useTransform(scrollYProgress, [0, 1], [20, -15]);
  const yThree = useTransform(scrollYProgress, [0, 1], [50, -22]);

  return (
    <AnimatedSection className="px-6 py-24 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl" ref={sectionRef}>
        <SectionIntro
          description="Testimonials from creators, operators, and clippers moving with the network."
          title="What They're Saying"
        />
        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              className={`glass-card p-7 ${
                index === 0 ? 'rotate-[-2deg]' : index === 1 ? 'rotate-[1deg]' : 'rotate-[-1deg]'
              }`}
              key={testimonial.name}
              style={index === 0 ? { y: yOne } : index === 1 ? { y: yTwo } : { y: yThree }}
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <span className="font-display text-4xl text-gold">"</span>
                  <div className="flex items-center gap-1 text-gold">
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <span className="h-2 w-2 rounded-full bg-current" key={starIndex} />
                    ))}
                  </div>
                </div>
                <p className="text-base leading-8 text-ivory/90">{testimonial.quote}</p>
                <div className="flex items-center gap-4">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-gold/20 bg-gold/10 font-heading text-lg font-bold text-gold">
                    {testimonial.name
                      .split(' ')
                      .map((part) => part[0])
                      .join('')
                      .slice(0, 2)}
                  </span>
                  <div>
                    <p className="font-heading text-xl font-bold tracking-[-0.03em]">
                      {testimonial.name}
                    </p>
                    <p className="text-sm uppercase tracking-[0.18em] text-mist">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

function ClipXPage() {
  return (
    <div>
      <PageHero
        actions={
          <>
            <Link
              className="btn-secondary"
              to="/docs"
            >
              View Documentation
            </Link>
            <Link className="btn-secondary" to="/admindocs">
              Admin Docs
            </Link>
            <a
              className="btn-primary"
              href="https://www.discord.gg/forevermedia"
              rel="noreferrer"
              target="_blank"
            >
              Add to Discord
              <ArrowRight size={18} />
            </a>
          </>
        }
        badge={
          <>
            <img alt="ClipX" className="h-6 w-6 rounded-full object-cover" src={clipxLogo} />
            <span>v2.2.0 - Live</span>
          </>
        }
        subtitle="The ultimate clipping bot for content tracking and analytics, powered by Discord."
        title="ClipX"
        variant="violet"
      />

      <AnimatedSection className="px-6 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-2">
          <Link to="/docs">
            <GlassCard className="group p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    alt="ClipX"
                    className="h-12 w-12 rounded-full object-cover"
                    src={clipxLogo}
                  />
                  <div>
                    <p className="eyebrow">User Documentation</p>
                    <p className="mt-2 font-heading text-2xl font-bold tracking-[-0.04em] text-ivory">
                      ClipX Docs
                    </p>
                  </div>
                </div>
                <ArrowRight className="transition group-hover:translate-x-1" size={20} />
              </div>
              <p className="mt-5 max-w-lg text-sm leading-7 text-mist">
                Command-by-command guidance for registration, submissions, payouts,
                tracking, and referrals.
              </p>
            </GlassCard>
          </Link>

          <Link to="/admindocs">
            <GlassCard className="group p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    alt="ClipX Admin Docs"
                    className="h-12 w-12 rounded-full object-cover"
                    src={clipxLogo}
                  />
                  <div>
                    <p className="eyebrow">Operator Documentation</p>
                    <p className="mt-2 font-heading text-2xl font-bold tracking-[-0.04em] text-ivory">
                      Admin Docs
                    </p>
                  </div>
                </div>
                <ArrowRight className="transition group-hover:translate-x-1" size={20} />
              </div>
              <p className="mt-5 max-w-lg text-sm leading-7 text-mist">
                Campaign setup, payout rules, submission-cycle controls, bounty tools,
                and moderation workflows for admins.
              </p>
            </GlassCard>
          </Link>
        </div>
      </AnimatedSection>

      <AnimatedSection className="px-6 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionIntro
            align="left"
            eyebrow="Feature Stack"
            description="A technical layer built for campaign operators who need clarity, speed, and a live view of what the network is doing."
            title="Built to Track Short-Form Distribution at Scale"
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {clipxFeatures.map((feature) => {
              const Icon = feature.icon;

              return (
                <TiltCard className="p-7" key={feature.title}>
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-violet/20 bg-violet/10 text-violet">
                    <Icon size={22} />
                  </span>
                  <h3 className="mt-6 font-heading text-2xl font-bold tracking-[-0.03em] text-ivory">
                    {feature.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-mist">{feature.description}</p>
                </TiltCard>
              );
            })}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="px-6 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionIntro
            description="Get live inside the system with a simple onboarding flow and a Discord-native operating model."
            title="How to Get Started"
          />
          <div className="relative mx-auto mt-16 max-w-3xl">
            <div className="absolute left-[1.65rem] top-8 hidden h-[calc(100%-4rem)] w-px bg-gradient-to-b from-violet/10 via-violet/50 to-transparent sm:block" />
            <div className="space-y-8">
              {clipxSteps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <GlassCard className="relative overflow-hidden p-6 sm:p-7" key={step.title}>
                    <div className="flex items-start gap-5">
                      <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-violet/25 bg-violet/10 text-violet">
                        <Icon size={22} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs uppercase tracking-[0.24em] text-gold/80">
                          Step {index + 1}
                        </p>
                        <h3 className="mt-2 font-heading text-2xl font-bold tracking-[-0.03em] text-ivory">
                          {step.title}
                        </h3>
                        <p className="mt-4 text-sm leading-7 text-mist">{step.description}</p>
                      </div>
                      <span className="pointer-events-none font-display text-6xl text-white/5">
                        0{index + 1}
                      </span>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="px-6 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionIntro
            align="left"
            eyebrow="Live Surface"
            description="A Discord-native analytics surface that makes the platform feel tangible before anyone even clicks into the bot."
            title="ClipX Dashboard Mockup"
          />
          <div className="mt-14">
            <ClipXDashboardMockup />
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}

function PageHero({ title, subtitle, badge, actions, variant = 'gold' }) {
  const titleClass =
    title.length < 10
      ? 'font-display text-[clamp(5rem,14vw,11rem)] uppercase tracking-[0.08em] text-ivory'
      : 'font-display text-[clamp(3.6rem,10vw,8rem)] uppercase tracking-[0.06em] text-ivory';

  return (
    <section className="relative isolate overflow-hidden px-6 pb-20 pt-10 sm:px-8 lg:px-10">
      <HeroBackdrop variant={variant} />
      <div className="mx-auto max-w-7xl">
        <div className="max-w-4xl">
          <motion.div
            className={`inline-flex items-center gap-3 rounded-full border px-5 py-2 text-xs font-semibold uppercase tracking-[0.26em] backdrop-blur-xl ${
              variant === 'violet'
                ? 'border-violet/30 bg-violet/10 text-violet'
                : 'border-gold/25 bg-white/[0.05] text-gold'
            }`}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.65 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            {badge}
          </motion.div>
          <motion.h1
            className={`mt-8 ${titleClass}`}
            initial={{ opacity: 0, y: 40 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            {title}
          </motion.h1>
          <motion.p
            className="mt-6 max-w-3xl text-lg leading-8 text-mist sm:text-xl"
            initial={{ opacity: 0, y: 24 }}
            transition={{ delay: 0.18, duration: 0.7 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            {subtitle}
          </motion.p>
          <motion.div
            className="mt-10 flex flex-col gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.28, duration: 0.6 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            {actions}
          </motion.div>
        </div>
      </div>
      <SectionAngle />
    </section>
  );
}

function ClipXDashboardMockup() {
  return (
    <motion.div
      className="overflow-hidden rounded-[30px] border border-white/10 bg-[#040717]/85 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
      initial={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div className="grid lg:grid-cols-[220px_1fr]">
        <div className="border-b border-white/10 bg-[#091026] p-6 lg:border-b-0 lg:border-r">
          <div className="mb-8 flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-violet/20 font-heading text-xl font-bold text-violet">
              C
            </span>
            <div>
              <p className="font-heading text-xl font-bold text-ivory">ClipX</p>
              <p className="text-xs uppercase tracking-[0.22em] text-mist">
                Campaign Bot
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {['Dashboard', 'Campaigns', 'Payouts', 'Platforms'].map((item, index) => (
              <div
                className={`rounded-2xl px-4 py-3 text-sm ${
                  index === 0
                    ? 'bg-violet/12 text-violet shadow-[inset_0_0_0_1px_rgba(122,152,255,0.22)]'
                    : 'text-mist'
                }`}
                key={item}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6 p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-mist">Campaign Stats</p>
              <h3 className="mt-2 font-heading text-3xl font-bold tracking-[-0.04em] text-ivory">
                Spartans x Forever Media
              </h3>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-2 text-xs uppercase tracking-[0.22em] text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
              Tracking Live
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            {[
              ['Views', '8.7M'],
              ['Clips Submitted', '2,104'],
              ['Verified Engagement', '742K'],
              ['Estimated Earnings', '$11,240'],
            ].map(([label, value]) => (
              <GlassCard className="p-5" key={label}>
                <p className="text-xs uppercase tracking-[0.22em] text-mist">{label}</p>
                <p className="mt-4 font-heading text-3xl font-bold tracking-[-0.05em] text-ivory">
                  {value}
                </p>
              </GlassCard>
            ))}
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <GlassCard className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-violet/20 bg-violet/10 font-heading text-lg font-bold text-violet">
                    CX
                  </span>
                  <div>
                    <p className="font-semibold text-ivory">ClipX Bot</p>
                    <p className="text-xs uppercase tracking-[0.22em] text-mist">
                      Discord Embed
                    </p>
                  </div>
                </div>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs uppercase tracking-[0.18em] text-mist">
                  Updated 12s ago
                </span>
              </div>
              <div className="mt-5 rounded-[22px] border border-white/10 bg-[#0d1430] p-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]">
                <div className="border-l-4 border-violet pl-4">
                  <p className="text-sm font-semibold text-ivory">
                    Campaign Stats: Spartans Launch Week
                  </p>
                  <p className="mt-2 text-sm leading-7 text-mist">
                    Reach is accelerating across TikTok and Instagram. Verified
                    payout band is currently leading historical average by 22%.
                  </p>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {[
                    ['TikTok', '4.3M views'],
                    ['Instagram', '2.1M views'],
                    ['YouTube Shorts', '1.5M views'],
                    ['X', '820K views'],
                  ].map(([platform, result]) => (
                    <div
                      className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
                      key={platform}
                    >
                      <p className="text-xs uppercase tracking-[0.22em] text-mist">
                        {platform}
                      </p>
                      <p className="mt-2 font-heading text-2xl font-bold tracking-[-0.04em] text-ivory">
                        {result}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-mist">
                Payout Summary
              </p>
              <div className="mt-6 space-y-5">
                {[
                  ['Top 10% Clippers', '$4,860'],
                  ['Mid Funnel Rewards', '$3,200'],
                  ['New UGC Bonus Pool', '$1,540'],
                  ['Pending Verification', '$1,640'],
                ].map(([label, amount]) => (
                  <div
                    className="flex items-center justify-between border-b border-white/10 pb-4 last:border-b-0 last:pb-0"
                    key={label}
                  >
                    <span className="text-sm text-mist">{label}</span>
                    <span className="font-heading text-xl font-bold tracking-[-0.04em] text-gold">
                      {amount}
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function DocsPage({ title, subtitle, sections, ctaLabel, ctaTo, badge, variant }) {
  return (
    <div>
      <PageHero
        actions={
          <>
            <Link className="btn-secondary" to="/clipx">
              Back to ClipX
            </Link>
            <a
              className="btn-primary"
              href="https://www.discord.gg/forevermedia"
              rel="noreferrer"
              target="_blank"
            >
              Join Discord
              <ArrowRight size={18} />
            </a>
          </>
        }
        badge={badge}
        subtitle={subtitle}
        title={title}
        variant={variant}
      />

      <AnimatedSection className="px-6 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl space-y-8">
          {sections.map((section) => {
            const Icon = section.icon;

            return (
              <GlassCard className="overflow-hidden p-6 sm:p-8" key={section.title}>
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-2xl">
                    <span className="eyebrow">{section.eyebrow}</span>
                    <div className="mt-4 flex items-center gap-4">
                      <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-gold/20 bg-gold/10 text-gold">
                        <Icon size={24} />
                      </span>
                      <h2 className="font-heading text-4xl font-bold tracking-[-0.05em] text-ivory">
                        {section.title}
                      </h2>
                    </div>
                  </div>
                  <p className="max-w-md text-sm leading-7 text-mist">
                    Exact command set mirrored from the live Forever Media docs experience.
                  </p>
                </div>

                <div className="mt-8 grid gap-5 lg:grid-cols-2">
                  {section.items.map((item) => (
                    <div
                      className="rounded-[24px] border border-white/10 bg-black/15 p-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)]"
                      key={item.command}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="rounded-full border border-gold/20 bg-gold/10 px-4 py-2 font-heading text-lg font-bold tracking-[0.04em] text-gold">
                          {item.command}
                        </span>
                      </div>
                      <p className="mt-5 text-sm leading-7 text-ivory/85">{item.description}</p>
                      <div className="mt-5 overflow-hidden rounded-[18px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-3">
                        <div className="rounded-[14px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(4,6,232,0.18),transparent_60%),linear-gradient(180deg,rgba(6,10,28,0.95),rgba(4,7,20,0.95))] p-4">
                          <div className="mb-3 flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-gold" />
                            <span className="h-2 w-2 rounded-full bg-white/30" />
                            <span className="h-2 w-2 rounded-full bg-white/20" />
                          </div>
                          <div className="rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-xs uppercase tracking-[0.22em] text-mist">
                            {item.command}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            );
          })}
        </div>
      </AnimatedSection>

      <AnimatedSection className="px-6 pb-24 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <GlassCard className="relative overflow-hidden px-8 py-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(4,6,232,0.16),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(143,171,255,0.12),transparent_42%)]" />
            <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <span className="eyebrow">Additional Resource</span>
                <h3 className="mt-4 font-heading text-4xl font-bold tracking-[-0.05em] text-ivory">
                  {ctaLabel}
                </h3>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-mist">
                  Switch between the clipper-facing and admin-facing command sets
                  without leaving the Forever Media experience.
                </p>
              </div>
              <Link className="btn-primary" to={ctaTo}>
                Open Page
                <ArrowRight size={18} />
              </Link>
            </div>
          </GlassCard>
        </div>
      </AnimatedSection>
    </div>
  );
}

function FAQPage() {
  return (
    <div>
      <PageHero
        actions={
          <a
            className="btn-primary"
            href="https://www.discord.gg/forevermedia"
            rel="noreferrer"
            target="_blank"
          >
            Join the Community
            <ArrowRight size={18} />
          </a>
        }
        badge="Forever Media FAQ"
        subtitle="Quick answers to common questions about Forever Media and ClipX."
        title="Frequently Asked Questions"
      />

      <AnimatedSection className="px-6 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
          <AccordionColumn items={clientFaqs} title="Client Questions" />
          <AccordionColumn items={clipperFaqs} title="Clipper Questions" />
        </div>

        <div className="mx-auto mt-12 max-w-4xl text-center">
          <a
            className="btn-secondary"
            href="https://www.discord.gg/forevermedia"
            rel="noreferrer"
            target="_blank"
          >
            Still have questions? Join our Discord community
            <ArrowRight size={18} />
          </a>
        </div>
      </AnimatedSection>
    </div>
  );
}

function AccordionColumn({ title, items }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <GlassCard className="p-6 sm:p-7">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h2 className="font-heading text-3xl font-bold tracking-[-0.04em] text-ivory">
          {title}
        </h2>
        <span className="eyebrow">{items.length} Answers</span>
      </div>
      <div className="space-y-4">
        {items.map((item, index) => {
          const open = index === openIndex;

          return (
            <div
              className={`rounded-[22px] border px-5 py-5 transition ${
                open
                  ? 'border-gold/35 bg-white/[0.05] shadow-[inset_4px_0_0_rgba(4,6,232,0.45)]'
                  : 'border-white/10 bg-black/10'
              }`}
              key={item.question}
            >
              <button
                className="flex w-full items-center justify-between gap-4 text-left"
                onClick={() => setOpenIndex(open ? -1 : index)}
                type="button"
              >
                <span className="font-heading text-xl font-bold tracking-[-0.03em] text-ivory">
                  {item.question}
                </span>
                <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  <ChevronDown className="text-gold" size={18} />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {open ? (
                  <motion.div
                    animate={{ height: 'auto', opacity: 1 }}
                    className="overflow-hidden"
                    exit={{ height: 0, opacity: 0 }}
                    initial={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <p className="pt-4 text-sm leading-7 text-mist">{item.answer}</p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}

function ContactPage({ openCalendly }) {
  return (
    <div>
      <PageHero
        actions={
          <>
            <button className="btn-primary" onClick={openCalendly} type="button">
              Book a Meeting
              <CalendarDays size={18} />
            </button>
            <a className="btn-secondary" href="mailto:contact@forevermedia.io">
              Email the Team
            </a>
          </>
        }
        badge="Contact Forever Media"
        subtitle="Whether you are a brand looking to scale or a clipper ready to earn, we are here."
        title="Get In Touch"
      />

      <AnimatedSection className="px-6 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <GlassCard className="relative overflow-hidden p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(4,6,232,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(143,171,255,0.14),transparent_34%)]" />
            <div className="relative space-y-8">
              <div>
                <span className="eyebrow">Contact Info</span>
                <h2 className="mt-4 font-heading text-4xl font-bold tracking-[-0.05em] text-ivory">
                  Built for fast-moving brands and clippers.
                </h2>
              </div>

              <div className="space-y-4">
                <ContactInfoItem
                  href="mailto:contact@forevermedia.io"
                  icon={<Mail size={18} />}
                  label="Email"
                  value="contact@forevermedia.io"
                />
                <ContactInfoItem
                  href="https://discord.gg/forevermedia"
                  icon={
                    <img
                      alt="Discord"
                      className="h-4 w-4 object-contain opacity-90"
                      style={{
                        filter:
                          "brightness(0) saturate(100%) invert(12%) sepia(96%) saturate(7475%) hue-rotate(235deg) brightness(95%) contrast(110%)"
                      }}
                      src={discordIcon}
                    />
                  }
                  label="Discord"
                  value="Forever Media"
                />
                <ContactInfoItem
                  href="https://www.instagram.com/forevermedia.io"
                  icon={<Instagram size={18} />}
                  label="Instagram"
                  value="@forevermedia.io"
                />

              </div>

              <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-black/20 p-8">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(4,6,232,0.12),transparent_45%)]" />
                <div className="relative flex items-center gap-5">
                  <div className="globe-shell">
                    <Globe2 className="text-gold" size={34} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-mist">
                      Global Distribution
                    </p>
                    <p className="mt-2 max-w-xs text-sm leading-7 text-ivory/85">
                      Campaigns move through a global clipper community built for
                      speed, visibility, and verified performance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>

          <ContactForm openCalendly={openCalendly} />
        </div>
      </AnimatedSection>
    </div>
  );
}

function ContactInfoItem({ href, icon, label, value }) {
  return (
    <a
      className="flex items-center justify-between rounded-[22px] border border-white/10 bg-white/[0.04] px-5 py-4 transition hover:border-gold/30 hover:bg-white/[0.06]"
      href={href}
      rel="noreferrer"
      target="_blank"
    >
      <div className="flex items-center gap-4">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-gold/20 bg-gold/10 text-gold">
          {icon}
        </span>
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-mist">{label}</p>
          <p className="mt-1 font-semibold text-ivory">{value}</p>
        </div>
      </div>
      <ArrowRight className="text-gold" size={18} />
    </a>
  );
}

function ContactForm({ openCalendly }) {
  const [submitted, setSubmitted] = useState(false);
  const [submittedLabel, setSubmittedLabel] = useState('Your email draft is ready.');

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get('name')?.toString().trim() ?? '';
    const email = formData.get('email')?.toString().trim() ?? '';
    const role = formData.get('role')?.toString().trim() ?? '';
    const subject = formData.get('subject')?.toString().trim() ?? 'Forever Media Inquiry';
    const message = formData.get('message')?.toString().trim() ?? '';

    const mailBody = [
      name ? `Name: ${name}` : '',
      email ? `Email: ${email}` : '',
      role ? `Role: ${role}` : '',
      '',
      message,
    ]
      .filter(Boolean)
      .join('\n');

    window.location.href = `mailto:contact@forevermedia.io?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailBody)}`;
    setSubmittedLabel('Your email draft is ready.');
    setSubmitted(true);

    window.setTimeout(() => {
      setSubmitted(false);
    }, 3000);
  };

  return (
    <GlassCard className="relative p-8">
      <div className="rounded-[24px] border border-gold/20 bg-gold/10 p-5 shadow-[0_0_40px_rgba(4,6,232,0.1)]">
        <p className="text-xs uppercase tracking-[0.24em] text-gold/80">
          Faster Option
        </p>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-md">
            <p className="font-heading text-2xl font-bold tracking-[-0.04em] text-ivory">
              Need a faster answer?
            </p>
            <p className="mt-2 text-sm leading-7 text-ivory/80">
              Skip the back and forth and book a meeting with the team directly.
            </p>
          </div>
          <button
            className="btn-primary justify-center sm:min-w-[220px]"
            onClick={openCalendly}
            type="button"
          >
            Book a Meeting
            <CalendarDays size={18} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div>
          <span className="eyebrow">Contact Form</span>
          <h2 className="mt-4 font-heading text-4xl font-bold tracking-[-0.05em] text-ivory">
            Start the conversation.
          </h2>
        </div>
      </div>

      <form className="mt-10 space-y-5" onSubmit={handleSubmit}>
        <div className="grid gap-5 sm:grid-cols-2">
          <FloatingField id="name" label="Name" type="text" />
          <FloatingField id="email" label="Email" type="email" />
        </div>
        
        <FloatingField id="subject" label="Subject" type="text" />
        <FloatingTextarea id="message" label="Message" rows={6} />
        <button className="btn-primary w-full justify-center" type="submit">
          Send Email
          <Send size={18} />
        </button>
      </form>

      <AnimatePresence>
        {submitted ? (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="pointer-events-none absolute bottom-6 right-6 rounded-2xl border border-emerald-400/25 bg-emerald-400/12 px-5 py-3 text-sm text-emerald-200 shadow-[0_0_30px_rgba(52,211,153,0.15)] backdrop-blur-xl"
            exit={{ opacity: 0, y: 12 }}
            initial={{ opacity: 0, y: 12 }}
          >
            {submittedLabel}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </GlassCard>
  );
}

function FloatingField({ id, label, type }) {
  return (
    <div className="field-shell">
      <input className="field-input" id={id} name={id} placeholder=" " type={type} />
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
    </div>
  );
}

function FloatingSelect({ id, label, children }) {
  return (
    <div className="field-shell">
      <select className="field-input field-select" defaultValue="" id={id} name={id}>
        {children}
      </select>
      <label className="field-label field-label-static" htmlFor={id}>
        {label}
      </label>
    </div>
  );
}

function FloatingTextarea({ id, label, rows }) {
  return (
    <div className="field-shell">
      <textarea
        className="field-input min-h-[160px] resize-none pt-7"
        id={id}
        name={id}
        placeholder=" "
        rows={rows}
      />
      <label className="field-label field-label-top" htmlFor={id}>
        {label}
      </label>
    </div>
  );
}

function LegalPage({ title, subtitle, sections }) {
  return (
    <div>
      <PageHero
        actions={
          <a className="btn-secondary" href="mailto:contact@forevermedia.io">
            Legal Questions
          </a>
        }
        badge="Forever Media Legal"
        subtitle={subtitle}
        title={title}
      />

      <AnimatedSection className="px-6 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-5xl space-y-6">
          {sections.map((section) => (
            <GlassCard className="p-8" key={section.title}>
              <h2 className="font-heading text-3xl font-bold tracking-[-0.04em] text-gold">
                {section.title}
              </h2>
              <div className="mt-5 h-px w-full bg-gradient-to-r from-gold/40 to-transparent" />
              <p className="mt-6 max-w-[70ch] text-base leading-8 text-ivory/85">
                {section.body}
              </p>
            </GlassCard>
          ))}
        </div>
      </AnimatedSection>
    </div>
  );
}

export default App;
