export function initServAI(){

  const root = document.getElementById('sv10');
  if(!root) return;

  const $ = (s, ctx=root) => ctx.querySelector(s);
  const $$ = (s, ctx=root) => Array.from(ctx.querySelectorAll(s));

  // Robust mobile-only Unicode/emoji sanitiser.
  // This also reacts when the viewport changes after load.
  const sv10MobileMQ = window.matchMedia
    ? window.matchMedia('(max-width:560px)')
    : {matches:false};

  function sv10IsMobile(){
    return !!sv10MobileMQ.matches;
  }

  function sv10CleanMobileText(value){
    if(!sv10IsMobile() || typeof value !== 'string') return value;

    return value
      .replace(/↔/g,' to ')
      .replace(/✦/g,'AI')
      .replace(/👌/gu,'')
      .replace(/[✓✔✅☑]/gu,'')
      .replace(/[↗→↑➡]/gu,'')
      .replace(/[\uFE0E\uFE0F]/gu,'')
      .replace(/[\u{1F000}-\u{1FAFF}]/gu,'')
      .replace(/[\u{2600}-\u{26FF}]/gu,'')
      .replace(/[\u{2700}-\u{27BF}]/gu,'')
      .replace(/\s{2,}/g,' ')
      .replace(/\s+([,.;:!?])/g,'$1')
      .trim();
  }

  function sv10CleanMobileHTML(value){
    if(!sv10IsMobile() || typeof value !== 'string') return value;

    return value
      .replace(/↔/g,' to ')
      .replace(/✦/g,'AI')
      .replace(/👌/gu,'')
      .replace(/[✓✔✅☑]/gu,'')
      .replace(/[↗→↑➡]/gu,'')
      .replace(/[\uFE0E\uFE0F]/gu,'')
      .replace(/[\u{1F000}-\u{1FAFF}]/gu,'')
      .replace(/[\u{2600}-\u{26FF}]/gu,'')
      .replace(/[\u{2700}-\u{27BF}]/gu,'');
  }

  function sv10SanitiseTextNode(node){
    if(!sv10IsMobile() || !node || node.nodeType !== Node.TEXT_NODE) return;
    const cleaned=sv10CleanMobileText(node.nodeValue || '');
    if(cleaned !== node.nodeValue) node.nodeValue=cleaned;
  }

  function sv10SanitiseTree(node){
    if(!sv10IsMobile() || !node) return;

    if(node.nodeType===Node.TEXT_NODE){
      sv10SanitiseTextNode(node);
      return;
    }

    if(node.nodeType!==Node.ELEMENT_NODE) return;

    const walker=document.createTreeWalker(node,NodeFilter.SHOW_TEXT);
    let current;
    while((current=walker.nextNode())){
      sv10SanitiseTextNode(current);
    }
  }

  function sv10ApplyMobileNoEmoji(){
    if(!sv10IsMobile()) return;
    sv10SanitiseTree(root);
  }

  // Always observe dynamic UI. V14 only started this observer if the page
  // initially loaded under 560px, which can fail after responsive viewport changes.
  const sv10EmojiObserver=new MutationObserver(mutations=>{
    if(!sv10IsMobile()) return;

    mutations.forEach(mutation=>{
      mutation.addedNodes.forEach(node=>sv10SanitiseTree(node));
      if(mutation.type==='characterData'){
        sv10SanitiseTextNode(mutation.target);
      }
    });
  });

  sv10EmojiObserver.observe(root,{
    childList:true,
    subtree:true,
    characterData:true
  });

  sv10ApplyMobileNoEmoji();

  if(typeof sv10MobileMQ.addEventListener==='function'){
    sv10MobileMQ.addEventListener('change',event=>{
      if(event.matches){
        requestAnimationFrame(()=>{
          sv10ApplyMobileNoEmoji();
          setTimeout(sv10ApplyMobileNoEmoji,80);
          setTimeout(sv10ApplyMobileNoEmoji,350);
        });
      }
    });
  }else if(typeof sv10MobileMQ.addListener==='function'){
    sv10MobileMQ.addListener(event=>{
      if(event.matches) setTimeout(sv10ApplyMobileNoEmoji,0);
    });
  }

  let sv10ResizeTimer;
  window.addEventListener('resize',()=>{
    clearTimeout(sv10ResizeTimer);
    sv10ResizeTimer=setTimeout(()=>{
      if(sv10IsMobile()) sv10ApplyMobileNoEmoji();
      sv10QueueLanguageLayoutStabilise();
    },100);
  },{passive:true});

  if(typeof sv10MobileMQ.addEventListener==='function'){
    sv10MobileMQ.addEventListener('change',()=>{
      sv10QueueLanguageLayoutStabilise();
    });
  }else if(typeof sv10MobileMQ.addListener==='function'){
    sv10MobileMQ.addListener(()=>{
      sv10QueueLanguageLayoutStabilise();
    });
  }

  // Smooth anchors
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = $(a.getAttribute('href'));
      if(target){
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth',block:'start'});
        $('.sv10-nav')?.classList.remove('is-open');
      }
    });
  });

  // Header + mobile menu
  const header = $('.sv10-header');
  const menuBtn = $('.sv10-menu-toggle');
  const nav = $('.sv10-nav');

  menuBtn?.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // Reveals
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const delay = Number(entry.target.dataset.delay || 0);
        setTimeout(() => entry.target.classList.add('is-visible'), delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, {threshold:.08, rootMargin:'0px 0px -7% 0px'});
  $$('.sv10-reveal').forEach(el => revealObserver.observe(el));

  // Nav active state
  const navMap = {
    how:'#sv10-how',
    platform:'#sv10-intelligence',
    merchant:'#sv10-merchant',
    data:'#sv10-data',
    scale:'#sv10-scale'
  };
  const navLinks = $$('.sv10-nav a');
  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const id = entry.target.dataset.nav;
        navLinks.forEach(a => {
          const href = a.getAttribute('href');
          a.classList.toggle('is-active', href === navMap[id]);
        });
      }
    });
  }, {rootMargin:'-30% 0px -55% 0px', threshold:0});
  $$('[data-nav]').forEach(sec => navObserver.observe(sec));
  // Hero product — three autoplay conversation scenarios
  const heroChat = $('#sv10-hero-chat');
  const orbitPref = $('#sv10-orbit-pref strong');
  const orbitLoyalty = $('#sv10-orbit-loyalty strong');
  const orbitKitchen = $('#sv10-orbit-kitchen strong');
  const orbitChannel = $('#sv10-orbit-channel strong');
  const orbitPayment = $('#sv10-orbit-payment strong');
  const heroScenarioButtons = $$('.sv10-hero-scenarios button');

  const heroScenarios = [
    {
      name:'Dietary discovery',
      prefStart:'Recognising…',
      loyaltyStart:'Checking profile…',
      kitchenStart:'Standing by',
      channelStart:'WhatsApp / Messenger',
      paymentStart:'Digital pay ready',
      prefDone:'No nuts recognised',
      loyaltyDone:'Gold member · 320 pts',
      kitchenDone:'Order received ✓',
      channelDone:'Conversation active',
      paymentDone:'Apple Pay ready',
      total:'$31.40',
      messages:[
        {type:'ai',text:'Welcome back, Alex. What sounds good tonight?'},
        {type:'user',text:'Something vegetarian, a little spicy, and no nuts.'},
        {type:'ai',text:'The chilli mushroom linguine would be perfect. I can make it nut free.'}
      ],
      food:{
        image:'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=700&q=86',
        title:'Chilli Mushroom Linguine',
        meta:'Vegetarian · Nut free option',
        price:'$24.50'
      },
      confirm:'Yes please 👌'
    },
    {
      name:'Returning guest',
      prefStart:'Loading favourites…',
      loyaltyStart:'Recognising guest…',
      kitchenStart:'Standing by',
      channelStart:'Returning session',
      paymentStart:'One-tap checkout',
      prefDone:'Favourite remembered',
      loyaltyDone:'12 visits · Gold',
      kitchenDone:'Reorder received ✓',
      channelDone:'Profile recognised',
      paymentDone:'Checkout ready',
      total:'$28.90',
      messages:[
        {type:'ai',text:'Welcome back, Alex. Want your usual or something different?'},
        {type:'user',text:'My usual sounds perfect. Can you add sparkling water?'},
        {type:'ai',text:'Absolutely. Your usual fish tacos plus sparkling water is ready to confirm.'}
      ],
      food:{
        image:'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=700&q=86',
        title:'Fish Tacos + Sparkling Water',
        meta:'Favourite order · Preference remembered',
        price:'$28.90'
      },
      confirm:'Same again ✓'
    },
    {
      name:'Multilingual guest',
      prefStart:'Language detected…',
      loyaltyStart:'Guest profile…',
      kitchenStart:'Translation ready',
      channelStart:'Language detected',
      paymentStart:'Digital pay ready',
      prefDone:'Español detected',
      loyaltyDone:'New guest',
      kitchenDone:'English order received ✓',
      channelDone:'Español ↔ English',
      paymentDone:'Checkout ready',
      total:'$32.90',
      messages:[
        {type:'ai',text:'¡Bienvenido! ¿Qué te gustaría pedir esta noche?'},
        {type:'user',text:'¿Qué me recomienda si quiero algo ligero?'},
        {type:'ai',text:'El barramundi es una excelente opción. Puedo sugerir una ensalada ligera para acompañar.'}
      ],
      food:{
        image:'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=700&q=86',
        title:'Barramundi + Citrus Salad',
        meta:'Guest sees Spanish · Venue receives English',
        price:'$32.90'
      },
      confirm:'Perfecto, gracias'
    }
  ];

  let heroScenarioIndex = 0;
  let heroTimers = [];
  let heroScenarioLoop = null;
  let heroScenarioPaused = false;

  function clearHeroTimers(){
    heroTimers.forEach(t=>clearTimeout(t));
    heroTimers=[];
  }
  function heroLater(fn,ms){heroTimers.push(setTimeout(fn,ms));}
  function addHeroHTML(html){heroChat.insertAdjacentHTML('beforeend',html);}
  function heroTyping(){addHeroHTML('<div class="sv10-chat-typing"><i></i><i></i><i></i></div>');}
  function clearTyping(){heroChat.querySelector('.sv10-chat-typing:last-child')?.remove();}

  function setHeroScenarioButton(index){
    heroScenarioButtons.forEach((b,i)=>b.classList.toggle('is-active',i===index));
  }

  function runHeroScenario(index){
    if(!heroChat) return;
    clearHeroTimers();
    heroScenarioIndex=index;
    setHeroScenarioButton(index);
    const s=heroScenarios[index];

    heroChat.innerHTML='';
    orbitPref.textContent=sv10CleanMobileText(s.prefStart);
    orbitLoyalty.textContent=sv10CleanMobileText(s.loyaltyStart);
    orbitKitchen.textContent=sv10CleanMobileText(s.kitchenStart);
    orbitChannel.textContent=sv10CleanMobileText(s.channelStart);
    orbitPayment.textContent=sv10CleanMobileText(s.paymentStart);

    heroTyping();
    heroLater(()=>{
      clearTyping();
      addHeroHTML(`<div class="sv10-chat-message ai">${sv10CleanMobileText(s.messages[0].text)}</div>`);
    },800);

    heroLater(()=>{
      addHeroHTML(`<div class="sv10-chat-message user">${sv10CleanMobileText(s.messages[1].text)}</div>`);
      orbitPref.textContent=sv10CleanMobileText(s.prefDone);
    },2400);

    heroLater(()=>heroTyping(),3200);

    heroLater(()=>{
      clearTyping();
      addHeroHTML(`<div class="sv10-chat-message ai">${sv10CleanMobileText(s.messages[2].text)}</div>`);
      orbitLoyalty.textContent=sv10CleanMobileText(s.loyaltyDone);
      orbitChannel.textContent=sv10CleanMobileText(s.channelDone);
    },4100);

    heroLater(()=>{
      addHeroHTML(`<div class="sv10-chat-food">
        <img src="${s.food.image}" alt="">
        <div><strong>${s.food.title}</strong><small>${s.food.meta}</small><div class="row"><b>${s.food.price}</b><button type="button">Add</button></div></div>
      </div>`);
    },5400);

    heroLater(()=>{
      addHeroHTML(`<div class="sv10-chat-message user">${sv10CleanMobileText(s.confirm)}</div>`);
    },6500);

    heroLater(()=>{
      addHeroHTML(`<div class="sv10-chat-pay"><div><small>TOTAL</small><strong>${s.total}</strong></div><button type="button" aria-label="Apple Pay" title="Apple Pay"><i class="fa-brands fa-apple-pay" aria-hidden="true"></i></button></div>`);
    },7500);

    heroLater(()=>{
      addHeroHTML(`<div class="sv10-chat-confirm">${sv10CleanMobileText('Order confirmed ✓')}</div>`);
      orbitKitchen.textContent=sv10CleanMobileText(s.kitchenDone);
      orbitPayment.textContent=sv10CleanMobileText(s.paymentDone);
      sv10ApplyMobileNoEmoji();
    },8600);
  }

  function restartHeroScenarioLoop(){
    clearInterval(heroScenarioLoop);
    if(heroScenarioPaused) return;
    heroScenarioLoop=setInterval(()=>{
      const next=(heroScenarioIndex+1)%heroScenarios.length;
      runHeroScenario(next);
    },12500);
  }

  heroScenarioButtons.forEach((btn,i)=>{
    btn.addEventListener('click',()=>{
      runHeroScenario(i);
      restartHeroScenarioLoop();
    });
  });

  const heroStage=$('.sv10-hero-stage');
  heroStage?.addEventListener('mouseenter',()=>{
    heroScenarioPaused=true;
    clearInterval(heroScenarioLoop);
  });
  heroStage?.addEventListener('mouseleave',()=>{
    heroScenarioPaused=false;
    restartHeroScenarioLoop();
  });

  runHeroScenario(0);
  restartHeroScenarioLoop();

  // How it works product stage
  const stepData = [
    {
      kicker:'STEP 1 OF 6', title:'Tap or Scan', sub:'The ordering experience starts at the table.',
      html:'<div class="sv10-qr-real"></div><div style="text-align:center;font-size:10px;color:#77807c;margin-top:15px">TABLE 12 · TAP OR SCAN TO BEGIN</div>'
    },
    {
      kicker:'STEP 2 OF 6', title:'Chat Opens', sub:'A familiar conversation interface opens.',
      html:'<div class="sv10-stage-chat"><div>Welcome to The Grand Bistro. What can I get started?</div><div>What do you recommend tonight?</div><div>The barramundi and mushroom linguine are both popular.</div></div>'
    },
    {
      kicker:'STEP 3 OF 6', title:'Conversational Ordering', sub:'Ask questions, discover dishes and make changes.',
      html:`<div class="sv10-stage-food"><img src="https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=700&q=86"><div><strong>Chilli Mushroom Linguine</strong><small>Vegetarian · Can be made nut free</small><div style="display:flex;gap:6px;margin-top:10px"><span style="font-size:7px;padding:5px 7px;border-radius:999px;background:#edf1e9">No nuts</span><span style="font-size:7px;padding:5px 7px;border-radius:999px;background:#f7e7df">Spicy</span></div></div></div>`
    },
    {
      kicker:'STEP 4 OF 6', title:'Pay Instantly', sub:'Move from decision to checkout without another journey.',
      html:'<div class="sv10-stage-pay"><small>YOUR TOTAL</small><strong>$31.40</strong><button type="button" aria-label="Apple Pay" title="Apple Pay"><i class="fa-brands fa-apple-pay" aria-hidden="true"></i></button><div style="font-size:8px;color:#8d9692;margin-top:11px">Google Pay · supported payment methods</div></div>'
    },
    {
      kicker:'STEP 5 OF 6', title:'Order Received', sub:'The venue sees the order in the merchant environment.',
      html:'<div class="sv10-stage-order"><div><small>NEW ORDER · TABLE 12</small><strong>Chilli Mushroom Linguine · $24.50</strong></div><div><small>MODIFIERS</small><strong>Nut free · Mild spice</strong></div><div><small>STATUS</small><strong style="color:#9ebc8f">Received ✓</strong></div></div>'
    },
    {
      kicker:'STEP 6 OF 6', title:'Relationship Continues', sub:'Preferences and loyalty can carry into the next visit.',
      html:'<div class="sv10-stage-loyalty"><div class="avatar">AM</div><strong>Welcome back, Alex</strong><span>Gold Member · 12 visits</span><b>+25 pts</b><span>No nuts · Likes spicy</span></div>'
    }
  ];
  const deviceStage = $('#sv10-device-stage');
  const stepButtons = $$('.sv10-step');
  const autoplay = $('#sv10-autoplay');
  let currentStep=0, autoPlaying=true, stepTimer;

  function renderStep(i){
    currentStep=i;
    const d=stepData[i];
    const stageHTML = sv10IsMobile() ? sv10CleanMobileHTML(d.html) : d.html;
    deviceStage.innerHTML=`<div class="sv10-stage-wrap"><div class="sv10-stage-kicker">${d.kicker}</div><h3 class="sv10-stage-title">${d.title}</h3><p class="sv10-stage-sub">${d.sub}</p>${stageHTML}</div>`;
    sv10ApplyMobileNoEmoji();
    stepButtons.forEach((b,idx)=>b.classList.toggle('is-active',idx===i));
  }
  function restartSteps(){
    clearInterval(stepTimer);
    if(autoPlaying) stepTimer=setInterval(()=>renderStep((currentStep+1)%stepData.length),3900);
  }
  stepButtons.forEach(b=>b.addEventListener('click',()=>{renderStep(Number(b.dataset.step));restartSteps();}));
  autoplay?.addEventListener('click',()=>{autoPlaying=!autoPlaying;autoplay.textContent=autoPlaying?'Pause auto-play':'Resume auto-play';restartSteps();});
  renderStep(0); restartSteps();

  // Merchant Dashboard and Data Explorer now use client-supplied actual product interfaces.

  // Language demo — slower autoplay with two-sided translation logic
  const languageData={
    en:{
      name:'English',
      q:'What would you recommend tonight?',
      a:"The barramundi is one of tonight's favourites. Would you like a lighter or richer side?",
      venueQ:'Guest: What would you recommend tonight?',
      venueA:'ServAI: Recommend the barramundi and ask whether the guest prefers a lighter or richer side.',
      intent:'Recommendation request',
      detail:'No dietary preference detected.'
    },
    zh:{
      name:'中文',
      q:'我不吃坚果。今晚你有什么推荐？',
      a:'今晚的澳洲肺鱼很受欢迎。我会标记不含坚果的偏好，并推荐一份清淡的配菜。',
      venueQ:'Translated guest: I do not eat nuts. What would you recommend tonight?',
      venueA:'ServAI: Recommend the barramundi, preserve the no-nuts preference and offer a light side.',
      intent:'Recommendation + dietary preference',
      detail:'No-nuts preference detected and surfaced to the venue.'
    },
    es:{
      name:'Español',
      q:'Quiero algo ligero y un poco picante. ¿Qué me recomienda?',
      a:'Le recomiendo el barramundi con ensalada cítrica. Puedo añadir un toque de picante.',
      venueQ:'Translated guest: I want something light and a little spicy. What do you recommend?',
      venueA:'ServAI: Suggest barramundi with citrus salad and record the preference for light + mildly spicy.',
      intent:'Taste + recommendation request',
      detail:'Guest prefers something light with a little spice.'
    },
    fr:{
      name:'Français',
      q:'Je suis végétarien. Que me conseillez-vous ce soir ?',
      a:'Les linguine aux champignons sont un excellent choix végétarien. Je peux aussi vous proposer une salade légère.',
      venueQ:'Translated guest: I am vegetarian. What would you recommend tonight?',
      venueA:'ServAI: Recommend mushroom linguine and offer a lighter vegetarian alternative.',
      intent:'Vegetarian recommendation',
      detail:'Vegetarian preference detected and retained in context.'
    }
  };

  const langOrder=['en','zh','es','fr'];
  const qEl=$('#sv10-customer-question');
  const aEl=$('#sv10-customer-answer');
  const venueQ=$('#sv10-venue-question');
  const venueA=$('#sv10-venue-answer');
  const venueIntent=$('#sv10-venue-intent');
  const venueIntentTitle=$('#sv10-venue-intent-title');
  const venueIntentDetail=$('#sv10-venue-intent-detail');
  const translationStatus=$('#sv10-translation-status');
  const langName=$('#sv10-lang-name');
  const langDemo=$('#sv10-language-demo');
  const langProgress=$('#sv10-lang-progress');
  const langAuto=$('#sv10-lang-autoplay');
  const reduceMotion=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const langDuration=9200;
  let langIndex=0;
  let langTimer=null;
  let langPaused=false;
  let typingTimers=[];

  const languageCustomerColumn = langDemo?.querySelector(
    '.sv10-language-column:not(.sv10-language-column--venue)'
  );
  const languageVenueColumn = langDemo?.querySelector(
    '.sv10-language-column--venue'
  );

  let languageLayoutResizeTimer = null;

  function clearStableLanguageHeights(){
    languageCustomerColumn?.style.removeProperty('min-height');
    languageVenueColumn?.style.removeProperty('min-height');
    langDemo?.style.removeProperty('min-height');
  }

  function sv10MeasureLanguageColumn(column,width,fill){
    if(!column || !root) return 0;

    const clone=column.cloneNode(true);
    clone.removeAttribute('id');
    clone.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));
    clone.classList.remove('sv10-reveal','show');
    clone.style.cssText=[
      'position:absolute',
      'left:-100000px',
      'top:0',
      'visibility:hidden',
      'pointer-events:none',
      'transform:none',
      'transition:none',
      'animation:none',
      `width:${width}px`,
      'height:auto',
      'min-height:0',
      'max-height:none',
      'box-sizing:border-box',
      'overflow:visible',
      'opacity:1',
      'display:block'
    ].join(';');

    clone.querySelectorAll('*').forEach(el=>{
      el.style.animation='none';
      el.style.transition='none';
    });

    fill(clone);
    root.appendChild(clone);
    const measured=Math.ceil(clone.scrollHeight);
    clone.remove();
    return measured;
  }

  function sv10StabiliseLanguageLayout(){
    if(!langDemo || !languageCustomerColumn || !languageVenueColumn) return;

    if(!sv10IsMobile()){
      clearStableLanguageHeights();
      return;
    }

    const rect=langDemo.getBoundingClientRect();
    const width=Math.max(260,Math.floor(rect.width));
    if(!width) return;

    let maxCustomer=0;
    let maxVenue=0;

    langOrder.forEach(code=>{
      const d=languageData[code];

      const customerHeight=sv10MeasureLanguageColumn(
        languageCustomerColumn,
        width,
        clone=>{
          const bubbles=clone.querySelectorAll('.sv10-lang-bubble');
          if(bubbles[0]){
            bubbles[0].classList.remove('is-typing');
            bubbles[0].textContent=d.q;
          }
          if(bubbles[1]){
            bubbles[1].classList.remove('is-typing');
            bubbles[1].textContent=d.a;
          }
        }
      );

      const venueHeight=sv10MeasureLanguageColumn(
        languageVenueColumn,
        width,
        clone=>{
          const question=clone.querySelector('.sv10-lang-bubble--venue');
          const answer=clone.querySelector('.sv10-lang-bubble--venue-answer');
          const intentTitle=clone.querySelector('.sv10-venue-intent strong');
          const intentDetail=clone.querySelector('.sv10-venue-intent span');
          const status=clone.querySelector('.sv10-translation-live b');
          const metaStrong=clone.querySelector('.sv10-lang-meta strong');

          if(question){
            question.classList.remove('is-typing');
            question.textContent=d.venueQ;
          }
          if(answer){
            answer.classList.remove('is-typing');
            answer.textContent=d.venueA;
          }
          if(intentTitle) intentTitle.textContent=d.intent;
          if(intentDetail) intentDetail.textContent=d.detail;
          if(status) status.textContent='Translation synced';
          if(metaStrong) metaStrong.textContent=d.name;
        }
      );

      maxCustomer=Math.max(maxCustomer,customerHeight);
      maxVenue=Math.max(maxVenue,venueHeight);
    });

    // Small breathing room prevents sub-pixel/font rendering differences
    // from causing a one-line overflow on real devices.
    const customerReserved=Math.max(350,maxCustomer+8);
    const venueReserved=Math.max(520,maxVenue+8);

    languageCustomerColumn.style.minHeight=`${customerReserved}px`;
    languageVenueColumn.style.minHeight=`${venueReserved}px`;

    // Reserve the complete demo footprint as well. This guarantees that the
    // following Scale / Business Case / Trust / Demo sections never move.
    const arrow=langDemo.querySelector('.sv10-language-arrow');
    const arrowHeight=arrow ? Math.ceil(arrow.getBoundingClientRect().height) : 42;
    const demoStyles=getComputedStyle(langDemo);
    const rowGap=parseFloat(demoStyles.rowGap || demoStyles.gap || '16') || 16;
    const reservedDemo=customerReserved+venueReserved+arrowHeight+(rowGap*2);
    langDemo.style.minHeight=`${Math.ceil(reservedDemo)}px`;
  }

  function sv10QueueLanguageLayoutStabilise(){
    clearTimeout(languageLayoutResizeTimer);
    languageLayoutResizeTimer=setTimeout(()=>{
      requestAnimationFrame(sv10StabiliseLanguageLayout);
    },80);
  }

  function clearTypingTimers(){
    typingTimers.forEach(t=>clearTimeout(t));
    typingTimers=[];
  }

  function laterTyping(fn,ms){
    typingTimers.push(setTimeout(fn,ms));
  }

  function typeInto(el,text,speed=30){
    return new Promise(resolve=>{
      if(reduceMotion){
        el.textContent=text;
        resolve();
        return;
      }

      el.classList.remove('is-typing');
      el.innerHTML='';
      let i=0;
      const cursor=document.createElement('span');
      cursor.className='sv10-lang-cursor';

      function tick(){
        el.textContent=text.slice(0,i);
        el.appendChild(cursor);
        i++;
        if(i<=text.length){
          typingTimers.push(setTimeout(tick,speed));
        }else{
          cursor.remove();
          resolve();
        }
      }
      tick();
    });
  }

  function showTypingDots(el){
    el.textContent='';
    el.classList.add('is-typing');
  }

  function stopTypingDots(el){
    el.classList.remove('is-typing');
  }

  function restartLangProgress(){
    if(!langProgress || reduceMotion) return;
    langProgress.style.animation='none';
    langProgress.style.width='0';
    void langProgress.offsetWidth;
    langProgress.style.animation=`sv10LangProgress ${langDuration}ms linear forwards`;
    langProgress.style.animationPlayState=langPaused?'paused':'running';
  }

  function updateIntent(d){
    venueIntent.classList.add('is-updating');
    translationStatus.textContent='Understanding intent…';

    laterTyping(()=>{
      venueIntentTitle.textContent=d.intent;
      venueIntentDetail.textContent=d.detail;
      translationStatus.textContent='Translation synced';
      venueIntent.classList.remove('is-updating');
    },520);
  }

  function animateLanguage(code,restart=true){
    const d=languageData[code];
    if(!d) return;

    clearTypingTimers();
    langIndex=langOrder.indexOf(code);
    langName.textContent=d.name;
    venueIntentTitle.textContent='';
    venueIntentDetail.textContent='';
    translationStatus.textContent='Listening…';

    $$('.sv10-language-tabs button').forEach(x=>x.classList.toggle('is-active',x.dataset.lang===code));

    if(reduceMotion){
      qEl.textContent=d.q;
      aEl.textContent=d.a;
      venueQ.textContent=d.venueQ;
      venueA.textContent=d.venueA;
      venueIntentTitle.textContent=d.intent;
      venueIntentDetail.textContent=d.detail;
      translationStatus.textContent='Translation synced';
    }else{
      showTypingDots(qEl);
      venueQ.textContent='';
      venueA.textContent='';
      aEl.textContent='';

      laterTyping(async()=>{
        stopTypingDots(qEl);
        await typeInto(qEl,d.q,Math.max(22,950/Math.max(1,d.q.length)));

        translationStatus.textContent='Translating…';
        showTypingDots(venueQ);

        laterTyping(async()=>{
          stopTypingDots(venueQ);
          await typeInto(venueQ,d.venueQ,Math.max(16,1200/Math.max(1,d.venueQ.length)));
          updateIntent(d);

          laterTyping(()=>{
            showTypingDots(aEl);
            showTypingDots(venueA);

            laterTyping(async()=>{
              stopTypingDots(aEl);
              stopTypingDots(venueA);

              await Promise.all([
                typeInto(aEl,d.a,Math.max(16,1800/Math.max(1,d.a.length))),
                typeInto(venueA,d.venueA,Math.max(14,1900/Math.max(1,d.venueA.length)))
              ]);

              translationStatus.textContent='Translation synced';
            },650);
          },450);
        },360);
      },620);
    }

    if(restart) restartLanguageAutoplay();
  }

  function nextLanguage(){
    langIndex=(langIndex+1)%langOrder.length;
    animateLanguage(langOrder[langIndex],false);
    restartLangProgress();
  }

  function restartLanguageAutoplay(){
    clearInterval(langTimer);
    if(reduceMotion || langPaused) return;
    restartLangProgress();
    langTimer=setInterval(nextLanguage,langDuration);
  }

  $$('.sv10-language-tabs button').forEach(b=>b.addEventListener('click',()=>{
    animateLanguage(b.dataset.lang,false);
    restartLanguageAutoplay();
  }));

  [langDemo,langAuto].filter(Boolean).forEach(el=>{
    el.addEventListener('mouseenter',()=>{
      langPaused=true;
      clearInterval(langTimer);
      if(langProgress) langProgress.style.animationPlayState='paused';
    });
    el.addEventListener('mouseleave',()=>{
      langPaused=false;
      restartLanguageAutoplay();
    });
  });

  // Lock the mobile language section to the tallest scenario before
  // autoplay cycles so content below never jumps.
  sv10StabiliseLanguageLayout();
  requestAnimationFrame(sv10StabiliseLanguageLayout);
  setTimeout(sv10StabiliseLanguageLayout,180);
  if(document.fonts && document.fonts.ready){
    document.fonts.ready.then(sv10StabiliseLanguageLayout).catch(()=>{});
  }

  animateLanguage('en',false);
  restartLanguageAutoplay();

  // Business case calculator
  const orders=$('#sv10-orders'), locations=$('#sv10-locations');
  const ordersOut=$('#sv10-orders-out'), locOut=$('#sv10-locations-out'), daily=$('#sv10-daily'), monthly=$('#sv10-monthly'), annual=$('#sv10-annual');
  function calcBusiness(){
    const o=Number(orders.value), l=Number(locations.value);
    const d=o*l, m=d*30, y=d*365;
    ordersOut.textContent=o.toLocaleString();
    locOut.textContent=l.toLocaleString();
    daily.textContent=d.toLocaleString();
    monthly.textContent=m.toLocaleString();
    annual.textContent=y.toLocaleString();
  }
  [orders,locations].forEach(el=>el?.addEventListener('input',calcBusiness));
  calcBusiness();

  // Demo form: client-side validation + submission
  (function(){
    const demoForm=$('.sv10-demo-form');
    const demoSubmit=$('#sv10-demo-submit');
    if(demoForm&&demoSubmit){
      const requiredFields=['name','email','phone','restaurant','country'];
      const emailRe=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const clearFieldError=(input)=>{
        input.classList.remove('sv10-input-error');
        const m=input.parentNode.querySelector('.sv10-input-msg');
        if(m) m.remove();
      };
      const setFieldError=(input,text)=>{
        input.classList.add('sv10-input-error');
        let m=input.parentNode.querySelector('.sv10-input-msg');
        if(!m){ m=document.createElement('span'); m.className='sv10-input-msg'; input.parentNode.appendChild(m); }
        m.textContent=text;
      };
      demoForm.querySelectorAll('input').forEach(inp=>{
        inp.addEventListener('input',()=>clearFieldError(inp));
      });
      const API_BASE=(process.env.REACT_APP_BACKEND_URL||'')+'/api';
      const defaultBtnHTML=demoSubmit.innerHTML;
      const showFormError=(text)=>{
        let box=demoForm.querySelector('.sv10-demo-error');
        if(!box){
          box=document.createElement('div');
          box.className='sv10-demo-error';
          demoSubmit.parentNode.insertBefore(box,demoSubmit.nextSibling);
        }
        box.textContent=text;
        box.style.display='block';
      };
      const clearFormError=()=>{
        const box=demoForm.querySelector('.sv10-demo-error');
        if(box) box.style.display='none';
      };
      demoSubmit.addEventListener('click',async ()=>{
        clearFormError();
        let valid=true, firstInvalid=null;
        const values={};
        requiredFields.forEach(nm=>{
          const input=demoForm.querySelector('[name="'+nm+'"]');
          if(!input) return;
          clearFieldError(input);
          const val=(input.value||'').trim();
          values[nm]=val;
          if(!val){ setFieldError(input,'Please fill in this field'); valid=false; if(!firstInvalid) firstInvalid=input; }
          else if(nm==='email' && !emailRe.test(val)){ setFieldError(input,'Please enter a valid email address'); valid=false; if(!firstInvalid) firstInvalid=input; }
        });
        if(!valid){ if(firstInvalid) firstInvalid.focus(); return; }

        demoSubmit.disabled=true;
        demoSubmit.classList.add('is-loading');
        demoSubmit.innerHTML='Sending\u2026';
        try{
          const res=await fetch(API_BASE+'/demo-request',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(values)
          });
          if(!res.ok){
            let detail='Something went wrong. Please try again or email us directly at info@serv-ai.com.';
            try{ const j=await res.json(); if(j&&j.detail) detail=(typeof j.detail==='string')?j.detail:detail; }catch(e){}
            throw new Error(detail);
          }
          demoForm.reset();
          demoForm.classList.add('is-submitted');
          $('#sv10-demo-success')?.classList.add('show');
        }catch(err){
          showFormError(err&&err.message?err.message:'Something went wrong. Please try again or email us directly at info@serv-ai.com.');
        }finally{
          demoSubmit.disabled=false;
          demoSubmit.classList.remove('is-loading');
          demoSubmit.innerHTML=defaultBtnHTML;
        }
      });
    }
  })();


  // Subtle pointer tilt on premium cards
  if(window.matchMedia && window.matchMedia('(hover:hover) and (pointer:fine)').matches && !reduceMotion){
    const tiltTargets=$$('.sv10-editorial-card,.sv10-impact-stat,.sv10-actual-product-frame');
    tiltTargets.forEach(card=>{
      card.addEventListener('mousemove',e=>{
        const r=card.getBoundingClientRect();
        const px=(e.clientX-r.left)/r.width-.5;
        const py=(e.clientY-r.top)/r.height-.5;
        const ry=px*1.2;
        const rx=py*-1.0;
        card.style.transform=`translateY(-6px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      });
      card.addEventListener('mouseleave',()=>{
        card.style.transform='';
      });
    });
  }

  // Scroll-driven line, header and watermark parallax
  const watermarks=$$('.sv10-watermark');
  function onScroll(){
    const y=window.scrollY||document.documentElement.scrollTop;
    header?.classList.toggle('is-scrolled',y>30);

    const rect=root.getBoundingClientRect();
    const pageTop=y+rect.top;
    const total=Math.max(1,root.offsetHeight-window.innerHeight);
    const progress=Math.max(0,Math.min(1,(y-pageTop)/total));

    watermarks.forEach((wm,i)=>{
      const shift=(y*0.009)*(i%2?1:-1);
      wm.style.transform=`translateY(${shift}px) rotate(${(progress*1.5)*(i%2?1:-1)}deg)`;
    });

    // Process activation when section is crossed
    const proc=$('#sv10-process-track');
    if(proc){
      const r=proc.getBoundingClientRect();
      const local=Math.max(0,Math.min(1,(window.innerHeight*0.72-r.top)/(r.height+180)));
      const idx=Math.min(4,Math.floor(local*5));
      const steps=$$('.sv10-process-step',proc);
      steps.forEach((s,i)=>s.classList.toggle('is-active',i<=idx));
      const prog=$('#sv10-process-progress');
      if(prog&&steps[0]&&steps[idx]){
        const c0=steps[0].offsetLeft+steps[0].offsetWidth/2;
        const ci=steps[idx].offsetLeft+steps[idx].offsetWidth/2;
        prog.style.left=c0+'px';
        prog.style.width=Math.max(0,ci-c0)+'px';
      }
    }
  }
  window.addEventListener('scroll',onScroll,{passive:true});
  onScroll();

}
