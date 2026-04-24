import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'http://localhost:5173/preview';

async function debugSingle() {
    const browser = await puppeteer.launch({
        headless: 'new',
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        args: ['--no-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 2000 });

    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

    const templateId = 'alpine';
    const url = `${BASE_URL}/${templateId}?debug=true`;

    const data = {
        personal_info: { full_name: "James Anderson", profession: "Engineer" },
        sections: [
            { id: 'summary', type: 'summary', title: 'Summary', data: 'A long enough summary to pass the 100 character check. We need enough text to make sure the renderer has actually finished its job and is not just showing a blank page with a skeleton loader or something similar.' },
            { id: 'experience', type: 'experience', title: 'Work', data: [{ role: 'Lead', company: 'Tech', description: ['Line 1', 'Line 2'] }] }
        ],
        section_order: ['summary', 'experience'],
        formatting: { accentColor: '#3b82f6' }
    };

    console.log('1. Navigating...');
    await page.goto(url, { waitUntil: 'load' }); // Try 'load' instead of 'networkidle2'

    console.log('2. Injecting data...');
    await page.evaluate((d) => {
        sessionStorage.setItem('useEnhancedSampleData', 'custom');
        sessionStorage.setItem('customPreviewData', JSON.stringify(d));
    }, data);

    console.log('3. Reloading...');
    await page.reload({ waitUntil: 'load' });

    console.log('4. Waiting for .resume-page...');
    try {
        await page.waitForSelector('.resume-page', { timeout: 10000 });
        console.log('   .resume-page found.');
    } catch (e) {
        console.log('   .resume-page NOT found.');
        const html = await page.content();
        fs.writeFileSync('debug_missing.html', html);
    }

    console.log('5. Checking innerText...');
    const text = await page.evaluate(() => {
        const el = document.querySelector('.resume-page');
        return el ? el.innerText : 'MISSING';
    });
    console.log('   innerText length:', text.length);
    console.log('   innerText preview:', text.substring(0, 50));

    await browser.close();
}

debugSingle().catch(console.error);
