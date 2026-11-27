// Screenshot capture script
import puppeteer from '/workspace/mf/tools/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js';

const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium',
    args: ['--no-sandbox', '--disable-gpu']
});

const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 720 });

try {
    // Screenshot 1: Title screen
    console.log('Capturing title screenshot...');
    await page.goto('http://localhost:8080?shot=title', { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 1000));
    await page.screenshot({ path: '/workspace/project/turkey-escape/screenshots/1-title.png' });
    console.log('✓ 1-title.png saved');
    
    // Screenshot 2: Chase scene
    console.log('Capturing chase screenshot...');
    await page.goto('http://localhost:8080?shot=chase', { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 1000));
    await page.screenshot({ path: '/workspace/project/turkey-escape/screenshots/2-chase.png' });
    console.log('✓ 2-chase.png saved');
    
    // Screenshot 3: Kitchen scene
    console.log('Capturing kitchen screenshot...');
    await page.goto('http://localhost:8080?shot=kitchen', { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 1000));
    await page.screenshot({ path: '/workspace/project/turkey-escape/screenshots/3-kitchen.png' });
    console.log('✓ 3-kitchen.png saved');
    
    // Screenshot 4: Caught screen
    console.log('Capturing caught screenshot...');
    await page.goto('http://localhost:8080?shot=caught', { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 1000));
    await page.screenshot({ path: '/workspace/project/turkey-escape/screenshots/4-caught.png' });
    console.log('✓ 4-caught.png saved');
    
    console.log('\n✓ All screenshots captured!');
    
} catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
} finally {
    await browser.close();
}