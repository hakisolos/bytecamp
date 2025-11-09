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
    document.getElementById('greeting').textContent = "Welcome to ByteCamp";
    document.getElementById('profileName').textContent = guestData.name;
    document.getElementById('profileRole').textContent = `${guestData.role} at ByteCamp`;
    document.getElementById('learningLevel').textContent = guestData.learningLevel;
    document.getElementById('userPoints').textContent = guestData.points.toLocaleString();
    document.getElementById('learningStreak').textContent = `${guestData.streak} days`;

    document.getElementById('activeCourses').textContent = guestData.stats.activeCourses;
    document.getElementById('completedCourses').textContent = guestData.stats.completedCourses;
    document.getElementById('learningHours').textContent = guestData.stats.learningHours;
    document.getElementById('monthlyGoal').textContent = `${guestData.stats.monthlyGoal}%`;
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
                initials: "AJ",
                color: "blue"
            },
            time: "2 hours ago",
            message: "Just completed the JavaScript course!"
        },
        {
            user: {
                name: "Haki",
                initials: "SW",
                color: "green"
            },
            time: "5 hours ago",
            message: "Started learning React today. Excited!"
        }
    ]);
}

document.addEventListener('DOMContentLoaded', function () {
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const sidebar = document.querySelector('.sidebar');
    const userMenuButton = document.getElementById('userMenuButton');
    const userDropdown = document.getElementById('userDropdown');

    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', () => {
            sidebar.classList.toggle('sidebar-mobile-open');
        });
    }

    if (userMenuButton) {
        userMenuButton.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.classList.toggle('hidden');
        });
    }

    document.addEventListener('click', () => {
        userDropdown.classList.add('hidden');
    });

    document.addEventListener('click', (event) => {
        const isClickInsideSidebar = sidebar.contains(event.target);
        const isClickInsideMobileMenuButton = mobileMenuButton.contains(event.target);

        if (!isClickInsideSidebar && !isClickInsideMobileMenuButton && window.innerWidth < 768) {
            sidebar.classList.remove('sidebar-mobile-open');
        }
    });

    initializeGuestData();

    document.getElementById('loginButton').addEventListener('click', function (e) {
        e.preventDefault();
        alert('Login functionality would go here. In a real app, this would redirect to a login page.');
    });
});

function renderCurrentCourses(courses) {
    const container = document.getElementById('currentCoursesList');
    container.innerHTML = '';

    courses.forEach(course => {
        const courseElement = document.createElement('div');
        courseElement.className = 'p-6 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-all duration-300';
        courseElement.innerHTML = `
                    <div class="flex justify-between items-start">
                        <div class="flex-1">
                            <h3 class="text-lg font-medium text-gray-900">${course.title}</h3>
                            <p class="text-sm text-gray-500 mt-1">${course.description}</p>
                        </div>
                        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${course.color}-100 text-${course.color}-800 ml-4">
                            ${course.progress}% Complete
                        </span>
                    </div>
                    <div class="mt-4">
                        <div class="w-full bg-gray-200 rounded-full h-2">
                            <div class="bg-${course.color}-600 h-2 rounded-full progress-bar" style="width: ${course.progress}%"></div>
                        </div>
                    </div>
                    <div class="mt-4 flex justify-between text-sm text-gray-500">
                        <span>${course.completedLessons}/${course.totalLessons} lessons</span>
                        <span>Next: ${course.nextLesson}</span>
                    </div>
                    <div class="mt-4">
                        <button class="w-full bg-white border border-${course.color}-600 text-${course.color}-600 py-2 px-4 rounded-lg hover:bg-${course.color}-50 transition-colors">
                            Continue Learning
                        </button>
                    </div>
                `;
        container.appendChild(courseElement);
    });
}

function renderRecommendedCourses(courses) {
    const container = document.getElementById('recommendedCourses');
    container.innerHTML = '';

    courses.forEach(course => {
        const courseElement = document.createElement('div');
        courseElement.className = 'p-6 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-all duration-300';
        courseElement.innerHTML = `
                    <h3 class="text-md font-medium text-gray-900">${course.title}</h3>
                    <p class="text-sm text-gray-500 mt-1">${course.description}</p>
                    <div class="mt-3 flex items-center text-sm text-gray-500">
                        <i class="fas fa-clock mr-1"></i>
                        <span>${course.duration}</span>
                        <span class="mx-2">•</span>
                        <span>${course.difficulty}</span>
                    </div>
                    <button class="mt-4 w-full bg-white border border-blue-600 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors">
                        Explore Course
                    </button>
                `;
        container.appendChild(courseElement);
    });
}

function renderCommunityActivity(activities) {
    const container = document.getElementById('communityActivity');
    container.innerHTML = '';

    activities.forEach(activity => {
        const activityElement = document.createElement('div');
        activityElement.className = 'p-6 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-all duration-300';
        activityElement.innerHTML = `
                    <div class="flex">
                        <div class="h-10 w-10 rounded-full bg-gradient-to-r from-${activity.user.color}-500 to-${activity.user.color}-600 flex items-center justify-center text-white font-bold shadow-md">
                            ${activity.user.initials}
                        </div>
                        <div class="ml-4">
                            <div class="flex items-center">
                                <p class="text-sm font-medium text-gray-900">${activity.user.name}</p>
                                <span class="ml-2 text-xs text-gray-500">${activity.time}</span>
                            </div>
                            <p class="text-sm text-gray-600 mt-1">${activity.message}</p>
                            <div class="mt-2 flex space-x-4">
                                <button class="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                                    <i class="fas fa-thumbs-up mr-1"></i> Like
                                </button>
                                <button class="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                                    <i class="fas fa-comment mr-1"></i> Comment
                                </button>
                            </div>
                        </div>
                    </div>
                `;
        container.appendChild(activityElement);
    });
}