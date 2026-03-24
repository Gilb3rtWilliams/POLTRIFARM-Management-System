import React from "react";
import ServiceDocPage from "../components/ServiceDocPage";

export default function MultiFarmControlDoc() {
  return (
    <ServiceDocPage
      serviceId="multifarm"
      eyebrow="Multi-Farm Control — Service Documentation"
      accentColor="#8E44AD"
      heroTitle={
        <>
          One Dashboard.
          <br />
          <em>Every Farm.</em> Every Business You Own.
          <br />
          <strong>Total Control.</strong>
        </>
      }
      heroDesc="POLTRIFARM's Multi-Farm Control gives system administrators a single command centre to oversee all registered farms — monitoring performance, managing users, configuring sensors, and onboarding new operations across the entire platform."
      heroFeatures={[
        {
          icon: "🏗️",
          title: "Platform-wide Overview",
          desc: "See all registered farms, total bird counts, system-wide egg production, and combined revenue — at a glance, in real time.",
        },
        {
          icon: "👥",
          title: "User Management",
          desc: "Approve, reject, or suspend farmer accounts. Assign roles and manage access permissions for every user on the platform.",
        },
        {
          icon: "📡",
          title: "Sensor Network Control",
          desc: "Monitor the health and status of every IoT sensor across all farms. Identify offline devices and critical alerts by farm.",
        },
        {
          icon: "📊",
          title: "Cross-Farm Analytics",
          desc: "Compare farm performance metrics side by side — identifying which operations are performing best and why.",
        },
      ]}
      metrics={[
        { val: "All", label: "Farms visible from one view" },
        { val: "Live", label: "Cross-farm data sync" },
        { val: "100%", label: "User access control" },
        { val: "24/7", label: "Platform uptime monitoring" },
      ]}
      howItWorksTitle={
        <>
          Enterprise Oversight for <em>Every Scale</em>
        </>
      }
      howItWorksDesc="Multi-Farm Control is the administrator layer of POLTRIFARM. It gives authorised administrators the tools to manage the entire platform — from individual user accounts to system-wide sensor infrastructure."
      steps={[
        {
          icon: "🔐",
          title: "Admin Account Activation",
          desc: "Multi-Farm Control is accessible only to accounts with the Admin role. Admin accounts are registered through the Admin Registration page and require approval from a super-administrator before access is granted. This two-step process ensures only authorised personnel access platform-wide controls.",
        },
        {
          icon: "⊞",
          title: "System Overview Dashboard",
          desc: "Upon login, admins land on the System Overview — a platform-wide dashboard showing total active farms, total birds monitored, system-wide egg production today, combined platform revenue, pending approval requests, and critical sensor alerts across all farms.",
        },
        {
          icon: "👥",
          title: "User & Account Management",
          desc: "The User Management tab lists every registered user with their role, approval status, farm name, and registration date. Admins can approve pending accounts, suspend active accounts, change user roles, and search and filter users by name, email, or status.",
        },
        {
          icon: "🏗️",
          title: "Farm Performance Monitoring",
          desc: "The Farm Analytics tab provides a comparison table of all active farms — showing bird counts, daily egg production, sensor uptime, health status, and revenue figures. Admins can identify underperforming farms and reach out with support.",
        },
        {
          icon: "📡",
          title: "Sensor Network Oversight",
          desc: "The Sensor Network tab shows a farm-by-farm breakdown of all deployed sensors — how many are online, offline, showing critical readings, or showing warnings. This allows administrators to identify farms with sensor issues before the farmer notices.",
        },
        {
          icon: "➕",
          title: "Farm Onboarding",
          desc: "The Farm Onboarding form lets admins register new farms directly and send invitation emails to new farmers — reducing the friction of getting a new operation set up on the platform.",
        },
      ]}
      webSteps={[
        {
          action: "Sign in via the Admin Login portal",
          detail:
            'Go to the Admin Login page (accessible via the "Admin" tab on the Sign In page). Enter your Admin ID, email, and password. You will be redirected to the Admin Dashboard upon successful authentication.',
        },
        {
          action: "Review the System Overview",
          detail:
            "The overview dashboard loads first, showing platform-wide stats, active alerts from all farms, and a summary table of all registered farms with their key metrics.",
        },
        {
          action: "Handle pending account approvals",
          detail:
            'If there are pending farmer or admin registrations, a banner appears at the top with a count. Click "Review" to open the User Management page where you can approve or reject each request.',
        },
        {
          action: "Manage individual user accounts",
          detail:
            "In User Management, use the search bar to find a specific user. Use the filter tabs (All / Farmer / Admin / Pending) to narrow the list. Change roles using the dropdown in the Role column, or approve/suspend using the action buttons.",
        },
        {
          action: "Monitor farm performance",
          detail:
            'Click "Farm Analytics" in the sidebar to see the full performance comparison table. Sort by any column to identify top-performing and underperforming farms.',
        },
        {
          action: "Check sensor network health",
          detail:
            'Click "Sensor Network" in the sidebar to see online/offline/critical counts for every farm\'s sensor deployment. Farms with offline or critical sensors are shown first.',
        },
        {
          action: "Onboard a new farm",
          detail:
            'Click "Farm Onboarding" in the sidebar. Fill in the new farm\'s details and click "Create Farm Account" or "Send Invite Email" to get them started.',
        },
      ]}
      webTip="Bookmark the Admin Dashboard directly. Admin sessions persist for 14 days — you won't need to re-enter your credentials on every visit from the same device."
      mobileSteps={[
        {
          action: "Sign in via the Admin Login portal",
          detail:
            'Tap "Admin" on the login screen\'s role toggle. Enter your Admin ID, email, and password. Admins are redirected to the mobile Admin Dashboard after authentication.',
        },
        {
          action: "Review the system overview",
          detail:
            "The dashboard loads with platform-wide stat cards. Swipe horizontally through the stats strip to see total farms, birds, eggs, revenue, pending accounts, and active alerts.",
        },
        {
          action: "Approve pending accounts",
          detail:
            'If there are pending approvals, a warning banner appears at the top of the dashboard. Tap "Review" to open User Management. Tap "Approve" or "Reject" on each pending account.',
        },
        {
          action: "Manage users",
          detail:
            'In the drawer, tap "User Management". Use the search bar to find specific users. Tap the action buttons on any row to approve, suspend, or change roles.',
        },
        {
          action: "Monitor sensors across farms",
          detail:
            'Tap "Sensor Network" in the drawer for a card-based view of sensor status by farm. Critical farms are highlighted with red borders.',
        },
      ]}
      mobileTip="The mobile Admin Dashboard is designed for quick checks and approvals on the go. For detailed analysis and report review, the web dashboard on a larger screen is recommended."
      faqs={[
        {
          q: "Who can access Multi-Farm Control?",
          a: "Only users with the Admin role can access the Admin Dashboard and Multi-Farm Control features. Admin accounts must be registered via the Admin Registration page with a valid authorisation code, and must be approved by a super-administrator before they can sign in.",
        },
        {
          q: "Can admins see individual farmers' financial data?",
          a: "Admins can see aggregated farm-level revenue figures and platform-wide financial totals in the Financial Reports tab. Individual transaction details (specific income and expense records) are not visible to administrators — these remain private to the farmer who entered them.",
        },
        {
          q: "What is a super-administrator?",
          a: 'A super-administrator is an admin with the "Super Administrator" role assigned. They have the ability to approve other admin registration requests. The first super-admin account must be created by manually editing the Firestore database during initial platform setup.',
        },
        {
          q: "Can an admin remotely configure a farm's sensors?",
          a: "The current version of Multi-Farm Control shows sensor status and readings for all farms but does not support remote sensor configuration. Sensor threshold settings are configured by each farmer in their own dashboard. Remote sensor management is planned for a future release.",
        },
        {
          q: "What happens if I suspend a farmer account?",
          a: "Suspended farmers cannot sign in to the platform. Their data is preserved and can be restored by re-approving the account. Suspension does not delete any records and can be reversed at any time by the administrator.",
        },
      ]}
      ctaTitle={
        <>
          Take Control of
          <br />
          <em>Every Farm</em>
        </>
      }
      ctaDesc="If you're managing multiple farms or overseeing the POLTRIFARM platform, request an admin account today. Full platform visibility and control awaits — from one powerful dashboard."
    />
  );
}
