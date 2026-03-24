import React from 'react';
import ServiceDocPage from '../components/ServiceDocPage';

export default function FinancialReportingDoc() {
  return (
    <ServiceDocPage
      serviceId="finance"
      eyebrow="Financial Reporting — Service Documentation"
      accentColor="#C9A84C"

      heroTitle={<>Know Exactly<br /><em>Where Your</em><br /><strong>Money Goes.</strong></>}
      heroDesc="POLTRIFARM's Financial Reporting module gives you a complete picture of your farm's economics — income, expenses, batch profitability, cost-per-bird breakdowns, and AI-driven sale timing recommendations."

      heroFeatures={[
        { icon: '💰', title: 'Profit & Loss Summary',    desc: 'Instant P&L view showing total income, total expenses, net profit, and margin percentage for the current period.' },
        { icon: '🐔', title: 'Cost Per Bird',            desc: 'Automatically calculated cost-per-bird for each batch, factoring in feed, medication, utilities, and all other logged expenses.' },
        { icon: '📊', title: 'Expense Breakdown',        desc: 'Visual breakdown of where your money is going — feed, veterinary, utilities, maintenance — with percentage and value for each category.' },
        { icon: '💡', title: 'Sale Timing Advisor',      desc: 'AI-generated recommendations for the optimal time to sell your broilers based on weight trajectory, feed cost rate, and market price data.' },
      ]}

      metrics={[
        { val: 'KSh',  label: 'Full local currency support' },
        { val: '100%', label: 'Farmer-controlled data' },
        { val: '5 yrs',label: 'Financial record retention' },
        { val: 'Live',  label: 'P&L updates on each entry' },
      ]}

      howItWorksTitle={<>Your Farm's True <em>Economics,</em> Revealed</>}
      howItWorksDesc="POLTRIFARM's financial module is built around the reality of small-scale farming — simple data entry, powerful insights. Every entry you make builds a richer picture of your farm's financial performance over time."
      steps={[
        { icon: '➕', title: 'Log Income & Expenses',     desc: 'Every time money comes in (egg sales, bird sales) or goes out (feed purchase, veterinary visit, utilities), log it as a transaction with its category, amount, description, and date. Takes under 30 seconds.' },
        { icon: '🔗', title: 'Link Transactions to Batches', desc: 'Where applicable, transactions can be linked to a specific flock batch — giving you cost-per-bird and batch-level P&L analysis that goes beyond simple income/expense tracking.' },
        { icon: '📊', title: 'View Your P&L Summary',    desc: 'The financial dashboard shows a live P&L summary — total income, total expenses, net profit, and margin — updated the moment you log a new transaction. No manual calculation needed.' },
        { icon: '🔍', title: 'Analyse by Category',      desc: 'The expense breakdown chart shows you exactly what proportion of your costs goes to feed, veterinary care, utilities, maintenance, and other categories. This is where inefficiencies become visible.' },
        { icon: '💡', title: 'Get Sale Timing Advice',   desc: 'For broiler batches, POLTRIFARM\'s AI engine monitors your batch\'s weight trajectory against its daily feed cost and suggests the optimal sale window — when profit per bird is maximised relative to ongoing feed cost.' },
      ]}

      webSteps={[
        { action: 'Open Financial Tracking',             detail: 'Click "Financial Tracking" in the left sidebar. The page opens with the P&L summary card at the top, followed by the expense breakdown and the full transaction ledger.' },
        { action: 'Add a new transaction',               detail: 'Click "+ Add Transaction" in the top-right corner. A modal form slides up. Select Income or Expense, choose a category, enter the amount and a brief description, and add the date. Click "Add" to save.' },
        { action: 'View your P&L summary',               detail: 'The three-cell summary at the top of the page shows Total Income (green), Total Expenses (red), and Net Profit (gold or red depending on sign). It updates live with each new entry.' },
        { action: 'Review the expense breakdown',        detail: 'The horizontal bar chart below the P&L summary shows each expense category as a percentage of total expenses. Hover over any bar to see the exact amount.' },
        { action: 'Filter the transaction ledger',       detail: 'Use the All / Income / Expense filter tabs above the transaction table to focus your view. Transactions are listed newest first.' },
        { action: 'Review batch-level profitability',    detail: 'Navigate to Flock Management and open any closed batch. The batch detail view shows a financial summary for that batch: total income, total feed cost, and estimated net profit.' },
      ]}
      webTip="Log transactions on the same day they happen rather than batching them weekly. Daily logging takes 30 seconds and produces far more accurate trend data than end-of-week catch-up entries."

      mobileSteps={[
        { action: 'Open "Financial Tracking" from the drawer', detail: 'Swipe right to open the navigation drawer and tap "Financial Tracking".' },
        { action: 'View the P&L summary',                      detail: 'The top of the screen shows a three-panel summary: income, expenses, and net profit. The numbers update live as you add entries.' },
        { action: 'Tap "+ Add Transaction"',                   detail: 'Tap the gold button at the top right. A bottom sheet form opens. Toggle between Income and Expense at the top, then fill in category, amount, description, and date.' },
        { action: 'Filter transactions',                       detail: 'Use the All / Income / Expense tabs to filter the transaction list. Swipe left on any transaction to reveal a delete option.' },
        { action: 'Check the expense breakdown',               detail: 'Scroll down past the ledger to see the expense category breakdown with colour-coded horizontal bars and amounts.' },
      ]}
      mobileTip="Log income transactions right after a sale — at the market, or immediately after a buyer pays. The mobile app works offline, so you can log even without signal and it will sync when you reconnect."

      faqs={[
        { q: 'Does POLTRIFARM connect to my bank or mobile money account?', a: 'Currently, POLTRIFARM does not integrate directly with banking or M-Pesa accounts. All financial transactions are entered manually. This is intentional — it ensures you remain in full control of what is recorded and avoids the complexity and security concerns of banking integrations. Automated bank integration is on the roadmap for a future release.' },
        { q: 'How does the Sale Timing Advisor work?', a: 'For broiler batches, POLTRIFARM tracks your batch\'s weight gain trajectory from logged weight checkpoints. It calculates the daily feed cost (from feed consumption logs) against the estimated revenue per kg at current market prices (which you can enter manually). The system identifies the point at which continued feeding no longer increases profit-per-bird — and recommends selling before that point is reached.' },
        { q: 'Can I track VAT or tax on transactions?', a: 'The current version does not have a built-in tax tracking module. If you need to track VAT, the recommended approach is to record gross amounts (inclusive of tax) and note the VAT component in the transaction description field.' },
        { q: 'How do I calculate my cost per egg?', a: 'POLTRIFARM calculates cost-per-egg automatically for layer batches using your total expenses linked to that batch divided by the total egg count recorded. Make sure you\'re logging both batch expenses and daily egg counts (either manually or via the egg counter sensor) for this calculation to be accurate.' },
        { q: 'Can I see P&L for a specific time period?', a: 'The current dashboard shows a monthly P&L view. You can filter the transaction ledger by date range. A custom date range P&L report (exportable as PDF or CSV) is on the development roadmap.' },
      ]}

      ctaTitle={<>Know Your Numbers.<br /><em>Grow Your Farm.</em></>}
      ctaDesc="Stop guessing whether your farm is profitable. POLTRIFARM shows you the numbers in real time — sign in and log your first transaction in under a minute."
    />
  );
}
