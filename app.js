document.addEventListener('DOMContentLoaded', () => {
    
    const introScreen = document.getElementById('intro-screen');
    const profileScreen = document.getElementById('profile-screen');
    const loadingScreen = document.getElementById('loading-screen');
    const homeScreen = document.getElementById('home-screen');
    
    // Setup functions
    setupProfiles();
    setupHomeMedia();

    // Application Flow:
    
    // 1. After 3.5 seconds, hide Intro, show Profiles
    setTimeout(() => {
        introScreen.classList.remove('active');
        profileScreen.classList.add('active');
    }, 3500);

    // 2. Profile Selection
    function setupProfiles() {
        const profileContainer = document.getElementById('profile-container');
        if (!profileContainer) return;
        profileContainer.innerHTML = ''; // Clear template

        AppConfig.profiles.forEach(profile => {
            const btn = document.createElement('button');
            btn.className = 'profile-item flex flex-col items-center group focus:outline-none w-32 md:w-40';
            
            let avatarHtml = '';
            if (profile.isKids) {
                avatarHtml = `<div class="relative w-full aspect-square mb-4 rounded-md profile-avatar kids-avatar group-hover:scale-105 transition-all duration-300 shadow-lg border border-transparent group-hover:border-white">
                                KIDS
                              </div>`;
            } else {
                avatarHtml = `<div class="relative w-full aspect-square mb-4">
                                <img alt="${profile.name}" class="profile-avatar w-full h-full object-cover shadow-lg group-hover:scale-105 transition-transform duration-300" src="${profile.image}">
                              </div>`;
            }

            btn.innerHTML = `
                ${avatarHtml}
                <span class="profile-name block text-gray-400 group-hover:text-white text-lg md:text-xl transition-colors duration-200 font-helvetica">${profile.name}</span>
            `;

            btn.addEventListener('click', () => {
                // Change current active profile picture in navbar
                if (!profile.isKids) {
                    const navProfilePic = document.getElementById('nav-profile-pic');
                    if (navProfilePic) navProfilePic.src = profile.image;
                }
                showLoadingScreen();
            });

            profileContainer.appendChild(btn);
        });
    }

    // 3. Loading Screen
    function showLoadingScreen() {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        
        // Reset and animate loading bar
        const loadingBar = document.querySelector('.loading-bar-fill');
        if (loadingBar) {
            loadingBar.style.transition = 'none';
            loadingBar.style.width = '0%';
            
            // Force reflow
            void loadingBar.offsetWidth;
            
            // Start animation
            loadingBar.style.transition = 'width 3s ease-in-out';
            loadingBar.style.width = '100%';
        }
        
        // Show loading screen
        loadingScreen.classList.add('active');
        
        setTimeout(() => {
            loadingScreen.classList.remove('active');
            homeScreen.classList.add('active');
        }, 3000);
    }

    // 4. Setup Home Media (Hero Video & Thumbnails)
    function setupHomeMedia() {
        const heroContainer = document.getElementById('hero-media-container');
        if (heroContainer) {
            if (AppConfig.heroVideoUrl) {
                heroContainer.innerHTML = `
                    <div class="absolute inset-0 bg-black/40 z-10"></div> <!-- Dimmer -->
                    <div class="absolute inset-0 hero-gradient z-20"></div> <!-- Bottom Gradient -->
                    <div class="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-background to-transparent z-20 hidden md:block"></div>
                    <video autoplay loop muted playsinline class="w-full h-full object-cover object-top absolute inset-0 z-0">
                        <source src="${AppConfig.heroVideoUrl}" type="video/mp4">
                        <img src="${AppConfig.heroFallbackImage}" class="w-full h-full object-cover object-top" />
                    </video>
                `;
            } else {
                heroContainer.innerHTML = `
                    <div class="absolute inset-0 bg-black/40 z-10"></div> <!-- Dimmer -->
                    <div class="absolute inset-0 hero-gradient z-20"></div> <!-- Bottom Gradient -->
                    <div class="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-background to-transparent z-20 hidden md:block"></div>
                    <img alt="Hero Background" class="w-full h-full object-cover object-top absolute inset-0 z-0" src="${AppConfig.heroFallbackImage}"/>
                `;
            }
        }

        // Render Family Row
        const familyContainer = document.getElementById('family-container');
        if (familyContainer) {
            familyContainer.innerHTML = '';
            const familyItems = AppConfig.thumbnails.filter(t => t.category === 'family');
            familyItems.forEach(item => {
                const card = createCardHTML(item, true); // true = big
                familyContainer.appendChild(card);
            });
        }

        // Render Friends Row
        const friendsContainer = document.getElementById('friends-container');
        if (friendsContainer) {
            friendsContainer.innerHTML = '';
            const friendsItems = AppConfig.thumbnails.filter(t => t.category === 'friends');
            friendsItems.forEach(item => {
                const card = createCardHTML(item, false); // false = small
                friendsContainer.appendChild(card);
            });
        }
        
        setupVideoHovers();
    }

    function createCardHTML(item, isBig) {
        const div = document.createElement('div');
        
        const baseClasses = isBig 
            ? "relative flex-none w-[80vw] md:w-[400px] aspect-[1.79] rounded-lg overflow-hidden snap-start card-hover-fx group cursor-pointer"
            : "relative flex-none w-[60vw] md:w-[280px] aspect-[1.79] rounded-lg overflow-hidden snap-start card-hover-fx group cursor-pointer";
        
        div.className = baseClasses;
        
        let videoHtml = item.videoUrl ? `
            <video preload="none" muted loop playsinline class="absolute inset-0 w-full h-full object-cover z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 card-video">
                <source src="${item.videoUrl}" type="video/mp4">
            </video>
        ` : '';

        let titleClass = isBig ? "font-label-bold text-on-surface mb-2 text-xl" : "font-label-sm text-on-surface mb-2 truncate";

        div.innerHTML = `
            <img alt="${item.title}" class="absolute inset-0 w-full h-full object-cover z-0" src="${item.image}"/>
            ${videoHtml}
            <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 z-20">
                <h3 class="${titleClass}">${item.title}</h3>
                <div class="flex items-center gap-2">
                    <button class="w-8 h-8 bg-on-surface rounded-full flex items-center justify-center text-background hover:bg-surface-variant hover:text-on-surface transition-colors">
                        <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">play_arrow</span>
                    </button>
                    ${isBig ? `
                    <button class="w-8 h-8 border border-secondary rounded-full flex items-center justify-center text-on-surface hover:border-on-surface transition-colors">
                        <span class="material-symbols-outlined text-[16px]">add</span>
                    </button>
                    ` : ''}
                </div>
            </div>
            ${isBig ? `
            <!-- Progress Bar -->
            <div class="absolute bottom-0 left-0 w-full h-[2px] bg-surface-container-highest z-30">
                <div class="h-full bg-primary-container" style="width: ${Math.random() * 80 + 10}%"></div>
            </div>
            ` : ''}
        `;

        div.addEventListener('click', (e) => {
            // Prevent the loading screen transition
            e.stopPropagation();
            
            if (item.videoUrl) {
                playFullscreenVideo(item.videoUrl);
            } else {
                // Optional: Show some default action if no videoUrl is set, or just do nothing
                console.log("No videoUrl configured for this card.");
            }
        });

        return div;
    }

    function playFullscreenVideo(url) {
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black z-[100] flex items-center justify-center';
        
        const video = document.createElement('video');
        video.src = url;
        video.controls = true;
        video.autoplay = true;
        video.className = 'w-full h-full max-h-screen outline-none object-contain';
        
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '<span class="material-symbols-outlined text-white text-[40px] drop-shadow-md">close</span>';
        closeBtn.className = 'absolute top-6 right-6 z-[101] p-2 hover:scale-110 transition-transform cursor-pointer';
        closeBtn.onclick = () => {
            video.pause();
            if (document.fullscreenElement) {
                document.exitFullscreen().catch(() => {});
            }
            if (document.body.contains(overlay)) {
                overlay.remove();
            }
        };
        
        overlay.appendChild(video);
        overlay.appendChild(closeBtn);
        document.body.appendChild(overlay);
        
        if (overlay.requestFullscreen) {
            overlay.requestFullscreen().catch(err => console.log(err));
        }
        
        const fullscreenHandler = () => {
            if (!document.fullscreenElement && document.body.contains(overlay)) {
                video.pause();
                overlay.remove();
                document.removeEventListener('fullscreenchange', fullscreenHandler);
            }
        };
        document.addEventListener('fullscreenchange', fullscreenHandler);
    }

    function setupVideoHovers() {
        const cards = document.querySelectorAll('.card-hover-fx');
        cards.forEach(card => {
            const video = card.querySelector('.card-video');
            if (video) {
                card.addEventListener('mouseenter', () => {
                    video.play().catch(e => console.log('Video play error:', e));
                });
                card.addEventListener('mouseleave', () => {
                    video.pause();
                    video.currentTime = 0;
                });
            }
        });
    }

    // Secret Button Logic
    const secretBtn = document.getElementById('secret-btn');
    if (secretBtn) {
        secretBtn.addEventListener('click', () => {
            // Replace the URL below with your actual Google Drive link!
            window.open('https://drive.google.com/file/d/10B_RAO95JplNGUeMiQD367oom12tUkfz/view?usp=sharing', '_blank');
        });
    }

    // Add click listeners to buttons to show loading screen
    document.body.addEventListener('click', (e) => {
        // If it's a play button or any card click (except profile buttons handled above)
        if (e.target.closest('button') && homeScreen.classList.contains('active')) {
            const btnText = e.target.closest('button').innerText;
            if (btnText.includes('Play') || btnText.includes('play_arrow')) {
                showLoadingScreen();
            }
        }
    });

});
