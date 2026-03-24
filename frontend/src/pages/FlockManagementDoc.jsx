import React from "react";
import ServiceDocPage from "../components/ServiceDocPage";

export default function FlockManagementDoc() {
  return (
    <ServiceDocPage
      serviceId="flock"
      eyebrow="Flock Management — Service Documentation"
      accentColor="#C9A84C"
      heroTitle={
        <>
          Manage Every
          <br />
          <em>Bird,</em> Every Batch.
          <br />
          <strong>One Place.</strong>
        </>
      }
      heroDesc="POLTRIFARM's Flock Management module gives you complete visibility over every batch — from day-old chicks through to market weight. Track health, weight, mortality, feed, and production in one place."
      heroFeatures={[
        {
          icon: "🐔",
          title: "Batch Tracking",
          desc: "Record and monitor every flock batch with age, type, shed assignment, and bird count.",
        },
        {
          icon: "📋",
          title: "Health Status Flags",
          desc: "Mark batches as Healthy, Monitor, or Critical and receive instant alerts when status changes.",
        },
        {
          icon: "💀",
          title: "Mortality Logging",
          desc: "Log daily mortality events with cause notes to spot patterns early and take corrective action.",
        },
        {
          icon: "⚖️",
          title: "Weight & Growth",
          desc: "Track average weight milestones per batch to benchmark against breed growth standards.",
        },
      ]}
      metrics={[
        { val: "4+", label: "Batch types supported" },
        { val: "100%", label: "Cloud-synced records" },
        { val: "< 30s", label: "Time to log an event" },
        { val: "2 yrs", label: "Historical data retained" },
      ]}
      howItWorksTitle={
        <>
          From Arrival to <em>Market</em> — Fully Tracked
        </>
      }
      howItWorksDesc="Flock Management follows the complete lifecycle of every batch you raise. Here's how the system works from the moment birds arrive to the day they leave."
      steps={[
        {
          icon: "➕",
          title: "Create a Batch",
          desc: "Register a new batch with its type (Broiler, Layer, Dual Purpose), initial count, shed assignment, and arrival date. This becomes the anchor record for all events.",
        },
        {
          icon: "📅",
          title: "Daily Event Logging",
          desc: "Each day, log mortality events, feed consumption, weight checks, and health observations. Takes under a minute and builds a rich longitudinal dataset.",
        },
        {
          icon: "⚡",
          title: "Automatic Alerts",
          desc: "The system flags batches when mortality rates spike, health degrades, or feed consumption drops — giving you early warning before problems escalate.",
        },
        {
          icon: "📊",
          title: "Performance Review",
          desc: "Compare batch performance against your historical averages and industry benchmarks. Identify which sheds, feed types, or seasons correlate with better outcomes.",
        },
        {
          icon: "🛒",
          title: "Sale & Closeout",
          desc: "Mark a batch as sold or closed. POLTRIFARM calculates your final cost-per-bird, mortality rate, and Feed Conversion Ratio (FCR) for the completed batch.",
        },
      ]}
      webSteps={[
        {
          action: "Navigate to Flock Management",
          detail:
            'In the left sidebar of your dashboard, click "Flock Management" to open the batch overview screen.',
        },
        {
          action: 'Click "+ Add Batch"',
          detail:
            'Hit the gold "+ Add Batch" button in the top-right corner. A modal form slides up from the bottom.',
        },
        {
          action: "Fill in batch details",
          detail:
            'Enter the batch name (e.g. "Batch E"), select the bird type, enter the initial count, and assign a shed. Click "Add Batch" to save.',
        },
        {
          action: "Log daily events",
          detail:
            'Click any batch row to open its detail view. Use the "Record Mortality", "Log Feeding", and "Update Health" buttons to capture daily events.',
        },
        {
          action: "Filter and review batches",
          detail:
            "Use the filter tabs (All / Broiler / Layer / Dual Purpose) above the batch table to focus your view. Click any column header to sort.",
        },
        {
          action: "Export batch report",
          detail:
            'Open a batch detail view and click "Export" to download a CSV of all events for that batch.',
        },
      ]}
      webTip="Use the keyboard shortcut Alt+N to quickly open the Add Batch form without reaching for the mouse."
      mobileSteps={[
        {
          action: 'Open the Drawer and tap "Flock Management"',
          detail:
            'Swipe right from the left edge of the screen or tap the ☰ menu icon to open the navigation drawer. Tap "Flock Management".',
        },
        {
          action: 'Tap "+ Add Batch" to register a new flock',
          detail:
            "The button appears at the top right of the screen. Tapping it opens a bottom sheet form where you can fill in batch details.",
        },
        {
          action: "Tap a batch card to view details",
          detail:
            "Each batch is shown as a card with its key stats. Tap any card to expand the full detail view with action buttons.",
        },
        {
          action: "Log a mortality or feeding event",
          detail:
            'Inside the batch detail, tap "Record Mortality" or "Log Feeding". A compact form appears — enter the details and tap Save.',
        },
        {
          action: "Pull to refresh for the latest data",
          detail:
            "Pull down on the batch list to force a sync with the cloud and see the most recent records from all devices.",
        },
      ]}
      mobileTip="Turn on push notifications in your mobile settings so POLTRIFARM can alert you to batch health changes even when the app is running in the background."
      faqs={[
        {
          q: "How many batches can I manage at the same time?",
          a: "There is no hard limit on concurrent active batches. POLTRIFARM is designed to handle multiple sheds running parallel batches, including mixed flock types on the same farm.",
        },
        {
          q: "Can I track layers and broilers on the same account?",
          a: "Yes. Each batch is assigned a type (Broiler, Layer, or Dual Purpose), and the system adapts the metrics it tracks accordingly — showing egg counts for layer batches and weight milestones for broiler batches.",
        },
        {
          q: "What happens to data when I close a batch?",
          a: "Closed batches are archived but never deleted. All event history, mortality records, and financial summaries remain accessible under your account history for up to two years.",
        },
        {
          q: "Can multiple people log events to the same batch?",
          a: "Currently each POLTRIFARM account is single-user. Multi-user farm accounts with role-based access are planned for a future release.",
        },
        {
          q: "How is the Feed Conversion Ratio (FCR) calculated?",
          a: "FCR is calculated automatically at batch closeout as: Total Feed Consumed (kg) ÷ Total Live Weight Gain (kg). You need to log both feeding records and weight checkpoints throughout the batch for this to be accurate.",
        },
      ]}
      ctaTitle={
        <>
          Start Tracking Your
          <br />
          <em>Flock</em> Today
        </>
      }
      ctaDesc="Join farmers already using POLTRIFARM to replace guesswork with data. Create your free account and have your first batch logged in under two minutes."
    />
  );
}
