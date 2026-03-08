// Initialize AOS
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Three.js 3D Background
let scene, camera, renderer, objects = [];

function initThree() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    // Add geometric objects
    const geometry1 = new THREE.IcosahedronGeometry(1.5, 0);
    const material1 = new THREE.MeshPhongMaterial({
        color: 0x0071e3,
        wireframe: true,
        transparent: true,
        opacity: 0.5
    });
    const cube = new THREE.Mesh(geometry1, material1);
    scene.add(cube);
    objects.push(cube);

    const geometry2 = new THREE.OctahedronGeometry(1, 0);
    const material2 = new THREE.MeshPhongMaterial({
        color: 0x6e5cff,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const oct = new THREE.Mesh(geometry2, material2);
    oct.position.set(4, 2, -5);
    scene.add(oct);
    objects.push(oct);

    const geometry3 = new THREE.TorusGeometry(2, 0.1, 16, 100);
    const material3 = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.1
    });
    const torus = new THREE.Mesh(geometry3, material3);
    torus.position.set(-5, -2, -2);
    scene.add(torus);
    objects.push(torus);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    camera.position.z = 5;
}

function animate() {
    requestAnimationFrame(animate);

    objects.forEach((obj, i) => {
        obj.rotation.x += 0.005 * (i + 1);
        obj.rotation.y += 0.005 * (i + 1);
    });

    renderer.render(scene, camera);
}

// Mouse Movement Parallax
document.addEventListener('mousemove', (e) => {
    const mouseX = (e.clientX - window.innerWidth / 2) / 100;
    const mouseY = (e.clientY - window.innerHeight / 2) / 100;

    gsap.to(camera.position, {
        x: mouseX * 0.5,
        y: -mouseY * 0.5,
        duration: 2,
        ease: "power2.out"
    });
});

// Window Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// GSAP Entrance Animations
window.addEventListener('load', () => {
    initThree();
    animate();

    const tl = gsap.timeline();

    tl.from(".logo", { y: -50, opacity: 0, duration: 1, ease: "expo.out" })
        .from(".nav-links li", { y: -50, opacity: 0, stagger: 0.1, duration: 1, ease: "expo.out" }, "-=0.8")
        .from(".btn-primary", { scale: 0.8, opacity: 0, duration: 1, ease: "back.out(1.7)" }, "-=0.5");
});

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Counter Animation
const stats = document.querySelectorAll('.stat-number');
const obsOptions = { threshold: 0.5 };

const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = +entry.target.getAttribute('data-target');
            const count = () => {
                const current = parseInt(entry.target.innerText) || 0;
                const increment = target / 50;
                if (current < target) {
                    entry.target.innerText = Math.ceil(current + increment);
                    setTimeout(count, 30);
                } else {
                    entry.target.innerText = target + "+";
                }
            };
            count();
            observer.unobserve(entry.target);
        }
    });
}, obsOptions);

stats.forEach(stat => statsObserver.observe(stat));

// Portfolio Filtering
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                gsap.to(card, {
                    scale: 1,
                    opacity: 1,
                    duration: 0.4,
                    display: 'block'
                });
            } else {
                gsap.to(card, {
                    scale: 0.8,
                    opacity: 0,
                    duration: 0.4,
                    display: 'none'
                });
            }
        });
    });
});

// Modal Functionality
const modal = document.getElementById("image-modal");
const modalImg = document.getElementById("full-image");
const captionText = document.getElementById("caption");
const closeModal = document.querySelector(".close-modal");

projectCards.forEach(card => {
    card.addEventListener('click', () => {
        const img = card.querySelector('img');
        const h3 = card.querySelector('h3');

        modal.style.display = "block";
        modalImg.src = img.src;
        captionText.innerHTML = h3.innerHTML;

        // Lock scroll
        document.body.style.overflow = 'hidden';

        gsap.fromTo(modalImg,
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
        );
    });
});

const closeImageModal = () => {
    modal.style.display = "none";
    document.body.style.overflow = 'auto'; // Unlock scroll
};

closeModal.onclick = closeImageModal;

// Close on background click
modal.onclick = (e) => {
    if (e.target === modal) {
        closeImageModal();
    }
};

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === "Escape") {
        closeImageModal();
    }
});
