// 1. 註冊插件
gsap.registerPlugin(ScrollTrigger);

const initBlackNumberAnimation = () => {
    // 檢查物件是否存在，避免報錯
    const section = document.querySelector(".section-blacknumber");
    if (!section) return;

    // 建立時間軸
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".section-blacknumber",
            start: "top 80%",    // 區塊頂部進入螢幕 80% 位置時觸發
            toggleActions: "play none none none",
            // markers: true,    // 測試時可開啟這行，畫面右側會出現觸發線，確認有沒有過線
        }
    });

    // 關鍵：先強制將物件設為可見 (visibility) 並給予初始透明度
    tl.set(".section-blacknumber .bg-decoration, .section-blacknumber .main-header, .section-blacknumber .card-item", {
        visibility: "visible",
        opacity: 0
    });

    // 1. 背景圖由上往下滑入
    tl.fromTo(".section-blacknumber .bg-decoration", 
        { y: -100, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" }
    );

    // 2. Header 淡入
    tl.fromTo(".section-blacknumber .main-header", 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, ease: "power2.out" },
        "-=0.7"
    );

    // 3. 卡牌依序淡入
    tl.fromTo(".section-blacknumber .card-item", 
        { y: 50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power2.out" },
        "-=0.5"
    );
};

// 使用 DOMContentLoaded 確保 HTML 結構先載入
document.addEventListener("DOMContentLoaded", () => {
    // 確保 ScrollTrigger 刷新位置
    ScrollTrigger.refresh();
    initBlackNumberAnimation();
});