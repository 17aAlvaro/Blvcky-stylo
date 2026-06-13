document.addEventListener('DOMContentLoaded', () => {
    // --- Preloader Logic ---
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Fast, snappy display time (1.2s)
        setTimeout(() => {
            preloader.classList.add('loaded');
            setTimeout(() => preloader.remove(), 800);
        }, 1200);
    }
    
    // --- Header Scroll State ---
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Mobile Menu Toggle ---
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuBtn.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuBtn.classList.remove('active');
        });
    });

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.scroll-reveal, .reveal-left, .reveal-right');
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('is-visible');
                // Optional: Stop observing once revealed
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // --- Testimonial Slider ---
    const track = document.getElementById('testimonialTrack');
    const prevBtn = document.querySelector('.slider-controls .prev-btn');
    const nextBtn = document.querySelector('.slider-controls .next-btn');
    let currentIndex = 0;
    
    // Basic setup assuming 3 testimonials for now
    const totalSlides = document.querySelectorAll('.testimonial-card').length;
    
    function updateSlider() {
        const slideWidth = 100; // 100% since min-width is 100%
        track.style.transform = `translateX(-${currentIndex * slideWidth}%)`;
    }

    if(nextBtn && prevBtn && track) {
        nextBtn.addEventListener('click', () => {
            if (currentIndex < totalSlides - 1) {
                currentIndex++;
            } else {
                currentIndex = 0; // Loop back to start
            }
            updateSlider();
        });

        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                currentIndex = totalSlides - 1; // Loop to end
            }
            updateSlider();
        });
    }


    // --- Video Carousel Logic ---
    const videoTrack = document.querySelector('.video-carousel-track');
    const videoPrevBtn = document.querySelector('.video-carousel-container .prev-btn');
    const videoNextBtn = document.querySelector('.video-carousel-container .next-btn');

    if (videoTrack && videoPrevBtn && videoNextBtn) {
        const gap = 24; // approx 1.5rem

        const scrollNext = () => {
            const firstCard = videoTrack.querySelector('.carousel-card');
            if (!firstCard) return;
            
            const cardWidth = firstCard.offsetWidth;
            const maxScrollLeft = videoTrack.scrollWidth - videoTrack.clientWidth;
            
            // If all cards fit on screen, don't auto-scroll
            if (maxScrollLeft <= 0) return;
            
            // Si llega al final, vuelve al principio
            if (videoTrack.scrollLeft >= maxScrollLeft - 10) {
                videoTrack.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                videoTrack.scrollBy({ left: cardWidth + gap, behavior: 'smooth' });
            }
        };

        const scrollPrev = () => {
            const firstCard = videoTrack.querySelector('.carousel-card');
            if (!firstCard) return;
            const cardWidth = firstCard.offsetWidth;
            videoTrack.scrollBy({ left: -(cardWidth + gap), behavior: 'smooth' });
        };

        videoNextBtn.addEventListener('click', () => {
            scrollNext();
            resetAutoScroll();
        });
        
        videoPrevBtn.addEventListener('click', () => {
            scrollPrev();
            resetAutoScroll();
        });

        // Autoplay logic
        let autoScrollInterval = setInterval(scrollNext, 3000);

        const resetAutoScroll = () => {
            clearInterval(autoScrollInterval);
            autoScrollInterval = setInterval(scrollNext, 3000);
        };

        // Pause on interaction
        videoTrack.addEventListener('mouseenter', () => clearInterval(autoScrollInterval));
        videoTrack.addEventListener('mouseleave', resetAutoScroll);
        videoTrack.addEventListener('touchstart', () => clearInterval(autoScrollInterval), {passive: true});
        videoTrack.addEventListener('touchend', resetAutoScroll);
    }

    // --- BRAVO Canvas Animation ---
    const canvas = document.getElementById('clipper-canvas');
    const bravoSection = document.getElementById('bravo-showcase');

    if (canvas && bravoSection) {
        const context = canvas.getContext('2d');
        const frameCount = 102;
        
        const currentFrame = index => {
            const paddedIndex = index.toString().padStart(3, '0');
            return `assets/canvas/videobueno_000/videobueno_${paddedIndex}.png`;
        };

        const images = [];

        const processImage = (img) => {
            const tempCanvas = document.createElement('canvas');
            const tCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
            tempCanvas.width = img.naturalWidth;
            tempCanvas.height = img.naturalHeight;
            tCtx.drawImage(img, 0, 0);

            try {
                const imgData = tCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
                const data = imgData.data;
                
                // Tomamos el pixel superior izquierdo como el color de fondo a eliminar
                const bgR = data[0];
                const bgG = data[1];
                const bgB = data[2];
                const tolerance = 30; // Tolerancia para las imperfecciones de la compresión del video

                // Definir el área de la marca de agua (esquina inferior izquierda)
                const watermarkMaxX = tempCanvas.width * 0.25; // Primer 25% de la anchura
                const watermarkMinY = tempCanvas.height * 0.85; // Último 15% de la altura

                for (let i = 0; i < data.length; i += 4) {
                    const pixelIndex = i / 4;
                    const x = pixelIndex % tempCanvas.width;
                    const y = Math.floor(pixelIndex / tempCanvas.width);

                    // Si el pixel está en la zona de la marca de agua, lo borramos directamente
                    if (x < watermarkMaxX && y > watermarkMinY) {
                        data[i+3] = 0;
                        continue;
                    }

                    const r = data[i];
                    const g = data[i+1];
                    const b = data[i+2];
                    
                    if (Math.abs(r - bgR) <= tolerance && 
                        Math.abs(g - bgG) <= tolerance && 
                        Math.abs(b - bgB) <= tolerance) {
                        data[i+3] = 0; // Volver transparente
                    }
                }
                tCtx.putImageData(imgData, 0, 0);
            } catch (e) {
                console.error("No se pudo procesar la imagen (posible error CORS local)", e);
            }
            return tempCanvas;
        };

        const renderImage = (source) => {
            if (!source) return;
            const srcWidth = source.naturalWidth || source.width;
            const srcHeight = source.naturalHeight || source.height;
            if (!srcWidth || srcWidth === 0) return;

            if (canvas.width !== srcWidth) {
                canvas.width = srcWidth;
                canvas.height = srcHeight;
            }
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(source, 0, 0, canvas.width, canvas.height);
        };

        const loadFrame = (index) => {
            const frameImg = new Image();
            frameImg.src = currentFrame(index);
            images[index] = frameImg; // Guardar la imagen original inicialmente
            
            frameImg.onload = () => {
                // Al cargar, procesamos para quitar el fondo y la reemplazamos
                images[index] = processImage(frameImg);
                if (index === 0) {
                    renderImage(images[0]); // Mostrar el primer frame nada más esté listo
                }
            };
        };

        // Iniciar la carga y procesado de todos los frames
        for (let i = 0; i < frameCount; i++) {
            loadFrame(i);
        }

        let isScrolling = false;

        window.addEventListener('scroll', () => {
            if (!isScrolling) {
                window.requestAnimationFrame(() => {
                    const sectionTop = bravoSection.offsetTop;
                    const sectionHeight = bravoSection.offsetHeight;
                    const scrollY = window.scrollY;
                    const viewportHeight = window.innerHeight;

                    // Calculate progress based on when the section is visible in the viewport
                    const scrollStart = sectionTop - viewportHeight;
                    const scrollEnd = sectionTop + sectionHeight;
                    
                    if (scrollY >= scrollStart && scrollY <= scrollEnd) {
                        const rawProgress = (scrollY - scrollStart) / (scrollEnd - scrollStart);
                        const progress = Math.max(0, Math.min(1, rawProgress));

                        const frameIndex = Math.min(
                            frameCount - 1,
                            Math.floor(progress * frameCount)
                        );
                        
                        renderImage(images[frameIndex]);
                    } else if (scrollY < scrollStart) {
                        renderImage(images[0]);
                    } else if (scrollY > scrollEnd) {
                        renderImage(images[frameCount - 1]);
                    }

                    isScrolling = false;
                });
            }
            isScrolling = true;
        });
    }

});

// --- PWA Service Worker Registration ---
// Desactivado temporalmente para facilitar el desarrollo (evita el caché)
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) {
            registration.unregister();
            console.log('Service Worker desregistrado temporalmente para desarrollo.');
        }
    });
}
