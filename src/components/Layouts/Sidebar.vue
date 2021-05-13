<template>
    <div class="sidebar">
        <div class="sidebar-navigation">
            <div class="logo-wrapper">
                <img src="../../assets/img/logo.png" class="app-logo" alt="App logo">
            </div>
            <ul class="navigation">
                <li class="navigation-item" v-for="(item, index) in navItems">
                    <router-link :to="item.url"
                                 class="navigation-link"
                                 active-class="active"
                                 @click="getPageTitle(item.pageTitle)">
                        <span class="navigation-icon">
                            <i :class="`bi ${item.icon}`"/>
                        </span>
                    </router-link>
                    <div class="navigation-item-details"
                         :class="{'has-submenu': item.submenu}">
                        <a href="#" class="navigation-title">
                            {{ item.title }}
                            <i v-if="item.submenu" class="bi bi-chevron-down"/>
                        </a>
                        <ul v-if="item.submenu" class="navigation-item-submenu">
                            <li class="submenu-item" v-for="(subItem, index) in item.submenu">
                                <a :href="subItem.url" class="submenu-link">
                                    {{ subItem.title }}
                                </a>
                            </li>
                        </ul>
                    </div>
                </li>
            </ul>
        </div>
        <div class="sidebar-navigation-details">
            <div class="page-intro">
                <h3 class="page-title">{{ pageTitle }}</h3>
                <button type="button" class="btn btn-add">
                    <i class="bi bi-plus-lg"></i>
                </button>
            </div>
        </div>
    </div>
    <div class="sidebar-overlay" @click.prevent="toggleSidebar"/>
</template>

<script>
    export default {
        name: 'Sidebar',
        data() {
            return {
                navItems: [
                    {
                        icon: 'bi-house-door',
                        title: 'dashboard',
                        pageTitle: 'dashboard',
                        url: '/dashboard'
                    },
                    {
                        icon: 'bi-chat-dots',
                        title: 'in process',
                        pageTitle: 'projects',
                        url: '/',
                        submenu: [
                            {title: 'web app', url: '#'},
                            {title: 'blogar', url: '#'},
                            {title: 'app design', url: '#'}
                        ]
                    },
                    {
                        icon: 'bi-clipboard-data',
                        title: 'overview',
                        pageTitle: 'overview',
                        url: '/overview'
                    },
                    {
                        icon: 'bi-folder',
                        title: 'storage',
                        pageTitle: 'storage',
                        url: '/storage'
                    },
                    {
                        icon: 'bi-envelope',
                        title: 'email',
                        pageTitle: 'email',
                        url: '/email'
                    },
                    {
                        icon: 'bi-person',
                        title: 'users',
                        pageTitle: 'users',
                        url: '/users'
                    },
                ],
                pageTitle: 'Projects'
            }
        },
        methods: {
            getPageTitle(title) {
                this.pageTitle = title;
            },
            toggleSidebar() {
                let sidebar = document.querySelector('.sidebar');
                sidebar.classList.toggle('sidebar-open')
            }
        }
    }
</script>