import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`file:///C:/Users/lhaki/OneDrive/Dokumen/My%20WhatsApp/(18241)%20Discord%20_%20%23goldberg-faucet%20_%20Avail.html`);

  const combinedClassDivs = await page.$$(`div[class*="repliedMessage_"][class*="executedCommand_"]`);
  const spanElements = await combinedClassDivs[0].$$('span');
  const spanText = await page.evaluate(span => span.textContent, spanElements[0]);
  console.log(spanText)
  if (spanText === 'FUJINUMA SATORU') {
    const parentElementHandle = await page.evaluateHandle(element => element.parentNode, combinedClassDivs[0]);
    const parentElement = await parentElementHandle.executionContext().evaluate(node => node.outerHTML, parentElementHandle);
    console.log('Parent element:', parentElement);

    // Periksa apakah parentElement mengandung teks "Status" dan "Sending"
    if (parentElement.includes('Status') && parentElement.includes('Sending')) {
      console.log('parentElement contains "Status" and "Sending"');

    } else {
      console.log('parentElement does not contain "Status" and "Sending"');

    }

    const htmlString = `<div class="message__80c10 cozyMessage__64ce7 ephemeral_c26b64 groupStart__56db5 wrapper__09ecc cozy_f5c119 zalgo__39311"
  role="article" data-list-item-id="chat-messages___chat-messages-1171414018028740698-1219422601584312440"
  tabindex="-1" aria-setsize="-1" aria-roledescription="Message"
  aria-labelledby="message-username-1219422601584312440 uid_1 message-content-1219422601584312440 uid_2 message-timestamp-1219422601584312440">
  <div class="repliedMessage_e2bf4a executedCommand_e8859a" aria-hidden="true"><img alt=""
          src="https://cdn.discordapp.com/avatars/750677739241078866/95e04e133a252aae39223c4ebb74df61.webp?size=20"
          class="executedCommandAvatar__939bc clickable_d866f1"><span
          class="username_d30d99 desaturateUserColors_b72bd3 clickable_d866f1" aria-expanded="false" role="button"
          tabindex="0" style="color: rgb(216, 248, 203);">FUJINUMA SATORU</span> used <span class=""
          aria-expanded="false" role="button" tabindex="0">
          <div class="commandName_a0875b clickable_d866f1">/deposit</div>
      </span></div>
  <div class="contents_f41bb2"><img src="/assets/529459de1dc4c2424a03.png" aria-hidden="true"
          class="avatar__08316 clickable_d866f1" alt=" ">
      <h3 class="header__39b23"
          aria-labelledby="message-username-1219422601584312440 message-timestamp-1219422601584312440"><span
              id="message-username-1219422601584312440" class="headerText_f47574 hasBadges_aef1e9"><span
                  class="username_d30d99 desaturateUserColors_b72bd3 clickable_d866f1" aria-expanded="false"
                  role="button" tabindex="0" style="color: rgb(157, 28, 253);">goldberg faucet</span><span
                  class="botTagCozy_dd88d1 botTag__11e95 botTagRegular_c89c9a botTag__4211a rem__931aa"><span
                      class="botText__19848">BOT</span></span></span><span
              class="timestamp_cdbd93 timestampInline__470e0"><time aria-label="Today at 6:10 AM"
                  id="message-timestamp-1219422601584312440" datetime="2024-03-18T23:10:03.994Z"><i
                      class="separator__3f416" aria-hidden="true"> — </i>Today at 6:10 AM</time></span></h3>
      <div id="message-content-1219422601584312440" class="markup_a7e664 messageContent__21e69"><span>Please wait 27
              more minutes</span><span>(s</span><span>) before reusing the command</span><span>.</span></div>
  </div>
  <div id="message-accessories-1219422601584312440" class="container_dbadf5">
      <div class="ephemeralMessage__6a8ba"><svg class="icon__35752" aria-hidden="true" role="img"
              xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path fill="currentColor"
                  d="M15.56 11.77c.2-.1.44.02.44.23a4 4 0 1 1-4-4c.21 0 .33.25.23.44a2.5 2.5 0 0 0 3.32 3.32Z"
                  class=""></path>
              <path fill="currentColor" fill-rule="evenodd"
                  d="M22.89 11.7c.07.2.07.4 0 .6C22.27 13.9 19.1 21 12 21c-7.11 0-10.27-7.11-10.89-8.7a.83.83 0 0 1 0-.6C1.73 10.1 4.9 3 12 3c7.11 0 10.27 7.11 10.89 8.7Zm-4.5-3.62A15.11 15.11 0 0 1 20.85 12c-.38.88-1.18 2.47-2.46 3.92C16.87 17.62 14.8 19 12 19c-2.8 0-4.87-1.38-6.39-3.08A15.11 15.11 0 0 1 3.15 12c.38-.88 1.18-2.47 2.46-3.92C7.13 6.38 9.2 5 12 5c2.8 0 4.87 1.38 6.39 3.08Z"
                  clip-rule="evenodd" class=""></path>
          </svg>Only you can see this • <a class="anchor_c8ddc0 anchorUnderlineOnHover__78236" role="button"
              tabindex="0">Dismiss message</a></div>
  </div>
</div>`

    const regex = /Please wait\s+(\d+)\s+more\s+minutes/;
    const match = htmlString.match(regex);
    if (match) {
      const numberValue = match[1];
      console.log(numberValue); // Output: 27
    } else {
      console.log("No match found");
    }

  }
  await browser.close();
})();
