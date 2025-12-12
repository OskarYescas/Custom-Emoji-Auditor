# Implementation Guide: Custom Emoji Auditor

This guide outlines the steps to deploy the **Custom Emoji Auditor**, a tool that integrates Google Cloud Platform (GCP) and Google Apps Script to audit and list custom emojis within a Google Workspace environment.

> [!IMPORTANT]
>**IMPORTANT DISCLAIMER**: This solution offers a recommended approach that is not exhaustive and is not intended as a final enterprise-ready solution. Customers should consult their Dev, security, and networking teams before deployment.

## Description
The Custom Emoji Auditor is a solution designed to fetch, audit, and preview custom emojis used in Google Chat. By leveraging a standard GCP project to access the Google Chat API, this tool bypasses default Apps Script limitations and generates a visual report directly in Google Sheets.

## Prerequisites
* **Google Workspace Admin Access:** You must be a Super Admin or possess specific privileges to access the **Admin SDK (Reports)** and **Chat** configurations.
* **GCP Access:** You must have the ability to create and edit projects within the Google Cloud Console.

## Deployment Guide

### Phase 1: Google Cloud Platform (GCP) Configuration
*Note: The default "Apps Script" project cannot be used because the Google Chat API requires a standard GCP project.*

1. **Create a New Project:**
   * Navigate to the Google Cloud Console.
   * Click the project dropdown and select **New Project**.
   * Name the project: `Workspace-Emoji-Audit`.
   * Click **Create**.
   * **Important:** Copy the **Project Number** displayed on the Dashboard welcome screen (e.g., `123456789012`). You will need this for Phase 3.

2. **Enable Required APIs:**
   * Search for **"Google Chat API"**, select it, and click **Enable**.
   * Search for **"Admin SDK API"**, select it, and click **Enable**.

3. **Configure OAuth Consent Screen (Internal):**
   * Go to **APIs & Services > OAuth consent screen**.
   * Select **Internal** (restricts use to users in your org) and click **Create**.
   * **App Name:** `Emoji Auditor`.
   * **User Support Email:** Select your email.
   * **Developer Contact Info:** Enter your email.
   * Click **Save and Continue**.

### Phase 2: Google Sheet & Script Initialization
1. **Create the Spreadsheet:**
   * Go to `sheets.new` to create a blank Google Sheet.
   * Name the file: `Custom Emoji Audit Tool`.

2. **Open the Script Editor:**
   * In the top menu, navigate to **Extensions > Apps Script**.
   * Rename the project to: `Emoji Audit Script`.

### Phase 3: Connecting GCP to Apps Script
This step bridges the script to the Chat API enabled in Phase 1.

1. In the Apps Script editor, click **Project Settings** (gear icon ⚙️) on the sidebar.
2. Scroll to the **Google Cloud Platform (GCP) Project** section.
3. Click **Change project**.
4. Paste the **Project Number** (saved from Phase 1) into the field.
5. Click **Set project**.

### Phase 4: Manifest & Permissions
You must manually declare the script's permissions via the manifest file.

1. In **Project Settings** (⚙️), check the box **"Show 'appsscript.json' manifest file in editor"**.
2. Return to the **Editor** (< >).
3. Open `appsscript.json`.
4. Delete the existing content and paste the configuration provided in the repository.
5. Click **Save** (💾).

### Phase 5: Code Implementation
1. Open `Code.gs` in the file list.
2. Delete all existing content.
3. Paste the final, optimized code from the repository.
4. Click **Save** (💾).

### Phase 6: First Run & Authorization
1. **Reload the Google Sheet:** Refresh the browser tab containing the spreadsheet (F5).
2. **Locate the Menu:** Wait for the custom menu **Emoji Tools** to appear to the right of "Help".
3. **Run:** Click **Emoji Tools > Run Audit Report**.
4. **Authorize:**
   * Click **Continue** on the popup.
   * Select your account.
   * *Note:* If you see "Google hasn't verified this app" (expected for internal scripts), click **Advanced > Go to Emoji Audit Script (unsafe)**.
   * Review the permissions (Admin Reports, Chat, Sheets, External Request) and click **Allow**.

## Use Case
Once deployed, the tool performs the following actions:
* Runs the script upon manual trigger.
* Creates a new tab titled **"Emoji Audit Report"**.
* Fetches data from the Google Chat API.
* Displays a formatted table complete with image previews of the custom emojis.