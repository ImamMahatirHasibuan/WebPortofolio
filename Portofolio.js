// Galaxy Portfolio JavaScript - Fixed Complete Version
class GalaxyPortfolio {
    constructor() {
        this.currentLanguage = 'en';
        this.isScrolling = false;
        this.cardPosition = { x: 0, y: 0 };
        this.isDragging = false;
        this.dragStart = { x: 0, y: 0 };
        this.currentModalImageIndex = 0;
        this.currentModalImages = [];
        
        this.init();
    }

    init() {
        this.createStars();
        this.createMovingStars();
        this.createShootingStars();
        this.setupNavigation();
        this.setupLanguageSwitcher();
        this.setupScrollEffects();
        this.setupIDCard();
        this.setupPhotoUploads();
        this.setupPhotoSliders();
        this.setupProjectModals();
        this.setupScrollToTop();
        this.setupZoomOnScroll();
        
        // Start animations
        this.animateMovingStars();
        this.animateShootingStars();
        
        // Make functions globally available
        window.openProjectModal = (projectId) => this.openProjectModal(projectId);
        window.portfolio = this;
    }

    // Create static twinkling stars
    createStars() {
        const starsContainer = document.getElementById('stars');
        const numberOfStars = 200;

        for (let i = 0; i < numberOfStars; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            
            // Random size
            const size = Math.random();
            if (size > 0.8) star.classList.add('large');
            else if (size > 0.5) star.classList.add('medium');
            else star.classList.add('small');
            
            // Random position
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            
            // Random animation delay
            star.style.animationDelay = Math.random() * 3 + 's';
            star.style.animationDuration = (Math.random() * 2 + 1) + 's';
            
            starsContainer.appendChild(star);
        }
    }

    // Create moving stars that travel across screen
    createMovingStars() {
        const starsContainer = document.getElementById('stars');
        this.movingStars = [];

        for (let i = 0; i < 20; i++) {
            const star = document.createElement('div');
            star.className = 'moving-star';
            star.style.width = (Math.random() * 3 + 1) + 'px';
            star.style.height = star.style.width;
            star.style.top = Math.random() * 100 + '%';
            star.style.animationDelay = Math.random() * 15 + 's';
            star.style.animationDuration = (Math.random() * 10 + 10) + 's';
            
            starsContainer.appendChild(star);
            this.movingStars.push(star);
        }
    }

    // Create shooting stars
    createShootingStars() {
        const shootingStarsContainer = document.getElementById('shooting-stars');
        this.shootingStars = [];

        for (let i = 0; i < 5; i++) {
            const shootingStar = document.createElement('div');
            shootingStar.className = 'shooting-star';
            shootingStar.style.top = Math.random() * 50 + '%';
            shootingStar.style.animationDelay = Math.random() * 8 + 's';
            shootingStar.style.animationDuration = (Math.random() * 2 + 2) + 's';
            
            shootingStarsContainer.appendChild(shootingStar);
            this.shootingStars.push(shootingStar);
        }
    }

    // Animate moving stars continuously
    animateMovingStars() {
        setInterval(() => {
            this.movingStars.forEach(star => {
                if (Math.random() > 0.95) { // 5% chance every interval
                    star.style.top = Math.random() * 100 + '%';
                    star.style.animationDelay = '0s';
                }
            });
        }, 1000);
    }

    // Animate shooting stars
    animateShootingStars() {
        setInterval(() => {
            if (Math.random() > 0.7) { // 30% chance
                const randomStar = this.shootingStars[Math.floor(Math.random() * this.shootingStars.length)];
                randomStar.style.top = Math.random() * 50 + '%';
                randomStar.style.animationDelay = '0s';
            }
        }, 3000);
    }

    // Setup navigation functionality
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('.section');

        // Smooth scroll to sections
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Update active nav link on scroll
        window.addEventListener('scroll', () => {
            if (this.isScrolling) return;
            
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.offsetHeight;
                
                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').substring(1) === current) {
                    link.classList.add('active');
                }
            });
        });
    }

    // Setup language switcher
    setupLanguageSwitcher() {
        const langButtons = document.querySelectorAll('.lang-btn');
        
        langButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.getAttribute('data-lang');
                this.switchLanguage(lang);
                
                langButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    // Switch between languages - FIXED VERSION
    switchLanguage(lang) {
        this.currentLanguage = lang;
        const elements = document.querySelectorAll('[data-en][data-id]');
        
        elements.forEach(element => {
            const englishText = element.getAttribute('data-en');
            const indonesianText = element.getAttribute('data-id');
            
            if (lang === 'en' && englishText) {
                if (element.innerHTML.includes('<strong>') || element.innerHTML.includes('<')) {
                    element.innerHTML = englishText;
                } else {
                    element.textContent = englishText;
                }
            } else if (lang === 'id' && indonesianText) {
                if (element.innerHTML.includes('<strong>') || element.innerHTML.includes('<')) {
                    element.innerHTML = indonesianText;
                } else {
                    element.textContent = indonesianText;
                }
            }
        });
    }

    // Setup scroll effects
    setupScrollEffects() {
        let lastScrollY = window.scrollY;
        const navbar = document.getElementById('navbar');

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            // Navbar background opacity based on scroll
            if (currentScrollY > 50) {
                navbar.style.background = 'rgba(0, 0, 0, 0.6)';
            } else {
                navbar.style.background = 'rgba(0, 0, 0, 0.3)';
            }

            // Parallax effect for nebula
            const nebula = document.getElementById('nebula');
            if (nebula) {
                const speed = currentScrollY * 0.1;
                nebula.style.transform = `translateY(${speed}px)`;
            }

            lastScrollY = currentScrollY;
        });
    }

    // Setup draggable ID card with elastic effect
    setupIDCard() {
        const idCard = document.getElementById('id-card');
        if (!idCard) return;
        
        let startX, startY, isDragging = false;

        const handleStart = (e) => {
            isDragging = true;
            idCard.style.cursor = 'grabbing';
            idCard.style.transition = 'none';
            
            const clientX = e.clientX || e.touches[0].clientX;
            const clientY = e.clientY || e.touches[0].clientY;
            
            startX = clientX;
            startY = clientY;
        };

        const handleMove = (e) => {
            if (!isDragging) return;
            
            e.preventDefault();
            const clientX = e.clientX || e.touches[0].clientX;
            const clientY = e.clientY || e.touches[0].clientY;
            
            const deltaX = clientX - startX;
            const deltaY = clientY - startY;
            
            // Apply elastic constraint
            const maxDistance = 100;
            const constrainedX = Math.sign(deltaX) * Math.min(Math.abs(deltaX), maxDistance);
            const constrainedY = Math.sign(deltaY) * Math.min(Math.abs(deltaY), maxDistance);
            
            idCard.style.transform = `translate(${constrainedX}px, ${constrainedY}px) scale(1.1)`;
        };

        const handleEnd = () => {
            if (!isDragging) return;
            
            isDragging = false;
            idCard.style.cursor = 'grab';
            idCard.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            idCard.style.transform = 'translate(0px, 0px) scale(1)';
        };

        // Mouse events
        idCard.addEventListener('mousedown', handleStart);
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', handleEnd);

        // Touch events
        idCard.addEventListener('touchstart', handleStart, { passive: false });
        document.addEventListener('touchmove', handleMove, { passive: false });
        document.addEventListener('touchend', handleEnd);

        // Prevent context menu on right click
        idCard.addEventListener('contextmenu', e => e.preventDefault());
    }

    // Setup photo upload functionality
    setupPhotoUploads() {
        const photoInputs = document.querySelectorAll('input[type="file"]');
        
        photoInputs.forEach((input, index) => {
            input.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    this.handlePhotoUpload(input, file);
                }
            });
        });

        // Setup remove photo buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.remove-photo')) {
                const button = e.target.closest('.remove-photo');
                const photoUpload = button.closest('.photo-upload');
                this.removePhoto(photoUpload);
            }
        });
    }

    // Handle photo upload
    handlePhotoUpload(input, file) {
        const reader = new FileReader();
        const photoUpload = input.closest('.photo-upload');
        const uploadLabel = photoUpload.querySelector('.upload-label');
        const activityPhoto = photoUpload.querySelector('.activity-photo');
        const removeButton = photoUpload.querySelector('.remove-photo');

        reader.onload = (e) => {
            activityPhoto.src = e.target.result;
            activityPhoto.style.display = 'block';
            uploadLabel.style.display = 'none';
            removeButton.style.display = 'flex';
            
            // Add fade-in animation
            activityPhoto.style.opacity = '0';
            setTimeout(() => {
                activityPhoto.style.transition = 'opacity 0.3s ease';
                activityPhoto.style.opacity = '1';
            }, 10);
        };

        reader.readAsDataURL(file);
    }

    // Remove photo
    removePhoto(photoUpload) {
        const input = photoUpload.querySelector('input[type="file"]');
        const uploadLabel = photoUpload.querySelector('.upload-label');
        const activityPhoto = photoUpload.querySelector('.activity-photo');
        const removeButton = photoUpload.querySelector('.remove-photo');

        // Reset file input
        input.value = '';
        
        // Hide photo and show upload label
        activityPhoto.style.display = 'none';
        activityPhoto.src = '';
        uploadLabel.style.display = 'flex';
        removeButton.style.display = 'none';
    }

    // Setup photo slider for campus activities
    setupPhotoSliders() {
        document.querySelectorAll('.photo-gallery').forEach(gallery => {
            const images = gallery.querySelectorAll('.gallery-container .activity-photo');
            const dots = gallery.querySelectorAll('.gallery-dots .dot');
            const prevBtn = gallery.querySelector('.prev-btn');
            const nextBtn = gallery.querySelector('.next-btn');
            let current = 0;

            function showImage(idx) {
                images.forEach((img, i) => {
                    img.classList.toggle('active', i === idx);
                });
                if (dots.length) {
                    dots.forEach((dot, i) => {
                        dot.classList.toggle('active', i === idx);
                    });
                }
            }

            if (prevBtn) {
                prevBtn.onclick = () => {
                    current = (current - 1 + images.length) % images.length;
                    showImage(current);
                };
            }

            if (nextBtn) {
                nextBtn.onclick = () => {
                    current = (current + 1) % images.length;
                    showImage(current);
                };
            }

            if (dots.length) {
                dots.forEach((dot, i) => {
                    dot.onclick = () => {
                        current = i;
                        showImage(current);
                    };
                });
            }

            showImage(current);
        });

        // Untuk struktur .photo-slider dengan .slider-images (jika ada)
        document.querySelectorAll('.photo-slider').forEach(slider => {
            const images = slider.querySelectorAll('.slider-images .activity-photo');
            const prevBtn = slider.querySelector('.prev-btn');
            const nextBtn = slider.querySelector('.next-btn');
            let current = 0;

            function showImage(idx) {
                images.forEach((img, i) => {
                    img.classList.toggle('active', i === idx);
                });
            }

            if (prevBtn) {
                prevBtn.onclick = () => {
                    current = (current - 1 + images.length) % images.length;
                    showImage(current);
                };
            }

            if (nextBtn) {
                nextBtn.onclick = () => {
                    current = (current + 1) % images.length;
                    showImage(current);
                };
            }

            showImage(current);
        });
    }

    // Setup project modals
    setupProjectModals() {
        this.projectData = {
            project1: {
                title: {
                    en: 'Web E-Commerce',
                    id: 'Web E-Commerce'
                },
                description: {
                    en: 'A simple e-commerce website designed to display and sell various products like clothes, shoes, and accessories. Built using HTML, CSS, and JavaScript without frameworks, focusing on basic structure, appearance, and interactions. Features include product catalog, shopping cart, and responsive design for optimal viewing across all devices.',
                    id: 'Sebuah website e-commerce sederhana yang dirancang untuk menampilkan dan menjual berbagai produk seperti baju, sepatu, dan aksesoris. Dibangun menggunakan HTML, CSS, dan JavaScript tanpa framework, berfokus pada struktur dasar, tampilan, dan interaksi. Fitur termasuk katalog produk, keranjang belanja, dan desain responsif untuk tampilan optimal di semua perangkat.'
                },
                technologies: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design'],
                features: [
                    {
                        title: { en: 'Product Catalog', id: 'Katalog Produk' },
                        description: { 
                            en: 'Dynamic product display with categories, search functionality, and detailed product pages.',
                            id: 'Tampilan produk dinamis dengan kategori, fungsi pencarian, dan halaman produk yang detail.'
                        }
                    },
                    {
                        title: { en: 'Shopping Cart', id: 'Keranjang Belanja' },
                        description: { 
                            en: 'Interactive shopping cart with add/remove items, quantity adjustment, and total calculation.',
                            id: 'Keranjang belanja interaktif dengan tambah/hapus item, penyesuaian jumlah, dan kalkulasi total.'
                        }
                    },
                    {
                        title: { en: 'Responsive Design', id: 'Desain Responsif' },
                        description: { 
                            en: 'Mobile-first design that works seamlessly across desktop, tablet, and mobile devices.',
                            id: 'Desain mobile-first yang bekerja dengan mulus di desktop, tablet, dan perangkat mobile.'
                        }
                    },
                    {
                        title: { en: 'User Interface', id: 'Antarmuka Pengguna' },
                        description: { 
                            en: 'Clean and intuitive user interface with smooth animations and modern design elements.',
                            id: 'Antarmuka pengguna yang bersih dan intuitif dengan animasi halus dan elemen desain modern.'
                        }
                    }
                ],
                images: [
                    'asset/E-commerce (1).png',
                    'asset/E-commerce (2).png',
                    'asset/E-commerce (3).png',
                    'asset/E-commerce (4).png',
                    'asset/E-commerce (5).png',
                    'asset/E-commerce (6).png'
                ],
                githubLink: 'https://github.com/ImamMahatirHasibuan/Web-Ecommerce',
                demoLink: 'https://web-ecommerce-beta.vercel.app/AboutPage.html'
            },
            project2: {
                title: {
                    en: 'LearnHub',
                    id: 'LearnHub'
                },
                description: {
                    en: 'LearnHub is a web-based online learning platform that allows users to join interactive courses, track their learning progress, earn certificates, and engage through discussion features. The website is designed with a modern and user-friendly interface to support an effective digital learning experience.',
                    id: 'LearnHub adalah platform pembelajaran online berbasis web yang memungkinkan pengguna untuk mengikuti kursus interaktif, melacak progres belajar, mendapatkan sertifikat, serta berinteraksi melalui fitur diskusi. Website ini dirancang dengan antarmuka modern dan user-friendly untuk mendukung pengalaman belajar digital yang efektif. yg ini juga.'
                },
                technologies: ['React', 'Tailwind'],
                features: [
                    {
                        title: { en: 'Dashboard LearnHub', id: 'Dashboard LearnHub' },
                        description: { 
                            en: 'Overview of courses, learning hours, certificates, and achievements.',
                            id: 'Ringkasan kursus, jam belajar, sertifikat, dan pencapaian.'
                        }
                    },
                    {
                        title: { en: 'Course List', id: 'Course List' },
                        description: { 
                            en: 'Browse & search courses, view progress, ratings, and details.',
                            id: 'Cari & pilih kursus, lihat progress, rating, dan detail kursus.'
                        }
                    },
                    {
                        title: { en: 'Profile', id: 'Profile' },
                        description: { 
                            en: 'User info, learning stats, certificates, and streak tracking.',
                            id: 'Data pengguna, statistik belajar, sertifikat, dan learning streak.'
                        }
                    },
                    {
                        title: { en: 'Course Detail', id: 'Course Detail' },
                        description: { 
                            en: 'Course content list with progress status.',
                            id: 'Daftar materi kursus dengan status progres.'
                        }
                    },
                    {
                        title: { en: 'Video Player', id: 'Video Player' },
                        description: { 
                            en: 'Learn through interactive video lessons.',
                            id: 'Belajar lewat video interaktif.'
                        }
                    },
                    {
                        title: { en: 'Quiz', id: 'Quiz' },
                        description: { 
                            en: 'Interactive quizzes for knowledge evaluation.',
                            id: 'Kuis interaktif untuk evaluasi pembelajaran.'
                        }
                    }
                ],
                images: [
                    'asset/LearnHub (1).png',
                    'asset/LearnHub (2).png',
                    'asset/LearnHub (3).png',
                    'asset/LearnHub (4).png',
                    'asset/LearnHub (5).png'
                ],
                githubLink: 'https://github.com/ImamMahatirHasibuan/LearnHub',
                demoLink: 'https://hci-kelas.vercel.app/'
            },
            project3: {
                title: {
                    en: 'Emotion Detection',
                    id: 'Pendeteksi Emosi'
                },
                description: {
                    en: 'a web-based application that detects human emotions from images or webcam captures. The system leverages a deep learning model to classify facial expressions into categories such as Happy, Sad, Surprise, Angry, Neutral, and more. The application is designed with a simple and user-friendly interface to ensure ease of use.',
                    id: 'aplikasi berbasis web yang dapat mendeteksi emosi manusia dari gambar atau tangkapan webcam. Sistem ini menggunakan model deep learning untuk mengklasifikasikan ekspresi wajah menjadi beberapa kategori seperti Happy, Sad, Surprise, Angry, Neutral, dan lainnya. Aplikasi ini dirancang dengan antarmuka sederhana agar mudah digunakan oleh siapa saja.'
                },
                technologies: ['Python', 'Flask', 'TensorFlow', 'HTML', 'CSS'],
                features: [
                    {
                        title: { en: 'Webcam Capture', id: 'Webcam Capture' },
                        description: { 
                            en: 'Capture images directly from the webcam.',
                            id: 'Ambil gambar langsung dari kamera.'
                        }
                    },
                    {
                        title: { en: 'Image Upload', id: 'Image Upload' },
                        description: { 
                            en: 'Upload photos from device for analysis.',
                            id: 'Unggah foto dari perangkat untuk analisis.'
                        }
                    },
                    {
                        title: { en: 'Emotion Prediction', id: 'Emotion Prediction' },
                        description: { 
                            en: 'Display emotion prediction results (text + label).',
                            id: 'Menampilkan hasil prediksi emosi (teks + label).'
                        }
                    },
                    {
                        title: { en: 'Image Preview', id: 'Image Preview' },
                        description: { 
                            en: 'Show captured/uploaded image with detected emotion.',
                            id: 'Menampilkan foto hasil tangkapan/upload dengan emosi terdeteksi.'
                        }
                    }
                ],
                images: [
                    'asset/EmotionDetection.jpg',
                    'asset/EmotionDetection2.jpg',
                    'asset/EmotionDetection3.jpg',
                    'asset/EmotionDetection4.jpg',
                    'asset/EmotionDetection5.jpg'
                ],
                githubLink: 'https://github.com/ImamMahatirHasibuan/EmotionDetection',
            },
            project4: {
                title: {
                    en: 'Fake News Detection',
                    id: 'Deteksi Berita Palsu'
                },
                description: {
                    en: 'FakeNewsDetection is a machine learning project that classifies news articles as fake or real. The system leverages a news dataset with an NLP (Natural Language Processing) model to analyze linguistic patterns in articles and predict their authenticity.',
                    id: 'FakeNewsDetection adalah proyek machine learning untuk mengklasifikasikan berita sebagai palsu atau asli. Sistem ini menggunakan dataset berita dengan model NLP (Natural Language Processing) untuk mendeteksi pola bahasa pada artikel berita dan memprediksi keasliannya.'
                },
                technologies: ['Python (Flask)', 'Scikit-learn', 'TensorFlow/Keras', 'Pandas, Numpy, Matplotlib', 'HTML', 'CSS'],
                features: [
                    {
                        title: { en: 'News Input', id: 'Input Berita' },
                        description: { 
                            en: 'Users can enter news text.',
                            id: 'Pengguna dapat memasukkan teks berita.'
                        }
                    },
                    {
                        title: { en: 'News Classification', id: 'Klasifikasi Berita' },
                        description: { 
                            en: 'Predicts whether the news is fake or real.',
                            id: 'Sistem memprediksi apakah berita palsu atau asli.'
                        }
                    },
                    {
                        title: { en: 'NLP Analysis', id: 'Analisis NLP' },
                        description: { 
                            en: 'Uses natural language processing to understand text patterns..',
                            id: 'Menggunakan pemrosesan bahasa alami untuk memahami pola teks.'
                        }
                    },
                    {
                        title: { en: 'Result Visualization', id: 'Visualisasi Hasil' },
                        description: { 
                            en: 'Displays classification results in a simple format.',
                            id: 'Menyajikan hasil klasifikasi dengan tampilan sederhana.'
                        }
                    }
                ],
                images: [
                    'asset/FakenewsDetection (1).png',
                    'asset/FakenewsDetection (2).png',
                    'asset/FakenewsDetection (3).png',
                    'asset/FakenewsDetection (4).png'
                ],
                githubLink: 'https://github.com/ImamMahatirHasibuan/EmotionDetection',
            },
            project5: {
                title: {
                    en: 'Facial Absence',
                    id: 'Absensi Wajah'
                },
                description: {
                    en: 'AbsensiWajah is a machine learning-based application designed to automatically record student attendance using face recognition technology. The system uses a camera to detect faces and store attendance data into a database, making the attendance process faster, more accurate, and efficient.',
                    id: 'AbsensiWajah adalah aplikasi berbasis machine learning yang digunakan untuk mencatat kehadiran mahasiswa secara otomatis menggunakan teknologi pengenalan wajah. Sistem ini memanfaatkan kamera untuk mendeteksi wajah dan menyimpan data absensi ke dalam basis data, sehingga proses absensi lebih cepat, akurat, dan efisien.'
                },
                technologies: ['Python (Flask)', 'OpenCV', 'TensorFlow'],
                features: [
                    {
                        title: { en: 'Real-time Face Detection', id: 'Deteksi Wajah Real-time' },
                        description: { 
                            en: 'Detects user faces directly via camera.',
                            id: 'Sistem mendeteksi wajah pengguna langsung melalui kamera.'
                        }
                    },
                    {
                        title: { en: 'Face Recognition', id: 'Pengenalan Wajah' },
                        description: { 
                            en: 'Identifies registered faces stored in the database.',
                            id: 'Mengenali wajah yang sudah terdaftar di database.'
                        }
                    },
                    {
                        title: { en: 'Automatic Attendance Recording', id: 'Pencatatan Absensi Otomatis' },
                        description: { 
                            en: 'Saves attendance data automatically without manual input.',
                            id: 'Menyimpan data kehadiran ke file/database tanpa input manual.'
                        }
                    },
                    {
                        title: { en: 'Attendance History', id: 'Riwayat Absensi' },
                        description: { 
                            en: 'Displays previously recorded attendance data.',
                            id: 'Menampilkan data absensi yang sudah tercatat sebelumnya.'
                        }
                    }
                ],
                images: [
                    'asset/AbsensiWajah (1).png',
                    'asset/AbsensiWajah (2).png',
                    'asset/AbsensiWajah (3).png',
                    'asset/AbsensiWajah (4).png'
                ],
                githubLink: 'https://github.com/ImamMahatirHasibuan/EmotionDetection',
            },
            project6: {
                title: {
                    en: 'Food Bridge',
                    id: 'Jembatan Makanan'
                },
                description: {
                    en: 'a web-based food donation management platform designed to connect food surpluses from donors (such as restaurants, stores, or catering services) with recipients (like orphanages, charities, or food banks) and facilitate the pickup/delivery process through volunteers. The goal is to reduce food waste, combat hunger, and build a more responsible community.',
                    id: 'platform manajemen donasi makanan berbasis web yang dirancang untuk mempertemukan kelebihan makanan dari donatur (seperti restoran, toko, atau katering) dengan penerima donasi (seperti panti asuhan, yayasan amal, atau bank makanan) dan memfasilitasi proses penjemputan/pengiriman melalui sukarelawan. Tujuannya adalah mengurangi pemborosan makanan, melawan kelaparan, dan membangun komunitas yang lebih bertanggung jawab.'
                },
                technologies: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL', 'XAMPP'],
                features: [
                    {
                        title: { en: 'Role-Based Authentication', id: 'Otentikasi Berbasis Peran' },
                        description: { 
                            en: 'A login and registration system that segments users into four main roles: Food Donor, Food Recipient, Volunteer, and Admin. Each role has unique dashboard access and functionalities.',
                            id: 'Sistem login dan registrasi yang memisahkan pengguna menjadi empat peran utama: Food Donor, Food Recipient, Volunteer, dan Admin. Setiap peran memiliki akses dan fungsionalitas dashboard yang unik.'
                        }
                    },
                    {
                        title: { en: 'Food Donation Management', id: 'Manajemen Donasi Makanan' },
                        description: { 
                            en: 'Food Donors can easily create, edit, and publish new donations (detailing food type, quantity, pickup time, and expiry time). Donations automatically have an available status and are visible on the recipient dashboard.',
                            id: 'Donor Makanan dapat dengan mudah membuat, mengedit, dan mempublikasikan donasi baru (dengan detail jenis makanan, kuantitas, waktu penjemputan, dan waktu kedaluwarsa). Donasi akan otomatis memiliki status available dan terlihat di dashboard penerima.'
                        }
                    },
                    {
                        title: { en: 'Volunteer Assignment', id: 'Penugasan Sukarelawan' },
                        description: { 
                            en: 'The system allows donors/admins to assign a Volunteer to pick up the claimed donation and deliver it to the recipient. Volunteers receive detailed route information.',
                            id: 'Sistem memungkinkan donor/admin untuk menetapkan Sukarelawan untuk mengambil donasi yang telah diklaim dan mengirimkannya kepada penerima. Sukarelawan akan mendapatkan rincian rute.'
                        }
                    },
                    {
                        title: { en: 'Donation Claim by Recipient', id: 'Klaim Donasi oleh Penerima' },
                        description: { 
                            en: 'Food Recipients can view the list of available donations and claim the ones they need. The donation status changes from available to claimed.',
                            id: 'Penerima Makanan dapat melihat daftar donasi yang tersedia dan mengklaim donasi yang mereka butuhkan. Status donasi akan berubah dari available menjadi claimed.'
                        }
                    }
                ],
                images: [
                    'asset/FoodBridge (1).png',
                    'asset/FoodBridge (2).png',
                    'asset/FoodBridge (3).png',
                    'asset/FoodBridge (4).png'
                ],
                githubLink: 'https://github.com/ImamMahatirHasibuan/FoodBridge',
            }
        };

        // Setup modal close functionality
        this.setupModalEvents();
    }

    // Setup modal events
    setupModalEvents() {
        // Tombol close (✕)
        const closeBtn = document.getElementById('closeProjectModal');
        if (closeBtn) {
            closeBtn.onclick = () => this.closeProjectModal();
        }

        // Klik area gelap di luar modal-content
        const modal = document.getElementById('projectModal');
        if (modal) {
            modal.onclick = (e) => {
                if (e.target === modal) {
                    this.closeProjectModal();
                }
            };
        }

        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeProjectModal();
            }
        });
    }

    // Open project modal
    openProjectModal(projectId) {
        const project = this.projectData[projectId];
        if (!project) return;

        const lang = this.currentLanguage;
        const modal = document.getElementById('projectModal');
        const modalBody = document.getElementById('modalBody');

        // Only show demo link if available
        let demoLinkHtml = '';
        if (project.demoLink) {
            demoLinkHtml = `
                <a href="${project.demoLink}" target="_blank" class="modal-link">
                    <i class="fas fa-external-link-alt"></i>
                    ${lang === 'en' ? 'Live Demo' : 'Demo Langsung'}
                </a>
            `;
        }

        const modalContent = `
            <div class="modal-project">
                <div class="modal-header">
                    <h2>${project.title[lang]}</h2>
                    <div class="project-meta">
                        <span><i class="fas fa-code"></i> ${project.technologies.length} Technologies</span>
                        <span><i class="fas fa-image"></i> ${project.images.length} Screenshots</span>
                    </div>
                    <div class="project-tech">
                        ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                </div>

                <div class="modal-gallery">
                    <div class="modal-gallery-main">
                        <img id="modalMainImage" src="${project.images[0]}" alt="${project.title[lang]}">
                        <button class="modal-gallery-nav prev" onclick="portfolio.changeModalImage(-1)">&#10094;</button>
                        <button class="modal-gallery-nav next" onclick="portfolio.changeModalImage(1)">&#10095;</button>
                    </div>
                    <div class="modal-gallery-thumbs">
                        ${project.images.map((img, index) => 
                            `<img src="${img}" alt="Screenshot ${index + 1}" 
                             onclick="portfolio.setModalImage(${index})" 
                             class="${index === 0 ? 'active' : ''}">`
                        ).join('')}
                    </div>
                </div>

                <div class="modal-description">
                    <h3>${lang === 'en' ? 'Project Overview' : 'Gambaran Proyek'}</h3>
                    <p>${project.description[lang]}</p>
                </div>

                <div class="modal-features">
                    ${project.features.map(feature => `
                        <div class="feature-item">
                            <h4>${feature.title[lang]}</h4>
                            <p>${feature.description[lang]}</p>
                        </div>
                    `).join('')}
                </div>

                <div class="modal-links">
                    <a href="${project.githubLink}" target="_blank" class="modal-link">
                        <i class="fab fa-github"></i>
                        ${lang === 'en' ? 'View Source Code' : 'Lihat Kode Sumber'}
                    </a>
                    ${demoLinkHtml}
                </div>
            </div>
        `;

        modalBody.innerHTML = modalContent;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';

        // Initialize modal image gallery
        this.currentModalImageIndex = 0;
        this.currentModalImages = project.images;
    }

    // Close project modal
    closeProjectModal() {
        const modal = document.getElementById('projectModal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Change modal image
    changeModalImage(direction) {
        this.currentModalImageIndex += direction;
        
        if (this.currentModalImageIndex >= this.currentModalImages.length) {
            this.currentModalImageIndex = 0;
        } else if (this.currentModalImageIndex < 0) {
            this.currentModalImageIndex = this.currentModalImages.length - 1;
        }

        this.setModalImage(this.currentModalImageIndex);
    }

    // Set specific modal image
    setModalImage(index) {
        this.currentModalImageIndex = index;
        const mainImage = document.getElementById('modalMainImage');
        const thumbs = document.querySelectorAll('.modal-gallery-thumbs img');

        if (mainImage) {
            mainImage.src = this.currentModalImages[index];
        }
        
        thumbs.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
    }

    // Setup scroll to top button
    setupScrollToTop() {
        const scrollToTopBtn = document.getElementById('scroll-to-top');
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Setup zoom animation on scroll
    setupZoomOnScroll() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.transform = 'scale(1)';
                    entry.target.style.opacity = '1';
                } else {
                    entry.target.style.transform = 'scale(0.95)';
                    entry.target.style.opacity = '0.8';
                }
            });
        }, observerOptions);

        // Observe elements for zoom animation
        const elementsToObserve = [
            '.education-card',
            '.skill-card',
            '.activity-card',
            '.project-card',
            '.certificate-card',
            '.contact-card',
            '.description-card'
        ];

        elementsToObserve.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                element.style.transform = 'scale(0.95)';
                element.style.opacity = '0.8';
                observer.observe(element);
            });
        });
    }

    // Start all advanced features
    startAdvancedFeatures() {
        setTimeout(() => {
            this.addFloatingAnimation();
            this.initParticleEffects();
            this.initTypewriterEffects();
            this.initAdvancedInteractions();
            this.createConstellations();
            this.initMouseTrail();
            this.optimizePerformance();
        }, 1000);
    }

    // Add floating animation to cards
    addFloatingAnimation() {
        const floatingElements = document.querySelectorAll('.skill-card, .contact-card');
        
        floatingElements.forEach((element, index) => {
            element.style.animation = `float 3s ease-in-out infinite ${index * 0.2}s`;
        });

        // Add floating keyframes if not exists
        if (!document.querySelector('#floating-keyframes')) {
            const style = document.createElement('style');
            style.id = 'floating-keyframes';
            style.textContent = `
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    33% { transform: translateY(-10px) rotate(1deg); }
                    66% { transform: translateY(5px) rotate(-1deg); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Add particle effect on hover
    addParticleEffect(element) {
        const rect = element.getBoundingClientRect();
        const particles = [];

        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.width = '4px';
            particle.style.height = '4px';
            particle.style.background = '#a855f7';
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '9999';
            particle.style.left = (rect.left + rect.width / 2) + 'px';
            particle.style.top = (rect.top + rect.height / 2) + 'px';
            
            document.body.appendChild(particle);
            particles.push(particle);

            // Animate particle
            const angle = (Math.PI * 2 * i) / 10;
            const velocity = 2 + Math.random() * 2;
            let x = 0, y = 0;
            let opacity = 1;

            const animate = () => {
                x += Math.cos(angle) * velocity;
                y += Math.sin(angle) * velocity;
                opacity -= 0.02;

                particle.style.transform = `translate(${x}px, ${y}px)`;
                particle.style.opacity = opacity;

                if (opacity > 0) {
                    requestAnimationFrame(animate);
                } else {
                    if (document.body.contains(particle)) {
                        document.body.removeChild(particle);
                    }
                }
            };

            requestAnimationFrame(animate);
        }
    }

    // Initialize particle effects
    initParticleEffects() {
        const particleElements = document.querySelectorAll('.skill-card, .contact-card');
        
        particleElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.addParticleEffect(element);
            });
        });
    }

    // Add typewriter effect to main title
    typewriterEffect(element, text, speed = 100) {
        element.textContent = '';
        let i = 0;

        const typeChar = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeChar, speed);
            }
        };

        typeChar();
    }

    // Initialize typewriter effect for titles
    initTypewriterEffects() {
        const mainTitles = document.querySelectorAll('.main-title');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.animated) {
                    const originalText = entry.target.textContent;
                    this.typewriterEffect(entry.target, originalText, 150);
                    entry.target.dataset.animated = 'true';
                }
            });
        }, { threshold: 0.5 });

        mainTitles.forEach(title => {
            observer.observe(title);
        });
    }

    // Add glitch effect to ID card on special interactions
    addGlitchEffect(element) {
        element.classList.add('glitch-effect');
        
        // Add glitch CSS if not exists
        if (!document.querySelector('#glitch-styles')) {
            const style = document.createElement('style');
            style.id = 'glitch-styles';
            style.textContent = `
                .glitch-effect {
                    animation: glitch 0.3s linear 3;
                }
                
                @keyframes glitch {
                    0% { transform: translate(0); }
                    20% { transform: translate(-2px, 2px); }
                    40% { transform: translate(-2px, -2px); }
                    60% { transform: translate(2px, 2px); }
                    80% { transform: translate(2px, -2px); }
                    100% { transform: translate(0); }
                }
            `;
            document.head.appendChild(style);
        }

        setTimeout(() => {
            element.classList.remove('glitch-effect');
        }, 900);
    }

    // Add advanced interactions
    initAdvancedInteractions() {
        const idCard = document.getElementById('id-card');
        if (!idCard) return;
        
        let clickCount = 0;

        // Special effect on multiple clicks
        idCard.addEventListener('click', () => {
            clickCount++;
            if (clickCount >= 5) {
                this.addGlitchEffect(idCard);
                clickCount = 0;
            }
        });

        // Reset click count after timeout
        setInterval(() => {
            if (clickCount > 0) clickCount--;
        }, 2000);
    }

    // Add constellation effect between stars
    createConstellations() {
        const starsContainer = document.getElementById('stars');
        if (!starsContainer) return;
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.opacity = '0.3';
        
        starsContainer.appendChild(canvas);

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const drawConstellations = () => {
            const stars = document.querySelectorAll('.star.large');
            const starsArray = Array.from(stars).map(star => ({
                x: parseFloat(star.style.left) / 100 * canvas.width,
                y: parseFloat(star.style.top) / 100 * canvas.height
            }));

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = 'rgba(168, 85, 247, 0.2)';
            ctx.lineWidth = 0.5;

            // Connect nearby stars
            starsArray.forEach((star1, i) => {
                starsArray.slice(i + 1).forEach(star2 => {
                    const distance = Math.sqrt(
                        Math.pow(star2.x - star1.x, 2) + 
                        Math.pow(star2.y - star1.y, 2)
                    );
                    
                    if (distance < 150) {
                        ctx.beginPath();
                        ctx.moveTo(star1.x, star1.y);
                        ctx.lineTo(star2.x, star2.y);
                        ctx.stroke();
                    }
                });
            });
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        
        // Draw constellations after stars are created
        setTimeout(() => {
            drawConstellations();
        }, 1000);
    }

    // Initialize mouse trail effect
    initMouseTrail() {
        const trail = [];
        const trailLength = 20;

        document.addEventListener('mousemove', (e) => {
            trail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
            
            if (trail.length > trailLength) {
                trail.shift();
            }

            // Create trail particles
            if (Math.random() > 0.7) {
                const particle = document.createElement('div');
                particle.style.position = 'fixed';
                particle.style.width = '3px';
                particle.style.height = '3px';
                particle.style.background = 'rgba(168, 85, 247, 0.6)';
                particle.style.borderRadius = '50%';
                particle.style.pointerEvents = 'none';
                particle.style.zIndex = '9998';
                particle.style.left = e.clientX + 'px';
                particle.style.top = e.clientY + 'px';
                
                document.body.appendChild(particle);

                // Fade out particle
                let opacity = 0.6;
                const fadeOut = () => {
                    opacity -= 0.05;
                    particle.style.opacity = opacity;
                    
                    if (opacity > 0) {
                        requestAnimationFrame(fadeOut);
                    } else {
                        if (document.body.contains(particle)) {
                            document.body.removeChild(particle);
                        }
                    }
                };
                
                requestAnimationFrame(fadeOut);
            }
        });
    }

    // Performance optimization
    optimizePerformance() {
        // Throttle scroll events
        let scrollTimeout;
        const originalScrollHandler = window.onscroll;
        
        window.onscroll = () => {
            if (scrollTimeout) return;
            
            scrollTimeout = setTimeout(() => {
                if (originalScrollHandler) originalScrollHandler();
                scrollTimeout = null;
            }, 16); // ~60fps
        };

        // Lazy load images
        const images = document.querySelectorAll('img[src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        images.forEach(img => {
            if (img.src && img.src.includes('placeholder')) {
                imageObserver.observe(img);
            }
        });
    }
}

// Global functions for activity description modal
window.openActivityDesc = function(img) {
    const modal = document.getElementById('activity-modal');
    const modalImg = document.getElementById('modal-activity-img');
    const modalDesc = document.getElementById('modal-activity-desc');
    
    if (modal && modalImg && modalDesc) {
        modalImg.src = img.src;
        modalDesc.textContent = img.getAttribute('data-desc') || 'No description available.';
        modal.style.display = 'flex';
    }
}

// Certificate Modal Functions
function openCertificateModal(img, title) {
    const modal = document.getElementById('certificate-modal');
    const modalImg = document.getElementById('modal-certificate-img');
    const modalTitle = document.getElementById('modal-certificate-title');
    
    if (modal && modalImg && modalTitle) {
        modalImg.src = img.src;
        modalTitle.textContent = title || img.alt || 'Certificate';
        modal.style.display = 'flex';
    }
}

// Close Certificate Modal
document.getElementById('close-certificate-modal').onclick = function() {
    document.getElementById('certificate-modal').style.display = 'none';
};

// Close modal when clicking outside
document.getElementById('certificate-modal').onclick = function(e) {
    if (e.target === this) {
        this.style.display = 'none';
    }
};

// Close on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modal = document.getElementById('certificate-modal');
        if (modal && modal.style.display === 'flex') {
            modal.style.display = 'none';
        }
    }
});

// Email Modal Functions
window.openEmailModal = function() {
    const modal = document.getElementById('email-modal');
    if (modal) {
        modal.style.display = 'flex';
        
        // Set default values
        const subjectInput = document.getElementById('email-subject');
        const bodyInput = document.getElementById('email-body');
        
        if (subjectInput) subjectInput.value = 'Hello from Portfolio';
        if (bodyInput) bodyInput.value = 'Hi Imam,\n\nI found your portfolio and would like to connect.\n\nBest regards,';
    }
}

// Setup Email Modal Events
document.addEventListener('DOMContentLoaded', () => {
    // Close Email Modal
    const closeEmailModal = document.getElementById('close-email-modal');
    const cancelEmailBtn = document.getElementById('cancel-email-btn');
    const emailModal = document.getElementById('email-modal');
    
    if (closeEmailModal) {
        closeEmailModal.onclick = function() {
            emailModal.style.display = 'none';
        };
    }
    
    if (cancelEmailBtn) {
        cancelEmailBtn.onclick = function() {
            emailModal.style.display = 'none';
        };
    }

    // Send Email Function
    const sendEmailBtn = document.getElementById('send-email-btn');
    if (sendEmailBtn) {
        sendEmailBtn.onclick = function() {
            const to = document.getElementById('email-to').value;
            const subject = document.getElementById('email-subject').value;
            const body = document.getElementById('email-body').value;
            
            if (!subject.trim()) {
                alert('Please enter a subject');
                return;
            }
            
            if (!body.trim()) {
                alert('Please enter a message');
                return;
            }
            
            const encodedSubject = encodeURIComponent(subject);
            const encodedBody = encodeURIComponent(body);
            
            window.location.href = `mailto:${to}?subject=${encodedSubject}&body=${encodedBody}`;
            
            // Close modal after sending
            emailModal.style.display = 'none';
        };
    }

    // Close modal when clicking outside
    if (emailModal) {
        emailModal.onclick = function(e) {
            if (e.target === this) {
                this.style.display = 'none';
            }
        };
    }

    // Close on Escape key for email modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modal = document.getElementById('email-modal');
            if (modal && modal.style.display === 'flex') {
                modal.style.display = 'none';
            }
        }
    });
});

// Initialize the portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const portfolio = new GalaxyPortfolio();
    
    // Start advanced features after initial load
    portfolio.startAdvancedFeatures();
    
    // Add loading screen fade out
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 1s ease';
        document.body.style.opacity = '1';
    }, 100);

    // Setup activity modal close functionality
    const closeBtn = document.getElementById('close-activity-modal');
    const modal = document.getElementById('activity-modal');
    
    if (closeBtn && modal) {
        closeBtn.onclick = () => { 
            modal.style.display = 'none'; 
        };
        
        modal.onclick = function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        };
    }
});

// Handle page visibility for performance
document.addEventListener('visibilitychange', () => {
    const isVisible = !document.hidden;
    const animatedElements = document.querySelectorAll('.moving-star, .shooting-star');
    
    animatedElements.forEach(element => {
        element.style.animationPlayState = isVisible ? 'running' : 'paused';
    });
});