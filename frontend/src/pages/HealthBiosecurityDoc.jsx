import React from 'react';
import ServiceDocPage from '../components/ServiceDocPage';

export default function HealthBiosecurityDoc() {
  return (
    <ServiceDocPage
      serviceId="health"
      eyebrow="Health & Biosecurity — Service Documentation"
      accentColor="#27AE60"

      heroTitle={<>Protect Your<br /><em>Flock</em> Before<br /><strong>It's Too Late.</strong></>}
      heroDesc="POLTRIFARM's Health & Biosecurity module gives you early warning of potential disease threats, AI-assisted visual health analysis, vaccination scheduling, and biosecurity audit tools — all designed to help you act before losses occur."

      heroFeatures={[
        { icon: '🔬', title: 'AI Health Scan',          desc: 'Photograph visible abnormalities and get AI-assisted preliminary analysis of possible conditions within seconds.' },
        { icon: '💉', title: 'Vaccination Scheduler',   desc: 'Automated reminders for every vaccination in your flock\'s schedule — never miss a dose again.' },
        { icon: '🧹', title: 'Sanitation Tracking',     desc: 'Log shed cleaning events and receive automated reminders when your next scheduled sanitation is due.' },
        { icon: '⚠️', title: 'Environmental Health',    desc: 'Live monitoring of ammonia levels, temperature, and humidity — the environmental factors most linked to disease susceptibility.' },
      ]}

      metrics={[
        { val: '94%',  label: 'AI model accuracy (test set)' },
        { val: '5',    label: 'Disease categories detected' },
        { val: '< 5s', label: 'AI scan result time' },
        { val: '40%',  label: 'Avg. mortality reduction reported' },
      ]}

      howItWorksTitle={<>Early Detection Saves <em>Birds & Money</em></>}
      howItWorksDesc="The Health module combines continuous environmental monitoring, AI-assisted image analysis, and structured scheduling to move your farm from reactive to proactive health management."
      steps={[
        { icon: '📡', title: 'Continuous Environmental Monitoring', desc: 'Temperature, humidity, and ammonia sensors run 24/7. When conditions reach ranges associated with increased disease susceptibility, you receive an alert immediately — before birds show visible symptoms.' },
        { icon: '📷', title: 'Capture & Submit a Health Scan',      desc: 'When you notice an unusual symptom — a lesion, discharge, abnormal feathering, or lethargic behaviour — open the AI Health Scan in the app, photograph the affected area, and submit.' },
        { icon: '🤖', title: 'AI Model Analysis',                   desc: 'Our MobileNetV2 convolutional neural network processes the image against a database of common poultry conditions including Newcastle disease, Fowlpox, Marek\'s disease, infectious bronchitis, and coccidiosis.' },
        { icon: '📋', title: 'Review Ranked Results & Actions',     desc: 'The system returns a ranked list of possible conditions, each with a confidence score and a plain-language description. Specific recommended actions are listed for each condition, including when to call a veterinarian urgently.' },
        { icon: '📅', title: 'Follow Vaccination Reminders',        desc: 'Based on your flock\'s age and vaccination history, POLTRIFARM generates a vaccination schedule and sends reminders 7 days and 24 hours before each due date.' },
        { icon: '🧹', title: 'Log Sanitation Events',               desc: 'After each shed cleaning, log the event in the Reminders module. The system records the date and automatically schedules your next reminder based on your configured cleaning frequency.' },
      ]}

      webSteps={[
        { action: 'Navigate to AI Health Scan',      detail: 'Click "AI Health Scan" in the left sidebar of your dashboard to open the scan interface.' },
        { action: 'Simulate or upload an image',     detail: 'Click "📷 Take Photo" to upload an image from your device, or "📷 Simulate Scan" to see a demonstration with sample results. In production, this will connect to your device camera or file picker.' },
        { action: 'Review the analysis results',     detail: 'After processing (under 5 seconds), you\'ll see a ranked list of possible conditions. Each entry shows a confidence percentage, severity badge (Low/Medium/High), and recommended actions.' },
        { action: 'Follow or save the recommendations', detail: 'Review the recommended actions for the top match. If the scan shows High severity, contact your veterinarian. Use the "Save Report" button to archive the scan result.' },
        { action: 'Manage vaccination reminders',    detail: 'Click "Reminders" in the sidebar to see all upcoming vaccinations and sanitation tasks. Urgent items appear in red at the top. Click "Mark Done" once completed.' },
        { action: 'Review scan history',             detail: 'The scan history table at the bottom of the AI Health Scan page shows all previous scans with dates, results, and status badges.' },
      ]}
      webTip="Always photograph the affected area in good natural light, focused closely on the abnormality. Blurry or poorly lit images will produce lower confidence scores and less reliable results."

      mobileSteps={[
        { action: 'Open "AI Health Scan" from the drawer',  detail: 'Swipe right to open the navigation drawer and tap "AI Health Scan". This is the most important feature to use from the field, directly at the bird.' },
        { action: 'Tap "📷 Take Photo"',                    detail: 'Tap the Take Photo button to open your phone\'s camera. The camera will open in photo mode. Take a close, well-lit photograph of the area of concern.' },
        { action: 'Confirm and analyse',                    detail: 'After taking the photo, a preview appears. Tap "Analyse Image" to submit it to the AI model. A progress screen shows the analysis steps as they complete.' },
        { action: 'Read the results',                       detail: 'Results appear as ranked condition cards. The top match shows a large confidence percentage. Scroll down to read recommended actions and when to seek veterinary help.' },
        { action: 'Check vaccination reminders',            detail: 'In the drawer, tap "Reminders". Urgent reminders appear highlighted in red. Tap "Mark Done" on any completed task.' },
        { action: 'Enable push notifications',              detail: 'Allow push notifications when prompted — this is how POLTRIFARM delivers urgent vaccination and health alerts to your phone even when the app is closed.' },
      ]}
      mobileTip="For the best AI scan results on mobile, hold your phone 15–20 cm from the affected area, use natural daylight, and take the photo steady (not in motion). The model performs significantly better with sharp, well-lit images."

      faqs={[
        { q: 'Is the AI Health Scan a veterinary diagnosis?', a: 'No — and this is critically important. The AI Health Scan is a decision support tool only. It provides probability-ranked suggestions to help you understand what might be happening, but it does not replace professional veterinary examination or diagnosis. Always consult a qualified veterinarian for any serious or unclear health concern.' },
        { q: 'Which diseases can the AI model detect?', a: 'The current model is trained to identify visual indicators associated with Newcastle Disease, Fowlpox, Marek\'s Disease, Infectious Bronchitis, and Coccidiosis, as well as healthy control presentations. The model returns a "no significant finding" result when the image does not match known disease patterns.' },
        { q: 'How accurate is the AI model?', a: 'On our held-out test dataset, the model achieved 94.3% classification accuracy. However, real-world accuracy may be lower for unclear images, poor lighting, or disease presentations that differ from the training data. Confidence scores are always shown alongside results so you can weigh them appropriately.' },
        { q: 'How do I set up vaccination reminders?', a: 'Vaccination reminders are generated automatically based on your flock batch ages and a standard poultry vaccination schedule. You can customise reminder timing (how many days in advance you receive the alert) from the Reminders settings.' },
        { q: 'What should I do if the AI scan shows High severity?', a: 'Immediately isolate the affected bird or birds from the rest of the flock to prevent potential spread. Then contact a qualified veterinarian as soon as possible. The AI result gives you a starting point for the conversation, but professional examination is essential.' },
      ]}

      ctaTitle={<>Protect Your Flock with<br /><em>Intelligent</em> Health Tools</>}
      ctaDesc="The earlier you detect a problem, the more birds — and money — you save. Sign in or register to activate AI Health Scanning, vaccination scheduling, and real-time environmental health monitoring on your farm."
    />
  );
}
