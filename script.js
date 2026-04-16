window.onbeforeunload = function () {
        window.scrollTo(0, 0);
    };

    // 針對某些瀏覽器的快取機制，在頁面載入完成後再次確保位置
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('openingVideo');
    const wrapper = document.getElementById('main-wrapper');
    const preloader = document.querySelector('.video-preloader');

    if (video) {
        // 定義關閉 Preloader 的動作
        const endPreloader = () => {
            // 1. 讓遮罩淡出
            preloader.style.opacity = '0';
            
            // 2. 顯示主內容
            if (wrapper) {
                wrapper.style.visibility = 'visible';
                wrapper.style.opacity = '1';
            }

            // 3. 動畫結束後徹底移除預載器節點，不佔用效能
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 800); 
        };

        // 監聽：當影片播放快結束時（提前 0.3 秒），讓銜接更順暢
        video.addEventListener('timeupdate', function handleTimeUpdate() {
            if (video.duration && video.currentTime >= video.duration - 0.3) {
                endPreloader();
                video.removeEventListener('timeupdate', handleTimeUpdate);
            }
        });

        // 監聽：如果影片播完了
        video.onended = endPreloader;

        // 安全機制：如果影片因為網路問題載入失敗，3秒後自動進入網站
        video.onerror = () => {
            console.warn("影片載入失敗，跳過預載。");
            endPreloader();
        };
        
        // 額外保險
        setTimeout(() => {
            if (preloader.style.display !== 'none') {
                endPreloader();
            }
        }, 5000); // 最多等 5 秒
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const menuOverlay = document.getElementById('menu-overlay');
    const navbar = document.querySelector('.navbar');

    if (hamburger && menuOverlay) {
        hamburger.addEventListener('click', () => {
            // 切換漢堡按鈕動畫
            hamburger.classList.toggle('active');
            // 切換選單顯示
            menuOverlay.classList.toggle('active');
            // 讓 Navbar 知道現在是開啟狀態 (處理遮罩消失)
            navbar.classList.toggle('menu-active');
            
            // 防止背景滾動 (優化體驗)
            if (menuOverlay.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // 點擊連結後自動關閉選單
        const navLinks = document.querySelectorAll('.mobile-nav-links a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                menuOverlay.classList.remove('active');
                navbar.classList.remove('menu-active');
                document.body.style.overflow = '';
            });
        });
    }
});


gsap.registerPlugin(ScrollTrigger);

window.addEventListener('load', () => {
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: "#pinSection",
            start: "top top",
            end: "+=2500",
            scrub: 1.2,
            pin: true,
            anticipatePin: 1
        }
    });

    // 1. 圖片滑入「同時」副標淡入
    tl.to(".img-left", { x: "0%", duration: 2, ease: "power2.out" }, "sync")
      .to(".img-right", { x: "0%", duration: 2, ease: "power2.out" }, "sync")
      .to(".sub-title", { 
          opacity: 1, 
          duration: 1.5 
      }, "sync+=0.5")

    // 2. 圖片定位後，內文淡入
      .to(".content-body", { 
          opacity: 1, 
          y: -10, 
          duration: 1.5 
      });
});

gsap.registerPlugin(ScrollTrigger);

window.addEventListener('load', () => {
    
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: "#zoomSection",
            start: "top top",
            end: "+=4000", 
            scrub: 1,
            pin: true,
            anticipatePin: 1
        }
    });

    const items = gsap.utils.toArray(".zoom-item");
    const totalItems = items.length;

    items.forEach((item, index) => {
        const isLast = index === totalItems - 1;

        if (!isLast) {
            // --- 前面所有的物件 (3張圖 + 副標)：維持「穿透」效果 ---
            tl.fromTo(item, 
                { z: -2000, opacity: 0 },
                {
                    z: 2000, 
                    duration: 2, 
                    ease: "none",
                    onUpdate: function() {
                        const progress = this.progress(); 
                        const alpha = Math.sin(progress * Math.PI); 
                        gsap.set(item, { opacity: alpha });
                    }
                }, 
                index * 1.0
            );
        } else {
            // --- 最後一個物件 (內文)：飛到中間就停住 ---
            tl.fromTo(item, 
                { z: -2000, opacity: 0 },
                {
                    z: 0,        // 停在正中間
                    opacity: 1,  // 保持完全顯現
                    duration: 1.2, 
                    ease: "power2.out" // 停住時加一點緩動，感覺更優雅
                }, 
                index * 1.0
            );
        }
    });
});


document.addEventListener('DOMContentLoaded', () => {
  const stage = document.getElementById('carousel-stage');
  const items = document.querySelectorAll('.carousel-item');
  const textItems = document.querySelectorAll('.text-item');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const swipeArea = document.getElementById('swipe-area');

  let currentIndex = 0;
  let startX = 0;
  let isDragging = false;

  function updateCarousel(index) {
    if (index < 0) index = items.length - 1;
    if (index >= items.length) index = 0;
    
    currentIndex = index;

    // 移動圖片
    stage.style.transform = `translateX(-${currentIndex * 100}%)`;

    // 更新點點
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });

    // 更新文字
    textItems.forEach((item, i) => {
      item.classList.toggle('active', i === currentIndex);
    });
  }

  // 按鈕點擊
  prevBtn.addEventListener('click', () => updateCarousel(currentIndex - 1));
  nextBtn.addEventListener('click', () => updateCarousel(currentIndex + 1));

  // 點點點擊
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => updateCarousel(i));
  });

  // 手機滑動處理 (Touch Events)
  swipeArea.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
  });

  swipeArea.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = startX - currentX;
    // 阻止垂直捲動干擾滑動
    if (Math.abs(diff) > 10) e.preventDefault();
  }, { passive: false });

  swipeArea.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (Math.abs(diff) > 50) { // 滑動門檻
      if (diff > 0) {
        updateCarousel(currentIndex + 1);
      } else {
        updateCarousel(currentIndex - 1);
      }
    }
    isDragging = false;
  });
});


gsap.registerPlugin(ScrollTrigger);

window.addEventListener('load', () => {
    const section = document.querySelector('.transition-trigger-section');
    const nav = document.querySelector('.navbar');

    if (!section || !nav) return;

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".transition-trigger-section",
            start: "top top",
            end: "+=3000",
            scrub: 1,
            pin: true,
            onUpdate: (self) => {
                // 當進度超過 75% 時，切換背景色為 #e4e1e5
                if (self.progress > 0.75) {
                    section.style.backgroundColor = "#e4e1e5";
                    nav.classList.add('light-mode');
                } else {
                    section.style.backgroundColor = "#000000";
                    nav.classList.remove('light-mode');
                }
            }
        }
    });

    tl.to(".zoom-target-icon", {
        scale: 130, // 稍微加大確保邊緣完全覆蓋
        duration: 2,
        ease: "power2.in"
    })
    .to(".info-title-zh, .info-text-en", {
        opacity: 0,
        y: -30,
        duration: 0.8
    }, "<0.3")
    .to(".zoom-target-icon", {
        opacity: 0,
        duration: 0.2
    });
});