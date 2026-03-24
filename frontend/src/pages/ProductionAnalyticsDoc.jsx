import React from 'react';
import ServiceDocPage from '../components/ServiceDocPage';

export default function ProductionAnalyticsDoc() {
  return (
    <ServiceDocPage
      serviceId="analytics"
      eyebrow="Production Analytics — Service Documentation"
      accentColor="#2980B9"

      heroTitle={<>Data-Driven<br /><em>Decisions,</em><br /><strong>Better Outcomes.</strong></>}
      heroDesc="POLTRIFARM's Production Analytics module transforms raw farm data into clear, actionable insights. Real-time dashboards, trend charts, and AI-generated recommendations replace guesswork with evidence."

      heroFeatures={[
        { icon: '📊', title: 'Live Dashboard',         desc: 'Real-time overview of all key metrics: bird counts, egg yields, temperatures, water levels, and financials — updated every 30 seconds.' },
        { icon: '📈', title: 'Trend Analysis',         desc: 'Historical charts reveal performance patterns across batches, seasons, and feed types to help you identify what drives your best results.' },
        { icon: '🤖', title: 'AI Recommendations',     desc: 'The analytics engine correlates your data to surface insights — like which shed conditions are associated with lower mortality rates.' },
        { icon: '⚡', title: 'Anomaly Detection',      desc: 'Automatic alerts when sensor readings or production metrics deviate significantly from your established baseline patterns.' },
      ]}

      metrics={[
        { val: '6',     label: 'Sensor data streams' },
        { val: '30s',   label: 'Dashboard refresh rate' },
        { val: '2 yrs', label: 'Historical data window' },
        { val: '94%',   label: 'Anomaly detection accuracy' },
      ]}

      howItWorksTitle={<>From Raw Data to <em>Clear Insight</em></>}
      howItWorksDesc="The analytics engine runs continuously in the background, collecting data from your IoT sensors and farm records, processing it in the cloud, and surfacing the results on your dashboard."
      steps={[
        { icon: '📡', title: 'Sensor Data Collection',   desc: 'IoT sensors at your farm transmit readings every 30–120 seconds to our cloud backend. Temperature, humidity, water levels, feed weight, egg counts, and ammonia are all captured continuously.' },
        { icon: '🔢', title: 'Cloud Processing',         desc: 'Our backend stores all readings in a time-series database optimised for fast queries over long time windows. Baseline averages are calculated and updated automatically.' },
        { icon: '🔍', title: 'Anomaly Detection',        desc: 'Statistical algorithms compare incoming readings against your farm\'s own baselines. When a reading falls outside the expected range — a temperature spike, a sudden feed consumption drop — an alert is triggered immediately.' },
        { icon: '📊', title: 'Trend Calculation',        desc: 'Every 24 hours, the system calculates weekly and monthly trends for your key production metrics, showing you whether performance is improving, stable, or declining.' },
        { icon: '💡', title: 'Recommendation Generation', desc: 'The AI engine analyses correlations between your environmental conditions, management practices, and outcomes to generate specific, actionable recommendations for your farm.' },
      ]}

      webSteps={[
        { action: 'Open your Dashboard',                    detail: 'After signing in, your dashboard is the first screen you see. It loads with live data from all your sensors and the most recent batch summaries.' },
        { action: 'View live sensor readings',              detail: 'The stats strip at the top of the dashboard shows real-time values for temperature, water level, feed weight, and egg count — colour-coded by status.' },
        { action: 'Navigate to Sensor Monitoring',          detail: 'Click "Sensor Monitoring" in the sidebar for detailed individual sensor views, each with a progress bar showing where the current reading sits within the safe range.' },
        { action: 'Read active alerts',                     detail: 'The Alerts section on the dashboard lists all current warnings and critical notifications. Click "See all" to view the full alert history.' },
        { action: 'Review batch analytics',                 detail: 'In Flock Management, click any batch to see its production trend data — mortality rate over time, feed consumption per day, and weight gain trajectory.' },
        { action: 'Check AI recommendations',               detail: 'Scroll to the Quick Actions section on the dashboard and look for the AI Recommendations card. New recommendations are generated every 24 hours based on your latest data.' },
      ]}
      webTip="Pin the dashboard tab in your browser so it's always one click away. The dashboard auto-refreshes — no need to reload the page manually."

      mobileSteps={[
        { action: 'Check the Dashboard on first open',   detail: 'When you open the POLTRIFARM mobile app, the Dashboard screen loads first. It shows a horizontally scrollable stats strip with live sensor values.' },
        { action: 'Tap a stat card for detail',          detail: 'Tap any stat card in the strip — for example, the Temperature card — to navigate directly to the Sensor Monitoring screen for that sensor type.' },
        { action: 'View alerts',                         detail: 'The red alert banner at the top of the dashboard shows active critical alerts. Tap it to see the full notification list.' },
        { action: 'Open Sensor Monitoring from the drawer', detail: 'Swipe right to open the drawer and tap "Sensor Monitoring" for a full view of all your IoT sensors with live-updating values.' },
        { action: 'Pull to refresh for the latest data', detail: 'Pull down on any screen to force a sync with the cloud and see the most current readings.' },
      ]}
      mobileTip="Enable push notifications to receive anomaly alerts on your phone even when the app is closed — this is the most important setting for staying on top of farm conditions."

      faqs={[
        { q: 'How often does the dashboard data update?', a: 'Sensor readings update every 30 seconds on the dashboard. Production metrics (egg counts, mortality totals) are updated each time you log an event. Financial summaries update in real time as you add transactions.' },
        { q: 'What is "anomaly detection" exactly?', a: 'Anomaly detection uses statistical analysis to identify readings that are unusual for your specific farm. For example, if your shed temperature has averaged 26°C for the past month and suddenly reads 34°C, the system flags it as an anomaly and triggers an alert — even if 34°C would be acceptable on a different farm.' },
        { q: 'Can I export my analytics data?', a: 'Yes. From the web dashboard you can export sensor data as a CSV file for any selected date range. Financial reports can also be exported from the Financial Tracking section.' },
        { q: 'How far back can I view historical data?', a: 'Sensor data is retained for 2 years. Flock and financial records are kept for the duration of your account plus 1 year after closure.' },
        { q: 'What AI recommendations does the system generate?', a: 'Current recommendations include: optimal broiler sale timing based on weight trajectory and market conditions, shed sanitation triggers based on ammonia levels, vaccination reminders based on flock age, and environmental adjustment suggestions when conditions correlate with reduced production.' },
      ]}

      ctaTitle={<>See Your Farm's Data<br /><em>Come Alive</em></>}
      ctaDesc="Register your farm and connect your first sensor. Your personalised analytics dashboard will be live within minutes — showing insights you've never had access to before."
    />
  );
}
