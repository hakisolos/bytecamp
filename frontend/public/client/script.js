// Theme Toggle with System Default
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Check for saved theme preference or default to system preference
const savedTheme = localStorage.getItem('theme');
let currentTheme;

if (savedTheme) {
    currentTheme = savedTheme;
} else {
    // Check system preference
    currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

html.classList.toggle('dark', currentTheme === 'dark');

themeToggle.addEventListener('click', () => {
    html.classList.toggle('dark');
    const isDark = html.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Listen for system theme changes if no saved preference
if (!savedTheme) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            html.classList.toggle('dark', e.matches);
        }
    });
}

// Mobile Menu Toggle - Swipe Functionality
const sidebar = document.getElementById('sidebar');
let touchStartX = 0;
let touchEndX = 0;
let isSwiping = false;

// Show notification on mobile
function showSwipeNotification() {
    const notification = document.getElementById('swipeNotification');
    if (window.innerWidth < 768 && !localStorage.getItem('swipeNotificationShown')) {
        notification.classList.remove('hidden');
        notification.classList.add('slide-in-notification');

        setTimeout(() => {
            notification.classList.add('fade-out-notification');
            setTimeout(() => {
                notification.classList.add('hidden');
                notification.classList.remove('fade-out-notification', 'slide-in-notification');
            }, 500);
        }, 4000);

        localStorage.setItem('swipeNotificationShown', 'true');
    }
}

// Swipe detection
function handleTouchStart(e) {
    if (window.innerWidth >= 768) return;
    touchStartX = e.changedTouches[0].screenX;
    isSwiping = true;
}

function handleTouchMove(e) {
    if (!isSwiping || window.innerWidth >= 768) return;
    touchEndX = e.changedTouches[0].screenX;
}

function handleTouchEnd() {
    if (!isSwiping || window.innerWidth >= 768) return;
    isSwiping = false;

    const swipeDistance = touchEndX - touchStartX;
    const screenMiddle = window.innerWidth / 2;

    // Swipe right from left half of screen to open
    if (touchStartX < screenMiddle && swipeDistance > 80) {
        sidebar.classList.remove('-translate-x-full');
    }

    // Swipe left to close
    if (swipeDistance < -80 && !sidebar.classList.contains('-translate-x-full')) {
        sidebar.classList.add('-translate-x-full');
    }
}

// Add touch event listeners
document.addEventListener('touchstart', handleTouchStart, { passive: true });
document.addEventListener('touchmove', handleTouchMove, { passive: true });
document.addEventListener('touchend', handleTouchEnd, { passive: true });

// Close sidebar when clicking outside
document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target)) {
        if (window.innerWidth < 768) {
            sidebar.classList.add('-translate-x-full');
        }
    }
});

// Show notification after page loads
setTimeout(showSwipeNotification, 1000);

// User Dropdown Menu
const userMenuButton = document.getElementById('userMenuButton');
const userDropdown = document.getElementById('userDropdown');

userMenuButton.addEventListener('click', (e) => {
    e.stopPropagation();
    userDropdown.classList.toggle('hidden');
});

document.addEventListener('click', (e) => {
    if (!userDropdown.contains(e.target) && !userMenuButton.contains(e.target)) {
        userDropdown.classList.add('hidden');
    }
});

// Initialize Guest Data
function initializeGuestData() {
    const guestData = {
        name: "Haki",
        role: "C.E.O",
        learningLevel: "Pro",
        points: 0,
        streak: 0,
        stats: {
            activeCourses: 0,
            completedCourses: 0,
            learningHours: 0,
            monthlyGoal: 0
        }
    };

    document.getElementById('sidebarUserName').textContent = guestData.name;
    document.getElementById('sidebarUserRole').textContent = guestData.role;
    document.getElementById('greeting').textContent = `Welcome, ${guestData.name}!`;
    document.getElementById('profileName').textContent = guestData.name;
    document.getElementById('profileRole').textContent = `${guestData.role} at ByteCamp`;
    document.getElementById('learningLevel').textContent = guestData.learningLevel;
    document.getElementById('userPoints').textContent = guestData.points.toLocaleString();
    document.getElementById('learningStreak').textContent = `${guestData.streak} days`;

    document.getElementById('activeCourses').textContent = guestData.stats.activeCourses;
    document.getElementById('completedCourses').textContent = guestData.stats.completedCourses;
    document.getElementById('learningHours').textContent = guestData.stats.learningHours;
    document.getElementById('monthlyGoalText').textContent = `${guestData.stats.monthlyGoal}%`;
    document.getElementById('monthlyGoalBar').style.width = `${guestData.stats.monthlyGoal}%`;

    renderRecommendedCourses([
        {
            title: "Introduction to Python",
            description: "Learn the basics of Python programming",
            duration: "4 hours",
            difficulty: "Beginner"
        },
        {
            title: "Web Development Fundamentals",
            description: "HTML, CSS, and JavaScript basics",
            duration: "6 hours",
            difficulty: "Beginner"
        },
        {
            title: "Data Science Essentials",
            description: "Introduction to data analysis and visualization",
            duration: "8 hours",
            difficulty: "Intermediate"
        }
    ]);

    renderCommunityActivity([
        {
            user: {
                name: "Haki",
                initials: "H",
                color: "bg-blue-100 dark:bg-blue-900 text-blue-600"
            },
            time: "2 hours ago",
            message: "Just completed the JavaScript course!"
        },
        {
            user: {
                name: "Haki",
                initials: "H",
                color: "bg-green-100 dark:bg-green-900 text-green-600"
            },
            time: "5 hours ago",
            message: "Started learning React today. Excited!"
        }
    ]);
}

// Render Recommended Courses
function renderRecommendedCourses(courses) {
    const container = document.getElementById('recommendedCourses');
    container.innerHTML = '';

    courses.forEach((course, index) => {
        const courseElement = document.createElement('div');
        courseElement.className = 'p-4 border-b border-border last:border-b-0 hover:bg-muted transition-colors cursor-pointer';
        courseElement.innerHTML = `
            <h3 class="text-sm font-semibold text-foreground">${course.title}</h3>
            <p class="text-xs text-muted-foreground mt-1">${course.description}</p>
            <div class="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span><i class="fas fa-clock mr-1"></i>${course.duration}</span>
                <span class="px-2 py-1 rounded-full bg-secondary text-secondary-foreground">${course.difficulty}</span>
            </div>
        `;
        container.appendChild(courseElement);
    });
}

// Render Community Activity
function renderCommunityActivity(activities) {
    const container = document.getElementById('communityActivity');
    container.innerHTML = '';

    activities.forEach(activity => {
        const activityElement = document.createElement('div');
        activityElement.className = 'p-4 border-b border-border last:border-b-0 hover:bg-muted transition-colors';
        activityElement.innerHTML = `
            <div class="flex gap-3">
                <div class="w-10 h-10 rounded-full ${activity.user.color} flex items-center justify-center text-xs font-semibold flex-shrink-0">
                    ${activity.user.initials}
                </div>
                <div class="flex-1">
                    <div class="flex items-center justify-between">
                        <p class="text-sm font-semibold text-foreground">${activity.user.name}</p>
                        <span class="text-xs text-muted-foreground">${activity.time}</span>
                    </div>
                    <p class="text-sm text-muted-foreground mt-1">${activity.message}</p>
                    <div class="mt-2 flex gap-4 text-xs">
                        <button class="text-muted-foreground hover:text-primary transition-colors">
                            <i class="fas fa-thumbs-up mr-1"></i>Like
                        </button>
                        <button class="text-muted-foreground hover:text-primary transition-colors">
                            <i class="fas fa-comment mr-1"></i>Comment
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(activityElement);
    });
}

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', initializeGuestData);