// 註冊 ScrollTrigger 插件
gsap.registerPlugin(ScrollTrigger);

// 檢測螢幕寬度
const isDesktop = window.innerWidth >= 1024;
const isTablet = window.innerWidth >= 768;

// ============================================================
// 1. 核心標題：設定為最優先、提早顯示
// ============================================================
const mainTitles = document.querySelectorAll('.section-main-title, .main-header-group, .title-with-deco');

mainTitles.forEach(title => {
  gsap.to(title, {
    scrollTrigger: {
      trigger: title,
      start: "top 95%", // 核心修正：標題距離螢幕底部還有 5% 時就觸發，達到提早顯示
      toggleActions: "play none none none"
    },
    opacity: 1,
    y: 0,
    duration: 1,
    ease: "power2.out"
  });
});

// ============================================================
// 2. 國內外報告區塊 (Strike Report)：鳥類插圖與內容
// ============================================================
document.querySelectorAll(".strike-report .block-row").forEach((row) => {
  
  // A. 區塊文字淡入 (比標題稍微晚一點點，維持層次感)
  gsap.to(row, {
    scrollTrigger: {
      trigger: row,
      start: isDesktop ? "top 75%" : "top 85%",
      toggleActions: "play none none none"
    },
    opacity: 1,
    y: 0,
    duration: 1.2,
    ease: "power3.out"
  });

  // B. 鳥類插圖動畫
  const birdImg = row.querySelector(".bird-media img");
  
  if (birdImg) {
    let moveX = 0;
    
    // 根據 CSS 佈局決定滑入方向
    if (row.classList.contains("taiwan-layout")) {
      // 台灣鳥：從右邊滑入 (配合 grid-area: bird)
      moveX = isTablet ? 120 : 50;
    } else {
      // 韓美鳥：從左邊滑入 (配合放大貼左佈局)
      moveX = isTablet ? -150 : -50;
    }

    gsap.from(birdImg, {
      scrollTrigger: {
        trigger: row,
        start: isDesktop ? "top 70%" : "top 85%",
      },
      x: moveX,
      opacity: 0,
      duration: 1.8,
      ease: "expo.out",
      clearProps: "x,opacity" // 結束後清除 GSAP 設定，讓 CSS 的負位移與 !important 寬度完全接手
    });
  }
});

// ============================================================
// 3. 全球現況與黑數卡片
// ============================================================
const cards = document.querySelectorAll(`
  .section-global .info-card, 
  .section-blacknumber .card-item,
  .section-global .percent-data-img,
  .section-global .global-desc
`);

cards.forEach((card, index) => {
  gsap.to(card, {
    scrollTrigger: {
      trigger: card,
      start: "top 85%",
      toggleActions: "play none none none"
    },
    opacity: 1,
    y: 0,
    duration: 1,
    delay: isDesktop ? (index % 3) * 0.15 : 0, // 電腦版卡片交錯進場
    ease: "power2.out"
  });
});

// ============================================================
// 4. 背景與裝飾
// ============================================================
const decos = document.querySelectorAll('.bg-decoration, .deco-bg-icon');
decos.forEach(icon => {
  gsap.to(icon, {
    scrollTrigger: {
      trigger: icon,
      start: "top bottom",
      end: "bottom top",
      scrub: 1
    },
    y: -30,
    opacity: 0.3,
    duration: 1
  });
});

// 視窗調整重置
window.addEventListener("resize", () => {
  ScrollTrigger.refresh();
});