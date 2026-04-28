# Cyber Security Final Project - Frontend Bypass Demo

This is a demonstration of how purely frontend validation is insufficient for securing an application, as it can be easily bypassed using an HTTP proxy like **Burp Suite**.

## Setup Instructions

1. Make sure you have Node.js installed.
2. Open this directory in your terminal.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   node server.js
   ```
5. The application will be running at `http://localhost:3000/`.

## Demo Walkthrough

### Scenario 1: Expected Behavior (Validation Block)
1. Open up the web application in your browser (`http://localhost:3000`).
2. Type a message that exceeds the maximum length of 20 characters (e.g., `This is my extremely long message that I am trying to send.`).
3. Click **Send Message**.
4. Notice that the frontend application prevents the request from being sent and displays a "Validation Failed" alert.

### Scenario 2: The Attack (Bypassing Validation with Burp Suite)
1. Open **Burp Suite** and ensure its proxy is running (typically on `127.0.0.1:8080`).
2. Configure your browser to proxy traffic through Burp Suite, or use Burp's embedded Chromium browser.
3. In Burp Suite, ensure **Intercept is ON**.
4. In the web application, type a *valid* short message (e.g., `Short msg`).
5. Click **Send Message**. 
6. Because the text is `< 20` characters, the *frontend validation passes* and the request is sent over the network.
7. Switch to Burp Suite. You will see the intercepted `POST /api/message` request.
8. Locate the JSON body at the bottom of the request:
   ```json
   {"message":"Short msg"}
   ```
9. **Modify it!** Change the string to something extremely long, completely ignoring the 20-character limit:
   ```json
   {"message":"This is my extremely long message that has bypassed the frontend! I can send as much data as I want because the backend does not validate!"}
   ```
10. Click **Forward** in Burp Suite to release the modified request to the backend server.
11. Turn **Intercept OFF**.
12. Go back to your browser. You will see the **"Success!"** alert, and it will echo the massive string you injected. 

**Conclusion:** 
You have successfully demonstrated that frontend validation is only for UX, and strong validation must **always** occur on the backend server.

**Deployed Project**
https://burpsuitdemo-1.onrender.com
