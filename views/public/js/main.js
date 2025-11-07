document.addEventListener('DOMContentLoaded', () => {
    
    // --- Mobile Menu Toggle ---
    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const openIcon = document.getElementById('menu-open-icon');
    const closeIcon = document.getElementById('menu-close-icon');

    if (menuButton) {
        menuButton.addEventListener('click', () => {
            const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
            menuButton.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.classList.toggle('hidden');
            openIcon.classList.toggle('hidden');
            openIcon.classList.toggle('block');
            closeIcon.classList.toggle('hidden');
            closeIcon.classList.toggle('block');
        });

        // Close mobile menu when a link is clicked
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuButton.setAttribute('aria-expanded', 'false');
                mobileMenu.classList.add('hidden');
                openIcon.classList.remove('hidden');
                openIcon.classList.add('block');
                closeIcon.classList.add('hidden');
                closeIcon.classList.remove('block');
            });
        });
    }

    // --- Contact Form Submission ---
    const contactForm = document.getElementById('contact-form');
    const formSuccessMessage = document.getElementById('form-success');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            contactForm.reset();
            formSuccessMessage.classList.remove('hidden');
            setTimeout(() => {
                formSuccessMessage.classList.add('hidden');
            }, 5000);
        });
    }

    // --- Interactive Canvas Animation ---
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray = [];
        
        const shellDotColors = ['#ffffff', '#ddd6fe', '#a7f3d0', '#fed7aa'];
        const simpleDotColors = ['#ddd6fe', '#a7f3d0'];
        
        let mouse = {
            x: null,
            y: null,
            radius: 150
        };

        window.addEventListener('mousemove', (event) => {
            mouse.x = event.x;
            mouse.y = event.y;
        });
        
        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        class Particle {
            constructor(x, y, directionX, directionY, size, color, type) { 
                this.x = x;
                this.y = y;
                this.directionX = directionX;
                this.directionY = directionY;
                this.size = size;
                this.color = color; 
                this.type = type;   
                this.baseSize = size;
                
                this.dotPositions = [];
                if (this.type === 'shell' && this.color !== '#ffffff') {
                    for (let i = 0; i < 3; i++) {
                        this.dotPositions.push({
                            x: (Math.random() - 0.5) * this.size * 2.5,
                            y: (Math.random() - 0.5) * this.size * 3.0,
                            s: (Math.random() * 0.3 + 0.2) * this.size
                        });
                    }
                }
            }

            draw() {
                if (this.type === 'shell') {
                    ctx.beginPath();
                    ctx.ellipse(this.x, this.y, this.size * 1.5, this.size * 2, 0, 0, Math.PI * 2);
                    ctx.fillStyle = 'white';
                    ctx.strokeStyle = '#e2e8f0'; 
                    ctx.lineWidth = 0.5;
                    ctx.fill();
                    ctx.stroke();

                    if (this.color !== '#ffffff') {
                        ctx.fillStyle = this.color;
                        ctx.save();
                        ctx.beginPath();
                        ctx.ellipse(this.x, this.y, this.size * 1.5, this.size * 2, 0, 0, Math.PI * 2);
                        ctx.clip();
                        
                        for (const pos of this.dotPositions) {
                            ctx.beginPath();
                            ctx.arc(this.x + pos.x, this.y + pos.y, pos.s, 0, Math.PI * 2);
                            ctx.fill();
                        }
                        ctx.restore(); 
                    }
                    
                    ctx.beginPath();
                    ctx.moveTo(this.x, this.y - this.size * 1.8);
                    ctx.quadraticCurveTo(this.x + this.size * 0.5, this.y, this.x, this.y + this.size * 1.8);
                    ctx.strokeStyle = '#d1d5db'; 
                    ctx.lineWidth = 1;
                    ctx.stroke();
                } else {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                    ctx.fillStyle = this.color;
                    ctx.fill();
                }
            }

            update() {
                if (this.x + this.size > canvas.width || this.x - this.size < 0) {
                    this.directionX = -this.directionX;
                }
                if (this.y + this.size > canvas.height || this.y - this.size < 0) {
                    this.directionY = -this.directionY;
                }

                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouse.radius) {
                    if (this.size < this.baseSize + 3) {
                        this.size += 0.5;
                    }
                    this.x -= this.directionX * 0.5;
                    this.y -= this.directionY * 0.5;
                } else {
                    if (this.size > this.baseSize) {
                        this.size -= 0.1;
                    }
                }

                this.x += this.directionX;
                this.y += this.directionY;
                this.draw();
            }
        }

        function init() {
            canvas.width = window.innerWidth;
            canvas.height = canvas.parentElement.offsetHeight;
            particlesArray = [];
            let numParticles = (canvas.height * canvas.width) / 8000;
            if (numParticles > 180) numParticles = 180;

            for (let i = 0; i < numParticles; i++) {
                let size;
                let x = Math.random() * (canvas.width - 6) + 3;
                let y = Math.random() * (canvas.height - 6) + 3;
                let directionX = (Math.random() * 0.4) - 0.2; 
                let directionY = (Math.random() * 0.4) - 0.2;
                
                let particleType = Math.random() > 0.6 ? 'shell' : 'dot';
                let color;

                if (particleType === 'shell') {
                    size = (Math.random() * 2) + 1.5;
                    color = shellDotColors[Math.floor(Math.random() * shellDotColors.length)];
                } else {
                    size = (Math.random() * 2) + 2;
                    color = simpleDotColors[Math.floor(Math.random() * simpleDotColors.length)];
                }
                
                particlesArray.push(new Particle(x, y, directionX, directionY, size, color, particleType));
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
        }

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                init();
            }, 250);
        });

        init();
        animate();
    }
});