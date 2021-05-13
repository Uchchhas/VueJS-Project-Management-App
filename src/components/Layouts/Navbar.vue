<template>
    <div class="navbar">
        <button type="button"
                class="btn-toggle-sidebar"
                @click.prevent="toggleSidebar">
            <i class="bi bi-list"></i>
        </button>
        <div class="navbar-search">
            <div class="search-form">
                <i class="bi bi-search"></i>
                <input type="search" placeholder="Search">
            </div>
        </div>
        <div class="navbar-menu">
            <ul class="navigation">
                <li class="navigation-item">
                    <div class="dropdown dropdown-notification">
                        <a href="#" class="navigation-link">
                            <i class="bi bi-bell-fill notification-icon"></i>
                            <span class="notification-counter">3</span>
                        </a>
                        <div class="dropdown-content">
                            <a href="#" class="dropdown-link">
                                <img src="../../assets/img/users/1.jpg" alt="">
                                <span class="content">
                                    <span class="title">
                                        <span>John Doe</span>
                                        <small class="time">10 mins ago</small>
                                    </span>
                                    <small>Lorem ipsum dolor sit...</small>
                                </span>
                            </a>
                            <a href="#" class="dropdown-link">
                                <img src="../../assets/img/users/2.jpg" alt="">
                                <span class="content">
                                    <span class="title">
                                        <span>John Doe</span>
                                        <small class="time">Yesterday</small>
                                    </span>
                                    <small>Lorem ipsum dolor sit...</small>
                                </span>
                            </a>
                            <a href="#" class="dropdown-link">
                                <img src="../../assets/img/users/3.jpg" alt="">
                                <span class="content">
                                    <span class="title">
                                        <span>John Doe</span>
                                        <small class="time">5 days ago</small>
                                    </span>
                                    <small>Lorem ipsum dolor sit...</small>
                                </span>
                            </a>
                        </div>
                    </div>
                </li>
                <li class="navigation-item">
                    <div class="dropdown dropdown-profile">
                        <a href="#" class="navigation-link">
                            <span class="profile-avatar">
                                <img src="../../assets/img/users/5.jpg" alt="">
                                <span class="status"/>
                            </span>
                            <span class="profile-name">Jems Anderson</span>
                        </a>
                        <div class="dropdown-content">
                            <a href="#" class="dropdown-link">
                                <i class="bi bi-person-circle"></i> Profile
                            </a>
                            <a href="#" class="dropdown-link">
                                <i class="bi bi-gear"></i> Settings
                            </a>
                            <a href="#" class="dropdown-link">
                                <i class="bi bi-box-arrow-right"></i> Logout
                            </a>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Navbar',
        methods: {
            toggleSidebar() {
                let sidebar = document.querySelector('.sidebar');
                sidebar.classList.toggle('sidebar-open')
            }
        }
    }
</script>