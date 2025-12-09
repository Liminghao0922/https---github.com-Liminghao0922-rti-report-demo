#!/usr/bin/env node

/**
 * Configuration Validation Script
 * Checks if all required environment variables are properly configured
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
};

function log(color, text) {
    console.log(`${colors[color]}${text}${colors.reset}`);
}

function validateEnv() {
    const envPath = path.join(__dirname, '.env');
    
    log('cyan', '\n========================================');
    log('cyan', '  Configuration Validation');
    log('cyan', '========================================\n');

    // Check if .env exists
    if (!fs.existsSync(envPath)) {
        log('red', '❌ .env file not found!');
        log('yellow', 'Please create a .env file based on .env.example');
        return false;
    }

    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    
    const config = {};
    lines.forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            const value = match[2].trim().replace(/^['"]|['"]$/g, '');
            config[key] = value;
        }
    });

    // Define required and optional configs
    const required = [
        { key: 'MSAL_CONFIG_CLIENT_ID', label: 'Azure AD Client ID', desc: 'Application (client) ID from Azure Portal' },
        { key: 'MSAL_CONFIG_CLIENT_AUTHORITY', label: 'Azure AD Authority', desc: 'Format: https://login.microsoftonline.com/[tenant-id]' },
        { key: 'POWERBI_REPORT_ID', label: 'Power BI Report ID', desc: 'Report ID from Power BI Service' },
        { key: 'POWERBI_EMBED_URL', label: 'Power BI Embed URL', desc: 'Embed URL from Power BI Service' },
    ];

    const optional = [
        { key: 'SESSION_SERVICE_URL', label: 'Omniverse Streaming URL', desc: 'Streaming server URL (optional)' },
        { key: 'EVENTHUB_RESOURCE_URL', label: 'EventHub Resource URL', desc: 'EventHub namespace (optional)' },
    ];

    let allValid = true;
    let requiredValid = true;

    log('blue', '📋 REQUIRED Configuration:\n');
    required.forEach(item => {
        const value = config[item.key] || '';
        const isEmpty = !value || value === '<client-id>' || value === '<tenant-id>' || value === '<reportid>';
        
        if (isEmpty) {
            log('red', `  ❌ ${item.label}`);
            log('yellow', `     └─ ${item.desc}`);
            log('yellow', `     └─ Current value: ${value || 'NOT SET'}`);
            requiredValid = false;
            allValid = false;
        } else {
            log('green', `  ✅ ${item.label}`);
        }
    });

    log('blue', '\n🔧 OPTIONAL Configuration:\n');
    optional.forEach(item => {
        const value = config[item.key] || '';
        const isEmpty = !value || value === '<ovestreamingurl>' || value === '<eventhubnamespace>.servicebus.windows.net';
        
        if (isEmpty) {
            log('yellow', `  ⚠️  ${item.label}`);
            log('yellow', `     └─ ${item.desc}`);
        } else {
            log('green', `  ✅ ${item.label}`);
        }
    });

    // Print summary
    log('cyan', '\n========================================');
    if (requiredValid) {
        log('green', '✅ All REQUIRED configurations are set!');
        log('green', '\nYou can now run: npm run dev');
    } else {
        log('red', '❌ Some REQUIRED configurations are missing!');
        log('yellow', '\nPlease update your .env file with:');
        required.forEach(item => {
            const value = config[item.key] || '';
            const isEmpty = !value || value.startsWith('<');
            if (isEmpty) {
                log('yellow', `  - ${item.key}`);
            }
        });
        log('yellow', '\nFor help, see AZURE_AD_LOGIN_SETUP.md');
    }
    log('cyan', '========================================\n');

    return requiredValid;
}

// Run validation
const isValid = validateEnv();
process.exit(isValid ? 0 : 1);
