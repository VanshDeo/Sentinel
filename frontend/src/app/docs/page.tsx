"use client";

import { motion } from "framer-motion";

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      id={id}
      className="mb-16 scroll-mt-8"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
    >
      <h2 className="text-xl font-semibold tracking-tight mb-6 pb-3 border-b border-[rgba(245,245,247,0.08)] text-[#F5F5F7] flex items-center gap-2.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#8B8FE8]" />
        <span>{title}</span>
      </h2>
      <div className="space-y-4 text-[#B4B4B9] leading-relaxed text-[15px]">
        {children}
      </div>
    </motion.section>
  );
}

function CodeBlock({ children, language = "typescript" }: { children: string; language?: string }) {
  return (
    <pre className="rounded-lg bg-[#111113] border border-[rgba(245,245,247,0.06)] p-5 overflow-x-auto text-sm leading-relaxed">
      <code
        className="text-[#B4B4B9]"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {children}
      </code>
    </pre>
  );
}

export default function DocsPage() {
  return (
    <div>
      {/* Page title */}
      <div className="mb-12 border-b border-[rgba(245,245,247,0.08)] pb-8">
        <span className="text-xs uppercase font-mono tracking-widest text-[#8B8FE8] block mb-2 font-medium">
          Docs & Technical Guides
        </span>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#F5F5F7] mb-3">
          Documentation
        </h1>
        <p className="text-[#71717A] text-base">
          Everything you need to integrate Sentinel into your treasury workflow.
        </p>
      </div>

      <Section id="overview" title="Overview">
        <p>
          Sentinel is an encrypted treasury protocol that enforces compliance policies
          before transactions settle on-chain. It separates the concerns of privacy,
          policy enforcement, and audit access into three distinct layers.
        </p>
        <p>
          Unlike public-ledger approaches where all transaction data is visible, or
          single-key privacy where one compromised key exposes everything, Sentinel
          uses a multi-party architecture where no single entity can access encrypted
          data without consensus.
        </p>
      </Section>

      <Section id="architecture" title="Architecture">
        <p>
          The protocol consists of three core components that work together to provide
          privacy with accountability:
        </p>
        <ul className="list-none space-y-3 pl-0">
          <li className="flex gap-3">
            <span className="text-[#8B8FE8] shrink-0">01</span>
            <span><strong className="text-[#F5F5F7]">Encrypted Treasury</strong> — Stores balances and transaction history in encrypted form. Only authorized operations can read or modify the state.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#8B8FE8] shrink-0">02</span>
            <span><strong className="text-[#F5F5F7]">Policy Engine</strong> — Evaluates compliance rules against proposed transactions without decrypting the underlying data. Rules are defined in a declarative format.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#8B8FE8] shrink-0">03</span>
            <span><strong className="text-[#F5F5F7]">Audit Layer</strong> — Provides time-limited read access to encrypted data through a 2-of-3 key reconstruction mechanism. No single party can initiate an audit alone.</span>
          </li>
        </ul>
      </Section>

      <Section id="treasury" title="Treasury Setup">
        <p>
          To create a new encrypted treasury, deploy the Sentinel contract to an
          Avalanche-compatible network and initialize it with your policy configuration.
        </p>
        <CodeBlock>{`import { SentinelSDK } from '@sentinel/sdk';

const sentinel = new SentinelSDK({
  network: 'fuji',
  treasuryAddress: '0x7a3f...c2d1',
});

// Initialize with policy
await sentinel.initialize({
  policies: [
    { type: 'cap', value: 500_000, unit: 'USDC' },
    { type: 'velocity', maxPerHour: 10 },
  ],
  auditors: [auditorKey1, auditorKey2, auditorKey3],
  threshold: 2, // 2-of-3 for audit access
});`}</CodeBlock>
      </Section>

      <Section id="policy" title="Policy Engine">
        <p>
          Policies are evaluated before every transaction reaches the network.
          A transaction that violates any active policy is rejected and never
          broadcast to the chain.
        </p>
        <p>
          Supported policy types:
        </p>
        <div className="grid grid-cols-1 gap-3">
          {[
            { type: "cap", desc: "Maximum transaction amount per operation" },
            { type: "velocity", desc: "Rate limiting by count or volume over a time window" },
            { type: "whitelist", desc: "Restrict destinations to approved addresses" },
            { type: "schedule", desc: "Time-based restrictions (business hours, cooldown periods)" },
          ].map((policy) => (
            <div
              key={policy.type}
              className="flex items-start gap-4 px-4 py-3 rounded-md bg-[#111113] border border-[rgba(245,245,247,0.06)]"
            >
              <code
                className="text-xs text-[#8B8FE8] bg-[#8B8FE8]/10 px-2 py-0.5 rounded shrink-0"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {policy.type}
              </code>
              <span>{policy.desc}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section id="audit" title="Audit System">
        <p>
          The audit system uses Shamir&apos;s Secret Sharing to split the decryption key
          into three fragments distributed to independent key holders. Any two of three
          fragments can reconstruct the audit key, providing time-limited read access.
        </p>
        <CodeBlock>{`// Key holders submit their fragments
await sentinel.submitAuditFragment(fragment1, holder1Signature);
await sentinel.submitAuditFragment(fragment2, holder2Signature);

// Once threshold is met, audit access is granted
const auditSession = await sentinel.beginAudit({
  duration: '24h',
  scope: ['transactions', 'balances'],
});

// Read encrypted data
const history = await auditSession.getTransactionHistory();`}</CodeBlock>
      </Section>

      <Section id="api" title="API Reference">
        <p>
          Full API documentation is available in the SDK package. Key interfaces:
        </p>
        <CodeBlock>{`interface SentinelConfig {
  network: 'fuji' | 'mainnet';
  treasuryAddress: string;
  signerKey?: string;
}

interface PolicyRule {
  type: 'cap' | 'velocity' | 'whitelist' | 'schedule';
  value?: number;
  unit?: string;
  maxPerHour?: number;
  addresses?: string[];
  schedule?: ScheduleConfig;
}

interface AuditSession {
  id: string;
  expiresAt: Date;
  scope: string[];
  getTransactionHistory(): Promise<Transaction[]>;
  getBalances(): Promise<Balance[]>;
  revoke(): Promise<void>;
}`}</CodeBlock>
      </Section>
    </div>
  );
}
