<template>
    <div class="layout-wrapper">
        <Sidebar/>
    
        <div class="content-wrapper">
            <Navbar/>
        
            <div class="main-content">
                <router-view/>
            </div>
        </div>
    </div>
</template>
<script>
    import Sidebar from './components/Layouts/Sidebar';
    import Navbar from './components/Layouts/Navbar';
    export default {
        components: {Navbar, Sidebar}
    }
</script>