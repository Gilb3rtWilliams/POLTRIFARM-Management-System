import React from 'react';
import ServiceDocPage from '../components/ServiceDocPage';

export default function FeedInventoryDoc() {
  return (
    <ServiceDocPage
      serviceId="feed"
      eyebrow="Feed & Inventory — Service Documentation"
      accentColor="#E67E22"

      heroTitle={<>Never Run Out.<br /><em>Never Overspend.</em><br /><strong>Always Ready.</strong></>}
      heroDesc="POLTRIFARM's Feed & Inventory module tracks every kilogram of feed, every vial of vaccine, and every item in your farm store. Automated low-stock alerts and consumption logs keep your operation running without interruption."

      heroFeatures={[
        { icon: '🌾', title: 'Feed Stock Tracking',    desc: 'Real-time stock levels for all feed types, updated automatically as you log daily consumption events.' },
        { icon: '🔴', title: 'Low-Stock Alerts',        desc: 'Configurable reorder thresholds send instant alerts before you run out — giving you time to reorder from your supplier.' },
        { icon: '📦', title: 'Full Inventory Catalogue', desc: 'Track feeds, supplements, medications, sanitation products, and equipment in a single organised store.' },
        { icon: '📋', title: 'Consumption Log',         desc: 'Detailed feed usage history per batch — revealing true consumption rates, cost per bird, and feed efficiency over time.' },
      ]}

      metrics={[
        { val: '8+',   label: 'Item categories supported' },
        { val: 'Live', label: 'Stock level updates' },
        { val: '100%', label: 'Audit trail coverage' },
        { val: 'KSh',  label: 'Full cost tracking' },
      ]}

      howItWorksTitle={<>From Delivery to <em>Last Gram</em> — Fully Tracked</>}
      howItWorksDesc="The Feed & Inventory module creates a complete audit trail from the moment stock arrives at your farm to the day it's consumed. Every event is recorded, every kilogram accounted for."
      steps={[
        { icon: '📥', title: 'Add Items to Inventory',   desc: 'When feed or supplies arrive, log them in the inventory with item name, type, quantity, unit cost, and supplier. Stock levels are updated immediately.' },
        { icon: '🌾', title: 'Log Daily Feed Usage',     desc: 'At the end of each day (or feeding session), log how much of each feed type was consumed by which batch. The system automatically deducts the amount from that item\'s stock level.' },
        { icon: '⚠️', title: 'Receive Low-Stock Alerts', desc: 'Each item has a configurable reorder threshold. When stock drops to or below that level, you receive an automatic alert — yellow for low, red for critical.' },
        { icon: '💰', title: 'Track Costs Per Batch',    desc: 'Every feed consumption entry is linked to a batch and a cost. POLTRIFARM builds a running total of your feed cost per batch, which feeds directly into your Financial Reporting.' },
        { icon: '📊', title: 'Review Efficiency',        desc: 'The inventory dashboard shows your total stock value, consumption rate trends, and which batches are consuming the most feed — helping you identify inefficiencies and optimise.' },
      ]}

      webSteps={[
        { action: 'Open Feed & Inventory',          detail: 'Click "Feed & Inventory" in the left sidebar. You\'ll see the low-stock alert strip at the top (if any items are below threshold), then the summary stats row, followed by the full inventory table.' },
        { action: 'Add a new stock item',            detail: 'Scroll to the inventory table and click "+ Add Stock Item" (or manage items directly from the table). Enter the name, type, quantity received, unit cost, and supplier.' },
        { action: 'Log daily feed usage',            detail: 'Click "+ Log Feed Usage" at the top of the page. A modal form opens — select the feed type from your inventory, choose the batch it was fed to, and enter the quantity in kg. Click "Log Usage" to save.' },
        { action: 'Monitor stock levels',            detail: 'Each item in the inventory table shows a visual stock progress bar. Items below the reorder threshold are flagged with a coloured status badge (Low or Critical).' },
        { action: 'Set or change reorder thresholds',detail: 'In the inventory table, click the edit icon on any item to update its reorder threshold (the quantity at which the alert triggers).' },
        { action: 'Review consumption history',      detail: 'Scroll below the inventory table to see the Feed Usage Log — a full history of all consumption events with date, batch, feed type, quantity, and cost.' },
      ]}
      webTip="Log feed usage at the same time each day to build a consistent dataset. Even approximate measurements are more useful than missing records — the trend matters more than perfect precision."

      mobileSteps={[
        { action: 'Open "Feed & Inventory" from the drawer', detail: 'Swipe right to open the drawer and tap "Feed & Inventory". You\'ll see inventory cards and a "+ Log Feed Usage" button at the top.' },
        { action: 'Tap "+ Log Feed Usage"',                   detail: 'Tap the button to open the log form. Select the feed type, choose the batch it was fed to, enter the kg consumed, and optionally enter the cost.' },
        { action: 'Review low-stock warnings',                detail: 'Any items at or below their reorder threshold appear as orange or red alert banners at the top of the screen with supplier details and an "Order Now" button.' },
        { action: 'Check stock levels at a glance',           detail: 'Each inventory item card shows a colour-coded status indicator. Green = OK, yellow = Low, red = Critical. Tap any card to see full item details.' },
        { action: 'Add received stock',                       detail: 'When a delivery arrives, tap "+ Add Stock" to log the received quantity. Stock levels update immediately and any low-stock alerts are cleared if the new level is above the threshold.' },
      ]}
      mobileTip="Do your daily feed usage log right after the morning feeding — before you leave the shed. It takes 30 seconds and keeps your consumption data accurate."

      faqs={[
        { q: 'Does POLTRIFARM automatically track feed consumption from sensors?', a: 'The IoT feed weight sensor (load cell under the feed trough) provides continuous weight readings that can indicate consumption trends, and the sensor monitoring dashboard shows these in real time. However, batch-specific feed consumption logging (which links usage to a particular flock batch) is currently a manual entry. Automated batch-level consumption tracking from sensor data is planned for a future release.' },
        { q: 'Can I track medication and vaccine stock, not just feed?', a: 'Yes. The inventory supports multiple item types: Feed, Supplement, Medication, Sanitation, and Equipment. Each has its own unit (kg, litres, vials, pieces) and follows the same stock tracking and alert logic.' },
        { q: 'How do I calculate my Feed Conversion Ratio (FCR)?', a: 'POLTRIFARM calculates FCR automatically at batch closeout using the total feed consumed (from your consumption logs) divided by the total live weight gain recorded for that batch. The accuracy of this calculation depends on you logging both feeding events and weight checkpoints consistently.' },
        { q: 'Can I set different reorder thresholds for different items?', a: 'Yes. Each inventory item has its own configurable reorder threshold. For high-value items like vaccines you might set a very conservative threshold; for bulk feed you might set a threshold based on how many days of supply remain.' },
        { q: 'Is there a way to track multiple suppliers for the same item?', a: 'Currently, each inventory item stores one supplier name. If you use multiple suppliers for the same feed type, the recommended approach is to log them as separate stock entries (e.g. "Layer Mash — Supplier A" and "Layer Mash — Supplier B") to maintain accurate sourcing records.' },
      ]}

      ctaTitle={<>Never Face an<br /><em>Empty Trough</em> Again</>}
      ctaDesc="Set up your inventory, configure your reorder thresholds, and let POLTRIFARM handle the reminders. Sign in to get started — your first stock item takes under a minute to log."
    />
  );
}
